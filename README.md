# Grunt? Will it merge?

A Grunt plugin to check if open Github pull requests are merge-able. Uses the
command line tool [willitmerge](http://github.com/shama/willitmerge).

![willitmerge sample](http://dontkry.com/img/willitmerge.png)

## Getting Started

Install this grunt plugin next to your project's [Gruntfile][getting_started]
with: `npm install grunt-willitmerge`

Then add this line to your project's Gruntfile:

```javascript
grunt.loadNpmTasks('grunt-willitmerge');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Included Task

### willitmerge

Add the task: `willitmerge: {}` to your gruntfile and run
`grunt willitmerge`.

#### Skipping Issues

If you would like to skip certain issues use the `ignore` option:

```javascript
willitmerge: {
  ignore: [123, 99, 111]
}
```

All the options from `willitmerge` are available.

## Contributing

Please open an issue or send a pull request. Thanks!

## Release History

* 0.3.0 Grunt v0.4 support.
* 0.2.0 Become wrapper for willitmerge tool
* 0.1.3 Restructure willitmerge task and minor fixes
* 0.1.2 Fix path issues
* 0.1.1 Remove unwanted helper
* 0.1.0 Create willitmerge task

## License

Copyright (c) 2016 Kyle Robinson Young

Licensed under the MIT license.
