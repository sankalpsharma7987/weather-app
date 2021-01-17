//Declaring constants

const $API_KEY = '01a30f10368848dd3f28c71405285e83';
const $BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const $CITY_ELEMENT = document.getElementById('city');
const $TEMPERATURE_ELEMENT = document.getElementById('temp');
const $BUTTON_ELEMENT = document.querySelector('button');

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


const postWeatherData = async ( url = '', data = {})=>{
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
      return data;
  }
  catch(error){
      console.log(error);
  }

}

//Helper function to update the UI Element

const updateUI = async ()=>{

    const res = await fetch('/all');

    try {

        const data = await res.json();
        console.log(data);
        $CITY_ELEMENT.textContent = data[1].city;
        $TEMPERATURE_ELEMENT.textContent = data[1].temp;
        
    }

    catch(error) {
        console.log(error);
    }

}

/*Helper function to chain promises,returned from async function, and add to the projectData array in the server.
Also update the UI Element*/

const generateWeatherResults = (e)=> {

    e.preventDefault();

    const zipCode = document.getElementById('zip').value;

    getWeatherData($BASE_URL,zipCode,$API_KEY).then(
        data=> postWeatherData('/addWeatherData',{city:data.name,temp:data.main.temp})
    ).then(
        updateUI()
    )
}

$BUTTON_ELEMENT.addEventListener('click',generateWeatherResults);