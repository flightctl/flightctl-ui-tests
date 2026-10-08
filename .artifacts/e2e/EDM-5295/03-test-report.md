# E2E Test Report — EDM-5295

## Local validation

| Check | Result |
|---|---|
| Changed JavaScript syntax checks | PASS |
| `git diff --check` | PASS |
| Full Cypress suite | Not run |

## Remote validation

The dedicated environment was prepared with the scoped Cypress workflow. Its
stale enrollment requests and mutable test resources were cleared, only
`device5`/`test-device` and `device6`/`test-apps` were deleted and
reprovisioned, and the exact two expected aliases were observed before
launching the browser.

The `fleet.cy.js` run targeted the deployed standalone FlightCtl UI route with
standalone navigation. The final result was 11 passing, 0 failing, and 0
skipped in 2m10s. The run included the EDM-5295 catalog fixture setup, fleet
review assertions, independent OS/application catalog updates, and a
second-fleet Edit Fleet workflow that replaced a manual OS and added a catalog
application.

The run was limited to `fleet.cy.js`; no full-suite run was performed. No
Polarion write was performed because no Polarion connector or case-management
integration was available in this workspace.
