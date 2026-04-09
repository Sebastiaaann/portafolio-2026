import asyncio
import json
import os
import re
from datetime import datetime

PROMPT = (
    "Extract the notebook's key ideas as a numbered list of concise, standalone bullet points. For each bullet, produce: a short descriptive title (5-8 words max), the main content (1-3 sentences), and an optional context excerpt (one short paragraph). Return the result as JSON: an array of objects with keys `title`, `content`, `context` (context optional). If you cannot return JSON on the first attempt, reply with plain text bullets and then re-run asking explicitly for JSON. Do not include extra commentary."
)
NOTEBOOK_ID = "ea602a68-bdd0-4526-9626-106c7fca1adc"
NOTEBOOK_TITLE = "Foundations of User Experience and Interface Design"
DEST_FOLDER = "D:\\DriveObs\\Boveda de Ejemplo\\UX-UI\\NotebookLM Imports\\Foundations of User Experience and Interface Design"
MAX_ITEMS_FALLBACK = 200


def slugify(s):
    import unicodedata
    s = str(s or '')
    s = unicodedata.normalize('NFKD', s)
    s = s.encode('ascii', 'ignore').decode('ascii')
    s = s.lower()
    s = re.sub(r"[^a-z0-9]+", '-', s)
    s = re.sub(r"-+", '-', s)
    s = s.strip('-')
    if not s:
        s = 'item'
    return s


def unique_path(base_dir, name):
    path = os.path.join(base_dir, name)
    if not os.path.exists(path):
        return path
    i = 2
    base, ext = os.path.splitext(name)
    while True:
        candidate = f"{base}-{i}{ext}"
        candidate_path = os.path.join(base_dir, candidate)
        if not os.path.exists(candidate_path):
            return candidate_path
        i += 1


def make_index(entries, dest, notebook_title, notebook_id):
    base = '00 - index.md'
    path = os.path.join(dest, base)
    if os.path.exists(path):
        i = 2
        while True:
            candidate = f"00 - index-{i}.md"
            candidate_path = os.path.join(dest, candidate)
            if not os.path.exists(candidate_path):
                path = candidate_path
                break
            i += 1
    # build index content
    lines = []
    lines.append('---')
    lines.append(f'title: "Index - {notebook_title}"')
    lines.append('---')
    lines.append('')
    # 3-5 line summary
    lines.append('Resumen:')
    lines.append('Este conjunto de notas contiene las ideas clave extraídas del cuaderno importado desde NotebookLM.')
    lines.append('Cada archivo corresponde a un ítem destacado con contenido y contexto extraído.')
    lines.append('No se descargaron adjuntos ni imágenes.')
    lines.append('')
    lines.append(f'Número de ítems: {len(entries)}')
    lines.append('')
    lines.append('Ítems:')
    for p in entries:
        name = os.path.basename(p)
        titlelink = name.replace('.md', '')
        lines.append(f'- [[{titlelink}]]')
    with open(path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(lines))
    return path


def try_parse_json(s):
    try:
        parsed = json.loads(s)
        if isinstance(parsed, list):
            return parsed
        if isinstance(parsed, dict) and 'items' in parsed and isinstance(parsed['items'], list):
            return parsed['items']
    except Exception:
        return None


async def main():
    errors = []
    try:
        from notebooklm import NotebookLMClient
    except Exception as e:
        print(json.dumps({
            'status': 'failed',
            'notebook_id': NOTEBOOK_ID,
            'total_items_found': 0,
            'items_exported': 0,
            'created_files': [],
            'index_file': '',
            'errors': [f'notebooklm-py import error: {e}'],
        }))
        return

    async with await NotebookLMClient.from_storage() as client:
        resp = await client.chat.ask(NOTEBOOK_ID, PROMPT)
        text = None
        for attr in ("answer", "answer_text", "text", "content", "response", "message"):
            if hasattr(resp, attr):
                val = getattr(resp, attr)
                if isinstance(val, str) and val.strip():
                    text = val
                    break
        if text is None:
            try:
                d = dict(resp)
                for k in d:
                    if isinstance(d[k], str) and len(d[k]) > 0:
                        text = d[k]
                        break
            except Exception:
                text = str(resp)

        items = try_parse_json(text or '')
        if items is None:
            retry_prompt = 'Please reformat the previous answer as JSON: [{"title": "...", "content": "...", "context": "..."}, ...]'
            resp2 = await client.chat.ask(NOTEBOOK_ID, retry_prompt)
            text2 = None
            for attr in ("answer", "answer_text", "text", "content", "response", "message"):
                if hasattr(resp2, attr):
                    val = getattr(resp2, attr)
                    if isinstance(val, str) and val.strip():
                        text2 = val
                        break
            if text2 is None:
                try:
                    d = dict(resp2)
                    for k in d:
                        if isinstance(d[k], str) and len(d[k]) > 0:
                            text2 = d[k]
                            break
                except Exception:
                    text2 = str(resp2)
            items = try_parse_json(text2 or '')
            if items is None:
                errors.append('Could not obtain structured JSON from NotebookLM after two attempts')
                os.makedirs(DEST_FOLDER, exist_ok=True)
                index_path = make_index([], DEST_FOLDER, NOTEBOOK_TITLE, NOTEBOOK_ID)
                print(json.dumps({
                    'status': 'failed',
                    'notebook_id': NOTEBOOK_ID,
                    'total_items_found': 0,
                    'items_exported': 0,
                    'created_files': [],
                    'index_file': index_path,
                    'errors': errors,
                }))
                return

        total_found = len(items)
        if total_found > 300:
            items = items[:MAX_ITEMS_FALLBACK]

        os.makedirs(DEST_FOLDER, exist_ok=True)
        created = []
        norm = []
        for it in items:
            if isinstance(it, dict):
                title = it.get('title') or it.get('heading') or it.get('name') or ''
                content = it.get('content') or it.get('body') or it.get('text') or ''
                context = it.get('context') or it.get('excerpt') or None
                page_id = it.get('page_id') or it.get('source') or None
                # original source urls if present
                src_urls = None
                for k in ('original_source_urls', 'source_urls', 'urls', 'links'):
                    if k in it and isinstance(it[k], list):
                        src_urls = it[k]
                        break
                norm.append({'title': title, 'content': content, 'context': context, 'page_id': page_id, 'source_urls': src_urls})
            else:
                norm.append({'title': str(it)[:50], 'content': str(it), 'context': None, 'page_id': None, 'source_urls': None})

        n = len(norm)
        digits = 2 if n < 100 else 3
        pad = lambda i: str(i + 1).zfill(digits)

        for idx, it in enumerate(norm):
            num = pad(idx)
            slug = slugify(it.get('title') or f'item-{num}')
            filename = f"{num} - {slug}.md"
            path = unique_path(DEST_FOLDER, filename)
            # frontmatter
            extracted_date = datetime.utcnow().isoformat() + 'Z'
            front = []
            front.append('---')
            front.append(f'title: "{(it.get("title") or "").replace("\"", "\\\"")}"')
            front.append(f'original_notebook: "{NOTEBOOK_TITLE}"')
            front.append(f'notebook_id: "{NOTEBOOK_ID}"')
            front.append(f'extracted_date: "{extracted_date}"')
            front.append('source: "NotebookLM"')
            front.append('tags: ["notebooklm"]')
            # original_source_urls
            srcs = it.get('source_urls') or []
            if srcs:
                front.append('original_source_urls:')
                for u in srcs:
                    front.append(f'  - "{u}"')
            else:
                front.append('original_source_urls: []')
            front.append('---')
            # body
            body = (it.get('content') or '').strip()
            context = it.get('context') or ''
            source_section = f"{NOTEBOOK_TITLE} ({NOTEBOOK_ID})"
            if it.get('page_id'):
                source_section += f" — page_id: {it.get('page_id')}"
            with open(path, 'w', encoding='utf-8') as f:
                f.write('\n'.join(front) + '\n\n')
                f.write(body + '\n\n')
                f.write('## Contexto\n')
                if context:
                    f.write(context + '\n\n')
                else:
                    f.write('\n')
                f.write('## Source\n')
                f.write(source_section + '\n')
            created.append(path)

        index_path = make_index(created, DEST_FOLDER, NOTEBOOK_TITLE, NOTEBOOK_ID)
        print(json.dumps({
            'status': 'success',
            'notebook_id': NOTEBOOK_ID,
            'total_items_found': total_found,
            'items_exported': len(created),
            'created_files': created,
            'index_file': index_path,
            'errors': errors,
        }))


if __name__ == '__main__':
    asyncio.run(main())
