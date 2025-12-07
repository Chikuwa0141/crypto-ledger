'use client';

import { PortfolioPoint } from '@/lib/api';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Brush } from 'recharts';

export default function PortfolioChart({ data }: { data: PortfolioPoint[] }) {
    if (data.length === 0) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 h-64 flex items-center justify-center text-gray-500">
                データがありません。取引を追加してください。
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">資産推移</h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorInvest" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#627eea" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#627eea" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f7931a" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f7931a" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#627eea" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#627eea" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis
                            dataKey="date"
                            stroke="#9ca3af"
                            tickFormatter={(str: string) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tickFormatter={(val: number) => `¥${(val / 10000).toFixed(0)}万`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff' }}
                            formatter={(value: number) => [`¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '']}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#9ca3af' }} />
                        <Area
                            type="monotone"
                            dataKey="total_value"
                            name="総評価額"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="total_investment"
                            name="投資額"
                            stroke="#10b981"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorInvest)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="btc_value"
                            name="BTC評価額"
                            stroke="#f7931a"
                            strokeWidth={2}
                            fillOpacity={0.3}
                            fill="url(#colorBtc)"
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="eth_value"
                            name="ETH評価額"
                            stroke="#627eea"
                            strokeWidth={2}
                            fillOpacity={0.3}
                            fill="url(#colorEth)"
                            isAnimationActive={false}
                        />
                        <Brush
                            dataKey="date"
                            height={30}
                            stroke="#9ca3af"
                            fill="#1f2937"
                            tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
