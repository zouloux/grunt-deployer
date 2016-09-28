module.exports = function (pGrunt)
{
	pGrunt.registerMultiTask('deployer', 'Deploy files', function ()
	{
		// Get options
		var options = this.options({

			// Files to process
			files: [],

			// By default, do not process version
			versionFile: false,

			// Delimiters (use regex notation)
			delimiters: ['\%\%', '\%\%'],

			// Properties to patch
			properties: {}
		});

		// Create our regex
		var templateRegex = new RegExp(options.delimiters[0] + '(.*?)' + options.delimiters[1], 'g');

		// Quick and dirty template method
		function quickTemplate (pTemplate, pValues)
		{
			return pTemplate.replace(templateRegex, function(i, pMatch) {
				return pValues[pMatch];
			});
		}

		var i;

		// Combine properties from common and target
		var properties = {};
		for (i in options.properties)
		{
			properties[i] = options.properties[i];
		}
		for (i in this.data.properties)
		{
			properties[i] = this.data.properties[i];
		}

		// Combine files from common and target
		var files = [];
		for (i in options.files)
		{
			files.push(options.files[i]);
		}
		for (i in this.data.files)
		{
			files.push(this.data.files[i]);
		}

		// If we have a version file, proceed to incrementation
		if (options.versionFile != false)
		{
			// Update will tell us if we have to increment minor, major or path
			var updateIndex = 2;

			// Get process parameters
			for (i in process.argv)
			{
				if (process.argv[i] == '--minor') updateIndex = 1;
				if (process.argv[i] == '--major') updateIndex = 0;
				if (process.argv[i] == '--no-increment') updateIndex = Math.POSITIVE_INFINITY;
			}

			// Load version file
			var versionFileContent = pGrunt.file.read(options.versionFile);

			// Convert to semver
			var splittedSemver = versionFileContent.split('.');

			// Check semver
			if (splittedSemver.length != 3)
			{
				pGrunt.fail.fatal('Version file contains an invalid sem-ver formated version. Please use sem-ver ("major.minor.patch" Ex : "1.0.32")');
			}

			// Browse our semver
			for (var semverIndex in splittedSemver)
			{
				// Update selected semver index
				if (semverIndex == updateIndex)
				{
					splittedSemver[semverIndex] = parseFloat(splittedSemver[semverIndex]) + 1;
				}

				// Reset after
				else if (semverIndex > updateIndex)
				{
					splittedSemver[semverIndex] = 0;
				}
			}

			// Rebuild new version
			versionFileContent = splittedSemver.join('.');

			// Save file
			pGrunt.file.write(options.versionFile, versionFileContent);

			// Notify
			pGrunt.log.ok('New version : ', versionFileContent);

			// Add version to the properties bag
			properties.version = versionFileContent;
		}

		// Browse files
		var currentFile;
		var fileContent;
		var fileDestination;
		for (var i in files)
		{
			// Target file
			currentFile = files[i];

			// src and dest are requirements, no expand
			if (!('src' in currentFile) || !('dest' in currentFile) )
			{
				pGrunt.fail.fatal('`src` and `dest` properties are mandatory for each file.');
			}

			// Load file
			fileContent = pGrunt.file.read(currentFile.src);

			// Replace placeholders with properties
			fileContent = quickTemplate(fileContent, properties);

			// Template destination file name
			fileDestination = quickTemplate(currentFile.dest, properties);

			// Write file with template in filename
			pGrunt.file.write(fileDestination, fileContent);
		}

		pGrunt.log.ok(files.length + ' files deployed !');
	});
};
