'use client';

import { useEffect, useState } from 'react';
import { getTransactions, getPortfolioHistory, syncPrices, Transaction, PortfolioPoint } from '@/lib/api';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import PortfolioChart from '@/components/PortfolioChart';
import AllocationPieChart from '@/components/AllocationPieChart';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [history, setHistory] = useState<PortfolioPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [txs, hist] = await Promise.all([
        getTransactions(),
        getPortfolioHistory()
      ]);
      setTransactions(txs);
      setHistory(hist);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 初回表示
    fetchData();

    // 裏で最新価格を取得して更新
    syncPrices().then(() => {
      console.log('Prices synced');
      fetchData(); // 価格更新後にデータを再取得
    }).catch(err => console.error('Sync failed:', err));
  }, []);

  const lastPoint = history.length > 0 ? history[history.length - 1] : null;

  const btcInvestment = transactions
    .filter(t => t.symbol === 'BTC')
    .reduce((sum, t) => sum + (t.amount * t.price_at_purchase), 0);

  const ethInvestment = transactions
    .filter(t => t.symbol === 'ETH')
    .reduce((sum, t) => sum + (t.amount * t.price_at_purchase), 0);

  const totalInvestment = btcInvestment + ethInvestment;

  const calculatePercentage = (current: number, investment: number) => {
    if (investment === 0) return 0;
    return ((current - investment) / investment) * 100;
  };

  const btcPercentage = calculatePercentage(lastPoint?.btc_value ?? 0, btcInvestment);
  const ethPercentage = calculatePercentage(lastPoint?.eth_value ?? 0, ethInvestment);
  const totalPercentage = calculatePercentage(lastPoint?.total_value ?? 0, totalInvestment);

  const PercentageDisplay = ({ value }: { value: number }) => {
    const isPositive = value >= 0;
    return (
      <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
        {isPositive ? '+' : ''}{value.toFixed(1)}%
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 mb-6">
            仮想通貨ポートフォリオ管理
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* BTC Stats */}
            <div className="bg-gray-800 p-4 rounded-lg shadow border-t-4 border-orange-500">
              <p className="text-gray-400 text-xs text-orange-400 font-bold mb-1">BTC 評価額</p>
              <div className="flex items-baseline">
                <p className="text-lg font-bold">¥{lastPoint?.btc_value.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}</p>
                <PercentageDisplay value={btcPercentage} />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow border-t-4 border-orange-500/30">
              <p className="text-gray-500 text-xs mb-1">BTC 投資額</p>
              <p className="text-lg font-bold text-gray-300">¥{btcInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>

            {/* ETH Stats */}
            <div className="bg-gray-800 p-4 rounded-lg shadow border-t-4 border-indigo-500">
              <p className="text-gray-400 text-xs text-indigo-400 font-bold mb-1">ETH 評価額</p>
              <div className="flex items-baseline">
                <p className="text-lg font-bold">¥{lastPoint?.eth_value.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}</p>
                <PercentageDisplay value={ethPercentage} />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow border-t-4 border-indigo-500/30">
              <p className="text-gray-500 text-xs mb-1">ETH 投資額</p>
              <p className="text-lg font-bold text-gray-300">¥{ethInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>

            {/* Total Stats */}
            <div className="bg-gray-800 p-4 rounded-lg shadow border-t-4 border-blue-500">
              <p className="text-gray-400 text-xs text-blue-400 font-bold mb-1">総評価額</p>
              <div className="flex items-baseline">
                <p className="text-xl font-bold text-white">¥{lastPoint?.total_value.toLocaleString(undefined, { maximumFractionDigits: 0 }) ?? 0}</p>
                <PercentageDisplay value={totalPercentage} />
              </div>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg shadow border-t-4 border-green-500">
              <p className="text-gray-400 text-xs text-green-400 font-bold mb-1">総投資額</p>
              <p className="text-xl font-bold text-white">¥{totalInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2">
                <PortfolioChart data={history} />
              </div>
              <div className="lg:col-span-1">
                <AllocationPieChart
                  btcValue={lastPoint?.btc_value ?? 0}
                  ethValue={lastPoint?.eth_value ?? 0}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <TransactionForm onSuccess={fetchData} />
              </div>
              <div className="lg:col-span-2">
                <TransactionList transactions={transactions} onDelete={fetchData} />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
