interface taskModal {
    createNewTaskButton: Cypress.Chainable;
    taskNameField: Cypress.Chainable;
    addTaskButton: Cypress.Chainable;
    taskDescriptionField: Cypress.Chainable;
    priorityField: Cypress.Chainable;
    getPriorityFromDropdown: (priorityDigit: number) => Cypress.Chainable;
    getTaskById: (id: number) => Cypress.Chainable;
};

export const taskModal: taskModal = {
    get createNewTaskButton(): Cypress.Chainable {
        return cy.get('button.plus_add_button');
    },

    get taskNameField(): Cypress.Chainable {
        return cy.get('div[aria-label="Task name"]');
    },

    get taskDescriptionField(): Cypress.Chainable {
        return cy.get('div[aria-label="Description"]');
    },

    get addTaskButton(): Cypress.Chainable {
        return cy.get('button[data-testid="task-editor-submit-button"]');
    },

    get priorityField(): Cypress.Chainable {
        return cy.get('div[aria-label="Set priority"]');
    },

    getPriorityFromDropdown: (priorityDigit: number): Cypress.Chainable => {
        return cy.get(`li[aria-label="Priority ${priorityDigit}"]`);
    },

    getTaskById: (id: number): Cypress.Chainable => {
        return cy.get(`[aria-labelledby="task-${id}-content"]`)
    }
}

export class TaskModal {
    public clickAddTask = (): TaskModal => {
        taskModal.addTaskButton.click();
        cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
        cy.wait('@syncRequest').its('response.body.items[0].id').as('taskId');
        return this;
    }

    public typeTaskName = (name: string): TaskModal => {
        taskModal.taskNameField.type(name);
        return this;
    }

    public typeTaskDescription = (name: string): TaskModal => {
        taskModal.taskDescriptionField.type(name);
        return this;
    }

    public choosePriority = (priority: number): TaskModal => {
        taskModal.priorityField.click();
        taskModal.getPriorityFromDropdown(priority).click();
        return this;
    }
};