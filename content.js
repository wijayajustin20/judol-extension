(() => {
  const SELECTOR =
    "#comments ytd-comment-view-model #content-text, " +
    "#comments ytd-comment-renderer #content-text";

  const MARK_CLASS = "judol-extension-education";

  let aktif = false;
  let sedangMemproses = false;
  let versiPengaturan = 0;
  let sudahDiproses = new WeakMap();

  let timerScan = null;
  let perluScanUlang = false;

  function jadwalkanProses() {
    if (!aktif) {
      return;
    }

    clearTimeout(timerScan);

    timerScan = setTimeout(() => {
      prosesKomentar();
    }, 300);
  }

  function hapusPenanda() {
    document.querySelectorAll(`.${MARK_CLASS}`)
      .forEach(element => element.remove());
  }

  function lokasiPenanda(element) {
    return element.closest("ytd-expander") ?? element;
  }

  function hapusPenandaKomentar(element) {
    const anchor = lokasiPenanda(element);
    const next = anchor.nextElementSibling;

    if (next?.classList.contains(MARK_CLASS)) {
      next.remove();
    }
  }

  function tambahPenanda(element, reasons) {
    hapusPenandaKomentar(element);

    const penanda = document.createElement("div");
    penanda.className = MARK_CLASS;

    Object.assign(penanda.style, {
      marginTop: "8px",
      padding: "10px",
      borderLeft: "3px solid #d97706",
      borderRadius: "4px",
      backgroundColor: "#fff7ed",
      color: "#9a3412",
      fontSize: "12px",
      lineHeight: "1.5"
    });

    const judul = document.createElement("div");
    judul.textContent =
      "⚠️ Komentar ini terindikasi mengandung promosi judi online.";
    judul.style.fontWeight = "600";

    penanda.appendChild(judul);

    if (Array.isArray(reasons) && reasons.length > 0) {
      const detail = document.createElement("details");
      detail.style.marginTop = "8px";

      const ringkasan = document.createElement("summary");
      ringkasan.textContent = "Mengapa komentar ini ditandai?";
      ringkasan.style.cursor = "pointer";

      const daftar = document.createElement("ul");
      daftar.style.margin = "8px 0";
      daftar.style.paddingLeft = "20px";

      for (const alasan of reasons) {
        const item = document.createElement("li");
        item.textContent = alasan;
        item.style.marginBottom = "4px";

        daftar.appendChild(item);
      }

      const keterangan = document.createElement("div");
      keterangan.textContent =
        "Alasan menunjukkan fitur yang mendorong prediksi model. " +
        "Hasil klasifikasi masih dapat keliru.";
      keterangan.style.marginTop = "6px";

      detail.append(ringkasan, daftar, keterangan);
      penanda.appendChild(detail);
    }

    const edukasi = document.createElement("div");
    edukasi.textContent =
      "Berhati-hatilah terhadap ajakan dan tautan yang ditawarkan.";
    edukasi.style.marginTop = "8px";

    penanda.appendChild(edukasi);
    const anchor = lokasiPenanda(element);
    anchor.insertAdjacentElement("afterend", penanda);
  }

  async function prosesKomentar() {
    if (!aktif) {
      return;
    }

    if (sedangMemproses) {
      perluScanUlang = true;
      return;
    }

    perluScanUlang = false;
    sedangMemproses = true;

    const versiSaatMulai = versiPengaturan;

    try {
      const komentar = document.querySelectorAll(SELECTOR);

      console.log(
        "[Ekstensi Judol] Komentar ditemukan:",
        komentar.length
      );

      for (const element of komentar) {
        if (!aktif || versiSaatMulai !== versiPengaturan) {
          break;
        }

        if (!element.isConnected) {
          continue;
        }

        const teks = element.textContent.trim();

        if (!teks || sudahDiproses.get(element) === teks) {
          continue;
        }

        hapusPenandaKomentar(element);

        try {
          const response = await chrome.runtime.sendMessage({
            type: "CLASSIFY_COMMENT",
            text: teks
          });

          // Abaikan respons jika komentar atau pengaturan berubah.
          if (
            !aktif ||
            versiSaatMulai !== versiPengaturan ||
            !element.isConnected ||
            element.textContent.trim() !== teks
          ) {
            continue;
          }

          if (!response?.ok) {
            console.error(
              "[Ekstensi Judol] Klasifikasi gagal:",
              response?.error
            );
            continue;
          }

          if (!response.aktif) {
            break;
          }

          if (response.label === 1) {
            tambahPenanda(element, response.reasons);
          }

          sudahDiproses.set(element, teks);
        } catch (error) {
          console.error("[Ekstensi Judol] API gagal:", error);
        }
      }
    } finally {
      sedangMemproses = false;

      if (
        aktif &&
        (perluScanUlang || versiSaatMulai !== versiPengaturan)
      ) {
        perluScanUlang = false;
        jadwalkanProses();
      }
    }
  }

  function aturStatus(status) {
    aktif = status === true;
    versiPengaturan++;

    if (aktif) {
      prosesKomentar();
    } else {
      clearTimeout(timerScan);
      perluScanUlang = false;
      hapusPenanda();
      sudahDiproses = new WeakMap();
    }
  }

  function merupakanPenanda(node) {
    const element = node.nodeType === Node.ELEMENT_NODE
      ? node
      : node.parentElement;

    return Boolean(element?.closest(`.${MARK_CLASS}`));
  }

  const observer = new MutationObserver(mutations => {
    if (!aktif) {
      return;
    }

    const komentarBerubah = mutations.some(mutation => {
      // Abaikan perubahan pada penanda buatan ekstensi.
      if (merupakanPenanda(mutation.target)) {
        return false;
      }

      const nodesBerubah = [
        ...mutation.addedNodes,
        ...mutation.removedNodes
      ];

      if (
        nodesBerubah.length > 0 &&
        nodesBerubah.every(merupakanPenanda)
      ) {
        return false;
      }

      const target =
        mutation.target.nodeType === Node.ELEMENT_NODE
          ? mutation.target
          : mutation.target.parentElement;

      if (target?.closest("#comments")) {
        return true;
      }

      return [...mutation.addedNodes].some(node =>
        node.nodeType === Node.ELEMENT_NODE &&
        (
          node.matches("#comments") ||
          node.querySelector("#comments")
        )
      );
    });

    if (komentarBerubah) {
      jadwalkanProses();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Hindari hasil pembacaan awal menimpa perubahan toggle terbaru.
  let pengaturanBerubah = false;

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.klasifikasiAktif) {
      pengaturanBerubah = true;
      aturStatus(changes.klasifikasiAktif.newValue);
    }
  });

  chrome.storage.local.get({
    klasifikasiAktif: false
  }).then(pengaturan => {
    if (!pengaturanBerubah) {
      aturStatus(pengaturan.klasifikasiAktif);
    }
  }).catch(error => {
    console.error(
      "[Ekstensi Judol] Gagal membaca pengaturan:",
      error
    );
  });
})();