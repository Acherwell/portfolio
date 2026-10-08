/* Bilinguisme
   Le francais est la langue source : il est ecrit dans le HTML et sert de repli.
   Les autres langues vivent dans TEXTES, sous les cles des attributs data-i18n
   (contenu de l'element) et data-i18n-attr="alt:cle;aria-label:cle" (attributs).
   Chaque langue a sa propre adresse (?lang=en), donc changer de langue recharge
   la page : les animations d'entree se preparent une seule fois, sur le bon texte.
   Ordre de priorite : ?lang= dans l'adresse, puis choix memorise, puis langue du
   navigateur, puis francais. Ajouter une langue = l'ajouter a LANGUES et a TEXTES. */
(function () {
  var SOURCE = 'fr';
  var LANGUES = ['fr', 'en'];
  var NOMS = { fr: 'Version française', en: 'English version' };

  var TEXTES = {
    /* Pour le francais, seuls les textes generes par script : le reste est dans le HTML */
    fr: {
      'ui.theme.sombre': 'Mode sombre',
      'ui.theme.clair': 'Mode clair'
    },
    en: {
      'ui.theme.sombre': 'Dark mode',
      'ui.theme.clair': 'Light mode',

      /* Commun a toutes les pages */
      'nav.aria': 'Main navigation',
      'nav.apropos': '/about',
      'nav.projets': '/projects',
      'nav.parcours': '/background',
      'nav.engagements': '/involvement',
      'nav.contact': '/contact',
      'pied.copyright': '© 2026 [First Last], Montréal, Canada',
      'pied.fait': 'Handmade in HTML, CSS and JavaScript',
      'page.retour': 'Back to projects',
      'page.lienSite': '[LINK TO THE SITE]',

      /* Accueil */
      'accueil.titre': '[First Last], portfolio',
      'hero.titre': 'From circuit<br>to pixel.',
      'hero.texte': 'I\'m [First Last]. A computer and electronic systems student at UQAM, I build websites, games and an AI assistant from scratch.',
      'hero.voir': 'See the projects',
      'hero.contact': 'Contact me',
      'photo.ici': 'Your photo here',
      'photo.format': 'images/link.jpg, 4:5 ratio',
      'photo.alt': 'Portrait of [First Last]',

      'apropos.titre': 'About',
      'apropos.texte': 'Third-year student in the Bachelor\'s in Computer and Electronic Systems at UQAM, in Montréal, Canada. Manager of Café Sain Fractal.',
      'apropos.perso': '[Two or three sentences of your own: what drives you, what you are looking for, what you like to build.]',

      'projets.titre': 'Projects',
      'projets.jeu.nom': 'Video game development',
      'projets.jeu.desc': '2D strategy game, simulation engine built in Godot.',
      'projets.jeu.type': 'Personal project',
      'projets.sf.desc': 'The café\'s website, live and used every day.',
      'projets.sf.type': 'Website',
      'projets.ach.desc': 'Personal AI assistant: voice, PC control, robotics.',
      'projets.ach.type': 'AI and robotics',
      'projets.aess.nom': 'AESS website',
      'projets.aess.desc': 'Student association website, built as a volunteer.',
      'projets.aess.type': 'Website',

      'parcours.titre': 'Background',
      'parcours.bac.date': 'Since [YYYY-MM]',
      'parcours.bac.titre': 'Bachelor\'s in Computer and Electronic Systems',
      'parcours.bac.lieu': 'UQAM, Montréal, Canada. Third year, in progress.',
      'parcours.cert.date': '[2023-MM]',
      'parcours.cert.titre': 'Certificate in Application Development',
      'parcours.cert.lieu': '[Institution, country.]',

      'engagements.titre': 'Involvement',
      'engagements.sf.date': 'Since [YYYY-MM]',
      'engagements.sf.titre': 'Manager, Café Sain Fractal',
      'engagements.sf.texte': '[What you manage there, in one sentence.]',
      'engagements.aess.date': 'Since [YYYY-MM]',
      'engagements.aess.titre': 'Volunteer, AESS (student association)',
      'engagements.aess.texte': '[Your role, in one sentence.]',

      'contact.titre': 'End of the journey. Shall we talk?',
      'contact.texte': 'A project, an internship, a question: drop me a line.',
      'contact.courriel': '[YOUR EMAIL]',
      'contact.github': 'GitHub: Acherwell',

      /* Pages projet */
      'jeu.titre': 'Video game development, [First Last]',
      'jeu.h1': 'Video game development',
      'jeu.chapeau': 'Personal video game project, in progress.',
      'jeu.capture': 'Screenshot here: images/jeu.jpg, 16:9 ratio',
      'jeu.p1': 'I am developing a 2D strategy game. The project is in its early stages: I am currently working on the simulation engine that brings the world to life.',
      'jeu.p2': 'The rule I set myself is to build from the ground up. I lay down a simple data structure, test it, and only add the next layer once the one below holds. The system now rests on three levels, each derived from the one before, which makes inconsistent states impossible to write.',
      'jeu.p3': 'The game\'s behaviour lives in data rather than in code: adding a new element to the world requires no change to the logic. This constraint forces me to separate general rules from special cases.',
      'jeu.meta': 'Godot 4, GDScript. In development, more details to come.',

      'sf.titre': 'Café Sain Fractal, [First Last]',
      'sf.chapeau': 'The café\'s website, live and used every day.',
      'sf.capture': 'Screenshot here: images/sain-fractal.jpg, 16:9 ratio',
      'sf.p1': 'Showcase website for Café Sain Fractal, which I manage: an introduction to the venue, product categories and event announcements, with past events expiring automatically.',
      'sf.p2': 'I connected a contact form, a database for the content, and search engine optimisation: Open Graph tags, metadata and Google Search Console verification.',
      'sf.meta': 'HTML, CSS, JavaScript, Supabase, deployed on Netlify.',

      'ach.titre': 'Acherwell, [First Last]',
      'ach.chapeau': 'Personal AI assistant built from scratch.',
      'ach.capture': 'Screenshot here: images/acherwell.jpg, 16:9 ratio',
      'ach.p1': '[Two or three sentences: what Acherwell does, why you started it.]',
      'ach.p2': '[The parts of the system: voice, PC control, robotics. What already works, what is under construction.]',
      'ach.meta': '[Technologies used.]',

      'aess.titre': 'AESS website, [First Last]',
      'aess.h1': 'AESS website',
      'aess.chapeau': 'Website for the student association, built as a volunteer.',
      'aess.capture': 'Screenshot here: images/aess.jpg, 16:9 ratio',
      'aess.p1': 'A complete website for the AESS: an introduction to the association, news and resources for members. Designed so the executive team can publish without touching the code.',
      'aess.p2': 'I built an admin panel connected to a CMS, in French for the association\'s members, along with a dark mode. I also prepared and presented the project to the executive team before getting started.',
      'aess.meta': 'React, Vite, Tailwind CSS, Decap CMS.'
    }
  };

  function valide(l) { return LANGUES.indexOf(l) !== -1 ? l : null; }
  function depuisAdresse() {
    try { return valide(new URLSearchParams(location.search).get('lang')); } catch (e) { return null; }
  }
  function memorisee() {
    try { return valide(localStorage.getItem('langue')); } catch (e) { return null; }
  }
  function navigateur() {
    var l = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return valide(l.slice(0, 2).toLowerCase());
  }

  var langue = depuisAdresse() || memorisee() || navigateur() || SOURCE;
  var racine = document.documentElement;
  racine.lang = langue;

  function t(cle) {
    var d = TEXTES[langue];
    if (d && d[cle] !== undefined) return d[cle];
    return TEXTES[SOURCE][cle];
  }
  window.i18n = { langue: langue, t: t };

  /* Remplacement du texte (le HTML porte deja le francais) */
  if (langue !== SOURCE) {
    var dico = TEXTES[langue];
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n]'), function (el) {
      var cle = el.getAttribute('data-i18n');
      if (dico[cle] === undefined) { console.warn('i18n : cle manquante', langue, cle); return; }
      if (el.tagName === 'TITLE') el.textContent = dico[cle];
      else el.innerHTML = dico[cle];
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-i18n-attr]'), function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (paire) {
        var p = paire.split(':');
        var cle = p[1] && p[1].trim();
        if (!cle) return;
        if (dico[cle] === undefined) { console.warn('i18n : cle manquante', langue, cle); return; }
        el.setAttribute(p[0].trim(), dico[cle]);
      });
    });
  }

  function adresse(l) { return location.pathname + '?lang=' + l + location.hash; }

  /* Liens internes : on garde la langue d'une page a l'autre */
  Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
    var href = a.getAttribute('href');
    if (/^[a-z]+:|^\/\/|^#/i.test(href) || !/\.html(#|$)/.test(href)) return;
    var morceaux = href.split('#');
    a.setAttribute('href', morceaux[0] + '?lang=' + langue + (morceaux[1] ? '#' + morceaux[1] : ''));
  });

  /* Selecteur : un vrai lien vers l'autre langue, donc lisible par les moteurs */
  var btn = document.getElementById('btn-langue');
  if (btn) {
    var cible = LANGUES[(LANGUES.indexOf(langue) + 1) % LANGUES.length];
    btn.textContent = cible.toUpperCase();
    btn.setAttribute('href', adresse(cible));
    btn.setAttribute('hreflang', cible);
    btn.setAttribute('lang', cible);
    btn.setAttribute('aria-label', NOMS[cible]);
    btn.addEventListener('click', function () {
      try { localStorage.setItem('langue', cible); } catch (e) {}
    });
  }

  /* Versions alternatives pour les moteurs de recherche (adresses absolues obligatoires) */
  if (/^https?:$/.test(location.protocol)) {
    var base = location.origin + location.pathname;
    LANGUES.concat('x-default').forEach(function (l) {
      var lien = document.createElement('link');
      lien.rel = 'alternate';
      lien.hreflang = l;
      lien.href = l === 'x-default' ? base : base + '?lang=' + l;
      document.head.appendChild(lien);
    });
  }
})();
