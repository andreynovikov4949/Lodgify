// actions with Task Creation Modal can be found here
export class TaskModal {
    get createNewTaskButton(): Cypress.Chainable {
        return cy.get('button.plus_add_button');
    }

    get taskNameField(): Cypress.Chainable {
        return cy.get('div[aria-label="Task name"]');
    }

    get taskDescriptionField(): Cypress.Chainable {
        return cy.get('div[aria-label="Description"]');
    }

    get addTaskButton(): Cypress.Chainable {
        return cy.get('button[data-testid="task-editor-submit-button"]');
    }

    get priorityField(): Cypress.Chainable {
        return cy.get('div[aria-label="Set priority"]');
    }

    public getPriorityFromDropdown = (priorityDigit: number): Cypress.Chainable => {
        return cy.get(`li[aria-label="Priority ${priorityDigit}"]`);
    }

    public getTaskById = (id: number): Cypress.Chainable => {
        return cy.get(`[aria-labelledby="task-${id}-content"]`)
    }

    public clickAddTask = (): TaskModal => {
        this.addTaskButton.click();
        cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
        cy.wait('@syncRequest').its('response.body.items[0].id').as('taskId');
        return this;
    }

    public typeTaskName = (name: string): TaskModal => {
        this.taskNameField.type(name);
        return this;
    }

    public typeTaskDescription = (name: string): TaskModal => {
        this.taskDescriptionField.type(name);
        return this;
    }

    public choosePriority = (priority: number): TaskModal => {
        this.priorityField.click();
        this.getPriorityFromDropdown(priority).click();
        return this;
    }
}