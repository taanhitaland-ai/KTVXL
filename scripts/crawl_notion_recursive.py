import requests
import json
import os
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

def sync_records(block_ids):
    if not block_ids:
        return {}
    url = 'https://www.notion.so/api/v3/syncRecordValues'
    results = {}
    # Batch in 50
    for i in range(0, len(block_ids), 50):
        chunk = block_ids[i:i+50]
        payload = {
            'requests': [{'table': 'block', 'id': bid, 'version': -1} for bid in chunk]
        }
        try:
            r = requests.post(url, json=payload, headers=HEADERS, timeout=15)
            if r.status_code == 200:
                rec = r.json().get('recordMap', {}).get('block', {})
                for k, v in rec.items():
                    results[k] = get_block_val(v)
            else:
                print(f"Error syncing {len(chunk)} blocks: {r.status_code}")
        except Exception as e:
            print(f"Exception syncing blocks: {e}")
        time.sleep(0.1)
    return results

def crawl_entire_tree(root_id):
    clean_id = root_id.replace('-', '')
    formatted_id = f"{clean_id[:8]}-{clean_id[8:12]}-{clean_id[12:16]}-{clean_id[16:20]}-{clean_id[20:]}"
    
    # 1. Load initial chunk
    url = 'https://www.notion.so/api/v3/loadPageChunk'
    payload = {
        'pageId': formatted_id,
        'limit': 100,
        'cursor': {'stack': []},
        'chunkNumber': 0,
        'verticalColumns': False
    }
    r = requests.post(url, json=payload, headers=HEADERS)
    if r.status_code != 200:
        print(f"Failed to load page chunk for {root_id}: {r.status_code}")
        return {}

    all_blocks = {}
    init_blocks = r.json().get('recordMap', {}).get('block', {})
    for k, v in init_blocks.items():
        all_blocks[k] = get_block_val(v)

    # 2. Iteratively discover and fetch all children
    queue = list(all_blocks.keys())
    visited = set(queue)

    while queue:
        current_id = queue.pop(0)
        bval = all_blocks.get(current_id, {})
        content_ids = bval.get('content', [])
        
        # Check sub-pages or columns or collections
        missing = [cid for cid in content_ids if cid not in visited]
        if missing:
            fetched = sync_records(missing)
            for f_id, f_val in fetched.items():
                all_blocks[f_id] = f_val
                visited.add(f_id)
                queue.append(f_id)

    return all_blocks

def parse_tree_hierarchy(root_id, all_blocks, indent=0):
    clean_id = root_id.replace('-', '')
    formatted_id = f"{clean_id[:8]}-{clean_id[8:12]}-{clean_id[12:16]}-{clean_id[16:20]}-{clean_id[20:]}"
    
    bval = all_blocks.get(formatted_id) or all_blocks.get(root_id, {})
    b_type = bval.get('type')
    props = bval.get('properties', {})
    title = props.get('title', [])
    title_text = "".join(str(p[0]) for p in title if isinstance(p, list) and len(p) > 0).strip()
    
    source = props.get('source', [])
    source_url = source[0][0] if (source and isinstance(source, list) and len(source) > 0 and isinstance(source[0], list) and len(source[0]) > 0) else None

    lines = []
    prefix = "  " * indent
    lines.append(f"{prefix}[{b_type}] {title_text}")
    if source_url:
        lines.append(f"{prefix}  -> ATTACHMENT: {source_url}")

    for cid in bval.get('content', []):
        lines.extend(parse_tree_hierarchy(cid, all_blocks, indent + 1))

    return lines

if __name__ == '__main__':
    targets = {
        'de_thi': '26ffd98e-1f09-8189-9fe6-eb6f5ccd09c4',
        'de_cuong': '26ffd98e-1f09-81e3-ace3-f9335cd4fc88'
    }

    full_results = {}
    for name, root_id in targets.items():
        print(f"\n==========================================")
        print(f"Crawling complete tree for: {name} ({root_id})")
        blocks = crawl_entire_tree(root_id)
        full_results[name] = blocks
        print(f"Total blocks collected: {len(blocks)}")
        
        hierarchy = parse_tree_hierarchy(root_id, blocks)
        outline_file = f"data/notion_tree_{name}.txt"
        with open(outline_file, "w", encoding="utf-8") as f:
            f.write("\n".join(hierarchy))
        print(f"Hierarchy written to {outline_file}")
        for l in hierarchy[:30]:
            print(l)
        if len(hierarchy) > 30:
            print(f"... and {len(hierarchy) - 30} more lines.")

    with open("data/notion_full_trees.json", "w", encoding="utf-8") as f:
        json.dump(full_results, f, ensure_ascii=False, indent=2)
    print("\nFull trees saved to data/notion_full_trees.json")
