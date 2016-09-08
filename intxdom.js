/* 
 *  KOLOLA Interchange Library
 *  
 *  Copyright 2016 KOLOLA Limited
 *  www.kolola.net
 * 
 * 
 *  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
 *  documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
 *  the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, 
 *  and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all copies or substantial portions 
 *  of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
 *  TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
 *  THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
 *  CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 *  DEALINGS IN THE SOFTWARE.
 * 
 */

/**
 *  This file contains the reference implementation for the KOLOLA Interchange DOM Interface.  It serves as a 
 *  reference for other implmenters, and as a useful tool in itself, allowing an appropriately marked-up HTML form
 *  to be accessed via the KOLOLA Interchange DOM interface.
 */

/**
 *  A KOLOLA DOM Handler searches for approprioately marked-up elements, and allows them to be accessed via the
 *  KOLOLA Interchange DOM Interface.  Normally, a since KololaDOMHandler would be set up at document.interchange
 */
function BasicIntxDOMHandler(root){
    
    var self = this;
    
    /*
     * A (private) helper function to prepare a native DOM input for use as an interchange element
     * 
     * @param $HTMLInputElement element
     * @returns KOLOLAInterchangeElement
     */
    function genElementObject($element){
        
        /* Find assigned URIs
         * 
         * URIs are assigned by an HTML attribute 'x-kolola-uri'
         * [We use x- rather than an XML namespace, because XML namespace support is dodgy in jQuery]
         */
        var uris = [$element.attr('x-kolola-uri')];
        
        return {
            element: $element.get(0), // Convert to native element
            uris: uris,
            setValue: function(value){ $element.val(value); },
            getValue: function(value){ return $element.val(); }
        };
        
    }
    
    /**
     * Get an array of KOLOLAInterchangeElement, representing all elements within the root that
     * are marked up with an interchange URI
     * 
     */
    self.getElements = function(){
        
        var elements = [];
        
        // Find elements marked with an interchange URI, and wrap them with the interchange interface
        $(root).find('[x-kolola-uri]').each(function(i, el){
            console.log("Found intx DOM element", el);
            elements.push(genElementObject($(el)));
        });
        
        return elements;
    }
    
    
    
}
