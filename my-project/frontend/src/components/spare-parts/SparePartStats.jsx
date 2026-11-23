
import {
    Package,
    Wallet,
    Tags,
} from 'lucide-react';

import { formatRupiah, formatNumber } from '../../utils/formatters';

const SparePartStats = ({
    totalParts = 0,
    totalRetail = 0,
    totalDiscCodes = 0,
}) => {
    const stats = [
        {
            title: 'Total Spare Part',
            value: formatNumber(totalParts),
            description: 'Jumlah seluruh suku cadang',
            icon: Package,
            iconStyle: 'bg-blue-100 text-blue-700',
        },
        {
            title: 'Total Nilai Retail',
            value: formatRupiah(totalRetail),
            description: 'Akumulasi harga retail',
            icon: Wallet,
            iconStyle: 'bg-emerald-100 text-emerald-700',
        },
        {
            title: 'Jenis Disc Code',
            value: formatNumber(totalDiscCodes),
            description: 'Jumlah kode diskon berbeda',
            icon: Tags,
            iconStyle: 'bg-amber-100 text-amber-700',
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((item) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    {item.title}
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-slate-800">
                                    {item.value}
                                </h3>

                                <p className="mt-1 text-xs text-slate-400">
                                    {item.description}
                                </p>
                            </div>

                            <div
                                className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.iconStyle}`}
                            >
                                <Icon size={22} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SparePartStats;
