
/*

  SmartClient Ajax RIA system
  Version v11.0p_2016-12-17/EVAL Development Only (${date})

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

if(window.isc&&window.isc.module_Core&&!window.isc.module_ServerLogViewer){isc.module_ServerLogViewer=1;isc._moduleStart=isc._ServerLogViewer_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log&&isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={message:'ServerLogViewer load/parse time: '+(isc._moduleStart-isc._moduleEnd)+'ms',category:'loadTime'};if(isc.Log&&isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ServerLogViewer","TabSet");isc.A=isc.ServerLogViewer.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.useRichLog=false;isc.A.paneMargin=0;isc.A.autoFetchData=true;isc.A.colors={ERROR:"style='color:red;'",WARN:"style='color:orange;'",DEBUG:"style='color:gray;'"};isc.A.thresholdFormDefaults={_constructor:"DynamicForm",height:20,numCols:5,colWidths:[100,300,75,30,75],fields:[{name:"category",width:300,title:"Category",defaultValue:"com.isomorphic"},{name:"threshold",width:75,showTitle:false,type:"select",defaultValue:"DEBUG",valueMap:["ALL","TRACE","DEBUG","INFO","WARN","ERROR","FATAL","OFF"]},{name:"change",title:"Change",type:"button",startRow:false,endRow:false,click:"this.form.creator.changeThreshold()"},{name:"showCurrent",title:"Show Current",type:"button",startRow:false,endRow:false,click:"this.form.creator.showThresholds()"}]};isc.B.push(isc.A.showThresholds=function isc_ServerLogViewer_showThresholds(){var _1=this;isc.DMI.callBuiltin({methodName:"getLogThresholds",arguments:[],callback:function(_5){var _2=_5.data;_2.sortByProperty("category");var s=_2.map(function(_6){return _6.category+": "+_6.threshold}).join("\n");var _4=_1.getSelectedTab().pane.form;_4.setValue("log",_4.getValue("log")+"\n"+s+"\n");_4.scrollLogToBottom()},requestParams:{promptSyle:"cursor"}})},isc.A.changeThreshold=function isc_ServerLogViewer_changeThreshold(){var _1=this.thresholdForm.getValue("category");var _2=this.thresholdForm.getValue("threshold");var _3=this;isc.DMI.callBuiltin({methodName:"setLogThreshold",arguments:[_1,_2],callback:function(){var s="Category "+_1+" now at: "+_2;var _5=_3.getSelectedTab().pane.form;_5.setValue("log",_5.getValue("log")+"\n"+s+"\n");_5.scrollLogToBottom()},requestParams:{promptSyle:"cursor"}})},isc.A.initWidget=function isc_ServerLogViewer_initWidget(){this.thresholdForm=this.createAutoChild("thresholdForm");this.tabBarControls=[this.thresholdForm];if(!this.tabs)this.tabs=[];this.Super("initWidget",arguments);if(this.autoFetchData){this.refreshLogList()}},isc.A.tabSelected=function isc_ServerLogViewer_tabSelected(_1,_2,_3){if(!_2){_2=this.$49k(_1);this.updateTab(_3,_2);_2.form.refreshLog()}},isc.A.$49k=function isc_ServerLogViewer__makePane(_1){var _2=this.getTab(_1);var _3=_2.logName;var _4=isc.DynamicForm.create({autoDraw:false,autoFocus:false,logName:_3,useRichLog:this.useRichLog&&isc.RichTextItem,overflow:"hidden",colors:this.colors,resized:function(){this.scrollLogToBottom()},fields:[{name:"log",showTitle:false,height:"*",width:"*",colSpan:"*",formItemType:this.useRichLog?"RichTextItem":"textArea",canvasProperties:this.useRichLog?{toolbarHeight:0}:null}],refreshLog:function(){isc.DMI.callBuiltin({methodName:"getLogEntries",arguments:[this.logName],callback:this.getID()+".refreshLogReply(rpcRequest, rpcResponse, data)",requestParams:{willHandleError:true,promptStyle:"cursor",queryParams:{isc_noLog:"1"}}})},refreshLogReply:function(_13,_14,_15){if(_14.status!=isc.RPCResponse.STATUS_SUCCESS){isc.warn("Unable to fetch log entries - error: "+_15);return}
var _5=isc.StringBuffer.create();if(!isc.isAn.Array(_15)){isc.warn("Error - received: "+_15);return}
if(this.useRichLog){for(var i=0;i<_15.length;i++){var _7=_15[i];_5.append("<span ",this.colors[_7.level],">",_7.logMessage.asHTML(),"</span>")}}else{_5.append(_15.getProperty("logMessage"))}
this.setValue("log",_5.release(false));this.scrollLogToBottom()},scrollLogToBottom:function(){var _8=this.getItem("log");if(!_8)return;var _9=this.useRichLog?_8.canvas.editArea:_8;_9.delayCall("scrollToBottom");isc.clearPrompt()}});var _10=isc.IButton.create({autoDraw:false,form:_4,title:"Refresh",click:"this.form.refreshLog()"});var _11=_10;if(this.standaloneURL){var _12=isc.Label.create({autoDraw:false,height:20,overflow:"visible",contents:isc.Canvas.linkHTML(this.standaloneURL,"<nobr>Open Server Log Viewer in separate window</nobr>")});_11=isc.HStack.create({height:20,autoDraw:false,members:[_10,isc.LayoutSpacer.create({width:20}),_12]})}
return isc.VLayout.create({autoDraw:false,width:"100%",height:"100%",form:_4,members:[_4,_11]})},isc.A.refreshLogList=function isc_ServerLogViewer_refreshLogList(){isc.DMI.callBuiltin({methodName:"getLogNames",callback:this.getID()+".refreshLogListReply(rpcRequest, rpcResponse, data)",requestParams:{willHandleError:true,queryParams:{isc_noLog:"1"},promptStyle:"cursor"}})},isc.A.refreshLogListReply=function isc_ServerLogViewer_refreshLogListReply(_1,_2,_3){if(_2.status!=isc.RPCResponse.STATUS_SUCCESS){isc.warn("Failed to get log data - error: "+_3);return}
var _4=this.getSelectedTabNumber();if(_4==-1)_4=0;var _5;while((_5=this.getTab(0))!=null)this.removeTab(_5);if(!_3)return;if(!isc.isAn.Array(_3)){isc.warn("Error - received: "+_3);return}
for(var i=0;i<_3.length;i++){var _7=_3[i];this.addTab({ID:this.getID()+_7,logName:_7,title:"&nbsp;"+_7+"&nbsp;"})}
isc.clearPrompt();this.selectTab(_4)});isc.B._maxIndex=isc.C+7;isc._nonDebugModules=(isc._nonDebugModules!=null?isc._nonDebugModules:[]);isc._nonDebugModules.push('ServerLogViewer');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._ServerLogViewer_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('ServerLogViewer module init time: '+(isc._moduleEnd-isc._moduleStart)+'ms','loadTime');delete isc.definingFramework;if(isc.Page)isc.Page.handleEvent(null,"moduleLoaded",{moduleName:'ServerLogViewer',loadTime:(isc._moduleEnd-isc._moduleStart)});}else{if(window.isc&&isc.Log&&isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'ServerLogViewer'.");}
