# EDM-4051 Cypress compatibility repair

## Summary

The catalog-inheritance UI nests the manual OS image at `osSpec.image` and manual application data at `applications[n].app`. The Cypress page objects now select those controls while retaining selectors for the earlier UI structure.

## Changed paths

- `cypress/views/common.js`: shared OS-image selector with current and legacy variants.
- `cypress/views/fleetsPage.js` and `cypress/e2e/vulnerability.cy.js`: use the shared OS-image selector.
- `cypress/views/devicesPage.js`: support both manual application field layouts, YAML-mode controls, and workload-card containers.

## Rationale

This is a compatibility repair for existing flows only. It deliberately does not add catalog-inheritance behavior coverage; that work belongs in a subsequent feature-coverage change.

## Verification

- `git diff --check`
- `node --check` for every modified JavaScript file
- Installed Cypress version confirmed as 14.5.4

## Remaining validation

Run the affected Cypress specs on the older UI environment first, then the current UI environment. Investigate navigation or repository failures only if they remain after the setup flows succeed.
