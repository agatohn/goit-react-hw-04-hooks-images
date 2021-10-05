import { Component } from "react";
import { ToastContainer } from "react-toastify";
import SearchForm from "./Components/searchForm/SearchForm";
import ImageGallery from "./Components/imageGallery/ImageGallery";
import Modal from "./Components/modal/Modal";

export default class App extends Component {
  state = {
    query: "",
    page: 1,
    showModal: false,
    urlModal: "",
  };

  handleFormSubmit = (query) => {
    this.setState({ query, page: 1 });
  };
  handlePageIncr = () => {
    this.setState({ page: Number(this.state.page) + 1 });
  };

  closeModal = () => {
    this.setState({ urlModal: "", showModal: false });
  };

  handleImageClick = (url) => {
    this.setState({ urlModal: url, showModal: true });
  };
  //url needed
  render() {
    return (
      <div>
        <SearchForm onSubmit={this.handleFormSubmit} />
        {this.state.showModal && (
          <Modal url={this.state.urlModal} onClose={this.closeModal} />
        )}
        <ImageGallery
          query={this.state.query}
          page={this.state.page}
          onOpen={this.handleImageClick}
          handlePageIncr={this.handlePageIncr}
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
}
