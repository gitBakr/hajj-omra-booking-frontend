import { useState } from 'react';

export const useModals = () => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openEmailModal = () => setShowEmailModal(true);
  const closeEmailModal = () => setShowEmailModal(false);

  const openPriceModal = () => setShowPriceModal(true);
  const closePriceModal = () => setShowPriceModal(false);

  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);

  return {
    showEmailModal,
    showPriceModal,
    showConfirmModal,
    openEmailModal,
    closeEmailModal,
    openPriceModal,
    closePriceModal,
    openConfirmModal,
    closeConfirmModal
  };
}; 