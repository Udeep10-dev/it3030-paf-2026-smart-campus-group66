import { useEffect, useState } from "react";
import resourceService from "../../../services/resourceService";
import ResourceFilter from "../../../components/resources/ResourceFilter";
import ResourceTable from "../../../components/admin/resources/ResourceTable";
import ResourceForm from "../../../components/resources/ResourceForm";

const ResourceAdminPage = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({});
  const [editingResource, setEditingResource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await resourceService.getAll(filters);
      setResources(Array.isArray(res.data) ? res.data : (res.data.data ?? []));
    } catch {
      setResources([]);
    }
  };

  useEffect(() => { fetchResources(); }, [filters]);

  const openAdd = () => {
    setEditingResource(null);
    setModalOpen(true);
  };

  const openEdit = (resource) => {
    setEditingResource(resource);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingResource(null);
  };

  const handleSave = async (form) => {
    if (editingResource) {
      await resourceService.update(editingResource.id, form);
    } else {
      await resourceService.create(form);
    }
    closeModal();
    fetchResources();
  };

  const handleDelete = async (id) => {
    await resourceService.remove(id);
    fetchResources();
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-medium" style={{ color: "#7C3B0A" }}>
            Resource management
          </h1>
          <span
            className="text-xs font-medium px-3 py-1 rounded-full"
            style={{ background: "#FAECE7", color: "#993C1D", border: "0.5px solid #F5C4A0" }}
          >
            Admin only
          </span>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 rounded-lg text-sm font-medium text-white cursor-pointer"
          style={{ background: "#D85A30" }}
        >
          + Add resource
        </button>
      </div>

      <ResourceFilter setFilters={setFilters} />

      <ResourceTable
        resources={resources}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {modalOpen && (
        <ResourceForm
          key={editingResource?.id ?? "new"}
          initialData={editingResource ?? {}}
          isEditing={!!editingResource}
          onSubmit={handleSave}
          onCancel={closeModal}
        />
      )}
    </div>
  );
};

export default ResourceAdminPage;