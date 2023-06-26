declare namespace Cypress {
  interface Chainable {
    createProjectViaAPI(projectName: string): Chainable<void>;

    loginViaUI(email: string, password: string): Chainable<void>;

    loginViaAPI(): Chainable<Chainable>;

    deleteProjectViaAPI(projectId: string): Chainable<Chainable>;

    verifySiteIsViisble(): Chainable<Chainable>;

    waitForLoaderToDissappear(): Chainable<Chainable>;

    waitForSync(): Chainable<void>;
  }
}