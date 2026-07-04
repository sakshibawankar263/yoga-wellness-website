function enterEvidence() {

    if (STATE.evidenceAnimated) {
        showBtn('btn-evidence-next');
        return;
    }

    STATE.evidenceAnimated = true;

    const folders = document.querySelectorAll(".archive-folder");

    folders.forEach((folder, index) => {

        folder.style.opacity = "0";
        folder.style.transform = "translateY(25px)";

        setTimeout(() => {

            folder.style.transition =
                "all .45s cubic-bezier(.22,.61,.36,1)";

            folder.style.opacity = "1";
            folder.style.transform = "translateY(0)";

            if(index === folders.length - 1){

                setTimeout(()=>{

                    showBtn("btn-evidence-next");

                },500);

            }

        }, index * 150);

    });

}
const folders = document.querySelectorAll(".archive-folder");

folders.forEach(folder => {

    folder.addEventListener("click", () => {

        startArchiveAccess(folder.dataset.file);

    });

});
function startArchiveAccess(id){

    const access = document.getElementById("archive-access");

    const fill = document.getElementById("terminal-fill");

    const l1 = document.getElementById("terminal-line1");

    const l2 = document.getElementById("terminal-line2");

    const status = document.getElementById("terminal-status");

    access.classList.remove("hidden");

    fill.style.width = "0%";

    status.textContent = "INITIALIZING";

    l1.textContent = "Memory Recovery Started...";

    l2.textContent = "";

    let progress = 0;

    const timer = setInterval(() => {

        progress += 25;

        fill.style.width = progress + "%";

        if(progress === 25)
            l2.textContent = "Recognizing Subject...";

        if(progress === 50)
            l2.textContent = "Recovering Memory...";

        if(progress === 75)
            l2.textContent = "Loading Conversation History...";

        if(progress === 100){

            l2.textContent = "Memory Restored ❤️";

            status.textContent = "RECOVERY COMPLETE";

            clearInterval(timer);

            setTimeout(() => {

                access.classList.add("hidden");

                openArchive(id);

            }, 900);

        }

    }, 450);

}
$('#btn-evidence-next')?.addEventListener('click', () => {
  showSection('s-code', 'LOADING CODING CHALLENGE...');
});

const archiveData = {

    1:{
title:"INITIAL CONVERSATION LOG",
text:`I used to talk.

You used to say...

"At least let me process the first line." 😭

Funny how things change...

Now,
you talk more.

And I actually listen. ❤️

✓ Memory Recovered`
},

    2:{
title:"OBSERVATION LOG",
text:`You aren't the loudest person.

But you're usually
the one who's actually listening.

You think before you speak.

(And somehow every explanation
comes with an example. 😂)

👀 Observation Logged`
},
    3:{
title:"LEARNING LOG",
text:`Sometimes...

I ask questions
that probably sound obvious.

But instead of judging me...

You patiently explain
everything.

I noticed that. ❤️

📘 Lesson Recorded`
},
    4:{
title:"CLASSIFIED FILE",
text:`Somehow...

You always manage
to prove your point.

Even when I don't agree...

A little later I'm like,

"Okay...
maybe you had a point." 😂

⚠️ Evidence Accepted`
},

    5:{
title:"FINAL REPORT",
text:`Investigation Complete.

After reviewing all the evidence...

Final Findings:

Yes.

You're intelligent.

Yes.

You always have an example.

And somehow...

Most of the time,
you actually turn out to be right. 😒😂

I hate admitting that.

(But according to you,
I'm still a gadhi. 🙄)

Fine.

I'll let you win this one.

Happy Birthday,
Mr. Know-It-All. 🎂

❤️ End of Investigation`
},
}

let archiveTyping = null;

function openArchive(id){
    const body = document.querySelector(".archive-body");
    const view = document.getElementById("archive-view");
    const title = document.getElementById("archive-title");
    const text = document.getElementById("archive-text");

    view.classList.remove("hidden");

    title.textContent = archiveData[id].title;

    text.textContent = "";

    if(archiveTyping){
        clearInterval(archiveTyping);
    }

    const content = archiveData[id].text;

    let i = 0;

    archiveTyping = setInterval(()=>{

        text.textContent += content.charAt(i);

        i++;
        body.scrollTop = body.scrollHeight;
        if(i >= content.length){

            clearInterval(archiveTyping);

        }

    },22);

}

/* ===========================
   CLOSE ARCHIVE
=========================== */

document.addEventListener("click",function(e){

    if(e.target.id==="archive-close"){

        document
        .getElementById("archive-view")
        .classList.add("hidden");

    }

});