describe('Device Management', () => {
 
  it('Should approve a device enrollment request', () => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
    cy.deviceApproval()
  })
  it('Should edit a device', () => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
    cy.editDevice(`${Cypress.env('image')}`)
  })
  it('Should decommission a device', () => {
    //login command is in commands.js
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
    cy.decommissionDevice()
  }) 
})