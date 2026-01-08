Postman Test Cases:  
This document lists all API test cases executed using Postman for the Real Estate Consultant Management System. All test cases include positive and negative scenarios as expected in the evaluation document.

1. Authentication & Authorization:

1) TC-AUTH-01: Admin Login
Method: POST
URL: `/api/auth/login`
Body:

json
{
  "email": "admin@test.com",
  "password": "123456"
}

Expected Result: JWT token returned

2) TC-AUTH-02: Invalid Login
Method: POST
URL:`/api/auth/login`
Body: Invalid credentials
Expected Result:Login fails


2. Lead Management

1) TC-LEAD-01: Create Lead
Method: POST
URL: `/api/leads/create`
Body:
json
{
  "name": "Rahul Sharma",
  "phone": "9876543210",
  "email": "rahul@test.com",
  "source": "Website"
}

Expected Result: Lead created successfully

2) TC-LEAD-02: Get All Leads
Method:GET
URL: `/api/leads`
Expected Result: List of leads returned

3)  TC-LEAD-03: Convert Lead

Method: POST
URL:`/api/leads/convert/:id`
Expected Result:Lead converted and customer created


3. Customer Management

1) TC-CUST-01: Get Customers

Method: GET
URL:`/api/customers`
Expected Result:Customer list returned


4. Property Management

1) TC-PROP-01: Create Property

Method: POST
URL: `/api/properties/create`
Body:
json
{
  "title": "2BHK Flat - Wakad",
  "type": "Flat",
  "price": 2500000,
  "owner": "OWNER_ID",
  "status": "Available"
}

Expected Result: Property created

2) TC-PROP-02: Get Properties
Method: GET
URL: `/api/properties`
Expected Result: Properties listed


5. Rental Management

1) TC-RENTAL-01: Create Rental

Method: POST
URL:`/api/rentals/create`
Body:
json
{
  "propertyId": "PROPERTY_ID",
  "tenantId": "CUSTOMER_ID",
  "rentAmount": 18000,
  "deposit": 50000
}

Expected Result: Rental created successfully


2) TC-RENTAL-02: Prevent Duplicate Rental

Method: POST
URL: `/api/rentals/create`
Body: Same propertyId again
Expected Result: Error – property already rented

2) TC-RENTAL-03: Add Rent Payment

Method: POST
URL: `/api/rentals/payment/:id`
Expected Result: Payment recorded


3) TC-RENTAL-04: Move Out Tenant

Method: POST
URL: `/api/rentals/moveout/:id`
Expected Result: Rental closed


6.  Dashboard

1) TC-DASH-01: Dashboard Summary

Method: GET
URL: `/api/dashboard/summary`
Expected Result:Summary counts returned


2) TC-DASH-02: Dynamic Dashboard Update

Procedure:
  1. Fetch dashboard summary
  2. Create lead / rental
  3. Fetch summary again
Expected Result:Counts updated dynamically

7. Conclusion

All APIs were tested using Postman with valid JWT tokens. Both positive and negative scenarios were validated, ensuring functional correctness and business rule enforcement.
