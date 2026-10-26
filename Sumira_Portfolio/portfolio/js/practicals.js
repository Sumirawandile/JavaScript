// =========================================================
// practicals.js – JS Lab table
// PRACTICAL 10: jQuery $.getJSON() renders JSON into a table
// PRACTICAL 12: jQuery DOM, events and AJAX
// =========================================================

const REPO = 'https://github.com/Sumirawandile/JavaScript/tree/main/';

export function loadPracticals() {
  const $body = $('#lab-body');
  const $count = $('#lab-count');

  $.getJSON('data/practicals.json')
    .done((rows) => {
      const html = rows.map((r) => `
        <tr>
          <td>P${r.no}</td>
          <td>${r.topic}</td>
          <td>${r.task}</td>
          <td><a class="used-link" href="${r.anchor}">${r.usedIn}</a></td>
          <td><a href="${REPO + r.folder}" target="_blank" rel="noopener">GitHub</a></td>
        </tr>`).join('');

      $body.html(html);
      $count.text(`${rows.length} of ${rows.length} practicals`);
      console.table(rows.map(({ no, topic, usedIn }) => ({ no, topic, usedIn })));
    })
    .fail((xhr, status, error) => {
      $body.html(`<tr><td colspan="5"><p class="error-box">Could not load practicals (${status || error}).
        Use VS Code Live Server to open the site.</p></td></tr>`);
    });

  // Live search through table rows with jQuery
  $('#lab-search').on('input', function () {
    const query = $(this).val().toLowerCase();
    let shown = 0;
    const $rows = $('#lab-body tr');
    $rows.each(function () {
      const match = $(this).text().toLowerCase().includes(query);
      $(this).toggle(match);
      if (match) shown++;
    });
    $count.text(`${shown} of ${$rows.length} practicals`);
  });
}
