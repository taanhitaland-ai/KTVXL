// Present both chapter formats to the diagram without changing the source data.
(function (root, factory) {
  const adapter = factory();
  if (typeof module === 'object' && module.exports) module.exports = adapter;
  else root.KMA_DIAGRAM_KNOWLEDGE = adapter;
})(typeof window === 'undefined' ? globalThis : window, function () {
  return function sectionsFor(chapter) {
    if (Array.isArray(chapter.sections)) return chapter.sections;
    const sections = [
      { title:'Tổng quan', content:chapter.summary ? [chapter.summary] : [] },
      { title:'Công thức cốt lõi', content:(chapter.core_formulas || []).map(item =>
        '**'+item.name+'**: '+item.formula+'\n\n'+item.desc) }
    ];
    for (const [key,title] of [['magic_rules','Quy tắc và phương pháp'],['casio_shortcuts','Thao tác máy tính']]) {
      if (chapter[key]?.length) sections.push({title,content:chapter[key]});
    }
    if (chapter.magic_keywords?.length) sections.push({ title:'Từ khóa nhận diện',
      content:chapter.magic_keywords.map(item=>'**'+item.kw+'**: '+item.meaning) });
    return sections;
  };
});
