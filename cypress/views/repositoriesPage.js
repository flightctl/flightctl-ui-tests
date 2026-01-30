import { common } from './common'

/**
 * RepositoriesPage object for repository management operations
 */
export const repositoriesPage = {
  /**
   * Create a new repository
   */
  createRepository: (reponame = Cypress.env('repositoryname'), repo = Cypress.env('repository'), revision = Cypress.env('revision'), resource = Cypress.env('resource')) => {
    common.navigateTo('Repositories')
    
    cy.get('.pf-v5-c-toolbar__content-section > :nth-child(2) > .pf-v5-c-button').should('be.visible')
    cy.get('.pf-v5-c-toolbar__content-section > :nth-child(2) > .pf-v5-c-button').click()
    cy.get('#rich-validation-field-name').should('be.visible')
    cy.get('#rich-validation-field-name').type('test-repository')
    cy.get('#rich-validation-field-name').should('have.value', 'test-repository')
    cy.get('#use-resource-syncs').should('be.visible')
    cy.get('#textfield-url').type(repo)
    cy.get('#textfield-url').should('have.value', repo)
    cy.get('.pf-v5-c-form__section').should('be.visible')
    cy.contains('Resource sync name').type('test-resource')
    cy.get('#textfield-resourceSyncs\\[0\\]\\.targetRevision').type(revision)
    cy.get('#textfield-resourceSyncs\\[0\\]\\.path').type(resource)
    cy.get('.pf-v5-c-form__actions > .pf-m-primary').click()
    cy.get('.pf-v5-c-description-list__text > .pf-v5-l-flex > :nth-child(2)', { timeout: 100000 }).should('contain', 'Accessible')
  },

  /**
   * Edit an existing repository
   */
  editRepository: (reponame = Cypress.env('repositoryname'), newyaml = Cypress.env('newyaml'), resourcename = Cypress.env('resourcename'), revision = Cypress.env('revision')) => {
    common.navigateTo('Repositories')
    
    cy.contains(reponame).should('be.visible')
    cy.get('.pf-v5-c-table__action').click()
    cy.get('[data-ouia-component-id="OUIA-Generated-DropdownItem-1"] > .pf-v5-c-menu__item > .pf-v5-c-menu__item-main > .pf-v5-c-menu__item-text').contains('Edit repository').click()
    cy.get('.pf-v5-c-check__body > .pf-m-link').click()
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').should('be.visible')
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').clear()
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').type('test-resource1')
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').should('have.value', 'test-resource1')
    cy.get('#textfield-resourceSyncs\\[1\\]\\.targetRevision').type(revision)
    cy.get('#textfield-resourceSyncs\\[1\\]\\.path').clear()
    cy.get('#textfield-resourceSyncs\\[1\\]\\.path').type(newyaml)
    cy.get('.pf-v5-c-form__actions > .pf-m-primary').click()
    cy.get('.pf-v5-c-description-list__text > .pf-v5-l-flex > :nth-child(2)', { timeout: 100000 }).should('contain', 'Accessible')
  },

  /**
   * Delete a repository
   */
  deleteRepository: (reponame = Cypress.env('repositoryname')) => {
    common.navigateTo('Repositories')
    
    cy.get('[data-label="Name"]').should('contain', reponame)
    cy.get('.pf-v5-c-table__tbody > .pf-v5-c-table__tr > .pf-v5-c-table__check > label > input').should('be.visible')
    cy.get('.pf-v5-c-table__tbody > .pf-v5-c-table__tr > .pf-v5-c-table__check > label > input').click()
    cy.contains('Delete repositories').should('be.visible')
    cy.contains('Delete repositories').click()
    cy.get('.pf-m-danger').should('be.visible')
    cy.get('.pf-m-danger').click()
  },
}
