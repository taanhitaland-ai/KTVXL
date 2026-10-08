"""Academic regression checks for the reviewed Part 9–18 practice bank.

The structural site audit alone cannot detect a plausible but wrong answer.
These checks execute data/branch exercises and reverse-check timer/UART results.
"""
import itertools
import json
from pathlib import Path
import re
import unittest
import unicodedata
from mcs51_review_model import CPU, number

ROOT = Path(__file__).resolve().parents[1]
ALL = json.loads((ROOT/'data/questions_db.json').read_text(encoding='utf-8'))
DATA = {q['id']: q for q in ALL if re.match(r'PART_(09_(ROOT|BT)|1[0-8])_Q', q['id'])}

def q(part, n):
    return DATA[f'PART_{part:02d}_Q{n:02d}']

def value(item):
    return item['options'][ord(item['answer'])-65]

def code(item):
    return '\n'.join(item['extra_lines'])

def hexbyte(text):
    return int(re.search(r'([0-9A-F]+)H', text)[1], 16)

class ReviewedBank(unittest.TestCase):
    def test_scope_and_four_distinct_choices(self):
        self.assertEqual(len(DATA), 546)
        report=json.loads((ROOT/'data/reviews/vixuly_parts_09_18_2026_10_09.json').read_text(encoding='utf-8'))
        self.assertEqual({r['id'] for r in report['records']}, set(DATA))
        for item in DATA.values():
            with self.subTest(id=item['id']):
                self.assertEqual(item['type'], 'mcq')
                self.assertEqual(len(item['options']), 4)
                self.assertEqual(len(set(item['options'])), 4)
                self.assertIn(item['answer'], 'ABCD')
                self.assertEqual(item['acceptable_answers'], [item['answer']])
                self.assertNotIn('Không bao giờ tiết lộ',item['prompt'])
                for text in [item['prompt'],*item['options'],*item['extra_lines']]:
                    self.assertEqual(text, unicodedata.normalize('NFC', text))
        for r in report['records']:
            self.assertTrue((ROOT/r['source_pdf']).is_file(), r['id'])
            self.assertEqual(value(DATA[r['id']]), r['value'])

    def test_alu_exhaustive_against_bit_flag_identities(self):
        # Independent OV/AC identities, rather than the signed/nibble comparisons
        # in the executable model. Includes every byte pair and both carry states.
        cpu=CPU()
        for a,b in itertools.product(range(256),repeat=2):
            for op,c in [('ADD',0),('ADDC',0),('ADDC',1),('SUBB',0),('SUBB',1)]:
                cpu.write('A',a);cpu.writebit('C',c);cpu.alu(op,b)
                total=a-b-c if op=='SUBB' else a+b+c
                result=total&255;flags=cpu.flags()
                ov=bool(((a^b)&(a^result)&128) if op=='SUBB' else ((~(a^b))&(a^result)&128))
                ac=((a^b^result)>>4)&1
                carry=int(total<0 if op=='SUBB' else total>255)
                self.assertEqual((cpu.read('A'),flags['CY'],flags['AC'],flags['OV']), (result,carry,ac,int(ov)),(a,b,c,op))

    def test_every_part11_register_and_flag_exercise(self):
        for item in (q(11,n) for n in range(4,70)):
            with self.subTest(id=item['id']):
                cpu=CPU()
                if item['extra_lines']:
                    cpu.run(code(item))
                    actual=cpu.flags()
                    for name,bit in re.findall(r'(CY|AC|OV|P)=(\d)',value(item)):
                        self.assertEqual(actual[name], int(bit))
                    continue
                before,after=re.split(r'sau khi (?:thực thi|thực hiện) lệnh:?\s*',item['prompt'],maxsplit=1)
                states={k:int(v,16) for k,v in re.findall(r'\(?\b(A|B|PSW|R[0-7]|[0-9A-F]{2}H)\)?\s*=\s*([0-9A-F]+)H',before)}
                cpu.write('PSW',states.pop('PSW',0))
                for reg,v in states.items():cpu.write(reg,v)
                cpu.run(after.split('thì',1)[0].strip())
                if 'các cờ' in after:
                    flags=cpu.flags();bits=''.join(str(flags[x]) for x in ['CY','AC','OV','P'])
                    self.assertEqual(value(item), bits+'B')
                else:
                    reg=re.search(r'(?:thanh ghi|ô nhớ(?: có địa chỉ)?)\s+(PSW|R[0-7]|A|B|[0-9A-F]{2}H)',after)[1]
                    self.assertEqual(cpu.read(reg),hexbyte(value(item)))

    def test_every_part12_program(self):
        for n in range(4,58):
            item=q(12,n)
            with self.subTest(id=item['id']):
                reg=re.search(r'(?:thanh ghi|ô nhớ RAM nội) ([A-Z0-9]+)',item['prompt'])[1]
                self.assertEqual(CPU().run(code(item)).read(reg),hexbyte(value(item)))

    def test_part13_all_parameter_choices_are_unique(self):
        goals={4:{'B':2,'A':0x58},7:{'A':0x34},8:{'A':0x19},12:{'A':0x40},13:{'B':5,'A':0x40},16:{'B':13,'A':0x35},18:{'A':0x1C},19:{'R1':0x4E},20:{'A':0x27},21:{'20H':0x13},24:{'A':0x80},26:{'A':0x5A},28:{'A':0x7C},29:{'A':0x2C},31:{'A':0x91},37:{'A':0xC1},39:{'B':2,'A':4},40:{'A':0x7C,'30H':0x4B},42:{'B':0x28,'A':0},43:{'A':0x7B}}
        for n,target in goals.items():
            item=q(13,n);good=[]
            for opt in item['options']:
                try:state=CPU().run(code(item).replace('?',opt))
                except (AssertionError, IndexError):continue
                if all(state.read(k)==v for k,v in target.items()):good.append(opt)
            self.assertEqual(good,[value(item)],item['id'])
        # A valid OR mask must work for all starting latch values, not accidentally
        # match one example. This catches the ambiguous 25H/26H source alternatives.
        item=q(13,14);good=[]
        for opt in item['options']:
            mask=hexbyte(opt)
            if all((x|mask)==(x|0x26) for x in range(256)):good.append(opt)
        self.assertEqual(good,[value(item)])

    def test_part13_branch_rotation_and_loop_results(self):
        for n,reg in [(9,'A'),(10,'A'),(23,'A'),(32,'A'),(33,'A'),(38,'30H'),(41,'A')]:
            self.assertEqual(CPU().run(code(q(13,n))).read(reg),hexbyte(value(q(13,n))))
        for x in range(256):
            cpu=CPU();cpu.write('20H',x);cpu.run(code(q(13,36)))
            self.assertEqual(cpu.read('21H'),x.bit_count())
        for data in itertools.product([0,1,127,128,255],repeat=3):
            cpu=CPU();cpu.write('R1',0x40);cpu.write('40H',3)
            for addr,v in enumerate(data,0x41):cpu.write(f'{addr:02X}H',v)
            self.assertEqual(cpu.run(code(q(13,27))).read('A'),max(data))
        for n,cycles in [(5,5033),(17,1006033),(22,92419),(30,503018)]:
            # Derive timing from the actual nested-loop initializers. A zero
            # byte counter wraps through 256 decrements before reaching zero.
            initializers=re.findall(r'MOV R[0-7], (#\w+)',code(q(13,n)))
            counts=[number(v) or 256 for v in initializers]
            loop_cycles=counts[-1]*2  # Innermost DJNZ, two machine cycles.
            for count in reversed(counts[:-1]):
                loop_cycles=count*(1+loop_cycles+2)  # Reload, inner loop, DJNZ.
            calculated=1+loop_cycles+2  # First MOV and RET.
            self.assertEqual(calculated,cycles)
            self.assertEqual(value(q(13,n)),f'{calculated} µs')

    def test_twos_complement_program_transmits_carry(self):
        for x in [0,1,127,128,255,256,257,32767,32768,65534,65535]:
            cpu=CPU();cpu.write('R1',x>>8);cpu.write('R0',x);cpu.run(code(q(14,15)))
            self.assertEqual(cpu.read('R3')*256+cpu.read('R2'),(-x)&65535)
        cpu=CPU().run(code(q(14,19)));self.assertEqual(cpu.read('A'),3)

    def test_timer_preloads_reverse_to_requested_time(self):
        for item in (q(16,n) for n in range(4,39) if not q(16,n)['extra_lines']):
            p=item['prompt'];mhz=float(re.search(r'fosc=(\d+) MHz',p)[1]);mode=int(re.search(r'mode (\d)',p)[1]);wanted=int(re.search(r'khoảng (\d+) µs',p)[1]);tick=12/mhz
            capacity={0:8192,1:65536,2:256}[mode]
            if wanted/tick>capacity:
                self.assertEqual(value(item),'Không thể tạo bằng một lần tràn ở mode này');continue
            nums=re.findall(r'= ([0-9A-F]+)H',value(item))
            if mode==2:x=int(nums[0],16)
            else:
                hi,lo=map(lambda v:int(v,16),nums)
                self.assertLess(lo,32 if mode==0 else 256)
                x=hi*(32 if mode==0 else 256)+lo
            self.assertEqual((capacity-x)*tick,wanted,item['id'])
        for n,x in [(6,50485),(19,7192),(25,55536),(34,3096),(35,3192),(41,6928),(46,24600)]:
            self.assertEqual(value(q(15,n)),f'X = {x}')
        for n,x in [(5,0x21),(8,0xD6),(21,0xDA),(28,0x2D),(37,0x6B),(45,0xAD)]:
            self.assertEqual(hexbyte(value(q(15,n))),x)

    def test_waveform_period_units_and_pwm(self):
        for n,period in [(5,39616),(6,2000),(7,20000),(20,100000),(24,100),(25,200),(29,1000),(34,1000),(35,100)]:
            program=code(q(16,n));mode=number(re.search(r'MOV TMOD, (#\w+)',program)[1])&3
            hi=number(re.search(r'MOV TH0, (#\w+)',program)[1]);lo=number(re.search(r'MOV TL0, (#\w+)',program)[1])
            x=hi*32+(lo&31) if mode==0 else hi*256+lo if mode==1 else lo
            self.assertEqual(2*({0:8192,1:65536,2:256}[mode]-x),period)
            self.assertNotIn('SJMP TOINT1',program)
        pwm=code(q(16,32));preloads=[int(a,16)*256+int(b,16) for a,b in re.findall(r'MOV TH0, #([0-9A-F]+)H\nMOV TL0, #([0-9A-F]+)H',pwm)]
        high,low=[65536-x for x in preloads]
        self.assertEqual((high,low),(922,1690))
        self.assertAlmostEqual(1000000/(high+low),382.85,places=2)
        self.assertAlmostEqual(high/(high+low)*100,35.30,places=2)

    def test_uart_baud_ascii_and_scon(self):
        for n,rate in [(4,2400),(9,4800),(11,1200),(15,4800),(17,9600),(18,1200)]:
            self.assertEqual(11059200/(384*(256-hexbyte(value(q(18,n))))),rate)
            self.assertIn('SMOD=0',q(18,n)['prompt'])
        for n,char in [(7,'k'),(12,'9'),(16,'K'),(23,'y'),(24,'B'),(35,'<')]:
            self.assertEqual(hexbyte(value(q(18,n))),ord(char))
        for n,mode in [(25,3),(28,1),(29,0),(31,2)]:
            self.assertEqual(hexbyte(value(q(18,n))),(mode<<6)|16)
        for n,char,rate in [(14,'A',4800),(21,'w',9600),(27,'A',4800),(32,'P',2400)]:
            program=code(q(18,n));reload=hexbyte(re.search(r'MOV TH1, #(\w+)',program)[1])
            self.assertEqual(11059200/(384*(256-reload)),rate)
            self.assertEqual(hexbyte(re.search(r'MOV SBUF, #(\w+)',program)[1]),ord(char))
            self.assertIn('Truyền',value(q(18,n)))
        for n,port in [(22,'P3'),(34,'P1')]:
            self.assertIn('JNB RI, LOOP',code(q(18,n)))
            self.assertIn(f'MOV {port}, A',code(q(18,n)))

    def test_known_classification_and_addressing_errors(self):
        cases={'PART_09_ROOT_Q12':'INC','PART_09_ROOT_Q39':'CJNE','PART_09_ROOT_Q53':'R0, R1','PART_09_ROOT_Q69':'MOV A, 30H','PART_10_Q11':'Cả bốn lệnh đều hợp lệ','PART_10_Q15':'ANL 00H, #7FH','PART_17_Q10':'RXD'}
        for qid,v in cases.items():self.assertEqual(value(DATA[qid]),v)
        for program in ['MOV R1, #80H\nMOV A, @R1','MOV R0, #0F0H\nMOV @R0, A','ANL R0, #7FH','XCHD A, 50H']:
            with self.assertRaises(AssertionError):CPU().run(program)

if __name__=='__main__':
    unittest.main(verbosity=2)
