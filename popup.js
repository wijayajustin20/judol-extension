const toggleAktif = document.getElementById("toggleAktif");
const statusTeks = document.getElementById("status");

function tampilkanStatus(aktif) {
  toggleAktif.checked = aktif;
  statusTeks.textContent = aktif
    ? "Pengaturan klasifikasi: aktif."
    : "Pengaturan klasifikasi: nonaktif.";
}

async function muatPengaturan() {
  try {
    // Secara default, klasifikasi belum diaktifkan.
    const hasil = await chrome.storage.local.get({
      klasifikasiAktif: false
    });

    tampilkanStatus(hasil.klasifikasiAktif);
    toggleAktif.disabled = false;
  } catch (error) {
    statusTeks.textContent = "Gagal memuat pengaturan.";
    console.error(error);
  }
}

toggleAktif.addEventListener("change", async () => {
  const aktif = toggleAktif.checked;
  toggleAktif.disabled = true;

  try {
    await chrome.storage.local.set({
      klasifikasiAktif: aktif
    });

    tampilkanStatus(aktif);
  } catch (error) {
    toggleAktif.checked = !aktif;
    statusTeks.textContent = "Gagal menyimpan pengaturan.";
    console.error(error);
  } finally {
    toggleAktif.disabled = false;
  }
});

muatPengaturan();