/**
 * middleware/auth.js
 * JWT Kimlik Doğrulama Middleware
 *
 * Korumalı route'larda kullanılır.
 * Her istekte "Authorization: Bearer TOKEN" header'ını kontrol eder.
 * Token geçerliyse req.user'a kullanıcı bilgisini ekler.
 */

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Header'da Bearer token var mı?
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // "Bearer TOKEN" → "TOKEN"
      token = req.headers.authorization.split(' ')[1];

      // Token'ı doğrula ve içindeki kullanıcı id'sini al
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Kullanıcıyı DB'den çek (şifre hariç)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Devam et
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Oturum geçersiz, lütfen tekrar giriş yapın' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Bu işlem için giriş yapmanız gerekiyor' });
  }
};

module.exports = { protect };
