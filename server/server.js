import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'user.updateLocation'(id, data) {
    console.log(Meteor.users.findOne({ _id: id }));
  }
})
