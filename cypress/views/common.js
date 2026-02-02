/**
 * Common utilities for test operations
 */
export const common = {
  /**
   * Navigate to a page under Edge Management
   * @param {string} page - The page to navigate to (e.g., 'Devices', 'Fleets', 'Repositories')
   */
  navigateTo: (page) => {
    cy.get('#nav-toggle').should('exist')
    cy.get('#nav-toggle').click()
    cy.contains('Edge Management').click()
    cy.contains(page).click()
    common.selectOrganizationIfNeeded('Default')
  },

  /**
   * Select organization if the selection page appears
   */
  selectOrganizationIfNeeded: (orgName = 'Default', maxRetries = 5, retryDelay = 1000) => {
    const checkForOrgSelection = (attempt = 1) => {
      cy.log(`Checking for organization selection page (attempt ${attempt}/${maxRetries})`)
      
      cy.wait(retryDelay)
      
      cy.get('body').then(($body) => {
        if ($body.text().includes('Select Organization')) {
          cy.log(`Organization selection page detected, selecting ${orgName}`)
          cy.contains(orgName).click()
          cy.contains('button', 'Continue').click()
          cy.get('.pf-v5-c-page', { timeout: 30000 }).should('exist')
        } else if (attempt < maxRetries) {
          cy.log(`Organization selection not found yet, retrying...`)
          checkForOrgSelection(attempt + 1)
        } else {
          cy.log('No organization selection page detected after all retries, continuing...')
        }
      })
    }
    
    checkForOrgSelection()
  },
}
