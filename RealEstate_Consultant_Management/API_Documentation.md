
Base URL: 

http://localhost:5000/api

All protected APIs require a JWT token.

1. Authorization Header (for protected APIs)

Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

 1)   APIs

Login: 
Method: POST
URL: `/auth/login`

Body: 
json

{
  "email": "admin@test.com",
  "password": "123456"
}
Response: 

json
{
  "token": "JWT_TOKEN"
}

2. Lead Management APIs

1) Create Lead: 

Method: POST
URL: `/leads/create`

Body:

json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@test.com",
  "source": "Website"
}

2) Get All Leads

Method: GET
URL: `/leads`

3) Convert Lead

Method: POST
URL: `/leads/convert/:id`

Expected Result: 

* Lead status updated to `Converted`
* Customer created and linked

3. Customer APIs

Get Customers

Method: GET
URL: `/customers`

4. Property APIs

Create Property

Method: POST
URL: `/properties/create`

Body: 

json
{
  "title": "2BHK Flat - Wakad",
  "type": "Flat",
  "price": 2500000,
  "owner": "OWNER_ID",
  "status": "Available"
}

 Get Properties

Method: GET
URL: `/properties`


5. Rental APIs

Create Rental

Method: POST
 URL: `/rentals/create`

Body:

json
{
  "propertyId": "PROPERTY_ID",
  "tenantId": "CUSTOMER_ID",
  "rentAmount": 18000,
  "deposit": 50000
}


Add Rent Payment

Method: POST
URL: `/rentals/payment/:id`

Body:

json
{
  "amount": 18000
}


 Move Out Tenant

Method: POST
URL:`/rentals/moveout/:id`



6. Dashboard APIs

Dashboard Summary

Method: GET
URL:`/dashboard/summary`

Response:
json
{
  "totalProperties": 0,
  "activeRentals": 0,
  "salesInProgress": 0,
  "leads": 0,
  "converted": 0
}
Notes: 
All APIs were tested using Postman
Both positive and negative scenarios were validated
JWT authentication is mandatory for protected routes