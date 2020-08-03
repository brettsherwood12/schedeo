# free-time
Node.js event planning app

Models

- User
- Event
- Comment

Routes

- GET Home/event feed
- GET Sign-up
- POST Sign-up
- GET Sign-in
- POST Sign-in
- GET Create event
- POST Create event

Views



User Model

- name: String, required
- email: String, required
- hashedPassword: String, required
- events: array of ObjectIds, ref Event

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
