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


class ExpenseSchema(BaseModel):
    amount: float = Field(..., gt=0, description="Expense amount, must be positive")
    currency: Currency = Field(..., description="Currency code")
    datetime: date = Field(..., description="Date of expense (YYYY-MM-DD)")
    category: ExpenseType = Field(..., description="Expense category")
    payment_method: PaymentMethod = Field(..., description="Payment method used")
    description: str | None = Field(
        default=None, max_length=255, description="Optional short description"
    )

    class Config:
        extra = "forbid"
        use_enum_values = True

    class Settings:
        name = "expenses"


class Expense(Document):
    item: str | None = None
    date_recorded: date
    amount: float = Field(..., gt=0)
    currency: Currency
    datetime: date
    category: ExpenseType
    payment_method: PaymentMethod
    description: str | None = None


class PayloadType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class Payload(BaseModel):
    content: str
