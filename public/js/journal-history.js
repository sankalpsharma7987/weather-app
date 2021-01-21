//Declaring constants

const $API_KEY = '01a30f10368848dd3f28c71405285e83';
const $BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const $ENTRY_HOLDER_ELEMENT = document.querySelector('.container');
const $NAVBAR_ELEMENT = document.querySelector('.nav-bar');
const $STICKY_HEADER = $NAVBAR_ELEMENT.offsetTop;

//Helper function for async javascript get method calls

const updateUI = async ()=> {

    //The response object will request for all the objects from the server.

    const res = await fetch('/all');

    try {
        
        const dataObjects = await res.json();

        //From all the objects returned, their dataKeys would be fetched in array

        dataKeys = Object.keys(dataObjects);

        for(dataKey of dataKeys)
        {
            
            const journalEntry = document.createElement('div');
            const divIcon = document.createElement('div');
            const divTemp = document.createElement('div');
            const divWeather = document.createElement('div');
            const divDateValue = document.createElement('div');
            const divFeelingDescription = document.createElement('div');
            const divFeeling = document.createElement('div');
            let text = `<img src='${dataObjects[dataKey].weatherIcon}'></img>`

            divIcon.innerHTML = text;
            text = `<p>${dataObjects[dataKey].temp}&deg;F</p>`
            divTemp.innerHTML = text;
            divWeather.appendChild(divIcon);
            divWeather.appendChild(divTemp);
            divWeather.setAttribute('class','weather-class');
            journalEntry.appendChild(divWeather);
            

            text = `<p>${dataObjects[dataKey].dateValue}</p>`;
            divDateValue.innerHTML = text;
           
            text = `<p> Feeling: ${dataObjects[dataKey].feeling}</p>`;
            divFeelingDescription.innerHTML = text;
            divFeeling.appendChild(divDateValue);
            divFeeling.appendChild(divFeelingDescription);
            divFeeling.setAttribute('class','feeling-class');
            journalEntry.appendChild(divFeeling);
            journalEntry.setAttribute('class','entry-class');

            $ENTRY_HOLDER_ELEMENT.appendChild(journalEntry);

        }

    }

    catch(error) {
        console.log(error);
    }

}

const stickyHeader  = ()=> {

//Add class consisting of fixed element-container css property when the element-container offsetY value is greater than the value of window.scrollY

  if (window.scrollY > $STICKY_HEADER) {
    $NAVBAR_ELEMENT.classList.add("sticky-header");
  } else {
    $NAVBAR_ELEMENT.classList.remove("sticky-header");
  }

} 

//Event Listener to generate journal entry at the click of Generate Forecast button

window.addEventListener('scroll',stickyHeader);

updateUI();