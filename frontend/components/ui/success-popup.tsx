import Popup from './popup';
import SuccessAnimation from './success-animation';

interface SuccessPopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function SuccessPopup({
  open,
  onClose,
  title = 'Success!',
  description,
}: SuccessPopupProps) {
  return (
    <Popup open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-10 text-center py-8">
        <SuccessAnimation />

        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

        {description && <p className="text-gray-500 text-sm">{description}</p>}
      </div>
    </Popup>
  );
}
