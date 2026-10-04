/* Record — chosen design "A · map + glass sheet" (design/rc_A.png). Positions = mockup px × 0.381 (+18 at the top, like home/hall);
   the glass sheet is bottom-anchored so taller phones just show more map. Icons are cut from the mockup (assets/rk_*.png).
   ELi = the original art only, moved by code (Eli class). Replaces app.js's earlier recorder. */
const RC_PATH = 'M63 128 L72 146 Q88 180 95 183 L118 188 Q128 190 131 198 L141 230 Q144 238 152 240 L227 259';
LIFE.record = pg => {
  const mk = (n, c = '') => `<img class="mk ${c}" src="assets/${n}.png" alt="">`;
  const m = LPX.mult(G.streak);
  Object.assign(RUN, { state: 'idle', sec: 0, m: 0, next: 500 });
  pg.innerHTML = `
    <img class="rc-mapb" src="assets/rc_map.webp" alt="">
    <img class="rc-map" src="assets/rc_map.webp" alt="">
    <svg class="rc-trk" viewBox="0 0 390 400">
      <path class="sg-h" d="${RC_PATH}"/><path class="sg" d="${RC_PATH}"/><path class="dn-h" d="${RC_PATH}"/><path class="dn" d="${RC_PATH}"/>
      <g class="rc-fin" transform="translate(227 259)"><circle r="8.5"/><path d="M-4.5 -4.5h4.5v4.5h-4.5zM0 0h4.5v4.5h-4.5z"/></g>
    </svg>
    <i class="rc-wash"></i>
    <div class="rc-me" id="rcMe" style="left:63px;top:128px"></div>
    <button class="rc-x glass press rise" data-go="eli" aria-label="ปิด">${mk('rk_x')}</button>
    <button class="rc-sport glass press rise" style="--d:.04s" id="rcSport">${mk('rk_shoe', 'sh')}<b>${RUN.sport}</b>${mk('rk_chev', 'cv')}</button>
    <div class="rc-gps glass rise" style="--d:.08s"><i id="rcGd"></i><span id="rcGt">กำลังหา GPS…</span></div>
    <section class="rc-sheet">
      <i class="rc-grab"></i>
      <span class="rc-lp rise" style="--d:.12s">${mk('mk_flame')}<b id="rcLp">วิ่งวันนี้ได้ LP ×${m.toFixed(2)}</b></span>
      <div class="rc-tile t1 rise" style="--d:.14s">${mk('rk_watch')}<span>เวลา</span><b class="num" id="rcT">0:00</b></div>
      <div class="rc-tile t2 rise" style="--d:.17s">${mk('rk_pin')}<span>ระยะทาง</span><b class="num"><em id="rcD">0.00</em><small>กม.</small></b></div>
      <div class="rc-tile t3 rise" style="--d:.2s">${mk('rk_gauge')}<span>เพซ</span><b class="num"><em id="rcP">-'--"</em><small>/กม.</small></b></div>
      <div class="rc-tile t4 rise" style="--d:.23s">${mk('rk_heart', 'hb')}<span>หัวใจ</span><b class="num"><em id="rcH">--</em><small>bpm</small></b></div>
      <div class="rc-btns">
        <button class="rc-side l press" id="rcRoute">${mk('rk_route')}<span>เส้นทาง</span></button>
        <button class="rc-go press" id="rcGo"><span class="i0">${mk('rk_go')}<b>เริ่ม</b></span><span class="i1">${I.pause}<b>พัก</b></span></button>
        <button class="rc-side r press" id="rcSens">${mk('rk_sensor')}<span>เซนเซอร์</span></button>
      </div>
      <div class="rc-pz"><button class="rc-res press" id="rcRes">${mk('rk_go')}วิ่งต่อ</button><button class="rc-end" id="rcEnd"><i></i><span>กดค้างเพื่อจบ</span></button></div>
    </section>`;
  bindGo(pg);
  const D = appH - 844, sheet = $('.rc-sheet', pg);
  // ELi stands on the top edge of the sheet, right side (mockup ≈ x 825, feet 41px into the sheet)
  const eli = new Eli(pg, { size: 104, x: 314, y: 621 + D });
  eli.el.classList.add('rc-eli'); eli.pose('ready5');
  pg.insertAdjacentHTML('beforeend', `<i class="rc-hit" style="top:${521 + D}px"></i>`);
  const say = (t, ms = 1700) => eli.say(t, ms);
  let busy = false, dust;
  const cheer = async t => {
    if (busy) return; busy = true;
    eli.stop().pose('cheer1'); if (t) say(t);
    burst(pg, eli.x, eli.y - 70, { n: 12, dist: 56, size: 6 });
    await eli.jump(40, 460); eli.pose('cheer6'); await eli.squash(.14, 300);
    busy = false;
    if (RUN.state === 'running') eli.loop(RUNF, 11); else eli.pose('ready5');
  };
  // idle: little warm-up moves now and then so the page feels alive
  const idle = async () => {
    if (RUN.state !== 'idle' || busy || cur !== 'record') return;
    busy = true;
    const k = Math.floor(Math.random() * 3);
    if (k === 0) { eli.pose('ready6'); await eli.squash(.12, 420); eli.pose('ready5'); await eli.jump(22, 380); }
    else if (k === 1) { await eli.tilt(-7, 560); }
    else { eli.pose('ready2'); await eli.stretch(760); }
    eli.pose('ready5'); busy = false;
  };
  every(4200, idle);
  later(900, () => say('พร้อมวิ่งด้วยกันไหม? 🏃', 2200));
  $('.rc-hit', pg).onclick = () => {
    if (RUN.state === 'paused') { eli.pose('cheer5'); eli.squash(.15, 360); floatUp(pg, eli.x, eli.y - 80, '💙', 4); setTimeout(() => RUN.state === 'paused' && eli.pose('ready5'), 900); return; }
    SFX.chime?.(); buzz(12);
    cheer(RUN.state === 'running' ? ['สู้ๆ!', 'เพซดีมาก!', 'หายใจลึกๆ', 'ไปด้วยกัน!'][Math.floor(Math.random() * 4)] : ['กดเริ่มเลย!', 'วอร์มอัพแล้ว!', 'วันนี้ไปไกลแค่ไหนดี?'][Math.floor(Math.random() * 3)]);
  };
  // map route: dashed suggestion, solid line drawn as you run
  const dn = $('.dn', pg), dnh = $('.dn-h', pg), me = $('#rcMe', pg), L = dn.getTotalLength();
  [dn, dnh].forEach(p => { p.style.strokeDasharray = L; p.style.strokeDashoffset = L; });
  later(1400, () => { $('#rcGd', pg).classList.add('ok'); $('#rcGt', pg).textContent = 'GPS พร้อม'; });
  $('#rcSport', pg).onclick = () => openSheet(`<h4>เลือกกิจกรรม</h4>${[['วิ่ง', 'i_run'], ['เดิน', 'i_feet'], ['วิ่งเทรล', 'b_mountain'], ['วิ่งบนลู่', 'i_shoe']].map(([n, ic]) => `<button class="opt ${n === RUN.sport ? 'on' : ''}" data-n="${n}"><img src="${A(ic)}" alt="">${n}<i class="ck"></i></button>`).join('')}`, sh => {
    $$('.opt', sh).forEach(o => o.onclick = () => { $$('.opt', sh).forEach(x => x.classList.toggle('on', x === o)); RUN.sport = o.dataset.n; $('#rcSport b', pg).textContent = RUN.sport; setTimeout(closeSheet, 250); });
  });
  $('#rcRoute', pg).onclick = () => { toast('เส้นทางแนะนำ: ริมน้ำลูป 2.5 กม.'); $$('.sg,.sg-h', pg).forEach(p => p.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700 })); };
  $('#rcSens', pg).onclick = () => { toast('เชื่อมต่อสายคาดอก ELi HR แล้ว ♥'); $('.rc-tile.t4', pg).classList.add('on'); };
  const tick = () => {
    if (RUN.state !== 'running') return;
    RUN.sec += 6; RUN.m += 6 * (1000 / 355) * (0.94 + Math.random() * .12);   // ~5'55"/km, sped up 12x
    $('#rcT', pg).textContent = clock(RUN.sec);
    $('#rcD', pg).textContent = (RUN.m / 1000).toFixed(2);
    $('#rcP', pg).textContent = RUN.m > 50 ? paceStr(RUN.sec / (RUN.m / 1000)) : "-'--\"";
    $('#rcH', pg).textContent = 138 + Math.round(Math.sin(RUN.sec / 40) * 9 + Math.random() * 4);
    $('#rcLp', pg).textContent = `ก้าว +${fmt(Math.round(RUN.m * 1.35))} · LP ×${m.toFixed(2)}`;
    const k = Math.min(1, RUN.m / 1500), pt = dn.getPointAtLength(L * k);
    [dn, dnh].forEach(p => p.style.strokeDashoffset = L * (1 - k));
    me.style.left = pt.x + 'px'; me.style.top = pt.y + 'px';
    if (RUN.m >= RUN.next) { cheer(`ครบ ${(RUN.next / 1000).toFixed(1)} กม.! 💪`); RUN.next += 500; }
    else if (RUN.sec % 90 === 0) cheer(['สู้ๆ!', 'เพซกำลังดี!', 'หายใจลึกๆ นะ', 'ไปด้วยกัน!'][RUN.sec / 90 % 4]);
  };
  every(500, tick);
  const setRun = () => {
    RUN.state = 'running'; sheet.classList.remove('paused'); sheet.classList.add('running'); pg.classList.add('running');
    eli.hush(); eli.loop(RUNF, 11);
    clearInterval(dust); dust = setInterval(() => puff(pg, eli.x - 30, eli.y - 4, 1), 300);
  };
  $('#rcGo', pg).onclick = () => {
    if (RUN.state === 'idle') {
      RUN.state = 'warmup'; eli.hush();
      readyScene(pg).then(() => { if (cur !== 'record') return; setRun(); tick(); setTimeout(() => cheer('ไปกันเลย!'), 400); });
    } else if (RUN.state === 'running') {
      RUN.state = 'paused'; sheet.classList.remove('running'); sheet.classList.add('paused'); pg.classList.remove('running');
      clearInterval(dust); eli.stop().pose('ready4'); say('พักหายใจแป๊บนึงนะ~', 0);
    }
  };
  $('#rcRes', pg).onclick = () => { setRun(); cheer('ลุยต่อ!'); };
  const end = $('#rcEnd', pg); let ht;
  const hold = () => {
    end.classList.add('hold'); buzz(10);
    ht = setTimeout(() => {
      RUN.state = 'done'; clearInterval(dust); const km = Math.max(RUN.m / 1000, 3.21), sec = Math.max(RUN.sec, 1140);
      finishScene(pg, { km, time: clock(sec), pace: paceStr(sec / km) }).then(() => cur === 'record' && go('save'));
    }, 900);
  };
  const rel = () => { end.classList.remove('hold'); clearTimeout(ht); };
  end.addEventListener('pointerdown', hold); end.addEventListener('pointerup', rel); end.addEventListener('pointerleave', rel);
  cleanup.push(() => { clearInterval(dust); eli.remove(); });
};
