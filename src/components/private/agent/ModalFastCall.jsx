
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ModalFastCall({ isOpen, setIsOpen }) {
   const recentTickets = [
    { id: 1, name: 'John Doe', number: '+95684455', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Jane Smith', number: '+95684455', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: 3, name: 'Robert Wilson', number: '+95684455', avatar: 'https://randomuser.me/api/portraits/men/62.jpg' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => setIsOpen(false)}
      className="bg-primary p-6 rounded-xl w-[400px] mx-auto  shadow-xl"
      overlayClassName="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center"
    >
          <div className="space-y-5">
            {recentTickets.map(ticket => (
              <div key={ticket.id} className="bg-[#111821] border border-gray-800 rounded-3xl p-6 flex items-center gap-5 hover:border-gray-700 transition">
                <img src={ticket.avatar} alt={ticket.name} className="w-16 h-16 rounded-full" />
                <div className="flex-1">
                  <p className="text-white font-bold text-lg mb-1">{ticket.name}</p>
                  <p className="text-gray-500 text-xs font-mono">{ticket.number}</p>
                </div>
                <button className="bg-[#12221A] border border-[#2BB673]/30 text-[#2BB673] px-6 py-2.5 rounded-full text-xs font-bold uppercase flex items-center gap-2.5 hover:bg-[#2BB673] hover:text-white transition">
                  <span className="text-lg">📞</span> CALL
                </button>
              </div>
            ))}
          </div>
    </Modal>
  );
}

export default ModalFastCall;
