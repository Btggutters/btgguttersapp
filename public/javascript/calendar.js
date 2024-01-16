// calendar.js

// Function to generate a calendar for a given month and year
function generateCalendar(month, year) {
  var date = new Date(year, month, 1);
  var days = [];
  var currentMonth = date.getMonth();

  // Adjust the start of the week to Sunday
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() - 1);
  }

  // Generate the days for the calendar
  while (days.length < 42) { // 42 days = 6 weeks
    days.push({
      date: new Date(date),
      isInCurrentMonth: date.getMonth() === currentMonth
    });
    date.setDate(date.getDate() + 1);
  }

  return days;
}

// Array of month names for display
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Get the modal, open button, and close button
var modal = document.getElementById('modal');
var openButton = document.getElementById('openModal');
var closeButton = document.getElementById('closeModal');

// Current month and year
var currentMonth = new Date().getMonth();
var currentYear = new Date().getFullYear();

// Function to update the calendar display
function updateCalendarDisplay(month, year) {
  var calendarElement = document.getElementById('calendar');
  var monthElement = document.getElementById('month');
  var yearElement = document.getElementById('year');

  // Clear the calendar
  while (calendarElement.firstChild) {
    calendarElement.removeChild(calendarElement.firstChild);
  }

  // Generate the days for the new calendar
  var days = generateCalendar(month, year);

  // Set the month and year
  monthElement.textContent = monthNames[month];
  yearElement.textContent = year;

  // Add the days of the week to the calendar
  var daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysOfWeek.forEach(function(dayOfWeek) {
    var dayElement = document.createElement('div');
    dayElement.className = 'dayOfWeek';
    dayElement.textContent = dayOfWeek;
    calendarElement.appendChild(dayElement);
  });

// Add the days to the calendar
days.forEach(function(dayInfo) {
  var dayElement = document.createElement('div');
  dayElement.className = 'day';

  // If the day is not in the current month, apply the 'not-current-month' class
  if (!dayInfo.isInCurrentMonth) {
    dayElement.classList.add('not-current-month');
  }

  // Create a span for the day number
  var dayNumber = document.createElement('span');
  dayNumber.className = 'day-number';
  dayNumber.textContent = dayInfo.date.getDate();

  // If the day is not in the current month, also apply the 'not-current-month' class to the day number
  if (!dayInfo.isInCurrentMonth) {
    dayNumber.classList.add('not-current-month');
  }

  // Append the day number to the day element
  dayElement.appendChild(dayNumber);

  calendarElement.appendChild(dayElement);
});
}

// When the user clicks the button, open the modal and generate the calendar
openButton.onclick = function() {
  modal.style.display = "block";
  updateCalendarDisplay(currentMonth, currentYear);
}

// When the user clicks on <span> (x), close the modal
closeButton.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Event listener for previous month button
document.getElementById('prevMonth').addEventListener('click', function() {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateCalendarDisplay(currentMonth, currentYear);
});

// Event listener for next month button
document.getElementById('nextMonth').addEventListener('click', function() {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateCalendarDisplay(currentMonth, currentYear);
});

// Initial call to display the current month and year when the page loads
updateCalendarDisplay(currentMonth, currentYear);