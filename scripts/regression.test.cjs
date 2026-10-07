const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const exams = require('../web/exam_config.js');
const data = Object.fromEntries(['ktvxl','tthcm','vldc'].map(subject => [subject,
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
      if(exam.code.startsWith('VLDC_') && ['VLDC_OPTICS','VLDC_QUANTUM'].includes(exam.code)) {
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
test('random theory exams cover all six available chapters', () => {
  for(const subject of ['vldc', 'tthcm']) {
    const selected = exams.select(subject, data[subject], 'RANDOM');
    assert.equal(new Set(selected.map(exams.chapterOf)).size, 6);
  }
});
