/* CBT KKMI KOTAANYAR — js/core.js : util, ikon, API fetch, modal, tabel, router, login */
'use strict';
/* =====================================================================
   CBT KKMI KOTAANYAR — JavaScript.html
   SPA murni (tanpa ?page=, tanpa window.location). Semua halaman dirender
   di klien dari state `S.B` yang di-cache → navigasi 0 ms.
   Tulis data: optimistic UI → sinkron latar belakang → rollback bila gagal.
   ===================================================================== */
const TZ = 'Asia/Jakarta', HARI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'], BLN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const $ = (s, r) => (r || document).querySelector(s), $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const N = (v, d) => { const n = Number(v); return isFinite(n) ? n : (d || 0); };
const fmt = (n, d) => N(n).toLocaleString('id-ID', { maximumFractionDigits: d == null ? 1 : d });
const uid = () => Math.random().toString(36).slice(2, 7) + Date.now().toString(36).slice(-5);
const debounce = (f, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
const LS = { g(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, s(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }, d(k) { try { localStorage.removeItem(k); } catch (e) {} } };
const SS = { g(k) { try { return JSON.parse(sessionStorage.getItem(k)); } catch (e) { return null; } }, s(k, v) { try { sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }, d(k) { try { sessionStorage.removeItem(k); } catch (e) {} } };

/* ---------- Ikon (SVG inline, gaya Lucide 1.5px) ---------- */
const IC = {
  cap:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
  dash:'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  db:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  book:'<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2zM22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  key:'<circle cx="7.5" cy="15.5" r="4.5"/><path d="m10.7 12.3 9.3-9.3M17 6l3 3M14 9l2 2"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 15v3M14 15v3M8 22v-2h8v2"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  printer:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  edit:'<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  trash:'<path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  checkc:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  alert:'<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M17.9 17.9A10.8 10.8 0 0 1 12 19c-6.4 0-10-7-10-7a18 18 0 0 1 5-5.9M9.9 5.2A9.7 9.7 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.2 3.2M1 1l22 22"/>',
  lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',
  'arrow-right':'<path d="M5 12h14M12 5l7 7-7 7"/>',
  'arrow-left':'<path d="M19 12H5M12 19l-7-7 7-7"/>',
  chev:'<path d="m9 18 6-6-6-6"/>',
  flag:'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  refresh:'<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5"/>',
  ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  idcard:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.6-1.5 1.7-2 3-2s2.4.5 3 2M14 9h5M14 13h5"/>',
  server:'<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>',
  cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.7-9h1.8a4.5 4.5 0 0 1 0 9z"/>',
  chart:'<path d="M3 3v18h18M7 14l4-4 3 3 5-6"/>',
  grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
  school:'<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M12 10h.01"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  copy:'<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  monitor:'<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
  pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  play:'<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
  hour:'<path d="M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2"/>',
  wifi:'<path d="M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M12 20h.01M2 9a15 15 0 0 1 20 0"/>',
  help:'<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',
  scale:'<path d="M12 3v18M5 7h14M5 7l-3 8a4 4 0 0 0 6 0zM19 7l-3 8a4 4 0 0 0 6 0z"/>'
};
const ic = (n, c) => `<svg class="ic ${c || ''}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;
function hydrate(root) { $$('i[data-ic]', root).forEach(i => { const t = document.createElement('span'); t.style.display = 'contents'; t.innerHTML = ic(i.dataset.ic, i.dataset.cls); const s = t.firstChild; if (i.getAttribute('style')) s.setAttribute('style', i.getAttribute('style')); i.replaceWith(s); }); }

/* ---------- Waktu & format ---------- */
const S = { tk: null, me: null, B: null, view: null, off: 0, rtt: 0, t: 0, tabs: {}, flt: {}, busy: 0 };
const nowMs = () => Date.now() + S.off;
const jam = ms => new Date(ms).toLocaleTimeString('en-GB', { timeZone: TZ, hour12: false });
const tglKey = ms => new Date(ms).toLocaleDateString('en-CA', { timeZone: TZ });
const tglID = s => { const d = new Date(s + 'T12:00:00Z'); return HARI[d.getUTCDay()] + ', ' + d.getUTCDate() + ' ' + BLN[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); };
const tglS = s => { const d = new Date(s + 'T12:00:00Z'); return d.getUTCDate() + ' ' + BLN[d.getUTCMonth()].slice(0, 3); };
const win = j => ({ s: Date.parse(j.Tanggal + 'T' + j.Mulai + ':00+07:00'), e: Date.parse(j.Tanggal + 'T' + j.Selesai + ':00+07:00') });
const stat = j => { const w = win(j), n = nowMs(); return n < w.s ? 'akan' : (n <= w.e ? 'berlangsung' : 'selesai'); };
const sapa = () => { const h = +new Date(nowMs()).toLocaleString('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }); return h < 11 ? 'Selamat Pagi' : h < 15 ? 'Selamat Siang' : h < 18 ? 'Selamat Sore' : 'Selamat Malam'; };
const ini = n => String(n || '?').trim().split(/\s+/).slice(0, 2).map(x => x[0]).join('').toUpperCase();
const kelasMatch = (kelas, daftar) => { kelas = String(kelas).toUpperCase(); return String(daftar || '').split(/[,;]/).map(s => s.trim().toUpperCase()).filter(Boolean).some(t => t === 'ALL' || t === 'SEMUA' || kelas === t || kelas.indexOf(t + '-') === 0); };

/* ---------- API: fetch() ke GAS Web App (gas-pro-api) ----------
   POST wajib Content-Type text/plain agar browser TIDAK melakukan CORS preflight (GAS tidak menanganinya).
   Selalu resolve (tidak pernah melempar): cek r.success di pemanggil. */
const GAS_OK = () => /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(CFG.GAS_URL);
async function api(aksi, data) {
  const t0 = performance.now(), ctl = new AbortController(), to = setTimeout(() => ctl.abort(), aksi === 'ujian.selesai' ? 70000 : 45000);
  try {
    const res = await fetch(CFG.GAS_URL, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: aksi, token: S.tk, data: data || {} }), signal: ctl.signal });
    const txt = await res.text(); let r;
    try { r = JSON.parse(txt); } catch (e) { netState(false); return { success: false, net: true, message: 'Server tidak membalas JSON. Pastikan Web App di-deploy: Execute as "Me", akses "Anyone", dan versi terbaru.' }; }
    S.rtt = Math.round(performance.now() - t0); netState(true);
    if (r && r.code === 'AUTH' && aksi !== 'auth.login' && aksi.indexOf('ujian.') !== 0) { forceLogout(r.message); return new Promise(() => {}); }
    return r || { success: false, message: 'Respons kosong dari server.' };
  } catch (e) { netState(false); return { success: false, net: true, message: e.name === 'AbortError' ? 'Server terlalu lama merespons. Coba lagi.' : 'Gagal terhubung ke server. Periksa koneksi internet.' }; }
  finally { clearTimeout(to); }
}
/** "Bangunkan" GAS lebih awal & ambil identitas publik untuk layar login. */
async function warmUp() {
  try {
    const r = await (await fetch(CFG.GAS_URL + '?action=ping')).json();
    if (r && r.success && r.data.cfg) { const c = r.data.cfg; $('#lgTitle').textContent = c.NAMA_APP; $('#lgTag').textContent = c.TAGLINE; document.title = c.NAMA_APP; }
  } catch (e) { /* diam: login tetap bisa dicoba */ }
}
function netState(ok) { $('#net').classList.toggle('hide', ok); }
window.addEventListener('offline', () => netState(false)); window.addEventListener('online', () => netState(true));
function setSync(m) {
  const b = $('#syncB'); if (!b) return;
  b.innerHTML = m === 'sync' ? '<span class="spin xs"></span><span>Menyinkronkan…</span>' : m === 'err' ? '<span class="dot" style="background:var(--red)"></span><span>Gagal sinkron</span>' : '<span class="dot"></span><span>Tersinkron</span>';
}

/* ---------- Toast & modal ---------- */
function toast(msg, type, html) {
  const el = document.createElement('div'); el.className = 'ts ' + (type || ''); el.setAttribute('role', type === 'e' ? 'alert' : 'status');
  el.innerHTML = `<span style="color:${type === 'e' ? 'var(--red-x)' : type === 'w' ? 'var(--amber-x)' : 'var(--em-d)'}">${ic(type === 'e' ? 'alert' : type === 'w' ? 'alert' : 'checkc')}</span><div class="b" style="flex:1;font-weight:500">${html ? msg : esc(msg)}</div>`;
  $('#toasts').appendChild(el); setTimeout(() => el.remove(), type === 'e' ? 7000 : 3800);
}
function modal(o) {
  const el = document.createElement('div'); el.className = 'mo';
  el.innerHTML = `<div class="md ${o.wide ? 'w' : ''} ${o.narrow ? 'n' : ''}" role="dialog" aria-modal="true" aria-label="${esc(o.title)}"><div class="mh"><h3>${esc(o.title)}</h3>${o.lock ? '' : `<button class="bt g ib" data-close aria-label="Tutup">${ic('x')}</button>`}</div><div class="mbd">${o.body || ''}</div><div class="mf"></div></div>`;
  const mf = $('.mf', el);
  (o.actions || []).forEach(a => {
    const b = document.createElement('button'); b.className = 'bt ' + (a.cls || 'o'); b.innerHTML = a.t;
    b.onclick = async () => { if (!a.fn) { el.remove(); return; } b.disabled = true; let keep; try { keep = await a.fn(el, b); } finally { b.disabled = false; } if (!keep) el.remove(); };
    mf.appendChild(b);
  });
  if (!(o.actions || []).length) mf.remove();
  el.addEventListener('mousedown', e => { if (e.target === el && !o.lock) el.remove(); });
  el.addEventListener('click', e => { if (e.target.closest('[data-close]')) el.remove(); });
  $('#mroot').appendChild(el); hydrate(el);
  const f = $('input:not([type=hidden]),select,textarea', el); if (f && !o.nofocus) setTimeout(() => f.focus(), 30);
  return el;
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const m = $$('#mroot .mo'); if (m.length && !m[m.length - 1].querySelector('[data-lock]')) m[m.length - 1].remove(); } });
function confirmBox(o) {
  return new Promise(res => {
    modal({ title: o.title, narrow: true, body: `<p style="margin:6px 0 8px">${o.msg}</p>`, actions: [
      { t: 'Batal', cls: 'o', fn: () => { res(false); } },
      { t: o.ok || 'Ya, lanjutkan', cls: o.danger ? 'dk' : 'p', fn: () => { res(true); } }] });
  });
}
function formModal(o) {
  const f = o.fields, v = o.values || {};
  const html = `<form id="fm" novalidate><div class="fgrid">${f.map(x => {
    const val = v[x.k] == null ? (x.def == null ? '' : x.def) : v[x.k], id = 'f_' + x.k;
    let inp;
    if (x.t === 'select') inp = `<select class="sel" id="${id}" ${x.req ? 'required' : ''}>${x.opts.map(a => `<option value="${esc(a[0])}" ${String(a[0]) === String(val) ? 'selected' : ''}>${esc(a[1])}</option>`).join('')}</select>`;
    else if (x.t === 'textarea') inp = `<textarea class="ta" id="${id}" ${x.req ? 'required' : ''} placeholder="${esc(x.ph || '')}">${esc(val)}</textarea>`;
    else inp = `<input class="in" id="${id}" type="${x.t || 'text'}" value="${esc(val)}" ${x.req ? 'required' : ''} ${x.ro ? 'readonly' : ''} placeholder="${esc(x.ph || '')}" ${x.min != null ? 'min="' + x.min + '"' : ''}>`;
    return `<div class="fg ${x.cls || ''}" ${x.full ? 'style="grid-column:1/-1"' : ''} data-fk="${x.k}"><label class="fl" for="${id}">${esc(x.l)}${x.req ? ' <span style="color:var(--red-x)">*</span>' : ''}</label>${inp}${x.hint ? `<div class="hint">${x.hint}</div>` : ''}<div class="err hide"></div></div>`;
  }).join('')}</div></form>`;
  const el = modal({ title: o.title, wide: o.wide, body: html, actions: [{ t: 'Batal', cls: 'o' }, { t: o.ok || 'Simpan', cls: 'p', fn: async (m, btn) => {
    const vals = {}; let bad = false;
    f.forEach(x => { const i = $('#f_' + x.k, m); vals[x.k] = i.value.trim(); const er = $('[data-fk="' + x.k + '"] .err', m); const hidden = i.closest('.fg').classList.contains('hide'); if (x.req && !vals[x.k] && !hidden) { er.textContent = 'Wajib diisi.'; er.classList.remove('hide'); bad = true; } else er.classList.add('hide'); });
    if (bad) return true;
    btn.innerHTML = '<span class="spin xs"></span> Menyimpan…';
    const r = await o.onSave(vals, m); return r === false;
  } }] });
  if (o.onReady) o.onReady(el);
  $('#fm', el).addEventListener('submit', e => e.preventDefault());
  return el;
}

/* ---------- Tabel lokal (cari + halaman) ---------- */
const DT = {};
function dtable(id, cols, getRows, o) {
  o = o || {}; const st = DT[id] || (DT[id] = { q: '', p: 1 }); st.cols = cols; st.get = getRows; st.o = o;
  return `<div id="dt-${id}">${o.nosearch ? '' : `<div class="row noprint" style="margin-bottom:12px"><div class="sw" style="flex:1;max-width:340px"><i data-ic="search"></i><input class="in" data-in="dtq" data-id="${id}" value="${esc(st.q)}" placeholder="${esc(o.ph || 'Cari…')}" aria-label="Cari"></div>${o.bar || ''}</div>`}<div id="dtb-${id}">${dtBody(id)}</div></div>`;
}
function dtBody(id) {
  const st = DT[id], per = st.o.per || 25; let rows = st.get();
  if (st.q) { const q = st.q.toLowerCase(); rows = rows.filter(r => (st.o.text ? st.o.text(r) : JSON.stringify(r)).toLowerCase().includes(q)); }
  const tot = rows.length, pages = Math.max(1, Math.ceil(tot / per)); if (st.p > pages) st.p = pages;
  const slice = rows.slice((st.p - 1) * per, st.p * per);
  if (!tot) return `<div class="empty">${ic('search')}<div>${esc(st.o.empty || 'Belum ada data.')}</div></div>`;
  return `<div class="tw"><table class="t"><thead><tr>${st.cols.map(c => `<th class="${c.cls || ''}">${c.h}</th>`).join('')}</tr></thead><tbody>${slice.map(r => `<tr>${st.cols.map(c => `<td class="${c.cls || ''}">${c.f(r)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
  <div class="pg noprint"><span>${tot} data · hal ${st.p}/${pages}</span><button class="bt o sm" data-act="dtp" data-id="${id}" data-d="-1" ${st.p <= 1 ? 'disabled' : ''}>Sebelumnya</button><button class="bt o sm" data-act="dtp" data-id="${id}" data-d="1" ${st.p >= pages ? 'disabled' : ''}>Berikutnya</button></div>`;
}
function dtPaint(id) { const el = $('#dtb-' + id); if (el) { el.innerHTML = dtBody(id); hydrate(el); } }
const tabsH = (id, items, cur) => `<div class="tabs noprint" role="tablist">${items.map(i => `<button class="tb ${i[0] === cur ? 'on' : ''}" role="tab" data-act="tab" data-id="${id}" data-v="${i[0]}">${i[1]}</button>`).join('')}</div>`;
const empty = (t, i) => `<div class="empty">${ic(i || 'file')}<div>${t}</div></div>`;

/* ---------- Chart ---------- */
const CH = {};
function chart(id, cfg, tries) {
  const cv = $('#' + id); if (!cv) return;
  if (!window.Chart) { if ((tries || 0) < 40) setTimeout(() => chart(id, cfg, (tries || 0) + 1), 150); return; }
  if (CH[id]) CH[id].destroy();
  CH[id] = new Chart(cv, Object.assign({ options: { responsive: true, maintainAspectRatio: false, animation: { duration: 250 }, plugins: { legend: { display: false } } } }, cfg));
}
const BANDS = [['90–100', '#059669'], ['80–89', '#0284C7'], ['70–79', '#7C3AED'], ['60–69', '#F59E0B'], ['< 60', '#EF4444']];
const bandIdx = n => n >= 90 ? 0 : n >= 80 ? 1 : n >= 70 ? 2 : n >= 60 ? 3 : 4;
function donutH(id, hs) {
  const c = [0, 0, 0, 0, 0]; hs.forEach(h => c[bandIdx(h.nilai)]++);
  const tot = hs.length;
  setTimeout(() => chart(id, { type: 'doughnut', data: { labels: BANDS.map(b => b[0]), datasets: [{ data: c, backgroundColor: BANDS.map(b => b[1]), borderWidth: 2, borderColor: '#fff' }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '64%', plugins: { legend: { display: false } } } }), 0);
  return `<div class="row" style="align-items:center"><div class="cv" style="height:190px;width:190px;flex:none"><canvas id="${id}" aria-label="Komposisi nilai"></canvas></div><div class="legend">${BANDS.map((b, i) => `<div><i style="background:${b[1]}"></i>${b[0]} <b>${tot ? Math.round(c[i] / tot * 100) : 0}%</b> <span class="muted">(${c[i]})</span></div>`).join('')}</div></div>`;
}

/* ---------- Unduh berkas ---------- */
function dl(name, mime, content, isB64) {
  try {
    let blob;
    if (isB64) { const bin = atob(content), a = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i); blob = new Blob([a], { type: mime }); } else blob = new Blob([content], { type: mime });
    const u = URL.createObjectURL(blob), l = document.createElement('a'); l.href = u; l.download = name; document.body.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000); return true;
  } catch (e) { return false; }
}
function savePdf(p) { dl(p.nama, 'application/pdf', p.base64, true); toast(`PDF <b>${esc(p.nama)}</b> dibuat. <a href="${esc(p.url)}" target="_blank" rel="noopener">Buka di Drive</a>`, '', true); }
async function cetak(btn, aksi, data) {
  const t = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spin xs"></span> Membuat PDF…';
  const r = await api(aksi, data); btn.disabled = false; btn.innerHTML = t;
  if (r.success) savePdf(r.data); else toast(r.message, 'e');
}

/* ---------- Data lokal (optimistic) ---------- */
const LKEY = { Siswa: ['siswa', 'NISN'], Guru: ['guru', 'NIP'], Kelas: ['kelas', 'ID'], Mapel: ['mapel', 'ID'], Jadwal: ['jadwal', 'ID'], BankSoal: ['bank', 'id'] };
const soalToRow = s => ({ ID: s.id, MapelID: s.mapel, Jenis: s.jenis, Pertanyaan: s.q, A: s.A, B: s.B, C: s.C, D: s.D, E: s.E, Kunci: s.kunci, Bobot: s.bobot });
const rowToSoal = r => ({ id: r.ID, mapel: r.MapelID, jenis: r.Jenis, q: r.Pertanyaan, A: r.A, B: r.B, C: r.C, D: r.D, E: r.E, kunci: r.Kunci, bobot: N(r.Bobot, 1), pembuat: r.Pembuat });
function persist() { if (S.me && S.me.role !== 'siswa') SS.s('cbt_boot', S.B); else LS.s('cbt_boot_s', S.B); }
function upsertLocal(ent, rows) {
  const [k, key] = LKEY[ent], arr = S.B[k];
  rows.forEach(r => { const x = ent === 'BankSoal' ? rowToSoal(r) : r, i = arr.findIndex(a => String(a[key]) === String(x[key])); if (i >= 0) arr[i] = Object.assign(arr[i], x); else arr.push(x); });
}
async function saveRows(ent, rows, o) {
  o = o || {}; const [k] = LKEY[ent], snap = JSON.parse(JSON.stringify(S.B[k]));
  if (!o.noOptimistic) { upsertLocal(ent, rows); persist(); rerender(); }
  setSync('sync'); const r = await api('crud.simpan', { entity: ent, rows });
  if (!r.success) { S.B[k] = snap; persist(); rerender(); setSync('err'); toast(r.message, 'e'); return r; }
  upsertLocal(ent, r.data.rows); persist(); rerender(); setSync('ok');
  if (r.data.akunBaru && r.data.akunBaru.length) showAkun(r.data.akunBaru);
  return r;
}
async function hapusRows(ent, ids) {
  const [k, key] = LKEY[ent], snap = JSON.parse(JSON.stringify(S.B[k]));
  S.B[k] = S.B[k].filter(a => ids.indexOf(String(a[key])) < 0); persist(); rerender(); setSync('sync');
  const r = await api('crud.hapus', { entity: ent, ids });
  if (!r.success) { S.B[k] = snap; persist(); rerender(); setSync('err'); toast(r.message, 'e'); return false; }
  setSync('ok'); toast(r.message); return true;
}
function showAkun(list) {
  const tsv = 'Username\tNama\tKata sandi awal\n' + list.map(a => [a.username, a.nama, a.password].join('\t')).join('\n');
  modal({ title: 'Akun baru dibuat', wide: true, body: `<div class="aler" style="background:var(--amber-t);color:var(--amber-x);margin:0 0 12px">${ic('alert', 's')}<span>Kata sandi hanya ditampilkan <b>sekali</b> dan tersimpan sebagai hash. Salin atau unduh sekarang, lalu bagikan ke siswa/guru.</span></div>
    <div class="tw" style="max-height:320px;overflow:auto"><table class="t"><thead><tr><th>Username</th><th>Nama</th><th>Sandi awal</th></tr></thead><tbody>${list.map(a => `<tr><td class="mono">${esc(a.username)}</td><td>${esc(a.nama)}</td><td class="mono b">${esc(a.password)}</td></tr>`).join('')}</tbody></table></div>`,
    actions: [{ t: ic('copy', 's') + ' Salin', cls: 'o', fn: () => { try { navigator.clipboard.writeText(tsv); toast('Daftar akun disalin.'); } catch (e) { toast('Gagal menyalin.', 'e'); } return true; } },
      { t: ic('download', 's') + ' Unduh CSV', cls: 'o', fn: () => { dl('akun-baru.csv', 'text/csv', 'Username,Nama,Sandi\n' + list.map(a => [a.username, '"' + a.nama.replace(/"/g, '""') + '"', a.password].join(',')).join('\n')); return true; } },
      { t: 'Selesai', cls: 'p' }] });
}

/* ---------- Router & shell ---------- */
const V = {}; const NAV = { admin: ['dash', 'master', 'bank', 'jadwal', 'monitor', 'esai', 'rekap', 'cetak', 'pengaturan'], guru: ['gdash', 'bank', 'esai', 'cetak'], siswa: ['beranda', 'kartu'] };
function paintNav() {
  const role = S.me.role, h = NAV[role].map(id => `<button class="nv ${S.view === id ? 'on' : ''}" data-act="go" data-id="${id}" ${S.view === id ? 'aria-current="page"' : ''}>${ic(V[id].i)}<span>${V[id].t}</span></button>`).join('');
  (role === 'siswa' ? $('#snav') : $('#nav')).innerHTML = h;
}
function go(id) {
  if (!V[id]) return; if (S.view && V[S.view] && V[S.view].leave) V[S.view].leave();
  S.view = id; let el = $('#v-' + id);
  if (!el) { el = document.createElement('section'); el.className = 'view'; el.id = 'v-' + id; $('#vw').appendChild(el); }
  $$('.view.on').forEach(x => x.classList.remove('on')); el.classList.add('on');
  $('#ttl').textContent = V[id].t; paintNav(); V[id].r(el); hydrate(el); closeSide(); window.scrollTo(0, 0);
  if (Date.now() - S.t > 30000) refresh();
}
function rerender() {
  if (!S.view || !S.B) return; const a = document.activeElement, el = $('#v-' + S.view);
  if (a && el && el.contains(a) && /INPUT|TEXTAREA|SELECT/.test(a.tagName) && !a.hasAttribute('data-force')) return;
  if (E && E.on) return; V[S.view].r(el); hydrate(el);
}
const openSide = () => { $('#side').classList.add('open'); $('#scrim').classList.add('open'); };
const closeSide = () => { $('#side').classList.remove('open'); $('#scrim').classList.remove('open'); };
function applyBoot(b) {
  S.B = b; S.off = b.serverNow - Date.now(); S.t = Date.now(); S.me = b.me; persist();
}
async function refresh() {
  if (S.refreshing || !S.tk) return; S.refreshing = true; setSync('sync');
  const r = await api('boot'); S.refreshing = false;
  if (!r.success) { setSync('err'); return; }
  applyBoot(r.data); setSync('ok'); rerender();
}
function enterApp() {
  const me = S.me, app = $('#app');
  $('#boot').classList.add('hide'); $('#login').classList.add('hide'); app.classList.remove('hide', 'admin', 'guru', 'siswa', 'exam'); app.classList.add(me.role);
  const nm = S.B.cfg.NAMA_APP || 'CBT'; document.title = nm;
  $('#brandN').textContent = nm.split(' ').slice(0, 2).join(' '); $('#brandN2').textContent = nm;
  $('#brandS').textContent = me.role === 'admin' ? 'Panel Admin' : 'Panel Guru';
  $('#uAv').textContent = $('#sAv').textContent = ini(me.nama); $('#uNm').textContent = $('#sNm').textContent = me.nama;
  $('#vw').innerHTML = ''; S.view = null; go(NAV[me.role][0]);
  setSync('ok'); hydrate(document.body);
  if (me.role === 'siswa') { const ex = LS.g('cbt_exam_' + me.username); if (ex) resumeExam(ex); }
}
function showLogin(msg) {
  $('#boot').classList.add('hide'); $('#app').classList.add('hide'); $('#login').classList.remove('hide'); hydrate($('#login'));
  if (msg) lgErr(msg); setTimeout(() => $('#lgU').focus(), 50);
}
function forceLogout(msg) { stopExamTimers(); S.tk = null; S.B = null; S.me = null; LS.d('cbt_tk'); SS.d('cbt_tk'); SS.d('cbt_boot'); showLogin(msg || 'Sesi berakhir. Silakan masuk kembali.'); }
async function logout() {
  if (E && E.on) return;
  const u = S.me && S.me.username; if (S.me && S.me.role === 'siswa') { /* simpan jawaban lokal tetap ada */ }
  S.tk = null; S.B = null; S.me = null; LS.d('cbt_tk'); SS.d('cbt_tk'); SS.d('cbt_boot'); LS.d('cbt_boot_s'); showLogin(); void u;
}

/* ---------- Login ---------- */
let lgRole = 'siswa';
const LGL = { siswa: ['NISN', 'Masukkan NISN terdaftar'], guru: ['NIP', 'Masukkan NIP terdaftar'], admin: ['Username', 'Masukkan username admin'] };
function lgErr(m) { const e = $('#lgErr'); e.classList.toggle('hide', !m); $('span', e).textContent = m || ''; }
async function doLogin() {
  const u = $('#lgU').value.trim(), p = $('#lgP').value; lgErr('');
  if (!u || !p) { lgErr('Isi ' + LGL[lgRole][0] + ' dan kata sandi.'); return; }
  const b = $('#lgBtn'), t = b.innerHTML; b.disabled = true; b.innerHTML = '<span class="spin xs" style="border-top-color:#fff;border-color:rgba(255,255,255,.4)"></span> Memeriksa…';
  const r = await api('auth.login', { username: u, password: p, role: lgRole });
  b.disabled = false; b.innerHTML = t; hydrate(b);
  if (!r.success) { lgErr(r.message); return; }
  S.tk = r.data.token; if ($('#lgRem').checked) LS.s('cbt_tk', S.tk); else SS.s('cbt_tk', S.tk);
  $('#lgP').value = ''; applyBoot(r.data.boot); enterApp();
}
async function init() {
  hydrate(document.body);
  document.addEventListener('click', onClick); document.addEventListener('input', onInput); document.addEventListener('change', onInput);
  $('#lgForm').addEventListener('submit', e => { e.preventDefault(); doLogin(); });
  $('#lgTabs').addEventListener('click', e => { const b = e.target.closest('.tb'); if (!b) return; lgRole = b.dataset.role; $$('#lgTabs .tb').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); }); $('#lgUL').textContent = LGL[lgRole][0]; $('#lgU').placeholder = LGL[lgRole][1]; lgErr(''); });
  $('#lgEye').addEventListener('click', () => { const p = $('#lgP'), h = p.type === 'password'; p.type = h ? 'text' : 'password'; $('#lgEye').innerHTML = ic(h ? 'eyeoff' : 'eye'); });
  $('#burger').onclick = openSide; $('#scrim').onclick = closeSide; $('#btnOut').onclick = $('#btnOut2').onclick = logout; $('#btnSet').onclick = gantiSandi;
  setInterval(() => { if (S.tk && S.me && !document.hidden && !(E && E.on) && Date.now() - S.t > 60000) refresh(); }, 15000);
  if (!GAS_OK()) { showLogin(); lgErr('URL backend belum diatur. Isi GAS_URL di js/config.js, lalu push ulang ke GitHub.'); $('#lgBtn').disabled = true; return; }
  warmUp();
  const tk = LS.g('cbt_tk') || SS.g('cbt_tk');
  if (!tk) { showLogin(); return; }
  S.tk = tk; const bc = SS.g('cbt_boot') || LS.g('cbt_boot_s');
  if (bc && bc.me) { S.B = bc; S.me = bc.me; S.off = bc.serverNow - Date.now(); enterApp(); refresh(); }   // paint instan dari cache, validasi di latar belakang
  else { const r = await api('boot'); if (r.success) { applyBoot(r.data); enterApp(); } else showLogin(); }
}
function gantiSandi() {
  formModal({ title: 'Ganti kata sandi', fields: [{ k: 'lama', l: 'Sandi lama', t: 'password', req: true, full: true }, { k: 'baru', l: 'Sandi baru', t: 'password', req: true, full: true, hint: 'Minimal 8 karakter, kombinasi huruf dan angka.' }, { k: 'ulang', l: 'Ulangi sandi baru', t: 'password', req: true, full: true }],
    onSave: async v => { if (v.baru !== v.ulang) { toast('Pengulangan sandi tidak sama.', 'e'); return true; } const r = await api('auth.ganti', { lama: v.lama, baru: v.baru }); if (!r.success) { toast(r.message, 'e'); return true; } S.tk = r.data.token; if (LS.g('cbt_tk')) LS.s('cbt_tk', S.tk); else SS.s('cbt_tk', S.tk); toast(r.message); return false; } });
}

/* ---------- Delegasi event ---------- */
const A = {}, IN = {};
function onClick(e) { const t = e.target.closest('[data-act]'); if (!t) return; const f = A[t.dataset.act]; if (f) f(t, e); }
function onInput(e) { const t = e.target.closest('[data-in]'); if (!t) return; const f = IN[t.dataset.in]; if (f) f(t, e); }
A.go = t => go(t.dataset.id);
A.tab = t => { S.tabs[t.dataset.id] = t.dataset.v; rerender(); };
A.dtp = t => { const st = DT[t.dataset.id]; st.p += N(t.dataset.d); dtPaint(t.dataset.id); };
IN.dtq = debounce(t => { const st = DT[t.dataset.id]; st.q = t.value; st.p = 1; dtPaint(t.dataset.id); }, 180);
IN.flt = t => { (S.flt[t.dataset.id] = S.flt[t.dataset.id] || {})[t.dataset.k] = t.value; if (DT[t.dataset.id]) { DT[t.dataset.id].p = 1; dtPaint(t.dataset.id); } else rerender(); };
const flt = (id, k) => (S.flt[id] || {})[k] || '';
const mapelNama = id => { const m = S.B.mapel.find(x => x.ID === id); return m ? m.Nama : id; };
const optMapel = (all, only) => (all ? [['', 'Semua mapel']] : []).concat(S.B.mapel.filter(m => !only || only.indexOf(m.ID) >= 0).map(m => [m.ID, m.Nama]));
const optJadwal = all => (all ? [['', 'Semua ujian']] : []).concat(S.B.jadwal.slice().sort((a, b) => (b.Tanggal + b.Mulai).localeCompare(a.Tanggal + a.Mulai)).map(j => [j.ID, j.Nama + ' · ' + tglS(j.Tanggal)]));
const selH = (id, k, opts, cur, extra) => `<select class="sel" style="width:auto;min-width:160px;max-width:100%" data-in="flt" data-id="${id}" data-k="${k}" aria-label="${esc(k)}" ${extra || ''}>${opts.map(o => `<option value="${esc(o[0])}" ${String(o[0]) === String(cur) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
const statBdg = s => s === 'berlangsung' ? '<span class="bdg g"><span class="dot"></span>Berlangsung</span>' : s === 'akan' ? '<span class="bdg b">Akan datang</span>' : '<span class="bdg">Selesai</span>';
const kpi = (c, l, v, i, ft) => `<div class="kpi ${c}"><div class="lb"><span>${l}</span><span class="ib">${ic(i)}</span></div><div class="v">${v}</div><div class="ft">${ft}</div></div>`;

