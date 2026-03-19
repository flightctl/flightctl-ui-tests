import { devicesPage } from '../views/devicesPage'

describe('Device Management', () => {
  beforeEach(() => {
    cy.login(`${Cypress.env('host')}`, `${Cypress.env('auth')}`, `${Cypress.env('username')}`, `${Cypress.env('password')}`)
  })

  describe('Approve device – Alias validation (negative)', () => {
    it('Should show validation error when alias starts with a dash', () => {
      devicesPage.openApproveDeviceModal()
      devicesPage.fillAliasInApproveModal('-invalid-alias')
      devicesPage.expectValidationIconError()
      devicesPage.closeApproveDeviceModal()
    })

    it('Should show validation error when alias ends with a dot', () => {
      devicesPage.openApproveDeviceModal()
      devicesPage.fillAliasInApproveModal('invalid-alias.')
      devicesPage.expectValidationIconError()
      devicesPage.closeApproveDeviceModal()
    })

    it('Should show validation error when alias contains spaces', () => {
      devicesPage.openApproveDeviceModal()
      devicesPage.fillAliasInApproveModal('invalid alias with spaces')
      devicesPage.expectValidationIconError()
      devicesPage.closeApproveDeviceModal()
    })

    it('Should show validation error when alias contains special characters (e.g. emoji shorthand)', () => {
      devicesPage.openApproveDeviceModal()
      devicesPage.fillAliasInApproveModal('Thanks for confirming :pray: At first I thought I hallucinating :slightly_s...')
      devicesPage.expectValidationIconError()
      devicesPage.closeApproveDeviceModal()
    })

    it('Should show validation error when alias exceeds 63 characters', () => {
      const longAlias = 'a'.repeat(64)
      devicesPage.openApproveDeviceModal()
      devicesPage.fillAliasInApproveModal(longAlias)
      devicesPage.expectValidationIconError()
      devicesPage.closeApproveDeviceModal()
    })
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

  it('Should view device events', () => {
    devicesPage.deviceEvents()
  })

  it('Should decommission a device', () => {
    devicesPage.decommissionDevice()
  })
})
