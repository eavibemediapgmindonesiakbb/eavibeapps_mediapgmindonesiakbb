const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyJDyDWkjYwvSd7PgTwqdIrhC5J1zYa-2pv0ivCFxATXgVQWyE2C4Zk33ZMt-o0jrxrTg/exec';

// Hilangin splash screen setelah 1 detik
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    if (splash) splash.style.display = 'none';
  }, 1000);
});

// Cek login pas buka app
document.addEventListener('DOMContentLoaded', () => {
  const nama = localStorage.getItem('nama');
  if (nama) {
    showDashboard();
  } else {
    showLogin();
  }

  // Pasang event logout
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) btnLogout.addEventListener('click', logout);

  // Pasang event login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);
});

function showLogin() {
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('dashboardPage').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.remove('hidden');
  
  const nama = localStorage.getItem('nama');
  const role = localStorage.getItem('role');
  document.getElementById('namaUser').textContent = nama || 'User';
  
  if (role === 'admin') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    document.getElementById('labelRole').textContent = 'Admin PGM';
  } else {
    document.getElementById('labelRole').textContent = 'Anggota PGM';
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const nik = document.getElementById('nik').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (nik !== password) {
    alert('Password harus sama dengan NIK');
    return;
  }
  
  document.getElementById('loading').classList.remove('hidden');
  
  try {
    const res = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ nik: nik })
    });
    
    const hasil = await res.json();
    
    if (hasil.status === 'sukses') {
      localStorage.setItem('nama', hasil.nama);
      localStorage.setItem('nik', hasil.nik);
      localStorage.setItem('role', hasil.role);
      localStorage.setItem('sertifikat', hasil.sertifikat || '');
      showDashboard();
    } else {
      alert(hasil.pesan || 'NIK tidak valid');
    }
  } catch (err) {
    alert('Gagal konek ke server');
    console.error(err);
  } finally {
    document.getElementById('loading').classList.add('hidden');
  }
}

function logout() {
  localStorage.clear();
  showLogin();
}
