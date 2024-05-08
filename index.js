// Entry Point of the API Server

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
    user: 'postgres',
    host: 'localhost',
    database: 'employeportaldb',
    password: 'postgres',
    dialect: 'postgres',
    port: 5432
});

/* To handle the HTTP Methods Body Parser 
   is used, Generally used to extract the 
   entire body portion of an incoming 
   request stream and exposes it on req.body 
*/
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
})

app.get('/usrdata', (req, res, next) => {
    console.log("USER DATA:");
    pool.query('SELECT * FROM public.usr_data')
        .then (usrdata => {
            console.log(usrdata);
            res.send(usrdata.rows);
        })
})

// Require the Routes API
// Create a Server and run it on port 3000
const server = app.listen(3000, function () {
    let host = server.address().address;
    let port = server.address().port;
    // Starting the Server at the port 3000
})