$.noConflict();
(function($) {
  $(document).ready(function() {
     $('#uc-form').on('submit', function(e) {
      var tkn = '68b2621e05c8479086e984a98ea8e716';
      var text = ($('#uc-text').val()).replace(/ /g, "%20");
      var query = 'https://api.dandelion.eu/datatxt/nex/v1/?text='+text+'&token='+tkn+'&lang=en';

      $.ajax({
        type: 'GET',
        url: query,
        success: function(data) {
            console.log(data);
          }
     });
     
      console.log(query);
      e.preventDefault();
    });
  });
})(jQuery);

