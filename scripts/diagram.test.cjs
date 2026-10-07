const {test}=require('node:test');
const assert=require('node:assert/strict');
const knowledge=require('../data/knowledge_base.json');
const diagrams=require('../web/chapter_diagram_data.js');
const geometry=require('../web/diagram_geometry.js');

for(const chapter of knowledge.chapters) {
  test(chapter.id+' models refer to every existing knowledge paragraph',()=>{
    const group=diagrams[chapter.id];
    assert.ok(group&&group.views.length);
    assert.equal(new Set(group.views.map(view=>view.id)).size,group.views.length);
    const covered=new Set();
    for(const view of group.views) {
      assert.equal(new Set(view.nodes.map(node=>node.id)).size,view.nodes.length);
      for(const node of view.nodes) {
        assert.ok(node.text.every(text=>typeof text==='string'&&text.trim()),node.id);
        assert.ok(node.x>=0&&node.y>=0&&node.x+node.width<=view.width&&node.y+node.height<=view.height,node.id+' outside canvas');
        for(const [section,paragraph] of node.refs) {
          assert.ok(chapter.sections[section]?.content[paragraph],node.id+' invalid knowledge reference');
          covered.add(section+'-'+paragraph);
        }
      }
    }
    for(let s=0;s<chapter.sections.length;s++) for(let p=0;p<chapter.sections[s].content.length;p++) {
      assert.ok(covered.has(s+'-'+p),chapter.id+' missing '+s+'/'+p);
    }
  });
  for(const view of diagrams[chapter.id].views) {
    test(chapter.id+'/'+view.id+' routes all directed relations around the component boxes',()=>{
      const ids=new Set(view.nodes.map(node=>node.id));
      const occupied=[];
      for(const edge of view.edges) {
        assert.ok(ids.has(edge.from)&&ids.has(edge.to)&&edge.from!==edge.to);
        assert.ok(['data','address','control'].includes(edge.type));
        assert.ok(edge.label);
        const points=geometry.route(edge,view,occupied);
        occupied.push(points);
        assert.ok(points.length>=2);
        for(let i=1;i<points.length;i++) {
          assert.ok(points[i][0]===points[i-1][0]||points[i][1]===points[i-1][1],'Diagonal segment');
          for(const node of view.nodes) assert.ok(!geometry.intersects(points[i-1],points[i],geometry.box(node)),edge.from+'→'+edge.to+' crosses '+node.id);
        }
      }
      // A comparison has separate networks; each network must contain real links.
      const pending=new Set(ids);
      let networks=0;
      while(pending.size) {
        const reached=new Set([pending.values().next().value]);
        for(let i=0;i<view.nodes.length;i++) for(const edge of view.edges) {
          if(reached.has(edge.from)||reached.has(edge.to)) { reached.add(edge.from); reached.add(edge.to); }
        }
        assert.ok(reached.size>1,'Isolated component');
        for(const id of reached) pending.delete(id);
        networks++;
      }
      assert.equal(networks,view.independentNetworks||1,'Unexpected disconnected network');
    });
  }
}
const contains=(view,from,to,type)=>view.edges.some(edge=>edge.from===from&&edge.to===to&&(!type||edge.type===type));
test('CPU distinguishes the PC fetch loop, CU control and ALU data feedback',()=>{
  const cpu=diagrams.chap1.views.find(view=>view.id==='cpu');
  for(const [from,to,type] of [['pc','program','address'],['program','ir','data'],['ir','cu','data'],['cu','alu','control'],['cu','pc','control'],['cu','registers','control'],['registers','alu','data'],['alu','registers','data']]) {
    assert.ok(contains(cpu,from,to,type),from+'→'+to);
  }
  const frame=cpu.groups[0];
  for(const id of ['ir','cu','alu','pc','registers']) {
    const node=cpu.nodes.find(node=>node.id===id);
    assert.ok(node.x>=frame.x&&node.y>=frame.y&&node.x+node.width<=frame.x+frame.width&&node.y+node.height<=frame.y+frame.height,id+' outside CPU');
  }
});
test('UART uses separate SBUF buffers and separate transmit and receive directions',()=>{
  const uart=diagrams.chap5.views[0];
  for(const [from,to] of [['cpu','txbuf'],['txbuf','tx'],['rx','rxbuf'],['rxbuf','cpu']]) assert.ok(contains(uart,from,to,'data'));
  assert.ok(contains(uart,'tx','flags','control')&&contains(uart,'rx','flags','control'));
});
test('interrupt model saves the interrupted PC and restores it through RETI',()=>{
  const irq=diagrams.chap6.views[0];
  assert.ok(contains(irq,'main','stack','data'));
  assert.ok(contains(irq,'isr','stack','control'));
  assert.ok(contains(irq,'stack','main','address'));
  assert.ok(!contains(irq,'vector','stack','data'));
});
