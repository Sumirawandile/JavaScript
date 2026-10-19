/* JSON Loader
   Loads data.json two ways (fetch and jQuery $.getJSON) and renders it as a table. */

const DATA_URL = "data.json";

let rows = [];          // data currently loaded
let sortKey = null;     // column being sorted
let sortAsc = true;

// ---------- Helpers ----------
function esc(value) {                       // stop HTML injection from data
  return String(value).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function setStatus(type, text) {
  $("#status .dot").attr("class", "dot " + type);
  $("#statusText").text(text);
}

function setBusy(busy) {
  $("#btnFetch, #btnJq").prop("disabled", busy);
}

// ---------- Render the table dynamically ----------
function render() {
  const term = $("#search").val().trim().toLowerCase();

  let view = rows.filter((r) =>
    !term || Object.values(r).some((v) => String(v).toLowerCase().includes(term)));

  if (sortKey) {
    view = [...view].sort((a, b) => {
      const x = a[sortKey], y = b[sortKey];
      const cmp = typeof x === "number" ? x - y : String(x).localeCompare(String(y));
      return sortAsc ? cmp : -cmp;
    });
  }

  const $body = $("#tbody").empty();

  if (view.length === 0) {
    $body.append('<tr><td class="empty" colspan="6">' +
      (rows.length ? "No matching records." : "No data yet.") + "</td></tr>");
  } else {
    view.forEach((r) => {
      $body.append(
        "<tr>" +
          `<td class="num">${esc(r.id)}</td>` +
          `<td><strong>${esc(r.name)}</strong></td>` +
          `<td>${esc(r.creator)}</td>` +
          `<td class="num">${esc(r.year)}</td>` +
          `<td>${esc(r.paradigm)}</td>` +
          `<td><span class="tag ${esc(r.typing)}">${esc(r.typing)}</span></td>` +
        "</tr>"
      );
    });
  }

  $("#count").text(rows.length ? `Showing ${view.length} of ${rows.length}` : "");

  // sort arrows
  $("#dataTable th").removeClass("asc desc");
  if (sortKey) $(`#dataTable th[data-key="${sortKey}"]`).addClass(sortAsc ? "asc" : "desc");
}

// ---------- Called when either method succeeds ----------
function onLoaded(data, method, startTime) {
  const ms = (performance.now() - startTime).toFixed(1);

  if (!data || !Array.isArray(data.languages)) {
    onFailed(new Error('JSON has no "languages" array'));
    return;
  }

  rows = data.languages;
  sortKey = null;
  $("#search").val("");

  $("#badgeMethod")
    .text(method)
    .attr("class", "badge " + (method === "fetch()" ? "fetch" : "jq"));
  $("#metaInfo").text(`${rows.length} records loaded in ${ms} ms  |  "${data.title}"`);
  $("#meta, #tools").prop("hidden", false);

  render();
  setStatus("ok", `Loaded ${rows.length} records using ${method}.`);
  setBusy(false);
}

function onFailed(err) {
  setStatus("error", "Failed: " + err.message +
    (location.protocol === "file:" ? " (open the page with Live Server, not by double-clicking)" : ""));
  setBusy(false);
}

// ---------- Method 1: fetch() ----------
function loadWithFetch() {
  setBusy(true);
  setStatus("loading", "Loading with fetch()...");
  const t0 = performance.now();

  fetch(DATA_URL, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("HTTP " + res.status);   // fetch does not reject 404 by itself
      return res.json();                                    // parse JSON manually
    })
    .then((data) => onLoaded(data, "fetch()", t0))
    .catch(onFailed);
}

// ---------- Method 2: jQuery $.getJSON() ----------
function loadWithJQuery() {
  setBusy(true);
  setStatus("loading", "Loading with $.getJSON()...");
  const t0 = performance.now();

  $.getJSON(DATA_URL + "?_=" + Date.now())                  // JSON is parsed automatically
    .done((data) => onLoaded(data, "$.getJSON()", t0))
    .fail((xhr, status, error) => onFailed(new Error(error || status || "request failed")));
}

// ---------- Events ----------
$("#btnFetch").on("click", loadWithFetch);
$("#btnJq").on("click", loadWithJQuery);

$("#btnClear").on("click", () => {
  rows = [];
  sortKey = null;
  $("#search").val("");
  $("#meta, #tools").prop("hidden", true);
  render();
  setStatus("idle", "Table cleared. Click a button to load again.");
});

$("#search").on("input", render);

$("#dataTable thead").on("click", "th", function () {
  if (!rows.length) return;
  const key = $(this).data("key");
  sortAsc = sortKey === key ? !sortAsc : true;
  sortKey = key;
  render();
});