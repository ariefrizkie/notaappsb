import { Plus } from "lucide-react";
import Sidebar from "../../components/Sidebar/index.jsx";
import Card from "../../components/Card/index.jsx";
import Table from "../../components/Table/index.jsx";
import { titleData } from "../../services/data.jsx";
import { color } from "../../utils/dataColorLight.js";
import { Link } from "react-router";
import { useLocalStorage } from "../../services/useLocalStorage.js";
import { dateString } from "../../utils/dateString.js";
import BackUpLocale from "../../components/BackupLocale/BackUpLocale.jsx";
import { useEffect, useState } from "react";
import { supabase } from "../../services/supabaseClient.js";
import { useSupabase } from "../../services/useSupabase.js";

function Dashboard() {
  const [dbNota, setDbNota] = useLocalStorage("db_nota", []);
  const [dbItemsNota, setDbItemsNota] = useLocalStorage("db_items_nota", []);
  const [dbPembayaran, setDbPembayaran] = useLocalStorage("db_pembayaran", []);
  const [dbPelanggan, setDbPelanggan] = useLocalStorage("db_pelanggan", []);

  const transaksiTerbaru = () => {
    const listItem = dbItemsNota
      .slice()
      .reverse()
      .map((item) => {
        const listNota = dbNota.find((nota) => {
          return nota.id_nota == item.id_nota;
        });

        const listPembayaran = dbPembayaran.find((pembayaran) => {
          return pembayaran.id_nota === item.id_nota;
        });

        return {
          idItem: item.id_item,
          kodeNota: listNota.kode_nota,
          namaPelanggan: listNota.nama_customer,
          namaBarang: item.nama_barang,
          jenis: item.jenis_barang,
          total: `Rp. ${listPembayaran.total_pembayaran.toLocaleString("id-ID")}`,
          statusPembayaran: listPembayaran.status_pembayaran,
          tanggalTransaksi: dateString(listPembayaran.tanggal_transaksi),
          pengerjaan: item.status_item,
        };
      });

    return listItem;
  };

  const totalPerbulan = dbNota.reduce(
    (acc, nota) => acc + Number(nota.total_pembayaran),
    0,
  );

  const notaBelumLunas = () => {
    const listBelumLunas = dbPembayaran.filter(
      (pembayaran) => pembayaran.status_pembayaran === "Belum Lunas",
    );

    const tunggakan = listBelumLunas.reduce(
      (acc, nota) => acc + Number(nota.sisa_tagihan),
      0,
    );

    return {
      belumLunas: listBelumLunas.length,
      sisaTagihan: tunggakan,
    };
  };

  const listDalamProses = dbNota.filter(
    (nota) => nota.status_pesanan === "Dalam Proses",
  );

  const [dataCoba, setDataCoba] = useSupabase("db_pembayaran", []);

  console.log(dataCoba);
  return (
    <>
      <div className={`relative flex transition-colors w-full`}>
        <Sidebar />
        <main
          className={`fixed left-18 right-0 h-screen max-h-screen ${color.bg} overflow-y-auto ${color.scrollColor}`}
        >
          <div className="flex flex-col px-8 py-6 font-manrope gap-6">
            <div className="flex justify-between">
              <div className="header">
                <h1 className={`text-2xl font-semibold ${color.text}`}>
                  Selamat Siang, Arif
                </h1>
                <h2 className="text-sm text-light-muted dark:text-dark-muted">
                  Minggu, 8 September 2026
                </h2>
              </div>
              <Link
                to="/nota-baru"
                className={`flex gap-2 items-center px-4 py-2 ${color.accentPrimary} rounded-xl font-semibold text-sm cursor-pointer`}
              >
                <Plus />
                Nota Baru
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <Card
                accent="border-l-light-accent-1 dark:border-l-dark-accent-1"
                title="Penjualan Bulan Ini"
                content={`Rp. ${totalPerbulan.toLocaleString("id-ID")}`}
                detail="Hasil Penjualan Selama Satu Bulan"
                accentDetail="text-light-pos dark:text-dark-pos"
              />
              <Card
                accent="border-l-light-accent-2 dark:border-l-dark-accent-2"
                title="Nota Belum Lunas"
                content={
                  notaBelumLunas().belumLunas > 0
                    ? `${notaBelumLunas().belumLunas} Nota`
                    : "Semua Nota Lunas"
                }
                detail={
                  notaBelumLunas().belumLunas > 0
                    ? `Rp. ${notaBelumLunas().sisaTagihan.toLocaleString("id-ID")}`
                    : "Tidak Ada Tunggakan"
                }
                accentDetail="text-light-neg dark:text-dark-neg"
              />
              <Card
                accent="border-l-light-accent-3 dark:border-l-dark-accent-3"
                title="Pesanan Dalam Proses"
                content={
                  listDalamProses.length > 0
                    ? `${listDalamProses.length} Pesanan`
                    : "Pesanan Selesai"
                }
                detail={
                  listDalamProses.length > 0
                    ? "Masih Dalam Proses"
                    : "Semua Pesanan Telah Selesai"
                }
                accentDetail="text-light-muted dark:text-dark-muted"
              />
              <Card
                accent="border-l-light-accent-4 dark:border-l-dark-accent-4"
                title="Total Pelanggan"
                content={
                  dbPelanggan.length > 0
                    ? `${dbPelanggan.length} Pelanggan`
                    : "Belum Ada Pelanggan"
                }
                detail={
                  listDalamProses.length > 0
                    ? "Sudah melakukan pembelian"
                    : "Pelanggan masih kosong"
                }
                accentDetail="text-light-muted dark:text-dark-muted"
              />
            </div>
            <div
              className={`font-manrope px-5 ${color.bgSurface} ${color.border} rounded-xl pt-5 pb-2 overflow-x-auto ${color.scrollColor}`}
            >
              <h3 className={`font-semibold mb-5 text-sm  ${color.text}`}>
                Transaksi Terbaru
              </h3>
              <Table titles={titleData} datas={transaksiTerbaru()} />
            </div>
            <BackUpLocale />
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
