/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { formatRupiah } from '../../utils/formatters';

export default function SparePartTable({
    parts,
    loading,
    onEdit,
    onDelete,
}) {
    const [discountCodes, setDiscountCodes] = useState([]);
    const [discountLoading, setDiscountLoading] = useState(true);

    // Mengambil persentase diskon dari database
    const fetchDiscountCodes = async () => {
        try {
            setDiscountLoading(true);

            const response = await api.get('/discount-codes');

            setDiscountCodes(response.data.data || []);
        } catch (error) {
            console.error('Gagal mengambil pengaturan diskon:', error);
            setDiscountCodes([]);
        } finally {
            setDiscountLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscountCodes();
    }, []);

    // Mengambil persentase berdasarkan Disc Code
    const getDiscountPercentage = (discCode) => {
        const code = String(discCode ?? '0');

        if (code === '0') {
            return 0;
        }

        const discount = discountCodes.find(
            (item) => String(item.code) === code
        );

        return Number(discount?.percentage || 0);
    };

    // Perhitungan harga
    const calculatePrice = (retailPrice, discCode) => {
        const retail = Number(retailPrice) || 0;
        const discountPercentage = getDiscountPercentage(discCode);

        // Harga retail setelah dikurangi diskon
        const discountAmount = retail * (discountPercentage / 100);
        const priceAfterDiscount = retail - discountAmount;

        // PPN 11% dihitung dari harga setelah diskon
        const ppn = priceAfterDiscount * 0.11;

        // Harga akhir setelah diskon dan PPN
        const finalPrice = priceAfterDiscount + ppn;

        return {
            discountPercentage,
            discountAmount,
            priceAfterDiscount,
            ppn,
            finalPrice,
        };
    };

    if (loading || discountLoading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                <RefreshCw
                    size={24}
                    className="mx-auto animate-spin text-blue-700"
                />
                <p className="mt-3 text-sm text-slate-500">
                    Memuat data spare part dan pengaturan diskon...
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1500px] text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-4 text-center font-semibold">
                                No
                            </th>

                            <th className="px-4 py-4 text-left font-semibold">
                                Part Number
                            </th>

                            <th className="px-4 py-4 text-left font-semibold">
                                Description
                            </th>

                            <th className="px-4 py-4 text-right font-semibold">
                                Retail Price
                            </th>

                            <th className="px-4 py-4 text-center font-semibold">
                                Disc Code
                            </th>

                            <th className="px-4 py-4 text-center font-semibold">
                                Diskon (%)
                            </th>

                            <th className="px-4 py-4 text-right font-semibold">
                                Harga Retail - Diskon
                            </th>

                            <th className="px-4 py-4 text-right font-semibold">
                                PPN 11%
                            </th>

                            <th className="px-4 py-4 text-right font-semibold">
                                Harga After Disc + PPN
                            </th>

                            <th className="px-4 py-4 text-center font-semibold">
                                Aksi
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                        {parts.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="10"
                                    className="px-4 py-12 text-center text-slate-500"
                                >
                                    Tidak ada data spare part.
                                </td>
                            </tr>
                        ) : (
                            parts.map((part, index) => {
                                const price = calculatePrice(
                                    part.retail_price,
                                    part.disc_code
                                );

                                return (
                                    <tr
                                        key={part.id}
                                        className="hover:bg-slate-50"
                                    >
                                        <td className="px-4 py-4 text-center text-slate-500">
                                            {index + 1}
                                        </td>

                                        <td className="px-4 py-4 font-semibold text-blue-700 whitespace-nowrap">
                                            {part.part_number}
                                        </td>

                                        <td className="px-4 py-4 text-slate-700">
                                            {part.description}
                                        </td>

                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {formatRupiah(part.retail_price)}
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <span className="inline-flex min-w-9 justify-center rounded-md bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                                                {part.disc_code || '0'}
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <span className="font-semibold text-blue-700">
                                                {price.discountPercentage.toLocaleString('id-ID', {
                                                    maximumFractionDigits: 2,
                                                })}%
                                            </span>
                                        </td>

                                        <td className="px-4 py-4 text-right whitespace-nowrap font-medium text-slate-700">
                                            {formatRupiah(price.priceAfterDiscount)}
                                        </td>

                                        <td className="px-4 py-4 text-right whitespace-nowrap text-slate-600">
                                            {formatRupiah(price.ppn)}
                                        </td>

                                        <td className="px-4 py-4 text-right whitespace-nowrap font-bold text-green-700">
                                            {formatRupiah(price.finalPrice)}
                                        </td>

                                        <td className="px-4 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => onEdit(part)}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                    title="Edit spare part"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete(part)}
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                                    title="Hapus spare part"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
