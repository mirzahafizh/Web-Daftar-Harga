
import { X, Save, Package } from 'lucide-react';

const SparePartModal = ({
    isOpen,
    editingPart,
    form,
    setForm,
    onClose,
    onSubmit,
    saving = false,
}) => {
    if (!isOpen) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
            <div className="my-auto w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#013880]">
                            <Package size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-slate-800">
                                {editingPart ? 'Edit Spare Part' : 'Tambah Spare Part'}
                            </h2>

                            <p className="text-xs text-slate-500">
                                Lengkapi informasi suku cadang Hyundai.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="space-y-5 px-6 py-6">
                        <div>
                            <label
                                htmlFor="part_number"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Part Number <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                id="part_number"
                                name="part_number"
                                value={form.part_number || ''}
                                onChange={handleChange}
                                required
                                placeholder="Contoh: 26300-35504"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#013880] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Description <span className="text-red-500">*</span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={form.description || ''}
                                onChange={handleChange}
                                required
                                rows={3}
                                placeholder="Masukkan deskripsi spare part..."
                                className="w-full resize-none rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#013880] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="retail_price"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Retail Price <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="number"
                                id="retail_price"
                                name="retail_price"
                                value={form.retail_price ?? ''}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                placeholder="Masukkan harga retail"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#013880] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="disc_code"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Disc Code
                            </label>

                            <input
                                type="text"
                                id="disc_code"
                                name="disc_code"
                                value={form.disc_code ?? ''}
                                onChange={handleChange}
                                placeholder="Contoh: A, B, C, 0"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-[#013880] focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div className="rounded-lg bg-blue-50 p-4">
                            <p className="text-xs font-semibold text-[#013880]">
                                Informasi Perhitungan
                            </p>

                            <p className="mt-1 text-xs leading-relaxed text-blue-700">
                                PPN 11% dan Harga PPN 11% akan dihitung secara otomatis
                                berdasarkan Retail Price. Nilainya tidak perlu diinput.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
                        >
                            Batal
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#013880] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#0B5CAD] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <Save size={16} />

                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SparePartModal;
