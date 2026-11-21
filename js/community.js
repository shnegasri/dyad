(() => {
  const postList = document.querySelector('#community-posts');
  if (!postList) return;
  const seed = [
    { id: 'seed-1', subject: 'Quantitative aptitude', author: 'Aarav M.', initials: 'AM', time: 'Today · 9:20 am', text: 'When a question gives successive percentage changes, I write the starting value as 100 first. It makes the multipliers much easier to see.', likes: 8, liked: false },
    { id: 'seed-2', subject: 'Reasoning', author: 'Leena R.', initials: 'LR', time: 'Yesterday · 6:45 pm', text: 'For direction problems, drawing a tiny compass before calculating has saved me from a lot of avoidable mistakes.', likes: 12, liked: false },
    { id: 'seed-3', subject: 'English', author: 'Dev P.', initials: 'DP', time: 'Yesterday · 2:10 pm', text: 'I am making a list of words I can explain in a sentence instead of just memorising definitions. Anyone else trying that?', likes: 5, liked: false },
    { id: 'seed-4', subject: 'General awareness', author: 'Mina K.', initials: 'MK', time: 'Mon · 11:05 am', text: 'A small weekly review is working better for me than a giant current-affairs catch-up at the end of the month.', likes: 9, liked: false }
  ];
  let community = JSON.parse(localStorage.getItem('wpCommunity') || 'null') || { posts: seed, groups: [], challenge: false, reports: [] };
  if (!community.posts.some(post => post.id === 'seed-1')) community.posts = [...seed, ...community.posts];
  let currentFilter = 'All';
  let reportId = null;
  const escapeHTML = value => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const save = () => localStorage.setItem('wpCommunity', JSON.stringify(community));
  const render = () => {
    const list = community.posts.filter(post => currentFilter === 'All' || post.subject === currentFilter);
    postList.innerHTML = list.map(post => `<article class="post-card"><div class="post-author"><span class="post-avatar">${escapeHTML(post.initials)}</span><span><b>${escapeHTML(post.author)}</b><small>${escapeHTML(post.time)} · Demo member</small></span><span class="chip">${escapeHTML(post.subject)}</span></div><p class="post-copy">${escapeHTML(post.text)}</p><div class="post-actions"><button class="like-button${post.liked ? ' is-liked' : ''}" data-post-like="${escapeHTML(post.id)}" type="button" aria-pressed="${post.liked}">♡ <span>${post.likes} helpful</span></button><button class="report-button" data-post-report="${escapeHTML(post.id)}" type="button">Report</button></div></article>`).join('') || '<div class="empty-state"><h2>No discussions here yet</h2><p>Be the first to share a question.</p></div>';
  };
  const groups = [
    { id: 'daily-25', name: 'The 25-minute club', detail: 'Quiet focus sessions · 3 meetups/week', members: 18 },
    { id: 'math-morning', name: 'Morning maths circle', detail: 'Quantitative aptitude · beginner friendly', members: 12 },
    { id: 'english-room', name: 'English, one page at a time', detail: 'Reading and vocabulary · weekly', members: 9 }
  ];
  document.querySelector('#study-groups').innerHTML = groups.map(group => `<div class="study-group"><span class="group-mark">${group.name.slice(0,1)}</span><span><b>${group.name}</b><small>${group.detail} · ${group.members} demo members</small></span><button type="button" data-group-join="${group.id}" aria-pressed="${community.groups.includes(group.id)}">${community.groups.includes(group.id) ? 'Joined' : 'Join'}</button></div>`).join('');
  render();
  document.querySelectorAll('[data-community-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-community-filter]').forEach(item => item.classList.remove('is-active'));
    button.classList.add('is-active'); currentFilter = button.dataset.communityFilter; render();
  }));
  postList.addEventListener('click', event => {
    const like = event.target.closest('[data-post-like]');
    const report = event.target.closest('[data-post-report]');
    if (like) { const post = community.posts.find(item => item.id === like.dataset.postLike); if (!post) return; post.liked = !post.liked; post.likes += post.liked ? 1 : -1; save(); render(); }
    if (report) { reportId = report.dataset.postReport; document.querySelector('#report-dialog').hidden = false; document.querySelector('#report-reason').focus(); }
  });
  document.querySelector('#study-groups').addEventListener('click', event => {
    const button = event.target.closest('[data-group-join]'); if (!button) return;
    const id = button.dataset.groupJoin;
    community.groups = community.groups.includes(id) ? community.groups.filter(item => item !== id) : [...community.groups,id];
    save(); button.textContent = community.groups.includes(id) ? 'Joined' : 'Join'; button.setAttribute('aria-pressed', String(community.groups.includes(id)));
    WellPractice.toast(community.groups.includes(id) ? 'Added to your local study groups.' : 'Removed from your local study groups.');
  });
  const postDialog = document.querySelector('#post-dialog');
  document.querySelector('#new-post-open').addEventListener('click', () => { postDialog.hidden = false; document.querySelector('#post-content').focus(); });
  document.querySelector('#post-close').addEventListener('click', () => { postDialog.hidden = true; });
  document.querySelector('#post-form').addEventListener('submit', event => {
    event.preventDefault();
    const text = document.querySelector('#post-content').value.trim();
    if (!text) return;
    community.posts.unshift({ id: `local-${Date.now()}`, subject: document.querySelector('#post-subject').value, author: 'You', initials: 'ME', time: 'Just now', text, likes: 0, liked: false });
    save(); render(); event.currentTarget.reset(); postDialog.hidden = true; WellPractice.toast('Your demo post is saved in this browser only.');
  });
  document.querySelector('#report-close').addEventListener('click', () => { document.querySelector('#report-dialog').hidden = true; });
  document.querySelector('#report-submit').addEventListener('click', () => {
    if (reportId) community.reports.push({ id: reportId, reason: document.querySelector('#report-reason').value });
    save(); reportId = null; document.querySelector('#report-dialog').hidden = true; WellPractice.toast('Demo report recorded locally; no moderation team was notified.');
  });
  const challengeButton = document.querySelector('#join-challenge');
  const challengeStatus = document.querySelector('#challenge-status');
  const renderChallenge = () => { challengeButton.textContent = community.challenge ? 'Leave this challenge' : 'Join the challenge'; challengeStatus.textContent = community.challenge ? 'You’re in. Keep a personal tally of your five sessions.' : 'Participation is saved locally.'; };
  renderChallenge();
  challengeButton.addEventListener('click', () => { community.challenge = !community.challenge; save(); renderChallenge(); });
})();