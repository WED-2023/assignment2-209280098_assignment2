/*****************************************  Preperation and Index.html ******************************************************/
// Function to preload all pages in the background

const globalPreloadedPages = {};
// Arrays to store registered users, emails, and passwords



function preloadPages() {
    const pages = ["login.html", "register.html", "configuration.html", "contact.html"];

    // Fetch all pages in parallel and store the content
    const fetchPromises = pages.map(page =>
        fetch(page)
            .then(response => response.text())
            .then(data => {
                globalPreloadedPages[page] = data;
            })
            .catch(error => console.log("Error loading page:", error))
    );

    // Wait for all fetch calls to finish
    return Promise.all(fetchPromises);
}


function showPage(page) {
    if (globalPreloadedPages[page]) {
        document.getElementById("content").innerHTML = globalPreloadedPages[page];

        // Add event listeners after loading the page content
        if (page === "register.html") {
            const registrationForm = document.getElementById('registration-form');
            if (registrationForm) {
                registrationForm.addEventListener('submit', handleFormSubmission_register);
            }
        }
        if(page === "login.html") {
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', handleFormSubmission_login);
            }
        }
        if(page === "configuration.html") {
            // 100 sec without starting new game --> Logout
            setTimeout(initializeConfiguration, 100);
        }
    } else {
        console.log("Page not loaded yet.");
    }
}
// Listener to Game Start
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage === 'index.html' || currentPage === '') {
        //  index.html
        // Call the function to preload all pages when the index.html is loaded
        preloadPages().then(() => {

            // Set up event listeners to handle button clicks using event delegation
            setupNavigationListeners();


        });
    } else if (currentPage === 'game.html') {
        //  game.html
        loadUserData();
        setupEventListeners();
        initializeGame();
    }
});

function setupNavigationListeners() {
    document.addEventListener('click', function(event) {
        // Register Redirect (from login page to register page)
        if (event.target && event.target.id === 'register-redirect') {
            showPage("register.html");
        }

        // Login Redirect (from register page to login page)
        if (event.target && event.target.id === 'login-redirect') {
            showPage("login.html");
        }

        // Other button actions
        if (event.target && event.target.id === 'login-button') {
            showPage("login.html");
        }

        if (event.target && event.target.id === 'register-button') {
            showPage("register.html");
        }

        if (event.target && event.target.id === 'configuration-button') {
            showPage("configuration.html");
        }
    });

    // Event listener for Contact Redirect
    document.getElementById('contact-link').addEventListener('click', function() {
        showPage("contact.html");
    });
}
/*****************************************  Register.html ******************************************************/
let existingUsernames = ["p"];  // Default username
let existingEmails = ["email@example.com"];  // Default email
let existingPasswords = ["testuser"];  // Default password
function handleFormSubmission_register(event) {
    event.preventDefault();
    console.log("Form submission handler called");

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm-password').value.trim();
    const email = document.getElementById('email').value.trim();
    const birthdate = document.getElementById('birthdate').value;
    const firstname = document.getElementById('first-name').value.trim();
    const lastname = document.getElementById('last-name').value.trim();

    if (firstname === "") {
        alert("First name cannot be empty!");
        return;
    }

    if (lastname === "") {
        alert("Last name cannot be empty!");
        return;
    }

    if (username === ""){
        alert("Username must be a valid username!");
        return;
    }
    if (existingUsernames.includes(username)) {
        alert("Username is already taken. Please try a different username.");
        return;
    }

    if (password === "" || password.length < 8) {
        alert("Password must be at least 8 characters - Includes digits and characters!");
        return;
    }
    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
        alert("Password must contain both letters and numbers!");
        return;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }
    if (email === "") {
        alert("Email cannot be empty!");
        return;
    }
    if (existingEmails.includes(email)) {
        alert("Email already exists. Please log in.");
        return;
    }

    if (!birthdate) {
        alert("Birthdate cannot be empty!");
        return;
    }

    const birthdateObj = new Date(birthdate);
    const today = new Date();
    const age = today.getFullYear() - birthdateObj.getFullYear();
    const month = today.getMonth() - birthdateObj.getMonth();

    if (age < 8 || (age === 8 && month < 0) || (age === 8 && month === 0 && today.getDate() < birthdateObj.getDate())) {
        alert("You must be at least 8 years old to register.");
        return;
    }
    if (birthdateObj > today) {
        alert("Birthdate cannot be in the future.");
        return;
    }

    const isConfirmed = confirm("Please confirm your details:\n\nUsername: " + username + "\nEmail: " + email + "\n\nAre you sure you want to submit? Click OK to confirm, or Cancel to edit.");
    if (isConfirmed) {
        existingUsernames.push(username);
        existingEmails.push(email);
        existingPasswords.push(password);

        const submitButton = document.getElementById('submit-button');
        submitButton.style.background = "linear-gradient(145deg, #4CAF50, #3b9442)";
        submitButton.textContent = "Success! ✅\nPlease log in";
        submitButton.disabled = true;
        submitButton.style.cursor = "default";

        setTimeout(() => {
            document.getElementById('username').value = "";
            document.getElementById('password').value = "";
            document.getElementById('confirm-password').value = "";
            document.getElementById('email').value = "";
            document.getElementById('birthdate').value = "";
            document.getElementById('first-name').value = "";
            document.getElementById('last-name').value = "";

            submitButton.textContent = "Register";
            submitButton.style.background = "";
            submitButton.disabled = false;
            submitButton.style.cursor = "pointer";

        }, 1600);
        showPage("login.html");

    }
}
/*****************************************  Login.html ******************************************************/

function handleFormSubmission_login(event) {
    event.preventDefault();
    console.log("Form submission handler called");
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    const userIndex = existingUsernames.indexOf(username);
    if (userIndex === -1) {
        alert("Username or password incorrect. Please try again.");
        return;
    }

    if (existingPasswords[userIndex] !== password) {
        alert("Username or password incorrect. Please try again.");
        return;
    }

    console.log("Login successful, navigating to configuration page");
    // Saving UserName For Configuration header
    currentUser = username;
    console.log("Login successful, navigating to configuration page");
    showPage("configuration.html");
}

/*****************************************  Configuration.html ******************************************************/
let currentUser = "";
let shipColors = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange", "White", "Black"];
let currentColorIndex = 0;
let selectedFireKey = "";
let gameTimeMinutes = "02"; // Default
let gameTimeSeconds = "00"; // Default
let leaderboardData = [];

function initializeConfiguration() {
    //UserName in Configuration's Header
    if (currentUser) {
        document.getElementById("username-display").textContent = currentUser;
    }

    // Right and Left Events
    document.getElementById("color-left").addEventListener("click", function() {
        changeShipColor(-1);
    });

    document.getElementById("color-right").addEventListener("click", function() {
        changeShipColor(1);
    });

    // Fire-Key Event
    const fireKeyInput = document.getElementById("fire-key");
    fireKeyInput.addEventListener("focus", function() {
        fireKeyInput.value = "Press a key";
        fireKeyInput.style.color = "#888";
    });

    fireKeyInput.addEventListener("keydown", function(event) {
        event.preventDefault(); // מניעת הכנסת התו הרגילה
        selectedFireKey = event.key;
        fireKeyInput.value = getKeyDisplayName(event);
        fireKeyInput.style.color = "#000";
    });

    // Game Timer Events
    const minutesInput = document.getElementById("game-time-minutes");
    const secondsInput = document.getElementById("game-time-seconds");

    minutesInput.addEventListener("blur", function() {
        validateGameTime(minutesInput, "minutes");
    });

    secondsInput.addEventListener("blur", function() {
        validateGameTime(secondsInput, "seconds");
    });

    // Start Game
    document.getElementById("start-new-game").addEventListener("click", function() {
        startNewGame();
    });

    // Leader Boards Event
    document.getElementById("show-leaderboard").addEventListener("click", function() {
        toggleLeaderboard();
    });

    // SpaceShip Color Defaulting
    updateShipColorDisplay();

    // LeaderBoard Defaulting
    initializeLeaderboard();
}

// Fire Key Functions
function getKeyDisplayName(event) {
    const keyMap = {
        " ": "Space",
        "ArrowLeft": "Left Arrow",
        "ArrowRight": "Right Arrow",
        "ArrowUp": "Up Arrow",
        "ArrowDown": "Down Arrow",
        "Control": "Ctrl",
        "Shift": "Shift",
        "Alt": "Alt",
        "Enter": "Enter",
        "Escape": "Esc",
        "Tab": "Tab"
    };

    if (keyMap[event.key]) {
        return keyMap[event.key];
    } else if (event.key.length === 1) {
        return event.key.toUpperCase();
    } else {
        return event.key;
    }
}
// Unlimited Colors loop
function changeShipColor(direction) {
    currentColorIndex = (currentColorIndex + direction + shipColors.length) % shipColors.length;
    updateShipColorDisplay();
}

// Color Update
function updateShipColorDisplay() {
    document.getElementById("selected-color").textContent = shipColors[currentColorIndex];
}


// reggex function for timer validation
function validateGameTime(input, type) {
    let value = input.value.trim();

    // Is it a digit test?
    if (!/^\d*$/.test(value)) {
        value = type === "minutes" ? "02" : "00";
    }

    // start with zero
    if (value.length === 1) {
        value = "0" + value;
    } else if (value.length === 0) {
        value = type === "minutes" ? "02" : "00";
    }

    // validation - at least 2 min
    if (type === "minutes") {
        const minutes = parseInt(value);
        if (minutes < 2) {
            value = "02";
        }
        gameTimeMinutes = value;
    } else { // seconds
        const seconds = parseInt(value);
        if (seconds > 59) {
            value = "59";
        }
        gameTimeSeconds = value;
    }

    input.value = value;
}

function startNewGame() {

    if (!validateAllFields()) {
        alert("Please fill in all required fields");
        return;
    }
    //
    const userConfirmed = confirm(
        "The game will start with the following settings:\n" +
        "User Name: " + currentUser + "\n" +
        "Fire Key: " + selectedFireKey + "\n" +
        "Total Time: " + gameTimeMinutes + ":" + gameTimeSeconds + "\n" +
        "Space-Ship Color: " + shipColors[currentColorIndex] + "\n" +
        "Press Ok to Start New Game or Cancel"
    );

    if (userConfirmed) {
        // Save User Data
        saveCurrentUserData();
        // Move to Game Window
        window.location.href = "game.html";



    }
}
function validateAllFields() {
    if (selectedFireKey === "") {
        document.getElementById("fire-key").focus();
        return false;
    }

    const minutesInput = document.getElementById("game-time-minutes");
    const secondsInput = document.getElementById("game-time-seconds");

    if (!minutesInput.value || !secondsInput.value) {
        return false;
    }

    return true;
}

function toggleLeaderboard() {
    const leaderboardSection = document.getElementById("leaderboard-section");
    const currentDisplay = leaderboardSection.style.display;

    if (currentDisplay === "none" || currentDisplay === "") {
        leaderboardSection.style.display = "block";
    } else {
        leaderboardSection.style.display = "none";
    }
}


function initializeLeaderboard() {

    leaderboardData = [
        { rank: 1, player: "Lidor", score: 1000 },
        { rank: 2, player: "Lidor", score: 900 },
        { rank: 3, player: "Lidor", score: 800 },
        { rank: 4, player: "Lidor", score: 700 },
        { rank: 5, player: "Lidor", score: 600 },
        { rank: 6, player: "Lidor", score: 500 },
        { rank: 7, player: "Lidor", score: 400 },
        { rank: 8, player: "Not Lidor", score: 15 },
        { rank: 9, player: "Not Lidor", score: 14 },
        { rank: 10, player: "Not Lidor", score: 13 }
    ];


    updateLeaderboardDisplay();
}

function updateLeaderboardDisplay() {
    const leaderboardTable = document.getElementById("leaderboard-table");

    while (leaderboardTable.rows.length > 1) {
        leaderboardTable.deleteRow(1);
    }

    leaderboardData.forEach(entry => {
        const row = leaderboardTable.insertRow();

        const rankCell = row.insertCell();
        rankCell.textContent = entry.rank;

        const playerCell = row.insertCell();
        playerCell.textContent = entry.player;

        const scoreCell = row.insertCell();
        scoreCell.textContent = entry.score;
    });
}


// Current Setting Saving
function saveCurrentUserData() {
    const userData = {
        username: currentUser,
        fireKey: selectedFireKey,
        gameTimeMinutes: gameTimeMinutes,
        gameTimeSeconds: gameTimeSeconds,
        shipColor: shipColors[currentColorIndex]
    };

    // Forwarding the data to the game
    localStorage.setItem("spaceGameUserData", JSON.stringify(userData));
}

/*****************************************  game.html ******************************************************/
let playerUsername;
let playerShipColor;
let fireKey;
let gameTime;
let gameScore = 0;
let gameLives = 3;
let gameActive = false;
let gamePaused = false;
let gameTimer;
let totalSeconds;



// load all user data from local storage (saveCurrentUserData function)
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem("spaceGameUserData"));

    if (userData) {
        playerUsername = userData.username;
        playerShipColor = userData.shipColor;
        fireKey = userData.fireKey;

        // Timer By Second Converter
        const minutes = parseInt(userData.gameTimeMinutes);
        const seconds = parseInt(userData.gameTimeSeconds);
        totalSeconds = minutes * 60 + seconds;

        // Second Timer
        document.getElementById("player-username").textContent = playerUsername;
        updateTimer(totalSeconds);
    } else {
        // For debug only
        alert("There are no user data");
        window.location.href = "index.html";
    }
}

function setupEventListeners() {
    // Menu Listener
    document.getElementById("menu-button").addEventListener("click", togglePauseMenu);

    // Resume and Exit Listeners
    document.getElementById("resume-button").addEventListener("click", resumeGame);
    document.getElementById("exit-button").addEventListener("click", confirmExit);

    // Exit Validation Listeners
    document.getElementById("confirm-exit-yes").addEventListener("click", exitToConfiguration);
    document.getElementById("confirm-exit-no").addEventListener("click", closeExitConfirm);

    // Back to new game listener
    document.getElementById("back-to-config").addEventListener("click", function() {
        window.location.href = "index.html";
    });

    // Fire & Move Listeners
    window.addEventListener("keydown", handleKeyPress);
}

// Game Initialization
function initializeGame() {
    // Create Enemies
    createEnemyShips();

    // user Player
    createPlayerShip();

    // Second Timer Start
    startGameTimer();

    //
    gameActive = true;

    // StartGame - Enemies start to moving
    startEnemyMovement();
}


// Creating 4 rows of 5 enemies each
function createEnemyShips() {
    const container = document.getElementById("enemy-ships-container");


    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 5; col++) {
            const enemyShip = document.createElement("div");
            enemyShip.className = "enemy-ship";
            enemyShip.dataset.row = row;
            enemyShip.dataset.col = col;

            // enemy start location
            enemyShip.style.top = (row * 60) + "px";
            enemyShip.style.left = (col * 80) + "px";

            container.appendChild(enemyShip);
        }
    }
}



// User Player Starship Creation
function createPlayerShip() {
    const playerShip = document.getElementById("player-ship");
    playerShip.style.backgroundColor = playerShipColor.toLowerCase();

    // User Starship start Location
    playerShip.style.bottom = "20px";
    playerShip.style.left = "calc(50% - 25px)";
}

// Enemies moves
function startEnemyMovement() {
    const enemyContainer = document.getElementById("enemy-ships-container");
    const enemies = document.querySelectorAll(".enemy-ship");

    let direction = 1; // 1 - right, -1 left
    let speedFactor = 1;
    let accelerationCount = 0;
    let moveDistance = 2;

    // Acceleration every 5 seconds
    setInterval(function() {
        if (!gameActive || gamePaused) return;

        if (accelerationCount < 4) { // Maximum 4 Accelerations
            speedFactor += 1.25;
            accelerationCount++;
        }
    }, 5000);

    // enemies moves
    const moveEnemies = setInterval(function() {
        if (!gameActive || gamePaused) return;

        const enemyContainerRect = enemyContainer.getBoundingClientRect();
        let hitEdge = false;

        // check if hit
        enemies.forEach(enemy => {
            if (enemy.style.display !== "none") {
                const enemyLeft = parseInt(enemy.style.left) || 0;
                if ((direction === 1 && enemyLeft + enemy.offsetWidth + moveDistance * speedFactor > enemyContainer.offsetWidth) ||
                    (direction === -1 && enemyLeft - moveDistance * speedFactor < 0)) {
                    hitEdge = true;
                }
            }
        });

        // redirection if hitted
        if (hitEdge) {
            direction *= -1;
            // enemies Scroll Down
            enemies.forEach(enemy => {
                if (enemy.style.display !== "none") {
                    const enemyTop = parseInt(enemy.style.top) || 0;
                    enemy.style.top = (enemyTop + 20) + "px";
                }
            });
        }

        // Keep Moving
        enemies.forEach(enemy => {
            if (enemy.style.display !== "none") {
                const enemyLeft = parseInt(enemy.style.left) || 0;
                enemy.style.left = (enemyLeft + moveDistance * direction * speedFactor) + "px";
            }
        });

        // Stop the Friendly Fire of Enemies
        enemies.forEach(enemy => {
            if (enemy.style.display !== "none") {
                const enemyTop = parseInt(enemy.style.top) || 0;
                if (enemyTop + enemy.offsetHeight > enemyContainer.offsetHeight - 60) {
                    endGame("livesLost");
                    clearInterval(moveEnemies);
                }
            }
        });

    }, 50);

    // Start Enemy Shooting
    startEnemyShooting(speedFactor);
}
// enemy shooting
function startEnemyShooting(speedFactor) {
    setInterval(function() {
        if (!gameActive || gamePaused) return;

        const activeEnemies = document.querySelectorAll(".enemy-ship");
        const activeEnemiesArray = Array.from(activeEnemies).filter(enemy => enemy.style.display !== "none");

        if (activeEnemiesArray.length === 0) return;

        // random enemy to fire
        const randomEnemy = activeEnemiesArray[Math.floor(Math.random() * activeEnemiesArray.length)];

        // no more 1 bullet in a 3/4 screen
        const projectiles = document.querySelectorAll(".enemy-projectile");
        let canShoot = true;

        projectiles.forEach(projectile => {
            const projectileBottom = document.getElementById("game-area").clientHeight - projectile.getBoundingClientRect().bottom;
            if (projectileBottom < document.getElementById("game-area").clientHeight * 0.75) {
                canShoot = false;
            }
        });

        if (canShoot) {
            enemyShoot(randomEnemy, speedFactor);
        }

    }, 1000); //return every sec
}

function enemyShoot(enemy, speedFactor) {
    const projectilesContainer = document.getElementById("projectiles-container");
    const projectile = document.createElement("div");
    projectile.className = "enemy-projectile";

    const enemyRect = enemy.getBoundingClientRect();
    const containerRect = projectilesContainer.getBoundingClientRect();

    projectile.style.left = (enemyRect.left - containerRect.left + enemyRect.width / 2 - 2) + "px";
    projectile.style.top = (enemyRect.top - containerRect.top + enemyRect.height) + "px";

    projectilesContainer.appendChild(projectile);

    // bullet moving
    moveEnemyProjectile(projectile, speedFactor);
}

// Start Seconds Timer
function startGameTimer() {
    let seconds = totalSeconds;

    gameTimer = setInterval(function() {
        if (!gamePaused) {
            seconds--;

            if (seconds <= 0) {
                endGame("timeUp");
                return;
            }

            updateTimer(seconds);
        }
    }, 1000);
}

// enemy bullet moving
function moveEnemyProjectile(projectile, speedFactor) {
    const speed = 3 * speedFactor;
    let top = parseInt(projectile.style.top) || 0;

    const movement = setInterval(function() {
        if (!gameActive || gamePaused) return;

        top += speed;
        projectile.style.top = top + "px";

        // check if user hitted
        checkPlayerHit(projectile);

        // delete bullets that miss
        if (top > document.getElementById("game-area").clientHeight) {
            clearInterval(movement);
            projectile.remove();
        }
    }, 20);
}

// check if user hitted
function checkPlayerHit(projectile) {
    const playerShip = document.getElementById("player-ship");
    const playerRect = playerShip.getBoundingClientRect();
    const projectileRect = projectile.getBoundingClientRect();

    if (
        projectileRect.left < playerRect.right &&
        projectileRect.right > playerRect.left &&
        projectileRect.top < playerRect.bottom &&
        projectileRect.bottom > playerRect.top
    ) {
        // Hitted !!!
        projectile.remove();
        gameLives--;
        document.getElementById("game-lives").textContent = gameLives;

        // Hitted animation
        playerShip.classList.add("hit");
        setTimeout(() => {
            playerShip.classList.remove("hit");
        }, 500);

        // Back to Start
        playerShip.style.left = "calc(50% - 25px)";
        playerShip.style.bottom = "20px";

        // dead !!
        if (gameLives <= 0) {
            endGame("livesLost");
        }
    }
}

// check if enemy down
function checkHits(projectile) {
    const enemies = document.querySelectorAll(".enemy-ship");
    const projectileRect = projectile.getBoundingClientRect();

    enemies.forEach(enemy => {
        if (enemy.style.display === "none") return;

        const enemyRect = enemy.getBoundingClientRect();

        if (
            projectileRect.left < enemyRect.right &&
            projectileRect.right > enemyRect.left &&
            projectileRect.top < enemyRect.bottom &&
            projectileRect.bottom > enemyRect.top
        ) {
            // enemy down
            enemy.style.display = "none";
            projectile.remove();

            // points summerize
            const row = parseInt(enemy.dataset.row);
            let points = 0;

            switch(row) {
                case 0: points = 20; break; // upper line
                case 1: points = 15; break;
                case 2: points = 10; break;
                case 3: points = 5; break;  // bottom line
            }

            // points update
            gameScore += points;
            document.getElementById("game-score").textContent = gameScore;

            // Winner ?
            const remainingEnemies = document.querySelectorAll(".enemy-ship:not([style*='display: none'])");
            if (remainingEnemies.length === 0) {
                endGame("victory");
            }

            return;
        }
    });
}

// Timer Updater
function updateTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedTime =
        (minutes < 10 ? "0" : "") + minutes + ":" +
        (remainingSeconds < 10 ? "0" : "") + remainingSeconds;

    document.getElementById("game-timer").textContent = formattedTime;
}


// Keys Handler
function handleKeyPress(event) {
    if (!gameActive || gamePaused) return;

    const playerShip = document.getElementById("player-ship");
    const gameArea = document.getElementById("game-area");
    const currentLeft = parseInt(playerShip.style.left) || gameArea.clientWidth / 2 - 25;
    const currentBottom = parseInt(playerShip.style.bottom) || 20;

    const maxForward = gameArea.clientHeight * 0.4; // 40% of the screen
    const shipWidth = playerShip.clientWidth;
    const maxLeft = gameArea.clientWidth - shipWidth - 10;

    let moveLeft = false;
    let moveRight = false;
    let moveForward = false;
    let moveBackward = false;

    // keys interval
    switch(event.key) {
        case "ArrowLeft":
            moveLeft = true;
            break;
        case "ArrowRight":
            moveRight = true;
            break;
        case "ArrowUp":
            moveForward = true;
            break;
        case "ArrowDown":
            moveBackward = true;
            break;
        case fireKey:
            playerShoot();
            break;
    }

    // left moving
    if (moveLeft && currentLeft > 10) {
        playerShip.style.left = (currentLeft - 10) + "px";
    }

    // right moving
    if (moveRight && currentLeft < maxLeft) {
        playerShip.style.left = (currentLeft + 10) + "px";
    }

    // forward
    if (moveForward && currentBottom < maxForward) {
        playerShip.style.bottom = (currentBottom + 10) + "px";
    }

    // backward
    if (moveBackward && currentBottom > 20) {
        playerShip.style.bottom = (currentBottom - 10) + "px";
    }
}

//  shooting creation
function playerShoot() {
    const playerShip = document.getElementById("player-ship");
    const projectilesContainer = document.getElementById("projectiles-container");

// new shooting creation
    const projectile = document.createElement("div");
    projectile.className = "player-projectile";

    // shooting start Location
    const shipRect = playerShip.getBoundingClientRect();
    const containerRect = projectilesContainer.getBoundingClientRect();

    projectile.style.left = (shipRect.left - containerRect.left + shipRect.width / 2 - 2) + "px";
    projectile.style.bottom = "50px";

    projectilesContainer.appendChild(projectile);

    // Shooting Moving Forward
    moveProjectile(projectile);
}

// Shooting Moving Forward
function moveProjectile(projectile) {
    const speed = 5;
    let bottom = parseInt(projectile.style.bottom);

    const movement = setInterval(function() {
        if (!gameActive || gamePaused) return;

        bottom += speed;
        projectile.style.bottom = bottom + "px";

        // check if enemy down
        checkHits(projectile);

        // check missing shoot
        if (bottom > document.getElementById("game-area").clientHeight) {
            clearInterval(movement);
            projectile.remove();
        }
    }, 20);
}




// pauseMenu
function togglePauseMenu() {
    const pauseMenu = document.getElementById("pause-menu");

    if (pauseMenu.classList.contains("hidden")) {
        // show the menu
        pauseMenu.classList.remove("hidden");
        gamePaused = true;
    } else {
        //return to game
        pauseMenu.classList.add("hidden");
        resumeGame();
    }
}


// game resume
function resumeGame() {
    document.getElementById("pause-menu").classList.add("hidden");

    // countdown 3--> 2 --> 1 --> re-game
    const countdownOverlay = document.getElementById("countdown-overlay");
    const countdownElement = document.getElementById("countdown");
    let count = 3;

    countdownOverlay.classList.remove("hidden");
    countdownElement.textContent = count;

    const countdown = setInterval(function() {
        count--;

        if (count > 0) {
            countdownElement.textContent = count;
        } else {
            clearInterval(countdown);
            countdownOverlay.classList.add("hidden");
            gamePaused = false;
        }
    }, 1000);
}

// Exit approval
function confirmExit() {
    document.getElementById("pause-menu").classList.add("hidden");
    document.getElementById("exit-confirm").classList.remove("hidden");
}

function closeExitConfirm() {
    document.getElementById("exit-confirm").classList.add("hidden");
    document.getElementById("pause-menu").classList.remove("hidden");
}

// back to configuration
function exitToConfiguration() {
    window.location.href = "index.html";
}


// game ending
function endGame(reason) {
    // timer stop
    clearInterval(gameTimer);


    gameActive = false;

    // Final Results
    const gameEndScreen = document.getElementById("game-end");
    const gameResult = document.getElementById("game-result");
    const gameStatus = document.getElementById("game-status");
    const finalScore = document.getElementById("final-score-value");

    finalScore.textContent = gameScore;

    switch(reason) {
        case "timeUp":
            if (finalScore<100){
                gameResult.textContent = "You can do better!";
            }
            else{
                gameResult.textContent = "Winner";
            }

            break;

        case "livesLost":
            gameResult.textContent = "You Lost!";
            break;

        case "victory":
            gameResult.textContent = "Champion!";
            break;
    }

    gameEndScreen.classList.remove("hidden");

    updateLeaderboard(playerUsername, gameScore);
}

// Leader Board Update
function updateLeaderboard(username, score) {
    // load current data
    let leaderboardData = JSON.parse(localStorage.getItem("leaderboardData")) || [];

    // pushing
    leaderboardData.push({
        player: username,
        score: score
    });

    // sorting
    leaderboardData.sort((a, b) => b.score - a.score);

    // Only 10 best
    leaderboardData = leaderboardData.slice(0, 10);

    // updating
    for (let i = 0; i < leaderboardData.length; i++) {
        leaderboardData[i].rank = i + 1;
    }

    // saving
    localStorage.setItem("leaderboardData", JSON.stringify(leaderboardData));
}

/*****************************************  about.html ******************************************************/

const aboutModal = document.getElementById('about-modal');
const closeAboutBtn = document.getElementById('close-about');

function openAbout() {
    aboutModal.showModal();
    if (gameRunning && isPaused) {
        pauseGame();
    }
}

function closeAbout() {
    aboutModal.close();
    if (gameRunning && isPaused) {
        pauseGame(); // this will toggle it back to playing
    }
}

// Close when clicking X button
closeAboutBtn.addEventListener('click', closeAbout);

// Close when clicking outside the modal
aboutModal.addEventListener('click', (e) => {
    const rect = aboutModal.getBoundingClientRect();
    if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
    ) {
        closeAbout();
    }
});
