
function loadData() {

    var $body          = $('body');
    var $wikiElem      = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem       = $('#nytimes-articles');
    var $greeting      = $('#greeting');
    var $street        = $('#street');
    var $city          = $('#city');

    $wikiElem.text("");
    $nytElem.text("");

    var apikey = '&key=AIzaSyCzu6WxG9fwKEjct2c-iG2amQgHuf_d2-I';
    var street = $street.val();
    var city = $city.val();
    var address = street + ', ' + city;
    $greeting.text('So you want to live at ' + address.toUpperCase() + '?');
    var src = 'http://maps.googleapis.com/maps/api/streetview?size=600x300&location=' + address + '';
    $body.append('<img class="bgimg" src= "' + src + '">');

    var nyTimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + city + '&sort=newest&api-key=' + apikey;
    $.getJSON(nyTimesUrl, function(data) {
      $nytHeaderElem.text('New York Times Articles About: ' + city.toUpperCase());

    articles = data.response.docs;
    for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      $nytElem.append('<li class="article">' + '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                      '<p>' + article.snippet + '</p>' + '</li>');
    }
  }).error(function(err) {
      $nytHeaderElem.text('New York Times Articles About ' + city.toUpperCase() + ' Could Not Be Loaded');

  });

  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + city + '&format=json&callback=wikiCallback';
  var wikiRequestTimeout = setTimeout(function() {
    $wikiElem.text('Failed to get Wikipedia resources! Try again later..')
  }, 8000);

  $.ajax({
    url: wikiUrl,
    dataType: 'jsonp',
    success: function(response) {
      var articleList = response[1];

      for (var i = 0; i < articleList.length; i++) {
        articleStr = articleList[i];
        var url = 'https://en.wikipedia.org/wiki/' + articleStr;
        $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
      };
      clearTimeout(wikiRequestTimeout);
    }
  });


  return false;
};

$('#form-container').submit(loadData);
