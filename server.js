const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Faz o servidor entregar o seu index.html, style.css e script.js da mesma pasta
app.use(express.static(__dirname));

let db;

async function initDB() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      image TEXT NOT NULL,
      description TEXT,
      rating REAL DEFAULT 5.0,
      reviewsCount INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productId INTEGER NOT NULL,
      author TEXT NOT NULL,
      rating INTEGER NOT NULL,
      text TEXT NOT NULL,
      date TEXT NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userEmail TEXT NOT NULL,
      items TEXT NOT NULL,
      total REAL NOT NULL,
      date TEXT NOT NULL
    );
  `);

  const count = await db.get('SELECT COUNT(*) as total FROM products');
  if (count.total === 0) {
    const initialProducts = [
      [1, "Jotaro Kujo - JoJo's Bizarre Adventure", "Anime", 429.90, "https://i.pinimg.com/1200x/61/df/39/61df39b47e6fe416dc3d5e53f7728acc.jpg", "Jotaro Kujo com pose iconica e Stand Star Platinum. Figura detalhada da linha Figuarts.", 4.9, 186],
      [2, "Goku Super Saiyan", "Anime", 349.90, "https://i.pinimg.com/736x/5a/52/40/5a52400225d489a296a70a739335cc77.jpg", "Action figure premium do Goku Super Saiyajin.", 4.8, 127],
      [3, "Satoru Gojo", "Anime", 289.90, "https://i.pinimg.com/736x/da/53/51/da5351ee79360c852d3dfec7bd6946d0.jpg", "Figura altamente detalhada inspirada no anime Jujutsu Kaisen.", 4.6, 89],
      [5, "Kira Yoshikage - Jojo's BIzarre Adventure", "Anime", 1020.00, "https://i.pinimg.com/736x/3d/eb/9f/3deb9f52514a734440ced4627b38a3ab.jpg", "Edição premium - Jojo's Bizarre Aventure Diamond is Unbreakable", 5.0, 56],
      [6, "Akaza - Kimetsu no Yaiba", "Anime", 279.90, "https://i.pinimg.com/736x/4b/b3/58/4bb35815b3f3c0710865df2d43e28638.jpg", "akaza - Castelo Infinito - Demon slayer.", 4.7, 154],
      [7, "Hanako-kun Toilet-bound Hanako-kun", "Anime", 150.00, "https://i.pinimg.com/736x/3d/fa/ef/3dfaefa36b81a871cad6e0c268236b61.jpg", "Figure Hanako com base adicional", 4.5, 78],
      [8, "Sebastia & Ciel", "Anime", 329.90, "https://i.pinimg.com/736x/1e/cb/1c/1ecb1cc4effdd57d33b23f56b2e437dc.jpg", "Sebastian & Ciel - Black Butler", 4.8, 112],
      [9, "Nanami - Jujutu Kasen", "Games", 419.00, "https://i.pinimg.com/736x/d2/e7/74/d2e774400884188d4afb3239755dc6de.jpg", "Nanami Kento, pintura premium e base temática de Hyrule.", 4.9, 91],
      [10, "Eren Yeager - Attack on Titan", "Anime", 259.90, "https://i.pinimg.com/736x/83/9d/8d/839d8de10700428357f7d9f6edcade95.jpg", "Action Figure Eren para decoração", 4.6, 67],
      [11, "Luffy Gear 5 - One Piece", "Anime", 350.00, "https://i.pinimg.com/736x/fe/a7/6e/fea76e982c62d6d0f727b8ba944045b0.jpg", "Monkey D. Luffy em forma Gear 5. Efeitos de nuvens e expressão animada. Figura premium para colecionadores de One Piece.", 4.8, 142],
      [12, "Inuyasha", "Anime", 549.00, "https://i.pinimg.com/736x/9f/e1/54/9fe154d4ae18c49eb3429c53fe119ca2.jpg", "Inuyasha com katana. Escala premium, detalhes de cicatrizes e texturas realistas.", 4.9, 72],
      [13, "Vegeta Super Saiyajin Blue", "Anime", 170.00, "https://i.pinimg.com/1200x/78/a4/e9/78a4e9d6a878ec67a6f89a5e4f22248c.jpg", "Vegeta em Super Saiyajin Blue. Efeitos de energia e rosto com expressão de batalha intensa.", 4.7, 85],
      [14, "Stormtrooper - Black Series", "Star Wars", 219.90, "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=400&h=400&fit=crop", "Stormtrooper clássico da linha Black Series. Armadura com detalhes realistas e blaster incluso.", 4.4, 143]
    ];

    const stmt = await db.prepare('INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    for (const p of initialProducts) {
      await stmt.run(p);
    }
    await stmt.finalize();
  }
}

// --- ROTAS DA API ---
app.get('/api/products', async (req, res) => {
  const products = await db.all('SELECT * FROM products');
  res.json(products);
});

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
    res.status(201).json({ name, email });
  } catch (err) {
    res.status(400).json({ error: 'Este e-mail já está cadastrado.' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }
  res.json({ name: user.name, email: user.email });
});

app.get('/api/reviews/:productId', async (req, res) => {
  const reviews = await db.all('SELECT * FROM reviews WHERE productId = ? ORDER BY id DESC', [req.params.productId]);
  res.json(reviews);
});

app.post('/api/reviews', async (req, res) => {
  const { productId, author, rating, text, date } = req.body;
  await db.run(
    'INSERT INTO reviews (productId, author, rating, text, date) VALUES (?, ?, ?, ?, ?)',
    [productId, author, rating, text, date]
  );
  res.status(201).json({ message: 'Avaliação salva!' });
});

app.post('/api/orders', async (req, res) => {
  const { userEmail, items, total } = req.body;
  const date = new Date().toLocaleDateString('pt-BR');
  await db.run(
    'INSERT INTO orders (userEmail, items, total, date) VALUES (?, ?, ?, ?)',
    [userEmail, JSON.stringify(items), total, date]
  );
  res.status(201).json({ message: 'Pedido registrado com sucesso!' });
});

// Abre o index.html quando acessar o site
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Site e servidor rodando em http://localhost:${PORT}`);
  });
});
