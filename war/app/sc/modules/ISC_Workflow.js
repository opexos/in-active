
/*

  SmartClient Ajax RIA system
  Version v11.0p_2016-12-17/EVAL Deployment (2016-12-17)

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

if(window.isc&&window.isc.module_Core&&!window.isc.module_Workflow){isc.module_Workflow=1;isc._moduleStart=isc._Workflow_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log&&isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={message:'Workflow load/parse time: '+(isc._moduleStart-isc._moduleEnd)+'ms',category:'loadTime'};if(isc.Log&&isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("ProcessElement");isc.ProcessElement.addProperties({})
isc.defineClass("ProcessSequence","ProcessElement");isc.ProcessSequence.addProperties({})
isc.defineClass("Task","ProcessElement");isc.Task.addProperties({})
isc.defineClass("Process","Task");isc.A=isc.Process;isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.$27q={};isc.B.push(isc.A.loadProcess=function isc_c_Process_loadProcess(_1,_2){var _3=isc.DataSource.get("WorkflowLoader");_3.fetchData({id:_1},function(_8,_9,_10){var _4=null;var _5=_9.content;if(_5!=null){if(isc.isAn.Array(_5)){_4=isc.Class.evaluate(_5[0]);_4.ID=_1[0];isc.Process.$27q[_1[0]]=_4;for(var i=1;i<_5.length;i++){var p=isc.Class.evaluate(_5[i]);p.ID=_1[i];isc.Process.$27q[_1[i]]=p}}else{_4=isc.Class.evaluate(_5);_4.ID=_1;isc.Process.$27q[_1]=_4}}else{isc.logWarn("File named \""+_1+"\".proc.xml could not be found in the search path specified by \"project.processes\".")}
_2(_4)})},isc.A.getProcess=function isc_c_Process_getProcess(_1){return isc.Process.$27q[_1]});isc.B._maxIndex=isc.C+2;isc.A=isc.Process.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.autoStart=false;isc.B.push(isc.A.init=function isc_Process_init(){var _1=this.Super("init",arguments);this.$91e=this.startElement;if(this.autoStart)this.start();return _1},isc.A.getElement=function isc_Process_getElement(_1){return this.$87g(this,_1)},isc.A.setState=function isc_Process_setState(_1){this.state=_1},isc.A.$87g=function isc_Process__searchElement(_1,_2){if(_1.sequences){for(var i=0;i<_1.sequences.length;i++){var s=_1.sequences[i];if(s.ID==_2){return s}else if(s.sequences||s.elements){var _5=this.$87g(s,_2);if(_5)return _5}}}
if(_1.elements){for(var i=0;i<_1.elements.length;i++){var e=_1.elements[i];if(e.ID==_2){return e}else if(e.sequences||e.elements){var _5=this.$87g(e,_2);if(_5)return _5}}}},isc.A.start=function isc_Process_start(){if(this.executionStack==null){this.executionStack=[]}
if(this.state==null)this.state={};while(this.$39n()){var _1=this.$87h();if(_1){this.$104r=true;if(!_1.executeElement(this)){return}}}
if(this.finished){this.startElement=this.$91e;this.finished(this.state)}},isc.A.reset=function isc_Process_reset(_1){this.state=_1;this.executionStack=null},isc.A.$39n=function isc_Process__next(){var _1=this.executionStack.last();if(_1==null){if(this.startElement){var _2=this.$87i(this,this.startElement);if(_2==null){isc.logWarn("unable to find task '"+this.startElement+"' - process will be finished")}
return _2}else if(this.$104r){return null}else if(this.sequences&&this.sequences.length>0){this.executionStack.add({el:this,sIndex:0});return this.sequences[0]}else if(this.elements&&this.elements.length>0){this.executionStack.add({el:this,eIndex:0});return this.elements[0]}else{isc.logWarn("There are neither sequences or elements. Nothing to execute.")}}else{var _3=null;if(_1.sIndex!=null){_3=_1.el.sequences[_1.sIndex]}else if(_1.eIndex!=null){_3=_1.el.elements[_1.eIndex]}
if(_3.nextElement){this.executionStack=[];var _2=this.$87i(this,_3.nextElement);if(_2==null){isc.logWarn("unable to find task '"+_3.nextElement+"' - process will be finished")}
return _2}else{return this.$87j()}}},isc.A.$87i=function isc_Process__gotoElement(_1,_2){var _3={el:_1};this.executionStack.add(_3);if(_1.sequences){for(var i=0;i<_1.sequences.length;i++){var s=_1.sequences[i];_3.sIndex=i;if(s.ID==_2){return s}else if(s.sequences||s.elements){var _6=this.$87i(s,_2);if(_6)return _6}}}
delete _3.sIndex;if(_1.elements){for(var i=0;i<_1.elements.length;i++){var e=_1.elements[i];_3.eIndex=i;if(e.ID==_2){return e}else if(e.sequences||e.elements){var _6=this.$87i(e,_2);if(_6)return _6}}}
this.executionStack.removeAt(this.executionStack.length-1)},isc.A.$87j=function isc_Process__findNextElement(){var _1=this.executionStack.last();if(_1.eIndex!=null&&_1.el!=this){if(_1.eIndex==_1.el.elements.length-1){this.executionStack.removeAt(this.executionStack.length-1);if(_1.el==this){return}else{return this.$87j()}}else{_1.eIndex++;return _1.el.elements[_1.eIndex]}}},isc.A.$87h=function isc_Process__getFirstTask(){var _1=this.executionStack.last();var _2=null;if(_1.sIndex!=null){_2=_1.el.sequences[_1.sIndex]}else if(_1.eIndex!=null){_2=_1.el.elements[_1.eIndex]}
if(_2.sequences==null&&_2.elements==null){return _2}
var _3={el:_2};this.executionStack.add(_3);if(_2.sequences){for(var i=0;i<_2.sequences.length;i++){_3.sIndex=i
var _5=this.$87h(_2.sequences[i]);if(_5)return _5}}
if(_2.elements){for(var i=0;i<_2.elements.length;i++){_3.eIndex=i
var _5=this.$87h(_2.elements[i]);if(_5)return _5}}
this.executionStack.removeAt(this.executionStack.length-1)},isc.A.setNextElement=function isc_Process_setNextElement(_1){this.executionStack=[];this.startElement=_1},isc.A.setStateVariable=function isc_Process_setStateVariable(_1,_2){if(_1.indexOf(".")<0||this.state[_1]){this.state[_1]=_2}else{var _3=_1.split(".");var _4=this.state;for(var i=0;i<_3.length-1;i++){var _6=_4[_3[i]];if(_6==null){_4[_3[i]]={}
_6=_4[_3[i]]}
_4=_6}
_4[_3[i]]=_2}},isc.A.getStateVariable=function isc_Process_getStateVariable(_1){if(_1.indexOf(".")<0||this.state[_1]){return this.state[_1]}else{var _2=_1.split(".");var _3=this.state;for(var i=0;i<_2.length-1;i++){_3=_3[_2[i]];if(_3==null){isc.logWarn("Unable to get state variable: "+_1+" no such path")
return}}
return _3[_2[i]]}},isc.A.setState=function isc_Process_setState(_1){this.state=_1});isc.B._maxIndex=isc.C+14;isc.Process.registerStringMethods({finished:"state"});isc.defineClass("ServiceTask","Task");isc.A=isc.ServiceTask.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.operationType="fetch";isc.B.push(isc.A.executeElement=function isc_ServiceTask_executeElement(_1){var _2=this.dataSource;if(_2.getClassName==null||_2.getClassName()!="DataSource"){_2=isc.DataSource.get(_2)}
var _3={};if(this.inputFieldList){for(var i=0;i<this.inputFieldList.length;i++){var _5=this.inputFieldList[i];var _6=_5.lastIndexOf(".");if(_6>0){_5=_5.substring(_6+1)}
_3[_5]=_1.getStateVariable(this.inputFieldList[i])}}
if(this.inputField){var _5=this.inputField;var _6=_5.lastIndexOf(".");if(_6>0){_5=_5.substring(_6+1)}
_3[_5]=_1.getStateVariable(this.inputField.replace("$",""));if(this.inputField.startsWith("$")){_3=_3[_5]}}
var _7=null;if(this.operationType=="fetch"){if(this.criteria){_7=this.criteria;this.$87k(_7,_3)}
if(this.fixedCriteria){if(_7==null&&_3==null){_7=this.fixedCriteria}else{var _8=isc.clone(this.fixedCriteria);if(_3){_8=isc.DataSource.combineCriteria(_3,_8)}
if(_7){_8=isc.DataSource.combineCriteria(_7,_8)}
_7=_8}}}
if(_7==null){_7=_3}
if(this.operationType!="fetch"){if(this.values){for(var _5 in this.values){_7[_5]=this.values[_5];if(isc.isA.String(_7[_5])){if(_7[_5].startsWith("$input")){var _9="state."+_7[_5].replace("$input",this.inputField);_7[_5]=isc.Class.evaluate(_9,{state:_3})}else if(_7[_5].startsWith("$inputRecord")){var _9=_7[_5].replace("$inputRecord","state");_7[_5]=isc.Class.evaluate(_9,{state:_3})}}}}
if(this.fixedValues){for(var _5 in this.fixedValues){_7[_5]=this.fixedValues[_5]}}}
var _10=this;_2.performDSOperation(this.operationType,_7,function(_14,_7){if(!isc.isAn.Array(_7))_7=[_7];if(_7.length>0){var _11=[];if(_10.outputFieldList){_11.addList(_10.outputFieldList)}
if(_10.outputField)_11.add(_10.outputField);for(var i=0;i<_11.length;i++){var _12=_11[i];if(_12.startsWith("$")){var _13=_7.length==1?_7[0]:_7;_12=_12.substring(1);_1.setStateVariable(_12,_13)}else{var _5=_12;var _6=_5.lastIndexOf(".");if(_6>0){_5=_5.substring(_6+1)}
var _13=_7[0][_5];if(typeof _13!='undefined'){if(_7.length>1){_13=[_13];for(var i=1;i<_7.length;i++){_13.add(_7[i][_5])}}
_1.setStateVariable(_12,_13)}}}}
_1.start()});return false},isc.A.$87k=function isc_ServiceTask__processCriteriaExpressions(_1,_2){for(var _3 in _1){if(isc.isAn.Array(_1[_3])){for(var i=0;i<_1[_3].length;i++){this.$87k(_1[_3][i],_2)}}else if(_3=="criteria"){this.$87k(_1.criteria,_2)}else if(isc.isA.String(_1[_3])){if(_1[_3].startsWith("$input")){var _5="state."+_1[_3].replace("$input",this.inputField);_1[_3]=isc.Class.evaluate(_5,{state:_2})}else if(_1[_3].startsWith("$inputRecord")){var _5=_1[_3].replace("$inputRecord","state");_1[_3]=isc.Class.evaluate(_5,{state:_2})}}}});isc.B._maxIndex=isc.C+2;isc.defineClass("ScriptTask","Task");isc.A=isc.ScriptTask.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.A.isAsync=false;isc.B.push(isc.A.getInputData=function isc_ScriptTask_getInputData(){return this.inputData},isc.A.setOutputData=function isc_ScriptTask_setOutputData(_1){this.$87l(this.process,null,_1)},isc.A.getInputRecord=function isc_ScriptTask_getInputRecord(){return this.inputRecord},isc.A.setOutputRecord=function isc_ScriptTask_setOutputRecord(_1){this.$87l(this.process,_1)},isc.A.executeElement=function isc_ScriptTask_executeElement(_1){var _2;var _3;if(this.inputFieldList){_3={};for(var i=0;i<this.inputFieldList.length;i++){_3[this.inputFieldList[i]]=_1.getStateVariable(this.inputFieldList[i])}}
if(this.inputField){_2=_1.getStateVariable(this.inputField);if(_3){_3[this.inputField]=_2}}
this.inputData=_2;this.inputRecord=_3;this.process=_1;try{var _5=this.execute(_2,_3)}catch(e){isc.logWarn("Error while executing ScriptTask: "+e.toString())}
if(this.isAsync){return false}
if(typeof _5=='undefined'){return true}
this.$87m(_1,_5);return true},isc.A.$87m=function isc_ScriptTask__processTaskOutput(_1,_2){if(this.outputFieldList){for(var i=0;i<this.outputFieldList.length;i++){var _4=this.outputFieldList[i];if(typeof _2[_4]!='undefined'){_1.setStateVariable(_4,_2[_4])}}}
if(this.outputField){if(this.outputFieldList==null){if(typeof _2!='undefined'){_1.setStateVariable(this.outputField,_2)}}else{if(typeof _2[this.outputField]!='undefined'){_1.setStateVariable(this.outputField,_2[this.outputField])}}}},isc.A.$87l=function isc_ScriptTask__finishTask(_1,_2,_3){if(_2==null){this.$87m(_1,_3)}else{if(_3){_2[this.outputField]=_3}
this.$87m(_1,_2)}
if(this.isAsync){_1.start()}});isc.B._maxIndex=isc.C+7;isc.ScriptTask.registerStringMethods({execute:"input,inputRecord"});isc.defineClass("XORGateway","ProcessElement");isc.A=isc.XORGateway;isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.B.push(isc.A.$90p=function isc_c_XORGateway__processFieldsRecursivelyValuesOnly(_1){var _2=[];if(_1.fieldName){if(!_2.contains(_1.fieldName)){_2.add(_1.fieldName)}}else if(_1.criteria){for(var i=0;i<_1.criteria.length;i++){var _4=this.$90p(_1.criteria[i]);for(var j=0;j<_4.length;j++){if(!_2.contains(_4[j])){_2.add(_4[j])}}}}else{for(var _6 in _1){if(!_2.contains(_6)){_2.add(_6)}}}
return _2},isc.A.$87n=function isc_c_XORGateway__processFieldsRecursively(_1){var _2=[];var _3=isc.XORGateway.$90p(_1);for(var i=0;i<_3.length;i++){_2.add({name:_3[i]})}
return _2});isc.B._maxIndex=isc.C+2;isc.A=isc.XORGateway.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.B.push(isc.A.executeElement=function isc_XORGateway_executeElement(_1){var _2=isc.XORGateway.$87n(this.criteria);var _3=isc.DataSource.create({fields:_2});if(_3.applyFilter([_1.state],this.criteria).length==1){if(this.nextElement)_1.setNextElement(this.nextElement)}else{if(this.failureElement)_1.setNextElement(this.failureElement)}
return true});isc.B._maxIndex=isc.C+1;isc.defineClass("DecisionGateway","ProcessElement");isc.A=isc.DecisionGateway.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.B.push(isc.A.executeElement=function isc_DecisionGateway_executeElement(_1){for(var _2 in this.criteriaMap){var _3=isc.XORGateway.$87n(this.criteriaMap[_2]);var _4=isc.DataSource.create({fields:_3});if(_4.applyFilter([_1.state],this.criteriaMap[_2]).length==1){_1.setNextElement(_2);return true}}
if(this.defaultElement)_1.setNextElement(this.defaultElement);return true});isc.B._maxIndex=isc.C+1;isc.defineClass("UserTask","Task");isc.A=isc.UserTask.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.B.push(isc.A.goToPrevious=function isc_UserTask_goToPrevious(){if(this.previousElement==null){isc.logWarn("PreviousElement is not set - unable to accomplish goToPrevious method.");return}
this.process.setNextElement(this.previousElement);this.completeEditing()},isc.A.cancelEditing=function isc_UserTask_cancelEditing(){if(this.process){if(this.wizard||this.process.wizard){if(this.targetFormValue){this.targetFormValue.hide()}}
var _1=this.process
delete this.process;_1.setNextElement(this.cancelElement);_1.start()}},isc.A.completeEditing=function isc_UserTask_completeEditing(){if(this.process){if(this.wizard||this.process.wizard){if(this.targetFormValue){this.targetFormValue.hide()}}
var _1;if(this.targetVMValue){_1=this.targetVMValue.getValues()}else if(this.targetFormValue){_1=this.targetFormValue.getValues()}
var _2=this.process;delete this.process;if(this.outputField){_2.setStateVariable(this.outputField,_1)}else if(this.outputFieldList){for(var i=0;i<this.outputFieldList.length;i++){var _4=this.outputFieldList[i];var _5=_4.lastIndexOf(".");if(_5>0){_4=_4.substring(_5+1)}
var _6=_1[_4];if(_6)_2.setStateVariable(this.outputFieldList[i],_6)}}else{_2.setStateVariable(this.inputField,_1)}
_2.start()}},isc.A.executeElement=function isc_UserTask_executeElement(_1){this.process=_1;if(this.targetView&&isc.isA.String(this.targetView)){if(_1.getStateVariable(this.targetView)){this.targetViewValue=_1.getStateVariable(this.targetView)}else{this.targetViewValue=window[this.targetView];if(this.targetViewValue==null&&_1.views){for(var i=0;i<_1.views.length;i++){if(_1.views[i].ID==this.targetView){this.targetViewValue=isc[_1.views[i]._constructor].create(_1.views[i]);if(this.process.containerId){window[this.process.containerId].addMember(this.targetViewValue)}
break}}}
if(this.targetViewValue==null){this.targetViewValue=this.addAutoChild(this.targetView)}
if(this.targetViewValue==null){isc.logWarn("TargetView "+this.targetView+" was not found.")}}}else{if(this.targetView){this.targetViewValue=this.targetView}else if(this.inlineView){this.targetViewValue=isc[this.inlineView._constructor].create(this.inlineView);if(this.process.containerId){window[this.process.containerId].addMember(this.targetViewValue)}}}
if(this.targetVM&&isc.isA.String(this.targetVM)){if(_1.state[this.targetVM]){this.targetVMValue=_1.getStateVariable(this.targetVM)}else{this.targetVMValue=window[this.targetVM];if(this.targetVMValue==null){isc.logWarn("TargetVM "+this.targetVM+" was not found.")}}}else{this.targetVMValue=this.targetVM}
if(this.targetForm&&isc.isA.String(this.targetForm)){if(_1.state[this.targetForm]){this.targetFormValue=_1.getStateVariable(this.targetForm)}else{this.targetFormValue=window[this.targetForm];if(this.targetFormValue==null){isc.logWarn("TargetForm "+this.targetForm+" was not found.")}}}else{this.targetFormValue=this.targetForm}
if(this.targetViewValue==null){isc.logWarn("TargetView should be set for UserTask");return true}
if(this.targetFormValue==null){if(this.targetViewValue.getClassName()=="DynamicForm"){this.targetFormValue=this.targetViewValue}}
if(this.targetFormValue==null&&this.targetVMValue==null){isc.logWarn("Rather targetForm or targetVM should be set for UserTask or targetView should be a DynamicForm");return true}
this.targetViewValue.showRecursively();var _3=null;if(this.inputField){_3=isc.clone(_1.getStateVariable(this.inputField))}else if(this.inputFieldList){_3={};for(var i=0;i<this.inputFieldList.length;i++){var _4=this.inputFieldList[i];_3[_4]=isc.clone(_1.getStateVariable(_4))}}
if(this.targetVMValue){if(_3)this.targetVMValue.setValues(_3);this.targetVMValue.userTask=this}
if(this.targetFormValue){if(_3)this.targetFormValue.setValues(_3);this.targetFormValue.saveToServer=(this.saveToServer==true);this.targetFormValue.userTask=this}
return false});isc.B._maxIndex=isc.C+4;isc.defineClass("StateTask","Task");isc.A=isc.StateTask.getPrototype();isc.B=isc._allFuncs;isc.C=isc.B._maxIndex;isc.D=isc._funcClasses;isc.D[isc.C]=isc.A.Class;isc.B.push(isc.A.executeElement=function isc_StateTask_executeElement(_1){if(this.value==null&&this.inputField==null&&this.inputFieldList==null){isc.logWarn("StateTask: value, inputField or inputFieldList should be set.");return true}
if(this.value==null&&this.inputField==null){if(this.outputFieldList==null||this.outputFieldList.length!=this.inputFieldList.length){isc.logWarn("StateTask: outputFieldList should have same number of parameters as inputFieldList.");return}
if(this.type){isc.logWarn("StateTask: type cannot be used with multiple outputFields")}
for(var i=0;i<this.inputFieldList.lenght;i++){var _3=_1.getStateVariable(this.inputFieldList[i]);_1.setStateVariable(this.outputFieldList[i],_3)}
return true}
var _3=this.value||_1.getStateVariable(this.inputField);_3=this.$104s(_3,this.type,_1);_1.setStateVariable(this.outputField,_3);return true},isc.A.$104s=function isc_StateTask__executePair(_1,_2,_3){if(_1==null){isc.logWarn("StateTask: value is null. Unable to convert to "+_2);if(this.failureElement==null){isc.logWarn("There is no failureElement in stateTask")}else{_3.setNextElement(this.failureElement)}
return null}
if("string"==_2){return _1.toString()}else if("boolean"==_2){if("true"==_1)return true;if("false"==_1)return false;if(isc.isA.String(_1))return _1.length!=0;if(isc.isA.Number(_1))return _1!=0;return _1!=null}else if("decimal"==_2){var v=parseFloat(_1.toString());if(isNaN(v)){if(this.failureElement==null){isc.logWarn("There is no failureElement in stateTask")}else{_3.setNextElement(this.failureElement)}
return null}
return v}else if("integer"==_2){var v=parseInt(_1.toString());if(isNaN(v)){if(this.failureElement==null){isc.logWarn("There is no failureElement in stateTask")}else{_3.setNextElement(this.failureElement)}
return null}
return v}else if("record"==_2){if(isc.isAn.Object(_1)&&!isc.isAn.Array(_1)&&!isc.isAn.RegularExpression(_1)&&!isc.isAn.Date(_1)){return _1}
return null}else if("array"==_2){if(isc.isAn.Array(_1))return _1;return[_1]}else{return _1}});isc.B._maxIndex=isc.C+2;isc._nonDebugModules=(isc._nonDebugModules!=null?isc._nonDebugModules:[]);isc._nonDebugModules.push('Workflow');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Workflow_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Workflow module init time: '+(isc._moduleEnd-isc._moduleStart)+'ms','loadTime');delete isc.definingFramework;if(isc.Page)isc.Page.handleEvent(null,"moduleLoaded",{moduleName:'Workflow',loadTime:(isc._moduleEnd-isc._moduleStart)});}else{if(window.isc&&isc.Log&&isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Workflow'.");}
