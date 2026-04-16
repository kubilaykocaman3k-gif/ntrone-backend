const mongoose = require('mongoose');

const QuoteSchema = new mongoose.Schema({
  no:      { type: String },
  client:  { type: String, required: true },
  contact: { type: String, default: '' },
  amount:  { type: Number, default: 0 },
  tax:     { type: Number, default: 20 },
  status:  { type: String, enum: ['draft','sent','approved','rejected'], default: 'draft' },
  date:    { type: String },
  valid:   { type: String },
  notes:   { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

/* Otomatik teklif no üret */
QuoteSchema.pre('save', async function(next) {
  if (!this.no) {
    const count = await mongoose.model('Quote').countDocuments();
    this.no = `TKL-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Quote', QuoteSchema);
