// main.js

// This is a simple example of a JavaScript file for a web app. 
// Depending on the functionality of your app, you might need to add more code.

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');

    document.querySelector('.hamburgerIcon').addEventListener('click', function() {
        var navMenu = document.querySelector('.nav-menu');
        this.classList.toggle('rotate');
        navMenu.classList.toggle('show');
        document.querySelector('main').classList.toggle('blur');
    });
});