import ResourceForm from "../../components/resources/ResourceForm.jsx";

const ResourceFormPage = () => {



  return (
    <div className="min-h-screen p-6" style={{ background: "#FFF8F3" }}>
      <h1 className="text-2xl font-medium mb-5" style={{ color: "#7C3B0A" }}>
        Add Resources
      </h1>
      <div className="mt-6 flex justify-center">
        <ResourceForm />
      </div>
    </div>
  );
};

export default ResourceFormPage;