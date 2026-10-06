import requests
import json
import os
import time

HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
}

def get_signed_urls(url_records):
    # url_records: list of dicts {'url': ..., 'permissionRecord': {'table': 'block', 'id': ...}}
    url = 'https://www.notion.so/api/v3/getSignedFileUrls'
    signed = []
    for i in range(0, len(url_records), 30):
        chunk = url_records[i:i+30]
        payload = {'urls': chunk}
        try:
            r = requests.post(url, json=payload, headers=HEADERS, timeout=20)
            if r.status_code == 200:
                signed.extend(r.json().get('signedUrls', []))
            else:
                print(f"Failed getSignedFileUrls: {r.status_code}")
                signed.extend([None] * len(chunk))
        except Exception as e:
            print(f"Exception getSignedFileUrls: {e}")
            signed.extend([None] * len(chunk))
        time.sleep(0.3)
    return signed

def download_notion_attachments():
    os.makedirs('data/notion_downloads', exist_ok=True)
    os.makedirs('data/notion_downloads/de_cuong_pdfs', exist_ok=True)
    os.makedirs('data/notion_downloads/images', exist_ok=True)

    # Load all blocks
    with open('data/notion_de_cuong_full.json', 'r', encoding='utf-8') as f:
        de_cuong_blocks = json.load(f)

    with open('data/notion_full_trees.json', 'r', encoding='utf-8') as f:
        full_trees = json.load(f)

    all_blocks = {**de_cuong_blocks}
    if 'de_thi' in full_trees:
        all_blocks.update(full_trees['de_thi'])

    print(f"Total blocks in catalog: {len(all_blocks)}")

    # Extract all attachment blocks
    items_to_sign = []
    meta = []

    for bid, b in all_blocks.items():
        props = b.get('properties', {})
        source = props.get('source', [])
        title = props.get('title', [])
        title_str = "".join(str(p[0]) for p in title if isinstance(p, list) and len(p) > 0).strip()
        b_type = b.get('type')

        if source and isinstance(source, list) and len(source) > 0:
            s_url = source[0][0]
            if s_url.startswith('attachment:'):
                filename = s_url.split(':')[-1]
                items_to_sign.append({
                    'url': s_url,
                    'permissionRecord': {
                        'table': 'block',
                        'id': bid
                    }
                })
                meta.append({
                    'id': bid,
                    'type': b_type,
                    'title': title_str,
                    'orig_url': s_url,
                    'filename': filename
                })

    print(f"Found {len(items_to_sign)} Notion attachments to sign.")
    signed_urls = get_signed_urls(items_to_sign)

    manifest = []
    for m, s_url in zip(meta, signed_urls):
        if s_url:
            m['signed_url'] = s_url
            manifest.append(m)

    with open('data/notion_downloads/manifest.json', 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    print(f"Manifest written with {len(manifest)} signed files.")

    # Download PDFs first
    pdf_files = [m for m in manifest if m['filename'].lower().endswith('.pdf')]
    print(f"\nDownloading {len(pdf_files)} PDF files...")
    for p in pdf_files:
        save_path = os.path.join('data/notion_downloads/de_cuong_pdfs', p['filename'])
        if not os.path.exists(save_path):
            print(f"Downloading {p['filename']} ({p['title']})...")
            try:
                r = requests.get(p['signed_url'], timeout=30)
                if r.status_code == 200:
                    with open(save_path, 'wb') as f:
                        f.write(r.content)
                    print(f"Saved {save_path} ({len(r.content)} bytes)")
                else:
                    print(f"Error downloading {p['filename']}: {r.status_code}")
            except Exception as e:
                print(f"Error {p['filename']}: {e}")
        else:
            print(f"Already exists: {save_path}")

    # Also download GDoc 100 cau
    print("\nDownloading Google Doc 100 câu...")
    gdoc_url = 'https://docs.google.com/document/d/1LsDEYwFHS7tKzqjoxCz69-2cp_Dq5v_vgj--RhaYUf4/export?format=txt'
    r_gdoc = requests.get(gdoc_url)
    if r_gdoc.status_code == 200:
        with open('data/notion_downloads/de_test_100_cau.txt', 'w', encoding='utf-8') as f:
            f.write(r_gdoc.text)
        print("Saved data/notion_downloads/de_test_100_cau.txt")

if __name__ == '__main__':
    download_notion_attachments()
