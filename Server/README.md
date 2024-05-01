# PDF Viewer REST API Server

By Felipe Almanza and Jeffry Prado

felipe.almanza@kuehne-nagel.com & jeffry.prado@kuehne-nagel.com

This is an application created using NodeJS and Express JS that provides a REST API connected to a PostgreSQL database model stored in pgwebformt1-primary.db.int.kn.

## Technologies Used

- JavaScript
- NodeJS
- ExpressJS
- PostgreSQL

## Setup/Installation

- Clone this repository to your local computer.
- In a terminal run this to install all the dependencies

```
    npm install
```

- .env file

## Run the app

    npm run dev

# REST API

The REST API is described below.

There are routes for multiple API requests:

<!-- Auth -->

- /auth

  - /auth/refresh
  - /auth/logout

<!-- Users -->

- /users

  - /users/:id

<!-- Roles -->

- /roles

  - /roles/:id

<!-- User Roles -->

- /user_roles

  - /user_roles/user/:userId
  - /user_roles/user/:userId/role/:roleId

<!-- Task Items -->

- /task_items

  - /task_items/:id
  - /task_items/status/:status
  - /task_items/taskId/:taskId/status/:status
  - /task_items/getPdf

<!-- Tasks -->

- /tasks

  - /tasks/:id

<!-- Salog -->

- /salog

  - /salog/api/triggerStatus

<!-- KibanaLog -->

- /kibanaLog

## Get list of [Route Name]

### Request

`GET /[Route Name]/`

`POST /[Route Name]/`

`PUT /[Route Name]/:id/`

`DELETE /[Route Name]/id`
