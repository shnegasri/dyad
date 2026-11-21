(() => {
  const exams = [
    { id: 'ssc-cgl', title: 'SSC Combined Graduate Level', category: 'SSC', level: 'National', summary: 'A broad mix of quantitative aptitude, reasoning, English, and general awareness.', resources: ['Topic practice', 'Revision notes', 'Mock test'] },
    { id: 'ssc-chsl', title: 'SSC Combined Higher Secondary Level', category: 'SSC', level: 'National', summary: 'Build fundamentals across language, general intelligence, and quantitative aptitude.', resources: ['Topic practice', 'Sample paper'] },
    { id: 'ibps-po', title: 'IBPS Probationary Officer', category: 'Banking', level: 'National', summary: 'Practice reasoning, data interpretation, English, and banking awareness.', resources: ['Section tests', 'Study notes', 'Mock test'] },
    { id: 'sbi-clerk', title: 'SBI Junior Associate', category: 'Banking', level: 'National', summary: 'Strengthen speed and accuracy across common banking exam sections.', resources: ['Section tests', 'Revision guide'] },
    { id: 'rrb-ntpc', title: 'RRB Non-Technical Popular Categories', category: 'Railways', level: 'National', summary: 'Explore a sample path through general awareness, reasoning, and maths.', resources: ['Topic practice', 'Sample paper'] },
    { id: 'ctet', title: 'Central Teacher Eligibility Test', category: 'Teaching', level: 'Eligibility', summary: 'Review child development, pedagogy, languages, and subject foundations.', resources: ['Revision notes', 'Practice set'] },
    { id: 'nda', title: 'National Defence Academy', category: 'Defence', level: 'National', summary: 'A demonstration preparation path for mathematics and general ability.', resources: ['Topic practice', 'Study notes'] },
    { id: 'state-psc', title: 'State Public Service Commission', category: 'State Government', level: 'State', summary: 'Explore general studies and state-focused preparation resources.', resources: ['Current affairs', 'Revision notes'] },
    { id: 'civil-services', title: 'Civil Services Examination', category: 'Civil Services', level: 'National', summary: 'Plan a broad foundation across general studies and aptitude.', resources: ['Reading list', 'Practice set'] },
    { id: 'other', title: 'Other competitive examinations', category: 'Other', level: 'National', summary: 'Create a flexible study routine for the exam you have in mind.', resources: ['Custom test builder', 'Study planner'] }
  ];
  const examGrid = document.querySelector('#exam-grid');
  if (examGrid) {
    const search = document.querySelector('#exam-search');
    const category = document.querySelector('#exam-category');
    const level = document.querySelector('#exam-level');
    const count = document.querySelector('#exam-count');
    const favorites = WellPractice.getBookmarks('exams');
    const params = new URLSearchParams(location.search);
    if (params.get('category')) category.value = params.get('category');
    const render = () => {
      const query = search.value.trim().toLowerCase();
      const list = exams.filter(item => (!category.value || item.category === category.value) && (!level.value || item.level === level.value) && `${item.title} ${item.category} ${item.summary}`.toLowerCase().includes(query));
      count.textContent = `${list.length} preparation paths`;
      examGrid.innerHTML = list.length ? list.map(item => `<article class="discovery-card"><div class="discovery-card-top"><span class="chip">${item.category}</span><button class="bookmark-button${favorites.includes(item.id) ? ' is-saved' : ''}" type="button" data-exam-bookmark="${item.id}" aria-label="${favorites.includes(item.id) ? 'Remove saved exam' : 'Save exam'}" aria-pressed="${favorites.includes(item.id)}">${favorites.includes(item.id) ? '★' : '☆'}</button></div><h2>${item.title}</h2><p>${item.summary}</p><div class="resource-tags">${item.resources.map(resource => `<span>${resource}</span>`).join('')}</div><div class="discovery-actions"><button class="text-button" type="button" data-exam-details="${item.id}" aria-expanded="false">Details <span aria-hidden="true">＋</span></button><button class="button button-primary" type="button" data-exam-start="${item.id}">Start preparation ↗</button></div><div class="exam-detail" id="detail-${item.id}" hidden><p><b>Level:</b> ${item.level}</p><p><b>Sample syllabus:</b> ${item.summary}</p><p>Dates and official eligibility are not provided in this demo. Check the relevant exam authority for current information.</p></div></article>`).join('') : '<div class="empty-state"><h2>No matches just yet</h2><p>Try a different search or clear one of the filters.</p></div>';
    };
    [search, category, level].forEach(input => input.addEventListener('input', render));
    examGrid.addEventListener('click', event => {
      const save = event.target.closest('[data-exam-bookmark]');
      const detail = event.target.closest('[data-exam-details]');
      const start = event.target.closest('[data-exam-start]');
      if (save) { const state = WellPractice.toggleBookmark('exams', save.dataset.examBookmark); save.textContent = state ? '★' : '☆'; save.classList.toggle('is-saved', state); save.setAttribute('aria-pressed', String(state)); save.setAttribute('aria-label', state ? 'Remove saved exam' : 'Save exam'); }
      if (detail) { const panel = document.querySelector(`#detail-${detail.dataset.examDetails}`); panel.hidden = !panel.hidden; detail.setAttribute('aria-expanded', String(!panel.hidden)); detail.querySelector('span').textContent = panel.hidden ? '＋' : '−'; }
      if (start) { localStorage.setItem('wpSelectedExam', start.dataset.examStart); location.href = 'practice.html'; }
    });
    render();
  }

  const resources = [
    { id: 'percentages', title: 'Percentages, made practical', subject: 'Quantitative aptitude', type: 'Notes', date: '2026-10-25', popularity: 91, icon: '％', summary: 'A sample note on percentage change, quick conversions, and common question patterns.' },
    { id: 'series', title: 'Number series: a pattern checklist', subject: 'Reasoning', type: 'Revision', date: '2026-10-20', popularity: 74, icon: '⌁', summary: 'A short revision guide to differences, ratios, alternating patterns, and squares.' },
    { id: 'grammar', title: 'Subject–verb agreement', subject: 'English', type: 'Notes', date: '2026-10-18', popularity: 63, icon: 'Aa', summary: 'Original sample notes on agreement, collective nouns, and tricky sentence subjects.' },
    { id: 'civics', title: 'Civics concepts: a quick review', subject: 'General awareness', type: 'Revision', date: '2026-10-12', popularity: 82, icon: '▤', summary: 'An introductory, original review of institutions and foundational civics terms.' },
    { id: 'sample-paper', title: 'Mixed aptitude sample paper', subject: 'Quantitative aptitude', type: 'Practice', date: '2026-10-10', popularity: 95, icon: '✎', summary: 'A small demonstration paper assembled from original sample questions.' },
    { id: 'current-affairs', title: 'Current affairs review template', subject: 'General awareness', type: 'Current affairs', date: '2026-10-08', popularity: 58, icon: '◷', summary: 'A blank template for organising trusted news sources and your own weekly notes.' },
    { id: 'vocabulary', title: 'Vocabulary in context', subject: 'English', type: 'Practice', date: '2026-09-30', popularity: 70, icon: '✦', summary: 'A short original practice set with context clues and explanations.' },
    { id: 'ratio', title: 'Ratios and proportions: formula sheet', subject: 'Quantitative aptitude', type: 'Revision', date: '2026-09-26', popularity: 86, icon: '÷', summary: 'Original formula reminders and a worked example for proportional reasoning.' }
  ];
  const resourceGrid = document.querySelector('#resource-grid');
  if (resourceGrid) {
    const affairsTopics = [
      { id: 'public-services', title: 'Public services & governance', prompt: 'Follow a current public policy story and note the institution involved.' },
      { id: 'environment', title: 'Environment & climate', prompt: 'Choose one recent environment report from a source you trust.' },
      { id: 'economy', title: 'Economy & finance', prompt: 'Track one economic indicator and write down what it measures.' },
      { id: 'science', title: 'Science & technology', prompt: 'Pick a science story and explain its key idea in two sentences.' }
    ];
    const affairsFeed = document.createElement('section');
    affairsFeed.className = 'affairs-feed';
    affairsFeed.setAttribute('aria-labelledby', 'affairs-title');
    resourceGrid.before(affairsFeed);
    const followedTopics = new Set(JSON.parse(localStorage.getItem('wpAffairsFollows') || '[]'));
    const renderAffairs = () => {
      const topics = followedTopics.size ? affairsTopics.filter(item => followedTopics.has(item.id)) : affairsTopics;
      affairsFeed.innerHTML = `<div class="affairs-heading"><div><p class="eyebrow">A PERSONAL READING ROUTINE · DEMO</p><h2 id="affairs-title">Current affairs, your way.</h2><p>No live news is embedded here. Follow topics to save a short weekly reading prompt in this browser.</p></div><span class="chip">${followedTopics.size ? `${followedTopics.size} FOLLOWED` : 'SAMPLE PROMPTS'}</span></div><div class="affairs-grid">${topics.map(item => `<article class="affairs-card"><span class="affairs-marker">${item.title.slice(0,1)}</span><h3>${item.title}</h3><p>${item.prompt}</p><button class="affairs-follow" type="button" data-affairs-follow="${item.id}" aria-pressed="${followedTopics.has(item.id)}">${followedTopics.has(item.id) ? 'Following ✓' : '＋ Follow topic'}</button></article>`).join('') || '<p class="muted-copy">No topics followed yet. Choose from the sample areas below.</p>'}${followedTopics.size ? '<button class="text-button affairs-reset" type="button" data-affairs-reset>Browse all topics</button>' : ''}</div>`;
    };
    renderAffairs();
    affairsFeed.addEventListener('click', event => {
      const button = event.target.closest('[data-affairs-follow]');
      if (button) {
        const id = button.dataset.affairsFollow;
        followedTopics.has(id) ? followedTopics.delete(id) : followedTopics.add(id);
        localStorage.setItem('wpAffairsFollows', JSON.stringify([...followedTopics]));
        renderAffairs();
      }
      if (event.target.closest('[data-affairs-reset]')) { followedTopics.clear(); localStorage.setItem('wpAffairsFollows', '[]'); renderAffairs(); }
    });
    const search = document.querySelector('#resource-search');
    const subject = document.querySelector('#resource-subject');
    const sort = document.querySelector('#resource-sort');
    const count = document.querySelector('#resource-count');
    let activeType = 'all';
    let saved = WellPractice.getBookmarks('resources');
    const render = () => {
      const query = search.value.trim().toLowerCase();
      const list = resources.filter(item => (!subject.value || item.subject === subject.value) && (activeType === 'all' || item.type === activeType) && `${item.title} ${item.subject} ${item.summary} ${item.type}`.toLowerCase().includes(query));
      list.sort((a,b) => sort.value === 'popular' ? b.popularity - a.popularity : b.date.localeCompare(a.date));
      count.textContent = `${list.length} sample resources`;
      resourceGrid.innerHTML = list.length ? list.map(item => `<article class="resource-card"><div class="resource-card-top"><span class="resource-icon">${item.icon}</span><button class="bookmark-button${saved.includes(item.id) ? ' is-saved' : ''}" type="button" data-resource-save="${item.id}" aria-label="${saved.includes(item.id) ? 'Remove bookmark' : 'Bookmark resource'}" aria-pressed="${saved.includes(item.id)}">${saved.includes(item.id) ? '★' : '☆'}</button></div><div class="resource-meta"><span>${item.subject}</span><span>${item.type}</span></div><h2>${item.title}</h2><p>${item.summary}</p><div class="resource-card-actions"><button class="text-button" type="button" data-resource-open="${item.id}">Open sample <span aria-hidden="true">↗</span></button><button class="download-button" type="button" data-resource-download="${item.id}" aria-label="Download ${item.title}">↓</button></div></article>`).join('') : '<div class="empty-state"><h2>No resources match that search</h2><p>Try another keyword or subject.</p></div>';
    };
    document.querySelectorAll('[data-resource-type]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('[data-resource-type]').forEach(item => item.classList.remove('is-active')); button.classList.add('is-active'); activeType = button.dataset.resourceType; render(); }));
    [search, subject, sort].forEach(input => input.addEventListener('input', render));
    resourceGrid.addEventListener('click', event => {
      const save = event.target.closest('[data-resource-save]');
      const open = event.target.closest('[data-resource-open]');
      const download = event.target.closest('[data-resource-download]');
      if (save) { const state = WellPractice.toggleBookmark('resources', save.dataset.resourceSave); saved = WellPractice.getBookmarks('resources'); save.textContent = state ? '★' : '☆'; save.classList.toggle('is-saved', state); save.setAttribute('aria-pressed', String(state)); save.setAttribute('aria-label', state ? 'Remove bookmark' : 'Bookmark resource'); }
      if (open || download) {
        const resource = resources.find(item => item.id === (open || download).dataset[open ? 'resourceOpen' : 'resourceDownload']);
        if (open) { const modal = document.querySelector('#resource-reader'); document.querySelector('#reader-title').textContent = resource.title; document.querySelector('#reader-body').innerHTML = `<p>${resource.summary}</p><p><b>Sample note:</b> Start by writing down what you already know. Break the topic into a few smaller ideas, then test each idea with an example of your own.</p><p>This is original demonstration content, not an official exam resource.</p>`; modal.hidden = false; document.querySelector('#close-reader').focus(); }
        if (download) { const content = `${resource.title}\n\n${resource.summary}\n\nOriginal WellPractice demonstration content.`; const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' })); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `${resource.id}-demo.txt`; anchor.click(); URL.revokeObjectURL(url); }
      }
    });
    const modal = document.querySelector('#resource-reader');
    document.querySelector('#close-reader').addEventListener('click', () => { modal.hidden = true; });
    modal.addEventListener('click', event => { if (event.target === modal) modal.hidden = true; });
    render();
  }
})();