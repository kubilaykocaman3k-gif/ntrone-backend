/**
 * routes/seed.js
 * Demo Veri Yükleyici
 *
 * GET /api/seed → Veritabanını örnek verilerle doldurur
 *
 * SADECE GELİŞTİRME / İLK KURULUM için kullanın!
 * Canlıda bu route'u kapatın.
 */

const express  = require('express');
const User     = require('../models/User');
const Contact  = require('../models/Contact');
const Deal     = require('../models/Deal');
const Quote    = require('../models/Quote');
const { Ticket, Campaign } = require('../models/other-models');

const router = express.Router();

router.post('/run', async (req, res) => {
  try {
    // Mevcut verileri temizle
    await Promise.all([
      User.deleteMany({}),
      Contact.deleteMany({}),
      Deal.deleteMany({}),
      Quote.deleteMany({}),
      Ticket.deleteMany({}),
      Campaign.deleteMany({}),
    ]);

    // Admin kullanıcı oluştur
    const admin = await User.create({
      name:     'Ntrone Yönetici',
      email:    'admin@ntrone.com',
      password: 'ntrone2025',
      role:     'admin',
    });

    // Demo kişiler
    const contacts = await Contact.insertMany([
      { name:'Ahmet Yılmaz',  title:'Yazılım Müdürü',    company:'TechCorp A.Ş.', email:'ahmet@techcorp.com',    phone:'+90 532 111 2233', status:'hot',  score:92, city:'İstanbul', source:'Referans',   createdBy:admin._id },
      { name:'Zeynep Demir',  title:'Pazarlama Dir.',    company:'Innova Ltd.',   email:'z.demir@innova.com',    phone:'+90 542 222 3344', status:'warm', score:78, city:'Ankara',   source:'Web Sitesi', createdBy:admin._id },
      { name:'Mehmet Kaya',   title:'CEO',               company:'StartupX',      email:'mkaya@startupx.io',     phone:'+90 555 333 4455', status:'hot',  score:88, city:'İzmir',    source:'LinkedIn',   createdBy:admin._id },
      { name:'Elif Şahin',   title:'Genel Müdür Yrd.', company:'MegaCorp',      email:'elif@megacorp.com',     phone:'+90 542 666 7788', status:'hot',  score:95, city:'İstanbul', source:'Referans',   createdBy:admin._id },
      { name:'Burak Tan',     title:'IT Direktörü',     company:'NetSoft A.Ş.', email:'b.tan@netsoft.com.tr',  phone:'+90 532 555 6677', status:'cold', score:42, city:'Bursa',    source:'Soğuk Arama',createdBy:admin._id },
    ]);

    // Demo fırsatlar
    await Deal.insertMany([
      { name:'TechCorp Lisans',       company:'TechCorp A.Ş.', contact:'Ahmet Yılmaz', value:84000, stage:'muzakere',   prob:92, close:'2025-04-15', createdBy:admin._id },
      { name:'StartupX Entegrasyon',  company:'StartupX',       contact:'Mehmet Kaya',  value:48000, stage:'teklif',     prob:75, close:'2025-04-30', createdBy:admin._id },
      { name:'MegaCorp Danışmanlık',  company:'MegaCorp',       contact:'Elif Şahin',  value:56000, stage:'kazanildi',  prob:100,close:'2025-03-28', createdBy:admin._id },
      { name:'Innova SaaS',           company:'Innova Ltd.',    contact:'Zeynep Demir', value:19200, stage:'potansiyel', prob:30, close:'2025-06-01', createdBy:admin._id },
    ]);

    // Demo destek talepleri
    await Ticket.insertMany([
      { subject:'Giriş yapılamıyor',  client:'TechCorp A.Ş.', priority:'high',   status:'open',        agent:'—',        createdBy:admin._id },
      { subject:'Fatura hatası',      client:'StartupX',       priority:'medium', status:'in_progress', agent:'Ayşe K.',  createdBy:admin._id },
    ]);

    res.json({
      success: true,
      message: 'Demo veriler yüklendi!',
      credentials: {
        email:    'admin@ntrone.com',
        password: 'ntrone2025',
        note:     'İlk girişten sonra şifrenizi değiştirin!',
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
