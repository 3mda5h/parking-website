import { GenerateCarLot } from "./car-parking.js";

//https://www.dimensions.com/element/90-degree-parking-spaces-layouts
//measurements are converted to inches to use same scale as bike parking
const STALL_WIDTH = 8.5 * 12
const STALL_DEPTH = 18 * 12
const AISLE_WIDTH = 24 * 12

const svg = document.getElementById("lot-svg");

let generate_button = document.getElementById("generate-parking-lot-button");
generate_button.addEventListener("click", GenerateLotComparison);

function GenerateLotComparison()
{
  const total_stalls = Math.round(Number(document.getElementById("total-cars-input").value));
  if(isNaN(total_stalls)) total_stalls = 20;
  else if(total_stalls > 100000 ) total_stalls = 100000; 
  let stall_columns; //number of parking stall columns
  let stall_rows; //number of parking stall rows
  let aisle_columns; //number of columns that make up the aisles between parking spaces

  if(total_stalls <= 11) stall_rows = total_stalls; //keep really small parking lots as just one column for simplicity
  else stall_rows = Math.ceil(Math.sqrt(total_stalls * (STALL_DEPTH / STALL_WIDTH))); //try to keep a good aspect ratio for bigger lots
  stall_columns = Math.ceil(total_stalls / stall_rows);
  aisle_columns = Math.ceil(stall_columns/2);

  console.log("stall rows: ", stall_rows);
  console.log("stall columns: ", stall_columns);
  console.log("aisles columns: ", aisle_columns)

  GenerateCarLot(total_stalls, stall_columns, stall_rows, aisle_columns, STALL_WIDTH, STALL_DEPTH, AISLE_WIDTH);
  
  //0 0 is the top left corner of the SVG coordinates
  //units are abstract SVG units (not pixels) - automatically scales
  svg.setAttribute("viewBox", `0 0 ${(stall_columns * STALL_DEPTH) + (aisle_columns * AISLE_WIDTH)} ${stall_rows * STALL_WIDTH} `);
}