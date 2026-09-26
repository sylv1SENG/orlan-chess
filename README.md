# Orlan, coach d'échecs

Joue aux échecs contre l'ordinateur avec un coach grand maître (fictif) qui juge et explique chacun de tes coups, et apprends 8 ouvertures coup par coup.

- **Jouer une partie** : trois niveaux (Débutant, Club, Expert), note de chaque coup (!!, !, ?!, ?, ??), bulle sur l'échiquier avec le coup que le coach aurait joué et pourquoi, détection des menaces, précision en fin de partie.
- **Apprendre les ouvertures** : Italienne, Espagnole, Gambit dame refusé, Londres, Caro-Kann, Scandinave, Française, Sicilienne Najdorf. Intentions dessinées sur l'échiquier, puis partie guidée contre l'ordinateur.

## Mise en ligne

En ligne sur **https://www.sylvainsengbandith.fr/echecs/** (PlanetHoster, dossier `public_html/echecs/`).

`index.html` est autonome : aucun serveur ni installation. À chaque push sur `main`, le workflow `.github/workflows/deploy.yml` reconstruit la page et l'envoie par FTP dans `public_html/echecs/`, une fois les secrets `FTP_SERVER`, `FTP_USERNAME` et `FTP_PASSWORD` renseignés dans GitHub.

## Développement

Les sources sont dans `src/` :

| Fichier | Rôle |
|---|---|
| `src/page.html` | Structure et styles de la page |
| `src/app.js` | Interface, coach, modes de jeu |
| `src/engine.js` | Moteur d'analyse (recherche alpha-bêta, exécuté dans un Web Worker) |
| `src/openings.js` | Les 8 ouvertures et leurs explications |
| `vendor/chess.js` | Règles du jeu ([chess.js](https://github.com/jhlywa/chess.js) 0.10.3, licence BSD) |

Après une modification, régénère `index.html` :

```bash
python3 build.py
```
