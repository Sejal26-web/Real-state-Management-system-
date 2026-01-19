import React from "react";

const OwnerForm = ({ form, setForm, onSubmit, isEdit }) => {
  return (
    <form onSubmit={onSubmit} style={{ marginBottom: "20px" }}>
      <input
        placeholder="Owner Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        placeholder="Phone"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        required
      />

      <button type="submit">
        {isEdit ? "Update Owner" : "Add Owner"}
      </button>
    </form>
  );
};

export default OwnerForm;
