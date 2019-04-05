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

// May be used a node module
if(typeof module !== 'undefined') {
 $ = require('jquery');
}

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

        var records = data.result.records.records;

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

        // Add references to foreign records
        for(var rn in records)
        {
            var record = records[rn];

            for(var fn in record.data)
            {
                var field = record.data[fn];

                if(field.type === 'pointer')
                {
                    field.foreign = findRecord(field.uri);

                    // Also add a reference in the reverse direction
                    if(field.foreign !== false)
                    {
                        //console.log("Foreign record", field.foreign);
                        if(typeof field.foreign.references === 'undefined')
                            field.foreign.references = {};

                        if(typeof field.foreign.references[record['@type']] === 'undefined')
                            field.foreign.references[record['@type']] = [];

                        field.foreign.references[record['@type']].push(record);
                    }
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

    // Flatten a single event
    // this function is naive and will raise an exception if called on a result that
    // contains more than one event!
    self.flatten = function(records)
    {
        var out = [];
        var eventCount = 0;

        console.log("Flattening", records);

        for(var i in records)
        {
            var record = records[i];

            // Convert event fields to simple URI=>value
            if(record['@type'] === TYPE.event)
            {
                eventCount++;

                if(eventCount > 1)
                    throw "Cannot flatten() (or fetchFlat()) more than a single event at a time - use fetch() and parse the original result";

                for(var dn in record.data)
                {
                    var datum = record.data[dn];

                    if(datum.type === 'data')
                    {
                      out['http://schema.kolola.net/fields/1/event/' + dn] = datum.value;
                    }
                    else if(datum.type ==='pointer')
                    {
                      out['http://schema.kolola.net/fields/1/event/' + dn] = datum.uri;
                    }
                }
            }
            // Evidence also gets flattened into simple URI=>value
            else if(record['@type'] === TYPE.eventevidence)
            {
                var ev = record.data.evidenceid.foreign;
                out[ev['@id']] = record.data.value.value;

                // TODO: Also populate aliases!
            }
        }

        return out;
    }
}

// Constants that are useful for manipulating the returned interchange data
const KTYPE = {
    event: 'http://schema.kolola.net/kolola/1/event',

    // Links & Attachments
    link: 'http://schema.kolola.net/kolola/1/link',
    attachment: 'http://schema.kolola.net/kolola/1/attachment',

    // Participants
    person: 'http://schema.kolola.net/kolola/1/person',
    eventparticipant: 'http://schema.kolola.net/kolola/1/eventparticipant',

    // Features, types, categories
    eventfeature: 'http://schema.kolola.net/kolola/1/eventfeature',
    feature: 'http://schema.kolola.net/kolola/1/feature',
    type: 'http://schema.kolola.net/kolola/1/type',
    category: 'http://schema.kolola.net/kolola/1/category',

    // Evidence
    eventevidence: 'http://schema.kolola.net/kolola/1/eventevidence',
    evidence: 'http://schema.kolola.net/kolola/1/evidence',

}

if(typeof module !== 'undefined') {
    var exports = module.exports = {};
    exports.TYPE = KTYPE;
    exports.IntxClient = IntxClient;
}
