/*==================================
ENDING SECTION
==================================*/
/*==================================
ENDING AUDIO
==================================*/

const fireworksAudio = new Audio("./assets/sound/fireworks.mp3");

fireworksAudio.volume = 0.7;
fireworksAudio.preload = "auto";
fireworksAudio.loop = true;   // 🔁 Loop the audio

fireworksAudio.addEventListener("canplaythrough", () => {
    console.log("✅ Audio loaded successfully");
});

fireworksAudio.addEventListener("error", () => {
    console.log("❌ Audio failed");
    console.log(fireworksAudio.error);
    console.log(fireworksAudio.currentSrc);
});

console.log(fireworksAudio.src);

function triggerEnding() {

    const overlay = $('#transition-overlay');
    const text = $('#transition-text');

    text.textContent = "";
    overlay.classList.add("active");

    let glitchCount = 0;

    const glitchInterval = setInterval(() => {

        overlay.style.background =
            glitchCount % 2 === 0
                ? "linear-gradient(0deg,#000 0%,#060810 40%,rgba(0,184,255,.3) 50%,#000 60%)"
                : "#000";

        glitchCount++;

        if (glitchCount > 10) {

            clearInterval(glitchInterval);

            overlay.style.background = "#000";

            loadEndingSection();

        }

    }, 80);

}



function loadEndingSection() {

    $$('.section').forEach(section => {

        section.classList.remove('section--active');
        section.style.pointerEvents = "none";

    });

    const ending = $("#s-ending");

    ending.classList.add("section--active");
    ending.style.pointerEvents = "all";

    STATE.currentSection = "s-ending";

    updateNavDots("s-ending");

    $("#transition-overlay").classList.remove("active");

    initEndingParticles();

    const content = $("#ending-content");
    const message = $("#birthday-message");
    const restart = $("#btn-restart");
    const sign = document.querySelector(".birthday-sign");

    const finalMessage = `so...
    You ignored every warning.

Clicked every suspicious button.

Exactly as expected. 😏

Anyway...

I still think
you're annoying sometimes. 🥲

You probably think
you're smarter than me.

(I'll let you keep believing that. 😌)

But...

no matter what,

you're still my friend. 🤍

Happy Birthday, Suyash! 🥳
Have an amazing year ahead. 🎂✨`;

    setTimeout(() => {

        content.classList.add("visible");

        fireworksAudio.currentTime = 0;

fireworksAudio.play().catch(err => console.log(err));

       typeWrite(message, finalMessage, 35, () => {

    if (sign) sign.classList.add("visible");

    restart.classList.add("visible");

    // Wait a second after typing finishes,
    // then smoothly return to the top
    

});

    }, 1000);

}



/*==================================
TYPEWRITER
==================================*/

function typeWrite(el, text, speed, callback){

    let i = 0;

    el.textContent = "";

    const timer = setInterval(() => {

        el.textContent += text.charAt(i);

        // keep page moving downward while typing
        window.scrollTo({

            top: document.body.scrollHeight,

            behavior:"smooth"

        });

        i++;

        if(i >= text.length){

            clearInterval(timer);

            if(callback) callback();

        }

    },speed);

}



/*==================================
ENDING PARTICLES
==================================*/
function initEndingParticles() {

    const canvas = document.getElementById("ending-particles-canvas");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const wrap = document.getElementById("ending-wrap");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
    const fireworks = [];

    class Firework {

        constructor() {

            this.reset();

        }

        reset() {

            this.x = Math.random() * canvas.width;

this.y = canvas.height + 20;
const scroll = window.scrollY;

this.targetY =
100 +
Math.random() * (canvas.height * 0.35);
            this.speed = 5 + Math.random() * 2;

            this.color = `hsl(${Math.random()*360},100%,60%)`;

            this.exploded = false;

            this.particles = [];

        }

        update() {

            if (!this.exploded) {

                this.y -= this.speed;

                if (this.y <= this.targetY) {

                    this.explode();

                }

            }

            this.particles.forEach(p => p.update());

            this.particles = this.particles.filter(p => p.life > 0);

            if (this.exploded && this.particles.length === 0) {

                this.reset();

            }

        }

        explode() {

            this.exploded = true;

            for (let i = 0; i < 60; i++) {

                this.particles.push(new Spark(this.x, this.y, this.color));

            }

        }

        draw() {

            if (!this.exploded) {

                ctx.beginPath();

                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);

                ctx.fillStyle = this.color;

                ctx.fill();

            }

            this.particles.forEach(p => p.draw());

        }

    }

    class Spark {

        constructor(x,y,color){

            this.x=x;

            this.y=y;

            this.color=color;

            const angle=Math.random()*Math.PI*2;

            const speed=Math.random()*5+2;

            this.vx=Math.cos(angle)*speed;

            this.vy=Math.sin(angle)*speed;

            this.life=100;

        }

        update(){

            this.x+=this.vx;

            this.y+=this.vy;

            this.vy+=0.05;

            this.life--;

        }

        draw(){

            ctx.globalAlpha=this.life/100;

            ctx.beginPath();

            ctx.arc(this.x,this.y,2,0,Math.PI*2);

            ctx.fillStyle=this.color;

            ctx.fill();

            ctx.globalAlpha=1;

        }

    }

    for(let i=0;i<6;i++){

        fireworks.push(new Firework());

    }

    function animate(){

    const wrap = document.getElementById("ending-wrap");
    ctx.fillStyle="rgba(0,0,0,.18)";

    ctx.fillRect(0,0,canvas.width,canvas.height);

    fireworks.forEach(f=>{

        f.update();

        f.draw();

    });

    requestAnimationFrame(animate);
   
}
window.addEventListener("resize",()=>{

    canvas.width = wrap.clientWidth;

    canvas.height = wrap.scrollHeight;

});
 animate();
}
/*==================================
RESTART
==================================*/

$("#btn-restart")?.addEventListener("click", () => {

    location.reload();

});

function enterEnding() {
    loadEndingSection();
}