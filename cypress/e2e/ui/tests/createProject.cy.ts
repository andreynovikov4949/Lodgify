import { TodoistApi } from "@doist/todoist-api-typescript";
import { globalElements } from "../pages/globalElements";
import { loginViaAPI } from "../pages/globalElements";

const todoistApi = new TodoistApi(Cypress.env('users').userForTest.api_token);

describe('Validate “Create Project” functionality', () => {
  beforeEach(() => {
    cy.deleteAllProjects();
  });
  it('User is able to see the project created via API', () => {
    const projectName = 'Test API project 1';
    cy.createProjectViaAPI(projectName);
    loginViaAPI()
      .waitForLoaderToDisappear();
    cy.waitForSync();
    globalElements.projectsPanel.contains(projectName);
    // delete the new Project
    // cy.deleteProjectViaAPI('@projectId');
  })

  // not finished
  // bug found: User is able to create 7/5 project. User gets 403 error when he tries to create 8th project 
  it.only('User is unable to create project that extends the limit', () => {
    const projectName = 'Test API project'
    for(let i = 1; i < 6; i++) {
      const projectName = 'Test API project ' + i;
      cy.createProjectViaAPI(projectName);
    }
    todoistApi.addProject({ name: projectName })
      .then((response) => {})
    cy.loginViaAPI();
    // wait for loader to disappear
    cy.waitForLoaderToDisappear();
    // wait for sync so the project appears on the homepage
    cy.waitForSync();
    // TEST FAILS - USER IS ABLE TO CREATE A PROJECT OVER THE LIMIT
    globalElements.projectsPanel.should('not.contain', projectName);
    // delete the new Project
    cy.deleteProjectViaAPI('@projectId');
  })
})