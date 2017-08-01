import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Meteor } from 'meteor/meteor';

import React from 'react';
import ReactDOM from 'react-dom';
import './main.css';
import App from '../imports/ui/containers/App';
// import registerServiceWorker from './registerServiceWorker';

import './main.html';

Meteor.startup(() => {
  ReactDOM.render(<App />, document.getElementById('root'));
});

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
