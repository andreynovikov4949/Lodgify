import taskPage from "../pages/taskPage";
import homepage from "../pages/globalElements";
import { TodoistApi } from "@doist/todoist-api-typescript";

const todoistApi = new TodoistApi("f9322ff1c0f019421a5bff397e77508313a4451b");


describe('Validate “Create Create Task via web application" functionality', () => {
  context('User is able to create task via UI', () => {
    it.only('With only name', () => {
      const projectName = 'Project for scenario 2.1';
      const taskName = 'Only name task';
      cy.createProjectViaAPI(projectName);
      cy.loginViaAPI();

      // wait for loader to dissappear
      cy.waitForLoaderToDissappear();

      // wait for sync so the project appears on the homepage
      cy.waitForSync();
      homepage.clickOnProject(projectName);
      taskPage.clickNewTaskButton();
      taskPage.typeTaskName(taskName);
      taskPage.clickAddTask();
      cy.get('@taskId').then(($id) => {
        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.content).eq(taskName));

          // delete new created task
        // todoistApi.deleteTask($id as unknown as string);
      });

      // delete the new Project
      cy.deleteProjectViaAPI('@projectId');
    });

    it('With description', () => {
      const projectName = 'Project for scenario 2.2';
      const taskName = 'Task with description';
      const taskDescription = 'Test Description';
      cy.createProjectViaAPI(projectName);
      cy.loginViaAPI();

      // wait for loader to dissappear
      cy.waitForLoaderToDissappear();

      // wait for sync so the project appears on the homepage
      cy.waitForSync();
      taskPage.createNewTaskButton.click();
      taskPage.taskNameField.type(taskName);
      taskPage.taskDescriptionField.type(taskDescription);
      taskPage.clickAddTask();
      cy.get('@taskId').then(($id) => {
        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.description).eq(taskDescription));

          // delete new created task
        todoistApi.deleteTask($id as unknown as string);
      });

      // delete the new Project
      cy.deleteProjectViaAPI('@projectId');
    });
    it('With priority', () => {
      const projectName = 'Project for scenario 2.3';
      const taskName = 'Task with description';
      const taskDescription = 'Test Description';
      cy.createProjectViaAPI(projectName);
      cy.loginViaAPI();

      // wait for loader to dissappear
      cy.waitForLoaderToDissappear();

      // wait for sync so the project appears on the homepage
      cy.waitForSync();
      taskPage.createNewTaskButton.click();
      taskPage.taskNameField.type(taskName);
      taskPage.taskDescriptionField.type(taskDescription);
      taskPage.clickAddTask();
      cy.get('@taskId').then(($id) => {
        todoistApi.getTask($id as unknown as string)
          .then((task) => expect(task.description).eq(taskDescription));

          // delete new created task
        todoistApi.deleteTask($id as unknown as string);
      });

      // delete the new Project
      cy.deleteProjectViaAPI('@projectId');
    })
  });
});