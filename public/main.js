async function postJSON(url, data) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  
  const regForm = document.getElementById('register-form');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = regForm.email.value;
      const password = regForm.password.value;
      const msg = document.getElementById('msg');
      const res = await postJSON('/api/register', { email, password });
      msg.textContent = res.error || `Registered user #${res.userId}`;
    });
  }
  
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;
      const msg = document.getElementById('msg');
      const res = await postJSON('/api/login', { email, password });
      msg.textContent = res.error || `Logged in as #${res.userId}`;
    });
  }
  