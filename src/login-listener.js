let busy = false;

document.addEventListener('click', async (event) => {
  const button = event.target.closest('.account-button');
  if (!button || busy) return;
  event.preventDefault();
  busy = true;
  const email = window.prompt('Email');
  if (!email) { busy = false; return; }
  const password = window.prompt('Пароль / Password');
  if (!password) { busy = false; return; }
  try {
    const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');
    localStorage.setItem('snowpeak_user', JSON.stringify(data.user));
    localStorage.setItem('snowpeak_token', data.token);
    window.alert('Успешный вход / Successfully signed in');
    window.location.reload();
  } catch (error) {
    window.alert(error.message || 'Не удалось войти');
  } finally { busy = false; }
}, true);
