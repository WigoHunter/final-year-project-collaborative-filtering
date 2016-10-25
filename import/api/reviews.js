import { Mongo } from 'meteor/mongo';

export const Reviews = new Mongo.Collection('reviews');
export const AllReviews = new Mongo.Collection('allreviews');
