function openSignupModal() {
    const modalHTML = `
        <div id="signupModal" class="signUpModal">
            <div class="signUpModalmodalContent">
                <span class="closeForSignup">&times;</span>
                <form class="my-form">
                <div class="socials-row">
                    <a href="#" title="Use Google">
                        <img src="../images/google.png" alt="Google">Use Google
                    </a>
                    <a href="#" title="Use Apple">
                        <img src="../images/apple.png" alt="Apple"> Use Apple
                    </a>
                </div>
                <div class="divider">
                    <div class="divider-line"></div> Or <div class="divider-line"></div>
                </div>
                <div class="text-field">
                    <label for="username">Username:
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Your Username"
                            required
                        >
                    </label>
                </div>
                <div class="text-field">
                    <label for="passwordForSignup">Password:
                        <input
                            id="passwordForSignup"
                            type="password"
                            name="passwordForSignup"
                            placeholder="Your Password"
                            required
                        >
                    </label>
                </div>
                <button type="submit" class="my-form__button">
                    Login
                </button>
            </form>
            </div>
        </div>
    `;
    
        // Insert the modal HTML into the page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log("Modal HTML inserted into the page");
    
        // Delay the execution of the rest of the code until the next event loop iteration
        setTimeout(() => {
            console.log("Inside setTimeout callback");
            // Get the form element
            var form = document.querySelector('.my-form');
            console.log("Form element retrieved", form);
    
            // Add an event listener for the form's submit event
            form.addEventListener('submit', function(event) {
                console.log("Form submit event triggered");
                // Prevent the form from being submitted normally
                event.preventDefault();
    
                // Get the username and password entered by the user
                var username = document.getElementById('username').value;
                var password = document.getElementById('passwordForSignup').value;
    
                fetch('/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username, password: password }),
                })
                .then(response => {
                    console.log("Received response from server", response);
                    return response.json();
                })
                .then(data => {
                    console.log("Received data from server", data);
                    if (data.status === 'success') {
                        // Login was successful
                        console.log('Login successful');
                
                        // Close the modal
                        document.getElementById('signupModal').style.display = 'none';
                    } else {
                        // Login failed
                        // Display an error message
                        alert(data.message);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
    
            // Add event listener to close the modal when the close button is clicked
            document.querySelector('.closeForSignup').addEventListener('click', function() {
                console.log("Close button clicked");
                document.getElementById('signupModal').style.display = 'none';
            });
    
            // Display the modal
            var modal = document.getElementById('signupModal');
            if (modal) {
                console.log("Displaying the modal");
                modal.style.display = 'block';
                modal.style.opacity = 1;
                modal.style.pointerEvents = 'auto';
            } else {
                console.error('signupModal not found!');
            }
        }, 0);
    }