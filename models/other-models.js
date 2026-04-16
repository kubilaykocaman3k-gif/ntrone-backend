/**
 * models/Ticket.js — Destek Talebi
 */
const mongoose = require('mongoose');

const TicketSchema = new mongoose.Schema({
  no:       { type: String },
  subject:  { type: String, required: true },
  client:   { type: String, required: true },
  priority: { type: String, enum: ['high','medium','low'], default: 'medium' },
  status:   { type: String, enum: ['open','in_progress','resolved'], default: 'open' },
  agent:    { type: String, default: '—' },
  notes:    { type: String, default: '' },
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

TicketSchema.pre('save', async function(next) {
  if (!this.no) {
    const count = await mongoose.model('Ticket').countDocuments();
    this.no = `TKT-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

mongoose.model('Ticket', TicketSchema);


/**
 * models/Campaign.js — Pazarlama Kampanyası
 */
const CampaignSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  type:    { type: String, enum: ['email','social','sms'], default: 'email' },
  status:  { type: String, enum: ['draft','active','paused','completed'], default: 'draft' },
  sent:    { type: Number, default: 0 },
  opened:  { type: Number, default: 0 },
  clicked: { type: Number, default: 0 },
  budget:  { type: Number, default: 0 },
  start:   { type: String },
  end:     { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

mongoose.model('Campaign', CampaignSchema);


/**
 * models/Order.js — Sipariş
 */
const OrderSchema = new mongoose.Schema({
  no:       { type: String },
  client:   { type: String, required: true },
  amount:   { type: Number, default: 0 },
  status:   { type: String, enum: ['pending','processing','delivered','cancelled'], default: 'pending' },
  date:     { type: String },
  delivery: { type: String },
  createdBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

OrderSchema.pre('save', async function(next) {
  if (!this.no) {
    const count = await mongoose.model('Order').countDocuments();
    this.no = `SIP-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

mongoose.model('Order', OrderSchema);


/**
 * models/CalEvent.js — Takvim Etkinliği
 */
const CalEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date:  { type: String, required: true }, // YYYY-MM-DD
  time:  { type: String, default: '09:00' },
  type:  { type: String, enum: ['meet','call','task','other'], default: 'meet' },
  color: { type: String, default: '#3B82F6' },
  desc:  { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

mongoose.model('CalEvent', CalEventSchema);


// Hepsini tek dosyadan export et
module.exports = {
  Ticket:    mongoose.model('Ticket'),
  Campaign:  mongoose.model('Campaign'),
  Order:     mongoose.model('Order'),
  CalEvent:  mongoose.model('CalEvent'),
};
