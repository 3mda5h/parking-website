const NS = "http://www.w3.org/2000/svg"; //SVG namespace
const CAR_LOT_SVG = document.getElementById("car-lot-svg");

const PAINT_WIDTH = 0.5;
const ASPHALT_COLOR = "#3e3d3dff";

export function generateCarLot(total_vehicles, STALL_WIDTH, STALL_DEPTH, AISLE_WIDTH)
{
  CAR_LOT_SVG.innerHTML = ""; //clear existing stalls
  
  let stall_rows;
  if(total_vehicles <= 11) stall_rows = total_vehicles; //keep really small parking lots as just one column for simplicity
  else stall_rows = Math.ceil(Math.sqrt(total_vehicles * (STALL_DEPTH / STALL_WIDTH))); //try to keep a good aspect ratio for bigger lots
  let stall_columns = Math.ceil(total_vehicles / stall_rows);
  let aisle_columns = Math.ceil(stall_columns/2);

  let viewBoxWidth = (stall_columns * STALL_DEPTH) + (aisle_columns * AISLE_WIDTH)

  //draw asphalt background
  drawSVGRect(0, 0, (stall_columns * STALL_DEPTH) + (aisle_columns * AISLE_WIDTH), stall_rows * STALL_WIDTH, ASPHALT_COLOR);

  let stalls_drawn = 0;
  let current_x_position = 0;
  let current_y_position = 0;
  
  //iterate through grid and draw parking stalls
  for (let col = 0; col < (stall_columns + aisle_columns); col++)
  {
    for (let row = 0; row < stall_rows; row++) 
    {
      current_y_position = row * STALL_WIDTH;
      if(col % 3 !== 1) //STALL COLUMN
      {
        if(stalls_drawn < total_vehicles) //only draw stall if we haven't drawn all stalls needed
        {
          let direction;
          if(col % 3 == 0) direction = "right";
          if(col % 3 == 2) direction = "left";
          drawStall(current_x_position, current_y_position, direction, STALL_DEPTH, STALL_WIDTH);
          stalls_drawn++;
        }
        else drawSVGRect(current_x_position, current_y_position, AISLE_WIDTH + STALL_DEPTH, STALL_WIDTH, "#ffffffff"); //white out this stall and its aisle
      }
    }
    //Parking lot is structured such that the first column is always stalls, the second column is an aisle, and then every two stall columns there is an aisle. 
    //col % 3 will always be 1 if we are at an aisle column (where col is the current column number, starting at 0)
    //col % 1 will be 2 or 0 if we are at a stall column
    if(col % 3 == 1) current_x_position += AISLE_WIDTH;
    else current_x_position += STALL_DEPTH;
  }

  return {
        lot_width: (stall_columns * STALL_DEPTH) + (aisle_columns * AISLE_WIDTH),
        lot_height: stall_rows * STALL_WIDTH
    };
}

//draws rectangle of given size and color at given position
function drawSVGRect(x, y, width, height, fill_color)
{
  const rect = document.createElementNS(NS, "rect"); //create rectangle elements in the SVG namespace
  rect.setAttribute("x", x); //x-y position is the top-left corner of the rectangle
  rect.setAttribute("y", y);
  rect.setAttribute("width", width);
  rect.setAttribute("height", height);
  rect.setAttribute("fill", fill_color);
  CAR_LOT_SVG.appendChild(rect);
}

//draws lines for a horizontal parking stall
//inputted x, y coordinates are the top left corner of stall
function drawStall(x, y, direction, STALL_DEPTH, STALL_WIDTH) 
{
  drawSVGRect(x, y, STALL_DEPTH, STALL_WIDTH, "#ffffff") //white square
  if(direction == "right") drawSVGRect(x + PAINT_WIDTH/2, y + PAINT_WIDTH/2, STALL_DEPTH - PAINT_WIDTH/2, STALL_WIDTH - PAINT_WIDTH, ASPHALT_COLOR)  //overlap white square with smaller asphalt square, leaving correct amount of space to create white "lines" 
  else drawSVGRect(x, y + PAINT_WIDTH/2, STALL_DEPTH - PAINT_WIDTH/2, STALL_WIDTH - PAINT_WIDTH, ASPHALT_COLOR)
}