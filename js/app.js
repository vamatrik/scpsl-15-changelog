/* SCP: SL 15.0 changelog terminal — vanilla JS, no build step. */
(() => {
'use strict';
const E = window.CL_ENTRIES, SECS = window.CL_SECTIONS, HUBS = window.CL_HUBS, ZONES = window.CL_ZONES;
const UI = window.CL_UI, CATS = window.CL_CATS;
const $ = s => document.querySelector(s);
const NS = 'http://www.w3.org/2000/svg';
const svgEl = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
const esc = s => s.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const isTouch = matchMedia('(pointer:coarse)').matches;

/* ---------------- state ---------------- */
const store = (() => { try { return JSON.parse(localStorage.getItem('scpsl15') || '{}'); } catch { return {}; } })();
const S = {
  lang: store.lang || ((navigator.language || '').startsWith('ru') ? 'ru' : 'en'),
  read: new Set(store.read || []), sound: store.sound !== false, follow: store.follow !== false && !isTouch,
  ap: 0, tier: 1, hub: null, booted: false, sens: +store.sens || 1
};
const save = () => { try { localStorage.setItem('scpsl15', JSON.stringify({ lang: S.lang, read: [...S.read], sound: S.sound, follow: S.follow, sens: S.sens })); } catch {} };
const T = k => UI[S.lang][k];

const secById = Object.fromEntries(SECS.map(s => [s.id, s]));
const hubBySec = {}; HUBS.forEach(h => h.secs.forEach(s => hubBySec[s] = h));
SECS.forEach(s => { if (!hubBySec[s.id]) console.warn('section without hub', s.id); });
const secEntries = s => { const out = []; s.ranges.forEach(([a, b]) => { for (let i = a; i <= b; i++) out.push(i); }); return out; };
SECS.forEach(s => { s.nums = secEntries(s); s.count = s.nums.filter(n => E[n].k === 'b' && E[n].lv === 0).length; });
const zoneById = Object.fromEntries(ZONES.map(z => [z.id, z]));

/* ---------------- sound ---------------- */
let ac = null;
const audio = () => { if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch {} } return ac; };
function beep(f = 880, d = .05, type = 'square', v = .03, f2) {
  if (!S.sound) return; const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t = a.currentTime;
  o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + d + .02);
}
const sfx = {
  hover: () => beep(2200, .018, 'square', .012),
  click: () => beep(660, .06, 'square', .03, 990),
  open: () => { beep(440, .08, 'sawtooth', .025, 880); setTimeout(() => beep(1320, .07, 'square', .02), 70); },
  close: () => beep(700, .08, 'triangle', .03, 300),
  tier: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, .14, 'square', .03), i * 110)),
  deny: () => beep(180, .18, 'sawtooth', .035, 120),
  type: () => beep(1500 + Math.random() * 400, .012, 'square', .008)
};

/* ---------------- map: real facility layout (14.2.7 room tiles, redesigned) ---------------- */
const P = 172, TILE = 120, M = 220;
const LAYOUT = window.CL_LAYOUT;
const TEXFILE = {
  LczCurve:'LCZ_Curve',LczStraight:'LCZ_Straight',LczCross:'LCZ_Crossing',LczThreeWay:'LCZ_ThreeWay',Lcz330:'LCZ_330',Lcz914:'LCZ_914',LczAirlock:'LCZ_Airlock',LczArmory:'LCZ_Armory',
  LczCheckpointB:'LCZ_Checkpoint',LczCheckpointA:'LCZ_Checkpoint',LczClassDSpawn:'LCZ_Long',LczToilets:'LCZ_Toilets',LczComputerRoom:'LCZ_PC15',LczGlassroom:'LCZ_PC15',Lcz173:'LCZ_LargeEnd',LczGreenhouse:'LCZ_Wide',
  HczCurve:'HCZ_Curve',HczStraight:'HCZ_Straight',HczCross:'HCZ_Crossing',HczThreeWay:'HCZ_ThreeWay',HczCheckpointA:'HCZ_Elevators',HczCheckpointB:'HCZ_Elevators',HczWarhead:'HCZ_Nuke',HczServers:'HCZ_ServerRoom',
  Hcz939:'HCZ_939',HczTestroom:'HCZ_Testroom',HczTesla:'HCZ_Tesla',HczAcroamaticAbatement:'HCZ_CrossingWater',Hcz106:'HCZ_EndLarge',HczRampTunnel:'HCZ_ThreeWay',Hcz096:'HCZ_EndSmall',HczArmory:'HCZ_Armory',
  Hcz049:'HCZ_049',HczWaysideIncinerator:'HCZ_Wayside',Hcz079:'HCZ_EndLarge',Hcz127:'HCZ_127',HczMicroHID:'HCZ_Hid',HczCheckpointToEntranceZone:'HCZ_Tesla',HCZ_JunkMain:'HCZ_ThreeWayJunk',HCZ_PipesMain:'HCZ_Straight_Pipe',HCZ_FunnyCorridor:'HCZ_Straight',
  EzCurve:'EZ_Curve',EzStraight:'EZ_Straight',EzCross:'EZ_Crossing',EzThreeWay:'EZ_ThreeWay',EzEvacShelter:'EZ_NonGateEnd',EzGateA:'EZ_GateA',EzGateB:'EZ_GateB',EzRedRoom:'EZ_NonGateEnd',EzRedroom:'EZ_NonGateEnd',
  EzOfficeSmall:'EZ_Asymmetric',EzOfficeLarge:'EZ_Thicc',EzOfficeStoried:'EZ_Thicc',EzCollapsedTunnel:'EZ_Collapsed',EzIntercom:'EZ_Intercom',EzCheckpoint:'EZ_Checkpoint'
};
const ALIAS = {
  Lcz330:['SCP-330','SCP-330'],LczCheckpointA:['Лифты A','Elevators A'],LczCheckpointB:['Лифты B','Elevators B'],LczClassDSpawn:['Блок D','Class-D cells'],Lcz914:['SCP-914','SCP-914'],LczToilets:['Туалеты','Toilets'],
  LczComputerRoom:['PC-15','PC-15'],LczArmory:['Оружейная','Armory'],LczAirlock:['Шлюз','Airlock'],LczGlassroom:['GR-18','GR-18'],Lcz173:['PT-00','PT-00'],LczGreenhouse:['VT-00','VT-00'],
  HczCheckpointA:['Лифты A','Elevators A'],HczCheckpointB:['Лифты B','Elevators B'],HczWarhead:['Боеголовка','Warhead'],HczServers:['Серверная','Servers'],Hcz939:['SCP-939','SCP-939'],HczTestroom:['Тестовая','Test room'],
  HczTesla:['Тесла','Tesla'],HczAcroamaticAbatement:['Водопад','Waterfall'],Hcz106:['SCP-106','SCP-106'],HczRampTunnel:['Рампа','Ramp'],Hcz096:['SCP-096','SCP-096'],HczArmory:['Оружейная','Armory'],
  Hcz049:['SCP-049','SCP-049'],HczWaysideIncinerator:['Мусоросжигатель','Incinerator'],Hcz079:['SCP-079','SCP-079'],Hcz127:['SCP-127','SCP-127'],HczMicroHID:['Micro-HID','Micro-HID'],
  HczCheckpointToEntranceZone:['КПП','Checkpoint'],EzCheckpoint:['КПП','Checkpoint'],EzEvacShelter:['Убежище','Evac shelter'],EzGateA:['Ворота А','Gate A'],EzGateB:['Ворота Б','Gate B'],EzRedroom:['Красная комната','Red room'],
  EzOfficeSmall:['Офис (−1 эт.)','Lower office'],EzOfficeLarge:['Компьютерная','Large office'],EzOfficeStoried:['2-эт. офис','Storied office'],EzCollapsedTunnel:['Обвал','Collapsed tunnel'],EzIntercom:['Интерком','Intercom']
};
const HUB_ROOM = { c079:'Hcz079', c096:'Hcz096', c106:'Hcz106', c049:'Hcz049', c939:'Hcz939', c127:'Hcz127', microhid:'HczMicroHID', silo:'HczWarhead', servers:'HczServers', 'scp-common':'HczTestroom', 'hcz-rooms':'HczRampTunnel',
  'ez-gates':'EzGateA', intercom:'EzIntercom', 'ui-room':'EzOfficeLarge', 'ez-offices':'EzOfficeStoried', 'ez-maint':'EzCollapsedTunnel', 'signal-953':'EzRedroom',
  c914:'Lcz914', pt00:'Lcz173', vt01:'LczGreenhouse', armory:'LczArmory', dcells:'LczClassDSpawn', lockers:'LczComputerRoom', elevc:'LczCheckpointA' };
const ZOFF = { ez: [0, -130], hcz: [0, 40], lcz: [240, 40] };
LAYOUT.forEach(r => { const o = ZOFF[r.z]; r.x = M + r.c * P + P / 2 + o[0]; r.y = M + 230 + r.r * P + P / 2 + o[1]; });
const ZB = {};
const bbox = (pts, pad) => ({ x0: Math.min(...pts.map(p => p[0])) - pad, y0: Math.min(...pts.map(p => p[1])) - pad, x1: Math.max(...pts.map(p => p[0])) + pad, y1: Math.max(...pts.map(p => p[1])) + pad });
['ez', 'hcz', 'lcz'].forEach(z => ZB[z] = bbox(LAYOUT.filter(r => r.z === z).map(r => [r.x, r.y]), P / 2 + 22));
const roomBy = name => LAYOUT.find(r => r.name === name);
// Surface band above Entrance Zone, aligned to the two gates
const gA = roomBy('EzGateA'), gB = roomBy('EzGateB');
const SURF_Y = ZB.ez.y0 - 150;
const SURF = { 'gate-a': [gA.x, SURF_Y], 'gate-b': [gB.x, SURF_Y], fence: [gA.x - 1.6 * P, SURF_Y - 20], 'surface-yard': [(gA.x + gB.x) / 2, SURF_Y - 60], cassie: [gB.x + 1.7 * P, SURF_Y - 30] };
ZB.surface = bbox(Object.values(SURF), 110); ZB.surface.x0 = Math.min(ZB.surface.x0, ZB.ez.x0); ZB.surface.x1 = Math.max(ZB.surface.x1, gB.x + 2.6 * P);
const WORLD = { w: Math.max(...Object.values(ZB).map(b => b.x1)) + M, h: Math.max(...Object.values(ZB).map(b => b.y1)) + M };
const zoneAt = (x, y) => ZONES.find(z => { const b = ZB[z.id]; return x >= b.x0 - 60 && x <= b.x1 + 60 && y >= b.y0 - 60 && y <= b.y1 + 60; });

const ICONS = {
  gate:'M3 21V7l9-4 9 4v14M7 21v-8h10v8M7 17h10', wire:'M2 8l3 3 3-3 3 3 3-3 3 3 3-3 3 3M2 16l3 3 3-3 3 3 3-3 3 3 3-3 3 3M6 4v16M18 4v16',
  snow:'M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 3 3-3M9 20l3-3 3 3', speaker:'M4 9h4l5-4v14l-5-4H4zM16 9c1.5 1.5 1.5 4.5 0 6M18.5 6.5c3 3 3 8 0 11',
  gen:'M4 4h16v16H4zM13 7l-4 6h6l-4 6', phone:'M6 3h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2',
  unknown:'M8 8.5a4 4 0 1 1 6 3.5c-1.3.8-2 1.5-2 3M12 19v.5', monitor:'M3 4h18v12H3zM8 20h8M12 16v4M7 8l2 2-2 2M11 12h5',
  glass:'M4 4h16v16H4zM4 12l6-3 3 4 7-5M10 9l1 11', wrench:'M15 4a5 5 0 0 0-5 6l-7 7 4 4 7-7a5 5 0 0 0 6-5l-3 3-3-1-1-3z',
  camera:'M3 7h12v10H3zM15 10l6-3v10l-6-3M7 11h.01', nuke:'M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4M11 10L8 4.8A8 8 0 0 0 4 12h6M14 12h6a8 8 0 0 0-4-7.2L13 10M13 13.8l3 5.2a8 8 0 0 1-8 0l3-5.2',
  server:'M4 3h16v5H4zM4 10h16v5H4zM4 17h16v4H4zM7 5.5h.01M7 12.5h.01M7 19h.01', eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  cry:'M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z', drip:'M3 4h18M7 4v5a2 2 0 0 0 4 0V4M15 4v9a2 2 0 0 0 4 0V4M7 15v2M11 13v4',
  bolt:'M13 2L4 14h7l-1 8 9-12h-7z', mask:'M5 8a7 7 0 0 1 14 0v2l-7 11-7-11zM9 9h.01M15 9h.01',
  wave:'M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M2 17c2-3 4-3 6 0s4 3 6 0 4-3 6 0M2 7c2-3 4-3 6 0s4 3 6 0 4-3 6 0', gun:'M3 8h16l2 2v2h-6l-2 3h-3l1-3H8l-2 7H3l2-7H3z',
  stairs:'M3 20h5v-5h5v-5h5V5h3', gear:'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9L7 7M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  desk:'M2 9h20M4 9v11M20 9v11M14 9v6h6M8 5h6v4', statue:'M9 3h6v4H9zM8 7h8l-1 7H9zM9 14l-1 7h8l-1-7',
  plant:'M12 21V10M12 10C12 6 9 4 5 4c0 4 3 6 7 6zM12 14c0-4 3-6 7-6 0 4-3 6-7 6M7 21h10', card:'M3 6h18v12H3zM3 10h18M6 15h5',
  door:'M5 21V3h14v18M3 21h18M14 12h.01', elevator:'M5 3h14v18H5zM12 3v18M7 11l1.5-2 1.5 2M14 9l1.5 2 1.5-2'
};
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

const world = $('#world'), cam = $('#cam'), svg = $('#map');
const hubEls = {};
function buildMap() {
  $('#defs').innerHTML = '<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>' +
    '<pattern id="hatch" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0v10" stroke="rgba(156,201,255,.08)" stroke-width="3"/></pattern>';
  const gFr = svgEl('g', {}, world), gLinks = svgEl('g', {}, world), gCon = svgEl('g', {}, world), gRooms = svgEl('g', {}, world), gLab = svgEl('g', { class: 'rlabels' }, world), gHubs = svgEl('g', {}, world);
  // zone frames
  ZONES.forEach(z => {
    const b = ZB[z.id], col = z.color, g = svgEl('g', {}, gFr);
    svgEl('rect', { x: b.x0, y: b.y0, width: b.x1 - b.x0, height: b.y1 - b.y0, class: 'zone-frame', stroke: col, 'stroke-opacity': .3, fill: z.id === 'surface' ? 'url(#hatch)' : 'rgba(111,211,255,.012)' }, g);
    [[b.x0, b.y0, 1, 1], [b.x1, b.y0, -1, 1], [b.x0, b.y1, 1, -1], [b.x1, b.y1, -1, -1]].forEach(([x, y, sx, sy]) =>
      svgEl('path', { d: `M${x} ${y + 30 * sy}V${y}H${x + 30 * sx}`, stroke: col, 'stroke-width': 3, fill: 'none' }, g));
    const t1 = svgEl('text', { x: b.x0 + 16, y: b.y0 - 14, class: 'zone-label', fill: col }, g); t1.textContent = z.short;
    const t2 = svgEl('text', { x: b.x0 + 16 + z.short.length * 22 + 14, y: b.y0 - 16, class: 'zone-label-sub' }, g); t2.dataset.zn = z.id;
  });
  // surface: roads + snow
  const sb = ZB.surface;
  [gA, gB].forEach(gr => svgEl('path', { d: `M${gr.x} ${SURF_Y + 40}V${ZB.ez.y0 + 10}`, class: 'road' }, gFr));
  svgEl('path', { d: `M${sb.x0 + 30} ${SURF_Y + 70}H${sb.x1 - 30}`, class: 'road' }, gFr);
  svgEl('path', { d: `M${sb.x0 + 20} ${sb.y0 + 22}H${sb.x1 - 20}`, class: 'fence-line' }, gFr);
  const R = rng(99), gs = svgEl('g', {}, gFr);
  for (let i = 0; i < 110; i++) {
    const c = svgEl('circle', { cx: sb.x0 + R() * (sb.x1 - sb.x0), cy: sb.y0 + 4, r: .8 + R() * 1.8, class: 'snow' }, gs);
    c.style.animation = `snow${i % 3} ${6 + R() * 6}s linear ${-R() * 10}s infinite`;
  }
  const st = document.createElement('style');
  st.textContent = [0, 1, 2].map(i => `@keyframes snow${i}{to{transform:translate(${(i - 1) * 40}px,${sb.y1 - sb.y0 - 8}px);opacity:0}}`).join('');
  document.head.appendChild(st);

  // connectors between neighbouring rooms (same zone, matching doors)
  const at = {}; LAYOUT.forEach(r => at[r.z + ':' + r.c + ',' + r.r] = r);
  LAYOUT.forEach(r => {
    const col = zoneById[r.z].color;
    [[1, 1, 0, 3], [2, 0, 1, 0]].forEach(([d, dc, dr, od]) => {
      if (!r.doors.includes(d)) return;
      const n = at[r.z + ':' + (r.c + dc) + ',' + (r.r + dr)]; if (!n || !n.doors.includes(od)) return;
      const x1 = r.x + dc * TILE / 2, y1 = r.y + dr * TILE / 2, x2 = n.x - dc * TILE / 2, y2 = n.y - dr * TILE / 2;
      svgEl('line', { x1, y1, x2, y2, stroke: col, 'stroke-opacity': .22, 'stroke-width': 24 }, gCon);
      const ox = dr * 12, oy = dc * 12;
      svgEl('path', { d: `M${x1 - ox} ${y1 - oy}L${x2 - ox} ${y2 - oy}M${x1 + ox} ${y1 + oy}L${x2 + ox} ${y2 + oy}`, stroke: col, 'stroke-width': 1.6, fill: 'none' }, gCon);
    });
  });
  // inter-zone links
  const pairs = [];
  const nearest = (a, list) => list.reduce((b, x) => (!b || Math.hypot(x.x - a.x, x.y - a.y) < Math.hypot(b.x - a.x, b.y - a.y)) ? x : b, null);
  const hk = LAYOUT.filter(r => r.z === 'hcz' && r.name === 'HczCheckpointToEntranceZone'), ek = LAYOUT.filter(r => r.z === 'ez' && r.name === 'EzCheckpoint');
  hk.forEach(h => pairs.push([h, nearest(h, ek), 'CHECKPOINT']));
  ['A', 'B'].forEach(k => pairs.push([roomBy('HczCheckpoint' + k), roomBy('LczCheckpoint' + k), 'ELEVATOR ' + k]));
  pairs.push([gA, { x: SURF['gate-a'][0], y: SURF['gate-a'][1] }, 'GATE A'], [gB, { x: SURF['gate-b'][0], y: SURF['gate-b'][1] }, 'GATE B']);
  pairs.forEach(([a, b, label]) => {
    if (!a || !b) return;
    const dx = b.x - a.x, dy = b.y - a.y, k = Math.abs(dx) > Math.abs(dy);
    const d = k ? `M${a.x} ${a.y}C${a.x + dx * .5} ${a.y},${b.x - dx * .5} ${b.y},${b.x} ${b.y}` : `M${a.x} ${a.y}C${a.x} ${a.y + dy * .5},${b.x} ${b.y - dy * .5},${b.x} ${b.y}`;
    svgEl('path', { d, class: 'link-v', stroke: '#cfe3ea' }, gLinks);
    const t = svgEl('text', { x: (a.x + b.x) / 2 + 10, y: (a.y + b.y) / 2 - 8, class: 'link-label' }, gLinks); t.textContent = label;
  });
  // rooms
  const hubRoom = {}; Object.entries(HUB_ROOM).forEach(([h, n]) => hubRoom[n] = h);
  LAYOUT.forEach(r => {
    const f = TEXFILE[r.key]; if (!f) return;
    const g = svgEl('g', { class: 'room-t' + (ALIAS[r.name] ? ' named' : ''), transform: `translate(${r.x} ${r.y})` }, gRooms);
    if (ALIAS[r.name]) g.dataset.room = r.name;
    svgEl('image', { href: 'img/rooms/' + f + '.png', x: -TILE / 2, y: -TILE / 2, width: TILE, height: TILE, transform: `rotate(${r.rot})`, preserveAspectRatio: 'none' }, g);
    if (ALIAS[r.name] && !hubRoom[r.name]) {
      const t = svgEl('text', { x: r.x, y: r.y + 4, class: 'rlabel', 'text-anchor': 'middle' }, gLab); t.dataset.alias = r.name;
    }
  });
  // hubs
  HUBS.forEach(h => {
    const z = zoneById[h.zone];
    let x, y;
    if (h.zone === 'surface') [x, y] = SURF[h.id];
    else { const r = roomBy(HUB_ROOM[h.id]); if (!r) { console.warn('no room for hub', h.id); return; } x = r.x; y = r.y; }
    h.x = x; h.y = y;
    const g = svgEl('g', { class: 'hub' + (h.zone === 'surface' ? ' surf' : ''), transform: `translate(${x} ${y})`, 'data-hub': h.id, tabindex: 0, role: 'button' }, gHubs);
    if (h.zone === 'surface') svgEl('rect', { x: -58, y: -40, width: 116, height: 80, class: 'bldg', stroke: z.color }, g);
    svgEl('rect', { x: -66, y: -66, width: 132, height: 132, class: 'hub-hit' }, g);
    svgEl('circle', { r: 34, class: 'hub-ring', stroke: z.color }, g);
    svgEl('circle', { r: 27, class: 'hub-bg', stroke: z.color }, g);
    svgEl('path', { d: ICONS[h.icon] || ICONS.door, class: 'hub-ico', stroke: z.color, transform: 'translate(-14.4 -14.4) scale(1.2)' }, g);
    const ck = svgEl('text', { x: 22, y: -20, class: 'hub-check' }, g); ck.textContent = '✔';
    const lb = svgEl('text', { x: 0, y: 72, class: 'hub-label', 'text-anchor': 'middle' }, g); lb.dataset.hl = h.id;
    hubEls[h.id] = g;
  });
}

/* ---------------- camera ---------------- */
const C = { x: 0, y: 0, z: .5, tx: 0, ty: 0, tz: .5, mx: 0, my: 0, fx: 0, fy: 0, rx: 0, ry: 0, W: innerWidth, H: innerHeight };
const panelW = () => (innerWidth > 820 && $('#dossier').classList.contains('open')) ? $('#dossier').offsetWidth + 16 : 0;
const dirW = () => (innerWidth > 820 && $('#dir').classList.contains('open')) ? $('#dir').offsetWidth + 16 : 0;
function fitBox(x0, y0, x1, y1, pad = 60) {
  const W = C.W - panelW() - dirW(), H = C.H - 120;
  const z = Math.min(W / (x1 - x0 + pad * 2), H / (y1 - y0 + pad * 2));
  C.tz = Math.max(.18, Math.min(2.6, z));
  C.tx = dirW() + W / 2 - (x0 + x1) / 2 * C.tz; C.ty = 60 + H / 2 - (y0 + y1) / 2 * C.tz;
}
const overview = () => fitBox(0, 0, WORLD.w, WORLD.h, 20);
function focusPoint(x, y, z) {
  C.tz = z; const W = C.W - panelW() - dirW();
  C.tx = dirW() + W / 2 - x * z; C.ty = (innerWidth > 820 ? C.H / 2 : C.H * .22) - y * z;
}
function focusZone(id) { const b = ZB[id]; fitBox(b.x0, b.y0 - 50, b.x1, b.y1, 20); setZoneTab(id); }
function clampCam() {
  // any point of the facility can be brought under the reticle / screen centre — no invisible walls
  const cx = dirW() + (C.W - panelW() - dirW()) / 2, cy = C.H / 2, b = Object.values(ZB);
  const x0 = Math.min(...b.map(v => v.x0)), x1 = Math.max(...b.map(v => v.x1)), y0 = Math.min(...b.map(v => v.y0)) - 60, y1 = Math.max(...b.map(v => v.y1));
  C.tx = Math.min(cx - x0 * C.tz, Math.max(cx - x1 * C.tz, C.tx));
  C.ty = Math.min(cy - y0 * C.tz, Math.max(cy - y1 * C.tz, C.ty));
}
function zoomAt(sx, sy, f) {
  const nz = Math.max(.18, Math.min(3, C.tz * f));
  const wx = (sx - C.tx) / C.tz, wy = (sy - C.ty) / C.tz;
  C.tz = nz; C.tx = sx - wx * nz; C.ty = sy - wy * nz;
}
const tilt = $('#tilt');
let lastT = performance.now(), lastZoneShown = '';
function frame(t) {
  const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
  const k = 1 - Math.pow(.0015, dt);
  C.z += (C.tz - C.z) * k; C.x += (C.tx - C.x) * k; C.y += (C.ty - C.y) * k;
  svg.classList.toggle('lod', C.z > .62);
  cam.setAttribute('transform', `translate(${C.x.toFixed(2)} ${C.y.toFixed(2)}) scale(${C.z.toFixed(4)})`);
  // HUD: AP regen
  const maxAP = [100, 120, 140, 160, 200][S.tier - 1];
  if (S.booted && S.ap < maxAP) { S.ap = Math.min(maxAP, S.ap + maxAP / 40 * dt); hudAP(); }
  // coords
  const wx = (C.W / 2 - C.x) / C.z, wy = (C.H / 2 - C.y) / C.z;
  const zn = zoneAt(wx, wy);
  if (zn && zn.id !== lastZoneShown) { lastZoneShown = zn.id; setZoneTab(zn.id, true); }
  $('#coords').innerHTML = `CAM <b>${zn ? zn.short : '--'}-${String(Math.abs(Math.round(wx / 10)) % 1000).padStart(3, '0')}</b> · X ${Math.round(wx)} · Y ${Math.round(wy)} · ZOOM ${C.z.toFixed(2)}x`;
  requestAnimationFrame(frame);
}

/* ---------------- pointer: 079-style 1:1 mouse look / drag / pinch / hover ---------------- */
const stage = $('#stage'), tip = $('#tip');
const ret = document.createElement('div'); ret.id = 'reticle'; document.body.appendChild(ret);
const drag = { on: false, moved: 0, sx: 0, sy: 0, hub: null, ptrs: new Map(), pinch: 0 };
const P0 = { x: innerWidth / 2, y: innerHeight / 2, over: false };
let locked = false;
const lockCenter = () => [dirW() + (C.W - panelW() - dirW()) / 2, C.H / 2];
const retXY = () => locked ? lockCenter() : [P0.x, P0.y];
function placeReticle() {
  const [x, y] = retXY();
  ret.style.transform = `translate(${x}px,${y}px)`;
  ret.classList.toggle('show', S.follow && !isTouch && (locked || P0.over));
}
const canLock = () => S.follow && !isTouch && !!stage.requestPointerLock;
function lockOn() { if (!canLock() || locked) return; try { const p = stage.requestPointerLock(); if (p && p.catch) p.catch(() => {}); } catch {} }
function lockOff() { if (locked) document.exitPointerLock(); }
document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === stage;
  document.body.classList.toggle('locked', locked);
  if (locked && !S.lockHinted) { S.lockHinted = true; toast(T('lockHint')); }
  placeReticle(); hoverPoint();
});
function underReticle() { const [x, y] = retXY(); const el = document.elementFromPoint(x, y); return el && stage.contains(el) ? el : null; }
stage.addEventListener('pointerdown', e => {
  if (locked) {
    const el = underReticle(), h = el && el.closest('.hub');
    if (h) { lockOff(); openHub(h.dataset.hub); } else sfx.click();
    return;
  }
  drag.ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  stage.setPointerCapture(e.pointerId);
  if (drag.ptrs.size === 2) { const [a, b] = [...drag.ptrs.values()]; drag.pinch = Math.hypot(a[0] - b[0], a[1] - b[1]); return; }
  drag.on = true; drag.moved = 0; drag.sx = e.clientX; drag.sy = e.clientY;
  drag.hub = e.target.closest && e.target.closest('.hub');
});
stage.addEventListener('pointermove', e => {
  if (locked) {
    // the map moves exactly as far as the mouse does — like SCP-079's map
    const dx = (e.movementX || 0) * S.sens, dy = (e.movementY || 0) * S.sens;
    C.tx -= dx; C.ty -= dy; C.x -= dx; C.y -= dy; clampCam(); C.x = C.tx; C.y = C.ty;
    hoverPoint(); return;
  }
  P0.x = e.clientX; P0.y = e.clientY; P0.over = true; placeReticle();
  if (drag.ptrs.has(e.pointerId)) {
    const prev = drag.ptrs.get(e.pointerId); drag.ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (drag.ptrs.size === 2) {
      const [a, b] = [...drag.ptrs.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (drag.pinch) zoomAt((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, d / drag.pinch);
      drag.pinch = d; drag.moved = 99; return;
    }
    if (drag.on) {
      const dx = e.clientX - prev[0], dy = e.clientY - prev[1];
      drag.moved += Math.abs(dx) + Math.abs(dy);
      if (drag.moved > 4) { stage.classList.add('dragging'); C.tx += dx; C.ty += dy; clampCam(); C.x = C.tx; C.y = C.ty; hideTip(); }
    }
  } else hoverPoint(e.target);
});
const endPtr = e => {
  drag.ptrs.delete(e.pointerId);
  if (drag.ptrs.size < 2) drag.pinch = 0;
  if (!drag.on) return;
  if (drag.ptrs.size === 0) {
    drag.on = false; stage.classList.remove('dragging');
    if (drag.moved <= 4) { if (drag.hub) openHub(drag.hub.dataset.hub); else lockOn(); }
  }
};
stage.addEventListener('pointerup', endPtr); stage.addEventListener('pointercancel', endPtr);
stage.addEventListener('pointerleave', () => { if (locked) return; P0.over = false; placeReticle(); hideTip(); });
stage.addEventListener('wheel', e => { e.preventDefault(); const [x, y] = locked ? retXY() : [e.clientX, e.clientY]; zoomAt(x, y, Math.exp(-e.deltaY * .0015)); clampCam(); }, { passive: false });
let hoverHub = null;
function hoverPoint(target) {
  const el = target || underReticle();
  const [px, py] = retXY();
  const h = el && el.closest && el.closest('.hub');
  if (h !== hoverHub) { hoverHub = h; if (h) sfx.hover(); }
  ret.classList.toggle('hot', !!h);
  const place = () => { tip.style.left = Math.min(px + 18, C.W - 300) + 'px'; tip.style.top = Math.min(py + 18, C.H - tip.offsetHeight - 40) + 'px'; tip.classList.add('show'); };
  if (!h) {
    const rm = el && el.closest && el.closest('[data-room]');
    if (!rm) return hideTip();
    tip.innerHTML = `<b>${esc(ALIAS[rm.dataset.room][S.lang === 'ru' ? 0 : 1])}</b><span class="dim">${rm.dataset.room} · 14.2.7</span>`;
    return place();
  }
  const hub = HUBS.find(x => x.id === h.dataset.hub);
  const n = hub.secs.length, rd = hub.secs.filter(s => S.read.has(s)).length;
  tip.innerHTML = `<b>${esc(hub.t[S.lang])}</b>${hub.secs.map(s => '· ' + esc(secById[s].t[S.lang])).join('<br>')}<div class="dim" style="margin-top:4px">${rd}/${n} ${T('read')}${locked ? ' · ' + (S.lang === 'ru' ? 'клик — открыть' : 'click to open') : ''}</div>`;
  place();
}
const hideTip = () => { tip.classList.remove('show'); };

/* ---------------- text formatting ---------------- */
function fmt(s, tech) {
  let h = esc(s);
  h = h.replace(/\((from|было|с|в сравнении с)\s[^)]*\)/g, m => `<span class="dim">${m}</span>`);
  if (!tech) h = h.replace(/(^|[\s(+−~×])(\d+(?:[.,]\d+)?)(\s?(?:%|м\/с|m\/s|AP\/с|AP\/s|AP|EXP|AHP|HP|°|x|с|s|м|m|метр\w*|meters?|секунд\w*|seconds?))?(?=[\s.,;:)!]|$)/g,
    (m, p, n, u) => `${p}<span class="num">${n}${u || ''}</span>`);
  return h;
}
function renderEntries(nums, tech, q) {
  let html = '', depth = -1;
  const stack = [];
  const list = nums.filter(n => E[n].k === 'b');
  list.forEach((n, i) => {
    const lv = Math.min(E[n].lv, 3);
    if (depth < 0) { html += '<ul>'; depth = 0; stack.push('ul'); }
    while (depth < lv) { html = html.replace(/<\/li>$/, ''); html += '<ul>'; depth++; }
    while (depth > lv) { html += '</ul></li>'; depth--; }
    let t = fmt(E[n][S.lang], tech);
    if (q) t = highlight(t, q);
    html += `<li id="e-${n}">${t}</li>`;
  });
  while (depth > 0) { html += '</ul></li>'; depth--; }
  if (list.length) html += '</ul>';
  nums.filter(n => E[n].k === 'c').forEach(n => { html += `<div class="dev" id="e-${n}"><b>${T('dev')} · Northwood</b>${esc(E[n][S.lang])}</div>`; });
  return html;
}
function highlight(html, q) {
  const re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
  return html.split(/(<[^>]+>)/).map(p => p.startsWith('<') ? p : p.replace(re, '<mark>$1</mark>')).join('');
}

/* ---------------- faces for memes ---------------- */
const FACES = {
  crt: `<rect x="10" y="12" width="100" height="78" rx="8" fill="#1b2a30" stroke="#6fd3ff" stroke-width="3"/><rect x="20" y="22" width="80" height="58" rx="4" fill="#031014"/><circle cx="45" cy="46" r="6" fill="#ffb347"/><circle cx="75" cy="46" r="6" fill="#ffb347"/><path d="M44 62q16 12 32 0" stroke="#ffb347" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="50" y="90" width="20" height="10" fill="#1b2a30"/><rect x="34" y="100" width="52" height="7" rx="3" fill="#1b2a30" stroke="#6fd3ff" stroke-width="2"/>`,
  crtsad: `<rect x="10" y="12" width="100" height="78" rx="8" fill="#1b2a30" stroke="#6fd3ff" stroke-width="3"/><rect x="20" y="22" width="80" height="58" rx="4" fill="#031014"/><path d="M38 42l12 4M82 42l-12 4" stroke="#ffb347" stroke-width="4" stroke-linecap="round"/><circle cx="45" cy="51" r="5" fill="#ffb347"/><circle cx="75" cy="51" r="5" fill="#ffb347"/><path d="M44 72q16-12 32 0" stroke="#ffb347" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M76 58q-4 8 0 10q4-2 0-10z" fill="#6fd3ff"/><rect x="50" y="90" width="20" height="10" fill="#1b2a30"/><rect x="34" y="100" width="52" height="7" rx="3" fill="#1b2a30" stroke="#6fd3ff" stroke-width="2"/>`,
  dboy: `<path d="M18 120q4-42 42-46q38 4 42 46z" fill="#ff7a1a" stroke="#000" stroke-width="2"/><path d="M50 76l10 14 10-14" fill="none" stroke="#a84a00" stroke-width="3"/><text x="72" y="108" font-size="9" font-family="monospace" fill="#3a1600">D-9341</text><circle cx="60" cy="44" r="27" fill="#e2b48e" stroke="#000" stroke-width="2"/><ellipse cx="50" cy="42" rx="5" ry="7" fill="#fff"/><ellipse cx="70" cy="42" rx="5" ry="7" fill="#fff"/><circle cx="51" cy="44" r="3"/><circle cx="71" cy="44" r="3"/><ellipse cx="60" cy="60" rx="7" ry="5" fill="#5a2a1a"/><path d="M42 30q8-6 14 0M64 30q8-6 14 0" stroke="#000" stroke-width="2.5" fill="none"/>`,
  flamingo: `<path d="M64 108V80M74 108l-4-28" stroke="#ff7eb6" stroke-width="3"/><ellipse cx="66" cy="74" rx="26" ry="15" fill="#ff7eb6" stroke="#000" stroke-width="2"/><path d="M46 70Q30 50 40 30T58 18" stroke="#ff7eb6" stroke-width="8" fill="none" stroke-linecap="round"/><circle cx="58" cy="18" r="8" fill="#ff7eb6" stroke="#000" stroke-width="2"/><path d="M64 16l14 6-10 4z" fill="#222"/><circle cx="58" cy="16" r="2"/><path d="M8 40h16M16 34v12M100 30l6-6M100 30l6 6" stroke="#6fd3ff" stroke-width="2"/><text x="84" y="58" font-size="10" fill="#6fd3ff" font-family="monospace">1.2m</text>`,
  speaker: `<path d="M20 46h18l30-24v76L38 74H20z" fill="#1b2a30" stroke="#ff5a4a" stroke-width="3" stroke-linejoin="round"/><path d="M80 44q10 16 0 32M90 34q18 26 0 52M100 24q26 36 0 72" stroke="#ff5a4a" stroke-width="4" fill="none" stroke-linecap="round"/><text x="22" y="112" font-size="11" font-family="monospace" fill="#ff5a4a">C.A.S.S.I.E.</text>`,
  phone: `<path d="M22 30q38-24 76 0l-6 14-18-4v-8q-14-4-28 0v8l-18 4z" fill="#c8302a" stroke="#000" stroke-width="2"/><rect x="28" y="56" width="64" height="44" rx="8" fill="#c8302a" stroke="#000" stroke-width="2"/><g fill="#fff">${[0,1,2].map(r=>[0,1,2].map(c=>`<circle cx="${46+c*14}" cy="${66+r*11}" r="3.5"/>`).join('')).join('')}</g><path d="M14 18l8 6M106 18l-8 6M60 6v8" stroke="#ffb347" stroke-width="3" stroke-linecap="round"/>`
};
const memeHTML = h => `<div class="meme"><span class="meme-tag">${T('intercept')} // ${h.id.toUpperCase()}</span><div class="meme-inner"><div class="meme-txt">${esc(h.joke[S.lang][0])}</div><svg class="face" viewBox="0 0 120 120">${FACES[h.face] || FACES.crt}</svg><div class="meme-txt">${esc(h.joke[S.lang][1])}</div></div></div>`;

/* ---------------- dossier ---------------- */
const dos = $('#dossier'), dosBody = $('#dos-body');
let io = null;
function openHub(id, secId, opts = {}) {
  const h = HUBS.find(x => x.id === id); if (!h) return;
  const already = S.hub === id;
  S.hub = id; lockOff();
  Object.values(hubEls).forEach(e => e.classList.remove('active')); hubEls[id].classList.add('active');
  const z = zoneById[h.zone];
  dos.style.setProperty('--zc', z.color);
  $('#dos-zone').textContent = z[S.lang]; $('#dos-zone').style.setProperty('--zc', z.color);
  $('#dos-title').textContent = h.t[S.lang];
  const items = h.secs.reduce((a, s) => a + secById[s].count, 0);
  $('#dos-count').textContent = `${items} ${T('items')}`;
  $('#dos-chips').innerHTML = h.secs.length > 1 ? h.secs.map(s => `<button data-sec="${s}">${esc(secById[s].t[S.lang])}</button>`).join('') : '';
  const q = opts.q || '';
  dosBody.innerHTML = memeHTML(h) + h.secs.map(sid => {
    const s = secById[sid];
    return `<section class="sec" id="sec-${sid}" data-sec="${sid}"><h2>${esc(s.t[S.lang])}<button class="lnk" data-copy="${sid}">#link</button></h2>${renderEntries(s.nums, s.cat === 'tech', q)}</section>`;
  }).join('') + `<div class="stamp">${S.lang === 'ru' ? 'ПРОВЕРЕНО // 079' : 'REVIEWED // 079'}</div>`;
  dosBody.scrollTop = 0;
  dos.classList.add('open'); dos.setAttribute('aria-hidden', 'false');
  if (!already && !opts.silent) {
    sfx.open();
    if (S.ap >= 10) { S.ap -= 10; hudAP(); } else { sfx.deny(); toast(T('apLow'), 'warn'); }
  }
  setZoneTab(h.zone);
  requestAnimationFrame(() => focusPoint(h.x, h.y, Math.max(C.tz, 1.25)));
  // read tracking
  if (io) io.disconnect();
  io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) markRead(en.target.dataset.sec); }), { root: dosBody, threshold: .15 });
  dosBody.querySelectorAll('.sec').forEach(s => io.observe(s));
  if (secId) setTimeout(() => scrollToSec(secId, opts.entry), 60);
  setHash(id, secId);
}
function scrollToSec(sid, entry) {
  const el = entry ? $('#e-' + entry) : $('#sec-' + sid); if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: entry ? 'center' : 'start' });
  if (entry) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
}
function closeDossier() {
  if (!dos.classList.contains('open')) return;
  dos.classList.remove('open'); dos.setAttribute('aria-hidden', 'true'); sfx.close();
  Object.values(hubEls).forEach(e => e.classList.remove('active')); S.hub = null; setHash();
}
$('#dos-close').onclick = closeDossier;
$('#dos-chips').addEventListener('click', e => { const b = e.target.closest('[data-sec]'); if (b) { sfx.click(); scrollToSec(b.dataset.sec); } });
dosBody.addEventListener('click', e => {
  const b = e.target.closest('[data-copy]'); if (!b) return;
  const url = location.href.split('#')[0] + '#/' + S.hub + '/' + b.dataset.copy;
  (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(() => toast(T('copy'), 'good')).catch(() => prompt('URL', url));
  sfx.click();
});

/* ---------------- read / EXP / tiers ---------------- */
const TOTAL = SECS.length;
const THRESH = [0, 100, 270, Math.round(TOTAL * 10 * .72), TOTAL * 10];
const expOf = () => S.read.size * 10;
const tierOf = x => { let t = 1; THRESH.forEach((v, i) => { if (x >= v) t = i + 1; }); return Math.min(5, t); };
function markRead(sid) {
  if (!sid || S.read.has(sid)) return;
  S.read.add(sid); save();
  const nt = tierOf(expOf());
  if (nt > S.tier) {
    S.tier = nt; sfx.tier(); glitch();
    toast(`${T('tierUp')}: ${nt}`, 'big');
    if (nt === 5) setTimeout(() => toast(T('allRead'), 'good'), 900);
  }
  hudEXP(); refreshReadStates();
}
function refreshReadStates() {
  HUBS.forEach(h => { const all = h.secs.every(s => S.read.has(s)); hubEls[h.id].classList.toggle('read', all); hubEls[h.id].classList.toggle('unread', !h.secs.some(s => S.read.has(s))); });
  document.querySelectorAll('.sec-link').forEach(b => b.classList.toggle('read', S.read.has(b.dataset.sec)));
  const p = Math.round(S.read.size / TOTAL * 100); $('#prog-fill').style.width = p + '%'; $('#prog-num').textContent = p + '%';
}
function hudAP() {
  const m = [100, 120, 140, 160, 200][S.tier - 1];
  $('#ap-fill').style.width = (S.ap / m * 100) + '%'; $('#ap-num').textContent = `${Math.floor(S.ap)}/${m}`;
}
function hudEXP() {
  const x = expOf(), t = S.tier; $('#tier-num').textContent = t;
  const lo = THRESH[t - 1], hi = THRESH[Math.min(4, t)];
  $('#exp-fill').style.width = (t >= 5 ? 100 : (x - lo) / (hi - lo) * 100) + '%';
  $('#exp-num').textContent = t >= 5 ? 'MAX' : `${x}/${hi}`;
  hudAP();
}

/* ---------------- directory & search ---------------- */
const dir = $('#dir'), dirList = $('#dir-list'), search = $('#search');
function renderDir() {
  dirList.innerHTML = CATS.map(c => {
    const ss = SECS.filter(s => s.cat === c.id);
    return `<div class="cat">${esc(c[S.lang])}</div>` + ss.map(s => `<button class="sec-link${S.read.has(s.id) ? ' read' : ''}" data-sec="${s.id}"><span class="dot"></span>${esc(s.t[S.lang])}<span class="n">${s.count}</span></button>`).join('');
  }).join('');
}
function toggleDir(force) {
  const open = force ?? !dir.classList.contains('open'); if (open) lockOff();
  dir.classList.toggle('open', open); document.body.classList.toggle('dir-open', open);
  if (open && innerWidth <= 820) closeDossier();
  sfx.click();
}
dirList.addEventListener('click', e => {
  const b = e.target.closest('[data-sec]'); if (!b) return;
  const sid = b.dataset.sec, h = hubBySec[sid];
  if (innerWidth <= 820) toggleDir(false);
  openHub(h.id, sid, { entry: b.dataset.entry, q: search.value.trim().length > 1 ? search.value.trim() : '' });
});
$('#dir-toggle').onclick = () => toggleDir(true);
$('#dir-close').onclick = () => toggleDir(false);
let sTimer;
search.addEventListener('input', () => { clearTimeout(sTimer); sTimer = setTimeout(doSearch, 120); });
function doSearch() {
  const q = search.value.trim();
  Object.values(hubEls).forEach(e => e.classList.remove('match', 'dim-out'));
  if (q.length < 2) { renderDir(); return; }
  const ql = q.toLowerCase(), res = [], hubsHit = new Set();
  SECS.forEach(s => s.nums.forEach(n => {
    const txt = E[n][S.lang], alt = E[n][S.lang === 'ru' ? 'en' : 'ru'];
    if (txt.toLowerCase().includes(ql) || alt.toLowerCase().includes(ql)) { res.push([s, n]); hubsHit.add(hubBySec[s.id].id); }
  }));
  Object.entries(hubEls).forEach(([id, e]) => { e.classList.toggle('match', hubsHit.has(id)); e.classList.toggle('dim-out', !hubsHit.has(id)); });
  dirList.innerHTML = `<div class="cat">${T('results')} · ${res.length}</div>` + (res.length ? res.slice(0, 120).map(([s, n]) =>
    `<button class="res" data-sec="${s.id}" data-entry="${n}"><small>${esc(s.t[S.lang])}</small>${highlight(esc(E[n][S.lang]), q)}</button>`).join('') : `<p class="dim" style="font-size:12px;padding:8px">${T('noresults')}</p>`);
}

/* ---------------- zone tabs ---------------- */
function buildZoneTabs() {
  $('#zone-tabs').innerHTML = ZONES.map((z, i) => `<button data-z="${z.id}" style="--zc:${z.color}">${z.short}<small>${i + 1}</small></button>`).join('');
}
function setZoneTab(id, passive) {
  document.querySelectorAll('#zone-tabs button').forEach(b => b.classList.toggle('on', b.dataset.z === id));
  if (!passive) lastZoneShown = id;
}
$('#zone-tabs').addEventListener('click', e => { const b = e.target.closest('[data-z]'); if (b) { sfx.click(); focusZone(b.dataset.z); } });

/* ---------------- toasts / modal / fx ---------------- */
function toast(msg, cls = '') {
  const t = document.createElement('div'); t.className = 'toast ' + cls; t.textContent = msg; $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 450); }, cls === 'big' ? 3200 : 3600);
}
function glitch() { document.body.classList.add('glitch'); setTimeout(() => document.body.classList.remove('glitch'), 400); }
const modal = $('#modal');
function openModal(html) { lockOff(); $('#modal-body').innerHTML = html; modal.hidden = false; sfx.open(); }
const closeModal = () => { if (!modal.hidden) { modal.hidden = true; sfx.close(); } };
$('#modal-close').onclick = closeModal;
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); const b = e.target.closest('[data-hub]'); if (b) { closeModal(); openHub(b.dataset.hub); } });
const SRC = 'https://docs.google.com/document/d/1uyIsSMMRXOa9KebyfYRJ2FNi3kNwfvbYWhAWhe1ILnw/edit';
function footer() {
  return `<div class="foot">${[1, 2, 3].map(n => '· ' + esc(E[n][S.lang])).join('<br>')}<br><br>${esc(T('disclaimer'))} <a href="${SRC}" target="_blank" rel="noopener">${T('source')} ↗</a></div>`;
}
function showOverview() {
  const p = Math.round(S.read.size / TOTAL * 100);
  openModal(`<h2>${T('ovTitle')}</h2><p class="dim">${T('sub')} · ${T('progress')}: ${p}%</p><div class="hl">${window.CL_HIGHLIGHTS.map(h => `<button data-hub="${h.hub}"><b>${esc(h[S.lang][0])}</b><span>${esc(h[S.lang][1])}</span></button>`).join('')}</div>${footer()}`);
}
const showHelp = () => openModal(`<h2>${T('help')}</h2><div class="help">${T('helpText')}</div>${footer()}`);
$('#btn-overview').onclick = showOverview; $('#btn-help').onclick = showHelp;
$('#btn-sound').onclick = () => { S.sound = !S.sound; save(); applySound(); sfx.click(); };
const applySound = () => $('#btn-sound').classList.toggle('off', !S.sound);
const sensIn = $('#sens'), sensV = $('#sens-v');
const applySens = () => { sensIn.value = S.sens; sensV.textContent = S.sens.toFixed(2) + 'x'; };
sensIn.addEventListener('input', () => { S.sens = +sensIn.value; applySens(); save(); });
sensIn.addEventListener('pointerdown', e => e.stopPropagation());
const applyFollow = () => { $('#sens-box').hidden = !(S.follow && !isTouch); $('#ab-follow').classList.toggle('on', S.follow); document.body.classList.toggle('follow', S.follow && !isTouch); if (!S.follow) lockOff(); placeReticle(); };
$('#abilities').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return; sfx.click();
  ({ dir: () => toggleDir(), search: () => { toggleDir(true); setTimeout(() => search.focus(), 50); }, reset: () => { closeDossier(); overview(); }, follow: () => { S.follow = !S.follow; save(); applyFollow(); } })[b.dataset.act]();
});
document.querySelectorAll('.lang button').forEach(b => b.onclick = () => setLang(b.dataset.lang));

/* ---------------- language ---------------- */
function setLang(l) {
  S.lang = l; save(); document.documentElement.lang = l;
  document.querySelectorAll('.lang button').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
  $('#ui-tier').textContent = T('tier'); $('#ui-ap').textContent = l === 'ru' ? 'ЭНЕРГИЯ' : 'AUX'; $('#ui-exp').textContent = T('exp');
  $('#ui-dir').textContent = T('dir'); $('#ui-dir2').textContent = T('dir'); $('#ui-progress').textContent = T('progress');
  search.placeholder = T('search'); document.title = T('title');
  document.querySelectorAll('[data-hl]').forEach(t => t.textContent = HUBS.find(h => h.id === t.dataset.hl).t[l]);
  document.querySelectorAll('[data-alias]').forEach(t => t.textContent = ALIAS[t.dataset.alias][l === 'ru' ? 0 : 1]);
  document.querySelectorAll('[data-zn]').forEach(t => t.textContent = zoneById[t.dataset.zn][l]);
  const ticker = window.CL_CASSIE[l]; $('#cassie-text').textContent = ticker.join('   ///   ');
  $('#boot-sub').textContent = T('sub');
  if (search.value.trim().length > 1) doSearch(); else renderDir();
  if (S.hub) { const st = dosBody.scrollTop; openHub(S.hub, null, { silent: true }); dosBody.scrollTop = st; }
  refreshReadStates(); sfx.click();
}

/* ---------------- hash ---------------- */
function setHash(h, s) { try { history.replaceState(null, '', h ? `#/${h}${s ? '/' + s : ''}` : location.pathname + location.search); } catch {} }
function fromHash() {
  const m = location.hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/); if (!m) return false;
  let hub = HUBS.find(h => h.id === m[1]);
  if (!hub && secById[m[1]]) hub = hubBySec[m[1]];
  if (!hub) return false; openHub(hub.id, m[2] || null, { silent: true }); return true;
}

/* ---------------- keyboard ---------------- */
addEventListener('keydown', e => {
  if (!S.booted) return;
  if (e.target === search) { if (e.key === 'Escape') { search.value = ''; doSearch(); search.blur(); } if (e.key === 'Enter') { const f = dirList.querySelector('[data-sec]'); f && f.click(); } return; }
  if (e.key === 'Tab') { e.preventDefault(); toggleDir(); }
  else if (e.key === 'f' || e.key === 'F' || e.key === '/' || e.key === 'а' || e.key === 'А') { e.preventDefault(); toggleDir(true); setTimeout(() => search.focus(), 30); }
  else if (e.key === 'Escape') { if (!modal.hidden) closeModal(); else if (dos.classList.contains('open')) closeDossier(); else if (dir.classList.contains('open')) toggleDir(false); }
  else if (e.key === ' ') { e.preventDefault(); closeDossier(); overview(); }
  else if (/^[1-4]$/.test(e.key)) { closeDossier(); focusZone(ZONES[+e.key - 1].id); }
  else if (e.key === 'm' || e.key === 'M' || e.key === 'ь') { S.follow = !S.follow; save(); applyFollow(); }
  else if (e.key === '?') showHelp();
  else if (e.key === 'Enter' && document.activeElement && document.activeElement.dataset && document.activeElement.dataset.hub) openHub(document.activeElement.dataset.hub);
  const pan = { ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60], a: [60, 0], d: [-60, 0], w: [0, 60], s: [0, -60] }[e.key];
  if (pan) { C.tx += pan[0]; C.ty += pan[1]; clampCam(); }
  if (e.key === '+' || e.key === '=') zoomAt(C.W / 2, C.H / 2, 1.2);
  if (e.key === '-') zoomAt(C.W / 2, C.H / 2, 1 / 1.2);
});
addEventListener('resize', () => { C.W = innerWidth; C.H = innerHeight; svg.setAttribute('viewBox', `0 0 ${C.W} ${C.H}`); });

/* ---------------- boot ---------------- */
const BOOT = [
  ['NORTHWOOD // SITE-02 FACILITY NETWORK', ''], ['> handshake ......................... ', 'OK'], ['> loading changelog v15.0.0 BETA (Nov. 13) ', 'OK'],
  [`> parsing ${E.length - 1} records / ${SECS.length} sections ...... `, 'OK'], ['> translating to RU ................. ', 'OK'],
  ['> SCP-953 signature scan ............ ', 'NOT FOUND?'], ['> AUX POWER ......................... ', '0 AP'], ['> SCP-079 TERMINAL ONLINE', '']
];
async function boot() {
  const log = $('#boot-log'); const wait = ms => new Promise(r => setTimeout(r, ms));
  const fast = sessionStorage.getItem('booted');
  let skip = false;
  function start(l) {
    if (S.booted) return; S.booted = true; skip = true; removeEventListener('keydown', anyKey);
    audio(); try { sessionStorage.setItem('booted', '1'); } catch {}
    setLang(l); $('#boot').classList.add('gone'); sfx.tier();
    if (!fromHash()) { C.z = C.tz * .6; overview(); }
    setTimeout(() => toast(T('apStart'), 'warn'), 900);
    setTimeout(() => { if (!S.read.size && innerWidth > 820) toggleDir(true); }, 1600);
  }
  const anyKey = e => { if (e.key === 'Tab') return; if (e.key === 'Enter' && document.activeElement.dataset.boot) return; start(S.lang); };
  addEventListener('keydown', anyKey);
  document.querySelectorAll('[data-boot]').forEach(b => b.onclick = () => start(b.dataset.boot));
  $('#boot').addEventListener('click', e => { if (!e.target.closest('[data-boot]') && $('#boot-choose').classList.contains('show')) start(S.lang); });
  $('#boot-hint').innerHTML = `${esc(UI.ru.boot)} · ${esc(UI.en.boot)}<br><br>${esc(UI[S.lang].disclaimer)}`;
  for (const [a, b] of BOOT) {
    if (skip) break;
    const line = document.createElement('div'); log.appendChild(line);
    for (const ch of a) { line.textContent += ch; if (!fast && !skip && Math.random() < .5) await wait(6); }
    if (b) { const s = document.createElement('span'); s.className = b === 'OK' ? 'ok' : 'warn'; s.textContent = b; line.appendChild(s); }
    await wait(fast ? 20 : 140);
  }
  $('#boot-choose').classList.add('show');
  setTimeout(() => { beep(880, .09, 'square', .03); setTimeout(() => beep(1320, .16, 'square', .03), 90); }, 900);
  const f = document.querySelector(`[data-boot="${S.lang}"]`); if (f && !S.booted) f.focus();
}

/* ---------------- init ---------------- */
buildMap(); buildZoneTabs();
svg.setAttribute('viewBox', `0 0 ${C.W} ${C.H}`);
S.tier = tierOf(expOf());
setLang(S.lang); applySound(); applySens(); applyFollow(); hudEXP(); refreshReadStates();
overview(); C.x = C.tx; C.y = C.ty; C.z = C.tz * .7;
requestAnimationFrame(frame);
boot();
})();
