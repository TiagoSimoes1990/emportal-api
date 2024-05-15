// import 'dotenv/config';
require('dotenv').config('.env'); // environment configuration
const cors = require('cors');
// import express from 'express';
const express = require('express');
// import Pool from 'pg';
const Pool = require('pg').Pool;
// import bodyParser from 'body-parser';
const bodyParser = require('body-parser');


/*  Creates an Express application.
    The express() function os a top-level
    function exported by the express module
*/
const app = express();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
app.use(
    cors({
        origin: [`http://${process.env.REACT_HOST}`, `http://${process.env.REACT_HOST}:${process.env.REACT_PORT}`],
    })
)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

pool.connect((err,client,release) => {
    if(err){
        return console.error('Error acquiring client', err.stack)
    }
    client.query('SELECT NOW()', (err, result) => {
        release();
        if(err){
            return console.error('Error executing query', err.stack)
        }
        console.log("Connected to Database!")
    })
});

// Send to client a single user details
app.post('/api/usr-details', (req, res) => {
    // Get the id from the route parameter
    const userId = req.body.id;
    console.log("USER DATA for ID: ", userId);
    pool.query(`SELECT * FROM public.usr_data
                WHERE id=$1`,[userId])
        .then (usrData => {
            console.log(usrData);
            res.send(usrData.rows);
        })
});

// Send to client the complete table of users
app.get('/api/usr-data', (req, res, next) => {
    console.log("USER DATA:");
    pool.query('SELECT * FROM public.usr_data')
        .then (usrData => {
            console.log(usrData);
            res.send(usrData.rows);
        })
});

// Send to client the list of active users
app.get('/api/usr-list', (req, res, next) => {
    console.log("USER LIST:");
    pool.query(`SELECT
                    id,
                    first_names,
                    last_names,
                    phone_number,
                    prefix_phone_number,
                    email,
                    photo,
                    category_id
                FROM public.usr_data
                WHERE active = true;`)
        .then (usrList => {
            console.log(usrList);
            res.send(usrList.rows);
        })
});

// Require the Routes API
// Create a Server and run it on port 3000
const server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    // Starting the Server at the port 3000
    console.log(`Server listening on port ${port}...`);
});