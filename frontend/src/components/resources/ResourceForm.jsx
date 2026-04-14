import { useState } from "react";

const ResourceForm = ({ onSubmit, initialData = {} }) => {
  const [form, setForm] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    status: "ACTIVE",
    ...initialData
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
      <input name="name" placeholder="Name" onChange={handleChange} value={form.name} />
      <input name="type" placeholder="Type" onChange={handleChange} value={form.type} />
      <input name="capacity" placeholder="Capacity" onChange={handleChange} value={form.capacity} />
      <input name="location" placeholder="Location" onChange={handleChange} value={form.location} />

      <select name="status" onChange={handleChange} value={form.status}>
        <option value="ACTIVE">ACTIVE</option>
        <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
      </select>

      <button type="submit">Save</button>
    </form>
  );
};

export default ResourceForm;