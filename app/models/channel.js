import DS from 'ember-data';

export default DS.Model.extend({
  title: DS.attr('string'),
  image_url: DS.attr('string'),
  description: DS.attr('string'),
  copyrigth: DS.attr('string')
});
