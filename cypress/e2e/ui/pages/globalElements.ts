import { TaskModal } from "./taskModal";

// global functions like actions with items in the left menu
// and in the main part can be found here
export class GlobalElements {
    get projectsPanel(): Cypress.Chainable {
        return cy.get('#left-menu-projects-panel');
    }

    get createNewTaskButton(): Cypress.Chainable {
        return cy.get('button.plus_add_button');
    }

    get inboxSectionButton(): Cypress.Chainable {
        return cy.contains('Inbox');
    }

    get inboxCounter(): Cypress.Chainable {
        return cy.get('div[data-sidebar-list-item="true"]')
            .first()
            .find('span[aria-hidden="true"]');
    }

    get listOfTasks(): Cypress.Chainable {
        return cy.get('ul.items');
    }

    getTaskInListById = (id: number): Cypress.Chainable => {
        return cy.get(`#task-${id}`);
    }

    public clickOnProject = (projectName: string): GlobalElements => {
        this.projectsPanel.contains(projectName).click();
        return this;
    }

    public clickNewTaskButton = (): TaskModal => {
        this.createNewTaskButton.click();
        return new TaskModal();
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

    public clickInbox = (): GlobalElements => {
        this.inboxSectionButton.click({ force: true });
        cy.get('header[data-testid="view_header"]').contains('Inbox')
        return this;
    }

    public getValueFromInboxCounter = (): Cypress.Chainable => {
        return this.inboxCounter
            .invoke('text')
            .then((text) => {
                const counterValue = parseInt(text.trim(), 10);
                // if there is no tasks NaN is converted to 0
                const itemCount = isNaN(counterValue) ? 0 : counterValue;
                return itemCount;
              });
    }

    public getNumberOfTasksInList = (): Cypress.Chainable => {
        // Add field button is another 'li'
        // globalElements.listOfTasks.find('>li').eq(count+1);
        return this.listOfTasks
        .find('>li')
        .then((elements) => {
            const elementsCount = elements.length - 1;
            return elementsCount;
        });
    }

    public verifyPriorityOfTaskById = (id: number, priority: 1 | 2 | 3 | 4): GlobalElements => {
        this.getTaskInListById(id)
            .find(`button.task_checkbox.priority_${priority}`)
            .should('exist');
        return this;
    }

    public verifyDateOfTaskById = (id: number, text: string): GlobalElements => {
        this.getTaskInListById(id)
            .find('button.due_date_controls')
            .should('contain', text);
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
    return new GlobalElements();
};
