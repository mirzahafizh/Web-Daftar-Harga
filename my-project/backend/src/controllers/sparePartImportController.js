
const XLSX = require('xlsx');
const { Op } = require('sequelize');
const { SparePart } = require('../models');
const sequelize = require('../config/database');

const normalizeHeader = (value) => {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');
};

const parsePrice = (value) => {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
    }

    if (value === null || value === undefined || value === '') {
        return null;
    }

    let text = String(value)
        .replace(/rp/gi, '')
        .replace(/\s/g, '')
        .trim();

    // Format angka Indonesia: 1.500.000 atau 1.500.000,50
    if (text.includes(',')) {
        text = text.replace(/\./g, '').replace(',', '.');
    } else {
        // Format angka dengan pemisah ribuan titik
        text = text.replace(/\./g, '');
    }

    const number = Number(text);

    return Number.isFinite(number) ? number : null;
};

exports.importExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Silakan pilih file Excel terlebih dahulu.',
            });
        }

        const workbook = XLSX.read(req.file.buffer, {
            type: 'buffer',
            cellDates: false,
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            return res.status(400).json({
                success: false,
                message: 'Worksheet tidak ditemukan.',
            });
        }

        const rows = XLSX.utils.sheet_to_json(worksheet, {
            defval: null,
            raw: true,
        });

        if (!rows.length) {
            return res.status(400).json({
                success: false,
                message: 'File Excel tidak memiliki data.',
            });
        }

        // Cocokkan nama kolom Excel.
        const firstRow = rows[0];
        const headerMap = {};

        Object.keys(firstRow).forEach((header) => {
            headerMap[normalizeHeader(header)] = header;
        });

        const partNumberColumn = headerMap['partnumber'];
        const descriptionColumn = headerMap['description'];
        const retailPriceColumn = headerMap['retailprice'];
        const discCodeColumn = headerMap['disccode'];

        if (
            !partNumberColumn ||
            !descriptionColumn ||
            !retailPriceColumn ||
            !discCodeColumn
        ) {
            return res.status(400).json({
                success: false,
                message: 'Kolom Excel tidak sesuai. Pastikan terdapat kolom Part Number, Description, Retail Price, dan Disc Code.',
                detected_headers: Object.keys(firstRow),
            });
        }

        const validData = [];
        const invalidDetails = [];
        const seenPartNumbers = new Set();

        let duplicateInFile = 0;

        rows.forEach((row, index) => {
            const partNumber = String(row[partNumberColumn] ?? '').trim();
            const description = String(row[descriptionColumn] ?? '').trim();
            const retailPrice = parsePrice(row[retailPriceColumn]);

            const discCodeValue = row[discCodeColumn];
            const discCode =
                discCodeValue === null || discCodeValue === undefined
                    ? null
                    : String(discCodeValue).trim();

            if (!partNumber || !description || retailPrice === null || retailPrice < 0) {
                invalidDetails.push({
                    row: index + 2,
                    part_number: partNumber || null,
                    reason: 'Part Number, Description, atau Retail Price tidak valid.',
                });

                return;
            }

            if (seenPartNumbers.has(partNumber)) {
                duplicateInFile++;
            }

            seenPartNumbers.add(partNumber);

            // Jika Part Number muncul berulang, data terakhir yang digunakan.
            const existingIndex = validData.findIndex(
                (item) => item.part_number === partNumber
            );

            const newData = {
                part_number: partNumber,
                description,
                retail_price: retailPrice,
                disc_code: discCode,
            };

            if (existingIndex !== -1) {
                validData[existingIndex] = newData;
            } else {
                validData.push(newData);
            }
        });

        if (!validData.length) {
            return res.status(400).json({
                success: false,
                message: 'Tidak ada data valid yang dapat diimpor.',
                summary: {
                    total_rows: rows.length,
                    imported: 0,
                    updated: 0,
                    duplicate_in_file: duplicateInFile,
                    invalid: invalidDetails.length,
                },
                skipped_details: invalidDetails.slice(0, 200),
            });
        }

        const transaction = await sequelize.transaction();

        try {
            const partNumbers = validData.map((item) => item.part_number);

            // Cari Part Number yang sudah ada di database.
            const existingParts = await SparePart.findAll({
                attributes: ['part_number'],
                where: {
                    part_number: {
                        [Op.in]: partNumbers,
                    },
                },
                transaction,
            });

            const existingSet = new Set(
                existingParts.map((item) => item.part_number)
            );

            const updatedCount = validData.filter((item) =>
                existingSet.has(item.part_number)
            ).length;

            const importedCount = validData.length - updatedCount;

            // Insert data baru dan update data lama berdasarkan Part Number.
            const chunkSize = 1000;

            for (let i = 0; i < validData.length; i += chunkSize) {
                const chunk = validData.slice(i, i + chunkSize);

                await SparePart.bulkCreate(chunk, {
                    updateOnDuplicate: [
                        'description',
                        'retail_price',
                        'disc_code',
                        'updated_at',
                    ],
                    transaction,
                });
            }

            await transaction.commit();

            return res.status(200).json({
                success: true,
                message: 'Import Excel berhasil diproses.',
                summary: {
                    sheet: sheetName,
                    total_rows: rows.length,
                    processed: validData.length,
                    imported: importedCount,
                    updated: updatedCount,
                    duplicate_in_file: duplicateInFile,
                    invalid: invalidDetails.length,
                },
                skipped_details: invalidDetails.slice(0, 200),
            });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('IMPORT EXCEL ERROR:', error);

        return res.status(500).json({
            success: false,
            message: 'Gagal mengimpor file Excel.',
            error: error.message,
        });
    }
};
