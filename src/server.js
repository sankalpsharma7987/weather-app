//Import packages required

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const {forecast} =require('../lib/forecast');

//Declare Constants to calculate date

const $MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const $CURRENT_DATE = new Date();
const $TODAY_DATE = $CURRENT_DATE.getDate();
const $TODAY_YEAR = $CURRENT_DATE.getFullYear();
const $TODAY_MONTH = $MONTH[$CURRENT_DATE.getMonth()];
const $TODAY = $TODAY_MONTH +' ' +$TODAY_DATE +' '+$TODAY_YEAR;

//Array of Object to hold data fetched and transformed from API and modified by app.js code

let projectData = {};

//Counter to assign key value to every object entered in projectData

let id = 0;


//Initiate Express Server

const app = express();

//Configure port and other constants

const port = process.env.PORT || 3000;

//Configure PublicDirectory to access html, css and client-side javascript files

const publicDirectoryPath=path.join(__dirname,'../public');
app.use(express.static(publicDirectoryPath));

//Configure express app to use body-parser and cors package

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//Helper function to add Weather data to projectData array

const fetchAllWeatherData = (req,res)=> {
    console.log(projectData);
    res.send(projectData);
}

const fetchWeatherData = (req,res)=> {
const zipCode = req.query.zip;
const feeling = req.query.feeling;

    //Verify if there is valid zipcode and feeling value passed by the client side javascript fetch method call

    if(!zipCode||!feeling)
    {
        return res.send({
            error:'Either valid Zip Code from United States or valid value for Feeling is missing'
        })
    }
    
    //Pass the valid Zipcode value to fetch weather details of that zipcode and then append it to the projectdata object

    forecast({zipCode},(error,{weatherData}={})=> {

        if(error)
        {
            return res.send({
                error
            })
        }

        const newWeatherEntry = {
        city: weatherData.city,
        temp: weatherData.temp,
        dateValue: $TODAY,
        feeling: feeling,
        minTemp: weatherData.minTemp,
        maxTemp: weatherData.maxTemp,
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        country: weatherData.country,
        description: weatherData.description,
        realFeel: weatherData.realFeel,
        weatherIcon: weatherData.weatherIcon

    }

    projectData[id] = newWeatherEntry;
    id +=1;
        console.log(projectData);
        res.send(projectData[id-1])
        

    })

}

//Start server on the assigned port

const listening = ()=> {
    console.log(`Server is listening on port ${port}`);
};

app.listen(port,listening);

//Route Call

app.get('/fetchWeatherData',fetchWeatherData);
app.get('/all',fetchAllWeatherData);

