//framework for building a Tableau WDC
//This is for a fairly basic response from an API that provides a GEOJSON response but the principals of consumption apply
(function () {
  //The tableau object isn’t defined in our code, but in the WDC library referenced in the HTML header (It’s assigned to the global scope).
  //The makeConnector function is a constructor that predefines some methods for our connector object.  Create variable for this object.
  var tabConnector = tableau.makeConnector();
  //getSchema contain the logic for getting the table schema of the data.
  //The getSchema function takes a schemaCallback parameter which is defined by the WDC API.
  tabConnector.getSchema = function(schemaCallback) {

    //The cols variable contains an array of JavaScript objects, where each object defines a single column in our table.
    //Note that for each column you can specify additional options.
    //For example, the alias defines a friendly name that can appear in Tableau and the columnRole determines whether a field is a measure or a dimension.
    //The id can only contain alphanumeric values (a-z, A-Z, 0-9) and underscore characters (_).
    //The identifiers cannot contain spaces, hyphens, or special characters. For more options, see the API reference.
    var seasonCols = [
      { id: "season", alias: "F1 Season (S)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "seasonurl", alias: "F1 Season Wiki URL", dataType: tableau.dataTypeEnum.string }
    ];

    var seasonSchema = {
      id: "f1seasons",
      alias: "F1 Seasons",
      columns: seasonCols
    };

    var racescheduleCols = [
      { id: "season", alias: "F1 Season (RS)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "round", alias: "Round (RS)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "raceurl", alias: "Race Wiki URL", dataType: tableau.dataTypeEnum.string },
      { id: "racename", alias: "Race", dataType: tableau.dataTypeEnum.string },
      { id: "racecircuitid", alias: "Race Circuit ID", dataType: tableau.dataTypeEnum.string },
      { id: "racecircuiturl", alias: "Race Circuit Wiki URL", dataType: tableau.dataTypeEnum.string },
      { id: "racecircuitname", alias: "Race Ciruit Name", dataType: tableau.dataTypeEnum.string },
      { id: "racecircuitlatitude", alias: "Race Circuit Latitude", columnRole: tableau.columnRoleEnum.dimension, dataType: tableau.dataTypeEnum.float },
      { id: "racecircuitlongitude", alias: "Race Circuit Longitude", columnRole: tableau.columnRoleEnum.dimension, dataType: tableau.dataTypeEnum.float },
      { id: "racecircuitlocality",  alias: "Race Circuit Locality", dataType: tableau.dataTypeEnum.string },
      { id: "racecircuitcountry", alias: "Race Circuit Country", dataType: tableau.dataTypeEnum.string },
      { id: "racedate", alias: "Race Date", dataType: tableau.dataTypeEnum.date },
      { id: "racestarttime", alias: "Race Start Time", dataType: tableau.dataTypeEnum.string }

    ];

    //The raceSchema variable defines the schema for a the races table and contains a JavaScript object.
    //Here, the value of the  columns property is set to the raceCols array defined earlier.
    var racescheduleSchema = {
        id: "f1seasonraceschedule",
        alias: "F1 Season - Race Schedule",
        columns: racescheduleCols
    };

    //Placeholder for development of qualifying results - cols array
    var racequalifyingCols = [
      { id: "season", alias: "F1 Season (RQ)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "round", alias: "Round (RQ)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "driverid", alias: "Driver ID (RQ)", dataType: tableau.dataTypeEnum.string },
      { id: "qualposition", alias: "Qualifying Position", dataType: tableau.dataTypeEnum.int },
      { id: "qual1fastesttime", alias: "Fastest Q1 Lap Time", dataType: tableau.dataTypeEnum.string },
      { id: "qual2fastesttime", alias: "Fastest Q2 Lap Time", dataType: tableau.dataTypeEnum.string },
      { id: "qual3fastesttime", alias: "Fastest Q3 Lap Time", dataType: tableau.dataTypeEnum.string }
    ];

    //Placeholder for development of qualifying results - schema
    var racequalifyingSchema = {
      id: "f1seasonracequalifying",
      alias: "F1 Season - Race Qualifying",
      columns: racequalifyingCols
    };

    var raceresultCols = [
      { id: "season", alias: "F1 Season (RR)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "round", alias: "Round (RR)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "driverid", alias: "Driver ID (RR)", dataType: tableau.dataTypeEnum.string },
      { id: "constructorid", alias:"Constructor ID (RR)", dataType: tableau.dataTypeEnum.string },
      { id: "driverposition", alias: "Finishing Position", dataType: tableau.dataTypeEnum.int },
      { id: "driverpositiontext", alias: "Finishing Position Text", dataType: tableau.dataTypeEnum.string},
      { id: "championshippoints", alias: "Championship Points", dataType: tableau.dataTypeEnum.float },
      { id: "driverstartinggrid", alias: "Starting Grid Position", dataType: tableau.dataTypeEnum.int },
      { id: "driverlaps", alias: "Laps", dataType: tableau.dataTypeEnum.int },
      { id: "driverstatus", alias: "Finishing Interval", dataType: tableau.dataTypeEnum.string },
      { id: "driverracemillis", alias: "Race Time ms", dataType: tableau.dataTypeEnum.float },
      { id: "driverfastestlaprank", alias: "Fastest Lap Rank", dataType: tableau.dataTypeEnum.int },
      { id: "driverfastestlaplap", alias: "Fastest Lap Lap", dataType: tableau.dataTypeEnum.int },
      { id: "driverfastestlaptime", alias: "Fastest Lap Time", dataType: tableau.dataTypeEnum.string },
      { id: "driverfastestlapavgspeedunits", alias: "Fastest Lap Avg Speed Units", dataType: tableau.dataTypeEnum.string },
      { id: "driverfastestlapavgspeed", alias: "Fastest Lap Avg Speed", dataType: tableau.dataTypeEnum.float }
    ];

    //The resSchema variable defines the schema for a the results table and contains a JavaScript object.
    //Here, the value of the  columns property is set to the resCols array defined earlier.
    var raceresultSchema = {
        id: "f1seasonraceresults",
        alias: "F1 Season - Race Results",
        columns: raceresultCols
    };

    var driverCols = [
      { id: "season", alias: "F1 Season (D)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "driverid", alias: "Driver ID (D)", dataType: tableau.dataTypeEnum.string },
      { id: "driverpermnumber", alias: "Driver Permanent Number", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },      
      { id: "drivercode", alias: "Driver Code", dataType: tableau.dataTypeEnum.string },      
      { id: "driverurl", alias: "Driver Wiki URL", dataType: tableau.dataTypeEnum.string },
      { id: "drivergivenname", alias: "Driver Given Name", dataType: tableau.dataTypeEnum.string },
      { id: "driverfamilyname", alias: "Driver Family Name", dataType: tableau.dataTypeEnum.string },
      { id: "driverdob", alias: "Driver DoB", dataType: tableau.dataTypeEnum.date },
      { id: "drivernationality", alias: "Driver Nationality", dataType: tableau.dataTypeEnum.string },      
    ];

    var driverSchema = {
      id: "f1seasondrivers",
      alias: "F1 Season - Driver Info",
      columns: driverCols
    };

    var driverseasonstandingCols = [
      { id: "season", alias: "F1 Season (DS)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "round", alias: "Round (DS)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "driverid", alias: "Driver ID (DS)", dataType: tableau.dataTypeEnum.string },      
      { id: "driverseasonposition", alias: "Driver Season Position", dataType: tableau.dataTypeEnum.int },
      { id: "driverseasonpositiontext", alias: "Driver Season Position Text", dataType: tableau.dataTypeEnum.string},
      { id: "driverseasonpoints", alias: "Driver Season Points", dataType: tableau.dataTypeEnum.float },
      { id: "driverseasonwins", alias: "Driver Season Wins", dataType: tableau.dataTypeEnum.int },
      { id: "driverseasonnumteams", alias: "Driver Number Teams in Season", dataType: tableau.dataTypeEnum.int }
    ];

    var driverseasonstandingSchema = {
      id: "f1driverseasonstandings",
      alias: "F1 Season - Driver Standings",
      columns: driverseasonstandingCols
    };

    var constructorCols = [
      { id: "season", alias: "F1 Season (C)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "constructorid", alias:"Constructor ID (C)", dataType: tableau.dataTypeEnum.string },
      { id: "constructorurl", alias: "Constructor Wiki URL", dataType: tableau.dataTypeEnum.string },
      { id: "constructorname", alias: "Constructor", dataType: tableau.dataTypeEnum.string },
      { id: "constructornationality", alias: "Constructor Nationality", dataType: tableau.dataTypeEnum.string }
    ];

    var constructorSchema = {
      id: "f1seasonconstructors",
      alias: "F1 Season - Constructor Info",
      columns: constructorCols
    };

    var constructoreasonstandingCols = [
      { id: "season", alias: "F1 Season (CS)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "round", alias: "Round (CS)", columnRole: tableau.columnRoleEnum.dimension, columnType: tableau.columnTypeEnum.discrete, dataType: tableau.dataTypeEnum.int },
      { id: "constructorid", alias:"Constructor ID (CS)", dataType: tableau.dataTypeEnum.string },      
      { id: "constructorseasonposition", alias: "Constructor Season Position", dataType: tableau.dataTypeEnum.int },
      { id: "constructorseasonpositiontext", alias: "Constructor Season Position Text", dataType: tableau.dataTypeEnum.string},
      { id: "constructorseasonpoints", alias: "Constructor Season Points", dataType: tableau.dataTypeEnum.float },
      { id: "constructorseasonwins", alias: "Constructor Season Wins", dataType: tableau.dataTypeEnum.int }
    ];

    var constructoreasonstandingSchema = {
      id: "f1contructorseasonstandings",
      alias: "F1 Season - Constructor Standings",
      columns: constructoreasonstandingCols
    };

    //ProtoURL for getting the qualifying data
    //"http://ergast.com/api/f1/" + yr + "/qualifying.json?limit=1000";
    //Also a potential URL for pitstops
    //"http://ergast.com/api/f1/" + yr + "/" + round + "/pitstops?limit=1000"

    //The schemaCallback gets called when the schema is defined.
    //The schemaCallback takes an array of table objects - the raceSchema and resSchema - and lets Tableau know the tables are ready
    //schemaCallback([seasonSchema, drvseasonstandingsSchema, conseasonstandingsSchema, raceSchema, resSchema, qualSchema]);
    schemaCallback([seasonSchema, racescheduleSchema, racequalifyingSchema, raceresultSchema, driverSchema, driverseasonstandingSchema, constructorSchema, constructoreasonstandingSchema]);

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

    //For every year between the defined start and end years (inclusive), call the getTableDataPromise functions
    //This will push the data into the promises array defined above

    for(s=syr, e=eyr; s <= e; s++) {
      //tableau.log("GET DATA - " + table.tableInfo.id);
      promises.push(getTableDataPromise(table,s));
    }

    //from the data, take
    var promise = Promise.all(promises);

    promise.then(function(response){
        doneCallback();
      }, function(error) {
        tableau.abortWithError(error);
      });
    };

  function getTableDataPromise(table,yr)
  {
    return new Promise(function(resolve, reject){
      var uriString = "http://ergast.com/api/f1/";
      var sqs = uriString + yr + "/seasons.json?limit=1000";
       var diqs = uriString + yr + "/drivers.json?limit=1000";
      var ciqs = uriString + yr + "/constructors.json?limit=1000";
      var rsqs = uriString + yr + ".json?limit=1000";
      var rqqs = uriString + yr + "/qualifying.json?limit=1000";
      var rrqs = uriString + yr + "/results.json?limit=1000";
      var dsqs = uriString + yr + "/driverStandings.json?limit=1000";
      var csqs = uriString + yr + "/constructorStandings.json?limit=1000";
      
      if (table.tableInfo.id == "f1seasons"){
        var dat = $.ajax({
          url: sqs,
          dataType: 'json',
          success: function(data){
            var toRet = [];

            if (data.MRData.SeasonTable.Seasons){
              var seasoncount = 0;
              _.each(data.MRData.SeasonTable.Seasons, function(seasonrec){
                seasonentry = {
                  "season": seasonrec.season,
                  "seasonurl": seasonrec.url
                };//seasonentry

                toRet.push(seasonentry)
                seasoncount++;
              });//_.each
                
              table.appendRows(toRet);
              resolve();

            } else {
              Promise.reject("No season data has been returned");
            }//MRData if
          }, //success
          error: function(dat, ajaxOptions,thrownError){
              Promise.reject("Error retrieving data from the data provider;  " + thrownError);
          }//error
        }); //ajax call
      } else if (table.tableInfo.id == "f1seasondrivers") {
        var dat = $.ajax({
          url: diqs,
          dataType: 'json',
          success: function(data){
            var toRet = [];

            if (data.MRData.DriverTable.Drivers){
              var drivercount = 0;
              var ds = data.MRData.DriverTable.season;

              _.each(data.MRData.DriverTable.Drivers, function(driverrec){
                driverentry = {
                  "season": ds,
                  "driverid": driverrec.driverId,
                  "driverpermnumber": driverrec.permanentNumber,
                  "drivercode": driverrec.code,
                  "driverurl": driverrec.url,
                  "drivergivenname": driverrec.givenName,
                  "driverfamilyname": driverrec.familyName,
                  "driverdob": driverrec.dateOfBirth,
                  "drivernationality": driverrec.nationality
                };//driverentry

                toRet.push(driverentry)
                drivercount++;

              });//_.each driverrec

              table.appendRows(toRet);
              resolve();

            } else {
              Promise.reject("No season data has been returned");
            }//MRData if            
          }, //success
          error: function(dat, ajaxOptions,thrownError){
              Promise.reject("Error retrieving data from the data provider;  " + thrownError);
          }//error
        }); //ajax call
      } else if (table.tableInfo.id == "f1seasonconstructors") {
        var dat = $.ajax({
          url: ciqs,
          dataType: 'json',
          success: function(data){
            var toRet = [];

            if (data.MRData.ConstructorTable.Constructors){
              var cnstrcount = 0;
              var cs = data.MRData.ConstructorTable.season;

              _.each(data.MRData.ConstructorTable.Constructors, function(constructorrec){
                constructorentry = {
                  "season": cs,
                  "constructorid": constructorrec.constructorId,
                  "constructorurl": constructorrec.url,
                  "constructorname": constructorrec.name,
                  "constructornationality": constructorrec.nationality
                };//constructorentry

                toRet.push(constructorentry)
                cnstrcount++;

              });//_.each constructorrec

              table.appendRows(toRet);
              resolve();

            } else {
              Promise.reject("No season data has been returned");
            }//MRData if            
          }, //success
          error: function(dat, ajaxOptions,thrownError){
              Promise.reject("Error retrieving data from the data provider;  " + thrownError);
          }//error
        }); //ajax call
      } else if (table.tableInfo.id == "f1seasonraceschedule") {
        var dat = $.ajax({
          url: rsqs,
          dataType: 'json',
          success: function(data){
            var toRet =  [];

            if (data.MRData.RaceTable.Races) {
                var raceschedcount = 0;                

                _.each(data.MRData.RaceTable.Races, function(raceschedrec) {
                  raceschedentry = {
                        "season": raceschedrec.season,
                        "round": raceschedrec.round,
                        "raceurl": raceschedrec.url,
                        "racename": raceschedrec.raceName,
                        "racecircuitid": raceschedrec.Circuit.circuitId,
                        "racecircuiturl": raceschedrec.Circuit.url,
                        "racecircuitname": raceschedrec.Circuit.circuitName,
                        "racecircuitlatitude": raceschedrec.Circuit.Location.lat,
                        "racecircuitlongitude": raceschedrec.Circuit.Location.long,
                        "racecircuitlocality": raceschedrec.Circuit.Location.locality,
                        "racecircuitcountry": raceschedrec.Circuit.Location.country,
                        "racedate": raceschedrec.date,
                        "racestarttime": raceschedrec.time
                    };//raceschedentry

                    toRet.push(raceschedentry)
                    raceschedcount++;

                });//each raceschedrec

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
      } else if (table.tableInfo.id == "f1seasonracequalifying") {
        var dat = $.ajax({
          url: rqqs,
          dataType: 'json',
          success: function(data){
            var toRet =  [];

            if (data.MRData.RaceTable.Races) {
              var qualcount = 0;
              _.each(data.MRData.RaceTable.Races, function(qualracerec) {
                _.each(data.MRData.RaceTable.Races[qualcount].QualifyingResults, function(qualdet){

                  var q1, q2, q3;

                  if ( "Q1" in qualdet ){ q1 = qualdet.Q1 }
                  if ( "Q2" in qualdet ){ q2 = qualdet.Q2 }
                  if ( "Q3" in qualdet ){ q3 = qualdet.Q3 }

                  qualentry = {
                    "season": qualracerec.season,
                    "round": qualracerec.round,
                    "driverid": qualdet.Driver.driverId,
                    "qualposition": qualdet.position,
                    "qual1fastesttime": q1,
                    "qual2fastesttime": q2,
                    "qual3fastesttime": q3
                  };//qualentry

                  toRet.push(qualentry)

                });//qualdet

                qualcount++;

              });//each qualracerec

              table.appendRows(toRet);
              resolve();

            }            
          }, //success
          error: function(dat, ajaxOptions,thrownError){
              Promise.reject("Error retrieving data from the data provider;  " + thrownError);
          }//error
        }); //ajax call
      } else if (table.tableInfo.id == "f1seasonraceresults") {
        var dat = $.ajax({
          url: rrqs,
          dataType: 'json',
          success: function(data){
            var toRet =  [];

            if (data.MRData.RaceTable.Races) {
                var racecount = 0;
                _.each(data.MRData.RaceTable.Races, function(racerecord) {
                    _.each(data.MRData.RaceTable.Races[racecount].Results, function(resultsrecord){

                        var rtms, flr, fll, flt, flasu, flass;

                        if ( "Time" in resultsrecord ){ rtms = resultsrecord.Time.millis }
                        if ( "FastestLap" in resultsrecord ) {
                          flr = resultsrecord.FastestLap.rank;
                          fll = resultsrecord.FastestLap.lap;
                          flt = resultsrecord.FastestLap.Time.time;
                          flasu = resultsrecord.FastestLap.AverageSpeed.units;
                          flass = resultsrecord.FastestLap.AverageSpeed.speed;
                         }

                        resultentry = {
                          "season": racerecord.season,
                          "round": racerecord.round,
                          "driverid": resultsrecord.Driver.driverId,
                          "constructorid": resultsrecord.Constructor.constructorId,
                          "driverposition": resultsrecord.position,
                          "driverpositiontext": resultsrecord.positionText,
                          "championshippoints": resultsrecord.points,
                          "driverstartinggrid": resultsrecord.grid,
                          "driverlaps": resultsrecord.laps,
                          "driverstatus": resultsrecord.status,
                          "driverracemillis": rtms,
                          "driverfastestlaprank": flr,
                          "driverfastestlaplap": fll,
                          "driverfastestlaptime": flt,
                          "driverfastestlapavgspeedunits": flasu,
                          "driverfastestlapavgspeed": flass               
                        };//resultentry

                        toRet.push(resultentry)

                      });//res each
                      //push the results of the variable into the array
                      racecount++;
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
      } else if (table.tableInfo.id == "f1driverseasonstandings") {
        var dat = $.ajax({
          url: dsqs,
          dataType: 'json',
          success: function(data){
            var toRet =  [];

            if (data.MRData.StandingsTable.StandingsLists) {
                var drvstdcount = 0;                
                var dss = data.MRData.StandingsTable.StandingsLists[0].season;
                var dsr = data.MRData.StandingsTable.StandingsLists[0].round;

                _.each(data.MRData.StandingsTable.StandingsLists[0].DriverStandings, function(driverstandingrec) {
                    driverstandingentry = {
                        "season": dss,
                        "round": dsr,
                        "driverid": driverstandingrec.Driver.driverId,
                        "driverseasonposition": driverstandingrec.position,
                        "driverseasonpositiontext": driverstandingrec.positionText,
                        "driverseasonpoints": driverstandingrec.points,
                        "driverseasonwins": driverstandingrec.wins,
                        "driverseasonnumteams": driverstandingrec.Constructors.length
                    };//driverstandingentry

                    toRet.push(driverstandingentry)
                    drvstdcount++;

                });//driverstandingrec_EACH

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
      } else if (table.tableInfo.id == "f1contructorseasonstandings") {
        var dat = $.ajax({
          url: csqs,
          dataType: 'json',
          success: function(data){
            var toRet =  [];

            if (data.MRData.StandingsTable.StandingsLists.length > 0) {
              if (data.MRData.StandingsTable.StandingsLists) {
                var constdcount = 0;                
                var css = data.MRData.StandingsTable.StandingsLists[0].season;
                var csr = data.MRData.StandingsTable.StandingsLists[0].round;

                _.each(data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings, function(constructorstandingrec) {
                    constructorstandingentry = {
                        "season": css,
                        "round": csr,
                        "constructorid": constructorstandingrec.Constructor.constructorId,
                        "constructorseasonposition": constructorstandingrec.position,
                        "constructorseasonpositiontext": constructorstandingrec.positionText,
                        "constructorseasonpoints": constructorstandingrec.points,
                        "constructorseasonwins": constructorstandingrec.wins
                    };//constructorstandingentry

                    toRet.push(constructorstandingentry)
                    constdcount++;

                });//constructorstandingrec_EACH

                table.appendRows(toRet);
                resolve();
              } else {
                  Promise.reject("No data has been returned for the season " + yr);
              }//if...else`                          
            } else {
              resolve();
            }
          }, //success
          error: function(dat, ajaxOptions,thrownError){
              Promise.reject("Error retrieving data from the data provider;  " + thrownError);
          }//error
        }); //ajax call
      }
    }); //return new Promise
  }; //getTableDataPromise

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