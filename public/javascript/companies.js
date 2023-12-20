// Open modal event listener
document.getElementById('addCompanyButton').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'block';
});

// Close modal event listener
document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('myModal').style.display = 'none';
});