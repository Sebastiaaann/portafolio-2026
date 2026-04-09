---
name: notebooklm-py
description: >
  A Comprehensive NotebookLM Skill & Unofficial Python API.
  Trigger: When the user asks to integrate, automate, or build AI tools using NotebookLM, or mentions generating podcasts/videos/quizzes from sources programmatically.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- When building AI agent tools that need to research or digest large documents
- When automating research pipelines (importing PDFs, URLs, Google Drive to NotebookLM)
- When generating Audio Overviews (podcasts), videos, quizzes, flashcards, or study guides programmatically
- When you need to batch-download artifacts from NotebookLM
- When working with the `notebooklm-py` Python library or CLI

## Critical Patterns

- **Unofficial API Warning**: This library uses undocumented Google APIs. They can change without notice and rate limits apply.
- **Authentication**: Requires a one-time browser login setup (`notebooklm login`).
- **Python API**: Fully asynchronous. Always use `asyncio` and `NotebookLMClient.from_storage()` within an async context manager.
- **Artifact Generation**: Generation is an asynchronous process. Always call `generate_*()`, then `wait_for_completion()`, before attempting to `download_*()`.
 - **Default export language: Spanish**: Always instruct NotebookLM to respond in Spanish by appending "Responde en español." (or include `language: es` in programmatic prompts). Ensure all exported content is translated to Spanish if returned in another language.

## Code Examples

### Python API Usage

```python
import asyncio
from notebooklm import NotebookLMClient

async def main():
    # Always use the async context manager
    async with await NotebookLMClient.from_storage() as client:
        # Create notebook and add sources
        nb = await client.notebooks.create("Research Notebook")
        await client.sources.add_url(nb.id, "https://example.com", wait=True)

        # Chat with your sources — instrucciones en español por defecto
        result = await client.chat.ask(nb.id, instructions="Resumí en español: Resume el contenido de esta fuente y extraé los puntos clave.", query=None)
        print(result.answer)

        # Generate and download artifacts (también en español)
        status = await client.artifacts.generate_audio(nb.id, instructions="Generá un resumen en español, con tono conversacional")
        
        # MUST wait for completion before downloading
        await client.artifacts.wait_for_completion(nb.id, status.task_id)
        await client.artifacts.download_audio(nb.id, "podcast_es.mp3")

asyncio.run(main())
```

## Commands

```bash
# Basic installation
pip install notebooklm-py

# First-time authentication (opens browser)
notebooklm login

# Create notebook and add sources
notebooklm create "My Research"
notebooklm use <notebook_id>
notebooklm source add "https://en.wikipedia.org/wiki/Artificial_intelligence"

# Generate content
notebooklm generate audio "make it engaging" --wait
notebooklm generate video --style whiteboard --wait
notebooklm generate quiz --difficulty hard

# Download artifacts
notebooklm download audio ./podcast.mp3
notebooklm download quiz --format markdown ./quiz.md
```

## Resources

- **GitHub Repository**: [teng-lin/notebooklm-py](https://github.com/teng-lin/notebooklm-py)
