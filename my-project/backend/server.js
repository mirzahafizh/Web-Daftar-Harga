
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./src/config/database');
const sparePartRoutes = require('./src/routes/sparePartRoutes');
const authRoutes = require('./src/routes/authRoutes');
const discountCodeRoutes = require('./src/routes/discountCodeRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
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

app.use('/api/auth', authRoutes);

app.use('/api/discount-codes', discountCodeRoutes);
// Port server
const PORT = process.env.PORT || 5000;

// Jalankan server
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
