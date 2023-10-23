let canvas = document.getElementById("tekgay");

let buttons = {}

for (let buttonElement of document.getElementByTagName("button")) {
  buttons[buttonElement.id] = buttonElement;
}



let DRAW_COLORS = {
  BLACK: [0, 0, 0],
  GREEN: [0, 1, 0],
  RED:   [1, 0, 0]
}

let activeColor = DRAW_COLORS.BLACK;


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
