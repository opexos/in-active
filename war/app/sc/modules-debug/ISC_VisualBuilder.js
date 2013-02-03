
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

if(window.isc&&window.isc.module_Core&&!window.isc.module_VisualBuilder){isc.module_VisualBuilder=1;isc._moduleStart=isc._VisualBuilder_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'VisualBuilder load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
if(isc.Log && isc.Log.logDebug)isc.Log.logDebug(isc._pTM.message,'loadTime');
else if(isc._preLog)isc._preLog[isc._preLog.length]=isc._pTM;
else isc._preLog=[isc._pTM]}isc.definingFramework=true;isc.ClassFactory.defineClass("MockupContainer","Canvas");
isc.A=isc.MockupContainer.getPrototype();
isc.A.autoMaskChildren=true;
isc.A.editProxyProperties={
        childrenSnapToGrid:true,
        childrenSnapAlign:true,
        persistCoordinates:true
    }
;

isc.ClassFactory.defineClass("Project");
isc.A=isc.Project;
isc.A.AUTOSAVE="VB_AUTOSAVE_PROJECT";
isc.A.AUTOSAVE_MOCKUPS="MOCKUPS_AUTOSAVE_PROJECT";
isc.A.AUTOSAVE_SINGLE_SCREEN="VB_SINGLE_SCREEN"
;

isc.A=isc.Project.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.screensDefaults={
        _constructor:"Tree",
        openProperty:"_isOpen_",
        parentProperty:"_parent_"
    };
isc.A.saveScreenDialogConstructor='ProjectFileSaveDialog';
isc.A.saveScreenDialogDefaults={
        title:'Save Screen',
        actionButtonTitle:'Save Screen',
        fileType:'ui',
        fileFormat:'xml'
    };
isc.A.autoSavePause=500;
isc.A.saveProjectDialogConstructor='ProjectFileSaveDialog';
isc.A.saveProjectDialogDefaults={
        title:'Save Project',
        actionButtonTitle:'Save Project',
        fileType:'proj',
        fileFormat:'xml'
    };
isc.B.push(isc.A.setFileName=function isc_Project_setFileName(fileName){
        this.fileName=fileName;
    }
,isc.A.setName=function isc_Project_setName(name){
        this.name=name;
    }
,isc.A.getID=function isc_Project_getID(){
        return this.name;
    }
,isc.A.addDatasource=function isc_Project_addDatasource(dsName,dsType){
        var current=this.datasources.findIndex("dsName",dsName);
        if(current==-1){
            this.datasources.addAt({
                dsName:dsName,
                dsType:dsType
            },0);
            this.autoSaveSoon();
        }
    }
,isc.A.removeDatasource=function isc_Project_removeDatasource(dsName){
        var current=this.datasources.findIndex("dsName",dsName);
        if(current>=0){
            this.datasources.removeAt(current);
            this.autoSaveSoon();
        }
    }
,isc.A.setCurrentScreenId=function isc_Project_setCurrentScreenId(screenId){
        if(this.currentScreenId!==screenId){
            this.currentScreenId=screenId;
            this.autoSaveSoon();
        }
    }
,isc.A.setCurrentScreenFileName=function isc_Project_setCurrentScreenFileName(fileName){
        if(this.currentScreenFileName!==fileName){
            this.currentScreenFileName=fileName;
            this.autoSaveSoon();
        }
    }
,isc.A.init=function isc_Project_init(){
        this.Super("init",arguments);
        if(!this.datasources)this.datasources=[];
        this.addAutoChild("screens");
        this.observe(this.screens,"dataChanged","observer.autoSaveSoon();");
    }
,isc.A.destroy=function isc_Project_destroy(){
        this.ignore(this.screens,"dataChanged");
        this.Super("destroy",arguments);
    }
,isc.A.isEmpty=function isc_Project_isEmpty(){
       return this.screens.getLength()==0;
    }
,isc.A.addScreen=function isc_Project_addScreen(parent,fileName,title,contents,clobberExistingContents){
        if(!parent)parent=this.screens.getRoot();
        if(!fileName)fileName="";
        var currentScreen;
        if(this.builder.singleScreenMode){
            this.screens.removeList(this.screens.getAllNodes());
        }else{
            currentScreen=this.findScreen(fileName);
            if(currentScreen){
                if(fileName){
                    if(!clobberExistingContents){
                        return currentScreen;
                    }
                }else{
                    if(!this.builder||!this.builder.singleScreenMode){
                        currentScreen=null;
                    }
                }
            }
        }
        var screen=this.screens.add({
            fileName:fileName,
            title:title,
            contents:contents,
            isFolder:false
        },parent);
        if(currentScreen)this.removeScreen(currentScreen);
        this.autoSaveSoon();
        return screen;
    }
,isc.A.removeScreen=function isc_Project_removeScreen(screen){
        if(screen)this.screens.remove(screen);
    }
,isc.A.addGroup=function isc_Project_addGroup(parent,title){
        if(!parent)parent=this.screens.getRoot();
        return this.screens.add({
            title:title,
            isFolder:true
        },parent);
    }
,isc.A.removeGroup=function isc_Project_removeGroup(group){
        if(group)this.screens.remove(group);
    }
,isc.A.findScreen=function isc_Project_findScreen(fileName){
        if(!fileName)fileName="";
        return this.screens.find({
            fileName:fileName,
            isFolder:false
        });
    }
,isc.A.firstScreen=function isc_Project_firstScreen(mockupMode){
        var criteria={isFolder:false};
        if(mockupMode!=null)criteria.mockupMode=mockupMode;
        return this.screens.find(criteria);
    }
,isc.A.untitledScreen=function isc_Project_untitledScreen(){
        return this.findScreen(null);
    }
,isc.A.setScreenProperties=function isc_Project_setScreenProperties(screen,properties){
        isc.addProperties(screen,properties);
        this.autoSaveSoon(!screen.fileName);
        return screen;
    }
,isc.A.setScreenDirty=function isc_Project_setScreenDirty(screen,isDirty){
        var dirty=isDirty?new Date():null;
        if(dirty)this.screenDirty=dirty;
        this.setScreenProperties(screen,{
            dirty:dirty
        });
        this.autoSaveScreenSoon(screen);
    }
,isc.A.updateReifyPreviewSoon=function isc_Project_updateReifyPreviewSoon(){
        var builder=this.builder;
        if(builder&&builder.reifyWindow)builder.updateReifyPreviewSoon();
    }
,isc.A._launchGoToBuilder=function isc_Project__launchGoToBuilder(){
        if(this.builder)this.builder._launchGoToBuilder();
    }
,isc.A._createConfirmDialogButton=function isc_Project__createConfirmDialogButton(name,title){
        return{
            title:title,width:1,
            overflow:"visible",
            click:function(){
                var dialog=this.topElement;
                dialog.clear();
                dialog.returnValue(name);
            }
        };
    }
,isc.A._saveScreenContentsConfirmOverwrite=function isc_Project__saveScreenContentsConfirmOverwrite(screen){
        var project=this;
        isc.confirm("You are editing an older version of this screen.  Do you want to "+
                    "overwrite the most recent version?",function(response){
                switch(response){
                case"overwrite":
                    delete screen.oldVersionLoaded;
                    project.saveScreenContents(screen);
                    break;
                case"saveAs":
                    project.builder.saveScreenAs(screen,function(){
                        delete screen.contents
                        delete screen.oldVersionLoaded;
                    });
                    break;
                }
            },{
                buttons:[
                    this._createConfirmDialogButton("overwrite","Yes, overwrite"),
                    this._createConfirmDialogButton("saveAs","Save as a new screen"),
                    isc.Dialog.CANCEL
                ]
            }
        );
    }
,isc.A.saveScreenContents=function isc_Project_saveScreenContents(screen,autoSaved,callback){
        if(!screen)return;
        if(screen.oldVersionLoaded){
            return this._saveScreenContentsConfirmOverwrite(screen);
        }
        var self=this,
            dirty=screen.dirty;
        if(screen.fileName){
            this.screenDataSource.saveFile({
                fileName:screen.fileName,
                fileType:'ui',
                fileFormat:'xml',
                fileAutoSaved:!!autoSaved
            },screen.contents,function(){
                if(dirty==screen.dirty)self.setScreenDirty(screen,false);
                self.fireCallback(callback,"screen",[screen]);
            });
        }else{
            if(!this.saveScreenDialog){
                this.saveScreenDialog=this.createAutoChild('saveScreenDialog',{
                    dataSource:this.screenDataSource
                });
            }
            this.saveScreenDialog.showSaveFileUI(screen.contents,null,
                                                 function(dsResponse,data,dsRequest){
                if(dirty==screen.dirty)self.setScreenDirty(screen,false);
                if(data.fileName){
                    var existingScreen=self.findScreen(data.fileName);
                    if(existingScreen)self.removeScreen(existingScreen);
                }
                self.setScreenProperties(screen,{
                    fileName:data.fileName,
                    title:data.fileName
                });
                self.fireCallback(callback,"screen",[screen]);
            });
        }
    }
,isc.A.saveScreenAs=function isc_Project_saveScreenAs(screen,callback){
        var self=this;
        if(!this.saveScreenDialog){
            this.saveScreenDialog=this.createAutoChild('saveScreenDialog',{
                dataSource:this.screenDataSource
            });
        }
        this.saveScreenDialog.showSaveFileUI(screen.contents,null,
                                             function(dsResponse,data,dsRequest){
            var newScreen=self.addScreen(self.screens.getParent(screen),data.fileName,
                                           data.fileName,screen.contents,true);
            self.builder.setCurrentScreen(newScreen);
            self.fireCallback(callback,"screen",[newScreen]);
        });
    }
,isc.A.fetchScreenContents=function isc_Project_fetchScreenContents(screen,callback,version){
        if(screen){
            if(screen.contents||!screen.fileName){
                this.fireCallback(callback,"contents",[screen.contents]);
            }else{
                var self=this,
                    fileSpec={
                        fileName:screen.fileName,
                        fileType:'ui',
                        fileFormat:'xml'
                    },
                    dsCallback=function(dsResponse,data,dsRequest){
                        if(dsResponse.status<0){
                            self.fireCallback(callback,"contents",[null]);
                        }else{
                            screen.contents=data;
                            self.setScreenDirty(screen,false);
                            self.fireCallback(callback,"contents",[data]);
                        }
                    };
                if(version!=null){
                    this.screenDataSource.getFileVersion(fileSpec,version,dsCallback);
                }else{
                    this.screenDataSource.getFile(fileSpec,dsCallback);
                }
            }
        }else{
            this.fireCallback(callback,"contents",[null]);
        }
    }
,isc.A.getCurrentScreen=function isc_Project_getCurrentScreen(){
        var builder=this.builder;
        if(!builder)return;
        return builder.currentScreen;
    }
,isc.A.xmlSerialize=function isc_Project_xmlSerialize(){
        var currentScreen=this.getCurrentScreen();
        if(currentScreen)currentScreen.isCurrent=true;
        var cleanProject={
            screens:this.createAutoChild("screens"),
            currentScreenFileName:this.currentScreenFileName,
            datasources:this.datasources
        };
        cleanProject.screens.setRoot(
            this.screens.getCleanNodeData(this.screens.getRoot(),true,true,true)
        );
        cleanProject.screens.getAllNodes().map(function(node){
            if(!node.dirty||node.fileName){
                delete node.contents;
            }
            delete node.dirty;
            delete node.name;
            delete node.id;
            delete node.parentId;
            if(node.children&&node.children.length==0)delete node.children;
        });
        var xml=isc.DS.get("Project").xmlSerialize(cleanProject);
        if(currentScreen)delete currentScreen.isCurrent;
        cleanProject.screens.destroy();
        return xml;
    }
,isc.A.autoSaveSoon=function isc_Project_autoSaveSoon(updateReify){
        this.fireOnPause("autoSave",function(){
            this.autoSave(updateReify!=false?"updateReifyPreviewSoon":null);
        },this.autoSavePause);
    }
,isc.A.autoSave=function isc_Project_autoSave(callback){
        if(this.fileName){
            this.save(callback,{showPrompt:false},true);
        }else{
            var key=isc.Project.AUTOSAVE;
            if(this.builder){
                this.builder.cacheCurrentScreenContents();
                if(this.builder.singleScreenMode)key=isc.Project.AUTOSAVE_SINGLE_SCREEN;
                if(this.builder.mockupMode)key=isc.Project.AUTOSAVE_MOCKUPS;
            }
            isc.Offline.put(key,this.xmlSerialize());
            this.screenDirty=null;
            this.fireCallback(callback);
        }
    }
,isc.A.save=function isc_Project_save(callback,requestProperties,autoSaved){
        if(this.fileName){
            if(this.builder)this.builder.cacheCurrentScreenContents();
            var self=this,
                screenDirty=this.screenDirty;
            this.projectDataSource.saveFile({
                fileName:this.fileName,
                fileType:'proj',
                fileFormat:'xml',
                fileAutoSaved:!!autoSaved
            },this.xmlSerialize(),function(){
                if(screenDirty==self.screenDirty)self.screenDirty=null;
                self.fireCallback(callback);
            },requestProperties);
        }else{
            this.saveAs(callback);
        }
    }
,isc.A.autoSaveScreenSoon=function isc_Project_autoSaveScreenSoon(screen){
        if(!screen.dirty||!screen.fileName||screen.oldVersionLoaded)return;
        this.fireOnPause("autoSaveScreen"+screen.fileName,function(){
            var builder=this.builder;
            if(builder.currentScreen==screen){
                screen.contents=builder.getUpdatedSource();
            }
            this.saveScreenContents(screen,true,"updateReifyPreviewSoon");
        },this.autoSavePause);
        this.cancelActionOnPause("autoSave");
    }
,isc.A.exportProjectWindow=function isc_Project_exportProjectWindow(screen,vb){
        var vb=vb,
            project=vb.project,
            title="Export Project";
        var exportProjectDialog=isc.Window.create({
            title:title,
            width:450,
            height:350,
            isModal:true,
            showModalMask:true,
            autoCenter:true,
            padding:8,
            items:[
                isc.DynamicForm.create({
                    isGroup:false,
                    width:"100%",
                    numCols:3,
                    items:[
                        {title:"Project Type",name:"projectType",type:"select",
                            redrawOnChange:true,
                            defaultValue:"smartclient",
                            valueMap:{
                                "smartclient":"SmartClient",
                                "smartgwt":"Smart GWT"
                            },
                            changed:function(form,item,value){
                                if(value=="smartclient"){
                                    form.setValue("includeJSP",true);
                                    form.setValue("datasourcesDir","shared/ds");
                                }else{
                                    form.setValue("includeJSP",false);
                                    form.setValue("datasourcesDir","ds");
                                }
                            }
                        },
                        {title:"DataSources directory",name:"datasourcesDir",type:"text",
                            defaultValue:"shared/ds"},
                        {title:"Include Test Data?",name:"includeTestData",type:"checkbox",height:25,value:true},
                        {title:"Screens directory",name:"uiDir",type:"text",
                            defaultValue:"shared/ui"},
                        {title:"Project to export",name:"projectToExport",type:"text",hint:".proj.xml",
                         defaultValue:(!project.name)?"":project.name,required:true},
                        {title:"Include JSP launch file?",name:"includeJSP",type:"checkbox",height:25,
                         redrawOnChange:true,value:true},
                        {title:"Path to the JSP launch file",name:"jspFilePath",type:"text",
                         showIf:"form.getValue('includeJSP') == true",required:true,hint:".jsp",
                         defaultValue:(!project.name)?"":project.name},
                        {title:"Include Project file?",name:"includeProjectFile",type:"checkbox",height:25,
                         redrawOnChange:true,value:true},
                        {title:"Path to the Project file",name:"projectDir",type:"text",
                         showIf:"form.getValue('includeProjectFile') == true",hint:"/"},
                        {title:"Project Archive Name",name:"projectArchiveName",type:"text",hint:".proj.zip",
                         defaultValue:(!project.name)?"":project.name,required:true},
                        {type:"button",title:"Export",width:100,
                         click:function(form,item){
                             if(!form.validate())return;
                             var includeProjFile=form.getValue('includeProjectFile'),
                                 includeJspFile=form.getValue('includeJSP'),
                                 includeTestData=form.getValue('includeTestData'),
                                 projArchiveName=form.getValue('projectArchiveName'),
                                 projectToExport=form.getValue('projectToExport'),
                                 pathToProj=form.getValue('projectDir')||"",
                                 userFiles={},
                                 jspFilePath={},
                                 projectDir="";
                             if(projectToExport.toLowerCase().indexOf(".proj.xml")!=-1){
                                 projectToExport=projectToExport.substring(0,projectToExport.indexOf(".proj.xml"));
                             }
                             if(projArchiveName.toLowerCase().indexOf(".proj.zip")==-1){
                                 projArchiveName=projArchiveName+".proj.zip";
                             }
                             if(includeJspFile&&screen){
                                 var jsp=form.getValue('jspFilePath');
                                 if(jsp.toLowerCase().indexOf(".jsp")==-1)jsp=jsp+".jsp";
                                 jspFilePath={
                                     path:jsp,
                                     content:vb._exportScreenAsJSP(screen)
                                 }
                             }
                             if(includeProjFile&&pathToProj.trim().length>0){
                                 if(pathToProj.substring(pathToProj.length-1,pathToProj.length)!="/"){
                                     pathToProj=pathToProj+"/";
                                 }
                                 projectDir=pathToProj;
                             }
                             var settings={
                                 projectType:form.getValue('projectType'),
                                 datasourcesDir:form.getValue('datasourcesDir'),
                                 includeTestData:includeTestData,
                                 uiDir:form.getValue('uiDir'),
                                 includeJSP:includeJspFile,
                                 jspFilePath:jspFilePath,
                                 includeProjectFile:includeProjFile,
                                 projectDir:projectDir,
                                 projectArchiveName:projArchiveName,
                                 userFiles:userFiles
                             };
                             vb.exportProject(projectToExport,settings);
                         }
                        }
                    ]
                })
            ]
        });
        exportProjectDialog.show();
    }
,isc.A.saveAs=function isc_Project_saveAs(callback){
        if(this.builder)this.builder.cacheCurrentScreenContents();
        if(!this.saveProjectDialog){
            this.saveProjectDialog=this.createAutoChild("saveProjectDialog",{
                dataSource:this.projectDataSource
            });
        }
        var self=this;
        var screenDirty=this.screenDirty;
        this.saveProjectDialog.showSaveFileUI(this.xmlSerialize(),null,function(dsResponse,data,dsRequest){
            isc.Offline.remove(isc.Project.AUTOSAVE);
            if(screenDirty==self.screenDirty)self.screenDirty=null;
            self.setFileName(data.fileName);
            self.setName(data.fileName);
            self.fireCallback(callback);
        });
    }
,isc.A.saveGoToBuilderScreen=function isc_Project_saveGoToBuilderScreen(desiredScreenName,xml,callback){
        var advancedCriteria={_constructor:"AdvancedCriteria",operator:"and",criteria:[
            {fieldName:"fileName",operator:"startsWith",value:desiredScreenName},
            {fieldName:"fileType",operator:"equals",value:"ui"},
            {fieldName:"fileFormat",operator:"equals",value:"xml"}
        ]};
        var screenDataSource=this.builder.screenDataSource;
        screenDataSource.listFiles(advancedCriteria,function(rpcResponse){
            var saltId,
                fileNames=rpcResponse.data,
                screenName=desiredScreenName;
            for(var saltId=2;fileNames.find("fileName",screenName);saltId++){
                screenName=desiredScreenName+" ("+saltId+")";
            }
            screenDataSource.saveFile({
                fileName:screenName,fileType:'ui',fileFormat:'xml'
            },xml,callback);
        });
    }
);
isc.B._maxIndex=isc.C+35;

isc.ClassFactory.defineClass("VisualBuilder","VLayout");
isc.A=isc.VisualBuilder;
isc.A.titleEditEvent="doubleClick"
;

isc.A=isc.VisualBuilder.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.hostedMode=false;
isc.A.saveFileBuiltinIsEnabled=false;
isc.A.loadFileBuiltinIsEnabled=false;
isc.A.filesystemDataSourceEnabled=false;
isc.A.skin="Graphite";
isc.A.defaultApplicationMode="edit";
isc.A.openFullBuilderSeparately=true;
isc.A.defaultComponentsURL="defaultComponents.xml";
isc.A.defaultMockupComponentsURL="defaultMockupComponents.xml";
isc.A.customComponentsURL="customComponents.xml";
isc.A.globalDependenciesURL="globalDependencies.xml";
isc.A.projectRunnerURL="projectRunner.jsp";
isc.A.canAddRootComponents=false;
isc.A.storageMode="dataSourceOnly";
isc.A.offlineStorageKey="VisualBuilder-savedSettings";
isc.A.settingsFile="vb.settings.xml";
isc.A.defaultSettingsURL="default.vb.settings.xml";
isc.A.defaultProjectURL="default.proj.xml";
isc.A._saveSettingsCallbacks=[];
isc.A.loadProjectDialogConstructor='ProjectFileLoadDialog';
isc.A.loadProjectDialogDefaults={
    title:'Load Project',
    actionButtonTitle:'Load Project',
    fileType:'proj',
    fileFormat:'xml',
    useXmlToJs:true
};
isc.A.recentProjectsCount=5;
isc.A._updateReifyPreviewDelay=5000;
isc.A._confirmReifyPreviewId="confirmReify";
isc.A._confirmOpenInBuilderId="confirmOpenInBuilder";
isc.A.jspFileSourceDefaults={
    _constructor:"FileSource",
    defaultPath:"[VBWORKSPACE]",
    webrootOnly:false,
    saveWindowProperties:{
        title:"Export JSP",
        actionButtonTitle:"Export JSP",
        webrootOnly:false,
        fileFilters:[{
            filterName:"JSP Files",
            filterExpressions:[/.*\.jsp$/i]
        }],
        directoryListingProperties:{
            canEdit:false
        },
        getFileName:function(fileName){
            if(fileName.toLowerCase().endsWith(".jsp")){
                return fileName;
            }else{
                return fileName+".jsp";
            }
        }
    }
};
isc.A.loadScreenDialogConstructor='ProjectFileLoadDialog';
isc.A.loadScreenDialogDefaults={
    title:'Load Screen',
    actionButtonTitle:'Load Screen',
    fileType:'ui',
    fileFormat:'xml'
};
isc.A.singleScreenMode=false;
isc.A.singleScreenModeProjectFileName="vb.singleScreen";
isc.A.vertical=true;
isc.A.sControlIsomorphicDir="http://www.isomorphic.com/isomorphic/";
isc.A.sControlSkin="SmartClient";
isc.A.workspacePath="[VBWORKSPACE]";
isc.A.workspaceURL="workspace/";
isc.A.basePathRelWorkspace="..";
isc.A.webRootRelWorkspace="../../..";
isc.A.useFieldMapper=false;
isc.A.helpPaneProperties={
    headerTitle:"About Visual Builder",
    contentsURL:"visualBuilderHelp.html"
};
isc.A.canEditExpressions=true;
isc.A.typeCount={};
isc.A.disableDirtyTracking=0;
isc.A.workspaceDefaults={
    _constructor:"TLayout",
    vertical:false,
    autoDraw:false,
    backgroundColor:isc.nativeSkin?null:"black"
};
isc.A.leftStackDefaults={
    _constructor:"TSectionStack",
    autoDraw:false,
    width:320,
    showResizeBar:true,
    visibilityMode:"multiple"
};
isc.A.middleStackDefaults={
    _constructor:"TSectionStack",
    autoDraw:false,
    showResizeBar:true,
    resizeBarTarget:"next",
    visibilityMode:"multiple",
    styleName:"pageBackground"
};
isc.A.runMenuControlDefaults={
    _constructor:"RibbonBar",
    height:"100%",width:1,
    overflow:"visible",
    autoDraw:false
};
isc.A.modeSwitcherDefaults={
    _constructor:"TDynamicForm",
    autoDraw:false,
    autoParent:"middleStack",
    numCols:7,
    initWidget:function(){
        this.Super("initWidget",arguments);
        this.setValue("skin",this.creator.skin);
        if(!this.creator.hostedMode)this.showItem("useToolSkin");
    },
    setNativeSkin:function(value){
        this.creator.doAutoSave(this.getID()+".doSetNativeSkin('"+value+"')");
    },
    doSetNativeSkin:function(value){
        var qParams=isc.clone(isc.params);
        qParams.useNativeSkin=value=="useNativeSkin"?1:0;
        var url=location.href;
        if(url.contains("?"))url=url.substring(0,url.indexOf("?"));
        url+="?";
        for(var key in qParams){
            url+=encodeURIComponent(key)+"="+encodeURIComponent(qParams[key])+"&";
        }
        url=url.substring(0,url.length-1);
        isc.Cookie.set(this.creator.loadAutoSaveCookie,"true");
        location.replace(url);
    },
    setSkin:function(value){
        this.creator.doAutoSave(this.getID()+".doSetSkin('"+value+"')");
    },
    doSetSkin:function(value){
        var qParams=isc.clone(isc.params);
        qParams.skin=value;
        var url=location.href;
        if(url.contains("?"))url=url.substring(0,url.indexOf("?"));
        url+="?";
        for(var key in qParams){
            url+=encodeURIComponent(key)+"="+encodeURIComponent(qParams[key])+"&";
        }
        url=url.substring(0,url.length-1);
        isc.Cookie.set(this.creator.loadAutoSaveCookie,"true");
        location.replace(url);
    },
    setResolution:function(value){
        var s=value.split("x");
        if(s[1].endsWith(" [fit to browser]")){
            s[1]=s[1].split(" ")[0];
        }
        var width=parseInt(s[0].trim());
        var height=parseInt(s[1].trim());
        this.creator.middleStack.setWidth(width);
        this.creator.rootLiveObject.setHeight(height);
    },
    fields:[
        {
            name:"skin",editorType:"TSelectItem",
            width:100,
            titleAlign:"top",
            wrapTitle:false,
            valueMap:{
                Enterprise:"Enterprise",
                EnterpriseBlue:"Enterprise Blue",
                Graphite:"Graphite",
                Simplicity:"Simplicity",
                fleet:"Fleet",
                TreeFrog:"TreeFrog",
                SilverWave:"SilverWave",
                BlackOps:"Black Ops"
            },
            title:"Skin",
            change:"form.setSkin(value)"
        },
        {
            name:"useToolSkin",editorType:"TSelectItem",
            width:160,
            showTitle:false,
            visible:false,
            titleAlign:"top",
            valueMap:{
                useToolSkin:"Use high contrast tool skin",
                useNativeSkin:"Use app skin for tools "
            },
            defaultValue:isc.nativeSkin?"useNativeSkin":"useToolSkin",
            changed:"form.setNativeSkin(value)"
        },
        {
            name:"resolution",editorType:"TSelectItem",
            width:100,
            valueMap:[
                "1024x768",
                "1280x1024"
            ],
            title:"Resolution",
            change:"form.setResolution(value)"
        },
        {
            name:"switcher",showTitle:false,title:"Component mode",
            valueMap:["Live","Edit"],vertical:false,
            editorType:"TRadioGroupItem",
            wrapTitle:false,
            changed:function(form,item,value){
                var editingOn=(value=="Edit"),
                    builder=form.creator,
                    screen=builder.currentScreen,
                    mockupMode=builder.getScreenMockupMode(screen)
                ;
                if(editingOn&&mockupMode){
                    builder.withoutDirtyTracking(function(){
                        builder.projectComponents.destroyAll();
                    });
                    builder.setScreenContents(screen.contents,mockupMode);
                }else{
                    var components=builder.projectComponents.data;
                    for(var i=0;i<components.getLength();i++){
                        var component=components.get(i);
                        var liveObject=component.liveObject;
                        if(liveObject.setEditMode){
                            liveObject.setEditMode(editingOn,builder.projectComponents,component);
                        }else{
                            liveObject.editingOn=editingOn;
                        }
                    }
                }
                builder.editingOn=editingOn;
                builder.projectComponents.switchEditMode(editingOn);
            }
        }
    ],
    autoSwitchToEditMode:function(){
        var switcher=this.getItem("switcher");
        if(switcher.getValue()=="Edit"){
            return;
        }
        switcher.setValue("Edit");
        switcher.changed(this,switcher,"Edit");
        if(!this._autoSwitchedLabel){
            this._autoSwitchedLabel=isc.Label.create({
                height:25,width:190,
                backgroundColor:"#ffff66",
                align:"center",
                contents:"<<< Auto-switched to Edit mode",
                top:this.getPageTop()+3,left:this.getPageLeft()+100
            });
        }
        this._autoSwitchedLabel.show();
        this._autoSwitchedLabel.setOpacity(100);
        isc.Timer.setTimeout(this.ID+".fadeOutAutoSwitchedLabel()",5000);
    },
    fadeOutAutoSwitchedLabel:function(){
        var _this=this;
        this._autoSwitchedLabel.animateFade(0,function(){
            _this._autoSwitchedLabel.hide();
        },1000);
    }
};
isc.A.rightStackDefaults={
    _constructor:"TSectionStack",
    autoDraw:false,
    width:200,
    visibilityMode:"multiple"
};
isc.A.canvasItemWrapperConstructor="CanvasItem";
isc.A.canvasItemWrapperDefaults={
    showTitle:false,
    colSpan:"*",
    width:"*"
};
isc.A.simpleTypeNodeConstructor="FormItem";
isc.A.simpleTypeNodeDefaults={
    isGroup:true,
    cellPadding:5,
    showComplexFields:false,
    doNotUseDefaultBinding:true
};
isc.A.complexTypeNodeConstructor="DynamicForm";
isc.A.complexTypeNodeDefaults={
    isGroup:true,
    cellPadding:5,
    showComplexFields:false,
    doNotUseDefaultBinding:true
};
isc.A.repeatingComplexTypeNodeDefaults={
    autoFitData:"vertical",
    leaveScrollbarGap:false
};
isc.A.paletteNodeDSDefaults={
    _constructor:"DataSource",
    ID:"paletteNode",
    recordXPath:"/PaletteNodes/PaletteNode",
    fields:{
        name:{name:"name",type:"text",length:8,required:true},
        title:{name:"title",type:"text",title:"Title",length:128,required:true},
        type:{name:"type",type:"text",title:"Type",length:128,required:true},
        icon:{name:"icon",type:"image",title:"Icon Filename",length:128},
        iconWidth:{name:"iconWidth",type:"number",title:"Icon Width"},
        iconHeight:{name:"iconHeight",type:"number",title:"Icon Height"},
        iconSize:{name:"iconSize",type:"number",title:"Icon Size"},
        showDropIcon:{name:"showDropIcon",type:"boolean",title:"Show Drop Icon"},
        defaults:{name:"defaults",type:"Canvas",propertiesOnly:true},
        children:{name:"children",type:"paletteNode",multiple:true}
    }
};
isc.A.paletteDSDefaults={
    _constructor:"DataSource",
    ID:"paletteDS",
    clientOnly:true,
    fields:[
        {name:"id",type:"integer",primaryKey:true},
        {name:"parentId",type:"integer"},
        {name:"title",title:"Component",type:"text"},
        {name:"description",type:"text"},
        {name:"isFolder",type:"boolean"},
        {name:"type",type:"text"},
        {name:"children"}
    ],
    performDSOperation:function(operationType,data,callback,requestProperties){
        if(this._dataMockupMode==this.mockupMode&&this.getCacheData()!=null){
            return this.Super("performDSOperation",arguments);
        }
        this._dataMockupMode=this.mockupMode;
        this.setCacheData(null);
        this._pendingData=null;
        this._pendingFetchCount=2;
        isc.RPCManager.startQueue();
        this.paletteNodeDS.dataURL=this.customComponentsURL;
        this.paletteNodeDS.fetchData({},this.getID()+".fetchComponentsReply(dsResponse.clientContext,data)",{
            clientContext:{
                operationType:operationType,
                data:data,
                callback:callback,
                requestProperties:requestProperties
            }
        });
        this.paletteNodeDS.dataURL=this.mockupMode?this.defaultMockupComponentsURL:this.defaultComponentsURL;
        this.paletteNodeDS.fetchData({},this.getID()+".fetchComponentsReply(dsResponse.clientContext,data)",{
            clientContext:{
                operationType:operationType,
                data:data,
                callback:callback,
                requestProperties:requestProperties
            }
        });
        isc.RPCManager.sendQueue();
    },
    fetchComponentsReply:function(clientContext,data){
        if(!this._pendingData)this._pendingData=data;
        else this._pendingData.addList(data);
        if(--this._pendingFetchCount==0){
            data=this.flattenTree(this._pendingData);
            this.setCacheData(data);
            this._pendingData=null;
            this.Super("performDSOperation",[clientContext.operationType,clientContext.data,clientContext.callback,clientContext.requestProperties]);
        }
    },
    assignIds:function(data,parentId){
        if(parentId==null)this._nextId=0;
        for(var i=0;i<data.length;i++){
            var node=data[i];
            node.id=this._nextId++;
            if(parentId!=null)node.parentId=parentId;
            if(node.children)this.assignIds(node.children,node.id);
            else node.isFolder=false;
        }
    },
    flattenTree:function(data,parentId,flatData){
        if(parentId==null)this._nextId=0;
        if(!flatData)flatData=[];
        for(var i=0;i<data.length;i++){
            var node=data[i];
            node.id=this._nextId++;
            if(parentId!=null)node.parentId=parentId;
            if(node.children){
                this.flattenTree(node.children,node.id,flatData);
                delete node.children;
            }else{
                node.isFolder=false;
            }
            flatData.add(node);
        }
        return flatData;
    }
};
isc.A.libraryComponentsDefaults={
    _constructor:"TTreePalette",
    autoShowParents:true,
    autoDraw:false,
    dataSource:"paletteDS",
    loadDataOnDemand:false,
    cellHeight:22,
    showRoot:false,
    showHeader:false,
    showConnectors:true,
    selectionType:Selection.SINGLE,
    treeFieldTitle:"Form Items",
    canDragRecordsOut:true,
    canAcceptDroppedRecords:false,
    dragDataAction:isc.TreeViewer.COPY,
    iconSize:16,
    folderOpenImage:"cubes_blue.gif",
    folderClosedImage:"cubes_blue.gif",
    folderDropImage:"cubes_green.gif",
    fileImage:"cube_blue.gif",
    dragStart:function(){
        this.topElement.modeSwitcher.autoSwitchToEditMode();
    }
};
isc.A.screenListToolbarDefaults={
    _constructor:"TLayout",
    vertical:false,
    autoDraw:true,
    membersMargin:10,
    height:20,
    autoParent:"screenPane"
};
isc.A.screenAddButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    title:"Add...",
    showMenuBelow:false,
    width:80,
    autoParent:"screenListToolbar"
};
isc.A.dataSourceListDefaults={
    _constructor:"TListPalette",
    showHeaderMenuButton:false,
    autoDraw:false,
    height:"40%",
    selectionType:"single",
    canDragRecordsOut:true,
    emptyMessage:"<span style='color: #0066CC'>Use the 'Add...' button below to add DataSources.</span>",
    editSelectedDataSource:function(){
        var record=this.getSelectedRecord();
        if(record)isc.DS.get(record.ID,this.creator.getID()+".showDSEditor(dsID)",
                                                {loadParents:true});
    },
    doubleClick:function(){this.editSelectedDataSource();},
    selectionChanged:function(){
        this.creator.dsEditButton.setDisabled(this.getSelectedRecord()==null);
    },
    fields:[{
        name:"ID",
        width:"*"
    },{
        name:"dsType",
        title:"Type",
        valueMap:{
            "sql":"SQL",
            "hibernate":"Hibernate",
            "jpa":"JPA 2.0",
            "jpa1":"JPA 1.0",
            "generic":"Generic",
            "projectFile":"Project File"
        },
        width:65
    },{
        name:"download",
        showTitle:false,
        width:22
    }],
    formatCellValue:function(value,record,rowNum,colNum){
        var field=this.getField(colNum);
        if(field.name=="download"){
            return this.imgHTML(
                "[SKINIMG]/actions/download.png",null,null,null,null,this.widgetImgDir);
        }else return value;
    },
    cellClick:function(record,rowNum,colNum){
        var field=this.getField(colNum);
        if(field.name=="download"){
        isc.DS.get(record.ID,this.creator.getID()+".downloadDataSource(dsID)",
                                            {loadParents:true});
        }else return this.Super("cellClick",arguments);
    },
    dsContextMenuDefaults:{
        _constructor:"Menu",
        autoDraw:false,
        showIcon:false,
        showMenuFor:function(record,recordNum){
            this._record=record;
            this._recordNum=recordNum;
            this.showContextMenu();
        },
        data:[{
            title:"Edit...",
            click:function(target,item,menu){
                isc.DS.get(menu._record.ID,menu.creator.creator.getID()+".showDSEditor(dsID)",
                                                {loadParents:true});
            }
        },{
            title:"Remove from project",
            click:function(target,item,menu){
                menu.creator.creator.project.removeDatasource(menu._record.ID);
            }
        }]
    },
    rowContextClick:function(record,rowNum,colNum){
        this.dsContextMenu.showMenuFor(record,rowNum);
        return false;
    },
    initWidget:function(){
        this.Super("initWidget",arguments);
        this.dsContextMenu=this.createAutoChild("dsContextMenu");
    },
    autoParent:"dataSourcePane",
    dragStart:function(){
        this.topElement.modeSwitcher.autoSwitchToEditMode();
    }
};
isc.A.dataSourceListToolbarDefaults={
    _constructor:"TLayout",
    vertical:false,
    autoDraw:true,
    membersMargin:10,
    margin:2,
    height:20,
    autoParent:"dataSourcePane"
};
isc.A.dsNewButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    title:"Add...",
    showMenuBelow:false,
    width:70,
    autoParent:"dataSourceListToolbar"
};
isc.A.dsNewButtonMenuDefaults={
    _constructor:"Menu",
    data:[{
        title:"New DataSource...",
        click:function(target,item,menu){
            menu.creator.showDSWizard();
        }
    },{
        title:"Existing DataSource...",
        click:function(target,item,menu){
            menu.creator.showDataSourcePicker();
        }
    }]
};
isc.A.dsEditButtonDefaults={
    _constructor:"TButton",
    autoDraw:false,
    disabled:true,
    title:"Edit...",
    width:70,
    click:"this.creator.dataSourceList.editSelectedDataSource()",
    autoParent:"dataSourceListToolbar"
};
isc.A.projectComponentsMenuDefaults={
    _constructor:"Menu",
    autoDraw:false,
    showIcon:false,
    enableIf:function(target,menu){
        var selection=target?target.getSelection():null,
            node=selection?selection[0]:null,
            removeOK=true;
        if(!target.creator.canAddRootComponents){
            var data=target.data,
                selectionLength=(selection==null?0:selection.length);
            for(var i=0;i<selectionLength;++i){
                if(data.isRoot(data.getParent(selection[i])))removeOK=false;
            }
        }
        return{selection:selection,node:node,removeOK:removeOK};
    },
    data:[
        {title:"Remove",enableIf:"node != null && removeOK",
            click:function(target){
                var selection=target.getSelection(),
                    selectionLength=(selection==null?0:selection.length);
                for(var i=0;i<selectionLength;++i){
                    var node=selection[i];
                    target.destroyNode(node);
                }
                target.data.removeList(selection);
            }
        },
        {title:"Edit",enableIf:"node != null",
            click:function(target,item,menu){
                var selection=target.getSelection(),
                    node=(selection?selection[0]:undefined),
                    editContext=menu.creator.projectComponents.editContext
                ;
                menu.creator.editComponent(node,editContext.getLiveObject(node));
            }
        }
    ]
};
isc.A.projectComponentsDefaults={
    _constructor:"TEditTree",
    showHeaderMenuButton:false,
    editContextDefaults:{
        persistCoordinates:null,
        selectedAppearance:"outlineEdges",
        canGroupSelect:false,
        enableInlineEdit:true,
        isVisualBuilder:true,
        addNode:function(newNode,parent,index,parentField,skipParentComponentAdd,dontShowFieldMapper){
            var editTree=this.creator;
            var iscClass=isc.ClassFactory.getClass(newNode.type);
            if(iscClass&&iscClass.isA(isc.DataSource)){
                if(newNode.loadData!=null&&!newNode.isLoaded){
                    var _this=this;
                    newNode.loadData(newNode,function(){
                        _this.addNode(newNode,parent,index,parentField,skipParentComponentAdd);
                    });
                    return;
                }
                if(dontShowFieldMapper==null){
                    var _this=this;
                    var showed=editTree.showFieldMapper(parent.liveObject,newNode,parent,function(){
                        _this.addNode(newNode,parent,index,parentField,skipParentComponentAdd,true);
                    });
                    if(showed){
                        return;
                    }
                }
            }
            newNode=this.Super("addNode",arguments);
            if(!newNode)return;
            if(!newNode.dropped||(newNode.loadData!=null&&!newNode.isLoaded)){
                editTree.observeNodeDragResized(newNode,parent);
                editTree.creator.componentAdded();
                return newNode;
            }
            var iscClass=isc.ClassFactory.getClass(newNode.type);
            if(iscClass!=null&&iscClass.isA(isc.DataSource)){
                var ds=newNode.liveObject,
                    type=ds.serverType||ds.dsType||ds.dataSourceType,
                    bindTargetNode=parent,
                    bindTarget=parent.liveObject;
                if((isc.isA.ListGrid(bindTarget)||isc.isA.TileGrid(bindTarget))&&
                    (type=="sql"||type=="hibernate"||ds.dataURL!=null||
                     ds.clientOnly||ds.serviceNamespace!=null)&&
                    !ds.noAutoFetch&&
                    bindTarget.autoFetchData!=false)
                {
                    bindTargetNode.defaults.autoFetchData=true;
                    if(isc.SForce&&isc.isA.SFDataSource(ds)&&!isc.SForce.sessionId){
                        isc.SForce.ensureLoggedIn(function(){bindTarget.fetchData();},true);
                    }else{
                        bindTarget.fetchData();
                    }
                }
                var comp=editTree.creator.getCurrentComponent();
                if(comp&&comp==parent)editTree.creator.refreshComponent();
            }
            var liveObject=this.getLiveObject(newNode);
            if(!liveObject.getEditableProperties){
                editTree.creator.componentAdded();
                return newNode;
            }
            editTree.observeNodeDragResized(newNode,parent);
            if(liveObject.setEditableProperties){
                liveObject.setEditableProperties({});
                if(liveObject.markForRedraw)liveObject.markForRedraw();
                else if(liveObject.redraw)liveObject.redraw();
            }
            editTree.delayCall("hiliteSelected",[true]);
            editTree.creator.componentAdded();
            return newNode;
        },
        removeNode:function(node,a,b,c,d){
            var editTree=this.creator,
                parentNode=editTree.data.getParent(node)
            ;
            var liveObject=node.liveObject;
            if(liveObject&&editTree.creator.isObserving(liveObject,"dragResized")){
                editTree.creator.ignore(liveObject,"dragResized");
            }
            this.Super("removeNode",[node,a,b,c,d],arguments);
            editTree.creator.componentRemoved(node,parentNode);
        },
        removeAll:function(){
            var editTree=this.creator;
            editTree.creator.clearComponent();
            return this.Super("removeAll",arguments);
        },
        destroyAll:function(){
            var editTree=this.creator;
            editTree.creator.clearComponent();
            return this.Super("destroyAll",arguments);
        }
    },
    shouldShowDragLineForRecord:function(){
        if(this.Super("shouldShowDragLineForRecord",arguments)){
            return!!this.willAcceptDrop();
        }
        return false;
    },
    autoDraw:false,
    canSort:false,
    leaveScrollbarGap:false,
    selectionUpdated:function(record){
        if(record)this.creator.editComponent(record,this.editContext.getLiveObject(record));
        else this.creator.clearComponent();
    },
    hiliteSelected:function(){
        var node=this.getSelectedRecord();
        while(node){
            var object=node?node.liveObject:null;
            if((isc.isA.Canvas(object)||isc.isA.FormItem(object))
                    &&object.isDrawn()&&object.isVisible())
            {
                isc.EditContext.selectCanvasOrFormItem(object);
                break;
            }
            node=this.data.getParent(node);
        }
    },
    canRemoveRecords:true,
    removeRecordClick:function(rowNum){
        var node=this.getRecord(rowNum),
            liveObject=(node?node.liveObject:null);
        if(liveObject&&liveObject.editContext){
            liveObject.editContext.destroyNode(node);
        }
    },
    autoShowParents:true,
    observeNodeDragResized:function(newNode,parent){
        if(parent==null)parent=this.editContext.getDefaultParent(newNode);
        var liveParent=this.editContext.getLiveObject(parent);
        if(liveParent&&isc.isA.Layout(liveParent)&&!isc.isA.ListGrid(liveParent)){
            var liveObject=newNode.liveObject;
            if(liveObject.dragResized&&!this.isObserving(liveObject,"dragResized")){
                this.observe(liveObject,"dragResized","observer.liveObjectDragResized(observed)");
            }
        }
    },
    liveObjectDragResized:function(liveObject){
        var parentLiveObject=liveObject.parentElement;
        if(parentLiveObject){
            var editNode=liveObject.editNode;
            if(parentLiveObject.vertical){
                var newHeight=liveObject.getHeight();
                this.creator.projectComponents.setNodeProperties(editNode,{height:newHeight});
                this.creator.componentAttributeEditor.setValue("height",newHeight);
            }else{
                var newWidth=liveObject.getWidth();
                this.creator.projectComponents.setNodeProperties(editNode,{width:newWidth});
                this.creator.componentAttributeEditor.setValue("width",newWidth);
            }
        }
    },
    showFieldMapper:function(component,newNode,parent,callback){
        if(!isc.isA.ListGrid(component)&&
            !isc.isA.TileGrid(component)&&
            !isc.isA.DynamicForm(component)&&
            !isc.isA.DetailViewer(component))
        {
            return;
        }
        var _this=this,
            mockDs=component.getDataSource(),
            fields=component.getAllFields(),
            callFieldMapper=mockDs&&mockDs.isA("MockDataSource");
        if(!callFieldMapper&&this.creator.useFieldMapper){
            if(mockDs&&mockDs.isA("DataSource")){
                callFieldMapper=true;
            }else if(fields&&fields.length>0){
                callFieldMapper=true;
            }
        }
        if(callFieldMapper){
            var ds=newNode.liveObject;
            if(isc.isA.MockDataSource(newNode.liveObject))return false;
            var mapper=isc.FieldMapper.create({
                callback:callback,
                mockFields:fields,
                mockDataSource:mockDs,
                targetDataSource:ds
            });
            var wnd=isc.Window.create({
                items:[{
                    _constructor:"Label",
                    contents:mapper.description,
                    width:"100%",
                    height:1
                },
                mapper,
                {
                    _constructor:"DynamicForm",
                    colWidths:"120, *, 75, 75",
                    numCols:4,
                    width:"100%",
                    items:[{
                        _constructor:"ButtonItem",
                        title:"Use New Fields",
                        width:120,
                        endRow:false,
                        click:function(){
                            mapper.setDefaultData(true);
                        }
                    },{
                        _constructor:"SpacerItem"
                    },{
                        _constructor:"ButtonItem",
                        title:"OK",
                        endRow:false,
                        startRow:false,
                        width:75,
                        click:function(){
                            var changes=mapper.getChanges(),
                                deletes=mapper.getDeletes();
                            var dbcList=component.getRuleScopeDataBoundComponents();
                            for(var i=0;i<dbcList.length;i++){
                                _this.creator.updateComponentRuleScopeProperties(dbcList[i],changes,deletes);
                            }
                            return mapper.applyMap(component,parent,wnd);
                        }
                    },{
                        _constructor:"ButtonItem",
                        title:"Cancel",
                        width:75,
                        endRow:false,
                        startRow:false,
                        click:function(){
                            wnd.destroy();
                        }
                    }]
                }],
                bodyProperties:{
                    layoutMargin:8,defaultLayoutAlign:"center"
                },
                width:800,
                title:"Fields mapping",
                autoCenter:true,
                autoSize:true,
                isModal:true
            });
        }
        return callFieldMapper;
    },
    folderOpenImage:"cubes_blue.gif",
    folderClosedImage:"cubes_blue.gif",
    folderDropImage:"cubes_green.gif",
    fileImage:"cube_blue.gif",
    hasComponents:function(){
        var tree=this.getData();
        var length=tree.getLength();
        return length>1||(length==1&&tree.get(0).type!="DataView");
    }
};
isc.A.mockupExtraPalettesDefaults={
    _constructor:"HiddenPalette",
    data:[
       {title:"Tab",type:"Tab"}
    ]
};
isc.A.codePreviewDefaults={
    _constructor:"DynamicForm",
    autoDraw:false,
    overflow:"auto",
    browserSpellCheck:false,
    items:[
        {name:"codeField",
            editorType:"TTextAreaItem",
            showTitle:false,colSpan:"*",width:"*",height:"*"}
    ],
    saveToSalesForce:function(){
        if(!this._prompted){
            this._prompted=true;
            var saver=this;
            isc.say(
"This feature will save your application to your SalesForce account as an 'SControl'"+
", which can be shown in a Custom Tab via the customization interfaces within SalesForce."+
"<P>In order to be successfully deployed to SalesForce, an application must consist "+
" strictly of SalesForce DataSources, 'clientOnly' DataSources and XJSONDataSources."+
"<P>The deployed application does not require Java or other external server functionality, "+
"instead accessing SalesForce APIs via SOAP, and loading the SmartClient framework itself "+
"as static web assets (from SmartClient.com by default - see the "+
"visualBuilder/index.jsp 'builderConfig' block to customize).",
function(){saver.saveSControl();});
        }else{
            this.saveSControl();
        }
    },
    saveSControl:function(loggedIn){
        if(!loggedIn){
            var saver=this;
            isc.SForce.ensureLoggedIn(function(){saver.saveSControl(true);},true);
            return;
        }
        var xmlSource=this.builder.projectComponents.serializeAllEditNodes(true);
        var _builder=this.creator;
        isc.xml.toJSCode(
            xmlSource,
            function(rpcResponse,jsSource){
                isc.askForValue(
                    "Name your SControl :",
                    function(name){
                        if(name==null)return;
                        var service=isc.WebService.get("urn:partner.soap.sforce.com");
                        service.controlIsomorphicDir=_builder.sControlIsomorphicDir;
                        service.controlSkin=_builder.sControlSkin;
                        service.deploySControl(name,jsSource);
                    },
                    {defaultValue:"ISC"}
                );
            }
        );
    },
    hasChanged:function(){
        return this.valuesHaveChanged();
    },
    discardChanges:function(){
        this.resetValues();
    },
    saveChanges:function(){
        var xmlSource=this.getValue("codeField");
        var builder=this.creator,
            screen=builder.currentScreen
        ;
        builder.loadViewFromXML(screen,xmlSource);
        this.resetValues();
    }
};
isc.A.jsCodePreviewDefaults={
    _constructor:"DynamicForm",
    autoDraw:false,
    overflow:"auto",
    browserSpellCheck:false,
    items:[
        {name:"codeField",
        editorType:"TTextAreaItem",
        showTitle:false,colSpan:"*",width:"*",height:"*"}
    ],
    setContents:function(contents){
        this.setValue("codeField",contents);
    }
};
isc.A.codePaneDefaults={
    _constructor:"TTabSet",
    paneMargin:0,
    autoDraw:false,
    height:"35%",
    tabSelected:function(tabNum){
        this.creator.updateSource();
    },
    hasChanged:function(){
        var codePreview=this.getTabPane(0);
        if(codePreview){
            return codePreview.valuesHaveChanged();
        }
        return false;
    },
    discardChanges:function(){
        var codePreview=this.getTabPane(0);
        if(codePreview){
            codePreview.resetValues();
        }
    },
    saveChanges:function(){
        var codePreview=this.getTabPane(0);
        if(codePreview){
            var xmlSource=codePreview.getValue("codeField");
            var builder=this.creator,
                screen=builder.currentScreen
            ;
            builder.loadViewFromXML(screen,xmlSource);
            codePreview.resetValues();
        }
    }
};
isc.A.multiActionWindowDefaults={
    _constructor:"Window",
    autoCenter:true,
    autoSize:true,
    isModal:true,
    showMinimizeButton:false
};
isc.A.multiActionPanelDefaults={
    _constructor:"MultiActionPanel"
};
isc.A.componentAttributeEditorDefaults={
    _constructor:"TComponentEditor",
    _localId:"componentEditor",
    autoDraw:false,
    autoFocus:false,
    overflow:"auto",
    alwaysShowVScrollbar:true,
    showAttributes:true,
    showMethods:false,
    backgroundColor:isc.nativeSkin?null:"black",
    basicMode:true
};
isc.A.componentMethodEditorDefaults={
    _constructor:"TComponentEditor",
    sortFields:true,
    autoDraw:false,
    autoFocus:false,
    overflow:"auto",
    alwaysShowVScrollbar:true,
    showAttributes:false,
    showMethods:true,
    backgroundColor:isc.nativeSkin?null:"black",
    basicMode:true
};
isc.A.editorPaneDefaults={
    _constructor:"TTabSet",
    autoDraw:false,
    paneMargin:0,
    paneContainerProperties:{customEdges:["T"]},
    tabBarProperties:{baseLineCapSize:0},
    tabBarControls:[
        isc.Img.create({
            src:"[SKIN]/../../ToolSkin/images/actions/remove.png",
            autoDraw:false,
            width:16,height:16,
            layoutAlign:"center",
            cursor:"pointer",
            canHover:true,showHover:true,
            prompt:"Delete current component",
            click:function(){
                var selected=isc.SelectionOutline.getSelectedObject();
                if(selected&&selected.editContext){
                    selected.editContext.destroyNode(selected.editNode);
                }
            }
        }),
        isc.LayoutSpacer.create({width:10}),
        "tabScroller","tabPicker"
    ],
    tabDeselected:function(tabNum,tabPane,ID,tab){
        this._fromEditor=tabPane.ID;
    },
    tabSelected:function(tabNum,tabPane,ID,tab){
        if(!this._fromEditor)return;
        var component=this.creator.getCurrentComponent(),
            fromBasic=component?component[this._fromEditor+"BasicMode"]:null,
            toBasic=component?component[tabPane.ID+"BasicMode"]:null;
        if(fromBasic!=toBasic){
            this.creator.editComponent(component,component.liveObject);
        }else{
            this.creator.applyBasicModeSettings();
        }
    },
    selectedEditorName:function(){
        var tab=this.getTabObject(this.selectedTab);
        if(tab&&tab.title)return tab.title.toLowerCase();
        return null;
    },
    PROPERTIES:"properties",
    EVENTS:"events"
};
isc.A.applyButtonDefaults={
    _constructor:"TButton",
    resizeable:false,
    autoDraw:false,
    title:"Apply",
    click:"this.creator.saveComponentEditors();",
    disabled:true,
    height:20
};
isc.A.advancedButtonDefaults={
    _constructor:"TButton",
    resizeable:false,
    autoDraw:false,
    click:function(){
        var component=this.creator.getCurrentComponent();
        this.creator.toggleBasicMode(component);
        this.creator.editComponent(component,component.liveObject);
    },
    disabled:true,
    height:20
};
isc.A.helpPaneDefaults={
    _constructor:"THTMLFlow",
    padding:10,
    autoDraw:false,
    overflow:"auto"
};
isc.A.projectPaneDefaults={
    _constructor:"TTabSet",
    paneMargin:0,
    autoDraw:false
};
isc.A.projectMenuButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    width:"80%",
    height:28,
    margin:4,
    layoutAlign:"center"
};
isc.A.recentProjectsMenuDefaults={
    _constructor:"Menu",
    width:100,
    itemClick:function(item){
        var creator=this.creator;
        creator.confirmSaveProject(function(){
            creator.loadProject(item.projectFileName);
        });
    }
};
isc.A.screenMenuButtonDefaults={
    _constructor:"TMenuButton",
    autoDraw:false,
    title:"Screen",
    height:20,
    width:80
};
isc.A.removeButtonDefaults={
    _constructor:"ImgButton",
    autoDraw:false,
    src:"[SKIN]/../../ToolSkin/images/actions/remove.png",
    width:16,height:16,
    showRollOver:false,
    showDown:false,
    prompt:"Remove",
    visibility:"hidden",
    click:function(){
        var editContext=this.creator.projectComponents.getEditContext(),
            selection=editContext.getSelectedEditNodes()
        ;
        for(var i=0;i<selection.length;i++){
            editContext.destroyNode(selection[i]);
        }
    }
};
isc.A.bringToFrontButtonDefaults={
    _constructor:"TButton",
    autoDraw:false,
    title:"Bring to front",
    height:20,
    width:80,
    visibility:"hidden",
    click:function(){
        var editContext=this.creator.projectComponents.getEditContext(),
            selection=editContext.getSelectedEditNodes()
        ;
        for(var i=0;i<selection.length;i++){
            selection[i].liveObject.bringToFront();
        }
    }
};
isc.A.sendToBackButtonDefaults={
    _constructor:"TButton",
    autoDraw:false,
    title:"Send to back",
    height:20,
    width:80,
    visibility:"hidden",
    click:function(){
        var editContext=this.creator.projectComponents.getEditContext(),
            selection=editContext.getSelectedEditNodes()
        ;
        for(var i=0;i<selection.length;i++){
            selection[i].liveObject.sendToBack();
        }
    }
};
isc.A.mainDefaults={
    _constructor:"TTabSet",
    width:"100%",
    height:"100%",
    paneMargin:0,
    backgroundColor:isc.nativeSkin?null:"black",
    tabSelected:function(tabNum,tabPane,ID,tab){
        if(tabNum==1){
            this.creator.updateSource();
        }
    },
    tabDeselected:function(tabNum,tabPane,ID,tab,newTab){
        if(tabNum==1){
            if(tabPane.hasChanged&&tabPane.hasChanged()){
                var self=this;
                var dialog=isc.Dialog.create({
                    message:"Code changes have been made to the generated XML. Should these code changes be saved to the current screen definition?",
                    icon:"[SKIN]ask.png",
                    buttons:[
                        isc.Button.create({title:"Save",click:function(){
                            tabPane.saveChanges();
                            self.selectTab(0);
                            this.topElement.cancelClick();
                        }}),
                        isc.Button.create({title:"Discard",click:function(){
                            tabPane.discardChanges();
                            self.selectTab(0);
                            this.topElement.cancelClick();
                        }}),
                        isc.Button.create({title:"Cancel",click:function(){
                            this.topElement.cancelClick();
                        }})
                    ]
                });
                dialog.show();
                return false;
            }
        }
        return true;
    }
};
isc.A.operationsPaletteDefaults={
    _constructor:isc.TTreePalette,
    getIcon:function(node){
        var icon=this.creator.getServiceElementIcon(node);
        if(icon)return icon;
        return this.Super("getIcon",arguments);
    }
};
isc.A.schemaViewerDefaults={
    _constructor:isc.TTreeGrid,
    autoDraw:false,
    recordDoubleClick:"this.creator.operationSelected()",
    fields:[
        {name:"name",title:"Service/PortType/Operation",treeField:true},
        {name:"serviceType",title:"Type"}
    ],
    getIcon:function(node){
        var icon=this.creator.getServiceElementIcon(node);
        if(icon)return icon;
        return this.Super("getIcon",arguments);
   }
};
isc.A.schemaViewerSelectButtonDefaults={
    _constructor:isc.TButton,
    autoDraw:false,
    title:"Select",
    click:"this.creator.operationSelected()"
};
isc.A.commonEditorFunctions={
    itemChange:function(item,value,oldValue){
        this.logInfo("itemChange on: "+item+", value now: "+value,"editing");
        if(item.name=="classSwitcher"){
            this.builder.switchComponentClass(value);
            return true;
        }
        if(item.name=="type"){
            var listGridFieldDS=isc.DataSource.get("ListGridField"),
                formItemDS=isc.DataSource.get("FormItem"),
                currentDS=this.dataSource,
                mustUpdateItems=false;
            if(listGridFieldDS||formItemDS){
                while(currentDS!=null){
                    if(currentDS==listGridFieldDS||currentDS==formItemDS){
                        mustUpdateItems=true;
                        break;
                    }
                    currentDS=(currentDS.inheritsFrom?isc.DS.get(currentDS.inheritsFrom):null);
                }
            }
            if(mustUpdateItems){
                this.saveItem(item,value);
                this.editComponent(this.currentComponent,this.currentComponent.liveObject);
            }
        }
        if(this.immediateSave||isc.isA.ExpressionItem(item)||
            isc.isA.ActionMenuItem(item)||isc.isA.CheckboxItem(item))
        {
            this.saveItem(item,value);
            this.builder.updateSource();
            return true;
        }else if(isc.isA.CriteriaItem(item)||
                isc.isA.FormulaEditorItem(item)||
                isc.isA.SummaryEditorItem(item)||
                isc.isA.ExpressionEditorItem(item))
        {
            this.saveItem(item,value);
            this.builder.updateSource();
            return true;
        }else{
            item._changed=true;
            return true;
        }
    },
    itemKeyPress:function(item,keyName){
        if(keyName=="Enter")this.save();
    },
    saveItem:function(item,value){
        return this.saveItems([item],[value]);
    },
    save:function(){
        if(!this.validate())return;
        var changedItems=[],
            values=[]
        ;
        for(var i=0;i<this.items.length;i++){
            var item=this.items[i];
            if(item._changed){
                changedItems.add(item);
                values.add(this.getValue(item.name));
                item._changed=false;
            }
        }
        var result=this.saveItems(changedItems,values);
        this.builder.updateSource();
        return result;
    },
    saveItems:function(items,values){
        if(!items||items.length==0)return true;
        if(items.length>0)this.builder.markDirty();
        var editNode=this.currentComponent,
            properties={}
        ;
        for(var i=0;i<items.length;i++){
            var item=items[i],
                value=values[i]
            ;
            properties[item.name]=value;
        }
        return this.saveProperties(properties,editNode);
    },
    saveProperties:function(properties,editNode){
        var targetObject=editNode.liveObject||
                           this.builder.projectComponents.getLiveObject(editNode);
        this.logInfo("applying changed properties: "+this.echo(properties)+
                     " to: "+this.echoLeaf(targetObject),"editing");
        var component=targetObject,
            ruleScopeChange,
            undef;
        if(isc.isA.FormItem(targetObject)||(targetObject._constructor&&targetObject._constructor=="ListGridField")){
            if(properties["name"]!=undef){
                ruleScopeChange={property:"name",oldValue:targetObject.name,newValue:properties.name};
            }
            if(isc.isA.FormItem(targetObject)){
                component=targetObject.form;
            }else{
                var editNodeTree=this.builder.projectComponents.getEditContext().getEditNodeTree(),
                    parentNode=editNodeTree.getParent(editNode)
                ;
                component=parentNode.liveObject;
            }
        }else if(properties["ID"]!=undef){
            ruleScopeChange={property:"ID",oldValue:targetObject.ID,newValue:properties.ID};
        }
        this.builder.projectComponents.setNodeProperties(editNode,properties);
        this.builder.updateComponentPropertiesSectionTitle(targetObject);
        var editor=this.builder.getCurrentlyVisibleEditor(),
            basicMode=editNode[editor.ID+"BasicMode"];
        if(basicMode==false){
            editNode._notSwitchable=true;
        }
        if(ruleScopeChange){
            this.notifyIDOrFieldNameChange(component,ruleScopeChange.property,ruleScopeChange.oldValue,ruleScopeChange.newValue);
        }
        return true;
    },
    notifyIDOrFieldNameChange:function(component,property,oldValue,newValue){
        var componentValueTerm=(isc.isA.ListGrid(component)?"selectedRecord":"values"),
            changes=[],
            pattern,
            replacement
        ;
        if(property=="ID"){
            changes[changes.length]={
                pattern:new RegExp("^"+oldValue+"\\."+componentValueTerm),
                replacement:newValue+"."+componentValueTerm
            }
        }else{
            var newValuePath=component.ID+"."+componentValueTerm+"."+newValue;
            changes[changes.length]={
                pattern:new RegExp(component.ID+"\\."+componentValueTerm+"\\."+oldValue),
                replacement:newValuePath
            }
            if(component.dataSource){
                var ds=(isc.isA.DataSource(component.dataSource)?component.dataSource:isc.DS.get(component.dataSource)),
                    dsId=ds.ID
                ;
                if(ds.getField(oldValue)){
                    changes[changes.length]={
                        pattern:new RegExp(dsId+"\\."+oldValue),
                        replacement:(ds.getField(newValue)?dsId+"."+newValue:newValuePath)
                    }
                }
            }
        }
        var dbcList=component.getRuleScopeDataBoundComponents();
        for(var i=0;i<dbcList.length;i++){
            this.builder.updateComponentRuleScopeProperties(dbcList[i],changes);
        }
    }
};
isc.A._cachedTypeFieldnames={};
isc.A.rootComponentDefaults={
    _constructor:"Canvas",
    border:"6px groove #666666",
    getObjectField:function(type){
        var mockupMode=this.creator.getScreenMockupMode(this.creator.currentScreen);
        if(!mockupMode)return this.Super("getObjectField",arguments);
        var classObject=isc.ClassFactory.getClass(type);
        if(isc.isA.Canvas(classObject)){
            return"children";
        }else{
            return null;
        }
    }
};
isc.A.librarySearchDefaults={
    _constructor:"DynamicForm",
    height:20,
    numCols:1,
    selectOnFocus:true,
    quickAddDefaults:{
        editorType:"ComboBoxItem",
        optionDataSource:"paletteDS",valueField:"id",displayField:"title",
        optionCriteria:{
            _constructor:"AdvancedCriteria",operator:"and",
            criteria:[
                {fieldName:"type",operator:"notNull"}
            ]
        },
        completeOnTab:true,
        hint:"Quick Add..",showHintInField:true,
        textMatchStyle:"substring",
        loadDataOnDemand:false,
        useClientFiltering:false,
        changed:function(form,item,value){
            var node=item.getSelectedRecord();
            if(node){
                form.addNode(node);
            }
            item.clearValue();
        }
    },
    initWidget:function(){
        this.fields=[
            this.getQuickAddField("quickAdd",false),
            this.getQuickAddField("mockupQuickAdd",true)
        ];
        this.Super("initWidget",arguments);
    },
    getQuickAddField:function(name,mockupMode){
        var mockupMode=this.creator.getScreenMockupMode(this.creator.currentScreen),
            extraParameters={}
        ;
        if((mockupMode&&this.creator.useQuickAddDescriptionField!=false)||
            this.creator.useQuickAddDescriptionField)
        {
            extraParameters=isc.addProperties(extraParameters,{
                pickListFields:[
                    {name:"title"},
                    {name:"description"}
                ],
                pickListWidth:350,
                filterFields:["title","description"]
            });
        }
        return isc.addProperties({
            name:name,showTitle:false,width:"*",showIf:"false"
        },this.quickAddDefaults,this.quickAddProperties,extraParameters);
    },
    refresh:function(){
        var mockupMode=this.creator.getScreenMockupMode(this.creator.currentScreen);
        if(mockupMode){
            this.hideItem("quickAdd");
            this.showItem("mockupQuickAdd");
        }else{
            this.showItem("quickAdd");
            this.hideItem("mockupQuickAdd");
        }
    },
    addNode:function(node){
        var mockupMode=this.creator.getScreenMockupMode(this.creator.currentScreen),
            nodeType=node.type||node.className,
            clazz=isc.ClassFactory.getClass(nodeType),
            editContext=this.creator.projectComponents.getEditContext(),
            editNode=editContext.makeEditNode(node),
            parentNode=this.creator.projectComponents.getDefaultParent(editNode,true)
        ;
        if(!parentNode)return;
        if(clazz&&clazz.isA("FormItem")){
            editNode=editContext.addWithWrapper(editNode,parentNode);
        }else{
            editNode=editContext.addNode(editNode,parentNode);
        }
        if(mockupMode)editNode.liveObject.moveTo(20,20);
    }
};
isc.A.projectComponentsSearchDefaults={
    _constructor:"GridSearch",
    searchProperty:"title",
    searchProperty:"name",
    hint:"Find Live Component By ID..."
};
isc.A.dataSourceListSearchDefaults={
    _constructor:"GridSearch",
    searchProperty:"title",
    hint:"Find DataSource...",
    autoParent:"dataSourcePane"
};
isc.A.dataSourcePaneDefaults={
    _constructor:"VLayout"
};
isc.A.screenPaneDefaults={
    _constructor:"VLayout"
};
isc.A.dataSourcePickerConstructor='ProjectFileLoadDialog';
isc.A.dataSourcePickerDefaults={
    title:'Pick DataSource',
    actionButtonTitle:'Pick DataSource',
    fileType:'ds',
    fileFormat:'xml'
};
isc.A.downloadDataSourceDialogTitle="Download DataSource [\${dsID}]";
isc.A.downloadDataSourceDialogPrompt="Choose the format in which to export this DataSource "+
    "definition.  If you're making use of server capabilities, you should export to XML.";
isc.A.downloadDataSourceDialogButtonTitle="Download";
isc.B.push(isc.A._updateEditComponentRemovability=function isc_VisualBuilder__updateEditComponentRemovability(node){
    if(node==null)node=this._lastEditNode;
    else this._lastEditNode=node;
    var data=this.projectComponents.data,
        removeOK=this.canAddRootComponents||!data.isRoot(data.getParent(node));
    this.editorPane.tabBarControls[0].setVisibility(removeOK);
}
);
isc.evalBoundary;isc.B.push(isc.A.setCanAddRootComponents=function isc_VisualBuilder_setCanAddRootComponents(canAddRootComponents){
    this.canAddRootComponents=canAddRootComponents;
    this.projectComponents.setProperty("canDropRootNodes",canAddRootComponents);
    this._updateEditComponentRemovability();
}
,isc.A._forceOfflineStorage=function isc_VisualBuilder__forceOfflineStorage(){
    if(this.storageMode=="dataSourceOnly"){
        return false;
    }else if(this.storageMode=="offlineOnly"){
        return true;
    }else{
        return!this.userId;
    }
}
,isc.A.exportProject=function isc_VisualBuilder_exportProject(project,settings){

    var self=this;
    var projectName=null;
    if(project!=null)projectName=project;
    else if(this.project.name)projectName=this.project.name;
    if(projectName==null){
        isc.warn("You need to specify the project you want to export");
        return;
    }
    this.projectDataSource.getFile({
        fileName:projectName,
        fileType:'proj',
        fileFormat:'xml'
        },function(dsResponse,data,dsRequest){

            if(!data){
                isc.warn("Failed to read project. Check the project you want to export");
                return;
            }
            var dataSourcesIDs=[],
                screensIDs=[],
                treeNodes=[];
            settings.projectDir={
                path:settings.projectDir+projectName+".proj.xml",
                content:data
            }
            isc.DMI.callBuiltin({
                methodName:"xmlToJS",
                arguments:[data],
                callback:function(rpcResponse,jsData){

                    var project=isc.eval(jsData);
                    treeNodes=project.screens.getAllNodes();
                    for(var i=0;i<treeNodes.size();i++){
                        screensIDs.push(treeNodes[i].fileName);
                    }
                    for(var i=0;i<project.datasources.length;i++){
                        dataSourcesIDs.push(project.datasources[i].dsName);
                    }
                    settings.screensIDs=screensIDs;
                    settings.dataSourcesIDs=dataSourcesIDs;
                    isc.DMI.callBuiltin({
                        methodName:"downloadZip",
                        arguments:[settings||this.ProjectExportSettings],
                        requestParams:{
                            showPrompt:false,
                            useXmlHttpRequest:false,
                            timeout:0
                        }
                    });
                }
            });
        },{
            willHandleError:true
        }
    );
}
,isc.A.autoSaveCurrentSettings=function isc_VisualBuilder_autoSaveCurrentSettings(callback){
    if(callback)this._saveSettingsCallbacks.add(callback);
    this.fireOnPause("saveCurrentSettings","saveCurrentSettings");
}
,isc.A.saveCurrentSettings=function isc_VisualBuilder_saveCurrentSettings(){
    var settingsDS=this.settingsDataSource;
    if(settingsDS&&!this._forceOfflineStorage()){
        var xml=isc.DS.get("VisualBuilder").xmlSerialize(this.currentSettings);
        settingsDS.saveFile(this.settingsFile,xml,null,{showPrompt:false});
    }else{
        isc.Offline.put(this.offlineStorageKey,isc.JSON.encode(this.currentSettings,
                                                                {strictQuoting:true}));
    }
    var callbacks=this._saveSettingsCallbacks;
    for(var i=0;i<callbacks.length;i++)callbacks[i]();
    this._saveSettingsCallbacks=[];
}
,isc.A._restoreSettings=function isc_VisualBuilder__restoreSettings(json){
    this.currentSettings=isc.JSON.decode(json);
    if(this.currentSettings){
        if(this.currentSettings.projectID&&!this.currentSettings.projectFileName){
            this.currentSettings.projectFileName=this._convertIDtoFileName(this.currentSettings.projectID);
            delete this.currentSettings.projectID;
        }
        if(this.currentSettings.recentProjects&&isc.isAn.Array(this.currentSettings.recentProjects)){
            var self=this;
            this.currentSettings.recentProjects.map(function(project){
                if(project.projectID&&!project.projectFileName){
                    project.projectFileName=self._convertIDtoFileName(project.projectID);
                    delete project.projectID;
                }
            });
        }
    }
    this.setProperties(this.currentSettings);
}
,isc.A.loadCurrentSettings=function isc_VisualBuilder_loadCurrentSettings(callback){
    var self=this;
    var settingsDS=this.settingsDataSource;
    if(settingsDS&&!this._forceOfflineStorage()){
        settingsDS.getFile(this.settingsFile,function(dsResponse,data,dsRequest){
            if(dsResponse.status>=0&&data){
                if(isc.isAn.Array(dsResponse.data)&&dsResponse.data.length>0&&dsResponse.data[0].fileContentsJS){
                    self._loadCurrentSettingsReplyJs(dsResponse.data[0].fileContentsJS,callback);
                }else{
                    self._loadCurrentSettingsReply(data,callback);
                }
            }else{
                isc.RPCManager.sendRequest({
                    actionURL:self.defaultSettingsURL,
                    willHandleError:true,
                    httpMethod:'GET',
                    useSimpleHttp:true,
                    timeout:6000,
                    callback:function(response,data,request){
                        if(response.status>=0&&data){
                            self._loadCurrentSettingsReply(data,callback);
                        }else{
                            self.fireCallback(callback);
                        }
                    }
                });
            }
        },{
            willHandleError:true,
            timeout:6000,
            operationId:"xmlToJs"
        });
    }else{
        try{
            var json=isc.Offline.get(this.offlineStorageKey);
            if(json)this._restoreSettings(json);
        }finally{
            this.fireCallback(callback);
        }
    }
}
,isc.A._loadCurrentSettingsReply=function isc_VisualBuilder__loadCurrentSettingsReply(data,callback){
    var self=this;
    isc.DMI.callBuiltin({
        methodName:"xmlToJS",
        arguments:[data],
        requestParams:{
            willHandleError:true,
            timeout:6000
        },
        callback:function(rpcResponse,data){
            try{
                if(rpcResponse.status>=0){
                    self._restoreSettings(data);
                }
            }
            finally{
                self.fireCallback(callback);
            }
        }
    });
}
,isc.A._loadCurrentSettingsReplyJs=function isc_VisualBuilder__loadCurrentSettingsReplyJs(jsData,callback){
    try{
        this._restoreSettings(jsData);
    }finally{
        this.fireCallback(callback);
    }
}
,isc.A.userIsGuest=function isc_VisualBuilder_userIsGuest(){
    return!this.userId;
}
,isc.A.getProjectFileName=function isc_VisualBuilder_getProjectFileName(){
    return this.project?this.project.fileName:null;
}
,isc.A.getProjectDisplayName=function isc_VisualBuilder_getProjectDisplayName(){
    var name=this.project?this.project.name:null;
    if(!name)return"Untitled Project";
    if(name.endsWith(".proj.xml")){
        return name.slice(0,-9);
    }else if(name.endsWith(".xml")){
        return name.slice(0,-4);
    }else{
        return name;
    }
}
,isc.A.setProject=function isc_VisualBuilder_setProject(project){
    if(project==this.project)return;
    if(this.project){
        this.ignore(this.project,"setFileName");
        this.ignore(this.project,"setName");
        this.ignore(this.project,"setScreenProperties");
        this.ignore(this.project,"removeScreen");
        this.ignore(this.project,"removeGroup");
        if(this.dataSourceList)this.ignore(this.project.datasources,"dataChanged");
        this.project.builder=null;
    }
    this.project=project;
    if(project){
        project.projectDataSource=this.projectDataSource;
        project.screenDataSource=this.screenDataSource;
        this.observe(project,"setFileName","observer.updateProjectFileName();");
        this.observe(project,"setName","observer.updateProjectName();");
        this.observe(project,"setScreenProperties","observer.updateScreenProperties(returnVal);");
        this.observe(project,"removeScreen","observer.checkCurrentScreen();");
        this.observe(project,"removeGroup","observer.checkCurrentScreen();");
        if(this.dataSourceList)this.observe(project.datasources,"dataChanged","observer.updateDataSourceList();");
        project.builder=this;
    }
    this.updateProjectFileName();
    this.updateProjectName();
    if(this.screenList){
        this.screenList.setData(project?project.screens:isc.Tree.create());
    }
    if(this.dataSourceList)this.updateDataSourceList();
    if(this.project.currentScreenID&&!this.project.currentScreenFileName){
        this.project.currentScreenFileName=this._convertIDtoFileName(this.project.currentScreenID);
        delete this.project.currentScreenID;
    }
    delete this.currentScreen;
    if(this.initialScreen){
        this.loadScreen(null,this.initialScreen);
        delete this.initialScreen;
        return;
    }
    var foundProjectScreen;
    if(this.project.currentScreenFileName){
        var screen=this.project.findScreen(this.project.currentScreenFileName);
        if(screen&&screen.mockupMode==this.mockupMode){
            this.setCurrentScreen(screen);
            foundProjectScreen=true;
        }
    }
    if(!foundProjectScreen)this.openDefaultScreen();
}
,isc.A._convertIDtoFileName=function isc_VisualBuilder__convertIDtoFileName(id){
    var fileSpec=isc.DataSource.makeFileSpec(id);
    return fileSpec.fileName.split("/").last();
}
,isc.A.updateDataSourceList=function isc_VisualBuilder_updateDataSourceList(){
    var self=this;
    var pNodes=this.project.datasources.map(function(ds){
        var existingNode=self.dataSourceList.data.find("ID",ds.dsName);
        if(existingNode){
            return existingNode;
        }else{
            return self.projectComponents.editContext.makeDSPaletteNode(ds.dsName,ds.dsType);
        }
    });
    this.dataSourceList.setData(pNodes);
}
,isc.A.checkCurrentScreen=function isc_VisualBuilder_checkCurrentScreen(){
    if(this.currentScreen){
        var screen=this.project.findScreen(this.currentScreen.fileName);
        if(!screen)this.openDefaultScreen();
    }
}
,isc.A.openDefaultScreen=function isc_VisualBuilder_openDefaultScreen(){
    var screen;
    if(this.singleScreenMode){
        screen=this.project.untitledScreen();
    }else{
        screen=this.project.firstScreen(this.mockupMode);
    }
    if(!screen){
        screen=this.project.addScreen(null,null,"Untitled Screen");
        screen.mockupMode=this.mockupMode;
    }
    this.setCurrentScreen(screen);
}
,isc.A.updateProjectFileName=function isc_VisualBuilder_updateProjectFileName(){
    if(this.singleScreenMode)return;
    this.currentSettings.projectFileName=this.project.fileName;
    this.autoSaveCurrentSettings();
    this.updateRecentProjects();
}
,isc.A.updateProjectName=function isc_VisualBuilder_updateProjectName(){
    var name=this.getProjectDisplayName();
    if(this.projectMenuButton)this.projectMenuButton.setTitle(name);
    this.updateRecentProjects();
}
,isc.A.shareProject=function isc_VisualBuilder_shareProject(){
    var builder=this;
    var callback=function(){
        window.sharedProjects.fetchData({ownerId:window.user.username},function(dsResponse){
            var overwriteId=null;
            if(dsResponse.totalRows>=20){
                var overwriteId=dsResponse.data[0].id;
            }
            var shareId=isc.Math.randomUUID();
            var params=builder.getParamsForProjectRunner();
            window.sharedProjects[overwriteId===null?"addData":"updateData"]({
                id:overwriteId,
                shareId:shareId,
                parameters:isc.RPC.addParamsToURL("",params)
            },function(dsResponse){
                var shareURL=isc.RPC.addParamsToURL(builder.projectRunnerURL,{shareId:shareId});
                isc.say("Your screen has been shared at the following URL:<br><br>"
                            +"<a target=_blank href='"+shareURL+"'>"+shareURL+"</a>");
            });
        },{sortBy:"lastAccessed",startRow:0,endRow:1});
    }
    this[this.singleScreenMode?"confirmSaveScreen":"confirmSaveProject"](callback);
}
,isc.A.getParamsForProjectRunner=function isc_VisualBuilder_getParamsForProjectRunner(){
    var params={};
    if(this.singleScreenMode){
        isc.addProperties(params,{
            type:"screen",
            screen:this.currentScreen.fileName
        });
    }else{
        isc.addProperties(params,{
            type:"project",
            project:this.project.fileName
        });
        if(this.screenList){
            var record=this.screenList.getSelectedRecord();
            if(record)params.currentScreen=record.fileName;
        }
        if(this.project.currentScreenId!=null)params.screenId=this.project.currentScreenId;
    }
    return params;
}
,isc.A.runProject=function isc_VisualBuilder_runProject(){
    var builder=this;
    var callback=function(){
        if(!builder.project||!builder.project.fileName){
            isc.say("Project must be saved before you can run it");
            return;
        }
        window.open(isc.RPC.addParamsToURL(builder.projectRunnerURL,builder.getParamsForProjectRunner()));
    }
    this.saveUnsavedScreen(function(){
        builder[builder.singleScreenMode?"confirmSaveScreen":"confirmSaveProject"](callback);
    });
}
,isc.A.saveUnsavedScreen=function isc_VisualBuilder_saveUnsavedScreen(callback){
    var currentScreenName,
        _this=this;
    if(this.screenList){
        var record=this.screenList.getSelectedRecord();
        if(record)currentScreenName=record.fileName;
    }
    if(!currentScreenName){
        var confirmCallback=function(value){
            if(!value)return;
            _this.cacheCurrentScreenContents();
            _this.project.saveScreenContents(_this.currentScreen,false,function(screen){
                if(screen.fileName){
                    if(_this.project.fileName){
                        _this.project.save(function(){
                            _this.fireCallback(callback);
                        });
                    }else{
                        _this.fireCallback(callback);
                    }
                }
            });
        };
        var saveNow=isc.Button.create({
            title:"Save Now",
            click:function(){
                _this.fireCallback(confirmCallback,["value"],[true]);
                isc.dismissCurrentDialog();
            }
        });
        isc.confirm("The current screen must be saved before it can be run",confirmCallback,
                    {buttons:[saveNow,isc.Dialog.CANCEL]});
    }else{
        this.fireCallback(callback);
    }
}
,isc.A.confirmSaveScreen=function isc_VisualBuilder_confirmSaveScreen(callback){
    if(this.singleScreenMode&&this.currentScreen&&this.currentScreen.dirty){
        var self=this;
        isc.confirm("Save current screen?",function(response){
            if(response==true){
                self.saveScreenAs(self.currentScreen,callback);
            }else if(response==false){
                self.fireCallback(callback);
            }
        },{
            buttons:[isc.Dialog.YES,isc.Dialog.NO,isc.Dialog.CANCEL]
        });
    }else{
        this.fireCallback(callback);
    }
}
,isc.A.confirmSaveProject=function isc_VisualBuilder_confirmSaveProject(callback){
    if(!this.project||this.project.isEmpty()||this.getProjectFileName()){
        this.fireCallback(callback);
    }else{
        var self=this;
        isc.confirm("Save current project?",function(response){
            if(response==true){
                self.project.save(callback);
            }else if(response==false){
                self.fireCallback(callback);
            }
        },{
            buttons:[isc.Dialog.YES,isc.Dialog.NO,isc.Dialog.CANCEL]
        });
    }
}
,isc.A.makeDefaultProject=function isc_VisualBuilder_makeDefaultProject(){
    var self=this;
    isc.RPCManager.sendRequest({
        actionURL:self.defaultProjectURL,
        willHandleError:true,
        httpMethod:'GET',
        useSimpleHttp:true,
        timeout:6000,
        callback:function(response,data,request){
            if(response.status>=0&&data){
                self.loadProjectReply(response,{
                    fileContents:data
                },request);
            }else{
                self.makeNewProject();
            }
        }
    });
}
,isc.A.makeNewProject=function isc_VisualBuilder_makeNewProject(){
    var project=isc.Project.create();
    this.setProject(project);
}
,isc.A.showLoadProjectUI=function isc_VisualBuilder_showLoadProjectUI(){
    if(!this.loadProjectDialog)this.loadProjectDialog=this.createAutoChild('loadProjectDialog',{
        dataSource:this.projectDataSource
    });
    this.loadProjectDialog.showLoadFileUI({
        target:this,
        methodName:"loadProjectReply"
    });
}
,isc.A.loadProjectReply=function isc_VisualBuilder_loadProjectReply(dsResponse,data,dsRequest){

    if(!data||!data.fileContents){
        isc.warn("Failed to load project");
        return;
    }
    if(data.fileContentsJS){
        this.loadProjectReplyJs(data);
    }else{
        var self=this;
        isc.DMI.callBuiltin({
            methodName:"xmlToJS",
            arguments:[data.fileContents],
            callback:function(rpcResponse,jsData){
                data.fileContentsJS=jsData;
                self.loadProjectReplyJs(data);
            }
        });
    }
}
,isc.A.loadProjectReplyJs=function isc_VisualBuilder_loadProjectReplyJs(data){

    var project=isc.eval(data.fileContentsJS);
    if(project.screens){
        project.screens.getAllNodes().map(function(node){

            if(node.contents)node.dirty=new Date();
            if(isc.isA.String(node.mockupMode)){
                node.mockupMode=(node.mockupMode=="true");
            }
            if(node.screenID){
                node.fileName=this._convertIDtoFileName(node.screenID);
                delete node.screenID;
            }
        });
    }
    project.setFileName(data.fileName);
    project.setName(data.fileName);
    this.setProject(project);
}
,isc.A.loadProject=function isc_VisualBuilder_loadProject(fileName){
    if(!fileName){
        this.logWarn("Tried to loadProject without a fileName");
        return;
    }
    var self=this;
    this.projectDataSource.getFile({
        fileName:fileName,
        fileType:'proj',
        fileFormat:'xml'
    },function(dsResponse,data,dsRequest){
        if(dsResponse.status==0&&isc.isAn.Array(dsResponse.data)&&dsResponse.data.length>0){
            self.loadProjectReply(dsResponse,dsResponse.data[0],dsRequest);
        }else{
            isc.warn("Error loading project: "+fileName);
        }
    },{
        willHandleError:true,
        operationId:"xmlToJs"
    });
}
,isc.A.getRecentProjects=function isc_VisualBuilder_getRecentProjects(){
    if(!this.recentProjects)this.recentProjects=[];
    return this.recentProjects;
}
,isc.A.setRecentProjects=function isc_VisualBuilder_setRecentProjects(projects){
    var recent=this.getRecentProjects();
    recent.setLength(0);
    recent.addList(projects);
}
,isc.A.updateRecentProjects=function isc_VisualBuilder_updateRecentProjects(){
    var projectFileName=this.getProjectFileName();
    if(!projectFileName||projectFileName==this.singleScreenModeProjectFileName)return;
    var projects=this.getRecentProjects();
    var currentIndex=projects.findIndex("projectFileName",projectFileName);
    if(currentIndex!=-1)projects.removeAt(currentIndex);
    projects.addAt({
        projectFileName:projectFileName,
        title:this.getProjectDisplayName()
    },0);
    if(projects.getLength()>this.recentProjectsCount){
        projects.setLength(this.recentProjectsCount);
    }
    this.currentSettings.recentProjects=projects;
    this.autoSaveCurrentSettings();
}
,isc.A.launchReifyPreview=function isc_VisualBuilder_launchReifyPreview(){
    var builder=this,
        project=this.project,
        screen=this.currentScreen,
        params="?reifyPreview=yes";
    var callback=function(){
        builder.reifyWindow=window.open("/tools/bmmlImporter.jsp"+params);
    };
    var offline=isc.isA.OfflineFileSource(this.screenDataSource);
    if(!offline)params+="&screenDS="+builder.screenDataSource.getID();
    if(screen.fileName){
        params+="&mockup="+screen.fileName;
        builder.cacheCurrentScreenContents();
        builder.project.saveScreenContents(screen,true,callback);
    }else{
        if(project.fileName){
            params+="&mockup="+project.fileName+
                "&projectDS="+(offline?"":builder.projectDataSource.getID());
        }
        project.autoSave(callback);
    }
}
,isc.A.launchGoToBuilder=function isc_VisualBuilder_launchGoToBuilder(){
    var builder=this,
        project=this.project,
        screen=this.currentScreen;
    if(screen==null)return;
    builder.cacheCurrentScreenContents();
    if(builder.openFullBuilderSeparately){
        this.fireCallback("_launchGoToBuilder");
    }else if(screen.fileName){
        builder.project.saveScreenContents(screen,true,"_launchGoToBuilder");
    }else{
        project.autoSave("_launchGoToBuilder");
    }
}
,isc.A._launchGoToBuilder=function isc_VisualBuilder__launchGoToBuilder(){
    var builder=this,
        project=this.project,
        screen=this.currentScreen,
        importer=isc.MockupImporter.create(),
        separateWindow=builder.openFullBuilderSeparately
    ;
    importer.reifyComponentXml(screen.contents,function(xmlContent,layout){
        isc.DMI.callBuiltin({
            methodName:"xmlToJS",
            "arguments":xmlContent,
            callback:function(rpcResponse,data,rpcRequest){
                var origAutoDraw=isc.Canvas.getPrototype().autoDraw;
                isc.setAutoDraw(false);
                var topLevelIds=[];
                isc.Class.globalEvalAndRestore(rpcResponse.data+"; getTopLevelWidgets()",
                    null,null,{getTopLevelWidgets:function(){
                        for(var i=0;i<layout.length;i++){
                            if(layout[i]._constructor!="ValuesManager"&&
                                layout[i]._constructor!="MockDataSource"&&
                                window[layout[i].ID].parentElement==null)
                            {
                                window[layout[i].ID].destroy();
                                topLevelIds.add(layout[i].ID);
                            }
                        }
                }});
                xmlContent+=isc.MockupImporter.getDataViewXml(topLevelIds);
                isc.setAutoDraw(origAutoDraw);
                project.saveGoToBuilderScreen("New Screen",xmlContent,
                                              function(response,data){
                    var uriBuilder=isc.URIBuilder.create(builder.fullBuilderURL||
                                                           window.location.href);
                    uriBuilder.setQueryParam("currentScreen",data.fileName);
                    uriBuilder.setQueryParam("mockups",0);
                    if(separateWindow)window.open(uriBuilder.uri);
                    else window.location.assign(uriBuilder.uri);
                });
            }
        });
    });
}
,isc.A.updateReifyPreviewSoon=function isc_VisualBuilder_updateReifyPreviewSoon(){
    var builder=this;
    if(builder.pendingActionOnPause("updateReify"))return;
    var reifyWindow=builder.reifyWindow;
    builder.fireOnPause("updateReify",function(){
        if(reifyWindow.closed){
            delete builder.reifyWindow;
        }else{
            reifyWindow.scheduleReifyUpdate();
        }
    },this._updateReifyPreviewDelay);
}
,isc.A.confirmMenuAction=function isc_VisualBuilder_confirmMenuAction(actionId,actionName,actionMethod,actionWidth,message){
    var dialog,builder=this;
    var confirm=this.getHelpDialogEnabled(actionId);
    if(!confirm)return this[actionMethod]();
    var form=isc.DynamicForm.create({
        width:500,autoDraw:false,
        bottomPadding:5,topPadding:5,cellPadding:5,
        numCols:3,colWidths:[50,actionWidth,"*"],
        items:[{showTitle:false,editorType:"CanvasItem",height:50,
                 icons:[{width:32,height:32,src:"[SKIN]/Dialog/confirm.png"}]},
                {name:"message",editorType:"StaticTextItem",showTitle:false,
                 colSpan:2,cellHeight:50,height:50,
                 value:message},
                {editorType:"ButtonItem",title:actionName,
                 align:"right",endRow:false,colSpan:2,
                 click:function(){
                     builder[actionMethod]();
                     dialog.destroy();
                 }},
                {editorType:"ButtonItem",title:"Cancel",startRow:false,
                 click:function(){dialog.destroy();}},
                {name:"hide",editorType:"CheckboxItem",
                 title:"Don't show this message again",
                 changed:function(form,item,value){
                     builder.setHelpDialogEnabled(actionId,!value);
                 },
                 showIf:function(){
                     return!builder.hostedmode||!builder.userIsGuest()
                 }}]
    });
    dialog=isc.Window.create({
        title:"Confirm",autoSize:true,items:[form],autoCenter:true
    });
    dialog.show();
}
,isc.A.confirmReifyPreview=function isc_VisualBuilder_confirmReifyPreview(){
    this.confirmMenuAction(this._confirmReifyPreviewId,"Reify now","launchReifyPreview",200,
        "Reify Preview will analyze your mockup and produce a screen from it, and show that "+
                           "screen in a new browser window.  If you continue to change your "+
                           "mockup, the Reify Preview window will automatically update.");
}
,isc.A.confirmOpenInBuilder=function isc_VisualBuilder_confirmOpenInBuilder(){
    this.confirmMenuAction(this._confirmOpenInBuilderId,"Go to Visual Builder",
                           "launchGoToBuilder",235,"Visual Builder is a tool that allows "+
                           "you to add more advanced capabilities to your mockup.<p>"+
                           "You can use Visual Builder to take the next steps required to "+
                           "turn your mockup into a working application, or just to produce "+
                           "a high-fidelity mockup for usability or user acceptance testing.");
}
);
isc.evalBoundary;isc.B.push(isc.A.setHelpDialogEnabled=function isc_VisualBuilder_setHelpDialogEnabled(dialogId,value,callback){
    var settings=this.currentSettings,
        helpDialogs=settings.helpDialogs||{}
    ;
    if(this.hostedMode&&this.userIsGuest()){
        this.logInfo("setHelpDialogEnabled(): settings may not be changed by guest");
        return;
    }
    if(!isc.isA.String(dialogId)){
        this.logWarn("setHelpDialogEnabled() called with an invalid dialogId: "+dialogId);
        return;
    }
    helpDialogs[dialogId]=!!value;
    settings.helpDialogs=helpDialogs;
    this.autoSaveCurrentSettings(callback);
}
,isc.A.getHelpDialogEnabled=function isc_VisualBuilder_getHelpDialogEnabled(dialogId){
    var settings=this.currentSettings,
        helpDialogs=settings.helpDialogs||{}
    ;
    return(this.hostedMode&&this.userIsGuest())||helpDialogs[dialogId]!=false;
}
,isc.A.showAddScreenGroupUI=function isc_VisualBuilder_showAddScreenGroupUI(parent){
    var group=this.project.addGroup(parent,"New Group");
    var index=this.screenList.getRecordIndex(group);
    this.screenList.delayCall("startEditing",[index,0]);
}
,isc.A.loadScreen=function isc_VisualBuilder_loadScreen(parent,fileName){
    var self=this,
        callback=function(dsResponse,data,dsRequest){
            if(!fileName){
                fileName=data.fileName;
                data=data.fileContents;
            }
            var screen=self.project.addScreen(parent,fileName,fileName,data,false);
            self.setCurrentScreen(screen);
    };
    if(fileName){
        this.screenDataSource.getFile({
            fileName:fileName,fileType:'ui',fileFormat:'xml'
        },callback);
    }else{
        if(!this.loadScreenDialog){
            this.loadScreenDialog=this.createAutoChild('loadScreenDialog',{
                dataSource:this.screenDataSource
            });
        }
        this.loadScreenDialog.showLoadFileUI(callback);
    }
}
,isc.A.showAddScreenUI=function isc_VisualBuilder_showAddScreenUI(parent){
    this.loadScreen(parent);
}
,isc.A.deleteScreen=function isc_VisualBuilder_deleteScreen(screen){
    var self=this;
    this.screenDataSource.removeFile({
        fileName:screen.fileName,
        fileType:'ui',
        fileFormat:'xml'
    },function(){
        self.project.removeScreen(screen);
    });
}
,isc.A.cacheCurrentScreenContents=function isc_VisualBuilder_cacheCurrentScreenContents(){
    if(this.currentScreen==null)return;
    this.currentScreen.contents=this.getUpdatedSource();
}
,isc.A.setCurrentScreen=function isc_VisualBuilder_setCurrentScreen(newScreen){
    var oldScreen=this.currentScreen,
        oldMockupMode=(oldScreen?this.currentScreen.mockupMode:null)
    ;
    if(oldScreen==newScreen)return;
    this.cacheCurrentScreenContents();
    this.currentScreen=newScreen;
    if(!this.projectComponentsMenu)this.addChildren();
    if(newScreen){
        if(newScreen.contents){
            this.withoutDirtyTracking(function(){
                this.projectComponents.destroyAll();
            });
            this.setScreenContents(newScreen.contents,oldMockupMode);
        }else{
            this.withoutDirtyTracking(function(){
                this.clearScreenUI();
            });
            var self=this;
            this.project.fetchScreenContents(newScreen,function(contents){
                if(contents){
                    self.withoutDirtyTracking(function(){
                        self.projectComponents.destroyAll();
                    });
                    self.setScreenContents(contents,oldMockupMode);
                }else{
                    self.updateScreenTitle();
                    self.showScreenUI();
                    self.refreshLibraryComponents();
                    self.updateRunMenuControl();
                }
            });
        }
    }else{
        this.show();
        this.updateScreenTitle();
    }
    this.project.setCurrentScreenFileName(newScreen.fileName);
    this.project.setCurrentScreenId(newScreen.id);
    if(this.screenList)this.screenList.selectSingleRecord(newScreen);
}
,isc.A.setScreenContents=function isc_VisualBuilder_setScreenContents(contents,oldMockupMode){
    var _this=this;
    this.projectComponents.getPaletteNodesFromXML(contents,function(paletteNodes){
        var firstNode=(paletteNodes&&paletteNodes.length>0?paletteNodes[0]:null),
            lastNode=(paletteNodes&&paletteNodes.length>0?paletteNodes[paletteNodes.length-1]:null)
        ;
        if((firstNode&&firstNode.type=="MockupContainer")||
            (lastNode&&lastNode.type=="MockupContainer"))
        {
            var containerNode=(firstNode.type=="MockupContainer"?firstNode:lastNode),
                defaults=containerNode.defaults,
                nodeList=paletteNodes
            ;
            if(defaults.dataSources||defaults.components){
                nodeList=[];
                nodeList.addList(defaults.dataSources);
                nodeList.addList(defaults.components);
            }
            var nodes=[];
            for(var i=0;i<nodeList.length;i++){
                var node=nodeList[i],
                    type=node.type||node._constructor
                ;
                if(type&&type!="MockupContainer"){
                    var defaults=(node.defaults?node.defaults:isc.addProperties({},node));
                    nodes.add({
                        type:type,
                        defaults:defaults
                    });
                }
            }
            _this.mockupMode=_this.currentScreen.mockupMode=true;
            _this.refreshLibraryComponents(function(){
                _this.updateScreenTitle();
                if(oldMockupMode!=_this.currentScreen.mockupMode){
                    _this.showScreenUI();
                }
                if(nodes)_this.projectComponents.addFromPaletteNodes(nodes);
                _this.updateSelectionActionButtons();
            });
        }else{
            _this.mockupMode=_this.currentScreen.mockupMode=false;
            _this.refreshLibraryComponents(function(){
                _this.updateScreenTitle();
                if(oldMockupMode!=_this.currentScreen.mockupMode){
                    _this.showScreenUI();
                }
                if(paletteNodes)_this.projectComponents.addFromPaletteNodes(paletteNodes);
                _this.updateSelectionActionButtons();
            });
        }
        _this.updateRunMenuControl();
    });
}
,isc.A.updateScreenProperties=function isc_VisualBuilder_updateScreenProperties(screen){
    if(this.screenList){
        var index=this.screenList.getRecordIndex(screen);
        if(index>=0){
            this.screenList.refreshRow(index);
            this.screenList.applyHilites();
        }
    }
    this.updateScreenTitle();
}
,isc.A.getCurrentScreenTitle=function isc_VisualBuilder_getCurrentScreenTitle(){
    var title="Untitled screen";
    if(this.currentScreen&&this.currentScreen.title){
        title=this.currentScreen.title;
        if(title.endsWith(".xml"))title=title.slice(0,-4);
    }
    return title;
}
,isc.A.updateScreenTitle=function isc_VisualBuilder_updateScreenTitle(){
    if(this.middleStack){
        var mockupMode=this.getScreenMockupMode(this.currentScreen),
            title=(mockupMode&&this.singleScreenMode?"Mockup":this.getCurrentScreenTitle()),
            canCollapse=(!mockupMode||!this.singleScreenMode)
        ;
        var sectionNumber=this.middleStack.getSectionNumber("applicationSection");
        if(canCollapse!=this.middleStack.sections[sectionNumber].canCollapse&&this.middleStack.isDrawn()){
            var header=this.middleStack.getSectionHeader(sectionNumber),
                section=this.middleStack.sections[sectionNumber],
                members=header.controlsLayout.getMembers(),
                previewArea=section.items[0],
                controls=[]
            ;
            for(var i=members.length-1;i>=0;i--){
                controls.addAt(members[i],0);
                header.controlsLayout.removeMember(members[i]);
            }
            section.items=[];
            this.middleStack.removeSection(section);
            this.middleStack.addSection({title:title,autoShow:true,ID:"applicationSection",
                canCollapse:canCollapse,
                items:[previewArea],
                controls:controls
            },0);
        }else{
            this.middleStack.setSectionTitle("applicationSection",title);
            this.middleStack.getSections()[0].canCollapse=canCollapse;
        }
    }
    if(this.runButton)this.runButton.setDisabled(!this._runProjectEnabled());
}
,isc.A.getScreenMockupMode=function isc_VisualBuilder_getScreenMockupMode(screen){
    if(!screen)return this.mockupMode;
    var mockupMode=(screen.mockupMode!=null?screen.mockupMode:this.mockupMode);
    if(isc.isA.String(mockupMode))mockupMode=(mockupMode=="true");
    return mockupMode;
}
,isc.A.saveScreenAs=function isc_VisualBuilder_saveScreenAs(screen,callback){
    this.cacheCurrentScreenContents();
    var self=this;
    this.project.saveScreenAs(screen,function(newScreen){
        if(callback){
            self.fireCallback(callback);
        }else if(screen==self.currentScreen){
            self.setCurrentScreen(newScreen);
        }
    });
}
,isc.A.revertScreen=function isc_VisualBuilder_revertScreen(screen,version){
    if(screen==this.currentScreen)this.cacheCurrentScreenContents();
    var oldContents=screen.contents;
    delete screen.contents;
    var self=this;
    this.project.fetchScreenContents(screen,function(contents){
        if(contents){
            if(screen==self.currentScreen){
                self.withoutDirtyTracking(function(){
                    self.projectComponents.destroyAll();
                });
                self.projectComponents.addPaletteNodesFromXML(contents);
            }
            screen.oldVersionLoaded=version!=null;
        }else{
            isc.say("Reversion failed.");
            screen.contents=oldContents;
        }
    },version);
}
,isc.A.loadViewFromXML=function isc_VisualBuilder_loadViewFromXML(screen,contents){
    this.cacheCurrentScreenContents();
    screen.contents=contents;
    this.project.setScreenDirty(screen,false);
    var self=this;
    this.withoutDirtyTracking(function(){
        self.projectComponents.destroyAll();
    });
    var oldMockupMode=(this.currentScreen?this.currentScreen.mockupMode:null);
    this.setScreenContents(screen.contents,oldMockupMode);
}
,isc.A._exportScreenAsJSP=function isc_VisualBuilder__exportScreenAsJSP(screen){
    var _builder=this;
    var additionalModules="Drawing,Analytics,DocViewer,VisualBuilder";
    if(screen==this.currentScreen)this.cacheCurrentScreenContents();
    var page='<%@ page contentType="text/html; charset=UTF-8"%>\n'+
                '<%@ taglib uri="/WEB-INF/iscTaglib.xml" prefix="isomorphic" %>\n'+
                '<HTML><HEAD><TITLE>'+
                screen.title+
                '</TITLE>\n'+
                '<isomorphic:loadISC skin="'+
                _builder.skin+
                '"'+
                (_builder.modulesDir?' modulesDir="'+_builder.modulesDir+'"':"")+
                (additionalModules?(' includeModules="'+additionalModules+'"'):"")
                +'/>\n </HEAD><BODY>\n';
    for(var i=0;i<_builder.globalDependencies.deps.length;i++){
        var dep=_builder.globalDependencies.deps[i];
        if(dep.type=="js"){
            page+='<SCRIPT SRC='+
            (dep.url.startsWith("/")?
                _builder.webRootRelWorkspace:
                _builder.basePathRelWorkspace+"/"
                )+
            dep.url+
            '></SCRIPT>\n';
        }else if(dep.type=="schema"){
            page+='<SCRIPT>\n<isomorphic:loadDS name="'+dep.id+'"/></SCRIPT>\n';
        }else if(dep.type=="ui"){
            page+='<SCRIPT>\n<isomorphic:loadUI name="'+dep.id+'"/></SCRIPT>\n';
        }else if(dep.type=="css"){
            page+='<LINK REL="stylesheet" TYPE="text/css" HREF='+
            (dep.url.startsWith("/")?
                _builder.webRootRelWorkspace:
                _builder.basePathRelWorkspace+"/"
                )+
            dep.url+
            '>\n';
        }
    }
    page+='<SCRIPT>\n'+
            'isc.Page.setAppImgDir("'+_builder.basePathRelWorkspace+'/graphics/");\n'+
            '<isomorphic:XML>\n'+screen.contents+'\n</isomorphic:XML>'+
            '</SCRIPT>\n'+
            '</BODY></HTML>';
    return page;
}
,isc.A.exportScreenAsJSP=function isc_VisualBuilder_exportScreenAsJSP(screen){
    var _builder=this,
        page=this._exportScreenAsJSP(screen);
    this.addAutoChild("jspFileSource");
    this.jspFileSource.showSaveFileUI(page,function(dsResponse,data,dsRequest){
        if(!isc.isAn.Array(data))data=[data];
        var url=window.location.href;
        if(url.indexOf("?")>0)url=url.substring(0,url.indexOf("?"));
        url=url.substring(0,url.lastIndexOf("/"));
        url+=(url.endsWith("/")?"":"/")+_builder.workspaceURL+data[0].name;
        isc.say(
            "Your screen can be accessed at:<P>"+
            "<a target=_blank href='"+
            url+"'>"+url+"</a>"
        );
    });
}
,isc.A.markDirty=function isc_VisualBuilder_markDirty(){
    if(!this.disableDirtyTracking&&!isc._loadingNodeTree&&this.project){
        this.project.setScreenDirty(this.currentScreen,true);
    }
}
,isc.A.withoutDirtyTracking=function isc_VisualBuilder_withoutDirtyTracking(callback){
    try{
        this.disableDirtyTracking+=1;
        this.fireCallback(callback);
    }
    finally{
        this.disableDirtyTracking-=1;
    }
}
,isc.A.previewAreaResized=function isc_VisualBuilder_previewAreaResized(){
    if(!this.modeSwitcher)return;
    var width=this.rootLiveObject.getVisibleWidth();
    var height=this.rootLiveObject.getVisibleHeight();
    var value=width+"x"+height;
    var resolutionField=this.modeSwitcher.getField("resolution");
    var values=resolutionField.getValueMap();
    var found=false;
    for(var i=0;i<values.length;i++){
        if(values[i].startsWith(""+width)&&!values[i].contains("[fit to browser]")){
            found=true;
            break;
        }
    }
    if(!found){
        value+=" [fit to browser]";
        if(resolutionField.getValueMap()[0].indexOf("[fit to browser]")<0){
            resolutionField.getValueMap().addAt(value,0);
        }else{
            resolutionField.getValueMap()[0]=value;
        }
    }
    this.modeSwitcher.setValue("resolution",value);
}
,isc.A.showImportDialog=function isc_VisualBuilder_showImportDialog(menu){
    if(!this._importDialog){
        this._importDialog=isc.LoadFileDialog.create({
            actionStripControls:["spacer:10","pathLabel","previousFolderButton","spacer:10",
                                  "upOneLevelButton","spacer:10","refreshButton","spacer:2"],
            directoryListingProperties:{
                canEdit:false
            },
            title:"Import File",
            rootDir:"/",
            initialDir:"[VBWORKSPACE]",
            webrootOnly:false,
            loadFile:function(fileName){
                if(fileName.match(/\.(xml|js)$/i)==null){
                    isc.say("Only JS or XML files may be imported (must end with .js or .xml");
                    return;
                }
                var self=this;
                isc.DMI.callBuiltin({
                    methodName:"loadFile",
                    arguments:[this.currentDir+"/"+fileName],
                    callback:function(rpcResponse){
                        if(fileName.match(/\.xml$/i)!=null){
                            isc.DMI.callBuiltin({
                                methodName:"xmlToJS",
                                arguments:rpcResponse.data,
                                callback:function(rpcResponse){
                                    self.fileLoaded(rpcResponse.data);
                                }
                            });
                        }else{
                            self.fileLoaded(rpcResponse.data);
                        }
                    }
                });
            },
            fileLoaded:function(jsCode){
                var screen=menu.creator.project.addScreen(null,null,"Imported Screen");
                menu.creator.setCurrentScreen(screen);
                menu.creator.projectComponents.destroyAll();
                menu.creator.projectComponents.addPaletteNodesFromJS(jsCode);
                this.hide();
            }
        });
    }else{
        this._importDialog.directoryListing.data.invalidateCache();
    }
    this._importDialog.show();
}
,isc.A.showMultiActionWindow=function isc_VisualBuilder_showMultiActionWindow(actionMenu){
    var multiActionWindow=this.multiActionWindow;
    if(multiActionWindow==null||multiActionWindow.destroyed){
        multiActionWindow=this.multiActionWindow=this.createAutoChild("multiActionWindow");
    }
    multiActionWindow.setTitle(actionMenu.sourceComponent.ID+" "+actionMenu.sourceMethod+"() Actions");
    var multiActionPanel=this.multiActionPanel;
    if(multiActionPanel==null||multiActionPanel.destroyed){
        multiActionPanel=this.multiActionPanel=this.createAutoChild("multiActionPanel",{
            builder:this,
            cancelClick:function(){
                this.builder.multiActionWindow.hide();
            }
        });
        if(multiActionWindow.items!=null)multiActionWindow.removeItems(multiActionWindow.items);
        multiActionWindow.addItems([multiActionPanel]);
    }
    multiActionPanel.configureFor(actionMenu);
    multiActionPanel.saveClick=function(bindings){
        this.builder.multiActionWindow.hide();
        actionMenu.bindingComplete(bindings);
    };
    var builder=this;
    multiActionPanel.getActionTitle=function(targetComponentId,actionId){
        return builder.getActionTitle(targetComponentId,actionId);
    }
    multiActionWindow.show();
}
,isc.A.loadBMMLMockup=function isc_VisualBuilder_loadBMMLMockup(mockupName,fileContent,dropMarkup,trimSpace,fillSpace,fieldNamingConvention){
    isc.showPrompt("Importing mockup... ${loadingImage}");
    var vb=this,
        callback=function(rpcResponse){
            var bmmlImporter=isc.MockupImporter.create({
                dropMarkup:dropMarkup==null?true:dropMarkup,
                trimSpace:trimSpace==null?true:trimSpace,
                fillSpace:fillSpace==null?true:fillSpace,
                mockupPath:mockupName,
                fieldNamingConvention:fieldNamingConvention
            });
            bmmlImporter.bmmlToXml(rpcResponse.data,function(xmlContent){
                if(xmlContent){
                    var screen=vb.project.addScreen(null,null,"Imported BMML");
                    vb.setCurrentScreen(screen);
                    vb.projectComponents.destroyAll();
                    vb.projectComponents.getPaletteNodesFromXML(xmlContent,function(nodes){
                        for(var i=0;i<nodes.length;i++){
                            var node=nodes[i];
                            if(
                                node.autoDraw!==false&&
                                node.component&&
                                node.component.defaults
                            ){
                                delete node.component.defaults.autoDraw;
                            }
                        }
                        vb.projectComponents.addFromPaletteNodes(nodes);
                        isc.clearPrompt();
                    });
                }else{
                    isc.clearPrompt();
                }
            });
        }
    ;
    if(mockupName.match(/^https?:\/\//,"i")){
        isc.RPCManager.sendRequest({
            useHttpProxy:true,
            actionURL:mockupName,
            callback:callback
        });
    }else{
        if(fileContent!=null){
           callback({data:fileContent});
        }else{
            isc.DMI.callBuiltin({
                methodName:"loadFile",
                arguments:[mockupName],
                callback:callback
            });
        }
    }
}
,isc.A.getServiceElementIcon=function isc_VisualBuilder_getServiceElementIcon(elementNode){
    var type=elementNode.serviceType;
    if(type=="service"||type=="categoryProject")return"service.png";
    else if(type=="portType")return"portType.png";
    else if(type=="operation")return"operation.png";
    else if(type=="message_in")return"email_in.png";
    else if(type=="message_out")return"email_out.png";
    else if(type=="simpleType")return"page_single.png";
    else if(type=="complexType")return"page_multiple.png";
    return null;
}
,isc.A.updateComponentRuleScopeProperties=function isc_VisualBuilder_updateComponentRuleScopeProperties(component,changes,deletes,className){
    var type=isc.DS.getNearestSchema(className||component.getClassName());
    var fieldNames=this._getTypeFieldnames(type);
    if(fieldNames){
        var editContext=this.projectComponents.getEditContext(),
            editNode=editContext.getEditNodeArray().find("liveObject",component)
        ;
        if(!editNode)return;
        for(var i=0;i<fieldNames.length;i++){
            var fieldName=fieldNames[i];
            var groupNames=isc.jsdoc.getAllGroupsForAttribute(type.ID,fieldName);
            if(groupNames!=null&&(groupNames.contains("dynamicCriteria")||groupNames.contains("ruleCriteria"))){
                var criteria=editNode.defaults[fieldName];
                if(criteria){
                    if(deletes&&deletes.length>0&&this._criteriaHasMatchingValuePath(criteria,deletes)){
                        this.projectComponents.removeNodeProperties(editNode,fieldName);
                    }else if(changes&&changes.length>0&&this._replaceCriteriaValuePaths(criteria,changes)){
                        var properties={};
                        properties[fieldName]=criteria;
                        this.projectComponents.setNodeProperties(editNode,properties);
                    }
                }
            }
            var field=type.getField(fieldName);
            if(field&&(field.type=="UserFormula"||field.type=="UserSummary")&&(field.useRuleScope==true||field.useRuleScope=="true")){
                var formula=editNode.defaults[fieldName];
                if(formula&&formula.text){
                    if(deletes&&deletes.length>0&&this._formulaHasVariable(formula,deletes)){
                        this.projectComponents.removeNodeProperties(editNode,fieldName);
                    }else if(changes&&changes.length>0&&this._replaceFormulaVariables(formula,changes)){
                        var properties={};
                        properties[fieldName]=formula;
                        this.projectComponents.setNodeProperties(editNode,properties);
                    }
                }
            }
        }
    }
    if(isc.isA.DynamicForm(component)){
        var items=component.items;
        for(var i=0;i<items.length;i++){
            this.updateComponentRuleScopeProperties(items[i],changes,deletes);
        }
    }
    if(isc.isA.ListGrid(component)){
        var fields=component.getAllFields();
        for(var i=0;i<fields.length;i++){
            this.updateComponentRuleScopeProperties(fields[i],changes,deletes,"ListGridField");
        }
    }
}
,isc.A._getTypeFieldnames=function isc_VisualBuilder__getTypeFieldnames(type){
    var fieldNames;
    if(type&&type.fields){
        fieldNames=this._cachedTypeFieldnames[type.ID];
        if(!fieldNames){
            fieldNames=(isc.isAn.Array(type.fields)?type.fields.getProperty("name"):isc.getKeys(type.fields));
            var classObj=isc.ClassFactory.getClass(type.ID);
            if(classObj){
                var superClass=classObj.getSuperClass();
                if(superClass){
                    var superType=isc.DS.getNearestSchema(superClass.getClassName()),
                        superFieldNames=this._getTypeFieldnames(superType)
                    ;
                    if(superFieldNames){
                        fieldNames.addList(superFieldNames);
                    }
                }
            }
            this._cachedTypeFieldnames[type.ID]=fieldNames;
        }
    }
    return fieldNames;
}
,isc.A._replaceCriteriaValuePaths=function isc_VisualBuilder__replaceCriteriaValuePaths(criteria,changes){
    var operator=criteria.operator,
        changed=false
    ;
    if(operator=="and"||operator=="or"){
        var innerCriteria=criteria.criteria;
        for(var i=0;i<innerCriteria.length;i++){
            if(this._replaceCriteriaValuePaths(innerCriteria[i],changes)){
                changed=true;
            }
        }
    }else{
        for(var i=0;i<changes.length;i++){
            var change=changes[i];
            if(criteria.valuePath!=null){
                var newValuePath=criteria.valuePath.replace(change.pattern,change.replacement);
                if(criteria.valuePath!=newValuePath){
                    criteria.valuePath=newValuePath;
                    changed=true;
                }
            }
            if(criteria.fieldName!=null){
                var newFieldName=criteria.fieldName.replace(change.pattern,change.replacement);
                if(criteria.fieldName!=newFieldName){
                    criteria.fieldName=newFieldName;
                    changed=true;
                }
            }
        }
    }
    return changed;
}
,isc.A._criteriaHasMatchingValuePath=function isc_VisualBuilder__criteriaHasMatchingValuePath(criteria,deletes){
    var operator=criteria.operator;
    if(operator=="and"||operator=="or"){
        var innerCriteria=criteria.criteria;
        for(var i=0;i<innerCriteria.length;i++){
            if(this._criteriaHasMatchingValuePath(innerCriteria[i],deletes)){
                return true;
            }
        }
    }else{
        for(var i=0;i<deletes.length;i++){
            var pattern=deletes[i];
            if((criteria.valuePath!=null&&criteria.valuePath.match(pattern))||
                (criteria.fieldName!=null&&criteria.fieldName.match(pattern)))
            {
                return true;
            }
        }
    }
    return false;
}
,isc.A._replaceFormulaVariables=function isc_VisualBuilder__replaceFormulaVariables(formula,changes){
    if(!formula.text)return false;
    var changed=false;
    for(var i=0;i<changes.length;i++){
        var change=changes[i];
        var newText=formula.text.replace(change.pattern,change.replacement);
        if(formula.text!=newText){
            formula.text=newText;
            changed=true;
        }
    }
    return changed;
}
,isc.A._formulaHasVariable=function isc_VisualBuilder__formulaHasVariable(formula,deletes){
    if(!formula.text)return false;
    for(var i=0;i<deletes.length;i++){
        var pattern=deletes[i];
        if(formula.text.match(pattern))return true;
    }
    return false;
}
,isc.A.keyPress=function isc_VisualBuilder_keyPress(){
    if(isc.EH.getKey()=="Delete"){
        if(!this.editingOn)return;
        var selected=isc.SelectionOutline.getSelectedObject();
        if(selected&&selected.editContext){
            selected.editContext.destroyNode(selected.editNode);
            return false;
        }
    }
}
,isc.A.destroy=function isc_VisualBuilder_destroy(){
    this.setProject(null);
    this.ignore(this.projectComponents,"setNodeProperties");
    this.Super("destroy",arguments);
}
,isc.A.init=function isc_VisualBuilder_init(){
    this.screenMenuDefaults={
        _constructor:"Menu",
        title:"Screen",
        width:60,
        data:[{
            title:"New screen",
            click:function(target,item,menu){
                var builder=menu.creator;
                builder.confirmSaveScreen(function(){
                    var screen=builder.project.addScreen(null,null,"Untitled Screen");
                    screen.mockupMode=builder.mockupMode;
                    builder.setCurrentScreen(screen);
                });
            }
        },{
            title:"Open screen...",
            click:function(target,item,menu){
                menu.creator.confirmSaveScreen(function(){
                    menu.creator.showAddScreenUI();
                });
            }
        },{
            title:"Import screen...",
            enabled:this.filesystemDataSourceEnabled,
            click:function(target,item,menu){
                menu.creator.confirmSaveScreen(function(){
                    var refDocURL="../../isomorphic/system/reference/SmartClient_Reference.html#group..visualBuilder";
                    isc.ask("This feature allows you to import externally edited XML or JS code."+
                            " The Visual Builder cannot fully capture all externally edited files."+
                            " For more information, see the <a target=_blank href='"+refDocURL+
                            "'>Visual Builder Docs</a><br><br>Proceed with Import?",function(response){
                        if(response)menu.creator.showImportDialog(menu);
                    });
                });
            }
        },{
            title:"Import from Balsamiq...",
            click:function(target,item,menu){
                menu.creator.confirmSaveScreen(function(){
                    isc.BMMLImportDialog.create({
                        isModal:true,
                        showFileNameField:menu.creator.loadFileBuiltinIsEnabled,
                        showAssetsNameField:menu.creator.saveFileBuiltinIsEnabled,
                        showOutputField:menu.creator.saveFileBuiltinIsEnabled,
                        showSkinSelector:false,
                        submit:function(fileName,outputFileName,fileContent,skin,dropMarkup,trimSpace,fillSpace,fieldNamingConvention){
                            menu.creator.loadBMMLMockup(fileName,fileContent,dropMarkup,trimSpace,fillSpace,fieldNamingConvention);
                            this.markForDestroy();
                        }
                    });
                });
            }
        },{
            dynamicTitle:function(target,menu,item){
                return"Save '"+menu.creator.getCurrentScreenTitle()+"'";
            },
            click:function(target,item,menu){
                menu.creator.cacheCurrentScreenContents();
                menu.creator.project.saveScreenContents(menu.creator.currentScreen);
            }
        },{
            title:"Save as ...",
            click:function(target,item,menu){
                menu.creator.saveScreenAs(menu.creator.currentScreen);
            }
        },{
            title:"Recent versions",
            submenuBaseItems:[{
                dynamicTitle:function(target,menu,item){
                    var screenTitle=menu._rootMenu.creator.getCurrentScreenTitle();
                    return"Recent versions of '"+screenTitle+"'";
                }
            },{
                isSeparator:true
            }],
            enableIf:function(target,menu,item){
                var enabled=false;
                if(item&&item.submenu){
                    var data=item.submenu.data||item.submenu;
                    enabled=isc.isAn.Array(data)&&data.length>2;
                }
                menu.creator.updateRecentVersionsMenu(menu,item,enabled);
                return enabled;
            }
        },{
            title:"Export as JSP ...",
            enabled:this.filesystemDataSourceEnabled,
            click:function(target,item,menu){
                menu.creator.exportScreenAsJSP(menu.creator.currentScreen);
            }
        },{
            title:"Revert",
            enableIf:function(target,menu,item){
                return menu.creator.currentScreen.fileName;
            },
            click:function(target,item,menu){
                isc.confirm("Revert screen to saved version?",function(response){
                    if(response){
                        menu.creator.revertScreen(menu.creator.currentScreen);
                    }
                });
            }
        },{
            title:"Remove from project",
            removeInSingleScreenMode:true,
            click:function(target,item,menu){
                menu.creator.project.removeScreen(menu.creator.currentScreen);
            }
        },{
            dynamicTitle:function(target,menu,item){
                return"Delete '"+menu.creator.getCurrentScreenTitle()+"'";
            },
            enableIf:function(target,menu,item){
                return menu.creator.currentScreen.fileName;
            },
            click:function(target,item,menu){
                var message="Delete screen '"+menu.creator.currentScreen.title+"' from server? "+
                                "This operation cannot be undone.";
                isc.confirm(message,function(response){
                    if(response)menu.creator.deleteScreen(menu.creator.currentScreen);
                });
            }
        }]
    };
    if(this.singleScreenMode){
        var menuData=this.screenMenuDefaults.data;
        menuData.removeList(menuData.findAll("removeInSingleScreenMode",true));
    }
    this.projectMenuDefaults={
        _constructor:"Menu",
        title:"Project",
        width:100,
        data:[{
            title:"New project ...",
            click:function(target,item,menu){
                menu.creator.confirmSaveProject("this.makeNewProject()");
            }
        },{
            title:"Load project ...",
            click:function(target,item,menu){
                menu.creator.confirmSaveProject("this.showLoadProjectUI();");
            }
        },{
            title:"Save project",
            click:function(target,item,menu){
                menu.creator.project.save();
            }
        },{
            title:"Save project as ...",
            click:function(target,item,menu){
                menu.creator.project.saveAs();
            }
        },{
            title:"Export Project ...",
            enabled:this.filesystemDataSourceEnabled,
            click:function(target,item,menu){
                menu.creator.project.exportProjectWindow(menu.creator.currentScreen,menu.creator);
            }
        },{
            title:"Recent projects",
            enableIf:function(target,menu,item){
                if(!item.submenu)item.submenu=menu.creator.recentProjectsMenu;
                return item.submenu&&item.submenu.data.getLength()>0;
            }
        }]
    };
    this.screenListDefaults={
        _constructor:"TTreeGrid",
        autoParent:"screenPane",
        canReparentNodes:true,
        canReorderRecords:true,
        canEdit:true,
        editEvent:"none",
        showHeader:false,
        hilites:[{
            criteria:{
                _constructor:"AdvancedCriteria",
                fieldName:"dirty",
                operator:"notNull"
            },
            cssText:"color: red;"
        }],
        fields:[{
            name:"title",
            treeField:true,
            formatCellValue:function(value,record,rowNum,colNum,grid){
                return value.endsWith(".xml")?value.slice(0,-4):value;
            }
        }],
        screenContextMenuDefaults:{
            _constructor:"Menu",
            autoDraw:false,
            showIcon:false,
            showMenuFor:function(record,recordNum){
                this._record=record;
                this._recordNum=recordNum;
                this.showContextMenu();
            },
            data:[{
                title:"Save",
                click:function(target,item,menu){
                    menu.creator.creator.cacheCurrentScreenContents();
                    menu.creator.creator.project.saveScreenContents(menu._record);
                }
            },{
                title:"Save as ...",
                click:function(target,item,menu){
                    menu.creator.creator.saveScreenAs(menu._record);
                }
            },{
                title:"Export as JSP ...",
                enabled:this.filesystemDataSourceEnabled,
                click:function(target,item,menu){
                    menu.creator.creator.exportScreenAsJSP(menu._record);
                }
            },{
                title:"Revert",
                enableIf:function(target,menu,item){
                    if(item.enabled===false)return false;
                    return menu._record.fileName;
                },
                click:function(target,item,menu){
                    isc.confirm("Revert screen to saved version?",function(response){
                        if(response){
                            menu.creator.creator.revertScreen(menu._record);
                        }
                    });
                }
            },{
                title:"Remove from project",
                click:function(target,item,menu){
                    menu.creator.creator.project.removeScreen(menu._record);
                }
            },{
                title:"Delete on server",
                enableIf:function(target,menu,item){
                    if(item.enabled===false)return false;
                    return menu._record.fileName;
                },
                click:function(target,item,menu){
                    var message="Delete screen '"+menu._record.title+"' on the server? "+
                                  "This operation cannot be undone.";
                    isc.confirm(message,function(response){
                        if(response)menu.creator.creator.deleteScreen(menu._record);
                    });
                }
            }]
        },
        groupContextMenuDefaults:{
            _constructor:"Menu",
            autoDraw:false,
            showIcon:false,
            showMenuFor:function(record,recordNum){
                this._record=record;
                this._recordNum=recordNum;
                this.showContextMenu();
            },
            data:[{
                title:"Remove from project",
                click:function(target,item,menu){
                    menu.creator.creator.project.removeGroup(menu._record);
                }
            },{
                title:"Rename",
                click:function(target,item,menu){
                    menu.creator.startEditing(menu._recordNum,0);
                }
            }]
        },
        initWidget:function(){
            this.Super("initWidget",arguments);
            this.screenContextMenu=this.createAutoChild("screenContextMenu");
            this.groupContextMenu=this.createAutoChild("groupContextMenu");
        },
        folderContextClick:function(viewer,folder,recordNum){
            this.groupContextMenu.showMenuFor(folder,recordNum);
            return false;
        },
        leafContextClick:function(viewer,leaf,recordNum){
            this.screenContextMenu.showMenuFor(leaf,recordNum);
            return false;
        },
        selectionStyle:"single",
        selectionChanged:function(record,state){
            if(state&&!record.isFolder)this.creator.setCurrentScreen(record);
        }
    };
    this.screenAddButtonMenuDefaults={
        _constructor:"Menu",
        data:[{
            title:"Add saved screen...",
            click:function(target,item,menu){
                menu.creator.showAddScreenUI();
            }
        },{
            title:"New screen",
            click:function(target,item,menu){
                var screen=menu.creator.project.addScreen(null,null,"Untitled Screen");
                screen.mockupMode=menu.creator.mockupMode;
                menu.creator.setCurrentScreen(screen);
            }
        },{
            title:"New group",
            click:function(target,item,menu){
                menu.creator.showAddScreenGroupUI();
            }
        },{
            title:"Import screen ...",
            enabled:this.filesystemDataSourceEnabled,
            click:function(target,item,menu){
                var refDocURL="../../isomorphic/system/reference/SmartClient_Reference.html#group..visualBuilder";
                isc.ask("This feature allows you to import externally edited XML or JS code."+
                        " The Visual Builder cannot fully capture all externally edited files."+
                        " For more information, see the <a target=_blank href='"+refDocURL+
                        "'>Visual Builder Docs</a><br><br>Proceed with Import?",function(response){
                    if(response)menu.creator.showImportDialog(menu);
                });
            }
        },{
            title:"Import from Balsamiq...",
            click:function(target,item,menu){
                isc.BMMLImportDialog.create({
                    showFileNameField:menu.creator.loadFileBuiltinIsEnabled,
                    showAssetsNameField:menu.creator.saveFileBuiltinIsEnabled,
                    showOutputField:menu.creator.saveFileBuiltinIsEnabled,
                    showSkinSelector:false,
                    submit:function(fileName,outputFileName,fileContent,skin,dropMarkup,trimSpace,fillSpace,fieldNamingConvention){
                        menu.creator.loadBMMLMockup(fileName,fileContent,dropMarkup,trimSpace,fillSpace,fieldNamingConvention);
                        this.markForDestroy();
                    }
                });
            }
        }]
    };
    this.Super("init",arguments);
    if(this.showRecentVersions==null)this.showRecentVersions=this.hostedMode;
    if(!this.showRecentVersions){
        var menuData=this.screenMenuDefaults.data;
        menuData.remove(menuData.find("title","Recent versions"));
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.updateRecentVersionsMenu=function isc_VisualBuilder_updateRecentVersionsMenu(menu,item,enabled){
    var undef,
        builder=this,
        showRecentVersions=this.showRecentVersions;
    if(showRecentVersions){
        var screenDS=this.project.screenDataSource;
        if(screenDS)screenDS.listFileVersions({
            fileName:this.getCurrentScreenTitle(),
            fileType:'ui',
            fileFormat:'xml'
        },function(dsResponse,data){
            if(data==null){
                menu.logInfo("encountered an error trying to get the file versions of "+
                             this.getCurrentScreenTitle()+" from "+screenDS);
                return;
            }
            var submenuData=item.submenuBaseItems.duplicate(),
                maxId=data.map(function(fileSpec){return fileSpec.id;}).max(),
                loadVersionedScreen=function(){
                    var version=this.id==maxId?undef:this.version;
                    builder.revertScreen(builder.currentScreen,version);
                }
            ;
            for(var i=0;i<data.getLength();i++){
                var title=data[i].fileAutoSaved?"Auto save":"Saved",
                    datetime=data[i].fileLastModified.toShortDateTime();
                submenuData.add({
                    id:data[i].id,
                    version:data[i].fileLastModified,
                    title:title+" ["+datetime+"]",
                    click:loadVersionedScreen
                });
            }
            if(isc.isA.Menu(item.submenu))item.submenu.setData(submenuData);
            else item.submenu=submenuData;
            if(enabled!=data.getLength()>0)menu.setDynamicItems();
        });
    }
}
,isc.A.initWidget=function isc_VisualBuilder_initWidget(){
    this.Super('initWidget',arguments);
    if(this._forceOfflineStorage()){
        this.screenDataSource=this.projectDataSource=isc.OfflineFileSource.create();
    }else{
        this.screenDataSource=isc.DS.get(this.screenDataSource||(this.hostedMode?"hostedScreens":"vbScreens"));
        this.projectDataSource=isc.DS.get(this.projectDataSource||(this.hostedMode?"hostedProjects":"vbProjects"));
    }
    this.settingsDataSource=isc.DS.get(this.settingsDataSource||(this.hostedMode?"hostedSettings":"vbSettings"));
    this.dsDataSource=isc.DS.get(this.dsDataSource||(this.hostedMode?"hostedDataSources":"vbDataSources"));
    var undef;
    this.canExportJSP=this.canExportJSP!==undef?this.canExportJSP:this.hostedMode?false:true;
    isc.addProperties(this.projectComponentsDefaults,{
        canDropRootNodes:this.canAddRootComponents
    });
    isc.designTime=true;
    this.loadCurrentSettings({target:this,methodName:"finishInitWidget"});
}
,isc.A.finishInitWidget=function isc_VisualBuilder_finishInitWidget(){
    if(!this.currentSettings)this.currentSettings={};
    isc.Page.setEvent("mouseDown",function(){
        var editor=isc.EditContext.titleEditor;
        if(editor){
            var x=isc.EH.getX(),
                y=isc.EH.getY();
            var editorRect=editor.getPageRect();
            if(x>=editorRect[0]&&x<=editorRect[0]+editorRect[2]&&
                y>=editorRect[1]&&y<=editorRect[1]+editorRect[3])
            {
            }else{
                editor.blur(editor,editor.getItem("title"));
            }
        }
    });
    if(this.defaultApplicationMode){
        this.editingOn=this.defaultApplicationMode.toLowerCase()=="edit";
    }else{
        this.editingOn=false;
    }
    this.paletteNodeDS=this.createAutoChild("paletteNodeDS");
    this.paletteDS=this.createAutoChild("paletteDS",{
        paletteNodeDS:this.paletteNodeDS,
        customComponentsURL:this.getCustomComponentsURL(),
        defaultComponentsURL:this.defaultComponentsURL,
        defaultMockupComponentsURL:this.defaultMockupComponentsURL
    });
    var _this=this;
    this.rootLiveObject=this.createAutoChild("rootComponent",{
       autoDraw:false,
       editorRoot:true,
       canFocus:true,
       width:"100%",height:"50%",
       resized:function(){
           _this.previewAreaResized();
       }
    });
    this.previewArea=this.rootLiveObject;
var _this=this;
this.globalDependencies=isc.DataSource.create({
    dataURL:this.globalDependenciesURL,
    recordXPath:"//dependency",
    fields:[
        {name:"type"}
    ],
    loadDependencies:function(data){
        this.deps=data;
        for(var i=0;i<data.length;i++){
            var dep=data[i];
            if(dep.type=="js"||dep.type=="css"){
                if(dep.url.startsWith("/")){
                    isc.FileLoader.loadFile("../.."+dep.url);
                }else{
                    isc.FileLoader.loadFile(dep.url);
                }
            }else if(dep.type=="schema"){
                isc.DataSource.get(dep.id,function(){});
            }else if(dep.type=="ui"){
            }
        }
    }
});
this.globalDependencies.fetchData(null,this.getID()+".globalDependencies.loadDependencies(data)");
    if(this.singleScreenMode){
        this.showScreenList=false;
        this.showProjectMenu=false;
    }
    if(this.projectID&&!this.projectFileName){
        this.projectFileName=this._convertIDtoFileName(this.projectID);
        delete this.projectID;
    }
    if(this.singleScreenMode){
        var contents=isc.Offline.get(this.mockupMode?isc.Project.AUTOSAVE_MOCKUPS:isc.Project.AUTOSAVE_SINGLE_SCREEN);
        if(contents){
            this.loadProjectReply(null,{
                fileName:null,
                fileContents:contents
            },null);
        }else{
            this.makeDefaultProject();
        }
    }else if(this.project){
        var project=this.project;
        this.project=null;
        this.setProject(project);
    }else if(this.projectFileName){
        this.loadProject(this.projectFileName);
        this.makeNewProject();
    }else{
        var contents=isc.Offline.get(this.mockupMode?isc.Project.AUTOSAVE_MOCKUPS:isc.Project.AUTOSAVE);
        if(contents){
            this.loadProjectReply(null,{
                fileName:null,
                fileContents:contents
            },null);
        }else{
            this.makeDefaultProject();
        }
    }
}
,isc.A.doAutoSave=function isc_VisualBuilder_doAutoSave(callback){
    if(this.project){
        this.project.autoSave(callback);
    }
}
,isc.A.hide=function isc_VisualBuilder_hide(){
    isc.SelectionOutline.deselect();
    this.Super("hide",arguments);
}
,isc.A.clear=function isc_VisualBuilder_clear(){
    isc.SelectionOutline.deselect();
    this.Super("clear",arguments);
}
,isc.A.showScreenUI=function isc_VisualBuilder_showScreenUI(){
    var mockupMode=this.getScreenMockupMode(this.currentScreen);
    if(mockupMode){
        if(this.leftStack.getSectionNumber("componentProperties")>=0)this.leftStack.hideSection("componentProperties");
        if(this.leftStack.getSectionNumber("helpPane")>=0)this.leftStack.hideSection("helpPane");
        if(this.leftStack.getSectionNumber("componentLibrary")<0){
            var section=this.rightStack.sectionForItem(this.librarySearch);
            this.librarySearch.deparent();
            this.libraryComponents.deparent();
            section.items=[];
            this.rightStack.removeSection(section);
            this.leftStack.addSection({title:"Component Library",ID:"componentLibrary",autoShow:true,
                items:[this.librarySearch,this.libraryComponents]
            },0);
        }
        this.middleStack.hideSection("componentTree");
        this.middleStack.setShowResizeBar(false);
        this.rightStack.hide();
        this.removeButton.show();
        this.bringToFrontButton.show();
        this.sendToBackButton.show();
        this.screenMenuButton.hide();
        this.main.setTabPane("generatedCodeTab",this.codePreview);
        var editContext=this.projectComponents.getEditContext();
        editContext.isVisualBuilder=false;
        if(!this.mockupExtraPalettes)this.mockupExtraPalettes=this.createAutoChild("mockupExtraPalettes");
        editContext.extraPalettes=this.mockupExtraPalettes;
        editContext.allowNestedDrops=false;
        editContext.selectedAppearance="outlineMask";
        editContext.showSelectedLabel=false;
        this.rootLiveObject.childrenSnapToGrid=true;
        this.rootLiveObject.setChildrenSnapAlign(true);
        editContext.canSelectEditNodes=true;
        editContext.selectionType=isc.Selection.MULTIPLE;
        editContext.setEditProxyProperties(this.rootLiveObject,{
            supportsInlineEdit:false,
            allowNestedDrops:true,
            autoMaskChildren:true,
            persistCoordinates:true
        });
        this.rootLiveObject.setEditMode(true,this.projectComponents.getEditContext());
        this.enableKeyHandler(true);
    }else{
        if(this.leftStack.getSectionNumber("componentProperties")>=0)this.leftStack.showSection("componentProperties");
        if(this.leftStack.getSectionNumber("helpPane")>=0)this.leftStack.showSection("helpPane");
        this.middleStack.showSection("componentTree");
        this.middleStack.setShowResizeBar(true);
        if(this.rightStack.getSectionNumber("componentLibrary")<0){
            var section=this.leftStack.sectionForItem(this.librarySearch);
            this.librarySearch.deparent();
            this.libraryComponents.deparent();
            section.items=[];
            this.leftStack.removeSection(section);
            this.rightStack.addSection({title:"Component Library",ID:"componentLibrary",autoShow:true,
                items:[this.librarySearch,this.libraryComponents]
            },0);
            this.rightStack.show();
        }
        this.removeButton.hide();
        this.bringToFrontButton.hide();
        this.sendToBackButton.hide();
        if(this.previewArea.isVisible()){
            this.screenMenuButton.show();
        }
        if(this.main.getTabPane("generatedCodeTab")!=this.codePane){
            this.main.setTabPane("generatedCodeTab",this.codePane);
        }
        var editContext=this.projectComponents.getEditContext();
        editContext.isVisualBuilder=true;
        editContext.allowNestedDrops=true;
        editContext.selectionType=isc.Selection.SINGLE;
        editContext.selectedAppearance="outlineEdges";
        editContext.showSelectedLabel=true;
        editContext.extraPalettes=null;
        this.rootLiveObject.autoMaskChildren=false;
        this.rootLiveObject.childrenSnapToGrid=false;
        this.rootLiveObject.setChildrenSnapAlign(false);
        editContext.setEditProxyProperties(this.rootLiveObject,{
            supportsInlineEdit:false,
            allowNestedDrops:false,
            persistCoordinates:false
        });
        this.enableKeyHandler(false);
    }
    this.show();
}
,isc.A.updateSelectionActionButtons=function isc_VisualBuilder_updateSelectionActionButtons(){
    var selection=this.projectComponents.getEditContext().getSelectedEditNodes();
    if(selection.length==0){
        this.removeButton.disable();
        this.sendToBackButton.disable();
        this.bringToFrontButton.disable();
    }else{
        this.removeButton.enable();
        this.sendToBackButton.enable();
        this.bringToFrontButton.enable();
    }
}
,isc.A.enableKeyHandler=function isc_VisualBuilder_enableKeyHandler(enable){
    if(enable){
        if(!this._keyPressEventID){
            this._keyPressEventID=isc.Page.setEvent("keyPress",this);
        }
    }else{
        if(this._keyPressEventID){
            isc.Page.clearEvent("keyPress",this._keyPressEventID);
            delete this._keyPressEventID;
        }
    }
}
,isc.A.pageKeyPress=function isc_VisualBuilder_pageKeyPress(target,eventInfo){
    var key=isc.EH.getKeyEventCharacter(),
        selection=this.projectComponents.getEditContext().getSelectedEditNodes()
    ;
    var key=isc.EH.getKey();
    if(selection.length==0){
        if(key=="Delete"||key=="Backspace")return false;
        return;
    }
    if(!this.previewArea.containsFocus())return;
    if(key=="Delete"||key=="Backspace"){
        var editContext=this.projectComponents.getEditContext();
        for(var i=0;i<selection.length;i++){
            editContext.removeNode(selection[i]);
        }
        return false;
    }
}
,isc.A.updateRunMenuControl=function isc_VisualBuilder_updateRunMenuControl(){
    var builder=this;
    this.runMenuData=[{
        title:"Run now",
        enableIf:function(target,menu,item){
            return builder._runProjectEnabled();
        },
        click:function(target,item,menu){
            builder.runProject();
        }
    }];
    if(this.mockupMode)this.runMenuData.addList([{
        title:"Reify Preview",
        showIf:function(){return false;},
        click:function(){
            builder.confirmReifyPreview();
        }
    },{
        title:"Open in Visual Builder",
        click:function(){
            builder.confirmOpenInBuilder();
        }
    }]);
    if(this.hostedMode){
        this.runMenuData.add({
            title:"Share",
            enableIf:function(target,menu,item){
                if(!window.user)return false;
                if(builder.singleScreenMode&&builder.currentScreen)return true;
                else if(builder.project&&!builder.project.isEmpty())return true;
            },
            click:function(target,item,menu){
                builder.shareProject();
            }
        });
    }
    if(this.runMenu){
        this.runMenu.setData(this.runMenuData);
        return;
    }
    this.runMenuDefaults={
        _constructor:"Menu",
        data:this.runMenuData
    };
    this.runMenu=this.createAutoChild("runMenu");
    var controlGroup=isc.RibbonGroup.create({
        bodyProperties:{membersMargin:0},
        showTitle:false,layoutMargin:0,rowHeight:21,border:"0px",
        controls:[
            builder.runButton=isc.Button.create({
                click:"builder.runProject()",
                title:"Run",border:"0px",width:35}),
            isc.MenuButton.create({
                menu:this.runMenu,iconSpacing:0,
                title:"",border:"0px",width:1,overflow:"visible"
            })
        ]
    });
    this.runMenuControl=this.createAutoChild("runMenuControl",{
        members:[controlGroup]
    });
}
,isc.A.addChildren=function isc_VisualBuilder_addChildren(){
    this.hide();
    var self=this;
    if(this.showBuilderOnly)this.showCodePane=false;
    this.projectComponentsMenu=this.createAutoChild("projectComponentsMenu");
    this.addAutoChild("libraryComponents");
    this.addAutoChild("librarySearch",{grid:this.libraryComponents});
    this.addAutoChild("projectComponents",{
        contextMenu:this.projectComponentsMenu,
        rootComponent:this.rootComponent,
        rootLiveObject:this.rootLiveObject,
        defaultPalette:this.libraryComponents,
        editContextProperties:{
            showSelectedLabelOnSelect:(this.hideLabelWhenSelecting!=true),
            canSelectEditNodes:true,
            selectedEditNotesUpdated:function(){
                self.updateSelectionActionButtons();
            }
        }
    });
    this.libraryComponents.defaultEditContext=this.projectComponents.editContext;
    this.observe(this.projectComponents.editContext,"setNodeProperties",
                 "observer.markDirty();");
    this.projectTree=this.projectComponents.data;
    this.projectTree.observe(this.projectTree,"dataChanged",function(){
        self.updateSource();
    });
    if(this.showCodePane!=false){
        this.addAutoChild("codePane");
        this.addAutoChildren(["codePreview","jsCodePreview"]);
        if(this.showCodePreview!=false)
            this.codePane.addTab({title:"XML Code",pane:this.codePreview,width:150,
                click:this.getID()+".updateSource();"
            });
        if(this.showJsCodePreview!=false)
            this.codePane.addTab({title:"JS Code",pane:this.jsCodePreview,width:150,
                click:this.getID()+".updateSource();"
            });
    }
    this.addAutoChild("componentAttributeEditor",
        isc.addProperties(this.commonEditorFunctions,{builder:this})
    );
    this.addAutoChild("componentMethodEditor",
        isc.addProperties(this.commonEditorFunctions,{
            canEditExpressions:this.canEditExpressions,
            builder:this
        })
    );
    this.addAutoChild("editorPane");
    if(this.showComponentAttributeEditor!=false){
        this.editorPane.addTab({
            title:"Properties",
            pane:this.componentAttributeEditor,
            tabSelected:function(tabSet,tabNum,componentEditor,ID,tab,name){
                componentEditor.creator.
                    setComponentEditorButtonState(componentEditor.currentComponent);
            }
        });
    }
    if(this.showComponentMethodEditor!=false){
        this.editorPane.addTab({
            title:"Events",
            pane:this.componentMethodEditor,
            tabSelected:function(tabSet,tabNum,componentEditor,ID,tab,name){
                componentEditor.creator.
                    setComponentEditorButtonState(componentEditor.currentComponent);
            }
        });
    }
    this.applyButton=this.createAutoChild("applyButton");
    if(this.showHelpPane!=false){
        this.helpPane=this.createAutoChild("helpPane",{
            contentsURL:this.helpPaneProperties.contentsURL
        });
    }
    if(this.showLeftStack!=false){
        this.addAutoChild("leftStack");
        if(this.showEditorPane!=false){
            this.editorPaneButtonBar=isc.HStack.create({
                membersMargin:10,
                height:this.applyButton.height,
                members:[this.applyButton]
            });
            if(this.showAdvancedButton!=false){
                this.advancedButton=this.createAutoChild("advancedButton");
                this.advancedButton.setTitle(this.componentAttributeEditor.basicMode?
                                             this.componentAttributeEditor.moreTitle:
                                             this.componentAttributeEditor.lessTitle);
                this.editorPaneButtonBar.addMember(this.advancedButton);
            }
            this.leftStack.addSection({
                title:"Component Properties",
                ID:"componentProperties",
                autoShow:true,
                items:[this.editorPane,this.editorPaneButtonBar]
            });
        }
        if(this.showHelpPane!=false){
            this.leftStack.addSection({
                title:this.helpPaneProperties.headerTitle,
                ID:"helpPane",
                autoShow:false,
                items:[this.helpPane]
            });
        }
    }
    this.showMiddleStack=this.showPreviewArea!=false||this.showProjectComponents!=false;
    var controls=[];
    this.removeButton=this.createAutoChild("removeButton");
    controls.add(this.removeButton);
    this.bringToFrontButton=this.createAutoChild("bringToFrontButton");
    controls.add(this.bringToFrontButton);
    this.sendToBackButton=this.createAutoChild("sendToBackButton");
    controls.add(this.sendToBackButton);
    if(this.showScreenMenu!=false){
        this.screenMenu=this.createAutoChild("screenMenu");
        this.screenMenuButton=this.createAutoChild("screenMenuButton",{
            menu:this.screenMenu
        });
        controls.add(this.screenMenuButton);
        controls.add(isc.LayoutSpacer.create({
            width:10
        }));
    }
    if(this.showModeSwitcher!=false){
        var switcher=this.modeSwitcher=this.createAutoChild("modeSwitcher");
        switcher.getField("switcher").setValue(this.editingOn?"Edit":"Live");
        controls.add(switcher);
    }
    if(this.showMiddleStack!=false){
        this.addAutoChild("middleStack");
        if(this.showPreviewArea!=false){
            this.middleStack.addSection({
                title:"Application",autoShow:true,ID:"applicationSection",
                items:[this.previewArea],controls:controls
            });
        }
        if(this.showProjectComponents!=false){
            this.projectComponentsSearch=this.createAutoChild("projectComponentsSearch",
                                                                {grid:this.projectComponents});
            this.middleStack.addSection({height:24,name:"componentTree",
                                          title:"Component Tree",autoShow:true,
                items:[this.projectComponents],
                controls:[this.projectComponentsSearch]
            });
        }
    }
    if(this.collapseComponentTree==true)this.middleStack.collapseSection(1);
    this.showRightStack=(this.showLibraryComponents!=false||
                            this.showScreenList!=false||this.showDataSourceList!=false);
    if(this.showRightStack!=false){
        this.addAutoChild("rightStack");
        if(this.showLibraryComponents!=false){
            this.rightStack.addSection({title:"Component Library",ID:"componentLibrary",
                autoShow:true,items:[this.librarySearch,this.libraryComponents]
            });
        }
        if(this.showProjectMenu!=false){
            this.recentProjectsMenu=this.createAutoChild("recentProjectsMenu",{
                data:this.getRecentProjects()
            });
            this.projectMenu=this.createAutoChild("projectMenu");
            this.projectMenuButton=this.createAutoChild("projectMenuButton",{
                menu:this.projectMenu
            });
        }
        if(this.showScreenList!=false||this.showDataSourceList!=false){
            var showBoth=this.showScreenList!=false&&this.showDataSourceList!=false;
            if(showBoth){
                this.projectPane=this.createAutoChild("projectPane");
                this.rightStack.addSection({
                    name:"project",
                    title:"Project",
                    autoShow:true,
                    items:[this.projectMenuButton,this.projectPane]
                });
            }
            if(this.showScreenList!=false){
                this.screenPane=this.createAutoChild("screenPane");
                this.addAutoChild("screenList");
                this.addAutoChild("screenListToolbar");
                this.screenAddButtonMenu=this.createAutoChild("screenAddButtonMenu");
                this.addAutoChild("screenAddButton",{
                    menu:this.screenAddButtonMenu
                });
                if(this.projectPane){
                    this.projectPane.addTab({
                        title:"Screens",
                        pane:this.screenPane
                    });
                }else{
                    this.rightStack.addSection({
                        title:"Screens",
                        autoShow:true,
                        items:[this.screenPane]
                    });
                }
            }
            if(this.showDataSourceList!=false){
                this.dataSourcePane=this.createAutoChild("dataSourcePane");
                this.addAutoChildren(["dataSourceList","dataSourceListToolbar","dsNewButton",
                                      "dsEditButton"]);
                this.dsNewButton.menu=this.createAutoChild("dsNewButtonMenu");
                this.dataSourceListSearch=this.createAutoChild("dataSourceListSearch",
                                                                 {grid:this.dataSourceList});
                if(this.projectComponents){
                    this.projectComponents.extraPalettes=[this.dataSourceList];
                }
                if(this.projectPane){
                    this.projectPane.addTab({
                        title:"DataSources",
                        pane:this.dataSourcePane
                    });
                }else{
                    this.rightStack.addSection({
                        name:"dataSources",
                        title:"DataSources",
                        autoShow:true,
                        items:[this.dataSourcePane]
                    });
                }
                if(this.project){
                    this.observe(this.project.datasources,"dataChanged",
                                 "observer.updateDataSourceList();");
                    this.updateDataSourceList();
                }
            }
        }
    }
    this.addAutoChild("workspace");
    if(this.showLeftStack!=false)this.workspace.addMember(this.leftStack);
    if(this.showMiddleStack!=false)this.workspace.addMember(this.middleStack);
    if(this.showRightStack!=false)this.workspace.addMember(this.rightStack);
    this.updateRunMenuControl();
    if(this.showCodePane!=false){
        this.addAutoChild("main",{
            tabs:[{
                title:"Build",
                pane:this.workspace
            },{
                title:"Code",
                ID:"generatedCodeTab",
                pane:this.codePane
            }],
            tabBarControls:[
                "tabScroller",
                "tabPicker",
                this.runMenuControl
            ]
        });
    }
}
,isc.A._runProjectEnabled=function isc_VisualBuilder__runProjectEnabled(){
    if(this.singleScreenMode&&this.currentScreen)return true;
    else if(this.project&&!this.project.isEmpty())return true;
    return false;
}
,isc.A.editComponent=function isc_VisualBuilder_editComponent(node,liveObject){
    if(isc.isA.DataSource(liveObject))return;
    if(node!=null)this._updateEditComponentRemovability(node);
    this.setBasicMode(node);
    if(this.showComponentAttributeEditor!=false){
        this.componentAttributeEditor.editComponent(node,liveObject);
    }
    if(this.showComponentMethodEditor!=false){
        this.componentMethodEditor.editComponent(node,liveObject);
    }
    if(this.showComponentAttributeEditor!=false||this.showComponentMethodEditor!=false){
        this.applyBasicModeSettings(node);
    }
    if(isc.Browser.isIE&&this.editorPane.paneContainer&&
        this.editorPane.paneContainer.isVisible())
    {
        this.editorPane.paneContainer.hide();
        this.editorPane.paneContainer.show();
    }
    if(this.leftStack){
        var obj=liveObject;
        if(!obj._constructor)obj=node;
        this.updateComponentPropertiesSectionTitle(obj);
    }
    this.setComponentList();
}
,isc.A.updateComponentPropertiesSectionTitle=function isc_VisualBuilder_updateComponentPropertiesSectionTitle(obj){
    if(this.leftStack){
        this.leftStack.setSectionTitle("componentProperties",
                                       isc.DS.getAutoId(obj)+" Properties");
    }
}
,isc.A.setBasicMode=function isc_VisualBuilder_setBasicMode(component){
    if(!component)return;
    var editor=this.getCurrentlyVisibleEditor(),
        attrName=editor.ID+"BasicMode";
    if(component[attrName]==null)component[attrName]=editor.basicMode;
    editor._basicMode=component[attrName];
}
,isc.A.toggleBasicMode=function isc_VisualBuilder_toggleBasicMode(component){
    if(!component)return;
    var editor=this.getCurrentlyVisibleEditor();
    editor._basicMode=editor._basicMode==null?!editor.basicMode:!editor._basicMode;
    component[editor.ID+"BasicMode"]=editor._basicMode;
}
,isc.A.applyBasicModeSettings=function isc_VisualBuilder_applyBasicModeSettings(component){
    if(!component)return;
    var editor=this.getCurrentlyVisibleEditor();
    this.setComponentEditorButtonState(component);
    this.setClassSwitcherState(component);
}
,isc.A.setComponentEditorButtonState=function isc_VisualBuilder_setComponentEditorButtonState(component){
    if(!component)return;
    if(this.showAdvancedButton!=false){
        var editor=this.getCurrentlyVisibleEditor(),
            basicMode=component[editor.ID+"BasicMode"];
        if(basicMode){
            this.advancedButton.setTitle(editor.moreTitle);
        }else{
            this.advancedButton.setTitle(editor.lessTitle);
        }
        if(editor.showMethods){
            var hasEvents=isc.isAn.Array(editor.items)&&editor.items.length>0;
            this.advancedButton.setDisabled(!hasEvents);
        }else{
            this.advancedButton.setDisabled(false);
        }
    }
    this.applyButton.setDisabled(false);
}
,isc.A.setClassSwitcherState=function isc_VisualBuilder_setClassSwitcherState(component){
    if(this.getCurrentlyVisibleEditor()!=this.componentAttributeEditor)return;
    if(!this.componentAttributeEditor.canSwitchClass)return;
    if(!this.componentAttributeEditor.getField("classSwitcher"))return;
    if(!this.componentAttributeEditor._basicMode||component._notSwitchable){
        this.componentAttributeEditor.getField("classSwitcher").setDisabled(true);
    }else{
        this.componentAttributeEditor.getField("classSwitcher").setDisabled(false);
    }
}
,isc.A.getCurrentlyVisibleEditor=function isc_VisualBuilder_getCurrentlyVisibleEditor(){
    if(this.editorPane.selectedEditorName()==this.editorPane.PROPERTIES){
        return this.componentAttributeEditor;
    }
    return this.componentMethodEditor;
}
,isc.A.saveComponentEditors=function isc_VisualBuilder_saveComponentEditors(){
    if(this.componentMethodEditor)this.componentMethodEditor.save();
    if(this.componentAttributeEditor)this.componentAttributeEditor.save();
}
,isc.A.getCurrentComponent=function isc_VisualBuilder_getCurrentComponent(){
    return this.componentAttributeEditor?this.componentAttributeEditor.currentComponent:
        this.componentMethodEditor?this.componentMethodEditor.currentComponent:null;
}
,isc.A.setComponentList=function isc_VisualBuilder_setComponentList(){
    var comp=this.projectComponents,
        descendants=comp.data.getDescendants(comp.data.getRoot());
    if(this.componentMethodEditor)this.componentMethodEditor.allComponents=descendants;
    if(this.componentAttributeEditor)this.componentAttributeEditor.allComponents=descendants;
}
,isc.A.getActionTitle=function isc_VisualBuilder_getActionTitle(targetComponentId,actionId){
    if(this.componentMethodEditor.allComponents){
        var components=this.componentMethodEditor.allComponents,
            targetComponent=components.find("ID",targetComponentId)
        ;
        if(targetComponent){
            var actions=isc.jsdoc.getActions(targetComponent.type),
                action=(actions?actions.find("name",actionId):null)
            ;
            if(action){
                return"["+action.title+"]";
            }
        }
    }
    return null;
}
,isc.A.componentAdded=function isc_VisualBuilder_componentAdded(){
    this.setComponentList();
    this.markDirty();
}
,isc.A.componentRemoved=function isc_VisualBuilder_componentRemoved(node,parentNode){
    var comp=this.getCurrentComponent();
    if(comp==node){
        this.clearComponent();
    }else if(comp&&comp==parentNode){
        this.refreshComponent();
    }
    this.setComponentList();
    this.markDirty();
}
,isc.A.clearComponent=function isc_VisualBuilder_clearComponent(){
    if(this.componentAttributeEditor)this.componentAttributeEditor.clearComponent();
    if(this.componentMethodEditor)this.componentMethodEditor.clearComponent();
    if(this.leftStack){
        this.leftStack.setSectionTitle("componentProperties","Component Properties");
        if(this.applyButton)this.applyButton.setDisabled(true);
        if(this.advancedButton)this.advancedButton.setDisabled(true);
    }
}
,isc.A.refreshComponent=function isc_VisualBuilder_refreshComponent(){
    var comp=this.getCurrentComponent();
    this.editComponent(comp,comp.liveObject);
}
,isc.A.switchComponentClass=function isc_VisualBuilder_switchComponentClass(newClassName){
    var comp=this.getCurrentComponent(),
        tree=this.projectComponents.data,
        parent=tree.getParent(comp),
        index=tree.getChildren(parent).indexOf(comp);
    var newNode=this.projectComponents.makeEditNode({
        type:newClassName,
        defaults:comp.defaults
    });
    this.projectComponents.removeNode(comp);
    newNode=this.projectComponents.addComponent(newNode,parent,index);
    if(newNode&&newNode.liveObject){
        isc.EditContext.selectCanvasOrFormItem(newNode.liveObject,true);
    }
}
,isc.A.getCustomComponentsURL=function isc_VisualBuilder_getCustomComponentsURL(){
    return this.customComponentsURL;
}
,isc.A.refreshLibraryComponents=function isc_VisualBuilder_refreshLibraryComponents(callback){
    var mockupMode=this.getScreenMockupMode(this.currentScreen);
    if(this.paletteDS.mockupMode!=null&&mockupMode==this.paletteDS.mockupMode){
        if(callback)callback();
        return;
    }
    this.paletteDS.mockupMode=mockupMode;
    var _this=this;
    this.libraryComponents.invalidateCache();
    if(!this.libraryComponents.willFetchData({})&&callback){
        callback();
    }
    this.libraryComponents.fetchData({},function(){
        var tree=_this.libraryComponents.getData();
        tree.openFolders(tree.getChildren(tree.getRoot()));
        var closedNodes=tree.findAll("isClosed","true");
        if(closedNodes&&closedNodes.length)tree.closeFolders(closedNodes);
        if(callback)callback();
    });
    this.librarySearch.refresh();
}
,isc.A.showDataSourcePicker=function isc_VisualBuilder_showDataSourcePicker(){
    var self=this;
    if(!this.dataSourcePicker)this.dataSourcePicker=this.createAutoChild('dataSourcePicker',{
        dataSource:this.dsDataSource
    });
    this.dataSourcePicker.showLoadFileUI(function(dsResponse,data,dsRequest){
        isc.DS.get(data.fileName,function(dsID){
            var ds=isc.DS.get(isc.isAn.Array(dsID)?dsID[0]:dsID);
            self.project.addDatasource(data.fileName,ds.serverType);
        },{loadParents:true});
    });
}
,isc.A.addDataSource=function isc_VisualBuilder_addDataSource(ds){
    if(this.dsEditorWindow){
        this.dsEditorWindow.hide();
        if(ds.serverType=="sql"||ds.serverType=="hibernate"){
            if(this.dsWizard!=null){
                var node=this.dsWizard.dsTypeRecord,
                    wizardDefaults=node.wizardDefaults,
                    skipMessage=wizardDefaults?wizardDefaults.existingTable=="true":false;
                if(!skipMessage)
                {
                    var urlToolsDir=isc.Page.getToolsDir();
                    if(!urlToolsDir.endsWith(isc.Canvas._$slash))urlToolsDir=urlToolsDir+"/";
                    var url=urlToolsDir+"adminConsole.jsp";
                    isc.say("To generate or regenerate SQL tables for this DataSource, use the "+
                        "<a target=_blank href='"+url+"'>Admin Console</a> or the "+
                        "<i>DataSources</i> tab in the Developer Console");
                }
            }
        }
    }
    var dsType=ds.serviceNamespace?"webService":ds.serverType||ds.dataFormat;
    this.project.addDatasource(ds.ID,dsType);
}
,isc.A.clearScreenUI=function isc_VisualBuilder_clearScreenUI(){
    if(this.projectComponents){
        this.projectComponents.destroyAll();
        if(!this.currentScreen.mockupMode&&this.initialComponent){
            var initialComponent=this.projectComponents.makeEditNode(this.initialComponent);
            this.projectComponents.addNode(initialComponent);
        }
    }
}
,isc.A.updateSource=function isc_VisualBuilder_updateSource(force){
    if(this.showCodePane==false||!this.main)return;
    if(!force&&this.main.getSelectedTabNumber()!=1)return;
    var xmlSource=this.getUpdatedSource();
    if(!xmlSource)return;
    var lineBreakValueRegex=new RegExp("(\\r\\n|[\\r\\n])","g");
    xmlSource=xmlSource.replace(lineBreakValueRegex,"\n");
    if(this.codePreview){
        this.codePreview.setValues({codeField:xmlSource});
    }
    if(this.jsCodePreview&&this.codePane.isDrawn()&&
        this.codePane.getSelectedTab().pane==this.jsCodePreview)
    {
        isc.xml.toJSCode(xmlSource,this.getID()+".jsCodePreview.setContents(data)");
    }
}
,isc.A.getUpdatedJSSource=function isc_VisualBuilder_getUpdatedJSSource(callback){
    isc.xml.toJSCode(this.getUpdatedSource(),callback);
}
,isc.A.getUpdatedSource=function isc_VisualBuilder_getUpdatedSource(){
    var mockupMode=this.getScreenMockupMode(this.currentScreen),
        settings={outputComponentsIndividually:!mockupMode,ignoreConstructor:true,
                     separateComponents:mockupMode},
        source=this.projectComponents.serializeAllEditNodes(settings);
    ;
    if(mockupMode){
        var container="<MockupContainer>\n",
            components=source.components.trim(),
            dataSources=source.dataSources.trim();
        if(dataSources)container+="<dataSources>\n"+dataSources+"\n</dataSources>\n";
        if(components)container+="<components>\n"+components+"\n</components>\n";
        source=container+"</MockupContainer>\n";
    }
    return source;
}
,isc.A.downloadDataSource=function isc_VisualBuilder_downloadDataSource(dsID){
    var ds=isc.DS.get(isc.isAn.Array(dsID)?dsID[0]:dsID);
    var vb=this;
    var title=this.downloadDataSourceDialogTitle.evalDynamicString(this,{dsID:ds.ID}),
        prompt=this.downloadDataSourceDialogPrompt,
        buttonTitle=this.downloadDataSourceDialogButtonTitle;
    this.downloadDataSourceDialog=isc.TWindow.create({
        title:title,
        width:300,
        height:160,
        isModal:true,
        showModalMask:true,
        autoCenter:true,
        padding:8,
        items:[
            isc.Label.create({
                width:"100%",
                padding:8,
                contents:prompt
            }),
            isc.DynamicForm.create({
                width:"100%",
                numCols:3,
                items:[
                    {name:"formatType",title:"Format",type:"select",width:"*",
                        defaultValue:"XML",
                        valueMap:["XML","JavaScript"]
                    },
                    {name:"downloadButton",title:buttonTitle,type:"button",startRow:false,
                        click:function(){
                            vb.continueDSDownload(ds,this.form.getValue("formatType"));
                        }
                    }
                ]
            })
        ]
    });
    this.downloadDataSourceDialog.show();
}
);
isc.evalBoundary;isc.B.push(isc.A.continueDSDownload=function isc_VisualBuilder_continueDSDownload(ds,formatType){
    this.downloadDataSourceDialog.hide();
    this.downloadDataSourceDialog.markForDestroy();
    var vb=this,
        dsClass=ds.getClassName(),
        schema;
    if(isc.DS.isRegistered(dsClass)){
        schema=isc.DS.get(dsClass);
    }else{
        schema=isc.DS.get("DataSource");
        ds._constructor=dsClass;
    }
    var xml=schema.xmlSerialize(ds);
    if(formatType=="XML"){
        vb.downloadDataSourceReply(ds,formatType,xml);
    }else{
        isc.XMLTools.toJSCode(xml,
            function(response){
                vb.downloadDataSourceReply(ds,formatType,response.data);
            }
        );
    }
}
,isc.A.downloadDataSourceReply=function isc_VisualBuilder_downloadDataSourceReply(ds,formatType,data){
    var fileName=ds.ID+".ds."+(formatType=="XML"?"xml":"js"),
        mimeType=(formatType=="XML"?"text/xml":"application/json");
    isc.DMI.callBuiltin({
        methodName:"downloadClientContent",
        arguments:[data,fileName,mimeType],
        requestParams:{
            showPrompt:false,
            useXmlHttpRequest:false,
            timeout:0
        }
     });
}
,isc.A.showDSWizard=function isc_VisualBuilder_showDSWizard(){
    if(this.wizardWindow)return this.wizardWindow.show();
    var _this=this;
    this.wizardWindow=isc.TWindow.create({
        title:"DataSource Wizard",
        autoCenter:true,
        width:"85%",
        height:"85%",
        builder:_this,
        closeClick:function(){
            this.Super("closeClick",arguments);
            _this.dsWizard.resetWizard();
        },
        items:[
            _this.dsWizard=isc.DSWizard.create({
                callingBuilder:_this,
                dsDataSource:this.dsDataSource
            })
        ]
    });
}
,isc.A.showDSEditor=function isc_VisualBuilder_showDSEditor(dsID,isNew,instructions){
    var dataSource=isc.isAn.Array(dsID)?dsID[0]:dsID;
    if(isc.isA.String(dataSource)||isc.isA.DataSource(dataSource)){
        dataSource=isc.DS.get(dataSource);
    }
    var _this=this,
        context={target:_this,methodName:"addDataSource"};
    this.makeDSEditor();
    if(isNew)this.dsEditor.editNew(dataSource,context,instructions);
    else this.dsEditor.editSaved(dataSource,context,instructions);
    this.dsEditor.knownDataSources=this.dataSourceList.data;
    this.dsEditorWindow.show();
}
,isc.A.makeDSEditor=function isc_VisualBuilder_makeDSEditor(){
    if(this.dsEditorWindow)return;
    var _this=this;
    if(!this.dsEditor){
        this.dsEditor=isc.DataSourceEditor.create({
            dataSource:"DataSource",
            dsDataSource:this.dsDataSource,
            width:"100%",
            height:"80%",
            autoDraw:false,
            canAddChildSchema:true,
            canEditChildSchema:true,
            builder:_this,
            mainStackProperties:{
                _constructor:"TSectionStack"
            },
            instructionsProperties:{
                _constructor:"THTMLFlow"
            },
            mainEditorProperties:{
                _constructor:"TComponentEditor",
                formConstructor:isc.TComponentEditor
            },
            fieldLayoutProperties:{
                _constructor:"TLayout"
            },
            getUniqueDataSourceID:function(){
                var dsName,i=0;
                while(dsName==null){
                    dsName="dataSource"+i;
                    if(_this.dataSourceList.data.find("ID",dsName)){
                        dsName=null;
                        i++;
                    }
                }
                return dsName;
            }
        });
    }
    this.dsEditorWindow=isc.Window.create({
        title:"DataSource Editor",
        autoDraw:true,
        builder:this,
        isModal:true,
        autoCenter:true,
        width:"85%",
        height:"85%",
        canDragResize:true,
        items:[
            this.dsEditor
        ]
    });
}
,isc.A.hideRightMostResizeBar=function isc_VisualBuilder_hideRightMostResizeBar(){
    this.workspace.getMember(this.workspace.getMembers().length-1).showResizeBar=false;
}
,isc.A.addOperation=function isc_VisualBuilder_addOperation(){
    if(!this.schemaWindow){
        this.schemaWindow=isc.TWindow.create({
            title:this.schemaWindowTitle||"Webservice Operations",
            autoCenter:true,
            autoDraw:false,
            width:Math.round(this.width*.6),height:Math.round(this.height*.9),
            items:[
                this.addAutoChild("schemaViewer"),
                this.addAutoChild("schemaViewerSelectButton")
            ]
        });
    }
    this.getOperationsTreeData(this.getID()+".addOperationReply(data)");
}
,isc.A.addOperationReply=function isc_VisualBuilder_addOperationReply(data){
    this.schemaViewer.setData(isc.Tree.create({
        modelType:"children",
        root:data,
        nameProperty:"name",
        childrenProperty:"children"
    }));
    this.schemaViewer.getData().openAll();
    this.schemaWindow.show();
}
,isc.A.operationSelected=function isc_VisualBuilder_operationSelected(){
    var oldTree=this.schemaViewer.data,
        record=this.schemaViewer.getSelectedRecord();
    if(record!=null){
        if(record.serviceType=="service")record=oldTree.getChildren(record)[0];
        if(record.serviceType=="portType")record=oldTree.getChildren(record)[0];
        var portType=oldTree.getParent(record);
        var service=oldTree.getParent(portType);
        var location=record.location||portType.location||service.location;
        var tree=this.projectComponents.data;
        location=this.getOperationWSDLLocation(location);
        var _this=this;
        this.loadWebService(location,service.name,portType.name,record.name);
    }
}
,isc.A.getOperationWSDLLocation=function isc_VisualBuilder_getOperationWSDLLocation(location){return location;}
,isc.A.loadWebService=function isc_VisualBuilder_loadWebService(location,service,portType,operation){
    var _this=this;
    isc.xml.loadWSDL(location,function(webService){
                        _this.newServiceLoaded(webService,service,portType,operation,location);
                     },null,true);
}
,isc.A.newServiceLoaded=function isc_VisualBuilder_newServiceLoaded(webService,service,portType,operation,location){
    var soConfig={
        operationName:operation,
        serviceNamespace:webService.serviceNamespace,
        serviceName:webService.name,
        serviceDescription:service,
        portTypeName:portType,
        location:location
    };
    this.addWebService(webService,soConfig);
    this.schemaWindow.hide();
}
,isc.A.getOperationsTreeData=function isc_VisualBuilder_getOperationsTreeData(){
    var grid=this.operationsPalette,
        tree=grid?grid.data:null,
        data=tree?tree.getChildren(tree.getRoot()):null
    ;
    return data;
}
,isc.A.trimOperationsTreeData=function isc_VisualBuilder_trimOperationsTreeData(theTree,isInput){
    if(!theTree)return null;
    var messageType=isInput?"message_in":"message_out",
        preparedTree=isc.addProperties({},theTree),
        exitNow=false
    ;
    while(!exitNow){
        var node=preparedTree.find("serviceType",messageType);
        if(node){
            preparedTree.remove(node);
        }else exitNow=true;
    }
    return preparedTree;
}
,isc.A.addWebService=function isc_VisualBuilder_addWebService(service,serviceOperationConfig){
    var serviceInfo={};
    serviceInfo.webService=service;
    serviceInfo.inputSchema=service.getRequestMessage(serviceOperationConfig.operationName);
    serviceInfo.outputSchema=service.getResponseMessage(serviceOperationConfig.operationName);
    serviceOperationConfig.inputSchema=serviceInfo.inputSchema;
    serviceOperationConfig.outputSchema=serviceInfo.outputSchema;
    var soNode=this.addServiceOperation(serviceOperationConfig);
    var newTreeData=this.getComplexOperationsPaletteTreeData(),
        path="|"+serviceOperationConfig.serviceDescription+
               "|"+serviceOperationConfig.portTypeName+
               "|"+serviceOperationConfig.operationName,
        data;
    if(this.operationsPalette.getData()){
        data=isc.Tree.create({root:this.operationsPalette.getData().getRoot()});
    }else{
        data=isc.Tree.create({});
    }
    newTreeData.pathDelim="|";
    data.pathDelim="|";
    if(data.find(path)){
        this.logWarn("Attempting to add webservice operation that is already in the tree");
        this.schemaWindow.hide();
        return;
    }
    var operationNode;
    if(soNode){
        operationNode={
            name:serviceOperationConfig.operationName,
            serviceType:"operation",
            type:"IButton",
            defaults:{
                title:"Invoke "+serviceOperationConfig.operationName,
                autoFit:true,
                click:{
                    target:soNode.liveObject.ID,
                    name:"invoke",
                    title:"Invoke "+serviceOperationConfig.operationName
                }
            }
        };
    }else{
        operationNode={
            name:serviceOperationConfig.operationName,
            serviceType:"operation",
            canDrag:false
        };
    }
    path="|"+serviceOperationConfig.serviceDescription+
           "|"+serviceOperationConfig.portTypeName;
    var parentNode=data.find(path);
    var parentCreated=false;
    if(parentNode){
        data.add(operationNode,parentNode);
        parentCreated=true;
    }else{
        path="|"+serviceOperationConfig.serviceDescription;
        var parentNode=data.find(path);
        var parentCreated=false;
        if(parentNode){
            data.add({
                        name:serviceOperationConfig.portTypeName,
                        serviceType:"portType",
                        canDrag:false,
                        children:[operationNode]
                    },parentNode);
            parentCreated=true;
        }else{
            var subTree={
                name:serviceOperationConfig.serviceDescription,
                serviceType:"service",
                canDrag:false,
                children:[
                    {
                        name:serviceOperationConfig.portTypeName,
                        serviceType:"portType",
                        canDrag:false,
                        children:[operationNode]
                    }
                ]
            };
        }
        newTreeData.children.add(subTree);
        this.operationsPalette.setData(isc.Tree.create({
            modelType:"children",
            root:newTreeData,
            nameProperty:"name",
            childrenProperty:"children"
        }));
    }
    this.operationsPalette.setData(data);
    var path="|"+serviceOperationConfig.serviceDescription+
               "|"+serviceOperationConfig.portTypeName+
               "|"+serviceOperationConfig.operationName,
    parentNode=data.find(path);
    var settings={
        palette:this.operationsPalette,
        isOutput:false,
        operation:serviceOperationConfig.operationName,
        serviceName:serviceOperationConfig.serviceName,
        serviceNamespace:serviceOperationConfig.serviceNamespace
    };
    if(serviceInfo.inputSchema){
        this.setSchema(serviceInfo.inputSchema,parentNode,null,"",settings);
    }
    if(serviceInfo.outputSchema){
        settings.isOutput=true;
        this.setSchema(serviceInfo.outputSchema,parentNode,null,"",settings);
    }
    this.operationsPalette.getData().openAll();
}
,isc.A.addServiceOperation=function isc_VisualBuilder_addServiceOperation(config){
    var inVM,outVM;
    if(config.inputSchema){
        inVM={
            type:"ValuesManager",
            defaults:{
                parentProperty:"inputVM",
                dataSource:config.inputSchema.ID,
                serviceName:config.serviceName,
                serviceNamespace:config.serviceNamespace
            }
        };
    }
    if(config.outputSchema){
        outVM={
            type:"ValuesManager",
            defaults:{
                parentProperty:"outputVM",
                dataSource:config.outputSchema.ID,
                serviceName:config.serviceName,
                serviceNamespace:config.serviceNamespace
            }
        };
    }
    var so={
        type:"ServiceOperation",
        defaults:{
            operationName:config.operationName,
            serviceNamespace:config.serviceNamespace,
            serviceName:config.serviceName,
            serviceDescription:config.serviceDescription,
            portTypeName:config.portTypeName,
            location:config.location
        }
    };
    var tree=this.projectComponents;
    var soNode=tree.makeEditNode(so);
    tree.addComponent(soNode);
    if(inVM)tree.addComponent(tree.makeEditNode(inVM),soNode,null,"inputVM");
    if(outVM)tree.addComponent(tree.makeEditNode(outVM),soNode,null,"outputVM");
    return soNode;
}
,isc.A.shouldShowDataPathFields=function isc_VisualBuilder_shouldShowDataPathFields(){
    return this.operationsPalette?true:false;
}
,isc.A.getComplexOperationsPaletteTreeData=function isc_VisualBuilder_getComplexOperationsPaletteTreeData(){
    if(!this.operationsPalette||!this.operationsPalette.data)return{children:[]};
    var tree=this.operationsPalette.data,
        topLevelNodes=tree.getChildren(tree.getRoot());
    return{children:topLevelNodes};
}
,isc.A.setSchema=function isc_VisualBuilder_setSchema(schema,paletteParent,editParent,dataPath,settings){
    var populateTarget=settings.populateTarget&&this.targetContext!=null;
    var fieldNames=schema.getFieldNames();
    for(var i=0;i<fieldNames.length;i++){
        var fieldName=fieldNames[i],
            field=schema.getField(fieldName),
            complexType=schema.fieldIsComplexType(fieldName),
            editorType;
        var paletteNode=this.getFieldPaletteNode(schema,fieldName,dataPath,settings);
        var paletteTree=settings.palette.data;
        paletteTree.add(paletteNode,paletteParent||paletteTree.getRoot());
        if(populateTarget&&editParent&&editParent.type==this.complexTypeNodeConstructor){
            var canvasItem=null;
            if(complexType){
                var defaults={};
                isc.addProperties(defaults,this.canvasItemWrapperDefaults);
                isc.addProperties(defaults,this.canvasItemWrapperProperties);
                canvasItem=settings.palette.makeEditNode({
                    type:this.canvasItemWrapperConstructor,
                    defaults:defaults
                });
                this.targetContext.addNode(canvasItem,editParent);
            }
            var newEditNode=settings.palette.makeEditNode(paletteNode);
            this.targetContext.addNode(newEditNode,canvasItem||editParent);
            if(isc.EditContext)isc.EditContext.clearSchemaProperties(newEditNode);
        }
        if(complexType){
            var subSchema=schema.getSchema(field.type);
            this.setSchema(subSchema,paletteNode,newEditNode,
                (dataPath?dataPath+"/":"")+fieldName,settings);
        }
    }
}
,isc.A.getFieldPaletteNode=function isc_VisualBuilder_getFieldPaletteNode(schema,fieldName,dataPath,settings){
    var complexType=schema.fieldIsComplexType(fieldName),
        field=schema.getField(fieldName),
        isOutput=settings.isOutput,
        displayOnly=settings.displayOnly!=null
                        ?settings.displayOnly:isOutput,
        dsIDs=this.getSchemaDataSourceIDs(settings.operation,settings.serviceName,
                                            settings.serviceNamespace),
        defaults={
            schemaDataSource:isOutput?dsIDs.output:dsIDs.input,
            serviceNamespace:settings.serviceNamespace,
            serviceName:settings.serviceName,
            isComplexType:complexType,
            type:complexType?"complexType":"simpleType"
        },
        title=isc.DataSource.getAutoTitle(fieldName),
        paletteNode={
            name:fieldName,
            defaults:defaults
        },
        itemDataPath=(dataPath?dataPath+"/":"")+fieldName;
    defaults.dataPath=itemDataPath;
    if(displayOnly){
        defaults.inputDataPath=itemDataPath;
        defaults.inputSchemaDataSource=defaults.schemaDataSource;
        defaults.inputServiceNamespace=defaults.serviceNamespace;
        defaults.inputServiceName=defaults.serviceName;
    }
    if(displayOnly)defaults.canEdit=false;
    var maxOccurs=field.xmlMaxOccurs;
    if(maxOccurs=="unbounded")maxOccurs=1000;
    if(!complexType){
        paletteNode=this.getSimpleTypeNode(paletteNode,displayOnly,title);
    }else{
        defaults.dataSource=defaults.schemaDataSource;
        delete defaults.schemaDataSource;
        if(maxOccurs==null||maxOccurs<=1){
            paletteNode=this.getComplexTypeNode(paletteNode,displayOnly,title);
        }else{
            paletteNode=this.getRepeatingComplexTypeNode(paletteNode,maxOccurs,displayOnly,
                                                           schema,field.type,title);
        }
    }
    paletteNode.title=defaults.title;
    paletteNode.type=defaults.type;
    return paletteNode;
}
,isc.A.getSimpleTypeNode=function isc_VisualBuilder_getSimpleTypeNode(paletteNode,displayOnly,title){
    paletteNode.type=this.simpleTypeNodeConstructor;
    paletteNode.defaults.title=title;
    isc.addProperties(paletteNode.defaults,this.simpleTypeNodeDefaults);
    isc.addProperties(paletteNode.defaults,this.simpleTypeNodeProperties);
    return paletteNode;
}
,isc.A.getComplexTypeNode=function isc_VisualBuilder_getComplexTypeNode(paletteNode,displayOnly,title){
    paletteNode.type=this.complexTypeNodeConstructor;
    delete paletteNode.defaults.dataPath;
    delete paletteNode.defaults.inputDataPath;
    paletteNode.defaults.groupTitle=title;
    isc.addProperties(paletteNode.defaults,this.complexTypeNodeDefaults);
    isc.addProperties(paletteNode.defaults,this.complexTypeNodeProperties);
    return paletteNode;
}
,isc.A.getRepeatingComplexTypeNode=function isc_VisualBuilder_getRepeatingComplexTypeNode(paletteNode,maxOccurs,displayOnly,schema,type,title){
    if(maxOccurs<5&&displayOnly){
        paletteNode.type="DetailViewer";
    }else{
        paletteNode.type=(displayOnly?"ListGrid":"LineEditor");
    }
    var fieldSchema=schema.getSchema(type);
    var pathProperty=displayOnly?"inputDataPath":"dataPath";
    if(displayOnly){
        paletteNode.defaults.height=80;
        paletteNode.defaults.autoFitMaxRecords=10;
        paletteNode.defaults.canDragSelectText=true;
    }else{
        paletteNode.defaults.saveLocally=true;
    }
    var gridFields=fieldSchema.getFlattenedFields(null,paletteNode.defaults.dataPath,pathProperty);
    gridFields=isc.getValues(gridFields);
    gridFields=isc.applyMask(gridFields,["name","title","dataPath","inputDataPath"]);
    paletteNode.defaults.defaultFields=gridFields;
    isc.addProperties(paletteNode.defaults,this.repeatingComplexTypeNodeDefaults);
    isc.addProperties(paletteNode.defaults,this.repeatingComplexTypeNodeProperties);
    return paletteNode;
}
,isc.A.getSchemaDataSourceIDs=function isc_VisualBuilder_getSchemaDataSourceIDs(operation,serviceName,serviceNamespace){
    var schemaDSIDs={};
    var serviceOp=isc.ServiceOperation.getServiceOperation(operation,serviceName,
                                                             serviceNamespace);
    if(serviceOp){
        if(serviceOp.inputVM){
            schemaDSIDs.input=isc.DataSource.get(serviceOp.inputVM.dataSource).ID;
        }
        if(serviceOp.outputVM){
            schemaDSIDs.output=isc.DataSource.get(serviceOp.outputVM.dataSource).ID;
        }
    }
    return schemaDSIDs;
}
,isc.A.getTargetRuleScope=function isc_VisualBuilder_getTargetRuleScope(){
    var projectData=this.projectComponents.data,
        children=projectData.getChildren(projectData.getRoot())
    ;
    return(children.length>0?children[0].liveObject:null);
}
);
isc.B._maxIndex=isc.C+140;

isc.defineClass("MultiActionPanel","VLayout");
isc.A=isc.MultiActionPanel.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=450;
isc.A.height=250;
isc.A.layoutMargin=10;
isc.A.membersMargin=10;
isc.A.instructions="Click the <q>Add additional action</q> button to add a new action.&nbsp; "+
                  "Drag and drop to change the order of actions.&nbsp; Click on a row in the "+
                  "grid below to change the action, or click on the remove icon next to an "+
                  "action to remove it.";
isc.A.instructionsLabelDefaults={
        _constructor:"Label",
        width:"100%",
        height:1,
        overflow:"visible"
    };
isc.A.mainLayoutDefaults={
        _constructor:"HLayout",
        width:"100%",
        height:"100%",
        membersMargin:10
    };
isc.A.actionsGridDefaults={
        _constructor:"ListGrid",
        autoParent:"mainLayout",
        width:"100%",
        height:"100%",
        showHeader:false,
        defaultFields:[{
            name:"value",
            escapeHTML:true,
            formatCellValue:function(value,record,rowNum,colNum,actionsGrid){
                var title=null;
                if(actionsGrid.creator.getActionTitle){
                    title=actionsGrid.creator.getActionTitle(value.target,value.name);
                }
                return title||("["+value.title+"]");
            }
        }],
        emptyMessage:"No Actions",
        selectionType:"single",
        autoSelectEditors:false,
        canRemoveRecords:true,
        canReorderRecords:true,
        rowClick:function(record,recordNum,fieldNum,keyboardGenerated){
            var actionsGrid=this,
                multiActionPanel=actionsGrid.creator,
                menu=multiActionPanel.getActionMenu();
            menu.bindingComplete=function(binding){
                record.value=binding;
                var i=actionsGrid.getRowNum(record),
                    data=actionsGrid.data;
                data._startChangingData();
                data.removeAt(i);
                data.addAt(record,i);
                data._doneChangingData();
            };
            menu.show();
            var EH=this.ns.EH;
            menu.placeNear(EH.getX(),EH.getY());
        }
    };
isc.A.sideControlsLayoutDefaults={
        _constructor:"VLayout",
        autoParent:"mainLayout",
        height:"100%",
        membersMargin:5,
        align:"center"
    };
isc.A.moveToBeginningButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/up_first.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action to the beginning",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord);
                if(i>0){
                    var data=actionsGrid.data;
                    data._startChangingData();
                    data.removeAt(i);
                    data.addAt(selectedRecord,0);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.moveUpButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/up.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action up one",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord);
                if(i>0){
                    var data=actionsGrid.data;
                    data._startChangingData();
                    data.removeAt(i);
                    data.addAt(selectedRecord,i-1);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.moveDownButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/down.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action down one",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord),
                    data=actionsGrid.data;
                if(i<data.getLength()-1){
                    data._startChangingData();
                    data.removeAt(i);
                    data.addAt(selectedRecord,i+1);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.moveToEndButtonDefaults={
        _constructor:"ImgButton",
        autoParent:"sideControlsLayout",
        src:"[SKINIMG]TransferIcons/down_last.png",
        size:15,
        showDown:false,
        prompt:"Move the selected action to the end",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid,
                selectedRecord=actionsGrid.getSelectedRecord();
            if(selectedRecord!=null){
                var i=actionsGrid.getRowNum(selectedRecord),
                    data=actionsGrid.data;
                if(i<data.getLength()-1){
                    data._startChangingData();
                    data.removeAt(i);
                    data.add(selectedRecord);
                    data._doneChangingData();
                }
            }
        }
    };
isc.A.buttonsLayoutDefaults={
        _constructor:"HLayout",
        width:"100%",
        membersMargin:10
    };
isc.A.saveButtonDefaults={
        _constructor:"IButton",
        autoParent:"buttonsLayout",
        title:"Save",
        click:function(){
            var multiActionPanel=this.creator,
                actionsGrid=multiActionPanel.actionsGrid;
            actionsGrid.endEditing();
            var data=actionsGrid.data,
                bindings;
            if(isc.isAn.Array(data)&&data.length>0){
                bindings=data.getProperty("value");
            }
            this.creator.saveClick(bindings);
        }
    };
isc.A.cancelButtonDefaults={
        _constructor:"IButton",
        autoParent:"buttonsLayout",
        title:"Cancel",
        click:function(){
            this.creator.cancelClick();
        }
    };
isc.A.addAdditionalActionButtonTitle="Add additional action";
isc.A.addAdditionalActionButtonDefaults={
        _constructor:"IButton",
        autoParent:"buttonsLayout",
        addAsPeer:true,
        snapTo:"L",
        autoFit:true,
        icon:"[SKINIMG]actions/add.png",
        iconSize:16,
        showRollOverIcon:false,
        click:function(){
            var multiActionPanel=this.creator,
                menu=multiActionPanel.getActionMenu();
            menu.bindingComplete=function(binding){
                multiActionPanel.actionsGrid.data.add({value:binding});
            };
            menu.show();
            var rect=this.getPageRect();
            menu.placeNear(rect[0],rect[1]+rect[3]);
        }
    };
isc.A.actionMenuDefaults={
        _constructor:"ActionMenu",
        isForMultiActionPanel:true
    };
isc.A.autoChildren=["instructionsLabel","mainLayout","actionsGrid","sideControlsLayout","moveToBeginningButton","moveUpButton","moveDownButton","moveToEndButton","buttonsLayout","addAdditionalActionButton","saveButton","cancelButton"];
isc.B.push(isc.A.getActionMenu=function isc_MultiActionPanel_getActionMenu(){
        var actionMenu=this.actionMenu;
        if(actionMenu==null){
            actionMenu=this.actionMenu=this.createAutoChild("actionMenu",{
                builder:this.builder,
                sourceComponent:this.sourceComponent,
                sourceMethod:this.sourceMethod,
                components:this.currentComponents
            });
        }
        return actionMenu;
    }
,isc.A.initWidget=function isc_MultiActionPanel_initWidget(){
        this.Super("initWidget",arguments);
        this.addAutoChildren(this.autoChildren);
    }
,isc.A.getDynamicDefaults=function isc_MultiActionPanel_getDynamicDefaults(childName){
        if(childName==="instructionsLabel"){
            return{contents:this.instructions};
        }else if(childName==="buttonsLayout"){
            return{align:this.isRTL()?"left":"right"};
        }else if(childName==="addAdditionalActionButton"){
            return{title:this.addAdditionalActionButtonTitle};
        }
    }
,isc.A.configureFor=function isc_MultiActionPanel_configureFor(actionMenu){
        var currentStringMethods=actionMenu.currentStringMethods;
        if(currentStringMethods==null)currentStringMethods=[];
        var numStringMethods=currentStringMethods.length;
        var gridData=[];
        for(var i=0;i<numStringMethods;++i){
            var val=currentStringMethods[i].getValue();
            if(isc.isAn.Array(val)){
                for(var j=0;j<val.length;++j){
                    gridData.add({value:val[j]});
                }
            }else{
                gridData.add({value:val});
            }
        }
        this.actionsGrid.setData(gridData);
        this.sourceComponent=actionMenu.sourceComponent;
        this.sourceMethod=actionMenu.sourceMethod;
        this.currentComponents=actionMenu.components;
    }
);
isc.B._maxIndex=isc.C+4;

isc.MultiActionPanel.registerStringMethods({
    "saveClick":"bindings",
    "cancelClick":""
});
isc.defineClass("ActionMenu","Menu");
isc.A=isc.ActionMenu.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.isForMultiActionPanel=false;
isc.A._basicTypes=["string","number","boolean","object","array"];
isc.B.push(isc.A.initWidget=function isc_ActionMenu_initWidget(){
        this.setComponents(this.components);
        this.Super("initWidget",arguments);
    }
,isc.A.draw=function isc_ActionMenu_draw(){
        if(!this._origSelectedState){
            this._origSelectedState=isc.SelectionOutline.getSelectedState();
            isc.SelectionOutline.deselect();
        }
        return this.Super("draw",arguments);
    }
,isc.A.hide=function isc_ActionMenu_hide(){
        if(this._origSelectedState){
            isc.SelectionOutline.setSelectedState(this._origSelectedState);
            delete this._origSelectedState;
        }
        return this.Super("hide",arguments);
    }
,isc.A.setComponents=function isc_ActionMenu_setComponents(components){
        var items=[];
        if(!components)components=[];
        for(var i=0;i<components.length;i++){
            var component=components[i],
                item={
                    component:component,
                    icon:component.icon,
                    title:component.liveObject.getActionTargetTitle
                                        ?component.liveObject.getActionTargetTitle()
                                        :component.ID+" ("+component.type+")"
                };
            var actions=isc.jsdoc.getActions(component.type);
            if(actions){
                item.submenu=this.getActionsMenu(component,actions);
                items.add(item);
            }
        }
        if(!this.isForMultiActionPanel){
            items.add({
                title:"[None]",
                icon:"[SKINIMG]/actions/cancel.png",
                click:function(target,item,actionMenu){
                    actionMenu.clearAction();
                }
            });
            items.add({
                isSeparator:true
            });
            items.add({
                title:"Multiple&hellip;",
                click:function(target,item,actionMenu){
                    actionMenu.builder.showMultiActionWindow(actionMenu);
                }
            });
        }
        this.setData(items);
    }
,isc.A.rowOver=function isc_ActionMenu_rowOver(record){
        this.Super("rowOver",arguments);
        var component=record.component;
        if(component&&component.liveObject)isc.SelectionOutline.select(component.liveObject);
        else isc.SelectionOutline.deselect();
        this.bringToFront();
    }
,isc.A.getActionsMenu=function isc_ActionMenu_getActionsMenu(component,actions){
        var actionMenu=this,
            items=[];
        for(var i=0;i<actions.length;i++){
            var action=actions[i],
                item={
                    title:action.title?action.title:isc.DataSource.getAutoTitle(action.name),
                    icon:action.icon,
                    component:component,
                    targetAction:action,
                    click:function(target,item,menu){
                        actionMenu.bindAction(item.component,item.targetAction);
                    }
                };
            items.add(item);
        }
        return items;
    }
,isc.A.getInheritedMethod=function isc_ActionMenu_getInheritedMethod(type,methodName){
        while(type){
            var docItem=isc.jsdoc.getDocItem("method:"+type+"."+methodName);
            if(docItem!=null)return docItem;
            var ds=isc.DS.get(type);
            if(ds&&ds.methods){
                var method=ds.methods.find("name",methodName);
                if(method)return method;
            }
            var clazz=isc.ClassFactory.getClass(type);
            if(clazz==null)return null;
            clazz=clazz.getSuperClass();
            if(clazz==null)return null;
            type=clazz.getClassName();
        }
    }
,isc.A.bindAction=function isc_ActionMenu_bindAction(component,actionMethod){
        var sourceComponent=this.sourceComponent,
            sourceMethodDoc=this.getInheritedMethod(sourceComponent.type,this.sourceMethod),
            sourceMethod=isc.isAn.XMLNode(sourceMethodDoc)?isc.jsdoc.toJS(sourceMethodDoc):sourceMethodDoc;
        if(this.logIsDebugEnabled("actionBinding")){
            this.logDebug("bindAction: component "+component.ID+
                          ", sourceMethod: "+this.echoFull(sourceMethod)+
                          ", action method: "+this.echoFull(actionMethod),
                          "actionBinding");
        }
        var binding={
            target:component.ID,
            name:actionMethod.name
        };
        var sourceParams;
        if(actionMethod.params){
            var mapping=[],
                foundMatchingParams=false;
            sourceParams=sourceMethod.params;
            if(!sourceParams)sourceParams=[];
            else if(!isc.isAn.Array(sourceParams))sourceParams=[sourceParams];
            else sourceParams=sourceParams.duplicate();
            sourceParams.add({
                name:"this",
                type:this.sourceComponent.type
            });
            for(var i=0;i<actionMethod.params.length;i++){
                var actionParam=actionMethod.params[i];
                this.logInfo("considering actionMethod "+actionMethod.name+" param: "+
                              actionParam.name+" of type "+actionParam.type,
                             "actionBinding");
                var actionParamIsOptional=
                        actionParam.optional!=null&&actionParam.optional.toString()!="false"
                ;
                if(!actionParamIsOptional||actionParam.type!=null&&
                    !this._basicTypes.contains(actionParam.type.toLowerCase()))
                {
                    var sourceParam=this.getMatchingSourceParam(actionParam,sourceParams);
                    if(sourceParam!=null){
                        mapping[i]=sourceParam.name;
                        sourceParam._used=true;
                        foundMatchingParams=true;
                        continue;
                    }else if(!actionParamIsOptional){
                        this.logInfo("action binding failed, actionMethod param "+
                                      actionParam.name+" of type "+actionParam.type+
                                     " couldn't be fulfilled",
                                     "actionBinding");
                        isc.say("Visual Builder couldn't find an automatic binding from event "+
                                sourceMethod.name+
                                " to action "+(actionMethod.title||actionMethod.name));
                        return null;
                    }
                }
                mapping[i]="null";
            }
            if(foundMatchingParams)binding.mapping=mapping;
        }
        if(this.logIsInfoEnabled("actionBinding")){
            this.logWarn("generated binding: "+this.echoFull(binding),"actionBinding");
        }
        if(sourceParams)sourceParams.setProperty("_used",null);
        this.bindingComplete(binding);
    }
,isc.A.bindingComplete=function isc_ActionMenu_bindingComplete(bindings){
    }
,isc.A.clearAction=function isc_ActionMenu_clearAction(){
        var binding=null;
        this.bindingComplete(binding);
    }
,isc.A.getMatchingSourceParam=function isc_ActionMenu_getMatchingSourceParam(actionParam,sourceParams){
        var actionParamType=this.getFirstType(actionParam.type);
        var actionParamDS=isc.DS.get(actionParamType);
        this.logInfo("selected type "+actionParamType+
                     " has schema: "+actionParamDS,"actionBinding");
        for(var i=0;i<sourceParams.length;i++){
            var sourceParam=sourceParams[i];
            if(sourceParam._used)continue;
            this.logDebug("considering source param: "+sourceParam.name+
                          " of type "+sourceParam.type,
                          "actionBinding");
            var sourceParamType=this.getFirstType(sourceParam.type);
            var sourceParamDS=isc.DS.get(sourceParamType);
            if(!sourceParamDS){
                if(actionParamType==sourceParamType)return sourceParam;
                continue;
            }
            if(sourceParamDS.inheritsSchema(actionParamDS)){
                return sourceParam;
            }
        }
    }
,isc.A.getFirstType=function isc_ActionMenu_getFirstType(type){
        type=type.split(/[ \t]+/)[0];
        type=type.substring(0,1).toUpperCase()+type.substring(1);
        return type;
    }
);
isc.B._maxIndex=isc.C+12;

isc.A=isc.jsdoc;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getActions=function isc_c_jsdoc_getActions(className){
        var ds=isc.DS.get(className);
        if(ds==null)return null;
        var actions,
            seenActions={};
        while(ds!=null){
            var dsActions=ds.methods?ds.methods.findAll("action",true):null;
            if(dsActions==null){
                if(ds.showSuperClassActions==false)break;
                ds=ds.superDS();
                continue;
            }
            for(var i=0;i<dsActions.length;i++){
                var dsAction=dsActions[i],
                    docItem=isc.jsdoc.getDocItem("method:"+ds.ID+"."+dsAction.name),
                    docData=docItem?isc.jsdoc.toJS(docItem):dsAction;
                if(dsAction.name in seenActions)continue;
                seenActions[dsAction.name]=dsAction;
                if(dsAction.inapplicable==true||dsAction.inapplicable=="true")continue;
                if(actions==null)actions=[];
                var action=isc.addProperties({},docData,dsAction);
                actions.add(action);
                var params=action.params;
                if(params!=null&&!isc.isAn.Array(params))action.params=[params];
            }
            if(ds.showSuperClassActions==false)break;
            ds=ds.superDS();
        }
        return actions;
    }
);
isc.B._maxIndex=isc.C+1;

isc.defineClass("GridSearch","DynamicForm");
isc.A=isc.GridSearch.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.browserSpellCheck=false;
isc.A.height=20;
isc.A.numCols=2;
isc.A.cellPadding=0;
isc.A.colWidths=[46,200];
isc.A.titleSuffix=":&nbsp;";
isc.A.showSearchTitle=false;
isc.A.wrapItemTitles=false;
isc.A.selectOnFocus=true;
isc.A.hint="Find...";
isc.A.searchTitle="<span style='color:#FFFFFF'>Search</span>";
isc.B.push(isc.A.initWidget=function isc_GridSearch_initWidget(){
        this.items=[isc.addProperties(
            {name:"search",width:"*",colSpan:"*",showTitle:this.showSearchTitle,
             editorType:"TTextItem",
             selectOnFocus:true,
             title:this.searchTitle,showHintInField:true,hint:this.hint,
             changed:"form.findNode()",
             keyPress:function(item,form,keyName){
                 if(keyName=="Enter")form.findNode();
                 if(keyName=="Escape"){
                     form.revertState();
                     return false;
                 }
             }},this.searchItemProperties)
        ];
        this.Super("initWidget",arguments);
        if(this.grid)this.setGrid(this.grid);
    }
,isc.A.setGrid=function isc_GridSearch_setGrid(grid){
        this.grid=grid;
        this.defaultSearchProperty();
        if(isc.isA.TreeGrid(grid)){
            if(grid._getNodeTitleMovedBySearchGrid)grid.getNodeTitle=grid._getNodeTitleMovedBySearchGrid;
            grid._getNodeTitleMovedBySearchGrid=grid.getNodeTitle;
            grid.getNodeTitle=function(record,recordNum,field){
                var value=grid._getNodeTitleMovedBySearchGrid(record,recordNum,field);
                if(record._searchHit){
                    var newValue,searchRe;
                    if(value.match(/<.*>/)){
                        searchRe=new RegExp("(^|>)([^<]*?)("+record._searchHit+")","ig");
                        newValue=value.replace(searchRe,"$1$2<span style='background-color:#FF0000;'>$3</span>");
                    }else{
                        searchRe=new RegExp("("+record._searchHit+")","ig");
                        newValue=value.replace(searchRe,"<span style='background-color:#FF0000;'>$1</span>");
                    }
                     value=newValue;
                }
                return value;
            };
        }else{
            if(grid._formatCellValueMovedBySearchGrid)grid.formatCellValue=grid._formatCellValueMovedBySearchGrid;
            grid.formatCellValue=function(value,record,rowNum,colNum){
                if(grid._formatCellValueMovedBySearchGrid){
                    value=grid._formatCellValueMovedBySearchGrid(value,record,rowNum,colNum);
                }
                if(value!=null&&record._searchHit){
                    var newValue,searchRe;
                    if(value.match(/<.*>/)){
                        searchRe=new RegExp("(^|>)([^<]*?)("+record._searchHit+")","ig");
                        newValue=value.replace(searchRe,"$1$2<span style='background-color:#FF0000;'>$3</span>");
                    }else{
                        searchRe=new RegExp("("+record._searchHit+")","ig");
                        newValue=value.replace(searchRe,"<span style='background-color:#FF0000;'>$1</span>");
                    }
                    value=newValue;
                }
                return value;
            };
        }
    }
,isc.A.defaultSearchProperty=function isc_GridSearch_defaultSearchProperty(){
        if(!this.searchProperty&&this.grid){
            if(isc.isA.TreeGrid(this.grid)){
                this.searchProperty=this.grid.getTitleField();
            }else{
                this.searchProperty=this.grid.getFieldName(0);
            }
        }
    }
,isc.A.revertState=function isc_GridSearch_revertState(){
        var grid=this.grid;
        if(this._lastMatch){
            delete this._lastMatch._searchHit;
            grid.refreshRow(grid.getRecordIndex(this._lastMatch));
        }
        this._lastValue=this._lastMatch=null;
        if(this._lastOpenedFolders){
            for(var i=0;i<this._lastOpenedFolders.length;i++)grid.data.closeFolder(this._lastOpenedFolders[i]);
        }
        this._lastOpenedFolders=null;
        this.clearValue("search");
    }
,isc.A.findNode=function isc_GridSearch_findNode(){
        if(!this.grid||!this.grid.getData())return;
        var search=this.getValue("search");
        if(search==null){
            this.revertState();
            return;
        }
        search=search.toLowerCase();
        var findNext=this._lastValue==search&&this._lastMatch;
        this._lastValue=search;
        var grid=this.grid;
        var des=isc.isA.TreeGrid(grid)?grid.data.getAllNodes():grid.getData();
        var startIndex=this._lastMatch?des.indexOf(this._lastMatch):0;
        if(findNext)startIndex++;
        if(this._lastMatch){
            delete this._lastMatch._searchHit;
            grid.refreshRow(grid.getRecordIndex(this._lastMatch));
            this._lastMatch=null;
        }
        var match=this.findNext(des,startIndex,search);
        if(!match)match=this.findNext(des,0,search);
        if(match){
            this._lastMatch=match;
            match._searchHit=search;
            if(this._lastOpenedFolders){
                for(var i=0;i<this._lastOpenedFolders.length;i++)grid.data.closeFolder(this._lastOpenedFolders[i]);
            }
            this._lastOpenedFolders=null;
            if(isc.isA.TreeGrid(grid)){
                var parents=grid.data.getParents(match);
                this._lastOpenedFolders=[];
                for(var i=0;i<parents.length;i++){
                    var parent=parents[i];
                    if(!grid.data.isOpen(parent)){
                        this._lastOpenedFolders.add(parent);
                        grid.data.openFolder(parent);
                    }
                }
                if(grid.data.isFolder(match)&&!grid.data.isOpen(match)){
                    grid.data.openFolder(match);
                    this._lastOpenedFolders.add(match);
                }
            }
            var recordIndex=grid.getRecordIndex(match);
            grid.refreshRow(recordIndex);
            grid.scrollRecordIntoView(recordIndex);
        }
    }
,isc.A.findNext=function isc_GridSearch_findNext(des,startIndex,search){
        for(var i=startIndex;i<des.getLength();i++){
            var node=des.get(i);
            if(node[this.searchProperty]&&node[this.searchProperty].toLowerCase().contains(search)){
                return node;
            }
        }
    }
);
isc.B._maxIndex=isc.C+6;

isc.DataSource.create({
    operationBindings:[
        {
            operationId:"checkUploadFeature",
            operationType:"custom"
        }
    ],
    allowAdvancedCriteria:true,
    ID:"SCUploadSaveFile",
    addGlobalId:false,
    fields:[
        {
            name:"path",
            hidden:true,
            validators:[
            ],
            primaryKey:true
        },
        {
            name:"file",
            type:"binary",
            validators:[
            ]
        },
        {
            hidden:true,
            name:"file_dir",
            validators:[
            ]
        }
    ]
})
isc.defineClass("MockupImporter");
isc.A=isc.MockupImporter;
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A._isValidID=function isc_c_MockupImporter__isValidID(id){
        return(id.match(isc.MockupImporter._identifierRegexp)!=null);
    }
,isc.A._createStrRegexp=function isc_c_MockupImporter__createStrRegexp(c){
        return c+"(?:[^\\"+c+"]|\\.)*?"+c;
    }
,isc.A._createKeyValueRegexp=function isc_c_MockupImporter__createKeyValueRegexp(key,sep,value){
        return"\\s*"+key+"\\s*"+sep+"\\s*"+value+"\\s*";
    }
,isc.A._createEntryRegexp=function isc_c_MockupImporter__createEntryRegexp(sep){
        var singleQuotedStr="("+isc.MockupImporter._createStrRegexp("'")+")",
            doubleQuotedStr="("+isc.MockupImporter._createStrRegexp("\"")+")",
            unquotedStr="([^;\\s"+sep+"](?:[^;"+sep+"]*[^;\\s"+sep+"])?)",
            str="(?:"+
                   singleQuotedStr+"|"+
                   doubleQuotedStr+"|"+
                   unquotedStr+")",
            kv=isc.MockupImporter._createKeyValueRegexp(str,sep,str),
            regexp="^(?:(?:"+kv+")|([^;]*))";
        return regexp;
    }
,isc.A._parseCustomProperties=function isc_c_MockupImporter__parseCustomProperties(str){

        var parse=function(str,kvRegexp){

            var keys=[],values=[],errors=[];
            for(var j=0,len=str.length;j<len;++j){
                var s=str.substring(j);
                var match=s.match(kvRegexp);
                if(match[7]!=null){
                    var err=match[7].toString().trim();
                    if(err!=""){
                        errors.push(err);
                    }
                }else{
                    var key,value;
                    if(match[1]!=null)key=eval(match[1].toString());
                    else if(match[2]!=null)key=eval(match[2].toString());
                    else key=match[3].toString();
                    if(match[4]!=null)value=eval(match[4].toString());
                    else if(match[5]!=null)value=eval(match[5].toString());
                    else value=match[6].toString();
                    keys.push(key);
                    values.push(value);
                }
                j+=match[0].toString().length;
            }
            return{keys:keys,values:values,errors:errors};
        };
        var result1=parse(str,isc.MockupImporter._keyColonValueRegexp),
            result2=parse(str,isc.MockupImporter._keyEqualValueRegexp);
        return(result1.errors.length<=result2.errors.length?result1:result2);
    }
,isc.A.getDataViewXml=function isc_c_MockupImporter_getDataViewXml(topLevelIds){
        var dataView='<DataView width="100%" height="100%"\n'+
                       '          overflow="hidden" autoDraw="true">\n'+
            '    <minMemberSize>18</minMemberSize>\n'+
            '    <members>\n'+
            '        <Canvas ID="MockupCanvas">\n'+
            '            <children>\n';
        for(var i=0;i<topLevelIds.length;i++){
            dataView+='                <Canvas ref="'+topLevelIds[i]+'"/>\n';
        }
        dataView+='            </children>\n'+
            '        </Canvas>\n'+
            '    </members>\n'+
            '</DataView>\n';
        return dataView;
    }
);
isc.B._maxIndex=isc.C+6;

isc.A=isc.MockupImporter;
isc.A._identifierRegexp=new RegExp("^[a-zA-Z_$][a-zA-Z0-9_$]*$");
isc.A._keyColonValueRegexp=new RegExp(isc.MockupImporter._createEntryRegexp(":"));
isc.A._keyEqualValueRegexp=new RegExp(isc.MockupImporter._createEntryRegexp("="))
;

isc.A=isc.MockupImporter.getPrototype();
isc.A.globalIDs=[];
isc.A.transformRules=isc.Page.getToolsDir()+"visualBuilder/balsamiqTransformRules.js";
isc.A.useLayoutHeuristics=true;
isc.A.sloppyEdgeControlOverflow=10;
isc.A.maxControlOverlap=20;
isc.A.stackContainerFillInset=20;
isc.A.labelMaxOffset=10;
isc.A.dropExtraProperties=true;
isc.A.allowedExtraProperties=[];
isc.A.tallFormItems=["TextAreaItem","RadioGroupItem","SpacerItem","ButtonItem"];
isc.A.ignoreWidthFormItems=["DateItem","StaticTextItem"];
isc.A.dropMarkup=true;
isc.A.trimSpace=true;
isc.A.fillSpace=true;
isc.A.trimWhitespace=true;
isc.A.formsGridCellWidth=5;
isc.A.formsGridCellHeight=22;
isc.A.maxOuterControlsDistance=50;
isc.A.stackFlexMaxSizeMatch=10;
isc.A.formExtraSpaceThreshold=15;
isc.A.formExtraWidthThreshold=30;
isc.A.defaultButtonSize=27;
isc.A.buttonMinimumChangeSize=3;
isc.A._additionalLayouts=["HStack","HLayout","VStack","VLayout"];
isc.A._titledFormItems=["ButtonItem","CheckboxItem","RadioItem"];
isc.A._linkedLayouts={};
isc.A._notFoundLinkTargets=[];
isc.A.fieldNamingConvention="camelCaps";
isc.A.warnings=""
;

isc.A=isc.MockupImporter.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A._delayedCalls=[];
isc.A._init=false;
isc.B.push(isc.A.init=function isc_MockupImporter_init(){
        var _this=this;
        isc.FL.loadJSFiles(this.transformRules,function(){
            _this._init=true;
            var transformRules=window.transformRules;
            if(transformRules==null){
                isc.logWarn("The MockupImporter could not find window.transformRules.");
                transformRules={
                    classTranslations:{},
                    propertyTranslations:{},
                    formItems:[],
                    markupItems:[],
                    widgetPropertyTranslations:{}
                };
            }
            _this._transformRules=transformRules;
            transformRules.mockupImporter=_this;
            for(var i=0;i<_this._delayedCalls.length;i++){
                var delayedCall=_this._delayedCalls[i];
                try{
                    if(delayedCall.xml)_this.bmmlToXml(delayedCall.xml,delayedCall.callback);
                    else _this.reifyComponentXml(delayedCall.componentXml,delayedCall.callback);
                }catch(e){
                    _this.logError("MockupImporter.init(): "+e+". Stack: "+e.stack);
                }
            };
            _this._delayedCalls.clear();
            delete _this._delayedCalls;
        });
    }
,isc.A.bmmlToXml=function isc_MockupImporter_bmmlToXml(bmmlXmlString,callback){
        if(!this._init){
            this._delayedCalls.add({xml:bmmlXmlString,callback:callback});
        }else{
            this.warnings="";
            this._bmmlToXml(bmmlXmlString,callback);
        }
    }
,isc.A._bmmlToXml=function isc_MockupImporter__bmmlToXml(bmmlXmlString,callback,fileName){
        var file=fileName;
        if(file==null){
            file=this.mockupPath;
        }else{
            this.dropMarkup=true;
        }
        if(this._linkedLayouts[file]==null){
            this._linkedLayouts[file]={
                widgets:[]
            };
        }
        var bmmlDataJS=isc.XMLTools.toJS(isc.XMLTools.parseXML(bmmlXmlString));
        var widgets=this._convertBMMLWidgetsToISCWidgets(bmmlDataJS,file);
        if(file==this.mockupPath&&!this.dropMarkup){
            this._mockupElements=[];
        }
        for(var i=0;i<widgets.length;i++){
            if(widgets[i]._constructor=="MockupElement"&&
                widgets[i].controlName!="com.balsamiq.mockups::HSplitter"&&
                widgets[i].controlName!="com.balsamiq.mockups::VSplitter"){
                if(file==this.mockupPath&&!this.dropMarkup){
                    this._mockupElements.add(isc.clone(widgets[i]));
                }
                widgets.removeAt(i);
                i--;
            }else if(this.dropMarkup&&
                       widgets[i].specialProperties&&
                       widgets[i].specialProperties.markup)
            {
                widgets.removeAt(i);
                i--;
            }
        }
        var _this=this;
        this._loadSymbolsAssets(widgets,function(resultLayout){
            var transformRules=_this._transformRules;
            if(resultLayout==null){
                callback(null);
                return;
            }
            _this.adjustLayoutPosition(resultLayout);
            if(file==_this.mockupPath&&_this._mockupElements){
                var links=_this._getLinks(resultLayout);
                if(links.length==0){
                    resultLayout.addList(_this._mockupElements);
                    delete _this._mockupElements;
                }
            }
            if(_this.useLayoutHeuristics){
                resultLayout=_this.processHeuristics(resultLayout);
            }
            _this.postProcessLayout(resultLayout);
            _this._linkedLayouts[file].layout=resultLayout;
            _this._processLinks(resultLayout,fileName,callback);
        });
    }
,isc.A.reifyComponentXml=function isc_MockupImporter_reifyComponentXml(componentXmlString,callback){
        if(!this._init){
            this._delayedCalls.add({componentXml:componentXmlString,callback:callback});
        }else{
            this.warnings="";
            var _this=this;
            isc.DMI.callBuiltin({
                methodName:"xmlToJS",
                arguments:[componentXmlString],
                callback:function(rpcResponse,jsData){
                    _this._reifyComponentXml(jsData,callback);
                }
            });
        }
    }
,isc.A._reifyComponentXml=function isc_MockupImporter__reifyComponentXml(js,callback){
        var _this=this,
            editContext=isc.EditContext.create()
        ;
        editContext.getPaletteNodesFromJS(js,function(nodes){
            var widgets=nodes,
                transformRules=_this._transformRules,
                classTranslations=transformRules.classTranslations
            ;
            if(nodes.length==1&&nodes[0].defaults.components){
                var defaults=nodes[0].defaults;
                widgets=[];
                widgets.addList(defaults.dataSources);
                widgets.addList(defaults.components);
            }
            for(var i=0;i<widgets.length;i++){
                var widget=widgets[i];
                if(widget._constructor=="DynamicForm"&&widget.fields.length==1){
                    var field=widget.fields[0],
                        controlName=_this.getBalsamiqControlNameForSCControl(field._constructor)
                    ;
                    if(!widget.specialProperties)widget.specialProperties={};
                    widget.specialProperties.controlName=controlName;
                    widget.specialProperties.markup=false;
                    widget.fields[0].specialProperties=isc.shallowClone(widget.specialProperties);
                }
                if(!widget.specialProperties||!widget.specialProperties.controlName){
                    var controlName=_this.getBalsamiqControlNameForSCControl(widget._constructor);
                    if(controlName){
                        if(!widget.specialProperties)widget.specialProperties={};
                        widget.specialProperties.controlName=controlName;
                    }
                }
                if(widget.zIndex==null)widget.zIndex=100000;
            }
            var resultLayout=widgets;
            _this.adjustLayoutPosition(resultLayout);
            if(_this.useLayoutHeuristics){
                resultLayout=_this.processHeuristics(resultLayout);
            }
            _this.postProcessLayout(resultLayout);
            if(callback){
                var res=isc.EditContext.serializeDefaults(_this._cleanLayout(resultLayout));
                callback(res.replace(/\r/g,"\n"),resultLayout,
                         _this._getLayoutIds(resultLayout));
            }
        },[isc.RPC.ALL_GLOBALS]);
    }
,isc.A.adjustLayoutPosition=function isc_MockupImporter_adjustLayoutPosition(layout){
        if(this.trimSpace){
            var minLeft=10000;
            var minTop=10000;
            for(var i=0;i<layout.length;i++){
                if(layout[i].left!=null&&layout[i].top!=null){
                    minLeft=Math.min(minLeft,layout[i].left);
                    minTop=Math.min(minTop,layout[i].top);
                }
            }
            for(var i=0;i<layout.length;i++){
                if(layout[i].left!=null&&layout[i].top!=null){
                    layout[i].left-=minLeft;
                    layout[i].top-=minTop;
                }
            }
        }
    }
,isc.A.postProcessLayout=function isc_MockupImporter_postProcessLayout(layout){
        var transformRules=this._transformRules;
        for(var i=0;i<layout.length;i++){
            var layoutItem=layout[i];
            var specialProperties=layoutItem.specialProperties;
            if(specialProperties!=null&&
                    (specialProperties.overrideWidth||specialProperties.overrideHeight))
            {
                if(specialProperties.overrideWidth){
                    if(layoutItem._constructor=="DynamicForm"){
                        layoutItem.width="100%";
                    }else{
                        layoutItem.width="*";
                    }
                }
                if(specialProperties.overrideHeight){
                    if(layoutItem._constructor=="DynamicForm"){
                        layoutItem.height="100%";
                    }else{
                        layoutItem.height="*";
                    }
                }
            }
            if(specialProperties!=null&&
               (specialProperties.fullWidth||specialProperties.fullHeight)&&
               layoutItem._constructor!="FacetChart")
            {
                if(specialProperties.containerName=="TabSet"||
                    specialProperties.containerName=="Window"||
                    specialProperties.containerName=="SectionStack"||
                    specialProperties.containerName=="HStack"||
                    specialProperties.containerName=="HLayout"||
                    specialProperties.containerName=="VLayout")
                {
                    if(specialProperties.fullWidth){
                        delete layoutItem.width;
                    }
                    if(specialProperties.fullHeight){
                        delete layoutItem.height;
                    }
                }else if(specialProperties.containerName=="VStack"||
                    specialProperties.controlName=="com.balsamiq.mockups::FieldSet"||
                    specialProperties.controlName=="com.balsamiq.mockups::Canvas"||
                    specialProperties.controlName=="com.balsamiq.mockups::TabBar")
                {
                    if(specialProperties.fullWidth){
                        layoutItem.width="100%";
                    }
                    if(specialProperties.fullHeight){
                        layoutItem.height="100%";
                    }
                }
            }
            delete layoutItem.absX;
            delete layoutItem.absY;
            if(layoutItem._constructor=="DynamicForm"&&
                layoutItem.isGroup!=true&&layoutItem.height!="*")
            {
                if(layoutItem.specialProperties.calculatedHeight!=null){
                    layoutItem.height=layoutItem.specialProperties.calculatedHeight;
                    if(layoutItem.padding!=null){
                        layoutItem.height+=(2*layoutItem.padding);
                        layoutItem.specialProperties.calculatedHeight+=(2*layoutItem.padding);
                    }
                }
            }
            if(layoutItem.specialProperties){
                var controlName=layoutItem.specialProperties.controlName;
                var widgetProperties=transformRules.widgetPropertyTranslations[controlName];
                if(widgetProperties&&widgetProperties.onProcessFinished){
                    widgetProperties.onProcessFinished(layoutItem);
                }
            }
            if(layoutItem._constructor=="DynamicForm"){
                var items=layoutItem.items||layoutItem.fields;
                if(items){
                    for(var j=0;j<items.length;j++){
                        var sp=items[j].specialProperties;
                        if(sp){
                            var controlName=sp.controlName;
                            var widgetProperties=transformRules.widgetPropertyTranslations[controlName];
                            if(widgetProperties&&widgetProperties.onProcessFinished){
                                widgetProperties.onProcessFinished(items[j]);
                            }
                        }
                    }
                }
            }
        }
    }
,isc.A.getBalsamiqControlNameForSCControl=function isc_MockupImporter_getBalsamiqControlNameForSCControl(type){
        var transformRules=this._transformRules,
            classTranslations=transformRules.classTranslations,
            controlName
        ;
        for(var key in classTranslations){
            if(classTranslations[key]==type){
                controlName=key;
                break;
            }
        }
        return controlName;
    }
,isc.A._processLinks=function isc_MockupImporter__processLinks(layout,fileName,callback){
        if(this._linksCounter==null){
            this._linksCounter=0;
        }
        var _this=this;
        var loadLinksCounter=0;
        for(var i=0;i<layout.length;i++){
            var widgets=[layout[i]];
            if(layout[i]._constructor=="DynamicForm"&&layout[i].items){
                widgets=layout[i].items;
            }
            if(layout[i]._constructor=="SectionStack"&&layout[i].specialProperties.widgets){
                widgets=layout[i].specialProperties.widgets;
                widgets.add(layout[i]);
            }
            for(var widgetCounter=0;widgetCounter<widgets.length;widgetCounter++){
                var widget=widgets[widgetCounter];
                if(widget.specialProperties==null||
                    (widget.specialProperties.hrefs==null&&
                     widget.specialProperties.href==null))continue;
                var links=null;
                if(widget.specialProperties.hrefs){
                    if(isc.isA.String(widget.specialProperties.hrefs)){
                        links=widget.specialProperties.hrefs.split(",");
                    }else{
                    }
                }else if(widget.specialProperties.href){
                    links=[widget.specialProperties.href];
                }
                if(links==null)continue;
                var dir=this.mockupPath.substring(0,this.mockupPath.lastIndexOf("/"));
                widget.specialProperties.links=[];
                for(var j=0;j<links.length;j++){
                    var linkData=links[j].split("&bm;");
                    var linkFileName=linkData[1];
                    if(linkFileName==null){
                        widget.specialProperties.links.add(null);
                        continue;
                    }
                    linkFileName=dir+"/"+linkFileName;
                    widget.specialProperties.links.add({
                        fileName:linkFileName,
                        name:linkData[0]
                    });
                    if(this._linkedLayouts[linkFileName]){
                        this._linkedLayouts[linkFileName].widgets.add(widget);
                    }else{
                        this._linkedLayouts[linkFileName]={
                            widgets:[widget],
                            fileName:linkFileName,
                            layoutName:linkData[0]
                        };
                        loadLinksCounter++;
                        var processLinksCallback=function(linkLayout){
                            loadLinksCounter--;
                            if(loadLinksCounter==0){
                                if(linkLayout==null){
                                    callback(null);
                                }else if(fileName){
                                    callback(_this._clone(layout));
                                }else{
                                    layout=_this._mergeLinksLayout(layout);
                                    if(_this._mockupElements){
                                        layout.addList(_this._mockupElements);
                                    }
                                    var res=isc.EditContext.serializeDefaults(_this._cleanLayout(layout));
                                    callback(res.replace(/\r/g,"\n"),[],_this._getLayoutIds(layout));
                                    if(_this._notFoundLinkTargets.length>0){
                                        _this.logWarn("During import these custom components were not found: "+
                                            _this._notFoundLinkTargets);
                                    }
                                }
                            }
                        };
                        this._loadLinkedLayout(linkFileName,processLinksCallback);
                    }
                };
            };
        }
        if(loadLinksCounter==0){
            if(fileName){
                callback(this._clone(layout));
            }else if(this._linksCounter==0){
                if(this._mockupElements){
                    layout.addList(this._mockupElements);
                }
                var res=isc.EditContext.serializeDefaults(this._cleanLayout(layout));
                callback(res.replace(/\r/g,"\n"),layout);
                if(this._notFoundLinkTargets.length>0){
                    this.logWarn("During import these custom components were not found: "+
                        this._notFoundLinkTargets);
                }
            }
        }
    }
,isc.A._getLayoutIds=function isc_MockupImporter__getLayoutIds(layout){
        var res=[];
        for(var i=0;i<layout.length;i++){
            if(layout[i].ID)res.add(layout[i].ID);
        }
        return res;
    }
,isc.A._loadLinkedLayout=function isc_MockupImporter__loadLinkedLayout(linkFileName,processLinksCallback,actualLinkFileName){
        var _this=this;
        isc.DMI.callBuiltin({
            methodName:"loadFile",
            arguments:[linkFileName],
            callback:function(rpcResponse){
                var loadedLinkFileName=actualLinkFileName||linkFileName;
                if(rpcResponse.status==isc.RPCResponse.STATUS_FAILURE){
                    var slashInd=linkFileName.lastIndexOf("/");
                    var prefix=linkFileName.substring(0,slashInd);
                    var fileName=linkFileName.substring(slashInd+1);
                    if(!prefix.endsWith("/assets")){
                        var newLinkFileName=prefix+"/assets/"+fileName;
                        _this._loadLinkedLayout(newLinkFileName,processLinksCallback,loadedLinkFileName);
                        return;
                    }
                    if(_this._inaccessibleResourcesList==null){
                        _this._inaccessibleResourcesList=[];
                    }
                    _this._inaccessibleResourcesList.add(loadedLinkFileName);
                    var errMsg="Unable to import this mockup. Missing resources:<br/>";
                    for(var cnt=0;cnt<_this._inaccessibleResourcesList.length;cnt++){
                        errMsg+=_this._inaccessibleResourcesList[cnt];
                        if(cnt!=(_this._inaccessibleResourcesList.length-1)){
                            errMsg+="<br/>";
                        }
                    }
                    _this.logWarn(errMsg);
                    isc.ask(errMsg+
                        " Do you want to abort import or continue without "+
                        "these resources? You will be able to upload these "+
                        "resources by using add asset button and "+
                        "import this mockup again.",function(){},{
                            buttons:[
                                isc.Button.create({
                                    title:"Abort",
                                    click:function(){
                                        this.topElement.hide();
                                        processLinksCallback(null);
                                    }
                                }),
                                isc.Button.create({
                                    title:"Continue",
                                    click:function(){
                                        this.topElement.hide();
                                        for(var i=0;i<_this._inaccessibleResourcesList.length;i++){
                                            _this._linkedLayouts[_this._inaccessibleResourcesList[i]].layout=[];
                                            processLinksCallback(loadedLinkFileName);
                                        }
                                    }
                                })
                            ]});
                    return;
                }
                _this._bmmlToXml(rpcResponse.data,processLinksCallback,loadedLinkFileName);
            },
            requestParams:{willHandleError:true}
        });
    }
,isc.A._cleanLayout=function isc_MockupImporter__cleanLayout(layout){
        for(var cnt=0;cnt<layout.length;cnt++){
            var item=layout[cnt];
            delete item.specialProperties;
            if(item._constructor=="DynamicForm"){
                var items=item.items||item.fields;
                if(items){
                    for(var i=0;i<items.length;i++){
                        var fi=items[i];
                        if(this.ignoreWidthFormItems.contains(fi._constructor)){
                            delete fi.width;
                        }else if(isc.isA.Number(fi.width)){
                            var width=isc[fi._constructor].getInstanceProperty("width");
                            if(Math.abs(fi.width-width)<this.formExtraWidthThreshold){
                                delete fi.width;
                            }
                        }
                        fi._tagName=fi._constructor;
                        delete fi._constructor;
                        if(fi.showTitle==true)delete fi.showTitle;
                    }
                }
            }
            if(item._constructor=="TabSet"&&item.selectedTab==0){
                delete item.selectedTab;
            }
            var childItems=item.items||item.fields||item.members;
            if(childItems)this._cleanLayout(childItems);
        }
        return layout;
    }
,isc.A._getLinks=function isc_MockupImporter__getLinks(layout){
        var links=[];
        for(var i=0;i<layout.length;i++){
            var widgets=[layout[i]];
            if(layout[i]._constructor=="DynamicForm"&&(layout[i].items||layout[i].fields)){
                widgets=layout[i].items||layout[i].fields;
            }
            if(layout[i]._constructor=="SectionStack"&&layout[i].specialProperties.widgets){
                widgets=layout[i].specialProperties.widgets;
                widgets.add(layout[i]);
            }
            for(var widgetCounter=0;widgetCounter<widgets.length;widgetCounter++){
                var widget=widgets[widgetCounter];
                if(widget.specialProperties==null||
                    (widget.specialProperties.hrefs==null&&
                     widget.specialProperties.href==null))continue;
                if(widget.specialProperties.hrefs){
                    if(isc.isA.String(widget.specialProperties.hrefs)){
                        links.addAll(widget.specialProperties.hrefs.split(","));
                    }else{
                    }
                }else if(widget.specialProperties.href){
                    links.add(widget.specialProperties.href);
                }
            }
        }
        return links;
    }
,isc.A._mergeLinksLayout=function isc_MockupImporter__mergeLinksLayout(layout){
        for(var layoutName in this._linkedLayouts){
            var linkedLayout=this._linkedLayouts[layoutName];
            if(layoutName==this.mockupPath){
                linkedLayout.prefix="";
                linkedLayout.processed=true;
            }else{
                linkedLayout.prefix=linkedLayout.layoutName.replace(/[^a-zA-Z0-9_]/g,"_")+"_";
            }
            linkedLayout.topLevelElements=this._getLayoutTopLevelElements(linkedLayout.layout);
        }
        var dir=this.mockupPath.substring(0,this.mockupPath.lastIndexOf("/"));
        var layoutName=this.mockupPath;
        var resultLayout=[];
        do{
            var linkedLayout=this._linkedLayouts[layoutName];
            if(linkedLayout.layout.length>0){
                if(linkedLayout.prefix!=""){
                    this._addPrefixToIds(linkedLayout.layout,linkedLayout.prefix);
                }
                this._mergeLinksLayoutProcessTabsAndStacks(linkedLayout);
                if(linkedLayout.prefix!=""){
                    this._addPrefixToIds(linkedLayout.layout,linkedLayout.prefix);
                    for(var i=0;i<linkedLayout.topLevelElements.length;i++){
                        linkedLayout.topLevelElements[i].autoDraw=false;
                    };
                }
                resultLayout.addList(linkedLayout.layout);
            }
            layoutName=null;
            for(var name in this._linkedLayouts){
                var linkedLayout=this._linkedLayouts[name];
                if(linkedLayout.processed!=true){
                    layoutName=name;
                    linkedLayout.processed=true;
                    break;
                }
            }
        }while(layoutName);
        for(var name in this._linkedLayouts){
            var linkedLayout=this._linkedLayouts[name];
            if(linkedLayout.activateCode==null){
                linkedLayout.activateCode=this._getActivateLayoutCode(linkedLayout.layout);
            }
            linkedLayout.showCode=this._getShowLayoutCode(linkedLayout);
            linkedLayout.hideCode=this._getHideLayoutCode(linkedLayout);
        }
        for(var layoutName in this._linkedLayouts){
            if(this._linkedLayouts[layoutName].mergedWith)continue;
            layout=this._linkedLayouts[layoutName].layout
            for(var i=0;i<layout.length;i++){
                var widget=layout[i];
                if(widget.specialProperties&&widget.specialProperties.links&&
                    (widget._constructor!="TabSet"&&widget._constructor!="SectionStack"))
                {
                    var links=widget.specialProperties.links;
                    for(var j=0;j<links.length;j++){
                        if(links[j]==null)continue;
                        var linkFileName=links[j].fileName;
                        var activateCode=this._constructActivateCode(linkFileName,
                            layoutName,widget.customData,resultLayout);
                        if(widget._constructor=="TreeGrid"||
                            widget._constructor=="ListGrid")
                        {
                            if(widget.selectionChanged==null){
                                widget.selectionChanged="";
                            }
                            widget.selectionChanged+=
                                "if (this.getRecordIndex(record) == "+(j-1)+") {"+
                                activateCode+"}";
                        }else{
                            widget.click=activateCode;
                        }
                    }
                }else if(widget._constructor=="DynamicForm"){
                    var items=widget.items||widget.fields;
                    for(var j=0;j<items.length;j++){
                        if(items[j].specialProperties&&
                            items[j].specialProperties.links)
                        {
                            var links=items[j].specialProperties.links;
                            for(var k=0;k<links.length;k++){
                                if(links[k]==null)continue;
                                var linkFileName=links[k].fileName;
                                widget.items[j].click=
                                    this._constructActivateCode(linkFileName,layoutName,
                                        items[j].customData,resultLayout);
                            }
                        }
                    };
                }else if(widget._constructor=="SectionStack"&&widget.specialProperties.widgets){
                    var items=widget.specialProperties.widgets;
                    for(var j=0;j<items.length;j++){
                        if(widget!=items[j]&&items[j].specialProperties&&items[j].specialProperties.links)
                        {
                            var links=items[j].specialProperties.links;
                            for(var k=0;k<links.length;k++){
                                if(links[k]==null)continue;
                                var linkFileName=links[k].fileName;
                                items[j].click=
                                    this._constructActivateCode(linkFileName,layoutName,
                                        items[j].customData,resultLayout);
                            }
                        }
                    };
                }else if(widget._constructor=="TabSet"&&widget.specialProperties.links){
                    var tabs=widget.tabs;
                    for(var j=0;j<tabs.length;j++){
                        var link=widget.specialProperties.links[j];
                        if(link){
                            var linkFileName=link.fileName;
                            tabs[j].click=this._constructActivateCode(linkFileName,
                                layoutName,tabs[j].customData,resultLayout);
                        }
                    };
                }
            }
        }
        return resultLayout;
    }
,isc.A._constructActivateCode=function isc_MockupImporter__constructActivateCode(linkLayoutName,currentLayoutName,customData,resultLayout){
        var linkLayout=this._linkedLayouts[linkLayoutName];
        var activateCode="";
        if(customData){
            var customData=decodeURIComponent(customData);
            var ind=customData.indexOf("linkTarget=");
            if(ind>=0){
                var linkTarget=customData.substring(ind+"linkTarget=".length).trim();
                if(linkTarget.contains("\n")){
                    linkTarget=linkTarget.substring(0,linkTarget.indexOf("\n")).trim();
                }
                linkTarget=linkTarget.replace(/['"]/g,"");
                var target=null;
                for(var k=0;k<resultLayout.length;k++){
                    if(resultLayout[k].customID==linkTarget){
                        target=resultLayout[k];
                        break;
                    }
                }
                if(target==null){
                    this._notFoundLinkTargets.add(linkTarget);
                    return activateCode+linkLayout.activateCode;
                }
                if(target._constructor=="Window"){
                    activateCode="for (var i = 0; i < "+target.ID+
                        ".items.length; i++) { "+target.ID+
                        ".items[i].hide(); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            for(var l=0;l<target.items.length;l++){
                                activateCode+=target.ID+".addItem("+
                                    target.items[l].ref+");";
                                activateCode+=target.items[l].ref+".show();";
                            }
                        }else{
                            activateCode+=target.ID+".addItem("+
                                linkLayout.topLevelElements[k].ID+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();";
                        }
                    }
                }else if(target._constructor=="TabSet"){
                    var currIndex=target.selectedTab==null?0:target.selectedTab;
                    if(currIndex>=target.tabs.length)currIndex=target.tabs.length-1;
                    var paneCode=target.ID+".tabs["+currIndex+"].pane";
                    activateCode="for (var i = 0; i < "+paneCode+
                        ".members.length; i++) { "+paneCode+
                        ".members[i].hide(); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            var innerItems=target.specialProperties.innerItems;
                            for(var l=0;l<innerItems.length;l++){
                                activateCode+=paneCode+".addMember("+innerItems[l].ID+
                                    ");";
                                activateCode+=innerItems[l].ID+".show();";
                            }
                        }else{
                            activateCode+=paneCode+".addMember("+
                                linkLayout.topLevelElements[k].ID+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();";
                        }
                    }
                }else if(target._constructor=="SectionStack"){
                    var section=target.ID+".sections["+target._sectionIndex+"]";
                    activateCode="for (var i = "+section+".items.length - 1; i >= 0; "+
                        "i--) { "+section+".items[i].hide();\n"+
                        target.ID+".removeItem("+target._sectionIndex+
                        ","+section+".items[i]); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            var innerItems=target.specialProperties.innerItems;
                            for(var l=0;l<innerItems.length;l++){
                                activateCode+=target.ID+".addItem("+
                                    target._sectionIndex+","+innerItems[l].ID+", "+k+
                                    ");";
                                activateCode+=innerItems[l].ID+".show();\n";
                            }
                        }else{
                            activateCode+=target.ID+".addItem("+target._sectionIndex+
                                ","+linkLayout.topLevelElements[k].ID+", "+k+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();\n";
                        }
                    }
                }else{
                    activateCode="for (var i = 0; i < "+target.ID+
                        ".members.length; i++) { "+target.ID+
                        ".members[i].hide(); }\n";
                    for(var k=0;k<linkLayout.topLevelElements.length;k++){
                        if(target.ID==linkLayout.topLevelElements[k].ID){
                            var innerItems=target.specialProperties.innerItems;
                            for(var l=0;l<innerItems.length;l++){
                                activateCode+=target.ID+".addMember("+innerItems[l].ID+
                                    ");";
                                activateCode+=innerItems[l].ID+".show();";
                            }
                        }else{
                            activateCode+=target.ID+".addMember("+
                                linkLayout.topLevelElements[k].ID+");";
                            activateCode+=linkLayout.topLevelElements[k].ID+".show();";
                        }
                    }
                }
            }
            return activateCode+linkLayout.activateCode;
        }else{
            if(linkLayout.prefix!=this._linkedLayouts[currentLayoutName].prefix){
                var fromLayout=this._linkedLayouts[currentLayoutName];
                if(fromLayout.mergedWith!=null){
                    if(fromLayout.mergedWith==""){
                        fromLayout=this._linkedLayouts[this.mockupPath];
                    }else{
                        fromLayout=this._linkedLayouts[fromLayout.mergedWith];
                    }
                }
                activateCode+=fromLayout.hideCode;
                activateCode+=linkLayout.showCode;
            }
            activateCode+=linkLayout.activateCode;
            return activateCode;
        }
    }
,isc.A._mergeLinksLayoutProcessTabsAndStacks=function isc_MockupImporter__mergeLinksLayoutProcessTabsAndStacks(layoutData){
        var layout=layoutData.layout;
        do{
            var changed=false;
            for(var i=0;i<layout.length;i++){
                var widget=layout[i];
                if(widget.specialProperties&&widget.specialProperties.links&&
                    (widget._constructor=="TabSet"||widget._constructor=="SectionStack")){
                    var links=widget.specialProperties.links;
                    for(var j=0;j<links.length;j++){
                        if(links[j]==null)continue;
                        var linkLayout=this._linkedLayouts[links[j].fileName];
                        if(!linkLayout.processed&&linkLayout.layout.length>0&&
                            this._compareParentLayout(layout,linkLayout,widget))
                        {
                            var innerContent=null;
                            if(widget._constructor=="TabSet"){
                                innerContent=this._mergeTabLayout(j,widget,linkLayout,
                                    linkLayout.prefix);
                            }else{
                                innerContent=this._mergeSectionStackLayout(j,widget,
                                    linkLayout,linkLayout.prefix);
                            }
                            var innerLayout=innerContent.layout;
                            if(innerLayout){
                                layout.addListAt(innerLayout,layout.indexOf(widget)-1);
                                changed=true;
                                linkLayout.processed=true;
                                linkLayout.mergedWith=layoutData.prefix;
                                linkLayout.topLevelElements=layoutData.topLevelElements;
                                innerContent.widget.ID=widget.ID;
                                linkLayout.activateCode=widget.ID+".showRecursively();\n"+
                                    this._getActivateLayoutCode([innerContent.widget])+
                                    this._getActivateLayoutCode(innerLayout);
                            }
                        }
                    }
                }
            }
        }while(changed);
    }
,isc.A._getActivateLayoutCode=function isc_MockupImporter__getActivateLayoutCode(layout){
        var activateCode="";
        for(var i=0;i<layout.length;i++){
            if(layout[i]._constructor=="TabSet"){
                activateCode=layout[i].ID+".selectTab("+layout[i].selectedTab+");\n"+activateCode;
            }else if(layout[i]._constructor=="SectionStack"){
                for(var j=0;j<layout[i].sections.length;j++){
                    if(layout[i].sections[j].expanded){
                        activateCode=layout[i].ID+".expandSection("+j+");\n"+activateCode;
                    }else if(layout[i].sections[j].items){
                        activateCode=layout[i].ID+".collapseSection("+j+");\n"+activateCode;
                    }
                };
            }
        };
        return activateCode;
    }
,isc.A._getShowLayoutCode=function isc_MockupImporter__getShowLayoutCode(layoutData){
        var showLayoutCode="";
        for(var k=0;k<layoutData.topLevelElements.length;k++){
            showLayoutCode+=layoutData.topLevelElements[k].ID+".show();\n";
        };
        return showLayoutCode;
    }
,isc.A._getHideLayoutCode=function isc_MockupImporter__getHideLayoutCode(layoutData){
        var hideLayoutCode="";
        for(var k=0;k<layoutData.topLevelElements.length;k++){
            hideLayoutCode+=layoutData.topLevelElements[k].ID+".hide();\n";
        };
        return hideLayoutCode;
    }
,isc.A._getLayoutTopLevelElements=function isc_MockupImporter__getLayoutTopLevelElements(layout){
        var topLevelElements=[];
        for(var i=0;i<layout.length;i++){
            if(layout[i]._constructor!="MockDataSource"&&
                layout[i]._constructor!="ValuesManager"&&
                this._findParentWidget(layout,layout[i])==null)
            {
                topLevelElements.add(layout[i]);
            }
        };
        return topLevelElements;
    }
);
isc.evalBoundary;isc.B.push(isc.A._mergeTabLayout=function isc_MockupImporter__mergeTabLayout(linkIndex,widget,linkLayout,prefix){
        if(widget.tabs[linkIndex].pane)return null;
        var tabPaneContent=this._getWidgetContentLayout(linkLayout,widget);
        if(tabPaneContent==null)return null;
        var tabLayout=tabPaneContent.layout;
        this._addPrefixToIds(tabLayout,prefix);
        widget.specialProperties.innerItems.addList(tabLayout);
        for(var i=0;i<tabPaneContent.widget.tabs.length;i++){
            var pane=tabPaneContent.widget.tabs[i].pane;
            if(pane==null)continue;
            if(isc.isA.String(pane)){
                widget.tabs[i].pane=prefix+pane
            }else{
                for(var j=0;j<pane.VStack.members.length;j++){
                    pane.VStack.members[j]=prefix+pane.VStack.members[j];
                };
                widget.tabs[i].pane=pane
            }
            break;
        };
        return tabPaneContent;
    }
,isc.A._mergeSectionStackLayout=function isc_MockupImporter__mergeSectionStackLayout(linkIndex,widget,linkLayout,linkIdPrefix){
        for(var sc=0;sc<widget.sections.length;sc++){
            if(widget.sections[sc]._index!=linkIndex)continue;
            var sectionContent=this._getWidgetContentLayout(linkLayout,widget);
            if(sectionContent==null)return;
            var sectionLayout=sectionContent.layout;
            this._addPrefixToIds(sectionLayout,linkIdPrefix);
            widget.specialProperties.innerItems.addList(sectionLayout);
            widget.sections[sc].items=sectionContent.widget.sections[sc].items;
            return sectionContent;
        };
    }
,isc.A._addPrefixToIds=function isc_MockupImporter__addPrefixToIds(layout,prefix){
        for(var i=0;i<layout.length;i++){
            var item=layout[i];
            if(item.ID&&!item.ID.startsWith(prefix)){
                item.ID=prefix+item.ID;
            }
            if(item.dataSource&&!item.dataSource.startsWith(prefix)){
                item.dataSource=prefix+item.dataSource
            }
            if(item.valuesManager&&!item.valuesManager.startsWith(prefix)){
                item.valuesManager=prefix+item.valuesManager
            }
            if(item.specialProperties){
                var refs=item.specialProperties.refs;
                if(refs){
                    for(var j=0;j<refs.length;j++){
                        refs[j].ref=item.ID;
                    }
                }
            }
            if(item._constructor=="TabSet"){
                for(var j=0;j<item.tabs.length;j++){
                    if(item.tabs[j].pane==null)continue;
                    if(isc.isA.String(item.tabs[j].pane)&&
                        !item.tabs[j].pane.startsWith(prefix))
                    {
                        item.tabs[j].pane=prefix+item.tabs[j].pane;
                    }else{
                        var pane=item.tabs[j].pane;
                        if(pane.VStack){
                            for(var k=0;k<pane.VStack.members.length;k++){
                                if(!pane.VStack.members[k].startsWith(prefix)){
                                    pane.VStack.members[k]=prefix+pane.VStack.members[k];
                                }
                            };
                        }else if(pane.children){
                            for(var k=0;k<pane.children.length;k++){
                                if(!pane.children[k].ref.startsWith(prefix)){
                                    pane.children[k].ref=prefix+pane.children.members[k].ref;
                                }
                            };
                        }
                    }
                };
            }
        };
    }
,isc.A._compareParentLayout=function isc_MockupImporter__compareParentLayout(layout,linkLayout,widget){
        var layoutOuter=this._clone(layout);
        var linkLayoutOuter=this._clone(linkLayout.layout);
        var layoutInner=this._getWidgetContentLayout({layout:layout},widget);
        var linkLayoutInner=this._getWidgetContentLayout(linkLayout,widget);
        if(linkLayoutInner==null)return false;
        for(var i=0;i<layoutInner.layout.length;i++){
            for(var j=0;j<layoutOuter.length;j++){
                if(layoutInner.layout[i].ID==layoutOuter[j].ID){
                    layoutOuter.removeAt(j);
                    break;
                }
            }
        };
        for(var i=0;i<linkLayoutInner.layout.length;i++){
            for(var j=0;j<linkLayoutOuter.length;j++){
                if(linkLayoutInner.layout[i].ID==linkLayoutOuter[j].ID){
                    linkLayoutOuter.removeAt(j);
                    break;
                }
            }
        };
        var parent=layoutInner.widget;
        var linkParent=linkLayoutInner.widget;
        do{
            parent=this._findParentWidget(layoutOuter,parent);
            linkParent=this._findParentWidget(linkLayoutOuter,linkParent);
            if(parent==null||linkParent==null)break;
            if(parent._constructor=="TabSet"&&linkParent._constructor=="TabSet"){
                delete linkParent.layoutLeftMargin;
                delete linkParent.layoutTopMargin;
                delete linkParent.layoutRightMargin;
                delete linkParent.layoutBottomMargin;
                delete parent.layoutLeftMargin;
                delete parent.layoutTopMargin;
                delete parent.layoutRightMargin;
                delete parent.layoutBottomMargin;
                var parentInnerItems=parent.specialProperties.innerItems;
                for(var i=0;i<linkParent.tabs.length;i++){
                    if(linkParent.tabs[i].pane!=null||parent.tabs[i].pane==null){
                        continue;
                    }
                    var pane=parent.tabs[i].pane;
                    if(isc.isA.String(pane)){
                        for(var k=0;k<parentInnerItems.length;k++){
                            var item=parentInnerItems[k]
                            if(item.ID!=pane)continue;
                            this._removeItemWithChildItemsFromLayout(layoutOuter,item);
                        };
                    }else{
                        for(var j=0;j<pane.VStack.members.length;j++){
                            for(var k=0;k<parentInnerItems.length;k++)
                            {
                                var item=parentInnerItems[k]
                                if(item.ID!=pane.VStack.members[j])continue;
                                this._removeItemWithChildItemsFromLayout(layoutOuter,item);
                            };
                        };
                    }
                };
            }else if(parent._constructor=="SectionStack"&&
                linkParent._constructor=="SectionStack")
            {
                var parentInnerItems=parent.specialProperties.innerItems;
                for(var i=0;i<linkParent.sections.length;i++){
                    if(linkParent.sections[i].items!=null||
                        parent.sections[i].items==null)
                    {
                        continue;
                    }
                    parent.sections[i].expanded=linkParent.sections[i].expanded;
                    for(var j=0;j<parent.sections[i].items.length;j++){
                        for(var k=0;k<parentInnerItems.length;k++)
                        {
                            var item=parentInnerItems[k]
                            if(item.ID!=parent.sections[i].items[j].ref)continue;
                            this._removeItemWithChildItemsFromLayout(layoutOuter,item);
                        };
                    };
                    delete parent.sections[i].items;
                };
            }
        }while(true);
        for(var j=0;j<layoutOuter.length;j++){
            if(layoutInner.widget.ID==layoutOuter[j].ID){
                layoutOuter.removeAt(j);
                break;
            }
        }
        for(var j=0;j<linkLayoutOuter.length;j++){
            if(linkLayoutInner.widget.ID==linkLayoutOuter[j].ID){
                linkLayoutOuter.removeAt(j);
                break;
            }
        }
        this._cleanObjects(layoutOuter);
        this._cleanObjects(linkLayoutOuter);
        var layoutSortFunction=function(a,b){
            return isc.echoAll(a)<isc.echoAll(b);
        };
        layoutOuter.sort(layoutSortFunction);
        linkLayoutOuter.sort(layoutSortFunction);
        var layoutOuterJSON=isc.JSON.encode(layoutOuter);
        var linkLayoutOuterJSON=isc.JSON.encode(linkLayoutOuter);
        return layoutOuterJSON===linkLayoutOuterJSON;
    }
,isc.A._removeItemWithChildItemsFromLayout=function isc_MockupImporter__removeItemWithChildItemsFromLayout(layout,item){
        for(var l=0;l<layout.length;l++){
            if(layout[l].ID==item.ID){
                layout.removeAt(l);
                break;
            }
        };
        var items=this._getInnerComponents(item);
        for(var m=0;m<items.length;m++){
           for(var l=0;l<layout.length;l++){
                if(layout[l].ID==items[m].ID){
                    layout.removeAt(l);
                    break;
                }
            };
        };
        var additionalComponents=item.specialProperties.additionalElements;
        if(additionalComponents){
            for(var m=0;m<additionalComponents.length;m++){
               for(var l=0;l<layout.length;l++){
                    if(layout[l].ID==additionalComponents[m].ID){
                        layout.removeAt(l);
                        break;
                    }
                };
            };
        }
    }
,isc.A._findParentWidget=function isc_MockupImporter__findParentWidget(layout,childWidget){
        for(var i=0;i<layout.length;i++){
            if(layout[i].specialProperties&&layout[i].specialProperties.innerItems){
                for(var j=0;j<layout[i].specialProperties.innerItems.length;j++){
                    if(layout[i].specialProperties.innerItems[j].ID==childWidget.ID){
                        return layout[i];
                    }
                };
            }
        };
    }
,isc.A._cleanObjects=function isc_MockupImporter__cleanObjects(object){
        if(this._isPlainObject(object)){
        }else if(isc.isA.Array(object)){
            for(var i=0;i<object.length;i++){
                if(!this._isPlainObject(object[i])){
                    this._cleanObjects(object[i]);
                }
            };
        }else{
            for(var name in object){
                if(name=="ID"||name=="ref"||name=="specialProperties"||
                    name=="pane"||name=="selectedTab"||name=="zIndex"||
                    name=="expanded"||name=="_sectionIndex"){
                    delete object[name];
                }else if(!this._isPlainObject(object[name])){
                    this._cleanObjects(object[name]);
                }
            }
        }
    }
,isc.A._clone=function isc_MockupImporter__clone(objectToClone,stackDeepness){
        if(stackDeepness==null)stackDeepness=10;
        var resultObject=null;
        if(this._isPlainObject(objectToClone)){
            resultObject=this._clonePlainObject(objectToClone);
        }else if(isc.isA.Array(objectToClone)){
            resultObject=[];
            for(var i=0;i<objectToClone.length;i++){
                var item=objectToClone[i];
                if(this._isPlainObject(item)){
                    resultObject.add(this._clonePlainObject(item));
                }else if(stackDeepness==0){
                    resultObject.add(isc.isA.Array(item)?[]:{});
                }else{
                    resultObject.add(this._clone(item,stackDeepness-1));
                }
            };
        }else{
            resultObject={};
            for(var name in objectToClone){
                var item=objectToClone[name];
                if(this._isPlainObject(item)){
                    resultObject[name]=this._clonePlainObject(item);
                }else if(stackDeepness==0){
                    resultObject[name]=(isc.isA.Array(item)?[]:{});
                }else{
                    resultObject[name]=this._clone(item,stackDeepness-1);
                }
            }
        }
        return resultObject;
    }
,isc.A._isPlainObject=function isc_MockupImporter__isPlainObject(object){
        var undef;
        return(object===undef)||(object==null)||isc.isA.String(object)||
            isc.isA.Boolean(object)||isc.isA.Number(object)||isc.isA.Function(object)||
            isc.isA.Date(object);
    }
,isc.A._clonePlainObject=function isc_MockupImporter__clonePlainObject(object){
        var undef;
        if(object===undef)return undef;
        if(object==null)return null;
        if(isc.isA.String(object)||isc.isA.Boolean(object)||
            isc.isA.Number(object)||isc.isA.Function(object))return object;
        if(isc.isA.Date(object))return object.duplicate();
        return null;
    }
,isc.A._getWidgetContentLayout=function isc_MockupImporter__getWidgetContentLayout(linkLayout,widget){
        if(widget._constructor=="TabSet"){
            var tabSet=this._findSameTabSet(linkLayout.layout,widget.tabs);
            if(tabSet){
                return{
                    layout:this._getInnerComponents(tabSet),
                    widget:tabSet
                };
            }
        }else if(widget._constructor=="SectionStack"){
            var sectionStack=this._findSameSectionStack(linkLayout.layout,widget.sections);
            if(sectionStack){
                return{
                    layout:this._getInnerComponents(sectionStack),
                    widget:sectionStack
                };
            }
        }
    }
,isc.A._findSameTabSet=function isc_MockupImporter__findSameTabSet(layout,tabs){
        for(var i=0;i<layout.length;i++){
            var linkWidget=layout[i];
            if(linkWidget._constructor=="TabSet"&&linkWidget.tabs.length==tabs.length){
                var tabSet=linkWidget;
                var sameTabs=true;
                for(var j=0;j<tabs.length;j++){
                    if(tabs[j].title!=linkWidget.tabs[j].title){
                        sameTabs=false;
                        break;
                    }
                };
                if(sameTabs){
                    return tabSet;
                }
            }
        };
        return null;
    }
,isc.A._findSameSectionStack=function isc_MockupImporter__findSameSectionStack(layout,sections){
        for(var i=0;i<layout.length;i++){
            var linkWidget=layout[i];
            if(linkWidget._constructor=="SectionStack"&&
                linkWidget.sections.length==sections.length)
            {
                var sectionStack=linkWidget;
                var sameSections=true;
                for(var j=0;j<sections.length;j++){
                    if(sections[j].title!=linkWidget.sections[j].title){
                        sameSections=false;
                        break;
                    }
                };
                if(sameSections){
                    return sectionStack;
                }
            }
        };
        return null;
    }
,isc.A._getInnerComponents=function isc_MockupImporter__getInnerComponents(container){
        var childWidgets=this._getInnerComponentsRecursive(container);
        for(var i=childWidgets.length-1;i>=1;i--){
            for(var j=i-1;j>=0;j--){
                if(childWidgets[i].ID==childWidgets[j].ID){
                    childWidgets.removeAt(i);
                    i--;
                    break;
                }
            };
        };
        return childWidgets;
    }
,isc.A._getInnerComponentsRecursive=function isc_MockupImporter__getInnerComponentsRecursive(container){
        var childWidgets=[];
        if(container.specialProperties.innerItems==null)return[];
        for(var i=0;i<container.specialProperties.innerItems.length;i++){
            var widget=container.specialProperties.innerItems[i];
            if(widget.specialProperties&&widget.specialProperties.innerItems){
                childWidgets.addList(this._getInnerComponentsRecursive(widget));
            }
            if(widget.specialProperties&&widget.specialProperties.additionalElements){
                childWidgets.addList(widget.specialProperties.additionalElements);
            }
            childWidgets.add(widget);
        };
        return childWidgets;
    }
,isc.A._convertBMMLWidgetsToISCWidgets=function isc_MockupImporter__convertBMMLWidgetsToISCWidgets(bmmlDataJS,fileName){
        for(var p=0;p<this.globalIDs.length;p++){
            if(!isc.isA.String(this.globalIDs[p])){
                if(!(this.globalIDs[p]&&window[this.globalIDs[p].ID])){
                    this.logWarn("Error - null entry or not a real global ID at index: "+p+
                                 " of: "+isc.echoFull(this.globalIDs));
                }
                window[this.globalIDs[p].ID].destroy();
            }else if(isc.DataSource.getDataSource(this.globalIDs[p])){
                isc.DataSource.getDataSource(this.globalIDs[p]).destroy();
            }
        }
        var resultLayout=[];
        var controls;
        if(bmmlDataJS&&bmmlDataJS.controls){
            controls=bmmlDataJS.controls.control;
        }else{
            this.logWarn("The data is not in BMML format"+
                    (fileName!=null?":  "+fileName:"."));
            isc.warn("The file is not in BMML format.",{target:this,methodName:"bmmlImportFailed"});
            controls=[];
        }
        if(!isc.isAn.Array(controls)){
            controls=[controls];
        }
        for(var i=0;i<controls.length;i++){
            if("__group__"==controls[i].controlTypeID){
                resultLayout.addList(this.convertGroup(controls[i]));
            }else{
                resultLayout.addList(this.convertControl(controls[i]));
            }
        };
        this.globalIDs.length=0;
        for(var p in resultLayout){
            if(resultLayout[p].ID)this.globalIDs.push(resultLayout[p].ID);
        }
        return resultLayout;
    }
,isc.A._loadSymbolsAssets=function isc_MockupImporter__loadSymbolsAssets(resultLayout,callback){
        if(this.mockupPath){
            var symbolsPath=this.mockupPath.substring(0,this.mockupPath.lastIndexOf("/"));
            var symbolsInfo=[];
            var assetsToLoad=[];
            for(var i=0;i<resultLayout.length;i++){
                if(resultLayout[i]._constructor=="Symbol"){
                    var path=resultLayout[i].symbolPath;
                    if(path.startsWith("./")){
                        path=path.substring(2);
                    }
                    path=symbolsPath+"/"+path;
                    var ind=path.indexOf("#");
                    var symbolName=null;
                    if(ind>0){
                        symbolName=path.substring(path.indexOf("#")+1);
                        path=path.substring(0,path.indexOf("#"));
                    }
                    symbolsInfo.add({
                        symbol:resultLayout[i],
                        path:path,
                        symbolName:symbolName
                    })
                    if(!assetsToLoad.contains(path)){
                        assetsToLoad.add(path);
                    }
                }
            };
            var loadCounter=0;
            var _this=this;
            for(var i=0;i<assetsToLoad.length;i++){
                var assetPath=assetsToLoad[i];
                isc.DMI.callBuiltin({
                    methodName:"loadFile",
                    arguments:[assetPath],
                    callback:function(rpcResponse){
                        var loadedAssetPath=rpcResponse.context.data.arguments[0];
                        if(rpcResponse.status==isc.RPCResponse.STATUS_FAILURE){
                            var continueClickFunction=function(){
                                for(var j=0;j<symbolsInfo.length;j++){
                                    if(loadedAssetPath!=symbolsInfo[j].path)continue;
                                    var symbol=symbolsInfo[j].symbol;
                                    var symbolControl={
                                        _constructor:"Label",
                                        ID:"symbol_"+j,
                                        contents:symbolsInfo[j].symbolName,
                                        left:symbol.left,
                                        top:symbol.top,
                                        width:symbol.width,
                                        height:symbol.height,
                                        border:"1px solid black",
                                        align:"center",
                                        zIndex:symbol.zIndex,
                                        specialProperties:{
                                            controlName:"com.balsamiq.mockups::Label"
                                        }
                                    };
                                    resultLayout.addAt(symbolControl,
                                        resultLayout.indexOf(symbol));
                                    resultLayout.remove(symbol);
                                };
                                loadCounter++;
                                if(loadCounter==assetsToLoad.length){
                                    callback(resultLayout);
                                }
                                this.topElement.hide();
                            }
                            isc.ask("Unable to import this mockup. Asset "+loadedAssetPath+
                                " is missing. Do you want to abort import or continue with "+
                                "placeholders. You will be able to upload this asset and "+
                                "import this mockup again.",function(){},{
                                    buttons:[
                                        isc.Button.create({
                                            title:"Abort",
                                            click:function(){
                                                this.topElement.hide();
                                                callback(null);
                                            }
                                        }),
                                        isc.Button.create({
                                            title:"Continue",
                                            click:continueClickFunction
                                        })
                                    ]});
                            return;
                        }
                        for(var j=0;j<symbolsInfo.length;j++){
                            if(loadedAssetPath!=symbolsInfo[j].path)continue;
                            var bmmlDataJS=
                                isc.XMLTools.toJS(isc.XMLTools.parseXML(rpcResponse.data));
                            var symbolControl;
                            var symbolControlsArray=bmmlDataJS.controls?bmmlDataJS.controls.control:[];
                            if(symbolsInfo[j].symbolName==null){
                                symbolControl={
                                    groupChildrenDescriptors:{control:symbolControlsArray},
                                    zOrder:0,
                                    width:symbolsInfo[j].symbol.width,
                                    height:symbolsInfo[j].symbol.height,
                                    controlTypeID:"__group__",
                                    measuredW:symbolsInfo[j].symbol.width,
                                    measuredH:symbolsInfo[j].symbol.height
                                }
                            }else{
                                for(var k=0;k<symbolControlsArray.length;k++){
                                    var controlName=
                                        symbolControlsArray[k].controlProperties.controlName;
                                    if(unescape(controlName)==symbolsInfo[j].symbolName){
                                        symbolControl=symbolControlsArray[k];
                                        break;
                                    }
                                };
                            }
                            symbolControl.x=0;
                            symbolControl.y=0;
                            symbolControl=_this._handleSymbolOverride(symbolControl,
                                symbolsInfo[j].symbol);
                            _this._realignControlsOfSymbol(symbolControl);
                            var symbolLayout=
                                _this._convertBMMLWidgetsToISCWidgets({
                                    controls:{
                                        control:[
                                            symbolControl
                                        ]
                                    }
                                });
                            resultLayout.addListAt(symbolLayout,
                                resultLayout.indexOf(symbolsInfo[j].symbol));
                            resultLayout.remove(symbolsInfo[j].symbol);
                        };
                        loadCounter++;
                        if(loadCounter==assetsToLoad.length){
                            callback(resultLayout);
                        }
                    },
                    requestParams:{willHandleError:true}
                });
            };
            if(assetsToLoad.length==0){
                callback(resultLayout);
            }
        }else{
            callback(resultLayout);
        }
    }
,isc.A._handleSymbolOverride=function isc_MockupImporter__handleSymbolOverride(symbolControl,widget){
        if(symbolControl.controlID){
            symbolControl.controlID=widget.ID+"_symbol"+symbolControl.controlID;
        }else{
            symbolControl.controlID=widget.ID;
        }
        symbolControl.x+=widget.left;
        symbolControl.y+=widget.top;
        symbolControl.zOrder=parseInt(symbolControl.zOrder)+widget.zIndex-1000000;
        if(widget.override){
            var path=widget.override.controlID.split(":");
            var control=symbolControl;
            for(var i=0;i<path.length;i++){
                var controls=control.groupChildrenDescriptors.control;
                for(var j=0;j<controls.length;j++){
                    if(controls[j].controlID==path[i]){
                        control=controls[j];
                        break;
                    }
                };
            };
            for(var overridePropertyName in widget.override){
                for(var controlPropertyName in control){
                    if(overridePropertyName!="controlID"&&
                        overridePropertyName==controlPropertyName){
                        control[controlPropertyName]=widget.override[overridePropertyName];
                    }
                }
                for(var controlPropertyName in control.controlProperties){
                    if(overridePropertyName==controlPropertyName){
                        control.controlProperties[controlPropertyName]=
                            widget.override[overridePropertyName];
                    }
                }
            }
        }
        return symbolControl;
    }
,isc.A._realignControlsOfSymbol=function isc_MockupImporter__realignControlsOfSymbol(symbolControl){
        var controls=symbolControl.groupChildrenDescriptors.control;
        var xMin=controls[0].x;
        var yMin=controls[0].y;
        for(var i=1;i<controls.length;i++){
            if(controls[i].x<xMin)xMin=controls[i].x;
            if(controls[i].y<yMin)yMin=controls[i].y;
        }
        for(var i=0;i<controls.length;i++){
            controls[i].x-=xMin;
            controls[i].y-=yMin;
        }
    }
,isc.A.convertGroup=function isc_MockupImporter_convertGroup(control){
        var transformRules=this._transformRules;
        var controls=[];
        var innerControls=control.groupChildrenDescriptors.control;
        if(!isc.isA.Array(innerControls)){
            innerControls=[innerControls];
        }
        for(var i=0;i<innerControls.length;i++){
            var innerControl=innerControls[i];
            var objects;
            if("__group__"==innerControl.controlTypeID){
                objects=this.convertGroup(innerControl);
            }else{
                objects=this.convertControl(innerControl);
            }
            for(var j=0;j<objects.length;j++){
                var propertyTranslations=transformRules.propertyTranslations;
                if(objects[j][propertyTranslations.x]!=null){
                    objects[j][propertyTranslations.x]=
                        parseInt(objects[j][propertyTranslations.x])+parseInt(control.x);
                }
                if(objects[j][propertyTranslations.y]!=null){
                    objects[j][propertyTranslations.y]=
                        parseInt(objects[j][propertyTranslations.y])+parseInt(control.y);
                }
                if(objects[j][propertyTranslations.zOrder]!=null){
                    objects[j][propertyTranslations.zOrder]=
                        parseInt(objects[j][propertyTranslations.zOrder])+
                        parseInt(control.zOrder);
                }
                if(control.isInGroup<0||innerControls.length>1){
                    objects[j].ID="group"+control.controlID+"_"+objects[j].ID;
                    if(objects[j].dataSource!=null){
                        objects[j].dataSource=
                            "group"+control.controlID+"_"+objects[j].dataSource;
                    }
                }
            }
            controls.addList(objects);
        }
        return controls;
    }
,isc.A.convertControl=function isc_MockupImporter_convertControl(control){
        var undef;
        var transformRules=this._transformRules;
        var scClass=this.getSCClass(control.controlTypeID);
        var componentType=control.controlTypeID.substring(control.controlTypeID.indexOf("::")+2);
        var smartclientWidget={
            ID:componentType+control.controlID,
            _constructor:scClass,
            specialProperties:{
                controlName:control.controlTypeID
            }
        };
        if(scClass==null){
            scClass="MockupElement";
            smartclientWidget._constructor=scClass;
            smartclientWidget.controlName=control.controlTypeID;
        }
        for(var attributeName in control){
            if(attributeName!="controlProperties"&&attributeName!="controlTypeID"){
                var value=control[attributeName];
                var smartclientAttributeName=
                    this.getSCPropertyName(control.controlTypeID,attributeName,value);
                if(smartclientAttributeName!=null){
                    smartclientWidget[smartclientAttributeName]=value;
                }else{
                    if(!this.dropExtraProperties||
                        this.allowedExtraProperties.contains(attributeName))
                    {
                        smartclientWidget[attributeName]=value;
                    }else{
                        smartclientWidget.specialProperties[attributeName]=value;
                    }
                }
            }
        }
        var markup;
        if(control.controlProperties!=null){
            for(var attributeName in control.controlProperties){
                var value=control.controlProperties[attributeName];
                if(typeof value=="string")value=unescape(value);
                if(markup===undef&&attributeName=="markup"){
                    markup=(value=="true");
                }
                if(attributeName=="customID"){
                    var customID=decodeURIComponent(value);
                    if(isc.MockupImporter._isValidID(customID)){
                        smartclientWidget.ID=customID;
                    }else{
                        this.logWarn("Ignoring invalid customID \""+customID+"\".");
                    }
                }else if(attributeName=="customData"){
                    var customProperties=decodeURIComponent(value),
                        result=isc.MockupImporter._parseCustomProperties(customProperties),
                        keys=result.keys,
                        values=result.values,
                        errors=result.errors,
                        i,len;
                    if(!errors.isEmpty()){
                        var sb=isc.StringBuffer.create();
                        sb.append("Ignoring invalid customData configurations:  ");
                        for(i=0,len=errors.length;i<len;++i){
                            if(i>0)sb.append(", ");
                            sb.append("\"",errors[i],"\"");
                        }
                        this.logWarn(sb.release(false));
                    }
                    var isValidID=isc.MockupImporter._isValidID;
                    for(i=0,len=keys.length;i<len;++i){
                        var key=keys[i],value=values[i];
                        if(isValidID(key)){
                            if(key=="schemaName"){
                                smartclientWidget._tagName=value;
                                delete smartclientWidget._constructor;
                                scClass=null;
                            }else if(key=="constructor"){
                                scClass=smartclientWidget._constructor=value;
                            }else{
                                smartclientWidget[key]=value;
                            }
                        }else{
                            this.logWarn(
                                    "Ignoring customData for invalid property name "+
                                    "\""+key+"\".");
                        }
                    }
                }else{
                    var smartclientAttributeName=
                        this.getSCPropertyName(control.controlTypeID,attributeName,value);
                    value=this.getSCPropertyValue(control.controlTypeID,attributeName,value);
                    if(smartclientAttributeName!=null){
                        smartclientWidget[smartclientAttributeName]=value;
                    }else{
                        if(!this.dropExtraProperties||
                            this.allowedExtraProperties.contains(attributeName))
                        {
                            smartclientWidget[attributeName]=value;
                        }else{
                            smartclientWidget.specialProperties[attributeName]=value;
                        }
                    }
                }
            }
        }
        var controlName=smartclientWidget.specialProperties.controlName,
            usuallyMarkup=transformRules.markupItems.contains(controlName);
        smartclientWidget.specialProperties.markup=markup||(markup===undef&&usuallyMarkup);
        smartclientWidget=this.afterConvert(control.controlTypeID,scClass,
            smartclientWidget);
        var result=[smartclientWidget];
        var additionalElements=
            this.getAdditionalElements(control.controlTypeID,scClass,smartclientWidget);
        if(additionalElements!=null){
            if(smartclientWidget.specialProperties==null){
                smartclientWidget.specialProperties={};
            }
            smartclientWidget.specialProperties.additionalElements=[];
            smartclientWidget.specialProperties.additionalElements.addAll(additionalElements);
            additionalElements.add(smartclientWidget);
            result=additionalElements
        }
        return result;
    }
,isc.A.getSCClass=function isc_MockupImporter_getSCClass(bmmlControlName){
        return this._transformRules.classTranslations[bmmlControlName];
    }
,isc.A.getSCPropertyName=function isc_MockupImporter_getSCPropertyName(bmmlControlName,bmmlPropertyName,bmmlPropertyValue){
        var transformRules=this._transformRules;
        var widgetProperties=transformRules.widgetPropertyTranslations[bmmlControlName];
        if(widgetProperties!=null){
            var scPropertyName=widgetProperties[bmmlPropertyName];
            if(scPropertyName!=null){
                return scPropertyName;
            }
        }
        return transformRules.propertyTranslations[bmmlPropertyName];
    }
,isc.A.getSCPropertyValue=function isc_MockupImporter_getSCPropertyValue(bmmlControlName,bmmlPropertyName,bmmlPropertyValue){
        var widgetProperties=this._transformRules.widgetPropertyTranslations[bmmlControlName];
        if(widgetProperties!=null&&widgetProperties.controlPropertiesParser!=null){
            var value=
                widgetProperties.controlPropertiesParser(bmmlPropertyName,bmmlPropertyValue);
            if(value!=null){
                if(this.trimWhitespace&&value.MockDataSource&&value.MockDataSource.mockDataType!="tree"){
                    var md=value.MockDataSource.mockData;
                    var processedMd=isc.SB.create();
                    var rowsData=md.split("\n");
                    for(var i=0;i<rowsData.length;i++){
                        var row="";
                        var d=rowsData[i].split(",");
                        for(var j=0;j<d.length;j++){
                            processedMd.append(d[j].trim());
                            if(j+1<d.length){
                                processedMd.append(",");
                            }else if(i+1<rowsData.length){
                                processedMd.append("\n");
                            }
                        }
                    }
                    value.MockDataSource.mockData=processedMd.release(false);
                }
                return value;
            }
        }
        return bmmlPropertyValue;
    }
,isc.A.afterConvert=function isc_MockupImporter_afterConvert(bmmlName,name,widget){
        var transformRules=this._transformRules;
        if(widget.zIndex!=null){
            widget.zIndex=1000000+parseInt(widget.zIndex);
        }
        if(widget.width==null||widget.width=='-1'){
            if(widget.measuredW){
                widget.width=widget.measuredW;
            }else{
                widget.width=widget.specialProperties.measuredW;
            }
        }
        if(widget.height==null||widget.height=='-1'){
            if(widget.measuredH){
                widget.height=widget.measuredH;
            }else{
                widget.height=widget.specialProperties.measuredH;
            }
        }
        var widgetPropertyTranslations=transformRules.widgetPropertyTranslations[bmmlName];
        if(widgetPropertyTranslations&&widgetPropertyTranslations.afterInit){
            widgetPropertyTranslations.afterInit(name,widget);
        }
        if(widget.height)widget.height=parseInt(widget.height);
        if(widget.top)widget.top=parseInt(widget.top);
        if(widget.left)widget.left=parseInt(widget.left);
        if(widget.width)widget.width=parseInt(widget.width);
        if(transformRules.formItems.contains(name)){
            widget.showTitle=false;
            var form={
                _constructor:'DynamicForm',
                ID:widget.ID,
                height:widget.height,
                top:widget.top,
                left:widget.left,
                width:widget.width,
                zIndex:widget.zIndex,
                title:widget.title,
                items:[widget],
                specialProperties:widget.specialProperties
            };
            if(widget.title==null){
                delete form.title;
                form.numCols=1;
            }
            if(form.height<widget.height){
                widget.height=form.height;
            }
            delete widget.ID;
            delete widget.zIndex;
            delete widget.left;
            delete widget.top;
            widget=form;
        }
        return widget;
    }
);
isc.evalBoundary;isc.B.push(isc.A.getAdditionalElements=function isc_MockupImporter_getAdditionalElements(bmmlName,name,widget){
        var widgetPropertyTranslations=this._transformRules.widgetPropertyTranslations[bmmlName];
        if(widgetPropertyTranslations&&widgetPropertyTranslations.getAdditionalElements){
            return widgetPropertyTranslations.getAdditionalElements(name,widget);
        }
        return null;
    }
,isc.A.processHeuristics=function isc_MockupImporter_processHeuristics(layout){
        var containers=[],
            transformRules=this._transformRules;
        for(var i=0;i<layout.length;i++){
            if(layout[i].specialProperties){
                var controlName=layout[i].specialProperties.controlName;
                var widgetProperties=transformRules.widgetPropertyTranslations[controlName];
                if(widgetProperties&&widgetProperties.addChild){
                    containers.add(layout[i]);
                    layout[i].contained=[];
                    layout[i].headerContained=[];
                    layout[i].markupContained=[];
                }
                if(layout[i].members){
                    layout[i].contained=[];
                }
            }
        }
        layout=this.processContainersHeuristic(layout,containers);
        layout=this.processStackHeuristic(layout,containers);
        layout=this.processFormsHeuristic(layout,containers);
        layout=this.removeExtraContainers(layout,containers);
        layout=this.processValuesManagers(layout,containers);
        layout=this.processVLayoutForms(layout,containers);
        layout=this.processAddingToContainersHeuristic(layout,containers);
        if(this.fillSpace){
            layout=this.processFluidLayoutHeuristic(layout,containers);
        }
        layout=this.processTabVStackHeuristic(layout,containers);
        return layout;
    }
,isc.A.processVLayoutForms=function isc_MockupImporter_processVLayoutForms(layout,containers){
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(container._constructor=="VLayout"||container._constructor=="VStack"){
                for(var j=0;j<container.contained.length;j++){
                    var item=container.contained[j];
                    if(item._constructor=="DynamicForm"&&(item.items||item.fields)){
                        var items=item.items||item.fields;
                        for(var k=0;k<items.length;k++){
                            var formItem=items[k];
                            if(formItem._constructor=="TextAreaItem"){
                                formItem.height="*";
                            }
                        }
                    }
                }
            }
            var isHorizontal=container._constructor=="HStack"||
                container._constructor=="HLayout";
            var isVertical=container._constructor=="VStack"||
                container._constructor=="VLayout";
            if(isHorizontal||isVertical){
                if((isHorizontal&&(container.specialProperties.overrideHeight||container.specialProperties.fullHeight))||
                    (isVertical&&(container.specialProperties.overrideWidth||container.specialProperties.fullWidth))){
                    for(var j=0;j<container.contained.length;j++){
                        var item=container.contained[j];
                        if(item.showResizeBar)item.resizeBarTarget="next";
                    }
                }
            }
        }
        return layout;
    }
,isc.A.processContainersHeuristic=function isc_MockupImporter_processContainersHeuristic(layout,containers){
        var transformRules=this._transformRules;
        var controlList=[];
        var dataSourceList=[];
        for(var i=0;i<layout.length;i++){
            if(layout[i].left!=null){
                layout[i].absX=layout[i].left;
            }
            if(layout[i].top!=null){
                layout[i].absY=layout[i].top;
            }
        }
        for(var i=0;i<layout.length;i++){
            var control=layout[i];
            if(control._constructor=="MockDataSource"){
                dataSourceList.addAt(control,0);
            }else{
                var container=this.findBestContainer(containers,control);
                if(container!=null){
                    var containerBmmlName=container.specialProperties.controlName;
                    var controlBmmlName=control.specialProperties.controlName;
                    var controlBmmlMarkup=control.specialProperties.markup;
                    var rules=transformRules.widgetPropertyTranslations[containerBmmlName];
                    control.top-=container.absY;
                    control.left-=container.absX;
                    control.autoDraw=false;
                    if(controlBmmlMarkup){
                        container.markupContained.add(control);
                        control.top-=rules.getTopMargin(container);
                        control.left-=rules.getLeftMargin(container);
                    }else{
                        var controlAreaName=null;
                        if(rules.getControlAreaName){
                            controlAreaName=rules.getControlAreaName(container,control);
                        }
                        if(controlAreaName){
                            container.headerContained.add({
                                controlAreaName:controlAreaName,
                                control:control
                            });
                        }else{
                            container.contained.add(control);
                            control.top-=rules.getTopMargin(container);
                            control.left-=rules.getLeftMargin(container);
                            var controlRules=
                                transformRules.widgetPropertyTranslations[controlBmmlName];
                            if(controlRules&&controlRules.sloppyEdgeControl){
                                if((control.left+control.width)>container.width){
                                    control.width=container.width-control.left;
                                }
                                if((control.top+control.height)>container.height){
                                    control.height=container.height-control.top;
                                }
                            }
                        }
                    }
                    control.top=Math.max(0,control.top);
                    control.left=Math.max(0,control.left);
                }
                controlList.add(control);
            }
        }
        var orderedControlList=[];
        for(var i=0;i<controlList.length;i++){
            var control=controlList[i];
            var childItems=this.getAllChildItems(control);
            if(childItems.length==0){
                orderedControlList.add(control,0);
            }else{
                var lastIndex=-1;
                for(var j=0;j<childItems.length;j++){
                    var index=orderedControlList.indexOf(childItems[j]);
                    if(index>=0&&lastIndex<index){
                        lastIndex=index;
                    }
                }
                if(lastIndex>=0){
                    orderedControlList.add(control,lastIndex+1);
                }else{
                    orderedControlList.add(control,0);
                }
            }
        }
        var outerControls=[];
        for(var i=0;i<orderedControlList.length;i++){
            var control=orderedControlList[i];
            if(containers.contains(control))continue;
            var hasContainer=false;
            for(var j=0;j<containers.length;j++){
                var container=containers[j];
                if((container.contained&&container.contained.contains(control))||
                    (container.markupContained&&container.markupContained.contains(control)))
                {
                    hasContainer=true;
                    break;
                }
                if(container.headerContained){
                    for(var k=0;k<container.headerContained.length;k++){
                        if(container.headerContained[k].control==control){
                            hasContainer=true;
                            break;
                        }
                    }
                    if(hasContainer){
                        break;
                    }
                }
            }
            if(!hasContainer){
                outerControls.add(control);
            }
        }
        if(outerControls.length>0){
            for(var j=0;j<outerControls.length-1;j++){
                outerControls[j].autoDraw=false;
                var fakeContainer={
                    ID:"outer_"+j,
                    _constructor:"VStack",
                    fake:true,
                    contained:[outerControls[j]],
                    markupContained:[],
                    specialProperties:{
                        controlName:"Stack"
                    },
                    top:outerControls[j].top,
                    left:outerControls[j].left,
                    width:outerControls[j].width,
                    height:outerControls[j].height
                };
                var changed;
                do{
                    changed=false;
                    for(var k=j+1;k<outerControls.length;k++){
                        var outerControl=outerControls[k];
                        var outerControlLeft=outerControl.left;
                        var outerControlRight=outerControl.left+outerControl.width;
                        var outerControlTop=outerControl.top;
                        var outerControlBottom=outerControl.top+outerControl.height;
                        var fakeContainerLeft=fakeContainer.left;
                        var fakeContainerRight=fakeContainer.left+fakeContainer.width;
                        var fakeContainerTop=fakeContainer.top;
                        var fakeContainerBottom=fakeContainer.top+fakeContainer.height;
                        var fakeContainerLeftZone=fakeContainerLeft-this.maxOuterControlsDistance;
                        var fakeContainerRightZone=fakeContainerRight+this.maxOuterControlsDistance;
                        var fakeContainerTopZone=fakeContainerTop-this.maxOuterControlsDistance;
                        var fakeContainerBottomZone=fakeContainerBottom+this.maxOuterControlsDistance;
                        var overlap=
                            outerControlLeft<fakeContainerRightZone&&
                            outerControlRight>fakeContainerLeftZone&&
                            outerControlTop<fakeContainerBottomZone&&
                            outerControlBottom>fakeContainerTopZone;
                        if(overlap){
                            fakeContainer.contained.add(outerControl);
                            outerControl.autoDraw=false;
                            var bottom=Math.max(fakeContainerBottom,outerControlBottom);
                            var right=Math.max(fakeContainerRight,outerControlRight);
                            fakeContainer.top=Math.min(fakeContainerTop,outerControlTop);
                            fakeContainer.left=Math.min(fakeContainerLeft,outerControlLeft);
                            fakeContainer.height=bottom-fakeContainer.top;
                            fakeContainer.width=right-fakeContainer.left;
                            outerControls.removeAt(k);
                            k--;
                            changed=true;
                        }
                    }
                }while(changed);
                for(var k=0;k<fakeContainer.contained.length;k++){
                    fakeContainer.contained[k].left-=fakeContainer.left;
                    fakeContainer.contained[k].top-=fakeContainer.top;
                    var specialProperties=fakeContainer.contained[k].specialProperties;
                    if(specialProperties&&specialProperties.markup){
                        fakeContainer.markupContained.add(fakeContainer.contained[k]);
                        fakeContainer.contained.removeAt(k);
                        k--;
                    }
                }
                fakeContainer.absX=fakeContainer.left,
                fakeContainer.absY=fakeContainer.top,
                containers.add(fakeContainer);
                orderedControlList.add(fakeContainer);
            }
        }
        orderedControlList.addListAt(dataSourceList,0);
        return orderedControlList;
    }
,isc.A.getAllChildItems=function isc_MockupImporter_getAllChildItems(control,containedOnly){
        if(control.contained==null){
            return[];
        }
        var childItems=[];
        childItems.addList(control.contained);
        if(containedOnly!=true){
            if(control.markupContained){
                childItems.addList(control.markupContained);
            }
            if(control.headerContained){
                for(var i=0;i<control.headerContained.length;i++){
                    childItems.add(control.headerContained[i].control);
                }
            }
        }
        for(var i=0;i<control.contained.length;i++){
            if(control.contained[i].contained&&control.contained[i].contained.length>0){
                childItems.addList(this.getAllChildItems(control.contained[i]));
            }
        }
        return childItems;
    }
,isc.A.findBestContainer=function isc_MockupImporter_findBestContainer(containers,control){
        var transformRules=this._transformRules;
        var right=control.absX+(control.width==null?0:control.width);
        var bottom=control.absY+(control.height==null?0:control.height);
        var match=[];
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(container==control){
                continue;
            }
            var specialProperties=container.specialProperties;
            if(specialProperties&&specialProperties.markup){
                continue;
            }
            var containerLeft=container.absX-2;
            var containerRight=container.absX+container.width+2;
            var containerTop=container.absY-2;
            var containerBottom=container.absY+container.height+2;
            if(containerLeft<=control.absX&&containerTop<=control.absY&&
                control.zIndex>=container.zIndex)
            {
                var prop;
                if(control.specialProperties){
                    var controlName=control.specialProperties.controlName;
                    prop=transformRules.widgetPropertyTranslations[controlName];
                }
                if(prop!=null&&prop.sloppyEdgeControl){
                    if((containerRight+this.sloppyEdgeControlOverflow)>=right&&
                        (containerBottom+this.sloppyEdgeControlOverflow)>=bottom)
                    {
                        match.add(container);
                    }
                }else{
                    if(containerRight>=right&&containerBottom>=bottom){
                        match.add(container);
                    }
                }
            }
        }
        if(match.length>0){
            var container=match[0];
            for(var i=1;i<match.length;i++){
                if(container.width>match[i].width||container.height>match[i].height){
                    container=match[i];
                }
            }
            return container;
        }else{
            return null;
        }
    }
,isc.A.processStackHeuristic=function isc_MockupImporter_processStackHeuristic(layout,containers){
        var transformRules=this._transformRules;
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            var isHorizontal=container._constructor=="HStack"||
                container._constructor=="HLayout";
            for(var cind=0;cind<container.contained.length;cind++){
                var widget=container.contained[cind];
                if(widget._constructor=="Scrollbar"){
                    var cName=widget.specialProperties.controlName;
                    var containerBmmlName=container.specialProperties.controlName;
                    var containerPropertyTranslations=
                        transformRules.widgetPropertyTranslations[containerBmmlName];
                    var isRemove=false;
                    if(cName=="com.balsamiq.mockups::VerticalScrollBar"){
                        var widgetRightBorder=widget.left+widget.width;
                        var containerRightBorder=container.width-containerPropertyTranslations.getRightMargin(container);
                        isRemove=Math.abs(containerRightBorder-widgetRightBorder)<10;
                    }else{
                        var widgetBottomBorder=widget.top+widget.height;
                        var containerBottomBorder=container.height-containerPropertyTranslations.getBottomMargin(container);
                        isRemove=Math.abs(containerBottomBorder-widgetBottomBorder)<10;
                    }
                    if(isRemove){
                        container.overflow="auto";
                        layout.remove(widget);
                        container.contained.removeAt(cind);
                        cind--;
                    }
                }
            }
            container.contained.sort(function(a,b){
                if(a.top==b.top){
                    return a.left-b.left;
                }
                return a.top-b.top;
            });
            this.handleElementsOverlap(container.contained);
            this.addLabelsToFormItems(layout,container);
            var verticallySplitted=
                this.splitElementsByContainers(container.contained,"top","height");
            var horizontallySplitted=
                this.splitElementsByContainers(container.contained,"left","width");
            var processed;
            if(horizontallySplitted.size()>1&&horizontallySplitted.size()<5&&
                (verticallySplitted.size()<2||
                    horizontallySplitted.size()<verticallySplitted.size())&&
                container._constructor!="HStack"&&container._constructor!="HLayout")
            {
                processed=this.processStacksRecursively(container,"root_horizontal");
                var stack={
                    _constructor:"HStack",
                    ID:container.ID+"_HStack",
                    contained:container.contained,
                    specialProperties:{
                        controlName:"Stack",
                        containerName:"HStack",
                        fullWidth:true,
                        fullHeight:true
                    }
                };
                var zIndex=1000000;
                var maxHeight=0;
                for(var j=0;j<stack.contained.length;j++){
                    if(stack.contained[j].zIndex){
                       zIndex=Math.max(zIndex,stack.contained[j].zIndex);
                    }
                    if(stack.contained[j].height){
                        maxHeight=Math.max(maxHeight,stack.contained[j].height);
                    }
                };
                stack.zIndex=zIndex;
                stack.height=maxHeight;
                container.contained=[stack];
                processed.add(stack);
            }else{
                processed=this.processStacksRecursively(container,"root_vertical");
            }
            containers.addListAt(processed,i);
            var containerIndex=layout.indexOf(container);
            layout.addListAt(processed,containerIndex);
            i+=processed.length;
        }
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            var isHorizontal=container._constructor=="HStack"||
                container._constructor=="HLayout";
            var membersMargin=0;
            for(var j=1;j<container.contained.length;j++){
                var currentWidget=container.contained[j];
                var previousWidget=container.contained[j-1];
                var nextWidget=container.contained[j+1];
                var specialProperties=currentWidget.specialProperties;
                var cName=specialProperties&&specialProperties.controlName;
                if(cName=="com.balsamiq.mockups::HSplitter"||
                    cName=="com.balsamiq.mockups::HRule"||
                    cName=="com.balsamiq.mockups::VSplitter"||
                    cName=="com.balsamiq.mockups::VRule")
                {
                    previousWidget.showResizeBar=true;
                    container.overflow="auto";
                    layout.remove(container.contained[j]);
                    container.contained.removeAt(j);
                    j--;
                    continue;
                }
                if((isHorizontal&&cName=="com.balsamiq.mockups::VerticalScrollBar")||
                    (!isHorizontal&&cName=="com.balsamiq.mockups::HorizontalScrollBar"))
                {
                    container.overflow="auto";
                    if(isHorizontal){
                        previousWidget.width+=currentWidget.width;
                    }else{
                        previousWidget.height+=currentWidget.height;
                    }
                    layout.remove(currentWidget);
                    container.contained.removeAt(j);
                    j--;
                    continue;
                }
                var margin;
                if(isHorizontal){
                    margin=currentWidget.left-previousWidget.left-previousWidget.width;
                }else{
                    margin=currentWidget.top-previousWidget.top-previousWidget.height;
                }
                if(membersMargin==0){
                    membersMargin=margin;
                }else if(Math.abs(membersMargin-margin)>5){
                    membersMargin=0;
                    break;
                }
            }
            var containerBmmlName=container.specialProperties.controlName;
            var widgetPropertyTranslations=
                transformRules.widgetPropertyTranslations[containerBmmlName];
            if(widgetPropertyTranslations.canUseMargin==null||
                widgetPropertyTranslations.canUseMargin)
            {
                if(membersMargin>0){
                    for(var j=0;j<container.contained.length-1;j++){
                        if(container.contained[j].showResizeBar!=true){
                            container.membersMargin=membersMargin;
                            break;
                        }
                    }
                }
            }else{
                membersMargin=0;
            }
            for(var j=1;j<container.contained.length;j++){
                var currentWidget=container.contained[j];
                var previousWidget=container.contained[j-1];
                var extraSpace=0;
                if(isHorizontal){
                    if(currentWidget.absX!=null&&previousWidget.absX!=null){
                        extraSpace=currentWidget.absX-membersMargin-
                        (previousWidget.absX+previousWidget.width);
                    }else{
                        extraSpace=currentWidget.left-membersMargin-
                        (previousWidget.left+previousWidget.width);
                    }
                }else{
                    if(currentWidget.absY!=null&&previousWidget.absY!=null){
                        extraSpace=currentWidget.absY-membersMargin-
                        (previousWidget.absY+previousWidget.height);
                    }else{
                        extraSpace=currentWidget.top-membersMargin-
                        (previousWidget.top+previousWidget.height);
                    }
                }
                if(previousWidget.showResizeBar){
                    var halfSpace=Math.round((extraSpace+membersMargin-4)/2);
                    if(isHorizontal){
                        previousWidget.width+=halfSpace;
                        currentWidget.width+=halfSpace;
                        currentWidget.left-=halfSpace;
                        if(currentWidget.contained){
                            for(var k=0;k<currentWidget.contained.length;k++){
                                currentWidget.contained[k].specialProperties.left=
                                    currentWidget.contained[k].left;
                                currentWidget.contained[k].left+=halfSpace
                            }
                        }
                    }else{
                        previousWidget.height+=halfSpace;
                        currentWidget.height+=halfSpace;
                        currentWidget.top-=halfSpace;
                        if(currentWidget.contained){
                            for(var k=0;k<currentWidget.contained.length;k++){
                                currentWidget.contained[k].specialProperties.top=
                                    currentWidget.contained[k].top;
                                currentWidget.contained[k].top+=halfSpace
                            }
                        }
                    }
                }else if(extraSpace>0){
                    previousWidget.extraSpace=extraSpace;
                }
            }
        }
        return layout;
    }
,isc.A.addLabelsToFormItems=function isc_MockupImporter_addLabelsToFormItems(layout,container){
        for(var i=0;i<container.contained.length;i++){
            var label=container.contained[i];
            if(label._constructor!="Label")continue;
            if(label.specialProperties.controlName=="com.balsamiq.mockups::Icon")continue;
            for(var j=0;j<container.contained.length;j++){
                var formItem=container.contained[j],
                    items=formItem.items||formItem.fields
                ;
                if(formItem._constructor!="DynamicForm"||items==null){
                    continue;
                }
                var below=(formItem.top>label.top)&&
                     (formItem.top-(label.top+label.height)<this.labelMaxOffset)&&
                     ((Math.abs(formItem.left-label.left)<this.labelMaxOffset)||
                     (label.left<=formItem.left&&
                         (label.left+label.width)>=(formItem.left+formItem.width)
                     ));
                var right=(formItem.left>label.left)&&
                      (formItem.left-(label.left+label.width)<2*this.labelMaxOffset)&&
                      (label.top+this.labelMaxOffset>formItem.top)&&
                      (label.top+label.height-this.labelMaxOffset<
                      formItem.top+formItem.height);
                if(below||right){
                    if(items[0].title){
                        if(below){
                            var isLabelAbove=false;
                            for(var l=0;l<container.contained.length;l++){
                                var label2=container.contained[l];
                                if(i!=l&&label2._constructor=="Label"){
                                    var above=(label.top>label2.top&&
                                          (label.top-(label2.top+label2.height))<
                                            this.labelMaxOffset)&&
                                          (Math.abs(label.left-label2.left)<
                                            this.labelMaxOffset);
                                    if(above){
                                        isLabelAbove=true;
                                        break;
                                    }
                                }
                            }
                            if(isLabelAbove){
                                continue;
                            }
                        }
                    }else{
                        if(label.contents==null)continue;
                        items[0].showTitle=true;
                        label.contents=String(label.contents);
                        if(label.contents.endsWith(":")){
                            label.contents=label.contents.substring(0,label.contents.length-1);
                        }
                        items[0].title=label.contents;
                        if(below){
                            formItem.numCols=1;
                            items[0].titleOrientation="top";
                            var labHeight=17;
                            formItem.height+=labHeight;
                            formItem.top=Math.max(0,formItem.top-labHeight);
                            formItem.absY-=labHeight;
                        }else{
                            var oldFormItemWidth=formItem.width;
                            formItem.numCols=2;
                            formItem.width=formItem.left+formItem.width-label.left;
                            formItem.left=label.left;
                            formItem.absX=label.absX;
                            if(formItem.height>label.height*2){
                                var td=Math.abs(label.top-formItem.top);
                                var cd=Math.abs(formItem.top+formItem.height/2-label.top-label.height/2);
                                var bd=Math.abs(formItem.height-label.top-label.height);
                                if(td<cd&&td<bd){
                                    items[0].titleVAlign="top";
                                }else if(bd<cd&&bd<td){
                                    items[0].titleVAlign="bottom";
                                }
                            }
                            if(isc.isA.String(items[0].width)){
                                formItem.titleWidth=formItem.width-oldFormItemWidth+1;
                            }else{
                                formItem.titleWidth=formItem.width-items[0].width+1;
                            }
                        }
                        container.contained.removeAt(i);
                        layout.remove(label);
                        i--;
                        break;
                    }
                }
            }
        }
    }
,isc.A.processStacksRecursively=function isc_MockupImporter_processStacksRecursively(container,orientation){
        container.contained.sort(function(a,b){
            if(a.top==b.top){
                return a.left-b.left;
            }
            return a.top-b.top;
        });
        var elements=container.contained;
        if(orientation=="vertical"||orientation=="root_vertical"){
            var splittedElements=this.splitElementsByContainers(elements,"top","height");
            if(orientation=="vertical"&&splittedElements.length==1){
                return[];
            }
            splittedElements.sort(function(a,b){
                return a.top-b.top;
            });
            container.contained=[];
            var stacks=[];
            for(var i=0;i<splittedElements.length;i++){
                var elementsData=splittedElements[i];
                if(elementsData.children.length==1){
                    container.contained.add(elementsData.children[0]);
                }else{
                    var stack={
                        _constructor:"HStack",
                        ID:container.ID+"_HStack"+i,
                        contained:elementsData.children,
                        top:elementsData.top,
                        height:elementsData.height,
                        absY:elementsData.children[0].absY,
                        absX:elementsData.children[0].absX,
                       specialProperties:{
                            controlName:"Stack"
                       }
                    };
                    var zIndex=1000000;
                    var minX=1000000;
                    var maxX=0;
                    for(var j=0;j<elementsData.children.length;j++){
                        var childElement=elementsData.children[j];
                        childElement.top-=stack.top;
                        if(childElement.top<0)childElement.top=0;
                        if(childElement.zIndex){
                           zIndex=Math.max(zIndex,childElement.zIndex);
                        }
                        minX=Math.min(minX,childElement.left);
                        maxX=Math.max(maxX,childElement.left+childElement.width);
                    }
                    stack.zIndex=zIndex;
                    stack.width=maxX-minX;
                    stack.left=minX;
                    for(var j=0;j<elementsData.children.length;j++){
                        elementsData.children[j].left-=stack.left;
                    }
                    var innerStacks=this.processStacksRecursively(stack,"horizontal");
                    container.contained.add(stack);
                    if(innerStacks.length!=0){
                        stacks.addList(innerStacks);
                    }
                    stacks.add(stack);
                }
            }
            return stacks;
        }else{
            var splittedElements=this.splitElementsByContainers(elements,"left","width");
            if(orientation=="horizontal"&&splittedElements.length==1){
                return[];
            }
            splittedElements.sort(function(a,b){
                return a.left-b.left;
            });
            container.contained=[];
            var stacks=[];
            for(var i=0;i<splittedElements.length;i++){
                var elementsData=splittedElements[i];
                if(elementsData.children.length==1){
                    container.contained.add(elementsData.children[0]);
                }else{
                    var stack={
                        _constructor:"VStack",
                        ID:container.ID+"_VStack"+i,
                        contained:elementsData.children,
                        left:elementsData.left,
                        width:elementsData.width,
                        absX:elementsData.children[0].absX,
                        absY:elementsData.children[0].absY,
                        autoDraw:false,
                        specialProperties:{
                            controlName:"Stack"
                        }
                    };
                    var zIndex=1000000;
                    var minY=1000000;
                    var maxY=0;
                    for(var j=0;j<elementsData.children.length;j++){
                        var childElement=elementsData.children[j];
                        childElement.left-=stack.left;
                        if(childElement.left<0){
                            childElement.left=0;
                        }
                        if(childElement.zIndex){
                           zIndex=Math.max(zIndex,childElement.zIndex);
                        }
                        minY=Math.min(minY,childElement.top);
                        maxY=Math.max(maxY,childElement.top+childElement.height);
                    }
                    stack.zIndex=zIndex;
                    stack.height=maxY-minY;
                    stack.top=minY;
                    for(var j=0;j<elementsData.children.length;j++){
                        elementsData.children[j].top-=stack.top;
                    }
                    var innerStacks=this.processStacksRecursively(stack,"vertical");
                    container.contained.add(stack);
                    if(innerStacks.length!=0){
                        stacks.addList(innerStacks);
                    }
                    stacks.add(stack);
                }
            }
            return stacks;
        }
    }
,isc.A.splitElementsByContainers=function isc_MockupImporter_splitElementsByContainers(elements,minName,sizeName){
        var containersData=[],
            transformRules=this._transformRules;
        for(var i=0;i<elements.length;i++){
            var element=elements[i],
                elementSize=element[sizeName],
                specialProperties=element.specialProperties;
            if(specialProperties){
                var elementBmmlName=specialProperties.controlName;
                var widgetPropertyTranslations=
                    transformRules.widgetPropertyTranslations[elementBmmlName];
                if(widgetPropertyTranslations&&widgetPropertyTranslations.sloppyEdgeControl&&
                    widgetPropertyTranslations.estimateControlSize)
                {
                    elementSize=
                        widgetPropertyTranslations.estimateControlSize(element)[sizeName];
                    element[sizeName]=elementSize;
                }
            }
            var matchingContainer=null;
            for(var j=0;j<containersData.length;j++){
                var container=containersData[j];
                var elementSizeQuarter=elementSize/4;
                var containerSizeQuarter=container[sizeName];
                containerSizeQuarter/=4;
                var minOverlap=Math.min(elementSizeQuarter,containerSizeQuarter);
                if((element[minName]+minOverlap>=container[minName])&&
                    (element[minName]+minOverlap<container[minName]+container[sizeName]))
                {
                    matchingContainer=container;
                    break;
                }
            }
            if(matchingContainer!=null){
                matchingContainer.children.add(element);
                if(element[minName]<matchingContainer[minName]||
                   (element[minName]+elementSize>
                    matchingContainer[minName]+matchingContainer[sizeName]))
                {
                    var containerMaxCoord=matchingContainer[minName]+matchingContainer[sizeName];
                    var elementMaxCoord=element[minName]+element[sizeName];
                    matchingContainer[minName]=
                        Math.min(element[minName],matchingContainer[minName]);
                    matchingContainer[sizeName]=
                        Math.max(containerMaxCoord,elementMaxCoord)-matchingContainer[minName];
                    for(var j=0;j<containersData.length;j++){
                        var container=containersData[j];
                        var elementSizeQuarter=elementSize/4;
                        var containerSizeQuarter=container[sizeName];
                        containerSizeQuarter/=4;
                        var minOverlap=Math.min(elementSizeQuarter,containerSizeQuarter);
                        if(container!=matchingContainer&&
                            (matchingContainer[minName]+minOverlap)<
                                (container[minName]+container[sizeName])&&
                            (matchingContainer[minName]+matchingContainer[sizeName])>
                                (container[minName]+minOverlap))
                        {
                            matchingContainer.children.addList(container.children);
                            if(matchingContainer[minName]>container[minName]){
                                matchingContainer[minName]=container[minName];
                            }
                            if(matchingContainer[minName]+matchingContainer[sizeName]<
                                container[minName]+container[sizeName])
                            {
                                matchingContainer[sizeName]=container[minName]+
                                    container[sizeName]-matchingContainer[minName];
                            }
                            containersData.removeAt(j);
                            j--;
                        }
                    }
                }
            }else{
                var containerData={children:[element]};
                containerData[minName]=element[minName];
                containerData[sizeName]=elementSize;
                containersData.add(containerData);
            }
        }
        return containersData;
    }
);
isc.evalBoundary;isc.B.push(isc.A.handleElementsOverlap=function isc_MockupImporter_handleElementsOverlap(elements){
        for(var i=0;i<elements.length-1;i++){
            for(var j=i+1;j<elements.length;j++){
                var element1=elements[i];
                var element2=elements[j];
                var element1Right=element1.left+element1.width;
                var element1Bottom=element1.top+element1.height;
                var element2Right=element2.left+element2.width;
                var element2Bottom=element2.top+element2.height;
                if(element1.left<element2Right&&element1Right>element2.left&&
                        element1.top<element2Bottom&&element1Bottom>element2.top)
                {
                    var dy=Math.abs(element1Bottom-element2.top);
                    var dx=Math.abs(element1Right-element2.left);
                    if(dy>0&&dy<this.maxControlOverlap){
                        element1.height-=dy+1;
                        if(element1._constructor=="DynamicForm"&&(element1.items||element1.fields)){
                            var items=element1.items||element1.fields;
                            for(var k=0;k<items.length;k++){
                                items[k].height=
                                    Math.min(items[k].height,element1.height-2);
                            }
                        }
                    }
                    if(dx>0&&dx<this.maxControlOverlap){
                        element1.width-=dx+1;
                        if(element1._constructor=="DynamicForm"&&(element1.items||element1.fields)){
                            var items=element1.items||element1.fields;
                            for(var k=0;k<items.length;k++){
                                items[k].width=
                                    Math.min(items[k].width,element1.width-2);
                            }
                        }
                    }
                }
            }
        }
    }
,isc.A.processFormsHeuristic=function isc_MockupImporter_processFormsHeuristic(layout,containers){
        var transformRules=this._transformRules;
        var formLayouts=[];
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(this.isFormsOnlyContainer(container)){
                formLayouts.add(container);
            }
        }
        var partialFormLayouts=[];
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(formLayouts.contains(container))continue;
            var startIndex=-1;
            var endIndex=-1;
            for(var j=0;j<container.contained.length;j++){
                var item=container.contained[j];
                var end=(j==(container.contained.length-1));
                if((item._constructor=="DynamicForm"&&(item.items!=null||item.fields!=null))||
                     (item._constructor!="DynamicForm"&&formLayouts.contains(item)&&
                     this._additionalLayouts.contains(item._constructor)))
                {
                    if(startIndex<0)startIndex=j;
                    endIndex=j;
                }else{
                    end=true
                }
                if(end&&startIndex>=0){
                    if(startIndex!=endIndex){
                        partialFormLayouts.add({
                            container:container,
                            startInd:startIndex,
                            endInd:endIndex
                        });
                        for(var k=startIndex;k<=endIndex;k++){
                            formLayouts.remove(container.contained[k]);
                            var child=this.getAllChildItems(container.contained[k],true);
                            for(var ci=0;ci<child.length;ci++){
                                if(child[ci].contained)formLayouts.remove(child[ci]);
                            }
                        }
                    }
                    startIndex=-1;
                    endIndex=-1;
                }
            }
        }
        for(var i=0;i<formLayouts.length;i++){
            for(var j=0;j<formLayouts.length;j++){
                if(formLayouts[j].contained.contains(formLayouts[i])){
                    formLayouts.removeAt(i);
                    i--;
                    break;
                }
            }
        }
        var formIdInd=1;
        for(var i=0;i<formLayouts.length;i++){
            var formLayout=formLayouts[i];
            var childItems=this.getAllChildItems(formLayout,true)
            if(childItems.length<=1)continue;
            var form=this.combineItemsIntoAForm(childItems);
            var bmmlName=formLayout.specialProperties.controlName;
            var widgetPropertyTranslations=
                transformRules.widgetPropertyTranslations[bmmlName];
            form.left=Math.max(0,form.absX-formLayout.absX-
                widgetPropertyTranslations.getLeftMargin(formLayout));
            form.top=Math.max(0,form.absY-formLayout.absY-
                widgetPropertyTranslations.getTopMargin(formLayout));
            form.specialProperties={};
            form.specialProperties.calculatedHeight=form.calculatedHeight;
            delete form.calculatedHeight;
            form.ID="form"+formIdInd++;
            formLayout.contained=[form];
            delete form.additionalExtraSpace;
            if(isc.isA.Number(formLayout.height)&&isc.isA.Number(form.height)){
                formLayout.height=Math.max(formLayout.height,form.height);
            }
            layout.addAt(form,layout.indexOf(formLayout));
            for(var j=0;j<childItems.length;j++){
                layout.remove(childItems[j]);
                containers.remove(childItems[j]);
            }
        }
        for(var i=0;i<partialFormLayouts.length;i++){
            var partialFormsData=partialFormLayouts[i];
            var formItemsContainer=partialFormsData.container;
            var childItems=[];
            for(var j=partialFormsData.startInd;j<=partialFormsData.endInd;j++){
                var formItem=formItemsContainer.contained[j];
                if(formItem.contained){
                    childItems.addList(this.getAllChildItems(formItem,true));
                }else{
                    childItems.add(formItem);
                }
            }
            if(childItems.length<=1)continue;
            var form=this.combineItemsIntoAForm(childItems);
            form.left=formItemsContainer.contained[partialFormsData.startInd].left;
            form.top=formItemsContainer.contained[partialFormsData.startInd].top;
            form.specialProperties={};
            form.specialProperties.calculatedHeight=form.calculatedHeight;
            delete form.calculatedHeight;
            form.ID="form"+formIdInd++;
            var lastItem=formItemsContainer.contained[partialFormsData.endInd]
            if(lastItem.extraSpace){
                form.extraSpace=lastItem.extraSpace;
            }
            for(var j=partialFormsData.endInd;j>=partialFormsData.startInd;j--){
                layout.remove(formItemsContainer.contained[j]);
                containers.remove(formItemsContainer.contained[j]);
                formItemsContainer.contained.removeAt(j);
            };
            formItemsContainer.contained.addAt(form,partialFormsData.startInd);
            layout.addAt(form,layout.indexOf(formItemsContainer));
            for(var j=0;j<childItems.length;j++){
                layout.remove(childItems[j]);
                containers.remove(childItems[j]);
            }
        }
        for(var i=0;i<layout.length;i++){
            var item=layout[i],
                items=item.items||item.fields
            ;
            if(item._constructor=="DynamicForm"&&
                items&&items.length==1&&
                items[0]._constructor=="ButtonItem")
            {
                var extraSpace=item.extraSpace;
                var button=items[0];
                if(item.extraSpace)button.extraSpace=item.extraSpace;
                button.left=item.left;
                button.top=item.top;
                button._constructor="Button";
                delete button.startRow;
                delete button.endRow;
                for(var attributeName in item){
                    if(attributeName!="ID"&&attributeName!="specialProperties"){
                        delete item[attributeName];
                    }
                }
                for(var attributeName in button){
                    item[attributeName]=button[attributeName];
                }
            }else if(item._constructor=="DynamicForm"&&items){
                var form=item;
                var formItems=items;
                var numCols=form.numCols||2;
                var colsOccupied=0;
                var rowSpans=[];
                for(var j=0;j<formItems.length;j++){
                    var item=formItems[j];
                    var nextItem=null;
                    var itemCols=item.colSpan||(item.showTitle?2:1);
                    var itemsToCombine=[item];
                    var valueMap=[item.title];
                    var disabledMap=[];
                    var value=null;
                    if(item.value==true){
                        value=item.title;
                    }
                    var isHorizontal=numCols>itemCols&&item.endRow!=true;
                    if(item.rowSpan!=null){
                        for(var s=0;s<(colsOccupied+itemCols-1);s++){
                            rowSpans[s]=item.rowSpan;
                        }
                    }else{
                        for(var s=colsOccupied-1;s<(colsOccupied+itemCols-1);s++){
                            if(rowSpans[s]==null)break;
                            colsOccupied++;
                            if(--rowSpans[s]==0){
                                rowSpans[s]=null;
                            }
                        }
                    }
                    colsOccupied+=itemCols;
                    if(item._constructor=="RadioItem"){
                        for(var k=j+1;k<formItems.length;k++){
                            nextItem=formItems[k];
                            if(nextItem._constructor!="RadioItem")break;
                            if(nextItem.value==true){
                                if(value!=null)break;
                                value=nextItem.title;
                            }
                            itemsToCombine.add(nextItem);
                            valueMap.add(nextItem.title);
                            if(nextItem.disabled){
                                disabledMap.add(nextItem.title);
                            }
                            var nextItemCols=nextItem.colSpan||(nextItem.showTitle?2:1);
                            colsOccupied+=nextItemCols;
                            if(nextItem.endRow||colsOccupied==numCols){
                                if(isHorizontal)break;
                                colsOccupied=0;
                            }
                        }
                    }
                    if(itemsToCombine.length>1){
                        formItems.removeList(itemsToCombine);
                        var radioGroup={
                            _constructor:"RadioGroupItem",
                            type:"radioGroup",
                            showTitle:false,
                            valueMap:valueMap,
                            value:item.title
                        };
                        if(itemsToCombine[0].cellHeight){
                            radioGroup.cellHeight=itemsToCombine[0].cellHeight;
                        }
                        if(disabledMap.length>0){
                            radioGroup.disabledValues=disabledMap;
                        }
                        if(isHorizontal){
                            radioGroup.vertical=false;
                            radioGroup.colSpan=colsOccupied;
                            if(nextItem.endRow){
                                radioGroup.endRow=true;
                            }
                        }
                        formItems.addAt(radioGroup,j);
                        if(j>0&&formItems[j-1]._constructor=="StaticTextItem"&&!formItems[j-1].endRow){
                            formItems[j].showTitle=true;
                            formItems[j].title=formItems[j-1].value;
                            formItems.remove(formItems[j-1]);
                        }
                    }
                    if(item.endRow||colsOccupied==numCols||(nextItem&&nextItem.endRow)){
                        colsOccupied=0;
                    }
                }
                var lastItem=formItems[formItems.length-1];
                var extraSpace=0;
                if(form.extraSpace){
                    extraSpace=form.extraSpace;
                }
                if(lastItem.extraSpace){
                    extraSpace+=lastItem.extraSpace;
                }
                if(form.additionalExtraSpace){
                    extraSpace+=form.additionalExtraSpace;
                    form.height-=form.additionalExtraSpace;
                    delete form.additionalExtraSpace;
                }
                if(extraSpace>0){
                    form.extraSpace=extraSpace;
                }
            }
        }
        return layout;
    }
,isc.A.isFormsOnlyContainer=function isc_MockupImporter_isFormsOnlyContainer(container){
        var childItems=this.getAllChildItems(container,true)
        if(childItems.length==0)return false;
        var labelsOnly=true;
        for(var j=0;j<childItems.length;j++){
            var isForm=childItems[j]._constructor=="DynamicForm";
            var isLabel=childItems[j]._constructor=="Label"&&childItems[j].icon==null;
            var isLayout=this._additionalLayouts.contains(childItems[j]._constructor);
            if(!isForm&&!isLabel&&!isLayout)return false;
            if(isForm&&childItems[j].items==null&&childItems[j].fields==null)return false;
            labelsOnly=labelsOnly&&(isLabel||isLayout);
        }
        return!labelsOnly;
    }
,isc.A.combineItemsIntoAForm=function isc_MockupImporter_combineItemsIntoAForm(forms){
        var formItems=[];
        for(var i=0;i<forms.length;i++){
            if(forms[i]._constructor=="Label"){
                var label=forms[i];
                label._constructor="DynamicForm";
                label.items=[{
                    _constructor:"StaticTextItem",
                    showTitle:false,
                    width:label.width,
                    value:label.contents
                }];
            }
        }
        for(var j=0;j<forms.length;j++){
            if(forms[j]._constructor!="DynamicForm"||(forms[j].items==null&&forms[j].fields==null))continue;
            var x=forms[j].absX;
            var y=forms[j].absY;
            var isHorizontal=forms[j].orientation=="horizontal";
            var items=forms[j].items||forms[j].fields;
            for(var k=0;k<items.length;k++){
                var item=items[k];
                item._pos={
                    x:x,
                    y:y,
                    width:item.width?item.width:forms[j].width,
                    height:item.height?item.height:this.formsGridCellHeight
                };
                if(item.title&&!this._titledFormItems.contains(item._constructor)){
                    if(item.titleOrientation=="top"){
                        item._pos.height+=17;
                    }else if(forms[j].titleWidth){
                        item._pos.x+=forms[j].titleWidth;
                        item.titleWidth=forms[j].titleWidth;
                    }
                }
                if(isHorizontal){
                    x+=item._pos.width;
                }else{
                    y+=item._pos.height;
                }
                formItems.add(item);
            }
        }
        var resultingForm={
            _constructor:"DynamicForm",
            items:[]
        }
        var minX=10000;
        var minY=10000;
        for(var j=0;j<formItems.length;j++){
            minX=Math.min(minX,formItems[j]._pos.x);
            minY=Math.min(minY,formItems[j]._pos.y);
        }
        resultingForm.absX=minX;
        resultingForm.absY=minY;
        var formWidth=0;
        var formHeight=0;
        var xCoordinates=[];
        var yCoordinates=[];
        for(var j=0;j<formItems.length;j++){
            formItems[j]._pos.x-=minX;
            formItems[j]._pos.y-=minY;
            formWidth=Math.max(formWidth,formItems[j]._pos.x+formItems[j]._pos.width);
            formHeight=Math.max(formHeight,formItems[j]._pos.y+formItems[j]._pos.height);
            if(!xCoordinates.contains(formItems[j]._pos.x)){
                xCoordinates.add(formItems[j]._pos.x);
            }
            if(!yCoordinates.contains(formItems[j]._pos.y)){
                yCoordinates.add(formItems[j]._pos.y);
            }
        }
        xCoordinates.sort(function(a,b){
            return a-b;
        });
        yCoordinates.sort(function(a,b){
            return a-b;
        });
        for(var i=0;i<xCoordinates.length-1;i++){
            if(xCoordinates[i+1]-xCoordinates[i]<this.formsGridCellWidth){
                for(var j=0;j<formItems.length;j++){
                    if(formItems[j]._pos.x==xCoordinates[i+1]){
                        formItems[j]._pos.width+=(xCoordinates[i+1]-xCoordinates[i]);
                        formItems[j]._pos.x=xCoordinates[i];
                    }
                }
                xCoordinates.removeAt(i+1);
                i--;
            }
        }
        for(var i=0;i<yCoordinates.length-1;i++){
            if(yCoordinates[i+1]-yCoordinates[i]<this.formsGridCellHeight*2/3){
                for(var j=0;j<formItems.length;j++){
                    if(formItems[j]._pos.y==yCoordinates[i+1]){
                        formItems[j]._pos.height+=(yCoordinates[i+1]-yCoordinates[i]);
                        formItems[j]._pos.y=yCoordinates[i];
                    }
                }
                yCoordinates.removeAt(i+1);
                i--;
            }
        }
        var grid=[];
        for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
            var row=[];
            grid.add(row);
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                row.add(null);
            }
        }
        for(var j=0;j<formItems.length;j++){
            var item=formItems[j];
            var startRow=0;
            var endRow=0;
            for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
                if(item._pos.y>=yCoordinates[rowIndex]){
                    startRow=rowIndex;
                    endRow=rowIndex;
                }
                if((item._pos.y+item._pos.height)<=yCoordinates[rowIndex]){
                    break;
                }
                endRow=rowIndex;
            }
            var startCell=0;
            var endCell=0;
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                if(item._pos.x>=xCoordinates[cellIndex]){
                    startCell=cellIndex;
                    endCell=cellIndex;
                }
                if((item._pos.x+item._pos.width)<=xCoordinates[cellIndex]){
                    break;
                }
                endCell=cellIndex;
            }
            if(endCell-startCell>=1){
                item.colSpan=endCell-startCell+1;
            }
            if(endRow-startRow>=1){
                item.rowSpan=endRow-startRow+1;
            }
            delete item._pos;
            for(var cellIndex=startCell;cellIndex<=endCell;cellIndex++){
                for(var rowIndex=startRow;rowIndex<=endRow;rowIndex++){
                    var oldItem=grid[rowIndex][cellIndex];
                    if(oldItem){
                        if(cellIndex>0&&oldItem==grid[rowIndex][cellIndex-1]){
                            var clearCell=function(ci){
                                if(oldItemTitleColSpan>1&&ci<(oldItemStartCell+oldItemTitleColSpan)){
                                    oldItem.titleColSpan--;
                                    if(oldItem.titleColSpan==1)delete oldItem.titleColSpan;
                                    oldItemTitleColSpan--;
                                }else if(oldItem.colSpan){
                                    oldItem.colSpan--;
                                    if(oldItem.colSpan==1)delete oldItem.colSpan;
                                    oldItemColSpan--;
                                }
                                grid[rowIndex][ci]=null;
                            }
                            var oldItemTitleColSpan=(oldItem.titleColSpan?oldItem.titleColSpan:(oldItem.showTitle?1:0));
                            var oldItemColSpan=(oldItem.colSpan?oldItem.colSpan:1);
                            var oldItemRowCellCount=oldItemTitleColSpan+oldItemColSpan;
                            var oldItemStartCell=0;
                            for(var ci=startCell;ci<=endCell;ci++){
                                if(oldItem==grid[rowIndex][ci]){
                                    oldItemStartCell=ci;
                                    break;
                                }
                            }
                            clearCell(cellIndex);
                            if(cellIndex<grid[rowIndex].length&&oldItem==grid[rowIndex][cellIndex+1]){
                                clearCell(cellIndex-1);
                            }
                        }else if(rowIndex>0&&oldItem==grid[rowIndex-1][cellIndex]){
                            oldItem.rowSpan--;
                            for(var i=cellIndex+1;i<grid[rowIndex].length;i++){
                                if(grid[rowIndex][i]==oldItem){
                                    grid[rowIndex][i]=null;
                                }
                            }
                            if(oldItem.rowSpan==1)delete oldItem.rowSpan;
                        }
                    }
                    grid[rowIndex][cellIndex]=item;
                    if(item.titleWidth!=null){
                        var index=cellIndex-1;
                        var titleColSpan=0;
                        while(index>=0&&grid[rowIndex][index]==null){
                            grid[rowIndex][index]=item;
                            titleColSpan++;
                            index--;
                        }
                        if(titleColSpan>1)item.titleColSpan=titleColSpan;
                        if(titleColSpan>0)delete item.titleWidth;
                    }
                }
            }
        }
        for(var ri=0;ri<grid.length;ri++){
            for(var ci=0;ci<grid[ri].length-1;ci++){
                if(grid[ri][ci]&&grid[ri][ci+1]&&
                    grid[ri][ci]._constructor=="StaticTextItem"&&
                    grid[ri][ci+1]._constructor!="StaticTextItem"&&
                    grid[ri][ci+1]._constructor!="SpacerItem"&&
                    !this._titledFormItems.contains(grid[ri][ci+1]._constructor)&&
                    grid[ri][ci+1].showTitle==false)
                {
                    if(grid[ri][ci+1].rowSpan){
                        var c=false;
                        for(var rowIndex=0;rowIndex<grid.length;rowIndex++){
                            if(grid[rowIndex][ci+1]==grid[ri][ci+1]){
                                if(grid[rowIndex][ci]!=grid[ri][ci]&&
                                    grid[rowIndex][ci]!=null){
                                    c=true;
                                    break;
                                }
                                if(grid[rowIndex][ci]==null){
                                    grid[rowIndex][ci]=grid[ri][ci+1];
                                }
                            }
                        }
                        if(c){
                            continue;
                        }
                    }
                    var labelItem=grid[ri][ci];
                    grid[ri][ci+1].title=grid[ri][ci].value;
                    grid[ri][ci+1].width+=grid[ri][ci].width;
                    grid[ri][ci+1].showTitle=true;
                    grid[ri][ci]=grid[ri][ci+1];
                    var colInd=ci-1;
                    if(colInd>=0&&grid[ri][colInd]==labelItem){
                        while(colInd>=0&&grid[ri][colInd]==labelItem){
                            grid[ri][colInd]=grid[ri][ci+1];
                            if(grid[ri][ci+1].titleColSpan){
                                grid[ri][ci+1].titleColSpan++;
                            }else{
                                grid[ri][ci+1].titleColSpan=1;
                            }
                            colInd--;
                        }
                    }else{
                        grid[ri][ci+1].width-=labelItem.width;
                    }
                }
            }
        }
        for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
            for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
                var currentItem=grid[rowIndex][cellIndex];
                if(currentItem==null){
                    if(cellIndex>0&&grid[rowIndex][cellIndex-1]._constructor=="SpacerItem"){
                        grid[rowIndex][cellIndex]=grid[rowIndex][cellIndex-1];
                        if(grid[rowIndex][cellIndex].colSpan==null){
                            grid[rowIndex][cellIndex].colSpan=2;
                        }else{
                            grid[rowIndex][cellIndex].colSpan++;
                        }
                    }else{
                        grid[rowIndex][cellIndex]={
                            _constructor:"SpacerItem"
                        };
                        resultingForm.items.add(grid[rowIndex][cellIndex]);
                    }
                }else if(!resultingForm.items.contains(currentItem)){
                    resultingForm.items.add(currentItem);
                }
                currentItem=grid[rowIndex][cellIndex];
                if(currentItem.rowSpan==null&&rowIndex<(yCoordinates.length-1)){
                    var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding");
                    currentItem.cellHeight=
                        yCoordinates[rowIndex+1]-yCoordinates[rowIndex]-
                        skinCellPadding;
                    var defaultHeight=isc.TextItem.getInstanceProperty("height");
                    defaultHeight+=skinCellPadding;
                    if(Math.abs(defaultHeight-currentItem.cellHeight)<=this.formExtraSpaceThreshold){
                        delete currentItem.cellHeight;
                    }
                    if(currentItem.cellHeight>=3*defaultHeight){
                        currentItem.vAlign="top";
                        currentItem.titleVAlign="top";
                    }
                    if(currentItem._constructor=="ButtonItem"){
                        delete currentItem.cellHeight;
                    }
                }
            }
            for(var i=resultingForm.items.length-1;i>=0;i--){
                if(resultingForm.items[i]._constructor=="SpacerItem"){
                    resultingForm.items.removeAt(i);
                    if(rowIndex!=(yCoordinates.length-1)){
                        resultingForm.items[resultingForm.items.length-1].endRow=true;
                    }
                }else{
                    break;
                }
            }
        }
        var calculatedFormHeight=0;
        var textAreaItemFound=false;
        var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding");
        var defaultHeight=isc.TextItem.getInstanceProperty("height");
        for(var i=0;i<grid.length;i++){
            var item=grid[i][0];
            if(item==null)continue;
            if(i>0&&item==grid[i-1][0])continue;
            var itemHeight=0;
            var cellHeight;
            if(item._constructor=="TextAreaItem"){
                textAreaItemFound=true;
                itemHeight=item.height;
            }else if(item._constructor=="SpacerItem"){
                for(var j=0;j<grid[i].length;j++){
                    if(grid[i][j]._constructor!="SpacerItem"){
                        item=grid[i][j];
                        if(item._constructor=="TextAreaItem"){
                            textAreaItemFound=true;
                            itemHeight=item.height;
                        }else{
                            if(isc[item._constructor])itemHeight=
                                isc[item._constructor].getInstanceProperty("height");
                            cellHeight=item.cellHeight;
                        }
                        break;
                    }
                }
            }else{
                if(isc[item._constructor])itemHeight=isc[item._constructor].getInstanceProperty("height");
                cellHeight=item.cellHeight;
            }
            if(itemHeight==null||itemHeight==0)itemHeight=defaultHeight;
            calculatedFormHeight+=(2*skinCellPadding)+(cellHeight!=null?Math.max(itemHeight,cellHeight):itemHeight);
            if(item.showTitle&&item.titleOrientation=="top"){
                calculatedFormHeight+=17;
            }
        }
        if(textAreaItemFound){
            resultingForm.calculatedHeight=calculatedFormHeight;
        }
        if(grid.length>0)formHeight+=skinCellPadding;
        var widths=[];
        for(var cellIndex=0;cellIndex<xCoordinates.length;cellIndex++){
            var maxTitleWidth=0;
            for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
                if(grid[rowIndex][cellIndex].titleWidth!=null){
                    if(cellIndex==0){
                        maxTitleWidth=Math.max(maxTitleWidth,grid[rowIndex][cellIndex].titleWidth);
                    }else{
                        var tw=xCoordinates[cellIndex]-xCoordinates[cellIndex-1]-
                                 grid[rowIndex][cellIndex-1].width;
                        if(maxTitleWidth==0){
                            maxTitleWidth=tw;
                        }else{
                            maxTitleWidth=Math.min(maxTitleWidth,tw);
                        }
                    }
                }
            }
            if(maxTitleWidth>0){
                if(cellIndex!=0){
                    widths[widths.length-1]-=maxTitleWidth;
                }else{
                    resultingForm.absX-=maxTitleWidth;
                }
                for(var rowIndex=0;rowIndex<yCoordinates.length;rowIndex++){
                    if(grid[rowIndex][cellIndex].titleWidth==null){
                        if(grid[rowIndex][cellIndex]._constructor=="ButtonItem"){
                            var ci=resultingForm.items.indexOf(grid[rowIndex][cellIndex]);
                            var prevItem=resultingForm.items[ci-1];
                            if(cellIndex>0&&prevItem._constructor=="SpacerItem"){
                                if(prevItem.colSpan==null){
                                    prevItem.colSpan=2;
                                }else{
                                    prevItem.colSpan++;
                                }
                            }else{
                                resultingForm.items.addAt({
                                    _constructor:"SpacerItem"
                                },ci);
                            }
                        }else{
                            if(grid[rowIndex][cellIndex].colSpan==null){
                                grid[rowIndex][cellIndex].colSpan=2;
                            }else{
                                grid[rowIndex][cellIndex].colSpan++;
                            }
                        }
                    }
                }
                widths.add(maxTitleWidth);
            }
            if(cellIndex==xCoordinates.length-1){
                widths.add(formWidth-xCoordinates[cellIndex]);
            }else{
                widths.add(xCoordinates[cellIndex+1]-xCoordinates[cellIndex]);
            }
        }
        for(var i=0;i<formItems.length;i++){
            delete formItems[i].titleWidth;
        }
        var colWidths="";
        resultingForm.width=0;
        for(var j=0;j<widths.length;j++){
            if(j!=widths.length-1){
                colWidths+=widths[j];
                colWidths+=",";
            }else{
                colWidths+="*";
            }
            resultingForm.width+=widths[j];
        }
        for(var j=0;j<grid.length;j++){
            for(var k=0;k<grid[j].length;k++){
                var item=grid[j][k];
                if(item._constructor=="ButtomItem"){
                    continue;
                }
                if(item.width==null||item.width=="*")continue;
                var colWidth=widths[k];
                var colSpan=item.colSpan||item.titleColSpan;
                if(colSpan){
                    for(var cnt=1;cnt<colSpan;cnt++){
                        colWidth+=widths[j+cnt];
                    }
                    k+=colSpan;
                }
                if(Math.abs(colWidth-item.width)<2){
                    item.width="*";
                }
            }
        }
        for(var i=0;i<resultingForm.items.length;i++){
            var item=resultingForm.items[i];
            if(item._constructor=="TextAreaItem"){
                if(item.rowSpan>1&&item.rowSpan!=grid.length){
                    item.height="*";
                }
                if((item.colSpan||1)!=grid[0].length){
                    item.width="*";
                }
            }
        }
        resultingForm.colWidths=colWidths;
        resultingForm.numCols=widths.length;
        resultingForm.height=formHeight;
        var rawHeaders=[];
        for(var i=0;i<formItems.length;i++){
            var item=formItems[i];
            var title=item.title||item.defaultValue||item._constructor;
            rawHeaders.add(title);
        }
        for(var i=0;i<formItems.length;i++){
            var item=formItems[i];
            if(item._constructor=="SpacerItem")continue;
            var title=item.title||item.defaultValue||item._constructor;
            var name=isc.MockDataSource.convertTitleToName(title,this.fieldNamingConvention,rawHeaders);
            var actualName=name;
            var iter=0;
            do{
                var wasSame=false;
                for(var j=0;j<items.length;j++){
                    if(items[j].name==actualName){
                        iter++;
                        actualName=name+iter;
                        wasSame=true;
                        break;
                    }
                }
            }while(wasSame);
            item.name=actualName;
        }
        return resultingForm;
    }
,isc.A.removeExtraContainers=function isc_MockupImporter_removeExtraContainers(layout,containers){
        var changed;
        do{
            changed=false;
            for(var i=0;i<containers.length;i++){
                var container=containers[i];
                if(container.contained.length==1&&
                    (this._additionalLayouts.contains(container._constructor)||
                     "Canvas"==container._constructor&&
                     container.contained[0]._constructor=="DynamicForm")&&
                    !(container.overflow&&container.contained[0]._constructor!="ListGrid"))
                {
                    var first=container.contained[0];
                    for(var j=0;j<containers.length;j++){
                        var index=containers[j].contained.indexOf(container);
                        if(index>=0){
                            var second=containers[j].contained[index];
                            var lm=first.left;
                            var tm=first.top;
                            var bm=container.height-tm-first.height;
                            var rm=container.width-lm-first.width;
                            if(!first.specialProperties)first.specialProperties={};
                            var sp=first.specialProperties;
                            sp.lm=(sp.lm||0)+lm;
                            sp.tm=(sp.tm||0)+tm;
                            sp.bm=(sp.bm||0)+bm;
                            sp.rm=(sp.rm||0)+rm;
                            var isFirstHorizontal=first._constructor=="HStack"||
                                first._constructor=="HLayout";
                            var isSecondHorizontal=second._constructor=="HStack"||
                                second._constructor=="HLayout";
                            var isContainerHorizontal=container._constructor=="HStack"||
                                container._constructor=="HLayout";
                            if(isFirstHorizontal&&isSecondHorizontal&&!isContainerHorizontal||
                                (!isFirstHorizontal&&!isSecondHorizontal))
                            {
                                first.extraSpace=(first.extraSpace||0)+
                                    (containers[j].contained[index].extraSpace||0);
                            }else{
                                first.extraSpace=containers[j].contained[index].extraSpace||0;
                            }
                            if(first.extraSpace==0){
                                delete first.extraSpace;
                            }
                            var fieldsToCopy=["border","width","height","top","left",
                                                "isGroup","groupTitle","markupContained"];
                            var specialFieldsToCopy=["measuredW","measuredH",
                                                       "overrideWidth","top","left"];
                            for(var cnt=0;cnt<fieldsToCopy.length;cnt++){
                                if(container[fieldsToCopy[cnt]]){
                                    first[fieldsToCopy[cnt]]=
                                        container[fieldsToCopy[cnt]];
                                }
                            }
                            if(container.specialProperties&&container.contained[0].specialProperties){
                                if((container.specialProperties.controlName=="com.balsamiq.mockups::Canvas"||
                                     container.specialProperties.controlName=="com.balsamiq.mockups::FieldSet")&&
                                    first._constructor=="DynamicForm")
                                {
                                    specialFieldsToCopy.add("controlName");
                                }
                                for(var cnt=0;cnt<specialFieldsToCopy.length;cnt++){
                                    first.specialProperties[specialFieldsToCopy[cnt]]=
                                        container.specialProperties[specialFieldsToCopy[cnt]];
                                }
                            }
                            if(container.showResizeBar){
                                container.contained[0].showResizeBar=container.showResizeBar;
                            }
                            containers[j].contained[index]=container.contained[0];
                            layout.remove(container);
                            if(first.markupContained&&container.contained[0].markupContained.length>0){
                                first.contained=[];
                                containers.set(i,container.contained[0])
                            }else{
                                containers.removeAt(i);
                                i--;
                            }
                            changed=true
                            break;
                        }
                    }
                    var specialProperties=container.specialProperties,
                        controlName=specialProperties&&specialProperties.controlName;
                    if(!changed&&controlName!="com.balsamiq.mockups::BrowserWindow"){
                        if(container.top)first.top=(first.top||0)+container.top;
                        if(container.left)first.left=(first.left||0)+container.left;
                        if(container.width)first.width=container.width;
                        if(container.height)first.height=container.height;
                        if(container.border)first.border=container.border;
                        if(container.zIndex)first.zIndex=container.zIndex;
                        if(container.isGroup)first.isGroup=container.isGroup;
                        if(container.groupTitle)first.groupTitle=container.groupTitle;
                        if(container.markupContained){
                            first.markupContained=container.markupContained;
                        }
                        if(specialProperties){
                            if(!first.specialProperties)first.specialProperties={};
                            first.specialProperties.fullHeight=specialProperties.fullHeight;
                            first.specialProperties.fullWidth=specialProperties.fullWidth;
                        }
                        delete first.extraSpace;
                        delete first.autoDraw;
                        layout.remove(container);
                        if(first.markupContained&&first.markupContained.length>0){
                            first.contained=[];
                            containers.set(i,first)
                        }else{
                            containers.removeAt(i);
                            i--;
                        }
                        changed=true
                    }
                }
            }
        }while(changed);
        return layout;
    }
);
isc.evalBoundary;isc.B.push(isc.A.processValuesManagers=function isc_MockupImporter_processValuesManagers(layout,containers){
        for(var i=0;i<containers.length;i++){
            if(containers[i].specialProperties!=null&&
                containers[i].specialProperties.controlName!=null&&
                containers[i].specialProperties.controlName.startsWith("com.balsamiq.mockups::")&&
                containers[i]._constructor!="DynamicForm")
            {
                var forms=this.findDynamicFormsRecursively(containers[i]);
                if(forms.length>1){
                    var vm={
                        _constructor:"ValuesManager",
                        ID:"ValuesManager"+i
                    };
                    this.globalIDs.push(vm.ID);
                    for(var j=0;j<forms.length;j++){
                        forms[j].valuesManager=vm.ID;
                        if(forms[j].specialProperties.additionalElements==null){
                            forms[j].specialProperties.additionalElements=[];
                        }
                        forms[j].specialProperties.additionalElements.add(vm);
                    }
                    layout.addAt(vm,0);
                }
                var items=[];
                for(var j=0;j<forms.length;j++){
                    items.addList(forms[j].items);
                }
                var rawHeaders=[];
                for(var j=0;j<items.length;j++){
                    var item=items[j];
                    var title=item.title||item.defaultValue||item._constructor;
                    rawHeaders.add(title);
                }
                for(var j=0;j<items.length;j++){
                    var item=items[j];
                    if(item._constructor=="SpacerItem")continue;
                    var title=item.title||item.defaultValue||item._constructor;
                    var name=isc.MockDataSource.convertTitleToName(title,this.fieldNamingConvention,rawHeaders);
                    var actualName=name;
                    var iter=0;
                    do{
                        var wasSame=false;
                        for(var k=0;k<items.length;k++){
                            if(items[k].name==actualName){
                                iter++;
                                actualName=name+iter;
                                wasSame=true;
                                break;
                            }
                        }
                    }while(wasSame);
                    item.name=actualName;
                    if(item._constructor=="CheckboxItem"&&item.showTitle==false&&
                        item.colSpan==2)
                    {
                        delete item.showTitle;
                        delete item.colSpan;
                    }
                }
            }
        }
        return layout;
    }
,isc.A.findDynamicFormsRecursively=function isc_MockupImporter_findDynamicFormsRecursively(container){
        var resultingArray=[];
        for(var i=0;i<container.contained.length;i++){
            var widget=container.contained[i];
            if(widget._constructor=="DynamicForm"&&(widget.items!=null||widget.fields!=null)){
                resultingArray.add(widget);
            }
            if(this._additionalLayouts.contains(widget._constructor)||
                (widget._constructor=="DynamicForm"&&widget.items==null&&widget.fields==null))
            {
                resultingArray.addAll(this.findDynamicFormsRecursively(widget));
            }
        }
        return resultingArray;
    }
,isc.A.processAddingToContainersHeuristic=function isc_MockupImporter_processAddingToContainersHeuristic(layout,containers){
        var transformRules=this._transformRules;
        this.cleanZIndexParam(layout,containers);
        for(var i=0;i<containers.length;i++){
            this.processRemoveWidths(layout,containers,containers[i]);
            var widgetProperties=transformRules.widgetPropertyTranslations[containers[i].specialProperties.controlName];
            var widgetsContainer=null;
            if(containers[i].markupContained!=null&&containers[i].markupContained.length>0){
                widgetsContainer={
                    _constructor:"VStack",
                    ID:"VStack"+i,
                    position:"absolute",
                    top:0,
                    autoDraw:false,
                    width:"100%",
                    height:"100%",
                    zIndex:containers[i].zIndex,
                    members:[]
                };
                var childCanvas={
                    _constructor:"Canvas",
                    height:"100%",
                    width:"100%",
                    autoDraw:false,
                    children:[this._getRefCanvas(widgetsContainer)]
                }
                for(var j=0;j<containers[i].markupContained.length;j++){
                    containers[i].markupContained[j].position="absolute";
                    childCanvas.children.add(
                        this._getRefCanvas(containers[i].markupContained[j]));
                }
                widgetProperties.addChild(containers[i],childCanvas,layout);
                layout.addAt(widgetsContainer,layout.indexOf(containers[i]));
            }
            var container=containers[i];
            this.processLayoutMargin(layout,containers,container,widgetsContainer);
            if(container.contained.length==1&&
                (container._constructor=="TabSet"||container._constructor=="SectionStack")&&
                container.verticalScrollBar!=null&&
                container.contained[0]._constructor=="VStack")
            {
                container.contained[0]._constructor="VLayout";
                container.contained[0].overflow="auto";
                delete container.verticalScrollBar;
            }
            for(var j=0;j<container.contained.length;j++){
                var widget=container.contained[j];
                widget.autoDraw="false";
                if(widgetsContainer!=null){
                    widgetsContainer.members.add(this._getRefCanvas(widget));
                }else{
                    widgetProperties.addChild(container,this._getRefCanvas(widget),layout);
                }
                if(widget._constructor=="DynamicForm"&&(widget.items!=null||widget.fields!=null)){
                    var items=widget.items||widget.fields;
                    for(var k=0;k<items.length;k++){
                        var item=items[k];
                        delete item.left;
                        delete item.top;
                        if(!this.tallFormItems.contains(item._constructor)&&
                            !this.tallFormItems.contains(item.type)&&
                            ("SelectItem"!=item._constructor||item.multipleAppearance!="grid"))
                        {
                            delete item.height;
                        }else if(item._constructor=="ButtonItem"){
                            if(Math.abs(item.height-this.defaultButtonSize)<=this.buttonMinimumChangeSize){
                                delete item.height;
                            }
                        }
                    }
                }
            }
            if(container.headerContained!=null){
                container.headerContained.sort(function(a,b){
                    return a.control.left-b.control.left;
                });
                for(var j=0;j<container.headerContained.length;j++){
                    if(j>0&&
                        container.headerContained[j].control.specialProperties.controlName=="com.balsamiq.mockups::VSplitter"||
                        container.headerContained[j].control.specialProperties.controlName=="com.balsamiq.mockups::VRule")
                    {
                        container.headerContained[j-1].control.showResizeBar=true;
                        container.overflow="auto";
                        layout.remove(container.headerContained[j].control);
                        container.headerContained.removeAt(j);
                        j--;
                        continue;
                    }
                    delete container.headerContained[j].control.height;
                    delete container.headerContained[j].control.zIndex;
                    delete container.headerContained[j].control.top;
                    delete container.headerContained[j].control.left;
                    container.headerContained[j].control.autoDraw="false";
                    if(widgetProperties.addControl){
                        widgetProperties.addControl(container,{
                            controlAreaName:container.headerContained[j].controlAreaName,
                            control:this._getRefCanvas(container.headerContained[j].control)
                            }
                        );
                    }else{
                        isc.logWarn("no add control method for "+
                            containers[i].specialProperties.controlName+" unable to add "+
                            isc.echoAll(container.headerContained[j].control));
                    }
                }
            }
            if(container._constructor!="DynamicForm"&&
                container._constructor!="Canvas"&&
                (container.markupContained==null||container.markupContained.length==0))
            {
                for(var j=0;j<container.contained.length;j++){
                    var widget=container.contained[j];
                    if(widget._constructor=="Label"){
                        var horiz=container._constructor=="HStack"||container._constructor=="HLayout";
                        if(widget.specialProperties.align&&widget.specialProperties.align=="center"){
                            widget.align=widget.specialProperties.align;
                        }
                        if(!horiz&&widget.left>this.stackContainerFillInset){
                            widget.width+=widget.left;
                            if(!widget.align)widget.align="right";
                        }
                        if(horiz&&widget.top>this.stackContainerFillInset){
                            widget.height+=widget.top;
                            widget.valign="bottom";
                        }
                    }
                    delete widget.left;
                    delete widget.top;
                }
            }
            if(container.fake){
                if(container.layoutLeftMargin==null){
                    container.layoutLeftMargin=0;
                }
                if(container.layoutTopMargin==null){
                    container.layoutTopMargin=0;
                }
                if(container.contained.length==1&&container.markupContained==0){
                    container.contained[0].left=container.left+container.layoutLeftMargin;
                    container.contained[0].top=container.top+container.layoutTopMargin;
                    if(container.contained[0].specialProperties){
                        delete container.contained[0].specialProperties.fullWidth;
                        delete container.contained[0].specialProperties.fullHeight;
                    }
                    delete container.contained[0].autoDraw;
                    layout.remove(container);
                }else{
                    container.left=container.left+container.layoutLeftMargin;
                    container.top=container.top+container.layoutTopMargin;
                    delete container.layoutLeftMargin;
                    delete container.layoutTopMargin;
                    delete container.fake;
                }
            }
        }
        if(this.fillSpace){
            var rootLayout=null;
            for(var i=0;i<containers.length;i++){
                var root=true;
                for(var j=0;j<containers.length;j++){
                    if(containers[j].contained.contains(containers[i])){
                        root=false;
                        break;
                    }
                }
                if(root){
                    for(var j=0;j<layout.length;j++){
                        if(containers.contains(layout[j]))continue;
                        var sp=layout[j].specialProperties;
                        if(sp){
                            if(sp.refs==null||sp.refs.length==0){
                                root=false;
                            }
                        }
                    }
                }
                if(root){
                    if(rootLayout!=null){
                        rootLayout=null;
                        break;
                    }else{
                        rootLayout=containers[i];
                    }
                }
            }
            if(rootLayout!=null&&
                ((this._additionalLayouts.contains(rootLayout._constructor)||
                 "SectionStack"==rootLayout._constructor||
                ((rootLayout._constructor=="Window"||
                  rootLayout._constructor=="Canvas")&&rootLayout.contained.length==1&&
                  this._additionalLayouts.contains(rootLayout.contained[0]._constructor)&&
                  ((rootLayout.contained[0].width==null||rootLayout.contained[0].width=="100%")&&
                   (rootLayout.contained[0].height==null||rootLayout.contained[0].height=="100%"))
                ))||
                (rootLayout._constructor=="TabSet")))
            {
                rootLayout.width="100%";
                rootLayout.height="100%";
                delete rootLayout.left;
                delete rootLayout.top;
            }
        }
        for(var i=0;i<containers.length;i++){
            containers[i].specialProperties.innerItems=[];
            containers[i].specialProperties.innerItems.addList(containers[i].contained);
            containers[i].specialProperties.innerItems.addList(containers[i].headerContained);
            containers[i].specialProperties.innerItems.addList(containers[i].markupContained);
            delete containers[i].contained;
            delete containers[i].headerContained;
            delete containers[i].markupContained;
        }
        return layout;
    }
,isc.A._getRefCanvas=function isc_MockupImporter__getRefCanvas(widget){
        var refCanvas={
            _constructor:"Canvas",
            ref:widget.ID
        };
        if(widget.specialProperties==null){
            widget.specialProperties={};
        }
        if(widget.specialProperties.refs==null){
            widget.specialProperties.refs=[];
        }
        widget.specialProperties.refs.add(refCanvas);
        return refCanvas;
    }
,isc.A.cleanZIndexParam=function isc_MockupImporter_cleanZIndexParam(layout,containers){
        var _this=this;
        var checkAndCleanZIndex=function(container,absEl){
            var els=_this.getAllChildItems(container);
            for(var j=0;j<els.length;j++){
                var widEl=els[j];
                var wWidth=widEl.width;
                if(wWidth==null&&widEl.specialProperties!=null){
                    wWidth=widEl.specialProperties.measuredWidth;
                }
                var wHeight=widEl.height;
                if(wHeight==null&&widEl.specialProperties!=null){
                    wHeight=widEl.specialProperties.measuredHeight;
                }
                if(wHeight!=null&&wWidth!=null&&
                    widEl.absX!=null&&widEl.absY!=null&&
                    absEl.absX<(widEl.absX+wWidth)&&
                    (absEl.absX+absEl.width)>widEl.absX&&
                    absEl.absY<(widEl.absY+wHeight)&&
                    (absEl.absY+absEl.height)>widEl.absY)
                {
                    absEl.doNotRemoveIndex=true;
                }
            }
            if(absEl.doNotRemoveIndex){
                delete absEl.doNotRemoveIndex;
            }else{
                delete absEl.zIndex;
            }
        }
        for(var i=0;i<containers.length;i++){
            var noParent=true;
            for(var j=0;j<containers.length;j++){
                if(containers[j].contained!=null&&
                        containers[j].contained.contains(containers[i]))
                {
                    noParent=false;
                    break;
                }
            }
            if(noParent)delete containers[i].zIndex;
            if(containers[i].markupContained!=null){
                for(var k=0;k<containers[i].markupContained.length;k++){
                    var absEl=containers[i].markupContained[k];
                    checkAndCleanZIndex(containers[i],absEl);
                }
            }
            for(var j=0;j<containers[i].contained.length;j++){
                if(containers[i].children==null){
                    delete containers[i].contained[j].zIndex;
                }else{
                    checkAndCleanZIndex(containers[i],containers[i].contained[j]);
                }
            }
        }
    }
,isc.A.processLayoutMargin=function isc_MockupImporter_processLayoutMargin(layout,containers,container,widgetsContainer){
        var maxLayoutMargin=10000;
        var minLeftMargin=maxLayoutMargin+1;
        var minTopMargin=maxLayoutMargin+1;
        var minRightMargin=maxLayoutMargin+1;
        var minBottomMargin=maxLayoutMargin+1;
        var horiz=container._constructor=="HStack"||container._constructor=="HLayout";
        var wHeight=this.getControlHeightUsingItsParents(containers,container);
        var wWidth=this.getControlWidthUsingItsParents(containers,container);
        var parentContainer=this.getParent(layout,container);
        for(var j=0;j<container.contained.length;j++){
            var c=container.contained[j];
            if(horiz){
                if(j==0&&c.left)minLeftMargin=Math.min(minLeftMargin,c.left);
                if(c.top!=null){
                    minTopMargin=Math.min(minTopMargin,c.top);
                    if(c.height&&wHeight){
                        minBottomMargin=Math.min(minBottomMargin,wHeight-c.top-c.height-1);
                    }
                }
                if(j==(container.contained.length-1)&&c.left&&wWidth&&c.width){
                    minRightMargin=Math.min(minRightMargin,(wWidth-c.left-c.width-1));
                }
            }else{
                if(j==0&&c.top)minTopMargin=Math.min(minTopMargin,c.top);
                if(c.left!=null){
                    minLeftMargin=Math.min(minLeftMargin,c.left);
                    if(wWidth&&c.width){
                        minRightMargin=Math.min(minRightMargin,(wWidth-c.left-c.width-1));
                    }
                }
                if(j==(container.contained.length-1)&&c.top&&wHeight&&c.height){
                    minBottomMargin=Math.min(minBottomMargin,(wHeight-c.top-c.height-1));
                }
            }
        }
        for(var j=0;j<container.contained.length;j++){
            var c=container.contained[j];
            if(this._additionalLayouts.contains(c._constructor)||
                "DynamicForm"==c._constructor)
            {
                var lm=0;
                var tm=0;
                var rm=0;
                if(horiz){
                    if(j==0&&c.left!=null){
                        lm=c.left-minLeftMargin;
                    }else if(j!=0&&container.contained[j-1].showResizeBar&&
                            container.contained[j-1].extraSpace){
                        lm=container.contained[j-1].extraSpace-12;
                        delete container.contained[j-1].extraSpace;
                    }
                    if(c.top!=null){
                        tm=c.top-minTopMargin;
                    }
                    if(j==(container.contained.length-1)&&c.left!=null&&wWidth!=null&&c.width!=null){
                        rm=wWidth-c.left-c.width-minRightMargin;
                    }
                }else{
                    if(c.left!=null){
                        lm=c.left-minLeftMargin;
                    }
                    if(j==0&&c.top!=null){
                        tm=c.top-minTopMargin;
                    }else if(j!=0&&container.contained[j-1].showResizeBar&&
                            container.contained[j-1].extraSpace){
                        tm=container.contained[j-1].extraSpace-12;
                        delete container.contained[j-1].extraSpace;
                    }
                    if(c.left!=null&&wWidth!=null&&c.width!=null){
                        rm=wWidth-c.left-c.width-minRightMargin;
                    }
                }
                lm+=c.specialProperties.lm||0;
                rm+=c.specialProperties.rm||0;
                tm+=c.specialProperties.tm||0;
                if("DynamicForm"==c._constructor){
                    var minPadding=Math.min(lm,Math.min(rm,tm));
                    if(minPadding>0){
                        c.padding=minPadding;
                        lm-=minPadding;
                        tm-=minPadding;
                        rm-=minPadding
                    }
                    var isHorizontal=container._constructor=="HStack"||
                        container._constructor=="HLayout";
                    if(!isHorizontal&&j>0&&tm>0){
                        container.contained[j-1].extraSpace=
                            (container.contained[j-1].extraSpace||0)+tm;
                    }else{
                        var skinCellPadding=isc.ListGrid.getInstanceProperty("cellPadding");
                        tm-=skinCellPadding;
                        if(c.items&&tm>3){
                            c.items.addAt({
                                type:"SpacerItem",
                                height:tm,
                                colSpan:"*"
                            },0);
                        }
                    }
                }else{
                    if(lm>0&&c.layoutLeftMargin==null)c.layoutLeftMargin=lm;
                    if(tm>0&&c.layoutTopMargin==null)c.layoutTopMargin=tm;
                    if(rm>0&&c.layoutRightMargin==null)c.layoutRightMargin=rm;
                }
            }
        }
        if(container._constructor=="SectionStack"&&
            ((minLeftMargin>0&&minLeftMargin<=maxLayoutMargin)||
            (minTopMargin>0&&minTopMargin<=maxLayoutMargin)||
            (minRightMargin>0&&minRightMargin<=maxLayoutMargin)||
            (container.membersMargin!=null)))
        {
            var c={
                ID:container.ID+"_VStack",
                _constructor:"VStack",
                autoDraw:false,
                contained:container.contained,
                specialProperties:{
                    controlName:"Stack"
                }
            };
            containers.addAt(c,containers.indexOf(container)+1);
            layout.addAt(c,widgetsContainer?layout.indexOf(widgetsContainer):layout.indexOf(container));
            if(container.membersMargin){
                c.membersMargin=container.membersMargin;
                delete container.membersMargin;
            }
            container.contained=[c];
        }
        if(parentContainer&&parentContainer._constructor=="SectionStack")
        {
            minRightMargin=0;
            minBottomMargin=0;
            delete container.layoutRightMargin;
            delete container.layoutBottomMargin;
        }
        if((minLeftMargin>0&&minLeftMargin<=maxLayoutMargin)||
            (minTopMargin>0&&minTopMargin<=maxLayoutMargin)||
            (minRightMargin>0&&minRightMargin<=maxLayoutMargin)||
            (minBottomMargin>0&&minBottomMargin<=maxLayoutMargin))
        {
            var c=null;
            if(widgetsContainer!=null){
                c=widgetsContainer;
            }else if(container._constructor=="Window"){
                c={};
                container.bodyDefaults=c;
            }else if(container._constructor=="SectionStack"){
                c=container.contained[0];
            }else{
                c=container;
            }
            if(c!=null){
                if(container.specialProperties==null){
                    container.specialProperties={};
                }
                container.specialProperties.layoutContainer=c;
                if(c._constructor=="DynamicForm"){
                    var avgPadding=Math.round((minLeftMargin+minTopMargin)/2);
                    var maxDiff=10;
                    if(Math.abs(minTopMargin-avgPadding)<maxDiff&&
                        Math.abs(minLeftMargin-avgPadding)<maxDiff&&
                        (avgPadding-minRightMargin)<maxDiff)
                    {
                        c.padding=avgPadding;
                    }
                }else{
                    if(minLeftMargin>0&&minLeftMargin<=maxLayoutMargin){
                        c.layoutLeftMargin=minLeftMargin;
                    }
                    if(minTopMargin>0&&minTopMargin<=maxLayoutMargin){
                        c.layoutTopMargin=minTopMargin;
                    }
                    if(minRightMargin>0&&minRightMargin<=maxLayoutMargin){
                        c.layoutRightMargin=minRightMargin;
                    }
                    if(minBottomMargin>0&&minBottomMargin<=maxLayoutMargin){
                        c.layoutBottomMargin=minBottomMargin;
                    }
                }
            }
        }
    }
,isc.A.processRemoveWidths=function isc_MockupImporter_processRemoveWidths(layout,containers,container){
        var transformRules=this._transformRules;
        var prop=transformRules.widgetPropertyTranslations[container.specialProperties.controlName];
        for(var j=0;j<container.contained.length;j++){
            var control=container.contained[j];
            var fullWidth=null;
            var fullHeight=null;
            var parent=this.getParent(layout,container);
            var specialProperties=control.specialProperties;
            var layoutWidth=this.getControlWidthUsingItsParents(layout,container);
            var lm=0;
            var rm=0;
            var tm=0;
            var bm=0;
            if(specialProperties&&specialProperties.controlName){
                var controlProp=transformRules.widgetPropertyTranslations[control.specialProperties.controlName];
                if(controlProp){
                    var lm=controlProp.getLeftMargin?controlProp.getLeftMargin(control):0;
                    var rm=controlProp.getRightMargin?controlProp.getRightMargin(control):0;
                    var tm=controlProp.getTopMargin?controlProp.getTopMargin(control):0;
                    var bm=controlProp.getLeftMargin?controlProp.getLeftMargin(control):0;
                }
            }
            var controlLeft=specialProperties&&specialProperties.left||control.left;
            var controlTop=specialProperties&&specialProperties.top||control.top;
            if(controlLeft<=(this.stackContainerFillInset+lm)
                &&(control.left+control.width)>=
                (layoutWidth-(this.stackContainerFillInset+rm))||
                ((container._constructor=="VStack"||container._constructor=="VLayout")&&
                (control._constructor=="HStack"||control._constructor=="HLayout")))
            {
                if(!control.specialProperties)control.specialProperties={};
                control.specialProperties.fullWidth=true;
                control.specialProperties.containerName=container._constructor;
                fullWidth=true;
            }
            var layoutHeight=this.getControlHeightUsingItsParents(layout,container);
            if((controlTop<=(this.stackContainerFillInset+tm)
                &&((control.top+control.height)>=
                (layoutHeight-(this.stackContainerFillInset+bm))))||
                ((container._constructor=="HStack"||container._constructor=="HLayout")&&
                 (control._constructor=="VStack"||control._constructor=="VLayout")))
            {
                if(!control.specialProperties)control.specialProperties={};
                control.specialProperties.fullHeight=true;
                control.specialProperties.containerName=container._constructor;
                fullHeight=true;
            }
            if((container._constructor=="TabSet"||
                container._constructor=="Window"||
                container._constructor=="SectionStack"||
                container._constructor=="VStack"||
                container._constructor=="VLayout")&&
                control.width!=null&&
                (control.specialProperties==null||
                 control.specialProperties.overrideWidth==null))
            {
                if(control.left<=this.stackContainerFillInset){
                    control.layoutAlign="left";
                }else if(control.left+control.width>=
                  (container.width-this.stackContainerFillInset-prop.getLeftMargin(container)
                 -prop.getRightMargin(container)))
                {
                    control.layoutAlign="right";
                }else if(Math.abs(control.left+control.width/2-
                  (container.width-prop.getLeftMargin(container)
                 -prop.getRightMargin(container))/2)<=this.stackContainerFillInset)
                {
                    control.layoutAlign="center";
                }else if(control._constructor=="Label"){
                    var margin=control.left-container.left+prop.getLeftMargin(container);
                    if(margin>this.stackContainerFillInset/2){
                        control.align="right";
                    }
                }
                if(!control.layoutAlign&&control.width>10){
                    var smaller=true;
                    for(var i=0;i<container.contained.length;i++){
                        var c=container.contained[i];
                        if(c!=control&&control.width>(c.width*0.85)){
                            smaller=false;
                            break;
                        }
                    }
                    if(smaller){
                        var innerWidth=(container.width-prop.getLeftMargin(container)-prop.getRightMargin(container));
                        var rightSpace=innerWidth-(control.left+control.width);
                        if(control.left>rightSpace)control.layoutAlign="right";
                    }
                }
            }else if((container._constructor=="HStack"||container._constructor=="HLayout")
                &&control.height!=null)
            {
                if(control.top<=this.stackContainerFillInset){
                    control.layoutAlign="top";
                }else if(control.top+control.height>=
                  (container.height-this.stackContainerFillInset-prop.getTopMargin(container)
                 -prop.getBottomMargin(container)))
                {
                    control.layoutAlign="bottom";
                }else if(Math.abs(control.top+control.height/2-
                  (container.height-prop.getTopMargin(container)
                 -prop.getBottomMargin(container))/2)<this.stackContainerFillInset)
                {
                    control.layoutAlign="center";
                }
                if(control._constructor=="Label"&&control.layoutAlign&&
                    control.layoutAlign!="center")
                {
                }
            }
            if(fullWidth&&fullHeight&&container.contained.length>1){
                this.processSnapToHeuristic(layout,container,control);
                break;
            }
        }
    }
,isc.A.processSnapToHeuristic=function isc_MockupImporter_processSnapToHeuristic(layout,container,fullSizeControl){
        var snapToMaxOffset=5;
        for(var i=0;i<container.contained.length;i++){
            var control=container.contained[i];
            if(control!=fullSizeControl){
                if(control.width!=null){
                    var width=this.getControlWidthUsingItsParents(layout,container);
                    if(Math.abs(width-control.width)<=snapToMaxOffset*2){
                    }else if(Math.abs(width-(control.left+control.width))<=snapToMaxOffset){
                       control.snapToHor="R";
                       delete control.left;
                    }else if(Math.abs(width/2-(control.left+control.width/2))<=snapToMaxOffset){
                       control.snapToHor="C";
                       delete control.left;
                    }else if(control.left<=snapToMaxOffset){
                       control.snapToHor="L";
                       delete control.left;
                    }
                }
                if(control.height!=null){
                    var height=this.getControlHeightUsingItsParents(layout,container);
                    if(Math.abs(height-control.height)<=snapToMaxOffset*2){
                    }else if(Math.abs(height-(control.top+control.height))<=snapToMaxOffset){
                       control.snapToVer="B";
                       delete control.top;
                    }else if(Math.abs(height/2-(control.top+control.height/2))<=snapToMaxOffset){
                       control.snapToVer="C";
                       delete control.top;
                    }else if(control.top<=snapToMaxOffset){
                       control.snapToVer="T";
                       delete control.top;
                    }
                }
                var snapTo="";
                if(control.snapToVer!=null){
                    snapTo+=control.snapToVer;
                    delete control.snapToVer;
                    delete control.layoutTopMargin;
                }
                if(control.snapToHor!=null){
                    if(control.snapToVer=="C"){
                        snapTo=control.snapToHor;
                    }else{
                        snapTo+=control.snapToHor;
                    }
                    delete control.snapToHor;
                    delete control.layoutLeftMargin;
                }
                if(container.markupContained==null){
                    container.markupContained=[];
                }
                if(snapTo!=null&&snapTo!=""){
                    control.snapTo=snapTo;
                    container.markupContained.add(control);
                    container.contained.removeAt(i);
                    i--;
                }else{
                    container.markupContained.add(control);
                    container.contained.removeAt(i);
                    i--;
                }
            }
        }
        return layout;
    }
,isc.A.getControlHeightUsingItsParents=function isc_MockupImporter_getControlHeightUsingItsParents(layout,control){
        var height=control.height,
            transformRules=this._transformRules;
        if(height==null){
            var wel=this.getParent(layout,control);
            while(wel!=null&&wel.height==null){
                wel=this.getParent(layout,wel);
            }
            if(wel!=null){
                var prop=transformRules.widgetPropertyTranslations[wel.specialProperties.controlName];
                height=wel.height-prop.getTopMargin(wel)-prop.getBottomMargin(wel);
            }
        }else{
            var prop=transformRules.widgetPropertyTranslations[control.specialProperties.controlName];
            if(prop.getTopMargin!=null&&prop.getBottomMargin!=null){
                height=control.height-prop.getTopMargin(control)-prop.getBottomMargin(control);
            }
        }
        return height;
    }
,isc.A.getControlWidthUsingItsParents=function isc_MockupImporter_getControlWidthUsingItsParents(layout,control){
        var width=control.width,
            transformRules=this._transformRules;
        if(width==null){
            var wel=this.getParent(layout,control);
            while(wel!=null&&wel.width==null){
                wel=this.getParent(layout,wel);
            }
            if(wel!=null){
                var prop=transformRules.widgetPropertyTranslations[wel.specialProperties.controlName];
                width=wel.width-prop.getLeftMargin(wel)-prop.getRightMargin(wel);
            }
        }else{
            var prop=transformRules.widgetPropertyTranslations[control.specialProperties.controlName];
            if(prop.getLeftMargin!=null&&prop.getRightMargin!=null){
                width=control.width-prop.getLeftMargin(control)-prop.getRightMargin(control);
            }
        }
        return width;
    }
,isc.A.getParent=function isc_MockupImporter_getParent(layout,child){
        for(var i=0;i<layout.length;i++){
            if(layout[i].contained!=null&&layout[i].contained.contains(child)){
                return layout[i];
            }
            if(layout[i].children!=null&&layout[i].children.contains(child)){
                return layout[i];
            }
        }
        return null;
    }
,isc.A.processFluidLayoutHeuristic=function isc_MockupImporter_processFluidLayoutHeuristic(layout,containers){
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            var specialProperties=container.specialProperties;
            if(container._constructor=="TabSet"){
                var pane=container.tabs&&container.tabs[container.selectedTab].pane;
                if(pane&&pane.VStack){
                    container=pane.VStack;
                    container._constructor="VStack";
                }
            }
            if((specialProperties&&(specialProperties.fullWidth||specialProperties.fullHeight))||
                    container.height==null||container.height=="100%"||container.width==null||container.width=="100%")
            {
                var breadthProp=(container._constructor=="HStack"||container._constructor=="HLayout"?"height":"width"),
                    lengthProp=(container._constructor=="HStack"||container._constructor=="HLayout"?"width":"height");
                if(container._constructor=="HStack"||container._constructor=="HLayout"||container._constructor=="VStack"){
                    for(var j=0;j<specialProperties.innerItems.length;j++){
                        var widget=specialProperties.innerItems[j],
                            widgetSize=widget[breadthProp],
                            containerSize=container[breadthProp];
                        if(widgetSize>(containerSize-this.stackContainerFillInset)){
                            this.removeWidgetSizeProperty(widget,(breadthProp=="width"));
                        }
                    }
                }
                if(container._constructor=="HStack"||container._constructor=="HLayout"||container._constructor=="VStack"){
                    var widgetToExpand=[];
                    var priority=0;
                    for(var j=0;j<specialProperties.innerItems.length;j++){
                        var widget=specialProperties.innerItems[j];
                        if(widgetToExpand.isEmpty()&&
                            ((widget._constructor=="HLayout"&&container._constructor=="HStack")||
                             (widget._constructor=="VLayout"&&container._constructor=="VStack")))
                        {
                            if(priority!=1){
                                widgetToExpand.clear();
                                priority=1;
                            }
                            widgetToExpand.add(widget);
                        }
                        if(widget._constructor=="ListGrid"&&
                            (widgetToExpand.isEmpty()||priority>=2))
                        {
                            if(priority!=2){
                                widgetToExpand.clear();
                                priority=2;
                            }
                            widgetToExpand.add(widget);
                        }
                        if(widget._constructor=="DynamicForm"&&
                            container._constructor=="VStack"&&
                            (widgetToExpand.isEmpty()||priority>=3))
                        {
                            if(widget.items!=null||widget.fields!=null){
                                var items=widget.items||widget.fields;
                                for(var k=0;k<items.length;k++){
                                    var item=items[k];
                                    if(item._constructor=="TextAreaItem"){
                                        if(priority!=3){
                                            widgetToExpand.clear();
                                            priority=3;
                                        }
                                        widgetToExpand.add(widget);
                                        break;
                                    }
                                }
                            }
                        }
                        if(widget._constructor=="TabSet"&&
                            (widgetToExpand.isEmpty()||priority>=4))
                        {
                            var innerItems=widget.specialProperties&&widget.specialProperties.innerItems,
                                pane=innerItems&&innerItems[0];
                            if(pane&&pane._constructor!="HStack"&&pane._constructor!="VStack"&&
                                    pane.specialProperties&&pane.specialProperties.fullHeight&&pane.specialProperties.fullWidth)
                            {
                                if(priority!=4){
                                    widgetToExpand.clear();
                                    priority=4;
                                }
                                widgetToExpand.add(widget);
                            }
                        }
                        if(widget.specialProperties&&widget.specialProperties.innerItems&&
                            (widgetToExpand.isEmpty()||priority>=5))
                        {
                            var innerItems=widget.specialProperties.innerItems,
                                singleInnerItem=(innerItems.length==1&&innerItems[0]),
                                singleControlName=(
                                    singleInnerItem&&
                                    singleInnerItem.specialProperties!=null&&
                                    singleInnerItem.specialProperties.controlName),
                                singleTagCloud=(singleControlName=="com.balsamiq.mockups::TagCloud");
                            if(!singleTagCloud){
                                if(priority!=5){
                                    widgetToExpand.clear();
                                    priority=5;
                                }
                                widgetToExpand.add(widget);
                            }
                        }
                    }
                    if(!widgetToExpand.isEmpty()){
                        if(widgetToExpand.length>1){
                            var propName=(container._constructor=="HStack"||container._constructor=="HLayout")?"width":"height";
                            var minSize=widgetToExpand[0][propName];
                            var maxSize=widgetToExpand[0][propName];
                            var largestWidget=widgetToExpand[0];
                            for(var ind=1;ind<widgetToExpand.length;ind++){
                                var currentWidget=widgetToExpand[ind];
                                var currentSize=currentWidget[propName];
                                if(currentSize<minSize){
                                    minSize=currentSize;
                                }else if(currentSize>maxSize){
                                    maxSize=currentSize;
                                    largestWidget=currentWidget;
                                }
                            }
                            if(maxSize-minSize<this.stackFlexMaxSizeMatch){
                                for(var ind=0;ind<widgetToExpand.length;ind++){
                                    this.removeWidgetSizeProperty(widgetToExpand[ind],(propName=="width"));
                                }
                            }else{
                                this.removeWidgetSizeProperty(largestWidget,(propName=="width"));
                            }
                        }else{
                            this.removeWidgetSizeProperty(widgetToExpand[0],
                                    (container._constructor=="HStack"||container._constructor=="HLayout"));
                        }
                        if(container._constructor=="HStack"){
                            container._constructor="HLayout";
                        }else if(container._constructor=="VStack"){
                            container._constructor="VLayout";
                        }
                    }
                }
            }
        }
        return layout;
    }
);
isc.evalBoundary;isc.B.push(isc.A.removeWidgetSizeProperty=function isc_MockupImporter_removeWidgetSizeProperty(widget,isWidth){
        if(isWidth){
            delete widget.width;
            if(widget._constructor=="DynamicForm"){
                widget.width="*";
                var items=widget.items||widget.fields;
                if(items){
                    for(var i=0;i<items.length;i++){
                        if(items[i]._constructor=="TextAreaItem"){
                            items[i].width="*";
                        }
                    }
                }
            }
        }else{
            delete widget.height;
            if(widget._constructor=="DynamicForm"){
                var items=widget.items||widget.fields,
                    foundTextAreaItem=false
                ;
                if(items){
                    for(var i=0;i<items.length;i++){
                        if(items[i]._constructor=="TextAreaItem"){
                            items[i].height="*";
                            foundTextAreaItem=true;
                        }
                    }
                    if(foundTextAreaItem)widget.height="*";
                }
            }
        }
    }
,isc.A.processTabVStackHeuristic=function isc_MockupImporter_processTabVStackHeuristic(layout,containers){
        for(var i=0;i<containers.length;i++){
            var container=containers[i];
            if(container._constructor=="TabSet"){
                var tabs=container.tabs;
                for(var j=0;j<tabs.length;j++){
                    var tab=tabs[j];
                    if(tab.pane&&tab.pane.VStack){
                        var pane=tab.pane.VStack,
                            innerItems=container.specialProperties.innerItems
                        ;
                        pane.ID=container.ID+"_pane"+j;
                        if(!pane._constructor)pane._constructor="VStack";
                        if(!pane.specialProperties)pane.specialProperties={};
                        if(!pane.specialProperties.innerItems)pane.specialProperties.innerItems=[];
                        for(var k=0;k<pane.members.length;k++){
                            var item=innerItems.find("ID",pane.members[k]);
                            if(item){
                                innerItems.remove(item);
                                pane.specialProperties.innerItems.add(item);
                            }
                            pane.members[k]={ref:pane.members[k]};
                        }
                        tab.pane=pane.ID;
                        layout.addAt(pane,layout.indexOf(container));
                        innerItems.add(pane);
                    }
                }
            }
        }
        return layout;
    }
,isc.A.logWarn=function isc_MockupImporter_logWarn(message,category){
        this.Super("logWarn",arguments);
        this.warnings+="\n"+message;
    }
);
isc.B._maxIndex=isc.C+75;

isc.ClassFactory.defineClass("BMMLImportDialog",isc.Dialog);
isc.A=isc.BMMLImportDialog.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.showFileNameField=true;
isc.A.showAssetsNameField=true;
isc.A.showOutputField=true;
isc.A.outputFieldTitle="Output File Name";
isc.A.showSkinSelector=true;
isc.A.showImportForm=true;
isc.A.autoSize=true;
isc.A.autoCenter=true;
isc.A.showMinimize=false;
isc.A.title="Import Balsamiq File";
isc.A.showToolbar=false;
isc.A.skin="Enterprise";
isc.A.importFormDefaults={
        _constructor:"FilePickerForm",
        autoDraw:false,
        showPickButton:false,
        showPasteForm:false,
        isGroup:true,
        groupTitle:"Mockup File Location",
        uploadFormProperties:{
            initWidget:function(){
                this.Super("initWidget",arguments);
                if(!this.creator.showAssetsNameField)return;
                var uploadForm=this;
                this.addField({
                    name:"assetsName",
                    title:"Upload assets",
                    editorType:isc.TLinkItem||isc.LinkItem,
                    target:"javascript",
                    defaultValue:"upload an asset file",
                    width:"*",colSpan:"*",
                    startRow:true,
                    canEdit:false,
                    click:function(form,item){
                        var windowClass=isc.TWindow||isc.Dialog;
                        var loadAssetDialog=windowClass.create({
                            title:"Load asset",
                            height:140,
                            width:400,
                            showToolbar:false,
                            autoCenter:true
                        });
                        var _form=form;
                        var loadAssetForm=isc.DynamicForm.create({
                            dataSource:form.dataSource,
                            numCols:3,
                            cellPadding:5,
                            colWidths:"140, 180, *",
                            autoDraw:false,
                            fields:[
                                {
                                    name:"file",
                                    editorType:isc.TFileItem||isc.FileItem,
                                    title:"Asset file",
                                    colSpan:3,
                                    endRow:true
                                },{
                                    type:"SpacerItem"
                                },{
                                    name:"submitButton",
                                    title:"Load",
                                    editorType:isc.TButtonItem||isc.ButtonItem,
                                    endRow:false,
                                    startRow:false,
                                    align:"right",
                                    click:function(assetForm,item){
                                        if(assetForm.getValues().file!=null){
                                            assetForm.getValues().file_dir="[VBWORKSPACE]/assets";
                                            loadAssetDialog.hide();
                                            assetForm.saveData(uploadForm.getID()+
                                                ".uploadAssetCallback(dsResponse, data)");
                                        }else{
                                            isc.warn("Select asset to upload");
                                        }
                                    }
                                },{
                                    name:"cancelButton",
                                    title:"Cancel",
                                    align:"right",
                                    editorType:isc.TButtonItem||isc.ButtonItem,
                                    startRow:false,
                                    click:function(form,item){
                                        loadAssetDialog.hide();
                                    }
                                }
                            ]
                        });
                        loadAssetDialog.addItem(loadAssetForm);
                        loadAssetDialog.show();
                    }
                });
            },
            uploadAssetCallback:function(dsResponse,data,clearFile){
                var form=this;
                var assetFile=data.fileName;
                if(form.assetFiles==null){
                    form.assetFiles=[];
                }
                if(!form.assetFiles.contains(assetFile))
                {
                    form.assetFiles.add(assetFile);
                }
                if(form.assetFiles.length==1){
                    form.setValue("assetsName",
                        form.assetFiles[0]+
                        " (click to upload more)");
                }else{
                    form.setValue("assetsName",
                        form.assetFiles.length+
                        " assets (click to upload more)");
                }
                if(clearFile){
                    form.getField("file").clearValue();
                }
            }
        },
        selectFormProperties:{
            selectFileDialogProperties:{
                actionStripControls:["spacer:10","pathLabel",
                    "previousFolderButton","spacer:10","upOneLevelButton",
                    "spacer:10","refreshButton","spacer:2"],
                title:"Import Balsamiq File",
                initialDir:"[VBWORKSPACE]",
                rootDir:"/",
                webrootOnly:false,
                fileFilters:[{
                    filterName:"BMML Files",
                    filterExpressions:[new RegExp("\\.bmml$")]
                }],
                checkFile:function(fileName){
                    if(fileName.match(/\.(bmml)$/i)==null){
                        isc.say("Only BMML files may be imported (must end with .bmml)");
                        return false;
                    }else{
                        return true;
                    }
                }
            },
            initWidget:function(){
                this.Super("initWidget",arguments);
                this.getField("fileName").setPrompt("Click to select the BMML file you want to import.");
            }
        },
        uploadCallback:function(dsResponse,data){
            var filePath=data.path;
            var fileName=data.fileName;
            var v=this.valuesToSend;
            this.creator.submit(filePath,v.outputFileName,data.file,v.skin,
                v.dropMarkup,v.trimSpace,v.fillSpace,v.fieldNamingConvention,false,true);
        }
    };
isc.A.formsDefaults={
        titleWidth:140,
        cellPadding:6,
        width:"100%"
    };
isc.B.push(isc.A.initWidget=function isc_BMMLImportDialog_initWidget(){
        this.Super("initWidget",arguments);
        this.vm=isc.ValuesManager.create();
        this.vm.setValues({
            uploadFromURL:this.uploadFromURL,
            outputFileName:this.outputFileName,
            skin:this.skin,
            dropMarkup:this.dropMarkup,
            trimSpace:this.trimSpace,
            fillSpace:this.fillSpace,
            fieldNamingConvention:this.fieldNamingConvention
        });
        if(this._fileUploaded!=null&&!this._fileUploaded){
            this.vm.getValues().fileName=this.fileName;
        }
        var showFileNameField=this.showFileNameField;
        var scUploadSaveFileDS=isc.DataSource.get("SCUploadSaveFile");
        var importer=this;
        scUploadSaveFileDS.performCustomOperation("checkUploadFeature",null,
            function(response,data){
                if(response.status==isc.RPCResponse.STATUS_SUCCESS){
                    importer.importForm=importer.createAutoChild("importForm",{
                        visibility:importer.showImportForm?"inherit":"hidden",
                        showSelectForm:importer.showFileNameField,
                        showAssetsNameField:importer.showAssetsNameField,
                        showUploadForm:true,
                        valuesManager:importer.vm,
                        formsProperties:importer.formsDefaults
                    });
                }else{
                    importer.importForm=importer.createAutoChild("importForm",{
                        visibility:importer.showImportForm?"inherit":"hidden",
                        showSelectForm:importer.showFileNameField,
                        showAssetsNameField:false,
                        showUploadForm:false,
                        valuesManager:importer.vm,
                        formsProperties:importer.formsDefaults
                    });
                }
                importer.importForm.setDataSource(scUploadSaveFileDS);
                importer.addItem(importer.importForm);
                importer.addItem(importer._createHeadForm());
                importer.addItem(importer._createFlagsForm());
                importer.addItem(importer._createActionsForm());
            },
            {willHandleError:true}
        );
    }
,isc.A.submit=function isc_BMMLImportDialog_submit(fileName,outputFileName,fileContent,skin,dropMarkup,trimSpace,fillSpace,fieldNamingConvention,autoRefresh,fileUploaded){
    }
,isc.A._createActionsForm=function isc_BMMLImportDialog__createActionsForm(){
        var dialog=this;
        var fields=[{
            name:"fieldNamingConvention",
            editorType:isc.TSelectItem||isc.SelectItem,
            width:175,
            title:"Field Naming Convention",
            defaultValue:"camelCaps",
            hint:"Advanced&nbsp;setting",
            startRow:false,endRow:true,
            valueMap:{
                camelCaps:"camelCaps",
                underscores:"Underscores",
                underscoresAllCaps:"Underscores All Caps",
                underscoresKeepCase:"Underscores Keep Case"
            },
            hoverWidth:200,
            titleHoverHTML:function(item,form){
                return"Naming convention used when translating grid column labels and input "+
                       "field labels to DataSource field identifiers.  This does not affect the "+
                       "appearance or behavior of the imported mockup, just the identifiers "+
                       "used when connecting your imported mockup to real data."+
                       "<P>"+
                       "Choose a naming convention that is similar to how your Java code or "+
                       "database columns are named - hover options in the drop-down list for "+
                       "details."+
                       "<P>"+
                       "If unsure, keep the default of \"camelCaps\".";
            },
            itemHoverHTML:function(item,form){
                var value=item.getValue();
                if(value=="camelCaps"){
                    return"For example, \"First Name\" becomes \"firstName\".  Best setting "+
                           "for binding to Java Beans (including Hibernate and JPA) and databases "+
                           "where columns names have no underscores, for example, \"FIRSTNAME\".";
                }else if(value=="underscores"){
                    return"For example, \"First Name\" becomes \"first_name\".  Best setting for "+
                           "databases that have underscores in column names, for example, "+
                           "\"FIRST_NAME\".";
                }else if(value=="underscoresAllCaps"){
                    return"For example, \"First Name\" becomes \"FIRST_NAME\".  Alternative to "+
                           "\"Underscores\" for developers who prefer field identifiers to be "+
                           "all caps.";
                }else if(value=="underscoresKeepCase"){
                    return"For example, \"First Name\" becomes \"First_Name\".  Alternative to "+
                           "\"Underscores\" for developers who prefer field identifiers to be "+
                           "mixed case.";
                }
            }
        }];
        if(this.showOutputField){
             fields.add({
                 name:"outputFileName",
                 title:this.outputFieldTitle,
                 type:isc.TTextItem||isc.TextItem,
                 width:450,
                 hoverWidth:200,
                 hint:"Optional",
                 itemHoverHTML:function(){
                     return"Writes the source code of the imported screen to the specified "+
                            "path.  If the specified path is relative (does not start with "+
                            "a slash), it is assumed to be relative to webroot/tools.  "+
                            "If the file name ends in 'js' the output is JavaScript, "+
                            "otherwise it's XML.";
                 },
                 titleHoverHTML:function(){
                     return this.itemHoverHTML()
                 }
             });
        }
        fields.add({
            name:"submitButton",
            title:dialog.showImportForm?"Import":"Update",
            type:isc.TButtonItem||isc.ButtonItem,
            width:100,
            colSpan:"3",
            align:"right",
            click:function(form,item){
                var values=isc.addProperties(dialog.vm.getValues());
                if(dialog.importForm.uploadForm){
                    values=isc.addProperties(values,dialog.importForm.uploadForm.getValues());
                }
                var fileUrl=values.fileURL;
                if(values.fileName=='select file'&&values.file==null&&fileUrl==null&&
                    !(dialog._fileUploaded&&dialog.fileName!=null)&&dialog.showImportForm)
                {
                    isc.warn("Select a file to process.");
                }else{
                    if(values.file!=null){
                        values.file_dir="[READ_ONLY]";
                        if(dialog.showAssetsNameField&&
                            (values.file=="symbols.bmml"||
                             values.file.endsWith("\symbols.bmml")))
                        {
                            isc.ask("The file 'symbols.bmml' looks like an asset file. "+
                                "Do you want to convert it or add to assets?",
                                function(value){
                                },{buttons:[
                                    isc.Button.create({
                                        title:"Convert",
                                        click:function(){
                                            this.topElement.hide();
                                            if(dialog.importForm.creator)dialog.importForm.creator.hide();
                                            values.file_dir="[READ_ONLY]";
                                            dialog.importForm.valuesToSend=isc.clone(values);
                                            dialog.importForm.saveData(dialog.importForm.getID()+
                                                ".uploadCallback(dsResponse, data)");
                                        }
                                    }),
                                    isc.Button.create({
                                        title:"Add to assets",
                                        click:function(){
                                            this.topElement.hide();
                                            values.file_dir="[VBWORKSPACE]/assets";
                                            dialog.importForm.valuesToSend=isc.clone(values);
                                            dialog.importForm.saveData(dialog.importForm.getID()+
                                                ".uploadAssetCallback(dsResponse, data, true)");
                                        }
                                    })
                                ]});
                        }else{
                            if(dialog.importForm.creator)dialog.importForm.creator.hide();
                            values.file_dir="[READ_ONLY]";
                            dialog.importForm.valuesToSend=isc.clone(values);
                            if(values.file_dir&&dialog.importForm.uploadForm){
                               dialog.importForm.uploadForm.setValue("file_dir",values.file_dir);
                            }
                            dialog.importForm.saveData(dialog.importForm.getID()+
                                ".uploadCallback(dsResponse, data)");
                        }
                    }else{
                        if(fileUrl!=null){
                            if(!fileUrl.startsWith("http")){
                                fileUrl="http://"+fileUrl;
                            }
                            var regexp=new RegExp("^http(?:s)?://([^/:]+)(?::[0-9]+)?(/.*)?$"),
                                matches=fileUrl.match(regexp),
                                hostname=(matches!=null&&matches[1]!=null?
                                        matches[1].toString():""),
                                mybalsamiq=hostname=="mybalsamiq.com"||
                                             hostname.endsWith(".mybalsamiq.com");
                            if(mybalsamiq){
                                var path=(matches!=null&&matches[2]!=null?
                                            matches[2].toString():""),
                                    offset=fileUrl.length-path.length;
                                if(path!=""&&path!="/"&&!fileUrl.endsWith(".bmml")){
                                    fileUrl+=".bmml";
                                }
                                var j=-1;
                                while((j=path.indexOf("/edit/",j+1))!=-1){
                                    var k=j+offset;
                                    fileUrl=fileUrl.substring(0,k)+fileUrl.substring(k+5);
                                    offset=offset-5;
                                }
                            }
                        }
                        var autoRefresh=fileUrl!=null,
                            fileUploaded=dialog._fileUploaded,
                            fileName=fileUploaded&&values.fileName=="select file"&&
                                                      !values.fileURL&&dialog.fileName;
                        if(!dialog.showImportForm)autoRefresh=true;
                        else fileName=fileName||fileUrl||values.fileName;
                        if(dialog.importForm.creator)dialog.importForm.creator.hide();
                        dialog.submit(fileName,values.outputFileName,null,
                            values.skin,values.dropMarkup,values.trimSpace,
                            values.fillSpace,values.fieldNamingConvention,autoRefresh,fileUploaded);
                    }
                }
            }
        });
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            saveOnEnter:true,
            wrapItemTitles:false,
            width:"100%",
            useAllDataSourceFields:false,
            valuesManager:this.vm,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        },this.formsDefaults,this.formsProperties));
    }
,isc.A._createFlagsForm=function isc_BMMLImportDialog__createFlagsForm(){
        var fields=[];
        fields.addList([
            {
                name:"dropMarkup",
                title:"Drop Markup",
                editorType:isc.TCheckboxItem||isc.CheckboxItem,
                labelAsTitle:true,
                defaultValue:true,
                hoverWidth:200,
                width:"*",
                startRow:true,
                itemHoverHTML:function(){
                    return"If enabled, markup elements such as sticky notes and "+
                        "strikethroughs are dropped during import.";
                },
                titleHoverHTML:function(){
                    return this.itemHoverHTML()
                }
            },
            {
                name:"trimSpace",
                title:"Trim Space",
                editorType:isc.TCheckboxItem||isc.CheckboxItem,
                labelAsTitle:true,
                defaultValue:true,
                hoverWidth:200,
                width:"*",
                itemHoverHTML:function(){
                    return"If enabled, and there is empty space to the left/top of the "+
                        "mockup, the mockup is moved to 0,0 instead.  In combination with "+
                        "dropMarkup, this also means that a mockup with only markup "+
                        "elements to the left/top of it will be moved to 0,0 as part of "+
                        "importing."
                 },
                 titleHoverHTML:function(){
                    return this.itemHoverHTML()
                 }
            },
            {
                name:"fillSpace",
                title:"Fill Space",
                editorType:isc.TCheckboxItem||isc.CheckboxItem,
                labelAsTitle:true,
                defaultValue:true,
                hoverWidth:200,
                width:"*",
                itemHoverHTML:function(){
                    return"If enabled and a mockup-import results in a single "+
                        "layout or single top-level container with a single layout within "+
                        "it, the top-level widget will be set to 100% width and height so "+
                        "that it fills available space.";
                },
                titleHoverHTML:function(){
                    return this.itemHoverHTML()
                }
            },
            {
                editorType:"SpacerItem"
            }
        ]);
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            saveOnEnter:true,
            numCols:7,
            width:"100%",
            wrapItemTitles:false,
            useAllDataSourceFields:false,
            valuesManager:this.vm,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        },this.formsDefaults,this.formsProperties));
    }
,isc.A._createHeadForm=function isc_BMMLImportDialog__createHeadForm(){
        var fields=[];
        if(this.showSkinSelector){
            fields.add({
                name:"skin",
                editorType:isc.TSelectItem||isc.SelectItem,
                width:175,
                title:"Skin",
                defaultValue:this.skin,
                endRow:false,
                valueMap:{
                    Enterprise:"Enterprise",
                    EnterpriseBlue:"Enterprise Blue",
                    Graphite:"Graphite",
                    Simplicity:"Simplicity",
                    fleet:"Fleet",
                    TreeFrog:"TreeFrog",
                    SilverWave:"SilverWave",
                    BlackOps:"Black Ops",
                    SmartClient:"Stone",
                    Cupertino:"Cupertino",
                    standard:"Basic"
                },
                changed:function(form,item,value){
                    var uriBuilder=isc.URIBuilder.create(window.location.href);
                    uriBuilder.setQueryParam("skin",value);
                    window.location.replace(uriBuilder.uri);
                }
            });
        }
        return isc.DynamicForm.create(isc.addProperties({
            autoDraw:false,
            saveOnEnter:true,
            wrapItemTitles:false,
            width:"100%",
            useAllDataSourceFields:false,
            valuesManager:this.vm,
            fields:fields,
            isGroup:true,
            showGroupLabel:false,
            groupBorderCSS:"1px solid transparent"
        },this.formsDefaults,this.formsProperties));
    }
);
isc.B._maxIndex=isc.C+5;

isc.BMMLImportDialog.changeDefaults("bodyDefaults",{
    width:"100%"
});
isc.defineClass("FieldMapper","HStack");
isc.A=isc.FieldMapper.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.width=772;
isc.A.height=380;
isc.A.membersMargin=10;
isc.A.layoutTopMargin=10;
isc.A.description='The "Component Fields" list below shows how your existing fields will be '+
        'connected to new DataSource fields.  Drag fields from the new DataSource to the '+
        'Component Fields grid to create a mapping or add new field. Field names and titles '+
        'can also be edited by Double-clicking on a row.';
isc.B.push(isc.A.initWidget=function isc_FieldMapper_initWidget(){
        this.Super("initWidget",arguments);
        var _this=this;
        var mockDataSource=this.mockDataSource;
        if(isc.isA.DataSource(mockDataSource)){
            this.mockDataSourceFields=mockDataSource.getFields();
        }
        var mockFields=this.mockFields;
        if(mockFields&&mockFields.length>0){
            var fields={};
            for(var i=0;i<mockFields.length;i++){
                fields[mockFields[i].name]=mockFields[i];
            }
            this.mockDataSource={
                fields:fields,
                getFields:function(){
                    return this.fields;
                }
            };
        };
        this.targetDataSourceList=isc.ListGrid.create({
            width:(this.width-20)/2,
            height:"100%",
            alternateRecordStyles:true,
            fields:[
                {name:"name",title:"Name"},
                {name:"title",title:"Title"},
                {name:"type",title:"Type"},
                {name:"inUse",title:"Used?",type:"boolean",
                    showValueIconOnly:true,
                    valueIcons:{
                        true:"[SKINIMG]actions/approve.png",
                        false:"[SKINIMG]blank.gif"
                    }
                }
            ],
            canDragRecordsOut:true,
            dragDataAction:"copy",
            autoDraw:false,
            selectionUpdated:function(record,recordList){
                _this._moveLeft.setDisabled(recordList.length==0);
            },
            updateInUseFields:function(value,oldValue){
                if(oldValue){
                    this.setValue(oldValue,false);
                }
                this.setValue(value,true);
                var fields=_this.targetDataSource.getFields();
                var cbMap=[];
                for(var i=0;i<this.data.length;i++){
                    if(!this.data[i].inUse){
                        cbMap.add(this.data[i].name);
                    }
                }
                _this._mockupDataSourceList.getField("mappedTo").valueMap=cbMap;
            },
            setValue:function(name,value){
                for(var i=0;i<this.data.length;i++){
                   if(this.data[i].name==name){
                       this.data[i].inUse=value;
                       this.redraw();
                       return;
                   }
                };
            }
        });
        this._mockupDataSourceList=isc.ListGrid.create({
            width:(this.width-20)/2,
            height:"100%",
            alternateRecordStyles:true,
            fields:[
                {name:"name",title:"Name"},
                {name:"title",title:"Title"},
                {name:"mappedTo",title:"Mapped To",type:"SelectItem",
                    change:function(form,item,value,oldValue){
                        _this.targetDataSourceList.updateInUseFields(value,oldValue)
                    }
                }
            ],
            canReorderRecords:true,
            canAcceptDroppedRecords:true,
            canRemoveRecords:true,
            selectionUpdated:function(record,recordList){
                _this._moveUp.setDisabled(recordList.length==0);
                _this._moveDown.setDisabled(recordList.length==0);
            },
            getCellCSSText:function(record,rowNum,colNum){
                return(record.origName&&record.origName!=record.name&&colNum==this.getFieldNum("name")?this.editPendingCSSText:"");
            },
            removeRecordClick:function(rowNum){
                var record=this.getRecord(rowNum),
                    mappedTo=record&&record.mappedTo;
                this.Super("removeRecordClick",arguments);
                _this.targetDataSourceList.updateInUseFields(null,mappedTo);
            },
            _transferRecord:function(dropRecord,targetRecord){
                for(var i=0;i<this.data.length;i++){
                    if(this.data[i].mappedTo==dropRecord.name){
                        delete this.data[i].mappedTo;
                        break;
                    }
                 };
                if(targetRecord==null){
                    targetRecord=this.data.find("name",dropRecord.name);
                }
                var targetList=_this.targetDataSourceList;
                if(targetRecord==null){
                    var newRec=isc.clone(dropRecord);
                    newRec.mappedTo=newRec.name;
                    this.data.add(newRec);
                    targetList.updateInUseFields(newRec.name);
                    return;
                }
                targetList.updateInUseFields(dropRecord.name,targetRecord.mappedTo);
                targetRecord.mappedTo=dropRecord.name;
            },
            transferRecords:function(dropRecords,targetRecord,index,sourceWidget){
                if(this==sourceWidget){
                    this.Super("transferRecords",arguments);
                    return;
                }
                if(index==null)index=this.getRecordIndex(targetRecord);
                for(var i=0;i<dropRecords.length;i++){
                    this._transferRecord(dropRecords[i],index<0?null:
                                          this.getRecord(index+i));
                }
                this.redraw();
            },
            recordDrop:function(dropRecords,targetRecord,index,sourceWidget){
                if(this==sourceWidget){
                    this.Super("recordDrop",arguments);
                    return;
                }
                var targetRecord=this.getRecord(this.hilitedRecord);
                return this.transferRecords(dropRecords,targetRecord,null,sourceWidget);
            },
            dropMove:function(){
                this.hilitedRecord=this.getEventRecordNum();
                if(this.hilitedRecord==-2){
                    delete this.hilitedRecord;
                    this.clearLastHilite();
                }else{
                    this._hiliteRecord(this.hilitedRecord);
                }
            },
            canEdit:true,
            modalEditing:true,
            autoDraw:false
        });
        this._mapperConfig=isc.DynamicForm.create({
            items:[{
                name:"keepUnmapped",
                 _constructor:"CheckboxItem",
                title:"Keep unmapped fields",
                width:"100%",
                height:1
            }]
        });
        var shiftSelected=function(grid,up){
            var recordList=grid.getSelectedRecords(),
                firstIndex=grid.getRecordIndex(recordList[0]);
            if(firstIndex>=0){
                if(!up){
                    var length=grid.getTotalRows();
                    for(var i=firstIndex;i<length;i++){
                        if(!grid.isSelected(grid.getRecord(i))){
                            firstIndex=i;
                            break;
                        }
                    }
                }
                return grid.recordDrop(recordList,null,firstIndex+(up?-1:1),grid);
            }
        };
        this._moveUp=isc.ImgButton.create({
            size:16,showDown:false,disabled:true,
            src:"[SKINIMG]TransferIcons/up.png",
            click:function(){return shiftSelected(_this._mockupDataSourceList,true);}
        });
        this._moveLeft=isc.ImgButton.create({
            size:16,showDown:false,disabled:true,
            src:"[SKINIMG]TransferIcons/left.png",
            click:function(){
                var sourceWidget=_this.targetDataSourceList,
                    targetWidget=_this._mockupDataSourceList,
                    recordList=sourceWidget.getSelectedRecords(),
                    targetRecord=targetWidget.getSelectedRecord();
                var editRecord=targetWidget.getRecord(targetWidget.getEditRow());
                if(editRecord==targetRecord)targetRecord=null;
                targetWidget.transferRecords(recordList,targetRecord,null,sourceWidget);
            }
        });
        this._moveDown=isc.ImgButton.create({
            size:16,showDown:false,disabled:true,
            src:"[SKINIMG]TransferIcons/down.png",
            click:function(){return shiftSelected(_this._mockupDataSourceList);}
        });
        this.setMembers([
            isc.VStack.create({
                members:[
                    {
                        _constructor:"Label",
                        contents:"Component Fields",
                        height:1,
                        width:this._mockupDataSourceList.width,
                        baseStyle:"headerItem"
                    },
                    this._mockupDataSourceList,
                    this._mapperConfig
                ]
            }),
            this._shuttleButtons=isc.VStack.create({
                width:1,
                height:75,
                layoutAlign:"center",
                members:[
                    this._moveUp,this._moveLeft,this._moveDown
                ]
            }),
            isc.VStack.create({
                members:[
                    {
                        _constructor:"Label",
                        contents:"New DataSource Fields",
                        height:1,
                        width:this.targetDataSourceList.width,
                        baseStyle:"headerItem"
                    },
                    this.targetDataSourceList
                ]
        })]);
        if(this.mockDataSource==null){
            isc.logWarn("MockDataSource should be set");
        }else if(this.targetDataSource==null){
            isc.logWarn("TargetDataSource should be set");
        }else{
            this.setDefaultData();
        }
    }
,isc.A.getMockFieldDefaults=function isc_FieldMapper_getMockFieldDefaults(fieldName){
        var fields=this.mockDataSource.getFields(),
            field=fields[fieldName],
            editNode=field.editNode;
        if(editNode)return editNode.defaults;
        var dsFields=this.mockDataSourceFields;
        if(dsFields){
            var dsField=dsFields[fieldName];
            if(dsField)return dsField;
        }
        return field;
    }
,isc.A.getChanges=function isc_FieldMapper_getChanges(){
        var keepUnmapped=this._mapperConfig.getValue("keepUnmapped"),
            fields=this.getMappedFields(keepUnmapped,false)
        ;
        if(fields==null)return null;
        var changes={};
        for(var i=0;i<fields.length;i++){
            var field=fields[i],
                mappedTo=field.mappedTo
            ;
            if(field.type){
                changes[field.name]=null;
            }else if((mappedTo&&mappedTo!=field.name)||(!mappedTo&&field.name!=field.origName)){
                changes[field.mappedTo||field.name]=field.origName;
            }
        }
        return changes;
    }
,isc.A.getDeletes=function isc_FieldMapper_getDeletes(){
        var keepUnmapped=this._mapperConfig.getValue("keepUnmapped"),
            fields=this.getMappedFields(keepUnmapped,false)
        ;
        if(fields==null)return null;
        var fieldNames=isc.getKeys(this.mockDataSource.getFields()),
            deletes=[]
        ;
        for(var i=0;i<fieldNames.length;i++){
            if(!fields.find("origName",fieldNames[i])){
                deletes[deletes.length]=fieldNames[i];
            }
        }
        return deletes;
    }
,isc.A.applyMap=function isc_FieldMapper_applyMap(component,parent,wnd,confirmed){
        var fieldMapper=this;
        var keepUnmapped=this._mapperConfig.getValue("keepUnmapped"),
            fields=this.getMappedFields(keepUnmapped,!confirmed,function(value){
                if(value)fieldMapper.applyMap(component,parent,wnd,true);});
        if(fields==null)return false;
        var liveFieldMap=this.mockDataSource.getFields();
        this.callback();
        var componentSchema=isc.DS.get(component.getClassName()),
            isForm=isc.isA.DynamicForm(component),
            fieldType=componentSchema.getField("fields").type
        ;
        var editContext=component.editContext;
        for(var i=parent.children.length-1;i>=0;i--){
            if((isForm&&parent.children[i].type!="DataSource")||parent.children[i].type==fieldType){
                editContext.removeNode(parent.children[i],true);
            }
        }
        var targetFields=this.targetDataSourceList.getData();
        var ds=this.targetDataSource;
        for(var i=0;i<fields.length;i++){
            var field=fields[i],
                mappedTo=field.mappedTo,
                editProxy=component.editProxy;
            isc.FieldMapper._assert(mappedTo||field.inUse==null,
                "Target fields copied to the mockup fields list cannot to be unmapped");
            var liveField=field.inUse==null&&liveFieldMap[field.name],
                editNode=liveField&&liveField.editNode;
            if(!mappedTo&&editNode){
                field=liveField;
            }else{
                var defaults=editNode&&editNode.defaults?
                    isc.EditProxy.filterLiveObjectBySchema(fieldType,editNode.defaults):
                    {};
                var fieldConfig=(mappedTo?isc.addProperties({},field,{name:mappedTo}):field);
                if(!isForm)delete fieldConfig.type;
                delete fieldConfig.inUse;
                delete fieldConfig.mappedTo;
                delete fieldConfig.origName;
                var paletteNode=editProxy.makeFieldPaletteNode(fieldConfig,ds,defaults),
                    editNode=editContext.makeEditNode(paletteNode);
                field=isc.addProperties({},paletteNode.defaults,{editNode:editNode});
            }
            fields[i]=field;
        }
        component.setFields(fields);
        for(var i=0;i<fields.length;i++){
            var editNode=fields[i].editNode;
            editContext.addNode(editNode,parent,null,null,true);
        }
        wnd.destroy();
    }
,isc.A.setDefaultData=function isc_FieldMapper_setDefaultData(dropExistingFields){
        var mockupDS=this.mockDataSource,
            mockupGrid=this._mockupDataSourceList;
        var data=[],
            fields=mockupDS.getFields();
        for(var name in fields){
            data.add(isc.addProperties({origName:name},fields[name]));
        };
        this._automaticDefaultMapping(data);
        mockupGrid.setData(data);
        var mappedFields={};
        for(var i=0;i<data.length;i++){
            if(data[i].mappedTo)mappedFields[data[i].mappedTo]=data[i].name;
        }
        var targetDS=this.targetDataSource,
            targetGrid=this.targetDataSourceList;
        var cbMap=[];
        data=[];
        fields=targetDS.getFields();
        for(var name in fields){
            if(fields[name].hidden)continue;
            data.add(isc.addProperties({
                inUse:mappedFields[name]!=null
            },fields[name]));
            if(mappedFields[name]==null){
                cbMap.add(name);
            }
        };
        targetGrid.setData(data);
        mockupGrid.getField("mappedTo").valueMap=cbMap;
        if(dropExistingFields){
            mockupGrid.setData([]);
            mockupGrid.transferRecords(data,null,null,targetDS);
        }
    }
,isc.A.startEditingMapping=function isc_FieldMapper_startEditingMapping(){
        var mockupGrid=this._mockupDataSourceList,
            firstEditRow=mockupGrid.data.findIndex("mappedTo",null);
        mockupGrid.startEditing(Math.max(firstEditRow,0),mockupGrid.getFieldNum("mappedTo"));
    }
,isc.A._automaticDefaultMapping=function isc_FieldMapper__automaticDefaultMapping(data){
        var targetDataSourceTitles=[];
        var targetDS=isc.shallowClone(this.targetDataSource);
        targetDS.autoDeriveTitles=true;
        var targetFields=targetDS.getFields();
        for(var name in targetFields){
            targetDataSourceTitles.add({
                name:name,
                splittedTitle:targetFields[name].title.toLowerCase().split(" ")
            });
        };
        for(var i=0;i<data.length;i++){
            if(data[i].title==null){
                continue;
            }
            var mockSplittedTitle=data[i].title.toLowerCase().split(" ");
            var bestTargetFieldData=null;
            var maxSameWordsCount=0;
            for(var j=0;j<targetDataSourceTitles.length;j++){
                if(targetDataSourceTitles[j].occupied)continue;
                var sameWordsCount=0;
                var targetSplittedTitle=targetDataSourceTitles[j].splittedTitle;
                for(var ti=0;ti<targetSplittedTitle.length;ti++){
                    for(var mi=0;mi<mockSplittedTitle.length;mi++){
                        if(mockSplittedTitle[mi]==targetSplittedTitle[ti]){
                            sameWordsCount++;
                        }
                    }
                }
                if(sameWordsCount>maxSameWordsCount){
                    maxSameWordsCount=sameWordsCount;
                    bestTargetFieldData=targetDataSourceTitles[j];
                }
            };
            if(bestTargetFieldData){
                bestTargetFieldData.occupied=true;
                data[i].mappedTo=bestTargetFieldData.name;
            }
        };
    }
,isc.A._getMappedToNames=function isc_FieldMapper__getMappedToNames(){
        var data=this._mockupDataSourceList.getData(),
            names={};
        for(var i=0;i<data.length;i++){
            var mappedTo=data[i].mappedTo;
            if(mappedTo!=null)names[mappedTo]=data[i];
        }
        return names;
    }
,isc.A.getMappedFields=function isc_FieldMapper_getMappedFields(includeUnmapped,confirm,callback){
        var data=this._mockupDataSourceList.getData(),
            mappedToNames=this._getMappedToNames();
        var mappedFields=[],
            skippedTitles=[];
        for(var i=0;i<data.length;i++){
            var field=data[i],
                title=field.title,
                mappedTo=field.mappedTo;
            if(!mappedTo){
                if(!includeUnmapped||mappedToNames[field.name]){
                    skippedTitles.add("'"+title+"'");
                    continue;
                }
            }
            mappedFields.add(field);
        };
        if(confirm&&skippedTitles.length>0){
            isc.confirm("The following field definitions will be discarded: "+
                skippedTitles.join(", "),callback);
            return null;
        }
        return mappedFields;
    }
);
isc.B._maxIndex=isc.C+10;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('VisualBuilder');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._VisualBuilder_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('VisualBuilder module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'VisualBuilder', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'VisualBuilder'.");}

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

