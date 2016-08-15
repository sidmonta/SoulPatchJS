# SoulPatchJS

> A simple PJAX library ispirated from most complete [Barba.js](http://barbajs.org/) library

## Description
The library implement a very tiny (less then 1.1KB gzip) an easy method for transation from view with PJAX method.

## Usage

Import the library at the end of document:
```html
<script defer src="soulpatch.min.js"></script>
```

Set container of the views:
```html
<div sp-container>
  ... container div ...
</div>
```

Now set all the link that it will use for PJAX transations.

```html
<a sp-href="url-to-other-view">Other View</a>
```

That's it. You are done!

For create the transition, during the change of view in the ```sp-container``` I add the class ```.loading```.

## Demo
A demo is avaible in demo directory. For use you need a simple server; you can run it in demo directory with:
```sh
> python -m SimpleHTTPServer 8000
```
