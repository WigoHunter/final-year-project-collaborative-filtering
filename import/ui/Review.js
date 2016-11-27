import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { createContainer } from 'meteor/react-meteor-data';
import { Modal, UserPreferenceControl } from './Modal.js';
import { HolidayInn } from './Hotels.js';

import { Reviews, AllReviews } from '../api/reviews.js';

export const ignore = ["and", "the", "to", "back", "before", "after", "a", "an", "of", "for", "as", "i", "with", "it", "is", "on", "that", "this", "can", "in", "be", "has", "have", "if", "we", "are", "am", "is", "they", "he", "she", "there", "was", "you", "not", "many", "although", "though", "even", "very", "really", "would", "will", "cant", "can't", "won't", "wont", "-", "at", "under", "over", "but", "also", "via", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "good", "from", "great", "hong", "kong", "nice", "were", "had", "stayed", "here", "so", "excellent", "our", "well", "all", "my", "rooms"];

export class ReviewList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
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

    const totalDoc = Reviews.find({}).fetch().length + 100; //80 is the origin size of dataset

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
      for: location.pathname.split("/")[2],
      analysis,
      createdAt: new Date(),
    });

    //Clear form
    ReactDOM.findDOMNode(this.refs.review).value = '';
    ReactDOM.findDOMNode(this.refs.title).value = '';
  }

  handleClick() {
    this.setState({openModal: true});
  }

  handleClose() {
    this.setState({openModal: false});
  }

  clickHotal() {

  }

  clickRoom() {

  }

  clickClean() {

  }

  clickLocation() {
    Meteor.call('user.updateLocation', this.props.user._id, 2);
  }

  clickBreakfast() {

  }

  reset() {
    console.log(this.props.user);

    Meteor.users.update(Meteor.userId(), {
      $set: {
        preference: {
          hotel: 0,
          location: 0,
          clean: 0,
          breakfast: 0,
          room: 0,
          stay: 0,
          staff: 0,
          service: 0,
          comfortable: 0,
          station: 0,
        }
      }
    });
  }

  onClickReview(analysis) {
    console.log('hit');

    let locationScore = analysis.find((a) => (a.word === 'location')) ? analysis.find((a) => (a.word === 'location')).score : 0;
    let hotelScore = analysis.find((a) => (a.word === 'hotel')) ? analysis.find((a) => (a.word === 'hotel')).score : 0;
    let cleanScore = analysis.find((a) => (a.word === 'clean')) ? analysis.find((a) => (a.word === 'clean')).score : 0;
    let breakfastScore = analysis.find((a) => (a.word === 'breakfast')) ? analysis.find((a) => (a.word === 'breakfast')).score : 0;
    let roomScore = analysis.find((a) => (a.word === 'room')) ? analysis.find((a) => (a.word === 'room')).score : 0;
    let stayScore = analysis.find((a) => (a.word === 'stay')) ? analysis.find((a) => (a.word === 'stay')).score : 0;
    let staffScore = analysis.find((a) => (a.word === 'staff')) ? analysis.find((a) => (a.word === 'staff')).score : 0;
    let serviceScore = analysis.find((a) => (a.word === 'service')) ? analysis.find((a) => (a.word === 'service')).score : 0;
    let comfortableScore = analysis.find((a) => (a.word === 'comfortable')) ? analysis.find((a) => (a.word === 'comfortable')).score : 0;
    let stationScore = analysis.find((a) => (a.word === 'station')) ? analysis.find((a) => (a.word === 'station')).score : 0;
    // this.setState({
    //   hotel: this.state.hotel + hotelScore,
    //   location: this.state.location + locationScore,
    //   clean: this.state.clean + cleanScore,
    //   breakfast: this.state.breakfast + breakfastScore,
    //   room: this.state.room + roomScore,
    // });

    Meteor.users.update(Meteor.userId(), {
      $set: {
        preference: {
          hotel: this.props.user.preference.hotel + hotelScore,
          location: this.props.user.preference.location + locationScore,
          clean: this.props.user.preference.clean + cleanScore,
          breakfast: this.props.user.preference.breakfast + breakfastScore,
          room: this.props.user.preference.room + roomScore,
          stay: this.props.user.preference.stay + stayScore,
          staff: this.props.user.preference.staff + staffScore,
          service: this.props.user.preference.service + serviceScore,
          comfortable: this.props.user.preference.comfortable + comfortableScore,
          station: this.props.user.preference.station + stationScore,
        }
      }
    });
  }

  render() {
    let reviews = this.props.reviews.filter((a) => (a.for === location.pathname.split("/")[2]));

    for(let i = 0; i < reviews.length; i++){
      let location = reviews[i].analysis.find((a) => (a.word === 'location')) ? reviews[i].analysis.find((a) => (a.word === 'location')).score : 0;
      let hotel = reviews[i].analysis.find((a) => (a.word === 'hotel')) ? reviews[i].analysis.find((a) => (a.word === 'hotel')).score : 0;
      let clean = reviews[i].analysis.find((a) => (a.word === 'clean')) ? reviews[i].analysis.find((a) => (a.word === 'clean')).score : 0;
      let breakfast = reviews[i].analysis.find((a) => (a.word === 'breakfast')) ? reviews[i].analysis.find((a) => (a.word === 'breakfast')).score : 0;
      let room = reviews[i].analysis.find((a) => (a.word === 'room')) ? reviews[i].analysis.find((a) => (a.word === 'room')).score : 0;
      let stay = reviews[i].analysis.find((a) => (a.word === 'stay')) ? reviews[i].analysis.find((a) => (a.word === 'stay')).score : 0;
      let staff = reviews[i].analysis.find((a) => (a.word === 'staff')) ? reviews[i].analysis.find((a) => (a.word === 'staff')).score : 0;
      let service = reviews[i].analysis.find((a) => (a.word === 'service')) ? reviews[i].analysis.find((a) => (a.word === 'service')).score : 0;
      let comfortable = reviews[i].analysis.find((a) => (a.word === 'comfortable')) ? reviews[i].analysis.find((a) => (a.word === 'comfortable')).score : 0;
      let station = reviews[i].analysis.find((a) => (a.word === 'station')) ? reviews[i].analysis.find((a) => (a.word === 'station')).score : 0;
      reviews[i].score = this.props.user.preference.location * location + this.props.user.preference.hotel * hotel
        + this.props.user.preference.clean * clean + this.props.user.preference.breakfast * breakfast + this.props.user.preference.room * room
        + this.props.user.preference.stay * stay + this.props.user.preference.staff * staff + this.props.user.preference.service * service
        + this.props.user.preference.comfortable * comfortable + this.props.user.preference.station * station;
    }
    reviews.sort((a, b) => ( b.score - a.score ));

    return (
      <div className="reviews-container">

        {React.cloneElement(this.props.children, {
          reviews: reviews,
          handleClick: this.handleClick.bind(this),
          onClickReview: this.onClickReview.bind(this),
        })}

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

        <UserPreferenceControl
          openModal={this.state.openModal}
          handleClose={this.handleClose.bind(this)}
          hotel={this.props.user ? this.props.user.preference ? this.props.user.preference.hotel : 0 : 0}
          location={this.props.user ? this.props.user.preference ? this.props.user.preference.location : 0 : 0}
          room={this.props.user ? this.props.user.preference ? this.props.user.preference.room : 0 : 0}
          breakfast={this.props.user ? this.props.user.preference ? this.props.user.preference.breakfast : 0 : 0}
          clean={this.props.user ? this.props.user.preference ? this.props.user.preference.clean : 0 : 0}
          stay={this.props.user ? this.props.user.preference ? this.props.user.preference.stay : 0 : 0}
          staff={this.props.user ? this.props.user.preference ? this.props.user.preference.staff : 0 : 0}
          service={this.props.user ? this.props.user.preference ? this.props.user.preference.service : 0 : 0}
          comfortable={this.props.user ? this.props.user.preference ? this.props.user.preference.comfortable : 0 : 0}
          station={this.props.user ? this.props.user.preference ? this.props.user.preference.station : 0 : 0}
          clickHotal={this.clickHotal.bind(this)}
          clickLocation={this.clickLocation.bind(this)}
          clickRoom={this.clickRoom.bind(this)}
          clickBreakfast={this.clickBreakfast.bind(this)}
          clickClean={this.clickClean.bind(this)}
          reset={this.reset.bind(this)}
        />
      </div>
    );
  }
}

ReviewList.propTypes = {
  reviews: React.PropTypes.array.isRequired,
};

export const ReviewListContainer = createContainer(() => {
  Meteor.subscribe('userData');
  Meteor.subscribe('reviews');
  Meteor.subscribe('allreviews');

  let user = Meteor.users.findOne({ _id: Meteor.userId() });
  let others = Meteor.users.find().fetch().filter((a) => (a._id != Meteor.userId()));

  let similarities = [];

  if(others && user) {
    for(let i = 0; i < others.length; i++) {
      let current = others[i];
      let sumOfShared = 0, sumOfUser = 0, sumOfOther = 0;
      for(let j in user.preference) {
        if((user.preference[j] * current.preference[j]) != 0) {
          sumOfShared += user.preference[j] * current.preference[j];
        }
        sumOfUser += user.preference[j] * user.preference[j];
        sumOfOther += current.preference[j] * current.preference[j];
      }

      if(sumOfUser == 0) {
        similarities.push({
          target: current._id,
          cos: 0,
        });
      } else {
        similarities.push({
          target: current._id,
          cos: sumOfShared / (Math.sqrt(sumOfUser) * Math.sqrt(sumOfOther)),
        });
      }
    }
  }

  console.log(similarities);

  if(user) {
    for (let i in user.preference) {
      if(user.preference[i] == 0){
        let prediction = 0;
        let totalCos = 0;

        for(let j = 0; j < others.length; j++) {
          let sim = similarities.find((a) => (a.target === others[j]._id)).cos;
          prediction += sim * others[j].preference[i];
          if(others[j].preference[i] != 0)  totalCos += sim;
        }
        if( totalCos != 0)
          user.preference[i] = prediction / totalCos;
      }
    }
  }

  return {
    reviews: Reviews.find({}).fetch(),
    all: AllReviews.find({}).fetch(),
    user: user,
  }
}, ReviewList);

export const Review = ({ text, title, analysis, score, onClick }) => (
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
