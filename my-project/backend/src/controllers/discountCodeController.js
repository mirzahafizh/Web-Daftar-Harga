
const { DiscountCode } = require('../models');

// Mengambil seluruh daftar Disc Code
exports.getAll = async (req, res) => {
    try {
        const discountCodes = await DiscountCode.findAll({
            order: [['code', 'ASC']],
        });

        return res.json({
            success: true,
            data: discountCodes,
        });
    } catch (error) {
        console.error('Gagal mengambil Disc Code:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal mengambil data pengaturan diskon.',
        });
    }
};

// Mengubah persentase diskon
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const percentage = Number(req.body.percentage);

        if (
            req.body.percentage === undefined ||
            req.body.percentage === null ||
            req.body.percentage === '' ||
            !Number.isFinite(percentage) ||
            percentage < 0 ||
            percentage > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Persentase diskon harus antara 0 sampai 100.',
            });
        }

        const discountCode = await DiscountCode.findByPk(id);

        if (!discountCode) {
            return res.status(404).json({
                success: false,
                message: 'Disc Code tidak ditemukan.',
            });
        }

        // Kode 0 selalu tanpa diskon
        if (discountCode.code === '0') {
            return res.status(403).json({
                success: false,
                message: 'Disc Code 0 tidak dapat diubah karena tidak memiliki diskon.',
            });
        }

        await discountCode.update({
            percentage,
        });

        return res.json({
            success: true,
            message: `Persentase diskon kode ${discountCode.code} berhasil diperbarui.`,
            data: discountCode,
        });
    } catch (error) {
        console.error('Gagal mengubah Disc Code:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal memperbarui persentase diskon.',
        });
    }
};
