/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { Percent, Save, RefreshCw, Info } from 'lucide-react';
import api from '../services/api';

export default function DiscountCodes() {
    const [discountCodes, setDiscountCodes] = useState([]);
    const [percentages, setPercentages] = useState({});
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState(null);
    const [notification, setNotification] = useState(null);

    const showNotification = (type, message) => {
        setNotification({ type, message });

        setTimeout(() => {
            setNotification(null);
        }, 3500);
    };

    const fetchDiscountCodes = async () => {
        try {
            setLoading(true);

            const response = await api.get('/discount-codes');
            const data = response.data.data || [];

            setDiscountCodes(data);

            const initialPercentages = {};

            data.forEach((item) => {
                initialPercentages[item.id] = Number(item.percentage);
            });

            setPercentages(initialPercentages);
        } catch (error) {
            showNotification(
                'error',
                error.response?.data?.message ||
                    'Gagal mengambil data Disc Code.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscountCodes();
    }, []);

    const handlePercentageChange = (id, value) => {
        setPercentages((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSave = async (item) => {
        const percentage = Number(percentages[item.id]);

        if (
            percentages[item.id] === '' ||
            !Number.isFinite(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            showNotification(
                'error',
                'Persentase diskon harus antara 0 sampai 100.'
            );
            return;
        }

        try {
            setSavingId(item.id);

            const response = await api.put(
                `/discount-codes/${item.id}`,
                { percentage }
            );

            showNotification(
                'success',
                response.data.message || 'Persentase berhasil diperbarui.'
            );

            await fetchDiscountCodes();
        } catch (error) {
            showNotification(
                'error',
                error.response?.data?.message ||
                    'Gagal memperbarui persentase diskon.'
            );
        } finally {
            setSavingId(null);
        }
    };

    const hasChanged = (item) => {
        return Number(percentages[item.id]) !== Number(item.percentage);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Pengaturan Diskon
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Atur persentase diskon berdasarkan Disc Code.
                    </p>
                </div>

                <button
                    onClick={fetchDiscountCodes}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Muat Ulang
                </button>
            </div>

            {notification && (
                <div
                    className={`rounded-lg border p-4 text-sm ${
                        notification.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                >
                    {notification.message}
                </div>
            )}

            <div className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <Info className="mt-0.5 shrink-0 text-blue-600" size={20} />
                <div className="text-sm text-blue-800">
                    <p className="font-semibold">Informasi Pengaturan Diskon</p>
                    <p className="mt-1">
                        Disc Code 0 selalu memiliki diskon 0% dan tidak dapat
                        diubah. Kode lainnya dapat diatur antara 0% sampai
                        100%.
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="font-semibold text-slate-800">
                        Daftar Persentase Diskon
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        {discountCodes.length} Disc Code terdaftar
                    </p>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        Memuat data diskon...
                    </div>
                ) : discountCodes.length === 0 ? (
                    <div className="p-10 text-center text-sm text-slate-500">
                        Belum ada data Disc Code.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-50 text-slate-600">
                                <tr>
                                    <th className="px-5 py-4 text-left font-semibold">
                                        Disc Code
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold">
                                        Persentase Diskon
                                    </th>
                                    <th className="px-5 py-4 text-left font-semibold">
                                        Status
                                    </th>
                                    <th className="px-5 py-4 text-right font-semibold">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {discountCodes.map((item) => {
                                    const isZero = item.code === '0';
                                    const changed = hasChanged(item);

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50">
                                            <td className="px-5 py-4">
                                                <span className="inline-flex min-w-10 items-center justify-center rounded-lg bg-blue-100 px-3 py-2 font-bold text-blue-700">
                                                    {item.code}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="relative max-w-40">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="100"
                                                        step="0.01"
                                                        value={percentages[item.id] ?? ''}
                                                        disabled={isZero || savingId === item.id}
                                                        onChange={(e) =>
                                                            handlePercentageChange(
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-9 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500"
                                                    />
                                                    <Percent
                                                        size={15}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                                    />
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                {isZero ? (
                                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                                        Tanpa Diskon
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                        Dapat Diatur
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {!isZero && (
                                                    <button
                                                        onClick={() => handleSave(item)}
                                                        disabled={!changed || savingId === item.id}
                                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                                    >
                                                        <Save size={14} />
                                                        {savingId === item.id
                                                            ? 'Menyimpan...'
                                                            : 'Simpan'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
