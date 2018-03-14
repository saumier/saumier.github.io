const test = require('tape'); // assign the tape library to the variable "test"
const something = require('../js/something.js');


test('should return 1 on first time, then 2 for every subsequent call', function (t) {
  t.equal(1,something());
  t.equal(2,something());
  t.equal(2,something());
  t.end();
});
