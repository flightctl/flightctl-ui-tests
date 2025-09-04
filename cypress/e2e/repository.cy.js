describe('Repository Management', () => {

    it('Should create a repository', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.createRepository(`${Cypress.env('repository')}`, `${Cypress.env('revision')}`, `${Cypress.env('resource')}`)

    })
})