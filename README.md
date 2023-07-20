# HealthFuel365
## Installition
1. Before running the application, ensure you have the installed the following:

   [Node.js](https://nodejs.org/en) (version 18.16.0)

2. Install dependencies by run the following command in Terminal:

```bash
   npm install
```
## Database Connection
Before proceeding, please make sure you have correctly installed [MongoDB](https://www.mongodb.com/try/download/community-kubernetes-operator) on your system.

After that, you can open your MongoDB Compass dashboard, click on "New Connection +," and copy and paste the following provided MongoDB URI:

```bash
  mongodb+srv://Healthfuel365:HEALTHFUEL365-team33@cluster0.qlftusn.mongodb.net/
```
## Usage

After completing the environment configuration and dependency installation, you can run:

```bash
   npm run build
```

If no error occurs, then you can run:

```bash
   npm run start
```

App is now running at [http://localhost:8081](http://localhost:8081) in development mode

## Folder structure

```bash
└── src
    ├── controllers
    ├── middleware
    ├── models
    ├── routes
    └── services
```

controllers comprise the controller functions for resolving, providing, updating, adding and deleting of products, user and order information.

middleware contains the methods to authenticate the user through the token included in the request and to add the id of the user to the request before he passes it on.

models includes interfaces describing the composition of data types like the data structure of a product in the database.

routes determine how a response to a client request at a particular endpoint will respond. It contains the Uniform Resource Identifier (URI) and the specific HTTP request method.

services contains methods regarding getting, adding, updating and deleting product, user, order information from the database.