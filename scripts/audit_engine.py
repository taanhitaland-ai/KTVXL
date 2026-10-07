import asyncio
import httpx
import json
import os
import re
import time

PROGRESS_FILE = 'data/audit_progress.json'
API_URL = 'http://127.0.0.1:4141/v1/chat/completions'
API_KEY = 'm365-secret-key-12345'
MODEL_NAME = 'gpt-5.6-quick'

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        try:
            with open(PROGRESS_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print("Error loading progress:", e)
    return {}

def save_progress(progress):
    os.makedirs(os.path.dirname(PROGRESS_FILE), exist_ok=True)
    with open(PROGRESS_FILE, 'w', encoding='utf-8') as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

def clean_json_response(text):
    text = text.strip()
    if text.startswith('```'):
        text = re.sub(r'^```(?:json)?\n', '', text)
        text = re.sub(r'\n```$', '', text)
    match = re.search(r'(\{[\s\S]*\})', text)
    if match:
        text = match.group(1)
    return text

TOKENHARBOR_URL = 'https://tokenharbor.ai/v1/chat/completions'
TOKENHARBOR_KEY = 'thk_live_rsOKFnrfJ-KmU15z0QgOxlA-GUHyGCzMoR6CWddZN8xm8k_fEvE_MpH-FpBXJv6M'
FALLBACK_MODEL = 'deepseek-v4-flash:free'

async def verify_question(client, q, subject):
    prompt_text = q.get('prompt', '').strip()
    options = q.get('options', [])
    answer = str(q.get('answer', q.get('correct_answer', ''))).strip()
    explanation = q.get('explanation', '').strip()
    extra_lines = q.get('extra_lines', [])

    extra_str = f"\n[DÒNG LỆNH/MÃ NGUỒN ĐÍNH KÈM]:\n" + "\n".join(extra_lines) if extra_lines else ""
    opts_str = "\n".join(options) if options else "(Câu hỏi điền khuyết / FIB, không có lựa chọn A, B, C, D)"

    user_message = f"""Bạn là chuyên gia thẩm định đề thi đại học/học viện.
Hãy giải độc lập câu hỏi sau và kiểm tra xem ĐÁP ÁN và LỜI GIẢI có chuẩn xác 100% không.

[MÔN HỌC]: {subject.upper()}
[MÃ CÂU HỎI]: {q.get('id', 'N/A')}
[ĐỀ BÀI]: {prompt_text}{extra_str}

[CÁC LỰA CHỌN]:
{opts_str}

[ĐÁP ÁN HIỆN TẠI]: {answer}
[LỜI GIẢI HIỆN TẠI]: {explanation}

YÊU CẦU:
1. Tự giải độc lập để tìm ra đáp án đúng.
2. So sánh với đáp án hiện tại: có đúng không?
3. Thẩm định lời giải: logic, công thức và kết luận có chính xác không?

Hãy trả về DUY NHẤT một chuỗi JSON hợp lệ (không kèm markdown ngoài JSON):
{{
  "is_correct": true,
  "calculated_answer": "A",
  "explanation_valid": true,
  "notes": "nhận xét ngắn gọn"
}}"""

    # Retry loop with fallback
    models_to_try = [
        (API_URL, API_KEY, 'gpt-5.6-quick', 20.0),
        (API_URL, API_KEY, 'gpt-5.6', 20.0),
        (API_URL, API_KEY, 'gpt-5.5-quick', 20.0),
        (API_URL, API_KEY, 'claude-sonnet', 20.0),
        (TOKENHARBOR_URL, TOKENHARBOR_KEY, FALLBACK_MODEL, 30.0),
        (TOKENHARBOR_URL, TOKENHARBOR_KEY, 'mimo-v2.6-flash:free', 30.0)
    ]

    last_err = "No response"
    for attempt in range(2):
        for ep_url, ep_key, m_name, t_out in models_to_try:
            try:
                resp = await client.post(
                    ep_url,
                    json={'model': m_name, 'messages': [{'role': 'user', 'content': user_message}], 'temperature': 0.1},
                    headers={'Authorization': f'Bearer {ep_key}'},
                    timeout=t_out
                )
                if resp.status_code == 200:
                    content = resp.json()['choices'][0]['message']['content']
                    if "temporarily unable" not in content and "Please try again later" not in content:
                        cleaned = clean_json_response(content)
                        res_json = json.loads(cleaned)
                        res_json['verified_by'] = m_name
                        return True, res_json
                else:
                    last_err = f"HTTP {resp.status_code} from {m_name}"
            except Exception as e:
                last_err = f"{m_name}: {str(e)}"
                await asyncio.sleep(0.5)

    return False, last_err

def normalize_ans(ans_str):
    ans_str = str(ans_str).strip().upper()
    m = re.match(r'^(?:ĐÁP ÁN\s*)?([A-D])(?:\.|\:|\s|$)', ans_str)
    if m:
        return m.group(1)
    return ans_str

async def audit_subject(subject, data_path, concurrency=5, limit=None):
    if not os.path.exists(data_path):
        print(f"File not found: {data_path}")
        return

    with open(data_path, 'r', encoding='utf-8') as f:
        questions = json.load(f)

    progress = load_progress()
    if subject not in progress:
        progress[subject] = {}

    to_audit = []
    for q in questions:
        qid = q.get('id')
        # Check if already verified or fixed
        if qid in progress[subject]:
            st = progress[subject][qid].get('status')
            if st in ['VERIFIED', 'FIXED']:
                continue
        to_audit.append(q)

    already_count = len(questions) - len(to_audit)

    if limit:
        to_audit = to_audit[:limit]

    print(f"=== AUDITING {subject.upper()} ===")
    print(f"Total questions in DB: {len(questions)}")
    print(f"Already audited (VERIFIED/FIXED): {already_count}")
    print(f"To audit in this run: {len(to_audit)}")

    if not to_audit:
        print(f"All questions for {subject.upper()} are already verified!")
        return

    sem = asyncio.Semaphore(concurrency)
    completed_count = 0
    flagged_count = 0

    async with httpx.AsyncClient(timeout=45.0) as client:
        async def worker(q):
            nonlocal completed_count, flagged_count
            qid = q.get('id')
            async with sem:
                ok, res = await verify_question(client, q, subject)
                if ok:
                    is_corr = res.get('is_correct', False)
                    raw_calc = str(res.get('calculated_answer', '')).strip()
                    raw_target = str(q.get('answer', q.get('correct_answer', ''))).strip()
                    calc_ans = normalize_ans(raw_calc)
                    target_ans = normalize_ans(raw_target)
                    expl_ok = res.get('explanation_valid', False)

                    # Normalize FIB answer comparison if applicable
                    ans_match = (calc_ans == target_ans)
                    if not ans_match:
                        # strip H, 0x, extra spaces
                        c_clean = calc_ans.replace('H', '').replace('0X', '').strip()
                        t_clean = target_ans.replace('H', '').replace('0X', '').strip()
                        if c_clean and c_clean == t_clean:
                            ans_match = True

                    if is_corr and ans_match and expl_ok:
                        progress[subject][qid] = {
                            'status': 'VERIFIED',
                            'calculated_answer': calc_ans,
                            'notes': res.get('notes', 'OK'),
                            'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
                        }
                    else:
                        flagged_count += 1
                        progress[subject][qid] = {
                            'status': 'FLAGGED',
                            'target_answer': target_ans,
                            'calculated_answer': calc_ans,
                            'explanation_valid': expl_ok,
                            'notes': res.get('notes', ''),
                            'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
                        }
                        print(f"⚠️ FLAGGED [{qid}]: Target={target_ans} vs Calc={calc_ans} | Notes: {res.get('notes', '')[:100]}")
                else:
                    print(f"❌ Error verifying {qid}: {res}")
                    progress[subject][qid] = {
                        'status': 'ERROR',
                        'error': str(res),
                        'checked_at': time.strftime('%Y-%m-%d %H:%M:%S')
                    }

                completed_count += 1
                if completed_count % 10 == 0 or completed_count == len(to_audit):
                    save_progress(progress)
                    print(f"Progress {subject.upper()}: {completed_count}/{len(to_audit)} (Flagged: {flagged_count})")

        tasks = [worker(q) for q in to_audit]
        await asyncio.gather(*tasks)

    save_progress(progress)
    print(f"\nCompleted {subject.upper()}: {completed_count} audited, {flagged_count} flagged.")

if __name__ == '__main__':
    import sys
    subj = sys.argv[1] if len(sys.argv) > 1 else 'xstk'
    limit_arg = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[2] != 'all' else None
    conc_arg = int(sys.argv[3]) if len(sys.argv) > 3 else 8
    paths = {
        'xstk': 'data/xstk_questions_db.json',
        'vldc': 'data/vldc_questions_db.json',
        'ktvxl': 'data/questions_db.json',
        'tthcm': 'data/tthcm_questions_db.json'
    }
    if subj in paths:
        asyncio.run(audit_subject(subj, paths[subj], concurrency=conc_arg, limit=limit_arg))
    else:
        print(f"Unknown subject: {subj}")
