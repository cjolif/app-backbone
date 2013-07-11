// we use 'define' and not 'require' to workaround Dojo build system limitation that prevents from making of this file
// a layer if it using 'require' (see: https://bugs.dojotoolkit.org/ticket/16905)
define.amd.jQuery = true;
define(["jquery", "underscore", "dojo/json", "dojo/text!appbackbone/client.json", "dojox/app/main", "dojox/mobile/common"],
	function($, _, json, config, Application, common){
	Application(json.parse(config));
});