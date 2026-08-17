/* =========================================
   SPEAK60
   60 SECOND ENGLISH SPEAKING PRACTICE
========================================= */


/* =========================================
   SETTINGS
========================================= */

const TOTAL_SECONDS = 60;

let remainingSeconds = TOTAL_SECONDS;

let timer = null;

let running = false;

let finalTranscript = "";

let recognition = null;

let speechSupported = false;


/* =========================================
   ENGLISH COACH PROMPT
========================================= */

const AI_COACH_PROMPT = `
Act as my English speaking partner.

Give me one random speaking topic at a time.

The topics should be suitable for everyday
conversations, opinions, work, travel,
technology, books, or current events.

After I answer:

1. Correct my grammar naturally.

2. Replace unnatural words or phrases
with more natural English.

3. Suggest 3 advanced vocabulary words
or phrases related to my answer.

4. Ask me 3 follow-up questions to keep
the conversation going.

5. Rate my:
- Fluency
- Vocabulary
- Grammar
- Pronunciation based on my text
- Communication skills

Rate each out of 10.

6. Tell me:
- One thing I did well
- One thing I should improve

Do not rewrite my entire answer unless I ask.

Help me think and speak more naturally.

Keep the conversation encouraging,
realistic, and practical.

User's answer:
`;


/* =========================================
   TOPICS
========================================= */

const topics = [

    {
        text: "What is one skill everyone should learn?",
        difficulty: "Medium",
        category: "LIFE & CAREER"
    },

    {
        text: "If you could travel anywhere, where would you go?",
        difficulty: "Easy",
        category: "TRAVEL"
    },

    {
        text: "What would you change about your college?",
        difficulty: "Medium",
        category: "EDUCATION"
    },

    {
        text: "Is social media doing more harm than good?",
        difficulty: "Medium",
        category: "OPINION"
    },

    {
        text: "What does success mean to you?",
        difficulty: "Medium",
        category: "LIFE"
    },

    {
        text: "Should students use AI for studying?",
        difficulty: "Hard",
        category: "TECHNOLOGY"
    },

    {
        text: "What would you do if you became rich?",
        difficulty: "Easy",
        category: "IMAGINATION"
    },

    {
        text: "What technology will change our future?",
        difficulty: "Hard",
        category: "TECHNOLOGY"
    },

    {
        text: "Describe your perfect day.",
        difficulty: "Easy",
        category: "LIFESTYLE"
    },

    {
        text: "What is the biggest problem young people face today?",
        difficulty: "Hard",
        category: "SOCIETY"
    },

    {
        text: "Talk about someone who inspires you.",
        difficulty: "Easy",
        category: "PEOPLE"
    },

    {
        text: "Is money more important than happiness?",
        difficulty: "Hard",
        category: "OPINION"
    },

    {
        text: "What habit would you like to build?",
        difficulty: "Easy",
        category: "SELF GROWTH"
    },

    {
        text: "Will AI replace programmers in the future?",
        difficulty: "Hard",
        category: "AI & TECH"
    },

    {
        text: "What is the best advice you have ever received?",
        difficulty: "Medium",
        category: "LIFE"
    }

];


/* =========================================
   DOM ELEMENTS
========================================= */

const timeElement =
    document.getElementById("time");

const progress =
    document.getElementById("progress");

const statusElement =
    document.getElementById("status");

const orbitDot =
    document.getElementById("orbitDot");

const startText =
    document.getElementById("startText");

const topicElement =
    document.getElementById("topic");

const completion =
    document.getElementById("completion");

const timerContainer =
    document.querySelector(".timer-container");

const transcriptElement =
    document.getElementById("transcript");

const wordCountElement =
    document.getElementById("wordCount");

const feedbackButton =
    document.getElementById("feedbackBtn");


/* =========================================
   TIMER CIRCLE
========================================= */

const radius = 150;

const circumference =
    2 * Math.PI * radius;

progress.style.strokeDasharray =
    circumference;

progress.style.strokeDashoffset =
    circumference;


/* =========================================
   SPEECH RECOGNITION
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    speechSupported = true;

    recognition =
        new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;

    recognition.lang = "en-US";


    recognition.onresult = function(event) {

        let interimTranscript = "";


        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {

            const text =
                event.results[i][0].transcript;


            if (
                event.results[i].isFinal
            ) {

                finalTranscript +=
                    text + " ";

            } else {

                interimTranscript += text;

            }

        }


        const completeTranscript =
            finalTranscript +
            interimTranscript;


        updateTranscript(
            completeTranscript
        );

    };


    recognition.onerror = function(event) {

        console.log(
            "Speech recognition:",
            event.error
        );


        if (
            event.error === "not-allowed"
        ) {

            alert(
                "Microphone permission is required for Speak60."
            );

            stopSpeaking();

        }

    };


    recognition.onend = function() {

        /*
         Chrome can automatically stop
         speech recognition.

         Restart while the 60-second
         session is active.
        */

        if (running) {

            try {

                recognition.start();

            } catch (error) {

                console.log(
                    "Recognition restart:",
                    error
                );

            }

        }

    };

}


/* =========================================
   START / PAUSE
========================================= */

function startTimer() {

    /*
       If already running,
       pause the session.
    */

    if (running) {

        pauseTimer();

        return;

    }


    /*
       Restart after completion.
    */

    if (remainingSeconds <= 0) {

        resetTimer();

    }


    /*
       Browser support check.
    */

    if (!speechSupported) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

        return;

    }


    running = true;


    startText.textContent =
        "Pause Session";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Speaking';


    timerContainer.classList.add(
        "timer-running"
    );


    orbitDot.style.opacity = "1";


    /*
       Start microphone.
    */

    try {

        recognition.start();

    } catch (error) {

        console.log(
            "Recognition already running."
        );

    }


    /*
       Start countdown.
    */

    timer = setInterval(
        function() {

            remainingSeconds--;

            updateTime();

            updateCircle();


            if (
                remainingSeconds <= 0
            ) {

                finishTimer();

            }

        },
        1000
    );

}


/* =========================================
   PAUSE TIMER
========================================= */

function pauseTimer() {

    clearInterval(timer);

    timer = null;

    running = false;


    startText.textContent =
        "Resume Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Paused';


    timerContainer.classList.remove(
        "timer-running"
    );


    /*
       Stop microphone temporarily.
    */

    if (recognition) {

        try {

            recognition.stop();

        } catch (error) {

            console.log(error);

        }

    }

}


/* =========================================
   STOP SPEAKING
========================================= */

function stopSpeaking() {

    clearInterval(timer);

    timer = null;

    running = false;


    if (recognition) {

        try {

            recognition.stop();

        } catch (error) {

            console.log(error);

        }

    }


    timerContainer.classList.remove(
        "timer-running"
    );

}


/* =========================================
   RESET
========================================= */

function resetTimer() {

    clearInterval(timer);

    timer = null;

    running = false;

    remainingSeconds =
        TOTAL_SECONDS;

    finalTranscript = "";


    /*
       Stop recognition.
    */

    if (recognition) {

        try {

            recognition.stop();

        } catch (error) {

            console.log(error);

        }

    }


    /*
       Reset timer UI.
    */

    updateTime();


    progress.style.strokeDashoffset =
        circumference;


    moveDot(0);


    orbitDot.style.opacity =
        "0";


    startText.textContent =
        "Start Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Ready';


    timerContainer.classList.remove(
        "timer-running"
    );


    /*
       Reset transcript.
    */

    updateTranscript("");

}


/* =========================================
   UPDATE TIME
========================================= */

function updateTime() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timeElement.textContent =

        String(minutes).padStart(2, "0")
        +
        ":"
        +
        String(seconds).padStart(2, "0");

}


/* =========================================
   UPDATE CIRCLE
========================================= */

function updateCircle() {

    const elapsed =
        TOTAL_SECONDS -
        remainingSeconds;


    const percentage =
        elapsed / TOTAL_SECONDS;


    const offset =
        circumference -
        (
            percentage *
            circumference
        );


    progress.style.strokeDashoffset =
        offset;


    moveDot(percentage);

}


/* =========================================
   MOVE ORBIT DOT
========================================= */

function moveDot(percentage) {

    const angle =
        percentage *
        2 *
        Math.PI
        -
        Math.PI / 2;


    const centerX = 180;

    const centerY = 180;


    const x =
        centerX +
        radius *
        Math.cos(angle);


    const y =
        centerY +
        radius *
        Math.sin(angle);


    const left =
        (x / 360) * 100;


    const top =
        (y / 360) * 100;


    orbitDot.style.left =
        left + "%";


    orbitDot.style.top =
        top + "%";

}


/* =========================================
   TRANSCRIPT
========================================= */

function updateTranscript(text) {

    if (!text.trim()) {

        transcriptElement.textContent =
            "Your spoken words will appear here...";


        wordCountElement.textContent =
            "0 words";


        return;

    }


    transcriptElement.textContent =
        text;


    const words =
        text
            .trim()
            .split(/\s+/)
            .filter(
                word => word.length > 0
            );


    const count =
        words.length;


    wordCountElement.textContent =

        count +
        (
            count === 1
                ? " word"
                : " words"
        );

}


/* =========================================
   FINISH TIMER
========================================= */

function finishTimer() {

    clearInterval(timer);

    timer = null;

    running = false;

    remainingSeconds = 0;


    /*
       Stop speech recognition.
    */

    if (recognition) {

        try {

            recognition.stop();

        } catch (error) {

            console.log(error);

        }

    }


    timeElement.textContent =
        "00:00";


    progress.style.strokeDashoffset =
        "0";


    moveDot(1);


    orbitDot.style.opacity =
        "1";


    startText.textContent =
        "Session Complete";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Completed';


    timerContainer.classList.remove(
        "timer-running"
    );


    /*
       Update streak.
    */

    updateStreak();


    /*
       Finish sound.
    */

    playFinishSound();


    /*
       Show completion popup.
    */

    setTimeout(
        function() {

            completion.classList.add(
                "show"
            );

        },
        500
    );

}


/* =========================================
   RANDOM TOPIC
========================================= */

function newTopic() {

    let randomIndex;


    do {

        randomIndex =
            Math.floor(
                Math.random() *
                topics.length
            );

    }

    while (
        topicElement.textContent ===
        topics[randomIndex].text
    );


    const selected =
        topics[randomIndex];


    topicElement.textContent =
        selected.text;


    /*
       Difficulty
    */

    const difficulty =
        document.querySelector(
            ".difficulty"
        );


    difficulty.innerHTML = `

        <span class="difficulty-dot"></span>

        ${selected.difficulty}

    `;


    /*
       Category
    */

    const category =
        document.querySelector(
            ".category"
        );


    category.textContent =
        selected.category;


    /*
       Reset session.
    */

    resetTimer();

}


/* =========================================
   NEW SESSION
========================================= */

function newSession() {

    completion.classList.remove(
        "show"
    );


    newTopic();

}


/* =========================================
   STREAK
========================================= */

function updateStreak() {

    const streakElement =
        document.getElementById(
            "streak"
        );


    let streak =
        parseInt(
            localStorage.getItem(
                "speak60Streak"
            )
        ) || 0;


    streak++;


    localStorage.setItem(
        "speak60Streak",
        streak
    );


    streakElement.textContent =
        String(streak).padStart(2, "0");

}


/* =========================================
   LOAD STREAK
========================================= */

function loadStreak() {

    const streak =
        parseInt(
            localStorage.getItem(
                "speak60Streak"
            )
        ) || 0;


    const streakElement =
        document.getElementById(
            "streak"
        );


    if (streakElement) {

        streakElement.textContent =
            String(streak).padStart(2, "0");

    }

}


/* =========================================
   AI FEEDBACK
========================================= */

function requestAIFeedback() {

    const answer =
        finalTranscript.trim();


    /*
       User hasn't spoken.
    */

    if (!answer) {

        alert(
            "First complete a speaking session."
        );

        return;

    }


    /*
       Create the complete prompt.

       IMPORTANT:
       Do NOT put an OpenAI API key
       inside this JavaScript file.
    */

    const prompt =
        AI_COACH_PROMPT +
        "\n\n" +
        answer;


    console.log(
        "Speak60 AI Prompt:",
        prompt
    );


    /*
       Backend will be connected here
       in the next step.
    */

    alert(
        "Your response is ready for AI analysis."
    );

}


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener(
    "keydown",
    function(event) {


        /*
           SPACE = Start / Pause
        */

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT" &&
            event.target.tagName !== "TEXTAREA"
        ) {

            event.preventDefault();

            startTimer();

        }


        /*
           R = Reset
        */

        if (
            event.key.toLowerCase() === "r"
        ) {

            resetTimer();

        }

    }
);


/* =========================================
   FINISH SOUND
========================================= */

function playFinishSound() {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        return;

    }


    const audio =
        new AudioContext();


    const oscillator =
        audio.createOscillator();


    const gain =
        audio.createGain();


    oscillator.connect(gain);

    gain.connect(
        audio.destination
    );


    oscillator.frequency.value =
        650;


    gain.gain.value =
        0.12;


    oscillator.start();


    oscillator.stop(
        audio.currentTime + 0.35
    );

}


/* =========================================
   INITIALIZE
========================================= */

loadStreak();

moveDot(0);

updateTime();

updateTranscript("");