# Routes

## Endpoints without authentication

- POST `/login`
- POST `/register`
- GET `/users/:id`<br>
  Get user details.
- GET `/reports`<br>
  Get all reports.
- GET `/reports/:id`<br>
  Get report details.
- GET `/types`<br>
  Get all types.
- POST `/types`<br>
  Post type.
- GET `/votes/:id`<br>
  Get vote details.
- GET `/votes`<br>
  Get all votes.

## Endpoints with authentication

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
