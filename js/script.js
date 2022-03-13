let grid = document.getElementById("grid");
const GRID_SIDES = 600;
const GRID_BASE_COLOR = "gray";
const GRID_NEW_COLOR = "black";
grid.style.width = GRID_SIDES + "px";
grid.style.height = GRID_SIDES + "px";
let numberSquares = 30;

drawGrid(numberSquares);

document.getElementById("redraw").addEventListener("click", redrawGrid);

document.getElementById("clear").addEventListener("click", clearGrid);

function redrawGrid(){
    grid.textContent = "";
    drawGrid(numberSquares);

}

function clearGrid(){
    Array.from(grid.children).forEach(square =>{
        square.style.backgroundColor = GRID_BASE_COLOR;
    });
}

function drawGrid(numSquares){
    for(let i = 0; i < (numSquares * numSquares); i++){
        let square = document.createElement("div");
        square.style.backgroundColor = GRID_BASE_COLOR;
        square.style.width = (GRID_SIDES / numSquares) + "px";
        square.style.height = (GRID_SIDES / numSquares) + "px";
        square.addEventListener("mouseenter", () => {
            square.style.backgroundColor = GRID_NEW_COLOR;
        });
    
        grid.appendChild(square);
    }
}

let slider = document.getElementById("slider");
let sliderWidth = slider.getBoundingClientRect().width;
let sliderDiv = document.getElementById("sliderValue");
let dot = document.getElementById("dot");
dot.style.left = (numberSquares * sliderWidth / 99 - 15 + 1) + "px";
sliderDiv.textContent = "Grid: " + numberSquares;
let leftDot;

setInterval(() => dot.style.left = leftDot, 50);

dot.addEventListener("mousedown", event => {
    if(event.button === 0){
        window.addEventListener("mousemove", setDot);
        event.preventDefault();
    }
});

slider.addEventListener("click", event => {
    let limit_inf = slider.getBoundingClientRect().left;      
    leftDot = Math.max(-15, Math.min((event.clientX - limit_inf - 15),slider.offsetWidth - 15)) + "px";
    numberSquares = Math.ceil((1 + 15 + Number(leftDot.slice(0,-2))) * 99 / sliderWidth);
    sliderDiv.textContent = "Grid: " + numberSquares;
}); 

function setDot(event){
    if(event.buttons === 1){
        let limit_inf = slider.getBoundingClientRect().left;      
        leftDot = Math.max(-15, Math.min((event.clientX - limit_inf - 15),slider.offsetWidth - 15)) + "px";
        numberSquares = Math.ceil((1 + 15 + Number(leftDot.slice(0,-2))) * 99 / sliderWidth);
        sliderDiv.textContent = "Grid: " + numberSquares;
    }else if(event.buttons === 0){
        window.removeEventListener("mousemove",setDot);
    }
}