document.getElementById('addCompanyButton').addEventListener('click', () => {
    // Open the modal
    document.getElementById('myModal').style.display = 'block';
    
    // Clear the form
    document.getElementById('companyName').value = '';
    document.getElementById('companyAddress').value = '';
    document.getElementById('salesName').value = '';
    document.getElementById('salesNumber').value = '';
    document.getElementById('billingEmail').value = '';
    document.getElementById('fiveInchPrice').value = '';
    document.getElementById('sixInchPrice').value = '';
    document.getElementById('fiveInchFilterPrice').value = '';
    document.getElementById('sixInchFilterPrice').value = '';
    document.getElementById('fasciaWoodPrice').value = '';
    document.getElementById('trimMetalPrice').value = '';
});

// Close modal event listener
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'none';
});
document.getElementById('companyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    
    // Convert the FormData to a JSON object
    const formDataObj = Object.fromEntries(formData.entries());
    
    // Log the form data
    console.log(formDataObj);
    
    // Send form data to the server
    fetch('/add-company-and-prices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle success - maybe clear the form or display a success message
        document.getElementById('myModal').style.display = 'none';
        document.getElementById('companyForm').reset();
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle errors - display error message to the user
    });
});

fetch('/get-companies-and-prices')
    .then(response => response.json())
    .then(companies => {
        const companyContainer = document.getElementById('companyContainer');

        companies.forEach(company => {
            const companyCard = document.createElement('div');
            companyCard.className = 'companyCard';

            const companyCardRow1 = document.createElement('div');
            companyCardRow1.className = 'companyCardRow';

            const companyName = document.createElement('p');
            companyName.className = 'companyCardName';
            companyName.textContent = company.companyname;

            companyCardRow1.appendChild(companyName);

            const companyCardRow2 = document.createElement('div');
            companyCardRow2.className = 'companyCardRow';

            const jobButton = document.createElement('button');
            jobButton.className = 'jobButton btgButton';
            jobButton.textContent = 'Jobs';

            const otherButton = document.createElement('button');
            otherButton.className = 'otherButton btgButton';
            otherButton.textContent = 'Other';

            companyCardRow2.appendChild(jobButton);
            companyCardRow2.appendChild(otherButton);

            companyCard.appendChild(companyCardRow1);
            companyCard.appendChild(companyCardRow2);

            companyContainer.appendChild(companyCard);
            otherButton.addEventListener('click', () => {
            // Open the modal
            document.getElementById('myModal').style.display = 'block';
    
            // Fill the form with the company's information
            document.getElementById('companyName').value = company.companyname;
            document.getElementById('companyAddress').value = company.companyaddress;
            document.getElementById('salesName').value = company.customername;
            document.getElementById('salesNumber').value = company.customerphonenumber;
            document.getElementById('billingEmail').value = company.customeremail;
            document.getElementById('fiveInchPrice').value = company.five_inch_gutter;
            document.getElementById('sixInchPrice').value = company.six_inch_gutter;
            document.getElementById('fiveInchFilterPrice').value = company.five_inch_filter;
            document.getElementById('sixInchFilterPrice').value = company.six_inch_filter;
            document.getElementById('fasciaWoodPrice').value = company.fascia_wood;
            document.getElementById('trimMetalPrice').value = company.trim_metal;
              // Hide the "Fake" button
            document.getElementById('companyAddFakeInfo').style.display = 'none';
            });
        });
    })
  .catch(error => console.error('Error:', error));