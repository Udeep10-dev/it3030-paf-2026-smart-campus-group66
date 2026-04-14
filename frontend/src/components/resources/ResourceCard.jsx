const ResourceCard = ({ resource }) => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="font-bold">{resource.name}</h2>
      <p>Type: {resource.type}</p>
      <p>Capacity: {resource.capacity}</p>
      <p>Location: {resource.location}</p>
      <p>Status: {resource.status}</p>
    </div>
  );
};

export default ResourceCard;