# MERN-Stack-MongoDB-Express-React-Node-
MERN Stack (MongoDB, Express, React, Node) for Vaccine Registration at Kruger Coorporation.
This was a program I realized as part of the application process for the company.


# Based on two template projects
Login and Dashboard: https://github.com/FSojitra/Registration-Login-and-CRUD-Action-using-MERN-stack

Profile: https://github.com/neysidev/user-profile


# Project
The project consists of a vaccine registration platform with login and users.

There are two types of persons: admin and employee:
Employee's can only add there own information without access to other employee's information.
Admin can filter, view, edit and update any of the information from the employees. Also they can add or remove employees.

There are 3 screens:
Login (both type of users have access)
Dashboard (only admin)
Profile (both type of users have access)

Admin users can only access the employee that they have created.


# Structure
Frontend (React)

Backend (NodeJS with Express)

DataBase (MongoDB)
- Currently it is running locally, it must be configured to run on a host.
- The initial users are loaded as a json file to load in the mongodb database, this is important for the project to work.
- The loading must be done by default in the users collection of the local database. The database and collection must be created before running the project.


# Installation
The project can be easily installed and runned.

To install:

Frontend
- On the frontend directory, in the terminal set yarn install or npm install.

Backend
- On the backend directory, in the terminal set yarn install or npm install.

Database
- Run mongodb locally or in a host.
- Currently it is running locally in the following address: "mongodb://localhost:27017/local"

[![flow](https://github.com/Davidmenamm/MERN-Stack-MongoDB-Express-React-Node/blob/main/database_img.png)](https://github.com/Davidmenamm/MERN-Stack-MongoDB-Express-React-Node/blob/main/database_img.png)


# Admin workflow
The workflow of an admin user is shown. (user: David, password: mm24) <- After loading the initial users in the database (users.json)

[![flow](https://github.com/Davidmenamm/MERN-Stack-MongoDB-Express-React-Node/blob/main/admin_workflow_19.gif)](https://github.com/Davidmenamm/MERN-Stack-MongoDB-Express-React-Node/blob/main/admin_workflow_19.gif)


# Employee workflow
The workflow of an admin user is shown. (user: Luna, password: mm24) <- After loading the initial users in the database (users.json)

[![flow](https://github.com/Davidmenamm/MERN-Stack-MongoDB-Express-React-Node/blob/main/employee_workflow.gif)](https://github.com/Davidmenamm/MERN-Stack-MongoDB-Express-React-Node/blob/main/employee_workflow.gif)


# Final Message
Hope You Enjoy the project!
