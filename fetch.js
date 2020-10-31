// Contrainers:
const countryWrapper = document.querySelector('.wrapper');
const errorMessageContainer = document.querySelector('.error-message');
const errorMessage = document.querySelector('.message');
// Inputs:
const inputContainer = document.querySelector('.select-country');
const inputFindCountry = document.getElementById('country-name');
const inputBtnFind = document.getElementById('find-country');
inputFindCountry.focus();

// Componenet Renders:
///////////////////////////////////////////
const errorRender = (msg) => {
    
    errorMessage.innerHTML = msg;
    errorMessageContainer.style.transition = 'all .5s';
    errorMessageContainer.style.transform = 'translate(-50%,-50%) scale(1)';

    setTimeout(() => {
        errorMessageContainer.style.transform = 'translate(-50%,-50%) scale(0)';
    },2800);
}

const countryRender = (country) => {
    const markup = 
    `<div class="country">
        <div class="neighbour"> </div>
        <div class="country__flag">
            <img src="${country.flag}" alt="country flag">
        </div>
        <div class="country__info">
            <h2 class="coutry__name">${country.name}</h2>
            <p >👑${country.capital}</p>
            <p >🗣${country.languages[0].name}</p>
            <p >💰${country.currencies[0].code} ${country.currencies[0].symbol}</p>
            <p >👫${+(country.population / 1000000).toFixed(6)}</p>
            <p >📐${
                +(country.area >= 100000 
                ? (country.area / 1000).toFixed(4) 
                : (country.area / 1000).toFixed(3))} km2</p>
        </div>
    </div>`;

    if(countryWrapper.children.length > 0){
        countryWrapper.removeChild(countryWrapper.children[0]);
        countryWrapper.insertAdjacentHTML('afterbegin', markup);  
    }else{
        countryWrapper.insertAdjacentHTML('afterbegin', markup);  
    }
    inputContainer.classList.add('selected');
};

const neighborsRender = (stateList) => {
    const countryNeighbour = document.querySelector('.neighbour');

    for(let state of stateList){
        const markup = 
        `<div class="neighbour__country">
            <img src="${state.flag}" alt="neighbour country">
        </div>`;
        countryNeighbour.insertAdjacentHTML('afterbegin', markup);
    }
}


// AJAX Requests:
///////////////////////////////////////////

const findCountry = (countryName) => {
    fetch(`https://restcountries.eu/rest/v2/name/${countryName}`)
    .then(res => {

        if(!res.ok) 
            throw new Error(`Cannot found the country name - "${countryName}".`);

        return res.json();
    })
    .then(data => {
        
        // Render Country Card:
        countryRender(data[0]);

        // Render Neighbour Country Flags:
        if(data[0].borders.length > 0){
            const neighboursList = data[0].borders.map(country => `${country};`);
            
            findNeighbours(neighboursList);
        } 
    })
    .catch(err => { 

        err.message === 'Failed to fetch'
        ? errorRender('Check your Internet connection...')
        : errorRender(`Something wrong! ${err.message} <br/> Try again!`);
    });
};  

const findNeighbours = (neighboursList) => {
    fetch(`https://restcountries.eu/rest/v2/alpha?codes=${neighboursList.join('')}`)
    .then(res => res.json())
    .then(neighbourList => neighborsRender(neighbourList))
}


// Events:
///////////////////////////////////////////
inputBtnFind.addEventListener('click', () => {
    //inputFindCountry.value = 'Australia';
    if(!inputFindCountry.value) return;

    findCountry(inputFindCountry.value);

    inputFindCountry.value = '';
    inputFindCountry.focus();
});

