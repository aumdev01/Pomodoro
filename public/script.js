document.addEventListener("DOMContentLoaded", () => {
    const timerDisplay = document.getElementById('timer');
    const startButton = document.getElementById('start');
    const pauseButton = document.getElementById('pause');
    const break5Button = document.getElementById('break-5');
    const break15Button = document.getElementById('break-15');
    // const breakOptions = document.getElementById('break-options')
    let isRunning = false;
    let isPaused = false;
    let timer;
    let remainingTime;

    startButton.addEventListener('click', () => {
        if (!isRunning) {
            startPomodoro();
        } else {
            clearInterval(timer);
            isRunning = false;
            startButton.textContent = 'Start Pomodoro';
        }
    });

    pauseButton.addEventListener('click', () => {
        if (isRunning && !isPaused) {
            clearInterval(timer);
            isPaused = true;
            pauseButton.textContent = 'Resume';
        } else if (isPaused) {
            isPaused = false;
            pauseButton.textContent = 'Pause';
            runTimer(remainingTime, "Pomodoro");
        }
    });
    // breakOptions.style.display = 'block'
    break5Button.addEventListener('click', () => startBreak(5));
    break15Button.addEventListener('click', () => startBreak(15));

    function startPomodoro() {
        let time = 60*25; // 25 minutes in seconds
        isRunning = true;
        startButton.textContent = 'Stop Pomodoro';
        runTimer(time, "Pomodoro");
    }

    function startBreak(minutes) {
        clearInterval(timer);  // Clear any existing timer
        let time = minutes * 60; // Break time in seconds
        isRunning = true;
        isPaused = false;
        startButton.textContent = `Stop ${minutes}-Minute Break`;
        runTimer(time, `${minutes}-Minute Break`);
    }

    function runTimer(time, sessionType) {
        remainingTime = time;
        timer = setInterval(() => {
            remainingTime--;
            updateDisplay(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(timer);
                isRunning = false;
                isPaused = false;
                logSession(sessionType, time / 60);
                if (sessionType === "Pomodoro") {
                    alert("Pomodoro session finished! Choose your break duration.");
                } else {
                    alert(`${sessionType} finished! Ready to start a new Pomodoro?`);
                }
            }
        }, 1000);
    }

    function updateDisplay(time) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function logSession(sessionType, duration) {
        const now = new Date();
        const timestamp = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const logEntry = `${sessionType} of ${duration} minutes completed at ${timestamp}\n`;

        fetch('http://localhost:5000/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ logEntry }),
        })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
    }
});
