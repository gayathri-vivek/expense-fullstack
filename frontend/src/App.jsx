import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useExpenses } from "./hooks/useExpenses";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

// ─── COLORS ──────────────────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  Food: "#f59e0b", Transport: "#3b82f6", Shopping: "#ec4899",
  Bills: "#8b5cf6", Health: "#10b981", Entertainment: "#f43f5e", Other: "#6b7280"
};
const COLORS = Object.values(CATEGORY_COLORS);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const S = {
  app: { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", fontFamily: "'Inter', sans-serif" },
  // Auth
  authWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#0f172a,#1e293b)" },
  authCard: { background: "#1e293b", border: "1px solid #334155", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "400px" },
  authTitle: { fontSize: "24px", fontWeight: 800, marginBottom: "8px", color: "#f1f5f9" },
  authSub: { color: "#94a3b8", marginBottom: "28px", fontSize: "14px" },
  label: { display: "block", fontSize: "13px", color: "#94a3b8", marginBottom: "6px", fontWeight: 500 },
  input: { width: "100%", background: "#0f172a", border: "1px solid #334155", borderRadius: "8px", padding: "10px 12px", color: "#f1f5f9", fontSize: "14px", outline: "none", boxSizing: "border-box", marginBottom: "16px" },
  btn: { width: "100%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer" },
  btnSm: { background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" },
  btnDanger: { background: "#be123c", color: "#fff", border: "none", borderRadius: "6px", padding: "4px 10px", fontSize: "12px", cursor: "pointer" },
  btnOutline: { background: "transparent", color: "#94a3b8", border: "1px solid #334155", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: "pointer" },
  toggleLink: { color: "#818cf8", cursor: "pointer", fontSize: "14px", textDecoration: "underline" },
  // Layout
  nav: { background: "#1e293b", borderBottom: "1px solid #334155", padding: "14px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  navTitle: { fontSize: "18px", fontWeight: 800, color: "#818cf8" },
  main: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "28px" },
  card: { background: "#1e293b", border: "1px solid #334155", borderRadius: "14px", padding: "24px" },
  statCard: { background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "20px" },
  statNum: { fontSize: "28px", fontWeight: 800, color: "#f1f5f9" },
  statLabel: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: "4px" },
  sectionTitle: { fontSize: "15px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" },
  // Alert
  alertGreen: { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", color: "#34d399" },
  alertYellow: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.3)", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", color: "#fbbf24" },
  alertRed: { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", padding: "14px 18px", marginBottom: "24px", color: "#f87171" },
  // Progress
  progressBar: (pct, exceeded) => ({
    height: "8px", background: "#0f172a", borderRadius: "4px", overflow: "hidden", marginTop: "8px",
    position: "relative"
  }),
  progressFill: (pct, exceeded) => ({
    height: "100%", borderRadius: "4px",
    width: `${Math.min(pct, 100)}%`,
    background: exceeded ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#10b981",
    transition: "width 0.5s"
  }),
  // Table
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "10px 12px", fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #334155" },
  td: { padding: "12px", fontSize: "14px", borderBottom: "1px solid #1e293b", color: "#cbd5e1" },
  badge: (cat) => ({ background: CATEGORY_COLORS[cat] + "22", color: CATEGORY_COLORS[cat], padding: "2px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 600 }),
  error: { color: "#f87171", fontSize: "13px", marginTop: "8px" },
};

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage() {
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
    } catch (e) {
      setError(e.response?.data?.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={S.authWrap}>
      <div style={S.authCard}>
        <div style={S.authTitle}>💸 ExpenseIQ</div>
        <div style={S.authSub}>{isLogin ? "Sign in to your account" : "Create your account"}</div>

        {!isLogin && (
          <>
            <label style={S.label}>Name</label>
            <input style={S.input} placeholder="Your name" value={form.name} onChange={set("name")} />
          </>
        )}
        <label style={S.label}>Email</label>
        <input style={S.input} placeholder="you@email.com" value={form.email} onChange={set("email")} />
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={set("password")}
          onKeyDown={(e) => e.key === "Enter" && submit()} />

        {error && <div style={S.error}>{error}</div>}
        <button style={{ ...S.btn, marginTop: "8px" }} onClick={submit} disabled={loading}>
          {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
        </button>

        <div style={{ textAlign: "center", marginTop: "20px", color: "#64748b", fontSize: "14px" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span style={S.toggleLink} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Sign in"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── ADD EXPENSE FORM ─────────────────────────────────────────────────────────
function AddExpenseForm({ onAdd }) {
  const [form, setForm] = useState({ title: "", amount: "", category: "Food", date: new Date().toISOString().split("T")[0], note: "" });
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async () => {
    if (!form.title || !form.amount) return;
    setLoading(true);
    try { await onAdd({ ...form, amount: parseFloat(form.amount) }); setForm((f) => ({ ...f, title: "", amount: "", note: "" })); }
    finally { setLoading(false); }
  };

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>Add Expense</div>
      <label style={S.label}>Title</label>
      <input style={S.input} placeholder="e.g. Lunch" value={form.title} onChange={set("title")} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <label style={S.label}>Amount (₹)</label>
          <input style={S.input} type="number" placeholder="0.00" value={form.amount} onChange={set("amount")} />
        </div>
        <div>
          <label style={S.label}>Date</label>
          <input style={S.input} type="date" value={form.date} onChange={set("date")} />
        </div>
      </div>
      <label style={S.label}>Category</label>
      <select style={{ ...S.input, marginBottom: "12px" }} value={form.category} onChange={set("category")}>
        {Object.keys(CATEGORY_COLORS).map(c => <option key={c}>{c}</option>)}
      </select>
      <label style={S.label}>Note (optional)</label>
      <input style={S.input} placeholder="Any notes..." value={form.note} onChange={set("note")} />
      <button style={S.btn} onClick={submit} disabled={loading}>{loading ? "Adding..." : "Add Expense"}</button>
    </div>
  );
}

// ─── BUDGET PANEL ─────────────────────────────────────────────────────────────
function BudgetPanel({ budgetAlert, onSave }) {
  const [limit, setLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!limit) return;
    setSaving(true);
    try { await onSave(parseFloat(limit)); setLimit(""); }
    finally { setSaving(false); }
  };

  const alertStyle = budgetAlert?.isExceeded ? S.alertRed : budgetAlert?.isNearLimit ? S.alertYellow : S.alertGreen;

  return (
    <div style={S.card}>
      <div style={S.sectionTitle}>Monthly Budget</div>
      {budgetAlert && (
        <div style={alertStyle}>
          <div style={{ fontWeight: 600, marginBottom: "6px" }}>{budgetAlert.message}</div>
          <div style={S.progressBar()}>
            <div style={S.progressFill(budgetAlert.percentageUsed, budgetAlert.isExceeded)} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12px", opacity: 0.8 }}>
            <span>₹{budgetAlert.totalSpent?.toLocaleString()} spent</span>
            <span>₹{budgetAlert.monthlyLimit?.toLocaleString()} limit</span>
          </div>
        </div>
      )}
      <label style={S.label}>Set Monthly Limit (₹)</label>
      <div style={{ display: "flex", gap: "10px" }}>
        <input style={{ ...S.input, marginBottom: 0, flex: 1 }} type="number" placeholder="e.g. 20000"
          value={limit} onChange={(e) => setLimit(e.target.value)} />
        <button style={S.btnSm} onClick={save} disabled={saving}>{saving ? "..." : "Set"}</button>
      </div>
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────
function Charts({ chartData }) {
  if (!chartData) return null;

  const pieData = Object.entries(chartData.byCategory || {}).map(([name, value]) => ({ name, value: parseFloat(value) }));
  const barData = (chartData.monthly?.labels || []).map((label, i) => ({ month: label, total: parseFloat(chartData.monthly.data[i] || 0) }));

  return (
    <div style={S.grid2}>
      <div style={S.card}>
        <div style={S.sectionTitle}>Spending by Category</div>
        {pieData.length === 0 ? <div style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>No data yet</div> : (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {pieData.map((entry, i) => <Cell key={i} fill={CATEGORY_COLORS[entry.name] || COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={S.card}>
        <div style={S.sectionTitle}>Monthly Spending (Last 6 Months)</div>
        {barData.length === 0 ? <div style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>No data yet</div> : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} contentStyle={{ background: "#1e293b", border: "1px solid #334155" }} />
              <Bar dataKey="total" fill="#818cf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ─── EXPENSE LIST ─────────────────────────────────────────────────────────────
function ExpenseList({ expenses, onDelete }) {
  return (
    <div style={{ ...S.card, marginTop: "20px" }}>
      <div style={S.sectionTitle}>All Expenses ({expenses.length})</div>
      {expenses.length === 0 ? (
        <div style={{ color: "#64748b", textAlign: "center", padding: "40px 0" }}>No expenses yet. Add your first one!</div>
      ) : (
        <table style={S.table}>
          <thead>
            <tr>
              {["Title", "Amount", "Category", "Date", "Note", ""].map(h => <th key={h} style={S.th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {expenses.map(e => (
              <tr key={e.id}>
                <td style={S.td}>{e.title}</td>
                <td style={{ ...S.td, color: "#f1f5f9", fontWeight: 600 }}>₹{parseFloat(e.amount).toLocaleString()}</td>
                <td style={S.td}><span style={S.badge(e.category)}>{e.category}</span></td>
                <td style={S.td}>{e.date}</td>
                <td style={{ ...S.td, color: "#64748b" }}>{e.note || "-"}</td>
                <td style={S.td}><button style={S.btnDanger} onClick={() => onDelete(e.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout } = useAuth();
  const { expenses, chartData, budgetAlert, loading, add, remove, saveBudget, downloadCsv, downloadPdf } = useExpenses();

  const totalSpent = expenses.reduce((s, e) => s + parseFloat(e.amount), 0);
  const thisMonth = expenses.filter(e => e.date?.startsWith(new Date().toISOString().slice(0, 7)));
  const monthTotal = thisMonth.reduce((s, e) => s + parseFloat(e.amount), 0);

  return (
    <div style={S.app}>
      <nav style={S.nav}>
        <div style={S.navTitle}>💸 ExpenseIQ</div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#94a3b8", fontSize: "14px" }}>Hi, {user?.name}</span>
          <button style={S.btnOutline} onClick={downloadCsv}>⬇ CSV</button>
          <button style={S.btnOutline} onClick={downloadPdf}>⬇ PDF</button>
          <button style={{ ...S.btnOutline, color: "#f87171", borderColor: "#7f1d1d" }} onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={S.main}>
        {loading && <div style={{ color: "#64748b", marginBottom: "16px" }}>Loading...</div>}

        {/* Stats */}
        <div style={S.grid3}>
          <div style={S.statCard}>
            <div style={S.statNum}>₹{totalSpent.toLocaleString()}</div>
            <div style={S.statLabel}>Total Spent</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>₹{monthTotal.toLocaleString()}</div>
            <div style={S.statLabel}>This Month</div>
          </div>
          <div style={S.statCard}>
            <div style={S.statNum}>{expenses.length}</div>
            <div style={S.statLabel}>Total Transactions</div>
          </div>
        </div>

        {/* Add Expense + Budget side by side */}
        <div style={S.grid2}>
          <AddExpenseForm onAdd={add} />
          <BudgetPanel budgetAlert={budgetAlert} onSave={saveBudget} />
        </div>

        {/* Charts */}
        <div style={{ marginTop: "20px" }}>
          <Charts chartData={chartData} />
        </div>

        {/* Expense Table */}
        <ExpenseList expenses={expenses} onDelete={remove} />
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
function AppContent() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <AuthPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
