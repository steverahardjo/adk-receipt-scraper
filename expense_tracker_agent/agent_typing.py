from enum import Enum
from pydantic import BaseModel, Field
from datetime import date
from beanie import Document


class ExpenseType(str, Enum):
    FOOD = "food"
    RENT = "rent"
    TRANSPORT = "transport"
    UTILITIES = "utilities"
    ENTERTAINMENT = "entertainment"
    OTHER = "other"


class PaymentMethod(str, Enum):
    CASH = "cash"
    DEBIT_CARD = "debit_card"
    BANK_TRANSFER = "bank_transfer"
    EWALLET = "e_wallet"


class Currency(str, Enum):
    USD = "USD"
    MYR = "MYR"
    GBP = "GBP"
    JPY = "JPY"
    IDR = "IDR"

class InputType(Enum):
    PDF = ("application/pdf", "pdf")
    IMG = ("image/jpeg", "jpeg")
    AUDIO = ("audio/mpeg", "mp3")


class Expense(Document):
    item: str | None = None
    date_recorded: date
    amount: float = Field(..., gt=0)
    currency: Currency
    datetime: date
    category: ExpenseType
    payment_method: PaymentMethod
    description: str | None = None
    blob_filename: str |None = None


class PayloadType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class Payload(BaseModel):
    content: str
