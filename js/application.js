/*global jQuery window*/
(function($) {
    "use strict";
    
    var countries = [
        {code: 'at', name: 'Austria-Hungary'},
        {code: 'it', name: 'Italy'},
        {code: 'fr', name: 'France'},
        {code: 'gb', name: 'Great Britain'},
        {code: 'de', name: 'Germany'},
        {code: 'ru', name: 'Russia'}
    ];
    
    var players = [];
    
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

        function formatCountry(country, element) {
            var template = $('#country').html();
            var $element = $(element);
            
            $element.find('.country-container').remove().end().prepend(
                template.format(country.code, country.name, country.multiplier || 0));
        }

        $('.tmpl-country').each(function(i, element){
            var country = countries[i];

            formatCountry(country, element);
            
            $(element).find('li a').live('click', function(e){
                // multiplier button
                
                e.preventDefault();
                
                var multiplier = parseInt($(this).attr('multiplier-value'), 10);
                country.multiplier = multiplier;
                formatCountry(country, element);
                updatePlayerSum();
                
            });
        });
        
        $('.cash-row').click(function(){return false;});
    }
    
    function initPlayers() {
        
        function formatPlayers() {
            $('.player-name').each(function(i, element){
                var $element = $(element);
                if (players[i]) {
                    $element.show();
                } else {
                    $element.hide();
                }
            });
            if (players.length === 6) {
                $('.add-player').hide();
            }
        }
        
        function formatPlayerShare(player, country) {
            
            return $('#player-share').html().format(player.number, player.shares[country.name] || 0);
        }
        
        formatPlayers();
        
        $('.add-player').live('click', function(e){
            e.preventDefault();
            
            var newPlayer = {number: players.length, shares : {}};
            
            players.push(newPlayer);
            
            $('.country-row').each(function(i, element){
                var country = countries[i];
                var $element = $(element);
                
                $element.append(formatPlayerShare(newPlayer, country));
                
                var playerShare = $element.find(':last-child');
                
                
                var shareDropdown = playerShare.find('.share-dropdown');
                
                for (var j = 9; j >= 1; j--) {
                    // shares range from 1 million to 9 million
                    shareDropdown.prepend($('#share-item').html().format(j));
                }
                
                playerShare.find('.share-item').click(function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var $this = $(this);
                    
                    $this.toggleClass('selected');
                    
                    $this.find('.share-check').toggleClass('icon-ok').toggleClass('icon-none');
                    
                    
                    var sumValue = 0;
                    
                    $(this).parent().find('.share-item.selected').each(function(i, shareElement){
                        sumValue += parseInt($(shareElement).attr('share-value'), 10);
                    });
                    
                    newPlayer.shares[country.name] = sumValue;
                    
                    playerShare.find('.share-dropdown-button').text(sumValue + 'mil');
                    
                    updatePlayerSum();
                });
                
                playerShare.find('.share-done').click(function(e) {
                    e.preventDefault();
                });
                
            });
            
            $('.cash-row').append($('#cash-on-hand').html());
            
            $('.cash-row').find(':last-child').find('input').on('change', function() {
                newPlayer.cash = parseInt($(this).val(), 10);
                updatePlayerSum();
            });
            
            $('.sum-row').append($('#sum').html());
            
            formatPlayers();
        });
        
        $('.player-name input').each(function(i, element){
            $(element).on('change', function(){
                players[i].name = $(this).val();
            });
        });
        
    }
    
    function updatePlayerSum() {
        var sumDisplays = $('.sum-row').children();
        for (var i = 0; i < players.length; i++) {
            var player = players[i];
            
            var sumDisplay = sumDisplays.get(i + 1);
            
            var sum = 0;
            
            for (var j = 0; j < countries.length ; j++) {
                var country = countries[j];
                
                sum += ((country.multiplier || 0) * (player.shares[country.name] || 0));
            }
            
            sum += (player.cash || 0);
            
            $(sumDisplay).text(sum + 'mil');
            
        }
    }
    
    
    initTabs();
    initCountries();
    initPlayers();
    updatePlayerSum();
    
    
})(jQuery);