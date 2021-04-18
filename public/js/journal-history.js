//Declaring constants

const $MAIN_CONTAINER_ELEMENT = document.querySelector('.main-container');
const $ENTRY_HOLDER_ELEMENT = document.querySelector('.container');
const $NAVBAR_ELEMENT = document.querySelector('.nav-bar');
const $STICKY_HEADER = $NAVBAR_ELEMENT.offsetTop;

const $NAVBAR_MOBILE_ELEMENT = document.querySelector('.nav-bar-mobile');
const $NAVBAR_MOBILE_BURGER_ELEMENT = document.querySelector('.nav-bar-mobile-burger');
const $NAVBAR_MODAL_MOBILE_ELEMENT = document.querySelector('.nav-bar-modal-mobile');

const $CLOSE_BUTTON_ELEMENT = document.querySelector('#close-btn-id');
const $ERROR_ELEMENT = document.querySelector('.error');

//Helper function for async javascript get method calls

const updateUI = async (dataObjects)=> {

     try {
        
        //From all the objects passed, their dataKeys would be fetched in array

        dataKeys = Object.keys(dataObjects);

        if(dataKeys.length>0)
        {

          //Set the display propert for main container to flex, before appending any element to the container element

          $MAIN_CONTAINER_ELEMENT.classList.add('main-container-display');

          for(dataKey of dataKeys)
          {
              
              const journalEntry = document.createElement('div');
              const divIcon = document.createElement('div');
              const divTemp = document.createElement('div');
              const divWeather = document.createElement('div');
              const divDateValue = document.createElement('div');
              const divFeelingSummaryDescription = document.createElement('div');
              const divWeatherDescription = document.createElement('div');
              const divFeeling = document.createElement('div');
              let text = `<img src='${dataObjects[dataKey].weatherIcon}'></img>`
  
              divIcon.innerHTML = text;
              text = `<p>${dataObjects[dataKey].temp}&deg;F</p>`
              divTemp.innerHTML = text;

              text = `<p>${dataObjects[dataKey].description}</p>`;
              divWeatherDescription.innerHTML = text;

              divWeather.appendChild(divIcon);
              divWeather.appendChild(divWeatherDescription);
              divWeather.appendChild(divTemp);
              divWeather.setAttribute('class','weather-class');
              journalEntry.appendChild(divWeather);
              
  
              text = `<p>${dataObjects[dataKey].dateValue}</p>`;
              divDateValue.innerHTML = text;
             
              text = `<p> Feeling: ${dataObjects[dataKey].feelingSummary}</p>`
              divFeelingSummaryDescription.innerHTML = text;
              divFeeling.appendChild(divDateValue);
              divFeeling.appendChild(divFeelingSummaryDescription);
              divFeeling.setAttribute('class','feeling-class');
              journalEntry.appendChild(divFeeling);
              journalEntry.setAttribute('class','entry-class');
  
              $ENTRY_HOLDER_ELEMENT.appendChild(journalEntry);
  
          }

        }

    }

    catch(error) {
        updateErrorUI(error);
    }

}

const updateErrorUI = (errorMessage)=>{

  $ERROR_ELEMENT.innerHTML = "";
  $ERROR_ELEMENT.innerHTML = errorMessage;
  $ERROR_ELEMENT.classList.add('error-display');

}

const stickyHeader  = ()=> {

//Add class consisting of fixed element-container css property when the element-container offsetY value is greater than the value of window.scrollY

  if (window.scrollY > $STICKY_HEADER) {
    $NAVBAR_ELEMENT.classList.add("sticky-header");
    $NAVBAR_MOBILE_ELEMENT.classList.add("sticky-header-mobile");
  } 
  
  else {
    $NAVBAR_ELEMENT.classList.remove("sticky-header");
    $NAVBAR_MOBILE_ELEMENT.classList.remove("sticky-header-mobile");
  }

}

const getAllJournalEntry = async()=>{
  
  try{
       //The response object will request for all the objects from the server.

       const res = await fetch('/all');
       const dataObjects = await res.json();
       return dataObjects;
  }

  catch(e)
  {
    updateErrorUI(e);
  }

}
const loadJournalEntry= async()=>{

  //Hide the error element

  $ERROR_ELEMENT.classList.remove('error-display');

  //Fetch All Journal Entry and then update the UI to populate the journal entries

  getAllJournalEntry().then(

    data=> updateUI(data)

  ).catch(e=>updateErrorUI(e));

}

//Helper function to slide-out navigation-modal for smaller screens

const slideOutNavigationModal =()=> {

  $NAVBAR_MODAL_MOBILE_ELEMENT.classList.add('nav-bar-modal-mobile-display');

}

const closeNavigationModal = ()=>{

  $NAVBAR_MODAL_MOBILE_ELEMENT.classList.remove('nav-bar-modal-mobile-display');
  
}

//Event Listener to generate journal entry at the click of Generate Forecast button

window.addEventListener('scroll',stickyHeader);

window.addEventListener('load',loadJournalEntry);

//Event Listener to show navigation bar for small screens

$NAVBAR_MOBILE_BURGER_ELEMENT.addEventListener('click',slideOutNavigationModal);
$CLOSE_BUTTON_ELEMENT.addEventListener('click',closeNavigationModal);