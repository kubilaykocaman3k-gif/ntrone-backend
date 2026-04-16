/**
 * ============================================================
 * NTRONE CRM — server.js
 * Ana Sunucu Dosyası
 * ============================================================
 *
 * Bu dosya uygulamanın kalbidir.
 * Express sunucusunu kurar, tüm route'ları bağlar ve
 * MongoDB'ye bağlanarak sunucuyu başlatır.
 *
 * Çalıştırmak için:
 *   node server.js          → Normal başlatma
 *   npm run dev             → Otomatik yenileme (nodemon)
 * ============================================================
 */

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');

/* .env dosyasını yükle */
dotenv.config();

/* MongoDB'ye bağlan */
connectDB();

/* Express uygulaması */
const app = express();

/* ── Middleware'ler ─────────────────────────── */

/* CORS — Tüm kaynaklara izin ver (demo modu) */
app.use(cors());

/* JSON body okuma */
app.use(express.json());

/* ── Route'lar ──────────────────────────────── */
app.use('/api/auth',       require('./routes/auth'));
app.use('/api/contacts',   require('./routes/contacts'));
app.use('/api/deals',      require('./routes/deals'));
app.use('/api/quotes',     require('./routes/quotes'));
app.use('/api/tickets',    require('./routes/tickets'));
app.use('/api/campaigns',  require('./routes/campaigns'));
app.use('/api/orders',     require('./routes/orders'));
app.use('/api/calendar',   require('./routes/calendar'));
app.use('/api/dashboard',  require('./routes/dashboard'));
app.use('/api/seed',       require('./routes/seed')); // Sadece ilk kurulumda kullanın

/* ── Sağlık Kontrolü ────────────────────────── */
/* Bu adrese istek atarak sunucunun çalıştığını kontrol edebilirsiniz */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Ntrone CRM API çalışıyor',
    time:    new Date().toISOString(),
  });
});

/* ── 404 Handler ────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `${req.path} bulunamadı` });
});

/* ── Genel Hata Handler ─────────────────────── */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Sunucu hatası' });
});

/* ── Sunucuyu Başlat ────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   Ntrone CRM API Çalışıyor          ║
  ║   Port: ${PORT}                          ║
  ║   http://localhost:${PORT}/api/health   ║
  ╚══════════════════════════════════════╝
  `);
});
