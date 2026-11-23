
const express = require('express');
const router = express.Router();

const discountCodeController = require('../controllers/discountCodeController');
const authMiddleware = require('../middleware/authMiddleware');

// Semua route hanya bisa diakses admin yang sudah login
router.use(authMiddleware);

// Mengambil seluruh Disc Code
router.get('/', discountCodeController.getAll);

// Mengubah persentase diskon berdasarkan ID
router.put('/:id', discountCodeController.update);

module.exports = router;
