(() => {
  const form = document.querySelector('#builder-form');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const error = document.querySelector('#builder-error');
    const subjects = [...form.querySelectorAll('input[name="subject"]:checked')].map(input => input.value);
    const difficulty = form.querySelector('input[name="difficulty"]:checked').value;
    const count = Number(document.querySelector('#builder-count').value);
    const minutes = Number(document.querySelector('#builder-time').value);
    if (!subjects.length) { error.textContent = 'Choose at least one subject to continue.'; return; }
    if (!Number.isInteger(count) || count < 1 || count > 20) { error.textContent = 'Choose between 1 and 20 questions.'; return; }
    if (!Number.isInteger(minutes) || minutes < 1 || minutes > 60) { error.textContent = 'Set a time limit from 1 to 60 minutes.'; return; }
    const pool = (window.WPQuestions || []).filter(question => subjects.includes(question.subject) && (difficulty === 'All' || question.difficulty === difficulty));
    if (!pool.length) { error.textContent = 'There are no questions for this combination yet. Try another subject or difficulty.'; return; }
    if (count > pool.length) { error.textContent = `This setup has ${pool.length} sample question${pool.length === 1 ? '' : 's'} available. Choose ${pool.length} or fewer.`; return; }
    localStorage.setItem('wpCustomTest', JSON.stringify({ subjects, difficulty, count, minutes }));
    location.href = 'practice.html';
  });
})();