import './styles.css';
import { error, alert } from '@pnotify/core';
// import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import './JS/fetchCountries';
import countryTmp from './templates/countryList.hbs';
import findCountry from './templates/findCountry.hbs';

const refs = {
  searchForm: document.querySelector('.js-search-form input'),
  countryList: document.querySelector('.js-countries'),
};

const debounce = require('lodash.debounce');

refs.searchForm.addEventListener('input', debounce(debounceInputCallback, 500));

function debounceInputCallback() {
  const inputCountry = refs.searchForm.value.trim();
  refs.countryList.innerHTML = '';
  if (!inputCountry) return;
  
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  };
  const url = `https://restcountries.eu/rest/v2/name/${inputCountry}`;
  fetch(url, options)
  .then(Response => Response.json())
  .then(data => {
    if (!data.length) return;
    if (data.length === 1){
      const markupOneCountry = findCountry(data)      
      refs.countryList.innerHTML = markupOneCountry;
    }
    else if (data.length > 10) return  error({
      title: 'Уточните ваш запрос',
    });
    else if (data.length >1 && data.length <=10){
      let markupListCountry = countryTmp(data)
      refs.countryList.innerHTML = markupListCountry;
    }    
  })
  .catch(error({
    title: 'Что-то пошло не так',
  }))
}



