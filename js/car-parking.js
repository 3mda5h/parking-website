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
  stall_columns = Math.ceil(Math.sqrt(total_stalls / (LOT_ASPECT_RATIO * (STALL_WIDTH / STALL_DEPTH))));
  console.log("stall columns: ", stall_columns)
}
stall_rows = Math.ceil(total_stalls / stall_columns);
console.log("stall rows: ", stall_rows)
total_aisles = Math.ceil(stall_columns/2);

console.log("total aisles: ", total_aisles)


let current_space = 'STALL'
let aisles_so_far = 0;
let stall_columns_drawn = 0;

const svg = document.getElementById("car-lot-visual");

const NS = "http://www.w3.org/2000/svg"; //SVG namespace


//draw asphalt background
const asphalt = document.createElementNS(NS, "rect");
asphalt.setAttribute("x", 0);
asphalt.setAttribute("y", 0);
asphalt.setAttribute("width", (stall_columns * STALL_DEPTH) + (total_aisles * AISLE_WIDTH));
asphalt.setAttribute("height", stall_rows * STALL_WIDTH);
asphalt.setAttribute("fill", "#3e3d3dff");
svg.appendChild(asphalt);

//draws horizontal parking stall lines
//inputted x, y coordinates are the top left corner of stall
function drawStall(svg, x, y, direction) 
{
  var lines = 
  [
    // top line 
    [x, y, x + STALL_DEPTH, y],
    // bottom line
    [x, y + STALL_WIDTH, x + STALL_DEPTH, y + STALL_WIDTH]
  ];

  if(direction == "right") lines.push([x, y, x, y + STALL_WIDTH]); 
  //else lines.push([x + STALL_DEPTH, y, x + STALL_DEPTH, y + STALL_WIDTH]);

  for (const [x1, y1, x2, y2] of lines) //for each line (pair of x,y cords)
  { 
    //draw lines
    const line = document.createElementNS(NS, "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#eeeeee");
    line.setAttribute("stroke-width", 0.5);
    svg.appendChild(line);
  }
}


for (let col = 0; col < (stall_columns + total_aisles); col++)
{
  if(col % 3 == 1) //add an aisle after the first colum and then every two columns
  {
    current_space = 'AISLE';
    aisles_so_far++;
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
      if((aisles_so_far * stall_rows) + row > total_stalls) //draw white space for extra aisles
      {
        const x_position = (stall_columns_drawn * STALL_DEPTH) + ((aisles_so_far -1) * AISLE_WIDTH); //don't count this aisle!
        const blank = document.createElementNS(NS, "rect"); //create rectangle elements in the SVG namespace
        blank.setAttribute("x", x_position); //x-y position is the top-left corner of the rectangle
        blank.setAttribute("y", y_position);
        blank.setAttribute("width", AISLE_WIDTH);
        blank.setAttribute("height", STALL_WIDTH);
        blank.setAttribute("fill", "#ffffffff=");
        svg.appendChild(aisle);
      }
      else if(current_space == 'STALL')
      {
        var direction;
        if(col % 3 == 0) direction = "right";
        if(col % 3 == 2) direction = "left";
        const x_position = ((stall_columns_drawn - 1) * STALL_DEPTH) + (aisles_so_far * AISLE_WIDTH);
        drawStall(svg, x_position, y_position, direction);
      }
    }
    
  }
}

//0 0 is the top left corner of the SVG coordinates
//units are abstract SVG units (not pixels) - automatically scales
svg.setAttribute("viewBox", `0 0 ${(stall_columns * STALL_DEPTH) + (total_aisles * AISLE_WIDTH)} ${stall_rows * STALL_WIDTH} `);