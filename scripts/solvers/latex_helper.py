import re

def latexify_text(text):
    """
    Converts plain-text technical formulas, units, and microprocessor terms
    into clean KaTeX LaTeX syntax ($ ... $) without double-escaping or breaking
    existing LaTeX math blocks.
    Uses function replacers to prevent regex backslash substitution corruption.
    """
    if not text or not isinstance(text, str):
        return text

    # Split by existing math blocks ($...$ or $$...$$) to avoid touching them
    tokens = re.split(r'(\${1,2}[^\$]+\${1,2})', text)
    processed = []

    for idx, token in enumerate(tokens):
        if idx % 2 == 1:
            # Already math block, preserve as is
            processed.append(token)
            continue

        s = token

        # 1. Frequencies: 11.0592MHz, 12MHz, 6MHz, 25Hz, 50kHz
        s = re.sub(r'(?<!\$)\b(\d+(?:\.\d+)?)\s*MHz\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{MHz}}$", s)
        s = re.sub(r'(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:kHz|KHz)\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{kHz}}$", s)
        s = re.sub(r'(?<!\$)\b(\d+(?:\.\d+)?)\s*Hz\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{Hz}}$", s)

        # 2. Time units: µs, us, ms
        s = re.sub(r'(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:µs|uS|us|µS)\b(?!\$)', lambda m: f"${m.group(1)}\\,\\mu\\text{{s}}$", s)
        s = re.sub(r'(?<!\$)\b(\d+(?:\.\d+)?)\s*(?:ms|mS)\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{ms}}$", s)

        # 3. Baud rates: 9600 bps, 4800 baud
        s = re.sub(r'(?<!\$)\b(\d+)\s*(?:bps|Bps)\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{bps}}$", s)
        s = re.sub(r'(?<!\$)\b(\d+)\s*(?:baud|Baud)\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{baud}}$", s)

        # 4. Memory capacities: 64KB, 8KB, 4KB, 16KB, 32KB
        s = re.sub(r'(?<!\$)\b(\d+)\s*KB\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{KB}}$", s)
        s = re.sub(r'(?<!\$)\b(\d+)\s*Kbit\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{Kbit}}$", s)
        s = re.sub(r'(?<!\$)\b(\d+)\s*Byte\b(?!\$)', lambda m: f"${m.group(1)}\\,\\text{{Byte}}$", s)

        # 5. Powers of two: 2^N, 2^16, 2^13, 2^11
        s = re.sub(r'(?<!\$)\b2\^([0-9a-zA-Z\+\-]+)\b(?!\$)', lambda m: f"$2^{{{m.group(1)}}}$", s)

        # 6. Address ranges: 0000H - FFFFH, 0000H - 0FFFH, E000H - FFFFH
        s = re.sub(r'(?<!\$)\b([0-9A-Fa-f]{4}H)\s*[-–]\s*([0-9A-Fa-f]{4}H)\b(?!\$)', lambda m: f"${m.group(1)} - {m.group(2)}$", s)
        s = re.sub(r'(?<!\$)\bA(\d+)\s*[-–]\s*A(\d+)\b(?!\$)', lambda m: f"$A_{{{m.group(1)}}} - A_{{{m.group(2)}}}$", s)
        s = re.sub(r'(?<!\$)\bP(\d\.\d)\s*[-–]\s*P(\d\.\d)\b(?!\$)', lambda m: f"$\\text{{P{m.group(1)}}} - \\text{{P{m.group(2)}}}$", s)

        # 7. Fractions: 1/12
        s = re.sub(r'(?<!\$)\b1/12\b(?!\$)', lambda m: r"$\frac{1}{12}$", s)

        # 8. Core microprocessor variables: T_cm, T_delay, f_osc, T_half
        s = re.sub(r'(?<!\$)\bT_cm\b(?!\$)', lambda m: r"$T_{\text{cm}}$", s)
        s = re.sub(r'(?<!\$)\bT_delay\b(?!\$)', lambda m: r"$T_{\text{delay}}$", s)
        s = re.sub(r'(?<!\$)\bf_osc\b(?!\$)', lambda m: r"$f_{\text{osc}}$", s)
        s = re.sub(r'(?<!\$)\bT_half\b(?!\$)', lambda m: r"$T_{\text{half}}$", s)

        # 9. Active-low control signals with overbar
        s = re.sub(r'(?<!\$)\b(?:/EA|EA#|EA_L)\b(?!\$)', lambda m: r"$\overline{\text{EA}}$", s)
        s = re.sub(r'(?<!\$)\b(?:/PSEN|PSEN#)\b(?!\$)', lambda m: r"$\overline{\text{PSEN}}$", s)
        s = re.sub(r'(?<!\$)\b(?:/WR|WR#)\b(?!\$)', lambda m: r"$\overline{\text{WR}}$", s)
        s = re.sub(r'(?<!\$)\b(?:/RD|RD#)\b(?!\$)', lambda m: r"$\overline{\text{RD}}$", s)

        # 10. Clean up empty or adjacent math blocks
        s = re.sub(r'\$\s*\$', '', s)

        processed.append(s)

    res = ''.join(processed)
    return fix_isolated_dollars(res)

def fix_isolated_dollars(text):
    """
    Escapes standalone single dollars that are not part of a valid math pair $...$.
    Prevents KaTeX math parser issues on assembly symbols ($R0, $30H, SJMP $, etc.).
    """
    if not text or not isinstance(text, str):
        return text
    clean = text.replace(r'\$', '')
    if clean.count('$') % 2 == 0:
        return text

    # Case 1: isolated '$' (e.g. 'D. $', ' # $ % ')
    text = re.sub(r'(?<!\\)(?<!\$)\$(?!\$)(?=\s|$|[,;:])', lambda m: r'\$', text)
    # Case 2: SJMP $ or JNB $
    text = re.sub(r'(?<!\\)(SJMP|LJMP|AJMP|JNB|JB|JC|JNC|JZ|JNZ)\s+\$', lambda m: m.group(1) + r' \$', text)
    # Case 3: $R0 or $30H
    text = re.sub(r'(?<!\\)\$(?=[0-9A-Za-z]+(?:\s|$|[,;:\)]))', lambda m: r'\$', text)
    return text

if __name__ == '__main__':
    test_str = 'Dung lượng 8KB, 64KB, dải địa chỉ 0000H - 0FFFH, bus địa chỉ A0 - A15 và tần số 1/12 thạch anh 12MHz.'
    print('Input :', test_str)
    print('Output:', latexify_text(test_str))

