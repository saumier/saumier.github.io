

document.addEventListener('DOMContentLoaded', () => {
  display_msg("Contacting server...");

  get_chart_data();
});

function display_msg(msg) {
  document.getElementById('msg').textContent = msg;
}

function setup_timeout() {
  // callback get_chart_data in 10 sec
  setTimeout(function () {
          get_chart_data();
        }, 1000*10);
}

var something = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            // do something
        }
    };
})();


var refresh_data = (function () {
  //check if a fetch is already in progress. If so then don't do another.
  //ONLY call once
  var executed = false;
  return function() {
    if (!executed) {
      executed = true;
      // do something
      const trigger_update_url =  "https://culture-huginn.herokuapp.com/users/1/web_requests/50/callrbc.json"
      fetch(trigger_update_url)
        .then((resp) => resp.json())
        .then(function(data) {
          display_msg("Triggering an update...");
          setup_timeout()
        })
        .catch(function(error) {
          display_msg("Error: " + error)
      });
    } else {
      display_msg("Update in progress.  Waiting for fresh data...");
      setup_timeout()
    }
  };
})();


function render_chart(rmpDates,rmpData)  {
  var chart = c3.generate({
    bindto: '#chart',
    data:
      {
        x: 'x',
        columns: [rmpDates,rmpData]
      },
    axis:
      {x: { type: 'timeseries', tick: {
            format: '%Y-%m-%d %Hh',
            count: 6
      }}}
    });
}

function get_chart_data() {
  let rmpData = [];
  let rmpDates = [];
  const data_url = "https://culture-huginn.herokuapp.com/users/1/web_requests/27/rmp.json";
  console.log("calling server", data_url);
  fetch(data_url)
    .then((resp) => resp.json())
    .then(function(data) {
      rmpData.push(data.title);
      rmpDates.push('x');
      data.items.forEach(function(item) {
        if (item.content != "") {
          rmpData.push(Number(item.content));
          rmpDates.push(Date.parse(item.pubDate));
        }
      });
      console.log("data",rmpData, rmpDates);
      render_chart(rmpDates,rmpData)
      let current_date = new Date()
      let freshLimit = current_date.getTime() - (24 * 60 * 60 * 1000);
      console.log("Fresh if after: " + new Date(freshLimit));

      if (rmpDates[1] < freshLimit) {
        console.log("Calling update trigger since last data is from " + new Date(rmpDates[1]));
        refresh_data();  //refresh if date is older than a day
      } else {
        display_msg(new Date(rmpDates[1]));
      }
    })
    .catch(function(error) {
        console.log("Error", error);
    });
}
