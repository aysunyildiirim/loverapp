import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

dotenv.config();

// Beklenmedik hataları yakalamak için (Sunucunun çökmemesi için)
process.on('uncaughtException', (err) => {
  console.error('BEKLENMEDİK HATA:', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// CORS ayarları: Frontend'in sunucuya erişebilmesi için şart
app.use(cors());
app.use(express.json());

// Resim yükleme ayarları
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Veritabanı Bağlantısı
console.log("DATABASE_URL var mı:", !!process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Neon.tech ve Render için bu ayar zorunludur
  }
});

// --- API ENDPOINTLERİ ---

// Anılar (Memories)
app.get('/api/memories', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM paylasimlar ORDER BY tarih DESC");
    res.json(result.rows || []);
  } catch (err) {
    console.error("/api/memories hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memories', upload.single('resim'), async (req, res) => {
  try {
    const { aciklama } = req.body;
    const resim_adi = req.file ? req.file.filename : null;
    const result = await pool.query(
      "INSERT INTO paylasimlar (baslik, aciklama, resim_adi) VALUES ($1, $2, $3) RETURNING *",
      ['Anı', aciklama, resim_adi]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("/api/memories POST hatası:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/memories/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM paylasimlar WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Anı bulunamadı' });
    res.json({ message: 'Anı silindi', deleted: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Yapılacaklar (Todos)
app.get('/api/todos', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo_list ORDER BY id ASC");
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { text } = req.body;
    const result = await pool.query("INSERT INTO todo_list (text) VALUES ($1) RETURNING *", [text]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { done } = req.body;
    await pool.query("UPDATE todo_list SET done = $1 WHERE id = $2", [done, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todo_list WHERE id = $1", [id]);
    res.json({ message: "Silindi" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Şarkılar (Songs)
app.get('/api/songs', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM songs ORDER BY id DESC");
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/songs', async (req, res) => {
  try {
    const { title, artist } = req.body;
    const result = await pool.query("INSERT INTO songs (title, artist) VALUES ($1, $2) RETURNING *", [title, artist]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/songs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM songs WHERE id = $1', [id]);
    res.json({ message: 'Şarkı silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hayaller (Dreams)
app.get('/api/dreams', async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM dreams ORDER BY id DESC");
    res.json(result.rows || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/dreams', async (req, res) => {
  try {
    const { category, text } = req.body;
    const result = await pool.query("INSERT INTO dreams (category, text) VALUES ($1, $2) RETURNING *", [category, text]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/dreams/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM dreams WHERE id = $1', [id]);
    res.json({ message: 'Hayal silindi' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUNUCUYU BAŞLATMA (KRİTİK BÖLÜM) ---

async function startServer() {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL bağlantısı başarılı");
    client.release();

    // Render'ın atadığı portu al, yoksa 3000'i kullan
    const PORT = process.env.PORT || 3000;

    // '0.0.0.0' eklemek, sunucunun dış isteklere açık olmasını sağlar
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Sunucu ${PORT} portunda başarıyla çalışıyor`);
    });
  } catch (err) {
    console.error("PostgreSQL bağlantı hatası:", err.message);
    // Hata durumunda Render'ın servisi yeniden başlatması için çıkış yapıyoruz
    process.exit(1);
  }
}

startServer();