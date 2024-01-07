from flask.views import MethodView
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_smorest import abort, Blueprint
from db import db
from sqlalchemy.exc import SQLAlchemyError

from models import UserCompanyModel
from schema import UserCompanySchema

user_company_blp = Blueprint("User Company Info", "user_company", description="Operations on user company")


@user_company_blp.route("/user_company")
class UserCompany(MethodView):

    @jwt_required()
    @user_company_blp.response(200, UserCompanySchema)
    def get(self) -> UserCompanyModel:
        user_id = get_jwt_identity()
        company_data = UserCompanyModel.query.filter_by(user_id=user_id).first()

        return company_data

    @jwt_required()
    @user_company_blp.arguments(UserCompanySchema)
    @user_company_blp.response(201, UserCompanySchema)
    def put(self, parsed_data: dict):
        user_company_info = UserCompanyModel(**parsed_data)
        user_company_info.user_id = get_jwt_identity()
        try:
            db.session.add(user_company_info)
            db.session.commit()
        except SQLAlchemyError as err:
            db.roll_back()
            abort(500)
        return user_company_info

    @jwt_required()
    @user_company_blp.arguments(UserCompanySchema)
    @user_company_blp.response(200, UserCompanySchema)
    def patch(self, parsed_data: dict):
        user_id = get_jwt_identity()
        company_data = UserCompanyModel.query.filter_by(user_id=user_id).first()
        if company_data:
            company_data.company_name = parsed_data.get("company_name", "")
            company_data.contact_name = parsed_data.get("contact_name", "")
            company_data.email = parsed_data.get("email", "")
            company_data.street = parsed_data.get("street", "")
            company_data.postcode = parsed_data.get("postcode", "")
            company_data.city = parsed_data.get("city", "")
            company_data.country = parsed_data.get("country", "")
            company_data.iban = parsed_data.get("iban", "")
            company_data.vat_number = parsed_data.get("vat_number", "")
            company_data.coc_number = parsed_data.get("coc_number", "")

        db.session.add(company_data)
        db.session.commit()

        return company_data

    @jwt_required()
    def delete(self):
        user_id = get_jwt_identity()
        company_data = UserCompanyModel.query.filter_by(user_id=user_id).first()
        if company_data:
            db.session.delete(company_data)
            db.session.commit()
            return {"message": "successfully deleted the company data", "status_code": 200}
        else:
            abort(404)
