from db import db


class UserModel(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)

    invoices = db.relationship("InvoiceModel", back_populates="user")
    quotes = db.relationship("QuoteModel", back_populates="user")
    user_company = db.relationship("UserCompanyModel", back_populates="user")
