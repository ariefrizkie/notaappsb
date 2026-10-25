import React, { useState } from "react";
import { color } from "../../utils/dataColorLight";

function BackUpLocale() {
  const [dbName, setDbName] = useState("");

  const handleBackUp = (dbName) => {
    try {
      const dataLS = localStorage.getItem(dbName);

      if (!dataLS) {
        alert(`Tidak ada data ${dbName} di LocaleStorage untuk dieksport!`);
        return;
      }

      const parseData = JSON.parse(dataLS);
      const dataFormatted = JSON.stringify(parseData, null, 2);

      const blobData = new Blob([dataFormatted], { type: "application/json" });

      const url = URL.createObjectURL(blobData);

      const link = document.createElement("a");
      link.href = url;

      const today = new Date().toISOString().slice(0, 10);
      link.download = `backup-${dbName}-${today}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);

      alert("Data berhasil di Eksport!");
    } catch (error) {
      console.error("Gagal eksport data: ", error);
      alert("Terjadi kesalahan saat mengeksport data.");
    }
  };

  console.log(dbName);
  return (
    <div className="flex gap-3 items-center">
      <select
        name="backup"
        id="backup"
        className={`py-2 px-3 text-sm rounded-lg ${color.bgSurfaceAlt} focus:outline-2 focus:outline-offset-1 border ${color.focus} ${color.text} ${color.bgSurfaceAlt} ${color.border}`}
        value={dbName}
        onChange={(e) => setDbName(e.target.value)}
      >
        <option value="">Pilih</option>
        <option value="db_nota">Db Nota</option>
        <option value="db_items_nota">Db Items Nota</option>
        <option value="db_pelanggan">Db Pelanggan</option>
        <option value="db_pembayaran">Db Pembayaran</option>
        <option value="db_produk">Db Produk</option>
      </select>

      <button
        className={`py-2.5 px-3 rounded-xl text-sm font-semibold ${color.accentPrimary} cursor-pointer`}
        onClick={() => handleBackUp(dbName)}
      >
        Download JSON
      </button>
    </div>
  );
}

export default BackUpLocale;
