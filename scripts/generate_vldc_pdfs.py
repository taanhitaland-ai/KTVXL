#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_vldc_pdfs.py
Sử dụng Playwright Chromium để render 2 file PDF chuẩn A4 cho môn Vật Lý Đại Cương 2 / A3:
- VLDC_Kien_Thuc_Trong_Tam.pdf
- VLDC_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf
"""

import asyncio
import os
import shutil
from playwright.async_api import async_playwright

async def generate_pdfs():
    cwd = os.path.abspath(os.getcwd())
    file1_html = os.path.join(cwd, "pdf_templates/vldc_kien_thuc_trong_tam.html")
    file2_html = os.path.join(cwd, "pdf_templates/vldc_ngan_hang_cau_hoi.html")

    pdf1_out = os.path.join(cwd, "VLDC_Kien_Thuc_Trong_Tam.pdf")
    pdf2_out = os.path.join(cwd, "VLDC_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf")

    print("Launching Chromium for VLDC PDF generation...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # PDF 1
        print("Rendering PDF 1: VLDC_Kien_Thuc_Trong_Tam.pdf...")
        await page.goto(f"file://{file1_html}", wait_until="networkidle")
        await page.pdf(
            path=pdf1_out,
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "10mm", "right": "10mm"}
        )
        print(f"✅ Generated {pdf1_out} ({os.path.getsize(pdf1_out) / 1024:.1f} KB)")

        # PDF 2
        print("Rendering PDF 2: VLDC_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf...")
        await page.goto(f"file://{file2_html}", wait_until="networkidle")
        await page.pdf(
            path=pdf2_out,
            format="A4",
            print_background=True,
            margin={"top": "12mm", "bottom": "12mm", "left": "10mm", "right": "10mm"}
        )
        print(f"✅ Generated {pdf2_out} ({os.path.getsize(pdf2_out) / 1024 / 1024:.2f} MB)")

        await browser.close()

    # Synchronize to web/ and docs/
    for dest_dir in ["web", "docs"]:
        shutil.copy(pdf1_out, os.path.join(dest_dir, "VLDC_Kien_Thuc_Trong_Tam.pdf"))
        shutil.copy(pdf2_out, os.path.join(dest_dir, "VLDC_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf"))
    print("✅ Synchronized both VLDC PDFs to web/ and docs/!")

if __name__ == "__main__":
    asyncio.run(generate_pdfs())
