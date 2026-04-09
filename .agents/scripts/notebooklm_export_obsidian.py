import asyncio
import json
import os
import re
import sys
from datetime import datetime


def slugify(s):
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    s = re.sub(r"^-+|-+$", "", s)
    return s or "item"


async def main():
    try:
        import notebooklm
        from notebooklm import NotebookLMClient
    except Exception as e:
        print(json.dumps({
            "status": "failed",
            "errors": [f"notebooklm-py import error: {e}"],
        }))
        return

    notebook_title = "Foundations of User Experience and Interface Design"
    vault_folder = r"D:\DriveObs\Boveda de Ejemplo\UX-UI\NotebookLM Imports\Foundations of User Experience and Interface Design"
    os.makedirs(vault_folder, exist_ok=True)

    prompt = (
        "Extract the notebook's key ideas as a numbered list of concise, standalone bullet points. "
        "For each bullet, produce: a short descriptive title (5-8 words max), the main content (1-3 sentences), "
        "and an optional context excerpt (one short paragraph)."
    )

    try:
        async with await NotebookLMClient.from_storage() as client:
            # try several ways to list notebooks
            notebooks = []
            try:
                notebooks = await client.notebooks.list()
            except Exception:
                try:
                    notebooks = await client.notebooks.all()
                except Exception:
                    # try client's internal attribute
                    notebooks = []

            # normalize to list of dicts with 'title' and 'id'
            nb_list = []
            for nb in notebooks:
                try:
                    title = getattr(nb, 'title', None) or nb.get('title')
                    nid = getattr(nb, 'id', None) or nb.get('id')
                except Exception:
                    continue
                if title and nid:
                    nb_list.append({'title': title, 'id': nid, 'raw': nb})

            target = None
            for nb in nb_list:
                if nb['title'] == notebook_title:
                    target = nb
                    break

            if not target:
                print(json.dumps({
                    "status": "failed",
                    "errors": [f"Notebook with exact title '{notebook_title}' not found. Available notebooks: {[n['title'] for n in nb_list]}"],
                }))
                return

            notebook_id = target['id']

            # Attempt to get highlights field
            highlights = None
            try:
                nb_obj = await client.notebooks.get(notebook_id)
                # try common fields
                if isinstance(nb_obj, dict):
                    for key in ['highlights', 'key_ideas', 'highlights_html']:
                        if key in nb_obj and nb_obj[key]:
                            highlights = nb_obj[key]
                            break
                else:
                    # try attribute access
                    for key in ['highlights', 'key_ideas']:
                        if hasattr(nb_obj, key) and getattr(nb_obj, key):
                            highlights = getattr(nb_obj, key)
                            break
            except Exception:
                highlights = None

            # If no highlights, ask via chat
            chat_answer = None
            if not highlights:
                try:
                    res = await client.chat.ask(notebook_id, prompt)
                    # res may be object with 'answer' or 'content' or 'text'
                    if hasattr(res, 'answer'):
                        chat_answer = res.answer
                    elif isinstance(res, dict):
                        chat_answer = res.get('answer') or res.get('content') or res.get('text')
                    else:
                        chat_answer = str(res)
                except Exception as e:
                    print(json.dumps({
                        "status": "failed",
                        "errors": [f"Failed to ask notebookchat: {e}"],
                    }))
                    return
            else:
                # if highlights is a list join
                if isinstance(highlights, list):
                    chat_answer = '\n'.join(str(h) for h in highlights)
                else:
                    chat_answer = str(highlights)

            if not chat_answer:
                print(json.dumps({
                    "status": "failed",
                    "errors": ["No highlights or chat answer returned by NotebookLM."],
                }))
                return

            # parse numbered list
            items = []
            # split by lines that start with number and dot
            parts = re.split(r"(?m)^\s*\d+\s*[\).:-]\\s*", "\n" + chat_answer)
            # first element before first number is empty
            for p in parts[1:]:
                text = p.strip()
                if not text:
                    continue
                # try to extract title (up to first linebreak or em dash or ':' )
                lines = text.splitlines()
                first = lines[0].strip()
                # split title by ' - ' or '—' or ':'
                m = re.split(r"\s[–—-]\s|:\s", first, maxsplit=1)
                if len(m) > 1:
                    title = m[0].strip()
                    rest = m[1].strip()
                else:
                    # fallback: title is first 5 words
                    words = re.findall(r"\w+", first)
                    title = ' '.join(words[:6])
                    rest = ' '.join(lines).strip()

                # context: look for 'Context:' or 'Contexto' or bracketed paragraph
                context = ''
                rest_join = '\n'.join(lines[1:]).strip()
                if not rest_join:
                    # maybe rest contains content and context separated by 'Context:'
                    if 'Context:' in rest:
                        parts2 = rest.split('Context:', 1)
                        content = parts2[0].strip()
                        context = parts2[1].strip()
                    else:
                        content = rest
                else:
                    content = rest + ('\n' + rest_join if rest_join else '')
                    # try to find context marker
                    if '\nContext:' in content or '\nContexto:' in content:
                        cparts = re.split(r"\nContext(?:o)?:", content, maxsplit=1)
                        content = cparts[0].strip()
                        context = cparts[1].strip()

                items.append({'title': title.strip(), 'content': content.strip(), 'context': context.strip()})

            # enforce limit
            total_found = len(items)
            if total_found > 300:
                items = items[:200]

            # Create files
            created_files = []
            errors = []
            digits = 2 if len(items) < 100 else 3
            for idx, it in enumerate(items, start=1):
                NN = str(idx).zfill(digits)
                slug = slugify(it['title'])
                base_name = f"{NN} - {slug}.md"
                path = os.path.join(vault_folder, base_name)
                # handle conflicts
                suffix = 1
                final_path = path
                while os.path.exists(final_path):
                    suffix += 1
                    name, ext = os.path.splitext(base_name)
                    final_name = f"{name}-{suffix}{ext}"
                    final_path = os.path.join(vault_folder, final_name)

                fm = {
                    'title': it['title'],
                    'original_notebook': notebook_title,
                    'notebook_id': str(notebook_id),
                    'extracted_date': datetime.utcnow().isoformat() + 'Z',
                    'source': 'NotebookLM',
                    'tags': ['notebooklm'],
                    'original_source_urls': []
                }

                front = '---\n'
                for k, v in fm.items():
                    if isinstance(v, list):
                        front += f"{k}:\n"
                        for el in v:
                            front += f"  - {el}\n"
                    else:
                        front += f"{k}: {json.dumps(v)}\n"
                front += '---\n\n'

                body = it['content'] + '\n\n'
                if it['context']:
                    body += '## Contexto\n' + it['context'] + '\n\n'
                body += '## Source\n'
                body += f"Notebook: {notebook_title} (id: {notebook_id})\n"

                try:
                    with open(final_path, 'w', encoding='utf-8') as f:
                        f.write(front + body)
                    created_files.append(os.path.abspath(final_path))
                except Exception as e:
                    errors.append(f"Failed to write {final_path}: {e}")

            # create index
            index_path = os.path.join(vault_folder, '00 - index.md')
            try:
                with open(index_path, 'w', encoding='utf-8') as f:
                    f.write(f"# Index: {notebook_title}\n\n")
                    f.write(f"Se extrajeron {len(items)} ítems del cuaderno.\n\n")
                    for idx, it in enumerate(items, start=1):
                        NN = str(idx).zfill(digits)
                        slug = slugify(it['title'])
                        name = f"{NN} - {slug}"
                        f.write(f"- [[{name}]] - {it['title']}\n")
                index_file = os.path.abspath(index_path)
            except Exception as e:
                errors.append(f"Failed to write index: {e}")
                index_file = ''

            output = {
                'status': 'success',
                'notebook_id': str(notebook_id),
                'total_items_found': total_found,
                'items_exported': len(created_files),
                'created_files': created_files,
                'index_file': index_file,
                'errors': errors,
                'summary': f"Se extrajeron {len(created_files)} ítems del cuaderno '{notebook_title}' y se guardaron en {vault_folder}"
            }

            print(json.dumps(output, ensure_ascii=False))
    except Exception as e:
        print(json.dumps({
            'status': 'failed',
            'errors': [f'Unexpected error: {e}']
        }))


if __name__ == '__main__':
    asyncio.run(main())
