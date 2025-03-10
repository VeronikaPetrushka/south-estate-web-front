import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchItemById } from '../../redux/items/operations.js';
import { selectItem, selectIsLoading, selectIsError } from '../../redux/items/selectors.js';
import css from './ItemDetails.module.css';

const ItemDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const item = useSelector(selectItem);
  const isLoading = useSelector(selectIsLoading);
  const isError = useSelector(selectIsError);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchItemById(id));
    }
  }, [dispatch, id]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % item.images.length);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? item.images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const container = document.querySelector(`.${css.imageContainer}`);
    if (container) {
      container.scrollTo({
        left: currentImageIndex * container.clientWidth,
        behavior: 'smooth',
      });
    }
  }, [currentImageIndex]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading item.</div>;
  if (!item) return <div>Item not found.</div>;

  console.log(item)

  return (
    <div className={css.detailsContainer}>
       {item.images && item.images.length > 0 && (
        <div className={css.imagesScrollContainer}>
          <button className={css.arrowBtnLeft} onClick={handlePreviousImage}>
            <img src="src/assets/icons/scroll.png" alt="previous" className={css.arrowLeft} />
          </button>
          <div className={css.imageContainer}>
            {item.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Item image ${index + 1}`}
                className={css.itemImage}
              />
            ))}
          </div>
          <button className={css.arrowBtnRight} onClick={handleNextImage}>
            <img src="src/assets/icons/scroll.png" alt="next" className={css.arrowRight} />
          </button>
          <div className={css.dotsContainer}>
            {item.images.map((_, index) => (
              <span
                key={index}
                className={`${css.dot} ${index === currentImageIndex ? css.activeDot : ''}`}
              ></span>
            ))}
          </div>
        </div>
      )}
      <h2>{item.name}</h2>
      <p><strong>Price:</strong> {item.price}</p>
      <p><strong>Location:</strong> {item.address}</p>
      {item.size && <p><strong>Size:</strong> {item.size} sq.m.</p>}
      {item.description && <p><strong>Description:</strong> {item.description}</p>}
      <p><strong>Category:</strong> {item.category}</p>
      {item.subCategory && <p><strong>Subcategory:</strong> {item.subCategory}</p>}

      <button onClick={() => navigate(-1)} className={css.goBackButton}>Go Back</button>
    </div>
  );
};

export default ItemDetails;
