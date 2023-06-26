interface Homepage {
    projectsPanel: Cypress.Chainable;
}

const homepage: Homepage = {
    get projectsPanel(): Cypress.Chainable {
        return cy.get('#left-menu-projects-panel');
    }
}

export default homepage; 