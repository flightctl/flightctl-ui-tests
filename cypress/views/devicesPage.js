import { common } from './common'

/**
 * DevicesPage object for device management operations
 */
export const devicesPage = {
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
    cy.get('[data-label="Device status"]', { timeout: 50000 }).should('contain', 'Online')
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
