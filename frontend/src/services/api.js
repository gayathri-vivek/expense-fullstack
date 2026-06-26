import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:8080/api" });

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Expenses
export const getExpenses = () => API.get("/expenses");
export const addExpense = (data) => API.post("/expenses", data);
export const deleteExpense = (id) => API.delete(`/expenses/${id}`);
export const getChartData = () => API.get("/expenses/charts");

// Budget
export const setBudget = (data) => API.post("/budget", data);
export const getBudgetAlert = () => API.get("/budget/alert");

// Export
export const exportCsv = () => API.get("/export/csv", { responseType: "blob" });
export const exportPdf = () => API.get("/export/pdf", { responseType: "blob" });
