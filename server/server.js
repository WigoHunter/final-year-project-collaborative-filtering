import { Meteor } from 'meteor/meteor';

Meteor.methods({
  'user.updatePref'(id, data) {

    const _this = Meteor.user().preference;

    Meteor.users.update(id, {
      $set: {
        preference: {
          hotel: _this.hotel + data.hotel,
          location: _this.location + data.location,
          clean: _this.clean + data.clean,
          breakfast: _this.breakfast + data.breakfast,
          room: _this.room + data.room,
          stay: _this.stay + data.stay,
          staff: _this.staff + data.staff,
          service: _this.service + data.service,
          comfortable: _this.comfortable + data.comfortable,
          station: _this.station + data.station,
        }
      }
    });
  },

  'user.updateLiked'(id, key) {
    console.log(key);
    let likedList = Meteor.users.findOne({ _id: id }).liked ? Meteor.users.findOne({ _id: id }).liked : [];
    likedList.push(key);

    console.log(likedList);

    Meteor.users.update(id, {
      $set: {
        liked: likedList,
      }
    });
  }
})
