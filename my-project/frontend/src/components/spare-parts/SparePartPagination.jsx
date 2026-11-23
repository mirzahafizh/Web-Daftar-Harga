
import {
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

import { formatNumber } from '../../utils/formatters';

const SparePartPagination = ({
    currentPage = 1,
    totalPages = 1,
    totalItems = 0,
    itemsPerPage = 20,
    onPageChange,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const startItem = (currentPage - 1) * itemsPerPage + 1;

    const endItem = Math.min(
        currentPage * itemsPerPage,
        totalItems
    );

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let page = start; page <= end; page++) {
            pages.push(page);
        }

        return pages;
    };

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
                Menampilkan{' '}
                <span className="font-semibold text-slate-700">
                    {formatNumber(startItem)} - {formatNumber(endItem)}
                </span>{' '}
                dari{' '}
                <span className="font-semibold text-slate-700">
                    {formatNumber(totalItems)}
                </span>{' '}
                data
            </p>

            <div className="flex flex-wrap items-center gap-1">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Halaman sebelumnya"
                >
                    <ChevronLeft size={17} />
                </button>

                {getPageNumbers().map((page) => (
                    <button
                        key={page}
                        type="button"
                        onClick={() => onPageChange(page)}
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                            currentPage === page
                                ? 'bg-[#013880] text-white'
                                : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {formatNumber(page)}
                    </button>
                ))}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title="Halaman berikutnya"
                >
                    <ChevronRight size={17} />
                </button>
            </div>
        </div>
    );
};

export default SparePartPagination;
