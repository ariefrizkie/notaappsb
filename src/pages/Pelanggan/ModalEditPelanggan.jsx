import { color } from "../../utils/dataColorLight";
import { X } from "lucide-react";
import FormPelanggan from "./FormPelanggan";
import { useEffect, useState } from "react";

function ModalEditPelanggan({ modalClose, isOpen, onEdit, dataPelanggan }) {
  const [pelangganDataEdit, setPelangganDataEdit] = useState({
    idPelanggan: dataPelanggan.id_customer,
    kodePelanggan: dataPelanggan.kode_customer,
    namaCustomer: dataPelanggan.nama_customer,
    nomorTelepon: dataPelanggan.nomor_telepon,
    alamat: dataPelanggan.alamat,
    totalBelanja: dataPelanggan.total_belanja,
    totalTransaksi: dataPelanggan.total_transaksi,
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

  const handlePelangganChange = (e) => {
    const { name, value } = e.target;
    setPelangganDataEdit((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditPelanggan = () => {
    const dataPelangganBaru = {
      id_customer: pelangganDataEdit.idPelanggan,
      kode_customer: pelangganDataEdit.kodePelanggan,
      nama_customer: pelangganDataEdit.namaCustomer,
      nomor_telepon: pelangganDataEdit.nomorTelepon,
      alamat: pelangganDataEdit.alamat,
      total_belanja: Number(pelangganDataEdit.totalBelanja),
      total_transaksi: Number(pelangganDataEdit.totalTransaksi),
    };

    onEdit(dataPelangganBaru);

    alert("Data Pelanggan berhasil diperbarui");
    modalClose(false);
  };
  return (
    <div
      id="modal-pelanggan"
      className={`top-0 left-0 fixed z-10 flex items-center justify-center p-5 w-full h-full ${color.overlay}`}
      onClick={handleParentClose}
    >
      <div
        className={`w-110 max-w-full max-h-[95%] ${color.bgSurface} overflow-y-auto border ${color.border} rounded-2xl p-6`}
      >
        <div className={`flex justify-between items-center mb-5 ${color.text}`}>
          <h3 className="font-semibold">Edit Pelanggan</h3>

          <button
            className={`text-lg leading-none ${color.textMuted} cursor-pointer`}
            onClick={() => modalClose(false)}
          >
            <X />
          </button>
        </div>
        <FormPelanggan
          pelangganData={pelangganDataEdit}
          handleChange={handlePelangganChange}
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
            onClick={handleEditPelanggan}
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEditPelanggan;
