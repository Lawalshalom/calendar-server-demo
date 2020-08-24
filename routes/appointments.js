'use strict';

const express = require('express');
const moment = require('moment');
const Appointment = require('../models/appointment');
const mongoose = require('mongoose');
const router = new express.Router();


// GET: /appointments
router.get('/', function(req, res, next) {
  Appointment.find()
    .then(function(appointments) {
        res.render('/index', appointments);
    });
});

const Schema = mongoose.Schema;

const BirthdaySchemaUg = new Schema({
  name: { type: String, required: true },
  birthday: { type: String, required: true }
});

const BirthdaySchemaPg = new Schema({
    name: { type: String, required: true },
    birthday: { type: String, required: true }
  });

  const UgBirthday = mongoose.model('Ugbirthday', BirthdaySchemaUg);
  const PgBirthday = mongoose.model('Pgbirthday', BirthdaySchemaPg);


router.post("/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "") {
        res.status(201).json({error: 'username is required'});
    }
    else if (password === "") {
        res.status(201).json({error: 'password is required'});
    }
    else if(username === "admin" && password === "scm-birthdays"){
        PgBirthday.find({}, (err, birthdays) => {
            if (err) {console.log(err)
            }
            else if (birthdays.length === 0) return res.status(201).json('No birthdays yet in the database.');
            res.status(201).json({type: "postgraduate", birthdays: birthdays});
        });
    }
    else if(username === "cfu" && password === "scm-birthdays"){
            UgBirthday.find({}, (err, birthdays) => {
                if (err) {console.log(err)};
                if (birthdays.length === 0) return res.status(201).json('No birthdays yet in the database.');
                res.status(201).json({type: "undergraduate", birthdays: birthdays});
            });
    }
   else res.status(201).json({error: "Invalid Username or Password!"});
});


router.post("/delete/ug/birthday", (req,res) => {
    const { name, birthday } = req.body;
    if (name === ""){
        res.status(201).json({error: 'name is required'});
    }
    else if (birthday === ""){
        res.status(201).json({error: 'birthday is required'});
    } else {
        Appointment.remove({name: name});
        UgBirthday.findOneAndDelete({name: name, birthday:birthday}, (err, ugBirthday) => {
            if (err){
                console.log(err);
            }
            else {
                if (ugBirthday){
                   return res.status(201).json({success: 'birthday deleted successfully'});
                }
                else if (!ugBirthday){
                    res.status(201).json({failed: 'cannot find birthday'});
                };
            };
        });
    };
});


router.post("/delete/pg/birthday", (req,res) => {
    const { name, birthday } = req.body;
    if (name === ""){
        res.status(201).json({error: 'name is required'});
    }
    else if (birthday === ""){
        res.status(201).json({error: 'birthday is required'});
    } else {
        Appointment.remove({name: name});
        PgBirthday.findOneAndDelete({name: name, birthday:birthday}, (err, pgBirthday) => {
            if (err){
                console.log(err);
            }
            else {
                if (pgBirthday){
                   return res.status(201).json({success: 'birthday deleted successfully'});
                }
                else {
                    res.status(201).json({failed: 'cannot find birthday'});
                };
            };
        });
    };
});



router.post("/add/ug/birthday", (req,res) => {
    const { name, birthday } = req.body;
    if (name === ""){
        res.status(201).json({error: 'name is required'});
    }
    else if (birthday === ""){
        res.status(201).json({error: 'birthday is required'});
    } else {
        const newUgBirthday = new UgBirthday({name: name, birthday: birthday})
        newUgBirthday.save((err, birthday) => {
          if (err) {console.log(err);
        }
        else if(birthday) {
        res.status(201).json({success: 'birthday added successfully'});
        }
        });
// '+2349084671347'
       const newAppointent = new Appointment({
                name: name,
                type: 'undergrad',
                time: birthday});
            newAppointent.save((err, appointment) => {
                if (err) {console.log(err);
            };
            console.log(appointment);
    });
}
});

router.post("/add/pg/birthday", (req,res) => {
    const { name, birthday } = req.body;
    if (name === ""){
        res.status(201).json({error: 'name is required'});
    }
    else if (birthday === ""){
        res.status(201).json({error: 'birthday is required'});
    } else {
        const newPgBirthday = new PgBirthday({name: name, birthday: birthday})
        newPgBirthday.save((err, birthday) => {
          if (err) {console.log(err);
        }
        else if(birthday) {
        res.status(201).json({success: 'birthday added successfully'});
        };
        });
        const newAppointent = new Appointment({
            name: name,
            type: 'postgrad',
            time: moment(birthday, 'YYYY-MM-DD')});
        newAppointent.save((err, appointment) => {
        if (err) {console.log(err);
        };
        });
    };
});
module.exports = router;
