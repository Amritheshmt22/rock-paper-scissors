const STORAGE_KEY = "rps-game-state";
const CHOICES = ["rock", "paper", "scissors"];
const EMOJI = { rock: "🪨", paper: "✋", scissors: "✌️" };
const BEATS = { rock: "scissors", paper: "rock", scissors: "paper" };
const WIN_TEXT = {
  rock: "Rock crushes scissors",
  paper: "Paper covers rock",
  scissors: "Scissors cut paper"
};

const playerScore = document.getElementById("playerScore");
const computerScore = document.getElementById("computerScore");
const drawScore = document.getElementById("drawScore");
const playerHand = document.getElementById("playerHand");
const computerHand = document.getElementById("computerHand");
const resultText = document.getElementById("resultText");
const roundCount = document.getElementById("roundCount");
const historyList = document.getElementById("historyList");
const resetButton = document.getElementById("resetButton");
const choiceButtons = Array.from(document.querySelectorAll(".choice-button"));

let state = {
  player: 0,
  computer: 0,
  draws: 0,
  rounds: []
};

let forcedComputerChoice = null;

function randomComputerChoice() {
  if (forcedComputerChoice) {
    const choice = forcedComputerChoice;
    forcedComputerChoice = null;
    return choice;
  }
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function decide(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) return "draw";
  return BEATS[playerChoice] === computerChoice ? "win" : "lose";
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function renderHistory() {
  historyList.innerHTML = "";
  if (state.rounds.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty-note";
    empty.textContent = "No rounds yet. Your last ten rounds will appear here.";
    historyList.appendChild(empty);
  } else {
    state.rounds.slice(0, 10).forEach((round) => {
      const item = document.createElement("li");
      const label = round.result === "win" ? "You won" : round.result === "lose" ? "Computer won" : "Draw";
      item.innerHTML = `<strong>${label}</strong> - you chose ${round.player}, computer chose ${round.computer}`;
      historyList.appendChild(item);
    });
  }
  const total = state.player + state.computer + state.draws;
  roundCount.textContent = `${total} round${total === 1 ? "" : "s"} played`;
}

function renderScores() {
  playerScore.textContent = String(state.player);
  computerScore.textContent = String(state.computer);
  drawScore.textContent = String(state.draws);
}

function play(playerChoice) {
  if (!CHOICES.includes(playerChoice)) return null;
  const computerChoice = randomComputerChoice();
  const result = decide(playerChoice, computerChoice);

  playerHand.textContent = EMOJI[playerChoice];
  computerHand.textContent = EMOJI[computerChoice];

  choiceButtons.forEach((button) => {
    button.classList.toggle("selected", button.dataset.choice === playerChoice);
  });

  resultText.classList.remove("win", "lose", "draw");
  if (result === "win") {
    state.player += 1;
    resultText.textContent = `You win! ${WIN_TEXT[playerChoice]}.`;
    resultText.classList.add("win");
  } else if (result === "lose") {
    state.computer += 1;
    resultText.textContent = `Computer wins. ${WIN_TEXT[computerChoice]}.`;
    resultText.classList.add("lose");
  } else {
    state.draws += 1;
    resultText.textContent = `Draw - you both chose ${playerChoice}.`;
    resultText.classList.add("draw");
  }

  state.rounds.unshift({ player: playerChoice, computer: computerChoice, result });
  state.rounds = state.rounds.slice(0, 10);

  renderScores();
  renderHistory();
  saveState();
  return result;
}

function resetGame() {
  state = { player: 0, computer: 0, draws: 0, rounds: [] };
  playerHand.textContent = "?";
  computerHand.textContent = "?";
  resultText.textContent = "Make your move to start the game.";
  resultText.classList.remove("win", "lose", "draw");
  choiceButtons.forEach((button) => button.classList.remove("selected"));
  renderScores();
  renderHistory();
  saveState();
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved) {
      state = {
        player: Number(saved.player) || 0,
        computer: Number(saved.computer) || 0,
        draws: Number(saved.draws) || 0,
        rounds: Array.isArray(saved.rounds) ? saved.rounds.slice(0, 10) : []
      };
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  renderScores();
  renderHistory();
}

choiceButtons.forEach((button) => {
  button.addEventListener("click", () => play(button.dataset.choice));
});

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLInputElement) return;
  const key = event.key.toLowerCase();
  if (key === "r") play("rock");
  if (key === "p") play("paper");
  if (key === "s") play("scissors");
});

resetButton.addEventListener("click", resetGame);

window.rpsGame = {
  play,
  reset: resetGame,
  decide,
  setNextComputerChoice(choice) {
    if (CHOICES.includes(choice)) forcedComputerChoice = choice;
  },
  getState() {
    return {
      ...state,
      resultText: resultText.textContent,
      playerHand: playerHand.textContent,
      computerHand: computerHand.textContent,
      roundCountText: roundCount.textContent
    };
  }
};

loadState();
