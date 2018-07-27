const person = require('./person.js'); // used for hometask 1
// const person = require('person'); // used for hometask 2

person.setName('Petya');
person.sayHello(); // здесь в консоль должно вывестись Hello, I'm Petya
console.log(person.name); // здесь должно быть undefined