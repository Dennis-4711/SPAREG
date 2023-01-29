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

As shown in Figure 1, when we enter the interface of our Athlete Report, the first thing that appears in front of us is a button names "add element", if we click the button it will show S a filter list. Here we can select the specific discipline, space or athleteid of the time series we need, as shown in the figure we can select specific information for each type or none of them (keeping Any unchanged). Each data we select will be changed according to the previous data. For example, if I select basketball in the discpline list, then the next space selection will only show the basketball measurements such as scores and the next athlete id will only show the ID of the athlete playing basketball.
When we are done with the selection, click on the confirm button to generate a chart or table with the serial numbers of the information we have selected. Note: If we do not select any of the three types, that is, if we select any of the three types, then all the time series will be displayed. At this point the user needs to choose which chart he wants to see.
![Interface](https://user-images.githubusercontent.com/72921749/215332616-3f0e864d-49db-4d07-9713-93abd964cdfe.png)
<img width="398" alt="basketball" src="https://user-images.githubusercontent.com/72921749/215332623-7c836511-28ef-4f6c-bdfd-052777bdedf8.png">
Once we click on the data we want by filter and click submit, our dashboard will display our data. Here we can choose different types of charts to display, such as: bar chart, line chart, swarm polt or table to show our selected time series. If we didn't select each filter when we selected it earlier (which is the case with any) then there is a possibility of matching multiple time series ids, then the user needs to select the id of the time series he wants to visualize . As shown in the figure , I only selected discpline is weightlfting, but for space and athlete ids I did not select. So when I generate the chart, it will automatically select the smallest time series id to generate, and of course I can switch the time series id on the top.

![selectid](https://user-images.githubusercontent.com/72921749/215332648-5ec20585-39ed-4924-a9d9-cd9c3ca0ba9d.png)

 As our task was to implement a dynamic report for the athletes, we also added a text box (just like in the figure 4 to help the athletes to add additional information when they see their sports data, and of course they can delete or modify the text they add.
 ![addtext](https://user-images.githubusercontent.com/72921749/215332673-2d0fe942-180a-47b7-ac0b-1edc84f9ee45.png)
 
 As the title says, this is an athlete's report, so when we click on the add element we can always add a visual graph of the athlete. As well as we one can remove it at any time as soon as we click on the remove element (As shown in Figure 5.
 
 ![addelement](https://user-images.githubusercontent.com/72921749/215332705-48c6e277-3ffe-47e2-a89c-678c74b5b051.png)
 
 As you can see, there is a red line in our chart. And this shows our targetvalue. Each data has a targetvalue which means what score should the athlete reach or what kg should the athlete have. With the targetvalue we can clear see which timeseries value has reached the target and wich not. Also we add the total number and the average number as label beside our chart as the addtional information for the chart. 
For the form of the table (As shown in Figure) we can't use the line to show the target value. So we just add a new coloum which show the difference for each time series value and the targetvalue. Wenn the time series value is lower than the targetValue it will be showed in red and otherwise it will be showed in blue.

![table](https://user-images.githubusercontent.com/72921749/215332739-bbe15f64-e193-4810-846c-6bafc04a1b8e.png)



## Section 4: Choice of Database

The use of MongoDB was mandatory. The reason for that is probably that time series data can easily be handled in a JSON format.

## Section 5: Implementation of Data Model and Database

The data model was implemented with JSON documents as described in section 2. The example data was added manually.

The database was implemented as Atlas MongoDB Database in an Atlas cloud environment. The connection is established with NodeJS using the mongoose module. The mongoose schema can be seen in /backend/models/time_series.model.js.

Example data is availaible as a csv dump in /docs/exampleData.

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
