var mongoose=require('mongoose');
var monogoOp=require('./data');

var api=function(){
    return{
    getdb: function (params) {
        var mixins={
                        mxWebServer:global.components.mxexpress,
                        mxUtilityProvider:global.components.mxprovider
                        };
            mongoose.connection.openUri('mongodb://localhost:27017/Tododb');
            return mixins.mxUtilityProvider.templates.promise.processRequest({
                apiParams: params,
                disableCache: true,
                components: { cache: mixins.mxCache, logger: mixins.mxLogger },
                fnValidateParams: function (params) {
                    return { success: true };
                },
                fnServiceMethod: function (params, callback) {
                    var criteria = {};
                    if (params.request.query.client)
                        criteria.name = params.request.query.client;
                    monogoOp.find({},function(err,data){
                            callback(null,data)
                            if(err){callback(err);}
                        });
                },
                fnProcessResponse: function (params, error, result) {
                    var finalResult = { success: !error, result: error ? error : result };
                    if (!params.disableCache) {
                        params.components.cache.set(params.cacheKey, finalResult.result);
                    }
                    return finalResult;
                }
            });
        }
        }
}
module.exports.api=api();