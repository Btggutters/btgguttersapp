function openAddModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
  
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
      modal.style.display = "none";
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
  }
  $(document).ready(function() {
    // Create the dropdown menu
    var $select = $('#jobTypeOfWork');
    var $dropdown = $('<div>', { class: 'dropdown' });
    $select.after($dropdown);
    $select.find('option').each(function() {
      var $option = $(this);
      var $div = $('<div>', { class: 'option', text: $option.text() });
      $div.data('value', $option.val());
      $dropdown.append($div);
    });
  
    // Toggle dropdown options display on click
    $dropdown.on('click', function() {
      $(this).children('.option').toggle(); // This will show or hide the options
    });
  
    // Handle option click events
    $dropdown.on('click', '.option', function(event) {
      event.stopPropagation(); // Prevent the dropdown from closing when an option is clicked
      var $option = $(this);
      $option.toggleClass('selected');
      var value = $option.data('value');
      var selected = $option.hasClass('selected');
      $select.find('option[value="' + value + '"]').prop('selected', selected);
    });
  
    // Close dropdown if clicked outside
    $(document).on('click', function(event) {
      if (!$(event.target).closest('.dropdown').length) {
        $('.dropdown .option').hide();
      }
    });
  });
  document.addEventListener('DOMContentLoaded', function() {
    fetch('/get-companies')
      .then(response => response.json())
      .then(data => {
        var companySelect1 = document.getElementById('companyName');
        var companySelect2 = document.getElementById('companyFormCompanyName');
  
        data.forEach(function(company) {
          var option1 = document.createElement('option');
          option1.value = company.companyname;
          option1.text = company.companyname;
          companySelect1.appendChild(option1);
  
          var option2 = document.createElement('option');
          option2.value = company.companyname;
          option2.text = company.companyname;
          companySelect2.appendChild(option2);
        });
      })
      .catch(error => console.error('Error:', error));
  });
// Variable to store the selected company
var selectedCompany;

// Function to handle company selection and form display
function handleCompanySelection(selectedCompany) {
  console.log('Selected company:', selectedCompany); // Debugging line

  // Update the select element in the new form if it exists
  var newFormCompanyNameSelect = $('#companyFormCompanyName');
  if (newFormCompanyNameSelect.length) {
    newFormCompanyNameSelect.val(selectedCompany).trigger('change');
  }

  // Store the selected company in localStorage
  localStorage.setItem('selectedCompany', selectedCompany);

  // Get the forms
  var defaultForm = document.getElementById('defaultForm');
  var companyForm = document.getElementById('companyForm');

  // Show/hide forms based on the selected company
  if (selectedCompany === 'No Company') {
    defaultForm.style.display = 'block';
    companyForm.style.display = 'none';
    selectedCompany = ""; // Resetting the selected company
  } else {
    defaultForm.style.display = 'none';
    companyForm.style.display = 'block';
  }
}

// Event listener for the first select element
document.getElementById('companyName').addEventListener('change', function() {
  handleCompanySelection(this.value);
});

// Event listener for the second select element
document.getElementById('companyFormCompanyName').addEventListener('change', function() {
  handleCompanySelection(this.value);
});

document.getElementById('addLeadFormSubmitDefault').addEventListener('click', function(event) {
  event.preventDefault();

  // Get values from form inputs
  var customerName = document.getElementById('customerNameDefault').value;
  var customerPhoneNumber = document.getElementById('customerPhoneDefault').value;
  var customerEmail = document.getElementById('customerEmailDefault').value;
  var obtainedHow = document.getElementById('jobObtainedDefault').value;
  var address = document.getElementById('jobAddressDefault').value;
  var notes = document.getElementById('jobNotesDefault').value;
  var typeOfWork = document.getElementById('jobTypeOfWorkDefault').value;
  var date = document.getElementById('estimateDateDefault').value;

  // Create a lead
  fetch('/create-lead', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerName: customerName,
      customerPhoneNumber: customerPhoneNumber,
      customerEmail: customerEmail,
      obtainedHow: obtainedHow,
      address: address,
      notes: notes,
      typeOfWork: typeOfWork,
      date: date
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Lead created:', data.message);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});