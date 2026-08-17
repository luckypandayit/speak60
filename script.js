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

let recognitionStarting = false;


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

const streakElement =
    document.getElementById("streak");


/* =========================================
   SAFETY CHECK
========================================= */

if (!timeElement) {
    console.error("Speak60: #time element not found.");
}

if (!progress) {
    console.error("Speak60: #progress element not found.");
}

if (!transcriptElement) {
    console.error("Speak60: #transcript element not found.");
}


/* =========================================
   TIMER CIRCLE
========================================= */

const radius = 150;

const circumference =
    2 * Math.PI * radius;


if (progress) {

    progress.style.strokeDasharray =
        circumference;

    progress.style.strokeDashoffset =
        circumference;

}


/* =========================================
   SPEECH RECOGNITION SUPPORT
========================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


/* =========================================
   MICROPHONE PERMISSION
========================================= */

async function requestMicrophonePermission() {

    /*
       Check browser support for getUserMedia.
    */

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        alert(
            "Your browser does not support microphone access. Please use the latest Google Chrome."
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


        console.log(
            "Speak60: Microphone permission granted."
        );


        /*
           We only needed permission.
           SpeechRecognition handles the actual
           speech recognition.
        */

        stream
            .getTracks()
            .forEach(
                track => track.stop()
            );


        return true;

    }

    catch (error) {

        console.error(
            "Speak60: Microphone permission error:",
            error
        );


        if (
            error.name === "NotAllowedError"
        ) {

            alert(
                "Microphone permission was blocked. Click the 🔒 icon near the website address, set Microphone to Allow, then refresh the page."
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
                "Unable to access your microphone. Please check your browser microphone settings."
            );

        }


        return false;

    }

}


/* =========================================
   CREATE SPEECH RECOGNITION
========================================= */

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


    /*
       Keep listening while the session
       is active.
    */

    recognition.continuous = true;


    /*
       Show live words before they become
       final transcript.
    */

    recognition.interimResults = true;


    /*
       English speaking practice.
    */

    recognition.lang = "en-US";


    /*
       Maximum alternatives.
    */

    recognition.maxAlternatives = 1;


    /* =====================================
       SPEECH RESULT
    ===================================== */

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

            }

            else {

                interimTranscript += text;

            }

        }


        const completeTranscript =
            finalTranscript +
            interimTranscript;


        updateTranscript(
            completeTranscript
        );


        console.log(
            "Speak60 transcript:",
            completeTranscript
        );

    };


    /* =====================================
       SPEECH ERROR
    ===================================== */

    recognition.onerror =
        function(event) {

            console.error(
                "Speak60 Speech Recognition Error:",
                event.error
            );


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


    /* =====================================
       SPEECH END
    ===================================== */

    recognition.onend =
        function() {

            console.log(
                "Speak60: Speech recognition ended."
            );


            recognitionStarting = false;


            /*
               Chrome may automatically stop
               recognition.

               If our timer is still running,
               restart recognition.
            */

            if (
                running &&
                remainingSeconds > 0
            ) {

                setTimeout(
                    function() {

                        startRecognition();

                    },
                    250
                );

            }

        };

}


/* =========================================
   START SPEECH RECOGNITION
========================================= */

function startRecognition() {

    if (
        !recognition ||
        !running
    ) {

        return;

    }


    if (recognitionStarting) {

        return;

    }


    recognitionStarting = true;


    try {

        recognition.start();


        console.log(
            "Speak60: Speech recognition started."
        );

    }

    catch (error) {

        console.log(
            "Speak60: Recognition start:",
            error.message
        );

    }


    setTimeout(
        function() {

            recognitionStarting = false;

        },
        500
    );

}


/* =========================================
   START / PAUSE TIMER
========================================= */

async function startTimer() {

    /*
       If already running,
       pause the session.
    */

    if (running) {

        pauseTimer();

        return;

    }


    /*
       Browser speech support.
    */

    if (!speechSupported) {

        alert(
            "Speech recognition is not supported in this browser. Please use the latest Google Chrome."
        );

        return;

    }


    /*
       Request microphone permission.
    */

    const microphoneAllowed =
        await requestMicrophonePermission();


    if (!microphoneAllowed) {

        return;

    }


    /*
       If previous session was completed,
       reset it.
    */

    if (
        remainingSeconds <= 0
    ) {

        resetTimer();

    }


    /*
       Start state.
    */

    running = true;


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
       Start speech recognition.
    */

    startRecognition();


    /*
       Start countdown.
    */

    timer =
        setInterval(
            function() {

                remainingSeconds--;


                updateTime();

                updateCircle();


                /*
                   Finish at zero.
                */

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
       Stop recognition.
    */

    if (recognition) {

        try {

            recognition.stop();

        }

        catch (error) {

            console.log(error);

        }

    }


    recognitionStarting = false;

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

        }

        catch (error) {

            console.log(error);

        }

    }


    recognitionStarting = false;


    timerContainer.classList.remove(
        "timer-running"
    );


    startText.textContent =
        "Start Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Ready';

}


/* =========================================
   RESET
========================================= */

function resetTimer() {

    clearInterval(timer);

    timer = null;

    running = false;

    recognitionStarting = false;


    remainingSeconds =
        TOTAL_SECONDS;


    finalTranscript = "";


    /*
       Stop recognition.
    */

    if (recognition) {

        try {

            recognition.stop();

        }

        catch (error) {

            console.log(error);

        }

    }


    /*
       Reset timer.
    */

    updateTime();


    /*
       Reset circle.
    */

    if (progress) {

        progress.style.strokeDashoffset =
            circumference;

    }


    /*
       Reset orbit.
    */

    moveDot(0);


    orbitDot.style.opacity =
        "0";


    /*
       Reset button.
    */

    startText.textContent =
        "Start Speaking";


    /*
       Reset status.
    */

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


    if (progress) {

        progress.style.strokeDashoffset =
            offset;

    }


    moveDot(
        percentage
    );

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
   UPDATE TRANSCRIPT
========================================= */

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


    const words =
        text
            .trim()
            .split(/\s+/)
            .filter(
                word =>
                    word.length > 0
            );


    const count =
        words.length;


    wordCountElement.textContent =

        count
        +
        (
            count === 1
                ? " word"
                : " words"
        );

}


/* =========================================
   FINISH 60 SECOND SESSION
========================================= */

function finishTimer() {

    clearInterval(timer);

    timer = null;

    running = false;

    recognitionStarting = false;

    remainingSeconds = 0;


    /*
       Stop speech recognition.
    */

    if (recognition) {

        try {

            recognition.stop();

        }

        catch (error) {

            console.log(error);

        }

    }


    /*
       Timer UI.
    */

    timeElement.textContent =
        "00:00";


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


    /*
       Update streak.
    */

    updateStreak();


    /*
       Sound.
    */

    playFinishSound();


    /*
       Show completion.
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


    /*
       Topic.
    */

    topicElement.textContent =
        selected.text;


    /*
       Difficulty.
    */

    const difficulty =
        document.querySelector(
            ".difficulty"
        );


    if (difficulty) {

        difficulty.innerHTML = `

            <span class="difficulty-dot"></span>

            ${selected.difficulty}

        `;

    }


    /*
       Category.
    */

    const category =
        document.querySelector(
            ".category"
        );


    if (category) {

        category.textContent =
            selected.category;

    }


    /*
       Reset timer.
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

    if (!streakElement) {

        return;

    }


    let streak =
        parseInt(
            localStorage.getItem(
                "speak60Streak"
            )
        )
        ||
        0;


    streak++;


    localStorage.setItem(
        "speak60Streak",
        streak
    );


    streakElement.textContent =
        String(streak).padStart(
            2,
            "0"
        );

}


/* =========================================
   LOAD STREAK
========================================= */

function loadStreak() {

    if (!streakElement) {

        return;

    }


    const streak =
        parseInt(
            localStorage.getItem(
                "speak60Streak"
            )
        )
        ||
        0;


    streakElement.textContent =
        String(streak).padStart(
            2,
            "0"
        );

}


/* =========================================
   AI FEEDBACK
========================================= */

function requestAIFeedback() {

    const answer =
        finalTranscript.trim();


    /*
       No answer.
    */

    if (!answer) {

        alert(
            "First complete a speaking session."
        );

        return;

    }


    /*
       Prepare AI prompt.
    */

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
       Backend will be connected later.
    */

    alert(
        "Your response is ready for AI analysis."
    );

}


/* =========================================
   KEYBOARD SHORTCUTS
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /*
           SPACE
           Start / Pause
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
           R
           Reset
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


/* =========================================
   INITIALIZE
========================================= */

createSpeechRecognition();

loadStreak();

moveDot(0);

updateTime();

updateTranscript("");