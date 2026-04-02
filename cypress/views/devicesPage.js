import { common } from './common'

/** Default table row index for flows that assume a single primary device row */
const ROW_0 = 0

/** Alias validation: red error icon color when invalid */
const VALIDATION_ERROR_ICON_COLOR = '#b1380b'

/** Event message substrings for deviceEvents(): Warning filter vs All types */
const DEVICE_EVENTS_WARNING_ONLY = ['Device update failed']
const DEVICE_EVENTS_NORMAL = [
  'Device returned to being up-to-date',
  'Device is updating',
  'Device was created successfully',
]

/** Events list body (no data-testid until UI PR merges device-events-list) */
const EVENTS_CONTAINER = '.pf-v6-c-card__body.fctl-events-container'

/**
 * DevicesPage object for device management operations.
 * Uses merged data-testid hooks where available; falls back to stable ids / PF classes
 * for pieces not yet in a released flightctl-ui build.
 */
export const devicesPage = {
  openApproveDeviceModal: () => {
    common.navigateTo('Devices')
    cy.get('[data-testid="list-page-title"]').contains('Devices pending approval')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('exist')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('be.visible')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).click()
    cy.get('#rich-validation-field-deviceAlias').should('be.visible')
  },

  fillAliasInApproveModal: (alias) => {
    cy.get('#rich-validation-field-deviceAlias').clear()
    cy.get('#rich-validation-field-deviceAlias').type(alias)
    cy.get('#rich-validation-field-deviceAlias').should('have.value', alias)
  },

  expectValidationIconError: () => {
    cy.get('button[aria-label="Validation"]').should('be.visible')
    cy.get('button[aria-label="Validation"]').find('svg').should('have.attr', 'color', VALIDATION_ERROR_ICON_COLOR)
  },

  closeApproveDeviceModal: () => {
    cy.contains('Cancel').click()
    cy.get('#rich-validation-field-deviceAlias').should('not.exist')
  },

  approveDevice: (deviceName = 'test-device') => {
    common.navigateTo('Devices')

    cy.get('[data-testid="list-page-title"]').contains('Devices pending approval')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('exist')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('be.visible')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).click()
    cy.get('#rich-validation-field-deviceAlias').should('be.visible')
    cy.get('#rich-validation-field-deviceAlias').type(deviceName)
    cy.get('#rich-validation-field-deviceAlias').should('have.value', deviceName)
    cy.get('[data-testid="approve-device-form-submit"]').should('be.visible')
    cy.get('[data-testid="approve-device-form-submit"]').click()
    cy.get(`[data-testid="enrolled-device-row-${ROW_0}"]`, { timeout: 500000 }).should('contain', 'Online')
  },

  deviceEvents: (deviceName = 'test-device') => {
    common.navigateTo('Devices')
    cy.wait(1000)
    cy.contains(`[data-testid^="device-name-link-"]`, deviceName).should('be.visible').click()
    cy.wait(1000)
    cy.get('[id^="pf-tab-events-pf"]').contains('Events').should('be.visible').click()
    cy.wait(1000)
    cy.get('.pf-v6-c-menu-toggle.pf-m-expanded').contains('Warning')
    DEVICE_EVENTS_NORMAL.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('not.contain', msg)
    })
    DEVICE_EVENTS_WARNING_ONLY.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('contain', msg)
    })
    cy.get('.pf-v6-c-menu-toggle.pf-m-expanded').contains('Warning').click()
    cy.wait(1000)
    cy.get('.pf-v6-c-menu__item-text').contains('Normal').click()
    DEVICE_EVENTS_NORMAL.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('contain', msg)
    })
    DEVICE_EVENTS_WARNING_ONLY.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('not.contain', msg)
    })
    cy.get('.pf-v6-c-menu-toggle.pf-m-expanded').contains('Normal').click()
    cy.wait(1000)
    cy.get('.pf-v6-c-menu__item-text').contains('All types').click()
    const allTypesExpected = [...DEVICE_EVENTS_NORMAL, ...DEVICE_EVENTS_WARNING_ONLY]
    allTypesExpected.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('contain', msg)
    })
  },

  editDevice: (image, currentName = 'test-device', newName = 'test-device-edited') => {
    common.navigateTo('Devices')

    cy.contains(`[data-testid^="device-name-link-"]`, currentName).should('be.visible')
    cy.contains(`[data-testid^="device-name-link-"]`, currentName)
      .closest('tr')
      .find(`[data-testid^="device-row-actions-"] .pf-v6-c-menu-toggle`)
      .click()
    cy.wait(1000)
    cy.contains('Edit device configurations').click()
    cy.wait(1000)
    cy.get('#rich-validation-field-deviceAlias').should('be.visible')
    cy.get('#rich-validation-field-deviceAlias').should('have.value', currentName)
    cy.get('#rich-validation-field-deviceAlias').clear()
    cy.get('#rich-validation-field-deviceAlias').type(newName)
    cy.get('[data-testid="wizard-next-button"]').click()
    cy.get('#textfield-osImage').should('be.visible')
    cy.get('#textfield-osImage').clear()
    cy.get('#textfield-osImage').type(image)
    cy.get('#textfield-osImage').should('have.value', image)
    cy.get('[data-testid="wizard-next-button"]').click()
    cy.get('[data-testid="wizard-next-button"]').click()
    cy.get('[data-testid="wizard-save-button"]').click()
    cy.get('[data-testid="device-details-title"]', { timeout: 50000 }).should('contain', newName)
  },

  checkDeviceOutOfDate: (deviceName = 'test-device-edited2') => {
    common.navigateTo('Devices')
    cy.contains(`[data-testid^="device-name-link-"]`, deviceName).should('be.visible')

    const intervalMs = 5000
    const totalMs = 120000
    const maxAttempts = Math.floor(totalMs / intervalMs) + 1

    const pollForOutOfDate = (attempt) => {
      if (attempt > 0) {
        cy.wait(intervalMs)
      }
      cy.get('[data-testid="enrolled-devices-table"]').then(($table) => {
        const found = Cypress.$.makeArray($table.find('[data-label="Update status"]')).some((el) =>
          el.textContent.includes('Out-of-date'),
        )
        if (found) {
          cy.get('[data-testid="enrolled-devices-table"]')
            .find('[data-label="Update status"]')
            .contains('Out-of-date')
            .should('be.visible')
        } else if (attempt + 1 < maxAttempts) {
          pollForOutOfDate(attempt + 1)
        } else {
          throw new Error(
            `Update status did not contain "Out-of-date" within ${totalMs / 1000}s (checked every ${intervalMs / 1000}s)`,
          )
        }
      })
    }
    pollForOutOfDate(0)
  },

  decommissionDevice: () => {
    common.navigateTo('Devices')

    cy.get(`[data-testid="enrolled-device-row-${ROW_0}"]`).find('input[type="checkbox"]').should('be.visible')
    cy.get(`[data-testid="enrolled-device-row-${ROW_0}"]`).find('input[type="checkbox"]').click()
    cy.get('[data-testid="toolbar-decommission-devices"]').should('be.visible')
    cy.get('[data-testid="toolbar-decommission-devices"]').click()
    cy.get('[data-testid="modal-decommission-confirm"]').should('be.visible')
    cy.get('[data-testid="modal-decommission-confirm"]').click()
    cy.get('[data-testid="toolbar-delete-forever"]').should('be.visible')
    cy.get('table thead input[type="checkbox"]').should('be.visible')
    cy.get('table thead input[type="checkbox"]').click()
    cy.get('[data-testid="toolbar-delete-forever"]').should('be.visible')
    cy.get('[data-testid="toolbar-delete-forever"]').click()
    cy.get('[data-testid="modal-delete-devices-confirm"]').should('be.visible')
    cy.get('[data-testid="modal-delete-devices-confirm"]').click()
    cy.get('[data-testid="show-decommissioned-devices-switch"]').closest('label').should('be.visible')
    cy.get('[data-testid="show-decommissioned-devices-switch"]').closest('label').click()
  },

  openTerminal: (deviceName = 'test-device') => {
    common.navigateTo('Devices')

    cy.contains(`[data-testid^="device-name-link-"]`, deviceName).should('be.visible')
    cy.contains(`[data-testid^="device-name-link-"]`, deviceName).click()
    cy.contains('Terminal').should('be.visible')
    cy.contains('Terminal').click()
    cy.get('.pf-v6-l-bullseye', { timeout: 50000 }).should('be.visible')
    cy.get('.pf-v6-l-bullseye').click()
  },
}
