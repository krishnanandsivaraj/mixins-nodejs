var Q = require('q');
var utilityProvider=function(){
    return{
            templates:  {
            response: {
                sendResponse: function (request, response, object) {
                    response.setHeader("Content-Type", "application/json");
                    if (request.query.method) {
                        response.end(request.query.method + '(' + JSON.stringify(object) + ')');
                        } else {
                        response.end(JSON.stringify(object));
                    }
                },
                sendPostResponse: function (request, response, object) {
                    response.setHeader("Content-Type", "application/json");
                    if (request.body.method) {
                        response.end(request.body.method + '(' + JSON.stringify(object) + ')');
                        } else {
                        response.end(JSON.stringify(object));
                    }
                },
                processRequest: function (params) {
                        return params.fnApiMethod(params).then(function(apiResponse) {
                        params.fnSendResponse(params.request, params.response, apiResponse);
                        }).catch(function(error) {
                            params.fnSendResponse(params.request, params.response, {
                                success: false,
                                result: error
                            });
                    });
                }
            },
            promise: {
                processRequest: function (params) {
                    if (!params.apiParams) {
                        params.apiParams = {};
                    }
                    if (!params.apiParams.request) {
                        params.apiParams.request = {};
                    }
                    params.cacheKey = params.disableCache ? '' : params.fnCreateCacheKey(params);
                    var deferred = Q.defer(),
                        validationResult = params.fnValidateParams ? params.fnValidateParams(params.apiParams) : {
                            success: true
                        },
                    debugInfo = {
                        disableCache: params.disableCache,
                        cacheKey: params.cacheKey,
                        request: {
                            path: params.apiParams.request.path,
                            query: params.apiParams.request.query,
                            body: params.apiParams.request.body
                        }
                    };

                    if (!validationResult.success) {
                        params.components.logger.log('error', {
                            payload: {
                                message: validationResult.result,
                                debugInfo: debugInfo
                            }
                        });
                        deferred.reject(validationResult.result);
                    } else {
                        var loadCachedData = function () {
                            if (params.apiParams.request.query.clearCache == 'true') {
                                return params.components.cache.drop(params.cacheKey).then(function (cachedData) {
                                    return cachedData;
                                });
                            } else {
                                return params.components.cache.get(params.cacheKey).then(function (cachedData) {
                                    return cachedData;
                                });
                            }
                        },
                        loadDataFromSource = function (cachedData) {
                            if (cachedData) {
                                deferred.resolve({
                                    success: true,
                                    fromCache: true,
                                    result: cachedData
                                });
                            } else {
                                params.fnServiceMethod(params.apiParams, function (error, result) {
                                    var processResult = params.fnProcessResponse(params, error, result);
                                    if (processResult.success) {
                                        deferred.resolve(processResult);
                                    } else {
                                        deferred.reject(processResult);
                                    }
                                });
                            }
                        };
                        (params.disableCache ? Q(loadDataFromSource()) : (loadCachedData().then(loadDataFromSource))).catch(function (error) {
                            params.components.logger.log('error', {
                                payload: {
                                    error: error,
                                    debugInfo: debugInfo
                                }
                            });
                            deferred.reject({
                                success: false,
                                result: error
                            });
                        });
                    }
                    return deferred.promise;
                }
            }
        }
    }
};
module.exports.provider=utilityProvider();