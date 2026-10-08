# EDM-5295: add catalog inheritance fleet coverage

Jira: https://redhat.atlassian.net/browse/EDM-5295

## Summary

Adds Cypress coverage for catalog-backed fleet specifications and editing an
existing fleet into a catalog-backed configuration. The test setup creates
unique temporary OS and application catalog items with stable `1.0.0` and
`1.1.0` versions, and cleans them up after the spec.

## Coverage

- Create a fleet with pinned catalog OS and application references.
- Verify per-item update availability in the Fleet Catalog view.
- Update OS independently while the application remains on its prior version.
- Update the application independently while the OS remains current.
- Create a second fleet with a manual OS, then edit it to use catalog OS and
  application references.

## Implementation

- Spec: `cypress/e2e/fleet.cy.js`
- Page object: `cypress/views/fleetsPage.js`
- Setup and cleanup tasks: `cypress/plugins/catalogTasks.js`
- Product code and CI configuration were not changed.

## Validation

- `fleet.cy.js`: 11 passing, 0 failing, 0 skipped on `sealusa48`.
- Standalone FlightCtl UI route with exactly `test-device` and `test-apps`.
- Validation details: `05-validation-report.md`.
- Proposed Polarion handoff: `05-polarion-matrix.md`.

## Acceptance mapping

- C1: create and save a catalog-backed fleet with pinned versions.
- C2: show and consume independent per-item update availability.
- C3: edit an existing fleet from a manual OS to catalog-backed OS and
  application references.

No Polarion or Jira write was performed by this change.
