
const form = document.getElementById('form');
const eventname = document.getElementById('eventname');
const location1 = document.getElementById('location');
const time = document.getElementById('time');



form.addEventListener('submit', e => {
    e.preventDefault();

    validateInputs();
});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};



const validateInputs = () => {
    const eventnameValue = eventname.value.trim();
    const locationValue = location1.value.trim();
    const timeValue = time.value.trim();


    if (eventnameValue === '') {
        setError(eventname, 'Event name is required');
    } else {
        setSuccess(eventname);
    }

    if (locationValue === '') {
        setError(location1, 'Location is required');
    } else {
        setSuccess(location1);
    }

    if (timeValue === '') {
        setError(time, 'Event time is required');

    } else {
        setSuccess(time);
    }

};
