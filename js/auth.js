(() => {
  const login = document.querySelector('#login-panel');
  if (!login) return;
  const register = document.querySelector('#register-panel');
  const loginTab = document.querySelector('#login-tab');
  const registerTab = document.querySelector('#register-tab');
  function selectTab(isRegister) {
    login.hidden = isRegister; register.hidden = !isRegister;
    loginTab.classList.toggle('is-active', !isRegister); registerTab.classList.toggle('is-active', isRegister);
    loginTab.setAttribute('aria-selected', String(!isRegister)); registerTab.setAttribute('aria-selected', String(isRegister));
    (isRegister ? document.querySelector('#register-name') : document.querySelector('#login-email')).focus();
  }
  loginTab.addEventListener('click', () => selectTab(false));
  registerTab.addEventListener('click', () => selectTab(true));
  document.querySelectorAll('[data-password-target]').forEach(button => button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.passwordTarget);
    const show = input.type === 'password'; input.type = show ? 'text' : 'password';
    button.textContent = show ? 'Hide' : 'Show'; button.setAttribute('aria-label', `${show ? 'Hide' : 'Show'} password`);
  }));
  login.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.querySelector('#login-email'); const password = document.querySelector('#login-password'); const error = document.querySelector('#login-error');
    error.textContent = '';
    if (!email.checkValidity()) { error.textContent = 'Enter a valid email address.'; email.focus(); return; }
    if (password.value.length < 8) { error.textContent = 'Use at least 8 characters for this demo check.'; password.focus(); return; }
    WellPractice.toast('This is a frontend demo. No sign-in request was sent.');
  });
  register.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.querySelector('#register-name'); const email = document.querySelector('#register-email'); const password = document.querySelector('#register-password'); const error = document.querySelector('#register-error');
    error.textContent = '';
    if (!name.checkValidity()) { error.textContent = 'Add a name with at least two characters.'; name.focus(); return; }
    if (!email.checkValidity()) { error.textContent = 'Enter a valid email address.'; email.focus(); return; }
    if (password.value.length < 8 || !/[A-Za-z]/.test(password.value) || !/\d/.test(password.value)) { error.textContent = 'Use at least 8 characters, including one letter and one number.'; password.focus(); return; }
    register.reset(); selectTab(false); WellPractice.toast('Demo registration checked. No account or password was saved.');
  });
})();