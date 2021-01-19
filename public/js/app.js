//Declaring constants

const $API_KEY = '01a30f10368848dd3f28c71405285e83';
const $BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const $BUTTON_ELEMENT = document.querySelector('button');
const $CONTAINER_ELEMENT = document.getElementById('container');
const $ZIP_ELEMENT = document.getElementById('zip');
const $FEELING_ELEMENT = document.getElementById('feelings');

let fragment = document.createDocumentFragment();
let currentKeys = [];


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
    //   return data;
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

const updateUI = async ()=>{

    //The response object will request for all the objects from the server.

    const res = await fetch('/all');

    try {
        
        const dataObjects = await res.json();
        //From all the objects returned, their dataKeys would be fetched in array
        dataKeys = Object.keys(dataObjects);
        //All the fetched data keys would be then compared with currentKeys array to find, which newKeys are currently present in the dataObject set
        let newKeys = dataKeys.filter(e => !currentKeys.includes(e));

        /* The newKey array will then be parsed to retrieve the new data objects and new paragraph elements 
        would be created and text content would be added, using the values from the new data objects.
        These new paragraph Elements will be then appended to the parent container,ie the div tag */

        for(newKey of newKeys)
        {
            
            let paragraphElement = document.createElement('div');
            let city = dataObjects[newKey].city;
            let temp = dataObjects[newKey].temp;
            let feeling = dataObjects[newKey].feeling;
            paragraphElement.textContent = `Temperature today in ${city} is ${temp} Farhenheit and I am feeling ${feeling}`;
            paragraphElement.setAttribute('class','entry-class');
            $CONTAINER_ELEMENT.appendChild(paragraphElement);

        }

        //These newKeys would be then pushed to the currentKeys array to maintain the records of the keys of data Objects already rendered in the page
        currentKeys.push(...newKeys);

        //Clear UI Elements after the data has been rendered
        // clearUI();
       
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
        data=>{
            postWeatherData('/addWeatherData',{city:data.name,temp:data.main.temp,feeling:$FEELING_ELEMENT.value}).then(
                updateUI()
            )
        }
    )
    
}

window.onscroll = function(){myScroll()};
const header = document.getElementById("element-container");
console.log(header);
const sticky = header.offsetTop;

function myScroll() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky-header");
  } else {
    header.classList.remove("sticky-header");
  }
} 

$BUTTON_ELEMENT.addEventListener('click',generateWeatherResults);