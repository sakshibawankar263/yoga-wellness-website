const HINT_TEXTS = [
  'This button does absolutely nothing. Probably.',
  'Seriously. Don\'t.',
  'We cannot be held responsible.',
  'Last warning.',
  '...Are you sure?',
];
let hintIdx = 0;

function enterButton() {
  const dangerBtn = $('#danger-btn');
  const hintText  = $('#danger-hint-text');
  const ripple    = $('#danger-ripple');

  dangerBtn?.addEventListener('mouseover', () => {
    hintText.textContent = HINT_TEXTS[hintIdx % HINT_TEXTS.length];
    hintIdx++;
    // Add ripple
    const wave = document.createElement('div');
    wave.className = 'ripple-wave';
    ripple.appendChild(wave);
    setTimeout(() => wave.remove(), 800);
  });

  dangerBtn?.addEventListener('click', triggerEnding);
}
