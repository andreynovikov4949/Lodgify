import homepage from "../pages/homepage"
import { TodoistApi } from "@doist/todoist-api-typescript";

const todoistApi = new TodoistApi("f9322ff1c0f019421a5bff397e77508313a4451b");

// needs to check that 6th project can not be created
Cypress.on('uncaught:exception', (err) => {
  expect(err.message).to.include('403');
  // return false to prevent the error from
  // failing this test
  return false;
});


describe('Validate “Create Project” functionality', () => {
  it.skip('User is able to see the project created via API', () => {
    const projectName = 'Test API project 1'
    const user = {
      email: "novikov.av.4949+testuser1@gmail.com",
      password: "Test1234"
    }
    cy.createProjectViaAPI(projectName);
    cy.loginViaAPI();
    // wait for loader to dissappear
    cy.waitForLoaderToDissappear();
    // wait for sync so the project appears on the homepage
    cy.waitForSync();
    homepage.projectsPanel.contains(projectName);
    // delete the new Project
    cy.deleteProjectViaAPI('@projectId');
  })

  // not finished
  it('User is unable to create project that extends the limit', () => {
    const projectName = 'Test API project'
    const user = {
      email: "novikov.av.4949+testuser1@gmail.com",
      password: "Test1234"
    }

    for(let i = 1; i < 6; i++) {
      const projectName = 'Test API project ' + i;
      cy.createProjectViaAPI(projectName);
    }
    todoistApi.addProject({ name: projectName })
      .then((response) => {})
    cy.loginViaAPI();
    // wait for loader to dissappear
    cy.waitForLoaderToDissappear();
    // wait for sync so the project appears on the homepage
    cy.waitForSync();
    // TEST FAILS - USER IS ABLE TO CREATE A PROJECT OVER THE LIMIT
    homepage.projectsPanel.should('not.contain', projectName);
    // delete the new Project
    cy.deleteProjectViaAPI('@projectId');
  })
})