# How to contribute?

If you would like to contribute, simply fork the repository, push your changes and send a pull request. We'll do our best to review your changes and include them in the master branch.

# How to report a bug?

If you find a bug, an error, or something that doesn't work as expected, please open an issue on the GitHub repository with the following information:

- Title: A short description of the issue.
- Description: A detailed description of the issue and suggestions for the fix if any.
- Steps to reproduce: How to reproduce the issue.
- Expected behavior: What you expect to happen.
- Actual behavior: What actually happens.
- Version of Wordpress: The version of Wordpress where the issue was found.
- Version of the plugin: The version of the scrippet plugin where the issue was found.
- Screnshots: If applicable, add screenshots to help explain the issue.
- Operating system: The operating system you are using.
- Browser: The browser you are using.

# How to request a feature?

If you have a feature request, please open an issue on the GitHub repository with the following information:

- Title: A short description of the feature.
- Description: A detailed description of the feature.
- Use case: How the feature would be used.
- Screenshots: If applicable, add screenshots to help explain the feature.
- Mockups: If applicable, add mockups to help explain the feature.


# How to test the plugin?

If you would like to test the plugin, you can download the latest version from the [releases page](

- do a `git clone` of the repository
- run `npm install` to install the dependencies
- run the Wordpress test environment with `wp-env start`, this will give you the URL to access the Wordpress instance:
```
$ wp-env start
WordPress development site started at http://localhost:8888
WordPress test site started at http://localhost:8889
MySQL is listening on port 60193
MySQL for automated testing is listening on port 60280
```
- the plugin will be available at `http://localhost:8889/wp-admin/plugins.php`


