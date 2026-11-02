const express = require('express');
const router = express.Router();

const ProdukModel = require('../models/produk.model');
const produkController = require('../controllers/produk.controller');

// Menampilkan daftar produk
router.get('/produk', produkController.getDaftarProduk);

// Menampilkan form tambah produk
router.get('/produk/tambah', produkController.getFormTambah);

// Memproses tambah produk
router.post('/produk/tambah', produkController.postTambahProduk);

// Menampilkan form edit produk berdasarkan ID
router.get('/produk/edit/:id', produkController.getFormEdit);

// Memproses perubahan data produk
router.post('/produk/edit/:id', produkController.postUpdateProduk);

// Memproses penghapusan produk
router.post('/produk/hapus/:id', produkController.postHapusProduk);

// Endpoint Pengujian SQL Injection
router.get('/uji-keamanan', async (req, res) => {
    try {
        const inputPayload = req.query.kategori || '';

 // SKENARIO A: METODE TIDAK AMAN
// const hasil = await ProdukModel.getByKategoriInsecure(inputPayload);

// SKENARIO B: METODE AMAN
const hasil = await ProdukModel.getByKategoriSecure(inputPayload);

        res.json({
            input: inputPayload,
            totalDataDitemukan: hasil.length,
            data: hasil
        });

    } catch (error) {
        console.error('[ERROR UJI KEAMANAN]:', error.message);

        res.status(500).json({
            error: 'Gagal menjalankan pengujian keamanan.'
        });
    }
});

module.exports = router;