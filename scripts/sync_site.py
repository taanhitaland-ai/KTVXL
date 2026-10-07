"""Synchronize the editable web/ site with the GitHub Pages docs/ copy."""
import argparse
from pathlib import Path
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true', help='Report differences without writing files')
    args = parser.parse_args()
    differences = []
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
