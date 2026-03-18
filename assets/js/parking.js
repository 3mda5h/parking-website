import { generateCarLot } from "./car-parking.js";
import { generateBikeLot } from "./bike-parking.js";

//CAR PARKING MEASUREMENTS: ---------------------------------------
//based on: https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are in feet
const STALL_WIDTH = 8.5 
const STALL_DEPTH = 18
const AISLE_WIDTH = 24 

//BIKE PARKING MEASUREMENTS: ---------------------------------------------
//based on recommended dimensions here: https://blog.madrax.com/hubfs/Bike%20Parking%20Dimensions%20Bike%20Parking%20Lot%20Layout.png
//measurements are in feet
const RACK_WIDTH = 2 //distance between rack legs
const RACK_HORIZONTAL_BUFFER = 2 //every rack must have this much horizontal distance from ANOTHER rack's buffer or from the aisle. This is essentially space for bike wheels
const RACK_AISLE_WIDTH = 5 //width of the aisle, not including horizontal rack buffer
const RACK_VERTICAL_SPACING = 4 //racks are vertically placed this far apart

const svg = document.getElementById("lot-comparison-svg");
const bike_lot_svg = document.getElementById("bike-lot-svg");

let generate_button = document.getElementById("generate-parking-lot-button");
generate_button.addEventListener("click", generateLotComparison);

function generateLotComparison()
{
  const total_vehicles = Math.round(Number(document.getElementById("total-cars-input").value));
  if(isNaN(total_vehicles)) total_vehicles = 20;
  else if(total_vehicles > 100000 ) total_vehicles = 100000; 

  let  total_racks = Math.ceil(total_vehicles/2) //1 bike rack fits 2 bikes

  let car_lot_dimension = generateCarLot(total_vehicles, STALL_WIDTH, STALL_DEPTH, AISLE_WIDTH);
  let bike_lot_dimension = generateBikeLot(total_racks, RACK_WIDTH, RACK_HORIZONTAL_BUFFER, RACK_AISLE_WIDTH, RACK_VERTICAL_SPACING);

  //0 0 is the top left corner of the SVG coordinates
  //units are abstract SVG units (not pixels) - automatically scales
  let spacing = 1;
  bike_lot_svg.setAttribute("transform", `translate(${car_lot_dimension['lot_width'] + spacing}, 0)`);
  svg.setAttribute("viewBox", `0 0 ${car_lot_dimension['lot_width'] + bike_lot_dimension['lot_width'] + spacing} ${car_lot_dimension['lot_height']} `);
 
}