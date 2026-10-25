import { useRef, useState } from "react";
import { CreditCard, Plus, Ticket } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { color } from "../../utils/dataColorLight";
import DataPelanggan from "./DataPelanggan";
import { dataItemNota } from "../../services/data";
import TableHeader from "../../components/Table/TableHeader";
import BarisItem from "./BarisItem";
import Payment from "./Payment";
import { useLocalStorage } from "../../services/useLocalStorage";
import { useSupabase } from "../../services/useSupabase";
import { postSupabase } from "../../services/postSupabase";

function NotaBaru() {
  const idNotaBaru = useRef(Date.now());
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [customerData, setCustomerData] = useState({
    namaCustomer: "",
    nomorTelepon: "",
    tanggalTransaksi: generateTanggalTransaksi(),
    tanggalSelesai: "",
  });
  const [items, setItems] = useState([
    {
      idItem: Date.now() + Math.random(),
      namaBarang: "",
      jenisBarang: "",
      ukuranPanjang: 1,
      ukuranLebar: 1,
      jumlah: 1,
      hargaBeli: 0,
      hargaJual: 0,
    },
  ]);

  const [paymentMetode, setPaymentMetode] = useState({
    cash: 0,
    transfer: 0,
    eWallet: 0,
  });
  const [dataCoba] = useSupabase("db_nota", []);

  const handleTambahBaris = () => {
    const barisBaru = {
      idItem: Date.now() + Math.random(),
      namaBarang: "",
      jenisBarang: "",
      ukuranPanjang: 1,
      ukuranLebar: 1,
      jumlah: 1,
      hargaBeli: 0,
      hargaJual: 0,
    };

    setItems([...items, barisBaru]);
  };

  const handleUbahInputItem = (index, field, value) => {
    const newItems = [...items];

    newItems[index][field] = value;

    setItems(newItems);
  };

  const handleHapusBaris = (indexBaris) => {
    const newItems = items.filter((item, index) => index !== indexBaris);
    setItems(newItems);
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const autoCompleteNama = (e) => {
    const namaDipilih = e.target.value;

    const pelangganDitemukan = dbPelanggan.find(
      (pelanggan) =>
        pelanggan.nama_customer.toLowerCase() === namaDipilih.toLowerCase(),
    );

    if (pelangganDitemukan) {
      setCustomerData((prev) => ({
        ...prev,
        namaCustomer: pelangganDitemukan.nama_customer,
        nomorTelepon: pelangganDitemukan.nomor_telepon || "",
      }));
    } else {
      setCustomerData((prev) => ({
        ...prev,
        namaCustomer: namaDipilih,
        nomorTelepon: "",
      }));
    }
  };

  const handleNomorTelepon = (e) => {
    const { value } = e.target;
    setCustomerData((prev) => ({
      ...prev,
      nomorTelepon: value,
    }));
  };

  const totalPembayaran = items.reduce(
    (acc, item) =>
      acc +
      item.ukuranPanjang * item.ukuranLebar * item.jumlah * item.hargaJual,
    0,
  );

  const handlePayment = (e) => {
    const { name, value } = e.target;
    setPaymentMetode((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const totalDibayar =
    paymentMetode.cash + paymentMetode.transfer + paymentMetode.eWallet;

  const sisaTagihan = totalPembayaran - totalDibayar;

  const statusPembayaran = sisaTagihan <= 0 ? "Lunas" : "Belum Lunas";

  const [dbNota, setDbNota] = useLocalStorage("db_nota", []);
  const [dbItemsNota, setDbItemsNota] = useLocalStorage("db_items_nota", []);
  const [dbPembayaran, setDbPembayaran] = useLocalStorage("db_pembayaran", []);
  const [dbPelanggan, setDbPelanggan] = useLocalStorage("db_pelanggan", []);

  const indexCustomer = dbPelanggan.findIndex((p) => {
    const pelangganCocok =
      p.nama_customer.toLowerCase() === customerData.namaCustomer.toLowerCase();
    if (customerData.nomorTelepon && p.nomor_telepon) {
      return pelangganCocok || p.nomor_telepon === customerData.nomorTelepon;
    }
    return pelangganCocok;
  });

  const kodePelanggan =
    indexCustomer === -1
      ? generateIdCustomer(dbPelanggan)
      : dbPelanggan[indexCustomer].kode_customer;

  const handleSimpanData = () => {
    const idNota = idNotaBaru.current;

    const dataNota = {
      id_nota: idNota,
      kode_nota: generateKodeNota(dbNota),
      kode_customer: kodePelanggan,
      nama_customer: customerData.namaCustomer,
      tanggal_transaksi: customerData.tanggalTransaksi,
      tanggal_selesai: customerData.tanggalSelesai,
      total_item: items.length,
      total_pembayaran: totalPembayaran,
      status_pesanan: "Dalam Proses",
    };

    const dataItems = items.map((item) => ({
      id_item: Date.now() + Math.random(),
      id_nota: dataNota.id_nota,
      nama_barang: item.namaBarang,
      jenis_barang: item.jenisBarang,
      ukuran_p: item.ukuranPanjang,
      ukuran_l: item.ukuranLebar,
      jumlah: item.jumlah,
      harga_modal: item.hargaBeli * (item.ukuranPanjang + item.ukuranLebar),
      harga_jual: item.hargaJual,
      subtotal:
        item.ukuranPanjang * item.ukuranLebar * item.jumlah * item.hargaJual,
      satuan_ukuran: "Meter",
      satuan_jumlah: "Lembar",
      status_item: "Dalam Proses",
    }));

    const dataPembayaran = {
      id_nota: dataNota.id_nota,
      kode_customer: kodePelanggan,
      nama_customer: customerData.namaCustomer,
      total_pembayaran: totalPembayaran,
      rincian_pembayaran: paymentMetode,
      status_pembayaran: statusPembayaran,
      total_dibayar: totalDibayar,
      sisa_tagihan: sisaTagihan,
      tanggal_transaksi: customerData.tanggalTransaksi,
    };

    setDbNota([...dbNota, dataNota]);
    postSupabase("db_nota", dataNota);
    setDbItemsNota((prevItems) => [...prevItems, ...dataItems]);
    setDbPembayaran([...dbPembayaran, dataPembayaran]);

    let dataPelanggan;
    if (indexCustomer === -1) {
      const data = {
        id_customer: Date.now() + Math.random(),
        kode_customer: generateIdCustomer(dbPelanggan),
        nama_customer: customerData.namaCustomer,
        nomor_telepon: customerData.nomorTelepon || "-",
        alamat: "-",
        total_belanja: items.length,
        total_transaksi: Number(totalPembayaran) || 0,
      };
      dataPelanggan = [...dbPelanggan, data];
    } else {
      let data = dbPelanggan.map((pelanggan, index) => {
        if (indexCustomer === index) {
          return {
            ...pelanggan,
            total_belanja:
              Number(pelanggan.total_belanja ? pelanggan.total_belanja : 0) +
              items.length,
            total_transaksi:
              Number(
                pelanggan.total_transaksi ? pelanggan.total_transaksi : 0,
              ) + totalPembayaran,
          };
        }
        return pelanggan;
      });
      dataPelanggan = data;
    }

    setDbPelanggan(dataPelanggan);

    alert("Transaksi Berhasil disimpan!");
    setIsPaymentModalOpen(false);
    handleResetForm();
  };

  const handleResetForm = () => {
    setCustomerData({
      namaCustomer: "",
      nomorTelepon: "",
      tanggalTransaksi: generateTanggalTransaksi(),
      tanggalSelesai: "",
    });

    setItems([
      {
        idItem: Date.now() + Math.random(),
        namaBarang: "",
        jenisBarang: "",
        ukuranPanjang: 1,
        ukuranLebar: 1,
        jumlah: 1,
        hargaBeli: 0,
        hargaJual: 0,
      },
    ]);

    setPaymentMetode({
      cash: 0,
      transfer: 0,
      eWallet: 0,
    });

    idNotaBaru.current = Date.now();
  };
  console.log(dataCoba);
  return (
    <div className={`relative flex transition-colors w-full`}>
      <Sidebar />
      <main
        className={`fixed left-18 right-0 h-screen max-h-screen ${color.bg} overflow-y-auto ${color.scrollColor}`}
      >
        <div className="flex relative flex-col px-8 py-6  font-manrope gap-6">
          <div className="flex justify-between items-start md:items-center mb-6 flex-col md:flex-row gap-3">
            <h1 className={`text-2xl font-semibold ${color.text}`}>
              Buat Nota Baru
            </h1>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 bg-light-nav-active-bg border-light-accent-primary dark:bg-dark-nav-active-bg dark:border-dark-accent-primary">
              <Ticket className="text-light-nav-active-text/75 dark:text-dark-nav-active-text/75" />
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-medium uppercase tracking-wide text-light-nav-active-text/75 dark:text-dark-nav-active-text/75">
                  Nomor Nota
                </span>
                <span className="font-bold text-light-nav-active-text dark:text-dark-nav-active-text">
                  {generateKodeNota(dbNota)}
                </span>
              </div>
            </div>
          </div>
          <DataPelanggan
            tanggalTransaksi={generateTanggalTransaksi()}
            data={customerData}
            onChange={handleCustomerChange}
            handleNama={autoCompleteNama}
            handleTelepon={handleNomorTelepon}
          />
          <div
            className={`rounded-xl p-5 mb-3 w-full ${color.bgSurface} border ${color.border}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-semibold ${color.text}`}>Item Pesanan</h3>
              <button
                className={`text-xs font-semibold px-3 py-1.5 rounded-full ${color.navActive} flex items-center gap-1.5 cursor-pointer`}
                id="btn-tambah-item"
                onClick={handleTambahBaris}
              >
                <Plus />
                Tambah Item
              </button>
            </div>
            <div className={`overflow-x-auto ${color.scrollColor}`}>
              <table className="w-full text-sm border-collapse min-w-180">
                <TableHeader titles={dataItemNota} />
                <tbody className="w-full">
                  {items.map((item, index) => {
                    const subTotal =
                      item.ukuranPanjang *
                      item.ukuranLebar *
                      item.jumlah *
                      item.hargaJual;
                    return (
                      <BarisItem
                        key={item.idItem}
                        index={index}
                        dataItem={item}
                        onChange={handleUbahInputItem}
                        onClick={handleHapusBaris}
                        subTotal={subTotal}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-5">
              <div className="w-full max-w-96 flex flex-col gap-2">
                <div
                  className={`flex justify-between text-sm ${color.textMuted}`}
                >
                  <span>Total Item</span>
                  <span>{items.length} Item</span>
                </div>
                <div
                  className={`flex justify-between items-center pt-2 border-t ${color.border}`}
                >
                  <span className={`font-semibold ${color.text}`}>
                    Total Pembayaran
                  </span>
                  <span
                    className={`font-semibold ${color.text}`}
                  >{`Rp. ${totalPembayaran.toLocaleString("id-ID")}`}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-5">
              <button
                className={`${color.accentPrimary} flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer`}
                onClick={() => setIsPaymentModalOpen(true)}
              >
                <CreditCard size={18} /> Pembayaran
              </button>
            </div>
          </div>
        </div>
      </main>
      {isPaymentModalOpen && (
        <Payment
          closeModal={setIsPaymentModalOpen}
          isOpen={isPaymentModalOpen}
          totalPembayaran={totalPembayaran}
          dataPayment={paymentMetode}
          handlePayment={handlePayment}
          totalDibayar={totalDibayar}
          sisaTagihan={sisaTagihan}
          statusPembayaran={statusPembayaran}
          handleSimpanData={handleSimpanData}
        />
      )}
    </div>
  );
}

function generateKodeNota(dataNota) {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const datePrefix = `FG${yyyy}${mm}`;

  // const listNota = getDatabaseNota();
  const notaHariIni = dataNota.filter(
    (nota) => nota.kode_nota && nota.kode_nota.startsWith(datePrefix),
  );

  const nextNumber = String(notaHariIni.length + 1).padStart(3, "0");

  // console.log(dataNota);
  return `${datePrefix}${nextNumber}`;
}

const generateTanggalTransaksi = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  const tanggalTransaksi = `${yyyy}-${mm}-${dd}`;

  return tanggalTransaksi;
};

const generateIdCustomer = (dataCustomer) => {
  const prefix = "FGCUST";

  // const listCustomer = getDatabasePelanggan();
  const customerTerakhir = dataCustomer.filter(
    (customer) =>
      customer.kode_customer && customer.kode_customer.startsWith(prefix),
  );

  const nextNumber = String(customerTerakhir.length + 1).padStart(4, "0");

  return `${prefix}${nextNumber}`;
};

export default NotaBaru;
