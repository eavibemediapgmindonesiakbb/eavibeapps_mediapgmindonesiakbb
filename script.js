// ====== CONFIG ======
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbz0aCs7Pu451lFqdSIsiDEx_mEo8IH8jNVRf7DHsjY9lAHVAjBtUTVoTr3L9SgIagC_/exec'; // Ganti pake URL kamu

// ====== SPLASH SCREEN ======
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splashScreen').classList.add('hidden');
    cekLogin();
  }, 2000);
});

// ====== CEK UDAH LOGIN BELUM ======
function cekLogin() {
  const nama = localStorage.getItem('nama');
  if (nama) {
    showDashboard();
  } else {
    document.getElementById('loginPage').classList.remove('hidden');
  }
}

// ====== LOGIN PAKAI NIK ======
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nik = document.getElementById('nik').value.trim();
  
  if (nik === '') {
    showToast('NIK harus diisi', 'error');
    return;
  }
  
  showLoading();
  
  try {
    const res = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify({ nik: nik })
    });
    const hasil = await res.json();
    
    if (hasil.status === 'sukses') {
      // Simpen data ke localStorage
      localStorage.setItem('nama', hasil.nama);
      localStorage.setItem('nik', hasil.nik);
      localStorage.setItem('role', hasil.role);
      localStorage.setItem('sertifikat', hasil.sertifikat);
      
      showToast('Selamat datang, ' + hasil.nama);
      showDashboard();
    } else {
      showToast(hasil.pesan, 'error');
    }
  } catch (err) {
    showToast('Gagal konek ke server', 'error');
    console.log(err);
  }
  hideLoading();
});

// ====== TAMPILIN DASHBOARD ======
function showDashboard() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('dashboardPage').classList.remove('hidden');
  
  // Tampilkan nama + role
  const nama = localStorage.getItem('nama');
  const role = localStorage.getItem('role');
  document.getElementById('namaUser').textContent = nama;
  document.getElementById('labelRole').textContent = role === 'admin' ? 'Admin PGM' : 'Anggota';
  
  aturMenuByRole(role);
}

// ====== ATUR MENU BERDASARKAN ROLE ======
function aturMenuByRole(role) {
  const menuAdmin = document.querySelectorAll('.admin-only');
  
  if (role === 'admin') {
    menuAdmin.forEach(el => el.classList.remove('hidden'));
  } else {
    menuAdmin.forEach(el => el.classList.add('hidden'));
  }
}

// ====== LOGOUT ======
document.getElementById('btnLogout').addEventListener('click', () => {
  localStorage.clear();
  document.getElementById('dashboardPage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('nik').value = '';
  showToast('Berhasil logout');
});

// ====== TOAST NOTIFIKASI ======
function showToast(pesan, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = pesan;
  toast.className = 'toast show ' + type;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// ====== LOADING ======
function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}
