interface TaskPage {
    createNewTaskButton: Cypress.Chainable;
    taskNameField: Cypress.Chainable;
    addTaskButton: Cypress.Chainable;
    taskDescriptionField: Cypress.Chainable;
}

export class TaskModal {
    public clickAddTask = (): TaskModal => {
        taskPage.addTaskButton.click();
        cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
        cy.wait('@syncRequest').its('response.body.items[0].id').as('taskId');
        return this;
    }

    public typeTaskName = (name: string): TaskModal => {
        taskPage.taskNameField.type(name);
        return this;
    }

    public typeTaskDescription = (name: string): TaskModal => {
        taskPage.taskDescriptionField.type(name);
        return this;
    }
}

// export const clickNewTaskButton = () => {
//     taskPage.createNewTaskButton.click();
//     return new TaskModal;
// };

const taskPage: TaskPage = {
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
}