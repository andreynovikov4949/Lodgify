import { TodoistApi } from "@doist/todoist-api-typescript";

const todoistApi = new TodoistApi("f9322ff1c0f019421a5bff397e77508313a4451b");

Cypress.Commands.add('createProjectViaAPI', (projectName) => {
    todoistApi.addProject({ name: projectName })
})

Cypress.Commands.add('loginViaUI', (email, password) => {
    cy.visit('/app/today');
    cy.get('a[href="/auth/login"]').contains('Log in').click();
    cy.get('input#element-0').type(email);
    cy.get('input#element-3').type(password);
    cy.get('button[data-gtm-id="start-email-login"]').click();
    cy.location('pathname', { timeout: 100000 }).should('contain', 'app/today/');
})


