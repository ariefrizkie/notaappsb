import { useEffect, useState } from "react";
import { color } from "../../utils/dataColorLight";
import { X } from "lucide-react";
import FormProduk from "./FormProduk";

function ModalTambah({ modalClose, isOpen, onSimpan, dbProduk }) {
  const [produkData, setProdukData] = useState({
    kodeProduk: "",
    namaProduk: "",
    jenisProduk: "",
    satuanUkuran: "-",
    satuanJumlah: "-",
    hargaBeli: 0,
    hargaJual: 0,
  });

  function generateKodeProduk(currentDb) {
    const prefixKode = "FGPROD";
    const semuaProduk = currentDb || [];

    const digitTerpakai = semuaProduk
      .map((produk) => {
        if (produk.kode_produk && produk.kode_produk.startsWith(prefixKode)) {
          const parts = produk.kode_produk.split("-");
          return parseInt(parts[1], 10);
        }
        return null;
      })
      .filter((num) => num !== null && !isNaN(num));

    const setDigit = new Set(digitTerpakai);

    let nomorTersedia = 1;
    while (setDigit.has(nomorTersedia)) {
      nomorTersedia++;
    }

    const nextKode = String(nomorTersedia).padStart(3, "0");

    return `${prefixKode}-${nextKode}`;
  }

  useEffect(() => {
    if (isOpen) {
      setProdukData({
        kodeProduk: generateKodeProduk(dbProduk),
        namaProduk: "",
        jenisProduk: "",
        satuanUkuran: "-",
        satuanJumlah: "-",
        hargaBeli: 0,
        hargaJual: 0,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        modalClose(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, modalClose]);

  if (!isOpen) return null;

  const handleParentClose = (e) => {
    if (e.target === e.currentTarget) modalClose(false);
  };

  const handleProdukChange = (e) => {
    const { name, value } = e.target;
    setProdukData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSimpanProduk = () => {
    const dataProdukBaru = {
      id_produk: Date.now() + Math.random(),
      kode_produk: produkData.kodeProduk,
      nama_produk: produkData.namaProduk,
      jenis_produk: produkData.jenisProduk,
      satuan_ukuran: produkData.satuanUkuran,
      satuan_jumlah: produkData.satuanJumlah,
      harga_beli: Number(produkData.hargaBeli),
      harga_jual: Number(produkData.hargaJual),
    };

    onSimpan(dataProdukBaru);

    alert("Data Produk Berhasil disimpan!");
    modalClose(false);
  };

  return (
    <div
      id="modal-produk"
      className={`top-0 left-0 fixed z-10 flex items-center justify-center p-5 w-full h-full ${color.overlay}`}
      onClick={handleParentClose}
    >
      <div
        className={`w-110 max-w-full max-h-[95%] ${color.bgSurface} overflow-y-auto border ${color.border} rounded-2xl p-6`}
      >
        <div className={`flex justify-between items-center mb-5 ${color.text}`}>
          <h3 className="font-semibold">Tambah Produk</h3>

          <button
            className={`text-lg leading-none ${color.textMuted} cursor-pointer`}
            onClick={() => modalClose(false)}
          >
            <X />
          </button>
        </div>
        <FormProduk produkData={produkData} handleChange={handleProdukChange} />
        <div className="flex gap-2 mt-6">
          <button
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${color.bgSurfaceAlt} ${color.text} border ${color.border} cursor-pointer`}
            onClick={() => modalClose(false)}
          >
            Batal
          </button>
          <button
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold ${color.accentPrimary} border ${color.border} cursor-pointer`}
            onClick={handleSimpanProduk}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalTambah;
