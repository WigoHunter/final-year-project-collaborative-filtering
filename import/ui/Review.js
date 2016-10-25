import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Modal } from './Modal.js';

import { Reviews, AllReviews } from '../api/reviews.js';

export const ignore = ["and", "the", "to", "back", "before", "after", "a", "an", "of", "for", "as", "i", "with", "it", "is", "on", "that", "this", "can", "in", "be", "has", "have", "if", "we", "are", "am", "is", "they", "he", "she", "there", "was", "you", "not", "many", "although", "though", "even", "very", "really", "would", "will", "cant", "can't", "won't", "wont", "-", "at", "under", "over", "but", "also", "via", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export class ReviewList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
      hotel: 0,
      location: 0,
      room: 0,
      breakfast: 0,
      clean: 0,
      refresh: false,
    }
  }

  handleSubmit(event) {
    //prevent actual default submission
    event.preventDefault();

    //Find the input
    const text = ReactDOM.findDOMNode(this.refs.review).value;
    const title = ReactDOM.findDOMNode(this.refs.title).value;

    const used = text + " " + title + " " + title;

    //Get all words used
    const words = used.toLowerCase().trim().replace(/[,;.!?():-^&$#*+=@><_]/g, '').split(/[\s\/]+/g).sort();
    //console.log(words);

    let analysis = [];
    let wc = 0;

    for(let i = 0; i < words.length; i++) {
      //ignore the words for ignorance
      while(ignore.indexOf(words[i]) != -1 && i < words.length) {
        i++;
      }

      //count word frequency
      let count = 1;
      while(words[i+1] === words[i] && i < words.length) {
        count++;
        i++;
      }

      //push to analysis
      if(words[i]) {
        analysis.push({
          word: words[i],
          count,
          score: 0,
        });
      }

      //calc word count
      wc += count;

      //reset count
      count = 1;
    }

    for(let i = 0; i < analysis.length; i++) {
      let review = AllReviews.findOne({word: analysis[i].word});
      if(review) {
        let c = review.count + 1;
        AllReviews.update(review._id, {
          $set: {count: c}
        });
      } else {
        AllReviews.insert({
          word: analysis[i].word,
          count: 1,
        });
      }
    }

    const totalDoc = Reviews.find({}).fetch().length + 70; //70 is the origin size of dataset

    //score formula: word frequency * log (total documents / documents with the word)
    for(let i = 0; i < analysis.length; i++) {
      let doc = AllReviews.findOne({word: analysis[i].word}).count;
      analysis[i].score = (analysis[i].count / wc) * Math.log(totalDoc / doc);
    }

    analysis.sort((a, b) => ( b.score - a.score ));

    //Push Review to DB
    Reviews.insert({
      title,
      text,
      analysis,
      createdAt: new Date(),
    });

    //Clear form
    ReactDOM.findDOMNode(this.refs.review).value = '';
    ReactDOM.findDOMNode(this.refs.title).value = '';
  }

  showKeywords(analysis) {
    console.log(analysis[0]);
    console.log(analysis[1]);
    console.log(analysis[2]);
  }

  handleClick() {
    this.setState({openModal: true});
  }

  handleClose() {
    this.setState({openModal: false});
  }

  clickHotal() {
    if(this.state.hotel < 2){
      this.setState({hotel: this.state.hotel + 1});
    }
  }

  clickRoom() {
    if(this.state.room < 2){
      this.setState({room: this.state.room + 1});
    }
  }

  clickClean() {
    if(this.state.clean < 2){
      this.setState({clean: this.state.clean + 1});
    }
  }

  clickLocation() {
    if(this.state.location < 2){
      this.setState({location: this.state.location + 1});
    }
  }

  clickBreakfast() {
    if(this.state.breakfast < 2){
      this.setState({breakfast: this.state.breakfast + 1});
    }
  }

  reset() {
    this.setState({
      hotel: 0,
      location: 0,
      room: 0,
      breakfast: 0,
      clean: 0,
    });
  }

  onClickReview(analysis) {
    console.log('hit');

    let locationScore = analysis.find((a) => (a.word === 'location')) ? analysis.find((a) => (a.word === 'location')).score : 0;
    let hotelScore = analysis.find((a) => (a.word === 'hotel')) ? analysis.find((a) => (a.word === 'hotel')).score : 0;
    let cleanScore = analysis.find((a) => (a.word === 'clean')) ? analysis.find((a) => (a.word === 'clean')).score : 0;
    let breakfastScore = analysis.find((a) => (a.word === 'breakfast')) ? analysis.find((a) => (a.word === 'breakfast')).score : 0;
    let roomScore = analysis.find((a) => (a.word === 'room')) ? analysis.find((a) => (a.word === 'room')).score : 0;

    this.setState({
      hotel: this.state.hotel + hotelScore,
      location: this.state.location + locationScore,
      clean: this.state.clean + cleanScore,
      breakfast: this.state.breakfast + breakfastScore,
      room: this.state.room + roomScore,
    });
  }

  render() {
    let reviews = this.props.reviews;
    for(let i = 0; i < reviews.length; i++){
      let location = reviews[i].analysis.find((a) => (a.word === 'location')) ? reviews[i].analysis.find((a) => (a.word === 'location')).score : 0;
      let hotel = reviews[i].analysis.find((a) => (a.word === 'hotel')) ? reviews[i].analysis.find((a) => (a.word === 'hotel')).score : 0;
      let clean = reviews[i].analysis.find((a) => (a.word === 'clean')) ? reviews[i].analysis.find((a) => (a.word === 'clean')).score : 0;
      let breakfast = reviews[i].analysis.find((a) => (a.word === 'breakfast')) ? reviews[i].analysis.find((a) => (a.word === 'breakfast')).score : 0;
      let room = reviews[i].analysis.find((a) => (a.word === 'room')) ? reviews[i].analysis.find((a) => (a.word === 'room')).score : 0;
      reviews[i].score = this.state.location * location + this.state.hotel * hotel
        + this.state.clean * clean + this.state.breakfast * breakfast + this.state.room * room;
    }
    reviews.sort((a, b) => ( b.score - a.score ));

    return (
      <div className="reviews-container">
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
              <span className="btn" onClick={this.handleClick.bind(this)}>Fake Account</span>
            </h2>
            {reviews.map((review) => (
              <Review
                text={review.text}
                title={review.title}
                analysis={review.analysis}
                score={review.score}
                onClick={this.onClickReview.bind(this)}
              />
            ))}
          </ul>
        </div>

        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="line"></div>
          <h4>Please leave your comment</h4>
          <input
            type="text"
            ref="title"
            placeholder="Title"
          />
          <textarea
            ref="review"
            placeholder="Anything specific?"
          />
          <input type="submit" />
        </form>

        <Modal open={this.state.openModal}>
          <span className="close" onClick={this.handleClose.bind(this)}>＋</span>
          <h2>User Behavior</h2>
          <div>
            <div
              className="pref"
              style={{opacity: 0.4 + this.state.hotel * 0.3}}
              onClick={this.clickHotal.bind(this)}
            >
              <p>Hotel</p>
              {this.state.hotel}
            </div>
            <div
              className="pref"
              style={{opacity: 0.4 + this.state.location * 0.3}}
              onClick={this.clickLocation.bind(this)}
            >
              <p>Location</p>
              {this.state.location}
            </div>
            <div
              className="pref"
              style={{opacity: 0.4 + this.state.room * 0.3}}
              onClick={this.clickRoom.bind(this)}
            >
              <p>Room</p>
              {this.state.room}
            </div>
            <div
              className="pref"
              style={{opacity: 0.4 + this.state.breakfast * 0.3}}
              onClick={this.clickBreakfast.bind(this)}
            >
              <p>Breakfast</p>
              {this.state.breakfast}
            </div>
            <div
              className="pref"
              style={{opacity: 0.4 + this.state.clean * 0.3}}
              onClick={this.clickClean.bind(this)}
            >
              <p>Clean</p>
              {this.state.clean}
            </div>
          </div>
          <div className="calc" onClick={this.reset.bind(this)}>
            Reset
          </div>
          <p className="desc">
            This data is supposed to be extracted from browsing histories of users, but for simplicity in this sample site, I decided to ask for input from users directly
          </p>
        </Modal>
      </div>
    );
  }
}

ReviewList.propTypes = {
  reviews: React.PropTypes.array.isRequired,
};

export const ReviewListContainer = createContainer(() => {
  return {
    reviews: Reviews.find({}).fetch(),
    all: AllReviews.find({}).fetch(),
  }
}, ReviewList);

const Review = ({ text, title, analysis, score, onClick }) => (
  <li>
    <h4 onClick={() => onClick(analysis)}>{title}</h4>
    <div className="line"></div>
    <p>{text}</p>
    <h5>
      Keywords: {analysis[0].word}, {analysis[1].word}, {analysis[2].word}, {analysis[3].word}, {analysis[4].word}
      <div>
        Score: {score}
      </div>
    </h5>
  </li>
);
