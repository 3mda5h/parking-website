//https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are in feet
STALL_WIDTH = 8.5
STALL_DEPTH = 18 
AISLE_WIDTH = 24

total_stalls = 100;

const parking_cols = Math.ceil(Math.sqrt(total_stalls));
const parking_rows = Math.ceil(total_stalls / parking_cols);
const num_asiles = Math.ceil(parking_cols/2);

let current_space = 'STALL'
let aisles_so_far = 0;
let stalls_so_far = 0;

const svg = document.getElementById("car-lot-visual");

for (let col = 0; col < (parking_cols + num_asiles); col++)
{
  if(col % 3 == 1) //add an aisle rectangle after the first colum and then every two columns
  {
    current_space = 'AISLE';
    aisles_so_far++;
  }
  else
  { 
    current_space = 'STALL'
    stalls_so_far++;
  }
  for (let row = 0; row < parking_rows; row++) 
  {
    const y_position = row * STALL_WIDTH;
    if(current_space == 'AISLE')
    {
      const x_position = (stalls_so_far * STALL_DEPTH) + ((aisles_so_far -1) * AISLE_WIDTH); //don't count this aisle!
      const aisle = document.createElementNS("http://www.w3.org/2000/svg", "rect"); //create rectangle elements in the SVG namespace
      aisle.setAttribute("x", x_position); //x-y position is the top-left corner of the rectangle
      aisle.setAttribute("y", y_position);
      aisle.setAttribute("width", AISLE_WIDTH);
      aisle.setAttribute("height", STALL_WIDTH);
      aisle.setAttribute("fill", "#3e3d3dff");
      aisle.setAttribute("stroke", "#3e3d3dff");
      svg.appendChild(aisle);
    }
    else
    {
      const x_position = ((stalls_so_far - 1) * STALL_DEPTH) + (aisles_so_far * AISLE_WIDTH);
      const stall = document.createElementNS("http://www.w3.org/2000/svg", "rect"); //create rectangle elements in the SVG namespace
      stall.setAttribute("x", x_position); //x-y position is the top-left corner of the rectangle
      stall.setAttribute("y", y_position);
      stall.setAttribute("width", STALL_DEPTH);
      stall.setAttribute("height", STALL_WIDTH);
      stall.setAttribute("fill", "#3e3d3dff");
      stall.setAttribute("stroke", "#eeeeeeff");
      svg.appendChild(stall);
    }
  }
}
  
//0 0 is the top left corner of the SVG coordinates
//units are abstract SVG units (not pixels) - automatically scales
svg.setAttribute("viewBox", `0 0 ${(parking_cols * STALL_DEPTH) + (num_asiles * AISLE_WIDTH)} ${parking_rows * STALL_WIDTH} `);
