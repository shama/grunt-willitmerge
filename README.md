# Grunt? Will it merge?

A Grunt plugin to check if open Github pull requests are merge-able. If yes,
option to merge the pull request. If no, option to notify the pull requester
their request cannot be merged.

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

If you would like to notify the pull requester with a comment that their
pull request is unmergeable; use the following task options:

```javascript
willitmerge: {
  options: {
    auth: '<json:github_auth.json>',
    comment: 'Sorry, your pull request is unmergeable. ' +
      'Could you please rebase, squash and force push it? Thanks!'
  }
}
```

Your auth info *should* be in a separate git ignored file, e.g.
`github_auth.json` and would look like this:

```json
{
  "username": "myuser",
  "password": "1234"
}
```

#### Skipping Issues

If you would like to skip certain issues use the `ignore` option:

```javascript
willitmerge: {
  options: {
    ignore: [123, 99, 111]
  }
}
```

#### Repo and User

The repo and user of the github project are discovered from the `repository.url`
setting in your `package.json`.

## Included Helpers

### github([auth], callback(err, github))

Access the Github v3 API:
[node-github docs](http://ajaxorg.github.com/node-github/) and the
[github docs](http://developer.github.com/v3/).

```javascript
var auth = {username: 'shama', password: '1234'};
grunt.helper('github', auth, function(err, github) {
  if (err) { throw err; }
  // Use github to access the API
});
```

### github-post-comment(data, callback(err, response))

Post a comment on a github issue. Auth is required; be sure to auth with the
`github` helper above first.

```javascript
var data = {
  user: 'repo user',
  repo: 'repo name',
  number: 123,
  body: 'Hello!'
});
grunt.helper('github-post-comment', data, function(err, res) {
  if (err) { throw err; }
  // Do something after comment posted
});
```

## Contributing

Please open an issue or send a pull request. Thanks!

## Release History

* 0.1.0 Create willitmerge task

## License

Copyright (c) 2012 Kyle Robinson Young
Licensed under the MIT license.
