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

    // Fetch jobs and create cards dynamically
    fetch('/get-jobs')
    .then(response => response.json())
    .then(jobs => {
        const jobsContainer = document.getElementById('jobsContainer');

        jobs.forEach(job => {
            const jobsCard = document.createElement('div');
            jobsCard.className = 'jobsCard';
    
            // Add data-id attribute to store the job id
            jobsCard.setAttribute('data-id', job.id);

            // Add event listener to each job card
            jobsCard.addEventListener('click', function() {
                const jobId = this.getAttribute('data-id');

                // Fetch job data and populate the form
                fetch(`/get-full-job/${jobId}`)
                    .then(response => response.json())
                    .then(job => {
                        console.log(job);
                        document.getElementById('jobId').value = job.id;
                        document.getElementById('name').value = job.customername;
                        document.getElementById('status').value = job.status;
                        document.getElementById('phone').value = job.customerphonenumber;
                        document.getElementById('address').value = job.address;
                        document.getElementById('company').value = job.companyname || '';
                        // For the drawing, you'll need to handle file downloads
                        document.getElementById('jobsCardEstimateDate').textContent = job.estdate || '';
                        document.getElementById('jobsCardInstallDate').textContent = job.insdate || '';
                        document.getElementById('price').value = job.price;
                        document.getElementById('notes').value = job.notes;
                        console.log(job.id);
                    
                        // Display the modal
                        modal.style.display = "block";
                    })
                    .catch(error => console.error('Error:', error));
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