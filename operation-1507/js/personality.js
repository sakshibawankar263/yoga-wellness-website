function enterPersonality() {
  if (STATE.personalityAnimated) {
    showBtn('btn-personality-next');
    return;
  }
  STATE.personalityAnimated = true;

  const cards = $$('.stat-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('visible');
      const val = parseInt(card.dataset.value);
      setTimeout(() => {
        const bar = card.querySelector('.stat-card__bar-fill');
        bar.style.width = val + '%';
        // Animate value counter
        const valEl = card.querySelector('.stat-card__value');
        let v = 0;
        const inc = setInterval(() => {
          v = Math.min(v + 3, val);
          valEl.textContent = v;
          if (v >= val) clearInterval(inc);
        }, 20);
      }, 200);

      if (i === cards.length - 1) {
        setTimeout(() => showBtn('btn-personality-next'), 800);
      }
    }, i * 180);
  });
}

$('#btn-personality-next')?.addEventListener('click', () => {
  showSection('s-evidence', 'ACCESSING EVIDENCE ROOM...');
});
