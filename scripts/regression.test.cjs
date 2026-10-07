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
