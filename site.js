//Dandelion API docs https://dandelion.eu/docs/api/
//Giphy API docs https://github.com/Giphy/GiphyAPI#giphy-sticker-api
//GIF API docs https://api.riffsy.com/#start

$.noConflict();
(function($) {
  $(document).ready(function() {
    var tkn, text, sentQuery, primaQuery;
    var addSentToDom, addToDom, getGIF;
    var GIFSearchQuery, GIFTranslateQuery;
    var GIFUrl;
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
        
      addSentToDom = function (t, s) {
        getGIF(t, function(url) { //This anonymous function handles URL
          if(s==='0'){
            $('#sent').append(
              '<li>'+
              ' <img src="'+url+'" />'+
              ' <p class="label">The text is '+t+'</p>'+
              '</li>'
            );
          }
          else {
            $('#sent').append(
              '<li>'+
              ' <img src="'+url+'" />'+
              ' <p class="label">The text is '+(Math.round(Math.abs(s*100)))+'% '+t+'</p>'+
              '</li>'
            );
          }
        });
      };

      addToDom = function (lbl) {
        getGIF(lbl, function(url) { //This anonymous function handles URL
          $('#primary').append(
            '<li>'+
            ' <img src="'+url+'" />'+
            ' <p class="label">'+lbl+'</p>'+
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

        $.ajax({
          type: 'GET',
          url: primaQuery,
          success: function(data) {
            $("#primary").empty(); //Empties out the #primary list
            responseLength = data.annotations.length; //Gets the length of the annotations
            if(responseLength > 0) {
              label; //Temp_location of labels
              labelsSeen = {}; //Labels seen
              for(i=0; i<responseLength; i++) {
                label = data.annotations[i].label; //Storing next available label
                if(!labelsSeen.hasOwnProperty(label)) { //Check if the label has already been seen
                  addToDom(label); //Add tags and GIFs to the DOM
                  labelsSeen[label] = 1; //Marks label as seen
                }
              }
            }
            else {
              addToDom('Sorry, nothing');
            }
            $('#loading').empty();
          }
        });
      }
      else {
        $("#sent").empty(); //Empties out the #sent list
        $("#primary").empty(); //Empties out the #primary list
        addToDom('Sorry, nothing');
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

