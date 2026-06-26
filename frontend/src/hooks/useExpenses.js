import { useState, useEffect, useCallback } from "react";
import {
  getExpenses, addExpense, deleteExpense,
  getChartData, getBudgetAlert, setBudget,
  exportCsv, exportPdf
} from "../services/api";

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [budgetAlert, setBudgetAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [expRes, chartRes] = await Promise.all([
        getExpenses(),
        getChartData(),
      ]);
      setExpenses(expRes.data);
      setChartData(chartRes.data);

      try {
        const budgetRes = await getBudgetAlert();
        setBudgetAlert(budgetRes.data);
      } catch {
        setBudgetAlert(null); // no budget set yet
      }
    } catch (e) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const add = async (data) => {
    await addExpense(data);
    fetchAll();
  };

  const remove = async (id) => {
    await deleteExpense(id);
    fetchAll();
  };

  const saveBudget = async (monthlyLimit) => {
    const res = await setBudget({ monthlyLimit });
    setBudgetAlert(res.data);
  };

  const downloadCsv = async () => {
    const res = await exportCsv();
    const url = URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url; a.download = "expenses.csv"; a.click();
  };

  const downloadPdf = async () => {
    const res = await exportPdf();
    const url = URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url; a.download = "expenses.pdf"; a.click();
  };

  return {
    expenses, chartData, budgetAlert,
    loading, error,
    add, remove, saveBudget,
    downloadCsv, downloadPdf,
    refresh: fetchAll
  };
}
