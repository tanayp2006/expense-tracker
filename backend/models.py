from sqlalchemy import Column, Date, Float, Integer, String, Text

from .database import Base


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(length=255), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String(length=100), nullable=False, index=True)
    date = Column(Date, nullable=False)
    description = Column(Text, nullable=True)
