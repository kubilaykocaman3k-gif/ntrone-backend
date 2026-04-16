/**
 * models/Contact.js
 * Kişi Modeli
 *
 * Frontend'deki CONTACTS[] dizisinin kalıcı hali.
 * Her alan birebir örtüşmektedir.
 */

const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema({
  name:    { type: String, required: true, trim: true },
  title:   { type: String, default: '' },
  company: { type: String, default: '' },
  email:   { type: String, required: true, trim: true, lowercase: true },
  phone:   { type: String, default: '' },
  status:  { type: String, enum: ['hot','warm','cold','new'], default: 'new' },
  score:   { type: Number, default: 50, min: 0, max: 100 },
  city:    { type: String, default: '' },
  source:  { type: String, default: 'Web Sitesi' },

  /* Kimin oluşturduğu — Auth sonrası doldurulur */
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true }); // createdAt, updatedAt otomatik eklenir

module.exports = mongoose.model('Contact', ContactSchema);
