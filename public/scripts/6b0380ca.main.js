$(".button-collapse").sideNav();var notificationTimeout=4e3,attemptNotification=function(a){var b=function(){var b=new Notification(a.title,a);setTimeout(function(){b.close()},notificationTimeout)},c=function(){Materialize.toast(a.title,notificationTimeout)};"Notification"in window?"granted"===Notification.permission?b():"denied"!==Notification.permission&&Notification.requestPermission(function(a){"granted"===a?b():c()}):(console.log("This browser does not support desktop notification"),c())};angular.module("com.eakjb.homeAutomation",["ngResource"]).factory("APIInterceptor",["$q",function(a){return{response:function(a){return a.data.isWrapped&&a.data.data&&(a.data=a.data.data),a}}}]).config(["$httpProvider",function(a){a.interceptors.push("APIInterceptor")}]).factory("API",["$location","$resource",function(a,b){var c={};return c.HAL=a.search().HAL,c.HAL||(c.HAL="/"),c.socket=io(c.HAL),c.socket.on("notification",function(a){(!a.priority||a.priority>100)&&attemptNotification(a)}),c.Node=b(c.HAL+"api/v1/Nodes/:node_id"),c.Recipient=b(c.HAL+"api/v1/Recipients/:_id"),c.nodes=c.Node.query(),c.nodes.$promise.then(function(a){angular.forEach(a,function(a){a.Info=b(a.address,{}),a.Input=b(a.address+"/inputs/:input_id"),a.Output=b(a.address+"/outputs/:output_id",{output_id:"@output_id"},{pushState:{method:"PUT",url:a.address+"/outputs/:output_id/state"}})})}),c}]).controller("NodeListController",["$scope","$q","API",function(a,b,c){a.nodes=[],a.load=function(){a.nodes=[],a.loaded=!1,a.error=void 0,c.nodes.$promise.then(function(d){a.loaded=!0,a.error=void 0,angular.forEach(d,function(d){if(!d.offline){var e=d.Info.get();e.loaded=!1,e.error=void 0,e.$promise.then(function(){},function(a){e.loaded=!0,e.error=a.data});var f=function(){e.loaded=!1,e.error=void 0;var c=[];e.outputs&&(e.outputs=d.Output.query(),e.outputs.$promise.then(function(a){angular.forEach(a,function(a){a._update=function(b){var c=a.states;"object"==typeof c&&(c=[],angular.forEach(a.states,function(a){c.push(a)})),a.state=c.filter(function(c){return c[b]===a.state[b]})[0],e.loaded=!1,d.Output.pushState({output_id:a.output_id,value:a.state.value})}})}),c.push(e.outputs.$promise)),e.inputs&&(e.inputs=d.Input.query(),e.inputs.$promise.then(function(a){angular.forEach(a,function(a){return a.value&&a.max?(a._style={width:a.value/(a.max-a.min)*100+"%"},a._type="number"):a.connectionStatus?a._type="trackable":a._type="other"})}),c.push(e.inputs.$promise)),b.all(c).then(function(){e.loaded=!0,e.error=!1},function(b){console.log("Error",b),a.loaded=!0,e.error=b.data})};e.$promise.then(f),c.socket.on("notification",f),a.nodes.push(e)}})},function(b){a.loaded=!0,a.error=b})},a.load()}]).controller("RecipientListController",["$scope","API",function(a,b){a.recipients=b.Recipient.query(),a.recipientUpdate=function(a){b.Recipient.save({_id:a._id},a)}}]);