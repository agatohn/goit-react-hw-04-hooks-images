import { useState } from "react";
import { ToastContainer } from "react-toastify";
import SearchForm from "./Components/searchForm/SearchForm";
import ImageGallery from "./Components/imageGallery/ImageGallery";
import Modal from "./Components/modal/Modal";

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [urlModal, setUrlModal] = useState("");

  const handleFormSubmit = (query) => {
    setQuery(query);
    setPage(Number(1));
  };

  const handlePageIncr = () => {
    setPage(page + 1);
  };

  const closeModal = () => {
    setUrlModal("");
    setShowModal(false);
  };

  const handleImageClick = (url) => {
    setUrlModal(url);
    setShowModal(true);
  };

  return (
    <div>
      <SearchForm onSubmit={handleFormSubmit} />
      {showModal && <Modal url={urlModal} onClose={closeModal} />}
      <ImageGallery
        query={query}
        page={page}
        onOpen={handleImageClick}
        handlePageIncr={handlePageIncr}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
