/*!
  * Formify - The Javascript Library for sending forms via Javascript, the easy way.
  * Github: @snakysnake (https://github.com/snakysnake/formify.js) - MIT License
  */

document.addEventListener('DOMContentLoaded', function (event) {
    //disable default browser submit
    const formElems = document.querySelectorAll('form');

    //if its a ajax form, disable default behaviour
    for (i = 0; i < formElems.length; i++) {
        console.log(formElems[i]);
        if (formElems[i].getAttribute("formify")) {
            let form = formElems[i];
            formElems[i].addEventListener('submit', (e) => {
                // on form submission, prevent default
                e.preventDefault();
                submitForm(form);
            });
        }
    }
});

async function submitForm(form) {
    //prepare body
    let inputFields = form.querySelectorAll("[name]");
    var formData = new FormData();

    for (i = 0; i < inputFields.length; i++) {
        //add to formdata
        console.log(String(inputFields[i].name), String(inputFields[i].value));

        //if a key already exists, only add value of next one if checked (radiobuttons)
        if (formData.get(inputFields[i].name))
        {
            if (inputFields[i].checked)
            {
                formData.delete(inputFields[i].name);
                formData.append(String(inputFields[i].name), String(inputFields[i].value));
            }
        }
        //checkbox support
        else if (inputFields[i].type == "checkbox")
        {
            if (inputFields[i].checked)
            {
                formData.append(String(inputFields[i].name), String(inputFields[i].value));
            }
            else 
            {
                formData.append(String(inputFields[i].name), "off");
            }
        }
        else
        {
            formData.append(String(inputFields[i].name), String(inputFields[i].value));
        }
    }

    //get target url from form action
    target_url = form.getAttribute("action");
    t_method = form.getAttribute("method");

    //send form
    response = await postData(target_url, formData, t_method);

    console.log(response);
}

/**
 * Post Data to specified URL using POST
 * @param url target-url
 * @param data formData (body aka. payload)
 * @returns server response
 */
async function postData(url = '', data = {}, t_method = "post") {
    // Default options are marked with *
    const response = await fetch(url, {
        method: t_method, // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: data // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}