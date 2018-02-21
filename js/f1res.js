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

      //The tableSchema variable defines the schema for a single table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the cols array defined earlier.
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

      //The tableSchema variable defines the schema for a single table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the cols array defined earlier.
      var resSchema = {
          id: "f1results",
          alias: "Formula 1 Season Results",
          columns: resCols
      };

      //The schemaCallback gets called when the schema is defined.
      //The schemaCallback takes an array of table objects. In this case, there is only table object (the tableSchema object defined above).
      schemaCallback([raceSchema, resSchema]);

    };

    //getData functions contain the logic for getting the data.
    //The getData function takes two parameters: table and doneCallback.

    tabConnector.getData = function (table, doneCallback) {
      //The jQuery $.getJSON function gets data from the GEOJSON feed and uses a success handler to store the returned data in a response parameter (resp).
      //(You can open the URL in a browser to see what the JSON data looks like.)
      //Below is an example:
      //$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
      var s = tableau.connectionData;
      var qs = "http://ergast.com/api/f1/" + s + "/results.json?limit=1000";

      $.getJSON(qs, function(jsondata) {
        var races = jsondata.MRData.RaceTable.Races, tableData = [];

        //The for loop iterates over the features in the JSON object and stores the data that we want in the tableData array
        for (var i = 0, len = races.length; i < len; i++) {
          if (table.tableInfo.id == "f1races") {
		          tableData.push({
                "season": races[i].season,
                "round": races[i].round,
                "raceName": races[i].raceName,
                "circuitName": races[i].Circuit.circuitName,
                "lat": races[i].Circuit.Location.lat,
                "lon": races[i].Circuit.Location.long,
                "country": races[i].Circuit.Location.country,
                "locality": races[i].Circuit.Location.locality,
                "url": races[i].Circuit.url,
                "date": races[i].date
              });
          }

          if (table.tableInfo.id == "f1results") {
		          var results = races[i].Results;

              for (var j = 0, jlen = results.length; j < jlen; j++){
                tableData.push({
                  "season": races[i].season,
                  "round": races[i].round,
                  "number": results[j].number,
                  "points": results[j].points,
                  "grid": results[j].grid,
                  "position": results[j].grid,
                  "laps": results[j].laps,
                  "status": results[j].status,
                  "givenName": results[j].Driver.givenName,
                  "familyName": results[j].Driver.familyName,
                  "code": results[j].Driver.code,
                  "dateOfBirth": results[j].Driver.dateOfBirth,
                  "nationality": results[j].Driver.nationality,
                  "url": results[j].Driver.url,
                  "consname": results[j].Constructor.name,
                  "consnat": results[j].Constructor.nationality,
                  "consurl": results[j].Constructor.url
                });
              }
          }
        }

        table.appendRows(tableData);
        doneCallback();

        });
    };

    //The registerConnector function validates the connector object before initialization.
    tableau.registerConnector(tabConnector);

    //The jQuery $(document).ready function runs some code when the page loads.
    //An click event listener (("#submitButton").click) is added to the button element created earlier. The button is identified by the submitButton id.
    $(document).ready(function () {
      $("#submitButton").click(function () {
        //The tableau.connectionName variable defines what we want to call the connector data source when it is displayed in Tableau.
        tableau.connectionName = "F1 Races and Results";
        //If you want to pass in a parameter, you need to populate the tableau.connectionData object, usually from an input or form item; example below:
        //tableau.connectionData = document.getElementById("numpages").value; // set the value for num_pages
        tableau.connectionData =  document.getElementById("resyear").value; // set the value for num_pages
        //The tableau.submit() function sends the connector object to Tableau for validation.
        tableau.submit();
      });
    });

})();
