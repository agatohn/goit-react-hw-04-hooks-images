import { useState, useEffect } from "react";
import ImageGalleryItem from "./imageGalleryItem/ImageGalleryItem";
import imgAPI from "../../Services/pixabay-api";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";

export default function ImageGallery({ query, page, onOpen, handlePageIncr }) {
  const [imgs, setImgs] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");

  function fetchSetter(imgArr, status) {
    setImgs(imgArr);
    setStatus(status);
  }
  function errorSetter(error, status) {
    setError(error);
    setStatus(status);
  }

  useEffect(() => {
    if (!query) {
      return;
    }
    if (query !== "" && page === 1) {
      setStatus("pending");

      imgAPI
        .fetchImg(query)
        .then(({ hits }) => {
          if (hits[0]) {
            return fetchSetter([...hits], "resolved");
          }
          toast.error("Такой картинки не существует.");
          setStatus("idle");
        })
        .catch((error) => errorSetter(error, "rejected"));
    }
    if (page !== 1 && query !== "") {
      setStatus("pending");
      imgAPI // eslint-disable-line
        .fetchImg(query, page)
        .then(({ hits }) => {
          return fetchSetter([...imgs, ...hits], "resolved");
        })
        .catch((error) => errorSetter(error, "rejected"))
        .finally(() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          })
        );
    }
  }, [page, query]);

  return (
    <>
      {status === "idle" && (
        <div className="Div">Введите поисковый запрос.</div>
      )}
      {status === "rejected" && <div>Возникла ошибка: {error.message}</div>}
      {(status === "resolved" || (status === "pending" && imgs)) && (
        <ul className="ImageGallery">
          {imgs.map((img) => (
            <ImageGalleryItem
              urlLarge={img.largeImageURL}
              url={img.webformatURL}
              alt={img.tags}
              key={img.id + img.webformatURL}
              onClick={onOpen}
            />
          ))}
        </ul>
      )}
      {status === "resolved" && (
        <button onClick={handlePageIncr} className="Button" type="button">
          Load More!
        </button>
      )}
      {status === "pending" && (
        <Loader
          className="Loader"
          type="ThreeDots"
          color="#00BFFF"
          height={20}
          width={100}
          timeout={1000}
        />
      )}
    </>
  );
}
// }

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  onOpen: PropTypes.func.isRequired,
  handlePageIncr: PropTypes.func.isRequired,
};
