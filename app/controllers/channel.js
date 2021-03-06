/* global $ */
import Ember from 'ember';
import uniqueBy from '../utils/unique-by';

export default Ember.Controller.extend({
  removeListened: true,

  filterEpisodes: function(filter) {
    var episodes = uniqueBy('id', this.get('model.episodes').toArray()).sortBy('published_at').reverse();
    return episodes.filter(filter);
  },

  episodesFiltered: function(){
    var removeListened = this.get('removeListened');
    return this.filterEpisodes( (episode) => {
      return !(removeListened && episode.get('listened'));
    });
  }.property('model.episodes.@each.listened', 'removeListened'),

  allListenedButton: function () {
    return this.get('session.isAuthenticated') && this.filterEpisodes( (episode) => {
      return !episode.get('listened');
    }).length > 0;
  }.property('model.episodes.@each.listened'),

  removeListenedButton: function () {
    return this.get('session.isAuthenticated');
  }.property('session.isAuthenticated'),

  actions: {
    markAllAsListened: function () {
      var i, episodes = this.get('episodesFiltered');
      for(i = 0; i < episodes.length; i++) {
        $(".listened[data-id='" + episodes[i].id + "'][data-listened=false]").trigger('click');
      }
    }
  }
});
