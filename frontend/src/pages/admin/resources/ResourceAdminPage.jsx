import { useEffect, useState } from "react";
import resourceService from "../../../services/resourceService";
import ResourceFilter from "../../../components/resources/ResourceFilter";
import ResourceTable from "../../../components/admin/resources/ResourceTable";
import ResourceForm from "../../../components/resources/ResourceForm";
import DeleteResourceModal from "../../../components/admin/resources/DeleteResourceModal";
import { toast } from "react-hot-toast";

const ResourceAdminPage = () => {
  const [resources, setResources] = useState([]);
  const [filters, setFilters] = useState({});
  const [editingResource, setEditingResource] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchResources = async () => {
    try {
      let res;
      if (filters && Object.keys(filters).length > 0) {
        res = await resourceService.filter(filters);
      } else {
        res = await resourceService.getAll();
      }
      setResources(Array.isArray(res.data) ? res.data : (res.data.data ?? []));
    } catch {
      setResources([]);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [filters]);

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
    try {
      if (editingResource) {
        await resourceService.update(editingResource.id, form);
        toast.success("Successfully updated!");
      } else {
        await resourceService.create(form);
        toast.success("Successfully created!");
      }
      closeModal();
      fetchResources();
    } catch (error) {
      toast.error("Operation failed!");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await resourceService.delete(deleteTarget.id);
      toast.success("Resource deleted!");
      setDeleteTarget(null);
      fetchResources();
    } catch {
      toast.error("Failed to delete!");
    }
  };

  const openDelete = (resource) => {
    setDeleteTarget(resource);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-1.5 bg-[#4FD1C5] rounded-full hidden sm:block" />

            <div>
              <h1 className="text-2xl font-black text-[#123A7A] tracking-tight">
                Resource Management
              </h1>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-black px-2.5 py-0.5 rounded-md bg-[#E6FFFA] text-[#0F766E] uppercase border border-[#B2F5EA]">
                  Administrator
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Control Panel
                </span>
              </div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={openAdd}
            className="flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold text-white 
          bg-gradient-to-r from-[#4FD1C5] to-[#2F80ED] 
          hover:opacity-90 active:scale-95 transition shadow-md"
          >
            <span className="text-xl leading-none">+</span>
            Add Resource
          </button>
        </div>

        {/* FILTER */}
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100">
          <ResourceFilter setFilters={setFilters} />
        </div>

        {/* TABLE */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
          <ResourceTable
            resources={resources}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </div>
      </div>

      {/* MODALS */}
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
