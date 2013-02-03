
/*

  SmartClient Ajax RIA system
  Version v11.0p_2016-12-17 (2016-12-17)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

if(window.isc&&window.isc.module_Core&&!window.isc.module_RealtimeMessaging){isc.module_RealtimeMessaging=1;isc._moduleStart=isc._RealtimeMessaging_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'RealtimeMessaging load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;if(window.isc&&isc.version!="v11.0p_2016-12-17"&&!isc.DevUtil){
    isc._optionalModuleCompare=function(){
        var incompatibleVersions=false;
        if(isc.version.toLowerCase().contains("pro")||isc.version.toLowerCase().contains("lgpl")){
            incompatibleVersions=true;
        }else{
            var coreVersion=isc.version;
            if(coreVersion.indexOf("/")!=-1){
                coreVersion=coreVersion.substring(0,coreVersion.indexOf("/"));
            }
            var moduleVersion="v11.0p_2016-12-17";
            if(moduleVersion.indexOf("/")!=-1){
                moduleVersion=moduleVersion.substring(0,moduleVersion.indexOf("/"));
            }
            if(coreVersion!=moduleVersion){
                incompatibleVersions=true;
            }
        }
        if(incompatibleVersions){
            isc.logWarn("SmartClient module version mismatch detected: This application is loading the core module from "
                +"SmartClient version '"+isc.version+"' and additional modules from 'v11.0p_2016-12-17'. Mixing resources from different "
                +"SmartClient packages is not supported and may lead to unpredictable behavior. If you are deploying resources "
                +"from a single package you may need to clear your browser cache, or restart your browser."
                +(isc.Browser.isSGWT?" SmartGWT developers may also need to clear the gwt-unitCache and run a GWT Compile.":""));
        }
    }
    isc._optionalModuleCompare();
}
isc.ClassFactory.defineClass("Messaging");
isc.A=isc.Messaging;
isc.A.messagingURL="[ISOMORPHIC]/messaging";
isc.A.useEventSource=(!isc.Browser.isSafari||
                     parseFloat(isc.Browser.rawSafariVersion)>=534.29)&&
                    !!window.EventSource;
isc.A._subscribeReconnectDelay=1;
isc.A._channels={};
isc.A._recentIDList=[];
isc.A._maxRecentIDLength=20;
isc.A.connectTimeout=4000;
isc.A.legacyCommHTTPMethod="GET"
;

isc.A=isc.Messaging;
isc.A.useAJAX=!isc.Messaging.useEventSource&&
             ((isc.Browser.isFirefox&&isc.Browser.minorVersion<4)||isc.Browser.isSafari);
isc.A._sendDisconnectUponConnect=!isc.Messaging.useEventSource&&isc.Browser.isSafari
;

isc.A=isc.Messaging;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._sequencedQueue=[];
isc.B.push(isc.A._handleEventSourceError=function isc_c_Messaging__handleEventSourceError(e){
}
,isc.A.send=function isc_c_Messaging_send(channels,data,callback,requestProperties){
    if(!isc.hasOptionalModules("RealtimeMessaging")&&!this.isRemoteDebug){
        this.logWarn("RealtimeMessaging not licensed - refusing to send()");
        return;
    }
    if(!isc.isAn.Array(channels))channels=[channels];
    if(requestProperties&&requestProperties.sequenced){
        this._sequencedQueue.add({
            channels:channels,
            data:data,
            callback:callback,
            requestProperties:requestProperties
        });
        if(this._sequencedQueue.length>1)return;
    }
    this._send(channels,data,callback,requestProperties);
}
,isc.A._send=function isc_c_Messaging__send(channels,data,callback,requestProperties){
    isc.DMI.callBuiltin({
        methodName:"messagingSend",
        callback:"isc.Messaging._sendCallback(data, rpcRequest)",
        arguments:[{
            type:"send",
            sendToChannels:channels,
            subscribedChannels:this._channels,
            data:data
        }],
        requestParams:isc.addProperties({
           showPrompt:false,
           callback:callback,
           willHandleError:callback!=null
        },requestProperties)
    });
}
,isc.A._sendCallback=function isc_c_Messaging__sendCallback(data,rpcRequest){
    if(rpcRequest&&rpcRequest.sequenced){
        this._sequencedQueue.removeAt(0);
        var nextRequest=this._sequencedQueue[0];
        if(nextRequest){
            this._send(nextRequest.channels,nextRequest.data,nextRequest.callback,nextRequest.requestProperties);
        }
    }
}
,isc.A.getSubscribedChannels=function isc_c_Messaging_getSubscribedChannels(){
    return isc.getKeys(this._channels);
}
,isc.A.subscribe=function isc_c_Messaging_subscribe(channel,callback,subscriptionCallback,selector,data){
    if(!isc.hasOptionalModules("RealtimeMessaging")&&!this.isRemoteDebug){
        this.logWarn("RealtimeMessaging not licensed - refusing to subscribe()");
        return;
    }
    var fireSubscriptionCallback=true;
    if(!this._channels[channel]){
        this._channels[channel]={};
        if(data)this._channels[channel].data=data;
        if(selector)this._channels[channel].selector=selector;
        this._channels[channel].subscriptionCallback=subscriptionCallback;
        this._reconnect();
        fireSubscriptionCallback=false;
    }
    this._channels[channel].callback=callback;
    if(fireSubscriptionCallback){
        this.fireCallback(subscriptionCallback,null,null,null,true);
    }
    return;
}
,isc.A.unsubscribe=function isc_c_Messaging_unsubscribe(channel){
    if(!this._channels[channel])return;
    delete this._channels[channel];
    this._reconnect();
    if(isc.isAn.emptyObject(this._channels))this.disconnect();
}
,isc.A.connected=function isc_c_Messaging_connected(){
    return this._channels&&isc.getKeys(this._channels).length>0&&this._serverIsConnected;
}
,isc.A.disconnect=function isc_c_Messaging_disconnect(){
    this._channels={};
    this._destroyConns();
    this._haveConnectAck=null;
    isc.Timer.clear(this._subscribeReconnectTimer);
    this._subscribeReconnectTimer=null;
    isc.Timer.clear(this._keepaliveTimer);
    this._keepaliveTimer=null;
    this.connectionDown();
}
,isc.A._reconnect=function isc_c_Messaging__reconnect(){
    if(!isc.Page.isLoaded()){
        if(!this._setLoadEventHandler){
            isc.Page.setEvent("load","isc.Messaging._reconnect()");
            this._setLoadEventHandler=true;
        }
        return;
    }
    if(!this._subscribeReconnectTimer)
        this._subscribeReconnectTimer=
            isc.Timer.setTimeout("isc.Messaging._connect()",
                                 this._subscribeReconnectDelay,isc.Timer.MSEC);
}
,isc.A._connectRetry=function isc_c_Messaging__connectRetry(){
    if(this._pendingConn&&window[this._pendingConn])window[this._pendingConn].destroy();
    this._pendingConn=null;
    this.logDebug("connect failed, retrying in: "+this.connectTimeout+"ms");
    this._reconnect();
}
,isc.A._serverConnTerminate=function isc_c_Messaging__serverConnTerminate(){
    this._reconnect();
}
,isc.A._connect=function isc_c_Messaging__connect(){
    if(this.usingAJAX&&!isc.Page.isLoaded()){
        if(!this._setLoadEventHandler){
            isc.Page.setEvent("load","isc.Messaging._reconnect()");
            this._setLoadEventHandler=true;
        }
        return;
    }
    isc.Timer.clear(this._subscribeReconnectTimer);
    this._subscribeReconnectTimer=null;
    if(this._pendingConn){
        this._reconnectOnEstablish=true;
        this.logDebug("connect pending - deferring openConnection request.");
        return;
    }
    if(this.getSubscribedChannels().length==0)return;
    this._serverIsConnected=false;
    var commFrame=isc.HiddenFrame.create({useHtmlfile:isc.Browser.isIE});
    this._pendingConn=commFrame.getID();
    this._cleanupAlt();
    var data={
            type:"connect",
            connectionID:this._pendingConn,
            subscribedChannels:isc.Comm.serialize(this._channels)
    };
    var uriBuilder=isc.URIBuilder.create(isc.Page.getURL(this.messagingURL));
    uriBuilder.setQueryParam("ts",isc.timestamp());
    uriBuilder.setQueryParam("isc_noLog","1");
    if(isc.Messaging._sendDisconnectUponConnect){
        isc.Messaging._sendDisconnectUponConnect=false;
        uriBuilder.setQueryParam("disconnectUponConnect","true");
    }
    if(this.useEventSource){
        commFrame._draw();
        for(var fieldName in data){
            if(!data.hasOwnProperty(fieldName))continue;
            uriBuilder.setQueryParam(fieldName,String(data[fieldName]));
        }
        uriBuilder.setQueryParam("eventStream","true");
        var es=this._es=new EventSource(uriBuilder.uri);
        es.onerror=isc.Messaging._handleEventSourceError;
        var createEventListener=function createEventListener(eventName){
            var eventListenerFun=function eventListenerFun(e){
                var expectedOrigin=location.origin;
                if(expectedOrigin==null){
                    expectedOrigin=location.protocol+"//"+location.host;
                }
                if(e.origin==null||e.origin!=expectedOrigin){
                    isc.Messaging.logWarn("'"+eventName+"' event received with wrong origin: "+e.origin+" (should be "+expectedOrigin+")");
                    return;
                }
                if(commFrame._windowHandle!=null){
                    commFrame._windowHandle.document.write("<SCRIPT>"+e.data+"</SCRIPT>");
                }else{
                    es.removeEventListener(eventName,eventListenerFun,false);
                }
            };
            return eventListenerFun;
        };
        es.addEventListener("connectCallback",this._connectCallbackListener=createEventListener("connectCallback"),false);
        es.addEventListener("establishAck",this._establishAckListener=createEventListener("establishAck"),false);
        es.addEventListener("keepalive",this._keepaliveListener=createEventListener("keepalive"),false);
        es.addEventListener("message",this._messageListener=createEventListener("message"),false);
        es.addEventListener("serverConnTerminate",this._serverConnTerminateListener=createEventListener("serverConnTerminate"),false);
    }else if(this.useAJAX){
        commFrame._draw();
        var lastOffset=0;
        var onreadystatechange=this._onreadystatechange=function(){
            if(onreadystatechange!=isc.Messaging._onreadystatechange)return;
            var xmlHttpRequest=isc.Messaging._xmlHttpRequest;
            if(!xmlHttpRequest)return;
            if(xmlHttpRequest.readyState==3||xmlHttpRequest.readyState==4||
                (isc.Browser.isOpera&&xmlHttpRequest.readyState==2))
            {
                var newResponseText=xmlHttpRequest.responseText.substring(lastOffset);
                lastOffset=xmlHttpRequest.responseText.length;
                commFrame._windowHandle.document.write(newResponseText);
            }
        };
        this._xmlHttpRequest=isc.Comm.sendXmlHttpRequest({
            URL:uriBuilder.uri,
            fields:data,
            httpMethod:this.legacyCommHTTPMethod,
            transaction:{
                changed:function(){},
                requestData:data
            },
            onreadystatechange:onreadystatechange
        });
    }else{
        isc.Comm.sendHiddenFrame({
            URL:uriBuilder.uri,
            fields:data,
            httpMethod:this.legacyCommHTTPMethod,
            transaction:{
                changed:function(){},
                requestData:data
            },
            frame:commFrame
        });
    }
    this._reconnectTimer=isc.Timer.setTimeout("isc.Messaging._connectRetry()",this.connectTimeout,isc.Timer.MSEC);
}
,isc.A._connectCallback=function isc_c_Messaging__connectCallback(conn,config){
    if(conn!=this._pendingConn)return;
    this._keepaliveInterval=config.keepaliveInterval;
    this._keepaliveReestablishDelay=config.keepaliveReestablishDelay;
    this._keepaliveDelay=this._keepaliveInterval+this._keepaliveReestablishDelay;
    this._connectionTTL=config.connectionTTL;
    this.connectTimeout=config.connectTimeout;
    if(this._conn&&window[this._conn])window[this._conn].destroy();
    this._conn=this._pendingConn;
    this._pendingConn=null;
    isc.Timer.clear(this._reconnectTimer);
    this._resetStatusBar();
    this._resetKeepaliveTimer();
    this.logDebug("persistent server connection open - ttl: "+this._connectionTTL
                  +"ms, keepaliveDelay: "+this._keepaliveDelay
                  +"ms, connectTimeout: "+this.connectTimeout+"ms.")
    this.connectionUp();
    if(this._reconnectOnEstablish){
        this._reconnectOnEstablish=false;
        this._reconnect();
        return;
    }
    this._serverIsConnected=true;
    for(var key in this._channels){
        var channel=this._channels[key];
        if(channel.subscriptionCallback){
            this.fireCallback(channel.subscriptionCallback,null,null,null,true);
            delete channel.subscriptionCallback;
        }
    }
}
,isc.A.connectionUp=function isc_c_Messaging_connectionUp(){
}
,isc.A.connectionDown=function isc_c_Messaging_connectionDown(){
}
,isc.A._resetStatusBar=function isc_c_Messaging__resetStatusBar(){
    var status=isc.Browser.isIE?"Done":"Stopped";
    isc.Timer.setTimeout("window.status='"+status+"'",0);
}
,isc.A._establishAck=function isc_c_Messaging__establishAck(ackFrameID){
    if(ackFrameID&&window[ackFrameID])window[ackFrameID].destroy();
    this._haveEstablishAck=true;
}
,isc.A._keepalive=function isc_c_Messaging__keepalive(conn){
    this._resetStatusBar();
    if(conn!=this._conn)return;
    this._resetKeepaliveTimer();
    this.logDebug("keepalive on conn: "+conn);
}
,isc.A._keepaliveWatchdog=function isc_c_Messaging__keepaliveWatchdog(){
    this.logDebug("connection to server lost, re-establishing...");
    this._reconnect();
    this.connectionDown();
}
,isc.A._resetKeepaliveTimer=function isc_c_Messaging__resetKeepaliveTimer(){
    isc.Timer.clear(this._keepaliveTimer);
    this._keepaliveTimer=isc.Timer.setTimeout("isc.Messaging._keepaliveWatchdog()",
                                                this._keepaliveDelay,
                                                isc.Timer.MSEC);
}
,isc.A._message=function(message){

    message=isc.eval("var message = "+message+";message;");
    var conn=message.conn,
        channels=message.channels,
        id=message.id,
        data=message.data;
    this._resetStatusBar();
    if(conn!=this._conn)return;
    this._resetKeepaliveTimer();
    if(this._recentIDList.contains(id)){
        this.logDebug("ignoring duplicate messageID: "+id);
        return;
    }
    this._recentIDList.push(id);
    if(this._recentIDList.length>this._maxRecentIDLength)this._recentIDList.shift();
    for(var i=0;i<channels.length;i++){
        var channel=channels[i];
        if(!this._channels[channel])continue;
        var channel=this._channels[channel],
            callback=channel.callback
        if(callback)this.fireCallback(callback,"data",[data],channel,true);
    }
}
,isc.A._cleanupAlt=function isc_c_Messaging__cleanupAlt(){
    if(this._es!=null){
        var es=this._es;
        es.close();
        es.removeEventListener("connectCallback",this._connectCallbackListener,false);
        delete this._connectCallbackListener;
        es.removeEventListener("establishAck",this._establishAckListener,false);
        delete this._establishAckListener;
        es.removeEventListener("keepalive",this._keepaliveListener,false);
        delete this._keepaliveListener;
        es.removeEventListener("message",this._messageListener,false);
        delete this._messageListener;
        es.removeEventListener("serverConnTerminate",this._serverConnTerminateListener,false);
        delete this._serverConnTerminateListener;
        es=null;
        delete this._es;
    }
    if(this._xmlHttpRequest!=null){
        this._xmlHttpRequest.abort();
        delete this._xmlHttpRequest;
    }
}
,isc.A._destroyConns=function isc_c_Messaging__destroyConns(){
    if(this._pendingConn!=null&&window[this._pendingConn]!=null){
        window[this._pendingConn].destroy();
    }
    if(this._conn!=null&&window[this._conn]!=null&&this._conn!=this._pendingConn){
        window[this._conn].destroy();
    }
    delete this._conn;
    delete this._pendingConn;
    this._cleanupAlt();
}
);
isc.B._maxIndex=isc.C+24;

isc.Page.setEvent("unload",function(){isc.Messaging._destroyConns()});
isc.defineClass("MessagingDMIDiscoveryDS","DataSource");
isc.A=isc.MessagingDMIDiscoveryDS.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.clientOnly=true;
isc.A.fields=[
        {name:"GUID",primaryKey:true},
        {name:"userAgent",title:"User Agent"},
        {name:"lastContact",title:"Last Contact",type:"datetime"}
    ];
isc.B.push(isc.A.init=function isc_MessagingDMIDiscoveryDS_init(){
        this.Super("init",arguments);
        this.cacheData=[];
        this.discover();
    }
,isc.A.invalidateCache=function isc_MessagingDMIDiscoveryDS_invalidateCache(){
        var _this=this;
        var cacheData=this.getCacheData();
        while(cacheData.length)_this.removeData(cacheData[0]);
        this.delayCall("discover");
    }
,isc.A.discover=function isc_MessagingDMIDiscoveryDS_discover(){
        var _this=this;
        if(!this.client){
            this.client=isc.MessagingDMIClient.create({
                socketProperties:{
                    doNotTrackRPC:true,
                    isRemoteDebug:this.isRemoteDebug
                }
            });
        }
        this.client.call({
            sendChannel:this.discoverOnChannel,
            methodName:"discover",
            timeout:this.discoveryTimeout,
            callback:function(serverProperties){
                _this.updateServer(serverProperties);
            }
        });
    }
,isc.A.updateServer=function isc_MessagingDMIDiscoveryDS_updateServer(serverProperties){
        serverProperties.lastContact=new Date();
        var _this=this;
        this.fetchData({GUID:serverProperties.GUID},function(dsResponse){
            if(dsResponse.data&&dsResponse.data.getLength()==0){
                _this.addData(serverProperties);
            }else{
                _this.updateData(serverProperties);
            }
        });
    }
);
isc.B._maxIndex=isc.C+4;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('RealtimeMessaging');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._RealtimeMessaging_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('RealtimeMessaging module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'RealtimeMessaging', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'RealtimeMessaging'.");}/** RealtimeMessagingModule End **/

/*

  SmartClient Ajax RIA system
  Version v11.0p_2016-12-17 (2016-12-17)

  Copyright 2000 and beyond Isomorphic Software, Inc. All rights reserved.
  "SmartClient" is a trademark of Isomorphic Software, Inc.

  LICENSE NOTICE
     INSTALLATION OR USE OF THIS SOFTWARE INDICATES YOUR ACCEPTANCE OF
     ISOMORPHIC SOFTWARE LICENSE TERMS. If you have received this file
     without an accompanying Isomorphic Software license file, please
     contact licensing@isomorphic.com for details. Unauthorized copying and
     use of this software is a violation of international copyright law.

  DEVELOPMENT ONLY - DO NOT DEPLOY
     This software is provided for evaluation, training, and development
     purposes only. It may include supplementary components that are not
     licensed for deployment. The separate DEPLOY package for this release
     contains SmartClient components that are licensed for deployment.

  PROPRIETARY & PROTECTED MATERIAL
     This software contains proprietary materials that are protected by
     contract and intellectual property law. You are expressly prohibited
     from attempting to reverse engineer this software or modify this
     software for human readability.

  CONTACT ISOMORPHIC
     For more information regarding license rights and restrictions, or to
     report possible license violations, please contact Isomorphic Software
     by email (licensing@isomorphic.com) or web (www.isomorphic.com).

*/

