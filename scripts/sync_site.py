"""Synchronize the editable web/ site with the GitHub Pages docs/ copy."""
import argparse
import hashlib
from pathlib import Path
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]


def fingerprinted_index():
    path = ROOT / 'web/index.html'
    current = path.read_text(encoding='utf-8')
    def fingerprint(match):
        attribute, url = match.groups()
        if url.startswith(('https:', 'http:', 'data:', '//')):
            return match.group(0)
        relative = url.split('?')[0]
        asset = ROOT / 'web' / relative
        if not asset.is_file():
            return match.group(0)
        # Git may use CRLF on Windows and LF on CI; keep the cache key stable.
        digest = hashlib.sha256(asset.read_bytes().replace(b'\r\n', b'\n')).hexdigest()[:12]
        return f'{attribute}="{relative}?v={digest}"'
    updated = re.sub(r'\b(src|href)="([^"\s]+\.(?:js|css)(?:\?[^"\s]*)?)"', fingerprint, current)
    return path, current, updated


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Report differences without writing files')
    args = parser.parse_args()
    differences = []
    path, current, updated = fingerprinted_index()
    if current != updated:
        if args.check:
            differences.append('outdated asset fingerprints in web/index.html')
        else:
            path.write_text(updated, encoding='utf-8')
    for source in sorted((ROOT / 'web').rglob('*')):
        if not source.is_file():
            continue
        relative = source.relative_to(ROOT / 'web')
        destination = ROOT / 'docs' / relative
        if not destination.exists() or destination.read_bytes() != source.read_bytes():
            differences.append(str(relative))
            if not args.check:
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
    if args.check and differences:
        print('Site copies differ:', ', '.join(differences))
        return 1
    print(f'Site copies match ({len(differences)} files synchronized).' if not args.check else 'web/ and docs/ match byte for byte.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
