google.maps.event.addDomListener(window, 'load', initialize);

var geocoder;
var map;

function initialize() {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(41.9483, -87.6556);
  var mapOptions = {
    zoom: 14,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  infowindow = new google.maps.InfoWindow({ maxWidth: 320 }); 
}

function codeAddress() {
  var address = document.getElementById('zip').value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}

function setMarker(lat, lon, html) {
  var latLng = new google.maps.LatLng(lat, lon);
  var marker = new google.maps.Marker({
    position: latLng,
    map: map,
    data: html
  });
  
  google.maps.event.addListener(marker, 'click', function() { 
    map.setCenter(new google.maps.LatLng(marker.position.lat(), marker.position.lng())); 
    map.setZoom(16); 
    onItemClick(event, marker); 
  }); 
}

function onItemClick(event, pin) { 
  // Create content
  var contentString = pin.data
  // Replace our Info Window's content and position 
  infowindow.setContent(contentString); 
  infowindow.setPosition(pin.position); 
  infowindow.open(map) 
} 

$(document).ready(function() {
  $('#term_form').on('submit', function(event){
    event.preventDefault();
    var ct = $('#bro_tweets li').size();
    var term = $('#term').val();
    $('#bro_tweets').append('<li id=list_'+(ct+1)+'>'+term+'</li>');
    var term = $('#term').val('');
  });

	$('#srch_map').on('submit', function(event) {
		event.preventDefault();
		codeAddress();
	});

  $('#zip_srch').on('click', function(event) {
    event.preventDefault();
    codeAddress();
  });

  $('#find_tweets').on('click', function(event) {
    var brolist = {}
    for(var i=1;i <= $('#bro_tweets li').size();i++)
    {
      brolist[i] = $('#list_'+i).text();
    }
    var clat = map.getCenter().lat();
    var clon = map.getCenter().lng();
    var coords = {lat: clat, lon: clon};
    var findData = {};
    findData['bros'] = brolist;
    findData['coord'] = coords;
    event.preventDefault();
    $.ajax({
      url: '/',
      method: 'POST',
      beforeSend: function() {
        $('#srch_status').removeClass('hidden');
        $('#srch_status').text('Snatching Them Tweets...');
      },
      data: {list: brolist, latlon: coords}
    }).done(function (){
      $('#srch_status').text('Found Them Tweets!');
    });

    $.ajax({
      url: '/markers',
      method: 'GET',
      dataType: 'json'
    }).done (function(tweets) {
        var tweet_set = tweets.tweet;
        $.each(tweet_set, function(k, v) {
          setMarker(v.lat, v.lon, v.html);
        });
      });
  });
});

