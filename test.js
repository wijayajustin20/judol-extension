const input = document.getElementById("komentar");
const tombol = document.getElementById("proses");
const hasil = document.getElementById("hasil");

tombol.addEventListener("click", async () => {
  tombol.disabled = true;
  hasil.textContent = "Menunggu hasil dari server...";

  const mulai = performance.now();

  try {
    const response = await chrome.runtime.sendMessage({
      type: "CLASSIFY_COMMENT",
      text: input.value
    });

    if (!response?.ok) {
      throw new Error(
        response?.error ?? "Tidak ada respons yang valid."
      );
    }

    if (!response.aktif) {
      hasil.textContent =
        "Klasifikasi nonaktif. Aktifkan melalui popup ekstensi.";
      return;
    }

    const durasi = performance.now() - mulai;

    hasil.textContent =
      `Hasil: ${response.description}\n` +
      `Label: ${response.label}\n` +
      `Skor SVM: ${response.score.toFixed(10)}\n\n` +
      `Waktu respons: ${durasi.toFixed(2)} ms`;
  } catch (error) {
    hasil.textContent = `Error: ${error.message}`;
    console.error(error);
  } finally {
    tombol.disabled = false;
  }
});