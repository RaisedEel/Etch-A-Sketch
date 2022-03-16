// Initialization of Variables
let grid = document.getElementById("grid");
let colorInput = document.getElementById("color");
const GRID_SIDES = 550; // Size in px of each side of the grid
const GRID_BASE_COLOR = "rgb(255, 255, 255)"; // Base color of the grid (white)
let gridMode = "normal"; // Draw Mode for the grid (always starts in normal mode)
let gridNewColor = colorInput.value; // Takes the initial color from the color input (black)
// Assigning space to the grid
grid.style.width = GRID_SIDES + "px";
grid.style.height = GRID_SIDES + "px";
let numberSquares = 16; // Number of squares per side

// Redraw the grid depending the input of the slider
document.getElementById("redraw").addEventListener("click", redrawGrid);

function redrawGrid(){
    grid.textContent = ""; // Delete all the squares
    drawGrid(numberSquares);

}

// Clear the grid by painting all the squares back to the base color
document.getElementById("clear").addEventListener("click", clearGrid);

function clearGrid(){
    Array.from(grid.children).forEach(square =>{
        initSteps(square);
        square.style.backgroundColor = GRID_BASE_COLOR;
    });
}

// Change the color based on the color input
let colorMenu = document.getElementById("normal").nextElementSibling;

colorInput.addEventListener("change", () => {
    gridNewColor = colorInput.value;
})

// Listeners for the mode buttons, only let one button at a time to be selected
let buttonsMode = document.getElementsByClassName("mode");

buttonsMode[0].addEventListener("click", () => {
    gridMode = "normal"; // Changes the draw mode
    colorMenu.classList.toggle("hidden"); // Hide/Expose the color input
    buttonsMode[0].classList.toggle("selected");
    buttonsMode[1].classList.remove("selected");
    buttonsMode[2].classList.remove("selected");
});

buttonsMode[1].addEventListener("click", () => {
    gridMode = "rainbow";
    colorMenu.classList.add("hidden");
    buttonsMode[1].classList.toggle("selected");
    buttonsMode[0].classList.remove("selected");
    buttonsMode[2].classList.remove("selected");
});

buttonsMode[2].addEventListener("click", () =>  {
    gridMode = "shader";
    colorMenu.classList.add("hidden");
    buttonsMode[2].classList.toggle("selected");
    buttonsMode[0].classList.remove("selected");
    buttonsMode[1].classList.remove("selected");
})

// Calculate the steps for the shader mode, in this mode each time you mouse over a square
// it becomes 10% more black
function shaderSteps(colors){
    let darkenPorcentages = colors.map(value =>{
        return value * 0.1;
    });

    return darkenPorcentages;
}

// Initialize the steps for the shade mode in the square
function initSteps(square){
    square.dataset.step1 = 0;
    square.dataset.step2 = 0;
    square.dataset.step3 = 0;
}

// Draw the squares of the grid
drawGrid(numberSquares);

function drawGrid(numSquares){
    for(let i = 0; i < (numSquares * numSquares); i++){
        let square = document.createElement("div");
        square.style.backgroundColor = GRID_BASE_COLOR;
        // Calculate the size of each square
        square.style.width = (GRID_SIDES / numSquares) + "px";
        square.style.height = (GRID_SIDES / numSquares) + "px";
        initSteps(square);
        square.addEventListener("mouseenter", event => {
            if(gridMode === "normal"){
                // Normal mode repaints the square based on the color input
                initSteps(square);
                square.style.backgroundColor = gridNewColor;
            }else if(gridMode === "rainbow"){
                // Repaints the square with a random color each time
                initSteps(square);
                square.style.backgroundColor = `rgb(${Math.ceil(Math.random() * 256)},
                ${Math.ceil(Math.random() * 256)},${Math.ceil(Math.random() * 256)})`;
            }else{
                // Darken the square 10% more each time
                // All colors used in the page use the rgb representation. We only leave the numbers
                // and split them in a array
                let colors = square.style.backgroundColor.slice(4,-1).split(",");
                if(square.dataset.step1 === "0" && square.dataset.step2 === "0" && square.dataset.step3 === "0"){
                    // We get the shader steps only if the square doesn't have the steps already
                    let steps = shaderSteps(colors);
                    square.dataset.step1 = steps[0];
                    square.dataset.step2 = steps[1];
                    square.dataset.step3 = steps[2];
                }
                square.style.backgroundColor = `rgb(${Math.ceil(colors[0] - square.dataset.step1)},
                ${Math.ceil(colors[1] - square.dataset.step2)},${Math.ceil(colors[2] - square.dataset.step3)})`;
            }
        });
        grid.appendChild(square);
    }
}

// Slider Code
let slider = document.getElementById("slider");
let sliderWidth = slider.getBoundingClientRect().width;
let sliderDiv = document.getElementById("sliderValue");
let dot = document.getElementById("dot");
dot.style.left = (numberSquares * sliderWidth / 99 - 15 + 1) + "px";
sliderDiv.textContent = `Grid: ${numberSquares} x ${numberSquares}`;
let leftDot;

// I'm using setInterval instead of the listener to move the dot a little slower. Using only the 
// listener moved the dot to quickly causing mirror dots and making the animation look bad in general.
setInterval(() => dot.style.left = leftDot, 50);

// If the user clicks the dot, we add a listener to check the movement of the mouse and move the dot there
dot.addEventListener("mousedown", event => {
    if(event.button === 0){
        window.addEventListener("mousemove", setDot);
        event.preventDefault();
    }
});

// Listener to move the dot in case the user click the slider
slider.addEventListener("click", event => {
    let limit_inf = slider.getBoundingClientRect().left;      
    leftDot = Math.max(-15, Math.min((event.clientX - limit_inf - 15),slider.offsetWidth - 15)) + "px";
    numberSquares = Math.ceil((1 + 15 + Number(leftDot.slice(0,-2))) * 99 / sliderWidth);
    sliderDiv.textContent = `Grid: ${numberSquares} x ${numberSquares}`;
}); 

function setDot(event){
    if(event.buttons === 1){
        let limit_inf = slider.getBoundingClientRect().left; 
        // Get the coordinate based on the location of the slider, we have to substract the left px
        // of the slider because the dot position is relative to the slider
        leftDot = Math.max(-15, Math.min((event.clientX - limit_inf - 15),slider.offsetWidth - 15)) + "px";
        numberSquares = Math.ceil((1 + 15 + Number(leftDot.slice(0,-2))) * 99 / sliderWidth);
        sliderDiv.textContent = `Grid: ${numberSquares} x ${numberSquares}`;
    }else if(event.buttons === 0){
        window.removeEventListener("mousemove",setDot);
    }
}