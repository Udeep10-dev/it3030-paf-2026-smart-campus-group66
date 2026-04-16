import { useEffect, useState } from "react";
import resourceService from "../../../services/resourceService";
import ResourceFilter from "../../../components/resources/ResourceFilter";
import ResourceTable from "../../../components/admin/resources/ResourceTable";
import ResourceForm from "../../../components/resources/ResourceForm";
import DeleteResourceModal from "../../../components/admin/resources/DeleteResourceModal";

const ResourceAdminPage = () => {
  const [resources, setResources] = useState([
    {
      id: "1",
      title: "React Basics Guide",
      description:
        "Learn fundamentals of React including hooks and components.",
      category: "Programming",
      type: "PDF",
      status: "available",
    },
    {
      id: "2",
      title: "Database Design Notes",
      description: "Introduction to ER diagrams and normalization.",
      category: "Database",
      type: "Document",
      status: "available",
    },
    {
      id: "3",
      title: "Java Tutorial",
      description: "Complete beginner guide for Java programming.",
      category: "Programming",
      type: "Video",
      status: "out of stock",
    },
  ]);
  const [filters, setFilters] = useState({});
  const [editingResource, setEditingResource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchResources = async () => {
    try {
      const res = await resourceService.getAll(filters);
      setResources(Array.isArray(res.data) ? res.data : (res.data.data ?? []));
    } catch {
      setResources([]);
    }
  };

  //   useEffect(() => { fetchResources(); }, [filters]);

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

  const handleDelete = async () => {
    if (!deleteTarget) return;

    await resourceService.delete(deleteTarget.id);
    setDeleteTarget(null);
    fetchResources();
  };

  const openDelete = (resource) => {
    setDeleteTarget(resource);
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-orange-900 tracking-tight">
            Resource management
          </h1>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-50 text-red-600 ring-1 ring-red-100">
            Admin
          </span>
        </div>
        <button
          onClick={openAdd}
          className="h-9 px-4 rounded-xl text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all cursor-pointer shadow-sm shadow-orange-200"
        >
          + Add resource
        </button>
      </div>

      <ResourceFilter setFilters={setFilters} />

      <ResourceTable
        resources={resources}
        onEdit={openEdit}
        onDelete={openDelete}
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

      {deleteTarget && (
        <DeleteResourceModal
          resource={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default ResourceAdminPage;
