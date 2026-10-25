import { Eye, Printer } from "lucide-react";
import { color } from "../../utils/dataColorLight";

function CardNota({ nota, modalOpen, detail }) {
  const handlePrint = () => {
    sessionStorage.setItem("print_data", JSON.stringify(nota));

    window.open("/print", "_blank");
  };
  return (
    <div
      className={`flex flex-col justify-between ${color.bgSurface} border ${color.border} border-l-4 ${nota.statusPembayaran === "Lunas" ? "border-l-light-pos dark:border-l-dark-pos" : "border-l-light-neg dark:border-l-dark-neg"} rounded-xl p-4.5`}
    >
      <div className="flex flex-col justify-between">
        <div className="flex justify-between items-start mb-1">
          <span className={`font-semibold text-sm ${color.text}`}>
            {nota.kodeNota}
          </span>
          <span
            className="flex gap-2 flex-col
           lg:flex-row"
          >
            <span
              className={`text-xs text-center font-medium px-2.5 py-0.5 rounded-full shrink-0 ${nota.statusPembayaran == "Lunas" ? `${color.pos}` : `${color.neg}`}`}
            >
              {nota.statusPembayaran}
            </span>
            <span
              className={`text-xs text-center font-medium px-2.5 py-0.5 rounded-full shrink-0 ${nota.pengerjaan === "Selesai" ? `${color.pos}` : `${color.neg}`}`}
            >
              {nota.pengerjaan}
            </span>
          </span>
        </div>
        <div className={`text-sm font-medium mb-0.5 ${color.text}`}>
          {nota.namaPelanggan}
        </div>
        <div className={`text-xs mb-3 ${color.textMuted}`}>
          {nota.tanggalTransaksi}
        </div>
        <div
          className={`text-sm border-t ${color.border} overflow-y-auto max-h-40 ${color.scrollColor}`}
        >
          {nota.items.map((item) => (
            <div
              key={item.id_item}
              className="flex justify-between items-start gap-2 py-1.5"
            >
              <div className="min-w-0">
                <div className={color.text}>{item.nama_barang}</div>
                <div className={`text-xs ${color.textMuted}`}>
                  {`(${
                    item.ukuran_p != undefined ? item.ukuran_p : item.ukuran
                  } x ${
                    item.ukuran_l != undefined ? item.ukuran_l : item.ukuran
                  } ${item.satuan_ukuran}) (${item.jumlah} ${item.satuan_jumlah})`}
                </div>
              </div>
              <div className={`text-sm shrink-0 ${color.textMuted}`}>
                {`Rp. ${item.subtotal.toLocaleString("id-ID")}`}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-end gap-1 mt-3">
        <div
          className={`flex justify-between items-center mt-2 pt-3 border-t ${color.border}`}
        >
          <span
            className={`text-xs ${color.textMuted}`}
          >{`${nota.items.length} Item`}</span>
          <span
            className={`font-semibold ${color.text}`}
          >{`Rp. ${nota.total.toLocaleString("id-ID")}`}</span>
        </div>
        <div className="flex justify-end gap-1">
          <button
            className={`inline-flex items-center justify-center w-7 h-7 rounded-md cursor-pointer ${color.textMuted} p-1 ${color.navHover}`}
            onClick={() => (modalOpen(true), detail(nota))}
          >
            <Eye />
          </button>
          <button
            className={`inline-flex items-center justify-center w-7 h-7 rounded-md cursor-pointer ${color.textMuted} p-1 ${color.navHover}`}
            onClick={handlePrint}
          >
            <Printer />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardNota;
