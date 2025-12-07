'use client';

import { useState } from 'react';
import { createTransaction, syncPrices } from '@/lib/api';

export default function TransactionForm({ onSuccess }: { onSuccess: () => void }) {
    const [symbol, setSymbol] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [isFree, setIsFree] = useState(false);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createTransaction({
                symbol,
                amount: parseFloat(amount),
                price_at_purchase: parseFloat(price),
                purchased_at: new Date(date).toISOString(),
            });
            // Trigger price sync after adding transaction to ensure we have data
            await syncPrices();

            setAmount('');
            setPrice('');
            setIsFree(false);
            onSuccess();
        } catch (error) {
            console.error(error);
            alert('Failed to add transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">取引を追加</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-400 mb-1">通貨</label>
                    <select
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                    >
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                    </select>
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">日付</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">数量</label>
                    <input
                        type="number"
                        step="any"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-400 mb-1">購入単価 (円)</label>
                    <input
                        type="number"
                        step="any"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        disabled={isFree}
                    />
                    <div className="mt-2 flex items-center">
                        <input
                            type="checkbox"
                            id="isFree"
                            checked={isFree}
                            onChange={(e) => {
                                setIsFree(e.target.checked);
                                if (e.target.checked) setPrice('0');
                                else setPrice('');
                            }}
                            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label htmlFor="isFree" className="ml-2 text-sm text-gray-300 cursor-pointer">
                            無料で受け取る（ステーキング/ボーナス）
                        </label>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
            >
                {loading ? '追加中...' : '取引を追加'}
            </button>
        </form>
    );
}
