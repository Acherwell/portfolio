/* Astronaute du contact en 3D (three.js).
   Courte arrivée (2,4 s) puis flottement continu, dans la boîte réservée de la
   section contact. Rien n'est bloqué : la page défile et le contact reste
   lisible et cliquable pendant toute l'animation.
   three.js n'est chargé qu'à l'approche du contact, pas au chargement du site.
   Le personnage est modélisé à partir de formes primitives. */
(function () {
  var URL_THREE = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  var DUREE = 2400;
  var chargement = null;

  function chargerThree() {
    if (window.THREE) return Promise.resolve(window.THREE);
    if (!chargement) {
      chargement = new Promise(function (ok, echec) {
        var s = document.createElement('script');
        s.src = URL_THREE;
        s.async = true;
        s.onload = function () { if (window.THREE) ok(window.THREE); else echec(); };
        s.onerror = echec;
        document.head.appendChild(s);
      });
    }
    return chargement;
  }

  function webgl() {
    try {
      var c = document.createElement('canvas');
      return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
    } catch (e) { return false; }
  }

  function freine(t) { return 1 - Math.pow(1 - t, 3); }
  function douxEntreeSortie(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  /* dépasse la cible puis revient : c'est ce qui donne de l'inertie, donc du poids */
  function depasse(t) { var c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  function part(t, a, b) { return t <= a ? 0 : t >= b ? 1 : (t - a) / (b - a); }
  function melange(a, b, k) { return a + (b - a) * k; }
  /* 0 -> 1 -> 0, pour les gestes qui reviennent à la pose de repos */
  function cloche(t) { return Math.sin(t * Math.PI); }

  function construire(T) {
    function couleur(nom, repli) {
      var v = getComputedStyle(document.documentElement).getPropertyValue(nom).trim();
      return new T.Color(v || repli);
    }
    function mat(c, rug, met) {
      return new T.MeshStandardMaterial({ color: c, roughness: rug === undefined ? 0.55 : rug, metalness: met || 0.1 });
    }
    var jaune = couleur('--y', '#F5B700');
    var rouge = couleur('--r', '#D42A24');
    var bleu = couleur('--b', '#1F5FE0');
    var vert = couleur('--g', '#1E9E52');
    /* La combinaison reste claire quel que soit le thème */
    var clair = new T.Color('#EEF0F6');
    var acier = new T.Color('#2B2F3A');

    var astro = new T.Group();
    var blancCombi = mat(clair, 0.62);
    var accentVert = mat(vert, 0.45);

    var torse = new T.Mesh(new T.SphereGeometry(0.46, 28, 22), blancCombi);
    torse.scale.set(0.92, 1.05, 0.85);
    torse.position.y = 0.05;
    astro.add(torse);

    var plastron = new T.Mesh(new T.SphereGeometry(0.34, 24, 18), mat(jaune, 0.5));
    plastron.scale.set(0.9, 0.78, 0.55);
    plastron.position.set(0, 0.02, 0.28);
    astro.add(plastron);

    var sac = new T.Mesh(new T.BoxGeometry(0.62, 0.72, 0.3), mat(clair, 0.6));
    sac.position.set(0, 0.06, -0.42);
    astro.add(sac);
    var bouteille = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.5, 16), accentVert);
    bouteille.position.set(0, 0.08, -0.6);
    astro.add(bouteille);

    var col = new T.Mesh(new T.CylinderGeometry(0.28, 0.3, 0.12, 24), accentVert);
    col.position.y = 0.48;
    astro.add(col);

    /* La tête est un groupe à part : elle regarde avant que le corps ne suive */
    var tete = new T.Group();
    tete.position.y = 0.78;
    astro.add(tete);
    tete.add(new T.Mesh(new T.SphereGeometry(0.42, 32, 26), mat(clair, 0.3, 0.05)));
    var visiere = new T.Mesh(
      new T.SphereGeometry(0.37, 32, 24, -Math.PI / 2.1, Math.PI / 1.05, Math.PI / 4, Math.PI / 1.9),
      new T.MeshStandardMaterial({ color: bleu, roughness: 0.12, metalness: 0.65 })
    );
    visiere.position.z = 0.06;
    tete.add(visiere);
    var antenne = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 0.3, 10), mat(acier, 0.6));
    antenne.position.set(0.3, 0.28, -0.05);
    antenne.rotation.z = -0.5;
    tete.add(antenne);
    var perle = new T.Mesh(new T.SphereGeometry(0.075, 16, 12), mat(rouge, 0.3));
    perle.position.set(0.38, 0.4, -0.05);
    tete.add(perle);

    function bras(cote) {
      var epaule = new T.Group();
      epaule.position.set(0.44 * cote, 0.22, 0);
      var haut = new T.Mesh(new T.CylinderGeometry(0.13, 0.12, 0.46, 16), blancCombi);
      haut.position.y = -0.23;
      epaule.add(haut);
      var coude = new T.Group();
      coude.position.y = -0.46;
      epaule.add(coude);
      var avant = new T.Mesh(new T.CylinderGeometry(0.12, 0.11, 0.42, 16), blancCombi);
      avant.position.y = -0.21;
      coude.add(avant);
      var gant = new T.Mesh(new T.SphereGeometry(0.15, 18, 14), accentVert);
      gant.position.y = -0.46;
      coude.add(gant);
      epaule.userData.coude = coude;
      astro.add(epaule);
      return epaule;
    }
    function jambe(cote) {
      var hanche = new T.Group();
      hanche.position.set(0.19 * cote, -0.42, 0);
      var cuisse = new T.Mesh(new T.CylinderGeometry(0.15, 0.14, 0.46, 16), blancCombi);
      cuisse.position.y = -0.23;
      hanche.add(cuisse);
      var genou = new T.Group();
      genou.position.y = -0.46;
      hanche.add(genou);
      var mollet = new T.Mesh(new T.CylinderGeometry(0.14, 0.13, 0.4, 16), blancCombi);
      mollet.position.y = -0.2;
      genou.add(mollet);
      var botte = new T.Mesh(new T.SphereGeometry(0.17, 18, 14), accentVert);
      botte.scale.set(1, 0.8, 1.25);
      botte.position.set(0, -0.42, 0.05);
      genou.add(botte);
      hanche.userData.genou = genou;
      astro.add(hanche);
      return hanche;
    }

    return {
      astro: astro, tete: tete,
      brasD: bras(1), brasG: bras(-1),
      jambeD: jambe(1), jambeG: jambe(-1),
      bleu: bleu
    };
  }

  window.finale3d = {
    disponible: function () { return webgl(); },
    precharger: function () { if (webgl()) chargerThree().catch(function () {}); },

    /* Renvoie une promesse, rejetée si la 3D ne peut pas jouer (repli 2D) */
    poser: function (ancre, toujoursVoulu) {
      return chargerThree().then(function (T) {
        /* chargement trop lent : le repli 2D a déjà pris la place, on ne double pas l'arrivée */
        if (toujoursVoulu && !toujoursVoulu()) return;
        var toile = document.createElement('canvas');
        ancre.appendChild(toile);

        var rendu = new T.WebGLRenderer({ canvas: toile, antialias: true, alpha: true });
        rendu.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (T.sRGBEncoding) rendu.outputEncoding = T.sRGBEncoding;

        var p = construire(T);
        var scene = new T.Scene();
        scene.add(p.astro);
        scene.add(new T.HemisphereLight(0xffffff, 0x404060, 0.75));
        var soleil = new T.DirectionalLight(0xffffff, 0.95);
        soleil.position.set(4, 6, 8);
        scene.add(soleil);
        var appoint = new T.DirectionalLight(p.bleu.getHex(), 0.45);
        appoint.position.set(-6, -2, 4);
        scene.add(appoint);

        /* La toile fait deux fois la boîte : caméra deux fois plus loin, même taille de personnage */
        var cam = new T.PerspectiveCamera(45, 0.75, 0.1, 100);
        cam.position.set(0, 0.1, 9.2);
        cam.lookAt(0, 0.05, 0);
        function cadrer() {
          var l = toile.clientWidth, h = toile.clientHeight;
          if (!l || !h) return;
          rendu.setSize(l, h, false);
          cam.aspect = l / h;
          cam.updateProjectionMatrix();
        }
        cadrer();
        window.addEventListener('resize', cadrer);

        /* Angles des bras : positif = le bras droit s'écarte du corps, négatif = le gauche.
           Pose de repos : flottement lent, chaque membre avec son propre décalage
           de phase, pour que rien ne bouge exactement en même temps. */
        function repos(temps) {
          var a = p.astro;
          a.position.set(0, -0.1 + Math.sin(temps / 900) * 0.09, 0);
          a.rotation.set(0, -0.35, Math.sin(temps / 1400) * 0.05);
          a.scale.setScalar(1);
          p.tete.rotation.set(0, 0, Math.sin(temps / 1700 + 1) * 0.04);
          p.brasD.rotation.set(0, 0, 0.45 + Math.sin(temps / 1100 + 0.5) * 0.06);
          p.brasG.rotation.set(0, 0, -0.45 + Math.sin(temps / 1200 + 2) * 0.06);
          p.brasD.userData.coude.rotation.z = 0.3;
          p.brasG.userData.coude.rotation.z = -0.3;
          p.jambeD.rotation.z = 0.12 + Math.sin(temps / 1300 + 1.5) * 0.05;
          p.jambeG.rotation.z = -0.12 + Math.sin(temps / 1250 + 3) * 0.05;
          p.jambeD.userData.genou.rotation.z = -0.15;
          p.jambeG.userData.genou.rotation.z = 0.1;
        }

        /* Arrivée : décalages ajoutés à la pose de repos, qui tombent tous à
           zéro à la fin. Pas de saut au moment de passer au flottement. */
        function arrivee(t) {
          var a = p.astro;
          /* trajet : il dérive depuis le bas à droite et dépasse un peu sa place */
          var k = depasse(part(t, 0, 0.5));
          a.position.x += melange(2.6, 0, k);
          a.position.y += melange(-2.0, 0, k);
          /* le corps penche dans le sens du mouvement, puis se redresse en
             passant légèrement de l'autre côté (le contrecoup du freinage) */
          var arret = part(t, 0.3, 0.7);
          a.rotation.z += melange(0.55, 0, freine(part(t, 0, 0.45))) - cloche(arret) * 0.16;
          /* la tête est en avance sur le corps : elle regarde déjà le visiteur */
          a.rotation.y += melange(-0.7, 0, freine(part(t, 0.05, 0.55)));
          p.tete.rotation.y += melange(0.35, 0, freine(part(t, 0, 0.35)));
          /* les membres traînent derrière, puis rattrapent avec du retard */
          var traine = 1 - freine(part(t, 0.15, 0.7));
          p.brasD.rotation.z += traine * 0.7;
          p.brasG.rotation.z += traine * 0.5;
          p.jambeD.rotation.z += traine * 0.5;
          p.jambeG.rotation.z += traine * 0.35;
          p.jambeD.userData.genou.rotation.z -= traine * 0.6;
          p.jambeG.userData.genou.rotation.z -= traine * 0.4;

          /* le salut : petite descente du bras (anticipation), montée, deux
             battements de l'avant-bras, puis retour au repos */
          var prepa = cloche(part(t, 0.5, 0.6));
          var leve = douxEntreeSortie(part(t, 0.56, 0.68)) * (1 - douxEntreeSortie(part(t, 0.88, 1)));
          p.brasD.rotation.z += -prepa * 0.25 + leve * 2.0;
          p.brasD.userData.coude.rotation.z += leve * (0.35 + Math.sin(part(t, 0.66, 0.88) * Math.PI * 4) * 0.45);
          a.rotation.z += leve * 0.05;
        }

        var visible = true;
        if (window.IntersectionObserver) {
          new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(ancre);
        }
        var depart = null;
        (function image(maintenant) {
          if (depart === null) depart = maintenant;
          var t = Math.min((maintenant - depart) / DUREE, 1);
          if (visible || t < 1) {
            repos(maintenant);
            if (t < 1) arrivee(t);
            rendu.render(scene, cam);
          }
          requestAnimationFrame(image);
        })(performance.now());

        ancre.classList.add('pose3d');
      });
    }
  };
})();
