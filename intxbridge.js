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
        success: function(){}
    }, options);

    if(!options.dom)
        options.dom = document.interchange;

    if(!options.client)
        options.client = new IntxClient();

    // Set up drop handling...
    $(options.dropHandler).on('dragover', function(e){

        //console.log(e);
        e.originalEvent.dataTransfer.dropEffect = 'copy';


        if (e.originalEvent.preventDefault) e.originalEvent.preventDefault();
        return false;
    });

    $(options.dropHandler).on('drop', function(e){

        e.preventDefault();


        // Get the data from the client
        var url = e.originalEvent.dataTransfer.getData('x-kolola/intx-resolver');

        // Fall back to normal HTML links - as used by the RCUK CQS report
        if(!url){
            url = e.originalEvent.dataTransfer.getData('text/uri-list');
        }

        if(!url){ return; }

        options.client.fetchFlat(url, function(data){

            // Try to match page elements with data
            var elements = options.dom.getElements();

            console.log("Received data", data);
            console.log("Received elements", elements);

            for(var i in elements){

                var el = elements[i];

                // Check all element URIs
                for(var j in el.uris)
                {
                    var euri = el.uris[j];

                    console.log("Try to find field", euri, "in activity data");

                    for(var uri in data)
                    {
                        if(uri === euri)
                        {
                            self.annotate(el, data[uri]);
                        }
                    }
                }

            }
        });

    });

    /**
     * Object methods
     */

    /**
     * Annotate an element as having data available for transposition
     *
     * @param {type} element: An element object from the DOM interface
     * @param {type} value
     * @returns void
     */
    self.annotate = function(element, value){
        self.populate(element, value); // TODO!
    }

    /**
     * Actually populate an element with the value from a datum object
     *
     * @param {type} element: An element object from the DOM interface
     * @param {type} value
     * @returns void
     */
    self.populate = function(element, value){

        console.log("Populate", element, "with value", value);

        element.setValue(value);

    }


}
