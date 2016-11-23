$.noConflict();
(function($) {
  $(document).ready(function() {
     $('#uc-form').on('submit', function(e) {
      var user = 'uClassify';
      var classifier = 'Sentiment';
      var t = 'q8jd8INyT27D';
      var text = $('#uc-text').val();
      //var query = 'https://api.uclassify.com/v1/'+user+'/'+classifier+'/classify/?readKey='+t+'&text='+text;
      var query = 'https://api.uclassify.com/v1/uClassify/Sentiment/classify/?readKey=q8jd8INyT27D&text=happy';

      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: query,
        success: function(data) {
            $('#primary').append(
             '<p>Positive: '+data.positive+' Negative: '+data.negative+'</p>'
            );
          }
     });

      e.preventDefault();
    });
  });
})(jQuery);

