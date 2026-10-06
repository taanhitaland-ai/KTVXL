import requests
import json
import os

HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

def format_uuid(uuid_str):
    c = uuid_str.replace('-', '')
    return f"{c[:8]}-{c[8:12]}-{c[12:16]}-{c[16:20]}-{c[20:]}"

def get_page_chunk(page_id):
    formatted_id = format_uuid(page_id)
    url = 'https://www.notion.so/api/v3/loadPageChunk'
    payload = {
        'pageId': formatted_id,
        'limit': 100,
        'cursor': {'stack': []},
        'chunkNumber': 0,
        'verticalColumns': False
    }
    r = requests.post(url, json=payload, headers=HEADERS)
    if r.status_code == 200:
        return r.json()
    return None

def extract_block_text(block_val):
    props = block_val.get('properties', {})
    title = props.get('title', [])
    text_parts = []
    for part in title:
        if isinstance(part, list) and len(part) > 0:
            text_parts.append(str(part[0]))
    return "".join(text_parts).strip()

def crawl_tree(root_id, visited=None):
    if visited is None:
        visited = set()
    root_clean = root_id.replace('-', '')
    if root_clean in visited:
        return {}
    visited.add(root_clean)

    data = get_page_chunk(root_clean)
    if not data:
        return {}

    blocks = data.get('recordMap', {}).get('block', {})
    res = {}
    for bid, binfo in blocks.items():
        val = binfo.get('value', {})
        b_type = val.get('type')
        b_text = extract_block_text(val)
        source = val.get('properties', {}).get('source', [])
        file_url = None
        if source and isinstance(source, list) and len(source) > 0:
            if isinstance(source[0], list) and len(source[0]) > 0:
                file_url = source[0][0]

        child_list = val.get('content', [])
        res[bid] = {
            'id': bid,
            'type': b_type,
            'text': b_text,
            'file_url': file_url,
            'format': val.get('format', {}),
            'properties': val.get('properties', {}),
            'children': child_list
        }

        # If it's a page or sub-page, crawl deeper
        if b_type in ['page', 'sub_page'] and bid.replace('-', '') != root_clean:
            child_tree = crawl_tree(bid, visited)
            res[bid]['sub_blocks'] = child_tree

    return res

if __name__ == '__main__':
    pages = {
        'de_thi': '26ffd98e1f0981899fe6eb6f5ccd09c4',
        'de_cuong': '26ffd98e1f0981e3ace3f9335cd4fc88'
    }

    all_data = {}
    for name, pid in pages.items():
        print(f"Crawling {name} ({pid})...")
        tree = crawl_tree(pid)
        all_data[name] = tree
        print(f"Crawled {len(tree)} blocks for {name}")

    with open('data/notion_target_crawl.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print("Saved to data/notion_target_crawl.json")
