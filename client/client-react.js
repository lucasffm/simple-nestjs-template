/*jshint esversion: 6 */
/*global fetch, btoa */
import Q from 'q';
/**
 * Sample API with NestJS
 * @class Test
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
let Test = (function() {
    'use strict';

    function Test(options) {
        let domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.apiKey = (typeof options === 'object') ? (options.apiKey ? options.apiKey : {}) : {};
    }

    function serializeQueryParams(parameters) {
        let str = [];
        for (let p in parameters) {
            if (parameters.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(parameters[p]));
            }
        }
        return str.join('&');
    }

    function mergeQueryParams(parameters, queryParameters) {
        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    let parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }
        return queryParameters;
    }

    /**
     * HTTP Request
     * @method
     * @name Test#request
     * @param {string} method - http method
     * @param {string} url - url to do request
     * @param {object} parameters
     * @param {object} body - body parameters / object
     * @param {object} headers - header parameters
     * @param {object} queryParameters - querystring parameters
     * @param {object} form - form data object
     * @param {object} deferred - promise object
     */
    Test.prototype.request = function(method, url, parameters, body, headers, queryParameters, form, deferred) {
        const queryParams = queryParameters && Object.keys(queryParameters).length ? serializeQueryParams(queryParameters) : null;
        const urlWithParams = url + (queryParams ? '?' + queryParams : '');

        if (body && !Object.keys(body).length) {
            body = undefined;
        }

        fetch(urlWithParams, {
            method,
            headers,
            body: JSON.stringify(body)
        }).then((response) => {
            return response.json();
        }).then((body) => {
            deferred.resolve(body);
        }).catch((error) => {
            deferred.reject(error);
        });
    };

    /**
     * Set Api Key
     * @method
     * @name Test#setApiKey
     * @param {string} value - apiKey's value
     * @param {string} headerOrQueryName - the header or query name to send the apiKey at
     * @param {boolean} isQuery - true if send the apiKey as query param, otherwise, send as header param
     */
    Test.prototype.setApiKey = function(value, headerOrQueryName, isQuery) {
        this.apiKey.value = value;
        this.apiKey.headerOrQueryName = headerOrQueryName;
        this.apiKey.isQuery = isQuery;
    };
    /**
     * Set Auth headers
     * @method
     * @name Test#setAuthHeaders
     * @param {object} headerParams - headers object
     */
    Test.prototype.setAuthHeaders = function(headerParams) {
        let headers = headerParams ? headerParams : {};
        if (!this.apiKey.isQuery && this.apiKey.headerOrQueryName) {
            headers[this.apiKey.headerOrQueryName] = this.apiKey.value;
        }
        return headers;
    };

    /**
     * Retrieve many User
     * @method
     * @name Test#getUsers
     * @param {object} parameters - method options and parameters
     * @param {string} parameters.fields - <h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?fields=field1,field2,...</strong> <br/><i>Example:</i> <strong>?fields=email,name</strong>
     * @param {string} parameters.filter - <h4>Adds fields request condition (multiple conditions) to the request.</h4><i>Syntax:</i> <strong>?filter=field||condition||value</strong><br/><i>Examples:</i> <ul><li><strong>?filter=name||eq||batman</strong></li><li><strong>?filter=isVillain||eq||false&filter=city||eq||Arkham</strong> (multiple filters are treated as a combination of AND type of conditions)</li><li><strong>?filter=shots||in||12,26</strong> (some conditions accept multiple values separated by commas)</li><li><strong>?filter=power||isnull</strong> (some conditions don't accept value)</li></ul><br/>Filter Conditions:<ul><li><strong><code>eq</code></strong> (<code>=</code>, equal)</li><li><strong><code>ne</code></strong> (<code>!=</code>, not equal)</li><li><strong><code>gt</code></strong> (<code>&gt;</code>, greater than)</li><li><strong><code>lt</code></strong> (<code>&lt;</code>, lower that)</li><li><strong><code>gte</code></strong> (<code>&gt;=</code>, greater than or equal)</li><li><strong><code>lte</code></strong> (<code>&lt;=</code>, lower than or equal)</li><li><strong><code>starts</code></strong> (<code>LIKE val%</code>, starts with)</li><li><strong><code>ends</code></strong> (<code>LIKE %val</code>, ends with)</li><li><strong><code>cont</code></strong> (<code>LIKE %val%</code>, contains)</li><li><strong><code>excl</code></strong> (<code>NOT LIKE %val%</code>, not contains)</li><li><strong><code>in</code></strong> (<code>IN</code>, in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>notin</code></strong> (<code>NOT IN</code>, not in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>isnull</code></strong> (<code>IS NULL</code>, is NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>notnull</code></strong> (<code>IS NOT NULL</code>, not NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>between</code></strong> (<code>BETWEEN</code>, between, <strong><em>accepts two values</em></strong>)</li></ul>
     * @param {string} parameters.or - <h4>Adds <code>OR</code> conditions to the request.</h4><i>Syntax:</i> <strong>?or=field||condition||value</strong><br/>It uses the same conditions as the filter parameter<br/><i>Rules and <i>Examples:</i></i><ul><li>If there is only <strong>one</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as simple filter:</li><ul><li><strong>?or=name||eq||batman</strong></li></ul></ul><ul><li>If there are <strong>multiple</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as a compination of <code>OR</code> conditions, as follows:<br><code>WHERE {or} OR {or} OR ...</code></li><ul><li><strong>?or=name||eq||batman&or=name||eq||joker</strong></li></ul></ul><ul><li>If there are <strong>one</strong> <code>or</code> and <strong>one</strong> <code>filter</code> then it will be interpreted as <code>OR</code> condition, as follows:<br><code>WHERE {filter} OR {or}</code></li><ul><li><strong>?filter=name||eq||batman&or=name||eq||joker</strong></li></ul></ul><ul><li>If present <strong>both</strong> <code>or</code> and <code>filter</code> in any amount (<strong>one</strong> or <strong>miltiple</strong> each) then both interpreted as a combitation of <code>AND</code> conditions and compared with each other by <code>OR</code> condition, as follows:<br><code>WHERE ({filter} AND {filter} AND ...) OR ({or} AND {or} AND ...)</code></li><ul><li><strong>?filter=type||eq||hero&filter=status||eq||alive&or=type||eq||villain&or=status||eq||dead</strong></li></ul></ul>
     * @param {string} parameters.sort - <h4>Adds sort by field (by multiple fields) and order to query result.</h4><i>Syntax:</i> <strong>?sort=field,ASC|DESC</strong><br/><i>Examples:</i></i><ul><li><strong>?sort=name,ASC</strong></li><li><strong>?sort=name,ASC&sort=id,DESC</strong></li></ul>
     * @param {string} parameters.join - <h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?join=relation</strong></li><li><strong>?join=relation||field1,field2,...</strong></li><li><strong>?join=relation1||field11,field12,...&join=relation1.nested||field21,field22,...&join=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?join=profile</strong></li><li><strong>?join=profile||firstName,email</strong></li><li><strong>?join=profile||firstName,email&join=notifications||content&join=tasks</strong></li><li><strong>?join=relation1&join=relation1.nested&join=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.
     * @param {number} parameters.perPage - <h4>Receive <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?per_page=number</strong><br/><i>Example:</i> <strong>?per_page=10</strong>
     * @param {number} parameters.offset - <h4>Offset <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?offset=number</strong><br/><i>Example:</i> <strong>?offset=10</strong>
     * @param {number} parameters.page - <h4>Receive a portion of <code>limit</code> entities (alternative to <code>offset</code>). Will be applied if <code>limit</code> is set up.</h4><i>Syntax:</i> <strong>?page=number</strong><br/><i>Example:</i> <strong>?page=2</strong>
     * @param {number} parameters.cache - <h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?cache=0</strong>
     */
    Test.prototype.getUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters['filter'] !== undefined) {
            queryParameters['filter'] = parameters['filter'];
        }

        if (parameters['or'] !== undefined) {
            queryParameters['or'] = parameters['or'];
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['join'] !== undefined) {
            queryParameters['join'] = parameters['join'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['cache'] !== undefined) {
            queryParameters['cache'] = parameters['cache'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create one User
     * @method
     * @name Test#postUsers
     * @param {object} parameters - method options and parameters
     * @param {} parameters.user - Sample API with NestJS
     */
    Test.prototype.postUsers = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['user'] !== undefined) {
            body = parameters['user'];
        }

        if (parameters['user'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: user'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Retrieve one User
     * @method
     * @name Test#getUsersById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.id - Sample API with NestJS
     * @param {string} parameters.fields - <h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?fields=field1,field2,...</strong> <br/><i>Example:</i> <strong>?fields=email,name</strong>
     * @param {string} parameters.join - <h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?join=relation</strong></li><li><strong>?join=relation||field1,field2,...</strong></li><li><strong>?join=relation1||field11,field12,...&join=relation1.nested||field21,field22,...&join=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?join=profile</strong></li><li><strong>?join=profile||firstName,email</strong></li><li><strong>?join=profile||firstName,email&join=notifications||content&join=tasks</strong></li><li><strong>?join=relation1&join=relation1.nested&join=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.
     * @param {number} parameters.cache - <h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?cache=0</strong>
     */
    Test.prototype.getUsersById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters['join'] !== undefined) {
            queryParameters['join'] = parameters['join'];
        }

        if (parameters['cache'] !== undefined) {
            queryParameters['cache'] = parameters['cache'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Update one User
     * @method
     * @name Test#patchUsersById
     * @param {object} parameters - method options and parameters
     * @param {} parameters.user - Sample API with NestJS
     * @param {number} parameters.id - Sample API with NestJS
     */
    Test.prototype.patchUsersById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['user'] !== undefined) {
            body = parameters['user'];
        }

        if (parameters['user'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: user'));
            return deferred.promise;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PATCH', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Replace one User
     * @method
     * @name Test#putUsersById
     * @param {object} parameters - method options and parameters
     * @param {} parameters.user - Sample API with NestJS
     * @param {number} parameters.id - Sample API with NestJS
     */
    Test.prototype.putUsersById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['user'] !== undefined) {
            body = parameters['user'];
        }

        if (parameters['user'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: user'));
            return deferred.promise;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete one User
     * @method
     * @name Test#deleteUsersById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.id - Sample API with NestJS
     */
    Test.prototype.deleteUsersById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create many User
     * @method
     * @name Test#postUsersBulk
     * @param {object} parameters - method options and parameters
     * @param {} parameters.generatedUserBulkDto - Sample API with NestJS
     */
    Test.prototype.postUsersBulk = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/users/bulk';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['generatedUserBulkDto'] !== undefined) {
            body = parameters['generatedUserBulkDto'];
        }

        if (parameters['generatedUserBulkDto'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: generatedUserBulkDto'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * 
     * @method
     * @name Test#postAuthLogin
     * @param {object} parameters - method options and parameters
     * @param {} parameters.loginDto - Sample API with NestJS
     */
    Test.prototype.postAuthLogin = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/auth/login';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['loginDto'] !== undefined) {
            body = parameters['loginDto'];
        }

        if (parameters['loginDto'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: loginDto'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Retrieve many Role
     * @method
     * @name Test#getRoles
     * @param {object} parameters - method options and parameters
     * @param {string} parameters.fields - <h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?fields=field1,field2,...</strong> <br/><i>Example:</i> <strong>?fields=email,name</strong>
     * @param {string} parameters.filter - <h4>Adds fields request condition (multiple conditions) to the request.</h4><i>Syntax:</i> <strong>?filter=field||condition||value</strong><br/><i>Examples:</i> <ul><li><strong>?filter=name||eq||batman</strong></li><li><strong>?filter=isVillain||eq||false&filter=city||eq||Arkham</strong> (multiple filters are treated as a combination of AND type of conditions)</li><li><strong>?filter=shots||in||12,26</strong> (some conditions accept multiple values separated by commas)</li><li><strong>?filter=power||isnull</strong> (some conditions don't accept value)</li></ul><br/>Filter Conditions:<ul><li><strong><code>eq</code></strong> (<code>=</code>, equal)</li><li><strong><code>ne</code></strong> (<code>!=</code>, not equal)</li><li><strong><code>gt</code></strong> (<code>&gt;</code>, greater than)</li><li><strong><code>lt</code></strong> (<code>&lt;</code>, lower that)</li><li><strong><code>gte</code></strong> (<code>&gt;=</code>, greater than or equal)</li><li><strong><code>lte</code></strong> (<code>&lt;=</code>, lower than or equal)</li><li><strong><code>starts</code></strong> (<code>LIKE val%</code>, starts with)</li><li><strong><code>ends</code></strong> (<code>LIKE %val</code>, ends with)</li><li><strong><code>cont</code></strong> (<code>LIKE %val%</code>, contains)</li><li><strong><code>excl</code></strong> (<code>NOT LIKE %val%</code>, not contains)</li><li><strong><code>in</code></strong> (<code>IN</code>, in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>notin</code></strong> (<code>NOT IN</code>, not in range, <strong><em>accepts multiple values</em></strong>)</li><li><strong><code>isnull</code></strong> (<code>IS NULL</code>, is NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>notnull</code></strong> (<code>IS NOT NULL</code>, not NULL, <strong><em>doesn't accept value</em></strong>)</li><li><strong><code>between</code></strong> (<code>BETWEEN</code>, between, <strong><em>accepts two values</em></strong>)</li></ul>
     * @param {string} parameters.or - <h4>Adds <code>OR</code> conditions to the request.</h4><i>Syntax:</i> <strong>?or=field||condition||value</strong><br/>It uses the same conditions as the filter parameter<br/><i>Rules and <i>Examples:</i></i><ul><li>If there is only <strong>one</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as simple filter:</li><ul><li><strong>?or=name||eq||batman</strong></li></ul></ul><ul><li>If there are <strong>multiple</strong> <code>or</code> present (without <code>filter</code>) then it will be interpreted as a compination of <code>OR</code> conditions, as follows:<br><code>WHERE {or} OR {or} OR ...</code></li><ul><li><strong>?or=name||eq||batman&or=name||eq||joker</strong></li></ul></ul><ul><li>If there are <strong>one</strong> <code>or</code> and <strong>one</strong> <code>filter</code> then it will be interpreted as <code>OR</code> condition, as follows:<br><code>WHERE {filter} OR {or}</code></li><ul><li><strong>?filter=name||eq||batman&or=name||eq||joker</strong></li></ul></ul><ul><li>If present <strong>both</strong> <code>or</code> and <code>filter</code> in any amount (<strong>one</strong> or <strong>miltiple</strong> each) then both interpreted as a combitation of <code>AND</code> conditions and compared with each other by <code>OR</code> condition, as follows:<br><code>WHERE ({filter} AND {filter} AND ...) OR ({or} AND {or} AND ...)</code></li><ul><li><strong>?filter=type||eq||hero&filter=status||eq||alive&or=type||eq||villain&or=status||eq||dead</strong></li></ul></ul>
     * @param {string} parameters.sort - <h4>Adds sort by field (by multiple fields) and order to query result.</h4><i>Syntax:</i> <strong>?sort=field,ASC|DESC</strong><br/><i>Examples:</i></i><ul><li><strong>?sort=name,ASC</strong></li><li><strong>?sort=name,ASC&sort=id,DESC</strong></li></ul>
     * @param {string} parameters.join - <h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?join=relation</strong></li><li><strong>?join=relation||field1,field2,...</strong></li><li><strong>?join=relation1||field11,field12,...&join=relation1.nested||field21,field22,...&join=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?join=profile</strong></li><li><strong>?join=profile||firstName,email</strong></li><li><strong>?join=profile||firstName,email&join=notifications||content&join=tasks</strong></li><li><strong>?join=relation1&join=relation1.nested&join=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.
     * @param {number} parameters.perPage - <h4>Receive <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?per_page=number</strong><br/><i>Example:</i> <strong>?per_page=10</strong>
     * @param {number} parameters.offset - <h4>Offset <code>N</code> amount of entities.</h4><i>Syntax:</i> <strong>?offset=number</strong><br/><i>Example:</i> <strong>?offset=10</strong>
     * @param {number} parameters.page - <h4>Receive a portion of <code>limit</code> entities (alternative to <code>offset</code>). Will be applied if <code>limit</code> is set up.</h4><i>Syntax:</i> <strong>?page=number</strong><br/><i>Example:</i> <strong>?page=2</strong>
     * @param {number} parameters.cache - <h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?cache=0</strong>
     */
    Test.prototype.getRoles = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters['filter'] !== undefined) {
            queryParameters['filter'] = parameters['filter'];
        }

        if (parameters['or'] !== undefined) {
            queryParameters['or'] = parameters['or'];
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['join'] !== undefined) {
            queryParameters['join'] = parameters['join'];
        }

        if (parameters['perPage'] !== undefined) {
            queryParameters['per_page'] = parameters['perPage'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['page'] !== undefined) {
            queryParameters['page'] = parameters['page'];
        }

        if (parameters['cache'] !== undefined) {
            queryParameters['cache'] = parameters['cache'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create one Role
     * @method
     * @name Test#postRoles
     * @param {object} parameters - method options and parameters
     * @param {} parameters.role - Sample API with NestJS
     */
    Test.prototype.postRoles = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['role'] !== undefined) {
            body = parameters['role'];
        }

        if (parameters['role'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: role'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Retrieve one Role
     * @method
     * @name Test#getRolesById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.id - Sample API with NestJS
     * @param {string} parameters.fields - <h4>Selects fields that should be returned in the reponse body.</h4><i>Syntax:</i> <strong>?fields=field1,field2,...</strong> <br/><i>Example:</i> <strong>?fields=email,name</strong>
     * @param {string} parameters.join - <h4>Receive joined relational objects in GET result (with all or selected fields).</h4><i>Syntax:</i><ul><li><strong>?join=relation</strong></li><li><strong>?join=relation||field1,field2,...</strong></li><li><strong>?join=relation1||field11,field12,...&join=relation1.nested||field21,field22,...&join=...</strong></li></ul><br/><i>Examples:</i></i><ul><li><strong>?join=profile</strong></li><li><strong>?join=profile||firstName,email</strong></li><li><strong>?join=profile||firstName,email&join=notifications||content&join=tasks</strong></li><li><strong>?join=relation1&join=relation1.nested&join=relation1.nested.deepnested</strong></li></ul><strong><i>Notice:</i></strong> <code>id</code> field always persists in relational objects. To use nested relations, the parent level MUST be set before the child level like example above.
     * @param {number} parameters.cache - <h4>Reset cache (if was enabled) and receive entities from the DB.</h4><i>Usage:</i> <strong>?cache=0</strong>
     */
    Test.prototype.getRolesById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters['join'] !== undefined) {
            queryParameters['join'] = parameters['join'];
        }

        if (parameters['cache'] !== undefined) {
            queryParameters['cache'] = parameters['cache'];
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('GET', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Update one Role
     * @method
     * @name Test#patchRolesById
     * @param {object} parameters - method options and parameters
     * @param {} parameters.role - Sample API with NestJS
     * @param {number} parameters.id - Sample API with NestJS
     */
    Test.prototype.patchRolesById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['role'] !== undefined) {
            body = parameters['role'];
        }

        if (parameters['role'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: role'));
            return deferred.promise;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PATCH', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Replace one Role
     * @method
     * @name Test#putRolesById
     * @param {object} parameters - method options and parameters
     * @param {} parameters.role - Sample API with NestJS
     * @param {number} parameters.id - Sample API with NestJS
     */
    Test.prototype.putRolesById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['role'] !== undefined) {
            body = parameters['role'];
        }

        if (parameters['role'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: role'));
            return deferred.promise;
        }

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('PUT', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Delete one Role
     * @method
     * @name Test#deleteRolesById
     * @param {object} parameters - method options and parameters
     * @param {number} parameters.id - Sample API with NestJS
     */
    Test.prototype.deleteRolesById = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles/{id}';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        path = path.replace('{id}', parameters['id']);

        if (parameters['id'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: id'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('DELETE', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };
    /**
     * Create many Role
     * @method
     * @name Test#postRolesBulk
     * @param {object} parameters - method options and parameters
     * @param {} parameters.generatedRoleBulkDto - Sample API with NestJS
     */
    Test.prototype.postRolesBulk = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        let deferred = Q.defer();
        let domain = this.domain,
            path = '/roles/bulk';
        let body = {},
            queryParameters = {},
            headers = {},
            form = {};

        headers = this.setAuthHeaders(headers);
        headers['Accept'] = ['application/json'];
        headers['Content-Type'] = ['application/json'];

        if (parameters['generatedRoleBulkDto'] !== undefined) {
            body = parameters['generatedRoleBulkDto'];
        }

        if (parameters['generatedRoleBulkDto'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: generatedRoleBulkDto'));
            return deferred.promise;
        }

        queryParameters = mergeQueryParams(parameters, queryParameters);

        this.request('POST', domain + path, parameters, body, headers, queryParameters, form, deferred);

        return deferred.promise;
    };

    return Test;
})();

exports.Test = Test;