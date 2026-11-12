/* ===== DADOS INICIAIS (simula banco de produtos) ===== */  
    const PRODUCTS = [
  {
    id: 1,
    name: "Jotaro Kujo - JoJo's Bizarre Adventure",
    category: "Anime",
    price: 429.90,
    image: "https://i.pinimg.com/1200x/61/df/39/61df39b47e6fe416dc3d5e53f7728acc.jpg",
    description: "Jotaro Kujo com pose iconica e Stand Star Platinum. Figura detalhada da linha Figuarts.",
    rating: 4.9,
    reviewsCount: 186
  },
  {
    id: 2,
    name: "Goku Super Saiyan",
    category: "Anime",
    price: 349.90,
    image: "https://i.pinimg.com/736x/5a/52/40/5a52400225d489a296a70a739335cc77.jpg",
    description: "Action figure premium do Goku Super Saiyajin.",
    rating: 4.8,
    reviewsCount: 127
  },
  {
    id: 3,
    name: "Satoru Gojo",
    category: "Anime",
    price: 289.90,
    image: "https://i.pinimg.com/736x/da/53/51/da5351ee79360c852d3dfec7bd6946d0.jpg",
    description: "Figura altamente detalhada inspirada no anime Jujutsu Kaisen.",
    rating: 4.6,
    reviewsCount: 89
  },
  {
    id: 5,
    name: "Kira Yoshikage - Jojo's BIzarre Adventure",
    category: "Anime"
    price: 1899.00,
    image: "https://i.pinimg.com/736x/3d/eb/9f/3deb9f52514a734440ced4627b38a3ab.jpg",
    description: "Edição premium - Jojo's Bizarre Aventure Diamond is Unbreakable",
    rating: 5.0,
    reviewsCount: 56
  },
  {
    id: 6,
    name: "Akaza - Kimetsu no Yaiba"
    category: "Marvel",
    price: 279.90,
    image: "https://i.pinimg.com/736x/4b/b3/58/4bb35815b3f3c0710865df2d43e28638.jpg",
    description: "akaza - Castelo Infinito - Demon slayer.",
    rating: 4.7,
    reviewsCount: 154
  },
  {
    id: 7,
    name: "Naruto Uzumaki - Figuarts ZERO",
    category: "Anime",
    price: 389.00,
    image: "https://images.unsplash.com/photo-1613376023733-0fb8673ba2c4?w=400&h=400&fit=crop",
    description: "Naruto em pose de batalha com efeito de Rasengan. Detalhes excepcionais da linha Figuarts ZERO.",
    rating: 4.5,
    reviewsCount: 78
  },
  {
    id: 8,
    name: "Coringa - The Dark Knight Trilogy",
    category: "DC",
    price: 329.90,
    image: "https://images.unsplash.com/photo-1608889825205-eebdb9fc5806?w=400&h=400&fit=crop",
    description: "Coringa inspirado na trilogia de Christopher Nolan. Expressão icônica e acessórios de cards.",
    rating: 4.8,
    reviewsCount: 112
  },
  {
    id: 9,
    name: "Link - Zelda Breath of the Wild",
    category: "Games",
    price: 419.00,
    image: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=400&h=400&fit=crop",
    description: "Link com Master Sword e escudo Hylian. Escala 1/7, pintura premium e base temática de Hyrule.",
    rating: 4.9,
    reviewsCount: 91
  },
  {
    id: 10,
    name: "Wolverine - Marvel Legends",
    category: "Marvel",
    price: 259.90,
    image: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=400&fit=crop",
    description: "Wolverine clássico com garras metálicas intercambiáveis e múltiplas cabeças. Altamente articulado.",
    rating: 4.6,
    reviewsCount: 67
  },
  {
    id: 11,
    name: "Luffy Gear 5 - One Piece",
    category: "Anime",
    price: 489.00,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=400&fit=crop",
    description: "Monkey D. Luffy em forma Gear 5. Efeitos de nuvens e expressão animada. Figura premium para colecionadores de One Piece.",
    rating: 4.8,
    reviewsCount: 142
  },
  {
    id: 12,
    name: "Kratos - God of War Ragnarök",
    category: "Games",
    price: 549.00,
    image: "https://images.unsplash.com/photo-1509248961158-e54f6932459c?w=400&h=400&fit=crop",
    description: "Kratos com o Machado Leviatã e escudo. Escala premium, detalhes de cicatrizes e texturas realistas.",
    rating: 4.9,
    reviewsCount: 72
  },
  {
    id: 13,
    name: "Vegeta Super Saiyajin Blue",
    category: "Anime",
    price: 479.00,
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=400&fit=crop",
    description: "Vegeta em Super Saiyajin Blue. Efeitos de energia e rosto com expressão de batalha intensa.",
    rating: 4.7,
    reviewsCount: 85
  },
  {
    id: 14,
    name: "Stormtrooper - Black Series",
    category: "Star Wars",
    price: 219.90,
    image: "https://images.unsplash.com/photo-1472457897821-70d3819a0e24?w=400&h=400&fit=crop",
    description: "Stormtrooper clássico da linha Black Series. Armadura com detalhes realistas e blaster incluso.",
    rating: 4.4,
    reviewsCount: 143
  }
];

/* ===== ESTADO DA APLICAÇÃO ===== */
let currentUser = null;
let cart = [];
let currentProductId = null;
let selectedRating = 0;
let activeCategory = "all";
let searchTerm = "";
let minPrice = null;
let maxPrice = null;

/* ===== UTILITÁRIOS DE STORAGE (simula banco de dados) ===== */
function getUsers() {
  return JSON.parse(localStorage.getItem("af_users") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("af_users", JSON.stringify(users));
}

function getReviews(productId) {
  const all = JSON.parse(localStorage.getItem("af_reviews") || "{}");
  return all[productId] || [];
}

function saveReview(productId, review) {
  const all = JSON.parse(localStorage.getItem("af_reviews") || "{}");
  if (!all[productId]) all[productId] = [];
  all[productId].unshift(review);
  localStorage.setItem("af_reviews", JSON.stringify(all));
}

function getSession() {
  return JSON.parse(localStorage.getItem("af_session") || "null");
}

function setSession(user) {
  localStorage.setItem("af_session", JSON.stringify(user));
  currentUser = user;
}

function clearSession() {
  localStorage.removeItem("af_session");
  currentUser = null;
}

function getCart() {
  return JSON.parse(localStorage.getItem("af_cart") || "[]");
}

function saveCart(c) {
  localStorage.setItem("af_cart", JSON.stringify(c));
  cart = c;
  updateCartBadge();
}

/* ===== INICIALIZAÇÃO ===== */
document.addEventListener("DOMContentLoaded", () => {
  currentUser = getSession();
  cart = getCart();
  updateUserUI();
  updateCartBadge();
  renderProducts();
  setupEventListeners();
});

/* ===== UI HELPERS ===== */
function updateUserUI() {
  const label = document.getElementById("userNameLabel");
  if (currentUser) {
    label.textContent = currentUser.name.split(" ")[0];
  } else {
    label.textContent = "Entrar";
  }
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = count;
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 2500);
}

function formatPrice(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let html = "★".repeat(full);
  if (half) html += "½";
  html += "☆".repeat(5 - full - half);
  return html;
}

/* ===== NAVEGAÇÃO ===== */
function showHome() {
  document.getElementById("homeSection").classList.remove("hidden");
  document.getElementById("productSection").classList.add("hidden");
  document.getElementById("cartSection").classList.add("hidden");
  window.scrollTo(0, 0);
}

function showProduct(id) {
  currentProductId = id;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  document.getElementById("homeSection").classList.add("hidden");
  document.getElementById("cartSection").classList.add("hidden");
  document.getElementById("productSection").classList.remove("hidden");

  const reviews = getReviews(id);
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : product.rating;

  document.getElementById("productDetail").innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="detail-image" onerror="this.src='https://placehold.co/400x400/eee/999?text=Action+Figure'">
    <div class="detail-info">
      <p class="detail-category">${product.category}</p>
      <h1>${product.name}</h1>
      <p class="detail-rating">${starsHTML(parseFloat(avgRating))} ${avgRating} (${reviews.length || product.reviewsCount} avaliações)</p>
      <p class="detail-price">${formatPrice(product.price)}</p>
      <p class="detail-desc">${product.description}</p>
      <div class="detail-actions">
        <div class="qty-control">
          <button onclick="changeQty(-1)">−</button>
          <span id="qtyValue">1</span>
          <button onclick="changeQty(1)">+</button>
        </div>
        <button class="btn-primary" onclick="addToCart(${product.id})">Adicionar ao carrinho</button>
      </div>
    </div>
  `;

  renderReviews(id);
  updateReviewFormUI();
  window.scrollTo(0, 0);
}

function showCart() {
  document.getElementById("homeSection").classList.add("hidden");
  document.getElementById("productSection").classList.add("hidden");
  document.getElementById("cartSection").classList.remove("hidden");
  renderCart();
  window.scrollTo(0, 0);
}

/* ===== PRODUTOS / FILTROS ===== */
function getFilteredProducts() {
  return PRODUCTS.filter(p => {
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm);
    const matchMin = minPrice === null || p.price >= minPrice;
    const matchMax = maxPrice === null || p.price <= maxPrice;
    return matchCat && matchSearch && matchMin && matchMax;
  });
}

function renderProducts() {
  const list = getFilteredProducts();
  const grid = document.getElementById("productsGrid");
  document.getElementById("resultsCount").textContent = `${list.length} produto${list.length !== 1 ? "s" : ""} encontrado${list.length !== 1 ? "s" : ""}`;

  if (list.length === 0) {
    grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;padding:40px;color:#666">Nenhum produto encontrado com esses filtros.</p>`;
    return;
  }

  grid.innerHTML = list.map(p => `
    <article class="product-card" onclick="showProduct(${p.id})">
      <img src="${p.image}" alt="${p.name}" class="product-image" loading="lazy" onerror="this.src='https://placehold.co/400x400/eee/999?text=Action+Figure'">
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">${starsHTML(p.rating)} ${p.rating}</div>
        <div class="product-price">${formatPrice(p.price)} <small>em até 12x sem juros</small></div>
      </div>
    </article>
  `).join("");
}

/* ===== CARRINHO ===== */
let qty = 1;

function changeQty(delta) {
  qty = Math.max(1, qty + delta);
  document.getElementById("qtyValue").textContent = qty;
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(i => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty: qty });
  }
  saveCart(cart);
  showToast(`${product.name} adicionado ao carrinho!`);
  qty = 1;
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
  showToast("Item removido");
}

function renderCart() {
  const container = document.getElementById("cartContent");
  if (cart.length === 0) {
    container.innerHTML = `<div class="cart-empty"><p>Seu carrinho está vazio</p><button class="btn-primary" style="margin-top:16px" onclick="showHome()">Ver produtos</button></div>`;
    return;
  }

  let total = 0;
  const itemsHTML = cart.map(item => {
    const p = PRODUCTS.find(prod => prod.id === item.id);
    if (!p) return "";
    const sub = p.price * item.qty;
    total += sub;
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/80x80/eee/999?text=AF'">
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${formatPrice(p.price)} × ${item.qty}</div>
        </div>
        <button class="btn-ghost" onclick="removeFromCart(${p.id})">Remover</button>
      </div>
    `;
  }).join("");

  container.innerHTML = itemsHTML + `
    <div class="cart-total">
      <div>
        <span style="color:#666;font-size:0.9rem">Total</span>
        <div class="cart-total-value">${formatPrice(total)}</div>
      </div>
      <button class="btn-primary" onclick="checkout()">Finalizar compra</button>
    </div>
  `;
}

function checkout() {
  if (!currentUser) {
    showToast("Faça login para finalizar a compra");
    openAuthModal();
    return;
  }
  showToast("Pedido realizado com sucesso! (simulação)");
  cart = [];
  saveCart(cart);
  renderCart();
}

/* ===== AVALIAÇÕES ===== */
function renderReviews(productId) {
  const reviews = getReviews(productId);
  const list = document.getElementById("reviewsList");

  if (reviews.length === 0) {
    list.innerHTML = `<p style="color:#666;font-size:0.9rem">Ainda não há avaliações. Seja o primeiro!</p>`;
    return;
  }

  list.innerHTML = reviews.map(r => `
    <div class="review-item">
      <div class="review-header">
        <div class="review-avatar">${r.author.charAt(0).toUpperCase()}</div>
        <div>
          <div class="review-author">${r.author}</div>
          <div class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
          <div class="review-date">${r.date}</div>
        </div>
      </div>
      <p class="review-text">${r.text}</p>
    </div>
  `).join("");
}

function updateReviewFormUI() {
  const hint = document.getElementById("reviewHint");
  const btn = document.getElementById("submitReview");
  if (currentUser) {
    hint.textContent = `Avaliando como ${currentUser.name}`;
    btn.disabled = false;
  } else {
    hint.textContent = "Faça login para avaliar";
    btn.disabled = true;
  }
}

/* ===== AUTH ===== */
function openAuthModal() {
  document.getElementById("authModal").classList.remove("hidden");
  document.getElementById("loginError").textContent = "";
  document.getElementById("registerError").textContent = "";
}

function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function switchAuthTab(tab) {
  document.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.tab === tab));
  document.getElementById("loginForm").classList.toggle("hidden", tab !== "login");
  document.getElementById("registerForm").classList.toggle("hidden", tab !== "register");
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    document.getElementById("loginError").textContent = "E-mail ou senha incorretos.";
    return;
  }

  setSession({ name: user.name, email: user.email });
  updateUserUI();
  updateReviewFormUI();
  closeAuthModal();
  showToast(`Bem-vindo de volta, ${user.name.split(" ")[0]}!`);
}

function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;

  if (password.length < 6) {
    document.getElementById("registerError").textContent = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  const users = getUsers();
  if (users.some(u => u.email === email)) {
    document.getElementById("registerError").textContent = "Este e-mail já está cadastrado.";
    return;
  }

  users.push({ name, email, password });
  saveUsers(users);
  setSession({ name, email });
  updateUserUI();
  updateReviewFormUI();
  closeAuthModal();
  showToast(`Conta criada! Olá, ${name.split(" ")[0]}!`);
}

function handleLogout() {
  clearSession();
  updateUserUI();
  updateReviewFormUI();
  showToast("Você saiu da conta");
}

/* ===== EVENT LISTENERS ===== */
function setupEventListeners() {
  // Pesquisa
  document.getElementById("searchBtn").addEventListener("click", () => {
    searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
    renderProducts();
    showHome();
  });
  document.getElementById("searchInput").addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
      searchTerm = e.target.value.trim().toLowerCase();
      renderProducts();
      showHome();
    }
  });

  // Filtro de preço
  document.getElementById("applyPriceFilter").addEventListener("click", () => {
    const min = document.getElementById("minPrice").value;
    const max = document.getElementById("maxPrice").value;
    minPrice = min !== "" ? parseFloat(min) : null;
    maxPrice = max !== "" ? parseFloat(max) : null;
    renderProducts();
  });

  document.getElementById("clearFilters").addEventListener("click", () => {
    document.getElementById("minPrice").value = "";
    document.getElementById("maxPrice").value = "";
    document.getElementById("searchInput").value = "";
    minPrice = null;
    maxPrice = null;
    searchTerm = "";
    activeCategory = "all";
    document.querySelectorAll(".pill").forEach(p => p.classList.toggle("active", p.dataset.cat === "all"));
    renderProducts();
  });

  // Categorias
  document.getElementById("categoryPills").addEventListener("click", (e) => {
    if (e.target.classList.contains("pill")) {
      activeCategory = e.target.dataset.cat;
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      renderProducts();
    }
  });

  // Carrinho
  document.getElementById("cartBtn").addEventListener("click", showCart);

  // Usuário
  document.getElementById("userBtn").addEventListener("click", () => {
    if (currentUser) {
      if (confirm(`Olá, ${currentUser.name}!\nDeseja sair da conta?`)) {
        handleLogout();
      }
    } else {
      openAuthModal();
    }
  });

  // Modal auth
  document.getElementById("closeAuthModal").addEventListener("click", closeAuthModal);
  document.getElementById("authModal").addEventListener("click", (e) => {
    if (e.target.id === "authModal") closeAuthModal();
  });

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("registerForm").addEventListener("submit", handleRegister);

  // Estrelas de avaliação
  document.getElementById("starsInput").addEventListener("click", (e) => {
    if (e.target.dataset.star) {
      selectedRating = parseInt(e.target.dataset.star);
      document.querySelectorAll("#starsInput span").forEach(s => {
        s.classList.toggle("active", parseInt(s.dataset.star) <= selectedRating);
      });
    }
  });

  // Enviar avaliação
  document.getElementById("submitReview").addEventListener("click", () => {
    if (!currentUser) {
      showToast("Faça login para avaliar");
      openAuthModal();
      return;
    }
    if (selectedRating === 0) {
      showToast("Escolha uma nota de 1 a 5 estrelas");
      return;
    }
    const text = document.getElementById("reviewText").value.trim();
    if (!text) {
      showToast("Escreva um comentário");
      return;
    }

    const review = {
      author: currentUser.name,
      rating: selectedRating,
      text,
      date: new Date().toLocaleDateString("pt-BR")
    };

    saveReview(currentProductId, review);
    document.getElementById("reviewText").value = "";
    selectedRating = 0;
    document.querySelectorAll("#starsInput span").forEach(s => s.classList.remove("active"));
    renderReviews(currentProductId);
    showToast("Avaliação enviada! Obrigado");
  });
}