// Define the sizes, prices, items, and accessories
const prices = { "Gutter": { "5": 1.14, "6": 2.05 }, "DS": { "5": 1.29, "6": 1.76 }, "A": { "5": 1.22, "6": 1.86 }, "B": { "5": 1.22, "6": 1.86 }, "In": { "5": 2.86, "6": 7.14 }, "Out": { "5": 2.86, "6": 7.14 }, "Sets": { "5": 1.30, "6": 2.82 }, "Hangers": { "5": 0.18, "6": 0.31 }, "Small Screws": 0.03, "Big Screws": 0.04, "Caulk": 6.09 };
const items = ["Gutter", "DS", "A", "B", "In", "Out", "Sets"];
let accessories = { "Hangers": 0, "Big Screws": 0, "Small Screws": 0, "Caulk": 0 };
// Define the functions
const calculateCost = (pricePerFoot, value) => value * pricePerFoot;
const calculateCharge = cost => cost * 5;

// Function to initialize all output fields to "$0"
function initializeOutputFields() {
    items.forEach(item => {
        document.querySelector(`#outputField${item}Cost`).value = "$0";
        document.querySelector(`#outputField${item}Charge`).value = "$0";
    });
    document.querySelector('#outputFieldAccessoriesCost').value = "$0";
    document.querySelector('#outputFieldAccessoriesCharge').value = "$0"; // Add this line
    document.querySelector('#materialCostPrice').value = "$0";
    document.querySelector('#materialChargePrice').value = "$0";
    document.querySelector('#materialPerFootPrice').value = "$0";

}
function calculateTotalMaterialCost() {
    let totalCost = 0;
    items.forEach(item => {
        let outputCost = document.querySelector(`#outputField${item}Cost`).value;
        // Remove the dollar sign and convert to number
        let cost = parseFloat(outputCost.replace('$', ''));
        totalCost += cost;
    });
    // Add the accessories cost
    let accessoriesCost = parseFloat(document.querySelector('#outputFieldAccessoriesCost').value.replace('$', ''));
    totalCost += accessoriesCost;
    // Update the materialCostPrice
    document.querySelector('#materialCostPrice').value = "$" + Math.ceil(totalCost);
}
function calculateTotalMaterialCharge() {
    let totalCharge = 0;
    items.forEach(item => {
        let outputCharge = document.querySelector(`#outputField${item}Charge`).value;
        // Remove the dollar sign and convert to number
        let charge = parseFloat(outputCharge.replace('$', ''));
        totalCharge += charge;
    });
    // Add the accessories charge
    let accessoriesCharge = parseFloat(document.querySelector('#outputFieldAccessoriesCharge').value.replace('$', ''));
    totalCharge += accessoriesCharge;
    // Update the materialChargePrice
    document.querySelector('#materialChargePrice').value = "$" + Math.ceil(totalCharge);
}
function calculateMaterialPerFootPrice() {
    let inputGutter = parseFloat(document.querySelector('#inputGutter').value) || 0;
    let inputDS = parseFloat(document.querySelector('#inputDS').value) || 0;
    let inputA = parseFloat(document.querySelector('#inputA').value) || 0;
    let inputB = parseFloat(document.querySelector('#inputB').value) || 0;
    let inputIn = parseFloat(document.querySelector('#inputIn').value) || 0;
    let inputOut = parseFloat(document.querySelector('#inputOut').value) || 0;
    let pricePerFootSelector = parseFloat(document.querySelector('#pricePerFootSelector').value) || 0;

    let materialPerFootPrice = (inputGutter + inputDS + inputA + inputB + ((inputIn + inputOut) * 3)) * pricePerFootSelector;

    // Update the materialPerFootPrice
    document.querySelector('#materialPerFootPrice').value = "$" + Math.ceil(materialPerFootPrice);
}

// Add event listeners
items.forEach(item => {
    let input = document.querySelector(`#input${item}`);
    let outputCost = document.querySelector(`#outputField${item}Cost`);
    let outputCharge = document.querySelector(`#outputField${item}Charge`);
    let sizeToggle = document.querySelector(`#sizeToggleFor${item}`);
    sizeToggle.textContent = '5';
    sizeToggle.addEventListener('click', () => {
        sizeToggle.textContent = sizeToggle.textContent === '5' ? '6' : '5';
        input.dispatchEvent(new Event('input'));
    });
    input.addEventListener('input', () => {
        let size = sizeToggle.textContent;
        let pricePerFoot = prices[item][size];
        let cost = calculateCost(pricePerFoot, input.value);
        outputCost.value = "$" + Math.ceil(cost);
        outputCharge.value = "$" + Math.ceil(calculateCharge(cost));
        calculateAccessoriesCost();
        calculateTotalMaterialCharge();
        ['inputGutter', 'inputDS', 'inputA', 'inputB', 'inputIn', 'inputOut', 'pricePerFootSelector'].forEach(id => {
            document.querySelector(`#${id}`).addEventListener('input', calculateMaterialPerFootPrice);
        });
    });
});

function calculateAccessoriesCost() {
    // Reset the accessories object to zero
    accessories = { "Hangers": 0, "Big Screws": 0, "Small Screws": 0, "Caulk": 0 };

    let accessoriesCost = 0;
    let totalCaulk = 0;

    items.forEach(item => {
        let input = document.querySelector(`#input${item}`);
        let inputValue = parseFloat(input.value) || 0;
        let size = document.querySelector(`#sizeToggleFor${item}`).textContent; // Get the size

        // Calculate the cost of caulk and screws
        switch(item) {
            case "Gutter":
                accessories["Hangers"] += inputValue * 0.56;
                accessories["Big Screws"] += inputValue * 0.56;
                accessoriesCost += inputValue * 0.56 * prices["Hangers"][size];
                accessoriesCost += inputValue * 0.56 * prices["Big Screws"];
                break;
            case "DS":
                accessories["Small Screws"] += Math.ceil(inputValue / 10) * 4;
                accessoriesCost += Math.ceil(inputValue / 10) * 4 * prices["Small Screws"];
                break;
            case "A":
            case "B":
                accessories["Small Screws"] += inputValue * 2;
                accessoriesCost += inputValue * 2 * prices["Small Screws"];
                break;
            case "In":
            case "Out":
                totalCaulk += inputValue * (size === '5' ? 1/3 : 1/2);
                accessories["Small Screws"] += inputValue * 4;
                accessories["Big Screws"] += inputValue * 2;
                accessoriesCost += inputValue * (4 * prices["Small Screws"] + 2 * prices["Big Screws"]);
                break;
            case "Sets":
                totalCaulk += inputValue * (size === '5' ? 1/5 : 1/4);
                break;
            case "Caps":
                totalCaulk += inputValue * 0.25;
                break;
        }
    });

    accessories["Caulk"] = Math.ceil(totalCaulk);
    accessoriesCost += accessories["Caulk"] * prices["Caulk"];

    // Update the accessories cost field
    let outputFieldAccessoriesCost = document.querySelector('#outputFieldAccessoriesCost');
    outputFieldAccessoriesCost.value = "$" + Math.ceil(accessoriesCost);

    // Calculate and update the charge for accessories
    let accessoriesCharge = calculateCharge(accessoriesCost);
    let outputFieldAccessoriesCharge = document.querySelector('#outputFieldAccessoriesCharge');
    outputFieldAccessoriesCharge.value = "$" + Math.ceil(accessoriesCharge);

    calculateTotalMaterialCost();
    calculateTotalMaterialCharge();
}
document.querySelector('.accessoriesButton').addEventListener('click', () => {
    alert(Object.entries(accessories).map(([key, value]) => `${Math.ceil(value)} ${key}`).join(', '));
});

// Initialize output fields on page load
window.onload = initializeOutputFields;