// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const editButton = document.getElementById('editButton');
const playButton = document.getElementById('playButton');

const GRID_SIZE = 10;
const CELL_PADDING = 2;
const COLOR_MAPPING = {
	dead: { color: 'black', code: 0 },
	living: { color: 'red', code: 1 },
	debug: { color: 'blue', code: 2 },
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

			let color = COLOR_MAPPING.living.color;
			const cell = grid[row][col];

			if (cell === COLOR_MAPPING.living.code) {
				color = COLOR_MAPPING.living.color;
			}

			if (cell === COLOR_MAPPING.dead.code) {
				color = COLOR_MAPPING.dead.color;
			}

			if (cell === COLOR_MAPPING.debug.code) {
				color = COLOR_MAPPING.debug.color;
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
		if (cell === COLOR_MAPPING.living.code) {
			grid[position.row][position.col] = COLOR_MAPPING.dead.code;
		} else if (cell === COLOR_MAPPING.dead.code) {
			grid[position.row][position.col] = COLOR_MAPPING.living.code;
		}
		drawGrid();
	}
}

function toggleEditMode() {
	isEditMode = !isEditMode;
	editButton.classList.toggle('active');
}

function visualizeNeighbors() {
	for (let row = 0; row < GRID_SIZE; row++) {
		for (let col = 0; col < GRID_SIZE; col++) {
			const cell = grid[row][col];
			if (!cell) continue;

		}
	}
}

function handlePlay() {
	console.log("Visualizing", grid);
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

