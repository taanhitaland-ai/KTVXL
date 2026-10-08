"""Restricted MCS-51 data/branch model for checking reviewed exercise programs.

Not a hardware emulator: no timer, UART or interrupt simulation.
Rejects unimplemented AT89C51 indirect RAM and unsupported instruction forms.
"""
import re

def number(s):
    s=s.strip().upper()
    if s.startswith('#'):s=s[1:]
    if s.startswith('0X'):return int(s,16)
    if s.endswith('H'):return int(s[:-1],16)
    if s.endswith('B') and set(s[:-1])<=set('01'):return int(s[:-1],2)
    return int(s,10)

class CPU:
    """Small, strict 12T MCS-51 data/branch evaluator, not a hardware timing simulator."""
    sfr={'A':0xE0,'ACC':0xE0,'B':0xF0,'PSW':0xD0,'P0':0x80,'P1':0x90,'P2':0xA0,'P3':0xB0,'DPL':0x82,'DPH':0x83,'SP':0x81}
    def __init__(self):self.m=[0]*256;self.trace=[];self.table=[];self.steps=0
    def addr(self,s):
        if re.fullmatch(r'R[0-7]',s):return ((self.m[0xD0]>>3)&3)*8+int(s[1])
        if s in self.sfr:return self.sfr[s]
        return number(s)
    def bit(self,s):
        if s in ['C','CY']:return 0xD0,7
        if s=='AC':return 0xD0,6
        if '.' in s:
            reg,b=s.split('.');return self.addr(reg),int(b)
        n=number(s);return (0x20+n//8,n%8) if n<128 else (n&0xF8,n%8)
    def readbit(self,s):
        invert=s.startswith('/');s=s.lstrip('/');a,b=self.bit(s);return ((self.m[a]>>b)&1)^int(invert)
    def writebit(self,s,v):a,b=self.bit(s);self.m[a]=(self.m[a]&~(1<<b))|((v&1)<<b)
    def read(self,s):
        if s in ['C','CY'] or '.' in s or s.startswith('/'):return self.readbit(s)
        if s.startswith('#'):return number(s)
        if s=='DPTR':return self.m[0x83]*256+self.m[0x82]
        if s.startswith('@'):
            assert s in ['@R0','@R1'],s
            a=self.read(s[1:]);assert a<128,('RAM AT89C51 ngoài 00H–7FH',s,hex(a));return self.m[a]
        return self.m[self.addr(s)]
    def write(self,s,v):
        if s in ['C','CY'] or '.' in s:return self.writebit(s,v)
        if s=='DPTR':self.m[0x82]=v&255;self.m[0x83]=(v>>8)&255;return
        if s.startswith('@'):
            assert s in ['@R0','@R1'],s
            a=self.read(s[1:]);assert a<128,(s,a)
        else:a=self.addr(s)
        self.m[a]=v&255
    def flags(self):return dict(CY=self.readbit('C'),AC=self.readbit('AC'),OV=(self.m[0xD0]>>2)&1,P=self.m[0xD0]&1)
    def alu(self,op,v):
        a=self.read('A');c=self.readbit('C') if op in ['ADDC','SUBB'] else 0
        signed=lambda v:v-256 if v&128 else v
        if op=='SUBB':
            full=a-v-c;carry=int(full<0);ac=int((a&15)<(v&15)+c);signedtotal=signed(a)-signed(v)-c
        else:
            full=a+v+c;carry=int(full>255);ac=int((a&15)+(v&15)+c>15);signedtotal=signed(a)+signed(v)+c
        self.write('A',full);self.writebit('C',carry);self.writebit('AC',ac)
        self.m[0xD0]=(self.m[0xD0]&~4)|(int(not -128<=signedtotal<=127)<<2)
        return f'{a:02X}H '+('-' if op=='SUBB' else '+')+f' {v:02X}H'+(f" {'-' if op=='SUBB' else '+'} CY({c})" if op!='ADD' else '')+f' = {full} → A={full&255:02X}H'
    def run(self,code):
        lines=code.splitlines();instructions=[];labels={}
        for l in lines:
            l=l.split(';')[0].strip().upper()
            if not l:continue
            if ':' in l:label,l=l.split(':',1);labels[label.strip()]=len(instructions);l=l.strip()
            if l:instructions.append(l)
        for l in instructions:
            if l.startswith('DB '):self.table.extend(number(v) for v in l[3:].split(','))
        pc=0
        while pc<len(instructions):
            self.steps+=1;assert self.steps<100000,('loop',code)
            ins=instructions[pc];pc+=1;op,*rest=ins.split(None,1);args=[x.strip() for x in rest[0].split(',')] if rest else []
            if op in ['ORG','EQU']:continue
            if op in ['END','RET','DB']:break
            note=''
            if op=='MOV':
                assert not (args[0].startswith('#') or args[0].startswith('R') and args[1].startswith('R')),ins
                if args[1]=='#TABLE':self.write(args[0],0)
                elif args[0] in ['C','CY'] or '.' in args[0]:self.writebit(args[0],self.readbit(args[1]) if args[1] not in ['C','CY'] else self.read(args[1]))
                elif args[0] in ['A','ACC'] and args[1] in ['C','CY']:raise AssertionError(ins)
                elif args[0] not in ['C','CY'] and args[1] in ['C','CY']:raise AssertionError(ins)
                else:self.write(args[0],self.read(args[1]))
            elif op in ['ADD','ADDC','SUBB']:
                assert args[0]=='A',ins;note=self.alu(op,self.read(args[1]))
            elif op in ['ANL','ORL','XRL']:
                assert args[0]=='A' or args[0] in ['C','CY'] or not re.fullmatch(r'R[0-7]|@R[01]',args[0]),ins
                a=self.read(args[0]);b=self.read(args[1]);v=(a&b) if op=='ANL' else (a|b) if op=='ORL' else (a^b);self.write(args[0],v)
            elif op in ['INC','DEC']:self.write(args[0],self.read(args[0])+(1 if op=='INC' else -1))
            elif op in ['CLR','SETB','CPL']:
                if args[0]=='A':self.write('A',0 if op=='CLR' else self.read('A')^255);assert op!='SETB',ins
                else:self.writebit(args[0],0 if op=='CLR' else 1 if op=='SETB' else self.readbit(args[0])^1)
            elif op in ['RL','RR','RLC','RRC','SWAP']:
                assert args==['A'],ins
                a=self.read('A');c=self.readbit('C')
                if op=='SWAP':v=(a<<4)|(a>>4)
                elif op=='RL':v=(a<<1)|(a>>7)
                elif op=='RR':v=(a>>1)|(a<<7)
                elif op=='RLC':v=(a<<1)|c;self.writebit('C',a>>7)
                else:v=(a>>1)|(c<<7);self.writebit('C',a&1)
                self.write('A',v)
            elif op in ['MUL','DIV']:
                assert args==['AB'],ins;a=self.read('A');b=self.read('B');self.writebit('C',0)
                if op=='MUL':v=a*b;self.write('A',v);self.write('B',v>>8);ov=int(v>255)
                else:assert b!=0,ins;self.write('A',a//b);self.write('B',a%b);ov=0
                self.m[0xD0]=(self.m[0xD0]&~4)|(ov<<2)
            elif op in ['XCH','XCHD']:
                assert args[0]=='A',ins;a=self.read('A');b=self.read(args[1])
                if op=='XCHD':assert args[1] in ['@R0','@R1'],ins;self.write('A',(a&240)|(b&15));self.write(args[1],(b&240)|(a&15))
                else:self.write('A',b);self.write(args[1],a)
            elif op=='MOVC':assert args==['A','@A+DPTR'],ins;self.write('A',self.table[self.read('A')])
            elif op in ['JZ','JNZ','SJMP','JC','JNC','DJNZ','CJNE','JB','JNB','JBC']:
                target=args[-1]
                if target=='$':break
                if op=='DJNZ':self.write(args[0],self.read(args[0])-1);take=self.read(args[0])!=0
                elif op=='CJNE':a=self.read(args[0]);b=self.read(args[1]);self.writebit('C',int(a<b));take=a!=b
                elif op in ['JB','JNB','JBC']:
                    bit=self.readbit(args[0]);take=bit==(0 if op=='JNB' else 1)
                    if op=='JBC' and take:self.writebit(args[0],0)
                else:take=True if op=='SJMP' else self.read('A')==0 if op=='JZ' else self.read('A')!=0 if op=='JNZ' else self.readbit('C')==(1 if op=='JC' else 0)
                if take:pc=labels[target]
            else:raise AssertionError(('unsupported',ins))
            self.m[0xD0]=(self.m[0xD0]&~1)|(self.read('A').bit_count()%2)
            if len(self.trace)<8:self.trace.append(ins+': '+(note or f'A={self.read("A"):02X}H'))
        return self
