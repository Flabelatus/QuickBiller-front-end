from typing import List

from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import abort, Blueprint
from db import db
from sqlalchemy.exc import SQLAlchemyError

from models import PastClientsModel
from schema import PastClientsSchema

past_client_blp = Blueprint("Past Clients", "past_clients", description="Operations on the past clients list")


@past_client_blp.route("/clients")
class Clients(MethodView):
    @jwt_required()
    @past_client_blp.response(200, PastClientsSchema(many=True))
    def get(self) -> List[PastClientsSchema]:
        user_id = get_jwt_identity()
        past_clients = PastClientsModel.query.filter_by(user_id=user_id).all()
        return past_clients

    @jwt_required()
    @past_client_blp.arguments(PastClientsSchema)
    @past_client_blp.response(201, PastClientsSchema)
    def put(self, parsed_data: dict):
        past_client = PastClientsModel(**parsed_data)
        try:
            db.session.add(past_client)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, exc=SQLAlchemyError, message=str(err))

        return past_client

