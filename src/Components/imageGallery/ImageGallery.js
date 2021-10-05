import { Component } from "react";
import ImageGalleryItem from "./imageGalleryItem/ImageGalleryItem";
import imgAPI from "../../Services/pixabay-api";
import { toast } from "react-toastify";
import Loader from "react-loader-spinner";
import PropTypes from "prop-types";

const Status = {
  IDLE: "idle",
  PENDING: "pending",
  PENDINGMORE: "pendingMore",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};

export default class ImageGallery extends Component {
  state = {
    imgs: null,
    error: null,
    status: Status.IDLE,
  };

  componentDidUpdate(prevProps, prevState) {
    const prevQuery = prevProps.query;
    const nextQuery = this.props.query;
    const prevPage = prevProps.page;
    const nextPage = this.props.page;

    if (prevQuery !== nextQuery) {
      this.setState({ status: Status.PENDING });

      imgAPI
        .fetchImg(nextQuery)
        .then(({ hits }) => {
          if (hits[0]) {
            return this.setState({
              imgs: [...hits],
              status: Status.RESOLVED,
            });
          }
          toast.error("Такой картинки не существует.");
          this.setState({ status: Status.IDLE });
        })
        .catch((error) => this.setState({ error, status: Status.REJECTED }));
    }
    if (prevPage !== nextPage && prevQuery === nextQuery) {
      this.setState({ status: Status.PENDINGMORE });
      let prevPage = [];
      if (prevState.imgs) {
        prevPage = [...prevState.imgs];
      }

      imgAPI
        .fetchImg(prevQuery, nextPage)
        .then(({ hits }) => {
          return this.setState({
            imgs: [...prevPage, ...hits],
            status: Status.RESOLVED,
          });
        })
        .catch((error) => this.setState({ error, status: Status.REJECTED }))
        .finally(() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          })
        );
    }
  }

  render() {
    const { imgs, error, status } = this.state;
    const { query, handlePageIncr, onOpen } = this.props;

    if (status === "idle") {
      return <div className="Div">Введите поисковый запрос.</div>;
    }

    if (status === "pending") {
      return (
        <div className="Div">
          Ожидаем ответ по запросу: {query}
          <Loader
            type="ThreeDots"
            color="#00BFFF"
            height={20}
            width={100}
            timeout={1000}
          />
        </div>
      );
    }

    if (status === "rejected") {
      return <div>Возникла ошибка: {error.message}</div>;
    }

    if (status === "resolved") {
      return (
        <>
          <ul className="ImageGallery">
            {imgs.map((img) => (
              <ImageGalleryItem
                urlLarge={img.largeImageURL}
                url={img.webformatURL}
                alt={img.tags + img.tags}
                key={img.id}
                onClick={onOpen}
              />
            ))}
          </ul>
          <button onClick={handlePageIncr} className="Button" type="button">
            Load More!
          </button>
        </>
      );
    }
    if (status === "pendingMore") {
      return (
        <>
          <ul className="ImageGallery">
            {imgs.map((img) => (
              <ImageGalleryItem
                url={img.webformatURL}
                alt={img.tags}
                key={img.id + img.tags}
                onClick={onOpen}
              />
            ))}
          </ul>
          <button className="Loader" type="button">
            <Loader
              type="ThreeDots"
              color="#00BFFF"
              height={20}
              width={100}
              timeout={1000}
            />
          </button>
        </>
      );
    }
  }
}

ImageGallery.propTypes = {
  query: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  onOpen: PropTypes.func.isRequired,
  handlePageIncr: PropTypes.func.isRequired,
};
