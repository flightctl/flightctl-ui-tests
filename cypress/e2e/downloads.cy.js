describe('Downloads Management', () => {
    it('Should download os flightctl cli', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.en
        cy.downloadFile(`${Cypress.env('os')}`, `${Cypress.env('arch')}`)
    })
})