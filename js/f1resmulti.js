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
        { id: "season", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "round", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "raceName", dataType: tableau.dataTypeEnum.string },
        { id: "circuitName", alias: "Ciruit Name", dataType: tableau.dataTypeEnum.string },
        { id: "lat", alias: "Circuit Latitude", columnRole: tableau.columnRoleEnum.dimension, dataType: tableau.dataTypeEnum.float },
        { id: "lon", alias: "Circuit Longitude", columnRole: tableau.columnRoleEnum.dimension, dataType: tableau.dataTypeEnum.float },
        { id: "country", dataType: tableau.dataTypeEnum.string },
        { id: "locality", dataType: tableau.dataTypeEnum.string },
        { id: "url", alias: "Circuit Wiki URL", dataType: tableau.dataTypeEnum.string },
        { id: "date", dataType: tableau.dataTypeEnum.date }
      ];

      //The raceSchema variable defines the schema for a the races table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the raceCols array defined earlier.
      var raceSchema = {
          id: "f1races",
          alias: "Formula 1 Season Races",
          columns: raceCols
      };

      var resCols = [
        { id: "season", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "round", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "number", alias: "Driver Number", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
        { id: "points", alias: "Championship Points", dataType: tableau.dataTypeEnum.int },
        { id: "grid", alias: "Grid Position", dataType: tableau.dataTypeEnum.int },
        { id: "position", alias: "Finishing Position", dataType: tableau.dataTypeEnum.int },
        { id: "laps", alias: "Laps", dataType: tableau.dataTypeEnum.int },
        { id: "status", alias: "Finishing Interval", dataType: tableau.dataTypeEnum.string },
        { id: "givenName", dataType: tableau.dataTypeEnum.string },
        { id: "familyName", dataType: tableau.dataTypeEnum.string },
        { id: "code", alias: "Driver Code", dataType: tableau.dataTypeEnum.string },
        { id: "dateOfBirth", alias: "Driver DoB", dataType: tableau.dataTypeEnum.date },
        { id: "nationality", alias: "Driver Nationality", dataType: tableau.dataTypeEnum.string },
        { id: "url", alias: "Driver URL", dataType: tableau.dataTypeEnum.string },
        { id: "consname", alias: "Constructor", dataType: tableau.dataTypeEnum.string },
        { id: "consnat", alias: "Constructor Nationality", dataType: tableau.dataTypeEnum.string },
        { id: "consurl", alias: "Constructor Wiki URL", dataType: tableau.dataTypeEnum.string }
      ];

      //The resSchema variable defines the schema for a the results table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the resCols array defined earlier.
      var resSchema = {
          id: "f1results",
          alias: "Formula 1 Season Results",
          columns: resCols
      };

      //Placeholder for development of qualifying results - cols array
      var qualCols = [];

      //Placeholder for development of qualifying results - schema
      var qualSchema = {};

      //ProtoURL for getting the qualifying data
      //"http://ergast.com/api/f1/" + yr + "/qualifying.json?limit=1000";
      //Also a potential URL for pitstops
      //"http://ergast.com/api/f1/" + yr + "/" + round + "/pitstops?limit=1000"
      
      //The schemaCallback gets called when the schema is defined.
      //The schemaCallback takes an array of table objects - the raceSchema and resSchema - and lets Tableau know the tables are ready
      schemaCallback([raceSchema, resSchema]);

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
        var dat = $.ajax({
            url: qs,
            dataType: 'json',
            success: function(data) {
              var toRet =  [];

  /*            if (table.tableInfo.id == "f1results") {
                tableau.log("RES");
                resolve();
                Promise.reject("EXIT");
              }*/

              if (data.MRData.RaceTable.Races) {
                  var i = 0;
                  _.each(data.MRData.RaceTable.Races, function(racerecord) {
                      raceentry = {
                          "season": racerecord.season,
                          "round": racerecord.round,
                          "raceName": racerecord.raceName,
                          "circuitName": racerecord.Circuit.circuitName,
                          "lat": racerecord.Circuit.Location.lat,
                          "lon": racerecord.Circuit.Location.long,
                          "country": racerecord.Circuit.Location.country,
                          "locality": racerecord.Circuit.Location.locality,
                          "url": racerecord.Circuit.url,
                          "date": racerecord.date
                      };//entry

                      if (table.tableInfo.id =="f1races"){
                        //tableau.log(i + " - RAC " + racerecord.raceName + " - " + racerecord.season + " - " + racerecord.round);
                        toRet.push(raceentry)
                      }

                      if (table.tableInfo.id =="f1results"){

                        _.each(data.MRData.RaceTable.Races[i].Results, function(resultsrecord){
                          resultentry = {
                            "season": racerecord.season,
                            "round": racerecord.round,
                            "number": resultsrecord.number,
                            "points": resultsrecord.points,
                            "grid": resultsrecord.grid,
                            "position": resultsrecord.position,
                            "laps": resultsrecord.laps,
                            "status": resultsrecord.status,
                            "givenName": resultsrecord.Driver.givenName,
                            "familyName": resultsrecord.Driver.familyName,
                            "code": resultsrecord.Driver.code,
                            "dateOfBirth": resultsrecord.Driver.dateOfBirth,
                            "nationality": resultsrecord.Driver.nationality,
                            "url": resultsrecord.Driver.url,
                            "consname": resultsrecord.Constructor.name,
                            "consnat": resultsrecord.Constructor.nationality,
                            "consurl": resultsrecord.Constructor.url
                          };//res entry

                          toRet.push(resultentry)

                        });//res each
                      }
                        //push the results of the variable into the array
                      i++;
                  });//rac_each

                  table.appendRows(toRet);
                  resolve();

                } else {
                    Promise.reject("NO DATA FOR SEASON " + yr);
                }//if...else`
            }, //success

            error: function(dat, ajaxOptions,thrownError){
                Promise.reject("ERROR CONN TO DS " + thrownError);
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
