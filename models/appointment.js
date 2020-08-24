'use strict';

const mongoose = require('mongoose');
const moment = require('moment');
const cfg = require('../config');
const Twilio = require('twilio');

const AppointmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  time: {type: Date, index: true},
});

AppointmentSchema.methods.requiresNotification = function(date) {
  const birthday = moment(this.time, 'YYYY-MM-DD');
    if (date.hours() === 0 && date.minutes() === 0){
      if (birthday.month() === date.month() && birthday.date() === date.date()) {
      return true;
      }
    } return false;
};
AppointmentSchema.methods.weeklyNotifs = function(date) {
  const birthday = moment(this.time, 'YYYY-MM-DD');
  if (date.weekday() === 0 && date.hours() === 0 && date.minutes() === 0){
    if (birthday.weeks() === date.weeks() && birthday.month() === date.month()){
      return true;
    }
  } return false;
};

AppointmentSchema.statics.sendNotifications = function(callback) {
  // now
  const searchDate = moment();
  Appointment
    .find()
    .then(function(appointments) {
      appointments = appointments.filter(function(appointment) {
        return appointment.requiresNotification(searchDate);
      });
      if (appointments.length > 0) {
        sendNotifications(appointments);
    };
  });

  /**
    * Send messages to all appoinment owners via Twilio
    * @param {array} appointments List of appointments.
    */
    function sendNotifications(appointments) {
        const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
        const dailyUgBirthday = [];
        const dailyPgBirthday = [];
        appointments.forEach(function(appointment) {
          if (appointment.type === "undergrad"){
          dailyUgBirthday.push(appointment.name);
          } else dailyPgBirthday.push(appointment.name);
        });
            // Create options to send the message
            if(dailyUgBirthday.length > 0) {
              const ugPhone = '+2348160983729';
              const options = {
                to: ugPhone,
                from: cfg.twilioPhoneNumber,
                /* eslint-disable max-len */
                body: `Hi, good morning. Today is ${dailyUgBirthday.join(", ")}'s birthday. Just a reminder.`,
                /* eslint-enable max-len */
            };

            // Send the message!
            client.messages.create(options, function(err, response) {
                if (err) {
                    // Just log it for now
                    console.error(err);
                } else {
                    // Log the last few digits of a phone number
                    let masked = ugPhone.substr(0,
                        ugPhone.length - 5);
                    masked += '*****';
                    console.log(`Message sent to ${masked}`);
                };
        });
      };

        // Create options to send the message
        if(dailyPgBirthday.length > 0) {
          const pgPhone = "+18329785135";
          const options = {
              to: pgPhone,
              from: cfg.twilioPhoneNumber,
              /* eslint-disable max-len */
              body: `Hi, good morning. Today is ${dailyPgBirthday.join(", ")}'s birthday. Just a reminder.`,
              /* eslint-enable max-len */
          };

          // Send the message!
          client.messages.create(options, function(err, response) {
              if (err) {
                  // Just log it for now
                  console.error(err);
              } else {
                  // Log the last few digits of a phone number
                  let masked = pgPhone.substr(0,
                      pgPhone.length - 5);
                  masked += '*****';
                  console.log(`Message sent to ${masked}`);
              };
      });
    };

        // Don't wait on success/failure, just indicate all messages have been
        // queued for delivery
        if (callback) {
          callback.call();
        }
    }
};

AppointmentSchema.statics.sendWeekNotifications = function(callback) {
  // now
  const searchDate = moment();
  Appointment
    .find()
    .then(function(appointments) {
        appointments = appointments.filter(function(appointment){
          return appointment.weeklyNotifs(searchDate);
        });
      if (appointments.length > 0) {
        sendWeekNotifications(appointments);
      };
  });

function sendWeekNotifications(appointments) {
  const client = new Twilio(cfg.twilioAccountSid, cfg.twilioAuthToken);
  const weekUgBirthdays = [];
  const weekPgBirthdays = [];
  appointments.forEach(appointment => {
    const person = ` ${appointment.name} - ${moment()._locale._weekdays[moment(appointment.time, 'YYYY-MM-DD').weekday()]}`;
    if (appointment.type === 'undergrad'){
      weekUgBirthdays.push(person);
    } else weekPgBirthdays.push(person);
  });

  if (weekUgBirthdays.length > 0){
    const ugPhone = '+2348160983729';
      // Create options to send the message
      const options = {
          to: ugPhone,
          from: cfg.twilioPhoneNumber,
          /* eslint-disable max-len */
          body: `Hi, good morning. This week's birthdays are: ${weekUgBirthdays.join(", ")}. Just a reminder.`,
          /* eslint-enable max-len */
      };

      // Send the message!
      client.messages.create(options, function(err, response) {
          if (err) {
              // Just log it for now
              console.error(err);
          } else {
              // Log the last few digits of a phone number
              let masked = ugPhone.substr(0,
                  ugPhone.length - 5);
              masked += '*****';
              console.log(`Message sent to ${masked}`);
          }
      });
    };
  if (weekPgBirthdays.length > 0) {
    const pgPhone = "+18329785135";
     // Create options to send the message
     const options = {
      to: pgPhone,
      from: cfg.twilioPhoneNumber,
      /* eslint-disable max-len */
      body: `Hi, good morning. This week's birthdays are: ${weekPgBirthdays.join(", ")}. Just a reminder.`,
      /* eslint-enable max-len */
  };

    // Send the message!
    client.messages.create(options, function(err, response) {
        if (err) {
            // Just log it for now
            console.error(err);
        } else {
            // Log the last few digits of a phone number
            let masked = pgPhone.substr(0,
                pgPhone.length - 5);
            masked += '*****';
            console.log(`Message sent to ${masked}`);
        };
      });
    };
    if (callback) {
      callback.call();
    }
  };
};

const Appointment = mongoose.model('appointment', AppointmentSchema);
module.exports = Appointment;
