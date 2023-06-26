interface TaskPage {
    createNewTaskButton: Cypress.Chainable;
    taskNameField: Cypress.Chainable;
    addTaskButton: Cypress.Chainable;
    taskDescriptionField: Cypress.Chainable;
    clickNewTaskButton:() => TaskPage;
    clickAddTask:() => void;
    typeTaskName:(name: string) => TaskPage;
}

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

    

    clickAddTask: (): void => {
        taskPage.addTaskButton.click();
        cy.intercept('https://todoist.com/API/v9.0/sync').as('syncRequest');
        cy.wait('@syncRequest').its('response.body.items[0].id').as('taskId');
    },

    clickNewTaskButton: (): TaskPage => {
        taskPage.createNewTaskButton.click();
        return taskPage;
    },

    typeTaskName: (name: string): TaskPage => {
        taskPage.taskNameField.type(name);
        return taskPage;
    }
}

export default taskPage; 