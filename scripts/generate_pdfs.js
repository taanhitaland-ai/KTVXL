const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function renderPDFs() {
  console.log('Launching Chromium with Playwright to generate PDFs...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  const cwd = process.cwd();

  // 1. Generate KTVXL_Kien_Thuc_Trong_Tam.pdf
  console.log('Generating Deliverable 1: KTVXL_Kien_Thuc_Trong_Tam.pdf ...');
  const page1 = await browser.newPage();
  const file1Uri = 'file://' + path.join(cwd, 'pdf_templates', 'kien_thuc_trong_tam.html');
  await page1.goto(file1Uri, { waitUntil: 'networkidle', timeout: 60000 });
  
  const pdf1Path = path.join(cwd, 'KTVXL_Kien_Thuc_Trong_Tam.pdf');
  await page1.pdf({
    path: pdf1Path,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    }
  });
  console.log(`✅ Deliverable 1 generated successfully: ${pdf1Path} (${(fs.statSync(pdf1Path).size / 1024).toFixed(1)} KB)`);
  await page1.close();

  // 2. Generate KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf
  console.log('Generating Deliverable 2: KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf ...');
  const page2 = await browser.newPage();
  const file2Uri = 'file://' + path.join(cwd, 'pdf_templates', 'ngan_hang_cau_hoi.html');
  await page2.goto(file2Uri, { waitUntil: 'load', timeout: 120000 });
  
  const pdf2Path = path.join(cwd, 'KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf');
  await page2.pdf({
    path: pdf2Path,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '15mm',
      bottom: '15mm',
      left: '12mm',
      right: '12mm'
    }
  });
  console.log(`✅ Deliverable 2 generated successfully: ${pdf2Path} (${(fs.statSync(pdf2Path).size / 1024 / 1024).toFixed(2)} MB)`);
  await page2.close();

  await browser.close();
  console.log('🎉 Both PDF documents exported successfully!');
}

renderPDFs().catch(err => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
