(function () {
  var articles = Array.prototype.slice.call(document.querySelectorAll('article[data-lang]'));
  var available = articles.map(function (a) { return a.getAttribute('data-lang'); });
  var shellNode = document.getElementById('shell-strings');
  var shell = {};
  try { shell = JSON.parse(shellNode ? shellNode.textContent : '{}'); } catch (e) {}

  function pick() {
    try {
      var saved = localStorage.getItem('feelim_lang');
      if (saved && available.indexOf(saved) > -1) return saved;
    } catch (e) {}
    var nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return available.indexOf(nav) > -1 ? nav : 'en';
  }

  function apply(lang) {
    articles.forEach(function (a) { a.hidden = a.getAttribute('data-lang') !== lang; });
    document.documentElement.lang = lang;
    var current = articles.filter(function (a) { return !a.hidden; })[0];
    if (current && current.getAttribute('data-title')) document.title = current.getAttribute('data-title');
    var strings = shell[lang] || shell.en || {};
    Array.prototype.forEach.call(document.querySelectorAll('[data-shell]'), function (el) {
      var key = el.getAttribute('data-shell');
      if (strings[key]) el.textContent = strings[key];
    });
    Array.prototype.forEach.call(document.querySelectorAll('#langMenu button'), function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    var label = document.getElementById('langCurrent');
    if (label) label.textContent = lang.toUpperCase();
  }

  var btn = document.getElementById('langBtn');
  var menu = document.getElementById('langMenu');
  if (btn && menu) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
    Array.prototype.forEach.call(menu.querySelectorAll('button'), function (b) {
      b.addEventListener('click', function () {
        var lang = b.getAttribute('data-lang');
        try { localStorage.setItem('feelim_lang', lang); } catch (e) {}
        apply(lang);
      });
    });
  }
  apply(pick());

  /* Google tag with Consent Mode: analytics cookies only if the visitor accepted on feelim.io */
  try {
    var GA = 'G-7H79RMEMTM';
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    if (localStorage.getItem('feelim_consent') === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
    gtag('js', new Date());
    gtag('config', GA, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var gs = document.createElement('script');
    gs.async = true;
    gs.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA;
    document.head.appendChild(gs);
  } catch (e) {}
})();
