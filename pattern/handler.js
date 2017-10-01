var api=require('./api');
var handler=function(){
    return{
        // init:function(){
        //     var mixins={
        //                 mxWebServer:global.components.mxexpress
        //                 };
        // },
        start:function(){
            //this.init();
            var mixins={
                        mxWebServer:global.components.mxexpress,
                        mxUtilityProvider:global.components.mxprovider
                        };
            console.log('starting');
            mixins.mxWebServer.get('/reports/getfilters', function (request, response) {
                mixins.mxUtilityProvider.templates.response.processRequest({
                    request: request,
                    response: response,
                    fnApiMethod: api.api.getdb,
                    fnSendResponse: mixins.mxUtilityProvider.templates.response.sendResponse
                });
            });
        }
    }
};
module.exports.handler=handler();