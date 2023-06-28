import { TodoistApi } from "@doist/todoist-api-typescript";
import { loginViaAPI } from "../pages/globalElements";

const todoistApi = new TodoistApi(Cypress.env('users').userForTest.api_token);

describe('Validate “Create Project” functionality', () => {
  
  // delete all existing Projects to provide clear environment
  beforeEach(() => {
    cy.deleteAllProjects();
  });
  context('Positive scenarios', () => {
    it('User is able to see the project created via API', () => {
      const projectName = 'Test API project 1';
      cy.createProjectViaAPI(projectName);
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();
      
      // verify that new project is visible in the projects panel
      todoist.projectsPanel.contains(projectName);
    });
  });
  context('Negative scenarios', () => {
    it.skip('User is unable to create project with empty name', () => {
      const projectName = ' '
      todoistApi.addProject({ name: projectName }); // there should be an assert of status code
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();

      // new project shouldn't appear in the project's menu
      todoist.projectsPanel.should('not.contain', projectName);
    });
    // bug found: User is able to create a project with a name that exceeds the maximum character limit
    it('User is unable to create project with a name that exceeds the maximum character limit', () => {
      // 121/120 symbols in the name
      const projectName = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqu';
      todoistApi.addProject({ name: projectName });
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();

      // new project should appear in the project's menu
      todoist.projectsPanel.should('not.contain', projectName);
    });
    // bug found: User is able to create 7/5 project. User gets 403 error when he tries to create 8th project
    it('User is unable to create project that extends the limit', () => {
      const projectName = 'Test API project'

      // create 5 projects
      for(let i = 1; i < 6; i++) {
        const projectName = 'Test API project ' + i;
        cy.createProjectViaAPI(projectName);
      }

      //creation of the 6th project should be unavailable
      todoistApi.addProject({ name: projectName }); // there should be an assert of status code
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();

      // new project shouldn't appear in the project's menu
      todoist.projectsPanel.should('not.contain', projectName);
    });
  });
  context('Boundary conditions', () => {
    it('User is able to create project max length name', () => {
      // 120/120 symbols in the name
      const projectName = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq';
      todoistApi.addProject({ name: projectName });
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();

      // new project should appear in the project's menu
      todoist.projectsPanel.contains(projectName);
    });
    it('User is able to create project min length name', () => {
      const projectName = 'L'
      todoistApi.addProject({ name: projectName });
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();

      // new project should appear in the project's menu
      todoist.projectsPanel.contains(projectName);
    });
    it('User is able to create the last project beyond the limit', () => {
      const projectName = 'Test API project last'
      // create 5 projects
      for(let i = 1; i < 5; i++) {
        const projectName = 'Test API project ' + i;
        cy.createProjectViaAPI(projectName);
      }

      //creation of the 5th project should be available
      todoistApi.addProject({ name: projectName });
      const todoist = loginViaAPI()
        .waitForLoaderToDisappear();
      cy.waitForSync();

      // new project should appear in the project's menu
      todoist.projectsPanel.contains(projectName);
    });
  });
});