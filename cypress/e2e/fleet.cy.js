describe('Fleet Management', () => {
    it('Should create a fleet', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.createFleet(`${Cypress.env('image')}`)
    })
    it('Should edit a fleet', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
         cy.editFleet(`${Cypress.env('image')}`)
     })
     it('Should delete a fleet', () => {
         cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
         cy.deleteFleet()
     })
    it('Should import a fleet', () => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
        cy.importFleet()
    })
})