//https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are in feet
STALL_WIDTH = 8.5
STALL_DEPTH = 18 
AISLE_WIDTH = 24

total_stalls = 20;

const cols = Math.ceil(Math.sqrt(total_stalls));
const rows = Math.ceil(total_stalls / cols);

const svg = document.getElementById("car-lot-visual");

for (let i = 0; i < total_stalls; i++) {
  const x_position = Math.floor(i / cols) * STALL_DEPTH;
  const y_position = (i % cols) * STALL_WIDTH;

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect"); //create rectangle elements in the SVG namespace
  rect.setAttribute("x", x_position); //x-y position is the top-left corner of the rectangle
  rect.setAttribute("y", y_position);
  rect.setAttribute("width", STALL_DEPTH);
  rect.setAttribute("height", STALL_WIDTH);
  rect.setAttribute("fill", "#3e3d3dff");
  rect.setAttribute("stroke", "#eeeeeeff");

  svg.appendChild(rect);
}

//0 0 is the top left corner of the SVG coordinates
//units are abstract SVG units (not pixels) - automatically scales
svg.setAttribute("viewBox", `0 0 ${rows * STALL_DEPTH} ${cols * STALL_WIDTH} `);
