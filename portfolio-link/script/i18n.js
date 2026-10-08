/* Bilinguisme
   Le français est la langue source : il est écrit dans le HTML et sert de repli.
   Les autres langues vivent dans TEXTES, sous les clés des attributs data-i18n
   (contenu de l'élément) et data-i18n-attr="alt:cle;aria-label:cle" (attributs).
   Chaque langue a sa propre adresse (?lang=en), donc changer de langue recharge
   la page : les animations d'entrée se préparent une seule fois, sur le bon texte.
   Les balises hreflang sont écrites en dur dans le <head> de chaque page.
   Ordre de priorité : ?lang= dans l'adresse, puis choix mémorisé, puis langue du
   navigateur, puis français. Ajouter une langue = l'ajouter à LANGUES et à TEXTES. */
(function () {
  var SOURCE = 'fr';
  var LANGUES = ['fr', 'en'];
  var NOMS = { fr: 'Version française', en: 'English version' };

  var TEXTES = {
    /* Pour le français, seuls les textes générés par script : le reste est dans le HTML */
    fr: {
      'ui.theme.sombre': 'Mode sombre',
      'ui.theme.clair': 'Mode clair'
    },
    en: {
      'ui.theme.sombre': 'Dark mode',
      'ui.theme.clair': 'Light mode',

      /* Commun à toutes les pages */
      'nav.aria': 'Main navigation',
      'nav.apropos': '/about',
      'nav.projets': '/projects',
      'nav.parcours': '/background',
      'nav.engagements': '/involvement',
      'nav.contact': '/contact',
      'pied.copyright': '© 2026 Abraham Nangue-Otom, Montréal, Canada',
      'pied.fait': 'Handmade in HTML, CSS and JavaScript',
      'page.retour': 'Back to projects',

      /* Accueil */
      'accueil.titre': 'Abraham Nangue-Otom, computer and electronic systems student',
      /* Descriptions pour les moteurs de recherche */
      'accueil.desc': 'Portfolio of Abraham Nangue-Otom (Acherwell NOA), computer and electronic systems student at UQAM, Montréal: embedded systems, web applications, APIs and games.',
      'ach.desc': 'Personal AI assistant built from scratch. A project by Abraham Nangue-Otom.',
      'aess.desc': 'Website for the Association étudiante du secteur des sciences de l\'UQAM (AESS), the science students\' association, built as a volunteer. A project by Abraham Nangue-Otom.',
      'anode.desc': 'REST API with a database and token authentication. A project by Abraham Nangue-Otom.',
      'basket.desc': 'Two-player basketball arcade game, in the browser. A project by Abraham Nangue-Otom.',
      'capi.desc': 'REST API that exposes data from embedded sensors. A project by Abraham Nangue-Otom.',
      'jeu.desc': 'Personal video game project, in progress. A project by Abraham Nangue-Otom.',
      'mon.desc': 'Simulated embedded system: data collection, alerts and a real-time web dashboard. A project by Abraham Nangue-Otom.',
      'sf.desc': 'The café\'s website, live and used every day. A project by Abraham Nangue-Otom.',

      'hero.titre': 'From circuit<br>to pixel.',
      'hero.texte': 'I\'m Abraham Nangue-Otom. A computer and electronic systems student at UQAM, I build websites, games and an AI assistant from scratch.',
      'hero.voir': 'See the projects',
      'hero.contact': 'Contact me',
      'photo.ici': 'Photo coming soon',
      'photo.alt': 'Portrait of Abraham Nangue-Otom',

      'apropos.titre': 'About',
      'apropos.texte': 'Third-year student in the Bachelor\'s in Computer and Electronic Systems at UQAM, in Montréal, Canada. Manager of Café Sain Fractal.',
      'apropos.perso': 'I build projects that span hardware and software: embedded systems, web applications, APIs and automation tools. I like understanding a system end to end, from the circuit to the interface.',

      'projets.titre': 'Projects',
      'projets.jeu.nom': 'Video game development',
      'projets.jeu.desc': '2D strategy game, simulation engine built in Godot.',
      'projets.jeu.type': 'Personal project',
      'projets.sf.desc': 'The café\'s website, live and used every day.',
      'projets.sf.type': 'Website',
      'projets.ach.desc': 'Personal AI assistant: voice, PC control, robotics.',
      'projets.ach.type': 'AI and robotics',
      'projets.aess.nom': 'AESS website',
      'projets.aess.desc': 'Website for the UQAM science students\' association, built as a volunteer.',
      'projets.aess.type': 'Website',

      'parcours.titre': 'Background',
      'parcours.bac.date': 'Since 2024-09',
      'parcours.bac.titre': 'Bachelor\'s in Computer and Electronic Systems',
      'parcours.bac.lieu': 'UQAM, Montréal, Canada. Third year, in progress.',
      'parcours.cert.date': '2023-01 to 2023-11',
      'parcours.cert.titre': 'Certificate in Application Development',
      'parcours.cert.lieu': 'Powerbache Education, Cameroon.',

      'engagements.titre': 'Involvement',
      'engagements.sf.titre': 'Manager, Café Sain Fractal',
      'engagements.sf.texte': 'Coordinating a volunteer-run student café at UQAM, and designing its website.',
      'engagements.aess.titre': 'Volunteer, AESS',
      'engagements.aess.texte': 'Designed and built the student association\'s website, presented to and delivered for the executive team.',

      'contact.titre': 'End of the journey. Shall we talk?',
      'contact.texte': 'A project, an internship, a question: drop me a line.',
      'contact.github': 'GitHub: Acherwell',

      /* Pages projet */
      'jeu.titre': 'Video game development, Abraham Nangue-Otom',
      'jeu.h1': 'Video game development',
      'jeu.chapeau': 'Personal video game project, in progress.',
      'jeu.p1': 'I am developing a 2D strategy game. The project is in its early stages: I am currently working on the simulation engine that brings the world to life.',
      'jeu.p2': 'The rule I set myself is to build from the ground up. I lay down a simple data structure, test it, and only add the next layer once the one below holds. The system now rests on three levels, each derived from the one before, which makes inconsistent states impossible to write.',
      'jeu.p3': 'The game\'s behaviour lives in data rather than in code: adding a new element to the world requires no change to the logic. This constraint forces me to separate general rules from special cases.',
      'jeu.meta': 'Godot 4, GDScript. In development, more details to come.',

      'sf.titre': 'Café Sain Fractal, Abraham Nangue-Otom',
      'sf.chapeau': 'The café\'s website, live and used every day.',
      'sf.capture.alt': 'Home page of the Café Sain Fractal website',
      'sf.p1': 'Showcase website for Café Sain Fractal, which I manage: an introduction to the venue, product categories and event announcements, with past events expiring automatically.',
      'sf.p2': 'I connected a contact form, a database for the content, and search engine optimisation: Open Graph tags, metadata and Google Search Console verification.',
      'sf.meta': 'HTML, CSS, JavaScript, Supabase, deployed on Netlify.',

      'ach.titre': 'Acherwell, Abraham Nangue-Otom',
      'ach.chapeau': 'Personal AI assistant built from scratch.',
      'ach.p1': 'Acherwell is a personal assistant I am building from scratch, without starting from an existing product. The goal: a single system that can listen, act on my computer and, eventually, control hardware.',
      'ach.p2': 'The project is split into three parts: voice interaction, PC control and robotics. It is where the two halves of my studies meet: software and electronics.',
      'ach.meta': 'Personal project in development, more details to come.',

      'aess.titre': 'AESS website, Abraham Nangue-Otom',
      'aess.h1': 'AESS website',
      'aess.chapeau': 'Website for the Association étudiante du secteur des sciences de l\'UQAM (AESS), the science students\' association, built as a volunteer.',
      'aess.p1': 'A complete website for the AESS: an introduction to the association, news and resources for members. Designed so the executive team can publish without touching the code.',
      'aess.p2': 'I built an admin panel connected to a CMS, in French for the association\'s members, along with a dark mode. I also prepared and presented the project to the executive team before getting started.',
      'aess.meta': 'React, Vite, Tailwind CSS, Decap CMS.',

      /* Projets publiés sur GitHub */
      'page.code': 'Source code on GitHub',
      'projets.mon.nom': 'Sensor monitoring',
      'projets.mon.desc': 'Simulated embedded system, alerts and a real-time web dashboard.',
      'projets.mon.type': 'Embedded and web',
      'projets.capi.nom': 'Sensor API in Python',
      'projets.capi.desc': 'REST API that exposes embedded sensor data.',
      'projets.capi.type': 'REST API',
      'projets.anode.nom': 'Sensor API in Node.js',
      'projets.anode.desc': 'REST API with an SQLite database and JWT authentication.',
      'projets.anode.type': 'REST API',
      'projets.basket.nom': 'Basket 2D',
      'projets.basket.desc': 'Two-player arcade game in plain JavaScript on Canvas.',
      'projets.basket.type': 'Game',

      'mon.titre': 'Sensor monitoring, Abraham Nangue-Otom',
      'mon.h1': 'Sensor monitoring',
      'mon.chapeau': 'Simulated embedded system: data collection, alerts and a real-time web dashboard.',
      'mon.p1': 'This project simulates a Raspberry Pi-style embedded system. Temperature and humidity sensors produce readings, which are automatically logged to a CSV file.',
      'mon.p2': 'A web interface displays the data in real time, refreshing every 3 seconds, with a dedicated alerts page. Data collection and the web server run in parallel, on two threads.',
      'mon.meta': 'Python 3.12, Flask, threading, CSV.',

      'capi.titre': 'Sensor API in Python, Abraham Nangue-Otom',
      'capi.h1': 'Sensor API in Python',
      'capi.chapeau': 'REST API that exposes data from embedded sensors.',
      'capi.p1': 'Designed to make data from an embedded system (Raspberry Pi) available over HTTP, to any web, mobile or server application.',
      'capi.p2': 'It returns all readings, the readings of a single sensor or only the alerts, and accepts new readings. CORS is enabled so a web page can call it directly.',
      'capi.meta': 'Python 3.12, Flask, Flask-CORS.',

      'anode.titre': 'Sensor API in Node.js, Abraham Nangue-Otom',
      'anode.h1': 'Sensor API in Node.js',
      'anode.chapeau': 'REST API with a database and token authentication.',
      'anode.p1': 'The same service as the Python API, rebuilt in Node.js with real persistence: readings are stored in an SQLite database.',
      'anode.p2': 'Reading is public. Adding a reading requires a JWT, obtained at login and sent in the Authorization header.',
      'anode.meta': 'Node.js, Express, better-sqlite3, jsonwebtoken.',

      'basket.titre': 'Basket 2D, Abraham Nangue-Otom',
      'basket.h1': 'Basket 2D',
      'basket.chapeau': 'Two-player basketball arcade game, in the browser.',
      'basket.alt': 'Basket 2D start screen, showing both players\' controls',
      'basket.p1': 'Written in plain JavaScript on HTML5 Canvas, with no dependencies. Two players face off on the same keyboard for two minutes.',
      'basket.p2': 'Animated dribbling while moving, dunks near the basket, blocks, a visual trail on shots and an end screen with the score.',
      'basket.meta': 'JavaScript, HTML5 Canvas. Characters: Kenney (CC0). Ball: OpenGameArt (public domain).'
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

  /* Remplacement du texte (le HTML porte déjà le français) */
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

  /* Liens internes : on garde la langue d'une page à l'autre */
  Array.prototype.forEach.call(document.querySelectorAll('a[href]'), function (a) {
    var href = a.getAttribute('href');
    if (/^[a-z]+:|^\/\/|^#/i.test(href) || !/\.html(#|$)/.test(href)) return;
    var morceaux = href.split('#');
    a.setAttribute('href', morceaux[0] + '?lang=' + langue + (morceaux[1] ? '#' + morceaux[1] : ''));
  });

  /* Sélecteur : un vrai lien vers l'autre langue, donc lisible par les moteurs */
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
})();
