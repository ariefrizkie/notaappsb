import { color } from "../../utils/dataColorLight";
import Td from "../../components/Table/Td";
import { Trash } from "lucide-react";
import { useSupabase } from "../../services/SupabaseContext";

function BarisItem({ index, dataItem, onChange, onClick, subTotal }) {
  const { dbProduk } = useSupabase();

  const handleHarga = (produkSelect) => {
    const listProduk = dbProduk.find((produk) => {
      return produk.nama_produk.toLowerCase() === produkSelect.toLowerCase();
    });

    onChange(index, "hargaBeli", listProduk.harga_beli);
    onChange(index, "hargaJual", listProduk.harga_jual);
  };
  return (
    <tr className="hover:bg-light-surface-alt/40 dark:hover:bg-dark-surface-alt/50">
      <Td style={`${color.text} min-w-4`}>
        <span>{index + 1}</span>
      </Td>
      <Td style={`${color.text} min-w-64`}>
        <input
          type="text"
          name="namaBarang"
          className={`nama-barang ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2  ${color.text} focus:outline-2 ${color.focus} focus:border-0 w-full`}
          placeholder="Nama Barang"
          value={dataItem.namaBarang}
          onChange={(e) => onChange(index, "namaBarang", e.target.value)}
        />
      </Td>
      <Td style={`${color.text} min-w-36`}>
        <select
          name="jenis"
          className={`jenis border ${color.border} px-1.5 py-2 rounded-lg w-full ${color.bgSurface}`}
          value={dataItem.jenisBarang}
          onChange={(e) => {
            onChange(index, "jenisBarang", e.target.value);
            handleHarga(e.target.value);
          }}
        >
          <option value="">Pilih</option>
          {dbProduk.map((produk) => (
            <option key={produk.id_produk} value={produk.nama_produk}>
              {produk.nama_produk}
            </option>
          ))}
        </select>
      </Td>
      <Td style={`${color.text} min-w-28 `}>
        <span className="flex gap-1 items-center">
          <input
            type="number"
            name="ukuranPanjang"
            className={`panjang ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2  ${color.text} focus:outline-2 ${color.focus} focus:border-0 w-12`}
            value={dataItem.ukuranPanjang}
            onChange={(e) =>
              onChange(index, "ukuranPanjang", Number(e.target.value))
            }
          />
          X
          <input
            type="number"
            name="ukuranLebar"
            className={`lebar ${color.bgSurface}  border ${color.border}  rounded-lg px-1.5 py-2  ${color.text} focus:outline-2 ${color.focus} focus:border-0 w-12`}
            value={dataItem.ukuranLebar}
            onChange={(e) =>
              onChange(index, "ukuranLebar", Number(e.target.value))
            }
          />
          meter
        </span>
      </Td>
      <Td style={`${color.text} min-w-28 `}>
        <span className="flex gap-1 items-center">
          <input
            type="number"
            name="jumlah"
            className={`jumlah ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2  ${color.text} focus:outline-2 ${color.focus} focus:border-0 w-16`}
            value={dataItem.jumlah}
            onChange={(e) => onChange(index, "jumlah", Number(e.target.value))}
          />
          Lembar
        </span>
      </Td>
      <Td style={`${color.text} min-w-28 `}>
        <span className="flex gap-1 items-center">
          Rp.
          <input
            type="number"
            name="harga-beli"
            className={`harga-beli ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2  ${color.text} focus:outline-2 ${color.focus} focus:border-0 w-24 text-right`}
            placeholder="0"
            value={dataItem.hargaBeli}
            onChange={(e) =>
              onChange(index, "hargaBeli", Number(e.target.value))
            }
          />
        </span>
      </Td>
      <Td style={`${color.text} min-w-28 `}>
        <span className="flex gap-1 items-center">
          Rp.
          <input
            type="number"
            name="harga-jual"
            className={`harga-jual ${color.bgSurface} border ${color.border} rounded-lg px-1.5 py-2  ${color.text} focus:outline-2 ${color.focus} focus:border-0 w-24 text-right`}
            value={dataItem.hargaJual}
            onChange={(e) =>
              onChange(index, "hargaJual", Number(e.target.value))
            }
          />
        </span>
      </Td>
      <Td style={`${color.text} min-w-28 text-right`}>
        <span>{`Rp. ${subTotal.toLocaleString("id-ID")}`}</span>
      </Td>
      <Td style={`text-light-accent-4 dark:text-dark-accent-4 min-w-6 `}>
        <button onClick={() => onClick(index)} className="cursor-pointer">
          <Trash />
        </button>
      </Td>
    </tr>
  );
}

export default BarisItem;
