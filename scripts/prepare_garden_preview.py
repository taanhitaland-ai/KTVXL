"""Build a loopback-only garden preview outside the published site."""
from pathlib import Path
import hashlib
import re
root=Path(__file__).resolve().parents[1]
fixture=root.parent/'demo-auto-study-fixture.js'
if not fixture.exists():
    raise SystemExit('The automatic-study preview fixture must be available first.')
s=(root/'web/index.html').read_text(encoding='utf-8').replace('<head>','<head>\n  <base href="/KTVXL/web/">')
s=re.sub(r'<script src="vendor/supabase/supabase.js[^"\n]*"></script>','<script src="/demo-study-garden-fixture.js"></script>',s)
s=re.sub(r'<script src="cloud_config.js[^"\n]*"></script>','<script>window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only",storageNamespace:"kma_preview_study-garden:"};window.KMA_GARDEN_PREVIEW=true;</script>',s)
def version(name):
    data=(root/'web'/name).read_bytes().replace(b'\r\n',b'\n')
    return name+'?v='+hashlib.sha256(data).hexdigest()[:12]
# The production page now includes the same components; only configuration/SDK differ.
(root.parent/'demo-study-garden.html').write_text(s,encoding='utf-8')
code=fixture.read_text(encoding='utf-8').replace('ktvxl_auto_study_preview_login','ktvxl_garden_preview_login').replace('kma_preview_auto-study:','kma_preview_study-garden:')
code=code.replace('127.0.0.1:8768/rpc','127.0.0.1:8771/rpc')
code=code.replace('window.supabase={', "window.KMA_GARDEN_DEMO=async args=>{const result=await request('garden_demo',args);if(result.error)throw new Error(result.error.message);return result.data;};\n  window.supabase={")
code=code.replace('BẢN THỬ · Tài khoản và BXH dùng dữ liệu thử riêng. Làm bài để bắt đầu tự tính giờ.','VƯỜN · BẢN THỬ — có cây và vật phẩm mẫu; không ghi database thật. Làm bài để thử nuôi cây bằng giờ học.')
(root.parent/'demo-study-garden-fixture.js').write_text(code,encoding='utf-8')
print('Prepared demo-study-garden.html with an isolated simulated account.')
