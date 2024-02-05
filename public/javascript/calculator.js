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

fetchMaterialPrices();

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

// Newly defined function to calculate the total accessories cost
function calculateAccessoriesCost() {
  const size = document.querySelector(".toggleButton").textContent.trim();
  const inputGutterFt =
    parseFloat(document.getElementById("inputGutterFt").value) || 0;
  const inputDownspout =
    parseFloat(document.getElementById("inputDownspout").value) || 0;
  const inputAElbow =
    parseFloat(document.getElementById("inputAElbow").value) || 0;
  const inputBElbow =
    parseFloat(document.getElementById("inputBElbow").value) || 0;
  const inputOutMiter =
    parseFloat(document.getElementById("inputOutMiter").value) || 0;
  const inputInMiter =
    parseFloat(document.getElementById("inputInMiter").value) || 0;
  const inputSets = parseFloat(document.getElementById("inputSets").value) || 0;

  accessoryCostDetails = {
    gutterHangerCost: calculateCostComponent(
      inputGutterFt * 0.75,
      "Hangers",
      size
    ),
    gutterBigScrewCost: calculateCostComponent(
      inputGutterFt * 0.75,
      "BigScrews",
      size
    ),
    downspoutBigScrewCost: calculateCostComponent(
      (inputDownspout / 10) * 2,
      "BigScrews",
      size
    ),
    downspoutSmallScrewCost: calculateCostComponent(
      (inputDownspout / 10) * 4,
      "SmallScrews",
      size
    ),
    elbowsSmallScrewPrice: calculateCostComponent(
      (inputAElbow + inputBElbow) * 2,
      "SmallScrews",
      size
    ),
    mitersSmallScrewPrice: calculateCostComponent(
      (inputOutMiter + inputInMiter) * 4,
      "SmallScrews",
      size
    ),
    mitersCaulkPrice: calculateCostComponent(
      (inputOutMiter + inputInMiter) / 3,
      "Caulk",
      size
    ),
    setsCaulkPrice: calculateCostComponent(inputSets / 5, "Caulk", size),
  };
  // Calculate the total cost by summing the individual costs
  return Object.values(accessoryCostDetails).reduce(
    (acc, cost) => acc + cost,
    0
  );
}

// This function needs to be updated to correctly calculate 'accessoriesCost'
function updateMaterialCostPriceButton() {
  const accessoriesCost = calculateAccessoriesCost(); // Use the newly defined function

  const outputGutterFtCost =
    parseFloat(document.getElementById("outputGutterFtCost").value) || 0;
  const outputDownspoutCost =
    parseFloat(document.getElementById("outputDownspoutCost").value) || 0;
  const outputAElbowCost =
    parseFloat(document.getElementById("outputAElbowCost").value) || 0;
  const outputBElbowCost =
    parseFloat(document.getElementById("outputBElbowCost").value) || 0;
  const outputInMiterCost =
    parseFloat(document.getElementById("outputInMiterCost").value) || 0;
  const outputOutMiterCost =
    parseFloat(document.getElementById("outputOutMiterCost").value) || 0;
  const outputSetsCost =
    parseFloat(document.getElementById("outputSetsCost").value) || 0;

  // Calculate the total cost by adding the output costs and accessories cost
  const totalCost =
    outputGutterFtCost +
    outputDownspoutCost +
    outputAElbowCost +
    outputBElbowCost +
    outputInMiterCost +
    outputOutMiterCost +
    outputSetsCost +
    accessoriesCost;

  // Update the button text with the total cost
  const materialCostPriceButton = document.getElementById("materialCostPrice");
  materialCostPriceButton.textContent = totalCost.toFixed(2);
  updateTotalFootageAndMaterialCharge();
}

document.querySelectorAll(".inputField").forEach((input) => {
  input.addEventListener("input", (event) => {
    const sizeToggle = document
      .querySelector(".toggleButton")
      .textContent.trim(); // Assuming a single size toggle for simplicity
    updateCost(event.target, sizeToggle);
  });
});

document.querySelectorAll(".toggleButton").forEach((button) => {
  button.addEventListener("click", () => {
    button.textContent = button.textContent.trim() === "5" ? "6" : "5";
    document.querySelectorAll(".inputField").forEach((input) => {
      const sizeToggle = document
        .querySelector(".toggleButton")
        .textContent.trim();
      updateCost(input, sizeToggle); // Recalculate costs with the new size
    });
    updateMaterialCostPriceButton();
    updateTotalFootageAndMaterialCharge(); // Ensure total cost is updated when the size toggle changes
  });
});
document
  .getElementById("materialCostPrice")
  .addEventListener("click", function () {
    // Use the global `accessoryCostDetails` object to access the cost variables
    const message = `
    Gutter hanger cost: ${accessoryCostDetails.gutterHangerCost}\n
    Gutter big screw cost: ${accessoryCostDetails.gutterBigScrewCost}\n
    Downspout big screw cost: ${accessoryCostDetails.downspoutBigScrewCost}\n
    Downspout small screw cost: ${accessoryCostDetails.downspoutSmallScrewCost}\n
    Elbows small screw cost: ${accessoryCostDetails.elbowsSmallScrewPrice}\n
    Miters small screw cost: ${accessoryCostDetails.mitersSmallScrewPrice}\n
    Miters caulk cost: ${accessoryCostDetails.mitersCaulkPrice}\n
    Sets caulk cost: ${accessoryCostDetails.setsCaulkPrice}
  `;

    alert(message);
  });

  document.addEventListener("DOMContentLoaded", function () {
    const slider = document.getElementById("pricePerFootSelector");
    const display = document.getElementById("pricePerFootDisplay");
  
    // Function to update display with slider's value and recalculate material charge
    function updateDisplayAndMaterialCharge() {
      display.textContent = slider.value;
      updateTotalFootageAndMaterialCharge(); // Recalculate and update material charge
    }
  
    // Initialize display with the default slider value and update material charge
    updateDisplayAndMaterialCharge();
  
    // Add event listener to update display and material charge whenever slider value changes
    slider.addEventListener("input", updateDisplayAndMaterialCharge);
  });

  function updateTotalFootageAndMaterialCharge() {
    // Existing code to calculate totalFootage and materialCharge
    const inputOutMiter = parseFloat(document.getElementById("inputOutMiter").value) || 0;
    const inputInMiter = parseFloat(document.getElementById("inputInMiter").value) || 0;
    const inputAElbow = parseFloat(document.getElementById("inputAElbow").value) || 0;
    const inputBElbow = parseFloat(document.getElementById("inputBElbow").value) || 0;
    const inputDownspout = parseFloat(document.getElementById("inputDownspout").value) || 0;
    const inputGutterFt = parseFloat(document.getElementById("inputGutterFt").value) || 0;
    const totalFootage = (inputOutMiter + inputInMiter) * 3 + inputAElbow + inputBElbow + inputDownspout + inputGutterFt;
  
    const pricePerFoot = parseFloat(document.getElementById("pricePerFootSelector").value) || 0;
    let materialCharge = pricePerFoot * totalFootage;
    materialCharge = Math.ceil(materialCharge / 25) * 25;
  
    // Fetch the materialCostPrice from the button's text content
    const materialCostPriceButton = document.getElementById("materialCostPrice");
    let materialCostPrice = parseFloat(materialCostPriceButton.textContent) || 0;
  
    // Calculate materialChargePercentage
    let materialChargePercentage = 0;
    if (materialCharge > 0) { // Prevent division by zero
      materialChargePercentage = (materialCostPrice / materialCharge) * 100; // Convert to percentage
    }
  
    // Update <output> elements
    document.getElementById("materialTotalFootage").textContent = Math.round(totalFootage);
    document.getElementById("materialCharge").textContent = Math.round(materialCharge);
    document.getElementById("materialChargePercentage").textContent = Math.round(materialChargePercentage) + '%'; // Display as a percentage with two decimal places
  }
