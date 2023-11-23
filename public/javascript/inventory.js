document.addEventListener('DOMContentLoaded', function() {
    // Attach event listener to parent element

    // Get the initial state of the button and dropdown
    let initialSwitchButton = document.querySelector('.gutterContentSizeSwitchButton');
    let initialColorDropdown = initialSwitchButton.parentNode.querySelector('.modalColorDropdown');

    // Update the dropdown for the initial state
    updateColorDropdown(initialSwitchButton, initialColorDropdown);

    // Event delegation for gutterContentSizeSwitchButton
    document.querySelector('body').addEventListener('click', function(event) {
        if (event.target.classList.contains('gutterContentSizeSwitchButton')) {
            console.log('gutterContentSizeSwitchButton clicked');
            event.target.innerHTML = event.target.innerHTML === '5' ? '6' : '5';
            let colorDropdown = event.target.parentNode.querySelector('.modalColorDropdown');
            updateColorDropdown(event.target, colorDropdown);
        }
    });
    
    // Event listeners for material buttons
    ['gutter', 'fascia', 'accessories'].forEach(material => {
        document.getElementById(`${material}MaterialButton`).addEventListener('click', function() {
            hideAllContent();
            document.getElementById(`${material}Content`).style.display = 'block';
        });
    });
    document.getElementById('gutterContentAddAnotherRow').addEventListener('click', addRowAndButton);
    // Event listener for gutter add button
    document.getElementById('gutterAddButton').addEventListener('click', function() {
        console.log('Gutter add button clicked');
        document.getElementById('myModal').style.display = 'block';
    });
    // Event listener for close button
    document.querySelector('.close').addEventListener('click', function() {
        console.log('Close button clicked');
        document.getElementById('myModal').style.display = 'none';
    });
     // Fetch unique colors from the server
     fetch('/get-unique-colors')
     .then(response => response.json())
     .then(colors => {
         // Get the gutterContentColorCardFeild element
         var colorCardField = document.querySelector('.gutterContentColorCardFeild');
 
         // Create a gutterContentColorCard for each color
         colors.forEach(({ color }) => {
             var colorCard = document.createElement('div');
             colorCard.className = 'gutterContentColorCard';
             colorCard.innerText = color;
             colorCardField.appendChild(colorCard);
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
            '2  Linen',
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
function addRowAndButton() {
    var rowToClone = document.getElementById('rowToClone');
    var clonedRow = rowToClone.cloneNode(true);
    clonedRow.id = ""; // remove the id from the cloned row

    // Remove ids from all child elements
    clonedRow.querySelectorAll('*[id]').forEach(function(node) {
        node.id = "";
    });

    // Clear the value of the modalNumberFeild in the cloned row
    var clonedModalNumberFeild = clonedRow.querySelector('.modalNumberFeild');
    if (clonedModalNumberFeild) {
        clonedModalNumberFeild.value = "";
    }

    rowToClone.parentNode.appendChild(clonedRow); // append the cloned row to the parent

    // Remove the old buttons
    var oldButtons = document.querySelectorAll('.addRowButton');
    oldButtons.forEach(function(button) {
        button.remove();
    });

    // Create new buttons
    var buttons = ['Another One', 'Fake', 'Submit'];
    buttons.forEach(function(buttonText) {
    var newButton = document.createElement('button');
    newButton.className = 'addRowButton';
    newButton.id = 'gutterContent' + buttonText.replace(' ', '') + 'Row';
    newButton.innerHTML = buttonText;

    // Append the new button to the parent
    rowToClone.parentNode.appendChild(newButton);

    // Add the event listener to the new button
    if (buttonText === 'Another One') {
        newButton.addEventListener('click', addRowAndButton);
    } else if (buttonText === 'Fake') {
        newButton.addEventListener('click', function() {
            // Fill the fields with random data
            var fields = document.querySelectorAll('.modalNumberFeild, .modalColorDropdown, .modalLabelDropdown, .gutterContentSizeSwitchButton');
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
    }
    else if (buttonText === 'Submit') {
        newButton.addEventListener('click', function() {
            // Get all rows
            var rows = document.querySelectorAll('.gutterContentRow');
    
            // Collect the form data for each row
            var formData = Array.from(rows).map(row => ({
                size: Number(row.querySelector('.gutterContentSizeSwitchButton').innerText),
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
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        });
    }
});

    console.log('Row added');
}

document.getElementById('gutterContentAddAnotherRow').addEventListener('click', addRowAndButton);
