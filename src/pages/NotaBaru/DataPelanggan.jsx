import { useState } from "react";
import Input from "../../components/Form/Input";
import Label from "../../components/Form/Label";
import { useLocalStorage } from "../../services/useLocalStorage";
import { color } from "../../utils/dataColorLight";

function DataPelanggan({ data, onChange, handleNama, handleTelepon }) {
  const [dbPelanggan, setDbPelanggan] = useLocalStorage("db_pelanggan", []);

  return (
    <div className={`rounded-xl p-5 ${color.bgSurface} border ${color.border}`}>
      <h3 className={`font-semibold mb-4 ${color.text}`}>Data Pelanggan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label label={"Nama Pelanggan"} hFor={"nama-pelanggan"} />

          <input
            type="text"
            autoFocus="true"
            id="nama-pelanggan"
            placeholder="Masukkan Nama"
            list="daftar-pelanggan"
            name="namaCustomer"
            className={`w-full ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2 text-sm ${color.text} focus:outline-2 ${color.focus} focus:border-0`}
            value={data.namaCustomer}
            onChange={handleNama}
            required={true}
          />
          <datalist id="daftar-pelanggan">
            {dbPelanggan.map((pelanggan) => (
              <option
                key={pelanggan.id_customer}
                value={pelanggan.nama_customer}
              >
                {pelanggan.nama_customer ? `(${pelanggan.nama_customer})` : ""}
              </option>
            ))}
          </datalist>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label label={"Nomor Telepon"} hFor={"telepon"} />
          <input
            type="tel"
            id="telepon"
            name="nomorTelepon"
            placeholder="Masukkan No. Telepon"
            className={`w-full ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2 text-sm ${color.text} focus:outline-2 ${color.focus} focus:border-0`}
            value={data.nomorTelepon}
            onChange={handleTelepon}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label label={"Tanggal Transaksi"} hFor={"tanggal-transaksi"} />

          <input
            type="date"
            id="tanggal-transaksi"
            name="tanggalTransaksi"
            className={`w-full ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2 text-sm ${color.text} focus:outline-2 ${color.focus} focus:border-0`}
            defaultValue={data.tanggalTransaksi}
            onChange={onChange}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label label={"Tanggal Selesai"} hFor={"tanggal-selesai"} />
          <input
            type="date"
            id="tanggal-selesai"
            name="tanggalSelesai"
            className={`w-full ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2 text-sm ${color.text} focus:outline-2 ${color.focus} focus:border-0`}
            value={data.tanggalSelesai}
            onChange={onChange}
            required={true}
          />
        </div>
      </div>
    </div>
  );
}

export default DataPelanggan;
