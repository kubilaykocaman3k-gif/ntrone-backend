/**
 * routes/contacts.js
 * Kişiler API Route'ları
 *
 * GET    /api/contacts          → Tüm kişileri listele
 * POST   /api/contacts          → Yeni kişi ekle
 * PUT    /api/contacts/:id      → Kişiyi güncelle
 * DELETE /api/contacts/:id      → Kişiyi sil
 *
 * Tüm route'lar korumalıdır (JWT gerekli).
 */

const express = require('express');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const router = express.Router();

// NOT: Login sistemi eklenince aşağıdaki satırı açın:
// router.use(protect);

/* ── GET /api/contacts ────────────────────── */
router.get('/', async (req, res) => {
  try {
    // Arama ve filtre desteği
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      const s = new RegExp(req.query.search, 'i'); // büyük/küçük harf duyarsız
      filter.$or = [{ name: s }, { email: s }, { company: s }];
    }

    const contacts = await Contact.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/contacts ───────────────────── */
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ── PUT /api/contacts/:id ────────────────── */
router.put('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!contact) return res.status(404).json({ success: false, message: 'Kişi bulunamadı' });
    res.json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

/* ── DELETE /api/contacts/:id ─────────────── */
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Kişi bulunamadı' });
    res.json({ success: true, message: 'Kişi silindi' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
