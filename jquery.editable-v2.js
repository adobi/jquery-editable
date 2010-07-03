(function($) {
    
    $.fn.editable = function(options) {
        
        options = $.extend({}, $.fn.editable.defaults, options);
        
        var template = $('<input></input>', {type:'text', name:'input_editable', 'class': 'input-editable', size: options.size});
        
        var save = function(element, newValue, oldValue) {
            
            var input = element.find('.input-editable');
            var self = $(input);
            
            element.html();

            if(options.validation.test(newValue)) {
                
                $.ajax({
                    url: options.saveTo,
                    type: "POST",
                    dataType: "text",
                    data: {
                       p: newValue,
                       id: element.attr('title')
                    },
                    success: function(response) {

                        element.text(newValue);
                
                        input.die();
                        
                        options.callback.call(this);
                    }
                });
            }
         
        };
        
        return $(this).each(function() {
            
            var element = $(this);

            element.bind('click', function(e) {
                
                if($(e.target).is('.input-editable')) return false;
                
                var input = element.find('.input-editable');
                
                if(input.length === 0) {
                    
                    var value = jQuery.trim(element.text());
                    
                    element.html(template);
                    
                    input = element.find('.input-editable');
                                
                    input.val(value);
                    
                    input.focus();
                    
                    input.live('keyup', function(e) {
                        
                        var inputValue = jQuery.trim($(this).val());

                        switch(e.which) {
                            
                            case 27: //escape
                            
                                element.html(value);
                                
                                input.die(); 
        
                                return false;
                                break;
                            case 13: //enter
                                
                                if(inputValue !== '' && inputValue !== value) {
                                    save(element, inputValue, value);
                                }
                                else {
                                    element.text(value);
                                    input.die();
                                } 
                                                                   
                                return true;
                                break;
                            default:
                                return true;
                            
                        }
                    });
                     
                    input.live('blur', function() {
                        
                        var self = $(this);
                        var inputValue = jQuery.trim(self.val());
                        
                        element.html();
                        
                        if(inputValue !== '' && inputValue !== value) {
                            save(element, inputValue, value);
                        }
                        else {
                            element.text(value);
                            input.die();
                        }
                    });
                }
                return false;
            });
        });
    };
    
    $.fn.editable.defaults = {
        saveTo: '',
        size:'40',
        validation:'',
        callback: function() {}
    };
    
    
}) (jQuery);