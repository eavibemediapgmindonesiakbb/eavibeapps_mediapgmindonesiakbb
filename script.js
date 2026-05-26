document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nik = document.getElementById('nik').value.trim();
  const password = document.getElementById('password').value.trim();
  
  // Cek dulu, NIK harus sama kayak password
  if (nik !== password) {
    showToast('Password harus sama dengan NIK', 'error');
    return;
  }
  
  showLoading();
  
  try {
    const res = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify({ nik: nik }) // Tetep kirim nik doang ke server
    });
    const hasil = await res.json();
    
    if (hasil.status === 'sukses') {
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
  }
  hideLoading();
});
