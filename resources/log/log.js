const fs = require('fs');
const path = require('path');

function log(message) {
  const date = new Date();
  // get today date in format YYYY-MM-DD
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const today = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  
  // add today date to log file name
  const logFile = path.join(__dirname, 'log_' + today + '.txt');

  // extract the hour and minutes from the date object
  const hour = date.getHours();
  const minutes = date.getMinutes();
  
  // convert the hour to 12-hour format and determine whether it is AM or PM
  const hourIn12HourFormat = hour % 12 || 12; // convert hour to 12-hour format
  const amOrPm = hour >= 12 ? 'PM' : 'AM'; // determine whether it is AM or PM
  
  // format the date string
  const dateString = `${date.toDateString()} ${hourIn12HourFormat}:${minutes.toString().padStart(2, '0')} ${amOrPm}`;
  
  const logMessage = `${dateString} - ${message}\n`;
  
  fs.writeFile(logFile, logMessage, { flag: 'a' }, (err) => {
    if (err) throw err;
    console.log(`Logged: ${message}`);
  });
}

module.exports = log;