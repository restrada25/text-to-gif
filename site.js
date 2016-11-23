$.noConflict();
(function($) {
  $(document).ready(function() {
     $('#uc-form').on('submit', function(e) {
      var tkn = '68b2621e05c8479086e984a98ea8e716'; //This is the dandelion token
      var text = ($('#uc-text').val()).replace(/ /g, "%20");//Replaces all the spaces with '%20'
      var query = 'https://api.dandelion.eu/datatxt/nex/v1/?text='+text+'&token='+tkn+'&lang=en';

      $.ajax({
        type: 'GET',
        url: query,
        success: function(data) {
            var res_length = data.annotations.length; //Gets the length of the annotations
            if(res_length > 0) { 
              for(var i=0;i<res_length;i++) {
                $('#primary').append(
                  '<p>'+data.annotations[i].label+'</p>'
                );
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

