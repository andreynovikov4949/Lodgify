import { TodoistApi } from "@doist/todoist-api-typescript";

const todoistApi = new TodoistApi(Cypress.env('users').userForTest.api_token);

Cypress.Commands.add('createProjectViaAPI', (projectName) => {
    cy.wrap(todoistApi.addProject({ name: projectName }), { timeout: 10000 })
        .its('id')
        .as('projectId');
});

Cypress.Commands.add('createTaskViaAPI', (taskData = {}) => {
  cy.wrap(todoistApi.addTask(taskData))
    .its('id')
    .as('taskId');
});

Cypress.Commands.add('deleteProjectViaAPI', (projectId) => {
    cy.get(projectId).then(($projectId) => {
        todoistApi.deleteProject($projectId as unknown as string);
    })
});

Cypress.Commands.add('waitForSync', () => {
    cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
    cy.wait('@syncRequest');
    // the Ui is slower than API
    // it is possible to manage it without cy.wait but not now
    cy.wait(1000);
});

Cypress.Commands.add('waitForLoaderToDisappear', () => {
    const selector = 'div.loading_screen--loader';
    const log = Cypress.log({
        name: 'waitForLoader',
        displayName: 'WAIT',
        message: ['Wait for the loader to disappear'],
        autoEnd: false,
        timeout: 15000,
    });
    cy.get(selector, { timeout: 20000, log: false }).should('not.exist')
        .then(() => {
            log.end();
        });
});

Cypress.Commands.add('assertRequestStatusCode', (request, statusCode) => {
  // cy.intercept(request)
  //   .as('assertCodeRequest')
  //   .its('response.body')
  //   .should('eq', statusCode);
  // cy.wait('@assertCodeRequest');

  cy.request(request).then((response) => {
    expect(response.status).to.eq(statusCode)
  })
});


Cypress.Commands.add('deleteAllProjects', () => {
    cy.wrap(todoistApi.getProjects()).then((projects) => {
        const projectIds = (projects as any[]).map((project) => project.id);
    
        // Recursive function to delete projects sequentially
        const deleteProjectsSequentially = (index) => {
          if (index >= projectIds.length) {
            // All projects have been deleted, exit the function
            return;
          }
    
          const projectId = projectIds[index];
          todoistApi.deleteProject(projectId);
    
          // Delete the next project after a small delay
          cy.wait(1000).then(() => {
            deleteProjectsSequentially(index + 1);
          });
        };
    
        // Start deleting projects from the beginning
        deleteProjectsSequentially(0);
      });
})

Cypress.Commands.add('deleteAllTasks', () => {
    cy.wrap(todoistApi.getTasks()).then((tasks) => {
        const taskIds = (tasks as any[]).map((task) => task.id);
    
        // Recursive function to delete projects sequentially
        const deleteTasksSequentially = (index) => {
          if (index >= taskIds.length) {
            // All projects have been deleted, exit the function
            return;
          }
    
          const projectId = taskIds[index];
          todoistApi.deleteTask(projectId);
    
          // Delete the next project after a small delay
          cy.wait(1000).then(() => {
            deleteTasksSequentially(index + 1);
          });
        };
    
        // Start deleting projects from the beginning
        deleteTasksSequentially(0);
      });
})

// not working for some reason
Cypress.Commands.add('deleteAll', (type) => {
  const getItems = type === 'Tasks' ? todoistApi.getTasks : todoistApi.getProjects;
  const deleteItem = type === 'Tasks' ? todoistApi.deleteTask : todoistApi.deleteProject;

  cy.wrap(getItems()).then((items) => {
    const itemIds = (items as any[]).map((item) => item.id);

    // Recursive function to delete items sequentially
    const deleteItemsSequentially = (index) => {
      if (index >= itemIds.length) {
        // All items have been deleted, exit the function
        return;
      }

      const itemId = itemIds[index];
      deleteItem(itemId);

      // Delete the next item after a small delay
      cy.wait(1000).then(() => {
        deleteItemsSequentially(index + 1);
      });
    };

    // Start deleting items from the beginning
    deleteItemsSequentially(0);
  });
});

