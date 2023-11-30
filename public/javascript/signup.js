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
                    <label for="email">Email:
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autocomplete="off"
                            placeholder="Your Email"
                            required
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                            fill="none" stroke-linecap="round" stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                            <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
                        </svg>
                    </label>
                </div>
                <div class="text-field">
                    <label for="password">Password:
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Your Password"
                            title="Minimum 6 characters at 
                                least 1 Alphabet and 1 Number"
                            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
                            required
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
                            viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" 
                            fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z"></path>
                            <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
                            <path d="M8 11v-4a4 4 0 1 1 8 0v4"></path>
                        </svg>
                    </label>
                </div>
                <button type="submit" class="my-form__button">
                    Login
                </button>
                <div class="my-form__actions">
                    <a href="#" title="Reset Password">
                        Reset Password
                    </a>
                    <a href="#" title="Create Account">
                        Already have an account?
                    </a>
                </div>
            </form>
            </div>
        </div>
    `;

    // Insert the modal HTML into the page
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Add event listener to close the modal when the close button is clicked
    document.querySelector('.closeForSignup').addEventListener('click', function() {
        document.getElementById('signupModal').style.display = 'none';
    });

    // Display the modal
    var modal = document.getElementById('signupModal');
    modal.style.display = 'block';
    modal.style.opacity = 1;
    modal.style.pointerEvents = 'auto';
}