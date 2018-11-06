
eon.endpoint = function (type, url) {
  var el = this;
  /* Endpoint standard type */
  this.type = type;
  /* Resources root url */
  this.composedURL = "";
  /* Resources url */
  this.url = url;
  /* GraphQL Web Sockets based use only */
  this.socket = type == "graphSockets" && !this.socket ? new WebSocket(this.url) : this.socket;

  /* 
      ##########
      Functions
      ##########
  */

  // -- REST API --

  /*
    @function get
    @description Read data resource // Read all data resources
  */
  this.get = type == "rest" ? function (id, cb) {
    // Check resource id and set url
    el.composedUrl = el.url;
    el.composedUrl += id ? "/" + id : "";
    // Set up request
    var options = {
      method: "GET"
    };
    // Send request
    eon.ajax(el.composedUrl, options, cb);
  } : "";
  /*
    @function put
    @description Overwrite data resource // create if not exists
  */
  this.put = type == "rest" ? function (id, data, cb) {
    // Check resource id and set url
    el.composedUrl = el.url;
    el.composedUrl += id ? "/" + id : "";
    if (id) {
      // Set up request
      var options = {
        method: "PUT",
        payload: data
      };
      // Send request
      eon.ajax(el.composedUrl, options, cb);
    } else {
      console.error('No resource id found');
    }
  } : "";
  /*
    @function post
    @description Create data resource
  */
  this.post = type == "rest" ? function (data, cb) {
    // Check resource id and set url
    if (data) {
      // Set up request
      var options = {
        method: "POST",
        payload: data
      };
      // Send request
      eon.ajax(el.url, options, cb);
    } else {
      console.error('No resource data found');
    }
  } : "";
  /*
    @function delete
    @description Delete data resource
  */
  this.delete = type == "rest" ? function (id, cb) {
    // Check resource id and set url
    el.composedUrl = el.url;
    el.composedUrl += id ? "/" + id : "";
    if (id) {
      // Set up request
      var options = {
        method: "DELETE"
      };
      // Send request
      eon.ajax(el.composedUrl, options, cb);
    } else {
      console.error('No resource id found');
    }
  } : "";

  // -- GraphQL --

  /*
    @function send
    @description Query data source
  */
  this.send = type == "graphHTTP" ? function (queryString, cb) {
    el.query(queryString, cb);
  } : "";
  /*
    @function query
    @description Query data source
  */
  this.query = type == "graphHTTP" ? function (queryString, cb) {
    graphHTTPQuery(queryString, cb);
  } : "";
  /*
    @function mutation
    @description Update data source
   */
  this.mutation = type == "graphHTTP" ? function (queryString, cb) {
    graphHTTPMutation(queryString, cb);
  } : "";
  /*
    @function subscribe
    @description Subscribe
   */
  this.subscribe = type == "graphSockets" ? function (queryString, cb) {
    // Check graphQL protocol based on
    graphSocketsSubscription(queryString, cb);
  } : "";

  /* 
      #################
      Private Functions
      #################
  */

  // -- GraphQL HTTP API --

  // Query call HTTP based
  function graphHTTPQuery(queryString, cb) {
  
    // Validate query string 
    if (queryString) {
      // Set up request
      var options = {
        method: "GET",
        contentType: "application/json",
        payload: "query:" +  queryString
      };
      console.log('options', options.payload);
      // Send request
      eon.ajax(el.url, options, cb);
    }
  }
  // Mutation call HTTP based
  function graphHTTPMutation(queryString, cb) {
    // Validate mutation string 
    if (queryString) {
      // Set up request
      var options = {
        method: "POST",
        payload: "mutation:" + queryString
      };
      // Send request
      eon.ajax(el.url, options, cb);
    }
  }

  // -- GraphQL Web Sockets API --

  // Query call Web sockets based
  function graphSocketsSubscription(queryString, cb) {
    // Server response listener
    el.socket.onmessage = function (event) {
      // TODO Handle response messages
      cb(true, event);
    };
    el.socket.send("subscription:" + queryString);
  }
}