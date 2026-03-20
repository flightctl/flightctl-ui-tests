import { common } from './common'

/** Alias validation: red error icon color when invalid */
const VALIDATION_ERROR_ICON_COLOR = '#b1380b'

/** Event message substrings for deviceEvents(): Warning filter vs All types */
const DEVICE_EVENTS_WARNING_ONLY = ['Device update failed']
const DEVICE_EVENTS_NORMAL = [
  'Device returned to being up-to-date',
  'Device is updating',
  'Device was created successfully',
]

const EVENTS_CONTAINER = '.pf-v6-c-card__body.fctl-events-container'

/**
 * DevicesPage object for device management operations
 */
export const devicesPage = {
  /**
   * Open the "Approve pending device" modal without approving.
   * Use for validation checks only. Call fillAliasInApproveModal and
   * expectValidationIconError as needed, then closeApproveDeviceModal.
   */
  openApproveDeviceModal: () => {
    common.navigateTo('Devices')
    cy.get('h2.pf-v6-c-title.pf-m-3xl').contains('Devices pending approval')
    cy.get('[data-label="Approve"] > .pf-v6-c-button').should('exist')
    cy.get('[data-label="Approve"] > .pf-v6-c-button').should('be.visible')
    cy.get('[data-label="Approve"] > .pf-v6-c-button').click()
    cy.get('#rich-validation-field-deviceAlias').should('be.visible')
  },

  /**
   * Fill the Alias field in the open Approve device modal.
   */
  fillAliasInApproveModal: (alias) => {
    cy.get('#rich-validation-field-deviceAlias').clear()
    cy.get('#rich-validation-field-deviceAlias').type(alias)
    cy.get('#rich-validation-field-deviceAlias').should('have.value', alias)
  },

  /**
   * Assert the validation icon shows error state (red #b1380b).
   * Uses button[aria-label="Validation"] and its SVG color.
   */
  expectValidationIconError: () => {
    cy.get('button[aria-label="Validation"]').should('be.visible')
    cy.get('button[aria-label="Validation"]').find('svg').should('have.attr', 'color', VALIDATION_ERROR_ICON_COLOR)
  },

  /**
   * Close the Approve device modal without approving (Cancel).
   */
  closeApproveDeviceModal: () => {
    cy.contains('Cancel').click()
    cy.get('#rich-validation-field-deviceAlias').should('not.exist')
  },

  /**
   * Approve a device enrollment request
   */
  approveDevice: (deviceName = 'test-device') => {
    common.navigateTo('Devices')
    
    cy.get('h2.pf-v6-c-title.pf-m-3xl').contains('Devices pending approval')
    cy.get('[data-label="Approve"] > .pf-v6-c-button').should('exist')
    cy.get('[data-label="Approve"] > .pf-v6-c-button').should('be.visible')
    cy.get('[data-label="Approve"] > .pf-v6-c-button').click()
    cy.get('#rich-validation-field-deviceAlias').should('be.visible')
    cy.get('#rich-validation-field-deviceAlias').type(deviceName)
    cy.get('#rich-validation-field-deviceAlias').should('have.value', deviceName)
    cy.get('.pf-v6-c-form__actions > .pf-m-primary').should('be.visible')
    cy.get('.pf-v6-c-form__actions > .pf-m-primary').click()
    cy.get('[data-label="Device status"]', { timeout: 500000 }).should('contain', 'Online')
  },

  deviceEvents: (deviceName = 'test-device') => {
    common.navigateTo('Devices')
    cy.wait(1000)
    cy.get('a > .fctl-resource-link__text').contains(deviceName).should('be.visible').click()
    cy.wait(1000)
    cy.get('[id^="pf-tab-events-pf"]').contains('Events').should('be.visible').click()
    cy.wait(1000)
    // Events tab opens with Warning filter: only warning events, no normal/info events
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

  /**
   * Edit a device configuration
   */
  editDevice: (image, currentName = 'test-device', newName = 'test-device-edited') => {
    common.navigateTo('Devices')
    
    cy.get('a > .fctl-resource-link__text').contains(currentName)
    cy.get('.pf-v6-c-table__action > .pf-v6-c-menu-toggle').click()
    cy.wait(1000)
    cy.contains('Edit device configurations').click()
    cy.wait(1000)
    cy.get('#rich-validation-field-deviceAlias').should('be.visible')
    cy.get('#rich-validation-field-deviceAlias').should('have.value', currentName)
    cy.get('#rich-validation-field-deviceAlias').clear()
    cy.get('#rich-validation-field-deviceAlias').type(newName)
    cy.get('span.pf-v6-c-button__text').contains('Next').click()
    cy.get('#textfield-osImage').should('be.visible')
    cy.get('#textfield-osImage').clear()
    cy.get('#textfield-osImage').type(image)
    cy.get('#textfield-osImage').should('have.value', image)
    cy.get('span.pf-v6-c-button__text').contains('Next').click()
    cy.get('span.pf-v6-c-button__text').contains('Next').click()
    cy.get('span.pf-v6-c-button__text').contains('Save').click()
    cy.get('.pf-v6-c-title > .pf-v6-l-grid > .pf-m-6-col-on-md', { timeout: 50000 }).should('contain', newName)
  },

  checkDeviceOutOfDate: (deviceName = 'test-device-edited2') => {
    common.navigateTo('Devices')
    cy.get('a > .fctl-resource-link__text').contains(deviceName).should('be.visible')

    const intervalMs = 5000
    const totalMs = 120000
    const maxAttempts = Math.floor(totalMs / intervalMs) + 1

    const pollForOutOfDate = (attempt) => {
      if (attempt > 0) {
        cy.wait(intervalMs)
      }
      cy.get('[data-label="Update status"]').then(($els) => {
        const found = Cypress.$.makeArray($els).some((el) =>
          el.textContent.includes('Out-of-date'),
        )
        if (found) {
          cy.get('[data-label="Update status"]').contains('Out-of-date').should('be.visible')
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

  /**
   * Decommission a device
   */
  decommissionDevice: () => {
    common.navigateTo('Devices')
    
    cy.get('.pf-v6-c-table__tbody > .pf-v6-c-table__tr > .pf-v6-c-table__check > label > input').should('be.visible')
    cy.get('.pf-v6-c-table__tbody > .pf-v6-c-table__tr > .pf-v6-c-table__check > label > input').click()
    cy.get('#devices-toolbar > :nth-child(1) > .pf-v6-c-toolbar__content-section > :nth-child(3) > .pf-v6-c-button').should('be.visible')
    cy.get('#devices-toolbar > :nth-child(1) > .pf-v6-c-toolbar__content-section > :nth-child(3) > .pf-v6-c-button').click()
    cy.get('.pf-m-danger').should('be.visible')
    cy.get('.pf-m-danger').click()
    cy.get('.pf-v6-c-table__thead > .pf-v6-c-table__tr > .pf-v6-c-table__check > label > input').should('be.visible')
    cy.get('.pf-v6-c-table__thead > .pf-v6-c-table__tr > .pf-v6-c-table__check > label > input').click()
    cy.get('.pf-v6-c-toolbar__group > :nth-child(3) > .pf-v6-c-button').should('be.visible')
    cy.get('.pf-v6-c-toolbar__group > :nth-child(3) > .pf-v6-c-button').click()
    cy.get('.pf-m-danger').should('be.visible')
    cy.get('.pf-m-danger').click()
    cy.get('.pf-v6-c-switch__toggle').should('be.visible')
    cy.get('.pf-v6-c-switch__toggle').click()
  },

  /**
   * Open terminal on a device
   */
  openTerminal: (deviceName = 'test-device') => {
    common.navigateTo('Devices')
    
    cy.get('a > .fctl-resource-link__text').contains(deviceName).should('be.visible')
    cy.get('a > .fctl-resource-link__text').click()
    cy.contains('Terminal').should('be.visible')
    cy.contains('Terminal').click()
    cy.get('.pf-v6-l-bullseye', { timeout: 50000 }).should('be.visible')
    cy.get('.pf-v6-l-bullseye').click()
  },
}
