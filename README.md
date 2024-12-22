# Overview

## Run
```
npm i
npm run start
```
The code uses a setTimeout function called every minute to check and update reservations

## How it works

This solution uses 4 APIs to fetch data from Resy.

1. Fetch reservations for a time period:
`https://api.resyos.com/4/os/reservation/ids?end_datetime=...&start_datetime=...`
EXAMPLE OUTPUT:
```
[{
  "id": "fly_669864221",
  "last_updated": "2024-12-16T02:49:42.461588+00:00",
  "flag": false
},]
```

2. Fetch reservation details:
`https://api.resyos.com/5/os/reservations`
INPUT: {"ids": ["fly_xxxxxxx"]}
EXAMPLE OUTPUT:
```
{
    "reservation_id": "fly_670826596",
    "user_id": "30653022",
    "contact_user_id": null,
    "flag": 0,
    "specs": {
      "turn_time": 5400,
      "num_seats": 2,
      "num_arrived": 0,
      "price": 0,
      "class_id": 1,
      "booked_datetime": "2024-12-22 18:00:00",
      "service_charge_amount": 0,
      "beverage_pairing_amount": 0,
      "tax": 0,
      ...
      ...
      ...
```

3. Fetch user details:
`https://api.resyos.com/2/os/users`
INPUT: ids=30653022,6483602
EXAMPLE OUTPUT:
```
[{
    "user_id": 1273366,
    "class_id": 1,
    "first_name": "Will",
    "last_name": "Stewart",
    ...
    ...
    ...
```

4. Refresh JWT Token when it expires:
`https://auth.resy.com/1/auth/venue`



This solution uses API#1 to fetch reservations for long time period so we don't have to check for every single date. This is achieved by setting the appropriate values for `end_datetime` and `start_datetime`. 
Also minimizes the need to poll the API frequently by using API#1 as follows:
  a. We check if a reservation of those returned is not in our system. In case it is not, we add it.
  b. If the reservation already exists in our system we check that the `last_updated` value returned is the same as ours. Only if they are different we retrieve the details of the reservation again and update our system

Similar optimisations exist for users. If a user already exists in our system we don't refetch the user details thus minimizing footprint and requests made towards Resy
