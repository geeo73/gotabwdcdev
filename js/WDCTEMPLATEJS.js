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
      var cols = [
        { id: "<DATA ITEM NAME 1 FROM SOURCE SPEC TYPE STRING>", dataType: tableau.dataTypeEnum.string },
        { id: "<DATA ITEM NAME 2 FROM SOURCE SPEC TYPE FLOAT>", alias: "<GIVE ALIAS IF REQUIRED>", dataType: tableau.dataTypeEnum.float },
        { id: "<DATA ITEM NAME 3 FROM SOURCE SPEC TYPE DATE>", alias: "<GIVE ALIAS IF REQUIRED>", dataType: tableau.dataTypeEnum.date },
        { id: "<DATA ITEM NAME 4 FROM SOURCE SPEC TYPE FLOAT>", alias: "<GIVE ALIAS IF REQUIRED i.e. latitude>", dataType: tableau.dataTypeEnum.float },
        { id: "<DATA ITEM NAME 5 FROM SOURCE SPEC TYPE FLOAT>", alias: "<GIVE ALIAS IF REQUIRED i.e. longitude>", dataType: tableau.dataTypeEnum.float }
      ];

      //The tableSchema variable defines the schema for a single table and contains a JavaScript object.
      //Here, the value of the  columns property is set to the cols array defined earlier.
      var tableSchema = {
          id: "<PROVIDE A NAME/ID FOR THE tableSchema>",
          alias: "<PROVIDE AN ALIAS FOR THE tableSchema>",
          columns: cols
      };

      //The schemaCallback gets called when the schema is defined.
      //The schemaCallback takes an array of table objects. In this case, there is only table object (the tableSchema object defined above).
      schemaCallback([tableSchema]);

    };

    //getData functions contain the logic for getting the data.
    //The getData function takes two parameters: table and doneCallback.
    tabConnector.getData = function (table, doneCallback) {
      //The jQuery $.getJSON function gets data from the GEOJSON feed and uses a success handler to store the returned data in a response parameter (resp).
      //(You can open the URL in a browser to see what the JSON data looks like.)
      //Below is an example:
      //$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
      $.getJSON("<URL>", function(resp) {
        var feat = resp.features,
        tableData = [];

        //The for loop iterates over the features in the JSON object and stores the data that we want in the tableData array
        for (var i = 0, len = feat.length; i < len; i++) {
          tableData.push({
            "<DATA ITEM NAME 1 FROM SOURCE SPEC TYPE STRING>": feat[i].<source property name>,
            "<DATA ITEM NAME 2 FROM SOURCE SPEC TYPE FLOAT>": feat[i].<grouped element of source i.e. properties>.<source property name i.e. mag>,
            "<DATA ITEM NAME 3 FROM SOURCE SPEC TYPE DATE>": feat[i].<grouped element of source i.e. properties>.<source property name i.e. date>,
            "<DATA ITEM NAME 4 FROM SOURCE SPEC TYPE FLOAT>": feat[i].<grouped element of source i.e. geometry>.<source property i.e. coordinates[1] which is the second array element (longitude)>
            "<DATA ITEM NAME 5 FROM SOURCE SPEC TYPE FLOAT>": feat[i].<grouped element of source i.e. geometry>.<source property i.e. coordinates[0] which is the second array element (latitude)>
          });
        }

        //The table parameter is an object defined by the WDC to which you can append data.
        //The table.appendRows function appends the tableData array to the table as a JavaScript object.
        table.appendRows(tableData);

        //The doneCallback signals to Tableau that you are done getting data.
        doneCallback();

      });
    };

    //The registerConnector function validates the connector object before initialization.
    tableau.registerConnector(myConnector);

    //The jQuery $(document).ready function runs some code when the page loads.
    //An click event listener (("#submitButton").click) is added to the button element created earlier. The button is identified by the submitButton id.
    $(document).ready(function () {
      $("#submitButton").click(function () {
        //The tableau.connectionName variable defines what we want to call the connector data source when it is displayed in Tableau.
        tableau.connectionName = "<NAME YOUR CONNECTION>";

        //If you want to pass in a parameter, you need to populate the tableau.connectionData object, usually from an input or form item; example below:
        //tableau.connectionData = document.getElementById("numpages").value; // set the value for num_pages

        //The tableau.submit() function sends the connector object to Tableau for validation.
        tableau.submit();
      });
    });

})();
