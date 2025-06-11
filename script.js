let timer;
let timeLeft;
let isRunning = false;

function startTimer() {
    if (!isRunning) {
        // If timeLeft is undefined, initialize from input; otherwise, continue from current timeLeft
        if (typeof timeLeft === "undefined" || timeLeft === null) {
            let minutes = parseInt(document.getElementById("work-duration").value, 10) || 25;
            timeLeft = minutes * 60;
        }
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    pauseTimer();
    let minutes = parseInt(document.getElementById("work-duration").value, 10) || 25;
    timeLeft = minutes * 60;
    document.getElementById("time").textContent = `${minutes}:00`;
}

function updateTimer() {
    if (timeLeft <= 0) {
        clearInterval(timer);
        isRunning = false;
        document.getElementById("alarm-sound").play(); // Play sound
        alert("Time's up! Take a break.");
        return;
    }
    timeLeft--;
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById("time").textContent = 
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function displayNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.position = "fixed";
    notification.style.bottom = "20px";
    notification.style.right = "20px";
    notification.style.backgroundColor = "#333";
    notification.style.color = "#fff";
    notification.style.padding = "10px 20px";
    notification.style.borderRadius = "5px";
    notification.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
    notification.style.zIndex = "1000";
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 5000);
}

function showDesktopNotification(message) {
    if (Notification.permission === "granted") {
        new Notification(message);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(message);
            }
        });
    }
}

document.getElementById("start").addEventListener("click", startTimer);
document.getElementById("pause").addEventListener("click", pauseTimer);
document.getElementById("reset").addEventListener("click", resetTimer);
document.getElementById("work-duration").addEventListener("change", resetTimer);
document.getElementById("work-duration").addEventListener("input", resetTimer);
document.getElementById("work-duration").addEventListener("blur", () => {
    const value = parseInt(document.getElementById("work-duration").value, 10);
    if (isNaN(value) || value <= 0) {
        document.getElementById("work-duration").value = 25;
        resetTimer();
        displayNotification("Invalid work duration. Reset to 25 minutes.");
    }
});
document.getElementById("work-duration").addEventListener("change", () => {
    const value = parseInt(document.getElementById("work-duration").value, 10);
    if (isNaN(value) || value <= 0) {
        alert("Work duration must be greater than zero. Resetting to 25 minutes.");
        document.getElementById("work-duration").value = 25;
        resetTimer();
    }
});

document.getElementById("break-duration").value = 5; // Default value for break duration
document.getElementById("break-duration").addEventListener("change", () => {
    const value = parseInt(document.getElementById("break-duration").value, 10);
    if (isNaN(value) || value <= 0) {
        alert("Break duration must be greater than zero. Resetting to 5 minutes.");
        document.getElementById("break-duration").value = 5;
    }
});
