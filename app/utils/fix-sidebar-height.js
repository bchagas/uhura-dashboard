/* global $ */
export default function fixSidebarHeight() {
  'use strict';
  $('body').css('min-height', window.innerHeight + 'px');
  $('#profile').css('min-height', window.innerHeight + 'px');
}
