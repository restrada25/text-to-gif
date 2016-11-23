$.noConflict();
(function($) {
  $(document).ready(function() {
     $('#uc-form').on('submit', function(e) {
      var tkn = '68b2621e05c8479086e984a98ea8e716'; //This is the Dandelion token
      var text = ($('#uc-text').val()).replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");//Eliminates punctuation
      text = text.replace(/ /g, "%20");//Replaces spaces with %20
      var query = 'https://api.dandelion.eu/datatxt/nex/v1/?text='+text+'&token='+tkn+'&lang=en';
      var unique_labels=[];
      $.ajax({
        type: 'GET',
        url: query,
        success: function(data) {
            $("#primary").empty(); //Empties out the #primary article
            var res_length = data.annotations.length; //Gets the length of the annotations
            if(res_length > 0) { 
              var label; //Temp_location of labels
              var u = {}; //Labels seen
              for(var i=0;i<res_length;i++) {
                label = data.annotations[i].label; //Storing next available label
                if(!u.hasOwnProperty(label)) { //Check if the label has already been seen
                  unique_labels.push(label);
                  $('#primary').append(   //Adds the label to the DOM
                  '<p>'+label+'</p>'
                  );
                  u[label] = 1; //Marks label as seen
                }
              }
            }
            else {
              $('#primary').append(
                '<p>Sorry, nothing to display</p>'
              );
            }
          }
     });

      
      e.preventDefault();
    });
  });
})(jQuery);

