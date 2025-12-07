'use client';

import { useState } from 'react';
import { Transaction, updateTransaction, syncPrices } from '@/lib/api';
import { X } from 'lucide-react';

interface EditTransactionModalProps {
    transaction: Transaction;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditTransactionModal({ transaction, onClose, onSuccess }: EditTransactionModalProps) {
    const [symbol, setSymbol] = useState(transaction.symbol);
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [price, setPrice] = useState(transaction.price_at_purchase.toString());
    const [isFree, setIsFree] = useState(transaction.price_at_purchase === 0);
    const [date, setDate] = useState(new Date(transaction.purchased_at).toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateTransaction(transaction.id, {
                symbol,
                amount: parseFloat(amount),
                price_at_purchase: parseFloat(price),
                purchased_at: new Date(date).toISOString(),
            });
            await syncPrices();
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to update transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-white">取引を編集</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="w-full bg-gray-700 text-white rounded p-2 border border-gray-600 focus:border-blue-500 focus:outline-none disabled:opacity-50"
                            required
                            disabled={isFree}
                        />
                        <div className="mt-2 flex items-center">
                            <input
                                type="checkbox"
                                id="editIsFree"
                                checked={isFree}
                                onChange={(e) => {
                                    setIsFree(e.target.checked);
                                    if (e.target.checked) setPrice('0');
                                }}
                                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <label htmlFor="editIsFree" className="ml-2 text-sm text-gray-300 cursor-pointer">
                                無料で受け取る（ステーキング/ボーナス）
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        >
                            キャンセル
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? '保存中...' : '保存'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
