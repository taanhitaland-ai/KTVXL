import os
import sys
from playwright.sync_api import sync_playwright

def render_pdfs():
    cwd = os.getcwd()
    print("Launching Chromium with Playwright to generate PDFs...")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        )
        
        # 1. Generate KTVXL_Kien_Thuc_Trong_Tam.pdf
        print("Generating Deliverable 1: KTVXL_Kien_Thuc_Trong_Tam.pdf ...")
        page1 = browser.new_page()
        file1_path = os.path.join(cwd, 'pdf_templates', 'kien_thuc_trong_tam.html')
        file1_uri = f"file://{file1_path}"
        page1.goto(file1_uri, wait_until='networkidle', timeout=60000)
        
        pdf1_path = os.path.join(cwd, 'KTVXL_Kien_Thuc_Trong_Tam.pdf')
        page1.pdf(
            path=pdf1_path,
            format='A4',
            print_background=True,
            margin={
                'top': '15mm',
                'bottom': '15mm',
                'left': '12mm',
                'right': '12mm'
            }
        )
        size1_kb = os.path.getsize(pdf1_path) / 1024
        print(f"✅ Deliverable 1 generated successfully: {pdf1_path} ({size1_kb:.1f} KB)")
        page1.close()
        
        # 2. Generate KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf
        print("Generating Deliverable 2: KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf ...")
        page2 = browser.new_page()
        file2_path = os.path.join(cwd, 'pdf_templates', 'ngan_hang_cau_hoi.html')
        file2_uri = f"file://{file2_path}"
        page2.goto(file2_uri, wait_until='load', timeout=180000)
        
        # Wait a moment for images to settle
        page2.wait_for_timeout(3000)
        
        pdf2_path = os.path.join(cwd, 'KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf')
        page2.pdf(
            path=pdf2_path,
            format='A4',
            print_background=True,
            margin={
                'top': '15mm',
                'bottom': '15mm',
                'left': '12mm',
                'right': '12mm'
            }
        )
        size2_mb = os.path.getsize(pdf2_path) / (1024 * 1024)
        print(f"✅ Deliverable 2 generated successfully: {pdf2_path} ({size2_mb:.2f} MB)")
        page2.close()
        
        browser.close()
        print("🎉 Both PDF documents exported successfully!")

if __name__ == '__main__':
    render_pdfs()
