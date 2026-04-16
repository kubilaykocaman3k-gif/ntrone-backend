/**
 * routes/dashboard.js
 * Dashboard KPI Özeti
 *
 * GET /api/dashboard → Tek istekte tüm özet verileri döner
 */

const express  = require('express');
const Contact  = require('../models/Contact');
const Deal     = require('../models/Deal');
const Quote    = require('../models/Quote');
const { Ticket } = require('../models/other-models');
const { protect } = require('../middleware/auth');

const router = express.Router();
// router.use(protect);

router.get('/', async (req, res) => {
  try {
    const [
      totalContacts,
      hotContacts,
      totalDeals,
      wonDeals,
      openTickets,
      totalQuotes,
    ] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'hot' }),
      Deal.countDocuments(),
      Deal.countDocuments({ stage: 'kazanildi' }),
      Ticket.countDocuments({ status: 'open' }),
      Quote.countDocuments(),
    ]);

    // Pipeline toplam değeri
    const pipeline = await Deal.aggregate([
      { $match: { stage: { $ne: 'kaybedildi' } } },
      { $group: { _id: null, total: { $sum: '$value' } } },
    ]);
    const pipelineValue = pipeline[0]?.total || 0;

    // Son 5 fırsat
    const recentDeals = await Deal.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalContacts,
        hotContacts,
        totalDeals,
        wonDeals,
        openTickets,
        totalQuotes,
        pipelineValue,
        recentDeals,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
