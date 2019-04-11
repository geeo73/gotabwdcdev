//framework for building a Tableau WDC
//This is for a fairly basic response from an API that provides a GEOJSON response but the principals of consumption apply
(function () {
    //The tableau object isn’t defined in our code, but in the WDC library referenced in the HTML header (It’s assigned to the global scope).
    //The makeConnector function is a constructor that predefines some methods for our connector object.  Create variable for this object.
    var tabConnector = tableau.makeConnector();
    var uriString = "http://ergast.com/api/f1/"
    //getSchema contain the logic for getting the table schema of the data.
    //The getSchema function takes a schemaCallback parameter which is defined by the WDC API.
    tabConnector.getSchema = function(schemaCallback) {

      //The cols variable contains an array of JavaScript objects, where each object defines a single column in our table.
      //Note that for each column you can specify additional options.
      //For example, the alias defines a friendly name that can appear in Tableau and the columnRole determines whether a field is a measure or a dimension.
      //The id can only contain alphanumeric values (a-z, A-Z, 0-9) and underscore characters (_).
      //The identifiers cannot contain spaces, hyphens, or special characters. For more options, see the API reference.
      var raceCols = [
        { id: "season", alias: "F1 Season", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "round", alias: "Round", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "racename", alias: "Race", dataType: tableau.dataTypeEnum.string },
        { id: "raceurl", alias: "Race Wiki URL", dataType: tableau.dataTypeEnum.string },
        { id: "racedate", alias: "Race Date", dataType: tableau.dataTypeEnum.date },
        { id: "racestarttime", alias: "Race Start Time", dataType: tableau.dataTypeEnum.string },
        { id: "circuitid", alias: "Circuit ID", dataType: tableau.dataTypeEnum.string },
        { id: "circuitname", alias: "Ciruit Name", dataType: tableau.dataTypeEnum.string },
        { id: "lat", alias: "Circuit Latitude", columnRole: tableau.columnRoleEnum.dimension, dataType: tableau.dataTypeEnum.float },
        { id: "lon", alias: "Circuit Longitude", columnRole: tableau.columnRoleEnum.dimension, dataType: tableau.dataTypeEnum.float },
        { id: "country", alias: "Circuit Country", dataType: tableau.dataTypeEnum.string },
        { id: "locality",  alias: "Circuit Locality", dataType: tableau.dataTypeEnum.string },
        { id: "url", alias: "Circuit Wiki URL", dataType: tableau.dataTypeEnum.string }
      ];

      //The raceSchema variable defines the schema for a the races table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the raceCols array defined earlier.
      var raceSchema = {
          id: "f1races",
          alias: "Formula 1 Season Race Information",
          columns: raceCols
      };

      var resCols = [
        { id: "season", alias: "F1 Season (R)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "round", alias: "Round (R)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "driverid", alias: "Driver ID", dataType: tableau.dataTypeEnum.string },
        { id: "number", alias: "Driver Number", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "code", alias: "Driver Code", dataType: tableau.dataTypeEnum.string },
        { id: "url", alias: "Driver Wiki URL", dataType: tableau.dataTypeEnum.string },
        { id: "givenname", alias: "Driver Given Name", dataType: tableau.dataTypeEnum.string },
        { id: "familyname", alias: "Driver Family Name", dataType: tableau.dataTypeEnum.string },
        { id: "dob", alias: "Driver DoB", dataType: tableau.dataTypeEnum.date },
        { id: "nationality", alias: "Driver Nationality", dataType: tableau.dataTypeEnum.string },
        { id: "position", alias: "Finishing Position", dataType: tableau.dataTypeEnum.int },
        { id: "positiontext", alias: "Finishing Position Text", dataType: tableau.dataTypeEnum.string},
        { id: "points", alias: "Championship Points", dataType: tableau.dataTypeEnum.int },
        { id: "grid", alias: "Starting Grid Position", dataType: tableau.dataTypeEnum.int },
        { id: "laps", alias: "Laps", dataType: tableau.dataTypeEnum.int },
        { id: "status", alias: "Finishing Interval", dataType: tableau.dataTypeEnum.string },
        { id: "millis", alias: "Race Time ms", dataType: tableau.dataTypeEnum.float },
        { id: "fastestlaprank", alias: "Fastest Lap Rank", dataType: tableau.dataTypeEnum.int },
        { id: "fastestlaplap", alias: "Fastest Lap Lap", dataType: tableau.dataTypeEnum.int },
        { id: "fastestlaptime", alias: "Fastest Lap Time", dataType: tableau.dataTypeEnum.string },
        { id: "avgspeedunits", alias: "Race Avg Speed Units", dataType: tableau.dataTypeEnum.string },
        { id: "avgspeed", alias: "Race Avg Speed", dataType: tableau.dataTypeEnum.float },        
        { id: "constructorid", alias:"Constructor ID", dataType: tableau.dataTypeEnum.string },
        { id: "constructorname", alias: "Constructor", dataType: tableau.dataTypeEnum.string },
        { id: "constructornat", alias: "Constructor Nationality", dataType: tableau.dataTypeEnum.string },
        { id: "constructorurl", alias: "Constructor Wiki URL", dataType: tableau.dataTypeEnum.string }
      ];

      //The resSchema variable defines the schema for a the results table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the resCols array defined earlier.
      var resSchema = {
          id: "f1results",
          alias: "Formula 1 Season Race Results",
          columns: resCols
      };

      //Placeholder for development of qualifying results - cols array
      var qualCols = [
        { id: "season", alias: "F1 Season (Q)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "round", alias: "Round (Q)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "driverid", alias: "Driver ID (Q)", dataType: tableau.dataTypeEnum.string },
        { id: "position", alias: "Qualifying Position", dataType: tableau.dataTypeEnum.int },
        { id: "q1time", alias: "Fastest Q1 Lap Time", dataType: tableau.dataTypeEnum.string },
        { id: "q2time", alias: "Fastest Q2 Lap Time", dataType: tableau.dataTypeEnum.string },
        { id: "q3time", alias: "Fastest Q3 Lap Time", dataType: tableau.dataTypeEnum.string }
      ];

      //Placeholder for development of qualifying results - schema
      var qualSchema = {
        joinOnly: true,
        id: "f1qual",
        alias: "Formula 1 Season Race Qualifying",
        columns: qualCols,
        foreignKey: {
          "tableId": "f1results",
          "columnId": "driverid"
        },
        foreignKey: {
          "tableId": "f1results",
          "columnId": "round"
        },
        foreignKey: {
          "tableId": "f1results",
          "columnId": "season"
        }
      };

      //ProtoURL for getting the qualifying data
      //"http://ergast.com/api/f1/" + yr + "/qualifying.json?limit=1000";
      //Also a potential URL for pitstops
      //"http://ergast.com/api/f1/" + yr + "/" + round + "/pitstops?limit=1000"

      //The schemaCallback gets called when the schema is defined.
      //The schemaCallback takes an array of table objects - the raceSchema and resSchema - and lets Tableau know the tables are ready
      schemaCallback([raceSchema, resSchema, qualSchema]);

    };

    //getData functions contain the logic for getting the data.
    //The getData function takes two parameters: table and doneCallback.

    tabConnector.getData = function (table, doneCallback) {
      //The jQuery $.getJSON function gets data from the GEOJSON feed and uses a success handler to store the returned data in a response parameter (resp).
      //(You can open the URL in a browser to see what the JSON data looks like.)
      //Below is an example:
      //$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
      //var s = tableau.connectionData;
      // sObj takes in the object created using the JSON.stringify function and parses it into referencable object
      var sobj = JSON.parse(tableau.connectionData)
      var syr = sobj.startSeason;
      var eyr = sobj.endSeason;

      var promises = [];

      //For every year between the defined start and end years (inclusive), call the getResultsPromise functions
      //This will push the data into the promises array defined above
      for(s=syr, e=eyr; s <= e; s++) {
        //tableau.log("GET DATA - " + table.tableInfo.id);
        promises.push(getResultsPromise(table,s));
      }

      //from the data, take
      var promise = Promise.all(promises);

      promise.then(function(response){
          doneCallback();
        }, function(error) {
          tableau.abortWithError(error);
        });
      };

    function getResultsPromise(table, yr){
      return new Promise(function(resolve, reject) {
        var qs = "http://ergast.com/api/f1/" + yr + "/results.json?limit=1000";
        var qs2 = "http://ergast.com/api/f1/" + yr + "/qualifying.json?limit=1000";

        if (table.tableInfo.id =="f1qual") {
            var dat = $.ajax({
              url: qs2,
              dataType: 'json',
              success: function(data){
                var toRet =  [];

                if (data.MRData.RaceTable.Races) {
                  var x = 0;
                  _.each(data.MRData.RaceTable.Races, function(qualracerec) {
                    _.each(data.MRData.RaceTable.Races[x].QualifyingResults, function(qualdet){

                      var q1, q2, q3;

                      if ( "Q1" in qualdet ){ q1 = qualdet.Q1 }
                      if ( "Q2" in qualdet ){ q2 = qualdet.Q2 }
                      if ( "Q3" in qualdet ){ q3 = qualdet.Q3 }

                      qualentry = {
                        "season": qualracerec.season,
                        "round": qualracerec.round,
                        "driverid": qualdet.Driver.driverId,
                        "position": qualdet.position,
                        "q1time": q1,
                        "q2time": q2,
                        "q3time": q3
                      };//qualentry
                      toRet.push(qualentry)

                    });//qualdet
                    x++;
                  });//each qualracerec

                  table.appendRows(toRet);
                  resolve();

                }
              }, //success
              error: function(dat, ajaxOptions,thrownError){
                  Promise.reject("Error retrieving data from the data provider;  " + thrownError);
              }//error
            });
        }

        var dat = $.ajax({
            url: qs,
            dataType: 'json',
            success: function(data) {
              var toRet =  [];

              if (data.MRData.RaceTable.Races) {
                  var i = 0;
                  _.each(data.MRData.RaceTable.Races, function(racerecord) {
                      raceentry = {
                          "season": racerecord.season,
                          "round": racerecord.round,
                          "racename": racerecord.raceName,
                          "raceurl": racerecord.url,
                          "racedate": racerecord.date,
                          "racestarttime": racerecord.time,
                          "circuitid": racerecord.Circuit.circuitId,
                          "circuitname": racerecord.Circuit.circuitName,
                          "lat": racerecord.Circuit.Location.lat,
                          "lon": racerecord.Circuit.Location.long,
                          "country": racerecord.Circuit.Location.country,
                          "locality": racerecord.Circuit.Location.locality,
                          "url": racerecord.Circuit.url
                      };//raceentry

                      if (table.tableInfo.id =="f1races"){
                        //tableau.log(i + " - RAC " + racerecord.raceName + " - " + racerecord.season + " - " + racerecord.round);
                        toRet.push(raceentry)
                      }

                      if (table.tableInfo.id =="f1results"){

                        _.each(data.MRData.RaceTable.Races[i].Results, function(resultsrecord){

                          var rtms, flr, fll, flt, asp, ass;

                          if ( "Time" in resultsrecord ){ rtms = resultsrecord.Time.millis }
                          if ( "FastestLap" in resultsrecord ) {
                            flr = resultsrecord.FastestLap.rank;
                            fll = resultsrecord.FastestLap.lap;
                            flt = resultsrecord.FastestLap.Time.time;
                           }
                          if ( "AverageSpeed" in resultsrecord ) {
                            asp = resultsrecord.AverageSpeed.units;
                            ass = resultsrecord.AverageSpeed.speed;
                          }

                          resultentry = {
                            "season": racerecord.season,
                            "round": racerecord.round,
                            "driverid": resultsrecord.Driver.driverId,
                            "number": resultsrecord.number,
                            "code": resultsrecord.Driver.code,
                            "url": resultsrecord.Driver.url,
                            "givenname": resultsrecord.Driver.givenName,
                            "familyname": resultsrecord.Driver.familyName,
                            "dob": resultsrecord.Driver.dateOfBirth,
                            "nationality": resultsrecord.Driver.nationality,
                            "position": resultsrecord.position,
                            "position": resultsrecord.positionText,
                            "points": resultsrecord.points,
                            "grid": resultsrecord.grid,
                            "laps": resultsrecord.laps,
                            "status": resultsrecord.status,
                            "millis": rtms,
                            "fastestlaplap": flr,
                            "fastestlaplap": fll,
                            "fastestlaptime": flt,
                            "avgspeedunits": asp,
                            "avgspeedspeed": asp,
                            "constructorid": resultsrecord.Constructor.constructorId,
                            "constructorname": resultsrecord.Constructor.name,
                            "constructornat": resultsrecord.Constructor.nationality,
                            "constructorurl": resultsrecord.Constructor.url
                          };//resultentry

                          toRet.push(resultentry)

                        });//res each
                      }
                        //push the results of the variable into the array
                      i++;
                  });//rac_each

                  table.appendRows(toRet);
                  resolve();

                } else {
                    Promise.reject("No data has been returned for the season " + yr);
                }//if...else`
            }, //success

            error: function(dat, ajaxOptions,thrownError){
                Promise.reject("Error retrieving data from the data provider;  " + thrownError);
            }//error
        }); //ajax call
      }); //return new Promise
    }; //getResultsPromise

    //The registerConnector function validates the connector object before initialization.
    tableau.registerConnector(tabConnector);

    //The jQuery $(document).ready function runs some code when the page loads.
    //An click event listener (("#submitButton").click) is added to the button element created earlier. The button is identified by the submitButton id.
    $(document).ready(function () {
      $("#submitButton").click(function () {
        //The tableau.connectionName variable defines what we want to call the connector data source when it is displayed in Tableau.
        tableau.connectionName = "F1 Races and Results";

        var seasonObj = {
          startSeason: document.getElementById("resstartyear").value,
          endSeason: document.getElementById("resendyear").value
        };

        //If you want to pass in a parameter, you need to populate the tableau.connectionData object, usually from an input or form item; example below:
        //tableau.connectionData = document.getElementById("numpages").value; // set the value for num_pages
        tableau.connectionData =  JSON.stringify(seasonObj);// set the value for num_pages
        //The tableau.submit() function sends the connector object to Tableau for validation.
        tableau.submit();
      });
    });

})();
