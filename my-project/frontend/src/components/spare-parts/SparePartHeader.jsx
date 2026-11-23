
import {
    Plus,
    FileSpreadsheet,
    RefreshCw,
} from 'lucide-react';

const SparePartHeader = ({
    onImport,
    onRefresh,
    onAdd,
    importLoading = false,
    loading = false,
}) => {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Daftar Suku Cadang
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Kelola data dan harga suku cadang asli Hyundai.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <button
                    type="button"
                    onClick={onRefresh}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <RefreshCw
                        size={16}
                        className={loading ? 'animate-spin' : ''}
                    />
                    Refresh
                </button>

                <button
                    type="button"
                    onClick={onImport}
                    disabled={importLoading}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 px-3 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <FileSpreadsheet size={16} />
                    {importLoading ? 'Mengimpor...' : 'Import Excel'}
                </button>

                <button
                    type="button"
                    onClick={onAdd}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#013880] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B5CAD]"
                >
                    <Plus size={17} />
                    Tambah Spare Part
                </button>
            </div>
        </div>
    );
};

export default SparePartHeader;
