// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");
const editButton = document.getElementById('editButton');
const playButton = document.getElementById('playButton');

const deadColor = 'black';
const livingColor = 'red';

let isEditMode = false;
let grid = [];

function drawGrid() {
	const gridSize = 10; // 10x10 grid
	const gap = 2;       // 2px gap between squares
	const squareSize = 30; // Size of each individual square (e.g., 30px)

	const canvasWidth = (gridSize * squareSize) + ((gridSize - 1) * gap);
	const canvasHeight = (gridSize * squareSize) + ((gridSize - 1) * gap);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	// Initialize grid if not already done
	if (grid.length === 0) {
		grid = Array(gridSize).fill().map(() => Array(gridSize).fill(false));
	}

	// Draw the grid
	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const x = col * (squareSize + gap);
			const y = row * (squareSize + gap);

			ctx.fillStyle = grid[row][col] ? livingColor : deadColor;
			ctx.fillRect(x, y, squareSize, squareSize);
		}
	}
}

function getGridPosition(x, y) {
	const gridSize = 10;
	const gap = 2;
	const squareSize = 30;

	const col = Math.floor(x / (squareSize + gap));
	const row = Math.floor(y / (squareSize + gap));

	if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
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
		grid[position.row][position.col] = !grid[position.row][position.col];
		drawGrid();
	}
}

function toggleEditMode() {
	isEditMode = !isEditMode;
	editButton.classList.toggle('active');
}

function handlePlay() {

	console.log('Play button clicked!', grid);
}

// Event listeners
canvas.addEventListener('click', handleCanvasClick);
editButton.addEventListener('click', toggleEditMode);
playButton.addEventListener('click', handlePlay);

function main() {
	drawGrid();
}

main();

