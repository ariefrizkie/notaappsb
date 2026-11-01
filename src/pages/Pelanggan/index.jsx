import Sidebar from "../../components/Sidebar";
import { PenLine, Plus, Trash } from "lucide-react";
import { color } from "../../utils/dataColorLight";
import Table from "../../components/Table";
import { useState } from "react";
import ModalEditPelanggan from "./ModalEditPelanggan";
import ModalTambahPelanggan from "./ModalTambahPelanggan";
import { useSupabase } from "../../services/SupabaseContext";

function Pelanggan() {
  const { dbPelanggan, loading, insertData, updateData, deleteData } =
    useSupabase();
  const [isTambahPelangganOpen, setIsTambahPelangganOpen] = useState(false);
  const [isEditPelangganOpen, setIsEditPelangganOpen] = useState(false);

  const [keyWord, setKeyword] = useState("");
  const [filterUrutan, setFilterUrutan] = useState("kode-asc");

  const [dataDipilih, setDataDipilih] = useState({});

  const pelangganTitle = [
    { name: "Kode Pelanggan", acc: "kodePelanggan", style: "min-w-32" },
    { name: "Nama Pelanggan", acc: "namaCustomer", style: "min-w-32" },
    { name: "No Telepon", acc: "noTelepon", style: "min-w-32" },
    { name: "Alamat", acc: "alamat", style: "min-w-54" },
    { name: "Jumlah Belanja", acc: "jumlahBelanja", style: "min-w-24" },
    { name: "Total Transaksi", acc: "totalTransaksi", style: "min-w-34" },
    {
      name: "Aksi",
      render: (row) => (
        <>
          <button
            className={`inline-flex items-center justify-center rounded-lg ${color.textMuted} cursor-pointer bg-transparent w-7 h-7 p-1.5 mr-1 ${color.hoverPos}`}
            onClick={() => {
              setIsEditPelangganOpen(true);
              const dataPelangganPilih = dbPelanggan.find((pelanggan) => {
                return pelanggan.kode_customer === row.kodePelanggan;
              });
              setDataDipilih(dataPelangganPilih);
            }}
          >
            <PenLine />
          </button>
          <button
            className={`inline-flex items-center justify-center rounded-lg ${color.textMuted} cursor-pointer bg-transparent w-7 h-7 p-1 mr-1 ${color.hoverNeg}`}
            onClick={() => {
              if (confirm("Anda yakin ingin menghapus produk ini?")) {
                handleHapusPelanggan(row.idCustomer);
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

  const filterPelanggan = dbPelanggan.filter((pelanggan) => {
    const keyWordLower = keyWord.toLocaleLowerCase();
    const kodePelanggan = pelanggan.kode_customer
      ? pelanggan.kode_customer.toLocaleLowerCase()
      : "";
    const namaPelanggan = pelanggan.nama_customer
      ? pelanggan.nama_customer.toLocaleLowerCase()
      : "";

    return (
      kodePelanggan.includes(keyWordLower) ||
      namaPelanggan.includes(keyWordLower)
    );
  });

  const sortedPelanggan = filterPelanggan.slice().sort((a, b) => {
    const filterUrutanLower = filterUrutan.toLowerCase();
    const namaA = a.nama_customer ? a.nama_customer.toLowerCase() : "";
    const namaB = b.nama_customer ? b.nama_customer.toLowerCase() : "";
    const kodeA = a.kode_customer ? a.kode_customer.toLowerCase() : "";
    const kodeB = b.kode_customer ? b.kode_customer.toLowerCase() : "";
    const totalA = a.total_transaksi ? a.total_transaksi : 0;
    const totalB = b.total_transaksi ? b.total_transaksi : 0;
    const itemA = a.total_belanja ? a.total_belanja : 0;
    const itemB = b.total_belanja ? b.total_belanja : 0;
    if (filterUrutanLower === "nama-asc") {
      return namaA.localeCompare(namaB);
    } else if (filterUrutanLower === "nama-desc") {
      return namaB.localeCompare(namaA);
    } else if (filterUrutanLower === "kode-asc") {
      return kodeA.localeCompare(kodeB);
    } else if (filterUrutanLower === "kode-desc") {
      return kodeB.localeCompare(kodeA);
    }

    // else if (filterUrutanLower === "total-trans-asc") {
    //   return totalA < totalB;
    // } else if (filterUrutanLower === "total-trans-desc") {
    //   return totalB > totalA;
    // } else if (filterUrutanLower === "item-asc") {
    //   return itemA.localeCompare(itemB);
    // } else if (filterUrutanLower === "item-desc") {
    //   return itemB.localeCompare(itemA);
    // }

    return 0;
  });

  const handleSimpanPelanggan = (dataBaru) => {
    insertData("db_pelanggan", dataBaru);
  };
  const handleEditPelanggan = (dataBaru) => {
    updateData("db_pelanggan", dataBaru.id_customer, dataBaru, "id_customer");
  };
  const handleHapusPelanggan = (dataHapus) => {
    deleteData("db_pelanggan", dataHapus, "id_customer");
  };

  const listPelanggan = () => {
    const daftarPelanggan = sortedPelanggan.map((pelanggan) => {
      return {
        idCustomer: pelanggan.id_customer,
        kodePelanggan: pelanggan.kode_customer,
        namaCustomer: pelanggan.nama_customer,
        noTelepon: pelanggan.nomor_telepon,
        alamat: pelanggan.alamat,
        jumlahBelanja: pelanggan.total_belanja,
        totalTransaksi: `Rp. ${pelanggan.total_transaksi.toLocaleString("id-ID")}`,
      };
    });
    return daftarPelanggan;
  };

  return (
    <div className="relative flex transition-colors w-full">
      <Sidebar />
      <main
        className={`fixed left-18 right-0 h-screen max-h-screen ${color.bg} overflow-y-auto ${color.scrollColor}`}
      >
        <div className="print:hidden relative flex flex-col px-8 py-6 font-manrope gap-6">
          <div className="flex justify-between">
            <h1 className={`text-2xl font-semibold ${color.text}`}>
              Daftar Pelanggan
            </h1>
            <button
              className={`flex gap-2 items-center px-4 py-2 ${color.accentPrimary} rounded-xl font-semibold text-sm cursor-pointer`}
              onClick={() => setIsTambahPelangganOpen(true)}
            >
              <Plus />
              Tambah Pelanggan
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
                name="sort"
                id="sort"
                className={`text-sm px-3 py-2 focus:outline-2 focus:outline-offset-1 ${color.focus} border ${color.border} ${color.bgSurfaceAlt} rounded-lg ${color.text}`}
                value={filterUrutan}
                onChange={(e) => setFilterUrutan(e.target.value)}
              >
                <option value="kode-asc">Default</option>
                <option value="kode-desc">Kode (Turun)</option>
                <option value="nama-asc">Nama A-Z</option>
                <option value="nama-desc">Nama Z-A</option>
                {/* <option value="total-trans-asc">Transaksi Terbanyak</option>
                <option value="total-trans-desc">Transaksi Sedikit</option>
                <option value="item-asc">Item Terbanyak</option>
                <option value="item-desc">Item Sedikit</option> */}
              </select>
              <button
                className={`text-sm px-3 py-2 focus:outline-2 focus:outline-offset-1 ${color.focus} border ${color.border} ${color.bgSurfaceAlt} rounded-lg ${color.text} ${color.hoverFilter} `}
                onClick={() => {
                  setKeyword("");
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
              titles={pelangganTitle}
              datas={listPelanggan()}
              loading={loading}
            />
          </div>
          {isTambahPelangganOpen && (
            <ModalTambahPelanggan
              modalClose={setIsTambahPelangganOpen}
              isOpen={isTambahPelangganOpen}
              onSimpan={handleSimpanPelanggan}
              dbPelanggan={dbPelanggan}
            />
          )}
          {isEditPelangganOpen && (
            <ModalEditPelanggan
              modalClose={setIsEditPelangganOpen}
              isOpen={isEditPelangganOpen}
              dataPelanggan={dataDipilih}
              onEdit={handleEditPelanggan}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Pelanggan;
