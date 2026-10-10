"""Original SVG trees and pixel mineral blocks; no remote/game artwork."""
from pathlib import Path
import random
root = Path(__file__).resolve().parents[1] / 'web' / 'garden_assets'
root.mkdir(exist_ok=True)
def save(name, body, pixel=False):
    style = ' shape-rendering="crispEdges"' if pixel else ''
    (root / (name + '.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"{style}>{body}</svg>', encoding='utf-8')
colors = {'oak':'#66b85d','maple':'#ff903d','cherry':'#ff91b9','bamboo':'#a7cc5f','galaxy':'#aa81f4'}
for seed, color in colors.items():
    save('seed-'+seed, f'<path d="M64 20C38 45 29 69 39 92C48 111 80 111 89 92C99 69 88 45 64 20Z" fill="{color}" stroke="#201b2c" stroke-width="7"/><path d="M64 28V102" stroke="#201b2c" stroke-width="6"/><path d="M55 40L45 60" stroke="#ffffff" stroke-opacity=".35" stroke-width="6" stroke-linecap="round"/>')
    for stage in range(4):
        pot = '<path d="M20 97H108L100 119H28Z" fill="#82513d" stroke="#201b2c" stroke-width="4"/><rect x="17" y="94" width="94" height="11" rx="4" fill="#68b655" stroke="#201b2c" stroke-width="4"/>'
        if stage == 0:
            tree = f'<path d="M64 95V65" stroke="#6b583b" stroke-width="6"/><path d="M63 73Q32 75 39 56Q59 48 64 71M65 68Q97 66 87 49Q69 46 65 68" fill="{color}" stroke="#201b2c" stroke-width="3"/>'
        elif seed == 'bamboo':
            tree=''
            for x, top in [(43,48),(61,28),(81,41)]:
                if stage == 1 and x != 61: continue
                tree += f'<rect x="{x}" y="{top+ (15 if stage==1 else 0)}" width="10" height="{94-top-(15 if stage==1 else 0)}" rx="3" fill="{color}" stroke="#201b2c" stroke-width="3"/>'
                for y in [58,76]: tree += f'<path d="M{x} {y}h10" stroke="#456b35" stroke-width="3"/>'
            if stage >= 2: tree += f'<path d="M60 49Q37 23 26 35Q28 49 60 49M81 63Q108 39 114 52Q109 66 81 63" fill="{color}" stroke="#201b2c" stroke-width="3"/>'
        else:
            trunk = '<path d="M57 94V50H71V94Z" fill="#996342" stroke="#201b2c" stroke-width="4"/>'
            if stage == 1:
                foliage=f'<path d="M40 64Q33 36 63 35Q91 34 88 64Q64 79 40 64Z" fill="{color}" stroke="#201b2c" stroke-width="4"/>'
            elif seed == 'maple':
                foliage=f'<path d="M65 11L75 34L94 26L92 44L112 57L93 76L65 82L36 76L17 57L37 44L34 26L54 34Z" fill="{color}" stroke="#201b2c" stroke-width="4"/>'
            elif seed == 'galaxy':
                foliage=f'<path d="M64 10L80 32L108 42L99 63L104 80L76 83L64 94L52 83L25 80L29 63L20 42L47 32Z" fill="{color}" stroke="#201b2c" stroke-width="4"/><path d="M47 36L51 45L61 48L51 51L47 62L44 51L33 48L44 45Z" fill="#ffe877"/>'
            else:
                foliage=f'<path d="M28 72Q15 52 34 43Q33 14 62 14Q92 14 92 43Q115 52 99 73Q82 91 64 78Q42 90 28 72Z" fill="{color}" stroke="#201b2c" stroke-width="4"/>'
            if stage == 3:
                for x,y in [(46,50),(76,41),(64,65),(87,63)]:
                    foliage += f'<circle cx="{x}" cy="{y}" r="5" fill="{"#ffe183" if seed in ["oak","galaxy"] else "#fff0bf"}" stroke="#201b2c" stroke-width="2"/>'
            tree = trunk + foliage
        save(f'tree-{seed}-{stage}', tree+pot)
minerals={'coal':'#333841','stone':'#e7e2d5','copper':'#ed9565','tin':'#c4dacd','azure':'#518cff','rose':'#fc657d','sun':'#ffe451','moss':'#52df9b','frost':'#7ce7ec','cosmos':'#bf8dff'}
for idx,(name,color) in enumerate(minerals.items()):
    rng=random.Random(1807+idx)
    body='<path d="M12 6H112V12H122V112H116V122H12V116H6V18H12Z" fill="#242132"/>'
    body+='<rect x="14" y="14" width="100" height="100" fill="#727778"/><path d="M14 14H114V22H22V114H14Z" fill="#929594"/><path d="M106 22H114V114H22V106H106Z" fill="#565d60"/>'
    for _ in range(24):
        x,y=rng.randrange(3,13)*8,rng.randrange(3,13)*8
        body+=f'<rect x="{x}" y="{y}" width="8" height="8" fill="{rng.choice(["#83898a","#626b6e","#989d9b"])}"/>'
    coords=[(32,32),(40,40),(48,32),(72,56),(80,64),(72,72),(40,80),(48,88)]
    for n,(x,y) in enumerate(coords):
        shift=(idx%3-1)*8
        body+=f'<rect x="{x+shift}" y="{y}" width="8" height="8" fill="{color}"/>'
        if n%3==0: body+=f'<rect x="{x+shift+8}" y="{y}" width="8" height="8" fill="{color}" opacity=".55"/>'
    if idx>=8: body+='<path d="M88 24H96V32H88ZM88 32H80V40H88ZM96 32H104V40H96ZM88 40H96V48H88Z" fill="#efffff"/>'
    save('ore-'+name,body,True)
save('lock','<path d="M41 60V44Q41 19 64 19Q87 19 87 44V60" fill="none" stroke="#ad9bc7" stroke-width="12"/><rect x="27" y="55" width="74" height="56" rx="10" fill="#ad9bc7" stroke="#201b2c" stroke-width="5"/><circle cx="64" cy="78" r="8" fill="#201b2c"/><path d="M64 78V96" stroke="#201b2c" stroke-width="8"/>')
print('Generated 36 original garden SVGs.')
