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

     // Get the form element
    var form = document.querySelector('.my-form');

     // Add an event listener for the form's submit event
    form.addEventListener('submit', function(event) {
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
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Login was successful
                // Store the token in the local storage
                localStorage.setItem('token', data.token);
        
                // Show the header
                document.getElementById('header').style.display = 'block';
            } else {
                // Login failed
                // Show an error message
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    // Add event listener to close the modal when the close button is clicked
    document.querySelector('.closeForSignup').addEventListener('click', function() {
        document.getElementById('signupModal').style.display = 'none';
    });

    // Display the modal
    var modal = document.getElementById('signupModal');
    modal.style.display = 'block';
    modal.style.opacity = 1;
    modal.style.pointerEvents = 'auto';

    document.getElementById('passwordForSignup').onchange = function () {
        var passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/; // adjust this to match your password rules
        if (!passwordPattern.test(this.value)) {
            // the password doesn't match the pattern, set a custom validation message
            this.setCustomValidity('Your password must contain at least 8 characters, including uppercase, lowercase, and a number.');
        } else {
            // the password matches the pattern, clear any previous custom validation message
            this.setCustomValidity('');
        }
    };
}