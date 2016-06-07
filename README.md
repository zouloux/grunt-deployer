# Grunt Deployer

Grunt plugin deploying files with versions and specific parameters. Can also produce dynamic file names from config.

### Config example
```
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
		// If not provided, will not increment
		// By default, patch number is incremented
		// Pass --minor in your CLI to increment minor number
		// Pass --major in your CLI to increment major number
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

	local: {
		properties: {
			baseURL : '/local/base/path/'
		}
	},
	preprod: {
		properties: {
			baseURL : '/preprod/base/path/'

			// Override common property
			specName : 'preprod-specTestName'
		}
	},
	prod: {
		properties: {
			baseURL : '/'

			bddLogin: 'prod',
			bddLogin: '!p@$$W0rD!'
		}
	}
}
```


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


### Version

Incremented version file is injected in properties with key "version". Usefull for destination files or to track version in your runtime.