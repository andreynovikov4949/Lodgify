# ToDoist Automation suit
 
This repository contains a suite of automated tests written using Cypress and TypeScript. These tests are designed to validate the functionality of ToDoist application and ensure its quality.

The following Scenarios were covered in this suite:
1. Validate “Create Project” functionality
2. Validate “Create Task via web application”
3. Validate  “Create Task via API”

The positive test cases were covered. Also some negative and boundary conditions cases were covered

### Note
In challenge description was said that in 2nd scenario should be user project from 1st one
This is not a best practice decision so the new Project/Task is created at the beginning of every test, so every test can be run regardlessly
Before the start of every test all the entities that can affect the test are deleted

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
5. Generate report by running this command
`npm run merge:generate`
6. Copy HTML link and open it in browser

## Configuring Tests
The configuration options for the tests can be found in the cypress.config.json file. Modify this file to suit your specific testing needs, such as specifying the base URL or configuring test environment variables.

## Running tests manually
To run the test via UI and see the ongoing script run this command and then choose .spec you want to run
`npm run cypress:open` 

## Some test should fail
Some tests are failed because the problems were found:
*User is unable to create a task with a name that extends max length name*
*User is unable to create project with a name that exceeds the maximum character limit*
*User is unable to create project that extends the limit*

Some tests are failing due to ToDoist error
*User is able to create task with max name*

If the test fails immediately on `wrap` command or on `wait` command in the middle of the test - please rerun the suite


### Note 
Test by commands `npm run clear:run` and `npm run cypress:open` are run in a timezone Asia/Tbilisi due to account settings

## Clearing results
To manually clear results run `npm run clear:results` it will delete everything inside cypress/results and the **mochawesome.html** file
