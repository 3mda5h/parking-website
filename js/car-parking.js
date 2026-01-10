//https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are in feet
STALL_WIDTH = 8.5
STALL_DEPTH = 18 
AISLE_WIDTH = 24

total_stalls = 100;
var stall_columns; //total number of parking stall columns
var stall_rows; //total number of parking stall rows
var total_aisles; //total number of empty columns that make up the aisles between parking spaces

const LOT_ASPECT_RATIO = 7.0;

//smaller parking lots would likely be split into fewer different columns
if(total_stalls <= 15) stall_columns = 1; 
if(total_stalls <= 30) stall_columns = 2;
if(total_stalls <= 50) stall_columns = 3;
else 
{
  stall_columns = Math.ceil(Math.sqrt(total_stalls / (LOT_ASPECT_RATIO * (STALL_WIDTH / STALL_DEPTH)))
);
  console.log("stall columns: ", stall_columns)
}
stall_rows = Math.ceil(total_stalls / stall_columns);
console.log("stall rows: ", stall_rows)
total_aisles = Math.ceil(stall_columns/2);

console.log("total aisles: ", total_aisles)


let current_space = 'STALL'
let aisles_drawn = 0;
let stall_columns_drawn = 0;

const svg = document.getElementById("car-lot-visual");

for (let col = 0; col < (stall_columns + total_aisles); col++)
{
  if(col % 3 == 1) //add an aisle rectangle after the first colum and then every two columns
  {
    current_space = 'AISLE';
    aisles_drawn++;
  }
  else
  { 
    current_space = 'STALL'
    stall_columns_drawn++;
  }
  for (let row = 0; row < stall_rows; row++) 
  {
    if(((stall_columns_drawn -1) * stall_rows) + row < total_stalls) //make sure were not drawing extra stalls in this column
    {
      const y_position = row * STALL_WIDTH;
      if(current_space == 'AISLE' &&  (aisles_drawn * stall_rows) + row < total_stalls)
      {
        const x_position = (stall_columns_drawn * STALL_DEPTH) + ((aisles_drawn -1) * AISLE_WIDTH); //don't count this aisle!
        const aisle = document.createElementNS("http://www.w3.org/2000/svg", "rect"); //create rectangle elements in the SVG namespace
        aisle.setAttribute("x", x_position); //x-y position is the top-left corner of the rectangle
        aisle.setAttribute("y", y_position);
        aisle.setAttribute("width", AISLE_WIDTH);
        aisle.setAttribute("height", STALL_WIDTH);
        aisle.setAttribute("fill", "#3e3d3dff");
        aisle.setAttribute("stroke", "#3e3d3dff");
        svg.appendChild(aisle);
      }
      else if(current_space == 'STALL')
      {
        const x_position = ((stall_columns_drawn - 1) * STALL_DEPTH) + (aisles_drawn * AISLE_WIDTH);
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
}
  
//0 0 is the top left corner of the SVG coordinates
//units are abstract SVG units (not pixels) - automatically scales
svg.setAttribute("viewBox", `0 0 ${(stall_columns * STALL_DEPTH) + (total_aisles * AISLE_WIDTH)} ${stall_rows * STALL_WIDTH} `);
