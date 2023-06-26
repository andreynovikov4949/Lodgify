import { TodoistApi } from "@doist/todoist-api-typescript";

const todoistApi = new TodoistApi("f9322ff1c0f019421a5bff397e77508313a4451b");

Cypress.Commands.add('createProjectViaAPI', (projectName) => {
    cy.wrap(todoistApi.addProject({ name: projectName }))
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
            "email": "novikov.av.4949+testuser1@gmail.com",
            "password": "Test1234",
            "pkce_oauth": null,
            "web_session": true,
            "permanent_login": true,
            "device_id": "1b27f528-a183-b99a-bd69-1fff5080482a"
        }
    })
    cy.visit('');
    cy.location('pathname', { timeout: 100000 }).should('contain', '/app/today');
})

Cypress.Commands.add('waitForSync', () => {
    cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
    cy.wait('@syncRequest');
})

Cypress.Commands.add('waitForLoaderToDissappear', () => {
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

