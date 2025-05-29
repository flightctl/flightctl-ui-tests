describe('Fleet Management', () => {
    it('Should create a fleet', () => {
        cy.login()
        cy.createFleet()
    })
})