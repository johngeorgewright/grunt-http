# grunt-http

> Sends a HTTP request and deals with the response.

[![NPM](https://nodei.co/npm/grunt-http.png)](https://nodei.co/npm/grunt-http)

[![NPM](https://nodei.co/npm-dl/grunt-http.png)](https://nodei.co/npm/grunt-http)

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-http --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-http');
```

## The "http" task

### Overview
In your project's Gruntfile, add a section named `http` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  http: {
    your_service: {
      options: {
        url: 'your/url.com',
      },
      dest: 'optional/file/to/save/response'
    }
  }
})
```

If you add a source file, the contents will be added to the `body` option unless another field is specified in the `sourceField` option.

### Options

grunt-http uses the [request](https://github.com/mikeal/request) module under the hood, and apart from a couple specific to grunt-http options, the rest get passed straight to it. Here's a copy of the of the module's option docs. Otherwise, [go to the repo](https://github.com/mikeal/request) and have a look at what's it's capable of.

- `uri || url` - fully qualified URI or a parsed URL object from url.parse(). REQUIRED.
- `callback` - A function that will receive an `error`, `response` and `body`, after a response if finished
- `qs` - object containing querystring values to be appended to the URI
- `method` - http method, defaults to GET
- `headers` - http headers, defaults to {}

---
- `qs` - object containing querystring values to be appended to the uri
- `qsParseOptions` - object containing options to pass to the [qs.parse](https://github.com/hapijs/qs#parsing-objects) method. Alternatively pass options to the [querystring.parse](https://nodejs.org/docs/v0.12.0/api/querystring.html#querystring_querystring_parse_str_sep_eq_options) method using this format {sep:';', eq:':', options:{}}
- `qsStringifyOptions` - object containing options to pass to the [qs.stringify](https://github.com/hapijs/qs#stringifying) method. Alternatively pass options to the [querystring.stringify](https://nodejs.org/docs/v0.12.0/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options) method using this format {sep:';', eq:':', options:{}}. For example, to change the way arrays are converted to query strings using the qs module pass the arrayFormat option with one of indices|brackets|repeat
- `useQuerystring` - If true, use querystring to stringify and parse querystrings, otherwise use qs (default: false). Set this option to true if you need arrays to be serialized as foo=bar&foo=baz instead of the default foo[0]=bar&foo[1]=baz.

---

- `body` - entity body for PATCH, POST and PUT requests. Must be a Buffer or String, unless json is true. If json is true, then body must be a JSON-serializable object.
- `sourceField` - A field in the body or form to add the source files' contents to. Can contain full stops to separate object path. IE "form.js\_code".
- `form` - When passed an object, this sets body to a querystring representation of value, and adds Content-type: application/x-www-form-urlencoded; charset=utf-8 header. When passed no options, a FormData instance is returned (and is piped to request). For `multipart/form-data` install the optional dependency `npm i form-data`.
- `formData` - Data to pass for a multipart/form-data
- `multipart` - array of objects which contain their own headers and body attributes. Sends a multipart/related request.
  - Alternatively you can pass in an object `{chunked: false, data: []}` where chunked is used to specify whether the request is sent in [chunked transfer encoding](https://en.wikipedia.org/wiki/Chunked_transfer_encoding) In non-chunked requests, data items with body streams are not allowed.
- `reambleCRLF` - append a newline/CRLF before the boundary of your multipart/form-data request.
- `postambleCRLF` - append a newline/CRLF at the end of the boundary of your multipart/form-data request.
- `json` - sets body but to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as json. Must be buffer or string or a function returning a string or buffer.
- `jsonReviver` - a [reviver function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) that will be passed to JSON.parse() when parsing a JSON response body.

---

- `auth` - A hash containing values user || username, password || pass, and sendImmediately (optional). [See more info here](https://github.com/mikeal/request#http-authentication).
- `oauth` - Options for OAuth HMAC-SHA1 signing. [See more info here](https://github.com/mikeal/request#oauth-signing). The `oauth-sign` module must be installed to use this functionality.
- `hawk` - Options for [Hawk signing](https://github.com/hueniverse/hawk). The credentials key must contain the necessary signing info, [see hawk docs for details](https://github.com/hueniverse/hawk#usage-example). You will need to install the `hawk` module to use this functionality.
- `aws` - object containing AWS signing information. Should have the properties key, secret. Also requires the property bucket, unless you’re specifying your bucket as part of the path, or the request doesn’t use a bucket (i.e. GET Services)
- `httpSignature` - Options for the [HTTP Signature Scheme](https://github.com/joyent/node-http-signature/blob/master/http_signing.md) using [Joyent's library](https://github.com/joyent/node-http-signature). The `http-signature` module must be installed and the keyId and key properties must be specified.

---

- `followRedirect` - follow HTTP 3xx responses as redirects. defaults to true.
- `followAllRedirects` - follow non-GET HTTP 3xx responses as redirects. defaults to false.
- `maxRedirects` - the maximum number of redirects to follow, defaults to 10.
- `removeRefererHeader` - removes the referer header when a redirect happens (default: false). Note: if true, referer header set in the initial request is preserved during redirect chain.

---

- `encoding` - Encoding to be used on setEncoding of response data. If set to null, the body is returned as a Buffer.
- `gzip` - If true, add an Accept-Encoding header to request compressed content encodings from the server (if not already present) and decode supported content encodings in the response. Note: Automatic decoding of the response content is performed on the body data returned through request (both through the request stream and passed to the callback function) but is not performed on the response stream (available from the response event) which is the unmodified http.IncomingMessage object which may contain compressed data. See example below.
- `jar` - If true, remember cookies for future use (or define your custom cookie jar; [see mikeal/request's examples](https://github.com/mikeal/request#examples)). To get either of these functions working you'll need to install an optional dependecy `npm i tough-cookie`.

---

- `agent` - http(s).Agent instance to use
- `agentClass` - alternatively specify your agent's class name
- `agentOptions` - and pass its options. Note: for HTTPS see [tls API doc for TLS/SSL options](http://nodejs.org/api/tls.html#tls_tls_connect_options_callback) and the [request.js docs](https://github.com/request/request#using-optionsagentoptions)
- `pool` - An object describing which agents to use for the request. If this option is omitted the request will use the global agent (as long as your options allow for it). Otherwise, request will search the pool for your custom agent. If no custom agent is found, a new agent will be created and added to the pool. Note: pool is used only when the agent option is not specified.
  - A maxSockets property can also be provided on the pool object to set the max number of sockets for all agents created (ex: pool: {maxSockets: Infinity}).
  - Note that if you are sending multiple requests in a loop and creating multiple new pool objects, maxSockets will not work as intended. To work around this, either use request.defaults with your pool options or create the pool object with the maxSockets property outside of the loop.
- `timeout` - Integer containing the number of milliseconds to wait for a request to respond before aborting the request

---

- `localAddress` - Local interface to bind for network connections.
- `proxy` - An HTTP proxy to be used. Support proxy Auth with Basic Auth the same way it's supported with the url parameter by embedding the auth info in the uri.
- `strictSSL` - Set to true to require that SSL certificates be valid. Note: to use your own certificate authority, you need to specify an agent that was created with that ca as an option.
- `tunnel` - controls the behavior of [HTTP CONNECT tunneling](https://en.wikipedia.org/wiki/HTTP_tunnel#HTTP_CONNECT_tunneling) as follows:
  - `undefined` (default) - true if the destination is https, false otherwise
  - `true` - always tunnel to the destination by making a CONNECT request to the proxy
  - `false` - request the destination as a GET request.
- `proxyHeaderWhiteList` - A whitelist of headers to send to a tunneling proxy.
- `proxyHeaderExclusiveList` - A whitelist of headers to send exclusively to a tunneling proxy and not to destination.
There are a few optional dependencies you'll need to install to get certain functionality from this module.

---

- `time` - If true, the request-response cycle (including all redirects) is timed at millisecond resolution, and the result provided on the response's elapsedTime property.
- `har` - A [HAR 1.2 Request Object](http://www.softwareishard.com/blog/har-12-spec/#request), will be processed from HAR format into options overwriting matching values (see the [HAR 1.2 section](https://github.com/request/request#support-for-har-1.2) for details)

- if you wish to use cookies (`jar`) install `tough-cookie`
- if you want to pass `multipart/form-data` you'll need to install `form-data`
- if you wish to tunnel your requests install `tunnel-agent`
- if you want to use Joyent's HTTP Signature Scheme, install `http-signature`
- if you require oauth signing, you need to install the `oauth-sign` module
- to use Hawk signing, you must use the `hawk` module
- if you want to use AWS signing, you must install the `aws-sign2` module

#### Google Closure
In this example, we're using google's closure service to compile a JS file.

```js
grunt.initConfig({
  http: {
    closure: {
      options: {
        url: 'http://closure-compiler.appspot.com/compile',
        method: 'POST',
        form: {
          output_info: 'compiled_code',
          output_format: 'text',
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          warning_level: 'default'
        },
        sourceField: 'form.js_code'
      },
      files: {
        'build/main.js': 'src/main.js'
      }
    }
  }
});
```

#### multipart/form-data
In this example we're going to access the form data object directly to add an image to the POST fields.

*Note, you need to install the `form-data` package before you can use this method.*

```js
var path = require('path');

grunt.initConfig({
  http: {
    multipart: {
      options: {
        url: 'http://posttestserver.com/post.php?dir=grunt-http',
        method: 'POST',
        form: function (form) {
          form.append('file', grunt.file.read(path.join(__dirname, 'images', 'pic.png')));
        }
      }
    }
  }
});
```

#### Multiple target
This is just a reminder of how to use Grunt's multiple task syntax which is also available in `grunt-http`. If you want to specify more than one task you can list them like so:

```js
grunt.initConfig({
  http: {
    myFirstService: {
      options: {
        url: 'http://my-first-url.com'
      }
    },
    mySecondService: {
      options: {
        url: 'http://my-second-url.com'
      }
    },
    myThirdService: {
      options: {
        url: 'http://my-third-url.com'
      }
    }
  }
});
```

With the above configuration you can call all 3 services with one command `grunt http`. Or, if you just want to call one; `grunt http:mySecondService`.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## [Release History](/johngeorgewright/grunt-http/releases)
