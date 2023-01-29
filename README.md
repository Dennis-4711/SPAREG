# Sport Athlete Report Generation (SPAREG)

This is a repository for the implementation of project 3 "Sport athletes reports generation" of the practical course "Data Science Praktikum - WS22" at GU Frankfurt.

## Abstract

The sport measurements are mapped to a set of time series. Each time
series is a vector of objects. Each object has one numerical value and one
time value. Each time series has also three parameters: discipline, space
and certain athlete id.
* Implement the data model using MongoDB and Node js.
* The frontend should be implemented in React.
* Develop a dynamic report page where the athlete can see his performance and progress. The report composed of text, chart and table components.
* Implement 3 types of chart and table components. Each chart or table should be dynamically initialized with required x-axis and yaxis as subset of DB time series.
* The report is a component of its own that initialized with set of athlete IDs and set of chart, table and text components.
* Using the same principle develop a report page for admins which serves as dashboard with 3 types of charts and tables.

## Section 1: Use Case Diagram

SPAREG offers the functionality to create reports for sport athletes. When a user wants to create such a report he or she **can** add an element. To make the selection of time series easier, the user can filter the available time series by discipline, space or athlete. Only the time series that match the chosen filters are being listed for the element.

After filtering, the type of the element and the exact time series to be shown can be chosen. When a series is chosen, its data is displayed in the selected format and a target value is visualized. After adding an element to the report it is still possible to switch the type or time series and the elements will adapt dynamically. In addition, it is also possible to remove elements.

![use_case](https://user-images.githubusercontent.com/29735893/215329317-2d6d2eb8-853e-43a5-b20a-64e0c016e4ec.png)

## Section 2: Data Model

The data model holds the data in JSON format within a MongoDB database.

![data_model](https://user-images.githubusercontent.com/29735893/215329486-674b9937-89b6-4c6e-9df8-101c362b9126.png)

* **series_id**: Primary key of a time series
* **athlete_id**: Foreign key to refer to a specific athlete
* **discipline**: Name of a discipline the time series does belong to.  

    *Example values: "Basketball", "Weightlifting"*

* **space**: Name of a space the time series does belong to.  

    *Example values: "Bodyweight in KG", "Scored Points", "Weight lifted in KG"*
    
* **targetValue**: A set integer value for the data points to be compared with. It is shown either as line in a selected graphs or as difference within a table.

   *Example values: 15, 75, 80*

* **vector**: The vector does hold the actual measurements and timestamps for a time series.  

   *Example for a vector:*  
   ```
   [  
     { "timestamp": "17.07.22T10:29:11", "value": 8},  
     { "timestamp": "14.08.22T07:32:45", "value": 11},  
     { "timestamp": "05.10.22T08:10:32", "value": 15},  
     { "timestamp": "12.11.22T07:40:13", "value": 13},  
     { "timestamp": "15.12.22T07:35:42", "value": 16}  
   ]
   ```
  
**Example for a complete time series document:**

```
{
  "series_id": 1,
  "athlete_id": 51,
  "discipline": "Basketball",
  "space": "Scored Points",
  "targetValue": 12,
  "vector": [  
    { "timestamp": "17.07.22T10:29:11", "value": 8},  
    { "timestamp": "14.08.22T07:32:45", "value": 11},  
    { "timestamp": "05.10.22T08:10:32", "value": 15},  
    { "timestamp": "12.11.22T07:40:13", "value": 13},  
    { "timestamp": "15.12.22T07:35:42", "value": 16}  
  ]
}
```

## Section 3: User Interface

For the implementation of the interface we use **React** as our framework.
When we create a report , we can filter different information by different messages such as: **displine**, **space** and **athlete_id**. By selecting the information we can get the corresponding time series number.
Once we have selected certain information to filter and submitted, we can visualise our filtered time series data in different ways. In this case we use the react library **"echart"** to present three different charts and a table. The charts are: **bar chart**, **line chart** and **swarm chart**.

This is demonstrated as follows:

![截屏2023-01-16 11 22 07](https://user-images.githubusercontent.com/72921749/212655362-6cc15e6c-96ec-496b-ba42-83516d1c73e3.png)

This is our main page, at the first we have our filter for our report. We can choose the certain information for the filter or nothing "it will be showed as Any". Then we click the confirm button to show the chart of the series id that we have selected.

If we have previously selected a filter with "any", that means our series id is not unique. We have to choose the series id that we want in the next page like following:

![截屏2023-01-16 11 34 28](https://user-images.githubusercontent.com/72921749/212657913-c14e2dbd-6979-45e7-a3ee-bee6c26ba434.png)

If the report has been visualied we can also choose the different type of charts. We made three charts and one table to show the information for the time series that we selected. We can also switch it.

![截屏2023-01-16 11 35 51](https://user-images.githubusercontent.com/72921749/212658172-7dc22b4f-0fb5-4a59-8378-e3a5179d3440.png)

Once we display the chart, we can add some information to the chart below. We can add the appropriate information in the text box below. We can save and change it at any time.

![截屏2023-01-19 22 11 26](https://user-images.githubusercontent.com/72921749/213560535-8091e48d-3d19-4c54-8b8b-c89027cf8acb.png)

For a dynamic data generation report, we can create several different reports, and by clicking the Create Report button we can reselect a specific filter to generate a new report. Of course, we can always delete reports or text boxes that we don't need. Note: When we delete the first report, all of our new reports will be deleted.
![截屏2023-01-19 22 15 45](https://user-images.githubusercontent.com/72921749/213561549-cc6d4398-6093-4eee-a774-57af3a1629cf.png)

## Section 4: Choice of Database

The use of MongoDB was mandatory. The reason for that is probably that time series data can easily be handled in a JSON format.

## Section 5: Implementation of Data Model and Database

The data model was implemented with JSON documents as described in section 2. The example data was added manually.

The database was implemented as Atlas MongoDB Database in an Atlas cloud environment. The connection is established with NodeJS using the mongoose module. The mongoose schema can be seen in /backend/models/time_series.model.js.

## Section 6: API

The file /backend/server.js is the entry point for the backend and establishes the connection with the database with a given URI from the Atlas cloud environemnt. After successfully establishing a connection, the endpoints /time_series, /disciplines, /spaces and /athletes are added to the server. The exact implementation of the endpoints can be seen in the files /backend/routes/, whereby only the endpoint /time_series has a more complex implementation for the combination of different filters for discipline, space and athlete and an endpoint for the full data of a single time series.

The following is a functional description of all available endpoints, that are necessary for filtering and display of time series data in the frontend:
* GET /api/athletes: returns a list of available athletes
* GET /api/disciplines: returns set of all available disciplines
* GET /api/spaces: returns set of all available spaces
* GET /api/time_series: returns list of available time series, data vector **not included**
    * (optional, query, array of integers) athletes[]: filter returned time series by athletes
    * (optional, query, array of strings) disciplines[]: filter returned time series by disciplines
    * (optional, query, array of strings) spaces[]: filter returned time series by spaces
* GET /api/time_series/{id}: returns all data about a single time series, data vector **included**
