const TERM_BOOT = [
  { type: 'sys', text: 'GHOST_SHELL v4.7.2 initialized' },
  { type: 'sys', text: 'Establishing encrypted connection...' },
  { type: 'out', text: 'Connection established — node: CLASSIFIED' },
  { type: 'sys', text: 'Loading mission context...' },
  { type: 'out', text: 'Type "help" for available commands.' },
];

const TERM_RESPONSES = {
  help:    { text: 'Available commands: scan, decrypt, whoami, status, unlock, clear', color: '#00e5a0' },
  scan:    { text: 'Scanning environment... 127 entities detected. 1 target identified.', color: '#00b8ff' },
  decrypt: { text: 'Decrypting file... [████████░░] 82% — Key mismatch. Partial decrypt only.', color: '#f59e0b' },
  whoami:  { text: 'You are: AUTHORIZED AGENT — Level 21 clearance active.', color: '#9b5cf6' },
  status:  { text: 'Operation status: ACTIVE | Phase 6/9 | All systems nominal.', color: '#00e5a0' },
  unlock:  { text: 'ERROR: Insufficient clearance for sector OMEGA. Request denied.', color: '#ff4444' },
  clear:   { text: '__CLEAR__', color: '' },
};

let termHistory = [];

function enterTerminal() {
  const body    = $('#term-body');
  const input   = $('#term-input');
  const nextBtn = $('#btn-terminal-next');

  if (body && !body.children.length) {
    // Boot messages
    TERM_BOOT.forEach((line, i) => {
      setTimeout(() => addTermLine(body, line.type, line.text), i * 400);
    });
  }

  // Suggestion clicks
  $$('.term-sugg').forEach(sugg => {
    sugg.addEventListener('click', () => {
      if (input) { input.value = sugg.dataset.cmd; input.focus(); }
    });
  });

  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        if (!cmd) return;
        termHistory.push(cmd);

        // Echo input
        addTermLine(body, 'prompt', cmd);
        input.value = '';

        // Response
        const res = TERM_RESPONSES[cmd];
        if (res) {
          if (res.text === '__CLEAR__') {
            setTimeout(() => { body.innerHTML = ''; }, 200);
          } else {
            setTimeout(() => addTermLine(body, 'out', res.text, res.color), 250);
          }
        } else {
          setTimeout(() => addTermLine(body, 'err', `Command not found: ${cmd}`), 250);
        }

        body.scrollTop = body.scrollHeight;
      }
    });
  }

  setTimeout(() => showBtn('btn-terminal-next'), 2500);
}

function addTermLine(body, type, text, color) {
  const row = document.createElement('div');
  row.className = 'term-line';
  if (type === 'prompt') {
    row.innerHTML = `<span class="term-line__prompt">root@classified:~$</span><span class="term-line__out" style="${color ? 'color:'+color : ''}">${text}</span>`;
  } else if (type === 'out') {
    row.innerHTML = `<span class="term-line__out" style="${color ? 'color:'+color : ''}">${text}</span>`;
  } else if (type === 'sys') {
    row.innerHTML = `<span class="term-line__sys">${text}</span>`;
  } else if (type === 'err') {
    row.innerHTML = `<span class="term-line__err">${text}</span>`;
  }
  body.appendChild(row);
  body.scrollTop = body.scrollHeight;
}

$('#btn-terminal-next')?.addEventListener('click', () => {
  showSection('s-report', 'COMPILING MISSION REPORT...');
});
