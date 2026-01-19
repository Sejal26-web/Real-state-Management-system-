const Table = ({ columns, data, actions }) => {
  return (
    <table border="1" width="100%" cellPadding="8">
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col}>{col}</th>
          ))}
          {actions && <th>Actions</th>}
        </tr>
      </thead>

      <tbody>
        {data.map(row => (
          <tr key={row._id}>
            {columns.map(col => (
              <td key={col}>{row[col]}</td>
            ))}
            {actions && (
              <td>
                <button onClick={() => actions.edit(row)}>Edit</button>
                <button onClick={() => actions.delete(row._id)}>Delete</button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
