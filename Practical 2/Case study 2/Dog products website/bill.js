/* ============================================
   Woof & Wag — Bill / Invoice calculator
   ============================================ */

const itemsBody = document.getElementById("itemsBody");
let rowCount = 0;

function money(n){
  n = isFinite(n) ? n : 0;
  return "₹" + n.toLocaleString("en-IN", {maximumFractionDigits:2, minimumFractionDigits:2});
}

function makeRow(name = "", qty = 1, rate = "", discount = 0){
  rowCount++;
  const tr = document.createElement("tr");
  tr.dataset.rowId = rowCount;
  tr.innerHTML = `
    <td><input type="text" class="rName" value="${name}" placeholder="Product name"></td>
    <td><input type="number" class="rQty" value="${qty}" min="0.1" step="0.1"></td>
    <td><input type="number" class="rRate" value="${rate}" min="0" placeholder="0"></td>
    <td><input type="number" class="rDisc" value="${discount}" min="0" max="100"></td>
    <td class="rAmount">₹0.00</td>
    <td><button class="rm" title="Remove row">✕</button></td>
  `;
  tr.querySelectorAll("input").forEach(inp => inp.addEventListener("input", updateRowAmount.bind(null, tr)));
  tr.querySelector(".rm").addEventListener("click", () => { tr.remove(); });
  itemsBody.appendChild(tr);
  updateRowAmount(tr);
}

function updateRowAmount(tr){
  const qty = parseFloat(tr.querySelector(".rQty").value) || 0;
  const rate = parseFloat(tr.querySelector(".rRate").value) || 0;
  const disc = parseFloat(tr.querySelector(".rDisc").value) || 0;
  const gross = qty * rate;
  const net = gross * (1 - disc/100);
  tr.querySelector(".rAmount").textContent = money(net);
  tr.dataset.gross = gross;
  tr.dataset.net = net;
}

document.getElementById("addRowBtn").addEventListener("click", () => makeRow());

// Prefill invoice number + date
document.getElementById("invoiceNo").value = "PM-" + Date.now().toString().slice(-8);
document.getElementById("invoiceDate").value = new Date().toLocaleDateString("en-IN", {day:"2-digit", month:"short", year:"numeric"});

// Prefill items from cart (localStorage set by index.html)
const cart = JSON.parse(localStorage.getItem("wnw_cart") || "{}");
const cartItems = Object.values(cart);
if (cartItems.length){
  cartItems.forEach(i => makeRow(i.name, i.qty, i.price, 0));
} else {
  makeRow(); // one blank row to start
}

// Payment mode highlight
document.querySelectorAll('#payModes input').forEach(radio => {
  radio.addEventListener("change", () => {
    document.querySelectorAll('#payModes label').forEach(l => l.classList.remove("checked"));
    radio.closest("label").classList.add("checked");
  });
});
document.querySelector('#payModes input:checked').closest("label").classList.add("checked");

document.getElementById("calcBtn").addEventListener("click", () => {
  const rows = [...itemsBody.querySelectorAll("tr")];
  let subtotal = 0, itemDiscountTotal = 0;

  rows.forEach(tr => {
    updateRowAmount(tr);
    const gross = parseFloat(tr.dataset.gross) || 0;
    const net = parseFloat(tr.dataset.net) || 0;
    subtotal += gross;
    itemDiscountTotal += (gross - net);
  });

  const afterItemDiscount = subtotal - itemDiscountTotal;

  const isMember = document.getElementById("isMember").checked;
  const memberDiscount = isMember ? afterItemDiscount * 0.05 : 0;

  const bargainPct = parseFloat(document.getElementById("bargainPct").value) || 0;
  const afterMember = afterItemDiscount - memberDiscount;
  const bargainDiscount = afterMember * (bargainPct/100);

  const taxable = afterMember - bargainDiscount;

  const gstPct = parseFloat(document.getElementById("gstPct").value) || 0;
  const gstAmount = taxable * (gstPct/100);

  const packing = parseFloat(document.getElementById("packing").value) || 0;

  const grandTotal = taxable + gstAmount + packing;

  const custName = document.getElementById("custName").value || "Guest Customer";
  const custMobile = document.getElementById("custMobile").value || "—";
  const payMode = document.querySelector('#payModes input:checked').value;

  document.getElementById("sumCustomer").textContent = `${custName} · ${custMobile}`;
  document.getElementById("sumPay").textContent = `Payment mode: ${payMode}`;
  document.getElementById("sumSubtotal").textContent = money(subtotal);
  document.getElementById("sumItemDisc").textContent = "−" + money(itemDiscountTotal);
  document.getElementById("sumMemberDisc").textContent = "−" + money(memberDiscount);
  document.getElementById("sumMemberRow").style.display = isMember ? "flex" : "none";
  document.getElementById("sumBargainDisc").textContent = "−" + money(bargainDiscount);
  document.getElementById("sumBargainRow").style.display = bargainPct > 0 ? "flex" : "none";
  document.getElementById("sumTaxable").textContent = money(taxable);
  document.getElementById("sumGst").textContent = "+" + money(gstAmount) + ` (${gstPct}%)`;
  document.getElementById("sumPacking").textContent = "+" + money(packing);
  document.getElementById("sumTotal").textContent = money(grandTotal);

  document.getElementById("summaryBox").style.display = "block";
  document.getElementById("printActions").style.display = "flex";
  document.getElementById("summaryBox").scrollIntoView({behavior:"smooth", block:"center"});
});

document.getElementById("printBtn").addEventListener("click", () => window.print());