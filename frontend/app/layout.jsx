import "./globals.css";

export const metadata = {
  title: "SmartSpend",
  description: "SmartSpend — Expense tracker dashboard with FastAPI backend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
