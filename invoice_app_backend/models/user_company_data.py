from db import db


class UserCompanyModel(db.Model):
    __tablename__ = "user_company"

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String)
    contact_name = db.Column(db.String)
    email = db.Column(db.String)
    street = db.Column(db.String)
    postcode = db.Column(db.String)
    city = db.Column(db.String)
    country = db.Column(db.String)
    iban = db.Column(db.String)
    vat_number = db.Column(db.String)
    coc_number = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship("UserModel", back_populates="user_company")
