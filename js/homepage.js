
var POSTERS_PER_ROW = 20;
var RING_RADIUS = 200;

function setup_posters (row, ratio) {

  var perRow = Math.round(POSTERS_PER_ROW / (ratio || 1));
  var posterAngle = 360 / perRow;

  for (var i = 0; i < perRow; i ++) {

    var poster = document.createElement('div');
    poster.className = 'poster';

    var rad = RING_RADIUS / (ratio || 1);
    var transform = 'rotateY(' + (posterAngle * i) + 'deg) translateZ(' + rad + 'px)';

    poster.style.webkitTransform = transform;
    poster.style.msTransform = transform;
    poster.style.oTransform = transform;
    poster.style.MozTransform = transform;
    poster.style.transform = transform;

    var content = poster.appendChild(document.createElement('p'));
    //content.textContent = i;
    row.appendChild(poster);
  }
}

function initPosters () {
  setup_posters(document.getElementById('ring-0'), 1.5);
  setup_posters(document.getElementById('ring-1'), 1.1);
  setup_posters(document.getElementById('ring-2'), 1);
  setup_posters(document.getElementById('ring-3'), 1.1);
  setup_posters(document.getElementById('ring-4'), 1.5);
}

function lookupFollowers(handle, cb) {
    $.ajax({
        url: 'https://api.twitter.com/1/followers/ids.json?cursor=-1&screen_name='+handle,
        dataType: 'jsonp',
        success: function(data) {
            cb(data);
        },
        error: function(data) {
            cb(data);
        }
      });
}

function lookupUsers(ids, cb) {
    $.ajax({
        url: 'https://api.twitter.com/1/users/lookup.json?user_id='+ids+'&include_entities=true',
        dataType: 'jsonp',
        success: function(data) {
            cb(data);
        },
        error: function(data) {
            cb(data);
        }
    });
}

function lookupUser(handle, cb) {
    $.ajax({
        url: 'https://api.twitter.com/1/users/lookup.json?screen_name='+handle+'&include_entities=true',
        dataType: 'jsonp',
        success: function(data) {
            cb(data);
        },
        error: function(data) {
            cb(data);
        }
    });
}

function getFollowers(handle, cb, max) {
    lookupFollowers(handle, function(followers) {
          var idlist = followers.ids.slice(0, max || 100).join(',');
          lookupUsers(idlist, function(users) {
              cb(users);
          });
    });
}

$(function() {

  initPosters();

  getFollowers("comorichweb", function(users) {

      $(".poster").each(function(i) {

        var user = users[i];
        var fullname=$.trim(user.name);
        var namearray=fullname.split(' ');
        var grid_item_html = '<div class="avatar"><a href="http://twitter.com/'+user.screen_name+'" target="_blank"><img class="img" src="'+user.profile_image_url+'" alt=""><div class="name titlecase">'+namearray[0].toLowerCase()+'</div></a></div>';
        $(this).html(grid_item_html);

      });

  });

});
