import { TodoistApi } from "@doist/todoist-api-typescript";

const todoistApi = new TodoistApi(Cypress.env('users').userForTest.api_token);

Cypress.Commands.add('createProjectViaAPI', (projectName) => {
    cy.wrap(todoistApi.addProject({ name: projectName }), { timeout: 10000 })
        .its('id')
        .as('projectId');
})

Cypress.Commands.add('deleteProjectViaAPI', (projectId) => {
    cy.get(projectId).then(($projectId) => {
        todoistApi.deleteProject($projectId as unknown as string);
    })
})

// change to local dependencies
Cypress.Commands.add('loginViaAPI', () => {
    cy.request({
        method: 'POST',
        url: 'https://todoist.com/API/v9.0/user/login',
        body: {
            "email": Cypress.env('users').userForTest.email,
            "password": Cypress.env('users').userForTest.password,
            "pkce_oauth": null,
            "web_session": true,
            "permanent_login": true,
            "device_id": Cypress.env('users').userForTest.device_id
        }
    })
    cy.visit('');
    cy.location('pathname', { timeout: 100000 }).should('contain', '/app/today');
})

Cypress.Commands.add('waitForSync', () => {
    cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
    cy.wait('@syncRequest');
})

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
})

Cypress.Commands.add('deleteAllProjects', () => {
    // cy.wrap(todoistApi.getProjects()).its('length').as('numberOfProjects');
    // cy.get('@numberOfProjects').then(($number ) => {
    //     const numberOfProjects = $number as unknown as number
    //     for(let i = 0; i < numberOfProjects; i++) {
    //         cy.wrap(todoistApi.getProjects()).its(`[${i}].id`).as('projectToDeleteId');
    //             cy.get('@projectToDeleteId').then(($projectToDeleteId ) => {
    //                 const projectToDeleteId = $projectToDeleteId as unknown as string;
    //                 todoistApi.deleteProject(projectToDeleteId);

    //         })
    //     }
    // })
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

