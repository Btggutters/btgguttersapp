window.fillFormWithFakeData = function(event, formId) {
    event.preventDefault();
    event.stopPropagation();
    console.log('fillFormWithFakeData called');

    var fields = document.querySelectorAll(`#${formId} input, #${formId} select, #${formId} textarea`);
    fields.forEach(function(field) {
        switch(field.type) {
            case 'text':
            case 'number':
                if (field.id.includes('Name')) {
                    field.value = faker.name.findName();
                } else if (field.id.includes('Address')) {
                    field.value = faker.address.streetAddress();
                } else if (field.id.includes('Number') || field.id.includes('Phone')) {
                    field.value = faker.phone.phoneNumberFormat();
                } else if (field.id.includes('Price')) {
                    var randomPrice = Math.random() * (10 - 5) + 5; // random number between 5 and 10
                    field.value = Math.round(randomPrice * 2) / 2; // round to nearest 0.5
                }
                break;
            case 'email':
                field.value = faker.internet.email();
                break;
            case 'date':
                var randomDate = faker.date.future();
                field.valueAsDate = randomDate;
                break;
            case 'select-one':
            case 'select-multiple':
                var options = field.options;
                for (var i = 0; i < options.length; i++) {
                    if (Math.random() < 0.5) {
                        options[i].selected = true;
                    }
                }
                break;
            case 'textarea':
                field.value = faker.lorem.paragraph();
                break;
            // add more cases if needed
        }
    });
}