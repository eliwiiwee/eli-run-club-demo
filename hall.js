/* Hero Hall — chosen design "A · podium" (design/hh2_A.png). Replaces the earlier hall in life.js; ranking/send-love logic unchanged.
   Background + podium come from the mockup itself (hh_clean); icons are cut from the mockup (assets/hk_*.png, mk_*.png). */
LIFE.hall = pg => {
  let mode = 'week';
  const m = LPX.mult(G.streak);
  const mk = (n, c = '') => `<img class="mk ${c}" src="assets/${n}.png" alt="">`;
  pg.innerHTML = `
    <img class="hl-bgc" src="${A('hh_bg')}" alt=""><img class="hl-bg" src="${A('hh_bg')}" alt="">
    <header class="fs-top">
      <button class="gl fs-brand hl-brand rise" data-go="eli">${mk('hk_back', 'hb')}${mk('hk_trophy', 'ht')}<b>Hero Hall</b></button>
      <button class="gl fs-pill press coinchip2 rise" style="--d:.05s" data-go="treasury">${mk('mk_coin')}<b data-coins>${fmt(G.coins)}</b></button>
      <button class="gl fs-pill press rise" style="--d:.1s" id="hlFire">${mk('mk_flame')}<b>${G.streak} วัน ×${m.toFixed(2)}</b></button>
    </header>
    <button class="gl hl-league rise press" style="--d:.12s" id="hlLeague">${mk('hk_league')}<b>ลีกทองคำ</b></button>
    <div class="gl hl-seg rise" style="--d:.14s"><i class="ind"></i><button class="on" data-m="week">สัปดาห์นี้</button><button data-m="all">ตลอดกาล</button></div>
    <div id="hlBody"></div>`;
  bindGo(pg);
  const body = $('#hlBody', pg);
  const draw = () => {
    const rows = hallRows(mode), val = r => mode === 'week' ? r.week : r.total;
    const legends = FRIENDS.filter(f => LPX.level(f.total) >= 30);
    const top = rows.slice(0, 3), rest = rows.slice(3), max = Math.max(...rows.map(val), 1);
    const av = r => A(r.img);
    body.innerHTML = `
      ${legends.length ? `<button class="gl hl-legend pop" style="--d:.16s" id="hlLegend">${mk('hk_pin')}<span><b>${legends[0].n}</b> · Eternal Legend · ปักหมุดถาวร</span>${mk('hk_star', 'tw')}</button>` : ''}
      ${[[1, 'p2'], [0, 'p1'], [2, 'p3']].map(([i, cls], k) => top[i] ? `
        <div class="hl-pod ${cls}" style="--d:${.25 + k * .1}s">
          ${mk('hk_crown' + (i + 1), 'cr')}
          <span class="pav ${top[i].me ? 'me' : ''}"><img src="${av(top[i])}" alt=""></span>
          <div class="plb"><span>${top[i].me ? 'คุณ' : top[i].n}</span><b class="num">${fmt(val(top[i]))} LP</b></div>
        </div>` : '').join('')}
      ${mk('hk_spark1', 'sp s1')}${mk('hk_spark2', 'sp s2')}${mk('hk_spark3', 'sp s3')}
      <section class="gl hl-list rise" style="--d:.3s">
        <div class="hl-lh"><b>อันดับเพื่อน</b>${mode === 'week' ? '<span class="zone-up">▲ โซนเลื่อนชั้น Top 3 → ลีกเพชร</span>' : '<span class="zone-up all">ตลอดกาล · LP สะสม</span>'}</div>
        <div class="hl-rows">${rest.map((r, k) => `
          <div class="hl-row ${r.me ? 'me' : ''} ${r.away ? 'away' : ''}" data-id="${r.id}" style="--d:${.36 + k * .05}s">
            <b class="rk num">${k + 4}</b><span class="lav"><img src="${av(r)}" alt=""></span>
            <div class="ln"><div><b>${r.me ? 'คุณ' : r.n}</b><small>Lv.${LPX.level(r.total)}</small></div><div class="lbar"><i data-w="${val(r) / max * 100}"></i></div></div>
            <b class="lv num">${fmt(val(r))} LP</b>
            ${r.me ? `<button class="send2 self" aria-label="ตัวคุณเอง">${mk('hk_heart')}</button>` : `<button class="send2 ${G.today.sentTo[r.id] ? 'on' : ''}" aria-label="ส่งพลังใจ">${mk('hk_heart')}</button>`}
          </div>`).join('')}
          <button class="hl-invite press" id="hlInvite">＋ ชวนเพื่อนมาแข่งใน Hero Hall</button>
          <p class="hl-note">💡 คะแนนสัปดาห์ = Life Power ที่ได้ในสัปดาห์นี้ · คนที่หายไปได้ 0 และ LP สะสมจะสลาย ทำให้คนใหม่ที่สม่ำเสมอแซงได้</p>
        </div>
      </section>`;
    setTimeout(() => $$('.lbar i', body).forEach(i => i.style.width = i.dataset.w + '%'), 120);
    // podium avatars can receive love too (send button appears on tap)
    $$('.send2', body).forEach(b => b.onclick = () => b.classList.contains('self') ? toast('ส่งพลังใจให้ตัวเองไม่ได้นะ 😆 ลองส่งให้เพื่อนสิ') : sendLove(b, b.closest('.hl-row')));
    $('#hlInvite', body).onclick = () => { navigator.clipboard?.writeText('ELI-HERO-3331').catch(() => {}); toast('คัดลอกโค้ดชวนเพื่อน ELI-HERO-3331 แล้ว ✓'); };
    $$('.hl-pod .pav', body).forEach((p, k) => p.onclick = () => { p.classList.remove('hop'); void p.offsetWidth; p.classList.add('hop'); burst(pg, relLocal(p, pg).x, relLocal(p, pg).y - 30, { n: 12, dist: 50, size: 7, colors: ['#FFD54F', '#fff', '#1F5BFF'], shape: 'star' }); });
    const lg = $('#hlLegend', body); if (lg) lg.onclick = () => toast('🌟 ตำนานถาวร: Lv.30+ (84,100 LP) ปักหมุดใน Hero Hall ตลอดไป');
  };
  const sendLove = (b, row) => {
    const id = row.dataset.id, f = FRIENDS.find(x => x.id === id);
    if (G.today.sentTo[id]) return toast(`ส่งพลังใจให้${f.n}แล้ววันนี้ 💗`);
    G.today.sentTo[id] = true; b.classList.add('on'); SFX.chime(); buzz(25);
    const first = !G.today.sent; G.today.sent = true; saveG();
    const avEl = $('.lav', row);
    flyTo(b, avEl, '💖', 6, () => { avEl.classList.remove('hop'); void avEl.offsetWidth; avEl.classList.add('hop'); floatUp(pg, relLocal(avEl, pg).x, relLocal(avEl, pg).y, '💗', 4); });
    if (first) setTimeout(() => { SFX.coin(); popNum(pg, relLocal(b, pg).x, relLocal(b, pg).y - 12, '⚡ +10 LP', 'gold'); toast(`ส่งพลังใจให้${f.n} · ได้ +10 Life Power (ผูกพัน)`); }, 700);
    else toast(`ส่งพลังใจให้${f.n}แล้ว 💖`);
  };
  const seg = $('.hl-seg', pg), ind = $('.ind', seg);
  const setSeg = b => { ind.style.width = b.offsetWidth + 'px'; ind.style.transform = `translateX(${b.offsetLeft - 4}px)`; };
  requestAnimationFrame(() => setSeg($('button.on', seg)));
  $$('button', seg).forEach(b => b.onclick = () => { if (mode === b.dataset.m) return; $$('button', seg).forEach(x => x.classList.toggle('on', x === b)); setSeg(b); mode = b.dataset.m; draw(); SFX.pop(); });
  $('#hlFire', pg).onclick = () => go('eli');
  $('#hlLeague', pg).onclick = () => openSheet(`<h4>${mk('hk_league', 'sh-ic')} ลีกทองคำ</h4><p style="font-size:14px;color:var(--ink2);line-height:1.6">จบสัปดาห์ Top 3 เลื่อนขึ้น <b>ลีกเพชร 💎</b> · 2 อันดับสุดท้ายตกไป <b>ลีกเงิน</b><br>คะแนนคิดจาก Life Power ที่ได้ในสัปดาห์นี้</p>
    <div class="fire-row">${['บรอนซ์', 'เงิน', 'ทองคำ', 'เพชร'].map((l, k) => `<div class="${k === 2 ? 'on' : ''}"><b>${['🥉', '🥈', '🥇', '💎'][k]}</b><span>${l}</span></div>`).join('')}</div>
    <div style="height:14px"></div><button class="btn btn-d press" data-close>เข้าใจแล้ว</button>`);
  draw();
};
