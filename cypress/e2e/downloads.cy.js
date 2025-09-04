describe('Downloads Management', () => {
    it('Should download os flightctl cli for Windows ARM 64', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadClifile(`Windows`, `ARM 64`)
    })
    it('Should download os flightctl cli for Windows x86_64', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadClifile(`Windows`, `x86_64`)
    })
    it('Should download os flightctl cli for Linux ARM 64', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadClifile(`Linux`, `ARM 64`)
    })
    it('Should download os flightctl cli for Linux x86_64', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadClifile(`Linux`, `x86_64`)
    })
    it('Should download os flightctl cli for macOS ARM 64', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadClifile(`Mac`, `ARM 64`)
    })
    it('Should download os flightctl cli for macOS x86_64', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.downloadClifile(`Mac`, `x86_64`)
    })
})