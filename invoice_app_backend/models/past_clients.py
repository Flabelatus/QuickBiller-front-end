from db import db


class PastClientsModel(db.Model):
    __tablename__ = "past_clients"

    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String)
    company_data = db.Column(db.String)
