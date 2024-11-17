const card = document.getElementById("startCard");
const turnCard = document.getElementById("turn");
const currentWord = document.getElementById("currentWord");
const countDown = document.getElementById("countDown");
const displayPlayerLives = document.getElementById("playerLives");
const displayAILives = document.getElementById("aiLives");
let usedWords = document.getElementById("usedWords");
const apiKey = "API_KEY";
const apiUrl = "https://random-word-api.p.rapidapi.com/S/";
let playerLives = 5, aiLives = 5, turn = 1, roundCount = 1;
let timer, wordEnding;

function endRound(message) {
    if (turn % 2) {
        alert(message + ", you lost this round");
        --playerLives;
        updateLivesDisplay(displayPlayerLives, playerLives);
    } else {
        alert(message + ", I lost this round");
        --aiLives;
        updateLivesDisplay(displayAILives, aiLives);
    }
    if (playerLives > 0 && aiLives > 0) {
        resetGame();
    }
}

function updateLivesDisplay(element, noLives) {
    element.innerText = noLives;
    if (noLives === 0) {
        clearInterval(timer);
        gameOver(turn % 2 ? "You Lost" : "You Won");
    }
}

function resetGame() {
    resetTimer();
    currentWord.innerText = "";
    usedWords.innerHTML = "";
    turn = 1;
    ++roundCount;
    wordEnding = "";
    currentWord.innerText = "Round " + roundCount;
    turnCard.innerText = "Type a word to start the game!";
}

function gameOver(message) {
    clearInterval(timer);
    turnCard.innerText = "Game Over!!!" + message;
    const restartButton = document.createElement("button");
    restartButton.setAttribute("onclick", "window.location.reload()");
    turnCard.appendChild(restartButton);
}

async function aiTurn() {
    const options = {
        method: "GET",
        url: apiUrl + wordEnding,
        headers: {
            "x-rapidapi-key": apiKey,
            "x-rapidapi-host": "random-word-api.p.rapidapi.com"
        }
    };
    try {
        const response = await axios.request(options);
        console.log(response.data);
        const validWord = response.data.word;
        if (checkWord(validWord)) {
            wordEnding = validWord.slice(-2);
            updateTurn(validWord, wordEnding);
        } else {
            endRound("Incorrect word");
        }
    } catch (error) {
        console.error("Error fetching words for AI:", error);
        endRound("Incorrect word");
    }
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

function updateUsedWords(word) {
    usedWords.innerHTML += word + " ";
}

function updateTurn(word, ending) {
    currentWord.innerText = word;
    updateUsedWords(word);
    resetTimer();
    ++turn;
    if (turn % 2) {
        turnCard.innerText = "Your turn! Type a word that start with " + ending;
    } else {
        turnCard.innerText = "Alright, my turn! A word that begins with " + ending;
    }
}

function checkWord(word) {
    return word.length > 2 && !usedWords.innerHTML.includes(word)
        && wordEnding === word.substring(0, 2);
}

function getWord() {
    const word = document.getElementById("word").value.toLowerCase();
    document.getElementById("word").value = "";
    if (turn === 1) {
        wordEnding = word.substring(0, 2);
        if (checkWord(word)) {
            wordEnding = word.slice(-2);
            updateTurn(word, wordEnding);
            aiTurn();
        } else {
            endRound("Incorrect word");
        }
    } else {
        if (checkWord(word)) {
            wordEnding = word.slice(-2);
            updateTurn(word, wordEnding);
            aiTurn();
        } else {
            endRound("Incorrect word");
        }
    }
}

function startTimer() {
    let timeLeft = 10;
    countDown.innerText = timeLeft;
    timer = setInterval(() => {
        --timeLeft;
        countDown.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endRound("Time is up");
        }
    }, 1000);
}

function startGame() {
    card.remove();
    document.getElementById("inputGroup").setAttribute("style", "");
    displayPlayerLives.innerText = playerLives;
    displayAILives.innerText = aiLives;
    currentWord.innerText = "Round " + roundCount;
    turnCard.innerText = "Type a word to start the game!"
    startTimer();
}