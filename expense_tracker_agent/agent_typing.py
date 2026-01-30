from enum import Enum
from pydantic import BaseModel, Field
from datetime import date
from beanie import Document
from datetime import datetime
from blob_storage import GCSBlobService
from google.adk.tools.tool_context import ToolContext

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
    date_recorded: datetime
    amount: float = Field(..., gt=0)
    currency: Currency
    datetime: date
    category: ExpenseType
    payment_method: PaymentMethod
    description: str | None = None
    blob_filename: str |None = None


blob_service = GCSBlobService()
class ExpenseSchema(BaseModel):
    item: str
    amount: float
    currency: Currency
    datetime: str = "today"
    category: ExpenseType
    payment_method: PaymentMethod
    description: str | None = None
    blob_filename: str | None = None
    
    async def to_document(self, tool_context: ToolContext = None) -> Expense:
        """Converts the AI data into the actual Database Document."""
        d = self.datetime
        if isinstance(d, str):
            if d.lower() in ["today", "now"]:
                d = datetime.now().date()
            else:
                d = datetime.fromisoformat(d.replace("Z", "+00:00")).date()

        if self.blob_filename not  in [None, ""]:
            artifact_part = await tool_context.load_artifact(self.blob_filename)
            raw_bytes = artifact_part.inline_data.data
            self.blob_filename = blob_service.upload_blob_file(
                        self.blob_filename, 
                        raw_bytes
                    )
        return Expense(
            item=self.item,
            amount=self.amount,
            currency=self.currency,
            date_recorded=datetime.now().replace(microsecond=0),            
            datetime=d,
            category=self.category,
            payment_method=self.payment_method,
            description=self.description,
            blob_filename=self.blob_filename
        )



class PayloadType(str, Enum):
    TEXT = "text"
    IMAGE = "image"


class Payload(BaseModel):
    content: str
