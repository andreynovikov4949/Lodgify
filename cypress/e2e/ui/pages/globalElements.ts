interface Homepage {
    projectsPanel: Cypress.Chainable;
    clickOnProject:(projectName: string) => Homepage
}

const homepage: Homepage = {
    get projectsPanel(): Cypress.Chainable {
        return cy.get('#left-menu-projects-panel');
    },

    clickOnProject: (projectName: string): Homepage => {
        homepage.projectsPanel.contains(projectName).click();
        return homepage;
    }
}

export default homepage; 