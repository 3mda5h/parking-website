//https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are in feet
STALL_WIDTH = 8.5
STALL_DEPTH = 18 
AISLE_WIDTH = 24

total_stalls = 12;
var stall_columns; //number of parking stall columns
var stall_rows; //number of parking stall rows
var aisle_columns; //number of columns that make up the aisles between parking spaces

if(total_stalls <= 11) stall_rows = total_stalls; //keep really small parking lots as just one column for simplicity
else stall_rows = Math.ceil(Math.sqrt(total_stalls * (STALL_DEPTH / STALL_WIDTH))); //try to keep a good aspect ratio for bigger lots
stall_columns = Math.ceil(total_stalls / stall_rows);
aisle_columns = Math.ceil(stall_columns/2);

console.log("stall rows: ", stall_rows);
console.log("stall columns: ", stall_columns);
console.log("aisles columns: ", aisle_columns)

let current_space = 'STALL'
let aisles_so_far = 0;
let stall_columns_drawn = 0;

const svg = document.getElementById("car-lot-visual");

const NS = "http://www.w3.org/2000/svg"; //SVG namespace


function drawSVGRect(x, y, width, height, fill_color)
{
  const rect = document.createElementNS(NS, "rect"); //create rectangle elements in the SVG namespace
  rect.setAttribute("x", x); //x-y position is the top-left corner of the rectangle
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill_color);
  svg.appendChild(rect);
}

//draw asphalt background
drawSVGRect(0, 0, (stall_columns * STALL_DEPTH) + (aisle_columns * AISLE_WIDTH), stall_rows * STALL_WIDTH, "#3e3d3dff");

//draws lines for a horizontal parking stall
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

  if(direction == "left") lines.push([x + STALL_DEPTH, y, x + STALL_DEPTH, y + STALL_WIDTH]); 
  //we don't need to ever draw a vertical line for the right parking stalls, because they will always come before a lot edge or a left spot
  
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

for (let col = 0; col < (stall_columns + aisle_columns); col++)
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
    const y_position = row * STALL_WIDTH;
    if(current_space == 'STALL') 
    {
      const x_position = ((stall_columns_drawn - 1) * STALL_DEPTH) + (aisles_so_far * AISLE_WIDTH);
      if((stall_columns_drawn -1) * stall_rows + row < total_stalls) //make sure were not drawing extra stalls in this column
      {
        var direction;
        if(col % 3 == 0) direction = "right";
        if(col % 3 == 2) direction = "left";
        drawStall(svg, x_position, y_position, direction);
      }
      //else drawSVGRect(x_position, y_position, AISLE_WIDTH, STALL_DEPTH, "#ffffffff") //white out this stall
    }
    else if(current_space == 'AISLE' && (aisles_so_far * stall_rows) + row > total_stalls) //white out this aisle
    {
      //var x_position = (stall_columns_drawn * STALL_DEPTH) + ((aisles_so_far -1) * AISLE_WIDTH)
      //drawSVGRect(x_position, y_position, AISLE_WIDTH, STALL_WIDTH, "#ffffffff")
    }
  }
}

//0 0 is the top left corner of the SVG coordinates
//units are abstract SVG units (not pixels) - automatically scales
svg.setAttribute("viewBox", `0 0 ${(stall_columns * STALL_DEPTH) + (aisle_columns * AISLE_WIDTH)} ${stall_rows * STALL_WIDTH} `);