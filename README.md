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
```
{
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String
  },
  active: {
    type: Boolean,
    default: false
  },
  confirmationToken: {
    type: String
  }
}
```

Event Model

```
{
  name: {
    type: String,
    trim: true,
    required: true
  },
  creator: {
    type: ObjectID,
    ref: user
  },
  locationName: {
    type: String
    required: true
  },
  location: {
    coordinates: [
      {
        type: Number,
        min: -180,
        max: 180
      }
    ],
    type: {
      type: String,
      default: 'Point'
    }
  },
  dates: [
    {
      date: {
      type: Date,
      },
      votes: {
        type: Number
      }
    }
  ],
  description: {
    type: String
  },
  pictureUrl: {
    type: String
  },
  invitees: [
    {
      type: ObjectId,
      ref: User
    }
  ]
  tasks: [
    {
      description: {
        type: String,
      },
      assignedTo: {
        type: ObjectId,
        ref: User
        default: null
      }
    }
  ]
}
```

Comment Model

```
creator: {
  type: ObjectId,
  ref: User
},
event: {
  type: ObjectId
  ref: Event
},
content: {
  type: String,
  required: true,
},
pictureUrl: {
  type: String,
}

```

