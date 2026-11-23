
import {
    CheckCircle,
    AlertCircle,
    X,
    FileSpreadsheet,
    Plus,
    RefreshCw,
    Copy,
    AlertTriangle,
} from 'lucide-react';

import { formatNumber } from '../../utils/formatters';

const ImportResult = ({
    result,
    onClose,
}) => {
    if (!result) {
        return null;
    }

    const summary = result.summary || result;

    const imported = Number(summary.imported || 0);
    const updated = Number(summary.updated || 0);
    const duplicate = Number(summary.duplicate_in_file || 0);
    const invalid = Number(summary.invalid || 0);

    const skippedDetails = summary.skipped_details || [];

    const items = [
        {
            label: 'Data Ditambahkan',
            value: imported,
            icon: Plus,
            style: 'bg-emerald-50 text-emerald-700',
        },
        {
            label: 'Data Diperbarui',
            value: updated,
            icon: RefreshCw,
            style: 'bg-blue-50 text-blue-700',
        },
        {
            label: 'Duplikat dalam Excel',
            value: duplicate,
            icon: Copy,
            style: 'bg-amber-50 text-amber-700',
        },
        {
            label: 'Data Tidak Valid',
            value: invalid,
            icon: AlertTriangle,
            style: 'bg-red-50 text-red-700',
        },
    ];

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start justify-between border-b border-slate-200 bg-emerald-50 px-5 py-4">
                <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                        <CheckCircle size={21} />
                    </div>

                    <div>
                        <h3 className="font-semibold text-emerald-800">
                            Import Excel Selesai
                        </h3>

                        <p className="mt-1 text-xs text-emerald-700">
                            {result.message || 'Proses import telah selesai.'}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-emerald-700 transition hover:bg-emerald-100"
                    title="Tutup hasil import"
                >
                    <X size={18} />
                </button>
            </div>

            <div className="p-5">
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {items.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.label}
                                className="rounded-lg border border-slate-100 p-4"
                            >
                                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${item.style}`}>
                                    <Icon size={18} />
                                </div>

                                <p className="text-2xl font-bold text-slate-800">
                                    {formatNumber(item.value)}
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    {item.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                        <FileSpreadsheet size={16} />

                        Total baris:
                        <strong className="text-slate-800">
                            {formatNumber(summary.total_rows || 0)}
                        </strong>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600">
                        <CheckCircle size={16} className="text-emerald-600" />

                        Diproses:
                        <strong className="text-slate-800">
                            {formatNumber(summary.processed || 0)}
                        </strong>
                    </div>
                </div>

                {skippedDetails.length > 0 && (
                    <div className="mt-5">
                        <div className="mb-3 flex items-center gap-2">
                            <AlertCircle
                                size={17}
                                className="text-amber-600"
                            />

                            <h4 className="text-sm font-semibold text-slate-700">
                                Detail Data yang Dilewati
                            </h4>
                        </div>

                        <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200">
                            <table className="w-full text-xs">
                                <thead className="sticky top-0 bg-slate-50 text-left text-slate-500">
                                    <tr>
                                        <th className="px-3 py-2">Baris</th>
                                        <th className="px-3 py-2">Part Number</th>
                                        <th className="px-3 py-2">Keterangan</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {skippedDetails.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-3 py-2 text-slate-600">
                                                {item.row || '-'}
                                            </td>

                                            <td className="px-3 py-2 font-medium text-slate-700">
                                                {item.part_number || '-'}
                                            </td>

                                            <td className="px-3 py-2 text-slate-600">
                                                {item.reason || item.message || '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImportResult;
