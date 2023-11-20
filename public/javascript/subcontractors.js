document.getElementById("subcontractorForm").onsubmit = function(e) {
    e.preventDefault();
  
    // Get the form data
    var modal = document.getElementById("myModal");
    var companyName = document.getElementById("companyName").value;
    var salesName = document.getElementById("salesName").value;
    var salesNumber = document.getElementById("salesNumber").value;
    var salesEmail = document.getElementById("salesEmail").value;
    var companyStreetAddress = document.getElementById("companyStreetAddress").value;
    var companyPricePerFoot = document.getElementById("companyPricePerFoot").value;
  
    // Send a POST request to the server
    fetch('/add-subcontractor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        companyName: companyName,
        salesName: salesName,
        salesNumber: salesNumber,
        salesEmail: salesEmail,
        companyStreetAddress: companyStreetAddress,
        companyPricePerFoot: companyPricePerFoot,
      }),
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
  
    // Close the modal
    modal.style.display = "none";
  }
  
  document.getElementById("fakeSubmit").onclick = function() {
    // Fill the form with fake data
    document.getElementById("companyName").value = "Fake Company";
    document.getElementById("salesName").value = "Fake Sales Name";
    document.getElementById("salesNumber").value = "1234567890";
    document.getElementById("salesEmail").value = "fake@company.com";
    document.getElementById("companyStreetAddress").value = "123 Fake St";
    // Make sure this field exists in your form
    document.getElementById("companyPricePerFoot").value = 7;
};
window.onload = function() {
    // Send a GET request to the server
    fetch('/get-subcontractors')
    .then(response => {
      console.log(response);
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Create subcontractorCards for each subcontractor
      var subcontractorContainer = document.querySelector('.subcontractorContainer');
      data.forEach(subcontractor => {
        var subcontractorCard = document.createElement('div');
        subcontractorCard.className = 'subcontractorCard';
        subcontractorCard.innerHTML = `
          <div class="subcontractorRow">
            <span>${subcontractor.company_name}</span>
          </div>
          <div class="subcontractorRow">
            <span>${subcontractor.sales_name}</span>
            <span class="subcontractCompanyPricePerFoot">${subcontractor.company_price_per_foot}</span>
          </div>
          <div class="subcontractorRow">
            <span>${subcontractor.sales_number}</span>
          </div>
          <div class="subcontractorRow">
            <span>${subcontractor.sales_email}</span>
          </div>
          <div class="subcontractorRow">
            <span>${subcontractor.company_street_address}</span>
          </div>
        `;
        subcontractorContainer.appendChild(subcontractorCard);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};
