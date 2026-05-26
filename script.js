const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyJDyDWkjYwvSd7PgTwqdIrhC5J1zYa-2pv0ivCFxATXgVQWyE2C4Zk33ZMt-o0jrxrTg/exec';

// 1. Hilangin splash + cek login pas pertama load
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splashScreen');
    if (splash) splash.style.display = 'none';
    
    // Cek udah login belum
    if (localStorage.getItem('nama')) {
      showDashboard();
    } else {
      showLogin();
    }
  }, 800);
});

// 2. Pasang semua event listener
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('btnLogout').addEventListener('click', logout);
  document.getElementById('btnSertifikat').addEventListener('click', lihatSertifikat);
});

// 3. Fungsi ganti halaman
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
  
  if (role === 'admin' || role === 'Admin PGM') {
    document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    document.getElementById('labelRole').textContent = 'Admin PGM';
  } else {
    document.getElementById('labelRole').textContent = 'Anggota PGM';
  }
}

// 4. Fungsi login
async function handleLogin(e) {
  e.preventDefault();
  
  const nik = document.getElementById('nik').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (nik !== password) {
    showToast('Password harus sama dengan NIK', 'error');
    return;
  }
  
  showLoading(true);
  
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
      showToast('Login berhasil!');
    } else {
      showToast(hasil.pesan || 'NIK tidak valid', 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('Gagal konek ke server', 'error');
  } finally {
    showLoading(false);
  }
}

// 5. Fungsi logout
function logout() {
  localStorage.clear();
  showLogin();
  showToast('Logout berhasil');
}

// 6. Fungsi lihat sertifikat
function lihatSertifikat() {
  const link = localStorage.getItem('sertifikat');
  if (link) {
    window.open(link, '_blank');
  } else {
    showToast('Sertifikat belum tersedia', 'error');
  }
}

// 7. Utility
function showLoading(show) {
  const loading = document.getElementById('loading');
  if (show) {
    loading.classList.remove('hidden');
  } else {
    loading.classList.add('hidden');
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.background = type === 'error' ? '#dc3545' : '#28a745';
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}
