// Get the canvas element
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext("2d");

const deadColor = 'black';
const livingColor = 'red'

function drawGrid() {
	const gridSize = 10; // 10x10 grid
	const gap = 2;       // 2px gap between squares
	const squareSize = 30; // Size of each individual square (e.g., 30px)

	const canvasWidth = (gridSize * squareSize) + ((gridSize - 1) * gap);
	const canvasHeight = (gridSize * squareSize) + ((gridSize - 1) * gap);

	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	ctx.fillStyle = livingColor;

	for (let row = 0; row < gridSize; row++) {
		for (let col = 0; col < gridSize; col++) {
			const x = col * (squareSize + gap);
			const y = row * (squareSize + gap);

			ctx.fillRect(x, y, squareSize, squareSize);
		}
	}
};

function main() {
	drawGrid();
}

main();

