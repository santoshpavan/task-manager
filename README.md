# Task Manager

An application developed using NodeJS and MongoDB database.

The following features were implemented as part of the project.

* Used **MongoDB** database along with mongoose library in NodeJS, to model the data along with data validations.

* Implemented authentication for users using email and password. For security, stored the hashed passwords in MongoDB using [bcrypt.js](https://www.npmjs.com/package/bcrypt) module. 

* Users can perform CRUD actions on profiles and tasks specific to that profile.

* Devloped Express.js based REST API calls to perform CRUD actions performed by the user.

* Implemented file upload support so that users can upload pictures using [multer](https://www.npmjs.com/package/multer) module.

* Tested these API calls using the Postman application.

* Implemented pagination, filtering and sorting of the tasks for the user.

* Implemented email notification feature for the changes being performed on the tasks using the [Sendgrid](https://sendgrid.com/docs/for-developers/sending-email/quickstart-nodejs/) service.

* Performed automated testing of the application using Jest testing framework.
