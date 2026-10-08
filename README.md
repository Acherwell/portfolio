# Portfolio : site personnel bilingue

Portfolio personnel en français et en anglais, construit en HTML, CSS et JavaScript vanilla, sans framework ni étape de build.

**En ligne** : https://abrahamnangue-otom.com/

## Fonctionnalités

- Bilingue français / anglais, avec une adresse par langue (`?lang=fr`, `?lang=en`) et des balises `hreflang` pour le référencement
- Langue détectée à la première visite, puis choix mémorisé
- Thème clair / sombre géré par variables CSS, choix mémorisé
- Trajectoire SVG tracée au scroll et suivie d'une fusée, sections qui apparaissent à leur passage, fond en parallaxe
- Astronaute 3D (three.js) chargé seulement à l'approche de la section contact, avec un repli en SVG
- Respect du réglage système « réduire les animations », mise en page responsive

## Stack

- HTML, CSS, JavaScript vanilla
- three.js (chargé à la demande)
- Netlify

## Lancer le projet

```bash
python -m http.server 8000 --directory portfolio-link
```

Ouvrir http://localhost:8000 dans un navigateur. Un serveur local est nécessaire : certaines fonctions du navigateur ne marchent pas en `file://`.

## Structure

- `portfolio-link/index.html` : page principale
- `portfolio-link/pages/` : une page par projet
- `portfolio-link/script/i18n.js` : traductions et choix de la langue
- `portfolio-link/script/theme.js` : thème clair / sombre et décor
- `portfolio-link/script/voyage.js` : trajectoire et apparitions au scroll
- `portfolio-link/script/finale3d.js` : astronaute 3D de la section contact
- `portfolio-link/style/style.css` : styles et variables
- `netlify.toml` : publie uniquement le dossier `portfolio-link/`

## Traductions

Chaque texte visible porte un attribut `data-i18n="cle"` dans le HTML (version française) et la même clé dans `script/i18n.js` (version anglaise). Pour un attribut comme `alt`, on utilise `data-i18n-attr="alt:cle"`.

## Crédits

- Polices : Abril Fatface, Fjalla One, JetBrains Mono (Google Fonts, SIL Open Font License)
- three.js : licence MIT

## English

Personal portfolio in French and English, built with vanilla HTML, CSS and JavaScript, with no framework and no build step. Live at https://abrahamnangue-otom.com/. Features a scroll-driven SVG path, light and dark themes, a 3D astronaut loaded on demand, and one URL per language. Run it locally with the command above.

---

© 2026 Abraham Nangue-Otom. Code et contenu : tous droits réservés.
