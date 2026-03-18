import { GenerateCarLot } from "./car-parking.js";

//CAR PARKING MEASUREMENTS: ---------------------------------------
//based on: https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are converted to inches to use same scale as bike parking
const STALL_WIDTH = 8.5 * 12
const STALL_DEPTH = 18 * 12
const AISLE_WIDTH = 24 * 12

//BIKE PARKING MEASUREMENTS: ---------------------------------------------
//based on recommended dimensions here: https://blog.madrax.com/hubfs/Bike%20Parking%20Dimensions%20Bike%20Parking%20Lot%20Layout.png
const RACK_WIDTH = 24
const RACK_DISTANCE_FROM_BARRIER = 36
const RACK_AISLE_WIDTH = 132
const RACK_VERTICAL_SPACING = 48

const svg = document.getElementById("lot-svg");

let generate_button = document.getElementById("generate-parking-lot-button");
generate_button.addEventListener("click", GenerateLotComparison);

function GenerateLotComparison()
{
  const total_vehicles = Math.round(Number(document.getElementById("total-cars-input").value));
  if(isNaN(total_vehicles)) total_vehicles = 20;
  else if(total_vehicles > 100000 ) total_vehicles = 100000; 

  let lot_dimension = GenerateCarLot(total_vehicles, STALL_WIDTH, STALL_DEPTH, AISLE_WIDTH);

  //0 0 is the top left corner of the SVG coordinates
  //units are abstract SVG units (not pixels) - automatically scales
  svg.setAttribute("viewBox", `0 0 ${lot_dimension['lot_width']} ${lot_dimension['lot_height']} `);
}