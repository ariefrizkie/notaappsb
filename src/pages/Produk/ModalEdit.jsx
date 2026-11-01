import { useEffect, useState } from "react";
import { color } from "../../utils/dataColorLight";
import { X } from "lucide-react";
import FormProduk from "./FormProduk";

function ModalTambah({ modalClose, isOpen, data, onEdit }) {
  const [produkDataEdit, setProdukDataEdit] = useState({
    idProduk: data.id_produk,
    kodeProduk: data.kode_produk,
    namaProduk: data.nama_produk,
    jenisProduk: data.jenis_produk,
    satuanUkuran: data.satuan_ukuran,
    satuanJumlah: data.satuan_jumlah,
    hargaBeli: data.harga_beli,
    hargaJual: data.harga_jual,
  });

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
    setProdukDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSimpanProduk = () => {
    const dataProdukBaru = {
      id_produk: produkDataEdit.idProduk,
      kode_produk: produkDataEdit.kodeProduk,
      nama_produk: produkDataEdit.namaProduk,
      jenis_produk: produkDataEdit.jenisProduk,
      satuan_ukuran: produkDataEdit.satuanUkuran,
      satuan_jumlah: produkDataEdit.satuanJumlah,
      harga_beli: Number(produkDataEdit.hargaBeli),
      harga_jual: Number(produkDataEdit.hargaJual),
    };

    onEdit(dataProdukBaru);

    alert("Data Produk Berhasil diubah!");
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
          <h3 className="font-semibold">Edit Produk</h3>

          <button
            className={`text-lg leading-none ${color.textMuted} cursor-pointer`}
            onClick={() => modalClose(false)}
          >
            <X />
          </button>
        </div>
        <FormProduk
          produkData={produkDataEdit}
          handleChange={handleProdukChange}
        />
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
