/*global jQuery window*/
(function($) {
    "use strict";
    
    var $window = $(window);
    
    function hashchange () {
        var fragment = $.param.fragment() || 'home';
        
        $('.tab-content').filter('#' + fragment).show().end().not('#' + fragment).hide();
        
        $('.nav li').filter('.link-' + fragment).addClass('active').end().not('.link-' + fragment).removeClass('active');
        
    }
    
    $window.bind('hashchange', hashchange);
    
    $window.trigger('hashchange');
    
    hashchange();
    
})(jQuery);