import React from "react";

// Define the structure for a column
interface Column {
  label: string; // Column display name
  field: string; // Key for data in row
}

interface TableProps {
  columns: Column[]; // Array of column definitions
  rows: any[]; // Array of row data
}

export default function Table({ columns, rows }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* Generate table headers dynamically */}
        <thead>
          <tr>
            <th>
              <input type="checkbox" className="checkbox" />
            </th>
            {columns.map((column) => (
              <th key={column.field}>{column.label}</th>
            ))}
            <th></th>
          </tr>
        </thead>

        {/* Generate table rows dynamically */}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              {columns.map((column) => (
                <td key={column.field}>
                  {typeof row[column.field] === "string" ||
                  typeof row[column.field] === "number"
                    ? row[column.field]
                    : row[column.field].toString()}
                </td>
              ))}
              <th>
                <button className="btn btn-ghost btn-xs">details</button>
              </th>
            </tr>
          ))}
        </tbody>

        {/* Footer */}
        <tfoot>
          <tr>
            <th></th>
            {columns.map((column) => (
              <th key={column.field}>{column.label}</th>
            ))}
            <th></th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
