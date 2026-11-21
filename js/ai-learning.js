(() => {
  const page = document.querySelector('.ai-tools');
  if (!page) return;

  const plannerForm = document.querySelector('#planner-form');
  const plannerOutput = document.querySelector('#planner-output');
  const savedPlan = JSON.parse(localStorage.getItem('wpStudyPlan') || 'null');
  const subjects = ['Quantitative aptitude', 'Reasoning', 'English', 'General awareness'];
  if (savedPlan) renderPlan(savedPlan);
  plannerForm.addEventListener('submit', event => {
    event.preventDefault();
    const examName = document.querySelector('#planner-exam').value.trim();
    const examDate = document.querySelector('#planner-date').value;
    const hours = Number(document.querySelector('#planner-hours').value);
    if (!examName || !examDate || !Number.isFinite(hours) || hours < 1 || hours > 12) { WellPractice.toast('Add a target, a future date, and 1 to 12 study hours.'); return; }
    if (new Date(`${examDate}T12:00:00`) <= new Date()) { WellPractice.toast('Choose a target date in the future.'); return; }
    const tasks = subjects.map((subject, index) => ({ id: `${Date.now()}-${index}`, label: `${Math.max(20, Math.round(hours * 60 / 4))} min · ${subject}`, done: false }));
    const plan = { examName, examDate, hours, tasks };
    localStorage.setItem('wpStudyPlan', JSON.stringify(plan));
    renderPlan(plan);
    WellPractice.toast('Your sample study rhythm is ready.');
  });
  function renderPlan(plan) {
    plannerOutput.innerHTML = `<div class="plan-output-head"><span class="chip">${plan.examName}</span><span>${plan.hours} hours / day · target ${new Date(`${plan.examDate}T12:00:00`).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'})}</span></div><div class="planner-task-list">${plan.tasks.map(task => `<label class="planner-task${task.done ? ' is-done' : ''}"><input type="checkbox" data-plan-task="${task.id}" ${task.done ? 'checked' : ''}><span>${task.label}</span><small>${task.done ? 'Done' : 'To do'}</small></label>`).join('')}</div><p class="helper-text">A suggested routine, not a prediction of exam readiness. Adjust it to your needs.</p>`;
  }
  plannerOutput.addEventListener('change', event => {
    if (!event.target.matches('[data-plan-task]')) return;
    const plan = JSON.parse(localStorage.getItem('wpStudyPlan') || 'null');
    const task = plan?.tasks.find(item => item.id === event.target.dataset.planTask);
    if (!task) return;
    task.done = event.target.checked;
    localStorage.setItem('wpStudyPlan', JSON.stringify(plan));
    renderPlan(plan);
  });

  document.querySelector('#ask-tutor').addEventListener('click', () => {
    const question = document.querySelector('#tutor-question').value.trim().toLowerCase();
    const answerBox = document.querySelector('#tutor-answer');
    if (!question) { WellPractice.toast('Write or speak a question first.'); return; }
    let answer = 'Try restating the idea in your own words, then test it with a small example. For a useful study session, write down what you know, identify the step that feels unclear, and revisit that step with a worked example. This is a sample response from the local demo library.';
    if (/percent|discount/.test(question)) answer = 'A percentage is a part out of 100. To find 25% of 80, convert 25% to 0.25 and multiply: 0.25 × 80 = 20. A 25% discount on 80 leaves 80 − 20 = 60. This is a sample answer, not a live AI response.';
    else if (/ratio|proportion/.test(question)) answer = 'A ratio compares quantities using the same units. For a 3:5 ratio, there are 8 parts altogether. If the total is 40, each part is 5, so the two quantities are 15 and 25. This is a sample answer, not a live AI response.';
    else if (/series|pattern/.test(question)) answer = 'First compare consecutive terms: look at differences, then ratios, then alternating positions. For 3, 6, 12, 24, each term doubles, so the next term is 48. This is a sample answer, not a live AI response.';
    else if (/grammar|english|concise/.test(question)) answer = 'For a grammar question, identify the subject and verb first, then check whether they agree in number and tense. Read the sentence aloud once you have checked the structure. This is a sample answer, not a live AI response.';
    answerBox.textContent = answer;
    answerBox.classList.add('has-content');
  });
  document.querySelector('#voice-input').addEventListener('click', () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { WellPractice.toast('Speech recognition is not available in this browser. You can type your question instead.'); return; }
    const recognition = new Recognition();
    recognition.lang = 'en-US';
    recognition.onresult = event => { document.querySelector('#tutor-question').value = event.results[0][0].transcript; };
    recognition.onerror = () => WellPractice.toast('Voice input could not start. Check microphone permission or type your question.');
    recognition.start();
  });
  document.querySelector('#read-answer').addEventListener('click', () => {
    const answer = document.querySelector('#tutor-answer').textContent;
    if (!answer) { WellPractice.toast('Ask a question to get a sample answer first.'); return; }
    if (!window.speechSynthesis) { WellPractice.toast('Text-to-speech is not available in this browser.'); return; }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(answer));
  });

  const history = JSON.parse(localStorage.getItem('wpQuizHistory') || '[]');
  const topicMap = {};
  history.forEach(test => test.topicResults.forEach(result => {
    const topic = topicMap[result.topic] || { subject: result.subject, attempts: 0, correct: 0 };
    topic.attempts += 1; topic.correct += Number(result.correct); topicMap[result.topic] = topic;
  }));
  const weakTopics = Object.entries(topicMap).map(([name,item]) => ({ name, ...item, percent: Math.round(item.correct / item.attempts * 100) })).sort((a,b) => a.percent - b.percent);
  const weakOutput = document.querySelector('#weakness-output');
  weakOutput.innerHTML = weakTopics.length ? `<div class="weakness-bars">${weakTopics.map(topic => `<div><span>${topic.name}<small>${topic.subject}</small></span><b><i style="--value:${topic.percent}%"></i></b><strong>${topic.percent}%</strong></div>`).join('')}</div><p class="helper-text">Based on ${history.length} completed practice session${history.length === 1 ? '' : 's'} stored in this browser.</p><a class="text-link" href="practice.html">Practise a topic ↗</a>` : '<div class="empty-state compact-empty"><span class="empty-illustration">⌁</span><p>Your topic patterns will appear after your first practice test.</p><a class="text-link" href="practice.html">Try a practice test ↗</a></div>';

  const adaptiveQuestion = document.querySelector('#adaptive-question');
  const adaptiveFeedback = document.querySelector('#adaptive-feedback');
  let adaptiveStep = 0;
  let adaptiveLevel = 'Easy';
  function showAdaptive() {
    const question = window.WPQuestions.find(item => item.difficulty === adaptiveLevel && item.subject === 'Quantitative aptitude') || window.WPQuestions[0];
    adaptiveQuestion.innerHTML = `<span class="chip">Step ${adaptiveStep + 1} · ${adaptiveLevel}</span><h3>${question.prompt}</h3><div class="adaptive-options">${question.options.map((option,index) => `<button class="adaptive-answer" type="button" data-adaptive-answer="${index}">${option}</button>`).join('')}</div>`;
  }
  showAdaptive();
  adaptiveQuestion.addEventListener('click', event => {
    const button = event.target.closest('[data-adaptive-answer]');
    if (!button) return;
    const question = window.WPQuestions.find(item => item.difficulty === adaptiveLevel && item.subject === 'Quantitative aptitude') || window.WPQuestions[0];
    const right = Number(button.dataset.adaptiveAnswer) === question.answer;
    adaptiveFeedback.textContent = right ? `${question.explanation} Next, the demo will increase difficulty.` : `${question.explanation} Next, the demo will keep the level approachable.`;
    adaptiveFeedback.classList.add('has-content');
    if (adaptiveStep === 0) {
      adaptiveStep = 1;
      adaptiveLevel = right ? 'Medium' : 'Easy';
      adaptiveQuestion.innerHTML += '<button id="adaptive-next" class="button button-primary" type="button">Next question →</button>';
      document.querySelector('#adaptive-next').addEventListener('click', showAdaptive, { once: true });
      document.querySelector('#adaptive-next').addEventListener('click', () => { adaptiveFeedback.classList.remove('has-content'); adaptiveFeedback.textContent = ''; }, { once: true });
    } else adaptiveQuestion.innerHTML = '<p class="muted-copy">That completes this adaptive demo. Restart to try another path.</p><button id="adaptive-restart" class="button button-quiet" type="button">Try again ↻</button>';
    if (adaptiveStep === 1 && document.querySelector('#adaptive-restart')) document.querySelector('#adaptive-restart').addEventListener('click', () => { adaptiveStep = 0; adaptiveLevel = 'Easy'; adaptiveFeedback.textContent = ''; showAdaptive(); });
  });

  const interviewPrompts = ['Tell us about a challenge you worked through and what you learned.', 'How do you organise your time when several priorities compete?', 'What is something you learned recently that changed your perspective?'];
  let promptIndex = 0;
  document.querySelector('#next-interview').addEventListener('click', () => { promptIndex = (promptIndex + 1) % interviewPrompts.length; document.querySelector('#interview-prompt').textContent = interviewPrompts[promptIndex]; document.querySelector('#interview-response').value = ''; });
  document.querySelector('#save-interview').addEventListener('click', () => {
    const rating = document.querySelector('#interview-rating').value;
    const response = document.querySelector('#interview-response').value.trim();
    if (!response || !rating) { WellPractice.toast('Add a reflection and choose a self-rating first.'); return; }
    localStorage.setItem('wpInterviewReflection', JSON.stringify({ rating, savedAt: new Date().toISOString() }));
    WellPractice.toast('Self-assessment saved locally. Your response text was not stored.');
  });

  const fileInput = document.querySelector('#question-file');
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    const preview = document.querySelector('#image-preview');
    if (!file) { preview.replaceChildren(); return; }
    if (!file.type.startsWith('image/')) { WellPractice.toast('Choose an image file to preview.'); fileInput.value = ''; return; }
    const image = document.createElement('img');
    image.alt = `Preview of ${file.name}`;
    image.src = URL.createObjectURL(file);
    preview.replaceChildren(image, Object.assign(document.createElement('p'), { textContent: `${file.name} · Preview only; no question analysis is connected.` }));
  });

  const reminder = document.querySelector('#reminder-toggle');
  reminder.checked = localStorage.getItem('wpReminderEnabled') === 'true';
  reminder.addEventListener('change', () => localStorage.setItem('wpReminderEnabled', String(reminder.checked)));
  document.querySelector('#notification-permission').addEventListener('click', async () => {
    if (!('Notification' in window)) { WellPractice.toast('Browser notifications are not supported here.'); return; }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') { new Notification('WellPractice reminder', { body: 'A small study session is ready when you are.' }); WellPractice.toast('Permission granted. This demo can show a reminder now.'); }
    else WellPractice.toast('Notifications were not enabled. Your reminder preference remains saved locally.');
  });
  document.querySelector('#offline-toggle').addEventListener('click', event => {
    const button = event.currentTarget;
    const active = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'Online mode' : 'Simulate offline';
    document.body.classList.toggle('offline-simulation', active);
    WellPractice.toast(active ? 'Offline mode is simulated only; page data is not cached.' : 'Back to standard preview mode.');
  });
})();