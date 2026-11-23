const API_URL =
  "https://judol-api-cr42-bice.vercel.app/predict";

async function klasifikasiKomentar(teks) {
  const pengaturan = await chrome.storage.local.get({
    klasifikasiAktif: false
  });

  if (!pengaturan.klasifikasiAktif) {
    return {
      ok: true,
      aktif: false
    };
  }

  if (typeof teks !== "string" || !teks.trim()) {
    throw new Error("Teks komentar kosong atau tidak valid.");
  }

  if (teks.length > 10000) {
    throw new Error("Komentar melebihi batas 10.000 karakter.");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: teks
    }),
    signal: AbortSignal.timeout(25000)
  });

  if (!response.ok) {
    throw new Error(
      `Server mengembalikan HTTP ${response.status}.`
    );
  }

  const hasil = await response.json();

  if (
    ![0, 1].includes(hasil.label) ||
    !Number.isFinite(hasil.score) ||
    typeof hasil.description !== "string" ||
    !Array.isArray(hasil.reasons) ||
    !hasil.reasons.every(alasan => typeof alasan === "string")
  ) {
    throw new Error("Format respons server tidak valid.");
  }

  return {
    ok: true,
    aktif: true,
    label: hasil.label,
    score: hasil.score,
    description: hasil.description,
    reasons: hasil.reasons
  };
}

chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message?.type !== "CLASSIFY_COMMENT") {
      return;
    }

    klasifikasiKomentar(message.text)
      .then(sendResponse)
      .catch(error => {
        console.error("[Ekstensi Judol] API gagal:", error);

        sendResponse({
          ok: false,
          error: error.message
        });
      });

    return true;
  }
);