var modal = document.getElementById("myModal");
var btn = document.getElementById("addSubcontractorButton");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

document.getElementById("subcontractorForm").onsubmit = function(e) {
    e.preventDefault();
  
    // Get the form data
    var companyName = document.getElementById("companyName").value;
    var salesName = document.getElementById("salesName").value;
    var salesNumber = document.getElementById("salesNumber").value;
    var salesEmail = document.getElementById("salesEmail").value;
    var companyStreetAddress = document.getElementById("companyStreetAddress").value;
  
    // Create a new subcontractor card
    var card = document.createElement("div");
    card.className = "subcontractorCard";
  
    // Add the company name
    var companyNameElement = document.createElement("div");
    companyNameElement.className = "subcontractorRow";
    companyNameElement.innerText = companyName;
    card.appendChild(companyNameElement);
  
    // Add the sales name
    var salesNameElement = document.createElement("div");
    salesNameElement.className = "subcontractorRow";
    salesNameElement.innerText = salesName;
    card.appendChild(salesNameElement);
  
    // Add the sales number
    var salesNumberElement = document.createElement("div");
    salesNumberElement.className = "subcontractorRow";
    salesNumberElement.innerText = salesNumber;
    card.appendChild(salesNumberElement);
  
    // Add the sales email
    var salesEmailElement = document.createElement("div");
    salesEmailElement.className = "subcontractorRow";
    salesEmailElement.innerText = salesEmail;
    card.appendChild(salesEmailElement);
  
    // Add the company street address
    var companyStreetAddressElement = document.createElement("div");
    companyStreetAddressElement.className = "subcontractorRow";
    companyStreetAddressElement.innerText = companyStreetAddress;
    card.appendChild(companyStreetAddressElement);
  
    // Add the new card to the main element
    document.querySelector("main").appendChild(card);
  
    // Close the modal
    modal.style.display = "none";
}