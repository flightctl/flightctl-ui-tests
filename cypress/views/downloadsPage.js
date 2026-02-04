/**
 * DownloadsPage object for CLI download operations
 */
export const downloadsPage = {
  /**
   * Download flightctl CLI for a specific platform and architecture
   */
  downloadCliFile: (platform, arch) => {
    let filename
    if (platform === 'Windows') {
      if (arch === 'ARM 64') {
        filename = `${platform}-flightctl-arm64.zip`
      } else {
        filename = `${platform}-flightctl-x86_64.zip`
      }
    } else {
      filename = `${platform}-${arch}-flightctl.tar.gz`
    }

    cy.get('[data-test="help-dropdown-toggle"]').click().should('be.visible')
    cy.contains('Command Line Tools').click()
    cy.log(`Download flightctl for ${platform} for ${arch}`)
    cy.get('.co-external-link').contains(`Download flightctl for ${platform} for ${arch}`)
      .should('have.attr', 'href').then((href) => {
        cy.downloadFile(`${href}`, 'downloads', filename, { timeout: 60000 })
      })
    
    let fullpath = `downloads/${filename}`
    cy.log(`Downloaded file: ${fullpath}`)
    cy.readFile(fullpath).should('exist')
  },
}
