//Declaring constants

const $BUTTON_ELEMENT = document.querySelector('#generate');
const $ZIP_ELEMENT = document.querySelector('#zip');
const $FEELING_ELEMENT = document.querySelector('#feelings');
const $DATE_ELEMENT = document.querySelector('#date');
const $TEMP_ELEMENT = document.querySelector('#temp');

const $ENTRY_HOLDER_ELEMENT = document.querySelector('#entryHolder');
const $CONTENT_ELEMENT = document.querySelector('#content');

const $RECENT_ENTRY_ELEMENT = document.querySelector('#entryHeader');

const $NAVBAR_ELEMENT = document.querySelector('.nav-bar');
const $NAVBAR_MOBILE_ELEMENT = document.querySelector('.nav-bar-mobile');
const $NAVBAR_MOBILE_BURGER_ELEMENT = document.querySelector('.nav-bar-mobile-burger');
const $NAVBAR_MODAL_MOBILE_ELEMENT = document.querySelector('.nav-bar-modal-mobile');

const $CLOSE_BUTTON_ELEMENT = document.querySelector('#close-btn-id');

const $STICKY_HEADER = $NAVBAR_ELEMENT.offsetTop;
const $STICKY_MOBILE_HEADER = $NAVBAR_MOBILE_ELEMENT.offsetTop;

const $ERROR_ELEMENT =document.querySelector('.error');

const reg = new RegExp('^[0-9]+$');

//Helper function to verify if the zip code has number

const verifyZipValue = (e)=> {

  const value = e.target.value;
  

  if(reg.test(value)||e.target.value==="")
  {
    $ERROR_ELEMENT.value = "";
    $ERROR_ELEMENT.classList.remove('error-display');
  }

  else if(!reg.test(value))
  {
    updateErrorUI('Invalid Zip Code for USA')
  }
    
}

//Helper function for async javascript get method calls

const getWeatherData = async (zipCode, feeling)=> {

    // const res = await fetch(`${baseURL}?zip=${zipCode},us&units=imperial&appid=${apiKey}&feeling=${feeling}`);
    const res = await fetch(`http://localhost:3000/fetchWeatherData?zip=${zipCode}&feeling=${feeling}`);

    try {
      const data = await res.json();
      return data;
    }  catch(error) {
      updateErrorUI(error);
    }

}

//Helper function to clear the UI Element.

const clearUI = ()=> {

    $ZIP_ELEMENT.value = '';
    $FEELING_ELEMENT.value = '';

}

//Helper function to update the UI Element

const updateDate = (dataObject)=> {

  const divDateElementHeading = document.createElement('div');
  const divDate = document.createElement('div');
  let text = `<h3> Current Weather in ${dataObject.city}, ${dataObject.country}</h3>`
  divDateElementHeading.innerHTML = text;
  $DATE_ELEMENT.appendChild(divDateElementHeading);
  text = `<p>${dataObject.dateValue}</p>`;
  divDate.innerHTML = text;
  $DATE_ELEMENT.appendChild(divDate);

}

const updateTemperature =(dataObject)=> {

  const divImageElement = document.createElement('div');
  const divTemp = document.createElement('div');
  let text = `<img src='${dataObject.weatherIcon}'></img>`
  divImageElement.innerHTML = text;
  $TEMP_ELEMENT.appendChild(divImageElement);
  text = `<h1> ${dataObject.temp} &deg;F</h1>`;
  divTemp.innerHTML = text;
  $TEMP_ELEMENT.appendChild(divTemp);

}

const updateContent = (dataObject)=> {

  const divRealFeel = document.createElement('div');
  const divMinTemp = document.createElement('div');
  const divMaxTemp = document.createElement('div');
  const divHumidity = document.createElement('div');
  const divWindSpeed = document.createElement('div');
  const divConditions = document.createElement('div');
  const divFeeling = document.createElement('div');
  let text = `<b> Real Feel </b> ${dataObject.realFeel} &deg;F`;

  divRealFeel.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divRealFeel);
  
  text = `<b> Minimum Temperature </b> ${dataObject.minTemp} &deg;F`;
  divMinTemp.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divMinTemp);
  
  text = `<b> Minimum Temperature </b> ${dataObject.maxTemp} &deg;F`;
  divMaxTemp.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divMaxTemp);

  text = `<b> Humidity </b> <span>${dataObject.humidity} &percnt;</span>`
  divHumidity.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divHumidity);
  
  text = `<b> Wind Speed </b> <span>${dataObject.humidity} mi/hr</span>`
  divWindSpeed.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divWindSpeed);

  text = `<b> Conditions </b> <span>${dataObject.description} </span>`
  divConditions.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divConditions);

  text = `<b> Feeling </b> <span>${dataObject.feeling} </span>`
  divFeeling.innerHTML = text;
  $CONTENT_ELEMENT.appendChild(divFeeling);

}

//Helper function to clear data from the elements

const clearData = ()=>{

  $CONTENT_ELEMENT.innerHTML = "";
  $DATE_ELEMENT.innerHTML = "";
  $TEMP_ELEMENT.innerHTML = "";

}

const updateErrorUI = (errorMessage)=>{

  $ERROR_ELEMENT.innerHTML = "";
  $ERROR_ELEMENT.innerHTML = errorMessage;
  $ERROR_ELEMENT.classList.add('error-display');

}

const updateUI = async (dataObject)=> {

    try {
        
        

        //Clear any previous data, already present in the DOM
        clearData();

        //Update the DOM Div tags after they are cleared

        updateDate({city:dataObject.city,country:dataObject.country,dateValue:dataObject.dateValue})
        updateTemperature({temp:dataObject.temp,weatherIcon:dataObject.weatherIcon});
        updateContent ({realFeel: dataObject.realFeel,
          minTemp:dataObject.minTemp,
          maxTemp:dataObject.maxTemp,
          humidity:dataObject.humidity,
          windSpeed:dataObject.windSpeed,
          description: dataObject.description,
          feeling: dataObject.feeling
        })
        
        //Clear UI Elements after the data has been rendered
        clearUI();

        //Show UI Elements
        $ENTRY_HOLDER_ELEMENT.removeAttribute('style');
        

        //Scroll to the Recent Entry Section to view the forecast
        $RECENT_ENTRY_ELEMENT.scrollIntoView({behavior:'smooth'})
       
    }

    catch(error) {
        console.log(error);
    }

}

/*Helper function to chain promises,returned from async function, and add to the projectData array in the server.
Also update the UI Element*/

const generateWeatherResults = (e)=> {

    e.preventDefault();
    $ERROR_ELEMENT.classList.remove('error-display');

    if(reg.test($ZIP_ELEMENT.value)&&$ZIP_ELEMENT.value&&$FEELING_ELEMENT.value)
    {
      //Call getWeatherData helper function on client app.js javascript file and sends zip code and feeling
    getWeatherData($ZIP_ELEMENT.value,$FEELING_ELEMENT.value).then(
      data=> {
        
        if(data.error)
        {
          updateErrorUI(data.error)
          clearUI();
        }
        else {
          updateUI(data)
        }
      }
    )

    }

    else if(!reg.test($ZIP_ELEMENT.value))
    {
      updateErrorUI('Invalid Zip Code for USA');
      clearUI();
    }

    else if(!$ZIP_ELEMENT.value||!$FEELING_ELEMENT.value) {
      updateErrorUI('Cannot leave Zip code or Journal Entry Empty')
      clearUI();
    }
    
    
    
}

//Helper function to have a sticky element container, consisting of navigation bar, in order to scroll to different pages

const stickyHeader  = ()=> {

//Add class consisting of fixed element-container css property when the element-container offsetY value is greater than the value of window.scrollY

  if (window.scrollY > $STICKY_HEADER) {
  $NAVBAR_ELEMENT.classList.add("sticky-header");
  $NAVBAR_MOBILE_ELEMENT.classList.add("sticky-header-mobile");
  } 

  else {
  $NAVBAR_ELEMENT.classList.remove("sticky-header");
  
  }

  if(window.scrollY>$STICKY_MOBILE_HEADER)
  {
    $NAVBAR_MOBILE_ELEMENT.classList.add("sticky-header-mobile");
  }
  else {
    $NAVBAR_MOBILE_ELEMENT.classList.remove("sticky-header-mobile");
  }

}

//Helper function to slide-out navigation-modal for smaller screens
const slideOutNavigationModal =()=> {

  $NAVBAR_MODAL_MOBILE_ELEMENT.classList.add('nav-bar-modal-mobile-display');

}

const closeNavigationModal = ()=>{
  $NAVBAR_MODAL_MOBILE_ELEMENT.classList.remove('nav-bar-modal-mobile-display');
}

//Event Listener to generate journal entry at the click of Generate Forecast button

$BUTTON_ELEMENT.addEventListener('click',generateWeatherResults);
window.addEventListener('scroll',stickyHeader);

//Event Listener to show navigation bar for small screens

$NAVBAR_MOBILE_BURGER_ELEMENT.addEventListener('click',slideOutNavigationModal);
$CLOSE_BUTTON_ELEMENT.addEventListener('click',closeNavigationModal);

//Event Listener to verify Zip code value

$ZIP_ELEMENT.addEventListener('keyup',verifyZipValue);

//Hide Entry Holder Division Tag on page load

$ENTRY_HOLDER_ELEMENT.setAttribute('style',"display:none");

