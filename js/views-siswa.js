/* js/views-siswa.js : halaman Siswa & ruang ujian */
'use strict';
/* =====================================================================
   VIEW SISWA
   ===================================================================== */
let E = null;   // state ruang ujian
V.beranda = { t: 'Beranda', i: 'dash', r: rBeranda };
V.kartu = { t: 'Kartu Peserta', i: 'idcard', r: rKartu };
V.selesai = { t: 'Ujian Selesai', i: 'checkc', r: rSelesai };
S.tok = ['', '', '', '', '', ''];
function sJadwal() { return S.B.jadwal.slice().sort((a, b) => (a.Tanggal + a.Mulai).localeCompare(b.Tanggal + b.Mulai)); }
function jStat(j) { return j.hasil ? 'selesai' : stat(j) === 'selesai' ? 'lewat' : stat(j); }
function rBeranda(el) {
  const B = S.B, s = B.siswa, js = sJadwal(), pick = js.filter(j => jStat(j) === 'berlangsung');
  if (!pick.find(j => j.ID === S.pick)) S.pick = pick.length === 1 ? pick[0].ID : ((pick.find(j => j.deadline) || {}).ID || '');
  const cur = js.find(j => j.ID === S.pick), resume = cur && cur.deadline > 0;
  const bd = j => { const st = jStat(j); return st === 'selesai' ? '<span class="bdg">Selesai</span>' : st === 'berlangsung' ? '<span class="bdg g"><span class="dot"></span>Berlangsung</span>' : st === 'akan' ? '<span class="bdg b">Akan datang</span>' : '<span class="bdg r">Terlewat</span>'; };
  const ik = j => { const st = jStat(j); return st === 'selesai' ? ['checkc', ''] : st === 'berlangsung' ? ['book', ''] : st === 'akan' ? ['clock', 'v'] : ['alert', 'r']; };
  const act = j => { const st = jStat(j); if (st === 'selesai') return `<button class="bt o sm" data-act="bukti" data-id="${esc(j.ID)}">${ic('file', 's')} Lihat Lembar Bukti</button>`; if (st === 'berlangsung') return `<button class="bt ${S.pick === j.ID ? 'p' : 'o'}" data-act="pick" data-id="${esc(j.ID)}">${j.deadline ? 'Lanjutkan' : 'Siap Dikerjakan'} ${ic('play', 's')}</button>`; if (st === 'akan') return `<span class="bdg" style="min-height:32px">${ic('lock', 's')} Menunggu Sesi</span>`; return ''; };
  el.innerHTML = `
  <div class="card" style="margin-bottom:20px"><div class="hero"><span class="av lg">${ini(s.Nama)}</span><div style="flex:1;min-width:200px"><div class="row" style="gap:10px"><h2 style="font-size:24px;line-height:32px">${sapa()}, ${esc(s.Nama)}</h2><span class="bdg g"><span class="dot"></span>${esc(s.Sesi)}</span></div><p class="muted">NISN: <span class="mono">${esc(s.NISN)}</span> · Kelas ${esc(s.Kelas)} · ${esc(s.Sekolah)}</p></div><div class="idc" style="min-width:210px"><div class="small muted b" style="letter-spacing:.05em">RUANG CBT</div><div class="row"><b style="color:var(--t1);font-size:16px">${esc(s.Ruang)}</b><span class="sp"></span><span class="ibub b">${ic('server')}</span></div></div></div></div>
  <div class="grid g21" style="align-items:start">
   <div>
    <div class="card l2"><div class="ch"><span class="ibub">${ic('key')}</span><div><div class="small muted b" style="letter-spacing:.05em">OTORISASI PESERTA UJIAN</div><h3 style="font-size:20px">Masukkan Token Ujian</h3></div><span class="sp"></span>${cur ? `<span class="bdg g">${ic('checkc', 's')} ${esc(cur.Nama.length > 34 ? cur.Nama.slice(0, 34) + '…' : cur.Nama)}</span>` : '<span class="bdg">Belum ada jadwal dipilih</span>'}</div>
     <div style="border-top:1px solid var(--line);padding-top:14px">
     ${resume ? `<div class="center" style="padding:18px 0 6px"><div class="b" style="color:var(--t1);font-size:16px">Sesi ujian Anda masih berjalan.</div><p class="muted">Token tidak diperlukan untuk melanjutkan.</p></div>` : `<p class="center muted">Ketikkan <b style="color:var(--t1)">6 karakter kode token</b> resmi yang diberikan oleh Proktor atau Pengawas Ruang sebelum memulai ujian.</p>
     <div class="tkw" id="tkw" role="group" aria-label="Kode token">${[0, 1, 2].map(i => tkBox(i)).join('')}<span class="muted">-</span>${[3, 4, 5].map(i => tkBox(i)).join('')}</div>`}
     <div class="center"><button class="bt p lg" data-act="mulai" id="btnMulai" ${pick.length ? '' : 'disabled'}>${resume ? 'Lanjutkan Ujian' : 'Mulai Ujian Sekarang'} ${ic('arrow-right', 's')}</button></div>
     <div class="center" style="margin-top:12px"><span class="bdg">${ic('info', 's')} ${pick.length ? 'Token diterbitkan oleh Pengawas Ruang saat sesi dimulai.' : 'Belum ada ujian yang sedang berlangsung untuk kelas Anda.'}</span></div></div></div>
    <div class="ch" style="margin:26px 0 12px"><span style="color:var(--em-d)">${ic('cal')}</span><h3 style="font-size:20px">Jadwal Ujian Terdaftar</h3><span class="sp"></span><span class="small muted">Hari ini, ${tglID(tglKey(nowMs()))}</span></div>
    ${js.length ? js.map(j => { const i = ik(j); return `<div class="jd ${S.pick === j.ID && jStat(j) === 'berlangsung' ? 'sel' : ''}"><span class="ibub ${i[1]}" style="width:44px;height:44px">${ic(i[0])}</span><div style="flex:1;min-width:200px"><div class="row" style="gap:8px"><b style="color:var(--t1);font-size:15px">${esc(j.Nama)}</b>${bd(j)}</div><div class="meta"><span>${ic('file', 's')} ${j.total} Soal${j.total ? ` (${j.pg} PG${j.es ? ', ' + j.es + ' Esai' : ''})` : ''}</span><span>${ic('hour', 's')} ${j.Durasi} Menit</span><span>${ic('clock', 's')} ${tglS(j.Tanggal)} · ${j.Mulai} – ${j.Selesai} WIB</span></div></div>${act(j)}</div>`; }).join('') : empty('Belum ada ujian terjadwal untuk kelas Anda.', 'cal')}
   </div>
   <div>
    <div class="card"><div class="ch"><span class="small muted b" style="letter-spacing:.05em">IDENTITAS RESMI</span><span class="sp"></span>${ic('idcard')}</div>
     <div class="idc"><div class="row" style="border-bottom:1px solid var(--line);padding-bottom:8px;margin-bottom:8px"><b style="color:var(--t1)">KARTU PESERTA CBT</b><span class="sp"></span><span class="bdg g">TERVERIFIKASI</span></div><dl><dt>Nama</dt><dd>${esc(s.Nama)}</dd><dt>Nomor Ujian</dt><dd class="mono">${esc(s.NoUjian)}</dd><dt>Asal Sekolah</dt><dd>${esc(s.Sekolah)}</dd><dt>Sesi / Ruang</dt><dd>${esc(s.Sesi)} / ${esc(s.Ruang)}</dd></dl></div>
     <button class="bt o" style="width:100%;margin-top:12px" data-act="go" data-id="kartu">${ic('download', 's')} Unduh Kartu Ujian (PDF)</button></div>
    <div class="card" style="margin-top:20px"><div class="ch"><span style="color:var(--amber-x)">${ic('scale')}</span><h3>Tata Tertib Integritas</h3></div>
     <div class="tt"><span class="ibub r">${ic('x')}</span><div><b style="color:var(--t1)">Dilarang Berpindah Tab</b><div class="small muted">Sistem mencatat perpindahan jendela atau tab. ${esc(B.cfg.BATAS_PELANGGARAN)}× pelanggaran akan mengunci ujian secara otomatis.</div></div></div>
     <div class="tt"><span class="ibub a">${ic('hour')}</span><div><b style="color:var(--t1)">Hitung Mundur Otomatis</b><div class="small muted">Waktu dihitung server. Saat waktu habis, jawaban dikirim otomatis tanpa peringatan susulan.</div></div></div>
     <div class="tt"><span class="ibub">${ic('cloud')}</span><div><b style="color:var(--t1)">Auto-Save Server</b><div class="small muted">Jawaban disimpan berkala ke server dan di perangkat Anda agar tidak hilang saat koneksi terputus.</div></div></div></div>
    <div class="card" style="margin-top:20px;padding:14px"><div class="row"><span class="dot" style="background:${S.rtt > 1500 ? 'var(--amber)' : 'var(--em)'}"></span><span>Latensi server: <b>${S.rtt ? S.rtt + ' ms' : '—'}</b></span><span class="sp"></span><span class="bdg ${S.rtt > 1500 ? 'a' : 'g'}">${S.rtt > 1500 ? 'LAMBAT' : 'STABIL'}</span></div></div>
   </div></div>`;
  if (!resume) tkSync();
}
const tkBox = i => `<input class="tk ${S.tok[i] ? 'f' : ''}" maxlength="1" inputmode="text" autocapitalize="characters" autocomplete="off" data-in="tk" data-i="${i}" value="${esc(S.tok[i])}" aria-label="Karakter token ${i + 1}">`;
function tkSync() { $$('.tk').forEach((x, i) => { x.value = S.tok[i] || ''; x.classList.toggle('f', !!S.tok[i]); }); }
IN.tk = t => {
  const i = +t.dataset.i, v = (t.value.toUpperCase().replace(/[^A-Z0-9]/g, '')).slice(-1); t.value = v; S.tok[i] = v; t.classList.toggle('f', !!v);
  if (v && i < 5) $$('.tk')[i + 1].focus();
};
document.addEventListener('keydown', e => {
  const t = e.target; if (!t.classList || !t.classList.contains('tk')) return; const i = +t.dataset.i, all = $$('.tk');
  if (e.key === 'Backspace' && !t.value && i > 0) { all[i - 1].focus(); S.tok[i - 1] = ''; all[i - 1].value = ''; all[i - 1].classList.remove('f'); }
  else if (e.key === 'ArrowLeft' && i > 0) all[i - 1].focus(); else if (e.key === 'ArrowRight' && i < 5) all[i + 1].focus(); else if (e.key === 'Enter') A.mulai($('#btnMulai'));
});
document.addEventListener('paste', e => {
  const t = e.target; if (!t.classList || !t.classList.contains('tk')) return; e.preventDefault();
  const v = ((e.clipboardData || window.clipboardData).getData('text') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
  S.tok = ['', '', '', '', '', ''].map((_, i) => v[i] || ''); tkSync(); $$('.tk')[Math.min(v.length, 5)].focus();
});
A.pick = t => { S.pick = t.dataset.id; rerender(); setTimeout(() => { const f = $('.tk:not(.f)') || $('#btnMulai'); if (f) f.focus(); }, 30); };
A.mulai = async t => {
  const j = sJadwal().find(x => x.ID === S.pick); if (!j) { toast('Pilih jadwal ujian yang berlangsung terlebih dahulu.', 'w'); return; }
  const kode = S.tok.join(''); if (!j.deadline && kode.length < 6) { toast('Masukkan 6 karakter token ujian.', 'w'); const f = $('.tk:not(.f)'); if (f) f.focus(); return; }
  t.disabled = true; const h = t.innerHTML; t.innerHTML = '<span class="spin xs" style="border-top-color:#fff;border-color:rgba(255,255,255,.4)"></span> Memverifikasi…';
  const r = await api('ujian.mulai', { jadwalId: j.ID, kode });
  t.disabled = false; t.innerHTML = h; hydrate(t);
  if (!r.success) { toast(r.message, 'e'); if (r.code === 'SELESAI') refresh(); return; }
  S.tok = ['', '', '', '', '', '']; startExam(r.data);
};
A.bukti = t => { const j = S.B.jadwal.find(x => x.ID === t.dataset.id); S.rcpt = LS.g('cbt_rcpt_' + j.ID) || { jadwal: j.Nama, mapel: j.MapelNama, total: j.total, terjawab: null, selesai: j.hasil.selesai, sisaMs: null, pel: j.hasil.pel, noUjian: S.B.siswa.NoUjian, siswa: S.B.siswa.Nama, sekolah: S.B.siswa.Sekolah, hash: '—', status: j.hasil.status }; go('selesai'); };

/* ---- Kartu peserta ---- */
function rKartu(el) {
  const B = S.B, s = B.siswa, js = sJadwal();
  el.innerHTML = `<button class="bt g noprint" data-act="go" data-id="beranda" style="margin-bottom:6px">${ic('arrow-left', 's')} Kembali ke Beranda</button>
  <div class="row noprint" style="margin-bottom:18px"><div style="flex:1;min-width:260px"><div class="row"><h2 style="font-size:28px;line-height:36px">Pratinjau & Cetak Kartu Peserta</h2><span class="bdg g">${ic('checkc', 's')} Resmi Terverifikasi</span></div><p class="muted">Unduh atau cetak kartu tanda peserta resmi untuk verifikasi fisik di pintu masuk ruang ujian CBT tingkat kecamatan.</p></div><button class="bt o" data-act="print">${ic('printer', 's')} Cetak Langsung (Print)</button><button class="bt p" data-act="kpdf">${ic('download', 's')} Unduh Kartu Peserta (PDF)</button></div>
  <div class="grid g21" style="align-items:start"><div class="cd" id="cdPrev"><div class="hd"><div class="small muted b" style="letter-spacing:.1em">${esc(B.cfg.TAGLINE.toUpperCase())}</div><div style="font-family:var(--f-h);font-weight:800;font-size:22px;color:var(--t1)">${esc(B.cfg.INSTANSI)}</div><div style="font-family:var(--f-h);font-weight:700;font-size:16px;color:var(--em-d)">KARTU TANDA PESERTA COMPUTER BASED TEST (CBT)</div><div class="small muted">Tahun Ajaran ${esc(B.cfg.TAHUN_AJARAN)}</div></div>
   <div class="info"><div><small>NAMA LENGKAP SISWA</small><b>${esc(s.Nama)}</b></div><div><small>NOMOR PESERTA UJIAN</small><b class="no">${esc(s.NoUjian)}</b></div><div><small>ASAL SEKOLAH</small><b>${esc(s.Sekolah)}</b></div><div><small>KELAS / ROMBONGAN BELAJAR</small><b>Kelas ${esc(s.Kelas)}</b></div><div><small>SESI UJIAN · RUANG CBT</small><b>${esc(s.Sesi)} · ${esc(s.Ruang)}</b></div><div><small>USERNAME AKUN / NISN</small><b class="mono">${esc(s.NISN)}</b></div></div>
   <div class="small muted b" style="letter-spacing:.06em;margin:18px 0 8px">JADWAL SESI UJIAN TERDAFTAR · Zona waktu: WIB (UTC+7)</div>
   <div class="tw"><table class="t"><thead><tr><th>No</th><th>Hari / Tanggal</th><th>Waktu</th><th>Mata Pelajaran</th></tr></thead><tbody>${js.map((j, i) => `<tr><td>${i + 1}</td><td>${tglID(j.Tanggal)}</td><td class="mono">${j.Mulai} - ${j.Selesai} WIB</td><td style="color:var(--em-d);font-weight:600">${esc(j.MapelNama)}</td></tr>`).join('') || '<tr><td colspan="4" class="muted">Belum ada jadwal.</td></tr>'}</tbody></table></div>
   <div class="row" style="margin-top:20px;align-items:flex-start"><div style="flex:1;min-width:220px" class="small"><b style="color:var(--red-x)">TATA TERTIB RINGKAS</b><ul style="margin:6px 0 0 16px"><li>Wajib membawa kartu fisik ke ruang ujian.</li><li>Dilarang membawa HP atau kalkulator.</li><li>Hadir 15 menit sebelum sesi dimulai.</li></ul></div><div class="center small" style="min-width:200px">Ketua Pelaksana CBT Kecamatan<div style="height:46px"></div><b style="text-decoration:underline;color:var(--t1)">${esc(B.cfg.KETUA_NAMA || '')}</b></div></div></div>
  <div class="panduan"><div class="card"><div class="ch"><span class="ibub">${ic('printer')}</span><div><h3>Panduan Cetak Kartu</h3><div class="small muted">Rekomendasi teknis panitia</div></div></div>
   <div class="tt"><div><b style="color:var(--t1)">Ukuran kertas: A4 / F4</b><div class="small muted">Gunakan kertas HVS minimal 80 gram agar tidak mudah sobek.</div></div></div><div class="tt"><div><b style="color:var(--t1)">Margin & skala</b><div class="small muted">Setel margin browser ke "None" atau "Default" dan skala 100%.</div></div></div><div class="tt"><div><b style="color:var(--t1)">Warna cetakan</b><div class="small muted">Dianjurkan dicetak berwarna agar jelas terbaca.</div></div></div></div>
   <div class="card" style="margin-top:20px"><div class="small muted b" style="letter-spacing:.05em">BANTUAN & LAYANAN PENGAWAS</div><h3 style="margin:4px 0">Data Siswa Tidak Sesuai?</h3><p class="muted small">Jika terdapat kesalahan penulisan nama, NISN, atau sesi ujian, segera laporkan ke Proktor Sekolah sebelum masa verifikasi kartu ditutup.</p></div></div></div>`;
}
A.print = () => { const v = $('#v-kartu') || $('#v-selesai'); v.classList.add('print-me'); window.print(); setTimeout(() => v.classList.remove('print-me'), 800); };
A.kpdf = t => cetak(t, 'cetak.kartu', {});

/* ---- Bukti selesai ---- */
function rSelesai(el) {
  const r = S.rcpt; if (!r) { go('beranda'); return; }
  el.innerHTML = `<div class="card l2 rcp" style="max-width:660px;margin:0 auto;text-align:center;padding:34px 30px"><div style="position:relative;width:100px;height:100px;border-radius:50%;background:var(--mint);margin:0 auto 14px;display:grid;place-items:center;color:var(--em-d)">${ic('checkc', 'l').replace('class="ic l"', 'class="ic" style="width:52px;height:52px"')}</div>
  <h1 style="font-size:34px;line-height:42px">Ujian Selesai!</h1><span class="bdg g" style="margin:8px 0 16px"><span class="dot"></span>Jawaban Berhasil Dikirim${r.status === 'terkunci' ? ' (ujian dikunci)' : r.status === 'waktu-habis' ? ' (waktu habis)' : ''}</span>
  <div class="tt" style="text-align:left">${ic('info')}<div>Seluruh lembar jawaban Anda telah tersimpan otomatis ke server. Sesuai kebijakan ujian tingkat kecamatan, hasil nilai ujian tidak ditampilkan kepada siswa dan akan direkap langsung oleh Tim Pengawas &amp; Proktor.</div></div>
  <div class="grid g2" style="text-align:left;margin:14px 0;gap:12px"><div class="idc" style="background:#EFF6FF"><div class="small b" style="color:var(--blue);letter-spacing:.05em">${ic('book', 's')} MATA PELAJARAN</div><b style="color:var(--t1);font-size:16px">${esc(r.mapel)}</b><div class="small muted">${r.total} butir${r.terjawab != null ? ` (${r.terjawab} terjawab, ${r.total - r.terjawab} kosong)` : ''}</div></div><div class="idc" style="background:#EFF6FF"><div class="small b" style="color:var(--blue);letter-spacing:.05em">${ic('clock', 's')} WAKTU KIRIM</div><b class="mono" style="color:var(--t1);font-size:16px">${jam(r.selesai)} WIB</b><div class="small muted">${r.sisaMs != null ? 'Sisa durasi: ' + Math.floor(r.sisaMs / 60000) + 'm ' + Math.floor(r.sisaMs % 60000 / 1000) + 's' : ''}</div></div></div>
  <div class="idc" style="text-align:left"><dl style="grid-template-columns:150px 1fr"><dt class="b small" style="letter-spacing:.05em">ID PESERTA</dt><dd class="mono">${esc(r.noUjian)}</dd><dt class="b small">SISWA TERDAFTAR</dt><dd>${esc(r.siswa)} (${esc(r.sekolah)})</dd><dt class="b small">INTEGRITAS CBT</dt><dd style="color:${r.pel ? 'var(--amber-x)' : 'var(--em-d)'}">${r.pel} Pelanggaran Tab</dd><dt class="b small">SERVER HASH</dt><dd class="mono">${esc(r.hash)}</dd></dl></div>
  <button class="bt p lg noprint" style="width:100%;margin-top:18px" data-act="go" data-id="beranda">Kembali ke Beranda Siswa ${ic('arrow-right', 's')}</button><div class="grid g2 noprint" style="margin-top:10px;gap:10px"><button class="bt o" data-act="print">${ic('printer', 's')} Cetak Bukti</button><button class="bt o" data-act="go" data-id="beranda">${ic('cal', 's')} Jadwal Berikut</button></div></div>`;
}

/* =====================================================================
   RUANG UJIAN (Focus Mode)
   ===================================================================== */
function startExam(d) {
  const loc = LS.g('cbt_ans_' + d.sesiId) || {};
  E = { on: true, sesi: d.sesiId, jid: d.jadwal.ID, nama: d.jadwal.nama, soal: d.soal, idx: 0, jaw: Object.assign({}, d.jawaban || {}, loc.j || {}), ragu: Array.from(new Set((d.ragu || []).concat(loc.r || []))), deadline: d.deadline, off: d.now - Date.now(), pel: d.pel || 0, batas: d.batas, ver: 1, sv: 0, last: 0, fs: 2, t0: Date.now(), lastPel: 0, fin: false };
  LS.s('cbt_exam_' + S.me.username, { jid: E.jid }); LS.s('cbt_ans_' + E.sesi, { j: E.jaw, r: E.ragu });
  $('#app').classList.add('exam'); window.scrollTo(0, 0); buildExam(); attachGuard();
  E.timer = setInterval(tick, 500); E.saveI = setInterval(flush, 20000); tick();
}
async function resumeExam(ex) {
  const r = await api('ujian.mulai', { jadwalId: ex.jid, kode: '' });
  if (r.success) { toast('Melanjutkan sesi ujian Anda.'); startExam(r.data); } else { LS.d('cbt_exam_' + S.me.username); if (r.code === 'SELESAI') refresh(); }
}
function stopExamTimers() { if (E) { clearInterval(E.timer); clearInterval(E.saveI); clearTimeout(E.saveT); } }
function buildExam() {
  $('#exam').innerHTML = `<header class="exh"><span class="dot"></span><b style="font-family:var(--f-h);color:var(--t1);font-size:16px;flex:1;min-width:120px;overflow:hidden;text-overflow:ellipsis">${esc(E.nama)}</b><span class="bdg g">Tingkat Kecamatan</span><span class="bdg" title="Pencatatan perpindahan tab aktif">${ic('shield', 's')} KIOSK GUARD: ON</span><span class="cap" id="tm" role="timer" aria-label="Sisa waktu">${ic('clock')}<span id="tmv">--:--</span></span></header><div id="warn"></div>
  <div class="exg"><div><div class="paper" id="qp"></div><div class="nav-ex" id="qn"></div></div><aside><div class="card" id="pp" style="position:sticky;top:84px"></div></aside></div>`;
  paintQ(); paintPal(); hydrate($('#exam'));
}
function paintQ() {
  const s = E.soal[E.idx], cur = E.jaw[s.id], rg = E.ragu.indexOf(s.id) >= 0;
  $('#qp').className = 'paper fs-' + E.fs;
  $('#qp').innerHTML = `<div class="row"><span class="muted" style="font-size:16px">Soal No. <b style="color:var(--t1)">${E.idx + 1}</b> dari ${E.soal.length}</span><span class="bdg ${s.jenis === 'PG' ? 'b' : 'v'}">${s.jenis === 'PG' ? 'Pilihan Ganda' : 'Esai'} (Bobot ${fmt(s.bobot)})</span><span class="sp"></span><div class="tabs" role="group" aria-label="Ukuran huruf"><button class="tb ${E.fs === 1 ? 'on' : ''}" data-act="fs" data-v="1" aria-label="Perkecil">A-</button><button class="tb ${E.fs === 2 ? 'on' : ''}" data-act="fs" data-v="2" aria-label="Normal">A</button><button class="tb ${E.fs === 3 ? 'on' : ''}" data-act="fs" data-v="3" aria-label="Perbesar">A+</button></div></div>
  <div class="stem">${esc(s.q)}</div>
  ${s.jenis === 'PG' ? Object.keys(s.o).map(k => `<button class="opt ${cur === k ? 'on' : ''}" data-act="opt" data-k="${k}" role="radio" aria-checked="${cur === k}"><span class="pf">${k}</span><span class="ot">${esc(s.o[k])}</span><span class="ck">${ic('check', 's')}</span></button>`).join('') + (cur ? `<button class="bt g sm" data-act="clr">${ic('x', 's')} Kosongkan jawaban</button>` : '') : `<label class="fl" for="esT">Jawaban Anda</label><textarea id="esT" class="ta" style="min-height:200px" data-in="esai" data-force="1" placeholder="Tulis jawaban Anda di sini…">${esc(cur || '')}</textarea><div class="hint">Jawaban tersimpan otomatis.</div>`}`;
  $('#qn').innerHTML = `<button class="bt o" data-act="pv" ${E.idx === 0 ? 'disabled' : ''}>${ic('arrow-left', 's')} Sebelumnya</button><button class="bt ${rg ? 'p' : 'o'}" style="${rg ? 'background:var(--amber)' : 'background:var(--amber-t);color:var(--amber-x);border-color:#FDE68A'}" data-act="rg">${ic('flag', 's')} ${rg ? 'Ragu-ragu (aktif)' : 'Ragu-ragu'}</button><span class="sp" style="flex:1"></span>${E.idx < E.soal.length - 1 ? `<button class="bt o" data-act="nx">Berikutnya ${ic('arrow-right', 's')}</button>` : ''}<button class="bt p" data-act="fin">${ic('checkc', 's')} Selesai Ujian</button>`;
  hydrate($('#qp')); hydrate($('#qn'));
}
function paintPal() {
  const n = E.soal.length, ans = E.soal.filter(s => E.jaw[s.id]).length, rg = E.ragu.length, kos = n - ans;
  $('#pp').innerHTML = `<div class="ch"><span style="color:var(--em-d)">${ic('grid')}</span><h3>Daftar Soal</h3><span class="sp"></span><span class="bdg">${n} BUTIR</span></div><div class="small"><b style="color:var(--em-d)">${ans} Terjawab</b> · <b style="color:var(--amber-x)">${rg} Ragu</b> · <span class="muted">${kos} Belum</span></div><div class="bar" style="margin-top:8px"><i style="width:${n ? ans / n * 100 : 0}%"></i></div>
  <div class="pal">${E.soal.map((s, i) => `<button class="pn ${E.jaw[s.id] ? 'a' : ''} ${E.ragu.indexOf(s.id) >= 0 ? 'r' : ''} ${i === E.idx ? 'c' : ''}" data-act="pj" data-i="${i}" aria-label="Soal ${i + 1}" ${i === E.idx ? 'aria-current="true"' : ''}>${i + 1}</button>`).join('')}</div>
  <div class="small muted b" style="letter-spacing:.05em;margin-bottom:6px">KETERANGAN STATUS</div><div class="lgd"><span><i style="background:var(--em)"></i>Terjawab</span><span><i style="background:var(--amber)"></i>Ragu-ragu</span><span><i style="background:var(--canvas)"></i>Belum diisi</span><span><i style="background:#fff;border:2px solid var(--em)"></i>Sedang aktif</span></div>
  <div class="idc" style="margin-top:14px;padding:10px"><div class="row small" style="flex-wrap:nowrap">${ic('cloud', 's')}<span>Auto-Save:</span><span class="sp"></span><b class="mono" id="svT">${E.last ? jam(E.last) + ' WIB' : 'menunggu…'}</b></div></div>`;
  hydrate($('#pp'));
}
function fmtT(ms) { const s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), d = s % 60, p = x => ('0' + x).slice(-2); return (h ? p(h) + ':' : '') + p(m) + ':' + p(d); }
function tick() {
  if (!E || !E.on || E.fin) return; const rem = E.deadline - (Date.now() + E.off), c = $('#tm'); if (!c) return;
  $('#tmv').textContent = fmtT(rem); c.classList.toggle('w', rem <= 300000 && rem > 60000); c.classList.toggle('x', rem <= 60000);
  if (rem <= 0) finish('waktu-habis');
}
function saveLocal() { LS.s('cbt_ans_' + E.sesi, { j: E.jaw, r: E.ragu }); }
function touch() { E.ver++; saveLocal(); clearTimeout(E.saveT); E.saveT = setTimeout(flush, 1500); }
async function flush() {
  if (!E || !E.on || E.fin || E.saving || E.ver === E.sv) return; E.saving = true; const v = E.ver;
  const r = await api('ujian.simpan', { sesiId: E.sesi, jawaban: E.jaw, ragu: E.ragu }); if (!E) return; E.saving = false;
  if (r.success) { E.sv = v; E.last = Date.now(); const el = $('#svT'); if (el) el.textContent = jam(E.last) + ' WIB'; E.off = r.data.now - Date.now(); if (r.data.habis) { finish('waktu-habis'); return; } if (E.ver !== v) E.saveT = setTimeout(flush, 800); }
  else E.saveT = setTimeout(flush, 5000);
}
A.opt = t => { const s = E.soal[E.idx]; E.jaw[s.id] = t.dataset.k; touch(); paintQ(); paintPal(); };
A.clr = () => { delete E.jaw[E.soal[E.idx].id]; touch(); paintQ(); paintPal(); };
IN.esai = t => { const s = E.soal[E.idx]; if (t.value.trim()) E.jaw[s.id] = t.value; else delete E.jaw[s.id]; touch(); paintPal(); };
A.nx = () => { if (E.idx < E.soal.length - 1) { E.idx++; paintQ(); paintPal(); window.scrollTo(0, 0); } };
A.pv = () => { if (E.idx > 0) { E.idx--; paintQ(); paintPal(); window.scrollTo(0, 0); } };
A.pj = t => { E.idx = +t.dataset.i; paintQ(); paintPal(); window.scrollTo(0, 0); };
A.fs = t => { E.fs = +t.dataset.v; paintQ(); };
A.rg = () => { const id = E.soal[E.idx].id, i = E.ragu.indexOf(id); if (i >= 0) E.ragu.splice(i, 1); else E.ragu.push(id); touch(); paintQ(); paintPal(); };
A.wx = () => { $('#warn').innerHTML = ''; };
A.fin = async () => {
  const n = E.soal.length, ans = E.soal.filter(s => E.jaw[s.id]).length, kos = n - ans, rg = E.ragu.length;
  const ok = await confirmBox({ title: 'Selesaikan ujian?', msg: `Anda menjawab <b>${ans}</b> dari ${n} soal.${kos ? ` <b style="color:var(--amber-x)">${kos} soal belum dijawab.</b>` : ''}${rg ? ` ${rg} soal masih ditandai ragu-ragu.` : ''}<br>Setelah dikirim, jawaban <b>tidak dapat diubah</b>.`, ok: 'Ya, kirim jawaban', danger: kos > 0 });
  if (ok) finish('selesai');
};
async function finish(alasan) {
  if (!E || E.fin) return; E.fin = true; stopExamTimers(); saveLocal();
  const msg = alasan === 'waktu-habis' ? 'Waktu habis. Jawaban dikirim otomatis…' : alasan === 'terkunci' ? 'Ujian dikunci karena pelanggaran. Jawaban dikirim…' : 'Mengirim jawaban…';
  const ov = modal({ title: 'Mengirim jawaban', narrow: true, lock: true, nofocus: true, body: `<div class="center" data-lock style="padding:16px 0"><div class="spin" style="margin:0 auto 12px"></div><div id="ovM">${msg}</div><div class="small muted">Jangan tutup halaman ini.</div></div>` });
  for (let k = 0; k < 12; k++) {
    const r = await api('ujian.selesai', { sesiId: E.sesi, jawaban: E.jaw, alasan });
    if (r.success) {
      const d = Object.assign({}, r.data, { jid: E.jid }); LS.s('cbt_rcpt_' + E.jid, d); LS.d('cbt_exam_' + S.me.username); LS.d('cbt_ans_' + E.sesi);
      ov.remove(); E.on = false; E = null; $('#app').classList.remove('exam'); $('#exam').innerHTML = ''; window.onbeforeunload = null;
      S.rcpt = d; go('selesai'); refresh(); return;
    }
    if (!r.net && !r.retry) { const m = $('#ovM', ov); if (m) m.textContent = r.message; break; }
    const m = $('#ovM', ov); if (m) m.textContent = 'Menghubungkan ke server… (percobaan ' + (k + 2) + ')'; await new Promise(z => setTimeout(z, 1500 + Math.random() * 2500));
  }
  ov.remove();
  modal({ title: 'Jawaban belum terkirim', narrow: true, lock: true, body: '<p data-lock>Koneksi bermasalah. <b>Jawaban Anda aman tersimpan di perangkat ini.</b> Periksa jaringan lalu coba kirim ulang. Jangan menutup halaman.</p>', actions: [{ t: 'Kirim ulang', cls: 'p', fn: () => { E.fin = false; finish(alasan); } }] });
}

/* ---- Pencatatan pelanggaran ---- */
let guardOn = false;
function onLeave(jenis) {
  if (!E || !E.on || E.fin) return; const n = Date.now(); if (n - E.t0 < 5000 || n - E.lastPel < 2000) return; E.lastPel = n; E.pel++;
  $('#warn').innerHTML = `<div class="warnb" role="alert">${ic('alert')}<span>Anda meninggalkan halaman ujian. Kejadian tercatat ke sistem proktor (${E.pel}×).${E.batas > 0 ? ' Batas: ' + E.batas + '×.' : ''}</span><button class="bt g ib" data-act="wx" aria-label="Tutup">${ic('x', 's')}</button></div>`; hydrate($('#warn'));
  api('ujian.pelanggaran', { sesiId: E.sesi, jenis }).then(r => { if (r.success && E && E.on) { E.pel = Math.max(E.pel, r.data.jumlah); if (r.data.kunci) finish('terkunci'); } });
  if (E.batas > 0 && E.pel >= E.batas) finish('terkunci');
}
function attachGuard() {
  if (guardOn) return; guardOn = true;
  document.addEventListener('visibilitychange', () => { if (document.hidden) onLeave('pindah-tab'); });
  window.addEventListener('blur', () => setTimeout(() => { if (E && E.on && !document.hidden && !document.hasFocus()) onLeave('jendela-blur'); }, 400));
  ['contextmenu', 'copy', 'cut', 'paste', 'dragstart'].forEach(ev => document.addEventListener(ev, e => { if (E && E.on && !(e.target.tagName === 'TEXTAREA')) e.preventDefault(); }));
  document.addEventListener('keydown', e => {
    if (!E || !E.on) return; const ta = e.target.tagName === 'TEXTAREA', k = e.key.toLowerCase();
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(k)) || (e.ctrlKey && ['u', 's', 'p'].includes(k)) || (!ta && e.ctrlKey && ['c', 'v', 'x', 'a'].includes(k))) { e.preventDefault(); return; }
    if (!ta && !e.ctrlKey && !$('#mroot .mo')) { if (e.key === 'ArrowRight') A.nx(); else if (e.key === 'ArrowLeft') A.pv(); else if (['a', 'b', 'c', 'd', 'e'].includes(k) && E.soal[E.idx].jenis === 'PG' && E.soal[E.idx].o[k.toUpperCase()]) A.opt({ dataset: { k: k.toUpperCase() } }); }
  });
  window.onbeforeunload = ev => { if (E && E.on && !E.fin) { ev.preventDefault(); ev.returnValue = ''; return ''; } };
}
window.addEventListener('online', () => { if (E && E.on) flush(); });
setInterval(() => { if (S.view === 'beranda' && !(E && E.on) && !document.hidden) rerender(); }, 20000);


