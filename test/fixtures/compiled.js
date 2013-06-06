var request=require("request");
module.exports=function(b){b.registerMultiTask("http","Sends a HTTP request and deals with the response.",function(){var a=this.data,e=this.async(),d=!1;a.dest&&(d=a.dest,delete a.dest);a.url||b.fail.fatal("The http task requires a URL");b.log.subhead("Request");b.log.writeln(JSON.stringify(a,null,2));var f=d;request(a,function(a,c,d){b.log.subhead("Response");if(a)return b.fail.fatal(a),e(a);if(200>c.statusCode||299<c.statusCode)return b.fail.fatal(c.statusCode),e(c.statusCode);b.log.ok(c.statusCode);
f&&b.file.write(f,d);e()})})};
