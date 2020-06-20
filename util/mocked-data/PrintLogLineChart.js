import { logPrintRequest } from '../../src/APIFunctions/2DPrinting.js';

function getRandomTime(avgHour) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random(); // Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0)
    return getRandomTime(avgHour); // resample between 0 and 1

  let addOrSub = Math.random();
  if (addOrSub < 0.5) {
    return Math.round(((num * addOrSub * 10) + avgHour) * 3600000);
  }
  return Math.round((avgHour - (num * addOrSub * 10)) * 3600000);
}

function main() {
  // Avg of 10 am
  for (let i = 0; i < 1000; i++) {
    let data = {
      numPages: 2,
      chosenPrinter: 'HP-LaserJet-p2015dn',
      printedDate: new Date().setTime(getRandomTime(10)),
      memberName: 'Bob'
    };
    logPrintRequest(data);
  }

  // Avg of 3pm
  for (let i = 0; i < 1000; i++) {
    let data = {
      numPages: 2,
      chosenPrinter: 'HP-LaserJet-p2015dn',
      printedDate: new Date().setTime(getRandomTime(15)),
      memberName: 'Bob'
    };
    logPrintRequest(data);
  }

  // Random data
  for (let i = 0; i < 3000; i++) {
    let data = {
      numPages: 2,
      chosenPrinter: 'HP-LaserJet-p2015dn',
      printedDate: new Date().setTime((Math.random() * (22 - 8) + 8) * 3600000),
      memberName: 'Bob'
    };
    logPrintRequest(data);
  }
}

main();
