/* ENGINE-START */
const Engine = (() => {
  const OFF = 7, P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
  const VAL = [0, 100, 320, 330, 500, 900, 0];
  const PST = [null,
    [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
    [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
    [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
    [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
    [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
    [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20]
  ];
  const KEND = [-50,-40,-30,-20,-20,-30,-40,-50, -30,-20,-10,0,0,-10,-20,-30, -30,-10,20,30,30,20,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,30,40,40,30,-10,-30, -30,-10,20,30,30,20,-10,-30, -30,-30,0,0,0,0,-30,-30, -50,-30,-30,-30,-30,-30,-30,-50];
  const NO = [-21,-19,-12,-8,8,12,19,21], BO = [-11,-9,9,11], RO = [-10,-1,1,10], KO = [-11,-10,-9,-1,1,9,10,11];
  const MATE = 100000;
  const SQ64 = new Int8Array(120).fill(-1);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) SQ64[21 + c + r * 10] = r * 8 + c;
  const CMASK = new Uint8Array(120).fill(15);
  // castle bits: 1 = white O-O, 2 = white O-O-O, 4 = black O-O, 8 = black O-O-O
  CMASK[95] = 12; CMASK[98] = 14; CMASK[91] = 13; CMASK[25] = 3; CMASK[28] = 11; CMASK[21] = 7;

  const bd = new Int8Array(120);
  let side = 0, castle = 0, ep = 0;
  const kings = [0, 0];
  const stack = [];

  const name = s => 'abcdefgh'[(s - 21) % 10] + (8 - Math.floor((s - 21) / 10));
  const parse = n => 21 + (n.charCodeAt(0) - 97) + (8 - +n[1]) * 10;

  function load(fen) {
    bd.fill(OFF);
    for (let i = 0; i < 64; i++) bd[21 + (i % 8) + Math.floor(i / 8) * 10] = 0;
    const [pos, s, c, e] = fen.split(' ');
    let r = 0, col = 0;
    for (const ch of pos) {
      if (ch === '/') { r++; col = 0; continue; }
      if (ch >= '1' && ch <= '8') { col += +ch; continue; }
      const t = ' pnbrqk'.indexOf(ch.toLowerCase());
      const white = ch !== ch.toLowerCase();
      const sq = 21 + col + r * 10;
      bd[sq] = t | (white ? 0 : 8);
      if (t === K) kings[white ? 0 : 1] = sq;
      col++;
    }
    side = s === 'w' ? 0 : 1;
    castle = (c.includes('K') ? 1 : 0) | (c.includes('Q') ? 2 : 0) | (c.includes('k') ? 4 : 0) | (c.includes('q') ? 8 : 0);
    ep = e && e !== '-' ? parse(e) : 0;
    stack.length = 0;
  }

  function attacked(sq, by) {
    const c = by * 8;
    if (by === 0) { if (bd[sq + 9] === P || bd[sq + 11] === P) return true; }
    else { if (bd[sq - 9] === (P | 8) || bd[sq - 11] === (P | 8)) return true; }
    for (const o of NO) if (bd[sq + o] === (N | c)) return true;
    for (const o of KO) if (bd[sq + o] === (K | c)) return true;
    for (const o of BO) { let t = sq + o; while (bd[t] === 0) t += o; if (bd[t] === (B | c) || bd[t] === (Q | c)) return true; }
    for (const o of RO) { let t = sq + o; while (bd[t] === 0) t += o; if (bd[t] === (R | c) || bd[t] === (Q | c)) return true; }
    return false;
  }
  const inCheck = () => attacked(kings[side], side ^ 1);

  function gen(capsOnly) {
    const out = [], me = side * 8;
    const add = (f, t, fl, pr) => out.push({ f, t, cap: bd[t] & 7, fl: fl || 0, pr: pr || 0 });
    for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
      const sq = 21 + c + r * 10, p = bd[sq];
      if (!p || (p & 8) !== me) continue;
      const t = p & 7;
      if (t === P) {
        const d = side === 0 ? -10 : 10, promoRow = side === 0 ? 1 : 6, startRow = side === 0 ? 6 : 1;
        const pushPromo = (to, cap) => { for (const pr of [Q, N, R, B]) add(sq, to, cap ? 0 : 0, pr); };
        if (bd[sq + d] === 0) {
          if (r === promoRow) pushPromo(sq + d); else if (!capsOnly) {
            add(sq, sq + d);
            if (r === startRow && bd[sq + 2 * d] === 0) add(sq, sq + 2 * d, 1);
          }
        }
        for (const x of [d - 1, d + 1]) {
          const to = sq + x, q = bd[to];
          if (q && q !== OFF && (q & 8) !== me) { if (r === promoRow) pushPromo(to, 1); else add(sq, to); }
          else if (to === ep && ep) out.push({ f: sq, t: to, cap: P, fl: 2, pr: 0 });
        }
        continue;
      }
      const offs = t === N ? NO : t === B ? BO : t === R ? RO : KO;
      const slide = t === B || t === R || t === Q;
      for (const o of offs) {
        let to = sq + o;
        while (true) {
          const q = bd[to];
          if (q === OFF) break;
          if (q) { if ((q & 8) !== me) add(sq, to); break; }
          if (!capsOnly) add(sq, to);
          if (!slide) break;
          to += o;
        }
      }
    }
    if (!capsOnly) {
      const opp = side ^ 1;
      if (side === 0) {
        if ((castle & 1) && !bd[96] && !bd[97] && bd[98] === R && !attacked(95, opp) && !attacked(96, opp) && !attacked(97, opp)) add(95, 97, 3);
        if ((castle & 2) && !bd[94] && !bd[93] && !bd[92] && bd[91] === R && !attacked(95, opp) && !attacked(94, opp) && !attacked(93, opp)) add(95, 93, 3);
      } else {
        if ((castle & 4) && !bd[26] && !bd[27] && bd[28] === (R | 8) && !attacked(25, opp) && !attacked(26, opp) && !attacked(27, opp)) add(25, 27, 3);
        if ((castle & 8) && !bd[24] && !bd[23] && !bd[22] && bd[21] === (R | 8) && !attacked(25, opp) && !attacked(24, opp) && !attacked(23, opp)) add(25, 23, 3);
      }
    }
    return out;
  }

  function make(m) {
    const p = bd[m.f];
    stack.push({ m, captured: bd[m.t], castle, ep, p });
    bd[m.t] = m.pr ? (m.pr | (side * 8)) : p;
    bd[m.f] = 0;
    if (m.fl === 2) bd[m.t + (side === 0 ? 10 : -10)] = 0;
    if (m.fl === 3) {
      if (m.t === 97) { bd[96] = R; bd[98] = 0; } else if (m.t === 93) { bd[94] = R; bd[91] = 0; }
      else if (m.t === 27) { bd[26] = R | 8; bd[28] = 0; } else if (m.t === 23) { bd[24] = R | 8; bd[21] = 0; }
    }
    if ((p & 7) === K) kings[side] = m.t;
    castle &= CMASK[m.f] & CMASK[m.t];
    ep = m.fl === 1 ? (m.f + m.t) >> 1 : 0;
    side ^= 1;
    if (attacked(kings[side ^ 1], side)) { unmake(); return false; }
    return true;
  }
  function unmake() {
    const u = stack.pop(), m = u.m;
    side ^= 1;
    bd[m.f] = u.p; bd[m.t] = u.captured;
    if (m.fl === 2) bd[m.t + (side === 0 ? 10 : -10)] = P | ((side ^ 1) * 8);
    if (m.fl === 3) {
      if (m.t === 97) { bd[98] = R; bd[96] = 0; } else if (m.t === 93) { bd[91] = R; bd[94] = 0; }
      else if (m.t === 27) { bd[28] = R | 8; bd[26] = 0; } else if (m.t === 23) { bd[21] = R | 8; bd[24] = 0; }
    }
    if ((u.p & 7) === K) kings[side] = m.f;
    castle = u.castle; ep = u.ep;
  }

  function evaluate() {
    let s = 0, np = 0;
    for (let i = 21; i < 99; i++) { const p = bd[i]; if (p && p !== OFF) { const t = p & 7; if (t !== P && t !== K) np += VAL[t]; } }
    const end = np <= 2600;
    for (let i = 21; i < 99; i++) {
      const p = bd[i]; if (!p || p === OFF) continue;
      const t = p & 7, s64 = SQ64[i];
      const white = !(p & 8);
      const idx = white ? s64 : (7 - (s64 >> 3)) * 8 + (s64 & 7);
      const v = VAL[t] + (t === K && end ? KEND[idx] : PST[t][idx]);
      s += white ? v : -v;
    }
    return side === 0 ? s : -s;
  }

  let nodes = 0, deadline = 0, aborted = false;
  const killers = [];
  function order(ms, first, ply) {
    const k = killers[ply];
    for (const m of ms) {
      let v = 0;
      if (m.cap) v = 10000 + 10 * VAL[m.cap] - VAL[bd[m.f] & 7];
      if (m.pr) v += 9000 + VAL[m.pr];
      if (k && k.f === m.f && k.t === m.t) v += 5000;
      if (first && first.f === m.f && first.t === m.t && first.pr === m.pr) v += 1e6;
      m.k = v;
    }
    return ms.sort((a, b) => b.k - a.k);
  }
  function tick() { if ((++nodes & 2047) === 0 && Date.now() > deadline) aborted = true; }

  function quiesce(alpha, beta, qd) {
    tick();
    const stand = evaluate();
    if (stand >= beta) return beta;
    if (stand > alpha) alpha = stand;
    if (qd > 6 || aborted) return alpha;
    for (const m of order(gen(true), null, 60)) {
      if (!make(m)) continue;
      const sc = -quiesce(-beta, -alpha, qd + 1);
      unmake();
      if (aborted) return alpha;
      if (sc >= beta) return beta;
      if (sc > alpha) alpha = sc;
    }
    return alpha;
  }
  function negamax(depth, alpha, beta, ply) {
    tick();
    const check = inCheck();
    if (check) depth++;
    if (depth <= 0) {
      // quiescence, but detect mate/stalemate cheaply only when in check
      return quiesce(alpha, beta, 0);
    }
    let legal = 0, best = -Infinity;
    for (const m of order(gen(false), null, ply)) {
      if (!make(m)) continue;
      legal++;
      const sc = -negamax(depth - 1, -beta, -alpha, ply + 1);
      unmake();
      if (aborted) return best === -Infinity ? 0 : best;
      if (sc > best) best = sc;
      if (sc > alpha) alpha = sc;
      if (alpha >= beta) { if (!m.cap) killers[ply] = m; break; }
    }
    if (!legal) return check ? -MATE + ply : 0;
    return best;
  }

  const toObj = m => ({ from: name(m.f), to: name(m.t), promotion: m.pr ? ' pnbrqk'[m.pr] : undefined });

  function legalMoves() { return gen(false).filter(m => { if (!make(m)) return false; unmake(); return true; }); }

  // Best move with iterative deepening. noise: random centipawns added at root (weaker play)
  function best(fen, maxDepth, ms, noise) {
    load(fen);
    const moves = legalMoves();
    if (!moves.length) return null;
    nodes = 0; aborted = false; deadline = Date.now() + ms; killers.length = 0;
    let result = null, prev = null;
    for (let d = 1; d <= maxDepth; d++) {
      order(moves, prev, 0);
      let alpha = -Infinity, bm = null, bs = -Infinity;
      for (const m of moves) {
        make(m);
        let sc = -negamax(d - 1, -Infinity, noise ? Infinity : -alpha, 1);
        unmake();
        if (aborted) break;
        if (noise) sc += Math.round((Math.random() - 0.5) * 2 * noise);
        if (sc > bs) { bs = sc; bm = m; }
        if (sc > alpha) alpha = sc;
      }
      if (aborted && result) break;
      if (bm) { result = { move: toObj(bm), score: bs, depth: d }; prev = bm; }
      if (aborted || Math.abs(bs) > MATE - 200) break;
    }
    result.nodes = nodes;
    return result;
  }
  // Score (mover's perspective) of a specific move, searched to the same depth as best()
  function scoreMove(fen, mv, depth, ms) {
    load(fen);
    const m = legalMoves().find(x => name(x.f) === mv.from && name(x.t) === mv.to && (!x.pr || ' pnbrqk'[x.pr] === (mv.promotion || 'q')));
    if (!m) return null;
    nodes = 0; aborted = false; deadline = Date.now() + ms; killers.length = 0;
    make(m);
    return -negamax(depth - 1, -Infinity, Infinity, 1);
  }
  function staticEval(fen) { load(fen); return quiesce(-Infinity, Infinity, 0); }
  function perft(fen, d) {
    load(fen);
    const run = dd => { if (!dd) return 1; let n = 0; for (const m of gen(false)) { if (!make(m)) continue; n += run(dd - 1); unmake(); } return n; };
    return run(d);
  }
  return { best, scoreMove, staticEval, perft, MATE };
})();
/* ENGINE-END */
if (typeof module !== 'undefined') module.exports = Engine;
