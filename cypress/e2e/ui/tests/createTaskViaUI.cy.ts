import { loginViaAPI } from "../pages/globalElements";
import { TodoistApi } from "@doist/todoist-api-typescript";
import { taskModal } from "../pages/taskPage";
const todoistApi = new TodoistApi(Cypress.env('users').userForTest.api_token);


describe('Validate “Create Create Task via web application" functionality', () => {
  beforeEach(() => {
    cy.deleteAllProjects();
  });
  context('User is able to create task via UI', () => {
    it('With only name', () => {
      const projectName = 'Project for scenario 2.1';
      const taskName = 'Only name task';
      cy.createProjectViaAPI(projectName);
      loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
        .clickAddTask();
      cy.get('@taskId').then(($id) => {
        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.content).eq(taskName));
      });
    });

    it('With description', () => {
      const projectName = 'Project for scenario 2.2';
      const taskName = 'Task with description';
      const taskDescription = 'Test Description';
      cy.createProjectViaAPI(projectName);
      loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
        .typeTaskDescription(taskDescription)
        .clickAddTask();
      cy.get('@taskId').then(($id) => {
        // cypress is unable to catch todosit api properly so
        // you need to wrap every api request to prevent failing
        cy.wrap(todoistApi.getTask($id as unknown as string))
          .its('description')
          .as('taskDescription');
        cy.get('@taskDescription').then(($taskDescription) => {
          expect($taskDescription).eq(taskDescription);
        })

        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.description).eq(taskDescription));
          taskModal.getTaskById($id as unknown as number).should('exist');
      });
    });
    it('With priority', () => {
      const projectName = 'Project for scenario 2.3';
      const taskName = 'Task with priority';
      const priorityToChoose = {
        ui: 1,
        api: 4,
      }
      cy.createProjectViaAPI(projectName);
      loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
        .choosePriority(priorityToChoose.ui)
        .clickAddTask();
      cy.get('@taskId').then(($id) => {
        // cypress is unable to catch todosit api properly so
        // you need to wrap every api request to prevent failing
        cy.wrap(todoistApi.getTask($id as unknown as string))
          .its('priority')
          .as('taskPriority');
        cy.get('@taskPriority').then(($taskPriority) => {
          // priority 1 in UI = priority 4 in json, so 2 = 3, etc
          expect($taskPriority).eq(priorityToChoose.api);
        })         
      });
    });
  });
  context('User is unable to create task', () => {
    it('With empty name', () => {
      const projectName = 'Project for scenario 2.4';
      const taskName = ' ';
      cy.createProjectViaAPI(projectName);
      loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
      taskModal.addTaskButton.should('have.attr', 'aria-disabled', 'true');
    });
  });
});