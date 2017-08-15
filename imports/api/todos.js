import { Mongo } from 'meteor/mongo';

//Create todos publication that can be subscribed to client-side
if (Meteor.isServer) {
  Meteor.publish('todos', function todosPublication() {
    return ToDos.find({ owner: this.userId })
  });
}

//Allow client to run methods on this collection only
Meteor.methods({
  'todos.toggleComplete' (item) {
    if (item.owner !== this.userId) {
      throw new Meteor.Error('todos.toggleComplete.not-authorized',
        "You may not update todos that don't belong to you!"
      )
    }
    ToDos.update(item._id, {
      $set: { complete: !item.complete}
    });
  },

  'todos.removeToDo' (item) {
    if (item.owner !== this.userId) {
      throw new Meteor.Error('todos.removeToDo.not-authorized',
        "You may not remove todos that don't belong to you!"
      )
    }
    ToDos.remove(item._id)
  },

  'todos.addToDo' (data) {
    if (!this.userId) {
      throw new Meteor.Error('todos.addToDo.not-authorized',
        "Please sign in to add todos!"
      )
    }
    ToDos.insert({
      owner: this.userId,
      title: data,
      complete: false      
    });
  },

  'todos.removeCompleted' () {
    if(!this.userId) {
      throw new Meteor.Error('todos.removeComplete.not-authorized',
      "You may not remove other users' todos!"
      )
    }
    ToDos.remove({complete: true, owner: this.userId});
  }

});

export const ToDos = new Mongo.Collection('todos');