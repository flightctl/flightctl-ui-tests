describe('Fleet Management', () => {
    beforeEach(() => {
        cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
    })
    it('Should create a fleet', () => {
        cy.createFleet(`${Cypress.env('image')}`)
    })
  /*   it('Should edit a fleet', () => {
         cy.editFleet(`${Cypress.env('image')}`)
     }) */
    it('Should delete a fleet', () => {
         cy.deleteFleet('test-fleet')
    })
    it('Should import a fleet', () => {
        cy.importFleet()
    })
 /*    it('Should delete an imported fleet', () => {
        cy.deleteRepository('test-fleet')
        cy.wait(5000)
        cy.deleteFleet('basic-nginx-fleet')
    }) */
})