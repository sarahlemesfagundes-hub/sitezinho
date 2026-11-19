const API_URL = "/api";
let PRODUCTS = [];

/* ===== ESTADO DA APLICAÇÃO ===== */
let currentUser = null;
let cart = [];
let currentProductId = null;
let selectedRating = 0;
let activeCategory = "all";
let searchTerm = "";
let minPrice = null;
let maxPrice = null;

/* ===== UTILITÁRIOS DE SESSÃO E CARRINHO ===== */
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
document.addEventListener("DOMContentLoaded", async () => {
  currentUser = getSession();
  cart = getCart();
  updateUserUI();
  updateCartBadge();

  try {
    const res = await fetch(`${API_URL}/products`);
    PRODUCTS = await res.json();
  } catch (err) {
    showToast("Erro ao carregar produtos do servidor.");
  }

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

async function showProduct(id) {
  currentProductId = id;
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;

  document.getElementById("homeSection").classList.add("hidden");
  document.getElementById("cartSection").classList.add("hidden");
  document.getElementById("productSection").classList.remove("hidden");

  const res = await fetch(`${API_URL}/reviews/${id}`);
  const reviews = await res.json();

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

  renderReviewsList(reviews);
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
      <button class="btn-primary" onclick="checkout(${total})">Finalizar compra</button>
    </div>
  `;
}

async function checkout(total) {
  if (!currentUser) {
    showToast("Faça login para finalizar a compra");
    openAuthModal();
    return;
  }

  await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userEmail: currentUser.email,
      items: cart,
      total: total
    })
  });

  showToast("Pedido salvo no banco com sucesso!");
  cart = [];
  saveCart(cart);
  renderCart();
}

/* ===== AVALIAÇÕES ===== */
async function loadAndRenderReviews(productId) {
  const res = await fetch(`${API_URL}/reviews/${productId}`);
  const reviews = await res.json();
  renderReviewsList(reviews);
}

function renderReviewsList(reviews) {
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

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (!res.ok) {
    document.getElementById("loginError").textContent = data.error;
    return;
  }

  setSession(data);
  updateUserUI();
  updateReviewFormUI();
  closeAuthModal();
  showToast(`Bem-vindo de volta, ${data.name.split(" ")[0]}!`);
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim().toLowerCase();
  const password = document.getElementById("registerPassword").value;

  if (password.length < 6) {
    document.getElementById("registerError").textContent = "A senha deve ter pelo menos 6 caracteres.";
    return;
  }

  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();

  if (!res.ok) {
    document.getElementById("registerError").textContent = data.error;
    return;
  }

  setSession(data);
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

  document.getElementById("categoryPills").addEventListener("click", (e) => {
    if (e.target.classList.contains("pill")) {
      activeCategory = e.target.dataset.cat;
      document.querySelectorAll(".pill").forEach(p => p.classList.remove("active"));
      e.target.classList.add("active");
      renderProducts();
    }
  });

  document.getElementById("cartBtn").addEventListener("click", showCart);

  document.getElementById("userBtn").addEventListener("click", () => {
    if (currentUser) {
      if (confirm(`Olá, ${currentUser.name}!\nDeseja sair da conta?`)) {
        handleLogout();
      }
    } else {
      openAuthModal();
    }
  });

  document.getElementById("closeAuthModal").addEventListener("click", closeAuthModal);
  document.getElementById("authModal").addEventListener("click", (e) => {
    if (e.target.id === "authModal") closeAuthModal();
  });

  document.querySelectorAll(".auth-tab").forEach(tab => {
    tab.addEventListener("click", () => switchAuthTab(tab.dataset.tab));
  });

  document.getElementById("loginForm").addEventListener("submit", handleLogin);
  document.getElementById("registerForm").addEventListener("submit", handleRegister);

  document.getElementById("starsInput").addEventListener("click", (e) => {
    if (e.target.dataset.star) {
      selectedRating = parseInt(e.target.dataset.star);
      document.querySelectorAll("#starsInput span").forEach(s => {
        s.classList.toggle("active", parseInt(s.dataset.star) <= selectedRating);
      });
    }
  });

  document.getElementById("submitReview").addEventListener("click", async () => {
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
      productId: currentProductId,
      author: currentUser.name,
      rating: selectedRating,
      text,
      date: new Date().toLocaleDateString("pt-BR")
    };

    await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(review)
    });

    document.getElementById("reviewText").value = "";
    selectedRating = 0;
    document.querySelectorAll("#starsInput span").forEach(s => s.classList.remove("active"));
    await loadAndRenderReviews(currentProductId);
    showToast("Avaliação enviada! Obrigado");
  });
}
