(() => {
  const root = document.querySelector('.dashboard-content');
  if (!root) return;
  const history = JSON.parse(localStorage.getItem('wpQuizHistory') || '[]');
  const progress = WellPractice.getProgress();
  const empty = document.querySelector('#dashboard-empty');
  const panels = document.querySelector('#dashboard-panels');
  const plan = JSON.parse(localStorage.getItem('wpStudyPlan') || 'null');
  if (history.length) { empty.hidden = true; panels.hidden = false; }
  document.querySelector('#dash-tests').textContent = progress.testsCompleted || '0';
  document.querySelector('#dash-average').innerHTML = `${history.length ? Math.round(history.reduce((sum,item) => sum + item.percent,0) / history.length) : '—'}<small>${history.length ? '%' : ''}</small>`;
  document.querySelector('#dash-streak').innerHTML = `${progress.studyStreak || '0'}<small> days</small>`;
  document.querySelector('#dash-hours').innerHTML = `${((progress.studyMinutes || 0) / 60).toFixed(1)}<small> h</small>`;
  if (plan) {
    const date = plan.examDate ? new Date(`${plan.examDate}T12:00:00`) : null;
    const days = date ? Math.max(0, Math.ceil((date - new Date()) / 86400000)) : null;
    document.querySelector('#dashboard-next-session').textContent = days === null ? `${plan.examName} · Study plan ready` : `${days} days to ${plan.examName}`;
  }
  if (!history.length) {
    document.querySelector('#dashboard-plan').innerHTML = plan ? '<p class="muted-copy">Your plan is ready. Head to the AI learning centre to check off a session.</p>' : '<p class="muted-copy">Build a weekly plan around the exam you have in mind.</p>';
    document.querySelector('#dashboard-weak').innerHTML = '<p class="muted-copy">Your topic patterns will show after a few practice sessions.</p>';
    document.querySelector('#recent-tests').innerHTML = '<p class="muted-copy">Your completed sessions will appear here.</p>';
    document.querySelector('#achievements').innerHTML = '<span class="achievement locked">✧ First practice session</span>';
    return;
  }
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(); date.setHours(12,0,0,0); date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0,10);
    const minutes = history.filter(item => item.date === key).reduce((sum,item) => sum + item.durationMinutes,0);
    return { label: date.toLocaleDateString(undefined, { weekday: 'short' }), minutes };
  });
  const maxMinutes = Math.max(30, ...days.map(day => day.minutes));
  document.querySelector('#weekly-chart').innerHTML = days.map(day => `<div class="chart-column"><span class="chart-value">${day.minutes ? `${day.minutes}m` : ''}</span><div class="chart-track"><i style="--height:${day.minutes ? Math.max(8, day.minutes / maxMinutes * 100) : 0}%"></i></div><span class="chart-day">${day.label}</span></div>`).join('');
  const topicMap = {};
  history.forEach(test => test.topicResults.forEach(result => {
    const topic = topicMap[result.topic] || { subject: result.subject, attempts: 0, correct: 0 };
    topic.attempts += 1; topic.correct += Number(result.correct); topicMap[result.topic] = topic;
  }));
  const topicList = Object.entries(topicMap).map(([name,item]) => ({ name, ...item, percent: Math.round(item.correct / item.attempts * 100) })).sort((a,b) => a.percent - b.percent);
  document.querySelector('#subject-performance').innerHTML = topicList.map(item => `<div class="performance-row"><div><b>${item.name}</b><small>${item.subject}</small></div><span class="performance-track"><i style="--value:${item.percent}%"></i></span><strong>${item.percent}%</strong></div>`).join('');
  const weak = topicList.filter(topic => topic.percent < 70).slice(0,3);
  document.querySelector('#dashboard-weak').innerHTML = weak.length ? weak.map(item => `<a class="weak-topic" href="practice.html"><span><b>${item.name}</b><small>${item.percent}% across ${item.attempts} attempt${item.attempts === 1 ? '' : 's'}</small></span><span>Practise ↗</span></a>`).join('') : '<p class="muted-copy">No topic is falling behind right now. Keep building on the areas you feel good about.</p>';
  document.querySelector('#recent-tests').innerHTML = [...history].reverse().slice(0,4).map(item => `<div class="recent-test"><span><b>${item.subjects.join(', ')}</b><small>${new Date(`${item.date}T12:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · ${item.total} questions</small></span><strong>${item.percent}%</strong></div>`).join('');
  if (plan && plan.tasks) {
    document.querySelector('#dashboard-plan').innerHTML = `<p class="plan-exam-name">${plan.examName} · ${plan.hours} hours a day</p>${plan.tasks.slice(0,4).map(task => `<div class="dashboard-task${task.done ? ' is-done' : ''}"><span>${task.done ? '✓' : '○'}</span>${task.label}</div>`).join('')}<a class="text-link" href="ai-learning.html">See full plan ↗</a>`;
  } else document.querySelector('#dashboard-plan').innerHTML = '<p class="muted-copy">No plan yet. Build a weekly study rhythm to make space for your next session.</p><a class="text-link" href="ai-learning.html">Create a study plan ↗</a>';
  const milestones = [];
  if (progress.testsCompleted >= 1) milestones.push('First practice session');
  if (progress.testsCompleted >= 5) milestones.push('Five sessions in');
  if (progress.studyStreak >= 3) milestones.push('Three-day rhythm');
  document.querySelector('#achievements').innerHTML = `${milestones.map(item => `<span class="achievement">✦ ${item}</span>`).join('')}${milestones.length < 3 ? '<span class="achievement locked">✧ More milestones ahead</span>' : ''}`;
})();