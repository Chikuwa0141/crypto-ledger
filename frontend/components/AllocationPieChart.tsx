'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AllocationPieChartProps {
    btcValue: number;
    ethValue: number;
}

export default function AllocationPieChart({ btcValue, ethValue }: AllocationPieChartProps) {
    const data = [
        { name: 'BTC', value: btcValue },
        { name: 'ETH', value: ethValue },
    ].filter(item => item.value > 0).sort((a, b) => b.value - a.value);

    const COLORS = ['#f7931a', '#627eea'];

    if (data.length === 0) {
        return (
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8 h-80 flex items-center justify-center text-gray-500">
                データがありません
            </div>
        );
    }

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">資産構成比率</h2>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#fff' }}
                            itemStyle={{ color: '#fff' }}
                            formatter={(value: number) => [`¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, '']}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{ color: '#9ca3af' }}
                            formatter={(value, entry: any) => {
                                const total = data.reduce((sum, item) => sum + item.value, 0);
                                const percent = (entry.payload.value / total * 100).toFixed(1);
                                return <span className="text-gray-300 ml-2">{value} ({percent}%)</span>;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
