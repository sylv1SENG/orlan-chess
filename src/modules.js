/* ================= Module « Les bases » ================= */
const BASICS = [
  { group: 'Réflexes anti-gaffe', why: 'Ta première source de points perdus : une pièce laissée en prise ou une pièce gratuite pas prise.', items: [
    { id: 'gratuite', kind: 'puzzle', title: 'La pièce gratuite', fen: 'rnbqkb1r/pppp1ppp/8/4p3/4n3/2N5/PPPP1PPP/R1BQKBNR w KQkq - 0 4',
      goal: 'Un cavalier noir traîne au centre. Trouve le coup qui gagne du matériel.',
      tips: ['Avant chaque coup, fais le tour des pièces adverses : laquelle n’est défendue par personne ?'],
      explain: 'Cxe4 : le cavalier noir en e4 n’était défendu par aucune pièce. Une pièce gratuite, ça se prend.' },
    { id: 'sauve', kind: 'puzzle', title: 'Sauve ta pièce', fen: 'rnbqkbnr/pppppp1p/8/8/4P1p1/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
      goal: 'Le pion g4 attaque ton cavalier f3. Mets-le à l’abri sur une bonne case.',
      tips: ['Après le coup adverse, demande-toi toujours : qu’est-ce qu’il attaque ?'],
      explain: 'Ce4 ou Cd4 sauvent le cavalier en restant centralisés. Ignorer la menace, c’est perdre 3 points.' },
    { id: 'pare', kind: 'puzzle', title: 'Pare le mat', fen: 'rnb1k1nr/pppp1ppp/8/2b1p3/2B1P2q/8/PPPP1PPP/RNBQK1NR w KQkq - 4 4',
      goal: 'Les Noirs menacent Dxf2 mat. Trouve la défense.',
      tips: ['La dame en h4 et le fou en c5 visent tous les deux f2. Qui peut défendre cette case ?'],
      explain: 'De2 (ou Df3) défend f2. C’est le mat le plus fréquent en blitz débutant : surveille toujours f2 et f7.' }
  ] },
  { group: 'Mater sans rater', why: 'Tu as annulé 4 parties gagnées par pat : savoir mater proprement, c’est des points gratuits.', items: [
    { id: 'kq', kind: 'mate', title: 'Mat avec la dame', fen: '8/8/8/4k3/8/8/8/3QK3 w - - 0 1', max: 20,
      goal: 'Mate le roi noir en moins de 20 coups, sans le pater.',
      tips: ['Place ta dame à un saut de cavalier du roi noir : il recule sans jamais être pat.', 'Quand le roi est coincé au bord, arrête la dame et amène ton roi.', 'Avant chaque coup, vérifie que le roi noir a encore une case (sinon : pat, nulle).'] },
    { id: 'kr', kind: 'mate', title: 'Mat avec la tour', fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1', max: 35,
      goal: 'Mate avec roi et tour en moins de 35 coups.',
      tips: ['La tour coupe le roi noir sur une rangée ou une colonne : c’est la « boîte ».', 'Rapproche ton roi en face du roi noir (l’opposition), puis donne échec avec la tour.', 'Si ton roi n’est pas en face, fais un coup d’attente avec la tour, loin du roi noir.'] },
    { id: 'krr', kind: 'mate', title: 'Le mat de l’escalier', fen: '8/8/8/3k4/8/8/8/R3K2R w - - 0 1', max: 12,
      goal: 'Deux tours : mate en moins de 12 coups, sans ton roi.',
      tips: ['Une tour coupe une rangée, l’autre donne échec sur la rangée suivante : le roi recule d’une marche à chaque fois.', 'Si le roi noir s’approche d’une tour, éloigne-la à l’autre bout de la rangée.'] }
  ] },
  { group: 'Tactiques de base', why: 'Les motifs qui gagnent du matériel à ton niveau.', items: [
    { id: 'fourchette', kind: 'puzzle', title: 'La fourchette', fen: '3q3k/6pp/8/4N3/8/8/5PPP/6K1 w - - 0 1', goal: 'Gagne la dame noire.', tips: ['Un cavalier peut attaquer deux pièces à la fois. Cherche un échec.'], explain: 'Cf7+ attaque le roi et la dame en même temps : après la fuite du roi, Cxd8.' },
    { id: 'couloir', kind: 'puzzle', title: 'Le mat du couloir', fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1', goal: 'Mate en un coup.', tips: ['Le roi noir est enfermé derrière ses propres pions.'], explain: 'Td8# : les pions f7, g7, h7 empêchent le roi de fuir. Pense à faire « respirer » ton propre roi (h3 ou g3).' },
    { id: 'clouage', kind: 'puzzle', title: 'Le clouage', fen: '4k3/1p6/2n5/1B6/3P4/8/8/4K3 w - - 0 1', goal: 'Le cavalier noir ne peut pas bouger. Profites-en.', tips: ['Une pièce clouée devant son roi est une cible : attaque-la avec plus petit qu’elle.'], explain: 'd5 attaque le cavalier cloué, qui ne peut pas fuir : il est perdu contre un pion.' },
    { id: 'enfilade', kind: 'puzzle', title: 'L’enfilade', fen: '4q3/8/8/4k3/8/8/8/R5K1 w - - 0 1', goal: 'Gagne la dame noire.', tips: ['Le roi et la dame sont sur la même colonne.'], explain: 'Te1+ : le roi doit quitter la colonne e, et la tour prend la dame derrière lui.' },
    { id: 'decouverte', kind: 'puzzle', title: 'L’échec à la découverte', fen: '4k3/8/8/2q5/4N3/8/8/4R1K1 w - - 0 1', goal: 'Gagne la dame avec échec.', tips: ['Ton cavalier cache la tour. En bougeant, il dévoile un échec.'], explain: 'Cxc5+ : le cavalier prend la dame et dévoile l’échec de la tour e1.' },
    { id: 'berger', kind: 'puzzle', title: 'Le coup du berger', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', goal: 'Mate en un coup.', tips: ['f7 n’est défendu que par le roi.'], explain: 'Dxf7# : la dame, soutenue par le fou c4, mate sur f7. Avec les Noirs, défends f7 avec De7 ou Df6.' }
  ] },
  { group: 'Finales de pions', why: 'Pour transformer un pion de plus en victoire.', items: [
    { id: 'carre', kind: 'promote', title: 'La règle du carré', fen: '8/8/8/8/k7/8/6P1/6K1 w - - 0 1', max: 8, goal: 'Va à dame avant que le roi noir ne rattrape le pion.', tips: ['Dessine le carré du pion jusqu’à la 8e rangée : si le roi noir ne peut pas y entrer, le pion passe tout seul. Pousse !'] },
    { id: 'opposition', kind: 'promote', title: 'Roi devant le pion', fen: '4k3/8/4K3/4P3/8/8/8/8 w - - 0 1', max: 12, goal: 'Fais promouvoir ton pion.', tips: ['Ton roi sur la 6e rangée devant le pion gagne toujours.', 'Contourne le roi noir avec ton roi (Rd6 ou Rf6) avant de pousser.', 'Ne pousse le pion en e7 que si ton roi contrôle e8.'] }
  ] }
];
const allBasics = () => BASICS.flatMap(g => g.items);
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
const doneSet = () => new Set(lsGet('orlan-bases-done', []));
function markDone(id) { const d = doneSet(); d.add(id); lsSet('orlan-bases-done', [...d]); }
const material = (g, color) => g.board().flat().filter(p => p && p.color === color).reduce((a, p) => a + VALS[p.type] + (p.type === 'k' ? 0 : 0), 0);
function kingRoom(g) {
  // legal moves of the side to move's king (the defender after our move)
  return g.moves({ verbose: true }).filter(m => m.piece === 'k').length;
}

function renderBases() {
  const done = doneSet(), cur = S.bases.item;
  const total = allBasics().length, nDone = allBasics().filter(i => done.has(i.id)).length;
  $('bases-list').innerHTML = `<div class="grp"><span>Progression : ${nDone} / ${total}</span></div>` + BASICS.map(g => `<div class="grp"><span>${g.group}</span><div class="chips">${g.items.map(i =>
    `<button class="ochip" data-bid="${i.id}" aria-pressed="${cur && cur.id === i.id}">${done.has(i.id) ? '✓ ' : ''}${i.title}</button>`).join('')}</div></div>`).join('');
  document.querySelectorAll('[data-bid]').forEach(b => b.onclick = () => startBasic(b.dataset.bid));
  renderBasesCard();
}
function renderBasesCard(msg) {
  const it = S.bases.item;
  if (!it) {
    $('bases-card').innerHTML = `<div><h3>Les bases</h3><div class="style">Objectif 1200 Elo</div></div>
      <p class="sum">Quatre séries courtes, dans l’ordre où elles te rapporteront le plus de points. Commence par les réflexes anti-gaffe : c’est là que se jouent la plupart de tes parties.</p>
      ${BASICS.map(g => `<p class="tip"><b>${g.group}.</b> ${g.why}</p>`).join('')}
      <button class="btn primary" id="b-start">Commencer</button>`;
    $('b-start').onclick = () => { const d = doneSet(); const next = allBasics().find(i => !d.has(i.id)) || allBasics()[0]; startBasic(next.id); };
    return;
  }
  const grp = BASICS.find(g => g.items.includes(it));
  const count = it.kind === 'puzzle' ? '' : `<span class="n">coup ${S.bases.moves} / ${it.max}</span>`;
  $('bases-card').innerHTML = `
    <div><h3>${it.title}</h3><div class="style">${grp.group}</div></div>
    <div class="step" aria-live="polite"><div class="who"><b>Objectif</b>${count}</div><p class="say">${it.goal}</p>${msg ? `<div class="bmsg">${msg}</div>` : ''}</div>
    <div class="stepctl">
      <button class="btn" id="b-hint">Indice</button>
      <button class="btn" id="b-retry">Recommencer</button>
      <button class="btn primary grow" id="b-next">Exercice suivant</button>
    </div>
    <div><div class="style" style="margin-bottom:8px">La technique</div><ul class="plans">${it.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>`;
  $('b-hint').onclick = basesHint;
  $('b-retry').onclick = () => startBasic(it.id);
  $('b-next').onclick = () => { const l = allBasics(), i = l.indexOf(it); startBasic(l[(i + 1) % l.length].id); };
}
function startBasic(id) {
  const it = allBasics().find(i => i.id === id); if (!it) return;
  S.token++;
  Object.assign(S.bases, { item: it, game: new Chess(it.fen), color: new Chess(it.fen).turn(), active: true, busy: false, moves: 0, done: false,
    startMat: material(new Chess(it.fen), new Chess(it.fen).turn()) });
  S.arrows = []; S.focus = []; S.bb = null; S.sel = null; S.targets = [];
  renderBases(); render();
}
async function basesHint() {
  const b = S.bases; if (!b.active || b.busy) return;
  b.busy = true;
  const r = await E('best', b.game.fen(), 5, 1200, 0);
  b.busy = false;
  if (!r) return;
  const d = describeMove(b.game.fen(), r.move);
  S.arrows = [{ from: r.move.from, to: r.move.to, color: ARROW.move }];
  const mateTxt = isMate(r.score) && r.score > 0 ? ` Mat en ${mateIn(r.score)} coup${mateIn(r.score) > 1 ? 's' : ''} possible.` : '';
  renderBasesCard(`<p class="tip"><b>Indice :</b> ${d ? fr(d.san) : ''} (flèche dorée).${mateTxt}</p>`);
  render();
}
function finishBasic(ok, html) {
  const b = S.bases; b.active = false; b.done = true;
  if (ok) markDone(b.item.id);
  renderBases();
  renderBasesCard(`<p class="tip" style="border-color:${ok ? 'var(--c-best)' : 'var(--c-blund)'}"><b style="color:${ok ? 'var(--c-best)' : 'var(--c-blund)'}">${ok ? 'Réussi.' : 'Raté.'}</b> ${html}</p>`);
  setBubble({ sq: b.game.history({ verbose: true }).slice(-1)[0]?.to || 'e4', ok, label: ok ? 'Réussi' : 'À retravailler', main: ok ? 'Bien joué.' : 'Pas cette fois.', why: html.replace(/<[^>]+>/g, '') });
  render();
}
async function basesMove(from, to, promotion, dragged) {
  const b = S.bases, it = b.item, tok = S.token;
  const before = b.game.fen();
  const mv = b.game.move({ from, to, promotion: promotion || 'q' });
  if (!mv) return;
  soundFor(mv); if (!dragged) S.anim = mv;
  S.sel = null; S.targets = []; S.arrows = []; S.bb = null; b.busy = true; b.moves++;
  render();
  if (it.kind === 'puzzle') {
    const best = await E('best', before, 5, 1500, 0);
    const us = best && best.move.from === mv.from && best.move.to === mv.to ? best.score : await E('scoreMove', before, { from, to, promotion: mv.promotion }, best ? best.depth : 4, 1500);
    if (tok !== S.token) return;
    b.busy = false;
    const ok = best && (isMate(best.score) && best.score > 0 ? isMate(us) && us > 0 : us >= best.score - 80);
    if (ok) finishBasic(true, it.explain);
    else {
      const d = best && describeMove(before, best.move);
      S.arrows = d ? [{ from: best.move.from, to: best.move.to, color: ARROW.plan }] : [];
      finishBasic(false, `Tu as joué ${fr(mv.san)}. ${it.explain}`);
    }
    return;
  }
  const g = b.game;
  const check = () => {
    if (g.in_checkmate()) { finishBasic(g.turn() !== b.color, g.turn() !== b.color ? `Mat en ${b.moves} coups. ${b.moves <= it.max ? 'Dans les temps.' : ''}` : 'Tu t’es fait mater.'); return true; }
    if (g.in_stalemate()) { finishBasic(false, 'Pat : le roi noir n’a plus aucune case et n’est pas en échec. C’est nulle. Laisse-lui toujours une case tant que tu ne donnes pas échec.'); return true; }
    if (material(g, b.color) < b.startMat && it.kind === 'mate') { finishBasic(false, 'Ta pièce a été prise : sans elle, plus de mat possible. Ne la place jamais à côté du roi noir sans la protéger avec ton roi.'); return true; }
    if (g.in_draw()) { finishBasic(false, 'Partie nulle.'); return true; }
    if (it.kind === 'promote') {
      const promoted = g.board().flat().some(p => p && p.color === b.color && p.type === 'q');
      const pawns = g.board().flat().some(p => p && p.color === b.color && p.type === 'p');
      if (promoted && g.turn() !== b.color) {
        const qsq = g.history({ verbose: true }).slice(-1)[0].to;
        const canTake = g.moves({ verbose: true }).some(m => m.to === qsq && m.captured === 'q');
        const defended = (() => { const k = findKing(g, b.color); if (!k) return false; return Math.max(Math.abs(k.charCodeAt(0) - qsq.charCodeAt(0)), Math.abs(k[1] - qsq[1])) <= 1; })();
        if (!canTake || defended) { finishBasic(true, `Nouvelle dame en ${b.moves} coups. ${it.id === 'carre' ? 'Le roi noir ne pouvait pas entrer dans le carré.' : 'Le roi devant le pion fait tout le travail.'}`); return true; }
      }
      if (!pawns && !promoted) { finishBasic(false, 'Le pion est tombé. Garde ton roi à côté de lui, devant plutôt que derrière.'); return true; }
    }
    if (b.moves > it.max && g.turn() === b.color) { finishBasic(false, `Plus de ${it.max} coups : trop lent. Relis la technique et recommence.`); return true; }
    return false;
  };
  if (check()) { b.busy = false; return; }
  // coach note after our move
  const room = kingRoom(g);
  let note = '';
  if (it.kind === 'mate' && !g.in_check()) note = room <= 1 ? `<b>Attention :</b> le roi noir n’a plus que ${room} case. Donne échec ou laisse-lui de l’air, sinon c’est pat.` : `Le roi noir a ${room} cases libres. Continue de réduire la boîte.`;
  renderBasesCard(note ? `<p class="tip">${note}</p>` : '');
  await sleep(350);
  const r = await E('best', g.fen(), 4, 600, 0);
  if (tok !== S.token || !r) return;
  const rep = g.move(r.move);
  if (rep) { S.anim = rep; soundFor(rep); }
  b.busy = false;
  if (!check()) { render(); }
}

/* ================= Module « Mes parties chess.com » ================= */
const fenKey = f => f.split(' ').slice(0, 4).join(' ');
const wpDrop = (a, b) => winPct(a) - winPct(b);
const GM = { report: null, running: false };

function renderGames(msg) {
  const r = GM.report;
  const user = lsGet('orlan-chesscom-user', 'humSyl');
  let h = `<div><h3>Mes parties chess.com</h3><div class="style">Ton répertoire, tes erreurs, ton entraînement</div></div>
    <form class="gform" id="g-form"><label for="g-user">Pseudo chess.com</label>
      <div class="grow-row"><input id="g-user" value="${user.replace(/"/g, '')}" autocomplete="off" spellcheck="false">
      <select id="g-months" aria-label="Période"><option value="1">1 mois</option><option value="3" selected>3 mois</option><option value="6">6 mois</option></select>
      <button class="btn primary" id="g-go" ${GM.running ? 'disabled' : ''}>Analyser</button></div></form>`;
  if (msg) h += `<div class="bmsg">${msg}</div>`;
  if (S.gm.active || S.gm.status) h += `<div class="step"><div class="who"><b>${S.gm.title || 'Entraînement'}</b><span class="n">${S.gm.progress || ''}</span></div><p class="say">${S.gm.status || ''}</p>${S.gm.detail ? `<div class="bmsg">${S.gm.detail}</div>` : ''}
    ${S.gm.kind === 'drill' && S.gm.cur ? (S.gm.active ? `<div class="stepctl"><button class="btn" id="g-hint">Indice</button><button class="btn grow" id="g-skip">Passer</button></div>` : `<div class="stepctl"><button class="btn primary grow" id="g-nextpos">Position suivante</button></div>`) : ''}
    ${S.gm.kind === 'spar' ? `<div class="stepctl"><button class="btn grow" id="g-restart">Nouvelle ligne</button></div>` : ''}</div>`;
  if (r) {
    const pct = (w, n) => n ? Math.round(100 * w / n) + ' %' : '–';
    h += `<div class="stats g3">
        <div><b>${r.rating ?? '–'}</b><small>Elo ${r.tc}</small></div>
        <div><b>${r.n}</b><small>Parties</small></div>
        <div><b>${r.errPerGame}</b><small>Gaffes / partie</small></div></div>
      <p class="tip"><b>Blancs :</b> ${r.res.w.w}V ${r.res.w.d}N ${r.res.w.l}D (${pct(r.res.w.w, r.res.w.w + r.res.w.d + r.res.w.l)}) · <b>Noirs :</b> ${r.res.b.w}V ${r.res.b.d}N ${r.res.b.l}D (${pct(r.res.b.w, r.res.b.w + r.res.b.d + r.res.b.l)})</p>
      <p class="tip"><b>Comment tu perds :</b> ${r.lossHow}. <b>Pats alors que tu gagnais :</b> ${r.stalemateAhead}.</p>
      <p class="tip"><b>Première gaffe :</b> vers le coup ${r.firstErr} en moyenne. ${r.errSplit}</p>
      <div class="stepctl"><button class="btn primary grow" id="g-drill">Refaire mes erreurs (${r.errors.length})</button></div>
      <div class="stepctl"><button class="btn grow" id="g-spar-w">Rejouer mes ouvertures · Blancs</button><button class="btn grow" id="g-spar-b">· Noirs</button></div>
      ${r.flags.length ? `<div><div class="style" style="margin-bottom:8px">Tes ouvertures à corriger</div><ul class="plans">${r.flags.slice(0, 6).map(f => `<li>Après ${f.line} (vu ${f.count} fois) : tu joues ${fr(f.played)}, mieux vaut ${fr(f.best)}.</li>`).join('')}</ul></div>` : ''}`;
  }
  $('games-card').innerHTML = h;
  $('g-form').onsubmit = ev => { ev.preventDefault(); analyseGames($('g-user').value.trim(), +$('g-months').value); };
  if (r) { $('g-drill').onclick = () => startDrill(); $('g-spar-w').onclick = () => startSpar('w'); $('g-spar-b').onclick = () => startSpar('b'); }
  if ($('g-hint')) $('g-hint').onclick = () => { const e = S.gm.cur; if (e) { S.arrows = [{ from: e.bestFrom, to: e.bestTo, color: ARROW.move }]; drawArrows(); } };
  if ($('g-skip')) $('g-skip').onclick = () => nextDrill(true);
  if ($('g-nextpos')) $('g-nextpos').onclick = () => nextDrill();
  if ($('g-restart')) $('g-restart').onclick = () => startSpar(S.gm.color);
}

async function analyseGames(user, months) {
  if (!user || GM.running) return;
  GM.running = true; lsSet('orlan-chesscom-user', user);
  const U = user.toLowerCase();
  const J = u => fetch(u).then(r => r.ok ? r.json() : Promise.reject(r.status));
  try {
    renderGames('Récupération de tes parties…');
    let stats = null; try { stats = await J(`https://api.chess.com/pub/player/${encodeURIComponent(U)}/stats`); } catch (e) {}
    const ar = await J(`https://api.chess.com/pub/player/${encodeURIComponent(U)}/games/archives`);
    let games = [];
    for (const a of ar.archives.slice(-months)) games = games.concat(((await J(a)).games || []));
    games = games.filter(g => g.rules === 'chess' && g.pgn);
    if (!games.length) throw new Error('empty');
    const tcCount = {}; games.forEach(g => tcCount[g.time_class] = (tcCount[g.time_class] || 0) + 1);
    const tc = Object.entries(tcCount).sort((a, b) => b[1] - a[1])[0][0];
    const colorOf = g => g.white.username.toLowerCase() === U ? 'w' : 'b';
    const res = { w: { w: 0, d: 0, l: 0 }, b: { w: 0, d: 0, l: 0 } }, lost = {}; let stalemateAhead = 0;
    const tree = { w: new Map(), b: new Map() };
    const parsed = [];
    renderGames(`Lecture de ${games.length} parties…`);
    for (let i = 0; i < games.length; i++) {
      const g = games[i], c = colorOf(g), me = g[c === 'w' ? 'white' : 'black'];
      const k = me.result === 'win' ? 'w' : ['checkmated', 'resigned', 'timeout', 'abandoned', 'lose'].includes(me.result) ? 'l' : 'd';
      res[c][k]++;
      if (k === 'l') lost[me.result] = (lost[me.result] || 0) + 1;
      const cg = new Chess(); if (!cg.load_pgn(g.pgn)) continue;
      const hist = cg.history({ verbose: true });
      if (me.result === 'stalemate') { const d = material(cg, c) - material(cg, c === 'w' ? 'b' : 'w'); if (d >= 3) stalemateAhead++; }
      parsed.push({ g, c, hist });
      const r = new Chess(); const line = [];
      for (let p = 0; p < Math.min(hist.length, 20); p++) {
        const key = fenKey(r.fen());
        let node = tree[c].get(key); if (!node) { node = { count: 0, moves: {}, line: line.slice(), fen: r.fen() }; tree[c].set(key, node); }
        node.count++; node.moves[hist[p].san] = (node.moves[hist[p].san] || 0) + 1;
        r.move(hist[p].san); line.push(hist[p].san);
      }
      if (i % 40 === 0) { renderGames(`Lecture des parties… ${i} / ${games.length}`); await sleep(0); }
    }
    // Recurring opening mistakes: frequent positions where it is my move
    const flags = [];
    const cand = [];
    for (const c of ['w', 'b']) for (const [key, node] of tree[c]) {
      const turn = key.split(' ')[1];
      if (turn === c && node.count >= 3) cand.push({ c, node });
    }
    cand.sort((a, b) => b.node.count - a.node.count);
    const top = cand.slice(0, 24);
    for (let i = 0; i < top.length; i++) {
      renderGames(`Analyse de tes ouvertures… ${i + 1} / ${top.length}`);
      const { c, node } = top[i];
      const played = Object.entries(node.moves).sort((a, b) => b[1] - a[1])[0][0];
      const best = await E('best', node.fen, 4, 500, 0); if (!best) continue;
      const pm = new Chess(node.fen).move(played); if (!pm) continue;
      const same = pm.from === best.move.from && pm.to === best.move.to;
      const us = same ? best.score : await E('scoreMove', node.fen, { from: pm.from, to: pm.to, promotion: pm.promotion }, best.depth, 500);
      if (!same && wpDrop(best.score, us) > 8) {
        const bd = describeMove(node.fen, best.move);
        flags.push({ key: fenKey(node.fen), fen: node.fen, c, count: node.count, played, best: bd.san, bestFrom: best.move.from, bestTo: best.move.to, drop: wpDrop(best.score, us), line: lineText(node.line) || 'le premier coup', why: explainMove(node.fen, best.move) });
      }
    }
    // Blunders in the most recent games
    const errors = []; let first = [], nErr = 0, hung = 0, missed = 0;
    const recent = parsed.slice(-30);
    for (let gi = 0; gi < recent.length; gi++) {
      const { g, c, hist } = recent[gi];
      renderGames(`Recherche de tes gaffes… partie ${gi + 1} / ${recent.length}`);
      const r = new Chess(); let f = null;
      for (let p = 0; p < Math.min(hist.length, 90); p++) {
        const m = hist[p];
        if (m.color === c) {
          const fen = r.fen();
          const best = await E('best', fen, 3, 150, 0);
          if (best) {
            const same = best.move.from === m.from && best.move.to === m.to;
            const us = same ? best.score : await E('scoreMove', fen, { from: m.from, to: m.to, promotion: m.promotion }, best.depth, 150);
            const drop = wpDrop(best.score, us);
            if (!same && drop > 25 && us < 150) {
              nErr++; if (f === null) f = Math.floor(p / 2) + 1;
              const bd = describeMove(fen, best.move);
              if (bd && bd.r.captured) missed++; else hung++;
              errors.push({ fen, c, played: m.san, best: bd ? bd.san : '', bestFrom: best.move.from, bestTo: best.move.to, drop, moveNo: Math.floor(p / 2) + 1,
                opp: g[c === 'w' ? 'black' : 'white'].username, url: g.url, prev: p > 0 ? { from: hist[p - 1].from, to: hist[p - 1].to } : null, why: explainMove(fen, best.move) });
            }
          }
        }
        r.move(m.san);
      }
      if (f !== null) first.push(f);
    }
    first.sort((a, b) => a - b);
    const lossNames = { checkmated: 'mat', resigned: 'abandon', timeout: 'temps', abandoned: 'déconnexion' };
    const lossHow = Object.entries(lost).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${lossNames[k] || k} ${v}`).join(', ') || '–';
    GM.report = {
      user, tc, n: games.length, res, lossHow, stalemateAhead, flags, tree,
      rating: stats && stats['chess_' + tc] && stats['chess_' + tc].last ? stats['chess_' + tc].last.rating : null,
      errors: errors.sort((a, b) => b.drop - a.drop).slice(0, 40),
      errPerGame: recent.length ? (nErr / recent.length).toFixed(1) : '–',
      firstErr: first.length ? first[Math.floor(first.length / 2)] : '–',
      errSplit: nErr ? `${Math.round(100 * hung / nErr)} % : pièce laissée en prise ou coup qui perd du matériel ; ${Math.round(100 * missed / nErr)} % : prise gratuite pas vue.` : ''
    };
    GM.running = false;
    renderGames();
  } catch (e) {
    GM.running = false;
    const blocked = e instanceof TypeError;
    renderGames(blocked ? 'Impossible de joindre chess.com depuis cette page. Ouvre l’appli sur sylvainsengbandith.fr/echecs/ : là, ça fonctionne.' : e === 404 ? 'Pseudo introuvable sur chess.com. Vérifie l’orthographe (il apparaît dans chess.com/member/…).' : 'Aucune partie trouvée sur cette période.');
  }
}
function lineText(sans) {
  return sans.map((s, i) => (i % 2 === 0 ? (i / 2 + 1) + '.' : '') + fr(s)).join(' ');
}

/* Drill on my own mistakes */
function startDrill() {
  const r = GM.report; if (!r || !r.errors.length) return;
  S.gm.queue = r.errors.slice(); S.gm.kind = 'drill'; S.gm.okCount = 0; S.gm.total = r.errors.length;
  nextDrill();
}
function nextDrill(skip) {
  const q = S.gm.queue;
  if (skip && S.gm.cur) q.push(S.gm.cur);
  const e = q.shift();
  S.token++; S.bb = null; S.arrows = []; S.focus = [];
  if (!e) { S.gm.active = false; S.gm.status = `Terminé : ${S.gm.okCount} position${S.gm.okCount > 1 ? 's' : ''} réussie${S.gm.okCount > 1 ? 's' : ''} sur ${S.gm.total}.`; S.gm.detail = ''; S.gm.cur = null; renderGames(); render(); return; }
  S.gm.cur = e; S.gm.game = new Chess(e.fen); S.gm.color = e.c; S.gm.active = true; S.gm.busy = false;
  S.gm.oppLabel = e.opp; S.gm.title = `Contre ${e.opp}, coup ${e.moveNo}`; S.gm.progress = `${S.gm.total - q.length} / ${S.gm.total}`;
  S.gm.status = `Dans cette partie, tu as joué ${fr(e.played)}. Trouve mieux.`; S.gm.detail = '';
  if (e.prev) S.arrows = [{ from: e.prev.from, to: e.prev.to, color: 'rgba(232,205,143,.5)' }];
  renderGames(); render();
}

/* Sparring against my real opponents' moves */
function startSpar(color) {
  const r = GM.report; if (!r) return;
  S.token++;
  Object.assign(S.gm, { kind: 'spar', color, game: new Chess(), active: true, busy: false, oppLabel: 'Tes adversaires', title: `Tes ouvertures avec les ${color === 'w' ? 'Blancs' : 'Noirs'}`, progress: '', status: 'Ton adversaire joue les coups que tes vrais adversaires t’ont joués, dans les mêmes proportions.', detail: '', cur: null });
  S.bb = null; S.arrows = []; S.focus = [];
  renderGames(); render();
  if (color === 'b') sparOpponent();
}
async function sparOpponent() {
  const g = S.gm.game, tree = GM.report.tree[S.gm.color], tok = S.token;
  const node = tree.get(fenKey(g.fen()));
  const tot = node ? Object.values(node.moves).reduce((a, b) => a + b, 0) : 0;
  if (!node || !tot) {
    S.gm.active = false; S.gm.status = `Fin de ton répertoire connu après ${g.history().length} demi-coups : tes adversaires n’ont jamais joué au-delà dans cette ligne.`; S.gm.detail = '';
    renderGames(); render(); return;
  }
  S.gm.busy = true; await sleep(500); if (tok !== S.token) return;
  let x = Math.random() * tot, san = null;
  for (const [s, n] of Object.entries(node.moves)) { x -= n; if (x <= 0) { san = s; break; } }
  const mv = g.move(san || Object.keys(node.moves)[0]);
  S.anim = mv; soundFor(mv); S.gm.busy = false;
  const mine = tree.get(fenKey(g.fen()));
  const flag = GM.report.flags.find(f => f.key === fenKey(g.fen()));
  S.gm.status = `Ils jouent ${fr(mv.san)} (${Math.round(100 * node.moves[mv.san] / tot)} % de tes parties ici).`;
  S.gm.detail = flag ? `<b>Attention :</b> ici, tu joues souvent ${fr(flag.played)}. Ce n’est pas le meilleur coup. Réfléchis.` : (mine ? '' : 'Position nouvelle pour toi.');
  renderGames(); render();
}
async function gamesMove(from, to, promotion, dragged) {
  const gm = S.gm, g = gm.game, tok = S.token;
  const before = g.fen();
  const mv = g.move({ from, to, promotion: promotion || 'q' });
  if (!mv) return;
  soundFor(mv); if (!dragged) S.anim = mv;
  S.sel = null; S.targets = []; S.arrows = []; S.bb = null; gm.busy = true; render();
  const best = await E('best', before, 5, 1200, 0);
  const same = best && best.move.from === mv.from && best.move.to === mv.to;
  const us = !best ? 0 : same ? best.score : await E('scoreMove', before, { from, to, promotion: mv.promotion }, best.depth, 1200);
  if (tok !== S.token) return;
  const drop = best ? wpDrop(best.score, us) : 0;
  const bd = best && describeMove(before, best.move);
  if (gm.kind === 'drill') {
    const e = gm.cur, ok = drop <= 8 || same;
    gm.busy = false; gm.active = false;
    if (ok) { gm.okCount++; gm.status = `Bien vu : ${fr(mv.san)}. ${same ? '' : `Le moteur préférait ${fr(bd.san)}, mais ton coup tient.`}`; gm.detail = `<b>Pourquoi :</b> ${explainMove(before, mv.san)}`; }
    else { gm.queue.push(e); gm.status = `Pas encore : ${fr(mv.san)} ne suffit pas. Le bon coup était ${fr(bd.san)}.`; gm.detail = `<b>Pourquoi :</b> ${explainMove(before, best.move)} Cette position reviendra plus tard.`; S.arrows = [{ from: best.move.from, to: best.move.to, color: ARROW.plan }]; }
    setBubble({ sq: ok ? mv.to : best.move.to, ok, label: ok ? 'Réussi' : 'À retravailler', main: ok ? `<b>${fr(mv.san)}</b> : c’est mieux que dans ta partie.` : `J’aurais joué <b>${fr(bd.san)}</b>.`, why: ok ? '' : explainMove(before, best.move) });
    renderGames(); render();
    return;
  }
  // sparring
  if (!same && drop > 8 && bd) setBubble({ sq: best.move.to, label: 'Tes ouvertures', main: `À la place de <b>${fr(mv.san)}</b>, j’aurais joué <b>${fr(bd.san)}</b>.`, why: explainMove(before, best.move), arrow: { from: best.move.from, to: best.move.to, color: ARROW.move, dash: true } });
  else setBubble({ sq: mv.to, ok: true, label: 'Tes ouvertures', main: `<b>${fr(mv.san)}</b> : bon coup.`, why: '' });
  gm.busy = false;
  if (g.game_over()) { gm.active = false; renderGames(); render(); return; }
  sparOpponent();
}
