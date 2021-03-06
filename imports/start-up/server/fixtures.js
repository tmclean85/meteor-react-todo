import { Meteor } from 'meteor/meteor';
import { ToDos } from '../../api/todos';
import { Accounts } from 'meteor/accounts-base';


Meteor.startup(() => {

  let user = {};

  if ( Meteor.users.find().count() === 0 ) {
    user = Accounts.createUser({
      email: 'maddox@mclean.com',
      password: 'password'
    });
  }

  if ( ToDos.find().count() === 0 ) {
    ToDos.insert({
      title: 'Learn React',
      complete: false,
      owner: user
    });
  }
});