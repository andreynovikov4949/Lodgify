describe('test case', () => {
  it('tbd', () => {
    const projectName = 'Test API project'
    const user = {
      email: "novikov.av.4949+testuser1@gmail.com",
      password: "Test1234"
    }
    cy.createProjectViaAPI(projectName);
    cy.loginViaUI(user.email, user.password);
    // cy.loginViaAPI();
  })
})