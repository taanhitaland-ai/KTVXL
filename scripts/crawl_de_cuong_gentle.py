import requests
import json
import time

HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

def get_block_val(binfo):
    if not binfo:
        return {}
    v = binfo.get('value', {})
    if 'value' in v and isinstance(v['value'], dict):
        return v['value']
    return v

def sync_records_gentle(block_ids):
    if not block_ids:
        return {}
    url = 'https://www.notion.so/api/v3/syncRecordValues'
    results = {}
    
    # Process 10 at a time to avoid rate limits
    for i in range(0, len(block_ids), 10):
        chunk = block_ids[i:i+10]
        payload = {
            'requests': [{'table': 'block', 'id': bid, 'version': -1} for bid in chunk]
        }
        retries = 5
        while retries > 0:
            try:
                r = requests.post(url, json=payload, headers=HEADERS, timeout=15)
                if r.status_code == 200:
                    rec = r.json().get('recordMap', {}).get('block', {})
                    for k, v in rec.items():
                        results[k] = get_block_val(v)
                    break
                elif r.status_code == 429:
                    print(f"429 Rate limited. Waiting 2.5s... (retries left: {retries})")
                    time.sleep(2.5)
                    retries -= 1
                else:
                    print(f"Status {r.status_code}, retrying...")
                    time.sleep(1.0)
                    retries -= 1
            except Exception as e:
                print(f"Exception: {e}")
                time.sleep(1.0)
                retries -= 1
        time.sleep(0.5)
    return results

def crawl_de_cuong():
    root_id = '26ffd98e-1f09-81e3-ace3-f9335cd4fc88'
    url = 'https://www.notion.so/api/v3/loadPageChunk'
    payload = {
        'pageId': root_id,
        'limit': 100,
        'cursor': {'stack': []},
        'chunkNumber': 0,
        'verticalColumns': False
    }
    r = requests.post(url, json=payload, headers=HEADERS)
    if r.status_code != 200:
        print("Initial load failed:", r.status_code)
        return

    all_blocks = {}
    init_blocks = r.json().get('recordMap', {}).get('block', {})
    for k, v in init_blocks.items():
        all_blocks[k] = get_block_val(v)

    queue = list(all_blocks.keys())
    visited = set(queue)

    while queue:
        current_id = queue.pop(0)
        bval = all_blocks.get(current_id, {})
        content_ids = bval.get('content', [])
        missing = [cid for cid in content_ids if cid not in visited]
        if missing:
            print(f"Fetching {len(missing)} child blocks...")
            fetched = sync_records_gentle(missing)
            for f_id, f_val in fetched.items():
                all_blocks[f_id] = f_val
                visited.add(f_id)
                queue.append(f_id)

    with open('data/notion_de_cuong_full.json', 'w', encoding='utf-8') as f:
        json.dump(all_blocks, f, ensure_ascii=False, indent=2)
    print(f"Done! Crawled {len(all_blocks)} blocks for de_cuong.")

def print_tree(root_id, all_blocks, indent=0):
    bval = all_blocks.get(root_id, {})
    b_type = bval.get('type')
    props = bval.get('properties', {})
    title = props.get('title', [])
    title_text = "".join(str(p[0]) for p in title if isinstance(p, list) and len(p) > 0).strip()
    source = props.get('source', [])
    source_url = source[0][0] if (source and isinstance(source, list) and len(source) > 0 and isinstance(source[0], list) and len(source[0]) > 0) else None

    prefix = "  " * indent
    out = [f"{prefix}[{b_type}] {title_text}"]
    if source_url:
        out.append(f"{prefix}  -> ATTACHMENT: {source_url}")

    for cid in bval.get('content', []):
        out.extend(print_tree(cid, all_blocks, indent + 1))
    return out

if __name__ == '__main__':
    crawl_de_cuong()
    with open('data/notion_de_cuong_full.json', 'r', encoding='utf-8') as f:
        blocks = json.load(f)
    tree_lines = print_tree('26ffd98e-1f09-81e3-ace3-f9335cd4fc88', blocks)
    with open('data/notion_tree_de_cuong.txt', 'w', encoding='utf-8') as f:
        f.write("\n".join(tree_lines))
    for l in tree_lines:
        print(l)
