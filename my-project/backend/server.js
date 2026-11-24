
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./src/config/database');
const sparePartRoutes = require('./src/routes/sparePartRoutes');
const authRoutes = require('./src/routes/authRoutes');
const discountCodeRoutes = require('./src/routes/discountCodeRoutes');

const app = express();

// Daftar alamat frontend yang diizinkan
const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,
].filter(Boolean);

// Middleware CORS
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin tidak diizinkan oleh CORS.'));
    },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route utama
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Hyundai Parts API berjalan.',
    });
});

// API suku cadang
app.use('/api/spare-parts', sparePartRoutes);

// API autentikasi
app.use('/api/auth', authRoutes);

// API kode diskon
app.use('/api/discount-codes', discountCodeRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan pada server.',
    });
});

// Jalankan server hanya di lingkungan lokal
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    const startServer = async () => {
        try {
            await sequelize.authenticate();

            console.log('Database MySQL berhasil terhubung.');

            app.listen(PORT, () => {
                console.log(`Server berjalan di http://localhost:${PORT}`);
            });
        } catch (error) {
            console.error('Gagal menghubungkan database:', error.message);
            process.exit(1);
        }
    };

    startServer();
}

// Export aplikasi untuk Vercel
module.exports = app;
