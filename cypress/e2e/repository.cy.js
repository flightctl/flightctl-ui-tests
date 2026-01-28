describe('Repository Management', () => {
    beforeEach(() => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
    })
/*     it('Should create a repository', () => {
        cy.createRepository(`${Cypress.env('repository')}`, `${Cypress.env('revision')}`, `${Cypress.env('resource')}`)

    }) */
    it('Should edit a repository', () => {
        cy.editRepository(`${Cypress.env('repository')}`)
    })
/*     it('Should delete a repository', () => { 
        cy.deleteRepository(`${Cypress.env('repository')}`)
    }) */
})