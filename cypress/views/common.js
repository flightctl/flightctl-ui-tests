/**
 * Common utilities for test operations
 */

/** True after org selection was handled or confirmed absent — only run once per spec (first navigateTo). */
let organizationSelectionHandled = false

export const common = {
  /**
   * Navigate to a page (supports both ACM multi-level nav and flat nav).
   * @param {string} page - The page to navigate to (e.g., 'Devices', 'Fleets', 'Repositories')
   */
  navigateTo: (page) => {
    /** Standalone: data-testid + id on masthead toggle; ACM may use #nav-toggle only */
    const navToggle = '[data-testid="nav-toggle"], #page-toggle-button, #nav-toggle'

    if (Cypress.env('useAcmNavigation')) {
      const acmSidebar = '.pf-v6-c-page__sidebar'
      cy.get(navToggle, { timeout: 30000 }).should('exist')
      // Only open the sidebar if it's collapsed (clicking when open would close it)
      cy.get('body').then(($body) => {
        const sidebarExpanded =
          $body.find('.pf-v6-c-page__sidebar.pf-m-expanded').length > 0 ||
          $body.find(navToggle).attr('aria-expanded') === 'true'
        if (!sidebarExpanded) {
          cy.get(navToggle).first().click()
        }
      })
      cy.get(acmSidebar, { timeout: 30000 }).should('be.visible')
      cy.wait(1000)
      // Re-query on click: wrap($btn) can fail if the nav re-renders after sidebar opens.
      cy.contains('button', 'Edge Management', { timeout: 30000 })
        .should('be.visible')
        .then(($btn) => {
          if ($btn.attr('aria-expanded') === 'true') {
            return
          }
          cy.contains('button', 'Edge Management').should('be.visible').click()
        })
      cy.get(acmSidebar).contains(page).click()
      common.selectOrganizationIfNeeded('Default')
    } else {
      const sidebar = '.pf-v6-c-page__sidebar'
      common.selectOrganizationIfNeeded('Default')
      cy.get('[data-testid="nav-toggle"], #page-toggle-button', { timeout: 30000 }).should('exist')
      cy.get('body').then(($body) => {
        const toggle = $body.find('[data-testid="nav-toggle"], #page-toggle-button').first()
        const sidebarExpanded = toggle.attr('aria-expanded') === 'true'
        if (!sidebarExpanded) {
          cy.get('[data-testid="nav-toggle"], #page-toggle-button').first().click()
        }
      })
      cy.get(sidebar).contains(page).click()
    }
    
  },

  /**
   * Select organization if the selection page appears.
   * Runs only the first time in a spec (first `navigateTo`); later calls are no-ops.
   */
  selectOrganizationIfNeeded: (orgName = 'Default', maxRetries = 10, retryDelay = 1000) => {
    if (organizationSelectionHandled) {
      cy.log('Organization selection already handled this run, skipping')
      return
    }

    const markHandled = () => {
      organizationSelectionHandled = true
    }

    const checkForOrgSelection = (attempt = 1) => {
      cy.log(`Checking for organization selection page (attempt ${attempt}/${maxRetries})`)

      cy.wait(retryDelay)

      cy.get('body').then(($body) => {
        if ($body.text().includes('Select Organization')) {
          cy.log(`Organization selection page detected, selecting ${orgName}`)
          cy.contains(orgName).click()
          cy.contains('button', 'Continue').click()
          cy.get('.pf-v6-c-page', { timeout: 30000 }).should('exist')
          cy.then(markHandled)
        } else if (attempt < maxRetries) {
          cy.log(`Organization selection not found yet, retrying...`)
          checkForOrgSelection(attempt + 1)
        } else {
          cy.log('No organization selection page detected after all retries, continuing...')
          markHandled()
        }
      })
    }

    checkForOrgSelection()
  },
}
