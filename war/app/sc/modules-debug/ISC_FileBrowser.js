
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

if(window.isc&&window.isc.module_Core&&!window.isc.module_FileBrowser){isc.module_FileBrowser=1;isc._moduleStart=isc._FileBrowser_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'FileBrowser load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.DataSource.create({
    criteriaPolicy:"dropOnChange",
    allowAdvancedCriteria:true,
    ID:"Filesystem",
    fields:[
        {
            validators:[
            ],
            length:2000,
            name:"path",
            title:"Path",
            type:"text",
            required:true,
            primaryKey:true
        },
        {
            length:2000,
            name:"variablePath",
            hidden:true,
            type:"text",
            validators:[
            ]
        },
        {
            hidden:true,
            rootValue:"/",
            validators:[
            ],
            name:"parentID",
            type:"text",
            foreignKey:"Filesystem.path",
            required:true
        },
        {
            name:"name",
            type:"text",
            validators:[
            ]
        },
        {
            name:"isFolder",
            type:"boolean",
            validators:[
            ]
        },
        {
            name:"size",
            type:"long",
            validators:[
            ]
        },
        {
            name:"lastModified",
            type:"lastModified",
            validators:[
            ]
        },
        {
            name:"mimeType",
            type:"text",
            validators:[
            ]
        },
        {
            length:1000000,
            name:"contents",
            type:"text",
            validators:[
            ]
        },
        {
            name:"webrootOnly",
            type:"boolean",
            validators:[
            ]
        }
    ]
})
isc.defineClass("FileBrowser","Window");
isc.A=isc.FileBrowser;
isc.A.dsDir="/shared/ds";
isc.A.appDir="/shared/app";
isc.A.uiDir="/shared/ui";
isc.A._globalFolderHistory=[]
;

isc.A=isc.FileBrowser.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.autoCenter=true;
isc.A.modal=true;
isc.A.width=720;
isc.A.height=480;
isc.A.canDragResize=true;
isc.A.webrootOnly=true;
isc.A.actionStripConstructor="ToolStrip";
isc.A.actionStripDefaults={
    height:24,
    autoParent:"body"
};
isc.A.actionStripControls=["spacer:10","pathLabel","previousFolderButton","spacer:10",
                      "upOneLevelButton","spacer:10",
                      "createNewFolderButton","spacer:10","refreshButton","spacer:2"];
isc.A._$pathLabelFolderSpanStyle="padding-left: 1px; padding-right: 1px; color: #0000EE; color: -webkit-link; text-decoration: underline;";
isc.A.pathLabelConstructor="Label";
isc.A.pathLabelDefaults={
    width:"*",
    autoParent:"actionStrip",
    useEventParts:true,
    _pathSegmentEventPart:"path",
    _pathSegments:[],
    pathClick:function(element){
        var dir=this._getPath(element);
        if(dir!=null){
            this.creator.setDir(dir);
        }
    },
    _getPath:function(element){
        var id=parseInt(this.getElementPart(element).ID);
        if(!isNaN(id)){
            return"/"+this._pathSegments.getRange(0,id+1).join("/");
        }else{
            return null;
        }
    },
    _setPath:function(dir){
        var contents=isc.StringBuffer.create();
        var pathSegments=this._pathSegments=dir.split("/");
        if(pathSegments[0]==isc.emptyString){
            pathSegments.shift();
        }
        this._pathSegments=[];
        var offset=0;
        var spanStyle=this.creator._$pathLabelFolderSpanStyle;
        for(var i=0,len=pathSegments.getLength();i<len;++i){
            var id=i-offset;
            if(pathSegments[id]==isc.emptyString){
                ++offset;
                continue;
            }
            var segment=pathSegments[id];
            this._pathSegments.push(segment);
            contents.append(
                "/<SPAN STYLE=\"cursor:hand;",spanStyle,"\" ",
                this._$eventPart,"=",this._pathSegmentEventPart,
                " id=",this.getID(),"_",this._pathSegmentEventPart,"_",id,">",
                segment,
                "</SPAN>");
        }
        contents.append("/");
        this.setContents(contents.release(false));
    }
};
isc.A.previousFolderButtonConstructor="ImgButton";
isc.A.previousFolderButtonDefaults={
    size:16,
    layoutAlign:"center",
    src:"[SKIN]/previousFolder.png",
    showRollOver:false,
    showDown:false,
    prompt:"Go To Last Folder Visited",
    click:"this.creator.previousFolder()"
};
isc.A.upOneLevelButtonConstructor="ImgButton";
isc.A.upOneLevelButtonDefaults={
    autoParent:"actionStrip",
    size:16,
    layoutAlign:"center",
    src:"[SKIN]/upOneLevel.png",
    showRollOver:false,
    showDown:false,
    prompt:"Up One Level",
    click:"this.creator.upOneLevel()"
};
isc.A.createNewFolderButtonConstructor="ImgButton";
isc.A.createNewFolderButtonDefaults={
    autoParent:"actionStrip",
    size:16,
    layoutAlign:"center",
    src:"[SKIN]/createNewFolder.png",
    showRollOver:false,
    showDown:false,
    prompt:"Create New Folder",
    click:"this.creator.createNewFolder()"
};
isc.A.refreshButtonConstructor="ImgButton";
isc.A.refreshButtonDefaults={
    autoParent:"actionStrip",
    size:16,
    layoutAlign:"center",
    src:"[SKIN]/refresh.png",
    showRollOver:false,
    showDown:false,
    prompt:"Refresh",
    click:"this.creator.refresh()"
};
isc.A.directoryListingConstructor="ListGrid";
isc.A.directoryListingDefaults={
    dataSource:"Filesystem",
    sortFieldNum:1,
    canEdit:true,
    folderIcon:"[SKIN]/FileBrowser/folder.png",
    fileIcon:"[SKIN]/FileBrowser/file.png",
    loadingDataMessage:"&nbsp;",
    emptyMessage:"&nbsp;",
    fileBrowser:this,
    showHeader:false,
    selectionStyle:"single",
    canMultiSort:true,
    initialSort:[
        {property:"isFolder",direction:"descending"},
        {property:"name",direction:"ascending"}
    ],
    recordClick:function(viewer,record,recordNum){
        record._canEdit=false;
        if(!record.isFolder){
            this.creator.actionForm.setValue("fileName",record.name);
        }
        if(record==this._lastRecord){
            delete record._canEdit;
            if(this.canEdit)this.startEditing(recordNum,1);
            return;
        }
        this._lastRecord=record;
        return false;
    },
    recordDoubleClick:function(viewer,record){
        if(record.isFolder){
            this.creator.setDir(record.path);
        }else{
            this.creator.fileSelected(record.name);
        }
        return false;
    },
    rowContextClick:function(record){
        this._contextRecord=record;
        if(!this._recordMenu)this._recordMenu=this.getMenuConstructor().create({
            grid:this,
            deleteFile:function(){
                this.grid.creator.confirmRemoveFile(this.grid._contextRecord.path);
            },
            newFolder:function(){
                this.grid.creator.createNewFolder();
            },
            data:[
                {title:"Delete file (recursive)",click:"menu.deleteFile()"}
            ]
        });
        this._recordMenu.showContextMenu();
        return false;
    },
    fields:[
        {name:"isFolder",canEdit:false,
         formatCellValue:function(value,record,rowNum,colNum,grid){
            var img=value?grid.folderIcon:grid.fileIcon
            return grid._formatImageCellValue(img,this,grid,record,rowNum,colNum);
         },
         width:20
        },
        {name:"name",width:"*"}
    ]
};
isc.A.showDirectoryShortcuts=false;
isc.A.directoryShortcutsConstructor="VLayout";
isc.A.directoryShortcutsDefaults={
    width:60
};
isc.A.actionFormConstructor="DynamicForm";
isc.A.skinImgDir="images/FileBrowser/";
isc.A.rootDir="/";
isc.A.initialDir="/";
isc.A.allFilesFilterText="All Files";
isc.B.push(isc.A.initWidget=function isc_FileBrowser_initWidget(){
    this.actionFormDefaults=this._getActionFormDefaults();
    var _this=this;
    this.directoryListingDefaults.dataProperties={
        transformData:function(newData,dsResponse){
            return _this._transformData.apply(_this,arguments);
        }
    };
    this.Super("initWidget",arguments);
}
,isc.A._transformData=function isc_FileBrowser__transformData(newData,dsResponse){
    if(!isc.isAn.Array(newData))return;
    var filterExpressions=this._filterExpressions,
        startRow=dsResponse.startRow,
        endRow=dsResponse.endRow,
        numRecords=endRow-startRow,
        numExpressions=filterExpressions&&filterExpressions.getLength(),
        removed=0;
    for(var i=0;i<numRecords;++i){
        var j=i-removed,
            record=newData[j],
            path=record.path,
            shouldRemove=false;
        if(record.isFolder){
            continue;
        }
        if(filterExpressions!=null){
            for(var k=0;k<numExpressions;++k){
                var exp=filterExpressions[k];
                if(isc.isA.String(exp)){
                    if(path.contains(exp)){
                        break;
                    }
                }else if(isc.isA.RegularExpression(exp)){
                    if(path.match(exp)!=null){
                        break;
                    }
                }
            }
            if(k==numExpressions){
                shouldRemove=true;
            }
        }
        if(shouldRemove){
            ++removed;
            newData.splice(j,1);
        }
    }
    dsResponse.totalRows-=removed;
    dsResponse.endRow-=removed;
}
,isc.A._getActionFormDefaults=function isc_FileBrowser__getActionFormDefaults(){
    var actionFormDefaults={
        overflow:"hidden",
        autoParent:"body",
        numCols:3,
        height:45,
        padding:5,
        colWidths:[100,"*",120],
        browserSpellCheck:false,
        process:function(){
            if(this.validate()){
                this.creator._updateGlobalFolderHistory();
                this.creator.fileSelected(this.getValue("fileName"));
            }
        },
        fields:[
            {name:"fileName",type:"text",width:"*",title:"File name",
             keyPress:"if (keyName == 'Enter') form.process()",
             validators:[
                {type:"lengthRange",max:255,min:1},
                {type:"regexp",expression:"([^:\\*\\?<>\\|\\/\"'])+",
                 errorMessage:"Can't contain \\/:*?\"'<>|"}
             ]
            },
            {name:"button",type:"button",startRow:false,click:"form.process()"}
        ]
    };
    if(isc.isAn.Array(this.fileFilters)&&!this.fileFilters.isEmpty()){
        var selectedFileFilter;
        if(isc.isA.Number(this.selectedFileFilter)){
            selectedFileFilter=this.fileFilters[this.selectedFileFilter];
        }else if(this.fileFilters.contains(this.selectedFileFilter)){
            selectedFileFilter=this.selectedFileFilter;
        }else{
            selectedFileFilter=this.fileFilters[0];
        }
        var fields=actionFormDefaults.fields;
        fields.addAt(this._createFileFiltersSelect(selectedFileFilter),1);
        fields.addAt({type:"spacer",colSpan:2},2);
        actionFormDefaults.height+=26;
    }
    return actionFormDefaults;
}
,isc.A._createFileFiltersSelect=function isc_FileBrowser__createFileFiltersSelect(selectedFileFilter){
    var _this=this;
    var values=this.fileFilters.getProperty("filterName");
    values.add(this.allFilesFilterText);
    var defaultValue=selectedFileFilter.filterName;
    this._setFilterExpressions(defaultValue);
    return{
        name:"fileFilters",
        type:"select",
        showTitle:false,
        valueMap:values,
        defaultValue:defaultValue,
        changed:function(form,item,value){
            _this._setFilterExpressions(value);
            _this._filterDirectoryListing();
        }
    };
}
,isc.A._setFilterExpressions=function isc_FileBrowser__setFilterExpressions(filterName){
    if(filterName==this.allFilesFilterText){
        this._filterExpressions=null;
    }else{
        var exps=this.fileFilters.find("filterName",filterName).filterExpressions;
        if(exps!=null){
            if(isc.isAn.Array(exps)&&!exps.isEmpty()&&!exps.contains(null)){
                this._filterExpressions=exps;
            }else if(isc.isA.String(exps)||isc.isA.RegularExpression(exps)){
                this._filterExpressions=[exps];
            }else{
                this._filterExpressions=null;
            }
        }else{
            this._filterExpressions=null;
        }
    }
}
,isc.A.draw=function isc_FileBrowser_draw(){
    this.Super("draw",arguments);
    if(this._FBInitialized)return;
    this.addAutoChild("actionStrip");
    if(this.actionStripControls){
        for(var i=0;i<this.actionStripControls.length;i++){
            var control=this.actionStripControls[i];
            if(control.startsWith("spacer:")){
                this.actionStrip.addMember(isc.LayoutSpacer.create({
                    width:control.substring(control.indexOf(":")+1)
                }));
            }else if(control=="separator"){
            }else{
                if(isc.isA.String(control)){
                    this.addAutoChild(control,{skinImgDir:this.skinImgDir},null,this.actionStrip);
                }else{
                    this.actionStrip.addMember(control);
                }
            }
        }
    }
    if(this.showDirectoryShortcuts!==false){
        this.directoryLayout=isc.HLayout.create();
        this.addItem(this.directoryLayout);
        this.addAutoChild("directoryShortcuts",null,null,this.directoryLayout);
        this.addAutoChild("directoryListing",null,null,this.directoryLayout);
    }else{
        this.addAutoChild("directoryListing",null,null,this.body);
    }
    this.addItem(isc.LayoutSpacer.create({height:10}));
    this.addAutoChild("actionForm");
    this.actionForm.getField("button").setTitle(this.actionButtonTitle);
    if(this.initialDir)this.setDir(this.initialDir);
    this._FBInitialized=true;
}
,isc.A._makePath=function isc_FileBrowser__makePath(dir,name){
    if(!dir.endsWith("/"))dir+="/";
    return dir+name;
}
,isc.A.setFileName=function isc_FileBrowser_setFileName(fileName){
    this.actionForm.setValue("fileName",fileName);
}
,isc.A.setDir=function isc_FileBrowser_setDir(dir,noHistory){
    if(!dir)return;
    if(dir!=this.rootDir&&!dir.endsWith(":/")&&dir.endsWith("/"))dir=dir.substring(0,dir.length-1);
    if(dir.length<this.rootDir.length&&!this.rootDir.contains("[")&&!dir.contains("[")){
        isc.say("You cannot go up any further.");
        return;
    }
    if(!noHistory){
        if(!this.folderHistory){
            this.folderHistory=isc.FileBrowser._globalFolderHistory.duplicate();
        }
        if(this.currentDir)this.folderHistory.add(this.currentDir);
    }
    this.currentDir=dir;
    this._setPathLabelContents(this.currentDir);
    this._filterDirectoryListing(dir);
}
,isc.A._setPathLabelContents=function isc_FileBrowser__setPathLabelContents(dir){
    this.pathLabel._setPath(dir);
}
,isc.A._filterDirectoryListing=function isc_FileBrowser__filterDirectoryListing(dir){
    dir=dir||this.currentDir;
    var _this=this,
        criteria={fileFilter:this.fileFilter,parentID:dir,webrootOnly:this.webrootOnly};
    this.directoryListing.setCriteria(null);
    this.directoryListing.filterData(
            criteria,
            function(dsResponse,data,dsRequest){
                if(dsResponse.path!=_this.currentDir){
                    _this.currentDir=dsResponse.path;
                    _this._setPathLabelContents(dsResponse.path);
                }
                if(dsResponse.status!=isc.RPCResponse.STATUS_SUCCESS){
                    _this.upOneLevel();
                }
            },
            {promptStyle:"cursor"});
}
,isc.A.upOneLevel=function isc_FileBrowser_upOneLevel(){
    if(!this.currentDir){
        this.logWarn("upOneLevel() called without currentDir");
        return;
    }
    if(this.currentDir=="/"){
        this.logWarn("upOneLevel() called on rootDir");
        return;
    }
    var lastSlashIndex=this.currentDir.lastIndexOf("/");
    var newDir=this.currentDir.substring(0,lastSlashIndex);
    if(newDir==isc.emptyString)newDir="/";
    if(this.currentDir.endsWith(":/"))newDir="/";
    if(newDir.endsWith(":"))newDir+="/";
    this.setDir(newDir);
}
,isc.A.previousFolder=function isc_FileBrowser_previousFolder(){
    if(!this.folderHistory||this.folderHistory.length==0)return;
    this.setDir(this.folderHistory.pop(),true);
}
,isc.A.refresh=function isc_FileBrowser_refresh(){
    if(this.directoryListing.data)this.directoryListing.data.invalidateCache();
    this.setDir(this.currentDir);
}
,isc.A.createNewFolder=function isc_FileBrowser_createNewFolder(){
    this.directoryListing.startEditingNew({path:this.currentDir,isFolder:true});
}
,isc.A.confirmRemoveFile=function isc_FileBrowser_confirmRemoveFile(path){
    isc.confirm("Are you sure you want to recursively delete "+path+"?",
                "value ?"+this.getID()+".removeFile('"+path+"'):false");
}
,isc.A.removeFile=function isc_FileBrowser_removeFile(path){
    this.directoryListing.removeData({path:path});
}
,isc.A._updateGlobalFolderHistory=function isc_FileBrowser__updateGlobalFolderHistory(){
    if(this.folderHistory!=null){
        isc.FileBrowser._globalFolderHistory=this.folderHistory;
    }
    if(!isc.FileBrowser._globalFolderHistory.isEmpty()&&
        isc.FileBrowser._globalFolderHistory.last()!=this.currentDir)
    {
        isc.FileBrowser._globalFolderHistory.push(this.currentDir);
    }
}
,isc.A.closeClick=function isc_FileBrowser_closeClick(){
    this._updateGlobalFolderHistory();
    return this.Super("closeClick",arguments);
}
);
isc.B._maxIndex=isc.C+19;

isc.FileBrowser.registerStringMethods({
    fileSelected:"fileName"
});
isc.defineClass("SaveFileDialog","FileBrowser");
isc.A=isc.SaveFileDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Save File";
isc.A.actionButtonTitle="Save";
isc.B.push(isc.A.getFileName=function isc_SaveFileDialog_getFileName(fileName){
    return fileName;
}
,isc.A.fileSelected=function isc_SaveFileDialog_fileSelected(fileName){
    var fileName=this.getFileName(fileName);
    if(fileName===false||fileName==null)return;
    this.confirmAction(fileName);
}
,isc.A.confirmAction=function isc_SaveFileDialog_confirmAction(fileName){
    if(this.directoryListing.data.find("name",fileName)!=null){
        isc.confirm(this._makePath(this.currentDir,fileName)+" already exists.  Do you want to replace it?",
                    "value ? "+this.getID()+".saveFile('"+fileName+"'):false");
    }else{
        this.saveFile(fileName);
    }
}
,isc.A.getFileContents=function isc_SaveFileDialog_getFileContents(fileName){
    return this.fileContents;
}
,isc.A.saveFile=function isc_SaveFileDialog_saveFile(fileName){
    this.fileName=fileName;
    this.fileContents=this.getFileContents(fileName);
    if(this.fileContents==null){
        this.logWarn("attempt to save with null fileContents");
        return;
    }
    isc.DMI.callBuiltin({
        methodName:"saveFile",
        arguments:[
            this._makePath(this.currentDir,fileName),
            this.fileContents
        ],
        callback:this.getID()+".saveFileCallback(rpcResponse)"
    });
}
,isc.A.saveFileCallback=function isc_SaveFileDialog_saveFileCallback(rpcResponse){
    delete this.fileContents;
    this.saveComplete(this.fileName);
}
,isc.A.saveComplete=function isc_SaveFileDialog_saveComplete(fileName){
    isc.say("File saved.",this.getID()+".hide()");
}
,isc.A.show=function isc_SaveFileDialog_show(fileContents,fileName){
    if(fileContents!=null)this.fileContents=fileContents;
    if(fileName!=null)this.setFileName(fileName);
    this.Super("show",arguments);
    this.actionForm.delayCall("focusInItem",["fileName"]);
}
);
isc.B._maxIndex=isc.C+8;

isc.defineClass("LoadFileDialog","FileBrowser");
isc.A=isc.LoadFileDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Load File";
isc.A.actionButtonTitle="Load";
isc.B.push(isc.A.fileSelected=function isc_LoadFileDialog_fileSelected(fileName){
    if(fileName==null)return;
    this.loadFile(fileName);
}
,isc.A.loadFile=function isc_LoadFileDialog_loadFile(fileName){
    this.fileName=fileName;
    isc.DMI.callBuiltin({
        methodName:"loadFile",
        arguments:[
            this._makePath(this.currentDir,fileName)
        ],
        callback:this.getID()+".loadFileCallback(data)"
    });
}
,isc.A.loadFileCallback=function isc_LoadFileDialog_loadFileCallback(data){
    this.fireCallback("fileLoaded","fileContents,fileName",[data,this.fileName]);
}
);
isc.B._maxIndex=isc.C+3;

isc.LoadFileDialog.registerStringMethods({
    fileLoaded:"fileContents,fileName"
});
isc.ClassFactory.defineClass("FileSource");
isc.A=isc.FileSource.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.dataSource="Filesystem";
isc.A.loadFileProperties={
        operationId:"loadFile"
    };
isc.A.nameField="name";
isc.A.contentsField="contents";
isc.A.defaultPath="";
isc.A.webrootOnly=true;
isc.A.saveWindowDefaults={
        _constructor:"SaveFileDialog",
        saveFile:function(fileName){
            this.creator.saveFileUIReply({
                id:this._makePath(this.currentDir,fileName),
                name:fileName
            });
        },
        hide:function(){
            this.Super("hide",arguments);
            delete this.fileContents;
            delete this._saveFileCallback;
        }
    };
isc.A.loadWindowDefaults={
        _constructor:"LoadFileDialog",
        loadFile:function(fileName){
            this.creator.loadFileUIReply(this._makePath(this.currentDir,fileName),fileName);
        }
    };
isc.B.push(isc.A.getDataSource=function isc_FileSource_getDataSource(){
        if(this.dataSource&&!isc.isA.DataSource(this.dataSource)){
            this.dataSource=isc.DS.getDataSource(this.dataSource);
        }
        return this.dataSource;
    }
,isc.A.getIdField=function isc_FileSource_getIdField(){
        if(!this.idField){
            this.idField=this.getDataSource().getPrimaryKeyFieldName();
        }
        return this.idField;
    }
,isc.A.showSaveFileUI=function isc_FileSource_showSaveFileUI(contents,callback){
        if(!this.saveWindow){
            this.saveWindow=this.createAutoChild("saveWindow",{
                initialDir:this.defaultPath,
                directoryListingProperties:{
                    dataSource:this.getDataSource()
                }
            });
        }
        this.saveWindow.fileContents=contents;
        this.saveWindow._saveFileCallback=callback;
        this.saveWindow.show();
    }
,isc.A.saveFileUIReply=function isc_FileSource_saveFileUIReply(record){
        if(this.saveWindow.fileContents){
            var self=this;
            this.saveFile(record.id,record.name,this.saveWindow.fileContents,function(dsResponse,data,dsRequest){
                if(!data)data=dsResponse.data=record;
                self.fireCallback(self.saveWindow._saveFileCallback,"dsResponse,data,dsRequest",[dsResponse,data,dsRequest]);
                if(self.saveWindow)self.saveWindow.hide();
            });
        }else{
            this.fireCallback(this.saveWindow._saveFileCallback,"dsResponse,data,dsRequest",[null,record,null]);
            if(this.saveWindow)this.saveWindow.hide();
        }
    }
,isc.A._normalizeData=function isc_FileSource__normalizeData(data){
        var record=isc.isAn.Array(data)?data[0]:data;
        if(!record)return data;
        var normalizedRecord={
            id:record[this.getIdField()],
            name:record[this.nameField],
            contents:record[this.contentsField]
        }
        if(record.variablePath)normalizedRecord.id=record.variablePath;
        return isc.isAn.Array(data)?[normalizedRecord]:normalizedRecord;
    }
,isc.A.saveFile=function isc_FileSource_saveFile(id,name,contents,callback,requestProperties){
        var record={};
        record[this.getIdField()]=id;
        record[this.nameField]=name;
        record[this.contentsField]=contents;
        var self=this;
        if(id){
            this.getDataSource().updateData(record,function(dsResponse,data,dsRequest){
                data=dsResponse.data=self._normalizeData(data);
                self.fireCallback(
                    callback,
                    "dsResponse,data,dsRequest",
                    [dsResponse,data,dsRequest]
                );
            },requestProperties);
        }else{
            this.getDataSoruce().addData(record,function(dsResponse,data,dsRequest){
                data=dsResponse.data=self._normalizeData(data);
                self.fireCallback(
                    callback,
                    "dsResponse,data,dsRequest",
                    [dsResponse,data,dsRequest]
                );
            },requestProperties);
        }
    }
,isc.A.showLoadFileUI=function isc_FileSource_showLoadFileUI(callback){
        if(!this.loadWindow){
            this.loadWindow=this.createAutoChild("loadWindow",{
                initialDir:this.defaultPath,
                webrootOnly:this.webrootOnly,
                directoryListingProperties:{
                    dataSource:this.getDataSource()
                }
            });
        }
        this._loadFileCallback=callback;
        this.loadWindow.show();
    }
,isc.A.loadFileUIReply=function isc_FileSource_loadFileUIReply(id,name){
        var self=this;
        this.loadFile(id,function(dsResponse,data,dsRequest){
            self.fireCallback(
                self._loadFileCallback,
                "dsResponse,data,dsRequest",
                [dsResponse,data,dsRequest]
            );
            delete self._loadFileCallback;
            if(self.loadWindow)self.loadWindow.hide();
        });
    }
,isc.A.loadFile=function isc_FileSource_loadFile(id,callback,requestProperties){
        if(!id){
            this.logWarn("Tried to loadFile without an ID");
            return;
        }
        var record={};
        record[this.getIdField()]=id;
        var self=this;
        this.getDataSource().fetchData(record,function(dsResponse,data,dsRequest){
            dsResponse.data=data=self._normalizeData(data);
            self.fireCallback(
                callback,
                "dsResponse,data,dsRequest",
                [dsResponse,data,dsRequest]
            );
        },isc.addProperties({},this.loadFileProperties,requestProperties));
    }
,isc.A.removeFile=function isc_FileSource_removeFile(id,callback){
        if(!id){
            this.logWarn("Tried to removeFile without an ID");
            return;
        }
        var record={};
        record[this.getIdField()]=id;
        var self=this;
        this.getDataSource().removeData(record,function(dsResponse,data,dsRequest){
            dsResponse.data=data=self._normalizeData(data);
            self.fireCallback(
                callback,
                "dsResponse,data,dsRequest",
                [dsResponse,data,dsRequest]
            );
        });
    }
);
isc.B._maxIndex=isc.C+10;

isc.ClassFactory.defineClass("ProjectFileDialog","Window");
isc.A=isc.ProjectFileDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.dataSource=null;
isc.A.autoCenter=true;
isc.A.isModal=true;
isc.A.canDragResize=true;
isc.A.width=720;
isc.A.height=480;
isc.A.directoryListingConstructor="ListGrid";
isc.A.directoryListingDefaults={
        canEdit:true,
        loadingDataMessage:"&nbsp;",
        emptyMessage:"&nbsp;",
        showHeader:false,
        selectionStyle:"single",
        canMultiSort:true,
        initialSort:[{
            property:"fileName",
            direction:"ascending"
        }],
        editorExit:function(editCompletionEvent,record,newValue,rowNum,colNum){
            if(editCompletionEvent!="escape"){
                this.creator.renameFile(record,newValue);
            }
        },
        recordClick:function(viewer,record,recordNum){
            record._canEdit=false;
            this.creator.actionForm.setValue("fileName",record.fileName);
            if(record==this._lastRecord){
                delete record._canEdit;
                if(this.canEdit)this.startEditing(recordNum,1);
                return;
            }
            this._lastRecord=record;
            return false;
        },
        recordDoubleClick:function(viewer,record){
            this.creator.fileSelected(record);
            return false;
        },
        rowContextClick:function(record){
            this._contextRecord=record;
            if(!this._recordMenu){
                this._recordMenu=this.getMenuConstructor().create({
                    grid:this,
                    deleteFile:function(){
                        this.grid.creator.confirmRemoveFile(this.grid._contextRecord);
                    },
                    data:[{
                        title:"Delete file",
                        click:"menu.deleteFile()"
                    }]
                });
            }
            this._recordMenu.showContextMenu();
            return false;
        },
        fields:[{
            name:"fileName",
            width:"*"
        }]
    };
isc.A.actionFormConstructor="DynamicForm";
isc.A.actionFormDefaults={
        overflow:"hidden",
        numCols:3,
        height:45,
        padding:5,
        colWidths:[100,"*",120],
        browserSpellCheck:false,
        process:function(){
            if(this.validate()){
                this.creator.fileSelected({
                    fileName:this.getValue("fileName"),
                    fileType:this.creator.fileType,
                    fileFormat:this.creator.fileFormat,
                    fileAutoSaved:false
                });
            }
        },
        fields:[{
            name:"fileName",
            type:"text",
            width:"*",
            title:"File name",
            keyPress:function(item,form,keyName,characterValue){
                if(keyName=='Enter'){
                    form.process();
                    return false;
                }
            },
            validators:[{
                type:"lengthRange",
                max:255,
                min:1
            },{
                type:"regexp",
                expression:"([^:\\*\\?<>\\|\\/\"'])+",
                errorMessage:"Can't contain \\/:*?\"'<>|"
            }]
        },{
            name:"button",
            type:"button",
            startRow:false,
            click:function(form,item){
                form.process();
            }
        }]
    };
isc.A.noScreensMessage=[
        "<div style=\"padding: 4em\">If you have screens created by previous versions of Visual Builder ",
        "on the server filesystem, you will need to rename them from ",
        "screenName.xml (or screenName.screen.xml) to screenName.ui.xml before they will appear here. ",
        "In other words, the files now need to end with '<b>.ui.xml</b>' rather than ",
        "just '.xml' or '.screen.xml'</div>"
    ].join('');
isc.A.noFilesMessage="No files found.";
isc.B.push(isc.A.getDataSource=function isc_ProjectFileDialog_getDataSource(){
        if(this.dataSource&&!isc.isA.DataSource(this.dataSource)){
            this.dataSource=isc.DS.getDataSource(this.dataSource);
        }
        return this.dataSource;
    }
,isc.A.initWidget=function isc_ProjectFileDialog_initWidget(){
        this.Super("initWidget",arguments);
        this.directoryListing=this.createAutoChild("directoryListing");
        this.actionForm=this.createAutoChild("actionForm");
    }
,isc.A.draw=function isc_ProjectFileDialog_draw(){
        this.Super("draw",arguments);
        if(!this._pfDialogInitalized){
            this._pfDialogInitialized=true;
            this.addItem(this.directoryListing);
            this.addItem(isc.LayoutSpacer.create({height:10}));
            this.addItem(this.actionForm);
            this.actionForm.getField("button").setTitle(this.actionButtonTitle);
        }
    }
,isc.A.fileSelected=function isc_ProjectFileDialog_fileSelected(record){
    }
,isc.A.setFileName=function isc_ProjectFileDialog_setFileName(fileName){
        this.actionForm.setValue("fileName",fileName);
    }
,isc.A.confirmRemoveFile=function isc_ProjectFileDialog_confirmRemoveFile(record){
        var self=this;
        isc.confirm("Are you sure you want to delete "+record.fileName+"?",function(ok){
            if(ok)self.removeFile(record);
        });
    }
,isc.A.removeFile=function isc_ProjectFileDialog_removeFile(record){
        var self=this;
        this.getDataSource().removeFile(record,function(){
            self.refresh();
        });
    }
,isc.A.renameFile=function isc_ProjectFileDialog_renameFile(record,newFilename){
        var self=this;
        this.getDataSource().renameFile(record,{
            fileName:newFilename,
            fileType:record.fileType,
            fileFormat:record.fileFormat
        },function(){
            self.refresh();
        });
    }
,isc.A.refresh=function isc_ProjectFileDialog_refresh(){
        var self=this;
        this.directoryListing.emptyMessage=this.fileType=='ui'?this.noScreensMessage:this.noFilesMessage;
        this.getDataSource().listFiles({
            fileType:this.fileType,
            fileFormat:this.fileFormat
        },function(dsResponse,data){
            self.directoryListing.setData(data);
        });
    }
);
isc.B._maxIndex=isc.C+9;

isc.defineClass("ProjectFileSaveDialog","ProjectFileDialog");
isc.A=isc.ProjectFileSaveDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Save File";
isc.A.actionButtonTitle="Save";
isc.B.push(isc.A.fileSelected=function isc_ProjectFileSaveDialog_fileSelected(record){
        if(this.directoryListing.data.find("fileName",record.fileName)!=null){
            var self=this;
            isc.confirm(record.fileName+" already exists. Do you want to replace it?",function(ok){
                if(ok)self.saveFile(record);
            });
        }else{
            this.saveFile(record);
        }
    }
,isc.A.saveFile=function isc_ProjectFileSaveDialog_saveFile(record){
        if(!record.fileName||record.fileName==""){
            isc.say("Filename must not be empty");
        }else{
            var self=this;
            this.getDataSource().saveFile(record,this.fileContents,function(dsResponse,data,dsRequest){
                self.fireCallback(self.saveFileCallback,"dsResponse,data,dsRequest",[dsResponse,data,dsRequest]);
                self.hide();
            });
        }
    }
,isc.A.showSaveFileUI=function isc_ProjectFileSaveDialog_showSaveFileUI(fileContents,fileName,callback){
        this.fileContents=fileContents;
        this.saveFileCallback=callback;
        this.show();
        this.refresh();
        this.setFileName(fileName);
        this.actionForm.delayCall("focusInItem",["fileName"]);
    }
);
isc.B._maxIndex=isc.C+3;

isc.defineClass("ProjectFileLoadDialog","ProjectFileDialog");
isc.A=isc.ProjectFileLoadDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.title="Load File";
isc.A.actionButtonTitle="Load";
isc.B.push(isc.A.fileSelected=function isc_ProjectFileLoadDialog_fileSelected(record){
        if(record==null)return;
        var self=this;
        this.setFileName(record.fileName);
        this.getDataSource().getFile(record,function(dsResponse,data,dsRequest){
            record.fileContents=data;
            if(dsResponse.data&&isc.isAn.Array(dsResponse.data)&&dsResponse.data.length>0&&dsResponse.data[0].fileContentsJS){
                record.fileContentsJS=dsResponse.data[0].fileContentsJS;
            }
            self.fireCallback(self.loadFileCallback,"dsResponse,data,dsRequest",[dsResponse,record,dsRequest]);
            self.hide();
        },{
            operationId:this.useXmlToJs?"xmlToJs":null
        });
    }
,isc.A.showLoadFileUI=function isc_ProjectFileLoadDialog_showLoadFileUI(callback){
        this.show();
        this.loadFileCallback=callback;
        this.setFileName("");
        this.refresh();
    }
);
isc.B._maxIndex=isc.C+2;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('FileBrowser');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._FileBrowser_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('FileBrowser module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'FileBrowser', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'FileBrowser'.");}

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

