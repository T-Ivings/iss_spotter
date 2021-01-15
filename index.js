const { nextISSTimesForMyLocation } = require('./iss');


nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  for (const pass of passTimes) { //cycle through the array passTimes into passes
    const datetime = new Date(0); //how to write a date?
    datetime.setUTCSeconds(pass.risetime); //cool function to turn things into a date? need to look at docs

    console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`);
  }
});
