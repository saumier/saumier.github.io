let something = (function() {
    var executed = false;
    module.exports =  function() {
        if (!executed) {
            executed = true;
            return 1
        } else {
          return 2
        }
    };
})();
