(() => {
  const setup = document.querySelector('#quiz-setup');
  if (!setup) return;
  const shell = document.querySelector('#quiz-shell');
  const results = document.querySelector('#quiz-results');
  const bank = window.WPQuestions || [];
  let questions = [];
  let answers = [];
  let marked = [];
  let current = 0;
  let remaining = 300;
  let timeLimitSeconds = 300;
  let timerId;

  function startTest(custom = null) {
    let pool = [...bank];
    const config = custom || JSON.parse(localStorage.getItem('wpCustomTest') || 'null');
    if (config) {
      pool = pool.filter(question => config.subjects.includes(question.subject) && (config.difficulty === 'All' || question.difficulty === config.difficulty));
      pool.sort(() => Math.random() - .5);
      questions = pool.slice(0, config.count);
      remaining = config.minutes * 60;
      localStorage.removeItem('wpCustomTest');
    } else {
      const subject = document.querySelector('#quiz-subject').value;
      const difficulty = document.querySelector('#quiz-difficulty').value;
      pool = pool.filter(question => (subject === 'All' || question.subject === subject) && (difficulty === 'All' || question.difficulty === difficulty));
      pool.sort(() => Math.random() - .5);
      questions = pool.slice(0, 5);
      remaining = 300;
    }
    timeLimitSeconds = remaining;
    if (!questions.length) { WellPractice.toast('No questions match this setup. Choose a broader combination.'); return; }
    answers = Array(questions.length).fill(null);
    marked = Array(questions.length).fill(false);
    current = 0;
    setup.hidden = true;
    results.hidden = true;
    shell.hidden = false;
    render();
    updateTimer();
    clearInterval(timerId);
    timerId = setInterval(() => { remaining -= 1; updateTimer(); if (remaining <= 0) submit(false); }, 1000);
  }

  function updateTimer() {
    const minutes = Math.floor(remaining / 60).toString().padStart(2, '0');
    const seconds = (remaining % 60).toString().padStart(2, '0');
    document.querySelector('#quiz-timer').textContent = `${minutes}:${seconds}`;
    document.querySelector('#quiz-timer').classList.toggle('timer-warning', remaining <= 60);
  }

  function render() {
    const question = questions[current];
    document.querySelector('#question-count').textContent = `Question ${current + 1} of ${questions.length}`;
    document.querySelector('#quiz-progress-fill').style.width = `${((current + 1) / questions.length) * 100}%`;
    document.querySelector('#question-subject').textContent = `${question.subject} · ${question.difficulty}`;
    document.querySelector('#question-text').textContent = question.prompt;
    document.querySelector('#answer-options').innerHTML = question.options.map((option, index) => `<label class="answer-option${answers[current] === index ? ' selected' : ''}"><input type="radio" name="answer" value="${index}" ${answers[current] === index ? 'checked' : ''}><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${option}</span></label>`).join('');
    document.querySelector('#mark-review').setAttribute('aria-pressed', String(marked[current]));
    document.querySelector('#mark-review').innerHTML = `${marked[current] ? '★' : '☆'} <span>${marked[current] ? 'Marked for review' : 'Mark for review'}</span>`;
    document.querySelector('#previous-question').disabled = current === 0;
    document.querySelector('#next-question').textContent = current === questions.length - 1 ? 'Review answers →' : 'Next question →';
    document.querySelector('#question-nav').innerHTML = questions.map((item, index) => `<button type="button" class="question-jump${index === current ? ' is-current' : ''}${answers[index] !== null ? ' is-answered' : ''}${marked[index] ? ' is-marked' : ''}" data-question-index="${index}" aria-label="Go to question ${index + 1}${answers[index] !== null ? ', answered' : ''}${marked[index] ? ', marked for review' : ''}">${index + 1}</button>`).join('');
  }

  document.querySelector('#start-quiz').addEventListener('click', () => startTest());
  if (localStorage.getItem('wpCustomTest')) startTest();
  document.querySelector('#answer-options').addEventListener('change', event => { if (event.target.name === 'answer') { answers[current] = Number(event.target.value); render(); } });
  document.querySelector('#question-nav').addEventListener('click', event => { const button = event.target.closest('[data-question-index]'); if (button) { current = Number(button.dataset.questionIndex); render(); } });
  document.querySelector('#mark-review').addEventListener('click', () => { marked[current] = !marked[current]; render(); });
  document.querySelector('#previous-question').addEventListener('click', () => { if (current > 0) { current -= 1; render(); } });
  document.querySelector('#next-question').addEventListener('click', () => { if (current < questions.length - 1) { current += 1; render(); } else { WellPractice.toast('Review marked questions, then submit when you are ready.'); } });
  document.querySelector('#submit-quiz').addEventListener('click', () => { if (confirm('Submit this practice test? You can review your answers after submitting.')) submit(true); });

  function submit(showUnanswered) {
    clearInterval(timerId);
    const correct = answers.reduce((total, answer, index) => total + (answer === questions[index].answer ? 1 : 0), 0);
    const percent = Math.round(correct / questions.length * 100);
    const progress = WellPractice.getProgress();
    const today = new Date().toISOString().slice(0, 10);
    const history = JSON.parse(localStorage.getItem('wpQuizHistory') || '[]');
    const elapsedMinutes = Math.max(1, Math.ceil((timeLimitSeconds - remaining) / 60));
    history.push({ date: today, percent, correct, total: questions.length, durationMinutes: elapsedMinutes, subjects: [...new Set(questions.map(item => item.subject))], topicResults: questions.map((item, index) => ({ topic: item.topic, subject: item.subject, correct: answers[index] === item.answer })) });
    localStorage.setItem('wpQuizHistory', JSON.stringify(history));
    progress.testsCompleted = (progress.testsCompleted || 0) + 1;
    progress.totalCorrect = (progress.totalCorrect || 0) + correct;
    progress.totalQuestions = (progress.totalQuestions || 0) + questions.length;
    progress.studyMinutes = (progress.studyMinutes || 0) + elapsedMinutes;
    const days = [...new Set(history.map(item => item.date))].sort().reverse();
    let streak = 0;
    let expected = new Date(`${today}T12:00:00`);
    for (const day of days) { if (day !== expected.toISOString().slice(0, 10)) break; streak += 1; expected.setDate(expected.getDate() - 1); }
    progress.studyStreak = streak;
    progress.lastStudyDate = today;
    WellPractice.saveProgress(progress);
    shell.hidden = true;
    results.hidden = false;
    results.innerHTML = `<p class="eyebrow">SESSION COMPLETE · DEMO RESULT</p><div class="results-score"><strong>${percent}<small>%</small></strong><span>${correct} correct out of ${questions.length} questions</span></div><p class="muted-copy">A practice snapshot, not an exam ranking or prediction.</p><div class="explanation-list">${questions.map((question,index) => `<article class="explanation-item ${answers[index] === question.answer ? 'is-correct' : 'is-incorrect'}"><div><span class="chip">${question.subject} · ${question.topic}</span><b>${answers[index] === question.answer ? 'Correct' : answers[index] === null ? 'Not answered' : 'Review this one'}</b></div><p>${question.prompt}</p><p><strong>Answer:</strong> ${question.options[question.answer]}<br>${question.explanation}</p></article>`).join('')}</div>${showUnanswered && answers.includes(null) ? '<p class="helper-text">Unanswered questions were counted as incorrect.</p>' : ''}<div class="results-actions"><button id="retake-quiz" class="button button-primary" type="button">Try another test ↻</button><a class="button button-dark" href="dashboard.html">See my progress ↗</a></div>`;
    document.querySelector('#retake-quiz').addEventListener('click', () => { results.hidden = true; setup.hidden = false; });
  }
})();