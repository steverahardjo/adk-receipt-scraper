FROM python:3.12-slim-trixie
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
RUN useradd -m app
WORKDIR /app
RUN chown -R app:app /app
ENV PATH="/app/.venv/bin:$PATH"
COPY . .
RUN chown -R app:app /app
USER app
RUN uv sync
CMD ["uv", "run", "main"]

