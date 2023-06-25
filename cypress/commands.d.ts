declare namespace Cypress {
  interface Chainable {
    createProjectViaAPI(projectName: string): Chainable<void>;

    loginViaUI(email: string, password: string): Chainable<void>;

    loginViaAPI(): Chainable<void>;
  }
}