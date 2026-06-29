function enterIdentity() {

  if (STATE.identityRevealed) {
    showBtn('btn-identity-next');
    return;
  }

  const boot = $('#identity-boot');
  const layout = $('#identity-layout');

  const fill = $('#boot-fill');
  const status = $('#boot-status');

  layout.classList.add('hidden');
  boot.classList.remove('hidden');

  const messages = [
    "Connecting to Birthday Database...",
    "Scanning Subject...",
    "Matching Identity...",
    "Decrypting Records...",
    "Identity Confirmed ✔"
  ];

  let progress = 0;

  const loader = setInterval(() => {

    progress += 25;

    fill.style.width = progress + "%";
    status.textContent = messages[Math.min(progress / 25 - 1, 4)];

    if (progress >= 100) {

      clearInterval(loader);

      setTimeout(() => {

        boot.classList.add('hide');
        layout.classList.remove('hidden');

        revealIdentity();

      }, 600);

    }

  }, 700);

}

function revealIdentity() {

  const cardWrapper = $('#card-wrapper');
  const cardParticles = $('#card-particles');
  const idFields = $$('.id-field');
  const idQuote = $('#id-quote');

  for (let i = 0; i < 25; i++) {
    spawnCardParticle(cardParticles);
  }

  setTimeout(() => {

    cardWrapper.classList.add('flipped');

    setTimeout(() => {

      idFields.forEach((field, index) => {

        setTimeout(() => {

          field.classList.add('visible');

        }, index * 350);

      });

      setTimeout(() => {

        idQuote.classList.add('visible');
        showBtn('btn-identity-next');

        STATE.identityRevealed = true;

      }, idFields.length * 350 + 400);

    }, 600);

  }, 900);

}

function spawnCardParticle(container) {

  const p = document.createElement('div');

  const angle = Math.random() * Math.PI * 2;
  const radius = 80 + Math.random() * 60;

  const tx = Math.cos(angle) * radius;
  const ty = Math.sin(angle) * radius;

  p.style.cssText = `
    position:absolute;
    left:50%;
    top:50%;
    width:${2 + Math.random() * 3}px;
    height:${2 + Math.random() * 3}px;
    background:#00b8ff;
    border-radius:50%;
    transform:translate(-50%,-50%);
    animation:card-particle .8s ease-out forwards;
    --tx:${tx}px;
    --ty:${ty}px;
  `;

  container.appendChild(p);

  if (!document.getElementById('card-particle-style')) {

    const s = document.createElement('style');

    s.id = 'card-particle-style';

    s.textContent = `
      @keyframes card-particle{
        0%{
          transform:translate(-50%,-50%) scale(1);
          opacity:1;
        }
        100%{
          transform:translate(calc(-50% + var(--tx)),calc(-50% + var(--ty))) scale(0);
          opacity:0;
        }
      }
    `;

    document.head.appendChild(s);

  }

  setTimeout(() => p.remove(), 800);

}

// ==========================
// 3D CARD HOVER
// ==========================

const cardScene = $('#card-scene');

if (cardScene) {

  cardScene.addEventListener('mousemove', (e) => {

    const rect = cardScene.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const rx = ((e.clientY - cy) / (rect.height / 2)) * 12;
    const ry = -((e.clientX - cx) / (rect.width / 2)) * 12;

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

// ==========================
// NEXT BUTTON
// ==========================

$('#btn-identity-next')?.addEventListener('click', () => {
  showSection('s-personality', 'LOADING BEHAVIORAL DATA...');
});