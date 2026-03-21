import { drawCarLot } from "./car-parking.js";
import { drawBikeLot } from "./bike-parking.js";
import { isPrime } from './primes.js';

//CAR PARKING MEASUREMENTS: ---------------------------------------
//based on dimensions found here: https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//https://www.rpmpavement.com/blog/2024/standard-dimensions-of-a-parking-space-and-why-they-matter.html
//measurements are in feet
const STALL_WIDTH = 8.5 
const STALL_DEPTH = 18
const AISLE_WIDTH = 24 

//BIKE PARKING MEASUREMENTS: ---------------------------------------------
//based on minimum dimensions found here: https://blog.madrax.com/hubfs/Bike%20Parking%20Dimensions%20Bike%20Parking%20Lot%20Layout.png
//measurements are in feet
const RACK_WIDTH = 2 //distance between legs of a rack
const RACK_HORIZONTAL_BUFFER = 2 //every rack must have this much horizontal distance from ANOTHER rack's buffer or from the aisle. This is essentially space for bike wheels
const RACK_AISLE_WIDTH = 4 //width of the aisle, not including horizontal rack buffer
const RACK_VERTICAL_SPACING = 3 //racks are vertically placed this far apart

const svg = document.getElementById("lot-comparison-svg");
const measurements_text = document.getElementById("measurements");
const bike_lot_svg = document.getElementById("bike-lot-svg");
const CAR_LOT_RATIO = 1/3; // stall columns/stall rows (not including aisles) - lot generation will attempt to get as close to this ratio as possible while maintaining perfect rectangle

document.addEventListener("DOMContentLoaded", generateLotComparison);

let generate_button = document.getElementById("generate-parking-lot-button");
generate_button.addEventListener("click", generateLotComparison);

function generateLotComparison()
{
  const total_vehicles = Math.round(Number(document.getElementById("total-cars-input").value));
  if(isNaN(total_vehicles)) total_vehicles = 20;
  else if(total_vehicles > 100000 ) total_vehicles = 100000; 

  let  total_racks = Math.ceil(total_vehicles/2) //1 bike rack fits 2 bikes

  let stall_rows;
  let stall_columns;
  let rack_rows;
  let rack_columns;
  if(total_vehicles <= 11) //keep really small parking lots as just one column for simplicity
  {
    stall_rows = total_vehicles; 
    stall_columns = 1;
  }
  else 
  {
    //generate car lot layout based on prefered ratio
    let layout = generateLotLayout(total_vehicles, CAR_LOT_RATIO);
    stall_rows = layout['rows'];
    stall_columns = layout['columns'];
  }
  //bike lot layout
  if(total_racks <= 30) rack_rows = total_racks; //keep small bike lots as just one column for simplicity
  else rack_rows = Math.ceil(Math.sqrt(total_racks)); //try to keep a good aspect ratio for bigger lots
  rack_columns = Math.ceil(total_racks / rack_rows);

  console.log("stall columns: " + stall_columns);
  console.log("stall rows: " + stall_rows);

  let car_lot_dimension = drawCarLot(total_vehicles, STALL_WIDTH, STALL_DEPTH, AISLE_WIDTH, stall_columns, stall_rows);
  let bike_lot_dimension = drawBikeLot(total_racks, RACK_WIDTH, RACK_HORIZONTAL_BUFFER, RACK_AISLE_WIDTH, RACK_VERTICAL_SPACING, rack_columns, rack_rows);
  let viewbox_width = car_lot_dimension['lot_width'] + bike_lot_dimension['lot_width'];

  let car_space_usage = total_vehicles * (STALL_DEPTH * STALL_WIDTH + STALL_WIDTH * (AISLE_WIDTH/2)); //this isn't totally accurate, is slightly smaller
  // 1 football field: 57,600 ft^2
  // 1/2 football field: 28,800 ft^2
  // 1/4 football field: 14,400 ft^2
  let football_statement;
  if(14200 < car_space_usage && car_space_usage < 14600) football_statement = "That's about 1/4 of a football field.";
  else if(28600 < car_space_usage && car_space_usage < 30000) football_statement = "That's about 1/2 of a football field.";
  else if(57400 < car_space_usage && car_space_usage < 57800) football_statement = "That's about the size of <b> one football field </b>.";
  else if(car_space_usage < 57600) football_statement = "That's "  + Math.round((car_space_usage/57000) * 100) + "% of the size of a football field";
  else if(car_space_usage > 57600) football_statement = "That's equivalent to <b>"  + Math.round((car_space_usage/57000) * 100) / 100 + " football fields </b>"; //round to the nearest 10th

  measurements_text.innerHTML = `<p> To park ${total_vehicles} cars, <b>${car_space_usage} square feet </b> of space is needed at a bare minimum! ${football_statement}</p>`;

  //0 0 is the top left corner of the SVG coordinates
  //units are abstract SVG units (not pixels) - automatically scales
  let spacing = 0.07 * viewbox_width;
  svg.setAttribute("viewBox", `0 0 ${viewbox_width + spacing} ${car_lot_dimension['lot_height']} `);
  bike_lot_svg.setAttribute("transform", `translate(${car_lot_dimension['lot_width'] + spacing}, 0)`);
}

function generateLotLayout(total_vehicles, prefered_ratio)
{
  if(isPrime[total_vehicles]) //if prime it can't be a perfect rectangle (other than super long), so just try to make it square-ish
  {
    let columns = Math.round(Math.sqrt(total_vehicles * prefered_ratio)); //3x as many rows as columns
    let rows = Math.ceil(total_vehicles / columns);

    return{
      rows: rows,
      columns: columns
    };
  }
  else {
    let pairs = getFactorPairs(total_vehicles);
    let closest_pair = [pairs[0][0], pairs[0][1]]; //pair of factors closest to the desired ratio
    for( const [num1, num2] of pairs) //num1 will always be the smallest number in the pair
    {
      //console.log("factor pair: " + num1 + ", " + num2);
      //console.log(Math.abs(LOT_RATIO - num1/num2) + "<" + Math.abs(LOT_RATIO - closest_pair[0]/closest_pair[1]))
      if(Math.abs(prefered_ratio - num1/num2) < Math.abs(prefered_ratio - closest_pair[0]/closest_pair[1])) 
      {
        closest_pair = [num1, num2];
        //console.log("closest pair: " + closest_pair);
      }
    }
    return{
      rows: closest_pair[1],
      columns: closest_pair[0]
    };
  }
}

//ty claude
function getFactorPairs(n) {
  const pairs = [];
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) {
      pairs.push([i, n / i]);
    }
  }
  return pairs;
}

// Example: getFactorPairs(24)
// [[1, 24], [2, 12], [3, 8], [4, 6]]