// Orthogonal routes avoid component boxes; no remote layout library is needed.
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KMA_DIAGRAM_GEOMETRY = api;
})(typeof window === 'undefined' ? globalThis : window, function () {
  const box = (node, pad = 0) => ({x:node.x-pad,y:node.y-pad,width:node.width+pad*2,height:node.height+pad*2});
  const inside = (p,b) => p[0]>b.x && p[0]<b.x+b.width && p[1]>b.y && p[1]<b.y+b.height;
  function intersects(a,b,rect) {
    if (a[0] === b[0]) return a[0]>rect.x && a[0]<rect.x+rect.width && Math.max(a[1],b[1])>rect.y && Math.min(a[1],b[1])<rect.y+rect.height;
    if (a[1] === b[1]) return a[1]>rect.y && a[1]<rect.y+rect.height && Math.max(a[0],b[0])>rect.x && Math.min(a[0],b[0])<rect.x+rect.width;
    return true;
  }
  function port(node, value) {
    const [side, ratio = .5] = Array.isArray(value) ? value : [value];
    if (side === 'left') return {point:[node.x,node.y+node.height*ratio],direction:[-1,0]};
    if (side === 'right') return {point:[node.x+node.width,node.y+node.height*ratio],direction:[1,0]};
    if (side === 'top') return {point:[node.x+node.width*ratio,node.y],direction:[0,-1]};
    return {point:[node.x+node.width*ratio,node.y+node.height],direction:[0,1]};
  }
  function compact(points) {
    const clean = [];
    for (const point of points) {
      if (clean.length && point[0]===clean.at(-1)[0] && point[1]===clean.at(-1)[1]) continue;
      while (clean.length>1) {
        const a=clean.at(-2), b=clean.at(-1);
        if ((a[0]===b[0]&&b[0]===point[0]) || (a[1]===b[1]&&b[1]===point[1])) clean.pop();
        else break;
      }
      clean.push(point);
    }
    return clean;
  }
  function route(edge, model, occupied = []) {
    const from=model.nodes.find(node=>node.id===edge.from), to=model.nodes.find(node=>node.id===edge.to);
    const dx=to.x+to.width/2-from.x-from.width/2, dy=to.y+to.height/2-from.y-from.height/2;
    const horizontal=Math.abs(dx)>Math.abs(dy);
    const start=port(from,edge.fromPort||(horizontal?(dx>0?'right':'left'):(dy>0?'bottom':'top')));
    const end=port(to,edge.toPort||(horizontal?(dx>0?'left':'right'):(dy>0?'top':'bottom')));
    if (edge.via) return compact([start.point,...edge.via,end.point]);
    const a=start.point.map((value,index)=>value+start.direction[index]*20);
    const b=end.point.map((value,index)=>value+end.direction[index]*20);
    const obstacles=model.nodes.map(node=>box(node,12));
    const xs=[18,model.width-18,a[0],b[0]], ys=[18,model.height-18,a[1],b[1]];
    for (const node of model.nodes) { xs.push(node.x-18,node.x+node.width+18); ys.push(node.y-18,node.y+node.height+18); }
    const segments=[];
    for(const points of occupied) for(let index=1;index<points.length;index++) {
      const p=points[index-1],q=points[index];
      segments.push([p,q]);
      if(p[0]===q[0]) xs.push(p[0]-10,p[0]+10);
      else ys.push(p[1]-10,p[1]+10);
    }
    const unique=values=>[...new Set(values.filter(value=>value>=0))].sort((a,b)=>a-b);
    const x=unique(xs), y=unique(ys);
    const ax=x.indexOf(a[0]), ay=y.indexOf(a[1]), bx=x.indexOf(b[0]), by=y.indexOf(b[1]);
    const queue=[], best=new Map(), previous=new Map();
    function push(item) {
      queue.push(item);
      let i=queue.length-1;
      while(i>0) { const parent=(i-1)>>1; if(queue[parent].score<=item.score) break; queue[i]=queue[parent]; i=parent; }
      queue[i]=item;
    }
    function pop() {
      const first=queue[0], last=queue.pop();
      if(queue.length) {
        let i=0;
        while(i*2+1<queue.length) {
          let child=i*2+1;
          if(child+1<queue.length&&queue[child+1].score<queue[child].score) child++;
          if(queue[child].score>=last.score) break;
          queue[i]=queue[child]; i=child;
        }
        queue[i]=last;
      }
      return first;
    }
    const key=(i,j,d)=>i+','+j+','+d;
    const startKey=key(ax,ay,0);
    best.set(startKey,0);
    push({i:ax,j:ay,d:0,key:startKey,cost:0,score:Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])});
    let final=null;
    while(queue.length) {
      const current=pop();
      if(current.cost!==best.get(current.key)) continue;
      if(current.i===bx&&current.j===by) { final=current; break; }
      const point=[x[current.i],y[current.j]];
      for (const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1]]) {
        const i=current.i+di,j=current.j+dj;
        if(i<0||j<0||i>=x.length||j>=y.length) continue;
        const next=[x[i],y[j]];
        if(obstacles.some(rect=>inside(next,rect)||intersects(point,next,rect))) continue;
        const d=di?1:2, id=key(i,j,d);
        let traffic=0;
        for(const [p,q] of segments) {
          if(di&&p[1]===q[1]&&point[1]===p[1]) {
            traffic+=Math.max(0,Math.min(Math.max(point[0],next[0]),Math.max(p[0],q[0]))-Math.max(Math.min(point[0],next[0]),Math.min(p[0],q[0])))*8;
          } else if(dj&&p[0]===q[0]&&point[0]===p[0]) {
            traffic+=Math.max(0,Math.min(Math.max(point[1],next[1]),Math.max(p[1],q[1]))-Math.max(Math.min(point[1],next[1]),Math.min(p[1],q[1])))*8;
          } else if(di&&p[0]===q[0]&&p[0]>Math.min(point[0],next[0])&&p[0]<Math.max(point[0],next[0])&&point[1]>Math.min(p[1],q[1])&&point[1]<Math.max(p[1],q[1])) traffic+=35;
          else if(dj&&p[1]===q[1]&&p[1]>Math.min(point[1],next[1])&&p[1]<Math.max(point[1],next[1])&&point[0]>Math.min(p[0],q[0])&&point[0]<Math.max(p[0],q[0])) traffic+=35;
        }
        const cost=current.cost+Math.abs(next[0]-point[0])+Math.abs(next[1]-point[1])+(current.d&&current.d!==d?24:0)+traffic;
        if(cost>=(best.get(id)??Infinity)) continue;
        best.set(id,cost); previous.set(id,current);
        push({i,j,d,key:id,cost,score:cost+Math.abs(next[0]-b[0])+Math.abs(next[1]-b[1])});
      }
    }
    if(!final) throw new Error('Cannot route '+edge.from+' → '+edge.to);
    const points=[];
    for(let current=final;current;current=previous.get(current.key)) points.push([x[current.i],y[current.j]]);
    return compact([start.point,...points.reverse(),end.point]);
  }
  return {route,intersects,box};
});
