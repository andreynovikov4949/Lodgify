declare namespace Cypress {
  interface Chainable {
    createProjectViaAPI(projectName: string): Chainable<void>;

    createTaskViaAPI(taskData: any): Chainable<void>;

    loginViaAPI(): Chainable<Chainable>;

    deleteProjectViaAPI(projectId: string): Chainable<Chainable>;

    waitForLoaderToDisappear(): Chainable<Chainable>;

    waitForSync(): Chainable<void>;

    deleteAllProjects(): Chainable<void>;

    deleteAllTasks(): Chainable<void>;

    deleteAll(type: 'Tasks' | 'Projects'): Chainable<void>;

    assertRequestStatusCode(request: Object, code: number): Chainable<void>;
  }
}