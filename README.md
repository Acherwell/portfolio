# Portfolio

Portfolio personnel, en français et en anglais. Site statique écrit à la main, sans framework ni étape de compilation.

**En ligne :** [ADRESSE DU SITE]

*English version below.*

## Ce qu'il y a dedans

- **HTML, CSS et JavaScript purs.** Aucune dépendance au chargement de la page.
- **Bilingue français / anglais.** Un dictionnaire unique (`script/i18n.js`) et des attributs `data-i18n` dans le HTML. Chaque langue a sa propre adresse (`?lang=fr`, `?lang=en`), annoncée aux moteurs de recherche par des balises `hreflang`. La langue est détectée au premier passage, puis le choix manuel est mémorisé.
- **Thème clair et sombre.** Tout passe par des variables CSS, et le choix est mémorisé.
- **Animation pilotée par le défilement.** Une trajectoire SVG se trace au fil de la page, suivie d'une fusée. Les sections apparaissent à leur passage, avec un fond en parallaxe.
- **Astronaute en 3D (three.js).** three.js n'est téléchargé qu'à l'approche de la section contact. S'il est indisponible, un dessin SVG prend le relais. L'animation ne bloque jamais le défilement.
- **Accessibilité.** L'option système « réduire les animations » est respectée, la navigation au clavier reste visible, et le site s'adapte aux petits écrans.

## Structure

```
portfolio-link/          le site publié
  index.html
  pages/                 une page par projet
  script/
    i18n.js              traductions et choix de la langue
    theme.js             thème clair / sombre, décor
    voyage.js            trajectoire et apparitions au défilement
    finale3d.js          astronaute 3D du contact
  style/style.css
  images/
netlify.toml             publication du dossier portfolio-link/
```

## Lancer en local

Aucune installation n'est nécessaire. Il suffit d'un petit serveur, parce que certaines fonctions du navigateur ne marchent pas en `file://` :

```bash
python -m http.server 8000 --directory portfolio-link
```

Puis ouvrir http://localhost:8000.

## Ajouter ou modifier un texte

1. Dans le HTML, le texte français porte un attribut `data-i18n="cle"`.
2. Dans `script/i18n.js`, la même clé contient le texte anglais.
3. Pour un attribut (par exemple `alt`), utiliser `data-i18n-attr="alt:cle"`.

## Crédits

- Polices : Abril Fatface, Fjalla One et JetBrains Mono (Google Fonts, licence SIL Open Font License).
- [three.js](https://threejs.org), licence MIT.

---

# Portfolio (English)

Personal portfolio in French and English. A static site written by hand, with no framework and no build step.

**Live:** [SITE URL]

## Features

- **Plain HTML, CSS and JavaScript.** No dependency on page load.
- **French / English.** A single dictionary (`script/i18n.js`) and `data-i18n` attributes in the HTML. Each language has its own URL (`?lang=fr`, `?lang=en`), declared to search engines with `hreflang` tags. The language is detected on the first visit, then the manual choice is remembered.
- **Light and dark themes.** Everything goes through CSS variables, and the choice is remembered.
- **Scroll-driven animation.** An SVG path draws itself down the page, followed by a rocket. Sections reveal as they come into view, over a parallax background.
- **3D astronaut (three.js).** three.js is only downloaded as the visitor approaches the contact section. If it is unavailable, an SVG drawing takes over. The animation never blocks scrolling.
- **Accessibility.** The system "reduce motion" setting is respected, keyboard focus stays visible, and the layout adapts to small screens.

## Run locally

No installation needed. A small server is enough, because some browser features do not work over `file://`:

```bash
python -m http.server 8000 --directory portfolio-link
```

Then open http://localhost:8000.

## Credits

- Fonts: Abril Fatface, Fjalla One and JetBrains Mono (Google Fonts, SIL Open Font License).
- [three.js](https://threejs.org), MIT License.

---

© 2026. Code and content: all rights reserved.
