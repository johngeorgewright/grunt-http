# grunt-http

> Sends a HTTP request and deals with the response.

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
      url: 'your/url.com',
      dest: 'optional/file/to/save/response'
    }
  }
})
```

### Options

- `uri || url` - fully qualified uri or a parsed url object from url.parse(). REQUIRED.
- `dest` - A destination file to save the response.
- `qs` - object containing querystring values to be appended to the uri
- `method` - http method, defaults to GET
- `headers` - http headers, defaults to {}
- `body` - entity body for PATCH, POST and PUT requests. Must be buffer or string.
- `form` - when passed an object this will set body but to a querystring representation of value and adds Content-type: application/x-www-form-urlencoded; charset=utf-8 header. When passed no option a FormData instance is returned that will be piped to request.
- `auth` - A hash containing values user || username, password || pass, and sendImmediately (optional). See documentation above.
- `json` - sets body but to JSON representation of value and adds Content-type: application/json header. Additionally, parses the response body as json.
- `multipart` - (experimental) array of objects which contains their own headers and body attribute. Sends multipart/related request. See example below.
- `followRedirect` - follow HTTP 3xx responses as redirects. defaults to true.
- `followAllRedirects` - follow non-GET HTTP 3xx responses as redirects. defaults to false.
- `maxRedirects` - the maximum number of redirects to follow, defaults to 10.
- `encoding` - Encoding to be used on setEncoding of response data. If set to null, the body is returned as a Buffer.
- `pool` - A hash object containing the agents for these requests. If omitted this request will use the global pool which is set to node's default maxSockets.
- `pool.maxSockets` - Integer containing the maximum amount of sockets in the pool.
- `timeout` - Integer containing the number of milliseconds to wait for a request to respond before aborting the request
- `proxy` - An HTTP proxy to be used. Support proxy Auth with Basic Auth the same way it's supported with the url parameter by embedding the auth info in the uri.
- `oauth` - Options for OAuth HMAC-SHA1 signing, see documentation above.
- `hawk` - Options for Hawk signing. The credentials key must contain the necessary signing info, see hawk docs for details.
- `strictSSL` - Set to true to require that SSL certificates be valid. Note: to use your own certificate authority, you need to specify an agent that was created with that ca as an option.
- `jar` - Set to false if you don't want cookies to be remembered for future use or define your custom cookie jar (see examples section)
- `aws` - object containing aws signing information, should have the properties key and secret as well as bucket unless you're specifying your bucket as part of the path, or you are making a request that doesn't use a bucket (i.e. GET Services)
- `httpSignature` - Options for the HTTP Signature Scheme using Joyent's library. The keyId and key properties must be specified. See the docs for other options.
- `localAddress` - Local interface to bind for network connections.

### Usage Examples

#### Google Closure
In this example, we're using google's closure service to compile a JS file.

```js
grunt.initConfig({
  http: {
    closure: {
      url: 'http://closure-compiler.appspot.com/compile',
      method: 'POST',
      form: {
        output_info: 'compiled_code',
        output_format: 'text',
        compilation_level: 'SIMPLE_OPTIMIZATIONS',
        warning_level: 'default',
        js_code: grunt.file.read('src/main.js')
      },
      dest: 'build/main.js'
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
v0.0.1 - Initial release
v0.0.2 - Fixing debugging problems
