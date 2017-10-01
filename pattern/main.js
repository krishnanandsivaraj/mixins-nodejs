var express=require('express'),
    mongoose=require('mongoose'),
    app=express(),
    bodyparser=require('body-parser'),
    router=express.Router(),
    handle=require('./handler'),
    provider=require('./provider');

global.components={
    mxmongoose:mongoose,
    mxexpress:app,
    mxbodyparser:bodyparser,
    mxprovider:provider.provider
};
handle.handler.start();
app.use('/',router);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({"encoded":"true"}));
app.listen(3200);