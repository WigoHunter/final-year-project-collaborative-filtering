import React from 'react';
import ReactDOM from 'react-dom';

import { Review } from './Review.js';

export class HolidayInn extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="head">
          <img src="http://r-ec.bstatic.com/images/hotel/840x460/137/13767830.jpg" alt="" />
          <div className="intro">
            <h2>Holiday Inn Express</h2>
            <h3>83 Jervois Street, Sheung Wan, Hong Kong 00000, China</h3>
            <h3>00 1 877-859-5095</h3>
            <h4>The data is collected from TripAdvisor</h4>
          </div>
        </div>
        <div className="review-wrap">
          <ul>
            <h2>
              Customer Reviews
              <span className="btn" onClick={this.props.handleClick}>User Account Detail</span>
            </h2>
            {this.props.reviews.map((review, i) => (
              <Review
                key={i}
                text={review.text}
                title={review.title}
                analysis={review.analysis}
                score={review.score}
                onClick={this.props.onClickReview}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export class ShangriLa extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="head">
          <img src="https://cdn.kiwicollection.com/media/property/PR002772/xl/002772-01-suite-living-area-city-water-view.jpg" alt="" />
          <div className="intro">
            <h2>Shangri-La Hong Kong</h2>
            <h3>64 Mody Road | Tsim Sha Tsui East, Kowloon, Hong Kong, China</h3>
            <h3>00 1 877-859-5095</h3>
            <h4>The data is collected from TripAdvisor</h4>
          </div>
        </div>
        <div className="review-wrap">
          <ul>
            <h2>
              Customer Reviews
              <span className="btn" onClick={this.props.handleClick}>Fake Account</span>
            </h2>
            {this.props.reviews.map((review, i) => (
              <Review
                key={i}
                text={review.text}
                title={review.title}
                analysis={review.analysis}
                score={review.score}
                onClick={this.props.onClickReview}
              />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
