/**
 * routes/auth.js
 * Kimlik Doğrulama Route'ları
 *
 * POST /api/auth/register → Yeni kullanıcı kaydı
 * POST /api/auth/login    → Giriş yap, token al
 * GET  /api/auth/me       → Token ile mevcut kullanıcı bilgisi
 */

const express = require('express');
const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

/* ── Token üretici yardımcı fonksiyon ────── */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

/* ── POST /api/auth/register ──────────────── */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Aynı email var mı?
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Bu e-posta zaten kayıtlı' });
    }

    // Kullanıcı oluştur (şifre model içinde hash'lenir)
    const user = await User.create({ name, email, password, role: role || 'sales' });

    res.status(201).json({
      success: true,
      token:   generateToken(user._id),
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── POST /api/auth/login ─────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-posta ve şifre gerekli' });
    }

    // Kullanıcıyı bul (şifreyle birlikte)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı' });
    }

    // Şifre doğru mu?
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'E-posta veya şifre hatalı' });
    }

    res.json({
      success: true,
      token:   generateToken(user._id),
      user: {
        id:    user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ── GET /api/auth/me ─────────────────────── */
/* Token ile kim olduğumu öğren */
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
