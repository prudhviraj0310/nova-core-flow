<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Project rules

- Design-system logic (token parsing, alias resolution, exporters, audit) lives in `src/lib/ds/engine.ts` as pure functions — keeps it testable and reusable from server code later.
- App state is held in `DSProvider` (`src/lib/ds/store.tsx`) and saved in the browser — no backend yet; swap the provider for Lovable Cloud when persistence/sharing is needed.
- The app shell (nav + header) is `src/components/AppShell.tsx`, rendered from `__root.tsx` around `<Outlet />`.
