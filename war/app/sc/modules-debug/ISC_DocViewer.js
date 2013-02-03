
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

if(window.isc&&window.isc.module_Core&&!window.isc.module_DocViewer){isc.module_DocViewer=1;isc._moduleStart=isc._DocViewer_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'DocViewer load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.defineClass("DocCookieState").addProperties({
init:function(){
    isc.ClassFactory.addGlobalID(this);
    if(!this.cookieName){
        this.logError("You must set the 'cookieName' property");
        return;
    }
    if(!isc.Page.isLoaded()){
        isc.Page.setEvent("load",this.getID()+".pageLoaded()");
    }else{
        this.load();
        this.delayCall("processCallback");
    }
},
pageLoaded:function(){
    this.load();
    this.processCallback();
},
processCallback:function(){
    if(this.onload){
        this.fireCallback(this.onload,["state","data"],[this,this.data]);
    }
},
load:function(){
    var stateString=isc.Cookie.get(this.cookieName);
    this.logDebug("loaded: "+stateString)
    if(stateString){
        try{
            var fn=isc._makeFunction("return "+stateString);
            this.data=fn();
        }catch(e){
            this.logWarn("state cookie corrupt, clearing out and defaulting state.");
            this.clear();
        }
    }
    if(!this.data)this.data=isc.clone(this.defaultData);
    return this.data;
},
canUpdate:function(){
    return isc.Page.isLoaded();
},
store:function(data){
    if(!this.canUpdate())return;
    if(!data&&!this.data)return;
    if(data)this.data=data;
    if(!this.disableCookieStore){
        var stateString=isc.Comm.serialize(this.data);
        this.logDebug("storing: "+stateString+" - length: "+stateString.length);
        isc.Cookie.set(this.cookieName,stateString,this.cookiePath,this.cookieDomain,this.cookieExpiration);
    }
},
add:function(data){
    if(!this.canUpdate())return;
    if(!this.data)this.data={};
    isc.addProperties(this.data,data);
    this.store();
},
clear:function(){
    if(!this.canUpdate())return;
    this.data=null;
    isc.Cookie.clear(this.cookieName);
},
reset:function(){
    if(!this.canUpdate())return;
    this.data=isc.clone(this.defaultData);
    this.store();
},
getStoredSize:function(data){
    if(!data)data=this.data;
    if(!data)return 0;
    return isc.Comm.serialize(data).length;
}
});
isc.defineClass("DocFilterField","DynamicForm");
isc.A=isc.DocFilterField.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.browserSpellCheck=false;
isc.A.height=20;
isc.A.numCols=2;
isc.A.colWidths=[46,"*"];
isc.A.titleSuffix=":&nbsp;";
isc.A.showSearchTitle=false;
isc.A.wrapItemTitles=false;
isc.A.selectOnFocus=true;
isc.A.autoDraw=false;
isc.A.hint="Filter results...";
isc.B.push(isc.A.initWidget=function isc_DocFilterField_initWidget(){
    this.items=[isc.addProperties(
        {name:this.fieldName,width:"*",colSpan:"*",showTitle:this.showSearchTitle,
         selectOnFocus:true,
         title:this.searchTitle,showHintInField:true,hint:this.hint
        })
    ];
    this.Super("initWidget",arguments);
}
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("DocPrefsDialog",isc.Window);
isc.A=isc.DocPrefsDialog.getPrototype();
isc.A.title="Preferences";
isc.A.autoCenter=true;
isc.A.showMinimizeButton=false;
isc.A.height=140;
isc.A.width=500;
isc.A.isModal=true;
isc.A.bodyDefaults={
        layoutMargin:0,
        membersMargin:10
    }
;

isc.A=isc.DocPrefsDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_DocPrefsDialog_initWidget(){
    this.Super("initWidget",arguments);
    this.addItem(this._createPrefsForm());
    this.addItem(this._createPrefsButtons());
}
,isc.A.show=function isc_DocPrefsDialog_show(){
    var state=this.docViewer.state;
    var tab=state.tab==1?"api":"overview";
    this.form.setValue("classView",tab);
    this.Super("show",arguments);
}
,isc.A._createPrefsForm=function isc_DocPrefsDialog__createPrefsForm(){
    this.form=isc.DynamicForm.create({
        autoDraw:false,
        width:300,
        height:"*",
        overflow:"visible",
        numCols:2,
        colWidths:[120,"*"],
        fields:[{
            name:"classView",
            title:"Default class view",
            type:"radioGroup",
            defaultValue:"overview",
            valueMap:{overview:"Overview Tab",api:"API Tab"},
            titleHoverHTML:function(){
                return"When showing a class, should the Overview or API tab be opened by default?";
            }
        }]
    });
    return this.form;
}
,isc.A._createPrefsButtons=function isc_DocPrefsDialog__createPrefsButtons(){
    this.buttons=isc.HStack.create({
        autoDraw:false,
        membersMargin:5,
        members:[
            isc.LayoutSpacer.create(),
            isc.IButton.create({
                autoDraw:false,
                icon:"[ISO_DOCS_SKIN]/images/DocPrefsDialog/ok.png",
                title:"OK",
                docPrefs:this,
                click:"this.docPrefs.okClick()"
            }),
            isc.IButton.create({
                autoDraw:false,
                icon:"[ISO_DOCS_SKIN]/images/DocPrefsDialog/cancel.png",
                title:"Cancel",
                docPrefs:this,
                click:"this.docPrefs.cancelClick()"
            }),
            isc.IButton.create({
                autoDraw:false,
                width:150,
                icon:"[ISO_DOCS_SKIN]/images/DocPrefsDialog/revert.png",
                title:"Revert To Defaults",
                docPrefs:this,
                click:"this.docPrefs.revertClick()"
            })
        ]
    });
    return this.buttons;
}
,isc.A.okClick=function isc_DocPrefsDialog_okClick(){
    var values=this.form.getValues();
    this.docViewer.state.add({
        tab:values.classView=="overview"?0:1
    });
    this.hide();
}
,isc.A.cancelClick=function isc_DocPrefsDialog_cancelClick(){
    this.hide();
}
,isc.A.revertClick=function isc_DocPrefsDialog_revertClick(){
    this._revertAsk=isc.ask("Clear all state and revert to defaults?"
           +" This will clear saved tree state, size, selection, and other remembered state.",
            this.getID()+".revertCallback(value)");
}
,isc.A.revertCallback=function isc_DocPrefsDialog_revertCallback(value){
    if(value){
        this.docViewer.state.reset();
        this.hide();
    }
}
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("DocHelpDialog",isc.Window);
isc.A=isc.DocHelpDialog.getPrototype();
isc.A.title="Help";
isc.A.autoCenter=true;
isc.A.autoSize=true
;

isc.A=isc.DocHelpDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_DocHelpDialog_initWidget(){
    this.Super("initWidget",arguments);
    this.addItem(this._createHelpBody());
}
,isc.A._createHelpBody=function isc_DocHelpDialog__createHelpBody(){
    var docViewerHelp=isc.jsdoc.getDocItem("group:docViewerHelp");
    return isc.Canvas.create({
        overflow:"visible",
        dynamicContents:true,
        contents:isc.jsdoc.getAttribute(docViewerHelp,"description")
    });
}
);
isc.B._maxIndex=isc.C+2;
isc.defineClass("DocGrid","ListGrid");
isc.A=isc.DocGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.alternateRecordStyles=true;
isc.A.autoDraw=false;
isc.B.push(isc.A.rowOver=function isc_DocGrid_rowOver(record){
    if(this.updateOnRowOver){
        if(this.mouseLock)return;
        this.previewRecord(record);
    }
}
,isc.A.rowClick=function isc_DocGrid_rowClick(record,recordNum,fieldNum){
    if(this.updateOnRowOver)this.mouseLock=true;
    if(record.ref&&this.docViewer&&!this.docViewer.noHistory&&this.docViewer.trackHistory)
        isc.History.addHistoryEntry(this.docViewer.encodeHistoryID(record.ref));
    this.previewRecord();
    return this.Super("rowClick",arguments);
}
,isc.A.mouseOut=function isc_DocGrid_mouseOut(){
    if(this.updateOnRowOver){
        delete this.mouseLock;
        var selectedRecord=this.getSelectedRecord();
        if(selectedRecord)this.previewRecord();
    }
}
,isc.A.previewRecord=function isc_DocGrid_previewRecord(record){
    var html;
    if(record)var html=isc.jsdoc.hoverHTML(record.ref,null,this.linkNames);
    else{
        var records=this.getSelection();
        var sb=isc.StringBuffer.create();
        for(var i=0;i<records.length;i++){
            sb.append(isc.jsdoc.hoverHTML(records[i].ref,null,this.linkNames));
            if(i+1<records.length)sb.append("<HR>");
        }
        html=sb.release(false);
    }
    if(this.searchRegexes&&html){
        var arr=[];
        var i,lt="<",gt=">";
        var parseFailed;
        while((i=html.indexOf(lt))!=-1){
            var j=html.indexOf(gt);
            if(j==-1){
                parseFailed=true;
                break;
            }
            if(i!=0){
                arr[arr.length]=html.substring(0,i);
            }
            arr[arr.length]=html.substring(i,j+1);
            html=html.substring(j+1);
        }
        if(!parseFailed){
            for(var j=0;j<arr.length;j++){
                html=arr[j];
                if(html.startsWith(lt))continue;
                for(var i=0;i<this.searchRegexes.length;i++){
                    var regex=this.searchRegexes[i];
                    html=html.replace(regex,"$1<span class='searchHilight'>$2</span>$3");
                }
                arr[j]=html;
            }
            html=arr.join(isc.emptyString);
        }
    }
    this.docPreview.setContents(html);
}
,isc.A.keyPress=function isc_DocGrid_keyPress(event,eventInfo){
    if(event.keyName==null||event.keyName.length>1)return;
    var startIndex=0;
    var sr=this.getSelectedRecord();
    var data=this.getOriginalData();
    if(sr)startIndex=data.indexOf(sr)+1;
    var sName=this.shortcutField;
    var newRecord;
    for(var i=startIndex;i<data.getLength();i++){
        var row=data.get(i);
        var value=row[this.shortcutField];
        if(value==null)continue;
        if(value.startsWith(event.keyName.toLowerCase())
            ||value.startsWith(event.keyName))
        {
            newRecord=row;
            break;
        }
    }
    if(!newRecord){
        for(var i=0;i<startIndex-1;i++){
            var row=data.get(i);
            var value=row[this.shortcutField];
            if(value==null)continue;
            if(value.startsWith(event.keyName.toLowerCase())
                ||value.startsWith(event.keyName))
            {
                newRecord=row;
                break;
            }
        }
    }
    if(newRecord){
        if(sr)this.deselectRecord(sr);
        this.selectRecord(newRecord);
        this.scrollRecordIntoView(data.indexOf(newRecord),"center");
        this.previewRecord(newRecord);
    }
}
);
isc.B._maxIndex=isc.C+5;
isc.defineClass("DocTabSet","TabSet");
isc.A=isc.DocTabSet.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.paneMargin=0;
isc.A.tabBarControls=[
    "tabScroller","tabPicker","versionString"
];
isc.B.push(isc.A.getControl=function isc_DocTabSet_getControl(control){
    if(control=="helpLauncher"){
        if(!this.helpLauncher){
            this.helpLauncher=isc.ImgButton.create({
                width:16,
                height:16,
                autoDraw:false,
                canHover:true,
                prompt:"<nobr>Show help</nobr>",
                hoverHeight:20,
                src:"[ISO_DOCS_SKIN]/images/DocTabSet/help.png",
                layoutAlign:"center",
                click:"isc.DocViewer.instance.showHelpDialog()"
            })
        }
        return this.helpLauncher;
    }
    if(!isc.Browser.isHandset&&control=="versionString"){
        if(!this.versionString){
            this.versionString=isc.Label.create({
                width:1,
                height:20,
                overflow:"visible",
                autoDraw:false,
                wrap:false,
                contents:"SmartClient Enterprise API "+isc.scVersion+" ("+isc.buildDate+")"
            })
        }
        return this.versionString;
    }
    return this.Super("getControl",arguments);
}
);
isc.B._maxIndex=isc.C+1;

isc.ClassFactory.defineClass("DocUtils");
isc.addGlobal("doc",isc.DocUtils);
isc.A=isc.DocUtils;
isc.A.nativeClasses=["Object","Boolean","RegEx"];
isc.A.offsetMap={};
isc.A.extraOffsetMap={}
;

isc.A=isc.DocUtils;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.externalLink=function isc_c_DocUtils_externalLink(ref,name){
    if(!name)name=ref;
    return"<a href='"+ref+"' onclick=\"window.open('"+ref+"');return false;\">"+name+"</a>";
}
,isc.A.linkForStandaloneExample=function isc_c_DocUtils_linkForStandaloneExample(url,name){
    if(!name)name=url;
    var html="<a href='"+url+"' onclick=\"window.open('"+url+"');return false;\">"+name+"</a>";
    if(!url.startsWith("http")){
        html+="&nbsp;"
            +isc.Canvas.imgHTML("[ISO_DOCS_SKIN]/images/text_code.gif",
                                 16,16,null,
                                 "onclick='isc.DocUtils.showExampleSource(\""+url+"\")'"
                                +" onmouseover='isc.Hover.setAction(isc.DocUtils, isc.DocUtils.doSourceHover,null,300)'"
                                +" onmouseout='isc.Hover.clear()'"
                                +" style='cursor:"+isc.Canvas.HAND+"'");
    }
    return html;
}
,isc.A.doSourceHover=function isc_c_DocUtils_doSourceHover(){
    isc.Hover.show("<nobr>View example source</nobr>");
}
,isc.A.showExampleSource=function isc_c_DocUtils_showExampleSource(url){
    window.open("/isomorphic/Source.Viewer?file="+url);
}
,isc.A.buildTableHeader=function isc_c_DocUtils_buildTableHeader(name,id,accum){
    if(!this._headerTemplate){
        this._headerTemplate=[
            "<table id='",
            null,
            "' BORDER='1' CELLPADDING='0' CELLSPACING='0' WIDTH='100%'>"
        ];
    }
    var t=this._headerTemplate;
    t[1]=this.idForRef(id);
    if(!accum)accum=isc.StringBuffer.create();
    return accum.append(t);
}
,isc.A.lookupValue=function isc_c_DocUtils_lookupValue(value){

    if(!value)return;
    var derivedValue;
    if(value.contains(".")){
        var temp=value.split(".");
        var className=temp[0];
        var classValue=temp[1];
        var classObject=isc.ClassFactory.getClass(className);
        if(this.nativeClasses.contains(className))classObject=isc.eval(className);
        if(temp.length==2&&classObject){
            derivedValue=classObject[classValue];
            var undef;
            if(derivedValue===undef){
                this.logWarn("attribute: "+value+" evals to undefined");
                return"undefined"
            }
            if(isc.isA.String(derivedValue))derivedValue='"'+derivedValue+'"';
            if(derivedValue===null)derivedValue="null";
            return derivedValue;
        }
    }
    return value;
}
,isc.A.offsetCanvasForRef=function isc_c_DocUtils_offsetCanvasForRef(ref,canvas){
    if(!ref)return null;
    if(canvas)this.offsetMap[ref]=canvas;
    return this.offsetMap[ref];
}
,isc.A.extraOffsetForRef=function isc_c_DocUtils_extraOffsetForRef(ref,extraOffsetId){
    if(!ref)return null;
    if(extraOffsetId)this.extraOffsetMap[ref]=extraOffsetId;
    return this.extraOffsetMap[ref];
}
,isc.A.idForRef=function isc_c_DocUtils_idForRef(ref){
    return ref.replace(/\:|\.| /g,"_");
}
,isc.A.linkForRef=function isc_c_DocUtils_linkForRef(ref,name,linkRef){
    if(!ref)return name;
    var hashIndex=ref.indexOf("#");
    var docItem;
    if(hashIndex!=-1){
        var anchor=ref.substring(hashIndex+1);
        var anchor2;
        var hashIndex2=anchor.indexOf("#");
        if(hashIndex2!=-1){
            anchor2=anchor.substring(hashIndex2+1);
            anchor=anchor.substring(0,hashIndex2);
        }
        if(!name)name=ref;
        ref=ref.substring(0,hashIndex);
        docItem=isc.jsdoc.getDocItem(ref,null,true);
        if(!docItem)return name;
        linkRef=ref+"_"+anchor+(anchor2?"_"+anchor2:"");
    }
    if(!docItem)docItem=isc.jsdoc.getDocItem(ref,null,true);
    if(!name){
        name=ref;
        var type=docItem?isc.jsdoc.getAttribute(docItem,"type"):null;
        if(type=="method"||type=="classMethod")name+="()";
        name=name.substring(name.indexOf(":")+1);
        var nameClass=name.indexOf(".")>=0?name.substring(0,name.indexOf(".")):null;
        if(nameClass==this._currentDocClass)name=name.substring(name.indexOf(".")+1);
        var title=docItem?isc.jsdoc.getAttribute(docItem,"title"):null;
        if(title)name=title;
    }
    if(!docItem){
        if(ref.startsWith("method:")||ref.startsWith("classMethod:"))name+="()";
        return name;
    }
    return isc.StringBuffer.concat("<a href='' ",
                " onmouseout='isc.Hover.clear()' onmouseover='isc.DocUtils._showDocHover(\"",ref,"\")'",
                " onclick='isc.Hover.clear();isc.DocViewer.instance._show(\"",
                ref,"\"",(linkRef?",\""+linkRef+"\"":""),");return false;'>",name,"</a>");
}
,isc.A.evalDynamicStringWithDocClass=function isc_c_DocUtils_evalDynamicStringWithDocClass(dynamicString,containerDocItem){
    var docItem=containerDocItem,
        definingClass=!isc.isA.Function(docItem.getAttribute)?docItem.definingClass:
                                          docItem.getAttribute("definingClass");
    if(definingClass){
        this._currentDocClass=definingClass.replace(/(?:[^:.]*:)?([^:.]+)/,"$1");
    }
    var result=dynamicString.evalDynamicString();
    delete this._currentDocClass;
    return result;
}
,isc.A._showDocHover=function isc_c_DocUtils__showDocHover(ref){
    var html=isc.JSDoc.hoverHTML(ref);
    if(html)isc.Hover.setAction(isc.Hover,isc.Hover.show,[html,{width:500,baseStyle:"docHover"}],300);
}
,isc.A.linkForDocNode=function isc_c_DocUtils_linkForDocNode(id,name){
    if(!isc.DocViewer)return name?name:id;
    if(!name){
        var tree=isc.DocViewer.instance._docTree;
        name=tree.getTitle(tree.find(tree.idField,id));
    }
    return isc.StringBuffer.concat("<a href='' ",
                                    " onclick='isc.DocUtils._doSelectDocNode(\"",
                                    id,"\");return false;'>",name,"</a>");
}
,isc.A._doSelectDocNode=function isc_c_DocUtils__doSelectDocNode(id){
    var tree=isc.DocViewer.instance._docTree,
        treeGrid=isc.DocViewer.instance._docTreeGrid;
    var record=tree.find(tree.idField,id);
    treeGrid.deselectAllRecords();
    treeGrid.selectRecord(record);
}
,isc.A.linkForExampleId=function isc_c_DocUtils_linkForExampleId(id,title){
    if(!title){
        var tree=window.exampleTree;
        if(tree){
            var node=tree.getExampleNode(id);
            title=node.title+" Example";
        }else{
            title=id+" Example";
        }
    }
    if(isc.DocViewer&&isc.DocViewer.instance){
        return"<a target='_blank' href='"+isc.DocViewer.instance.featureExplorerURL+"#"+id+"'>"+title+"</a>";
    }else{
        return title;
    }
}
,isc.A.textForFlags=function isc_c_DocUtils_textForFlags(flags){
    var origFlags=flags;
    flags=this.getCanonicalFlags(flags);
    if((!flags||!origFlags)&&!(origFlags&&origFlags.contains("A")))return isc.emptyString;
    var accum=isc.StringBuffer.create();
    if(flags!=isc.emptyString){
        accum.append("&nbsp;",this.linkForRef("group:flags",flags));
    }
    if(origFlags.contains("A"))accum.append("&nbsp;<span style='color:red'>[Advanced]</span>");
    return accum.toString();
}
,isc.A.getCanonicalFlags=function isc_c_DocUtils_getCanonicalFlags(flags){
    if(!flags||flags==isc.emptyString)return isc.emptyString;
    var initFlags="[";
    if(flags.contains("I"))initFlags+="I";
    if(flags.contains("R"))initFlags+="R";
    if(flags.contains("W"))initFlags+="W";
    initFlags+="]";
    if(initFlags=="[]")return isc.emptyString;
    return initFlags;
}
,isc.A.reportMissingModules=function isc_c_DocUtils_reportMissingModules(docHTML,docItem){
    var accum=isc.StringBuffer.create();
    this.reportMissingModulesStart(accum,docItem);
    accum.append(docHTML);
    this.reportMissingModulesEnd(accum,docItem);
    return accum.toString();
}
,isc.A.getMissingModules=function isc_c_DocUtils_getMissingModules(docItem){
    var missingModules;
    var requiresModules=docItem.requiresModules;
    if(!requiresModules&&docItem.definingClass){
        var c=isc.jsdoc.getDocItem(docItem.definingClass);
        if(c)requiresModules=isc.jsdoc.getList(c,"requiresModules");
    }
    if(requiresModules){
        if(!isc.hasOptionalModules(requiresModules)){
            missingModules=isc.getMissingModules(requiresModules).getProperty("name").join(", ");
        }
    }
    return missingModules;
}
,isc.A.reportMissingModulesStart=function isc_c_DocUtils_reportMissingModulesStart(accum,docItem){
    var missingModules=this.getMissingModules(docItem);
    if(missingModules){
        accum.append("<div style='background-color:lightgrey;'><br><span style='color:red;'><b>&nbsp;This API requires: <a href='",
                     isc.licensingPage,"' target=_blank>",
                     missingModules,"</a></b></span><p>");
    }
}
,isc.A.reportMissingModulesEnd=function isc_c_DocUtils_reportMissingModulesEnd(accum,docItem){
    if(this.getMissingModules(docItem))accum.append("</div>");
}
,isc.A.stripHTML=function isc_c_DocUtils_stripHTML(html){
    if(!html)return html;
    return html;
}
);
isc.B._maxIndex=isc.C+22;

isc.defineClass("JSDoc");
isc.jsdoc=isc.JSDoc;
isc.A=isc.JSDoc;
isc.A._$jsGroup="group";
isc.A._$jsType="type";
isc.A._$jsClass="class";
isc.A._$jsPseudoClass="pseudoClass";
isc.A._$jsObject="object";
isc.A._$jsInterface="interface";
isc.A._$jsMethod="method";
isc.A._$jsClassMethod="classMethod";
isc.A._$jsAttr="attr";
isc.A._$jsClassAttr="classAttr"
;

isc.A=isc.JSDoc;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.addPropertiesOnInit=false;
isc.A._containerTryOrder=["class","interface","object","pseudoClass","type","group"];
isc.A._methodsOnly=["method","classMethod"];
isc.A._methodsAndAttrs=["attr","method","classAttr","classMethod"];
isc.A._jsMethodOrAttrTemplate=[
,
":",
,
".",
isc.emtptyString
];
isc.A._jsClassTemplate=[
,
":",
isc.emptyString
];
isc.B.push(isc.A.init=function isc_c_JSDoc_init(data){
    if(!data)return;
    if(this.data)return;
    this.data=data;
    var refs=this.refs=[];
    if(data.documentElement){
        this.dataIsXML=true;
        var items=this.items=isc.xml.selectNodes(this.data,"/docItems/docItem");
        var docItems=this.docItems={};
        var refS="ref";
        for(var i=0;i<items.length;i++){
            var item=items[i];
            var ref=item.getAttribute(refS);
            refs[i]=ref;
            items[i]=item;
            docItems[ref]=item;
        }
    }else{
        var docItems=this.docItems=this.data;
        var items=this.items=[];
        for(var ref in this.docItems){
            var i=refs.length;
            refs[i]=ref;
            items[i]=docItems[ref];
        }
    }
}
,isc.A.getRefs=function isc_c_JSDoc_getRefs(){
    return this.refs;
}
,isc.A.hasData=function isc_c_JSDoc_hasData(){
    return this.docItems!=null;
}
,isc.A.getAttributes=function isc_c_JSDoc_getAttributes(obj,fieldNames){
    if(this.dataIsXML)return isc.xml.getAttributes(obj,fieldNames);
    return obj;
}
,isc.A.getAttribute=function isc_c_JSDoc_getAttribute(obj,fieldName){
    if(this.dataIsXML)return obj.getAttribute(fieldName);
    return obj[fieldName];
}
,isc.A.toJS=function isc_c_JSDoc_toJS(obj,fieldNames){
    if(this.dataIsXML)return isc.xml.toJS(obj,false,fieldNames);
    return obj;
}
,isc.A.setAttribute=function isc_c_JSDoc_setAttribute(obj,fieldName,fieldValue){
    if(this.dataIsXML)obj.setAttribute(fieldName,fieldValue);
    else obj[fieldName]=fieldValue;
}
,isc.A.removeAttribute=function isc_c_JSDoc_removeAttribute(obj,fieldName){
    if(this.dataIsXML)obj.removeAttribute(fieldName);
    else delete obj[fieldName];
}
,isc.A.getList=function isc_c_JSDoc_getList(obj,fieldName){
    if(this.dataIsXML)return isc.xml.selectScalarList(obj,fieldName+"/text()");
    var data=obj[fieldName];
    if(!data)data=[];
    if(!isc.isAn.Array(data))data=[data];
    return data;
}
,isc.A.addToList=function isc_c_JSDoc_addToList(obj,fieldName,newObj){
    if(this.dataIsXML){
        var nativeDoc=this.data.nativeDoc;
        var newElement=nativeDoc.createElement(fieldName);
        var s=nativeDoc.createTextNode(newObj);
        newElement.appendChild(s);
        obj.appendChild(newElement);
    }else{
        if(!obj[fieldName])obj[fieldName]=[];
        obj[fieldName].add(newObj);
    }
}
,isc.A.hoverHTML=function isc_c_JSDoc_hoverHTML(container,item,linkName){
    if(container==null)return null;
    var docItem=this.getDocItem(container,item,true),
        hoverHTML
    ;
    if(!docItem){
        var definingClass=container;
        var colonIndex=container.indexOf(isc.colon);
        if(colonIndex!=-1){
            var dotIndex=container.indexOf(isc.dot);
            definingClass=container.substring(colonIndex+1,dotIndex);
            item=container.substring(dotIndex+1,container.length);
        }
        var classObject=isc.ClassFactory.getClass(definingClass);
        if(classObject){
            var superClass=classObject.getSuperClass();
            if(superClass){
                return this.hoverHTML(superClass.getClassName(),item,linkName);
            }
        }
        return null;
    }
    var type=this.getAttribute(docItem,this._$jsType);
    if(this.isMethod(type))hoverHTML=isc.MethodFormatter.hoverHTML(this.toJS(docItem),linkName);
    else if(this.isAttr(type))hoverHTML=isc.AttrFormatter.hoverHTML(this.toJS(docItem),linkName);
    else if(this.isType(type))hoverHTML=isc.TypeViewer.hoverHTML(this.toJS(docItem),linkName);
    else if(this.isClass(type)
             ||this.isObject(type)
             ||this.isPseudoClass(type)
             ||this.isInterface(type))
    {
        hoverHTML=isc.ClassViewer.hoverHTML(this.toJS(docItem),linkName);
    }
    else if(this.isGroup(type))hoverHTML=isc.GroupViewer.hoverHTML(this.toJS(docItem),linkName);
    return hoverHTML?isc.DocUtils.evalDynamicStringWithDocClass(hoverHTML,docItem):null;
}
,isc.A.isMethod=function isc_c_JSDoc_isMethod(type){
    return type==this._$jsMethod||type==this._$jsClassMethod;
}
,isc.A.isInstance=function isc_c_JSDoc_isInstance(type){
    return type==this._$jsMethod||type==this._$jsAttr;
}
,isc.A.isAttr=function isc_c_JSDoc_isAttr(type){
    return type==this._$jsAttr||type==this._$jsClassAttr;
}
,isc.A.isType=function isc_c_JSDoc_isType(type){
    return type==this._$jsType;
}
,isc.A.isClass=function isc_c_JSDoc_isClass(type){
    return type==this._$jsClass;
}
,isc.A.isObject=function isc_c_JSDoc_isObject(type){
    return type==this._$jsObject;
}
,isc.A.isPseudoClass=function isc_c_JSDoc_isPseudoClass(type){
    return type==this._$jsPseudoClass;
}
,isc.A.isInterface=function isc_c_JSDoc_isInterface(type){
    return type==this._$jsInterface;
}
,isc.A.isGroup=function isc_c_JSDoc_isGroup(type){
    return type==this._$jsGroup;
}
,isc.A.addDocItem=function isc_c_JSDoc_addDocItem(ref,docItem){
    this.docItems[ref]=docItem;
    this.items.add(docItem);
    this.refs.add(ref);
    if(this.dataIsXML)this.data.documentElement.appendChild(docItem);
}
,isc.A.getType=function isc_c_JSDoc_getType(docItem){
    return this.getAttribute(docItem,this._$jsType);
}
,isc.A.getDocItem=function isc_c_JSDoc_getDocItem(container,item,checkSuper){
    if(!this.docItems){
        this.logWarn("documentation not available");
        return null;
    }
    var docItem=this.docItems[container];
    if(docItem)return docItem;
    if(!isc.isA.String(container))return null;
    var ref,
        refType;
    var splitPos=container.indexOf(isc.colon);
    if(splitPos>=0){
        refType=container.substring(0,splitPos);
        container=container.substring(splitPos+1);
    }
    if(item==null&&container.indexOf(isc.dot)==-1){
        for(var i=0;i<this._containerTryOrder.length;i++){
            refType=this._containerTryOrder[i];
            docItem=this.docItems[this.makeRef(refType,container)]
            if(docItem)return docItem;
        }
    }else{
        var className=container,
            itemName=item;
        ;
        if(!itemName){
            if(container.contains(isc.dot)){
                var s=container.split(isc.dot);
                className=s[0];
                itemName=s[1];
            }else{
                this.logWarn("No item specified and container: "+container+" not in dot notation");
                return null;
            }
        }
        var tryMethodsOnly=false;
        var parensIndex=itemName.indexOf("()");
        if(parensIndex!=-1){
            itemName=itemName.substring(0,parensIndex);
            tryMethodsOnly=true;
        }
        var itemTryOrder=tryMethodsOnly?this._methodsOnly:this._methodsAndAttrs;
        for(var i=0;i<itemTryOrder.length;i++){
            refType=itemTryOrder[i];
            docItem=this.docItems[this.makeRef(refType,className,itemName)];
            if(docItem)return docItem;
        }
        if(checkSuper&&className!=null){
            var c=isc.ClassFactory.getClass(className);
            if(c){
                var sup=c.getSuperClass();
                if(sup)return this.getDocItem(sup.getClassName(),itemName,true);
            }
        }
    }
    this.logDebug("getDocItem: couldn't find docItem from params (container: "
                 +container+", item: "+item+")");
    return null;
}
,isc.A.makeRef=function isc_c_JSDoc_makeRef(type,name,methodOrAttr){
    var t;
    if(methodOrAttr!=null){
        t=this._jsMethodOrAttrTemplate;
        t[0]=type;
        t[2]=name;
        t[4]=methodOrAttr;
    }else{
        t=this._jsClassTemplate;
        t[0]=type;
        t[2]=name;
    }
    return t.join(isc.emptyString);
}
,isc.A.getGroupForAttribute=function isc_c_JSDoc_getGroupForAttribute(className,attrName){
    var attrItem=this.getAttributeItem(className,attrName);
    if(attrItem!=null){
        var groups=this.getList(attrItem,"groups");
        return groups?groups[0]:"other";
    }
    var ds=isc.DS.get(className);
    if(ds==null)return null;
    if(ds.inheritsFrom)return this.getGroupForAttribute(ds.inheritsFrom,attrName);
    else return null;
}
,isc.A.getAllGroupsForAttribute=function isc_c_JSDoc_getAllGroupsForAttribute(className,attrName){
    var attrItem=this.getAttributeItem(className,attrName);
    if(attrItem!=null){
        var groups=this.getList(attrItem,"groups");
        return groups?groups:["other"];
    }
    var ds=isc.DS.get(className);
    if(ds==null)return null;
    if(ds.inheritsFrom)return this.getAllGroupsForAttribute(ds.inheritsFrom,attrName);
    else return null;
}
,isc.A.getGroupItem=function isc_c_JSDoc_getGroupItem(name){
    return this.getDocItem(this.makeRef(this._$jsGroup,name));
}
,isc.A.getAttributeItem=function isc_c_JSDoc_getAttributeItem(className,attrName){
    return this.getDocItem(this.makeRef(this._$jsAttr,className,attrName));
}
,isc.A.isAdvancedAttribute=function isc_c_JSDoc_isAdvancedAttribute(docItem){
    return this.attributeContainsAllFlags(docItem,"A");
}
,isc.A.attributeContainsAllFlags=function isc_c_JSDoc_attributeContainsAllFlags(docItem,flags){
    var attrItem=docItem;
    if(attrItem==null)return false;
    if(flags==null||isc.isAn.emptyString(flags))return true;
    var attrItemFlags=this.getAttribute(attrItem,"flags");
    if(attrItemFlags==null||isc.isAn.emptyString(attrItemFlags))return false;
    for(var i=0;i<flags.length;i++){
        if(attrItemFlags.indexOf(flags.charAt(i))==-1)return false;
    }
    return true;
}
,isc.A.docItemForDSField=function isc_c_JSDoc_docItemForDSField(ds,fieldName){
    ds=isc.DS.get(ds);
    if(ds){
        var field=ds.getField(fieldName);
        if(field){
            var docItem=isc.clone(field);
            docItem.definingClass=ds.Constructor?ds.Constructor:ds.ID;
            docItem.ref="attr:"+field.definitionClass+"."+fieldName;
            docItem.valueType=docItem.type;
            docItem.type="attr";
            return docItem;
        }
    }
    return null;
}
,isc.A.docItemForDSMethod=function isc_c_JSDoc_docItemForDSMethod(ds,methodName){
    ds=isc.DS.get(ds);
    if(ds){
        var method=ds.methods.find("name",methodName);
        if(method){
            method.definingClass=ds.Constructor?ds.Constructor:ds.ID;
            method.ref="method:"+method.definitionClass+"."+methodName;
            return method;
        }
    }
    return null;
}
,isc.A.getSuperClassName=function isc_c_JSDoc_getSuperClassName(classDoc){
    var superClassName=classDoc.inheritsFrom;
    if(!superClassName){
        var classObject=isc.ClassFactory.getClass(classDoc.name);
        if(classObject){
            var superClass=classObject.getSuperClass();
            if(superClass)superClassName=superClass.getClassName();
        }
    }
    return superClassName;
}
,isc.A.addDocItem=function isc_c_JSDoc_addDocItem(docItem,index){
}
,isc.A.genScriptDoc=function isc_c_JSDoc_genScriptDoc(options,listener){
    var refs=isc.JSDoc.refs;
    var docData={};
    var jsDoc=this;
    this.options=options||{};
    var docItems=isc.getValues(isc.JSDoc.docItems);
    var classItems=docItems.findAll("type","class");
    classItems=classItems.concat(docItems.findAll("type","object"));
    classItems=classItems.concat(docItems.findAll("type","interface"));
    this.logWarn("classItems: "+this.echo(classItems));
    for(var i=0;i<classItems.length;i++){
        if(!options.classes||options.classes.contains(classItems[i].name)){
            this.addScriptDocItem(isc.clone(classItems[i]),docData);
        }
    }
    isc.Timer.setTimeout(function(){
        var otherItems=docItems.duplicate();
        otherItems.removeAll(classItems);
        jsDoc.logWarn(jsDoc.echoLeaf(otherItems));
        for(var i=0;i<otherItems.length;i++){
            if(!options.classes||options.classes.contains(otherItems[i].definingClass)){
                jsDoc.addScriptDocItem(otherItems[i],docData);
            }
        }
        isc.Timer.setTimeout(function(){jsDoc.genScriptDocXML(docData);})
    });
}
,isc.A.genScriptDocXML=function isc_c_JSDoc_genScriptDocXML(docData){
    isc.DataSource.create({
        ID:"sdocParam",
        tagName:"parameter",
        fields:[
            {name:"name",xmlAttribute:"true"},
            {name:"usage",xmlAttribute:"true"},
            {name:"type",xmlAttribute:"true"}
        ]
    });
    isc.DataSource.create({
        ID:"sdocReturnType",
        tagName:"return-type",
        fields:[
            {name:"type",xmlAttribute:"true"}
        ]
    });
    isc.DataSource.create({
        ID:"sdocMethod",
        tagName:"method",
        fields:[
            {name:"name",xmlAttribute:"true"},
            {name:"scope",xmlAttribute:"true"},
            {name:"stringMethod",xmlAttribute:"true"},
            {name:"event",xmlAttribute:"true"},
            {name:"bubbles",xmlAttribute:"true"},
            {name:"parameters",multiple:true,type:"sdocParam"},
            {name:"return-types",multiple:true,type:"sdocReturnType"}
        ]
    });
    isc.DataSource.create({
        ID:"sdocProperty",
        tagName:"property",
        fields:[
            {name:"name",xmlAttribute:"true"},
            {name:"scope",xmlAttribute:"true"},
            {name:"access",xmlAttribute:"true"},
            {name:"type",xmlAttribute:"true"}
        ]
    });
    isc.DataSource.create({
        ID:"sdocClass",
        tagName:"class",
        fields:[
            {name:"type",xmlAttribute:"true"},
            {name:"superclass",xmlAttribute:"true"},
            {name:"properties",multiple:true,type:"sdocProperty"},
            {name:"methods",multiple:true,type:"sdocMethod"}
        ]
    });
    var xml=window.sdocClass.xmlSerialize(isc.getValues(docData));
    xml='<?xml version="1.0" encoding="UTF-8"?>\n<javascript>\n'+
            xml+
          "\n</javascript>";
    var chunk=1024*512;
    var sentLength=0;
    isc.DMI.callBuiltin({
        methodName:"saveFile",
        arguments:[
            "/tools/aptana/SmartClient"+this.options.version+"API.xml",
            xml.length>chunk?xml.substring(0,chunk):xml
        ]
    });
    sentLength=chunk;
    while(xml.length>sentLength){
        isc.DMI.callBuiltin({
            methodName:"appendToFile",
            arguments:[
                "/tools/aptana/SmartClient"+this.options.version+"API.xml",
                sentLength+chunk>xml.length?xml.substring(sentLength)
                                                :xml.substring(sentLength,sentLength+chunk)]
        });
        sentLength+=chunk;
    }
}
,isc.A.addScriptDocItem=function isc_c_JSDoc_addScriptDocItem(docItem,docData){
    var ref=docItem.ref;
    var refPath=ref.substring(ref.indexOf(docItem.type)+docItem.type.length+1);
    var refContainer=refPath.substring(0,refPath.indexOf("."));
    var refName=refPath.substring(refPath.indexOf(".")+1);
    isc.logWarn("Adding to ScriptDoc: "+docItem.ref);
    var type=docItem.type;
    switch(docItem.type){
        case"class":
        case"object":
            var className=refPath;
            var iscClass=isc.ClassFactory.getClass(className);
            var superClass=iscClass&&iscClass.getSuperClass()
            if(superClass==null&&type!="object")this.logWarn("no Super: "+className);
            var classDef=docData[className]=docData[className]||{
                type:"isc."+refPath,
                superclass:superClass?"isc."+superClass.Class:"Object",
                description:this.stripDescription(docItem.description)
            }
            if(!iscClass||!iscClass.isA("FormItem")){
                if(!classDef.methods)classDef.methods=[];
                var methodDef={
                    name:"create",
                    description:"Create a new instance of "+className,
                    scope:"static"
                }
                methodDef["return-types"]={
                    type:"isc."+className,
                    description:"The newly-created instance"
                }
                classDef.methods.add(methodDef);
            }
            if(this.options.duplicate=="most"||this.options.duplicate=="all"){
                this.documentInheritanceRecursively(classDef,superClass);
            }
        break;
        case"classAttr":
        case"attr":
            var classDef=docData[refContainer];
            if(classDef==null){
                this.logWarn("No class definition: "+ref);
                break;
            }
            if(!classDef.properties)classDef.properties=[];
            classDef.properties.add({
                name:refName,
                description:this.stripDescription(docItem.description),
                scope:type=="classAttr"?"static":"instance",
                access:docItem.flags&&docItem.flags.contains("W")?"read-write":"read",
                type:docItem.valueType
            })
        break;
        case"method":
        case"classMethod":
            if(refContainer=="FormItem"||refName!="create"){
                var classDef=docData[refContainer];
                if(classDef==null){
                    this.logWarn("No class definition: "+ref);
                    break;
                }
                if(!classDef.methods)
                    classDef.methods=[];
                methodDef={
                    name:refName,
                    description:this.stripDescription(docItem.description),
                    scope:type=="classMethod"?"static":"instance"
                }
                methodDef["return-types"]={
                    type:this.normalizeType(docItem.returns?docItem.returns.type:null),
                    description:docItem.returns?this.stripDescription(docItem.returns.description):""
                }
                this.addParameters(methodDef,docItem);
                if(this.options.scMode){
                    this.scModeExtras(methodDef,refContainer,refName);
                }
                classDef.methods.add(methodDef);
            }
        break;
    }
}
,isc.A.addParameters=function isc_c_JSDoc_addParameters(methodDef,docItem){
    if(isc.isAn.Array(docItem.params)){
        var params=[];
        for(var i=0;i<docItem.params.length;i++){
            var p=docItem.params[i];
            if(!p.type){
                isc.logWarn(docItem.ref+", parameter "+p.name+" has null type");
                var paramType="unspecified";
            }else{
                paramType=this.normalizeType(p.type);
            }
            params.add({
                name:p.name,
                usage:p.optional?"optional":"required",
                type:paramType,
                description:this.stripDescription(p.description)
            });
            methodDef["parameters"]=params;
        }
    }
}
,isc.A.scModeExtras=function isc_c_JSDoc_scModeExtras(methodDef,className,methodName){
    var iscClass=isc.ClassFactory.getClass(className);
    if(iscClass&&iscClass._stringMethodRegistry[methodName]!=null){
        methodDef.stringMethod=true;
        if(iscClass.getInstanceProperty(methodName)==null||
            iscClass[methodName]==isc.noOp){
            methodDef.event=true;
        }else{
            var funcBody=isc.Func.getBody(iscClass.getInstanceProperty(methodName)).trim();
            if(funcBody==isc.emptyString){
                methodDef.event=true;
            }
        }
        if(methodDef.event&&isc.EH.reverseEventTypes[methodName]){
            methodDef.bubbles=true;
        }
    }
}
,isc.A.normalizeType=function isc_c_JSDoc_normalizeType(typeIn){
    if(!typeIn)return"null";
    if(typeIn.toLowerCase().startsWith("string")||
    typeIn.toLowerCase().startsWith("number")||
    typeIn.toLowerCase().startsWith("int")||
    typeIn.toLowerCase().startsWith("boolean")||
    typeIn.toLowerCase().startsWith("text")||
    typeIn.toLowerCase().startsWith("object")){
        return typeIn;
    }else{
        return"isc."+typeIn;
    }
}
,isc.A.documentInheritanceRecursively=function isc_c_JSDoc_documentInheritanceRecursively(classDef,superClass){
    var scName=superClass?superClass.getClassName():null;
    if(scName){
        this.documentInheritanceRecursively(classDef,superClass.getSuperClass());
        var docItems=isc.getValues(isc.JSDoc.docItems);
        classDef.methods=classDef.methods||[];
        classDef.properties=classDef.properties||[];
        var classMethods=docItems.findAll({
            definingClass:"class:"+scName,
            type:"method"
        });
        classMethods=classMethods||[];
        classMethods.addList(docItems.findAll({
            definingClass:"class:"+scName,
            type:"classMethod"
        }));
        for(var i=0;i<classMethods.length;i++){
            var method=classMethods[i];
            if((scName!="Class"&&scName!="Canvas")||
                (this.options.duplicate=="all"||
                 method.name=="create"||
                 this.options.pickedMethods.contains(method.name))&&
                 (scName=="FormItem"||method.name!="create")){
                var methodDef={
                    name:method.name,
                    description:this.stripDescription(method.description),
                    scope:method.type=="classMethod"?"static":"instance"
                }
                methodDef["return-types"]={
                    type:method.returns?this.normalizeType(method.returns.type):"null",
                    description:method.returns?method.returns.description:""
                }
                this.addParameters(methodDef,method);
                if(this.options.scMode){
                    this.scModeExtras(methodDef,scName,method.name);
                }
                classDef.methods.add(methodDef);
            }
        }
        var classAttrs=docItems.findAll({
            definingClass:"class:"+scName,
            type:"attr"
        });
        classAttrs=classAttrs||[];
        classAttrs.addList(docItems.findAll({
            definingClass:"class:"+scName,
            type:"classAttr"
        }));
        for(var i=0;i<classAttrs.length;i++){
            var attr=classAttrs[i];
            if((scName!="Class"&&scName!="Canvas")||
                 this.options.duplicate=="all"||
                 this.options.pickedAttrs.contains(attr.name)){
                classDef.properties.add({
                    name:attr.name,
                    description:this.stripDescription(attr.description),
                    scope:attr.type=="classAttr"?"static":"instance",
                    access:attr.flags&&attr.flags.contains("W")?"read-write":"read",
                    type:attr.valueType
                });
            }
        }
    }
}
,isc.A.stripDescription=function isc_c_JSDoc_stripDescription(desc){
    if(desc==null)return null;
    var moreTokens=true,
        work=isc.clone(desc);
    while(moreTokens){
        var start=work.indexOf('${isc.DocUtils');
        if(start<0)moreTokens=false;
        else{
            var end=work.indexOf('}',start);
            if(end>start){
                var substr=work.substring(start,end);
                var quote=substr.lastIndexOf("'");
                var apos=substr.lastIndexOf('&apos;');
                if(quote<apos){
                    quote=apos;
                }
                var replaceLen=1;
                substr=substr.substring(0,quote);
                quote=substr.lastIndexOf("'");
                apos=substr.lastIndexOf('&apos;');
                var colon=substr.lastIndexOf(':');
                if(quote<apos){
                    quote=apos;
                    replaceLen=6;
                }
                if(quote<colon){
                    quote=colon;
                    replaceLen=1;
                }
                substr=substr.substring(quote+replaceLen);
                work=work.substring(0,start)+substr+work.substring(end+1);
            }
        }
    }
    return isc.DocUtils.stripHTML(work.trim());
}
);
isc.B._maxIndex=isc.C+42;

if(window.docItems)isc.jsdoc.init(window.docItems);
isc.ClassFactory.defineClass("DetailFormatter");
isc.A=isc.DetailFormatter.getPrototype();
isc.A.detailItems=null;
isc.A.summary=false
;

isc.A=isc.DetailFormatter.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.generateHTML=function isc_DetailFormatter_generateHTML(context,accum){
    if(!accum)accum=isc.StringBuffer.create();
    for(var i=0;i<this.detailItems.length;i++){
        var item=this.detailItems[i];
        var detail=context[item];
        if(detail&&(isc.isAn.Array(detail)?detail.length>0:1)){
            this["generate_"+item](context,accum);
            if(i+1<this.detailItems.length)accum.append("<br><br>");
        }
    }
    return accum;
}
,isc.A.generate_examples=function isc_DetailFormatter_generate_examples(context,accum){
    accum.append("<b>Examples:</b><br><ul>");
    if(!isc.isAn.Array(context.examples))context.examples=[context.examples];
    for(var i=0;i<context.examples.length;i++){
        accum.append("<li>",context.examples[i]);
    }
    accum.append("</ul>");
}
,isc.A.generate_groups=function isc_DetailFormatter_generate_groups(context,accum){
    if(!isc.isAn.Array(context.groups))context.groups=[context.groups];
    accum.append("<b>Groups:&nbsp;</b>",context.groups.join(", "));
}
,isc.A.generate_seeAlso=function isc_DetailFormatter_generate_seeAlso(context,accum){
    var docData=isc.DocViewer.docData;
    accum.append("<b>See Also:</b>");
    if(!isc.isAn.Array(context.seeAlso))context.seeAlso=[context.seeAlso];
    for(var i=0;i<context.seeAlso.length;i++){
        var seeAlso=context.seeAlso[i];
        if(isc.isA.String(seeAlso)){
            accum.append("<br>&nbsp;&nbsp;",seeAlso);
        }else{
            var seeLink=isc.DocUtils.linkForRef(seeAlso.ref);
            if(seeLink){
                accum.append("<br>&nbsp;&nbsp;",seeLink," ",
                    (seeAlso.description?isc.DocUtils.stripHTML(seeAlso.description):isc.emptyString));
            }
        }
    }
}
,isc.A.generate_platformNotes=function isc_DetailFormatter_generate_platformNotes(context,accum){
    accum.append("<b>Platform-Specific Notes:</b><br>",context.platformNotes);
}
,isc.A.generate_values=function isc_DetailFormatter_generate_values(context,accum){
    accum.append("<b>Valid values:</b><p><table cellpadding=2 class='normal'>");
    if(!isc.isAn.Array(context.values))context.values=[context.values];
    for(var i=0;i<context.values.length;i++){
        var valueContext=context.values[i];
        var value=isc.DocUtils.lookupValue(valueContext.value);
        var description=isc.DocUtils.stripHTML(valueContext.description);
        if(this.summary&&description&&description.indexOf(". ")!=-1){
            description=description.slice(0,description.indexOf(". ")+1);
        }
        accum.append("<tr><td valign='top'><i>",value,"</i></td><td>",description,"</td></tr>");
    }
    accum.append("</table>");
}
,isc.A.generate_params=function isc_DetailFormatter_generate_params(context,accum){
    accum.append("<b>Parameters:</b>");
    if(!isc.isAn.Array(context.params))context.params=[context.params];
    for(var i=0;i<context.params.length;i++){
        var param=context.params[i];
        var defaultValue=isc.DocUtils.lookupValue(param.defaultValue);
        if(isc.isA.String(defaultValue))defaultValue=defaultValue.convertTags();
        var paramDescription=isc.DocUtils.stripHTML(param.description);
        accum.append("<br>&nbsp;&nbsp;&nbsp;&nbsp;<b><i>",param.name,"</i></b>&nbsp;",
             param.optional!=null&&param.optional.toString()=="true"?"(optional) ":
                     isc.emptyString,
             "&nbsp;",
             param.type||paramDescription||defaultValue?"-&nbsp;":isc.emptyString,
             param.type?"type:&nbsp;<b>"+isc.TypeViewer.linkForType(param.type,
                                                 null,param.name)+"</b>":isc.emptyString,
             defaultValue||paramDescription?"&nbsp;":isc.emptyString,
             defaultValue?", defaultValue:&nbsp;<b>"+defaultValue+"</b>":isc.emptyString,
             "<br>",
             paramDescription?"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
                     paramDescription:isc.emptyString
            );
    }
}
,isc.A.generate_returns=function isc_DetailFormatter_generate_returns(context,accum){
    var returns=context.returns;
    accum.append("<b>Returns:</b><br>&nbsp;&nbsp;&nbsp;&nbsp;");
    if(returns.type){
        accum.append("type:&nbsp;<b>",isc.TypeViewer.linkForType(returns.type),"</b>",
                     (returns.description?"&nbsp;-&nbsp;":isc.emptyString));
    }
    if(returns.description)accum.append(isc.DocUtils.stripHTML(returns.description));
}
,isc.A.generate_getter=function isc_DetailFormatter_generate_getter(context,accum){
    var getters=context["getter"];
    if(!isc.isAn.Array(getters))getters=[getters];
    var methodType=context.type=="attr"?"method":"classMethod";
    accum.append("<b>Getter:</b><code> ");
    var definingClassName=isc.jsdoc.getAttribute(isc.jsdoc.getDocItem(context.definingClass),"name");
    for(var i=0;i<getters.length;i++){
        accum.append(isc.DocUtils.linkForRef(methodType+":"+definingClassName+"."+getters[i]));
        if(i+1<getters.length)accum.append(", ");
    }
    accum.append("</code>");
}
,isc.A.generate_setter=function isc_DetailFormatter_generate_setter(context,accum){
    var setters=context["setter"];
    if(!isc.isAn.Array(setters))setters=[setters];
    var methodType=context.type=="attr"?"method":"classMethod";
    accum.append("<b>Setter:</b><code> ");
    var definingClassName=isc.jsdoc.getAttribute(isc.jsdoc.getDocItem(context.definingClass),"name");
    for(var i=0;i<setters.length;i++){
        accum.append(isc.DocUtils.linkForRef(methodType+":"+definingClassName+"."+setters[i]));
        if(i+1<setters.length)accum.append(", ");
    }
    accum.append("</code>");
}
);
isc.B._maxIndex=isc.C+10;

isc.ClassFactory.defineClass("AttrFormatter","Canvas");
isc.A=isc.AttrFormatter;
isc.A.detailItems=["values","getter","setter","examples","seeAlso","platformNotes"]
;

isc.A=isc.AttrFormatter;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.hoverHTML=function isc_c_AttrFormatter_hoverHTML(attr,linkName){
    return this.attrHTML(attr,null,linkName);
}
,isc.A.attrHTML=function isc_c_AttrFormatter_attrHTML(attr,accum,linkName){
    var wantString=(accum==null);
    if(wantString){
        accum=isc.StringBuffer.create();
    }
    if(this._htmlTemplate==null){
        this._htmlTemplate=[
            "<table BORDER='0' CELLSPACING='0' WIDTH='100%' class='normal'><tr><td><b>",
            null,
            "</b>",
            null,
            "</td><td align='right'><code><i>type:</i>",
            null,
            null,
            "</code></td></tr></table>",
            "<table BORDER='0' CELLSPACING='0' WIDTH='100%' class='normal'>",
            "<col width='15'><col width='*'><tr><td></td><td>",
            null,
            null,
            "<br><br>",
            null,
            "</td></tr></table>"
        ];
    }
    var at=this._htmlTemplate;
    isc.DocUtils.reportMissingModulesStart(accum,attr);
    accum.append(at[0],
                 linkName?isc.DocUtils.linkForRef(attr.ref):attr.name,
                 at[2],
                 isc.DocUtils.textForFlags(attr.flags),
                 at[4],
                 isc.TypeViewer.linkForType(attr.valueType),
                 this.formatDefaultValue(attr),
                 at[7],at[8],at[9],
                 attr.deprecated?"<br><B>DEPRECATED:&nbsp;"+attr.deprecated+"</B><BR><BR>":"<br>",
                 attr.description?isc.DocUtils.stripHTML(attr.description):isc.emptyString,
                 at[12]
    );
    isc.DetailFormatter.newInstance({
        detailItems:this.detailItems
    }).generateHTML(attr,accum);
    accum.append(at[14]);
    isc.DocUtils.reportMissingModulesEnd(accum,attr);
    return wantString?accum.release(false):accum;
}
,isc.A.formatDefaultValue=function isc_c_AttrFormatter_formatDefaultValue(attr){
    var defaultValue=isc.DocUtils.lookupValue(attr.defaultValue);
    if(defaultValue){
        defaultValue=", <i>defaultValue</i>: "+String(defaultValue).replaceAll("$","&#36;");
    }
    return defaultValue;
}
);
isc.B._maxIndex=isc.C+3;

isc.A=isc.AttrFormatter.getPrototype();
isc.A.type=null;
isc.A.headerName=null;
isc.A.attrs=null;
isc.A._other="other";
isc.A._underscore="_";
isc.A._groupPrefix="group:"
;

isc.A=isc.AttrFormatter.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_AttrFormatter_initWidget(){
    this.Super(this._$initWidget);
    this._generateAttrsByGroupCache();
}
,isc.A._generateAttrsByGroupCache=function isc_AttrFormatter__generateAttrsByGroupCache(){
    if(!this.attrsByGroup){
        this.groupList=Array.newInstance({sortUnique:true});
        this.attrsByGroup={};
        this.attrsByGroup[this._other]=[];
        for(var i=0;i<this.attrs.length;i++){
            var docItem=isc.jsdoc.getDocItem(this.attrs[i]);
            var attr=isc.jsdoc.toJS(docItem);
            if(attr.groups){
                if(!isc.isAn.Array(attr.groups))attr.groups=[attr.groups];
                this.groupList.addList(attr.groups);
            }
            var attrGroups=attr.groups||[this._other];
            for(var j=0;j<attrGroups.length;j++){
                var group=attrGroups[j];
                if(!this.attrsByGroup[group])this.attrsByGroup[group]=Array.newInstance({sortUnique:true});
                this.attrsByGroup[group].add(attr);
            }
        }
        if(this.attrsByGroup.other.length>0)this.groupList.add(this._other);
    }
}
,isc.A.contents=function isc_AttrFormatter_contents(){
    if(this.generatedContents)return this.generatedContents;
    var docUtils=isc.DocUtils;
    var accum=isc.StringBuffer.create();
    accum.maxStreamLength=1000000;
    var id=isc.StringBuffer.concat(this.classDoc.ref,this._underscore,this.type);
    docUtils.offsetCanvasForRef(id,this);
    docUtils.buildTableHeader(this.headerName,id,accum);
    if(isc.AttrFormatter._attrStart==null){
        isc.AttrFormatter._attrStart=[
            "<tr id='",
            null,
            "'><td>",
            "<table border='1' width='100%'>",
            "<tr BGCOLOR='lightgrey' class='normal'><td colspan='2'>Group: <b>",
            null,
            "</b></td></tr>"
        ];
    }
    var as=isc.AttrFormatter._attrStart;
    for(var i=0;i<this.groupList.length;i++){
        var groupName=this.groupList[i];
        var groupLinkRef=isc.StringBuffer.concat(this.classDoc.ref,this._underscore,
                                                   this.type,this._underscore,groupName);
        var groupId=docUtils.idForRef(groupLinkRef);
        docUtils.offsetCanvasForRef(groupLinkRef,this);
        accum.append(as[0],groupId,as[2],as[3],as[4],docUtils.linkForRef(this._groupPrefix+groupName),as[6]);
        if(isc.AttrFormatter._attrItemTemplate==null){
            isc.AttrFormatter._attrItemTemplate=[
                "<tr id='",
                null,
                "'><td>",
                null,
                "</td></tr>"
           ];
        }
        var at=isc.AttrFormatter._attrItemTemplate;
        for(var j=0;j<this.attrsByGroup[groupName].length;j++){
            var attr=this.attrsByGroup[groupName][j];
            docUtils.offsetCanvasForRef(attr.ref,this);
            docUtils.extraOffsetForRef(attr.ref,groupId);
            accum.append(at[0],
                         docUtils.idForRef(attr.ref),
                         at[2],at[3]);
            isc.AttrFormatter.attrHTML(attr,accum);
            accum.append(at[4]);
        }
        accum.append("</table>");
    }
    this.generatedContents=accum.release(false);
    return this.generatedContents;
}
);
isc.B._maxIndex=isc.C+3;

isc.ClassFactory.defineClass("MethodFormatter","Canvas");
isc.A=isc.MethodFormatter;
isc.A.detailItems=["params","returns","examples","seeAlso","platformNotes"]
;

isc.A=isc.MethodFormatter;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.hoverHTML=function isc_c_MethodFormatter_hoverHTML(method,linkName){
    var definingClass=method.definingClass.contains(":")?
        isc.jsdoc.getAttribute(isc.jsdoc.getDocItem(method.definingClass),"name"):
        method.definingClass;
    var classObject=isc.ClassFactory.getClass(definingClass);
    return this.methodHTML(method,null,classObject,linkName);
}
,isc.A.methodHTML=function isc_c_MethodFormatter_methodHTML(method,accum,classObject,linkName){
    var wantString=!accum;
    if(wantString){
        accum=isc.StringBuffer.create();
    }
    if(!this._htmlTemplate){
        this._htmlTemplate=[
            "<table BORDER='0' CELLSPACING='0' WIDTH='100%' class='normal'>",
            "<col width='15'><col width='*'><tr><td colspan='2'><i>",
            null,
            "</i>&nbsp;<b>",
            null,
            "</b>&nbsp;",
            null,
            null,
            null,
            "</td></tr><tr><td></td><td>",
            null,
            null,
            null,
            null,
            "<br><br>",
            null,
            "</td></tr></table>"
        ];
    }
    var mt=this._htmlTemplate;
    isc.DocUtils.reportMissingModulesStart(accum,method);
    var deprecated=method.deprecated?isc.DocUtils.stripHTML(method.deprecated):
                                         isc.emptyString;
    accum.append(mt[0],mt[1],
                 method.returns&&method.returns.type?isc.TypeViewer.linkForType(method.returns.type):"void",
                 mt[3],
                 linkName?isc.DocUtils.linkForRef(method.ref):method.name,
                 mt[5],
                 this.formatMethodParams(method),
                 this.formatStringMethodText(method,classObject),
                 isc.DocUtils.textForFlags(method.flags),
                 mt[9],
                 deprecated?"<br><B>DEPRECATED:&nbsp;"+deprecated+"</B><BR><BR>":"<br>",
                 method.description?isc.DocUtils.stripHTML(method.description):isc.emptyString
    );
    if(method.overridden)accum.append(method.overridden);
    if(method.override)accum.append("<br><br>",isc.emptyString);
    accum.append(mt[14]);
    isc.DetailFormatter.newInstance({
        docViewer:this.docViewer,
        detailItems:isc.MethodFormatter.detailItems,
        classDoc:this.classDoc
    }).generateHTML(method,accum);
    accum.append(mt[16]);
    isc.DocUtils.reportMissingModulesEnd(accum,method);
    return wantString?accum.release(false):accum;
}
,isc.A.formatMethodParams=function isc_c_MethodFormatter_formatMethodParams(method){
    var methodParams=isc.StringBuffer.create().append("(");
    if(method.params&&!isc.isAn.Array(method.params))
        method.params=[method.params];
    if(method.params){
        var inOptional=false;
        var havePrevious=false;
        for(var k=0;k<method.params.length;k++){
            var param=method.params[k];
            if(param.optional!=null&&param.optional.toString()=="true"&&!inOptional){
                inOptional=true;
                methodParams.append("<span style='color:gray'>[");
            }
            if(havePrevious)methodParams.append(", ");
            methodParams.append(param.name);
            havePrevious=true;
        }
        if(inOptional)methodParams.append("]</span>");
    }
    return methodParams.append(")").release(false);
}
,isc.A.formatStringMethodText=function isc_c_MethodFormatter_formatStringMethodText(method,classObject){
    var stringMethodText=isc.emptyString;
    if(classObject&&classObject._stringMethodRegistry[method.name]!=null){
        if(this._stringMethodText==null){
            this._stringMethodText="&nbsp;"+isc.DocUtils.linkForRef("group:stringMethods","[String Method]");
        }
        stringMethodText=this._stringMethodText;
    }
    return stringMethodText;
}
);
isc.B._maxIndex=isc.C+4;

isc.A=isc.MethodFormatter.getPrototype();
isc.A._other="other";
isc.A._underscore="_";
isc.A._groupPrefix="group:"
;

isc.A=isc.MethodFormatter.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_MethodFormatter_initWidget(){
    this.Super(this._$initWidget);
    this._generateMethodsByGroupCache();
}
,isc.A._generateMethodsByGroupCache=function isc_MethodFormatter__generateMethodsByGroupCache(){
    if(!this.methodsByGroup){
        this.groupList=Array.newInstance({sortUnique:true});
        this.methodsByGroup={};
        this.methodsByGroup[this._other]=[];
        for(var i=0;i<this.methods.length;i++){
            var docItem=isc.jsdoc.getDocItem(this.methods[i]);
            var method=isc.jsdoc.toJS(docItem);
            if(method.groups){
                if(!isc.isAn.Array(method.groups))method.groups=[method.groups];
                this.groupList.addList(method.groups);
            }
            var methodGroups=method.groups||[this._other];
            for(var j=0;j<methodGroups.length;j++){
                var group=methodGroups[j];
                if(!this.methodsByGroup[group])this.methodsByGroup[group]=Array.newInstance({sortUnique:true});
                this.methodsByGroup[group].add(method);
            }
        }
        if(this.methodsByGroup.other.length>0)this.groupList.add(this._other);
    }
}
,isc.A.contents=function isc_MethodFormatter_contents(){
    if(this.generatedContents)return this.generatedContents;
    var docUtils=isc.DocUtils;
    var accum=isc.StringBuffer.create();
    accum.maxStreamLength=1000000;
    var id=isc.StringBuffer.concat(this.classDoc.ref,this._underscore,this.type);
    docUtils.offsetCanvasForRef(id,this);
    docUtils.buildTableHeader(this.headerName,id,accum);
    if(isc.MethodFormatter._methodStart==null){
        isc.MethodFormatter._methodStart=[
            "<tr id='",
            null,
            "'><td>",
            "<table border='1' width='100%'>",
            "<tr BGCOLOR='lightgrey' class='normal'><td colspan='2'>Group: <b>",
            null,
            "</b></td></tr>"
        ];
        isc.MethodFormatter._methodEnd="</table>";
    }
    var ms=isc.MethodFormatter._methodStart;
    var classObject=isc.ClassFactory.getClass(this.classDoc.name);
    for(var i=0;i<this.groupList.length;i++){
        var groupName=this.groupList[i];
        var groupLinkRef=isc.StringBuffer.concat(this.classDoc.ref,this._underscore,
                                                   this.type,this._underscore,groupName);
        var groupId=docUtils.idForRef(groupLinkRef);
        docUtils.offsetCanvasForRef(groupLinkRef,this);
        accum.append(ms[0],groupId,ms[2],ms[3],ms[4],docUtils.linkForRef(this._groupPrefix+groupName),ms[6]);
        if(isc.MethodFormatter._methodItemTemplate==null){
            isc.MethodFormatter._methodItemTemplate=[
                "<tr id='",
                null,
                "'><td>",
                null,
                "</td></tr>"
           ];
        }
        var mt=isc.MethodFormatter._methodItemTemplate;
        for(var j=0;j<this.methodsByGroup[groupName].length;j++){
            var method=this.methodsByGroup[groupName][j];
            docUtils.offsetCanvasForRef(method.ref,this);
            docUtils.extraOffsetForRef(method.ref,groupId);
            accum.append(mt[0],
                         docUtils.idForRef(method.ref),
                         mt[2]);
            isc.MethodFormatter.methodHTML(method,accum,classObject);
            accum.append(mt[4]);
        }
        accum.append("</table>");
    }
    return(this.generatedContents=accum.release(false));
}
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("DocSearchBar","DynamicForm");
isc.A=isc.DocSearchBar.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.browserSpellCheck=false;
isc.A.height=20;
isc.A.numCols=2;
isc.A.colWidths=[46,"*"];
isc.A.titleSuffix=":&nbsp;";
isc.A.cellPadding=0;
isc.A.showSearchTitle=false;
isc.A.wrapItemTitles=false;
isc.A.selectOnFocus=true;
isc.A.autoDraw=false;
isc.A.hint="Search documentation...";
isc.A.autoFocus=isc.Browser.isDesktop;
isc.B.push(isc.A.initWidget=function isc_DocSearchBar_initWidget(){
    this.items=[isc.addProperties(
        {name:"searchString",width:"*",colSpan:"*",showTitle:this.showSearchTitle,
         selectOnFocus:true,
         title:this.searchTitle,showHintInField:true,hint:this.hint,
         keyPress:function(item,form,keyName){
              if(keyName=="Enter"){
                  form.doSearch(form.getValue("searchString"));
                  if(!isc.Browser.isDesktop)item.getDataElement().blur();
              }
              if(keyName=="Escape"){
                 form.clearValues();
                 return false;
             }
         }})
    ];
    this.Super("initWidget",arguments);
    if(this.initialValue)this.setValue('searchString',this.initialValue);
}
,isc.A.doSearch=function isc_DocSearchBar_doSearch(searchString){
    if(searchString){
        this.setValue("searchString",searchString);
    }else{
        searchString=this.getValue("searchString");
    }
    if(searchString==null||searchString==""){
        isc.warn("Please enter a search string");
        return;
    }
    this.delayCall("search");
}
,isc.A.search=function isc_DocSearchBar_search(searchString){
    var searchString=this.getValue("searchString");
    var hits=[];
    var regexes=[];
    var words=searchString.split(/\s+|,|\./);
    for(var i=0;i<words.length;i++){
        if(words[i].length==0)continue;
        var escapedRE=words[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&");
        regexes.add(new RegExp("(^|\\s|>)?("+escapedRE+")($|\\s|<)?","ig"));
    }
    var weights={
        name:10,
        title:3,
        description:0.5,
        definingClass:0.1
    };
    var weightKeys=isc.getKeys(weights);
    var matchedRegexes=[];
    var refs=isc.jsdoc.getRefs();
    for(var k=0;k<refs.length;k++){
        var ref=refs[k];
        var m,score=0;
        var docItem=isc.jsdoc.getDocItem(ref);
        var docItemData=isc.jsdoc.getAttributes(docItem,weightKeys);
        for(var i=0;i<regexes.length;i++){
            var regex=regexes[i];
            for(var key in weights){
                var value=docItemData[key];
                if(!value)continue;
                var weight=weights[key];
                regex.lastIndex=0;
                while((m=regex.exec(value))!=null){
                    score+=weight;
                    if((m[1]&&m[3])||m[2].length==value.length){
                         score+=weight;
                    }
                }
            }
        }
        if(score!=0){
            var item=isc.jsdoc.getDocItem(ref);
            var name=isc.jsdoc.getAttribute(item,"name");
            var type=isc.jsdoc.getAttribute(item,"type");
            var definingClass=isc.jsdoc.getAttribute(item,"definingClass");
            if(definingClass){
                definingClass=isc.jsdoc.getDocItem(definingClass);
                if(definingClass)name=isc.jsdoc.getAttribute(definingClass,"name")+"."+name;
            }
            if(isc.jsdoc.isMethod(type)){
                var method=isc.jsdoc.toJS(item);
                name+=isc.MethodFormatter.formatMethodParams(method);
            }
            hits[hits.length]={
                ref:ref,
                type:type,
                name:name,
                score:score
            };
        }
    }
    if(this.searchResultsGrid){
        this.searchResultsGrid.setData(hits);
        return;
    }
    var searchResults=this.docViewer.searchResults=isc.DocSearchResults.create({
        autoDraw:false,
        nocache:true,
        overflow:"auto",
        width:"100%",
        height:"100%",
        ref:"Search Results",
        searchString:searchString,
        searchRegexes:regexes,
        hits:hits
    });
    this.docViewer._show(searchResults);
    if(this.lastSearchResults)this.lastSearchResults.destroy();
    this.lastSearchResults=searchResults;
}
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("DocSearchResults","DocTabSet");
isc.A=isc.DocSearchResults.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_DocSearchResults_initWidget(){
    this.Super(this._$initWidget);
    if(this.hits.length==0){
        this.addTab({
            title:"Search Results",
            pane:isc.Canvas.create({
                autoDraw:false,
                contents:"<br><br>&nbsp;&nbsp;<b>No matches</b>"
            })
        });
        return;
    }
    this.searchPreview=isc.Canvas.create({
        ID:this.getID()+"searchPreview",
        canSelectText:true,
        autoDraw:false,
        overflow:"auto",
        contents:"<br><br><br>&nbsp;&nbsp;&nbsp;<B>Click a record in the Grid above to see full docs here."
                 +"<br>&nbsp;&nbsp;&nbsp;Shift-click or Control-click to see more than one description at a time."
                 +"<br>&nbsp;&nbsp;&nbsp;Double-click to navigate to a documentation entry."
                 +"<br>&nbsp;&nbsp;&nbsp;You can click and drag the resize bar above to make more room.</b>"
    });
    var searchDS=isc.DataSource.create({
        ID:this.getID()+"_searchDS",
        clientOnly:true,
        fields:[
            {name:"score",title:"Score",width:50},
            {name:"name",canGroupBy:false,title:"Name",width:"*"},
            {name:"type",title:"Type",width:80},
            {name:"ref",title:"Match",width:"*",showIf:"false"}
        ]
    });
    var fields=searchDS.getFields();
    for(var fieldName in fields){
        fields[fieldName].filterEditorProperties={
            keyPress:function(){
                isc.Timer.clearTimeout(this.grid.filterTimer);
                this.grid.filterTimer=isc.Timer.setTimeout(this.grid.getID()+".performFilter()",100);
            }
        }
    }
    this.searchResultsGrid=isc.DocGrid.create({
        autoDraw:false,
        docPreview:this.searchPreview,
        height:300,
        data:this.hits,
        sortFieldNum:0,
        shortcutField:"name",
        sortDirection:"descending",
        emptyMessage:"No matches.",
        searchRegexes:this.searchRegexes,
        rowDoubleClick:"isc.DocViewer.instance._show(record.ref);",
        dataSource:searchDS,
        showResizeBar:true,
        linkNames:true,
        data:isc.LocalResultSet.create({
            dataSource:searchDS,
            allRows:this.hits,
            context:{textMatchStyle:"substring"}
        })
    });
    var filterForm=isc.DocFilterField.create({
        autoDraw:false,
        fieldName:"name",
        grid:this.searchResultsGrid,
        itemChange:function(item,oldValue,newValue){
            isc.Timer.clearTimeout(this._filterTimeout);
            this._filterTimeout=
                isc.Timer.setTimeout(this.getID()+".doSetCriteria()",100);
        },
        doSetCriteria:function(){
            this.grid.getOriginalData().setCriteria(this.getValuesAsCriteria());
        }
    });
    this.searchBar=isc.DocSearchBar.create({
        autoDraw:false,
        height:20,
        docViewer:isc.DocViewer.instance,
        initialValue:this.searchString,
        searchResultsGrid:this.searchResultsGrid
    }),
    this.addTab({
        title:"&nbsp;Search Results&nbsp;",
        pane:isc.VLayout.create({
            autoDraw:false,
            members:[filterForm,this.searchResultsGrid,this.searchPreview]
        })
    });
}
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("DocNavBar","HLayout");
isc.A=isc.DocNavBar.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.history=[];
isc.A.maxHistorySize=5;
isc.A.currentPosition=-1;
isc.B.push(isc.A.initWidget=function isc_DocNavBar_initWidget(){
    this.Super(this._$initWidget);
    this._backButton=this._buildBackButton();
    this.addMember(this._backButton);
    this._label=isc.Label.create({
        autoDraw:false,
        align:"center",
        height:this.getHeight(),
        overflow:"hidden",
        width:"*",
        setContents:function(contents){
            this.Super("setContents",["<h2 style='display:inline;'>"+contents+"</h2>",arguments]);
        }
    });
    this.addMember(this._label);
    this._forwardButton=this._buildForwardButton();
    this.addMember(this._forwardButton);
}
,isc.A.updateNav=function isc_DocNavBar_updateNav(ref,title){
    if(this.ignoreUpdate){
        this.ignoreUpdate=false;
        return;
    }
    if(this.history[this.currentPosition]&&ref==this.history[this.currentPosition].ref)return;
    this.currentPosition++;
    this.history[this.currentPosition]={ref:ref,title:title};
    if(this.currentPosition<this.history.length-1){
        this.history.removeRange(this.currentPosition+1,this.history.length);
    }
    while(this.history.length>this.maxHistorySize){
        var obj=this.history.shift();
        if(obj.ref!=ref&&!this.history.find("ref",ref)){
            this.docViewer.delayCall("_destroyCacheEntry",[obj.ref]);
        }
        this.currentPosition--;
    }
    this._updateButtonState();
}
,isc.A.goBack=function isc_DocNavBar_goBack(){
    this.go(--this.currentPosition);
}
,isc.A.goForward=function isc_DocNavBar_goForward(){
    this.go(++this.currentPosition);
}
,isc.A.go=function isc_DocNavBar_go(position){
    if(position==-1){
        this.docViewer.showNavigationPane();
        return;
    }
    var ref=this.history[position].ref;
    this.ignoreUpdate=true;
    this._navBarInitiated=true;
    this.docViewer._show(ref);
    this._navBarInitiated=false;
    this._updateButtonState();
}
,isc.A._updateButtonState=function isc_DocNavBar__updateButtonState(){
    if(this.history.length==0||this.currentPosition<0)return;
    if(this.currentPosition==this.history.length-1){
        this._forwardButton.hide();
    }else{
        this._forwardButton.show();
        var title=this.history[this.currentPosition+1].title;
        this._forwardButton.setTitle(title);
    }
    if(this.currentPosition==0&&this.docViewer.navigationPane.isVisible()){
        this._backButton.hide();
    }else{
        this._backButton.show();
        var title=this.currentPosition==0?"All Docs":this.history[this.currentPosition-1].title;
        this._backButton.setTitle(title);
    }
}
,isc.A._buildBackButton=function isc_DocNavBar__buildBackButton(){
    var button=isc.Label.create({
        autoDraw:false,
        wrap:false,
        cursor:isc.Canvas.HAND,
        setTitle:function(title){
            this.setContents("<u>"+title+"</u>");
        },
        height:16,
        width:1,
        margin:6,
        icon:"[ISO_DOCS_SKIN]/images/DocNavBar/back.png",
        showDisabledIcon:false,
        showRollOverIcon:false,
        showDownIcon:false,
        overflow:"visible",
        visibility:"hidden",
        click:this.getID()+".goBack()"
    });
    return button;
}
,isc.A._buildForwardButton=function isc_DocNavBar__buildForwardButton(){
    var button=isc.Label.create({
        autoDraw:false,
        cursor:isc.Canvas.HAND,
        wrap:false,
        setTitle:function(title){
            this.setContents("<u>"+title+"</u>");
        },
        height:16,
        width:1,
        margin:6,
        icon:"[ISO_DOCS_SKIN]/images/DocNavBar/forward.png",
        iconOrientation:"right",
        showDisabledIcon:false,
        showRollOverIcon:false,
        showDownIcon:false,
        overflow:"visible",
        visibility:"hidden",
        click:this.getID()+".goForward()"
    });
    return button;
}
);
isc.B._maxIndex=isc.C+8;

isc.ClassFactory.defineClass("GroupViewer","DocTabSet");
isc.A=isc.GroupViewer;
isc.A.detailItems=["examples","seeAlso"]
;

isc.A=isc.GroupViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getHTML=function isc_c_GroupViewer_getHTML(group,linkName){
    var accum=isc.StringBuffer.create();
    isc.DocUtils.reportMissingModulesStart(accum,group);
    var prefix=group.title?null:"<i>group</i>&nbsp;";
    var title=group.title?group.title:group.name;
    accum.append("<table class='normal'><tr><td>&nbsp;</td><td>",
                "<font size='+1'>",this.prefix,"<b>",
                linkName?isc.DocUtils.linkForRef(group.ref):title,"</b></font><br><p>",
                 (group.description?isc.DocUtils.stripHTML(group.description):""),"<p><br>"
                );
    isc.DetailFormatter.newInstance({
        detailItems:isc.GroupViewer.detailItems
    }).generateHTML(group,accum);
    var refs=group.refs;
    if(!isc.isAn.Array(refs))refs=refs?[refs]:[];
    if(refs&&refs.length!=0){
        accum.append("<br><br><br><b>Methods and Properties referencing group ",title,
                     " </b><br><br>");
        for(var i=0;i<refs.length;i++){
            var ref=refs[i];
            var refLink=isc.DocUtils.linkForRef(ref);
            if(refLink)accum.append("&nbsp;&nbsp;",refLink,"<br>");
        }
    }
    accum.append("</td><td>&nbsp;</td></tr></table>");
    isc.DocUtils.reportMissingModulesEnd(accum,group);
    return accum.release(false);
}
,isc.A.hoverHTML=function isc_c_GroupViewer_hoverHTML(group,linkName){
    return this.getHTML(group,linkName);
}
);
isc.B._maxIndex=isc.C+2;

isc.A=isc.GroupViewer.getPrototype();
isc.A.doc=null;
isc.A.exampleViewerHeight=350;
isc.A.forceFill=false
;

isc.A=isc.GroupViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_GroupViewer_initWidget(){
    this.Super(this._$initWidget);
    var doc=this.doc=isc.jsdoc.toJS(this.docItem);
    this.title=doc.title?doc.title:doc.name;
    this.header=doc.title?doc.title:"group&nbsp;<b>"+doc.name+"</b>";
    this._groupView=this._buildGroupView(doc);
    this.addTab({
        title:"&nbsp;Description&nbsp;",
        pane:this._groupView
    });
}
,isc.A._buildGroupView=function isc_GroupViewer__buildGroupView(group){
    var backgroundColor=isc.DocUtils.getMissingModules(this.doc)==null?null:"lightgrey";
    var groupDescription=isc.Canvas.create({
        autoDraw:false,
        canSelectText:true,
        overflow:"auto",
        dynamicContents:true,
        backgroundColor:backgroundColor,
        contents:isc.GroupViewer.getHTML(group)
    });
    if(!(this.doc.exampleConfig&&isc.ExampleViewer)||isc.DocUtils.getMissingModules(this.doc))return groupDescription;
    var exampleViewer=isc.ExampleViewer.create({
        autoDraw:false,
        height:this.exampleViewerHeight,
        url:this.doc.exampleConfig,
        showPaneContainerEdges:false,
        symmetricEdges:true,
        paneContainerProperties:{
            backgroundColor:"white",
            edgeImage:"[SKIN]/rounded/frame/FFFFFF/4.png"
        },
        tabBarProperties:{
            baseLineCapSize:0
        }
    });
    var sectionStack=isc.SectionStack.create({
        visibilityMode:"multiple",
        autoDraw:false,
        sections:[
            {showHeader:false,expanded:true,items:[groupDescription]},
            {showHeader:true,expanded:true,
             title:this.title+" Example",
             items:[exampleViewer]
            }
        ]
    });
    return sectionStack;
}
);
isc.B._maxIndex=isc.C+2;

isc.ClassFactory.defineClass("TypeViewer","DocTabSet");
isc.A=isc.TypeViewer;
isc.A.detailItems=["values","examples","groups","seeAlso"];
isc.A.refTypes=["type","class","object","pseudoclass","interface","group"];
isc.A.typeCache={};
isc.A._$jsSpace=" ";
isc.A._convertTypes={
        "string":"String",
        "array":"Array",
        "boolean":"Boolean",
        "float":"Float",
        "integer":"Integer",
        "number":"Number",
        "object":"Object",
        "url":"URL"
    }
;

isc.A=isc.TypeViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._getDocItem=function isc_c_TypeViewer__getDocItem(refType,typeName,tryTypeName,visibleTypeName){
    if(!visibleTypeName)visibleTypeName=tryTypeName;
    var ref=isc.jsdoc.makeRef(refType,tryTypeName);
    if(isc.jsdoc.getDocItem(ref)){
        var cachedValue=isc.DocUtils.linkForRef(ref,visibleTypeName);
        if(cachedValue!=null){
            this.typeCache[typeName]=cachedValue;
            return cachedValue;
        }
    }
    return null;
}
,isc.A.linkForType=function isc_c_TypeViewer_linkForType(typeName,defaultType,nameHint){
    if(!typeName)return defaultType?defaultType:typeName;
    var s=typeName.split(/\s+/);
    if(s.length>1){
        for(var i=0;i<s.length;i++)s[i]=this.linkForType(s[i],defaultType);
        return s.join(this._$jsSpace);
    }
    var cachedValue=this.typeCache[typeName];
    if(cachedValue===null)return defaultType?defaultType:typeName;
    if(cachedValue!=null)return cachedValue;
    var refTypes=this.refTypes;
    var convertType=this._convertTypes[typeName];
    var tryTypeName;
    if(convertType)tryTypeName=convertType;
    else tryTypeName=typeName.substring(0,1).toLocaleUpperCase()+typeName.substring(1);
    for(var i=0;i<refTypes.length;i++){
        cachedValue=this._getDocItem(refTypes[i],typeName,tryTypeName);
        if(cachedValue!=null)return cachedValue;
        if(refTypes[i]=="type"&&nameHint!=null&&nameHint.match(/callback/i)){
            var trueTypeName="Callbacks."+tryTypeName;
            cachedValue=this._getDocItem("method",typeName,trueTypeName,tryTypeName);
            if(cachedValue!=null)return cachedValue;
        }
    }
    if(convertType){
        this.typeCache[typeName]=convertType;
        return convertType;
    }
    this.typeCache[typeName]=null;
    return defaultType?defaultType:typeName;
}
,isc.A.hoverHTML=function isc_c_TypeViewer_hoverHTML(doc,linkName){
    return this._getHTML(doc,linkName);
}
,isc.A._getHTML=function isc_c_TypeViewer__getHTML(doc,linkName){
    var accum=isc.StringBuffer.create();
    isc.DocUtils.reportMissingModulesStart(accum,doc);
    accum.append("<table class='normal'><tr><td>&nbsp;</td><td>",
                "<font size='+1'><i>type</i>&nbsp;<b>",
                linkName?isc.DocUtils.linkForRef(doc.ref):doc.name,"</b></font><br><p>",
                 (doc.description?isc.DocUtils.stripHTML(doc.description):""),"<br><br>"
                );
    isc.DetailFormatter.newInstance({
        detailItems:this.detailItems
    }).generateHTML(doc,accum);
    accum.append("</td><td>&nbsp;</td></tr></table>");
    isc.DocUtils.reportMissingModulesEnd(accum,doc);
    return accum.release(false);
}
);
isc.B._maxIndex=isc.C+4;

isc.A=isc.TypeViewer.getPrototype();
isc.A.hideUsingDisplayNone=isc.Browser.isMoz
;

isc.A=isc.TypeViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_TypeViewer_initWidget(){
    this.Super(this._$initWidget);
    this.doc=isc.jsdoc.toJS(this.docItem);
    this.title=this.doc.name;
    this.header="type&nbsp;<b>"+this.title+"</b>";
    this.addTab({
        title:"&nbsp;Description&nbsp;",
        pane:this._buildTypeView()
    });
}
,isc.A._buildTypeView=function isc_TypeViewer__buildTypeView(){
    var backgroundColor=isc.DocUtils.getMissingModules(this.doc)==null?null:"lightgrey";
    var canvas=isc.Canvas.create({
        autoDraw:false,
        overflow:"auto",
        dynamicContents:true,
        canSelectText:true,
        backgroundColor:backgroundColor,
        contents:isc.TypeViewer._getHTML(this.doc)
    });
    return canvas;
}
,isc.A.scrolled=function isc_TypeViewer_scrolled(){
    if(this.hideUsingDisplayNone)this._doc_currentScrollTop=this.getScrollTop();
}
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("ClassViewer","DocTabSet");
isc.A=isc.ClassViewer;
isc.A.detailItems=["examples","groups","seeAlso","platformNotes"]
;

isc.A=isc.ClassViewer;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.showGroupHover=function isc_c_ClassViewer_showGroupHover(){
    var helpText="Show all members of this group belonging to this class only.";
    isc.Hover.show(helpText);
}
,isc.A.hoverHTML=function isc_c_ClassViewer_hoverHTML(classDoc,linkName){
    if(this._classDescriptionTemplate==null){
        this._classDescriptionTemplate=[
            "<table class='normal' BORDER='0' WIDTH='100%'><tr><td width='1'></td><td>",
            "<div style='font-size:16px'><table><tr><td><i>",
            null,
            "</i>&nbsp;<b>",
            null,
            "</td><td>",
            null,
            "</b></td></tr><tr><td></td><td>",
            null,
            "</td></tr></table></div><p>",
            null,
            null,
            "<br><br>",
            null,
            "</td><td width='1'></td></tr></table>"
        ];
    }
    var cdt=this._classDescriptionTemplate;
    var extendsClause;
    var classObject=isc.ClassFactory.getClass(classDoc.name);
    var superClassName=isc.jsdoc.getSuperClassName(classDoc);
    if(superClassName){
        extendsClause="<i>extends</i>&nbsp;<b>"+isc.DocUtils.linkForRef("class:"+superClassName,superClassName)+"</b>";
    }
    var implementsClause;
    var implementsInterfaces=classDoc.implementsInterfaces;
    if(implementsInterfaces){
        implementsClause="<i>implements</i>&nbsp;<b>";
        if(!isc.isAn.Array(implementsInterfaces))implementsInterfaces=[implementsInterfaces];
        for(var i=0;i<implementsInterfaces.length;i++){
            implementsClause+=isc.DocUtils.linkForRef("interface:"+implementsInterfaces[i],implementsInterfaces[i]);
            if(i+1<implementsInterfaces.length)implementsClause+=", ";
        }
        implementsClause+="</b>";
    }
    cdt[2]=classDoc.type;
    cdt[4]=linkName?isc.DocUtils.linkForRef(classDoc.ref):classDoc.name;
    cdt[6]=(extendsClause?extendsClause:implementsClause);
    cdt[8]=(extendsClause?implementsClause:isc.emptyString);
    cdt[10]=classDoc.description
        ?isc.DocUtils.stripHTML(classDoc.description)
        :isc.emptyString;
    if(classDoc.deprecated){
        cdt[11]="<br><br><B>DEPRECATED:&nbsp;"+classDoc.deprecated+"</B><br>";
    }else{
        cdt[11]=null;
    }
    cdt[13]=isc.DetailFormatter.newInstance({
            detailItems:this.detailItems
        }).generateHTML(classDoc).release(false);
    var result=cdt.join(isc.emptyString);
    return isc.DocUtils.reportMissingModules(result,classDoc);
}
,isc.A.getOverrideProperties=function isc_c_ClassViewer_getOverrideProperties(className){
    var classObject=isc.ClassFactory.getClass(className);
    if(!classObject){
        return;
    }
    var superClass=classObject.getSuperClass();
    if(superClass==null)return;
    var overrideProperties=[];
    var overriddenProperties=[];
    var refStart="classMethod:"+className+".";
    for(var propName in classObject){
        var method=classObject[propName];
        if(!isc.isA.Function(method))continue;
        if(method==superClass[propName])continue;
        var implementingSuper=this.getImplementingSuper(method,superClass,propName);
        if(implementingSuper!=null){
            var ref="classMethod:"+implementingSuper.getClassName()+"."+propName;
            var docItem=isc.jsdoc.getDocItem(ref);
            if(docItem&&!isc.jsdoc.getAttribute(docItem,"override")){
                overriddenProperties.add(ref);
                overrideProperties.add(refStart+propName);
            }
        }
    }
    var proto=classObject.getPrototype();
    var superProto=superClass.getPrototype();
    refStart="method:"+className+".";
    for(var propName in proto){
        var method=proto[propName];
        if(!isc.isA.Function(method))continue;
        if(method==superProto[propName])continue;
        var implementingSuper=this.getImplementingSuper(method,superProto,propName);
        if(implementingSuper!=null){
            var iClassName=implementingSuper.getClassName();
            var ref="method:"+iClassName+"."+propName;
            var docItem=isc.jsdoc.getDocItem(ref);
            if(docItem&&isc.jsdoc.getAttribute(docItem,"ref")!="method:Class.init"){
                overriddenProperties.add(ref);
                overrideProperties.add(refStart+propName);
            }
        }else{
            if(classObject._stringMethodRegistry[propName]!=null){
                var ref="method:"+implementingSuper.getClassName()+"."+propName;
                var docItem=isc.jsdoc.getDocItem(ref);
                if(docItem&&!isc.jsdoc.getAttribute(docItem,"override")){
                    overriddenProperties.add(ref);
                    overrideProperties.add(refStart+propName);
                }else{
                    this.logWarn("Instance method "+className+"."+propName
                                 +" overrides stringMethod of same"
                                 +" name, but the stringMethod is undocumented");
                }
            }
        }
    }
    return{overridden:overriddenProperties,overrides:overrideProperties};
}
,isc.A.getImplementingSuper=function isc_c_ClassViewer_getImplementingSuper(method,superClassProto,methodName){
    if(superClassProto==null)return null;
    var isClassObject=isc.isA.ClassObject(superClassProto);
    var indirectName="_indirect_"+methodName,
        superClassImpl,superClass;
    for(;;){
        superClassImpl=superClassProto[indirectName]||superClassProto[methodName];
        if(superClassImpl!=null&&superClassImpl!=method)break;
        var superClass=(isClassObject?superClassProto.getSuperClass():
                                          superClassProto.getClass().getSuperClass());
        if(superClass==null)break;
        superClassProto=isClassObject?superClass:superClass.getPrototype();
    }
    var superClassProto2=superClassProto;
    for(;;){
        var superClass=(isClassObject?superClassProto2.getSuperClass():
                                          superClassProto2.getClass().getSuperClass());
        if(superClass==null)break;
        var superClassProtoTmp=isClassObject?superClass:superClass.getPrototype();
        var superClassImpl2=superClassProtoTmp[indirectName]||superClassProtoTmp[methodName];
        if(superClassImpl2!=superClassImpl)break;
        superClassProto2=superClassProtoTmp;
    }
    return superClassProto2;
}
);
isc.B._maxIndex=isc.C+4;

isc.A=isc.ClassViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_ClassViewer_initWidget(){
    this.Super(this._$initWidget);
    this._autoGenOverrideDocs();
    this.doc=isc.jsdoc.toJS(this.docItem);
    this.cName=this.doc.name;
    this.header=this.doc.type+"&nbsp;<B>"+this.cName+"</B>";
    this.title=this.cName;
    this.hasInstanceAPIs=this.getInheritedDocItems("attrs").length>0||
                           this.getInheritedDocItems("methods").length>0;
    this.hasClassAPIs=this.getInheritedDocItems("classAttrs").length>0||
                           this.getInheritedDocItems("classMethods").length>0;
    this.addTab({
        ID:this.cName+"_overview",
        title:"Overview&nbsp;",
        width:100,
        icon:"[ISO_DOCS_SKIN]/images/DocTabBar/overview.png"
    });
    if(this.hasInstanceAPIs){
        this.addTab({
            ID:this.cName+"_instance",
            title:"Instance APIs&nbsp;",
            width:120,
            icon:"[ISO_DOCS_SKIN]/images/DocTabBar/instanceAPI.png"
        });
    }
    if(this.hasClassAPIs){
        this.addTab({
            ID:this.cName+"_class",
            title:"Class APIs&nbsp;",
            width:120,
            icon:"[ISO_DOCS_SKIN]/images/DocTabBar/classAPI.png"
        });
    }
}
,isc.A.tabSelected=function isc_ClassViewer_tabSelected(tabNum,pane,ID){
    if(!pane){
        switch(ID){
            case this.cName+"_overview":
                pane=this.initOverviewPane(this,ID);
                break;
            case this.cName+"_instance":
                pane=this.initAPIPane(this,"instance",ID);
                break;
            case this.cName+"_class":
                pane=this.initAPIPane(this,"class",ID);
                break;
        }
    }
    var id=this.docTree.refToID[this.ref];
    var state=this.docViewer.state;
    if(id!=null&&state.data){
        if(state.data.tabs==null)state.data.tabs={};
        if(tabNum==0){
            delete state.data.tabs[id];
            state.data.ts=this.ref;
        }else{
            state.data.tabs[id]=tabNum;
            var grid=pane.getMember(1);
            var sr=grid.getSelectedRecord();
            if(sr!=null)state.data.ts=sr.ref;
        }
        state.store();
    }
}
,isc.A.initOverviewPane=function isc_ClassViewer_initOverviewPane(tabSet,tabID){
    var descriptionText=isc.ClassViewer.hoverHTML(this.doc);
    if(this.hasInstanceAPIs){
        descriptionText+="<br>&nbsp;&nbsp;<b><a href='' onclick='"+this.getID()
                        +".selectTab(1);return false;'>"
                        +this.cName+" instance APIs</a></b>";
    }
    if(this.hasClassAPIs){
        var tabNum=this.hasInstanceAPIs?2:1;
        descriptionText+="<br>&nbsp;&nbsp;<b><a href='' onclick='"+this.getID()
                        +".selectTab("+tabNum+");return false;'>"
                        +this.cName+" class APIs</a></b>";
    }
    var backgroundColor=isc.DocUtils.getMissingModules(this.doc)==null?null:"lightgrey";
    var classDescription=isc.Canvas.create({
        ID:"classDescription_"+this.doc.name,
        autoDraw:false,
        overflow:"auto",
        canSelectText:true,
        dynamicContents:true,
        backgroundColor:backgroundColor,
        contents:descriptionText
    });
    if(!(this.doc.exampleConfig&&isc.ExampleViewer)||isc.DocUtils.getMissingModules(this.doc)){
        tabSet.updateTab(tabID,classDescription);
        return;
    }
    if(window.location.protocol=="file:"){
        if(!isc.ClassViewer.examplesNotAvailableNotified
             &&!isc.ClassViewer.suppressExamplesNotAvailableNotify){
            this.logInfo("Running in client-only mode - examples not available.");
            isc.warn("The examples that are part of the SmartClient reference documentation"
                 +" require the SmartClient server to be running.  You can browse"
                 +" the documentation without the examples.  To enable examples, start"
                 +" the server (See the Quickstart section of the Release Notes for"
                 +" instructions).");
            isc.ClassViewer.examplesNotAvailableNotified=true;
        }
        tabSet.updateTab(tabID,classDescription);
        return;
    }
    var exampleViewer=isc.ExampleViewer.create({
        autoDraw:false,
        showDensitySwitcher:false,
        showSkinSwitcher:false,
        height:this.exampleViewerHeight,
        url:this.doc.exampleConfig
    });
    var sectionStack=isc.SectionStack.create({
        visibilityMode:"multiple",
        overflow:"hidden",
        autoDraw:false,
        sections:[
            {showHeader:true,height:1,canCollapse:false,expanded:true,items:[classDescription]},
            {showHeader:true,expanded:true,
             title:this.cName+" Example",
             items:[exampleViewer]
            }
        ]
    });
    tabSet.updateTab(tabID,sectionStack);
}
,isc.A.getInheritedDocItems=function isc_ClassViewer_getInheritedDocItems(type){
    if(!this._inheritedDocItems)this._inheritedDocItems={};
    if(isc.isAn.Array(this._inheritedDocItems[type]))return this._inheritedDocItems[type];
    var items=this.doc[type]?isc.clone(this.doc[type]):[];
    if(!isc.isAn.Array(items))items=[items];
    if(this.doc.implementsInterfaces){
        var implementsInterfaces=this.doc.implementsInterfaces;
        if(!isc.isAn.Array(implementsInterfaces))implementsInterfaces=[implementsInterfaces];
        for(var i=0;i<implementsInterfaces.length;i++){
            var interfaceDoc=isc.jsdoc.getDocItem(implementsInterfaces[i]);
            var itemsToAdd=isc.jsdoc.getList(interfaceDoc,type);
            if(itemsToAdd&&!isc.isAn.Array(itemsToAdd))itemsToAdd=[itemsToAdd];
            items.addList(itemsToAdd);
        }
    }
    var currentClassName=this.cName;
    var currentDoc=this.doc;
    while(1&&currentDoc.showSuperProps!="false"){
        var superClassName=isc.jsdoc.getSuperClassName(currentDoc);
        if(!superClassName)break;
        var docItem=isc.jsdoc.getDocItem(superClassName);
        if(!docItem)break;
        var superClassDoc=currentDoc=isc.jsdoc.toJS(docItem);
        var itemsToAdd=superClassDoc[type];
        if(itemsToAdd&&!isc.isAn.Array(itemsToAdd))itemsToAdd=[itemsToAdd];
        items.addList(itemsToAdd);
        if(docItem.implementsInterfaces){
            var implementsInterfaces=docItem.implementsInterfaces;
            if(!isc.isAn.Array(implementsInterfaces))implementsInterfaces=[implementsInterfaces];
            for(var i=0;i<implementsInterfaces.length;i++){
                var interfaceDoc=isc.jsdoc.getDocItem(implementsInterfaces[i]);
                itemsToAdd=isc.jsdoc.getList(interfaceDoc,type);
                if(itemsToAdd&&!isc.isAn.Array(itemsToAdd))itemsToAdd=[itemsToAdd];
                items.addList(itemsToAdd);
            }
        }
        currentClassName=superClassName;
    }
    this._inheritedDocItems[type]=items;
    return items;
}
,isc.A.initAPIPane=function isc_ClassViewer_initAPIPane(tabSet,type,tabID){
    var attrs,methods;
    if(type=="instance"){
        attrs=this.getInheritedDocItems("attrs");
        methods=this.getInheritedDocItems("methods");
    }else{
        attrs=this.getInheritedDocItems("classAttrs");
        methods=this.getInheritedDocItems("classMethods");
    }
    var seenItems={};
    var gridData=[];
    var baseClassName=this.doc.name;
    var currentDoc=this.doc;
    var ancestorArr=[currentDoc.ref];
    if(currentDoc.implementsInterfaces){
        var implementsInterfaces=currentDoc.implementsInterfaces;
        if(!isc.isAn.Array(implementsInterfaces))implementsInterfaces=[implementsInterfaces];
        for(var i=0;i<implementsInterfaces.length;i++){
            ancestorArr.add("interface:"+implementsInterfaces[i]);
        }
    }
    while(1&&currentDoc.showSuperProps!="false"){
        var superClassName=isc.jsdoc.getSuperClassName(currentDoc);
        if(!superClassName)break;
        var docItem=isc.jsdoc.getDocItem(superClassName);
        if(!docItem)break;
        currentDoc=isc.jsdoc.toJS(docItem);
        ancestorArr[ancestorArr.length++]=currentDoc.ref;
        if(currentDoc.implementsInterfaces){
            var implementsInterfaces=currentDoc.implementsInterfaces;
            if(!isc.isAn.Array(implementsInterfaces))implementsInterfaces=[implementsInterfaces];
            for(var i=0;i<implementsInterfaces.length;i++){
                ancestorArr.add("interface:"+implementsInterfaces[i]);
            }
        }
    }
    if(attrs){
        var lastDefiningClass=null;
        if(!isc.isAn.Array(attrs))attrs=[attrs];
        for(var i=0;i<attrs.length;i++){
            var item=isc.jsdoc.getDocItem(attrs[i]);
            if(!item)continue;
            var attr=isc.clone(isc.jsdoc.toJS(item));
            lastDefiningClass=attr.definingClass;
            attr.ancestorCount=ancestorArr.indexOf(attr.definingClass);
            if(seenItems[attr.name])continue;
            seenItems[attr.name]=1;
            var classRef=attr.definingClass,
                className=classRef.substring(classRef.indexOf(":")+1)
            ;
            if(isc.isAn.Array(attr.groups))attr.groups=attr.groups[0];
            gridData.add(attr);
        }
    }
    if(methods){
        var lastDefiningClass=null;
        if(!isc.isAn.Array(methods))methods=[methods];
        for(var i=0;i<methods.length;i++){
            var item=isc.jsdoc.getDocItem(methods[i]);
            if(!item)continue;
            var method=isc.clone(isc.jsdoc.toJS(item));
            lastDefiningClass=method.definingClass;
            method.ancestorCount=ancestorArr.indexOf(method.definingClass);
            if(seenItems[method.name])continue;
            seenItems[method.name]=1;
            var classRef=method.definingClass,
                className=classRef.substring(classRef.indexOf(":")+1)
            ;
            if(isc.isAn.Array(method.groups))method.groups=method.groups[0];
            method.isMethod=true;
            gridData.add(method);
        }
    }
    var backgroundColor=isc.DocUtils.getMissingModules(this.doc)==null?null:"lightgrey";
    var docPreview=isc.Canvas.create({
        ID:this.getID()+type+"_docPreview",
        canSelectText:true,
        autoDraw:false,
        overflow:"auto",
        backgroundColor:backgroundColor,
        contents:"<br><br><br>&nbsp;&nbsp;&nbsp;<B>Click a method or attribute above to see its documentation here."
                 +"<br>&nbsp;&nbsp;&nbsp;Shift-click or Control-click to see more than one description at a time."
                 +"<br>&nbsp;&nbsp;&nbsp;You can click and drag the resize bar above to make more room.</b>"
    });
    var apiDS=isc.DataSource.create({
        ID:this.getID()+type+"_API_DS",
        clientOnly:true,
        fields:[
            {name:"ancestorCount",
             getGroupTitle:function(groupValue,groupNode,field,fieldName,grid){
                 var groupMembers=groupNode.groupMembers;
                 if(groupMembers==null||groupMembers.length==0)return null;
                 var definingClass=groupMembers[0].definingClass;
                 return"APIs from "+definingClass+" ("+groupMembers.length+" matching filter)";
             },
             hidden:true},
            {name:"type",title:" ",summaryTitle:"Attribute / Method",width:60,hidden:true},
            {name:"definingClass",title:"Defining Class",hidden:true},
            {name:"valueType",title:"Type/Return Type",width:120,
                formatCellValue:function(value,record){
                    var type=value;
                    if(record.isMethod){
                        if(!(record.returns&&record.returns.type))return"void";
                        type=record.returns.type;
                    }else{
                        type=value;
                    }
                    return isc.TypeViewer.linkForType(type);
                }
            },
            {name:"name",canGroupBy:false,primaryKey:true,title:"Name",width:"*",
                definingClass:this.doc.ref,
                showHover:true,
                hoverHTML:function(record,value){
                    if(this.definingClass!=record.definingClass){
                        return"Inherited&nbsp;from&nbsp;"+record.definingClass;
                    }
                    return null;
                },
                formatCellValue:function(value,record){
                    if(this.definingClass!=record.definingClass)value="<i>"+value+"</i>";
                    if(record.isMethod){
                        return"<span style='color:blue'>"+value+"&nbsp;<span style='color:black'>"
                               +isc.MethodFormatter.formatMethodParams(record)+"</span></span>";
                    }
                    return"<span style='color:green'>"+value+"</span>";
                }
            },
            {name:"groups",title:"Group",width:110,
                formatCellValue:function(value,record,rowNum,colNum,grid){
                    if(!value)return isc.emptyString;
                    var groupRef=isc.jsdoc.makeRef("group",value);
                    var extraHTML="onmouseout='isc.Hover.clear()'"
                        +" onmouseover='isc.Hover.setAction(isc.ClassViewer, isc.ClassViewer.showGroupHover, null, 300)'"
                        +" onclick='isc.Hover.clear();"+grid.getID()+".showClassGroup(\""+groupRef+"\");'";
                    return isc.Canvas.imgHTML({
                        src:isc.Page.getIsomorphicDocsDir()+"skin/images/DocGrid/funnel.png",
                        width:16,
                        height:16,
                        extraStuff:extraHTML,
                        extraCSSText:"cursor:"+isc.Canvas.HAND
                    })+isc.DocUtils.linkForRef(groupRef);
                }
            },
            {name:"flags",title:"Flags",width:50,hidden:true,
                formatCellValue:function(value,record){
                    var flags=isc.DocUtils.getCanonicalFlags(value);
                    if(!flags)return isc.emptyString;
                    return isc.DocUtils.linkForRef("group:flags",flags);
                }
            }
        ]
    });
    var gridCrit={};
    if(baseClassName!="Canvas"){
        gridCrit={_constructor:"AdvancedCriteria",operator:"and",
            criteria:[
                {fieldName:"isCanvasAPI",operator:"notEqual",value:true}
            ]
        };
    }
    var apiGrid=this[type+"Grid"]=isc.DocGrid.create({
        ID:this.getID()+type+"Grid",
        autoDraw:false,
        showResizeBar:true,
        classViewer:this,
        docPreview:docPreview,
        docViewer:this.docViewer,
        initialSort:[
            {property:"ancestorCount",order:"ascending"},
            {property:"name",order:"ascending"}
        ],
        shortcutField:"name",
        dataSource:apiDS,
        data:isc.LocalResultSet.create({
            dataSource:apiDS,
            allRows:gridData,
            context:{textMatchStyle:"substring"}
        }),
        canGroupBy:false,
        groupByField:"ancestorCount",
        groupStartOpen:"first",
        groupByMaxRecords:100000,
        showAsynchGroupingPrompt:false,
        animateFolders:false,
        showClassGroup:function(ref){
            var groupItem=isc.jsdoc.getDocItem(ref);
            if(!groupItem)return;
            var groupName=isc.jsdoc.getAttribute(groupItem,"name");
            var groupTitle=isc.jsdoc.getAttribute(groupItem,"title");
            if(!groupTitle)groupTitle=groupName;
            var rows=this.getOriginalData().allRows;
            var members=[];
            for(var i=0;i<rows.length;i++){
                var docItem=rows[i];
                var group=docItem.groups;
                if(group!=null){
                    if(isc.isAn.Array(group))group=group[0];
                    if(group==groupName)members.add(docItem);
                }
            }
            members.sortByProperty("name","ascending");
            var accum=isc.StringBuffer.create();
            for(var i=0;i<members.length;i++){
                accum.append(isc.jsdoc.hoverHTML(members[i].ref),"<HR>");
            }
            if(this.updateOnRowOver)this.mouseLock=true;
            this.docPreview.setContents(accum.release(false));
            this.deselectAllRecords()
        },
        rowClick:function(record){
            this.Super("rowClick",arguments);
            this.docViewer.state.add({ts:record.ref});
        }
    });
    apiGrid.data.setCriteria(gridCrit);
    var filterForm=this[type+"Filter"]=isc.DocFilterField.create({
        width:"*",
        autoDraw:false,
        fieldName:"name",
        grid:apiGrid,
        itemChange:function(item,oldValue,newValue){
            isc.Timer.clearTimeout(this._filterTimeout);
            this._filterTimeout=
                isc.Timer.setTimeout(this.getID()+".doSetCriteria()",100);
        },
        doSetCriteria:function(){
            this.checkboxForm.doSetCriteria();
        }
    });
    var checkboxes=isc.DynamicForm.create({
        height:24,
        width:160,
        autoDraw:false,
        numCols:6,
        colWidths:[20,80,20,80,20,80],
        grid:apiGrid,
        doc:this.doc,
        nameForm:filterForm,
        initWidget:function(){
            this.nameForm.checkboxForm=this;
            this.Super("initWidget",arguments);
        },
        itemChange:function(item,oldValue,newValue){
            this.delayCall("doSetCriteria",[item]);
        },
        doSetCriteria:function(item){
            var values=this.getValuesAsCriteria(),
                searchValues=this.nameForm.getValuesAsCriteria(),
                criteria={}
            ;
            if(searchValues.name)criteria.name=searchValues.name;
            if(values.showAttributes&&values.showMethods){
            }else if(values.showAttributes){
                criteria["type"]="attr";
            }else if(values.showMethods){
                criteria["type"]="method";
            }else if(!values.showMethods&&!values.showAttributes){
                var resetItem=item.name=="showAttributes"?"showMethods":"showAttributes";
                this.setValue(resetItem,true);
                this.doSetCriteria();
                return;
            }
            if(values.expandAll){
                apiGrid.groupStartOpen="all";
            }else{
                apiGrid.groupStartOpen="first";
            }
            var newCrit=isc.DS.convertCriteria(criteria);
            this.grid.filterData(newCrit);
        },
        fields:[
            {name:"showAttributes",title:"Attributes",type:"checkbox",defaultValue:true,width:"*"},
            {name:"showMethods",title:"Methods",type:"checkbox",defaultValue:true,width:"*"},
            {name:"expandAll",title:"Expand All",type:"checkbox",defaultValue:false,width:"*"}
        ]
    });
    var filterLayout=isc.HLayout.create({
        height:24,
        autoDraw:false,
        members:[filterForm,checkboxes]
    });
    var apiLayout=this[type+"Layout"]=isc.VLayout.create({
        autoDraw:false,
        members:[filterLayout,apiGrid,docPreview]
    });
    tabSet.updateTab(tabID,apiLayout);
    return apiLayout;
}
,isc.A._autoGenOverrideDocs=function isc_ClassViewer__autoGenOverrideDocs(){
    var className=isc.jsdoc.getAttribute(this.docItem,"name");
    var propertyOverrides=isc.ClassViewer.getOverrideProperties(className);
    if(!propertyOverrides)return;
    var overridden=propertyOverrides.overridden;
    var overrides=propertyOverrides.overrides;
    for(var i=0;i<overridden.length;i++){
        var overriddenRef=overridden[i],
            overrideRef=overrides[i],
            overriddenDoc=isc.jsdoc.getDocItem(overriddenRef),
            overrideDoc=isc.jsdoc.getDocItem(overrideRef),
            name=isc.jsdoc.getAttribute(overriddenDoc,"name")
        ;
        var overriddenText="<i>This method is an override of ${isc.DocUtils.linkForRef('"
                             +overriddenRef+"')} - directly overriding this method without calling"
                             +" </i><code>this.Super('"+name+"', arguments)</code><i> may destroy"
                             +" functionality in this class.</i>";
        if(overrideDoc!=null){
            isc.jsdoc.setAttribute(overrideDoc,"overridden","<br><br>"+overriddenText);
        }else{
            overrideDoc=isc.jsdoc.dataIsXML?overriddenDoc.cloneNode(true):isc.addProperties({},overriddenDoc);
            isc.jsdoc.setAttribute(overrideDoc,"overridden",overriddenText);
            isc.jsdoc.setAttribute(overrideDoc,"ref",overrideRef);
            isc.jsdoc.setAttribute(overrideDoc,"definingClass","class:"+className);
            isc.jsdoc.removeAttribute(overrideDoc,"override");
            isc.jsdoc.setAttribute(overrideDoc,"description",isc.emptyString);
            isc.jsdoc.addDocItem(overrideRef,overrideDoc);
            var targetListName=isc.jsdoc.getAttribute(overrideDoc,"type")=="method"?"methods":"classMethods";
            isc.jsdoc.addToList(this.docItem,targetListName,overrideRef);
        }
    }
}
);
isc.B._maxIndex=isc.C+6;

isc.ClassFactory.defineClass("SummaryViewer","DocTabSet");
isc.A=isc.SummaryViewer.getPrototype();
isc.A.hideUsingDisplayNone=isc.Browser.isMoz
;

isc.A=isc.SummaryViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.initWidget=function isc_SummaryViewer_initWidget(){
    this.Super(this._$initWidget);
    this.title=this.node.title?this.node.title:this.node.name;
    if(this.title.endsWith("/"))this.title=this.title.substring(0,this.title.length-1);
    this.addTab({
        title:"&nbsp;"+this.title+"&nbsp;",
        pane:this._buildSummaryView()
    });
}
,isc.A._buildSummaryView=function isc_SummaryViewer__buildSummaryView(){
    var accum=isc.StringBuffer.create();
    var childNodes=this._docTree.getChildren(this.node);
    accum.append("<br>");
    for(var i=0;i<childNodes.length;i++){
        var node=childNodes[i];
        accum.append("&nbsp;&nbsp;<nobr>");
        if(node.ref){
            accum.append(isc.DocUtils.linkForRef(node.ref,node.name));
        }else{
            accum.append("<a href='' onclick='",this.docViewer.getID(),"._showNode(\"",
                         this._docTree.getPath(node),"\");return false;'>",node.title,"</a>");
        }
        accum.append("</nobr><br>");
    }
    var canvas=isc.Canvas.create({
        autoDraw:false,
        canSelectText:true,
        contents:accum.release(false)
    });
    return canvas;
}
);
isc.B._maxIndex=isc.C+2;

isc.defineClass("DocViewer","SplitPane");
isc.A=isc.DocViewer.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.docRoot=isc.emptyString;
isc.A.referenceRoot=isc.Page.getIsomorphicDocsDir();
isc.A.featureExplorerURL=isc.Page.getIsomorphicDocsDir()+"SmartClient_Explorer.html";
isc.A._viewCache={};
isc.A.skinDir="[ISO_DOCS_SKIN]/";
isc.A.jumpToTopicInURL=true;
isc.A.topic=null;
isc.A.visibility="hidden";
isc.A.resizeBarTarget="next";
isc.A.navigationTitle="";
isc.A.showMiniNav=true;
isc.A.overflow="hidden";
isc.A.showNavigationBar=false;
isc.A.showDetailToolStrip=false;
isc.A.showMiniNav=false;
isc.A.currentPane="navigation";
isc.A.toolStripSCVersionDefaults={
        _constructor:"ToolStrip",
        autoParent:"leftPane",
        width:"100%",
        initWidget:function(){
            this.Super("initWidget",arguments);
            this.members[0].setContents("Version: "+isc.scVersion+" <br>"+
                                        "Built: "+isc.buildDate);
        },
        members:[
            {
                _constructor:"Label",
                autoDraw:false,
                width:"100%",
                height:"100%",
                padding:5,
                dynamicContents:true,
                valign:"center"
            }
        ]
    };
isc.B.push(isc.A.initWidget=function isc_DocViewer_initWidget(){
    this.skinImgDir=this.skinDir+"images/";
    var obfuscation_local_identifier;
    this.Super(this._$initWidget);
    isc.DocViewer.instance=this;
    if(this.docItems||this.docLookup||window.docItems)
        isc.jsdoc.init(this.docItems||this.docLookup||window.docItems);
    this._leftPane=this._buildLeftPane();
    this._rightPane=this._buildRightPane();
    this.setNavigationPane(this._leftPane);
    this.observe(this.navigationPane,"visibilityChanged","observer._docNavBar._updateButtonState()");
    this.setDetailPane(this._rightPane);
    this.addMember(this.leftSuperPane);
    this.state=isc.DocCookieState.create({
        disableCookieStore:this.disableCookieStore,
        defaultData:{
            v:isc.version,
            tab:0
        },
        cookieName:"docViewerState",
        onload:this.getID()+".restoreState(data)"
    });
    if(!isc.jsdoc.data){
        this.observe(isc.jsdoc,"init","observer.docDataAvailable()");
    }else{
        this.docDataAvailable();
    }
    if(this.trackHistory){
        isc.History.registerCallback({method:this.historyCallback,target:this});
    }
}
,isc.A.restoreState=function isc_DocViewer_restoreState(state,data){
    this.initTreeState();
    this.delayCall("setVisibility",["inherit"]);
}
,isc.A.docDataAvailable=function isc_DocViewer_docDataAvailable(){
    isc.FL.hideThrobber();
    var showedTopic=false;
    if(this.topic){
        this.showTopic(this.topic);
        showedTopic=true;
    }
    if(!showedTopic&&this.jumpToTopicInURL){
        var match=location.toString().match(/[?&](topic|ref|search)=([^&]*)/);
        if(match){
            if(match[1]=="search"){
                this._searchBar.doSearch(decodeURIComponent(match[2]));
            }else{
                this.showTopic(decodeURIComponent(match[2]));
            }
            showedTopic=true;
        }else{
            match=decodeURIComponent(location.href).match(/#search=(.*)/);
            if(match){
                 this._searchBar.doSearch(this.decodeHistoryID(match[1]));
                 showedTopic=true;
            }
        }
    }
    var match=location.href.match(/([^#]*)#(.*)/);
    if(!showedTopic&&((this.state.data&&this.state.data.ts)||(this.trackHistory&&isc.History.getCurrentHistoryId()!=null))){
        var ts=this.state&&this.state.data&&this.state.data.ts;
        if(ts==null||(this.trackHistory&&isc.History.getCurrentHistoryId()!=null)){
            ts=this.decodeHistoryID(isc.History.getCurrentHistoryId());
            this.noHistory=true;
        }
        if(ts!=null&&ts.startsWith("/")){
            var node=this._docTree.find(ts);
            if(node){
                this._docTreeGrid.selectRecord(node);
                this._show(node.ref?node.ref:node,true);
                showedTopic=true;
            }else{
                this.logWarn("Can't find previously selected node at path: "+ts);
            }
        }else{
            showedTopic=true;
            this._show(ts);
        }
        this.noHistory=false;
    }
    if(!showedTopic){
        this.showHelpDialog();
    }
}
,isc.A.initTreeState=function isc_DocViewer_initTreeState(){
    var tree=this._docTree;
    if(this.treeStateInitialized||!tree||!isc.Page.isLoaded())return;
    if(!this.state.data)return;
    var openPaths=this.state.data.op;
    if(!openPaths)return;
    tree.ignoreDataVisibilityChange=true;
    var openNodes=tree.getOpenFolders();
    for(var i=0;i<openNodes.length;i++){
        var node=openNodes[i];
        var path=tree.getPath(node);
        if(!openPaths.contains(path)){
            tree.closeFolder(node);
        }
    }
    for(var i=0;i<openPaths.length;i++){
        var path=openPaths[i];
        var node=tree.find(path);
        if(!node){
            this.logWarn("restoring tree state: couldn't find node for path: "
                         +path+" - ignoring.");
            continue;
        }
        tree.openFolder(node);
    }
    delete tree.ignoreDataVisibilityChange;
    this.treeStateInitialized=true;
}
,isc.A._doSelect=function isc_DocViewer__doSelect(classViewer,ref,viewRef){
    var docItem=isc.jsdoc.getDocItem(ref);
    var docItemType=isc.jsdoc.getType(docItem);
    if(!(isc.jsdoc.isMethod(docItemType)||isc.jsdoc.isAttr(docItemType))){
        var id=this._docTree.refToID[viewRef];
        var tab=0;
        if(this.state.data.tabs)
            tab=this.state.data.tabs[id]||0;
        classViewer.selectTab(tab);
        return;
    }
    var type=isc.jsdoc.isInstance(docItemType)?"instance":"class";
    var tabNum=0;
    if(type=="instance")tabNum=1;
    else tabNum=classViewer.hasInstanceAPIs?2:1;
    classViewer.selectTab(tabNum);
    if(!classViewer.isDrawn()){
        var tabObject=classViewer.getTabObject(tabNum);
        classViewer.tabSelected(tabNum,tabObject.pane,tabObject.ID);
    }
    var grid=classViewer[type+"Grid"];
    var rs=grid.getOriginalData();
    var _this=this;
    var postLoad=function(){
        var record=grid.getOriginalData().localData.find("ref",ref);
        grid.deselectAllRecords();
        grid.selectRecord(record);
        grid.previewRecord(record);
        grid.mouseLock=true;
        _this.delayCall("scrollGrid",[grid,record]);
    }
    isc.Page.waitFor(grid,"groupByComplete",postLoad);
    grid.filterData({});
}
,isc.A.scrollGrid=function isc_DocViewer_scrollGrid(grid,record){
    grid.scrollRecordIntoView(grid.getData().indexOf(record),"center");
}
,isc.A._showNode=function isc_DocViewer__showNode(node){
    if(isc.isA.String(node))node=this._docTree.find(node);
    this._show(node);
}
,isc.A.showTopic=function isc_DocViewer_showTopic(ref){
    if(ref==null){
        this.logWarn("showTopic(null) - ignored");
        return;
    }
    if(isc.jsdoc.getDocItem(ref)==null){
        this.logWarn("Can't jump to topic: "+ref+" - ref does not resolve.");
        return;
    }
    this._show(ref);
}
,isc.A._destroyCacheEntry=function isc_DocViewer__destroyCacheEntry(ref){
    var view=this._viewCache[ref];
    if(view){
        view.destroy();
        delete this._viewCache[ref];
        if(this.logIsDebugEnabled()){
            this.logDebug("destroying view: "+view.getID()
                          +", cache contents: "+isc.Log.echoAll(this._viewCache))
        }
    }
}
,isc.A.encodeHistoryID=function isc_DocViewer_encodeHistoryID(id){
    return id.replace(/\//g,"_")
             .replace(/ /g,"-")
             .replace(/:/g,"..");
}
,isc.A.decodeHistoryID=function isc_DocViewer_decodeHistoryID(id){
    if(id==null||id=="init")return null;
    return id.replace(/_/g,"/")
             .replace(/-/g," ")
             .replace(/\.\./g,":");
}
,isc.A.historyCallback=function isc_DocViewer_historyCallback(id,data){
    id=this.decodeHistoryID(id)
    if(id==null)return;
    if(!isc.Page.isLoaded())return;
    this.noHistory=true;
    if(id.startsWith("/")){
        var node=this._docTree.find(id);
        if(node){
            this._docTreeGrid.selectRecord(node);
            this._show(node.ref?node.ref:node,true);
            var noHistory=this.noHistory;
            var tg=this._docTreeGrid;
            var recordIndex=this._docTree.indexOf(node);
            isc.Timer.setTimeout(function(){
                var h=isc.DocViewer.instance.noHistory;
                isc.DocViewer.instance.noHistory=noHistory;
                tg.deselectAllRecords();
                tg.selectRecord(recordIndex);
                tg.scrollRecordIntoView(recordIndex);
                isc.DocViewer.instance.noHistory=h;
            },0);
        }
    }else if(id.startsWith("search")){
        this._show("searchResults");
    }else{
        this._show(id);
    }
    this.noHistory=false;
}
,isc.A._show=function isc_DocViewer__show(ref,dontUpdateTreeSelection){
    var view,
        showLoadingPrompt=false,
        isAttrOrMethod=false,
        viewRef=ref,
        missingModules=null;
    if(ref=="searchResults"||ref==this.searchResults){
       this.replaceCurrentView(this.searchResults);
       if(!this.noHistory&&this.trackHistory){
           isc.History.addHistoryEntry(this.encodeHistoryID("search="+this.searchResults.searchString));
       }
       this._track();
       return;
    }
    if(isc.isA.Canvas(ref)){
        this.replaceCurrentView(ref);
        this._track();
        return;
    }if(isc.isAn.Object(ref)){
        var node=ref;
        missingModules=this._docTreeGrid.getMissingModules(node);
        if(node.contentsURL){
            if(missingModules){
                isc.say("This API requires: <a href='"+isc.licensingPage+"' target=_blank>"+missingModules+"</a></b></span>");
                return;
            }
            if(ref.contentsURL.startsWith("[docRoot]"))
                ref.contentsURL=this.docRoot+ref.contentsURL.substring(9);
            if(ref.contentsURL.startsWith("[referenceRoot]"))
                ref.contentsURL=this.referenceRoot+ref.contentsURL.substring(15);
            if(isc.Browser.isMac&&ref.contentsURL.endsWith("pdf")){
                window.location.replace(ref.contentsURL);
                return null;
            }else{
                window.open(ref.contentsURL);
            }
            this._track();
            return;
        }else{
            view=isc.SummaryViewer.create({
                _docTree:this._docTree,
                docViewer:this,
                node:node,
                autoDraw:false,
                width:"100%",
                height:"100%"
            });
            var ts=this._docTree.getPath(node);
            this.state.add({ts:ts});
            if(!this.noHistory&&this.trackHistory)isc.History.addHistoryEntry(this.encodeHistoryID(ts));
            this.replaceCurrentView(view);
            this._track();
            return;
        }
    }else{
        var docItem=isc.jsdoc.getDocItem(ref,null,true),
            type=isc.jsdoc.getType(docItem);
        ref=isc.jsdoc.getAttribute(docItem,"ref");
        if(isc.jsdoc.isMethod(type)||isc.jsdoc.isAttr(type)){
            viewRef=isc.jsdoc.getAttribute(docItem,"definingClass");
            isAttrOrMethod=true;
        }
        view=this._viewCache[viewRef];
        var id=this._docTree.refToID[viewRef];
        if(id!=null){
            var tree=this._docTree,tg=this._docTreeGrid;
            var recordToSelect=tree.findById(id);
            if(recordToSelect)missingModules=this._docTreeGrid.getMissingModules(recordToSelect);
            if(!dontUpdateTreeSelection){
                tree.openFolders(tree.getParents(recordToSelect));
                var noHistory=this.noHistory||isAttrOrMethod;
                var recordIndex=tree.indexOf(recordToSelect);
                isc.Timer.setTimeout(function(){
                    var h=isc.DocViewer.instance.noHistory;
                    isc.DocViewer.instance.noHistory=noHistory;
                    tg.deselectAllRecords();
                    tg.selectRecord(recordIndex);
                    tg.scrollRecordIntoView(recordIndex);
                    isc.DocViewer.instance.noHistory=h;
                },0);
            }
        }
        this.state.add({ts:ref});
        if(!this.noHistory&&this.trackHistory)isc.History.addHistoryEntry(this.encodeHistoryID(ref));
    }
    var origNoHistory=this.noHistory;
    if(isAttrOrMethod)this.noHistory=true;
    if(!view){
        if(showLoadingPrompt){
            isc.showPrompt("Loading...");
            this.delayCall("_createAndShow",[ref,viewRef,missingModules]);
        }else{
            this._createAndShow(ref,viewRef,missingModules);
        }
        this.noHistory=origNoHistory;
        this._track();
        return;
    }else{
        this.replaceCurrentView(view,viewRef);
        if(!this._docNavBar._navBarInitiated)this._doSelect(view,ref,viewRef);
    }
    this.noHistory=origNoHistory;
}
,isc.A._track=function isc_DocViewer__track(){
}
,isc.A._createAndShow=function isc_DocViewer__createAndShow(ref,viewRef,missingModules){
    var view=this._createView(viewRef,missingModules);
    if(isc.isA.ClassViewer(view)){
        if(!this._docNavBar._navBarInitiated)this._doSelect(view,ref,viewRef);
        this._viewCache[viewRef]=view;
    }
    this.replaceCurrentView(view);
}
,isc.A.replaceCurrentView=function isc_DocViewer_replaceCurrentView(view){
    if(view==this._currentView)return;
    if(this._currentView){
        if(isc.isA.DocSearchResults(this._currentView)
            ||isc.isA.ClassViewer(this._currentView))
        {
            this._currentView.hide();
        }else{
            this._currentView.destroy();
        }
    }
    this._currentView=view;
    this._viewArea.addChild(view);
    view.show();
    if(isc.isA.GroupViewer(view)||isc.isA.TypeViewer(view)||
        isc.isA.ClassViewer(view))
    {
        this._docNavBar.updateNav(view.ref,view.title);
    }
    if(isc.isA.DocSearchResults(view)){
        this._docNavBar.updateNav("searchResults","Search Results");
    }
    var header=isc.emptyString;
    if(isc.isA.GroupViewer(view)&&view.doc.title){
        header="<b>"+view.title+"</b>";
    }else if(isc.isA.DocSearchResults(view)){
        header="<b>Search Results</b>";
    }else if(view.title){
        if(isc.isA.SummaryViewer(view))header="<b>"+view.title+"</b>";
        else{
            header="<span style='color:#625D5D'>";
            if(isc.isA.ClassViewer(view))header+=view.doc.type;
            else if(isc.isA.TypeViewer(view))header+="type";
            else header+="group";
            header+="</span> <b>"+view.title+"</b>";
        }
    }
    this._docNavBar._label.setContents(header);
    isc.clearPrompt();
    this.showDetailPane();
}
,isc.A._createView=function isc_DocViewer__createView(ref,missingModules){
    if(!this._viewProps)this._viewProps={
        overflow:"hidden",
        autoDraw:false,
        docViewer:this,
        docTree:this._docTree,
        docRoot:this.docRoot,
        width:"100%",
        height:"100%",
        missingModules:missingModules
    };
    var docItem=isc.jsdoc.getDocItem(ref);
    var type=isc.jsdoc.getAttribute(docItem,"type");
    var viewer;
    if(isc.jsdoc.isType(type))viewer=isc.TypeViewer;
    else if(isc.jsdoc.isGroup(type))viewer=isc.GroupViewer;
    else viewer=isc.ClassViewer;
    return viewer.create(this._viewProps,{
        ref:ref,
        docItem:docItem
    });
}
,isc.A._buildLeftPane=function isc_DocViewer__buildLeftPane(){
    this._searchBar=isc.DocSearchBar.create({
        ID:"searchForm",
        autoDraw:false,
        height:24,
        docViewer:this
    });
    this._docTree=window.docTree;
    this._docTree.addProperties({
        docViewer:this,
        changeDataVisibility:function(node,newState){
            this.Super("changeDataVisibility",arguments);
            if(this.ignoreDataVisibilityChange)return;
            var data=this.docViewer.state.data;
            if(!data)return;
            var openPaths=data.op;
            if(!openPaths){
                var openNodes=this.getOpenFolders();
                openPaths=[];
                for(var i=0;i<openNodes.length;i++)
                    openPaths[i]=this.getPath(openNodes[i]);
            }
            var path=this.getPath(node);
            if(newState)openPaths.add(path);
            else openPaths.remove(path);
            this.docViewer.state.add({op:openPaths});
        }
    });
    var descendants=this._docTree.getDescendants(this.root);
    for(var i=0;i<descendants.length;i++){
        var node=descendants[i];
        if(node.requiresModules){
            if(!isc.hasOptionalModules(node.requiresModules));
            node.missingModules=isc.getMissingModules(node.requiresModules).getProperty("name").join(", ");
        }
    }
    var optionalModules=this._docTree.find("/optionalModules");
    if(optionalModules&&optionalModules.children.length==0){
        this._docTree.remove(optionalModules,true);
    }
    this._docTreeGrid=isc.TreeGrid.create({
        autoDraw:false,
        showHeader:false,
        animateFolders:false,
        emptyMessage:"<i>Loading Doc Tree...</i>",
        selectionType:"single",
        leaveScrollbarGap:false,
        data:this._docTree,
        drawAllMaxCells:1000,
        docViewer:this,
        selectionChanged:function(record,state){
            if(state&&record)this.docViewer._show(record.ref?record.ref:record,true);
        },
        getMissingModules:function(record){
            var missingModules=record.missingModules;
            if(!missingModules){
                var parents=this.data.getParents(record);
                for(var i=0;i<parents.length;i++){
                    if(parents[i].missingModules){
                        missingModules=record.missingModules=parents[i].missingModules;
                        break;
                    }
                }
            }
            return missingModules;
        }
    },this.docTreeProperties);
    this.addAutoChild("toolStripSCVersion",{
        height:isc.Browser.isDesktop?34:44
    });
    var leftPane=isc.VLayout.create({
        ID:"leftPane",
        docViewer:this,
        autoDraw:false,
        membersMargin:0,
        members:[this._searchBar,this._docTreeGrid,this.toolStripSCVersion]
    });
    return leftPane;
}
,isc.A._buildRightPane=function isc_DocViewer__buildRightPane(){
    this._docNavBar=isc.DocNavBar.create({
        autoDraw:false,
        height:30,
        membersMargin:3,
        overflow:"hidden",
        docViewer:this
     });
    isc.DocNavBar.instance=this._docNavBar;
    this._viewArea=isc.Canvas.create({
        ID:"viewArea",
        autoDraw:false,
        overflow:"hidden"
    });
    var rightPane=isc.VLayout.create({
        ID:"rightPane",
        autoDraw:false,
        overflow:"hidden",
        members:[this._docNavBar,this._viewArea]
    });
    return rightPane;
}
,isc.A.showPrefsDialog=function isc_DocViewer_showPrefsDialog(){
    if(!this._prefsDialog)this._prefsDialog=isc.DocPrefsDialog.create({
        autoDraw:false,
        docViewer:this
    });
    this._prefsDialog.show();
}
,isc.A.showHelpDialog=function isc_DocViewer_showHelpDialog(){
    this._show("group:docViewerHelp",true);
}
);
isc.B._maxIndex=isc.C+21;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('DocViewer');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._DocViewer_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('DocViewer module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'DocViewer', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'DocViewer'.");}

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

