define({

	loaderOptions: {
		// Packages that should be registered with the loader in each testing environment
		packages: [
			{ name: "tests", location: "./../tests" }
		]
	},

	// Unit test suite(s) to run in node
	suites: [
		"dojo/has!host-node?tests/unit/test1.js"
	],

	// Functional test suite(s) to execute against each browser once unit tests are completed
	functionalSuites: [

	],

	// https://theintern.io/intern/#reporter-results
	// https://theintern.io/intern/#custom-reporters
	reporters: [
		// { id: "Pretty" },
		{ id: "console" },
		{ id: 'JUnit', filename: '../tests/report.xml' }
	],

	excludeInstrumentation: /^(?:tests|node_modules)\//

});
