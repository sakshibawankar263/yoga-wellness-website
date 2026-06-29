function enterEvidence() {
  if (STATE.evidenceAnimated) {
    showBtn('btn-evidence-next');
    return;
  }
  STATE.evidenceAnimated = true;

  const cards = $$('.ev-card');
  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('visible');
      if (i === cards.length - 1) {
        setTimeout(() => showBtn('btn-evidence-next'), 600);
      }
    }, i * 200 + 300);
  });
}

$('#btn-evidence-next')?.addEventListener('click', () => {
  showSection('s-code', 'LOADING CODING CHALLENGE...');
});