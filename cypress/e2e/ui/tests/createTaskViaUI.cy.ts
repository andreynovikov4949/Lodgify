import { loginViaAPI } from "../pages/globalElements";
import { TodoistApi } from "@doist/todoist-api-typescript";
// import { taskModal } from "../pages/taskModal";
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
      const projectName = 'Project Description';
      const taskName = 'Task with description';
      const taskDescription = 'Test Description';
      cy.createProjectViaAPI(projectName);
      const taskForm = loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
        .typeTaskDescription(taskDescription);
      taskForm.taskDescriptionField.contains(taskDescription);
      taskForm.clickAddTask();
      cy.get('@taskId').then(($id) => {
        // cypress is unable to catch todosit api properly so
        // you need to wrap every api request to prevent failing
        cy.wrap(todoistApi.getTask($id as unknown as string), { timeout: 10000 })
          .its('description')
          .as('taskDescription');
        cy.get('@taskDescription').then(($taskDescription) => {
          expect($taskDescription).eq(taskDescription);
        });
        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.description).eq(taskDescription));
          taskForm.getTaskById($id as unknown as number).should('exist');
      });
    });
    it('With priority', () => {
      const projectName = 'Project Priority';
      const taskName = 'Task with priority';
      const priorityToChoose = {
        ui: 1,
        api: 4,
      };
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
        });
      });
    });
  });
  context('User is unable to create task', () => {
    it('With empty name', () => {
      const projectName = 'Project Empty Task';
      const taskName = ' ';
      cy.createProjectViaAPI(projectName);
      loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
        .addTaskButton.should('have.attr', 'aria-disabled', 'true');
    });
    it('With too long name', () => {
      const projectName = 'Project Too long Name';
      // 501/500 symbols
      const taskName = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elite';
      cy.createProjectViaAPI(projectName);
      loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName)
        .addTaskButton.should('have.attr', 'aria-disabled', 'true');
    });
  });
  context('Boundary conditions', () => {
    // sometimes an error occurs on Todoist side
    // error text: 'An unknown error happened while loading data... Please try reloading Todoist.'
    it('User is able to create task with max name', () => {
      const projectName = 'Project Max name';
      // 500/500 symbols
      const taskName = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit';
      cy.createProjectViaAPI(projectName);
      const taskModal = loginViaAPI()
        .waitForLoaderToDisappear()
        .clickOnProject(projectName)
        .clickNewTaskButton()
        .typeTaskName(taskName);
      // taskModal.taskNameField.contains(taskName);
      taskModal.clickAddTask();
      cy.get('@taskId').then(($id) => {
        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.content).eq(taskName));
      });
    });
  });
});