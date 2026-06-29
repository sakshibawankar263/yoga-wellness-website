function triggerEnding() {
  const overlay = $('#transition-overlay');
  const text    = $('#transition-text');
  text.textContent = '';
  overlay.classList.add('active');

  // Glitch effect
  let glitchCount = 0;
  const glitchInterval = setInterval(() => {
    overlay.style.background = glitchCount % 2 === 0
      ? 'linear-gradient(0deg, #000 0%, #060810 40%, rgba(0,184,255,0.3) 50%, #000 60%)'
      : '#000';
    glitchCount++;
    if (glitchCount > 10) {
      clearInterval(glitchInterval);
      overlay.style.background = '#000';
      loadEndingSection();
    }
  }, 80);
}

function loadEndingSection() {
  $$('.section').forEach(s => {
    s.classList.remove('section--active');
    s.style.pointerEvents = 'none';
  });

  const ending = $('#s-ending');
  ending.classList.add('section--active');
  ending.style.pointerEvents = 'all';
  STATE.currentSection = 's-ending';
  updateNavDots('s-ending');

  $('#transition-overlay').classList.remove('active');

  // Init ending particles
  initEndingParticles();

  // Animate ending content
  const content = $('#ending-content');
  const line1   = $('#ending-line-1');
  const line2   = $('#ending-line-2');
  const line3   = $('#ending-line-3');
  const msg     = $('#ending-msg-p');
  const sig     = $('#ending-sig');

  setTimeout(() => {
    content.classList.add('visible');
    typeWrite(line1, 'CLASSIFIED DIRECTIVE — UNLOCKED', 50, () => {
      setTimeout(() => {
        typeWrite(line2, 'HAPPY BIRTHDAY', 90, () => {
          setTimeout(() => {
            typeWrite(line3, '[ AGENT NAME ] // AGE: 21 // MISSION: CELEBRATE', 40, () => {
              setTimeout(() => {
                msg.style.opacity = '0';
                msg.style.transition = 'opacity 0.8s';
                setTimeout(() => {
                  msg.style.opacity = '1';
                  sig.style.opacity = '1';
                  sig.style.transition = 'opacity 0.8s';
                  sig.style.opacity = '0';
                  setTimeout(() => { sig.style.opacity = '1'; }, 400);
                  document.getElementById('btn-restart').classList.add('visible');
                }, 300);
              }, 500);
            });
          }, 400);
        });
      }, 300);
    });
  }, 500);
}

function typeWrite(el, text, speed, callback) {
  let i = 0;
  el.textContent = '';
  const iv = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) {
      clearInterval(iv);
      if (callback) callback();
    }
  }, speed);
}

// Ending particles (celebration)
function initEndingParticles() {
  const canvas = document.getElementById('ending-particles-canvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const colors = ['#00b8ff','#9b5cf6','#00e5a0','#f59e0b','#ffffff'];
  const particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    r: Math.random() * 2 + 1,
    color: colors[Math.floor(Math.random() * colors.length)],
    pulse: Math.random() * Math.PI * 2
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.pulse += 0.03;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.8 + 0.2 * Math.sin(p.pulse)), 0, Math.PI * 2);
      ctx.fillStyle = p.color + Math.round((0.4 + 0.4 * Math.sin(p.pulse)) * 255).toString(16).padStart(2,'0');
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Restart
$('#btn-restart')?.addEventListener('click', () => {
  location.reload();
});
