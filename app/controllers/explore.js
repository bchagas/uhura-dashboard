import Ember from 'ember';
import isURL from '../utils/is-url';

export default Ember.Controller.extend({
  queryParams: ['q'],
  q: null,
  results: [],
  searching: false,
  ready: false,

  queryChanges: function () {
    if(!this.q || this.q === ""){
      this.set('results', []);
      return;
    }

    this.set('query', this.q);

    var results = this.lunr.search(this.q).map(function(c){ return c.ref; });

    this.store.filter('channel', function(channel) {
      return results.indexOf(channel.id) > -1;
    }).then((channels) => {
      this.set('results', channels.toArray());
    });
  }.observes('q', 'ready'),

  actions: {
    search: function () {
      if(isURL(this.query)) {
        this.transitionToRoute('search_by_url', {queryParams: {url: this.query}});
      } else {
        this.set('q', this.query);
      }
    }
  }
});
