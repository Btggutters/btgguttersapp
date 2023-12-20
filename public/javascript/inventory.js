document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to parent element

    // Get the initial state of the button and dropdown
    let initialSwitchButton = document.querySelector('.coloredContentSizeSwitchButton');
    let initialColorDropdown = initialSwitchButton.parentNode.querySelector('.modalColorDropdown');

    // Update the dropdown for the initial state
    updateColorDropdown(initialSwitchButton, initialColorDropdown);

    // Event delegation for coloredContentSizeSwitchButton
    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.classList.contains('coloredContentSizeSwitchButton')) {
            console.log('coloredContentSizeSwitchButton clicked');
            event.target.innerHTML = event.target.innerHTML === '5' ? '6' : '5';
            let colorDropdown = event.target.parentNode.querySelector('.modalColorDropdown');
            updateColorDropdown(event.target, colorDropdown);
        }
    });
    
    // Event listeners for material buttons
    ['colored', 'other'].forEach(material => {
        document.getElementById(`${material}MaterialButton`).addEventListener('click', function() {
            hideAllContent();
            document.getElementById(`${material}Content`).style.display = 'block';
        });
    });
    // Event listener for gutter add button
    document.getElementById('gutterAddButton').addEventListener('click', function() {
        console.log('Gutter add button clicked');
        document.getElementById('myModal').style.display = 'block';
    });



var otherContentField = document.querySelector('.otherContentFeild');


fetch('/get-items-with-null-color-and-storage-location', {
})
  .then(response => response.json())
  .then(items => {
    // Create an OtherContentCard for each item and add it to the OtherContentField
    items.forEach(item => {
      var otherContentCard = `
        <div class="otherContentCard">
          <p class="otherContentCardItem">${item.item}</p>
          <p class="otherContentCardQTY">${item.qty}</p>
        </div>
      `;
      otherContentField.innerHTML += otherContentCard;
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });



// Fetch unique colors from the server
fetch('/get-unique-colors', {
})
.then(response => response.json())
.then(colors => {
    // Get the coloredContentCardFeild element
    var colorCardField = document.querySelector('.coloredContentCardFeild');

    // Create a coloredContentCard for each color
    colors.forEach(({ color }) => {
        var colorCard = document.createElement('div');
        colorCard.className = 'coloredContentCard';
        colorCard.innerText = color;
        colorCardField.appendChild(colorCard);

        colorCard.addEventListener('click', function() {
            // Fetch the items of this color from the server
            fetch(`/get-items-of-color?color=${encodeURIComponent(color)}`)
            .then(response => response.json())
            .then(items => {
                console.log(`Items of color ${color}:`, items);
        
                // Get the itemsContainer elements
                var itemsContainer1 = document.getElementById('itemsContainer1');
                var itemsContainer2 = document.getElementById('itemsContainer2');
                var itemsContainer3 = document.getElementById('itemsContainer3');
        
                // Clear the itemsContainers
                itemsContainer1.innerHTML = '';
                itemsContainer2.innerHTML = '';
                itemsContainer3.innerHTML = '';
        
                // Get the colorCardModalColor span and update its text
                var colorSpan = document.querySelector('.colorCardModalColor');
                colorSpan.innerText = `${color}`;
        
                // Create a new div for each item property and append it to the corresponding itemsContainer
                items.forEach((item) => {
                    var sizeDiv = document.createElement('div');
                    sizeDiv.innerText = `${item.size} in`;
                    itemsContainer1.appendChild(sizeDiv);
        
                    var itemDiv = document.createElement('div');
                    itemDiv.innerText = `${item.item}`;
                    itemsContainer2.appendChild(itemDiv);
        
                    var qtyDiv = document.createElement('div');
                    qtyDiv.innerText = `${item.qty}`;
                    itemsContainer3.appendChild(qtyDiv);
                });
        
                // Show the modal
                var itemsModal = document.getElementById('itemsModal');
                itemsModal.style.display = 'block';
            })
            .catch(error => console.error('Error:', error));
        });
    });
})
.catch(error => console.error('Error:', error));
});
function hideAllContent() {
    var contentDivs = document.getElementsByClassName('content');
    for (var i = 0; i < contentDivs.length; i++) {
        contentDivs[i].style.display = 'none';
    }
}
function updateColorDropdown(switchButton, colorDropdown) {
    let colors;
    if (switchButton.innerHTML === '5') {
        colors = [
            '102  Pearl Gray',
            '105  Antique Ivory',
            '112  Tuxedo Gray',
            '130  Low Gloss White',
            '140  Almond A',
            '200  Black',
            '202  Royal Brown',
            '204  Grecian Green',
            '219  Almond Cream',
            '224  Buckskin',
            '238  Clay',
            '250  Musket Brown',
            '253  Light Bronze',
            '325  Sandstone Beige',
            '339  Dark Bronze',
            '360  Terratone',
            '712  Wicker',
            '713  Wicker',
            '780  Coppertone',
            '791  Norwood',
            '819  Herringbone',
            '002  Linen',
            '111  Heather',
            '138  Shell',
            '173  Olive Green',
            '175  Pewter',
            '177  Sandy Beige',
            '214  Woodland Green',
            '223  Imperial Brown',
            '255  Cypress',
            '301  Dark Gray',
            '327  Desert Tan',
            '355  Light Maple',
            '793  Sand',
            '794  Almond',
            '810  Shale',
            '817  Cream',
            '820  Cranberry',
            '821  Ivy Green',
            '822  Pacific Blue',
            '827  Champagne',
            '891  Buckskin',
            '901  Ivory',
            
        ];
    } else if (switchButton.innerHTML === '6') {
        colors = [
            '102  Pearl Gray',
            '105  Antique Ivory',
            '112  Tuxedo Gray',
            '130  Low Gloss White',
            '140  Almond AR',
            '200  Black',
            '202  Royal Brown',
            '204  Grecian Green',
            '219  Almond Cream',
            '224  Buckskin',
            '238  Clay',
            '250  Musket Brown',
            '253  Light Bronze',
            '325  Sandstone Beige',
            '339  Dark Bronze',
            '360  Terratone',
            '712  Wicker',
            '713  Wicker',
            '780  Coppertone',
            '791  Norwood',
            '819  Herringbone',
            '209  Scotch Red',
            '429  Ocean Blue',
        
    ];
    }

    // clear the dropdown
    colorDropdown.innerHTML = '';

    // populate the dropdown
    colors.forEach(color => {
        let option = document.createElement('option');
        option.value = color;
        option.text = color;
        colorDropdown.add(option);
    });

    console.log('Color dropdown updated');
}
function addRowAndButton(cloneRow = true) {
    var rowToClone = document.getElementById('rowToClone');
    var clonedRow;

    if (cloneRow) {
        clonedRow = rowToClone.cloneNode(true);
        clonedRow.id = ""; // remove the id from the cloned row
        clonedRow.classList.add('clonedRow'); // add a class to the cloned row
        rowToClone.parentNode.appendChild(clonedRow); // append the cloned row to the parent
    } else {
        clonedRow = rowToClone;
    }

    // Remove ids from all child elements
    clonedRow.querySelectorAll('*[id]').forEach(function(node) {
        node.id = "";
    });

    // Clear the value of the modalNumberFeild in the cloned row
    var clonedModalNumberFeild = clonedRow.querySelector('.modalNumberFeild');
    if (clonedModalNumberFeild) {
        clonedModalNumberFeild.value = "";
    }

    // Remove the old buttons
    var oldButtons = document.querySelectorAll('.addRowButton');
    oldButtons.forEach(function(button) {
        button.remove();
    });

    // Get the switchButton and colorDropdown of the cloned row
    let clonedSwitchButton = clonedRow.querySelector('.coloredContentSizeSwitchButton');
    let clonedColorDropdown = clonedRow.querySelector('.modalColorDropdown');

    // Update the dropdown for the cloned row
    updateColorDropdown(clonedSwitchButton, clonedColorDropdown);

    // Create new buttons
    var buttons = ['Another One', 'Fake', 'Submit'];
    buttons.forEach(function(buttonText) {
        var newButton = document.createElement('button');
        newButton.className = 'addRowButton';
        newButton.id = 'coloredContent' + buttonText.replace(' ', '') + 'Row';
        newButton.innerHTML = buttonText;

        // Append the new button to the parent
        rowToClone.parentNode.appendChild(newButton);

        // Add the event listener to the new button
        if (buttonText === 'Another One') {
            newButton.addEventListener('click', () => addRowAndButton(true));
        } else if (buttonText === 'Fake') {
            newButton.addEventListener('click', function() {
                // Fill the fields with random data
                var fields = document.querySelectorAll('.modalNumberFeild, .modalColorDropdown, .modalLabelDropdown, .coloredContentSizeSwitchButton');
                fields.forEach(function(field) {
                    if (field instanceof HTMLSelectElement) {
                        var options = field.options;
                        var randomOptionIndex = Math.floor(Math.random() * options.length);
                        field.selectedIndex = randomOptionIndex;
                    } else if (field instanceof HTMLInputElement) {
                        field.value = Math.floor(Math.random() * 100) + 1; // random number between 1 and 100
                    }
                });
            });
        } else if (buttonText === 'Submit') {
            newButton.addEventListener('click', function() {
                // Get all rows
                var rows = document.querySelectorAll('.coloredContentRow');

                // Collect the form data for each row
                var formData = Array.from(rows).map(row => ({
                    size: Number(row.querySelector('.coloredContentSizeSwitchButton').innerText),
                    color: row.querySelector('.modalColorDropdown').value,
                    item: row.querySelector('.modalLabelDropdown').value,
                    qty: Number(row.querySelector('.modalNumberFeild').value)
                }));

                // Send the form data to the server-side script
                fetch('/add-guttermaterial', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                })
                .then(response => {
                    console.log(response);
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);
                    // Close the modal here
                    var itemsModal = document.getElementById('myModal'); // Replace 'itemsModal' with the actual ID of your modal
                    if (itemsModal) {
                        itemsModal.style.display = 'none';
                    }
                    // Refresh the page
                    window.location.reload();
                    
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
        }
    });

    console.log('Row added');
}






// Event listener for addOtherButton
document.getElementById('addOtherButton').addEventListener('click', function() {
    console.log('Add Other button clicked');
    document.getElementById('otherModal').style.display = 'block';
});
document.getElementById('otherForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from being submitted normally
    var name = document.getElementById('name').value;
    var qty = document.getElementById('qty').value;
    console.log('Form submitted:', name, qty);
    // You can add your code here to handle the form submission
});

document.getElementById('addAnotherRowOtherContent').addEventListener('click', addRow);

function addRow() {
    // Get the parent element
    var parentElement = document.getElementById('otherForm');

    // Create new row
    var newRow = document.createElement('div');
    newRow.className = 'otherContentAddRow';

    // Create new select element
    var newSelect = document.createElement('select');
    newSelect.id = 'name';
    newSelect.name = 'name';
    newSelect.className = 'nameDropdown';

    // Add options to the select element
    var options = ["5 in hangers", "6 in Hangers", "Caulk Tubes", "Big Screws", "1x8 Fascia", "1x6 Fascia", "2x3 Couplers", "3x4 Couplers", "Straps", "Wedges", "Fascia Screws", "metal Trim Nails"];
    for(var i = 0; i < options.length; i++) {
        var option = document.createElement('option');
        option.value = options[i];
        option.text = options[i];
        newSelect.appendChild(option);
    }

    // Create new input element
    var newInput = document.createElement('input');
    newInput.type = 'number';
    newInput.id = 'qty';
    newInput.name = 'qty';
    newInput.className = 'qtyInput';

    // Append the select and input elements to the new row
    newRow.appendChild(newSelect);
    newRow.appendChild(newInput);

    // Append the new row to the parent element
    parentElement.appendChild(newRow);
}
// Call the function on page load
// addRowAndButton(); // Remove this line

// Call the function on page load
addRowAndButton(false);

document.getElementById('otherForm').addEventListener('submit', function(event) {
    // Prevent the form from submitting normally
    event.preventDefault();

    // Get all rows in the form
    var rows = document.querySelectorAll('#otherForm .otherContentAddRow');

    // Prepare an array to hold all row data
    var formDataArray = [];

    // Iterate over each row
    rows.forEach(function(row) {
        // Get the item and quantity from the row
        var item = row.querySelector('.nameDropdown').value;
        var qty = row.querySelector('.qtyInput').value;

        // Create an object to represent the row
        var rowData = {
            size: null,
            color: null,
            item: item,
            qty: qty
        };

        // Add the row data to the array
        formDataArray.push(rowData);
    });

    // Send a POST request to the server
    fetch('/add-guttermaterial', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', 
        },
        body: JSON.stringify(formDataArray),
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
});

// Select all close buttons
var closeButtons = document.querySelectorAll('.close');

// Add an event listener to each close button
closeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        // Get the modal that contains this close button
        var modal = button.closest('.modal');

        // Hide the modal
        modal.style.display = 'none';
    });
});

function setupSearch(inputId, cardClass) {
    var input = document.getElementById(inputId);

    input.addEventListener('focus', function() {
        this.placeholder = '';
    });

    input.addEventListener('blur', function() {
        this.placeholder = 'Search for ' + inputId.replace('Search', '');
    });

    input.addEventListener('input', function() {
        var searchValue = this.value.toLowerCase();
        var cards = document.querySelectorAll(cardClass);

        cards.forEach(function(card) {
            var itemName = card.innerText.toLowerCase();
            if (itemName.includes(searchValue)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Call the function for each set of inputs and cards
setupSearch('colorSearch', '.coloredContentCard');
setupSearch('otherSearch', '.otherContentCard');