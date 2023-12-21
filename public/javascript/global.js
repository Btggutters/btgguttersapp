window.fillFormWithFakeData = function(event, formId) {
    event.preventDefault();
    event.stopPropagation();
    console.log('fillFormWithFakeData called');

    var fields = document.querySelectorAll(`#${formId} input, #${formId} select`);
    fields.forEach(function(field) {
        switch(field.type) {
            case 'text':
            case 'number':
                if (field.id.includes('Name')) {
                    field.value = faker.name.findName();
                } else if (field.id.includes('Address')) {
                    field.value = faker.address.streetAddress();
                } else if (field.id.includes('Number')) {
                    field.value = faker.phone.phoneNumberFormat();
                } else if (field.id.includes('Price')) {
                    var randomPrice = Math.random() * (10 - 5) + 5; // random number between 5 and 10
                    field.value = Math.round(randomPrice * 2) / 2; // round to nearest 0.5
                }
                break;
            case 'email':
                field.value = faker.internet.email();
                break;
            case 'select-one':
                var options = field.options;
                var randomOptionIndex = Math.floor(Math.random() * options.length);
                field.selectedIndex = randomOptionIndex;
                break;
            // add more cases if needed
        }
    });
}