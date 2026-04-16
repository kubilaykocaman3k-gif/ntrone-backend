const mongoose = require('mongoose');

const DealSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  company: { type: String, default: '' },
  contact: { type: String, default: '' },
  value:   { type: Number, default: 0 },
  stage:   {
    type:    String,
    enum:    ['potansiyel','nitelikli','teklif','muzakere','kazanildi','kaybedildi'],
    default: 'potansiyel',
  },
  prob:    { type: Number, default: 50, min: 0, max: 100 },
  close:   { type: String, default: '' }, // YYYY-MM-DD
  notes:   { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Deal', DealSchema);
