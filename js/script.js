let grid = document.getElementById("grid");
const GRID_SIDES = 600;
grid.style.width = GRID_SIDES + "px";
grid.style.height = GRID_SIDES + "px";
let numberSquares = 30;

drawGrid(numberSquares);

function drawGrid(numSquares){
    for(let i = 0; i < (numSquares * numSquares); i++){
        let square = document.createElement("div");
        square.style.backgroundColor = "gray";
        square.style.width = (GRID_SIDES / numSquares) + "px";
        square.style.height = (GRID_SIDES / numSquares) + "px";
        square.addEventListener("mouseenter", () => {
            square.style.backgroundColor = "black";
        });
    
        grid.appendChild(square);
    }
}
