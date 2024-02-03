document.addEventListener('DOMContentLoaded', function() {
    // Function to round to the nearest increment of 25
  function roundToNearest25(num) {
    return Math.ceil(num / 25) * 25;
  }
  let materialPrices = {}; // Object to store fetched material prices
  let totalCost = 0; // Initialize total cost

  // Existing code for updating the price per foot display
  const pricePerFootSelector = document.getElementById('pricePerFootSelector');
  const pricePerFootDisplay = document.getElementById('pricePerFootDisplay');

  function updatePriceDisplay() {
    pricePerFootDisplay.textContent = pricePerFootSelector.value;
    calculatePricePerFoot();
    updateMaterialChargePercentage();
  }
  function calculatePricePerFoot() {
    // Retrieve values from input fields
    const inMiter = parseFloat(document.getElementById('inputInMiter').value) || 0;
    const outMiter = parseFloat(document.getElementById('inputOutMiter').value) || 0;
    const aElbow = parseFloat(document.getElementById('inputAElbow').value) || 0;
    const bElbow = parseFloat(document.getElementById('inputBElbow').value) || 0;
    const downspoutFt = parseFloat(document.getElementById('inputDownspoutFt').value) || 0;
    const gutterFt = parseFloat(document.getElementById('inputGutterFt').value) || 0;
    
    // Retrieve the price per foot value
    const pricePerFoot = parseFloat(document.getElementById('pricePerFootDisplay').textContent) || 0;
    
    // Calculate the material charge
    const materialCharge = (((inMiter + outMiter) * 3) + aElbow + bElbow + downspoutFt + gutterFt) * pricePerFoot;
    // Round the materialCharge using your existing function
    const roundedMaterialCharge = roundToNearest25(materialCharge)
    // Update the material charge output with rounded value
    document.getElementById('materialCharge').textContent = roundedMaterialCharge;
    // Trigger update for materialChargePercentage
    updateMaterialChargePercentage();}
  updatePriceDisplay(); // Initialize the display with the default value
  pricePerFootSelector.addEventListener('input', updatePriceDisplay); // Add event listener

   // Fetch material prices and store them
  function fetchMaterialPrices() {
    fetch('/get-material-prices')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched material prices:', data); // Log fetched data
        data.forEach(item => {
          // Standardize the name to match the format used in IDs
          const standardizedKey = item.name.replace(/\s+/g, '').replace('Ft', ''); // Example: 'GutterFt' becomes 'Gutter'
          materialPrices[standardizedKey] = {price_5in: item.price_5in, price_6in: item.price_6in};
        });
        console.log('Material prices object after fetching and storing:', materialPrices); // Log the structured object
      })
      .catch(error => console.error('Error fetching material prices:', error));
  }

  function calculateAndUpdateCost(materialType) {
    // Standardize the materialType to match the keys in materialPrices
    const standardizedMaterialType = materialType.replace(/\s+/g, '').replace('Ft', ''); // Adjust as necessary
    if (materialPrices[standardizedMaterialType]) {
      const sizeToggle = document.getElementById(`sizeToggle${materialType}`).textContent; // Get the size toggle value (5 or 6)
      const inputQuantity = document.getElementById(`input${materialType}`).value; // Get the input quantity
      const priceKey = `price_${sizeToggle}in`; // Construct the price key based on size
      const cost = materialPrices[standardizedMaterialType][priceKey] * inputQuantity; // Calculate cost
      document.getElementById(`output${materialType}Cost`).textContent = cost.toFixed(2); // Update the output field
      
      // Update total cost
      updateTotalCost(cost);
    } else {
      console.error(`No prices found for material type: ${standardizedMaterialType}`);
    }
  }

  // Event listener for input changes
  document.querySelectorAll('.inputField').forEach(input => {
    input.addEventListener('input', () => {
      const materialType = input.id.replace('input', ''); // Extract material type from input id
      console.log(`Input field changed for material type: ${materialType}`); // Log the material type on input change
      calculateAndUpdateCost(materialType);
      calculatePricePerFoot();
      updateMaterialChargePercentage();
    });
  });

  // Event listener for toggle button changes
  document.querySelectorAll('.toggleButton').forEach(button => {
    button.addEventListener('click', () => {
      const materialType = button.id.replace('sizeToggle', ''); // Extract material type from button id
      console.log(`Toggle button clicked for material type: ${materialType}`); // Log the material type on toggle
      button.textContent = button.textContent === '5' ? '6' : '5'; // Toggle between 5 and 6
      calculateAndUpdateCost(materialType);
      updateMaterialChargePercentage();
    });
  });

  function updateTotalCost(newCost) {
    totalCost += newCost; // Add the new cost to the total cost
    // Round totalCost to the nearest whole number
    const roundedTotalCost = Math.ceil(totalCost);
    // Use roundedTotalCost instead of totalCost.toFixed(2)
    document.getElementById('materialCostPrice').textContent = roundedTotalCost; // Update the total cost display
}

  // Event listeners...
  document.querySelectorAll('.inputField').forEach(input => {
    input.addEventListener('input', () => {
      // Reset total cost before recalculating
      totalCost = 0;
      document.querySelectorAll('.inputField').forEach(input => {
        const materialType = input.id.replace('input', ''); // Extract material type from input id
        calculateAndUpdateCost(materialType);
      });
    });
  });

  // Fetch material prices on page load
  fetchMaterialPrices();
});
document.getElementById('searchBar').addEventListener('input', function() {
  const searchTerm = this.value;
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = ''; // Clear previous results
  if (searchTerm.length > 2) {
      fetch(`/search-jobs?term=${encodeURIComponent(searchTerm)}`)
          .then(response => response.json())
          .then(data => {
              console.log('Data retrieved'); // Log when data is retrieved
              if (data.length > 0) {
                  resultsContainer.style.display = 'block'; // Show the dropdown
                  data.forEach(job => {
                      const div = document.createElement('div');
                      div.textContent = job.address; // Example format
                      div.classList.add('searchResultOption'); // Add class for event delegation
                      div.setAttribute('data-jobid', job.jobid); // Store job ID in data attribute
                      resultsContainer.appendChild(div);
                  });
              } else {
                  resultsContainer.style.display = 'none'; // Hide the dropdown if no results
              }
          })
          .catch(error => {
              console.error('Error fetching search results:', error);
              resultsContainer.style.display = 'none';
          });
  } else {
      resultsContainer.style.display = 'none'; // Hide the dropdown if search term is too short
  }
});

// Event delegation for clicks on search results
document.getElementById('searchResults').addEventListener('click', function(event) {
  if (event.target && event.target.matches('.searchResultOption')) {
    // Retrieve the job ID from the data attribute
    const jobId = event.target.getAttribute('data-jobid');
    console.log('Clicked job ID:', jobId);
    // Execute the desired functionality here, using the jobId as needed
  }
});
// Hide the dropdown when clicking outside of it
window.onclick = function(event) {
if (!event.target.matches('.searchBar')) {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  for (var i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.style.display === 'block') {
      openDropdown.style.display = 'none';
    }
  }
}
};

document.getElementById('searchResults').addEventListener('click', function(event) {
  if (event.target && event.target.matches('.searchResultOption')) {
    // Initialize the orderData object
    let orderData = {
        items: [],
        accessories: {},
        prices: {
            cost: document.getElementById('materialCostPrice').textContent,
            charge: document.getElementById('materialChargePrice').textContent,
            perFoot: document.getElementById('materialPerFootPrice').textContent
        }
    };

    // Collect data for each item
    const itemNames = ["Gutter", "DS", "A", "B", "In", "Out", "Sets"];
    itemNames.forEach(item => {
        let sizeToggle = document.getElementById(`sizeToggleFor${item}`).textContent;
        let input = document.getElementById(`input${item}`).value;

        orderData.items.push({
            name: item,
            size: sizeToggle,
            quantity: input,
        });
    });

    // Log the orderData object to the console
    console.log(orderData);
  }
});

function updateMaterialChargePercentage() {
  const materialCharge = parseFloat(document.getElementById('materialCharge').textContent) || 0;
  const materialCostPrice = parseFloat(document.getElementById('materialCostPrice').textContent) || 0;
  
  if (materialCostPrice === 0) {
      console.error("materialCostPrice is 0, cannot calculate percentage.");
      document.getElementById('materialChargePercentage').textContent = 'N/A';
      return;
  }
  
  // Correct the calculation to divide materialCharge by materialCostPrice
  const materialChargePercentage = (materialCharge / materialCostPrice) * 100;
  
  // Update the materialChargePercentage output
  document.getElementById('materialChargePercentage').textContent = materialChargePercentage.toFixed(2) + '%';
}
