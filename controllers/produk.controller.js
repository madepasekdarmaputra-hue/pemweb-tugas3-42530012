const ProdukModel = require('../models/produk.model');

// Menampilkan daftar produk
exports.getDaftarProduk = async (req, res) => {
    try {
        const produkList = await ProdukModel.getAll();

        res.render('pages/produk-list', {
            pageTitle: 'Daftar Inventaris Produk',
            produkList: produkList
        });

    } catch (error) {
        console.error('[ERROR getDaftarProduk]:', error);
        res.status(500).send(
            'Terjadi galat internal peladen saat mengambil data.'
        );
    }
};

// Menampilkan formulir tambah produk
exports.getFormTambah = (req, res) => {
    res.render('pages/produk-form-tambah', {
        pageTitle: 'Form Tambah Produk Baru'
    });
};

// Memproses penyimpanan produk

// Memproses penyimpanan produk
exports.postTambahProduk = async (req, res) => {
    try {
        console.log('[DEBUG] Data formulir:', req.body);

        const { nama_produk, kategori, harga, stok } = req.body;

        console.log('[DEBUG] Nilai harga:', harga);

        // Validasi dinonaktifkan sementara untuk pengujian laboratorium

        await ProdukModel.create({
            nama_produk,
            kategori,
            harga,
            stok
        });

        console.log(
            `[DATABASE] Data "${nama_produk}" berhasil di-insert.`
        );

        res.redirect('/produk');

    } catch (error) {
        console.error('[ERROR postTambahProduk]:', error);

        res.status(500).send(error.message);
    }
};


// Menampilkan form edit produk
exports.getFormEdit = async (req, res) => {
    try {
        const { id } = req.params;

        const produk = await ProdukModel.getById(id);

        if (!produk) {
            return res.status(404).send('Produk tidak ditemukan.');
        }

        res.render('pages/produk-form-edit', {
            pageTitle: 'Edit Data Produk',
            produk: produk
        });

    } catch (error) {
        console.error('[ERROR getFormEdit]:', error);
        res.status(500).send('Galat internal saat memuat form edit.');
    }
};

// Memproses update produk
exports.postUpdateProduk = async (req, res) => {
    try {
        const { id } = req.params;
        const { nama_produk, kategori, harga, stok } = req.body;

        await ProdukModel.update(id, {
            nama_produk,
            kategori,
            harga,
            stok
        });

        console.log(`[DATABASE] Record ID ${id} berhasil diperbarui.`);

        res.redirect('/produk');

    } catch (error) {
        console.error('[ERROR postUpdateProduk]:', error);
        res.status(500).send('Gagal memperbarui record data.');
    }
};

// Memproses penghapusan produk
exports.postHapusProduk = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await ProdukModel.delete(id);

        if (result.affectedRows === 0) {
            console.warn(`[DATABASE] Tidak ada record yang terhapus untuk ID ${id}`);
        } else {
            console.log(`[DATABASE] Record ID ${id} berhasil dihapus.`);
        }

        res.redirect('/produk');

    } catch (error) {
        console.error('[ERROR postHapusProduk]:', error);
        res.status(500).send('Gagal menghapus entitas dari basis data.');
    }
};