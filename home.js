/* ELi home — chosen design "A · full-screen park" (design/fs_A.png). Scene fills the screen, UI floats as frosted glass.
   Life Power logic lives in life.js; mascot = ORIGINAL ELi drawings, code animation only. (previous bento version: gen/home_C_bento.js.bak) */
const QUESTS = [['shoe', 'เดินครบ 7,000 ก้าว', '+1 Coin'], ['moon', 'นอน 7–9 ชม. ต่อเนื่อง', '+1 Coin'], ['heart', 'ลูบตัวน้อง ELi', '+10 LP'], ['send', 'ส่งพลังใจใน Hero Hall', '+10 LP']];

function auraParticle(stage, key, cx = 195, cy = 300) {
  if (key === 'sprout0') return;
  const ch = { sprout: ['🍃', '•'], vibrant: ['💧', '✦'], guardian: ['🔹', '✦'], champion: ['🔥', '✨'], eternal: ['⭐', '✨', '🌟'] }[key];
  const p = document.createElement('i'); p.className = `ap ap-${key}`; p.textContent = ch[Math.random() * ch.length | 0];
  p.style.left = cx + (Math.random() - .5) * 190 + 'px'; p.style.top = cy - Math.random() * 50 + 'px'; stage.append(p);
  p.animate([{ transform: 'translate(-50%,0) scale(.3)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(calc(-50% + ${(Math.random() - .5) * 50}px),-${100 + Math.random() * 70}px) scale(1)`, opacity: 0 }], { duration: 2200, easing: 'ease-out' }).fin.then(() => p.remove());
}
/* the home scene is always the daytime park (no evening/night variants) */
const timeOfDay = () => 'day';
const questsDone = t => [t.steps >= 7000, t.sleep >= 7 && t.sleep <= 9, t.pet, t.sent];

function refreshHome() {
  const pg = $('.pg.eli'); if (!pg) return;
  const t = G.today, parts = [LPX.walk(t.steps), LPX.sleep(t.sleep), LPX.app(t)], b = parts[0] + parts[1] + parts[2], e = earn(b, LPX.mult(G.streak));
  const lpE = $('#lpE', pg); if (lpE) { lpE._cu = (lpE._cu || 0) + 1; lpE.textContent = fmt(e); }
  [40, 40, 20].forEach((max, k) => { const c = $(`#lp${k}`, pg); if (!c) return; $('b', c).textContent = `${parts[k]}/${max}`; $('i', c).style.width = parts[k] / max * 100 + '%'; });
  const qs = questsDone(t), n = qs.filter(Boolean).length;
  const qn = $('#qn', pg); if (qn) qn.textContent = n;
  const gift = $('#hGift', pg); if (gift) { gift.classList.toggle('ready', n === 4 && !t.chest); gift.classList.toggle('opened', !!t.chest); }
  $$('[data-coins]').forEach(el => el.textContent = fmt(G.coins));
}

LIFE.eli = pg => {
  const Lr = LPX.level(G.total), L = G.preview || Lr, T = LPX.tier(L), lo = LPX.req(Lr), hi = LPX.req(Lr + 1);
  const vital = G.preview ? 'happy' : G.vital, m = LPX.mult(G.streak), tod = timeOfDay();
  const bg = G.theme ? themeBg() : 'home_tall_day';   // mockup scene (full width) + painted sky above
  pg.classList.add('t-' + tod);
  pg.innerHTML = `
    <div class="fsl fs-bgw" data-d="8"><img class="fs-bg" src="${A(bg)}" alt=""></div>
    <i class="fs-night"></i>
    <div class="fsl" data-d="16">${[[30, 330, 'wl_leaf1', 18], [350, 250, 'wl_leaf3', 20], [330, 470, 'wl_leaf2', 16], [46, 520, 'wl_leaf3', 14], [300, 160, 'wl_spark2', 14]].map(([x, y, n2, s], k) => `<img class="wl-f" src="${A(n2)}" style="left:${x}px;top:${y}px;width:${s}px;--d:${-k * 1.6}s;--t:${9 + k}s" alt="">`).join('')}</div>
    <div class="fs-stage v-${vital}" id="estage">
      <i class="fs-pod"></i><div class="aura t-${T.key}"><i></i><i></i><i></i></div>
      ${T.key === 'champion' || T.key === 'eternal' ? '<img class="crown" src="assets/it_crown.webp" alt="">' : ''}
      <svg class="pring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="pr-bg"/><circle cx="60" cy="60" r="54" class="pr-fg" id="prf"/></svg>
    </div>
    <header class="fs-top">
      <div class="gl fs-brand rise"><span class="mark" style="width:26px;height:31px;color:var(--blue)"></span><b>บ้านน้อง ELi</b></div>
      <button class="gl fs-pill press coinchip2 rise" style="--d:.05s" data-go="treasury"><img class="mk " src="assets/mk_coin.png" alt=""><b data-coins>${fmt(G.coins)}</b></button>
      <button class="gl fs-pill press rise" style="--d:.1s" id="hFire"><img class="mk " src="assets/mk_flame.png" alt=""><b>${G.streak} วัน ×${m.toFixed(2)}</b></button>
    </header>
    <button class="gl fs-lv press rise" id="lvb" style="--d:.12s"><span class="fs-lv-ic"><img class="mk " src="assets/mk_crown.png" alt=""></span>
      <div><div class="fs-lv-t"><b>Lv.${L}</b> ${T.name}${G.preview ? ' <em>พรีวิว</em>' : ''}<span class="num">${fmt(G.total)} / ${fmt(hi)} LP</span></div><div class="pb"><i style="width:0" data-w="${G.preview ? 100 : Math.min(100, (G.total - lo) / (hi - lo) * 100)}"></i></div></div></button>
    <div class="gl fs-hint pop" id="hint" style="--d:.9s"><img class="mk " src="assets/mk_hand.png" alt=""><span>${vital === 'lonely' ? 'น้องไม่สบาย<br><b>ลูบปลอบหน่อย</b>' : vital === 'sleepy' ? 'น้องง่วงแล้ว<br><b>ลูบปลุกหน่อย</b>' : G.today.pet ? 'ลูบเล่นต่อ<br><b>ได้เลย 💙</b>' : 'ลูบตัวน้อง 2–3 วิ<br><b>+10</b> 💛'}</span></div>
    ${G.revival ? `<button class="gl fs-rev pop" id="revB" style="--d:.6s">🌈 <span>ฟื้นฟูพลังชีวิต <b>${G.revival.days}/3</b></span></button>` : ''}
    <section class="gl fs-panel rise" id="lpCard" style="--d:.18s">
      <div class="fs-lp">
        <div class="fs-lp-h">Life Power วันนี้ <b class="num" id="lpE">0</b></div>
        <div class="fs-parts">${[['mk_shoe', 'เดิน'], ['mk_moon', 'นอนหลับ'], ['mk_heart', 'ดูแลน้อง']].map(([n2, l], k) => `<div id="lp${k}"><img class="mk" src="assets/${n2}.png" alt=""><span>${l}<b class="num"></b></span><div class="pb"><i></i></div></div>`).join('')}</div>
      </div>
      <button class="fs-gift press" id="hGift"><span class="gb"><img class="mk " src="assets/mk_gift.png" alt=""></span><span class="gq">เควสต์ <b id="qn">0</b>/4</span></button>
    </section>`;
  bindGo(pg);
  const stage = $('#estage', pg), D = appH - 844;   // positions below follow the screen bottom (responsive height)
  homeEli = new Eli(stage, { size: 196, x: 195, y: 646 + D });
  const idlePose = () => vital === 'lonely' ? 'pet6' : vital === 'sleepy' ? 'pet5' : 'pet1';
  homeEli.pose(idlePose()); homeEli.el.classList.add('home-eli');
  homeEli.el.animate([{ opacity: 0, transform: 'translateY(30px) scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 200, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
  refreshHome();
  setTimeout(() => { $$('.fs-lv .pb i', pg).forEach(i => i.style.width = i.dataset.w + '%'); countUp($('#lpE', pg), earnedToday(), 900); }, 150);
  if (tod === 'night') for (let k = 0; k < 18; k++) { const s = document.createElement('i'); s.className = 'star'; s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 26}%;--d:${Math.random() * 3}s`; $('.fs-night', pg).append(s); }
  // parallax: layers drift with the finger / mouse
  const layers = $$('.fsl', pg);
  pg.addEventListener('pointermove', ev => { const r = pg.getBoundingClientRect(), nx = (ev.clientX - r.left) / r.width - .5, ny = (ev.clientY - r.top) / r.height - .5; layers.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate(${-nx * d}px,${-ny * d * .5}px)`; }); });
  // ambient: tier aura, zZz when sleepy, tears when sick, idle hops when happy
  every(700, () => {
    if (!document.body.contains(stage)) return;
    if (vital === 'sleepy') floatUp(stage, 250, 490 + D, 'z', 1);
    else if (vital === 'lonely') { if (Math.random() < .4) floatUp(stage, 172, 540 + D, '💧', 1); }
    else auraParticle(stage, T.key, 195, 600 + D);
  });
  let idleN = 0;
  every(3200, () => { if (petting || vital !== 'happy' || !homeEli) return; idleN++; if (idleN % 3 === 0) homeEli.jump(30, 440); else homeEli.squash(.06, 500); });

  // ── petting: 2–3 s of accumulated swiping over ELi = +10 LP once a day (spec), endless play afterwards ──
  let petting = false, last = null, acc = G.today.petMs, lastFx = 0, lastSnd = 0, hold = null;
  const prf = $('#prf', pg), C = 2 * Math.PI * 54, NEED = 2500;
  prf.style.strokeDasharray = C; const ring = v => prf.style.strokeDashoffset = C * (1 - Math.min(1, v / NEED));
  ring(G.today.pet ? 0 : acc);
  const hit = document.createElement('div'); hit.className = 'pet-hit'; stage.append(hit);
  const relInStage = e => { const r = stage.getBoundingClientRect(), k = appK(); return { x: (e.clientX - r.left) / k, y: (e.clientY - r.top) / k }; };
  hit.addEventListener('pointerdown', e => { petting = true; last = { x: e.clientX, y: e.clientY, t: performance.now() }; hit.setPointerCapture(e.pointerId); stage.classList.add('petting'); $('#hint', pg).classList.add('off'); SFX.ac(); });
  hit.addEventListener('pointermove', e => {
    if (!petting) return;
    const now = performance.now(), dx = e.clientX - last.x, dist = Math.hypot(dx, e.clientY - last.y), dt = now - last.t;
    last = { x: e.clientX, y: e.clientY, t: now };
    if (dist < 1.5 || dt > 200) return;
    acc += dt;
    homeEli.pose(dx < 0 ? 'pet2' : 'pet3');
    if (now - lastFx > 110) { lastFx = now; const p = relInStage(e); burst(stage, p.x, p.y, { n: 3, dist: 36, size: 7, colors: ['#FF8FB1', '#FF4D6D', '#FFD54F'], shape: Math.random() < .5 ? 'star' : 'dot' }); floatUp(stage, p.x, p.y, Math.random() < .7 ? '💗' : '✨', 1); buzz(12); }
    if (now - lastSnd > 230) { lastSnd = now; SFX.chime(); }
    if (!G.today.pet) { ring(acc); G.today.petMs = acc; if (acc >= NEED) petDone(); }
    else if (acc > NEED * 1.2) { acc = 0; homeEli.pose('pet4'); SFX.giggle(); homeEli.say(EXTRA_LINES[Math.random() * EXTRA_LINES.length | 0], 1500); }
  });
  const end = () => { if (!petting) return; petting = false; stage.classList.remove('petting'); clearTimeout(hold); hold = setTimeout(() => homeEli && !petting && homeEli.pose(idlePose()), 500); saveG(); };
  hit.addEventListener('pointerup', end); hit.addEventListener('pointercancel', end);
  hit.addEventListener('click', () => { if (acc > 300) return; homeEli.pose(vital === 'happy' ? 'cheer1' : idlePose()); homeEli.jump(40, 440); SFX.pop(); homeEli.say(vital === 'happy' ? ['จิ้มทำไมอ่า~ ลูบดีกว่า!', 'ไปเดินกันไหม?', 'วันนี้เป็นไงบ้าง?'][Math.random() * 3 | 0] : 'ลูบตัวหน่อยนะ...', 1500); setTimeout(() => homeEli && homeEli.pose(idlePose()), 900); });
  async function petDone() {
    G.today.pet = true; G.today.petMs = NEED; petting = false; stage.classList.remove('petting');
    const woke = vital !== 'happy';
    G.vital = 'happy'; G.away = 0; saveG();
    buzz([20, 40, 60]); SFX.giggle(); setTimeout(() => SFX.coin(), 250);
    homeEli.pose('pet4'); await homeEli.shake(420, 3);
    homeEli.pose('pet1'); await homeEli.jump(56, 540);
    popNum(stage, 195, 430 + appH - 844, '⚡ +10 Life Power!', 'gold');
    homeEli.say(woke ? 'หายแล้ว! คิดถึงที่สุดเลย 💙' : PET_LINES[Math.random() * PET_LINES.length | 0], 2400);
    flyTo(homeEli.el, $('#lpCard'), '💗', 7, () => { refreshHome(); const c = $('#lpCard'); if (c) { c.classList.remove('hop'); void c.offsetWidth; c.classList.add('hop'); } });
    $('#hint span', pg).innerHTML = 'ลูบเล่นต่อ<br><b>ได้เลย 💙</b>';
    if (woke) { stage.classList.remove('v-sleepy', 'v-lonely'); stage.classList.add('v-happy'); confetti(80); setTimeout(() => go('eli', { force: true, dir: 'none' }), 2600); }
  }
  // quests sheet (gift), streak sheet, level, demo
  $('#hGift', pg).onclick = questSheet;
  $('#hFire', pg).onclick = () => openSheet(`<h4>${ic('flame')} Streak ${G.streak} วัน</h4>
    <p style="font-size:14px;color:var(--ink2);line-height:1.6;margin:0 0 12px">ตัวคูณวันนี้ <b>×${m.toFixed(2)}</b> = 1 + 0.05 × ${Math.min(G.streak, 30)} วัน (สูงสุด ×2.50 ที่ 30 วัน)<br>Life Power วันนี้ = ฐาน × ตัวคูณ · ถ้าลืมเข้าแอป Streak จะลดครึ่ง หรือใช้น้ำยาฟื้นฟู 10 Coins รักษาไว้</p>
    <div class="fire-row">${[1, 7, 14, 21, 30].map(d => `<div class="${G.streak >= d ? 'on' : ''}"><b class="num">×${LPX.mult(d).toFixed(2)}</b><span>${d} วัน</span></div>`).join('')}</div>
    <div style="height:14px"></div><button class="btn btn-d press" data-close>เข้าใจแล้ว</button>`);
  const rv = $('#revB', pg); if (rv) rv.onclick = () => openSheet(`<h4>🌈 เควสต์ฟื้นฟูพลังชีวิต</h4><p style="font-size:14px;color:var(--ink2);line-height:1.6">เดินครบ 7,000 ก้าว 3 วันติด เพื่อดึงพลังที่สลายไปกลับมา <b>+${fmt(G.revival.back)} LP</b> (50%)</p><div class="rdots">${[0, 1, 2].map(i => `<i class="${i < G.revival.days ? 'on' : ''}"></i>`).join('')}</div><div style="height:14px"></div><button class="btn btn-o press" data-close>สู้!</button>`);
  $('#lvb', pg).onclick = tierSheet;
  $('.fs-brand', pg).ondblclick = () => openSheet(demoHTML(), sh => bindDemo(sh, () => closeSheet()));   // demo time machine (hidden: double-tap the logo)
  if (G.shield && !$('#sheet').innerHTML) setTimeout(() => shieldSheet(0), 900);
  cleanup.push(() => { homeEli && homeEli.remove(); homeEli = null; });
};

function questSheet() {
  const t = G.today, qs = questsDone(t), all = qs.every(Boolean);
  openSheet(`<div class="qs-h"><h4>เควสต์ประจำวัน ${qs.filter(Boolean).length}/4</h4><span>รีเซ็ตเที่ยงคืน</span></div>
    ${QUESTS.map(([n, l, r], k) => `<button class="qs-r ${qs[k] ? 'done' : ''}" data-q="${k}">${ic(n)}<span>${l}</span><em>${r}</em>${ic('check', 'ck')}</button>`).join('')}
    <button class="qs-chest ${all && !t.chest ? 'ready' : ''} ${t.chest ? 'opened' : ''}" id="qsChest"><img src="${A('it_chest')}" alt=""><div><b>${t.chest ? 'เปิดกล่องวันนี้แล้ว' : all ? 'เปิดกล่องรางวัลได้เลย!' : 'ทำครบ 4 ข้อ เปิดกล่องรางวัล'}</b><small>ลุ้นสติกเกอร์น้อง ELi สะสมครบได้ชุดลิมิเต็ด</small></div></button>
    <div class="qs-short"><button data-go="hall">${ic('trophy')}Hero Hall</button><button data-go="treasury">${ic('gift')}คลังสมบัติ</button><button id="qsTheme">${ic('house')}ธีมบ้านน้อง</button></div>`, sh => {
    bindGo(sh);
    $$('.qs-r', sh).forEach(r => r.onclick = () => {
      const k = +r.dataset.q;
      if (qs[k]) return toast('ทำสำเร็จแล้ว ✓');
      closeSheet();
      if (k === 0) addSteps(1500, $('#lpCard')); else if (k === 1) DEMO[1][1](); else if (k === 2) homeEli && homeEli.say('ลูบตรงนี้เลย~ 👆', 1600); else go('hall');
    });
    $('#qsChest', sh).onclick = () => {
      if (t.chest) return toast('พรุ่งนี้มาเปิดใหม่นะ');
      if (!all) { $('#qsChest', sh).classList.add('shake'); return setTimeout(() => $('#qsChest', sh) && $('#qsChest', sh).classList.remove('shake'), 450); }
      t.chest = true; G.stickers++; saveG(); closeSheet(); refreshHome(); openChest();
    };
    $('#qsTheme', sh).onclick = () => { closeSheet(); setTimeout(wardrobe, 300); };
  });
}
