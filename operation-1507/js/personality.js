function enterPersonality() {

  if (STATE.personalityAnimated) {
    showBtn('btn-personality-next');
    return;
  }

  STATE.personalityAnimated = true;

  const cards = $$('.stat-card');
  cards.forEach(card=>{

card.addEventListener("mousemove",(e)=>{

const rect=card.getBoundingClientRect();

const x=e.clientX-rect.left;
const y=e.clientY-rect.top;

const rx=((y-rect.height/2)/18);

const ry=((rect.width/2-x)/18);

card.style.transform=
`perspective(900px)
rotateX(${rx}deg)
rotateY(${ry}deg)
translateY(-8px)
scale(1.02)`;

});

card.addEventListener("mouseleave",()=>{

card.style.transform="";

});

});

  cards.forEach((card, index) => {

    setTimeout(() => {

      card.classList.add('visible');

      const value = parseInt(card.dataset.value);

      const bar = card.querySelector('.stat-card__bar-fill');
      const color = card.dataset.color;

const colors = {
  blue: {
    fill: "linear-gradient(90deg,#00E5FF,#ffffff)",
    glow: "0 0 15px rgba(0,229,255,.5)"
  },
  purple: {
    fill: "linear-gradient(90deg,#8B5CF6,#ffffff)",
    glow: "0 0 15px rgba(139,92,246,.5)"
  },
  green: {
    fill: "linear-gradient(90deg,#00F5A0,#ffffff)",
    glow: "0 0 15px rgba(0,245,160,.5)"
  },
  amber: {
    fill: "linear-gradient(90deg,#FFB800,#ffffff)",
    glow: "0 0 15px rgba(255,184,0,.5)"
  }
};

bar.style.background = colors[color].fill;
bar.style.boxShadow = colors[color].glow;
      const valueEl = card.querySelector('.stat-card__value');

      // reset
      bar.style.width = "0%";
      valueEl.textContent = "0";

      // Small delay before animation starts
      setTimeout(() => {

        // Smooth bar animation
        bar.style.transition = "width 1.2s ease";
        bar.style.width = value + "%";

        // Smooth number animation
        let current = 0;

        const duration = 1200;
        const fps = 60;

        const increment = value / (duration / (1000 / fps));

        const counter = setInterval(() => {

          current += increment;

          if (current >= value) {
            current = value;
            clearInterval(counter);
          }

          valueEl.textContent = Math.round(current);

        }, 1000 / fps);

      }, 200);

      // Last card → Show button
      if (index === cards.length - 1) {

        setTimeout(() => {

          showBtn('btn-personality-next');

        }, 1700);

      }

    }, index * 180);

  });

}

$('#btn-personality-next')?.addEventListener('click', () => {

  showSection(
    's-evidence',
    'ACCESSING EVIDENCE ROOM...'
  );

});