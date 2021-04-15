//Define API Key

//Assign API KEY value from dev.env environment variable value

const $API_KEY = process.env.API_KEY;
const $BASE_URL = process.env.BASE_URL;

//Packages required for the code.
const request= require('request');

//Implement OpenWeather API Call using callback function



const forecast=({zipCode},callback)=>{

    //Send get request to the OpenWeatherMap API

    const url = `${$BASE_URL}?zip=${zipCode},us&units=imperial&appid=${$API_KEY}`;
    const json=true;
    const method='GET';

    request({url,json,method},(error,{body}={})=>{

        if(error){

            callback('Unable to connect to the Open Weather API',undefined);


        }
        
        else if(body.cod==='404')
        {
            //Send the error message with undefined weatherData object if the zip code is invalid and body.cod value contains 404

            callback(`Unable to find location with the zip code.${zipCode}`,undefined);
        }
        
        

        else
        {
            //Send weatherData Object containing property values of the response body object, received from the OpenWeatherAPI response.

            try{
                const weatherData = {
                    city: body.name,
                    temp: body.main.temp,
                    minTemp: body.main.temp_min,
                    maxTemp: body.main.temp_max,
                    humidity: body.main.humidity,
                    windSpeed: body.wind.speed,
                    country:body.sys.country,
                    description: body.weather[0].description,
                    realFeel: body.main.feels_like,
                    weatherIcon: `https://openweathermap.org/img/wn/${body.weather[0].icon}@2x.png`
                    
    
                }

                //Send undefined error message as the response body object contains valid values returned from the OpenWeatherAPI response
    
                callback(undefined,{weatherData});

            }
            catch(e)
            {
                callback('Unable to find data for this location',undefined);
            }
            

        }
    });
}

module.exports= {forecast};
