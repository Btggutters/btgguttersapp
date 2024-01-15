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
  console.log('customerName:', customerName);
  var customerPhoneNumber = document.getElementById('customerPhoneDefault').value;
  console.log('customerPhoneNumber:', customerPhoneNumber);
  var customerEmail = document.getElementById('customerEmailDefault').value;
  console.log('customerEmail:', customerEmail);
  var obtainedHow = document.getElementById('jobObtainedDefault').value;
  console.log('obtainedHow:', obtainedHow);
  var address = document.getElementById('jobAddressDefault').value;
  console.log('address:', address);
  var notes = document.getElementById('jobNotesDefault').value;
  console.log('notes:', notes);


  // Get all selected options from jobTypeOfWorkDefault
  var typeOfWorkSelect = document.getElementById('jobTypeOfWorkDefault');
  var typeOfWork = Array.from(typeOfWorkSelect.options)
    .filter(option => option.selected)
    .map(option => option.value);

  var estDate = document.getElementById('realEstimateDateDefault').textContent;

  // Determine status based on estDate
  var status = estDate ? 'Est Scheduled' : 'Needs Est';
  console.log('estDate:', estDate);
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
      typeOfWork: typeOfWork.join(', '),  // Convert array to string
      estDate: estDate,
      status: status, // Add status to the request body
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
document.getElementById('addLeadFormSubmitCompany').addEventListener('click', function(event) {
  event.preventDefault();


  // Get values from form inputs
  var address = document.getElementById('jobAddressCompany').value;
  var drawing = document.getElementById('drawingUploadCompany').value;
  var notes = document.getElementById('jobNotesCompany').value;
  var companyName = document.getElementById('companyFormCompanyName').value;
  var estDate = document.getElementById('realEstimateDateCompany').textContent;
  var insDate = document.getElementById('realInstallDateCompany').textContent;

  // Determine status based on estDate and insDate
  var status;
  if (estDate) {
    status = 'Est Scheduled';
  } else if (insDate) {
    status = 'Install Estimated';
  } else {
    status = 'Needs Estimate';
  }

  var typeOfWorkSelect = document.getElementById('jobTypeOfWorkCompany');
  var typeOfWork = Array.from(typeOfWorkSelect.options)
    .filter(option => option.selected)
    .map(option => option.value);

 // Create a lead
  fetch('/create-lead-company', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      companyName: companyName,
      address: address,
      notes: notes,
      typeOfWork: typeOfWork.join(', '),  // Convert array to string
      estDate: estDate,
      insDate: insDate,
      drawing: drawing,
      status: status,

    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Company Lead created:', data.message);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
});




document.getElementById('closeContainer').addEventListener('click', function() {
  var container = document.querySelector('.container');
  container.style.display = 'none';
});
document.querySelectorAll('.day').forEach(function(day) {
  day.addEventListener('click', function() {
    // Update the realDate spans
    document.getElementById('estimateDateDayCompany').textContent = day.textContent;
    document.getElementById('realEstimateDateCompany').textContent = day.textContent;
    document.getElementById('realInstallDateCompany').textContent = day.textContent;
    // Add more IDs as needed...

    // Hide the container
    var container = document.querySelector('.container');
    container.style.display = 'none';
  });
});
function openContainer(dateType, formType) {
  // Store the dateType and formType in global variables
  window.currentDateType = dateType;
  window.currentFormType = formType;
    var container = document.querySelector('.container');
    container.style.display = 'block';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '9999'; // This will ensure the container is above all other elements
}
const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM",
//       },
//       {
//         title: "Event 2",
//         time: "11:00 AM",
//       },
//     ],
//   },
// ];

const eventsArr = [];
getEvents();
console.log(eventsArr);

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);

      // Update the realDate span
      const realDate = `${year}-${month + 1}-${e.target.innerHTML}`;

      // Create a new Date object with the selected date
      const date = new Date(year, month, Number(e.target.innerHTML));
      console.log('date:', date);

      // Determine which spans to update based on currentDateType and currentFormType
      let dateMonthId, dateDayId, dayOfWeekId, dateYearId, realDateId;
      if (window.currentFormType === 'customer') {
        dateMonthId = 'dateMonthDefault';
        dateDayId = 'dateDayDefault';
        dayOfWeekId = 'dayOfTheWeekDefault';
        dateYearId = 'dateYearDefault';
        realDateId = 'realEstimateDateDefault';
      } else if (window.currentFormType === 'company') {
        if (window.currentDateType === 'estimate') {
          dateMonthId = 'estimateDateMonthCompany';
          dateDayId = 'estimateDateDayCompany';
          dayOfWeekId = 'estimateDayOfWeekCompany';
          dateYearId = 'estimateDateYearCompany';
          realDateId = 'realEstimateDateCompany';
        } else if (window.currentDateType === 'install') {
          dateMonthId = 'installDateMonthCompany';
          dateDayId = 'installDateDayCompany';
          dayOfWeekId = 'installDayOfWeekCompany';
          dateYearId = 'installDateYearCompany';
          realDateId = 'realInstallDateCompany';
        }
      }
      console.log('currentFormType:', window.currentFormType);
      console.log('currentDateType:', window.currentDateType);
      console.log('dateDayId:', dateDayId);
      document.getElementById(dateDayId).textContent = date.getDate();
      // Update the spans
      document.getElementById(dateDayId).textContent = date.getDate();
      document.getElementById(dateMonthId).textContent = date.toLocaleString('en-US', { month: 'short' });
      document.getElementById(dayOfWeekId).textContent = date.toLocaleString('en-US', { weekday: 'short' });
      document.getElementById(dateYearId).textContent = date.getFullYear();
      document.getElementById(realDateId).textContent = realDate;

      // Hide the container
      var container = document.querySelector('.container');
      container.style.display = 'none';

     
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day afte month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function defineProperty() {
  var osccred = document.createElement("div");
  osccred.innerHTML =
    "A Project By <a href='https://www.youtube.com/channel/UCiUtBDVaSmMGKxg1HYeK-BQ' target=_blank>Open Source Coding</a>";
  osccred.style.position = "absolute";
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred);
}

defineProperty();

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr
addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
    alert("Please fill all the fields");
    return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59
  ) {
    alert("Invalid Time Format");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Event already added");
    return;
  }
  const newEvent = {
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
  };
  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

//function to delete event when clicked on event
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventTitle = e.target.children[0].children[1].innerHTML;
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.title === eventTitle) {
              event.events.splice(index, 1);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
    }
  }
});

//function to save events in local storage
function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

//function to get events from local storage
function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  if (localStorage.getItem("events") === null) {
    return;
  }
  eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}
