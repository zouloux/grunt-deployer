# grunt-deployer

> Grunt plugin deploying files with versions and specific parameters. Can also produce dynamic file names from config.


### About

This plugin is used in [solid web-base](https://github.com/solid-js/web-base), a grunt boilerplate for solid web applications.

The plugin is a lot about config so we recommand using [grunt-minimal-config](https://github.com/zouloux/grunt-minimal-config)


### Config example

```javascript
deployer: {
	options: {
		// Files we need to process
		// Keep it simple, no expand
		files: [
			{
				src: '{= path.deploymentFiles }.htaccess',
				dest: '{= path.deploy }.htaccess'
			},
			{
				src: '{= path.deploymentFiles }.spec',

				// Note that templating works in detination files !
				dest: '{= path.deploy }%%specName%%.spec'
			}
		],

		// Auto-incremented version file (this file have to be semver formated, ex : "0.1.0")
		// By default, version is not modified.
		// Pass --patch in your CLI to increment patch number
		// Pass --minor in your CLI to increment minor number
		// Pass --major in your CLI to increment major number
		// Semver format : major.minor.patch
		versionFile: '{= path.deploymentFiles }version',

		// Delimiters (use regex notation)
		// Use only if you really need
		// delimiters: ['\%\%', '\%\%'],

		// Properties common for all targets
		properties: {
			specName : 'specTestName',
			bddLogin: 'root',
			bddPassword: ''
		}
	},

	// This task is only here to bump version but does deploy anything
	// To just increment and deploy nothing :
	// grunt deployer:increment --patch
	increment: { },

	// Different environment examples with different properties :

	// grunt deployer:local
	local: {
		properties: {
			baseURL : '/local/base/path/'
		}
	},

	// grunt deployer:staging
	staging: {
		properties: {
			baseURL : '/staging/base/path/'

			// Override common property
			specName : 'staging-specTestName'
		}
	},

	// grunt deployer:production
	production: {
		properties: {
			baseURL : '/'

			bddLogin: 'production',
			bddLogin: '!p@$$W0rD!'
		}
	}
}
```


### Version

Incremented version file is injected in properties with key "version". Usefull for destination files or to track version in your runtime.


### Templating
By default delimiters are `%%myVar%%`.

Exemple for the .htaccess file :
```
## Version %%version%%
RewriteBase %%baseURL%%
```

With the previous config, if you pass `grunt deployer:local` in your CLI, the output file will be :

```
## Version 0.1.2
RewriteBase /local/base/path/
```


### Usage

Deploy for local env, no version increment :
```
grunt deployer:local
```

Deploy for local env, incrementing patch (0.0.X) :
```
grunt deployer:local --patch
```

Deploy for pre-production env, incrementing minor (0.X.0)
```
grunt deployer:preprod --minor
```

Deploy for production env, incrementing major (X.0.0)
```
grunt deployer:prod --major
```

Deploy for production, without incrementing
```
grunt deployer:preprod
```

Deploy nothing but just bump version number
```
grunt deployer:increment --minor
```