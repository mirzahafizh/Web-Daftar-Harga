
const express = require('express');
const multer = require('multer');

const router = express.Router();

const sparePartController = require('../controllers/sparePartController');
const sparePartImportController = require('../controllers/sparePartImportController');
const authMiddleware = require('../middleware/authMiddleware');

// Penyimpanan file sementara di memory.
const upload = multer({
    storage: multer.memoryStorage(),

    limits: {
        fileSize: 25 * 1024 * 1024, // Maksimal 25 MB
    },

    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.xlsx', '.xls'];
        const extension = require('path')
            .extname(file.originalname)
            .toLowerCase();

        if (!allowedExtensions.includes(extension)) {
            return cb(
                new Error('Format file harus Excel (.xlsx atau .xls).')
            );
        }

        cb(null, true);
    },
});

// Semua endpoint spare part wajib login sebagai admin.
router.use(authMiddleware);

// IMPORT EXCEL
// Harus diletakkan sebelum route /:id.
router.post(
    '/import',
    upload.single('file'),
    sparePartImportController.importExcel
);

// CRUD SPARE PART
router.get('/', sparePartController.getAll);

router.get('/:id', sparePartController.getById);

router.post('/', sparePartController.create);

router.put('/:id', sparePartController.update);

router.delete('/:id', sparePartController.remove);

module.exports = router;
