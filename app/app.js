/* global $, FastClick */
import Ember from 'ember';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';
import routeUtil from './utils/route';


Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver: Resolver
});

routeUtil();

loadInitializers(App, config.modulePrefix);

$(function() {
  FastClick.attach(document.body);
});

export default App;
