/*
 * JQuery logic that I was unable to transfer to Angular due to my own lack of intelligence.
 *
 * Only used in the mobile version of the app.
 */
/*global jQuery document*/
(function($) {

    "use strict";
    
    // Every modal has a "previous" and a "next" button that can be disabled or enabled
    // Each one's "next" button should activate the next in the series - ditto for "previous"

    function handleClick(element, classSelector, isNext) {
        var $element = $(element);
        
        if ($element.hasClass('disabled')) {
            return;
        }
        
        var siblings = $(classSelector);
        
        // increment or decrement by one, relative to siblings
        var index = siblings.index($element) + (isNext ? 1 : -1);
        
        if (index < 0 || index >= siblings.length) {
            // should not occur due to disabled status
            return;
        }
        
        $element.closest('.modal').modal('hide');
        
        siblings.eq(index).closest('.modal').modal('show');
    }
    
    $(document).
    delegate('.btn-modal-next', 'click', function() {
        handleClick(this, '.btn-modal-next', true);
    }).
    delegate('.btn-modal-prev', 'click', function() {
        handleClick(this, '.btn-modal-prev', false);
    });
    
    
})(jQuery);