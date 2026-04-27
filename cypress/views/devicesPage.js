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

/** Events list body on device details — Events tab */
const EVENTS_CONTAINER = '[data-testid="device-events-list"]'

/** RichValidationTextField validation button for approve modal alias */
const DEVICE_ALIAS_VALIDATION_BTN = '[data-testid="rich-validation-field-deviceAlias-validation-button"]'

/**
 * DevicesPage object for device management operations.
 * Prefer data-testid selectors from flightctl-ui for stability.
 */
export const devicesPage = {
  openApproveDeviceModal: () => {
    common.navigateTo('Devices')
    cy.get('[data-testid="list-page-title"]').contains('Devices pending approval')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('exist')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('be.visible')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).click()
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('be.visible')
  },

  fillAliasInApproveModal: (alias) => {
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').clear()
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').type(alias)
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('have.value', alias)
  },

  expectValidationIconError: () => {
    cy.get(DEVICE_ALIAS_VALIDATION_BTN).should('be.visible')
    cy.get(DEVICE_ALIAS_VALIDATION_BTN).find('svg').should('have.attr', 'color', VALIDATION_ERROR_ICON_COLOR)
  },

  closeApproveDeviceModal: () => {
    cy.get('[data-testid="approve-device-form-cancel"]').click()
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('not.exist')
  },

  approveDevice: (deviceName = 'test-device') => {
    common.navigateTo('Devices')

    cy.get('[data-testid="list-page-title"]').contains('Devices pending approval')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('exist')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).should('be.visible')
    cy.get(`[data-testid="enrollment-request-approve-button-${ROW_0}"]`).click()
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('be.visible')
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').type(deviceName)
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('have.value', deviceName)
    cy.get('[data-testid="approve-device-form-submit"]').should('be.visible')
    cy.get('[data-testid="approve-device-form-submit"]').click()
    cy.get(`[data-testid="enrolled-device-row-${ROW_0}"]`, { timeout: 500000 }).should('contain', 'Online')
  },

  deviceEvents: (deviceName = 'test-device') => {
    common.navigateTo('Devices')
    cy.wait(1000)
    cy.contains(`[data-testid^="device-name-link-"]`, deviceName).should('be.visible').click()
    cy.wait(1000)
    cy.get('[data-testid="device-details-tab-events"]').should('be.visible').click()
    cy.wait(1000)
    cy.get('[data-testid="events-type-filter-toggle"]').contains('Warning')
    DEVICE_EVENTS_NORMAL.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('not.contain', msg)
    })
    DEVICE_EVENTS_WARNING_ONLY.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('contain', msg)
    })
    cy.get('[data-testid="events-type-filter-toggle"]').click()
    cy.wait(500)
    cy.get('[data-testid="events-filter-option-normal"]').click()
    DEVICE_EVENTS_NORMAL.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('contain', msg)
    })
    DEVICE_EVENTS_WARNING_ONLY.forEach((msg) => {
      cy.get(EVENTS_CONTAINER).should('not.contain', msg)
    })
    cy.get('[data-testid="events-type-filter-toggle"]').click()
    cy.wait(500)
    cy.get('[data-testid="events-filter-option-all-types"]').click()
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
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('be.visible')
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').should('have.value', currentName)
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').clear()
    cy.get('[data-testid="rich-validation-field-deviceAlias"]').type(newName)
    cy.get('[data-testid="wizard-next-button"]').click()
    cy.get('[data-testid="textfield-osImage"]').should('be.visible')
    cy.get('[data-testid="textfield-osImage"]').clear()
    cy.get('[data-testid="textfield-osImage"]').type(image)
    cy.get('[data-testid="textfield-osImage"]').should('have.value', image)
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
        const found = Cypress.$.makeArray($table.find('[data-testid^="device-update-status-"]')).some((el) =>
          el.textContent.includes('Out-of-date'),
        )
        if (found) {
          cy.get('[data-testid="enrolled-devices-table"]')
            .find('[data-testid^="device-update-status-"]')
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
    cy.get('[data-testid="device-details-tab-terminal"]', { timeout: 30000 }).should('be.visible').click()
    cy.get('[data-testid="device-terminal-panel"]', { timeout: 50000 }).should('be.visible')
    cy.get('[data-testid="device-terminal-panel"]').click()
  },
}
