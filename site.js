//Dandelion API docs https://dandelion.eu/docs/api/
//Giphy API docs https://github.com/Giphy/GiphyAPI#giphy-sticker-api
//GIF API docs https://api.riffsy.com/#start

$.noConflict();
(function($) {
  $(document).ready(function() {
    $('#uc-form').on('submit', function(e) {
      $('#loading').empty();
      $('#loading').append('Loading...');
      var tkn = '68b2621e05c8479086e984a98ea8e716'; //This is the Dandelion token
      var text = ($('#uc-text').val()).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");//Gets text & deletes punctuation
      text = text.replace(/ /g, "%20");//Replaces spaces with %20
      var sentQuery = 'https://api.dandelion.eu/datatxt/sent/v1/?text='+text+'&token='+tkn+'&lang=en';
      var primaQuery = 'https://api.dandelion.eu/datatxt/nex/v1/?text='+text+'&token='+tkn+'&lang=en';
        
      var add_sent_to_DOM = function (t, s) {
        get_GIF(t, function(url) { //This anonymous function handles URL
          if(s==0){
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
              ' <p class="label">The text is '+(Math.abs(s*100))+'% '+t+'</p>'+
              '</li>'
            );
          }
        });
      };

      var add_to_DOM = function (lbl) {
        get_GIF(lbl, function(url) { //This anonymous function handles URL
          $('#primary').append(
            '<li>'+
            ' <img src="'+url+'" />'+
            ' <p class="label">'+lbl+'</p>'+
            '</li>'
          );
        });
      };

      var get_GIF = function(lbl, get_GIF_url) {
        lbl = lbl.replace(/ /g, "+"); //Replaces spaces with +
        var gif_query = 'https://api.giphy.com/v1/gifs/translate?s='+lbl+'&api_key=dc6zaTOxFJmzC';
        $.ajax({
          type: 'GET',
          url: gif_query,
          success: function(data) {
            var GIF_url = data.data.images.original.url; //Get the URL of the GIF
            get_GIF_url(GIF_url); //Handle the URL
          }
        });
      }

      if(text.length > 0) { //Only if there is some text, do get requests
        $.ajax({
          type: 'GET',
          url: sentQuery,
          success: function(data) {
            $("#sent").empty(); //Empties out the #sent list
            var type = data.sentiment.type;
            var score = data.sentiment.score;
            add_sent_to_DOM(type, score);
          }
        });

        $.ajax({
          type: 'GET',
          url: primaQuery,
          success: function(data) {
            $("#primary").empty(); //Empties out the #primary list
              var res_length = data.annotations.length; //Gets the length of the annotations
              if(res_length > 0) {
                var label; //Temp_location of labels
                var u = {}; //Labels seen
                for(var i=0;i<res_length;i++) {
                  label = data.annotations[i].label; //Storing next available label
                  if(!u.hasOwnProperty(label)) { //Check if the label has already been seen
                    add_to_DOM(label); //Add tags and GIFs to the DOM
                    u[label] = 1; //Marks label as seen
                  }
                }
              }
              else {
                add_to_DOM('Sorry, nothing');
              }
              $('#loading').empty();
            }
        });
      }
      else {
        add_to_DOM('Sorry, nothing');
        $('#loading').empty();
        e.preventDefault();
      }

      e.preventDefault();
    });
      
    $(document).keypress(function(e) {
      if(e.which == 13) {
        $('#uc-form').submit();
      }
    });
      
  });
})(jQuery);

