# Expense Tracker Agent

An intelligent, multimodal expense tracking application powered by [Google ADK](https://github.com/google-adk/adk) and agent-based architecture. Track your expenses using text, photos, PDFs, or voice notes through a Telegram bot interface.

## Features

- **Multimodal Input Support**: Process expenses via:
  - Text messages
  - Photo receipts (OCR-enabled)
  - PDF invoices
  - Voice notes

- **Agentic Architecture**: Distributed processing across specialized agents:
  - **Root Agent**: Orchestrates the expense tracking workflow
  - **Saver Agent**: Persists expense data to the database
  - **Retrieval Agent**: Fetches and searches stored expenses
  - **Visualizer Agent**: Generates expense reports and visualizations

- **Real-time Processing**: Asynchronous handling with artifact tracking
- **Observability**: Built-in tracing and monitoring via Arize and AgentOps
- **Database Persistence**: MongoDB integration for reliable data storage

## Quick Start

### Prerequisites

- Python 3.13 or higher
- MongoDB instance
- Telegram Bot Token
- Google ADK API credentials

### Installation

1. Clone the repository:
```bash
git clone https://github.com/steverahardjo/adk-exp-tracker.git
cd adk-exp-tracker
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -e .
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

Required environment variables:
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
- `MONGODB_URI`: MongoDB connection string
- `GOOGLE_ADK_API_KEY`: Google ADK API credentials
- Additional Arize and observability credentials (optional)

### Running the Application

**Telegram Bot**:
```bash
python telegram-bot.py
```

**Main Application**:
```bash
python main.py
```

## Architecture

### Directory Structure

```
adk-exp_tracker/
├── expense_tracker_agent/        # Core agent implementation
│   ├── agent.py                  # Agent definitions and initialization
│   ├── tool.py                   # Custom tools (MongoDB operations)
│   ├── subagent.py               # Sub-agent implementations
│   ├── prompts.py                # Agent system prompts
│   ├── config.py                 # Configuration management
│   ├── tracing.py                # Observability setup
│   └── agent_typing.py           # Type definitions
├── telegram-bot.py               # Telegram bot interface
├── main.py                       # Main application entry point
└── pyproject.toml                # Project metadata and dependencies
```

### Agent Workflow

1. **Input Reception**: Bot receives user input (text, image, PDF, or voice)
2. **Root Agent Processing**: Orchestrates the processing pipeline
3. **Specialized Processing**: Delegates to appropriate sub-agents
4. **Data Persistence**: Saver agent commits data to MongoDB
5. **Response Generation**: Returns processed results to user

## Development

### Setup Development Environment

```bash
# Install development dependencies
pip install -e ".[dev]"

### Project Configuration

See [dev_exp.md](dev_exp.md) for development notes and architectural decisions.

## Dependencies

Key dependencies include:
- **google-adk**: Agent development kit
- **aiogram**: Telegram bot framework
- **beanie**: MongoDB ODM
- **agentops**: Agent monitoring

For complete dependency list, see [pyproject.toml](pyproject.toml).

## Configuration

The application uses environment-based configuration through `expense_tracker_agent/config.py`. Key settings include:

- Model selection for each agent tier
- MongoDB connection parameters
- API credentials for external services
- Logging and tracing configuration

## API Reference

### Telegram Bot Commands

- `/start`: Initialize the bot and display welcome message
- Send photo: Extract expenses from receipt images
- Send PDF: Process invoice documents
- Send voice/audio: Transcribe and extract expenses from voice notes
- Send text: Submit expense information directly

### Agent Tools

Agents have access to the following tools:
- `mongodb.insert_expense`: Save expense records
- `mongodb.search_expenses`: Query stored expenses
- `mongodb.clear_db`: Database management
- `load_memory`: Access conversation history
- `load_artifacts`: Retrieve generated artifacts
- `subagent.generate_visual`: workaround for subagent "visual-agent" to create a python-based data viz and save it as artifact.

## Observability

The application integrates with multiple observability platforms:

- **AgentOps**: Agent behavior tracking
- **OpenTelemetry**: Distributed tracing

Configure credentials in environment variables to enable monitoring.

## Roadmap
- [ ] Project planning and early conception
- [ ] Familiarization and early usage of Google ADK.
- [ ] Root agent and insert agent implementation
- [ ] MongoTool implementation and function tool interaction with agent.
- [ ] Enable retrieve agent.
- [ ] implementing Viz agent and save to artifact.

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For issues, questions, or suggestions, please open an [GitHub Issue](https://github.com/steverahardjo/adk-exp-tracker/issues).

## Acknowledgments

- [Google ADK](https://github.com/google-adk/adk) for the agent framework
- [aiogram](https://docs.aiogram.dev/) for Telegram integration
- [Beanie](https://beanie-odm.readthedocs.io/) for MongoDB support
