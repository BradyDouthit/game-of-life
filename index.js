// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const playButton = document.getElementById('playButton');
const stopButton = document.getElementById('stopButton');

const GRID_SIZE = 20;
const CELL_PADDING = 2;
// You can simply set a grid coordinate to 2 to make that square blue
const STATE_MAPPING = {
	dead: { color: '#3c3c3c', code: 0 },
	living: { color: '#4ec9b0', code: 1 },
	debug: { color: '#569cd6', code: 2 },
}
const squareSize = 30;
let grid = [];
let gameInterval = null;

function drawGrid() {
	const CELL_PADDING = 2;       // 2px gap between squares
	const squareSize = 30; // Size of each individual square (e.g., 30px)

	const canvasWidth = (GRID_SIZE * squareSize) + ((GRID_SIZE - 1) * CELL_PADDING);
	const canvasHeight = (GRID_SIZE * squareSize) + ((GRID_SIZE - 1) * CELL_PADDING);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	// Initialize grid if not already done
	if (grid.length === 0) {
		grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
	}

	// Draw the grid
	for (let row = 0; row < GRID_SIZE; row++) {
		for (let col = 0; col < GRID_SIZE; col++) {
			const x = col * (squareSize + CELL_PADDING);
			const y = row * (squareSize + CELL_PADDING);

			let color = STATE_MAPPING.living.color;
			const cell = grid[row][col];

			if (cell === STATE_MAPPING.living.code) {
				color = STATE_MAPPING.living.color;
			}

			if (cell === STATE_MAPPING.dead.code) {
				color = STATE_MAPPING.dead.color;
			}

			if (cell === STATE_MAPPING.debug.code) {
				color = STATE_MAPPING.debug.color;
			}
			ctx.fillStyle = color;
			ctx.fillRect(x, y, squareSize, squareSize);
		}
	}
}

function getGridPosition(x, y) {
	const col = Math.floor(x / (squareSize + CELL_PADDING));
	const row = Math.floor(y / (squareSize + CELL_PADDING));

	if (row >= 0 && row < GRID_SIZE && col >= 0 && col < GRID_SIZE) {
		return { row, col };
	}

	return null;
}

function handleCanvasClick(event) {
	const rect = canvas.getBoundingClientRect();
	const x = event.clientX - rect.left;
	const y = event.clientY - rect.top;

	const position = getGridPosition(x, y);
	if (position) {
		const cell = grid[position.row][position.col]

		if (cell === STATE_MAPPING.living.code) {
			grid[position.row][position.col] = STATE_MAPPING.dead.code;
		} else if (cell === STATE_MAPPING.dead.code) {
			grid[position.row][position.col] = STATE_MAPPING.living.code;
		}

		drawGrid();
	}
}

function getCellNeighbors(x, y) {
	let top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft;

	if (x - 1 >= 0) {
		top = grid[x - 1][y]
	}

	if (x + 1 < GRID_SIZE && y - 1 >= 0) {
		topRight = grid[x + 1][y - 1]
	}

	if (y + 1 < GRID_SIZE) {
		right = grid[x][y + 1]
	}

	if (x + 1 < GRID_SIZE && y + 1 < GRID_SIZE) {
		bottomRight = grid[x + 1][y + 1]
	}

	if (x + 1 < GRID_SIZE) {
		bottom = grid[x + 1][y];
	}


	if (x - 1 >= 0 && y + 1 < GRID_SIZE) {
		bottomLeft = grid[x - 1][y + 1]
	}


	if (y - 1 >= 0) {
		left = grid[x][y - 1];
	}

	if (x - 1 >= 0 && y - 1 >= 0) {
		topLeft = grid[x - 1][y - 1]
	}


	return { top, topRight, right, bottomRight, bottom, bottomLeft, left, topLeft }
}

function getNumNeighbors(neighbors) {
	return Object.values(neighbors).filter(neighbor => neighbor === STATE_MAPPING.living.code).length;
}

function getNextGeneration() {
	console.time("Getting next generation")
	// Create a temporary grid to store the next state
	const nextGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(STATE_MAPPING.dead.code));

	for (let row = 0; row < GRID_SIZE; row++) {
		for (let col = 0; col < GRID_SIZE; col++) {
			const cell = grid[row][col];
			const neighbors = getCellNeighbors(row, col, cell);
			const numNeighbors = getNumNeighbors(neighbors);


			if (cell === STATE_MAPPING.living.code) {
				// Any live cell with fewer than two live neighbors dies (underpopulation)
				// Any live cell with more than three live neighbors dies (overpopulation)
				if (numNeighbors < 2 || numNeighbors > 3) {
					nextGrid[row][col] = STATE_MAPPING.dead.code;
				} else {
					nextGrid[row][col] = STATE_MAPPING.living.code;
				}
			} else if (cell === STATE_MAPPING.dead.code) {
				// Any dead cell with exactly three live neighbors becomes a live cell (reproduction)
				if (numNeighbors === 3) {
					nextGrid[row][col] = STATE_MAPPING.living.code;
				} else {
					nextGrid[row][col] = STATE_MAPPING.dead.code;
				}
			}
		}
	}

	// Update the grid with the new state
	grid = nextGrid;
	console.timeEnd("Getting next generation")
}

function handlePlay() {
	// Clear any existing interval to prevent multiple intervals
	if (gameInterval) {
		clearInterval(gameInterval);
	}
	
	// Update button states
	playButton.classList.add('active');
	stopButton.classList.remove('active');
	
	getNextGeneration();
	drawGrid();

	gameInterval = setInterval(() => {
		getNextGeneration();
		drawGrid();
	}, 100);
}

function handleStop() {
	if (gameInterval) {
		clearInterval(gameInterval);
		gameInterval = null;
	}
	
	// Update button states
	playButton.classList.remove('active');
	stopButton.classList.remove('active');
}

// Event listeners
canvas.addEventListener('click', handleCanvasClick);
playButton.addEventListener('click', handlePlay);
stopButton.addEventListener('click', handleStop);

function main() {
	drawGrid();
}

main();

