# E2E Plan — EDM-5295

## Branch

- Branch: `qe/edm-5295-catalog-inheritance-e2e`
- Local base: `c303b2a`
- Publish: not requested

## Tasks

| Task | Status | Description |
|---|---|---|
| 1 | Done | Add isolated catalog fixture setup and cleanup tasks. |
| 2 | Done | Add fleet page-object helpers for catalog selection, review, Catalog tab, and item updates. |
| 3 | Done | Add fleet Cypress coverage for catalog inheritance and independent updates. |
| 4 | Done | Ran the scoped remote validation against the standalone FlightCtl UI; the original catalog-inheritance scenarios passed. |
| 5 | Done | Add and validate a second-fleet Edit Fleet workflow that replaces a manual OS and adds a catalog application. |

## Test Plan Coverage

| Case | Scenario |
|---|---|
| EDM-5295-C1 | Fleet creation with catalog OS and application pinned to a channel/version. |
| EDM-5295-C2 | Per-item update awareness and operator-controlled independent updates. |
| EDM-5295-C3 | Edit an existing fleet to replace its manual OS with a catalog OS and add a catalog application. |

## Validation outcome

- Local JavaScript syntax and whitespace checks passed.
- The dedicated remote environment reached the expected enrollment state after
  test-resource cleanup and the standalone FlightCtl UI route was used.
- `fleet.cy.js` completed with 11 passing, 0 failing, and 0 skipped tests,
  including the second-fleet Edit Fleet scenario.
