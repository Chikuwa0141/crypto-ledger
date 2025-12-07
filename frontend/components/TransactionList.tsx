import { Transaction, deleteTransaction } from '@/lib/api';
import { Trash2, Pencil, Download } from 'lucide-react';
import { useState } from 'react';
import EditTransactionModal from './EditTransactionModal';

export default function TransactionList({ transactions, onDelete }: { transactions: Transaction[], onDelete: () => void }) {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm('本当に削除しますか？')) return;
        try {
            await deleteTransaction(id);
            onDelete();
        } catch (error) {
            console.error('Failed to delete:', error);
            alert('削除に失敗しました');
        }
    };

    const handleDownloadCSV = () => {
        const headers = ['ID', '日付', '通貨', '数量', '購入単価(円)', '支払い総額(円)'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => {
                const date = new Date(t.purchased_at).toLocaleDateString();
                const total = Math.floor(t.amount * t.price_at_purchase);
                return [
                    t.id,
                    date,
                    t.symbol,
                    t.amount.toLocaleString('en-US', { maximumFractionDigits: 20, useGrouping: false }),
                    t.price_at_purchase,
                    total
                ].join(',');
            })
        ].join('\n');

        const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-700">
                <h2 className="text-xl font-bold text-white">取引履歴</h2>
                <button
                    onClick={handleDownloadCSV}
                    className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-md text-sm transition-colors"
                >
                    <Download size={16} />
                    CSVダウンロード
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-gray-700 text-gray-100 uppercase text-sm">
                        <tr>
                            <th className="py-3 px-6">日付</th>
                            <th className="py-3 px-6">通貨</th>
                            <th className="py-3 px-6 text-right">数量</th>
                            <th className="py-3 px-6 text-right">購入単価 (円)</th>
                            <th className="py-3 px-6 text-right">合計 (円)</th>
                            <th className="py-3 px-6 text-center">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {transactions.map((t) => (
                            <tr key={t.id} className="hover:bg-gray-750 transition-colors">
                                <td className="py-4 px-6">{new Date(t.purchased_at).toLocaleDateString()}</td>
                                <td className="py-4 px-6 font-medium text-white">{t.symbol}</td>
                                <td className="py-4 px-6 text-right">{t.amount.toLocaleString(undefined, { maximumFractionDigits: 12 })}</td>
                                <td className="py-4 px-6 text-right">{t.price_at_purchase.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="py-4 px-6 text-right">{(t.amount * t.price_at_purchase).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                <td className="py-4 px-6 text-center flex justify-center gap-2">
                                    <button
                                        onClick={() => setEditingTransaction(t)}
                                        className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                        title="編集"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors p-1"
                                        title="削除"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-8 text-center text-gray-500">
                                    取引データがありません。
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {editingTransaction && (
                <EditTransactionModal
                    transaction={editingTransaction}
                    onClose={() => setEditingTransaction(null)}
                    onSuccess={onDelete}
                />
            )}
        </div>
    );
}
