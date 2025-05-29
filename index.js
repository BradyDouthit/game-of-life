// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const editButton = document.getElementById('editButton');
const playButton = document.getElementById('playButton');

const GRID_SIZE = 10;
const CELL_PADDING = 2;
// You can simply set a grid coordinate to 2 to make that square blue
const STATE_MAPPING = {
	dead: { color: '#3c3c3c', code: 0 },
	living: { color: '#4ec9b0', code: 1 },
	debug: { color: '#569cd6', code: 2 },
}
const squareSize = 30;
let isEditMode = false;
let grid = [];

function drawGrid() {
	const GRID_SIZE = 10; // 10x10 grid
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
	if (!isEditMode) return;

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

function toggleEditMode() {
	isEditMode = !isEditMode;
	editButton.classList.toggle('active');
}

function getCellNeighbors(x, y) {
	let top, right, bottom, left;

	if (x - 1 >= 0) {
		top = grid[x - 1][y]
	}

	if (y >= 0) {
		right = grid[x][y + 1]
	}

	console.log({ x, y, GRID_SIZE, atX: grid[x + 1] })
	if (x + 1 < GRID_SIZE) {
		bottom = grid[x + 1][y];
	}

	if (y < GRID_SIZE) {
		left = grid[x][y - 1];
	}

	return { left, right, top, bottom }
}

function getNumNeighbors(neighbors) {
	const validNeigbors = Object.values(neighbors).filter(neighbor => typeof neighbor === 'number' && neighbor === 1)
	let sum = 0;

	validNeigbors.forEach(neighbor => {
		sum += neighbor
	})

	return sum;
}

function visualizeNeighbors() {
	for (let row = 0; row < GRID_SIZE; row++) {
		for (let col = 0; col < GRID_SIZE; col++) {
			const cell = grid[row][col];
			const neighbors = getCellNeighbors(row, col);
			const numNeighbors = getNumNeighbors(neighbors)



			if (cell === STATE_MAPPING.living.code) {
				//top
				// grid[row - 1][col] = 2
				console.log({ neighbors, numNeighbors })
				grid[row + 1][col] = 2
				if (numNeighbors < 2 || numNeighbors > 4) {
					// Turn a living cell into a dead one
					grid[row][col] = STATE_MAPPING.dead.code;
				}
			}

			if (cell === STATE_MAPPING.dead.code) {
				if (numNeighbors === 3) {
					// Turn a dead cell into a living one
					grid[row][col] = STATE_MAPPING.living.code;
				}
			}

		}
	}

	drawGrid()
}

function handlePlay() {
	visualizeNeighbors()
}

// Event listeners
canvas.addEventListener('click', handleCanvasClick);
editButton.addEventListener('click', toggleEditMode);
playButton.addEventListener('click', handlePlay);

function main() {
	drawGrid();
}

main();

