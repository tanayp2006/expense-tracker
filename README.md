# SpendWise - Expense Tracker

A 3-day full-stack evaluation project with:
- `backend/` using FastAPI, SQLAlchemy, and Pydantic
- `frontend/` using Next.js with App Router and Tailwind CSS

## Project structure

- `backend/` - FastAPI backend service
- `frontend/` - Next.js frontend application

## Run the backend

From the project root, run these commands (paths are relative so they work anywhere):

```bash
# create a virtual environment in the project root and activate it
python3 -m venv .venv
source .venv/bin/activate

# install backend dependencies
pip install -r backend/requirements.txt

# set your database URL in the same shell (example using PostgreSQL)
export DATABASE_URL="postgresql://spendwise:spendwisepass@localhost:5432/spendwise_db"

# start the backend (run from project root with the venv activated)
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

Then verify the backend is running in a second terminal:

```bash
lsof -i tcp:8000
curl -sS -o /dev/null -w "%{http_code}" http://127.0.0.1:8000/docs
```

The second command should return `200`.

If the backend is already running and you need to stop it first, use:

```bash
lsof -i tcp:8000
kill <PID>
# if the process does not stop cleanly:
kill -9 <PID>
```

Then open:

- `http://127.0.0.1:8000/docs`
- `http://127.0.0.1:8000/redoc`

If you want to stop the backend, press `CTRL+C` in the terminal where it is running.

## Deactivate backend virtual environment

If you activated the backend virtual environment with:

```bash
source backend/.venv/bin/activate
```

You can deactivate it and return to your normal shell by running:

```bash
deactivate
# or simply close the terminal window/tab
```

Running `deactivate` restores your shell's `PATH` and prompt to their previous state.

## Backend troubleshooting

- If `backend/.venv/bin/python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000` gives `ImportError: attempted relative import with no known parent package`, make sure you are in the repository root and not inside `backend/`.
- If the command gives `Address already in use`, find the occupying process and kill it with `lsof -i tcp:8000`.
- If the command gives `command not found` for `uvicorn`, install dependencies with `pip install -r backend/requirements.txt` after activating the virtual environment.
- If you see `ModuleNotFoundError: No module named 'psycopg2'`, install the PostgreSQL DB driver by running:
  ```bash
  pip install -r backend/requirements.txt
  ```

## Environment configuration

This project requires PostgreSQL. The backend reads `DATABASE_URL` from the environment and will fail if it is not set.

Set `DATABASE_URL` in the same terminal session before starting the backend:

```bash
export DATABASE_URL="postgresql://spendwise:spendwisepass@localhost:5432/spendwise_db"
backend/.venv/bin/python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

For a permanent setup, add the same export to your shell profile:

```bash
# ~/.zshrc or ~/.bash_profile
export DATABASE_URL="postgresql://spendwise:spendwisepass@localhost:5432/spendwise_db"
```

Reload the profile:

```bash
source ~/.zshrc
```

If you use a local `.env` file, copy the example:

```bash
cp .env.example .env
```

Then start the backend from the repo root:

```bash
backend/.venv/bin/python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
## API endpoints

- `POST /api/expenses` - create a new expense
- `GET /api/expenses` - fetch all expenses
- `PUT /api/expenses/{id}` - update an existing expense
- `DELETE /api/expenses/{id}` - delete an expense by ID
- `GET /api/expenses/summary` - return total expenses grouped by category

## Run the frontend

From the project root, run these commands (paths are relative so they work anywhere):

```bash
cd frontend
npm install
npm run dev
```

Then open:

- `http://localhost:3000`

## Notes

- The repo already includes a `.gitignore` for Python and Node.js/Next.js projects.
- The frontend app is scaffolded with Tailwind CSS and includes an expense form, list table, and summary data.

## Stop frontend local servers

If the Next.js dev server (or any frontend process) is already running on `localhost:3000` (or another port), use these commands to find and stop it.

1. Check the default frontend port (3000):
```bash
lsof -i tcp:3000
```
If this prints a line like `node  12345 username  ... TCP *:3000 (LISTEN)`, the number after the process name is the PID (here `12345`).

2. Stop the process by PID:
```bash
kill 12345
# if it does not stop, force kill:
kill -9 12345
```

3. Find any listening Node/Next processes (all ports):
```bash
lsof -iTCP -sTCP:LISTEN -n -P | grep -E "node|next"
```

4. Kill by process name (use with caution — may stop other Node apps):
```bash
# stop all 'next' processes
pkill -f next
# or stop all node processes (only if you are sure)
pkill -f node
```

5. macOS GUI alternative: open Activity Monitor, search for `node` or `next`, select the process and quit.

Notes & safety
- Prefer `lsof` + `kill <PID>` for precise shutdown.
- Avoid `pkill -f node` if you have unrelated Node services running.
- If you changed the frontend port (e.g., `3001`), replace `3000` with that port in the commands above.
