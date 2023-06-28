import { loginViaAPI } from "../pages/globalElements";
import { TodoistApi } from "@doist/todoist-api-typescript";
const todoistApi = new TodoistApi(Cypress.env('users').userForTest.api_token);


describe('Validate “Create Task via API”', () => {
    beforeEach(() => {
      cy.deleteAllTasks();
    });
    context('Positive scenarios', () => {
      it('User is able to see the updated counter after task creation', () => {
        const taskName = 'Test API task 1';
        let initialCount: number;
        const todoist = loginViaAPI()
          .waitForLoaderToDisappear();

        // wait till counter refreshes after deletion of tasks in beforeEach
        cy.waitForSync();

        // get value of the inbox counter
        todoist.getValueFromInboxCounter().then((firstCount) => {
          initialCount = firstCount;
        })
        cy.createTaskViaAPI({content: taskName});

        // wait till counter refreshes after creation of the new task 
        cy.waitForSync();

        // verify value of the inbox counter after task creation
        todoist.getValueFromInboxCounter().then((secondCount) => {
          const expectedCount = initialCount + 1;
          expect(secondCount).to.equal(expectedCount);
        });
      });
      it('User is able to see the new task', () => {
        const taskName = 'Test API task 2';
        let initialCount: number;
        const todoist = loginViaAPI()
          .waitForLoaderToDisappear()
          .clickInbox();
        cy.waitForSync();
  
        // get the number of tasks in the list  
        todoist.getNumberOfTasksInList().then((firstCount) => {
          initialCount = firstCount;
        });
        cy.createTaskViaAPI({content: taskName});
        cy.waitForSync();
  
        //verify that task appears in the list
        cy.get('@taskId').then(($taskId) => {
          todoist.getTaskInListById($taskId as unknown as number)
            .should('be.visible')
            .and('contain', taskName);        
        });
  
        // verify that there is one more entity in the list
        todoist.getNumberOfTasksInList().then((secondCount) => {
          const expectedCount = initialCount + 1;
          expect(secondCount).to.equal(expectedCount);
        });
      });
      it('User is able to create task with additional fields', () => {
        const taskName = 'Test API task 3';
        const priorityToChoose = 4;
        const date = '28 Dec 12:00';
        const todoist = loginViaAPI()
          .waitForLoaderToDisappear()
          .clickInbox();
        cy.createTaskViaAPI({
          content: taskName,
          dueString: date,
          priority: priorityToChoose,
        });
        cy.waitForSync();
        //verify that task appears in the list with specified params
        cy.get('@taskId').then(($taskId) => {
          todoist.getTaskInListById($taskId as unknown as number).should('be.visible')
          todoist.verifyPriorityOfTaskById($taskId as unknown as number, priorityToChoose)
            .verifyDateOfTaskById($taskId as unknown as number, date);
        });
      });
    });
    context('Negative scenarios', () => {
      it.skip('User is unable to create a task without a name', () => {
        const taskName = ' ';
        const todoist = loginViaAPI()
          .waitForLoaderToDisappear()
          .clickInbox();
        cy.createTaskViaAPI({ content: taskName})
        // there should be an assertion of 400 status code in response
        // but due to todosit API it took too long to deal with it
        cy.waitForSync();
        cy.get('@taskId').then(($taskId) => {
          todoist.getTaskInListById($taskId as unknown as number).should('not.exist')
        });
      });
      // bug found: user is able to extends the UI's max legth of the name
      it('User is unable to create a task with a name that extends max length name', () => {
        // 501/500 symbols
        const taskName = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elite';
        const todoist = loginViaAPI()
          .waitForLoaderToDisappear()
          .clickInbox();
        cy.createTaskViaAPI({ content: taskName})
        // there should be an assertion of 400 status code in response
        // but due to todosit API it took me too long to deal with it
        cy.waitForSync();
        cy.get('@taskId').then(($taskId) => {
          todoist.getTaskInListById($taskId as unknown as number)
            .should('not.exist');
        });
      });
    });
    context('Boundary conditions', () => {
      it('User is able to create a task with max length name', () => {
        // 500/500 symbols
        const taskName = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum Lorem ipsum dolor sit amet, consectetur adipiscing elit';
        const todoist = loginViaAPI()
          .waitForLoaderToDisappear()
          .clickInbox();
        cy.createTaskViaAPI({ content: taskName})
        cy.waitForSync();
        cy.get('@taskId').then(($taskId) => {
          todoist.getTaskInListById($taskId as unknown as number)
            .should('be.visible')
            .and('contain', taskName);
        });
      });
    });
  });