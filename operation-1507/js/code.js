/*==================================
IDENTITY VERIFICATION
==================================*/

const codeOptions = document.querySelectorAll(".code-option");
const verifyPopup = document.getElementById("verify-popup");
const verifyText = document.getElementById("verify-text");
const finalBtn = document.getElementById("btn-final-report");

// Initially hide the Final Report button
finalBtn.style.display = "none";

codeOptions.forEach(option => {

    option.addEventListener("click", () => {

        // Reset previous selection
        codeOptions.forEach(btn => {
            btn.classList.remove("selected");
            btn.classList.remove("wrong");
        });

        // Hide button every new click
        finalBtn.style.display = "none";

        let message = "";

        if (option.textContent.includes("Sakshi")) {

            option.classList.add("wrong");

            message =
`❌ ACCESS DENIED

Seriously?

After everything...

You still picked me?

Mission Failed 😂`;

        } else {

            option.classList.add("selected");

            message =
`😂 I knew it!

There was absolutely NO chance
you'd choose me. 😒

Identity Confirmed.

Click below to open the Final Report.`;

        }

        verifyPopup.classList.remove("hidden");
        verifyText.textContent = "";

        let i = 0;

        const typing = setInterval(() => {

            verifyText.textContent += message.charAt(i);

            verifyText.parentElement.scrollTop =
                verifyText.parentElement.scrollHeight;

            i++;

            if (i >= message.length) {

                clearInterval(typing);

                // Show button only for correct answers
                if (!option.textContent.includes("Sakshi")) {

                      finalBtn.style.display="block";
                }

            }

        }, 20);

    });

});


// Close popup using top-right ✕
document.getElementById("verify-popup-close")
.addEventListener("click", () => {

    verifyPopup.classList.add("hidden");

});


// Open Final Report
finalBtn.addEventListener("click",()=>{

verifyPopup.classList.add("hidden");

showSection("s-report","ACCESS GRANTED");

});