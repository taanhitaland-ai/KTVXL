const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const models=require('../web/subject_diagram_data.js');
const sectionsFor=require('../web/diagram_knowledge.js');
const geometry=require('../web/diagram_geometry.js');
const context={window:{}};
for(const subject of ['tthcm','vldc','xstk']) {
  vm.runInNewContext(fs.readFileSync(__dirname+'/../web/'+subject+'_knowledge_data.js','utf8'),context);
  const knowledge=context.window[subject.toUpperCase()+'_KNOWLEDGE_DATA'];
  for(const chapter of knowledge.chapters) {
    const group=models[subject].chapters[chapter.id];
    test(subject+'/'+chapter.id+' has models with valid and complete source references',()=>{
      assert.ok(group&&group.views.length);
      assert.equal(new Set(group.views.map(view=>view.id)).size,group.views.length);
      const sections=sectionsFor(chapter),covered=new Set();
      for(const view of group.views) {
        assert.equal(new Set(view.nodes.map(node=>node.id)).size,view.nodes.length);
        for(const node of view.nodes) {
          assert.ok(node.text.every(text=>typeof text==='string'&&text.trim()));
          assert.ok(node.x>=0&&node.y>=0&&node.x+node.width<=view.width&&node.y+node.height<=view.height);
          for(const [s,p] of node.refs) {
            assert.ok(sections[s]?.content[p],node.id+' invalid reference '+s+'/'+p);
            covered.add(s+'-'+p);
          }
        }
      }
      const required=chapter.sections ? sections.map((section,s)=>[s,section.content.length]) : [[1,chapter.core_formulas.length]];
      for(const [s,count] of required) for(let p=0;p<count;p++) assert.ok(covered.has(s+'-'+p),'Missing source '+s+'/'+p);
      assert.ok(sections.flatMap(s=>s.content).length>=required.reduce((sum,x)=>sum+x[1],0));
    });
    for(const view of group?.views||[]) {
      test(subject+'/'+chapter.id+'/'+view.id+' forms a connected diagram with unobstructed arrows',()=>{
        const occupied=[],ids=new Set(view.nodes.map(node=>node.id));
        for(let i=0;i<view.nodes.length;i++) for(let j=i+1;j<view.nodes.length;j++) {
          const a=geometry.box(view.nodes[i]),b=geometry.box(view.nodes[j]);
          assert.ok(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y,'Overlapping components');
        }
        for(const edge of view.edges) {
          assert.ok(ids.has(edge.from)&&ids.has(edge.to)&&edge.from!==edge.to);
          assert.ok(['data','address','control'].includes(edge.type)&&edge.label);
          const points=geometry.route(edge,view,occupied);occupied.push(points);
          assert.ok(points.length>=2);
          for(let i=1;i<points.length;i++) {
            assert.ok(points[i][0]===points[i-1][0]||points[i][1]===points[i-1][1]);
            for(const node of view.nodes) assert.ok(!geometry.intersects(points[i-1],points[i],geometry.box(node)),edge.from+'→'+edge.to+' crosses '+node.id);
          }
        }
        const reached=new Set([view.nodes[0].id]);
        for(let i=0;i<view.nodes.length;i++) for(const edge of view.edges) {
          if(reached.has(edge.from)||reached.has(edge.to)) {reached.add(edge.from);reached.add(edge.to);}
        }
        assert.equal(reached.size,ids.size,'Isolated concepts');
      });
    }
  }
}
test('formula adapter includes summaries, formulas, rules and Casio without modifying the source',()=>{
  const chapter=context.window.XSTK_KNOWLEDGE_DATA.chapters[0];
  const before=JSON.stringify(chapter),sections=sectionsFor(chapter);
  assert.equal(sections[0].content[0],chapter.summary);
  assert.ok(sections[1].content[0].includes(chapter.core_formulas[0].formula));
  assert.equal(sections[2].content.length,chapter.magic_rules.length);
  assert.equal(sections[3].content.length,chapter.casio_shortcuts.length);
  assert.equal(JSON.stringify(chapter),before);
});
const has=(subject,chapter,view,from,to,type)=>models[subject].chapters[chapter].views.find(v=>v.id===view).edges.some(e=>e.from===from&&e.to===to&&(!type||e.type===type));
test('relationships distinguish feedback, Bayes normalization and limits of correlation',()=>{
  assert.ok(has('tthcm','tthcm_chap1','study','theory','practice'));
  assert.ok(has('tthcm','tthcm_chap1','study','practice','theory'));
  assert.ok(has('tthcm','tthcm_chap4','party-state','people','state'));
  assert.ok(has('tthcm','tthcm_chap4','party-state','state','people'));
  assert.ok(has('vldc',1,'lc','capacitor','inductor'));
  assert.ok(has('vldc',1,'lc','inductor','capacitor'));
  assert.ok(has('xstk','chap2','bayes','joint','posterior'));
  assert.ok(has('xstk','chap2','bayes','total','posterior'));
  assert.ok(has('xstk','chap5','joint','independent','covariance'));
  assert.ok(!has('xstk','chap5','joint','covariance','independent'));
});
test('subjects with the same chapter ID have separate contents',()=>{
  const micro=require('../web/chapter_diagram_data.js');
  assert.notEqual(micro.chap1.views[0].id,models.xstk.chapters.chap1.views[0].id);
  assert.deepEqual(models.xstk.legend,['Dữ liệu / kết quả','Phương pháp','Điều kiện']);
});
