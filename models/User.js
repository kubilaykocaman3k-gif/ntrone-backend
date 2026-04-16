/**
 * models/User.js
 * Kullanıcı Modeli
 *
 * Sisteme giriş yapabilecek CRM kullanıcıları.
 * Şifre kayıt öncesi otomatik hash'lenir (bcrypt).
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: [true, 'Ad Soyad zorunludur'],
    trim:     true,
  },
  email: {
    type:      String,
    required:  [true, 'E-posta zorunludur'],
    unique:    true,        // Aynı e-posta iki kez kayıt olamaz
    lowercase: true,
    trim:      true,
  },
  password: {
    type:     String,
    required: [true, 'Şifre zorunludur'],
    minlength: 6,
    select:   false,        // Sorgularda şifre varsayılan olarak gelmez
  },
  role: {
    type:    String,
    enum:    ['admin', 'manager', 'sales', 'support'],
    default: 'sales',
  },
  status: {
    type:    String,
    enum:    ['active', 'inactive'],
    default: 'active',
  },
  avatar: String,           // Profil fotoğrafı URL'i (ileride)
  createdAt: {
    type:    Date,
    default: Date.now,
  },
});

/* ── Şifreyi kayıt öncesi hash'le ──────────── */
UserSchema.pre('save', async function (next) {
  // Şifre değişmemişse atla
  if (!this.isModified('password')) return next();

  // bcrypt ile 10 tur hash'le
  const salt     = await bcrypt.genSalt(10);
  this.password  = await bcrypt.hash(this.password, salt);
  next();
});

/* ── Şifre karşılaştırma metodu ────────────── */
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
