import { TaskModal } from "./taskPage";

interface Elements {
    projectsPanel: Cypress.Chainable;
    createNewTaskButton: Cypress.Chainable;
}

export class GlobalElements {
    public clickOnProject = (projectName: string): GlobalElements => {
        globalElements.projectsPanel.contains(projectName).click();
        return this;
    }

    public clickNewTaskButton = (): TaskModal => {
        globalElements.createNewTaskButton.click();
        return new TaskModal;
    }

    public waitForLoaderToDisappear = (): GlobalElements => {
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
        return this;
    }
}

export const loginViaAPI = (): GlobalElements => {
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
    cy.visit('app');
    cy.location('pathname', { timeout: 100000 }).should('contain', '/app/today');
    return new GlobalElements;
}

export const globalElements: Elements = {
    get projectsPanel(): Cypress.Chainable {
        return cy.get('#left-menu-projects-panel');
    },

    get createNewTaskButton(): Cypress.Chainable {
        return cy.get('button.plus_add_button');
    },
}