# kolola-intx
KOLOLA Interchange Client

This is a javascript implementation of KOLOLA's interchange client and some useful helper tools, allowing developers 
to consume activity data from KOLOLA and implement our curated-interchange interaction style in their own web apps.

## License

Everything here is MIT licensed.  You can do what you like with it, provided the copyright and licensing notice 
remains intact.


## Get Started

First, decide what you need to implement.  

* Simple applications that rely on HTML forms can just add
some markup to their form and use the library as-is - see intxdom-example.html

* More complex applications might need to implement their own version of the DOM Interface.  Take a look at intxdom.js which
contains our reference implementation to see what interface needs to be provided.  You can then use your custom DOM interface
with our stock Interchange Bridge to quickly provide the curated-interchange interaction style that KOLOLA users are used to.

* Really exotic applications, or those that want to implement new interation styles, should take the basic client 
(in intxclient.js) and use that as the interface for fetching data from the KOLOLA Interchange API.

* If you're not using javascript, you'll need to take a look at the stock client and re-implement it in your language of choice.
Don't worry, it's not that complicated!


## Dependencies

All of the components require jQuery; any recent-ish version should work.


## Components

**KOLOLA Interchange API**

The KOLOLA Interchange API is built in to every KOLOLA portfolio and exposes records from KOLOLA as linked data. When an activity is dragged and dropped from the KOLOLA interface, one of the associated data items is an interchange URL (of mime-type `x-kolola/intx-resolver`). Resolving this URL (which refers directly to the interchange API) will return a linked-data representation of the activity. The URLs include security features that prevent unauthorised access, and make it impossible to guess the URL for a particular event without being logged in to KOLOLA.  It's possible to interact directly with this API and to parse the returned data (and, if you'd like to do so, please do get in touch so that we can offer advice), but we also provide a javascript client (described below). You'll need to consume the API directly if you're not using Javascript; but if you are then you can use one of the other components that we describe below.

An example interchange URL might look like:
`https://wen.impactrecord.eu/api/intx/?resolve&token&itok=eyJoYXNoIjoiNDdiMGUzNzdmMzk4NGFmMmE0NWFlMjg4ZGYzODZmNjdlOWU5YzM1YTg2OGI3YWY1NTBmODBkMDI5ODk1ZmM2YSIsImF1dGgiOiJjNGE4NzNlYjYzN2M3ZDExMjcwYTUxYTAwZjM4MDA1N2I4NTI0YjUzZDViNTQzYmFlNTFmMmI5OTIwOGVjNjgyIiwidXJpIjoiaHR0cDpcL1wvd2VuLmltcGFjdHJlY29yZC5ldVwvX3JlY29yZHNcLzAxXC9faW50eHYxXC9ldmVudFwvRXZlbnRJRFwvMjIifQ==`


**Low-Level Javascript client**

The Javascript client (implemented in intx-client.js) implements a client for the interchange API. It provides convenience methods to fethc interchange data when given an interchange URL, and to flatten the returned information into a more easily consumed format.  Using the client directly is the most flexible way to obtain data from the API, but is more complicated that using one the high-level methods that are described below.

*In addition to the low-level client, we provide tools to allow quick implementation of our default 
interaction style, 'curated interchange'.*


**Interchange Bridge**

The Interchange Bridge provides the basic drag-and-drop interaction mechanism that KOLOLA users are used to. It detects when activities are dropped from KOLOLA on to another web page, fetches the interchange data from the API (using the low-level client described above) and then pushes that data into the local web page through the KOLOLA Interchange DOM Interface. If you want to use the Interchange Bridge, then you need to make sure that your web page also implements the Interchange DOM Interface that we describe next.


**Interchange DOM Interface**

The DOM Interface is, as the name suggests, a software interface that allows the Interchange Bridge to interact with your
web app via an extension to the standard DOM.  This isn't a piece of code in itself, it's a definition for additional methods and properties in the browser DOM that the interchange bridge expects to be present. 


**DOM Interface Reference Implementation / HTML Form Filler**

We provide a reference implementation of the DOM Interface to demonstrate the interface that applications need to implement
in order to work with the Interchange Bridge.  It's also a useful tool in itself, providing a *really* quick way to pre-fill
HTML forms with data from dropped events, just by annotating the input fields with KOLOLA URIs.  See the example page, 
intxdom-example.html, for an example of how it works.

## Interchange API Format

The interchange API returns records in a linked-data format. Each record has an associated URI (and, if present, a series of aliases) that allow records to be identified across multiple systems. An sample of the returned data is shown below. 

The main body of the response is included in "result". If the request was unsusccessful, "success" will be false, and error field will contain an error message instead.

Within result is a *recordset*. The recordset contains some metadata (like when it was generated, and by whom) and a series of *records*, within the "records" array. 

Each *record* has a URI which identifies it (in the @id) field, a type that identifies the type of record (in practical terms, the database table that it came from, in @type) and a series of *fields*, in "data".

Each field is either raw data (type = data) or a pointer to another record (type = pointer). Pointers refer to other records which, in many cases, will be included the recordset. In some cases, pointers might refer to records that are NOT included in the provided recordset. For instance, we never return personal information through the interchange API and so no person records will be included.

Finally, the recordset includes an "aliases" array that lists any known sameas relationships between URIs in the dataset. In most cases this set is empty; but may be populated in some advanced use cases. Please speak to us if you need to understand more about how KOLOLA uses sameas relationships to combine and link between records from multiple sources.


```json
{
  "success": true,
  "result": {
    "@id": "",
    "@type": "http://schema.kolola.net/intx/2.0/set",
    "description": "Result of query from Interchange API on wen.impactrecord.eu",
    "author": "Anonymous",
    "date": "2018-02-28 14:35:09",
    "records": [
      {
        "@id": "http://wen.impactrecord.eu/_records/01/_intxv1/event/EventID/22",
        "@type": "http://schema.kolola.net/kolola/1/event",
        "date": "2018-02-28 14:35:09",
        "data": {
          "eventid": {
            "type": "data",
            "value": ""
          },
          "name": {
            "type": "data",
            "value": "Hatch Farm Residents Association Meeting"
          },
          "startdate": {
            "type": "data",
            "value": "2018-02-22"
          },
          "enddate": {
            "type": "data",
            "value": "2018-02-22"
          },
          "description": {
            "type": "data",
            "value": ""
          },
          "location": {
            "type": "data",
            "value": ""
          },
          "organisation": {
            "type": "data",
            "value": ""
          },
          "typeid": {
            "type": "pointer",
            "uri": "http://brucetennent.impactrecord.uk/framework/_intxv1/type/TypeID/2"
          },
          "caleventid": {
            "type": "data",
            "value": ""
          }
        },
        "alias": []
      },
      {
        "@id": "http://wen.impactrecord.eu/_records/01/_intxv1/eventparticipant/EventParticipantID/39",
        "@type": "http://schema.kolola.net/kolola/1/eventparticipant",
        "date": "2018-02-28 14:35:09",
        "data": {
          "eventparticipantid": {
            "type": "data",
            "value": ""
          },
          "eventid": {
            "type": "pointer",
            "uri": "http://wen.impactrecord.eu/_records/01/_intxv1/event/EventID/22"
          },
          "personid": {
            "type": "pointer",
            "uri": "http://wen.impactrecord.eu/_records/01/_intxv1/person/PersonID/2"
          },
          "comment": {
            "type": "data",
            "value": ""
          },
          "role": {
            "type": "data",
            "value": ""
          }
        },
        "alias": []
      }

    ],
    "aliases": []
  }
}
```
