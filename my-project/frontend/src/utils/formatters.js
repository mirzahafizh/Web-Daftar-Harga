
export const formatRupiah = (value) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
};

export const formatNumber = (value) => {
    return new Intl.NumberFormat('id-ID', {
        maximumFractionDigits: 0,
    }).format(Number(value) || 0);
};

// Menghitung PPN 11%
export const calculatePpn = (price) => {
    return Number(price || 0) * 0.11;
};

// Menghitung harga setelah PPN 11%
export const calculatePriceWithPpn = (price) => {
    return Number(price || 0) * 1.11;
};
