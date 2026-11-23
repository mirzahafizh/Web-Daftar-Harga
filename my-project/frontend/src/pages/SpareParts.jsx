
/* eslint-disable react-hooks/set-state-in-effect */

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import {
    Search,
    CheckCircle,
    AlertCircle,
    X,
} from 'lucide-react';

import api from '../services/api';

import SparePartHeader from '../components/spare-parts/SparePartHeader';
import SparePartStats from '../components/spare-parts/SparePartStats';
import SparePartTable from '../components/spare-parts/SparePartTable';
import SparePartPagination from '../components/spare-parts/SparePartPagination';
import SparePartModal from '../components/spare-parts/SparePartModal';
import ImportResult from '../components/spare-parts/ImportResult';

const emptyForm = {
    part_number: '',
    description: '',
    retail_price: '',
    disc_code: '',
};

export default function SpareParts() {
    const fileInputRef = useRef(null);

    // Data spare part.
    const [parts, setParts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Modal tambah dan edit.
    const [modalOpen, setModalOpen] = useState(false);
    const [editingPart, setEditingPart] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    // Import Excel.
    const [importLoading, setImportLoading] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [importError, setImportError] = useState('');

    // Notifikasi.
    const [notification, setNotification] = useState({
        type: '',
        message: '',
    });

    // Pagination.
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Menampilkan notifikasi.
    const showNotification = (type, message) => {
        setNotification({ type, message });

        setTimeout(() => {
            setNotification({
                type: '',
                message: '',
            });
        }, 4000);
    };

    // Mengambil data dari backend.
    const fetchParts = useCallback(async () => {
        try {
            setLoading(true);

            const response = await api.get('/spare-parts');

            const result =
                response.data.data ||
                response.data.spareParts ||
                response.data;

            setParts(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error('Gagal mengambil spare part:', error);

            showNotification(
                'error',
                error.response?.data?.message ||
                    'Gagal mengambil data spare part.'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchParts();
    }, [fetchParts]);

    // Pencarian.
    const filteredParts = useMemo(() => {
        const keyword = search.toLowerCase().trim();

        if (!keyword) return parts;

        return parts.filter((part) => {
            return (
                String(part.part_number || '')
                    .toLowerCase()
                    .includes(keyword) ||

                String(part.description || '')
                    .toLowerCase()
                    .includes(keyword) ||

                String(part.disc_code || '')
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [parts, search]);

    // Statistik.
    const statistics = useMemo(() => {
        const totalRetail = parts.reduce(
            (total, part) => {
                return total + Number(part.retail_price || 0);
            },
            0
        );

        const uniqueDiscCodes = new Set(
            parts
                .map((part) => part.disc_code)
                .filter(
                    (code) =>
                        code !== null &&
                        code !== undefined &&
                        String(code).trim() !== ''
                )
                .map(String)
        );

        return {
            total: parts.length,
            totalRetail,
            totalDiscCodes: uniqueDiscCodes.size,
        };
    }, [parts]);

    // Pagination.
    const totalPages = Math.max(
        1,
        Math.ceil(filteredParts.length / itemsPerPage)
    );

    const paginatedParts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;

        return filteredParts.slice(
            start,
            start + itemsPerPage
        );
    }, [filteredParts, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // Membuka modal tambah.
    const openCreateModal = () => {
        setEditingPart(null);
        setForm(emptyForm);
        setModalOpen(true);
    };

    // Membuka modal edit.
    const openEditModal = (part) => {
        setEditingPart(part);

        setForm({
            part_number: part.part_number || '',
            description: part.description || '',
            retail_price: part.retail_price ?? '',
            disc_code: part.disc_code ?? '',
        });

        setModalOpen(true);
    };

    // Menutup modal.
    const closeModal = () => {
        if (saving) return;

        setModalOpen(false);
        setEditingPart(null);
        setForm(emptyForm);
    };

    // Menyimpan data.
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !form.part_number.trim() ||
            !form.description.trim() ||
            form.retail_price === ''
        ) {
            showNotification(
                'error',
                'Part Number, Description, dan Retail Price wajib diisi.'
            );

            return;
        }

        const retailPrice = Number(form.retail_price);

        if (!Number.isFinite(retailPrice) || retailPrice < 0) {
            showNotification(
                'error',
                'Retail Price harus berupa angka yang valid.'
            );

            return;
        }

        const payload = {
            part_number: form.part_number.trim(),
            description: form.description.trim(),
            retail_price: retailPrice,
            disc_code: form.disc_code.trim() || null,
        };

        try {
            setSaving(true);

            if (editingPart) {
                await api.put(
                    `/spare-parts/${editingPart.id}`,
                    payload
                );

                showNotification(
                    'success',
                    'Data spare part berhasil diperbarui.'
                );
            } else {
                await api.post(
                    '/spare-parts',
                    payload
                );

                showNotification(
                    'success',
                    'Spare part berhasil ditambahkan.'
                );
            }

            setModalOpen(false);
            setEditingPart(null);
            setForm(emptyForm);

            await fetchParts();

        } catch (error) {
            showNotification(
                'error',
                error.response?.data?.message ||
                    'Gagal menyimpan data spare part.'
            );
        } finally {
            setSaving(false);
        }
    };

    // Menghapus data.
    const handleDelete = async (part) => {
        const confirmed = window.confirm(
            `Apakah kamu yakin ingin menghapus spare part ${part.part_number}?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/spare-parts/${part.id}`);

            showNotification(
                'success',
                'Spare part berhasil dihapus.'
            );

            await fetchParts();

        } catch (error) {
            showNotification(
                'error',
                error.response?.data?.message ||
                    'Gagal menghapus spare part.'
            );
        }
    };

    // Membuka pemilih file Excel.
    const openImportDialog = () => {
        fileInputRef.current?.click();
    };

    // Import Excel.
    const handleImportExcel = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const extension = file.name
            .substring(file.name.lastIndexOf('.'))
            .toLowerCase();

        if (!['.xlsx', '.xls'].includes(extension)) {
            setImportError(
                'Format file harus Excel (.xlsx atau .xls).'
            );

            event.target.value = '';
            return;
        }

        if (file.size > 25 * 1024 * 1024) {
            setImportError(
                'Ukuran file maksimal 25 MB.'
            );

            event.target.value = '';
            return;
        }

        const confirmed = window.confirm(
            `Import file "${file.name}" ke database?\n\nData dengan Part Number yang sudah tersedia akan diperbarui.`
        );

        if (!confirmed) {
            event.target.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setImportLoading(true);
        setImportResult(null);
        setImportError('');

        try {
            const response = await api.post(
                '/spare-parts/import',
                formData
            );

            const data = response.data;

            // Menyesuaikan hasil import dari backend.
            // Mendukung data yang berada di root maupun di dalam summary.
            const summaryData = data.summary || data;

            setImportResult({
                ...data,
                summary: {
                    ...summaryData,
                    skipped_details:
                        summaryData.skipped_details ||
                        data.skipped_details ||
                        [],
                },
            });

            showNotification(
                'success',
                'Proses import Excel berhasil.'
            );

            await fetchParts();

        } catch (error) {
            const message =
                error.response?.data?.message ||
                'Gagal mengimpor file Excel.';

            setImportError(message);

            showNotification('error', message);

        } finally {
            setImportLoading(false);
            event.target.value = '';
        }
    };

    // Menutup hasil import.
    const closeImportResult = () => {
        setImportResult(null);
    };

    return (
        <div className="space-y-6">

            {/* Input Excel */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImportExcel}
            />

            {/* Header */}
            <SparePartHeader
                onImport={openImportDialog}
                onRefresh={fetchParts}
                onAdd={openCreateModal}
                importLoading={importLoading}
                loading={loading}
            />

            {/* Notifikasi */}
            {notification.message && (
                <div
                    className={`flex items-center gap-3 rounded-xl border p-4 text-sm ${
                        notification.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                    }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle size={19} />
                    ) : (
                        <AlertCircle size={19} />
                    )}

                    <span className="flex-1">
                        {notification.message}
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setNotification({
                                type: '',
                                message: '',
                            })
                        }
                    >
                        <X size={17} />
                    </button>
                </div>
            )}

            {/* Error Import */}
            {importError && (
                <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle size={20} className="shrink-0" />

                    <div className="flex-1">
                        <p className="font-semibold">
                            Import Excel gagal
                        </p>

                        <p className="mt-1">
                            {importError}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setImportError('')}
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Hasil Import */}
            <ImportResult
                result={importResult}
                onClose={closeImportResult}
            />

            {/* Statistik */}
            <SparePartStats
                totalParts={statistics.total}
                totalRetail={statistics.totalRetail}
                totalDiscCodes={statistics.totalDiscCodes}
            />

            {/* Tabel dan Pencarian */}
            <div className="space-y-4">

                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            Data Spare Part
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Menampilkan {filteredParts.length.toLocaleString('id-ID')} data spare part.
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-sm">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Cari Part Number, Description, Disc Code..."
                            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#013880] focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                </div>

                <SparePartTable
                    parts={paginatedParts}
                    loading={loading}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                />

                {!loading && filteredParts.length > 0 && (
                    <SparePartPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={filteredParts.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                )}

            </div>

            {/* Modal Tambah/Edit */}
            <SparePartModal
                isOpen={modalOpen}
                editingPart={editingPart}
                form={form}
                setForm={setForm}
                onClose={closeModal}
                onSubmit={handleSubmit}
                saving={saving}
            />

        </div>
    );
}
