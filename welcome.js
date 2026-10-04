/* Welcome screen — chosen design "B · clean minimal" (design/welcome_B.png).
   Scenery = Codex cut-out layers; mascot = the owner's ORIGINAL ELi drawing (eli_run), animated by code only. */
LIFE.welcome = pg => {
  const fx = ['wl_leaf1', 'wl_leaf2', 'wl_leaf3', 'wl_leaf4', 'wl_spark1', 'wl_spark2', 'wl_dot'];
  const floaters = [[34, 270, 0, 22, 9], [330, 210, 2, 26, 11], [300, 470, 4, 18, 8], [58, 520, 5, 16, 10], [352, 380, 1, 20, 12], [26, 400, 6, 14, 9], [270, 150, 3, 22, 13]];
  pg.innerHTML = `
    <div class="wl-sky"></div>
    <div class="wl-glow"></div>
    <div class="wl-layer" data-d="6"><img class="wl-p wl-cl1" src="${A('wl_cloud1')}" alt=""><img class="wl-p wl-cl2" src="${A('wl_cloud2')}" alt=""><img class="wl-p wl-cl3" src="${A('wl_cloud3')}" alt=""></div>
    <div class="wl-layer" data-d="12"><img class="wl-p wl-sl" src="${A('wl_sceneL')}" alt=""><img class="wl-p wl-sr" src="${A('wl_sceneR')}" alt=""></div>
    <div class="wl-layer" data-d="18">${floaters.map(([x, y, k, s, d], i) => `<img class="wl-f" src="${A(fx[k])}" style="left:${x}px;top:${y}px;width:${s}px;--d:${-i * 1.3}s;--t:${d}s" alt="">`).join('')}</div>
    <div class="wl-brand">
      <span class="mark wl-mark"></span><b class="wl-word">${[...'ELi'].map((c, i) => `<span style="--i:${i}">${c}</span>`).join('')}</b>
    </div>
    <p class="wl-tag">Every Step Makes You Better.</p>
    <p class="wl-th">สุขภาพดี เริ่มได้จากก้าวแรก</p>
    <svg class="wl-swoosh" viewBox="0 0 160 14"><path d="M4 10 C40 2 110 1 156 6"/></svg>
    <div class="wl-stage" id="wst"><i class="wl-pod"></i></div>
    <div class="wl-layer wl-front" data-d="26"><img class="wl-p wl-lv1" src="${A('wl_leaves')}" alt=""><img class="wl-p wl-lv2" src="${A('wl_leaves')}" alt=""></div>
    <button class="wl-btn p press" id="wStart">เริ่มใช้งาน <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg></button>
    <button class="wl-btn s press" id="wLogin">เข้าสู่ระบบ</button>
    <div class="wl-dots"><i class="on"></i><i></i><i></i></div>`;
  const st = $('#wst', pg);
  // the mascot: original drawing, enters running from the right (the drawing faces left), then idles
  const e = new Eli(st, { size: appH < 760 ? 210 : 240, x: 520, y: 236 });
  e.el.classList.add('wl-eli');
  const T = timeline();
  cleanup.push(() => { T.cancel(); e.remove(); });
  (async () => {
    try {
      await T.wait(650);
      e.loop(RUNF, 14);
      const dust = setInterval(() => puff(st, parseFloat(getComputedStyle(e.el).left) + 46, 238, 1, 1), 140);
      await T.run(e.moveTo(195, 236, 1150, 'cubic-bezier(.25,.8,.35,1)'));
      clearInterval(dust); e.stop().pose('run1'); puff(st, 195, 238, 5, 1);
      await T.run(e.squash(.18, 420));
      e.say('สวัสดี! ไปเดินด้วยกันนะ', 2200);
      for (let i = 0; ; i++) {          // idle: breathe (CSS) + an occasional happy hop or wiggle
        await T.wait(2600 + Math.random() * 1400);
        if (i % 2) { await T.run(e.jump(34, 460)); } else { await T.run(e.tilt(i % 4 ? 5 : -5, 600)); }
      }
    } catch (err) { if (err !== CANCEL) throw err; }
  })();
  e.el.style.pointerEvents = 'auto'; e.el.style.cursor = 'pointer';
  e.el.onclick = async () => {
    SFX.pop(); buzz(15);
    e.pose('cheer1'); burst(st, 195, 70, { n: 14, dist: 80, colors: ['#1F5BFF', '#FFC83D', '#7EC8FF', '#fff'], shape: 'star', size: 9 });
    e.say(['ฮัลโหล~ เราชื่อ ELi', 'วันนี้เดินกี่ก้าวแล้ว?', 'ลูบหัวเราได้นะ!', 'ไปกันเลย!'][Math.random() * 4 | 0], 1800);
    await e.jump(70, 560); e.pose('run1');
  };
  // drawing swoosh + parallax that follows the pointer
  const sw = $('.wl-swoosh path', pg); drawPath(sw, 900, 1100);
  const layers = $$('.wl-layer', pg);
  const onMove = ev => {
    const r = pg.getBoundingClientRect(), nx = (ev.clientX - r.left) / r.width - .5, ny = (ev.clientY - r.top) / r.height - .5;
    layers.forEach(l => { const d = +l.dataset.d; l.style.transform = `translate(${-nx * d}px,${-ny * d * .6}px)`; });
  };
  pg.addEventListener('pointermove', onMove);
  $('#wStart', pg).onclick = () => { SFX.pop(); go('onboard'); };
  $('#wLogin', pg).onclick = () => { SFX.pop(); go('onboard'); };   // same entry flow as เริ่มใช้งาน
};
