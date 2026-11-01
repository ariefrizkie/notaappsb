import { PenLine, Plus, Trash } from "lucide-react";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import { jenisProduk } from "../../services/data";
import { color } from "../../utils/dataColorLight";
import ModalTambah from "./ModalTambah";
import ModalEdit from "./ModalEdit";
import { useSupabase } from "../../services/SupabaseContext";

function Produk() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const { dbProduk, loading, insertData, updateData, deleteData } =
    useSupabase();

  const [keyWord, setKeyword] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterUrutan, setFilterUrutan] = useState("kode-asc");

  const [dataDipilih, setDataDipilih] = useState({});

  const produkTitle = [
    { name: "Kode Produk", acc: "kodeProduk", style: "min-w-32" },
    { name: "Nama Produk", acc: "namaProduk", style: "min-w-64" },
    { name: "Jenis", acc: "jenis", style: "min-w-32" },
    { name: "Satuan Ukuran", acc: "satuanUkuran", style: "min-w-32" },
    { name: "Satuan Jumlah", acc: "satuanJumlah", style: "min-w-32" },
    { name: "Harga Beli", acc: "hargaBeli", style: "min-w-34" },
    { name: "Harga Jual", acc: "hargaJual", style: "min-w-34" },
    {
      name: "Aksi",
      render: (row) => (
        <>
          <button
            className={`inline-flex items-center justify-center rounded-lg ${color.textMuted} cursor-pointer bg-transparent w-7 h-7 p-1.5 mr-1 ${color.hoverPos}`}
            onClick={() => {
              setIsModalEditOpen(true);
              const dataProdukPilih = dbProduk.find((produk) => {
                return produk.kode_produk === row.kodeProduk;
              });
              setDataDipilih(dataProdukPilih);
            }}
          >
            <PenLine />
          </button>
          <button
            className={`inline-flex items-center justify-center rounded-lg ${color.textMuted} cursor-pointer bg-transparent w-7 h-7 p-1 mr-1 ${color.hoverNeg}`}
            onClick={() => {
              if (confirm("Anda yakin ingin menghapus produk ini?")) {
                handleHapusProduk(row.idProduk);
              }
            }}
          >
            <Trash />
          </button>
        </>
      ),
      style: "min-w-24",
    },
  ];

  const listProduk = () => {
    const daftarProduk = sortedProduk.map((produk) => {
      return {
        idProduk: produk.id_produk,
        kodeProduk: produk.kode_produk,
        namaProduk: produk.nama_produk,
        jenis: produk.jenis_produk,
        satuanUkuran: produk.satuan_ukuran,
        satuanJumlah: produk.satuan_jumlah,
        hargaBeli: `Rp. ${produk.harga_beli.toLocaleString("id-ID")}`,
        hargaJual: `Rp. ${produk.harga_jual.toLocaleString("id-ID")}`,
      };
    });
    return daftarProduk;
  };

  const handleSimpanProduk = (dataBaru) => {
    insertData("db_produk", dataBaru);
  };
  const handleEditProduk = (dataBaru) => {
    updateData("db_produk", dataBaru.id_produk, dataBaru, "id_produk");
  };
  const handleHapusProduk = (dataHapus) => {
    deleteData("db_produk", dataHapus, "id_produk");
  };

  const filterProduk = dbProduk.filter((produk) => {
    const keyWordLower = keyWord.toLowerCase();
    const filterJenisLower = filterJenis.toLowerCase();

    const kodeProduk = produk.kode_produk
      ? produk.kode_produk.toLowerCase()
      : "";
    const namaProduk = produk.nama_produk
      ? produk.nama_produk.toLowerCase()
      : "";

    const pencarianCocok =
      kodeProduk.includes(keyWordLower) || namaProduk.includes(keyWordLower);

    const jenisCocok =
      filterJenis === "" ||
      produk.jenis_produk.toLowerCase() === filterJenisLower;

    return pencarianCocok && jenisCocok;
  });

  const sortedProduk = filterProduk.slice().sort((a, b) => {
    const filterUrutanLower = filterUrutan.toLowerCase();
    if (filterUrutanLower === "nama-asc") {
      const namaA = a.nama_produk ? a.nama_produk.toLowerCase() : "";
      const namaB = b.nama_produk ? b.nama_produk.toLowerCase() : "";
      return namaA.localeCompare(namaB);
    } else if (filterUrutan === "nama-desc") {
      const namaA = a.nama_produk ? a.nama_produk.toLowerCase() : "";
      const namaB = b.nama_produk ? b.nama_produk.toLowerCase() : "";
      return namaB.localeCompare(namaA);
    } else if (filterUrutan === "kode-asc") {
      const kodeA = a.kode_produk ? a.kode_produk.toLowerCase() : "";
      const kodeB = b.kode_produk ? b.kode_produk.toLowerCase() : "";
      return kodeA.localeCompare(kodeB);
    } else if (filterUrutan === "kode-desc") {
      const kodeA = a.kode_produk ? a.kode_produk.toLowerCase() : "";
      const kodeB = b.kode_produk ? b.kode_produk.toLowerCase() : "";
      return kodeB.localeCompare(kodeA);
    } else if (filterUrutan === "jenis-asc") {
      const jenisA = a.jenis_produk ? a.jenis_produk.toLowerCase() : "";
      const jenisB = b.jenis_produk ? b.jenis_produk.toLowerCase() : "";
      return jenisA.localeCompare(jenisB);
    }
    return 0;
  });

  return (
    <div className="relative flex transition-colors w-full">
      <Sidebar />
      <main
        className={`fixed left-18 right-0 h-screen max-h-screen ${color.bg} overflow-y-auto ${color.scrollColor}`}
      >
        <div className="print:hidden relative flex flex-col px-8 py-6 font-manrope gap-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className={`text-2xl font-semibold ${color.text}`}>
                Daftar Produk
              </h1>
              <p className={`text-sm ${color.textMuted}`}>
                {`Menampilkan ${filterProduk.length} dari ${dbProduk.length} produk`}
              </p>
            </div>
            <button
              className={`flex gap-2 items-center px-4 py-2 ${color.accentPrimary} rounded-xl font-semibold text-sm cursor-pointer`}
              onClick={() => setIsModalOpen(true)}
            >
              <Plus />
              Tambah Produk
            </button>
          </div>
          <div
            className={`rounded-xl p-4 flex flex-wrap items-center gap-3 ${color.bgSurface} border ${color.border}`}
          >
            <input
              type="text"
              id="pencarian"
              className={`text-sm px-3 py-2 focus:outline-2 focus:outline-offset-1 ${color.focus}  border ${color.border} ${color.bgSurfaceAlt} rounded-lg flex-1 min-w-50 ${color.text}`}
              placeholder="Cari Kode atau Nama Produk..."
              value={keyWord}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <div className="flex gap-3 items-center">
              <select
                name="jenis"
                id="jenis"
                className={`text-sm px-3 py-2 focus:outline-2 focus:outline-offset-1 ${color.focus} border ${color.border} ${color.bgSurfaceAlt} rounded-lg ${color.text}`}
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
              >
                <option value="">Semua Jenis</option>
                {jenisProduk.map((jenis) => (
                  <option key={jenis} value={jenis}>
                    {jenis}
                  </option>
                ))}
              </select>
              <select
                name="sort"
                id="sort"
                className={`text-sm px-3 py-2 focus:outline-2 focus:outline-offset-1 ${color.focus} border ${color.border} ${color.bgSurfaceAlt} rounded-lg ${color.text}`}
                value={filterUrutan}
                onChange={(e) => setFilterUrutan(e.target.value)}
              >
                <option value="kode-asc">Default</option>
                <option value="kode-desc">Urutkan: Kode (Turun)</option>
                <option value="nama-asc">Urutkan: Nama A-Z</option>
                <option value="nama-desc">Urutkan: Nama Z-A</option>
                <option value="jenis-asc">Urutkan: Jenis</option>
              </select>
              <button
                className={`text-sm px-3 py-2 focus:outline-2 focus:outline-offset-1 ${color.focus} border ${color.border} ${color.bgSurfaceAlt} rounded-lg ${color.text} ${color.hoverFilter} `}
                onClick={() => {
                  setKeyword("");
                  setFilterJenis("");
                  setFilterUrutan("");
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <div
            className={`rounded-xl overflow-x-auto ${color.bgSurface} border ${color.border}`}
          >
            <Table
              titles={produkTitle}
              datas={listProduk()}
              loading={loading}
            />
          </div>
          {isModalOpen && (
            <ModalTambah
              modalClose={setIsModalOpen}
              isOpen={isModalOpen}
              onSimpan={handleSimpanProduk}
              dbProduk={dbProduk}
            />
          )}
          {isModalEditOpen && (
            <ModalEdit
              modalClose={setIsModalEditOpen}
              isOpen={isModalEditOpen}
              data={dataDipilih}
              onEdit={handleEditProduk}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Produk;
