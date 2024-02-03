function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

document.addEventListener("DOMContentLoaded", function () {
  // Function to round to the nearest increment of 25
  function roundToNearest25(num) {
    return Math.ceil(num / 25) * 25;
  }
  let materialPrices = {}; // Object to store fetched material prices
  let totalCost = 0; // Initialize total cost

  // Existing code for updating the price per foot display
  const pricePerFootSelector = document.getElementById("pricePerFootSelector");
  const pricePerFootDisplay = document.getElementById("pricePerFootDisplay");

  function updatePriceDisplay() {
    pricePerFootDisplay.textContent = pricePerFootSelector.value;
    calculatePricePerFoot();
    updateMaterialChargePercentage();
  }
  function calculatePricePerFoot() {
    // Retrieve values from input fields
    const inMiter =
      parseFloat(document.getElementById("inputInMiter").value) || 0;
    const outMiter =
      parseFloat(document.getElementById("inputOutMiter").value) || 0;
    const aElbow =
      parseFloat(document.getElementById("inputAElbow").value) || 0;
    const bElbow =
      parseFloat(document.getElementById("inputBElbow").value) || 0;
    const downspoutFt =
      parseFloat(document.getElementById("inputDownspoutFt").value) || 0;
    const gutterFt =
      parseFloat(document.getElementById("inputGutterFt").value) || 0;

    // Retrieve the price per foot value
    const pricePerFoot =
      parseFloat(document.getElementById("pricePerFootDisplay").textContent) ||
      0;

    // Calculate the material charge
    const materialCharge =
      ((inMiter + outMiter) * 3 + aElbow + bElbow + downspoutFt + gutterFt) *
      pricePerFoot;
    // Round the materialCharge using your existing function
    const roundedMaterialCharge = roundToNearest25(materialCharge);
    // Update the material charge output with rounded value
    document.getElementById("materialCharge").textContent =
      roundedMaterialCharge;
    // Trigger update for materialChargePercentage
    updateMaterialChargePercentage();
  }
  updatePriceDisplay(); // Initialize the display with the default value
  pricePerFootSelector.addEventListener("input", updatePriceDisplay); // Add event listener

  function fetchMaterialPrices() {
    fetch("/get-material-prices")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched material prices:", data); // Log fetched data
        data.forEach((item) => {
          // Standardize the name to match the format used in IDs
          const standardizedKey = item.name.replace(/\s+/g, "").replace("Ft", ""); // Example: 'GutterFt' becomes 'Gutter'
          
          // Check if the item has a generic price instead of size-specific prices
          if (item.price) {
            // Store items with a single price directly
            materialPrices[standardizedKey] = item.price;
          } else {
            // Store items with size-specific prices as before
            materialPrices[standardizedKey] = {
              price_5in: item.price_5in,
              price_6in: item.price_6in,
            };
          }
        });
        console.log("Material prices object after fetching and storing:", materialPrices); // Log the structured object
      })
      .catch((error) => console.error("Error fetching material prices:", error));
  }

  function calculateAndUpdateCost(materialType) {
    // Standardize the materialType to match the keys in materialPrices
    const standardizedMaterialType = materialType.replace(/\s+/g, "").replace("Ft", ""); // Adjust as necessary
    if (materialPrices[standardizedMaterialType]) {
      const inputQuantity = document.getElementById(`input${materialType}`).value; // Get the input quantity
      
      let cost;
      if (typeof materialPrices[standardizedMaterialType] === 'number') {
        // If the price is a single number, use it directly
        cost = materialPrices[standardizedMaterialType] * inputQuantity;
      } else {
        // Otherwise, use the size-specific price
        const sizeToggle = document.getElementById(`sizeToggle${materialType}`).textContent; // Get the size toggle value (5 or 6)
        const priceKey = `price_${sizeToggle}in`; // Construct the price key based on size
        cost = materialPrices[standardizedMaterialType][priceKey] * inputQuantity;
      }
      
      document.getElementById(`output${materialType}Cost`).textContent = cost.toFixed(2); // Update the output field
  
      // Update total cost
      updateTotalCost(cost);
    } else {
      console.error(`No prices found for material type: ${standardizedMaterialType}`);
    }
  }

  // Event listener for input changes
  document.querySelectorAll(".inputField").forEach((input) => {
    const debouncedInputHandler = debounce(() => {
      const materialType = input.id.replace("input", "");
      console.log(`Input field changed for material type: ${materialType}`); // Log the material type on input change
      calculateAndUpdateCost(materialType);
      calculatePricePerFoot();
      updateMaterialChargePercentage();
    }, 250); // 250 milliseconds delay
  
    input.addEventListener("input", debouncedInputHandler);
  });

  document.querySelectorAll(".toggleButton").forEach((button) => {
    const debouncedButtonClickHandler = debounce(() => {
      const materialType = button.id.replace("sizeToggle", "");
      console.log(`Toggle button clicked for material type: ${materialType}`); // Log the material type on toggle
      button.textContent = button.textContent === "5" ? "6" : "5"; // Toggle between 5 and 6
      calculateAndUpdateCost(materialType);
      updateMaterialChargePercentage();
    }, 250); // 250 milliseconds delay
  
    button.addEventListener("click", debouncedButtonClickHandler);
  });

  function updateTotalCost(newCost, accessoriesCost = 0) {
    // Add the new cost and accessories cost to the total cost
    totalCost += newCost + accessoriesCost;
    // Round totalCost to the nearest whole number
    const roundedTotalCost = Math.ceil(totalCost);
    // Use roundedTotalCost instead of totalCost.toFixed(2)
    document.getElementById("materialCostPrice").textContent = roundedTotalCost; // Update the total cost display
  }

  // Event listeners...
  document.querySelectorAll(".inputField").forEach((input) => {
    input.addEventListener("input", () => {
      // Reset total cost before recalculating
      totalCost = 0;
      document.querySelectorAll(".inputField").forEach((input) => {
        const materialType = input.id.replace("input", ""); // Extract material type from input id
        calculateAndUpdateCost(materialType);
      });
    });
  });
  // Fetch material prices on page load
  fetchMaterialPrices();

  function calculateAccessoriesCost() {
    // Ensure materialPrices is populated
    if (Object.keys(materialPrices).length === 0) {
      console.error("materialPrices is not populated yet.");
      return;
    }
  
    // Retrieve input values
    const allMiters = (parseFloat(document.getElementById("inputInMiter").value) || 0) + 
                      (parseFloat(document.getElementById("inputOutMiter").value) || 0);
    const allElbows = (parseFloat(document.getElementById("inputAElbow").value) || 0) + 
                      (parseFloat(document.getElementById("inputBElbow").value) || 0);
    const gutterFt = parseFloat(document.getElementById("inputGutterFt").value) || 0;
    const downspoutFt = parseFloat(document.getElementById("inputDownspoutFt").value) || 0;
    const sets = parseFloat(document.getElementById("inputSets").value) || 0;
    const sizeToggleGutterFt = document.getElementById("sizeToggleGutterFt").textContent;
    const priceKey = `price_${sizeToggleGutterFt}in`;
  
    // Log input values
    console.log(`Inputs - All Miters: ${allMiters}, All Elbows: ${allElbows}, Gutter Ft: ${gutterFt}, Downspout Ft: ${downspoutFt}, Sets: ${sets}, Size Toggle: ${sizeToggleGutterFt}`);
  
    // Initialize costs
    let hangerCost = 0, smallScrewCost = 0, bigScrewCost = 0, caulkCost = 0;
  
    // Check if the necessary materials are defined in materialPrices
    if (materialPrices['Hangers'] && materialPrices['SmallScrews'] && materialPrices['BigScrews'] && materialPrices['Caulk']) {
      // Convert string prices to numbers
      const bigScrewsPrice = parseFloat(materialPrices['BigScrews']);
      const smallScrewsPrice = parseFloat(materialPrices['SmallScrews']);
      const caulkPrice = parseFloat(materialPrices['Caulk']);
      // Calculate costs
      hangerCost = gutterFt * 0.75 * (parseFloat(materialPrices['Hangers'][priceKey]) || 0);
      smallScrewCost = (allMiters * 2 + Math.ceil(downspoutFt / 10) * 4 + allElbows * 2) * smallScrewsPrice;
      bigScrewCost = (allMiters * 2 + Math.ceil(downspoutFt / 10) * 2 + gutterFt * 0.75) * bigScrewsPrice;
      caulkCost = (allMiters / 3 + sets / 4) * caulkPrice;
  
      // Log each cost calculation
      console.log(`Cost Calculations - Hanger Cost: ${hangerCost}, Small Screw Cost: ${smallScrewCost}, Big Screw Cost: ${bigScrewCost}, Caulk Cost: ${caulkCost}`);
    } else {
      console.error("One or more necessary materials are undefined in materialPrices.");
    }
  
        // Sum up the total accessories cost
    // After calculating accessoriesCost in calculateAccessoriesCost function
    let accessoriesCost = hangerCost + smallScrewCost + bigScrewCost + caulkCost;
    // When calling updateTotalCost, include accessoriesCost
    updateTotalCost(0, accessoriesCost); // Passing 0 for newCost since we're only updating accessoriesCost here
    // Update the accessories cost display
  }
  // Call the function to calculate and log the accessories cost
  calculateAccessoriesCost();

  // Make sure to recalculate accessories cost whenever relevant inputs change
  document.querySelectorAll(".inputField, .toggleButton").forEach(input => {
    input.addEventListener('input', calculateAccessoriesCost);
  });
  document.querySelectorAll(".toggleButton").forEach(button => {
    button.addEventListener('click', calculateAccessoriesCost);
  });
  
  
});
document.getElementById("searchBar").addEventListener("input", function () {
  const searchTerm = this.value;
  const resultsContainer = document.getElementById("searchResults");
  resultsContainer.innerHTML = ""; // Clear previous results
  if (searchTerm.length > 2) {
    fetch(`/search-jobs?term=${encodeURIComponent(searchTerm)}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Data retrieved"); // Log when data is retrieved
        if (data.length > 0) {
          resultsContainer.style.display = "block"; // Show the dropdown
          data.forEach((job) => {
            const div = document.createElement("div");
            div.textContent = job.address; // Example format
            div.classList.add("searchResultOption"); // Add class for event delegation
            div.setAttribute("data-jobid", job.jobid); // Store job ID in data attribute
            resultsContainer.appendChild(div);
          });
        } else {
          resultsContainer.style.display = "none"; // Hide the dropdown if no results
        }
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
        resultsContainer.style.display = "none";
      });
  } else {
    resultsContainer.style.display = "none"; // Hide the dropdown if search term is too short
  }
});

// Event delegation for clicks on search results
document
  .getElementById("searchResults")
  .addEventListener("click", function (event) {
    if (event.target && event.target.matches(".searchResultOption")) {
      // Retrieve the job ID from the data attribute
      const jobId = event.target.getAttribute("data-jobid");
      console.log("Clicked job ID:", jobId);
      // Execute the desired functionality here, using the jobId as needed
    }
  });
// Hide the dropdown when clicking outside of it
window.onclick = function (event) {
  if (!event.target.matches(".searchBar")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
};

document
  .getElementById("searchResults")
  .addEventListener("click", function (event) {
    if (event.target && event.target.matches(".searchResultOption")) {
      // Initialize the orderData object
      let orderData = {
        items: [],
        accessories: {},
        prices: {
          cost: document.getElementById("materialCostPrice").textContent,
          charge: document.getElementById("materialChargePrice").textContent,
          perFoot: document.getElementById("materialPerFootPrice").textContent,
        },
      };

      // Collect data for each item
      const itemNames = ["Gutter", "DS", "A", "B", "In", "Out", "Sets"];
      itemNames.forEach((item) => {
        let sizeToggle = document.getElementById(
          `sizeToggleFor${item}`
        ).textContent;
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
    const materialCharge =
      parseFloat(document.getElementById("materialCharge").textContent) || 0;
    const materialCostPrice =
      parseFloat(document.getElementById("materialCostPrice").textContent) || 0;
  
    if (materialCostPrice === 0) {
      console.error("materialCostPrice is 0, cannot calculate percentage.");
      document.getElementById("materialChargePercentage").textContent = "N/A";
      return;
    }
  
    // Calculate the percentage and round it to the nearest whole number
    const materialChargePercentage = Math.round(
      (materialCostPrice / materialCharge) * 100
    );
  
    // Update the materialChargePercentage output without decimal places
    document.getElementById("materialChargePercentage").textContent =
      materialChargePercentage + "%";
  }
