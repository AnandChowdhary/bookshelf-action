require('./sourcemap-register.js');module.exports =
/******/ (function(modules, runtime) { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	__webpack_require__.ab = __dirname + "/";
/******/
/******/ 	// the startup function
/******/ 	function startup() {
/******/ 		// Load entry module and return exports
/******/ 		return __webpack_require__(429);
/******/ 	};
/******/ 	// initialize runtime
/******/ 	runtime(__webpack_require__);
/******/
/******/ 	// run startup
/******/ 	return startup();
/******/ })
/************************************************************************/
/******/ ({

/***/ 8:
/***/ (function(module, __unusedexports, __webpack_require__) {

var os = __webpack_require__(87);
var common = __webpack_require__(602);

common.register('cd', _cd, {});

//@
//@ ### cd([dir])
//@
//@ Changes to directory `dir` for the duration of the script. Changes to home
//@ directory if no argument is supplied.
function _cd(options, dir) {
  if (!dir) dir = os.homedir();

  if (dir === '-') {
    if (!process.env.OLDPWD) {
      common.error('could not find previous directory');
    } else {
      dir = process.env.OLDPWD;
    }
  }

  try {
    var curDir = process.cwd();
    process.chdir(dir);
    process.env.OLDPWD = curDir;
  } catch (e) {
    // something went wrong, let's figure out the error
    var err;
    try {
      common.statFollowLinks(dir); // if this succeeds, it must be some sort of file
      err = 'not a directory: ' + dir;
    } catch (e2) {
      err = 'no such file or directory: ' + dir;
    }
    if (err) common.error(err);
  }
  return '';
}
module.exports = _cd;


/***/ }),

/***/ 9:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(49);

var noop = function() {};

var isRequest = function(stream) {
	return stream.setHeader && typeof stream.abort === 'function';
};

var isChildProcess = function(stream) {
	return stream.stdio && Array.isArray(stream.stdio) && stream.stdio.length === 3
};

var eos = function(stream, opts, callback) {
	if (typeof opts === 'function') return eos(stream, null, opts);
	if (!opts) opts = {};

	callback = once(callback || noop);

	var ws = stream._writableState;
	var rs = stream._readableState;
	var readable = opts.readable || (opts.readable !== false && stream.readable);
	var writable = opts.writable || (opts.writable !== false && stream.writable);
	var cancelled = false;

	var onlegacyfinish = function() {
		if (!stream.writable) onfinish();
	};

	var onfinish = function() {
		writable = false;
		if (!readable) callback.call(stream);
	};

	var onend = function() {
		readable = false;
		if (!writable) callback.call(stream);
	};

	var onexit = function(exitCode) {
		callback.call(stream, exitCode ? new Error('exited with error code: ' + exitCode) : null);
	};

	var onerror = function(err) {
		callback.call(stream, err);
	};

	var onclose = function() {
		process.nextTick(onclosenexttick);
	};

	var onclosenexttick = function() {
		if (cancelled) return;
		if (readable && !(rs && (rs.ended && !rs.destroyed))) return callback.call(stream, new Error('premature close'));
		if (writable && !(ws && (ws.ended && !ws.destroyed))) return callback.call(stream, new Error('premature close'));
	};

	var onrequest = function() {
		stream.req.on('finish', onfinish);
	};

	if (isRequest(stream)) {
		stream.on('complete', onfinish);
		stream.on('abort', onclose);
		if (stream.req) onrequest();
		else stream.on('request', onrequest);
	} else if (writable && !ws) { // legacy streams
		stream.on('end', onlegacyfinish);
		stream.on('close', onlegacyfinish);
	}

	if (isChildProcess(stream)) stream.on('exit', onexit);

	stream.on('end', onend);
	stream.on('finish', onfinish);
	if (opts.error !== false) stream.on('error', onerror);
	stream.on('close', onclose);

	return function() {
		cancelled = true;
		stream.removeListener('complete', onfinish);
		stream.removeListener('abort', onclose);
		stream.removeListener('request', onrequest);
		if (stream.req) stream.req.removeListener('finish', onfinish);
		stream.removeListener('end', onlegacyfinish);
		stream.removeListener('close', onlegacyfinish);
		stream.removeListener('finish', onfinish);
		stream.removeListener('exit', onexit);
		stream.removeListener('end', onend);
		stream.removeListener('error', onerror);
		stream.removeListener('close', onclose);
	};
};

module.exports = eos;


/***/ }),

/***/ 10:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
exports.default = (url) => {
    // Cast to URL
    url = url;
    const options = {
        protocol: url.protocol,
        hostname: is_1.default.string(url.hostname) && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
        host: url.host,
        hash: url.hash,
        search: url.search,
        pathname: url.pathname,
        href: url.href,
        path: `${url.pathname || ''}${url.search || ''}`
    };
    if (is_1.default.string(url.port) && url.port.length > 0) {
        options.port = Number(url.port);
    }
    if (url.username || url.password) {
        options.auth = `${url.username || ''}:${url.password || ''}`;
    }
    return options;
};


/***/ }),

/***/ 11:
/***/ (function(module) {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 16:
/***/ (function(module) {

module.exports = require("tls");

/***/ }),

/***/ 18:
/***/ (function(module) {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 36:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelError = exports.ParseError = void 0;
const core_1 = __webpack_require__(946);
/**
An error to be thrown when server response code is 2xx, and parsing body fails.
Includes a `response` property.
*/
class ParseError extends core_1.RequestError {
    constructor(error, response) {
        const { options } = response.request;
        super(`${error.message} in "${options.url.toString()}"`, error, response.request);
        this.name = 'ParseError';
    }
}
exports.ParseError = ParseError;
/**
An error to be thrown when the request is aborted with `.cancel()`.
*/
class CancelError extends core_1.RequestError {
    constructor(request) {
        super('Promise was canceled', {}, request);
        this.name = 'CancelError';
    }
    get isCanceled() {
        return true;
    }
}
exports.CancelError = CancelError;
__exportStar(__webpack_require__(946), exports);


/***/ }),

/***/ 48:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class WeakableMap {
    constructor() {
        this.weakMap = new WeakMap();
        this.map = new Map();
    }
    set(key, value) {
        if (typeof key === 'object') {
            this.weakMap.set(key, value);
        }
        else {
            this.map.set(key, value);
        }
    }
    get(key) {
        if (typeof key === 'object') {
            return this.weakMap.get(key);
        }
        return this.map.get(key);
    }
    has(key) {
        if (typeof key === 'object') {
            return this.weakMap.has(key);
        }
        return this.map.has(key);
    }
}
exports.default = WeakableMap;


/***/ }),

/***/ 49:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 62:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('tail', _tail, {
  canReceivePipe: true,
  cmdOptions: {
    'n': 'numLines',
  },
});

//@
//@ ### tail([{'-n': \<num\>},] file [, file ...])
//@ ### tail([{'-n': \<num\>},] file_array)
//@
//@ Available options:
//@
//@ + `-n <num>`: Show the last `<num>` lines of `file`s
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = tail({'-n': 1}, 'file*.txt');
//@ var str = tail('file1', 'file2');
//@ var str = tail(['file1', 'file2']); // same as above
//@ ```
//@
//@ Read the end of a `file`.
function _tail(options, files) {
  var tail = [];
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no paths given');

  var idx = 1;
  if (options.numLines === true) {
    idx = 2;
    options.numLines = Number(arguments[1]);
  } else if (options.numLines === false) {
    options.numLines = 10;
  }
  options.numLines = -1 * Math.abs(options.numLines);
  files = [].slice.call(arguments, idx);

  if (pipe) {
    files.unshift('-');
  }

  var shouldAppendNewline = false;
  files.forEach(function (file) {
    if (file !== '-') {
      if (!fs.existsSync(file)) {
        common.error('no such file or directory: ' + file, { continue: true });
        return;
      } else if (common.statFollowLinks(file).isDirectory()) {
        common.error("error reading '" + file + "': Is a directory", {
          continue: true,
        });
        return;
      }
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');

    var lines = contents.split('\n');
    if (lines[lines.length - 1] === '') {
      lines.pop();
      shouldAppendNewline = true;
    } else {
      shouldAppendNewline = false;
    }

    tail = tail.concat(lines.slice(options.numLines));
  });

  if (shouldAppendNewline) {
    tail.push(''); // to add a trailing newline once we join
  }
  return tail.join('\n');
}
module.exports = _tail;


/***/ }),

/***/ 72:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var universalUserAgent = __webpack_require__(422);
var beforeAfterHook = __webpack_require__(523);
var request = __webpack_require__(753);
var graphql = __webpack_require__(898);
var authToken = __webpack_require__(813);

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

const VERSION = "3.1.2";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(_objectSpread2(_objectSpread2({}, requestDefaults), {}, {
      baseUrl: requestDefaults.baseUrl.replace(/\/api\/v3$/, "/api")
    }));
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registred.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const auth = options.authStrategy(Object.assign({
        request: this.request
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 77:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = __webpack_require__(835);
const create_1 = __webpack_require__(323);
const defaults = {
    options: {
        method: 'GET',
        retry: {
            limit: 2,
            methods: [
                'GET',
                'PUT',
                'HEAD',
                'DELETE',
                'OPTIONS',
                'TRACE'
            ],
            statusCodes: [
                408,
                413,
                429,
                500,
                502,
                503,
                504,
                521,
                522,
                524
            ],
            errorCodes: [
                'ETIMEDOUT',
                'ECONNRESET',
                'EADDRINUSE',
                'ECONNREFUSED',
                'EPIPE',
                'ENOTFOUND',
                'ENETUNREACH',
                'EAI_AGAIN'
            ],
            maxRetryAfter: undefined,
            calculateDelay: ({ computedValue }) => computedValue
        },
        timeout: {},
        headers: {
            'user-agent': 'got (https://github.com/sindresorhus/got)'
        },
        hooks: {
            init: [],
            beforeRequest: [],
            beforeRedirect: [],
            beforeRetry: [],
            beforeError: [],
            afterResponse: []
        },
        cache: undefined,
        dnsCache: undefined,
        decompress: true,
        throwHttpErrors: true,
        followRedirect: true,
        isStream: false,
        responseType: 'text',
        resolveBodyOnly: false,
        maxRedirects: 10,
        prefixUrl: '',
        methodRewriting: true,
        ignoreInvalidCookies: false,
        context: {},
        // TODO: Set this to `true` when Got 12 gets released
        http2: false,
        allowGetBody: false,
        https: undefined,
        pagination: {
            transform: (response) => {
                if (response.request.options.responseType === 'json') {
                    return response.body;
                }
                return JSON.parse(response.body);
            },
            paginate: response => {
                if (!Reflect.has(response.headers, 'link')) {
                    return false;
                }
                const items = response.headers.link.split(',');
                let next;
                for (const item of items) {
                    const parsed = item.split(';');
                    if (parsed[1].includes('next')) {
                        next = parsed[0].trimStart().trim();
                        next = next.slice(1, -1);
                        break;
                    }
                }
                if (next) {
                    const options = {
                        url: new url_1.URL(next)
                    };
                    return options;
                }
                return false;
            },
            filter: () => true,
            shouldContinue: () => true,
            countLimit: Infinity,
            backoff: 0,
            requestLimit: 10000,
            stackAllItems: true
        },
        parseJson: (text) => JSON.parse(text),
        stringifyJson: (object) => JSON.stringify(object),
        cacheOptions: {}
    },
    handlers: [create_1.defaultHandler],
    mutableDefaults: false
};
const got = create_1.default(defaults);
exports.default = got;
// For CommonJS default export support
module.exports = got;
module.exports.default = got;
module.exports.__esModule = true; // Workaround for TS issue: https://github.com/sindresorhus/got/pull/1267
__exportStar(__webpack_require__(323), exports);
__exportStar(__webpack_require__(577), exports);


/***/ }),

/***/ 82:
/***/ (function(__unusedmodule, exports) {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 87:
/***/ (function(module) {

module.exports = require("os");

/***/ }),

/***/ 89:
/***/ (function(module) {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProps = [
	'destroy',
	'setTimeout',
	'socket',
	'headers',
	'trailers',
	'rawHeaders',
	'statusCode',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'rawTrailers',
	'statusMessage'
];

module.exports = (fromStream, toStream) => {
	const fromProps = new Set(Object.keys(fromStream).concat(knownProps));

	for (const prop of fromProps) {
		// Don't overwrite existing properties
		if (prop in toStream) {
			continue;
		}

		toStream[prop] = typeof fromStream[prop] === 'function' ? fromStream[prop].bind(fromStream) : fromStream[prop];
	}
};


/***/ }),

/***/ 93:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = minimatch
minimatch.Minimatch = Minimatch

var path = { sep: '/' }
try {
  path = __webpack_require__(622)
} catch (er) {}

var GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {}
var expand = __webpack_require__(306)

var plTypes = {
  '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
  '?': { open: '(?:', close: ')?' },
  '+': { open: '(?:', close: ')+' },
  '*': { open: '(?:', close: ')*' },
  '@': { open: '(?:', close: ')' }
}

// any single thing other than /
// don't need to escape / when using new RegExp()
var qmark = '[^/]'

// * => any number of characters
var star = qmark + '*?'

// ** when dots are allowed.  Anything goes, except .. and .
// not (^ or / followed by one or two dots followed by $ or /),
// followed by anything, any number of times.
var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?'

// not a ^ or / followed by a dot,
// followed by anything, any number of times.
var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?'

// characters that need to be escaped in RegExp.
var reSpecials = charSet('().*{}+?[]^$\\!')

// "abc" -> { a:true, b:true, c:true }
function charSet (s) {
  return s.split('').reduce(function (set, c) {
    set[c] = true
    return set
  }, {})
}

// normalizes slashes.
var slashSplit = /\/+/

minimatch.filter = filter
function filter (pattern, options) {
  options = options || {}
  return function (p, i, list) {
    return minimatch(p, pattern, options)
  }
}

function ext (a, b) {
  a = a || {}
  b = b || {}
  var t = {}
  Object.keys(b).forEach(function (k) {
    t[k] = b[k]
  })
  Object.keys(a).forEach(function (k) {
    t[k] = a[k]
  })
  return t
}

minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return minimatch

  var orig = minimatch

  var m = function minimatch (p, pattern, options) {
    return orig.minimatch(p, pattern, ext(def, options))
  }

  m.Minimatch = function Minimatch (pattern, options) {
    return new orig.Minimatch(pattern, ext(def, options))
  }

  return m
}

Minimatch.defaults = function (def) {
  if (!def || !Object.keys(def).length) return Minimatch
  return minimatch.defaults(def).Minimatch
}

function minimatch (p, pattern, options) {
  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}

  // shortcut: comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    return false
  }

  // "" only matches ""
  if (pattern.trim() === '') return p === ''

  return new Minimatch(pattern, options).match(p)
}

function Minimatch (pattern, options) {
  if (!(this instanceof Minimatch)) {
    return new Minimatch(pattern, options)
  }

  if (typeof pattern !== 'string') {
    throw new TypeError('glob pattern string required')
  }

  if (!options) options = {}
  pattern = pattern.trim()

  // windows support: need to use /, not \
  if (path.sep !== '/') {
    pattern = pattern.split(path.sep).join('/')
  }

  this.options = options
  this.set = []
  this.pattern = pattern
  this.regexp = null
  this.negate = false
  this.comment = false
  this.empty = false

  // make the set of regexps etc.
  this.make()
}

Minimatch.prototype.debug = function () {}

Minimatch.prototype.make = make
function make () {
  // don't do it more than once.
  if (this._made) return

  var pattern = this.pattern
  var options = this.options

  // empty patterns and comments match nothing.
  if (!options.nocomment && pattern.charAt(0) === '#') {
    this.comment = true
    return
  }
  if (!pattern) {
    this.empty = true
    return
  }

  // step 1: figure out negation, etc.
  this.parseNegate()

  // step 2: expand braces
  var set = this.globSet = this.braceExpand()

  if (options.debug) this.debug = console.error

  this.debug(this.pattern, set)

  // step 3: now we have a set, so turn each one into a series of path-portion
  // matching patterns.
  // These will be regexps, except in the case of "**", which is
  // set to the GLOBSTAR object for globstar behavior,
  // and will not contain any / characters
  set = this.globParts = set.map(function (s) {
    return s.split(slashSplit)
  })

  this.debug(this.pattern, set)

  // glob --> regexps
  set = set.map(function (s, si, set) {
    return s.map(this.parse, this)
  }, this)

  this.debug(this.pattern, set)

  // filter out everything that didn't compile properly.
  set = set.filter(function (s) {
    return s.indexOf(false) === -1
  })

  this.debug(this.pattern, set)

  this.set = set
}

Minimatch.prototype.parseNegate = parseNegate
function parseNegate () {
  var pattern = this.pattern
  var negate = false
  var options = this.options
  var negateOffset = 0

  if (options.nonegate) return

  for (var i = 0, l = pattern.length
    ; i < l && pattern.charAt(i) === '!'
    ; i++) {
    negate = !negate
    negateOffset++
  }

  if (negateOffset) this.pattern = pattern.substr(negateOffset)
  this.negate = negate
}

// Brace expansion:
// a{b,c}d -> abd acd
// a{b,}c -> abc ac
// a{0..3}d -> a0d a1d a2d a3d
// a{b,c{d,e}f}g -> abg acdfg acefg
// a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
//
// Invalid sets are not expanded.
// a{2..}b -> a{2..}b
// a{b}c -> a{b}c
minimatch.braceExpand = function (pattern, options) {
  return braceExpand(pattern, options)
}

Minimatch.prototype.braceExpand = braceExpand

function braceExpand (pattern, options) {
  if (!options) {
    if (this instanceof Minimatch) {
      options = this.options
    } else {
      options = {}
    }
  }

  pattern = typeof pattern === 'undefined'
    ? this.pattern : pattern

  if (typeof pattern === 'undefined') {
    throw new TypeError('undefined pattern')
  }

  if (options.nobrace ||
    !pattern.match(/\{.*\}/)) {
    // shortcut. no need to expand.
    return [pattern]
  }

  return expand(pattern)
}

// parse a component of the expanded set.
// At this point, no pattern may contain "/" in it
// so we're going to return a 2d array, where each entry is the full
// pattern, split on '/', and then turned into a regular expression.
// A regexp is made at the end which joins each array with an
// escaped /, and another full one which joins each regexp with |.
//
// Following the lead of Bash 4.1, note that "**" only has special meaning
// when it is the *only* thing in a path portion.  Otherwise, any series
// of * is equivalent to a single *.  Globstar behavior is enabled by
// default, and can be disabled by setting options.noglobstar.
Minimatch.prototype.parse = parse
var SUBPARSE = {}
function parse (pattern, isSub) {
  if (pattern.length > 1024 * 64) {
    throw new TypeError('pattern is too long')
  }

  var options = this.options

  // shortcuts
  if (!options.noglobstar && pattern === '**') return GLOBSTAR
  if (pattern === '') return ''

  var re = ''
  var hasMagic = !!options.nocase
  var escaping = false
  // ? => one single character
  var patternListStack = []
  var negativeLists = []
  var stateChar
  var inClass = false
  var reClassStart = -1
  var classStart = -1
  // . and .. never match anything that doesn't start with .,
  // even when options.dot is set.
  var patternStart = pattern.charAt(0) === '.' ? '' // anything
  // not (start or / followed by . or .. followed by / or end)
  : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
  : '(?!\\.)'
  var self = this

  function clearStateChar () {
    if (stateChar) {
      // we had some state-tracking character
      // that wasn't consumed by this pass.
      switch (stateChar) {
        case '*':
          re += star
          hasMagic = true
        break
        case '?':
          re += qmark
          hasMagic = true
        break
        default:
          re += '\\' + stateChar
        break
      }
      self.debug('clearStateChar %j %j', stateChar, re)
      stateChar = false
    }
  }

  for (var i = 0, len = pattern.length, c
    ; (i < len) && (c = pattern.charAt(i))
    ; i++) {
    this.debug('%s\t%s %s %j', pattern, i, re, c)

    // skip over any that are escaped.
    if (escaping && reSpecials[c]) {
      re += '\\' + c
      escaping = false
      continue
    }

    switch (c) {
      case '/':
        // completely not allowed, even escaped.
        // Should already be path-split by now.
        return false

      case '\\':
        clearStateChar()
        escaping = true
      continue

      // the various stateChar values
      // for the "extglob" stuff.
      case '?':
      case '*':
      case '+':
      case '@':
      case '!':
        this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c)

        // all of those are literals inside a class, except that
        // the glob [!a] means [^a] in regexp
        if (inClass) {
          this.debug('  in class')
          if (c === '!' && i === classStart + 1) c = '^'
          re += c
          continue
        }

        // if we already have a stateChar, then it means
        // that there was something like ** or +? in there.
        // Handle the stateChar, then proceed with this one.
        self.debug('call clearStateChar %j', stateChar)
        clearStateChar()
        stateChar = c
        // if extglob is disabled, then +(asdf|foo) isn't a thing.
        // just clear the statechar *now*, rather than even diving into
        // the patternList stuff.
        if (options.noext) clearStateChar()
      continue

      case '(':
        if (inClass) {
          re += '('
          continue
        }

        if (!stateChar) {
          re += '\\('
          continue
        }

        patternListStack.push({
          type: stateChar,
          start: i - 1,
          reStart: re.length,
          open: plTypes[stateChar].open,
          close: plTypes[stateChar].close
        })
        // negation is (?:(?!js)[^/]*)
        re += stateChar === '!' ? '(?:(?!(?:' : '(?:'
        this.debug('plType %j %j', stateChar, re)
        stateChar = false
      continue

      case ')':
        if (inClass || !patternListStack.length) {
          re += '\\)'
          continue
        }

        clearStateChar()
        hasMagic = true
        var pl = patternListStack.pop()
        // negation is (?:(?!js)[^/]*)
        // The others are (?:<pattern>)<type>
        re += pl.close
        if (pl.type === '!') {
          negativeLists.push(pl)
        }
        pl.reEnd = re.length
      continue

      case '|':
        if (inClass || !patternListStack.length || escaping) {
          re += '\\|'
          escaping = false
          continue
        }

        clearStateChar()
        re += '|'
      continue

      // these are mostly the same in regexp and glob
      case '[':
        // swallow any state-tracking char before the [
        clearStateChar()

        if (inClass) {
          re += '\\' + c
          continue
        }

        inClass = true
        classStart = i
        reClassStart = re.length
        re += c
      continue

      case ']':
        //  a right bracket shall lose its special
        //  meaning and represent itself in
        //  a bracket expression if it occurs
        //  first in the list.  -- POSIX.2 2.8.3.2
        if (i === classStart + 1 || !inClass) {
          re += '\\' + c
          escaping = false
          continue
        }

        // handle the case where we left a class open.
        // "[z-a]" is valid, equivalent to "\[z-a\]"
        if (inClass) {
          // split where the last [ was, make sure we don't have
          // an invalid re. if so, re-walk the contents of the
          // would-be class to re-translate any characters that
          // were passed through as-is
          // TODO: It would probably be faster to determine this
          // without a try/catch and a new RegExp, but it's tricky
          // to do safely.  For now, this is safe and works.
          var cs = pattern.substring(classStart + 1, i)
          try {
            RegExp('[' + cs + ']')
          } catch (er) {
            // not a valid class!
            var sp = this.parse(cs, SUBPARSE)
            re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]'
            hasMagic = hasMagic || sp[1]
            inClass = false
            continue
          }
        }

        // finish up the class.
        hasMagic = true
        inClass = false
        re += c
      continue

      default:
        // swallow any state char that wasn't consumed
        clearStateChar()

        if (escaping) {
          // no need
          escaping = false
        } else if (reSpecials[c]
          && !(c === '^' && inClass)) {
          re += '\\'
        }

        re += c

    } // switch
  } // for

  // handle the case where we left a class open.
  // "[abc" is valid, equivalent to "\[abc"
  if (inClass) {
    // split where the last [ was, and escape it
    // this is a huge pita.  We now have to re-walk
    // the contents of the would-be class to re-translate
    // any characters that were passed through as-is
    cs = pattern.substr(classStart + 1)
    sp = this.parse(cs, SUBPARSE)
    re = re.substr(0, reClassStart) + '\\[' + sp[0]
    hasMagic = hasMagic || sp[1]
  }

  // handle the case where we had a +( thing at the *end*
  // of the pattern.
  // each pattern list stack adds 3 chars, and we need to go through
  // and escape any | chars that were passed through as-is for the regexp.
  // Go through and escape them, taking care not to double-escape any
  // | chars that were already escaped.
  for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
    var tail = re.slice(pl.reStart + pl.open.length)
    this.debug('setting tail', re, pl)
    // maybe some even number of \, then maybe 1 \, followed by a |
    tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
      if (!$2) {
        // the | isn't already escaped, so escape it.
        $2 = '\\'
      }

      // need to escape all those slashes *again*, without escaping the
      // one that we need for escaping the | character.  As it works out,
      // escaping an even number of slashes can be done by simply repeating
      // it exactly after itself.  That's why this trick works.
      //
      // I am sorry that you have to see this.
      return $1 + $1 + $2 + '|'
    })

    this.debug('tail=%j\n   %s', tail, tail, pl, re)
    var t = pl.type === '*' ? star
      : pl.type === '?' ? qmark
      : '\\' + pl.type

    hasMagic = true
    re = re.slice(0, pl.reStart) + t + '\\(' + tail
  }

  // handle trailing things that only matter at the very end.
  clearStateChar()
  if (escaping) {
    // trailing \\
    re += '\\\\'
  }

  // only need to apply the nodot start if the re starts with
  // something that could conceivably capture a dot
  var addPatternStart = false
  switch (re.charAt(0)) {
    case '.':
    case '[':
    case '(': addPatternStart = true
  }

  // Hack to work around lack of negative lookbehind in JS
  // A pattern like: *.!(x).!(y|z) needs to ensure that a name
  // like 'a.xyz.yz' doesn't match.  So, the first negative
  // lookahead, has to look ALL the way ahead, to the end of
  // the pattern.
  for (var n = negativeLists.length - 1; n > -1; n--) {
    var nl = negativeLists[n]

    var nlBefore = re.slice(0, nl.reStart)
    var nlFirst = re.slice(nl.reStart, nl.reEnd - 8)
    var nlLast = re.slice(nl.reEnd - 8, nl.reEnd)
    var nlAfter = re.slice(nl.reEnd)

    nlLast += nlAfter

    // Handle nested stuff like *(*.js|!(*.json)), where open parens
    // mean that we should *not* include the ) in the bit that is considered
    // "after" the negated section.
    var openParensBefore = nlBefore.split('(').length - 1
    var cleanAfter = nlAfter
    for (i = 0; i < openParensBefore; i++) {
      cleanAfter = cleanAfter.replace(/\)[+*?]?/, '')
    }
    nlAfter = cleanAfter

    var dollar = ''
    if (nlAfter === '' && isSub !== SUBPARSE) {
      dollar = '$'
    }
    var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast
    re = newRe
  }

  // if the re is not "" at this point, then we need to make sure
  // it doesn't match against an empty path part.
  // Otherwise a/* will match a/, which it should not.
  if (re !== '' && hasMagic) {
    re = '(?=.)' + re
  }

  if (addPatternStart) {
    re = patternStart + re
  }

  // parsing just a piece of a larger pattern.
  if (isSub === SUBPARSE) {
    return [re, hasMagic]
  }

  // skip the regexp for non-magical patterns
  // unescape anything in it, though, so that it'll be
  // an exact match against a file etc.
  if (!hasMagic) {
    return globUnescape(pattern)
  }

  var flags = options.nocase ? 'i' : ''
  try {
    var regExp = new RegExp('^' + re + '$', flags)
  } catch (er) {
    // If it was an invalid regular expression, then it can't match
    // anything.  This trick looks for a character after the end of
    // the string, which is of course impossible, except in multi-line
    // mode, but it's not a /m regex.
    return new RegExp('$.')
  }

  regExp._glob = pattern
  regExp._src = re

  return regExp
}

minimatch.makeRe = function (pattern, options) {
  return new Minimatch(pattern, options || {}).makeRe()
}

Minimatch.prototype.makeRe = makeRe
function makeRe () {
  if (this.regexp || this.regexp === false) return this.regexp

  // at this point, this.set is a 2d array of partial
  // pattern strings, or "**".
  //
  // It's better to use .match().  This function shouldn't
  // be used, really, but it's pretty convenient sometimes,
  // when you just want to work with a regex.
  var set = this.set

  if (!set.length) {
    this.regexp = false
    return this.regexp
  }
  var options = this.options

  var twoStar = options.noglobstar ? star
    : options.dot ? twoStarDot
    : twoStarNoDot
  var flags = options.nocase ? 'i' : ''

  var re = set.map(function (pattern) {
    return pattern.map(function (p) {
      return (p === GLOBSTAR) ? twoStar
      : (typeof p === 'string') ? regExpEscape(p)
      : p._src
    }).join('\\\/')
  }).join('|')

  // must match entire pattern
  // ending in a * or ** will make it less strict.
  re = '^(?:' + re + ')$'

  // can match anything, as long as it's not this.
  if (this.negate) re = '^(?!' + re + ').*$'

  try {
    this.regexp = new RegExp(re, flags)
  } catch (ex) {
    this.regexp = false
  }
  return this.regexp
}

minimatch.match = function (list, pattern, options) {
  options = options || {}
  var mm = new Minimatch(pattern, options)
  list = list.filter(function (f) {
    return mm.match(f)
  })
  if (mm.options.nonull && !list.length) {
    list.push(pattern)
  }
  return list
}

Minimatch.prototype.match = match
function match (f, partial) {
  this.debug('match', f, this.pattern)
  // short-circuit in the case of busted things.
  // comments, etc.
  if (this.comment) return false
  if (this.empty) return f === ''

  if (f === '/' && partial) return true

  var options = this.options

  // windows: need to use /, not \
  if (path.sep !== '/') {
    f = f.split(path.sep).join('/')
  }

  // treat the test path as a set of pathparts.
  f = f.split(slashSplit)
  this.debug(this.pattern, 'split', f)

  // just ONE of the pattern sets in this.set needs to match
  // in order for it to be valid.  If negating, then just one
  // match means that we have failed.
  // Either way, return on the first hit.

  var set = this.set
  this.debug(this.pattern, 'set', set)

  // Find the basename of the path by looking for the last non-empty segment
  var filename
  var i
  for (i = f.length - 1; i >= 0; i--) {
    filename = f[i]
    if (filename) break
  }

  for (i = 0; i < set.length; i++) {
    var pattern = set[i]
    var file = f
    if (options.matchBase && pattern.length === 1) {
      file = [filename]
    }
    var hit = this.matchOne(file, pattern, partial)
    if (hit) {
      if (options.flipNegate) return true
      return !this.negate
    }
  }

  // didn't get any hits.  this is success if it's a negative
  // pattern, failure otherwise.
  if (options.flipNegate) return false
  return this.negate
}

// set partial to true to test if, for example,
// "/a/b" matches the start of "/*/b/*/d"
// Partial means, if you run out of file before you run
// out of pattern, then that's fine, as long as all
// the parts match.
Minimatch.prototype.matchOne = function (file, pattern, partial) {
  var options = this.options

  this.debug('matchOne',
    { 'this': this, file: file, pattern: pattern })

  this.debug('matchOne', file.length, pattern.length)

  for (var fi = 0,
      pi = 0,
      fl = file.length,
      pl = pattern.length
      ; (fi < fl) && (pi < pl)
      ; fi++, pi++) {
    this.debug('matchOne loop')
    var p = pattern[pi]
    var f = file[fi]

    this.debug(pattern, p, f)

    // should be impossible.
    // some invalid regexp stuff in the set.
    if (p === false) return false

    if (p === GLOBSTAR) {
      this.debug('GLOBSTAR', [pattern, p, f])

      // "**"
      // a/**/b/**/c would match the following:
      // a/b/x/y/z/c
      // a/x/y/z/b/c
      // a/b/x/b/x/c
      // a/b/c
      // To do this, take the rest of the pattern after
      // the **, and see if it would match the file remainder.
      // If so, return success.
      // If not, the ** "swallows" a segment, and try again.
      // This is recursively awful.
      //
      // a/**/b/**/c matching a/b/x/y/z/c
      // - a matches a
      // - doublestar
      //   - matchOne(b/x/y/z/c, b/**/c)
      //     - b matches b
      //     - doublestar
      //       - matchOne(x/y/z/c, c) -> no
      //       - matchOne(y/z/c, c) -> no
      //       - matchOne(z/c, c) -> no
      //       - matchOne(c, c) yes, hit
      var fr = fi
      var pr = pi + 1
      if (pr === pl) {
        this.debug('** at the end')
        // a ** at the end will just swallow the rest.
        // We have found a match.
        // however, it will not swallow /.x, unless
        // options.dot is set.
        // . and .. are *never* matched by **, for explosively
        // exponential reasons.
        for (; fi < fl; fi++) {
          if (file[fi] === '.' || file[fi] === '..' ||
            (!options.dot && file[fi].charAt(0) === '.')) return false
        }
        return true
      }

      // ok, let's see if we can swallow whatever we can.
      while (fr < fl) {
        var swallowee = file[fr]

        this.debug('\nglobstar while', file, fr, pattern, pr, swallowee)

        // XXX remove this slice.  Just pass the start index.
        if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
          this.debug('globstar found match!', fr, fl, swallowee)
          // found a match.
          return true
        } else {
          // can't swallow "." or ".." ever.
          // can only swallow ".foo" when explicitly asked.
          if (swallowee === '.' || swallowee === '..' ||
            (!options.dot && swallowee.charAt(0) === '.')) {
            this.debug('dot detected!', file, fr, pattern, pr)
            break
          }

          // ** swallows a segment, and continue.
          this.debug('globstar swallow a segment, and continue')
          fr++
        }
      }

      // no match was found.
      // However, in partial mode, we can't say this is necessarily over.
      // If there's more *pattern* left, then
      if (partial) {
        // ran out of file
        this.debug('\n>>> no match, partial?', file, fr, pattern, pr)
        if (fr === fl) return true
      }
      return false
    }

    // something other than **
    // non-magic patterns just have to match exactly
    // patterns with magic have been turned into regexps.
    var hit
    if (typeof p === 'string') {
      if (options.nocase) {
        hit = f.toLowerCase() === p.toLowerCase()
      } else {
        hit = f === p
      }
      this.debug('string match', p, f, hit)
    } else {
      hit = f.match(p)
      this.debug('pattern match', p, f, hit)
    }

    if (!hit) return false
  }

  // Note: ending in / means that we'll get a final ""
  // at the end of the pattern.  This can only match a
  // corresponding "" at the end of the file.
  // If the file ends in /, then it can only match a
  // a pattern that ends in /, unless the pattern just
  // doesn't have any more for it. But, a/b/ should *not*
  // match "a/b/*", even though "" matches against the
  // [^/]*? pattern, except in partial mode, where it might
  // simply not be reached yet.
  // However, a/b/ should still satisfy a/*

  // now either we fell off the end of the pattern, or we're done.
  if (fi === fl && pi === pl) {
    // ran out of pattern and filename at the same time.
    // an exact hit!
    return true
  } else if (fi === fl) {
    // ran out of file, but still had pattern left.
    // this is ok if we're doing the match as part of
    // a glob fs traversal.
    return partial
  } else if (pi === pl) {
    // ran out of pattern, still have file left.
    // this is only acceptable if we're on the very last
    // empty segment of a file with a trailing slash.
    // a/* should match a/b/
    var emptyFileEnd = (fi === fl - 1) && (file[fi] === '')
    return emptyFileEnd
  }

  // should be unreachable.
  throw new Error('wtf?')
}

// replace stuff like \* with *
function globUnescape (s) {
  return s.replace(/\\(.)/g, '$1')
}

function regExpEscape (s) {
  return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}


/***/ }),

/***/ 102:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__webpack_require__(747));
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 114:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const Readable = __webpack_require__(794).Readable;
const lowercaseKeys = __webpack_require__(474);

class Response extends Readable {
	constructor(statusCode, headers, body, url) {
		if (typeof statusCode !== 'number') {
			throw new TypeError('Argument `statusCode` should be a number');
		}
		if (typeof headers !== 'object') {
			throw new TypeError('Argument `headers` should be an object');
		}
		if (!(body instanceof Buffer)) {
			throw new TypeError('Argument `body` should be a buffer');
		}
		if (typeof url !== 'string') {
			throw new TypeError('Argument `url` should be a string');
		}

		super();
		this.statusCode = statusCode;
		this.headers = lowercaseKeys(headers);
		this.body = body;
		this.url = url;
	}

	_read() {
		this.push(this.body);
		this.push(null);
	}
}

module.exports = Response;


/***/ }),

/***/ 117:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var pathModule = __webpack_require__(622);
var isWindows = process.platform === 'win32';
var fs = __webpack_require__(747);

// JavaScript implementation of realpath, ported from node pre-v6

var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

function rethrow() {
  // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
  // is fairly slow to generate.
  var callback;
  if (DEBUG) {
    var backtrace = new Error;
    callback = debugCallback;
  } else
    callback = missingCallback;

  return callback;

  function debugCallback(err) {
    if (err) {
      backtrace.message = err.message;
      err = backtrace;
      missingCallback(err);
    }
  }

  function missingCallback(err) {
    if (err) {
      if (process.throwDeprecation)
        throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
      else if (!process.noDeprecation) {
        var msg = 'fs: missing callback ' + (err.stack || err.message);
        if (process.traceDeprecation)
          console.trace(msg);
        else
          console.error(msg);
      }
    }
  }
}

function maybeCallback(cb) {
  return typeof cb === 'function' ? cb : rethrow();
}

var normalize = pathModule.normalize;

// Regexp that finds the next partion of a (partial) path
// result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
if (isWindows) {
  var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
} else {
  var nextPartRe = /(.*?)(?:[\/]+|$)/g;
}

// Regex to find the device root, including trailing slash. E.g. 'c:\\'.
if (isWindows) {
  var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
} else {
  var splitRootRe = /^[\/]*/;
}

exports.realpathSync = function realpathSync(p, cache) {
  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return cache[p];
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstatSync(base);
      knownHard[base] = true;
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  // NB: p.length changes.
  while (pos < p.length) {
    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      continue;
    }

    var resolvedLink;
    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // some known symbolic link.  no need to stat again.
      resolvedLink = cache[base];
    } else {
      var stat = fs.lstatSync(base);
      if (!stat.isSymbolicLink()) {
        knownHard[base] = true;
        if (cache) cache[base] = base;
        continue;
      }

      // read the link if it wasn't read before
      // dev/ino always return 0 on windows, so skip the check.
      var linkTarget = null;
      if (!isWindows) {
        var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
        if (seenLinks.hasOwnProperty(id)) {
          linkTarget = seenLinks[id];
        }
      }
      if (linkTarget === null) {
        fs.statSync(base);
        linkTarget = fs.readlinkSync(base);
      }
      resolvedLink = pathModule.resolve(previous, linkTarget);
      // track this, if given a cache.
      if (cache) cache[base] = resolvedLink;
      if (!isWindows) seenLinks[id] = linkTarget;
    }

    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }

  if (cache) cache[original] = p;

  return p;
};


exports.realpath = function realpath(p, cache, cb) {
  if (typeof cb !== 'function') {
    cb = maybeCallback(cache);
    cache = null;
  }

  // make p is absolute
  p = pathModule.resolve(p);

  if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
    return process.nextTick(cb.bind(null, null, cache[p]));
  }

  var original = p,
      seenLinks = {},
      knownHard = {};

  // current character position in p
  var pos;
  // the partial path so far, including a trailing slash if any
  var current;
  // the partial path without a trailing slash (except when pointing at a root)
  var base;
  // the partial path scanned in the previous round, with slash
  var previous;

  start();

  function start() {
    // Skip over roots
    var m = splitRootRe.exec(p);
    pos = m[0].length;
    current = m[0];
    base = m[0];
    previous = '';

    // On windows, check that the root exists. On unix there is no need.
    if (isWindows && !knownHard[base]) {
      fs.lstat(base, function(err) {
        if (err) return cb(err);
        knownHard[base] = true;
        LOOP();
      });
    } else {
      process.nextTick(LOOP);
    }
  }

  // walk down the path, swapping out linked pathparts for their real
  // values
  function LOOP() {
    // stop if scanned past end of path
    if (pos >= p.length) {
      if (cache) cache[original] = p;
      return cb(null, p);
    }

    // find the next part
    nextPartRe.lastIndex = pos;
    var result = nextPartRe.exec(p);
    previous = current;
    current += result[0];
    base = previous + result[1];
    pos = nextPartRe.lastIndex;

    // continue if not a symlink
    if (knownHard[base] || (cache && cache[base] === base)) {
      return process.nextTick(LOOP);
    }

    if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
      // known symbolic link.  no need to stat again.
      return gotResolvedLink(cache[base]);
    }

    return fs.lstat(base, gotStat);
  }

  function gotStat(err, stat) {
    if (err) return cb(err);

    // if not a symlink, skip to the next path part
    if (!stat.isSymbolicLink()) {
      knownHard[base] = true;
      if (cache) cache[base] = base;
      return process.nextTick(LOOP);
    }

    // stat & read the link if not read before
    // call gotTarget as soon as the link target is known
    // dev/ino always return 0 on windows, so skip the check.
    if (!isWindows) {
      var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
      if (seenLinks.hasOwnProperty(id)) {
        return gotTarget(null, seenLinks[id], base);
      }
    }
    fs.stat(base, function(err) {
      if (err) return cb(err);

      fs.readlink(base, function(err, target) {
        if (!isWindows) seenLinks[id] = target;
        gotTarget(err, target);
      });
    });
  }

  function gotTarget(err, target, base) {
    if (err) return cb(err);

    var resolvedLink = pathModule.resolve(previous, target);
    if (cache) cache[base] = resolvedLink;
    gotResolvedLink(resolvedLink);
  }

  function gotResolvedLink(resolvedLink) {
    // resolve the link, then start over
    p = pathModule.resolve(resolvedLink, p.slice(pos));
    start();
  }
};


/***/ }),

/***/ 121:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __webpack_require__(36);
const parseBody = (response, responseType, parseJson, encoding) => {
    const { rawBody } = response;
    try {
        if (responseType === 'text') {
            return rawBody.toString(encoding);
        }
        if (responseType === 'json') {
            return rawBody.length === 0 ? '' : parseJson(rawBody.toString());
        }
        if (responseType === 'buffer') {
            return rawBody;
        }
        throw new types_1.ParseError({
            message: `Unknown body type '${responseType}'`,
            name: 'Error'
        }, response);
    }
    catch (error) {
        throw new types_1.ParseError(error, response);
    }
};
exports.default = parseBody;


/***/ }),

/***/ 127:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__webpack_require__(539));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 129:
/***/ (function(module) {

module.exports = require("child_process");

/***/ }),

/***/ 141:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


var net = __webpack_require__(631);
var tls = __webpack_require__(16);
var http = __webpack_require__(605);
var https = __webpack_require__(211);
var events = __webpack_require__(614);
var assert = __webpack_require__(357);
var util = __webpack_require__(669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 145:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {constants: BufferConstants} = __webpack_require__(293);
const pump = __webpack_require__(453);
const bufferStream = __webpack_require__(966);

class MaxBufferError extends Error {
	constructor() {
		super('maxBuffer exceeded');
		this.name = 'MaxBufferError';
	}
}

async function getStream(inputStream, options) {
	if (!inputStream) {
		return Promise.reject(new Error('Expected a stream'));
	}

	options = {
		maxBuffer: Infinity,
		...options
	};

	const {maxBuffer} = options;

	let stream;
	await new Promise((resolve, reject) => {
		const rejectPromise = error => {
			// Don't retrieve an oversized buffer.
			if (error && stream.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
				error.bufferedData = stream.getBufferedValue();
			}

			reject(error);
		};

		stream = pump(inputStream, bufferStream(options), error => {
			if (error) {
				rejectPromise(error);
				return;
			}

			resolve();
		});

		stream.on('data', () => {
			if (stream.getBufferedLength() > maxBuffer) {
				rejectPromise(new MaxBufferError());
			}
		});
	});

	return stream.getBufferedValue();
}

module.exports = getStream;
// TODO: Remove this for the next major release
module.exports.default = getStream;
module.exports.buffer = (stream, options) => getStream(stream, {...options, encoding: 'buffer'});
module.exports.array = (stream, options) => getStream(stream, {...options, array: true});
module.exports.MaxBufferError = MaxBufferError;


/***/ }),

/***/ 154:
/***/ (function(module) {

"use strict";

// rfc7231 6.1
const statusCodeCacheableByDefault = new Set([
    200,
    203,
    204,
    206,
    300,
    301,
    404,
    405,
    410,
    414,
    501,
]);

// This implementation does not understand partial responses (206)
const understoodStatuses = new Set([
    200,
    203,
    204,
    300,
    301,
    302,
    303,
    307,
    308,
    404,
    405,
    410,
    414,
    501,
]);

const errorStatusCodes = new Set([
    500,
    502,
    503, 
    504,
]);

const hopByHopHeaders = {
    date: true, // included, because we add Age update Date
    connection: true,
    'keep-alive': true,
    'proxy-authenticate': true,
    'proxy-authorization': true,
    te: true,
    trailer: true,
    'transfer-encoding': true,
    upgrade: true,
};

const excludedFromRevalidationUpdate = {
    // Since the old body is reused, it doesn't make sense to change properties of the body
    'content-length': true,
    'content-encoding': true,
    'transfer-encoding': true,
    'content-range': true,
};

function toNumberOrZero(s) {
    const n = parseInt(s, 10);
    return isFinite(n) ? n : 0;
}

// RFC 5861
function isErrorResponse(response) {
    // consider undefined response as faulty
    if(!response) {
        return true
    }
    return errorStatusCodes.has(response.status);
}

function parseCacheControl(header) {
    const cc = {};
    if (!header) return cc;

    // TODO: When there is more than one value present for a given directive (e.g., two Expires header fields, multiple Cache-Control: max-age directives),
    // the directive's value is considered invalid. Caches are encouraged to consider responses that have invalid freshness information to be stale
    const parts = header.trim().split(/\s*,\s*/); // TODO: lame parsing
    for (const part of parts) {
        const [k, v] = part.split(/\s*=\s*/, 2);
        cc[k] = v === undefined ? true : v.replace(/^"|"$/g, ''); // TODO: lame unquoting
    }

    return cc;
}

function formatCacheControl(cc) {
    let parts = [];
    for (const k in cc) {
        const v = cc[k];
        parts.push(v === true ? k : k + '=' + v);
    }
    if (!parts.length) {
        return undefined;
    }
    return parts.join(', ');
}

module.exports = class CachePolicy {
    constructor(
        req,
        res,
        {
            shared,
            cacheHeuristic,
            immutableMinTimeToLive,
            ignoreCargoCult,
            _fromObject,
        } = {}
    ) {
        if (_fromObject) {
            this._fromObject(_fromObject);
            return;
        }

        if (!res || !res.headers) {
            throw Error('Response headers missing');
        }
        this._assertRequestHasHeaders(req);

        this._responseTime = this.now();
        this._isShared = shared !== false;
        this._cacheHeuristic =
            undefined !== cacheHeuristic ? cacheHeuristic : 0.1; // 10% matches IE
        this._immutableMinTtl =
            undefined !== immutableMinTimeToLive
                ? immutableMinTimeToLive
                : 24 * 3600 * 1000;

        this._status = 'status' in res ? res.status : 200;
        this._resHeaders = res.headers;
        this._rescc = parseCacheControl(res.headers['cache-control']);
        this._method = 'method' in req ? req.method : 'GET';
        this._url = req.url;
        this._host = req.headers.host;
        this._noAuthorization = !req.headers.authorization;
        this._reqHeaders = res.headers.vary ? req.headers : null; // Don't keep all request headers if they won't be used
        this._reqcc = parseCacheControl(req.headers['cache-control']);

        // Assume that if someone uses legacy, non-standard uncecessary options they don't understand caching,
        // so there's no point stricly adhering to the blindly copy&pasted directives.
        if (
            ignoreCargoCult &&
            'pre-check' in this._rescc &&
            'post-check' in this._rescc
        ) {
            delete this._rescc['pre-check'];
            delete this._rescc['post-check'];
            delete this._rescc['no-cache'];
            delete this._rescc['no-store'];
            delete this._rescc['must-revalidate'];
            this._resHeaders = Object.assign({}, this._resHeaders, {
                'cache-control': formatCacheControl(this._rescc),
            });
            delete this._resHeaders.expires;
            delete this._resHeaders.pragma;
        }

        // When the Cache-Control header field is not present in a request, caches MUST consider the no-cache request pragma-directive
        // as having the same effect as if "Cache-Control: no-cache" were present (see Section 5.2.1).
        if (
            res.headers['cache-control'] == null &&
            /no-cache/.test(res.headers.pragma)
        ) {
            this._rescc['no-cache'] = true;
        }
    }

    now() {
        return Date.now();
    }

    storable() {
        // The "no-store" request directive indicates that a cache MUST NOT store any part of either this request or any response to it.
        return !!(
            !this._reqcc['no-store'] &&
            // A cache MUST NOT store a response to any request, unless:
            // The request method is understood by the cache and defined as being cacheable, and
            ('GET' === this._method ||
                'HEAD' === this._method ||
                ('POST' === this._method && this._hasExplicitExpiration())) &&
            // the response status code is understood by the cache, and
            understoodStatuses.has(this._status) &&
            // the "no-store" cache directive does not appear in request or response header fields, and
            !this._rescc['no-store'] &&
            // the "private" response directive does not appear in the response, if the cache is shared, and
            (!this._isShared || !this._rescc.private) &&
            // the Authorization header field does not appear in the request, if the cache is shared,
            (!this._isShared ||
                this._noAuthorization ||
                this._allowsStoringAuthenticated()) &&
            // the response either:
            // contains an Expires header field, or
            (this._resHeaders.expires ||
                // contains a max-age response directive, or
                // contains a s-maxage response directive and the cache is shared, or
                // contains a public response directive.
                this._rescc['max-age'] ||
                (this._isShared && this._rescc['s-maxage']) ||
                this._rescc.public ||
                // has a status code that is defined as cacheable by default
                statusCodeCacheableByDefault.has(this._status))
        );
    }

    _hasExplicitExpiration() {
        // 4.2.1 Calculating Freshness Lifetime
        return (
            (this._isShared && this._rescc['s-maxage']) ||
            this._rescc['max-age'] ||
            this._resHeaders.expires
        );
    }

    _assertRequestHasHeaders(req) {
        if (!req || !req.headers) {
            throw Error('Request headers missing');
        }
    }

    satisfiesWithoutRevalidation(req) {
        this._assertRequestHasHeaders(req);

        // When presented with a request, a cache MUST NOT reuse a stored response, unless:
        // the presented request does not contain the no-cache pragma (Section 5.4), nor the no-cache cache directive,
        // unless the stored response is successfully validated (Section 4.3), and
        const requestCC = parseCacheControl(req.headers['cache-control']);
        if (requestCC['no-cache'] || /no-cache/.test(req.headers.pragma)) {
            return false;
        }

        if (requestCC['max-age'] && this.age() > requestCC['max-age']) {
            return false;
        }

        if (
            requestCC['min-fresh'] &&
            this.timeToLive() < 1000 * requestCC['min-fresh']
        ) {
            return false;
        }

        // the stored response is either:
        // fresh, or allowed to be served stale
        if (this.stale()) {
            const allowsStale =
                requestCC['max-stale'] &&
                !this._rescc['must-revalidate'] &&
                (true === requestCC['max-stale'] ||
                    requestCC['max-stale'] > this.age() - this.maxAge());
            if (!allowsStale) {
                return false;
            }
        }

        return this._requestMatches(req, false);
    }

    _requestMatches(req, allowHeadMethod) {
        // The presented effective request URI and that of the stored response match, and
        return (
            (!this._url || this._url === req.url) &&
            this._host === req.headers.host &&
            // the request method associated with the stored response allows it to be used for the presented request, and
            (!req.method ||
                this._method === req.method ||
                (allowHeadMethod && 'HEAD' === req.method)) &&
            // selecting header fields nominated by the stored response (if any) match those presented, and
            this._varyMatches(req)
        );
    }

    _allowsStoringAuthenticated() {
        //  following Cache-Control response directives (Section 5.2.2) have such an effect: must-revalidate, public, and s-maxage.
        return (
            this._rescc['must-revalidate'] ||
            this._rescc.public ||
            this._rescc['s-maxage']
        );
    }

    _varyMatches(req) {
        if (!this._resHeaders.vary) {
            return true;
        }

        // A Vary header field-value of "*" always fails to match
        if (this._resHeaders.vary === '*') {
            return false;
        }

        const fields = this._resHeaders.vary
            .trim()
            .toLowerCase()
            .split(/\s*,\s*/);
        for (const name of fields) {
            if (req.headers[name] !== this._reqHeaders[name]) return false;
        }
        return true;
    }

    _copyWithoutHopByHopHeaders(inHeaders) {
        const headers = {};
        for (const name in inHeaders) {
            if (hopByHopHeaders[name]) continue;
            headers[name] = inHeaders[name];
        }
        // 9.1.  Connection
        if (inHeaders.connection) {
            const tokens = inHeaders.connection.trim().split(/\s*,\s*/);
            for (const name of tokens) {
                delete headers[name];
            }
        }
        if (headers.warning) {
            const warnings = headers.warning.split(/,/).filter(warning => {
                return !/^\s*1[0-9][0-9]/.test(warning);
            });
            if (!warnings.length) {
                delete headers.warning;
            } else {
                headers.warning = warnings.join(',').trim();
            }
        }
        return headers;
    }

    responseHeaders() {
        const headers = this._copyWithoutHopByHopHeaders(this._resHeaders);
        const age = this.age();

        // A cache SHOULD generate 113 warning if it heuristically chose a freshness
        // lifetime greater than 24 hours and the response's age is greater than 24 hours.
        if (
            age > 3600 * 24 &&
            !this._hasExplicitExpiration() &&
            this.maxAge() > 3600 * 24
        ) {
            headers.warning =
                (headers.warning ? `${headers.warning}, ` : '') +
                '113 - "rfc7234 5.5.4"';
        }
        headers.age = `${Math.round(age)}`;
        headers.date = new Date(this.now()).toUTCString();
        return headers;
    }

    /**
     * Value of the Date response header or current time if Date was invalid
     * @return timestamp
     */
    date() {
        const serverDate = Date.parse(this._resHeaders.date);
        if (isFinite(serverDate)) {
            return serverDate;
        }
        return this._responseTime;
    }

    /**
     * Value of the Age header, in seconds, updated for the current time.
     * May be fractional.
     *
     * @return Number
     */
    age() {
        let age = this._ageValue();

        const residentTime = (this.now() - this._responseTime) / 1000;
        return age + residentTime;
    }

    _ageValue() {
        return toNumberOrZero(this._resHeaders.age);
    }

    /**
     * Value of applicable max-age (or heuristic equivalent) in seconds. This counts since response's `Date`.
     *
     * For an up-to-date value, see `timeToLive()`.
     *
     * @return Number
     */
    maxAge() {
        if (!this.storable() || this._rescc['no-cache']) {
            return 0;
        }

        // Shared responses with cookies are cacheable according to the RFC, but IMHO it'd be unwise to do so by default
        // so this implementation requires explicit opt-in via public header
        if (
            this._isShared &&
            (this._resHeaders['set-cookie'] &&
                !this._rescc.public &&
                !this._rescc.immutable)
        ) {
            return 0;
        }

        if (this._resHeaders.vary === '*') {
            return 0;
        }

        if (this._isShared) {
            if (this._rescc['proxy-revalidate']) {
                return 0;
            }
            // if a response includes the s-maxage directive, a shared cache recipient MUST ignore the Expires field.
            if (this._rescc['s-maxage']) {
                return toNumberOrZero(this._rescc['s-maxage']);
            }
        }

        // If a response includes a Cache-Control field with the max-age directive, a recipient MUST ignore the Expires field.
        if (this._rescc['max-age']) {
            return toNumberOrZero(this._rescc['max-age']);
        }

        const defaultMinTtl = this._rescc.immutable ? this._immutableMinTtl : 0;

        const serverDate = this.date();
        if (this._resHeaders.expires) {
            const expires = Date.parse(this._resHeaders.expires);
            // A cache recipient MUST interpret invalid date formats, especially the value "0", as representing a time in the past (i.e., "already expired").
            if (Number.isNaN(expires) || expires < serverDate) {
                return 0;
            }
            return Math.max(defaultMinTtl, (expires - serverDate) / 1000);
        }

        if (this._resHeaders['last-modified']) {
            const lastModified = Date.parse(this._resHeaders['last-modified']);
            if (isFinite(lastModified) && serverDate > lastModified) {
                return Math.max(
                    defaultMinTtl,
                    ((serverDate - lastModified) / 1000) * this._cacheHeuristic
                );
            }
        }

        return defaultMinTtl;
    }

    timeToLive() {
        const age = this.maxAge() - this.age();
        const staleIfErrorAge = age + toNumberOrZero(this._rescc['stale-if-error']);
        const staleWhileRevalidateAge = age + toNumberOrZero(this._rescc['stale-while-revalidate']);
        return Math.max(0, age, staleIfErrorAge, staleWhileRevalidateAge) * 1000;
    }

    stale() {
        return this.maxAge() <= this.age();
    }

    _useStaleIfError() {
        return this.maxAge() + toNumberOrZero(this._rescc['stale-if-error']) > this.age();
    }

    useStaleWhileRevalidate() {
        return this.maxAge() + toNumberOrZero(this._rescc['stale-while-revalidate']) > this.age();
    }

    static fromObject(obj) {
        return new this(undefined, undefined, { _fromObject: obj });
    }

    _fromObject(obj) {
        if (this._responseTime) throw Error('Reinitialized');
        if (!obj || obj.v !== 1) throw Error('Invalid serialization');

        this._responseTime = obj.t;
        this._isShared = obj.sh;
        this._cacheHeuristic = obj.ch;
        this._immutableMinTtl =
            obj.imm !== undefined ? obj.imm : 24 * 3600 * 1000;
        this._status = obj.st;
        this._resHeaders = obj.resh;
        this._rescc = obj.rescc;
        this._method = obj.m;
        this._url = obj.u;
        this._host = obj.h;
        this._noAuthorization = obj.a;
        this._reqHeaders = obj.reqh;
        this._reqcc = obj.reqcc;
    }

    toObject() {
        return {
            v: 1,
            t: this._responseTime,
            sh: this._isShared,
            ch: this._cacheHeuristic,
            imm: this._immutableMinTtl,
            st: this._status,
            resh: this._resHeaders,
            rescc: this._rescc,
            m: this._method,
            u: this._url,
            h: this._host,
            a: this._noAuthorization,
            reqh: this._reqHeaders,
            reqcc: this._reqcc,
        };
    }

    /**
     * Headers for sending to the origin server to revalidate stale response.
     * Allows server to return 304 to allow reuse of the previous response.
     *
     * Hop by hop headers are always stripped.
     * Revalidation headers may be added or removed, depending on request.
     */
    revalidationHeaders(incomingReq) {
        this._assertRequestHasHeaders(incomingReq);
        const headers = this._copyWithoutHopByHopHeaders(incomingReq.headers);

        // This implementation does not understand range requests
        delete headers['if-range'];

        if (!this._requestMatches(incomingReq, true) || !this.storable()) {
            // revalidation allowed via HEAD
            // not for the same resource, or wasn't allowed to be cached anyway
            delete headers['if-none-match'];
            delete headers['if-modified-since'];
            return headers;
        }

        /* MUST send that entity-tag in any cache validation request (using If-Match or If-None-Match) if an entity-tag has been provided by the origin server. */
        if (this._resHeaders.etag) {
            headers['if-none-match'] = headers['if-none-match']
                ? `${headers['if-none-match']}, ${this._resHeaders.etag}`
                : this._resHeaders.etag;
        }

        // Clients MAY issue simple (non-subrange) GET requests with either weak validators or strong validators. Clients MUST NOT use weak validators in other forms of request.
        const forbidsWeakValidators =
            headers['accept-ranges'] ||
            headers['if-match'] ||
            headers['if-unmodified-since'] ||
            (this._method && this._method != 'GET');

        /* SHOULD send the Last-Modified value in non-subrange cache validation requests (using If-Modified-Since) if only a Last-Modified value has been provided by the origin server.
        Note: This implementation does not understand partial responses (206) */
        if (forbidsWeakValidators) {
            delete headers['if-modified-since'];

            if (headers['if-none-match']) {
                const etags = headers['if-none-match']
                    .split(/,/)
                    .filter(etag => {
                        return !/^\s*W\//.test(etag);
                    });
                if (!etags.length) {
                    delete headers['if-none-match'];
                } else {
                    headers['if-none-match'] = etags.join(',').trim();
                }
            }
        } else if (
            this._resHeaders['last-modified'] &&
            !headers['if-modified-since']
        ) {
            headers['if-modified-since'] = this._resHeaders['last-modified'];
        }

        return headers;
    }

    /**
     * Creates new CachePolicy with information combined from the previews response,
     * and the new revalidation response.
     *
     * Returns {policy, modified} where modified is a boolean indicating
     * whether the response body has been modified, and old cached body can't be used.
     *
     * @return {Object} {policy: CachePolicy, modified: Boolean}
     */
    revalidatedPolicy(request, response) {
        this._assertRequestHasHeaders(request);
        if(this._useStaleIfError() && isErrorResponse(response)) {  // I consider the revalidation request unsuccessful
          return {
            modified: false,
            matches: false,
            policy: this,
          };
        }
        if (!response || !response.headers) {
            throw Error('Response headers missing');
        }

        // These aren't going to be supported exactly, since one CachePolicy object
        // doesn't know about all the other cached objects.
        let matches = false;
        if (response.status !== undefined && response.status != 304) {
            matches = false;
        } else if (
            response.headers.etag &&
            !/^\s*W\//.test(response.headers.etag)
        ) {
            // "All of the stored responses with the same strong validator are selected.
            // If none of the stored responses contain the same strong validator,
            // then the cache MUST NOT use the new response to update any stored responses."
            matches =
                this._resHeaders.etag &&
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                    response.headers.etag;
        } else if (this._resHeaders.etag && response.headers.etag) {
            // "If the new response contains a weak validator and that validator corresponds
            // to one of the cache's stored responses,
            // then the most recent of those matching stored responses is selected for update."
            matches =
                this._resHeaders.etag.replace(/^\s*W\//, '') ===
                response.headers.etag.replace(/^\s*W\//, '');
        } else if (this._resHeaders['last-modified']) {
            matches =
                this._resHeaders['last-modified'] ===
                response.headers['last-modified'];
        } else {
            // If the new response does not include any form of validator (such as in the case where
            // a client generates an If-Modified-Since request from a source other than the Last-Modified
            // response header field), and there is only one stored response, and that stored response also
            // lacks a validator, then that stored response is selected for update.
            if (
                !this._resHeaders.etag &&
                !this._resHeaders['last-modified'] &&
                !response.headers.etag &&
                !response.headers['last-modified']
            ) {
                matches = true;
            }
        }

        if (!matches) {
            return {
                policy: new this.constructor(request, response),
                // Client receiving 304 without body, even if it's invalid/mismatched has no option
                // but to reuse a cached body. We don't have a good way to tell clients to do
                // error recovery in such case.
                modified: response.status != 304,
                matches: false,
            };
        }

        // use other header fields provided in the 304 (Not Modified) response to replace all instances
        // of the corresponding header fields in the stored response.
        const headers = {};
        for (const k in this._resHeaders) {
            headers[k] =
                k in response.headers && !excludedFromRevalidationUpdate[k]
                    ? response.headers[k]
                    : this._resHeaders[k];
        }

        const newResponse = Object.assign({}, response, {
            status: this._status,
            method: this._method,
            headers,
        });
        return {
            policy: new this.constructor(request, newResponse, {
                shared: this._isShared,
                cacheHeuristic: this._cacheHeuristic,
                immutableMinTimeToLive: this._immutableMinTtl,
            }),
            modified: false,
            matches: true,
        };
    }
};


/***/ }),

/***/ 157:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const http2 = __webpack_require__(565);
const agent = __webpack_require__(899);
const ClientRequest = __webpack_require__(181);
const IncomingMessage = __webpack_require__(750);
const auto = __webpack_require__(988);

const request = (url, options, callback) => {
	return new ClientRequest(url, options, callback);
};

const get = (url, options, callback) => {
	// eslint-disable-next-line unicorn/prevent-abbreviations
	const req = new ClientRequest(url, options, callback);
	req.end();

	return req;
};

module.exports = {
	...http2,
	ClientRequest,
	IncomingMessage,
	...agent,
	request,
	get,
	auto
};


/***/ }),

/***/ 167:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(602);

common.register('cp', _cp, {
  cmdOptions: {
    'f': '!no_force',
    'n': 'no_force',
    'u': 'update',
    'R': 'recursive',
    'r': 'recursive',
    'L': 'followsymlink',
    'P': 'noFollowsymlink',
  },
  wrapOutput: false,
});

// Buffered file copy, synchronous
// (Using readFileSync() + writeFileSync() could easily cause a memory overflow
//  with large files)
function copyFileSync(srcFile, destFile, options) {
  if (!fs.existsSync(srcFile)) {
    common.error('copyFileSync: no such file or directory: ' + srcFile);
  }

  var isWindows = process.platform === 'win32';

  // Check the mtimes of the files if the '-u' flag is provided
  try {
    if (options.update && common.statFollowLinks(srcFile).mtime < fs.statSync(destFile).mtime) {
      return;
    }
  } catch (e) {
    // If we're here, destFile probably doesn't exist, so just do a normal copy
  }

  if (common.statNoFollowLinks(srcFile).isSymbolicLink() && !options.followsymlink) {
    try {
      common.statNoFollowLinks(destFile);
      common.unlinkSync(destFile); // re-link it
    } catch (e) {
      // it doesn't exist, so no work needs to be done
    }

    var symlinkFull = fs.readlinkSync(srcFile);
    fs.symlinkSync(symlinkFull, destFile, isWindows ? 'junction' : null);
  } else {
    var buf = common.buffer();
    var bufLength = buf.length;
    var bytesRead = bufLength;
    var pos = 0;
    var fdr = null;
    var fdw = null;

    try {
      fdr = fs.openSync(srcFile, 'r');
    } catch (e) {
      /* istanbul ignore next */
      common.error('copyFileSync: could not read src file (' + srcFile + ')');
    }

    try {
      fdw = fs.openSync(destFile, 'w');
    } catch (e) {
      /* istanbul ignore next */
      common.error('copyFileSync: could not write to dest file (code=' + e.code + '):' + destFile);
    }

    while (bytesRead === bufLength) {
      bytesRead = fs.readSync(fdr, buf, 0, bufLength, pos);
      fs.writeSync(fdw, buf, 0, bytesRead);
      pos += bytesRead;
    }

    fs.closeSync(fdr);
    fs.closeSync(fdw);

    fs.chmodSync(destFile, common.statFollowLinks(srcFile).mode);
  }
}

// Recursively copies 'sourceDir' into 'destDir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
function cpdirSyncRecursive(sourceDir, destDir, currentDepth, opts) {
  if (!opts) opts = {};

  // Ensure there is not a run away recursive copy
  if (currentDepth >= common.config.maxdepth) return;
  currentDepth++;

  var isWindows = process.platform === 'win32';

  // Create the directory where all our junk is moving to; read the mode of the
  // source directory and mirror it
  try {
    fs.mkdirSync(destDir);
  } catch (e) {
    // if the directory already exists, that's okay
    if (e.code !== 'EEXIST') throw e;
  }

  var files = fs.readdirSync(sourceDir);

  for (var i = 0; i < files.length; i++) {
    var srcFile = sourceDir + '/' + files[i];
    var destFile = destDir + '/' + files[i];
    var srcFileStat = common.statNoFollowLinks(srcFile);

    var symlinkFull;
    if (opts.followsymlink) {
      if (cpcheckcycle(sourceDir, srcFile)) {
        // Cycle link found.
        console.error('Cycle link found.');
        symlinkFull = fs.readlinkSync(srcFile);
        fs.symlinkSync(symlinkFull, destFile, isWindows ? 'junction' : null);
        continue;
      }
    }
    if (srcFileStat.isDirectory()) {
      /* recursion this thing right on back. */
      cpdirSyncRecursive(srcFile, destFile, currentDepth, opts);
    } else if (srcFileStat.isSymbolicLink() && !opts.followsymlink) {
      symlinkFull = fs.readlinkSync(srcFile);
      try {
        common.statNoFollowLinks(destFile);
        common.unlinkSync(destFile); // re-link it
      } catch (e) {
        // it doesn't exist, so no work needs to be done
      }
      fs.symlinkSync(symlinkFull, destFile, isWindows ? 'junction' : null);
    } else if (srcFileStat.isSymbolicLink() && opts.followsymlink) {
      srcFileStat = common.statFollowLinks(srcFile);
      if (srcFileStat.isDirectory()) {
        cpdirSyncRecursive(srcFile, destFile, currentDepth, opts);
      } else {
        copyFileSync(srcFile, destFile, opts);
      }
    } else {
      /* At this point, we've hit a file actually worth copying... so copy it on over. */
      if (fs.existsSync(destFile) && opts.no_force) {
        common.log('skipping existing file: ' + files[i]);
      } else {
        copyFileSync(srcFile, destFile, opts);
      }
    }
  } // for files

  // finally change the mode for the newly created directory (otherwise, we
  // couldn't add files to a read-only directory).
  var checkDir = common.statFollowLinks(sourceDir);
  fs.chmodSync(destDir, checkDir.mode);
} // cpdirSyncRecursive

// Checks if cureent file was created recently
function checkRecentCreated(sources, index) {
  var lookedSource = sources[index];
  return sources.slice(0, index).some(function (src) {
    return path.basename(src) === path.basename(lookedSource);
  });
}

function cpcheckcycle(sourceDir, srcFile) {
  var srcFileStat = common.statNoFollowLinks(srcFile);
  if (srcFileStat.isSymbolicLink()) {
    // Do cycle check. For example:
    //   $ mkdir -p 1/2/3/4
    //   $ cd  1/2/3/4
    //   $ ln -s ../../3 link
    //   $ cd ../../../..
    //   $ cp -RL 1 copy
    var cyclecheck = common.statFollowLinks(srcFile);
    if (cyclecheck.isDirectory()) {
      var sourcerealpath = fs.realpathSync(sourceDir);
      var symlinkrealpath = fs.realpathSync(srcFile);
      var re = new RegExp(symlinkrealpath);
      if (re.test(sourcerealpath)) {
        return true;
      }
    }
  }
  return false;
}

//@
//@ ### cp([options,] source [, source ...], dest)
//@ ### cp([options,] source_array, dest)
//@
//@ Available options:
//@
//@ + `-f`: force (default behavior)
//@ + `-n`: no-clobber
//@ + `-u`: only copy if `source` is newer than `dest`
//@ + `-r`, `-R`: recursive
//@ + `-L`: follow symlinks
//@ + `-P`: don't follow symlinks
//@
//@ Examples:
//@
//@ ```javascript
//@ cp('file1', 'dir1');
//@ cp('-R', 'path/to/dir/', '~/newCopy/');
//@ cp('-Rf', '/tmp/*', '/usr/local/*', '/home/tmp');
//@ cp('-Rf', ['/tmp/*', '/usr/local/*'], '/home/tmp'); // same as above
//@ ```
//@
//@ Copies files.
function _cp(options, sources, dest) {
  // If we're missing -R, it actually implies -L (unless -P is explicit)
  if (options.followsymlink) {
    options.noFollowsymlink = false;
  }
  if (!options.recursive && !options.noFollowsymlink) {
    options.followsymlink = true;
  }

  // Get sources, dest
  if (arguments.length < 3) {
    common.error('missing <source> and/or <dest>');
  } else {
    sources = [].slice.call(arguments, 1, arguments.length - 1);
    dest = arguments[arguments.length - 1];
  }

  var destExists = fs.existsSync(dest);
  var destStat = destExists && common.statFollowLinks(dest);

  // Dest is not existing dir, but multiple sources given
  if ((!destExists || !destStat.isDirectory()) && sources.length > 1) {
    common.error('dest is not a directory (too many sources)');
  }

  // Dest is an existing file, but -n is given
  if (destExists && destStat.isFile() && options.no_force) {
    return new common.ShellString('', '', 0);
  }

  sources.forEach(function (src, srcIndex) {
    if (!fs.existsSync(src)) {
      if (src === '') src = "''"; // if src was empty string, display empty string
      common.error('no such file or directory: ' + src, { continue: true });
      return; // skip file
    }
    var srcStat = common.statFollowLinks(src);
    if (!options.noFollowsymlink && srcStat.isDirectory()) {
      if (!options.recursive) {
        // Non-Recursive
        common.error("omitting directory '" + src + "'", { continue: true });
      } else {
        // Recursive
        // 'cp /a/source dest' should create 'source' in 'dest'
        var newDest = (destStat && destStat.isDirectory()) ?
            path.join(dest, path.basename(src)) :
            dest;

        try {
          common.statFollowLinks(path.dirname(dest));
          cpdirSyncRecursive(src, newDest, 0, { no_force: options.no_force, followsymlink: options.followsymlink });
        } catch (e) {
          /* istanbul ignore next */
          common.error("cannot create directory '" + dest + "': No such file or directory");
        }
      }
    } else {
      // If here, src is a file

      // When copying to '/path/dir':
      //    thisDest = '/path/dir/file1'
      var thisDest = dest;
      if (destStat && destStat.isDirectory()) {
        thisDest = path.normalize(dest + '/' + path.basename(src));
      }

      var thisDestExists = fs.existsSync(thisDest);
      if (thisDestExists && checkRecentCreated(sources, srcIndex)) {
        // cannot overwrite file created recently in current execution, but we want to continue copying other files
        if (!options.no_force) {
          common.error("will not overwrite just-created '" + thisDest + "' with '" + src + "'", { continue: true });
        }
        return;
      }

      if (thisDestExists && options.no_force) {
        return; // skip file
      }

      if (path.relative(src, thisDest) === '') {
        // a file cannot be copied to itself, but we want to continue copying other files
        common.error("'" + thisDest + "' and '" + src + "' are the same file", { continue: true });
        return;
      }

      copyFileSync(src, thisDest, options);
    }
  }); // forEach(src)

  return new common.ShellString('', common.state.error, common.state.errorCode);
}
module.exports = _cp;


/***/ }),

/***/ 181:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const http2 = __webpack_require__(565);
const {Writable} = __webpack_require__(794);
const {Agent, globalAgent} = __webpack_require__(899);
const IncomingMessage = __webpack_require__(750);
const urlToOptions = __webpack_require__(507);
const proxyEvents = __webpack_require__(231);
const isRequestPseudoHeader = __webpack_require__(723);
const {
	ERR_INVALID_ARG_TYPE,
	ERR_INVALID_PROTOCOL,
	ERR_HTTP_HEADERS_SENT,
	ERR_INVALID_HTTP_TOKEN,
	ERR_HTTP_INVALID_HEADER_VALUE,
	ERR_INVALID_CHAR
} = __webpack_require__(699);

const {
	HTTP2_HEADER_STATUS,
	HTTP2_HEADER_METHOD,
	HTTP2_HEADER_PATH,
	HTTP2_METHOD_CONNECT
} = http2.constants;

const kHeaders = Symbol('headers');
const kOrigin = Symbol('origin');
const kSession = Symbol('session');
const kOptions = Symbol('options');
const kFlushedHeaders = Symbol('flushedHeaders');
const kJobs = Symbol('jobs');

const isValidHttpToken = /^[\^`\-\w!#$%&*+.|~]+$/;
const isInvalidHeaderValue = /[^\t\u0020-\u007E\u0080-\u00FF]/;

class ClientRequest extends Writable {
	constructor(input, options, callback) {
		super({
			autoDestroy: false
		});

		const hasInput = typeof input === 'string' || input instanceof URL;
		if (hasInput) {
			input = urlToOptions(input instanceof URL ? input : new URL(input));
		}

		if (typeof options === 'function' || options === undefined) {
			// (options, callback)
			callback = options;
			options = hasInput ? input : {...input};
		} else {
			// (input, options, callback)
			options = {...input, ...options};
		}

		if (options.h2session) {
			this[kSession] = options.h2session;
		} else if (options.agent === false) {
			this.agent = new Agent({maxFreeSessions: 0});
		} else if (typeof options.agent === 'undefined' || options.agent === null) {
			if (typeof options.createConnection === 'function') {
				// This is a workaround - we don't have to create the session on our own.
				this.agent = new Agent({maxFreeSessions: 0});
				this.agent.createConnection = options.createConnection;
			} else {
				this.agent = globalAgent;
			}
		} else if (typeof options.agent.request === 'function') {
			this.agent = options.agent;
		} else {
			throw new ERR_INVALID_ARG_TYPE('options.agent', ['Agent-like Object', 'undefined', 'false'], options.agent);
		}

		if (options.protocol && options.protocol !== 'https:') {
			throw new ERR_INVALID_PROTOCOL(options.protocol, 'https:');
		}

		const port = options.port || options.defaultPort || (this.agent && this.agent.defaultPort) || 443;
		const host = options.hostname || options.host || 'localhost';

		// Don't enforce the origin via options. It may be changed in an Agent.
		delete options.hostname;
		delete options.host;
		delete options.port;

		const {timeout} = options;
		options.timeout = undefined;

		this[kHeaders] = Object.create(null);
		this[kJobs] = [];

		this.socket = null;
		this.connection = null;

		this.method = options.method || 'GET';
		this.path = options.path;

		this.res = null;
		this.aborted = false;
		this.reusedSocket = false;

		if (options.headers) {
			for (const [header, value] of Object.entries(options.headers)) {
				this.setHeader(header, value);
			}
		}

		if (options.auth && !('authorization' in this[kHeaders])) {
			this[kHeaders].authorization = 'Basic ' + Buffer.from(options.auth).toString('base64');
		}

		options.session = options.tlsSession;
		options.path = options.socketPath;

		this[kOptions] = options;

		// Clients that generate HTTP/2 requests directly SHOULD use the :authority pseudo-header field instead of the Host header field.
		if (port === 443) {
			this[kOrigin] = `https://${host}`;

			if (!(':authority' in this[kHeaders])) {
				this[kHeaders][':authority'] = host;
			}
		} else {
			this[kOrigin] = `https://${host}:${port}`;

			if (!(':authority' in this[kHeaders])) {
				this[kHeaders][':authority'] = `${host}:${port}`;
			}
		}

		if (timeout) {
			this.setTimeout(timeout);
		}

		if (callback) {
			this.once('response', callback);
		}

		this[kFlushedHeaders] = false;
	}

	get method() {
		return this[kHeaders][HTTP2_HEADER_METHOD];
	}

	set method(value) {
		if (value) {
			this[kHeaders][HTTP2_HEADER_METHOD] = value.toUpperCase();
		}
	}

	get path() {
		return this[kHeaders][HTTP2_HEADER_PATH];
	}

	set path(value) {
		if (value) {
			this[kHeaders][HTTP2_HEADER_PATH] = value;
		}
	}

	get _mustNotHaveABody() {
		return this.method === 'GET' || this.method === 'HEAD' || this.method === 'DELETE';
	}

	_write(chunk, encoding, callback) {
		// https://github.com/nodejs/node/blob/654df09ae0c5e17d1b52a900a545f0664d8c7627/lib/internal/http2/util.js#L148-L156
		if (this._mustNotHaveABody) {
			callback(new Error('The GET, HEAD and DELETE methods must NOT have a body'));
			/* istanbul ignore next: Node.js 12 throws directly */
			return;
		}

		this.flushHeaders();

		const callWrite = () => this._request.write(chunk, encoding, callback);
		if (this._request) {
			callWrite();
		} else {
			this[kJobs].push(callWrite);
		}
	}

	_final(callback) {
		if (this.destroyed) {
			return;
		}

		this.flushHeaders();

		const callEnd = () => {
			// For GET, HEAD and DELETE
			if (this._mustNotHaveABody) {
				callback();
				return;
			}

			this._request.end(callback);
		};

		if (this._request) {
			callEnd();
		} else {
			this[kJobs].push(callEnd);
		}
	}

	abort() {
		if (this.res && this.res.complete) {
			return;
		}

		if (!this.aborted) {
			process.nextTick(() => this.emit('abort'));
		}

		this.aborted = true;

		this.destroy();
	}

	_destroy(error, callback) {
		if (this.res) {
			this.res._dump();
		}

		if (this._request) {
			this._request.destroy();
		}

		callback(error);
	}

	async flushHeaders() {
		if (this[kFlushedHeaders] || this.destroyed) {
			return;
		}

		this[kFlushedHeaders] = true;

		const isConnectMethod = this.method === HTTP2_METHOD_CONNECT;

		// The real magic is here
		const onStream = stream => {
			this._request = stream;

			if (this.destroyed) {
				stream.destroy();
				return;
			}

			// Forwards `timeout`, `continue`, `close` and `error` events to this instance.
			if (!isConnectMethod) {
				proxyEvents(stream, this, ['timeout', 'continue', 'close', 'error']);
			}

			// Wait for the `finish` event. We don't want to emit the `response` event
			// before `request.end()` is called.
			const waitForEnd = fn => {
				return (...args) => {
					if (!this.writable && !this.destroyed) {
						fn(...args);
					} else {
						this.once('finish', () => {
							fn(...args);
						});
					}
				};
			};

			// This event tells we are ready to listen for the data.
			stream.once('response', waitForEnd((headers, flags, rawHeaders) => {
				// If we were to emit raw request stream, it would be as fast as the native approach.
				// Note that wrapping the raw stream in a Proxy instance won't improve the performance (already tested it).
				const response = new IncomingMessage(this.socket, stream.readableHighWaterMark);
				this.res = response;

				response.req = this;
				response.statusCode = headers[HTTP2_HEADER_STATUS];
				response.headers = headers;
				response.rawHeaders = rawHeaders;

				response.once('end', () => {
					if (this.aborted) {
						response.aborted = true;
						response.emit('aborted');
					} else {
						response.complete = true;

						// Has no effect, just be consistent with the Node.js behavior
						response.socket = null;
						response.connection = null;
					}
				});

				if (isConnectMethod) {
					response.upgrade = true;

					// The HTTP1 API says the socket is detached here,
					// but we can't do that so we pass the original HTTP2 request.
					if (this.emit('connect', response, stream, Buffer.alloc(0))) {
						this.emit('close');
					} else {
						// No listeners attached, destroy the original request.
						stream.destroy();
					}
				} else {
					// Forwards data
					stream.on('data', chunk => {
						if (!response._dumped && !response.push(chunk)) {
							stream.pause();
						}
					});

					stream.once('end', () => {
						response.push(null);
					});

					if (!this.emit('response', response)) {
						// No listeners attached, dump the response.
						response._dump();
					}
				}
			}));

			// Emits `information` event
			stream.once('headers', waitForEnd(
				headers => this.emit('information', {statusCode: headers[HTTP2_HEADER_STATUS]})
			));

			stream.once('trailers', waitForEnd((trailers, flags, rawTrailers) => {
				const {res} = this;

				// Assigns trailers to the response object.
				res.trailers = trailers;
				res.rawTrailers = rawTrailers;
			}));

			const {socket} = stream.session;
			this.socket = socket;
			this.connection = socket;

			for (const job of this[kJobs]) {
				job();
			}

			this.emit('socket', this.socket);
		};

		// Makes a HTTP2 request
		if (this[kSession]) {
			try {
				onStream(this[kSession].request(this[kHeaders]));
			} catch (error) {
				this.emit('error', error);
			}
		} else {
			this.reusedSocket = true;

			try {
				onStream(await this.agent.request(this[kOrigin], this[kOptions], this[kHeaders]));
			} catch (error) {
				this.emit('error', error);
			}
		}
	}

	getHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		return this[kHeaders][name.toLowerCase()];
	}

	get headersSent() {
		return this[kFlushedHeaders];
	}

	removeHeader(name) {
		if (typeof name !== 'string') {
			throw new ERR_INVALID_ARG_TYPE('name', 'string', name);
		}

		if (this.headersSent) {
			throw new ERR_HTTP_HEADERS_SENT('remove');
		}

		delete this[kHeaders][name.toLowerCase()];
	}

	setHeader(name, value) {
		if (this.headersSent) {
			throw new ERR_HTTP_HEADERS_SENT('set');
		}

		if (typeof name !== 'string' || (!isValidHttpToken.test(name) && !isRequestPseudoHeader(name))) {
			throw new ERR_INVALID_HTTP_TOKEN('Header name', name);
		}

		if (typeof value === 'undefined') {
			throw new ERR_HTTP_INVALID_HEADER_VALUE(value, name);
		}

		if (isInvalidHeaderValue.test(value)) {
			throw new ERR_INVALID_CHAR('header content', name);
		}

		this[kHeaders][name.toLowerCase()] = value;
	}

	setNoDelay() {
		// HTTP2 sockets cannot be malformed, do nothing.
	}

	setSocketKeepAlive() {
		// HTTP2 sockets cannot be malformed, do nothing.
	}

	setTimeout(ms, callback) {
		const applyTimeout = () => this._request.setTimeout(ms, callback);

		if (this._request) {
			applyTimeout();
		} else {
			this[kJobs].push(applyTimeout);
		}

		return this;
	}

	get maxHeadersCount() {
		if (!this.destroyed && this._request) {
			return this._request.session.localSettings.maxHeaderListSize;
		}

		return undefined;
	}

	set maxHeadersCount(_value) {
		// Updating HTTP2 settings would affect all requests, do nothing.
	}
}

module.exports = ClientRequest;


/***/ }),

/***/ 186:
/***/ (function(module, __unusedexports, __webpack_require__) {

const lcid = __webpack_require__(263)
const iso = __webpack_require__(620)
const langs = __webpack_require__(601).all()

const all = []

let lcidLanguage
let isoLanguage

const lcidKeys = Object.keys(lcid)
const isoKeys = Object.keys(iso)

lcidKeys.map(id => {
	lcidLanguage = id
	const locale = {
		name: lcid[lcidLanguage].language,
		local: null,
		location: lcid[lcidLanguage].location,
		tag: lcid[lcidLanguage].tag,
		lcid: lcid[lcidLanguage].id,
		'iso639-2': null,
		'iso639-1': null
	}

	isoLanguage = isoKeys.find(name => name.toLowerCase() === lcid[lcidLanguage].language.toLowerCase())
	if (isoLanguage) {
		locale['iso639-2'] = iso[isoLanguage]['iso639-2']
		locale['iso639-1'] = iso[isoLanguage]['iso639-1']

		const nameLocal = langs.find(element => {
			if (element['2T']) {
				return element['2T'].toLowerCase() === locale['iso639-2']
			}

			return false
		})

		if (nameLocal) {
			locale.local = nameLocal.local
		}
	}

	all.push(locale)
})

const where = (key = 'name', text = '') => {
	if (key === 'lcid') {
		return all.find(element => element[key] === text)
	}

	return all.find(element => element[key].toLowerCase() === text.toLowerCase())
}

const getByName = text => where('name', text)

const getByNameLocal = text => where('local', text)

const getByLocation = text => where('location', text)

const getByTag = text => where('tag', text)

const getByLCID = id => where('lcid', Number(id))

const getByISO6392 = text => where('iso639-2', text)

const getByISO6391 = text => where('iso639-1', text)

module.exports = {
	all,
	where,
	getByName,
	getByNameLocal,
	getByLocation,
	getByTag,
	getByLCID,
	getByISO6392,
	getByISO6391
}


/***/ }),

/***/ 188:
/***/ (function() {

// see dirs.js


/***/ }),

/***/ 189:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const alreadyWarned = new Set();
exports.default = (message) => {
    if (alreadyWarned.has(message)) {
        return;
    }
    alreadyWarned.add(message);
    // @ts-expect-error Missing types.
    process.emitWarning(`Got: ${message}`, {
        type: 'DeprecationWarning'
    });
};


/***/ }),

/***/ 199:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('grep', _grep, {
  globStart: 2, // don't glob-expand the regex
  canReceivePipe: true,
  cmdOptions: {
    'v': 'inverse',
    'l': 'nameOnly',
    'i': 'ignoreCase',
  },
});

//@
//@ ### grep([options,] regex_filter, file [, file ...])
//@ ### grep([options,] regex_filter, file_array)
//@
//@ Available options:
//@
//@ + `-v`: Invert `regex_filter` (only print non-matching lines).
//@ + `-l`: Print only filenames of matching files.
//@ + `-i`: Ignore case.
//@
//@ Examples:
//@
//@ ```javascript
//@ grep('-v', 'GLOBAL_VARIABLE', '*.js');
//@ grep('GLOBAL_VARIABLE', '*.js');
//@ ```
//@
//@ Reads input string from given files and returns a string containing all lines of the
//@ file that match the given `regex_filter`.
function _grep(options, regex, files) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no paths given', 2);

  files = [].slice.call(arguments, 2);

  if (pipe) {
    files.unshift('-');
  }

  var grep = [];
  if (options.ignoreCase) {
    regex = new RegExp(regex, 'i');
  }
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      common.error('no such file or directory: ' + file, 2, { continue: true });
      return;
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
    if (options.nameOnly) {
      if (contents.match(regex)) {
        grep.push(file);
      }
    } else {
      var lines = contents.split('\n');
      lines.forEach(function (line) {
        var matched = line.match(regex);
        if ((options.inverse && !matched) || (!options.inverse && matched)) {
          grep.push(line);
        }
      });
    }
  });

  return grep.join('\n') + '\n';
}
module.exports = _grep;


/***/ }),

/***/ 205:
/***/ (function(__unusedmodule, exports) {

//TODO: handle reviver/dehydrate function like normal
//and handle indentation, like normal.
//if anyone needs this... please send pull request.

exports.stringify = function stringify (o) {
  if('undefined' == typeof o) return o

  if(o && Buffer.isBuffer(o))
    return JSON.stringify(':base64:' + o.toString('base64'))

  if(o && o.toJSON)
    o =  o.toJSON()

  if(o && 'object' === typeof o) {
    var s = ''
    var array = Array.isArray(o)
    s = array ? '[' : '{'
    var first = true

    for(var k in o) {
      var ignore = 'function' == typeof o[k] || (!array && 'undefined' === typeof o[k])
      if(Object.hasOwnProperty.call(o, k) && !ignore) {
        if(!first)
          s += ','
        first = false
        if (array) {
          if(o[k] == undefined)
            s += 'null'
          else
            s += stringify(o[k])
        } else if (o[k] !== void(0)) {
          s += stringify(k) + ':' + stringify(o[k])
        }
      }
    }

    s += array ? ']' : '}'

    return s
  } else if ('string' === typeof o) {
    return JSON.stringify(/^:/.test(o) ? ':' + o : o)
  } else if ('undefined' === typeof o) {
    return 'null';
  } else
    return JSON.stringify(o)
}

exports.parse = function (s) {
  return JSON.parse(s, function (key, value) {
    if('string' === typeof value) {
      if(/^:base64:/.test(value))
        return Buffer.from(value.substring(8), 'base64')
      else
        return /^:/.test(value) ? value.substring(1) : value 
    }
    return value
  })
}


/***/ }),

/***/ 211:
/***/ (function(module) {

module.exports = require("https");

/***/ }),

/***/ 216:
/***/ (function(module, __unusedexports, __webpack_require__) {

var path = __webpack_require__(622);
var common = __webpack_require__(602);
var _ls = __webpack_require__(705);

common.register('find', _find, {});

//@
//@ ### find(path [, path ...])
//@ ### find(path_array)
//@
//@ Examples:
//@
//@ ```javascript
//@ find('src', 'lib');
//@ find(['src', 'lib']); // same as above
//@ find('.').filter(function(file) { return file.match(/\.js$/); });
//@ ```
//@
//@ Returns array of all files (however deep) in the given paths.
//@
//@ The main difference from `ls('-R', path)` is that the resulting file names
//@ include the base directories (e.g., `lib/resources/file1` instead of just `file1`).
function _find(options, paths) {
  if (!paths) {
    common.error('no path specified');
  } else if (typeof paths === 'string') {
    paths = [].slice.call(arguments, 1);
  }

  var list = [];

  function pushFile(file) {
    if (process.platform === 'win32') {
      file = file.replace(/\\/g, '/');
    }
    list.push(file);
  }

  // why not simply do `ls('-R', paths)`? because the output wouldn't give the base dirs
  // to get the base dir in the output, we need instead `ls('-R', 'dir/*')` for every directory

  paths.forEach(function (file) {
    var stat;
    try {
      stat = common.statFollowLinks(file);
    } catch (e) {
      common.error('no such file or directory: ' + file);
    }

    pushFile(file);

    if (stat.isDirectory()) {
      _ls({ recursive: true, all: true }, file).forEach(function (subfile) {
        pushFile(path.join(file, subfile));
      });
    }
  });

  return list;
}
module.exports = _find;


/***/ }),

/***/ 231:
/***/ (function(module) {

"use strict";


module.exports = (from, to, events) => {
	for (const event of events) {
		from.on(event, (...args) => to.emit(event, ...args));
	}
};


/***/ }),

/***/ 233:
/***/ (function(module) {

module.exports = [
  'cat',
  'cd',
  'chmod',
  'cp',
  'dirs',
  'echo',
  'exec',
  'find',
  'grep',
  'head',
  'ln',
  'ls',
  'mkdir',
  'mv',
  'pwd',
  'rm',
  'sed',
  'set',
  'sort',
  'tail',
  'tempdir',
  'test',
  'to',
  'toEnd',
  'touch',
  'uniq',
  'which',
];


/***/ }),

/***/ 236:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

// TODO: Use the `URL` global when targeting Node.js 10
const URLParser = typeof URL === 'undefined' ? __webpack_require__(835).URL : URL;

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
const DATA_URL_DEFAULT_MIME_TYPE = 'text/plain';
const DATA_URL_DEFAULT_CHARSET = 'us-ascii';

const testParameter = (name, filters) => {
	return filters.some(filter => filter instanceof RegExp ? filter.test(name) : filter === name);
};

const normalizeDataURL = (urlString, {stripHash}) => {
	const parts = urlString.match(/^data:(.*?),(.*?)(?:#(.*))?$/);

	if (!parts) {
		throw new Error(`Invalid URL: ${urlString}`);
	}

	const mediaType = parts[1].split(';');
	const body = parts[2];
	const hash = stripHash ? '' : parts[3];

	let base64 = false;

	if (mediaType[mediaType.length - 1] === 'base64') {
		mediaType.pop();
		base64 = true;
	}

	// Lowercase MIME type
	const mimeType = (mediaType.shift() || '').toLowerCase();
	const attributes = mediaType
		.map(attribute => {
			let [key, value = ''] = attribute.split('=').map(string => string.trim());

			// Lowercase `charset`
			if (key === 'charset') {
				value = value.toLowerCase();

				if (value === DATA_URL_DEFAULT_CHARSET) {
					return '';
				}
			}

			return `${key}${value ? `=${value}` : ''}`;
		})
		.filter(Boolean);

	const normalizedMediaType = [
		...attributes
	];

	if (base64) {
		normalizedMediaType.push('base64');
	}

	if (normalizedMediaType.length !== 0 || (mimeType && mimeType !== DATA_URL_DEFAULT_MIME_TYPE)) {
		normalizedMediaType.unshift(mimeType);
	}

	return `data:${normalizedMediaType.join(';')},${base64 ? body.trim() : body}${hash ? `#${hash}` : ''}`;
};

const normalizeUrl = (urlString, options) => {
	options = {
		defaultProtocol: 'http:',
		normalizeProtocol: true,
		forceHttp: false,
		forceHttps: false,
		stripAuthentication: true,
		stripHash: false,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeDirectoryIndex: false,
		sortQueryParameters: true,
		...options
	};

	// TODO: Remove this at some point in the future
	if (Reflect.has(options, 'normalizeHttps')) {
		throw new Error('options.normalizeHttps is renamed to options.forceHttp');
	}

	if (Reflect.has(options, 'normalizeHttp')) {
		throw new Error('options.normalizeHttp is renamed to options.forceHttps');
	}

	if (Reflect.has(options, 'stripFragment')) {
		throw new Error('options.stripFragment is renamed to options.stripHash');
	}

	urlString = urlString.trim();

	// Data URL
	if (/^data:/i.test(urlString)) {
		return normalizeDataURL(urlString, options);
	}

	const hasRelativeProtocol = urlString.startsWith('//');
	const isRelativeUrl = !hasRelativeProtocol && /^\.*\//.test(urlString);

	// Prepend protocol
	if (!isRelativeUrl) {
		urlString = urlString.replace(/^(?!(?:\w+:)?\/\/)|^\/\//, options.defaultProtocol);
	}

	const urlObj = new URLParser(urlString);

	if (options.forceHttp && options.forceHttps) {
		throw new Error('The `forceHttp` and `forceHttps` options cannot be used together');
	}

	if (options.forceHttp && urlObj.protocol === 'https:') {
		urlObj.protocol = 'http:';
	}

	if (options.forceHttps && urlObj.protocol === 'http:') {
		urlObj.protocol = 'https:';
	}

	// Remove auth
	if (options.stripAuthentication) {
		urlObj.username = '';
		urlObj.password = '';
	}

	// Remove hash
	if (options.stripHash) {
		urlObj.hash = '';
	}

	// Remove duplicate slashes if not preceded by a protocol
	if (urlObj.pathname) {
		// TODO: Use the following instead when targeting Node.js 10
		// `urlObj.pathname = urlObj.pathname.replace(/(?<!https?:)\/{2,}/g, '/');`
		urlObj.pathname = urlObj.pathname.replace(/((?!:).|^)\/{2,}/g, (_, p1) => {
			if (/^(?!\/)/g.test(p1)) {
				return `${p1}/`;
			}

			return '/';
		});
	}

	// Decode URI octets
	if (urlObj.pathname) {
		urlObj.pathname = decodeURI(urlObj.pathname);
	}

	// Remove directory index
	if (options.removeDirectoryIndex === true) {
		options.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(options.removeDirectoryIndex) && options.removeDirectoryIndex.length > 0) {
		let pathComponents = urlObj.pathname.split('/');
		const lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, options.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, pathComponents.length - 1);
			urlObj.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	if (urlObj.hostname) {
		// Remove trailing dot
		urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

		// Remove `www.`
		if (options.stripWWW && /^www\.([a-z\-\d]{2,63})\.([a-z.]{2,5})$/.test(urlObj.hostname)) {
			// Each label should be max 63 at length (min: 2).
			// The extension should be max 5 at length (min: 2).
			// Source: https://en.wikipedia.org/wiki/Hostname#Restrictions_on_valid_host_names
			urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
		}
	}

	// Remove query unwanted parameters
	if (Array.isArray(options.removeQueryParameters)) {
		for (const key of [...urlObj.searchParams.keys()]) {
			if (testParameter(key, options.removeQueryParameters)) {
				urlObj.searchParams.delete(key);
			}
		}
	}

	// Sort query parameters
	if (options.sortQueryParameters) {
		urlObj.searchParams.sort();
	}

	if (options.removeTrailingSlash) {
		urlObj.pathname = urlObj.pathname.replace(/\/$/, '');
	}

	// Take advantage of many of the Node `url` normalizations
	urlString = urlObj.toString();

	// Remove ending `/`
	if ((options.removeTrailingSlash || urlObj.pathname === '/') && urlObj.hash === '') {
		urlString = urlString.replace(/\/$/, '');
	}

	// Restore relative protocol, if applicable
	if (hasRelativeProtocol && !options.normalizeProtocol) {
		urlString = urlString.replace(/^http:\/\//, '//');
	}

	// Remove http/https
	if (options.stripProtocol) {
		urlString = urlString.replace(/^(?:https?:)?\/\//, '');
	}

	return urlString;
};

module.exports = normalizeUrl;
// TODO: Remove this for the next major release
module.exports.default = normalizeUrl;


/***/ }),

/***/ 240:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('toEnd', _toEnd, {
  pipeOnly: true,
  wrapOutput: false,
});

//@
//@ ### ShellString.prototype.toEnd(file)
//@
//@ Examples:
//@
//@ ```javascript
//@ cat('input.txt').toEnd('output.txt');
//@ ```
//@
//@ Analogous to the redirect-and-append operator `>>` in Unix, but works with
//@ `ShellStrings` (such as those returned by `cat`, `grep`, etc.).
function _toEnd(options, file) {
  if (!file) common.error('wrong arguments');

  if (!fs.existsSync(path.dirname(file))) {
    common.error('no such file or directory: ' + path.dirname(file));
  }

  try {
    fs.appendFileSync(file, this.stdout || this.toString(), 'utf8');
    return this;
  } catch (e) {
    /* istanbul ignore next */
    common.error('could not append to file (code ' + e.code + '): ' + file, { continue: true });
  }
}
module.exports = _toEnd;


/***/ }),

/***/ 245:
/***/ (function(module) {

// HumanizeDuration.js - https://git.io/j0HgmQ

/* global define, module */

(function () {
  // This has to be defined separately because of a bug: we want to alias
  // `gr` and `el` for backwards-compatiblity. In a breaking change, we can
  // remove `gr` entirely.
  // See https://github.com/EvanHahn/HumanizeDuration.js/issues/143 for more.
  var greek = {
    y: function (c) {
      return c === 1 ? "χρόνος" : "χρόνια";
    },
    mo: function (c) {
      return c === 1 ? "μήνας" : "μήνες";
    },
    w: function (c) {
      return c === 1 ? "εβδομάδα" : "εβδομάδες";
    },
    d: function (c) {
      return c === 1 ? "μέρα" : "μέρες";
    },
    h: function (c) {
      return c === 1 ? "ώρα" : "ώρες";
    },
    m: function (c) {
      return c === 1 ? "λεπτό" : "λεπτά";
    },
    s: function (c) {
      return c === 1 ? "δευτερόλεπτο" : "δευτερόλεπτα";
    },
    ms: function (c) {
      return c === 1
        ? "χιλιοστό του δευτερολέπτου"
        : "χιλιοστά του δευτερολέπτου";
    },
    decimal: ",",
  };

  var LANGUAGES = {
    ar: {
      y: function (c) {
        return c === 1 ? "سنة" : "سنوات";
      },
      mo: function (c) {
        return c === 1 ? "شهر" : "أشهر";
      },
      w: function (c) {
        return c === 1 ? "أسبوع" : "أسابيع";
      },
      d: function (c) {
        return c === 1 ? "يوم" : "أيام";
      },
      h: function (c) {
        return c === 1 ? "ساعة" : "ساعات";
      },
      m: function (c) {
        return c > 2 && c < 11 ? "دقائق" : "دقيقة";
      },
      s: function (c) {
        return c === 1 ? "ثانية" : "ثواني";
      },
      ms: function (c) {
        return c === 1 ? "جزء من الثانية" : "أجزاء من الثانية";
      },
      decimal: ",",
    },
    bg: {
      y: function (c) {
        return ["години", "година", "години"][getSlavicForm(c)];
      },
      mo: function (c) {
        return ["месеца", "месец", "месеца"][getSlavicForm(c)];
      },
      w: function (c) {
        return ["седмици", "седмица", "седмици"][getSlavicForm(c)];
      },
      d: function (c) {
        return ["дни", "ден", "дни"][getSlavicForm(c)];
      },
      h: function (c) {
        return ["часа", "час", "часа"][getSlavicForm(c)];
      },
      m: function (c) {
        return ["минути", "минута", "минути"][getSlavicForm(c)];
      },
      s: function (c) {
        return ["секунди", "секунда", "секунди"][getSlavicForm(c)];
      },
      ms: function (c) {
        return ["милисекунди", "милисекунда", "милисекунди"][getSlavicForm(c)];
      },
      decimal: ",",
    },
    ca: {
      y: function (c) {
        return "any" + (c === 1 ? "" : "s");
      },
      mo: function (c) {
        return "mes" + (c === 1 ? "" : "os");
      },
      w: function (c) {
        return "setman" + (c === 1 ? "a" : "es");
      },
      d: function (c) {
        return "di" + (c === 1 ? "a" : "es");
      },
      h: function (c) {
        return "hor" + (c === 1 ? "a" : "es");
      },
      m: function (c) {
        return "minut" + (c === 1 ? "" : "s");
      },
      s: function (c) {
        return "segon" + (c === 1 ? "" : "s");
      },
      ms: function (c) {
        return "milisegon" + (c === 1 ? "" : "s");
      },
      decimal: ",",
    },
    cs: {
      y: function (c) {
        return ["rok", "roku", "roky", "let"][getCzechOrSlovakForm(c)];
      },
      mo: function (c) {
        return ["měsíc", "měsíce", "měsíce", "měsíců"][getCzechOrSlovakForm(c)];
      },
      w: function (c) {
        return ["týden", "týdne", "týdny", "týdnů"][getCzechOrSlovakForm(c)];
      },
      d: function (c) {
        return ["den", "dne", "dny", "dní"][getCzechOrSlovakForm(c)];
      },
      h: function (c) {
        return ["hodina", "hodiny", "hodiny", "hodin"][getCzechOrSlovakForm(c)];
      },
      m: function (c) {
        return ["minuta", "minuty", "minuty", "minut"][getCzechOrSlovakForm(c)];
      },
      s: function (c) {
        return ["sekunda", "sekundy", "sekundy", "sekund"][
          getCzechOrSlovakForm(c)
        ];
      },
      ms: function (c) {
        return ["milisekunda", "milisekundy", "milisekundy", "milisekund"][
          getCzechOrSlovakForm(c)
        ];
      },
      decimal: ",",
    },
    da: {
      y: "år",
      mo: function (c) {
        return "måned" + (c === 1 ? "" : "er");
      },
      w: function (c) {
        return "uge" + (c === 1 ? "" : "r");
      },
      d: function (c) {
        return "dag" + (c === 1 ? "" : "e");
      },
      h: function (c) {
        return "time" + (c === 1 ? "" : "r");
      },
      m: function (c) {
        return "minut" + (c === 1 ? "" : "ter");
      },
      s: function (c) {
        return "sekund" + (c === 1 ? "" : "er");
      },
      ms: function (c) {
        return "millisekund" + (c === 1 ? "" : "er");
      },
      decimal: ",",
    },
    de: {
      y: function (c) {
        return "Jahr" + (c === 1 ? "" : "e");
      },
      mo: function (c) {
        return "Monat" + (c === 1 ? "" : "e");
      },
      w: function (c) {
        return "Woche" + (c === 1 ? "" : "n");
      },
      d: function (c) {
        return "Tag" + (c === 1 ? "" : "e");
      },
      h: function (c) {
        return "Stunde" + (c === 1 ? "" : "n");
      },
      m: function (c) {
        return "Minute" + (c === 1 ? "" : "n");
      },
      s: function (c) {
        return "Sekunde" + (c === 1 ? "" : "n");
      },
      ms: function (c) {
        return "Millisekunde" + (c === 1 ? "" : "n");
      },
      decimal: ",",
    },
    el: greek,
    en: {
      y: function (c) {
        return "year" + (c === 1 ? "" : "s");
      },
      mo: function (c) {
        return "month" + (c === 1 ? "" : "s");
      },
      w: function (c) {
        return "week" + (c === 1 ? "" : "s");
      },
      d: function (c) {
        return "day" + (c === 1 ? "" : "s");
      },
      h: function (c) {
        return "hour" + (c === 1 ? "" : "s");
      },
      m: function (c) {
        return "minute" + (c === 1 ? "" : "s");
      },
      s: function (c) {
        return "second" + (c === 1 ? "" : "s");
      },
      ms: function (c) {
        return "millisecond" + (c === 1 ? "" : "s");
      },
      decimal: ".",
    },
    es: {
      y: function (c) {
        return "año" + (c === 1 ? "" : "s");
      },
      mo: function (c) {
        return "mes" + (c === 1 ? "" : "es");
      },
      w: function (c) {
        return "semana" + (c === 1 ? "" : "s");
      },
      d: function (c) {
        return "día" + (c === 1 ? "" : "s");
      },
      h: function (c) {
        return "hora" + (c === 1 ? "" : "s");
      },
      m: function (c) {
        return "minuto" + (c === 1 ? "" : "s");
      },
      s: function (c) {
        return "segundo" + (c === 1 ? "" : "s");
      },
      ms: function (c) {
        return "milisegundo" + (c === 1 ? "" : "s");
      },
      decimal: ",",
    },
    et: {
      y: function (c) {
        return "aasta" + (c === 1 ? "" : "t");
      },
      mo: function (c) {
        return "kuu" + (c === 1 ? "" : "d");
      },
      w: function (c) {
        return "nädal" + (c === 1 ? "" : "at");
      },
      d: function (c) {
        return "päev" + (c === 1 ? "" : "a");
      },
      h: function (c) {
        return "tund" + (c === 1 ? "" : "i");
      },
      m: function (c) {
        return "minut" + (c === 1 ? "" : "it");
      },
      s: function (c) {
        return "sekund" + (c === 1 ? "" : "it");
      },
      ms: function (c) {
        return "millisekund" + (c === 1 ? "" : "it");
      },
      decimal: ",",
    },
    fa: {
      y: "سال",
      mo: "ماه",
      w: "هفته",
      d: "روز",
      h: "ساعت",
      m: "دقیقه",
      s: "ثانیه",
      ms: "میلی ثانیه",
      decimal: ".",
    },
    fi: {
      y: function (c) {
        return c === 1 ? "vuosi" : "vuotta";
      },
      mo: function (c) {
        return c === 1 ? "kuukausi" : "kuukautta";
      },
      w: function (c) {
        return "viikko" + (c === 1 ? "" : "a");
      },
      d: function (c) {
        return "päivä" + (c === 1 ? "" : "ä");
      },
      h: function (c) {
        return "tunti" + (c === 1 ? "" : "a");
      },
      m: function (c) {
        return "minuutti" + (c === 1 ? "" : "a");
      },
      s: function (c) {
        return "sekunti" + (c === 1 ? "" : "a");
      },
      ms: function (c) {
        return "millisekunti" + (c === 1 ? "" : "a");
      },
      decimal: ",",
    },
    fo: {
      y: "ár",
      mo: function (c) {
        return c === 1 ? "mánaður" : "mánaðir";
      },
      w: function (c) {
        return c === 1 ? "vika" : "vikur";
      },
      d: function (c) {
        return c === 1 ? "dagur" : "dagar";
      },
      h: function (c) {
        return c === 1 ? "tími" : "tímar";
      },
      m: function (c) {
        return c === 1 ? "minuttur" : "minuttir";
      },
      s: "sekund",
      ms: "millisekund",
      decimal: ",",
    },
    fr: {
      y: function (c) {
        return "an" + (c >= 2 ? "s" : "");
      },
      mo: "mois",
      w: function (c) {
        return "semaine" + (c >= 2 ? "s" : "");
      },
      d: function (c) {
        return "jour" + (c >= 2 ? "s" : "");
      },
      h: function (c) {
        return "heure" + (c >= 2 ? "s" : "");
      },
      m: function (c) {
        return "minute" + (c >= 2 ? "s" : "");
      },
      s: function (c) {
        return "seconde" + (c >= 2 ? "s" : "");
      },
      ms: function (c) {
        return "milliseconde" + (c >= 2 ? "s" : "");
      },
      decimal: ",",
    },
    gr: greek,
    he: {
      y: function (c) {
        return c === 1 ? "שנה" : "שנים";
      },
      mo: function (c) {
        return c === 1 ? "חודש" : "חודשים";
      },
      w: function (c) {
        return c === 1 ? "שבוע" : "שבועות";
      },
      d: function (c) {
        return c === 1 ? "יום" : "ימים";
      },
      h: function (c) {
        return c === 1 ? "שעה" : "שעות";
      },
      m: function (c) {
        return c === 1 ? "דקה" : "דקות";
      },
      s: function (c) {
        return c === 1 ? "שניה" : "שניות";
      },
      ms: function (c) {
        return c === 1 ? "מילישנייה" : "מילישניות";
      },
      decimal: ".",
    },
    hr: {
      y: function (c) {
        if (c % 10 === 2 || c % 10 === 3 || c % 10 === 4) {
          return "godine";
        }
        return "godina";
      },
      mo: function (c) {
        if (c === 1) {
          return "mjesec";
        } else if (c === 2 || c === 3 || c === 4) {
          return "mjeseca";
        }
        return "mjeseci";
      },
      w: function (c) {
        if (c % 10 === 1 && c !== 11) {
          return "tjedan";
        }
        return "tjedna";
      },
      d: function (c) {
        return c === 1 ? "dan" : "dana";
      },
      h: function (c) {
        if (c === 1) {
          return "sat";
        } else if (c === 2 || c === 3 || c === 4) {
          return "sata";
        }
        return "sati";
      },
      m: function (c) {
        var mod10 = c % 10;
        if ((mod10 === 2 || mod10 === 3 || mod10 === 4) && (c < 10 || c > 14)) {
          return "minute";
        }
        return "minuta";
      },
      s: function (c) {
        var mod10 = c % 10;
        if (mod10 === 5 || (Math.floor(c) === c && c >= 10 && c <= 19)) {
          return "sekundi";
        } else if (mod10 === 1) {
          return "sekunda";
        } else if (mod10 === 2 || mod10 === 3 || mod10 === 4) {
          return "sekunde";
        }
        return "sekundi";
      },
      ms: function (c) {
        if (c === 1) {
          return "milisekunda";
        } else if (c % 10 === 2 || c % 10 === 3 || c % 10 === 4) {
          return "milisekunde";
        }
        return "milisekundi";
      },
      decimal: ",",
    },
    hi: {
      y: "साल",
      mo: function (c) {
        return c === 1 ? "महीना" : "महीने";
      },
      w: function (c) {
        return c === 1 ? "हफ़्ता" : "हफ्ते";
      },
      d: "दिन",
      h: function (c) {
        return c === 1 ? "घंटा" : "घंटे";
      },
      m: "मिनट",
      s: "सेकंड",
      ms: "मिलीसेकंड",
      decimal: ".",
    },
    hu: {
      y: "év",
      mo: "hónap",
      w: "hét",
      d: "nap",
      h: "óra",
      m: "perc",
      s: "másodperc",
      ms: "ezredmásodperc",
      decimal: ",",
    },
    id: {
      y: "tahun",
      mo: "bulan",
      w: "minggu",
      d: "hari",
      h: "jam",
      m: "menit",
      s: "detik",
      ms: "milidetik",
      decimal: ".",
    },
    is: {
      y: "ár",
      mo: function (c) {
        return "mánuð" + (c === 1 ? "ur" : "ir");
      },
      w: function (c) {
        return "vik" + (c === 1 ? "a" : "ur");
      },
      d: function (c) {
        return "dag" + (c === 1 ? "ur" : "ar");
      },
      h: function (c) {
        return "klukkutím" + (c === 1 ? "i" : "ar");
      },
      m: function (c) {
        return "mínút" + (c === 1 ? "a" : "ur");
      },
      s: function (c) {
        return "sekúnd" + (c === 1 ? "a" : "ur");
      },
      ms: function (c) {
        return "millisekúnd" + (c === 1 ? "a" : "ur");
      },
      decimal: ".",
    },
    it: {
      y: function (c) {
        return "ann" + (c === 1 ? "o" : "i");
      },
      mo: function (c) {
        return "mes" + (c === 1 ? "e" : "i");
      },
      w: function (c) {
        return "settiman" + (c === 1 ? "a" : "e");
      },
      d: function (c) {
        return "giorn" + (c === 1 ? "o" : "i");
      },
      h: function (c) {
        return "or" + (c === 1 ? "a" : "e");
      },
      m: function (c) {
        return "minut" + (c === 1 ? "o" : "i");
      },
      s: function (c) {
        return "second" + (c === 1 ? "o" : "i");
      },
      ms: function (c) {
        return "millisecond" + (c === 1 ? "o" : "i");
      },
      decimal: ",",
    },
    ja: {
      y: "年",
      mo: "月",
      w: "週",
      d: "日",
      h: "時間",
      m: "分",
      s: "秒",
      ms: "ミリ秒",
      decimal: ".",
    },
    ko: {
      y: "년",
      mo: "개월",
      w: "주일",
      d: "일",
      h: "시간",
      m: "분",
      s: "초",
      ms: "밀리 초",
      decimal: ".",
    },
    lo: {
      y: "ປີ",
      mo: "ເດືອນ",
      w: "ອາທິດ",
      d: "ມື້",
      h: "ຊົ່ວໂມງ",
      m: "ນາທີ",
      s: "ວິນາທີ",
      ms: "ມິນລິວິນາທີ",
      decimal: ",",
    },
    lt: {
      y: function (c) {
        return c % 10 === 0 || (c % 100 >= 10 && c % 100 <= 20)
          ? "metų"
          : "metai";
      },
      mo: function (c) {
        return ["mėnuo", "mėnesiai", "mėnesių"][getLithuanianForm(c)];
      },
      w: function (c) {
        return ["savaitė", "savaitės", "savaičių"][getLithuanianForm(c)];
      },
      d: function (c) {
        return ["diena", "dienos", "dienų"][getLithuanianForm(c)];
      },
      h: function (c) {
        return ["valanda", "valandos", "valandų"][getLithuanianForm(c)];
      },
      m: function (c) {
        return ["minutė", "minutės", "minučių"][getLithuanianForm(c)];
      },
      s: function (c) {
        return ["sekundė", "sekundės", "sekundžių"][getLithuanianForm(c)];
      },
      ms: function (c) {
        return ["milisekundė", "milisekundės", "milisekundžių"][
          getLithuanianForm(c)
        ];
      },
      decimal: ",",
    },
    lv: {
      y: function (c) {
        return getLatvianForm(c) ? "gads" : "gadi";
      },
      mo: function (c) {
        return getLatvianForm(c) ? "mēnesis" : "mēneši";
      },
      w: function (c) {
        return getLatvianForm(c) ? "nedēļa" : "nedēļas";
      },
      d: function (c) {
        return getLatvianForm(c) ? "diena" : "dienas";
      },
      h: function (c) {
        return getLatvianForm(c) ? "stunda" : "stundas";
      },
      m: function (c) {
        return getLatvianForm(c) ? "minūte" : "minūtes";
      },
      s: function (c) {
        return getLatvianForm(c) ? "sekunde" : "sekundes";
      },
      ms: function (c) {
        return getLatvianForm(c) ? "milisekunde" : "milisekundes";
      },
      decimal: ",",
    },
    ms: {
      y: "tahun",
      mo: "bulan",
      w: "minggu",
      d: "hari",
      h: "jam",
      m: "minit",
      s: "saat",
      ms: "milisaat",
      decimal: ".",
    },
    nl: {
      y: "jaar",
      mo: function (c) {
        return c === 1 ? "maand" : "maanden";
      },
      w: function (c) {
        return c === 1 ? "week" : "weken";
      },
      d: function (c) {
        return c === 1 ? "dag" : "dagen";
      },
      h: "uur",
      m: function (c) {
        return c === 1 ? "minuut" : "minuten";
      },
      s: function (c) {
        return c === 1 ? "seconde" : "seconden";
      },
      ms: function (c) {
        return c === 1 ? "milliseconde" : "milliseconden";
      },
      decimal: ",",
    },
    no: {
      y: "år",
      mo: function (c) {
        return "måned" + (c === 1 ? "" : "er");
      },
      w: function (c) {
        return "uke" + (c === 1 ? "" : "r");
      },
      d: function (c) {
        return "dag" + (c === 1 ? "" : "er");
      },
      h: function (c) {
        return "time" + (c === 1 ? "" : "r");
      },
      m: function (c) {
        return "minutt" + (c === 1 ? "" : "er");
      },
      s: function (c) {
        return "sekund" + (c === 1 ? "" : "er");
      },
      ms: function (c) {
        return "millisekund" + (c === 1 ? "" : "er");
      },
      decimal: ",",
    },
    pl: {
      y: function (c) {
        return ["rok", "roku", "lata", "lat"][getPolishForm(c)];
      },
      mo: function (c) {
        return ["miesiąc", "miesiąca", "miesiące", "miesięcy"][
          getPolishForm(c)
        ];
      },
      w: function (c) {
        return ["tydzień", "tygodnia", "tygodnie", "tygodni"][getPolishForm(c)];
      },
      d: function (c) {
        return ["dzień", "dnia", "dni", "dni"][getPolishForm(c)];
      },
      h: function (c) {
        return ["godzina", "godziny", "godziny", "godzin"][getPolishForm(c)];
      },
      m: function (c) {
        return ["minuta", "minuty", "minuty", "minut"][getPolishForm(c)];
      },
      s: function (c) {
        return ["sekunda", "sekundy", "sekundy", "sekund"][getPolishForm(c)];
      },
      ms: function (c) {
        return ["milisekunda", "milisekundy", "milisekundy", "milisekund"][
          getPolishForm(c)
        ];
      },
      decimal: ",",
    },
    pt: {
      y: function (c) {
        return "ano" + (c === 1 ? "" : "s");
      },
      mo: function (c) {
        return c === 1 ? "mês" : "meses";
      },
      w: function (c) {
        return "semana" + (c === 1 ? "" : "s");
      },
      d: function (c) {
        return "dia" + (c === 1 ? "" : "s");
      },
      h: function (c) {
        return "hora" + (c === 1 ? "" : "s");
      },
      m: function (c) {
        return "minuto" + (c === 1 ? "" : "s");
      },
      s: function (c) {
        return "segundo" + (c === 1 ? "" : "s");
      },
      ms: function (c) {
        return "milissegundo" + (c === 1 ? "" : "s");
      },
      decimal: ",",
    },
    ro: {
      y: function (c) {
        return c === 1 ? "an" : "ani";
      },
      mo: function (c) {
        return c === 1 ? "lună" : "luni";
      },
      w: function (c) {
        return c === 1 ? "săptămână" : "săptămâni";
      },
      d: function (c) {
        return c === 1 ? "zi" : "zile";
      },
      h: function (c) {
        return c === 1 ? "oră" : "ore";
      },
      m: function (c) {
        return c === 1 ? "minut" : "minute";
      },
      s: function (c) {
        return c === 1 ? "secundă" : "secunde";
      },
      ms: function (c) {
        return c === 1 ? "milisecundă" : "milisecunde";
      },
      decimal: ",",
    },
    ru: {
      y: function (c) {
        return ["лет", "год", "года"][getSlavicForm(c)];
      },
      mo: function (c) {
        return ["месяцев", "месяц", "месяца"][getSlavicForm(c)];
      },
      w: function (c) {
        return ["недель", "неделя", "недели"][getSlavicForm(c)];
      },
      d: function (c) {
        return ["дней", "день", "дня"][getSlavicForm(c)];
      },
      h: function (c) {
        return ["часов", "час", "часа"][getSlavicForm(c)];
      },
      m: function (c) {
        return ["минут", "минута", "минуты"][getSlavicForm(c)];
      },
      s: function (c) {
        return ["секунд", "секунда", "секунды"][getSlavicForm(c)];
      },
      ms: function (c) {
        return ["миллисекунд", "миллисекунда", "миллисекунды"][
          getSlavicForm(c)
        ];
      },
      decimal: ",",
    },
    uk: {
      y: function (c) {
        return ["років", "рік", "роки"][getSlavicForm(c)];
      },
      mo: function (c) {
        return ["місяців", "місяць", "місяці"][getSlavicForm(c)];
      },
      w: function (c) {
        return ["тижнів", "тиждень", "тижні"][getSlavicForm(c)];
      },
      d: function (c) {
        return ["днів", "день", "дні"][getSlavicForm(c)];
      },
      h: function (c) {
        return ["годин", "година", "години"][getSlavicForm(c)];
      },
      m: function (c) {
        return ["хвилин", "хвилина", "хвилини"][getSlavicForm(c)];
      },
      s: function (c) {
        return ["секунд", "секунда", "секунди"][getSlavicForm(c)];
      },
      ms: function (c) {
        return ["мілісекунд", "мілісекунда", "мілісекунди"][getSlavicForm(c)];
      },
      decimal: ",",
    },
    ur: {
      y: "سال",
      mo: function (c) {
        return c === 1 ? "مہینہ" : "مہینے";
      },
      w: function (c) {
        return c === 1 ? "ہفتہ" : "ہفتے";
      },
      d: "دن",
      h: function (c) {
        return c === 1 ? "گھنٹہ" : "گھنٹے";
      },
      m: "منٹ",
      s: "سیکنڈ",
      ms: "ملی سیکنڈ",
      decimal: ".",
    },
    sk: {
      y: function (c) {
        return ["rok", "roky", "roky", "rokov"][getCzechOrSlovakForm(c)];
      },
      mo: function (c) {
        return ["mesiac", "mesiace", "mesiace", "mesiacov"][
          getCzechOrSlovakForm(c)
        ];
      },
      w: function (c) {
        return ["týždeň", "týždne", "týždne", "týždňov"][
          getCzechOrSlovakForm(c)
        ];
      },
      d: function (c) {
        return ["deň", "dni", "dni", "dní"][getCzechOrSlovakForm(c)];
      },
      h: function (c) {
        return ["hodina", "hodiny", "hodiny", "hodín"][getCzechOrSlovakForm(c)];
      },
      m: function (c) {
        return ["minúta", "minúty", "minúty", "minút"][getCzechOrSlovakForm(c)];
      },
      s: function (c) {
        return ["sekunda", "sekundy", "sekundy", "sekúnd"][
          getCzechOrSlovakForm(c)
        ];
      },
      ms: function (c) {
        return ["milisekunda", "milisekundy", "milisekundy", "milisekúnd"][
          getCzechOrSlovakForm(c)
        ];
      },
      decimal: ",",
    },
    sl: {
      y: function (c) {
        if (c % 10 === 1) {
          return "leto";
        } else if (c % 100 === 2) {
          return "leti";
        } else if (
          c % 100 === 3 ||
          c % 100 === 4 ||
          (Math.floor(c) !== c && c % 100 <= 5)
        ) {
          return "leta";
        } else {
          return "let";
        }
      },
      mo: function (c) {
        if (c % 10 === 1) {
          return "mesec";
        } else if (c % 100 === 2 || (Math.floor(c) !== c && c % 100 <= 5)) {
          return "meseca";
        } else if (c % 10 === 3 || c % 10 === 4) {
          return "mesece";
        } else {
          return "mesecev";
        }
      },
      w: function (c) {
        if (c % 10 === 1) {
          return "teden";
        } else if (c % 10 === 2 || (Math.floor(c) !== c && c % 100 <= 4)) {
          return "tedna";
        } else if (c % 10 === 3 || c % 10 === 4) {
          return "tedne";
        } else {
          return "tednov";
        }
      },
      d: function (c) {
        return c % 100 === 1 ? "dan" : "dni";
      },
      h: function (c) {
        if (c % 10 === 1) {
          return "ura";
        } else if (c % 100 === 2) {
          return "uri";
        } else if (c % 10 === 3 || c % 10 === 4 || Math.floor(c) !== c) {
          return "ure";
        } else {
          return "ur";
        }
      },
      m: function (c) {
        if (c % 10 === 1) {
          return "minuta";
        } else if (c % 10 === 2) {
          return "minuti";
        } else if (
          c % 10 === 3 ||
          c % 10 === 4 ||
          (Math.floor(c) !== c && c % 100 <= 4)
        ) {
          return "minute";
        } else {
          return "minut";
        }
      },
      s: function (c) {
        if (c % 10 === 1) {
          return "sekunda";
        } else if (c % 100 === 2) {
          return "sekundi";
        } else if (c % 100 === 3 || c % 100 === 4 || Math.floor(c) !== c) {
          return "sekunde";
        } else {
          return "sekund";
        }
      },
      ms: function (c) {
        if (c % 10 === 1) {
          return "milisekunda";
        } else if (c % 100 === 2) {
          return "milisekundi";
        } else if (c % 100 === 3 || c % 100 === 4 || Math.floor(c) !== c) {
          return "milisekunde";
        } else {
          return "milisekund";
        }
      },
      decimal: ",",
    },
    sv: {
      y: "år",
      mo: function (c) {
        return "månad" + (c === 1 ? "" : "er");
      },
      w: function (c) {
        return "veck" + (c === 1 ? "a" : "or");
      },
      d: function (c) {
        return "dag" + (c === 1 ? "" : "ar");
      },
      h: function (c) {
        return "timm" + (c === 1 ? "e" : "ar");
      },
      m: function (c) {
        return "minut" + (c === 1 ? "" : "er");
      },
      s: function (c) {
        return "sekund" + (c === 1 ? "" : "er");
      },
      ms: function (c) {
        return "millisekund" + (c === 1 ? "" : "er");
      },
      decimal: ",",
    },
    sw: {
      y: function (c) {
        return c === 1 ? "mwaka" : "miaka";
      },
      mo: function (c) {
        return c === 1 ? "mwezi" : "miezi";
      },
      w: "wiki",
      d: function (c) {
        return c === 1 ? "siku" : "masiku";
      },
      h: function (c) {
        return c === 1 ? "saa" : "masaa";
      },
      m: "dakika",
      s: "sekunde",
      ms: "milisekunde",
      decimal: ".",
    },
    tr: {
      y: "yıl",
      mo: "ay",
      w: "hafta",
      d: "gün",
      h: "saat",
      m: "dakika",
      s: "saniye",
      ms: "milisaniye",
      decimal: ",",
    },
    th: {
      y: "ปี",
      mo: "เดือน",
      w: "อาทิตย์",
      d: "วัน",
      h: "ชั่วโมง",
      m: "นาที",
      s: "วินาที",
      ms: "มิลลิวินาที",
      decimal: ".",
    },
    vi: {
      y: "năm",
      mo: "tháng",
      w: "tuần",
      d: "ngày",
      h: "giờ",
      m: "phút",
      s: "giây",
      ms: "mili giây",
      decimal: ",",
    },
    zh_CN: {
      y: "年",
      mo: "个月",
      w: "周",
      d: "天",
      h: "小时",
      m: "分钟",
      s: "秒",
      ms: "毫秒",
      decimal: ".",
    },
    zh_TW: {
      y: "年",
      mo: "個月",
      w: "周",
      d: "天",
      h: "小時",
      m: "分鐘",
      s: "秒",
      ms: "毫秒",
      decimal: ".",
    },
  };

  // You can create a humanizer, which returns a function with default
  // parameters.
  function humanizer(passedOptions) {
    var result = function humanizer(ms, humanizerOptions) {
      var options = assign({}, result, humanizerOptions || {});
      return doHumanization(ms, options);
    };

    return assign(
      result,
      {
        language: "en",
        delimiter: ", ",
        spacer: " ",
        conjunction: "",
        serialComma: true,
        units: ["y", "mo", "w", "d", "h", "m", "s"],
        languages: {},
        round: false,
        unitMeasures: {
          y: 31557600000,
          mo: 2629800000,
          w: 604800000,
          d: 86400000,
          h: 3600000,
          m: 60000,
          s: 1000,
          ms: 1,
        },
      },
      passedOptions
    );
  }

  // The main function is just a wrapper around a default humanizer.
  var humanizeDuration = humanizer({});

  // Build dictionary from options
  function getDictionary(options) {
    var languagesFromOptions = [options.language];

    if (has(options, "fallbacks")) {
      if (isArray(options.fallbacks) && options.fallbacks.length) {
        languagesFromOptions = languagesFromOptions.concat(options.fallbacks);
      } else {
        throw new Error("fallbacks must be an array with at least one element");
      }
    }

    for (var i = 0; i < languagesFromOptions.length; i++) {
      var languageToTry = languagesFromOptions[i];
      if (has(options.languages, languageToTry)) {
        return options.languages[languageToTry];
      } else if (has(LANGUAGES, languageToTry)) {
        return LANGUAGES[languageToTry];
      }
    }

    throw new Error("No language found.");
  }

  // doHumanization does the bulk of the work.
  function doHumanization(ms, options) {
    var i, len, piece;

    // Make sure we have a positive number.
    // Has the nice sideffect of turning Number objects into primitives.
    ms = Math.abs(ms);

    var dictionary = getDictionary(options);
    var pieces = [];

    // Start at the top and keep removing units, bit by bit.
    var unitName, unitMS, unitCount;
    for (i = 0, len = options.units.length; i < len; i++) {
      unitName = options.units[i];
      unitMS = options.unitMeasures[unitName];

      // What's the number of full units we can fit?
      if (i + 1 === len) {
        if (has(options, "maxDecimalPoints")) {
          // We need to use this expValue to avoid rounding functionality of toFixed call
          var expValue = Math.pow(10, options.maxDecimalPoints);
          var unitCountFloat = ms / unitMS;
          unitCount = parseFloat(
            (Math.floor(expValue * unitCountFloat) / expValue).toFixed(
              options.maxDecimalPoints
            )
          );
        } else {
          unitCount = ms / unitMS;
        }
      } else {
        unitCount = Math.floor(ms / unitMS);
      }

      // Add the string.
      pieces.push({
        unitCount: unitCount,
        unitName: unitName,
      });

      // Remove what we just figured out.
      ms -= unitCount * unitMS;
    }

    var firstOccupiedUnitIndex = 0;
    for (i = 0; i < pieces.length; i++) {
      if (pieces[i].unitCount) {
        firstOccupiedUnitIndex = i;
        break;
      }
    }

    if (options.round) {
      var ratioToLargerUnit, previousPiece;
      for (i = pieces.length - 1; i >= 0; i--) {
        piece = pieces[i];
        piece.unitCount = Math.round(piece.unitCount);

        if (i === 0) {
          break;
        }

        previousPiece = pieces[i - 1];

        ratioToLargerUnit =
          options.unitMeasures[previousPiece.unitName] /
          options.unitMeasures[piece.unitName];
        if (
          piece.unitCount % ratioToLargerUnit === 0 ||
          (options.largest && options.largest - 1 < i - firstOccupiedUnitIndex)
        ) {
          previousPiece.unitCount += piece.unitCount / ratioToLargerUnit;
          piece.unitCount = 0;
        }
      }
    }

    var result = [];
    for (i = 0, pieces.length; i < len; i++) {
      piece = pieces[i];
      if (piece.unitCount) {
        result.push(
          render(piece.unitCount, piece.unitName, dictionary, options)
        );
      }

      if (result.length === options.largest) {
        break;
      }
    }

    if (result.length) {
      if (!options.conjunction || result.length === 1) {
        return result.join(options.delimiter);
      } else if (result.length === 2) {
        return result.join(options.conjunction);
      } else if (result.length > 2) {
        return (
          result.slice(0, -1).join(options.delimiter) +
          (options.serialComma ? "," : "") +
          options.conjunction +
          result.slice(-1)
        );
      }
    } else {
      return render(
        0,
        options.units[options.units.length - 1],
        dictionary,
        options
      );
    }
  }

  function render(count, type, dictionary, options) {
    var decimal;
    if (has(options, "decimal")) {
      decimal = options.decimal;
    } else if (has(dictionary, "decimal")) {
      decimal = dictionary.decimal;
    } else {
      decimal = ".";
    }

    var countStr = count.toString().replace(".", decimal);

    var dictionaryValue = dictionary[type];
    var word;
    if (typeof dictionaryValue === "function") {
      word = dictionaryValue(count);
    } else {
      word = dictionaryValue;
    }

    return countStr + options.spacer + word;
  }

  function assign(destination) {
    var source;
    for (var i = 1; i < arguments.length; i++) {
      source = arguments[i];
      for (var prop in source) {
        if (has(source, prop)) {
          destination[prop] = source[prop];
        }
      }
    }
    return destination;
  }

  // Internal helper function for Polish language.
  function getPolishForm(c) {
    if (c === 1) {
      return 0;
    } else if (Math.floor(c) !== c) {
      return 1;
    } else if (c % 10 >= 2 && c % 10 <= 4 && !(c % 100 > 10 && c % 100 < 20)) {
      return 2;
    } else {
      return 3;
    }
  }

  // Internal helper function for Russian and Ukranian languages.
  function getSlavicForm(c) {
    if (Math.floor(c) !== c) {
      return 2;
    } else if (
      (c % 100 >= 5 && c % 100 <= 20) ||
      (c % 10 >= 5 && c % 10 <= 9) ||
      c % 10 === 0
    ) {
      return 0;
    } else if (c % 10 === 1) {
      return 1;
    } else if (c > 1) {
      return 2;
    } else {
      return 0;
    }
  }

  // Internal helper function for Slovak language.
  function getCzechOrSlovakForm(c) {
    if (c === 1) {
      return 0;
    } else if (Math.floor(c) !== c) {
      return 1;
    } else if (c % 10 >= 2 && c % 10 <= 4 && c % 100 < 10) {
      return 2;
    } else {
      return 3;
    }
  }

  // Internal helper function for Lithuanian language.
  function getLithuanianForm(c) {
    if (c === 1 || (c % 10 === 1 && c % 100 > 20)) {
      return 0;
    } else if (
      Math.floor(c) !== c ||
      (c % 10 >= 2 && c % 100 > 20) ||
      (c % 10 >= 2 && c % 100 < 10)
    ) {
      return 1;
    } else {
      return 2;
    }
  }

  // Internal helper function for Latvian language.
  function getLatvianForm(c) {
    return c % 10 === 1 && c % 100 !== 11;
  }

  // We need to make sure we support browsers that don't have
  // `Array.isArray`, so we define a fallback here.
  var isArray =
    Array.isArray ||
    function (arg) {
      return Object.prototype.toString.call(arg) === "[object Array]";
    };

  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  humanizeDuration.getSupportedLanguages = function getSupportedLanguages() {
    var result = [];
    for (var language in LANGUAGES) {
      if (has(LANGUAGES, language) && language !== "gr") {
        result.push(language);
      }
    }
    return result;
  };

  humanizeDuration.humanizer = humanizer;

  if (typeof define === "function" && define.amd) {
    define(function () {
      return humanizeDuration;
    });
  } else if ( true && module.exports) {
    module.exports = humanizeDuration;
  } else {
    this.humanizeDuration = humanizeDuration;
  }
})();


/***/ }),

/***/ 262:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const fs_1 = __webpack_require__(747);
const os_1 = __webpack_require__(87);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 263:
/***/ (function(module) {

module.exports = {"aa":{"language":"Afar","location":null,"id":4096,"tag":"aa","version":"Release 10"},"aa-dj":{"language":"Afar","location":"Djibouti","id":4096,"tag":"aa-DJ","version":"Release 10"},"aa-er":{"language":"Afar","location":"Eritrea","id":4096,"tag":"aa-ER","version":"Release 10"},"aa-et":{"language":"Afar","location":"Ethiopia","id":4096,"tag":"aa-ET","version":"Release 10"},"af":{"language":"Afrikaans","location":null,"id":54,"tag":"af","version":"Release 7"},"af-na":{"language":"Afrikaans","location":"Namibia","id":4096,"tag":"af-NA","version":"Release 10"},"af-za":{"language":"Afrikaans","location":"South Africa","id":1078,"tag":"af-ZA","version":"Release B"},"agq":{"language":"Aghem","location":null,"id":4096,"tag":"agq","version":"Release 10"},"agq-cm":{"language":"Aghem","location":"Cameroon","id":4096,"tag":"agq-CM","version":"Release 10"},"ak":{"language":"Akan","location":null,"id":4096,"tag":"ak","version":"Release 10"},"ak-gh":{"language":"Akan","location":"Ghana","id":4096,"tag":"ak-GH","version":"Release 10"},"sq":{"language":"Albanian","location":null,"id":28,"tag":"sq","version":"Release 7"},"sq-al":{"language":"Albanian","location":"Albania","id":1052,"tag":"sq-AL","version":"Release B"},"sq-mk":{"language":"Albanian","location":"North Macedonia","id":4096,"tag":"sq-MK","version":"Release 10"},"gsw":{"language":"Alsatian","location":null,"id":132,"tag":"gsw","version":"Release 7"},"gsw-fr":{"language":"Alsatian","location":"France","id":1156,"tag":"gsw-FR","version":"Release V"},"gsw-li":{"language":"Alsatian","location":"Liechtenstein","id":4096,"tag":"gsw-LI","version":"Release 10"},"gsw-ch":{"language":"Alsatian","location":"Switzerland","id":4096,"tag":"gsw-CH","version":"Release 10"},"am":{"language":"Amharic","location":null,"id":94,"tag":"am","version":"Release 7"},"am-et":{"language":"Amharic","location":"Ethiopia","id":1118,"tag":"am-ET","version":"Release V"},"ar":{"language":"Arabic","location":null,"id":1,"tag":"ar","version":"Release 7"},"ar-dz":{"language":"Arabic","location":"Algeria","id":5121,"tag":"ar-DZ","version":"Release B"},"ar-bh":{"language":"Arabic","location":"Bahrain","id":15361,"tag":"ar-BH","version":"Release B"},"ar-td":{"language":"Arabic","location":"Chad","id":4096,"tag":"ar-TD","version":"Release 10"},"ar-km":{"language":"Arabic","location":"Comoros","id":4096,"tag":"ar-KM","version":"Release 10"},"ar-dj":{"language":"Arabic","location":"Djibouti","id":4096,"tag":"ar-DJ","version":"Release 10"},"ar-eg":{"language":"Arabic","location":"Egypt","id":3073,"tag":"ar-EG","version":"Release B"},"ar-er":{"language":"Arabic","location":"Eritrea","id":4096,"tag":"ar-ER","version":"Release 10"},"ar-iq":{"language":"Arabic","location":"Iraq","id":2049,"tag":"ar-IQ","version":"Release B"},"ar-il":{"language":"Arabic","location":"Israel","id":4096,"tag":"ar-IL","version":"Release 10"},"ar-jo":{"language":"Arabic","location":"Jordan","id":11265,"tag":"ar-JO","version":"Release B"},"ar-kw":{"language":"Arabic","location":"Kuwait","id":13313,"tag":"ar-KW","version":"Release B"},"ar-lb":{"language":"Arabic","location":"Lebanon","id":12289,"tag":"ar-LB","version":"Release B"},"ar-ly":{"language":"Arabic","location":"Libya","id":4097,"tag":"ar-LY","version":"Release B"},"ar-mr":{"language":"Arabic","location":"Mauritania","id":4096,"tag":"ar-MR","version":"Release 10"},"ar-ma":{"language":"Arabic","location":"Morocco","id":6145,"tag":"ar-MA","version":"Release B"},"ar-om":{"language":"Arabic","location":"Oman","id":8193,"tag":"ar-OM","version":"Release B"},"ar-ps":{"language":"Arabic","location":"Palestinian Authority","id":4096,"tag":"ar-PS","version":"Release 10"},"ar-qa":{"language":"Arabic","location":"Qatar","id":16385,"tag":"ar-QA","version":"Release B"},"ar-sa":{"language":"Arabic","location":"Saudi Arabia","id":1025,"tag":"ar-SA","version":"Release B"},"ar-so":{"language":"Arabic","location":"Somalia","id":4096,"tag":"ar-SO","version":"Release 10"},"ar-ss":{"language":"Arabic","location":"South Sudan","id":4096,"tag":"ar-SS","version":"Release 10"},"ar-sd":{"language":"Arabic","location":"Sudan","id":4096,"tag":"ar-SD","version":"Release 10"},"ar-sy":{"language":"Arabic","location":"Syria","id":10241,"tag":"ar-SY","version":"Release B"},"ar-tn":{"language":"Arabic","location":"Tunisia","id":7169,"tag":"ar-TN","version":"Release B"},"ar-ae":{"language":"Arabic","location":"U.A.E.","id":14337,"tag":"ar-AE","version":"Release B"},"ar-001":{"language":"Arabic","location":"World","id":4096,"tag":"ar-001","version":"Release 10"},"ar-ye":{"language":"Arabic","location":"Yemen","id":9217,"tag":"ar-YE","version":"Release B"},"hy":{"language":"Armenian","location":null,"id":43,"tag":"hy","version":"Release 7"},"hy-am":{"language":"Armenian","location":"Armenia","id":1067,"tag":"hy-AM","version":"Release C"},"as":{"language":"Assamese","location":null,"id":77,"tag":"as","version":"Release 7"},"as-in":{"language":"Assamese","location":"India","id":1101,"tag":"as-IN","version":"Release V"},"ast":{"language":"Asturian","location":null,"id":4096,"tag":"ast","version":"Release 10"},"ast-es":{"language":"Asturian","location":"Spain","id":4096,"tag":"ast-ES","version":"Release 10"},"asa":{"language":"Asu","location":null,"id":4096,"tag":"asa","version":"Release 10"},"asa-tz":{"language":"Asu","location":"Tanzania","id":4096,"tag":"asa-TZ","version":"Release 10"},"az-cyrl":{"language":"Azerbaijani (Cyrillic)","location":null,"id":29740,"tag":"az-Cyrl","version":"Windows 7"},"az-cyrl-az":{"language":"Azerbaijani (Cyrillic)","location":"Azerbaijan","id":2092,"tag":"az-Cyrl-AZ","version":"Release C"},"az":{"language":"Azerbaijani (Latin)","location":null,"id":44,"tag":"az","version":"Release 7"},"az-latn":{"language":"Azerbaijani (Latin)","location":null,"id":30764,"tag":"az-Latn","version":"Windows 7"},"az-latn-az":{"language":"Azerbaijani (Latin)","location":"Azerbaijan","id":1068,"tag":"az-Latn-AZ","version":"Release C"},"ksf":{"language":"Bafia","location":null,"id":4096,"tag":"ksf","version":"Release 10"},"ksf-cm":{"language":"Bafia","location":"Cameroon","id":4096,"tag":"ksf-CM","version":"Release 10"},"bm":{"language":"Bamanankan","location":null,"id":4096,"tag":"bm","version":"Release 10"},"bm-latn-ml":{"language":"Bamanankan (Latin)","location":"Mali","id":4096,"tag":"bm-Latn-ML","version":"Release 10"},"bn":{"language":"Bangla","location":null,"id":69,"tag":"bn","version":"Release 7"},"bn-bd":{"language":"Bangla","location":"Bangladesh","id":2117,"tag":"bn-BD","version":"Release V"},"bn-in":{"language":"Bangla","location":"India","id":1093,"tag":"bn-IN","version":"Release E1"},"bas":{"language":"Basaa","location":null,"id":4096,"tag":"bas","version":"Release 10"},"bas-cm":{"language":"Basaa","location":"Cameroon","id":4096,"tag":"bas-CM","version":"Release 10"},"ba":{"language":"Bashkir","location":null,"id":109,"tag":"ba","version":"Release 7"},"ba-ru":{"language":"Bashkir","location":"Russia","id":1133,"tag":"ba-RU","version":"Release V"},"eu":{"language":"Basque","location":null,"id":45,"tag":"eu","version":"Release 7"},"eu-es":{"language":"Basque","location":"Spain","id":1069,"tag":"eu-ES","version":"Release B"},"be":{"language":"Belarusian","location":null,"id":35,"tag":"be","version":"Release 7"},"be-by":{"language":"Belarusian","location":"Belarus","id":1059,"tag":"be-BY","version":"Release B"},"bem":{"language":"Bemba","location":null,"id":4096,"tag":"bem","version":"Release 10"},"bem-zm":{"language":"Bemba","location":"Zambia","id":4096,"tag":"bem-ZM","version":"Release 10"},"bez":{"language":"Bena","location":null,"id":4096,"tag":"bez","version":"Release 10"},"bez-tz":{"language":"Bena","location":"Tanzania","id":4096,"tag":"bez-TZ","version":"Release 10"},"byn":{"language":"Blin","location":null,"id":4096,"tag":"byn","version":"Release 10"},"byn-er":{"language":"Blin","location":"Eritrea","id":4096,"tag":"byn-ER","version":"Release 10"},"brx":{"language":"Bodo","location":null,"id":4096,"tag":"brx","version":"Release 10"},"brx-in":{"language":"Bodo","location":"India","id":4096,"tag":"brx-IN","version":"Release 10"},"bs-cyrl":{"language":"Bosnian (Cyrillic)","location":null,"id":25626,"tag":"bs-Cyrl","version":"Windows 7"},"bs-cyrl-ba":{"language":"Bosnian (Cyrillic)","location":"Bosnia and Herzegovina","id":8218,"tag":"bs-Cyrl-BA","version":"Release E1"},"bs-latn":{"language":"Bosnian (Latin)","location":null,"id":26650,"tag":"bs-Latn","version":"Windows 7"},"bs":{"language":"Bosnian (Latin)","location":null,"id":30746,"tag":"bs","version":"Release 7"},"bs-latn-ba":{"language":"Bosnian (Latin)","location":"Bosnia and Herzegovina","id":5146,"tag":"bs-Latn-BA","version":"Release E1"},"br":{"language":"Breton","location":null,"id":126,"tag":"br","version":"Release 7"},"br-fr":{"language":"Breton","location":"France","id":1150,"tag":"br-FR","version":"Release V"},"bg":{"language":"Bulgarian","location":null,"id":2,"tag":"bg","version":"Release 7"},"bg-bg":{"language":"Bulgarian","location":"Bulgaria","id":1026,"tag":"bg-BG","version":"Release B"},"my":{"language":"Burmese","location":null,"id":85,"tag":"my","version":"Release 8.1"},"my-mm":{"language":"Burmese","location":"Myanmar","id":1109,"tag":"my-MM","version":"Release 8.1"},"ca":{"language":"Catalan","location":null,"id":3,"tag":"ca","version":"Release 7"},"ca-ad":{"language":"Catalan","location":"Andorra","id":4096,"tag":"ca-AD","version":"Release 10"},"ca-fr":{"language":"Catalan","location":"France","id":4096,"tag":"ca-FR","version":"Release 10"},"ca-it":{"language":"Catalan","location":"Italy","id":4096,"tag":"ca-IT","version":"Release 10"},"ca-es":{"language":"Catalan","location":"Spain","id":1027,"tag":"ca-ES","version":"Release B"},"ceb":{"language":"Cebuano","location":null,"id":4096,"tag":"ceb","version":"Release 10.5"},"ceb-latn":{"language":"Cebuan (Latin)","location":null,"id":4096,"tag":"ceb-Latn","version":"Release 10.5"},"ceb-latn-ph":{"language":"Cebuan (Latin)","location":"Philippines","id":4096,"tag":"ceb-Latn-PH","version":"Release 10.5"},"tzm-latn-":{"language":"Central Atlas Tamazight (Latin)","location":"Morocco","id":4096,"tag":"tzm-Latn-","version":"Release 10"},"ku":{"language":"Central Kurdish","location":null,"id":146,"tag":"ku","version":"Release 8"},"ku-arab":{"language":"Central Kurdish","location":null,"id":31890,"tag":"ku-Arab","version":"Release 8"},"ku-arab-iq":{"language":"Central Kurdish","location":"Iraq","id":1170,"tag":"ku-Arab-IQ","version":"Release 8"},"ccp":{"language":"Chakma","location":null,"id":4096,"tag":"ccp","version":"Release 10.5"},"ccp-cakm":{"language":"Chakma","location":"Chakma","id":4096,"tag":"ccp-Cakm","version":"Release 10.5"},"ccp-cakm-":{"language":"Chakma","location":"India","id":4096,"tag":"ccp-Cakm-","version":"Release 10.5"},"cd-ru":{"language":"Chechen","location":"Russia","id":4096,"tag":"cd-RU","version":"Release 10.1"},"chr":{"language":"Cherokee","location":null,"id":92,"tag":"chr","version":"Release 8"},"chr-cher":{"language":"Cherokee","location":null,"id":31836,"tag":"chr-Cher","version":"Release 8"},"chr-cher-us":{"language":"Cherokee","location":"United States","id":1116,"tag":"chr-Cher-US","version":"Release 8"},"cgg":{"language":"Chiga","location":null,"id":4096,"tag":"cgg","version":"Release 10"},"cgg-ug":{"language":"Chiga","location":"Uganda","id":4096,"tag":"cgg-UG","version":"Release 10"},"zh-hans":{"language":"Chinese (Simplified)","location":null,"id":4,"tag":"zh-Hans","version":"Release A"},"zh":{"language":"Chinese (Simplified)","location":null,"id":30724,"tag":"zh","version":"Windows 7"},"zh-cn":{"language":"Chinese (Simplified)","location":"People's Republic of China","id":2052,"tag":"zh-CN","version":"Release A"},"zh-sg":{"language":"Chinese (Simplified)","location":"Singapore","id":4100,"tag":"zh-SG","version":"Release A"},"zh-hant":{"language":"Chinese (Traditional)","location":null,"id":31748,"tag":"zh-Hant","version":"Release A"},"zh-hk":{"language":"Chinese (Traditional)","location":"Hong Kong S.A.R.","id":3076,"tag":"zh-HK","version":"Release A"},"zh-mo":{"language":"Chinese (Traditional)","location":"Macao S.A.R.","id":5124,"tag":"zh-MO","version":"Release D"},"zh-tw":{"language":"Chinese (Traditional)","location":"Taiwan","id":1028,"tag":"zh-TW","version":"Release A"},"cu-ru":{"language":"Church Slavic","location":"Russia","id":4096,"tag":"cu-RU","version":"Release 10.1"},"swc":{"language":"Congo Swahili","location":null,"id":4096,"tag":"swc","version":"Release 10"},"swc-cd":{"language":"Congo Swahili","location":"Congo DRC","id":4096,"tag":"swc-CD","version":"Release 10"},"kw":{"language":"Cornish","location":null,"id":4096,"tag":"kw","version":"Release 10"},"kw-gb":{"language":"Cornish","location":"United Kingdom","id":4096,"tag":"kw-GB","version":"Release 10"},"co":{"language":"Corsican","location":null,"id":131,"tag":"co","version":"Release 7"},"co-fr":{"language":"Corsican","location":"France","id":1155,"tag":"co-FR","version":"Release V"},"hr,":{"language":"Croatian","location":null,"id":26,"tag":"hr,","version":"Release 7"},"hr-hr":{"language":"Croatian","location":"Croatia","id":1050,"tag":"hr-HR","version":"Release A"},"hr-ba":{"language":"Croatian (Latin)","location":"Bosnia and Herzegovina","id":4122,"tag":"hr-BA","version":"Release E1"},"cs":{"language":"Czech","location":null,"id":5,"tag":"cs","version":"Release 7"},"cs-cz":{"language":"Czech","location":"Czech Republic","id":1029,"tag":"cs-CZ","version":"Release A"},"da":{"language":"Danish","location":null,"id":6,"tag":"da","version":"Release 7"},"da-dk":{"language":"Danish","location":"Denmark","id":1030,"tag":"da-DK","version":"Release A"},"da-gl":{"language":"Danish","location":"Greenland","id":4096,"tag":"da-GL","version":"Release 10"},"prs":{"language":"Dari","location":null,"id":140,"tag":"prs","version":"Release 7"},"prs-af":{"language":"Dari","location":"Afghanistan","id":1164,"tag":"prs-AF","version":"Release V"},"dv":{"language":"Divehi","location":null,"id":101,"tag":"dv","version":"Release 7"},"dv-mv":{"language":"Divehi","location":"Maldives","id":1125,"tag":"dv-MV","version":"Release D"},"dua":{"language":"Duala","location":null,"id":4096,"tag":"dua","version":"Release 10"},"dua-cm":{"language":"Duala","location":"Cameroon","id":4096,"tag":"dua-CM","version":"Release 10"},"nl":{"language":"Dutch","location":null,"id":19,"tag":"nl","version":"Release 7"},"nl-aw":{"language":"Dutch","location":"Aruba","id":4096,"tag":"nl-AW","version":"Release 10"},"nl-be":{"language":"Dutch","location":"Belgium","id":2067,"tag":"nl-BE","version":"Release A"},"nl-bq":{"language":"Dutch","location":"Bonaire, Sint Eustatius and Saba","id":4096,"tag":"nl-BQ","version":"Release 10"},"nl-cw":{"language":"Dutch","location":"Curaçao","id":4096,"tag":"nl-CW","version":"Release 10"},"nl-nl":{"language":"Dutch","location":"Netherlands","id":1043,"tag":"nl-NL","version":"Release A"},"nl-sx":{"language":"Dutch","location":"Sint Maarten","id":4096,"tag":"nl-SX","version":"Release 10"},"nl-sr":{"language":"Dutch","location":"Suriname","id":4096,"tag":"nl-SR","version":"Release 10"},"dz":{"language":"Dzongkha","location":null,"id":4096,"tag":"dz","version":"Release 10"},"dz-bt":{"language":"Dzongkha","location":"Bhutan","id":3153,"tag":"dz-BT","version":"Release 10"},"ebu":{"language":"Embu","location":null,"id":4096,"tag":"ebu","version":"Release 10"},"ebu-ke":{"language":"Embu","location":"Kenya","id":4096,"tag":"ebu-KE","version":"Release 10"},"en":{"language":"English","location":null,"id":9,"tag":"en","version":"Release 7"},"en-as":{"language":"English","location":"American Samoa","id":4096,"tag":"en-AS","version":"Release 10"},"en-ai":{"language":"English","location":"Anguilla","id":4096,"tag":"en-AI","version":"Release 10"},"en-ag":{"language":"English","location":"Antigua and Barbuda","id":4096,"tag":"en-AG","version":"Release 10"},"en-au":{"language":"English","location":"Australia","id":3081,"tag":"en-AU","version":"Release A"},"en-at":{"language":"English","location":"Austria","id":4096,"tag":"en-AT","version":"Release 10.1"},"en-bs":{"language":"English","location":"Bahamas","id":4096,"tag":"en-BS","version":"Release 10"},"en-bb":{"language":"English","location":"Barbados","id":4096,"tag":"en-BB","version":"Release 10"},"en-be":{"language":"English","location":"Belgium","id":4096,"tag":"en-BE","version":"Release 10"},"en-bz":{"language":"English","location":"Belize","id":10249,"tag":"en-BZ","version":"Release B"},"en-bm":{"language":"English","location":"Bermuda","id":4096,"tag":"en-BM","version":"Release 10"},"en-bw":{"language":"English","location":"Botswana","id":4096,"tag":"en-BW","version":"Release 10"},"en-io":{"language":"English","location":"British Indian Ocean Territory","id":4096,"tag":"en-IO","version":"Release 10"},"en-vg":{"language":"English","location":"British Virgin Islands","id":4096,"tag":"en-VG","version":"Release 10"},"en-bi":{"language":"English","location":"Burundi","id":4096,"tag":"en-BI","version":"Release 10.1"},"en-cm":{"language":"English","location":"Cameroon","id":4096,"tag":"en-CM","version":"Release 10"},"en-ca":{"language":"English","location":"Canada","id":4105,"tag":"en-CA","version":"Release A"},"en-029":{"language":"English","location":"Caribbean","id":9225,"tag":"en-029","version":"Release B"},"en-ky":{"language":"English","location":"Cayman Islands","id":4096,"tag":"en-KY","version":"Release 10"},"en-cx":{"language":"English","location":"Christmas Island","id":4096,"tag":"en-CX","version":"Release 10"},"en-cc":{"language":"English","location":"Cocos [Keeling] Islands","id":4096,"tag":"en-CC","version":"Release 10"},"en-ck":{"language":"English","location":"Cook Islands","id":4096,"tag":"en-CK","version":"Release 10"},"en-cy":{"language":"English","location":"Cyprus","id":4096,"tag":"en-CY","version":"Release 10.1"},"en-dk":{"language":"English","location":"Denmark","id":4096,"tag":"en-DK","version":"Release 10.1"},"en-dm":{"language":"English","location":"Dominica","id":4096,"tag":"en-DM","version":"Release 10"},"en-er":{"language":"English","location":"Eritrea","id":4096,"tag":"en-ER","version":"Release 10"},"en-150":{"language":"English","location":"Europe","id":4096,"tag":"en-150","version":"Release 10"},"en-fk":{"language":"English","location":"Falkland Islands","id":4096,"tag":"en-FK","version":"Release 10"},"en-fi":{"language":"English","location":"Finland","id":4096,"tag":"en-FI","version":"Release 10.1"},"en-fj":{"language":"English","location":"Fiji","id":4096,"tag":"en-FJ","version":"Release 10"},"en-gm":{"language":"English","location":"Gambia","id":4096,"tag":"en-GM","version":"Release 10"},"en-de":{"language":"English","location":"Germany","id":4096,"tag":"en-DE","version":"Release 10.1"},"en-gh":{"language":"English","location":"Ghana","id":4096,"tag":"en-GH","version":"Release 10"},"en-gi":{"language":"English","location":"Gibraltar","id":4096,"tag":"en-GI","version":"Release 10"},"en-gd":{"language":"English","location":"Grenada","id":4096,"tag":"en-GD","version":"Release 10"},"en-gu":{"language":"English","location":"Guam","id":4096,"tag":"en-GU","version":"Release 10"},"en-gg":{"language":"English","location":"Guernsey","id":4096,"tag":"en-GG","version":"Release 10"},"en-gy":{"language":"English","location":"Guyana","id":4096,"tag":"en-GY","version":"Release 10"},"en-hk":{"language":"English","location":"Hong Kong","id":15369,"tag":"en-HK","version":"Release 8.1"},"en-in":{"language":"English","location":"India","id":16393,"tag":"en-IN","version":"Release V"},"en-ie":{"language":"English","location":"Ireland","id":6153,"tag":"en-IE","version":"Release A"},"en-im":{"language":"English","location":"Isle of Man","id":4096,"tag":"en-IM","version":"Release 10"},"en-il":{"language":"English","location":"Israel","id":4096,"tag":"en-IL","version":"Release 10.1"},"en-jm":{"language":"English","location":"Jamaica","id":8201,"tag":"en-JM","version":"Release B"},"en-je":{"language":"English","location":"Jersey","id":4096,"tag":"en-JE","version":"Release 10"},"en-ke":{"language":"English","location":"Kenya","id":4096,"tag":"en-KE","version":"Release 10"},"en-ki":{"language":"English","location":"Kiribati","id":4096,"tag":"en-KI","version":"Release 10"},"en-ls":{"language":"English","location":"Lesotho","id":4096,"tag":"en-LS","version":"Release 10"},"en-lr":{"language":"English","location":"Liberia","id":4096,"tag":"en-LR","version":"Release 10"},"en-mo":{"language":"English","location":"Macao SAR","id":4096,"tag":"en-MO","version":"Release 10"},"en-mg":{"language":"English","location":"Madagascar","id":4096,"tag":"en-MG","version":"Release 10"},"en-mw":{"language":"English","location":"Malawi","id":4096,"tag":"en-MW","version":"Release 10"},"en-my":{"language":"English","location":"Malaysia","id":17417,"tag":"en-MY","version":"Release V"},"en-mt":{"language":"English","location":"Malta","id":4096,"tag":"en-MT","version":"Release 10"},"en-mh":{"language":"English","location":"Marshall Islands","id":4096,"tag":"en-MH","version":"Release 10"},"en-mu":{"language":"English","location":"Mauritius","id":4096,"tag":"en-MU","version":"Release 10"},"en-fm":{"language":"English","location":"Micronesia","id":4096,"tag":"en-FM","version":"Release 10"},"en-ms":{"language":"English","location":"Montserrat","id":4096,"tag":"en-MS","version":"Release 10"},"en-na":{"language":"English","location":"Namibia","id":4096,"tag":"en-NA","version":"Release 10"},"en-nr":{"language":"English","location":"Nauru","id":4096,"tag":"en-NR","version":"Release 10"},"en-nl":{"language":"English","location":"Netherlands","id":4096,"tag":"en-NL","version":"Release 10.1"},"en-nz":{"language":"English","location":"New Zealand","id":5129,"tag":"en-NZ","version":"Release A"},"en-ng":{"language":"English","location":"Nigeria","id":4096,"tag":"en-NG","version":"Release 10"},"en-nu":{"language":"English","location":"Niue","id":4096,"tag":"en-NU","version":"Release 10"},"en-nf":{"language":"English","location":"Norfolk Island","id":4096,"tag":"en-NF","version":"Release 10"},"en-mp":{"language":"English","location":"Northern Mariana Islands","id":4096,"tag":"en-MP","version":"Release 10"},"en-pk":{"language":"English","location":"Pakistan","id":4096,"tag":"en-PK","version":"Release 10"},"en-pw":{"language":"English","location":"Palau","id":4096,"tag":"en-PW","version":"Release 10"},"en-pg":{"language":"English","location":"Papua New Guinea","id":4096,"tag":"en-PG","version":"Release 10"},"en-pn":{"language":"English","location":"Pitcairn Islands","id":4096,"tag":"en-PN","version":"Release 10"},"en-pr":{"language":"English","location":"Puerto Rico","id":4096,"tag":"en-PR","version":"Release 10"},"en-ph":{"language":"English","location":"Republic of the Philippines","id":13321,"tag":"en-PH","version":"Release C"},"en-rw":{"language":"English","location":"Rwanda","id":4096,"tag":"en-RW","version":"Release 10"},"en-kn":{"language":"English","location":"Saint Kitts and Nevis","id":4096,"tag":"en-KN","version":"Release 10"},"en-lc":{"language":"English","location":"Saint Lucia","id":4096,"tag":"en-LC","version":"Release 10"},"en-vc":{"language":"English","location":"Saint Vincent and the Grenadines","id":4096,"tag":"en-VC","version":"Release 10"},"en-ws":{"language":"English","location":"Samoa","id":4096,"tag":"en-WS","version":"Release 10"},"en-sc":{"language":"English","location":"Seychelles","id":4096,"tag":"en-SC","version":"Release 10"},"en-sl":{"language":"English","location":"Sierra Leone","id":4096,"tag":"en-SL","version":"Release 10"},"en-sg":{"language":"English","location":"Singapore","id":18441,"tag":"en-SG","version":"Release V"},"en-sx":{"language":"English","location":"Sint Maarten","id":4096,"tag":"en-SX","version":"Release 10"},"en-si":{"language":"English","location":"Slovenia","id":4096,"tag":"en-SI","version":"Release 10.1"},"en-sb":{"language":"English","location":"Solomon Islands","id":4096,"tag":"en-SB","version":"Release 10"},"en-za":{"language":"English","location":"South Africa","id":7177,"tag":"en-ZA","version":"Release B"},"en-ss":{"language":"English","location":"South Sudan","id":4096,"tag":"en-SS","version":"Release 10"},"en-sh":{"language":"English","location":"St Helena, Ascension,  Tristan da Cunha","id":4096,"tag":"en-SH","version":"Release 10"},"en-sd":{"language":"English","location":"Sudan","id":4096,"tag":"en-SD","version":"Release 10"},"en-sz":{"language":"English","location":"Swaziland","id":4096,"tag":"en-SZ","version":"Release 10"},"en-se":{"language":"English","location":"Sweden","id":4096,"tag":"en-SE","version":"Release 10.1"},"en-ch":{"language":"English","location":"Switzerland","id":4096,"tag":"en-CH","version":"Release 10.1"},"en-tz":{"language":"English","location":"Tanzania","id":4096,"tag":"en-TZ","version":"Release 10"},"en-tk":{"language":"English","location":"Tokelau","id":4096,"tag":"en-TK","version":"Release 10"},"en-to":{"language":"English","location":"Tonga","id":4096,"tag":"en-TO","version":"Release 10"},"en-tt":{"language":"English","location":"Trinidad and Tobago","id":11273,"tag":"en-TT","version":"Release B"},"en-tc":{"language":"English","location":"Turks and Caicos Islands","id":4096,"tag":"en-TC","version":"Release 10"},"en-tv":{"language":"English","location":"Tuvalu","id":4096,"tag":"en-TV","version":"Release 10"},"en-ug":{"language":"English","location":"Uganda","id":4096,"tag":"en-UG","version":"Release 10"},"en-ae":{"language":"English","location":"United Arab Emirates","id":19465,"tag":"en-AE","version":"Release 10.5"},"en-gb":{"language":"English","location":"United Kingdom","id":2057,"tag":"en-GB","version":"Release A"},"en-us":{"language":"English","location":"United States","id":1033,"tag":"en-US","version":"Release A"},"en-um":{"language":"English","location":"US Minor Outlying Islands","id":4096,"tag":"en-UM","version":"Release 10"},"en-vi":{"language":"English","location":"US Virgin Islands","id":4096,"tag":"en-VI","version":"Release 10"},"en-vu":{"language":"English","location":"Vanuatu","id":4096,"tag":"en-VU","version":"Release 10"},"en-001":{"language":"English","location":"World","id":4096,"tag":"en-001","version":"Release 10"},"en-zm":{"language":"English","location":"Zambia","id":4096,"tag":"en-ZM","version":"Release 10"},"en-zw":{"language":"English","location":"Zimbabwe","id":12297,"tag":"en-ZW","version":"Release C"},"eo":{"language":"Esperanto","location":null,"id":4096,"tag":"eo","version":"Release 10"},"eo-001":{"language":"Esperanto","location":"World","id":4096,"tag":"eo-001","version":"Release 10"},"et":{"language":"Estonian","location":null,"id":37,"tag":"et","version":"Release 7"},"et-ee":{"language":"Estonian","location":"Estonia","id":1061,"tag":"et-EE","version":"Release B"},"ee":{"language":"Ewe","location":null,"id":4096,"tag":"ee","version":"Release 10"},"ee-gh":{"language":"Ewe","location":"Ghana","id":4096,"tag":"ee-GH","version":"Release 10"},"ee-tg":{"language":"Ewe","location":"Togo","id":4096,"tag":"ee-TG","version":"Release 10"},"ewo":{"language":"Ewondo","location":null,"id":4096,"tag":"ewo","version":"Release 10"},"ewo-cm":{"language":"Ewondo","location":"Cameroon","id":4096,"tag":"ewo-CM","version":"Release 10"},"fo":{"language":"Faroese","location":null,"id":56,"tag":"fo","version":"Release 7"},"fo-dk":{"language":"Faroese","location":"Denmark","id":4096,"tag":"fo-DK","version":"Release 10.1"},"fo-fo":{"language":"Faroese","location":"Faroe Islands","id":1080,"tag":"fo-FO","version":"Release B"},"fil":{"language":"Filipino","location":null,"id":100,"tag":"fil","version":"Release 7"},"fil-ph":{"language":"Filipino","location":"Philippines","id":1124,"tag":"fil-PH","version":"Release E2"},"fi":{"language":"Finnish","location":null,"id":11,"tag":"fi","version":"Release 7"},"fi-fi":{"language":"Finnish","location":"Finland","id":1035,"tag":"fi-FI","version":"Release A"},"fr":{"language":"French","location":null,"id":12,"tag":"fr","version":"Release 7"},"fr-dz":{"language":"French","location":"Algeria","id":4096,"tag":"fr-DZ","version":"Release 10"},"fr-be":{"language":"French","location":"Belgium","id":2060,"tag":"fr-BE","version":"Release A"},"fr-bj":{"language":"French","location":"Benin","id":4096,"tag":"fr-BJ","version":"Release 10"},"fr-bf":{"language":"French","location":"Burkina Faso","id":4096,"tag":"fr-BF","version":"Release 10"},"fr-bi":{"language":"French","location":"Burundi","id":4096,"tag":"fr-BI","version":"Release 10"},"fr-cm":{"language":"French","location":"Cameroon","id":11276,"tag":"fr-CM","version":"Release 8.1"},"fr-ca":{"language":"French","location":"Canada","id":3084,"tag":"fr-CA","version":"Release A"},"fr-cf":{"language":"French","location":"Central African Republic","id":4096,"tag":"fr-CF","version":"Release10"},"fr-td":{"language":"French","location":"Chad","id":4096,"tag":"fr-TD","version":"Release 10"},"fr-km":{"language":"French","location":"Comoros","id":4096,"tag":"fr-KM","version":"Release 10"},"fr-cg":{"language":"French","location":"Congo","id":4096,"tag":"fr-CG","version":"Release 10"},"fr-cd":{"language":"French","location":"Congo, DRC","id":9228,"tag":"fr-CD","version":"Release 8.1"},"fr-ci":{"language":"French","location":"Côte d'Ivoire","id":12300,"tag":"fr-CI","version":"Release 8.1"},"fr-dj":{"language":"French","location":"Djibouti","id":4096,"tag":"fr-DJ","version":"Release 10"},"fr-gq":{"language":"French","location":"Equatorial Guinea","id":4096,"tag":"fr-GQ","version":"Release 10"},"fr-fr":{"language":"French","location":"France","id":1036,"tag":"fr-FR","version":"Release A"},"fr-gf":{"language":"French","location":"French Guiana","id":4096,"tag":"fr-GF","version":"Release 10"},"fr-pf":{"language":"French","location":"French Polynesia","id":4096,"tag":"fr-PF","version":"Release 10"},"fr-ga":{"language":"French","location":"Gabon","id":4096,"tag":"fr-GA","version":"Release 10"},"fr-gp":{"language":"French","location":"Guadeloupe","id":4096,"tag":"fr-GP","version":"Release 10"},"fr-gn":{"language":"French","location":"Guinea","id":4096,"tag":"fr-GN","version":"Release 10"},"fr-ht":{"language":"French","location":"Haiti","id":15372,"tag":"fr-HT","version":"Release 8.1"},"fr-lu":{"language":"French","location":"Luxembourg","id":5132,"tag":"fr-LU","version":"Release A"},"fr-mg":{"language":"French","location":"Madagascar","id":4096,"tag":"fr-MG","version":"Release 10"},"fr-ml":{"language":"French","location":"Mali","id":13324,"tag":"fr-ML","version":"Release 8.1"},"fr-mq":{"language":"French","location":"Martinique","id":4096,"tag":"fr-MQ","version":"Release 10"},"fr-mr":{"language":"French","location":"Mauritania","id":4096,"tag":"fr-MR","version":"Release 10"},"fr-mu":{"language":"French","location":"Mauritius","id":4096,"tag":"fr-MU","version":"Release 10"},"fr-yt":{"language":"French","location":"Mayotte","id":4096,"tag":"fr-YT","version":"Release 10"},"fr-ma":{"language":"French","location":"Morocco","id":14348,"tag":"fr-MA","version":"Release 8.1"},"fr-nc":{"language":"French","location":"New Caledonia","id":4096,"tag":"fr-NC","version":"Release 10"},"fr-ne":{"language":"French","location":"Niger","id":4096,"tag":"fr-NE","version":"Release 10"},"fr-mc":{"language":"French","location":"Principality of Monaco","id":6156,"tag":"fr-MC","version":"Release A"},"fr-re":{"language":"French","location":"Reunion","id":8204,"tag":"fr-RE","version":"Release 8.1"},"fr-rw":{"language":"French","location":"Rwanda","id":4096,"tag":"fr-RW","version":"Release 10"},"fr-bl":{"language":"French","location":"Saint Barthélemy","id":4096,"tag":"fr-BL","version":"Release 10"},"fr-mf":{"language":"French","location":"Saint Martin","id":4096,"tag":"fr-MF","version":"Release 10"},"fr-pm":{"language":"French","location":"Saint Pierre and Miquelon","id":4096,"tag":"fr-PM","version":"Release 10"},"fr-sn":{"language":"French","location":"Senegal","id":10252,"tag":"fr-SN","version":"Release 8.1"},"fr-sc":{"language":"French","location":"Seychelles","id":4096,"tag":"fr-SC","version":"Release 10"},"fr-ch":{"language":"French","location":"Switzerland","id":4108,"tag":"fr-CH","version":"Release A"},"fr-sy":{"language":"French","location":"Syria","id":4096,"tag":"fr-SY","version":"Release 10"},"fr-tg":{"language":"French","location":"Togo","id":4096,"tag":"fr-TG","version":"Release 10"},"fr-tn":{"language":"French","location":"Tunisia","id":4096,"tag":"fr-TN","version":"Release 10"},"fr-vu":{"language":"French","location":"Vanuatu","id":4096,"tag":"fr-VU","version":"Release 10"},"fr-wf":{"language":"French","location":"Wallis and Futuna","id":4096,"tag":"fr-WF","version":"Release 10"},"fy":{"language":"Frisian","location":null,"id":98,"tag":"fy","version":"Release 7"},"fy-nl":{"language":"Frisian","location":"Netherlands","id":1122,"tag":"fy-NL","version":"Release E2"},"fur":{"language":"Friulian","location":null,"id":4096,"tag":"fur","version":"Release 10"},"fur-it":{"language":"Friulian","location":"Italy","id":4096,"tag":"fur-IT","version":"Release 10"},"ff":{"language":"Fulah","location":null,"id":103,"tag":"ff","version":"Release 8"},"ff-latn":{"language":"Fulah (Latin)","location":null,"id":31847,"tag":"ff-Latn","version":"Release 8"},"ff-latn-bf":{"language":"Fulah (Latin)","location":"Burkina Faso","id":4096,"tag":"ff-Latn-BF","version":"Release 10.4"},"ff-cm":{"language":"Fulah","location":"Cameroon","id":4096,"tag":"ff-CM","version":"Release 10"},"ff-latn-cm":{"language":"Fulah (Latin)","location":"Cameroon","id":4096,"tag":"ff-Latn-CM","version":"Release 10.4"},"ff-latn-gm":{"language":"Fulah (Latin)","location":"Gambia","id":4096,"tag":"ff-Latn-GM","version":"Release 10.4"},"ff-latn-gh":{"language":"Fulah (Latin)","location":"Ghana","id":4096,"tag":"ff-Latn-GH","version":"Release 10.4"},"ff-gn":{"language":"Fulah","location":"Guinea","id":4096,"tag":"ff-GN","version":"Release 10"},"ff-latn-gn":{"language":"Fulah (Latin)","location":"Guinea","id":4096,"tag":"ff-Latn-GN","version":"Release 10.4"},"ff-latn-gw":{"language":"Fulah (Latin)","location":"Guinea-Bissau","id":4096,"tag":"ff-Latn-GW","version":"Release 10.4"},"ff-latn-lr":{"language":"Fulah (Latin)","location":"Liberia","id":4096,"tag":"ff-Latn-LR","version":"Release 10.4"},"ff-mr":{"language":"Fulah","location":"Mauritania","id":4096,"tag":"ff-MR","version":"Release 10"},"ff-latn-mr":{"language":"Fulah (Latin)","location":"Mauritania","id":4096,"tag":"ff-Latn-MR","version":"Release 10.4"},"ff-latn-ne":{"language":"Fulah (Latin)","location":"Niger","id":4096,"tag":"ff-Latn-NE","version":"Release 10.4"},"ff-ng":{"language":"Fulah","location":"Nigeria","id":4096,"tag":"ff-NG","version":"Release 10"},"ff-latn-ng":{"language":"Fulah (Latin)","location":"Nigeria","id":4096,"tag":"ff-Latn-NG","version":"Release 10.4"},"ff-latn-sn":{"language":"Fulah","location":"Senegal","id":2151,"tag":"ff-Latn-SN","version":"Release 8"},"ff-latn-sl":{"language":"Fulah (Latin)","location":"Sierra Leone","id":4096,"tag":"ff-Latn-SL","version":"Release 10.4"},"gl":{"language":"Galician","location":null,"id":86,"tag":"gl","version":"Release 7"},"gl-es":{"language":"Galician","location":"Spain","id":1110,"tag":"gl-ES","version":"Release D"},"lg":{"language":"Ganda","location":null,"id":4096,"tag":"lg","version":"Release 10"},"lg-ug":{"language":"Ganda","location":"Uganda","id":4096,"tag":"lg-UG","version":"Release 10"},"ka":{"language":"Georgian","location":null,"id":55,"tag":"ka","version":"Release 7"},"ka-ge":{"language":"Georgian","location":"Georgia","id":1079,"tag":"ka-GE","version":"Release C"},"de":{"language":"German","location":null,"id":7,"tag":"de","version":"Release 7"},"de-at":{"language":"German","location":"Austria","id":3079,"tag":"de-AT","version":"Release A"},"de-be":{"language":"German","location":"Belgium","id":4096,"tag":"de-BE","version":"Release 10"},"de-de":{"language":"German","location":"Germany","id":1031,"tag":"de-DE","version":"Release A"},"de-it":{"language":"German","location":"Italy","id":4096,"tag":"de-IT","version":"Release 10.2"},"de-li":{"language":"German","location":"Liechtenstein","id":5127,"tag":"de-LI","version":"Release B"},"de-lu":{"language":"German","location":"Luxembourg","id":4103,"tag":"de-LU","version":"Release B"},"de-ch":{"language":"German","location":"Switzerland","id":2055,"tag":"de-CH","version":"Release A"},"el":{"language":"Greek","location":null,"id":8,"tag":"el","version":"Release 7"},"el-cy":{"language":"Greek","location":"Cyprus","id":4096,"tag":"el-CY","version":"Release 10"},"el-gr":{"language":"Greek","location":"Greece","id":1032,"tag":"el-GR","version":"Release A"},"kl":{"language":"Greenlandic","location":null,"id":111,"tag":"kl","version":"Release 7"},"kl-gl":{"language":"Greenlandic","location":"Greenland","id":1135,"tag":"kl-GL","version":"Release V"},"gn":{"language":"Guarani","location":null,"id":116,"tag":"gn","version":"Release 8.1"},"gn-py":{"language":"Guarani","location":"Paraguay","id":1140,"tag":"gn-PY","version":"Release 8.1"},"gu":{"language":"Gujarati","location":null,"id":71,"tag":"gu","version":"Release 7"},"gu-in":{"language":"Gujarati","location":"India","id":1095,"tag":"gu-IN","version":"Release D"},"guz":{"language":"Gusii","location":null,"id":4096,"tag":"guz","version":"Release 10"},"guz-ke":{"language":"Gusii","location":"Kenya","id":4096,"tag":"guz-KE","version":"Release 10"},"ha":{"language":"Hausa (Latin)","location":null,"id":104,"tag":"ha","version":"Release 7"},"ha-latn":{"language":"Hausa (Latin)","location":null,"id":31848,"tag":"ha-Latn","version":"Windows 7"},"ha-latn-gh":{"language":"Hausa (Latin)","location":"Ghana","id":4096,"tag":"ha-Latn-GH","version":"Release 10"},"ha-latn-ne":{"language":"Hausa (Latin)","location":"Niger","id":4096,"tag":"ha-Latn-NE","version":"Release 10"},"ha-latn-ng":{"language":"Hausa (Latin)","location":"Nigeria","id":1128,"tag":"ha-Latn-NG","version":"Release V"},"haw":{"language":"Hawaiian","location":null,"id":117,"tag":"haw","version":"Release 8"},"haw-us":{"language":"Hawaiian","location":"United States","id":1141,"tag":"haw-US","version":"Release 8"},"he":{"language":"Hebrew","location":null,"id":13,"tag":"he","version":"Release 7"},"he-il":{"language":"Hebrew","location":"Israel","id":1037,"tag":"he-IL","version":"Release B"},"hi":{"language":"Hindi","location":null,"id":57,"tag":"hi","version":"Release 7"},"hi-in":{"language":"Hindi","location":"India","id":1081,"tag":"hi-IN","version":"Release C"},"hu":{"language":"Hungarian","location":null,"id":14,"tag":"hu","version":"Release 7"},"hu-hu":{"language":"Hungarian","location":"Hungary","id":1038,"tag":"hu-HU","version":"Release A"},"is":{"language":"Icelandic","location":null,"id":15,"tag":"is","version":"Release 7"},"is-is":{"language":"Icelandic","location":"Iceland","id":1039,"tag":"is-IS","version":"Release A"},"ig":{"language":"Igbo","location":null,"id":112,"tag":"ig","version":"Release 7"},"ig-ng":{"language":"Igbo","location":"Nigeria","id":1136,"tag":"ig-NG","version":"Release V"},"id":{"language":"Indonesian","location":null,"id":33,"tag":"id","version":"Release 7"},"id-id":{"language":"Indonesian","location":"Indonesia","id":1057,"tag":"id-ID","version":"Release B"},"ia":{"language":"Interlingua","location":null,"id":4096,"tag":"ia","version":"Release 10"},"ia-fr":{"language":"Interlingua","location":"France","id":4096,"tag":"ia-FR","version":"Release 10"},"ia-001":{"language":"Interlingua","location":"World","id":4096,"tag":"ia-001","version":"Release 10"},"iu":{"language":"Inuktitut (Latin)","location":null,"id":93,"tag":"iu","version":"Release 7"},"iu-latn":{"language":"Inuktitut (Latin)","location":null,"id":31837,"tag":"iu-Latn","version":"Windows 7"},"iu-latn-ca":{"language":"Inuktitut (Latin)","location":"Canada","id":2141,"tag":"iu-Latn-CA","version":"Release E2"},"iu-cans":{"language":"Inuktitut (Syllabics)","location":null,"id":30813,"tag":"iu-Cans","version":"Windows 7"},"iu-cans-ca":{"language":"Inuktitut (Syllabics)","location":"Canada","id":1117,"tag":"iu-Cans-CA","version":"Release V"},"ga":{"language":"Irish","location":null,"id":60,"tag":"ga","version":"Windows 7"},"ga-ie":{"language":"Irish","location":"Ireland","id":2108,"tag":"ga-IE","version":"Release E2"},"it":{"language":"Italian","location":null,"id":16,"tag":"it","version":"Release 7"},"it-it":{"language":"Italian","location":"Italy","id":1040,"tag":"it-IT","version":"Release A"},"it-sm":{"language":"Italian","location":"San Marino","id":4096,"tag":"it-SM","version":"Release 10"},"it-ch":{"language":"Italian","location":"Switzerland","id":2064,"tag":"it-CH","version":"Release A"},"it-va":{"language":"Italian","location":"Vatican City","id":4096,"tag":"it-VA","version":"Release 10.3"},"ja":{"language":"Japanese","location":null,"id":17,"tag":"ja","version":"Release 7"},"ja-jp":{"language":"Japanese","location":"Japan","id":1041,"tag":"ja-JP","version":"Release A"},"jv":{"language":"Javanese","location":null,"id":4096,"tag":"jv","version":"Release 8.1"},"jv-latn":{"language":"Javanese","location":"Latin","id":4096,"tag":"jv-Latn","version":"Release 8.1"},"jv-latn-id":{"language":"Javanese","location":"Latin, Indonesia","id":4096,"tag":"jv-Latn-ID","version":"Release 8.1"},"dyo":{"language":"Jola-Fonyi","location":null,"id":4096,"tag":"dyo","version":"Release 10"},"dyo-sn":{"language":"Jola-Fonyi","location":"Senegal","id":4096,"tag":"dyo-SN","version":"Release 10"},"kea":{"language":"Kabuverdianu","location":null,"id":4096,"tag":"kea","version":"Release 10"},"kea-cv":{"language":"Kabuverdianu","location":"Cabo Verde","id":4096,"tag":"kea-CV","version":"Release 10"},"kab":{"language":"Kabyle","location":null,"id":4096,"tag":"kab","version":"Release 10"},"kab-dz":{"language":"Kabyle","location":"Algeria","id":4096,"tag":"kab-DZ","version":"Release 10"},"kkj":{"language":"Kako","location":null,"id":4096,"tag":"kkj","version":"Release 10"},"kkj-cm":{"language":"Kako","location":"Cameroon","id":4096,"tag":"kkj-CM","version":"Release 10"},"kln":{"language":"Kalenjin","location":null,"id":4096,"tag":"kln","version":"Release 10"},"kln-ke":{"language":"Kalenjin","location":"Kenya","id":4096,"tag":"kln-KE","version":"Release 10"},"kam":{"language":"Kamba","location":null,"id":4096,"tag":"kam","version":"Release 10"},"kam-ke":{"language":"Kamba","location":"Kenya","id":4096,"tag":"kam-KE","version":"Release 10"},"kn":{"language":"Kannada","location":null,"id":75,"tag":"kn","version":"Release 7"},"kn-in":{"language":"Kannada","location":"India","id":1099,"tag":"kn-IN","version":"Release D"},"ks":{"language":"Kashmiri","location":null,"id":96,"tag":"ks","version":"Release 10"},"ks-arab":{"language":"Kashmiri","location":"Perso-Arabic","id":1120,"tag":"ks-Arab","version":"Release 10"},"ks-arab-in":{"language":"Kashmiri","location":"Perso-Arabic","id":4096,"tag":"ks-Arab-IN","version":"Release 10"},"kk":{"language":"Kazakh","location":null,"id":63,"tag":"kk","version":"Release 7"},"kk-kz":{"language":"Kazakh","location":"Kazakhstan","id":1087,"tag":"kk-KZ","version":"Release C"},"km":{"language":"Khmer","location":null,"id":83,"tag":"km","version":"Release 7"},"km-kh":{"language":"Khmer","location":"Cambodia","id":1107,"tag":"km-KH","version":"Release V"},"quc":{"language":"K'iche","location":null,"id":134,"tag":"quc","version":"Release 10"},"quc-latn-gt":{"language":"K'iche","location":"Guatemala","id":1158,"tag":"quc-Latn-GT","version":"Release 10"},"ki":{"language":"Kikuyu","location":null,"id":4096,"tag":"ki","version":"Release 10"},"ki-ke":{"language":"Kikuyu","location":"Kenya","id":4096,"tag":"ki-KE","version":"Release 10"},"rw":{"language":"Kinyarwanda","location":null,"id":135,"tag":"rw","version":"Release 7"},"rw-rw":{"language":"Kinyarwanda","location":"Rwanda","id":1159,"tag":"rw-RW","version":"Release V"},"sw":{"language":"Kiswahili","location":null,"id":65,"tag":"sw","version":"Release 7"},"sw-ke":{"language":"Kiswahili","location":"Kenya","id":1089,"tag":"sw-KE","version":"Release C"},"sw-tz":{"language":"Kiswahili","location":"Tanzania","id":4096,"tag":"sw-TZ","version":"Release 10"},"sw-ug":{"language":"Kiswahili","location":"Uganda","id":4096,"tag":"sw-UG","version":"Release 10"},"kok":{"language":"Konkani","location":null,"id":87,"tag":"kok","version":"Release 7"},"kok-in":{"language":"Konkani","location":"India","id":1111,"tag":"kok-IN","version":"Release C"},"ko":{"language":"Korean","location":null,"id":18,"tag":"ko","version":"Release 7"},"ko-kr":{"language":"Korean","location":"Korea","id":1042,"tag":"ko-KR","version":"Release A"},"ko-kp":{"language":"Korean","location":"North Korea","id":4096,"tag":"ko-KP","version":"Release 10.1"},"khq":{"language":"Koyra Chiini","location":null,"id":4096,"tag":"khq","version":"Release 10"},"khq-ml":{"language":"Koyra Chiini","location":"Mali","id":4096,"tag":"khq-ML","version":"Release 10"},"ses":{"language":"Koyraboro Senni","location":null,"id":4096,"tag":"ses","version":"Release 10"},"ses-ml":{"language":"Koyraboro Senni","location":"Mali","id":4096,"tag":"ses-ML","version":"Release 10"},"nmg":{"language":"Kwasio","location":null,"id":4096,"tag":"nmg","version":"Release 10"},"nmg-cm":{"language":"Kwasio","location":"Cameroon","id":4096,"tag":"nmg-CM","version":"Release 10"},"ky":{"language":"Kyrgyz","location":null,"id":64,"tag":"ky","version":"Release 7"},"ky-kg":{"language":"Kyrgyz","location":"Kyrgyzstan","id":1088,"tag":"ky-KG","version":"Release D"},"ku-arab-ir":{"language":"Kurdish","location":"Perso-Arabic, Iran","id":4096,"tag":"ku-Arab-IR","version":"Release 10.1"},"lkt":{"language":"Lakota","location":null,"id":4096,"tag":"lkt","version":"Release 10"},"lkt-us":{"language":"Lakota","location":"United States","id":4096,"tag":"lkt-US","version":"Release 10"},"lag":{"language":"Langi","location":null,"id":4096,"tag":"lag","version":"Release 10"},"lag-tz":{"language":"Langi","location":"Tanzania","id":4096,"tag":"lag-TZ","version":"Release 10"},"lo":{"language":"Lao","location":null,"id":84,"tag":"lo","version":"Release 7"},"lo-la":{"language":"Lao","location":"Lao P.D.R.","id":1108,"tag":"lo-LA","version":"Release V"},"lv":{"language":"Latvian","location":null,"id":38,"tag":"lv","version":"Release 7"},"lv-lv":{"language":"Latvian","location":"Latvia","id":1062,"tag":"lv-LV","version":"Release B"},"ln":{"language":"Lingala","location":null,"id":4096,"tag":"ln","version":"Release 10"},"ln-ao":{"language":"Lingala","location":"Angola","id":4096,"tag":"ln-AO","version":"Release 10"},"ln-cf":{"language":"Lingala","location":"Central African Republic","id":4096,"tag":"ln-CF","version":"Release 10"},"ln-cg":{"language":"Lingala","location":"Congo","id":4096,"tag":"ln-CG","version":"Release 10"},"ln-cd":{"language":"Lingala","location":"Congo DRC","id":4096,"tag":"ln-CD","version":"Release 10"},"lt":{"language":"Lithuanian","location":null,"id":39,"tag":"lt","version":"Release 7"},"lt-lt":{"language":"Lithuanian","location":"Lithuania","id":1063,"tag":"lt-LT","version":"Release B"},"nds":{"language":"Low German","location":null,"id":4096,"tag":"nds","version":"Release 10.2"},"nds-de":{"language":"Low German","location":"Germany","id":4096,"tag":"nds-DE","version":"Release 10.2"},"nds-nl":{"language":"Low German","location":"Netherlands","id":4096,"tag":"nds-NL","version":"Release 10.2"},"dsb":{"language":"Lower Sorbian","location":null,"id":31790,"tag":"dsb","version":"Windows 7"},"dsb-de":{"language":"Lower Sorbian","location":"Germany","id":2094,"tag":"dsb-DE","version":"Release V"},"lu":{"language":"Luba-Katanga","location":null,"id":4096,"tag":"lu","version":"Release 10"},"lu-cd":{"language":"Luba-Katanga","location":"Congo DRC","id":4096,"tag":"lu-CD","version":"Release 10"},"luo":{"language":"Luo","location":null,"id":4096,"tag":"luo","version":"Release 10"},"luo-ke":{"language":"Luo","location":"Kenya","id":4096,"tag":"luo-KE","version":"Release 10"},"lb":{"language":"Luxembourgish","location":null,"id":110,"tag":"lb","version":"Release 7"},"lb-lu":{"language":"Luxembourgish","location":"Luxembourg","id":1134,"tag":"lb-LU","version":"Release E2"},"luy":{"language":"Luyia","location":null,"id":4096,"tag":"luy","version":"Release 10"},"luy-ke":{"language":"Luyia","location":"Kenya","id":4096,"tag":"luy-KE","version":"Release 10"},"mk":{"language":"Macedonian","location":null,"id":47,"tag":"mk","version":"Release 7"},"mk-mk":{"language":"Macedonian","location":"North Macedonia","id":1071,"tag":"mk-MK","version":"Release C"},"jmc":{"language":"Machame","location":null,"id":4096,"tag":"jmc","version":"Release 10"},"jmc-tz":{"language":"Machame","location":"Tanzania","id":4096,"tag":"jmc-TZ","version":"Release 10"},"mgh":{"language":"Makhuwa-Meetto","location":null,"id":4096,"tag":"mgh","version":"Release 10"},"mgh-mz":{"language":"Makhuwa-Meetto","location":"Mozambique","id":4096,"tag":"mgh-MZ","version":"Release 10"},"kde":{"language":"Makonde","location":null,"id":4096,"tag":"kde","version":"Release 10"},"kde-tz":{"language":"Makonde","location":"Tanzania","id":4096,"tag":"kde-TZ","version":"Release 10"},"mg":{"language":"Malagasy","location":null,"id":4096,"tag":"mg","version":"Release 8.1"},"mg-mg":{"language":"Malagasy","location":"Madagascar","id":4096,"tag":"mg-MG","version":"Release 8.1"},"ms":{"language":"Malay","location":null,"id":62,"tag":"ms","version":"Release 7"},"ms-bn":{"language":"Malay","location":"Brunei Darussalam","id":2110,"tag":"ms-BN","version":"Release C"},"ms-my":{"language":"Malay","location":"Malaysia","id":1086,"tag":"ms-MY","version":"Release C"},"ml":{"language":"Malayalam","location":null,"id":76,"tag":"ml","version":"Release 7"},"ml-in":{"language":"Malayalam","location":"India","id":1100,"tag":"ml-IN","version":"Release E1"},"mt":{"language":"Maltese","location":null,"id":58,"tag":"mt","version":"Release 7"},"mt-mt":{"language":"Maltese","location":"Malta","id":1082,"tag":"mt-MT","version":"Release E1"},"gv":{"language":"Manx","location":null,"id":4096,"tag":"gv","version":"Release 10"},"gv-im":{"language":"Manx","location":"Isle of Man","id":4096,"tag":"gv-IM","version":"Release 10"},"mi":{"language":"Maori","location":null,"id":129,"tag":"mi","version":"Release 7"},"mi-nz":{"language":"Maori","location":"New Zealand","id":1153,"tag":"mi-NZ","version":"Release E1"},"arn":{"language":"Mapudungun","location":null,"id":122,"tag":"arn","version":"Release 7"},"arn-cl":{"language":"Mapudungun","location":"Chile","id":1146,"tag":"arn-CL","version":"Release E2"},"mr":{"language":"Marathi","location":null,"id":78,"tag":"mr","version":"Release 7"},"mr-in":{"language":"Marathi","location":"India","id":1102,"tag":"mr-IN","version":"Release C"},"mas":{"language":"Masai","location":null,"id":4096,"tag":"mas","version":"Release 10"},"mas-ke":{"language":"Masai","location":"Kenya","id":4096,"tag":"mas-KE","version":"Release 10"},"mas-tz":{"language":"Masai","location":"Tanzania","id":4096,"tag":"mas-TZ","version":"Release 10"},"mzn-ir":{"language":"Mazanderani","location":"Iran","id":4096,"tag":"mzn-IR","version":"Release 10.1"},"mer":{"language":"Meru","location":null,"id":4096,"tag":"mer","version":"Release 10"},"mer-ke":{"language":"Meru","location":"Kenya","id":4096,"tag":"mer-KE","version":"Release 10"},"mgo":{"language":"Meta'","location":null,"id":4096,"tag":"mgo","version":"Release 10"},"mgo-cm":{"language":"Meta'","location":"Cameroon","id":4096,"tag":"mgo-CM","version":"Release 10"},"moh":{"language":"Mohawk","location":null,"id":124,"tag":"moh","version":"Release 7"},"moh-ca":{"language":"Mohawk","location":"Canada","id":1148,"tag":"moh-CA","version":"Release E2"},"mn":{"language":"Mongolian (Cyrillic)","location":null,"id":80,"tag":"mn","version":"Release 7"},"mn-cyrl":{"language":"Mongolian (Cyrillic)","location":null,"id":30800,"tag":"mn-Cyrl","version":"Windows 7"},"mn-mn":{"language":"Mongolian (Cyrillic)","location":"Mongolia","id":1104,"tag":"mn-MN","version":"Release D"},"mn-mong":{"language":"Mongolian (Traditional Mongolian)","location":null,"id":31824,"tag":"mn-Mong","version":"Windows 7"},"mn-mong-cn":{"language":"Mongolian (Traditional Mongolian)","location":"People's Republic of China","id":2128,"tag":"mn-Mong-CN","version":"Windows V"},"mn-mong-mn":{"language":"Mongolian (Traditional Mongolian)","location":"Mongolia","id":3152,"tag":"mn-Mong-MN","version":"Windows 7"},"mfe":{"language":"Morisyen","location":null,"id":4096,"tag":"mfe","version":"Release 10"},"mfe-mu":{"language":"Morisyen","location":"Mauritius","id":4096,"tag":"mfe-MU","version":"Release 10"},"mua":{"language":"Mundang","location":null,"id":4096,"tag":"mua","version":"Release 10"},"mua-cm":{"language":"Mundang","location":"Cameroon","id":4096,"tag":"mua-CM","version":"Release 10"},"nqo":{"language":"N'ko","location":null,"id":4096,"tag":"nqo","version":"Release 8.1"},"nqo-gn":{"language":"N'ko","location":"Guinea","id":4096,"tag":"nqo-GN","version":"Release 8.1"},"naq":{"language":"Nama","location":null,"id":4096,"tag":"naq","version":"Release 10"},"naq-na":{"language":"Nama","location":"Namibia","id":4096,"tag":"naq-NA","version":"Release 10"},"ne":{"language":"Nepali","location":null,"id":97,"tag":"ne","version":"Release 7"},"ne-in":{"language":"Nepali","location":"India","id":2145,"tag":"ne-IN","version":"Release 8.1"},"ne-np":{"language":"Nepali","location":"Nepal","id":1121,"tag":"ne-NP","version":"Release E2"},"nnh":{"language":"Ngiemboon","location":null,"id":4096,"tag":"nnh","version":"Release 10"},"nnh-cm":{"language":"Ngiemboon","location":"Cameroon","id":4096,"tag":"nnh-CM","version":"Release 10"},"jgo":{"language":"Ngomba","location":null,"id":4096,"tag":"jgo","version":"Release 10"},"jgo-cm":{"language":"Ngomba","location":"Cameroon","id":4096,"tag":"jgo-CM","version":"Release 10"},"lrc-iq":{"language":"Northern Luri","location":"Iraq","id":4096,"tag":"lrc-IQ","version":"Release 10.1"},"lrc-ir":{"language":"Northern Luri","location":"Iran","id":4096,"tag":"lrc-IR","version":"Release 10.1"},"nd":{"language":"North Ndebele","location":null,"id":4096,"tag":"nd","version":"Release 10"},"nd-zw":{"language":"North Ndebele","location":"Zimbabwe","id":4096,"tag":"nd-ZW","version":"Release 10"},"no":{"language":"Norwegian (Bokmal)","location":null,"id":20,"tag":"no","version":"Release 7"},"nb":{"language":"Norwegian (Bokmal)","location":null,"id":31764,"tag":"nb","version":"Release 7"},"nb-no":{"language":"Norwegian (Bokmal)","location":"Norway","id":1044,"tag":"nb-NO","version":"Release A"},"nn":{"language":"Norwegian (Nynorsk)","location":null,"id":30740,"tag":"nn","version":"Release 7"},"nn-no":{"language":"Norwegian (Nynorsk)","location":"Norway","id":2068,"tag":"nn-NO","version":"Release A"},"nb-sj":{"language":"Norwegian Bokmål","location":"Svalbard and Jan Mayen","id":4096,"tag":"nb-SJ","version":"Release 10"},"nus":{"language":"Nuer","location":null,"id":4096,"tag":"nus","version":"Release 10"},"nus-sd":{"language":"Nuer","location":"Sudan","id":4096,"tag":"nus-SD","version":"Release 10"},"nus-ss":{"language":"Nuer","location":"South Sudan","id":4096,"tag":"nus-SS","version":"Release 10.1"},"nyn":{"language":"Nyankole","location":null,"id":4096,"tag":"nyn","version":"Release 10"},"nyn-ug":{"language":"Nyankole","location":"Uganda","id":4096,"tag":"nyn-UG","version":"Release 10"},"oc":{"language":"Occitan","location":null,"id":130,"tag":"oc","version":"Release 7"},"oc-fr":{"language":"Occitan","location":"France","id":1154,"tag":"oc-FR","version":"Release V"},"or":{"language":"Odia","location":null,"id":72,"tag":"or","version":"Release 7"},"or-in":{"language":"Odia","location":"India","id":1096,"tag":"or-IN","version":"Release V"},"om":{"language":"Oromo","location":null,"id":114,"tag":"om","version":"Release 8.1"},"om-et":{"language":"Oromo","location":"Ethiopia","id":1138,"tag":"om-ET","version":"Release 8.1"},"om-ke":{"language":"Oromo","location":"Kenya","id":4096,"tag":"om-KE","version":"Release 10"},"os":{"language":"Ossetian","location":null,"id":4096,"tag":"os","version":"Release 10"},"os-ge":{"language":"Ossetian","location":"Cyrillic, Georgia","id":4096,"tag":"os-GE","version":"Release 10"},"os-ru":{"language":"Ossetian","location":"Cyrillic, Russia","id":4096,"tag":"os-RU","version":"Release 10"},"ps":{"language":"Pashto","location":null,"id":99,"tag":"ps","version":"Release 7"},"ps-af":{"language":"Pashto","location":"Afghanistan","id":1123,"tag":"ps-AF","version":"Release E2"},"ps-pk":{"language":"Pashto","location":"Pakistan","id":4096,"tag":"ps-PK","version":"Release 10.5"},"fa":{"language":"Persian","location":null,"id":41,"tag":"fa","version":"Release 7"},"fa-af":{"language":"Persian","location":"Afghanistan","id":4096,"tag":"fa-AF","version":"Release 10"},"fa-ir":{"language":"Persian","location":"Iran","id":1065,"tag":"fa-IR","version":"Release B"},"pl":{"language":"Polish","location":null,"id":21,"tag":"pl","version":"Release 7"},"pl-pl":{"language":"Polish","location":"Poland","id":1045,"tag":"pl-PL","version":"Release A"},"pt":{"language":"Portuguese","location":null,"id":22,"tag":"pt","version":"Release 7"},"pt-ao":{"language":"Portuguese","location":"Angola","id":4096,"tag":"pt-AO","version":"Release 8.1"},"pt-br":{"language":"Portuguese","location":"Brazil","id":1046,"tag":"pt-BR","version":"Release A"},"pt-cv":{"language":"Portuguese","location":"Cabo Verde","id":4096,"tag":"pt-CV","version":"Release 10"},"pt-gq":{"language":"Portuguese","location":"Equatorial Guinea","id":4096,"tag":"pt-GQ","version":"Release 10.2"},"pt-gw":{"language":"Portuguese","location":"Guinea-Bissau","id":4096,"tag":"pt-GW","version":"Release 10"},"pt-lu":{"language":"Portuguese","location":"Luxembourg","id":4096,"tag":"pt-LU","version":"Release 10.2"},"pt-mo":{"language":"Portuguese","location":"Macao SAR","id":4096,"tag":"pt-MO","version":"Release 10"},"pt-mz":{"language":"Portuguese","location":"Mozambique","id":4096,"tag":"pt-MZ","version":"Release 10"},"pt-pt":{"language":"Portuguese","location":"Portugal","id":2070,"tag":"pt-PT","version":"Release A"},"pt-st":{"language":"Portuguese","location":"São Tomé and Príncipe","id":4096,"tag":"pt-ST","version":"Release 10"},"pt-ch":{"language":"Portuguese","location":"Switzerland","id":4096,"tag":"pt-CH","version":"Release 10.2"},"pt-tl":{"language":"Portuguese","location":"Timor-Leste","id":4096,"tag":"pt-TL","version":"Release 10"},"prg-001":{"language":"Prussian","location":null,"id":4096,"tag":"prg-001","version":"Release 10.1"},"qps-ploca":{"language":"Pseudo Language","location":"Pseudo locale for east Asian/complex script localization testing","id":1534,"tag":"qps-ploca","version":"Release 7"},"qps-ploc":{"language":"Pseudo Language","location":"Pseudo locale used for localization testing","id":1281,"tag":"qps-ploc","version":"Release 7"},"qps-plocm":{"language":"Pseudo Language","location":"Pseudo locale used for localization testing of mirrored locales","id":2559,"tag":"qps-plocm","version":"Release 7"},"pa":{"language":"Punjabi","location":null,"id":70,"tag":"pa","version":"Release 7"},"pa-arab":{"language":"Punjabi","location":null,"id":31814,"tag":"pa-Arab","version":"Release 8"},"pa-in":{"language":"Punjabi","location":"India","id":1094,"tag":"pa-IN","version":"Release D"},"pa-arab-pk":{"language":"Punjabi","location":"Islamic Republic of Pakistan","id":2118,"tag":"pa-Arab-PK","version":"Release 8"},"quz":{"language":"Quechua","location":null,"id":107,"tag":"quz","version":"Release 7"},"quz-bo":{"language":"Quechua","location":"Bolivia","id":1131,"tag":"quz-BO","version":"Release E1"},"quz-ec":{"language":"Quechua","location":"Ecuador","id":2155,"tag":"quz-EC","version":"Release E1"},"quz-pe":{"language":"Quechua","location":"Peru","id":3179,"tag":"quz-PE","version":"Release E1"},"ksh":{"language":"Ripuarian","location":null,"id":4096,"tag":"ksh","version":"Release 10"},"ksh-de":{"language":"Ripuarian","location":"Germany","id":4096,"tag":"ksh-DE","version":"Release 10"},"ro":{"language":"Romanian","location":null,"id":24,"tag":"ro","version":"Release 7"},"ro-md":{"language":"Romanian","location":"Moldova","id":2072,"tag":"ro-MD","version":"Release 8.1"},"ro-ro":{"language":"Romanian","location":"Romania","id":1048,"tag":"ro-RO","version":"Release A"},"rm":{"language":"Romansh","location":null,"id":23,"tag":"rm","version":"Release 7"},"rm-ch":{"language":"Romansh","location":"Switzerland","id":1047,"tag":"rm-CH","version":"Release E2"},"rof":{"language":"Rombo","location":null,"id":4096,"tag":"rof","version":"Release 10"},"rof-tz":{"language":"Rombo","location":"Tanzania","id":4096,"tag":"rof-TZ","version":"Release 10"},"rn":{"language":"Rundi","location":null,"id":4096,"tag":"rn","version":"Release 10"},"rn-bi":{"language":"Rundi","location":"Burundi","id":4096,"tag":"rn-BI","version":"Release 10"},"ru":{"language":"Russian","location":null,"id":25,"tag":"ru","version":"Release 7"},"ru-by":{"language":"Russian","location":"Belarus","id":4096,"tag":"ru-BY","version":"Release 10"},"ru-kz":{"language":"Russian","location":"Kazakhstan","id":4096,"tag":"ru-KZ","version":"Release 10"},"ru-kg":{"language":"Russian","location":"Kyrgyzstan","id":4096,"tag":"ru-KG","version":"Release 10"},"ru-md":{"language":"Russian","location":"Moldova","id":2073,"tag":"ru-MD","version":"Release 10"},"ru-ru":{"language":"Russian","location":"Russia","id":1049,"tag":"ru-RU","version":"Release A"},"ru-ua":{"language":"Russian","location":"Ukraine","id":4096,"tag":"ru-UA","version":"Release 10"},"rwk":{"language":"Rwa","location":null,"id":4096,"tag":"rwk","version":"Release 10"},"rwk-tz":{"language":"Rwa","location":"Tanzania","id":4096,"tag":"rwk-TZ","version":"Release 10"},"ssy":{"language":"Saho","location":null,"id":4096,"tag":"ssy","version":"Release 10"},"ssy-er":{"language":"Saho","location":"Eritrea","id":4096,"tag":"ssy-ER","version":"Release 10"},"sah":{"language":"Sakha","location":null,"id":133,"tag":"sah","version":"Release 7"},"sah-ru":{"language":"Sakha","location":"Russia","id":1157,"tag":"sah-RU","version":"Release V"},"saq":{"language":"Samburu","location":null,"id":4096,"tag":"saq","version":"Release 10"},"saq-ke":{"language":"Samburu","location":"Kenya","id":4096,"tag":"saq-KE","version":"Release 10"},"smn":{"language":"Sami (Inari)","location":null,"id":28731,"tag":"smn","version":"Windows 7"},"smn-fi":{"language":"Sami (Inari)","location":"Finland","id":9275,"tag":"smn-FI","version":"Release E1"},"smj":{"language":"Sami (Lule)","location":null,"id":31803,"tag":"smj","version":"Windows 7"},"smj-no":{"language":"Sami (Lule)","location":"Norway","id":4155,"tag":"smj-NO","version":"Release E1"},"smj-se":{"language":"Sami (Lule)","location":"Sweden","id":5179,"tag":"smj-SE","version":"Release E1"},"se":{"language":"Sami (Northern)","location":null,"id":59,"tag":"se","version":"Release 7"},"se-fi":{"language":"Sami (Northern)","location":"Finland","id":3131,"tag":"se-FI","version":"Release E1"},"se-no":{"language":"Sami (Northern)","location":"Norway","id":1083,"tag":"se-NO","version":"Release E1"},"se-se":{"language":"Sami (Northern)","location":"Sweden","id":2107,"tag":"se-SE","version":"Release E1"},"sms":{"language":"Sami (Skolt)","location":null,"id":29755,"tag":"sms","version":"Windows 7"},"sms-fi":{"language":"Sami (Skolt)","location":"Finland","id":8251,"tag":"sms-FI","version":"Release E1"},"sma":{"language":"Sami (Southern)","location":null,"id":30779,"tag":"sma","version":"Windows 7"},"sma-no":{"language":"Sami (Southern)","location":"Norway","id":6203,"tag":"sma-NO","version":"Release E1"},"sma-se":{"language":"Sami (Southern)","location":"Sweden","id":7227,"tag":"sma-SE","version":"Release E1"},"sg":{"language":"Sango","location":null,"id":4096,"tag":"sg","version":"Release 10"},"sg-cf":{"language":"Sango","location":"Central African Republic","id":4096,"tag":"sg-CF","version":"Release 10"},"sbp":{"language":"Sangu","location":null,"id":4096,"tag":"sbp","version":"Release 10"},"sbp-tz":{"language":"Sangu","location":"Tanzania","id":4096,"tag":"sbp-TZ","version":"Release 10"},"sa":{"language":"Sanskrit","location":null,"id":79,"tag":"sa","version":"Release 7"},"sa-in":{"language":"Sanskrit","location":"India","id":1103,"tag":"sa-IN","version":"Release C"},"gd":{"language":"Scottish Gaelic","location":null,"id":145,"tag":"gd","version":"Windows 7"},"gd-gb":{"language":"Scottish Gaelic","location":"United Kingdom","id":1169,"tag":"gd-GB","version":"Release 7"},"seh":{"language":"Sena","location":null,"id":4096,"tag":"seh","version":"Release 10"},"seh-mz":{"language":"Sena","location":"Mozambique","id":4096,"tag":"seh-MZ","version":"Release 10"},"sr-cyrl":{"language":"Serbian (Cyrillic)","location":null,"id":27674,"tag":"sr-Cyrl","version":"Windows 7"},"sr-cyrl-ba":{"language":"Serbian (Cyrillic)","location":"Bosnia and Herzegovina","id":7194,"tag":"sr-Cyrl-BA","version":"Release E1"},"sr-cyrl-me":{"language":"Serbian (Cyrillic)","location":"Montenegro","id":12314,"tag":"sr-Cyrl-ME","version":"Release 7"},"sr-cyrl-rs":{"language":"Serbian (Cyrillic)","location":"Serbia","id":10266,"tag":"sr-Cyrl-RS","version":"Release 7"},"sr-cyrl-cs":{"language":"Serbian (Cyrillic)","location":"Serbia and Montenegro (Former)","id":3098,"tag":"sr-Cyrl-CS","version":"Release B"},"sr-latn":{"language":"Serbian (Latin)","location":null,"id":28698,"tag":"sr-Latn","version":"Windows 7"},"sr":{"language":"Serbian (Latin)","location":null,"id":31770,"tag":"sr","version":"Release 7"},"sr-latn-ba":{"language":"Serbian (Latin)","location":"Bosnia and Herzegovina","id":6170,"tag":"sr-Latn-BA","version":"Release E1"},"sr-latn-me":{"language":"Serbian (Latin)","location":"Montenegro","id":11290,"tag":"sr-Latn-ME","version":"Release 7"},"sr-latn-rs":{"language":"Serbian (Latin)","location":"Serbia","id":9242,"tag":"sr-Latn-RS","version":"Release 7"},"sr-latn-cs":{"language":"Serbian (Latin)","location":"Serbia and Montenegro (Former)","id":2074,"tag":"sr-Latn-CS","version":"Release B"},"nso":{"language":"Sesotho sa Leboa","location":null,"id":108,"tag":"nso","version":"Release 7"},"nso-za":{"language":"Sesotho sa Leboa","location":"South Africa","id":1132,"tag":"nso-ZA","version":"Release E1"},"tn":{"language":"Setswana","location":null,"id":50,"tag":"tn","version":"Release 7"},"tn-bw":{"language":"Setswana","location":"Botswana","id":2098,"tag":"tn-BW","version":"Release 8"},"tn-za":{"language":"Setswana","location":"South Africa","id":1074,"tag":"tn-ZA","version":"Release E1"},"ksb":{"language":"Shambala","location":null,"id":4096,"tag":"ksb","version":"Release 10"},"ksb-tz":{"language":"Shambala","location":"Tanzania","id":4096,"tag":"ksb-TZ","version":"Release 10"},"sn":{"language":"Shona","location":null,"id":4096,"tag":"sn","version":"Release 8.1"},"sn-latn":{"language":"Shona","location":"Latin","id":4096,"tag":"sn-Latn","version":"Release 8.1"},"sn-latn-zw":{"language":"Shona","location":"Zimbabwe","id":4096,"tag":"sn-Latn-ZW","version":"Release 8.1"},"sd":{"language":"Sindhi","location":null,"id":89,"tag":"sd","version":"Release 8"},"sd-arab":{"language":"Sindhi","location":null,"id":31833,"tag":"sd-Arab","version":"Release 8"},"sd-arab-pk":{"language":"Sindhi","location":"Islamic Republic of Pakistan","id":2137,"tag":"sd-Arab-PK","version":"Release 8"},"si":{"language":"Sinhala","location":null,"id":91,"tag":"si","version":"Release 7"},"si-lk":{"language":"Sinhala","location":"Sri Lanka","id":1115,"tag":"si-LK","version":"Release V"},"sk":{"language":"Slovak","location":null,"id":27,"tag":"sk","version":"Release 7"},"sk-sk":{"language":"Slovak","location":"Slovakia","id":1051,"tag":"sk-SK","version":"Release A"},"sl":{"language":"Slovenian","location":null,"id":36,"tag":"sl","version":"Release 7"},"sl-si":{"language":"Slovenian","location":"Slovenia","id":1060,"tag":"sl-SI","version":"Release A"},"xog":{"language":"Soga","location":null,"id":4096,"tag":"xog","version":"Release 10"},"xog-ug":{"language":"Soga","location":"Uganda","id":4096,"tag":"xog-UG","version":"Release 10"},"so":{"language":"Somali","location":null,"id":119,"tag":"so","version":"Release 8.1"},"so-dj":{"language":"Somali","location":"Djibouti","id":4096,"tag":"so-DJ","version":"Release 10"},"so-et":{"language":"Somali","location":"Ethiopia","id":4096,"tag":"so-ET","version":"Release 10"},"so-ke":{"language":"Somali","location":"Kenya","id":4096,"tag":"so-KE","version":"Release 10"},"so-so":{"language":"Somali","location":"Somalia","id":1143,"tag":"so-SO","version":"Release 8.1"},"st":{"language":"Sotho","location":null,"id":48,"tag":"st","version":"Release 8.1"},"st-za":{"language":"Sotho","location":"South Africa","id":1072,"tag":"st-ZA","version":"Release 8.1"},"nr":{"language":"South Ndebele","location":null,"id":4096,"tag":"nr","version":"Release 10"},"nr-za":{"language":"South Ndebele","location":"South Africa","id":4096,"tag":"nr-ZA","version":"Release 10"},"st-ls":{"language":"Southern Sotho","location":"Lesotho","id":4096,"tag":"st-LS","version":"Release 10"},"es":{"language":"Spanish","location":null,"id":10,"tag":"es","version":"Release 7"},"es-ar":{"language":"Spanish","location":"Argentina","id":11274,"tag":"es-AR","version":"Release B"},"es-bz":{"language":"Spanish","location":"Belize","id":4096,"tag":"es-BZ","version":"Release 10.3"},"es-ve":{"language":"Spanish","location":"Bolivarian Republic of Venezuela","id":8202,"tag":"es-VE","version":"Release B"},"es-bo":{"language":"Spanish","location":"Bolivia","id":16394,"tag":"es-BO","version":"Release B"},"es-br":{"language":"Spanish","location":"Brazil","id":4096,"tag":"es-BR","version":"Release 10.2"},"es-cl":{"language":"Spanish","location":"Chile","id":13322,"tag":"es-CL","version":"Release B"},"es-co":{"language":"Spanish","location":"Colombia","id":9226,"tag":"es-CO","version":"Release B"},"es-cr":{"language":"Spanish","location":"Costa Rica","id":5130,"tag":"es-CR","version":"Release B"},"es-cu":{"language":"Spanish","location":"Cuba","id":23562,"tag":"es-CU","version":"Release 10"},"es-do":{"language":"Spanish","location":"Dominican Republic","id":7178,"tag":"es-DO","version":"Release B"},"es-ec":{"language":"Spanish","location":"Ecuador","id":12298,"tag":"es-EC","version":"Release B"},"es-sv":{"language":"Spanish","location":"El Salvador","id":17418,"tag":"es-SV","version":"Release B"},"es-gq":{"language":"Spanish","location":"Equatorial Guinea","id":4096,"tag":"es-GQ","version":"Release 10"},"es-gt":{"language":"Spanish","location":"Guatemala","id":4106,"tag":"es-GT","version":"Release B"},"es-hn":{"language":"Spanish","location":"Honduras","id":18442,"tag":"es-HN","version":"Release B"},"es-419":{"language":"Spanish","location":"Latin America","id":22538,"tag":"es-419","version":"Release 8.1"},"es-mx":{"language":"Spanish","location":"Mexico","id":2058,"tag":"es-MX","version":"Release A"},"es-ni":{"language":"Spanish","location":"Nicaragua","id":19466,"tag":"es-NI","version":"Release B"},"es-pa":{"language":"Spanish","location":"Panama","id":6154,"tag":"es-PA","version":"Release B"},"es-py":{"language":"Spanish","location":"Paraguay","id":15370,"tag":"es-PY","version":"Release B"},"es-pe":{"language":"Spanish","location":"Peru","id":10250,"tag":"es-PE","version":"Release B"},"es-ph":{"language":"Spanish","location":"Philippines","id":4096,"tag":"es-PH","version":"Release 10"},"es-pr":{"language":"Spanish","location":"Puerto Rico","id":20490,"tag":"es-PR","version":"Release B"},"es-es_tradnl":{"language":"Spanish","location":"Spain","id":1034,"tag":"es-ES_tradnl","version":"Release A"},"es-es":{"language":"Spanish","location":"Spain","id":3082,"tag":"es-ES","version":"Release A"},"es-us":{"language":"Spanish","location":"UnitedStates","id":21514,"tag":"es-US","version":"Release V"},"es-uy":{"language":"Spanish","location":"Uruguay","id":14346,"tag":"es-UY","version":"Release B"},"zgh":{"language":"Standard Moroccan Tamazight","location":null,"id":4096,"tag":"zgh","version":"Release 8.1"},"zgh-tfng-ma":{"language":"Standard Moroccan Tamazight","location":"Morocco","id":4096,"tag":"zgh-Tfng-MA","version":"Release 8.1"},"zgh-tfng":{"language":"Standard Moroccan Tamazight","location":"Tifinagh","id":4096,"tag":"zgh-Tfng","version":"Release 8.1"},"ss":{"language":"Swati","location":null,"id":4096,"tag":"ss","version":"Release 10"},"ss-za":{"language":"Swati","location":"South Africa","id":4096,"tag":"ss-ZA","version":"Release 10"},"ss-sz":{"language":"Swati","location":"Swaziland","id":4096,"tag":"ss-SZ","version":"Release 10"},"sv":{"language":"Swedish","location":null,"id":29,"tag":"sv","version":"Release 7"},"sv-ax":{"language":"Swedish","location":"Åland Islands","id":4096,"tag":"sv-AX","version":"Release 10"},"sv-fi":{"language":"Swedish","location":"Finland","id":2077,"tag":"sv-FI","version":"Release B"},"sv-se":{"language":"Swedish","location":"Sweden","id":1053,"tag":"sv-SE","version":"Release A"},"syr":{"language":"Syriac","location":null,"id":90,"tag":"syr","version":"Release 7"},"syr-sy":{"language":"Syriac","location":"Syria","id":1114,"tag":"syr-SY","version":"Release D"},"shi":{"language":"Tachelhit","location":null,"id":4096,"tag":"shi","version":"Release 10"},"shi-tfng":{"language":"Tachelhit","location":"Tifinagh","id":4096,"tag":"shi-Tfng","version":"Release 10"},"shi-tfng-ma":{"language":"Tachelhit","location":"Tifinagh, Morocco","id":4096,"tag":"shi-Tfng-MA","version":"Release 10"},"shi-latn":{"language":"Tachelhit (Latin)","location":null,"id":4096,"tag":"shi-Latn","version":"Release 10"},"shi-latn-ma":{"language":"Tachelhit (Latin)","location":"Morocco","id":4096,"tag":"shi-Latn-MA","version":"Release 10"},"dav":{"language":"Taita","location":null,"id":4096,"tag":"dav","version":"Release 10"},"dav-ke":{"language":"Taita","location":"Kenya","id":4096,"tag":"dav-KE","version":"Release 10"},"tg":{"language":"Tajik (Cyrillic)","location":null,"id":40,"tag":"tg","version":"Release 7"},"tg-cyrl":{"language":"Tajik (Cyrillic)","location":null,"id":31784,"tag":"tg-Cyrl","version":"Windows 7"},"tg-cyrl-tj":{"language":"Tajik (Cyrillic)","location":"Tajikistan","id":1064,"tag":"tg-Cyrl-TJ","version":"Release V"},"tzm":{"language":"Tamazight (Latin)","location":null,"id":95,"tag":"tzm","version":"Release 7"},"tzm-latn":{"language":"Tamazight (Latin)","location":null,"id":31839,"tag":"tzm-Latn","version":"Windows 7"},"tzm-latn-dz":{"language":"Tamazight (Latin)","location":"Algeria","id":2143,"tag":"tzm-Latn-DZ","version":"Release V"},"ta":{"language":"Tamil","location":null,"id":73,"tag":"ta","version":"Release 7"},"ta-in":{"language":"Tamil","location":"India","id":1097,"tag":"ta-IN","version":"Release C"},"ta-my":{"language":"Tamil","location":"Malaysia","id":4096,"tag":"ta-MY","version":"Release 10"},"ta-sg":{"language":"Tamil","location":"Singapore","id":4096,"tag":"ta-SG","version":"Release 10"},"ta-lk":{"language":"Tamil","location":"Sri Lanka","id":2121,"tag":"ta-LK","version":"Release 8"},"twq":{"language":"Tasawaq","location":null,"id":4096,"tag":"twq","version":"Release 10"},"twq-ne":{"language":"Tasawaq","location":"Niger","id":4096,"tag":"twq-NE","version":"Release 10"},"tt":{"language":"Tatar","location":null,"id":68,"tag":"tt","version":"Release 7"},"tt-ru":{"language":"Tatar","location":"Russia","id":1092,"tag":"tt-RU","version":"Release D"},"te":{"language":"Telugu","location":null,"id":74,"tag":"te","version":"Release 7"},"te-in":{"language":"Telugu","location":"India","id":1098,"tag":"te-IN","version":"Release D"},"teo":{"language":"Teso","location":null,"id":4096,"tag":"teo","version":"Release 10"},"teo-ke":{"language":"Teso","location":"Kenya","id":4096,"tag":"teo-KE","version":"Release 10"},"teo-ug":{"language":"Teso","location":"Uganda","id":4096,"tag":"teo-UG","version":"Release 10"},"th":{"language":"Thai","location":null,"id":30,"tag":"th","version":"Release 7"},"th-th":{"language":"Thai","location":"Thailand","id":1054,"tag":"th-TH","version":"Release B"},"bo":{"language":"Tibetan","location":null,"id":81,"tag":"bo","version":"Release 7"},"bo-in":{"language":"Tibetan","location":"India","id":4096,"tag":"bo-IN","version":"Release 10"},"bo-cn":{"language":"Tibetan","location":"People's Republic of China","id":1105,"tag":"bo-CN","version":"Release V"},"tig":{"language":"Tigre","location":null,"id":4096,"tag":"tig","version":"Release 10"},"tig-er":{"language":"Tigre","location":"Eritrea","id":4096,"tag":"tig-ER","version":"Release 10"},"ti":{"language":"Tigrinya","location":null,"id":115,"tag":"ti","version":"Release 8"},"ti-er":{"language":"Tigrinya","location":"Eritrea","id":2163,"tag":"ti-ER","version":"Release 8"},"ti-et":{"language":"Tigrinya","location":"Ethiopia","id":1139,"tag":"ti-ET","version":"Release 8"},"to":{"language":"Tongan","location":null,"id":4096,"tag":"to","version":"Release 10"},"to-to":{"language":"Tongan","location":"Tonga","id":4096,"tag":"to-TO","version":"Release 10"},"ts":{"language":"Tsonga","location":null,"id":49,"tag":"ts","version":"Release 8.1"},"ts-za":{"language":"Tsonga","location":"South Africa","id":1073,"tag":"ts-ZA","version":"Release 8.1"},"tr":{"language":"Turkish","location":null,"id":31,"tag":"tr","version":"Release 7"},"tr-cy":{"language":"Turkish","location":"Cyprus","id":4096,"tag":"tr-CY","version":"Release 10"},"tr-tr":{"language":"Turkish","location":"Turkey","id":1055,"tag":"tr-TR","version":"Release A"},"tk":{"language":"Turkmen","location":null,"id":66,"tag":"tk","version":"Release 7"},"tk-tm":{"language":"Turkmen","location":"Turkmenistan","id":1090,"tag":"tk-TM","version":"Release V"},"uk":{"language":"Ukrainian","location":null,"id":34,"tag":"uk","version":"Release 7"},"uk-ua":{"language":"Ukrainian","location":"Ukraine","id":1058,"tag":"uk-UA","version":"Release B"},"hsb":{"language":"Upper Sorbian","location":null,"id":46,"tag":"hsb","version":"Release 7"},"hsb-de":{"language":"Upper Sorbian","location":"Germany","id":1070,"tag":"hsb-DE","version":"Release V"},"ur":{"language":"Urdu","location":null,"id":32,"tag":"ur","version":"Release 7"},"ur-in":{"language":"Urdu","location":"India","id":2080,"tag":"ur-IN","version":"Release 8.1"},"ur-pk":{"language":"Urdu","location":"Islamic Republic of Pakistan","id":1056,"tag":"ur-PK","version":"Release C"},"ug":{"language":"Uyghur","location":null,"id":128,"tag":"ug","version":"Release 7"},"ug-cn":{"language":"Uyghur","location":"People's Republic of China","id":1152,"tag":"ug-CN","version":"Release V"},"uz-arab":{"language":"Uzbek","location":"Perso-Arabic","id":4096,"tag":"uz-Arab","version":"Release 10"},"uz-arab-af":{"language":"Uzbek","location":"Perso-Arabic, Afghanistan","id":4096,"tag":"uz-Arab-AF","version":"Release 10"},"uz-cyrl":{"language":"Uzbek (Cyrillic)","location":null,"id":30787,"tag":"uz-Cyrl","version":"Windows 7"},"uz-cyrl-uz":{"language":"Uzbek (Cyrillic)","location":"Uzbekistan","id":2115,"tag":"uz-Cyrl-UZ","version":"Release C"},"uz":{"language":"Uzbek (Latin)","location":null,"id":67,"tag":"uz","version":"Release 7"},"uz-latn":{"language":"Uzbek (Latin)","location":null,"id":31811,"tag":"uz-Latn","version":"Windows7"},"uz-latn-uz":{"language":"Uzbek (Latin)","location":"Uzbekistan","id":1091,"tag":"uz-Latn-UZ","version":"Release C"},"vai":{"language":"Vai","location":null,"id":4096,"tag":"vai","version":"Release 10"},"vai-vaii":{"language":"Vai","location":null,"id":4096,"tag":"vai-Vaii","version":"Release 10"},"vai-vaii-lr":{"language":"Vai","location":"Liberia","id":4096,"tag":"vai-Vaii-LR","version":"Release 10"},"vai-latn-lr":{"language":"Vai (Latin)","location":"Liberia","id":4096,"tag":"vai-Latn-LR","version":"Release 10"},"vai-latn":{"language":"Vai (Latin)","location":null,"id":4096,"tag":"vai-Latn","version":"Release 10"},"ca-es-":{"language":"Valencian","location":"Spain","id":2051,"tag":"ca-ES-","version":"Release 8"},"ve":{"language":"Venda","location":null,"id":51,"tag":"ve","version":"Release 10"},"ve-za":{"language":"Venda","location":"South Africa","id":1075,"tag":"ve-ZA","version":"Release 10"},"vi":{"language":"Vietnamese","location":null,"id":42,"tag":"vi","version":"Release 7"},"vi-vn":{"language":"Vietnamese","location":"Vietnam","id":1066,"tag":"vi-VN","version":"Release B"},"vo":{"language":"Volapük","location":null,"id":4096,"tag":"vo","version":"Release 10"},"vo-001":{"language":"Volapük","location":"World","id":4096,"tag":"vo-001","version":"Release 10"},"vun":{"language":"Vunjo","location":null,"id":4096,"tag":"vun","version":"Release 10"},"vun-tz":{"language":"Vunjo","location":"Tanzania","id":4096,"tag":"vun-TZ","version":"Release 10"},"wae":{"language":"Walser","location":null,"id":4096,"tag":"wae","version":"Release 10"},"wae-ch":{"language":"Walser","location":"Switzerland","id":4096,"tag":"wae-CH","version":"Release 10"},"cy":{"language":"Welsh","location":null,"id":82,"tag":"cy","version":"Release 7"},"cy-gb":{"language":"Welsh","location":"United Kingdom","id":1106,"tag":"cy-GB","version":"ReleaseE1"},"wal":{"language":"Wolaytta","location":null,"id":4096,"tag":"wal","version":"Release 10"},"wal-et":{"language":"Wolaytta","location":"Ethiopia","id":4096,"tag":"wal-ET","version":"Release 10"},"wo":{"language":"Wolof","location":null,"id":136,"tag":"wo","version":"Release 7"},"wo-sn":{"language":"Wolof","location":"Senegal","id":1160,"tag":"wo-SN","version":"Release V"},"xh":{"language":"Xhosa","location":null,"id":52,"tag":"xh","version":"Release 7"},"xh-za":{"language":"Xhosa","location":"South Africa","id":1076,"tag":"xh-ZA","version":"Release E1"},"yav":{"language":"Yangben","location":null,"id":4096,"tag":"yav","version":"Release 10"},"yav-cm":{"language":"Yangben","location":"Cameroon","id":4096,"tag":"yav-CM","version":"Release 10"},"ii":{"language":"Yi","location":null,"id":120,"tag":"ii","version":"Release 7"},"ii-cn":{"language":"Yi","location":"People's Republic of China","id":1144,"tag":"ii-CN","version":"Release V"},"yo":{"language":"Yoruba","location":null,"id":106,"tag":"yo","version":"Release 7"},"yo-bj":{"language":"Yoruba","location":"Benin","id":4096,"tag":"yo-BJ","version":"Release 10"},"yo-ng":{"language":"Yoruba","location":"Nigeria","id":1130,"tag":"yo-NG","version":"Release V"},"dje":{"language":"Zarma","location":null,"id":4096,"tag":"dje","version":"Release 10"},"dje-ne":{"language":"Zarma","location":"Niger","id":4096,"tag":"dje-NE","version":"Release 10"},"zu":{"language":"Zulu","location":null,"id":53,"tag":"zu","version":"Release 7"},"zu-za":{"language":"Zulu","location":"South Africa","id":1077,"tag":"zu-ZA","version":"Release E1"}};

/***/ }),

/***/ 272:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('rm', _rm, {
  cmdOptions: {
    'f': 'force',
    'r': 'recursive',
    'R': 'recursive',
  },
});

// Recursively removes 'dir'
// Adapted from https://github.com/ryanmcgrath/wrench-js
//
// Copyright (c) 2010 Ryan McGrath
// Copyright (c) 2012 Artur Adib
//
// Licensed under the MIT License
// http://www.opensource.org/licenses/mit-license.php
function rmdirSyncRecursive(dir, force, fromSymlink) {
  var files;

  files = fs.readdirSync(dir);

  // Loop through and delete everything in the sub-tree after checking it
  for (var i = 0; i < files.length; i++) {
    var file = dir + '/' + files[i];
    var currFile = common.statNoFollowLinks(file);

    if (currFile.isDirectory()) { // Recursive function back to the beginning
      rmdirSyncRecursive(file, force);
    } else { // Assume it's a file - perhaps a try/catch belongs here?
      if (force || isWriteable(file)) {
        try {
          common.unlinkSync(file);
        } catch (e) {
          /* istanbul ignore next */
          common.error('could not remove file (code ' + e.code + '): ' + file, {
            continue: true,
          });
        }
      }
    }
  }

  // if was directory was referenced through a symbolic link,
  // the contents should be removed, but not the directory itself
  if (fromSymlink) return;

  // Now that we know everything in the sub-tree has been deleted, we can delete the main directory.
  // Huzzah for the shopkeep.

  var result;
  try {
    // Retry on windows, sometimes it takes a little time before all the files in the directory are gone
    var start = Date.now();

    // TODO: replace this with a finite loop
    for (;;) {
      try {
        result = fs.rmdirSync(dir);
        if (fs.existsSync(dir)) throw { code: 'EAGAIN' };
        break;
      } catch (er) {
        /* istanbul ignore next */
        // In addition to error codes, also check if the directory still exists and loop again if true
        if (process.platform === 'win32' && (er.code === 'ENOTEMPTY' || er.code === 'EBUSY' || er.code === 'EPERM' || er.code === 'EAGAIN')) {
          if (Date.now() - start > 1000) throw er;
        } else if (er.code === 'ENOENT') {
          // Directory did not exist, deletion was successful
          break;
        } else {
          throw er;
        }
      }
    }
  } catch (e) {
    common.error('could not remove directory (code ' + e.code + '): ' + dir, { continue: true });
  }

  return result;
} // rmdirSyncRecursive

// Hack to determine if file has write permissions for current user
// Avoids having to check user, group, etc, but it's probably slow
function isWriteable(file) {
  var writePermission = true;
  try {
    var __fd = fs.openSync(file, 'a');
    fs.closeSync(__fd);
  } catch (e) {
    writePermission = false;
  }

  return writePermission;
}

function handleFile(file, options) {
  if (options.force || isWriteable(file)) {
    // -f was passed, or file is writable, so it can be removed
    common.unlinkSync(file);
  } else {
    common.error('permission denied: ' + file, { continue: true });
  }
}

function handleDirectory(file, options) {
  if (options.recursive) {
    // -r was passed, so directory can be removed
    rmdirSyncRecursive(file, options.force);
  } else {
    common.error('path is a directory', { continue: true });
  }
}

function handleSymbolicLink(file, options) {
  var stats;
  try {
    stats = common.statFollowLinks(file);
  } catch (e) {
    // symlink is broken, so remove the symlink itself
    common.unlinkSync(file);
    return;
  }

  if (stats.isFile()) {
    common.unlinkSync(file);
  } else if (stats.isDirectory()) {
    if (file[file.length - 1] === '/') {
      // trailing separator, so remove the contents, not the link
      if (options.recursive) {
        // -r was passed, so directory can be removed
        var fromSymlink = true;
        rmdirSyncRecursive(file, options.force, fromSymlink);
      } else {
        common.error('path is a directory', { continue: true });
      }
    } else {
      // no trailing separator, so remove the link
      common.unlinkSync(file);
    }
  }
}

function handleFIFO(file) {
  common.unlinkSync(file);
}

//@
//@ ### rm([options,] file [, file ...])
//@ ### rm([options,] file_array)
//@
//@ Available options:
//@
//@ + `-f`: force
//@ + `-r, -R`: recursive
//@
//@ Examples:
//@
//@ ```javascript
//@ rm('-rf', '/tmp/*');
//@ rm('some_file.txt', 'another_file.txt');
//@ rm(['some_file.txt', 'another_file.txt']); // same as above
//@ ```
//@
//@ Removes files.
function _rm(options, files) {
  if (!files) common.error('no paths given');

  // Convert to array
  files = [].slice.call(arguments, 1);

  files.forEach(function (file) {
    var lstats;
    try {
      var filepath = (file[file.length - 1] === '/')
        ? file.slice(0, -1) // remove the '/' so lstatSync can detect symlinks
        : file;
      lstats = common.statNoFollowLinks(filepath); // test for existence
    } catch (e) {
      // Path does not exist, no force flag given
      if (!options.force) {
        common.error('no such file or directory: ' + file, { continue: true });
      }
      return; // skip file
    }

    // If here, path exists
    if (lstats.isFile()) {
      handleFile(file, options);
    } else if (lstats.isDirectory()) {
      handleDirectory(file, options);
    } else if (lstats.isSymbolicLink()) {
      handleSymbolicLink(file, options);
    } else if (lstats.isFIFO()) {
      handleFIFO(file);
    }
  }); // forEach(file)
  return '';
} // rm
module.exports = _rm;


/***/ }),

/***/ 280:
/***/ (function(module) {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),

/***/ 284:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('test', _test, {
  cmdOptions: {
    'b': 'block',
    'c': 'character',
    'd': 'directory',
    'e': 'exists',
    'f': 'file',
    'L': 'link',
    'p': 'pipe',
    'S': 'socket',
  },
  wrapOutput: false,
  allowGlobbing: false,
});


//@
//@ ### test(expression)
//@
//@ Available expression primaries:
//@
//@ + `'-b', 'path'`: true if path is a block device
//@ + `'-c', 'path'`: true if path is a character device
//@ + `'-d', 'path'`: true if path is a directory
//@ + `'-e', 'path'`: true if path exists
//@ + `'-f', 'path'`: true if path is a regular file
//@ + `'-L', 'path'`: true if path is a symbolic link
//@ + `'-p', 'path'`: true if path is a pipe (FIFO)
//@ + `'-S', 'path'`: true if path is a socket
//@
//@ Examples:
//@
//@ ```javascript
//@ if (test('-d', path)) { /* do something with dir */ };
//@ if (!test('-f', path)) continue; // skip if it's a regular file
//@ ```
//@
//@ Evaluates `expression` using the available primaries and returns corresponding value.
function _test(options, path) {
  if (!path) common.error('no path given');

  var canInterpret = false;
  Object.keys(options).forEach(function (key) {
    if (options[key] === true) {
      canInterpret = true;
    }
  });

  if (!canInterpret) common.error('could not interpret expression');

  if (options.link) {
    try {
      return common.statNoFollowLinks(path).isSymbolicLink();
    } catch (e) {
      return false;
    }
  }

  if (!fs.existsSync(path)) return false;

  if (options.exists) return true;

  var stats = common.statFollowLinks(path);

  if (options.block) return stats.isBlockDevice();

  if (options.character) return stats.isCharacterDevice();

  if (options.directory) return stats.isDirectory();

  if (options.file) return stats.isFile();

  /* istanbul ignore next */
  if (options.pipe) return stats.isFIFO();

  /* istanbul ignore next */
  if (options.socket) return stats.isSocket();

  /* istanbul ignore next */
  return false; // fallback
} // test
module.exports = _test;


/***/ }),

/***/ 291:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
function deepFreeze(object) {
    for (const value of Object.values(object)) {
        if (is_1.default.plainObject(value) || is_1.default.array(value)) {
            deepFreeze(value);
        }
    }
    return Object.freeze(object);
}
exports.default = deepFreeze;


/***/ }),

/***/ 293:
/***/ (function(module) {

module.exports = require("buffer");

/***/ }),

/***/ 299:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const VERSION = "2.3.0";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      next() {
        if (!url) {
          return Promise.resolve({
            done: true
          });
        }

        return requestMethod({
          method,
          url,
          headers
        }).then(normalizePaginatedListResponse).then(response => {
          // `response.headers.link` format:
          // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
          // sets `url` to undefined if "next" URL is not present or `link` header is not set
          url = ((response.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
          return {
            value: response
          };
        });
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 302:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = realpath
realpath.realpath = realpath
realpath.sync = realpathSync
realpath.realpathSync = realpathSync
realpath.monkeypatch = monkeypatch
realpath.unmonkeypatch = unmonkeypatch

var fs = __webpack_require__(747)
var origRealpath = fs.realpath
var origRealpathSync = fs.realpathSync

var version = process.version
var ok = /^v[0-5]\./.test(version)
var old = __webpack_require__(117)

function newError (er) {
  return er && er.syscall === 'realpath' && (
    er.code === 'ELOOP' ||
    er.code === 'ENOMEM' ||
    er.code === 'ENAMETOOLONG'
  )
}

function realpath (p, cache, cb) {
  if (ok) {
    return origRealpath(p, cache, cb)
  }

  if (typeof cache === 'function') {
    cb = cache
    cache = null
  }
  origRealpath(p, cache, function (er, result) {
    if (newError(er)) {
      old.realpath(p, cache, cb)
    } else {
      cb(er, result)
    }
  })
}

function realpathSync (p, cache) {
  if (ok) {
    return origRealpathSync(p, cache)
  }

  try {
    return origRealpathSync(p, cache)
  } catch (er) {
    if (newError(er)) {
      return old.realpathSync(p, cache)
    } else {
      throw er
    }
  }
}

function monkeypatch () {
  fs.realpath = realpath
  fs.realpathSync = realpathSync
}

function unmonkeypatch () {
  fs.realpath = origRealpath
  fs.realpathSync = origRealpathSync
}


/***/ }),

/***/ 303:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(614);
const JSONB = __webpack_require__(205);

const loadStore = opts => {
	const adapters = {
		redis: '@keyv/redis',
		mongodb: '@keyv/mongo',
		mongo: '@keyv/mongo',
		sqlite: '@keyv/sqlite',
		postgresql: '@keyv/postgres',
		postgres: '@keyv/postgres',
		mysql: '@keyv/mysql'
	};
	if (opts.adapter || opts.uri) {
		const adapter = opts.adapter || /^[^:]*/.exec(opts.uri)[0];
		return new (require(adapters[adapter]))(opts);
	}

	return new Map();
};

class Keyv extends EventEmitter {
	constructor(uri, opts) {
		super();
		this.opts = Object.assign(
			{
				namespace: 'keyv',
				serialize: JSONB.stringify,
				deserialize: JSONB.parse
			},
			(typeof uri === 'string') ? { uri } : uri,
			opts
		);

		if (!this.opts.store) {
			const adapterOpts = Object.assign({}, this.opts);
			this.opts.store = loadStore(adapterOpts);
		}

		if (typeof this.opts.store.on === 'function') {
			this.opts.store.on('error', err => this.emit('error', err));
		}

		this.opts.store.namespace = this.opts.namespace;
	}

	_getKeyPrefix(key) {
		return `${this.opts.namespace}:${key}`;
	}

	get(key, opts) {
		const keyPrefixed = this._getKeyPrefix(key);
		const { store } = this.opts;
		return Promise.resolve()
			.then(() => store.get(keyPrefixed))
			.then(data => {
				return (typeof data === 'string') ? this.opts.deserialize(data) : data;
			})
			.then(data => {
				if (data === undefined) {
					return undefined;
				}

				if (typeof data.expires === 'number' && Date.now() > data.expires) {
					this.delete(key);
					return undefined;
				}

				return (opts && opts.raw) ? data : data.value;
			});
	}

	set(key, value, ttl) {
		const keyPrefixed = this._getKeyPrefix(key);
		if (typeof ttl === 'undefined') {
			ttl = this.opts.ttl;
		}

		if (ttl === 0) {
			ttl = undefined;
		}

		const { store } = this.opts;

		return Promise.resolve()
			.then(() => {
				const expires = (typeof ttl === 'number') ? (Date.now() + ttl) : null;
				value = { value, expires };
				return this.opts.serialize(value);
			})
			.then(value => store.set(keyPrefixed, value, ttl))
			.then(() => true);
	}

	delete(key) {
		const keyPrefixed = this._getKeyPrefix(key);
		const { store } = this.opts;
		return Promise.resolve()
			.then(() => store.delete(keyPrefixed));
	}

	clear() {
		const { store } = this.opts;
		return Promise.resolve()
			.then(() => store.clear());
	}
}

module.exports = Keyv;


/***/ }),

/***/ 306:
/***/ (function(module, __unusedexports, __webpack_require__) {

var concatMap = __webpack_require__(896);
var balanced = __webpack_require__(621);

module.exports = expandTop;

var escSlash = '\0SLASH'+Math.random()+'\0';
var escOpen = '\0OPEN'+Math.random()+'\0';
var escClose = '\0CLOSE'+Math.random()+'\0';
var escComma = '\0COMMA'+Math.random()+'\0';
var escPeriod = '\0PERIOD'+Math.random()+'\0';

function numeric(str) {
  return parseInt(str, 10) == str
    ? parseInt(str, 10)
    : str.charCodeAt(0);
}

function escapeBraces(str) {
  return str.split('\\\\').join(escSlash)
            .split('\\{').join(escOpen)
            .split('\\}').join(escClose)
            .split('\\,').join(escComma)
            .split('\\.').join(escPeriod);
}

function unescapeBraces(str) {
  return str.split(escSlash).join('\\')
            .split(escOpen).join('{')
            .split(escClose).join('}')
            .split(escComma).join(',')
            .split(escPeriod).join('.');
}


// Basically just str.split(","), but handling cases
// where we have nested braced sections, which should be
// treated as individual members, like {a,{b,c},d}
function parseCommaParts(str) {
  if (!str)
    return [''];

  var parts = [];
  var m = balanced('{', '}', str);

  if (!m)
    return str.split(',');

  var pre = m.pre;
  var body = m.body;
  var post = m.post;
  var p = pre.split(',');

  p[p.length-1] += '{' + body + '}';
  var postParts = parseCommaParts(post);
  if (post.length) {
    p[p.length-1] += postParts.shift();
    p.push.apply(p, postParts);
  }

  parts.push.apply(parts, p);

  return parts;
}

function expandTop(str) {
  if (!str)
    return [];

  // I don't know why Bash 4.3 does this, but it does.
  // Anything starting with {} will have the first two bytes preserved
  // but *only* at the top level, so {},a}b will not expand to anything,
  // but a{},b}c will be expanded to [a}c,abc].
  // One could argue that this is a bug in Bash, but since the goal of
  // this module is to match Bash's rules, we escape a leading {}
  if (str.substr(0, 2) === '{}') {
    str = '\\{\\}' + str.substr(2);
  }

  return expand(escapeBraces(str), true).map(unescapeBraces);
}

function identity(e) {
  return e;
}

function embrace(str) {
  return '{' + str + '}';
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}

function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}

function expand(str, isTop) {
  var expansions = [];

  var m = balanced('{', '}', str);
  if (!m || /\$$/.test(m.pre)) return [str];

  var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
  var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
  var isSequence = isNumericSequence || isAlphaSequence;
  var isOptions = m.body.indexOf(',') >= 0;
  if (!isSequence && !isOptions) {
    // {a},b}
    if (m.post.match(/,.*\}/)) {
      str = m.pre + '{' + m.body + escClose + m.post;
      return expand(str);
    }
    return [str];
  }

  var n;
  if (isSequence) {
    n = m.body.split(/\.\./);
  } else {
    n = parseCommaParts(m.body);
    if (n.length === 1) {
      // x{{a,b}}y ==> x{a}y x{b}y
      n = expand(n[0], false).map(embrace);
      if (n.length === 1) {
        var post = m.post.length
          ? expand(m.post, false)
          : [''];
        return post.map(function(p) {
          return m.pre + n[0] + p;
        });
      }
    }
  }

  // at this point, n is the parts, and we know it's not a comma set
  // with a single entry.

  // no need to expand pre, since it is guaranteed to be free of brace-sets
  var pre = m.pre;
  var post = m.post.length
    ? expand(m.post, false)
    : [''];

  var N;

  if (isSequence) {
    var x = numeric(n[0]);
    var y = numeric(n[1]);
    var width = Math.max(n[0].length, n[1].length)
    var incr = n.length == 3
      ? Math.abs(numeric(n[2]))
      : 1;
    var test = lte;
    var reverse = y < x;
    if (reverse) {
      incr *= -1;
      test = gte;
    }
    var pad = n.some(isPadded);

    N = [];

    for (var i = x; test(i, y); i += incr) {
      var c;
      if (isAlphaSequence) {
        c = String.fromCharCode(i);
        if (c === '\\')
          c = '';
      } else {
        c = String(i);
        if (pad) {
          var need = width - c.length;
          if (need > 0) {
            var z = new Array(need + 1).join('0');
            if (i < 0)
              c = '-' + z + c.slice(1);
            else
              c = z + c;
          }
        }
      }
      N.push(c);
    }
  } else {
    N = concatMap(n, function(el) { return expand(el, false) });
  }

  for (var j = 0; j < N.length; j++) {
    for (var k = 0; k < post.length; k++) {
      var expansion = pre + N[j] + post[k];
      if (!isTop || isSequence || expansion)
        expansions.push(expansion);
    }
  }

  return expansions;
}



/***/ }),

/***/ 315:
/***/ (function(module) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      })
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor
      var TempCtor = function () {}
      TempCtor.prototype = superCtor.prototype
      ctor.prototype = new TempCtor()
      ctor.prototype.constructor = ctor
    }
  }
}


/***/ }),

/***/ 323:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultHandler = void 0;
const is_1 = __webpack_require__(534);
const as_promise_1 = __webpack_require__(577);
const create_rejection_1 = __webpack_require__(910);
const core_1 = __webpack_require__(946);
const deep_freeze_1 = __webpack_require__(291);
const errors = {
    RequestError: as_promise_1.RequestError,
    CacheError: as_promise_1.CacheError,
    ReadError: as_promise_1.ReadError,
    HTTPError: as_promise_1.HTTPError,
    MaxRedirectsError: as_promise_1.MaxRedirectsError,
    TimeoutError: as_promise_1.TimeoutError,
    ParseError: as_promise_1.ParseError,
    CancelError: as_promise_1.CancelError,
    UnsupportedProtocolError: as_promise_1.UnsupportedProtocolError,
    UploadError: as_promise_1.UploadError
};
// The `delay` package weighs 10KB (!)
const delay = async (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});
const { normalizeArguments } = core_1.default;
const mergeOptions = (...sources) => {
    let mergedOptions;
    for (const source of sources) {
        mergedOptions = normalizeArguments(undefined, source, mergedOptions);
    }
    return mergedOptions;
};
const getPromiseOrStream = (options) => options.isStream ? new core_1.default(undefined, options) : as_promise_1.default(options);
const isGotInstance = (value) => ('defaults' in value && 'options' in value.defaults);
const aliases = [
    'get',
    'post',
    'put',
    'patch',
    'head',
    'delete'
];
exports.defaultHandler = (options, next) => next(options);
const callInitHooks = (hooks, options) => {
    if (hooks) {
        for (const hook of hooks) {
            hook(options);
        }
    }
};
const create = (defaults) => {
    // Proxy properties from next handlers
    defaults._rawHandlers = defaults.handlers;
    defaults.handlers = defaults.handlers.map(fn => ((options, next) => {
        // This will be assigned by assigning result
        let root;
        const result = fn(options, newOptions => {
            root = next(newOptions);
            return root;
        });
        if (result !== root && !options.isStream && root) {
            const typedResult = result;
            const { then: promiseThen, catch: promiseCatch, finally: promiseFianlly } = typedResult;
            Object.setPrototypeOf(typedResult, Object.getPrototypeOf(root));
            Object.defineProperties(typedResult, Object.getOwnPropertyDescriptors(root));
            // These should point to the new promise
            // eslint-disable-next-line promise/prefer-await-to-then
            typedResult.then = promiseThen;
            typedResult.catch = promiseCatch;
            typedResult.finally = promiseFianlly;
        }
        return result;
    }));
    // Got interface
    const got = ((url, options = {}, _defaults) => {
        var _a, _b;
        let iteration = 0;
        const iterateHandlers = (newOptions) => {
            return defaults.handlers[iteration++](newOptions, iteration === defaults.handlers.length ? getPromiseOrStream : iterateHandlers);
        };
        // TODO: Remove this in Got 12.
        if (is_1.default.plainObject(url)) {
            const mergedOptions = {
                ...url,
                ...options
            };
            core_1.setNonEnumerableProperties([url, options], mergedOptions);
            options = mergedOptions;
            url = undefined;
        }
        try {
            // Call `init` hooks
            let initHookError;
            try {
                callInitHooks(defaults.options.hooks.init, options);
                callInitHooks((_a = options.hooks) === null || _a === void 0 ? void 0 : _a.init, options);
            }
            catch (error) {
                initHookError = error;
            }
            // Normalize options & call handlers
            const normalizedOptions = normalizeArguments(url, options, _defaults !== null && _defaults !== void 0 ? _defaults : defaults.options);
            normalizedOptions[core_1.kIsNormalizedAlready] = true;
            if (initHookError) {
                throw new as_promise_1.RequestError(initHookError.message, initHookError, normalizedOptions);
            }
            return iterateHandlers(normalizedOptions);
        }
        catch (error) {
            if (options.isStream) {
                throw error;
            }
            else {
                return create_rejection_1.default(error, defaults.options.hooks.beforeError, (_b = options.hooks) === null || _b === void 0 ? void 0 : _b.beforeError);
            }
        }
    });
    got.extend = (...instancesOrOptions) => {
        const optionsArray = [defaults.options];
        let handlers = [...defaults._rawHandlers];
        let isMutableDefaults;
        for (const value of instancesOrOptions) {
            if (isGotInstance(value)) {
                optionsArray.push(value.defaults.options);
                handlers.push(...value.defaults._rawHandlers);
                isMutableDefaults = value.defaults.mutableDefaults;
            }
            else {
                optionsArray.push(value);
                if ('handlers' in value) {
                    handlers.push(...value.handlers);
                }
                isMutableDefaults = value.mutableDefaults;
            }
        }
        handlers = handlers.filter(handler => handler !== exports.defaultHandler);
        if (handlers.length === 0) {
            handlers.push(exports.defaultHandler);
        }
        return create({
            options: mergeOptions(...optionsArray),
            handlers,
            mutableDefaults: Boolean(isMutableDefaults)
        });
    };
    // Pagination
    const paginateEach = (async function* (url, options) {
        // TODO: Remove this `@ts-expect-error` when upgrading to TypeScript 4.
        // Error: Argument of type 'Merge<Options, PaginationOptions<T, R>> | undefined' is not assignable to parameter of type 'Options | undefined'.
        // @ts-expect-error
        let normalizedOptions = normalizeArguments(url, options, defaults.options);
        normalizedOptions.resolveBodyOnly = false;
        const pagination = normalizedOptions.pagination;
        if (!is_1.default.object(pagination)) {
            throw new TypeError('`options.pagination` must be implemented');
        }
        const all = [];
        let { countLimit } = pagination;
        let numberOfRequests = 0;
        while (numberOfRequests < pagination.requestLimit) {
            if (numberOfRequests !== 0) {
                // eslint-disable-next-line no-await-in-loop
                await delay(pagination.backoff);
            }
            // @ts-expect-error FIXME!
            // TODO: Throw when result is not an instance of Response
            // eslint-disable-next-line no-await-in-loop
            const result = (await got(undefined, undefined, normalizedOptions));
            // eslint-disable-next-line no-await-in-loop
            const parsed = await pagination.transform(result);
            const current = [];
            for (const item of parsed) {
                if (pagination.filter(item, all, current)) {
                    if (!pagination.shouldContinue(item, all, current)) {
                        return;
                    }
                    yield item;
                    if (pagination.stackAllItems) {
                        all.push(item);
                    }
                    current.push(item);
                    if (--countLimit <= 0) {
                        return;
                    }
                }
            }
            const optionsToMerge = pagination.paginate(result, all, current);
            if (optionsToMerge === false) {
                return;
            }
            if (optionsToMerge === result.request.options) {
                normalizedOptions = result.request.options;
            }
            else if (optionsToMerge !== undefined) {
                normalizedOptions = normalizeArguments(undefined, optionsToMerge, normalizedOptions);
            }
            numberOfRequests++;
        }
    });
    got.paginate = paginateEach;
    got.paginate.all = (async (url, options) => {
        const results = [];
        for await (const item of paginateEach(url, options)) {
            results.push(item);
        }
        return results;
    });
    // For those who like very descriptive names
    got.paginate.each = paginateEach;
    // Stream API
    got.stream = ((url, options) => got(url, { ...options, isStream: true }));
    // Shortcuts
    for (const method of aliases) {
        got[method] = ((url, options) => got(url, { ...options, method }));
        got.stream[method] = ((url, options) => {
            return got(url, { ...options, method, isStream: true });
        });
    }
    Object.assign(got, errors);
    Object.defineProperty(got, 'defaults', {
        value: defaults.mutableDefaults ? defaults : deep_freeze_1.default(defaults),
        writable: defaults.mutableDefaults,
        configurable: defaults.mutableDefaults,
        enumerable: true
    });
    got.mergeOptions = mergeOptions;
    return got;
};
exports.default = create;
__exportStar(__webpack_require__(839), exports);


/***/ }),

/***/ 325:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const PassThrough = __webpack_require__(794).PassThrough;
const mimicResponse = __webpack_require__(89);

const cloneResponse = response => {
	if (!(response && response.pipe)) {
		throw new TypeError('Parameter `response` must be a response stream.');
	}

	const clone = new PassThrough();
	mimicResponse(response, clone);

	return response.pipe(clone);
};

module.exports = cloneResponse;


/***/ }),

/***/ 340:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('sort', _sort, {
  canReceivePipe: true,
  cmdOptions: {
    'r': 'reverse',
    'n': 'numerical',
  },
});

// parse out the number prefix of a line
function parseNumber(str) {
  var match = str.match(/^\s*(\d*)\s*(.*)$/);
  return { num: Number(match[1]), value: match[2] };
}

// compare two strings case-insensitively, but examine case for strings that are
// case-insensitive equivalent
function unixCmp(a, b) {
  var aLower = a.toLowerCase();
  var bLower = b.toLowerCase();
  return (aLower === bLower ?
      -1 * a.localeCompare(b) : // unix sort treats case opposite how javascript does
      aLower.localeCompare(bLower));
}

// compare two strings in the fashion that unix sort's -n option works
function numericalCmp(a, b) {
  var objA = parseNumber(a);
  var objB = parseNumber(b);
  if (objA.hasOwnProperty('num') && objB.hasOwnProperty('num')) {
    return ((objA.num !== objB.num) ?
        (objA.num - objB.num) :
        unixCmp(objA.value, objB.value));
  } else {
    return unixCmp(objA.value, objB.value);
  }
}

//@
//@ ### sort([options,] file [, file ...])
//@ ### sort([options,] file_array)
//@
//@ Available options:
//@
//@ + `-r`: Reverse the results
//@ + `-n`: Compare according to numerical value
//@
//@ Examples:
//@
//@ ```javascript
//@ sort('foo.txt', 'bar.txt');
//@ sort('-r', 'foo.txt');
//@ ```
//@
//@ Return the contents of the `file`s, sorted line-by-line. Sorting multiple
//@ files mixes their content (just as unix `sort` does).
function _sort(options, files) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no files given');

  files = [].slice.call(arguments, 1);

  if (pipe) {
    files.unshift('-');
  }

  var lines = files.reduce(function (accum, file) {
    if (file !== '-') {
      if (!fs.existsSync(file)) {
        common.error('no such file or directory: ' + file, { continue: true });
        return accum;
      } else if (common.statFollowLinks(file).isDirectory()) {
        common.error('read failed: ' + file + ': Is a directory', {
          continue: true,
        });
        return accum;
      }
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
    return accum.concat(contents.trimRight().split('\n'));
  }, []);

  var sorted = lines.sort(options.numerical ? numericalCmp : unixCmp);

  if (options.reverse) {
    sorted = sorted.reverse();
  }

  return sorted.join('\n') + '\n';
}

module.exports = _sort;


/***/ }),

/***/ 349:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.search = void 0;
const source_1 = __importDefault(__webpack_require__(77));
const search = async (q) => {
    const results = await source_1.default(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(q)}`);
    console.log(results.body);
    console.log(results.body.items);
    const result = results.body.items.sort((a, b) => (Number(b.volumeInfo.ratingsCount) || 0) - (Number(a.volumeInfo.ratingsCount) || 0))[0];
    if (!result)
        throw new Error("Book not found");
    return {
        title: result.volumeInfo.title,
        authors: result.volumeInfo.authors,
        publisher: result.volumeInfo.publisher,
        publishedDate: result.volumeInfo.publishedDate,
        description: result.volumeInfo.description,
        image: result.volumeInfo.imageLinks.thumbnail,
        language: result.volumeInfo.language,
        averageRating: result.volumeInfo.averageRating,
        ratingsCount: result.volumeInfo.ratingsCount,
        categories: result.volumeInfo.categories,
        pageCount: result.volumeInfo.pageCount,
        isbn10: (result.volumeInfo.industryIdentifiers.find((i) => i.type === "ISBN_10") || {})
            .identifier,
        isbn13: (result.volumeInfo.industryIdentifiers.find((i) => i.type === "ISBN_13") || {})
            .identifier,
        googleBooks: {
            id: result.id,
            preview: result.volumeInfo.previewLink,
            info: result.volumeInfo.infoLink,
            canonical: result.volumeInfo.canonicalVolumeLink,
        },
    };
};
exports.search = search;
//# sourceMappingURL=google-books.js.map

/***/ }),

/***/ 357:
/***/ (function(module) {

module.exports = require("assert");

/***/ }),

/***/ 359:
/***/ (function(module, __unusedexports, __webpack_require__) {

var path = __webpack_require__(622);
var common = __webpack_require__(602);

common.register('pwd', _pwd, {
  allowGlobbing: false,
});

//@
//@ ### pwd()
//@
//@ Returns the current directory.
function _pwd() {
  var pwd = path.resolve(process.cwd());
  return pwd;
}
module.exports = _pwd;


/***/ }),

/***/ 379:
/***/ (function(module, __unusedexports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
if (require.main !== module) {
  throw new Error('This file should not be required');
}

var childProcess = __webpack_require__(129);
var fs = __webpack_require__(747);

var paramFilePath = process.argv[2];

var serializedParams = fs.readFileSync(paramFilePath, 'utf8');
var params = JSON.parse(serializedParams);

var cmd = params.command;
var execOptions = params.execOptions;
var pipe = params.pipe;
var stdoutFile = params.stdoutFile;
var stderrFile = params.stderrFile;

var c = childProcess.exec(cmd, execOptions, function (err) {
  if (!err) {
    process.exitCode = 0;
  } else if (err.code === undefined) {
    process.exitCode = 1;
  } else {
    process.exitCode = err.code;
  }
});

var stdoutStream = fs.createWriteStream(stdoutFile);
var stderrStream = fs.createWriteStream(stderrFile);

c.stdout.pipe(stdoutStream);
c.stderr.pipe(stderrStream);
c.stdout.pipe(process.stdout);
c.stderr.pipe(process.stderr);

if (pipe) {
  c.stdin.end(pipe);
}


/***/ }),

/***/ 380:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('to', _to, {
  pipeOnly: true,
  wrapOutput: false,
});

//@
//@ ### ShellString.prototype.to(file)
//@
//@ Examples:
//@
//@ ```javascript
//@ cat('input.txt').to('output.txt');
//@ ```
//@
//@ Analogous to the redirection operator `>` in Unix, but works with
//@ `ShellStrings` (such as those returned by `cat`, `grep`, etc.). _Like Unix
//@ redirections, `to()` will overwrite any existing file!_
function _to(options, file) {
  if (!file) common.error('wrong arguments');

  if (!fs.existsSync(path.dirname(file))) {
    common.error('no such file or directory: ' + path.dirname(file));
  }

  try {
    fs.writeFileSync(file, this.stdout || this.toString(), 'utf8');
    return this;
  } catch (e) {
    /* istanbul ignore next */
    common.error('could not write to file (code ' + e.code + '): ' + file, { continue: true });
  }
}
module.exports = _to;


/***/ }),

/***/ 383:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDetailsToLabels = void 0;
const locale_codes_1 = __webpack_require__(186);
const randomcolor_1 = __importDefault(__webpack_require__(685));
/**
 * Convert a string to title case and trim it
 * @private
 * @param str - String to clean up
 */
const clean = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()).trim();
const addDetailsToLabels = async (owner, repo, octokit) => {
    const labels = await octokit.issues.listLabelsForRepo({ owner, repo });
    for await (const label of labels.data) {
        let color = label.color;
        let description = label.description;
        if (label.color === "ededed")
            color = randomcolor_1.default({ luminosity: "light" }).replace("#", "");
        if (label.description === null) {
            if (label.name === "kind: book")
                description = "This issue tracks a book (reading progress)";
            else if (label.name.startsWith("started: "))
                description = `This book was started in ${clean(label.name.split("started: ")[1])}`;
            else if (label.name.startsWith("completed: "))
                description = `This book was completed in ${clean(label.name.split("completed: ")[1])}`;
            else if (label.name.startsWith("year: "))
                description = `This book was published in ${clean(label.name.split("year: ")[1])}`;
            else if (label.name.startsWith("decade: "))
                description = `This book was published in the ${clean(label.name.split("decade: ")[1])}s`;
            else if (label.name.startsWith("language: "))
                description = `This book was published in ${locale_codes_1.getByTag(label.name.split("language: ")[1].trim())}`;
            else if (label.name.startsWith("publisher: "))
                description = `This book was published by ${clean(label.name.split("publisher: ")[1])}`;
            else if (label.name.startsWith("author: "))
                description = `This book was written by ${clean(label.name.split("author: ")[1])}`;
            else if (label.name.startsWith("category: "))
                description = `This book is of the category "${clean(label.name.split("category: ")[1])}"`;
        }
        if (color !== label.color || description !== label.description)
            await octokit.issues.updateLabel({ owner, repo, name: label.name, color, description });
    }
};
exports.addDetailsToLabels = addDetailsToLabels;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 385:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isPlainObject = _interopDefault(__webpack_require__(696));
var universalUserAgent = __webpack_require__(562);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{+$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequset = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequset) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.5";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 390:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";


const EventEmitter = __webpack_require__(614);
const urlLib = __webpack_require__(835);
const normalizeUrl = __webpack_require__(236);
const getStream = __webpack_require__(145);
const CachePolicy = __webpack_require__(154);
const Response = __webpack_require__(114);
const lowercaseKeys = __webpack_require__(474);
const cloneResponse = __webpack_require__(325);
const Keyv = __webpack_require__(303);

class CacheableRequest {
	constructor(request, cacheAdapter) {
		if (typeof request !== 'function') {
			throw new TypeError('Parameter `request` must be a function');
		}

		this.cache = new Keyv({
			uri: typeof cacheAdapter === 'string' && cacheAdapter,
			store: typeof cacheAdapter !== 'string' && cacheAdapter,
			namespace: 'cacheable-request'
		});

		return this.createCacheableRequest(request);
	}

	createCacheableRequest(request) {
		return (opts, cb) => {
			let url;
			if (typeof opts === 'string') {
				url = normalizeUrlObject(urlLib.parse(opts));
				opts = {};
			} else if (opts instanceof urlLib.URL) {
				url = normalizeUrlObject(urlLib.parse(opts.toString()));
				opts = {};
			} else {
				const [pathname, ...searchParts] = (opts.path || '').split('?');
				const search = searchParts.length > 0 ?
					`?${searchParts.join('?')}` :
					'';
				url = normalizeUrlObject({ ...opts, pathname, search });
			}

			opts = {
				headers: {},
				method: 'GET',
				cache: true,
				strictTtl: false,
				automaticFailover: false,
				...opts,
				...urlObjectToRequestOptions(url)
			};
			opts.headers = lowercaseKeys(opts.headers);

			const ee = new EventEmitter();
			const normalizedUrlString = normalizeUrl(
				urlLib.format(url),
				{
					stripWWW: false,
					removeTrailingSlash: false,
					stripAuthentication: false
				}
			);
			const key = `${opts.method}:${normalizedUrlString}`;
			let revalidate = false;
			let madeRequest = false;

			const makeRequest = opts => {
				madeRequest = true;
				let requestErrored = false;
				let requestErrorCallback;

				const requestErrorPromise = new Promise(resolve => {
					requestErrorCallback = () => {
						if (!requestErrored) {
							requestErrored = true;
							resolve();
						}
					};
				});

				const handler = response => {
					if (revalidate && !opts.forceRefresh) {
						response.status = response.statusCode;
						const revalidatedPolicy = CachePolicy.fromObject(revalidate.cachePolicy).revalidatedPolicy(opts, response);
						if (!revalidatedPolicy.modified) {
							const headers = revalidatedPolicy.policy.responseHeaders();
							response = new Response(revalidate.statusCode, headers, revalidate.body, revalidate.url);
							response.cachePolicy = revalidatedPolicy.policy;
							response.fromCache = true;
						}
					}

					if (!response.fromCache) {
						response.cachePolicy = new CachePolicy(opts, response, opts);
						response.fromCache = false;
					}

					let clonedResponse;
					if (opts.cache && response.cachePolicy.storable()) {
						clonedResponse = cloneResponse(response);

						(async () => {
							try {
								const bodyPromise = getStream.buffer(response);

								await Promise.race([
									requestErrorPromise,
									new Promise(resolve => response.once('end', resolve))
								]);

								if (requestErrored) {
									return;
								}

								const body = await bodyPromise;

								const value = {
									cachePolicy: response.cachePolicy.toObject(),
									url: response.url,
									statusCode: response.fromCache ? revalidate.statusCode : response.statusCode,
									body
								};

								let ttl = opts.strictTtl ? response.cachePolicy.timeToLive() : undefined;
								if (opts.maxTtl) {
									ttl = ttl ? Math.min(ttl, opts.maxTtl) : opts.maxTtl;
								}

								await this.cache.set(key, value, ttl);
							} catch (error) {
								ee.emit('error', new CacheableRequest.CacheError(error));
							}
						})();
					} else if (opts.cache && revalidate) {
						(async () => {
							try {
								await this.cache.delete(key);
							} catch (error) {
								ee.emit('error', new CacheableRequest.CacheError(error));
							}
						})();
					}

					ee.emit('response', clonedResponse || response);
					if (typeof cb === 'function') {
						cb(clonedResponse || response);
					}
				};

				try {
					const req = request(opts, handler);
					req.once('error', requestErrorCallback);
					req.once('abort', requestErrorCallback);
					ee.emit('request', req);
				} catch (error) {
					ee.emit('error', new CacheableRequest.RequestError(error));
				}
			};

			(async () => {
				const get = async opts => {
					await Promise.resolve();

					const cacheEntry = opts.cache ? await this.cache.get(key) : undefined;
					if (typeof cacheEntry === 'undefined') {
						return makeRequest(opts);
					}

					const policy = CachePolicy.fromObject(cacheEntry.cachePolicy);
					if (policy.satisfiesWithoutRevalidation(opts) && !opts.forceRefresh) {
						const headers = policy.responseHeaders();
						const response = new Response(cacheEntry.statusCode, headers, cacheEntry.body, cacheEntry.url);
						response.cachePolicy = policy;
						response.fromCache = true;

						ee.emit('response', response);
						if (typeof cb === 'function') {
							cb(response);
						}
					} else {
						revalidate = cacheEntry;
						opts.headers = policy.revalidationHeaders(opts);
						makeRequest(opts);
					}
				};

				const errorHandler = error => ee.emit('error', new CacheableRequest.CacheError(error));
				this.cache.once('error', errorHandler);
				ee.on('response', () => this.cache.removeListener('error', errorHandler));

				try {
					await get(opts);
				} catch (error) {
					if (opts.automaticFailover && !madeRequest) {
						makeRequest(opts);
					}

					ee.emit('error', new CacheableRequest.CacheError(error));
				}
			})();

			return ee;
		};
	}
}

function urlObjectToRequestOptions(url) {
	const options = { ...url };
	options.path = `${url.pathname || '/'}${url.search || ''}`;
	delete options.pathname;
	delete options.search;
	return options;
}

function normalizeUrlObject(url) {
	// If url was parsed by url.parse or new URL:
	// - hostname will be set
	// - host will be hostname[:port]
	// - port will be set if it was explicit in the parsed string
	// Otherwise, url was from request options:
	// - hostname or host may be set
	// - host shall not have port encoded
	return {
		protocol: url.protocol,
		auth: url.auth,
		hostname: url.hostname || url.host || 'localhost',
		port: url.port,
		pathname: url.pathname,
		search: url.search
	};
}

CacheableRequest.RequestError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = 'RequestError';
		Object.assign(this, error);
	}
};

CacheableRequest.CacheError = class extends Error {
	constructor(error) {
		super(error.message);
		this.name = 'CacheError';
		Object.assign(this, error);
	}
};

module.exports = CacheableRequest;


/***/ }),

/***/ 392:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 402:
/***/ (function(module, __unusedexports, __webpack_require__) {

// Approach:
//
// 1. Get the minimatch set
// 2. For each pattern in the set, PROCESS(pattern, false)
// 3. Store matches per-set, then uniq them
//
// PROCESS(pattern, inGlobStar)
// Get the first [n] items from pattern that are all strings
// Join these together.  This is PREFIX.
//   If there is no more remaining, then stat(PREFIX) and
//   add to matches if it succeeds.  END.
//
// If inGlobStar and PREFIX is symlink and points to dir
//   set ENTRIES = []
// else readdir(PREFIX) as ENTRIES
//   If fail, END
//
// with ENTRIES
//   If pattern[n] is GLOBSTAR
//     // handle the case where the globstar match is empty
//     // by pruning it out, and testing the resulting pattern
//     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
//     // handle other cases.
//     for ENTRY in ENTRIES (not dotfiles)
//       // attach globstar + tail onto the entry
//       // Mark that this entry is a globstar match
//       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
//
//   else // not globstar
//     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
//       Test ENTRY against pattern[n]
//       If fails, continue
//       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
//
// Caveat:
//   Cache all stats and readdirs results to minimize syscall.  Since all
//   we ever care about is existence and directory-ness, we can just keep
//   `true` for files, and [children,...] for directories, or `false` for
//   things that don't exist.

module.exports = glob

var fs = __webpack_require__(747)
var rp = __webpack_require__(302)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var inherits = __webpack_require__(689)
var EE = __webpack_require__(614).EventEmitter
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(681)
var globSync = __webpack_require__(658)
var common = __webpack_require__(856)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var inflight = __webpack_require__(674)
var util = __webpack_require__(669)
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

var once = __webpack_require__(49)

function glob (pattern, options, cb) {
  if (typeof options === 'function') cb = options, options = {}
  if (!options) options = {}

  if (options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return globSync(pattern, options)
  }

  return new Glob(pattern, options, cb)
}

glob.sync = globSync
var GlobSync = glob.GlobSync = globSync.GlobSync

// old api surface
glob.glob = glob

function extend (origin, add) {
  if (add === null || typeof add !== 'object') {
    return origin
  }

  var keys = Object.keys(add)
  var i = keys.length
  while (i--) {
    origin[keys[i]] = add[keys[i]]
  }
  return origin
}

glob.hasMagic = function (pattern, options_) {
  var options = extend({}, options_)
  options.noprocess = true

  var g = new Glob(pattern, options)
  var set = g.minimatch.set

  if (!pattern)
    return false

  if (set.length > 1)
    return true

  for (var j = 0; j < set[0].length; j++) {
    if (typeof set[0][j] !== 'string')
      return true
  }

  return false
}

glob.Glob = Glob
inherits(Glob, EE)
function Glob (pattern, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = null
  }

  if (options && options.sync) {
    if (cb)
      throw new TypeError('callback provided to sync glob')
    return new GlobSync(pattern, options)
  }

  if (!(this instanceof Glob))
    return new Glob(pattern, options, cb)

  setopts(this, pattern, options)
  this._didRealPath = false

  // process each pattern in the minimatch set
  var n = this.minimatch.set.length

  // The matches are stored as {<filename>: true,...} so that
  // duplicates are automagically pruned.
  // Later, we do an Object.keys() on these.
  // Keep them as a list so we can fill in when nonull is set.
  this.matches = new Array(n)

  if (typeof cb === 'function') {
    cb = once(cb)
    this.on('error', cb)
    this.on('end', function (matches) {
      cb(null, matches)
    })
  }

  var self = this
  this._processing = 0

  this._emitQueue = []
  this._processQueue = []
  this.paused = false

  if (this.noprocess)
    return this

  if (n === 0)
    return done()

  var sync = true
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false, done)
  }
  sync = false

  function done () {
    --self._processing
    if (self._processing <= 0) {
      if (sync) {
        process.nextTick(function () {
          self._finish()
        })
      } else {
        self._finish()
      }
    }
  }
}

Glob.prototype._finish = function () {
  assert(this instanceof Glob)
  if (this.aborted)
    return

  if (this.realpath && !this._didRealpath)
    return this._realpath()

  common.finish(this)
  this.emit('end', this.found)
}

Glob.prototype._realpath = function () {
  if (this._didRealpath)
    return

  this._didRealpath = true

  var n = this.matches.length
  if (n === 0)
    return this._finish()

  var self = this
  for (var i = 0; i < this.matches.length; i++)
    this._realpathSet(i, next)

  function next () {
    if (--n === 0)
      self._finish()
  }
}

Glob.prototype._realpathSet = function (index, cb) {
  var matchset = this.matches[index]
  if (!matchset)
    return cb()

  var found = Object.keys(matchset)
  var self = this
  var n = found.length

  if (n === 0)
    return cb()

  var set = this.matches[index] = Object.create(null)
  found.forEach(function (p, i) {
    // If there's a problem with the stat, then it means that
    // one or more of the links in the realpath couldn't be
    // resolved.  just return the abs value in that case.
    p = self._makeAbs(p)
    rp.realpath(p, self.realpathCache, function (er, real) {
      if (!er)
        set[real] = true
      else if (er.syscall === 'stat')
        set[p] = true
      else
        self.emit('error', er) // srsly wtf right here

      if (--n === 0) {
        self.matches[index] = set
        cb()
      }
    })
  })
}

Glob.prototype._mark = function (p) {
  return common.mark(this, p)
}

Glob.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}

Glob.prototype.abort = function () {
  this.aborted = true
  this.emit('abort')
}

Glob.prototype.pause = function () {
  if (!this.paused) {
    this.paused = true
    this.emit('pause')
  }
}

Glob.prototype.resume = function () {
  if (this.paused) {
    this.emit('resume')
    this.paused = false
    if (this._emitQueue.length) {
      var eq = this._emitQueue.slice(0)
      this._emitQueue.length = 0
      for (var i = 0; i < eq.length; i ++) {
        var e = eq[i]
        this._emitMatch(e[0], e[1])
      }
    }
    if (this._processQueue.length) {
      var pq = this._processQueue.slice(0)
      this._processQueue.length = 0
      for (var i = 0; i < pq.length; i ++) {
        var p = pq[i]
        this._processing--
        this._process(p[0], p[1], p[2], p[3])
      }
    }
  }
}

Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
  assert(this instanceof Glob)
  assert(typeof cb === 'function')

  if (this.aborted)
    return

  this._processing++
  if (this.paused) {
    this._processQueue.push([pattern, index, inGlobStar, cb])
    return
  }

  //console.error('PROCESS %d', this._processing, pattern)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // see if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index, cb)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip _processing
  if (childrenIgnored(this, read))
    return cb()

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb)
}

Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}

Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return cb()

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return cb()

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return cb()
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix) {
      if (prefix !== '/')
        e = prefix + '/' + e
      else
        e = prefix + e
    }
    this._process([e].concat(remain), index, inGlobStar, cb)
  }
  cb()
}

Glob.prototype._emitMatch = function (index, e) {
  if (this.aborted)
    return

  if (isIgnored(this, e))
    return

  if (this.paused) {
    this._emitQueue.push([index, e])
    return
  }

  var abs = isAbsolute(e) ? e : this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute)
    e = abs

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  var st = this.statCache[abs]
  if (st)
    this.emit('stat', e, st)

  this.emit('match', e)
}

Glob.prototype._readdirInGlobStar = function (abs, cb) {
  if (this.aborted)
    return

  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false, cb)

  var lstatkey = 'lstat\0' + abs
  var self = this
  var lstatcb = inflight(lstatkey, lstatcb_)

  if (lstatcb)
    fs.lstat(abs, lstatcb)

  function lstatcb_ (er, lstat) {
    if (er && er.code === 'ENOENT')
      return cb()

    var isSym = lstat && lstat.isSymbolicLink()
    self.symlinks[abs] = isSym

    // If it's not a symlink or a dir, then it's definitely a regular file.
    // don't bother doing a readdir in that case.
    if (!isSym && lstat && !lstat.isDirectory()) {
      self.cache[abs] = 'FILE'
      cb()
    } else
      self._readdir(abs, false, cb)
  }
}

Glob.prototype._readdir = function (abs, inGlobStar, cb) {
  if (this.aborted)
    return

  cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb)
  if (!cb)
    return

  //console.error('RD %j %j', +inGlobStar, abs)
  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs, cb)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return cb()

    if (Array.isArray(c))
      return cb(null, c)
  }

  var self = this
  fs.readdir(abs, readdirCb(this, abs, cb))
}

function readdirCb (self, abs, cb) {
  return function (er, entries) {
    if (er)
      self._readdirError(abs, er, cb)
    else
      self._readdirEntries(abs, entries, cb)
  }
}

Glob.prototype._readdirEntries = function (abs, entries, cb) {
  if (this.aborted)
    return

  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries
  return cb(null, entries)
}

Glob.prototype._readdirError = function (f, er, cb) {
  if (this.aborted)
    return

  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        this.emit('error', error)
        this.abort()
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict) {
        this.emit('error', er)
        // If the error is handled, then we abort
        // if not, we threw out of here
        this.abort()
      }
      if (!this.silent)
        console.error('glob error', er)
      break
  }

  return cb()
}

Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
  var self = this
  this._readdir(abs, inGlobStar, function (er, entries) {
    self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
  })
}


Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
  //console.error('pgs2', prefix, remain[0], entries)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return cb()

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false, cb)

  var isSym = this.symlinks[abs]
  var len = entries.length

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return cb()

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true, cb)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true, cb)
  }

  cb()
}

Glob.prototype._processSimple = function (prefix, index, cb) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var self = this
  this._stat(prefix, function (er, exists) {
    self._processSimple2(prefix, index, er, exists, cb)
  })
}
Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

  //console.error('ps2', prefix, exists)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return cb()

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
  cb()
}

// Returns either 'DIR', 'FILE', or false
Glob.prototype._stat = function (f, cb) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return cb()

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return cb(null, c)

    if (needDir && c === 'FILE')
      return cb()

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (stat !== undefined) {
    if (stat === false)
      return cb(null, stat)
    else {
      var type = stat.isDirectory() ? 'DIR' : 'FILE'
      if (needDir && type === 'FILE')
        return cb()
      else
        return cb(null, type, stat)
    }
  }

  var self = this
  var statcb = inflight('stat\0' + abs, lstatcb_)
  if (statcb)
    fs.lstat(abs, statcb)

  function lstatcb_ (er, lstat) {
    if (lstat && lstat.isSymbolicLink()) {
      // If it's a symlink, then treat it as the target, unless
      // the target does not exist, then treat it as a file.
      return fs.stat(abs, function (er, stat) {
        if (er)
          self._stat2(f, abs, null, lstat, cb)
        else
          self._stat2(f, abs, er, stat, cb)
      })
    } else {
      self._stat2(f, abs, er, lstat, cb)
    }
  }
}

Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
  if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
    this.statCache[abs] = false
    return cb()
  }

  var needDir = f.slice(-1) === '/'
  this.statCache[abs] = stat

  if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
    return cb(null, false, stat)

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'
  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return cb()

  return cb(null, c, stat)
}


/***/ }),

/***/ 409:
/***/ (function() {

// see dirs.js


/***/ }),

/***/ 413:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = __webpack_require__(141);


/***/ }),

/***/ 422:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 429:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const core_1 = __webpack_require__(470);
const github_1 = __webpack_require__(469);
const fs_1 = __webpack_require__(747);
const humanize_duration_1 = __importDefault(__webpack_require__(245));
const locale_codes_1 = __webpack_require__(186);
const path_1 = __webpack_require__(622);
const shelljs_1 = __webpack_require__(739);
const github_2 = __webpack_require__(383);
const google_books_1 = __webpack_require__(349);
const token = core_1.getInput("token") || process.env.GH_PAT || process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || "").split("/");
const run = async () => {
    const COMMAND = core_1.getInput("command");
    core_1.debug(`Got command: ${COMMAND}`);
    if (!COMMAND)
        throw new Error("Command not found");
    if (!token)
        throw new Error("GitHub token not found");
    const octokit = github_1.getOctokit(token);
    if (COMMAND === "onNewIssue")
        return onNewIssue(octokit);
    if (COMMAND === "onCloseIssue")
        return onCloseIssue(octokit);
    throw new Error("Command not recognized");
};
exports.run = run;
const onCloseIssue = async (octokit) => {
    core_1.debug("Started onCloseIssue");
    const issue = await octokit.issues.get({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
    });
    core_1.debug(`Got issue #${issue.data.number}`);
    await octokit.issues.createComment({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
        body: `You completed this book in ${humanize_duration_1.default(new Date(issue.data.closed_at).getTime() - new Date(issue.data.created_at).getTime())}, great job!`,
    });
    core_1.debug(`Created comment in issue #${issue.data.number}`);
    await octokit.issues.addLabels({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
        labels: [
            `completed: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
            `completed: ${new Date().getUTCFullYear()}`,
        ],
    });
    core_1.debug(`Added "completed" labels to issue #${issue.data.number}`);
    updateSummary(octokit);
};
const onNewIssue = async (octokit) => {
    core_1.debug("Started onNewIssue");
    const issue = await octokit.issues.get({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
    });
    core_1.debug(`Got issue #${issue.data.number}`);
    let body = "<!-- This comment is autogenerated by book-tracker <https://github.com/AnandChowdhary/book-tracker> -->\n\n";
    const labels = [
        "kind: book",
        `started: ${new Date().toLocaleString("en", { month: "long" }).toLowerCase()}`,
        `started: ${new Date().getUTCFullYear()}`,
    ];
    try {
        core_1.debug(`Searching for "${issue.data.title}"`);
        const details = await google_books_1.search(issue.data.title);
        body += `Congrats on starting **${details.title}** by ${details.authors.join(", ")}, I hope you enjoy it! It has an average of ${details.averageRating}/5 stars and ${details.ratingsCount.toLocaleString()} ratings on [Google Books](${details.googleBooks.info}).\n\n<details>
 <summary>Book details (JSON)</summary>

\`\`\`json
${JSON.stringify(details, null, 2)}
\`\`\`

</details>`;
        details.authors.forEach((i) => labels.push(`author: ${i.toLowerCase()}`));
        details.categories.forEach((i) => labels.push(`category: ${i.toLowerCase()}`));
        if (details.publishedDate) {
            labels.push(`year: ${details.publishedDate}`);
            labels.push(`decade: ${Math.floor(Number(details.publishedDate) / 10) * 10}s`);
        }
        if (details.language)
            labels.push(`language: ${locale_codes_1.getByTag(details.language) || details.language}`);
        if (details.publisher)
            labels.push(`publisher: ${details.publisher}`);
        core_1.debug("Added labels from search results");
    }
    catch (error) {
        console.log(error);
        core_1.debug(`Got an error in search results: ${error.toString()}`);
        body +=
            "I couldn't find details about this book using the Google Books API. Don't worry, you can still track it.\n\n";
    }
    body += `When you're finished with reading this book, just close this issue and I'll mark it as completed. Best of luck! 👍`;
    await octokit.issues.createComment({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
        body,
    });
    core_1.debug("Added comment to issue");
    await octokit.issues.addLabels({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
        labels,
    });
    core_1.debug("Added all labels to issue");
    await octokit.issues.lock({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        issue_number: github_1.context.issue.number,
    });
    core_1.debug("Locked issue");
    updateSummary(octokit);
};
const updateSummary = async (octokit) => {
    core_1.debug("Starting updateSummary");
    const issues = await octokit.issues.listForRepo({
        owner: github_1.context.issue.owner,
        repo: github_1.context.issue.repo,
        labels: "book",
        state: "all",
    });
    core_1.debug(`Got ${issues.data.length} issues`);
    const api = [];
    for await (const issue of issues.data) {
        const comments = await octokit.issues.listComments({
            owner: github_1.context.issue.owner,
            repo: github_1.context.issue.repo,
            issue_number: issue.number,
        });
        core_1.debug(`Got ${comments.data.length} comments in issue ${issue.number}`);
        let json = undefined;
        try {
            comments.data.forEach((comment) => {
                if (comment.body.includes("Book details (JSON)"))
                    json = JSON.parse(comment.body.split("```json")[1].split("```")[0]);
            });
        }
        catch (error) {
            console.log("JSON parsing error", error);
        }
        if (json)
            api.push({
                ...json,
                state: issue.state === "open" ? "reading" : "completed",
                startedAt: new Date(issue.created_at).toISOString(),
                completedAt: issue.state === "closed" ? new Date(issue.closed_at).toISOString() : undefined,
                timeToComplete: issue.state === "closed"
                    ? new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime()
                    : undefined,
                timeToCompleteFormatted: issue.state === "closed"
                    ? humanize_duration_1.default(new Date(issue.closed_at).getTime() - new Date(issue.created_at).getTime())
                    : undefined,
            });
    }
    await fs_1.promises.writeFile(path_1.join(".", "api.json"), JSON.stringify(api, null, 2) + "\n");
    core_1.debug("Written api.json file");
    const apiLeft = api.filter((_, i) => i % 2 !== 0);
    const apiRight = api.filter((_, i) => i % 2 === 0);
    let mdContent = "<table>";
    [apiLeft, apiRight].forEach((apiItem) => {
        apiLeft.forEach((_, i) => {
            mdContent += "<tr>";
            if (apiItem[i])
                mdContent += `<td>
    <table>
      <tr>
        <td>
          <img alt="" src="${apiItem[i].image}" height="128">
        </td>   
        <td>
          <strong>${apiItem[i].title}</strong><br>
          ${apiItem[i].authors.join(", ")}<br><br>
          ${apiItem[i].state === "completed" ? "✔️ Completed" : "⌛ Reading"}<br>
          ${apiItem[i].timeToComplete
                    ? `⌛ ${humanize_duration_1.default((apiItem[i].timeToComplete || 0) * 60000)}`
                    : ""}
          ${apiItem[i].completedAt
                    ? `📅 ${new Date(apiItem[i].completedAt || 0).toLocaleDateString("en", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}`
                    : ""}
        </td>
      </tr>
    </table>
  </td>
  `;
            mdContent += "</tr>";
        });
    });
    mdContent += "</table>";
    const content = await fs_1.promises.readFile(path_1.join(".", "README.md"), "utf8");
    core_1.debug(`Read README.md file of length ${content.length}`);
    await fs_1.promises.writeFile(path_1.join(".", "README.md"), content.split("<!--start:book-tracker-->")[0] +
        `<!--start:book-tracker-->\n${mdContent}\n<!--end:book-tracker-->` +
        content.split("<!--end:book-tracker-->")[1]);
    core_1.debug("Written README.md file");
    shelljs_1.exec(`git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"`);
    shelljs_1.exec(`git config --global user.name "github-actions[bot]"`);
    core_1.debug("Added git config user details");
    shelljs_1.exec("git add .");
    shelljs_1.exec('git commit -m ":bento: Update API and README summary [skip ci]"');
    core_1.debug("Committed to git history");
    shelljs_1.exec("git push");
    core_1.debug("Pushed to repository");
    await github_2.addDetailsToLabels(owner, repo, octokit);
    core_1.debug("Updated label details");
};
exports.run()
    .then(() => { })
    .catch((error) => {
    console.error("ERROR", error);
    core_1.setFailed(error.message);
});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 431:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const os = __importStar(__webpack_require__(87));
const utils_1 = __webpack_require__(82);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 452:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Update https://github.com/sindresorhus/get-stream
const getBuffer = async (stream) => {
    const chunks = [];
    let length = 0;
    for await (const chunk of stream) {
        chunks.push(chunk);
        length += Buffer.byteLength(chunk);
    }
    if (Buffer.isBuffer(chunks[0])) {
        return Buffer.concat(chunks, length);
    }
    return Buffer.from(chunks.join(''));
};
exports.default = getBuffer;


/***/ }),

/***/ 453:
/***/ (function(module, __unusedexports, __webpack_require__) {

var once = __webpack_require__(49)
var eos = __webpack_require__(9)
var fs = __webpack_require__(747) // we only need fs to get the ReadStream and WriteStream prototypes

var noop = function () {}
var ancient = /^v?\.0/.test(process.version)

var isFn = function (fn) {
  return typeof fn === 'function'
}

var isFS = function (stream) {
  if (!ancient) return false // newer node version do not need to care about fs is a special way
  if (!fs) return false // browser
  return (stream instanceof (fs.ReadStream || noop) || stream instanceof (fs.WriteStream || noop)) && isFn(stream.close)
}

var isRequest = function (stream) {
  return stream.setHeader && isFn(stream.abort)
}

var destroyer = function (stream, reading, writing, callback) {
  callback = once(callback)

  var closed = false
  stream.on('close', function () {
    closed = true
  })

  eos(stream, {readable: reading, writable: writing}, function (err) {
    if (err) return callback(err)
    closed = true
    callback()
  })

  var destroyed = false
  return function (err) {
    if (closed) return
    if (destroyed) return
    destroyed = true

    if (isFS(stream)) return stream.close(noop) // use close for fs streams to avoid fd leaks
    if (isRequest(stream)) return stream.abort() // request.destroy just do .end - .abort is what we want

    if (isFn(stream.destroy)) return stream.destroy()

    callback(err || new Error('stream was destroyed'))
  }
}

var call = function (fn) {
  fn()
}

var pipe = function (from, to) {
  return from.pipe(to)
}

var pump = function () {
  var streams = Array.prototype.slice.call(arguments)
  var callback = isFn(streams[streams.length - 1] || noop) && streams.pop() || noop

  if (Array.isArray(streams[0])) streams = streams[0]
  if (streams.length < 2) throw new Error('pump requires two streams per minimum')

  var error
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1
    var writing = i > 0
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err
      if (err) destroys.forEach(call)
      if (reading) return
      destroys.forEach(call)
      callback(error)
    })
  })

  return streams.reduce(pipe)
}

module.exports = pump


/***/ }),

/***/ 454:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__webpack_require__(794));
var http = _interopDefault(__webpack_require__(605));
var Url = _interopDefault(__webpack_require__(835));
var https = _interopDefault(__webpack_require__(211));
var zlib = _interopDefault(__webpack_require__(761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __webpack_require__(18).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 460:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
exports.default = (body) => is_1.default.nodeStream(body) && is_1.default.function_(body.getBoundary);


/***/ }),

/***/ 463:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __webpack_require__(692);
var once = _interopDefault(__webpack_require__(49));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 469:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__webpack_require__(262));
const utils_1 = __webpack_require__(521);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 470:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __webpack_require__(431);
const file_command_1 = __webpack_require__(102);
const utils_1 = __webpack_require__(82);
const os = __importStar(__webpack_require__(87));
const path = __importStar(__webpack_require__(622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 474:
/***/ (function(module) {

"use strict";

module.exports = object => {
	const result = {};

	for (const [key, value] of Object.entries(object)) {
		result[key.toLowerCase()] = value;
	}

	return result;
};


/***/ }),

/***/ 477:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

var PERMS = (function (base) {
  return {
    OTHER_EXEC: base.EXEC,
    OTHER_WRITE: base.WRITE,
    OTHER_READ: base.READ,

    GROUP_EXEC: base.EXEC << 3,
    GROUP_WRITE: base.WRITE << 3,
    GROUP_READ: base.READ << 3,

    OWNER_EXEC: base.EXEC << 6,
    OWNER_WRITE: base.WRITE << 6,
    OWNER_READ: base.READ << 6,

    // Literal octal numbers are apparently not allowed in "strict" javascript.
    STICKY: parseInt('01000', 8),
    SETGID: parseInt('02000', 8),
    SETUID: parseInt('04000', 8),

    TYPE_MASK: parseInt('0770000', 8),
  };
}({
  EXEC: 1,
  WRITE: 2,
  READ: 4,
}));

common.register('chmod', _chmod, {
});

//@
//@ ### chmod([options,] octal_mode || octal_string, file)
//@ ### chmod([options,] symbolic_mode, file)
//@
//@ Available options:
//@
//@ + `-v`: output a diagnostic for every file processed//@
//@ + `-c`: like verbose, but report only when a change is made//@
//@ + `-R`: change files and directories recursively//@
//@
//@ Examples:
//@
//@ ```javascript
//@ chmod(755, '/Users/brandon');
//@ chmod('755', '/Users/brandon'); // same as above
//@ chmod('u+x', '/Users/brandon');
//@ chmod('-R', 'a-w', '/Users/brandon');
//@ ```
//@
//@ Alters the permissions of a file or directory by either specifying the
//@ absolute permissions in octal form or expressing the changes in symbols.
//@ This command tries to mimic the POSIX behavior as much as possible.
//@ Notable exceptions:
//@
//@ + In symbolic modes, `a-r` and `-r` are identical.  No consideration is
//@   given to the `umask`.
//@ + There is no "quiet" option, since default behavior is to run silent.
function _chmod(options, mode, filePattern) {
  if (!filePattern) {
    if (options.length > 0 && options.charAt(0) === '-') {
      // Special case where the specified file permissions started with - to subtract perms, which
      // get picked up by the option parser as command flags.
      // If we are down by one argument and options starts with -, shift everything over.
      [].unshift.call(arguments, '');
    } else {
      common.error('You must specify a file.');
    }
  }

  options = common.parseOptions(options, {
    'R': 'recursive',
    'c': 'changes',
    'v': 'verbose',
  });

  filePattern = [].slice.call(arguments, 2);

  var files;

  // TODO: replace this with a call to common.expand()
  if (options.recursive) {
    files = [];
    filePattern.forEach(function addFile(expandedFile) {
      var stat = common.statNoFollowLinks(expandedFile);

      if (!stat.isSymbolicLink()) {
        files.push(expandedFile);

        if (stat.isDirectory()) {  // intentionally does not follow symlinks.
          fs.readdirSync(expandedFile).forEach(function (child) {
            addFile(expandedFile + '/' + child);
          });
        }
      }
    });
  } else {
    files = filePattern;
  }

  files.forEach(function innerChmod(file) {
    file = path.resolve(file);
    if (!fs.existsSync(file)) {
      common.error('File not found: ' + file);
    }

    // When recursing, don't follow symlinks.
    if (options.recursive && common.statNoFollowLinks(file).isSymbolicLink()) {
      return;
    }

    var stat = common.statFollowLinks(file);
    var isDir = stat.isDirectory();
    var perms = stat.mode;
    var type = perms & PERMS.TYPE_MASK;

    var newPerms = perms;

    if (isNaN(parseInt(mode, 8))) {
      // parse options
      mode.split(',').forEach(function (symbolicMode) {
        var pattern = /([ugoa]*)([=\+-])([rwxXst]*)/i;
        var matches = pattern.exec(symbolicMode);

        if (matches) {
          var applyTo = matches[1];
          var operator = matches[2];
          var change = matches[3];

          var changeOwner = applyTo.indexOf('u') !== -1 || applyTo === 'a' || applyTo === '';
          var changeGroup = applyTo.indexOf('g') !== -1 || applyTo === 'a' || applyTo === '';
          var changeOther = applyTo.indexOf('o') !== -1 || applyTo === 'a' || applyTo === '';

          var changeRead = change.indexOf('r') !== -1;
          var changeWrite = change.indexOf('w') !== -1;
          var changeExec = change.indexOf('x') !== -1;
          var changeExecDir = change.indexOf('X') !== -1;
          var changeSticky = change.indexOf('t') !== -1;
          var changeSetuid = change.indexOf('s') !== -1;

          if (changeExecDir && isDir) {
            changeExec = true;
          }

          var mask = 0;
          if (changeOwner) {
            mask |= (changeRead ? PERMS.OWNER_READ : 0) + (changeWrite ? PERMS.OWNER_WRITE : 0) + (changeExec ? PERMS.OWNER_EXEC : 0) + (changeSetuid ? PERMS.SETUID : 0);
          }
          if (changeGroup) {
            mask |= (changeRead ? PERMS.GROUP_READ : 0) + (changeWrite ? PERMS.GROUP_WRITE : 0) + (changeExec ? PERMS.GROUP_EXEC : 0) + (changeSetuid ? PERMS.SETGID : 0);
          }
          if (changeOther) {
            mask |= (changeRead ? PERMS.OTHER_READ : 0) + (changeWrite ? PERMS.OTHER_WRITE : 0) + (changeExec ? PERMS.OTHER_EXEC : 0);
          }

          // Sticky bit is special - it's not tied to user, group or other.
          if (changeSticky) {
            mask |= PERMS.STICKY;
          }

          switch (operator) {
            case '+':
              newPerms |= mask;
              break;

            case '-':
              newPerms &= ~mask;
              break;

            case '=':
              newPerms = type + mask;

              // According to POSIX, when using = to explicitly set the
              // permissions, setuid and setgid can never be cleared.
              if (common.statFollowLinks(file).isDirectory()) {
                newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
              }
              break;
            default:
              common.error('Could not recognize operator: `' + operator + '`');
          }

          if (options.verbose) {
            console.log(file + ' -> ' + newPerms.toString(8));
          }

          if (perms !== newPerms) {
            if (!options.verbose && options.changes) {
              console.log(file + ' -> ' + newPerms.toString(8));
            }
            fs.chmodSync(file, newPerms);
            perms = newPerms; // for the next round of changes!
          }
        } else {
          common.error('Invalid symbolic mode change: ' + symbolicMode);
        }
      });
    } else {
      // they gave us a full number
      newPerms = type + parseInt(mode, 8);

      // POSIX rules are that setuid and setgid can only be added using numeric
      // form, but not cleared.
      if (common.statFollowLinks(file).isDirectory()) {
        newPerms |= (PERMS.SETUID + PERMS.SETGID) & perms;
      }

      fs.chmodSync(file, newPerms);
    }
  });
  return '';
}
module.exports = _chmod;


/***/ }),

/***/ 485:
/***/ (function(module) {

module.exports = [
    {"name":"Abkhaz", "local":"Аҧсуа", "1":"ab", "2":"abk", "2T":"abk", "2B":"abk", "3":"abk"},
    {"name":"Afar", "local":"Afaraf", "1":"aa", "2":"aar", "2T":"aar", "2B":"aar", "3":"aar"},
    {"name":"Afrikaans", "local":"Afrikaans", "1":"af", "2":"afr", "2T":"afr", "2B":"afr", "3":"afr"},
    {"name":"Akan", "local":"Akan", "1":"ak", "2":"aka", "2T":"aka", "2B":"aka", "3":"aka"},
    {"name":"Albanian", "local":"Shqip", "1":"sq", "2":"sqi", "2T":"sqi", "2B":"alb", "3":"sqi"},
    {"name":"Amharic", "local":"አማርኛ", "1":"am", "2":"amh", "2T":"amh", "2B":"amh", "3":"amh"},
    {"name":"Arabic", "local":"العربية", "1":"ar", "2":"ara", "2T":"ara", "2B":"ara", "3":"ara"},
    {"name":"Aragonese", "local":"Aragonés", "1":"an", "2":"arg", "2T":"arg", "2B":"arg", "3":"arg"},
    {"name":"Armenian", "local":"Հայերեն", "1":"hy", "2":"hye", "2T":"hye", "2B":"arm", "3":"hye"},
    {"name":"Assamese", "local":"অসমীয়া", "1":"as", "2":"asm", "2T":"asm", "2B":"asm", "3":"asm"},
    {"name":"Avaric", "local":"Авар", "1":"av", "2":"ava", "2T":"ava", "2B":"ava", "3":"ava"},
    {"name":"Avestan", "local":"avesta", "1":"ae", "2":"ave", "2T":"ave", "2B":"ave", "3":"ave"},
    {"name":"Aymara", "local":"Aymar", "1":"ay", "2":"aym", "2T":"aym", "2B":"aym", "3":"aym"},
    {"name":"Azerbaijani", "local":"Azərbaycanca", "1":"az", "2":"aze", "2T":"aze", "2B":"aze", "3":"aze"},
    {"name":"Bambara", "local":"Bamanankan", "1":"bm", "2":"bam", "2T":"bam", "2B":"bam", "3":"bam"},
    {"name":"Bashkir", "local":"Башҡортса", "1":"ba", "2":"bak", "2T":"bak", "2B":"bak", "3":"bak"},
    {"name":"Basque", "local":"Euskara", "1":"eu", "2":"eus", "2T":"eus", "2B":"baq", "3":"eus"},
    {"name":"Belarusian", "local":"Беларуская", "1":"be", "2":"bel", "2T":"bel", "2B":"bel", "3":"bel"},
    {"name":"Bengali", "local":"বাংলা", "1":"bn", "2":"ben", "2T":"ben", "2B":"ben", "3":"ben"},
    {"name":"Bihari", "local":"भोजपुरी", "1":"bh", "2":"bih", "2T":"bih", "2B":"bih", "3":"bih"},
    {"name":"Bislama", "local":"Bislama", "1":"bi", "2":"bis", "2T":"bis", "2B":"bis", "3":"bis"},
    {"name":"Bosnian", "local":"Bosanski", "1":"bs", "2":"bos", "2T":"bos", "2B":"bos", "3":"bos"},
    {"name":"Breton", "local":"Brezhoneg", "1":"br", "2":"bre", "2T":"bre", "2B":"bre", "3":"bre"},
    {"name":"Bulgarian", "local":"Български", "1":"bg", "2":"bul", "2T":"bul", "2B":"bul", "3":"bul"},
    {"name":"Burmese", "local":"မြန်မာဘာသာ", "1":"my", "2":"mya", "2T":"mya", "2B":"bur", "3":"mya"},
    {"name":"Catalan", "local":"Català", "1":"ca", "2":"cat", "2T":"cat", "2B":"cat", "3":"cat"},
    {"name":"Chamorro", "local":"Chamoru", "1":"ch", "2":"cha", "2T":"cha", "2B":"cha", "3":"cha"},
    {"name":"Chechen", "local":"Нохчийн", "1":"ce", "2":"che", "2T":"che", "2B":"che", "3":"che"},
    {"name":"Chichewa", "local":"Chichewa", "1":"ny", "2":"nya", "2T":"nya", "2B":"nya", "3":"nya"},
    {"name":"Chinese", "local":"中文", "1":"zh", "2":"zho", "2T":"zho", "2B":"chi", "3":"zho"},
    {"name":"Chuvash", "local":"Чӑвашла", "1":"cv", "2":"chv", "2T":"chv", "2B":"chv", "3":"chv"},
    {"name":"Cornish", "local":"Kernewek", "1":"kw", "2":"cor", "2T":"cor", "2B":"cor", "3":"cor"},
    {"name":"Corsican", "local":"Corsu", "1":"co", "2":"cos", "2T":"cos", "2B":"cos", "3":"cos"},
    {"name":"Cree", "local":"ᓀᐦᐃᔭᐍᐏᐣ", "1":"cr", "2":"cre", "2T":"cre", "2B":"cre", "3":"cre"},
    {"name":"Croatian", "local":"Hrvatski", "1":"hr", "2":"hrv", "2T":"hrv", "2B":"hrv", "3":"hrv"},
    {"name":"Czech", "local":"Čeština", "1":"cs", "2":"ces", "2T":"ces", "2B":"cze", "3":"ces"},
    {"name":"Danish", "local":"Dansk", "1":"da", "2":"dan", "2T":"dan", "2B":"dan", "3":"dan"},
    {"name":"Divehi", "local":"Divehi", "1":"dv", "2":"div", "2T":"div", "2B":"div", "3":"div"},
    {"name":"Dutch", "local":"Nederlands", "1":"nl", "2":"nld", "2T":"nld", "2B":"dut", "3":"nld"},
    {"name":"Dzongkha", "local":"རྫོང་ཁ", "1":"dz", "2":"dzo", "2T":"dzo", "2B":"dzo", "3":"dzo"},
    {"name":"English", "local":"English", "1":"en", "2":"eng", "2T":"eng", "2B":"eng", "3":"eng"},
    {"name":"Esperanto", "local":"Esperanto", "1":"eo", "2":"epo", "2T":"epo", "2B":"epo", "3":"epo"},
    {"name":"Estonian", "local":"Eesti", "1":"et", "2":"est", "2T":"est", "2B":"est", "3":"est"},
    {"name":"Ewe", "local":"Eʋegbe", "1":"ee", "2":"ewe", "2T":"ewe", "2B":"ewe", "3":"ewe"},
    {"name":"Faroese", "local":"Føroyskt", "1":"fo", "2":"fao", "2T":"fao", "2B":"fao", "3":"fao"},
    {"name":"Fijian", "local":"Na Vosa Vaka-Viti", "1":"fj", "2":"fij", "2T":"fij", "2B":"fij", "3":"fij"},
    {"name":"Finnish", "local":"Suomi", "1":"fi", "2":"fin", "2T":"fin", "2B":"fin", "3":"fin"},
    {"name":"French", "local":"Français", "1":"fr", "2":"fra", "2T":"fra", "2B":"fre", "3":"fra"},
    {"name":"Fula", "local":"Fulfulde", "1":"ff", "2":"ful", "2T":"ful", "2B":"ful", "3":"ful"},
    {"name":"Galician", "local":"Galego", "1":"gl", "2":"glg", "2T":"glg", "2B":"glg", "3":"glg"},
    {"name":"Georgian", "local":"ქართული", "1":"ka", "2":"kat", "2T":"kat", "2B":"geo", "3":"kat"},
    {"name":"German", "local":"Deutsch", "1":"de", "2":"deu", "2T":"deu", "2B":"ger", "3":"deu"},
    {"name":"Greek", "local":"Ελληνικά", "1":"el", "2":"ell", "2T":"ell", "2B":"gre", "3":"ell"},
    {"name":"Guaraní", "local":"Avañe'ẽ", "1":"gn", "2":"grn", "2T":"grn", "2B":"grn", "3":"grn"},
    {"name":"Gujarati", "local":"ગુજરાતી", "1":"gu", "2":"guj", "2T":"guj", "2B":"guj", "3":"guj"},
    {"name":"Haitian", "local":"Kreyòl Ayisyen", "1":"ht", "2":"hat", "2T":"hat", "2B":"hat", "3":"hat"},
    {"name":"Hausa", "local":"هَوُسَ", "1":"ha", "2":"hau", "2T":"hau", "2B":"hau", "3":"hau"},
    {"name":"Hebrew", "local":"עברית", "1":"he", "2":"heb", "2T":"heb", "2B":"heb", "3":"heb"},
    {"name":"Herero", "local":"Otjiherero", "1":"hz", "2":"her", "2T":"her", "2B":"her", "3":"her"},
    {"name":"Hindi", "local":"हिन्दी", "1":"hi", "2":"hin", "2T":"hin", "2B":"hin", "3":"hin"},
    {"name":"Hiri Motu", "local":"Hiri Motu", "1":"ho", "2":"hmo", "2T":"hmo", "2B":"hmo", "3":"hmo"},
    {"name":"Hungarian", "local":"Magyar", "1":"hu", "2":"hun", "2T":"hun", "2B":"hun", "3":"hun"},
    {"name":"Interlingua", "local":"Interlingua", "1":"ia", "2":"ina", "2T":"ina", "2B":"ina", "3":"ina"},
    {"name":"Indonesian", "local":"Bahasa Indonesia", "1":"id", "2":"ind", "2T":"ind", "2B":"ind", "3":"ind"},
    {"name":"Interlingue", "local":"Interlingue", "1":"ie", "2":"ile", "2T":"ile", "2B":"ile", "3":"ile"},
    {"name":"Irish", "local":"Gaeilge", "1":"ga", "2":"gle", "2T":"gle", "2B":"gle", "3":"gle"},
    {"name":"Igbo", "local":"Igbo", "1":"ig", "2":"ibo", "2T":"ibo", "2B":"ibo", "3":"ibo"},
    {"name":"Inupiaq", "local":"Iñupiak", "1":"ik", "2":"ipk", "2T":"ipk", "2B":"ipk", "3":"ipk"},
    {"name":"Ido", "local":"Ido", "1":"io", "2":"ido", "2T":"ido", "2B":"ido", "3":"ido"},
    {"name":"Icelandic", "local":"Íslenska", "1":"is", "2":"isl", "2T":"isl", "2B":"ice", "3":"isl"},
    {"name":"Italian", "local":"Italiano", "1":"it", "2":"ita", "2T":"ita", "2B":"ita", "3":"ita"},
    {"name":"Inuktitut", "local":"ᐃᓄᒃᑎᑐᑦ", "1":"iu", "2":"iku", "2T":"iku", "2B":"iku", "3":"iku"},
    {"name":"Japanese", "local":"日本語", "1":"ja", "2":"jpn", "2T":"jpn", "2B":"jpn", "3":"jpn"},
    {"name":"Javanese", "local":"Basa Jawa", "1":"jv", "2":"jav", "2T":"jav", "2B":"jav", "3":"jav"},
    {"name":"Kalaallisut", "local":"Kalaallisut", "1":"kl", "2":"kal", "2T":"kal", "2B":"kal", "3":"kal"},
    {"name":"Kannada", "local":"ಕನ್ನಡ", "1":"kn", "2":"kan", "2T":"kan", "2B":"kan", "3":"kan"},
    {"name":"Kanuri", "local":"Kanuri", "1":"kr", "2":"kau", "2T":"kau", "2B":"kau", "3":"kau"},
    {"name":"Kashmiri", "local":"كشميري", "1":"ks", "2":"kas", "2T":"kas", "2B":"kas", "3":"kas"},
    {"name":"Kazakh", "local":"Қазақша", "1":"kk", "2":"kaz", "2T":"kaz", "2B":"kaz", "3":"kaz"},
    {"name":"Khmer", "local":"ភាសាខ្មែរ", "1":"km", "2":"khm", "2T":"khm", "2B":"khm", "3":"khm"},
    {"name":"Kikuyu", "local":"Gĩkũyũ", "1":"ki", "2":"kik", "2T":"kik", "2B":"kik", "3":"kik"},
    {"name":"Kinyarwanda", "local":"Kinyarwanda", "1":"rw", "2":"kin", "2T":"kin", "2B":"kin", "3":"kin"},
    {"name":"Kyrgyz", "local":"Кыргызча", "1":"ky", "2":"kir", "2T":"kir", "2B":"kir", "3":"kir"},
    {"name":"Komi", "local":"Коми", "1":"kv", "2":"kom", "2T":"kom", "2B":"kom", "3":"kom"},
    {"name":"Kongo", "local":"Kongo", "1":"kg", "2":"kon", "2T":"kon", "2B":"kon", "3":"kon"},
    {"name":"Korean", "local":"한국어", "1":"ko", "2":"kor", "2T":"kor", "2B":"kor", "3":"kor"},
    {"name":"Kurdish", "local":"Kurdî", "1":"ku", "2":"kur", "2T":"kur", "2B":"kur", "3":"kur"},
    {"name":"Kwanyama", "local":"Kuanyama", "1":"kj", "2":"kua", "2T":"kua", "2B":"kua", "3":"kua"},
    {"name":"Latin", "local":"Latina", "1":"la", "2":"lat", "2T":"lat", "2B":"lat", "3":"lat"},
    {"name":"Luxembourgish", "local":"Lëtzebuergesch", "1":"lb", "2":"ltz", "2T":"ltz", "2B":"ltz", "3":"ltz"},
    {"name":"Ganda", "local":"Luganda", "1":"lg", "2":"lug", "2T":"lug", "2B":"lug", "3":"lug"},
    {"name":"Limburgish", "local":"Limburgs", "1":"li", "2":"lim", "2T":"lim", "2B":"lim", "3":"lim"},
    {"name":"Lingala", "local":"Lingála", "1":"ln", "2":"lin", "2T":"lin", "2B":"lin", "3":"lin"},
    {"name":"Lao", "local":"ພາສາລາວ", "1":"lo", "2":"lao", "2T":"lao", "2B":"lao", "3":"lao"},
    {"name":"Lithuanian", "local":"Lietuvių", "1":"lt", "2":"lit", "2T":"lit", "2B":"lit", "3":"lit"},
    {"name":"Luba-Katanga", "local":"Tshiluba", "1":"lu", "2":"lub", "2T":"lub", "2B":"lub", "3":"lub"},
    {"name":"Latvian", "local":"Latviešu", "1":"lv", "2":"lav", "2T":"lav", "2B":"lav", "3":"lav"},
    {"name":"Manx", "local":"Gaelg", "1":"gv", "2":"glv", "2T":"glv", "2B":"glv", "3":"glv"},
    {"name":"Macedonian", "local":"Македонски", "1":"mk", "2":"mkd", "2T":"mkd", "2B":"mac", "3":"mkd"},
    {"name":"Malagasy", "local":"Malagasy", "1":"mg", "2":"mlg", "2T":"mlg", "2B":"mlg", "3":"mlg"},
    {"name":"Malay", "local":"Bahasa Melayu", "1":"ms", "2":"msa", "2T":"msa", "2B":"may", "3":"msa"},
    {"name":"Malayalam", "local":"മലയാളം", "1":"ml", "2":"mal", "2T":"mal", "2B":"mal", "3":"mal"},
    {"name":"Maltese", "local":"Malti", "1":"mt", "2":"mlt", "2T":"mlt", "2B":"mlt", "3":"mlt"},
    {"name":"Māori", "local":"Māori", "1":"mi", "2":"mri", "2T":"mri", "2B":"mao", "3":"mri"},
    {"name":"Marathi", "local":"मराठी", "1":"mr", "2":"mar", "2T":"mar", "2B":"mar", "3":"mar"},
    {"name":"Marshallese", "local":"Kajin M̧ajeļ", "1":"mh", "2":"mah", "2T":"mah", "2B":"mah", "3":"mah"},
    {"name":"Mongolian", "local":"Монгол", "1":"mn", "2":"mon", "2T":"mon", "2B":"mon", "3":"mon"},
    {"name":"Nauru", "local":"Dorerin Naoero", "1":"na", "2":"nau", "2T":"nau", "2B":"nau", "3":"nau"},
    {"name":"Navajo", "local":"Diné Bizaad", "1":"nv", "2":"nav", "2T":"nav", "2B":"nav", "3":"nav"},
    {"name":"Northern Ndebele", "local":"isiNdebele", "1":"nd", "2":"nde", "2T":"nde", "2B":"nde", "3":"nde"},
    {"name":"Nepali", "local":"नेपाली", "1":"ne", "2":"nep", "2T":"nep", "2B":"nep", "3":"nep"},
    {"name":"Ndonga", "local":"Owambo", "1":"ng", "2":"ndo", "2T":"ndo", "2B":"ndo", "3":"ndo"},
    {"name":"Norwegian Bokmål", "local":"Norsk (Bokmål)", "1":"nb", "2":"nob", "2T":"nob", "2B":"nob", "3":"nob"},
    {"name":"Norwegian Nynorsk", "local":"Norsk (Nynorsk)", "1":"nn", "2":"nno", "2T":"nno", "2B":"nno", "3":"nno"},
    {"name":"Norwegian", "local":"Norsk", "1":"no", "2":"nor", "2T":"nor", "2B":"nor", "3":"nor"},
    {"name":"Nuosu", "local":"ꆈꌠ꒿ Nuosuhxop", "1":"ii", "2":"iii", "2T":"iii", "2B":"iii", "3":"iii"},
    {"name":"Southern Ndebele", "local":"isiNdebele", "1":"nr", "2":"nbl", "2T":"nbl", "2B":"nbl", "3":"nbl"},
    {"name":"Occitan", "local":"Occitan", "1":"oc", "2":"oci", "2T":"oci", "2B":"oci", "3":"oci"},
    {"name":"Ojibwe", "local":"ᐊᓂᔑᓈᐯᒧᐎᓐ", "1":"oj", "2":"oji", "2T":"oji", "2B":"oji", "3":"oji"},
    {"name":"Old Church Slavonic", "local":"Словѣ́ньскъ", "1":"cu", "2":"chu", "2T":"chu", "2B":"chu", "3":"chu"},
    {"name":"Oromo", "local":"Afaan Oromoo", "1":"om", "2":"orm", "2T":"orm", "2B":"orm", "3":"orm"},
    {"name":"Oriya", "local":"ଓଡି଼ଆ", "1":"or", "2":"ori", "2T":"ori", "2B":"ori", "3":"ori"},
    {"name":"Ossetian", "local":"Ирон æвзаг", "1":"os", "2":"oss", "2T":"oss", "2B":"oss", "3":"oss"},
    {"name":"Panjabi", "local":"ਪੰਜਾਬੀ", "1":"pa", "2":"pan", "2T":"pan", "2B":"pan", "3":"pan"},
    {"name":"Pāli", "local":"पाऴि", "1":"pi", "2":"pli", "2T":"pli", "2B":"pli", "3":"pli"},
    {"name":"Persian", "local":"فارسی", "1":"fa", "2":"fas", "2T":"fas", "2B":"per", "3":"fas"},
    {"name":"Polish", "local":"Polski", "1":"pl", "2":"pol", "2T":"pol", "2B":"pol", "3":"pol"},
    {"name":"Pashto", "local":"پښتو", "1":"ps", "2":"pus", "2T":"pus", "2B":"pus", "3":"pus"},
    {"name":"Portuguese", "local":"Português", "1":"pt", "2":"por", "2T":"por", "2B":"por", "3":"por"},
    {"name":"Quechua", "local":"Runa Simi", "1":"qu", "2":"que", "2T":"que", "2B":"que", "3":"que"},
    {"name":"Romansh", "local":"Rumantsch", "1":"rm", "2":"roh", "2T":"roh", "2B":"roh", "3":"roh"},
    {"name":"Kirundi", "local":"Kirundi", "1":"rn", "2":"run", "2T":"run", "2B":"run", "3":"run"},
    {"name":"Romanian", "local":"Română", "1":"ro", "2":"ron", "2T":"ron", "2B":"rum", "3":"ron"},
    {"name":"Russian", "local":"Русский", "1":"ru", "2":"rus", "2T":"rus", "2B":"rus", "3":"rus"},
    {"name":"Sanskrit", "local":"संस्कृतम्", "1":"sa", "2":"san", "2T":"san", "2B":"san", "3":"san"},
    {"name":"Sardinian", "local":"Sardu", "1":"sc", "2":"srd", "2T":"srd", "2B":"srd", "3":"srd"},
    {"name":"Sindhi", "local":"سنڌي‎", "1":"sd", "2":"snd", "2T":"snd", "2B":"snd", "3":"snd"},
    {"name":"Northern Sami", "local":"Sámegiella", "1":"se", "2":"sme", "2T":"sme", "2B":"sme", "3":"sme"},
    {"name":"Samoan", "local":"Gagana Sāmoa", "1":"sm", "2":"smo", "2T":"smo", "2B":"smo", "3":"smo"},
    {"name":"Sango", "local":"Sängö", "1":"sg", "2":"sag", "2T":"sag", "2B":"sag", "3":"sag"},
    {"name":"Serbian", "local":"Српски", "1":"sr", "2":"srp", "2T":"srp", "2B":"srp", "3":"srp"},
    {"name":"Gaelic", "local":"Gàidhlig", "1":"gd", "2":"gla", "2T":"gla", "2B":"gla", "3":"gla"},
    {"name":"Shona", "local":"ChiShona", "1":"sn", "2":"sna", "2T":"sna", "2B":"sna", "3":"sna"},
    {"name":"Sinhala", "local":"සිංහල", "1":"si", "2":"sin", "2T":"sin", "2B":"sin", "3":"sin"},
    {"name":"Slovak", "local":"Slovenčina", "1":"sk", "2":"slk", "2T":"slk", "2B":"slo", "3":"slk"},
    {"name":"Slovene", "local":"Slovenščina", "1":"sl", "2":"slv", "2T":"slv", "2B":"slv", "3":"slv"},
    {"name":"Somali", "local":"Soomaaliga", "1":"so", "2":"som", "2T":"som", "2B":"som", "3":"som"},
    {"name":"Southern Sotho", "local":"Sesotho", "1":"st", "2":"sot", "2T":"sot", "2B":"sot", "3":"sot"},
    {"name":"Spanish", "local":"Español", "1":"es", "2":"spa", "2T":"spa", "2B":"spa", "3":"spa"},
    {"name":"Sundanese", "local":"Basa Sunda", "1":"su", "2":"sun", "2T":"sun", "2B":"sun", "3":"sun"},
    {"name":"Swahili", "local":"Kiswahili", "1":"sw", "2":"swa", "2T":"swa", "2B":"swa", "3":"swa"},
    {"name":"Swati", "local":"SiSwati", "1":"ss", "2":"ssw", "2T":"ssw", "2B":"ssw", "3":"ssw"},
    {"name":"Swedish", "local":"Svenska", "1":"sv", "2":"swe", "2T":"swe", "2B":"swe", "3":"swe"},
    {"name":"Tamil", "local":"தமிழ்", "1":"ta", "2":"tam", "2T":"tam", "2B":"tam", "3":"tam"},
    {"name":"Telugu", "local":"తెలుగు", "1":"te", "2":"tel", "2T":"tel", "2B":"tel", "3":"tel"},
    {"name":"Tajik", "local":"Тоҷикӣ", "1":"tg", "2":"tgk", "2T":"tgk", "2B":"tgk", "3":"tgk"},
    {"name":"Thai", "local":"ภาษาไทย", "1":"th", "2":"tha", "2T":"tha", "2B":"tha", "3":"tha"},
    {"name":"Tigrinya", "local":"ትግርኛ", "1":"ti", "2":"tir", "2T":"tir", "2B":"tir", "3":"tir"},
    {"name":"Tibetan Standard", "local":"བོད་ཡིག", "1":"bo", "2":"bod", "2T":"bod", "2B":"tib", "3":"bod"},
    {"name":"Turkmen", "local":"Türkmençe", "1":"tk", "2":"tuk", "2T":"tuk", "2B":"tuk", "3":"tuk"},
    {"name":"Tagalog", "local":"Tagalog", "1":"tl", "2":"tgl", "2T":"tgl", "2B":"tgl", "3":"tgl"},
    {"name":"Tswana", "local":"Setswana", "1":"tn", "2":"tsn", "2T":"tsn", "2B":"tsn", "3":"tsn"},
    {"name":"Tonga", "local":"faka Tonga", "1":"to", "2":"ton", "2T":"ton", "2B":"ton", "3":"ton"},
    {"name":"Turkish", "local":"Türkçe", "1":"tr", "2":"tur", "2T":"tur", "2B":"tur", "3":"tur"},
    {"name":"Tsonga", "local":"Xitsonga", "1":"ts", "2":"tso", "2T":"tso", "2B":"tso", "3":"tso"},
    {"name":"Tatar", "local":"Татарча", "1":"tt", "2":"tat", "2T":"tat", "2B":"tat", "3":"tat"},
    {"name":"Twi", "local":"Twi", "1":"tw", "2":"twi", "2T":"twi", "2B":"twi", "3":"twi"},
    {"name":"Tahitian", "local":"Reo Mā’ohi", "1":"ty", "2":"tah", "2T":"tah", "2B":"tah", "3":"tah"},
    {"name":"Uyghur", "local":"ئۇيغۇرچه", "1":"ug", "2":"uig", "2T":"uig", "2B":"uig", "3":"uig"},
    {"name":"Ukrainian", "local":"Українська", "1":"uk", "2":"ukr", "2T":"ukr", "2B":"ukr", "3":"ukr"},
    {"name":"Urdu", "local":"اردو", "1":"ur", "2":"urd", "2T":"urd", "2B":"urd", "3":"urd"},
    {"name":"Uzbek", "local":"O‘zbek", "1":"uz", "2":"uzb", "2T":"uzb", "2B":"uzb", "3":"uzb"},
    {"name":"Venda", "local":"Tshivenḓa", "1":"ve", "2":"ven", "2T":"ven", "2B":"ven", "3":"ven"},
    {"name":"Vietnamese", "local":"Tiếng Việt", "1":"vi", "2":"vie", "2T":"vie", "2B":"vie", "3":"vie"},
    {"name":"Volapük", "local":"Volapük", "1":"vo", "2":"vol", "2T":"vol", "2B":"vol", "3":"vol"},
    {"name":"Walloon", "local":"Walon", "1":"wa", "2":"wln", "2T":"wln", "2B":"wln", "3":"wln"},
    {"name":"Welsh", "local":"Cymraeg", "1":"cy", "2":"cym", "2T":"cym", "2B":"wel", "3":"cym"},
    {"name":"Wolof", "local":"Wolof", "1":"wo", "2":"wol", "2T":"wol", "2B":"wol", "3":"wol"},
    {"name":"Western Frisian", "local":"Frysk", "1":"fy", "2":"fry", "2T":"fry", "2B":"fry", "3":"fry"},
    {"name":"Xhosa", "local":"isiXhosa", "1":"xh", "2":"xho", "2T":"xho", "2B":"xho", "3":"xho"},
    {"name":"Yiddish", "local":"ייִדיש", "1":"yi", "2":"yid", "2T":"yid", "2B":"yid", "3":"yid"},
    {"name":"Yoruba", "local":"Yorùbá", "1":"yo", "2":"yor", "2T":"yor", "2B":"yor", "3":"yor"},
    {"name":"Zhuang", "local":"Cuengh", "1":"za", "2":"zha", "2T":"zha", "2B":"zha", "3":"zha"},
    {"name":"Zulu", "local":"isiZulu", "1":"zu", "2":"zul", "2T":"zul", "2B":"zul", "3":"zul"}
];


/***/ }),

/***/ 490:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const defer_to_connect_1 = __webpack_require__(790);
const nodejsMajorVersion = Number(process.versions.node.split('.')[0]);
const timer = (request) => {
    const timings = {
        start: Date.now(),
        socket: undefined,
        lookup: undefined,
        connect: undefined,
        secureConnect: undefined,
        upload: undefined,
        response: undefined,
        end: undefined,
        error: undefined,
        abort: undefined,
        phases: {
            wait: undefined,
            dns: undefined,
            tcp: undefined,
            tls: undefined,
            request: undefined,
            firstByte: undefined,
            download: undefined,
            total: undefined
        }
    };
    request.timings = timings;
    const handleError = (origin) => {
        const emit = origin.emit.bind(origin);
        origin.emit = (event, ...args) => {
            // Catches the `error` event
            if (event === 'error') {
                timings.error = Date.now();
                timings.phases.total = timings.error - timings.start;
                origin.emit = emit;
            }
            // Saves the original behavior
            return emit(event, ...args);
        };
    };
    handleError(request);
    request.prependOnceListener('abort', () => {
        timings.abort = Date.now();
        // Let the `end` response event be responsible for setting the total phase,
        // unless the Node.js major version is >= 13.
        if (!timings.response || nodejsMajorVersion >= 13) {
            timings.phases.total = Date.now() - timings.start;
        }
    });
    const onSocket = (socket) => {
        timings.socket = Date.now();
        timings.phases.wait = timings.socket - timings.start;
        const lookupListener = () => {
            timings.lookup = Date.now();
            timings.phases.dns = timings.lookup - timings.socket;
        };
        socket.prependOnceListener('lookup', lookupListener);
        defer_to_connect_1.default(socket, {
            connect: () => {
                timings.connect = Date.now();
                if (timings.lookup === undefined) {
                    socket.removeListener('lookup', lookupListener);
                    timings.lookup = timings.connect;
                    timings.phases.dns = timings.lookup - timings.socket;
                }
                timings.phases.tcp = timings.connect - timings.lookup;
                // This callback is called before flushing any data,
                // so we don't need to set `timings.phases.request` here.
            },
            secureConnect: () => {
                timings.secureConnect = Date.now();
                timings.phases.tls = timings.secureConnect - timings.connect;
            }
        });
    };
    if (request.socket) {
        onSocket(request.socket);
    }
    else {
        request.prependOnceListener('socket', onSocket);
    }
    const onUpload = () => {
        var _a;
        timings.upload = Date.now();
        timings.phases.request = timings.upload - (_a = timings.secureConnect, (_a !== null && _a !== void 0 ? _a : timings.connect));
    };
    const writableFinished = () => {
        if (typeof request.writableFinished === 'boolean') {
            return request.writableFinished;
        }
        // Node.js doesn't have `request.writableFinished` property
        return request.finished && request.outputSize === 0 && (!request.socket || request.socket.writableLength === 0);
    };
    if (writableFinished()) {
        onUpload();
    }
    else {
        request.prependOnceListener('finish', onUpload);
    }
    request.prependOnceListener('response', (response) => {
        timings.response = Date.now();
        timings.phases.firstByte = timings.response - timings.upload;
        response.timings = timings;
        handleError(response);
        response.prependOnceListener('end', () => {
            timings.end = Date.now();
            timings.phases.download = timings.end - timings.response;
            timings.phases.total = timings.end - timings.start;
        });
    });
    return timings;
};
exports.default = timer;
// For CommonJS default export support
module.exports = timer;
module.exports.default = timer;


/***/ }),

/***/ 505:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('touch', _touch, {
  cmdOptions: {
    'a': 'atime_only',
    'c': 'no_create',
    'd': 'date',
    'm': 'mtime_only',
    'r': 'reference',
  },
});

//@
//@ ### touch([options,] file [, file ...])
//@ ### touch([options,] file_array)
//@
//@ Available options:
//@
//@ + `-a`: Change only the access time
//@ + `-c`: Do not create any files
//@ + `-m`: Change only the modification time
//@ + `-d DATE`: Parse `DATE` and use it instead of current time
//@ + `-r FILE`: Use `FILE`'s times instead of current time
//@
//@ Examples:
//@
//@ ```javascript
//@ touch('source.js');
//@ touch('-c', '/path/to/some/dir/source.js');
//@ touch({ '-r': FILE }, '/path/to/some/dir/source.js');
//@ ```
//@
//@ Update the access and modification times of each `FILE` to the current time.
//@ A `FILE` argument that does not exist is created empty, unless `-c` is supplied.
//@ This is a partial implementation of [`touch(1)`](http://linux.die.net/man/1/touch).
function _touch(opts, files) {
  if (!files) {
    common.error('no files given');
  } else if (typeof files === 'string') {
    files = [].slice.call(arguments, 1);
  } else {
    common.error('file arg should be a string file path or an Array of string file paths');
  }

  files.forEach(function (f) {
    touchFile(opts, f);
  });
  return '';
}

function touchFile(opts, file) {
  var stat = tryStatFile(file);

  if (stat && stat.isDirectory()) {
    // don't error just exit
    return;
  }

  // if the file doesn't already exist and the user has specified --no-create then
  // this script is finished
  if (!stat && opts.no_create) {
    return;
  }

  // open the file and then close it. this will create it if it doesn't exist but will
  // not truncate the file
  fs.closeSync(fs.openSync(file, 'a'));

  //
  // Set timestamps
  //

  // setup some defaults
  var now = new Date();
  var mtime = opts.date || now;
  var atime = opts.date || now;

  // use reference file
  if (opts.reference) {
    var refStat = tryStatFile(opts.reference);
    if (!refStat) {
      common.error('failed to get attributess of ' + opts.reference);
    }
    mtime = refStat.mtime;
    atime = refStat.atime;
  } else if (opts.date) {
    mtime = opts.date;
    atime = opts.date;
  }

  if (opts.atime_only && opts.mtime_only) {
    // keep the new values of mtime and atime like GNU
  } else if (opts.atime_only) {
    mtime = stat.mtime;
  } else if (opts.mtime_only) {
    atime = stat.atime;
  }

  fs.utimesSync(file, atime, mtime);
}

module.exports = _touch;

function tryStatFile(filePath) {
  try {
    return common.statFollowLinks(filePath);
  } catch (e) {
    return null;
  }
}


/***/ }),

/***/ 507:
/***/ (function(module) {

"use strict";

/* istanbul ignore file: https://github.com/nodejs/node/blob/a91293d4d9ab403046ab5eb022332e4e3d249bd3/lib/internal/url.js#L1257 */

module.exports = url => {
	const options = {
		protocol: url.protocol,
		hostname: typeof url.hostname === 'string' && url.hostname.startsWith('[') ? url.hostname.slice(1, -1) : url.hostname,
		host: url.host,
		hash: url.hash,
		search: url.search,
		pathname: url.pathname,
		href: url.href,
		path: `${url.pathname || ''}${url.search || ''}`
	};

	if (typeof url.port === 'string' && url.port.length !== 0) {
		options.port = Number(url.port);
	}

	if (url.username || url.password) {
		options.auth = `${url.username || ''}:${url.password || ''}`;
	}

	return options;
};


/***/ }),

/***/ 510:
/***/ (function(module) {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),

/***/ 521:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(__webpack_require__(262));
const Utils = __importStar(__webpack_require__(127));
// octokit + plugins
const core_1 = __webpack_require__(72);
const plugin_rest_endpoint_methods_1 = __webpack_require__(559);
const plugin_paginate_rest_1 = __webpack_require__(299);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 523:
/***/ (function(module, __unusedexports, __webpack_require__) {

var register = __webpack_require__(280)
var addHook = __webpack_require__(510)
var removeHook = __webpack_require__(866)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 524:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const tls = __webpack_require__(16);

module.exports = (options = {}) => new Promise((resolve, reject) => {
	const socket = tls.connect(options, () => {
		if (options.resolveSocket) {
			socket.off('error', reject);
			resolve({alpnProtocol: socket.alpnProtocol, socket});
		} else {
			socket.destroy();
			resolve({alpnProtocol: socket.alpnProtocol});
		}
	});

	socket.on('error', reject);
});


/***/ }),

/***/ 534:
/***/ (function(module, exports) {

"use strict";

/// <reference lib="es2018"/>
/// <reference lib="dom"/>
/// <reference types="node"/>
Object.defineProperty(exports, "__esModule", { value: true });
const typedArrayTypeNames = [
    'Int8Array',
    'Uint8Array',
    'Uint8ClampedArray',
    'Int16Array',
    'Uint16Array',
    'Int32Array',
    'Uint32Array',
    'Float32Array',
    'Float64Array',
    'BigInt64Array',
    'BigUint64Array'
];
function isTypedArrayName(name) {
    return typedArrayTypeNames.includes(name);
}
const objectTypeNames = [
    'Function',
    'Generator',
    'AsyncGenerator',
    'GeneratorFunction',
    'AsyncGeneratorFunction',
    'AsyncFunction',
    'Observable',
    'Array',
    'Buffer',
    'Object',
    'RegExp',
    'Date',
    'Error',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'ArrayBuffer',
    'SharedArrayBuffer',
    'DataView',
    'Promise',
    'URL',
    'HTMLElement',
    ...typedArrayTypeNames
];
function isObjectTypeName(name) {
    return objectTypeNames.includes(name);
}
const primitiveTypeNames = [
    'null',
    'undefined',
    'string',
    'number',
    'bigint',
    'boolean',
    'symbol'
];
function isPrimitiveTypeName(name) {
    return primitiveTypeNames.includes(name);
}
// eslint-disable-next-line @typescript-eslint/ban-types
function isOfType(type) {
    return (value) => typeof value === type;
}
const { toString } = Object.prototype;
const getObjectType = (value) => {
    const objectTypeName = toString.call(value).slice(8, -1);
    if (/HTML\w+Element/.test(objectTypeName) && is.domElement(value)) {
        return 'HTMLElement';
    }
    if (isObjectTypeName(objectTypeName)) {
        return objectTypeName;
    }
    return undefined;
};
const isObjectOfType = (type) => (value) => getObjectType(value) === type;
function is(value) {
    if (value === null) {
        return 'null';
    }
    switch (typeof value) {
        case 'undefined':
            return 'undefined';
        case 'string':
            return 'string';
        case 'number':
            return 'number';
        case 'boolean':
            return 'boolean';
        case 'function':
            return 'Function';
        case 'bigint':
            return 'bigint';
        case 'symbol':
            return 'symbol';
        default:
    }
    if (is.observable(value)) {
        return 'Observable';
    }
    if (is.array(value)) {
        return 'Array';
    }
    if (is.buffer(value)) {
        return 'Buffer';
    }
    const tagType = getObjectType(value);
    if (tagType) {
        return tagType;
    }
    if (value instanceof String || value instanceof Boolean || value instanceof Number) {
        throw new TypeError('Please don\'t use object wrappers for primitive types');
    }
    return 'Object';
}
is.undefined = isOfType('undefined');
is.string = isOfType('string');
const isNumberType = isOfType('number');
is.number = (value) => isNumberType(value) && !is.nan(value);
is.bigint = isOfType('bigint');
// eslint-disable-next-line @typescript-eslint/ban-types
is.function_ = isOfType('function');
is.null_ = (value) => value === null;
is.class_ = (value) => is.function_(value) && value.toString().startsWith('class ');
is.boolean = (value) => value === true || value === false;
is.symbol = isOfType('symbol');
is.numericString = (value) => is.string(value) && !is.emptyStringOrWhitespace(value) && !Number.isNaN(Number(value));
is.array = (value, assertion) => {
    if (!Array.isArray(value)) {
        return false;
    }
    if (!is.function_(assertion)) {
        return true;
    }
    return value.every(assertion);
};
is.buffer = (value) => { var _a, _b, _c, _d; return (_d = (_c = (_b = (_a = value) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.isBuffer) === null || _c === void 0 ? void 0 : _c.call(_b, value)) !== null && _d !== void 0 ? _d : false; };
is.nullOrUndefined = (value) => is.null_(value) || is.undefined(value);
is.object = (value) => !is.null_(value) && (typeof value === 'object' || is.function_(value));
is.iterable = (value) => { var _a; return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.iterator]); };
is.asyncIterable = (value) => { var _a; return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a[Symbol.asyncIterator]); };
is.generator = (value) => is.iterable(value) && is.function_(value.next) && is.function_(value.throw);
is.asyncGenerator = (value) => is.asyncIterable(value) && is.function_(value.next) && is.function_(value.throw);
is.nativePromise = (value) => isObjectOfType('Promise')(value);
const hasPromiseAPI = (value) => {
    var _a, _b;
    return is.function_((_a = value) === null || _a === void 0 ? void 0 : _a.then) &&
        is.function_((_b = value) === null || _b === void 0 ? void 0 : _b.catch);
};
is.promise = (value) => is.nativePromise(value) || hasPromiseAPI(value);
is.generatorFunction = isObjectOfType('GeneratorFunction');
is.asyncGeneratorFunction = (value) => getObjectType(value) === 'AsyncGeneratorFunction';
is.asyncFunction = (value) => getObjectType(value) === 'AsyncFunction';
// eslint-disable-next-line no-prototype-builtins, @typescript-eslint/ban-types
is.boundFunction = (value) => is.function_(value) && !value.hasOwnProperty('prototype');
is.regExp = isObjectOfType('RegExp');
is.date = isObjectOfType('Date');
is.error = isObjectOfType('Error');
is.map = (value) => isObjectOfType('Map')(value);
is.set = (value) => isObjectOfType('Set')(value);
is.weakMap = (value) => isObjectOfType('WeakMap')(value);
is.weakSet = (value) => isObjectOfType('WeakSet')(value);
is.int8Array = isObjectOfType('Int8Array');
is.uint8Array = isObjectOfType('Uint8Array');
is.uint8ClampedArray = isObjectOfType('Uint8ClampedArray');
is.int16Array = isObjectOfType('Int16Array');
is.uint16Array = isObjectOfType('Uint16Array');
is.int32Array = isObjectOfType('Int32Array');
is.uint32Array = isObjectOfType('Uint32Array');
is.float32Array = isObjectOfType('Float32Array');
is.float64Array = isObjectOfType('Float64Array');
is.bigInt64Array = isObjectOfType('BigInt64Array');
is.bigUint64Array = isObjectOfType('BigUint64Array');
is.arrayBuffer = isObjectOfType('ArrayBuffer');
is.sharedArrayBuffer = isObjectOfType('SharedArrayBuffer');
is.dataView = isObjectOfType('DataView');
is.directInstanceOf = (instance, class_) => Object.getPrototypeOf(instance) === class_.prototype;
is.urlInstance = (value) => isObjectOfType('URL')(value);
is.urlString = (value) => {
    if (!is.string(value)) {
        return false;
    }
    try {
        new URL(value); // eslint-disable-line no-new
        return true;
    }
    catch (_a) {
        return false;
    }
};
// TODO: Use the `not` operator with a type guard here when it's available.
// Example: `is.truthy = (value: unknown): value is (not false | not 0 | not '' | not undefined | not null) => Boolean(value);`
is.truthy = (value) => Boolean(value);
// Example: `is.falsy = (value: unknown): value is (not true | 0 | '' | undefined | null) => Boolean(value);`
is.falsy = (value) => !value;
is.nan = (value) => Number.isNaN(value);
is.primitive = (value) => is.null_(value) || isPrimitiveTypeName(typeof value);
is.integer = (value) => Number.isInteger(value);
is.safeInteger = (value) => Number.isSafeInteger(value);
is.plainObject = (value) => {
    // From: https://github.com/sindresorhus/is-plain-obj/blob/master/index.js
    if (toString.call(value) !== '[object Object]') {
        return false;
    }
    const prototype = Object.getPrototypeOf(value);
    return prototype === null || prototype === Object.getPrototypeOf({});
};
is.typedArray = (value) => isTypedArrayName(getObjectType(value));
const isValidLength = (value) => is.safeInteger(value) && value >= 0;
is.arrayLike = (value) => !is.nullOrUndefined(value) && !is.function_(value) && isValidLength(value.length);
is.inRange = (value, range) => {
    if (is.number(range)) {
        return value >= Math.min(0, range) && value <= Math.max(range, 0);
    }
    if (is.array(range) && range.length === 2) {
        return value >= Math.min(...range) && value <= Math.max(...range);
    }
    throw new TypeError(`Invalid range: ${JSON.stringify(range)}`);
};
const NODE_TYPE_ELEMENT = 1;
const DOM_PROPERTIES_TO_CHECK = [
    'innerHTML',
    'ownerDocument',
    'style',
    'attributes',
    'nodeValue'
];
is.domElement = (value) => {
    return is.object(value) &&
        value.nodeType === NODE_TYPE_ELEMENT &&
        is.string(value.nodeName) &&
        !is.plainObject(value) &&
        DOM_PROPERTIES_TO_CHECK.every(property => property in value);
};
is.observable = (value) => {
    var _a, _b, _c, _d;
    if (!value) {
        return false;
    }
    // eslint-disable-next-line no-use-extend-native/no-use-extend-native
    if (value === ((_b = (_a = value)[Symbol.observable]) === null || _b === void 0 ? void 0 : _b.call(_a))) {
        return true;
    }
    if (value === ((_d = (_c = value)['@@observable']) === null || _d === void 0 ? void 0 : _d.call(_c))) {
        return true;
    }
    return false;
};
is.nodeStream = (value) => is.object(value) && is.function_(value.pipe) && !is.observable(value);
is.infinite = (value) => value === Infinity || value === -Infinity;
const isAbsoluteMod2 = (remainder) => (value) => is.integer(value) && Math.abs(value % 2) === remainder;
is.evenInteger = isAbsoluteMod2(0);
is.oddInteger = isAbsoluteMod2(1);
is.emptyArray = (value) => is.array(value) && value.length === 0;
is.nonEmptyArray = (value) => is.array(value) && value.length > 0;
is.emptyString = (value) => is.string(value) && value.length === 0;
// TODO: Use `not ''` when the `not` operator is available.
is.nonEmptyString = (value) => is.string(value) && value.length > 0;
const isWhiteSpaceString = (value) => is.string(value) && !/\S/.test(value);
is.emptyStringOrWhitespace = (value) => is.emptyString(value) || isWhiteSpaceString(value);
is.emptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length === 0;
// TODO: Use `not` operator here to remove `Map` and `Set` from type guard:
// - https://github.com/Microsoft/TypeScript/pull/29317
is.nonEmptyObject = (value) => is.object(value) && !is.map(value) && !is.set(value) && Object.keys(value).length > 0;
is.emptySet = (value) => is.set(value) && value.size === 0;
is.nonEmptySet = (value) => is.set(value) && value.size > 0;
is.emptyMap = (value) => is.map(value) && value.size === 0;
is.nonEmptyMap = (value) => is.map(value) && value.size > 0;
const predicateOnArray = (method, predicate, values) => {
    if (!is.function_(predicate)) {
        throw new TypeError(`Invalid predicate: ${JSON.stringify(predicate)}`);
    }
    if (values.length === 0) {
        throw new TypeError('Invalid number of values');
    }
    return method.call(values, predicate);
};
is.any = (predicate, ...values) => {
    const predicates = is.array(predicate) ? predicate : [predicate];
    return predicates.some(singlePredicate => predicateOnArray(Array.prototype.some, singlePredicate, values));
};
is.all = (predicate, ...values) => predicateOnArray(Array.prototype.every, predicate, values);
const assertType = (condition, description, value) => {
    if (!condition) {
        throw new TypeError(`Expected value which is \`${description}\`, received value of type \`${is(value)}\`.`);
    }
};
exports.assert = {
    // Unknowns.
    undefined: (value) => assertType(is.undefined(value), 'undefined', value),
    string: (value) => assertType(is.string(value), 'string', value),
    number: (value) => assertType(is.number(value), 'number', value),
    bigint: (value) => assertType(is.bigint(value), 'bigint', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    function_: (value) => assertType(is.function_(value), 'Function', value),
    null_: (value) => assertType(is.null_(value), 'null', value),
    class_: (value) => assertType(is.class_(value), "Class" /* class_ */, value),
    boolean: (value) => assertType(is.boolean(value), 'boolean', value),
    symbol: (value) => assertType(is.symbol(value), 'symbol', value),
    numericString: (value) => assertType(is.numericString(value), "string with a number" /* numericString */, value),
    array: (value, assertion) => {
        const assert = assertType;
        assert(is.array(value), 'Array', value);
        if (assertion) {
            value.forEach(assertion);
        }
    },
    buffer: (value) => assertType(is.buffer(value), 'Buffer', value),
    nullOrUndefined: (value) => assertType(is.nullOrUndefined(value), "null or undefined" /* nullOrUndefined */, value),
    object: (value) => assertType(is.object(value), 'Object', value),
    iterable: (value) => assertType(is.iterable(value), "Iterable" /* iterable */, value),
    asyncIterable: (value) => assertType(is.asyncIterable(value), "AsyncIterable" /* asyncIterable */, value),
    generator: (value) => assertType(is.generator(value), 'Generator', value),
    asyncGenerator: (value) => assertType(is.asyncGenerator(value), 'AsyncGenerator', value),
    nativePromise: (value) => assertType(is.nativePromise(value), "native Promise" /* nativePromise */, value),
    promise: (value) => assertType(is.promise(value), 'Promise', value),
    generatorFunction: (value) => assertType(is.generatorFunction(value), 'GeneratorFunction', value),
    asyncGeneratorFunction: (value) => assertType(is.asyncGeneratorFunction(value), 'AsyncGeneratorFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    asyncFunction: (value) => assertType(is.asyncFunction(value), 'AsyncFunction', value),
    // eslint-disable-next-line @typescript-eslint/ban-types
    boundFunction: (value) => assertType(is.boundFunction(value), 'Function', value),
    regExp: (value) => assertType(is.regExp(value), 'RegExp', value),
    date: (value) => assertType(is.date(value), 'Date', value),
    error: (value) => assertType(is.error(value), 'Error', value),
    map: (value) => assertType(is.map(value), 'Map', value),
    set: (value) => assertType(is.set(value), 'Set', value),
    weakMap: (value) => assertType(is.weakMap(value), 'WeakMap', value),
    weakSet: (value) => assertType(is.weakSet(value), 'WeakSet', value),
    int8Array: (value) => assertType(is.int8Array(value), 'Int8Array', value),
    uint8Array: (value) => assertType(is.uint8Array(value), 'Uint8Array', value),
    uint8ClampedArray: (value) => assertType(is.uint8ClampedArray(value), 'Uint8ClampedArray', value),
    int16Array: (value) => assertType(is.int16Array(value), 'Int16Array', value),
    uint16Array: (value) => assertType(is.uint16Array(value), 'Uint16Array', value),
    int32Array: (value) => assertType(is.int32Array(value), 'Int32Array', value),
    uint32Array: (value) => assertType(is.uint32Array(value), 'Uint32Array', value),
    float32Array: (value) => assertType(is.float32Array(value), 'Float32Array', value),
    float64Array: (value) => assertType(is.float64Array(value), 'Float64Array', value),
    bigInt64Array: (value) => assertType(is.bigInt64Array(value), 'BigInt64Array', value),
    bigUint64Array: (value) => assertType(is.bigUint64Array(value), 'BigUint64Array', value),
    arrayBuffer: (value) => assertType(is.arrayBuffer(value), 'ArrayBuffer', value),
    sharedArrayBuffer: (value) => assertType(is.sharedArrayBuffer(value), 'SharedArrayBuffer', value),
    dataView: (value) => assertType(is.dataView(value), 'DataView', value),
    urlInstance: (value) => assertType(is.urlInstance(value), 'URL', value),
    urlString: (value) => assertType(is.urlString(value), "string with a URL" /* urlString */, value),
    truthy: (value) => assertType(is.truthy(value), "truthy" /* truthy */, value),
    falsy: (value) => assertType(is.falsy(value), "falsy" /* falsy */, value),
    nan: (value) => assertType(is.nan(value), "NaN" /* nan */, value),
    primitive: (value) => assertType(is.primitive(value), "primitive" /* primitive */, value),
    integer: (value) => assertType(is.integer(value), "integer" /* integer */, value),
    safeInteger: (value) => assertType(is.safeInteger(value), "integer" /* safeInteger */, value),
    plainObject: (value) => assertType(is.plainObject(value), "plain object" /* plainObject */, value),
    typedArray: (value) => assertType(is.typedArray(value), "TypedArray" /* typedArray */, value),
    arrayLike: (value) => assertType(is.arrayLike(value), "array-like" /* arrayLike */, value),
    domElement: (value) => assertType(is.domElement(value), "HTMLElement" /* domElement */, value),
    observable: (value) => assertType(is.observable(value), 'Observable', value),
    nodeStream: (value) => assertType(is.nodeStream(value), "Node.js Stream" /* nodeStream */, value),
    infinite: (value) => assertType(is.infinite(value), "infinite number" /* infinite */, value),
    emptyArray: (value) => assertType(is.emptyArray(value), "empty array" /* emptyArray */, value),
    nonEmptyArray: (value) => assertType(is.nonEmptyArray(value), "non-empty array" /* nonEmptyArray */, value),
    emptyString: (value) => assertType(is.emptyString(value), "empty string" /* emptyString */, value),
    nonEmptyString: (value) => assertType(is.nonEmptyString(value), "non-empty string" /* nonEmptyString */, value),
    emptyStringOrWhitespace: (value) => assertType(is.emptyStringOrWhitespace(value), "empty string or whitespace" /* emptyStringOrWhitespace */, value),
    emptyObject: (value) => assertType(is.emptyObject(value), "empty object" /* emptyObject */, value),
    nonEmptyObject: (value) => assertType(is.nonEmptyObject(value), "non-empty object" /* nonEmptyObject */, value),
    emptySet: (value) => assertType(is.emptySet(value), "empty set" /* emptySet */, value),
    nonEmptySet: (value) => assertType(is.nonEmptySet(value), "non-empty set" /* nonEmptySet */, value),
    emptyMap: (value) => assertType(is.emptyMap(value), "empty map" /* emptyMap */, value),
    nonEmptyMap: (value) => assertType(is.nonEmptyMap(value), "non-empty map" /* nonEmptyMap */, value),
    // Numbers.
    evenInteger: (value) => assertType(is.evenInteger(value), "even integer" /* evenInteger */, value),
    oddInteger: (value) => assertType(is.oddInteger(value), "odd integer" /* oddInteger */, value),
    // Two arguments.
    directInstanceOf: (instance, class_) => assertType(is.directInstanceOf(instance, class_), "T" /* directInstanceOf */, instance),
    inRange: (value, range) => assertType(is.inRange(value, range), "in range" /* inRange */, value),
    // Variadic functions.
    any: (predicate, ...values) => assertType(is.any(predicate, ...values), "predicate returns truthy for any value" /* any */, values),
    all: (predicate, ...values) => assertType(is.all(predicate, ...values), "predicate returns truthy for all values" /* all */, values)
};
// Some few keywords are reserved, but we'll populate them for Node.js users
// See https://github.com/Microsoft/TypeScript/issues/2536
Object.defineProperties(is, {
    class: {
        value: is.class_
    },
    function: {
        value: is.function_
    },
    null: {
        value: is.null_
    }
});
Object.defineProperties(exports.assert, {
    class: {
        value: exports.assert.class_
    },
    function: {
        value: exports.assert.function_
    },
    null: {
        value: exports.assert.null_
    }
});
exports.default = is;
// For CommonJS default export support
module.exports = is;
module.exports.default = is;
module.exports.assert = exports.assert;


/***/ }),

/***/ 535:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(602);

common.register('ln', _ln, {
  cmdOptions: {
    's': 'symlink',
    'f': 'force',
  },
});

//@
//@ ### ln([options,] source, dest)
//@
//@ Available options:
//@
//@ + `-s`: symlink
//@ + `-f`: force
//@
//@ Examples:
//@
//@ ```javascript
//@ ln('file', 'newlink');
//@ ln('-sf', 'file', 'existing');
//@ ```
//@
//@ Links `source` to `dest`. Use `-f` to force the link, should `dest` already exist.
function _ln(options, source, dest) {
  if (!source || !dest) {
    common.error('Missing <source> and/or <dest>');
  }

  source = String(source);
  var sourcePath = path.normalize(source).replace(RegExp(path.sep + '$'), '');
  var isAbsolute = (path.resolve(source) === sourcePath);
  dest = path.resolve(process.cwd(), String(dest));

  if (fs.existsSync(dest)) {
    if (!options.force) {
      common.error('Destination file exists', { continue: true });
    }

    fs.unlinkSync(dest);
  }

  if (options.symlink) {
    var isWindows = process.platform === 'win32';
    var linkType = isWindows ? 'file' : null;
    var resolvedSourcePath = isAbsolute ? sourcePath : path.resolve(process.cwd(), path.dirname(dest), source);
    if (!fs.existsSync(resolvedSourcePath)) {
      common.error('Source file does not exist', { continue: true });
    } else if (isWindows && common.statFollowLinks(resolvedSourcePath).isDirectory()) {
      linkType = 'junction';
    }

    try {
      fs.symlinkSync(linkType === 'junction' ? resolvedSourcePath : source, dest, linkType);
    } catch (err) {
      common.error(err.message);
    }
  } else {
    if (!fs.existsSync(source)) {
      common.error('Source file does not exist', { continue: true });
    }
    try {
      fs.linkSync(source, dest);
    } catch (err) {
      common.error(err.message);
    }
  }
  return '';
}
module.exports = _ln;


/***/ }),

/***/ 537:
/***/ (function(module) {

"use strict";


// We define these manually to ensure they're always copied
// even if they would move up the prototype chain
// https://nodejs.org/api/http.html#http_class_http_incomingmessage
const knownProperties = [
	'aborted',
	'complete',
	'headers',
	'httpVersion',
	'httpVersionMinor',
	'httpVersionMajor',
	'method',
	'rawHeaders',
	'rawTrailers',
	'setTimeout',
	'socket',
	'statusCode',
	'statusMessage',
	'trailers',
	'url'
];

module.exports = (fromStream, toStream) => {
	if (toStream._readableState.autoDestroy) {
		throw new Error('The second stream must have the `autoDestroy` option set to `false`');
	}

	const fromProperties = new Set(Object.keys(fromStream).concat(knownProperties));

	const properties = {};

	for (const property of fromProperties) {
		// Don't overwrite existing properties.
		if (property in toStream) {
			continue;
		}

		properties[property] = {
			get() {
				const value = fromStream[property];
				const isFunction = typeof value === 'function';

				return isFunction ? value.bind(fromStream) : value;
			},
			set(value) {
				fromStream[property] = value;
			},
			enumerable: true,
			configurable: false
		};
	}

	Object.defineProperties(toStream, properties);

	fromStream.once('aborted', () => {
		toStream.destroy();

		toStream.emit('aborted');
	});

	fromStream.once('close', () => {
		if (fromStream.complete) {
			if (toStream.readable) {
				toStream.once('end', () => {
					toStream.emit('close');
				});
			} else {
				toStream.emit('close');
			}
		} else {
			toStream.emit('close');
		}
	});

	return toStream;
};


/***/ }),

/***/ 539:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
const http = __webpack_require__(605);
const https = __webpack_require__(211);
const pm = __webpack_require__(950);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(url.parse(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = url.parse(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = url.parse(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = url.parse(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = url.parse(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __webpack_require__(413);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: proxyUrl.auth,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new Error(msg);
                // attach statusCode and body obj (if available) to the error object
                err['statusCode'] = statusCode;
                if (response.result) {
                    err['result'] = response.result;
                }
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 542:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

var common = __webpack_require__(602);
var _cd = __webpack_require__(8);
var path = __webpack_require__(622);

common.register('dirs', _dirs, {
  wrapOutput: false,
});
common.register('pushd', _pushd, {
  wrapOutput: false,
});
common.register('popd', _popd, {
  wrapOutput: false,
});

// Pushd/popd/dirs internals
var _dirStack = [];

function _isStackIndex(index) {
  return (/^[\-+]\d+$/).test(index);
}

function _parseStackIndex(index) {
  if (_isStackIndex(index)) {
    if (Math.abs(index) < _dirStack.length + 1) { // +1 for pwd
      return (/^-/).test(index) ? Number(index) - 1 : Number(index);
    }
    common.error(index + ': directory stack index out of range');
  } else {
    common.error(index + ': invalid number');
  }
}

function _actualDirStack() {
  return [process.cwd()].concat(_dirStack);
}

//@
//@ ### pushd([options,] [dir | '-N' | '+N'])
//@
//@ Available options:
//@
//@ + `-n`: Suppresses the normal change of directory when adding directories to the stack, so that only the stack is manipulated.
//@ + `-q`: Supresses output to the console.
//@
//@ Arguments:
//@
//@ + `dir`: Sets the current working directory to the top of the stack, then executes the equivalent of `cd dir`.
//@ + `+N`: Brings the Nth directory (counting from the left of the list printed by dirs, starting with zero) to the top of the list by rotating the stack.
//@ + `-N`: Brings the Nth directory (counting from the right of the list printed by dirs, starting with zero) to the top of the list by rotating the stack.
//@
//@ Examples:
//@
//@ ```javascript
//@ // process.cwd() === '/usr'
//@ pushd('/etc'); // Returns /etc /usr
//@ pushd('+1');   // Returns /usr /etc
//@ ```
//@
//@ Save the current directory on the top of the directory stack and then `cd` to `dir`. With no arguments, `pushd` exchanges the top two directories. Returns an array of paths in the stack.
function _pushd(options, dir) {
  if (_isStackIndex(options)) {
    dir = options;
    options = '';
  }

  options = common.parseOptions(options, {
    'n': 'no-cd',
    'q': 'quiet',
  });

  var dirs = _actualDirStack();

  if (dir === '+0') {
    return dirs; // +0 is a noop
  } else if (!dir) {
    if (dirs.length > 1) {
      dirs = dirs.splice(1, 1).concat(dirs);
    } else {
      return common.error('no other directory');
    }
  } else if (_isStackIndex(dir)) {
    var n = _parseStackIndex(dir);
    dirs = dirs.slice(n).concat(dirs.slice(0, n));
  } else {
    if (options['no-cd']) {
      dirs.splice(1, 0, dir);
    } else {
      dirs.unshift(dir);
    }
  }

  if (options['no-cd']) {
    dirs = dirs.slice(1);
  } else {
    dir = path.resolve(dirs.shift());
    _cd('', dir);
  }

  _dirStack = dirs;
  return _dirs(options.quiet ? '-q' : '');
}
exports.pushd = _pushd;

//@
//@
//@ ### popd([options,] ['-N' | '+N'])
//@
//@ Available options:
//@
//@ + `-n`: Suppress the normal directory change when removing directories from the stack, so that only the stack is manipulated.
//@ + `-q`: Supresses output to the console.
//@
//@ Arguments:
//@
//@ + `+N`: Removes the Nth directory (counting from the left of the list printed by dirs), starting with zero.
//@ + `-N`: Removes the Nth directory (counting from the right of the list printed by dirs), starting with zero.
//@
//@ Examples:
//@
//@ ```javascript
//@ echo(process.cwd()); // '/usr'
//@ pushd('/etc');       // '/etc /usr'
//@ echo(process.cwd()); // '/etc'
//@ popd();              // '/usr'
//@ echo(process.cwd()); // '/usr'
//@ ```
//@
//@ When no arguments are given, `popd` removes the top directory from the stack and performs a `cd` to the new top directory. The elements are numbered from 0, starting at the first directory listed with dirs (i.e., `popd` is equivalent to `popd +0`). Returns an array of paths in the stack.
function _popd(options, index) {
  if (_isStackIndex(options)) {
    index = options;
    options = '';
  }

  options = common.parseOptions(options, {
    'n': 'no-cd',
    'q': 'quiet',
  });

  if (!_dirStack.length) {
    return common.error('directory stack empty');
  }

  index = _parseStackIndex(index || '+0');

  if (options['no-cd'] || index > 0 || _dirStack.length + index === 0) {
    index = index > 0 ? index - 1 : index;
    _dirStack.splice(index, 1);
  } else {
    var dir = path.resolve(_dirStack.shift());
    _cd('', dir);
  }

  return _dirs(options.quiet ? '-q' : '');
}
exports.popd = _popd;

//@
//@
//@ ### dirs([options | '+N' | '-N'])
//@
//@ Available options:
//@
//@ + `-c`: Clears the directory stack by deleting all of the elements.
//@ + `-q`: Supresses output to the console.
//@
//@ Arguments:
//@
//@ + `+N`: Displays the Nth directory (counting from the left of the list printed by dirs when invoked without options), starting with zero.
//@ + `-N`: Displays the Nth directory (counting from the right of the list printed by dirs when invoked without options), starting with zero.
//@
//@ Display the list of currently remembered directories. Returns an array of paths in the stack, or a single path if `+N` or `-N` was specified.
//@
//@ See also: `pushd`, `popd`
function _dirs(options, index) {
  if (_isStackIndex(options)) {
    index = options;
    options = '';
  }

  options = common.parseOptions(options, {
    'c': 'clear',
    'q': 'quiet',
  });

  if (options.clear) {
    _dirStack = [];
    return _dirStack;
  }

  var stack = _actualDirStack();

  if (index) {
    index = _parseStackIndex(index);

    if (index < 0) {
      index = stack.length + index;
    }

    if (!options.quiet) {
      common.log(stack[index]);
    }
    return stack[index];
  }

  if (!options.quiet) {
    common.log(stack.join(' '));
  }

  return stack;
}
exports.dirs = _dirs;


/***/ }),

/***/ 554:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

// add c spaces to the left of str
function lpad(c, str) {
  var res = '' + str;
  if (res.length < c) {
    res = Array((c - res.length) + 1).join(' ') + res;
  }
  return res;
}

common.register('uniq', _uniq, {
  canReceivePipe: true,
  cmdOptions: {
    'i': 'ignoreCase',
    'c': 'count',
    'd': 'duplicates',
  },
});

//@
//@ ### uniq([options,] [input, [output]])
//@
//@ Available options:
//@
//@ + `-i`: Ignore case while comparing
//@ + `-c`: Prefix lines by the number of occurrences
//@ + `-d`: Only print duplicate lines, one for each group of identical lines
//@
//@ Examples:
//@
//@ ```javascript
//@ uniq('foo.txt');
//@ uniq('-i', 'foo.txt');
//@ uniq('-cd', 'foo.txt', 'bar.txt');
//@ ```
//@
//@ Filter adjacent matching lines from `input`.
function _uniq(options, input, output) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (!pipe) {
    if (!input) common.error('no input given');

    if (!fs.existsSync(input)) {
      common.error(input + ': No such file or directory');
    } else if (common.statFollowLinks(input).isDirectory()) {
      common.error("error reading '" + input + "'");
    }
  }
  if (output && fs.existsSync(output) && common.statFollowLinks(output).isDirectory()) {
    common.error(output + ': Is a directory');
  }

  var lines = (input ? fs.readFileSync(input, 'utf8') : pipe).
              trimRight().
              split('\n');

  var compare = function (a, b) {
    return options.ignoreCase ?
           a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()) :
           a.localeCompare(b);
  };
  var uniqed = lines.reduceRight(function (res, e) {
    // Perform uniq -c on the input
    if (res.length === 0) {
      return [{ count: 1, ln: e }];
    } else if (compare(res[0].ln, e) === 0) {
      return [{ count: res[0].count + 1, ln: e }].concat(res.slice(1));
    } else {
      return [{ count: 1, ln: e }].concat(res);
    }
  }, []).filter(function (obj) {
                 // Do we want only duplicated objects?
    return options.duplicates ? obj.count > 1 : true;
  }).map(function (obj) {
                 // Are we tracking the counts of each line?
    return (options.count ? (lpad(7, obj.count) + ' ') : '') + obj.ln;
  }).join('\n') + '\n';

  if (output) {
    (new common.ShellString(uniqed)).to(output);
    // if uniq writes to output, nothing is passed to the next command in the pipeline (if any)
    return '';
  } else {
    return uniqed;
  }
}

module.exports = _uniq;


/***/ }),

/***/ 557:
/***/ (function(module) {

"use strict";


class CancelError extends Error {
	constructor(reason) {
		super(reason || 'Promise was canceled');
		this.name = 'CancelError';
	}

	get isCanceled() {
		return true;
	}
}

class PCancelable {
	static fn(userFn) {
		return (...arguments_) => {
			return new PCancelable((resolve, reject, onCancel) => {
				arguments_.push(onCancel);
				// eslint-disable-next-line promise/prefer-await-to-then
				userFn(...arguments_).then(resolve, reject);
			});
		};
	}

	constructor(executor) {
		this._cancelHandlers = [];
		this._isPending = true;
		this._isCanceled = false;
		this._rejectOnCancel = true;

		this._promise = new Promise((resolve, reject) => {
			this._reject = reject;

			const onResolve = value => {
				this._isPending = false;
				resolve(value);
			};

			const onReject = error => {
				this._isPending = false;
				reject(error);
			};

			const onCancel = handler => {
				if (!this._isPending) {
					throw new Error('The `onCancel` handler was attached after the promise settled.');
				}

				this._cancelHandlers.push(handler);
			};

			Object.defineProperties(onCancel, {
				shouldReject: {
					get: () => this._rejectOnCancel,
					set: boolean => {
						this._rejectOnCancel = boolean;
					}
				}
			});

			return executor(onResolve, onReject, onCancel);
		});
	}

	then(onFulfilled, onRejected) {
		// eslint-disable-next-line promise/prefer-await-to-then
		return this._promise.then(onFulfilled, onRejected);
	}

	catch(onRejected) {
		return this._promise.catch(onRejected);
	}

	finally(onFinally) {
		return this._promise.finally(onFinally);
	}

	cancel(reason) {
		if (!this._isPending || this._isCanceled) {
			return;
		}

		if (this._cancelHandlers.length > 0) {
			try {
				for (const handler of this._cancelHandlers) {
					handler();
				}
			} catch (error) {
				this._reject(error);
			}
		}

		this._isCanceled = true;
		if (this._rejectOnCancel) {
			this._reject(new CancelError(reason));
		}
	}

	get isCanceled() {
		return this._isCanceled;
	}
}

Object.setPrototypeOf(PCancelable.prototype, Promise.prototype);

module.exports = PCancelable;
module.exports.CancelError = CancelError;


/***/ }),

/***/ 559:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

const Endpoints = {
  actions: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getBySlug: ["GET /apps/{app_slug}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getInstallation: ["GET /app/installations/{installation_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getOrgInstallation: ["GET /orgs/{org}/installation", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listInstallations: ["GET /app/installations", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listInstallationsForAuthenticatedUser: ["GET /user/installations", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences", {
      mediaType: {
        previews: ["antiope"]
      }
    }],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}", {
      mediaType: {
        previews: ["antiope"]
      }
    }]
  },
  codeScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_id}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits", {
      mediaType: {
        previews: ["sombra"]
      }
    }]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations", {
      mediaType: {
        previews: ["machine-man"]
      }
    }],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://developer.github.com/v3/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    downloadArchive: ["GET /repos/{owner}/{repo}/{archive_format}/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile", {
      mediaType: {
        previews: ["black-panther"]
      }
    }],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    users: ["GET /search/users"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "4.1.2";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 562:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 565:
/***/ (function(module) {

module.exports = require("http2");

/***/ }),

/***/ 570:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {
	V4MAPPED,
	ADDRCONFIG,
	ALL,
	promises: {
		Resolver: AsyncResolver
	},
	lookup: dnsLookup
} = __webpack_require__(881);
const {promisify} = __webpack_require__(669);
const os = __webpack_require__(87);

const kCacheableLookupCreateConnection = Symbol('cacheableLookupCreateConnection');
const kCacheableLookupInstance = Symbol('cacheableLookupInstance');
const kExpires = Symbol('expires');

const supportsALL = typeof ALL === 'number';

const verifyAgent = agent => {
	if (!(agent && typeof agent.createConnection === 'function')) {
		throw new Error('Expected an Agent instance as the first argument');
	}
};

const map4to6 = entries => {
	for (const entry of entries) {
		if (entry.family === 6) {
			continue;
		}

		entry.address = `::ffff:${entry.address}`;
		entry.family = 6;
	}
};

const getIfaceInfo = () => {
	let has4 = false;
	let has6 = false;

	for (const device of Object.values(os.networkInterfaces())) {
		for (const iface of device) {
			if (iface.internal) {
				continue;
			}

			if (iface.family === 'IPv6') {
				has6 = true;
			} else {
				has4 = true;
			}

			if (has4 && has6) {
				return {has4, has6};
			}
		}
	}

	return {has4, has6};
};

const isIterable = map => {
	return Symbol.iterator in map;
};

const ttl = {ttl: true};
const all = {all: true};

class CacheableLookup {
	constructor({
		cache = new Map(),
		maxTtl = Infinity,
		fallbackDuration = 3600,
		errorTtl = 0.15,
		resolver = new AsyncResolver(),
		lookup = dnsLookup
	} = {}) {
		this.maxTtl = maxTtl;
		this.errorTtl = errorTtl;

		this._cache = cache;
		this._resolver = resolver;
		this._dnsLookup = promisify(lookup);

		if (this._resolver instanceof AsyncResolver) {
			this._resolve4 = this._resolver.resolve4.bind(this._resolver);
			this._resolve6 = this._resolver.resolve6.bind(this._resolver);
		} else {
			this._resolve4 = promisify(this._resolver.resolve4.bind(this._resolver));
			this._resolve6 = promisify(this._resolver.resolve6.bind(this._resolver));
		}

		this._iface = getIfaceInfo();

		this._pending = {};
		this._nextRemovalTime = false;
		this._hostnamesToFallback = new Set();

		if (fallbackDuration < 1) {
			this._fallback = false;
		} else {
			this._fallback = true;

			const interval = setInterval(() => {
				this._hostnamesToFallback.clear();
			}, fallbackDuration * 1000);

			/* istanbul ignore next: There is no `interval.unref()` when running inside an Electron renderer */
			if (interval.unref) {
				interval.unref();
			}
		}

		this.lookup = this.lookup.bind(this);
		this.lookupAsync = this.lookupAsync.bind(this);
	}

	set servers(servers) {
		this.clear();

		this._resolver.setServers(servers);
	}

	get servers() {
		return this._resolver.getServers();
	}

	lookup(hostname, options, callback) {
		if (typeof options === 'function') {
			callback = options;
			options = {};
		} else if (typeof options === 'number') {
			options = {
				family: options
			};
		}

		if (!callback) {
			throw new Error('Callback must be a function.');
		}

		// eslint-disable-next-line promise/prefer-await-to-then
		this.lookupAsync(hostname, options).then(result => {
			if (options.all) {
				callback(null, result);
			} else {
				callback(null, result.address, result.family, result.expires, result.ttl);
			}
		}, callback);
	}

	async lookupAsync(hostname, options = {}) {
		if (typeof options === 'number') {
			options = {
				family: options
			};
		}

		let cached = await this.query(hostname);

		if (options.family === 6) {
			const filtered = cached.filter(entry => entry.family === 6);

			if (options.hints & V4MAPPED) {
				if ((supportsALL && options.hints & ALL) || filtered.length === 0) {
					map4to6(cached);
				} else {
					cached = filtered;
				}
			} else {
				cached = filtered;
			}
		} else if (options.family === 4) {
			cached = cached.filter(entry => entry.family === 4);
		}

		if (options.hints & ADDRCONFIG) {
			const {_iface} = this;
			cached = cached.filter(entry => entry.family === 6 ? _iface.has6 : _iface.has4);
		}

		if (cached.length === 0) {
			const error = new Error(`cacheableLookup ENOTFOUND ${hostname}`);
			error.code = 'ENOTFOUND';
			error.hostname = hostname;

			throw error;
		}

		if (options.all) {
			return cached;
		}

		return cached[0];
	}

	async query(hostname) {
		let cached = await this._cache.get(hostname);

		if (!cached) {
			const pending = this._pending[hostname];

			if (pending) {
				cached = await pending;
			} else {
				const newPromise = this.queryAndCache(hostname);
				this._pending[hostname] = newPromise;

				try {
					cached = await newPromise;
				} finally {
					delete this._pending[hostname];
				}
			}
		}

		cached = cached.map(entry => {
			return {...entry};
		});

		return cached;
	}

	async _resolve(hostname) {
		const wrap = async promise => {
			try {
				return await promise;
			} catch (error) {
				if (error.code === 'ENODATA' || error.code === 'ENOTFOUND') {
					return [];
				}

				throw error;
			}
		};

		// ANY is unsafe as it doesn't trigger new queries in the underlying server.
		const [A, AAAA] = await Promise.all([
			this._resolve4(hostname, ttl),
			this._resolve6(hostname, ttl)
		].map(promise => wrap(promise)));

		let aTtl = 0;
		let aaaaTtl = 0;
		let cacheTtl = 0;

		const now = Date.now();

		for (const entry of A) {
			entry.family = 4;
			entry.expires = now + (entry.ttl * 1000);

			aTtl = Math.max(aTtl, entry.ttl);
		}

		for (const entry of AAAA) {
			entry.family = 6;
			entry.expires = now + (entry.ttl * 1000);

			aaaaTtl = Math.max(aaaaTtl, entry.ttl);
		}

		if (A.length > 0) {
			if (AAAA.length > 0) {
				cacheTtl = Math.min(aTtl, aaaaTtl);
			} else {
				cacheTtl = aTtl;
			}
		} else {
			cacheTtl = aaaaTtl;
		}

		return {
			entries: [
				...A,
				...AAAA
			],
			cacheTtl
		};
	}

	async _lookup(hostname) {
		try {
			const entries = await this._dnsLookup(hostname, {
				all: true
			});

			return {
				entries,
				cacheTtl: 0
			};
		} catch (_) {
			return {
				entries: [],
				cacheTtl: 0
			};
		}
	}

	async _set(hostname, data, cacheTtl) {
		if (this.maxTtl > 0 && cacheTtl > 0) {
			cacheTtl = Math.min(cacheTtl, this.maxTtl) * 1000;
			data[kExpires] = Date.now() + cacheTtl;

			try {
				await this._cache.set(hostname, data, cacheTtl);
			} catch (error) {
				this.lookupAsync = async () => {
					const cacheError = new Error('Cache Error. Please recreate the CacheableLookup instance.');
					cacheError.cause = error;

					throw cacheError;
				};
			}

			if (isIterable(this._cache)) {
				this._tick(cacheTtl);
			}
		}
	}

	async queryAndCache(hostname) {
		if (this._hostnamesToFallback.has(hostname)) {
			return this._dnsLookup(hostname, all);
		}

		let query = await this._resolve(hostname);

		if (query.entries.length === 0 && this._fallback) {
			query = await this._lookup(hostname);

			if (query.entries.length !== 0) {
				// Use `dns.lookup(...)` for that particular hostname
				this._hostnamesToFallback.add(hostname);
			}
		}

		const cacheTtl = query.entries.length === 0 ? this.errorTtl : query.cacheTtl;
		await this._set(hostname, query.entries, cacheTtl);

		return query.entries;
	}

	_tick(ms) {
		const nextRemovalTime = this._nextRemovalTime;

		if (!nextRemovalTime || ms < nextRemovalTime) {
			clearTimeout(this._removalTimeout);

			this._nextRemovalTime = ms;

			this._removalTimeout = setTimeout(() => {
				this._nextRemovalTime = false;

				let nextExpiry = Infinity;

				const now = Date.now();

				for (const [hostname, entries] of this._cache) {
					const expires = entries[kExpires];

					if (now >= expires) {
						this._cache.delete(hostname);
					} else if (expires < nextExpiry) {
						nextExpiry = expires;
					}
				}

				if (nextExpiry !== Infinity) {
					this._tick(nextExpiry - now);
				}
			}, ms);

			/* istanbul ignore next: There is no `timeout.unref()` when running inside an Electron renderer */
			if (this._removalTimeout.unref) {
				this._removalTimeout.unref();
			}
		}
	}

	install(agent) {
		verifyAgent(agent);

		if (kCacheableLookupCreateConnection in agent) {
			throw new Error('CacheableLookup has been already installed');
		}

		agent[kCacheableLookupCreateConnection] = agent.createConnection;
		agent[kCacheableLookupInstance] = this;

		agent.createConnection = (options, callback) => {
			if (!('lookup' in options)) {
				options.lookup = this.lookup;
			}

			return agent[kCacheableLookupCreateConnection](options, callback);
		};
	}

	uninstall(agent) {
		verifyAgent(agent);

		if (agent[kCacheableLookupCreateConnection]) {
			if (agent[kCacheableLookupInstance] !== this) {
				throw new Error('The agent is not owned by this CacheableLookup instance');
			}

			agent.createConnection = agent[kCacheableLookupCreateConnection];

			delete agent[kCacheableLookupCreateConnection];
			delete agent[kCacheableLookupInstance];
		}
	}

	updateInterfaceInfo() {
		const {_iface} = this;

		this._iface = getIfaceInfo();

		if ((_iface.has4 && !this._iface.has4) || (_iface.has6 && !this._iface.has6)) {
			this._cache.clear();
		}
	}

	clear(hostname) {
		if (hostname) {
			this._cache.delete(hostname);
			return;
		}

		this._cache.clear();
	}
}

module.exports = CacheableLookup;
module.exports.default = CacheableLookup;


/***/ }),

/***/ 574:
/***/ (function(module, __unusedexports, __webpack_require__) {

var format = __webpack_require__(669).format;

var common = __webpack_require__(602);

common.register('echo', _echo, {
  allowGlobbing: false,
});

//@
//@ ### echo([options,] string [, string ...])
//@
//@ Available options:
//@
//@ + `-e`: interpret backslash escapes (default)
//@ + `-n`: remove trailing newline from output
//@
//@ Examples:
//@
//@ ```javascript
//@ echo('hello world');
//@ var str = echo('hello world');
//@ echo('-n', 'no newline at end');
//@ ```
//@
//@ Prints `string` to stdout, and returns string with additional utility methods
//@ like `.to()`.
function _echo(opts) {
  // allow strings starting with '-', see issue #20
  var messages = [].slice.call(arguments, opts ? 0 : 1);
  var options = {};

  // If the first argument starts with '-', parse it as options string.
  // If parseOptions throws, it wasn't an options string.
  try {
    options = common.parseOptions(messages[0], {
      'e': 'escapes',
      'n': 'no_newline',
    }, {
      silent: true,
    });

    // Allow null to be echoed
    if (messages[0]) {
      messages.shift();
    }
  } catch (_) {
    // Clear out error if an error occurred
    common.state.error = null;
  }

  var output = format.apply(null, messages);

  // Add newline if -n is not passed.
  if (!options.no_newline) {
    output += '\n';
  }

  process.stdout.write(output);

  return output;
}

module.exports = _echo;


/***/ }),

/***/ 577:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(614);
const is_1 = __webpack_require__(534);
const PCancelable = __webpack_require__(557);
const types_1 = __webpack_require__(36);
const parse_body_1 = __webpack_require__(121);
const core_1 = __webpack_require__(946);
const proxy_events_1 = __webpack_require__(628);
const get_buffer_1 = __webpack_require__(452);
const is_response_ok_1 = __webpack_require__(929);
const proxiedRequestEvents = [
    'request',
    'response',
    'redirect',
    'uploadProgress',
    'downloadProgress'
];
function asPromise(normalizedOptions) {
    let globalRequest;
    let globalResponse;
    const emitter = new events_1.EventEmitter();
    const promise = new PCancelable((resolve, reject, onCancel) => {
        const makeRequest = (retryCount) => {
            const request = new core_1.default(undefined, normalizedOptions);
            request.retryCount = retryCount;
            request._noPipe = true;
            onCancel(() => request.destroy());
            onCancel.shouldReject = false;
            onCancel(() => reject(new types_1.CancelError(request)));
            globalRequest = request;
            request.once('response', async (response) => {
                var _a;
                response.retryCount = retryCount;
                if (response.request.aborted) {
                    // Canceled while downloading - will throw a `CancelError` or `TimeoutError` error
                    return;
                }
                // Download body
                let rawBody;
                try {
                    rawBody = await get_buffer_1.default(request);
                    response.rawBody = rawBody;
                }
                catch (_b) {
                    // The same error is caught below.
                    // See request.once('error')
                    return;
                }
                if (request._isAboutToError) {
                    return;
                }
                // Parse body
                const contentEncoding = ((_a = response.headers['content-encoding']) !== null && _a !== void 0 ? _a : '').toLowerCase();
                const isCompressed = ['gzip', 'deflate', 'br'].includes(contentEncoding);
                const { options } = request;
                if (isCompressed && !options.decompress) {
                    response.body = rawBody;
                }
                else {
                    try {
                        response.body = parse_body_1.default(response, options.responseType, options.parseJson, options.encoding);
                    }
                    catch (error) {
                        // Fallback to `utf8`
                        response.body = rawBody.toString();
                        if (is_response_ok_1.isResponseOk(response)) {
                            request._beforeError(error);
                            return;
                        }
                    }
                }
                try {
                    for (const [index, hook] of options.hooks.afterResponse.entries()) {
                        // @ts-expect-error TS doesn't notice that CancelableRequest is a Promise
                        // eslint-disable-next-line no-await-in-loop
                        response = await hook(response, async (updatedOptions) => {
                            const typedOptions = core_1.default.normalizeArguments(undefined, {
                                ...updatedOptions,
                                retry: {
                                    calculateDelay: () => 0
                                },
                                throwHttpErrors: false,
                                resolveBodyOnly: false
                            }, options);
                            // Remove any further hooks for that request, because we'll call them anyway.
                            // The loop continues. We don't want duplicates (asPromise recursion).
                            typedOptions.hooks.afterResponse = typedOptions.hooks.afterResponse.slice(0, index);
                            for (const hook of typedOptions.hooks.beforeRetry) {
                                // eslint-disable-next-line no-await-in-loop
                                await hook(typedOptions);
                            }
                            const promise = asPromise(typedOptions);
                            onCancel(() => {
                                promise.catch(() => { });
                                promise.cancel();
                            });
                            return promise;
                        });
                    }
                }
                catch (error) {
                    request._beforeError(new types_1.RequestError(error.message, error, request));
                    return;
                }
                if (!is_response_ok_1.isResponseOk(response)) {
                    request._beforeError(new types_1.HTTPError(response));
                    return;
                }
                globalResponse = response;
                resolve(request.options.resolveBodyOnly ? response.body : response);
            });
            const onError = (error) => {
                if (promise.isCanceled) {
                    return;
                }
                const { options } = request;
                if (error instanceof types_1.HTTPError && !options.throwHttpErrors) {
                    const { response } = error;
                    resolve(request.options.resolveBodyOnly ? response.body : response);
                    return;
                }
                reject(error);
            };
            request.once('error', onError);
            const previousBody = request.options.body;
            request.once('retry', (newRetryCount, error) => {
                var _a, _b;
                if (previousBody === ((_a = error.request) === null || _a === void 0 ? void 0 : _a.options.body) && is_1.default.nodeStream((_b = error.request) === null || _b === void 0 ? void 0 : _b.options.body)) {
                    onError(error);
                    return;
                }
                makeRequest(newRetryCount);
            });
            proxy_events_1.default(request, emitter, proxiedRequestEvents);
        };
        makeRequest(0);
    });
    promise.on = (event, fn) => {
        emitter.on(event, fn);
        return promise;
    };
    const shortcut = (responseType) => {
        const newPromise = (async () => {
            // Wait until downloading has ended
            await promise;
            const { options } = globalResponse.request;
            return parse_body_1.default(globalResponse, responseType, options.parseJson, options.encoding);
        })();
        Object.defineProperties(newPromise, Object.getOwnPropertyDescriptors(promise));
        return newPromise;
    };
    promise.json = () => {
        const { headers } = globalRequest.options;
        if (!globalRequest.writableFinished && headers.accept === undefined) {
            headers.accept = 'application/json';
        }
        return shortcut('json');
    };
    promise.buffer = () => shortcut('buffer');
    promise.text = () => shortcut('text');
    return promise;
}
exports.default = asPromise;
__exportStar(__webpack_require__(36), exports);


/***/ }),

/***/ 594:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.retryAfterStatusCodes = void 0;
exports.retryAfterStatusCodes = new Set([413, 429, 503]);
const calculateRetryDelay = ({ attemptCount, retryOptions, error, retryAfter }) => {
    if (attemptCount > retryOptions.limit) {
        return 0;
    }
    const hasMethod = retryOptions.methods.includes(error.options.method);
    const hasErrorCode = retryOptions.errorCodes.includes(error.code);
    const hasStatusCode = error.response && retryOptions.statusCodes.includes(error.response.statusCode);
    if (!hasMethod || (!hasErrorCode && !hasStatusCode)) {
        return 0;
    }
    if (error.response) {
        if (retryAfter) {
            if (retryOptions.maxRetryAfter === undefined || retryAfter > retryOptions.maxRetryAfter) {
                return 0;
            }
            return retryAfter;
        }
        if (error.response.statusCode === 413) {
            return 0;
        }
    }
    const noise = Math.random() * 100;
    return ((2 ** (attemptCount - 1)) * 1000) + noise;
};
exports.default = calculateRetryDelay;


/***/ }),

/***/ 601:
/***/ (function(module, __unusedexports, __webpack_require__) {

var data = __webpack_require__(485);

var langs = {
    all:   allLanguages,
    has:   hasLanguage,
    codes: getCodes,
    names: getNames,
    where: findBy
};

module.exports = langs;

// allLanguages :: -> Language[]
function allLanguages() {
    return data;
}

// hasLanguage :: String, String -> Boolean
function hasLanguage(crit, val) {
    return void(0) !== findBy(crit, val);
}

// getCodes :: String -> String[]
function getCodes(type) {
    if (isValidType(type)) {
        return forAll(data, function getCodesIterator(row) {
            return row[type];
        });
    }
}

// getNames :: Boolean -> String[]
function getNames(local) {
    return forAll(data, function getNamesIterator(row) {
        return local ? row.local : row.name;
    });
}

// findBy :: String, String -> Language
function findBy(crit, val) {
    for (var i = 0; i < data.length; i++) {
        if (val === data[i][crit]) {
            return data[i];
        }
    }
}

// forAll :: Array, Function -> Array
function forAll(arr, fn) {
    var out = [], i;
    for (i = 0; i < arr.length; i++) {
        out.push(fn(arr[i], i));
    }

    return out;
}

// isValidType :: String -> Boolean
function isValidType(type) {
    var types = [1, 2, 3, '1', '2', '2B', '2T', '3'];
    return -1 !== types.indexOf(type);
}


/***/ }),

/***/ 602:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";
// Ignore warning about 'new String()'
/* eslint no-new-wrappers: 0 */


var os = __webpack_require__(87);
var fs = __webpack_require__(747);
var glob = __webpack_require__(402);
var shell = __webpack_require__(739);

var shellMethods = Object.create(shell);

exports.extend = Object.assign;

// Check if we're running under electron
var isElectron = Boolean(process.versions.electron);

// Module globals (assume no execPath by default)
var DEFAULT_CONFIG = {
  fatal: false,
  globOptions: {},
  maxdepth: 255,
  noglob: false,
  silent: false,
  verbose: false,
  execPath: null,
  bufLength: 64 * 1024, // 64KB
};

var config = {
  reset: function () {
    Object.assign(this, DEFAULT_CONFIG);
    if (!isElectron) {
      this.execPath = process.execPath;
    }
  },
  resetForTesting: function () {
    this.reset();
    this.silent = true;
  },
};

config.reset();
exports.config = config;

// Note: commands should generally consider these as read-only values.
var state = {
  error: null,
  errorCode: 0,
  currentCmd: 'shell.js',
};
exports.state = state;

delete process.env.OLDPWD; // initially, there's no previous directory

// Reliably test if something is any sort of javascript object
function isObject(a) {
  return typeof a === 'object' && a !== null;
}
exports.isObject = isObject;

function log() {
  /* istanbul ignore next */
  if (!config.silent) {
    console.error.apply(console, arguments);
  }
}
exports.log = log;

// Converts strings to be equivalent across all platforms. Primarily responsible
// for making sure we use '/' instead of '\' as path separators, but this may be
// expanded in the future if necessary
function convertErrorOutput(msg) {
  if (typeof msg !== 'string') {
    throw new TypeError('input must be a string');
  }
  return msg.replace(/\\/g, '/');
}
exports.convertErrorOutput = convertErrorOutput;

// Shows error message. Throws if config.fatal is true
function error(msg, _code, options) {
  // Validate input
  if (typeof msg !== 'string') throw new Error('msg must be a string');

  var DEFAULT_OPTIONS = {
    continue: false,
    code: 1,
    prefix: state.currentCmd + ': ',
    silent: false,
  };

  if (typeof _code === 'number' && isObject(options)) {
    options.code = _code;
  } else if (isObject(_code)) { // no 'code'
    options = _code;
  } else if (typeof _code === 'number') { // no 'options'
    options = { code: _code };
  } else if (typeof _code !== 'number') { // only 'msg'
    options = {};
  }
  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (!state.errorCode) state.errorCode = options.code;

  var logEntry = convertErrorOutput(options.prefix + msg);
  state.error = state.error ? state.error + '\n' : '';
  state.error += logEntry;

  // Throw an error, or log the entry
  if (config.fatal) throw new Error(logEntry);
  if (msg.length > 0 && !options.silent) log(logEntry);

  if (!options.continue) {
    throw {
      msg: 'earlyExit',
      retValue: (new ShellString('', state.error, state.errorCode)),
    };
  }
}
exports.error = error;

//@
//@ ### ShellString(str)
//@
//@ Examples:
//@
//@ ```javascript
//@ var foo = ShellString('hello world');
//@ ```
//@
//@ Turns a regular string into a string-like object similar to what each
//@ command returns. This has special methods, like `.to()` and `.toEnd()`.
function ShellString(stdout, stderr, code) {
  var that;
  if (stdout instanceof Array) {
    that = stdout;
    that.stdout = stdout.join('\n');
    if (stdout.length > 0) that.stdout += '\n';
  } else {
    that = new String(stdout);
    that.stdout = stdout;
  }
  that.stderr = stderr;
  that.code = code;
  // A list of all commands that can appear on the right-hand side of a pipe
  // (populated by calls to common.wrap())
  pipeMethods.forEach(function (cmd) {
    that[cmd] = shellMethods[cmd].bind(that);
  });
  return that;
}

exports.ShellString = ShellString;

// Returns {'alice': true, 'bob': false} when passed a string and dictionary as follows:
//   parseOptions('-a', {'a':'alice', 'b':'bob'});
// Returns {'reference': 'string-value', 'bob': false} when passed two dictionaries of the form:
//   parseOptions({'-r': 'string-value'}, {'r':'reference', 'b':'bob'});
// Throws an error when passed a string that does not start with '-':
//   parseOptions('a', {'a':'alice'}); // throws
function parseOptions(opt, map, errorOptions) {
  // Validate input
  if (typeof opt !== 'string' && !isObject(opt)) {
    throw new Error('options must be strings or key-value pairs');
  } else if (!isObject(map)) {
    throw new Error('parseOptions() internal error: map must be an object');
  } else if (errorOptions && !isObject(errorOptions)) {
    throw new Error('parseOptions() internal error: errorOptions must be object');
  }

  if (opt === '--') {
    // This means there are no options.
    return {};
  }

  // All options are false by default
  var options = {};
  Object.keys(map).forEach(function (letter) {
    var optName = map[letter];
    if (optName[0] !== '!') {
      options[optName] = false;
    }
  });

  if (opt === '') return options; // defaults

  if (typeof opt === 'string') {
    if (opt[0] !== '-') {
      throw new Error("Options string must start with a '-'");
    }

    // e.g. chars = ['R', 'f']
    var chars = opt.slice(1).split('');

    chars.forEach(function (c) {
      if (c in map) {
        var optionName = map[c];
        if (optionName[0] === '!') {
          options[optionName.slice(1)] = false;
        } else {
          options[optionName] = true;
        }
      } else {
        error('option not recognized: ' + c, errorOptions || {});
      }
    });
  } else { // opt is an Object
    Object.keys(opt).forEach(function (key) {
      // key is a string of the form '-r', '-d', etc.
      var c = key[1];
      if (c in map) {
        var optionName = map[c];
        options[optionName] = opt[key]; // assign the given value
      } else {
        error('option not recognized: ' + c, errorOptions || {});
      }
    });
  }
  return options;
}
exports.parseOptions = parseOptions;

// Expands wildcards with matching (ie. existing) file names.
// For example:
//   expand(['file*.js']) = ['file1.js', 'file2.js', ...]
//   (if the files 'file1.js', 'file2.js', etc, exist in the current dir)
function expand(list) {
  if (!Array.isArray(list)) {
    throw new TypeError('must be an array');
  }
  var expanded = [];
  list.forEach(function (listEl) {
    // Don't expand non-strings
    if (typeof listEl !== 'string') {
      expanded.push(listEl);
    } else {
      var ret;
      try {
        ret = glob.sync(listEl, config.globOptions);
        // if nothing matched, interpret the string literally
        ret = ret.length > 0 ? ret : [listEl];
      } catch (e) {
        // if glob fails, interpret the string literally
        ret = [listEl];
      }
      expanded = expanded.concat(ret);
    }
  });
  return expanded;
}
exports.expand = expand;

// Normalizes Buffer creation, using Buffer.alloc if possible.
// Also provides a good default buffer length for most use cases.
var buffer = typeof Buffer.alloc === 'function' ?
  function (len) {
    return Buffer.alloc(len || config.bufLength);
  } :
  function (len) {
    return new Buffer(len || config.bufLength);
  };
exports.buffer = buffer;

// Normalizes _unlinkSync() across platforms to match Unix behavior, i.e.
// file can be unlinked even if it's read-only, see https://github.com/joyent/node/issues/3006
function unlinkSync(file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // Try to override file permission
    /* istanbul ignore next */
    if (e.code === 'EPERM') {
      fs.chmodSync(file, '0666');
      fs.unlinkSync(file);
    } else {
      throw e;
    }
  }
}
exports.unlinkSync = unlinkSync;

// wrappers around common.statFollowLinks and common.statNoFollowLinks that clarify intent
// and improve readability
function statFollowLinks() {
  return fs.statSync.apply(fs, arguments);
}
exports.statFollowLinks = statFollowLinks;

function statNoFollowLinks() {
  return fs.lstatSync.apply(fs, arguments);
}
exports.statNoFollowLinks = statNoFollowLinks;

// e.g. 'shelljs_a5f185d0443ca...'
function randomFileName() {
  function randomHash(count) {
    if (count === 1) {
      return parseInt(16 * Math.random(), 10).toString(16);
    }
    var hash = '';
    for (var i = 0; i < count; i++) {
      hash += randomHash(1);
    }
    return hash;
  }

  return 'shelljs_' + randomHash(20);
}
exports.randomFileName = randomFileName;

// Common wrapper for all Unix-like commands that performs glob expansion,
// command-logging, and other nice things
function wrap(cmd, fn, options) {
  options = options || {};
  return function () {
    var retValue = null;

    state.currentCmd = cmd;
    state.error = null;
    state.errorCode = 0;

    try {
      var args = [].slice.call(arguments, 0);

      // Log the command to stderr, if appropriate
      if (config.verbose) {
        console.error.apply(console, [cmd].concat(args));
      }

      // If this is coming from a pipe, let's set the pipedValue (otherwise, set
      // it to the empty string)
      state.pipedValue = (this && typeof this.stdout === 'string') ? this.stdout : '';

      if (options.unix === false) { // this branch is for exec()
        retValue = fn.apply(this, args);
      } else { // and this branch is for everything else
        if (isObject(args[0]) && args[0].constructor.name === 'Object') {
          // a no-op, allowing the syntax `touch({'-r': file}, ...)`
        } else if (args.length === 0 || typeof args[0] !== 'string' || args[0].length <= 1 || args[0][0] !== '-') {
          args.unshift(''); // only add dummy option if '-option' not already present
        }

        // flatten out arrays that are arguments, to make the syntax:
        //    `cp([file1, file2, file3], dest);`
        // equivalent to:
        //    `cp(file1, file2, file3, dest);`
        args = args.reduce(function (accum, cur) {
          if (Array.isArray(cur)) {
            return accum.concat(cur);
          }
          accum.push(cur);
          return accum;
        }, []);

        // Convert ShellStrings (basically just String objects) to regular strings
        args = args.map(function (arg) {
          if (isObject(arg) && arg.constructor.name === 'String') {
            return arg.toString();
          }
          return arg;
        });

        // Expand the '~' if appropriate
        var homeDir = os.homedir();
        args = args.map(function (arg) {
          if (typeof arg === 'string' && arg.slice(0, 2) === '~/' || arg === '~') {
            return arg.replace(/^~/, homeDir);
          }
          return arg;
        });

        // Perform glob-expansion on all arguments after globStart, but preserve
        // the arguments before it (like regexes for sed and grep)
        if (!config.noglob && options.allowGlobbing === true) {
          args = args.slice(0, options.globStart).concat(expand(args.slice(options.globStart)));
        }

        try {
          // parse options if options are provided
          if (isObject(options.cmdOptions)) {
            args[0] = parseOptions(args[0], options.cmdOptions);
          }

          retValue = fn.apply(this, args);
        } catch (e) {
          /* istanbul ignore else */
          if (e.msg === 'earlyExit') {
            retValue = e.retValue;
          } else {
            throw e; // this is probably a bug that should be thrown up the call stack
          }
        }
      }
    } catch (e) {
      /* istanbul ignore next */
      if (!state.error) {
        // If state.error hasn't been set it's an error thrown by Node, not us - probably a bug...
        e.name = 'ShellJSInternalError';
        throw e;
      }
      if (config.fatal) throw e;
    }

    if (options.wrapOutput &&
        (typeof retValue === 'string' || Array.isArray(retValue))) {
      retValue = new ShellString(retValue, state.error, state.errorCode);
    }

    state.currentCmd = 'shell.js';
    return retValue;
  };
} // wrap
exports.wrap = wrap;

// This returns all the input that is piped into the current command (or the
// empty string, if this isn't on the right-hand side of a pipe
function _readFromPipe() {
  return state.pipedValue;
}
exports.readFromPipe = _readFromPipe;

var DEFAULT_WRAP_OPTIONS = {
  allowGlobbing: true,
  canReceivePipe: false,
  cmdOptions: null,
  globStart: 1,
  pipeOnly: false,
  wrapOutput: true,
  unix: true,
};

// This is populated during plugin registration
var pipeMethods = [];

// Register a new ShellJS command
function _register(name, implementation, wrapOptions) {
  wrapOptions = wrapOptions || {};

  // Validate options
  Object.keys(wrapOptions).forEach(function (option) {
    if (!DEFAULT_WRAP_OPTIONS.hasOwnProperty(option)) {
      throw new Error("Unknown option '" + option + "'");
    }
    if (typeof wrapOptions[option] !== typeof DEFAULT_WRAP_OPTIONS[option]) {
      throw new TypeError("Unsupported type '" + typeof wrapOptions[option] +
        "' for option '" + option + "'");
    }
  });

  // If an option isn't specified, use the default
  wrapOptions = Object.assign({}, DEFAULT_WRAP_OPTIONS, wrapOptions);

  if (shell.hasOwnProperty(name)) {
    throw new Error('Command `' + name + '` already exists');
  }

  if (wrapOptions.pipeOnly) {
    wrapOptions.canReceivePipe = true;
    shellMethods[name] = wrap(name, implementation, wrapOptions);
  } else {
    shell[name] = wrap(name, implementation, wrapOptions);
  }

  if (wrapOptions.canReceivePipe) {
    pipeMethods.push(name);
  }
}
exports.register = _register;


/***/ }),

/***/ 605:
/***/ (function(module) {

module.exports = require("http");

/***/ }),

/***/ 614:
/***/ (function(module) {

module.exports = require("events");

/***/ }),

/***/ 620:
/***/ (function(module) {

module.exports = {"Abkhazian":{"name":"Abkhazian","names":["Abkhazian"],"iso639-2":"abk","iso639-1":"ab"},"Achinese":{"name":"Achinese","names":["Achinese"],"iso639-2":"ace","iso639-1":null},"Acoli":{"name":"Acoli","names":["Acoli"],"iso639-2":"ach","iso639-1":null},"Adangme":{"name":"Adangme","names":["Adangme"],"iso639-2":"ada","iso639-1":null},"Adygei":{"name":"Adygei","names":["Adyghe","Adygei"],"iso639-2":"ady","iso639-1":null},"Adyghe":{"name":"Adyghe","names":["Adyghe","Adygei"],"iso639-2":"ady","iso639-1":null},"Afar":{"name":"Afar","names":["Afar"],"iso639-2":"aar","iso639-1":"aa"},"Afrihili":{"name":"Afrihili","names":["Afrihili"],"iso639-2":"afh","iso639-1":null},"Afrikaans":{"name":"Afrikaans","names":["Afrikaans"],"iso639-2":"afr","iso639-1":"af"},"Afro-Asiatic languages":{"name":"Afro-Asiatic languages","names":["Afro-Asiatic languages"],"iso639-2":"afa","iso639-1":null},"Ainu":{"name":"Ainu","names":["Ainu"],"iso639-2":"ain","iso639-1":null},"Akan":{"name":"Akan","names":["Akan"],"iso639-2":"aka","iso639-1":"ak"},"Akkadian":{"name":"Akkadian","names":["Akkadian"],"iso639-2":"akk","iso639-1":null},"Albanian":{"name":"Albanian","names":["Albanian"],"iso639-2":"alb/sqi","iso639-1":"sq"},"Alemannic":{"name":"Alemannic","names":["Swiss German","Alemannic","Alsatian"],"iso639-2":"gsw","iso639-1":null},"Aleut":{"name":"Aleut","names":["Aleut"],"iso639-2":"ale","iso639-1":null},"Algonquian languages":{"name":"Algonquian languages","names":["Algonquian languages"],"iso639-2":"alg","iso639-1":null},"Alsatian":{"name":"Alsatian","names":["Swiss German","Alemannic","Alsatian"],"iso639-2":"gsw","iso639-1":null},"Altaic languages":{"name":"Altaic languages","names":["Altaic languages"],"iso639-2":"tut","iso639-1":null},"Amharic":{"name":"Amharic","names":["Amharic"],"iso639-2":"amh","iso639-1":"am"},"Angika":{"name":"Angika","names":["Angika"],"iso639-2":"anp","iso639-1":null},"Apache languages":{"name":"Apache languages","names":["Apache languages"],"iso639-2":"apa","iso639-1":null},"Arabic":{"name":"Arabic","names":["Arabic"],"iso639-2":"ara","iso639-1":"ar"},"Aragonese":{"name":"Aragonese","names":["Aragonese"],"iso639-2":"arg","iso639-1":"an"},"Arapaho":{"name":"Arapaho","names":["Arapaho"],"iso639-2":"arp","iso639-1":null},"Arawak":{"name":"Arawak","names":["Arawak"],"iso639-2":"arw","iso639-1":null},"Armenian":{"name":"Armenian","names":["Armenian"],"iso639-2":"arm/hye","iso639-1":"hy"},"Aromanian":{"name":"Aromanian","names":["Aromanian","Arumanian","Macedo-Romanian"],"iso639-2":"rup","iso639-1":null},"Artificial languages":{"name":"Artificial languages","names":["Artificial languages"],"iso639-2":"art","iso639-1":null},"Arumanian":{"name":"Arumanian","names":["Aromanian","Arumanian","Macedo-Romanian"],"iso639-2":"rup","iso639-1":null},"Assamese":{"name":"Assamese","names":["Assamese"],"iso639-2":"asm","iso639-1":"as"},"Asturian":{"name":"Asturian","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Asturleonese":{"name":"Asturleonese","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Athapascan languages":{"name":"Athapascan languages","names":["Athapascan languages"],"iso639-2":"ath","iso639-1":null},"Australian languages":{"name":"Australian languages","names":["Australian languages"],"iso639-2":"aus","iso639-1":null},"Austronesian languages":{"name":"Austronesian languages","names":["Austronesian languages"],"iso639-2":"map","iso639-1":null},"Avaric":{"name":"Avaric","names":["Avaric"],"iso639-2":"ava","iso639-1":"av"},"Avestan":{"name":"Avestan","names":["Avestan"],"iso639-2":"ave","iso639-1":"ae"},"Awadhi":{"name":"Awadhi","names":["Awadhi"],"iso639-2":"awa","iso639-1":null},"Aymara":{"name":"Aymara","names":["Aymara"],"iso639-2":"aym","iso639-1":"ay"},"Azerbaijani":{"name":"Azerbaijani","names":["Azerbaijani"],"iso639-2":"aze","iso639-1":"az"},"Bable":{"name":"Bable","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Balinese":{"name":"Balinese","names":["Balinese"],"iso639-2":"ban","iso639-1":null},"Baltic languages":{"name":"Baltic languages","names":["Baltic languages"],"iso639-2":"bat","iso639-1":null},"Baluchi":{"name":"Baluchi","names":["Baluchi"],"iso639-2":"bal","iso639-1":null},"Bambara":{"name":"Bambara","names":["Bambara"],"iso639-2":"bam","iso639-1":"bm"},"Bamileke languages":{"name":"Bamileke languages","names":["Bamileke languages"],"iso639-2":"bai","iso639-1":null},"Banda languages":{"name":"Banda languages","names":["Banda languages"],"iso639-2":"bad","iso639-1":null},"Bantu languages":{"name":"Bantu languages","names":["Bantu languages"],"iso639-2":"bnt","iso639-1":null},"Basa":{"name":"Basa","names":["Basa"],"iso639-2":"bas","iso639-1":null},"Bashkir":{"name":"Bashkir","names":["Bashkir"],"iso639-2":"bak","iso639-1":"ba"},"Basque":{"name":"Basque","names":["Basque"],"iso639-2":"baq/eus","iso639-1":"eu"},"Batak languages":{"name":"Batak languages","names":["Batak languages"],"iso639-2":"btk","iso639-1":null},"Bedawiyet":{"name":"Bedawiyet","names":["Beja","Bedawiyet"],"iso639-2":"bej","iso639-1":null},"Beja":{"name":"Beja","names":["Beja","Bedawiyet"],"iso639-2":"bej","iso639-1":null},"Belarusian":{"name":"Belarusian","names":["Belarusian"],"iso639-2":"bel","iso639-1":"be"},"Bemba":{"name":"Bemba","names":["Bemba"],"iso639-2":"bem","iso639-1":null},"Bengali":{"name":"Bengali","names":["Bengali"],"iso639-2":"ben","iso639-1":"bn"},"Berber languages":{"name":"Berber languages","names":["Berber languages"],"iso639-2":"ber","iso639-1":null},"Bhojpuri":{"name":"Bhojpuri","names":["Bhojpuri"],"iso639-2":"bho","iso639-1":null},"Bihari languages":{"name":"Bihari languages","names":["Bihari languages"],"iso639-2":"bih","iso639-1":"bh"},"Bikol":{"name":"Bikol","names":["Bikol"],"iso639-2":"bik","iso639-1":null},"Bilin":{"name":"Bilin","names":["Blin","Bilin"],"iso639-2":"byn","iso639-1":null},"Bini":{"name":"Bini","names":["Bini","Edo"],"iso639-2":"bin","iso639-1":null},"Bislama":{"name":"Bislama","names":["Bislama"],"iso639-2":"bis","iso639-1":"bi"},"Blin":{"name":"Blin","names":["Blin","Bilin"],"iso639-2":"byn","iso639-1":null},"Bliss":{"name":"Bliss","names":["Blissymbols","Blissymbolics","Bliss"],"iso639-2":"zbl","iso639-1":null},"Blissymbolics":{"name":"Blissymbolics","names":["Blissymbols","Blissymbolics","Bliss"],"iso639-2":"zbl","iso639-1":null},"Blissymbols":{"name":"Blissymbols","names":["Blissymbols","Blissymbolics","Bliss"],"iso639-2":"zbl","iso639-1":null},"Bokmål, Norwegian":{"name":"Bokmål, Norwegian","names":["Bokmål, Norwegian","Norwegian Bokmål"],"iso639-2":"nob","iso639-1":"nb"},"Bosnian":{"name":"Bosnian","names":["Bosnian"],"iso639-2":"bos","iso639-1":"bs"},"Braj":{"name":"Braj","names":["Braj"],"iso639-2":"bra","iso639-1":null},"Breton":{"name":"Breton","names":["Breton"],"iso639-2":"bre","iso639-1":"br"},"Buginese":{"name":"Buginese","names":["Buginese"],"iso639-2":"bug","iso639-1":null},"Bulgarian":{"name":"Bulgarian","names":["Bulgarian"],"iso639-2":"bul","iso639-1":"bg"},"Buriat":{"name":"Buriat","names":["Buriat"],"iso639-2":"bua","iso639-1":null},"Burmese":{"name":"Burmese","names":["Burmese"],"iso639-2":"bur/mya","iso639-1":"my"},"Caddo":{"name":"Caddo","names":["Caddo"],"iso639-2":"cad","iso639-1":null},"Castilian":{"name":"Castilian","names":["Spanish","Castilian"],"iso639-2":"spa","iso639-1":"es"},"Catalan":{"name":"Catalan","names":["Catalan","Valencian"],"iso639-2":"cat","iso639-1":"ca"},"Caucasian languages":{"name":"Caucasian languages","names":["Caucasian languages"],"iso639-2":"cau","iso639-1":null},"Cebuano":{"name":"Cebuano","names":["Cebuano"],"iso639-2":"ceb","iso639-1":null},"Celtic languages":{"name":"Celtic languages","names":["Celtic languages"],"iso639-2":"cel","iso639-1":null},"Central American Indian languages":{"name":"Central American Indian languages","names":["Central American Indian languages"],"iso639-2":"cai","iso639-1":null},"Central Khmer":{"name":"Central Khmer","names":["Central Khmer"],"iso639-2":"khm","iso639-1":"km"},"Chagatai":{"name":"Chagatai","names":["Chagatai"],"iso639-2":"chg","iso639-1":null},"Chamic languages":{"name":"Chamic languages","names":["Chamic languages"],"iso639-2":"cmc","iso639-1":null},"Chamorro":{"name":"Chamorro","names":["Chamorro"],"iso639-2":"cha","iso639-1":"ch"},"Chechen":{"name":"Chechen","names":["Chechen"],"iso639-2":"che","iso639-1":"ce"},"Cherokee":{"name":"Cherokee","names":["Cherokee"],"iso639-2":"chr","iso639-1":null},"Chewa":{"name":"Chewa","names":["Chichewa","Chewa","Nyanja"],"iso639-2":"nya","iso639-1":"ny"},"Cheyenne":{"name":"Cheyenne","names":["Cheyenne"],"iso639-2":"chy","iso639-1":null},"Chibcha":{"name":"Chibcha","names":["Chibcha"],"iso639-2":"chb","iso639-1":null},"Chichewa":{"name":"Chichewa","names":["Chichewa","Chewa","Nyanja"],"iso639-2":"nya","iso639-1":"ny"},"Chinese":{"name":"Chinese","names":["Chinese"],"iso639-2":"chi/zho","iso639-1":"zh"},"Chinook jargon":{"name":"Chinook jargon","names":["Chinook jargon"],"iso639-2":"chn","iso639-1":null},"Chipewyan":{"name":"Chipewyan","names":["Chipewyan","Dene Suline"],"iso639-2":"chp","iso639-1":null},"Choctaw":{"name":"Choctaw","names":["Choctaw"],"iso639-2":"cho","iso639-1":null},"Chuang":{"name":"Chuang","names":["Zhuang","Chuang"],"iso639-2":"zha","iso639-1":"za"},"Church Slavic":{"name":"Church Slavic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Church Slavonic":{"name":"Church Slavonic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Chuukese":{"name":"Chuukese","names":["Chuukese"],"iso639-2":"chk","iso639-1":null},"Chuvash":{"name":"Chuvash","names":["Chuvash"],"iso639-2":"chv","iso639-1":"cv"},"Classical Nepal Bhasa":{"name":"Classical Nepal Bhasa","names":["Classical Newari","Old Newari","Classical Nepal Bhasa"],"iso639-2":"nwc","iso639-1":null},"Classical Newari":{"name":"Classical Newari","names":["Classical Newari","Old Newari","Classical Nepal Bhasa"],"iso639-2":"nwc","iso639-1":null},"Classical Syriac":{"name":"Classical Syriac","names":["Classical Syriac"],"iso639-2":"syc","iso639-1":null},"Cook Islands Maori":{"name":"Cook Islands Maori","names":["Rarotongan","Cook Islands Maori"],"iso639-2":"rar","iso639-1":null},"Coptic":{"name":"Coptic","names":["Coptic"],"iso639-2":"cop","iso639-1":null},"Cornish":{"name":"Cornish","names":["Cornish"],"iso639-2":"cor","iso639-1":"kw"},"Corsican":{"name":"Corsican","names":["Corsican"],"iso639-2":"cos","iso639-1":"co"},"Cree":{"name":"Cree","names":["Cree"],"iso639-2":"cre","iso639-1":"cr"},"Creek":{"name":"Creek","names":["Creek"],"iso639-2":"mus","iso639-1":null},"Creoles and pidgins":{"name":"Creoles and pidgins","names":["Creoles and pidgins"],"iso639-2":"crp","iso639-1":null},"Creoles and pidgins, English based":{"name":"Creoles and pidgins, English based","names":["Creoles and pidgins, English based"],"iso639-2":"cpe","iso639-1":null},"Creoles and pidgins, French-based":{"name":"Creoles and pidgins, French-based","names":["Creoles and pidgins, French-based"],"iso639-2":"cpf","iso639-1":null},"Creoles and pidgins, Portuguese-based":{"name":"Creoles and pidgins, Portuguese-based","names":["Creoles and pidgins, Portuguese-based"],"iso639-2":"cpp","iso639-1":null},"Crimean Tatar":{"name":"Crimean Tatar","names":["Crimean Tatar","Crimean Turkish"],"iso639-2":"crh","iso639-1":null},"Crimean Turkish":{"name":"Crimean Turkish","names":["Crimean Tatar","Crimean Turkish"],"iso639-2":"crh","iso639-1":null},"Croatian":{"name":"Croatian","names":["Croatian"],"iso639-2":"hrv","iso639-1":"hr"},"Cushitic languages":{"name":"Cushitic languages","names":["Cushitic languages"],"iso639-2":"cus","iso639-1":null},"Czech":{"name":"Czech","names":["Czech"],"iso639-2":"cze/ces","iso639-1":"cs"},"Dakota":{"name":"Dakota","names":["Dakota"],"iso639-2":"dak","iso639-1":null},"Danish":{"name":"Danish","names":["Danish"],"iso639-2":"dan","iso639-1":"da"},"Dargwa":{"name":"Dargwa","names":["Dargwa"],"iso639-2":"dar","iso639-1":null},"Delaware":{"name":"Delaware","names":["Delaware"],"iso639-2":"del","iso639-1":null},"Dene Suline":{"name":"Dene Suline","names":["Chipewyan","Dene Suline"],"iso639-2":"chp","iso639-1":null},"Dhivehi":{"name":"Dhivehi","names":["Divehi","Dhivehi","Maldivian"],"iso639-2":"div","iso639-1":"dv"},"Dimili":{"name":"Dimili","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Dimli":{"name":"Dimli","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Dinka":{"name":"Dinka","names":["Dinka"],"iso639-2":"din","iso639-1":null},"Divehi":{"name":"Divehi","names":["Divehi","Dhivehi","Maldivian"],"iso639-2":"div","iso639-1":"dv"},"Dogri":{"name":"Dogri","names":["Dogri"],"iso639-2":"doi","iso639-1":null},"Dogrib":{"name":"Dogrib","names":["Dogrib"],"iso639-2":"dgr","iso639-1":null},"Dravidian languages":{"name":"Dravidian languages","names":["Dravidian languages"],"iso639-2":"dra","iso639-1":null},"Duala":{"name":"Duala","names":["Duala"],"iso639-2":"dua","iso639-1":null},"Dutch":{"name":"Dutch","names":["Dutch","Flemish"],"iso639-2":"dut/nld","iso639-1":"nl"},"Dutch, Middle (ca.1050-1350)":{"name":"Dutch, Middle (ca.1050-1350)","names":["Dutch, Middle (ca.1050-1350)"],"iso639-2":"dum","iso639-1":null},"Dyula":{"name":"Dyula","names":["Dyula"],"iso639-2":"dyu","iso639-1":null},"Dzongkha":{"name":"Dzongkha","names":["Dzongkha"],"iso639-2":"dzo","iso639-1":"dz"},"Eastern Frisian":{"name":"Eastern Frisian","names":["Eastern Frisian"],"iso639-2":"frs","iso639-1":null},"Edo":{"name":"Edo","names":["Bini","Edo"],"iso639-2":"bin","iso639-1":null},"Efik":{"name":"Efik","names":["Efik"],"iso639-2":"efi","iso639-1":null},"Egyptian (Ancient)":{"name":"Egyptian (Ancient)","names":["Egyptian (Ancient)"],"iso639-2":"egy","iso639-1":null},"Ekajuk":{"name":"Ekajuk","names":["Ekajuk"],"iso639-2":"eka","iso639-1":null},"Elamite":{"name":"Elamite","names":["Elamite"],"iso639-2":"elx","iso639-1":null},"English":{"name":"English","names":["English"],"iso639-2":"eng","iso639-1":"en"},"English, Middle (1100-1500)":{"name":"English, Middle (1100-1500)","names":["English, Middle (1100-1500)"],"iso639-2":"enm","iso639-1":null},"English, Old (ca.450-1100)":{"name":"English, Old (ca.450-1100)","names":["English, Old (ca.450-1100)"],"iso639-2":"ang","iso639-1":null},"Erzya":{"name":"Erzya","names":["Erzya"],"iso639-2":"myv","iso639-1":null},"Esperanto":{"name":"Esperanto","names":["Esperanto"],"iso639-2":"epo","iso639-1":"eo"},"Estonian":{"name":"Estonian","names":["Estonian"],"iso639-2":"est","iso639-1":"et"},"Ewe":{"name":"Ewe","names":["Ewe"],"iso639-2":"ewe","iso639-1":"ee"},"Ewondo":{"name":"Ewondo","names":["Ewondo"],"iso639-2":"ewo","iso639-1":null},"Fang":{"name":"Fang","names":["Fang"],"iso639-2":"fan","iso639-1":null},"Fanti":{"name":"Fanti","names":["Fanti"],"iso639-2":"fat","iso639-1":null},"Faroese":{"name":"Faroese","names":["Faroese"],"iso639-2":"fao","iso639-1":"fo"},"Fijian":{"name":"Fijian","names":["Fijian"],"iso639-2":"fij","iso639-1":"fj"},"Filipino":{"name":"Filipino","names":["Filipino","Pilipino"],"iso639-2":"fil","iso639-1":null},"Finnish":{"name":"Finnish","names":["Finnish"],"iso639-2":"fin","iso639-1":"fi"},"Finno-Ugrian languages":{"name":"Finno-Ugrian languages","names":["Finno-Ugrian languages"],"iso639-2":"fiu","iso639-1":null},"Flemish":{"name":"Flemish","names":["Dutch","Flemish"],"iso639-2":"dut/nld","iso639-1":"nl"},"Fon":{"name":"Fon","names":["Fon"],"iso639-2":"fon","iso639-1":null},"French":{"name":"French","names":["French"],"iso639-2":"fre/fra","iso639-1":"fr"},"French, Middle (ca.1400-1600)":{"name":"French, Middle (ca.1400-1600)","names":["French, Middle (ca.1400-1600)"],"iso639-2":"frm","iso639-1":null},"French, Old (842-ca.1400)":{"name":"French, Old (842-ca.1400)","names":["French, Old (842-ca.1400)"],"iso639-2":"fro","iso639-1":null},"Friulian":{"name":"Friulian","names":["Friulian"],"iso639-2":"fur","iso639-1":null},"Fulah":{"name":"Fulah","names":["Fulah"],"iso639-2":"ful","iso639-1":"ff"},"Ga":{"name":"Ga","names":["Ga"],"iso639-2":"gaa","iso639-1":null},"Gaelic":{"name":"Gaelic","names":["Gaelic","Scottish Gaelic"],"iso639-2":"gla","iso639-1":"gd"},"Galibi Carib":{"name":"Galibi Carib","names":["Galibi Carib"],"iso639-2":"car","iso639-1":null},"Galician":{"name":"Galician","names":["Galician"],"iso639-2":"glg","iso639-1":"gl"},"Ganda":{"name":"Ganda","names":["Ganda"],"iso639-2":"lug","iso639-1":"lg"},"Gayo":{"name":"Gayo","names":["Gayo"],"iso639-2":"gay","iso639-1":null},"Gbaya":{"name":"Gbaya","names":["Gbaya"],"iso639-2":"gba","iso639-1":null},"Geez":{"name":"Geez","names":["Geez"],"iso639-2":"gez","iso639-1":null},"Georgian":{"name":"Georgian","names":["Georgian"],"iso639-2":"geo/kat","iso639-1":"ka"},"German":{"name":"German","names":["German"],"iso639-2":"ger/deu","iso639-1":"de"},"German, Low":{"name":"German, Low","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"German, Middle High (ca.1050-1500)":{"name":"German, Middle High (ca.1050-1500)","names":["German, Middle High (ca.1050-1500)"],"iso639-2":"gmh","iso639-1":null},"German, Old High (ca.750-1050)":{"name":"German, Old High (ca.750-1050)","names":["German, Old High (ca.750-1050)"],"iso639-2":"goh","iso639-1":null},"Germanic languages":{"name":"Germanic languages","names":["Germanic languages"],"iso639-2":"gem","iso639-1":null},"Gikuyu":{"name":"Gikuyu","names":["Kikuyu","Gikuyu"],"iso639-2":"kik","iso639-1":"ki"},"Gilbertese":{"name":"Gilbertese","names":["Gilbertese"],"iso639-2":"gil","iso639-1":null},"Gondi":{"name":"Gondi","names":["Gondi"],"iso639-2":"gon","iso639-1":null},"Gorontalo":{"name":"Gorontalo","names":["Gorontalo"],"iso639-2":"gor","iso639-1":null},"Gothic":{"name":"Gothic","names":["Gothic"],"iso639-2":"got","iso639-1":null},"Grebo":{"name":"Grebo","names":["Grebo"],"iso639-2":"grb","iso639-1":null},"Greek, Ancient (to 1453)":{"name":"Greek, Ancient (to 1453)","names":["Greek, Ancient (to 1453)"],"iso639-2":"grc","iso639-1":null},"Greek, Modern (1453-)":{"name":"Greek, Modern (1453-)","names":["Greek, Modern (1453-)"],"iso639-2":"gre/ell","iso639-1":"el"},"Greenlandic":{"name":"Greenlandic","names":["Kalaallisut","Greenlandic"],"iso639-2":"kal","iso639-1":"kl"},"Guarani":{"name":"Guarani","names":["Guarani"],"iso639-2":"grn","iso639-1":"gn"},"Gujarati":{"name":"Gujarati","names":["Gujarati"],"iso639-2":"guj","iso639-1":"gu"},"Gwich'in":{"name":"Gwich'in","names":["Gwich'in"],"iso639-2":"gwi","iso639-1":null},"Haida":{"name":"Haida","names":["Haida"],"iso639-2":"hai","iso639-1":null},"Haitian":{"name":"Haitian","names":["Haitian","Haitian Creole"],"iso639-2":"hat","iso639-1":"ht"},"Haitian Creole":{"name":"Haitian Creole","names":["Haitian","Haitian Creole"],"iso639-2":"hat","iso639-1":"ht"},"Hausa":{"name":"Hausa","names":["Hausa"],"iso639-2":"hau","iso639-1":"ha"},"Hawaiian":{"name":"Hawaiian","names":["Hawaiian"],"iso639-2":"haw","iso639-1":null},"Hebrew":{"name":"Hebrew","names":["Hebrew"],"iso639-2":"heb","iso639-1":"he"},"Herero":{"name":"Herero","names":["Herero"],"iso639-2":"her","iso639-1":"hz"},"Hiligaynon":{"name":"Hiligaynon","names":["Hiligaynon"],"iso639-2":"hil","iso639-1":null},"Himachali languages":{"name":"Himachali languages","names":["Himachali languages","Western Pahari languages"],"iso639-2":"him","iso639-1":null},"Hindi":{"name":"Hindi","names":["Hindi"],"iso639-2":"hin","iso639-1":"hi"},"Hiri Motu":{"name":"Hiri Motu","names":["Hiri Motu"],"iso639-2":"hmo","iso639-1":"ho"},"Hittite":{"name":"Hittite","names":["Hittite"],"iso639-2":"hit","iso639-1":null},"Hmong":{"name":"Hmong","names":["Hmong","Mong"],"iso639-2":"hmn","iso639-1":null},"Hungarian":{"name":"Hungarian","names":["Hungarian"],"iso639-2":"hun","iso639-1":"hu"},"Hupa":{"name":"Hupa","names":["Hupa"],"iso639-2":"hup","iso639-1":null},"Iban":{"name":"Iban","names":["Iban"],"iso639-2":"iba","iso639-1":null},"Icelandic":{"name":"Icelandic","names":["Icelandic"],"iso639-2":"ice/isl","iso639-1":"is"},"Ido":{"name":"Ido","names":["Ido"],"iso639-2":"ido","iso639-1":"io"},"Igbo":{"name":"Igbo","names":["Igbo"],"iso639-2":"ibo","iso639-1":"ig"},"Ijo languages":{"name":"Ijo languages","names":["Ijo languages"],"iso639-2":"ijo","iso639-1":null},"Iloko":{"name":"Iloko","names":["Iloko"],"iso639-2":"ilo","iso639-1":null},"Imperial Aramaic (700-300 BCE)":{"name":"Imperial Aramaic (700-300 BCE)","names":["Official Aramaic (700-300 BCE)","Imperial Aramaic (700-300 BCE)"],"iso639-2":"arc","iso639-1":null},"Inari Sami":{"name":"Inari Sami","names":["Inari Sami"],"iso639-2":"smn","iso639-1":null},"Indic languages":{"name":"Indic languages","names":["Indic languages"],"iso639-2":"inc","iso639-1":null},"Indo-European languages":{"name":"Indo-European languages","names":["Indo-European languages"],"iso639-2":"ine","iso639-1":null},"Indonesian":{"name":"Indonesian","names":["Indonesian"],"iso639-2":"ind","iso639-1":"id"},"Ingush":{"name":"Ingush","names":["Ingush"],"iso639-2":"inh","iso639-1":null},"Interlingua (International Auxiliary Language Association)":{"name":"Interlingua (International Auxiliary Language Association)","names":["Interlingua (International Auxiliary Language Association)"],"iso639-2":"ina","iso639-1":"ia"},"Interlingue":{"name":"Interlingue","names":["Interlingue","Occidental"],"iso639-2":"ile","iso639-1":"ie"},"Inuktitut":{"name":"Inuktitut","names":["Inuktitut"],"iso639-2":"iku","iso639-1":"iu"},"Inupiaq":{"name":"Inupiaq","names":["Inupiaq"],"iso639-2":"ipk","iso639-1":"ik"},"Iranian languages":{"name":"Iranian languages","names":["Iranian languages"],"iso639-2":"ira","iso639-1":null},"Irish":{"name":"Irish","names":["Irish"],"iso639-2":"gle","iso639-1":"ga"},"Irish, Middle (900-1200)":{"name":"Irish, Middle (900-1200)","names":["Irish, Middle (900-1200)"],"iso639-2":"mga","iso639-1":null},"Irish, Old (to 900)":{"name":"Irish, Old (to 900)","names":["Irish, Old (to 900)"],"iso639-2":"sga","iso639-1":null},"Iroquoian languages":{"name":"Iroquoian languages","names":["Iroquoian languages"],"iso639-2":"iro","iso639-1":null},"Italian":{"name":"Italian","names":["Italian"],"iso639-2":"ita","iso639-1":"it"},"Japanese":{"name":"Japanese","names":["Japanese"],"iso639-2":"jpn","iso639-1":"ja"},"Javanese":{"name":"Javanese","names":["Javanese"],"iso639-2":"jav","iso639-1":"jv"},"Jingpho":{"name":"Jingpho","names":["Kachin","Jingpho"],"iso639-2":"kac","iso639-1":null},"Judeo-Arabic":{"name":"Judeo-Arabic","names":["Judeo-Arabic"],"iso639-2":"jrb","iso639-1":null},"Judeo-Persian":{"name":"Judeo-Persian","names":["Judeo-Persian"],"iso639-2":"jpr","iso639-1":null},"Kabardian":{"name":"Kabardian","names":["Kabardian"],"iso639-2":"kbd","iso639-1":null},"Kabyle":{"name":"Kabyle","names":["Kabyle"],"iso639-2":"kab","iso639-1":null},"Kachin":{"name":"Kachin","names":["Kachin","Jingpho"],"iso639-2":"kac","iso639-1":null},"Kalaallisut":{"name":"Kalaallisut","names":["Kalaallisut","Greenlandic"],"iso639-2":"kal","iso639-1":"kl"},"Kalmyk":{"name":"Kalmyk","names":["Kalmyk","Oirat"],"iso639-2":"xal","iso639-1":null},"Kamba":{"name":"Kamba","names":["Kamba"],"iso639-2":"kam","iso639-1":null},"Kannada":{"name":"Kannada","names":["Kannada"],"iso639-2":"kan","iso639-1":"kn"},"Kanuri":{"name":"Kanuri","names":["Kanuri"],"iso639-2":"kau","iso639-1":"kr"},"Kapampangan":{"name":"Kapampangan","names":["Pampanga","Kapampangan"],"iso639-2":"pam","iso639-1":null},"Kara-Kalpak":{"name":"Kara-Kalpak","names":["Kara-Kalpak"],"iso639-2":"kaa","iso639-1":null},"Karachay-Balkar":{"name":"Karachay-Balkar","names":["Karachay-Balkar"],"iso639-2":"krc","iso639-1":null},"Karelian":{"name":"Karelian","names":["Karelian"],"iso639-2":"krl","iso639-1":null},"Karen languages":{"name":"Karen languages","names":["Karen languages"],"iso639-2":"kar","iso639-1":null},"Kashmiri":{"name":"Kashmiri","names":["Kashmiri"],"iso639-2":"kas","iso639-1":"ks"},"Kashubian":{"name":"Kashubian","names":["Kashubian"],"iso639-2":"csb","iso639-1":null},"Kawi":{"name":"Kawi","names":["Kawi"],"iso639-2":"kaw","iso639-1":null},"Kazakh":{"name":"Kazakh","names":["Kazakh"],"iso639-2":"kaz","iso639-1":"kk"},"Khasi":{"name":"Khasi","names":["Khasi"],"iso639-2":"kha","iso639-1":null},"Khoisan languages":{"name":"Khoisan languages","names":["Khoisan languages"],"iso639-2":"khi","iso639-1":null},"Khotanese":{"name":"Khotanese","names":["Khotanese","Sakan"],"iso639-2":"kho","iso639-1":null},"Kikuyu":{"name":"Kikuyu","names":["Kikuyu","Gikuyu"],"iso639-2":"kik","iso639-1":"ki"},"Kimbundu":{"name":"Kimbundu","names":["Kimbundu"],"iso639-2":"kmb","iso639-1":null},"Kinyarwanda":{"name":"Kinyarwanda","names":["Kinyarwanda"],"iso639-2":"kin","iso639-1":"rw"},"Kirdki":{"name":"Kirdki","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Kirghiz":{"name":"Kirghiz","names":["Kirghiz","Kyrgyz"],"iso639-2":"kir","iso639-1":"ky"},"Kirmanjki":{"name":"Kirmanjki","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Klingon":{"name":"Klingon","names":["Klingon","tlhIngan-Hol"],"iso639-2":"tlh","iso639-1":null},"Komi":{"name":"Komi","names":["Komi"],"iso639-2":"kom","iso639-1":"kv"},"Kongo":{"name":"Kongo","names":["Kongo"],"iso639-2":"kon","iso639-1":"kg"},"Konkani":{"name":"Konkani","names":["Konkani"],"iso639-2":"kok","iso639-1":null},"Korean":{"name":"Korean","names":["Korean"],"iso639-2":"kor","iso639-1":"ko"},"Kosraean":{"name":"Kosraean","names":["Kosraean"],"iso639-2":"kos","iso639-1":null},"Kpelle":{"name":"Kpelle","names":["Kpelle"],"iso639-2":"kpe","iso639-1":null},"Kru languages":{"name":"Kru languages","names":["Kru languages"],"iso639-2":"kro","iso639-1":null},"Kuanyama":{"name":"Kuanyama","names":["Kuanyama","Kwanyama"],"iso639-2":"kua","iso639-1":"kj"},"Kumyk":{"name":"Kumyk","names":["Kumyk"],"iso639-2":"kum","iso639-1":null},"Kurdish":{"name":"Kurdish","names":["Kurdish"],"iso639-2":"kur","iso639-1":"ku"},"Kurukh":{"name":"Kurukh","names":["Kurukh"],"iso639-2":"kru","iso639-1":null},"Kutenai":{"name":"Kutenai","names":["Kutenai"],"iso639-2":"kut","iso639-1":null},"Kwanyama":{"name":"Kwanyama","names":["Kuanyama","Kwanyama"],"iso639-2":"kua","iso639-1":"kj"},"Kyrgyz":{"name":"Kyrgyz","names":["Kirghiz","Kyrgyz"],"iso639-2":"kir","iso639-1":"ky"},"Ladino":{"name":"Ladino","names":["Ladino"],"iso639-2":"lad","iso639-1":null},"Lahnda":{"name":"Lahnda","names":["Lahnda"],"iso639-2":"lah","iso639-1":null},"Lamba":{"name":"Lamba","names":["Lamba"],"iso639-2":"lam","iso639-1":null},"Land Dayak languages":{"name":"Land Dayak languages","names":["Land Dayak languages"],"iso639-2":"day","iso639-1":null},"Lao":{"name":"Lao","names":["Lao"],"iso639-2":"lao","iso639-1":"lo"},"Latin":{"name":"Latin","names":["Latin"],"iso639-2":"lat","iso639-1":"la"},"Latvian":{"name":"Latvian","names":["Latvian"],"iso639-2":"lav","iso639-1":"lv"},"Leonese":{"name":"Leonese","names":["Asturian","Bable","Leonese","Asturleonese"],"iso639-2":"ast","iso639-1":null},"Letzeburgesch":{"name":"Letzeburgesch","names":["Luxembourgish","Letzeburgesch"],"iso639-2":"ltz","iso639-1":"lb"},"Lezghian":{"name":"Lezghian","names":["Lezghian"],"iso639-2":"lez","iso639-1":null},"Limburgan":{"name":"Limburgan","names":["Limburgan","Limburger","Limburgish"],"iso639-2":"lim","iso639-1":"li"},"Limburger":{"name":"Limburger","names":["Limburgan","Limburger","Limburgish"],"iso639-2":"lim","iso639-1":"li"},"Limburgish":{"name":"Limburgish","names":["Limburgan","Limburger","Limburgish"],"iso639-2":"lim","iso639-1":"li"},"Lingala":{"name":"Lingala","names":["Lingala"],"iso639-2":"lin","iso639-1":"ln"},"Lithuanian":{"name":"Lithuanian","names":["Lithuanian"],"iso639-2":"lit","iso639-1":"lt"},"Lojban":{"name":"Lojban","names":["Lojban"],"iso639-2":"jbo","iso639-1":null},"Low German":{"name":"Low German","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"Low Saxon":{"name":"Low Saxon","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"Lower Sorbian":{"name":"Lower Sorbian","names":["Lower Sorbian"],"iso639-2":"dsb","iso639-1":null},"Lozi":{"name":"Lozi","names":["Lozi"],"iso639-2":"loz","iso639-1":null},"Luba-Katanga":{"name":"Luba-Katanga","names":["Luba-Katanga"],"iso639-2":"lub","iso639-1":"lu"},"Luba-Lulua":{"name":"Luba-Lulua","names":["Luba-Lulua"],"iso639-2":"lua","iso639-1":null},"Luiseno":{"name":"Luiseno","names":["Luiseno"],"iso639-2":"lui","iso639-1":null},"Lule Sami":{"name":"Lule Sami","names":["Lule Sami"],"iso639-2":"smj","iso639-1":null},"Lunda":{"name":"Lunda","names":["Lunda"],"iso639-2":"lun","iso639-1":null},"Luo (Kenya and Tanzania)":{"name":"Luo (Kenya and Tanzania)","names":["Luo (Kenya and Tanzania)"],"iso639-2":"luo","iso639-1":null},"Lushai":{"name":"Lushai","names":["Lushai"],"iso639-2":"lus","iso639-1":null},"Luxembourgish":{"name":"Luxembourgish","names":["Luxembourgish","Letzeburgesch"],"iso639-2":"ltz","iso639-1":"lb"},"Macedo-Romanian":{"name":"Macedo-Romanian","names":["Aromanian","Arumanian","Macedo-Romanian"],"iso639-2":"rup","iso639-1":null},"Macedonian":{"name":"Macedonian","names":["Macedonian"],"iso639-2":"mac/mkd","iso639-1":"mk"},"Madurese":{"name":"Madurese","names":["Madurese"],"iso639-2":"mad","iso639-1":null},"Magahi":{"name":"Magahi","names":["Magahi"],"iso639-2":"mag","iso639-1":null},"Maithili":{"name":"Maithili","names":["Maithili"],"iso639-2":"mai","iso639-1":null},"Makasar":{"name":"Makasar","names":["Makasar"],"iso639-2":"mak","iso639-1":null},"Malagasy":{"name":"Malagasy","names":["Malagasy"],"iso639-2":"mlg","iso639-1":"mg"},"Malay":{"name":"Malay","names":["Malay"],"iso639-2":"may/msa","iso639-1":"ms"},"Malayalam":{"name":"Malayalam","names":["Malayalam"],"iso639-2":"mal","iso639-1":"ml"},"Maldivian":{"name":"Maldivian","names":["Divehi","Dhivehi","Maldivian"],"iso639-2":"div","iso639-1":"dv"},"Maltese":{"name":"Maltese","names":["Maltese"],"iso639-2":"mlt","iso639-1":"mt"},"Manchu":{"name":"Manchu","names":["Manchu"],"iso639-2":"mnc","iso639-1":null},"Mandar":{"name":"Mandar","names":["Mandar"],"iso639-2":"mdr","iso639-1":null},"Mandingo":{"name":"Mandingo","names":["Mandingo"],"iso639-2":"man","iso639-1":null},"Manipuri":{"name":"Manipuri","names":["Manipuri"],"iso639-2":"mni","iso639-1":null},"Manobo languages":{"name":"Manobo languages","names":["Manobo languages"],"iso639-2":"mno","iso639-1":null},"Manx":{"name":"Manx","names":["Manx"],"iso639-2":"glv","iso639-1":"gv"},"Maori":{"name":"Maori","names":["Maori"],"iso639-2":"mao/mri","iso639-1":"mi"},"Mapuche":{"name":"Mapuche","names":["Mapudungun","Mapuche"],"iso639-2":"arn","iso639-1":null},"Mapudungun":{"name":"Mapudungun","names":["Mapudungun","Mapuche"],"iso639-2":"arn","iso639-1":null},"Marathi":{"name":"Marathi","names":["Marathi"],"iso639-2":"mar","iso639-1":"mr"},"Mari":{"name":"Mari","names":["Mari"],"iso639-2":"chm","iso639-1":null},"Marshallese":{"name":"Marshallese","names":["Marshallese"],"iso639-2":"mah","iso639-1":"mh"},"Marwari":{"name":"Marwari","names":["Marwari"],"iso639-2":"mwr","iso639-1":null},"Masai":{"name":"Masai","names":["Masai"],"iso639-2":"mas","iso639-1":null},"Mayan languages":{"name":"Mayan languages","names":["Mayan languages"],"iso639-2":"myn","iso639-1":null},"Mende":{"name":"Mende","names":["Mende"],"iso639-2":"men","iso639-1":null},"Mi'kmaq":{"name":"Mi'kmaq","names":["Mi'kmaq","Micmac"],"iso639-2":"mic","iso639-1":null},"Micmac":{"name":"Micmac","names":["Mi'kmaq","Micmac"],"iso639-2":"mic","iso639-1":null},"Minangkabau":{"name":"Minangkabau","names":["Minangkabau"],"iso639-2":"min","iso639-1":null},"Mirandese":{"name":"Mirandese","names":["Mirandese"],"iso639-2":"mwl","iso639-1":null},"Mohawk":{"name":"Mohawk","names":["Mohawk"],"iso639-2":"moh","iso639-1":null},"Moksha":{"name":"Moksha","names":["Moksha"],"iso639-2":"mdf","iso639-1":null},"Moldavian":{"name":"Moldavian","names":["Romanian","Moldavian","Moldovan"],"iso639-2":"rum/ron","iso639-1":"ro"},"Moldovan":{"name":"Moldovan","names":["Romanian","Moldavian","Moldovan"],"iso639-2":"rum/ron","iso639-1":"ro"},"Mon-Khmer languages":{"name":"Mon-Khmer languages","names":["Mon-Khmer languages"],"iso639-2":"mkh","iso639-1":null},"Mong":{"name":"Mong","names":["Hmong","Mong"],"iso639-2":"hmn","iso639-1":null},"Mongo":{"name":"Mongo","names":["Mongo"],"iso639-2":"lol","iso639-1":null},"Mongolian":{"name":"Mongolian","names":["Mongolian"],"iso639-2":"mon","iso639-1":"mn"},"Montenegrin":{"name":"Montenegrin","names":["Montenegrin"],"iso639-2":"cnr","iso639-1":null},"Mossi":{"name":"Mossi","names":["Mossi"],"iso639-2":"mos","iso639-1":null},"Multiple languages":{"name":"Multiple languages","names":["Multiple languages"],"iso639-2":"mul","iso639-1":null},"Munda languages":{"name":"Munda languages","names":["Munda languages"],"iso639-2":"mun","iso639-1":null},"N'Ko":{"name":"N'Ko","names":["N'Ko"],"iso639-2":"nqo","iso639-1":null},"Nahuatl languages":{"name":"Nahuatl languages","names":["Nahuatl languages"],"iso639-2":"nah","iso639-1":null},"Nauru":{"name":"Nauru","names":["Nauru"],"iso639-2":"nau","iso639-1":"na"},"Navaho":{"name":"Navaho","names":["Navajo","Navaho"],"iso639-2":"nav","iso639-1":"nv"},"Navajo":{"name":"Navajo","names":["Navajo","Navaho"],"iso639-2":"nav","iso639-1":"nv"},"Ndebele, North":{"name":"Ndebele, North","names":["Ndebele, North","North Ndebele"],"iso639-2":"nde","iso639-1":"nd"},"Ndebele, South":{"name":"Ndebele, South","names":["Ndebele, South","South Ndebele"],"iso639-2":"nbl","iso639-1":"nr"},"Ndonga":{"name":"Ndonga","names":["Ndonga"],"iso639-2":"ndo","iso639-1":"ng"},"Neapolitan":{"name":"Neapolitan","names":["Neapolitan"],"iso639-2":"nap","iso639-1":null},"Nepal Bhasa":{"name":"Nepal Bhasa","names":["Nepal Bhasa","Newari"],"iso639-2":"new","iso639-1":null},"Nepali":{"name":"Nepali","names":["Nepali"],"iso639-2":"nep","iso639-1":"ne"},"Newari":{"name":"Newari","names":["Nepal Bhasa","Newari"],"iso639-2":"new","iso639-1":null},"Nias":{"name":"Nias","names":["Nias"],"iso639-2":"nia","iso639-1":null},"Niger-Kordofanian languages":{"name":"Niger-Kordofanian languages","names":["Niger-Kordofanian languages"],"iso639-2":"nic","iso639-1":null},"Nilo-Saharan languages":{"name":"Nilo-Saharan languages","names":["Nilo-Saharan languages"],"iso639-2":"ssa","iso639-1":null},"Niuean":{"name":"Niuean","names":["Niuean"],"iso639-2":"niu","iso639-1":null},"No linguistic content":{"name":"No linguistic content","names":["No linguistic content","Not applicable"],"iso639-2":"zxx","iso639-1":null},"Nogai":{"name":"Nogai","names":["Nogai"],"iso639-2":"nog","iso639-1":null},"Norse, Old":{"name":"Norse, Old","names":["Norse, Old"],"iso639-2":"non","iso639-1":null},"North American Indian languages":{"name":"North American Indian languages","names":["North American Indian languages"],"iso639-2":"nai","iso639-1":null},"North Ndebele":{"name":"North Ndebele","names":["Ndebele, North","North Ndebele"],"iso639-2":"nde","iso639-1":"nd"},"Northern Frisian":{"name":"Northern Frisian","names":["Northern Frisian"],"iso639-2":"frr","iso639-1":null},"Northern Sami":{"name":"Northern Sami","names":["Northern Sami"],"iso639-2":"sme","iso639-1":"se"},"Northern Sotho":{"name":"Northern Sotho","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Norwegian":{"name":"Norwegian","names":["Norwegian"],"iso639-2":"nor","iso639-1":"no"},"Norwegian Bokmål":{"name":"Norwegian Bokmål","names":["Bokmål, Norwegian","Norwegian Bokmål"],"iso639-2":"nob","iso639-1":"nb"},"Norwegian Nynorsk":{"name":"Norwegian Nynorsk","names":["Norwegian Nynorsk","Nynorsk, Norwegian"],"iso639-2":"nno","iso639-1":"nn"},"Not applicable":{"name":"Not applicable","names":["No linguistic content","Not applicable"],"iso639-2":"zxx","iso639-1":null},"Nubian languages":{"name":"Nubian languages","names":["Nubian languages"],"iso639-2":"nub","iso639-1":null},"Nuosu":{"name":"Nuosu","names":["Sichuan Yi","Nuosu"],"iso639-2":"iii","iso639-1":"ii"},"Nyamwezi":{"name":"Nyamwezi","names":["Nyamwezi"],"iso639-2":"nym","iso639-1":null},"Nyanja":{"name":"Nyanja","names":["Chichewa","Chewa","Nyanja"],"iso639-2":"nya","iso639-1":"ny"},"Nyankole":{"name":"Nyankole","names":["Nyankole"],"iso639-2":"nyn","iso639-1":null},"Nynorsk, Norwegian":{"name":"Nynorsk, Norwegian","names":["Norwegian Nynorsk","Nynorsk, Norwegian"],"iso639-2":"nno","iso639-1":"nn"},"Nyoro":{"name":"Nyoro","names":["Nyoro"],"iso639-2":"nyo","iso639-1":null},"Nzima":{"name":"Nzima","names":["Nzima"],"iso639-2":"nzi","iso639-1":null},"Occidental":{"name":"Occidental","names":["Interlingue","Occidental"],"iso639-2":"ile","iso639-1":"ie"},"Occitan (post 1500)":{"name":"Occitan (post 1500)","names":["Occitan (post 1500)"],"iso639-2":"oci","iso639-1":"oc"},"Occitan, Old (to 1500)":{"name":"Occitan, Old (to 1500)","names":["Provençal, Old (to 1500)","Occitan, Old (to 1500)"],"iso639-2":"pro","iso639-1":null},"Official Aramaic (700-300 BCE)":{"name":"Official Aramaic (700-300 BCE)","names":["Official Aramaic (700-300 BCE)","Imperial Aramaic (700-300 BCE)"],"iso639-2":"arc","iso639-1":null},"Oirat":{"name":"Oirat","names":["Kalmyk","Oirat"],"iso639-2":"xal","iso639-1":null},"Ojibwa":{"name":"Ojibwa","names":["Ojibwa"],"iso639-2":"oji","iso639-1":"oj"},"Old Bulgarian":{"name":"Old Bulgarian","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Old Church Slavonic":{"name":"Old Church Slavonic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Old Newari":{"name":"Old Newari","names":["Classical Newari","Old Newari","Classical Nepal Bhasa"],"iso639-2":"nwc","iso639-1":null},"Old Slavonic":{"name":"Old Slavonic","names":["Church Slavic","Old Slavonic","Church Slavonic","Old Bulgarian","Old Church Slavonic"],"iso639-2":"chu","iso639-1":"cu"},"Oriya":{"name":"Oriya","names":["Oriya"],"iso639-2":"ori","iso639-1":"or"},"Oromo":{"name":"Oromo","names":["Oromo"],"iso639-2":"orm","iso639-1":"om"},"Osage":{"name":"Osage","names":["Osage"],"iso639-2":"osa","iso639-1":null},"Ossetian":{"name":"Ossetian","names":["Ossetian","Ossetic"],"iso639-2":"oss","iso639-1":"os"},"Ossetic":{"name":"Ossetic","names":["Ossetian","Ossetic"],"iso639-2":"oss","iso639-1":"os"},"Otomian languages":{"name":"Otomian languages","names":["Otomian languages"],"iso639-2":"oto","iso639-1":null},"Pahlavi":{"name":"Pahlavi","names":["Pahlavi"],"iso639-2":"pal","iso639-1":null},"Palauan":{"name":"Palauan","names":["Palauan"],"iso639-2":"pau","iso639-1":null},"Pali":{"name":"Pali","names":["Pali"],"iso639-2":"pli","iso639-1":"pi"},"Pampanga":{"name":"Pampanga","names":["Pampanga","Kapampangan"],"iso639-2":"pam","iso639-1":null},"Pangasinan":{"name":"Pangasinan","names":["Pangasinan"],"iso639-2":"pag","iso639-1":null},"Panjabi":{"name":"Panjabi","names":["Panjabi","Punjabi"],"iso639-2":"pan","iso639-1":"pa"},"Papiamento":{"name":"Papiamento","names":["Papiamento"],"iso639-2":"pap","iso639-1":null},"Papuan languages":{"name":"Papuan languages","names":["Papuan languages"],"iso639-2":"paa","iso639-1":null},"Pashto":{"name":"Pashto","names":["Pushto","Pashto"],"iso639-2":"pus","iso639-1":"ps"},"Pedi":{"name":"Pedi","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Persian":{"name":"Persian","names":["Persian"],"iso639-2":"per/fas","iso639-1":"fa"},"Persian, Old (ca.600-400 B.C.)":{"name":"Persian, Old (ca.600-400 B.C.)","names":["Persian, Old (ca.600-400 B.C.)"],"iso639-2":"peo","iso639-1":null},"Philippine languages":{"name":"Philippine languages","names":["Philippine languages"],"iso639-2":"phi","iso639-1":null},"Phoenician":{"name":"Phoenician","names":["Phoenician"],"iso639-2":"phn","iso639-1":null},"Pilipino":{"name":"Pilipino","names":["Filipino","Pilipino"],"iso639-2":"fil","iso639-1":null},"Pohnpeian":{"name":"Pohnpeian","names":["Pohnpeian"],"iso639-2":"pon","iso639-1":null},"Polish":{"name":"Polish","names":["Polish"],"iso639-2":"pol","iso639-1":"pl"},"Portuguese":{"name":"Portuguese","names":["Portuguese"],"iso639-2":"por","iso639-1":"pt"},"Prakrit languages":{"name":"Prakrit languages","names":["Prakrit languages"],"iso639-2":"pra","iso639-1":null},"Provençal, Old (to 1500)":{"name":"Provençal, Old (to 1500)","names":["Provençal, Old (to 1500)","Occitan, Old (to 1500)"],"iso639-2":"pro","iso639-1":null},"Punjabi":{"name":"Punjabi","names":["Panjabi","Punjabi"],"iso639-2":"pan","iso639-1":"pa"},"Pushto":{"name":"Pushto","names":["Pushto","Pashto"],"iso639-2":"pus","iso639-1":"ps"},"Quechua":{"name":"Quechua","names":["Quechua"],"iso639-2":"que","iso639-1":"qu"},"Rajasthani":{"name":"Rajasthani","names":["Rajasthani"],"iso639-2":"raj","iso639-1":null},"Rapanui":{"name":"Rapanui","names":["Rapanui"],"iso639-2":"rap","iso639-1":null},"Rarotongan":{"name":"Rarotongan","names":["Rarotongan","Cook Islands Maori"],"iso639-2":"rar","iso639-1":null},"Reserved for local use":{"name":"Reserved for local use","names":["Reserved for local use"],"iso639-2":"qaa-qtz","iso639-1":null},"Romance languages":{"name":"Romance languages","names":["Romance languages"],"iso639-2":"roa","iso639-1":null},"Romanian":{"name":"Romanian","names":["Romanian","Moldavian","Moldovan"],"iso639-2":"rum/ron","iso639-1":"ro"},"Romansh":{"name":"Romansh","names":["Romansh"],"iso639-2":"roh","iso639-1":"rm"},"Romany":{"name":"Romany","names":["Romany"],"iso639-2":"rom","iso639-1":null},"Rundi":{"name":"Rundi","names":["Rundi"],"iso639-2":"run","iso639-1":"rn"},"Russian":{"name":"Russian","names":["Russian"],"iso639-2":"rus","iso639-1":"ru"},"Sakan":{"name":"Sakan","names":["Khotanese","Sakan"],"iso639-2":"kho","iso639-1":null},"Salishan languages":{"name":"Salishan languages","names":["Salishan languages"],"iso639-2":"sal","iso639-1":null},"Samaritan Aramaic":{"name":"Samaritan Aramaic","names":["Samaritan Aramaic"],"iso639-2":"sam","iso639-1":null},"Sami languages":{"name":"Sami languages","names":["Sami languages"],"iso639-2":"smi","iso639-1":null},"Samoan":{"name":"Samoan","names":["Samoan"],"iso639-2":"smo","iso639-1":"sm"},"Sandawe":{"name":"Sandawe","names":["Sandawe"],"iso639-2":"sad","iso639-1":null},"Sango":{"name":"Sango","names":["Sango"],"iso639-2":"sag","iso639-1":"sg"},"Sanskrit":{"name":"Sanskrit","names":["Sanskrit"],"iso639-2":"san","iso639-1":"sa"},"Santali":{"name":"Santali","names":["Santali"],"iso639-2":"sat","iso639-1":null},"Sardinian":{"name":"Sardinian","names":["Sardinian"],"iso639-2":"srd","iso639-1":"sc"},"Sasak":{"name":"Sasak","names":["Sasak"],"iso639-2":"sas","iso639-1":null},"Saxon, Low":{"name":"Saxon, Low","names":["Low German","Low Saxon","German, Low","Saxon, Low"],"iso639-2":"nds","iso639-1":null},"Scots":{"name":"Scots","names":["Scots"],"iso639-2":"sco","iso639-1":null},"Scottish Gaelic":{"name":"Scottish Gaelic","names":["Gaelic","Scottish Gaelic"],"iso639-2":"gla","iso639-1":"gd"},"Selkup":{"name":"Selkup","names":["Selkup"],"iso639-2":"sel","iso639-1":null},"Semitic languages":{"name":"Semitic languages","names":["Semitic languages"],"iso639-2":"sem","iso639-1":null},"Sepedi":{"name":"Sepedi","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Serbian":{"name":"Serbian","names":["Serbian"],"iso639-2":"srp","iso639-1":"sr"},"Serer":{"name":"Serer","names":["Serer"],"iso639-2":"srr","iso639-1":null},"Shan":{"name":"Shan","names":["Shan"],"iso639-2":"shn","iso639-1":null},"Shona":{"name":"Shona","names":["Shona"],"iso639-2":"sna","iso639-1":"sn"},"Sichuan Yi":{"name":"Sichuan Yi","names":["Sichuan Yi","Nuosu"],"iso639-2":"iii","iso639-1":"ii"},"Sicilian":{"name":"Sicilian","names":["Sicilian"],"iso639-2":"scn","iso639-1":null},"Sidamo":{"name":"Sidamo","names":["Sidamo"],"iso639-2":"sid","iso639-1":null},"Sign Languages":{"name":"Sign Languages","names":["Sign Languages"],"iso639-2":"sgn","iso639-1":null},"Siksika":{"name":"Siksika","names":["Siksika"],"iso639-2":"bla","iso639-1":null},"Sindhi":{"name":"Sindhi","names":["Sindhi"],"iso639-2":"snd","iso639-1":"sd"},"Sinhala":{"name":"Sinhala","names":["Sinhala","Sinhalese"],"iso639-2":"sin","iso639-1":"si"},"Sinhalese":{"name":"Sinhalese","names":["Sinhala","Sinhalese"],"iso639-2":"sin","iso639-1":"si"},"Sino-Tibetan languages":{"name":"Sino-Tibetan languages","names":["Sino-Tibetan languages"],"iso639-2":"sit","iso639-1":null},"Siouan languages":{"name":"Siouan languages","names":["Siouan languages"],"iso639-2":"sio","iso639-1":null},"Skolt Sami":{"name":"Skolt Sami","names":["Skolt Sami"],"iso639-2":"sms","iso639-1":null},"Slave (Athapascan)":{"name":"Slave (Athapascan)","names":["Slave (Athapascan)"],"iso639-2":"den","iso639-1":null},"Slavic languages":{"name":"Slavic languages","names":["Slavic languages"],"iso639-2":"sla","iso639-1":null},"Slovak":{"name":"Slovak","names":["Slovak"],"iso639-2":"slo/slk","iso639-1":"sk"},"Slovenian":{"name":"Slovenian","names":["Slovenian"],"iso639-2":"slv","iso639-1":"sl"},"Sogdian":{"name":"Sogdian","names":["Sogdian"],"iso639-2":"sog","iso639-1":null},"Somali":{"name":"Somali","names":["Somali"],"iso639-2":"som","iso639-1":"so"},"Songhai languages":{"name":"Songhai languages","names":["Songhai languages"],"iso639-2":"son","iso639-1":null},"Soninke":{"name":"Soninke","names":["Soninke"],"iso639-2":"snk","iso639-1":null},"Sorbian languages":{"name":"Sorbian languages","names":["Sorbian languages"],"iso639-2":"wen","iso639-1":null},"Sotho, Northern":{"name":"Sotho, Northern","names":["Pedi","Sepedi","Northern Sotho"],"iso639-2":"nso","iso639-1":null},"Sotho, Southern":{"name":"Sotho, Southern","names":["Sotho, Southern"],"iso639-2":"sot","iso639-1":"st"},"South American Indian languages":{"name":"South American Indian languages","names":["South American Indian languages"],"iso639-2":"sai","iso639-1":null},"South Ndebele":{"name":"South Ndebele","names":["Ndebele, South","South Ndebele"],"iso639-2":"nbl","iso639-1":"nr"},"Southern Altai":{"name":"Southern Altai","names":["Southern Altai"],"iso639-2":"alt","iso639-1":null},"Southern Sami":{"name":"Southern Sami","names":["Southern Sami"],"iso639-2":"sma","iso639-1":null},"Spanish":{"name":"Spanish","names":["Spanish","Castilian"],"iso639-2":"spa","iso639-1":"es"},"Sranan Tongo":{"name":"Sranan Tongo","names":["Sranan Tongo"],"iso639-2":"srn","iso639-1":null},"Standard Moroccan Tamazight":{"name":"Standard Moroccan Tamazight","names":["Standard Moroccan Tamazight"],"iso639-2":"zgh","iso639-1":null},"Sukuma":{"name":"Sukuma","names":["Sukuma"],"iso639-2":"suk","iso639-1":null},"Sumerian":{"name":"Sumerian","names":["Sumerian"],"iso639-2":"sux","iso639-1":null},"Sundanese":{"name":"Sundanese","names":["Sundanese"],"iso639-2":"sun","iso639-1":"su"},"Susu":{"name":"Susu","names":["Susu"],"iso639-2":"sus","iso639-1":null},"Swahili":{"name":"Swahili","names":["Swahili"],"iso639-2":"swa","iso639-1":"sw"},"Swati":{"name":"Swati","names":["Swati"],"iso639-2":"ssw","iso639-1":"ss"},"Swedish":{"name":"Swedish","names":["Swedish"],"iso639-2":"swe","iso639-1":"sv"},"Swiss German":{"name":"Swiss German","names":["Swiss German","Alemannic","Alsatian"],"iso639-2":"gsw","iso639-1":null},"Syriac":{"name":"Syriac","names":["Syriac"],"iso639-2":"syr","iso639-1":null},"Tagalog":{"name":"Tagalog","names":["Tagalog"],"iso639-2":"tgl","iso639-1":"tl"},"Tahitian":{"name":"Tahitian","names":["Tahitian"],"iso639-2":"tah","iso639-1":"ty"},"Tai languages":{"name":"Tai languages","names":["Tai languages"],"iso639-2":"tai","iso639-1":null},"Tajik":{"name":"Tajik","names":["Tajik"],"iso639-2":"tgk","iso639-1":"tg"},"Tamashek":{"name":"Tamashek","names":["Tamashek"],"iso639-2":"tmh","iso639-1":null},"Tamil":{"name":"Tamil","names":["Tamil"],"iso639-2":"tam","iso639-1":"ta"},"Tatar":{"name":"Tatar","names":["Tatar"],"iso639-2":"tat","iso639-1":"tt"},"Telugu":{"name":"Telugu","names":["Telugu"],"iso639-2":"tel","iso639-1":"te"},"Tereno":{"name":"Tereno","names":["Tereno"],"iso639-2":"ter","iso639-1":null},"Tetum":{"name":"Tetum","names":["Tetum"],"iso639-2":"tet","iso639-1":null},"Thai":{"name":"Thai","names":["Thai"],"iso639-2":"tha","iso639-1":"th"},"Tibetan":{"name":"Tibetan","names":["Tibetan"],"iso639-2":"tib/bod","iso639-1":"bo"},"Tigre":{"name":"Tigre","names":["Tigre"],"iso639-2":"tig","iso639-1":null},"Tigrinya":{"name":"Tigrinya","names":["Tigrinya"],"iso639-2":"tir","iso639-1":"ti"},"Timne":{"name":"Timne","names":["Timne"],"iso639-2":"tem","iso639-1":null},"Tiv":{"name":"Tiv","names":["Tiv"],"iso639-2":"tiv","iso639-1":null},"tlhIngan-Hol":{"name":"tlhIngan-Hol","names":["Klingon","tlhIngan-Hol"],"iso639-2":"tlh","iso639-1":null},"Tlingit":{"name":"Tlingit","names":["Tlingit"],"iso639-2":"tli","iso639-1":null},"Tok Pisin":{"name":"Tok Pisin","names":["Tok Pisin"],"iso639-2":"tpi","iso639-1":null},"Tokelau":{"name":"Tokelau","names":["Tokelau"],"iso639-2":"tkl","iso639-1":null},"Tonga (Nyasa)":{"name":"Tonga (Nyasa)","names":["Tonga (Nyasa)"],"iso639-2":"tog","iso639-1":null},"Tonga (Tonga Islands)":{"name":"Tonga (Tonga Islands)","names":["Tonga (Tonga Islands)"],"iso639-2":"ton","iso639-1":"to"},"Tsimshian":{"name":"Tsimshian","names":["Tsimshian"],"iso639-2":"tsi","iso639-1":null},"Tsonga":{"name":"Tsonga","names":["Tsonga"],"iso639-2":"tso","iso639-1":"ts"},"Tswana":{"name":"Tswana","names":["Tswana"],"iso639-2":"tsn","iso639-1":"tn"},"Tumbuka":{"name":"Tumbuka","names":["Tumbuka"],"iso639-2":"tum","iso639-1":null},"Tupi languages":{"name":"Tupi languages","names":["Tupi languages"],"iso639-2":"tup","iso639-1":null},"Turkish":{"name":"Turkish","names":["Turkish"],"iso639-2":"tur","iso639-1":"tr"},"Turkish, Ottoman (1500-1928)":{"name":"Turkish, Ottoman (1500-1928)","names":["Turkish, Ottoman (1500-1928)"],"iso639-2":"ota","iso639-1":null},"Turkmen":{"name":"Turkmen","names":["Turkmen"],"iso639-2":"tuk","iso639-1":"tk"},"Tuvalu":{"name":"Tuvalu","names":["Tuvalu"],"iso639-2":"tvl","iso639-1":null},"Tuvinian":{"name":"Tuvinian","names":["Tuvinian"],"iso639-2":"tyv","iso639-1":null},"Twi":{"name":"Twi","names":["Twi"],"iso639-2":"twi","iso639-1":"tw"},"Udmurt":{"name":"Udmurt","names":["Udmurt"],"iso639-2":"udm","iso639-1":null},"Ugaritic":{"name":"Ugaritic","names":["Ugaritic"],"iso639-2":"uga","iso639-1":null},"Uighur":{"name":"Uighur","names":["Uighur","Uyghur"],"iso639-2":"uig","iso639-1":"ug"},"Ukrainian":{"name":"Ukrainian","names":["Ukrainian"],"iso639-2":"ukr","iso639-1":"uk"},"Umbundu":{"name":"Umbundu","names":["Umbundu"],"iso639-2":"umb","iso639-1":null},"Uncoded languages":{"name":"Uncoded languages","names":["Uncoded languages"],"iso639-2":"mis","iso639-1":null},"Undetermined":{"name":"Undetermined","names":["Undetermined"],"iso639-2":"und","iso639-1":null},"Upper Sorbian":{"name":"Upper Sorbian","names":["Upper Sorbian"],"iso639-2":"hsb","iso639-1":null},"Urdu":{"name":"Urdu","names":["Urdu"],"iso639-2":"urd","iso639-1":"ur"},"Uyghur":{"name":"Uyghur","names":["Uighur","Uyghur"],"iso639-2":"uig","iso639-1":"ug"},"Uzbek":{"name":"Uzbek","names":["Uzbek"],"iso639-2":"uzb","iso639-1":"uz"},"Vai":{"name":"Vai","names":["Vai"],"iso639-2":"vai","iso639-1":null},"Valencian":{"name":"Valencian","names":["Catalan","Valencian"],"iso639-2":"cat","iso639-1":"ca"},"Venda":{"name":"Venda","names":["Venda"],"iso639-2":"ven","iso639-1":"ve"},"Vietnamese":{"name":"Vietnamese","names":["Vietnamese"],"iso639-2":"vie","iso639-1":"vi"},"Volapük":{"name":"Volapük","names":["Volapük"],"iso639-2":"vol","iso639-1":"vo"},"Votic":{"name":"Votic","names":["Votic"],"iso639-2":"vot","iso639-1":null},"Wakashan languages":{"name":"Wakashan languages","names":["Wakashan languages"],"iso639-2":"wak","iso639-1":null},"Walloon":{"name":"Walloon","names":["Walloon"],"iso639-2":"wln","iso639-1":"wa"},"Waray":{"name":"Waray","names":["Waray"],"iso639-2":"war","iso639-1":null},"Washo":{"name":"Washo","names":["Washo"],"iso639-2":"was","iso639-1":null},"Welsh":{"name":"Welsh","names":["Welsh"],"iso639-2":"wel/cym","iso639-1":"cy"},"Western Frisian":{"name":"Western Frisian","names":["Western Frisian"],"iso639-2":"fry","iso639-1":"fy"},"Western Pahari languages":{"name":"Western Pahari languages","names":["Himachali languages","Western Pahari languages"],"iso639-2":"him","iso639-1":null},"Wolaitta":{"name":"Wolaitta","names":["Wolaitta","Wolaytta"],"iso639-2":"wal","iso639-1":null},"Wolaytta":{"name":"Wolaytta","names":["Wolaitta","Wolaytta"],"iso639-2":"wal","iso639-1":null},"Wolof":{"name":"Wolof","names":["Wolof"],"iso639-2":"wol","iso639-1":"wo"},"Xhosa":{"name":"Xhosa","names":["Xhosa"],"iso639-2":"xho","iso639-1":"xh"},"Yakut":{"name":"Yakut","names":["Yakut"],"iso639-2":"sah","iso639-1":null},"Yao":{"name":"Yao","names":["Yao"],"iso639-2":"yao","iso639-1":null},"Yapese":{"name":"Yapese","names":["Yapese"],"iso639-2":"yap","iso639-1":null},"Yiddish":{"name":"Yiddish","names":["Yiddish"],"iso639-2":"yid","iso639-1":"yi"},"Yoruba":{"name":"Yoruba","names":["Yoruba"],"iso639-2":"yor","iso639-1":"yo"},"Yupik languages":{"name":"Yupik languages","names":["Yupik languages"],"iso639-2":"ypk","iso639-1":null},"Zande languages":{"name":"Zande languages","names":["Zande languages"],"iso639-2":"znd","iso639-1":null},"Zapotec":{"name":"Zapotec","names":["Zapotec"],"iso639-2":"zap","iso639-1":null},"Zaza":{"name":"Zaza","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Zazaki":{"name":"Zazaki","names":["Zaza","Dimili","Dimli","Kirdki","Kirmanjki","Zazaki"],"iso639-2":"zza","iso639-1":null},"Zenaga":{"name":"Zenaga","names":["Zenaga"],"iso639-2":"zen","iso639-1":null},"Zhuang":{"name":"Zhuang","names":["Zhuang","Chuang"],"iso639-2":"zha","iso639-1":"za"},"Zulu":{"name":"Zulu","names":["Zulu"],"iso639-2":"zul","iso639-1":"zu"},"Zuni":{"name":"Zuni","names":["Zuni"],"iso639-2":"zun","iso639-1":null}};

/***/ }),

/***/ 621:
/***/ (function(module) {

"use strict";

module.exports = balanced;
function balanced(a, b, str) {
  if (a instanceof RegExp) a = maybeMatch(a, str);
  if (b instanceof RegExp) b = maybeMatch(b, str);

  var r = range(a, b, str);

  return r && {
    start: r[0],
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + a.length, r[1]),
    post: str.slice(r[1] + b.length)
  };
}

function maybeMatch(reg, str) {
  var m = str.match(reg);
  return m ? m[0] : null;
}

balanced.range = range;
function range(a, b, str) {
  var begs, beg, left, right, result;
  var ai = str.indexOf(a);
  var bi = str.indexOf(b, ai + 1);
  var i = ai;

  if (ai >= 0 && bi > 0) {
    begs = [];
    left = str.length;

    while (i >= 0 && !result) {
      if (i == ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length == 1) {
        result = [ begs.pop(), bi ];
      } else {
        beg = begs.pop();
        if (beg < left) {
          left = beg;
          right = bi;
        }

        bi = str.indexOf(b, i + 1);
      }

      i = ai < bi && ai >= 0 ? ai : bi;
    }

    if (begs.length) {
      result = [ left, right ];
    }
  }

  return result;
}


/***/ }),

/***/ 622:
/***/ (function(module) {

module.exports = require("path");

/***/ }),

/***/ 628:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function default_1(from, to, events) {
    const fns = {};
    for (const event of events) {
        fns[event] = (...args) => {
            to.emit(event, ...args);
        };
        from.on(event, fns[event]);
    }
    return () => {
        for (const event of events) {
            from.off(event, fns[event]);
        }
    };
}
exports.default = default_1;


/***/ }),

/***/ 631:
/***/ (function(module) {

module.exports = require("net");

/***/ }),

/***/ 658:
/***/ (function(module, __unusedexports, __webpack_require__) {

module.exports = globSync
globSync.GlobSync = GlobSync

var fs = __webpack_require__(747)
var rp = __webpack_require__(302)
var minimatch = __webpack_require__(93)
var Minimatch = minimatch.Minimatch
var Glob = __webpack_require__(402).Glob
var util = __webpack_require__(669)
var path = __webpack_require__(622)
var assert = __webpack_require__(357)
var isAbsolute = __webpack_require__(681)
var common = __webpack_require__(856)
var alphasort = common.alphasort
var alphasorti = common.alphasorti
var setopts = common.setopts
var ownProp = common.ownProp
var childrenIgnored = common.childrenIgnored
var isIgnored = common.isIgnored

function globSync (pattern, options) {
  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  return new GlobSync(pattern, options).found
}

function GlobSync (pattern, options) {
  if (!pattern)
    throw new Error('must provide pattern')

  if (typeof options === 'function' || arguments.length === 3)
    throw new TypeError('callback provided to sync glob\n'+
                        'See: https://github.com/isaacs/node-glob/issues/167')

  if (!(this instanceof GlobSync))
    return new GlobSync(pattern, options)

  setopts(this, pattern, options)

  if (this.noprocess)
    return this

  var n = this.minimatch.set.length
  this.matches = new Array(n)
  for (var i = 0; i < n; i ++) {
    this._process(this.minimatch.set[i], i, false)
  }
  this._finish()
}

GlobSync.prototype._finish = function () {
  assert(this instanceof GlobSync)
  if (this.realpath) {
    var self = this
    this.matches.forEach(function (matchset, index) {
      var set = self.matches[index] = Object.create(null)
      for (var p in matchset) {
        try {
          p = self._makeAbs(p)
          var real = rp.realpathSync(p, self.realpathCache)
          set[real] = true
        } catch (er) {
          if (er.syscall === 'stat')
            set[self._makeAbs(p)] = true
          else
            throw er
        }
      }
    })
  }
  common.finish(this)
}


GlobSync.prototype._process = function (pattern, index, inGlobStar) {
  assert(this instanceof GlobSync)

  // Get the first [n] parts of pattern that are all strings.
  var n = 0
  while (typeof pattern[n] === 'string') {
    n ++
  }
  // now n is the index of the first one that is *not* a string.

  // See if there's anything else
  var prefix
  switch (n) {
    // if not, then this is rather simple
    case pattern.length:
      this._processSimple(pattern.join('/'), index)
      return

    case 0:
      // pattern *starts* with some non-trivial item.
      // going to readdir(cwd), but not include the prefix in matches.
      prefix = null
      break

    default:
      // pattern has some string bits in the front.
      // whatever it starts with, whether that's 'absolute' like /foo/bar,
      // or 'relative' like '../baz'
      prefix = pattern.slice(0, n).join('/')
      break
  }

  var remain = pattern.slice(n)

  // get the list of entries.
  var read
  if (prefix === null)
    read = '.'
  else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
    if (!prefix || !isAbsolute(prefix))
      prefix = '/' + prefix
    read = prefix
  } else
    read = prefix

  var abs = this._makeAbs(read)

  //if ignored, skip processing
  if (childrenIgnored(this, read))
    return

  var isGlobStar = remain[0] === minimatch.GLOBSTAR
  if (isGlobStar)
    this._processGlobStar(prefix, read, abs, remain, index, inGlobStar)
  else
    this._processReaddir(prefix, read, abs, remain, index, inGlobStar)
}


GlobSync.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
  var entries = this._readdir(abs, inGlobStar)

  // if the abs isn't a dir, then nothing can match!
  if (!entries)
    return

  // It will only match dot entries if it starts with a dot, or if
  // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
  var pn = remain[0]
  var negate = !!this.minimatch.negate
  var rawGlob = pn._glob
  var dotOk = this.dot || rawGlob.charAt(0) === '.'

  var matchedEntries = []
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i]
    if (e.charAt(0) !== '.' || dotOk) {
      var m
      if (negate && !prefix) {
        m = !e.match(pn)
      } else {
        m = e.match(pn)
      }
      if (m)
        matchedEntries.push(e)
    }
  }

  var len = matchedEntries.length
  // If there are no matched entries, then nothing matches.
  if (len === 0)
    return

  // if this is the last remaining pattern bit, then no need for
  // an additional stat *unless* the user has specified mark or
  // stat explicitly.  We know they exist, since readdir returned
  // them.

  if (remain.length === 1 && !this.mark && !this.stat) {
    if (!this.matches[index])
      this.matches[index] = Object.create(null)

    for (var i = 0; i < len; i ++) {
      var e = matchedEntries[i]
      if (prefix) {
        if (prefix.slice(-1) !== '/')
          e = prefix + '/' + e
        else
          e = prefix + e
      }

      if (e.charAt(0) === '/' && !this.nomount) {
        e = path.join(this.root, e)
      }
      this._emitMatch(index, e)
    }
    // This was the last one, and no stats were needed
    return
  }

  // now test all matched entries as stand-ins for that part
  // of the pattern.
  remain.shift()
  for (var i = 0; i < len; i ++) {
    var e = matchedEntries[i]
    var newPattern
    if (prefix)
      newPattern = [prefix, e]
    else
      newPattern = [e]
    this._process(newPattern.concat(remain), index, inGlobStar)
  }
}


GlobSync.prototype._emitMatch = function (index, e) {
  if (isIgnored(this, e))
    return

  var abs = this._makeAbs(e)

  if (this.mark)
    e = this._mark(e)

  if (this.absolute) {
    e = abs
  }

  if (this.matches[index][e])
    return

  if (this.nodir) {
    var c = this.cache[abs]
    if (c === 'DIR' || Array.isArray(c))
      return
  }

  this.matches[index][e] = true

  if (this.stat)
    this._stat(e)
}


GlobSync.prototype._readdirInGlobStar = function (abs) {
  // follow all symlinked directories forever
  // just proceed as if this is a non-globstar situation
  if (this.follow)
    return this._readdir(abs, false)

  var entries
  var lstat
  var stat
  try {
    lstat = fs.lstatSync(abs)
  } catch (er) {
    if (er.code === 'ENOENT') {
      // lstat failed, doesn't exist
      return null
    }
  }

  var isSym = lstat && lstat.isSymbolicLink()
  this.symlinks[abs] = isSym

  // If it's not a symlink or a dir, then it's definitely a regular file.
  // don't bother doing a readdir in that case.
  if (!isSym && lstat && !lstat.isDirectory())
    this.cache[abs] = 'FILE'
  else
    entries = this._readdir(abs, false)

  return entries
}

GlobSync.prototype._readdir = function (abs, inGlobStar) {
  var entries

  if (inGlobStar && !ownProp(this.symlinks, abs))
    return this._readdirInGlobStar(abs)

  if (ownProp(this.cache, abs)) {
    var c = this.cache[abs]
    if (!c || c === 'FILE')
      return null

    if (Array.isArray(c))
      return c
  }

  try {
    return this._readdirEntries(abs, fs.readdirSync(abs))
  } catch (er) {
    this._readdirError(abs, er)
    return null
  }
}

GlobSync.prototype._readdirEntries = function (abs, entries) {
  // if we haven't asked to stat everything, then just
  // assume that everything in there exists, so we can avoid
  // having to stat it a second time.
  if (!this.mark && !this.stat) {
    for (var i = 0; i < entries.length; i ++) {
      var e = entries[i]
      if (abs === '/')
        e = abs + e
      else
        e = abs + '/' + e
      this.cache[e] = true
    }
  }

  this.cache[abs] = entries

  // mark and cache dir-ness
  return entries
}

GlobSync.prototype._readdirError = function (f, er) {
  // handle errors, and cache the information
  switch (er.code) {
    case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
    case 'ENOTDIR': // totally normal. means it *does* exist.
      var abs = this._makeAbs(f)
      this.cache[abs] = 'FILE'
      if (abs === this.cwdAbs) {
        var error = new Error(er.code + ' invalid cwd ' + this.cwd)
        error.path = this.cwd
        error.code = er.code
        throw error
      }
      break

    case 'ENOENT': // not terribly unusual
    case 'ELOOP':
    case 'ENAMETOOLONG':
    case 'UNKNOWN':
      this.cache[this._makeAbs(f)] = false
      break

    default: // some unusual error.  Treat as failure.
      this.cache[this._makeAbs(f)] = false
      if (this.strict)
        throw er
      if (!this.silent)
        console.error('glob error', er)
      break
  }
}

GlobSync.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

  var entries = this._readdir(abs, inGlobStar)

  // no entries means not a dir, so it can never have matches
  // foo.txt/** doesn't match foo.txt
  if (!entries)
    return

  // test without the globstar, and with every child both below
  // and replacing the globstar.
  var remainWithoutGlobStar = remain.slice(1)
  var gspref = prefix ? [ prefix ] : []
  var noGlobStar = gspref.concat(remainWithoutGlobStar)

  // the noGlobStar pattern exits the inGlobStar state
  this._process(noGlobStar, index, false)

  var len = entries.length
  var isSym = this.symlinks[abs]

  // If it's a symlink, and we're in a globstar, then stop
  if (isSym && inGlobStar)
    return

  for (var i = 0; i < len; i++) {
    var e = entries[i]
    if (e.charAt(0) === '.' && !this.dot)
      continue

    // these two cases enter the inGlobStar state
    var instead = gspref.concat(entries[i], remainWithoutGlobStar)
    this._process(instead, index, true)

    var below = gspref.concat(entries[i], remain)
    this._process(below, index, true)
  }
}

GlobSync.prototype._processSimple = function (prefix, index) {
  // XXX review this.  Shouldn't it be doing the mounting etc
  // before doing stat?  kinda weird?
  var exists = this._stat(prefix)

  if (!this.matches[index])
    this.matches[index] = Object.create(null)

  // If it doesn't exist, then just mark the lack of results
  if (!exists)
    return

  if (prefix && isAbsolute(prefix) && !this.nomount) {
    var trail = /[\/\\]$/.test(prefix)
    if (prefix.charAt(0) === '/') {
      prefix = path.join(this.root, prefix)
    } else {
      prefix = path.resolve(this.root, prefix)
      if (trail)
        prefix += '/'
    }
  }

  if (process.platform === 'win32')
    prefix = prefix.replace(/\\/g, '/')

  // Mark this as a match
  this._emitMatch(index, prefix)
}

// Returns either 'DIR', 'FILE', or false
GlobSync.prototype._stat = function (f) {
  var abs = this._makeAbs(f)
  var needDir = f.slice(-1) === '/'

  if (f.length > this.maxLength)
    return false

  if (!this.stat && ownProp(this.cache, abs)) {
    var c = this.cache[abs]

    if (Array.isArray(c))
      c = 'DIR'

    // It exists, but maybe not how we need it
    if (!needDir || c === 'DIR')
      return c

    if (needDir && c === 'FILE')
      return false

    // otherwise we have to stat, because maybe c=true
    // if we know it exists, but not what it is.
  }

  var exists
  var stat = this.statCache[abs]
  if (!stat) {
    var lstat
    try {
      lstat = fs.lstatSync(abs)
    } catch (er) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false
        return false
      }
    }

    if (lstat && lstat.isSymbolicLink()) {
      try {
        stat = fs.statSync(abs)
      } catch (er) {
        stat = lstat
      }
    } else {
      stat = lstat
    }
  }

  this.statCache[abs] = stat

  var c = true
  if (stat)
    c = stat.isDirectory() ? 'DIR' : 'FILE'

  this.cache[abs] = this.cache[abs] || c

  if (needDir && c === 'FILE')
    return false

  return c
}

GlobSync.prototype._mark = function (p) {
  return common.mark(this, p)
}

GlobSync.prototype._makeAbs = function (f) {
  return common.makeAbs(this, f)
}


/***/ }),

/***/ 661:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('mkdir', _mkdir, {
  cmdOptions: {
    'p': 'fullpath',
  },
});

// Recursively creates `dir`
function mkdirSyncRecursive(dir) {
  var baseDir = path.dirname(dir);

  // Prevents some potential problems arising from malformed UNCs or
  // insufficient permissions.
  /* istanbul ignore next */
  if (baseDir === dir) {
    common.error('dirname() failed: [' + dir + ']');
  }

  // Base dir exists, no recursion necessary
  if (fs.existsSync(baseDir)) {
    fs.mkdirSync(dir, parseInt('0777', 8));
    return;
  }

  // Base dir does not exist, go recursive
  mkdirSyncRecursive(baseDir);

  // Base dir created, can create dir
  fs.mkdirSync(dir, parseInt('0777', 8));
}

//@
//@ ### mkdir([options,] dir [, dir ...])
//@ ### mkdir([options,] dir_array)
//@
//@ Available options:
//@
//@ + `-p`: full path (and create intermediate directories, if necessary)
//@
//@ Examples:
//@
//@ ```javascript
//@ mkdir('-p', '/tmp/a/b/c/d', '/tmp/e/f/g');
//@ mkdir('-p', ['/tmp/a/b/c/d', '/tmp/e/f/g']); // same as above
//@ ```
//@
//@ Creates directories.
function _mkdir(options, dirs) {
  if (!dirs) common.error('no paths given');

  if (typeof dirs === 'string') {
    dirs = [].slice.call(arguments, 1);
  }
  // if it's array leave it as it is

  dirs.forEach(function (dir) {
    try {
      var stat = common.statNoFollowLinks(dir);
      if (!options.fullpath) {
        common.error('path already exists: ' + dir, { continue: true });
      } else if (stat.isFile()) {
        common.error('cannot create directory ' + dir + ': File exists', { continue: true });
      }
      return; // skip dir
    } catch (e) {
      // do nothing
    }

    // Base dir does not exist, and no -p option given
    var baseDir = path.dirname(dir);
    if (!fs.existsSync(baseDir) && !options.fullpath) {
      common.error('no such file or directory: ' + baseDir, { continue: true });
      return; // skip dir
    }

    try {
      if (options.fullpath) {
        mkdirSyncRecursive(path.resolve(dir));
      } else {
        fs.mkdirSync(dir, parseInt('0777', 8));
      }
    } catch (e) {
      var reason;
      if (e.code === 'EACCES') {
        reason = 'Permission denied';
      } else if (e.code === 'ENOTDIR' || e.code === 'ENOENT') {
        reason = 'Not a directory';
      } else {
        /* istanbul ignore next */
        throw e;
      }
      common.error('cannot create directory ' + dir + ': ' + reason, { continue: true });
    }
  });
  return '';
} // mkdir
module.exports = _mkdir;


/***/ }),

/***/ 669:
/***/ (function(module) {

module.exports = require("util");

/***/ }),

/***/ 674:
/***/ (function(module, __unusedexports, __webpack_require__) {

var wrappy = __webpack_require__(11)
var reqs = Object.create(null)
var once = __webpack_require__(49)

module.exports = wrappy(inflight)

function inflight (key, cb) {
  if (reqs[key]) {
    reqs[key].push(cb)
    return null
  } else {
    reqs[key] = [cb]
    return makeres(key)
  }
}

function makeres (key) {
  return once(function RES () {
    var cbs = reqs[key]
    var len = cbs.length
    var args = slice(arguments)

    // XXX It's somewhat ambiguous whether a new callback added in this
    // pass should be queued for later execution if something in the
    // list of callbacks throws, or if it should just be discarded.
    // However, it's such an edge case that it hardly matters, and either
    // choice is likely as surprising as the other.
    // As it happens, we do go ahead and schedule it for later execution.
    try {
      for (var i = 0; i < len; i++) {
        cbs[i].apply(null, args)
      }
    } finally {
      if (cbs.length > len) {
        // added more in the interim.
        // de-zalgo, just in case, but don't call again.
        cbs.splice(0, len)
        process.nextTick(function () {
          RES.apply(null, args)
        })
      } else {
        delete reqs[key]
      }
    }
  })
}

function slice (args) {
  var length = args.length
  var array = []

  for (var i = 0; i < length; i++) array[i] = args[i]
  return array
}


/***/ }),

/***/ 681:
/***/ (function(module) {

"use strict";


function posix(path) {
	return path.charAt(0) === '/';
}

function win32(path) {
	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
	var result = splitDeviceRe.exec(path);
	var device = result[1] || '';
	var isUnc = Boolean(device && device.charAt(1) !== ':');

	// UNC paths are always absolute
	return Boolean(result[2] || isUnc);
}

module.exports = process.platform === 'win32' ? win32 : posix;
module.exports.posix = posix;
module.exports.win32 = win32;


/***/ }),

/***/ 685:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/

;(function(root, factory) {

  // Support CommonJS
  if (true) {
    var randomColor = factory();

    // Support NodeJS & Component, which allow module.exports to be a function
    if ( true && module && module.exports) {
      exports = module.exports = randomColor;
    }

    // Support CommonJS 1.1.1 spec
    exports.randomColor = randomColor;

  // Support AMD
  } else {}

}(this, function() {

  // Seed to get repeatable colors
  var seed = null;

  // Shared color dictionary
  var colorDictionary = {};

  // Populate the color dictionary
  loadColorBounds();

  // check if a range is taken
  var colorRanges = [];

  var randomColor = function (options) {

    options = options || {};

    // Check if there is a seed and ensure it's an
    // integer. Otherwise, reset the seed value.
    if (options.seed !== undefined && options.seed !== null && options.seed === parseInt(options.seed, 10)) {
      seed = options.seed;

    // A string was passed as a seed
    } else if (typeof options.seed === 'string') {
      seed = stringToInteger(options.seed);

    // Something was passed as a seed but it wasn't an integer or string
    } else if (options.seed !== undefined && options.seed !== null) {
      throw new TypeError('The seed value must be an integer or string');

    // No seed, reset the value outside.
    } else {
      seed = null;
    }

    var H,S,B;

    // Check if we need to generate multiple colors
    if (options.count !== null && options.count !== undefined) {

      var totalColors = options.count,
          colors = [];
      // Value false at index i means the range i is not taken yet.
      for (var i = 0; i < options.count; i++) {
        colorRanges.push(false)
        }
      options.count = null;

      while (totalColors > colors.length) {

        var color = randomColor(options);

        if (seed !== null) {
          options.seed = seed;
        }

        colors.push(color);
      }

      options.count = totalColors;

      return colors;
    }

    // First we pick a hue (H)
    H = pickHue(options);

    // Then use H to determine saturation (S)
    S = pickSaturation(H, options);

    // Then use S and H to determine brightness (B).
    B = pickBrightness(H, S, options);

    // Then we return the HSB color in the desired format
    return setFormat([H,S,B], options);
  };

  function pickHue(options) {
    if (colorRanges.length > 0) {
      var hueRange = getRealHueRange(options.hue)

      var hue = randomWithin(hueRange)

      //Each of colorRanges.length ranges has a length equal approximatelly one step
      var step = (hueRange[1] - hueRange[0]) / colorRanges.length

      var j = parseInt((hue - hueRange[0]) / step)

      //Check if the range j is taken
      if (colorRanges[j] === true) {
        j = (j + 2) % colorRanges.length
      }
      else {
        colorRanges[j] = true
           }

      var min = (hueRange[0] + j * step) % 359,
          max = (hueRange[0] + (j + 1) * step) % 359;

      hueRange = [min, max]

      hue = randomWithin(hueRange)

      if (hue < 0) {hue = 360 + hue;}
      return hue
    }
    else {
      var hueRange = getHueRange(options.hue)

      hue = randomWithin(hueRange);
      // Instead of storing red as two seperate ranges,
      // we group them, using negative numbers
      if (hue < 0) {
        hue = 360 + hue;
      }

      return hue;
    }
  }

  function pickSaturation (hue, options) {

    if (options.hue === 'monochrome') {
      return 0;
    }

    if (options.luminosity === 'random') {
      return randomWithin([0,100]);
    }

    var saturationRange = getSaturationRange(hue);

    var sMin = saturationRange[0],
        sMax = saturationRange[1];

    switch (options.luminosity) {

      case 'bright':
        sMin = 55;
        break;

      case 'dark':
        sMin = sMax - 10;
        break;

      case 'light':
        sMax = 55;
        break;
   }

    return randomWithin([sMin, sMax]);

  }

  function pickBrightness (H, S, options) {

    var bMin = getMinimumBrightness(H, S),
        bMax = 100;

    switch (options.luminosity) {

      case 'dark':
        bMax = bMin + 20;
        break;

      case 'light':
        bMin = (bMax + bMin)/2;
        break;

      case 'random':
        bMin = 0;
        bMax = 100;
        break;
    }

    return randomWithin([bMin, bMax]);
  }

  function setFormat (hsv, options) {

    switch (options.format) {

      case 'hsvArray':
        return hsv;

      case 'hslArray':
        return HSVtoHSL(hsv);

      case 'hsl':
        var hsl = HSVtoHSL(hsv);
        return 'hsl('+hsl[0]+', '+hsl[1]+'%, '+hsl[2]+'%)';

      case 'hsla':
        var hslColor = HSVtoHSL(hsv);
        var alpha = options.alpha || Math.random();
        return 'hsla('+hslColor[0]+', '+hslColor[1]+'%, '+hslColor[2]+'%, ' + alpha + ')';

      case 'rgbArray':
        return HSVtoRGB(hsv);

      case 'rgb':
        var rgb = HSVtoRGB(hsv);
        return 'rgb(' + rgb.join(', ') + ')';

      case 'rgba':
        var rgbColor = HSVtoRGB(hsv);
        var alpha = options.alpha || Math.random();
        return 'rgba(' + rgbColor.join(', ') + ', ' + alpha + ')';

      default:
        return HSVtoHex(hsv);
    }

  }

  function getMinimumBrightness(H, S) {

    var lowerBounds = getColorInfo(H).lowerBounds;

    for (var i = 0; i < lowerBounds.length - 1; i++) {

      var s1 = lowerBounds[i][0],
          v1 = lowerBounds[i][1];

      var s2 = lowerBounds[i+1][0],
          v2 = lowerBounds[i+1][1];

      if (S >= s1 && S <= s2) {

         var m = (v2 - v1)/(s2 - s1),
             b = v1 - m*s1;

         return m*S + b;
      }

    }

    return 0;
  }

  function getHueRange (colorInput) {

    if (typeof parseInt(colorInput) === 'number') {

      var number = parseInt(colorInput);

      if (number < 360 && number > 0) {
        return [number, number];
      }

    }

    if (typeof colorInput === 'string') {

      if (colorDictionary[colorInput]) {
        var color = colorDictionary[colorInput];
        if (color.hueRange) {return color.hueRange;}
      } else if (colorInput.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        var hue = HexToHSB(colorInput)[0];
        return [ hue, hue ];
      }
    }

    return [0,360];

  }

  function getSaturationRange (hue) {
    return getColorInfo(hue).saturationRange;
  }

  function getColorInfo (hue) {

    // Maps red colors to make picking hue easier
    if (hue >= 334 && hue <= 360) {
      hue-= 360;
    }

    for (var colorName in colorDictionary) {
       var color = colorDictionary[colorName];
       if (color.hueRange &&
           hue >= color.hueRange[0] &&
           hue <= color.hueRange[1]) {
          return colorDictionary[colorName];
       }
    } return 'Color not found';
  }

  function randomWithin (range) {
    if (seed === null) {
      //generate random evenly destinct number from : https://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
      var golden_ratio = 0.618033988749895
      var r=Math.random()
      r += golden_ratio
      r %= 1
      return Math.floor(range[0] + r*(range[1] + 1 - range[0]));
    } else {
      //Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
      var max = range[1] || 1;
      var min = range[0] || 0;
      seed = (seed * 9301 + 49297) % 233280;
      var rnd = seed / 233280.0;
      return Math.floor(min + rnd * (max - min));
}
  }

  function HSVtoHex (hsv){

    var rgb = HSVtoRGB(hsv);

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }

    var hex = '#' + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);

    return hex;

  }

  function defineColor (name, hueRange, lowerBounds) {

    var sMin = lowerBounds[0][0],
        sMax = lowerBounds[lowerBounds.length - 1][0],

        bMin = lowerBounds[lowerBounds.length - 1][1],
        bMax = lowerBounds[0][1];

    colorDictionary[name] = {
      hueRange: hueRange,
      lowerBounds: lowerBounds,
      saturationRange: [sMin, sMax],
      brightnessRange: [bMin, bMax]
    };

  }

  function loadColorBounds () {

    defineColor(
      'monochrome',
      null,
      [[0,0],[100,0]]
    );

    defineColor(
      'red',
      [-26,18],
      [[20,100],[30,92],[40,89],[50,85],[60,78],[70,70],[80,60],[90,55],[100,50]]
    );

    defineColor(
      'orange',
      [18,46],
      [[20,100],[30,93],[40,88],[50,86],[60,85],[70,70],[100,70]]
    );

    defineColor(
      'yellow',
      [46,62],
      [[25,100],[40,94],[50,89],[60,86],[70,84],[80,82],[90,80],[100,75]]
    );

    defineColor(
      'green',
      [62,178],
      [[30,100],[40,90],[50,85],[60,81],[70,74],[80,64],[90,50],[100,40]]
    );

    defineColor(
      'blue',
      [178, 257],
      [[20,100],[30,86],[40,80],[50,74],[60,60],[70,52],[80,44],[90,39],[100,35]]
    );

    defineColor(
      'purple',
      [257, 282],
      [[20,100],[30,87],[40,79],[50,70],[60,65],[70,59],[80,52],[90,45],[100,42]]
    );

    defineColor(
      'pink',
      [282, 334],
      [[20,100],[30,90],[40,86],[60,84],[80,80],[90,75],[100,73]]
    );

  }

  function HSVtoRGB (hsv) {

    // this doesn't work for the values of 0 and 360
    // here's the hacky fix
    var h = hsv[0];
    if (h === 0) {h = 1;}
    if (h === 360) {h = 359;}

    // Rebase the h,s,v values
    h = h/360;
    var s = hsv[1]/100,
        v = hsv[2]/100;

    var h_i = Math.floor(h*6),
      f = h * 6 - h_i,
      p = v * (1 - s),
      q = v * (1 - f*s),
      t = v * (1 - (1 - f)*s),
      r = 256,
      g = 256,
      b = 256;

    switch(h_i) {
      case 0: r = v; g = t; b = p;  break;
      case 1: r = q; g = v; b = p;  break;
      case 2: r = p; g = v; b = t;  break;
      case 3: r = p; g = q; b = v;  break;
      case 4: r = t; g = p; b = v;  break;
      case 5: r = v; g = p; b = q;  break;
    }

    var result = [Math.floor(r*255), Math.floor(g*255), Math.floor(b*255)];
    return result;
  }

  function HexToHSB (hex) {
    hex = hex.replace(/^#/, '');
    hex = hex.length === 3 ? hex.replace(/(.)/g, '$1$1') : hex;

    var red = parseInt(hex.substr(0, 2), 16) / 255,
          green = parseInt(hex.substr(2, 2), 16) / 255,
          blue = parseInt(hex.substr(4, 2), 16) / 255;

    var cMax = Math.max(red, green, blue),
          delta = cMax - Math.min(red, green, blue),
          saturation = cMax ? (delta / cMax) : 0;

    switch (cMax) {
      case red: return [ 60 * (((green - blue) / delta) % 6) || 0, saturation, cMax ];
      case green: return [ 60 * (((blue - red) / delta) + 2) || 0, saturation, cMax ];
      case blue: return [ 60 * (((red - green) / delta) + 4) || 0, saturation, cMax ];
    }
  }

  function HSVtoHSL (hsv) {
    var h = hsv[0],
      s = hsv[1]/100,
      v = hsv[2]/100,
      k = (2-s)*v;

    return [
      h,
      Math.round(s*v / (k<1 ? k : 2-k) * 10000) / 100,
      k/2 * 100
    ];
  }

  function stringToInteger (string) {
    var total = 0
    for (var i = 0; i !== string.length; i++) {
      if (total >= Number.MAX_SAFE_INTEGER) break;
      total += string.charCodeAt(i)
    }
    return total
  }

  // get The range of given hue when options.count!=0
  function getRealHueRange(colorHue)
  { if (!isNaN(colorHue)) {
    var number = parseInt(colorHue);

    if (number < 360 && number > 0) {
      return getColorInfo(colorHue).hueRange
    }
  }
    else if (typeof colorHue === 'string') {

      if (colorDictionary[colorHue]) {
        var color = colorDictionary[colorHue];

        if (color.hueRange) {
          return color.hueRange
       }
    } else if (colorHue.match(/^#?([0-9A-F]{3}|[0-9A-F]{6})$/i)) {
        var hue = HexToHSB(colorHue)[0]
        return getColorInfo(hue).hueRange
    }
  }

    return [0,360]
}
  return randomColor;
}));


/***/ }),

/***/ 689:
/***/ (function(module, __unusedexports, __webpack_require__) {

try {
  var util = __webpack_require__(669);
  /* istanbul ignore next */
  if (typeof util.inherits !== 'function') throw '';
  module.exports = util.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = __webpack_require__(315);
}


/***/ }),

/***/ 691:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);
var path = __webpack_require__(622);

common.register('which', _which, {
  allowGlobbing: false,
  cmdOptions: {
    'a': 'all',
  },
});

// XP's system default value for `PATHEXT` system variable, just in case it's not
// set on Windows.
var XP_DEFAULT_PATHEXT = '.com;.exe;.bat;.cmd;.vbs;.vbe;.js;.jse;.wsf;.wsh';

// For earlier versions of NodeJS that doesn't have a list of constants (< v6)
var FILE_EXECUTABLE_MODE = 1;

function isWindowsPlatform() {
  return process.platform === 'win32';
}

// Cross-platform method for splitting environment `PATH` variables
function splitPath(p) {
  return p ? p.split(path.delimiter) : [];
}

// Tests are running all cases for this func but it stays uncovered by codecov due to unknown reason
/* istanbul ignore next */
function isExecutable(pathName) {
  try {
    // TODO(node-support): replace with fs.constants.X_OK once remove support for node < v6
    fs.accessSync(pathName, FILE_EXECUTABLE_MODE);
  } catch (err) {
    return false;
  }
  return true;
}

function checkPath(pathName) {
  return fs.existsSync(pathName) && !common.statFollowLinks(pathName).isDirectory()
    && (isWindowsPlatform() || isExecutable(pathName));
}

//@
//@ ### which(command)
//@
//@ Examples:
//@
//@ ```javascript
//@ var nodeExec = which('node');
//@ ```
//@
//@ Searches for `command` in the system's `PATH`. On Windows, this uses the
//@ `PATHEXT` variable to append the extension if it's not already executable.
//@ Returns string containing the absolute path to `command`.
function _which(options, cmd) {
  if (!cmd) common.error('must specify command');

  var isWindows = isWindowsPlatform();
  var pathArray = splitPath(process.env.PATH);

  var queryMatches = [];

  // No relative/absolute paths provided?
  if (cmd.indexOf('/') === -1) {
    // Assume that there are no extensions to append to queries (this is the
    // case for unix)
    var pathExtArray = [''];
    if (isWindows) {
      // In case the PATHEXT variable is somehow not set (e.g.
      // child_process.spawn with an empty environment), use the XP default.
      var pathExtEnv = process.env.PATHEXT || XP_DEFAULT_PATHEXT;
      pathExtArray = splitPath(pathExtEnv.toUpperCase());
    }

    // Search for command in PATH
    for (var k = 0; k < pathArray.length; k++) {
      // already found it
      if (queryMatches.length > 0 && !options.all) break;

      var attempt = path.resolve(pathArray[k], cmd);

      if (isWindows) {
        attempt = attempt.toUpperCase();
      }

      var match = attempt.match(/\.[^<>:"/\|?*.]+$/);
      if (match && pathExtArray.indexOf(match[0]) >= 0) { // this is Windows-only
        // The user typed a query with the file extension, like
        // `which('node.exe')`
        if (checkPath(attempt)) {
          queryMatches.push(attempt);
          break;
        }
      } else { // All-platforms
        // Cycle through the PATHEXT array, and check each extension
        // Note: the array is always [''] on Unix
        for (var i = 0; i < pathExtArray.length; i++) {
          var ext = pathExtArray[i];
          var newAttempt = attempt + ext;
          if (checkPath(newAttempt)) {
            queryMatches.push(newAttempt);
            break;
          }
        }
      }
    }
  } else if (checkPath(cmd)) { // a valid absolute or relative path
    queryMatches.push(path.resolve(cmd));
  }

  if (queryMatches.length > 0) {
    return options.all ? queryMatches : queryMatches[0];
  }
  return options.all ? [] : null;
}
module.exports = _which;


/***/ }),

/***/ 692:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 693:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var _tempDir = __webpack_require__(953).tempDir;
var _pwd = __webpack_require__(359);
var path = __webpack_require__(622);
var fs = __webpack_require__(747);
var child = __webpack_require__(129);

var DEFAULT_MAXBUFFER_SIZE = 20 * 1024 * 1024;
var DEFAULT_ERROR_CODE = 1;

common.register('exec', _exec, {
  unix: false,
  canReceivePipe: true,
  wrapOutput: false,
});

// We use this function to run `exec` synchronously while also providing realtime
// output.
function execSync(cmd, opts, pipe) {
  if (!common.config.execPath) {
    common.error('Unable to find a path to the node binary. Please manually set config.execPath');
  }

  var tempDir = _tempDir();
  var paramsFile = path.resolve(tempDir + '/' + common.randomFileName());
  var stderrFile = path.resolve(tempDir + '/' + common.randomFileName());
  var stdoutFile = path.resolve(tempDir + '/' + common.randomFileName());

  opts = common.extend({
    silent: common.config.silent,
    cwd: _pwd().toString(),
    env: process.env,
    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
    encoding: 'utf8',
  }, opts);

  if (fs.existsSync(paramsFile)) common.unlinkSync(paramsFile);
  if (fs.existsSync(stderrFile)) common.unlinkSync(stderrFile);
  if (fs.existsSync(stdoutFile)) common.unlinkSync(stdoutFile);

  opts.cwd = path.resolve(opts.cwd);

  var paramsToSerialize = {
    command: cmd,
    execOptions: opts,
    pipe: pipe,
    stdoutFile: stdoutFile,
    stderrFile: stderrFile,
  };

  fs.writeFileSync(paramsFile, JSON.stringify(paramsToSerialize), 'utf8');

  var execArgs = [
    __webpack_require__.ab + "exec-child.js",
    paramsFile,
  ];

  /* istanbul ignore else */
  if (opts.silent) {
    opts.stdio = 'ignore';
  } else {
    opts.stdio = [0, 1, 2];
  }

  var code = 0;

  // Welcome to the future
  try {
    // Bad things if we pass in a `shell` option to child_process.execFileSync,
    // so we need to explicitly remove it here.
    delete opts.shell;

    child.execFileSync(common.config.execPath, execArgs, opts);
  } catch (e) {
    // Commands with non-zero exit code raise an exception.
    code = e.status || DEFAULT_ERROR_CODE;
  }

  // fs.readFileSync uses buffer encoding by default, so call
  // it without the encoding option if the encoding is 'buffer'.
  // Also, if the exec timeout is too short for node to start up,
  // the files will not be created, so these calls will throw.
  var stdout = '';
  var stderr = '';
  if (opts.encoding === 'buffer') {
    stdout = fs.readFileSync(stdoutFile);
    stderr = fs.readFileSync(stderrFile);
  } else {
    stdout = fs.readFileSync(stdoutFile, opts.encoding);
    stderr = fs.readFileSync(stderrFile, opts.encoding);
  }

  // No biggie if we can't erase the files now -- they're in a temp dir anyway
  try { common.unlinkSync(paramsFile); } catch (e) {}
  try { common.unlinkSync(stderrFile); } catch (e) {}
  try { common.unlinkSync(stdoutFile); } catch (e) {}

  if (code !== 0) {
    // Note: `silent` should be unconditionally true to avoid double-printing
    // the command's stderr, and to avoid printing any stderr when the user has
    // set `shell.config.silent`.
    common.error(stderr, code, { continue: true, silent: true });
  }
  var obj = common.ShellString(stdout, stderr, code);
  return obj;
} // execSync()

// Wrapper around exec() to enable echoing output to console in real time
function execAsync(cmd, opts, pipe, callback) {
  opts = common.extend({
    silent: common.config.silent,
    cwd: _pwd().toString(),
    env: process.env,
    maxBuffer: DEFAULT_MAXBUFFER_SIZE,
    encoding: 'utf8',
  }, opts);

  var c = child.exec(cmd, opts, function (err, stdout, stderr) {
    if (callback) {
      if (!err) {
        callback(0, stdout, stderr);
      } else if (err.code === undefined) {
        // See issue #536
        /* istanbul ignore next */
        callback(1, stdout, stderr);
      } else {
        callback(err.code, stdout, stderr);
      }
    }
  });

  if (pipe) c.stdin.end(pipe);

  if (!opts.silent) {
    c.stdout.pipe(process.stdout);
    c.stderr.pipe(process.stderr);
  }

  return c;
}

//@
//@ ### exec(command [, options] [, callback])
//@
//@ Available options:
//@
//@ + `async`: Asynchronous execution. If a callback is provided, it will be set to
//@   `true`, regardless of the passed value (default: `false`).
//@ + `silent`: Do not echo program output to console (default: `false`).
//@ + `encoding`: Character encoding to use. Affects the values returned to stdout and stderr, and
//@   what is written to stdout and stderr when not in silent mode (default: `'utf8'`).
//@ + and any option available to Node.js's
//@   [`child_process.exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback)
//@
//@ Examples:
//@
//@ ```javascript
//@ var version = exec('node --version', {silent:true}).stdout;
//@
//@ var child = exec('some_long_running_process', {async:true});
//@ child.stdout.on('data', function(data) {
//@   /* ... do something with data ... */
//@ });
//@
//@ exec('some_long_running_process', function(code, stdout, stderr) {
//@   console.log('Exit code:', code);
//@   console.log('Program output:', stdout);
//@   console.log('Program stderr:', stderr);
//@ });
//@ ```
//@
//@ Executes the given `command` _synchronously_, unless otherwise specified.  When in synchronous
//@ mode, this returns a `ShellString` (compatible with ShellJS v0.6.x, which returns an object
//@ of the form `{ code:..., stdout:... , stderr:... }`). Otherwise, this returns the child process
//@ object, and the `callback` receives the arguments `(code, stdout, stderr)`.
//@
//@ Not seeing the behavior you want? `exec()` runs everything through `sh`
//@ by default (or `cmd.exe` on Windows), which differs from `bash`. If you
//@ need bash-specific behavior, try out the `{shell: 'path/to/bash'}` option.
function _exec(command, options, callback) {
  options = options || {};
  if (!command) common.error('must specify command');

  var pipe = common.readFromPipe();

  // Callback is defined instead of options.
  if (typeof options === 'function') {
    callback = options;
    options = { async: true };
  }

  // Callback is defined with options.
  if (typeof options === 'object' && typeof callback === 'function') {
    options.async = true;
  }

  options = common.extend({
    silent: common.config.silent,
    async: false,
  }, options);

  if (options.async) {
    return execAsync(command, options, pipe, callback);
  } else {
    return execSync(command, options, pipe);
  }
}
module.exports = _exec;


/***/ }),

/***/ 696:
/***/ (function(module) {

"use strict";


/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

module.exports = isPlainObject;


/***/ }),

/***/ 699:
/***/ (function(module) {

"use strict";

/* istanbul ignore file: https://github.com/nodejs/node/blob/master/lib/internal/errors.js */

const makeError = (Base, key, getMessage) => {
	module.exports[key] = class NodeError extends Base {
		constructor(...args) {
			super(typeof getMessage === 'string' ? getMessage : getMessage(args));
			this.name = `${super.name} [${key}]`;
			this.code = key;
		}
	};
};

makeError(TypeError, 'ERR_INVALID_ARG_TYPE', args => {
	const type = args[0].includes('.') ? 'property' : 'argument';

	let valid = args[1];
	const isManyTypes = Array.isArray(valid);

	if (isManyTypes) {
		valid = `${valid.slice(0, -1).join(', ')} or ${valid.slice(-1)}`;
	}

	return `The "${args[0]}" ${type} must be ${isManyTypes ? 'one of' : 'of'} type ${valid}. Received ${typeof args[2]}`;
});

makeError(TypeError, 'ERR_INVALID_PROTOCOL', args => {
	return `Protocol "${args[0]}" not supported. Expected "${args[1]}"`;
});

makeError(Error, 'ERR_HTTP_HEADERS_SENT', args => {
	return `Cannot ${args[0]} headers after they are sent to the client`;
});

makeError(TypeError, 'ERR_INVALID_HTTP_TOKEN', args => {
	return `${args[0]} must be a valid HTTP token [${args[1]}]`;
});

makeError(TypeError, 'ERR_HTTP_INVALID_HEADER_VALUE', args => {
	return `Invalid value "${args[0]} for header "${args[1]}"`;
});

makeError(TypeError, 'ERR_INVALID_CHAR', args => {
	return `Invalid character in ${args[0]} [${args[1]}]`;
});


/***/ }),

/***/ 705:
/***/ (function(module, __unusedexports, __webpack_require__) {

var path = __webpack_require__(622);
var fs = __webpack_require__(747);
var common = __webpack_require__(602);
var glob = __webpack_require__(402);

var globPatternRecursive = path.sep + '**';

common.register('ls', _ls, {
  cmdOptions: {
    'R': 'recursive',
    'A': 'all',
    'L': 'link',
    'a': 'all_deprecated',
    'd': 'directory',
    'l': 'long',
  },
});

//@
//@ ### ls([options,] [path, ...])
//@ ### ls([options,] path_array)
//@
//@ Available options:
//@
//@ + `-R`: recursive
//@ + `-A`: all files (include files beginning with `.`, except for `.` and `..`)
//@ + `-L`: follow symlinks
//@ + `-d`: list directories themselves, not their contents
//@ + `-l`: list objects representing each file, each with fields containing `ls
//@         -l` output fields. See
//@         [`fs.Stats`](https://nodejs.org/api/fs.html#fs_class_fs_stats)
//@         for more info
//@
//@ Examples:
//@
//@ ```javascript
//@ ls('projs/*.js');
//@ ls('-R', '/users/me', '/tmp');
//@ ls('-R', ['/users/me', '/tmp']); // same as above
//@ ls('-l', 'file.txt'); // { name: 'file.txt', mode: 33188, nlink: 1, ...}
//@ ```
//@
//@ Returns array of files in the given `path`, or files in
//@ the current directory if no `path` is  provided.
function _ls(options, paths) {
  if (options.all_deprecated) {
    // We won't support the -a option as it's hard to image why it's useful
    // (it includes '.' and '..' in addition to '.*' files)
    // For backwards compatibility we'll dump a deprecated message and proceed as before
    common.log('ls: Option -a is deprecated. Use -A instead');
    options.all = true;
  }

  if (!paths) {
    paths = ['.'];
  } else {
    paths = [].slice.call(arguments, 1);
  }

  var list = [];

  function pushFile(abs, relName, stat) {
    if (process.platform === 'win32') {
      relName = relName.replace(/\\/g, '/');
    }
    if (options.long) {
      stat = stat || (options.link ? common.statFollowLinks(abs) : common.statNoFollowLinks(abs));
      list.push(addLsAttributes(relName, stat));
    } else {
      // list.push(path.relative(rel || '.', file));
      list.push(relName);
    }
  }

  paths.forEach(function (p) {
    var stat;

    try {
      stat = options.link ? common.statFollowLinks(p) : common.statNoFollowLinks(p);
      // follow links to directories by default
      if (stat.isSymbolicLink()) {
        /* istanbul ignore next */
        // workaround for https://github.com/shelljs/shelljs/issues/795
        // codecov seems to have a bug that miscalculate this block as uncovered.
        // but according to nyc report this block does get covered.
        try {
          var _stat = common.statFollowLinks(p);
          if (_stat.isDirectory()) {
            stat = _stat;
          }
        } catch (_) {} // bad symlink, treat it like a file
      }
    } catch (e) {
      common.error('no such file or directory: ' + p, 2, { continue: true });
      return;
    }

    // If the stat succeeded
    if (stat.isDirectory() && !options.directory) {
      if (options.recursive) {
        // use glob, because it's simple
        glob.sync(p + globPatternRecursive, { dot: options.all, follow: options.link })
          .forEach(function (item) {
            // Glob pattern returns the directory itself and needs to be filtered out.
            if (path.relative(p, item)) {
              pushFile(item, path.relative(p, item));
            }
          });
      } else if (options.all) {
        // use fs.readdirSync, because it's fast
        fs.readdirSync(p).forEach(function (item) {
          pushFile(path.join(p, item), item);
        });
      } else {
        // use fs.readdirSync and then filter out secret files
        fs.readdirSync(p).forEach(function (item) {
          if (item[0] !== '.') {
            pushFile(path.join(p, item), item);
          }
        });
      }
    } else {
      pushFile(p, p, stat);
    }
  });

  // Add methods, to make this more compatible with ShellStrings
  return list;
}

function addLsAttributes(pathName, stats) {
  // Note: this object will contain more information than .toString() returns
  stats.name = pathName;
  stats.toString = function () {
    // Return a string resembling unix's `ls -l` format
    return [this.mode, this.nlink, this.uid, this.gid, this.size, this.mtime, this.name].join(' ');
  };
  return stats;
}

module.exports = _ls;


/***/ }),

/***/ 723:
/***/ (function(module) {

"use strict";


module.exports = header => {
	switch (header) {
		case ':method':
		case ':scheme':
		case ':authority':
		case ':path':
			return true;
		default:
			return false;
	}
};


/***/ }),

/***/ 738:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.dnsLookupIpVersionToFamily = exports.isDnsLookupIpVersion = void 0;
const conversionTable = {
    auto: 0,
    ipv4: 4,
    ipv6: 6
};
exports.isDnsLookupIpVersion = (value) => {
    return value in conversionTable;
};
exports.dnsLookupIpVersionToFamily = (dnsLookupIpVersion) => {
    if (exports.isDnsLookupIpVersion(dnsLookupIpVersion)) {
        return conversionTable[dnsLookupIpVersion];
    }
    throw new Error('Invalid DNS lookup IP version');
};


/***/ }),

/***/ 739:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

//
// ShellJS
// Unix shell commands on top of Node's API
//
// Copyright (c) 2012 Artur Adib
// http://github.com/shelljs/shelljs
//

function __ncc_wildcard$0 (arg) {
  if (arg === "cat.js" || arg === "cat") return __webpack_require__(833);
  else if (arg === "cd.js" || arg === "cd") return __webpack_require__(8);
  else if (arg === "chmod.js" || arg === "chmod") return __webpack_require__(477);
  else if (arg === "common.js" || arg === "common") return __webpack_require__(602);
  else if (arg === "cp.js" || arg === "cp") return __webpack_require__(167);
  else if (arg === "dirs.js" || arg === "dirs") return __webpack_require__(542);
  else if (arg === "echo.js" || arg === "echo") return __webpack_require__(574);
  else if (arg === "error.js" || arg === "error") return __webpack_require__(901);
  else if (arg === "exec-child.js" || arg === "exec-child") return __webpack_require__(379);
  else if (arg === "exec.js" || arg === "exec") return __webpack_require__(693);
  else if (arg === "find.js" || arg === "find") return __webpack_require__(216);
  else if (arg === "grep.js" || arg === "grep") return __webpack_require__(199);
  else if (arg === "head.js" || arg === "head") return __webpack_require__(890);
  else if (arg === "ln.js" || arg === "ln") return __webpack_require__(535);
  else if (arg === "ls.js" || arg === "ls") return __webpack_require__(705);
  else if (arg === "mkdir.js" || arg === "mkdir") return __webpack_require__(661);
  else if (arg === "mv.js" || arg === "mv") return __webpack_require__(809);
  else if (arg === "popd.js" || arg === "popd") return __webpack_require__(409);
  else if (arg === "pushd.js" || arg === "pushd") return __webpack_require__(188);
  else if (arg === "pwd.js" || arg === "pwd") return __webpack_require__(359);
  else if (arg === "rm.js" || arg === "rm") return __webpack_require__(272);
  else if (arg === "sed.js" || arg === "sed") return __webpack_require__(989);
  else if (arg === "set.js" || arg === "set") return __webpack_require__(936);
  else if (arg === "sort.js" || arg === "sort") return __webpack_require__(340);
  else if (arg === "tail.js" || arg === "tail") return __webpack_require__(62);
  else if (arg === "tempdir.js" || arg === "tempdir") return __webpack_require__(953);
  else if (arg === "test.js" || arg === "test") return __webpack_require__(284);
  else if (arg === "to.js" || arg === "to") return __webpack_require__(380);
  else if (arg === "toEnd.js" || arg === "toEnd") return __webpack_require__(240);
  else if (arg === "touch.js" || arg === "touch") return __webpack_require__(505);
  else if (arg === "uniq.js" || arg === "uniq") return __webpack_require__(554);
  else if (arg === "which.js" || arg === "which") return __webpack_require__(691);
}
var common = __webpack_require__(602);

//@
//@ All commands run synchronously, unless otherwise stated.
//@ All commands accept standard bash globbing characters (`*`, `?`, etc.),
//@ compatible with the [node `glob` module](https://github.com/isaacs/node-glob).
//@
//@ For less-commonly used commands and features, please check out our [wiki
//@ page](https://github.com/shelljs/shelljs/wiki).
//@

// Include the docs for all the default commands
//@commands

// Load all default commands
__webpack_require__(233).forEach(function (command) {
  __ncc_wildcard$0(command);
});

//@
//@ ### exit(code)
//@
//@ Exits the current process with the given exit `code`.
exports.exit = process.exit;

//@include ./src/error
exports.error = __webpack_require__(901);

//@include ./src/common
exports.ShellString = common.ShellString;

//@
//@ ### env['VAR_NAME']
//@
//@ Object containing environment variables (both getter and setter). Shortcut
//@ to `process.env`.
exports.env = process.env;

//@
//@ ### Pipes
//@
//@ Examples:
//@
//@ ```javascript
//@ grep('foo', 'file1.txt', 'file2.txt').sed(/o/g, 'a').to('output.txt');
//@ echo('files with o\'s in the name:\n' + ls().grep('o'));
//@ cat('test.js').exec('node'); // pipe to exec() call
//@ ```
//@
//@ Commands can send their output to another command in a pipe-like fashion.
//@ `sed`, `grep`, `cat`, `exec`, `to`, and `toEnd` can appear on the right-hand
//@ side of a pipe. Pipes can be chained.

//@
//@ ## Configuration
//@

exports.config = common.config;

//@
//@ ### config.silent
//@
//@ Example:
//@
//@ ```javascript
//@ var sh = require('shelljs');
//@ var silentState = sh.config.silent; // save old silent state
//@ sh.config.silent = true;
//@ /* ... */
//@ sh.config.silent = silentState; // restore old silent state
//@ ```
//@
//@ Suppresses all command output if `true`, except for `echo()` calls.
//@ Default is `false`.

//@
//@ ### config.fatal
//@
//@ Example:
//@
//@ ```javascript
//@ require('shelljs/global');
//@ config.fatal = true; // or set('-e');
//@ cp('this_file_does_not_exist', '/dev/null'); // throws Error here
//@ /* more commands... */
//@ ```
//@
//@ If `true`, the script will throw a Javascript error when any shell.js
//@ command encounters an error. Default is `false`. This is analogous to
//@ Bash's `set -e`.

//@
//@ ### config.verbose
//@
//@ Example:
//@
//@ ```javascript
//@ config.verbose = true; // or set('-v');
//@ cd('dir/');
//@ rm('-rf', 'foo.txt', 'bar.txt');
//@ exec('echo hello');
//@ ```
//@
//@ Will print each command as follows:
//@
//@ ```
//@ cd dir/
//@ rm -rf foo.txt bar.txt
//@ exec echo hello
//@ ```

//@
//@ ### config.globOptions
//@
//@ Example:
//@
//@ ```javascript
//@ config.globOptions = {nodir: true};
//@ ```
//@
//@ Use this value for calls to `glob.sync()` instead of the default options.

//@
//@ ### config.reset()
//@
//@ Example:
//@
//@ ```javascript
//@ var shell = require('shelljs');
//@ // Make changes to shell.config, and do stuff...
//@ /* ... */
//@ shell.config.reset(); // reset to original state
//@ // Do more stuff, but with original settings
//@ /* ... */
//@ ```
//@
//@ Reset `shell.config` to the defaults:
//@
//@ ```javascript
//@ {
//@   fatal: false,
//@   globOptions: {},
//@   maxdepth: 255,
//@   noglob: false,
//@   silent: false,
//@   verbose: false,
//@ }
//@ ```


/***/ }),

/***/ 747:
/***/ (function(module) {

module.exports = require("fs");

/***/ }),

/***/ 750:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Readable} = __webpack_require__(794);

class IncomingMessage extends Readable {
	constructor(socket, highWaterMark) {
		super({
			highWaterMark,
			autoDestroy: false
		});

		this.statusCode = null;
		this.statusMessage = '';
		this.httpVersion = '2.0';
		this.httpVersionMajor = 2;
		this.httpVersionMinor = 0;
		this.headers = {};
		this.trailers = {};
		this.req = null;

		this.aborted = false;
		this.complete = false;
		this.upgrade = null;

		this.rawHeaders = [];
		this.rawTrailers = [];

		this.socket = socket;
		this.connection = socket;

		this._dumped = false;
	}

	_destroy(error) {
		this.req._request.destroy(error);
	}

	setTimeout(ms, callback) {
		this.req.setTimeout(ms, callback);
		return this;
	}

	_dump() {
		if (!this._dumped) {
			this._dumped = true;

			this.removeAllListeners('data');
			this.resume();
		}
	}

	_read() {
		if (this.req) {
			this.req._request.resume();
		}
	}
}

module.exports = IncomingMessage;


/***/ }),

/***/ 751:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const net = __webpack_require__(631);
/* istanbul ignore file: https://github.com/nodejs/node/blob/v13.0.1/lib/_http_agent.js */

module.exports = options => {
	let servername = options.host;
	const hostHeader = options.headers && options.headers.host;

	if (hostHeader) {
		if (hostHeader.startsWith('[')) {
			const index = hostHeader.indexOf(']');
			if (index === -1) {
				servername = hostHeader;
			} else {
				servername = hostHeader.slice(1, -1);
			}
		} else {
			servername = hostHeader.split(':', 1)[0];
		}
	}

	if (net.isIP(servername)) {
		return '';
	}

	return servername;
};


/***/ }),

/***/ 753:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __webpack_require__(385);
var universalUserAgent = __webpack_require__(392);
var isPlainObject = _interopDefault(__webpack_require__(696));
var nodeFetch = _interopDefault(__webpack_require__(454));
var requestError = __webpack_require__(463);

const VERSION = "5.4.7";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 761:
/***/ (function(module) {

module.exports = require("zlib");

/***/ }),

/***/ 768:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 784:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// When attaching listeners, it's very easy to forget about them.
// Especially if you do error handling and set timeouts.
// So instead of checking if it's proper to throw an error on every timeout ever,
// use this simple tool which will remove all listeners you have attached.
exports.default = () => {
    const handlers = [];
    return {
        once(origin, event, fn) {
            origin.once(event, fn);
            handlers.push({ origin, event, fn });
        },
        unhandleAll() {
            for (const handler of handlers) {
                const { origin, event, fn } = handler;
                origin.removeListener(event, fn);
            }
            handlers.length = 0;
        }
    };
};


/***/ }),

/***/ 786:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __webpack_require__(747);
const util_1 = __webpack_require__(669);
const is_1 = __webpack_require__(534);
const is_form_data_1 = __webpack_require__(460);
const statAsync = util_1.promisify(fs_1.stat);
exports.default = async (body, headers) => {
    if (headers && 'content-length' in headers) {
        return Number(headers['content-length']);
    }
    if (!body) {
        return 0;
    }
    if (is_1.default.string(body)) {
        return Buffer.byteLength(body);
    }
    if (is_1.default.buffer(body)) {
        return body.length;
    }
    if (is_form_data_1.default(body)) {
        return util_1.promisify(body.getLength.bind(body))();
    }
    if (body instanceof fs_1.ReadStream) {
        const { size } = await statAsync(body.path);
        if (size === 0) {
            return undefined;
        }
        return size;
    }
    return undefined;
};


/***/ }),

/***/ 790:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tls_1 = __webpack_require__(16);
const deferToConnect = (socket, fn) => {
    let listeners;
    if (typeof fn === 'function') {
        const connect = fn;
        listeners = { connect };
    }
    else {
        listeners = fn;
    }
    const hasConnectListener = typeof listeners.connect === 'function';
    const hasSecureConnectListener = typeof listeners.secureConnect === 'function';
    const hasCloseListener = typeof listeners.close === 'function';
    const onConnect = () => {
        if (hasConnectListener) {
            listeners.connect();
        }
        if (socket instanceof tls_1.TLSSocket && hasSecureConnectListener) {
            if (socket.authorized) {
                listeners.secureConnect();
            }
            else if (!socket.authorizationError) {
                socket.once('secureConnect', listeners.secureConnect);
            }
        }
        if (hasCloseListener) {
            socket.once('close', listeners.close);
        }
    };
    if (socket.writable && !socket.connecting) {
        onConnect();
    }
    else if (socket.connecting) {
        socket.once('connect', onConnect);
    }
    else if (socket.destroyed && hasCloseListener) {
        listeners.close(socket._hadError);
    }
};
exports.default = deferToConnect;
// For CommonJS default export support
module.exports = deferToConnect;
module.exports.default = deferToConnect;


/***/ }),

/***/ 794:
/***/ (function(module) {

module.exports = require("stream");

/***/ }),

/***/ 809:
/***/ (function(module, __unusedexports, __webpack_require__) {

var fs = __webpack_require__(747);
var path = __webpack_require__(622);
var common = __webpack_require__(602);
var cp = __webpack_require__(167);
var rm = __webpack_require__(272);

common.register('mv', _mv, {
  cmdOptions: {
    'f': '!no_force',
    'n': 'no_force',
  },
});

// Checks if cureent file was created recently
function checkRecentCreated(sources, index) {
  var lookedSource = sources[index];
  return sources.slice(0, index).some(function (src) {
    return path.basename(src) === path.basename(lookedSource);
  });
}

//@
//@ ### mv([options ,] source [, source ...], dest')
//@ ### mv([options ,] source_array, dest')
//@
//@ Available options:
//@
//@ + `-f`: force (default behavior)
//@ + `-n`: no-clobber
//@
//@ Examples:
//@
//@ ```javascript
//@ mv('-n', 'file', 'dir/');
//@ mv('file1', 'file2', 'dir/');
//@ mv(['file1', 'file2'], 'dir/'); // same as above
//@ ```
//@
//@ Moves `source` file(s) to `dest`.
function _mv(options, sources, dest) {
  // Get sources, dest
  if (arguments.length < 3) {
    common.error('missing <source> and/or <dest>');
  } else if (arguments.length > 3) {
    sources = [].slice.call(arguments, 1, arguments.length - 1);
    dest = arguments[arguments.length - 1];
  } else if (typeof sources === 'string') {
    sources = [sources];
  } else {
    // TODO(nate): figure out if we actually need this line
    common.error('invalid arguments');
  }

  var exists = fs.existsSync(dest);
  var stats = exists && common.statFollowLinks(dest);

  // Dest is not existing dir, but multiple sources given
  if ((!exists || !stats.isDirectory()) && sources.length > 1) {
    common.error('dest is not a directory (too many sources)');
  }

  // Dest is an existing file, but no -f given
  if (exists && stats.isFile() && options.no_force) {
    common.error('dest file already exists: ' + dest);
  }

  sources.forEach(function (src, srcIndex) {
    if (!fs.existsSync(src)) {
      common.error('no such file or directory: ' + src, { continue: true });
      return; // skip file
    }

    // If here, src exists

    // When copying to '/path/dir':
    //    thisDest = '/path/dir/file1'
    var thisDest = dest;
    if (fs.existsSync(dest) && common.statFollowLinks(dest).isDirectory()) {
      thisDest = path.normalize(dest + '/' + path.basename(src));
    }

    var thisDestExists = fs.existsSync(thisDest);

    if (thisDestExists && checkRecentCreated(sources, srcIndex)) {
      // cannot overwrite file created recently in current execution, but we want to continue copying other files
      if (!options.no_force) {
        common.error("will not overwrite just-created '" + thisDest + "' with '" + src + "'", { continue: true });
      }
      return;
    }

    if (fs.existsSync(thisDest) && options.no_force) {
      common.error('dest file already exists: ' + thisDest, { continue: true });
      return; // skip file
    }

    if (path.resolve(src) === path.dirname(path.resolve(thisDest))) {
      common.error('cannot move to self: ' + src, { continue: true });
      return; // skip file
    }

    try {
      fs.renameSync(src, thisDest);
    } catch (e) {
      /* istanbul ignore next */
      if (e.code === 'EXDEV') {
        // If we're trying to `mv` to an external partition, we'll actually need
        // to perform a copy and then clean up the original file. If either the
        // copy or the rm fails with an exception, we should allow this
        // exception to pass up to the top level.
        cp('-r', src, thisDest);
        rm('-rf', src);
      }
    }
  }); // forEach(src)
  return '';
} // mv
module.exports = _mv;


/***/ }),

/***/ 811:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
const net = __webpack_require__(631);
const unhandle_1 = __webpack_require__(784);
const reentry = Symbol('reentry');
const noop = () => { };
class TimeoutError extends Error {
    constructor(threshold, event) {
        super(`Timeout awaiting '${event}' for ${threshold}ms`);
        this.event = event;
        this.name = 'TimeoutError';
        this.code = 'ETIMEDOUT';
    }
}
exports.TimeoutError = TimeoutError;
exports.default = (request, delays, options) => {
    if (reentry in request) {
        return noop;
    }
    request[reentry] = true;
    const cancelers = [];
    const { once, unhandleAll } = unhandle_1.default();
    const addTimeout = (delay, callback, event) => {
        var _a;
        const timeout = setTimeout(callback, delay, delay, event);
        (_a = timeout.unref) === null || _a === void 0 ? void 0 : _a.call(timeout);
        const cancel = () => {
            clearTimeout(timeout);
        };
        cancelers.push(cancel);
        return cancel;
    };
    const { host, hostname } = options;
    const timeoutHandler = (delay, event) => {
        request.destroy(new TimeoutError(delay, event));
    };
    const cancelTimeouts = () => {
        for (const cancel of cancelers) {
            cancel();
        }
        unhandleAll();
    };
    request.once('error', error => {
        cancelTimeouts();
        // Save original behavior
        /* istanbul ignore next */
        if (request.listenerCount('error') === 0) {
            throw error;
        }
    });
    request.once('close', cancelTimeouts);
    once(request, 'response', (response) => {
        once(response, 'end', cancelTimeouts);
    });
    if (typeof delays.request !== 'undefined') {
        addTimeout(delays.request, timeoutHandler, 'request');
    }
    if (typeof delays.socket !== 'undefined') {
        const socketTimeoutHandler = () => {
            timeoutHandler(delays.socket, 'socket');
        };
        request.setTimeout(delays.socket, socketTimeoutHandler);
        // `request.setTimeout(0)` causes a memory leak.
        // We can just remove the listener and forget about the timer - it's unreffed.
        // See https://github.com/sindresorhus/got/issues/690
        cancelers.push(() => {
            request.removeListener('timeout', socketTimeoutHandler);
        });
    }
    once(request, 'socket', (socket) => {
        var _a;
        const { socketPath } = request;
        /* istanbul ignore next: hard to test */
        if (socket.connecting) {
            const hasPath = Boolean(socketPath !== null && socketPath !== void 0 ? socketPath : net.isIP((_a = hostname !== null && hostname !== void 0 ? hostname : host) !== null && _a !== void 0 ? _a : '') !== 0);
            if (typeof delays.lookup !== 'undefined' && !hasPath && typeof socket.address().address === 'undefined') {
                const cancelTimeout = addTimeout(delays.lookup, timeoutHandler, 'lookup');
                once(socket, 'lookup', cancelTimeout);
            }
            if (typeof delays.connect !== 'undefined') {
                const timeConnect = () => addTimeout(delays.connect, timeoutHandler, 'connect');
                if (hasPath) {
                    once(socket, 'connect', timeConnect());
                }
                else {
                    once(socket, 'lookup', (error) => {
                        if (error === null) {
                            once(socket, 'connect', timeConnect());
                        }
                    });
                }
            }
            if (typeof delays.secureConnect !== 'undefined' && options.protocol === 'https:') {
                once(socket, 'connect', () => {
                    const cancelTimeout = addTimeout(delays.secureConnect, timeoutHandler, 'secureConnect');
                    once(socket, 'secureConnect', cancelTimeout);
                });
            }
        }
        if (typeof delays.send !== 'undefined') {
            const timeRequest = () => addTimeout(delays.send, timeoutHandler, 'send');
            /* istanbul ignore next: hard to test */
            if (socket.connecting) {
                once(socket, 'connect', () => {
                    once(request, 'upload-complete', timeRequest());
                });
            }
            else {
                once(request, 'upload-complete', timeRequest());
            }
        }
    });
    if (typeof delays.response !== 'undefined') {
        once(request, 'upload-complete', () => {
            const cancelTimeout = addTimeout(delays.response, timeoutHandler, 'response');
            once(request, 'response', cancelTimeout);
        });
    }
    return cancelTimeouts;
};


/***/ }),

/***/ 813:
/***/ (function(__unusedmodule, exports) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 833:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('cat', _cat, {
  canReceivePipe: true,
  cmdOptions: {
    'n': 'number',
  },
});

//@
//@ ### cat([options,] file [, file ...])
//@ ### cat([options,] file_array)
//@
//@ Available options:
//@
//@ + `-n`: number all output lines
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = cat('file*.txt');
//@ var str = cat('file1', 'file2');
//@ var str = cat(['file1', 'file2']); // same as above
//@ ```
//@
//@ Returns a string containing the given file, or a concatenated string
//@ containing the files if more than one file is given (a new line character is
//@ introduced between each file).
function _cat(options, files) {
  var cat = common.readFromPipe();

  if (!files && !cat) common.error('no paths given');

  files = [].slice.call(arguments, 1);

  files.forEach(function (file) {
    if (!fs.existsSync(file)) {
      common.error('no such file or directory: ' + file);
    } else if (common.statFollowLinks(file).isDirectory()) {
      common.error(file + ': Is a directory');
    }

    cat += fs.readFileSync(file, 'utf8');
  });

  if (options.number) {
    cat = addNumbers(cat);
  }

  return cat;
}
module.exports = _cat;

function addNumbers(cat) {
  var lines = cat.split('\n');
  var lastLine = lines.pop();

  lines = lines.map(function (line, i) {
    return numberedLine(i + 1, line);
  });

  if (lastLine.length) {
    lastLine = numberedLine(lines.length + 1, lastLine);
  }
  lines.push(lastLine);

  return lines.join('\n');
}

function numberedLine(n, line) {
  // GNU cat use six pad start number + tab. See http://lingrok.org/xref/coreutils/src/cat.c#57
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  var number = ('     ' + n).slice(-6) + '\t';
  return number + line;
}


/***/ }),

/***/ 835:
/***/ (function(module) {

module.exports = require("url");

/***/ }),

/***/ 839:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ 856:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

exports.alphasort = alphasort
exports.alphasorti = alphasorti
exports.setopts = setopts
exports.ownProp = ownProp
exports.makeAbs = makeAbs
exports.finish = finish
exports.mark = mark
exports.isIgnored = isIgnored
exports.childrenIgnored = childrenIgnored

function ownProp (obj, field) {
  return Object.prototype.hasOwnProperty.call(obj, field)
}

var path = __webpack_require__(622)
var minimatch = __webpack_require__(93)
var isAbsolute = __webpack_require__(681)
var Minimatch = minimatch.Minimatch

function alphasorti (a, b) {
  return a.toLowerCase().localeCompare(b.toLowerCase())
}

function alphasort (a, b) {
  return a.localeCompare(b)
}

function setupIgnores (self, options) {
  self.ignore = options.ignore || []

  if (!Array.isArray(self.ignore))
    self.ignore = [self.ignore]

  if (self.ignore.length) {
    self.ignore = self.ignore.map(ignoreMap)
  }
}

// ignore patterns are always in dot:true mode.
function ignoreMap (pattern) {
  var gmatcher = null
  if (pattern.slice(-3) === '/**') {
    var gpattern = pattern.replace(/(\/\*\*)+$/, '')
    gmatcher = new Minimatch(gpattern, { dot: true })
  }

  return {
    matcher: new Minimatch(pattern, { dot: true }),
    gmatcher: gmatcher
  }
}

function setopts (self, pattern, options) {
  if (!options)
    options = {}

  // base-matching: just use globstar for that.
  if (options.matchBase && -1 === pattern.indexOf("/")) {
    if (options.noglobstar) {
      throw new Error("base matching requires globstar")
    }
    pattern = "**/" + pattern
  }

  self.silent = !!options.silent
  self.pattern = pattern
  self.strict = options.strict !== false
  self.realpath = !!options.realpath
  self.realpathCache = options.realpathCache || Object.create(null)
  self.follow = !!options.follow
  self.dot = !!options.dot
  self.mark = !!options.mark
  self.nodir = !!options.nodir
  if (self.nodir)
    self.mark = true
  self.sync = !!options.sync
  self.nounique = !!options.nounique
  self.nonull = !!options.nonull
  self.nosort = !!options.nosort
  self.nocase = !!options.nocase
  self.stat = !!options.stat
  self.noprocess = !!options.noprocess
  self.absolute = !!options.absolute

  self.maxLength = options.maxLength || Infinity
  self.cache = options.cache || Object.create(null)
  self.statCache = options.statCache || Object.create(null)
  self.symlinks = options.symlinks || Object.create(null)

  setupIgnores(self, options)

  self.changedCwd = false
  var cwd = process.cwd()
  if (!ownProp(options, "cwd"))
    self.cwd = cwd
  else {
    self.cwd = path.resolve(options.cwd)
    self.changedCwd = self.cwd !== cwd
  }

  self.root = options.root || path.resolve(self.cwd, "/")
  self.root = path.resolve(self.root)
  if (process.platform === "win32")
    self.root = self.root.replace(/\\/g, "/")

  // TODO: is an absolute `cwd` supposed to be resolved against `root`?
  // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
  self.cwdAbs = isAbsolute(self.cwd) ? self.cwd : makeAbs(self, self.cwd)
  if (process.platform === "win32")
    self.cwdAbs = self.cwdAbs.replace(/\\/g, "/")
  self.nomount = !!options.nomount

  // disable comments and negation in Minimatch.
  // Note that they are not supported in Glob itself anyway.
  options.nonegate = true
  options.nocomment = true

  self.minimatch = new Minimatch(pattern, options)
  self.options = self.minimatch.options
}

function finish (self) {
  var nou = self.nounique
  var all = nou ? [] : Object.create(null)

  for (var i = 0, l = self.matches.length; i < l; i ++) {
    var matches = self.matches[i]
    if (!matches || Object.keys(matches).length === 0) {
      if (self.nonull) {
        // do like the shell, and spit out the literal glob
        var literal = self.minimatch.globSet[i]
        if (nou)
          all.push(literal)
        else
          all[literal] = true
      }
    } else {
      // had matches
      var m = Object.keys(matches)
      if (nou)
        all.push.apply(all, m)
      else
        m.forEach(function (m) {
          all[m] = true
        })
    }
  }

  if (!nou)
    all = Object.keys(all)

  if (!self.nosort)
    all = all.sort(self.nocase ? alphasorti : alphasort)

  // at *some* point we statted all of these
  if (self.mark) {
    for (var i = 0; i < all.length; i++) {
      all[i] = self._mark(all[i])
    }
    if (self.nodir) {
      all = all.filter(function (e) {
        var notDir = !(/\/$/.test(e))
        var c = self.cache[e] || self.cache[makeAbs(self, e)]
        if (notDir && c)
          notDir = c !== 'DIR' && !Array.isArray(c)
        return notDir
      })
    }
  }

  if (self.ignore.length)
    all = all.filter(function(m) {
      return !isIgnored(self, m)
    })

  self.found = all
}

function mark (self, p) {
  var abs = makeAbs(self, p)
  var c = self.cache[abs]
  var m = p
  if (c) {
    var isDir = c === 'DIR' || Array.isArray(c)
    var slash = p.slice(-1) === '/'

    if (isDir && !slash)
      m += '/'
    else if (!isDir && slash)
      m = m.slice(0, -1)

    if (m !== p) {
      var mabs = makeAbs(self, m)
      self.statCache[mabs] = self.statCache[abs]
      self.cache[mabs] = self.cache[abs]
    }
  }

  return m
}

// lotta situps...
function makeAbs (self, f) {
  var abs = f
  if (f.charAt(0) === '/') {
    abs = path.join(self.root, f)
  } else if (isAbsolute(f) || f === '') {
    abs = f
  } else if (self.changedCwd) {
    abs = path.resolve(self.cwd, f)
  } else {
    abs = path.resolve(f)
  }

  if (process.platform === 'win32')
    abs = abs.replace(/\\/g, '/')

  return abs
}


// Return true, if pattern ends with globstar '**', for the accompanying parent directory.
// Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
function isIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
  })
}

function childrenIgnored (self, path) {
  if (!self.ignore.length)
    return false

  return self.ignore.some(function(item) {
    return !!(item.gmatcher && item.gmatcher.match(path))
  })
}


/***/ }),

/***/ 861:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {Transform, PassThrough} = __webpack_require__(794);
const zlib = __webpack_require__(761);
const mimicResponse = __webpack_require__(537);

module.exports = response => {
	const contentEncoding = (response.headers['content-encoding'] || '').toLowerCase();

	if (!['gzip', 'deflate', 'br'].includes(contentEncoding)) {
		return response;
	}

	// TODO: Remove this when targeting Node.js 12.
	const isBrotli = contentEncoding === 'br';
	if (isBrotli && typeof zlib.createBrotliDecompress !== 'function') {
		response.destroy(new Error('Brotli is not supported on Node.js < 12'));
		return response;
	}

	let isEmpty = true;

	const checker = new Transform({
		transform(data, _encoding, callback) {
			isEmpty = false;

			callback(null, data);
		},

		flush(callback) {
			callback();
		}
	});

	const finalStream = new PassThrough({
		autoDestroy: false,
		destroy(error, callback) {
			response.destroy();

			callback(error);
		}
	});

	const decompressStream = isBrotli ? zlib.createBrotliDecompress() : zlib.createUnzip();

	decompressStream.once('error', error => {
		if (isEmpty && !response.readable) {
			finalStream.end();
			return;
		}

		finalStream.destroy(error);
	});

	mimicResponse(response, finalStream);
	response.pipe(checker).pipe(decompressStream).pipe(finalStream);

	return finalStream;
};


/***/ }),

/***/ 866:
/***/ (function(module) {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),

/***/ 881:
/***/ (function(module) {

module.exports = require("dns");

/***/ }),

/***/ 890:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('head', _head, {
  canReceivePipe: true,
  cmdOptions: {
    'n': 'numLines',
  },
});

// Reads |numLines| lines or the entire file, whichever is less.
function readSomeLines(file, numLines) {
  var buf = common.buffer();
  var bufLength = buf.length;
  var bytesRead = bufLength;
  var pos = 0;

  var fdr = fs.openSync(file, 'r');
  var numLinesRead = 0;
  var ret = '';
  while (bytesRead === bufLength && numLinesRead < numLines) {
    bytesRead = fs.readSync(fdr, buf, 0, bufLength, pos);
    var bufStr = buf.toString('utf8', 0, bytesRead);
    numLinesRead += bufStr.split('\n').length - 1;
    ret += bufStr;
    pos += bytesRead;
  }

  fs.closeSync(fdr);
  return ret;
}

//@
//@ ### head([{'-n': \<num\>},] file [, file ...])
//@ ### head([{'-n': \<num\>},] file_array)
//@
//@ Available options:
//@
//@ + `-n <num>`: Show the first `<num>` lines of the files
//@
//@ Examples:
//@
//@ ```javascript
//@ var str = head({'-n': 1}, 'file*.txt');
//@ var str = head('file1', 'file2');
//@ var str = head(['file1', 'file2']); // same as above
//@ ```
//@
//@ Read the start of a file.
function _head(options, files) {
  var head = [];
  var pipe = common.readFromPipe();

  if (!files && !pipe) common.error('no paths given');

  var idx = 1;
  if (options.numLines === true) {
    idx = 2;
    options.numLines = Number(arguments[1]);
  } else if (options.numLines === false) {
    options.numLines = 10;
  }
  files = [].slice.call(arguments, idx);

  if (pipe) {
    files.unshift('-');
  }

  var shouldAppendNewline = false;
  files.forEach(function (file) {
    if (file !== '-') {
      if (!fs.existsSync(file)) {
        common.error('no such file or directory: ' + file, { continue: true });
        return;
      } else if (common.statFollowLinks(file).isDirectory()) {
        common.error("error reading '" + file + "': Is a directory", {
          continue: true,
        });
        return;
      }
    }

    var contents;
    if (file === '-') {
      contents = pipe;
    } else if (options.numLines < 0) {
      contents = fs.readFileSync(file, 'utf8');
    } else {
      contents = readSomeLines(file, options.numLines);
    }

    var lines = contents.split('\n');
    var hasTrailingNewline = (lines[lines.length - 1] === '');
    if (hasTrailingNewline) {
      lines.pop();
    }
    shouldAppendNewline = (hasTrailingNewline || options.numLines < lines.length);

    head = head.concat(lines.slice(0, options.numLines));
  });

  if (shouldAppendNewline) {
    head.push(''); // to add a trailing newline once we join
  }
  return head.join('\n');
}
module.exports = _head;


/***/ }),

/***/ 896:
/***/ (function(module) {

module.exports = function (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        var x = fn(xs[i], i);
        if (isArray(x)) res.push.apply(res, x);
        else res.push(x);
    }
    return res;
};

var isArray = Array.isArray || function (xs) {
    return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),

/***/ 898:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, '__esModule', { value: true });

var request = __webpack_require__(753);
var universalUserAgent = __webpack_require__(768);

const VERSION = "4.5.4";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    Object.assign(this, {
      headers: response.headers
    });
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
function graphql(request, query, options) {
  options = typeof query === "string" ? options = Object.assign({
    query
  }, options) : options = query;
  const requestOptions = Object.keys(options).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = options[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = options[key];
    return result;
  }, {});
  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 899:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const EventEmitter = __webpack_require__(614);
const tls = __webpack_require__(16);
const http2 = __webpack_require__(565);
const QuickLRU = __webpack_require__(904);

const kCurrentStreamsCount = Symbol('currentStreamsCount');
const kRequest = Symbol('request');
const kOriginSet = Symbol('cachedOriginSet');
const kGracefullyClosing = Symbol('gracefullyClosing');

const nameKeys = [
	// `http2.connect()` options
	'maxDeflateDynamicTableSize',
	'maxSessionMemory',
	'maxHeaderListPairs',
	'maxOutstandingPings',
	'maxReservedRemoteStreams',
	'maxSendHeaderBlockLength',
	'paddingStrategy',

	// `tls.connect()` options
	'localAddress',
	'path',
	'rejectUnauthorized',
	'minDHSize',

	// `tls.createSecureContext()` options
	'ca',
	'cert',
	'clientCertEngine',
	'ciphers',
	'key',
	'pfx',
	'servername',
	'minVersion',
	'maxVersion',
	'secureProtocol',
	'crl',
	'honorCipherOrder',
	'ecdhCurve',
	'dhparam',
	'secureOptions',
	'sessionIdContext'
];

const getSortedIndex = (array, value, compare) => {
	let low = 0;
	let high = array.length;

	while (low < high) {
		const mid = (low + high) >>> 1;

		/* istanbul ignore next */
		if (compare(array[mid], value)) {
			// This never gets called because we use descending sort. Better to have this anyway.
			low = mid + 1;
		} else {
			high = mid;
		}
	}

	return low;
};

const compareSessions = (a, b) => {
	return a.remoteSettings.maxConcurrentStreams > b.remoteSettings.maxConcurrentStreams;
};

// See https://tools.ietf.org/html/rfc8336
const closeCoveredSessions = (where, session) => {
	// Clients SHOULD NOT emit new requests on any connection whose Origin
	// Set is a proper subset of another connection's Origin Set, and they
	// SHOULD close it once all outstanding requests are satisfied.
	for (const coveredSession of where) {
		if (
			// The set is a proper subset when its length is less than the other set.
			coveredSession[kOriginSet].length < session[kOriginSet].length &&

			// And the other set includes all elements of the subset.
			coveredSession[kOriginSet].every(origin => session[kOriginSet].includes(origin)) &&

			// Makes sure that the session can handle all requests from the covered session.
			coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams
		) {
			// This allows pending requests to finish and prevents making new requests.
			gracefullyClose(coveredSession);
		}
	}
};

// This is basically inverted `closeCoveredSessions(...)`.
const closeSessionIfCovered = (where, coveredSession) => {
	for (const session of where) {
		if (
			coveredSession[kOriginSet].length < session[kOriginSet].length &&
			coveredSession[kOriginSet].every(origin => session[kOriginSet].includes(origin)) &&
			coveredSession[kCurrentStreamsCount] + session[kCurrentStreamsCount] <= session.remoteSettings.maxConcurrentStreams
		) {
			gracefullyClose(coveredSession);
		}
	}
};

const getSessions = ({agent, isFree}) => {
	const result = {};

	// eslint-disable-next-line guard-for-in
	for (const normalizedOptions in agent.sessions) {
		const sessions = agent.sessions[normalizedOptions];

		const filtered = sessions.filter(session => {
			const result = session[Agent.kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;

			return isFree ? result : !result;
		});

		if (filtered.length !== 0) {
			result[normalizedOptions] = filtered;
		}
	}

	return result;
};

const gracefullyClose = session => {
	session[kGracefullyClosing] = true;

	if (session[kCurrentStreamsCount] === 0) {
		session.close();
	}
};

class Agent extends EventEmitter {
	constructor({timeout = 60000, maxSessions = Infinity, maxFreeSessions = 10, maxCachedTlsSessions = 100} = {}) {
		super();

		// A session is considered busy when its current streams count
		// is equal to or greater than the `maxConcurrentStreams` value.

		// A session is considered free when its current streams count
		// is less than the `maxConcurrentStreams` value.

		// SESSIONS[NORMALIZED_OPTIONS] = [];
		this.sessions = {};

		// The queue for creating new sessions. It looks like this:
		// QUEUE[NORMALIZED_OPTIONS][NORMALIZED_ORIGIN] = ENTRY_FUNCTION
		//
		// The entry function has `listeners`, `completed` and `destroyed` properties.
		// `listeners` is an array of objects containing `resolve` and `reject` functions.
		// `completed` is a boolean. It's set to true after ENTRY_FUNCTION is executed.
		// `destroyed` is a boolean. If it's set to true, the session will be destroyed if hasn't connected yet.
		this.queue = {};

		// Each session will use this timeout value.
		this.timeout = timeout;

		// Max sessions in total
		this.maxSessions = maxSessions;

		// Max free sessions in total
		// TODO: decreasing `maxFreeSessions` should close some sessions
		this.maxFreeSessions = maxFreeSessions;

		this._freeSessionsCount = 0;
		this._sessionsCount = 0;

		// We don't support push streams by default.
		this.settings = {
			enablePush: false
		};

		// Reusing TLS sessions increases performance.
		this.tlsSessionCache = new QuickLRU({maxSize: maxCachedTlsSessions});
	}

	static normalizeOrigin(url, servername) {
		if (typeof url === 'string') {
			url = new URL(url);
		}

		if (servername && url.hostname !== servername) {
			url.hostname = servername;
		}

		return url.origin;
	}

	normalizeOptions(options) {
		let normalized = '';

		if (options) {
			for (const key of nameKeys) {
				if (options[key]) {
					normalized += `:${options[key]}`;
				}
			}
		}

		return normalized;
	}

	_tryToCreateNewSession(normalizedOptions, normalizedOrigin) {
		if (!(normalizedOptions in this.queue) || !(normalizedOrigin in this.queue[normalizedOptions])) {
			return;
		}

		const item = this.queue[normalizedOptions][normalizedOrigin];

		// The entry function can be run only once.
		// BUG: The session may be never created when:
		// - the first condition is false AND
		// - this function is never called with the same arguments in the future.
		if (this._sessionsCount < this.maxSessions && !item.completed) {
			item.completed = true;

			item();
		}
	}

	getSession(origin, options, listeners) {
		return new Promise((resolve, reject) => {
			if (Array.isArray(listeners)) {
				listeners = [...listeners];

				// Resolve the current promise ASAP, we're just moving the listeners.
				// They will be executed at a different time.
				resolve();
			} else {
				listeners = [{resolve, reject}];
			}

			const normalizedOptions = this.normalizeOptions(options);
			const normalizedOrigin = Agent.normalizeOrigin(origin, options && options.servername);

			if (normalizedOrigin === undefined) {
				for (const {reject} of listeners) {
					reject(new TypeError('The `origin` argument needs to be a string or an URL object'));
				}

				return;
			}

			if (normalizedOptions in this.sessions) {
				const sessions = this.sessions[normalizedOptions];

				let maxConcurrentStreams = -1;
				let currentStreamsCount = -1;
				let optimalSession;

				// We could just do this.sessions[normalizedOptions].find(...) but that isn't optimal.
				// Additionally, we are looking for session which has biggest current pending streams count.
				for (const session of sessions) {
					const sessionMaxConcurrentStreams = session.remoteSettings.maxConcurrentStreams;

					if (sessionMaxConcurrentStreams < maxConcurrentStreams) {
						break;
					}

					if (session[kOriginSet].includes(normalizedOrigin)) {
						const sessionCurrentStreamsCount = session[kCurrentStreamsCount];

						if (
							sessionCurrentStreamsCount >= sessionMaxConcurrentStreams ||
							session[kGracefullyClosing] ||
							// Unfortunately the `close` event isn't called immediately,
							// so `session.destroyed` is `true`, but `session.closed` is `false`.
							session.destroyed
						) {
							continue;
						}

						// We only need set this once.
						if (!optimalSession) {
							maxConcurrentStreams = sessionMaxConcurrentStreams;
						}

						// We're looking for the session which has biggest current pending stream count,
						// in order to minimalize the amount of active sessions.
						if (sessionCurrentStreamsCount > currentStreamsCount) {
							optimalSession = session;
							currentStreamsCount = sessionCurrentStreamsCount;
						}
					}
				}

				if (optimalSession) {
					/* istanbul ignore next: safety check */
					if (listeners.length !== 1) {
						for (const {reject} of listeners) {
							const error = new Error(
								`Expected the length of listeners to be 1, got ${listeners.length}.\n` +
								'Please report this to https://github.com/szmarczak/http2-wrapper/'
							);

							reject(error);
						}

						return;
					}

					listeners[0].resolve(optimalSession);
					return;
				}
			}

			if (normalizedOptions in this.queue) {
				if (normalizedOrigin in this.queue[normalizedOptions]) {
					// There's already an item in the queue, just attach ourselves to it.
					this.queue[normalizedOptions][normalizedOrigin].listeners.push(...listeners);

					// This shouldn't be executed here.
					// See the comment inside _tryToCreateNewSession.
					this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
					return;
				}
			} else {
				this.queue[normalizedOptions] = {};
			}

			// The entry must be removed from the queue IMMEDIATELY when:
			// 1. the session connects successfully,
			// 2. an error occurs.
			const removeFromQueue = () => {
				// Our entry can be replaced. We cannot remove the new one.
				if (normalizedOptions in this.queue && this.queue[normalizedOptions][normalizedOrigin] === entry) {
					delete this.queue[normalizedOptions][normalizedOrigin];

					if (Object.keys(this.queue[normalizedOptions]).length === 0) {
						delete this.queue[normalizedOptions];
					}
				}
			};

			// The main logic is here
			const entry = () => {
				const name = `${normalizedOrigin}:${normalizedOptions}`;
				let receivedSettings = false;

				try {
					const session = http2.connect(origin, {
						createConnection: this.createConnection,
						settings: this.settings,
						session: this.tlsSessionCache.get(name),
						...options
					});
					session[kCurrentStreamsCount] = 0;
					session[kGracefullyClosing] = false;

					const isFree = () => session[kCurrentStreamsCount] < session.remoteSettings.maxConcurrentStreams;
					let wasFree = true;

					session.socket.once('session', tlsSession => {
						this.tlsSessionCache.set(name, tlsSession);
					});

					session.once('error', error => {
						// Listeners are empty when the session successfully connected.
						for (const {reject} of listeners) {
							reject(error);
						}

						// The connection got broken, purge the cache.
						this.tlsSessionCache.delete(name);
					});

					session.setTimeout(this.timeout, () => {
						// Terminates all streams owned by this session.
						// TODO: Maybe the streams should have a "Session timed out" error?
						session.destroy();
					});

					session.once('close', () => {
						if (receivedSettings) {
							// 1. If it wasn't free then no need to decrease because
							//    it has been decreased already in session.request().
							// 2. `stream.once('close')` won't increment the count
							//    because the session is already closed.
							if (wasFree) {
								this._freeSessionsCount--;
							}

							this._sessionsCount--;

							// This cannot be moved to the stream logic,
							// because there may be a session that hadn't made a single request.
							const where = this.sessions[normalizedOptions];
							where.splice(where.indexOf(session), 1);

							if (where.length === 0) {
								delete this.sessions[normalizedOptions];
							}
						} else {
							// Broken connection
							const error = new Error('Session closed without receiving a SETTINGS frame');
							error.code = 'HTTP2WRAPPER_NOSETTINGS';

							for (const {reject} of listeners) {
								reject(error);
							}

							removeFromQueue();
						}

						// There may be another session awaiting.
						this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
					});

					// Iterates over the queue and processes listeners.
					const processListeners = () => {
						if (!(normalizedOptions in this.queue) || !isFree()) {
							return;
						}

						for (const origin of session[kOriginSet]) {
							if (origin in this.queue[normalizedOptions]) {
								const {listeners} = this.queue[normalizedOptions][origin];

								// Prevents session overloading.
								while (listeners.length !== 0 && isFree()) {
									// We assume `resolve(...)` calls `request(...)` *directly*,
									// otherwise the session will get overloaded.
									listeners.shift().resolve(session);
								}

								const where = this.queue[normalizedOptions];
								if (where[origin].listeners.length === 0) {
									delete where[origin];

									if (Object.keys(where).length === 0) {
										delete this.queue[normalizedOptions];
										break;
									}
								}

								// We're no longer free, no point in continuing.
								if (!isFree()) {
									break;
								}
							}
						}
					};

					// The Origin Set cannot shrink. No need to check if it suddenly became covered by another one.
					session.on('origin', () => {
						session[kOriginSet] = session.originSet;

						if (!isFree()) {
							// The session is full.
							return;
						}

						processListeners();

						// Close covered sessions (if possible).
						closeCoveredSessions(this.sessions[normalizedOptions], session);
					});

					session.once('remoteSettings', () => {
						// Fix Node.js bug preventing the process from exiting
						session.ref();
						session.unref();

						this._sessionsCount++;

						// The Agent could have been destroyed already.
						if (entry.destroyed) {
							const error = new Error('Agent has been destroyed');

							for (const listener of listeners) {
								listener.reject(error);
							}

							session.destroy();
							return;
						}

						session[kOriginSet] = session.originSet;

						{
							const where = this.sessions;

							if (normalizedOptions in where) {
								const sessions = where[normalizedOptions];
								sessions.splice(getSortedIndex(sessions, session, compareSessions), 0, session);
							} else {
								where[normalizedOptions] = [session];
							}
						}

						this._freeSessionsCount += 1;
						receivedSettings = true;

						this.emit('session', session);

						processListeners();
						removeFromQueue();

						// TODO: Close last recently used (or least used?) session
						if (session[kCurrentStreamsCount] === 0 && this._freeSessionsCount > this.maxFreeSessions) {
							session.close();
						}

						// Check if we haven't managed to execute all listeners.
						if (listeners.length !== 0) {
							// Request for a new session with predefined listeners.
							this.getSession(normalizedOrigin, options, listeners);
							listeners.length = 0;
						}

						// `session.remoteSettings.maxConcurrentStreams` might get increased
						session.on('remoteSettings', () => {
							processListeners();

							// In case the Origin Set changes
							closeCoveredSessions(this.sessions[normalizedOptions], session);
						});
					});

					// Shim `session.request()` in order to catch all streams
					session[kRequest] = session.request;
					session.request = (headers, streamOptions) => {
						if (session[kGracefullyClosing]) {
							throw new Error('The session is gracefully closing. No new streams are allowed.');
						}

						const stream = session[kRequest](headers, streamOptions);

						// The process won't exit until the session is closed or all requests are gone.
						session.ref();

						++session[kCurrentStreamsCount];

						if (session[kCurrentStreamsCount] === session.remoteSettings.maxConcurrentStreams) {
							this._freeSessionsCount--;
						}

						stream.once('close', () => {
							wasFree = isFree();

							--session[kCurrentStreamsCount];

							if (!session.destroyed && !session.closed) {
								closeSessionIfCovered(this.sessions[normalizedOptions], session);

								if (isFree() && !session.closed) {
									if (!wasFree) {
										this._freeSessionsCount++;

										wasFree = true;
									}

									const isEmpty = session[kCurrentStreamsCount] === 0;

									if (isEmpty) {
										session.unref();
									}

									if (
										isEmpty &&
										(
											this._freeSessionsCount > this.maxFreeSessions ||
											session[kGracefullyClosing]
										)
									) {
										session.close();
									} else {
										closeCoveredSessions(this.sessions[normalizedOptions], session);
										processListeners();
									}
								}
							}
						});

						return stream;
					};
				} catch (error) {
					for (const listener of listeners) {
						listener.reject(error);
					}

					removeFromQueue();
				}
			};

			entry.listeners = listeners;
			entry.completed = false;
			entry.destroyed = false;

			this.queue[normalizedOptions][normalizedOrigin] = entry;
			this._tryToCreateNewSession(normalizedOptions, normalizedOrigin);
		});
	}

	request(origin, options, headers, streamOptions) {
		return new Promise((resolve, reject) => {
			this.getSession(origin, options, [{
				reject,
				resolve: session => {
					try {
						resolve(session.request(headers, streamOptions));
					} catch (error) {
						reject(error);
					}
				}
			}]);
		});
	}

	createConnection(origin, options) {
		return Agent.connect(origin, options);
	}

	static connect(origin, options) {
		options.ALPNProtocols = ['h2'];

		const port = origin.port || 443;
		const host = origin.hostname || origin.host;

		if (typeof options.servername === 'undefined') {
			options.servername = host;
		}

		return tls.connect(port, host, options);
	}

	closeFreeSessions() {
		for (const sessions of Object.values(this.sessions)) {
			for (const session of sessions) {
				if (session[kCurrentStreamsCount] === 0) {
					session.close();
				}
			}
		}
	}

	destroy(reason) {
		for (const sessions of Object.values(this.sessions)) {
			for (const session of sessions) {
				session.destroy(reason);
			}
		}

		for (const entriesOfAuthority of Object.values(this.queue)) {
			for (const entry of Object.values(entriesOfAuthority)) {
				entry.destroyed = true;
			}
		}

		// New requests should NOT attach to destroyed sessions
		this.queue = {};
	}

	get freeSessions() {
		return getSessions({agent: this, isFree: true});
	}

	get busySessions() {
		return getSessions({agent: this, isFree: false});
	}
}

Agent.kCurrentStreamsCount = kCurrentStreamsCount;
Agent.kGracefullyClosing = kGracefullyClosing;

module.exports = {
	Agent,
	globalAgent: new Agent()
};


/***/ }),

/***/ 901:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);

//@
//@ ### error()
//@
//@ Tests if error occurred in the last command. Returns a truthy value if an
//@ error returned, or a falsy value otherwise.
//@
//@ **Note**: do not rely on the
//@ return value to be an error message. If you need the last error message, use
//@ the `.stderr` attribute from the last command's return value instead.
function error() {
  return common.state.error;
}
module.exports = error;


/***/ }),

/***/ 904:
/***/ (function(module) {

"use strict";


class QuickLRU {
	constructor(options = {}) {
		if (!(options.maxSize && options.maxSize > 0)) {
			throw new TypeError('`maxSize` must be a number greater than 0');
		}

		this.maxSize = options.maxSize;
		this.onEviction = options.onEviction;
		this.cache = new Map();
		this.oldCache = new Map();
		this._size = 0;
	}

	_set(key, value) {
		this.cache.set(key, value);
		this._size++;

		if (this._size >= this.maxSize) {
			this._size = 0;

			if (typeof this.onEviction === 'function') {
				for (const [key, value] of this.oldCache.entries()) {
					this.onEviction(key, value);
				}
			}

			this.oldCache = this.cache;
			this.cache = new Map();
		}
	}

	get(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			const value = this.oldCache.get(key);
			this.oldCache.delete(key);
			this._set(key, value);
			return value;
		}
	}

	set(key, value) {
		if (this.cache.has(key)) {
			this.cache.set(key, value);
		} else {
			this._set(key, value);
		}

		return this;
	}

	has(key) {
		return this.cache.has(key) || this.oldCache.has(key);
	}

	peek(key) {
		if (this.cache.has(key)) {
			return this.cache.get(key);
		}

		if (this.oldCache.has(key)) {
			return this.oldCache.get(key);
		}
	}

	delete(key) {
		const deleted = this.cache.delete(key);
		if (deleted) {
			this._size--;
		}

		return this.oldCache.delete(key) || deleted;
	}

	clear() {
		this.cache.clear();
		this.oldCache.clear();
		this._size = 0;
	}

	* keys() {
		for (const [key] of this) {
			yield key;
		}
	}

	* values() {
		for (const [, value] of this) {
			yield value;
		}
	}

	* [Symbol.iterator]() {
		for (const item of this.cache) {
			yield item;
		}

		for (const item of this.oldCache) {
			const [key] = item;
			if (!this.cache.has(key)) {
				yield item;
			}
		}
	}

	get size() {
		let oldCacheSize = 0;
		for (const key of this.oldCache.keys()) {
			if (!this.cache.has(key)) {
				oldCacheSize++;
			}
		}

		return Math.min(this._size + oldCacheSize, this.maxSize);
	}
}

module.exports = QuickLRU;


/***/ }),

/***/ 907:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
/* istanbul ignore file: deprecated */
const url_1 = __webpack_require__(835);
const keys = [
    'protocol',
    'host',
    'hostname',
    'port',
    'pathname',
    'search'
];
exports.default = (origin, options) => {
    var _a, _b;
    if (options.path) {
        if (options.pathname) {
            throw new TypeError('Parameters `path` and `pathname` are mutually exclusive.');
        }
        if (options.search) {
            throw new TypeError('Parameters `path` and `search` are mutually exclusive.');
        }
        if (options.searchParams) {
            throw new TypeError('Parameters `path` and `searchParams` are mutually exclusive.');
        }
    }
    if (options.search && options.searchParams) {
        throw new TypeError('Parameters `search` and `searchParams` are mutually exclusive.');
    }
    if (!origin) {
        if (!options.protocol) {
            throw new TypeError('No URL protocol specified');
        }
        origin = `${options.protocol}//${(_b = (_a = options.hostname) !== null && _a !== void 0 ? _a : options.host) !== null && _b !== void 0 ? _b : ''}`;
    }
    const url = new url_1.URL(origin);
    if (options.path) {
        const searchIndex = options.path.indexOf('?');
        if (searchIndex === -1) {
            options.pathname = options.path;
        }
        else {
            options.pathname = options.path.slice(0, searchIndex);
            options.search = options.path.slice(searchIndex + 1);
        }
        delete options.path;
    }
    for (const key of keys) {
        if (options[key]) {
            url[key] = options[key].toString();
        }
    }
    return url;
};


/***/ }),

/***/ 910:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = __webpack_require__(36);
function createRejection(error, ...beforeErrorGroups) {
    const promise = (async () => {
        if (error instanceof types_1.RequestError) {
            try {
                for (const hooks of beforeErrorGroups) {
                    if (hooks) {
                        for (const hook of hooks) {
                            // eslint-disable-next-line no-await-in-loop
                            error = await hook(error);
                        }
                    }
                }
            }
            catch (error_) {
                error = error_;
            }
        }
        throw error;
    })();
    const returnPromise = () => promise;
    promise.json = returnPromise;
    promise.text = returnPromise;
    promise.buffer = returnPromise;
    promise.on = returnPromise;
    return promise;
}
exports.default = createRejection;


/***/ }),

/***/ 929:
/***/ (function(__unusedmodule, exports) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.isResponseOk = void 0;
exports.isResponseOk = (response) => {
    const { statusCode } = response;
    const limitStatusCode = response.request.options.followRedirect ? 299 : 399;
    return (statusCode >= 200 && statusCode <= limitStatusCode) || statusCode === 304;
};


/***/ }),

/***/ 936:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);

common.register('set', _set, {
  allowGlobbing: false,
  wrapOutput: false,
});

//@
//@ ### set(options)
//@
//@ Available options:
//@
//@ + `+/-e`: exit upon error (`config.fatal`)
//@ + `+/-v`: verbose: show all commands (`config.verbose`)
//@ + `+/-f`: disable filename expansion (globbing)
//@
//@ Examples:
//@
//@ ```javascript
//@ set('-e'); // exit upon first error
//@ set('+e'); // this undoes a "set('-e')"
//@ ```
//@
//@ Sets global configuration variables.
function _set(options) {
  if (!options) {
    var args = [].slice.call(arguments, 0);
    if (args.length < 2) common.error('must provide an argument');
    options = args[1];
  }
  var negate = (options[0] === '+');
  if (negate) {
    options = '-' + options.slice(1); // parseOptions needs a '-' prefix
  }
  options = common.parseOptions(options, {
    'e': 'fatal',
    'v': 'verbose',
    'f': 'noglob',
  });

  if (negate) {
    Object.keys(options).forEach(function (key) {
      options[key] = !options[key];
    });
  }

  Object.keys(options).forEach(function (key) {
    // Only change the global config if `negate` is false and the option is true
    // or if `negate` is true and the option is false (aka negate !== option)
    if (negate !== options[key]) {
      common.config[key] = options[key];
    }
  });
  return;
}
module.exports = _set;


/***/ }),

/***/ 946:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedProtocolError = exports.ReadError = exports.TimeoutError = exports.UploadError = exports.CacheError = exports.HTTPError = exports.MaxRedirectsError = exports.RequestError = exports.setNonEnumerableProperties = exports.knownHookEvents = exports.withoutBody = exports.kIsNormalizedAlready = void 0;
const util_1 = __webpack_require__(669);
const stream_1 = __webpack_require__(794);
const fs_1 = __webpack_require__(747);
const url_1 = __webpack_require__(835);
const http = __webpack_require__(605);
const http_1 = __webpack_require__(605);
const https = __webpack_require__(211);
const http_timer_1 = __webpack_require__(490);
const cacheable_lookup_1 = __webpack_require__(570);
const CacheableRequest = __webpack_require__(390);
const decompressResponse = __webpack_require__(861);
// @ts-expect-error Missing types
const http2wrapper = __webpack_require__(157);
const lowercaseKeys = __webpack_require__(474);
const is_1 = __webpack_require__(534);
const get_body_size_1 = __webpack_require__(786);
const is_form_data_1 = __webpack_require__(460);
const proxy_events_1 = __webpack_require__(628);
const timed_out_1 = __webpack_require__(811);
const url_to_options_1 = __webpack_require__(10);
const options_to_url_1 = __webpack_require__(907);
const weakable_map_1 = __webpack_require__(48);
const get_buffer_1 = __webpack_require__(452);
const dns_ip_version_1 = __webpack_require__(738);
const is_response_ok_1 = __webpack_require__(929);
const deprecation_warning_1 = __webpack_require__(189);
const normalize_arguments_1 = __webpack_require__(992);
const calculate_retry_delay_1 = __webpack_require__(594);
const globalDnsCache = new cacheable_lookup_1.default();
const kRequest = Symbol('request');
const kResponse = Symbol('response');
const kResponseSize = Symbol('responseSize');
const kDownloadedSize = Symbol('downloadedSize');
const kBodySize = Symbol('bodySize');
const kUploadedSize = Symbol('uploadedSize');
const kServerResponsesPiped = Symbol('serverResponsesPiped');
const kUnproxyEvents = Symbol('unproxyEvents');
const kIsFromCache = Symbol('isFromCache');
const kCancelTimeouts = Symbol('cancelTimeouts');
const kStartedReading = Symbol('startedReading');
const kStopReading = Symbol('stopReading');
const kTriggerRead = Symbol('triggerRead');
const kBody = Symbol('body');
const kJobs = Symbol('jobs');
const kOriginalResponse = Symbol('originalResponse');
const kRetryTimeout = Symbol('retryTimeout');
exports.kIsNormalizedAlready = Symbol('isNormalizedAlready');
const supportsBrotli = is_1.default.string(process.versions.brotli);
exports.withoutBody = new Set(['GET', 'HEAD']);
exports.knownHookEvents = [
    'init',
    'beforeRequest',
    'beforeRedirect',
    'beforeError',
    'beforeRetry',
    // Promise-Only
    'afterResponse'
];
function validateSearchParameters(searchParameters) {
    // eslint-disable-next-line guard-for-in
    for (const key in searchParameters) {
        const value = searchParameters[key];
        if (!is_1.default.string(value) && !is_1.default.number(value) && !is_1.default.boolean(value) && !is_1.default.null_(value) && !is_1.default.undefined(value)) {
            throw new TypeError(`The \`searchParams\` value '${String(value)}' must be a string, number, boolean or null`);
        }
    }
}
function isClientRequest(clientRequest) {
    return is_1.default.object(clientRequest) && !('statusCode' in clientRequest);
}
const cacheableStore = new weakable_map_1.default();
const waitForOpenFile = async (file) => new Promise((resolve, reject) => {
    const onError = (error) => {
        reject(error);
    };
    // Node.js 12 has incomplete types
    if (!file.pending) {
        resolve();
    }
    file.once('error', onError);
    file.once('ready', () => {
        file.off('error', onError);
        resolve();
    });
});
const redirectCodes = new Set([300, 301, 302, 303, 304, 307, 308]);
const nonEnumerableProperties = [
    'context',
    'body',
    'json',
    'form'
];
exports.setNonEnumerableProperties = (sources, to) => {
    // Non enumerable properties shall not be merged
    const properties = {};
    for (const source of sources) {
        if (!source) {
            continue;
        }
        for (const name of nonEnumerableProperties) {
            if (!(name in source)) {
                continue;
            }
            properties[name] = {
                writable: true,
                configurable: true,
                enumerable: false,
                // @ts-expect-error TS doesn't see the check above
                value: source[name]
            };
        }
    }
    Object.defineProperties(to, properties);
};
/**
An error to be thrown when a request fails.
Contains a `code` property with error class code, like `ECONNREFUSED`.
*/
class RequestError extends Error {
    constructor(message, error, self) {
        var _a;
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = 'RequestError';
        this.code = error.code;
        if (self instanceof Request) {
            Object.defineProperty(this, 'request', {
                enumerable: false,
                value: self
            });
            Object.defineProperty(this, 'response', {
                enumerable: false,
                value: self[kResponse]
            });
            Object.defineProperty(this, 'options', {
                // This fails because of TS 3.7.2 useDefineForClassFields
                // Ref: https://github.com/microsoft/TypeScript/issues/34972
                enumerable: false,
                value: self.options
            });
        }
        else {
            Object.defineProperty(this, 'options', {
                // This fails because of TS 3.7.2 useDefineForClassFields
                // Ref: https://github.com/microsoft/TypeScript/issues/34972
                enumerable: false,
                value: self
            });
        }
        this.timings = (_a = this.request) === null || _a === void 0 ? void 0 : _a.timings;
        // Recover the original stacktrace
        if (is_1.default.string(error.stack) && is_1.default.string(this.stack)) {
            const indexOfMessage = this.stack.indexOf(this.message) + this.message.length;
            const thisStackTrace = this.stack.slice(indexOfMessage).split('\n').reverse();
            const errorStackTrace = error.stack.slice(error.stack.indexOf(error.message) + error.message.length).split('\n').reverse();
            // Remove duplicated traces
            while (errorStackTrace.length !== 0 && errorStackTrace[0] === thisStackTrace[0]) {
                thisStackTrace.shift();
            }
            this.stack = `${this.stack.slice(0, indexOfMessage)}${thisStackTrace.reverse().join('\n')}${errorStackTrace.reverse().join('\n')}`;
        }
    }
}
exports.RequestError = RequestError;
/**
An error to be thrown when the server redirects you more than ten times.
Includes a `response` property.
*/
class MaxRedirectsError extends RequestError {
    constructor(request) {
        super(`Redirected ${request.options.maxRedirects} times. Aborting.`, {}, request);
        this.name = 'MaxRedirectsError';
    }
}
exports.MaxRedirectsError = MaxRedirectsError;
/**
An error to be thrown when the server response code is not 2xx nor 3xx if `options.followRedirect` is `true`, but always except for 304.
Includes a `response` property.
*/
class HTTPError extends RequestError {
    constructor(response) {
        super(`Response code ${response.statusCode} (${response.statusMessage})`, {}, response.request);
        this.name = 'HTTPError';
    }
}
exports.HTTPError = HTTPError;
/**
An error to be thrown when a cache method fails.
For example, if the database goes down or there's a filesystem error.
*/
class CacheError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'CacheError';
    }
}
exports.CacheError = CacheError;
/**
An error to be thrown when the request body is a stream and an error occurs while reading from that stream.
*/
class UploadError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'UploadError';
    }
}
exports.UploadError = UploadError;
/**
An error to be thrown when the request is aborted due to a timeout.
Includes an `event` and `timings` property.
*/
class TimeoutError extends RequestError {
    constructor(error, timings, request) {
        super(error.message, error, request);
        this.name = 'TimeoutError';
        this.event = error.event;
        this.timings = timings;
    }
}
exports.TimeoutError = TimeoutError;
/**
An error to be thrown when reading from response stream fails.
*/
class ReadError extends RequestError {
    constructor(error, request) {
        super(error.message, error, request);
        this.name = 'ReadError';
    }
}
exports.ReadError = ReadError;
/**
An error to be thrown when given an unsupported protocol.
*/
class UnsupportedProtocolError extends RequestError {
    constructor(options) {
        super(`Unsupported protocol "${options.url.protocol}"`, {}, options);
        this.name = 'UnsupportedProtocolError';
    }
}
exports.UnsupportedProtocolError = UnsupportedProtocolError;
const proxiedRequestEvents = [
    'socket',
    'connect',
    'continue',
    'information',
    'upgrade',
    'timeout'
];
class Request extends stream_1.Duplex {
    constructor(url, options = {}, defaults) {
        super({
            // This must be false, to enable throwing after destroy
            // It is used for retry logic in Promise API
            autoDestroy: false,
            // It needs to be zero because we're just proxying the data to another stream
            highWaterMark: 0
        });
        this[kDownloadedSize] = 0;
        this[kUploadedSize] = 0;
        this.requestInitialized = false;
        this[kServerResponsesPiped] = new Set();
        this.redirects = [];
        this[kStopReading] = false;
        this[kTriggerRead] = false;
        this[kJobs] = [];
        this.retryCount = 0;
        // TODO: Remove this when targeting Node.js >= 12
        this._progressCallbacks = [];
        const unlockWrite = () => this._unlockWrite();
        const lockWrite = () => this._lockWrite();
        this.on('pipe', (source) => {
            source.prependListener('data', unlockWrite);
            source.on('data', lockWrite);
            source.prependListener('end', unlockWrite);
            source.on('end', lockWrite);
        });
        this.on('unpipe', (source) => {
            source.off('data', unlockWrite);
            source.off('data', lockWrite);
            source.off('end', unlockWrite);
            source.off('end', lockWrite);
        });
        this.on('pipe', source => {
            if (source instanceof http_1.IncomingMessage) {
                this.options.headers = {
                    ...source.headers,
                    ...this.options.headers
                };
            }
        });
        const { json, body, form } = options;
        if (json || body || form) {
            this._lockWrite();
        }
        if (exports.kIsNormalizedAlready in options) {
            this.options = options;
        }
        else {
            try {
                // @ts-expect-error Common TypeScript bug saying that `this.constructor` is not accessible
                this.options = this.constructor.normalizeArguments(url, options, defaults);
            }
            catch (error) {
                // TODO: Move this to `_destroy()`
                if (is_1.default.nodeStream(options.body)) {
                    options.body.destroy();
                }
                this.destroy(error);
                return;
            }
        }
        (async () => {
            var _a;
            try {
                if (this.options.body instanceof fs_1.ReadStream) {
                    await waitForOpenFile(this.options.body);
                }
                const { url: normalizedURL } = this.options;
                if (!normalizedURL) {
                    throw new TypeError('Missing `url` property');
                }
                this.requestUrl = normalizedURL.toString();
                decodeURI(this.requestUrl);
                await this._finalizeBody();
                await this._makeRequest();
                if (this.destroyed) {
                    (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroy();
                    return;
                }
                // Queued writes etc.
                for (const job of this[kJobs]) {
                    job();
                }
                // Prevent memory leak
                this[kJobs].length = 0;
                this.requestInitialized = true;
            }
            catch (error) {
                if (error instanceof RequestError) {
                    this._beforeError(error);
                    return;
                }
                // This is a workaround for https://github.com/nodejs/node/issues/33335
                if (!this.destroyed) {
                    this.destroy(error);
                }
            }
        })();
    }
    static normalizeArguments(url, options, defaults) {
        var _a, _b, _c, _d, _e;
        const rawOptions = options;
        if (is_1.default.object(url) && !is_1.default.urlInstance(url)) {
            options = { ...defaults, ...url, ...options };
        }
        else {
            if (url && options && options.url !== undefined) {
                throw new TypeError('The `url` option is mutually exclusive with the `input` argument');
            }
            options = { ...defaults, ...options };
            if (url !== undefined) {
                options.url = url;
            }
            if (is_1.default.urlInstance(options.url)) {
                options.url = new url_1.URL(options.url.toString());
            }
        }
        // TODO: Deprecate URL options in Got 12.
        // Support extend-specific options
        if (options.cache === false) {
            options.cache = undefined;
        }
        if (options.dnsCache === false) {
            options.dnsCache = undefined;
        }
        // Nice type assertions
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.method);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.headers);
        is_1.assert.any([is_1.default.string, is_1.default.urlInstance, is_1.default.undefined], options.prefixUrl);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cookieJar);
        is_1.assert.any([is_1.default.object, is_1.default.string, is_1.default.undefined], options.searchParams);
        is_1.assert.any([is_1.default.object, is_1.default.string, is_1.default.undefined], options.cache);
        is_1.assert.any([is_1.default.object, is_1.default.number, is_1.default.undefined], options.timeout);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.context);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.hooks);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.decompress);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.ignoreInvalidCookies);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.followRedirect);
        is_1.assert.any([is_1.default.number, is_1.default.undefined], options.maxRedirects);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.throwHttpErrors);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.http2);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.allowGetBody);
        is_1.assert.any([is_1.default.string, is_1.default.undefined], options.localAddress);
        is_1.assert.any([dns_ip_version_1.isDnsLookupIpVersion, is_1.default.undefined], options.dnsLookupIpVersion);
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.https);
        is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.rejectUnauthorized);
        if (options.https) {
            is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.https.rejectUnauthorized);
            is_1.assert.any([is_1.default.function_, is_1.default.undefined], options.https.checkServerIdentity);
            is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.certificateAuthority);
            is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.key);
            is_1.assert.any([is_1.default.string, is_1.default.object, is_1.default.array, is_1.default.undefined], options.https.certificate);
            is_1.assert.any([is_1.default.string, is_1.default.undefined], options.https.passphrase);
            is_1.assert.any([is_1.default.string, is_1.default.buffer, is_1.default.array, is_1.default.undefined], options.https.pfx);
        }
        is_1.assert.any([is_1.default.object, is_1.default.undefined], options.cacheOptions);
        // `options.method`
        if (is_1.default.string(options.method)) {
            options.method = options.method.toUpperCase();
        }
        else {
            options.method = 'GET';
        }
        // `options.headers`
        if (options.headers === (defaults === null || defaults === void 0 ? void 0 : defaults.headers)) {
            options.headers = { ...options.headers };
        }
        else {
            options.headers = lowercaseKeys({ ...(defaults === null || defaults === void 0 ? void 0 : defaults.headers), ...options.headers });
        }
        // Disallow legacy `url.Url`
        if ('slashes' in options) {
            throw new TypeError('The legacy `url.Url` has been deprecated. Use `URL` instead.');
        }
        // `options.auth`
        if ('auth' in options) {
            throw new TypeError('Parameter `auth` is deprecated. Use `username` / `password` instead.');
        }
        // `options.searchParams`
        if ('searchParams' in options) {
            if (options.searchParams && options.searchParams !== (defaults === null || defaults === void 0 ? void 0 : defaults.searchParams)) {
                let searchParameters;
                if (is_1.default.string(options.searchParams) || (options.searchParams instanceof url_1.URLSearchParams)) {
                    searchParameters = new url_1.URLSearchParams(options.searchParams);
                }
                else {
                    validateSearchParameters(options.searchParams);
                    searchParameters = new url_1.URLSearchParams();
                    // eslint-disable-next-line guard-for-in
                    for (const key in options.searchParams) {
                        const value = options.searchParams[key];
                        if (value === null) {
                            searchParameters.append(key, '');
                        }
                        else if (value !== undefined) {
                            searchParameters.append(key, value);
                        }
                    }
                }
                // `normalizeArguments()` is also used to merge options
                (_a = defaults === null || defaults === void 0 ? void 0 : defaults.searchParams) === null || _a === void 0 ? void 0 : _a.forEach((value, key) => {
                    // Only use default if one isn't already defined
                    if (!searchParameters.has(key)) {
                        searchParameters.append(key, value);
                    }
                });
                options.searchParams = searchParameters;
            }
        }
        // `options.username` & `options.password`
        options.username = (_b = options.username) !== null && _b !== void 0 ? _b : '';
        options.password = (_c = options.password) !== null && _c !== void 0 ? _c : '';
        // `options.prefixUrl` & `options.url`
        if (is_1.default.undefined(options.prefixUrl)) {
            options.prefixUrl = (_d = defaults === null || defaults === void 0 ? void 0 : defaults.prefixUrl) !== null && _d !== void 0 ? _d : '';
        }
        else {
            options.prefixUrl = options.prefixUrl.toString();
            if (options.prefixUrl !== '' && !options.prefixUrl.endsWith('/')) {
                options.prefixUrl += '/';
            }
        }
        if (is_1.default.string(options.url)) {
            if (options.url.startsWith('/')) {
                throw new Error('`input` must not start with a slash when using `prefixUrl`');
            }
            options.url = options_to_url_1.default(options.prefixUrl + options.url, options);
        }
        else if ((is_1.default.undefined(options.url) && options.prefixUrl !== '') || options.protocol) {
            options.url = options_to_url_1.default(options.prefixUrl, options);
        }
        if (options.url) {
            if ('port' in options) {
                delete options.port;
            }
            // Make it possible to change `options.prefixUrl`
            let { prefixUrl } = options;
            Object.defineProperty(options, 'prefixUrl', {
                set: (value) => {
                    const url = options.url;
                    if (!url.href.startsWith(value)) {
                        throw new Error(`Cannot change \`prefixUrl\` from ${prefixUrl} to ${value}: ${url.href}`);
                    }
                    options.url = new url_1.URL(value + url.href.slice(prefixUrl.length));
                    prefixUrl = value;
                },
                get: () => prefixUrl
            });
            // Support UNIX sockets
            let { protocol } = options.url;
            if (protocol === 'unix:') {
                protocol = 'http:';
                options.url = new url_1.URL(`http://unix${options.url.pathname}${options.url.search}`);
            }
            // Set search params
            if (options.searchParams) {
                // eslint-disable-next-line @typescript-eslint/no-base-to-string
                options.url.search = options.searchParams.toString();
            }
            // Protocol check
            if (protocol !== 'http:' && protocol !== 'https:') {
                throw new UnsupportedProtocolError(options);
            }
            // Update `username`
            if (options.username === '') {
                options.username = options.url.username;
            }
            else {
                options.url.username = options.username;
            }
            // Update `password`
            if (options.password === '') {
                options.password = options.url.password;
            }
            else {
                options.url.password = options.password;
            }
        }
        // `options.cookieJar`
        const { cookieJar } = options;
        if (cookieJar) {
            let { setCookie, getCookieString } = cookieJar;
            is_1.assert.function_(setCookie);
            is_1.assert.function_(getCookieString);
            /* istanbul ignore next: Horrible `tough-cookie` v3 check */
            if (setCookie.length === 4 && getCookieString.length === 0) {
                setCookie = util_1.promisify(setCookie.bind(options.cookieJar));
                getCookieString = util_1.promisify(getCookieString.bind(options.cookieJar));
                options.cookieJar = {
                    setCookie,
                    getCookieString: getCookieString
                };
            }
        }
        // `options.cache`
        const { cache } = options;
        if (cache) {
            if (!cacheableStore.has(cache)) {
                cacheableStore.set(cache, new CacheableRequest(((requestOptions, handler) => {
                    const result = requestOptions[kRequest](requestOptions, handler);
                    // TODO: remove this when `cacheable-request` supports async request functions.
                    if (is_1.default.promise(result)) {
                        // @ts-expect-error
                        // We only need to implement the error handler in order to support HTTP2 caching.
                        // The result will be a promise anyway.
                        result.once = (event, handler) => {
                            if (event === 'error') {
                                result.catch(handler);
                            }
                            else if (event === 'abort') {
                                // The empty catch is needed here in case when
                                // it rejects before it's `await`ed in `_makeRequest`.
                                (async () => {
                                    try {
                                        const request = (await result);
                                        request.once('abort', handler);
                                    }
                                    catch (_a) { }
                                })();
                            }
                            else {
                                /* istanbul ignore next: safety check */
                                throw new Error(`Unknown HTTP2 promise event: ${event}`);
                            }
                            return result;
                        };
                    }
                    return result;
                }), cache));
            }
        }
        // `options.cacheOptions`
        options.cacheOptions = { ...options.cacheOptions };
        // `options.dnsCache`
        if (options.dnsCache === true) {
            options.dnsCache = globalDnsCache;
        }
        else if (!is_1.default.undefined(options.dnsCache) && !options.dnsCache.lookup) {
            throw new TypeError(`Parameter \`dnsCache\` must be a CacheableLookup instance or a boolean, got ${is_1.default(options.dnsCache)}`);
        }
        // `options.timeout`
        if (is_1.default.number(options.timeout)) {
            options.timeout = { request: options.timeout };
        }
        else if (defaults && options.timeout !== defaults.timeout) {
            options.timeout = {
                ...defaults.timeout,
                ...options.timeout
            };
        }
        else {
            options.timeout = { ...options.timeout };
        }
        // `options.context`
        if (!options.context) {
            options.context = {};
        }
        // `options.hooks`
        const areHooksDefault = options.hooks === (defaults === null || defaults === void 0 ? void 0 : defaults.hooks);
        options.hooks = { ...options.hooks };
        for (const event of exports.knownHookEvents) {
            if (event in options.hooks) {
                if (is_1.default.array(options.hooks[event])) {
                    // See https://github.com/microsoft/TypeScript/issues/31445#issuecomment-576929044
                    options.hooks[event] = [...options.hooks[event]];
                }
                else {
                    throw new TypeError(`Parameter \`${event}\` must be an Array, got ${is_1.default(options.hooks[event])}`);
                }
            }
            else {
                options.hooks[event] = [];
            }
        }
        if (defaults && !areHooksDefault) {
            for (const event of exports.knownHookEvents) {
                const defaultHooks = defaults.hooks[event];
                if (defaultHooks.length > 0) {
                    // See https://github.com/microsoft/TypeScript/issues/31445#issuecomment-576929044
                    options.hooks[event] = [
                        ...defaults.hooks[event],
                        ...options.hooks[event]
                    ];
                }
            }
        }
        // DNS options
        if ('family' in options) {
            deprecation_warning_1.default('"options.family" was never documented, please use "options.dnsLookupIpVersion"');
        }
        // HTTPS options
        if (defaults === null || defaults === void 0 ? void 0 : defaults.https) {
            options.https = { ...defaults.https, ...options.https };
        }
        if ('rejectUnauthorized' in options) {
            deprecation_warning_1.default('"options.rejectUnauthorized" is now deprecated, please use "options.https.rejectUnauthorized"');
        }
        if ('checkServerIdentity' in options) {
            deprecation_warning_1.default('"options.checkServerIdentity" was never documented, please use "options.https.checkServerIdentity"');
        }
        if ('ca' in options) {
            deprecation_warning_1.default('"options.ca" was never documented, please use "options.https.certificateAuthority"');
        }
        if ('key' in options) {
            deprecation_warning_1.default('"options.key" was never documented, please use "options.https.key"');
        }
        if ('cert' in options) {
            deprecation_warning_1.default('"options.cert" was never documented, please use "options.https.certificate"');
        }
        if ('passphrase' in options) {
            deprecation_warning_1.default('"options.passphrase" was never documented, please use "options.https.passphrase"');
        }
        if ('pfx' in options) {
            deprecation_warning_1.default('"options.pfx" was never documented, please use "options.https.pfx"');
        }
        // Other options
        if ('followRedirects' in options) {
            throw new TypeError('The `followRedirects` option does not exist. Use `followRedirect` instead.');
        }
        if (options.agent) {
            for (const key in options.agent) {
                if (key !== 'http' && key !== 'https' && key !== 'http2') {
                    throw new TypeError(`Expected the \`options.agent\` properties to be \`http\`, \`https\` or \`http2\`, got \`${key}\``);
                }
            }
        }
        options.maxRedirects = (_e = options.maxRedirects) !== null && _e !== void 0 ? _e : 0;
        // Set non-enumerable properties
        exports.setNonEnumerableProperties([defaults, rawOptions], options);
        return normalize_arguments_1.default(options, defaults);
    }
    _lockWrite() {
        const onLockedWrite = () => {
            throw new TypeError('The payload has been already provided');
        };
        this.write = onLockedWrite;
        this.end = onLockedWrite;
    }
    _unlockWrite() {
        this.write = super.write;
        this.end = super.end;
    }
    async _finalizeBody() {
        const { options } = this;
        const { headers } = options;
        const isForm = !is_1.default.undefined(options.form);
        const isJSON = !is_1.default.undefined(options.json);
        const isBody = !is_1.default.undefined(options.body);
        const hasPayload = isForm || isJSON || isBody;
        const cannotHaveBody = exports.withoutBody.has(options.method) && !(options.method === 'GET' && options.allowGetBody);
        this._cannotHaveBody = cannotHaveBody;
        if (hasPayload) {
            if (cannotHaveBody) {
                throw new TypeError(`The \`${options.method}\` method cannot be used with a body`);
            }
            if ([isBody, isForm, isJSON].filter(isTrue => isTrue).length > 1) {
                throw new TypeError('The `body`, `json` and `form` options are mutually exclusive');
            }
            if (isBody &&
                !(options.body instanceof stream_1.Readable) &&
                !is_1.default.string(options.body) &&
                !is_1.default.buffer(options.body) &&
                !is_form_data_1.default(options.body)) {
                throw new TypeError('The `body` option must be a stream.Readable, string or Buffer');
            }
            if (isForm && !is_1.default.object(options.form)) {
                throw new TypeError('The `form` option must be an Object');
            }
            {
                // Serialize body
                const noContentType = !is_1.default.string(headers['content-type']);
                if (isBody) {
                    // Special case for https://github.com/form-data/form-data
                    if (is_form_data_1.default(options.body) && noContentType) {
                        headers['content-type'] = `multipart/form-data; boundary=${options.body.getBoundary()}`;
                    }
                    this[kBody] = options.body;
                }
                else if (isForm) {
                    if (noContentType) {
                        headers['content-type'] = 'application/x-www-form-urlencoded';
                    }
                    this[kBody] = (new url_1.URLSearchParams(options.form)).toString();
                }
                else {
                    if (noContentType) {
                        headers['content-type'] = 'application/json';
                    }
                    this[kBody] = options.stringifyJson(options.json);
                }
                const uploadBodySize = await get_body_size_1.default(this[kBody], options.headers);
                // See https://tools.ietf.org/html/rfc7230#section-3.3.2
                // A user agent SHOULD send a Content-Length in a request message when
                // no Transfer-Encoding is sent and the request method defines a meaning
                // for an enclosed payload body.  For example, a Content-Length header
                // field is normally sent in a POST request even when the value is 0
                // (indicating an empty payload body).  A user agent SHOULD NOT send a
                // Content-Length header field when the request message does not contain
                // a payload body and the method semantics do not anticipate such a
                // body.
                if (is_1.default.undefined(headers['content-length']) && is_1.default.undefined(headers['transfer-encoding'])) {
                    if (!cannotHaveBody && !is_1.default.undefined(uploadBodySize)) {
                        headers['content-length'] = String(uploadBodySize);
                    }
                }
            }
        }
        else if (cannotHaveBody) {
            this._lockWrite();
        }
        else {
            this._unlockWrite();
        }
        this[kBodySize] = Number(headers['content-length']) || undefined;
    }
    async _onResponseBase(response) {
        const { options } = this;
        const { url } = options;
        this[kOriginalResponse] = response;
        if (options.decompress) {
            response = decompressResponse(response);
        }
        const statusCode = response.statusCode;
        const typedResponse = response;
        typedResponse.statusMessage = typedResponse.statusMessage ? typedResponse.statusMessage : http.STATUS_CODES[statusCode];
        typedResponse.url = options.url.toString();
        typedResponse.requestUrl = this.requestUrl;
        typedResponse.redirectUrls = this.redirects;
        typedResponse.request = this;
        typedResponse.isFromCache = response.fromCache || false;
        typedResponse.ip = this.ip;
        typedResponse.retryCount = this.retryCount;
        this[kIsFromCache] = typedResponse.isFromCache;
        this[kResponseSize] = Number(response.headers['content-length']) || undefined;
        this[kResponse] = response;
        response.once('end', () => {
            this[kResponseSize] = this[kDownloadedSize];
            this.emit('downloadProgress', this.downloadProgress);
        });
        response.once('error', (error) => {
            // Force clean-up, because some packages don't do this.
            // TODO: Fix decompress-response
            response.destroy();
            this._beforeError(new ReadError(error, this));
        });
        response.once('aborted', () => {
            this._beforeError(new ReadError({
                name: 'Error',
                message: 'The server aborted pending request',
                code: 'ECONNRESET'
            }, this));
        });
        this.emit('downloadProgress', this.downloadProgress);
        const rawCookies = response.headers['set-cookie'];
        if (is_1.default.object(options.cookieJar) && rawCookies) {
            let promises = rawCookies.map(async (rawCookie) => options.cookieJar.setCookie(rawCookie, url.toString()));
            if (options.ignoreInvalidCookies) {
                promises = promises.map(async (p) => p.catch(() => { }));
            }
            try {
                await Promise.all(promises);
            }
            catch (error) {
                this._beforeError(error);
                return;
            }
        }
        if (options.followRedirect && response.headers.location && redirectCodes.has(statusCode)) {
            // We're being redirected, we don't care about the response.
            // It'd be best to abort the request, but we can't because
            // we would have to sacrifice the TCP connection. We don't want that.
            response.resume();
            if (this[kRequest]) {
                this[kCancelTimeouts]();
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this[kRequest];
                this[kUnproxyEvents]();
            }
            const shouldBeGet = statusCode === 303 && options.method !== 'GET' && options.method !== 'HEAD';
            if (shouldBeGet || !options.methodRewriting) {
                // Server responded with "see other", indicating that the resource exists at another location,
                // and the client should request it from that location via GET or HEAD.
                options.method = 'GET';
                if ('body' in options) {
                    delete options.body;
                }
                if ('json' in options) {
                    delete options.json;
                }
                if ('form' in options) {
                    delete options.form;
                }
                this[kBody] = undefined;
                delete options.headers['content-length'];
            }
            if (this.redirects.length >= options.maxRedirects) {
                this._beforeError(new MaxRedirectsError(this));
                return;
            }
            try {
                // Do not remove. See https://github.com/sindresorhus/got/pull/214
                const redirectBuffer = Buffer.from(response.headers.location, 'binary').toString();
                // Handles invalid URLs. See https://github.com/sindresorhus/got/issues/604
                const redirectUrl = new url_1.URL(redirectBuffer, url);
                const redirectString = redirectUrl.toString();
                decodeURI(redirectString);
                // Redirecting to a different site, clear sensitive data.
                if (redirectUrl.hostname !== url.hostname || redirectUrl.port !== url.port) {
                    if ('host' in options.headers) {
                        delete options.headers.host;
                    }
                    if ('cookie' in options.headers) {
                        delete options.headers.cookie;
                    }
                    if ('authorization' in options.headers) {
                        delete options.headers.authorization;
                    }
                    if (options.username || options.password) {
                        options.username = '';
                        options.password = '';
                    }
                }
                else {
                    redirectUrl.username = options.username;
                    redirectUrl.password = options.password;
                }
                this.redirects.push(redirectString);
                options.url = redirectUrl;
                for (const hook of options.hooks.beforeRedirect) {
                    // eslint-disable-next-line no-await-in-loop
                    await hook(options, typedResponse);
                }
                this.emit('redirect', typedResponse, options);
                await this._makeRequest();
            }
            catch (error) {
                this._beforeError(error);
                return;
            }
            return;
        }
        if (options.isStream && options.throwHttpErrors && !is_response_ok_1.isResponseOk(typedResponse)) {
            this._beforeError(new HTTPError(typedResponse));
            return;
        }
        response.on('readable', () => {
            if (this[kTriggerRead]) {
                this._read();
            }
        });
        this.on('resume', () => {
            response.resume();
        });
        this.on('pause', () => {
            response.pause();
        });
        response.once('end', () => {
            this.push(null);
        });
        this.emit('response', response);
        for (const destination of this[kServerResponsesPiped]) {
            if (destination.headersSent) {
                continue;
            }
            // eslint-disable-next-line guard-for-in
            for (const key in response.headers) {
                const isAllowed = options.decompress ? key !== 'content-encoding' : true;
                const value = response.headers[key];
                if (isAllowed) {
                    destination.setHeader(key, value);
                }
            }
            destination.statusCode = statusCode;
        }
    }
    async _onResponse(response) {
        try {
            await this._onResponseBase(response);
        }
        catch (error) {
            /* istanbul ignore next: better safe than sorry */
            this._beforeError(error);
        }
    }
    _onRequest(request) {
        const { options } = this;
        const { timeout, url } = options;
        http_timer_1.default(request);
        this[kCancelTimeouts] = timed_out_1.default(request, timeout, url);
        const responseEventName = options.cache ? 'cacheableResponse' : 'response';
        request.once(responseEventName, (response) => {
            void this._onResponse(response);
        });
        request.once('error', (error) => {
            var _a;
            // Force clean-up, because some packages (e.g. nock) don't do this.
            request.destroy();
            // Node.js <= 12.18.2 mistakenly emits the response `end` first.
            (_a = request.res) === null || _a === void 0 ? void 0 : _a.removeAllListeners('end');
            error = error instanceof timed_out_1.TimeoutError ? new TimeoutError(error, this.timings, this) : new RequestError(error.message, error, this);
            this._beforeError(error);
        });
        this[kUnproxyEvents] = proxy_events_1.default(request, this, proxiedRequestEvents);
        this[kRequest] = request;
        this.emit('uploadProgress', this.uploadProgress);
        // Send body
        const body = this[kBody];
        const currentRequest = this.redirects.length === 0 ? this : request;
        if (is_1.default.nodeStream(body)) {
            body.pipe(currentRequest);
            body.once('error', (error) => {
                this._beforeError(new UploadError(error, this));
            });
        }
        else {
            this._unlockWrite();
            if (!is_1.default.undefined(body)) {
                this._writeRequest(body, undefined, () => { });
                currentRequest.end();
                this._lockWrite();
            }
            else if (this._cannotHaveBody || this._noPipe) {
                currentRequest.end();
                this._lockWrite();
            }
        }
        this.emit('request', request);
    }
    async _createCacheableRequest(url, options) {
        return new Promise((resolve, reject) => {
            // TODO: Remove `utils/url-to-options.ts` when `cacheable-request` is fixed
            Object.assign(options, url_to_options_1.default(url));
            // `http-cache-semantics` checks this
            // TODO: Fix this ignore.
            // @ts-expect-error
            delete options.url;
            let request;
            // This is ugly
            const cacheRequest = cacheableStore.get(options.cache)(options, async (response) => {
                // TODO: Fix `cacheable-response`
                response._readableState.autoDestroy = false;
                if (request) {
                    (await request).emit('cacheableResponse', response);
                }
                resolve(response);
            });
            // Restore options
            options.url = url;
            cacheRequest.once('error', reject);
            cacheRequest.once('request', async (requestOrPromise) => {
                request = requestOrPromise;
                resolve(request);
            });
        });
    }
    async _makeRequest() {
        var _a, _b, _c, _d, _e;
        const { options } = this;
        const { headers } = options;
        for (const key in headers) {
            if (is_1.default.undefined(headers[key])) {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete headers[key];
            }
            else if (is_1.default.null_(headers[key])) {
                throw new TypeError(`Use \`undefined\` instead of \`null\` to delete the \`${key}\` header`);
            }
        }
        if (options.decompress && is_1.default.undefined(headers['accept-encoding'])) {
            headers['accept-encoding'] = supportsBrotli ? 'gzip, deflate, br' : 'gzip, deflate';
        }
        // Set cookies
        if (options.cookieJar) {
            const cookieString = await options.cookieJar.getCookieString(options.url.toString());
            if (is_1.default.nonEmptyString(cookieString)) {
                options.headers.cookie = cookieString;
            }
        }
        for (const hook of options.hooks.beforeRequest) {
            // eslint-disable-next-line no-await-in-loop
            const result = await hook(options);
            if (!is_1.default.undefined(result)) {
                // @ts-expect-error Skip the type mismatch to support abstract responses
                options.request = () => result;
                break;
            }
        }
        if (options.body && this[kBody] !== options.body) {
            this[kBody] = options.body;
        }
        const { agent, request, timeout, url } = options;
        if (options.dnsCache && !('lookup' in options)) {
            options.lookup = options.dnsCache.lookup;
        }
        // UNIX sockets
        if (url.hostname === 'unix') {
            const matches = /(?<socketPath>.+?):(?<path>.+)/.exec(`${url.pathname}${url.search}`);
            if (matches === null || matches === void 0 ? void 0 : matches.groups) {
                const { socketPath, path } = matches.groups;
                Object.assign(options, {
                    socketPath,
                    path,
                    host: ''
                });
            }
        }
        const isHttps = url.protocol === 'https:';
        // Fallback function
        let fallbackFn;
        if (options.http2) {
            fallbackFn = http2wrapper.auto;
        }
        else {
            fallbackFn = isHttps ? https.request : http.request;
        }
        const realFn = (_a = options.request) !== null && _a !== void 0 ? _a : fallbackFn;
        // Cache support
        const fn = options.cache ? this._createCacheableRequest : realFn;
        // Pass an agent directly when HTTP2 is disabled
        if (agent && !options.http2) {
            options.agent = agent[isHttps ? 'https' : 'http'];
        }
        // Prepare plain HTTP request options
        options[kRequest] = realFn;
        delete options.request;
        // TODO: Fix this ignore.
        // @ts-expect-error
        delete options.timeout;
        const requestOptions = options;
        requestOptions.shared = (_b = options.cacheOptions) === null || _b === void 0 ? void 0 : _b.shared;
        requestOptions.cacheHeuristic = (_c = options.cacheOptions) === null || _c === void 0 ? void 0 : _c.cacheHeuristic;
        requestOptions.immutableMinTimeToLive = (_d = options.cacheOptions) === null || _d === void 0 ? void 0 : _d.immutableMinTimeToLive;
        requestOptions.ignoreCargoCult = (_e = options.cacheOptions) === null || _e === void 0 ? void 0 : _e.ignoreCargoCult;
        // If `dnsLookupIpVersion` is not present do not override `family`
        if (options.dnsLookupIpVersion !== undefined) {
            try {
                requestOptions.family = dns_ip_version_1.dnsLookupIpVersionToFamily(options.dnsLookupIpVersion);
            }
            catch (_f) {
                throw new Error('Invalid `dnsLookupIpVersion` option value');
            }
        }
        // HTTPS options remapping
        if (options.https) {
            if ('rejectUnauthorized' in options.https) {
                requestOptions.rejectUnauthorized = options.https.rejectUnauthorized;
            }
            if (options.https.checkServerIdentity) {
                requestOptions.checkServerIdentity = options.https.checkServerIdentity;
            }
            if (options.https.certificateAuthority) {
                requestOptions.ca = options.https.certificateAuthority;
            }
            if (options.https.certificate) {
                requestOptions.cert = options.https.certificate;
            }
            if (options.https.key) {
                requestOptions.key = options.https.key;
            }
            if (options.https.passphrase) {
                requestOptions.passphrase = options.https.passphrase;
            }
            if (options.https.pfx) {
                requestOptions.pfx = options.https.pfx;
            }
        }
        try {
            let requestOrResponse = await fn(url, requestOptions);
            if (is_1.default.undefined(requestOrResponse)) {
                requestOrResponse = fallbackFn(url, requestOptions);
            }
            // Restore options
            options.request = request;
            options.timeout = timeout;
            options.agent = agent;
            // HTTPS options restore
            if (options.https) {
                if ('rejectUnauthorized' in options.https) {
                    delete requestOptions.rejectUnauthorized;
                }
                if (options.https.checkServerIdentity) {
                    // @ts-expect-error - This one will be removed when we remove the alias.
                    delete requestOptions.checkServerIdentity;
                }
                if (options.https.certificateAuthority) {
                    delete requestOptions.ca;
                }
                if (options.https.certificate) {
                    delete requestOptions.cert;
                }
                if (options.https.key) {
                    delete requestOptions.key;
                }
                if (options.https.passphrase) {
                    delete requestOptions.passphrase;
                }
                if (options.https.pfx) {
                    delete requestOptions.pfx;
                }
            }
            if (isClientRequest(requestOrResponse)) {
                this._onRequest(requestOrResponse);
                // Emit the response after the stream has been ended
            }
            else if (this.writable) {
                this.once('finish', () => {
                    void this._onResponse(requestOrResponse);
                });
                this._unlockWrite();
                this.end();
                this._lockWrite();
            }
            else {
                void this._onResponse(requestOrResponse);
            }
        }
        catch (error) {
            if (error instanceof CacheableRequest.CacheError) {
                throw new CacheError(error, this);
            }
            throw new RequestError(error.message, error, this);
        }
    }
    async _error(error) {
        try {
            for (const hook of this.options.hooks.beforeError) {
                // eslint-disable-next-line no-await-in-loop
                error = await hook(error);
            }
        }
        catch (error_) {
            error = new RequestError(error_.message, error_, this);
        }
        this.destroy(error);
    }
    _beforeError(error) {
        if (this[kStopReading]) {
            return;
        }
        const { options } = this;
        const retryCount = this.retryCount + 1;
        this[kStopReading] = true;
        if (!(error instanceof RequestError)) {
            error = new RequestError(error.message, error, this);
        }
        const typedError = error;
        const { response } = typedError;
        void (async () => {
            if (response && !response.body) {
                response.setEncoding(this._readableState.encoding);
                try {
                    response.rawBody = await get_buffer_1.default(response);
                    response.body = response.rawBody.toString();
                }
                catch (_a) { }
            }
            if (this.listenerCount('retry') !== 0) {
                let backoff;
                try {
                    let retryAfter;
                    if (response && 'retry-after' in response.headers) {
                        retryAfter = Number(response.headers['retry-after']);
                        if (Number.isNaN(retryAfter)) {
                            retryAfter = Date.parse(response.headers['retry-after']) - Date.now();
                            if (retryAfter <= 0) {
                                retryAfter = 1;
                            }
                        }
                        else {
                            retryAfter *= 1000;
                        }
                    }
                    backoff = await options.retry.calculateDelay({
                        attemptCount: retryCount,
                        retryOptions: options.retry,
                        error: typedError,
                        retryAfter,
                        computedValue: calculate_retry_delay_1.default({
                            attemptCount: retryCount,
                            retryOptions: options.retry,
                            error: typedError,
                            retryAfter,
                            computedValue: 0
                        })
                    });
                }
                catch (error_) {
                    void this._error(new RequestError(error_.message, error_, this));
                    return;
                }
                if (backoff) {
                    const retry = async () => {
                        try {
                            for (const hook of this.options.hooks.beforeRetry) {
                                // eslint-disable-next-line no-await-in-loop
                                await hook(this.options, typedError, retryCount);
                            }
                        }
                        catch (error_) {
                            void this._error(new RequestError(error_.message, error, this));
                            return;
                        }
                        // Something forced us to abort the retry
                        if (this.destroyed) {
                            return;
                        }
                        this.destroy();
                        this.emit('retry', retryCount, error);
                    };
                    this[kRetryTimeout] = setTimeout(retry, backoff);
                    return;
                }
            }
            void this._error(typedError);
        })();
    }
    _read() {
        this[kTriggerRead] = true;
        const response = this[kResponse];
        if (response && !this[kStopReading]) {
            // We cannot put this in the `if` above
            // because `.read()` also triggers the `end` event
            if (response.readableLength) {
                this[kTriggerRead] = false;
            }
            let data;
            while ((data = response.read()) !== null) {
                this[kDownloadedSize] += data.length;
                this[kStartedReading] = true;
                const progress = this.downloadProgress;
                if (progress.percent < 1) {
                    this.emit('downloadProgress', progress);
                }
                this.push(data);
            }
        }
    }
    // Node.js 12 has incorrect types, so the encoding must be a string
    _write(chunk, encoding, callback) {
        const write = () => {
            this._writeRequest(chunk, encoding, callback);
        };
        if (this.requestInitialized) {
            write();
        }
        else {
            this[kJobs].push(write);
        }
    }
    _writeRequest(chunk, encoding, callback) {
        if (this[kRequest].destroyed) {
            // Probably the `ClientRequest` instance will throw
            return;
        }
        this._progressCallbacks.push(() => {
            this[kUploadedSize] += Buffer.byteLength(chunk, encoding);
            const progress = this.uploadProgress;
            if (progress.percent < 1) {
                this.emit('uploadProgress', progress);
            }
        });
        // TODO: What happens if it's from cache? Then this[kRequest] won't be defined.
        this[kRequest].write(chunk, encoding, (error) => {
            if (!error && this._progressCallbacks.length > 0) {
                this._progressCallbacks.shift()();
            }
            callback(error);
        });
    }
    _final(callback) {
        const endRequest = () => {
            // FIX: Node.js 10 calls the write callback AFTER the end callback!
            while (this._progressCallbacks.length !== 0) {
                this._progressCallbacks.shift()();
            }
            // We need to check if `this[kRequest]` is present,
            // because it isn't when we use cache.
            if (!(kRequest in this)) {
                callback();
                return;
            }
            if (this[kRequest].destroyed) {
                callback();
                return;
            }
            this[kRequest].end((error) => {
                if (!error) {
                    this[kBodySize] = this[kUploadedSize];
                    this.emit('uploadProgress', this.uploadProgress);
                    this[kRequest].emit('upload-complete');
                }
                callback(error);
            });
        };
        if (this.requestInitialized) {
            endRequest();
        }
        else {
            this[kJobs].push(endRequest);
        }
    }
    _destroy(error, callback) {
        var _a;
        this[kStopReading] = true;
        // Prevent further retries
        clearTimeout(this[kRetryTimeout]);
        if (kRequest in this) {
            this[kCancelTimeouts]();
            // TODO: Remove the next `if` when these get fixed:
            // - https://github.com/nodejs/node/issues/32851
            if (!((_a = this[kResponse]) === null || _a === void 0 ? void 0 : _a.complete)) {
                this[kRequest].destroy();
            }
        }
        if (error !== null && !is_1.default.undefined(error) && !(error instanceof RequestError)) {
            error = new RequestError(error.message, error, this);
        }
        callback(error);
    }
    get _isAboutToError() {
        return this[kStopReading];
    }
    /**
    The remote IP address.
    */
    get ip() {
        var _a;
        return (_a = this.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress;
    }
    /**
    Indicates whether the request has been aborted or not.
    */
    get aborted() {
        var _a, _b, _c;
        return ((_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.destroyed) !== null && _b !== void 0 ? _b : this.destroyed) && !((_c = this[kOriginalResponse]) === null || _c === void 0 ? void 0 : _c.complete);
    }
    get socket() {
        var _a, _b;
        return (_b = (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.socket) !== null && _b !== void 0 ? _b : undefined;
    }
    /**
    Progress event for downloading (receiving a response).
    */
    get downloadProgress() {
        let percent;
        if (this[kResponseSize]) {
            percent = this[kDownloadedSize] / this[kResponseSize];
        }
        else if (this[kResponseSize] === this[kDownloadedSize]) {
            percent = 1;
        }
        else {
            percent = 0;
        }
        return {
            percent,
            transferred: this[kDownloadedSize],
            total: this[kResponseSize]
        };
    }
    /**
    Progress event for uploading (sending a request).
    */
    get uploadProgress() {
        let percent;
        if (this[kBodySize]) {
            percent = this[kUploadedSize] / this[kBodySize];
        }
        else if (this[kBodySize] === this[kUploadedSize]) {
            percent = 1;
        }
        else {
            percent = 0;
        }
        return {
            percent,
            transferred: this[kUploadedSize],
            total: this[kBodySize]
        };
    }
    /**
    The object contains the following properties:

    - `start` - Time when the request started.
    - `socket` - Time when a socket was assigned to the request.
    - `lookup` - Time when the DNS lookup finished.
    - `connect` - Time when the socket successfully connected.
    - `secureConnect` - Time when the socket securely connected.
    - `upload` - Time when the request finished uploading.
    - `response` - Time when the request fired `response` event.
    - `end` - Time when the response fired `end` event.
    - `error` - Time when the request fired `error` event.
    - `abort` - Time when the request fired `abort` event.
    - `phases`
        - `wait` - `timings.socket - timings.start`
        - `dns` - `timings.lookup - timings.socket`
        - `tcp` - `timings.connect - timings.lookup`
        - `tls` - `timings.secureConnect - timings.connect`
        - `request` - `timings.upload - (timings.secureConnect || timings.connect)`
        - `firstByte` - `timings.response - timings.upload`
        - `download` - `timings.end - timings.response`
        - `total` - `(timings.end || timings.error || timings.abort) - timings.start`

    If something has not been measured yet, it will be `undefined`.

    __Note__: The time is a `number` representing the milliseconds elapsed since the UNIX epoch.
    */
    get timings() {
        var _a;
        return (_a = this[kRequest]) === null || _a === void 0 ? void 0 : _a.timings;
    }
    /**
    Whether the response was retrieved from the cache.
    */
    get isFromCache() {
        return this[kIsFromCache];
    }
    pipe(destination, options) {
        if (this[kStartedReading]) {
            throw new Error('Failed to pipe. The response has been emitted already.');
        }
        if (destination instanceof http_1.ServerResponse) {
            this[kServerResponsesPiped].add(destination);
        }
        return super.pipe(destination, options);
    }
    unpipe(destination) {
        if (destination instanceof http_1.ServerResponse) {
            this[kServerResponsesPiped].delete(destination);
        }
        super.unpipe(destination);
        return this;
    }
}
exports.default = Request;


/***/ }),

/***/ 950:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const url = __webpack_require__(835);
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = url.parse(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 953:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var os = __webpack_require__(87);
var fs = __webpack_require__(747);

common.register('tempdir', _tempDir, {
  allowGlobbing: false,
  wrapOutput: false,
});

// Returns false if 'dir' is not a writeable directory, 'dir' otherwise
function writeableDir(dir) {
  if (!dir || !fs.existsSync(dir)) return false;

  if (!common.statFollowLinks(dir).isDirectory()) return false;

  var testFile = dir + '/' + common.randomFileName();
  try {
    fs.writeFileSync(testFile, ' ');
    common.unlinkSync(testFile);
    return dir;
  } catch (e) {
    /* istanbul ignore next */
    return false;
  }
}

// Variable to cache the tempdir value for successive lookups.
var cachedTempDir;

//@
//@ ### tempdir()
//@
//@ Examples:
//@
//@ ```javascript
//@ var tmp = tempdir(); // "/tmp" for most *nix platforms
//@ ```
//@
//@ Searches and returns string containing a writeable, platform-dependent temporary directory.
//@ Follows Python's [tempfile algorithm](http://docs.python.org/library/tempfile.html#tempfile.tempdir).
function _tempDir() {
  if (cachedTempDir) return cachedTempDir;

  cachedTempDir = writeableDir(os.tmpdir()) ||
                  writeableDir(process.env.TMPDIR) ||
                  writeableDir(process.env.TEMP) ||
                  writeableDir(process.env.TMP) ||
                  writeableDir(process.env.Wimp$ScrapDir) || // RiscOS
                  writeableDir('C:\\TEMP') || // Windows
                  writeableDir('C:\\TMP') || // Windows
                  writeableDir('\\TEMP') || // Windows
                  writeableDir('\\TMP') || // Windows
                  writeableDir('/tmp') ||
                  writeableDir('/var/tmp') ||
                  writeableDir('/usr/tmp') ||
                  writeableDir('.'); // last resort

  return cachedTempDir;
}

// Indicates if the tempdir value is currently cached. This is exposed for tests
// only. The return value should only be tested for truthiness.
function isCached() {
  return cachedTempDir;
}

// Clears the cached tempDir value, if one is cached. This is exposed for tests
// only.
function clearCache() {
  cachedTempDir = undefined;
}

module.exports.tempDir = _tempDir;
module.exports.isCached = isCached;
module.exports.clearCache = clearCache;


/***/ }),

/***/ 966:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const {PassThrough: PassThroughStream} = __webpack_require__(794);

module.exports = options => {
	options = {...options};

	const {array} = options;
	let {encoding} = options;
	const isBuffer = encoding === 'buffer';
	let objectMode = false;

	if (array) {
		objectMode = !(encoding || isBuffer);
	} else {
		encoding = encoding || 'utf8';
	}

	if (isBuffer) {
		encoding = null;
	}

	const stream = new PassThroughStream({objectMode});

	if (encoding) {
		stream.setEncoding(encoding);
	}

	let length = 0;
	const chunks = [];

	stream.on('data', chunk => {
		chunks.push(chunk);

		if (objectMode) {
			length = chunks.length;
		} else {
			length += chunk.length;
		}
	});

	stream.getBufferedValue = () => {
		if (array) {
			return chunks;
		}

		return isBuffer ? Buffer.concat(chunks, length) : chunks.join('');
	};

	stream.getBufferedLength = () => length;

	return stream;
};


/***/ }),

/***/ 988:
/***/ (function(module, __unusedexports, __webpack_require__) {

"use strict";

const http = __webpack_require__(605);
const https = __webpack_require__(211);
const resolveALPN = __webpack_require__(524);
const QuickLRU = __webpack_require__(904);
const Http2ClientRequest = __webpack_require__(181);
const calculateServerName = __webpack_require__(751);
const urlToOptions = __webpack_require__(507);

const cache = new QuickLRU({maxSize: 100});
const queue = new Map();

const installSocket = (agent, socket, options) => {
	socket._httpMessage = {shouldKeepAlive: true};

	const onFree = () => {
		agent.emit('free', socket, options);
	};

	socket.on('free', onFree);

	const onClose = () => {
		agent.removeSocket(socket, options);
	};

	socket.on('close', onClose);

	const onRemove = () => {
		agent.removeSocket(socket, options);
		socket.off('close', onClose);
		socket.off('free', onFree);
		socket.off('agentRemove', onRemove);
	};

	socket.on('agentRemove', onRemove);

	agent.emit('free', socket, options);
};

const resolveProtocol = async options => {
	const name = `${options.host}:${options.port}:${options.ALPNProtocols.sort()}`;

	if (!cache.has(name)) {
		if (queue.has(name)) {
			const result = await queue.get(name);
			return result.alpnProtocol;
		}

		const {path, agent} = options;
		options.path = options.socketPath;

		const resultPromise = resolveALPN(options);
		queue.set(name, resultPromise);

		try {
			const {socket, alpnProtocol} = await resultPromise;
			cache.set(name, alpnProtocol);

			options.path = path;

			if (alpnProtocol === 'h2') {
				// https://github.com/nodejs/node/issues/33343
				socket.destroy();
			} else {
				const {globalAgent} = https;
				const defaultCreateConnection = https.Agent.prototype.createConnection;

				if (agent) {
					if (agent.createConnection === defaultCreateConnection) {
						installSocket(agent, socket, options);
					} else {
						socket.destroy();
					}
				} else if (globalAgent.createConnection === defaultCreateConnection) {
					installSocket(globalAgent, socket, options);
				} else {
					socket.destroy();
				}
			}

			queue.delete(name);

			return alpnProtocol;
		} catch (error) {
			queue.delete(name);

			throw error;
		}
	}

	return cache.get(name);
};

module.exports = async (input, options, callback) => {
	if (typeof input === 'string' || input instanceof URL) {
		input = urlToOptions(new URL(input));
	}

	if (typeof options === 'function') {
		callback = options;
		options = undefined;
	}

	options = {
		ALPNProtocols: ['h2', 'http/1.1'],
		...input,
		...options,
		resolveSocket: true
	};

	if (!Array.isArray(options.ALPNProtocols) || options.ALPNProtocols.length === 0) {
		throw new Error('The `ALPNProtocols` option must be an Array with at least one entry');
	}

	options.protocol = options.protocol || 'https:';
	const isHttps = options.protocol === 'https:';

	options.host = options.hostname || options.host || 'localhost';
	options.session = options.tlsSession;
	options.servername = options.servername || calculateServerName(options);
	options.port = options.port || (isHttps ? 443 : 80);
	options._defaultAgent = isHttps ? https.globalAgent : http.globalAgent;

	const agents = options.agent;

	if (agents) {
		if (agents.addRequest) {
			throw new Error('The `options.agent` object can contain only `http`, `https` or `http2` properties');
		}

		options.agent = agents[isHttps ? 'https' : 'http'];
	}

	if (isHttps) {
		const protocol = await resolveProtocol(options);

		if (protocol === 'h2') {
			if (agents) {
				options.agent = agents.http2;
			}

			return new Http2ClientRequest(options, callback);
		}
	}

	return http.request(options, callback);
};

module.exports.protocolCache = cache;


/***/ }),

/***/ 989:
/***/ (function(module, __unusedexports, __webpack_require__) {

var common = __webpack_require__(602);
var fs = __webpack_require__(747);

common.register('sed', _sed, {
  globStart: 3, // don't glob-expand regexes
  canReceivePipe: true,
  cmdOptions: {
    'i': 'inplace',
  },
});

//@
//@ ### sed([options,] search_regex, replacement, file [, file ...])
//@ ### sed([options,] search_regex, replacement, file_array)
//@
//@ Available options:
//@
//@ + `-i`: Replace contents of `file` in-place. _Note that no backups will be created!_
//@
//@ Examples:
//@
//@ ```javascript
//@ sed('-i', 'PROGRAM_VERSION', 'v0.1.3', 'source.js');
//@ sed(/.*DELETE_THIS_LINE.*\n/, '', 'source.js');
//@ ```
//@
//@ Reads an input string from `file`s, and performs a JavaScript `replace()` on the input
//@ using the given `search_regex` and `replacement` string or function. Returns the new string after replacement.
//@
//@ Note:
//@
//@ Like unix `sed`, ShellJS `sed` supports capture groups. Capture groups are specified
//@ using the `$n` syntax:
//@
//@ ```javascript
//@ sed(/(\w+)\s(\w+)/, '$2, $1', 'file.txt');
//@ ```
function _sed(options, regex, replacement, files) {
  // Check if this is coming from a pipe
  var pipe = common.readFromPipe();

  if (typeof replacement !== 'string' && typeof replacement !== 'function') {
    if (typeof replacement === 'number') {
      replacement = replacement.toString(); // fallback
    } else {
      common.error('invalid replacement string');
    }
  }

  // Convert all search strings to RegExp
  if (typeof regex === 'string') {
    regex = RegExp(regex);
  }

  if (!files && !pipe) {
    common.error('no files given');
  }

  files = [].slice.call(arguments, 3);

  if (pipe) {
    files.unshift('-');
  }

  var sed = [];
  files.forEach(function (file) {
    if (!fs.existsSync(file) && file !== '-') {
      common.error('no such file or directory: ' + file, 2, { continue: true });
      return;
    }

    var contents = file === '-' ? pipe : fs.readFileSync(file, 'utf8');
    var lines = contents.split('\n');
    var result = lines.map(function (line) {
      return line.replace(regex, replacement);
    }).join('\n');

    sed.push(result);

    if (options.inplace) {
      fs.writeFileSync(file, result, 'utf8');
    }
  });

  return sed.join('\n');
}
module.exports = _sed;


/***/ }),

/***/ 992:
/***/ (function(__unusedmodule, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const is_1 = __webpack_require__(534);
const normalizeArguments = (options, defaults) => {
    if (is_1.default.null_(options.encoding)) {
        throw new TypeError('To get a Buffer, set `options.responseType` to `buffer` instead');
    }
    is_1.assert.any([is_1.default.string, is_1.default.undefined], options.encoding);
    is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.resolveBodyOnly);
    is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.methodRewriting);
    is_1.assert.any([is_1.default.boolean, is_1.default.undefined], options.isStream);
    is_1.assert.any([is_1.default.string, is_1.default.undefined], options.responseType);
    // `options.responseType`
    if (options.responseType === undefined) {
        options.responseType = 'text';
    }
    // `options.retry`
    const { retry } = options;
    if (defaults) {
        options.retry = { ...defaults.retry };
    }
    else {
        options.retry = {
            calculateDelay: retryObject => retryObject.computedValue,
            limit: 0,
            methods: [],
            statusCodes: [],
            errorCodes: [],
            maxRetryAfter: undefined
        };
    }
    if (is_1.default.object(retry)) {
        options.retry = {
            ...options.retry,
            ...retry
        };
        options.retry.methods = [...new Set(options.retry.methods.map(method => method.toUpperCase()))];
        options.retry.statusCodes = [...new Set(options.retry.statusCodes)];
        options.retry.errorCodes = [...new Set(options.retry.errorCodes)];
    }
    else if (is_1.default.number(retry)) {
        options.retry.limit = retry;
    }
    if (is_1.default.undefined(options.retry.maxRetryAfter)) {
        options.retry.maxRetryAfter = Math.min(
        // TypeScript is not smart enough to handle `.filter(x => is.number(x))`.
        // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
        ...[options.timeout.request, options.timeout.connect].filter(is_1.default.number));
    }
    // `options.pagination`
    if (is_1.default.object(options.pagination)) {
        if (defaults) {
            options.pagination = {
                ...defaults.pagination,
                ...options.pagination
            };
        }
        const { pagination } = options;
        if (!is_1.default.function_(pagination.transform)) {
            throw new Error('`options.pagination.transform` must be implemented');
        }
        if (!is_1.default.function_(pagination.shouldContinue)) {
            throw new Error('`options.pagination.shouldContinue` must be implemented');
        }
        if (!is_1.default.function_(pagination.filter)) {
            throw new TypeError('`options.pagination.filter` must be implemented');
        }
        if (!is_1.default.function_(pagination.paginate)) {
            throw new Error('`options.pagination.paginate` must be implemented');
        }
    }
    // JSON mode
    if (options.responseType === 'json' && options.headers.accept === undefined) {
        options.headers.accept = 'application/json';
    }
    return options;
};
exports.default = normalizeArguments;


/***/ })

/******/ },
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ 	"use strict";
/******/ 
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	!function() {
/******/ 		__webpack_require__.nmd = function(module) {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			Object.defineProperty(module, 'loaded', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.l; }
/******/ 			});
/******/ 			Object.defineProperty(module, 'id', {
/******/ 				enumerable: true,
/******/ 				get: function() { return module.i; }
/******/ 			});
/******/ 			return module;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ }
);
//# sourceMappingURL=index.js.map