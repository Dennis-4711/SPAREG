# SPAREG Backend

This is the backend component of the SPAREG software.

## Currently implemented Endpoints

* **GET /time_series**: returns available time_series filtered by different parameters
    * (optional) athletes[]: Array of integers (athlete_id) to filter time series.
    * (optional) disciplines[]: Array of strings (discipline) to filter time series.
    * (optional) spaces[]: Array of strings (space) to filter time series.
    * Example: Request ```GET /time_series?athletes[]=11&athletes[]=47&disciplines[]=Weightlifting&spaces[]=Weight%20lifted%20in%20KG``` returns time series where (athlete has id 11 OR 37) AND (discipline is "Weightlifting") AND (space is "Weight lifted in KG)

* **GET /athletes**: returns a distinct list of available athletes  
* **GET /disciplines**: returns a distinct list of available disciplines  
* **GET /spaces**: returns a distinct list of available spaces
