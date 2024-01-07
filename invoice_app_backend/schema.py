from marshmallow import fields, Schema


class UserPlainSchema(Schema):
    id = fields.Int(dump_only=True)
    email = fields.Str(required=True)
    username = fields.Str()
    # This must stay load only, since we never want to return the password
    password = fields.Str(required=True, load_only=True)


class UserCompanySchema(Schema):
    id = fields.Int(dump_only=True)
    company_name = fields.Str()
    contact_name = fields.Str()
    email = fields.Str()
    street = fields.Str()
    postcode = fields.Str()
    city = fields.Str()
    country = fields.Str()
    iban = fields.Str()
    vat_number = fields.Str()
    coc_number = fields.Str()
    user_id = fields.Int()


class InvoicePlainSchema(Schema):
    id = fields.Int(dump_only=True)
    logo = fields.Str()
    message = fields.Str()
    due_term = fields.Str()
    invoice_date = fields.Str()
    invoice_number = fields.Str()
    receiver_data = fields.Str()
    sender_data = fields.Str()
    job_data = fields.Str()
    created_at = fields.Str()


class QuotePlainSchema(Schema):
    id = fields.Int(dump_only=True)
    logo = fields.Str()
    message = fields.Str()
    valid_date = fields.Str()
    quote_date = fields.Str()
    quote_number = fields.Str()
    receiver_data = fields.Str()
    sender_data = fields.Str()
    job_data = fields.Str()
    user_id = fields.Int()
    created_at = fields.Str()


class UserSchema(UserPlainSchema):
    invoices = fields.List(fields.Nested(InvoicePlainSchema(), load_instance=True))
    quotes = fields.List(fields.Nested(QuotePlainSchema(), load_instance=True))
    user_company = fields.Nested(UserCompanySchema(), load_instance=True)


class PastClientsSchema(Schema):
    id = fields.Int(dump_only=True)
    company_name = fields.Str()
    company_data = fields.Str()
