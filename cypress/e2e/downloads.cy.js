describe('Downloads Management', () => {
    it('Should download os flightctl cli', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadFile(`${Cypress.env('os')}`, `${Cypress.env('arch')}`)
    })
})