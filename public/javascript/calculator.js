// Global variable to store material prices
let globalMaterialPrices = {};

async function fetchMaterialPrices() {
  try {
    const response = await fetch("/get-material-prices");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    globalMaterialPrices = data.reduce((acc, item) => {
      const name = item.name.replace(/\s+/g, "");
      acc[name] = item;
      return acc;
    }, {});
    console.log(globalMaterialPrices);
    updateMaterialCostPriceButton();
    updateTotalFootageAndMaterialCharge(); // Update the button after prices are fetched
  } catch (error) {
    console.error("Error fetching material prices:", error);
  }
}
async function fetchAndPopulateJobAddresses() {
  try {
    const response = await fetch('/get-job-addresses');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const addresses = await response.json();
    const addressDropdown = document.getElementById('addressDropdown');

    // Clear existing options except the first one
    while (addressDropdown.options.length > 1) {
      addressDropdown.remove(1);
    }

    // Populate the dropdown with addresses
    addresses.forEach(({ id, address }) => {
      const option = new Option(address, id);
      addressDropdown.add(option);
    });
  } catch (error) {
    console.error('Error fetching job addresses:', error);
  }
}
fetchMaterialPrices();
document.addEventListener('DOMContentLoaded', fetchAndPopulateJobAddresses);
function updateCost(inputElement, size) {
  const quantity = parseFloat(inputElement.value) || 0;
  const name = inputElement.id.replace("input", "");
  const outputId = `output${name}Cost`;
  const priceKey = `price_${size}in`;

  if (globalMaterialPrices[name]) {
    const pricePerUnit = parseFloat(globalMaterialPrices[name][priceKey]);
    const cost = quantity * pricePerUnit;
    const outputElement = document.getElementById(outputId);
    outputElement.value = cost.toFixed(2);
  }
  updateMaterialCostPriceButton(); // Update the total cost whenever individual costs are updated
}

function calculateCostComponent(quantity, itemKey, size) {
  const item = globalMaterialPrices[itemKey];
  let pricePerUnit = 0;

  if (itemKey === "Hangers") {
    pricePerUnit = parseFloat(item[`price_${size}in`]) || 0;
  } else {
    pricePerUnit = parseFloat(item.price) || 0;
  }

  return quantity * pricePerUnit;
}

// Utility function to get input value as a float
function getInputValueAsFloat(inputId) {
  return parseFloat(document.getElementById(inputId).value) || 0;
}

// Newly defined function to calculate the total accessories cost
function calculateAccessoriesCost() {
  const size = document.querySelector(".toggleButton").textContent.trim();
  const accessoriesConfig = [
    { id: "inputGutterFt", multiplier: 0.75, type: "Hangers" },
    { id: "inputGutterFt", multiplier: 0.75, type: "BigScrews" },
    { id: "inputDownspout", multiplier: 0.2, type: "BigScrews" },
    { id: "inputDownspout", multiplier: 0.4, type: "SmallScrews" },
    { id: "inputAElbow", id2: "inputBElbow", multiplier: 2, type: "SmallScrews" },
    { id: "inputOutMiter", id2: "inputInMiter", multiplier: 4, type: "SmallScrews" },
    { id: "inputOutMiter", id2: "inputInMiter", multiplier: 1/3, type: "Caulk" },
    { id: "inputSets", multiplier: 0.2, type: "Caulk" }
  ];

  let totalCost = 0;
  accessoriesConfig.forEach(accessory => {
    const inputVal = getInputValueAsFloat(accessory.id) + (accessory.id2 ? getInputValueAsFloat(accessory.id2) : 0);
    totalCost += calculateCostComponent(inputVal * accessory.multiplier, accessory.type, size);
  });

  return totalCost;
}
function calculateAccessoryQuantities() {
  const size = document.querySelector(".toggleButton").textContent.trim();
  const accessoriesConfig = [
    { id: "inputGutterFt", multiplier: 0.75, type: "Hangers" },
    { id: "inputGutterFt", multiplier: 0.75, type: "BigScrews" },
    { id: "inputDownspout", multiplier: 0.2, type: "BigScrews" },
    { id: "inputDownspout", multiplier: 0.4, type: "SmallScrews" },
    { id: "inputAElbow", id2: "inputBElbow", multiplier: 2, type: "SmallScrews" },
    { id: "inputOutMiter", id2: "inputInMiter", multiplier: 4, type: "SmallScrews" },
    { id: "inputOutMiter", id2: "inputInMiter", multiplier: 1/3, type: "Caulk" },
    { id: "inputSets", multiplier: 0.2, type: "Caulk" }
  ];

  let quantities = { Hangers: 0, BigScrews: 0, SmallScrews: 0, Caulk: 0 };
  accessoriesConfig.forEach(accessory => {
    const inputVal = getInputValueAsFloat(accessory.id) + (accessory.id2 ? getInputValueAsFloat(accessory.id2) : 0);
    quantities[accessory.type] += inputVal * accessory.multiplier;
  });

  return quantities;
}

// Utility function to get numeric value from an element
function getNumericValueById(id) {
  return parseFloat(document.getElementById(id).value) || 0;
}

// Refactored function to calculate the total material cost
function updateMaterialCostPriceButton() {
  const accessoriesCost = calculateAccessoriesCost();
  const costs = [
    "outputGutterFtCost", "outputDownspoutCost", "outputAElbowCost",
    "outputBElbowCost", "outputInMiterCost", "outputOutMiterCost",
    "outputSetsCost", "outputAdapterCost", "outputFilterCost"
  ].map(getNumericValueById);

  const totalCost = costs.reduce((acc, cost) => acc + cost, accessoriesCost);
  
  document.getElementById("materialCostPrice").textContent = totalCost.toFixed(2);
  updateTotalFootageAndMaterialCharge();
}
// Helper function to update cost based on input and size toggle
function updateCostForInputs(sizeToggle) {
  document.querySelectorAll(".inputField").forEach(input => updateCost(input, sizeToggle));
}

function initializeEventListeners() {
  const sizeToggle = document.querySelector(".toggleButton"); // Adjust selector if needed
  const colorDropdown = document.getElementById("colorDropdown"); // Ensure this matches your dropdown's ID

  // Update the color dropdown on page load
  updateColorDropdown(sizeToggle, colorDropdown);

  document.querySelectorAll(".inputField").forEach(input => {
    input.addEventListener("input", () => {
      const size = sizeToggle.textContent.trim();
      updateCost(input, size);
      updateMaterialCostPriceButton();
    });
  });

  document.querySelectorAll(".toggleButton").forEach(button => {
    button.addEventListener("click", () => {
      button.textContent = button.textContent.trim() === "5" ? "6" : "5";
      updateCostForInputs(sizeToggle.textContent.trim());
      updateMaterialCostPriceButton();
      updateTotalFootageAndMaterialCharge();
      // Call updateColorDropdown whenever the size toggle changes
      updateColorDropdown(sizeToggle, colorDropdown);
    });
  });

  // Add event listener to addressDropdown to print input values to console
// Assuming this is within your initializeEventListeners function or at a relevant place in your code
const addressDropdown = document.getElementById('addressDropdown');
addressDropdown.addEventListener('change', async function() {
  let combinedValues = {};

  const selectedJobId = this.value; 
  const materialCharge = parseFloat(document.getElementById("materialCharge").textContent) || 0;
  const materialCostPrice = parseFloat(document.getElementById("materialCostPrice").textContent) || 0;

  combinedValues['selectedJobId'] = selectedJobId;
  combinedValues['materialCharge'] = materialCharge;
  combinedValues['materialCostPrice'] = materialCostPrice;

  // Assuming inputFields are correctly identified
  const inputFields = document.querySelectorAll('.toggleContainer .inputField');
  inputFields.forEach(input => {
      combinedValues[input.id] = parseFloat(input.value) || 0;
  });

  // Assuming sizeToggleGutterFt is correctly identified
  const sizeToggleGutterFt = document.querySelector('.toggleButton').textContent.trim();
  combinedValues['sizeToggleGutterFt'] = sizeToggleGutterFt;
  
  // Assuming calculateAccessoryQuantities function exists and works correctly
  const accessoryQuantities = calculateAccessoryQuantities();
  Object.assign(combinedValues, accessoryQuantities);

  // Assuming colorDropdown is correctly identified
  const colorDropdown = document.getElementById('colorDropdown');
  combinedValues['selectedColor'] = colorDropdown.value;

  // Now, submit combinedValues
  await submitJobData(combinedValues);
  console.log(combinedValues);
});
}
// Invoke to set up the event listeners
document.addEventListener('DOMContentLoaded', initializeEventListeners);
// Utility function to fetch element and avoid repetition
function getElementById(id) {
  return document.getElementById(id);
}

// Utility function to set text content for an element
function setTextContent(id, text) {
  const element = getElementById(id);
  if (element) element.textContent = text;
}

// Utility function to get numeric value from an input
function getNumericInputValue(id) {
  return parseFloat(getElementById(id).value) || 0;
}

function updateColorDropdown(sizeToggle, colorDropdown) {
  let colors;
  if (sizeToggle.innerHTML === "5") {
    colors = [
      "002 Linen",
      "111 Heather",
      "102 Pearl Gray",
      "105 Antique Ivory",
      "112 Tuxedo Gray",
      "130 Low Gloss White",
      "138 Shell",
      "140 Almond A",
      "173 Olive Green",
      "175 Pewter",
      "177 Sandy Beige",
      "200 Black",
      "202 Royal Brown",
      "204 Grecian Green",
      "214 Woodland Green",
      "219 Almond Cream",
      "223 Imperial Brown",
      "224 Buckskin",
      "238 Clay",
      "250 Musket Brown",
      "253 Light Bronze",
      "255 Cypress",
      "301 Dark Gray",
      "325 Sandstone Beige",
      "327 Desert Tan",
      "339 Dark Bronze",
      "355 Light Maple",
      "360 Terratone",
      "712 Wicker",
      "713 Wicker",
      "780 Coppertone",
      "791 Norwood",
      "793 Sand",
      "794 Almond",
      "810 Shale",
      "817 Cream",
      "819 Herringbone",
      "820 Cranberry",
      "821 Ivy Green",
      "822 Pacific Blue",
      "827 Champagne",
      "891 Buckskin",
      "901 Ivory",
    ];
  } else if (sizeToggle.innerHTML === "6") {
    colors = [
      "102 Pearl Gray",
      "105 Antique Ivory",
      "112 Tuxedo Gray",
      "130 Low Gloss White",
      "140 Almond AR",
      "200 Black",
      "202 Royal Brown",
      "204 Grecian Green",
      "209 Scotch Red",
      "219 Almond Cream",
      "224 Buckskin",
      "238 Clay",
      "250 Musket Brown",
      "253 Light Bronze",
      "325 Sandstone Beige",
      "339 Dark Bronze",
      "360 Terratone",
      "429 Ocean Blue",
      "712 Wicker",
      "713 Wicker",
      "780 Coppertone",
      "791 Norwood",
      "819 Herringbone",
    ];
  }

  // clear the dropdown
  colorDropdown.innerHTML = "";

  // populate the dropdown
  colors.forEach((color) => {
    let option = document.createElement("option");
    option.value = color;
    option.text = color;
    colorDropdown.add(option);
  });

  console.log("Color dropdown updated");
}

// Event listener for DOMContentLoaded to handle slider and display updates
document.addEventListener("DOMContentLoaded", () => {
  const slider = getElementById("pricePerFootSelector");

  // Function to update display and recalculate material charge
  const updateDisplayAndMaterialCharge = () => {
    setTextContent("pricePerFootDisplay", slider.value);
    updateTotalFootageAndMaterialCharge(); // Assumes this function is already defined
  };

  // Initialize and add event listener for slider input changes
  updateDisplayAndMaterialCharge();
  slider.addEventListener("input", updateDisplayAndMaterialCharge);
});

function updateTotalFootageAndMaterialCharge() {
  const inputs = ['inputOutMiter', 'inputInMiter', 'inputAElbow', 'inputBElbow', 'inputDownspout', 'inputGutterFt', 'inputFilter'];
  const totalFootage = inputs.reduce((acc, id) => {
    let value = getNumericInputValue(id);
    // Check if the input is for Out Miter or In Miter and apply multiplication
    if (id === 'inputOutMiter' || id === 'inputInMiter') {
      value *= 3; // Multiply by 3 for these specific inputs
    }
    return acc + value;
  }, 0);
  const pricePerFoot = getNumericInputValue("pricePerFootSelector");
  let materialCharge = Math.ceil((pricePerFoot * totalFootage) / 50) * 50;

  // Calculate material charge percentage
  const materialCostPrice = parseFloat(document.getElementById("materialCostPrice").textContent) || 0;
  let materialChargePercentage = materialCharge > 0 ? (materialCostPrice / materialCharge) * 100 : 0;

  // Update display elements
  setTextContent("materialTotalFootage", Math.round(totalFootage));
  setTextContent("materialCharge", Math.round(materialCharge));
  setTextContent("materialChargePercentage", `${Math.round(materialChargePercentage)}%`);
}


async function submitJobData(combinedValues) {
  // Round up BigScrews and Hangers before submitting
  if (combinedValues.BigScrews !== undefined) {
    combinedValues.BigScrews = Math.ceil(combinedValues.BigScrews);
  }
  if (combinedValues.Hangers !== undefined) {
    combinedValues.Hangers = Math.ceil(combinedValues.Hangers);
  }

  try {
    const response = await fetch('/insert-job-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(combinedValues),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log(result.message);
    // Optionally, show a success message to the user
    // Clear input fields after successful submission
    clearInputFields();
  } catch (error) {
    console.error("Error submitting job data:", error);
    // Optionally, show an error message to the user
  }
}

function clearInputFields() {
  document.querySelectorAll('.inputField').forEach(input => {
    input.value = ''; // Clear each input field
  });
}