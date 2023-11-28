document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById("myModal");
    var div = document.querySelector(".jobsCustomerCardFront");
    var span = document.querySelector(".close");

    div.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    var cards = document.querySelectorAll(".MaterialCard");

    cards.forEach(function(card) {
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
});