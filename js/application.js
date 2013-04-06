/*global jQuery window*/
(function($) {
    "use strict";
    
    String.prototype.format = function() {
      var args = arguments;
      return this.replace(/\{(\d+)\}/g, function(match, number) { 
        return typeof args[number] != 'undefined' ? args[number] : match;
      });
    };
    
    function initTabs() {
        var $window = $(window);

        function hashchange () {
            var fragment = $.param.fragment() || 'home';

            $('.tab-content').filter('#' + fragment).show().end().not('#' + fragment).hide();

            $('.nav li').filter('.link-' + fragment).addClass('active').end().not('.link-' + fragment).removeClass('active');

        }

        $window.bind('hashchange', hashchange);

        $window.trigger('hashchange');

        hashchange();
    }
    
    function initCountries() {
        var countries = [
            {code: 'at', name: 'Austria-Hungary'},
            {code: 'it', name: 'Italy'},
            {code: 'fr', name: 'France'},
            {code: 'gb', name: 'Great Britain'},
            {code: 'de', name: 'Germany'},
            {code: 'ru', name: 'Russia'}
        ];

        function formatCountry(country, element) {
            var template = $('#country').html();
            $(element).empty().append(template.format(country.code, country.name, country.multiplier || 0));
        }

        $('.tmpl-country').each(function(i, element){
            var country = countries[i];

            formatCountry(country, element);
            
            $(element).find('li a').live('click', function(e){
                
                e.preventDefault();
                
                var multiplier = $(this).attr('multiplier-value');
                country.multiplier = multiplier;
                formatCountry(country, element);
                
            });
        });
    }
    
    
    initTabs();
    initCountries();
    
    
})(jQuery);