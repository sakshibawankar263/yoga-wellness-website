function enterReport() {
  if (STATE.reportAnimated) {
    showBtn('btn-report-next');
    return;
  }
  STATE.reportAnimated = true;

  const fields = $$('[data-reveal]');
  fields.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
      if (i === fields.length - 1) {
        setTimeout(() => showBtn('btn-report-next'), 600);
      }
    }, i * 300 + 400);
  });
}

$('#btn-report-next')?.addEventListener('click', () => {
  showSection('s-button', 'FINAL DIRECTIVE LOADING...');
});