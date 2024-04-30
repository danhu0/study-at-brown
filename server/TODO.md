**4/19 Check-in**

***Must haves:***
 - Create organized file structure and set-up for Firebase with some basic entries for users and study spots
    - figure out best way to store study spot info (Firebase, big csv, SQL)
 - Endpoint for returning user data for a specific user
 - Endpoint for returning data for a specific study
 - Endpoint for returning data for all study spots (could be combined with above)

***Stretch goals:***
 - Get pictures working and figure out a way to set ourselves up for frontend backend integration with pictures
 - Algorithm
    - figure out which algorithm to use and java library for it
    - create "taste profile" that can be generated from user data
    - make sure user taste profile data aligns with place tags
 - Endpoint for location based query

 ***Even stretcher goals:***
 - 25Live + Rock reservation system etc. web scraper for room availability info
    - maybe use python libraries we already know or find good java one
 - admin dashboard/make it at least not a humongous pain in the ass to add more study spots
 

 :interrobang: :interrobang: :interrobang:
 :shipit: :shipit:

 [x]
 
***FOR 4/30/24 EITAN DAN***
 - Set up endpoint with all the params and convert the call into a query vector
   - Handle case when not all params are filled in
 - For a given user, create taste profile vector from average of data from saved firebase data
 - Combine user taste vector with query vector
 - Endpoint: list n random *hot* study spots