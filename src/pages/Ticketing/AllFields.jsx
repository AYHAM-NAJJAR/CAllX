import React, { useState, useEffect } from 'react';
import ActiveFieldsTable from './components/FieldsTable';
import { allFields } from '../../services/TicketingStructure/getAllFields';
import FieldsTable from './components/FieldsTable';


function AllFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("Token");

  useEffect(() => {
    const fetchFields = async () => {
      try {
        setLoading(true);

        const data = await allFields(token);

        const sortedFields = data.sort(
          (a, b) => a.displayOrder - b.displayOrder
        );

        setFields(sortedFields);
      } catch (err) {
        setError("Failed to load field data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchFields();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="p-5">
        Loading fields...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div
      className="p-5 mx-auto max-w-[1200px] font-sans"
      style={{ direction: 'ltr' }}
    >
      <h1 className="text-3xl font-bold mb-6 text-white">
        All  Ticket Field Definitions
      </h1>

      <FieldsTable fields={fields} />
    </div>
  );
}

export default AllFields;