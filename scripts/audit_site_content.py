import json
import os
import sys

def full_audit():
    print("=== FULL SITE AUDIT START ===")
    issues = []
    
    # 1. KTVXL
    with open("data/questions_db.json", encoding="utf-8") as f:
        ktvxl = json.load(f)
    print(f"1. KTVXL: {len(ktvxl)} questions loaded.")
    
    for idx, q in enumerate(ktvxl):
        qid = q.get("id", f"idx_{idx}")
        prompt = q.get("prompt", "").strip()
        qtype = q.get("type")
        ans = q.get("answer")
        exp = q.get("explanation", "").strip()
        opts = q.get("options", [])
        
        if not prompt:
            issues.append(f"KTVXL {qid}: empty prompt")
        if not exp:
            issues.append(f"KTVXL {qid}: empty explanation")
            
        if qtype == "mcq":
            if len(opts) < 2:
                issues.append(f"KTVXL {qid}: mcq has fewer than 2 options ({len(opts)})")
            if ans not in ["A", "B", "C", "D"]:
                issues.append(f"KTVXL {qid}: invalid mcq answer {ans}")
        elif qtype == "fib":
            acc = q.get("acceptable_answers", [])
            if not acc and not ans:
                issues.append(f"KTVXL {qid}: fib missing answer/acceptable_answers")
                
        # LaTeX dollar check
        text_to_check = (
            prompt + " "
            + " ".join(opts) + " "
            + exp + " "
            + q.get("methodology", "") + " "
            + q.get("tips_casio", "")
        )
        text_clean = text_to_check.replace(r"\$", "")
        c = text_clean.count("$")
        if c % 2 != 0:
            issues.append(f"KTVXL {qid}: unclosed LaTeX math $ (count={c})")
            
        # Images check
        images = list(q.get("images", []))
        if q.get("image"):
            images.append(q.get("image"))
        for img in images:
            if not os.path.exists(os.path.join("web", img)):
                issues.append(f"KTVXL {qid}: missing image in web/ {img}")
            if not os.path.exists(os.path.join("docs", img)):
                issues.append(f"KTVXL {qid}: missing image in docs/ {img}")

    # 2. TTHCM
    with open("data/tthcm_questions_db.json", encoding="utf-8") as f:
        tthcm = json.load(f)
    print(f"2. TTHCM: {len(tthcm)} questions loaded.")
    for idx, q in enumerate(tthcm):
        qid = q.get("id", f"idx_{idx}")
        prompt = q.get("prompt", "").strip()
        ans = q.get("answer")
        exp = q.get("explanation", "").strip()
        opts = q.get("options", [])
        if not prompt: issues.append(f"TTHCM {qid}: empty prompt")
        if not exp: issues.append(f"TTHCM {qid}: empty explanation")
        if len(opts) < 2: issues.append(f"TTHCM {qid}: fewer than 2 options")
        if ans not in ["A", "B", "C", "D"]: issues.append(f"TTHCM {qid}: invalid answer {ans}")
        
    # 3. VLDC
    with open("data/vldc_questions_db.json", encoding="utf-8") as f:
        vldc = json.load(f)
    print(f"3. VLDC: {len(vldc)} questions loaded.")
    for idx, q in enumerate(vldc):
        qid = q.get("id", f"idx_{idx}")
        prompt = q.get("prompt", "").strip()
        ans = q.get("answer")
        exp = q.get("explanation", "").strip()
        opts = q.get("options", [])
        if not prompt: issues.append(f"VLDC {qid}: empty prompt")
        if not exp: issues.append(f"VLDC {qid}: empty explanation")
        if len(opts) < 2: issues.append(f"VLDC {qid}: fewer than 2 options")
        if ans not in ["A", "B", "C", "D"]: issues.append(f"VLDC {qid}: invalid answer {ans}")
        
        text_to_check = prompt + " " + " ".join(opts) + " " + exp
        text_clean = text_to_check.replace(r"\$", "")
        c = text_clean.count("$")
        if c % 2 != 0:
            issues.append(f"VLDC {qid}: unclosed LaTeX math $ (count={c})")

    # 4. XSTK
    with open("data/xstk_questions_db.json", encoding="utf-8") as f:
        xstk = json.load(f)
    print(f"4. XSTK: {len(xstk)} questions loaded.")
    for idx, q in enumerate(xstk):
        qid = q.get("id", f"idx_{idx}")
        prompt = q.get("prompt", "").strip()
        ans = q.get("answer")
        exp = q.get("explanation", "").strip()
        opts = q.get("options", [])
        if not prompt: issues.append(f"XSTK {qid}: empty prompt")
        if not exp: issues.append(f"XSTK {qid}: empty explanation")
        if len(opts) != 4: issues.append(f"XSTK {qid}: does not have exactly 4 options ({len(opts)})")
        if ans not in ["A", "B", "C", "D"]: issues.append(f"XSTK {qid}: invalid answer {ans}")
        
        text_to_check = prompt + " " + " ".join(opts) + " " + exp + " " + q.get("methodology", "") + " " + q.get("tips", "")
        text_clean = text_to_check.replace(r"\$", "")
        c = text_clean.count("$")
        if c % 2 != 0:
            issues.append(f"XSTK {qid}: unclosed LaTeX math $ (count={c})")

    # 5. Parity check between web/ and docs/ files
    files_to_check = [
        "data/questions.json",
        "data/xstk_questions.json",
        "data.js",
        "tthcm_data.js",
        "tthcm_knowledge_data.js",
        "vldc_data.js",
        "vldc_knowledge_data.js",
        "vldc_simulations.js",
        "xstk_data.js",
        "xstk_knowledge_data.js",
        "xstk_simulations.js",
        "index.html",
        "app.js",
        "styles.css",
        "XSTK_Tong_Hop_Kien_Thuc.pdf",
        "XSTK_Giai_De_Kiem_Tra.pdf",
        "XSTK_Giai_Trong_Tam_ATTT.pdf",
        "XSTK_Meo_Va_Casio.pdf",
        "VLDC_Kien_Thuc_Trong_Tam.pdf",
        "VLDC_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf"
    ]
    for filename in files_to_check:
        web_file = os.path.join("web", filename)
        docs_file = os.path.join("docs", filename)
        if not os.path.exists(web_file):
            issues.append(f"Missing {web_file}")
        if not os.path.exists(docs_file):
            issues.append(f"Missing {docs_file}")
        if os.path.exists(web_file) and os.path.exists(docs_file):
            if os.path.getsize(web_file) != os.path.getsize(docs_file):
                issues.append(f"Size mismatch between {web_file} ({os.path.getsize(web_file)}) and {docs_file} ({os.path.getsize(docs_file)})")

    print(f"\nTOTAL ISSUES DETECTED: {len(issues)}")
    if issues:
        for issue in issues[:30]:
            print(" -", issue)
        print("FAIL: Audit did not pass!")
        sys.exit(1)
    else:
        print("SUCCESS: 100% of questions, options, answers, formulas, images, and mirrors PASSED!")
    print("=== FULL SITE AUDIT END ===")

if __name__ == '__main__':
    full_audit()
