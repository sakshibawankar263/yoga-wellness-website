const BOOT_LINES = [
   { text: 'Finding Suyash', status: 'OK' },
{ text: 'Verifying Identity', status: 'OK' },
{ text: 'Checking Friendship', status: 'OK' },
{ text: 'Loading Memories', status: 'OK' },
{ text: 'Preparing Surprise', status: 'WARN', warn: true },
{ text: 'Birthday Protocol', status: 'OK' },
{ text: 'Access Granted', status: 'ACTIVE' },
];

const LOGO_TEXT = 'CLASSIFIED';

(function initLoading() {
  const logoType = $('#logo-type');
  let i = 0;
  const type = setInterval(() => {
    if (i <= LOGO_TEXT.length) {
      logoType.textContent = LOGO_TEXT.slice(0, i++);
    } else {
      clearInterval(type);
      startBootSequence();
    }
  }, 80);
})();

function startBootSequence() {
  const list  = $('#boot-list');
  const bar   = $('#load-bar');
  const pct   = $('#load-pct');
  let idx     = 0;
  let progress = 0;

  const stepDuration = 350;

  const nextLine = () => {
    if (idx >= BOOT_LINES.length) {
      // Complete
      animateBar(100, () => {
        setTimeout(() => {
          // Fade out loading, show identity
          const loadSec = $('#s-loading');
          loadSec.style.transition = 'opacity 0.8s ease';
          loadSec.style.opacity = '0';
          setTimeout(() => {
            loadSec.classList.remove('section--active');
            showSection('s-identity', 'IDENTITY FILE LOADING...');
          }, 800);
        }, 600);
      });
      return;
    }

    const line = BOOT_LINES[idx++];
    const div  = document.createElement('div');
    div.className = 'boot-line';

    const statusClass = line.status === 'OK' ? 'boot-line__status--ok'
                      : line.status === 'WARN' ? 'boot-line__status--warn'
                      : 'boot-line__status--active';

    div.innerHTML = `
      <span class="boot-line__icon">▶</span>
      <span>${line.text}</span>
      <span class="boot-line__status ${statusClass}">${line.status}</span>
    `;
    list.appendChild(div);
    requestAnimationFrame(() => div.classList.add('visible'));

    const target = Math.round((idx / BOOT_LINES.length) * 100);
    animateBar(target);

    setTimeout(nextLine, stepDuration + (line.warn ? 300 : 0));
  };

  function animateBar(target, cb) {
    const step = () => {
      if (progress < target) {
        progress = Math.min(progress + 2, target);
        bar.style.width = progress + '%';
        pct.textContent = progress + '%';
        requestAnimationFrame(step);
      } else if (cb) cb();
    };
    requestAnimationFrame(step);
  }

  setTimeout(nextLine, 500);
}