(() => {
  const c = window.LOVE_CONFIG || {};
  const byId = id => document.getElementById(id);
  const setText = (id, value) => { const el = byId(id); if (el && value !== undefined) el.textContent = value; };
  const setMultiline = (id, value) => { const el = byId(id); if (el && value !== undefined) el.innerHTML = String(value).split(/\n\s*\n/).map(p => `<p>${p.split('\n').map(escapeHTML).join('<br>')}</p>`).join(''); };
  const escapeHTML = s => String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  ['coverOverline','coverTitle','anniversaryDate','eyebrow','mainTitle','coverCaption','introText','postcardText','postcardSign','letterHeading','letterSign','heartSmallNote','heartClosing','amorTopline','amorSideNote','archiveKicker','archiveSubtitle','finalMessage'].forEach(k => setText(k, c[k]));
  setText('coverNames', `${c.personOne || 'Your Name'}  ♥  ${c.personTwo || 'Their Name'}`);
  setText('letterText',''); setMultiline('letterText', c.letterText || ''); setText('letterGreeting', c.letterGreeting || 'To my favourite human,');
  if (c.postcardTitle) { const el = byId('postcardTitle'); if (el) el.innerHTML = escapeHTML(c.postcardTitle).replace(/\n/g, '<br>').replace(/my heart/i, '<em>my heart</em>'); }
  (c.photoCaptions || []).forEach((caption, i) => setText(`caption${i+1}`, caption));
  document.querySelectorAll('[data-photo]').forEach(img => {
    const key = img.dataset.photo;
    const showPlaceholder = () => {
      if (!img.isConnected) return;
      const box = document.createElement('div'); box.className = 'photo-placeholder';
      box.textContent = `ADD PHOTO: ${key}`; box.setAttribute('aria-label', `Add photo for ${key}`);
      img.replaceWith(box);
    };
    img.addEventListener('error', showPlaceholder, { once: true });
    if (c.photos && c.photos[key]) img.src = c.photos[key];
    if (img.complete && img.naturalWidth === 0) showPlaceholder();
  });

  const cover = byId('bookCover'), main = byId('storyPages'), nav = document.querySelector('.page-nav');
  const pages = [...document.querySelectorAll('#storyPages .page')];
  const titles = ['Our Story','My Whole Heart','Amor de mi Vida','Postcards','Words From Me','Our Love Archive'];
  const dots = byId('pageDots'), counter = byId('pageCounter'), prev = byId('prevPage'), next = byId('nextPage');
  let current = 0, busy = false, opened = false;
  pages.forEach((page, i) => {
    page.hidden = true;
    page.setAttribute('aria-label', `${i+1} of ${pages.length}: ${titles[i]}`);
    const dot = document.createElement('button'); dot.className = 'page-dot'; dot.type = 'button';
    dot.setAttribute('aria-label', `Go to page ${i+1}: ${titles[i]}`);
    dot.addEventListener('click', () => { if (opened) goTo(i, i >= current ? 'next' : 'prev'); }); dots.appendChild(dot);
  });
  const updateNav = () => {
    [...dots.children].forEach((dot,i) => { dot.classList.toggle('selected', i === current); dot.setAttribute('aria-current', i === current ? 'step' : 'false'); });
    counter.textContent = `${String(current+1).padStart(2,'0')} / ${String(pages.length).padStart(2,'0')}`;
    prev.disabled = !opened || current === 0 || busy;
    next.disabled = !opened || busy;
    next.textContent = current === pages.length - 1 ? 'Close the story ↺' : 'Turn page →';
    next.setAttribute('aria-label', current === pages.length - 1 ? 'Close the story' : 'Turn to next page');
  };
  function goTo(index, direction='next') {
    if (!opened || busy) return;
    if (index < 0) return;
    if (index >= pages.length) { closeBook(); return; }
    if (index === current) return;
    busy = true;
    const oldPage = pages[current], newPage = pages[index];
    const nextForward = direction === 'next';
    newPage.hidden = false;
    newPage.classList.remove('active','flip-out-next','flip-out-prev','flip-in-next','flip-in-prev');
    oldPage.classList.remove('active','flip-out-next','flip-out-prev','flip-in-next','flip-in-prev');
    newPage.classList.add(nextForward ? 'flip-in-next' : 'flip-in-prev');
    oldPage.classList.add(nextForward ? 'flip-out-next' : 'flip-out-prev');
    oldPage.style.zIndex = '2'; newPage.style.zIndex = '1';
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      oldPage.removeEventListener('animationend', finish);
      oldPage.hidden = true; oldPage.classList.remove('flip-out-next','flip-out-prev'); oldPage.style.zIndex = '';
      newPage.classList.remove('flip-in-next','flip-in-prev'); newPage.classList.add('active'); newPage.style.zIndex = '';
      current = index; busy = false; updateNav();
      document.title = `${titles[current]} — OpenWithLove`;
    };
    oldPage.addEventListener('animationend', finish, { once: true });
    window.setTimeout(finish, 950);
  }
  function openBook() {
    if (opened) return; opened = true;
    cover.classList.add('cover-opening');
    window.setTimeout(() => {
      cover.hidden = true; main.hidden = false; nav.classList.add('visible');
      pages.forEach((p,i) => { p.hidden = i !== 0; p.classList.remove('active'); });
      pages[0].classList.add('active'); current = 0; updateNav();
    }, 720);
  }
  function closeBook() {
    if (busy) return; opened = false;
    main.hidden = true; nav.classList.remove('visible'); cover.hidden = false;
    cover.classList.remove('cover-opening'); cover.classList.add('cover-return');
    window.setTimeout(() => cover.classList.remove('cover-return'), 550);
    pages.forEach(p => { p.hidden = true; p.classList.remove('active','flip-out-next','flip-out-prev','flip-in-next','flip-in-prev'); });
    current = 0; updateNav(); document.title = 'Our Little Love Story — OpenWithLove';
  }
  byId('openBook').addEventListener('click', openBook);
  prev.addEventListener('click', () => goTo(current-1,'prev'));
  next.addEventListener('click', () => { if (current === pages.length-1) closeBook(); else goTo(current+1,'next'); });
  document.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || ['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) return;
    if (!opened && (e.key === 'Enter' || e.key === ' ')) { if (document.activeElement === byId('openBook')) return; }
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { if(opened){e.preventDefault();goTo(current+1,'next');} }
    if (e.key === 'ArrowLeft' || e.key === 'PageUp') { if(opened){e.preventDefault();goTo(current-1,'prev');} }
    if (e.key === 'Escape' && opened) closeBook();
  });
  let touchX = null;
  main.addEventListener('touchstart', e => { touchX = e.changedTouches[0].clientX; }, {passive:true});
  main.addEventListener('touchend', e => { if(touchX===null)return; const dx=e.changedTouches[0].clientX-touchX; touchX=null; if(Math.abs(dx)>60) { if(dx<0)goTo(current+1,'next'); else goTo(current-1,'prev'); } }, {passive:true});
  updateNav();

  // Persistent music controller. The file path is set in config.js; no upload control is shown.
  const audio = byId('bgMusic'), btn = byId('musicToggle'), label = byId('musicLabel'), icon = byId('musicIcon');
  audio.src = c.musicPath || 'assets/music/our-song.mp3';
  let musicUnavailable = false;
  const updateMusic = () => {
    const playing = !audio.paused;
    btn.classList.toggle('playing',playing);
    btn.setAttribute('aria-label',musicUnavailable?'Music unavailable; check config.js':playing?'Pause music':'Play music');
    label.textContent = musicUnavailable?'Add song in config.js':playing?'Pause music':'Play music';
    icon.textContent = playing?'Ⅱ':'♫';
  };
  btn.addEventListener('click', async () => {
    if(audio.paused){
      musicUnavailable = false;
      try { await audio.play(); }
      catch(error) {
        musicUnavailable = true;
        console.error('Unable to play the configured background music.', error);
      }
    } else audio.pause();
    updateMusic();
  });
  audio.addEventListener('play',() => { musicUnavailable = false; updateMusic(); });
  audio.addEventListener('error',() => { musicUnavailable = true; updateMusic(); });
  audio.addEventListener('pause',updateMusic); audio.addEventListener('ended',updateMusic); updateMusic();
})();
