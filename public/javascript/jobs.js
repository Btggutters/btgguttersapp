document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById("myModal");
    const span = document.querySelector(".close");
    const jobsContainer = document.getElementById('jobsContainer');

    span.onclick = () => hideModal();
    window.onclick = (event) => {
        if (event.target == modal) hideModal();
    }

    const showModal = () => modal.style.display = "block";
    const hideModal = () => {
        modal.style.display = "none";
        fetchJobs(); // Fetch jobs after closing the modal
    };


    const fetchJobs = async () => {
        try {
            const response = await fetch('/get-jobs');
            if (!response.ok) throw new Error('Network response was not ok.');
            const jobs = await response.json();
            clearJobCards();
            jobs.forEach(job => createJobCard(job));
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    // Function to clear existing job cards
    const clearJobCards = () => {
        jobsContainer.innerHTML = '';
    };
    fetchJobs();


    const createJobCard = (job) => {
        const jobCard = document.createElement('div');
        jobCard.className = 'jobsCard';
        jobCard.setAttribute('data-id', job.id);
        jobCard.innerHTML = `
            <div class="jobsCardNameandStatus">
                <div class="jobsCardName">${job.customername}</div>
                <div class="jobsCardStatus">${job.status}</div>
            </div>
            <div class="jobsCardAddress">${job.address}</div>
        `;
        jobsContainer.appendChild(jobCard);
    };

    const populateModalWithJobDetails = (jobId) => {
        fetch(`/get-full-job/${jobId}`)
            .then(response => response.json())
            .then(job => populateFormFields(job))
            .catch(error => console.error(`Error fetching job details for job ID ${jobId}:`, error));
    };

    const populateFormFields = (job) => {
        document.getElementById('jobId').value = job.id;
        document.getElementById('name').value = job.customername;
        document.getElementById('status').value = job.status;
        document.getElementById('phone').value = job.customerphonenumber;
        document.getElementById('address').value = job.address;
        document.getElementById('email').value = job.customeremail;
        document.getElementById('company').value = job.companyname || '';
        document.getElementById('jobsCardEstimateDate').textContent = job.estdate || '';
        document.getElementById('jobsCardInstallDate').textContent = job.insdate || '';
        document.getElementById('price').value = job.price;
        document.getElementById('notes').value = job.notes;
        showModal();
    };

    jobsContainer.addEventListener('click', (event) => {
        const jobCard = event.target.closest('.jobsCard');
        if (jobCard) {
            const jobId = jobCard.getAttribute('data-id');
            populateModalWithJobDetails(jobId);
        }
    });

    fetchJobs();
});
// Debounce function to limit the rate of form submission
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Function to send form data to the server for saving
async function saveFormData(formData) {
    const jobId = formData.jobId; // Extract the jobId from the formData
    try {
        const response = await fetch(`/update-job/${jobId}`, { // Adjust the fetch URL to include the jobId
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        console.log(formData);
        if (!response.ok) throw new Error('Network response was not ok.');
        console.log('Saved'); // Print "Saved" to the console on successful save
    } catch (error) {
        console.error('Error saving form data:', error);
    }
}

document.querySelectorAll('.commonForm').forEach(form => {
    form.addEventListener('input', debounce(function(e) {
        const formData = new FormData(form);
        const data = { jobId: form.dataset.jobId }; // Assuming you store jobId in the form's dataset when populating it
        formData.forEach((value, key) => data[key] = value);
        saveFormData(data);
    }, 1000)); // Adjust debounce time as needed
});