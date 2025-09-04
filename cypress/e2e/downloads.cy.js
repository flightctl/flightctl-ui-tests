describe('Downloads Management', () => {
    it('Should download os flightctl cli', () => {
        cy.login()
        cy.downloadFile(`${Cypress.env('os')}`, `${Cypress.env('arch')}`)
    })
})