const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const exams = require('../web/exam_config.js');
const data = Object.fromEntries(['ktvxl','tthcm','vldc','xstk'].map(subject => [subject,
  JSON.parse(fs.readFileSync(path.join(__dirname, '../data', subject === 'ktvxl' ? 'questions_db.json' : subject+'_questions_db.json'),'utf8'))
]));

for (const [subject, questions] of Object.entries(data)) {
  test(subject+' question IDs are unique and each key points to an option', () => {
    assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
    for(const q of questions) {
      if(q.type==='mcq') assert.ok(q.options[String(q.answer).charCodeAt(0)-65], q.id);
    }
  });
  for(const exam of exams.catalog(subject, questions)) {
    test(subject+' selects exactly '+exam.code+' with the advertised question count', () => {
      const selected = exams.select(subject, questions, exam.code, () => .375);
      assert.equal(selected.length, exam.count);
      assert.equal(new Set(selected.map(q => q.id)).size, selected.length);
      if(exam.code === 'RANDOM') return;
      if(['XSTK_PROB','XSTK_STAT'].includes(exam.code)) {
        assert.ok(selected.every(q => exam.code === 'XSTK_PROB' ? exams.chapterOf(q) <= 5 : exams.chapterOf(q) >= 6));
      } else if(['VLDC_OPTICS','VLDC_QUANTUM'].includes(exam.code)) {
        assert.ok(selected.every(q => exam.code === 'VLDC_OPTICS' ? exams.chapterOf(q) <= 2 : exams.chapterOf(q) >= 3));
      } else {
        assert.ok(selected.every(q => subject === 'ktvxl' ? q.exam_id === 'DE_'+exam.code.padStart(3,'0') : q.source === exam.code));
        assert.deepEqual(selected.map(q => q.id), exams.select(subject, questions, exam.code, () => .8).map(q => q.id));
      }
    });
  }
  test(subject+' rejects unavailable exam codes without a substitute', () => {
    assert.deepEqual(exams.select(subject, questions, 'NONEXISTENT'), []);
    assert.deepEqual(exams.select(subject, [], exams.catalog(subject, questions)[0].code), []);
  });
}
test('random Vi xu ly exam contains 35 MCQs and 5 fill-in questions', () => {
  const selected = exams.select('ktvxl', data.ktvxl, 'RANDOM');
  assert.equal(selected.filter(q => q.type==='mcq').length, 35);
  assert.equal(selected.filter(q => q.type==='fib').length, 5);
});
test('random theory exams cover every available chapter', () => {
  for(const subject of ['vldc', 'tthcm', 'xstk']) {
    const selected = exams.select(subject, data[subject], 'RANDOM');
    assert.equal(new Set(selected.map(exams.chapterOf)).size, subject === 'xstk' ? 8 : 6);
  }
});

test('small XSTK source exams do not add questions from other banks', () => {
  for (const [code, count] of [['KMA_EXAM_01',7],['KMA_EXAM_02',4],['KMA_EXAM_03',4],['KMA_EXAM_04',4],['KMA_EXAM_05',6]]) {
    const selected = exams.select('xstk', data.xstk, code);
    assert.equal(selected.length, count);
    assert.ok(selected.every(q => q.source === code));
  }
});

test('sparse Vi xu ly random exams advertise the available question mix', () => {
  const questions = data.ktvxl.filter(q => q.type === 'mcq').slice(0, 37);
  const entry = exams.catalog('ktvxl', questions).find(e => e.code === 'RANDOM');
  assert.equal(exams.select('ktvxl', questions, 'RANDOM').length, entry.count);
});

test('XSTK chapter groups match probability and statistics content', () => {
  for (const [id, chapter] of [['xstk_ch4_012',2],['xstk_ch5_001',3],['xstk_ch6_008',4],['xstk_ch6_013',5],['xstk_ch7_013',6]]) {
    assert.equal(exams.chapterOf(data.xstk.find(q => q.id === id)), chapter);
  }
  assert.equal(exams.select('xstk', data.xstk, 'XSTK_STAT').length, 32);
});

test('revised answers preserve corrected values after conversion to four-choice questions', () => {
  const normalize = value => String(value).trim().toUpperCase().replace(/H$/, '').replace(/^([01]+)B$/, '$1');
  for (const [id, correct, stale] of [
    ['DE001_Q23','C.7','58'], ['PART_11_Q12','20','00'],
    ['PART_11_Q58','5B','80'], ['PART_11_Q65','40','81'],
    ['PART_11_Q66','4F','30'], ['PART_11_Q67','72','60'],
    ['PART_11_Q68','1011','85'], ['PART_13_Q21','13','40']
  ]) {
    const q = data.ktvxl.find(q => q.id === id);
    const answerValue = q.type === 'mcq' ? q.options[q.answer.charCodeAt(0)-65] : q.answer;
    assert.equal(normalize(answerValue), normalize(correct), id);
    assert.notEqual(normalize(answerValue), normalize(stale), id);
    if (id.startsWith('PART_')) {
      assert.equal(q.type, 'mcq', id);
      assert.equal(q.options.length, 4, id);
      assert.deepEqual(q.acceptable_answers, [q.answer], id);
    } else {
      assert.equal(q.type, 'fib', id);
      assert.ok(q.acceptable_answers.some(value => normalize(value) === normalize(correct)), id);
      assert.ok(!q.acceptable_answers.some(value => normalize(value) === normalize(stale)), id);
    }
  }
  const q = data.ktvxl.find(q => q.id === 'PART_11_Q54');
  assert.equal(q.type, 'mcq');
  assert.equal(q.options[q.answer.charCodeAt(0)-65], 'CY=0, P=0');
});

test('revised probability keys match calculations from the stated distributions', () => {
  const answer = id => {
    const q = data.xstk.find(q => q.id === id);
    return q.options[q.answer.charCodeAt(0)-65];
  };
  const probability = .6**2 * 2*.7*.3 + 2*.6*.4 * .7**2;
  assert.match(answer('xstk_ch2_011'), new RegExp(probability.toFixed(4).replace('.', '\\{,\\}')));
  const above = [.1,.3,.4,.2].reduce((total, px, x) =>
    total + px * [.1,.2,.3,.3,.1].slice(0,x).reduce((sum, py) => sum+py,0),0);
  assert.match(answer('xstk_ch5_013'), new RegExp(above.toFixed(2).replace('.', '\\{,\\}')));
  const values = [0,1,2,3].map(x => x**3-4*x**2+10), probabilities = [.2,.3,.3,.2];
  const mean = values.reduce((sum, value, i) => sum+value*probabilities[i],0);
  const variance = values.reduce((sum, value, i) => sum+value**2*probabilities[i],0)-mean**2;
  assert.match(answer('xstk_ch5_016'), new RegExp(mean.toFixed(2).replace('.', '\\{,\\}')));
  assert.match(answer('xstk_ch5_016'), new RegExp(variance.toFixed(2).replace('.', '\\{,\\}')));
  assert.match(data.xstk.find(q=>q.id==='xstk_ch2_009').prompt, /tỷ lệ sản phẩm đạt tiêu chuẩn/);
});

test('LC oscillator and grating explanations preserve consistent units', () => {
  // pi^2=10 is stipulated by the oscillator problem.
  const angularFrequency = 1/Math.sqrt(.1*.25e-6);
  assert.ok(Math.abs(angularFrequency-2000*Math.sqrt(10))<1e-9);
  const oscillator = data.vldc.find(q=>q.id==='vldc_nc_017');
  assert.match(oscillator.prompt, /C = 0\{,\}25/);
  assert.equal(oscillator.answer,'D');
  assert.match(oscillator.explanation,/2000\\sqrt\{10\}/);
  const grating = data.vldc.find(q=>q.id==='vldc_n100_026');
  assert.match(grating.prompt, /1\\,\\mathrm\{cm\}/);
  assert.ok(Math.abs(2e-6*1e-2/((.4404-.4047)*1e-6)-.56)<.001);
  assert.equal(grating.answer,'B');
});
