// components/MapModal.tsx

import LeafletInputMap from "./LeafletInputMap";

type MapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: number, lng: number) => void;
};

const MapModal = ({ isOpen, onClose, onSelect }: MapModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="w-[90vw] max-w-3xl rounded-lg bg-white p-4 shadow-xl">
        <h2 className="mb-2 text-xl font-semibold">Select Location</h2>

        <LeafletInputMap onSelect={onSelect} />

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
