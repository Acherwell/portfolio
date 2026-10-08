(function () {
  /* Voyage : trace + vaisseau pilotes par le scroll */
  var SVG = 'http://www.w3.org/2000/svg';
  var voyage = document.getElementById('voyage');
  var carte = document.getElementById('carte');
  var gTraces = document.getElementById('traces');
  var gStations = document.getElementById('stations');
  var vaisseau = document.getElementById('vaisseau');
  var etapes = Array.prototype.slice.call(document.querySelectorAll('.etape'));
  var couleurs = ['var(--y)', 'var(--r)', 'var(--b)', 'var(--g)'];
  var NB = 0;
  var RAYON = 110;
  var segments = [];
  var stations = [];
  var tops = [];

  function vider(noeud) { while (noeud.firstChild) noeud.removeChild(noeud.firstChild); }

  function construire() {
    var W = voyage.clientWidth;
    var H = voyage.offsetHeight;
    carte.setAttribute('width', W);
    carte.setAttribute('height', H);
    carte.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var xG = Math.max(16, (W - 1100) / 2 - 40);
    var xD = W - xG;
    tops = etapes.map(function (e) { return e.offsetTop; });

    vider(gTraces); vider(gStations);
    segments = []; stations = [];

    NB = etapes.length - 1;
    for (var i = 0; i < NB; i++) {
      var x1 = i % 2 ? xD : xG;
      var x2 = i % 2 ? xG : xD;
      var debut = i === 0 ? 40 : tops[i] + RAYON;
      var c0 = tops[i + 1] - RAYON;
      var c1 = tops[i + 1] + RAYON;
      var m = (c0 + c1) / 2;
      var fin = c1;
      var d = 'M' + x1 + ' ' + debut + 'V' + c0 + 'C' + x1 + ' ' + m + ' ' + x2 + ' ' + m + ' ' + x2 + ' ' + c1;
      if (i === NB - 1) {
        fin = tops[NB] + etapes[NB].offsetHeight - 140;
        d += 'V' + fin;
      }
      var p = document.createElementNS(SVG, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', 'trace');
      p.style.color = couleurs[i % couleurs.length];
      gTraces.appendChild(p);
      var len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = len;
      segments.push({ el: p, len: len, debut: debut, fin: fin });

      ajouterStation(x2, c1, couleurs[i % couleurs.length], 9);
      if (i === NB - 1) ajouterStation(x2, fin, couleurs[i % couleurs.length], 14);
    }
    mettreAJour();
  }

  function ajouterStation(x, y, couleur, r) {
    var c = document.createElementNS(SVG, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', r);
    c.setAttribute('class', 'station');
    c.style.color = couleur;
    gStations.appendChild(c);
    stations.push({ el: c, y: y });
  }

  /* y augmente toujours le long de la trace : on cherche la longueur par dichotomie */
  function longueurPourY(seg, y) {
    var bas = 0, haut = seg.len;
    for (var k = 0; k < 18; k++) {
      var mil = (bas + haut) / 2;
      if (seg.el.getPointAtLength(mil).y < y) bas = mil; else haut = mil;
    }
    return (bas + haut) / 2;
  }

  var yLisse = null;
  var coucheLoin, couchePres;

  function cibleY() {
    var hautVoyage = voyage.getBoundingClientRect().top + window.scrollY;
    var y = window.scrollY + window.innerHeight * 0.5 - hautVoyage;
    return Math.min(Math.max(y, segments[0].debut), segments[segments.length - 1].fin);
  }

  function mettreAJour() {
    if (!segments.length) return;
    var vise = cibleY();
    if (yLisse === null) yLisse = vise;
    /* interpolation : on avance d'une fraction de l'ecart a chaque image, d'ou le glissement */
    yLisse += (vise - yLisse) * 0.14;
    if (Math.abs(vise - yLisse) < 0.4) yLisse = vise;
    var y = yLisse;

    var courant = segments[segments.length - 1], lCourant = segments[segments.length - 1].len;
    for (var i = 0; i < segments.length; i++) {
      var s = segments[i];
      if (y >= s.fin) { s.el.style.strokeDashoffset = 0; }
      else if (y <= s.debut) { s.el.style.strokeDashoffset = s.len; if (i === 0) { courant = s; lCourant = 0; } }
      else {
        var l = longueurPourY(s, y);
        s.el.style.strokeDashoffset = s.len - l;
        courant = s; lCourant = l;
      }
    }

    var a = courant.el.getPointAtLength(Math.max(0, lCourant - 1));
    var b = courant.el.getPointAtLength(Math.min(courant.len, lCourant + 1));
    var pt = courant.el.getPointAtLength(lCourant);
    var angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    var echelle = voyage.clientWidth < 600 ? 0.6 : 1;
    var vitesse = Math.max(-1, Math.min(1, (cibleY() - yLisse) / 40));
    var incline = vitesse * 14;
    vaisseau.setAttribute('transform', 'translate(' + pt.x + ' ' + pt.y + ') rotate(' + (angle + incline) + ') scale(' + echelle + ')');
    if (coucheLoin === undefined) { coucheLoin = document.querySelector('.couche.loin'); couchePres = document.querySelector('.couche.pres'); }
    if (coucheLoin) {
      coucheLoin.style.transform = 'translate3d(0, ' + (-window.scrollY * 0.03) + 'px, 0)';
      couchePres.style.transform = 'translate3d(0, ' + (-window.scrollY * 0.11) + 'px, 0)';
    }

    etapes.forEach(function (e, i) {
      if (i === 0 || y >= tops[i] - 60) e.classList.add('vu');
    });
    surveillerAstronaute();
    stations.forEach(function (st) {
      if (y >= st.y - 2) st.el.classList.add('vu');
    });
  }

  /* Prepare les animations d'entree : masque sur les titres, delai en cascade sur le reste */
  function preparerAnimations() {
    etapes.forEach(function (etape) {
      var titres = etape.querySelectorAll('h1, h2');
      Array.prototype.forEach.call(titres, function (t) {
        var lignes = t.innerHTML.split(/<br\s*\/?>/i);
        t.innerHTML = lignes.map(function (l, i) {
          return '<span class="masque"><span class="ligne" style="--d: ' + (i * 0.12) + 's">' + l + '</span></span>';
        }).join('');
      });
      var cibles = etape.querySelectorAll('p, .actions, .projets li, .parcours li, .engagements li, .contact-liens a');
      Array.prototype.forEach.call(cibles, function (c, i) {
        if (c.tagName === 'P' && (c.closest('.parcours li') || c.closest('.engagements li'))) return;
        c.classList.add('anim');
        c.style.setProperty('--d', Math.min(0.25 + i * 0.09, 0.9) + 's');
      });
    });
  }
  preparerAnimations();

  /* Relief : les elements s'inclinent legerement sous le pointeur */
  var tactile = window.matchMedia('(hover: none)').matches;
  var doux = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!tactile && !doux) {
    var reliefs = document.querySelectorAll('.photo-cadre, .projets a, .engagements li');
    Array.prototype.forEach.call(reliefs, function (el) {
      el.classList.add('relief');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'rotateY(' + (px * 7) + 'deg) rotateX(' + (-py * 7) + 'deg) translateZ(12px)';
      });
      el.addEventListener('pointerleave', function () { el.style.transform = ''; });
    });
  }

  /* Arrivee de l'astronaute dans la section contact. Rien n'est bloque :
     le contact s'affiche comme les autres sections, l'astronaute arrive a cote. */
  var ancre = document.getElementById('bonhomme-ancre');
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prechargee = false, arrivee = false;
  function surveillerAstronaute() {
    if (!ancre || arrivee) return;
    var r = ancre.getBoundingClientRect();
    var f3d = window.finale3d;
    if (!prechargee && f3d && !reduit && r.top < window.innerHeight * 2.5) {
      prechargee = true;
      f3d.precharger();
    }
    if (r.top > window.innerHeight * 0.85) return;
    arrivee = true;
    function repli() { ancre.classList.add('arrive'); }
    if (reduit || !f3d || !f3d.disponible()) { repli(); return; }
    /* si la 3D tarde (connexion lente), on n'attend pas : dessin 2D */
    var delai = setTimeout(function () { delai = null; repli(); }, 2500);
    f3d.poser(ancre, function () { return delai !== null; }).then(function () {
      if (delai) clearTimeout(delai);
    }, function () {
      if (delai) { clearTimeout(delai); repli(); }
    });
  }

  /* Boucle permanente : le rendu suit sa propre cadence, independante des evenements de scroll */
  var finPropulsion = null;
  function boucle() {
    mettreAJour();
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);

  function surScroll() {
    vaisseau.classList.add('propulse');
    clearTimeout(finPropulsion);
    finPropulsion = setTimeout(function () { vaisseau.classList.remove('propulse'); }, 180);
  }

  window.addEventListener('scroll', surScroll, { passive: true });
  window.addEventListener('resize', construire);
  window.addEventListener('load', construire);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(construire);
  construire();
})();
