
import { useEffect, useState, useCallback } from 'react';
import {
  Package,
  Tags,
  Wallet,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mengambil data spare part dari backend
  const fetchParts = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get('/spare-parts');

      const result =
        response.data.data ||
        response.data.spareParts ||
        response.data;

      setParts(Array.isArray(result) ? result : []);
      setError('');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Gagal mengambil data spare part.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Jalankan fetchParts ketika halaman pertama kali dibuka
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchParts();
  }, [fetchParts]);

  // Format harga ke Rupiah
  const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);
  };

  // Statistik spare part
  const totalNilai = parts.reduce(
    (total, item) => total + Number(item.retail_price || 0),
    0
  );

  const totalDiscCode = new Set(
    parts
      .map((item) => item.disc_code)
      .filter(Boolean)
  ).size;

  const rataRataHarga = parts.length
    ? totalNilai / parts.length
    : 0;

  const stats = [
    {
      title: 'Total Spare Part',
      value: loading ? '...' : parts.length,
      description: 'Jumlah data spare part',
      icon: Package,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Total Disc Code',
      value: loading ? '...' : totalDiscCode,
      description: 'Kode diskon terdaftar',
      icon: Tags,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Total Nilai Retail',
      value: loading ? '...' : formatRupiah(totalNilai),
      description: 'Akumulasi harga retail',
      icon: Wallet,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      title: 'Rata-rata Harga',
      value: loading ? '...' : formatRupiah(rataRataHarga),
      description: 'Rata-rata harga per spare part',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="space-y-8">

      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Ringkasan informasi data spare part Hyundai.
          </p>
        </div>

        <Link
          to="/spare-parts"
          className="inline-flex items-center justify-center gap-2 bg-[#002C5F] hover:bg-[#003B7A] text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
        >
          <Package size={18} />
          Kelola Spare Part
        </Link>
      </div>

      {/* Error Notification */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-slate-500 font-medium">
                    {stat.title}
                  </p>

                  <h3 className="text-xl font-bold text-slate-800 mt-3 break-words">
                    {stat.value}
                  </h3>
                </div>

                <div className={`p-3 rounded-xl shrink-0 ${stat.color}`}>
                  <Icon size={23} />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Spare Parts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-800">
              Data Spare Part Terbaru
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Daftar spare part yang tersimpan di database.
            </p>
          </div>

          <Link
            to="/spare-parts"
            className="text-sm font-semibold text-[#0057A8] hover:underline inline-flex items-center gap-2"
          >
            Lihat semua
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">

            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold">No</th>
                <th className="px-6 py-4 font-semibold">Part Number</th>
                <th className="px-6 py-4 font-semibold">Description</th>
                <th className="px-6 py-4 font-semibold">Retail Price</th>
                <th className="px-6 py-4 font-semibold">Disc Code</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : parts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-slate-400"
                  >
                    Belum ada data spare part.
                  </td>
                </tr>
              ) : (
                parts.slice(0, 5).map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-4 text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-6 py-4 font-semibold text-[#002C5F] whitespace-nowrap">
                      {item.part_number}
                    </td>

                    <td className="px-6 py-4 text-slate-600 min-w-48">
                      {item.description}
                    </td>

                    <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                      {formatRupiah(item.retail_price)}
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      {item.disc_code || '-'}
                    </td>
                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
