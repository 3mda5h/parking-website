//lowkey bike parking and caar parking could prolly be combined....
//https://blog.madrax.com/hubfs/Bike%20Parking%20Dimensions%20Bike%20Parking%20Lot%20Layout.png

const NS = "http://www.w3.org/2000/svg"; //SVG namespace
const bike_lot_svg = document.getElementById("bike-lot-svg");

const RACK_THICKNESS = 0.25;
const CONCRETE_COLOR = "#b9b9b9";

export function drawBikeLot(total_racks, RACK_WIDTH, RACK_HORIZONTAL_BUFFER, AISLE_WIDTH, RACK_VERTICAL_SPACING, rack_columns, rack_rows)
{
  bike_lot_svg.innerHTML = ""; //clear existing stalls

  const RACK_BOX_WIDTH = RACK_HORIZONTAL_BUFFER * 2 + RACK_WIDTH;  //width of the buffer box surrounding each rack
  const RACK_BOX_HEIGHT = RACK_VERTICAL_SPACING; //height of the buffer box surrounding each rack. creating new variable for clarity since this is teeechnically a different thing than spacing
  let aisle_columns = Math.ceil(rack_columns/2);

  drawSVGRect(0, 0, rack_columns * RACK_BOX_WIDTH + aisle_columns * AISLE_WIDTH, RACK_BOX_HEIGHT * rack_rows, CONCRETE_COLOR); //draw concrete spot

  let racks_drawn = 0;
  let current_x_position = 0;
  let current_y_position = 0;

//iterate through grid and draw bike racks
  for (let col = 0; col < (rack_columns + aisle_columns); col++)
  {
    for (let row = 0; row < rack_rows; row++) 
    {
      current_y_position = row * RACK_BOX_HEIGHT;
      if(col % 3 !== 1) //RACK COLUMN
      {
        if(racks_drawn < total_racks) //only draw rack if we haven't drawn all racks needed
        {
          drawSVGRect(current_x_position + RACK_HORIZONTAL_BUFFER, current_y_position + RACK_VERTICAL_SPACING/2, RACK_WIDTH, RACK_THICKNESS, "#000000")
          racks_drawn++;
        }
        else drawSVGRect(current_x_position, current_y_position, AISLE_WIDTH + RACK_BOX_WIDTH, RACK_BOX_HEIGHT, "#ffffffff"); //white out this stall and its aisle
      }
    }
    //Bike lot is structured such that the first column is always racks, the second column is an aisle, and then every two rack columns there is an aisle. 
    //col % 3 will always be 1 if we are at an aisle column (where col is the current column number, starting at 0)
    //col % 1 will be 2 or 0 if we are at a rack column
    if(col % 3 == 1) current_x_position += AISLE_WIDTH;
    else current_x_position += RACK_BOX_WIDTH;
  }

  return {
        lot_width: (rack_columns * RACK_BOX_WIDTH) + (aisle_columns * AISLE_WIDTH),
        lot_height: rack_rows * RACK_BOX_HEIGHT
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
  bike_lot_svg.appendChild(rect);
}
