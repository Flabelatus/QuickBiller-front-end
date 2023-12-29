from db import db


class InvoiceModel(db.Model):
    __tablename__ = "invoice"

    id = db.Column(db.Integer, primary_key=True)
    logo = db.Column(db.String)
    message = db.Column(db.String)
    due_term = db.Column(db.String)
    invoice_date = db.Column(db.String)
    invoice_number = db.Column(db.String)

    receiver_data = db.Column(db.String)
    job_data = db.Column(db.String)
    sender_data = db.Column(db.String)

    created_at = db.Column(db.String)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    user = db.relationship("UserModel", back_populates="invoices")
