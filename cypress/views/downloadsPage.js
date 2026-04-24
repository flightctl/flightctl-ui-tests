/**
 * Command Line Tools page. Each OS/arch shows two links with the same visible label; the main CLI
 * vs restore builds are distinguished by href. Linux archives are .tar.gz; macOS/Windows
 * use .zip (matches published release assets).
 */
const ARTIFACT_BY_PLATFORM = {
  Mac: {
    x86_64: {
      main: 'flightctl-darwin-amd64.zip',
      restore: 'flightctl-restore-darwin-amd64.zip',
    },
    'ARM 64': {
      main: 'flightctl-darwin-arm64.zip',
      restore: 'flightctl-restore-darwin-arm64.zip',
    },
  },
  Linux: {
    x86_64: {
      main: 'flightctl-linux-amd64.tar.gz',
      restore: 'flightctl-restore-linux-amd64.tar.gz',
    },
    'ARM 64': {
      main: 'flightctl-linux-arm64.tar.gz',
      restore: 'flightctl-restore-linux-arm64.tar.gz',
    },
  },
  Windows: {
    x86_64: {
      main: 'flightctl-windows-amd64.zip',
      restore: 'flightctl-restore-windows-amd64.zip',
    },
    'ARM 64': {
      main: 'flightctl-windows-arm64.zip',
      restore: 'flightctl-restore-windows-arm64.zip',
    },
  },
}

export const downloadsPage = {
  openCommandLineTools() {
    cy.get('button[aria-label="Help menu"]').click().should('be.visible')
    cy.contains('Command Line Tools').click()
    cy.url({ timeout: 30000 }).should('include', 'command-line-tools')
  },

  /** Assert both main flightctl and flightctl-restore links exist with usable http(s) URLs. */
  expectArtifactLinksPresent(platform, arch) {
    const names = ARTIFACT_BY_PLATFORM[platform][arch]
    // ACM/console: nested scroll/clipped panels report overflow-hidden ancestors; Cypress visibility
    // fails until the link is scrolled into view (standalone Flight UI rarely needs this).
    const assertLink = (suffix) => {
      cy.get(`a[href*="${suffix}"]`)
        .first()
        .scrollIntoView()
        .should('be.visible')
        .invoke('attr', 'href')
        .should('match', /^https?:\/\//)
    }
    assertLink(names.main)
    assertLink(names.restore)
  },

  /**
   * For each CLI/restore link on the page, verify the URL is reachable (HEAD, or GET with
   * Range if HEAD is not supported). Does not persist a full file download.
   */
  expectAllArtifactLinksDownloadable() {
    const suffixes = []
    for (const arches of Object.values(ARTIFACT_BY_PLATFORM)) {
      for (const names of Object.values(arches)) {
        suffixes.push(names.main, names.restore)
      }
    }
    suffixes.forEach((suffix) => {
      cy.get(`a[href*="${suffix}"]`)
        .first()
        .scrollIntoView()
        .invoke('attr', 'href')
        .then((href) => {
          cy.request({
            method: 'HEAD',
            url: href,
            timeout: 30000,
            failOnStatusCode: false,
          }).then((headResp) => {
            if (headResp.status === 200) {
              return
            }
            cy.request({
              method: 'GET',
              url: href,
              headers: { Range: 'bytes=0-0' },
              timeout: 30000,
              failOnStatusCode: false,
            }).then((getResp) => {
              expect(
                [200, 206],
                `download probe for ${href}: HEAD ${headResp.status}, GET ${getResp.status}`
              ).to.include(getResp.status)
            })
          })
        })
    })
  },
}
