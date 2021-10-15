# Airport API

Airport API is a challenge code that supports basic crud operations for airports, flights, weather and meals. What I've tried is to first create all crud operations and then start doing some required use cases as addressed in the problem statement.

## Installation

Use `docker-compose up` to start a mongo database.

```bash
docker-compose up
```

Then install npm dependencies

```bash
npm install
```

And finally start the app

```bash
npm run start
```

## Usage

Point your browser to localhost:5000 to do a sanity test, you should see: 'Welcome to the airport API'.
You can use Postman or similar to hit api endpoints.

There's an endpoint to insert mock data to start using it right wait with populated data.

### Create some entities

You can use the endpoint mock to insert mock data if you don't want to create each entity.

```bash
curl --location --request POST 'localhost:5000/api/mock'
```

#### Weather

##### Add weather

```bash
curl --location --request POST 'localhost:5000/api/weather' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "someweather",
    "title": "Some weather"
}
```

##### List weather

```bash
curl --location --request GET 'localhost:5000/api/weather
```

#### Meal service

##### Add meal

```bash
curl --location --request POST 'localhost:5000/api/meals' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "lasagna",
    "title": "Lasagna"
}'
```

##### List meal

```bash
curl --location --request GET 'localhost:5000/api/meals'
```

#### Airports

##### Add Airport

```bash
curl --location --request POST 'localhost:5000/api/airports' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "VAL",
    "title": "Aeropuerto Internacional de Valencia",
    "city": "Valencia",
    "status": "available",
    "weather": "<SOME VALID WEATHER ID>"
}'
}'
```

##### List Airports

```bash
curl --location --request GET 'localhost:5000/api/airports
```

##### Change Airport status

```bash
curl --location --request PUT 'localhost:5000/api/airports/<SOME VALID AIRPORT ID>/status' \
--header 'Content-Type: application/json' \
--data-raw '{

 "status": "available"
}'
```

#### Flights

##### Add flight

```bash
curl --location --request POST 'localhost:5000/api/flights/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "code": "SOME CODE",
    "airline": "SOME AIRLINE NAME",
    "title": "NYC-EZE",
    "date": "2021-12-01T03:00:00.000Z",
    "status": "scheduled",
    "departure": "<SOME VALID AIRPORT ID>",
    "destination": "<SOME VALID AIRPORT ID>",
    "meal": "<SOME VALID MEAL ID>"
}'
```

##### Get list of flights

```bash
curl --location --request GET 'localhost:5000/api/flights/
```

#### Get flight status

```bash
curl --location --request GET 'localhost:5000/api/flights/<SOME VALID FLIGHT CODE>/status'
```

## Use cases

When using this endpoint to see the status of a flight: `localhost:5000/api/flights/<SOME VALID FLIGHT CODE>/status` there is some business logic involved:

1. If weather conditions are: 'snow', 'thunder' flight should be cancelled
2. If weather conditions are: 'fog', 'rainy' OR any departure or destination airport is busy then flight should be delayed.

These are the cases where the status of the flight is changed.

### Business logic on CRUDs

Also as for the entities, I considered that in order to create 'flights' the entities needed are:

- Airport (for departure and destination)
- Meal service

Same for Airport, I needed to create first:

- Weather to set it as a current status, so when doing queries in flights they can look up either the destination or departure airport weather conditions.
- Meal: to enable the flights to have a service meal on creation
