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

- `uri || url` - fully qualified uri or a parsed url object from url.parse(). REQUIRED.
- `callback` - A function that will receive an `error`, `response` and `body`, after a response if finished
- `qs` - object containing querystring values to be appended to the uri
- `method` - http method, defaults to GET
- `headers` - http headers, defaults to {}
- `body` - entity body for PATCH, POST and PUT requests. Must be buffer or string or a function returning a string or buffer.
- `sourceField` - A field in the body or form to add the source files' contents to. Can contain full stops to separate object path. Ie "form.js\_code".
- `form` - When passed an object, this sets body to a querystring representation of value, and adds Content-type: application/x-www-form-urlencoded; charset=utf-8 header. When passed no options, a FormData instance is returned (and is piped to request). For `multipart/form-data` install the optional dependency `npm i form-data`.
- `auth` - A hash containing values user || username, password || pass, and sendImmediately (optional). [See more info here](https://github.com/mikeal/request#http-authentication).
- `json` - sets body but to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as json. Must be buffer or string or a function returning a string or buffer.
- `multipart` - (experimental) array of objects which contains their own headers and body attribute. Sends multipart/related request. See example below.
- `followRedirect` - follow HTTP 3xx responses as redirects. defaults to true.
- `followAllRedirects` - follow non-GET HTTP 3xx responses as redirects. defaults to false.
- `maxRedirects` - the maximum number of redirects to follow, defaults to 10.
- `encoding` - Encoding to be used on setEncoding of response data. If set to null, the body is returned as a Buffer.
- `pool` - A hash object containing the agents for these requests. If omitted this request will use the global pool which is set to node's default maxSockets.
- `pool.maxSockets` - Integer containing the maximum amount of sockets in the pool.
- `timeout` - Integer containing the number of milliseconds to wait for a request to respond before aborting the request
- `proxy` - An HTTP proxy to be used. Support proxy Auth with Basic Auth the same way it's supported with the url parameter by embedding the auth info in the uri.
- `oauth` - Options for OAuth HMAC-SHA1 signing. [See more info here](https://github.com/mikeal/request#oauth-signing). The `oauth-sign` module must be installed to use this functionality.
- `hawk` - Options for [Hawk signing](https://github.com/hueniverse/hawk). The credentials key must contain the necessary signing info, [see hawk docs for details](https://github.com/hueniverse/hawk#usage-example). You will need to install the `hawk` module to use this functionality.
- `strictSSL` - Set to true to require that SSL certificates be valid. Note: to use your own certificate authority, you need to specify an agent that was created with that ca as an option.
- `jar` - If true, remember cookies for future use (or define your custom cookie jar; [see mikeal/request's examples](https://github.com/mikeal/request#examples)). To get either of these functions working you'll need to install an optional dependecy `npm i tough-cookie`.
- `aws` - object containing aws signing information, should have the properties key and secret as well as bucket unless you're specifying your bucket as part of the path, or you are making a request that doesn't use a bucket (i.e. GET Services). You will need to install the `aws-sign2` module to use this functionality.
- `httpSignature` - Options for the [HTTP Signature Scheme](https://github.com/joyent/node-http-signature/blob/master/http_signing.md) using [Joyent's library](https://github.com/joyent/node-http-signature). The `http-signature` module must be installed and the keyId and key properties must be specified.
- `localAddress` - Local interface to bind for network connections.
- `ignoreErrors` - Ignore the status code returned (if any).

There are a few optional dependencies you'll need to install to get certain functionality from this module.

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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## [Release History](/johngeorgewright/grunt-http/releases)

