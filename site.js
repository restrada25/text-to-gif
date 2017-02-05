//Dandelion API docs https://dandelion.eu/docs/api/
//Giphy API docs https://github.com/Giphy/GiphyAPI#giphy-sticker-api

$.noConflict();
(function($) {
  $(document).ready(function() {
    var getSent, getCat, addSentToDom, addCatToDom, getGIF;
    var tkn, text, sentQuery, primaQuery;
    var GIFSearchQuery, GIFTranslateQuery, GIFUrl;
    var type, score;
    var responseLength;
    var label, labelsSeen, i;
    
    $('#uc-form').on('submit', function(e) {
      $('#loading').empty();
      $('#loading').append('Loading...');
      tkn = '68b2621e05c8479086e984a98ea8e716'; //This is the Dandelion token
      text = ($('#uc-text').val()).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");//Gets text & deletes punctuation
      sentQuery = 'https://api.dandelion.eu/datatxt/sent/v1/?text='+text+'&token='+tkn+'&lang=en';
      primaQuery = 'https://api.dandelion.eu/datatxt/nex/v1/?text='+text+'&token='+tkn+'&lang=en';
      text = text.replace(/ /g, "%20");//Replaces spaces with %20
      
      var getSent = function() { //Gets the sentiment of text
        $.when($.ajax({
          type: 'GET',
          url: sentQuery
        })).then(handleSent, failure);
      };
      
      var handleSent = function(data) {
        $('#sent').empty(); //Empties out the #sent list
        type = data.sentiment.type; //Get either positive, negative of neutral
        score = data.sentiment.score; //Get score of sentiment
        addSentToDom(type, score); //Add the sentiment and the GIF to DOM
      };
      
      var getCat = function() { //Gets categories/entities from text
        $.when($.ajax({
          type: 'GET',
          url: primaQuery
        })).then(handleCat, failure);
      };
      
      var handleCat = function(data){
        $('#primary').empty(); //Empties out the #primary list
        responseLength = data.annotations.length; //Gets the length of the annotations
        if(responseLength > 0) {
          labelsSeen = {}; //Labels seen
          for(i=0; i<responseLength; i++) {
            label = data.annotations[i].label; //Storing next available label
            if(!labelsSeen.hasOwnProperty(label)) { //Check if the label has already been seen
              addCatToDom(label); //Add categories/labels and GIFs to the DOM
              labelsSeen[label] = 1; //Marks label as seen
            }
          }
        }
        else {
          addCatToDom('Sorry, nothing'); //Tell user nothing was found
        }
        $('#loading').empty(); //Empty the loading text
      };
        
      var addSentToDom = function (type, score) { //Add the GIF img and sentiment
        getGIF(type, function(url) { //This anonymous function handles URL
          if(score !== 0) {
            type = (Math.round(Math.abs(score*100))) + '% '+ type;
          }
          $('#sent').append(
            '<li>'+
            ' <figure>'+
            '  <img src="'+url+'" alt="The text is '+type+'" />'+
            '   <figcaption>'+
            '    <p class="label"> The text is '+type+'</p>'+
            '   </figcaption>'+
            '</figure>'+
            '</li>'
          );
        });
      };

      var addCatToDom = function (label) { //Adds the categories/entities and GIF to DOM
        getGIF(label, function(url) { //This anonymous function handles URL
          $('#primary').append(
            '<li>'+
            ' <figure>'+
            '  <img src="'+url+'" alt="GIF of '+label+'" />'+
            '   <figcaption>'+
            '    <p class="label">'+label+'</p>'+
            '   </figcaption>'+
            '</figure>'+
            '</li>'
          );
        });
      };

      var getGIF = function(label, getGIFURL) { //Searches Giphy for a GIF
        label = label.replace(/ /g, "+"); //Replaces spaces with +
        GIFSearchQuery='https://api.giphy.com/v1/gifs/search?q='+label+'&api_key=dc6zaTOxFJmzC';
        $.when($.ajax({
          type: 'GET',
          url: GIFSearchQuery //Using search query first
        })).then(function (data) { handleGIF (data, label, getGIFURL)}, failure);
      };

      var handleGIF = function(data, label, getGIFURL) {
        var numGIFs = data.pagination.count; //Get amount of GIFs returned
        if(numGIFs > 0) {
          GIFUrl = data.data[Math.round(Math.random()*(numGIFs))].images.original.url; //Get the URL of the GIF
          getGIFURL(GIFUrl); //Handle the URL
        }
        else {
          getTransGIF(label, getGIFURL);
        }
      };

      var getTransGIF = function (label, getGIFURL) {
        GIFTranslateQuery = 'https://api.giphy.com/v1/gifs/translate?s='+label+'&api_key=dc6zaTOxFJmzC';
        $when($.ajax({
          type: 'GET',
          url: GIFTranslateQuery //Using translate query as backup
        })).then(function (data) { handleTransGIF (data, label, getGIFURL)}, failure);
      };

      var handleTransGIF = function (data, lbl, getGIFURL) {
        var GIFUrl = data.data.images.original.url; //Get the URL of the GIF
        getGIFURL(GIFUrl); //Handle the URL
      };

      var failure = function() {
        alert('Something went wrong');
      };

      if(text.length > 0) { //Only if there is some text, do get requests
        getSent();
        getCat();
      }
      else {
        $("#sent").empty(); //Empties out the #sent list
        $("#primary").empty(); //Empties out the #primary list
        addCatToDom('Sorry, nothing'); //Tells user nothing was found
        $('#loading').empty(); //Empties loading text
        e.preventDefault();
      }

      e.preventDefault();
    });

    $('.b-top').on('click', function(e) {
      e.preventDefault();
      $('body,html').animate({scrollTop: 0},500);
    });

    $(window).scroll(function () {
      $top = $('.b-top');
      var offset = 300; //300 pixels
      ($(this).scrollTop() > offset ? $top.addClass('visible') : $top.removeClass('visible'));
    });
      
    $(document).keypress(function(e) { //If user presses Enter key, submit form
      if(e.which === 13) {
        $('#uc-form').submit();
      }
    });
  });
})(jQuery);
