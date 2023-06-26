declare namespace Cypress {
  interface Chainable {
    createProjectViaAPI(projectName: string): Chainable<void>;

    loginViaAPI(): Chainable<Chainable>;

    deleteProjectViaAPI(projectId: string): Chainable<Chainable>;

    waitForLoaderToDissappear(): Chainable<Chainable>;

    waitForSync(): Chainable<void>;
  }
}