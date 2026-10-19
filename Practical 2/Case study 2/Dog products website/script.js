/* ============================================
   Woof & Wag — dog-only catalog, cart, search,
   filter, sort, wishlist, subscribe & save.
   Drop your own photos into an "images" folder
   next to this file, named to match each
   product's "img" field, and they appear
   automatically (see images/README.txt).
   ============================================ */

const PRODUCTS = [
  { id:"p1", cat:"food", name:"Chicken & Rice Kibble", desc:"Real chicken, grain-friendly, 3kg", price:520, old:650, unit:"kg", emoji:"🍗", badge:"25% OFF", rating:4.8, reviews:214, best:true, subscribable:true, img:"images/dog-food.jpg" },
  { id:"p2", cat:"food", name:"Puppy Starter Formula", desc:"Soft kibble for 2-8 month pups", price:480, old:480, unit:"kg", emoji:"🐶", badge:"NEW", rating:4.6, reviews:58, best:false, subscribable:true, img:"images/dog-food-puppy.jpg" },
  { id:"p4", cat:"toys", name:"Squeaky Bone Toy", desc:"Durable rubber, non-toxic", price:229, old:299, unit:"pc", emoji:"🦴", badge:"23% OFF", rating:4.7, reviews:189, best:true, subscribable:false, img:"images/dog-toy-bone.jpg" },
  { id:"p6", cat:"accessories", name:"Reflective Leash & Collar", desc:"Night-safe, adjustable, medium", price:449, old:449, unit:"set", emoji:"🦮", badge:"NEW", rating:4.6, reviews:94, best:false, subscribable:false, img:"images/dog-leash.jpg" },
  { id:"p8", cat:"beds", name:"Plush Cave Bed XL", desc:"Machine washable, extra soft", price:1399, old:1799, unit:"pc", emoji:"🛏️", badge:"22% OFF", rating:4.9, reviews:157, best:true, subscribable:false, img:"images/dog-bed.jpg" },
  { id:"p9", cat:"beds", name:"Orthopedic Memory Bed", desc:"Joint support for senior dogs", price:1899, old:2299, unit:"pc", emoji:"🛌", badge:"17% OFF", rating:4.8, reviews:88, best:false, subscribable:false, img:"images/dog-bed-ortho.jpg" },
  { id:"p10", cat:"grooming", name:"Deshedding Brush", desc:"Reduces loose fur by up to 90%", price:399, old:499, unit:"pc", emoji:"🪮", badge:"20% OFF", rating:4.6, reviews:112, best:false, subscribable:false, img:"images/dog-brush.jpg" },
  { id:"p12", cat:"treats", name:"Dental Chew Sticks", desc:"Pack of 6, mint flavour", price:299, old:399, unit:"pack", emoji:"🦴", badge:"25% OFF", rating:4.7, reviews:143, best:false, subscribable:true, img:"images/dog-dental-chews.jpg" },
  { id:"p13", cat:"treats", name:"Training Reward Bites", desc:"Small, soft, high-value treats", price:199, old:249, unit:"pack", emoji:"🍖", badge:"20% OFF", rating:4.8, reviews:101, best:false, subscribable:true, img:"images/dog-treats.jpg" },
];

let cart = JSON.parse(localStorage.getItem("wnw_cart") || "{}");
let wishlist = JSON.parse(localStorage.getItem("wnw_wishlist") || "[]");
let currentCat = "all";
let currentSort = "default";
let searchTerm = "";

function money(n){ return "₹" + Number(n).toLocaleString("en-IN", {maximumFractionDigits:2}); }
function filenameOnly(path){ return path.split("/").pop(); }
function starString(rating){
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5-full);
}

function getFilteredSorted(){
  let list = PRODUCTS.filter(p => currentCat === "all" || p.cat === currentCat);
  if (searchTerm.trim()){
    const t = searchTerm.toLowerCase();
    list = list.filter(p => p.name.toLowerCase().includes(t) || p.desc.toLowerCase().includes(t) || p.cat.includes(t));
  }
  if (currentSort === "price-low") list = [...list].sort((a,b) => a.price - b.price);
  else if (currentSort === "price-high") list = [...list].sort((a,b) => b.price - a.price);
  else if (currentSort === "rating") list = [...list].sort((a,b) => b.rating - a.rating);
  return list;
}

function renderCard(p){
  const qty = (cart[p.id]?.qty) || 1;
  const isWished = wishlist.includes(p.id);
  const subPrice = p.subscribable ? Math.round(p.price * 0.9) : p.price;
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <span class="badge ${p.badge==='NEW'?'new':''} ${p.best?'best':''}">${p.best ? '🏆 Bestseller' : p.badge}</span>
    <button class="wish-btn ${isWished?'active':''}" data-id="${p.id}">${isWished ? '❤️' : '🤍'}</button>
    <div class="media" data-filename="${filenameOnly(p.img)}">
      <img src="${p.img}" alt="${p.name}">
    </div>
    <div class="tagrow">
      <span class="stars">${starString(p.rating)} <span class="count">(${p.reviews})</span></span>
    </div>
    <h3>${p.name}</h3>
    <div class="desc">${p.desc}</div>
    <div class="price-row">
      <span class="price-now sale-price">${money(p.price)}</span>
      ${p.old > p.price ? `<span class="price-old">${money(p.old)}</span>` : ""}
      <span class="per">/ ${p.unit}</span>
    </div>
    ${p.subscribable ? `
    <div class="sub-row">
      <input type="checkbox" class="subCheck" id="sub-${p.id}">
      <label for="sub-${p.id}">Subscribe & Save 10% (${money(subPrice)}/${p.unit})</label>
    </div>` : ""}
    <div class="qty-row">
      <button class="dec" aria-label="decrease">−</button>
      <input type="number" min="1" value="${qty}" class="qtyInput" />
      <button class="inc" aria-label="increase">+</button>
    </div>
    <button class="add-btn ${cart[p.id] ? 'added' : ''}">${cart[p.id] ? 'Added ✓' : 'Add to Cart'}</button>
  `;

  const img = card.querySelector(".media img");
  img.addEventListener("error", () => {
    img.remove();
    card.querySelector(".media").classList.add("ph");
    card.querySelector(".media").textContent = p.emoji;
  }, { once:true });

  card.querySelector(".wish-btn").onclick = (e) => {
    const id = p.id;
    if (wishlist.includes(id)){
      wishlist = wishlist.filter(w => w !== id);
      e.target.textContent = "🤍"; e.target.classList.remove("active");
    } else {
      wishlist.push(id);
      e.target.textContent = "❤️"; e.target.classList.add("active");
    }
    localStorage.setItem("wnw_wishlist", JSON.stringify(wishlist));
  };

  const priceEl = card.querySelector(".sale-price");
  const subCheck = card.querySelector(".subCheck");
  if (subCheck){
    subCheck.addEventListener("change", () => {
      priceEl.textContent = subCheck.checked ? money(subPrice) : money(p.price);
    });
  }

  const qtyInput = card.querySelector(".qtyInput");
  card.querySelector(".dec").onclick = () => { qtyInput.value = Math.max(1, +qtyInput.value - 1); };
  card.querySelector(".inc").onclick = () => { qtyInput.value = +qtyInput.value + 1; };
  card.querySelector(".add-btn").onclick = (e) => {
    const subscribed = subCheck ? subCheck.checked : false;
    const finalPrice = subscribed ? subPrice : p.price;
    cart[p.id] = { id:p.id, name:p.name + (subscribed ? " (Subscribed)" : ""), price:finalPrice, unit:p.unit, qty:+qtyInput.value };
    saveCart();
    e.target.textContent = "Added ✓";
    e.target.classList.add("added");
    renderDrawer();
  };
  return card;
}

function renderGrid(){
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";
  const list = getFilteredSorted();
  if (list.length === 0){
    grid.innerHTML = `<div class="empty-state">No products match "${searchTerm}" 🐾 Try a different search.</div>`;
    return;
  }
  list.forEach(p => grid.appendChild(renderCard(p)));
}

function saveCart(){
  localStorage.setItem("wnw_cart", JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount(){
  const count = Object.values(cart).reduce((s,i) => s + i.qty, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}
function renderDrawer(){
  const wrap = document.getElementById("drawerItems");
  const items = Object.values(cart);
  if (!wrap) return;
  if (items.length === 0){
    wrap.innerHTML = `<div class="empty-msg">Your cart is empty 🐾<br>Go add something tasty!</div>`;
  } else {
    wrap.innerHTML = items.map(i => `
      <div class="drawer-item">
        <div class="em">🐾</div>
        <div class="info"><h4>${i.name}</h4><small>${i.qty} × ${money(i.price)} / ${i.unit}</small></div>
        <button class="remove" data-id="${i.id}">✕</button>
      </div>`).join("");
    wrap.querySelectorAll(".remove").forEach(btn => {
      btn.onclick = () => { delete cart[btn.dataset.id]; saveCart(); renderDrawer(); renderGrid(); };
    });
  }
  const subtotal = items.reduce((s,i) => s + i.price*i.qty, 0);
  const subEl = document.getElementById("drawerSubtotal");
  if (subEl) subEl.textContent = money(subtotal);
  updateCartCount();
}

// Category chips
document.querySelectorAll(".chip").forEach(chip => {
  chip.onclick = () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    currentCat = chip.dataset.cat;
    renderGrid();
  };
});

// Sort
document.getElementById("sortSelect")?.addEventListener("change", (e) => {
  currentSort = e.target.value;
  renderGrid();
});

// Search
document.getElementById("searchInput")?.addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderGrid();
});

// Drawer open/close
const drawer = document.getElementById("drawer");
const overlay = document.getElementById("overlay");
document.getElementById("cartBtn")?.addEventListener("click", () => { drawer.classList.add("open"); overlay.classList.add("open"); });
document.getElementById("closeDrawer")?.addEventListener("click", () => { drawer.classList.remove("open"); overlay.classList.remove("open"); });
overlay?.addEventListener("click", () => { drawer.classList.remove("open"); overlay.classList.remove("open"); });

// FAQ accordion
document.querySelectorAll(".faq-item").forEach(item => {
  item.querySelector(".faq-q").addEventListener("click", () => {
    const wasOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("open"));
    if (!wasOpen) item.classList.add("open");
  });
});

renderGrid();
renderDrawer();