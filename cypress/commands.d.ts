declare namespace Cypress {
  interface Chainable {
    createProjectViaAPI(projectName: string): Chainable<void>;

    loginViaAPI(): Chainable<Chainable>;

    deleteProjectViaAPI(projectId: string): Chainable<Chainable>;

    waitForLoaderToDisappear(): Chainable<Chainable>;

    waitForSync(): Chainable<void>;

    deleteAllProjects(): Chainable<void>;
  }
}