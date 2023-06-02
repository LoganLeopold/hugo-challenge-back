# Hugo Challenge Backend

This is your basic express <-> postgress backend. It will run on localhost port 3001, which is pre-configured as the request target in the challenge FE.

## Requirements

### Postgres

This project will require an open connection to a Postgres DB on your local machine. You can find a download [here](https://www.postgresql.org/download/).

I also downloaded [Postico]() to have a GUI. You can configure the access very easily using all the same info that will be provided in the environment variable below. Postgres runs on port 5432 by default, and Postico listens there by default as well. 

#### Data note:
I provided some seed data. DEFINITELY not historical or personal to me in any way.... Just oddly specific... The DB should be seeded upon the below NPM command and you should be able to then start the FE react app and get it to load the appropriate data from this server. 

### 2. NPM 

This is a relatively approachable Express project, relying on node-postgres (pg in the imports) for all of the pooling/querying. You can follow the familiar NPM steps below to establish the project locally. 

### .env File

I established an .env file per convention. My sample file is down below. A few notes:

1. You will need to adjust PGUSER and PGPASSWORD to be the credentials you establish for your Postgres server. This can be done using the psql command line that appears if you click on any DB in your local Postgres app and the [psql create user commands](https://www.postgresql.org/docs/8.0/sql-createuser.html).

2. PGPORT is the default Postgres port. 

2. The rest of the environment variables should stay the same for the app to work.

3. TARGET_DB hugo is the DB that is created in your local Postgres environment. **If there is already a database by that name, IT WILL BE DROPPED.**

PGUSER=loganleopold  
PGPASSWORD=<redacted>  
PGHOST=localhost  
PGPORT=5432  
TARGET_DB=hugo
APP_PORT=3001

## Running The App
1. Run your git clone in the directory of your choice. 
2. cd into project root 
3. npm install the dependencies
4. Use "npm run start" from the command line to start the server.
5. Open/refresh the [React App](https://github.com/LoganLeopold/hugo-challenge-front) to see the FE populated with your local seeded Postgres DB. 
