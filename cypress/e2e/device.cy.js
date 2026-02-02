import { devicesPage } from '../views/devicesPage'

describe('Device Management', () => {
  beforeEach(() => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
  })

  it('Should approve a device enrollment request', () => {
    devicesPage.approveDevice()
  })

  /* it('Should open a terminal on a device', () => {
    devicesPage.openTerminal()
  }) */

  it('Should edit a device', () => {
    devicesPage.editDevice(`${Cypress.env('image')}`)
  })

  it('Should decommission a device', () => {
    devicesPage.decommissionDevice()
  })
})
