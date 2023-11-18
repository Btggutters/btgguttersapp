
const prices = {
    "ft": { "5": 1.14, "6": 2.05 },
    "DS": { "5": 1.29, "6": 1.76 },
    "A": { "5": 1.22, "6": 1.86 },
    "B": { "5": 1.22, "6": 1.86 },
    "In": { "5": 2.86, "6": 7.14 },
    "Out": { "5": 2.86, "6": 7.14 },
    "Sets": { "5": 1.30, "6": 2.82 },
    "Hangers": { "5": 0.18, "6": 0.31 },
    "Small Screws": 0.03,
    "Big Screws": 0.04,
    "Caulk": 6.09,
};

function setupToggleContainer(inputId, firstOutputFieldId, secondOutputFieldId, toggleButtonId, priceKey) {
    var ftInput = document.querySelector('#' + inputId);
    var firstOutputField = document.querySelector('#' + firstOutputFieldId);
    var secondOutputField = document.querySelector('#' + secondOutputFieldId);
    var toggleButton = document.querySelector('#' + toggleButtonId);
    function calculateTotalMaterialCharge() {
        var total = 0;
        var pricePerFootInput = document.querySelector('.pricePerFoot');
        var pricePerFoot = parseFloat(pricePerFootInput.value);
        for (var i = 1; i <= 7; i++) {
            if (i === 7) { // Skip 'Sets'
                continue;
            }
            var inputField = document.querySelector('#inputField' + i);
            var inputValue = parseFloat(inputField.value);
            if (!isNaN(inputValue)) {
                if (i === 5 || i === 6) { // 'In' and 'Out'
                    inputValue *= 3;
                }
                var outputValue = inputValue * pricePerFoot;
                total += outputValue;
                // Update the corresponding secondOutputField
                if (i !== 7) { // Don't update secondOutputField7
                    var secondOutputField = document.querySelector('#secondOutputField' + i);
                    secondOutputField.value = outputValue.toFixed(2);
                }
            }
        }
        var materialChargePrice = document.querySelector('#materialChargePrice');
        materialChargePrice.textContent = '$' + total.toFixed(2);
        calculateMargin();
    
    }
    function calculateTotalMaterialCost() {
        var total = 0;
        for (var i = 1; i <= 7; i++) {
            var firstOutputField = document.querySelector('#firstOutputField' + i);
            var value = parseFloat(firstOutputField.value);
            if (!isNaN(value)) {
                total += value;
            }
        }
        // Add accessories cost
        var accessoriesCost = parseFloat(document.querySelector('#firstOutputField8').value);
        if (!isNaN(accessoriesCost)) {
            total += accessoriesCost;
        }
        var materialCostPrice = document.querySelector('#materialCostPrice');
        materialCostPrice.textContent = '$' + total.toFixed(2);
    
        calculateMargin();
    }
    function calculateMargin() {
        var materialCostPrice = parseFloat(document.querySelector('#materialCostPrice').textContent.replace('$', ''));
        var materialChargePrice = parseFloat(document.querySelector('#materialChargePrice').textContent.replace('$', ''));
    
        if (!isNaN(materialCostPrice) && !isNaN(materialChargePrice) && materialChargePrice !== 0) {
            var margin = (materialChargePrice - materialCostPrice) / materialChargePrice * 100;
            document.querySelector('#materialChargePrice').textContent += ' (' + margin.toFixed(2) + '%)';
        }
    }
    function calculateAccessoriesCost() {
        var hangersSize = document.querySelector('#toggleButton1').textContent;
        var hangersPrice = prices["Hangers"][hangersSize];
        var bigScrewsPrice = prices["Big Screws"];
        var quantity = parseFloat(document.querySelector('#inputField4').value);
    
        var inputField5 = parseFloat(document.querySelector('#inputField5').value);
        var inputField6 = parseFloat(document.querySelector('#inputField6').value);
        var totalMiters = inputField5 + inputField6;
    
        var toggleButton6Size = document.querySelector('#toggleButton6').textContent;
        if (toggleButton6Size === "5") {
            totalMiters /= 3;
        } else if (toggleButton6Size === "6") {
            totalMiters /= 2;
        }
    
        var caulkCost = totalMiters * prices["Caulk"];
    
        console.log('Hangers size: ' + hangersSize);
        console.log('Hangers price: ' + hangersPrice);
        console.log('Big Screws price: ' + bigScrewsPrice);
        console.log('Quantity: ' + quantity);
        console.log('Total Miters: ' + totalMiters);
        console.log('Caulk Cost: ' + caulkCost);
    
        if (!isNaN(hangersPrice) && !isNaN(bigScrewsPrice) && !isNaN(quantity)) {
            var total = ((hangersPrice + bigScrewsPrice) * 0.75 * quantity) + caulkCost;
            console.log('Total: ' + total);
            var firstOutputField8 = document.querySelector('#firstOutputField8');
            firstOutputField8.value = total.toFixed(2);
        }
    }

    function calculateAndUpdate(toggleButton, ftInput, firstOutputField, secondOutputField, priceKey) {
        var ft = parseInt(ftInput.value);
        var toggleValue = (toggleButton && toggleButton.innerHTML === "6") ? "6" : "5";
    
        if (isNaN(ft)) {
            firstOutputField.value = '';
            secondOutputField.value = '';
            return;
        }
    
        var cost = ft * prices[priceKey][toggleValue];
        firstOutputField.value = Math.round(cost);
    
        var pricePerFootInput = document.querySelector('.pricePerFoot');
        var pricePerFoot = parseFloat(pricePerFootInput.value);
        if (!isNaN(pricePerFoot)) {
            var potentialPrice = ft * pricePerFoot;
            secondOutputField.value = Math.round(potentialPrice);
        }
        console.log('ft:', ft);
        console.log('pricePerFoot:', pricePerFoot);
        console.log('potentialPrice:', potentialPrice);
        calculateTotalMaterialCost();
        calculateTotalMaterialCharge();
        calculateAccessoriesCost();
    }

    toggleButton.addEventListener('click', function() {
        if (this.innerHTML === "5") {
            this.innerHTML = "6";
        } else {
            this.innerHTML = "5";
        }

        calculateAndUpdate(this, ftInput, firstOutputField, secondOutputField, priceKey);
    });

    ftInput.addEventListener('input', function() {
        calculateAndUpdate(null, ftInput, firstOutputField, secondOutputField, priceKey);
    });
    var pricePerFootInput = document.querySelector('.pricePerFoot');
    pricePerFootInput.addEventListener('input', function() {
        // Update the display
        var pricePerFoot = document.querySelector('#pricePerFoot');
        pricePerFoot.textContent = '$' + this.value + ' /ft';
    
        calculateAndUpdate(null, document.querySelector('#inputField1'), document.querySelector('#firstOutputField1'), document.querySelector('#secondOutputField1'), 'ft');
        calculateAndUpdate(null, document.querySelector('#inputField2'), document.querySelector('#firstOutputField2'), document.querySelector('#secondOutputField2'), 'DS');
        calculateAndUpdate(null, document.querySelector('#inputField3'), document.querySelector('#firstOutputField3'), document.querySelector('#secondOutputField3'), 'A');
        calculateAndUpdate(null, document.querySelector('#inputField4'), document.querySelector('#firstOutputField4'), document.querySelector('#secondOutputField4'), 'B');
        calculateAndUpdate(null, document.querySelector('#inputField5'), document.querySelector('#firstOutputField5'), document.querySelector('#secondOutputField5'), 'In');
        calculateAndUpdate(null, document.querySelector('#inputField6'), document.querySelector('#firstOutputField6'), document.querySelector('#secondOutputField6'), 'Out');
    });
}

// Call setupToggleContainer for each of your containers
setupToggleContainer('inputField1', 'firstOutputField1', 'secondOutputField1', 'toggleButton1', 'ft');
setupToggleContainer('inputField2', 'firstOutputField2', 'secondOutputField2', 'toggleButton2', 'DS');
setupToggleContainer('inputField3', 'firstOutputField3', 'secondOutputField3', 'toggleButton3', 'A');
setupToggleContainer('inputField4', 'firstOutputField4', 'secondOutputField4', 'toggleButton4', 'B');
setupToggleContainer('inputField5', 'firstOutputField5', 'secondOutputField5', 'toggleButton5', 'In');
setupToggleContainer('inputField6', 'firstOutputField6', 'secondOutputField6', 'toggleButton6', 'Out');
setupToggleContainer('inputField7', 'firstOutputField7', 'secondOutputField7', 'toggleButton7', 'Sets');

