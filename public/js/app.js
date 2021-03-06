//Declaring constants

const $API_KEY = '01a30f10368848dd3f28c71405285e83';
const $BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

const $BUTTON_ELEMENT = document.querySelector('#generate');
const $ZIP_ELEMENT = document.querySelector('#zip');
const $FEELING_ELEMENT = document.querySelector('#feelings');
const $DATE_ELEMENT = document.querySelector('#date');
const $TEMP_ELEMENT = document.querySelector('#temp');
const $ENTRY_HOLDER_ELEMENT = document.querySelector('#entryHolder');
const $CONTENT_ELEMENT = document.querySelector('#content');
const $RECENT_ENTRY_ELEMENT = document.querySelector('#entryHeader');
const $NAVBAR_ELEMENT = document.querySelector('.nav-bar');
const $STICKY_HEADER = $NAVBAR_ELEMENT.offsetTop;

const $MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const $CURRENT_DATE = new Date();
const $TODAY_DATE = $CURRENT_DATE.getDate();
const $TODAY_YEAR = $CURRENT_DATE.getFullYear();
const $TODAY_MONTH = $MONTH[$CURRENT_DATE.getMonth()];
const $TODAY = $TODAY_MONTH +' ' +$TODAY_DATE +' '+$TODAY_YEAR;


//Helper function for async javascript get method calls

const getWeatherData = async (baseURL, zipCode, apiKey)=> {

    const res = await fetch(`${baseURL}?zip=${zipCode},us&units=imperial&appid=${apiKey}`);

    try {
      const data = await res.json();
      return data;
    }  catch(error) {
      console.log("error", error);
    }

  }


const postWeatherData = async (url = '', data = {})=> {

    const response = await fetch(url, {
    method: 'POST',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),      
  })

  try {
      const data = await response.json();
  }
  catch(error){
      console.log(error);
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

const updateUI = async ()=> {

    //The response object will request for all the objects from the server.

    const res = await fetch('/weather');

    try {
        
        const dataObject = await res.json();

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

    getWeatherData($BASE_URL,$ZIP_ELEMENT.value,$API_KEY).then(
        data=> {
            postWeatherData('/addWeatherData',{
              city: data.name,
              temp: data.main.temp,
              dateValue: $TODAY,
              feeling: $FEELING_ELEMENT.value,
              minTemp: data.main.temp_min,
              maxTemp: data.main.temp_max,
              humidity: data.main.humidity,
              windSpeed: data.wind.speed,
              country:data.sys.country,
              description: data.weather[0].description,
              realFeel: data.main.feels_like,
              weatherIcon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            }).then(
                updateUI()
            )
        }
    )
    
}

//Helper function to have a sticky element container, consisting of navigation bar, in order to scroll to different pages

const stickyHeader  = ()=> {

//Add class consisting of fixed element-container css property when the element-container offsetY value is greater than the value of window.scrollY

  if (window.scrollY > $STICKY_HEADER) {
    $NAVBAR_ELEMENT.classList.add("sticky-header");
  } else {
    $NAVBAR_ELEMENT.classList.remove("sticky-header");
  }

} 

//Event Listener to generate journal entry at the click of Generate Forecast button

$BUTTON_ELEMENT.addEventListener('click',generateWeatherResults);
window.addEventListener('scroll',stickyHeader);

//Hide Entry Holder Division Tag on page load
$ENTRY_HOLDER_ELEMENT.setAttribute('style',"display:none");