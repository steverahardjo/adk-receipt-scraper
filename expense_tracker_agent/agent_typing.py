from enum import Enum
from pydantic import BaseModel, Field
from datetime import date
from beanie import Document
from datetime import datetime


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


class ExpenseSchema(BaseModel):
    item: str
    amount: float
    currency: Currency
    datetime: str = "today"
    category: ExpenseType
    payment_method: PaymentMethod
    description: str | None = None
    
    async def to_document(self) -> Expense:
        """Converts the AI data into the actual Database Document."""
        d = self.datetime
        if isinstance(d, str):
            if d.lower() in ["today", "now"]:
                d = datetime.now().date()
            else:
                d = datetime.fromisoformat(d.replace("Z", "+00:00")).date()

        return Expense(
            item=self.item,
            amount=self.amount,
            currency=self.currency,
            date_recorded=datetime.now().date(),
            datetime=d,
            category=self.category,
            payment_method=self.payment_method,
            description=self.description
        )



class PayloadType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class Payload(BaseModel):
    content: str
