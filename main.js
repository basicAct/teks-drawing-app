let canvas  = document.getElementById("tekgay");
let context = canvas.getContext("2d");

let buttons = {}

for (let buttonElement of document.getElementsByTagName("button")) {
  if (buttonElement.id == "") {
    console.log("empty button id skipping");
    continue;
  }
  buttons[buttonElement.id.toLowerCase()] = buttonElement;
  buttonElement.onclick = () => {
    console.log("unimplemented click event listener for " + buttonElement.id.toLowerCase());
  }
}



let DRAW_COLORS = {
  BLACK: "#000",
  GREEN: "#010",
  RED:   "#100"
}

let DRAW_SHAPES = {
  DOT: "DOT",
  RECTANGLE: "RECTANGLE",
  OVAL: "OVAL"
}
  

let currentSelection = {
  selectedDrawColor: DRAW_COLORS.BLACK,
  selectedDrawShape: DRAW_SHAPES.DOT
}


let drawingOperations = [];


let actions = {};

function newDrawingOperation(shape, color, x, y, w, h) {
  return {
    shape, color, x, y, w, h
  };
}

function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top 
  }
}

function updateCanvas() {
  context.fillStyle = "#fff";
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let dop of drawingOperations) {
    actions.performDrawingOperation(dop);
  }
}



let activeDrawnShape = null;

actions.performDrawingOperation = (dop) => {
  if (dop.shape == DRAW_SHAPES.DOT) {
    context.fillStyle = dop.color;
    context.fillRect(dop.x, dop.y , 10, 10);
    console.log("Drawn:", dop);
  } else {
    console.log("something strange with this drawing operation:", dop);
  }

  return dop;
}

actions.cancelAnyDrawShape = () => {
  activeDrawnShape = null;
  updateCanvas();
}


actions.beginDrawShape = (mousePos) => {
  if (activeDrawnShape != null) {
    actions.cancelAnyDrawShape();
  }


  if (currentSelection.selectedDrawShape == DRAW_SHAPES.DOT) {
    drawingOperations.push(actions.performDrawingOperation(newDrawingOperation(DRAW_SHAPES.DOT, currentSelection.selectedDrawColor, mousePos.x, mousePos.y, 1, 1)));
    return;
  }
  
  activeDrawnShape = {
    shape: currentSelection.selectedDrawShape,
    originX: mousePos.x,
    originY: mousePos.y,
    x1: mousePos.x,
    x2: mousePos.y
  }
  
}

actions.updateDrawShape = () => {

}

actions.endDrawShape = () => {
  
}

actions.selectColor = (colorChoice) => {
  currentSelection.selectedDrawColor = colorChoice ?? DRAW_COLORS.BLACK;
}

actions.undo = () => {
  actions.cancelAnyDrawShape();
  drawingOperations.pop();
  updateCanvas();
}


buttons.black.onclick = () => {
  actions.selectColor(DRAW_COLORS.BLACK);
}

buttons.green.onclick = () => {
  actions.selectColor(DRAW_COLORS.GREEN);
}

buttons.red.onclick = () => {
  actions.selectColor(DRAW_COLORS.RED);
}







canvas.addEventListener("mousedown", (event) => {
  actions.beginDrawShape(getCursorPosition(event));
});

canvas.addEventListener("mousemove", (event) => {
});

canvas.addEventListener("mouseup", (event) => {
});


/*
to do: 
- set up draw with dot by default ( so also need draw_shape enum thing)
- set up mouse events to draw, may have to use some kind of fake mouse that lerps 
- need some sort of draw operation linked list or something to deal with undo
- to do: write more todos lol
- 
- 
- 
*/

