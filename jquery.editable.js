(function($) {
    
    $.fn.editable = function(options) {
        
        options = $.extend({}, $.fn.editable.defaults, options);
        
        
        var template = $('<input></input>', {type:'text', name:'input_editable', class: 'input-editable', size: options.size});
        
        return $(this).each(function() {
            
            var element = $(this);

            element.bind('click', function(e) {
                
                if($(e.target).is('.input-editable')) return false;
                
                var value = jQuery.trim(element.text());
                
                element.html(template);
                            
                var input = element.find('.input-editable');
                
                input.val(value);
                
                input.focus();
                
                input.keyup(function(e) {
                   
                    if(e.which === 27) {
                        
                        element.html(value);
                        
                        input.die();  
                        
                        return false;
                    }
                });
                 
                input.live('blur', function() {
                    
                    var self = $(this);
                    var newValue = jQuery.trim(self.val());
                    
                    element.html();
                    element.text(newValue);
                    
                    $.ajax({
                        url: options.saveTo,
                        type: "POST",
                        dataType: "text",
                        data: {
                           p: newValue
                        },
                        success: function(response) {

                            input.die();
                        }
                    });
                    
                });
                
                return false;
            });
        });
    };
    
    $.fn.editable.defaults = {
        saveTo: '',
        siez:'40'
    }
    
    
}) (jQuery);