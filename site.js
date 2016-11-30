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
      
      getSent = function() { //Gets the sentiment of text
        $.ajax({
          type: 'GET',
          url: sentQuery,
          success: function(data) {
            $("#sent").empty(); //Empties out the #sent list
            type = data.sentiment.type;
            score = data.sentiment.score;
            addSentToDom(type, score);
          }
        });
      }
      
      getCat = function() {
        $.ajax({
          type: 'GET',
          url: primaQuery,
          success: function(data) {
            $("#primary").empty(); //Empties out the #primary list
            responseLength = data.annotations.length; //Gets the length of the annotations
            if(responseLength > 0) {
              labelsSeen = {}; //Labels seen
              for(i=0; i<responseLength; i++) {
                label = data.annotations[i].label; //Storing next available label
                if(!labelsSeen.hasOwnProperty(label)) { //Check if the label has already been seen
                  addCatToDom(label); //Add tags and GIFs to the DOM
                  labelsSeen[label] = 1; //Marks label as seen
                }
              }
            }
            else {
              addCatToDom('Sorry, nothing');
            }
            $('#loading').empty();
          }
        });
      }
        
      addSentToDom = function (t, s) {
        getGIF(t, function(url) { //This anonymous function handles URL
          if(s !== 0){
            t = (Math.round(Math.abs(s*100))) + '% '+ t;
          }
          $('#sent').append(
            '<li>'+
            ' <figure>'+
            '  <img src="'+url+'" alt="The text is '+t+'" />'+
            '   <figcaption>'+
            '    <p class="label"> The text is '+t+'</p>'+
            '   </figcaption>'+
            '</figure>'+
            '</li>'
          );
        });
      };

      addCatToDom = function (lbl) {
        getGIF(lbl, function(url) { //This anonymous function handles URL
          $('#primary').append(
            '<li>'+
            ' <figure>'+
            '  <img src="'+url+'" alt="GIF of '+lbl+'" />'+
            '   <figcaption>'+
            '    <p class="label">'+lbl+'</p>'+
            '   </figcaption>'+
            '</figure>'+
            '</li>'
          );
        });
      };

      getGIF = function(lbl, getGIFURL) {
        lbl = lbl.replace(/ /g, "+"); //Replaces spaces with +
        GIFSearchQuery='https://api.giphy.com/v1/gifs/search?q='+lbl+'&api_key=dc6zaTOxFJmzC';
        GIFTranslateQuery = 'https://api.giphy.com/v1/gifs/translate?s='+lbl+'&api_key=dc6zaTOxFJmzC';
        $.ajax({
          type: 'GET',
          url: GIFSearchQuery, //Using search query first
          success: function(data) {
            var numGIFs = data.pagination.count;
            if(numGIFs > 0) {
              GIFUrl = data.data[Math.round(Math.random()*(numGIFs))].images.original.url; //Get the URL of the GIF
              getGIFURL(GIFUrl); //Handle the URL
            }
            else {
              $.ajax({
                type: 'GET',
                url: GIFTranslateQuery, //Using translate query as backup
                success: function(data) {
                  var GIFUrl = data.data.images.original.url; //Get the URL of the GIF
                  getGIFURL(GIFUrl); //Handle the URL
                }
              });
            }
          }
        });
      };

      if(text.length > 0) { //Only if there is some text, do get requests
        getSent();
        getCat();
      }
      else {
        $("#sent").empty(); //Empties out the #sent list
        $("#primary").empty(); //Empties out the #primary list
        addCatToDom('Sorry, nothing');
        $('#loading').empty();
        e.preventDefault();
      }

      e.preventDefault();
    });
      
    $(document).keypress(function(e) {
      if(e.which === 13) {
        $('#uc-form').submit();
      }
    });
      
  });
})(jQuery);

