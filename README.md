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

## Use Case Diagram

![use_case](https://user-images.githubusercontent.com/29735893/209785826-6e5e9bee-8122-472b-8731-b5afa6b9d611.png)

SPAREG offers the functionality to create reports for sport athletes. When a user wants to create such a report he or she **can** filter the available time series by discipline, space or athlete. This functionality allows easier selection of a time series.

In contrast, the selection a time series is **mandatory** to be able to add elements to the report. After a time series was selected, a user can add elements such as a text, table or a chart to the report. When doing so the properties of an element needs to be defined. Properties for example can be decisions like how many/what measurements from the selected time series are considered, if and how an average is being calculated and displayed or the layout of a table or chart.

After adding elements to the report it is still possible to switch the time series and the elements will adapt dynamically. In addition, it is also possible to remove elements.

## Database and Data Model

The SPAREG software uses **MongoDB** as database management system. The database is hosted as a **MongoDB Atlas Cloud** database and has a single collection called "time_series". The time series documents have the following data model:

![data_model](https://user-images.githubusercontent.com/29735893/209586203-30d42f0c-1b6a-4b80-a231-a830a2af4de0.png)

* **series_id**: Primary key of a time series
* **athlete_id**: Foreign key to refer to a specific athlete
* **discipline**: Name of a discipline the time series does belong to.  

    *Example values: "Basketball", "Weightlifting"*

* **space**: Name of a space the time series does belong to.  

    *Example values: "Bodyweight in KG", "Scored Points", "Weight lifted in KG"*

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
  "vector": [  
    { "timestamp": "17.07.22T10:29:11", "value": 8},  
    { "timestamp": "14.08.22T07:32:45", "value": 11},  
    { "timestamp": "05.10.22T08:10:32", "value": 15},  
    { "timestamp": "12.11.22T07:40:13", "value": 13},  
    { "timestamp": "15.12.22T07:35:42", "value": 16}  
  ]
}
```

## API

* GET /api/series: returns list of available time series
    * (optional, query, integer) limit: limit amount of returned series
    * (optional, query, integer) offset: offeset for returned time series
    * (optional, query, array of integers) athletes[]: filter returned time series by athletes
    * (optional, query, array of strings) disciplines[]: filter returned time series by disciplines
    * (optional, query, array of strings) spaces[]: filter returned time series by spaces
* GET /api/athletes: returns a list of available athletes
    * (optional, query, integer) limit: limit amount of returned athletes
    * (optional, query, integer) offset: offset for returned athletes
* GET /api/disciplines: returns set of all available disciplines
* GET /api/spaces: returns set of all available spaces

To be continued...

## GUI

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
