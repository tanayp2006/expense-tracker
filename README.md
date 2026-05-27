# 💸 SmartSpend — Full-Stack Expense Tracker

SmartSpend is a modern full-stack expense tracking web application built to manage, analyze, and visualize financial transactions seamlessly.

This project demonstrates a production-style full-stack architecture using:

- ⚡ FastAPI for the backend API layer
- 🐘 PostgreSQL for persistent cloud database storage
- ⚛️ Next.js App Router for the frontend
- 🎨 Tailwind CSS for responsive UI design
- 📊 Recharts for financial data visualization

---

# ✨ Features

✅ Add, edit, and delete expenses  
✅ Category-wise expense summaries  
✅ Interactive dashboard analytics  
✅ RESTful API architecture  
✅ PostgreSQL cloud database integration  
✅ Responsive modern UI  
✅ FastAPI Swagger documentation  
✅ Clean modular folder structure  

---

# 📸 UI Preview

### 📊 Main Dashboards (Toggleable Themes)
The application includes a fully responsive interface equipped with global state management for dynamic theme toggling. Users can switch seamlessly between Light and Dark modes depending on environment preference with design states persisting cleanly across layout shifts without jarring layout flashes.

| Light Mode | Dark Mode |
|---|---|
| <img src="./images/Dashboard_Light Mode.png" width="450" alt="Dashboard Light Mode"/> | <img src="./images/Dashboard_Dark Mode.png" width="450" alt="Dashboard Dark Mode"/> |

---

### 📥 Add New Expense
The creation form utilizes structured, context-aware input elements to capture transaction metadata. Fields include automated client-side validation for numeric amounts, category selectors and explicit date tracking inputs, packaging the dataset into a standard schema structure ready for backend serialization.

<p align="center">
  <img src="./images/Add Expense.png" width="450" alt="Add Expense Component"/>
</p>

---

### 🛠️ Expense Analytical Charts
Data visualization is driven by asynchronous state triggers mapped directly to a FastAPI analytics router. The Recharts implementation translates structural transaction lists into interactive donut and bar graphs, providing users with an instant visual breakdown of categorical metrics against target budget ceilings.

<p align="center">
  <img src="./images/Expense Charts.png" width="750" alt="Expense Charts Analytics"/>
</p>

---

### 🧾 Recent Expenses Table
A centralized data ledger rendering live operational records directly from your cloud PostgreSQL instance. The table handles strict layout positioning while mapping integrated management controls directly to each transaction row allowing users to apply custom filters, invoke item-level deletion requests or select records to launch the inline editing configuration.

<p align="center">
  <img src="./images/Recent Expenses Table.png" width="750" alt="Recent Expenses Data Table"/>
</p>

---

### 📝 Edit Expense
When triggered from the data table, the edit component loads the historical expense record into an interactive, pre-populated transactional field context. This module securely isolates modified fields, coordinates validation rules for adjusted properties, and dispatches a clean `PUT` update down to the application api layers.

<p align="center">
  <img src="./images/Edit Expense.png" width="450" alt="Edit Expense Component"/>
</p>

---

# 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Backend | FastAPI |
| ORM | SQLAlchemy |
| Validation | Pydantic |
| Database | PostgreSQL |
| API Docs | Swagger / ReDoc |

---

# 📁 Project Structure

```text
smartspend/
│
├── backend/                  # FastAPI backend application
│   ├── main.py               # API routes & server config
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Local environment variables (ignored)
│
├── frontend/                 # Next.js frontend application
│   └── src/                  # Frontend source code
│
└── .env.example              # Public environment template
```

---

# ⚙️ Requirements

Before starting, ensure the following are installed:

- 🐍 Python 3.11+
- 🟩 Node.js 20+
- 📦 npm
- 🐘 PostgreSQL database
  - Local PostgreSQL
  - OR cloud providers like Neon.tech

---

# 🚀 Quick Start

# 🐍 Backend Setup

## 1️⃣ Create Virtual Environment

```bash
python3 -m venv .venv
```

---

## 2️⃣ Activate Virtual Environment

### macOS / Linux

```bash
source .venv/bin/activate
```

### Windows PowerShell

```powershell
.\.venv\Scripts\Activate.ps1
```

### Windows CMD

```cmd
.\.venv\Scripts\activate.bat
```

---

## 3️⃣ Install Backend Dependencies

```bash
pip install -r backend/requirements.txt
```

---

# 🐘 Database Configuration

## 4️⃣ Create Environment File

Create a `.env` file inside the `backend/` directory:

```bash
touch backend/.env
```

---

## 5️⃣ Add PostgreSQL Connection URL

Inside `backend/.env`:

```env
DATABASE_URL=postgresql://smartspend:smartspendpass@localhost:5432/smartspend_db
```

<!-- > Note: This is a local SQL server -->
> 💡 **Development vs. Production Architecture Note:**  
> When running this project locally, the application connects to an isolated development database environment defined in your local `backend/.env` file.  
>
> Other developers cloning this repository will configure their own local or serverless PostgreSQL instances for isolated testing.
>
> The central shared production database containing live tracking data is securely managed via environment injection on the live cloud deployment platform and cannot be accessed or altered from local development setups.

---

# 🔒 Security Notice

⚠️ Never commit your `.env` file to GitHub.

The `.gitignore` file is configured to automatically ignore sensitive credentials.

---

# ⚡ Run Backend Server

## 6️⃣ Start FastAPI Server

```bash
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

---

# 📚 Backend API Documentation

Once the server is running:

### Swagger UI
👉 http://127.0.0.1:8000/docs

### ReDoc
👉 http://127.0.0.1:8000/redoc

---

# ⚛️ Frontend Setup

## 7️⃣ Navigate to Frontend

```bash
cd frontend
```

---

## 8️⃣ Install Frontend Dependencies

```bash
npm install
```

---

## 9️⃣ Run Frontend Server

```bash
npm run dev
```

---

# 🌐 Open Application

Frontend Dashboard:

👉 http://localhost:3000

---

# 📡 Core API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/expenses` | Create a new expense |
| GET | `/api/expenses` | Fetch all expenses |
| PUT | `/api/expenses/{id}` | Update an expense |
| DELETE | `/api/expenses/{id}` | Delete an expense |
| GET | `/api/expenses/summary` | Fetch category summaries |

---

# 📊 Dashboard Features

📈 Expense analytics  
🥧 Category pie charts  
📅 Monthly summaries  
💰 Total spending overview  
📱 Responsive design  

---

# 🧹 Stopping Development Servers

To safely stop any running server:

```bash
CTRL + C
```

---

# 🔧 Clear Occupied Ports

## Backend (Port 8000)

```bash
lsof -i tcp:8000
kill -9 <PID>
```

---

## Frontend (Port 3000)

```bash
lsof -i tcp:3000
kill -9 <PID>
```

---

# 🐞 Troubleshooting

## ❌ ImportError: attempted relative import with no known parent package

### ✅ Fix

Run the server from the root project directory:

```bash
python -m uvicorn backend.main:app
```

---

## ❌ command not found: uvicorn

### ✅ Fix

Activate your virtual environment first:

```bash
source .venv/bin/activate
```

Then reinstall dependencies if required.

---

## ❌ DATABASE_URL missing or empty

### ✅ Fix

Verify:
- `.env` exists inside `backend/`
- Variable name is correct
- PostgreSQL connection string is valid

---

# 🎯 Future Improvements

- 🔐 JWT Authentication
- 📤 CSV Export
- 🌙 Dark Mode
- 📅 Budget Planning
- 📱 Mobile Optimization
- 📈 Advanced Analytics

---

# 👨‍💻 Author

Built as a full-stack evaluation project demonstrating:

- REST API development
- Database integration
- Frontend-backend communication
- Modern UI architecture
- Deployment-ready structure

---

# ⭐ SmartSpend

Track smarter. Spend wiser. 💸