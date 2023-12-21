function openSigninModal() {
    // Remove old modal if it exists
    document.getElementById('SigninModal')?.remove();

    const modalHTML = `
        <div id="SigninModal" class="SigninModal">
            <div class="SigninModalmodalContent">
                <span class="closeForSignin">&times;</span>
                <form class="loginForm" id="loginForm">
                    <input class="inputForSignup" type="text" id="username" name="username" placeholder="Your Username" required>
                    <input class="inputForSignup" id="passwordForSignin" type="password" name="passwordForSignin" placeholder="Your Password" required>
                    <button type="submit" class="btgButton loginSubmitButton">Login</button>
                </form>
            </div>
        </div>
    `;

    // Insert the modal HTML into the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add an event listener for the form's submit event
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        // Get the username and password entered by the user
        var username = document.getElementById('username').value;
        var password = document.getElementById('passwordForSignin').value;

        fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username, password: password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                // Login was successful, close the modal and refresh the page
                document.getElementById('SigninModal').style.display = 'none';
            } else {
                // Login failed, display an error message
                alert(data.message);
            }
        })
        .catch(console.error);
    });

    // Add event listener to close the modal when the close button is clicked
    document.querySelector('.closeForSignin').addEventListener('click', function() {
        document.getElementById('SigninModal').style.display = 'none';
    });

    // Display the modal
    var modal = document.getElementById('SigninModal');
    modal.style.display = 'block';
    modal.style.opacity = 1;
    modal.style.pointerEvents = 'auto';
}

// public/javascript/signin.js
document.addEventListener('DOMContentLoaded', function() {
    // Get the login button
    var loginButton = document.querySelector('.loginButton');
  
    // Make a request to the server endpoint to check if the user is logged in
    fetch('/check-login')
      .then(response => {
        if (response.ok) {
          // The user is logged in, set the button's image to user.png
          loginButton.style.backgroundImage = 'url("../images/user.png")';
        } else {
          // The user is not logged in, set the button's image to exclamation.png
          loginButton.style.backgroundImage = 'url("../images/exclamation.png")';
        }
      });
});