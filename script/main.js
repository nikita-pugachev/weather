import { getWeather } from './getWeather.js';

const form = document.querySelector('.search-form');
const cityNameInput = document.querySelector('.search-form__textfield');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        await getWeather();
        cityNameInput.value = '';
    } catch (err) {
        console.error(err.message);
    }
});

getWeather();
