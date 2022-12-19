import {Link} from 'react-router-dom'
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {
    availability,
    brand,
    description,
    id,
    imageUrl,
    price,
    rating,
    style,
    title,
    totalReviews,
  } = productDetails
  return (
    <li className="similar-product-item">
      <Link to={`/products/${id}`} className="similar-product-card-link">
        <img
          src={imageUrl}
          alt="product"
          className="similar-product-thumbnail"
        />
        <h1 className="similar-product-title">{title}</h1>
        <p className="similar-product-brand">by {brand}</p>
        <div className="similar-product-details">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="similar-product-rating-container">
            <p className="similar-product-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="similar-product-star"
            />
          </div>
        </div>
      </Link>
    </li>
  )
}

export default SimilarProductItem
