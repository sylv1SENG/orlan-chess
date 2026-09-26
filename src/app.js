(() => {
const $ = id => document.getElementById(id);
const GLYPH = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟︎' };
const NAME = { p: 'pion', n: 'cavalier', b: 'fou', r: 'tour', q: 'dame', k: 'roi' };
const FEM = { r: 1, q: 1 };
const ton = t => (FEM[t] ? 'ta ' : 'ton ') + NAME[t];
const le = t => (FEM[t] ? 'la ' : 'le ') + NAME[t];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const VALS = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const ARROW = { plan: '#86C06F', threat: '#F2584F', move: '#E8CD8F' };
const LEVELS = {
  deb: { depth: 2, ms: 500, noise: 130, label: 'Débutant' },
  club: { depth: 4, ms: 900, noise: 12, label: 'Club' },
  exp: { depth: 6, ms: 1800, noise: 0, label: 'Expert' }
};
const CAT = {
  book: { sym: '', label: 'Théorie', c: 'var(--brass-hi)' },
  brill: { sym: '!!', label: 'Brillant', c: 'var(--c-brill)' },
  best: { sym: '!', label: 'Meilleur coup', c: 'var(--c-best)' },
  exc: { sym: '!', label: 'Excellent', c: 'var(--c-best)' },
  good: { sym: '', label: 'Bon coup', c: 'var(--c-good)' },
  inacc: { sym: '?!', label: 'Imprécision', c: 'var(--c-inacc)' },
  mist: { sym: '?', label: 'Erreur', c: 'var(--c-mist)' },
  blund: { sym: '??', label: 'Gaffe', c: 'var(--c-blund)' }
};
const LINES = {
  brill: ["Magnifique. Ça, c'est un coup de joueur.", "Voilà ! Tu as vu exactement ce qu'il fallait voir.", "Superbe. Je n'aurais pas mieux fait."],
  best: ["C'est le coup que j'aurais joué.", "Précis. Rien à redire.", "Exactement. Continue comme ça.", "Oui. Simple et fort."],
  exc: ["Très solide.", "Bon réflexe, ça tient la route.", "Propre. Presque aussi fort que le meilleur coup."],
  good: ["Correct, mais il y avait un peu mieux.", "Jouable. Pas le plus fort, mais jouable.", "Ça passe. Cherche quand même plus actif."],
  inacc: ["Hmm. Pas terrible, ça.", "Imprécis. Tu laisses filer un peu d'avantage.", "Tu joues trop vite. Il y avait plus fort."],
  mist: ["Non. Là, tu te compliques la vie.", "Erreur. Regarde d'abord ce que ton adversaire peut répondre.", "Ce coup-là va te coûter."],
  blund: ["Aïe. Ça, ça perd.", "Stop. Avant de lâcher une pièce, demande-toi toujours ce qu'il peut prendre.", "Grosse faute. On respire et on vérifie avant de jouer."]
};
const pick = a => a[Math.floor(Math.random() * a.length)];
const fr = san => san ? san.replace(/[NBRQK]/g, c => ({ N: 'C', B: 'F', R: 'T', Q: 'D', K: 'R' })[c]) : san;
const MATE = 100000;
const isMate = s => Math.abs(s) > MATE - 1000;
const mateIn = s => Math.ceil((MATE - Math.abs(s)) / 2);
const fmtEval = s => isMate(s) ? (s > 0 ? '#' : '-#') + mateIn(s) : (s > 0 ? '+' : '') + (s / 100).toFixed(1);
const clampCp = s => Math.max(-1500, Math.min(1500, s));
const winPct = cp => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * clampCp(cp))) - 1);
const moveAcc = drop => Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * Math.max(0, drop)) - 3.1669));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const byId = id => OPENINGS.find(o => o.id === id);
const toArrows = a => (a || []).map(([from, to, k]) => ({ from, to, color: ARROW[k] || ARROW.plan }));

/* ---------- Opening book ---------- */
// Book lines that match the moves played so far, with the next book move for each
function bookCandidates(sans) {
  const out = [];
  for (const o of OPENINGS) {
    if (sans.length >= o.moves.length) continue;
    if (sans.every((s, i) => o.moves[i].m === s)) out.push({ o, step: o.moves[sans.length], idx: sans.length });
  }
  return out;
}
function bookMatch(sans, san, prefer) {
  const c = bookCandidates(sans).filter(x => x.step.m === san);
  if (!c.length) return null;
  return c.find(x => prefer && x.o.id === prefer.id) || c.find(x => x.o.side === S.user) || c[0];
}
function openingName(sans) {
  let best = null, bestLen = 0;
  for (const o of OPENINGS) {
    let k = 0; while (k < sans.length && k < o.moves.length && o.moves[k].m === sans[k]) k++;
    const need = Math.min(o.moves.length, o.side === 'w' ? 5 : 2);
    if (k >= need && k > bestLen) { best = o.name; bestLen = k; }
  }
  if (best) return best;
  const basic = [['e4 e5 Nf3 Nc6 Bc4', 'Partie italienne'], ['e4 e5 Nf3 Nc6 Bb5', 'Partie espagnole'], ['e4 c5', 'Défense sicilienne'], ['e4 e6', 'Défense française'], ['e4 c6', 'Défense Caro-Kann'], ['e4 d5', 'Défense scandinave'], ['e4 e5', 'Partie ouverte'], ['d4 d5 c4', 'Gambit dame'], ['d4 d5 Bf4', 'Système de Londres'], ['d4 Nf6', 'Défense indienne'], ['c4', 'Ouverture anglaise'], ['Nf3', 'Ouverture Réti'], ['e4', 'Ouverture du pion roi'], ['d4', 'Ouverture du pion dame']];
  const all = sans.join(' ');
  for (const [k, v] of basic) if ((all + ' ').startsWith(k + ' ')) return v;
  return null;
}

/* ---------- Engine in a background worker ---------- */
const E = (() => {
  let worker = null, seq = 0;
  const waiting = new Map();
  try {
    const src = $('engine-src').textContent +
      '\nonmessage=function(e){var d=e.data,r=null;try{r=Engine[d.fn].apply(null,d.args)}catch(x){}postMessage({id:d.id,r:r})};';
    worker = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
    worker.onmessage = e => { const f = waiting.get(e.data.id); waiting.delete(e.data.id); f && f(e.data.r); };
    worker.onerror = () => { worker = null; for (const [, f] of waiting) f(null); waiting.clear(); };
  } catch (e) { worker = null; }
  return (fn, ...args) => new Promise(res => {
    if (worker) { const id = ++seq; waiting.set(id, res); worker.postMessage({ id, fn, args }); }
    else setTimeout(() => { try { res(Engine[fn](...args)); } catch (e) { res(null); } }, 20);
  });
})();

/* ---------- Sound ---------- */
let actx = null, soundOn = true;
function tock(kind) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    const len = kind === 'cap' ? .12 : .07;
    const buf = actx.createBuffer(1, Math.floor(actx.sampleRate * len), actx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, kind === 'cap' ? 4 : 7);
    const s = actx.createBufferSource(); s.buffer = buf;
    const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = kind === 'cap' ? 700 : kind === 'chk' ? 2200 : 1400; f.Q.value = 3;
    const g = actx.createGain(); g.gain.value = kind === 'cap' ? 2.2 : 1.6;
    s.connect(f); f.connect(g); g.connect(actx.destination); s.start(actx.currentTime);
  } catch (e) {}
}
const soundFor = m => tock(m.san.includes('+') ? 'chk' : m.captured ? 'cap' : 'move');
$('sound').onclick = () => {
  soundOn = !soundOn;
  $('sound').setAttribute('aria-pressed', soundOn);
  $('sound').textContent = soundOn ? 'Son activé' : 'Son coupé';
};

const S = {
  mode: 'play',
  game: new Chess(), user: 'w', level: 'club', flipped: false,
  notes: {}, entries: [], analysis: null, pending: null,
  busy: false, thinking: '', sel: null, targets: [], hint: 0, arrows: [], focus: [], over: false,
  anim: null, token: 0, guide: null, bb: null, threatSq: null,
  study: { o: OPENINGS[0], step: 0, game: new Chess(), timer: null },
  bases: { item: null, game: new Chess(), color: 'w', active: false, busy: false, moves: 0, done: false },
  gm: { game: new Chess(), color: 'w', active: false, busy: false }
};
const G = () => S.mode === 'study' ? S.study.game : S.mode === 'bases' ? S.bases.game : S.mode === 'games' ? S.gm.game : S.game;
// Which colour the person moves, and whether they may move now, in the current mode
const userColor = () => S.mode === 'bases' ? S.bases.color : S.mode === 'games' ? S.gm.color : S.user;
function inputAllowed() {
  const g = G();
  if (S.mode === 'play') return g.turn() === S.user && !S.busy && !S.over;
  if (S.mode === 'bases') return S.bases.active && !S.bases.busy && g.turn() === S.bases.color;
  if (S.mode === 'games') return S.gm.active && !S.gm.busy && g.turn() === S.gm.color;
  return false;
}
function userMove(from, to, promotion, dragged) {
  if (S.mode === 'play') return tryMove(from, to, promotion, dragged);
  const p = G().get(from);
  if (!promotion && p && p.type === 'p' && (to[1] === '8' || to[1] === '1')) { askPromotion(from, to); return; }
  if (S.mode === 'bases') return basesMove(from, to, promotion, dragged);
  if (S.mode === 'games') return gamesMove(from, to, promotion, dragged);
}

/* ---------- Board ---------- */
const boardEl = $('board');
const squares = [];
for (let i = 0; i < 64; i++) { const d = document.createElement('div'); d.className = 'sq'; boardEl.appendChild(d); squares.push(d); }
const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
arrowSvg.setAttribute('class', 'arrows'); arrowSvg.setAttribute('viewBox', '0 0 8 8');
boardEl.appendChild(arrowSvg);

function bottomColor() {
  const base = S.mode === 'study' ? S.study.o.side : userColor();
  return S.flipped ? (base === 'w' ? 'b' : 'w') : base;
}
function sqAt(i) {
  const r = Math.floor(i / 8), c = i % 8;
  return bottomColor() === 'w' ? 'abcdefgh'[c] + (8 - r) : 'abcdefgh'[7 - c] + (r + 1);
}
function xy(sq) {
  const f = sq.charCodeAt(0) - 97, rk = +sq[1];
  return bottomColor() === 'w' ? [f, 8 - rk] : [7 - f, rk - 1];
}
const idxOf = sq => { const [x, y] = xy(sq); return y * 8 + x; };
let drag = null;

function render() {
  const g = G(), study = S.mode === 'study';
  const hist = g.history({ verbose: true });
  const last = hist[hist.length - 1];
  const checkSq = g.in_check() ? findKing(g, g.turn()) : null;
  const myTurn = inputAllowed(), uc = userColor();
  for (let i = 0; i < 64; i++) {
    const sq = sqAt(i), el = squares[i];
    const r = Math.floor(i / 8), c = i % 8;
    const p = g.get(sq);
    el.dataset.sq = sq;
    let cls = 'sq ' + ((r + c) % 2 ? 'd' : 'l');
    if (last && (last.from === sq || last.to === sq)) cls += ' last';
    if (S.sel === sq && !study) cls += ' sel';
    if (checkSq === sq) cls += ' chk';
    if (S.focus.includes(sq)) cls += ' focus';
    if (!study && S.targets.includes(sq)) cls += ' tgt' + (p ? ' cap' : '');
    if (myTurn && p && p.color === uc) cls += ' mine';
    el.className = cls;
    el.innerHTML = p ? `<span class="pc ${p.color}${drag && drag.moved && drag.from === sq ? ' ghosted' : ''}">${GLYPH[p.type]}</span>` : '';
  }
  const bw = bottomColor() === 'w';
  $('ranks').innerHTML = [...Array(8)].map((_, i) => `<span>${bw ? 8 - i : i + 1}</span>`).join('');
  $('files').innerHTML = [...Array(8)].map((_, i) => `<span>${'abcdefgh'[bw ? i : 7 - i]}</span>`).join('');
  if (S.anim) { animate(S.anim); S.anim = null; }
  drawArrows();
  placeBubble();
  renderPlayers();
  $('evalbar').classList.toggle('off', S.mode !== 'play');
  if (S.mode !== 'play') return;
  renderMoves();
  renderStats();
  $('undo').disabled = S.busy || !S.entries.length;
  $('hint').disabled = S.busy || S.over || g.turn() !== S.user || !S.analysis;
}
function animate(m) {
  const moves = [[m.from, m.to]];
  if (m.flags && m.flags.includes('k')) moves.push([m.color === 'w' ? 'h1' : 'h8', m.color === 'w' ? 'f1' : 'f8']);
  if (m.flags && m.flags.includes('q')) moves.push([m.color === 'w' ? 'a1' : 'a8', m.color === 'w' ? 'd1' : 'd8']);
  const size = boardEl.clientWidth / 8;
  for (const [from, to] of moves) {
    const pc = squares[idxOf(to)].querySelector('.pc'); if (!pc) continue;
    const [fx, fy] = xy(from), [tx, ty] = xy(to);
    pc.style.transition = 'none';
    pc.style.transform = `translate(${(fx - tx) * size}px, ${(fy - ty) * size}px)`;
    pc.getBoundingClientRect();
    pc.classList.add('moving');
    pc.style.transition = ''; pc.style.transform = '';
    setTimeout(() => pc.classList.remove('moving'), 260);
  }
}
function findKing(g, color) {
  const b = g.board();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { const p = b[r][c]; if (p && p.type === 'k' && p.color === color) return 'abcdefgh'[c] + (8 - r); }
}
function drawArrows() {
  let h = '';
  const list = S.bb && S.bb.arrow && S.mode !== 'study' ? S.arrows.concat([S.bb.arrow]) : S.arrows;
  for (const a of list) {
    if (!a || a.from === a.to) continue;
    const [x1, y1] = xy(a.from), [x2, y2] = xy(a.to);
    const ax = x1 + .5, ay = y1 + .5, bx = x2 + .5, by = y2 + .5;
    const len = Math.hypot(bx - ax, by - ay), ux = (bx - ax) / len, uy = (by - ay) / len;
    const tipX = bx - ux * .12, tipY = by - uy * .12;
    const ex = tipX - ux * .32, ey = tipY - uy * .32;
    const sx = ax + ux * .22, sy = ay + uy * .22;
    h += `<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${a.color}" stroke-width=".15" stroke-linecap="round" opacity=".85"${a.dash ? ' stroke-dasharray=".22 .16"' : ''}/>
      <polygon points="${tipX},${tipY} ${ex - uy * .25},${ey + ux * .25} ${ex + uy * .25},${ey - ux * .25}" fill="${a.color}" opacity=".85"/>`;
  }
  arrowSvg.innerHTML = h;
}
/* ---------- Speech bubble on the board ---------- */
function placeBubble() {
  const el = $('bb');
  if (!S.bb || S.mode === 'study') { el.hidden = true; el.dataset.key = ''; return; }
  if (el.dataset.key !== S.bb.key) {
    el.innerHTML = `<div class="bh"><span class="av">VO</span><span class="lab">${S.bb.label}</span><span class="x" aria-hidden="true">×</span></div>
      <p class="main">${S.bb.main}</p>${S.bb.why ? `<p>${S.bb.why}</p>` : ''}`;
    el.className = 'bb' + (S.bb.ok ? ' ok' : '');
    el.dataset.key = S.bb.key;
    el.hidden = false;
  }
  if (window.matchMedia('(max-width: 600px)').matches) { el.style.left = el.style.top = ''; el.classList.remove('below'); return; }
  const size = boardEl.clientWidth / 8;
  const [x, y] = xy(S.bb.sq);
  const cx = boardEl.offsetLeft + (x + .5) * size, cy = boardEl.offsetTop + (y + .5) * size;
  const fw = el.parentElement.clientWidth, w = el.offsetWidth, h = el.offsetHeight;
  let top = cy - size * .42 - h - 9, below = false;
  if (top < 2) { top = cy + size * .42 + 9; below = true; }
  const left = Math.max(8, Math.min(fw - w - 8, cx - w / 2));
  el.classList.toggle('below', below);
  el.style.left = left + 'px'; el.style.top = top + 'px';
  el.style.setProperty('--tx', Math.max(16, Math.min(w - 16, cx - left)) + 'px');
}
$('bb').addEventListener('click', () => { S.bb = null; render(); });
window.addEventListener('resize', () => placeBubble());

// Pieces the piece on `sq` attacks in position `fen` (side to move = opponent of that piece)
function attacksFrom(fen, sq) {
  const parts = fen.split(' '); parts[1] = parts[1] === 'w' ? 'b' : 'w'; parts[3] = '-';
  try { return new Chess(parts.join(' ')).moves({ square: sq, verbose: true }).filter(m => m.captured && m.captured !== 'k').map(m => ({ type: m.captured, sq: m.to })); }
  catch (e) { return []; }
}
// Plain-language reason for a move, from the mover's point of view
function explainMove(fen, mv) {
  const g = new Chess(fen), r = g.move(mv);
  if (!r) return '';
  const moveNo = +fen.split(' ')[5] || 1;
  const P = cap(le(r.piece)), fem = FEM[r.piece] ? 'e' : '';
  const out = [];
  if (r.san.includes('#')) return 'Échec et mat, tout simplement.';
  if (r.flags.includes('k') || r.flags.includes('q')) out.push("Le roque met ton roi à l'abri et fait entrer la tour dans le jeu.");
  else if (r.promotion) out.push('Le pion va à dame : une pièce de plus pour toi.');
  else if (r.captured) out.push(`${P} prend ${le(r.captured)} en ${r.to}${VALS[r.captured] > VALS[r.piece] ? ' : tu gagnes du matériel' : ''}.`);
  if (S.threatSq && r.from === S.threatSq && !r.captured) out.push(`${P} était attaqué${fem} : il${fem ? 'le' : ''} se met à l'abri en ${r.to}.`.replace('ille', 'elle'));
  if (r.san.includes('+')) out.push("L'échec force ton adversaire à s'occuper de son roi.");
  const att = attacksFrom(g.fen(), r.to).filter(a => VALS[a.type] > VALS[r.piece] || VALS[a.type] >= 3).sort((a, b) => VALS[b.type] - VALS[a.type]);
  if (att.length && out.length < 2) out.push(`${P} en ${r.to} attaque ${le(att[0].type)} adverse en ${att[0].sq}${att.length > 1 ? ` et ${le(att[1].type)} en ${att[1].sq}` : ''}.`);
  if (!out.length) {
    const back = r.color === 'w' ? '1' : '8';
    if ((r.piece === 'n' || r.piece === 'b') && r.from[1] === back) out.push(`${P} sort de sa case de départ et se développe vers le centre.`);
    else if (r.piece === 'p' && ['d4', 'e4', 'd5', 'e5'].includes(r.to)) out.push('Le pion prend le centre et ouvre des lignes à tes pièces.');
    else if (r.piece === 'p' && moveNo <= 12 && /^[cdef]/.test(r.to)) out.push('Le pion soutient le centre et gagne de l\'espace.');
    else if (r.piece === 'r') out.push('La tour rejoint une colonne plus active.');
    else if (r.piece === 'q') out.push('La dame se place sur une meilleure case, sans prendre de risque.');
    else if (r.piece === 'k') out.push('Le roi se met en sécurité.');
    else out.push(`${P} va sur une meilleure case, plus active, sans rien lâcher.`);
  }
  return out.slice(0, 2).join(' ');
}
function setBubble(b) { S.bb = b ? { ...b, key: String(Date.now()) } : null; }

function capturedBy(g, color) {
  const start = { p: 8, n: 2, b: 2, r: 2, q: 1 }, have = { p: 0, n: 0, b: 0, r: 0, q: 0 };
  const opp = color === 'w' ? 'b' : 'w';
  for (const row of g.board()) for (const p of row) if (p && p.color === opp && p.type !== 'k') have[p.type]++;
  let s = '', pts = 0;
  for (const t of ['q', 'r', 'b', 'n', 'p']) { const n = Math.max(0, start[t] - have[t]); s += GLYPH[t].repeat(n); pts += n * VALS[t]; }
  return { s, pts };
}
function renderPlayers() {
  const g = G(), study = S.mode === 'study';
  const bottom = bottomColor(), top = bottom === 'w' ? 'b' : 'w';
  const cw = capturedBy(g, 'w'), cb = capturedBy(g, 'b'), diff = cw.pts - cb.pts;
  const line = c => {
    const capd = c === 'w' ? cw : cb, adv = c === 'w' ? diff : -diff;
    const name = study ? (c === 'w' ? 'Blancs' : 'Noirs') + (c === S.study.o.side ? ' · ton camp' : '')
      : S.mode === 'bases' ? (c === S.bases.color ? 'Toi' : 'Défense de l’ordinateur')
      : S.mode === 'games' ? (c === S.gm.color ? 'Toi' : (S.gm.oppLabel || 'Tes adversaires'))
      : c === S.user ? 'Toi' : `Ordinateur · ${LEVELS[S.level].label}`;
    let st = '';
    if (S.mode === 'play' && !S.over && g.turn() === c) {
      if (c !== S.user && S.busy) st = '<span class="status on"><i></i><i></i><i></i> réfléchit</span>';
      else if (c === S.user && S.thinking) st = `<span class="status on"><i></i><i></i><i></i> ${S.thinking}</span>`;
      else if (c === S.user) st = '<span class="status">À toi de jouer</span>';
    }
    const showCaps = S.mode === 'play' || S.mode === 'games';
    return `<span class="who"><span class="dot" style="background:${c === 'w' ? '#FFFBF1' : '#17110C'}"></span><b>${name}</b>${showCaps ? `<span class="caps">${capd.s}</span>${adv > 0 ? `<small>+${adv}</small>` : ''}` : ''}</span>${st}`;
  };
  $('p-top').innerHTML = line(top);
  $('p-bot').innerHTML = line(bottom);
}
function renderMoves() {
  const hist = S.game.history();
  const name = hist.length ? openingName(hist) : null;
  $('oname').hidden = !name;
  $('oname').textContent = name ? `Ouverture : ${name}${S.guide ? ' · guidée' : ''}` : '';
  if (!hist.length) { $('moves').innerHTML = '<div class="empty">Aucun coup joué pour l\'instant.</div>'; return; }
  let rows = '';
  for (let i = 0; i < hist.length; i += 2) {
    const cell = j => {
      if (j >= hist.length) return '<td></td>';
      const n = S.notes[j];
      const sym = n && n.sym ? `<span class="s" style="color:${CAT[n.cat].c}">${n.sym}</span>` : '';
      return `<td${j === hist.length - 1 ? ' class="cur"' : ''}>${fr(hist[j])}${sym}</td>`;
    };
    rows += `<tr><td class="n">${i / 2 + 1}.</td>${cell(i)}${cell(i + 1)}</tr>`;
  }
  const box = $('moves');
  box.innerHTML = `<table>${rows}</table>`;
  box.scrollTop = box.scrollHeight;
}
function renderStats() {
  const e = S.entries, count = cats => e.filter(x => cats.includes(x.cat)).length;
  const acc = e.length ? Math.round(e.reduce((a, x) => a + x.acc, 0) / e.length) : null;
  $('acc').textContent = acc === null ? '' : `Précision ${acc} %`;
  $('stats').innerHTML = `
    <div><b style="color:var(--c-best)">${count(['brill', 'best', 'exc', 'book'])}</b><small>Très bons</small></div>
    <div><b style="color:var(--c-inacc)">${count(['inacc'])}</b><small>Imprécis</small></div>
    <div><b style="color:var(--c-blund)">${count(['mist', 'blund'])}</b><small>Erreurs</small></div>`;
}
function setEval(scoreWhite) {
  const pct = isMate(scoreWhite) ? (scoreWhite > 0 ? 100 : 0) : winPct(scoreWhite);
  $('evalbar').classList.toggle('flip', bottomColor() === 'b');
  $('evalw').style.height = pct + '%';
  $('evaltxt').textContent = fmtEval(scoreWhite);
}

/* ---------- Coach bubble ---------- */
function showBubble(html) {
  const b = $('bubble');
  b.classList.remove('enter'); b.innerHTML = html; void b.offsetWidth; b.classList.add('enter');
  wireBubble();
}
function wireBubble() {
  document.querySelectorAll('#bubble [data-open]').forEach(b => b.onclick = () => openStudy(b.dataset.open));
  document.querySelectorAll('#bubble [data-guide]').forEach(b => b.onclick = () => startGuided(byId(b.dataset.guide)));
}
function welcome() {
  if (S.guide) {
    const o = S.guide;
    showBubble(`<p class="say">Au programme : ${o.name}. Je te souffle les coups de la théorie et je t'explique leur idée. Ensuite, tu voles de tes propres ailes.</p>
      <p class="tip"><b>Le plan :</b> ${o.plans.join(' · ')}.</p>`);
    return;
  }
  const w = OPENINGS.filter(o => o.side === 'w'), b = OPENINGS.filter(o => o.side === 'b');
  const pickFor = S.user === 'w' ? ['italienne', 'londres'] : ['caro-kann', 'scandinave'];
  showBubble(`<p class="say">Bonjour. On joue une partie, niveau ${LEVELS[S.level].label.toLowerCase()}. Après chacun de tes coups, je te dis ce que j'en pense. Sans filtre.</p>
    <p class="tip">Tu veux travailler une ouverture pendant cette partie ? Avec les ${S.user === 'w' ? 'Blancs' : 'Noirs'}, je te conseille :</p>
    <div class="propose">${pickFor.map(id => `<button class="ochip" data-guide="${id}">${byId(id).name}</button>`).join('')}
    <button class="ochip" data-open="${pickFor[0]}">Voir les explications</button></div>`);
}
function renderEntry(e, quiet) {
  const c = CAT[e.cat];
  let h = `<div class="verdict"><span class="chip" style="--c:${c.c}">${c.sym ? `<span class="sym">${c.sym}</span>` : ''}${c.label}</span>
    <span class="mv">${e.num} ${fr(e.san)}</span><span class="ev">${e.evalUser === null ? '' : fmtEval(e.evalUser)}</span></div>
    <p class="say">${e.text}</p>`;
  if (e.tip) h += `<p class="tip">${e.tip}</p>`;
  if (e.better) h += `<div class="better">Mieux : <strong>${fr(e.better.san)}</strong><span>${fmtEval(e.better.score)}</span><button class="btn" id="show-best">Voir</button></div>`;
  if (e.threat) h += `<p class="reply warn">${e.threat}</p>`;
  if (e.reply) h += `<p class="reply">${e.reply}</p>`;
  if (e.guideTip) h += `<p class="tip">${e.guideTip}</p>`;
  if (quiet) { $('bubble').innerHTML = h; wireBubble(); } else showBubble(h);
  const sb = $('show-best');
  if (sb) sb.onclick = () => { S.arrows = [{ from: e.better.from, to: e.better.to, color: ARROW.plan }]; drawArrows(); };
}

/* ---------- Analysis ---------- */
function describeMove(fen, mv) {
  const g = new Chess(fen);
  const r = mv && g.move(mv);
  return r ? { san: r.san, r } : null;
}
function countUndeveloped(fen, color) {
  const g = new Chess(fen), rank = color === 'w' ? '1' : '8';
  return ['b', 'c', 'f', 'g'].filter(f => { const p = g.get(f + rank); return p && p.color === color && (p.type === 'n' || p.type === 'b'); }).length;
}
function buildComment(ctx) {
  const { cat, move, before, best, bestInfo, replyInfo, ply, userScore, inCheckBefore } = ctx;
  const parts = [pick(LINES[cat])], tips = [];
  const bestR = bestInfo && bestInfo.r;
  if (['mist', 'blund', 'inacc'].includes(cat) && replyInfo) {
    const rr = replyInfo.r;
    if (isMate(userScore) && userScore < 0) parts.push(`Après <em>${fr(rr.san)}</em>, il a un mat en ${mateIn(userScore)}.`);
    else if (rr.captured && rr.to === move.to) parts.push(`${cap(ton(move.piece))} en ${move.to} n'est pas protégé${FEM[move.piece] ? 'e' : ''} : <em>${fr(rr.san)}</em> ${FEM[move.piece] ? 'la' : 'le'} ramasse.`);
    else if (rr.captured) parts.push(`Il répond <em>${fr(rr.san)}</em> et gagne ${ton(rr.captured)}.`);
    else if (rr.san.includes('+')) parts.push(`Regarde <em>${fr(rr.san)}</em> : l'échec fait mal.`);
    else if (bestR && bestR.captured) parts.push(`Tu pouvais prendre ${le(bestR.captured)} avec <em>${fr(bestR.san)}</em>.`);
  }
  if (bestR && cat !== 'best' && cat !== 'brill' && isMate(best.score) && best.score > 0 && !(isMate(userScore) && userScore > 0))
    parts.push(`Tu avais un mat en ${mateIn(best.score)} qui commençait par <em>${fr(bestR.san)}</em>.`);
  if (move.san.includes('#')) parts[0] = 'Échec et mat. Joli travail.';
  else if ((cat === 'best' || cat === 'brill') && isMate(best.score) && best.score > 0) parts.push(`Mat en ${mateIn(best.score)} au bout.`);
  else if ((cat === 'best' || cat === 'exc' || cat === 'brill') && move.captured) parts.push(`Tu gagnes ${le(move.captured)}, bien vu.`);

  const moveNo = Math.floor(ply / 2) + 1;
  const hist = S.game.history({ verbose: true });
  const myPrev = hist.filter((m, i) => i < ply && m.color === move.color);
  if (move.flags.includes('k') || move.flags.includes('q')) tips.push('<b>Roque.</b> Ton roi est à l\'abri et ta tour entre en jeu. Toujours un bon réflexe.');
  else if (moveNo <= 12) {
    const backRank = move.color === 'w' ? '1' : '8';
    const und = countUndeveloped(before, move.color);
    if (move.piece === 'q' && moveNo <= 6 && !move.captured && und >= 3) tips.push('<b>Dame trop tôt.</b> Elle va se faire chasser par les pièces adverses, et tu perdras du temps.');
    else if (move.piece === 'k' && !inCheckBefore && /[kq]/i.test(before.split(' ')[2] || '')) tips.push('<b>Roi baladeur.</b> En bougeant ton roi, tu perds le droit de roquer.');
    else if (move.piece === 'n' && /^[ah]/.test(move.to)) tips.push('<b>Cavalier sur le bord, cavalier sans espoir.</b> Au centre, il contrôle deux fois plus de cases.');
    else if ((move.piece === 'n' || move.piece === 'b') && move.from[1] === backRank && !move.captured) tips.push('<b>Développement.</b> Une pièce de plus en jeu, c\'est ce qu\'on veut dans l\'ouverture.');
    else if (move.piece === 'p' && ['e4', 'd4', 'e5', 'd5', 'c4', 'c5'].includes(move.to) && moveNo <= 4) tips.push('<b>Le centre.</b> L\'occuper avec les pions, c\'est la base.');
    else if (move.piece === 'p' && move.from[0] === 'f' && moveNo <= 8) tips.push('<b>Attention au pion f.</b> Il protège ton roi. Le bouger tôt ouvre des lignes dangereuses.');
    else if (move.piece !== 'p' && !move.captured && myPrev.length && myPrev[myPrev.length - 1].to === move.from && und >= 2) tips.push('<b>Même pièce deux fois.</b> Pendant ce temps, d\'autres pièces dorment sur leur case de départ.');
  }
  if (!tips.length && move.san.includes('+') && !['blund', 'mist'].includes(cat) && !move.san.includes('#')) tips.push('<b>Échec.</b> Un échec qui sert un plan, oui. Un échec « pour voir », rarement.');
  return { text: parts.join(' '), tip: tips[0] || '' };
}

// Next theory move for the user in guided mode (or null)
function guideNext() {
  if (!S.guide) return null;
  const sans = S.game.history();
  const o = S.guide;
  if (sans.length >= o.moves.length || !sans.every((s, i) => o.moves[i].m === s)) return null;
  return o.moves[sans.length];
}
function guideTipHtml() {
  const nx = guideNext();
  if (!nx || S.game.turn() !== S.user) return '';
  const d = describeMove(S.game.fen(), nx.m);
  if (!d) return '';
  S.arrows = S.arrows.concat([{ from: d.r.from, to: d.r.to, color: ARROW.move }]);
  return `<b>Théorie :</b> joue maintenant <em>${fr(d.san)}</em> (flèche dorée).`;
}

async function analysePosition(tok) {
  const fen = S.game.fen();
  const p = E('best', fen, 5, 1300, 0);
  S.pending = { fen, p };
  const a = await p;
  if (tok !== S.token || !a) return;
  if (S.game.fen() !== fen) return;
  S.analysis = { fen, ...a };
  S.threatSq = null;
  setEval(S.user === 'w' ? a.score : -a.score);
  if (S.game.in_check() || guideNext()) return;
  const parts = fen.split(' '); parts[1] = parts[1] === 'w' ? 'b' : 'w'; parts[3] = '-';
  const flip = parts.join(' ');
  const t = await E('best', flip, 3, 350, 0);
  if (tok !== S.token || S.game.fen() !== fen || !t) return;
  if (t.score + a.score >= 180) {
    const d = describeMove(flip, t.move);
    if (d && (d.r.captured || isMate(t.score))) {
      const what = isMate(t.score) ? 'un mat' : `de prendre ${ton(d.r.captured)} en ${d.r.to}`;
      const msg = `Attention : il menace ${what} avec <em>${fr(d.san)}</em>.`;
      if (d.r.captured) S.threatSq = d.r.to;
      const last = S.entries[S.entries.length - 1];
      if (last && last.ply === S.game.history().length - 2) { last.threat = msg; renderEntry(last, true); }
      else showBubble(`<p class="say">${msg}</p>`);
    }
  }
}

async function afterUserMove(move, before, ply, tok) {
  const num = Math.floor(ply / 2) + 1 + (move.color === 'w' ? '.' : '…');
  const sansBefore = S.game.history().slice(0, ply);
  const guidedBefore = S.guide && sansBefore.length < S.guide.moves.length && sansBefore.every((s, i) => S.guide.moves[i].m === s) ? S.guide.moves[sansBefore.length] : null;
  // 1. Theory move: explain its intention, no engine judgement needed
  const bk = bookMatch(sansBefore, move.san, S.guide);
  if (bk) {
    const entry = { ply, san: move.san, num, cat: 'book', acc: 100, evalUser: null,
      text: bk.step.t, tip: `<b>${bk.o.name}.</b> Coup ${bk.idx + 1} sur ${bk.o.moves.length} de la ligne principale.` };
    S.entries.push(entry);
    S.notes[ply] = { cat: 'book', sym: '' };
    S.arrows = toArrows(bk.step.a); S.focus = bk.step.sq || [];
    setBubble({ sq: move.to, ok: true, label: `Théorie · ${bk.o.name}`, main: `<b>${fr(move.san)}</b> : j'aurais joué pareil.`, why: bk.step.t.length < 45 ? `${explainMove(before, move.san)} C'est la suite théorique.` : bk.step.t });
    renderEntry(entry);
    return;
  }
  // What the theory would have played here (if we were still in a known line)
  const cands = bookCandidates(sansBefore);
  const bookSug = cands.find(x => S.guide && x.o.id === S.guide.id) || cands.find(x => x.o.side === S.user) || cands[0];
  const inCheckBefore = new Chess(before).in_check();
  let best = S.analysis && S.analysis.fen === before ? S.analysis
    : S.pending && S.pending.fen === before ? await S.pending.p : await E('best', before, 5, 1300, 0);
  if (tok !== S.token || !best) return;
  best = { ...best };
  const same = best.move.from === move.from && best.move.to === move.to && (best.move.promotion || 'q') === (move.promotion || 'q');
  let userScore = same ? best.score : await E('scoreMove', before, { from: move.from, to: move.to, promotion: move.promotion }, best.depth, 1800);
  if (tok !== S.token) return;
  if (userScore === null || userScore === undefined) userScore = best.score;
  if (userScore > best.score) best.score = userScore;
  const drop = winPct(best.score) - winPct(userScore);
  let cat;
  if (same) {
    const staticBefore = await E('staticEval', before);
    cat = (move.san.includes('#') || (best.score - staticBefore >= 250 && !move.captured) || (isMate(best.score) && best.score > 0 && mateIn(best.score) <= 3 && !move.captured)) ? 'brill' : 'best';
  }
  else if (drop <= 2) cat = 'exc';
  else if (drop <= 6) cat = 'good';
  else if (drop <= 12) cat = 'inacc';
  else if (drop <= 22) cat = 'mist';
  else cat = 'blund';
  let replyInfo = null;
  const after = S.game.fen();
  if (['inacc', 'mist', 'blund'].includes(cat) && !S.game.game_over()) {
    const rep = await E('best', after, 4, 700, 0);
    if (tok !== S.token) return;
    if (rep) replyInfo = describeMove(after, rep.move);
  }
  const bestInfo = describeMove(before, best.move);
  let { text, tip } = buildComment({ cat, move, before, best, bestInfo, replyInfo, ply, userScore, inCheckBefore });
  if (guidedBefore) {
    const d = describeMove(before, guidedBefore.m);
    tip = `<b>Tu quittes la théorie.</b> Selon la théorie (${S.guide.name}), on joue ici <em>${fr(d ? d.san : guidedBefore.m)}</em>. À partir de maintenant, c'est toi qui décides.`;
  }
  const entry = {
    ply, san: move.san, num, cat, text, tip, acc: moveAcc(drop), evalUser: userScore,
    better: (!same && drop > 6 && bestInfo) ? { san: bestInfo.san, score: best.score, from: best.move.from, to: best.move.to } : null
  };
  S.entries.push(entry);
  S.notes[ply] = { cat, sym: CAT[cat].sym };
  setEval(S.user === 'w' ? userScore : -userScore);
  // Speech bubble: what the coach would have played, and why
  const name = openingName(sansBefore.concat([move.san]));
  if (bookSug) {
    const d = describeMove(before, bookSug.step.m);
    const why = bookSug.step.t.length < 45 ? `${explainMove(before, bookSug.step.m)} C'est la suite théorique.` : bookSug.step.t;
    if (d) setBubble({ sq: d.r.to, label: `Théorie · ${bookSug.o.name}`, main: `À la place de <b>${fr(move.san)}</b>, j'aurais joué <b>${fr(d.san)}</b>.`, why,
      arrow: { from: d.r.from, to: d.r.to, color: ARROW.move, dash: true } });
  } else if (same) {
    setBubble({ sq: move.to, ok: true, label: name && ply < 24 ? `Hors théorie · ${name}` : 'Mon analyse', main: `<b>${fr(move.san)}</b> : c'est aussi mon coup.`, why: explainMove(before, move.san) });
  } else if (bestInfo) {
    setBubble({ sq: bestInfo.r.to, label: name && ply < 24 ? `Hors théorie · ${name}` : 'Mon analyse', main: `À la place de <b>${fr(move.san)}</b>, j'aurais joué <b>${fr(bestInfo.san)}</b>.`,
      why: explainMove(before, bestInfo.san) + (drop > 6 ? '' : ' Mais ton coup se défend aussi.'),
      arrow: { from: bestInfo.r.from, to: bestInfo.r.to, color: ARROW.move, dash: true } });
  }
  renderEntry(entry);
}

async function engineMove(tok) {
  const L = LEVELS[S.level];
  const fen = S.game.fen();
  const sans = S.game.history();
  // In guided mode the computer follows the theory line
  let mv = null;
  const gn = guideNext();
  if (gn) { await sleep(700); mv = gn.m; }
  else {
    const [r] = await Promise.all([E('best', fen, L.depth, L.ms, L.noise), sleep(450)]);
    if (tok !== S.token || !r) return false;
    mv = r.move;
    if (S.level === 'deb' && Math.random() < 0.12) {
      const ms = S.game.moves({ verbose: true }), m = ms[Math.floor(Math.random() * ms.length)];
      mv = { from: m.from, to: m.to, promotion: m.promotion };
    }
  }
  if (tok !== S.token) return false;
  const played = S.game.move(mv);
  if (!played) return false;
  S.anim = played;
  soundFor(played);
  if (S.bb) S.bb.arrow = null;
  const bk = bookMatch(sans, played.san, S.guide);
  let t = `Il répond <em>${fr(played.san)}</em>${played.captured ? ` et prend ${ton(played.captured)}` : ''}.`;
  if (bk) { t = `Il répond <em>${fr(played.san)}</em> : ${bk.step.t.charAt(0).toLowerCase() + bk.step.t.slice(1)}`; S.arrows = toArrows(bk.step.a); S.focus = bk.step.sq || []; }
  else { S.arrows = []; S.focus = []; }
  if (played.san.includes('+') && !played.san.includes('#')) t += ' Échec : occupe-toi de ton roi.';
  const last = S.entries[S.entries.length - 1];
  const gt = guideTipHtml();
  if (last) { last.reply = t; last.guideTip = gt; renderEntry(last, true); }
  else showBubble(`<p class="say">${bk ? t.replace('Il répond', 'Il ouvre avec') : `Il ouvre avec <em>${fr(played.san)}</em>. À toi.`}</p>${gt ? `<p class="tip">${gt}</p>` : ''}`);
  return true;
}

/* ---------- Turn flow ---------- */
async function nextTurn() {
  const tok = S.token;
  S.sel = null; S.targets = []; S.hint = 0;
  if (checkOver()) { S.busy = false; render(); return; }
  if (S.game.turn() !== S.user) {
    S.busy = true; S.analysis = null; render();
    const ok = await engineMove(tok);
    if (tok !== S.token) return;
    S.busy = false;
    if (ok) nextTurn(); else render();
  } else {
    if (S.guide && !S.game.history().length) { const gt = guideTipHtml(); if (gt) $('bubble').insertAdjacentHTML('beforeend', `<p class="tip">${gt}</p>`); }
    const hs = S.game.history();
    if (S.guide && hs.length >= S.guide.moves.length && S.guide.moves.every((m, i) => m.m === hs[i]) && !S.guideDone) {
      S.guideDone = true;
      const last = S.entries[S.entries.length - 1];
      if (last) { last.guideTip = `<b>Fin de la théorie.</b> Tu as joué toute la ligne principale (${S.guide.name}). À toi de jouer seul maintenant. Les idées à garder : ${S.guide.plans.join(' · ')}.`; renderEntry(last, true); }
    }
    S.thinking = 'Orlan observe'; render();
    await analysePosition(tok);
    if (tok !== S.token) return;
    S.thinking = ''; render();
  }
}
function checkOver() {
  const g = S.game;
  if (!g.game_over()) return false;
  S.over = true;
  let res, line;
  if (g.in_checkmate()) {
    const won = g.turn() !== S.user;
    res = won ? 'Tu gagnes par mat.' : 'Mat. Tu perds cette partie.';
    line = won ? 'Bien joué. Maintenant, regarde tes imprécisions : c\'est là que tu progresses.' : 'Pas grave. Regarde le premier coup marqué ?? : c\'est souvent là que tout a basculé.';
  } else {
    res = g.in_stalemate() ? 'Pat : partie nulle.' : g.in_threefold_repetition() ? 'Nulle par répétition.' : g.insufficient_material() ? 'Nulle : matériel insuffisant.' : 'Partie nulle.';
    line = 'Une nulle, ça se respecte. Mais demande-toi où tu aurais pu jouer pour gagner.';
  }
  const e = S.entries;
  const acc = e.length ? Math.round(e.reduce((a, x) => a + x.acc, 0) / e.length) : 0;
  const worst = e.find(x => x.cat === 'blund' || x.cat === 'mist');
  showBubble(`<p class="say"><strong>${res}</strong> ${line}</p>
    <p class="tip">Précision : <b>${acc} %</b> sur ${e.length} coups.${worst ? ` Le tournant : <b>${worst.num} ${fr(worst.san)}</b>.` : ''}</p>
    <div><button class="btn primary" id="again">Rejouer</button></div>`);
  $('again').onclick = () => newGame();
  setEval(g.in_checkmate() ? (g.turn() === 'w' ? -MATE + 1 : MATE - 1) : 0);
  return true;
}

async function tryMove(from, to, promotion, dragged) {
  const p = S.game.get(from);
  if (!promotion && p && p.type === 'p' && (to[1] === '8' || to[1] === '1')) { askPromotion(from, to); return; }
  const before = S.game.fen(), ply = S.game.history().length;
  const move = S.game.move({ from, to, promotion: promotion || 'q' });
  if (!move) return;
  const tok = S.token;
  soundFor(move);
  if (!dragged) S.anim = move;
  S.sel = null; S.targets = []; S.arrows = []; S.focus = []; S.busy = true; S.thinking = ''; S.bb = null;
  render();
  await afterUserMove(move, before, ply, tok);
  if (tok !== S.token) return;
  S.busy = false;
  nextTurn();
}
function askPromotion(from, to) {
  const ov = document.createElement('div');
  ov.className = 'promo';
  ov.innerHTML = '<div>' + ['q', 'r', 'b', 'n'].map(t => `<button data-t="${t}" aria-label="${NAME[t]}">${GLYPH[t]}</button>`).join('') + '</div>';
  ov.addEventListener('pointerdown', ev => ev.stopPropagation());
  ov.addEventListener('click', ev => {
    const b = ev.target.closest('button');
    ov.remove();
    if (b) userMove(from, to, b.dataset.t); else { S.sel = null; S.targets = []; render(); }
  });
  boardEl.appendChild(ov);
}

/* ---------- Input: click + drag ---------- */
function select(sq) { S.sel = sq; S.targets = G().moves({ square: sq, verbose: true }).map(m => m.to); }
boardEl.addEventListener('pointerdown', ev => {
  if (S.mode === 'study') return;
  const el = ev.target.closest('.sq'); if (!el) return;
  const sq = el.dataset.sq;
  if (!inputAllowed()) return;
  if (S.sel && S.targets.includes(sq)) { userMove(S.sel, sq); return; }
  const p = G().get(sq);
  if (p && p.color === userColor()) {
    const wasSel = S.sel === sq;
    select(sq);
    const g = document.createElement('div');
    g.className = 'ghost';
    g.style.fontSize = (boardEl.clientWidth / 8 * .85) + 'px';
    g.innerHTML = `<span class="pc ${p.color}" style="font-size:inherit">${GLYPH[p.type]}</span>`;
    drag = { from: sq, el: g, wasSel, moved: false, x: ev.clientX, y: ev.clientY };
    try { boardEl.setPointerCapture(ev.pointerId); } catch (e) {}
    render();
  } else { S.sel = null; S.targets = []; render(); }
});
boardEl.addEventListener('pointermove', ev => {
  if (!drag) return;
  if (!drag.moved && Math.hypot(ev.clientX - drag.x, ev.clientY - drag.y) < 5) return;
  if (!drag.moved) { drag.moved = true; document.body.appendChild(drag.el); render(); }
  drag.el.style.left = ev.clientX + 'px'; drag.el.style.top = ev.clientY + 'px';
});
boardEl.addEventListener('pointerup', ev => {
  if (!drag) return;
  const d = drag; drag = null; d.el.remove();
  if (d.moved) {
    const t = document.elementFromPoint(ev.clientX, ev.clientY);
    const sqEl = t && t.closest && t.closest('.sq');
    if (sqEl && S.targets.includes(sqEl.dataset.sq)) { userMove(d.from, sqEl.dataset.sq, null, true); return; }
    if (!(sqEl && sqEl.dataset.sq === d.from)) { S.sel = null; S.targets = []; }
  } else if (d.wasSel) { S.sel = null; S.targets = []; }
  render();
});
boardEl.addEventListener('pointercancel', () => { if (drag) { drag.el.remove(); drag = null; render(); } });

/* ---------- Study mode (openings) ---------- */
function renderOList() {
  const grp = (side, label) => `<div class="grp"><span>${label}</span><div class="chips">${OPENINGS.filter(o => o.side === side)
    .map(o => `<button class="ochip" data-oid="${o.id}" aria-pressed="${o.id === S.study.o.id}">${o.name}</button>`).join('')}</div></div>`;
  $('olist').innerHTML = grp('w', 'Avec les Blancs') + grp('b', 'Avec les Noirs');
  document.querySelectorAll('[data-oid]').forEach(b => b.onclick = () => { stopAuto(); S.study.o = byId(b.dataset.oid); S.flipped = false; gotoStep(0); renderOList(); });
}
function gotoStep(n, animateMove) {
  const st = S.study, o = st.o;
  n = Math.max(0, Math.min(o.moves.length, n));
  const g = new Chess();
  let last = null;
  for (let i = 0; i < n; i++) last = g.move(o.moves[i].m);
  st.game = g; st.step = n;
  const cur = n ? o.moves[n - 1] : null;
  S.arrows = cur ? toArrows(cur.a) : []; S.focus = cur && cur.sq ? cur.sq : [];
  if (animateMove && last) { S.anim = last; soundFor(last); }
  render();
  renderOCard();
}
function renderOCard() {
  const st = S.study, o = st.o, n = st.step;
  const g = new Chess(); const sans = [];
  for (const m of o.moves) sans.push(g.move(m.m).san);
  const cur = n ? o.moves[n - 1] : null;
  const who = n ? (n % 2 ? 'Les Blancs' : 'Les Noirs') : '';
  const num = n ? Math.floor((n - 1) / 2) + 1 + (n % 2 ? '.' : '…') : '';
  let line = '';
  sans.forEach((s, i) => {
    if (i % 2 === 0) line += `<span class="no">${i / 2 + 1}.</span>`;
    line += `<button data-step="${i + 1}" class="${i + 1 === n ? 'on' : ''}">${fr(s)}</button>`;
  });
  const side = o.side === 'w' ? 'Blancs' : 'Noirs';
  $('ocard').innerHTML = `
    <div><h3>${o.name}</h3><div class="style">Pour les ${side} · ${o.style}</div></div>
    <div class="step" aria-live="polite">
      ${cur ? `<div class="who"><b>${num} ${fr(sans[n - 1])}</b>${who}<span class="n">${n} / ${o.moves.length}</span></div><p class="say">${cur.t}</p>`
        : `<div class="who"><b>Position de départ</b><span class="n">0 / ${o.moves.length}</span></div><p class="say">${o.summary}</p>`}
    </div>
    <div class="stepctl">
      <button class="btn" id="s-first" aria-label="Début">«</button>
      <button class="btn" id="s-prev" aria-label="Coup précédent">‹</button>
      <button class="btn grow" id="s-play">${st.timer ? 'Pause' : n >= o.moves.length ? 'Revoir' : 'Lecture'}</button>
      <button class="btn" id="s-next" aria-label="Coup suivant">›</button>
      <button class="btn" id="s-last" aria-label="Fin">»</button>
    </div>
    <div class="legend">
      <span style="--c:${ARROW.plan}"><i></i>idée, plan</span>
      <span style="--c:${ARROW.threat}"><i></i>menace, attaque</span>
      <span style="--c:${ARROW.threat}"><i class="ring"></i>case-clé</span>
    </div>
    <div class="line">${line}</div>
    ${n ? `<p class="sum">${o.summary}</p>` : ''}
    <div><div class="style" style="margin-bottom:8px">Le plan</div><ul class="plans">${o.plans.map(p => `<li>${p}</li>`).join('')}</ul></div>
    <button class="btn primary" id="s-guide">Jouer cette ouverture contre l'ordinateur</button>`;
  $('s-first').onclick = () => { stopAuto(); gotoStep(0); };
  $('s-prev').onclick = () => { stopAuto(); gotoStep(st.step - 1); };
  $('s-next').onclick = () => { stopAuto(); gotoStep(st.step + 1, true); };
  $('s-last').onclick = () => { stopAuto(); gotoStep(o.moves.length); };
  $('s-play').onclick = () => { if (st.timer) stopAuto(); else startAuto(); };
  $('s-guide').onclick = () => { stopAuto(); startGuided(o); };
  document.querySelectorAll('[data-step]').forEach(b => b.onclick = () => { stopAuto(); gotoStep(+b.dataset.step); });
}
function startAuto() {
  const st = S.study;
  if (st.step >= st.o.moves.length) gotoStep(0);
  const tick = () => {
    if (st.step >= st.o.moves.length) { stopAuto(); return; }
    gotoStep(st.step + 1, true);
  };
  st.timer = setInterval(tick, 3200);
  tick();
}
function stopAuto() { const st = S.study; if (st.timer) { clearInterval(st.timer); st.timer = null; renderOCard(); } }
function setMode(m) {
  S.mode = m;
  document.querySelectorAll('[data-mode]').forEach(x => x.setAttribute('aria-pressed', x.dataset.mode === m));
  document.querySelectorAll('.play-only').forEach(x => x.hidden = m !== 'play');
  document.querySelectorAll('.study-only').forEach(x => x.hidden = m !== 'study');
  document.querySelectorAll('.bases-only').forEach(x => x.hidden = m !== 'bases');
  document.querySelectorAll('.games-only').forEach(x => x.hidden = m !== 'games');
  S.flipped = false; S.bb = null; S.sel = null; S.targets = [];
  if (m === 'study') { renderOList(); gotoStep(S.study.step); }
  else if (m === 'bases') { stopAuto(); S.arrows = []; S.focus = []; renderBases(); render(); }
  else if (m === 'games') { stopAuto(); S.arrows = []; S.focus = []; renderGames(); render(); }
  else {
    stopAuto();
    S.arrows = []; S.focus = [];
    render();
    if (S.analysis) setEval(S.user === 'w' ? S.analysis.score : -S.analysis.score);
  }
}
function openStudy(id) {
  S.study.o = byId(id) || S.study.o;
  S.study.step = 0;
  setMode('study');
  $('jouer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function startGuided(o) {
  S.guide = o;
  S.user = o.side;
  document.querySelectorAll('[data-col]').forEach(x => x.setAttribute('aria-pressed', x.dataset.col === S.user));
  setMode('play');
  newGame(true);
  $('jouer').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.addEventListener('keydown', ev => {
  if (S.mode !== 'study' || /input|textarea/i.test(ev.target.tagName)) return;
  if (ev.key === 'ArrowRight') { stopAuto(); gotoStep(S.study.step + 1, true); ev.preventDefault(); }
  if (ev.key === 'ArrowLeft') { stopAuto(); gotoStep(S.study.step - 1); ev.preventDefault(); }
});

/* ---------- Buttons ---------- */
$('hint').onclick = () => {
  if (!S.analysis) return;
  const d = describeMove(S.analysis.fen, S.analysis.move);
  if (!d) return;
  S.hint++;
  if (S.hint === 1) {
    const idea = d.r.captured ? ' Il y a quelque chose à prendre.' : d.san.includes('+') ? ' Pense aux échecs.' : '';
    showBubble(`<p class="say">Regarde ${ton(d.r.piece)} en ${d.r.from}.${idea}</p><p class="tip">Toujours bloqué ? Clique encore sur <b>Indice</b> pour voir le coup.</p>`);
    select(d.r.from);
  } else {
    showBubble(`<p class="say">Je jouerais <em>${fr(d.san)}</em>. Essaie de comprendre pourquoi avant de le jouer.</p>`);
    S.arrows = [{ from: d.r.from, to: d.r.to, color: ARROW.move }];
  }
  render();
};
$('undo').onclick = () => {
  if (S.busy || !S.entries.length) return;
  S.token++;
  const e = S.entries.pop();
  while (S.game.history().length > e.ply) S.game.undo();
  for (const k of Object.keys(S.notes)) if (+k >= e.ply) delete S.notes[k];
  S.over = false; S.arrows = []; S.focus = []; S.analysis = null; S.pending = null; S.guideDone = false; S.bb = null;
  showBubble(`<p class="say">${['blund', 'mist'].includes(e.cat) ? 'D\'accord, on reprend. Mais en tournoi, pièce touchée, pièce jouée. Retiens-le.' : 'On reprend. Ce coup-là n\'était pourtant pas si mal.'}</p>`);
  const gt = guideTipHtml(); if (gt) $('bubble').insertAdjacentHTML('beforeend', `<p class="tip">${gt}</p>`);
  nextTurn();
};
$('flip').onclick = () => { S.flipped = !S.flipped; render(); if (S.analysis) setEval(S.user === 'w' ? S.analysis.score : -S.analysis.score); };
$('new').onclick = () => { S.guide = null; newGame(); };
document.querySelectorAll('[data-mode]').forEach(b => b.onclick = () => setMode(b.dataset.mode));
document.querySelectorAll('[data-col]').forEach(b => b.onclick = () => {
  S.user = b.dataset.col; S.guide = null;
  document.querySelectorAll('[data-col]').forEach(x => x.setAttribute('aria-pressed', x === b));
  newGame();
});
document.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => {
  S.level = b.dataset.lvl;
  document.querySelectorAll('[data-lvl]').forEach(x => x.setAttribute('aria-pressed', x === b));
  if (!S.game.history().length) welcome();
  render();
});

/*MODULES*/

function newGame(keepGuide) {
  S.token++;
  if (!keepGuide) S.guide = null;
  S.guideDone = false;
  S.game = new Chess(); S.notes = {}; S.entries = []; S.analysis = null; S.pending = null;
  S.sel = null; S.targets = []; S.arrows = []; S.focus = []; S.over = false; S.flipped = false; S.busy = false; S.thinking = ''; S.bb = null;
  setEval(0);
  welcome();
  nextTurn();
}
function boot(data) {
  if (data && data.pgn !== undefined) {
    S.user = data.user || 'w'; S.level = data.level || 'club';
    S.guide = data.guide ? byId(data.guide) : null;
    S.game = new Chess(); if (data.pgn) S.game.load_pgn(data.pgn);
    S.notes = data.notes || {}; S.entries = data.entries || [];
    if (data.study && byId(data.study.id)) { S.study.o = byId(data.study.id); S.study.step = data.study.step || 0; }
    document.querySelectorAll('[data-col]').forEach(x => x.setAttribute('aria-pressed', x.dataset.col === S.user));
    document.querySelectorAll('[data-lvl]').forEach(x => x.setAttribute('aria-pressed', x.dataset.lvl === S.level));
    const last = S.entries[S.entries.length - 1];
    if (last) renderEntry(last); else welcome();
    setMode(data.mode === 'study' ? 'study' : 'play');
    nextTurn();
  } else { newGame(); renderOList(); }
}
try { window.claude && window.claude.hot && window.claude.hot.snapshot && window.claude.hot.snapshot(() => ({ pgn: S.game.pgn(), user: S.user, level: S.level, notes: S.notes, entries: S.entries, guide: S.guide && S.guide.id, mode: S.mode, study: { id: S.study.o.id, step: S.study.step } })); } catch (e) {}
const hot = window.claude && window.claude.hot;
hot && hot.ready ? hot.ready(boot) : boot(hot && hot.data ? hot.data : {});
})();
