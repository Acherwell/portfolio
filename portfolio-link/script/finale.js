/* Finale : une seule timeline, un seul requestAnimationFrame.
   Tout est calculé ici plutôt que par des @keyframes empilées : c'est ce qui
   permet d'enchaîner les phases sans coupure et de faire suivre le texte
   avec du retard, comme s'il était réellement tracté. */
(function () {
  var reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Courbes d'accélération. Elles font tout le travail : une vitesse constante
     donne un mouvement de robot, une courbe donne un mouvement vivant. */
  function douxEntreeSortie(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  function freine(t) { return 1 - Math.pow(1 - t, 3); }
  function freineFort(t) { return 1 - Math.pow(1 - t, 5); }
  function depasse(t) {
    var c = 1.7;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  }
  function part(t, debut, fin) {
    if (t <= debut) return 0;
    if (t >= fin) return 1;
    return (t - debut) / (fin - debut);
  }
  function melange(a, b, k) { return a + (b - a) * k; }

  window.finale = {
    jouer: function (opts) {
      var enveloppe = opts.enveloppe;
      var vaisseau = opts.vaisseau;
      var bonhomme = opts.bonhomme;
      var cable = opts.cable;
      var trait = opts.trait;
      var haut = opts.demiHaut;
      var bas = opts.demiBas;
      var texte = opts.texte;
      var section = opts.section;
      var ancre = opts.ancre;
      var termine = opts.termine;

      if (reduit) { termine(); return; }

      var L = window.innerWidth;
      var H = window.innerHeight;
      var DUREE = 5200;
      var depart = null;

      /* Point d'arrivée du bonhomme : là où l'ancre l'attend dans la page. */
      function cibleBonhomme(decalageTexte) {
        /* l'ancre voyage avec le bloc de texte : on retire son decalage
           pour viser la place qu'elle occupera une fois le texte en place */
        var r = ancre.getBoundingClientRect();
        return { x: r.left + r.width / 2 - decalageTexte, y: r.top + r.height / 2 };
      }

      enveloppe.classList.add('joue');
      cable.style.opacity = '1';
      /* le texte attend hors champ, a droite, des le depart */
      texte.style.transform = 'translate3d(' + (0.95 * L) + 'px, 0, 0)';

      function image(maintenant) {
        if (depart === null) depart = maintenant;
        var t = Math.min((maintenant - depart) / DUREE, 1);

        /* --- Le vaisseau : arrivée, boucle, approche, ouverture --- */
        var pOuvre = part(t, 0.40, 0.56);
        var x, y, ech, angle;

        if (t < 0.24) {
          var a = douxEntreeSortie(part(t, 0, 0.24));
          x = melange(-0.2 * L, 1.05 * L, a);
          y = melange(0.82 * H, 0.22 * H, a);
          ech = melange(0.3, 0.5, a);
          angle = -34 + 360 * a;
        } else if (t < 0.40) {
          var b = freine(part(t, 0.24, 0.40));
          x = melange(1.05 * L, 0.5 * L, b);
          y = melange(0.22 * H, 0.5 * H, b);
          ech = melange(0.5, 3.1, b * b);
          angle = melange(326, 360, b);
        } else {
          x = 0.5 * L; y = 0.5 * H; ech = 3.1; angle = 360;
        }

        vaisseau.style.transform =
          'translate3d(' + x + 'px, ' + y + 'px, 0) rotate(' + angle + 'deg) scale(' + ech + ')';
        vaisseau.style.opacity = pOuvre > 0.9 ? String(1 - part(t, 0.54, 0.6)) : '1';

        /* L'ouverture : les deux moitiés s'écartent, sans flash ni explosion. */
        var o = freine(pOuvre);
        haut.style.transform = 'translateY(' + (-26 * o) + 'px) rotate(' + (-9 * o) + 'deg)';
        bas.style.transform = 'translateY(' + (26 * o) + 'px) rotate(' + (9 * o) + 'deg)';

        /* --- Le bonhomme : il sort de l'écoutille et part vers la gauche --- */
        var pSort = part(t, 0.46, 0.62);
        var pVol = part(t, 0.52, 1);

        /* --- Le texte suit avec du retard : ce decalage donne la traction --- */
        var suivi = freineFort(part(t, 0.56, 0.98));
        var decalage = (1 - suivi) * 0.95 * L;
        texte.style.transform = 'translate3d(' + decalage + 'px, 0, 0)';

        var cible = cibleBonhomme(decalage);

        if (pSort > 0) {
          var sortie = depasse(Math.min(pSort, 1));
          var vol = freineFort(pVol);
          var bx = melange(0.5 * L, cible.x, vol);
          var by = melange(0.5 * H, cible.y, vol);
          var bech = melange(0.25, 1, Math.max(sortie, vol));
          /* léger balancement : il dérive vers le haut puis se repose */
          var balance = Math.sin(pVol * Math.PI) * 26;
          var inclinaison = (1 - vol) * -9;
          bonhomme.style.opacity = String(Math.min(pSort * 2.2, 1));
          bonhomme.style.transform =
            'translate3d(' + bx + 'px, ' + (by - balance) + 'px, 0) rotate(' + inclinaison + 'deg) scale(' + bech + ')';

          /* --- Le câble relie sa main au bloc de texte --- */
          var mainX = bx + 26 * bech;
          var mainY = by - balance + 6 * bech;
          var rTexte = texte.getBoundingClientRect();
          var accrocheX = rTexte.left;
          var accrocheY = rTexte.top + rTexte.height * 0.55;
          var mx = (mainX + accrocheX) / 2;
          var my = (mainY + accrocheY) / 2 + 24 * (1 - suivi);
          trait.setAttribute('d', 'M' + mainX + ' ' + mainY + ' Q' + mx + ' ' + my + ' ' + accrocheX + ' ' + accrocheY);
          cable.style.opacity = String(1 - part(t, 0.9, 1));
        }

        if (t < 1) {
          requestAnimationFrame(image);
        } else {
          /* Passage de relais : le bonhomme quitte la scène fixe et rejoint
             la page, où il scrolle avec le reste au lieu de rester collé. */
          enveloppe.classList.remove('joue');
          texte.style.transform = '';
          section.classList.remove('tracte');
          ancre.appendChild(bonhomme.firstElementChild);
          ancre.classList.add('pose');
          termine();
        }
      }

      requestAnimationFrame(image);
    }
  };
})();
