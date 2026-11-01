import { color } from "../../utils/dataColorLight";

function TableBody({ datas, titles, emptyMessage = "Tidak ada data" }) {
  return (
    <tbody>
      {datas.length === 0 ? (
        <tr>
          <td
            colSpan={titles.length}
            className={`${color.textMuted} text-center font-semibold py-3`}
          >
            {emptyMessage}
          </td>
        </tr>
      ) : (
        datas.map((data, dataIndex) => (
          <tr
            key={data.idItem || data.idProduk || dataIndex}
            className={`border-b ${color.border} ${color.text} text-sm text-left hover:bg-light-surface-alt/40 dark:hover:bg-dark-surface-alt/50`}
          >
            {titles.map((column, colIndex) => (
              <td
                key={column.name || colIndex}
                className="py-3 px-4 font-medium "
              >
                {column.render ? column.render(data) : data[column.acc]}
              </td>
            ))}
          </tr>
        ))
      )}
    </tbody>
  );
}

export default TableBody;
