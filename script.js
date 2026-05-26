// ====== CONFIG - GANTI URL INI ======
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyJDyDWkjYwvSd7PgTwqdIrhC5J1zYa-2pv0ivCFxATXgVQWyE2C4Zk33ZMt-o0jrxrTg/exec';
// ====== HIDE SPLASH SCREEN ======
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splashScreen').style.display = 'none';
  }, 1000);
});
// ====== UTILITY ======
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}

// ====== CEK LOGIN PAS BUKA APP ======
document.addEventListener('DOMContentLoaded', () => {
  const nama = localStorage.getItem('nama');
  if (nama) {
    showDashboard();
  } else {
    showLogin();
  }
});

function showLogin() {
  document.getElementById('loginPage').style.display = 'block';
  document.getElementById('dashboardPage').style.display = 'none';
}

function showDashboard() {
  document.getElementById('loginPage').style.display = 'none';
  document.getElementById('dashboardPage').style.display = 'block';
  
  // Isi data dashboard
  const nama = localStorage.getItem('nama');
  const role = localStorage.getItem('role');
  document.getElementById('namaUser').textContent = nama;
  
  // Tampil tombol admin kalau role = admin
  if (role === 'admin') {
    document.getElementById('btnAdmin').style.display = 'block';
    document.getElementById('labelRole').textContent = 'Admin PGM';
  } else {
    document.getElementById('btnAdmin').style.display = 'none';
    document.getElementById('labelRole').textContent = 'Anggota PGM';
  }
}

// ====== HANDLE LOGIN - INI YANG UDAH FIX CORS ======
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nik = document.getElementById('nik').value.trim();
  const password = document.getElementById('password').value.trim();
  
  if (!nik || !password) {
    showToast('NIK dan Password wajib diisi', 'error');
    return;
  }
  
  if (nik !== password) {
    showToast('Password harus sama dengan NIK', 'error');
    return;
  }
  
  showLoading();
  
  try {
    const res = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ nik: nik })
    });
    
    if (!res.ok) throw new Error('HTTP ' + res.status);
    
    const hasil = await res.json();
    
    if (hasil.status === 'sukses') {
      localStorage.setItem('nama', hasil.nama);
      localStorage.setItem('nik', hasil.nik);
      localStorage.setItem('role', hasil.role);
      localStorage.setItem('sertifikat', hasil.sertifikat || '');
      
      showToast('Selamat datang, ' + hasil.nama);
      showDashboard();
    } else {
      showToast(hasil.pesan || 'NIK tidak valid', 'error');
    }
  } catch (err) {
    console.error('Error login:', err);
    showToast('Gagal konek ke server', 'error');
  } finally {
    hideLoading();
  }
});

// ====== LOGOUT ======
function logout() {
  localStorage.clear();
  showLogin();
  showToast('Berhasil logout');
}
