
const { SparePart } = require('../models');

// Mengambil seluruh data suku cadang
exports.getAll = async (req, res) => {
  try {
    const spareParts = await SparePart.findAll({
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Data suku cadang berhasil diambil.',
      data: spareParts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mengambil detail suku cadang
exports.getById = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.params.id);

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Data suku cadang tidak ditemukan.',
      });
    }

    res.status(200).json({
      success: true,
      data: sparePart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Menambahkan suku cadang
exports.create = async (req, res) => {
  try {
    const { part_number, description, retail_price, disc_code } = req.body;

    const sparePart = await SparePart.create({
      part_number,
      description,
      retail_price,
      disc_code,
    });

    res.status(201).json({
      success: true,
      message: 'Suku cadang berhasil ditambahkan.',
      data: sparePart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Mengubah suku cadang
exports.update = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.params.id);

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Data suku cadang tidak ditemukan.',
      });
    }

    const { part_number, description, retail_price, disc_code } = req.body;

    await sparePart.update({
      part_number,
      description,
      retail_price,
      disc_code,
    });

    res.status(200).json({
      success: true,
      message: 'Suku cadang berhasil diperbarui.',
      data: sparePart,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Menghapus suku cadang
exports.remove = async (req, res) => {
  try {
    const sparePart = await SparePart.findByPk(req.params.id);

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: 'Data suku cadang tidak ditemukan.',
      });
    }

    await sparePart.destroy();

    res.status(200).json({
      success: true,
      message: 'Suku cadang berhasil dihapus.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
