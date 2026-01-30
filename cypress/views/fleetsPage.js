import { common } from './common'

/**
 * FleetsPage object for fleet management operations
 */
export const fleetsPage = {
  /**
   * Create a new fleet
   */
  createFleet: (img = Cypress.env('image'), fleetname = Cypress.env('fleetname')) => {
    common.navigateTo('Fleets')
    
    cy.get(':nth-child(2) > .pf-v5-l-split > :nth-child(1) > .pf-v5-c-button').should('exist')
    cy.get(':nth-child(2) > .pf-v5-l-split > :nth-child(1) > .pf-v5-c-button').should('be.visible')
    cy.get(':nth-child(2) > .pf-v5-l-split > :nth-child(1) > .pf-v5-c-button').click()
    cy.get('#rich-validation-field-name').should('be.visible')
    cy.get('#rich-validation-field-name').type(fleetname)
    cy.get('#rich-validation-field-name').should('have.value', 'test-fleet')
    cy.get('.pf-v5-l-stack__item > .pf-v5-c-label-group > .pf-v5-c-label-group__main > .pf-v5-c-label-group__list').click()
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('#textfield-osImage').should('be.visible')
    cy.get('#textfield-osImage').type(img)
    cy.get('#textfield-osImage').should('have.value', img)
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
  },

  /**
   * Edit an existing fleet
   */
  editFleet: (fleetname = Cypress.env('fleetname'), img1 = Cypress.env('newimage')) => {
    common.navigateTo('Fleets')
    
    cy.get('[data-label="Name"]').contains(fleetname)
    cy.get('.pf-v5-c-table__action > .pf-v5-c-menu-toggle').click()
    cy.get('td.pf-v5-c-table__td').then($cells => cy.wrap($cells.eq(-1)))
    cy.get('.pf-v5-c-table__action > .pf-v5-c-menu-toggle').should('be.visible')
    cy.get('[data-ouia-component-id="OUIA-Generated-DropdownItem-2"] > .pf-v5-c-menu__item > .pf-v5-c-menu__item-main > .pf-v5-c-menu__item-text').click()
    cy.get(':nth-child(1) > .pf-v5-c-form__group-label > .pf-v5-c-form__label > .pf-v5-c-form__label-text').should('contain', 'Fleet name')
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('#textfield-osImage').should('be.visible')
    cy.get('#textfield-osImage').clear()
    cy.get('#textfield-osImage').type(img1)
    cy.get('#textfield-osImage').should('have.value', img1)
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('.pf-v5-c-title').should('contain', fleetname)
  },

  /**
   * Delete a fleet
   */
  deleteFleet: (fleetname = Cypress.env('fleetname')) => {
    common.navigateTo('Fleets')
    
    cy.get('[data-label="Name"]').contains(fleetname)
    cy.get('.pf-v5-c-table__tbody > .pf-v5-c-table__tr > .pf-v5-c-table__check > label > input').click()
    cy.get('button.pf-v5-c-button.pf-m-secondary').contains('Delete fleets').should('be.visible')
    cy.get('button.pf-v5-c-button.pf-m-secondary').contains('Delete fleets').click()
    cy.get('.pf-m-danger').should('be.visible')
    cy.get('.pf-m-danger').click()
  },

  /**
   * Import a fleet from repository
   */
  importFleet: (repo = Cypress.env('repository'), fleetname = Cypress.env('fleetname'), resource = Cypress.env('resource'), resourcename = Cypress.env('resourcename'), revision = Cypress.env('revision')) => {
    common.navigateTo('Fleets')
    
    cy.get(':nth-child(2) > .pf-v5-l-split > :nth-child(2) > .pf-v5-c-button').should('exist')
    cy.get(':nth-child(2) > .pf-v5-l-split > :nth-child(2) > .pf-v5-c-button').should('be.visible')
    cy.get(':nth-child(2) > .pf-v5-l-split > :nth-child(2) > .pf-v5-c-button').click()
    cy.get('#rich-validation-field-name').type(fleetname)
    cy.get('#textfield-url').type(repo)
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('#rich-validation-field-resourceSyncs\\[0\\]\\.name').clear()
    cy.get('#rich-validation-field-resourceSyncs\\[0\\]\\.name').type('test-resource')
    cy.get('#textfield-resourceSyncs\\[0\\]\\.targetRevision').clear()
    cy.get('#textfield-resourceSyncs\\[0\\]\\.targetRevision').type(revision)
    cy.get('#textfield-resourceSyncs\\[0\\]\\.path').clear()
    cy.get('#textfield-resourceSyncs\\[0\\]\\.path').type(resourcename)
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').should('be.visible')
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('.pf-v5-c-wizard__footer > .pf-m-primary').click()
    cy.get('td[data-label="Status"]', { timeout: 1000000 }).should('contain', 'Valid')
  },
}
