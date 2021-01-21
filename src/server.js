//Import packages required

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

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

const addWeatherData =(req,res)=> {

    const newWeatherEntry = {

        city: req.body.city,
        temp: req.body.temp,
        dateValue:req.body.dateValue,
        feeling: req.body.feeling,
        minTemp: req.body.minTemp,
        maxTemp: req.body.maxTemp,
        humidity: req.body.humidity,
        windSpeed: req.body.windSpeed,
        country: req.body.country,
        description: req.body.description,
        realFeel: req.body.realFeel,
        weatherIcon: req.body.weatherIcon

    }

    projectData[id] = {...newWeatherEntry};
    id +=1;
    res.send(projectData);

}

const sendWeatherData = (req,res)=> {
    res.send(projectData);
}

const sendRecentWeatherData =(req,res)=> {
    res.send(projectData[id-1]);
}

//Start server on the assigned port

const listening = ()=> {
    console.log(`Server is listening on port ${port}`);
};

app.listen(port,listening);

//Route Call

app.post('/addWeatherData',addWeatherData);
app.get('/weather',sendRecentWeatherData);
app.get('/all',sendWeatherData);

