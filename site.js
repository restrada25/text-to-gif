$.noConflict();
(function($) {
  $(document).ready(
    function() {
      $('html').removeClass('nojs');
      $('html').addClass('hasjs');

      if (typeof(window.$) !== "undefined") {
        console.log('jQuery still controls the $ variable');
      } else {
        console.log('Nice work! jQuery no longer controls the $ variable');
      }

    }
  );
})(jQuery);
