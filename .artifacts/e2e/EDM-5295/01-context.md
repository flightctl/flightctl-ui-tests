# E2E Context — EDM-5295

## Repository

- Repository: `flightctl-ui-tests`
- Feature branch: `qe/edm-5295-catalog-inheritance-e2e`
- Local base: `c303b2a` (`EDM-4051: support catalog wizard field paths`)
- Execution scope: `cypress/e2e/fleet.cy.js`

## Existing patterns

- Cypress configuration uses `testIsolation: false` and `cy.ensureLoggedIn()` once per top-level suite.
- Page objects live under `cypress/views/` and use `common.navigateTo()`.
- Node-side Cypress tasks are registered from `cypress/cypress.config.js`.
- Existing catalog deployment coverage is distinct from fleet-template catalog inheritance.

## Scenario coverage

- Create a fleet with catalog OS and application references pinned to `stable` / `1.0.0`.
- Verify review and Fleet → Catalog display both references.
- Verify per-item update availability and independently update OS and application to `1.1.0`.

## Constraints

- Use only uniquely named temporary catalog items and fleet resources.
- Delete the fleet before deleting temporary catalog items.
- Do not modify platform catalogs, organizations, authentication, host data, product code, or CI configuration.
- Do not run the full Cypress suite or publish the branch from this phase.
