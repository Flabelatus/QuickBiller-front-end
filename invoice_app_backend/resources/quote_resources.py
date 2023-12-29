from typing import List

from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import abort, Blueprint
from db import db
from sqlalchemy.exc import SQLAlchemyError

from models import QuoteModel
from schema import QuotePlainSchema

quote_blueprint = Blueprint("Quotes", "quotes", description="Operations on quotes")


@quote_blueprint.route("/quotes")
class Quotes(MethodView):

    @jwt_required()
    @quote_blueprint.response(200, QuotePlainSchema(many=True))
    def get(self) -> List[QuoteModel]:
        return QuoteModel.query.all()

    @jwt_required()
    @quote_blueprint.arguments(QuotePlainSchema)
    @quote_blueprint.response(201, QuotePlainSchema)
    def post(self, parsed_data: dict) -> QuoteModel:
        quote = QuoteModel(**parsed_data)
        quote.user_id = get_jwt_identity()

        try:
            db.session.add(quote)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, message=str(err))

        return quote


@quote_blueprint.route("/quote/<int:quote_id>")
class QuoteByID(MethodView):

    @jwt_required()
    @quote_blueprint.response(200, QuotePlainSchema)
    def get(self, quote_id: int) -> QuoteModel:
        return QuoteModel.query.get_or_404(quote_id)

    @jwt_required()
    @quote_blueprint.arguments(QuotePlainSchema)
    @quote_blueprint.response(200, QuotePlainSchema)
    def patch(self, parsed_data: dict, quote_id: int) -> QuoteModel:
        quote = QuoteModel.query.get_or_404(quote_id)
        if quote:
            quote.logo = parsed_data.get("logo", "")
            quote.message = parsed_data.get("message", "")
            quote.valid_date = parsed_data.get("valid_date", "")
            quote.quote_date = parsed_data.get("quote_date", "")
            quote.quote_number = parsed_data.get("quote_number", "")
            quote.receiver_data = parsed_data.get("receiver_data", "")
            quote.sender_data = parsed_data.get("sender_data", "")
            quote.job_data = parsed_data.get("job_data", "")

        db.session.add(quote)
        db.session.commit()

        return quote


@quote_blueprint.route("/user/quotes")
class QuotesByUserID(MethodView):

    @jwt_required()
    @quote_blueprint.response(200, QuotePlainSchema(many=True))
    def get(self) -> List[QuoteModel]:
        user_id = get_jwt_identity()
        quote = QuoteModel.query.filter_by(user_id=user_id).order_by(QuoteModel.created_at.desc()).all()
        if quote:
            return quote
        else:
            abort(404, message="no invoices found with this user id")


@quote_blueprint.route("/user/quote")
class QuoteByUserID(MethodView):

    @jwt_required()
    @quote_blueprint.response(200, QuotePlainSchema)
    def get(self) -> QuoteModel:
        user_id = get_jwt_identity()
        quote = QuoteModel.query.filter_by(user_id=user_id).order_by(QuoteModel.created_at.desc()).first()
        if quote:
            return quote
        else:
            abort(404, message="no invoices found with this user id")
