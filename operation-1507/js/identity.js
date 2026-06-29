function enterIdentity() {
  if (STATE.identityRevealed) {
    // Already revealed, just show CTA
    showBtn('btn-identity-next');
    return;
  }

  const cardWrapper = $('#card-wrapper');
  const cardParticles = $('#card-particles');
  const identityData  = $('#identity-data');
  const idFields = $$('.id-field');
  const idQuote  = $('#id-quote');
  const cardBtn  = $('#btn-identity-next');

  // Start scanning then flip card
  setTimeout(() => {
    // Particle burst around card
    for (let i = 0; i < 20; i++) spawnCardParticle(cardParticles);

    setTimeout(() => {
      cardWrapper.classList.add('flipped');

      setTimeout(() => {
        // Reveal data fields one by one
        idFields.forEach((f, i) => {
          setTimeout(() => {
            f.classList.add('visible');
            if (i === idFields.length - 1) {
              setTimeout(() => {
                idQuote.classList.add('visible');
                setTimeout(() => showBtn('btn-identity-next'), 600);
              }, 400);
            }
          }, i * 450);
        });
        STATE.identityRevealed = true;
      }, 500);

    }, 1200);
  }, 400);
}

function spawnCardParticle(container) {
  const p = document.createElement('div');
  const angle = Math.random() * Math.PI * 2;
  const radius = 80 + Math.random() * 60;
  const tx = Math.cos(angle) * radius;
  const ty = Math.sin(angle) * radius;
  p.style.cssText = `
    position:absolute;left:50%;top:50%;
    width:${2 + Math.random() * 3}px;height:${2 + Math.random() * 3}px;
    background:#00b8ff;border-radius:50%;
    transform:translate(-50%,-50%);
    animation:card-particle 0.8s ease-out forwards;
    --tx:${tx}px;--ty:${ty}px
  `;
  container.appendChild(p);
  if (!document.getElementById('card-particle-style')) {
    const s = document.createElement('style');
    s.id = 'card-particle-style';
    s.textContent = '@keyframes card-particle{0%{transform:translate(-50%,-50%) scale(1);opacity:1}100%{transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(0);opacity:0}}';
    document.head.appendChild(s);
  }
  setTimeout(() => p.remove(), 800);
}

// 3D card hover effect
const cardScene = $('#card-scene');
if (cardScene) {
  cardScene.addEventListener('mousemove', (e) => {
    const rect = cardScene.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const rx   = ((e.clientY - cy) / (rect.height / 2)) * 12;
    const ry   = -((e.clientX - cx) / (rect.width  / 2)) * 12;
    const wrapper = $('#card-wrapper');
    if (!wrapper.classList.contains('flipped')) {
      wrapper.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  });
  cardScene.addEventListener('mouseleave', () => {
    const wrapper = $('#card-wrapper');
    if (!wrapper.classList.contains('flipped')) {
      wrapper.style.transform = '';
    }
  });
}

$('#btn-identity-next')?.addEventListener('click', () => {
  showSection('s-personality', 'LOADING BEHAVIORAL DATA...');
});