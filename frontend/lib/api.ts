const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface Transaction {
  id: number;
  symbol: string;
  amount: number;
  price_at_purchase: number;
  purchased_at: string;
  created_at: string;
}

export interface PortfolioPoint {
  date: string;
  total_value: number;
  total_investment: number;
  btc_value: number;
  eth_value: number;
}

export async function getTransactions(): Promise<Transaction[]> {
  const res = await fetch(`${API_URL}/api/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
}

export async function createTransaction(data: { symbol: string; amount: number; price_at_purchase: number; purchased_at: string }) {
  const res = await fetch(`${API_URL}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  return res.json();
}

export async function getPortfolioHistory(): Promise<PortfolioPoint[]> {
  const res = await fetch(`${API_URL}/api/portfolio/history`);
  if (!res.ok) throw new Error('Failed to fetch portfolio history');
  return res.json();
}

export async function syncPrices() {
  const res = await fetch(`${API_URL}/api/prices/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to sync prices');
  return res.json();
}

export async function deleteTransaction(id: number) {
  const res = await fetch(`${API_URL}/api/transactions/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete transaction');
}

export async function updateTransaction(id: number, data: { symbol: string; amount: number; price_at_purchase: number; purchased_at: string }) {
  const res = await fetch(`${API_URL}/api/transactions/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update transaction');
  return res.json();
}
