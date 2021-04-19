//Import packages required

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const {forecast} =require('../lib/forecast');
let journalEntryData = require('./objects/journalEntry');

//Declare Constants to calculate date

const $MONTH = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const $CURRENT_DATE = new Date();
const $TODAY_DATE = $CURRENT_DATE.getDate();
const $TODAY_YEAR = $CURRENT_DATE.getFullYear();
const $TODAY_MONTH = $MONTH[$CURRENT_DATE.getMonth()];
const $TODAY = $TODAY_MONTH +' ' +$TODAY_DATE +' '+$TODAY_YEAR;


//Counter to assign key value to every object entered in journalEntryData

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

//Helper function to add Weather data to journalEntryData array

const fetchAllWeatherData = (req,res)=> {
    res.send(journalEntryData);
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
    
    //Pass the valid Zipcode value to fetch weather details of that zipcode and then append it to the journalEntryData object

    forecast({zipCode},(error,{weatherData}={})=> {

        if(error)
        {
            return res.send({
                error
            })
        }

              
        let feelingSplit = feeling.split(" ");
        let feelingSliceArray = feelingSplit.slice(0,3);
        let feelingSlice = feelingSliceArray.join(" ");
        let feelingSummary = feelingSplit.length>3?feelingSlice.concat('...'):feeling;

        let descriptionWordArray = weatherData.description.split(" ");
        let descriptionCaps = descriptionWordArray.map(word=> word[0].toUpperCase()+word.substr(1));
        let description = descriptionCaps.join(" ");

        const newJournalEntry = {
        city: weatherData.city,
        temp: Math.round(weatherData.temp,0),
        dateValue: $TODAY,
        feeling: feeling,
        feelingSummary,
        minTemp: Math.round(weatherData.minTemp,0),
        maxTemp: Math.round(weatherData.maxTemp,0),
        humidity: weatherData.humidity,
        windSpeed: weatherData.windSpeed,
        country: weatherData.country,
        description,
        realFeel: weatherData.realFeel,
        weatherIcon: weatherData.weatherIcon

    }

    journalEntryData[id] = newJournalEntry;
    id +=1;
        res.send(journalEntryData[id-1])
        

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

