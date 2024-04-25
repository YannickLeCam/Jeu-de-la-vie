// Constantes
const GRID_SIZE = 30;
const INTERVAL_MS = 100;


// Variables
let grid = createGrid();
let lock_spaming_start=false;
let intervalId;

// Création de la grille de basse avec la génération du code HTML
function createGrid() {
    let gridContainer = document.getElementById("grid-container");
    let newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        let row = [];
        let rowhtml = document.createElement("div");
        rowhtml.className = "grid-row row-" + i; // Ajoutez une classe représentant l'index de la ligne
        gridContainer.appendChild(rowhtml);
        for (let j = 0; j < GRID_SIZE; j++) {
            let cell = document.createElement("div");
            cell.className = "grid-cell";
            cell.addEventListener("click", toggleCell);
            rowhtml.appendChild(cell);
            row.push(false);
        }
        newGrid.push(row);
    }
    return newGrid;
}


// mise en place dans la grille 
function toggleCell(event) {
    let cell = event.target;
    let rowClass = cell.parentNode.classList[1]; // Récupérez la classe représentant l'index de la ligne
    let rowIndex = parseInt(rowClass.split("-")[1]); // Récupérez l'index de la ligne à partir de la classe
    let colIndex = Array.prototype.indexOf.call(cell.parentNode.children, cell);
    console.log(rowIndex,colIndex);
    grid[rowIndex][colIndex] = !grid[rowIndex][colIndex];
    cell.classList.toggle("alive");
}


// Commencement du jeu de la vie selon l'interval fixé en amont
function start() {
    if (!lock_spaming_start) {
        intervalId = setInterval(updateGrid, INTERVAL_MS);
        lock_spaming_start=true
    }else{
        console.log(" Spam detected !"); 
    }

}

// Stop
function stop() {
    clearInterval(intervalId);
    lock_spaming_start=false;
}

// Clear la grille
function clearGrid() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = false; // Mettre à jour le tableau grid pour que toutes les cellules soient mortes
            let rowIndex = i;
            let colIndex = j;
            let rowClass = ".row-" + rowIndex;
            let cell = document.querySelector(rowClass + " .grid-cell:nth-child(" + (colIndex + 1) + ")");
            cell.classList.remove("alive"); // Supprimer la classe "alive" de la cellule
        }
    }
}


// Mise a jour de la grille apres chaque temporalité selon les règle du jeu de la vie
function updateGrid() {
    let newGrid = [];
    for (let i = 0; i < GRID_SIZE; i++) {
        let newRow = [];
        for (let j = 0; j < GRID_SIZE; j++) {
            let neighbors = countAliveNeighbors(i, j);
            if (grid[i][j]) {
                newRow.push(neighbors === 2 || neighbors === 3);
            } else {
                newRow.push(neighbors === 3);
            }
        }
        newGrid.push(newRow);
    }

    // Mettre à jour le tableau grid et la classe CSS des cellules en fonction de newGrid
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            grid[i][j] = newGrid[i][j];
            let rowIndex = i;
            let colIndex = j;
            let rowClass = ".row-" + rowIndex;
            let cell = document.querySelector(rowClass + " .grid-cell:nth-child(" + (colIndex + 1) + ")");
            if (grid[i][j]) {
                cell.classList.add("alive");
            } else {
                cell.classList.remove("alive");
            }
        }
    }
}



// Compte les voisin de la cellule indiqué
function countAliveNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (!(i === 0 && j === 0)) {
                let r = row + i;
                let c = col + j;
                if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE && grid[r][c]) {
                    count++;
                }
            }
        }
    }
    return count;
}
//merci GPT pour un random INT rapide
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

function randomizer() {
    for (let row = 0; row < GRID_SIZE; row++) {
        for (let col = 0; col < GRID_SIZE; col++) {
            let temp=getRandomInt(0,2);
            if (temp==1) {
                grid[row][col]=true;
                let cell = document.querySelector(".row-"+ row + " .grid-cell:nth-child(" + (col + 1) + ")");
                cell.classList.add("alive");
            }else{
                grid[row][col]=false;
                let cell = document.querySelector(".row-"+ row + " .grid-cell:nth-child(" + (col + 1) + ")");
                cell.classList.remove("alive");
            }
        }
    }
}

// Event listeners utiles
document.getElementById("random-button").addEventListener("click", randomizer);
document.getElementById("start-button").addEventListener("click", start);
document.getElementById("stop-button").addEventListener("click", stop);
document.getElementById("clear-button").addEventListener("click", clearGrid);
