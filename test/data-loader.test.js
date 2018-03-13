const test = require('tape'); // assign the tape library to the variable "test"
const question = require('../js/simple.js');


test('should delay', function (t) {
  t.true(question());
  t.end();
});
