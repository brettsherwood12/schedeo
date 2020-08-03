# free-time
Node.js event planning app

Models

- User
- Event
- Comment

Routes

- GET Sign-up
- POST Sign-up
- GET Sign-in
- POST Sign-in
- GET Home/event feed
- GET Create event
- POST Create event
- GET Single event


Views

Home - User sees list of events, and button to create new event. Event Creation - user sees form for creating event. Event 

User Model

- name: String, required
- email: String, required
- hashedPassword: String, required
- events: Array of ObjectIds, ref Event
- active: Boolean, default false
- confirmationToken: String, required, unique

Event Model

- name: String, required
- creator: ObjectID, required
- locationName: String, required
- location: GeoJSON
- dates: Array of objects w/properties date = Date, votes = Number
- description: String
- pictureUrl: String
- invitees: Array of ObjectIds, ref User

Comment Model

- creator: ObjectId, ref User
- content: String, required
- event: ObjectId, ref Event
- pictureUrl: String
