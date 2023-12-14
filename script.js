// script.js
let availableNumbers = [];
let diceTotal = 0;
let currentTotal = 0;
let selectedNumbers = new Set();
let playerScore = 0;

document.addEventListener("DOMContentLoaded", function () {
  initializeGame();
});

function initializeGame() {
  resetGame();
}

function noMoreTurns() {
    playerScore += availableNumbers.reduce((a, b) => a + b, 0);
    alert(`No more turns left. Your score is ${playerScore}`);
    updateScoreDisplay(); // Update the score display
    // Consider adding a button or mechanism for the player to start a new game
}

function resetGame() {
  availableNumbers = Array.from({ length: 9 }, (_, i) => i + 1);
  selectedNumbers.clear();
  diceTotal = 0;
  currentTotal = 0;
  updateDiceDisplay();
  updateBoxes();
//   document.getElementById("endTurn").style.display = "none";
document.getElementById("endTurn").disabled = true;
}

function updateScoreDisplay() {
  document.getElementById("playerScore").textContent = `Score: ${playerScore}`;
}

function updateBoxes() {
  const boxNumbers = document.getElementById("boxNumbers");
  boxNumbers.innerHTML = "";
  for (let i = 1; i <= 9; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.textContent = i;
    box.id = "box" + i;
    box.onclick = function () {
      toggleBox(i);
    };
    boxNumbers.appendChild(box);
  }
}

function rollDice() {
    if (availableNumbers.length === 0) {
        alert("Game Over. All boxes are shut!");
        return;
    }

    const dice1 = Math.ceil(Math.random() * 6);
    const dice2 = Math.ceil(Math.random() * 6);
    diceTotal = dice1 + dice2;
    currentTotal = diceTotal; // Set currentTotal to the value of diceTotal at the start of the turn
    updateDiceDisplay(dice1, dice2);
    updateSelectableBoxes();

    // Reset selected numbers and disable the end turn button at the start of each turn
    selectedNumbers.clear();
    document.getElementById("endTurn").disabled = true;
}



function checkForMoves() {
    // Check if there's any number in availableNumbers that can be achieved with the next dice roll.
    // This should be called after a dice roll to evaluate possible moves.
    let maxPossibleDiceTotal = 12; // Maximum possible sum of two dice
    return availableNumbers.some(number => number <= maxPossibleDiceTotal);
}

function updateSelectableBoxes() {
  availableNumbers.forEach((number) => {
    const box = document.getElementById("box" + number);
    if (number <= currentTotal) {
      box.classList.remove("disabled");
    } else {
      box.classList.add("disabled");
    }
  });
}

function toggleBox(number) {
    const box = document.getElementById("box" + number);
    if (!availableNumbers.includes(number) || box.classList.contains("disabled")) {
        return;
    }

    if (selectedNumbers.has(number)) {
        selectedNumbers.delete(number);
        box.classList.remove("selected");
        currentTotal -= number; // Correctly subtract the number from currentTotal
    } else {
        selectedNumbers.add(number);
        box.classList.add("selected");
        currentTotal += number; // Correctly add the number to currentTotal
    }

    // Log for debugging
    console.log("Current Total:", currentTotal, "Dice Total:", diceTotal);

    // Enable the "End Turn" button only if currentTotal matches diceTotal
    document.getElementById("endTurn").disabled = currentTotal !== diceTotal;
    updateSelectableBoxes();
}



function endTurn() {
    // Calculate the sum of the selected numbers
    let selectedSum = Array.from(selectedNumbers).reduce((a, b) => a + b, 0);

    // Check if the sum of selected numbers matches the dice total
    if (selectedSum !== diceTotal) {
        alert("The selected boxes don't sum up to the dice total. Try again!");
        return;
    }

    // Mark selected numbers as closed and remove their ability to be clicked again
    selectedNumbers.forEach((number) => {
        const box = document.getElementById("box" + number);
        box.classList.add("closed");
        box.classList.remove("selected");
        box.onclick = null; // Remove click event listener
        availableNumbers = availableNumbers.filter((n) => n !== number);
    });

    // Clear selected numbers and reset dice and current totals
    selectedNumbers.clear();
    diceTotal = 0;
    currentTotal = 0;
    updateDiceDisplay();
    // document.getElementById("endTurn").style.display = "none";
    document.getElementById("endTurn").disabled = true;
    // Check if all boxes are closed (winning condition)
    if (availableNumbers.length === 0) {
        alert("Congratulations! You've shut all the boxes!");
        playerScore = 0; // Reset the score for a new game
        initializeGame(); // Reset the game after winning
    } else if (!checkForMoves()) {
        // Check if no more moves are possible
        noMoreTurns();
    }
}


function updateDiceDisplay(dice1 = 0, dice2 = 0) {
  document.getElementById("diceResults").textContent =
    dice1 && dice2 ? `Dice: ${dice1}, ${dice2}` : "Roll the Dice";
}

function canMakeMove() {
  return availableNumbers.some((number) => number <= currentTotal);
}
