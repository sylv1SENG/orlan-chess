import os
d=os.path.dirname(os.path.abspath(__file__))+'/'
src=open(d+'src/page.html').read()
eng=open(d+'src/engine.js').read(); eng=eng[eng.index('/* ENGINE-START */'):eng.index('/* ENGINE-END */')]
op=open(d+'src/openings.js').read().replace("if (typeof module !== 'undefined') module.exports = OPENINGS;","")
chess=open(d+'vendor/chess.js').read()
app=open(d+'src/app.js').read().replace('/*MODULES*/', open(d+'src/modules.js').read())
src=src.replace('/*CHESSJS*/',chess).replace('/*OPENINGS*/',op).replace('/*ENGINE*/',eng).replace('/*APP*/',app)
head,body=src.split('<!--BODY-->')
fav="data:image/svg+xml,"+"%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='30' fill='%23130F0C' stroke='%23C9A45C' stroke-width='3'/%3E%3Ctext x='32' y='45' font-size='36' text-anchor='middle' fill='%23E8CD8F'%3E%E2%99%9E%3C/text%3E%3C/svg%3E"
site=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Apprends les ouvertures d'échecs coup par coup et joue contre l'ordinateur avec un coach grand maître qui explique chacun de tes coups.">
<meta name="theme-color" content="#130F0C">
<meta property="og:title" content="Orlan, coach d'échecs">
<meta property="og:description" content="Chaque coup, jugé par un grand maître. Ouvertures expliquées, parties commentées.">
<meta property="og:type" content="website">
<link rel="icon" href="{fav}">
{head.strip()}
</head>
<body>
{body.strip()}
</body>
</html>
'''
open(d+'index.html','w').write(site)
