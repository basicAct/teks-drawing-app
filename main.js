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
  GREEN: "#00FF00",
  RED:   "#FF0000"
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

function updateCanvas() {
  context.fillStyle = "#fff";
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let dop of drawingOperations) {
    actions.performDrawingOperation(dop);
  }
}



let activeDrawnShape = null;

actions.performDrawingOperation = (dop) => {
  context.fillStyle = dop.color;
  if (dop.shape == DRAW_SHAPES.DOT) {
    context.fillRect(dop.x, dop.y , 2, 2);
    console.log("Drawn:", dop);
  } else if (dop.shape == DRAW_SHAPES.RECTANGLE) {
    context.fillRect(dop.x, dop.y , dop.w, dop.h);
  } else if (dop.shape == DRAW_SHAPES.CIRCLE) {
    context.ellipse(dop.x, dop.y, Math.abs(dop.w)*0.5, Math.abs(dop.h)*0.5, 0, Math.PI*2);
    context.fill();
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
    originY: mousePos.y
  }
  
}

actions.updateDrawShape = (mousePos) => {
  if (activeDrawnShape == null) 
    return;

  updateCanvas();
  actions.performDrawingOperation(newDrawingOperation(activeDrawnShape.shape, currentSelection.selectedDrawColor, 
                                                      activeDrawnShape.originX, activeDrawnShape.originY, 
                                                      mousePos.x - activeDrawnShape.originX, mousePos.y - activeDrawnShape.originY));
  
}

actions.endDrawShape = (mousePos) => {
  if (activeDrawnShape == null) 
    return;

  updateCanvas();
  drawingOperations.push(actions.performDrawingOperation(newDrawingOperation(activeDrawnShape.shape, currentSelection.selectedDrawColor, 
                                                      activeDrawnShape.originX, activeDrawnShape.originY, 
                                                      mousePos.x - activeDrawnShape.originX, mousePos.y - activeDrawnShape.originY)));
  activeDrawnShape = null;
}

actions.selectColor = (colorChoice) => {
  currentSelection.selectedDrawColor = colorChoice ?? DRAW_COLORS.BLACK;
}

actions.selectShape = (shapeChoice) => {
  currentSelection.selectedDrawShape = shapeChoice ?? DRAW_SHAPES.DOT;
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


buttons.undo.onclick = actions.undo;

buttons.dot.onclick = () => {
  actions.cancelAnyDrawShape();
  actions.selectShape(DRAW_SHAPES.DOT);  
}

buttons.rect.onclick = () => {
  actions.cancelAnyDrawShape();
  actions.selectShape(DRAW_SHAPES.RECTANGLE);  
}

buttons.circle.onclick = () => {
  actions.cancelAnyDrawShape();
  actions.selectShape(DRAW_SHAPES.CIRCLE);  
}



function getCursorPosition(event) {
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top 
  }
}

canvas.addEventListener("mousedown", (event) => {
  actions.beginDrawShape(getCursorPosition(event));
});

canvas.addEventListener("mousemove", (event) => {
  actions.updateDrawShape(getCursorPosition(event));
});

canvas.addEventListener("mouseup", (event) => {
  actions.endDrawShape(getCursorPosition(event));
});
