import PropTypes from "prop-types";

export default function ImageGalleryItem({ url, alt, onClick, urlLarge }) {
  return (
    <li className="ImageGalleryItem">
      <img
        onClick={() => onClick(urlLarge)}
        src={url}
        alt={alt}
        className="ImageGalleryItem-image"
      />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  urlLarge: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
