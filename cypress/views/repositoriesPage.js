import { common } from './common'

/** Validation error icon on invalid fields (matches devicesPage) */
const VALIDATION_ERROR_ICON_COLOR = '#b1380b'

/**
 * Illegal repository name samples (popover rules: charset, start/end alphanumeric, length).
 */
const INVALID_REPOSITORY_NAMES = [
  'INVALID_NAME', // uppercase + underscore
  '-badprefix', // must not start with dash
  'badsuffix-', // must not end with dash
  'my repo', // spaces not allowed
  'repo$money', // only lowercase, digits, - and .
]

/** URL must start with http:// or https:// — these do not */
const INVALID_REPOSITORY_URLS = [
  '123',
  'ftp://example.com/repo',
  'www.example.com/repo',
  '//example.com',
  'http', // not http://
]

const REPOSITORY_URL_ERROR_HELPER_TEXT = 'Enter a valid repository URL'

/**
 * RepositoriesPage object for repository management operations
 */
export const repositoriesPage = {
  /**
   * Open create form and assert each invalid name triggers the first field validation icon.
   */
  assertIllegalRepositoryNameValuesShowValidation: () => {
    repositoriesPage.openCreateRepositoryForm()
    cy.wrap(INVALID_REPOSITORY_NAMES).each((invalidName) => {
      cy.get('#rich-validation-field-name').clear()
      cy.get('#rich-validation-field-name').type(invalidName)
      cy.get('#rich-validation-field-name').should('have.value', invalidName)
      repositoriesPage.expectFirstValidationIconError()
    })
    repositoriesPage.cancelCreateRepositoryForm()
  },

  /**
   * Open create form, set a valid repository name, then assert invalid URLs show URL helper error text.
   */
  assertIllegalRepositoryUrlValuesShowValidation: () => {
    repositoriesPage.openCreateRepositoryForm()
    cy.get('#rich-validation-field-name').clear().type('valid-repo-name')
    cy.get('#rich-validation-field-name').should('have.value', 'valid-repo-name')
    cy.get('#textfield-url').should('be.visible')
    cy.wrap(INVALID_REPOSITORY_URLS).each((invalidUrl) => {
      cy.get('#textfield-url').clear()
      cy.get('#textfield-url').type(invalidUrl)
      cy.get('#textfield-url').should('have.value', invalidUrl)
      cy.get('#textfield-url')
        .closest('.pf-v6-c-form__group')
        .find('.pf-v6-c-helper-text__item-text')
        .should('be.visible')
        .and('contain', REPOSITORY_URL_ERROR_HELPER_TEXT)
    })
    repositoriesPage.cancelCreateRepositoryForm()
  },

  /**
   * Open Create repository from the Repositories list (primary toolbar button).
   */
  openCreateRepositoryForm: () => {
    common.navigateTo('Repositories')
    cy.contains('button.pf-v6-c-button.pf-m-primary', 'Create repository').should('be.visible').click()
    cy.get('#rich-validation-field-name').should('be.visible')
  },

  /**
   * Assert the first validation icon on the page shows error state (#b1380b on nested SVG).
   */
  expectFirstValidationIconError: () => {
    cy.get('button[aria-label="Validation"]').first().should('be.visible')
    cy.get('button[aria-label="Validation"]')
      .first()
      .find('svg')
      .should('have.attr', 'color', VALIDATION_ERROR_ICON_COLOR)
  },

  /**
   * Second validation icon on create-repository form (resource sync name field).
   * Same control as first: button.pf-v6-c-button.pf-m-plain with aria-label="Validation"; SVG color #b1380b.
   */
  expectSecondValidationIconError: () => {
    cy.get('button[aria-label="Validation"]').eq(1).should('be.visible')
    cy.get('button[aria-label="Validation"]')
      .eq(1)
      .find('svg')
      .should('have.attr', 'color', VALIDATION_ERROR_ICON_COLOR)
  },

  /**
   * Resource sync name field on create form (same naming rules as repository name).
   */
  assertIllegalResourceSyncNameValuesShowValidation: () => {
    const resourceSyncNameField = '#rich-validation-field-resourceSyncs\\[0\\]\\.name'
    const validUrl = Cypress.env('repository') || 'https://github.com/flightctl/flightctl-demos'

    repositoriesPage.openCreateRepositoryForm()
    cy.get('#rich-validation-field-name').clear().type('valid-repo-name')
    cy.get('#textfield-url').clear().type(validUrl)
    cy.get('#textfield-url').should('have.value', validUrl)
    cy.get('#use-resource-syncs').then(($cb) => {
      if (!$cb.is(':checked')) {
        cy.wrap($cb).check({ force: true })
      }
    })
    cy.get(resourceSyncNameField).should('be.visible')
    cy.wrap(INVALID_REPOSITORY_NAMES).each((invalidName) => {
      cy.get(resourceSyncNameField).clear()
      cy.get(resourceSyncNameField).type(invalidName)
      cy.get(resourceSyncNameField).should('have.value', invalidName)
      repositoriesPage.expectSecondValidationIconError()
    })
    repositoriesPage.cancelCreateRepositoryForm()
  },

  /**
   * Leave the create-repository form without submitting (Cancel).
   */
  cancelCreateRepositoryForm: () => {
    cy.get('button').contains('Cancel').click()
    cy.get('body').then(($body) => {
      const discardBtn = $body.find('button').filter((_, el) =>
        (el.textContent || '').includes('Discard changes'),
      )
      if (discardBtn.length) {
        cy.wrap(discardBtn.first()).click()
      }
    })
    cy.get('#rich-validation-field-name').should('not.exist')
  },

  /**
   * Create a new repository
   */
  createRepository: (reponame = Cypress.env('repositoryname'), repo = Cypress.env('repository'), revision = Cypress.env('revision'), resource = Cypress.env('resource')) => {
    common.navigateTo('Repositories')
    
    cy.get('.pf-v6-c-toolbar__content-section > :nth-child(2) > .pf-v6-c-button').should('be.visible')
    cy.get('.pf-v6-c-toolbar__content-section > :nth-child(2) > .pf-v6-c-button').click()
    cy.get('#rich-validation-field-name').should('be.visible')
    cy.get('#rich-validation-field-name').type('test-repository')
    cy.get('#rich-validation-field-name').should('have.value', 'test-repository')
    cy.get('#use-resource-syncs').should('be.visible')
    cy.get('#textfield-url').type(repo)
    cy.get('#textfield-url').should('have.value', repo)
    cy.get('.pf-v6-c-form__section').should('be.visible')
    cy.contains('Resource sync name').type('test-resource')
    cy.get('#textfield-resourceSyncs\\[0\\]\\.targetRevision').type(revision)
    cy.get('#textfield-resourceSyncs\\[0\\]\\.path').type(resource)
    cy.get('.pf-v6-c-form__actions > .pf-m-primary').click()
    cy.get('.pf-v6-c-description-list__text > .pf-v6-l-flex > :nth-child(2)', { timeout: 100000 }).should('contain', 'Accessible')
  },

  /**
   * Edit an existing repository
   */
  editRepository: (reponame = Cypress.env('repositoryname'), newyaml = Cypress.env('newyaml'), resourcename = Cypress.env('resourcename'), revision = Cypress.env('revision')) => {
    common.navigateTo('Repositories')
    
    cy.contains(reponame).should('be.visible')
    cy.get('.pf-v6-c-table__action').click()
    cy.get('[data-ouia-component-id="OUIA-Generated-DropdownItem-1"] > .pf-v6-c-menu__item > .pf-v6-c-menu__item-main > .pf-v6-c-menu__item-text').contains('Edit repository').click()
    cy.get('.pf-v6-c-check__body > .pf-m-link').click()
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').should('be.visible')
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').clear()
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').type('test-resource1')
    cy.get('#rich-validation-field-resourceSyncs\\[1\\]\\.name').should('have.value', 'test-resource1')
    cy.get('#textfield-resourceSyncs\\[1\\]\\.targetRevision').type(revision)
    cy.get('#textfield-resourceSyncs\\[1\\]\\.path').clear()
    cy.get('#textfield-resourceSyncs\\[1\\]\\.path').type(newyaml)
    cy.get('.pf-v6-c-form__actions > .pf-m-primary').click()
    cy.get('.pf-v6-c-description-list__text > .pf-v6-l-flex > :nth-child(2)', { timeout: 100000 }).should('contain', 'Accessible')
  },

  /**
   * Delete a repository
   */
  deleteRepository: (reponame = Cypress.env('repositoryname')) => {
    common.navigateTo('Repositories')
    
    cy.get('[data-label="Name"]').should('contain', reponame)
    cy.get('.pf-v6-c-table__tbody > .pf-v6-c-table__tr > .pf-v6-c-table__check > label > input').should('be.visible')
    cy.get('.pf-v6-c-table__tbody > .pf-v6-c-table__tr > .pf-v6-c-table__check > label > input').click()
    cy.contains('Delete repositories').should('be.visible')
    cy.contains('Delete repositories').click()
    cy.get('.pf-m-danger').should('be.visible')
    cy.get('.pf-m-danger').click()
  },
}
