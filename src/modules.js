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
  hidePop(); hideToast();
  renderBases(); render();
  popup({ tone: 'info', kicker: BASICS.find(g => g.items.includes(it)).group, title: it.title, body: it.goal,
    detail: it.tips[0], detailLabel: 'Le truc à savoir',
    buttons: [{ label: 'C’est parti', primary: true }] });
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
  toast(`<b>Indice :</b> ${d ? fr(d.san) : ''} (flèche dorée).${mateTxt}`, 'info', 5000);
  render();
}
function finishBasic(ok, html, moves) {
  const b = S.bases; b.active = false; b.done = true;
  if (ok) markDone(b.item.id);
  hideToast(); renderBases();
  renderBasesCard(`<p class="tip" style="border-color:${ok ? 'var(--c-best)' : 'var(--c-blund)'}"><b style="color:${ok ? 'var(--c-best)' : 'var(--c-blund)'}">${ok ? 'Réussi.' : 'Raté.'}</b> ${html}</p>`);
  render();
  basesPopupResult(ok, html, moves);
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
    const d = best && describeMove(before, best.move);
    if (ok) finishBasic(true, it.explain, [{ label: 'Ton coup', san: mv.san, kind: 'good' }]);
    else {
      S.arrows = d ? [{ from: best.move.from, to: best.move.to, color: ARROW.plan }] : [];
      finishBasic(false, it.explain, [{ label: 'Ton coup', san: mv.san, kind: 'bad' }, ...(d ? [{ label: 'La solution', san: d.san, kind: 'good' }] : [])]);
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
  if (note) toast(note, room <= 1 ? 'warn' : 'info', room <= 1 ? 4500 : 2200);
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
  if (S.gm.kind) {
    const gm = S.gm;
    h += `<div class="step game-step">${hudHtml()}
      <div class="who"><b>${gm.title || 'Entraînement'}</b></div>
      <p class="say">${gm.status || ''}</p>
      ${gm.kind === 'drill' && gm.cur ? (gm.active ? `<div class="stepctl"><button class="btn" id="g-hint">Indice</button><button class="btn grow" id="g-skip">Passer</button></div>`
        : gm.answered ? `<div class="stepctl"><button class="btn primary grow" id="g-nextpos">Position suivante</button></div>` : '') : ''}
      ${gm.kind === 'spar' ? `<div class="stepctl"><button class="btn grow" id="g-restart">Nouvelle ligne</button></div>` : ''}
    </div>`;
  }
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
      <div class="style" style="margin-top:4px">Rejouer mes ouvertures</div><div class="stepctl"><button class="btn grow" id="g-spar-w">Avec les Blancs</button><button class="btn grow" id="g-spar-b">Avec les Noirs</button></div>
      ${r.flags.length ? `<div><div class="style" style="margin-bottom:8px">Tes ouvertures à corriger</div><ul class="plans">${r.flags.slice(0, 6).map(f => `<li>Après ${f.line} (vu ${f.count} fois) : tu joues ${fr(f.played)}, mieux vaut ${fr(f.best)}.</li>`).join('')}</ul></div>` : ''}`;
  }
  $('games-card').innerHTML = h;
  $('g-form').onsubmit = ev => { ev.preventDefault(); analyseGames($('g-user').value.trim(), +$('g-months').value); };
  if (r) { $('g-drill').onclick = () => startDrill(); $('g-spar-w').onclick = () => startSpar('w'); $('g-spar-b').onclick = () => startSpar('b'); }
  if ($('g-hint')) $('g-hint').onclick = drillHint;
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

/* ================= Popups façon jeu éducatif ================= */
const ICONS = {
  win: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M13 25l7 7 15-16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  lose: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M16 16l16 16M32 16L16 32" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>',
  warn: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 12v15" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="35" r="3.2" fill="currentColor"/></svg>',
  info: '<svg viewBox="0 0 48 48" aria-hidden="true"><text x="24" y="31" text-anchor="middle" font-family="Bodoni Moda, Georgia, serif" font-style="italic" font-size="19" fill="currentColor">VO</text></svg>',
  end: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 9l4.4 9 9.9 1.4-7.2 7 1.7 9.8L24 31.6l-8.8 4.6 1.7-9.8-7.2-7 9.9-1.4z" fill="currentColor"/></svg>'
};
const popHost = () => document.querySelector('.board-zone');
function chime(tone) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const notes = tone === 'win' || tone === 'end' ? [523, 659, 784] : tone === 'lose' ? [330, 262] : [440];
    notes.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * .11;
      o.type = tone === 'lose' ? 'triangle' : 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.14, t + .02); g.gain.exponentialRampToValueAtTime(.001, t + .35);
      o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + .4);
    });
  } catch (e) {}
}
function confetti(host) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const cols = ['#E8CD8F', '#86C06F', '#4CC7BA', '#F2E9DA', '#C9A45C', '#F0903F'];
  const box = document.createElement('div'); box.className = 'confetti';
  for (let i = 0; i < 26; i++) {
    const c = document.createElement('i');
    c.style.left = (8 + Math.random() * 84) + '%'; c.style.background = cols[i % cols.length];
    c.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px'); c.style.setProperty('--r', (Math.random() * 720 - 360) + 'deg');
    c.style.animationDelay = (Math.random() * .18) + 's';
    box.appendChild(c);
  }
  host.appendChild(box); setTimeout(() => box.remove(), 1600);
}
function hidePop() { const el = document.getElementById('pop'); if (el) el.remove(); }
function popup(o) {
  hidePop();
  const host = document.body;
  const el = document.createElement('div'); el.id = 'pop'; el.className = 'pop';
  const stars = o.stars != null ? `<div class="pop-stars" aria-label="${o.stars} étoile${o.stars > 1 ? 's' : ''} sur 3">${[1, 2, 3].map(i => `<span class="${i <= o.stars ? 'on' : ''}" style="animation-delay:${.15 + i * .12}s">★</span>`).join('')}</div>` : '';
  el.innerHTML = `<div class="pop-card tone-${o.tone}" role="dialog" aria-modal="true" aria-labelledby="pop-t">
      <div class="pop-head"><div class="pop-badge">${ICONS[o.tone] || ICONS.info}</div>
        <div>${o.kicker ? `<div class="pop-kicker">${o.kicker}</div>` : ''}<h4 id="pop-t">${o.title}</h4></div></div>
      ${stars}
      ${o.body ? `<p class="pop-body">${o.body}</p>` : ''}
      ${o.moves ? `<div class="pop-moves">${o.moves.map(m => `<div class="pm ${m.kind}"><span>${m.label}</span><b>${fr(m.san)}</b></div>`).join('')}</div>` : ''}
      ${o.detail ? `<div class="pop-why"><b>${o.detailLabel || 'Pourquoi ?'}</b><p>${o.detail}</p></div>` : ''}
      ${o.xp ? `<div class="pop-xp"><span>+${o.xp} XP</span>${o.streak > 1 ? `<span>Série ×${o.streak}</span>` : ''}</div>` : ''}
      <div class="pop-actions">${o.buttons.map((b, i) => `<button class="pbtn ${b.primary ? 'primary' : ''}" data-i="${i}">${b.label}</button>`).join('')}</div>
    </div>`;
  host.appendChild(el);
  el.querySelectorAll('[data-i]').forEach(btn => btn.onclick = () => { const b = o.buttons[+btn.dataset.i]; hidePop(); b.action && b.action(); });
  el.addEventListener('keydown', ev => { if (ev.key === 'Escape') { const c = o.buttons.find(b => b.cancel) || o.buttons[0]; hidePop(); c.action && c.action(); } });
  if (o.tone === 'win' || o.tone === 'end') confetti(el);
  chime(o.tone);
  const prim = el.querySelector('.pbtn.primary') || el.querySelector('.pbtn'); if (prim) setTimeout(() => prim.focus({ preventScroll: true }), 50);

}
let toastTimer = null;
function toast(html, tone, ms) {
  const host = popHost(); if (!host) return;
  let el = document.getElementById('toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; host.appendChild(el); }
  el.className = 'toast tone-' + (tone || 'info'); el.innerHTML = html; el.hidden = false;
  el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
  clearTimeout(toastTimer); if (ms !== 0) toastTimer = setTimeout(() => { el.hidden = true; }, ms || 3200);
}
const hideToast = () => { const el = document.getElementById('toast'); if (el) el.hidden = true; };
const XP = { get: () => lsGet('orlan-xp', 0), add: n => { const v = XP.get() + n; lsSet('orlan-xp', v); return v; } };
const levelOf = xp => ({ lvl: Math.floor(xp / 100) + 1, pct: xp % 100 });

/* Bases : résultats en popup */
function basesPopupResult(ok, html, moves) {
  const b = S.bases, it = b.item;
  const l = allBasics(), next = l[(l.indexOf(it) + 1) % l.length];
  if (ok) {
    const xp = 15; XP.add(xp);
    popup({ tone: 'win', kicker: it.title, title: pick(['Bien joué !', 'Réussi !', 'Parfait !']), moves, detail: html, detailLabel: 'À retenir', xp,
      buttons: [{ label: 'Recommencer', action: () => startBasic(it.id) }, { label: 'Exercice suivant', primary: true, action: () => startBasic(next.id) }] });
  } else {
    popup({ tone: 'lose', kicker: it.title, title: pick(['Presque !', 'Pas cette fois', 'On recommence ?']), moves, detail: html, detailLabel: 'Ce qui s’est passé',
      buttons: [{ label: 'Voir la position', cancel: true, action: () => { renderBasesCard(); render(); } }, { label: 'Réessayer', primary: true, action: () => startBasic(it.id) }] });
  }
}

/* ================= Mes parties : entraînement sur mes erreurs ================= */
function hudHtml() {
  const xp = XP.get(), L = levelOf(xp), gm = S.gm;
  const prog = gm.kind === 'drill' && gm.total ? Math.round(100 * gm.doneCount / gm.total) : null;
  return `<div class="hud">
      <div class="hud-lvl"><b>Niv. ${L.lvl}</b><span class="bar"><i style="width:${L.pct}%"></i></span><small>${xp} XP</small></div>
      ${gm.kind === 'drill' ? `<div class="hud-streak ${gm.streak >= 3 ? 'hot' : ''}"><b>×${gm.streak || 0}</b><small>série</small></div>` : ''}
    </div>
    ${prog != null ? `<div class="progress" aria-label="Progression ${gm.doneCount} sur ${gm.total}"><i style="width:${prog}%"></i><span>${gm.doneCount} / ${gm.total}</span></div>` : ''}`;
}
function startDrill(list) {
  const r = GM.report; const src = list || (r && r.errors); if (!src || !src.length) return;
  Object.assign(S.gm, { kind: 'drill', queue: src.slice(), okCount: 0, doneCount: 0, total: src.length, streak: 0, sessionXP: 0, failed: [], seen: new Set() });
  nextDrill();
}
function nextDrill(skip) {
  const gm = S.gm, q = gm.queue;
  hideToast();
  if (skip && gm.cur) q.push(gm.cur);
  const e = q.shift();
  S.token++; S.bb = null; S.arrows = []; S.focus = [];
  if (!e) return endDrill();
  gm.cur = e; gm.game = new Chess(e.fen); gm.color = e.c; gm.active = false; gm.busy = false; gm.answered = false; gm.hints = 0;
  gm.oppLabel = e.opp; gm.title = `Contre ${e.opp} · coup ${e.moveNo}`;
  gm.status = `Dans ta partie, tu as joué <b class="bad">${fr(e.played)}</b>. Trouve mieux.`;
  if (e.prev) S.arrows = [{ from: e.prev.from, to: e.prev.to, color: 'rgba(232,205,143,.55)' }];
  renderGames(); render();
  const again = gm.seen.has(e.fen); gm.seen.add(e.fen);
  popup({ tone: 'info', kicker: `Position ${Math.min(gm.doneCount + 1, gm.total)} sur ${gm.total}${again ? ' · deuxième essai' : ''}`, title: 'Trouve mieux que dans ta partie',
    body: `Contre <b>${e.opp}</b>, au coup ${e.moveNo}, tu as joué <b class="bad">${fr(e.played)}</b>. Ce coup t’a coûté cher. Tu joues les ${e.c === 'w' ? 'Blancs' : 'Noirs'}.`,
    buttons: [{ label: 'À moi de jouer', primary: true, action: () => { gm.active = true; renderGames(); render(); } }] });
}
function endDrill() {
  const gm = S.gm; gm.active = false; gm.cur = null;
  const ratio = gm.total ? gm.okCount / gm.total : 0;
  const stars = ratio >= .8 ? 3 : ratio >= .5 ? 2 : 1;
  renderGames(); render();
  popup({ tone: 'end', kicker: 'Session terminée', title: stars === 3 ? 'Excellent travail !' : stars === 2 ? 'Beau progrès !' : 'Continue comme ça', stars,
    body: `${gm.okCount} position${gm.okCount > 1 ? 's' : ''} trouvée${gm.okCount > 1 ? 's' : ''} du premier coup sur ${gm.total}. Tu as gagné ${gm.sessionXP} XP.`,
    buttons: [
      ...(gm.failed.length ? [{ label: `Refaire les ${gm.failed.length} ratées`, primary: true, action: () => startDrill(gm.failed.slice()) }] : []),
      { label: 'Terminer', cancel: true, primary: !gm.failed.length, action: () => {} }] });
}
function drillHint() {
  const gm = S.gm, e = gm.cur; if (!e || !gm.active) return;
  gm.hints++;
  const d = describeMove(e.fen, e.best);
  if (gm.hints === 1 && d) toast(`<b>Indice :</b> regarde ${ton(d.r.piece)} en ${d.r.from}.${d.r.captured ? ' Il y a quelque chose à prendre.' : ''}`, 'info', 4500);
  else { S.arrows = [{ from: e.bestFrom, to: e.bestTo, color: ARROW.move }]; drawArrows(); toast('<b>Indice :</b> le coup est sur l’échiquier (flèche dorée).', 'info'); }
}

/* ================= Mes parties : rejouer mes ouvertures ================= */
function startSpar(color) {
  const r = GM.report; if (!r) return;
  S.token++; hidePop(); hideToast();
  Object.assign(S.gm, { kind: 'spar', color, game: new Chess(), active: true, busy: false, oppLabel: 'Tes adversaires', title: `Tes ouvertures avec les ${color === 'w' ? 'Blancs' : 'Noirs'}`, status: 'Ton adversaire joue les coups de tes vrais adversaires, dans les mêmes proportions.', cur: null, good: 0, bad: 0 });
  S.bb = null; S.arrows = []; S.focus = [];
  renderGames(); render();
  popup({ tone: 'info', kicker: 'Rejouer mes ouvertures', title: `Avec les ${color === 'w' ? 'Blancs' : 'Noirs'}`,
    body: 'L’ordinateur joue exactement ce que tes adversaires de chess.com t’ont joué, dans les mêmes proportions. Je te préviens quand tu arrives sur une position où tu te trompes souvent.',
    buttons: [{ label: 'C’est parti', primary: true, action: () => { if (color === 'b') sparOpponent(); } }] });
}
async function sparOpponent() {
  const gm = S.gm, g = gm.game, tree = GM.report.tree[gm.color], tok = S.token;
  const node = tree.get(fenKey(g.fen()));
  const tot = node ? Object.values(node.moves).reduce((a, b) => a + b, 0) : 0;
  if (!node || !tot) {
    gm.active = false; renderGames(); render();
    popup({ tone: 'end', kicker: 'Fin de la ligne', title: 'Tu connais cette ligne', stars: gm.bad === 0 ? 3 : gm.bad === 1 ? 2 : 1,
      body: `Tes adversaires ne sont jamais allés plus loin (${g.history().length} demi-coups). Bons coups : ${gm.good}, à revoir : ${gm.bad}.`,
      buttons: [{ label: 'Fermer', cancel: true }, { label: 'Nouvelle ligne', primary: true, action: () => startSpar(gm.color) }] });
    return;
  }
  gm.busy = true; await sleep(550); if (tok !== S.token) return;
  let x = Math.random() * tot, san = null;
  for (const [s, n] of Object.entries(node.moves)) { x -= n; if (x <= 0) { san = s; break; } }
  const mv = g.move(san || Object.keys(node.moves)[0]);
  S.anim = mv; soundFor(mv); gm.busy = false;
  gm.status = `Ils jouent <b>${fr(mv.san)}</b> : ${Math.round(100 * node.moves[mv.san] / tot)} % de tes parties dans cette position.`;
  renderGames(); render();
  const flag = GM.report.flags.find(f => f.key === fenKey(g.fen()));
  if (flag) popup({ tone: 'warn', kicker: `Position vue ${flag.count} fois`, title: 'Attention, piège connu',
    body: `Ici, tu joues souvent <b class="bad">${fr(flag.played)}</b>, et ce n’est pas le meilleur coup. Prends le temps de chercher.`,
    buttons: [{ label: 'Je réfléchis', primary: true }] });
  else toast(`Ils jouent <b>${fr(mv.san)}</b> (${Math.round(100 * node.moves[mv.san] / tot)} % de tes parties).`, 'info', 2600);
}

/* ================= Mes parties : un coup joué ================= */
async function gamesMove(from, to, promotion, dragged) {
  const gm = S.gm, g = gm.game, tok = S.token;
  const before = g.fen();
  const mv = g.move({ from, to, promotion: promotion || 'q' });
  if (!mv) return;
  soundFor(mv); if (!dragged) S.anim = mv;
  S.sel = null; S.targets = []; S.arrows = []; S.bb = null; gm.busy = true; hideToast(); render();
  toast('Orlan regarde ton coup…', 'info', 0);
  const best = await E('best', before, 5, 1200, 0);
  const same = best && best.move.from === mv.from && best.move.to === mv.to;
  const us = !best ? 0 : same ? best.score : await E('scoreMove', before, { from, to, promotion: mv.promotion }, best.depth, 1200);
  if (tok !== S.token) return;
  hideToast();
  const drop = best ? wpDrop(best.score, us) : 0;
  const bd = best && describeMove(before, best.move);
  if (gm.kind === 'drill') {
    const e = gm.cur, ok = drop <= 8 || same;
    gm.busy = false; gm.active = false; gm.answered = true;
    const firstTry = !gm.failed.includes(e);
    if (ok) {
      gm.okCount += firstTry ? 1 : 0; gm.doneCount++; gm.streak = (gm.streak || 0) + 1;
      const xp = (gm.hints ? 5 : 10) + (gm.streak >= 3 ? 5 : 0); gm.sessionXP += xp; XP.add(xp);
      renderGames(); render();
      popup({ tone: 'win', kicker: firstTry ? 'Réussi' : 'Réussi au deuxième essai', title: pick(['Bien vu !', 'Exactement !', 'Bravo !']),
        moves: [{ label: 'Dans ta partie', san: e.played, kind: 'bad' }, { label: 'Cette fois', san: mv.san, kind: 'good' }],
        detail: explainMove(before, mv.san) + (same ? '' : ` Le moteur préférait ${fr(bd.san)}, mais ton coup tient la route.`), xp, streak: gm.streak,
        buttons: [{ label: gm.queue.length ? 'Position suivante' : 'Voir mon bilan', primary: true, action: () => nextDrill() }] });
    } else {
      gm.streak = 0; if (firstTry) gm.failed.push(e); gm.queue.push(e);
      S.arrows = [{ from: best.move.from, to: best.move.to, color: ARROW.plan }];
      renderGames(); render();
      popup({ tone: 'lose', kicker: 'Pas encore', title: pick(['Presque !', 'Pas tout à fait', 'Ça ne suffit pas']),
        moves: [{ label: 'Ton coup', san: mv.san, kind: 'bad' }, { label: 'Le bon coup', san: bd.san, kind: 'good' }],
        detail: explainMove(before, best.move) + ' Cette position reviendra un peu plus tard.',
        buttons: [{ label: 'Voir sur l’échiquier', cancel: true, action: () => toast('La flèche verte montre le bon coup.', 'info', 3000) }, { label: 'Position suivante', primary: true, action: () => nextDrill() }] });
    }
    return;
  }
  // Rejouer mes ouvertures
  gm.busy = false;
  if (!same && drop > 8 && bd) {
    gm.bad++; renderGames();
    popup({ tone: 'lose', kicker: 'Tes ouvertures', title: 'Il y avait mieux',
      moves: [{ label: 'Ton coup', san: mv.san, kind: 'bad' }, { label: 'Mieux', san: bd.san, kind: 'good' }],
      detail: explainMove(before, best.move),
      buttons: [{ label: 'Rejouer ce coup', action: () => { g.undo(); gm.active = true; S.arrows = []; renderGames(); render(); } },
                { label: 'Continuer', primary: true, cancel: true, action: () => { if (g.game_over()) { gm.active = false; renderGames(); render(); } else sparOpponent(); } }] });
    return;
  }
  gm.good++; renderGames();
  toast(`<b>${fr(mv.san)}</b> : bon coup.`, 'win', 1800);
  if (g.game_over()) { gm.active = false; renderGames(); render(); return; }
  sparOpponent();
}
