import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FarmerRequest {
  _id: string;
  farmerName: string;
  location: string;
  landArea: number;
  quantity: number;
  duration: number;
  availableDate: string;
  profileUrl?: string;
  additionalNotes?: string;
  status?: string;
}

const Farbidings: React.FC = () => {
  const [farmerRequests, setFarmerRequests] = useState<FarmerRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<'accept' | 'reject' | 'signContract' | 'chat' | null>(null);
  const [confirmActionType, setConfirmActionType] = useState<'accept' | 'reject' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmerRequests = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/farmer/freq');
        setFarmerRequests(response.data);
      } catch (err) {
        setError('Failed to fetch farmer requests');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarmerRequests();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await axios.post(`http://localhost:5000/api/v1/farmer/accept/${id}`);
      setFarmerRequests(farmerRequests.map(req =>
        req._id === id ? { ...req, status: 'Accepted' } : req
      ));
    } catch (err) {
      console.error('Failed to accept request', err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/farmer/reject/${id}`);
      setFarmerRequests(farmerRequests.filter(req => req._id !== id));
    } catch (err) {
      console.error('Failed to reject request', err);
    }
  };

  const openActionModal = (farmer: FarmerRequest, type: 'accept' | 'reject') => {
    setSelectedFarmer(farmer);
    setConfirmActionType(type);
    setIsModalOpen(true);
  };

  const closeActionModal = () => {
    setIsModalOpen(false);
    setSelectedFarmer(null);
    setConfirmActionType(null);
  };

  const openConfirmationModal = (type: 'signContract' | 'chat') => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsModalOpen(false);
    setActionType(null);
  };

  const openDetailModal = (farmer: FarmerRequest) => {
    setSelectedFarmer(farmer);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedFarmer(null);
  };

  const confirmAction = async () => {
    if (confirmActionType === 'accept' && selectedFarmer) {
      await handleAccept(selectedFarmer._id);
    } else if (confirmActionType === 'reject' && selectedFarmer) {
      await handleReject(selectedFarmer._id);
    }
    closeActionModal();
  };

  const handleSignContract = () => {
    navigate('/contract'); // Navigates to the /contract page
  };

  const handleChat = () => {
    navigate('/chat'); // Navigates to the /chat page
  };

  const confirmSignContract = () => {
    handleSignContract();
    closeConfirmationModal();
  };

  const confirmChat = () => {
    handleChat();
    closeConfirmationModal();
  };

  if (loading) return <p className="text-center text-lg font-semibold">Loading...</p>;
  if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Farmer Requests</h1>
      <div className="overflow-x-auto rounded-lg shadow-md">
        {/* Table for larger screens */}
        <table className="hidden md:table min-w-full bg-white border border-gray-300 rounded-lg shadow">
          <thead className="bg-green-200 text-green-900">
            <tr className="text-left">
              <th className="py-4 px-6 font-semibold border-b">Farmer Name</th>
              <th className="py-4 px-6 font-semibold border-b">Location</th>
              <th className="py-4 px-6 font-semibold border-b">Land Area (acres)</th>
              <th className="py-4 px-6 font-semibold border-b">Quantity (kg)</th>
              <th className="py-4 px-6 font-semibold border-b">Duration (days)</th>
              <th className="py-4 px-6 font-semibold border-b">Available By</th>
              <th className="py-4 px-6 font-semibold border-b">Additional Notes</th>
              <th className="py-4 px-6 font-semibold border-b">Profile URL</th>
              <th className="py-4 px-6 font-semibold border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {farmerRequests.map(request => (
              <React.Fragment key={request._id}>
                <tr className="hover:bg-green-100 transition duration-150 ease-in-out">
                  <td className="py-3 px-6 border-b">
                    <span className="text-gray-700">{request.farmerName}</span>
                  </td>
                  <td className="py-3 px-6 border-b">{request.location}</td>
                  <td className="py-3 px-6 border-b">{request.landArea}</td>
                  <td className="py-3 px-6 border-b">{request.quantity}</td>
                  <td className="py-3 px-6 border-b">{request.duration}</td>
                  <td className="py-3 px-6 border-b">{new Date(request.availableDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6 border-b">
                    {request.additionalNotes || '-'}
                  </td>
                  <td className="py-3 px-6 border-b">
                    {request.profileUrl ? (
                      <a href={request.profileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View Profile
                      </a>
                    ) : (
                      'No URL'
                    )}
                  </td>
                  <td className="py-3 px-6 border-b flex space-x-2">
                    {request.status === 'Accepted' ? (
                      <>
                        <button
                          onClick={() => openConfirmationModal('signContract')}
                          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                        >
                          Sign Contract
                        </button>
                        <button
                          onClick={() => openConfirmationModal('chat')}
                          className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600 transition"
                        >
                          Chat
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openActionModal(request, 'accept')}
                          className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => openActionModal(request, 'reject')}
                          className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {/* List for smaller screens */}
        <div className="md:hidden">
          {farmerRequests.map(request => (
            <div
              key={request._id}
              className="p-4 mb-4 bg-white border border-gray-300 rounded-lg shadow hover:bg-gray-100 transition duration-150 ease-in-out"
            >
              <button
                onClick={() => openDetailModal(request)}
                className="text-gray-700 font-semibold hover:underline"
              >
                {request.farmerName}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {isModalOpen && selectedFarmer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">{selectedFarmer.farmerName}</h2>
            <p><strong>Location:</strong> {selectedFarmer.location}</p>
            <p><strong>Land Area:</strong> {selectedFarmer.landArea} acres</p>
            <p><strong>Quantity:</strong> {selectedFarmer.quantity} kg</p>
            <p><strong>Duration:</strong> {selectedFarmer.duration} days</p>
            <p><strong>Available By:</strong> {new Date(selectedFarmer.availableDate).toLocaleDateString()}</p>
            <p><strong>Additional Notes:</strong> {selectedFarmer.additionalNotes || '-'}</p>
            <p><strong>Profile URL:</strong> {selectedFarmer.profileUrl || 'No URL'}</p>
            <button
              onClick={closeDetailModal}
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
            >
              Close
            </button>
            {selectedFarmer.status !== 'Accepted' && (
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => openConfirmationModal('signContract')}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                >
                  Sign Contract
                </button>
                <button
                  onClick={() => openConfirmationModal('chat')}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600 transition"
                >
                  Chat
                </button>
                <button
                  onClick={() => openActionModal(selectedFarmer, 'accept')}
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
                >
                  Accept
                </button>
                <button
                  onClick={() => openActionModal(selectedFarmer, 'reject')}
                  className="bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-600 transition"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isModalOpen && confirmActionType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you want to {confirmActionType} this request?</p>
            <div className="flex space-x-4">
              <button
                onClick={confirmAction}
                className="bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition"
              >
                Yes
              </button>
              <button
                onClick={closeActionModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Sign Contract and Chat */}
      {isModalOpen && actionType && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Are you sure?</h2>
            <p className="mb-4">Do you want to proceed with {actionType === 'signContract' ? 'signing the contract' : 'chat'}?</p>
            <div className="flex space-x-4">
              {actionType === 'signContract' && (
                <button
                  onClick={confirmSignContract}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md shadow hover:bg-blue-600 transition"
                >
                  Yes
                </button>
              )}
              {actionType === 'chat' && (
                <button
                  onClick={confirmChat}
                  className="bg-purple-500 text-white px-4 py-2 rounded-md shadow hover:bg-purple-600 transition"
                >
                  Yes
                </button>
              )}
              <button
                onClick={closeConfirmationModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Farbidings;
