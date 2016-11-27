import { Meteor } from 'meteor/meteor';
import React from 'react';

import { Accounts } from 'meteor/accounts-base';

Meteor.startup(() => {
  Accounts.onCreateUser((options, user) => {
    user.preference = {
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
    };

    return user;
  });
});
