// Class: SE2840 - Lab 7 - MongoDB Bus Speed Checker
// Name: Ian Gresser
// Class Section: 021

const express = require("express");
const webpagedir = `${__dirname}/srv`;
const app = express();
const mongoose = require('mongoose');
const connection = mongoose.connect('mongodb://localhost/bustracker', {useNewUrlParser: true, useUnifiedTopology: true});
const busSchema = new mongoose.Schema({
    'rt': String,
    'vid': String,
    'spd': Number,
    'tmstmp': String,
    'lat': String,
    'lon': String
});
const BusModel = mongoose.model('Bus', busSchema);


app.use(express.static(webpagedir, {index:'BusSpeed.html'}));//had to specify file as it
                                            //wouldn't work otherwise on my system


app.use(express.urlencoded({ extended: true }));

/**
 * this will serve the data requested by the user
 */
app.get("/busSpeed", (request, response) =>{
    let speedRequest = request.query.spd;

    let intResult = isInputAnInteger(speedRequest);//checks if the filter value given is an int or not

    if (!intResult){
        response.json({
            status: "error",
            message: "Input given is not a valid integer. Integer must be greater than 0"
        });

    } else{
    let spd = parseInt(speedRequest);
    BusModel.find({ spd: { $gte: spd }}, (err, records)=>{
        if (err !== null){
            response.json({
                status: "error",
                message: `DB Error: ${err}` ,
            })
        } else {
            response.json({
                status:"success",
                records
            });
        }
    } )}
})


/**
 * input integer check provided to us by MSOE
 * @param value
 * @returns {boolean}
 */
const isInputAnInteger = (value) => {
    // Make sure the input string is a number
    if(isNaN(value)) {
        return false;
    }

    // We now know the string contains a number, but is it an integer?
    // Parse the string to a float (decimal with precision) and then verify that it is an integer
    if(!Number.isInteger(parseFloat(value))) {
        return false;
    }

    if (parseInt(value) <= 0){
        return false;
    }
    // The input string is a number and an integer
    return true;
}

app.listen(3000, () => {
    console.log("Server is running at http://localhost:3000");
});



