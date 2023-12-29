from typing import List

from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import abort, Blueprint
from db import db
from sqlalchemy.exc import SQLAlchemyError

from models import InvoiceModel
from schema import InvoicePlainSchema

invoice_blueprint = Blueprint("Invoices", "invoice", description="Operations on invoice")


@invoice_blueprint.route("/invoice")
class Invoices(MethodView):

    @jwt_required()
    @invoice_blueprint.arguments(InvoicePlainSchema)
    @invoice_blueprint.response(201, InvoicePlainSchema)
    def post(self, parsed_data: dict):
        invoice = InvoiceModel(**parsed_data)
        invoice.user_id = get_jwt_identity()

        try:
            db.session.add(invoice)
            db.session.commit()
        except SQLAlchemyError as err:
            abort(500, message=str(err))

    @jwt_required()
    @invoice_blueprint.response(200, InvoicePlainSchema(many=True))
    def get(self) -> List[InvoiceModel]:
        return InvoiceModel.query.all()


@invoice_blueprint.route("/invoice/<int:invoice_id>")
class InvoiceByID(MethodView):

    @jwt_required()
    @invoice_blueprint.response(200, InvoicePlainSchema)
    def get(self, invoice_id: int) -> InvoiceModel:
        return InvoiceModel.query.get_or_404(invoice_id)

    @jwt_required()
    @invoice_blueprint.arguments(InvoicePlainSchema)
    @invoice_blueprint.response(200, InvoicePlainSchema)
    def patch(self, parsed_data, invoice_id):
        invoice = InvoiceModel.query.get_or_404(invoice_id)
        if invoice:
            invoice.logo = parsed_data.get("logo", "")
            invoice.message = parsed_data.get("message", "")
            invoice.due_term = parsed_data.get("due_term", "")
            invoice.invoice_date = parsed_data.get("invoice_date", "")
            invoice.invoice_number = parsed_data.get("invoice_number", "")
            invoice.receiver_data = parsed_data.get("receiver_data", "")
            invoice.sender_data = parsed_data.get("sender_data", "")
            invoice.job_data = parsed_data.get("job_data", "")

        db.session.add(invoice)
        db.session.commit()

        return invoice

    @jwt_required()
    def delete(self, invoice_id: int) -> dict:
        invoice = InvoiceModel.query.get_or_404(invoice_id)
        db.session.delete(invoice)
        db.session.commit()

        return {
            "message": "invoice removed successfully"
        }


@invoice_blueprint.route("/invoices/user/<int:user_id>")
class InvoicesByUserID(MethodView):

    @jwt_required()
    @invoice_blueprint.response(200, InvoicePlainSchema(many=True))
    def get(self, user_id: int) -> List[InvoiceModel]:
        invoice = InvoiceModel.query.filter_by(user_id=user_id).order_by(InvoiceModel.created_at.desc()).all()
        if invoice:
            return invoice
        else:
            abort(404, message="no invoices found with this user id")


@invoice_blueprint.route("/invoice/user/<int:user_id>")
class InvoiceByUserID(MethodView):

    @jwt_required()
    @invoice_blueprint.response(200, InvoicePlainSchema)
    def get(self, user_id: int) -> InvoiceModel:
        invoice = InvoiceModel.query.filter_by(user_id=user_id).order_by(InvoiceModel.created_at.desc()).first()
        if invoice:
            return invoice
        else:
            abort(404, message="no invoices found with this user id")


