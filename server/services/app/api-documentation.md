# Routes

## Endpoints without authentication

- POST `/login`
- POST `/register`
- GET `/reports`<br>
  Get all reports.
- GET `/reports/:id`<br>
  Get report details.
- GET `/types`<br>
  Get all types.
- POST `/types`<br>
  Create type.
- GET `/votes`<br>
  Get all votes.
- GET `/votes/report/:id`<br>
  Get all votes in report details.

## Endpoints with authentication

- GET `/users/:id`<br>
  Get user details.
- POST `/reports`<br>
  Create report after user login.
- POST `/votes`<br>
  Create vote after user login.
- GET `/votes/:id`<br>
  Get vote details after user login.
- PUT `/votes/:id`<br>
  Update vote status like or dislike after user login.

## Descriptions

- Users : Table for saving personal informations.
- Reports : Table for saving user report about high-risk locations.
- Types : Table for saving type of high-risk locations (examples : prone to criminals, accidents, etc).
- Votes : Table for saving like or dislike about the high-risk locations.

## 1. POST/login

Description:

- Login user

Request :

- body :

```json
{
  "email": "test@mail.com",
  "password": "admin"
}
```

_Response ( 200 - OK )_

```json
{
  "id": 1,
  "access_token": "string",
  "email": "test@mail.com",
  "name": "tester"
}
```

_Response ( 401 - Unauthorized )_

```json
{
  "message": "Invalid Login"
}
```

## 2. POST/register

Description:

- Register user

Request :

- body :

```json
{
  "email": "test@mail.com",
  "password": "admin",
  "name": "tester",
  "gender": "male",
  "phoneNumber": "081517588332",
  "address": "home address"
}
```

_Response ( 201 - Created )_

```json
{
  "id": 1,
  "email": "test@mail.com"
}
```

_Response ( 400 - Bad Request )_

```json
{
    "message" : "Name is required"
}
OR
{
    "message" : "Email is required"
}
OR
{
    "message" : "Email already registered"
}
OR
{
    "message" : "Email must be valid"
}
OR
{
    "message" : "Password is required"
}
OR
{
    "message" : "Phone number is required"
}
OR
{
    "message" : "Address is required"
}
OR
{
    "message" : "Data Not Valid"
}
```

## 3. GET/reports

Description:

- Get all reports

_Response ( 200 - OK )_

```json
[
  {
    "isActive": true,
    "id": 1,
    "title": "testing report 1",
    "description": "testing report 1",
    "TypeId": 1,
    "UserId": 1,
    "mainImage": "string url",
    "latitude": "1",
    "latitudeDelta": null,
    "longitude": "1",
    "longitudeDelta": null,
    "location": "string location",
    "createdAt": "2023-11-20T15:08:13.510Z",
    "updatedAt": "2023-11-20T15:08:13.510Z",
    "User": {
      "id": 1,
      "name": "a",
      "email": "test123@mail.com",
      "gender": "male",
      "phoneNumber": "1",
      "address": "a",
      "createdAt": "2023-11-20T14:36:49.004Z",
      "updatedAt": "2023-11-20T14:36:49.004Z"
    },
    "Type": {
      "id": 1,
      "name": "Bencana",
      "createdAt": "2023-11-20T14:22:16.568Z",
      "updatedAt": "2023-11-20T14:22:16.568Z"
    }
  },
  {
    "isActive": true,
    "id": 2,
    "title": "testing report 2",
    "description": "testing report 2",
    "TypeId": 1,
    "UserId": 1,
    "mainImage": "string url",
    "latitude": "1",
    "latitudeDelta": null,
    "longitude": "1",
    "longitudeDelta": null,
    "location": "string location",
    "createdAt": "2023-11-20T15:08:13.510Z",
    "updatedAt": "2023-11-20T15:08:13.510Z",
    "User": {
      "id": 1,
      "name": "a",
      "email": "test123@mail.com",
      "gender": "male",
      "phoneNumber": "1",
      "address": "a",
      "createdAt": "2023-11-20T14:36:49.004Z",
      "updatedAt": "2023-11-20T14:36:49.004Z"
    },
    "Type": {
      "id": 1,
      "name": "Bencana",
      "createdAt": "2023-11-20T14:22:16.568Z",
      "updatedAt": "2023-11-20T14:22:16.568Z"
    }
  }
]
```

## 4. GET/reports/:id

Description:

- Get report details

_Response ( 200 - OK )_

```json
{
  "isActive": true,
  "id": 1,
  "title": "testing report 1",
  "description": "testing report 1",
  "TypeId": 1,
  "UserId": 1,
  "mainImage": "string url",
  "latitude": "1",
  "latitudeDelta": null,
  "longitude": "1",
  "longitudeDelta": null,
  "location": "string location",
  "createdAt": "2023-11-20T15:08:13.510Z",
  "updatedAt": "2023-11-20T15:08:13.510Z",
  "User": {
    "id": 1,
    "name": "a",
    "email": "test123@mail.com",
    "gender": "male",
    "phoneNumber": "1",
    "address": "a",
    "createdAt": "2023-11-20T14:36:49.004Z",
    "updatedAt": "2023-11-20T14:36:49.004Z"
  }
}
```

_Response ( 404 - Not Found )_

```json
{
  "message": "Error Not Found"
}
```

## 5. GET/types

Description:

- Get all types

_Response ( 200 - OK )_

```json
[
  {
    "id": 1,
    "name": "Bencana",
    "createdAt": "2023-11-20T14:22:16.568Z",
    "updatedAt": "2023-11-20T14:22:16.568Z"
  },
  {
    "id": 2,
    "name": "Kejahatan",
    "createdAt": "2023-11-20T14:22:16.568Z",
    "updatedAt": "2023-11-20T14:22:16.568Z"
  },
  {
    "id": 3,
    "name": "Kecelakaan",
    "createdAt": "2023-11-20T14:22:16.568Z",
    "updatedAt": "2023-11-20T14:22:16.568Z"
  }
]
```

## 6. POST/types

Description:

- Create new type

Request :

- body :

```json
{
  "adminVerificator": "55555",
  "name": "new type"
}
```

_Response ( 200 - OK )_

```json
{
  "id": 4,
  "name": "new type",
  "updatedAt": "2023-11-20T15:00:08.906Z",
  "createdAt": "2023-11-20T15:00:08.906Z"
}
```

_Response ( 400 - Bad Request )_

```json
{
  "message": "Name is required"
}
```

_Response ( 403 - Forbidden )_

```json
{
  "message": "You are not authorized"
}
```

## 7. GET/votes

Description:

- Get all votes

_Response ( 200 - OK )_

```json
{
  "result": [
    {
      "id": 1,
      "status": "like",
      "UserId": 1,
      "comment": "testing vote 1",
      "ReportId": 1,
      "createdAt": "2023-11-20T15:08:28.767Z",
      "updatedAt": "2023-11-20T15:08:28.767Z",
      "User": {
        "id": 1,
        "name": "tester",
        "email": "test@mail.com",
        "gender": "male",
        "phoneNumber": "081517588332",
        "address": "home address",
        "createdAt": "2023-11-20T14:36:49.004Z",
        "updatedAt": "2023-11-20T14:36:49.004Z"
      },
      "Report": {
        "id": 1,
        "UserId": 1,
        "title": "testing report 1",
        "description": "testing report 1",
        "isActive": true,
        "location": "string location",
        "TypeId": 1,
        "mainImage": "string url",
        "latitude": "1",
        "latitudeDelta": null,
        "longitude": "1",
        "longitudeDelta": null,
        "createdAt": "2023-11-20T15:08:13.510Z",
        "updatedAt": "2023-11-20T15:08:13.510Z"
      }
    },
    {
      "id": 2,
      "status": "dislike",
      "UserId": 2,
      "comment": "testing vote 2",
      "ReportId": 1,
      "createdAt": "2023-11-20T15:08:28.767Z",
      "updatedAt": "2023-11-20T15:08:28.767Z",
      "User": {
        "id": 2,
        "name": "tester2",
        "email": "test2@mail.com",
        "gender": "male",
        "phoneNumber": "081517588332",
        "address": "home address",
        "createdAt": "2023-11-20T14:36:49.004Z",
        "updatedAt": "2023-11-20T14:36:49.004Z"
      },
      "Report": {
        "id": 1,
        "UserId": 1,
        "title": "testing report 1",
        "description": "testing report 1",
        "isActive": true,
        "location": "string location",
        "TypeId": 1,
        "mainImage": "string url",
        "latitude": "1",
        "latitudeDelta": null,
        "longitude": "1",
        "longitudeDelta": null,
        "createdAt": "2023-11-20T15:08:13.510Z",
        "updatedAt": "2023-11-20T15:08:13.510Z"
      }
    }
  ]
}
```

## 8. GET/votes/report/:id

Description:

- Get all votes in report details.

_Response ( 200 - OK )_

```json
[
  {
    "id": 1,
    "status": "like",
    "UserId": 1,
    "comment": "testing vote 1",
    "ReportId": 1,
    "createdAt": "2023-11-20T15:08:28.767Z",
    "updatedAt": "2023-11-20T15:08:28.767Z",
    "User": {
      "id": 1,
      "name": "tester",
      "email": "test@mail.com",
      "gender": "male",
      "phoneNumber": "081517588332",
      "address": "home address",
      "createdAt": "2023-11-20T14:36:49.004Z",
      "updatedAt": "2023-11-20T14:36:49.004Z"
    }
  },
  {
    "id": 2,
    "status": "dislike",
    "UserId": 2,
    "comment": "testing vote 2",
    "ReportId": 1,
    "createdAt": "2023-11-20T15:08:28.767Z",
    "updatedAt": "2023-11-20T15:08:28.767Z",
    "User": {
      "id": 2,
      "name": "tester2",
      "email": "test2@mail.com",
      "gender": "male",
      "phoneNumber": "081517588332",
      "address": "home address",
      "createdAt": "2023-11-20T14:36:49.004Z",
      "updatedAt": "2023-11-20T14:36:49.004Z"
    }
  }
]
```

_Response ( 404 - Not Found )_

```json
{
  "message": "Error Not Found"
}
```

## 9. GET/users/:id

Description:

- Get user data if user is logged in and only get user logged in data

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response ( 200 - OK )_

```json
{
  "user": {
    "id": 1,
    "name": "tester",
    "email": "test@mail.com",
    "gender": "male",
    "phoneNumber": "081517588332",
    "address": "home address",
    "createdAt": "2023-11-20T14:36:49.004Z",
    "updatedAt": "2023-11-20T14:36:49.004Z"
  }
}
```

_Response ( 401 - Unauthorized )_

```json
{
  "message": "Invalid token"
}
```

_Response ( 403 - Forbidden )_

```json
{
  "message": "You are not authorized"
}
```

## 10. POST/reports

Description:

- Create report after user login.

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body :

```json
{
  "title": "testing report 1",
  "description": "testing report 1",
  "TypeId": 1,
  "latitude": "1",
  "longitude": "1"
}
```

_Response ( 200 - OK )_

```json
{
  "newReport": {
    "isActive": true,
    "id": 1,
    "title": "testing report 1",
    "description": "testing report 1",
    "TypeId": 1,
    "UserId": 1,
    "mainImage": "string url",
    "latitude": "1",
    "latitudeDelta": null,
    "longitude": "1",
    "longitudeDelta": null,
    "location": "string location",
    "createdAt": "2023-11-20T15:08:13.510Z",
    "updatedAt": "2023-11-20T15:08:13.510Z"
  }
}
```

_Response ( 400 - Bad Request )_

```json
{
    "message" : "TypeId or Latitude or Longitude must be provided"
}
OR
{
    "message" : "Title is required"
}
OR
{
    "message" : "Description is required"
}
```

_Response ( 404 - Not Found )_

```json
{
  "message": "Error Not Found"
}
```

## 11. POST/votes

Description:

- Create vote after user login.

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body :

```json
{
  "status": "like",
  "comment": "testing vote 1",
  "ReportId": 1
}
```

_Response ( 201 - Created )_

```json
{
  "id": 2,
  "status": "like",
  "comment": "testing vote 1",
  "ReportId": 1,
  "UserId": 1,
  "updatedAt": "2023-11-20T16:27:10.376Z",
  "createdAt": "2023-11-20T16:27:10.376Z"
}
```

_Response ( 400 - Bad Request )_

```json
{
    "message" : "ReportId not defined"
}
OR
{
    "message" : "Status must be like or dislike"
}
OR
{
    "message" : "Comment is required"
}
```

_Response ( 403 - Forbidden )_

```json
{
  "message": "You are not authorized"
}
```

_Response ( 404 - Not Found )_

```json
{
  "message": "Error Not Found"
}
```

## 12. GET/votes/:id

Description:

- Get vote details after user login

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response ( 200 - OK )_

```json
{
  "id": 1,
  "status": "like",
  "UserId": 1,
  "comment": "testing vote 1",
  "ReportId": 1,
  "createdAt": "2023-11-20T15:08:28.767Z",
  "updatedAt": "2023-11-20T15:08:28.767Z",
  "User": {
    "id": 1,
    "name": "tester",
    "email": "test@mail.com",
    "gender": "male",
    "phoneNumber": "081517588332",
    "address": "home address",
    "createdAt": "2023-11-20T14:36:49.004Z",
    "updatedAt": "2023-11-20T14:36:49.004Z"
  }
}
```

_Response ( 401 - Unauthorized )_

```json
{
  "message": "Invalid token"
}
```

_Response ( 404 - Not Found )_

```json
{
  "message": "Error Not Found"
}
```

## 13. PUT/votes/:id

Description:

- Update vote after user login

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body :

```json
{
  "status": "dislike",
  "comment": "updated testing vote 1",
  "ReportId": 1
}
```

_Response ( 200 - OK )_

```json
{
  "message": "Vote successfully updated"
}
```

_Response ( 400 - Bad Request )_

```json
{
    "message" : "ReportId not defined"
}
OR
{
    "message" : "Status must be like or dislike"
}
OR
{
    "message" : "Comment is required"
}
```

_Response ( 401 - Unauthorized )_

```json
{
  "message": "Invalid token"
}
```

_Response ( 403 - Forbidden )_

```json
{
  "message": "You are not authorized"
}
```

_Response ( 404 - Not Found )_

```json
{
  "message": "Error Not Found"
}
```
