/* Onboarding — chosen design "B · story card" (design/onb_B.png). 3 slides; mascot = ORIGINAL ELi drawings, code animation only. */
const OB = [
  { pose: 'pet1', card: 'card1', t: 'น้อง <b>ELi</b> โตไปพร้อมสุขภาพคุณ', s: 'เดิน นอน และดูแลน้องทุกวัน เพื่อเติม Life Power',
    chips: [['shoe', 'เดิน', '40%'], ['moon', 'นอนหลับ', '40%'], ['heart', 'ดูแลน้อง', '20%']], y: 282 },
  { pose: 'pet5', card: 'card2', t: 'ลูบน้อง ทำเควสต์ รับ <b>Eli Coins</b>', s: 'ลูบตัวน้อง 2–3 วิ ส่งพลังใจให้เพื่อน แล้วสะสมเหรียญไว้แลกของ',
    chips: [['hand', 'ลูบน้อง', '+10 LP'], ['steps', '7,000 ก้าว', '+1 🪙'], ['moon', 'นอน 7–9 ชม.', '+1 🪙']], y: 306 },
  { pose: 'run1', card: 'card3', t: 'วิ่งไปด้วยกัน ขึ้น <b>Hero Hall</b>', s: 'บันทึกการวิ่ง แชร์สตอรี่ด้วยรูปของคุณ และติดอันดับกับเพื่อนทุกสัปดาห์',
    chips: [['run', 'บันทึกวิ่ง', 'GPS'], ['story', 'แชร์สตอรี่', 'รูปของฉัน'], ['trophy', 'Hero Hall', 'รายสัปดาห์']], y: 300 },
];
LIFE.onboard = pg => {
  let i = 0, busy = false;
  pg.innerHTML = `
    <div class="wl-sky"></div>
    <img class="ob-deco ob-c1" src="${A('wl_cloud1')}" alt=""><img class="ob-deco ob-c2" src="${A('wl_cloud2')}" alt="">
    ${[[20, 110, 'wl_leaf3', 20], [356, 300, 'wl_leaf1', 22], [14, 520, 'wl_leaf2', 18], [352, 600, 'wl_leaf3', 16]].map(([x, y, n, s], k) => `<img class="wl-f" src="${A(n)}" style="left:${x}px;top:${y}px;width:${s}px;--d:${-k * 1.7}s;--t:${9 + k}s" alt="">`).join('')}
    <button class="ob-skip" id="obSkip">ข้าม</button>
    <div class="ob-card" id="obCard">${OB.map((s, k) => `<img class="ob-scene ${k ? '' : 'on'}" src="${A(s.card)}" alt="">`).join('')}<i class="ob-pod"></i><div class="ob-hint" id="obHint"></div></div>
    <div class="ob-text" id="obText"></div>
    <div class="ob-dots">${OB.map((_, k) => `<i class="${k ? '' : 'on'}"></i>`).join('')}</div>
    <button class="ob-next press" id="obNext"><span class="ob-nl">ถัดไป</span><span class="ob-nb">${ic('arrow')}</span></button>`;
  const card = $('#obCard', pg), text = $('#obText', pg), hint = $('#obHint', pg);
  const CY = () => card.offsetHeight - 372;   // card height differs on short screens; ELi keeps standing on the same ground
  const e = new Eli(card, { size: appH < 760 ? 150 : 172, x: 169, y: OB[0].y + CY() });
  e.el.classList.add('ob-eli');
  cleanup.push(() => { clearMode(); e.remove(); });

  const renderText = () => {
    const s = OB[i];
    text.innerHTML = `<h2 class="rise">${s.t}</h2><p class="rise" style="--d:.06s">${s.s}</p>
      <div class="ob-chips">${s.chips.map(([icn, l, v], k) => `<div class="ob-chip pop" style="--d:${.12 + k * .08}s">${ic(icn)}<div><span>${l}</span><b class="num ${v.length > 4 ? 'sm' : ''}">${v}</b></div></div>`).join('')}</div>`;
    if (i === 0) $$('.ob-chip b', text).forEach(b => { const n = parseInt(b.textContent); countUp(b, n, 900, v => Math.round(v) + '%'); });
  };
  // per-slide mascot behaviour (all code-driven on the original drawings)
  let timers = [];
  const every2 = (ms, f) => timers.push(setInterval(f, ms));
  const clearMode = () => { timers.forEach(clearInterval); timers = []; };
  const startMode = () => {
    clearMode(); e.stop(); hint.className = 'ob-hint'; card.classList.toggle('runlane', i === 2);
    const s = OB[i]; e.pose(s.pose); $('.ob-pod', card).style.top = s.y + CY() - 16 + 'px';
    if (i === 0) {
      e.moveTo(169, s.y + CY(), 1); e.say('สวัสดี! เราจะโตไปด้วยกันนะ', 2200);
      every2(650, () => auraParticle(card, 'vibrant'));
    } else if (i === 1) {
      e.moveTo(169, s.y + CY(), 1); hint.textContent = '✋ ลองลูบน้องดูสิ'; hint.classList.add('on');
      every2(900, () => { if (!petting) floatUp(card, 200 + Math.random() * 40, 150, Math.random() < .5 ? '♪' : '♫', 1); });
    } else {
      e.loop(RUNF, 14);
      const lap = () => { e.moveTo(430, s.y + CY(), 1); e.moveTo(-90, s.y + CY(), 2600, 'linear'); };
      lap(); every2(2700, lap);
      every2(160, () => puff(card, parseFloat(getComputedStyle(e.el).left) + 40, s.y + CY() + 2, 1, 1));
    }
  };
  const go2 = async k => {
    if (busy || k === i || k < 0 || k >= OB.length) return; busy = true;
    const dir = k > i ? 1 : -1;
    clearMode(); e.stop(); e.hush();
    await e.squash(.12, 200);
    $$('.ob-scene', card).forEach((im, n) => { im.classList.toggle('on', n === k); im.style.setProperty('--dx', (n < k ? -1 : n > k ? 1 : 0) * 40 + 'px'); });
    e.el.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: `translateX(${-dir * 80}px)` }], { duration: 220, fill: 'forwards' });
    await new Promise(r => setTimeout(r, 230));
    i = k; renderText();
    $$('.ob-dots i', pg).forEach((d, n) => d.classList.toggle('on', n === i));
    $('#obNext', pg).classList.toggle('last', i === OB.length - 1);
    $('.ob-nl', pg).textContent = i === OB.length - 1 ? 'เริ่มเลย' : 'ถัดไป';
    e.pose(OB[i].pose);
    e.el.getAnimations().forEach(a => a.cancel());
    e.el.animate([{ opacity: 0, transform: `translateX(${dir * 80}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 420, easing: 'cubic-bezier(.22,1,.36,1)' });
    startMode(); SFX.pop();
    busy = false;
  };
  // petting demo on slide 2
  let petting = false, last = null, acc = 0, lastFx = 0, rewarded = false;
  card.addEventListener('pointerdown', ev => { if (i !== 1) return; petting = true; last = ev; card.setPointerCapture(ev.pointerId); hint.classList.remove('on'); });
  card.addEventListener('pointermove', ev => {
    if (!petting || i !== 1) return;
    const dx = ev.clientX - last.clientX, dt = ev.timeStamp - last.timeStamp; last = ev;
    if (Math.abs(dx) < 1 || dt > 200) return;
    acc += dt; e.pose(dx < 0 ? 'pet2' : 'pet3');
    if (ev.timeStamp - lastFx > 120) { lastFx = ev.timeStamp; const r = card.getBoundingClientRect(), k2 = appK(); floatUp(card, (ev.clientX - r.left) / k2, (ev.clientY - r.top) / k2, Math.random() < .7 ? '💗' : '✨', 1); SFX.chime(); buzz(10); }
    if (acc > 2200 && !rewarded) { rewarded = true; SFX.giggle(); popNum(card, 169, 70, '⚡ +10 Life Power!', 'gold'); e.pose('pet4'); e.jump(50, 500); e.say('งื้อออ สบายจังเลย~', 1800); }
  });
  const end = () => { if (!petting) return; petting = false; setTimeout(() => i === 1 && !petting && e.pose('pet5'), 700); };
  card.addEventListener('pointerup', end); card.addEventListener('pointercancel', end);
  // swipe between slides (outside the card on slide 2, anywhere otherwise)
  let x0 = null;
  pg.addEventListener('pointerdown', ev => { if (i === 1 && card.contains(ev.target)) return; x0 = ev.clientX; });
  pg.addEventListener('pointerup', ev => { if (x0 == null) return; const dx = ev.clientX - x0; x0 = null; if (Math.abs(dx) > 50) go2(i + (dx < 0 ? 1 : -1)); });
  $$('.ob-dots i', pg).forEach((d, n) => d.onclick = () => go2(n));
  $('#obNext', pg).onclick = () => i === OB.length - 1 ? go('eli') : go2(i + 1);
  $('#obSkip', pg).onclick = () => go('eli');
  renderText();
  setTimeout(() => { if (cur === 'onboard') { e.el.animate([{ opacity: 0, transform: 'translateY(30px) scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.34,1.56,.64,1)' }); startMode(); } }, 250);
};
