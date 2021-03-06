import Ember from 'ember';
import Base from 'simple-auth/authenticators/base';
import ENV from '../config/environment';

export default Base.extend({
  __authURLForProvider: function(provider){
    return ENV.API_URL + "/v2/auth/" + provider;
  },
  __getUserData: function() {
    return Ember.$.ajax({
      url: ENV.API_URL + "/v2/user",
      type: "GET",
      xhrFields: {
        withCredentials: true
      }
    });
  },
  __checkLogin: function(loginWindow, resolve, reject) {
    return () => {
      try {
        if (loginWindow.closed) {
          this.__checkCredentials(resolve, reject);
        } else {
          window.setTimeout(this.__checkLogin(loginWindow, resolve, reject), 500);
        }
      } catch(e) {
        Ember.run(function() { reject(e); });
      }
    };
  },
  __checkCredentials: function(resolve, reject) {
    this.__getUserData().then(function(data){
      Ember.run(function () { resolve(data); });
    }, function(xhr) {
      Ember.run(function (){ reject(xhr.responseJSON || xhr.responseText); });
    });
  },

  restore: function(properties) {
    var propertiesObject = Ember.Object.create(properties);
    return new Ember.RSVP.Promise(function(resolve, reject) {
      if (!Ember.isEmpty(propertiesObject.get('token'))) {
        resolve(properties);
      } else {
        reject();
      }
    });
  },
  authenticate: function(provider) {
    return new Ember.RSVP.Promise( (resolve, reject) => {
      var loginWindow = window.open(this.__authURLForProvider(provider), '_blank', 'location=no,toolbar=no');
      window.setTimeout(this.__checkLogin(loginWindow, resolve, reject), 500);

      loginWindow.addEventListener('loadstop', (event) => {
        if(event.url.indexOf(this.__authURLForProvider(provider) + "/callback") === 0) {
          loginWindow.close();
          this.__checkCredentials(resolve, reject);
        }
      });
    });
  },
  invalidate: function() {
    return new Ember.RSVP.Promise(function(resolve) {
      Ember.$.ajax({
        url: ENV.API_URL + "/v2/user/logout",
        type: "GET",
        xhrFields: {
          withCredentials: true
        }
      }).always(function(){
        document.cookie = "_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        resolve();
        window.location.reload();
      });
    });
  }
});
