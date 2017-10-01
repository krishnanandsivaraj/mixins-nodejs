var Q=require('q');

var deferred=Q.defer();
var promise=deferred.promise;

promise.then(function (val){
    console.log('Got :'+val);

});

promise.catch(function(err){
    console.log('err :'+err);
});

deferred.resolve('it resolved');
//deferred.reject('some error');