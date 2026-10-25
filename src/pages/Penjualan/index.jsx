import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import Card from "../../components/Card";
import Sidebar from "../../components/Sidebar";
import { useLocalStorage } from "../../services/useLocalStorage";
import { color } from "../../utils/dataColorLight";
import ModalDetail from "./ModalDetail";
import CardNota from "./CardNota";
import { dateString } from "../../utils/dateString";

function Penjualan() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dbNota, setDbNota] = useLocalStorage("db_nota", []);
  const [dbItemsNota, setDbItemsNota] = useLocalStorage("db_items_nota", []);
  const [dbPembayaran, setDbPembayaran] = useLocalStorage("db_pembayaran", []);
  const [dbPelanggan, setDbPelanggan] = useLocalStorage("db_pelanggan", []);

  const [dataDetail, setDataDetail] = useState({});
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredNota = dbNota.filter((nota) => {
    const keywordLower = keyword.toLowerCase();
    const kodeNota = nota.kode_nota ? nota.kode_nota.toLowerCase() : "";
    const namaPelanggan = nota.nama_customer
      ? nota.nama_customer.toLowerCase()
      : "";
    const pencarianCocok =
      namaPelanggan.includes(keywordLower) || kodeNota.includes(keywordLower);

    const statusPembayaran = dbPembayaran.find(
      (pembayaran) => pembayaran.id_nota === nota.id_nota,
    );

    const filterCocok =
      statusFilter === "" ||
      statusPembayaran.status_pembayaran === statusFilter ||
      nota.status_pesanan === statusFilter;

    let tanggalCocok = true;
    if (nota.tanggal_transaksi) {
      const tglNota = new Date(nota.tanggal_transaksi).setHours(0, 0, 0, 0);

      if (startDate) {
        const statrTimestamp = new Date(startDate).setHours(0, 0, 0, 0);
        tanggalCocok = tanggalCocok && tglNota >= statrTimestamp;
      }

      if (endDate) {
        const endTimestamp = new Date(endDate).setHours(23, 59, 59, 999);
        tanggalCocok = tanggalCocok && tglNota <= endTimestamp;
      }
    } else if (startDate || endDate) {
      tanggalCocok = false;
    }

    return pencarianCocok && filterCocok && tanggalCocok;
  });

  const listPenjualan = () => {
    const listNota = filteredNota
      .slice()
      .reverse()
      .map((nota) => {
        const itemsNota = dbItemsNota.filter((item) => {
          return item.id_nota === nota.id_nota;
        });

        const listPembayaran = dbPembayaran.find((pembayaran) => {
          return pembayaran.id_nota == nota.id_nota;
        });

        const listPelanggan = dbPelanggan.find((pelanggan) => {
          return pelanggan.kode_customer == nota.kode_customer;
        });

        return {
          idNota: nota.id_nota,
          kodeNota: nota.kode_nota,
          tanggalTransaksi: dateString(nota.tanggal_transaksi),
          namaPelanggan: nota.nama_customer,
          nomorTelepon: listPelanggan.nomor_telepon,
          tanggalSelesai: dateString(nota.tanggal_selesai),
          pengerjaan: nota.status_pesanan,
          items: itemsNota,
          total: listPembayaran.total_pembayaran,
          dibayar: listPembayaran.total_dibayar,
          rincianPembayaran: listPembayaran.rincian_pembayaran,
          statusPembayaran: listPembayaran.status_pembayaran,
          sisaTagihan: listPembayaran.sisa_tagihan,
        };
      });

    return listNota;
  };

  const cardHeader = () => {
    const jumlahNota = dbNota.length;
    const notaLunas = dbPembayaran.filter(
      (nota) => nota.status_pembayaran === "Lunas",
    );
    const notaBelumLunas = dbPembayaran.filter(
      (nota) => nota.status_pembayaran === "Belum Lunas",
    );
    const totalPenjualan = dbPembayaran.reduce(
      (acc, pembayaran) => acc + Number(pembayaran.total_pembayaran),
      0,
    );

    return {
      jumlahNota,
      notaLunas,
      notaBelumLunas,
      totalPenjualan,
    };
  };

  const handleStatusItems = (dataItem) => {
    console.log(dataItem);
  };
  const handleStatusPengerjaan = (dataNota) => {
    try {
      const itemSelain = dbItemsNota.map((item) => {
        const itemBaru = dataNota.items.find(
          (baru) => baru.id_item === item.id_item,
        );
        if (itemBaru) {
          return itemBaru;
        }
        return item;
      });

      setDbItemsNota(itemSelain);

      const dataNotaBaru = dbNota.map((nota) => {
        if (nota.id_nota === dataNota.idNota) {
          return {
            ...nota,
            status_pesanan: dataNota.pengerjaan,
          };
        }
        return nota;
      });

      setDbNota(dataNotaBaru);
    } catch (error) {
      console.error("Gagal memperbarui status pengerjaan nota: ", error);
    }
  };

  const handleSimpanPembayaran = (pelunasan) => {
    try {
      const dataPembayaran = dbPembayaran.map((pembayaran) => {
        if (pembayaran.id_nota === pelunasan.idNota) {
          return {
            ...pembayaran,
            rincian_pembayaran: pelunasan.rincianPembayaran,
            sisa_tagihan: pelunasan.sisaTagihan,
            status_pembayaran: pelunasan.statusPembayaran,
          };
        }
        return pembayaran;
      });

      setDbPembayaran(dataPembayaran);
    } catch (error) {
      console.error("Gagal memperbarui Pelunasan nota: ", error);
    }
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
              Daftar Penjualan
            </h1>
            <Link
              to="/nota-baru"
              className={`flex gap-2 items-center px-4 py-2 ${color.accentPrimary} rounded-xl font-semibold text-sm cursor-pointer`}
            >
              <Plus />
              Nota Baru
            </Link>
          </div>

          {/* card */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              accent="border-l-light-accent-2 dark:border-l-dark-accent-2"
              title="Total Penjualan"
              content={`Rp. ${cardHeader().totalPenjualan.toLocaleString("id-ID")}`}
            />
            <Card
              accent="border-l-light-accent-1 dark:border-l-dark-accent-1"
              title="Jumlah Nota"
              content={`${cardHeader().jumlahNota} Nota`}
            />
            <Card
              accent="border-l-light-pos dark:border-l-dark-pos"
              title="Lunas"
              content={`${cardHeader().notaLunas.length} Nota`}
            />
            <Card
              accent="border-l-light-neg dark:border-l-dark-neg"
              title="Belum Lunas"
              content={`${cardHeader().notaBelumLunas.length} Nota`}
            />
          </div>

          {/* filter */}
          <div
            className={`flex flex-col lg:flex-row  items-start lg:items-center gap-3 rounded-xl p-4 ${color.bgSurface} ${color.border} border w-full`}
          >
            <div className="flex gap-3 items-center w-full flex-1">
              <input
                type="text"
                id="search"
                placeholder="Cari no. nota atau nama pelanggan..."
                className={`flex-1 min-w-44 border rounded-lg py-2 px-3 text-sm focus:outline-2 focus:outline-offset-1 ${color.focus} ${color.text} ${color.bgSurfaceAlt} ${color.border}`}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="flex gap-3 items-center">
              <select
                name="filter"
                id="filter"
                className={`py-2 px-3 text-sm rounded-lg ${color.bgSurfaceAlt} focus:outline-2 focus:outline-offset-1 border ${color.focus} ${color.text} ${color.bgSurfaceAlt} ${color.border}`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua</option>
                <option value="Lunas">Lunas</option>
                <option value="Belum Lunas">Belum Lunas</option>
                <option value="Selesai">Selesai</option>
                <option value="Dalam Proses">Dalam Proses</option>
              </select>
              <input
                type="date"
                id="dari"
                className={`min-w-44 border rounded-lg py-2 px-3 text-sm focus:outline-2 focus:outline-offset-1 ${color.focus} ${color.text} ${color.bgSurfaceAlt} ${color.border}`}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className={`text-xs ${color.textMuted}`}>s/d</span>
              <input
                type="date"
                id="sampai"
                className={`min-w-44 border rounded-lg py-2 px-3 text-sm focus:outline-2 focus:outline-offset-1 ${color.focus} ${color.text} ${color.bgSurfaceAlt} ${color.border}`}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button
                className={`py-2 px-3 text-sm border rounded-lg cursor-pointer ${color.text} ${color.border} ${color.bgSurfaceAlt} ${color.hoverFilter}`}
                onClick={() => {
                  setKeyword("");
                  setStartDate("");
                  setEndDate("");
                  setStatusFilter("");
                }}
              >
                Reset
              </button>
            </div>
          </div>

          {/* grid nota */}
          <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
            {listPenjualan().length === 0 ? (
              <div className={`col-span-3 text-center ${color.textMuted}`}>
                Belum Ada Nota Penjualan / Pembelian
              </div>
            ) : (
              listPenjualan().map((nota) => (
                <CardNota
                  key={nota.idNota}
                  nota={nota}
                  modalOpen={setIsModalOpen}
                  detail={setDataDetail}
                />
              ))
            )}
          </div>

          {isModalOpen && (
            <ModalDetail
              modalClose={setIsModalOpen}
              isOpen={isModalOpen}
              dataNota={dataDetail}
              setData={setDataDetail}
              handleStatusItems={handleStatusItems}
              handleStatusPengerjaan={handleStatusPengerjaan}
              handleSimpanPembayaran={handleSimpanPembayaran}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default Penjualan;
