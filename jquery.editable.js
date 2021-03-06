;(function($) {
    
    $.fn.editable = function(options) {
        
        var options = $.extend({}, $.fn.editable.defaults, options);
        
        $.editable.options = options;
        
        var input = $('<input></input>', {type:'text', 'class': 'input-editable', size: options.size}),
            select = $('<select></select>', {'class': 'select-editable'}).html(''),
            save = $('<a></a>', {href:'javascript:void(0);', 'class': 'save'}).html(options.links.save),
            cancel = $('<a></a>', {href:'javascript:void(0);', 'class': 'cancel'}).html(options.links.cancel),
        	img = $('<img></img>', {'class': 'ajax-loader hidden', 'src': options.loaderPath, 'alt': ''});
        
        return this.each(function() {
        
            var element = $(this);
                
            $.editable.hover(element);
            
            element.bind('click', function(e) {
                
                $('.'+$.editable.options.message.cssClass).hide();
                
                var element = $(this),
                    value = jQuery.trim(element.text()),
                    target = $(e.target);
                
                if (target.is('.input-editable') || target.is('.select-editable') || target.is('.option-editable')) {
                    
                    return false;
                }
                
                if (target.is('.cancel')) {
                    
                    $.editable.cancel(element);
                    
                    return false;
                }
                
                if (target.is('.save')) {
                    
                	img.insertAfter(element);
                	
					$('.ajax-loader')
					   .ajaxStart(function() {
							$(this).show();
					   })
					   .ajaxStop(function() {
							$(this).hide();
					});    
					                 
                    $.editable.save(element);
                    
                    return false;
                }
                
                element.attr('alt', value);
                
                if (target.is($.editable.options.element)) {
                    
                    var ret = $.editable.reset();
                    
                    if (!ret) {
                        return false;
                    }
                }
                
                if (element.hasClass('text')) {
                    var input = $('<input></input>', {type:'text', 'class': 'input-editable'});
                    input.datepicker();

                    save.html($.editable.options.links.save);
                    cancel.html($.editable.options.links.cancel);
                    
                    element.html(input.after(save).after(cancel));
                    
                    var inputElement = element.find('.input-editable');
                    
                    inputElement.attr('name', element.attr('title'));
                    
                    inputElement.val(value);
                    
                    inputElement.focus();
                }
                
                if (element.hasClass('select')) {
                    
                    //select.empty();
                    
                    var options = jQuery.parseJSON(element.attr('options'));
                    
                    var length = options.length;
                    
                    if (length) {
                        select.html('');
                        var option;
                        for (var i = 0; i < length; i++) {
                            
                            option = $('<option></option>', {value:options[i].key, 'class': 'option-editable'}).html(options[i].value);
                            
                            if (options[i].value === value) {
                                
                                option.attr('selected', true);
                            }
                            select.append(option);

                        }
                        
                        save.html($.editable.options.links.save);
                        cancel.html($.editable.options.links.cancel);
                        
                        //element.html(select.after(save).after(cancel));
                        element.html(select);
                        element.append(save).append(cancel);
                        
                        var selectElement = element.find('.select-editable');
                        
                        selectElement.attr('name', element.attr('title'));
                    }
                }
                
                return false;
            });
        });
    };
    
    $.editable = {

        
        options: {},
        
        hover: function(element) {
            
            var message = $('<span></span>', {'class': this.options.message.cssClass});
            
            element.hover(
                function() {
                    
                    $(this).after(message.text($.editable.options.message.text));
                },
                function() {
                    $('.'+$.editable.options.message.cssClass).remove();
                }
            );
        },
        
        save: function(element) {
            
            var text = '', value = '';
            
            if (element.hasClass('text')) {
                    
                text = element.find('input').val();
            }
            
            if (element.hasClass('select')) {
                
                value = element.find('select option:selected').text();
                text = element.find('select').val();
            }
            
            text = jQuery.trim(text);
            
            if (text !== '') {
                
                $.ajax({
                    url: $.editable.options.saveTo,
                    type: "POST",
                    dataType: "text",
                    data: {
                        key: element.attr('title'),
                        value: text
                    },
                    success: function(response) {
                        
                        
                        //$.editable.hover(element);
                        if (response.response) {
                        	
                        	if (value.length) {
    
                        		element.html(value);
                        	} else {
                        		
	                        	element.html(text);
                        	}
                        	//element.html(element.attr('alt'));
                        	element.css('color', 'green');
                        } else {
                        	
                        	element.html(element.attr('alt'));
                        	element.css('color', 'red');
                        }                    }
                });
            }                
            
            return false;
        },
        
        cancel: function(element) {
            
            $.editable.hover(element);
            
            element.html(element.attr('alt'));
            
            return false;
        },
        
        reset: function() {
                    
            var input = $(this.options.container).find('input'),
                select = $(this.options.container).find('select');
            
            if (input.length !== 0) {
                
                var value = jQuery.trim(input.val());
    
                if (value !== '') {
    
                    var element = input.parents(this.options.element);
                    
                    $.editable.hover(element);
                    
                    //element.html(value);
                    
                    element.html(element.attr('alt'));
                    
                    return true;
                } else {
                    
                    return false;
                }
            }
            
            if (select.length !== 0) {
                
                var value = jQuery.trim(select.val());
    
                if (value !== '') {
    
                    var element = select.parents(this.options.element);
                    
                    //$.editable.hover(element);
                    
                    //element.html(value);
                    element.html(element.attr('alt'));
                    return true;
                } else {
                    
                    return false;
                }
            }            
            return true;
        }
    };
    
    $.fn.editable.defaults = {
        container: '.editable-container',
        element: '.editable',
        saveTo: '',
        size: 40,
        message: {
            cssClass: 'info',
            text:'szerkesztés'
        },
        loaderPath: '',
        links: {
            save: 'Mentés',
            cancel: 'Mégsem'
        },
        onSuccess: function() {},
        onError: function() {}
    }
    
    
})(jQuery);