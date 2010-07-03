;(function($) {
    
    $.fn.editable = function(options) {
        
        var options = $.extend({}, $.fn.editable.defaults, options);
        
        $.editable.options = options;
        
        var input = $('<input></input>', {type:'text', class: 'input-editable', size: options.size}),
            select = $('<select></select>', {class: 'select-editable'}),
            
            save = $('<a></a>', {href:'javascript:void(0)', class: 'save'}).text('Mentés'),
            cancel = $('<a></a>', {href:'javascript:void(0)', class: 'cancel'}).text('Mégsem');
        
        return this.bind('click', function(e) {
                
                var element = $(this),
                    value = jQuery.trim(element.text()),
                    target = $(e.target);
                    
                if (target.is('.input-editable') || target.is('.select-editable') || target.is('.option-editable')) {
                    
                    return false;
                }
                
                if (target.is('.cancel')) {
                    
                    $.editable.cancel(element, value);
                    
                    return false;
                }
                
                if (target.is('.save')) {
                    
                    $.editable.save(element);
                    
                    return false;
                }
                
                if (target.is($.editable.options.element)) {
                    
                    $.editable.oldValue = value;
                    
                    var ret = $.editable.reset();
                    
                    if (!ret) {
                        return false;
                    }
                }
                
                if (element.hasClass('text')) {

                    element.html(input.after(save).after(cancel));
                    
                    var inputElement = element.find('.input-editable');
                    
                    inputElement.attr('name', element.attr('title'));
                    
                    inputElement.val(value);
                    
                    inputElement.focus();
                }
                
                if (element.hasClass('select')) {
                    
                    select.empty();
                    
                    var options = jQuery.parseJSON(element.attr('options'))
                        length = options.length;
                    
                    if (length) {
                        
                        var option;
                        for (var i = 0; i < length; i++) {
                            
                            option = $('<option></option>', {value:options[i], class: 'option-editable'}).text(options[i]);
                            
                            if (options[i] === value) {
                                
                                option.attr('selected', true);
                            }
                            select.append(option);
                        }

                        element.html(select.after(save).after(cancel));
                        
                        var selectElement = element.find('.select-editable');
                        
                        selectElement.attr('name', element.attr('title'));
                    }
                }
                
                return false;
            });
    };
    
    $.editable = {
        
        oldValue: '',
        
        options: {},
        
        save: function(element) {
            
            var text = '';
            
            if (element.hasClass('text')) {
                    
                text = element.find('input').val();
            }
            
            if (element.hasClass('select')) {
                
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

                        element.html(text);
                    }
                });
            }                
            
            return false;
        },
        
        cancel: function(element) {

            element.html(this.oldValue);

            return false;
        },
        
        reset: function() {
            
            var input = $(this.options.container).find('input'),
                select = $(this.options.container).find('select');
            
            if (input.length !== 0) {
                
                var value = jQuery.trim(input.val());
    
                if (value !== '') {
    
                    var element = input.parents(this.options.element);
                    
                    element.html(value);
                    
                    return true;
                } else {
                    
                    return false;
                }
            }
            
            if (select.length !== 0) {
                
                var value = jQuery.trim(select.val());
    
                if (value !== '') {
    
                    var element = select.parents(this.options.element);
                    
                    element.html(value);
                    
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
        size: 40
    }
    
    
}) (jQuery);