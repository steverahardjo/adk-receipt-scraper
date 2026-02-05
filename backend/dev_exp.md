# Development Experience Documentation

This document records changing development requirements, implementation quirks, and practical difficulties encountered while building an agentic system using **Google ADK**.

---

## Requirements

### Interfaces

**Accepted inputs:**

* Text
* Telegram voice messages
* OCR via multimodal models

### Agents

* [ ] Root Agent
* [ ] Save Agent
* [ ] Aggregate Agent
* [ ] Visualizer Agent

---

## UX Improvements (Incremental)

* Persist user preferences in context
* Enable backtracking to prevent double actions (e.g. double-clicks)
* Support artifact creation, persistence, and output for the Visualizer Agent
* A toast when agent is loading.

---

## App Stack & Architecture Considerations

* `load_artifacts` is highly prompt- and command-sensitive; requires strict accuracy
* Introduce local blob storage for non-text artifacts
* Add typing / loading toast for long-running operations
* Decouple application orchestration logic from agent logic

---

## Refactoring: App Logic vs Agent Logic

```mermaid
flowchart TD
    A[Root Agent] --> B{Is message a file artifact?}

    B -- No --> C[Straight Text]
    C --> D[save_agent_func(message, has_artifact=false)]
    D --> E[run_async]
    E --> F[Convert to Expense]
    F --> G[Save Expense]

    B -- Yes --> H[File / Artifact]
    H --> I[save_agent_func(message, has_artifact=true)]
    I --> J[run_async]
    J --> K[Load Artifact]
    K --> L[Convert to Expense]
    L --> M[Modify Expense\n(add blob_filename)]
    M --> N[Save File to Blob Storage]
    N --> O[Save Expense]
```

---

## Notes

* Artifact handling introduces implicit state and ordering constraints.
* File-based flows require stricter error handling and retry logic.
* Visualizer Agent depends on reliable artifact metadata and storage guarantees.
