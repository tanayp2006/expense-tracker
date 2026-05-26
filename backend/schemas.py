from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class ExpenseBase(BaseModel):
    title: str = Field(..., max_length=255)
    amount: float
    category: str = Field(..., max_length=100)
    date: date
    description: Optional[str] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    category: Optional[str] = None
    date: Optional[date] = None
    description: Optional[str] = None


class ExpenseResponse(ExpenseBase):
    id: int

    model_config = {
        "from_attributes": True,
    }


class ExpenseSummary(BaseModel):
    category: str
    total: float

    model_config = {
        "from_attributes": True,
    }
