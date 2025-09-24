describe('Device Management', () => {
  beforeEach(() => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
  })
 
  it('Should approve a device enrollment request', () => {
    cy.deviceApproval()
  })
/*   it('Should open a terminal on a device', () => {
    cy.openTerminal()
  }) */
  it('Should edit a device', () => {
    cy.editDevice(`${Cypress.env('image')}`)
  })
  it('Should decommission a device', () => {
    //login command is in commands.js
    cy.decommissionDevice()
  }) 
})