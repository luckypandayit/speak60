/* =========================================
   SPEAK60
   MODERN 60 SECOND SPEAKING TIMER
========================================= */


/* =========================================
   SETTINGS
========================================= */

const TOTAL_SECONDS = 60;

let remainingSeconds = TOTAL_SECONDS;

let timer = null;

let running = false;


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
        category: "LIFESTYLE"
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
   ELEMENTS
========================================= */

const timeElement =
    document.getElementById("time");

const progress =
    document.getElementById("progress");

const statusElement =
    document.getElementById("status");

const orbitDot =
    document.getElementById("orbitDot");

const startButton =
    document.getElementById("startBtn");

const startText =
    document.getElementById("startText");

const topicElement =
    document.getElementById("topic");

const completion =
    document.getElementById("completion");

const timerContainer =
    document.querySelector(".timer-container");

const timerPanel =
    document.querySelector(".timer-panel");


/* =========================================
   CIRCLE
========================================= */

const radius = 150;

const circumference =
    2 * Math.PI * radius;


progress.style.strokeDasharray =
    circumference;

progress.style.strokeDashoffset =
    circumference;


/* =========================================
   START TIMER
========================================= */

function startTimer() {

    if (running) {

        pauseTimer();

        return;

    }


    if (remainingSeconds <= 0) {

        resetTimer();

    }


    running = true;


    startText.innerHTML =
        "Pause Session";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Speaking';


    orbitDot.style.opacity = "1";


    timerContainer.classList.add(
        "timer-running"
    );


    timer = setInterval(() => {

        remainingSeconds--;

        updateTime();

        updateCircle();


        if (remainingSeconds <= 0) {

            finishTimer();

        }

    }, 1000);

}


/* =========================================
   PAUSE
========================================= */

function pauseTimer() {

    clearInterval(timer);

    running = false;


    startText.innerHTML =
        "Resume Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Paused';


    timerContainer.classList.remove(
        "timer-running"
    );

}


/* =========================================
   RESET
========================================= */

function resetTimer() {

    clearInterval(timer);

    running = false;

    remainingSeconds =
        TOTAL_SECONDS;


    updateTime();


    progress.style.strokeDashoffset =
        circumference;


    orbitDot.style.opacity =
        "0";


    moveDot(0);


    startText.innerHTML =
        "Start Speaking";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Ready';


    timerContainer.classList.remove(
        "timer-running"
    );

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


    timeElement.innerHTML =

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
   FINISH
========================================= */

function finishTimer() {

    clearInterval(timer);

    running = false;

    remainingSeconds = 0;


    timeElement.innerHTML =
        "00:00";


    progress.style.strokeDashoffset =
        "0";


    moveDot(1);


    startText.innerHTML =
        "Session Complete";


    statusElement.innerHTML =
        '<span class="status-dot"></span> Completed';


    timerContainer.classList.remove(
        "timer-running"
    );


    /*
       Update streak
    */

    updateStreak();


    /*
       Play sound
    */

    playFinishSound();


    /*
       Show completion popup
    */

    setTimeout(() => {

        completion.classList.add(
            "show"
        );

    }, 500);

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
        topicElement.innerHTML ===
        topics[randomIndex].text
    );


    const selected =
        topics[randomIndex];


    topicElement.innerHTML =
        selected.text;


    /*
       Update difficulty
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
       Update category
    */

    const category =
        document.querySelector(
            ".category"
        );


    category.innerHTML =
        selected.category;


    /*
       Reset timer
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


    streakElement.innerHTML =
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


    document.getElementById(
        "streak"
    ).innerHTML =

        String(streak).padStart(2, "0");

}


/* =========================================
   KEYBOARD SHORTCUT
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /*
           Space = Start / Pause
        */

        if (
            event.code === "Space" &&
            event.target.tagName !== "INPUT"
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