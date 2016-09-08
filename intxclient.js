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
 *  The interchange client retrieves and parses data from the KOLOLA interchange API
 */
function IntxClient()
{
    var self = this;
    
    self.err = function(msg){};
    
    // Get, parse and then run a callback on the the given URL
    self.fetch = function(url, then)
    {
        $.get(url, {}, function(data, status, jqxhr){ receive(then, data, status, jqxhr); }, 'json');
    }
    
    var receive = function(then, data, status, jqxhr)
    {
        if(typeof data !== 'object')
        {
            self.err('Invalid response received from interchange endpoint');
            return;
        }
        
        var records = data.result.records;
        
        // Helper function to find a specific record in the set
        // TODO: Aliases! (Or all pointers should be canonical?)
        function findRecord(uri)
        {
            for(var rn in records)
            {
                var record = records[rn];
                if(record['@id'] === uri)
                    return record;
            }
            
            return false; // False if we couldn't find it
        }
        
        // Add references to foreign records inside pointers, for convenience
        for(var rn in records)
        {
            var record = records[rn];
            
            for(var fn in record.data)
            {
                var field = record.data[fn];
                
                if(field.type === 'pointer')
                {
                    field.foreign = findRecord(field.uri);
                }
            }
        }
        
        then(records);
    }
    
    /**
     * The raw structure is not that easy to work with, and is overkill for most applications.  These methods flatten it into
     * something more manageable.
     */
    self.fetchFlat = function(url, then)
    {
        self.fetch(url, function(records){ then(self.flatten(records)); });
    }
    
    self.flatten = function(records)
    {
        var out = [];
        for(var i in records)
        {
            var record = records[i];
            
            // Convert event fields to simple URI=>value
            if(record['@type'] === 'http://schema.kolola.net/kolola/1/event')
            {
                for(var dn in record.data)
                {
                    var datum = record.data[dn];
                    out['http://schema.kolola.net/fields/1/event/' + dn] = datum.value;
                }
            }
            // Evidence also gets flattened into simple URI=>value
            else if(record['@type'] === 'http://schema.kolola.net/kolola/1/eventevidence')
            {
                var ev = record.data.evidenceid.foreign;
                out[ev['@id']] = record.data.value.value; 
                
                // TODO: Also populate aliases!
            }
        }
        
        return out;
    }
    
    
}