const CODE_SAMPLE = [
  { tokens: [{ t:'cm', v:'# What does this program output?' }] },
  { tokens: [] },
  { tokens: [{ t:'kw', v:'def' }, { t:'fn', v:' compute' }, { t:'op', v:'(' }, { t:'var', v:'x' }, { t:'op', v:',' }, { t:'var', v:'y' }, { t:'op', v:'):' }] },
  { tokens: [{ t:'', v:'    ' }, { t:'var', v:'result' }, { t:'op', v:' = ' }, { t:'op', v:'[' }, { t:'var', v:'i' }, { t:'op', v:' * ' }, { t:'var', v:'y' }, { t:'op', v:' for ' }, { t:'var', v:'i' }, { t:'op', v:' in ' }, { t:'kw', v:'range' }, { t:'op', v:'(' }, { t:'var', v:'x' }, { t:'op', v:')]' }] },
  { tokens: [{ t:'', v:'    ' }, { t:'kw', v:'return' }, { t:'', v:' ' }, { t:'fn', v:'sum' }, { t:'op', v:'(' }, { t:'var', v:'result' }, { t:'op', v:')' }] },
  { tokens: [] },
  { tokens: [{ t:'var', v:'a' }, { t:'op', v:' = ' }, { t:'num', v:'5' }] },
  { tokens: [{ t:'var', v:'b' }, { t:'op', v:' = ' }, { t:'num', v:'4' }] },
  { tokens: [{ t:'fn', v:'print' }, { t:'op', v:'(' }, { t:'fn', v:'compute' }, { t:'op', v:'(' }, { t:'var', v:'a' }, { t:'op', v:',' }, { t:'var', v:'b' }, { t:'op', v:'))' }] },
];

const CORRECT_ANSWER = 'C'; // 0+4+8+12+16 = 40

function enterCode() {
  // Build code display
  const lines  = $('#code-lines');
  const content = $('#code-content');
  if (lines && content && !lines.children.length) {
    CODE_SAMPLE.forEach((line, i) => {
      const ln = document.createElement('div');
      ln.textContent = i + 1;
      lines.appendChild(ln);

      const row = document.createElement('div');
      line.tokens.forEach(tok => {
        if (!tok.v) return;
        const span = document.createElement('span');
        span.className = tok.t || '';
        span.textContent = tok.v;
        row.appendChild(span);
      });
      content.appendChild(row);
    });
  }

  const compileBtn  = $('#compile-btn');
  const answerCards = $$('.answer-card');
  const resultIcon  = $('#result-icon');
  const resultText  = $('#result-text');
  const nextBtn     = $('#btn-code-next');

  compileBtn?.addEventListener('click', () => {
    if (STATE.codeCompiled) return;
    // Compile animation
    compileBtn.classList.add('compiling');
    const ring = compileBtn.querySelector('.compile-btn__ring');
    ring.style.animation = 'compile-ring-pulse 0.3s ease-in-out infinite';

    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        const p = document.createElement('div');
        const angle = (i / 12) * Math.PI * 2;
        const tx = Math.cos(angle) * 60;
        const ty = Math.sin(angle) * 60;
        p.style.cssText = `position:absolute;left:50%;top:50%;width:4px;height:4px;background:#f59e0b;border-radius:50%;transform:translate(-50%,-50%);animation:card-particle 0.6s ease-out forwards;--tx:${tx}px;--ty:${ty}px`;
        $('#compile-particles').appendChild(p);
        setTimeout(() => p.remove(), 600);
      }, i * 40);
    }

    setTimeout(() => {
      ring.style.animation = '';
      STATE.codeCompiled = true;
      // Enable answer selection
      answerCards.forEach(card => {
        card.addEventListener('click', () => {
          const ans = card.dataset.answer;
          answerCards.forEach(c => c.classList.remove('correct', 'wrong'));
          if (ans === CORRECT_ANSWER) {
            card.classList.add('correct');
            resultIcon.textContent = '✓';
            resultIcon.style.color = '#00e5a0';
            resultText.textContent = 'CORRECT OUTPUT IDENTIFIED';
            resultText.style.color = '#00e5a0';
            setTimeout(() => showBtn('btn-code-next'), 800);
          } else {
            card.classList.add('wrong');
            resultIcon.textContent = '✗';
            resultIcon.style.color = '#ff4444';
            resultText.textContent = 'INCORRECT — TRY AGAIN';
            resultText.style.color = '#ff4444';
          }
        });
      });
    }, 1200);
  });

  showBtn('btn-code-next');
}

$('#btn-code-next')?.addEventListener('click', () => {
  showSection('s-terminal', 'CONNECTING TO GHOST TERMINAL...');
});
