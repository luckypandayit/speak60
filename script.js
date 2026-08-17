"use strict";

/* =========================================================
   SPEAK60
   60 SECOND ENGLISH SPEAKING PRACTICE
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const TOTAL_SECONDS = 60;
const CIRCUMFERENCE = 2 * Math.PI * 150;

let remainingSeconds = TOTAL_SECONDS;
let timer = null;
let running = false;

let finalTranscript = "";
let recognition = null;
let speechSupported = false;
let recognitionStarting = false;


/* =========================================================
   ENGLISH COACH PROMPT
========================================================= */

const AI_COACH_PROMPT = `
Act as my English speaking partner.

Give me one random speaking topic at a time.

The topics should be suitable for everyday conversations,
opinions, work, travel, technology, books, or current events.

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


/* =========================================================
   TOPICS
========================================================= */

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
    },

    {
        text: "What book has influenced the way you think?",
        difficulty: "Medium",
        category: "BOOKS"
    },

    {
        text: "What is something you want to achieve this year?",
        difficulty: "Easy",
        category: "GOALS"
    },

    {
        text: "Would you rather work from home or from an office?",
        difficulty: "Medium",
        category: "WORK"
    },

    {
        text: "What makes a good friend?",
        difficulty: "Easy",
        category: "EVERYDAY LIFE"
    },

    {
        text: "What is one invention you cannot imagine living without?",
        difficulty: "Medium",
        category: "TECHNOLOGY"
    }

];


/* =========================================================
   DOM ELEMENTS
========================================================= */

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

const transcriptElement =
    document.getElementById("transcript");

const wordCountElement =
    document.getElementById("wordCount");

const streakElement =
    document.getElementById("streak");

const timerContainer =
    document.querySelector(".timer-container");


/* =========================================================
   TIMER CIRCLE SETUP
========================================================= */

if (progress) {

    progress.style.strokeDasharray =
        CIRCUMFERENCE;

    progress.style.strokeDashoffset =
        CIRCUMFERENCE;

}


/* =========================================================
   SPEECH RECOGNITION SUPPORT
========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

speechSupported =
    Boolean(SpeechRecognition);


/* =========================================================
   MICROPHONE PERMISSION
========================================================= */

async function requestMicrophonePermission() {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Microphone access is not supported here. Please use the latest Google Chrome."
        );

        return false;

    }


    try {

        console.log(
            "Speak60: Requesting microphone permission..."
        );


        const stream =
            await navigator.mediaDevices.getUserMedia({
                audio: true
            });


        stream
            .getTracks()
            .forEach(
                track => track.stop()
            );


        console.log(
            "Speak60: Microphone permission granted."
        );


        return true;

    }

    catch (error) {

        console.error(
            "Speak60 microphone error:",
            error
        );


        if (
            error.name === "NotAllowedError"
        ) {

            alert(
                "Microphone permission is blocked. Click the lock icon near the website address, set Microphone to Allow, then refresh."
            );

        }

        else if (
            error.name === "NotFoundError"
        ) {

            alert(
                "No microphone was found. Connect a microphone and try again."
            );

        }

        else {

            alert(
                "Unable to access your microphone. Please check Chrome microphone settings."
            );

        }


        return false;

    }

}


/* =========================================================
   CREATE SPEECH RECOGNITION
========================================================= */

function createSpeechRecognition() {

    if (!SpeechRecognition) {

        speechSupported = false;

        console.error(
            "Speak60: Speech Recognition is not supported."
        );

        return;

    }


    speechSupported = true;


    recognition =
        new SpeechRecognition();


    recognition.continuous =
        true;


    recognition.interimResults =
        true;


    recognition.lang =
        "en-US";


    recognition.maxAlternatives =
        1;


    /* =====================================================
       SPEECH START
    ===================================================== */

    recognition.onstart =
        function () {

            recognitionStarting =
                false;

            console.log(
                "Speak60: Speech recognition started."
            );

        };


    /* =====================================================
       SPEECH RESULT
    ===================================================== */

    recognition.onresult =
        function (event) {

            let interimTranscript =
                "";


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

                }

                else {

                    interimTranscript +=
                        text;

                }

            }


            const completeTranscript =
                finalTranscript +
                interimTranscript;


            updateTranscript(
                completeTranscript
            );

        };


    /* =====================================================
       SPEECH ERROR
    ===================================================== */

    recognition.onerror =
        function (event) {

            console.error(
                "Speak60 Speech Error:",
                event.error
            );


            recognitionStarting =
                false;


            if (
                event.error === "not-allowed"
            ) {

                alert(
                    "Microphone permission was denied. Please allow microphone access for this website."
                );


                stopSpeaking();

            }


            else if (
                event.error === "audio-capture"
            ) {

                alert(
                    "No microphone was detected. Please check your microphone."
                );


                stopSpeaking();

            }


            else if (
                event.error === "network"
            ) {

                console.warn(
                    "Speech recognition network error."
                );

            }

        };


    /* =====================================================
       SPEECH END
    ===================================================== */

    recognition.onend =
        function () {

            recognitionStarting =
                false;


            console.log(
                "Speak60: Speech recognition ended."
            );


            /*
               Chrome may automatically stop
               speech recognition.

               Restart only while timer
               is still running.
            */

            if (
                running &&
                remainingSeconds > 0
            ) {

                setTimeout(
                    startRecognition,
                    300
                );

            }

        };

}


/* =========================================================
   START SPEECH RECOGNITION
========================================================= */

function startRecognition() {

    if (
        !recognition ||
        !running ||
        recognitionStarting
    ) {

        return;

    }


    recognitionStarting =
        true;


    try {

        recognition.start();


        console.log(
            "Speak60: Recognition start called."
        );

    }

    catch (error) {

        recognitionStarting =
            false;


        console.warn(
            "Speak60 recognition start:",
            error.message
        );

    }

}


/* =========================================================
   START / PAUSE TIMER
========================================================= */

async function startTimer() {

    console.log(
        "Speak60: Start Speaking clicked."
    );


    /*
       If timer is already running,
       pause it.
    */

    if (running) {

        pauseTimer();

        return;

    }


    /*
       Check Speech Recognition.
    */

    if (!speechSupported) {

        alert(
            "Speech recognition is not supported in this browser. Please use Google Chrome."
        );

        return;

    }


    /*
       Ask microphone permission.
    */

    const microphoneAllowed =
        await requestMicrophonePermission();


    if (!microphoneAllowed) {

        return;

    }


    /*
       Reset completed session.
    */

    if (
        remainingSeconds <= 0
    ) {

        resetTimer();

    }


    /*
       Start session.
    */

    running =
        true;


    startText.textContent =
        "Pause Session";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Speaking';


    timerContainer.classList.add(
        "timer-running"
    );


    orbitDot.style.opacity =
        "1";


    /*
       Start microphone recognition.
    */

    startRecognition();


    /*
       Start 60 second countdown.
    */

    timer =
        setInterval(
            function () {

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


/* =========================================================
   PAUSE TIMER
========================================================= */

function pauseTimer() {

    clearInterval(timer);

    timer =
        null;

    running =
        false;

    recognitionStarting =
        false;


    startText.textContent =
        "Resume Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Paused';


    timerContainer.classList.remove(
        "timer-running"
    );


    stopRecognition();

}


/* =========================================================
   STOP SPEAKING
========================================================= */

function stopSpeaking() {

    clearInterval(timer);

    timer =
        null;

    running =
        false;

    recognitionStarting =
        false;


    stopRecognition();


    timerContainer.classList.remove(
        "timer-running"
    );


    startText.textContent =
        "Start Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Ready';

}


/* =========================================================
   STOP RECOGNITION
========================================================= */

function stopRecognition() {

    if (!recognition) {

        return;

    }


    try {

        recognition.stop();

    }

    catch (error) {

        console.log(
            "Recognition already stopped."
        );

    }

}


/* =========================================================
   RESET TIMER
========================================================= */

function resetTimer() {

    clearInterval(timer);

    timer =
        null;

    running =
        false;

    recognitionStarting =
        false;


    remainingSeconds =
        TOTAL_SECONDS;


    finalTranscript =
        "";


    stopRecognition();


    updateTime();


    if (progress) {

        progress.style.strokeDashoffset =
            CIRCUMFERENCE;

    }


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


    updateTranscript("");

}


/* =========================================================
   UPDATE TIME
========================================================= */

function updateTime() {

    const minutes =
        Math.floor(
            remainingSeconds / 60
        );


    const seconds =
        remainingSeconds % 60;


    timeElement.textContent =

        String(minutes).padStart(
            2,
            "0"
        )
        +
        ":"
        +
        String(seconds).padStart(
            2,
            "0"
        );

}


/* =========================================================
   UPDATE CIRCLE
========================================================= */

function updateCircle() {

    const elapsed =
        TOTAL_SECONDS -
        remainingSeconds;


    const percentage =
        elapsed /
        TOTAL_SECONDS;


    const offset =
        CIRCUMFERENCE -
        (
            percentage *
            CIRCUMFERENCE
        );


    if (progress) {

        progress.style.strokeDashoffset =
            offset;

    }


    moveDot(
        percentage
    );

}


/* =========================================================
   MOVE ORBIT DOT
========================================================= */

function moveDot(percentage) {

    const angle =

        percentage *
        Math.PI *
        2
        -
        Math.PI / 2;


    const x =

        180 +
        150 *
        Math.cos(angle);


    const y =

        180 +
        150 *
        Math.sin(angle);


    orbitDot.style.left =
        `${(x / 360) * 100}%`;


    orbitDot.style.top =
        `${(y / 360) * 100}%`;

}


/* =========================================================
   UPDATE TRANSCRIPT
========================================================= */

function updateTranscript(text) {

    if (
        !transcriptElement ||
        !wordCountElement
    ) {

        return;

    }


    if (
        !text.trim()
    ) {

        transcriptElement.textContent =
            "Your spoken words will appear here...";


        wordCountElement.textContent =
            "0 words";


        return;

    }


    transcriptElement.textContent =
        text;


    const count =
        text
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .length;


    wordCountElement.textContent =

        `${count} ${
            count === 1
                ? "word"
                : "words"
        }`;

}


/* =========================================================
   FINISH 60 SECOND SESSION
========================================================= */

function finishTimer() {

    clearInterval(timer);

    timer =
        null;

    running =
        false;

    recognitionStarting =
        false;


    remainingSeconds =
        0;


    stopRecognition();


    updateTime();


    if (progress) {

        progress.style.strokeDashoffset =
            "0";

    }


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


    updateStreak();


    playFinishSound();


    setTimeout(
        function () {

            if (completion) {

                completion.classList.add(
                    "show"
                );

            }

        },
        500
    );

}


/* =========================================================
   RANDOM TOPIC
========================================================= */

function newTopic() {

    if (!topicElement) {

        return;

    }


    let selected;


    do {

        selected =
            topics[
                Math.floor(
                    Math.random() *
                    topics.length
                )
            ];

    }

    while (
        selected.text ===
        topicElement.textContent
    );


    topicElement.textContent =
        selected.text;


    const difficulty =
        document.querySelector(
            ".difficulty"
        );


    if (difficulty) {

        difficulty.innerHTML =

            `<span class="difficulty-dot"></span>
             ${selected.difficulty}`;

    }


    const category =
        document.querySelector(
            ".category"
        );


    if (category) {

        category.textContent =
            selected.category;

    }


    resetTimer();

}


/* =========================================================
   NEW SESSION
========================================================= */

function newSession() {

    if (completion) {

        completion.classList.remove(
            "show"
        );

    }


    newTopic();

}


/* =========================================================
   STREAK
========================================================= */

function updateStreak() {

    let streak =

        parseInt(
            localStorage.getItem(
                "speak60Streak"
            ),
            10
        )
        ||
        0;


    streak++;


    localStorage.setItem(
        "speak60Streak",
        streak
    );


    if (streakElement) {

        streakElement.textContent =

            String(streak).padStart(
                2,
                "0"
            );

    }

}


/* =========================================================
   LOAD STREAK
========================================================= */

function loadStreak() {

    const streak =

        parseInt(
            localStorage.getItem(
                "speak60Streak"
            ),
            10
        )
        ||
        0;


    if (streakElement) {

        streakElement.textContent =

            String(streak).padStart(
                2,
                "0"
            );

    }

}


/* =========================================================
   AI FEEDBACK
========================================================= */

function requestAIFeedback() {

    const answer =
        finalTranscript.trim();


    if (!answer) {

        alert(
            "First complete a speaking session."
        );

        return;

    }


    const prompt =

        AI_COACH_PROMPT
        +
        "\n\n"
        +
        answer;


    console.log(
        "Speak60 AI Prompt:",
        prompt
    );


    /*
       IMPORTANT:

       Do NOT put your OpenAI API key
       directly inside this JavaScript file.

       We will connect the AI through
       a secure backend later.
    */


    alert(
        "Your response is ready for AI analysis."
    );

}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {


        /*
           SPACE = Start / Pause
        */

        if (

            event.code === "Space"
            &&
            event.target.tagName !== "INPUT"
            &&
            event.target.tagName !== "TEXTAREA"

        ) {

            event.preventDefault();

            startTimer();

        }


        /*
           R = Reset
        */

        if (

            event.key.toLowerCase()
            ===
            "r"

        ) {

            resetTimer();

        }

    }
);


/* =========================================================
   FINISH SOUND
========================================================= */

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


    oscillator.connect(
        gain
    );


    gain.connect(
        audio.destination
    );


    oscillator.frequency.value =
        650;


    gain.gain.value =
        0.12;


    oscillator.start();


    oscillator.stop(
        audio.currentTime
        +
        0.35
    );

}


/* =========================================================
   INITIALIZE
========================================================= */

createSpeechRecognition();

loadStreak();

moveDot(0);

updateTime();

updateTranscript("");


console.log(
    "🔥 SPEAK60 SCRIPT LOADED SUCCESSFULLY"
);
