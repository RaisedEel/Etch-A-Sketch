let grid = document.getElementById("grid");
let colorInput = document.getElementById("color");
const GRID_SIDES = 600;
const GRID_BASE_COLOR = "rgb(255, 255, 255)";
let gridMode = "normal";
let gridNewColor = colorInput.value;
grid.style.width = GRID_SIDES + "px";
grid.style.height = GRID_SIDES + "px";
let numberSquares = 16;

drawGrid(numberSquares);

document.getElementById("redraw").addEventListener("click", redrawGrid);

document.getElementById("clear").addEventListener("click", clearGrid);

let buttonsMode = document.getElementsByClassName("mode");
let colorMenu = document.getElementById("normal-submenu")

buttonsMode[0].addEventListener("click", () => {
    gridMode = "normal";
    colorMenu.classList.toggle("hidden");
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

colorInput.addEventListener("change", () => {
    gridNewColor = colorInput.value;
})

function redrawGrid(){
    grid.textContent = "";
    drawGrid(numberSquares);

}

function clearGrid(){
    Array.from(grid.children).forEach(square =>{
        square.style.backgroundColor = GRID_BASE_COLOR;
    });
}

function shaderSteps(colors){
    let darkenPorcentages = colors.map(value =>{
        return value * 0.1;
    });

    return darkenPorcentages;
}

function initSteps(square){
    square.dataset.step1 = 0;
    square.dataset.step2 = 0;
    square.dataset.step3 = 0;
}

function drawGrid(numSquares){
    for(let i = 0; i < (numSquares * numSquares); i++){
        let square = document.createElement("div");
        square.style.backgroundColor = GRID_BASE_COLOR;
        square.style.width = (GRID_SIDES / numSquares) + "px";
        square.style.height = (GRID_SIDES / numSquares) + "px";
        initSteps(square);
        square.addEventListener("mouseenter", event => {
            if(gridMode === "normal"){
                initSteps(square);
                square.style.backgroundColor = gridNewColor;
            }else if(gridMode === "rainbow"){
                initSteps(square);
                square.style.backgroundColor = `rgb(${Math.ceil(Math.random() * 256)},
                ${Math.ceil(Math.random() * 256)},${Math.ceil(Math.random() * 256)})`;
            }else{
                let colors = square.style.backgroundColor.slice(4,-1).split(",");
                if(square.dataset.step1 === "0" && square.dataset.step2 === "0" && square.dataset.step3 === "0"){
                    let steps = shaderSteps(colors);
                    square.dataset.step1 = steps[0];
                    square.dataset.step2 = steps[1];
                    square.dataset.step3 = steps[2];
                }
                square.style.backgroundColor = `rgb(${Math.ceil(colors[0] - square.dataset.step1)},
                ${Math.ceil(colors[1] - square.dataset.step2)},${Math.ceil(colors[2] - square.dataset.step3)})`;
            }
            event.preventDefault();
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
sliderDiv.textContent = "Grid: " + numberSquares;
let leftDot;

// I'm using setInterval instead of the listener to move the dot a little slower. Using only the 
// listener moved the dot to quickly causing mirror dots and making the animation look bad in general.
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