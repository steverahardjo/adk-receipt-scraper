<!-- codedb:begin v0.2.5860 -->
## codedb — code intelligence policy

codedb is a code-intelligence and context tool — not your editor. Reach for the
codedb MCP tools FIRST, before shell search or bulk file reads:

- `codedb_context` to orient on a new task before reading anything else.
- `codedb_explain` for a known symbol (definition body + callers), `codedb_callpath`
  for the shortest A→B chain, `codedb_list_dir` for a folder, `codedb_status` for
  index health.
- Hop tools (`codedb_symbol` / `codedb_callers` / `codedb_search` / `codedb_outline`)
  still dispatch if you already know them — they are not the opening menu.
- Make edits with your own native editor tools. codedb is the navigation layer,
  not the editor.
- If codedb reports no index or a stale one, run `codedb <root> index` and fall
  back to `rg`/`cat` until it completes.

Managed by `codedb codex install` — edits inside this block are overwritten.
Remove it with `codedb codex uninstall`.
<!-- codedb:end -->

## codedb — use it as much as possible (project direction)

This repo is large and split across branches/worktrees. **Use codedb for all code
navigation and orientation. Do not start with `grep`, `find`, `rg`, `cat`, `ls`, or
bulk file reads** — reach for codedb first, and only fall back to shell tools when
codedb has no index or explicitly cannot answer.

### Which tool, when

| Question | Use |
|---|---|
| "Where do I start on this task?" / unfamiliar area | `codedb_context` (hybrid retrieval, task-shaped) |
| "What does this function do / who calls it?" | `codedb_explain <name>` |
| "How does A reach B?" | `codedb_callpath <from> <to>` |
| "What's in this folder?" | `codedb_list_dir <path>` |
| "Is the index fresh?" | `codedb_status` |
| Know the symbol/file already | `codedb_explain` / `codedb_list_dir` (hop tools if already known) |

Prefer one-shot calls (`codedb_context`, `codedb_explain`) over repeated narrow
searches. If retrieval stops converging, stop rephrasing: find the exact
identifier (`codedb_explain` / `symbol`) and pull callers, or re-orient with
`codedb_context`.

### CLI fallback (when MCP tools are unavailable)

Run from the repo root:

```
codedb status            # index health
codedb reindex           # rebuild after large changes
codedb tree              # file tree with languages + symbol counts
codedb outline <path>    # symbols in a file
codedb explain <name>    # definition body + callers
codedb callers <name>    # call sites
codedb callpath A B      # shortest resolved call chain
codedb context <task...> # task orientation bundle
codedb deps <path>       # dependency graph
codedb hot               # recently modified files
```

### This repo's map

- **Product app (active):** `mobile_frontend/tauri-app` — SvelteKit (Svelte 5 runes,
  SPA) + Tauri 2. Frontend in `src/lib/features/*`, routes in `src/routes/*`,
  Rust in `src-tauri/src/*` (`commands.rs`, `qris.rs`, `db.rs`).
- **Archived:** `web_frontend` (React/TanStack Start) lives only on the `frontend`
  branch; it is **not** on the current working branch. Do not reintroduce it.
- Docs: `mobile_frontend/PROJECT.md` (mobile design), `mobile_frontend/tauri-app/BACKEND_API.md`
  (API contract).

### Index freshness & multiple worktrees

- codedb indexes **per root path**. The default index is for the current working
  directory and reflects the checked-out branch only.
- Working in another worktree or branch? Point codedb at that root:
  `codedb <path> reindex` then `codedb <path> context "<task>"`.
- After pulling, switching branches, or large edits, run `codedb reindex` before
  trusting results. If results look stale, check `codedb_status` first.
