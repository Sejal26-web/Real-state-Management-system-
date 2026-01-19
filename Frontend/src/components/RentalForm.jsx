const RentalForm = ({ form, setForm, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="Property ID"
        value={form.property}
        onChange={e => setForm({ ...form, property: e.target.value })}
        required
      />

      <input
        placeholder="Tenant ID"
        value={form.tenant}
        onChange={e => setForm({ ...form, tenant: e.target.value })}
        required
      />

      <input
        placeholder="Monthly Rent"
        type="number"
        value={form.rent}
        onChange={e => setForm({ ...form, rent: e.target.value })}
        required
      />

      <button type="submit">Create Rental</button>
    </form>
  );
};

export default RentalForm;
