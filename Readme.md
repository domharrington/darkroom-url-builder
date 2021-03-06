# Darkroom URL builder

[![Build Status](https://travis-ci.org/bengourley/darkroom-url-builder.png)](https://travis-ci.org/bengourley/darkroom-url-builder)

A module that builds URLs for your darkroom resources.

## Installing

```
npm install darkroom-url-builder
```

```js
var createDarkroomUrlBuilder = require('darkroom-url-builder')
```

## API

### var builder = createDarkroomUrlBuilder(darkroomUrl, salt)

Returns a function that creates URL builder instances. `darkroomUrl` and `salt`
are required, as these are both used in the composition of the URLs.

### var b = builder()

Create a new URL builder instance. Every time you want to build a new URL, you
start with this function.

### b.resource(String:uri)

Set the resource you want a URL for. This is the URI that darkroom gave you when you posted
or cropped your asset.

Returns `b` for chaining.

### b.width(Number:n) (optional)

Set the width of the asset you want to receive.

Returns `b` for chaining.

### b.height(Number:n) (optional)

Set the height of the asset you want to receive.

Returns `b` for chaining.

### b.filename(String:name) (optional)

Set the filename of the asset you want to recieve. This is for vanity of the URL
and has no bearing on the response format or content-type headers.

Returns `b` for chaining.

### b.url()

Builds a URL pointing to the `resource` described by the combination of `width`, `height`
`filename` settings. If `width` and `height` are not set, the URL will point to the original
resource, otherwise it will be constrained in one or both dimensions.

Note that darkroom will not distort the resource beyond its original aspect ratio. If you set
`width` and `height` to something other than the original aspect ratio, you have no control of
what part of the image is cropped. You should use the darkroom cropping API to create a new resource
and create a URL for that instead.

Darkroom will only constrain images to the dimensions, it will not upscale. e.g.: if the original
resource is 400px wide, asking for an 800px will return an image no bigger than 400px.

### b.info()

Builds a URL that points to a JSON endpoint describing the resource's dimensions.

## Example usage:

```js
var createDarkroomUrlBuilder = require('darkroom-url-builder')
  , builder = createDarkroomUrlBuilder('http://darkroom.io', 'salty')

var thumb = builder()
  .resource('00000000000000000000000000000000')
  .width(100)
  .filename('test.jpeg')
  .url()

console.log(thumb)
//-> http://darkroom.io/100/00000000000000000000000000000000:2f314341b9d1d41f1b54b07be8d0cd1a/test.jpeg

var original = builder()
  .resource('00000000000000000000000000000000')
  .filename('test.jpeg')
  .url()

console.log(original)
//-> http://darkroom.io/original/00000000000000000000000000000000:9f847ee652ef4eed45a39625ef30193f/test.jpeg

var info = builder()
  .resource('0b8bafa96885483bc2778976a514334e')
  .info()

console.log(info)
//-> http://darkroom.io/info/0b8bafa96885483bc2778976a514334e:bc2afc01898e3b8e2613793be6cd7598
```

## Tests

Run the tests with `npm test`. Generate a coverage report with `npm test --coverage`.

## CLI API
`darkroom-url-builder` also comes with a tiny command line application to save you from having to spin
up a node REPL to get the URL of an image. 

### Usage: `darkroom-url-builder darkroomUrl salt uri`

```
$ darkroom-url-builder http://0.0.0.0:17999 salt f113b531524b64968a21be183307c7b7
http://0.0.0.0:17999/original/f113b531524b64968a21be183307c7b7:70615591bd5472c9a9ffff9396b7ba20
```
