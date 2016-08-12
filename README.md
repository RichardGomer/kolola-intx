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

In addition to the low-level client, we provide tools (mentioned above) to allow quick implementation of our default 
interaction style, 'curated interchange'.

**Interchange Bridge**

The Interchange Bridge provides the basic drag-and-drop interaction mechanism. It detects dropped activities, fetches the
interchange data from the API (via the low-level client) and then feeds that data into the local page through the
KOLOLA Interchange DOM Interface.

**Interchange DOM Interface**

The DOM Interface is, as the name suggests, a software interface that allows the Interchange Bridge to interact with your
web app via an extension to the standard DOM.  

**DOM Interface Reference Implementation / HTML Form Filler**

We provide a reference implementation of the DOM Interface to demonstrate the interface that applications need to implement
in order to work with the Interchange Bridge.  It's also a useful tool in itself, providing a *really* quick way to pre-fill
HTML forms with data from dropped events, just by annotating the input fields with KOLOLA URIs.  See the example page, 
intxdom-example.html, for an example of how it works.
