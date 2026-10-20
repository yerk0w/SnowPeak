import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import crypto from 'node:crypto';

const app = express();
const db = new Database('snowpeak.db');
const TOKEN_SECRET = 'snowpeak-lab-demo-secret-2026';
db.pragma('journal_mode = WAL');
app.use(cors());
app.use(express.json());

db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL,
    price INTEGER NOT NULL, old_price INTEGER, rating REAL NOT NULL,
    image TEXT NOT NULL, description TEXT NOT NULL, badge TEXT
  );
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, customer_name TEXT NOT NULL,
    phone TEXT NOT NULL, email TEXT, delivery TEXT NOT NULL, address TEXT,
    items_json TEXT NOT NULL, total INTEGER NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL,
    message TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer', created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, customer_name TEXT NOT NULL,
    phone TEXT NOT NULL, reservation_date TEXT NOT NULL, reservation_time TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 1, comment TEXT, status TEXT NOT NULL DEFAULT 'Новая',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);
try { db.exec("ALTER TABLE orders ADD COLUMN status TEXT NOT NULL DEFAULT 'Новый'"); } catch {}

const hashPassword = (password) => crypto.createHash('sha256').update(`${password}:snowpeak`).digest('hex');
const makeToken = (user) => {
  const payload = Buffer.from(JSON.stringify({ id: user.id, name: user.name, role: user.role })).toString('base64url');
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};
const readUser = (req) => {
  const token = req.get('authorization')?.replace('Bearer ', '');
  if (!token) return null;
  const [payload, signature] = token.split('.');
  const expected = payload ? crypto.createHmac('sha256', TOKEN_SECRET).update(payload).digest('base64url') : '';
  if (!payload || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try { return JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch { return null; }
};
const adminOnly = (req, res, next) => { const user = readUser(req); if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Доступ только для администратора.' }); req.user = user; next(); };

if (!db.prepare("SELECT id FROM users WHERE email = 'admin@snowpeak.kz'").get()) {
  db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)').run('Администратор Snowpeak', 'admin@snowpeak.kz', hashPassword('snowpeak2026'), 'admin');
}

const count = db.prepare('SELECT COUNT(*) AS count FROM products').get().count;
if (!count) {
  const insert = db.prepare(`INSERT INTO products (id,name,category,price,old_price,rating,image,description,badge)
    VALUES (@id,@name,@category,@price,@oldPrice,@rating,@image,@description,@badge)`);
  const products = [
    { id: 1, name: 'Лыжи Nordic Flow 84', category: 'Лыжи', price: 89990, oldPrice: 99990, rating: 4.9, image: '⛷️', description: 'Универсальные горные лыжи для уверенных спусков.', badge: 'Хит' },
    { id: 2, name: 'Сноуборд Alpine Core', category: 'Сноуборды', price: 74990, oldPrice: null, rating: 4.8, image: '🏂', description: 'Стабильная доска с отзывчивым прогибом.', badge: 'Новинка' },
    { id: 3, name: 'Шлем Frost Guard', category: 'Экипировка', price: 18990, oldPrice: 21990, rating: 4.7, image: '⛑️', description: 'Лёгкая защита с регулируемой вентиляцией.', badge: '-14%' },
    { id: 4, name: 'Маска Ice Vision Pro', category: 'Экипировка', price: 24990, oldPrice: null, rating: 4.9, image: '🥽', description: 'Контрастная линза для переменчивой погоды.', badge: null },
    { id: 5, name: 'Ботинки Summit 90', category: 'Ботинки', price: 56990, oldPrice: 62990, rating: 4.6, image: '🥾', description: 'Тёплые ботинки с точной посадкой.', badge: '-10%' },
    { id: 6, name: 'Палки Carbon Trail', category: 'Аксессуары', price: 12990, oldPrice: null, rating: 4.8, image: '🎿', description: 'Прочные и лёгкие палки из карбона.', badge: null }
  ];
  const seed = db.transaction((items) => items.forEach((item) => insert.run(item)));
  seed(products);
}

app.get('/api/products', (req, res) => {
  const { category = 'Все' } = req.query;
  const rows = category === 'Все'
    ? db.prepare('SELECT * FROM products').all()
    : db.prepare('SELECT * FROM products WHERE category = ?').all(category);
  res.json(rows.map((row) => ({ ...row, oldPrice: row.old_price })));
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !password || password.length < 6) return res.status(400).json({ error: 'Укажите имя, корректный email и пароль от 6 символов.' });
  try {
    const result = db.prepare('INSERT INTO users (name,email,password_hash) VALUES (?,?,?)').run(name.trim(), email.trim().toLowerCase(), hashPassword(password));
    const user = { id: result.lastInsertRowid, name: name.trim(), role: 'customer' };
    res.status(201).json({ user, token: makeToken(user) });
  } catch { res.status(409).json({ error: 'Этот email уже зарегистрирован.' }); }
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const row = db.prepare('SELECT id,name,email,role,password_hash FROM users WHERE email = ?').get((email || '').trim().toLowerCase());
  if (!row || row.password_hash !== hashPassword(password || '')) return res.status(401).json({ error: 'Неверный email или пароль.' });
  const user = { id: row.id, name: row.name, role: row.role };
  res.json({ user, token: makeToken(user) });
});

app.post('/api/orders', (req, res) => {
  const { name, phone, email = '', delivery, address = '', items, total } = req.body;
  if (!name || !phone || !delivery || !Array.isArray(items) || !items.length || !Number.isFinite(total)) {
    return res.status(400).json({ error: 'Заполните обязательные поля и добавьте товар в корзину.' });
  }
  const result = db.prepare(`INSERT INTO orders (customer_name,phone,email,delivery,address,items_json,total)
    VALUES (?,?,?,?,?,?,?)`).run(name.trim(), phone.trim(), email.trim(), delivery, address.trim(), JSON.stringify(items), total);
  res.status(201).json({ id: result.lastInsertRowid, message: 'Заказ принят. Менеджер свяжется с вами в ближайшее время.' });
});

app.post('/api/reservations', (req, res) => {
  const { name, phone, date, time, guests = 1, comment = '' } = req.body;
  if (!name || !phone || !date || !time) return res.status(400).json({ error: 'Заполните имя, телефон, дату и время брони.' });
  const user = readUser(req);
  const result = db.prepare(`INSERT INTO reservations (user_id,customer_name,phone,reservation_date,reservation_time,guests,comment)
    VALUES (?,?,?,?,?,?,?)`).run(user?.id || null, name.trim(), phone.trim(), date, time, Math.max(1, Number(guests) || 1), comment.trim());
  res.status(201).json({ id: result.lastInsertRowid, message: 'Бронь создана. Мы подтвердим её по телефону.' });
});

app.post('/api/feedback', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'Заполните все поля формы.' });
  db.prepare('INSERT INTO feedback (name,email,message) VALUES (?,?,?)').run(name.trim(), email.trim(), message.trim());
  res.status(201).json({ message: 'Спасибо! Сообщение отправлено.' });
});

app.get('/api/crm/overview', adminOnly, (req, res) => {
  const orders = db.prepare('SELECT id,customer_name,phone,email,delivery,total,status,created_at FROM orders ORDER BY id DESC').all();
  const reservations = db.prepare('SELECT id,customer_name,phone,reservation_date,reservation_time,guests,status,comment,created_at FROM reservations ORDER BY id DESC').all();
  const feedback = db.prepare('SELECT id,name,email,message,created_at FROM feedback ORDER BY id DESC').all();
  const customers = db.prepare("SELECT id,name,email,role,created_at FROM users WHERE role = 'customer' ORDER BY id DESC").all();
  res.json({ stats: { orders: orders.length, reservations: reservations.length, feedback: feedback.length, customers: customers.length }, orders, reservations, feedback, customers });
});

app.patch('/api/crm/orders/:id', adminOnly, (req, res) => {
  const allowed = ['Новый', 'Подтверждён', 'Собирается', 'Передан в доставку', 'Завершён', 'Отменён'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Недопустимый статус.' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ message: 'Статус заказа обновлён.' });
});

app.patch('/api/crm/reservations/:id', adminOnly, (req, res) => {
  const allowed = ['Новая', 'Подтверждена', 'Завершена', 'Отменена'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Недопустимый статус.' });
  db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(req.body.status, req.params.id);
  res.json({ message: 'Статус брони обновлён.' });
});

app.listen(3001, () => console.log('Snowpeak API: http://localhost:3001'));
