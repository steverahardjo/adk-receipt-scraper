# Development Experience Documentation
This docs is created to document changing dev requirement, certain quirks, and difficulties I faced
in implementing agentic system using Google ADK

## Requirement
Interface used
Accepted input:
- Text
- Voicemail from telegram
- OCR using a multimodal models

4 different agents:
[x] Root agent
[x] Save agent
[x] Aggregate agent
[ ] Visualizer agent

Tiny improvement that can help UX:
- Saving user preference into the context
- Enable backtrack to avoid double click
- Artifact creation, saving, and output for visualizer

App Stack & feature change consideration:
- Change third-party noSQLdb connection through beanie with sqlLite and ADK instance's `DatabaseSessionService`
- Load_artifacts are very prompt and command sensitive, accuracy is needed
- Add a local blob storage for non-text file format
- Add a typing toast for loading.
- Decouple app logic with the agent logic. 


