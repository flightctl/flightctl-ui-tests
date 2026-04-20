/**
 * Authorize URL from cypress.config.js only (merge of CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL ||
 * FLIGHTCTL_OAUTH_AUTHORIZE_URL). No OPENSHIFT_HOST / OPENSHIFT_AUTH fallback — those masked
 * `CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL=''` and kept running cy.visit via a URL from OPENSHIFT_*.
 */
const resolveFlightctlAuthorizeUrl = () => {
  return String(
    Cypress.env('flightctlOAuthAuthorizeUrl') || Cypress.env('FLIGHTCTL_OAUTH_AUTHORIZE_URL') || '',
  ).trim()
}

describe('Auth provider login', () => {
  it('authenticates', () => {
    throwIfExplicitAuthorizeUrlIsEmpty()

    const authorizeUrl = String(resolveFlightctlAuthorizeUrl() || '').trim()
    expect(authorizeUrl, authUrlMissingMessage()).not.to.eq('')

    const port = Cypress.env('flightctlCallbackPort') || 18080
    cy.visit(authorizeUrl, { timeout: 120000, retryOnStatusCodeFailure: true })
    // Same IDP interaction as support/commands.js cy.login (kept here so commands.js stays unchanged).
    cy.get('.pf-v6-c-button', { timeout: 120000 })
      .contains('kube:admin')
      .then(($el) => {
        $el[0].click()
      })
    cy.get('#inputUsername').should('exist').should('be.visible')
    cy.get('#inputPassword').should('exist').should('be.visible')
    cy.get('#inputUsername').type(Cypress.env('username'))
    cy.get('#inputPassword').type(Cypress.env('password'))
    cy.get('#inputUsername').should('have.value', Cypress.env('username'))
    cy.get('#inputPassword').should('have.value', Cypress.env('password'))
    // Native click: `cy.click()` waits for the next document `load` after form submit. The
    // device-login success page ("Login successful. Return to CLI.") often does not satisfy
    // that wait while a JS redirect to localhost is pending, so Cypress hangs on "(page load)".
    cy.get('#co-login-button').should('be.visible').then(($btn) => {
      $btn[0].click()
    })
    // Never read document.URL / window.location here — Cypress instruments them and triggers
    // "Timed out waiting for page load" while the OAuth response is still in-flight.
    cy.contains(/Login successful|Return to CLI/i, {
      timeout: 180000,
      includeShadowDom: true,
    })
    cy.get('body').then(($body) => {
      const links = $body[0].getElementsByTagName('a')
      for (let i = 0; i < links.length; i++) {
        const h = links[i].getAttribute('href') || ''
        if (h.includes(`localhost:${port}`)) {
          links[i].click()
          break
        }
      }
    })
    cy.url({ timeout: 180000 }).should('include', `localhost:${port}`)
  })
})

function authUrlMissingMessage() {
  return (
    'Set a Flightctl device authorize URL (full /oauth/authorize?…): ' +
    'export CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL="…" or FLIGHTCTL_OAUTH_AUTHORIZE_URL (see cypress.config.js). ' +
    'This spec does not read OPENSHIFT_HOST / OPENSHIFT_AUTH for the authorize URL.'
  )
}

function authUrlEmptyMessage() {
  return (
    'CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL is set but empty. ' +
    'Use `unset CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL` or set the full device login URL. ' +
    '(If Cypress.env("FLIGHTCTL_OAUTH_AUTHORIZE_URL") is empty, this also triggers.)'
  )
}

/**
 * Fail before cy.* when Cypress exposes an empty `CYPRESS_FLIGHTCTL_OAUTH_AUTHORIZE_URL` as
 * `Cypress.env('FLIGHTCTL_OAUTH_AUTHORIZE_URL') === ''`, so we can show authUrlEmptyMessage instead
 * of the generic missing-URL assertion. Otherwise an empty merge is handled by resolve + expect().
 */
function throwIfExplicitAuthorizeUrlIsEmpty() {
  const injected = Cypress.env('FLIGHTCTL_OAUTH_AUTHORIZE_URL')
  if (injected !== undefined && String(injected).trim() === '') {
    throw new Error(authUrlEmptyMessage())
  }
}
