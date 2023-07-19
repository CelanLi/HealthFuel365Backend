## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run dev`

Starts the development server using ts-node-dev and transpiles the TypeScript code on the fly. The server will automatically restart on file changes.

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

services contains methods regarding getting, adding, updating and deleting product, user, order information from the database
