describe('Fleet Management', () => {
    it('Should create a fleet', () => {
        cy.login()
        cy.createFleet(`${Cypress.env('image')}`)
    })
    it('Should edit a fleet', () => {
         cy.login()
         cy.editFleet(`${Cypress.env('image')}`)
     })
     it('Should delete a fleet', () => {
         cy.login()
         cy.deleteFleet()
     })
    it('Should import a fleet', () => {
        cy.login()
        cy.importFleet()
    })
})