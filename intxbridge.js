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
 *  The interchange bridge takes values from an InterchangeClient, and uses the KOLOLA Interchange DOM Interface
 *  (a reference implementation is provided in intxdom.js) to pre-fill elements on the page.
 *  
 *  
 */

function IntxBridge(options){
    
    var self = this;
    
    // Set default options
    options = $.extend(true, {
        dropHandler: false, // The element that we should listen for drops on
        client: false, // The interchange client to use - false creates a new one
        dom: false, // The interchange DOM Interface to use; false => document.interchange
    }, options);
    
    if(!options.dom)
        options.dom = document.interchange;
    
    if(!options.client)
        options.client = new IntxClient();
    
    // Set up drop handling...
    
    
        // Get the data from the client
    
        // Find all the elements
    
        // Try to match elements with data
    
}