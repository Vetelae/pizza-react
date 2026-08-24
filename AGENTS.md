# Frontend Project Instructions

## Stack

- React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, Zustand, Axios, React Router, React Hook Form, SignalR, Sonner, React Icons, and Embla Carousel.

## Architecture

- Follow the existing folders: `pages`, `components`, `hooks`, `api`, `store`, `types`, and `utils`.
- HTTP data flows from page/component → feature hook → API service → shared Axios client.
- Pages may orchestrate queries, mutations, notifications, local state, and feature components.
- Keep presentational components focused on rendering data and emitting callbacks.
- Extend existing components, hooks, services, types, and utilities before adding another pattern.
- Keep changes small and do not modify or reformat unrelated code.

## Imports and formatting

- Use `@/` for cross-feature imports; relative imports are acceptable within the same feature.
- Use `import type` for type-only imports.
- Match the formatting of the file being edited; both semicolon styles currently exist.
- Preserve existing names and exports unless changing them is necessary.

## React and forms

- Use functional components, hooks, and typed props.
- Use local state for component-specific UI such as selections, overlays, filters, and feedback.
- Prefer calculations or `useMemo` over synchronized or duplicated state.
- Do not copy query data into local state except for editable snapshots or another clear reason.
- Use React Hook Form for nontrivial forms and type their values.
- Reset forms when their source record or modal lifecycle requires it.
- Show validation and submission errors and disable submission while pending.
- Extract shared UI or behavior when it is genuinely reused or difficult to maintain inline.

## State management

- Use TanStack Query for cart contents, profiles, menu data, categories, news, and orders.
- Use Zustand only for shared client state needed by unrelated components.
- `authStore` owns persisted authentication, identity, refresh state, authorization, and login-panel state.
- `cartStore` owns cart-panel visibility, not cart contents.
- Prefer Zustand selectors when a component needs only specific fields.
- Do not add server data to Zustand or introduce another global store unnecessarily.
- Authentication fields may remain duplicated where current Axios and routing consumers require them.

## TanStack Query

- Put queries and mutations in `src/hooks`; put HTTP calls in `src/api`.
- Type query results, mutation inputs, and explicit cache writes.
- Use `enabled` for queries requiring valid authentication, IDs, or filters.
- Update or invalidate every affected cache after mutations.
- Use `setQueryData` for authoritative returned data and invalidation for related lists or summaries.
- Cache writes must match the query’s declared response type.
- Preserve each feature’s existing query keys; update all consumers if a key changes.
- Provide appropriate loading, error, empty, pending, and retry states.
- Handle secondary-query failures when they prevent the screen from functioning.

## Real-time orders

- Keep SignalR lifecycle and event handling in dedicated hooks.
- Obtain hub tokens through the existing authentication helper.
- Treat TanStack Query as the authoritative cache.
- Apply real-time events to Query caches and reconcile them through invalidation or refetching.
- Preserve reconnect, polling, focus, visibility, online, and pre-snapshot event handling.

## API and authentication

- Use `src/api/axiosClient.ts` for HTTP calls.
- Keep services grouped under `public`, `user`, and `admin`.
- Reuse DTOs and domain types from `src/types`.
- Keep HTTP calls out of pages and presentational components.
- Use `skipAuth` for endpoints that must bypass authentication.
- Preserve centralized token attachment, refresh queuing, retry, and auth clearing.
- Anonymous cart session IDs belong in the cart API; cart contents remain Query state.

## Routing

- Declare routes centrally in `src/App.tsx`.
- Put route-level screens in `src/pages`.
- Keep admin screens nested under `/admin` and `AdminLayout`.
- Use the existing protected-route and `Outlet` patterns.
- Update document-title mappings when routes change.
- Use URL parameters for resource IDs and search parameters for shareable filters or pagination.

## Styling and UI

- Use Tailwind CSS v4 and the theme tokens in `src/index.css`.
- Do not base new styling on the unused starter `src/App.css`.
- Preserve light customer surfaces, dark admin/profile surfaces, and orange accents.
- Match the surrounding feature’s spacing, typography, forms, buttons, tables, and feedback.
- Support mobile, tablet, and desktop layouts without page-level horizontal overflow.
- Reuse existing domain components and dialogs before creating duplicates.
- Use Sonner for action-level notifications and inline feedback for contextual errors.
- Preserve dialog semantics, focus trapping, focus restoration, Escape handling, scroll locking, portals, and reduced-motion behavior.

## Workflow

- Read all affected pages, components, hooks, services, types, stores, routes, and cache consumers first.
- Inspect and preserve unrelated working-tree changes.
- Ask only when ambiguity would materially change the implementation.
- Do not add dependencies or introduce new architectural patterns unless required.
- Run `npm run lint` and `npm run build` when appropriate; no automated test suite currently exists.
- Report changes, modified files, verification results, assumptions, limitations, and manual steps.
- Do not create commits or branches unless explicitly requested.