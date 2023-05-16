import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import './css/styles.css';
import API from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputElement: document.getElementById('search-box'),
  ulElement: document.querySelector('.country-list'),
  divElement: document.querySelector('.country-info'),
};

document.body.style.background = 'rgba(0,255,255, 0.3)';


refs.inputElement.addEventListener('input', debounce(onSubmit, DEBOUNCE_DELAY));

function onSubmit() {
  const inputCountry = refs.inputElement.value.trim();
  if (inputCountry === '') {
    clearInter();
    return;
  }
  API.fetchCountries(inputCountry)
    .then(data => {
      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      countruResult(data);
    })
    .catch(error => {
      clearInter();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function countryInfo(countries) {
  return countries.reduce(
    (acc, { name: { official }, capital, population, flags, languages }) => {
      languages = Object.values(languages).join(',');
      return (
        acc +
        `
        <img src="${flags.svg}" width="200" alt="name"/>
        <h1>${official}</h1>
        <h2>Capital: ${capital}</h2>
        <h3>Population: ${population}</h3>
        <p>Languages: ${languages}</p>
      `
      );
    },
    ''
  );
}

function countryList(country) {
  return country.reduce((acc, { name: { official }, flags }) => {
    return (
      acc +
      `
      <li class="image list"><img src="${flags.svg}" width="200" alt="name"/>
      <p class="title">${official}</p></li>
    `
    );
  }, '');
}

function countruResult(result) {
  if (result.length === 1) {
    clearInter();
    refs.ulElement.style.visibility = 'hidden';
    refs.divElement.style.visibility = 'visible';
    refs.divElement.innerHTML = countryInfo(result);
  }
  if (result.length >= 2 && result.length <= 10) {
    clearInter();
    refs.divElement.style.visibility = 'hidden';
    refs.ulElement.style.visibility = 'visible';
    refs.ulElement.innerHTML = countryList(result);
  }
}

function clearInter() {
  refs.ulElement.innerHTML = '';
  refs.divElement.innerHTML = '';
}
