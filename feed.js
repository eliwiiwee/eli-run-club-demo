/* Feed — chosen design "B · clean white" (design/fd_B.png). Calm pale-blue page, white cards, post picture = route map blended
   into a photo with glass stat chips. Icons are cut from the mockup (assets/fk_*.png, mk_*.png). Replaces app.js's earlier feed. */
LIFE.feed = pg => {
  const mk = (n, c = '') => `<img class="mk ${c}" src="assets/${n}.png" alt="">`;
  const wk = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
  const m = LPX.mult(G.streak);
  pg.innerHTML = `<div class="scroll fdb">
    <header class="fb-top">
      <div class="fb-pill fb-title rise">${mk('fk_doc')}<b>ฟีด</b></div>
      <button class="fb-circ press rise" style="--d:.03s" id="fbSearch" aria-label="ค้นหา">${mk('fk_search')}</button>
      <button class="fb-circ press rise" style="--d:.06s" id="fbBell" aria-label="แจ้งเตือน">${mk('fk_bell')}<i class="fb-dot"></i></button>
      <button class="fb-pill fb-coin press coinchip2 rise" style="--d:.09s" data-go="treasury">${mk('mk_coin')}<b data-coins>${fmt(G.coins)}</b></button>
      <button class="fb-pill fb-fire press rise" style="--d:.12s" data-go="eli">${mk('mk_flame')}<b>${G.streak} วัน ×${m.toFixed(2)}</b></button>
    </header>
    <div class="fb-seg rise" style="--d:.1s"><i class="ind"></i><button class="on" data-f="all">กำลังติดตาม</button><button data-f="me">ของฉัน</button><button data-f="club">คลับ</button></div>
    <section class="fb-card fb-week rise" style="--d:.14s">
      <div class="fb-wh">${mk('fk_chart')}<b>สัปดาห์นี้ของคุณ</b><span class="fb-streak">${mk('fk_flame')}${ME.streak} วันติด</span></div>
      <div class="fb-stats">
        <div>${mk('fk_pin')}<span>ระยะทาง<b class="num"><em id="fbKm">0</em><small>กม.</small></b></span></div>
        <div>${mk('fk_flame')}<span>เวลา<b class="num">${clock(ME.weekSec).replace(/:\d\d$/, '')}<small>ชม.</small></b></span></div>
        <div>${mk('fk_mount')}<span>ความสูง<b class="num">${ME.weekElev}<small>ม.</small></b></span></div>
      </div>
      <div class="fb-bars">${ME.week.map((v, i) => `<div><i class="${v > 4.5 ? 'hi' : ''}" data-h="${8 + Math.max(v, .8) / 9.6 * 34}"></i><span>${wk[i]}</span></div>`).join('')}</div>
    </section>
    <div id="fbList"></div>
  </div>`;
  bindGo(pg);
  const sc = $('.scroll', pg), list = $('#fbList', pg);
  countUp($('#fbKm', pg), ME.weekKm, 1000, v => v.toFixed(1));
  setTimeout(() => $$('.fb-bars i', pg).forEach((b, k) => setTimeout(() => b.style.height = b.dataset.h + 'px', k * 60)), 200);
  const seg = $('.fb-seg', pg), ind = $('.ind', seg);
  const setSeg = b => { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft - 3}px)`; };
  requestAnimationFrame(() => setSeg($('button.on', seg)));
  const post = (a, k) => {
    const [nm, av] = PEOPLE[a.who], on = KUDO[a.id];
    const pace = paceStr(a.sec / a.km);
    return `<article class="fb-card fb-post reveal" data-id="${a.id}" style="transition-delay:${Math.min(k, 2) * 70}ms">
      <div class="fp-h"><img class="fp-av" src="${A(av)}" alt=""><div><b>${a.who === 'me' ? 'คุณ' : nm}</b><span>${a.when.replace(' · ', ' • ')}</span></div><button class="fp-more" aria-label="เพิ่มเติม">${mk('fk_dots')}</button></div>
      <h3>${a.t}</h3>
      <p class="fp-line">ระยะทาง <b>${a.km.toFixed(2)}</b> กม. &nbsp;•&nbsp; เพซ <b>${pace}</b> /กม. &nbsp;•&nbsp; เวลา <b>${clock(a.sec)}</b></p>
      ${a.ach ? `<span class="fp-pr">${mk('fk_medal')}${a.ach[1].split('·')[0].trim()}</span>` : ''}
      <div class="fp-pic">
        <img class="fp-map" src="${A('bg_map')}" style="object-position:${a.mp}" alt="">
        <img class="fp-photo" src="${A(a.ph[0])}" alt="">
        <svg class="fp-route" viewBox="0 0 358 196" preserveAspectRatio="xMidYMid meet"><path class="rc" d="${ROUTES[a.r]}"/><path class="rl" d="${ROUTES[a.r]}"/></svg>
        <div class="fp-chips"><span>${mk('fk_mpin')}<b class="num">${a.km.toFixed(2)}<small>กม.</small></b></span><span>${mk('fk_watch')}<b class="num">${clock(a.sec)}<small>เวลา</small></b></span><span>${mk('fk_gauge')}<b class="num">${pace}<small>/กม.</small></b></span></div>
      </div>
      <div class="fp-act">
        <button class="fp-k ${on ? 'on' : ''}">${mk('fk_heart')}<span>ให้กำลังใจ <b class="kc">${a.k + (on ? 1 : 0)}</b></span></button>
        <button class="fp-c">${mk('fk_cmt')}<span>ความคิดเห็น ${a.c}</span></button>
        <button class="fp-s">${mk('fk_share')}<span>แชร์</span></button>
      </div>
    </article>`;
  };
  const render = items => {
    list.innerHTML = items.map(post).join('');
    onSeen(sc, '.reveal', el => {
      el.classList.add('seen');
      const p = $('.rl', el), c = $('.rc', el);
      if (p) { drawPath(p, 1500, 250); drawPath(c, 1500, 250); setTimeout(() => endDots(el), 1700); }
    });
  };
  // start (green) and finish (checkered) markers placed at the ends of the drawn route
  const endDots = el => {
    const p = $('.rl', el), svg = $('.fp-route', el); if (!p || $('.fp-s0', el)) return;
    const L = p.getTotalLength(), a = p.getPointAtLength(0), b = p.getPointAtLength(L);
    svg.insertAdjacentHTML('beforeend', `<circle class="fp-s0" cx="${a.x}" cy="${a.y}" r="7"/><g class="fp-fin" transform="translate(${b.x} ${b.y})"><circle r="7.5"/><path d="M-4 -4h4v4h-4zM0 0h4v4h-4z"/></g>`);
  };
  render(FEED);
  $$('button', seg).forEach(b => b.onclick = () => {
    $$('button', seg).forEach(x => x.classList.toggle('on', x === b)); setSeg(b);
    const f = b.dataset.f; render(f === 'me' ? FEED.filter(a => a.who === 'me') : f === 'club' ? FEED.filter(a => a.who !== 'me').slice().reverse() : FEED);
  });
  list.addEventListener('click', e => {
    const card = e.target.closest('.fb-post'); if (!card) return;
    const a = FEED.find(x => x.id === card.dataset.id);
    const kb = e.target.closest('.fp-k');
    if (kb) {
      KUDO[a.id] = !KUDO[a.id]; kb.classList.toggle('on', KUDO[a.id]); $('.kc', card).textContent = a.k + (KUDO[a.id] ? 1 : 0);
      if (KUDO[a.id]) { SFX.chime(); buzz(15); const h = $('.mk', kb); h.classList.remove('hop'); void h.offsetWidth; h.classList.add('hop'); floatUp(pg, relLocal(kb, pg).x - 40, relLocal(kb, pg).y - 6, '💗', 4); }
      return;
    }
    if (e.target.closest('.fp-c')) return openSheet(`<h4>ความคิดเห็น</h4>${['p1', 'p3', 'p4'].slice(0, Math.max(1, Math.min(3, a.c))).map((p, i) => `<div class="nt"><img class="av" src="${A(p)}" alt=""><span><b>${PEOPLE[p][0]}</b> ${['สุดยอดไปเลย! 🔥', 'เพซดีมากครับ', 'พรุ่งนี้วิ่งด้วยกันนะ!'][i]}</span></div>`).join('')}<div style="height:14px"></div><button class="btn btn-d press" data-close>ปิด</button>`);
    if (e.target.closest('.fp-s')) return go('share', { act: a, back: 'feed' });
    if (e.target.closest('.fp-more')) return openSheet(`<h4>${a.t}</h4><button class="opt" data-close>ดูรายละเอียด</button><button class="opt" data-close>บันทึกเส้นทางนี้</button><button class="opt" data-close>ซ่อนจากฟีด</button>`);
    curAct = a; go('activity', { act: a });
  });
  $('#fbSearch', pg).onclick = () => go('maps');
  $('#fbBell', pg).onclick = () => { $('.fb-dot', pg)?.remove(); openSheet(`<h4>การแจ้งเตือน</h4>
    ${[['p2', 'ให้กำลังใจ <b>วิ่งยามเย็นสบายๆ</b> ของคุณ', '2 นาที'], ['p3', 'เริ่มติดตามคุณ', '1 ชม.'], ['p1', 'ส่งพลังใจ 💖 ให้คุณใน Hero Hall', '3 ชม.'], ['me', '🏅 คุณได้เหรียญ <b>5 วันติด</b>', 'เมื่อวาน']].map(([p, t, w]) => `<div class="nt"><img class="av" src="${A(PEOPLE[p][1])}" alt=""><span><b>${PEOPLE[p][0]}</b> ${t}</span><small>${w}</small></div>`).join('')}`); };
};
