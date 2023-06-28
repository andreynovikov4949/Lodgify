# ToDoist Automation suit
 
This repository contains a suite of automated tests written using Cypress and TypeScript. These tests are designed to validate the functionality of ToDoist application and ensure its quality.

The following Scenarios were covered in this suite:
1. Validate “Create Project” functionality
2. Validate “Create Task via web application”
3. Validate  “Create Task via API”

The positive test cases have been covered, along with some negative and boundary condition cases.

### Note
In the challenge description, it was mentioned that the second scenario should use the project from the first scenario. However, in this implementation, a new project/task is created at the beginning of each test to ensure test independence. Before starting each test, any entities that could affect the test are deleted.

## Prerequisites
Before running the tests, ensure that you have the following software installed:
- Download and install code editor eg Visual Studio Code
- Node.js: Download and Install Node.js

## Getting Started
To get started with running the automated tests, follow these steps:

1. Clone this repository to your local machine:
`git clone <repository-url>`
2. Navigate to the project directory:
`cd userPath/Lodgify`
3. Install the project dependencies:
`npm install`
4. Start the Cypress Test Runner(this commands clears the previous results and start tests):
`npm run clear:run`
5. Generate the report by running this command
`npm run merge:generate`
6. Copy the HTML link and open it in a browser

## Configuring Tests
The configuration options for the tests can be found in the cypress.config.json file. Modify this file to suit your specific testing needs, such as specifying the base URL or configuring test environment variables.

## Running tests manually
To run the tests via the Cypress Test Runner UI and observe the test execution, run this command and then choose the specific spec you want to run:
`npm run cypress:open` 

## Some test should fail
Some tests are failed because the problems were found:
- User is unable to create a task with a name that extends max length name
- User is unable to create project with a name that exceeds the maximum character limit
- User is unable to create project that extends the limit

Some tests are failing due to ToDoist error
 - User is able to create task with max name

*Note: If a test fails immediately on the `wrap` command or on the `wait` command in the middle of the test - please rerun the suite*


### Note 
Tests executed using the `npm run clear:run` and `npm run cypress:open` commands are run in the "Asia/Tbilisi" timezone, based on the account settings.

## Clearing results
To manually clear the results, run `npm run clear:results`. This will delete everything inside cypress/results and the **mochawesome.html** file
