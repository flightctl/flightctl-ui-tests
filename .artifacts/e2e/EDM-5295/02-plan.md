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
| 4 | Done | Ran local validation and the scoped remote attempt; the target suite was blocked by the remote console environment before the EDM-5295 suite executed. |

## Test Plan Coverage

| Case | Scenario |
|---|---|
| EDM-5295-C1 | Fleet creation with catalog OS and application pinned to a channel/version. |
| EDM-5295-C2 | Per-item update awareness and operator-controlled independent updates. |

## Validation outcome

- Local JavaScript syntax and whitespace checks passed.
- The dedicated remote environment reached the expected enrollment state after
  test-resource cleanup.
- `fleet.cy.js` then stopped in the existing login hook because the remote
  OpenShift console did not expose the Fleet Management perspective. The new
  catalog-inheritance suite did not execute.
