import Cookies from 'js-cookie'
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsList: [],
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getFormattedDetails = productData => ({
    availability: productData.availability,
    brand: productData.brand,
    description: productData.description,
    id: productData.id,
    imageUrl: productData.image_url,
    price: productData.price,
    rating: productData.rating,
    style: productData.style,
    title: productData.title,
    totalReviews: productData.total_reviews,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const fetchedData = await response.json()

    const formattedProductData = this.getFormattedDetails(fetchedData)
    const formattedSimilarProductsDataList = fetchedData.similar_products.map(
      eachProduct => this.getFormattedDetails(eachProduct),
    )
    if (response.ok) {
      this.setState({
        productDetails: formattedProductData,
        similarProductsList: formattedSimilarProductsDataList,
      })
    }
  }

  render() {
    const {productDetails, similarProductsList} = this.state
    console.log(productDetails)
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
      <div>
        <Header />
        <div className="product-details-and-similar-products-container">
          <div className="product-image-details-container">
            <img src={imageUrl} alt="product" className="product-image" />
            <div className="product-details-container">
              <h1 className="product-name">{title}</h1>
              <h1 className="product-price">Rs {price}/-</h1>
              <div className="rating-container-reviews-count-container">
                <div className="product-details-rating-container">
                  <div className="product-rating-container">
                    <p className="product-rating">{rating}</p>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                      alt="star"
                      className="star-icon"
                    />
                  </div>
                  <p className="total-reviews-count">{totalReviews} Reviews</p>
                </div>
                <p className="product-description">{description}</p>
                <p className="question-parameter">
                  Available:
                  <span className="answer-parameter"> {availability}</span>
                </p>
                <p className="question-parameter">
                  Brand:
                  <span className="answer-parameter"> {brand}</span>
                </p>
                <hr className="horizontal-line" />
                <div className="buttons-products-added-count-container">
                  <button
                    type="button"
                    className="products-count-manipulator-button"
                  >
                    <BsDashSquare className="plus-minus-icon" />
                  </button>
                  <p className="products-added-count">1</p>
                  <button
                    type="button"
                    className="products-count-manipulator-button"
                  >
                    <BsPlusSquare className="plus-minus-icon" />
                  </button>
                </div>
                <button type="button" className="add-to-cart-button">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
          <h1 className="similar-products">Similar Products</h1>
          <ul className="similar-products-list-container">
            {similarProductsList.map(eachProduct => (
              <SimilarProductItem
                productDetails={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </div>
    )
  }
}

export default ProductItemDetails
