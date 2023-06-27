// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// This opens an empty page before each test to prevent requests from previous test
// from impacting the current test
beforeEach(() => {
    cy.window({ log: false }).then((win) => {
        const window = win;
        window.location.href = 'about:blank';
    });
});