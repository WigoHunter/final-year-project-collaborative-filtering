import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

export const Reviews = new Mongo.Collection('reviews');
export const AllReviews = new Mongo.Collection('allreviews');

if (Meteor.isServer) {
  Meteor.users.allow({
    update(userId, doc, fields, modifier) {
      return true;
    }
  });

  Meteor.publish('reviews', () => {
    return Reviews.find({});
  });

  Meteor.publish('allreviews', () => {
    return AllReviews.find({});
  });

  Meteor.publish('userData', () => {
    return Meteor.users.find({}, {fields: {
      'preference': 1,
      'liked': 1,
    }});
  });
}
