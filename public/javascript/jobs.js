// Function to display the modal
window.displayModal = function() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
}

document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("myModal");
    var span = document.querySelector(".close");

    // Close the modal when the 'x' is clicked
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close the modal when clicking outside of it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Attach events to existing MaterialCard elements
    var materialCards = document.querySelectorAll(".MaterialCard");
    materialCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var content = this.querySelector('.materialCardBack');
            var front = this.querySelector('.materialCardFront');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
            if (content.style.display === 'block') {
                front.style.marginBottom = '0';
                front.style.borderBottom = 'none';
            } else {
                front.style.marginBottom = ''; // reset to default
                front.style.borderBottom = ''; // reset to default
            }
        });
    });

    // Fetch jobs and create cards dynamically
    fetch('/get-jobs')
    .then(response => response.json())
    .then(jobs => {
        const jobsContainer = document.getElementById('jobsContainer');

        jobs.forEach(job => {
            const jobsCard = document.createElement('div');
            jobsCard.className = 'jobsCard';

            // Add event listener to open modal on click
            jobsCard.addEventListener('click', function() {
                modal.style.display = "block";
            });

            const jobsCardNameandStatus = document.createElement('div');
            jobsCardNameandStatus.className = 'jobsCardNameandStatus';

            const jobsCardName = document.createElement('div');
            jobsCardName.className = 'jobsCardName';
            jobsCardName.textContent = job.customername;

            const jobsCardStatus = document.createElement('div');
            jobsCardStatus.className = 'jobsCardStatus';
            jobsCardStatus.textContent = job.status;

            jobsCardNameandStatus.appendChild(jobsCardName);
            jobsCardNameandStatus.appendChild(jobsCardStatus);

            const jobsCardAddress = document.createElement('div');
            jobsCardAddress.className = 'jobsCardAddress';
            jobsCardAddress.textContent = job.address;

            jobsCard.appendChild(jobsCardNameandStatus);
            jobsCard.appendChild(jobsCardAddress);

            jobsContainer.appendChild(jobsCard);
        });
    })
    .catch(error => console.error('Error:', error));
});