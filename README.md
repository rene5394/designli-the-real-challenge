**THE REAL CHALLENGE**

This project is built using the NestJS framework and uses pnpm for
package management. The project relies on environment variables stored
in a .env file. A sample .env.example file is provided for easy setup.

**Requirements**

- Node.js

- pnpm

- NestJS

**Installation**

1.  Clone the repository:

> git clone \<https://github.com/rene5394/designli-the-real-challenge.git\>

2.  Navigate to the project directory:

> cd \<project-directory\>

3.  Install the dependencies using pnpm:

> pnpm install

4.  Create the .env file:

> cp .env.example .env

**Running the Application**

To run the application locally:

pnpm start:dev

The application should now be running on http://localhost:3020.

**Testing the API**

To test the POST request to the /email-parser endpoint:

1.  Make sure the server is running (http://localhost:3020).

2.  Create a POST request to http://localhost:3020/email-parser.

3.  The request body should be in the following format:
    ```json
    {
      "path": "src/uploads/json-file.eml"
    }
    ```
4.  Use json-attached.eml to test get the JSON file attached.

5.  Use json-link-body.eml to test get the JSON file in the body as a link.

**.env Configuration**

Ensure that your .env file contains all the required variables to run
the application. Below is an example .env file structure:

PORT=3020

For more information on environment variables in NestJS, refer to the
NestJS documentation.
