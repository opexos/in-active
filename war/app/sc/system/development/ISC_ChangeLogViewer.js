
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

if(window.isc&&window.isc.module_Core&&!window.isc.module_ChangeLogViewer){isc.module_ChangeLogViewer=1;isc._moduleStart=isc._ChangeLogViewer_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log&&isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={message:'ChangeLogViewer load/parse time: '+(isc._moduleStart-isc._moduleEnd)+'ms',category:'loadTime'};if(isc.Log&&isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ChangeLogViewer",isc.SectionStack);isc.A=isc.ChangeLogViewer.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.visibilityMode="multiple";isc.A.noChangeLogMessage="<h1>Full release notes coming soon</h1>";isc.A.noChangeLogLabelDefaults={_constructor:"Label",width:"100%",height:"100%",align:"center",valign:"top",styleName:"HeaderItem"};isc.A.filterFormProperties={_constructor:"DynamicForm",numCols:1,items:[{name:"filterBox",editorType:"TextItem",showTitle:false,width:"*",showHintInField:true,hint:"Search change notes",changeOnKeypress:false,keyPress:function(){if(isc.EH.getKey()=="Enter"){this.updateValue();this.form.creator.filterGrids()}}},{name:"backCompatOnly",editorType:"CheckboxItem",title:"Limit to changes with back-compat notes",showTitle:false}],itemChanged:function(_1,_2){this.creator.filterGrids()}};isc.A.featureGridDefaults={_constructor:"ListGrid",dataFetchMode:"local",fixedRecordHeights:false,wrapCells:true,groupByField:["category"],groupStartOpen:"all",groupByMaxRecords:20000};isc.A.bugfixGridDefaults={_constructor:"ListGrid",dataFetchMode:"local",groupByField:["change_type","category"],groupStartOpen:"all",groupByMaxRecords:20000,fixedRecordHeights:false,wrapCells:true};isc.B.push(isc.A.getDataURL=function isc_ChangeLogViewer_getDataURL(_1){var _2=this.dataURLs;if(_2==null)return null;if(_1==null){_1=this.currentRelease;if(_1==null){for(var r in _2){_1=r;break}}}
return _2[_1]},isc.A.setCurrentRelease=function isc_ChangeLogViewer_setCurrentRelease(_1){var _2=this.getDataURL();this.currentRelease=_1;var _3=this.getDataURL();if(_3!=_2){if(this.publicLogEntryDS){this.publicLogEntryDS.dataURL=_3;this.publicLogEntryDS.invalidateCache();if(this.featureGrid)this.featureGrid.invalidateCache();if(this.bugfixGrid)this.bugfixGrid.invalidateCache()}}
if(_3==null){this.hideSection("filterUI");this.hideSection("featureGrid");this.hideSection("bugfixGrid");this.showSection("noChangeLogLabel")}else{this.showSection("filterUI");this.showSection("featureGrid");this.showSection("bugfixGrid");this.hideSection("noChangeLogLabel");this.filterGrids()}},isc.A.createPublicLogEntryDS=function isc_ChangeLogViewer_createPublicLogEntryDS(){this.publicLogEntryDS=isc.DataSource.create({clientOnly:true,dataURL:this.getDataURL(),fields:[{hidden:true,name:"id",primaryKey:true},{hidden:true,name:"relatedIds",multiple:true},{name:"product",type:"text"},{name:"date_time",type:"datetime"},{length:1,name:"change_type",title:"Change Type",type:"text"},{name:"category",title:"Category",type:"text"},{length:65535,name:"files",title:"Files",type:"text"},{length:65535,name:"public_notes",title:"Public Notes",type:"text"},{hidden:true,length:255,name:"reference",title:"Reference",type:"text"},{length:65535,name:"directory",title:"Directory",type:"text"},{name:"back_compat",type:"text"}]})},isc.A.filterGrids=function isc_ChangeLogViewer_filterGrids(_1,_2){var _3=this.filterForm.getValues(),_4={},_5=this;if(_3.filterBox!=null||_3.backCompatOnly){_4={_constructor:"AdvancedCriteria",operator:"and",criteria:[]}
if(_3.backCompatOnly){_4.criteria.add({fieldName:"back_compat",operator:"notNull"})}
if(_3.filterBox!=null){_4.criteria.add({operator:"or",criteria:[{fieldName:"files",operator:"iContains",value:_3.filterBox},{fieldName:"category",operator:"iContains",value:_3.filterBox},{fieldName:"public_notes",operator:"iContains",value:_3.filterBox}]})}}
this.featureGrid.fetchData(isc.DataSource.combineCriteria({change_type:"f"},_4),function(){if(_1!=null){var _6=_5.featureGrid;var _7=_6.data.indexOf({id:_1});if(_7!=-1){_6.scrollToCell(_7);_6.selectRecord(_7)}}});var _8=isc.DataSource.combineCriteria({_constructor:"AdvancedCriteria",operator:"and",criteria:[{fieldName:"change_type",operator:"notEqual",value:"f"}]},_4);this.bugfixGrid.fetchData(isc.DataSource.combineCriteria({_constructor:"AdvancedCriteria",operator:"and",criteria:[{fieldName:"change_type",operator:"notEqual",value:"f"}]},_4),function(){if(_2!=null){var _6=_5.bugfixGrid;var _7=_6.data.indexOf({id:_2});if(_7!=-1){_6.scrollToCell(_7);_6.selectRecord(_7)}}})},isc.A.initWidget=function isc_ChangeLogViewer_initWidget(){var _1=this;this.createPublicLogEntryDS();this.noChangeLogLabel=this.createAutoChild("noChangeLogLabel");this.noChangeLogLabel.setContents(this.noChangeLogMessage);this.filterForm=this.createAutoChild("filterForm");this.featureGrid=this.createAutoChild("featureGrid",{dataSource:this.publicLogEntryDS,showHeader:false,fields:[{name:"category",showIf:function(_5,_6,_7){return false},width:100,escapeHTML:true,formatCellValue:function(_5,_6,_7,_8,_9){if(_5==null){var _2=_6.files;if(_2.length>100){_2=_2.substring(0,100)+"..."}
return _2}
return _5},getGroupValue:function(_5,_6,_7,_8,_9){if(_5==null)return _6.files;return _5}},{name:"public_notes",escapeHTML:true,formatCellValue:function(_5,_6,_7,_8,_9){if(_6.back_compat!=null){_5+="\n\nBack-Compat Notes:\n"+_6.back_compat}
return _5}}]});this.bugfixGrid=this.createAutoChild("bugfixGrid",{dataSource:this.publicLogEntryDS,showHeader:false,fields:[{name:"change_type",showIf:function(_5,_6,_7){return false},width:90,formatCellValue:function(_5,_6,_7,_8,_9){if(_5!=null){if(_5.toLowerCase()=="b")return"Bug Fix";if(_5.toLowerCase()=="f")return"New Feature";if(_5.toLowerCase()=="d")return"Documentation Change"}
return"Other"},getGroupTitle:function(_5,_6,_7,_8,_9){if(_5!=null){if(_5.toLowerCase()=="b")return"Bug Fix";if(_5.toLowerCase()=="f")return"New Feature";if(_5.toLowerCase()=="d")return"Documentation Change"}
return"Other"}},{name:"category",showIf:function(_5,_6,_7){return false},width:100,escapeHTML:true,formatCellValue:function(_5,_6,_7,_8,_9){if(_5==null){var _2=_6.files;if(_2.length>100){_2=_2.substring(0,100)+"..."}
return _2}},getGroupValue:function(_5,_6,_7,_8,_9){if(_5==null)return _6.files;return _5}},{name:"public_notes",escapeHTML:true,formatCellValue:function(_5,_6,_7,_8,_9){if(_6.back_compat!=null){_5+="\n\nBackcompat Notes:\n"+_6.back_compat}
return _5}}]});var _3=this.getDataURL(),_4=_3==null;this.sections=[{ID:"noChangeLogLabel",hidden:!_4,showHeader:false,items:[this.noChangeLogLabel]},{ID:"filterUI",hidden:_4,items:[isc.LayoutSpacer.create({height:10}),this.filterForm],showHeader:false,expanded:true},{ID:"featureGrid",hidden:_4,title:"New Features",items:[this.featureGrid],expanded:true},{ID:"bugfixGrid",hidden:_4,title:"Bug Fixes and other Changes",items:[this.bugfixGrid],expanded:true}]
this.Super("initWidget",arguments);if(!_4)this.filterGrids()});isc.B._maxIndex=isc.C+5;isc._nonDebugModules=(isc._nonDebugModules!=null?isc._nonDebugModules:[]);isc._nonDebugModules.push('ChangeLogViewer');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._ChangeLogViewer_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('ChangeLogViewer module init time: '+(isc._moduleEnd-isc._moduleStart)+'ms','loadTime');delete isc.definingFramework;if(isc.Page)isc.Page.handleEvent(null,"moduleLoaded",{moduleName:'ChangeLogViewer',loadTime:(isc._moduleEnd-isc._moduleStart)});}else{if(window.isc&&isc.Log&&isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'ChangeLogViewer'.");}
