(function () {
  var racine = document.documentElement;
  racine.classList.add('js');

  /* Thème clair / sombre */
  var btnTheme = document.getElementById('btn-theme');
  function themeActuel() {
    var t = racine.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function appliquerTheme(t) {
    racine.setAttribute('data-theme', t);
    btnTheme.textContent = window.i18n.t(t === 'dark' ? 'ui.theme.clair' : 'ui.theme.sombre');
  }
  try {
    var sauve = localStorage.getItem('theme');
    if (sauve === 'dark' || sauve === 'light') racine.setAttribute('data-theme', sauve);
  } catch (e) {}
  appliquerTheme(themeActuel());
  btnTheme.addEventListener('click', function () {
    var t = themeActuel() === 'dark' ? 'light' : 'dark';
    appliquerTheme(t);
    try { localStorage.setItem('theme', t); } catch (e) {}
  });

  /* Décor : positions fixes, pas de hasard, pour garder la même composition à chaque visite */
  var decor = document.getElementById('decor');
  if (decor) {
    var coucheLoin = document.createElement('div');
    coucheLoin.className = 'couche loin';
    var couchePres = document.createElement('div');
    couchePres.className = 'couche pres';
    decor.appendChild(coucheLoin);
    decor.appendChild(couchePres);
    var teintes = ['var(--y)', 'var(--r)', 'var(--b)', 'var(--g)'];
    var formes = [[6, 18, ''], [88, 12, 'rond'], [72, 34, 'plein'], [14, 58, 'rond'], [93, 62, ''], [40, 82, 'plein'], [58, 8, 'plein'], [24, 90, ''], [80, 88, 'rond'], [3, 40, 'plein']];
    formes.forEach(function (f, i) {
      var el = document.createElement('span');
      el.className = 'forme ' + f[2];
      el.style.left = f[0] + '%';
      el.style.top = f[1] + '%';
      el.style.color = teintes[i % 4];
      el.style.animationDuration = (13 + i * 1.7) + 's';
      el.style.animationDelay = (-i * 2.3) + 's';
      couchePres.appendChild(el);
    });
    var etoiles = [[10, 8], [22, 30], [35, 14], [48, 44], [61, 22], [75, 52], [86, 28], [95, 46], [16, 72], [31, 60], [52, 76], [68, 92], [83, 74], [44, 96], [7, 94], [91, 6]];
    etoiles.forEach(function (e, i) {
      var el = document.createElement('span');
      el.className = 'etoile';
      el.style.left = e[0] + '%';
      el.style.top = e[1] + '%';
      el.style.animationDuration = (2 + (i % 5) * 0.7) + 's';
      el.style.animationDelay = (-i * 0.4) + 's';
      coucheLoin.appendChild(el);
    });
    var filante = document.createElement('span');
    filante.className = 'filante';
    coucheLoin.appendChild(filante);
  }
})();
