const SaleForm = ({ form, setForm, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        placeholder="Property ID"
        value={form.property}
        onChange={e => setForm({ ...form, property: e.target.value })}
        required
      />

      <input
        placeholder="Buyer ID"
        value={form.buyer}
        onChange={e => setForm({ ...form, buyer: e.target.value })}
        required
      />

      <input
        placeholder="Token Amount"
        type="number"
        value={form.tokenAmount}
        onChange={e => setForm({ ...form, tokenAmount: e.target.value })}
        required
      />

      <button type="submit">Create Sale</button>
    </form>
  );
};

export default SaleForm;
