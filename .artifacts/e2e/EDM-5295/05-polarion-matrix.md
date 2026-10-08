# Proposed Polarion Matrix — EDM-5295

Polarion case IDs are intentionally left unassigned. No Polarion connector was
available in this workspace, so this document is a handoff matrix rather than
an external write.

| Proposed case | Priority | Coverage | Expected result | Traceability |
|---|---|---|---|---|
| Create fleet with catalog OS and application references | P0 | Create a fleet template; select an OS catalog item and an application catalog item; pin both to `stable` / `1.0.0`; review and save. | Review shows both catalog references with the selected channel/version, and the saved fleet Catalog tab lists both installed items. | EDM-5295, EDM-4051, UI PR #815 |
| Show per-item update availability | P0 | With OS and application at `1.0.0`, publish/use `1.1.0` for each item and inspect the fleet Catalog tab. | Each item independently shows update availability; availability is not represented only by an aggregate banner. | EDM-5295 |
| Update OS without updating application | P0 | Update only the OS item to `1.1.0`. | OS shows `1.1.0` with no update action; application remains at `1.0.0` and still shows update availability. | EDM-5295 |
| Update application without updating OS | P0 | From the prior state, update only the application to `1.1.0`. | Application shows `1.1.0` with no update action; OS remains independently current and no aggregate update state masks either item. | EDM-5295 |
