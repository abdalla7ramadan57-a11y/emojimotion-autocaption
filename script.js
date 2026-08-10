(() => {
  // Preview videos: play only while visible to reduce bandwidth/CPU.
  const videos = [...document.querySelectorAll('video[data-autoplay]')];
  videos.forEach(v => {
    v.controls = false;
    v.disablePictureInPicture = true;
    v.setAttribute('controlsList', 'nodownload noplaybackrate noremoteplayback');
    v.addEventListener('contextmenu', e => e.preventDefault());
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting && entry.intersectionRatio > .18) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: [0, .18, .6] });
    videos.forEach(v => observer.observe(v));
  } else {
    videos.forEach(v => v.play().catch(() => {}));
  }

  document.querySelectorAll('.noto-preview img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
  });

  // Color controls. Changing a color does not reset animations.
  document.querySelectorAll('.color-switcher').forEach(switcher => {
    const target = document.getElementById(switcher.dataset.target);
    switcher.querySelectorAll('.color-dot').forEach(button => {
      button.addEventListener('click', () => {
        switcher.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
        button.classList.add('active');
        target.style.setProperty('--accent', button.dataset.color);
      });
    });
  });

  // Responsive shape layer demo.
  const input = document.getElementById('shapeInput');
  const shapeText = document.getElementById('shapeText');
  const shapeCaption = document.getElementById('shapeCaption');
  const phrases = ['Create faster', 'Caption your story', 'Make every word move', 'Edit less. Publish more.'];
  let phraseIndex = 0;
  let charIndex = phrases[0].length;
  let deleting = true;
  let manualUntil = 0;

  const resizeShape = () => {
    requestAnimationFrame(() => {
      const width = Math.max(180, Math.min(520, shapeText.scrollWidth + 68));
      shapeCaption.style.width = `${width}px`;
    });
  };

  input.addEventListener('input', () => {
    manualUntil = Date.now() + 5000;
    shapeText.textContent = input.value || 'Type something';
    resizeShape();
  });

  setInterval(() => {
    if (Date.now() < manualUntil) return;
    const phrase = phrases[phraseIndex];
    if (deleting) {
      charIndex = Math.max(0, charIndex - 1);
      if (charIndex === 0) deleting = false;
    } else {
      charIndex = Math.min(phrase.length, charIndex + 1);
      if (charIndex === phrase.length) {
        setTimeout(() => { deleting = true; phraseIndex = (phraseIndex + 1) % phrases.length; }, 650);
      }
    }
    const value = phrase.slice(0, charIndex) || ' ';
    shapeText.textContent = value;
    input.value = value.trim();
    resizeShape();
  }, 90);
  resizeShape();

  // Word-by-word highlight demo.
  const words = [...document.querySelectorAll('#highlightLine span')];
  let activeWord = 0;
  if (words.length) words[0].classList.add('active');
  setInterval(() => {
    words.forEach(w => w.classList.remove('active'));
    activeWord = (activeWord + 1) % words.length;
    words[activeWord].classList.add('active');
  }, 620);
})();
