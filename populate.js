const axios = require('axios');

const array = [
  'Apple',
  'Banana',
  'Cranberry',
  'Dryer',
  'Elephant',
  'Founder',
  'Grayhound',
  'History',
  'Ice Cream',
  'Jealousy'
];

const array2 = [
  'Angry',
  'Bozo',
  'Caster',
  'Detox',
  'Engager',
  'Fraction',
  'Gallop',
  'Hazing',
  'Imagination',
  'Joker'
];

const array3 = [
  'Amazing',
  'Bravery',
  'Catastrophe',
  'Dangerous',
  'Enormous',
  'Fallacy',
  'Green',
  'Hearsay',
  'Island',
  'Jumper'
];

const array4 = [
  'Around',
  'Basketball',
  'Crunchy',
  'Deafen',
  'Earthy',
  'Freedom',
  'Geared',
  'Humpty',
  'Illenium',
  'Janitor'
];

const test = [
  'Test2'
];

array2.map((element) => {
  axios.post('http://localhost:8080/api/Auth/register', {
    firstName: `${element}`,
    lastName: 'Roll',
    password: 'Sce123',
    email: `${element}@s.s`,
    emailVerified: true,
    accessLevel: 2,
  })
    .then(function(response) {
      console.log(response);
    })
    .catch(function(error) {
      console.log(error);
    });
});

