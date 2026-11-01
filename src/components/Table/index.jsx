import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import { color } from "../../utils/dataColorLight";

function Table({ titles, datas, loading }) {
  return (
    <table className="w-full text-sm border-collapse rounded-xl">
      <TableHeader titles={titles} />
      {loading ? (
        <tbody>
          <tr>
            <td
              colSpan={titles.length}
              className={`${color.textMuted} text-center font-semibold py-3`}
            >
              Memuat data...
            </td>
          </tr>
        </tbody>
      ) : (
        <TableBody datas={datas} titles={titles} />
      )}
    </table>
  );
}

export default Table;
