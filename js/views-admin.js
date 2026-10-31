/* js/views-admin.js : halaman Admin & Guru */
'use strict';
/* =====================================================================
   VIEW ADMIN & GURU
   ===================================================================== */
V.dash = { t: 'Dashboard', i: 'dash', r: rDash };
function rDash(el) {
  const B = S.B, hs = B.hasil, js = B.jadwal, st = js.map(stat), tab = S.tabs.dash || 'all';
  const sekolah = new Set(B.siswa.map(s => s.Sekolah)).size, berl = st.filter(x => x === 'berlangsung').length, akan = st.filter(x => x === 'akan').length, pel = hs.reduce((a, h) => a + h.pel, 0);
  const jl = js.map((j, i) => [j, st[i]]).filter(x => tab === 'all' || x[1] === tab).sort((a, b) => (b[0].Tanggal + b[0].Mulai).localeCompare(a[0].Tanggal + a[0].Mulai)).slice(0, 6);
  const rec = hs.slice().sort((a, b) => b.selesai - a.selesai).slice(0, 5);
  el.innerHTML = `
  <div style="margin-bottom:20px"><h2 style="font-size:22px;line-height:30px">${sapa()}, ${esc(S.me.nama.split(' ')[0])}</h2><p class="muted">Ringkasan pelaksanaan ujian · TA ${esc(B.cfg.TAHUN_AJARAN)}</p></div>
  <div class="grid g4">
    ${kpi('k1', 'Total Siswa', fmt(B.siswa.length, 0), 'users', `<span>${sekolah} sekolah</span><span>${new Set(B.siswa.map(s => s.Kelas + s.Sekolah)).size} kelas</span>`)}
    ${kpi('k2', 'Total Guru', fmt(B.guru.length, 0), 'user', `<span>${B.mapel.length} mata pelajaran</span><span>${B.bank.length} soal</span>`)}
    ${kpi('k3', 'Total Ujian', fmt(js.length, 0), 'cal', `<span>Berlangsung ${berl}</span><span>Akan datang ${akan}</span>`)}
    ${kpi('k4', 'Peserta Selesai', fmt(hs.length, 0), 'checkc', `<span>Pelanggaran tercatat</span><span>${pel}</span>`)}
  </div>
  <div class="grid g21" style="margin-top:20px">
    <div class="card"><div class="ch"><h3>Jadwal Ujian</h3><span class="sp"></span>${tabsH('dash', [['all', 'Semua'], ['berlangsung', 'Berlangsung'], ['akan', 'Akan datang'], ['selesai', 'Selesai']], tab)}</div>
      ${jl.length ? jl.map(([j, s]) => `<div class="li"><span class="ibub ${s === 'berlangsung' ? '' : s === 'akan' ? 'b' : 'v'}">${ic('book')}</span><div style="flex:1;min-width:0"><div class="b" style="color:var(--t1)">${esc(j.Nama)}</div><div class="small muted">${esc(mapelNama(j.MapelID))} · Kelas ${esc(j.Kelas)} · ${tglS(j.Tanggal)} ${j.Mulai}–${j.Selesai} WIB · ${j.Durasi} mnt</div></div>${statBdg(s)}<span class="small muted" style="min-width:64px;text-align:right">${hs.filter(h => h.jid === j.ID).length} selesai</span></div>`).join('') : empty('Tidak ada jadwal pada kategori ini.', 'cal')}</div>
    <div class="card"><div class="ch"><h3>Partisipasi Siswa</h3><span class="sp"></span><span class="small muted">7 hari terakhir</span></div><div class="cv"><canvas id="cPart" aria-label="Grafik partisipasi"></canvas></div></div>
  </div>
  <div class="grid g21" style="margin-top:20px">
    <div class="card"><h3 style="margin-bottom:8px">Peserta Selesai Terbaru</h3>${rec.length ? rec.map(h => `<div class="li"><span class="av">${ini(h.nama)}</span><div style="flex:1;min-width:0"><div class="b" style="color:var(--t1)">${esc(h.nama)}</div><div class="small muted">${esc(h.kelas)} · ${esc(h.sekolah)}</div></div><span class="mono small muted">${jam(h.selesai)}</span>${h.pel ? `<span class="bdg a">${h.pel}× pelanggaran</span>` : ''}<span class="b mono" style="min-width:44px;text-align:right;color:var(--em-d)">${fmt(h.nilai)}</span></div>`).join('') : empty('Belum ada peserta yang menyelesaikan ujian.', 'users')}</div>
    <div class="card"><div class="ch"><h3>Komposisi Nilai</h3></div>${hs.length ? donutH('cDon', hs) : empty('Belum ada nilai.', 'chart')}</div>
  </div>
  <div class="card" style="margin-top:20px"><h3 style="margin-bottom:8px">Aktivitas Sistem Terbaru</h3>${(B.log || []).length ? B.log.slice(0, 6).map(l => `<div class="li"><span class="ibub a">${ic('clock')}</span><div style="flex:1"><span class="b" style="color:var(--t1)">${esc(l.Aksi.replace(/_/g, ' '))}</span> <span class="muted small">· ${esc(l.Aktor)} ${esc(l.Detail)}</span></div><span class="small muted mono">${new Date(N(l.Waktu)).toLocaleString('id-ID', { timeZone: TZ, day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })}</span></div>`).join('') : empty('Belum ada aktivitas.', 'clock')}</div>`;
  const days = []; for (let i = 6; i >= 0; i--) days.push(tglKey(nowMs() - i * 864e5));
  const cnt = days.map(d => hs.filter(h => tglKey(h.selesai) === d).length);
  chart('cPart', { type: 'line', data: { labels: days.map(d => tglS(d)), datasets: [{ data: cnt, borderColor: '#059669', backgroundColor: 'rgba(16,185,129,.14)', fill: true, tension: .4, pointRadius: 3, pointBackgroundColor: '#059669' }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#E2E8F0' } }, x: { grid: { display: false } } } } });
}

/* ---- Data master ---- */
V.master = { t: 'Data Master', i: 'db', r: rMaster };
const MASTER = {
  siswa: { ent: 'Siswa', l: 'Siswa', key: 'NISN' }, guru: { ent: 'Guru', l: 'Guru', key: 'NIP' }, kelas: { ent: 'Kelas', l: 'Kelas', key: 'ID' }, mapel: { ent: 'Mapel', l: 'Mata Pelajaran', key: 'ID' }
};
function rMaster(el) {
  const B = S.B, tab = S.tabs.master || 'siswa', M = MASTER[tab], act = (a, id, i, t, c) => `<button class="bt g ib ${c || ''}" data-act="${a}" data-id="${esc(id)}" data-e="${tab}" title="${t}" aria-label="${t}">${ic(i, 's')}</button>`;
  let cols = [];
  if (tab === 'siswa') cols = [{ h: 'NISN', f: r => `<span class="mono">${esc(r.NISN)}</span>` }, { h: 'Nama', f: r => `<span class="b" style="color:var(--t1)">${esc(r.Nama)}</span>` }, { h: 'Kelas', f: r => esc(r.Kelas) }, { h: 'Sekolah', f: r => esc(r.Sekolah) }, { h: 'No. Ujian', f: r => `<span class="mono">${esc(r.NoUjian)}</span>` }, { h: 'Ruang / Sesi', f: r => esc(r.Ruang) + ' · ' + esc(r.Sesi) }];
  if (tab === 'guru') cols = [{ h: 'NIP', f: r => `<span class="mono">${esc(r.NIP)}</span>` }, { h: 'Nama', f: r => `<span class="b" style="color:var(--t1)">${esc(r.Nama)}</span>` }, { h: 'Sekolah', f: r => esc(r.Sekolah) }, { h: 'Mapel', f: r => daf(r.Mapel).map(m => `<span class="bdg g">${esc(m)}</span>`).join(' ') }, { h: 'Kelas diampu', f: r => esc(r.Kelas) }];
  if (tab === 'kelas') cols = [{ h: 'Kelas', f: r => `<span class="b" style="color:var(--t1)">${esc(r.Nama)}</span>` }, { h: 'Sekolah', f: r => esc(r.Sekolah) }, { h: 'Wali kelas', f: r => esc(r.WaliKelas) }, { h: 'Siswa', f: r => B.siswa.filter(s => s.Kelas === r.Nama && s.Sekolah === r.Sekolah).length }];
  if (tab === 'mapel') cols = [{ h: 'Kode', f: r => `<span class="mono b">${esc(r.ID)}</span>` }, { h: 'Nama', f: r => `<span class="b" style="color:var(--t1)">${esc(r.Nama)}</span>` }, { h: 'KKM', f: r => esc(r.KKM) }, { h: 'Jumlah soal', f: r => B.bank.filter(s => s.mapel === r.ID).length }];
  cols.push({ h: 'Aksi', cls: 'right', f: r => `<div class="row" style="justify-content:flex-end;gap:2px;flex-wrap:nowrap">${tab === 'siswa' ? act('kartu', r.NISN, 'idcard', 'Cetak kartu') : ''}${tab === 'siswa' || tab === 'guru' ? act('reset', r[M.key], 'key', 'Reset sandi') : ''}${act('medit', r[M.key], 'edit', 'Ubah')}${act('mdel', r[M.key], 'trash', 'Hapus', '')}</div>` });
  const rows = () => B[tab];
  el.innerHTML = `<div class="card"><div class="ch">${tabsH('master', [['siswa', 'Siswa'], ['guru', 'Guru'], ['kelas', 'Kelas'], ['mapel', 'Mata Pelajaran']], tab)}<span class="sp"></span>${tab === 'siswa' || tab === 'guru' ? `<button class="bt o" data-act="mimpor" data-e="${tab}">${ic('upload', 's')} Impor dari Sheets</button>` : ''}<button class="bt p" data-act="medit" data-e="${tab}" data-id="">${ic('plus', 's')} Tambah ${M.l}</button></div>
  ${dtable('m' + tab, cols, rows, { ph: 'Cari ' + M.l.toLowerCase() + '…', text: r => Object.values(r).join(' '), empty: 'Belum ada data ' + M.l.toLowerCase() + '.' })}</div>`;
}
const daf = s => String(s || '').split(/[,;]/).map(x => x.trim()).filter(Boolean);
A.medit = t => {
  const e = t.dataset.e, M = MASTER[e], id = t.dataset.id, old = id ? S.B[e].find(x => String(x[M.key]) === id) : null, B = S.B;
  let fields;
  if (e === 'siswa') {
    const kp = B.kelas.length ? [{ k: 'kp', l: 'Kelas (rombel & sekolah)', t: 'select', req: true, full: true, opts: B.kelas.map(k => [k.Nama + '|' + k.Sekolah, k.Nama + ' — ' + k.Sekolah]) }] : [{ k: 'Kelas', l: 'Kelas', req: true, ph: 'IX-A' }, { k: 'Sekolah', l: 'Sekolah', req: true }];
    fields = [{ k: 'NISN', l: 'NISN', req: true, ro: !!old, hint: 'Angka saja. Menjadi username login siswa.' }, { k: 'Nama', l: 'Nama lengkap', req: true }].concat(kp, [{ k: 'NoUjian', l: 'Nomor peserta ujian', hint: 'Kosongkan untuk dibuat otomatis.' }, { k: 'Ruang', l: 'Ruang CBT', ph: 'Lab Komputer 01' }, { k: 'Sesi', l: 'Sesi', ph: 'Sesi 1 (Pagi)' }]);
  } else if (e === 'guru') fields = [{ k: 'NIP', l: 'NIP', req: true, ro: !!old }, { k: 'Nama', l: 'Nama lengkap', req: true }, { k: 'Sekolah', l: 'Sekolah', req: true, full: true }, { k: 'Mapel', l: 'Kode mapel diampu', ph: 'MTK,IPA', hint: 'Pisahkan dengan koma. Tersedia: ' + B.mapel.map(m => m.ID).join(', ') }, { k: 'Kelas', l: 'Kelas diampu', ph: 'IX atau IX-A', hint: '"IX" mencakup semua IX-…; pisahkan dengan koma.' }];
  else if (e === 'kelas') fields = [{ k: 'Nama', l: 'Nama kelas', req: true, ph: 'IX-A' }, { k: 'Sekolah', l: 'Sekolah', req: true }, { k: 'WaliKelas', l: 'Wali kelas', full: true }];
  else fields = [{ k: 'ID', l: 'Kode mapel', req: true, ro: !!old, ph: 'MTK' }, { k: 'Nama', l: 'Nama mata pelajaran', req: true }, { k: 'KKM', l: 'KKM', t: 'number', def: 75, min: 0 }];
  const vals = old ? Object.assign({}, old, { kp: old.Kelas + '|' + old.Sekolah }) : {};
  formModal({ title: (old ? 'Ubah ' : 'Tambah ') + M.l, fields, values: vals, onSave: async v => {
    if (v.kp) { const p = v.kp.split('|'); v.Kelas = p[0]; v.Sekolah = p[1]; delete v.kp; }
    if (e === 'kelas') v.ID = old ? old.ID : uid();
    const r = await saveRows(M.ent, [v], { noOptimistic: e === 'siswa' });
    if (r.success) toast('Data tersimpan.'); return r.success ? false : true;
  } });
};
A.mdel = async t => { const e = t.dataset.e, M = MASTER[e]; if (await confirmBox({ title: 'Hapus data?', msg: 'Data akan dihapus permanen' + (e === 'siswa' || e === 'guru' ? ' beserta akun login-nya' : '') + '.', ok: 'Hapus', danger: true })) hapusRows(M.ent, [t.dataset.id]); };
A.reset = async t => {
  const e = t.dataset.e; if (!await confirmBox({ title: 'Reset kata sandi?', msg: 'Sandi baru dibuat acak dan sesi login lama dicabut.', ok: 'Reset' })) return;
  setSync('sync'); const r = await api('akun.reset', { username: t.dataset.id }); setSync(r.success ? 'ok' : 'err');
  if (r.success) showAkun([r.data]); else toast(r.message, 'e');
};
A.kartu = t => cetak(t, 'cetak.kartu', { nisn: t.dataset.id });

/* ---- Impor dari Sheets (tempel) ---- */
function parseTable(txt) {
  txt = txt.replace(/\r/g, ''); const d = txt.indexOf('\t') >= 0 ? '\t' : (txt.split('\n')[0].split(';').length > txt.split('\n')[0].split(',').length ? ';' : ',');
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < txt.length; i++) { const c = txt[i];
    if (q) { if (c === '"') { if (txt[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === d) { row.push(cur); cur = ''; } else if (c === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; } else cur += c; }
  row.push(cur); rows.push(row);
  return rows.filter(r => r.some(x => x.trim() !== ''));
}
const IMPOR = { Siswa: ['NISN', 'Nama', 'Kelas', 'Sekolah', 'NoUjian', 'Ruang', 'Sesi'], Guru: ['NIP', 'Nama', 'Sekolah', 'Mapel', 'Kelas'], BankSoal: ['MapelID', 'Jenis', 'Pertanyaan', 'A', 'B', 'C', 'D', 'E', 'Kunci', 'Bobot'] };
function imporModal(ent) {
  const cols = IMPOR[ent];
  modal({ title: 'Impor ' + ent + ' dari Google Sheets / Excel', wide: true, body: `<p class="muted" style="margin-bottom:8px">Salin sel dari Sheets <b>termasuk baris judul</b>, lalu tempel di bawah. Kolom: <span class="mono">${cols.join(', ')}</span>.</p><textarea class="ta mono" id="imTxt" style="min-height:200px;font-size:12px" placeholder="${cols.join('\t')}"></textarea><div id="imInfo" class="hint"></div>`,
    actions: [{ t: 'Batal', cls: 'o' }, { t: ic('upload', 's') + ' Impor', cls: 'p', fn: async (m, btn) => {
      const rows = parseTable($('#imTxt', m).value); if (rows.length < 2) { toast('Tempel data dengan baris judul + minimal 1 baris data.', 'e'); return true; }
      const head = rows[0].map(h => h.trim().toLowerCase().replace(/[^a-z]/g, '')), idx = {}; cols.forEach(c => { const i = head.indexOf(c.toLowerCase()); if (i >= 0) idx[c] = i; });
      const need = cols.slice(0, ent === 'Siswa' ? 4 : ent === 'Guru' ? 3 : 3); const miss = need.filter(c => idx[c] === undefined);
      if (miss.length) { toast('Kolom wajib tidak ditemukan: ' + miss.join(', '), 'e'); return true; }
      const data = rows.slice(1).map(r => { const o = {}; Object.keys(idx).forEach(c => o[c] = (r[idx[c]] || '').trim()); return o; });
      const info = $('#imInfo', m), akun = []; let okN = 0; btn.innerHTML = '<span class="spin xs"></span> Mengimpor…';
      for (let i = 0; i < data.length; i += 120) {
        info.textContent = 'Memproses ' + Math.min(i + 120, data.length) + ' / ' + data.length + '…';
        const r = await api('crud.simpan', { entity: ent, rows: data.slice(i, i + 120) });
        if (!r.success) { toast(r.message + ' (' + okN + ' baris sebelumnya sudah tersimpan)', 'e'); await refresh(); return true; }
        okN += r.data.rows.length; (r.data.akunBaru || []).forEach(a => akun.push(a));
      }
      await refresh(); toast(okN + ' baris berhasil diimpor.'); if (akun.length) showAkun(akun); return false;
    } }] });
}
A.mimpor = t => imporModal(MASTER[t.dataset.e].ent);
A.bimpor = () => imporModal('BankSoal');

/* ---- Bank soal (admin + guru) ---- */
V.bank = { t: 'Bank Soal', i: 'book', r: rBank };
function rBank(el) {
  const B = S.B, own = S.me.role === 'guru' ? daf(B.guru.Mapel) : null;
  const rows = () => B.bank.filter(s => (!flt('bank', 'm') || s.mapel === flt('bank', 'm')) && (!flt('bank', 'j') || s.jenis === flt('bank', 'j')));
  const cols = [{ h: 'Mapel', f: r => `<span class="bdg g">${esc(r.mapel)}</span>` }, { h: 'Jenis', f: r => r.jenis === 'PG' ? '<span class="bdg b">Pilihan ganda</span>' : '<span class="bdg v">Esai</span>' }, { h: 'Pertanyaan', cls: 'q', f: r => `<span title="${esc(r.q)}">${esc(r.q)}</span>` }, { h: 'Kunci', f: r => r.jenis === 'PG' ? `<span class="b mono">${esc(r.kunci)}</span>` : '<span class="muted">—</span>' }, { h: 'Bobot', f: r => esc(r.bobot) },
    { h: 'Aksi', cls: 'right', f: r => `<div class="row" style="justify-content:flex-end;gap:2px;flex-wrap:nowrap"><button class="bt g ib" data-act="sedit" data-id="${esc(r.id)}" aria-label="Ubah">${ic('edit', 's')}</button><button class="bt g ib" data-act="sdel" data-id="${esc(r.id)}" aria-label="Hapus">${ic('trash', 's')}</button></div>` }];
  el.innerHTML = `<div class="card"><div class="ch"><div class="row">${selH('bank', 'm', optMapel(true, own), flt('bank', 'm'))}${selH('bank', 'j', [['', 'Semua jenis'], ['PG', 'Pilihan ganda'], ['ESAI', 'Esai']], flt('bank', 'j'))}</div><span class="sp"></span><button class="bt o" data-act="bimpor">${ic('upload', 's')} Impor</button><button class="bt p" data-act="sedit" data-id="">${ic('plus', 's')} Tambah Soal</button></div>
  ${dtable('bank', cols, rows, { ph: 'Cari pertanyaan…', text: r => r.q + r.mapel, empty: 'Belum ada soal. Klik "Tambah Soal" atau impor dari Sheets.', per: 20 })}</div>`;
}
A.sedit = t => {
  const B = S.B, id = t.dataset.id, old = id ? B.bank.find(s => s.id === id) : null, own = S.me.role === 'guru' ? daf(B.guru.Mapel) : null;
  const L = ['A', 'B', 'C', 'D', 'E'], v = old ? { MapelID: old.mapel, Jenis: old.jenis, Pertanyaan: old.q, A: old.A, B: old.B, C: old.C, D: old.D, E: old.E, Kunci: old.kunci, Bobot: old.bobot } : { Jenis: 'PG', Bobot: 1, MapelID: flt('bank', 'm') || (B.mapel[0] || {}).ID };
  const fields = [{ k: 'MapelID', l: 'Mata pelajaran', t: 'select', req: true, opts: optMapel(false, own) }, { k: 'Jenis', l: 'Jenis soal', t: 'select', req: true, opts: [['PG', 'Pilihan ganda (A–E)'], ['ESAI', 'Esai']] }, { k: 'Pertanyaan', l: 'Pertanyaan', t: 'textarea', req: true, full: true }]
    .concat(L.map(x => ({ k: x, l: 'Opsi ' + x, full: true, cls: 'pgonly', req: x === 'A' || x === 'B' })), [{ k: 'Kunci', l: 'Kunci jawaban', t: 'select', cls: 'pgonly', opts: L.map(x => [x, x]) }, { k: 'Bobot', l: 'Bobot nilai', t: 'number', min: 0 }]);
  formModal({ title: old ? 'Ubah soal' : 'Tambah soal', wide: true, fields, values: v, onReady: m => {
    const sync = () => { const es = $('#f_Jenis', m).value === 'ESAI'; $$('.pgonly', m).forEach(x => x.classList.toggle('hide', es)); }; $('#f_Jenis', m).addEventListener('change', sync); sync();
  }, onSave: async x => {
    if (x.Jenis === 'PG' && (!x.A || !x.B)) { toast('Soal pilihan ganda minimal punya opsi A dan B.', 'e'); return true; }
    if (x.Jenis === 'PG' && !x[x.Kunci]) { toast('Opsi untuk kunci jawaban ' + x.Kunci + ' belum diisi.', 'e'); return true; }
    x.ID = old ? old.id : uid(); if (x.Jenis === 'ESAI') { x.A = x.B = x.C = x.D = x.E = ''; x.Kunci = ''; }
    const r = await saveRows('BankSoal', [x]); if (r.success) toast('Soal tersimpan.'); return r.success ? false : true;
  } });
};
A.sdel = async t => { if (await confirmBox({ title: 'Hapus soal?', msg: 'Soal akan dihapus permanen dari bank soal.', ok: 'Hapus', danger: true })) hapusRows('BankSoal', [t.dataset.id]); };

/* ---- Jadwal & Token (admin) ---- */
V.jadwal = { t: 'Jadwal & Token', i: 'cal', r: rJadwal };
function rJadwal(el) {
  const B = S.B, tk = {}; B.token.forEach(t => tk[t.JadwalID] = t);
  const rows = () => B.jadwal.slice().sort((a, b) => (b.Tanggal + b.Mulai).localeCompare(a.Tanggal + a.Mulai));
  const cols = [{ h: 'Ujian', f: r => `<div class="b" style="color:var(--t1)">${esc(r.Nama)}</div><div class="small muted">${esc(mapelNama(r.MapelID))} · Kelas ${esc(r.Kelas)}</div>` }, { h: 'Waktu', f: r => `${tglS(r.Tanggal)}<div class="small muted mono">${r.Mulai}–${r.Selesai} · ${r.Durasi} mnt</div>` }, { h: 'Status', f: r => statBdg(stat(r)) },
    { h: 'Token', f: r => { const t = tk[r.ID]; return t ? `<span class="mono b" style="font-size:16px;letter-spacing:.12em;color:${t.Status === 'aktif' ? 'var(--em-d)' : 'var(--t4)'}">${esc(t.Kode.slice(0, 3))}-${esc(t.Kode.slice(3))}</span> <span class="bdg ${t.Status === 'aktif' ? 'g' : ''}">${t.Status}</span>` : '<span class="muted">Belum diterbitkan</span>'; } },
    { h: 'Aksi', cls: 'right', f: r => { const t = tk[r.ID]; return `<div class="row" style="justify-content:flex-end;gap:4px;flex-wrap:nowrap"><button class="bt o sm" data-act="ttbt" data-id="${esc(r.ID)}">${ic('key', 's')} ${t ? 'Terbitkan ulang' : 'Terbitkan'}</button>${t ? `<button class="bt o sm" data-act="ttog" data-id="${esc(r.ID)}" data-on="${t.Status === 'aktif' ? 0 : 1}">${t.Status === 'aktif' ? 'Nonaktifkan' : 'Aktifkan'}</button>` : ''}<button class="bt g ib" data-act="jedit" data-id="${esc(r.ID)}" aria-label="Ubah">${ic('edit', 's')}</button><button class="bt g ib" data-act="jdel" data-id="${esc(r.ID)}" aria-label="Hapus">${ic('trash', 's')}</button></div>`; } }];
  el.innerHTML = `<div class="card"><div class="ch"><div><h3>Jadwal ujian & token</h3><p class="small muted">Token hanya berlaku di dalam jendela waktu jadwal. Terbitkan token saat sesi dimulai dan bagikan lewat pengawas ruang.</p></div><span class="sp"></span><button class="bt p" data-act="jedit" data-id="">${ic('plus', 's')} Buat Jadwal</button></div>${dtable('jad', cols, rows, { ph: 'Cari ujian…', text: r => r.Nama + r.MapelID, empty: 'Belum ada jadwal ujian.', per: 15 })}</div>`;
}
A.jedit = t => {
  const B = S.B, id = t.dataset.id, old = id ? B.jadwal.find(j => j.ID === id) : null, today = tglKey(nowMs());
  formModal({ title: old ? 'Ubah jadwal' : 'Buat jadwal ujian', wide: true, values: old || { Tanggal: today, Mulai: '08:00', Selesai: '10:00', Durasi: 90, JumlahSoal: 0, Acak: 'ya', Kelas: 'IX' }, fields: [
    { k: 'Nama', l: 'Nama ujian', req: true, full: true, ph: 'Penilaian Akhir Semester – Matematika IX' }, { k: 'MapelID', l: 'Mata pelajaran', t: 'select', req: true, opts: optMapel(false) }, { k: 'Kelas', l: 'Kelas peserta', req: true, hint: '"IX" = semua kelas IX; "IX-A" = satu kelas; "ALL" = semua. Pisahkan dengan koma.' },
    { k: 'Tanggal', l: 'Tanggal', t: 'date', req: true }, { k: 'Durasi', l: 'Durasi (menit)', t: 'number', req: true, min: 1 }, { k: 'Mulai', l: 'Jendela mulai (WIB)', t: 'time', req: true }, { k: 'Selesai', l: 'Jendela selesai (WIB)', t: 'time', req: true }, { k: 'JumlahSoal', l: 'Jumlah soal', t: 'number', min: 0, hint: '0 = semua soal bank mapel ini.' }, { k: 'Acak', l: 'Acak urutan soal', t: 'select', opts: [['ya', 'Ya'], ['tidak', 'Tidak']] }],
    onSave: async v => { v.ID = old ? old.ID : uid(); const r = await saveRows('Jadwal', [v]); if (r.success) toast('Jadwal tersimpan.'); return r.success ? false : true; } });
};
A.jdel = async t => { if (await confirmBox({ title: 'Hapus jadwal?', msg: 'Jadwal dan token terkait akan dihapus. Hasil ujian yang sudah ada tetap tersimpan.', ok: 'Hapus', danger: true })) hapusRows('Jadwal', [t.dataset.id]); };
A.ttbt = async t => {
  const id = t.dataset.id, old = S.B.token.find(x => x.JadwalID === id);
  if (old && !await confirmBox({ title: 'Terbitkan token baru?', msg: 'Token lama langsung tidak berlaku.', ok: 'Terbitkan' })) return;
  t.disabled = true; setSync('sync'); const r = await api('token.terbit', { jadwalId: id }); setSync(r.success ? 'ok' : 'err');
  if (!r.success) { t.disabled = false; toast(r.message, 'e'); return; }
  S.B.token = S.B.token.filter(x => x.JadwalID !== id).concat([r.data]); persist(); rerender();
  const k = r.data.Kode; modal({ title: 'Token ujian', narrow: true, body: `<div class="center" style="padding:10px 0"><div class="small muted">Berikan kode ini kepada peserta di ruang ujian</div><div class="mono" style="font-size:40px;font-weight:700;letter-spacing:.2em;color:var(--em-d);margin:10px 0">${k.slice(0, 3)}-${k.slice(3)}</div></div>`, actions: [{ t: ic('copy', 's') + ' Salin', cls: 'o', fn: () => { try { navigator.clipboard.writeText(k); toast('Token disalin.'); } catch (e) {} return true; } }, { t: 'Tutup', cls: 'p' }] });
};
A.ttog = async t => {
  const id = t.dataset.id, on = t.dataset.on === '1'; setSync('sync'); const r = await api('token.toggle', { jadwalId: id, aktif: on });
  if (!r.success) { setSync('err'); toast(r.message, 'e'); return; } setSync('ok'); S.B.token = S.B.token.map(x => x.JadwalID === id ? r.data : x); persist(); rerender(); toast(r.message);
};

/* ---- Monitor pelanggaran (admin) ---- */
V.monitor = { t: 'Monitor & Pelanggaran', i: 'monitor', r: rMonitor, leave: () => { clearInterval(S.monT); S.monT = null; } };
function rMonitor(el) {
  const B = S.B; if (!flt('mon', 'j')) { const a = B.jadwal.find(j => stat(j) === 'berlangsung') || B.jadwal[0]; if (a) (S.flt.mon = S.flt.mon || {}).j = a.ID; }
  const jid = flt('mon', 'j'), M = S.mon && S.mon.jadwal === jid ? S.mon : null;
  el.innerHTML = `<div class="card"><div class="ch">${selH('mon', 'j', optJadwal(false), jid, 'data-force="1"')}<span class="sp"></span><span class="small muted" id="monAt">${M ? 'Diperbarui ' + jam(M.at) : ''}</span><button class="bt o" data-act="monload">${ic('refresh', 's')} Segarkan</button></div>
  <p class="small muted" style="margin-bottom:12px">Setiap kali siswa berpindah tab atau meninggalkan halaman ujian, sistem mencatat waktu dan jumlah kejadiannya. Admin dapat memblokir akun siswa dari ujian berikutnya. Batas kunci otomatis: <b>${esc(B.cfg.BATAS_PELANGGARAN)}×</b> (0 = nonaktif).</p>
  <div id="monBody">${M ? monTable(M) : '<div class="empty"><div class="spin"></div></div>'}</div></div>`;
  if (!M) loadMon(); if (!S.monT) S.monT = setInterval(() => { if (S.view === 'monitor' && !document.hidden) loadMon(true); }, 20000);
}
function monTable(M) {
  const rows = M.rows.slice().sort((a, b) => b.pel - a.pel || a.nama.localeCompare(b.nama)), c = { belum: 0, berlangsung: 0, selesai: 0 }; rows.forEach(r => c[r.status]++);
  return `<div class="row" style="margin-bottom:12px"><span class="bdg">Belum mulai ${c.belum}</span><span class="bdg g"><span class="dot"></span>Mengerjakan ${c.berlangsung}</span><span class="bdg b">Selesai ${c.selesai}</span><span class="bdg a">Pelanggaran ${rows.reduce((a, r) => a + r.pel, 0)}</span></div>` +
    (rows.length ? `<div class="tw"><table class="t"><thead><tr><th>Siswa</th><th>Kelas</th><th>Status</th><th class="right">Pelanggaran</th><th class="right">Nilai</th><th class="right">Akun</th></tr></thead><tbody>${rows.map(r => `<tr><td><div class="b" style="color:var(--t1)">${esc(r.nama)}</div><div class="small muted mono">${esc(r.nisn)}</div></td><td>${esc(r.kelas)}<div class="small muted">${esc(r.sekolah)}</div></td><td>${r.status === 'selesai' ? '<span class="bdg b">Selesai</span>' : r.status === 'berlangsung' ? '<span class="bdg g"><span class="dot"></span>Mengerjakan</span>' : '<span class="bdg">Belum mulai</span>'}</td><td class="right">${r.pel ? `<span class="bdg ${r.pel >= 3 ? 'r' : 'a'}">${r.pel}×</span>` : '<span class="muted">0</span>'}</td><td class="right mono">${r.nilai == null ? '—' : fmt(r.nilai)}</td><td class="right">${r.blokir ? `<button class="bt o sm" data-act="blok" data-id="${esc(r.nisn)}" data-b="0">Buka blokir</button>` : `<button class="bt d sm" data-act="blok" data-id="${esc(r.nisn)}" data-b="1">${ic('ban', 's')} Blokir</button>`}</td></tr>`).join('')}</tbody></table></div>` : empty('Tidak ada siswa yang terdaftar pada kelas peserta jadwal ini.', 'users'));
}
async function loadMon(quiet) {
  const jid = flt('mon', 'j'); if (!jid) return; const r = await api('monitor.get', { jadwalId: jid }); if (!r.success) { if (!quiet) toast(r.message, 'e'); return; }
  S.mon = r.data; if (S.view === 'monitor' && flt('mon', 'j') === jid) { const b = $('#monBody'); if (b) { b.innerHTML = monTable(r.data); hydrate(b); $('#monAt').textContent = 'Diperbarui ' + jam(r.data.at); } }
}
A.monload = () => loadMon();
A.blok = async t => {
  const b = t.dataset.b === '1'; if (b && !await confirmBox({ title: 'Blokir siswa?', msg: 'Akun siswa tidak bisa login atau memulai ujian berikutnya sampai blokir dibuka.', ok: 'Blokir', danger: true })) return;
  const row = S.mon.rows.find(r => r.nisn === t.dataset.id); row.blokir = b; $('#monBody').innerHTML = monTable(S.mon); hydrate($('#monBody'));
  const r = await api('siswa.blokir', { nisn: t.dataset.id, blokir: b }); if (!r.success) { row.blokir = !b; $('#monBody').innerHTML = monTable(S.mon); hydrate($('#monBody')); toast(r.message, 'e'); } else toast(r.message);
};
IN.monj = null;
const _flt = IN.flt; IN.flt = (t, e) => { _flt(t, e); if (t.dataset.id === 'mon') { S.mon = null; rerender(); } if (t.dataset.id === 'esai') { S.esai = null; rerender(); } };

/* ---- Rekap & ranking (admin) ---- */
V.rekap = { t: 'Rekap & Ranking', i: 'trophy', r: rRekap };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
function rankRows(list) { list.sort((a, b) => b.avg - a.avg); let r = 0, prev = null; list.forEach((x, i) => { if (prev === null || x.avg !== prev) r = i + 1; x.rank = r; prev = x.avg; }); return list; }
function rRekap(el) {
  const B = S.B, tab = S.tabs.rekap || 'siswa', jid = flt('rek', 'j'), hs = B.hasil.filter(h => !jid || h.jid === jid);
  let list = [], cols;
  if (tab === 'siswa') { const g = {}; hs.forEach(h => { (g[h.nisn] = g[h.nisn] || { n: h.nama, k: h.kelas, s: h.sekolah, a: [] }).a.push(h.nilai); }); list = rankRows(Object.keys(g).map(k => ({ nisn: k, n: g[k].n, k: g[k].k, s: g[k].s, avg: avg(g[k].a), cnt: g[k].a.length })));
    const kl = flt('rek', 'k'); if (kl) { list = list.filter(x => x.s + '|' + x.k === kl); rankRows(list); }
    cols = [{ h: 'Peringkat', f: r => rk(r.rank) }, { h: 'Nama', f: r => `<span class="b" style="color:var(--t1)">${esc(r.n)}</span><div class="small muted mono">${esc(r.nisn)}</div>` }, { h: 'Kelas', f: r => esc(r.k) }, { h: 'Sekolah', f: r => esc(r.s) }, { h: 'Ujian', f: r => r.cnt }, { h: 'Nilai rata-rata', cls: 'right', f: r => `<b class="mono" style="color:var(--em-d)">${fmt(r.avg)}</b>` }]; }
  else { const g = {}; hs.forEach(h => { const k = tab === 'kelas' ? h.sekolah + '|' + h.kelas : h.sekolah; (g[k] = g[k] || { a: [], n: new Set() }).a.push(h.nilai); g[k].n.add(h.nisn); });
    list = rankRows(Object.keys(g).map(k => ({ k, avg: avg(g[k].a), n: g[k].n.size, max: Math.max.apply(null, g[k].a), min: Math.min.apply(null, g[k].a) })));
    cols = [{ h: 'Peringkat', f: r => rk(r.rank) }, { h: tab === 'kelas' ? 'Kelas' : 'Sekolah', f: r => { const p = r.k.split('|'); return tab === 'kelas' ? `<span class="b" style="color:var(--t1)">${esc(p[1])}</span><div class="small muted">${esc(p[0])}</div>` : `<span class="b" style="color:var(--t1)">${esc(p[0])}</span>`; } }, { h: 'Peserta', f: r => r.n }, { h: 'Tertinggi', f: r => fmt(r.max) }, { h: 'Terendah', f: r => fmt(r.min) }, { h: 'Rata-rata', cls: 'right', f: r => `<b class="mono" style="color:var(--em-d)">${fmt(r.avg)}</b>` }]; }
  const kls = [['', 'Semua kelas']].concat(Array.from(new Set(B.siswa.map(s => s.Sekolah + '|' + s.Kelas))).sort().map(x => [x, x.split('|')[1] + ' — ' + x.split('|')[0]]));
  el.innerHTML = `<div class="card"><div class="ch">${tabsH('rekap', [['siswa', 'Per Siswa'], ['kelas', 'Per Kelas'], ['sekolah', 'Per Sekolah']], tab)}<span class="sp"></span>${selH('rek', 'j', optJadwal(true), jid)}${tab === 'siswa' ? selH('rek', 'k', kls, flt('rek', 'k')) : ''}<button class="bt p" data-act="lapor" ${jid ? '' : 'disabled title="Pilih satu ujian untuk mencetak laporan"'}>${ic('printer', 's')} Laporan PDF</button></div>
  <p class="small muted" style="margin-bottom:12px">Ranking dihitung otomatis dari nilai akhir${jid ? ' pada ujian terpilih' : ' (rata-rata seluruh ujian)'}.</p>${dtable('rek' + tab, cols, () => list, { ph: 'Cari…', text: r => JSON.stringify(r), empty: 'Belum ada hasil ujian untuk ditampilkan.' })}</div>`;
}
const rk = n => n <= 3 ? `<span class="bdg ${n === 1 ? 'a' : n === 2 ? '' : 'v'}" style="font-size:13px">${ic('trophy', 's')} ${n}</span>` : `<span class="mono b" style="padding-left:10px">${n}</span>`;
A.lapor = t => cetak(t, 'cetak.laporan', { jadwalId: flt('rek', 'j'), kelas: '' });

/* ---- Koreksi esai ---- */
V.esai = { t: 'Koreksi Esai', i: 'pen', r: rEsai };
function rEsai(el) {
  const B = S.B, jid = flt('esai', 'j'), E1 = S.esai && S.esai.jid === jid ? S.esai : null;
  el.innerHTML = `<div class="card"><div class="ch">${selH('esai', 'j', [['', 'Pilih ujian…']].concat(optJadwal(false)), jid, 'data-force="1"')}<span class="sp"></span>${E1 && E1.rows.length ? `<button class="bt p" data-act="esaisave">${ic('check', 's')} Simpan semua nilai</button>` : ''}</div>
  ${!jid ? empty('Pilih ujian untuk memuat jawaban esai siswa.', 'pen') : !E1 ? '<div class="empty"><div class="spin"></div></div>' : !E1.rows.length ? empty('Tidak ada jawaban esai pada ujian ini.', 'pen') : E1.rows.map((r, i) => `<div class="card" style="margin-bottom:12px;box-shadow:none"><div class="row"><span class="av">${ini(r.nama)}</span><div style="flex:1"><div class="b" style="color:var(--t1)">${esc(r.nama)}</div><div class="small muted">${esc(r.kelas)}</div></div><label class="small muted" for="es${i}">Skor (maks ${r.bobot})</label><input id="es${i}" class="in" type="number" min="0" max="${r.bobot}" step="0.5" style="width:90px" data-in="esk" data-i="${i}" value="${r.skor == null ? '' : r.skor}"></div><div class="small muted" style="margin:10px 0 4px">Soal</div><div style="white-space:pre-wrap">${esc(r.q)}</div><div class="small muted" style="margin:10px 0 4px">Jawaban siswa</div><div style="white-space:pre-wrap;background:var(--canvas);border-radius:8px;padding:10px">${r.jawaban ? esc(r.jawaban) : '<i class="muted">(Tidak dijawab)</i>'}</div></div>`).join('')}</div>`;
  if (jid && !E1) loadEsai(jid);
}
async function loadEsai(jid) { const r = await api('esai.list', { jadwalId: jid }); if (!r.success) { toast(r.message, 'e'); return; } S.esai = { jid, rows: r.data, dirty: {} }; if (S.view === 'esai') rerender(); }
IN.esk = t => { const r = S.esai.rows[+t.dataset.i]; r.skor = t.value === '' ? null : Math.max(0, Math.min(r.bobot, N(t.value))); S.esai.dirty[t.dataset.i] = 1; };
A.esaisave = async t => {
  const items = S.esai.rows.filter(r => r.skor != null).map(r => ({ sesi: r.sesi, soal: r.soal, skor: r.skor })); if (!items.length) { toast('Belum ada skor yang diisi.', 'w'); return; }
  t.disabled = true; setSync('sync'); const r = await api('esai.nilai', { items }); t.disabled = false; setSync(r.success ? 'ok' : 'err'); if (r.success) { toast(r.message); refresh(); } else toast(r.message, 'e');
};

/* ---- Cetak ---- */
V.cetak = { t: 'Cetak Dokumen', i: 'printer', r: rCetak };
function rCetak(el) {
  const B = S.B, kls = Array.from(new Set(B.siswa.map(s => s.Sekolah + '|' + s.Kelas))).sort().map(x => [x, x.split('|')[1] + ' — ' + x.split('|')[0]]);
  el.innerHTML = `<div class="grid g2"><div class="card"><div class="ch"><span class="ibub">${ic('idcard')}</span><h3>Kartu peserta (PDF)</h3></div><p class="muted" style="margin-bottom:12px">Cetak kartu semua siswa dalam satu kelas (maks. 60 per berkas). Untuk satu siswa, gunakan tombol kartu di Data Master.</p>
    <div class="fg"><label class="fl" for="ck">Kelas</label>${kls.length ? `<select class="sel" id="ck">${kls.map(k => `<option value="${esc(k[0])}">${esc(k[1])}</option>`).join('')}</select>` : '<div class="muted">Belum ada siswa.</div>'}</div><button class="bt p" data-act="ckartu" ${kls.length ? '' : 'disabled'}>${ic('download', 's')} Buat PDF kartu</button></div>
  <div class="card"><div class="ch"><span class="ibub b">${ic('file')}</span><h3>Laporan nilai (PDF)</h3></div><p class="muted" style="margin-bottom:12px">Laporan peringkat nilai per ujian, dengan statistik rata-rata, tertinggi, terendah, dan ketuntasan.</p>
    <div class="fg"><label class="fl" for="cj">Ujian</label><select class="sel" id="cj">${optJadwal(false).map(o => `<option value="${esc(o[0])}">${esc(o[1])}</option>`).join('')}</select></div>
    <div class="fg"><label class="fl" for="cl">Kelas (opsional)</label><select class="sel" id="cl"><option value="">Semua kelas</option>${Array.from(new Set(B.siswa.map(s => s.Kelas))).sort().map(k => `<option>${esc(k)}</option>`).join('')}</select></div><button class="bt p" data-act="clap">${ic('download', 's')} Buat PDF laporan</button></div></div>`;
}
A.ckartu = t => { const v = $('#ck').value.split('|'); cetak(t, 'cetak.kartu', { sekolah: v[0], kelas: v[1] }); };
A.clap = t => { const j = $('#cj').value; if (!j) { toast('Belum ada jadwal.', 'w'); return; } cetak(t, 'cetak.laporan', { jadwalId: j, kelas: $('#cl').value }); };

/* ---- Pengaturan (admin) ---- */
V.pengaturan = { t: 'Pengaturan', i: 'gear', r: rSet };
function rSet(el) {
  const c = S.B.cfgFull, F = [['NAMA_APP', 'Nama aplikasi'], ['TAGLINE', 'Tagline / subjudul'], ['INSTANSI', 'Nama panitia (kop kartu)'], ['TAHUN_AJARAN', 'Tahun ajaran'], ['KETUA_NAMA', 'Nama ketua pelaksana'], ['KETUA_NIP', 'NIP ketua pelaksana'], ['NO_PREFIX', 'Awalan nomor peserta'], ['BATAS_PELANGGARAN', 'Batas pelanggaran sebelum ujian terkunci']];
  el.innerHTML = `<div class="grid g21"><div class="card"><h3 style="margin-bottom:12px">Identitas & aturan ujian</h3><div class="fgrid">${F.map(f => `<div class="fg" ${f[0] === 'TAGLINE' || f[0] === 'INSTANSI' ? 'style="grid-column:1/-1"' : ''}><label class="fl" for="c_${f[0]}">${f[1]}</label><input class="in" id="c_${f[0]}" value="${esc(c[f[0]])}" ${f[0] === 'BATAS_PELANGGARAN' ? 'type="number" min="0"' : ''}>${f[0] === 'BATAS_PELANGGARAN' ? '<div class="hint">Isi 0 untuk menonaktifkan kunci otomatis (pelanggaran tetap dicatat).</div>' : ''}</div>`).join('')}</div><button class="bt p" data-act="csave">${ic('check', 's')} Simpan pengaturan</button></div>
  <div class="card"><h3 style="margin-bottom:12px">Keamanan</h3><div class="tt">${ic('shield')}<div><div class="b" style="color:var(--t1)">Rahasia di Script Properties</div><div class="small muted">Kunci sesi, ID spreadsheet, dan ID folder tidak pernah dikirim ke browser.</div></div></div><div class="tt">${ic('users')}<div><div class="b" style="color:var(--t1)">${(S.B.akun || []).length} akun terdaftar</div><div class="small muted">${(S.B.akun || []).filter(a => a.s !== 'aktif').length} diblokir</div></div></div><button class="bt o" data-act="gsandi" style="width:100%">${ic('key', 's')} Ganti sandi saya</button></div></div>`;
}
A.gsandi = gantiSandi;
A.csave = async t => {
  const cfg = {}; ['NAMA_APP', 'TAGLINE', 'INSTANSI', 'TAHUN_AJARAN', 'KETUA_NAMA', 'KETUA_NIP', 'NO_PREFIX', 'BATAS_PELANGGARAN'].forEach(k => cfg[k] = $('#c_' + k).value.trim());
  t.disabled = true; setSync('sync'); const r = await api('config.simpan', { config: cfg }); t.disabled = false;
  if (!r.success) { setSync('err'); toast(r.message, 'e'); return; } setSync('ok'); Object.assign(S.B.cfgFull, r.data); Object.assign(S.B.cfg, r.data); persist(); toast(r.message);
};

/* ---- Dashboard guru ---- */
V.gdash = { t: 'Dashboard Guru', i: 'dash', r: rGuru };
function rGuru(el) {
  const B = S.B, g = B.guru, jid = flt('gd', 'j'), hs = B.hasil.filter(h => !jid || h.jid === jid), tun = hs.filter(h => h.nilai >= 70).length;
  const grp = {}; hs.forEach(h => (grp[h.kelas] = grp[h.kelas] || []).push(h.nilai)); const ks = Object.keys(grp).sort();
  const cols = [{ h: 'Siswa', f: r => `<span class="b" style="color:var(--t1)">${esc(r.nama)}</span><div class="small muted mono">${esc(r.nisn)}</div>` }, { h: 'Kelas', f: r => esc(r.kelas) }, { h: 'Ujian', f: r => esc((B.jadwal.find(j => j.ID === r.jid) || {}).Nama || r.jid) }, { h: 'PG', f: r => fmt(r.pg) }, { h: 'Esai', f: r => fmt(r.es) }, { h: 'Nilai akhir', cls: 'right', f: r => `<b class="mono" style="color:var(--em-d)">${fmt(r.nilai)}</b>` }, { h: 'Pelanggaran', cls: 'right', f: r => r.pel ? `<span class="bdg a">${r.pel}×</span>` : '0' }];
  el.innerHTML = `<div style="margin-bottom:20px"><h2 style="font-size:22px;line-height:30px">${sapa()}, ${esc(S.me.nama.split(',')[0])}</h2><p class="muted">${esc(g.Sekolah || '')} · Mapel ${daf(g.Mapel).map(mapelNama).join(', ') || '—'} · Kelas ${esc(g.Kelas || '—')}</p></div>
  <div class="grid g4">${kpi('k1', 'Siswa di kelas saya', fmt(B.siswa.length, 0), 'users', `<span>Peserta selesai</span><span>${new Set(hs.map(h => h.nisn)).size}</span>`)}${kpi('k2', 'Rata-rata nilai', fmt(avg(hs.map(h => h.nilai))), 'chart', `<span>Dari ${hs.length} hasil</span>`)}${kpi('k3', 'Nilai tertinggi', hs.length ? fmt(Math.max.apply(null, hs.map(h => h.nilai))) : '—', 'trophy', `<span>Terendah ${hs.length ? fmt(Math.min.apply(null, hs.map(h => h.nilai))) : '—'}</span>`)}${kpi('k4', 'Nilai ≥ 70', hs.length ? Math.round(tun / hs.length * 100) + '%' : '—', 'checkc', `<span>${tun} dari ${hs.length} hasil</span>`)}</div>
  <div class="grid g12" style="margin-top:20px"><div class="card"><div class="ch"><h3>Rata-rata nilai per kelas</h3></div>${ks.length ? '<div class="cv"><canvas id="gBar" aria-label="Rata-rata nilai per kelas"></canvas></div>' : empty('Belum ada nilai.', 'chart')}</div><div class="card"><div class="ch"><h3>Komposisi nilai</h3></div>${hs.length ? donutH('gDon', hs) : empty('Belum ada nilai.', 'chart')}</div></div>
  <div class="card" style="margin-top:20px"><div class="ch"><h3>Analisis hasil ujian mapel saya</h3></div>${(B.analisis || []).length ? `<div class="tw"><table class="t"><thead><tr><th>Ujian</th><th>Mapel</th><th class="right">Peserta</th><th class="right">Rata-rata</th><th class="right">Tertinggi</th><th class="right">Terendah</th><th class="right">Tuntas (KKM)</th></tr></thead><tbody>${B.analisis.map(a => `<tr><td class="b" style="color:var(--t1)">${esc(a.nama)}</td><td>${esc(mapelNama(a.mapel))}</td><td class="right">${a.n}</td><td class="right mono b">${fmt(a.avg)}</td><td class="right mono">${fmt(a.max)}</td><td class="right mono">${fmt(a.min)}</td><td class="right"><span class="bdg g">${a.tuntas}/${a.n}</span> <span class="small muted">KKM ${a.kkm}</span></td></tr>`).join('')}</tbody></table></div>` : empty('Belum ada hasil untuk mapel Anda.', 'chart')}</div>
  <div class="card" style="margin-top:20px"><div class="ch"><h3>Nilai siswa di kelas saya</h3><span class="sp"></span>${selH('gd', 'j', optJadwal(true), jid)}<button class="bt o" data-act="lapor2" ${jid ? '' : 'disabled title="Pilih ujian"'}>${ic('printer', 's')} Laporan PDF</button></div>${dtable('gnil', cols, () => hs.slice().sort((a, b) => b.nilai - a.nilai), { ph: 'Cari siswa…', text: r => r.nama + r.nisn + r.kelas, empty: 'Belum ada nilai untuk kelas Anda.' })}</div>`;
  chart('gBar', { type: 'bar', data: { labels: ks, datasets: [{ data: ks.map(k => +avg(grp[k]).toFixed(1)), backgroundColor: '#10B981', borderRadius: 6 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, grid: { color: '#E2E8F0' } }, x: { grid: { display: false } } } } });
}
A.lapor2 = t => cetak(t, 'cetak.laporan', { jadwalId: flt('gd', 'j'), kelas: '' });
