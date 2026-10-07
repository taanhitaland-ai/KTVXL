import json
import os
import shutil

def sync_databases():
    # 1. KTVXL
    ktvxl_path = 'data/questions_db.json'
    with open(ktvxl_path, 'r', encoding='utf-8') as f:
        ktvxl_data = json.load(f)
    print(f'Syncing KTVXL: {len(ktvxl_data)} questions...')
    
    # Write JSON mirrors
    for p in ['web/data/questions.json', 'web/data/questions_db.json', 'docs/data/questions.json', 'docs/data/questions_db.json']:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(ktvxl_data, f, ensure_ascii=False, indent=2)
    
    # Write JS bundles
    ktvxl_js = f"window.KTVXL_QUESTIONS = window.QUESTIONS_DATABASE = {json.dumps(ktvxl_data, ensure_ascii=False, indent=2)};\n"
    with open('web/data.js', 'w', encoding='utf-8') as f:
        f.write(ktvxl_js)
    with open('docs/data.js', 'w', encoding='utf-8') as f:
        f.write(ktvxl_js)

    # 2. VLDC
    vldc_path = 'data/vldc_questions_db.json'
    with open(vldc_path, 'r', encoding='utf-8') as f:
        vldc_data = json.load(f)
    print(f'Syncing VLDC: {len(vldc_data)} questions...')
    
    for p in ['web/data/vldc_questions.json', 'docs/data/vldc_questions.json']:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(vldc_data, f, ensure_ascii=False, indent=2)
            
    vldc_js = f"// VLDC Master Question Database\nwindow.VLDC_QUESTIONS_DATA = {json.dumps(vldc_data, ensure_ascii=False, indent=2)};\n"
    with open('web/vldc_data.js', 'w', encoding='utf-8') as f:
        f.write(vldc_js)
    with open('docs/vldc_data.js', 'w', encoding='utf-8') as f:
        f.write(vldc_js)

    # 3. XSTK
    xstk_path = 'data/xstk_questions_db.json'
    with open(xstk_path, 'r', encoding='utf-8') as f:
        xstk_data = json.load(f)
    print(f'Syncing XSTK: {len(xstk_data)} questions...')
    
    for p in ['web/data/xstk_questions.json', 'docs/data/xstk_questions.json']:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(xstk_data, f, ensure_ascii=False, indent=2)
            
    xstk_js = f"// XSTK Master Question Database\nwindow.XSTK_QUESTIONS_DATA = {json.dumps(xstk_data, ensure_ascii=False, indent=2)};\n"
    with open('web/xstk_data.js', 'w', encoding='utf-8') as f:
        f.write(xstk_js)
    with open('docs/xstk_data.js', 'w', encoding='utf-8') as f:
        f.write(xstk_js)

    # 4. TTHCM
    tthcm_path = 'data/tthcm_questions_db.json'
    with open(tthcm_path, 'r', encoding='utf-8') as f:
        tthcm_data = json.load(f)
    print(f'Syncing TTHCM: {len(tthcm_data)} questions...')
    
    for p in ['web/data/tthcm_questions.json', 'docs/data/tthcm_questions.json']:
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, 'w', encoding='utf-8') as f:
            json.dump(tthcm_data, f, ensure_ascii=False, indent=2)
            
    tthcm_js = f"// TƯ TƯỞNG HỒ CHÍ MINH QUESTION DATABASE\nwindow.TTHCM_QUESTIONS_DATA = {json.dumps(tthcm_data, ensure_ascii=False, indent=2)};\n"
    with open('web/tthcm_data.js', 'w', encoding='utf-8') as f:
        f.write(tthcm_js)
    with open('docs/tthcm_data.js', 'w', encoding='utf-8') as f:
        f.write(tthcm_js)

    print('All databases synced successfully across data/, web/, and docs/!')

if __name__ == '__main__':
    sync_databases()
