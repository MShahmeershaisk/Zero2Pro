// Theme Toggle System for Zero to Pro
(function() {
  // Apply saved theme immediately to prevent flash (default to light)
  const saved = localStorage.getItem('ztp-theme');
  const theme = (saved === 'light' || saved === 'dark') ? saved : 'light';
  document.documentElement.setAttribute('data-theme', theme);
})();

function toggleTheme() {
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  const newTheme = isLight ? 'dark' : 'light';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('ztp-theme', newTheme);
  updateToggleIcon(newTheme);
}

const MOON_SVG = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';
const SUN_SVG = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';

function updateToggleIcon(theme) {
  const btns = document.querySelectorAll('.nav-theme-toggle');
  if (!btns.length) return;
  btns.forEach(btn => {
    const svg = btn.querySelector('svg');
    if (svg) svg.outerHTML = theme === 'light' ? MOON_SVG : SUN_SVG;
    btn.title = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  });
  const label = document.getElementById('themeToggleLabel');
  if (label) label.textContent = theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
}

// Initialize icon on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  updateToggleIcon(current);
});
