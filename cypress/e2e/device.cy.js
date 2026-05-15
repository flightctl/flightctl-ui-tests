import { devicesPage } from '../views/devicesPage'

describe('Device Management', () => {
  // One login + visit per spec file; later tests reuse the same tab (testIsolation: false).
  before(() => {
    cy.ensureLoggedIn()
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

  describe('Approve device, edit device, view device events, decommission device', () => {
    it('Should approve a device enrollment request', () => {
      devicesPage.approveDevice()
    })

    /* it('Should open a terminal on a device', () => {
      devicesPage.openTerminal()
    }) */

    it('Should edit a device', () => {
      devicesPage.editDevice(`${Cypress.env('image')}`)
    })

    it('Should edit a device image - fake url', () => {
      devicesPage.editDevice(`quay.io/redhat/rhde:9.2`, 'test-device-edited', 'test-device-edited2')
    })

    it('Should make sure device is out-of-date', () => {
      devicesPage.checkDeviceOutOfDate()
    })

    it('Should view device events', () => {
      devicesPage.deviceEvents()
    })

    it('Should decommission a device', () => {
      devicesPage.decommissionDevice()
    })
  })

  describe('Run device simulator to demo 50 devices', () => {
    before(() => {
      cy.task('scaleFleetSimulatorStart')
      cy.task(
        'scaleFleetSimulatorWaitForDevices',
        {
          expected: 50,
          labelSelector: 'fleet=scale-fleet-00',
          timeoutMs: 660000,
          pollMs: 5000,
        },
        { timeout: 660000 },
      )
    })

    after(() => {
      cy.task('scaleFleetSimulatorStop')
    })

    it('should list 15 enrolled devices on pages 1–3 and 5 on page 4', () => {
      devicesPage.filterByFleetScaleLabel()
      //devicesPage.goToFirstEnrolledDevicesPage()

      cy.log('Page 1')
      devicesPage.expectEnrolledDeviceRowsCount(15)
      devicesPage.clickEnrolledDevicesNextPage()
      cy.log('Page 2')
      devicesPage.expectEnrolledDeviceRowsCount(15)
      devicesPage.clickEnrolledDevicesNextPage()
      cy.log('Page 3')
      devicesPage.expectEnrolledDeviceRowsCount(15)
      devicesPage.clickEnrolledDevicesNextPage()
      cy.log('Page 4')
      devicesPage.expectEnrolledDeviceRowsCount(5)
    })

    it('after decommissioning one device from page 3, page 3 still has 15 rows and page 4 has 4', () => {
      devicesPage.filterByFleetScaleLabel()
      devicesPage.goToEnrolledDevicesPageFromFirst(3)

      devicesPage.expectEnrolledDeviceRowsCount(15)

      devicesPage.decommissionDeviceAtEnrolledRow(0)

      cy.get('[data-testid="show-decommissioned-devices-switch"]').closest('label').click()
      cy.get('[data-testid="enrolled-devices-table"]', { timeout: 120000 }).should('exist')

      devicesPage.filterByFleetScaleLabel()
      devicesPage.goToEnrolledDevicesPageFromFirst(3)

      devicesPage.expectEnrolledDeviceRowsCount(15)

      devicesPage.clickEnrolledDevicesNextPage()

      devicesPage.expectEnrolledDeviceRowsCount(4)
    })
  })
})
