document.addEventListener('DOMContentLoaded', function () {
  var yr = document.getElementById('yr');
  if (yr) { yr.textContent = new Date().getFullYear(); }
});
