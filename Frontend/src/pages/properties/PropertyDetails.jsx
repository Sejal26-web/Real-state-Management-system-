import PropertyDocuments from "../../components/PropertyDocuments";

const PropertyDetails = ({ property }) => {
  return (
    <div>
      {/* existing property info UI */}

      <PropertyDocuments propertyId={property._id} />
    </div>
  );
};

export default PropertyDetails;
