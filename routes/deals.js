/**
 * routes/deals.js — Fırsatlar
 */
const express = require('express');
const Deal    = require('../models/Deal');
const { protect } = require('../middleware/auth');
const router  = express.Router();
router.use(protect);

router.get('/',     async (req, res) => {
  try {
    const filter = {};
    if (req.query.stage) filter.stage = req.query.stage;
    const deals = await Deal.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: deals.length, data: deals });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

router.post('/',    async (req, res) => {
  try {
    const deal = await Deal.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: deal });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.put('/:id',  async (req, res) => {
  try {
    const deal = await Deal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!deal) return res.status(404).json({ success: false, message: 'Fırsat bulunamadı' });
    res.json({ success: true, data: deal });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Deal.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Fırsat silindi' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;


// ─── Diğer route dosyaları aynı pattern'i takip eder ─────────────────────────
// Aşağıdakiler routes/ altında ayrı dosyalar olarak kaydedilecek:
