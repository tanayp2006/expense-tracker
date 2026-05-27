from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import logging
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, SessionLocal, engine

app = FastAPI(title="SmartSpend Backend")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://expense-tracker-liard-beta.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Log full exception and body for debugging
    try:
        body = await request.json()
    except Exception:
        body = None
    logging.exception("Request validation error: %s -- body=%s", exc, body)
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "body": body,
        },
    )

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.post("/api/expenses", response_model=schemas.ExpenseResponse)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = models.Expense(**expense.dict())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.get("/api/expenses", response_model=list[schemas.ExpenseResponse])
def read_expenses(db: Session = Depends(get_db)):
    return db.query(models.Expense).order_by(models.Expense.date.desc()).all()


@app.put("/api/expenses/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(expense_id: int, expense_update: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_expense = db.get(models.Expense, expense_id)
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    for field, value in expense_update.model_dump().items():
        setattr(db_expense, field, value)

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@app.delete("/api/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    db_expense = db.get(models.Expense, expense_id)
    if db_expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(db_expense)
    db.commit()
    return {"detail": "Expense deleted"}


@app.get("/api/expenses/summary", response_model=list[schemas.ExpenseSummary])
def expense_summary(db: Session = Depends(get_db)):
    results = (
        db.query(models.Expense.category, func.sum(models.Expense.amount).label("total"))
        .group_by(models.Expense.category)
        .order_by(models.Expense.category)
        .all()
    )
    return [{"category": category, "total": total} for category, total in results]
