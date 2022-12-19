import Cookies from 'js-cookie'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetails: {},
    similarProductsList: [],
    productsAddedCount: 1,

    apiStatus: apiStatusConstants.initial,
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
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(id)

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)

    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      const formattedProductData = this.getFormattedDetails(fetchedData)
      const formattedSimilarProductsDataList = fetchedData.similar_products.map(
        eachProduct => this.getFormattedDetails(eachProduct),
      )
      this.setState({
        productDetails: formattedProductData,
        similarProductsList: formattedSimilarProductsDataList,
        apiStatus: apiStatusConstants.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onMinusClick = () => {
    const {productsAddedCount} = this.state
    if (productsAddedCount > 1) {
      this.setState({productsAddedCount: productsAddedCount - 1})
    }
  }

  onPlusClick = () => {
    const {productsAddedCount} = this.state

    this.setState({productsAddedCount: productsAddedCount + 1})
  }

  showProductsPage = () => {
    const {history} = this.props
    history.replace('/products')
  }

  displayLoadingView = () => (
    <div className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  displaySuccessView = () => {
    const {productDetails, similarProductsList, productsAddedCount} = this.state
    console.log(productDetails)
    const {
      availability,
      brand,
      description,

      imageUrl,
      price,
      rating,

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
              <p className="product-price">Rs {price}/-</p>
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
                <div className="question-answer-container">
                  <p className="question-parameter"> Available:</p>
                  <p className="answer-parameter"> {availability}</p>
                </div>
                <div className="question-answer-container">
                  <p className="question-parameter">Brand:</p>
                  <p className="answer-parameter"> {brand}</p>
                </div>

                <hr className="horizontal-line" />
                <div className="buttons-products-added-count-container">
                  <button
                    type="button"
                    className="products-count-manipulator-button"
                    onClick={this.onMinusClick}
                  >
                    <BsDashSquare className="plus-minus-icon" />
                  </button>
                  <p className="products-added-count">{productsAddedCount}</p>
                  <button
                    type="button"
                    className="products-count-manipulator-button"
                    onClick={this.onPlusClick}
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

  displayFailureView = () => (
    <div className="failure-view-container">
      <img
        className="failure-view-image"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1 className="product-not-found-text">Product Not Found</h1>
      <button
        onClick={this.showProductsPage}
        type="button"
        className="continue-shopping-button"
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.displaySuccessView()
      case apiStatusConstants.failure:
        return this.displayFailureView()
      case apiStatusConstants.inProgress:
        return this.displayLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
