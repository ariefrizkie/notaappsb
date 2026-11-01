import { color } from "../../utils/dataColorLight";

function FormPelanggan({ pelangganData, handleChange }) {
  return (
    <div className="flex flex-col gap-3.5">
      <div className={`flex flex-col gap-1.5`}>
        <label
          htmlFor="kodePelanggan"
          className={`text-sm font-semibold ${color.textMuted}`}
        >
          Kode Pelanggan
        </label>
        <input
          type="text"
          id="kodePelanggan"
          name="kodePelanggan"
          className={`border rounded-lg py-2 px-3 text-sm ${color.bgSurfaceAlt} ${color.border} ${color.text} ${color.focus}`}
          value={pelangganData.kodePelanggan}
          onChange={handleChange}
        />
      </div>
      <div className={`flex flex-col gap-1.5`}>
        <label
          htmlFor="namaPelanggan"
          className={`text-sm font-semibold ${color.textMuted}`}
        >
          Nama Pelanggan
        </label>
        <input
          type="text"
          id="namaPelanggan"
          name="namaPelanggan"
          className={`border rounded-lg py-2 px-3 text-sm ${color.bgSurfaceAlt} ${color.border} ${color.text} ${color.focus}`}
          placeholder="mis. Ahmad"
          value={pelangganData.namaCustomer}
          onChange={handleChange}
        />
      </div>
      <div className={`flex flex-col gap-1.5`}>
        <label
          htmlFor="nomorTelepon"
          className={`text-sm font-semibold ${color.textMuted}`}
        >
          Nomor Telepon
        </label>
        <input
          type="text"
          id="nomorTelepon"
          name="nomorTelepon"
          placeholder="mis. 08524890****"
          className={`border rounded-lg py-2 px-3 text-sm ${color.bgSurfaceAlt} ${color.border} ${color.text} ${color.focus}`}
          value={pelangganData.nomorTelepon}
          onChange={handleChange}
        />
      </div>
      <div className={`flex flex-col gap-1.5`}>
        <label
          htmlFor="alamat"
          className={`text-sm font-semibold ${color.textMuted}`}
        >
          Alamat
        </label>
        <textarea
          className={`border rounded-lg py-2 px-3 text-sm ${color.bgSurfaceAlt} ${color.border} ${color.text} ${color.focus}`}
          id="alamat"
          name="alamat"
          value={pelangganData.alamat}
          onChange={handleChange}
          placeholder="masukkan alamat"
        >
          {pelangganData.alamat}
        </textarea>
      </div>
    </div>
  );
}

export default FormPelanggan;
