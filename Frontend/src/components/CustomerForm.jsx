const CustomerForm = ({ form, setForm, onSubmit, isEdit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={e => setForm({ ...form, phone: e.target.value })}
        required
      />

      <button type="submit">
        {isEdit ? "Update Customer" : "Add Customer"}
      </button>
    </form>
  );
};

export default CustomerForm;
