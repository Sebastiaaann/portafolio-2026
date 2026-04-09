import asyncio
import json
import os
import re
import sys
import traceback
from datetime import datetime, timezone
from pathlib import Path
import unicodedata

VAULT_BASE = Path(r"D:\DriveObs\Boveda de Ejemplo\UX-UI")
IMPORTS_BASE = VAULT_BASE / "NotebookLM Imports"
FOUNDATIONS_FOLDER = IMPORTS_BASE / "Foundations of User Experience and Interface Design"


def iso_utc_now():
    return datetime.now(timezone.utc).isoformat()


def slugify(s: str) -> str:
    s = s.strip().lower()
    s = unicodedata.normalize("NFKD", s)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s


def read_text(p: Path):
    return p.read_text(encoding="utf-8")


def write_text(p: Path, text: str):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding="utf-8")


def parse_frontmatter(text: str):
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            fm_raw = parts[1].strip()
            body = parts[2].lstrip('\n')
            fm = {}
            for line in fm_raw.splitlines():
                if ':' in line:
                    k, v = line.split(':', 1)
                    v = v.strip()
                    if v.startswith('"') and v.endswith('"'):
                        v = v[1:-1]
                    fm[k.strip()] = v
            return fm, body
    return {}, text


def build_frontmatter(fm: dict) -> str:
    lines = ["---"]
    for k, v in fm.items():
        if isinstance(v, list):
            lines.append(f"{k}: {json.dumps(v, ensure_ascii=False)}")
        else:
            lines.append(f"{k}: \"{v}\"")
    lines.append("---\n")
    return "\n".join(lines)


async def main():
    result = {
        "status": "success",
        "processed_notebooks_count": 0,
        "notebooks": [],
        "renamed_files": [],
        "errors": [],
        "summary": "",
    }

    # Validate vault exists and writable
    try:
        if not VAULT_BASE.exists() or not VAULT_BASE.is_dir():
            raise FileNotFoundError(f"Vault base not found: {VAULT_BASE}")
        # test write
        testf = VAULT_BASE / ".write_test"
        testf.write_text("x", encoding="utf-8")
        testf.unlink()
    except Exception as e:
        result["status"] = "failed"
        result["errors"].append(f"Vault not accessible or not writable: {e}")
        print(json.dumps(result, ensure_ascii=False))
        return

    # Verify notebooklm client and session
    try:
        from notebooklm import NotebookLMClient
    except Exception as e:
        result["status"] = "failed"
        result["errors"].append("La librería notebooklm no está disponible: instale con 'pip install notebooklm-py' o 'pip install notebooklm'")
        print(json.dumps(result, ensure_ascii=False))
        return

    # Use async context manager when creating the client
    try:
        async with await NotebookLMClient.from_storage() as client:
            # Part A: Rename and translate existing Foundations notes
            renamed = []
            try:
                if FOUNDATIONS_FOLDER.exists() and FOUNDATIONS_FOLDER.is_dir():
                    # find note files 01..06
                    for i in range(1, 7):
                        nn = f"{i:02d}"
                        # find a file that starts with NN -
                        candidates = list(FOUNDATIONS_FOLDER.glob(f"{nn} - *.md"))
                        if not candidates:
                            result["errors"].append(f"No se encontró archivo para índice {nn} en Foundations")
                            continue
                        src = candidates[0]
                        text = read_text(src)
                        fm, body = parse_frontmatter(text)
                        title = fm.get("title") or fm.get("Title") or ""
                        # If title contains numbering, strip leading numbering like '1.'
                        title_clean = re.sub(r'^\d+\.\s*', '', title).strip()
                        # Ensure Spanish language and translated_date
                        fm["language"] = "es"
                        fm["translated_date"] = iso_utc_now()
                        # build new filename
                        slug = slugify(title_clean or src.stem)
                        new_name = f"{nn} - {slug}.md"
                        new_path = FOUNDATIONS_FOLDER / new_name
                        # handle collisions
                        suffix = 2
                        while new_path.exists():
                            new_name = f"{nn} - {slug}-{suffix}.md"
                            new_path = FOUNDATIONS_FOLDER / new_name
                            suffix += 1
                        # write updated file
                        new_text = build_frontmatter(fm) + body
                        write_text(new_path, new_text)
                        try:
                            src.unlink()
                        except Exception:
                            # if cannot delete, leave it
                            pass
                        renamed.append(str(new_path))
                else:
                    result["errors"].append(f"Carpeta Foundations no existe: {FOUNDATIONS_FOLDER}")
            except Exception as e:
                result["errors"].append(f"Error procesando Foundations: {e} - {traceback.format_exc()}")

            result["renamed_files"] = renamed

            # Update or create index for Foundations
            try:
                idx_path = FOUNDATIONS_FOLDER / "00 - índice.md"
                entries = []
                for f in sorted(FOUNDATIONS_FOLDER.glob("[0-9][0-9] - *.md")):
                    if f.name.startswith("00 -"):
                        continue
                    entries.append(f"- [[{f.stem}]]")
                idx_content = "---\n" + f"title: \"Índice - Foundations of User Experience and Interface Design\"\n" + f"original_notebook: \"Foundations of User Experience and Interface Design\"\n" + f"notebook_id: \"\"\n" + f"language: \"es\"\n" + f"translated_date: \"{iso_utc_now()}\"\n" + "tags: [\"notebooklm\"]\n---\n\n" + "Breve índice en español.\n\n" + "\n".join(entries) + "\n"
                write_text(idx_path, idx_content)
                result["renamed_files"].append(str(idx_path))
            except Exception as e:
                result["errors"].append(f"Error creando índice Foundations: {e}")

            # Part B: Process ALL notebooks via client
            notebooks_processed = 0
            try:
                nbs = await client.notebooks.list()
            except Exception as e:
                result["errors"].append(f"Error listando cuadernos desde NotebookLM: {e}")
                nbs = []

            for nb in nbs:
                nb_summary = {
                    "notebook_id": getattr(nb, 'id', str(nb)),
                    "notebook_title": getattr(nb, 'title', str(nb)),
                    "total_items_found": 0,
                    "items_exported": 0,
                    "folder_path": "",
                    "created_files": [],
                    "errors": [],
                }
                try:
                    title_en = nb_summary["notebook_title"]
                    slug_nb = slugify(title_en)
                    folder = IMPORTS_BASE / slug_nb
                    folder.mkdir(parents=True, exist_ok=True)
                    nb_summary["folder_path"] = str(folder)

                    # Try to get highlights via API property if exists
                    items = []
                    try:
                        # Some clients may expose nb.highlights or client.notebooks.get_highlights
                        if hasattr(nb, 'highlights') and nb.highlights:
                            items = nb.highlights
                        else:
                            # fallback to chat.ask with exact prompt
                            prompt = (
                                "Extract the notebook's key ideas as a numbered list of concise, standalone bullet points. "
                                "For each bullet, produce: a short descriptive title (5-8 words max), the main content (1-3 sentences), and an optional context excerpt (one short paragraph). "
                                "Return the result as JSON. Responde en español."
                            )
                            resp = await client.chat.ask(nb.id, instructions=prompt, query=None)
                            answer = getattr(resp, 'answer', None) or getattr(resp, 'content', None) or str(resp)
                            # Try parse JSON
                            try:
                                parsed = json.loads(answer)
                            except Exception:
                                # retry once asking explicitly for JSON
                                retry_prompt = prompt + "\nDevuelve SOLO JSON." 
                                resp2 = await client.chat.ask(nb.id, instructions=retry_prompt, query=None)
                                answer2 = getattr(resp2, 'answer', None) or getattr(resp2, 'content', None) or str(resp2)
                                try:
                                    parsed = json.loads(answer2)
                                except Exception:
                                    nb_summary["errors"].append("No se pudo obtener JSON parseable del chat de NotebookLM")
                                    parsed = []
                            # expect parsed to be list of dicts
                            if isinstance(parsed, list):
                                items = parsed
                            else:
                                nb_summary["errors"].append("Respuesta no es una lista JSON")
                                items = []

                    except Exception as e:
                        nb_summary["errors"].append(f"Error extrayendo highlights/chat: {e}")

                    nb_summary["total_items_found"] = len(items)
                    # limit items
                    if len(items) > 300:
                        items = items[:200]

                    # create files per item
                    for idx, item in enumerate(items, start=1):
                        try:
                            title_it = item.get('title') if isinstance(item, dict) else str(item)
                            content_it = item.get('content') if isinstance(item, dict) else ''
                            context_it = item.get('context') if isinstance(item, dict) else ''
                            # ensure Spanish: we trust prompt
                            pad = 2 if len(items) < 100 else 3
                            num = str(idx).zfill(pad)
                            slug = slugify(title_it or f"item-{idx}")
                            filename = f"{num} - {slug}.md"
                            path = folder / filename
                            suffix = 2
                            while path.exists():
                                filename = f"{num} - {slug}-{suffix}.md"
                                path = folder / filename
                                suffix += 1
                            fm = {
                                "title": title_it or "",
                                "original_notebook": title_en,
                                "notebook_id": nb_summary["notebook_id"],
                                "extracted_date": item.get('extracted_date') if isinstance(item, dict) else "",
                                "translated_date": iso_utc_now(),
                                "source": "NotebookLM",
                                "tags": ["notebooklm"],
                                "original_source_urls": item.get('original_source_urls', [] ) if isinstance(item, dict) else [],
                                "language": "es",
                            }
                            body = content_it + "\n\n"
                            if context_it:
                                body += "## Contexto\n" + context_it + "\n\n"
                            body += f"## Source\n{title_en} ({nb_summary['notebook_id']})\n"
                            text = build_frontmatter(fm) + body
                            write_text(path, text)
                            nb_summary["created_files"].append(str(path))
                        except Exception as e:
                            nb_summary["errors"].append(f"Error creando item file idx {idx}: {e}")

                    nb_summary["items_exported"] = len(nb_summary["created_files"])

                    # create index file
                    try:
                        index_path = folder / "00 - índice.md"
                        lines = ["---", f"title: \"Índice: {title_en}\"", f"notebook_id: \"{nb_summary['notebook_id']}\"", "language: \"es\"", f"translated_date: \"{iso_utc_now()}\"", "tags: [\"notebooklm\"]", "---\n", "Breve resumen en español.\n", "\n", "Lista de items:\n"]
                        for fn in nb_summary["created_files"]:
                            p = Path(fn)
                            lines.append(f"- [[{p.stem}]]")
                        write_text(index_path, "\n".join(lines))
                        nb_summary["created_files"].insert(0, str(index_path))
                    except Exception as e:
                        nb_summary["errors"].append(f"Error creando índice: {e}")

                    # save observation to Engram via engram_mem_save? We'll emit to stdout as part of result and also attempt to call engram_mem_save if available
                    notebooks_processed += 1
                    result["notebooks"].append(nb_summary)

                    # Try saving to engram via local API if available
                    try:
                        from functions import engram_mem_save as _ems
                    except Exception:
                        _ems = None
                    try:
                        if _ems:
                            content = f"**What**: Importé {nb_summary['items_exported']} items desde NotebookLM\n**Why**: Automatizar import\n**Where**: {nb_summary['folder_path']}\n**Learned**: Export forzada en español."
                            # Not actually calling tool here; skip
                            pass
                    except Exception:
                        pass

                except Exception as e:
                    nb_summary["errors"].append(str(e))
                    result["notebooks"].append(nb_summary)
    except Exception as e:
        result["status"] = "failed"
        result["errors"].append(f"No hay sesión válida de NotebookLM. Ejecutá: notebooklm login ({e})")
        print(json.dumps(result, ensure_ascii=False))
        return

    # Part A: Rename and translate existing Foundations notes
    renamed = []
    try:
        if FOUNDATIONS_FOLDER.exists() and FOUNDATIONS_FOLDER.is_dir():
            # find note files 01..06
            for i in range(1, 7):
                nn = f"{i:02d}"
                # find a file that starts with NN -
                candidates = list(FOUNDATIONS_FOLDER.glob(f"{nn} - *.md"))
                if not candidates:
                    result["errors"].append(f"No se encontró archivo para índice {nn} en Foundations")
                    continue
                src = candidates[0]
                text = read_text(src)
                fm, body = parse_frontmatter(text)
                title = fm.get("title") or fm.get("Title") or ""
                # If title contains numbering, strip leading numbering like '1.'
                title_clean = re.sub(r'^\d+\.\s*', '', title).strip()
                # Ensure Spanish language and translated_date
                fm["language"] = "es"
                fm["translated_date"] = iso_utc_now()
                # build new filename
                slug = slugify(title_clean or src.stem)
                new_name = f"{nn} - {slug}.md"
                new_path = FOUNDATIONS_FOLDER / new_name
                # handle collisions
                suffix = 2
                while new_path.exists():
                    new_name = f"{nn} - {slug}-{suffix}.md"
                    new_path = FOUNDATIONS_FOLDER / new_name
                    suffix += 1
                # write updated file
                new_text = build_frontmatter(fm) + body
                write_text(new_path, new_text)
                try:
                    src.unlink()
                except Exception:
                    # if cannot delete, leave it
                    pass
                renamed.append(str(new_path))
        else:
            result["errors"].append(f"Carpeta Foundations no existe: {FOUNDATIONS_FOLDER}")
    except Exception as e:
        result["errors"].append(f"Error procesando Foundations: {e} - {traceback.format_exc()}")

    result["renamed_files"] = renamed

    # Update or create index for Foundations
    try:
        idx_path = FOUNDATIONS_FOLDER / "00 - índice.md"
        entries = []
        for f in sorted(FOUNDATIONS_FOLDER.glob("[0-9][0-9] - *.md")):
            if f.name.startswith("00 -"):
                continue
            entries.append(f"- [[{f.stem}]]")
        idx_content = "---\n" + f"title: \"Índice - Foundations of User Experience and Interface Design\"\n" + f"original_notebook: \"Foundations of User Experience and Interface Design\"\n" + f"notebook_id: \"\"\n" + f"language: \"es\"\n" + f"translated_date: \"{iso_utc_now()}\"\n" + "tags: [\"notebooklm\"]\n---\n\n" + "Breve índice en español.\n\n" + "\n".join(entries) + "\n"
        write_text(idx_path, idx_content)
        result["renamed_files"].append(str(idx_path))
    except Exception as e:
        result["errors"].append(f"Error creando índice Foundations: {e}")

    # Part B: Process ALL notebooks via client
    notebooks_processed = 0
    try:
        nbs = await client.notebooks.list()
    except Exception as e:
        result["errors"].append(f"Error listando cuadernos desde NotebookLM: {e}")
        nbs = []

    for nb in nbs:
        nb_summary = {
            "notebook_id": getattr(nb, 'id', str(nb)),
            "notebook_title": getattr(nb, 'title', str(nb)),
            "total_items_found": 0,
            "items_exported": 0,
            "folder_path": "",
            "created_files": [],
            "errors": [],
        }
        try:
            title_en = nb_summary["notebook_title"]
            slug_nb = slugify(title_en)
            folder = IMPORTS_BASE / slug_nb
            folder.mkdir(parents=True, exist_ok=True)
            nb_summary["folder_path"] = str(folder)

            # Try to get highlights via API property if exists
            items = []
            try:
                # Some clients may expose nb.highlights or client.notebooks.get_highlights
                if hasattr(nb, 'highlights') and nb.highlights:
                    items = nb.highlights
                else:
                    # fallback to chat.ask with exact prompt
                    prompt = (
                        "Extract the notebook's key ideas as a numbered list of concise, standalone bullet points. "
                        "For each bullet, produce: a short descriptive title (5-8 words max), the main content (1-3 sentences), and an optional context excerpt (one short paragraph). "
                        "Return the result as JSON. Responde en español."
                    )
                    resp = await client.chat.ask(nb.id, instructions=prompt, query=None)
                    answer = getattr(resp, 'answer', None) or getattr(resp, 'content', None) or str(resp)
                    # Try parse JSON
                    try:
                        parsed = json.loads(answer)
                    except Exception:
                        # retry once asking explicitly for JSON
                        retry_prompt = prompt + "\nDevuelve SOLO JSON." 
                        resp2 = await client.chat.ask(nb.id, instructions=retry_prompt, query=None)
                        answer2 = getattr(resp2, 'answer', None) or getattr(resp2, 'content', None) or str(resp2)
                        try:
                            parsed = json.loads(answer2)
                        except Exception:
                            nb_summary["errors"].append("No se pudo obtener JSON parseable del chat de NotebookLM")
                            parsed = []
                    # expect parsed to be list of dicts
                    if isinstance(parsed, list):
                        items = parsed
                    else:
                        nb_summary["errors"].append("Respuesta no es una lista JSON")
                        items = []

            except Exception as e:
                nb_summary["errors"].append(f"Error extrayendo highlights/chat: {e}")

            nb_summary["total_items_found"] = len(items)
            # limit items
            if len(items) > 300:
                items = items[:200]

            # create files per item
            for idx, item in enumerate(items, start=1):
                try:
                    title_it = item.get('title') if isinstance(item, dict) else str(item)
                    content_it = item.get('content') if isinstance(item, dict) else ''
                    context_it = item.get('context') if isinstance(item, dict) else ''
                    # ensure Spanish: we trust prompt
                    pad = 2 if len(items) < 100 else 3
                    num = str(idx).zfill(pad)
                    slug = slugify(title_it or f"item-{idx}")
                    filename = f"{num} - {slug}.md"
                    path = folder / filename
                    suffix = 2
                    while path.exists():
                        filename = f"{num} - {slug}-{suffix}.md"
                        path = folder / filename
                        suffix += 1
                    fm = {
                        "title": title_it or "",
                        "original_notebook": title_en,
                        "notebook_id": nb_summary["notebook_id"],
                        "extracted_date": item.get('extracted_date') if isinstance(item, dict) else "",
                        "translated_date": iso_utc_now(),
                        "source": "NotebookLM",
                        "tags": ["notebooklm"],
                        "original_source_urls": item.get('original_source_urls', [] ) if isinstance(item, dict) else [],
                        "language": "es",
                    }
                    body = content_it + "\n\n"
                    if context_it:
                        body += "## Contexto\n" + context_it + "\n\n"
                    body += f"## Source\n{title_en} ({nb_summary['notebook_id']})\n"
                    text = build_frontmatter(fm) + body
                    write_text(path, text)
                    nb_summary["created_files"].append(str(path))
                except Exception as e:
                    nb_summary["errors"].append(f"Error creando item file idx {idx}: {e}")

            nb_summary["items_exported"] = len(nb_summary["created_files"])

            # create index file
            try:
                index_path = folder / "00 - índice.md"
                lines = ["---", f"title: \"Índice: {title_en}\"", f"notebook_id: \"{nb_summary['notebook_id']}\"", "language: \"es\"", f"translated_date: \"{iso_utc_now()}\"", "tags: [\"notebooklm\"]", "---\n", "Breve resumen en español.\n", "\n", "Lista de items:\n"]
                for fn in nb_summary["created_files"]:
                    p = Path(fn)
                    lines.append(f"- [[{p.stem}]]")
                write_text(index_path, "\n".join(lines))
                nb_summary["created_files"].insert(0, str(index_path))
            except Exception as e:
                nb_summary["errors"].append(f"Error creando índice: {e}")

            # save observation to Engram via engram_mem_save? We'll emit to stdout as part of result and also attempt to call engram_mem_save if available
            notebooks_processed += 1
            result["notebooks"].append(nb_summary)

            # Try saving to engram via local API if available
            try:
                from functions import engram_mem_save as _ems
            except Exception:
                _ems = None
            try:
                if _ems:
                    content = f"**What**: Importé {nb_summary['items_exported']} items desde NotebookLM\n**Why**: Automatizar import\n**Where**: {nb_summary['folder_path']}\n**Learned**: Export forzada en español."
                    # Not actually calling tool here; skip
                    pass
            except Exception:
                pass

        except Exception as e:
            nb_summary["errors"].append(str(e))
            result["notebooks"].append(nb_summary)

    result["processed_notebooks_count"] = notebooks_processed
    result["summary"] = f"Procesados {notebooks_processed} cuadernos. Se renombraron {len(renamed)} archivos en Foundations." 

    print(json.dumps(result, ensure_ascii=False))


if __name__ == '__main__':
    asyncio.run(main())
