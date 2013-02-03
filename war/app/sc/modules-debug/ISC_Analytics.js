
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

if(window.isc&&window.isc.module_Core&&!window.isc.module_Analytics){isc.module_Analytics=1;isc._moduleStart=isc._Analytics_start=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc._moduleEnd&&(!isc.Log||(isc.Log && isc.Log.logIsDebugEnabled('loadTime')))){isc._pTM={ message:'Analytics load/parse time: ' + (isc._moduleStart-isc._moduleEnd) + 'ms', category:'loadTime'};
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
isc.ClassFactory.defineClass("CubeGrid","ListGrid");
isc.addGlobal("ReportViewer",isc.CubeGrid);
isc.A=isc.CubeGrid.getPrototype();
isc.A._obfuscation_global_identifier=null;
isc.A.styleName="normal";
isc.A.bodyStyleName="cubeGridBody";
isc.A.backgroundColor=null;
isc.A.showEdges=false;
isc.A.showEmptyMessage=false;
isc.A.defaultWidth=500;
isc.A.defaultHeight=300;
isc.A.overflow=isc.Canvas.IGNORE;
isc.A.baseStyle="cubeCell";
isc.A.alternateRecordStyles=true;
isc.A.skinImgDir="images/CubeGrid/";
isc.A.innerHeaderBaseStyle="innerHeader";
isc.A.colHeaderBaseStyle="colHeader";
isc.A.colHeaderLabelBaseStyle="colHeaderLabel";
isc.A.rowHeaderBaseStyle="rowHeader";
isc.A.rowHeaderLabelBaseStyle="rowHeaderLabel";
isc.A.headerDefaults=isc.ListGrid._unskinnedHeaderDefaults;
isc.A.headerButtonDefaults=isc.ListGrid._unskinnedHeaderButtonDefaults;
isc.A.headerHeight=22;
isc.A.canAutoFitFields=false;
isc.A.autoFetchData=true;
isc.A.autoFetchTextMatchStyle="exact";
isc.A.canGroupBy=false;
isc.A.canFreezeFields=false;
isc.A.showFacetContextMenus=false;
isc.A.showFacetValueContextMenus=true;
isc.A.showCellContextMenus=false;
isc.A.fieldVisibilitySubmenuTitle="Values";
isc.A.canSelectValues=true;
isc.A.canSelectHeaders=true;
isc.A.autoSelectHeaders=true;
isc.A.autoSelectValues="both";
isc.A.headerButtonConstructor=null;
isc.A.useCellRecords=true;
isc.A.valueProperty="_value";
isc.A.cellIdProperty="ID";
isc.A.selectedProperty="_selected";
isc.A.editByCell=true;
isc.A.saveByCell=true;
isc.A.selectOnEdit=false;
isc.A.neverValidate=true;
isc.A.showAllRecords=false;
isc.A.showAllColumns=false;
isc.A.resizeFieldsInRealTime=false;
isc.A.canSelectCells=true;
isc.A.cellDataModel=true;
isc.A.useOriginalStretchResizePolicy=true;
isc.A.canDragSelect=null;
isc.A.sortDirection=Array.ASCENDING;
isc.A.canSortFacets=false;
isc.A.canSortData=false;
isc.A.canReorderFacets=true;
isc.A.controlLabels={
        reorderHandle:"Move",
        minimize:"Minimize",
        maximize:"Maximize",
        sortUp:"Sort Up",
        sortDown:"Sort Down",
        closeBox:"Close"
    };
isc.A.facetTitleAlign="center";
isc.A.facetValueAlign="center";
isc.A.cellAlign="center";
isc.A.padTitles=true;
isc.A.innerHeaderControlSize=13;
isc.A.innerHeaderReorderHandleWidth=7;
isc.A.defaultFacetWidth=100;
isc.A.rollupValue="sum";
isc.A.summaryBorder="1px solid black";
isc.A.summaryValue="sum";
isc.A.summaryTitle="Sum";
isc.A.metricFacetId="metric";
isc.A.canAcceptDrop=true;
isc.A.fastCellUpdates=(isc.Browser.isIE&&isc.Browser.isWin&&isc.Browser.version>=5);
isc.A.fetchDelay=isc.Browser.useHighPerformanceGridTimings?1:300;
isc.A.allowMismatchedHeaderBodyBorder=false;
isc.A.bodyMinWidth=null;
isc.A.bodyMinHeight=null;
isc.A.bodyDefaults=isc.addProperties({},isc.ListGrid.getInstanceProperty("bodyDefaults"),{
        selectOnMouseDown:function(record,rowNum,colNum,keyboardGenerated){
            var rv=this.parentElement;
            if(!(this.selection.cellIsSelected(rowNum,colNum)&&isc.EH.rightButtonDown())){
                rv.deselectHeaders(rv.rowHeaders);
                rv.deselectHeaders(rv.colHeaders);
                if(rv.showRowFacetLabels!=false&&rv.rowFacetLabels){
                    rv.rowFacetLabels.selection.deselectAll();
                }
                rv.lastSelectionHeaderBar=null;
            }
            if(!rv.canSelectValues)return false;
            var event=isc.EventHandler.lastEvent;
            if(event.shiftKey||event.ctrlKey){
                var oldRowNum=this.selection.lastSelectedCell[0],
                    oldColNum=this.selection.lastSelectedCell[1];
                rowNum=rv.findSelectionBoundary(oldRowNum,rowNum,rv.rowBoundaries);
                colNum=rv.findSelectionBoundary(oldColNum,colNum,rv.colBoundaries);
            }
            this._selectCellOnMouseDown(record,rowNum,colNum);
            return true;
        },
        dragMove:function(){
            if(!this.canDragSelect)return true;
            if(!this.selection)return false;
            var rv=this.parentElement,
                rowNum=this.getNearestRowToEvent(),
                colNum=this.getNearestColToEvent(),
                oldRowNum=this.selection.lastSelectedCell[0],
                oldColNum=this.selection.lastSelectedCell[1];
            if(this==rv.body&&rv.canSelectValues==false)return false;
            var stopRowNum=rv.findSelectionBoundary(oldRowNum,rowNum,rv.rowBoundaries);
            var stopColNum=rv.findSelectionBoundary(oldColNum,colNum,rv.colBoundaries);
            if(this==rv.headerGrid)stopColNum=colNum;
            this.selection.selectOnDragMove(this,stopRowNum,stopColNum);
            return true;
        },
        markForRedraw:function(reason){
            if(reason=="scrollRedraw"){
                var cube=this.parentElement;
                if(cube.headerGrid)cube.headerGrid.markForRedraw("body redrawing");
            }
            return this.Super("markForRedraw",arguments);
        },
        getDrawArea:function(colNum,returnDefault){
            var drawRect=this.Super("getDrawArea",arguments);
            if(returnDefault)return drawRect;
            var cube=this.parentElement;
            if(cube.rowHeaderGridMode){
                var headerGridRect=cube.headerGrid.getDrawArea();
                if(!cube.multiRowHeaders){
                    drawRect[0]=headerGridRect[0];
                    drawRect[1]=headerGridRect[1];
                }else{
                    var fields=cube.innerRowFields,
                        startField=fields[headerGridRect[0]],
                        endField=fields[headerGridRect[1]],
                        startRow=0,
                        endRow=0,
                        beforeStart=true;
                    for(var i=0;i<fields.length;i++){
                        var field=fields[i];
                        if(field==startField)beforeStart=false;
                        if(beforeStart)startRow+=field.groupCount;
                        endRow+=field.groupCount;
                        if(field==endField)break;
                    }
                    drawRect[0]=startRow;
                    drawRect[1]=endRow-1;
                }
            }else if(!cube.rowHeaderGridMode){
                var startRow=drawRect[0];
                if(startRow>0&&cube.rowHeights!=null){
                    var normalSpacer=this.getAvgRowHeight()*drawRect[0];
                    this.startSpace=cube.rowHeights.slice(0,startRow).sum()-normalSpacer;
                }else{
                    this.startSpace=0;
                }
            }
            return drawRect;
        }
    })
;

isc.A=isc.CubeGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.groupFacetId="groupFacet";
isc.A.groupByRow=true;
isc.A._$row="row";
isc.A._$column="column";
isc.A.requiresStrictIndexing=true;
isc.A.cellRecordMode="cell";
isc.A.inlinedFacetValueSeparator="_";
isc.A._inlineJoinArray=[];
isc.A.useFillerCells=true;
isc.A.allowNamelessFields=true;
isc.A.headerGridConstructor="HeaderGrid";
isc.A.facetLabelMethods={
    mouseMove:function(){
        this.Super("mouseMove",arguments);
        return isc.EventHandler.STOP_BUBBLING;
    },
    mouseOver:function(){
        this.Super("mouseOver",arguments);
        var rv=this.cubeGrid;
        if(rv.facetLabelOver){
            rv.convertToMethod("facetLabelOver");
            rv.facetLabelOver(this.facetId);
        }
        if(rv.canHover){
            isc.Hover.setAction(rv,rv._facetLabelHover,[this.facetId],rv.hoverDelay);
        }
        return isc.EventHandler.STOP_BUBBLING;
    },
    mouseOut:function(){
        this.Super("mouseOut",arguments);
        var rv=this.cubeGrid;
        if(rv.canHover)isc.Hover.clear();
        if(rv.facetLabelOut){
            rv.convertToMethod("facetLabelOut");
            rv.facetLabelOut(this.facetId);
        }
        return isc.EventHandler.STOP_BUBBLING;
    },
    showContextMenu:function(){
        var rv=this.cubeGrid;
        rv.facetContextItems=null;
        if(rv.facetContextClick){
            isc.Func.replaceWithMethod(rv,"facetContextClick","facetId");
            if(rv.facetContextClick(this.facetId)==false)return false;
        }
        if(rv.showFacetContextMenus){
            if(!rv.facetContextMenu)rv.facetContextMenu=this.getMenuConstructor().create(rv.contextMenuProperties);
            if(!rv.facetContextItems)rv.facetContextItems=rv.makeFacetContextItems(this.facetId);
            if(isc.isAn.Array(rv.facetContextItems)&&rv.facetContextItems.length>0){
                rv.facetContextMenu.setData(rv.facetContextItems);
                rv.facetContextMenu.showContextMenu(rv);
            }
            return false;
        }else{
            return rv.showContextMenu();
        }
    },
    click:function(){
        if(this.Super("click",arguments)==false)return false;
        this.cubeGrid.facetLabelClick(this);
    },
    doubleClick:function(){
        this.cubeGrid.facetLabelDoubleClick(this);
    }
};
isc.A.showHeaderMenuButton=false;
isc.A.showHeaderContextMenu=false;
isc.A.chartConstructor="FacetChart";
isc.A.chartType="Column";
isc.A.chartConfirmThreshold=2000;
isc.A.chartOmitSums=true;
isc.A.exportSeparatorString="\n";
isc.A.exportFacetSeparatorString=" - ";
isc.A.exportDataChunkSize=50;
isc.A.disableCacheSync=false;
isc.B.push(isc.A.init=function isc_CubeGrid_init(){
    if(this.canDragSelect==null)this.canDragSelect=!isc.Browser.isTouch;
    this.Super("init",arguments);
}
,isc.A.initWidget=function isc_CubeGrid_initWidget(){
    var obfuscation_local_identifier;
    if(!this.fixedRecordHeights){
        this.fixedRecordHeights=true;
        this.logWarn("fixedRecordHeights: false is not supported - setting true");
    }
    this.Super(this._$initWidget);
    this.facetHeight=this.facetHeight||this.headerHeight;
    this.cellHeight=this.facetHeight=Math.max(this.cellHeight,this.facetHeight);
    this.rowFacets=this.rowFacets||(this.rows?this.rows.facets:null);
    this.columnFacets=this.columnFacets||(this.columns?this.columns.facets:null);
    this.rowFacetValues=this.rowFacetValues||(this.rows?this.rows.fields:null);
    this.columnFacetValues=this.columnFacetValues||(this.columns?this.columns.fields:null);
    this.controlLabels=this.controlLabels||this.controlAltText;
    this.facetValueGroups=this.facetValueGroups||this.fieldGroups;
    if(this.canPivot!=null)this.canMoveFacets=this.canPivot;
    if(this.flatRowAttributes&&this.rowFacetValues){
        this.logWarn("rowFacetValues or rows.fields specified with flatRowAttributes mode "+
                     "enabled - ignoring manual field placement");
        this.rowFacetValues=null;
    }
    if(this.canResizeColumns!=null)this.canResizeFields=this.canResizeColumns;
    if(this.canReorderColumns!=null)this.canReorderFields=this.canReorderColumns;
    var hasData=this.data!=null&&!(isc.isAn.Array(this.data)&&this.data.length==0);
    if(this.initialCriteria&&this.dataSource){
        this.criteria=this.initialCriteria;
        if(hasData){
            this.originalData=this.data;
            this.data=this.getDataSource().applyFilter(this.data,this.initialCriteria);
        }
    }
    if(hasData||this.getDataSource()==null||this.facets!=null){
        this._initializeFacetValues();
    }
    if(this.enableCharting)this.checkChartConstructor();
    if(this.dataSource)this.observe(this.getDataSource(),"dataChanged",
                                      "observer.dataSourceDataChanged(dsRequest,dsResponse)");
}
,isc.A.getPromptStyle=function isc_CubeGrid_getPromptStyle(){
    return isc.Browser.useHighPerformanceGridTimings&&this._redrawOnScrollInProgress?"component":null;
}
,isc.A.destroy=function isc_CubeGrid_destroy(){
    if(this.dataSource)this.ignore(this.getDataSource(),"dataChanged");
    if(this._rowAttributeRS)this._rowAttributeRS.destroy();
    this.Super("destroy",arguments);
}
,isc.A._initializeFacetValues=function isc_CubeGrid__initializeFacetValues(){
    if(this.facets==null)this.deriveFacetValues();
    this.setFacets();
    this.setFacetValueGroups();
    this.setRows();
    this.setColumns();
}
,isc.A._generateCellClick=function isc_CubeGrid__generateCellClick(row,col){
    if(isc.isAn.Object(row)){
        col=row._colNum;
        row=row._rowNum;
    }
    if(row==null||col==null||
        row<0||col<0||
        row>=this.numRows||
        col>=this.numCols)return;
    this.body.selectOnMouseDown(this.getCellRecord(row,col),row,col);
}
,isc.A._setTabIndex=function isc_CubeGrid__setTabIndex(index,auto){
    this.Super("_setTabIndex",arguments);
    var canTabToHeader=this.canTabToHeader;
    if(canTabToHeader==null)canTabToHeader=isc.screenReader;
    if(canTabToHeader){
        if(this.rowHeaders!=null)this._setHeaderTabIndices(this.rowHeaders,index);
        if(this.colHeaders!=null)this._setHeaderTabIndices(this.colHeaders,index);
        if(this.rowFacetLabels!=null)this._setHeaderTabIndices(this.rowFacetLabels,index);
        if(this.colFacetLabels!=null)this._setHeaderTabIndices(this.colFacetLabels,index);
    }
}
,isc.A._setHeaderTabIndices=function isc_CubeGrid__setHeaderTabIndices(headers,index){
    if(!isc.isAn.Array(headers))headers=[headers];
    for(var i=0;i<headers.length;i++){
        if(isc.isA.Canvas(headers[i]))headers[i]._setTabIndex(index,false);
    }
}
,isc.A.canEditCell=function isc_CubeGrid_canEditCell(rowNum,colNum){
    if(!this.Super("canEditCell",arguments))return false;
    var facetValues=this.getCellFacetValues(rowNum,colNum);
    for(var facetId in facetValues){
        var canEdit=this.getFacetValue(facetId,facetValues[facetId]).canEdit;
        if(canEdit!=null&&canEdit==false)return false;
    }
    return true;
}
,isc.A.getEditorName=function isc_CubeGrid_getEditorName(rowNum,colNum){
    if(!this.inlinedFacet)return this.valueProperty;
    if(isc.isAn.Object(colNum)){
        colNum=colNum.facet.values.findIndex("id",colNum.id);
    }
    return this.getValueProperty(rowNum,colNum);
}
,isc.A._fireCellChanged=function isc_CubeGrid__fireCellChanged(record,rowNum,colNum,newValues,oldValues){
    var undef,
        valueProperty=this.getValueProperty(rowNum,colNum);
    if(newValues[valueProperty]===undef)return;
    this._cellChanged(record,null,newValues[valueProperty],
                      (oldValues?oldValues[valueProperty]:null),
                      rowNum,colNum);
}
,isc.A._editorGetAutoComplete=function isc_CubeGrid__editorGetAutoComplete(){
    return null;
}
,isc.A.setEditValues=function isc_CubeGrid_setEditValues(cellID,editValues,suppressDisplay,suppressSummaryRecalc,a,b,c){
    var rowNum=cellID[0],
        colNum=cellID[1];
    if(this.getCellRecord(rowNum,colNum)==null){
        if(!editValues)editValues={};
        var facetVals=this.getCellFacetValues(rowNum,colNum);
        isc.addProperties(editValues,facetVals);
    }
    return this.invokeSuper(isc.CubeGrid,"setEditValues",cellID,editValues,
                            suppressDisplay,suppressSummaryRecalc,a,b,c);
}
,isc.A.setEditValue=function isc_CubeGrid_setEditValue(rowNum,colNum,value,suppressDisplay){
    if(isc.isA.String(colNum)){
        if(isc.isA.Number(rowNum)){
            this.logWarn("CubeGrid.setEditValue() passed:"+[rowNum,colNum]+
                         ". This is not a valid identifier for cell record edit values");
            return;
        }else{
            colNum=this.getValueProperty(rowNum,colNum);
        }
    }
    return this.Super("setEditValue",arguments);
}
,isc.A._getEditValue=function isc_CubeGrid__getEditValue(rowNum,colNum){
    if(isc.isA.String(colNum)&&!isc.isA.String(rowNum)){
        this.logWarn("CubeGrid.getEditValue() passed:"+[rowNum,colNum]+
                     ". This is not a valid identifier for cell record edit values");
        return;
    }
    var editVals=this._getEditValues(rowNum,colNum);
    if(!editVals)return;
    return editVals[this.getValueProperty(rowNum,colNum)];
}
,isc.A.getEditedCell=function isc_CubeGrid_getEditedCell(rowNum,colNum){
    if(isc.isA.Number(rowNum)){
        if(!isc.isA.Number(colNum)){
            this.logWarn("getEditedCell() unable to determine cell coordinates from data passed in."
                    +" Please pass in either an editValues ID as the first parameter or a"+
                       " rowNum and colNum.");
            return null;
        }
    }else{
        var session=this.getEditSession(rowNum);
        if(session!=null){
            rowNum=this.getEditSessionRowNum(session);
            colNum=this.getEditSessionColNum(session);
        }else{
            return rowNum[this.valueProperty];
        }
    }
    return this.Super("getEditedCell",[rowNum,colNum],arguments);
}
,isc.A.getEditValues=function isc_CubeGrid_getEditValues(valuesID,colNum){
    if(valuesID==null)return this.logWarn("getEditValues() called with no valuesID");
    if(colNum==null&&isc.isAn.Array(valuesID)){
        colNum=valuesID[1];
        valuesID=valuesID[0];
    }
    var rowNum=(isc.isA.Number(valuesID)?valuesID:this.getEditSessionRowNum(valuesID)),
        colNum=colNum!=null?colNum:this.getEditSessionColNum(valuesID);
    if(this._editorShowing&&(this.getEditRow()==rowNum)&&(this.getEditCol()==colNum)){
        this.storeUpdatedEditorValue();
    }
    return this._getEditValues(rowNum,colNum);
}
,isc.A.clearEditValue=function isc_CubeGrid_clearEditValue(editValuesID,colNum,suppressDisplay,dontDropAll){
    if(isc.isA.String(colNum)&&!isc.isA.String(editValuesID)){
        this.logWarn("CubeGrid.getEditValue() passed:"+[editValuesID,colNum]+
                     ". This is not a valid identifier for cell record edit values");
        return;
    }
    if(isc.isA.Number(editValuesID)){
        editValuesID=this.getEditValuesID(editValuesID,colNum);
    }
    var fieldName=this.valueProperty;
    return this.Super("clearEditValue",[editValuesID,fieldName,suppressDisplay,dontDropAll]);
}
,isc.A.isEditingRecord=function isc_CubeGrid_isEditingRecord(rowNum,colNum){
    return(this.getEditRow()==rowNum)&&(this.getEditCol()==colNum);
}
,isc.A.recordMarkedAsRemoved=function isc_CubeGrid_recordMarkedAsRemoved(rowNum){
    return false;
}
,isc.A._saveLocally=function isc_CubeGrid__saveLocally(editInfo,saveCallback){
    var rowNum=editInfo.rowNum,
        colNum=editInfo.colNum,
        oldValues=editInfo.oldValues,
        newValues=editInfo.values;
    var record=this.getCellRecord(rowNum,colNum);
    this.setRawCellValue(record,rowNum,colNum,newValues,false,true);
    this._editCompleteCallback(editInfo,saveCallback);
}
,isc.A.displayUpdatedDSRecord=function isc_CubeGrid_displayUpdatedDSRecord(rowNum,colNum,record){
    if(record!=null&&record[this.valueProperty]==null)record[this.valueProperty]=null;
    var existingRecord=this.getCellRecord(rowNum,colNum);
    this.setRawCellValue(existingRecord,rowNum,colNum,record,false,true);
    this.dataChanged();
}
,isc.A._displayNewEditValues=function isc_CubeGrid__displayNewEditValues(rowNum,colNum,changedValues,errors){
    var undef;
    if(!changedValues||changedValues[this.valueProperty]===undef)return;
    var editorShowing=this.isEditingRecord(rowNum,colNum)&&this._editRowForm!=null;
    var valueProperty=this.getValueProperty(rowNum,colNum);
    if(editorShowing){
        this.getEditForm().setValue(valueProperty,changedValues[valueProperty]);
    }else{
        this.refreshCell(rowNum,colNum);
    }
}
,isc.A.findRowNum=function isc_CubeGrid_findRowNum(record,editSession){
    if(this.shouldIndexCellRecords())this.indexCellRecords();
    if(!this.inlinedFacets){
        if(record._rowNum!=null)return record._rowNum;
        var rowNum=this.getCellRow(record);
        if(rowNum!=-1)return rowNum;
    }
    if(editSession&&editSession._facetValues){
        var facetValues=editSession._facetValues;
        return this.getFacetValuesOffset(facetValues,this.rowFacets,this.rowFields.first());
    }
    if(!this.dataSource)return-1;
    var recordIndex=this.data.findByKeys(record,this.getDataSource());
    if(recordIndex==-1||this.isCellIndexingPending(recordIndex))return-1;
    return this.data[recordIndex]._rowNum;
}
,isc.A.findColNum=function isc_CubeGrid_findColNum(record,editSession){
    if(this.shouldIndexCellRecords())this.indexCellRecords();
    if(!this.inlinedFacets){
        if(record._colNum!=null)return record._colNum;
        var colNum=this.getCellColumn(record);
        if(colNum!=-1)return colNum;
    }
    if(editSession&&editSession._facetValues){
        var facetValues=editSession._facetValues;
        return this.getFacetValuesOffset(facetValues,this.columnFacets,this.colFields.first());
    }
    if(!this.dataSource)return-1;
    var recordIndex=this.data.findByKeys(record,this.getDataSource());
    if(recordIndex==-1||this.isCellIndexingPending(recordIndex))return-1;
    return this.data[recordIndex]._colNum;
}
,isc.A._calculateEditCell=function isc_CubeGrid__calculateEditCell(editSession,a,b,c,d){
    if(editSession._newRecord){
        var newRow,newCol,
            outerRowFields=this.rowFields[0],outerColFields=this.colFields[0],
            haveColumnFacets=this.haveColumnFacets(),
            haveRowFacets=this.haveRowFacets();
        newRow=(!haveRowFacets?0:
                   this.getFacetValuesOffset(editSession._editValues,this.rowFacets,
                                                                    outerRowFields,true));
        newCol=(!haveColumnFacets?0:
                   this.getFacetValuesOffset(editSession._editValues,this.columnFacets,
                                                                     outerColFields,true));
        return[newRow,newCol];
    }else return this.invokeSuper(isc.CubeGrid,"_calculateEditCell",editSession,a,b,c,d);
}
,isc.A._moveEditor=function isc_CubeGrid__moveEditor(rowNum,colNum,reason){
    if(!this._editorShowing||(rowNum==this._editRowNum&&colNum==this._editColNum))return;
    var previousRow=this._editRowNum,previousCol=this._editColNum;
    this._editRowNum=rowNum;
    this._editColNum=colNum;
    var item=this.getEditFormItem(previousCol);
    item.rowNum=rowNum;
    item.colNum=colNum;
}
,isc.A.getEditValuesID=function isc_CubeGrid_getEditValuesID(rowNum,colNum){
    var isRowNum=isc.isA.Number(rowNum);
    if(rowNum==null||(isRowNum&&colNum==null)
                       ||this._editSessions==null)return null;
    if(isc.isA.String(rowNum)&&this._editSessions[rowNum]!=null)return rowNum;
    for(var i in this._editSessions){
        var data=this._editSessions[i];
        if(isRowNum){
            if(data._rowNum==rowNum&&data._colNum==colNum)return i;
        }else{
            if(data==rowNum)return i;
            if(this.comparePrimaryKeys(this._editSessions[i]._primaryKeys,rowNum)){
                return i;
            }
        }
    }
    return null;
}
,isc.A.setRowEditFieldName=function isc_CubeGrid_setRowEditFieldName(){}
,isc.A.getRowEditColNum=function isc_CubeGrid_getRowEditColNum(){}
,isc.A.hasChanges=function isc_CubeGrid_hasChanges(checkEditor){
    var editCells=this.getAllEditCells();
    for(var i=0;i<editCells.length;i++){
        var row=editCells[i][0],
            col=editCells[i][1];
        if(this.recordMarkedAsRemoved(row)||
            this.recordHasChanges(row,col,checkEditor))return true;
    }
    return false;
}
,isc.A.getRawCellValue=function isc_CubeGrid_getRawCellValue(record,rowNum,colNum){
    var editVals=this._getEditValues(rowNum,colNum),
        fieldName=this.getEditorName(rowNum,colNum),
        undef;
    if(editVals&&editVals[fieldName]!==undef){
        return editVals[fieldName];
    }
    if(record==null)record=this.getCellRecord(rowNum,colNum);
    if(record!=null)return record[this.getValueProperty(rowNum,colNum)];
}
,isc.A.setRawCellValue=function isc_CubeGrid_setRawCellValue(record,rowNum,colNum,newValues,suppressChanged,suppressDisplay){
    if(record==null)record=this.getCellRecord(rowNum,colNum);
    if(record==null){
        record={};
        isc.addProperties(record,this.getCellFacetValues(rowNum,colNum));
        this.data.add(record);
        if(this.cellIndex){
            var filler=this.getCellRecord(rowNum,colNum,true);
            if(filler)this._fillerCells.remove(filler);
            record._rowNum=rowNum;
            record._colNum=colNum;
            this.cellIndex[colNum][rowNum]=record;
        }
    }
    isc.addProperties(record,newValues);
    if(!suppressChanged){
        if(suppressDisplay)this._suppressRedrawOnDataChanged=true;
        this.data.dataChanged();
        if(suppressDisplay)delete this._suppressRedrawOnDataChanged;
    }
}
,isc.A.getEditorConstructor=function isc_CubeGrid_getEditorConstructor(record,field){
    return this.editor;
}
,isc.A.getEditorProperties=function isc_CubeGrid_getEditorProperties(){
    var props=this.Super("getEditorProperties",arguments);
    props.height=this.cellHeight-2;
    return props;
}
,isc.A.getCellField=function isc_CubeGrid_getCellField(rowNum,colNum){
    if(this.innerColFields!=null)return this.innerColFields[colNum];
}
,isc.A._editNextItem=function isc_CubeGrid__editNextItem(rowNum,colNum,step){
    do{
        colNum+=step;
        if(colNum>=this.numCols){
            colNum=0;
            rowNum+=1;
        }else if(colNum<0){
            colNum=this.numCols-1;
            rowNum-=1;
        }
        if(rowNum<0||rowNum>=this.numRows)return false;
    }while(!this.handleEditCellEvent(rowNum,colNum));
}
,isc.A.deriveFacetValues=function isc_CubeGrid_deriveFacetValues(forceUpdate){
    var facetIds=this.rowFacets.concat(this.columnFacets),
        facets=[];
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i];
        var facet=null;
        if(!forceUpdate&&this.facets)facet=this.facets.find("id",facetId);
        facet=facet||{id:facetId};
        var ds=this.getDataSource();
        if(ds!=null&&ds.getField(facet.id)!=null){
            facet.name=facet.id;
            facet=ds.combineFieldData(facet);
        }
        facet.title=facet.title!=null?facet.title:facet.id;
        facets.add(facet);
        if(facet.values&&!forceUpdate)continue;
        if(facet.getValueTitle&&!isc.isA.Function(facet.getValueTitle)){
            isc.Func.replaceWithMethod(facet,"getValueTitle","value,facet,grid");
        }
        facet.values=[];
        var valueIndex={};
        for(var j=0;j<this.data.getLength();j++){
            var cell=this.data.get(j),
                facetValueId=cell[facetId],
                title=facetValueId;
            if(valueIndex[facetValueId])continue;
            if(facet.getValueTitle){
                title=facet.getValueTitle(facetValueId,facet,this);
            }else if(facet.autoDeriveTitles||
                       (facet.autoDeriveTitles==null&&this.autoDeriveTitles))
            {
                title=isc.DS.getAutoTitle(title);
            }
            var facetValue={id:facetValueId,title:title};
            facet.values.add(facetValue);
            valueIndex[facetValueId]=facetValue;
        }
        if(facet.values.length==null){
            this.logWarn("Could not generate any facetValues for facet '"+facetId+
                         "', does facetId match fieldName in provided dataset?");
        }
    }
    this.facets=facets;
}
,isc.A.setFacets=function isc_CubeGrid_setFacets(facets){
    facets=this.facets=facets||this.facets;
    var groupFacetId=this.groupFacetId;
    var groupFacet=facets.find("id",groupFacetId);
    if(groupFacet){
        facets.remove(groupFacet);
        this.rowFacets.remove(groupFacetId);
        this.columnFacets.remove(groupFacetId);
    }
    this.facetIndex=this.facets.makeIndex("id");
    for(var i=0;i<this.facets.length;i++){
        var facet=this.facets[i];
        if(facet.inlinedValues){
            if(this.inlinedFacet&&facet!=this.inlinedFacet){
                this.inlinedFacets=[this.inlinedFacet,facet];
            }else{
                this.inlinedFacet=facet;
            }
        }
    }
    var pivots=this.facetValuePivots;
    if(pivots&&!this._appliedPivots){
        for(var i=0;i<pivots.length;i++){
            var pivot=pivots[i];
            this.pivotFacetValue(pivot.facetId,pivot.facetValueId,pivot.parentFacetValues,
                                 pivot.pivotValues,true);
        }
        this._appliedPivots=true;
    }
    var data=this.data;
    if(this.multiCellData&&this.data){
        var start=isc.timeStamp();
        var colFirst=false;
        if(this.pivotWithinFacet){
            colFirst=this.getFacetLocation(this.pivotWithinFacet).isRow;
        }
        var facetIds=this.getAllFacetIds(colFirst);
        if(this.inlinedFacet){
            facetIds.remove(this.inlinedFacet.id);
        }
        var theTree=isc.Tree.create({
            modelType:"fields",
            fieldOrder:facetIds
        })
        theTree.connectByFields(data);
        var groups=theTree.getLevelNodes(facetIds.length-1),
            maxIndex=0,
            pivotFacetValues={},
            lastTwoFacets=facetIds.slice(facetIds.length-2);
        this.groupedTotalRows=0;
        for(var j=0;j<groups.length;j++){
            var group=groups[j],
                children=theTree.getChildren(group);
            if(!this.groupingAsFacet){
                var sideFacetValues=this.getSideFacetValues(children[0]),
                    existingGroupCount=this.getFieldProperty(sideFacetValues,"groupCount");
                if(existingGroupCount==null){
                    this.setFieldProperty(sideFacetValues,"groupCount",children.length);
                    this.groupedTotalRows+=children.length;
                }else{
                    var largestGroup=Math.max(children.length,existingGroupCount);
                    if(children.length>existingGroupCount){
                        this.groupedTotalRows+=(children.length-existingGroupCount);
                        this.setFieldProperty(sideFacetValues,"groupCount",largestGroup);
                    }
                }
            }
            var indirectParent=theTree.getParent(group);
            pivotFacetValues[facetIds.last()]=theTree.getTitle(group);
            pivotFacetValues[facetIds[facetIds.length-2]]=theTree.getTitle(indirectParent);
            var pivotInfo=this.getFieldProperty(pivotFacetValues,"pivot",lastTwoFacets);
            if(!pivotInfo||pivotInfo.pivotFacetValueId==null){
                maxIndex=Math.max(children.length-1,maxIndex);
                for(var i=0;i<children.length;i++){
                    children[i][groupFacetId]=i;
                }
                continue;
            }
            var valueProperty=this.inlinedFacet&&this.inlinedFacet.id==this.pivotWithinFacet?
                                pivotInfo.pivotFacetValueId:this.valueProperty;
            var index=children.makeIndex(valueProperty,true);
            for(var value in index){
                var cellsWithValue=index[value];
                maxIndex=Math.max(cellsWithValue.length-1,maxIndex);
                for(var i=0;i<cellsWithValue.length;i++){
                    cellsWithValue[i][groupFacetId]=i;
                }
            }
        }
        this.logInfo("generated groupFacet by grouping across: "+facetIds+
                     ", max index: "+maxIndex,"facetValuePivot");
        if(this.groupingAsFacet){
            var groupFacet={
                id:groupFacetId,
                title:"Group",
                width:1,height:1
            }
            var facetValues=[];
            for(var i=0;i<=maxIndex;i++){
                facetValues.add({id:i,title:i});
            }
            groupFacet.values=facetValues;
            facets.add(groupFacet);
            this.facetIndex[groupFacetId]=groupFacet;
            if(this.groupByRow){
                this.rowFacets.add(groupFacetId);
            }else{
                this.columnFacets.add(groupFacetId);
            }
        }else{
            this.multiRowHeaders=true;
        }
        this.logInfo("multiCellData group generation: "+
                     (isc.timestamp()-start)+"ms","cgTiming");
    }
    for(var i=0;i<this.facets.length;i++){
        var facet=this.facets[i],
            facetValues=facet.values;
        if(facet.border)facet.bodyBorder=facet.border;
        if(facetValues==null)continue;
        facet.valuesIndex={};
        for(var j=0;j<facetValues.length;j++){
            var facetValue=facetValues[j];
            if(facetValue==null&&!(this.flatRowAttributes&&this.rowAttributeLOD)){
                this.logWarn("null facet value at facet "+facet.id+" index "+j);
                continue;
            }
            if(facetValue.id==null){
                facetValue.id=j;
            }
            facetValue.facetValueId=facetValue.id;
            facetValue.facet=facet;
            facet.valuesIndex[facetValue.id]=facetValue;
        }
        if(facet.isTree){
            facet.values.setProperty("_withinFacetChildren",null);
            var valueTree=isc.Tree.create({
                showRoot:false,
                data:facet.values,
                modelType:"parent",
                parentIdField:"parentId",
                childrenProperty:"_withinFacetChildren",
                isOpen:function(node){return!node.collapsed;}
            });
            for(var j=0;j<facetValues.length;j++){
                var facetValue=facetValues[j];
                facetValue._defaultCollapsed=(facetValue.collapsed!=null?
                                                facetValue.collapsed:facet.collapsed)
            }
            facet._valueTree=valueTree;
        }
    }
    this._detectAllFacetValuesPresent();
}
,isc.A.getFacet=function isc_CubeGrid_getFacet(facetId){
    if(isc.isA.String(facetId))return this.facetIndex[facetId];
    return facetId;
}
,isc.A.getFacetValue=function isc_CubeGrid_getFacetValue(facetId,facetValueId){
    var facet=this.getFacet(facetId);
    if(facet==null){
        this.logWarn("Can't get facetValue: "+facetValueId+
                     " because there is no such facetId: "+facetId+this.getStackTrace());
        return null;
    }
    return facet.valuesIndex[facetValueId];
}
,isc.A._getColumnFacetHeight=function isc_CubeGrid__getColumnFacetHeight(facet){
    var height=facet.height,
        labelHeight=facet.labelHeight;
    if(height!=null&&labelHeight!=null){
        return Math.max(height,labelHeight);
    }
    return height||labelHeight||this.facetHeight;
}
,isc.A.haveColumnFacets=function isc_CubeGrid_haveColumnFacets(){
    return(this.columnFacets!=null&&this.columnFacets.length>0);
}
,isc.A.haveRowFacets=function isc_CubeGrid_haveRowFacets(){
    return(this.rowFacets!=null&&this.rowFacets.length>0);
}
,isc.A.getAllFacetIds=function isc_CubeGrid_getAllFacetIds(colFirst){
    var allFacets=[];
    if(colFirst){
        if(this.haveColumnFacets())allFacets=allFacets.concat(this.columnFacets);
        if(this.haveRowFacets())allFacets=allFacets.concat(this.rowFacets);
    }else{
        if(this.haveRowFacets())allFacets=allFacets.concat(this.rowFacets);
        if(this.haveColumnFacets())allFacets=allFacets.concat(this.columnFacets);
    }
    return allFacets;
}
,isc.A.setFacetValueGroups=function isc_CubeGrid_setFacetValueGroups(facetValueGroups){
    facetValueGroups=this.facetValueGroups=facetValueGroups||this.facetValueGroups;
    if(facetValueGroups==null)return;
    this._facetValueGroupIndex=facetValueGroups.makeIndex("id");
}
,isc.A.getFacetValueGroup=function isc_CubeGrid_getFacetValueGroup(id){
    if(this.facetValueGroups==null)return null;
    return this._facetValueGroupIndex[id];
}
,isc.A._detectAllFacetValuesPresent=function isc_CubeGrid__detectAllFacetValuesPresent(){
    this.facetValuesPresent=this.facetValuesPresent||{};
    this._markAllValuesPresent();
}
,isc.A._markAllValuesPresent=function isc_CubeGrid__markAllValuesPresent(data){
    var start=isc.timeStamp();
    data=data||this.data;
    for(var i=0;i<data.length;i++){
        var cellRecord=data[i];
        if(!this.inlinedFacet){
            var value=cellRecord[this.valueProperty];
            if(value==null||value==this.emptyValue)continue;
        }
        if(this.haveRowFacets())this.markValuesPresent(cellRecord,this.rowFacets);
        if(this.haveColumnFacets())this.markValuesPresent(cellRecord,this.columnFacets);
    }
    var end=isc.timeStamp();
    this.logInfo("markValuesPresent: "+data.length+" cellRecords: "+
                 (end-start)+"ms","cgTiming");
}
,isc.A.facetValuesArePresent=function isc_CubeGrid_facetValuesArePresent(facetValues,facetIds){
    if(this.hideEmptyAxis!=null){
        var isRow=this.facetPathIsRow(facetValues);
        if(!isRow){
            if(this.hideEmptyAxis==this._$row)return true;
        }else{
            if(this.hideEmptyAxis==this._$column)return true;
        }
    }
    var fieldProps=this.getFieldProperties(facetValues,facetIds);
    return fieldProps!=null&&!fieldProps.noData;
}
,isc.A.setFieldProperty=function isc_CubeGrid_setFieldProperty(field,property,value,noData){
    var facetValues,facets;
    if(isc.isAn.Object(field.facet)){
        facets=field.isRowHeader?this.rowFacets:this.columnFacets;
        facetValues=this.getHeaderFacetValues(field);
    }else{
        facetValues=field;
    }
    if(!this.facetValuesPresent)this.facetValuesPresent={};
    this.markValuesPresent(facetValues,facets,true,noData);
    var props=this.getFieldProperties(facetValues,facets);
    if(props){
        if(!noData&&props.noData)delete props.noData;
        props[property]=value;
    }
}
,isc.A._markFacetValuePresent=function isc_CubeGrid__markFacetValuePresent(valuesPresent,facetValueId,noData,facetParentObject){
    valuesPresent[facetValueId]=noData?{noData:true}:{};
    if(valuesPresent.noData)delete valuesPresent.noData;
    facetParentObject=valuesPresent[facetValueId];
    if(valuesPresent[facetValueId].noData){
        facetParentObject=isc.addProperties(facetParentObject,{_noChildDataPresent:true});
    }
}
,isc.A.markValuesPresent=function isc_CubeGrid_markValuesPresent(cellRecord,facetIds,leaveBlanks,noData){
    facetIds=facetIds||this.getFacetsForPath(cellRecord);
    var logInfo=this.logIsInfoEnabled("ignoredRecords");
    var valuesPresent=this.facetValuesPresent,
        lastValuesPresent,lastFacetValueId,
        newLevel=false,
        facetValueId=null,
        facetParentObject=null;
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i];
        if(!this.inlinedFacet||facetId!=this.inlinedFacet.id){
            if(cellRecord[facetId]==null){
                if(newLevel&&lastFacetValueId!=null&&!leaveBlanks){
                }
                if(logInfo){
                   this.logInfo("no value found for facetId: "+facetId+
                                " ignoring cellRecord: "+isc.echo(cellRecord),
                                "ignoredRecords");
                }
                break;
            }
            var facetValueId=cellRecord[facetId];
            if(valuesPresent[facetValueId]==null){
                this._markFacetValuePresent(valuesPresent,facetValueId,noData,facetParentObject);
                newLevel=true;
            }else{
                newLevel=false;
            }
        }else{
            var facetValues=this.inlinedFacet.values,
                undef,
                foundValue=false;
            for(var j=0;j<facetValues.length;j++){
                var facetValueId=facetValues[j].id;
                if(cellRecord[facetValueId]!==undef){
                    this._markFacetValuePresent(valuesPresent,facetValueId,noData,facetParentObject);
                    foundValue=true;
                }
            }
            if(!foundValue&&newLevel&&lastFacetValueId!=null){
                if(!leaveBlanks)lastValuesPresent[lastFacetValueId]=null;
                if(logInfo){
                   this.logInfo("no values found for facetId: "+facetId+
                                " ignoring cellRecord: "+isc.echo(cellRecord),"ignoredRecords");
                }
            }
        }
        lastValuesPresent=valuesPresent;
        lastFacetValueId=facetValueId;
        valuesPresent=valuesPresent[facetValueId];
        if(valuesPresent&&!noData)delete valuesPresent.noData;
    }
}
,isc.A.facetPathIsRow=function isc_CubeGrid_facetPathIsRow(facetPath){
    var facetId;
    for(facetId in facetPath)break;
    return this.getFacetLocation(facetId).isRow;
}
,isc.A.getFacetsForPath=function isc_CubeGrid_getFacetsForPath(facetPath){
    var isRow=this.facetPathIsRow(facetPath),
        facetIds=isRow?this.rowFacets:this.columnFacets;
    return facetIds.slice(0,isc.getKeys(facetPath).length);
}
,isc.A.getFieldProperties=function isc_CubeGrid_getFieldProperties(facetPath,facetIds){
    facetIds=facetIds||this.getFacetsForPath(facetPath);
    var valuesPresent=this.facetValuesPresent;
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i],
            facetValueId=facetPath[facetId];
        if(facetValueId==null)return valuesPresent;
        if(valuesPresent==null)return null;
        if(valuesPresent[facetValueId]==null)return null;
        valuesPresent=valuesPresent[facetValueId];
    }
    return valuesPresent;
}
,isc.A.getFieldProperty=function isc_CubeGrid_getFieldProperty(facetPath,property,facetIds){
    var properties=this.getFieldProperties(facetPath,facetIds),
        undef;
    return properties?properties[property]:undef;
}
,isc.A.setRows=function isc_CubeGrid_setRows(rows,facetsUnchanged,dontRemapEdits){
    if(this.isDrawn()){
        if(this.rowHeaders!=null){
            this.rowHeaders.map("destroy");
            this.rowHeaders=null;
        }
        if(this.rowFacetLabels!=null&&!facetsUnchanged){
            this.rowFacetLabels.destroy();
            this.rowFacetLabels=null;
        }
        if(this.headerGrid!=null){
            this.headerGrid.destroy();
            this.headerGrid=null;
        }
    }
    this._buildRowFields();
    this.rowHeaders=[];
    if(this.isDrawn()&&this._facetChildrenBuilt){
        this.rebuildFacets(true,false,facetsUnchanged)
    }
    this.cellIndex=null;
    if(!dontRemapEdits&&this._editSessions&&!isc.isA.emptyObject(this._editSessions)){
        this._remapEditRows();
    }
}
,isc.A._buildRowFields=function isc_CubeGrid__buildRowFields(){
    this.numRows=1;
    if(this.haveRowFacets()){
        if(this.showColumnSummary)this._addRowFacetSumValues();
        this.rowNesting=false;
        this._multiFacetColumn=this._treeChildFacetId=
            this._treeParentFacetId=this._crossFacetTree=null;
        var treeChildFacet=this.facets.find("combineInTree",true);
        if(treeChildFacet){
            if(!(this.rowFacets&&this.rowFacets.length>1&&
                  this.rowFacets.last()==treeChildFacet.id))
            {
                this.logWarn("ignoring bad combineInTree property on facet: "+treeChildFacet.id);
            }else{
                this._treeChildFacetId=treeChildFacet.id;
                this._treeParentFacetId=this.rowFacets[this.rowFacets.length-2];
                this._multiFacetColumn=true;
            }
        }
        if(this.flatAttributesOnly()){
            this.rowFields=[];
            for(var i=0;i<this.rowFacets.length;i++){
                this.rowFields[i]=this.getFacet(this.rowFacets[i]).values;
            }
        }else{
            this.rowFields=this.makeFieldTree({facets:this.rowFacets,
                                                  fields:this.rowFacetValues},true);
        }
        this.innerRowFields=this.rowFields.last();
        if(this.rowAttributeLOD)this._setupRowAttributeLOD();
        if(this._multiFacetColumn)this._buildCrossFacetTree();
        this.numRows=this.groupedTotalRows||this.innerRowFields.length;
        this.rowBorders=this.getBorderStyles(this.innerRowFields,true);
        this.rowBoundaries=this.getSelectionBoundaries(this.innerRowFields);
    }else{
        this.rowFields=[];
        this.innerRowFields=[];
        this.rowBorders=[];
        this.numRows=1;
        this.rowBoundaries=null;
    }
    var data=this.selection.data;
    for(var i=0;i<this.numRows;i++)data[i]={};
}
,isc.A.inMultiFacetColumn=function isc_CubeGrid_inMultiFacetColumn(facetId){
    if(!this._multiFacetColumn)return false;
    if(facetId==this._treeChildFacetId||facetId==this._treeParentFacetId)return true;
    return false;
}
,isc.A._buildCrossFacetTree=function isc_CubeGrid__buildCrossFacetTree(){
    var crossFacetTree=isc.Tree.create({
        showRoot:false,
        root:{
            name:"/",
            childFacetValues:this.rowFields[this.rowFacets.length-2]
        },
        childrenProperty:"childFacetValues",
        isOpen:function(node){return!node.minimized;},
        nameProperty:"_crossFacetName",
        pathProperty:"_crossFacetPath",
        parentProperty:"_crossFacetParent"
    });
    this._crossFacetTree=crossFacetTree;
    var openList=crossFacetTree.getOpenList();
    if(this.getFacet(this._treeParentFacetId).showParentsLast)openList=openList.reverse();
    crossFacetTree._openList=openList;
    this.innerRowFields=openList;
}
,isc.A.getTotalRows=function isc_CubeGrid_getTotalRows(){return this.numRows}
,isc.A.getTotalCols=function isc_CubeGrid_getTotalCols(){return this.numCols}
,isc.A.rebuildFacets=function isc_CubeGrid_rebuildFacets(rebuildRows,rebuildColumns,facetsUnchanged){
    if(rebuildRows){
        if(!facetsUnchanged)this.createRowFacetLabels();
        this.createRowHeaderBars(true);
    }
    if(rebuildColumns){
        if(this.haveColumnFacets()){
            this.sizeParentFields(this.colFields,this.colHeaders,"width",
                                  this.defaultFacetWidth);
        }
        if(!facetsUnchanged){
            if(this.rowFacetLabels)this.rowFacetLabels._recalculateMinHeight=true;
            this.createColumnFacetLabels();
        }
        this.createColumnHeaderBars(true);
        this.setFields(this.fields,this.getFieldWidths());
    }
    this._facetChildrenBuilt=true;
    this.layoutChildren();
    if(rebuildRows)this.map("addChild",this.rowHeaders);
    if(rebuildColumns)this.map("addChild",this.colHeaders);
    this._markBodyForRedraw("rebuildFacets");
    this.syncHeaderScrolling(null,null,true);
}
);
isc.evalBoundary;isc.B.push(isc.A.setColumns=function isc_CubeGrid_setColumns(columns,facetsUnchanged,dontRemapEdits){
    if(this.isDrawn()){
        if(this.colHeaders!=null){
            this.colHeaders.map("destroy");
            this.colHeaders=null;
        }
        if(this.colFacetLabels!=null&&!facetsUnchanged){
            this.colFacetLabels.destroy();
            this.colFacetLabels=null;
        }
    }
    columns=this.columns=columns||this.columns;
    this.numCols=1;
    if(this.haveColumnFacets()){
        var start=isc.timeStamp();
        this.colFields=this.makeFieldTree({facets:this.columnFacets,
                                              fields:this.columnFacetValues});
        this.innerColFields=this.colFields.last();
        this.fields=this.innerColFields;
        this.numCols=this.innerColFields.length;
        this.colBorders=this.getBorderStyles(this.innerColFields);
        this.colBoundaries=this.getSelectionBoundaries(this.innerColFields);
    }else{
        this.colFields=[];
        this.innerColFields=[];
        this.colBorders=[];
        this.fields=[{name:"_placeholder",width:100}];
        this.numCols=1;
        this.colBoundaries=null;
    }
    this.colHeaders=[];
    if(this.isDrawn()&&this._facetChildrenBuilt){
        this.rebuildFacets(false,true,facetsUnchanged);
    }
    this.cellIndex=null;
    if(!dontRemapEdits&&this._editSessions&&!isc.isA.emptyObject(this._editSessions)){
        this._remapEditRows();
    }
}
,isc.A.makeFieldTree=function isc_CubeGrid_makeFieldTree(fieldSpec,isRowHeader){
    var start=isc.timeStamp();
    this.fieldTree=[];
    this.isRowHeader=isRowHeader;
    this.facetIds=fieldSpec.facets;
    this._totalValuesSuppressed=0;
    for(var i=0;i<this.facetIds.length;i++)this.fieldTree[i]=[];
    this.makeFieldTreeLevel(this.getChildFacetValues(null,fieldSpec,this.facetIds[0]),0);
    var fieldTree=this.fieldTree;
    if(this._totalValuesSuppressed>0){
        this.logInfo(this._totalValuesSuppressed+" fields suppressed by hideEmptyFacetValues");
    }
    this.fieldTree=null;
    this.isRowHeader=null;
    this.facetIds=null;
    this._totalValuesSuppressed=null;
    var end=isc.timeStamp();
    if(this.logIsDebugEnabled("cgTiming")){
        this.logDebug("makeFieldTree("+(isRowHeader?"rows":"cols")+"): "+
                     (end-start)+"ms","cgTiming");
    }
    return fieldTree;
}
,isc.A.makeFieldTreeLevel=function isc_CubeGrid_makeFieldTreeLevel(facetValues,level,parentField,facetValueGroup){
    if(facetValues==null)return;
    var facetId=this.facetIds[level],
        facet=this.getFacet(facetId);
    if(facetValues!=null&&this.pivotWithinFacet==facetId){
        facetValues=this.getPivotFacetValues(parentField,facetId,facetValues)||
                                               facetValues;
    }
    for(var i=0;i<facetValues.length;i++){
        var facetValueId=facetValues[i];
        if(facetValueId==null){
            this.logWarn("Null facetValue at index "+i+" in facet "+facetId);
            continue;
        }
        var facetValueObj=null;
        if(isc.isAn.Object(facetValueId)){
            facetValueObj=facetValueId;
            facetValueId=facetValueObj.facetValueId;
        }
        var facetValue=this.getFacetValue(facetId,facetValueId);
        if(facetValue==null){
            this.logWarn("No such facetValue "+facetValueId+" in facet "+facetId);
            continue;
        }
        var fieldProps=null,fieldFacetValues=null;
        if(facetValue.hidden){
            fieldFacetValues=this.getHeaderFacetValues(parentField);
            fieldFacetValues[facetId]=facetValueId;
            fieldProps=this.getFieldProperties(fieldFacetValues,this.facetIds);
            if(!fieldProps||fieldProps.hidden!==false)continue;
        }
        var field=this.makeField(facet,facetValue,level,facetValueGroup);
        if(facetValueObj){
            isc.addProperties(field,facetValueObj);
        }
        if((this.hideEmptyFacetValues&&!this.attributesOnly())||
            this.canCollapseFacets||this.canMinimizeFacets||this.multiRowHeaders)
        {
            if(parentField!=null)field.parent=parentField;
            fieldFacetValues=fieldFacetValues||this.getHeaderFacetValues(field);
            if(this.hideEmptyFacetValues&&this.dataSource){
                fieldProps=fieldProps||this.getFieldProperties(fieldFacetValues);
            }
            var fieldFacetValuesProperties=this.getFieldProperties(fieldFacetValues,this.facetIds),
                noChildDataPresentFlag=fieldFacetValuesProperties!=null&&
                                            fieldFacetValuesProperties._noChildDataPresent;
            if((this.hideEmptyFacetValues&&!this.attributesOnly()&&
                !(this.data==null||this.data.length==0)&&
                (fieldProps&&fieldProps._retainWhenEmpty==false||!this.dataSource)
                )||noChildDataPresentFlag)
            {
                if(!this.facetValuesArePresent(fieldFacetValues,this.facetIds)||noChildDataPresentFlag){
                    this._totalValuesSuppressed++;
                    if(this.logIsInfoEnabled()){
                        this.logInfo("Suppressing header for facetValues: "+
                                     this.echo(fieldFacetValues));
                    }
                    continue;
                }
            }
            if(this.canCollapseFacets||this.canMinimizeFacets||
                this.canPickFields||this.multiRowHeaders||this.hideEmptyFacetValues)
            {
                fieldProps=fieldProps||this.getFieldProperties(fieldFacetValues);
                if(fieldProps!=null){
                    if(fieldProps.hidden){
                        if(this.logIsDebugEnabled()){
                            this.logDebug("skipping hidden field, props: "+this.echo(fieldProps)+
                                          " at facetValues: "+this.echo(fieldFacetValues));
                        }
                        continue;
                    }
                    isc.addProperties(field,fieldProps);
                }
            }
        }
        this.deriveFieldBorders(field,facet,parentField,facetValues,i);
        if(this.fieldTree[level]==null)this.fieldTree[level]=[];
        this.fieldTree[level].add(field);
        var levelIndex=this.fieldTree[level].length-1;
        if(parentField!=null){
            field.parent=parentField;
            if(parentField.childFacetValues==null)parentField.childFacetValues=[];
            parentField.childFacetValues.add(field);
            if(parentField.childFacetValues.length>1){
                if(this.isRowHeader)this.rowNesting=true;
            }
        }
        var nextFacetId=this.facetIds[level+1],
            childFacetValues=this.getChildFacetValues(facetId,facetValues[i],
                                                        nextFacetId,field,levelIndex);
        if(childFacetValues!=null){
            this.isLastInLevel=(i==facetValues.length-1)
            this.makeFieldTreeLevel(childFacetValues,level+1,field,this._inFacetValueGroup);
        }
    }
    if(this.isRowHeader&&this.showColumnSummary&&this.isLastInLevel){
        this._addSumValueToLevel(facet,level,this.fieldTree);
    }
}
,isc.A.makeField=function isc_CubeGrid_makeField(facet,facetValue,level,facetValueGroup){
    var field;
    if(this.flatRowAttributes){
        field=facetValue;
    }else if(facet.id==this.groupFacetId||this.facetValueFieldProperties){
        field={
            id:facetValue.id,
            facetValueId:facetValue.id,
            facet:facet,
            title:facetValue.title
        };
        if(this.facetValueFieldProperties){
            var props=this.facetValueFieldProperties,
                field={};
            for(var i=0;i<props.length;i++){
                field[props[i]]=facetValue[props[i]];
            }
        }
    }else{
        field=isc.addProperties({},facetValue);
    }
    if(field.border)field.bodyBorder=field.border;
    field.border=null;
    if(facetValueGroup!=null)field.facetValueGroup=facetValueGroup;
    if(facetValue.titleHilite!=null||facet[this.hiliteProperty]!=null){
        field._titleHilite=(facetValue.titleHilite!=null?facetValue.titleHilite:
                              facet[this.hiliteProperty]);
        field.cssText=this.addObjectHilites(field._titleHilite);
    }
    if(this.isRowHeader)field.isRowHeader=this.isRowHeader;
    field.headerLevel=level;
    var numFacets=this.isRowHeader?this.rowFacets.length:this.columnFacets.length;
    if(level!=numFacets-1)field.childFacetValues=[];
    field.showCloseBox=(facetValue.canClose!=null?facetValue.canClose:
                          facet.canClose!=null?facet.canClose:
                          this.canCloseColumns);
    field.showSortButtons=(facetValue.canSort!=null?facetValue.canSort:
                             facet.canSort!=null?facet.canSort:
                             this.canSortData);
    field.canCollapse=(facet.isTree&&
                         facetValue.canCollapse!=false&&
                         facet.canCollapse!=false&&
                         this.canCollapseFacets!=false);
    field.canMinimize=(facetValue.canMinimize!=null?facetValue.canMinimize:
                         facet.canMinimize!=null?facet.canMinimize:this.canMinimizeFacets);
    field.cellAlign=field.cellAlign||facet.cellAlign||
        facetValue.align||facet.align||this.cellAlign;
    field.align=field.align||facet.align||this.facetValueAlign;
    return field;
}
,isc.A.deriveFieldBorders=function isc_CubeGrid_deriveFieldBorders(field,facet,parent,facetValues,position){
    var borderStyle;
    if(position==0&&parent&&parent._derivedBorderBefore){
        borderStyle=parent._derivedBorderBefore;
    }else{
        borderStyle=field.borderBefore||facet.borderBefore;
    }
    if(borderStyle){
        field._derivedBorderBefore=borderStyle;
        borderStyle="border-"+(this.isRowHeader?"top":"left")+":"+
                      borderStyle+isc.semi;
        if(field.cssText)field.cssText+=borderStyle;
        else field.cssText=borderStyle;
    }
    if(position==facetValues.length-1&&parent&&parent._derivedBorderAfter){
        borderStyle=parent._derivedBorderAfter;
    }else{
        borderStyle=field.borderAfter||facet.borderAfter;
    }
    if(borderStyle){
        field._derivedBorderAfter=borderStyle;
        borderStyle="border-"+(this.isRowHeader?"bottom":"right")+":"+
                      borderStyle+isc.semi;
        if(field.cssText)field.cssText+=borderStyle;
        else field.cssText=borderStyle;
    }
}
,isc.A.getChildFacetValues=function isc_CubeGrid_getChildFacetValues(parentFacetId,parentFacetValue,childFacetId,parentField,levelIndex){
    var values=this._getChildFacetValues(parentFacetId,parentFacetValue,
                                           childFacetId,parentField,levelIndex);
    if(this._multiFacetColumn&&childFacetId==this._treeChildFacetId){
        var rollupValue=this.getRollupValue(this._treeChildFacetId);
        if(rollupValue&&values.contains(rollupValue.id))values.remove(rollupValue.id);
    }
    return values;
}
,isc.A._getChildFacetValues=function isc_CubeGrid__getChildFacetValues(parentFacetId,parentFacetValue,childFacetId,parentField,levelIndex){
    if(parentFacetValue.facetValueGroup!=null||parentFacetValue.fieldGroup!=null){
        var facetValueGroupId=parentFacetValue.facetValueGroup||parentFacetValue.fieldGroup,
            facetValueGroup=this.getFacetValueGroup(facetValueGroupId);
        if(facetValueGroup!=null){
            facetValueGroup.facetId=childFacetId;
            this._inFacetValueGroup=facetValueGroupId;
            return facetValueGroup.facetValues||facetValueGroup.values||facetValueGroup.fields;
        }
    }
    this._inFacetValueGroup=null;
    if(parentFacetValue.fields)return parentFacetValue.fields;
    var childFacet=this.getFacet(childFacetId);
    if(childFacet==null||childFacet.values==null){
        return null;
    }
    if(childFacet.syncChanges!=false&&childFacet.synchColumnLayout!=false){
        this._inFacetValueGroup=childFacet.id;
    }
    if(parentFacetId!=null){
        parentFacetValue=(isc.isA.String(parentFacetValue)?
                            this.getFacetValue(parentFacetId,parentFacetValue):parentFacetValue);
        var parentFacet=this.getFacet(parentFacetId),
            minimized;
        if(parentField!=null&&parentField.minimized!=null){
            minimized=parentField.minimized;
        }else{
            minimized=parentFacet?parentFacet.minimized:false;
        }
        if(minimized){
            parentField.minimized=true;
            if(this._multiFacetColumn&&parentFacetId==this._treeParentFacetId){
                return[];
            }else{
                return this.getMinimizeValues(childFacetId);
            }
        }
    }
    if(childFacet.isTree){
        var valueTree=childFacet._valueTree;
        var facetPath=(parentField!=null?this.getHeaderFacetValues(parentField):{});
        for(var i=0;i<childFacet.values.length;i++){
            var facetValue=childFacet.values[i];
            facetPath[childFacetId]=facetValue.id;
            var fieldProperties=this.getFieldProperties(facetPath);
            if(fieldProperties!=null&&fieldProperties.collapsed!=null){
                facetValue.collapsed=fieldProperties.collapsed;
            }else{
                facetValue.collapsed=facetValue._defaultCollapsed;
            }
        }
        var openList=valueTree.getOpenList().getProperty("id");
        if(childFacet.showParentsLast&&
            !(this.inMultiFacetColumn(childFacet.id)&&
              this.getFacet(this._treeParentFacetId).showParentsLast))
        {
            openList=openList.reverse();
        }
        return openList;
    }
    if(this.flatRowAttributes&&this.isRowHeader){
        if(levelIndex==null)return childFacet.values;
        else return[childFacet.values[levelIndex].id];
    }
    var facetValues=childFacet.values.getProperty("id");
    var lastFacetValue=childFacet.values.last();
    if(lastFacetValue&&lastFacetValue._autoSum){
        facetValues.length=facetValues.length-1;
    }
    return facetValues;
}
,isc.A.getMinimizeValues=function isc_CubeGrid_getMinimizeValues(facetId){
    var facet=this.getFacet(facetId);
    var minimizeValues=facet.values.findAll("isMinimizeValue","true");
    if(minimizeValues!=null)return minimizeValues;
    minimizeValues=this.getRollupValue(facetId);
    if(minimizeValues!=null)return[minimizeValues];
    return[facet.values.last()];
}
,isc.A.getRollupValue=function isc_CubeGrid_getRollupValue(facetId){
    var facet=this.getFacet(facetId),
        rollupValueId=facet.rollupValue||this.rollupValue;
    if(rollupValueId!=null)return this.getFacetValue(facetId,rollupValueId);
}
,isc.A.checkValidCube=function isc_CubeGrid_checkValidCube(){
    var facetIds=this.getAllFacetIds();
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i],
            facet=this.getFacet(facetId);
        if(!facet){
            this.logWarn("No definition for facet: "+facetId);
            continue;
        }
        if(!facet.values||!isc.isAn.Array(facet.values)||facet.values.length==0){
            isc.logWarn("Visible facet "+facetId+" has no specified facetValues "+
                        "and no values for this facet were present in cube.data");
        }
    }
    if(this.haveRowFacets())this.checkFieldTree(true);
    if(this.haveColumnFacets())this.checkFieldTree(false);
}
,isc.A.checkFieldTree=function isc_CubeGrid_checkFieldTree(isRow){
    var facetIds=isRow?this.rowFacets:this.columnFacets,
        fieldTree=isRow?this.rowFields:this.colFields;
    for(var j=0;j<fieldTree.length-1;j++){
        var level=fieldTree[j];
        for(var i=0;i<level.length;i++){
            var field=level[i],
                values=field.childFacetValues;
            if(!values||!isc.isAn.Array(values)||values.length==0){
                isc.logWarn("Invalid cube: no facetValues at path: "+
                            this.echo(this.getHeaderFacetValues(field)));
            }
        }
    }
}
,isc.A._addRowFacetSumValues=function isc_CubeGrid__addRowFacetSumValues(){
    for(var i=0;i<this.rowFacets.length;i++){
        var facet=this.getFacet(this.rowFacets[i]);
        if(!facet.values.last()._autoSum){
            var sumFacetValue={
                id:facet.summaryValue||this.summaryValue,
                title:facet.summaryTitle||this.summaryTitle,
                facet:facet,
                selectionBoundary:"before",
                _derivedBorderBefore:this.summaryBorder,
                _autoSum:true
            }
            sumFacetValue[this.hiliteProperty]=this.summaryHilite;
            facet.values.add(sumFacetValue);
            facet.valuesIndex[sumFacetValue.id]=sumFacetValue;
       }
    }
}
,isc.A._addSumValueToLevel=function isc_CubeGrid__addSumValueToLevel(facet,level,fieldTree){
    var sumFacetValue=this.getFacetValue(facet.id,facet.summaryValue||this.summaryValue),
        field=this.makeField(facet,sumFacetValue,level);
    if(this.summaryBorder){
        var borderStyle="border-top:"+this.summaryBorder+isc.semi;
        if(field.cssText)field.cssText+=borderStyle;
        else field.cssText=borderStyle;
    }
    if(this.fieldTree[level+1]!=null){
        var childField=fieldTree[level+1].last();
        childField.parent=field;
        field.childFacetValues=[childField];
    }
    if(fieldTree[level]==null)fieldTree[level]=[];
    fieldTree[level].add(field);
}
,isc.A.getBoundaryProperty=function isc_CubeGrid_getBoundaryProperty(field,propertyName,beforeFlag){
    if(field==null)return null;
    var value;
    while(true){
        value=(field[propertyName]||field.facet[propertyName]||value);
        var parent=field.parent;
        if(parent&&(
            (beforeFlag&&parent.childFacetValues.first()==field)||
            (!beforeFlag&&parent.childFacetValues.last()==field)
            ))
        {
            field=field.parent;
        }else break;
    }
    return value;
}
,isc.A.getSelectionBoundaries=function isc_CubeGrid_getSelectionBoundaries(fields){
    var boundaries=[];
    for(var i=0;i<fields.length;i++){
        var field=fields[i];
        var boundary=this.getBoundaryProperty(field,"selectionBoundary");
        if(boundary){
            if(boundary=="both"){
                boundaries[i]=boundaries[i-1]=true;
            }else if(boundary=="before"){
                boundaries[i-1]=true;
            }else{
                boundaries[i]=true;
            }
        }
    }
    return boundaries;
}
,isc.A.findSelectionBoundary=function isc_CubeGrid_findSelectionBoundary(oldPos,newPos,boundaries){
    if(boundaries==null)return newPos;
    var start=Math.min(oldPos,newPos),
        end=Math.max(oldPos,newPos);
    for(var fieldNum=start;fieldNum<end;fieldNum++){
        if(boundaries[fieldNum]){
            return(newPos>oldPos?fieldNum:fieldNum+1);
        }
    }
    return newPos;
}
,isc.A.scrollToFacetValues=function isc_CubeGrid_scrollToFacetValues(facetValues,center){
    if(center==null)center=false;
    var row=this.getFacetValuesRow(facetValues),
        column=this.getFacetValuesColumn(facetValues);
    this.scrollCellIntoView(row!=-1?row:null,
        column!=-1?column:null,center?"center":"left",center?"center":"top",true);
}
,isc.A.scrollToFacetValue=function isc_CubeGrid_scrollToFacetValue(facetId,facetValueId){
    var facetValues={};
    facetValues[facetId]=facetValueId;
    this.scrollToFacetValues(facetValues);
}
,isc.A.getFacetValuesForIndex=function isc_CubeGrid_getFacetValuesForIndex(index,innerHeaders){
    var header=innerHeaders[index];
    if(this._multiFacetColumn&&header.childFacetValues!=null){
        var values={},
            rollupValue=this.getRollupValue(this._treeChildFacetId);
        if(rollupValue==null)return null;
        values[this._treeChildFacetId]=rollupValue.id;
        while(true){
            var facetId=header.facet.id;
            values[facetId]=header.facetValueId;
            if(header.parent==null)break;
            header=header.parent;
        }
        return values;
    }
    if(header==null){
        this.logWarn("No such facetValue "+index+
                     ", number of innerHeaders: "+innerHeaders.length);
        return null;
    }
    return this.getHeaderFacetValues(header);
}
,isc.A.getHeadersForIndex=function isc_CubeGrid_getHeadersForIndex(index,inRows){
    var headers=[],
        field=(inRows?this.innerRowFields[index]:this.innerColFields[index]);
    while(field!=null){
        headers.addAt(this.getHeaderForField(field),0);
        field=field.parent;
    }
    return headers;
}
,isc.A.getHeaderFacetValues=function isc_CubeGrid_getHeaderFacetValues(header){
    var values={};
    while(true){
        var facetId=header.facet.id;
        values[facetId]=header.facetValueId;
        if(header.parent==null)break;
        header=header.parent;
    }
    return values;
}
,isc.A.getSideFacetValues=function isc_CubeGrid_getSideFacetValues(cellRecord,isRow){
    var sideFacets=this.groupByRow?this.rowFacets:this.colFacets,
        sideFacetValues={};
    for(var i=0;i<sideFacets.length;i++){
        sideFacetValues[sideFacets[i]]=cellRecord[sideFacets[i]];
    }
    return sideFacetValues;
}
,isc.A.getCellFacetValues=function isc_CubeGrid_getCellFacetValues(rowNum,colNum,rowsOnly,colsOnly){
    if((!colsOnly&&(rowNum+1>this.numRows))||(!rowsOnly&&(colNum+1>this.numCols))){
        return null;
    }
    var facetValues;
    if(!colsOnly&&(this.innerRowFields.length>0)){
        facetValues=this.getFacetValuesForIndex(rowNum,this.innerRowFields);
    }
    if(!rowsOnly&&(this.innerColFields.length>0)){
        var colFacetValues=this.getFacetValuesForIndex(colNum,this.innerColFields);
        if(facetValues!=null){
            isc.addProperties(facetValues,colFacetValues);
        }else{
            facetValues=colFacetValues;
        }
    }
    isc.addProperties(facetValues,this.fixedFacetValues);
    return facetValues;
}
,isc.A.getFacetValuesColumn=function isc_CubeGrid_getFacetValuesColumn(facetValues){
    if(!this.haveColumnFacets())return-1;
    var colFacets=[],colFields,
        outerFacet,outerColIndex;
    for(var facetID in facetValues){
        var colIndex=this.columnFacets.indexOf(facetID);
        if(colIndex<0)continue;
        var facet=this.getFacet(facetID);
        if(!facet){
            this.logWarn("Unable to find facet definition for column facet:"+facetID);
            continue;
        }
        if(outerColIndex==null||colIndex<outerColIndex){
            outerFacet=facetID;
            outerColIndex=colIndex;
        }
    }
    if(outerColIndex<0)return-1;
    colFields=this.colFields[outerColIndex];
    for(var i=outerColIndex;i<this.columnFacets.length;i++){
        colFacets.add(this.columnFacets[i]);
    }
    return this.getFacetValuesOffset(facetValues,colFacets,colFields,false,true);
}
,isc.A.getFacetValuesRow=function isc_CubeGrid_getFacetValuesRow(facetValues){
    if(!this.haveRowFacets())return-1;
    var rowFacets=[],rowFields,
        outerFacet,outerRowIndex;
    for(var facetID in facetValues){
        var rowIndex=this.rowFacets.indexOf(facetID);
        if(rowIndex<0)continue;
        var facet=this.getFacet(facetID);
        if(!facet){
            this.logWarn("Unable to find facet definition for row facet:"+facetID);
            continue;
        }
        if(outerRowIndex==null||rowIndex<outerRowIndex){
            outerFacet=facetID;
            outerRowIndex=rowIndex;
        }
    }
    if(outerRowIndex<0)return-1;
    rowFields=this.rowFields[outerRowIndex];
    for(var i=outerRowIndex;i<this.rowFacets.length;i++){
        rowFacets.add(this.rowFacets[i]);
    }
    return this.getFacetValuesOffset(facetValues,rowFacets,rowFields,false,true);
}
,isc.A.getRowFacetValues=function isc_CubeGrid_getRowFacetValues(rowNum){
    return this.getCellFacetValues(rowNum,null,true);
}
,isc.A.getColumnFacetValues=function isc_CubeGrid_getColumnFacetValues(colNum){
    return this.getCellFacetValues(null,colNum,null,true);
}
,isc.A.getCellRecord=function isc_CubeGrid_getCellRecord(rowNum,colNum,returnFillers){
    if(rowNum==null||rowNum<0||colNum<0)return null;
    if(colNum==null)colNum=0;
    if(this.innerRowFields==null||this.innerColFields==null)return null;
    if(this.shouldIndexCellRecords())this.indexCellRecords();
    var record=this.cellIndex[colNum]!=null?this.cellIndex[colNum][rowNum]:null;
    if(record&&record._isFiller&&!returnFillers)return null;
    return record;
}
,isc.A.setData=function isc_CubeGrid_setData(){
    this.Super("setData",arguments);
    this.cellIndex=null;
    this._fillerCells=null;
}
,isc.A.shouldIndexCellRecords=function isc_CubeGrid_shouldIndexCellRecords(){
    return this.cellIndex==null||
        this.requiresStrictIndexing&&this._shouldIndexCellRecords;
}
,isc.A.indexCellRecords=function isc_CubeGrid_indexCellRecords(){
    var batchesInProgress=this._indexingBatchesInProgress;
    if(batchesInProgress!=null){
        for(var i=0;i<batchesInProgress.length;i++){
            var batch=batchesInProgress[i];
            if(batch!=null)isc.Timer.clear(batch);
        }
        this._indexingBatchesInProgress=null;
    }
    delete this._shouldIndexCellRecords;
    this.cellIndex=[];
    var batchSize=Math.round(5000000/
                               (this.innerRowFields.length*this.innerColFields.length));
    if(!this.batchedIndexing||this.data.length<batchSize){
        this.addRecordsToIndex(this.data);
    }else{
        this.logInfo("Using batchSize: "+batchSize,"cellIndexing");
        this._indexingBatchesInProgress=[];
        this._indexingBatchesBatchSize=batchSize;
        this._indexingBatchesCompleteFetch=function(){};
        var batches=Math.ceil(this.data.length/batchSize);
        for(var i=0;i<batches;i++){
            var lastBatch=i==batches-1;
            this._addIndexingTimer(i,batchSize,lastBatch);
        }
    }
    if(this._fillerCells){
        this._fillerCells=this._fillerCells.filter(function(cellRecord){
            return!cellRecord._deleted;
        });
        this.addRecordsToIndex(this._fillerCells);
    }
}
,isc.A._addIndexingTimer=function isc_CubeGrid__addIndexingTimer(batchNumber,batchSize,lastBatch){
    var cg=this,
        batches=this._indexingBatchesInProgress;
    var startIndex=batchNumber*batchSize;
    if(startIndex+batchSize>cg.data.length){
        batchSize=cg.data.length-startIndex;
    }
    batches[batchNumber]=
        isc.Timer.setTimeout(function(){
            cg.addRecordsToIndexChecked(cg.data,startIndex,startIndex+batchSize);
            if(lastBatch){
                cg._indexingBatchesInProgress=null;
                cg._indexingBatchesCompleteFetch();
                cg.doneIndexing();
                cg.body.markForRedraw();
            }else{
                batches[batchNumber]=null;
            }
        });
}
,isc.A.doneIndexing=function isc_CubeGrid_doneIndexing(){}
,isc.A._addNextBatchRecordsToIndex=function isc_CubeGrid__addNextBatchRecordsToIndex(nRecords){
    var batchesInProgress=this._indexingBatchesInProgress;
    if(batchesInProgress==null)return;
    for(var i=0;i<batchesInProgress.length;i++){
        if(batchesInProgress[i]!=null){
            var startIndex=this._indexingBatchesBatchSize*i;
            this.addRecordsToIndexChecked(this.data,startIndex,startIndex+nRecords);
            break;
        }
    }
}
,isc.A.isCellIndexingPending=function isc_CubeGrid_isCellIndexingPending(recordNum){
    var batchesInProgress=this._indexingBatchesInProgress;
    if(batchesInProgress==null)return false;
    var batchSize=this._indexingBatchesBatchSize;
    return batchesInProgress[recordNum/batchSize]!=null;
}
,isc.A.addRecordsToIndexChecked=function isc_CubeGrid_addRecordsToIndexChecked(data,startIndex,endIndex){
    if(startIndex>=data.length)return;
    this.addRecordsToIndex(data,startIndex,endIndex>data.length?data.length:endIndex);
}
,isc.A.addRecordsToIndex=function isc_CubeGrid_addRecordsToIndex(data,startIndex,endIndex){
    startIndex=startIndex||0;
    endIndex=endIndex||data.length;
    this.logInfo("indexing from "+startIndex+" through "+endIndex,"cellIndexing");
    var start=isc.timeStamp();
    if(this.cellIndex==null){
        this.cellIndex=[];
        this.logWarn("indexCellRecords() should be called to rebuild all the indices "+
                     "rather than manually calling addRecordsToIndex() on various cell data");
        this._shouldIndexCellRecords=true;
    }
    var haveColumnFacets=this.haveColumnFacets(),
        haveRowFacets=this.haveRowFacets();
    if(haveColumnFacets){
        for(var i=0;i<this.innerColFields.length;i++){
            var field=this.innerColFields[i];
            if(field==null)continue;
            field.coordinate=i;
        }
    }
    if(haveRowFacets){
        if(!this.multiRowHeaders||!this.groupByRow){
            for(var i=0;i<this.innerRowFields.length;i++){
                var field=this.innerRowFields[i];
                if(field==null)continue;
                field.coordinate=i;
            }
        }else{
            this.rowFieldMap=[];
            var total=0;
            for(var i=0;i<this.innerRowFields.length;i++){
                var field=this.innerRowFields[i];
                if(field==null)continue;
                field._index=i;
                field.coordinate=total;
                for(var j=field.coordinate;j<(field.coordinate+field.groupCount);j++){
                    this.rowFieldMap[j]=field;
                }
                total+=field.groupCount;
            }
        }
    }
    var fixedFacets;
    if(this.fixedFacetValues)fixedFacets=isc.getKeys(this.fixedFacetValues);
    var outerRowFields=this.rowFields[0],
        outerColFields=this.colFields[0];
    for(var i=startIndex;i<endIndex;i++){
        var cellRecord=data[i];
        if(fixedFacets!=null){
            var matches=true;
            for(var j=0;j<fixedFacets.length;j++){
                var fixedFacet=fixedFacets[j];
                if(cellRecord[fixedFacet]!=this.fixedFacetValues[fixedFacet]){
                    matches=false;
                    break;
                }
            }
            if(!matches)continue;
        }
        var row=(!haveRowFacets?0:
                   this.getFacetValuesOffset(cellRecord,this.rowFacets,outerRowFields,true)),
            col=(!haveColumnFacets?0:
                   this.getFacetValuesOffset(cellRecord,this.columnFacets,outerColFields,true));
        cellRecord._rowNum=row;
        cellRecord._colNum=col;
        if(row<0||col<0)continue;
        if(this.cellIndex[col]==null)this.cellIndex[col]=[];
        var oldCellRecord=this.cellIndex[col][row];
        if(oldCellRecord){
            if(oldCellRecord._isFiller){
                oldCellRecord._deleted=true;
            }else{
                if(cellRecord._isFiller){
                    if(!this._realRecordOverwrite){
                        this._realRecordOverwrite=true;
                        this.logWarn("attempted to overwrite real cell data at row "+row+
                                     ", column "+col+" with a filler cell!");
                    }
                    cellRecord._deleted=true;
                    continue;
                }
            }
        }
        this.cellIndex[col][row]=cellRecord;
        if(this.inlinedFacet)this.addInlinedValues(cellRecord,row,col);
    }
    if(this.logIsDebugEnabled("cgTiming")){
        var totalTime=(isc.timeStamp()-start);
        this.logDebug("indexed cells: "+totalTime+"ms ("+
                      data.getLength()+" cellRecords at "+
                      (isc.Browser.isSafari?(totalTime/data.getLength())
                        :(totalTime/data.getLength()).toFixed(2))
                             +"ms per cellRecord)",
                      "cgTiming");
    }
}
,isc.A.removeRecordsFromIndex=function isc_CubeGrid_removeRecordsFromIndex(data,startIndex,endIndex){
    startIndex=startIndex||0;
    endIndex=endIndex||data.length;
    this.logInfo("removing from "+startIndex+" through "+endIndex,"cellIndexing");
    if(this.cellIndex==null)return;
    for(var i=startIndex;i<endIndex;i++){
        var cellRecord=data[i],
            rowNum=cellRecord._rowNum,
            colNum=cellRecord._colNum;
        if(cellRecord==this.cellIndex[colNum][rowNum]){
            var fillerCell=this.getCellFacetValues(rowNum,colNum);
            fillerCell._isFiller=true;
            this._fillerCells.add(fillerCell);
            this.cellIndex[colNum][rowNum]=fillerCell;
        }else{
            this.logWarn("unable to remove record with ID "+cellRecord[this.cellIdProperty]+
                         " due to inconsistency between data and cellIndex arrays");
        }
    }
}
,isc.A.getCellRow=function isc_CubeGrid_getCellRow(cellRecord){
    return this.haveRowFacets()?
            this.getFacetValuesOffset(cellRecord,this.rowFacets,this.rowFields[0],true):-1;
}
,isc.A.getCellColumn=function isc_CubeGrid_getCellColumn(cellRecord){
    return this.haveColumnFacets()?
            this.getFacetValuesOffset(cellRecord,this.columnFacets,this.colFields[0],true):-1;
}
,isc.A.getCellCoordinates=function isc_CubeGrid_getCellCoordinates(cellRecord){
    var row=this.getCellRow(cellRecord),
        col=this.getCellColumn(cellRecord);
    if(row<0||col<0)return null;
    return[row,col];
}
,isc.A.addInlinedValues=function isc_CubeGrid_addInlinedValues(cellRecord,startRow,startCol){
    var multi=this.inlinedFacets!=null,
        firstIsRow=this.rowFacets.contains(this.inlinedFacet.id),
        rowFacet=firstIsRow?this.inlinedFacet:multi?this.inlinedFacets[1]:null,
        colFacet=!firstIsRow?this.inlinedFacet:multi?this.inlinedFacets[1]:null,
        numRowValues=rowFacet?rowFacet.values.length:1,
        numColValues=colFacet?colFacet.values.length:1,
        startRowField=this.multiRowHeaders?this.rowFieldMap[startRow]:
                                               this.innerRowFields[startRow],
        startColField=this.innerColFields[startCol],
        rowParent=(startRowField?startRowField.parent:null),
        colParent=(startColField?startColField.parent:null);
    var rowPivotValue,colPivotValue;
    if(rowFacet&&startRowField.pivotFacetValueId){
        rowPivotValue=cellRecord[startRowField.pivotFacetValueId];
    }
    if(colFacet&&startColField.pivotFacetValueId){
        colPivotValue=cellRecord[startColField.pivotFacetValueId];
    }
    if(rowPivotValue!=null||colPivotValue!=null){
    }
    for(var rowNum=startRow;rowNum<startRow+numRowValues;rowNum++){
        var rowField=this.multiRowHeaders?this.rowFieldMap[rowNum]:this.innerRowFields[rowNum];
        if(rowField==null||
            (rowParent!=null&&rowParent!=rowField.parent)||
            (rowPivotValue!=null&&rowField.pivotValue!=rowPivotValue))break;
        for(var colNum=startCol;colNum<startCol+numColValues;colNum++){
            var colField=this.innerColFields[colNum];
            if(colField==null||
                (colParent!=null&&colParent!=colField.parent)||
                (colPivotValue!=null&&colField.pivotValue!=colPivotValue))break;
            if(this.cellIndex[colNum]==null)this.cellIndex[colNum]=[];
            this.cellIndex[colNum][rowNum]=cellRecord;
        }
    }
}
,isc.A.getFacetValuesOffset=function isc_CubeGrid_getFacetValuesOffset(facetValues,facetIds,outerFields,isCellRecord,sparseValues){
    var field=this.getFacetValuesField(facetValues,facetIds,outerFields,isCellRecord,sparseValues);
    if(!field||!field.isRowHeader&&!this.fieldIsVisible(field,true))return-1;
    if(!this.multiRowHeaders)return field.coordinate;
    if(!!field.isRowHeader!=this.groupByRow)return field.coordinate;
    return field.coordinate+(isCellRecord?facetValues[this.groupFacetId]:0);
}
,isc.A.getFacetValuesField=function isc_CubeGrid_getFacetValuesField(facetValues,facetIds,outerFields,isCellRecord,sparseValues){
    var fields=outerFields;
    var treeChildRollupValue;
    if(this._treeChildFacetId!=null){
        treeChildRollupValue=this.getRollupValue(this._treeChildFacetId);
    }
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i],
            facetValueId=facetValues[facetId],
            foundMatch=false;
        if(sparseValues&&facetValueId===undef){
            if(fields[0].childFacetValues==null)return fields[0];
            var remainingFacets=facetIds.slice(i+1);
            for(var j=0;j<fields.length;j++){
                var field=fields[j];
                var matchingField=this.getFacetValuesField(facetValues,remainingFacets,
                                                             field.childFacetValues,false,true);
                if(matchingField){
                    return matchingField;
                }
            }
            return null;
        }
        if(this.inlinedFacet&&isCellRecord&&this.getFacet(facetId).inlinedValues){
            var firstField=fields[0];
            if(!firstField.pivotValue){
                if(!firstField.childFacetValues){
                    return firstField;
                }else{
                    fields=firstField.childFacetValues;
                    break;
                }
            }else{
                var pivotValue=facetValues[firstField.pivotFacetValueId];
                var field=fields.find("pivotValue",pivotValue);
                return field;
            }
        }
        for(var j=0;j<fields.length;j++){
            var field=fields[j];
            if(field==null)continue;
            var undef;
            if(field.facetValueId==facetValueId){
                if(field.pivotValue){
                    if(facetValues[field.facetId]!=field.pivotFacetValueId)continue;
                }
                if(field.childFacetValues==null)return field;
                if(field.facet.id==this._treeParentFacetId){
                    if(treeChildRollupValue!=null&&
                        facetValues[this._treeChildFacetId]==treeChildRollupValue.id)
                    {
                        return field;
                    }
                }
                foundMatch=true;
                fields=field.childFacetValues;
                break;
            }
        }
        if(!foundMatch)return null;
    }
    return null;
}
,isc.A.getValueProperty=function isc_CubeGrid_getValueProperty(rowNum,colNum){
    if(!this.inlinedFacet)return this.valueProperty;
    var inlinedFacetValue=this.getFacetValueAtCoord(this.inlinedFacet.id,rowNum,colNum);
    if(!this.inlinedFacets)return inlinedFacetValue;
    var secondValue=this.getFacetValueAtCoord(this.inlinedFacets[1].id,rowNum,colNum);
    var arr=this._inlineJoinArray;
    arr[0]=inlinedFacetValue;
    arr[1]=secondValue;
    return arr.join(this.inlinedFacetValueSeparator);
}
,isc.A.getCellValue=function isc_CubeGrid_getCellValue(record,rowNum,colNum){
    var cellRecord=this._getEditValues(rowNum,colNum)
                        ?this.getEditedRecord(rowNum,colNum,true)
                        :this.getCellRecord(rowNum,colNum);
    var value,
        isEditCell=(this._editorShowing&&
                      this._editRowNum==rowNum&&this._editColNum==colNum&&
                      this.canEditCell(rowNum,colNum));
    if(isEditCell){
        value=this.getEditItemCellValue(cellRecord,rowNum,colNum);
    }else{
        if(cellRecord==null)return this.emptyCellValue;
        var valueProperty=this.getValueProperty(rowNum,colNum);
        value=cellRecord[valueProperty];
        if(this.haveColumnFacets()){
            var facetId=this.metricFacetId;
            if(this.getFacet(this.metricFacetId)==null)facetId=this.columnFacets.last();
            var facetValue=this.getFacetValue(facetId,this.innerColFields[colNum].facetValueId);
            if(facetValue&&facetValue.getCellValue){
                isc.Func.replaceWithMethod(facetValue,"getCellValue",
                                                 "viewer,record,value,rowNum,colNum");
                value=facetValue.getCellValue(this,cellRecord,rowNum,colNum);
            }
        }
        value=this._formatCellValue(value,cellRecord,facetValue,rowNum,colNum);
    }
    var cellHilite;
    if(this.innerColFields.length>0){
        cellHilite=this.innerColFields[colNum][this.hiliteProperty];
        if(cellHilite!=null){
                    value=this.applyHiliteHTML(cellHilite,value);
                    value=this.applyHiliteIcon(cellHilite,this.innerColFields[colNum],value);
                }
    }
    if(this.innerRowFields.length>0){
        var field=this.multiRowHeaders?this.rowFieldMap[rowNum]:this.innerRowFields[rowNum];
        cellHilite=field?field[this.hiliteProperty]:null;
        if(cellHilite!=null){
            value=this.applyHiliteHTML(cellHilite,value);
            value=this.applyHiliteIcon(cellHilite,field,value);
        }
    }
    if(this.canEdit&&this.showErrorIcons&&this.cellHasErrors(rowNum,colNum)){
        value=this.getErrorIconHTML(record,rowNum,colNum)+value;
    }
    cellHilite=cellRecord[this.hiliteProperty];
    if(cellHilite!=null){
            value=this.applyHiliteHTML(cellHilite,value);
            value=this.applyHiliteIcon(cellHilite,{},value);
        }
    return value;
}
);
isc.evalBoundary;isc.B.push(isc.A.getValueFormat=function isc_CubeGrid_getValueFormat(rowNum,colNum){
    if(this.valueFormat!=null)return this.valueFormat;
    var dataSource=this.getDataSource();
    if(dataSource==null)return null;
    var valueProperty=this.getValueProperty(rowNum,colNum),
        valueDSField=dataSource.getField(valueProperty)
    ;
    return valueDSField?valueDSField.format:null;
}
,isc.A.getCellStyle=function isc_CubeGrid_getCellStyle(record,rowNum,colNum){
    var styleIndex=this.body.getCellStyleIndex(record,rowNum,colNum);
    return this.body.getCellStyleName(styleIndex&8,record,rowNum,colNum);
}
,isc.A.getCellCSSText=function isc_CubeGrid_getCellCSSText(record,rowNum,colNum){
    var cellRecord=this.getCellRecord(rowNum,colNum),
        cellHilite,
        cssText,
        styleCSSText,
        styleIndex=this.body.getCellStyleIndex(record,rowNum,colNum);
    if(this.innerColFields.length>0){
        var field=this.innerColFields[colNum];
        cssText=this.addObjectHilites(field,cssText);
    }
    if(this.innerRowFields.length>0){
        var field=this.innerRowFields[rowNum];
        cssText=this.addObjectHilites(field,cssText);
    }
    if(cellRecord){
        if(this.inlinedFacet!=null){
            var field=this.getCellField(rowNum,colNum);
            cssText=this.getRecordHiliteCSSText(cellRecord,cssText,field,true);
        }else{
            cssText=this.addObjectHilites(cellRecord,cssText);
        }
    }
    styleIndex=(styleIndex&~8);
    if(styleIndex&7){
        var styleName=this.body.getCellStyleName(styleIndex,record,rowNum,colNum),
            styleCSSText=isc.Element.getStyleText(styleName,true);
        cssText=(cssText!=null?cssText+styleCSSText:styleCSSText);
    }
    if(this.colBorders[colNum]!=null){
        if(cssText==null)cssText=this.colBorders[colNum];
        else cssText+=this.colBorders[colNum];
    }
    if(this.rowBorders[rowNum]!=null){
        if(cssText==null)cssText=this.rowBorders[rowNum];
        else cssText+=this.rowBorders[rowNum];
    }
    if(this.canEdit==true){
        if(this.editFailedBaseStyle==null&&this.editFailedCSSText&&
            this.cellHasErrors(rowNum,colNum))
        {
            if(cssText==null)cssText=this.editFailedCSSText;
            else cssText+=this.editFailedCSSText;
        }
        if(this.editPendingBaseStyle==null&&this.editPendingCSSText&&
            this.cellHasChanges(rowNum,colNum,false))
        {
            if(cssText==null)cssText=this.editPendingCSSText;
            else cssText+=this.editPendingCSSText;
        }
    }
    return cssText;
}
,isc.A.getBorderStyles=function isc_CubeGrid_getBorderStyles(fields,rowBorders){
    var borders=[];
    for(var i=0;i<fields.length;i++){
        var field=fields[i];
        if(field==null)continue;
        var border=this.getBoundaryProperty(field,"bodyBorder");
        if(border){
            if(!border.endsWith(isc.semi))border+=isc.semi;
            if(!border.startsWith("border")){
                border=(rowBorders?"border-bottom:":"border-right:")+border;
            }
            borders[i]=border;
        }
        if(field._derivedBorderBefore){
            border="border-"+(rowBorders?"top":"left")+":"+
                     field._derivedBorderBefore+isc.semi;
            if(borders[i])borders[i]+=border;
            else borders[i]=border;
        }
        if(field._derivedBorderAfter){
            border="border-"+(rowBorders?"bottom":"right")+":"+
                     field._derivedBorderAfter+isc.semi;
            if(borders[i])borders[i]+=border;
            else borders[i]=border;
        }
    }
    return borders;
}
,isc.A.bodyDrawing=function isc_CubeGrid_bodyDrawing(){
    if(this.autoSizeHeaders&&this.haveRowFacets()&&
        this.rowHeights==null)
    {
        if(this.shouldIndexCellRecords())this.indexCellRecords();
        return"&nbsp;";
    }
    if(this.dataSource&&this.autoFetchData&&this.facets!=null){
        if(this.initialCriteria!=null)this.criteria=this.initialCriteria;
        this._cgFetchData();
    }
    delete this._redrawOnScrollInProgress;
}
,isc.A.getCoordFacetValue=function isc_CubeGrid_getCoordFacetValue(coordinate,isRow){
    var innerFields=(isRow?this.innerRowFields:this.innerColFields),
        field=innerFields[coordinate],
        facetValueId=field.facetValueId;
    if(this._multiFacetColumn&&field.facet.id==this._treeParentFacetId){
        var facetValue=this.getRollupValue(this._treeChildFacetId);
        if(facetValue==null)return null;
        return facetValue.id;
    }
    return facetValueId;
}
,isc.A.getFacetValueAtCoord=function isc_CubeGrid_getFacetValueAtCoord(facetId,rowNum,colNum){
    var isRow=this.rowFacets.contains(facetId),
        fields=!isRow?this.innerColFields:
                   (this.multiRowHeaders?this.rowFieldMap:this.innerRowFields),
        field=isRow?fields[rowNum]:fields[colNum];
    while(field.facet.id!=facetId){
        field=field.parent;
    }
    return field.facetValueId;
}
,isc.A.addCellField=function isc_CubeGrid_addCellField(queryFields,rowNum,colNum){
     switch(this.hideEmptyAxis){
     case"row":
         if(!queryFields[rowNum]){
             var fieldTable=this.multiRowHeaders?this.rowFieldMap:this.innerRowFields;
             queryFields[rowNum]=fieldTable[rowNum];
         }
         break;
     case"column":
         if(!queryFields[colNum])queryFields[colNum]=this.innerColFields[colNum];
         break;
     }
}
,isc.A.addCellToQuery=function isc_CubeGrid_addCellToQuery(rowNum,colNum){
    var rowFacetValue=this.getCoordFacetValue(rowNum,true),
        colFacetValue=this.getCoordFacetValue(colNum);
    var rowGroup=this.getFacetValueGroupId(rowNum,true),
        colGroup=this.getFacetValueGroupId(colNum);
    if(!rowGroup._queries){
        rowGroup._queries={};
        this.rowGroups.add(rowGroup);
    }
    if(!colGroup._indexValue){
        if(colGroup==this.getFacet(colGroup.id)){
            colGroup._indexValue=colGroup.id;
        }else{
            colGroup._indexValue=this.getFacetPath(colGroup);
        }
    }
    var query=rowGroup._queries[colGroup._indexValue];
    var existing=true;
    if(query==null){
        query=this.makeRegionQuery(rowNum,colNum);
        rowGroup._queries[colGroup._indexValue]=query;
        this.queries.add(query);
        existing=false;
    }
    var innerField=this.innerRowFields[rowNum];
    if(this._multiFacetColumn&&innerField.facet.id==this._treeParentFacetId){
        var facetId=this._treeParentFacetId,
            facetValueId=innerField.facetValueId;
        if(query._treeValuesIndex==null){
            query._treeValuesIndex={};
            query[facetId]=[];
        }
        if(query._treeValuesIndex[facetValueId]==null){
            query[facetId].add(facetValueId);
            query._treeValuesIndex[facetValueId]=isc.emptyString;
        }
    }
    if(this.hideEmptyAxis!="column"){
        var rowValuesIndex=query._rowValuesIndex;
        if(rowValuesIndex[rowFacetValue]==null){
            query[this.rowFacets.last()].add(rowFacetValue);
            rowValuesIndex[rowFacetValue]=isc.emptyString;
        }
    }
    if(this.hideEmptyAxis!="row"){
        var colValuesIndex=query._colValuesIndex;
        if(colValuesIndex[colFacetValue]==null){
            query[this.columnFacets.last()].add(colFacetValue);
            colValuesIndex[colFacetValue]=isc.emptyString;
        }
    }
}
,isc.A.getFacetValueGroupId=function isc_CubeGrid_getFacetValueGroupId(coordinate,isRow){
    var innerFields=(isRow?this.innerRowFields:this.innerColFields),
        field=innerFields[coordinate];
    return(field.parent?field.parent:field.facet);
}
,isc.A.makeRegionQuery=function isc_CubeGrid_makeRegionQuery(rowNum,colNum){
    var query=isc.addProperties({},this.fixedFacetValues,
                                        this.hideEmptyAxis!="row"?
                                            this.getGroupFacetValues(colNum):null,
                                        this.hideEmptyAxis!="column"?
                                            this.getGroupFacetValues(rowNum,true):null);
    query[this.rowFacets.last()]=[];
    query._rowValuesIndex={};
    query[this.columnFacets.last()]=[];
    query._colValuesIndex={};
    return query;
}
,isc.A.getGroupFacetValues=function isc_CubeGrid_getGroupFacetValues(coordinate,isRow){
    var innerFields=(isRow?this.innerRowFields:this.innerColFields),
        field=innerFields[coordinate];
    if(this._multiFacetColumn&&field.facet.id==this._treeParentFacetId){
        return this.getHeaderFacetValues(field);
    }
    return(field.parent?this.getHeaderFacetValues(field.parent):{});
}
,isc.A.combineAllQueries=function isc_CubeGrid_combineAllQueries(){
    var colFacets=this.columnFacets;
    if(colFacets.length<2)return;
    var rowGroups=this.rowGroups;
    for(var i=0;i<rowGroups.length;i++){
        var rowGroup=rowGroups[i];
        this.combineRowGroupQueries(isc.getValues(rowGroup._queries));
    }
}
,isc.A.combineRowGroupQueries=function isc_CubeGrid_combineRowGroupQueries(queries){
    var removedQueries=[];
    for(var i=0;i<queries.length;i++){
        var firstQuery=queries[i];
        for(var j=0;j<queries.length;j++){
            var secondQuery=queries[j];
            if(i==j)continue;
            if(removedQueries.contains(firstQuery)||
                removedQueries.contains(secondQuery))continue;
            if(this.combineQueries(secondQuery,firstQuery)){
                removedQueries.add(firstQuery);
                this.queries.remove(firstQuery);
                break;
            }
        }
    }
}
,isc.A.combineQueries=function isc_CubeGrid_combineQueries(firstQuery,secondQuery){
    var colFacets=this.columnFacets,
        innerFacetId=colFacets.last(),
        secondFacetId=colFacets[colFacets.length-2],
        outerFacetIds=colFacets.slice(0,colFacets.length-2);
    var firstValues=firstQuery[innerFacetId];
    if(this.requestAllFacetValuesImplicitly){
        if(firstValues!=null&&
            firstValues.length==this.getFacet(innerFacetId).values.length)
        {
            delete firstQuery[innerFacetId];
            firstValues=null;
        }
    }
    for(var j=0;j<outerFacetIds.length;j++){
        var facetId=outerFacetIds[j];
        if(firstQuery[facetId]!=secondQuery[facetId]){
            return false;
        }
    }
    var combine=false,
        secondValues=secondQuery[innerFacetId];
    if(firstValues==null&&secondValues==null){
        combine=true;
    }else{
        if(firstValues!=null&&secondValues!=null&&
            firstValues.length==secondValues.length&&
            firstValues.intersect(secondValues).length==firstValues.length)
        {
            combine=true;
        }
    }
    if(combine){
        var secondValue=secondQuery[secondFacetId],
            firstValue=firstQuery[secondFacetId];
        if(firstValue==null&&secondValue==null)return true;
        if(firstValue==null)firstValue=[];
        else if(!isc.isAn.Array(firstValue))firstValue=[firstValue];
        if(isc.isAn.Array(secondValue))firstValue.addList(secondValue);
        else if(secondValue!=null)firstValue.add(secondValue);
        if(firstValue!=null)firstQuery[secondFacetId]=firstValue;
        return true;
    }else{
        return false;
    }
}
,isc.A._cgFetchData=function isc_CubeGrid__cgFetchData(fetchNow,delayed,callback,requestProperties){
    if(!this.body){
        this.createChildren();
    }
    var grid=this.body,
        area=grid.getDrawArea();
    var startRow=area[0],
        endRow=area[1],
        startCol=area[2],
        endCol=area[3];
    if(this.shouldIndexCellRecords())this.indexCellRecords();
    if(this._indexingBatchesInProgress!=null){
        this._indexingBatchesCompleteFetch=function(){
            this._cgFetchData(fetchNow,delayed,callback,requestProperties);
        }
        this.logInfo("Postponing _cgFetchData() call due to cell-indexing batch in progress");
        return;
    }
    this.queries=[];
    this.rowGroups=[];
    var queryFields;
    if(this.hideEmptyFacetValues){
        if(this.hideEmptyAxis=="row"||this.hideEmptyAxis=="column")queryFields=[];
    }
    var missingCells=0;
    for(var rowNum=startRow;rowNum<=endRow;rowNum++){
        for(var colNum=startCol;colNum<=endCol;colNum++){
            if(this.getCellRecord(rowNum,colNum,true)==null){
                var rowFacetValue=this.getCoordFacetValue(rowNum,true),
                    colFacetValue=this.getCoordFacetValue(colNum);
                if(rowFacetValue==null||colFacetValue==null)continue;
                missingCells++;
                if(!fetchNow&&this.body._scrollRedraw&&this.fetchDelay>0){
                    if(this.fetchTimeout){
                        isc.Timer.clear(this.fetchTimeout);
                        this.fetchTimeout=null;
                    }
                    this.fetchTimeout=this.delayCall("getData",[true],this.fetchDelay);
                    return;
                }
                this.addCellToQuery(rowNum,colNum);
                if(queryFields)this.addCellField(queryFields,rowNum,colNum);
                if(this.cellIndex[colNum]==null)this.cellIndex[colNum]=[];
                this.cellIndex[colNum][rowNum]=Array.LOADING;
            }
        }
    }
    if(missingCells==0)return;
    var oldNumQueries=this.queries.length;
    this.combineAllQueries();
    this.rowGroups.setProperty("_queries",null);
    var dsRequest=isc.addProperties({},this.lodContext);
    dsRequest.operation=dsRequest.operationId=this.fetchOperation;
    dsRequest._cgArea=area;
    dsRequest._queryFields=queryFields;
    dsRequest._missingCells=missingCells;
    dsRequest._oldDataLength=this.data.getLength();
    if(requestProperties!=null){
        isc.addProperties(dsRequest,requestProperties);
    }
    if(callback!=null){
        dsRequest.internalClientContext={fetchCallback:callback};
    }
    dsRequest.textMatchStyle=this.autoFetchTextMatchStyle;
    var lastCallback={target:this,methodName:"_lastFetchDataReply"};
    var numQueries=this.queries.length;
    if(this.hideEmptyFacetValues&&this.hideEmptyAxis==null){
        this.getDataSource().fetchData(this.fixedFacetValues,
                                       lastCallback,
                                       dsRequest);
        return;
    }
    isc.rpc.startQueue();
    var emptyCriteria=isc.isAn.emptyObject(this.criteria);
    for(var i=0;i<numQueries;i++){
        var query=this.queries[i];
        delete query._rowValuesIndex;
        delete query._colValuesIndex;
        delete query._treeValuesIndex;
        if(!emptyCriteria){
            query=isc.DataSource.combineCriteria(this.criteria,query,"and",dsRequest.textMatchStyle);
        }
        this.getDataSource().fetchData(query,
                                       i<numQueries-1
                                           ?{target:this,methodName:"_fetchDataReply"}
                                           :lastCallback,
                                       dsRequest);
    }
    isc.rpc.sendQueue();
}
,isc.A._cgFetchFacetValuesAndData=function isc_CubeGrid__cgFetchFacetValuesAndData(callback,requestProperties){
    var lastCallback={target:this,methodName:"_lastFetchDataReply"},
        dsRequest=isc.addProperties({},this.lodContext);
    isc.addProperties(dsRequest,{_oldDataLength:0,textMatchStyle:this.autoFetchTextMatchStyle});
    if(callback!=null){
        dsRequest.internalClientContext={fetchCallback:callback};
    }
    var query=this.fixedFacetValues;
    if(!isc.isAn.emptyObject(query)){
        query=isc.DataSource.combineCriteria(this.criteria,query,"and",dsRequest.textMatchStyle);
    }
    this.getDataSource().fetchData(query,lastCallback,dsRequest);
}
,isc.A.bindToDataSource=function isc_CubeGrid_bindToDataSource(fields){
    return fields;
}
,isc.A.fetchData=function isc_CubeGrid_fetchData(criteria,callback,requestProperties){
    this.criteria=criteria;
    this.setData([]);
    if(this.facets)this._cgFetchData(null,null,callback,requestProperties);
    else this._cgFetchFacetValuesAndData(callback,requestProperties);
}
,isc.A.filterData=function isc_CubeGrid_filterData(criteria,callback,requestProperties){
    this.fetchData(criteria,callback,requestProperties);
}
,isc.A.setCriteria=function isc_CubeGrid_setCriteria(criteria,callback,requestProperties){
    this.criteria=criteria;
    if(!this.originalData)this.originalData=this.data;
    var originalData=this.originalData;
    if(this.data&&this.dataSource){
        this.data=this.getDataSource().applyFilter(originalData,this.criteria);
    }
    this.deriveFacetValues(true);
    this.setFacets();
    this.setRows();this.setColumns();
}
,isc.A.getCriteria=function isc_CubeGrid_getCriteria(){
    return this.criteria;
}
,isc.A._setQueryFieldsEmptyVisibility=function isc_CubeGrid__setQueryFieldsEmptyVisibility(queryFields,visible){
    if(queryFields==null){
        queryFields=[];
        queryFields.addList(this.innerRowFields);
        queryFields.addList(this.innerColFields);
    }
    var lastField;
    for(var i=0,currentField=queryFields[i];i<queryFields.length;
             i++,currentField=queryFields[i])
    {
        if(currentField!=null&&currentField!=lastField){
            var facetValues=this.getHeaderFacetValues(queryFields[i]);
            if(visible){
                var properties=this.getFieldProperties(facetValues);
                if(properties&&properties._retainWhenEmpty){
                    delete properties._retainWhenEmpty;
                }
            }else{
                this.setFieldProperty(facetValues,"_retainWhenEmpty",false,true);
            }
            lastField=currentField;
        }
    }
}
,isc.A._fetchDataReply=function isc_CubeGrid__fetchDataReply(dsResponse,data,dsRequest){
    var newRecords=dsResponse.data;
    this.data.addList(newRecords);
    if(this.facets==null){
        this._initializeFacetValues();
        this.rebuildFacets(true,true);
        this.refreshMasterIndex();
        this.updateBody();
        this.markForRedraw();
    }
    if(this.cellIndex==null&&this._fillerCells!=null){
        this.addRecordsToIndex(this._fillerCells);
    }
    this.addRecordsToIndex(newRecords);
    this._markAllValuesPresent(data);
}
,isc.A._lastFetchDataReply=function isc_CubeGrid__lastFetchDataReply(dsResponse,data,dsRequest){
    this._fetchDataReply(dsResponse,data,dsRequest);
    var indexingRequired=this._shouldIndexCellRecords;
    delete this._shouldIndexCellRecords;
    if(this.useFillerCells){
        var area=dsRequest._cgArea||[0,this.getTotalRows()-1,0,this.getTotalCols()-1];
        var startRow=area[0],
            endRow=area[1],
            startCol=area[2],
            endCol=area[3];
        var offline=(dsResponse.status==isc.RPCResponse.STATUS_OFFLINE);
        if(offline==true&&this._isOffline!=true){
            this.setOffline(offline);
        }
        var fillerCells=[];
        for(var rowNum=startRow;rowNum<=endRow;rowNum++){
            for(var colNum=startCol;colNum<=endCol;colNum++){
                if(Array.isLoading(this.getCellRecord(rowNum,colNum))){
                    var fillerCell=this.getCellFacetValues(rowNum,colNum);
                    fillerCell._isFiller=true;
                    if(offline){
                        fillerCell._isOffline=offline;
                        if(this._offlineFillerCells==null){
                            this._offlineFillerCells=[];
                            if(isc.isA.Function(this.offlineResponse))this.offlineResponse();
                        }
                        this._offlineFillerCells.add({row:rowNum,col:colNum});
                    }
                    fillerCells.add(fillerCell);
                    this.cellIndex[colNum][rowNum]=fillerCell;
                }
            }
        }
        if(!this._fillerCells)this._fillerCells=[];
        this._fillerCells.addList(fillerCells);
    }
    if(this.hideEmptyFacetValues){
        this._setQueryFieldsEmptyVisibility(dsRequest._queryFields,false);
        if(this.hideEmptyAxis!="column")this.setRows();
        if(this.hideEmptyAxis!="row")this.setColumns();
    }
    this._markBodyForRedraw("dataChanged");
    if(this.cellIndex!=null&&indexingRequired)this._shouldIndexCellRecords=true;
    this.dataArrived(-1,-1);
    var callback=(dsRequest.internalClientContext?
                        dsRequest.internalClientContext.fetchCallback:null);
    if(callback){
        this.fireCallback(callback,"dsResponse,data,dsRequest",[dsResponse,data,dsRequest]);
    }
}
,isc.A.getOuterSpannedValues=function isc_CubeGrid_getOuterSpannedValues(startCoord,endCoord,isRow){
    var outerFields=(isRow?this.rowFields.first():this.colFields.first()),
        startField=this.getOuterField(startCoord,isRow),
        endField=this.getOuterField(endCoord,isRow),
        start=outerFields.indexOf(startField),
        end=outerFields.indexOf(endField),
        values=[];
    for(var i=start;i<=end;i++){
        values.add(outerFields[i].id);
    }
    return values;
}
,isc.A.getOuterField=function isc_CubeGrid_getOuterField(coord,isRow){
    var innerFields=(isRow?this.innerRowFields:this.innerColFields),
        field=innerFields[coord];
    while(field.parent)field=field.parent;
    return field;
}
,isc.A.setOffline=function isc_CubeGrid_setOffline(offline){
    this._isOffline=offline;
    if(offline){
        if(isc.isA.Function(this.goingOffline))this.goingOffline();
    }else{
        if(isc.isA.Function(this.goingOnline))this.goingOnline();
        if(this._offlineFillerCells!=null){
            for(var i=0;i<this._offlineFillerCells.length;i++){
                var cell=this._offlineFillerCells[i];
                this._fillerCells.remove(this.cellIndex[cell.col][cell.row]);
                this.cellIndex[cell.col][cell.row]=null;
            }
            delete this._offlineFillerCells;
            this._markBodyForRedraw("goingOnline");
        }
    }
}
,isc.A._setupRowAttributeLOD=function isc_CubeGrid__setupRowAttributeLOD(){
    var totalRows=this.totalAttributeRows;
    for(var i=0;i<this.rowFields.length;i++){
        this.rowFields[i].length=totalRows;
    }
    if(this._rowAttributeRS)return;
    var rs=this._rowAttributeRS=isc.ResultSet.create({
        context:this.lodContext,
        dataSource:this.rowAttributeDataSource,
        dataArrived:this.getID()+"._rowAttributesArrived(startRow,endRow)"
    });
    var rowsLoaded=this.getFacet(this.rowFacets[0]).values.length,
        newData=[];
    for(var i=0;i<rowsLoaded;i++){
        var attrRow={};
        for(var j=0;j<this.rowFacets.length;j++){
            var facetId=this.rowFacets[j],
                facet=this.getFacet(facetId),
                facetValue=facet.values[i];
            attrRow[facetId]=facetValue;
        }
        newData[i]=attrRow;
    }
    rs.fillCacheData(newData);
    rs.setFullLength(totalRows);
}
,isc.A._rowAttributesArrived=function isc_CubeGrid__rowAttributesArrived(startRow,endRow){
    var newData=this._rowAttributeRS.getRange(startRow,endRow+1),
        allNewRecords=[];
    for(var i=0;i<newData.length;i++){
        var row=newData[i],
            rowNum=startRow+i;
        for(var facetId in row){
            var facet=this.getFacet(facetId);
            if(facet==null)continue;
            var newFacetValue=row[facetId];
            facet.values[rowNum]=newFacetValue;
        }
        if(row.cellRecords){
            var newCellRecords=row.cellRecords;
            allNewRecords.addList(newCellRecords);
        }
    }
    this.data.addList(allNewRecords);
    this._markAllValuesPresent(allNewRecords);
    this.setFacets();
    this.logWarn("rowAttributesLOD: "+(endRow-startRow+1)+" new rows, "+
                 allNewRecords.length+" new cellRecords");
    this._buildRowFields();
    this.addRecordsToIndex(allNewRecords);
    this.headerGrid.markForRedraw();
    this.body.markForRedraw();
    if(this.body.isDirty())this.headerGrid.priorityRedraw=true;
}
,isc.A.syncHeaderScrolling=function isc_CubeGrid_syncHeaderScrolling(bodyLeft,bodyTop,skipRedraw){
    if(this.attributesOnly()||this.facets==null)return;
    bodyLeft=bodyLeft!=null?bodyLeft:this.body.getScrollLeft();
    bodyTop=bodyTop!=null?bodyTop:this.body.getScrollTop();
    for(var i=0;i<this.colHeaders.length;i++){
        var header=this.colHeaders[i];
        if(bodyLeft!=header.getScrollLeft())header.scrollTo(bodyLeft);
    }
    if(this.rowHeaderGridMode){
        var body=this.body;
        if(this.headerGrid!=null&&bodyTop!=this.headerGrid.getScrollTop()){
            if(body.isDirty())this.headerGrid.priorityRedraw=true;
            this.headerGrid.scrollTo(null,bodyTop);
        }
        if(!skipRedraw&&body._needAxisRedraw()){
            body.redrawOnScroll(!body.isFastScrolling()&&body.instantScrollTrackRedraw);
        }
    }else{
        for(var i=0;i<this.rowHeaders.length;i++){
            var header=this.rowHeaders[i];
            if(bodyTop!=header.getScrollTop())header.scrollTo(null,bodyTop);
        }
    }
}
,isc.A.syncBodyScrolling=function isc_CubeGrid_syncBodyScrolling(headerIndex,isRow){
    if(isRow==null)isRow=false;
    var headerArray=(isRow?this.rowHeaders:this.colHeaders);
    if(headerIndex==null)headerIndex=headerArray.length-1;
    if(headerIndex>=0){
        var header=headerArray[headerIndex],
            headerLeft=header.getScrollLeft(),
            headerTop=header.getScrollTop(),
            body=this.body;
        if(isRow){
            if(body.getScrollTop()!=headerTop){
                body.scrollTo(null,headerTop);
            }
        }else{
            if(body.getScrollLeft()!=headerLeft)body.scrollTo(headerLeft);
        }
        if(this.attributesOnly()&&isRow){
            var labels=this.rowFacetLabels;
            if(labels.getScrollLeft()!=headerLeft)labels.scrollTo(headerLeft);
        }
    }
}
,isc.A.sizeParentFields=function isc_CubeGrid_sizeParentFields(fieldTree,headerTree,sizeProperty,defaultSize){
    if(headerTree==this.rowHeaders&&this.rowHeaderGridMode)return;
    var start=isc.timeStamp();
    var innerFields=fieldTree.last();
    for(var i=0;i<innerFields.length;i++){
        var field=innerFields[i];
        if(field==null)continue;
        var currentSize=field[sizeProperty];
        if(currentSize==null||currentSize=="*"){
            field[sizeProperty]=defaultSize;
        }
    }
    for(var j=fieldTree.length-1;j>=0;j--){
        var fields=fieldTree[j];
        for(var i=0;i<fields.length;i++){
            var field=fields[i];
            if(field.childFacetValues!=null){
                field[sizeProperty]=field.childFacetValues.getProperty(sizeProperty).sum();
                if(headerTree!=null&&headerTree[0]!=null&&headerTree[0].isDrawn()&&
                    !(headerTree==this.rowHeaders&&this.autoSizeHeaders)){
                    var header=headerTree[j].getButton(i);
                    if(field[sizeProperty]!=header[sizeProperty]){
                        headerTree[j].resizeItem(i,field[sizeProperty]);
                        header.redrawIfDirty("sizeParentFields");
                    }
                }
            }
        }
    }
    if(this.logIsDebugEnabled("cgTiming")){
        var end=isc.timeStamp();
        this.logInfo("sizeParentFields ("+
                     (fieldTree==this.rowFields?"rows":"cols")+
                     ") "+(end-start)+"ms","cgTiming");
    }
}
,isc.A.attributesOnly=function isc_CubeGrid_attributesOnly(){
    return this.dataSource==null&&(this.data==null||this.data.length==0);
}
,isc.A.flatAttributesOnly=function isc_CubeGrid_flatAttributesOnly(){
    return this.attributesOnly()&&this.flatRowAttributes;
}
,isc.A.createChildren=function isc_CubeGrid_createChildren(){
    if(this.body!=null)return;
    var start=isc.timeStamp();
    if(this.facets!=null){
        this.createRowHeaderBars();
        this.createColumnHeaderBars();
        this.createRowFacetLabels();
        this.createColumnFacetLabels();
        this._facetChildrenBuilt=true;
    }
    if(this.attributesOnly()){
        this.bodyWidth=0;
        this.bodyHeight=0;
    }
    this.headerHeight=0;
    this.updateGridComponents();
    if(this.attributesOnly()){
        var noOp=isc.Canvas.NO_OP,
            body=this.body;
        body.draw=body.redraw=body.refreshCellStyles=noOp;
    }
    var end=isc.timeStamp();
    if(this.logIsDebugEnabled("cgTiming")){
        this.logWarn("createChildren(): "+(end-start)+"ms","cgTiming");
    }
}
,isc.A._showSortButton=function isc_CubeGrid__showSortButton(){
    return false;
}
,isc.A.updateGridComponents=function isc_CubeGrid_updateGridComponents(){
    if(this.body==null)this.createBodies();
    if(this.body.parentElement!=this)this.addChild(this.body);
    if(this.rowHeaderGridMode)this.body._delayedRedraw=true;
}
,isc.A.setFields=function isc_CubeGrid_setFields(newFields,sizes){
    var gotNewFields=(newFields!=null||this.completeFields==null);
    this.Super("setFields",arguments);
    this.innerColFields=this.fields;
}
,isc.A.getFieldWidths=function isc_CubeGrid_getFieldWidths(){
    var widths=this.haveColumnFacets()
        ?this.innerColFields.getProperty("width"):[this.defaultFacetWidth];
    return widths;
}
,isc.A.setBodyFieldWidths=function isc_CubeGrid_setBodyFieldWidths(sizes){
    this.Super("setBodyFieldWidths",[sizes]);
    if(this.haveColumnFacets()){
        this.sizeParentFields(this.colFields,this.colHeaders,"width",this.defaultFacetWidth);
    }
    this.layoutChildren();
}
,isc.A.layoutChildren=function isc_CubeGrid_layoutChildren(){
    if(!this._facetChildrenBuilt)return;
    var start=isc.timeStamp();
    if(this.haveRowFacets()){
        this.sizeParentFields(this.rowFields,this.rowHeaders,"height",this.facetHeight);
        this.rowFacetWidths=this.getRowFacetWidths();
    }
    if(!this._fieldWidths){
        if(this.haveColumnFacets()){
            this.sizeParentFields(this.colFields,this.colHeaders,"width",this.defaultFacetWidth);
        }
        var widths=this.getFieldWidths();
        this.setBodyFieldWidths(widths);
    }
    var spaceForControls=this.innerHeaderControlSize+2;
    var innerHeaderHeight=this.innerHeaderHeight||this.facetHeight+spaceForControls;
    if(this.haveColumnFacets()){
        if(this.header.isDrawn()){
            innerHeaderHeight=this.header.getVisibleHeight();
        }else{
            var facet=this.getFacet(this.columnFacets.last());
            if(facet.height)innerHeaderHeight=Math.max(innerHeaderHeight,facet.height);
        }
    }
    var rowFacetLabels=this.rowFacetLabels;
    if(rowFacetLabels&&rowFacetLabels.isDrawn()&&!rowFacetLabels._recalculateMinHeight){
        innerHeaderHeight=Math.max(innerHeaderHeight,rowFacetLabels.getVisibleHeight());
    }else if(this.haveRowFacets()){
        for(var i=0;i<this.rowFacets.length;i++){
            var facet=this.getFacet(this.rowFacets[i]);
            if(facet.labelHeight!=null){
                innerHeaderHeight=Math.max(innerHeaderHeight,facet.labelHeight);
            }
        }
        if(this.rowFacetLabels)delete this.rowFacetLabels._recalculateMinHeight;
    }
    var headerGridHBorder=isc.Element._getHBorderSize(this.rowHeaderBarStyleName);
    if(this.haveRowFacets()){
        this.bodyOffsetX=this.rowFacetWidths.sum()+headerGridHBorder;
    }else{
        this.bodyOffsetX=(this.haveColumnFacets()&&this.colFields.length>=2?
                            this.defaultFacetWidth:0);
    }
    if(this.haveColumnFacets()){
        this.bodyOffsetY=this.colHeaders.map("getVisibleHeight").sum();
    }else{
        this.bodyOffsetY=innerHeaderHeight;
    }
    var bodyScrollWidth=this.haveColumnFacets()?
        this.innerColFields.getProperty("width").sum():this.defaultFacetWidth;
    var bodyScrollHeight=this.cellHeight;
    if(this.haveRowFacets()){
        if(this.rowHeaders!=null&&this.rowHeaders[0]!=null&&
            this.rowHeaders[0].isDrawn())
        {
            if(this.rowHeaderGridMode&&!isc.Browser.isIE){
                bodyScrollHeight=this.headerGrid._getDrawnRowHeights().sum();
            }else{
                bodyScrollHeight=this.rowHeaders.last().getScrollHeight();
            }
        }else{
            if(this._multiFacetColumn){
                bodyScrollHeight=this._crossFacetTree.getOpenList().length*this.cellHeight;
            }else{
                if(this.rowHeaderGridMode){
                    bodyScrollHeight=this.innerRowFields.length*this.cellHeight;
                }else{
                    bodyScrollHeight=this.innerRowFields.getProperty("height").sum();
                }
            }
        }
    }
    var scrollbarSize=this.getScrollbarSize(),
        vBorder=this.body.getVBorderSize()||
            isc.Element._getVBorderSize(this.rowHeaderBarStyleName),
        hBorder=this.body.getHBorderSize(),
        bodyViewportHeight=Math.max(this.getHeight()-this.bodyOffsetY,
                                      this.bodyMinHeight)-vBorder,
        bodyViewportWidth=Math.max(this.getWidth()-this.bodyOffsetX,
                                     this.bodyMinWidth)-hBorder;
    var needVScroll=bodyScrollHeight>bodyViewportHeight,
        vscrollSize=(needVScroll?scrollbarSize:0),
        needHScroll=bodyScrollWidth>bodyViewportWidth,
        hscrollSize=(needHScroll?scrollbarSize:0);
    needVScroll=(bodyScrollHeight+hscrollSize)>bodyViewportHeight;
    needHScroll=(bodyScrollWidth+vscrollSize)>bodyViewportWidth;
    vscrollSize=(needVScroll?scrollbarSize:0);
    hscrollSize=(needHScroll?scrollbarSize:0);
    this.bodyWidth=Math.min(
        this.getWidth()-this.bodyOffsetX,
        bodyScrollWidth+hBorder+vscrollSize);
    if(this.bodyMinWidth!=null){
        this.bodyWidth=Math.min(Math.max(this.bodyWidth,this.bodyMinWidth),
                                  bodyScrollWidth+hBorder+vscrollSize);
    }
    this.bodyHeight=Math.min(
        this.getHeight()-this.bodyOffsetY,
        bodyScrollHeight+vBorder+hscrollSize);
    if(this.bodyMinHeight!=null){
        this.bodyHeight=Math.min(Math.max(this.bodyHeight,this.bodyMinHeight),
                                   bodyScrollHeight+vBorder+hscrollSize);
    }
    var bodyWidth=(this.attributesOnly()?0:this.bodyWidth);
    var height;
    if(this.bodyMinHeight!=null){
        height=this.bodyOffsetY+this.bodyHeight;
    }else{
        height=Math.min(this.getHeight(),this.bodyOffsetY+this.bodyHeight);
    }
    if(this.haveRowFacets()){
        var headerWidth=this.rowFacetWidths.sum()+headerGridHBorder;
        if(this.attributesOnly()){
            headerWidth=Math.min(headerWidth,this.getWidth()-bodyWidth);
        }
        if(this.rowHeaderGridMode){
            var headerGridWidth=headerWidth+
                (needVScroll&&this.attributesOnly()?this.getScrollbarSize():0);
            this.headerGrid.setRect(0,this.bodyOffsetY,
                                    headerGridWidth,
                                    this.bodyHeight-hscrollSize);
        }else{
            for(var i=0;i<this.rowFields.length;i++){
                var headerBar=this.rowHeaders[i];
                headerBar.setRect(this.rowFacetWidths.slice(0,i).sum(),this.bodyOffsetY,
                                  this.rowFacetWidths[i],this.bodyHeight-hscrollSize);
            }
        }
        this.rowFacetLabels.setRect(0,this.bodyOffsetY-innerHeaderHeight,
                                    headerWidth,innerHeaderHeight);
    }
    if(this.haveColumnFacets()){
        var totalLabelHeight=0;
        for(var i=0;i<this.columnFacets.length;i++){
            var facet=this.getFacet(this.columnFacets[i]),
                headerBar=this.colHeaders[i],
                isInnerMost=(i==this.colFields.length-1),
                facetHeight=isInnerMost?innerHeaderHeight:
                                   this._getColumnFacetHeight(facet);
            headerBar.setRect(this.bodyOffsetX,
                              totalLabelHeight,
                              this.bodyWidth-vscrollSize,
                              facetHeight);
            if(!isInnerMost&&this.columnFacets.length>1&&this.colFacetLabels!=null){
                totalLabelHeight+=facetHeight;
                if(this.colFacetLabels.isDrawn()){
                    this.colFacetLabels.getMember(i).setHeight(facetHeight);
                }else{
                    this.colFacetLabels.buttons[i].height=facetHeight;
                }
            }
        }
        if(this.colFacetLabels!=null){
            var labelWidth=this.haveRowFacets()?this.rowFacetWidths.last():
                                                    this.defaultFacetWidth;
            this.colFacetLabels.setRect(this.bodyOffsetX-labelWidth,0,
                                        labelWidth,totalLabelHeight);
        }
    }
    if(!this.attributesOnly()){
        this.body.setRect(this.bodyOffsetX,this.bodyOffsetY,
                            this.bodyWidth,this.bodyHeight);
    }
    var width;
    if(this.bodyMinWidth!=null){
        width=this.bodyOffsetX+bodyWidth;
    }else{
        width=Math.min(this.getWidth(),this.bodyOffsetX+bodyWidth);
    }
    this.drawnWidth=width;
    this.drawnHeight=height;
    if(!this.isDrawn()){
        this._resized();
    }else{
        this._setHandleRect(this.left,this.top,this.drawnWidth,this.drawnHeight);
        if(this._clip!=null){
            this.setClip(0,this.drawnWidth,this.drawnHeight,0);
        }
        this._resized();
    }
    if(this.logIsDebugEnabled("cgLayout")){
        var end=isc.timeStamp();
        this.logDebug("CubeGrid layout:\n"+
                     "\nbodyWidth/Height: "+[this.bodyWidth,this.bodyHeight]+
                     "\nbodyScrollWidth/Height: "+[bodyScrollWidth,bodyScrollHeight]+
                     "\nbodyOffsetX/Y: "+[this.bodyOffsetX,this.bodyOffsetY]+
                     "\nneedH/VScroll: "+[needHScroll,needVScroll]+
                     "\nspecified width/height: "+[this.getWidth(),this.getHeight()]+
                     "\ndrawn width/height: "+[this.drawnWidth,this.drawnHeight]+
                     "\ntime: "+(end-start)+"ms",
                     "cgLayout");
    }
}
);
isc.evalBoundary;isc.B.push(isc.A.getInitialWidth=function isc_CubeGrid_getInitialWidth(){return this.drawnWidth;}
,isc.A.getInitialHeight=function isc_CubeGrid_getInitialHeight(){return this.drawnHeight;}
,isc.A.getVisibleHeight=function isc_CubeGrid_getVisibleHeight(){return this.drawnHeight||this.getHeight();}
,isc.A.getVisibleWidth=function isc_CubeGrid_getVisibleWidth(){return this.drawnWidth||this.getWidth();}
,isc.A.getRowFacetWidths=function isc_CubeGrid_getRowFacetWidths(){
    if(this.rowFacetLabels!=null&&this.rowFacetLabels.isDrawn()){
        this.rowFacetWidths=this.rowFacetLabels.members.map("getVisibleWidth");
    }else{
        this.rowFacetWidths=[];
        for(var i=0;i<this.rowFacets.length;i++){
            var width=Math.max(this.getFacet(this.rowFacets[i]).width,
                                 this.rowFields[i].getProperty("width").max());
            if(!isc.isA.Number(width)||width<=0)width=100;
            this.rowFacetWidths[i]=width;
        }
    }
    if(this._multiFacetColumn)this.rowFacetWidths.length=this.rowFacetWidths.length-1;
    return this.rowFacetWidths;
}
,isc.A.makeGridFields=function isc_CubeGrid_makeGridFields(){
    var gridFields=[],
        rowFacetWidths=this.getRowFacetWidths();
    for(var i=0;i<this.rowFields.length;i++){
        var facet=this.getFacet(this.rowFacets[i]);
        if(facet.combineInTree&&i>0){
            var previousField=gridFields[i-1];
            previousField._crossFacetTree=this._crossFacetTree;
            previousField.align="left";
            continue;
        }
        gridFields.add({
            facetId:facet.id,
            width:rowFacetWidths[i],
            align:facet.isTree?"left":(facet.align||this.facetValueAlign)
        });
    }
    return gridFields;
}
,isc.A.createRowHeaderGrid=function isc_CubeGrid_createRowHeaderGrid(dontAddChild){
    var headerGrid=this.headerGrid;
    if(headerGrid)return;
    var selectionData=[];
    for(var i=0;i<this.numRows;i++)selectionData[i]={};
    this.rowGridSelection=isc.CellSelection.create({
        data:selectionData,
        simpleDeselect:this.simpleDeselect,
        dragSelection:true,
        numCols:this.rowFacets.length,
        _isParentFacetDirty:function(rowNum,colNum){
            if(colNum==0)return false;
            var grid=this.cubeGrid.headerGrid,
                selection=grid.selection;
            var startRow=grid.getCellStartRow(rowNum,colNum-1),
                rowSpan=grid.getCellRowSpan(rowNum,colNum-1),
                selected=selection.cellIsSelected(startRow,colNum-1),
                shouldBeSelected=true;
            for(var i=startRow;i<startRow+rowSpan;i+=grid.getCellRowSpan(i,colNum))
            {
                if(!selection.cellIsSelected(i,colNum))shouldBeSelected=false;
            }
            return selected!=shouldBeSelected;
        },
        _setCellSelection:function(rowNum,colNum,newState){
            var cube=this.cubeGrid,
                grid=cube.headerGrid,
                numCols=this.numCols;
            if(colNum<numCols-1)rowNum=grid.getCellStartRow(rowNum,colNum);
            var result=this.Super("_setCellSelection",[rowNum,colNum,newState]);
            if(!result||!cube.autoSelectHeaders)return result;
            if(this._isParentFacetDirty(rowNum,colNum)){
                this._propagatingLeft=true;
                this._setCellSelection(rowNum,colNum-1,newState);
                this._cascadedCells.add([rowNum,colNum-1]);
                delete this._propagatingLeft;
            }
            if(!this._propagatingLeft&&colNum<numCols-1){
                var rowSpan=grid.getCellRowSpan(rowNum,colNum),
                    changedCells=this._setCellRangeSelection(rowNum,colNum+1,
                                                 rowNum+rowSpan-1,colNum+1,newState);
                if(changedCells.length>0)this._cascadedCells.addList(changedCells);
            }
            return true;
        },
        _cellSelectionsChanged:function(){
            var cascadedCells=this._cascadedCells;
            if(cascadedCells.length>0){
                this.changedCells.addList(cascadedCells);
                this._cascadedCells=[];
            }
            return this.Super("_cellSelectionsChanged",arguments);
        },
        setCellSelection:function(rowNum,colNum,newState){
            if(this._setCellSelection(rowNum,colNum,newState)){
                this.changedCells=[[rowNum,colNum]];
                this._cellSelectionsChanged();
                return true;
            }else{
                return false;
            }
        },
        _cascadedCells:[],
        cubeGrid:this,
        cellIsSelected:function(rowNum,colNum){
            var grid=this.cubeGrid.headerGrid,
                startRow=grid.getCellStartRow(rowNum,colNum),
                spannedCells=grid.getCellRowSpan(rowNum,colNum);
            for(rowNum=startRow;rowNum<(startRow+spannedCells);rowNum++){
                if(this._oldCellIsSelected(rowNum,colNum))return true;
            }
            return false;
        },
        _oldCellIsSelected:isc.CellSelection.getInstanceProperty("cellIsSelected")
    });
    var gridFields=this.makeGridFields();
    var headerGrid=this.createAutoChild("headerGrid",{
        autoDraw:false,
        ID:this.getID()+"_headerGrid",
        cellHeight:this.cellHeight,
        cellPadding:this.cellPadding,
        className:this.rowHeaderBarStyleName,
        baseStyle:this.rowHeaderBaseStyle,
        canSelectCell:function(){return true;},
        canSelectRecord:function(){return true;},
        totalRows:this.innerRowFields.length,
        fields:gridFields,
        _fieldWidths:this.getRowFacetWidths(),
        overflow:this.attributesOnly()?"auto":"hidden",
        wrapCells:this.wrapFacetValueTitles,
        fixedRowHeights:!this.autoSizeHeaders,
        virtualScrolling:false,
        drawAheadRatio:this.drawAheadRatio,
        drawAllMaxCells:0,
        avgRowHeight:(this.avgRowHeight?this.avgRowHeight:this.cellHeight),
        cubeGrid:this,
        alternateRowStyles:this.alternateRowHeaderStyles,
        selection:(this.canSelectHeaders?this.rowGridSelection:null),
        selectionBoundaries:this.rowBoundaries,
        dragMove:this.bodyDefaults.dragMove
    },null,true);
    this.rowGridSelection.target=headerGrid;
    for(var i=0;i<this.rowFields.length;i++){
        this.rowHeaders[i]=headerGrid;
    }
    this.observe(headerGrid,"cellSelectionChanged","observer.headerSelected(observed)");
    this.observe(headerGrid,"selectionChanged","observer.headerSelected(observed)");
    this.observe(headerGrid,"scrollTo","observer.syncBodyScrolling(0, true)");
    if(!dontAddChild)this.addChild(headerGrid);
}
,isc.A.createRowHeaderBars=function isc_CubeGrid_createRowHeaderBars(dontAddChild){
    if(!this.haveRowFacets())return;
    if(this.rowHeaderGridMode)return this.createRowHeaderGrid(dontAddChild);
    for(var i=0;i<this.rowFields.length;i++){
        var facet=this.rowFields[i][0].facet,
            isInnerMost=(i==this.rowFields.length-1);
        var headerBar=this.createHeader({
            ID:this.getID()+"_row_header_"+i,
            _constructor:"ReportHeaderBar",
            grid:this,cubeGrid:this,
            facetId:facet.id,
            vertical:true,
            buttons:this.rowFields[i].duplicate(),
            className:this.rowHeaderBarStyleName,
            selectionBoundaries:this.rowBoundaries,
            canResizeItems:(isInnerMost&&this.canResizeRows),
            itemDragResized:(isInnerMost&&this.canResizeRows)?
                          function(itemNum,newSize){
                              this.cubeGrid.rowResized(itemNum,newSize);
                          }
                        :null,
            canReorderItems:false,
            dontObserve:true,
            headerLevel:i,
            isInnerMost:isInnerMost
        });
        isc.addProperties(headerBar.buttonProperties,{
            baseStyle:this.rowHeaderBaseStyle,
            skinImgDir:this.skinImgDir,
            wrap:this.wrapFacetValueTitles,
            cubeGrid:this,
            toolbar:headerBar,
            overflow:this.autoSizeHeaders?"visible":"hidden",
            reliableMinHeight:true,
            height:this.facetHeight
        });
        this.rowHeaders[i]=headerBar;
        if(!dontAddChild)this.addChild(headerBar);
        this.observeHeaderBar(headerBar,i,true);
    }
}
,isc.A.createColumnHeaderBars=function isc_CubeGrid_createColumnHeaderBars(dontAddChild){
    if(!this.haveColumnFacets())return;
    for(var i=0;i<this.colFields.length;i++){
        var headerBar=this.colHeaders[i];
        var facet=this.colFields[i][0].facet;
        var isInnerMost=(i==this.colFields.length-1);
        if(headerBar==null){
            var facet=this.getFacet(this.columnFacets[i]);
            var headerBar={
                ID:this.getID()+"_col_header_"+i,
                _constructor:"ReportHeaderBar",
                grid:this,cubeGrid:this,
                facetId:facet.id,
                buttons:this.colFields[i].duplicate(),
                height:this._getColumnFacetHeight(facet),
                selectionBoundaries:this.colBoundaries,
                canResizeItems:(isInnerMost&&this.canResizeFields),
                canReorderItems:(isInnerMost&&this.canReorderFields),
                canAcceptDrop:(isInnerMost&&this.canMoveFacets),
                dontObserve:!isInnerMost,
                reorderOnDrop:false,
                headerLevel:i,
                isInnerMost:isInnerMost
            }
            if(isInnerMost)headerBar.buttonConstructor="InnerHeader";
            headerBar=this.createHeader(headerBar);
            isc.addProperties(headerBar.buttonProperties,{
                baseStyle:isInnerMost?this.innerHeaderBaseStyle:this.colHeaderBaseStyle,
                skinImgDir:this.skinImgDir,
                wrap:this.wrapFacetValueTitles,
                cubeGrid:this,
                toolbar:headerBar,
                height:this.facetHeight,
                showReorderHandle:this.canReorderFields,
                showMinimize:this.canMinimizeColumns,
                controlSize:this.innerHeaderControlSize,
                reorderHandleWidth:this.innerHeaderReorderHandleWidth,
                minWidth:(3*this.innerHeaderControlSize)
            });
            this.colHeaders[i]=headerBar;
            if(!dontAddChild)this.addChild(headerBar);
            this.observeHeaderBar(headerBar,i,false);
        }
    }
    this.header=this.colHeaders.last();
}
,isc.A._refreshMasterIndexForFields=function isc_CubeGrid__refreshMasterIndexForFields(fields){
    for(var i=0;i<fields.length;i++){
        var field=fields[i];
        if(this.fields.contains(field))field.masterIndex=this.fields.indexOf(field);
        else{
            field.masterIndex=this.fields.findIndex("id",field.facetValueId);
        }
    }
}
,isc.A.createRowFacetLabels=function isc_CubeGrid_createRowFacetLabels(){
    if(!this.haveRowFacets())return;
    var rowFacetLabels=[],
        rowFacetWidths=this.getRowFacetWidths();
    for(var i=0;i<this.rowFields.length;i++){
        var facet=this.getFacet(this.rowFacets[i]);
        var facetLabel={
            title:facet.title,
            align:facet.titleAlign||this.facetTitleAlign,
            facet:facet,
            facetId:facet.id,
            showCloseBox:(facet.canClose!=null?facet.canClose:this.canCloseColumns),
            showSortButtons:(facet.canSort!=null?facet.canSort:this.canSortFacets),
            width:rowFacetWidths[i],
            baseStyle:facet.rowLabelStyle||facet.labelStyle||this.rowHeaderLabelBaseStyle,
            skinImgDir:this.skinImgDir
        };
        rowFacetLabels.add(facetLabel);
    }
    var canTabToHeader=this.canTabToHeader;
    if(canTabToHeader==null)canTabToHeader=isc.screenReader;
    this.rowFacetLabels=isc.ReportHeaderBar.create({
        ID:this.getID()+"_rowFacetLabels",
        tabIndex:(canTabToHeader?this.getTabIndex():-1),
        className:this.rowFacetLabelsStyleName,
        buttonConstructor:"InnerHeader",
        buttons:rowFacetLabels,
        canResizeItems:true,
        canReorderItems:this.canReorderFacets,
        showIf:(this.showRowFacetLabels==false?"false":null),
        setResizeRules:function(){
            this.Super("setResizeRules",arguments);
            for(var i=0;i<this.members.length;i++){
                var button=this.members[i];
                button.resizeFrom.add("B");
                button.edgeCursorMap["B"]=isc.Canvas.ROW_RESIZE;
            }
        },
        prepareForDragging:function(){
            this.Super("prepareForDragging",arguments);
            var EH=isc.EH;
            if(EH.dragOperation=="dragResize"&&"B"==EH.resizeEdge){
                EH.dragTarget.dragAppearance=EH.OUTLINE;
            }
        },
        dragResizeStop:function(){
            var returnValue=this.Super("dragResizeStop",arguments);
            var EH=isc.EH,dragTarget=EH.dragTarget;
            if(EH.dragOperation=="dragResize"&&"B"==EH.resizeEdge){
                dragTarget.dragAppearance=EH.NONE;
                this.cubeGrid.rowFacetBarResized(dragTarget,EH.dragResizeHeight);
                return false;
            }
            return returnValue;
        }
    },this.getFacetBarProperties());
    isc.addProperties(this.rowFacetLabels.buttonProperties,{
        toolbar:this.rowFacetLabels
    },this.getFacetLabelProperties());
    this.addChild(this.rowFacetLabels);
    this.observe(this.rowFacetLabels,"itemDragResized",
                 "observer.rowFacetResized(itemNum, newSize)");
    this.observe(this.rowFacetLabels,"itemDragReordered",
                 "observer.rowFacetReordered(itemNum, newPosition)");
    this.observeHeaderBar(this.rowFacetLabels,null,true);
}
,isc.A.createColumnFacetLabels=function isc_CubeGrid_createColumnFacetLabels(){
    if(!this.haveColumnFacets()||this.columnFacets.length<2)return;
    var colFacetLabels=[];
    for(var i=0;i<this.colFields.length;i++){
        var facet=this.colFields[i][0].facet;
        var isInnerMost=(i==this.colFields.length-1);
        if(isInnerMost)continue;
        var facetLabel={
            baseStyle:facet.colLabelStyle||facet.labelStyle||this.colHeaderLabelBaseStyle,
            title:facet.title,
            align:facet.titleAlign||this.facetTitleAlign,
            facetId:facet.id
        };
        colFacetLabels.add(facetLabel);
    }
    var canTabToHeader=this.canTabToHeader;
    if(canTabToHeader==null)canTabToHeader=isc.screenReader;
    this.colFacetLabels=isc.ReportHeaderBar.create({
        ID:this.getID()+"_colFacetLabels",
        vertical:true,
        canResizeItems:true,
        showIf:(this.showColFacetLabels==false?"false":null),
        tabIndex:(canTabToHeader?this.getTabIndex():-1),
        buttons:colFacetLabels
    },this.getFacetBarProperties());
    isc.addProperties(this.colFacetLabels.buttonProperties,{
        toolbar:this.colFacetLabels
    },this.getFacetLabelProperties());
    this.addChild(this.colFacetLabels);
    this.observe(this.colFacetLabels,"itemDragResized",
                 "observer.columnFacetResized(itemNum, newSize)");
}
,isc.A.prepareForDraw=function isc_CubeGrid_prepareForDraw(){
    this.Super("prepareForDraw",arguments);
    this.layoutChildren();
    if(this.hilites)this.applyHilites();
}
,isc.A.draw=function isc_CubeGrid_draw(output){
    if(!this.readyToDraw())return this;
    this.Super("draw",arguments);
    if(this.autoSizeHeaders){
        if(!isc.Page.isLoaded()){
             var delayCode="if(window."+this.getID()+")"+this.getID()+".adjustHeaderHeights()";
            isc.Page.setEvent("load",delayCode);
        }else{
            if(isc.Browser.isIE){
                this.delayCall("adjustHeaderHeights",[],0);
            }else{
                this.adjustHeaderHeights();
            }
        }
    }
}
,isc.A.getCascadedHeight=function isc_CubeGrid_getCascadedHeight(field){
    var header=this.getHeaderForField(field);
    var minHeight=header.getButtonMinHeight();
    if(minHeight<22)minHeight=22;
    var height=header.newHeight=(header.newHeight!=null?
                                     Math.max(header.newHeight,minHeight):
                                     minHeight);
    if(!header.childFacetValues){
        return header.newHeight;
    }
    var childrenHeight=this.map("getCascadedHeight",header.childFacetValues).sum();
    header.newHeight=Math.max(height,childrenHeight);
    var extraHeight=height-childrenHeight;
    if(extraHeight>0){
        this.setCascadedHeight(header,extraHeight);
    }
    return header.newHeight;
}
,isc.A.setCascadedHeight=function isc_CubeGrid_setCascadedHeight(header,extraHeight){
    var numChildren=header.childFacetValues.length,
        addHeight=Math.floor(extraHeight/numChildren),
        lastChildAddHeight=addHeight+(extraHeight%numChildren);
    for(var i=0;i<numChildren;i++){
        var childField=header.childFacetValues[i],
            child=this.getHeaderForField(childField),
            childAddHeight=(i==numChildren-1?lastChildAddHeight:addHeight);
        child.newHeight+=childAddHeight;
        if(child.childFacetValues)this.setCascadedHeight(child,childAddHeight);
    }
}
,isc.A.adjustHeaderHeights=function isc_CubeGrid_adjustHeaderHeights(){
    if(this.haveRowFacets()){
        if(this.rowHeaderGridMode){
            this.rowHeights=this.headerGrid._getDrawnRowHeights();
        }else{
            var outerFields=this.rowFields.first();
            for(var i=0;i<outerFields.length;i++){
                this.getCascadedHeight(outerFields[i]);
            }
            for(var i=0;i<this.rowHeaders.length;i++){
                var bar=this.rowHeaders[i],
                    headers=bar.getButtons();
                for(var j=0;j<headers.length;j++){
                    var header=headers[j];
                    header.setHeight(header.newHeight);
                    header.newHeight=null;
                    header.redrawIfDirty("autoSizing row headers");
                }
                bar.setHeight(headers.map("getHeight").sum());
            }
            var headerBar=this.rowHeaders.last();
            this.rowHeights=headerBar.getButtons().map("getHeight");
            for(var i=0;i<this.rowHeights.length;i++){
                this.innerRowFields[i].height=this.rowHeights[i];
            }
        }
    }
    this.layoutChildren();
    if(this.headerGrid&&this.multiCellData)this.headerGrid.markForRedraw();
    this._markBodyForRedraw("adjustHeaderHeights");
    this._resized();
}
,isc.A.getRowHeight=function isc_CubeGrid_getRowHeight(record,rowNum){
    if(this.multiRowHeaders){
        var field=this.rowFieldMap[rowNum],
            groupCount=field.groupCount,
            index=field._index,
            headerHeight=this.headerGrid.getRowSize(index),
            rowHeight=Math.floor(headerHeight/groupCount);
        var minRowSpan=1;
        if(this.getRowSpan){
            minRowSpan=this.getTotalRows();
            var drawArea=this.getDrawArea();
            for(var i=drawArea[2];i<=drawArea[3];i++){
                minRowSpan=Math.min(this.getRowSpan(this.getCellRecord(rowNum,i),rowNum,i),minRowSpan);
            }
            if(!isNaN(minRowSpan))rowHeight=rowHeight*minRowSpan;
        }
        var isLastInGroup=((rowNum+(minRowSpan-1)-field.coordinate)==(groupCount-1));
        if(isLastInGroup){
            rowHeight+=(headerHeight%groupCount);
        }
        return rowHeight;
    }
    var rowOffset;
    if(this.rowHeaderGridMode){
        rowOffset=rowNum-this.body._firstDrawnRow;
    }else{
        rowOffset=rowNum;
    }
    if(!this.rowHeights||this.rowHeights[rowOffset]==null)return this.cellHeight;
    return this.rowHeights[rowOffset];
}
,isc.A.facetLabelClick=function isc_CubeGrid_facetLabelClick(){}
,isc.A.getFacetLabelProperties=function isc_CubeGrid_getFacetLabelProperties(){
    return isc.addProperties({
        showRollOver:false,
        autoDraw:false,
        cubeGrid:this,
        showReorderHandle:this.canReorderFacets&&!this.canMoveFacets,
        controlSize:this.innerHeaderControlSize,
        reorderHandleWidth:this.innerHeaderReorderHandleWidth,
        minWidth:(3*this.innerHeaderControlSize),
        wrap:this.wrapFacetTitles,
        padTitle:this.padTitles
        },this.facetLabelMethods);
}
,isc.A._facetBarDrop=function isc_CubeGrid__facetBarDrop(){

    this.cubeGrid.addFacet(isc.EH.dragTarget.facetId,
                               !this.vertical,
                               this.getDropPosition());
}
,isc.A.getFacetBarProperties=function isc_CubeGrid_getFacetBarProperties(){
    return{
        isFacetBar:true,
        backgroundColor:this.headerBackgroundColor,
        cubeGrid:this,
        autoDraw:false,
        canRemoveItems:this.canMoveFacets,
        canAcceptDrop:this.canMoveFacets,
        drop:this._facetBarDrop
    }
}
,isc.A._facetValueHover=function isc_CubeGrid__facetValueHover(facetValues){

    if(this.facetValueHover){
        if(this.facetValueHover(facetValues)==false)return;
    }
    if(this.showHover){
        var facetId=this.getContainingFacet(facetValues),
            location=this.getFacetLocation(facetId),
            properties={
                width:this.facetValueHoverWidth||this.hoverWidth,
                height:this.facetValueHoverHeight||this.hoverHeight,
                align:this.facetValueHoverAlign||this.hoverAlign,
                valign:this.facetValueHoverVAlign||this.hoverVAlign,
                baseStyle:this.facetValueHoverStyle||this.hoverStyle,
                opacity:this.hoverOpacity,moveWithMouse:this.hoverMoveWithMouse
            };
        isc.Hover.show(this.facetValueHoverHTML(facetValues),properties);
    }
}
,isc.A._facetValueOver=function isc_CubeGrid__facetValueOver(facetValues){
    if(this.facetValueOver)this.facetValueOver(facetValues);
    if(this.canHover){
        isc.Hover.setAction(this,this._facetValueHover,[facetValues],this.hoverDelay);
    }
}
,isc.A._facetValueContextClick=function isc_CubeGrid__facetValueContextClick(facetValueHeader){
    this.facetValueContextItems=null;
    if(this.facetValueContextClick){
        var facetValues=this.getHeaderFacetValues(facetValueHeader);
        if(this.facetValueContextClick(facetValues,
                                        facetValueHeader.facet.id,
                                        facetValueHeader)==false)return false;
    }
    if(this.showFacetValueContextMenus){
        if(!this.facetValueContextMenu){
            this.facetValueContextMenu=this.getMenuConstructor().create(this.contextMenuProperties);
        }
        if(!this.facetValueContextItems){
            this.facetValueContextItems=this.makeFacetValueContextItems(
                this.getHeaderFacetValues(facetValueHeader),
                facetValueHeader.facet.id,
                facetValueHeader);
        }
        if(isc.isAn.Array(this.facetValueContextItems)&&this.facetValueContextItems.length>0){
            this.facetValueContextMenu.setData(this.facetValueContextItems);
            this.facetValueContextMenu.showContextMenu(this);
        }
        return false;
    }else{
        return this.showContextMenu();
    }
}
,isc.A._facetLabelHover=function isc_CubeGrid__facetLabelHover(facetId){

    if(this.facetLabelHover){
        this.convertToMethod("facetLabelHover");
        if(this.facetLabelHover(facetId)==false)return;
    }
    if(this.showHover){
        var header=this.getHeader(facetId);
        this.convertToMethod("facetLabelHoverHTML");
        var properties={
                width:(this.facetLabelHoverWidth||this.hoverWidth),
                height:(this.facetLabelHoverHeight||this.hoverHeight),
                align:(this.facetLabelHoverAlign||this.hoverAlign),
                valign:(this.facetLabelHoverVAlign||this.hoverVAlign),
                baseStyle:(this.facetLabelHoverStyle||this.hoverStyle),
                opacity:this.hoverOpacity,moveWithMouse:this.hoverMoveWithMouse
            };
        isc.Hover.show(this.facetLabelHoverHTML(facetId),properties);
    }
}
,isc.A.facetLabelHoverHTML=function isc_CubeGrid_facetLabelHoverHTML(facetId){
    return null;
}
,isc.A.facetValueHoverHTML=function isc_CubeGrid_facetValueHoverHTML(facetValues){
    return null;
}
,isc.A.outsetHoverRect=function isc_CubeGrid_outsetHoverRect(rect){
    return isc.Canvas.outsetRect(rect,this.cellHoverOutset);
}
,isc.A.getHeaderSpan=function isc_CubeGrid_getHeaderSpan(header){
    var field=header;
    if(isc.isA.Canvas(field))field=this.getFieldForHeader(field);
    var startField=field,
        endField=field;
    while(startField.childFacetValues){
        if(this._multiFacetColumn&&startField.facet.id==this._treeParentFacetId){
            var openList=this._crossFacetTree.getOpenList(),
                startIndex=openList.indexOf(startField),
                endIndex=openList.indexOf(endField);
            endIndex+=this._crossFacetTree.getOpenList(endField).length-1;
            return[startIndex,endIndex];
        }else{
            startField=startField.childFacetValues.first();
            endField=endField.childFacetValues.last();
        }
    }
    var innerFields=field.isRowHeader?this.innerRowFields:this.innerColFields;
    return[innerFields.indexOf(startField),innerFields.indexOf(endField)];
}
,isc.A.getHeaderBarFields=function isc_CubeGrid_getHeaderBarFields(headerBar){
    var fieldTree=(headerBar.vertical?this.rowFields:this.colFields);
    return fieldTree[headerBar.headerLevel];
}
,isc.A.getFieldForHeader=function isc_CubeGrid_getFieldForHeader(header){
    var headerBar=header.parentElement,
        itemNumber=headerBar.getButtonNumber(header),
        fields=this.getHeaderBarFields(headerBar);
    return fields[itemNumber];
}
,isc.A.getHeaderForField=function isc_CubeGrid_getHeaderForField(field){
    if(isc.isA.Canvas(field))return field;
    var headerTree=field.isRowHeader?this.rowHeaders:this.colHeaders,
        fieldTree=field.isRowHeader?this.rowFields:this.colFields,
        header=headerTree[field.headerLevel],
        position=fieldTree[field.headerLevel].indexOf(field);
    return header.getButton(position);
}
,isc.A.getFacetLocation=function isc_CubeGrid_getFacetLocation(facetId){
    if(isc.isAn.Object(facetId)){
        for(var firstFacetId in facetId){};
        facetId=firstFacetId;
    }
    if(this.haveRowFacets()){
        var level=this.rowFacets.indexOf(facetId);
        if(level!=-1)return{isRow:true,level:level};
    }
    if(this.haveColumnFacets()){
        var level=this.columnFacets.indexOf(facetId);
        if(level!=-1)return{isRow:false,level:level};
    }
    return null;
}
,isc.A.getHeader=function isc_CubeGrid_getHeader(id){
    if(isc.isA.String(id)){
        var location=this.getFacetLocation(id);
        if(location==null)return null;
        var headerBar=(location.isRow?this.rowFacetLabels:this.colFacetLabels);
        return headerBar.getButtons().find("facetId",id);
    }
    var facetValues=id,
        facetId=this.getContainingFacet(facetValues),
        headerBar=this.getHeaderBar(facetId);
    if(!headerBar)return null;
    var headers=headerBar.getButtons().findAll("facetValueId",facetValues[facetId]);
    if(headers==null)return headers;
    for(var i=0;i<headers.length;i++){
        var header=headers[i],
            headerFacetValues=this.getHeaderFacetValues(header),
            found=true;
        for(var propName in facetValues){
            found=found&&(headerFacetValues[propName]==facetValues[propName]);
        }
        if(found)return header;
    }
    return null;
}
,isc.A.getHeaderBar=function isc_CubeGrid_getHeaderBar(facetId){
    if(isc.isA.Object(facetId))facetId=this.getContainingFacet(facetId);
    var location=facetId?this.getFacetLocation(facetId):null;
    if(location==null)return null;
    if(location.isRow)return this.rowHeaders[location.level];
    return this.colHeaders[location.level];
}
,isc.A.getContainingFacet=function isc_CubeGrid_getContainingFacet(facetValues){
    var facetIds=isc.getKeys(facetValues),
        location=this.getFacetLocation(facetIds[0]);
    if(!location)return null;
    var numFacets=facetIds.length;
    return location.isRow?this.rowFacets[numFacets-1]:
                            this.columnFacets[numFacets-1];
}
,isc.A.getHeaderBarFacetValues=function isc_CubeGrid_getHeaderBarFacetValues(facetId){
    var headerBar=this.getHeaderBar(facetId);
    if(headerBar==null)return null;
    return this.getAllFacetValues(headerBar.getButtons());
}
,isc.A.getAllFacetValues=function isc_CubeGrid_getAllFacetValues(headers){
    var result=[];
    for(var i=0;i<headers.length;i++){
        var header=headers[i];
        result.add(this.getHeaderFacetValues(header));
    }
    return result;
}
,isc.A.getHeaderButtonProperties=function isc_CubeGrid_getHeaderButtonProperties(){
    var props=this.Super("getHeaderButtonProperties",arguments);
    if(this._facetValueTitleFunction==null){
        this._facetValueTitleFunction=function(){
            var title=this.Super("getTitle"),
                rv=this.cubeGrid;
            if(this._titleHilite!=null){
                title=rv.applyHiliteHTML(this._titleHilite,title);
            }
            if(rv.shouldShowTurndown(this)){
                title=rv.addTurndown(title,this);
            }
            return title;
        }
    }
    props.getTitle=this._facetValueTitleFunction;
    props.padTitle=this.padTitles;
    return props;
}
,isc.A.shouldShowTurndown=function isc_CubeGrid_shouldShowTurndown(field){
    if(field.canCollapse&&field._withinFacetChildren&&
        field._withinFacetChildren.length>0)return true;
    if(this._multiFacetColumn&&field.facet.id==this._treeParentFacetId)return true;
    return(field.childFacetValues&&field.canMinimize);
}
,isc.A.addTurndown=function isc_CubeGrid_addTurndown(title,field){
    if(!this._haveToggleHTML){
        var handler=(' '+(navigator.pointerEnabled?'onpointerdown':'onmousedown')+
                       '="return '+this.getID()+'._toggleOpenState()" ');
        this._closedDownHTML=
            this.imgHTML("[SKIN]arrow_closed_down.gif",16,16,null,handler);
        this._closedRightHTML=
            this.imgHTML("[SKIN]arrow_closed_right.gif",16,16,null,handler);
        this._closedLeftHTML=
            this.imgHTML("[SKIN]arrow_closed_left.gif",16,16,null,handler);
        this._openDownHTML=
            this.imgHTML("[SKIN]arrow_open_down.gif",16,16,null,handler);
        this._openUpHTML=
            this.imgHTML("[SKIN]arrow_open_up.gif",16,16,null,handler);
        this._openRightHTML=
            this.imgHTML("[SKIN]arrow_open_right.gif",16,16,null,handler);
        this._openLeftHTML=
            this.imgHTML("[SKIN]arrow_open_left.gif",16,16,null,handler);
        this._haveToggleHTML=true;
    }
    var toggleProperty=this.getToggleProperty(field),
        open=!field[toggleProperty],
        toggleHTML;
    if(!open){
        toggleHTML=field.isRowHeader?
                (this.isRTL()?this._closedLeftHTML:this._closedRightHTML):
                this._closedDownHTML;
    }else{
        var facetId=field.facet.id,
            reversed=((field.facet.isTree&&field.facet.showParentsLast)||
                        (this.inMultiFacetColumn(facetId)&&
                         this.getFacet(this._treeParentFacetId).showParentsLast));
        if(field.isRowHeader){
            toggleHTML=reversed?this._openUpHTML:this._openDownHTML;
        }else{
            toggleHTML=reversed?this._openLeftHTML:this._openRightHTML;
        }
    }
    return toggleHTML+title;
}
,isc.A.getToggleProperty=function isc_CubeGrid_getToggleProperty(field){
    return(field._withinFacetChildren&&field._withinFacetChildren.length>0?
            "collapsed":"minimized");
}
,isc.A._toggleOpenStateForField=function isc_CubeGrid__toggleOpenStateForField(field,isRow,desiredOpen){
    var toggleProperty=this.getToggleProperty(field),
        isFieldOpen=!field[toggleProperty];
    if(isFieldOpen==desiredOpen)return false;
    var facetValues=this.getHeaderFacetValues(field),
        fieldProps=this.getFieldProperties(facetValues),
        nowClosed=isFieldOpen;
    if(fieldProps!=null){
        fieldProps[toggleProperty]=nowClosed;
    }else{
        this.setFieldProperty(field,toggleProperty,nowClosed);
    }
    isRow?this.setRows(null,true):this.setColumns(null,true);
    return true;
}
,isc.A._toggleOpenState=function isc_CubeGrid__toggleOpenState(){
    var field,isRow;
    if(this.headerGrid&&this.headerGrid.containsEvent()){
        isRow=true;
        var grid=this.headerGrid,
            rowNum=grid.getEventRow(),
            colNum=grid.getEventColumn();
        field=grid.getCellField(rowNum,colNum);
    }else{
        var allBars=[].concat(this.rowHeaders).concat(this.colHeaders);
        for(var i=0;i<allBars.length;i++){
            var bar=allBars[i];
            if(bar.containsEvent()){
                var buttonNum=bar.getMouseOverButtonIndex(),
                    button=bar.getButton(buttonNum),
                    facetId=button.facet.id,
                    location=this.getFacetLocation(facetId),
                    fieldTree=(location.isRow?this.rowFields:this.colFields);
                isRow=location.isRow;
                field=fieldTree[location.level][buttonNum];
                break;
            }
        }
    }
    this._toggleOpenStateForField(field,isRow);
    return false;
}
,isc.A.toggleFieldOpenState=function isc_CubeGrid_toggleFieldOpenState(facetValueMap,desiredOpen){
    var facetId=this.getContainingFacet(facetValueMap);
    if(facetId==null)return false;
    var field,
        location=this.getFacetLocation(facetId);
    if(location.isRow&&this.rowHeaderGridMode){
        var fields=this.rowFields[location.level],
            fieldFacetValues=this.map("getHeaderFacetValues",fields);
        field=fields[fieldFacetValues.findIndex(facetValueMap)];
    }else{
        var header=this.getHeader(facetValueMap);
        field=header?this.getFieldForHeader(header):null;
    }
    if(field==null||!this.shouldShowTurndown(field))return false;
    return this._toggleOpenStateForField(field,location.isRow,desiredOpen);
}
,isc.A.expandField=function isc_CubeGrid_expandField(facetValueMap){
    return this.toggleFieldOpenState(facetValueMap,true);
}
,isc.A.collapseField=function isc_CubeGrid_collapseField(facetValueMap){
    return this.toggleFieldOpenState(facetValueMap,false);
}
,isc.A.facetValueDoubleClick=function isc_CubeGrid_facetValueDoubleClick(facetValues){
    if(this.haveColumnFacets()){
        var column=this.getFacetValuesOffset(facetValues,this.columnFacets,this.colFields[0]);
        if(column==-1)return;
        this.delayCall("autoSizeBodyColumn",[column],0);
    }
}
,isc.A.autoSizeBodyColumn=function isc_CubeGrid_autoSizeBodyColumn(column){
    var headerButton=this.header.getButton(column);
    this.setMinimized(headerButton,false);
    var columnWidth=this.body.getColumnAutoSize(column),
        headerWidth=headerButton.getPreferredWidth();
    columnWidth=Math.max(columnWidth,headerWidth);
    this.resizeField(column,columnWidth);
}
,isc.A.facetLabelDoubleClick=function isc_CubeGrid_facetLabelDoubleClick(facetLabel){
    this.autoSizeFacet(facetLabel.facetId);
}
,isc.A.autoSizeFacet=function isc_CubeGrid_autoSizeFacet(facetId){
    var location=this.getFacetLocation(facetId);
    if(!location.isRow)return;
    var facetLabel=this.getHeader(facetId),
        facetLabelWidth=facetLabel.getPreferredWidth();
    var headerBarWidth;
    if(this.rowHeaderGridMode){
        headerBarWidth=this.headerGrid.getColumnAutoSize(location.level);
    }else{
        var headerBar=this.getHeaderBar(facetId),
            headers=headerBar.getButtons();
        headerBarWidth=headers.map("getPreferredWidth").max();
    }
    var newWidth=Math.max(headerBarWidth,facetLabelWidth);
    var facetLabelNum=this.rowFacetLabels.getButtonNumber(facetLabel);
    this.rowFacetResized(facetLabelNum,newWidth);
}
,isc.A._columnIsSorted=function isc_CubeGrid__columnIsSorted(columnRef){
    var isSorted=false;
    if(this.sortedFacetId==columnRef){
        return true;
    }
    else if(isc.isAn.Object(this.sortedFacetValues)&&isc.isAn.Object(columnRef)){
        var columnFacetValues=this.getHeaderFacetValues(columnRef);
        isSorted=true;
        for(var facetId in this.sortedFacetValues){
            if(columnFacetValues[facetId]!=this.sortedFacetValues[facetId]){
                isSorted=false;
                break;
            }
        }
    }
    return isSorted;
}
,isc.A._sortButtonClick=function isc_CubeGrid__sortButtonClick(columnRef,sortDirection){
    if(this.sortDirection==sortDirection&&this._columnIsSorted(columnRef))return false;
    if(isc.isAn.Object(columnRef)){
        if(this.sortByFacetValues){
            this.convertToMethod("sortByFacetValues");
            this.sortByFacetValues(this.getHeaderFacetValues(columnRef),sortDirection);
        }
    }else{
        if(this.sortByFacetId){
            this.convertToMethod('sortByFacetId');
            this.sortByFacetId(columnRef,sortDirection);
        }
    }
}
,isc.A.headerClick=function isc_CubeGrid_headerClick(buttonNum){return false;}
,isc.A._headerCloseClick=function isc_CubeGrid__headerCloseClick(columnRef,closed){
    if(isc.isAn.Object(columnRef)){
        this.closeColumn(this.getHeaderFacetValues(columnRef));
    }else{
        this.closeFacet(columnRef);
    }
}
,isc.A.closeFacet=function isc_CubeGrid_closeFacet(facetId){
}
,isc.A.closeColumn=function isc_CubeGrid_closeColumn(headerFacetValues){
}
,isc.A.rebuildField=function isc_CubeGrid_rebuildField(facetValues){
    this.getFacetLocation(facetValues).isRow?this.setRows(null,true)
                                             :this.setColumns(null,true);
}
,isc.A.addFacetValue=function isc_CubeGrid_addFacetValue(facetId,newFacetValue,facetValues){
    this.getFacet(facetId).values.add(newFacetValue);
    this.setFacets();
    if(facetValues){
        newFacetValue.hidden=true;
        this.showFacetValues(facetValues);
    }else{
        this.rebuildField(facetId);
    }
}
,isc.A.removeFacetValue=function isc_CubeGrid_removeFacetValue(facetId,facetValueId){
    var facet=this.getFacet(facetId);
    facet.values.remove(facet.values.find("id",facetValueId));
    this.setFacets();
    this.rebuildField(facetId);
}
,isc.A.updateFacetValue=function isc_CubeGrid_updateFacetValue(facetId,facetValue){
    var facet=this.getFacet(facetId),
        index=facet.values.findIndex("id",facetValue.id);
    facet.values[index]=facetValue;
    this.setFacets();
    this.rebuildField(facetId);
}
);
isc.evalBoundary;isc.B.push(isc.A.hideFacetValue=function isc_CubeGrid_hideFacetValue(facetId,facetValueId,dontRebuild){
    var facetValue=this.getFacetValue(facetId,facetValueId);
    facetValue.hidden=true;
    if(!dontRebuild)this.rebuildField(facetId);
}
,isc.A.showFacetValue=function isc_CubeGrid_showFacetValue(facetId,facetValueId,dontRebuild){
    var facetValue=this.getFacetValue(facetId,facetValueId);
    delete facetValue.hidden;
    if(!dontRebuild)this.rebuildField(facetId);
}
,isc.A.hideFacetValues=function isc_CubeGrid_hideFacetValues(facetValues){
    this.setFieldProperty(facetValues,"hidden",true);
    this.rebuildField(facetValues);
}
,isc.A.showFacetValues=function isc_CubeGrid_showFacetValues(facetValues){
    this.setFieldProperty(facetValues,"hidden",false);
    this.rebuildField(facetValues);
}
,isc.A.getSyncedHeaders=function isc_CubeGrid_getSyncedHeaders(header){
    if(!header.facetValueGroup)return[header];
    var headerBar=header.parentElement;
    return headerBar.getButtons().findAll({
        "facetValueId":header.facetValueId,
        "facetValueGroup":header.facetValueGroup
    });
}
,isc.A.shouldShowHeaderMenuButton=function isc_CubeGrid_shouldShowHeaderMenuButton(){
    return false;
}
,isc.A.headerBarContextClick=function isc_CubeGrid_headerBarContextClick(){
}
,isc.A.setMinimized=function isc_CubeGrid_setMinimized(clickedHeader,minimized){
    var headers=this.getSyncedHeaders(clickedHeader);
    var oldWidth=clickedHeader.getVisibleWidth();
    for(var i=0;i<headers.length;i++){
        var header=headers[i];
        header.minimized=minimized;
        header.canDragResize=!minimized;
        if(minimized)header._oldWidth=oldWidth;
    }
    clickedHeader.parentElement.setResizeRules();
}
,isc.A.minimizeColumn=function isc_CubeGrid_minimizeColumn(col,minimize){
    if(minimize==null)minimize=true;
    var header=this.header.getButton(col);
    this.setMinimized(header,minimize);
    this.resizeField(col,minimize?header.controlSize:header._oldWidth);
}
,isc.A.minimizeClick=function isc_CubeGrid_minimizeClick(header,minimize){
    this.minimizeColumn(header.parentElement.getButtonNumber(header),minimize);
}
,isc.A.observeHeaderBar=function isc_CubeGrid_observeHeaderBar(headerBar,headerIndex,isRowHeader){
    this.observe(headerBar,"selectionChanged","observer.headerSelected(observed)");
    if(headerIndex!=null){
        this.observe(headerBar,
                    "scrollTo",
                    "observer.syncBodyScrolling("+headerIndex+","+isRowHeader+")"
        );
    }
}
,isc.A.deselectHeaders=function isc_CubeGrid_deselectHeaders(headerBars,excludeHeaderBar){
    for(var i=0;i<headerBars.length;i++){
        var headerBar=headerBars[i];
        if(headerBar!=excludeHeaderBar&&headerBar.selection!=null){
            headerBar.selection.deselectAll();
        }
    }
}
,isc.A.headerSelected=function isc_CubeGrid_headerSelected(headerBar){
    this.clearOtherSelections(headerBar);
    if(headerBar.isFacetBar){
        this.autoSelectFacetValues(headerBar);
        return;
    }
    if(this.rowHeaderGridMode&&headerBar.vertical)
    {
        if(this.facetValueSelectionChanged&&
            this.facetValueSelectionChanged()==false)return false;
    }else{
        var header=headerBar.selection.lastSelectionItem,
            newState=headerBar.selection.isSelected(header);
        if(this.facetValueSelectionChanged){
            var facetValues=this.getHeaderFacetValues(header);
            if(this.facetValueSelectionChanged(facetValues,newState)==false)return false;
        }
        if(this.autoSelectHeaders&&!this.autoSelectingHeaders){
            this.syncHeaderTreeSelection(headerBar,header,newState);
        }
    }
    if(this.autoSelectValues&&this.autoSelectValues!="none"&&headerBar.isInnerMost){
        if(this.rowHeaderGridMode&&headerBar.vertical){
            var changedCells=headerBar.selection.changedCells,
                innerColNum=this.rowFacets.length-1;
            for(var i=0;i<changedCells.length;i++){
                var changedCell=changedCells[i],
                    rowNum=changedCell[0],
                    colNum=changedCell[1];
                if(colNum!=innerColNum)continue;
                var newState=headerBar.selection.cellIsSelected(rowNum,colNum);
                this.selectSpannedCells([rowNum,rowNum],true,newState);
            }
        }else{
            var newState=headerBar.selection.isSelected(headerBar.selection.lastSelectionItem);
            this.selectSpannedCells(this.getHeaderSpan(header),headerBar.vertical,newState);
        }
    }
}
,isc.A.selectSpannedCells=function isc_CubeGrid_selectSpannedCells(span,vertical,newState){
    if(vertical&&(this.autoSelectValues=="both"||this.autoSelectValues=="rows"))
    {
        var maxCols=this.findSelectionBoundary(0,this.numCols-1,this.colBoundaries);
        this.selection.setCellRangeSelection(span[0],0,span[1],maxCols,newState);
    }else if(!vertical&&(this.autoSelectValues=="both"||this.autoSelectValues=="cols"))
    {
        var maxRows=this.findSelectionBoundary(0,this.numRows-1,this.rowBoundaries);
        this.selection.setCellRangeSelection(0,span[0],maxRows,span[1],newState);
    }
}
,isc.A.clearOtherSelections=function isc_CubeGrid_clearOtherSelections(headerBar){
    if(headerBar!=this.lastSelectionHeaderBar&&!this.autoSelectingHeaders){
        if(isc.EventHandler.ctrlKeyDown()){
            if(this.lastSelectionHeaderBar==null)this.selection.deselectAll();
            this.lastSelectionHeaderBar=headerBar;
            var selectedFacets=this.getFacetsHavingSelection();
            if(selectedFacets.contains(this.metricFacetId)&&
                (selectedFacets.length>1||headerBar==this.rowFacetLabels))
            {
            }else{
                return;
            }
        }
        if(!(this.rowHeaderGridMode&&headerBar.vertical&&
              this.lastSelectionHeaderBar&&this.lastSelectionHeaderBar.vertical))
        {
            this.selection.deselectAll();
        }
        this.autoSelectingHeaders=true;
        if(!(headerBar.vertical&&this.rowHeaderGridMode)){
            this.deselectHeaders(this.rowHeaders,headerBar);
        }
        this.deselectHeaders(this.colHeaders,headerBar);
        if(this.showRowFacetLabels!=false&&this.rowFacetLabels&&
            headerBar!=this.rowFacetLabels)
        {
            this.rowFacetLabels.selection.deselectAll();
        }
        this.lastSelectionHeaderBar=headerBar;
        this.autoSelectingHeaders=false;
    }
}
,isc.A.autoSelectFacetValues=function isc_CubeGrid_autoSelectFacetValues(facetBar){
    if(this.autoSelectingHeaders)return;
    this.autoSelectingHeaders=true;
    var item=facetBar.selection.lastSelectionItem,
        isSelected=facetBar.selection.isSelected(item),
        headerBar=this.getHeaderBar(item.facetId);
    if(this.rowHeaderGridMode){
        var rowFields=this.rowFieldsVisualOrder||this.rowFields;
        var firstFields=rowFields.getProperty("0"),
            facetIdVisualOrder=firstFields.getProperty("facet").getProperty("id"),
            column=facetIdVisualOrder.indexOf(item.facetId);
        if(isSelected)headerBar.selection.selectCol(column);
        else headerBar.selection.deselectCol(column);
    }else{
        if(isSelected)headerBar.selection.selectAll();
        else headerBar.selection.deselectAll();
    }
    this.autoSelectingHeaders=false;
}
,isc.A.syncHeaderTreeSelection=function isc_CubeGrid_syncHeaderTreeSelection(headerBar,header,newState){
    this.autoSelectingHeaders=true;
    this.autoSelectChildren(header,newState);
    var field=header;
    while(field.parent){
        header=this.getHeaderForField(field);
        headerBar=header.parentElement;
        var siblings=header.parent.childFacetValues;
        for(var i=0;i<siblings.length;i++){
            var sibling=this.getHeaderForField(siblings[i]);
            if(!headerBar.selection.isSelected(sibling))break;
        }
        var shouldSelectParent=(i==siblings.length),
            parentHeader=this.getHeaderForField(header.parent),
            parentHeaderBar=parentHeader.parentElement;
        if(parentHeaderBar.selection.isSelected(parentHeader)!=shouldSelectParent){
            parentHeaderBar.selection.setSelected(parentHeader,shouldSelectParent);
        }
        field=field.parent;
    }
    this.autoSelectingHeaders=false;
}
,isc.A.autoSelectChildren=function isc_CubeGrid_autoSelectChildren(header,newState){
    if(header.childFacetValues==null||header.childFacetValues.length==0)return;
    var children=header.childFacetValues;
    for(var i=0;i<children.length;i++){
        var child=this.getHeaderForField(children[i]),
            childHeaderBar=child.parentElement;
        if(newState!=childHeaderBar.selection.isSelected(child)){
            childHeaderBar.selection.setSelected(child,newState);
            this.autoSelectChildren(child,newState);
        }
    }
}
,isc.A.getSelectedCells=function isc_CubeGrid_getSelectedCells(){
    return this.getSelection();
}
,isc.A.getSelectedCellIds=function isc_CubeGrid_getSelectedCellIds(){
    var selection=this.getSelection();
    return(selection==null?[]:selection.getProperty(this.cellIdProperty));
}
,isc.A.anyCellSelected=function isc_CubeGrid_anyCellSelected(){
    return this.selection.anySelected();
}
,isc.A.cellIsSelected=function isc_CubeGrid_cellIsSelected(cell){
    if(cell!=null&&cell._rowNum==null)cell=this.data.find(this.cellIdProperty,cell);
    if(!cell)return false;
    return this.selection.cellIsSelected(cell._rowNum,cell._colNum);
}
,isc.A.selectCell=function isc_CubeGrid_selectCell(cell,newState){
    if(cell!=null&&cell._rowNum==null)cell=this.data.find(this.cellIdProperty,cell);
    if(!cell)return;
    return this.selection.setCellSelection(cell._rowNum,cell._colNum,newState);
}
,isc.A.deselectCell=function isc_CubeGrid_deselectCell(cell){
    this.selectCell(cell,false);
}
,isc.A.selectCells=function isc_CubeGrid_selectCells(cellList,newState){
    if(newState==null)newState=true;
    if(isc.isAn.Array(cellList)){
        var cellCoords=[];
        for(var i=0;i<cellList.length;i++){
            var cell=cellList[i];
            if(isc.isA.String(cell))cell=this.data.find(this.cellIdProperty,cell);
            if(cell==null)continue;
            cellCoords[cellCoords.length]=[cell._rowNum,cell._colNum];
        }
        return this.selection.setCellListSelection(cellCoords,newState);
    }
    var facetValues=cellList;
    var matchingCells=this.data.findAll(facetValues);
    if(matchingCells==null||matchingCells.length==0)return false;
    matchingCells=matchingCells.objectsToArrays(["_rowNum","_colNum"]);
    return this.selection.setCellListSelection(matchingCells,newState);
}
,isc.A.deselectCells=function isc_CubeGrid_deselectCells(cellList){
    this.selectCells(cellList,false);
}
,isc.A.selectAllCells=function isc_CubeGrid_selectAllCells(){
    this.selection.selectAll();
}
,isc.A.deselectAllCells=function isc_CubeGrid_deselectAllCells(){
    this.selection.deselectAll();
}
,isc.A.getSelectedFacetValues=function isc_CubeGrid_getSelectedFacetValues(facetId){
    var facetIds=facetId?[facetId]:this.getAllFacetIds(),
        selectedFacetValues=[];
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i],
            facetLocation=this.getFacetLocation(facetId);
        if(facetLocation.isRow&&this.rowHeaderGridMode){
            var selectedFields=this.getSelectedHeaderFields(facetId),
                selectedValues=this.map("getHeaderFacetValues",selectedFields);
            selectedFacetValues.addList(selectedValues);
        }else{
            var headerBar=this.getHeaderBar(facetIds[i]);
            if(headerBar==null)continue;
            var headers=headerBar.getButtons();
            for(var j=0;j<headers.length;j++){
                if(headers[j].isSelected()){
                    selectedFacetValues.add(this.getHeaderFacetValues(headers[j]));
                }
            }
        }
    }
    return selectedFacetValues;
}
,isc.A.getSelectedHeaderFields=function isc_CubeGrid_getSelectedHeaderFields(facetId){
    var selectedFields=[],
        facetLocation=this.getFacetLocation(facetId),
        selectedCells=this.headerGrid.selection.getSelectedCells(),
        rowFields=this.rowFieldsVisualOrder||this.rowFields;
    for(var i=0;i<selectedCells.length;i++){
        var cell=selectedCells[i],
            colNum=cell[1];
        if(colNum!=facetLocation.level)continue;
        var field=this.headerGrid.getCellField(cell[0],cell[1]);
        selectedFields.add(field);
    }
    return selectedFields;
}
,isc.A.facetValuesSelected=function isc_CubeGrid_facetValuesSelected(facetValues){
    var header=this.getHeader(facetValues);
    if(header==null)return null;
    return header.parentElement.selection.isSelected(header);
}
,isc.A.facetHasSelection=function isc_CubeGrid_facetHasSelection(facetId){
    var facetIds=facetId?[facetId]:this.getAllFacetIds();
    var hasSelection=false;
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i],
            facetLocation=this.getFacetLocation(facetId);
        if(facetLocation.isRow&&this.rowHeaderGridMode){
            if(this.getSelectedHeaderFields(facetId).length>0)hasSelection=true;
            continue;
        }
        var headerBar=this.getHeaderBar(facetIds[i]);
        if(headerBar==null)continue;
        if(headerBar.selection.anySelected())hasSelection=true;
    }
    return hasSelection;
}
,isc.A.getFacetsHavingSelection=function isc_CubeGrid_getFacetsHavingSelection(){
    var facetIds=this.getAllFacetIds(),
        selectedFacets=[];
    for(var i=0;i<facetIds.length;i++){
        var facetId=facetIds[i];
        if(this.facetHasSelection(facetId))selectedFacets.add(facetId);
    }
    return selectedFacets;
}
,isc.A.selectFacetValues=function isc_CubeGrid_selectFacetValues(facetValues,newState){
    var header=this.getHeader(facetValues);
    if(header==null)return null;
    return header.parentElement.selection.setSelected(header,newState);
}
,isc.A.deselectFacetValues=function isc_CubeGrid_deselectFacetValues(facetValues){
    this.selectFacetValues(facetValues,false);
}
,isc.A.selectFacetValue=function isc_CubeGrid_selectFacetValue(facetId,facetValueId,newState){
    if(newState==null)newState=true;
    var headerBar=this.getHeaderBar(facetId);
    if(!headerBar)return;
    var headers=headerBar.getButtons().findAll("facetValueId",facetValueId);
    return headerBar.selection.selectList(headers,newState);
}
,isc.A.deselectFacetValue=function isc_CubeGrid_deselectFacetValue(facetId,facetValueId){
    this.selectFacetValue(facetId,facetValueId,false);
}
,isc.A.selectAllFacetValues=function isc_CubeGrid_selectAllFacetValues(facetId,newState){
    var facetIds=[];
    if(newState==null)newState=true;
    if(facetId==null){
        for(var i=0;i<this.facets.length;i++)facetIds[i]=this.facets[i].id;
    }else{
        facetIds[0]=facetId;
    }
    for(var i=0;i<facetIds.length;i++){
        var headerBar=this.getHeaderBar(facetIds[i]);
        if(!headerBar)continue;
        if(newState)headerBar.selection.selectAll();
        else headerBar.selection.deselectAll();
    }
}
,isc.A.deselectAllFacetValues=function isc_CubeGrid_deselectAllFacetValues(facetId){
    this.selectAllFacetValues(facetId,false);
}
,isc.A.deselectAll=function isc_CubeGrid_deselectAll(){
    this.deselectAllCells();
    this.deselectAllFacetValues();
}
,isc.A.reorderField=function isc_CubeGrid_reorderField(fieldNum,moveToPosition,syncAction){
    var moveDelta=moveToPosition-fieldNum,
        movedField=this.fields[fieldNum];
    this.selection.deselectAll();
    this.deselectHeaders(this.rowHeaders);
    this.deselectHeaders(this.colHeaders);
    this.cellIndex=null;
    var forward=(moveToPosition>fieldNum),
        i=fieldNum+(forward?1:-1),
        facetValuesSpanned=[];
    while((forward&&i<=moveToPosition)||(!forward&&i>=moveToPosition))
    {
        var field=this.fields[i];
        if(field.parent!=movedField.parent)break;
        facetValuesSpanned.add(field.facetValueId);
        forward?i++:i--;
    }
    var fields=this.fields.duplicate();
    for(var i=0;i<fields.length;i++){
        var field=fields[i];
        if(field==movedField||
            (movedField.facetValueGroup!=null&&
             field.facetValueGroup==movedField.facetValueGroup&&
             field.facetValueId==movedField.facetValueId))
        {
            var newIndex=this.passFacetValues(fields,i,forward,facetValuesSpanned);
            var moveDelta=this.getMoveGroupDelta(fields,i,newIndex);
            var moveGroupExtents=this.getMoveGroupExtents(fields,i);
            this.reorderFields(moveGroupExtents[0],moveGroupExtents[1]+1,moveDelta);
        }
    }
    this.rowBorders=this.getBorderStyles(this.innerRowFields,true);
    this.colBorders=this.getBorderStyles(this.innerColFields);
    this.rowBoundaries=this.getSelectionBoundaries(this.innerRowFields);
    this.colBoundaries=this.getSelectionBoundaries(this.innerColFields);
    if(this._editSessions&&!isc.isA.emptyObject(this._editSessions)){
        this._remapEditRows();
    }
    if(!syncAction){
        this._lastReorderedMovedFrom=fieldNum;
        this._lastReorderedMovedTo=moveToPosition;
        this.fieldReorderedByUser();
    }
    if(this.facetValueReordered)this.facetValueReordered(movedField.facetValueGroup);
}
,isc.A.reorderFields=function isc_CubeGrid_reorderFields(start,end,moveDelta){
    var startField=this.fields[start],
        rangeSize=end-start;
    if(startField.parent){
        var indexInParent=startField.parent.childFacetValues.indexOf(startField);
        startField.parent.childFacetValues.slideRange(indexInParent,indexInParent+rangeSize,
                                                      indexInParent+moveDelta);
    }
    this.Super("reorderFields",arguments);
}
,isc.A.passFacetValues=function isc_CubeGrid_passFacetValues(fields,i,forward,facetValues){
    var valuesLeft=isc.clone(facetValues),
        startParent=fields[i].parent;
    while((forward&&i<fields.length)||
            (!forward&&i>=0))
    {
        var field=fields[i];
        if(field.parent!=startParent){
            return forward?i-1:i+1;
        }
        valuesLeft.remove(field.facetValueId);
        if(valuesLeft.isEmpty()){
            return i;
        }
        forward?i++:i--;
    }
    return forward?fields.length-1:0;
}
,isc.A.getMoveGroupExtents=function isc_CubeGrid_getMoveGroupExtents(headers,moveHeaderPosition){
    var moveHeader=headers[moveHeaderPosition];
    if(moveHeader.moveGroup==null)return[moveHeaderPosition,moveHeaderPosition];
    var extents=[];
    var i=moveHeaderPosition;
    while(i>=0&&headers[i].moveGroup==moveHeader.moveGroup&&
           headers[i].parent==moveHeader.parent)i--;
    extents[0]=i+1;
    var i=moveHeaderPosition;
    while(i<headers.length&&headers[i].moveGroup==moveHeader.moveGroup&&
           headers[i].parent==moveHeader.parent)i++;
    extents[1]=i-1;
    return extents;
}
,isc.A.nearestPositionWithinParent=function isc_CubeGrid_nearestPositionWithinParent(headers,startPosition,targetPosition){
    if(targetPosition>headers.length-1)targetPosition=headers.length-1;
    if(targetPosition<0)targetPosition=0;
    var header=headers[startPosition];
    if(header.parent==headers[targetPosition].parent){
        return targetPosition;
    }
    var allParents=headers.getProperty("parent");
    return(targetPosition>startPosition?
            allParents.lastIndexOf(header.parent):
            allParents.indexOf(header.parent));
}
,isc.A.getMoveGroupDelta=function isc_CubeGrid_getMoveGroupDelta(headers,startPosition,targetPosition){
    var moveGroup=this.getMoveGroupExtents(headers,startPosition);
    var outerHeaderPosition=(targetPosition>startPosition?moveGroup[1]:moveGroup[0]);
    var outerHeaderTargetPosition=outerHeaderPosition+(targetPosition-startPosition);
    var safePosition=this.nearestPositionWithinParent(headers,
                                                        outerHeaderPosition,
                                                        outerHeaderTargetPosition);
    return safePosition-outerHeaderPosition;
}
,isc.A.fieldReorderedByUser=function isc_CubeGrid_fieldReorderedByUser(){}
,isc.A.resizeFacetValue=function isc_CubeGrid_resizeFacetValue(facetValueId,newWidth){
    return this.resizeField(null,newWidth,facetValueId);
}
,isc.A.resizeField=function isc_CubeGrid_resizeField(fieldNum,newWidth,facetValue){
    if(fieldNum!=null)facetValue=this.fields[fieldNum].facetValueId;
    for(var i=0;i<this.fields.length;i++){
        var field=this.fields[i];
        if(i==fieldNum||field.facetValueId==facetValue)
        {
            this.header.resizeItem(i,newWidth);
            this.fields[i].width=newWidth;
            this._fieldWidths[i]=newWidth;
        }
    }
    this.setBodyFieldWidths(this._fieldWidths);
    if(fieldNum!=null){
        this._lastResizedFacetValue=facetValue;
        this._lastResizedWidth=newWidth;
        this.fieldResizedByUser();
    }
    this._resized();
}
,isc.A.fieldResizedByUser=function isc_CubeGrid_fieldResizedByUser(){}
,isc.A.rowResized=function isc_CubeGrid_rowResized(rowNum,newSize){}
,isc.A.hiliteRecord=function isc_CubeGrid_hiliteRecord(record,field,hilite){
    if(this.inlinedFacet)return this.Super("hiliteRecord",arguments);
    else record[this.hiliteProperty]=hilite.id;
}
,isc.A.getField=function isc_CubeGrid_getField(fieldId){
    if(!this.fields)return null;
    return isc.Class.getArrayItem(fieldId,this.fields,"id");
}
,isc.A.getFieldNum=function isc_CubeGrid_getFieldNum(fieldId){
    if(!this.fields)return-1;
    if(isc.isA.Object(fieldId)){
        if(this.fields!=null){
            var index=this.fields.indexOf(fieldId);
            if(index!=-1)return index;
        }
        if(fieldId["id"]!=null){
            fieldId=fieldId["id"];
        }
    }
    return isc.Class.getArrayItemIndex(fieldId,this.fields,"id");
}
,isc.A.hiliteCell=function isc_CubeGrid_hiliteCell(cellObj,hiliteID){
    if(isc.isA.Number(cellObj)){
        cellObj=this.getCellRecord(cellObj,hiliteID);
        hiliteID=arguments[2];
    }
    if(!cellObj)return false;
    if(cellObj[this.hiliteProperty]==hiliteID){
        return false;
    }else{
        cellObj[this.hiliteProperty]=hiliteID;
        this.refreshCells([[cellObj._rowNum,cellObj._colNum]]);
        return true;
    }
}
,isc.A.hiliteCellList=function isc_CubeGrid_hiliteCellList(cellObjList,hiliteID){
    if(!isc.isAn.Array(cellObjList))return false;
    var cellNums=[];
    for(var i=0,numCells=cellObjList.length,cellObj;i<numCells;i++){
        cellObj=cellObjList[i];
        if(!cellObj||cellObj[this.hiliteProperty]==hiliteID)continue;
        cellObj[this.hiliteProperty]=hiliteID;
        cellNums[cellNums.length]=[cellObj._rowNum,cellObj._colNum];
    }
    this.refreshCells(cellNums);
    return true;
}
,isc.A.hiliteFacetValue=function isc_CubeGrid_hiliteFacetValue(facetID,facetValueID,hiliteID){
    var facetValueObj=this.getFacetValue(facetID,facetValueID);
    if(!facetValueObj)return false;
    if(facetValueObj[this.hiliteProperty]==hiliteID){
        return false;
    }else{
        var cellNums=[];
        var isInFacet=function(facetID,innerFacet){
            var result=false;
            var facet=innerFacet;
            while(facet!=null){
                if(facet.id==facetID||(facet.facet&&facet.facet.id==facetID)||
                        ((facet.parent?facet.parent.facet.id:null)==facetID))
                {
                    result=true;
                    break;
                }
                facet=facet.parent;
            }
            return result;
        };
        var isInFacetValue=function(facetValueID,innerFacet){
            var result=false;
            var facet=innerFacet;
            while(facet!=null){
                if(facet.facetValueId==facetValueID){
                    result=true;
                    break;
                }
                facet=facet.parent;
            }
            return result;
        };
        if(this.innerColFields.length>0&&isInFacet(facetID,this.innerColFields[0])){
            facetValueObj[this.hiliteProperty]=hiliteID;
            for(var i=0,numCols=this.numCols,numRows=this.numRows,colHeader;i<numCols;i++){
                colHeader=this.innerColFields[i];
                if(isInFacetValue(facetValueID,colHeader)){
                    colHeader[this.hiliteProperty]=hiliteID;
                    for(var j=0;j<numRows;j++)cellNums[cellNums.length]=[j,i];
                }
            }
        }
        else if(this.innerRowFields.length>0&&isInFacet(facetID,this.innerRowFields[0]))
        {
            facetValueObj[this.hiliteProperty]=hiliteID;
            for(var i=0,numCols=this.numCols,numRows=this.numRows,rowHeader;
                 i<numRows;i++)
            {
                rowHeader=this.innerRowFields[i];
                if(isInFacetValue(facetValueID,rowHeader)){
                    rowHeader[this.hiliteProperty]=hiliteID;
                    for(var j=0;j<numCols;j++)cellNums[cellNums.length]=[i,j];
                }
            }
        }
        else return false;
        this.refreshCells(cellNums);
        return true;
    }
}
,isc.A.refreshCells=function isc_CubeGrid_refreshCells(cellList){
    var body=this.body;
    if(body==null)return;
    var oldSetting=body.showHiliteInCells;
    body.showHiliteInCells=true;
    body.refreshCellStyles(cellList);
    body.showHiliteInCells=oldSetting;
}
,isc.A.setFacetTitle=function isc_CubeGrid_setFacetTitle(facetId,newTitle){
    if(newTitle==null)return;
    var facet=this.getFacet(facetId);
    if(facet==null)return;
    facet.title=newTitle;
    var facetLabel=this.getHeader(facetId);
    if(facetLabel!=null)facetLabel.setTitle(newTitle);
}
,isc.A.setFacetTitleAlign=function isc_CubeGrid_setFacetTitleAlign(facetId,align){
    var facet=this.getFacet(facetId);
    if(facet==null)return;
    facet.titleAlign=align;
    var facetLabel=this.getHeader(facetId);
    if(facetLabel!=null){
        facetLabel.align=align;
        facetLabel.markForRedraw();
    }
}
,isc.A.setFacetValueTitle=function isc_CubeGrid_setFacetValueTitle(facetId,facetValueId,newTitle){
    if(newTitle==null)return;
    var facetValue=this.getFacetValue(facetId,facetValueId);
    if(facetValue==null)return;
    facetValue.title=newTitle;
    var location=this.getFacetLocation(facetId);
    if(this.rowHeaderGridMode&&location.isRow){
        var fields=this.rowFields[location.level].findAll("facetValueId",facetValueId);
        fields.setProperty("title",newTitle);
        this.headerGrid.markForRedraw();
    }else{
        var headerBar=this.getHeaderBar(facetId);
        if(headerBar==null)return;
        var headers=headerBar.getButtons().findAll("facetValueId",facetValueId);
        headers.map("setTitle",newTitle);
        if(this.autoSizeHeaders)this.delayCall("adjustHeaderHeights",[],0);
    }
}
,isc.A.setFacetValueTitleAlign=function isc_CubeGrid_setFacetValueTitleAlign(facetId,facetValueId,align){
    var facetValue=this.getFacetValue(facetId,facetValueId);
    if(facetValue!=null)facetValue.align=align;
    var headerBar=this.getHeaderBar(facetId);
    if(headerBar==null)return;
    var headers=headerBar.getButtons().findAll("facetValueId",facetValueId);
    if(headers!=null){
        for(var i=0;i<headers.length;i++){
            headers[i].align=align;
            headers[i].markForRedraw();
        }
    }
}
,isc.A.getFacetValueLayout=function isc_CubeGrid_getFacetValueLayout(id){
    var facetValueGroup=this.getFacetValueGroup(id),
        facetId=(facetValueGroup!=null?facetValueGroup.facetId:id),
        headers=this.getHeaderBar(facetId).getButtons(),
        facetValues=(facetValueGroup==null?headers:
                       headers.findAll("facetValueGroup",id));
    var layoutInfo=facetValues.getProperties(["facetValueId","width"]);
    return layoutInfo;
}
,isc.A.getInnerColumnFacetValueLayout=function isc_CubeGrid_getInnerColumnFacetValueLayout(){
    return this.colHeaders.last().getButtons().getProperties(["facetValueId","width"]);
}
,isc.A.getRowFacetLayout=function isc_CubeGrid_getRowFacetLayout(){
    return this.rowFacetLabels.getButtons().getProperties(["facetId","width"]);
}
,isc.A.getColumnFacetLayout=function isc_CubeGrid_getColumnFacetLayout(){
    var layout=[];
    for(var i=0;i<this.colHeaders.length;i++){
        layout[i]={
            facetId:this.colHeaders[i].facetId,
            height:this.colHeaders[i].getHeight()
        }
    }
    return layout;
}
,isc.A.setEnableCharting=function isc_CubeGrid_setEnableCharting(enableCharting){
    if(enableCharting)this.checkChartConstructor();
    this.enableCharting=enableCharting;
}
,isc.A.getMetricFacetValues=function isc_CubeGrid_getMetricFacetValues(){
    var metricFacet=this.getFacet(this.metricFacetId);
    return(metricFacet?metricFacet.values:[this.getMetricFacetValue()]);
}
,isc.A.getMetricFacetValue=function isc_CubeGrid_getMetricFacetValue(facetValueId){
    var metricFacet=this.getFacet(this.metricFacetId);
    if(metricFacet==null)return{id:this.valueProperty,title:this.valueTitle};
    if(isc.isAn.Object(facetValueId))facetValueId=facetValueId[metricFacet.id];
    if(metricFacet!=null)return this.getFacetValue(this.metricFacetId,facetValueId);
}
,isc.A.getFacetChartMenu=function isc_CubeGrid_getFacetChartMenu(facetId){
}
,isc.A.getFacetValueChartMenu=function isc_CubeGrid_getFacetValueChartMenu(facetValues,facetId){
    if(!this.haveRowFacets()||!this.haveColumnFacets())return null;
    var variableFacets=this.getAllFacetIds();
    variableFacets.removeList(isc.getKeys(facetValues));
    variableFacets.remove(this.metricFacetId);
    if(variableFacets.length>2){
        this.logWarn("can't chart, too many variable facets: "+this.echo(variableFacets));
        return null;
    }
    this.lastFacetValues=facetValues;
    var items=[],
        metricFacetValues=this.getMetricFacetValues();
    for(var i=0;i<metricFacetValues.length;i++){
        var metricFacetValue=metricFacetValues[i];
        items.add({
            title:this.getChartTitle(metricFacetValue,variableFacets),
            click:"target.chartLast("+isc.Comm.serialize(variableFacets)+","+
                isc.Comm.serialize(metricFacetValue.id)+");"
        });
    }
    return this.getMenuConstructor().create(this.contextMenuProperties,{data:items});
}
,isc.A.getCellChartMenu=function isc_CubeGrid_getCellChartMenu(row,col){
    var facetValues=this.lastFacetValues=this.getCellFacetValues(row,col),
        metricFacetValue=facetValues[this.metricFacetId]||this.getMetricFacetValues()[0],
        menuItems=[];
    facetValues=isc.clone(facetValues);
    delete facetValues[this.metricFacetId];
    for(var firstFacet in facetValues){
        if(this.getFacet(firstFacet).values.length<=1)continue;
        for(var secondFacet in facetValues){
            if(firstFacet==secondFacet)continue;
            if(this.getFacet(secondFacet).values.length<=1)continue;
            var variableFacets=[firstFacet,secondFacet];
            menuItems.add({
                title:this.getChartTitle(metricFacetValue,variableFacets),
                click:"target.chartLast("+isc.Comm.serialize(variableFacets)+");"
            });
        }
    }
    return this.getMenuConstructor().create(this.contextMenuProperties,{data:menuItems});
}
,isc.A.chartLast=function isc_CubeGrid_chartLast(variableFacets,metricFacetValueId){
    var facetValues=this.lastFacetValues,
        metricFacetValueId=metricFacetValueId||facetValues[this.metricFacetId];
    if(this.getFacet(this.metricFacetId))facetValues[this.metricFacetId]=metricFacetValueId;
    for(var i=0;i<variableFacets.length;i++){
        delete facetValues[variableFacets[i]];
    }
    this.showChartDialog(facetValues,variableFacets);
}
,isc.A.getChartTitle=function isc_CubeGrid_getChartTitle(metricFacetValue,variableFacets){
    if(!isc.isAn.Array(variableFacets))variableFacets=[variableFacets];
    variableFacets=this.map("getFacet",variableFacets);
    if(isc.isA.String(metricFacetValue)){
        metricFacetValue=this.getFacetValue(this.metricFacetId,metricFacetValue);
    }
    var title=metricFacetValue.title+" by "+
                variableFacets.getProperty("title").join(" and ");
    return title;
}
,isc.A.getChartSubtitle=function isc_CubeGrid_getChartSubtitle(fixedFacetValues){
    var fixedFacetValuesList;
    if(isc.isAn.Array(fixedFacetValues)){
        fixedFacetValuesList=fixedFacetValues;
    }else if(isc.isAn.Object(fixedFacetValues)){
        fixedFacetValuesList=[];
        for(var facetId in fixedFacetValues){
            if(facetId==this.metricFacetId)continue;
            fixedFacetValuesList.add(this.getFacetValue(facetId,fixedFacetValues[facetId]));
        }
    }
    if(fixedFacetValuesList!=null){
        return" for "+fixedFacetValuesList.getProperty("title").join(", ");
    }
    return"";
}
,isc.A.makeChart=function isc_CubeGrid_makeChart(fixedFacetValues,variableFacets,properties,dialogProperties,confirmed){
    fixedFacetValues=fixedFacetValues||{};
    var facets=this.map("getFacet",variableFacets);
    if(facets.length>1&&this.chartConfirmThreshold>0){
        var totalValues=facets[0].values.length*
                          facets[1].values.length;
        if(totalValues>this.chartConfirmThreshold&&!confirmed){
            var cg=this,
                callback=function(result){
                    if(result)cg.makeChart(fixedFacetValues,variableFacets,
                                             properties,dialogProperties,true);
                },
                message="Chart "+totalValues+" values?";
            if(isc.confirm){
                isc.confirm(message,callback);
            }else{
                if(confirm(message))callback(true);
            }
            return;
        }
    }
    var chart=this._finishChart(fixedFacetValues,variableFacets,properties,
                                  dialogProperties,this.dataSource!=null);
    if(this.dataSource){
        var cg=this;
        this.getDataSource().fetchData(fixedFacetValues,
                                       function(dsResponse,data,dsRequest){
                                           cg._fetchDataReply(dsResponse,data,dsRequest);
                                           cg._populateChart(chart,fixedFacetValues);
                                       });
    }
    return chart;
}
,isc.A._populateChart=function isc_CubeGrid__populateChart(chart,fixedFacetValues){
    var values=this.data.findAll(fixedFacetValues);
    chart.setData(values);
}
,isc.A._finishChart=function isc_CubeGrid__finishChart(fixedFacetValues,variableFacets,properties,dialogProperties,neededFetch){
    var metricFacetValue=this.getMetricFacetValue(fixedFacetValues),
        chartTitle=this.getChartTitle(metricFacetValue,variableFacets),
        chartSubtitle=this.getChartSubtitle(fixedFacetValues),
        facets=this.map("getFacet",variableFacets);
    for(var i=0;i<facets.length;i++){
        var values=facets[i].values,
            valuesOut=[];
        for(var j=0;j<values.length;j++){
            var value=values[j];
            if(this.chartOmitSums&&(value.isFolder||value.isSum))continue;
            if(value.hidden)continue;
            valuesOut.add(value);
        }
        facets[i]=isc.addProperties({},facets[i],{
            values:valuesOut
        });
    }
    var chart=isc.ClassFactory.getClass(this.chartConstructor,
                                          true).create(isc.addProperties({
        title:chartTitle,
        subTitle:chartSubtitle,
        chartType:this.chartType,
        facets:facets,
        valueTitle:metricFacetValue.title,
        valueProperty:this.valueProperty,
        autoDraw:false,
        data:neededFetch?[]:this.data.findAll(fixedFacetValues)
    },properties));
    if(this.showPlainCharts||!isc.DynamicForm){
        var chartLayout=isc.VLayout.create({
            autoDraw:true,
            left:"10%",top:"10%",
            width:"60%",height:"60%",
            border:"2px solid #333333",
            backgroundColor:"white",
            canDragResize:true,
            canDragReposition:true,
            members:[
                isc.Label.create({
                    autoDraw:false,
                    dragTarget:"parent",
                    contents:"Chart",
                    backgroundColor:"#DDDDDD",
                    padding:3,
                    icon:"[SKIN]actions/remove.png",
                    iconOrientation:"right",
                    iconAlign:"right",
                    align:"left",
                    height:20,
                    width:"100%",
                    iconClick:function(){chartLayout.destroy()}
                }),
                chart
            ]
        })
        return chart;
    }
    if(!dialogProperties)return chart;
    var toolbar=isc.ToolStrip.create({
        autoDraw:false,
        width:"100%",
        align:"right",
        layoutEndMargin:15,
        members:[
            isc.DynamicForm.create({
                autoDraw:false,
                chart:chart,
                numCols:4,wrapItemTitles:false,
                items:[
                   {type:"select",title:"Chart Type",name:"chartType",
                       cubeGrid:this,
                       getValueMap:function(){
                           return this.cubeGrid.getChartTypes();
                       },
                       changed:"form.chart.setChartType(value)"},
                   {type:"checkbox",title:"Stacked",name:"stacked",
                       showIf:"form.chart.facets.length > 1",
                       changed:"form.chart.setStacked(value)"}
                ],
                values:{
                    chartType:chart.chartType,
                    stacked:chart.isStacked()
                }
            })
        ]
    })
    isc.Window.create({
        autoDraw:true,
        title:"Chart",
        left:"10%",top:"10%",
        width:"80%",height:"60%",
        showFooter:false,
        animateMinimize:true,
        canDragReposition:true,
        canDragResize:true,
        items:[chart,toolbar]
    });
    return chart;
}
,isc.A.getChartTypes=function isc_CubeGrid_getChartTypes(){
    return isc[this.chartConstructor].allChartTypes||
           ["Bar","Line","Column","Area","Pie","Doughnut"];
}
,isc.A.showChartDialog=function isc_CubeGrid_showChartDialog(fixedFacetValues,variableFacets,chartProperties,dialogProperties){
    this.makeChart(fixedFacetValues,variableFacets,
                   chartProperties,dialogProperties||{});
}
,isc.A.makeCellContextItems=function isc_CubeGrid_makeCellContextItems(cellRecord,rowNum,colNum){
    var items=[];
    if(this.hilites){
        var hiliteItems=[],
            showHiliteItems=[],
            onSelection=this.selection.cellIsSelected(rowNum,colNum);
        for(var i=0;i<this.hilites.length;i++){
            var hilite=this.hilites[i];
            if(onSelection){
                hiliteItems.add({
                    title:(hilite.title||hilite.id),
                    click:"target.hiliteCellList(target.getSelectedCells(),"+i+")"
                });
            }else{
                hiliteItems.add({
                    title:(hilite.title||hilite.id),
                    click:"target.hiliteCell("+rowNum+","+colNum+","+i+")",
                    checked:cellRecord[this.hiliteProperty]==i
                });
            }
            var enabled=!hilite.disabled;
            showHiliteItems.add({
                title:(hilite.title||hilite.id),
                click:"target.enableHilite("+i+","+!enabled+")",
                checked:enabled
            });
        }
        hiliteItems.addList([
            {isSeparator:true},
            {
                title:"None",
                click:(onSelection?"target.hiliteCellList(target.getSelectedCells())":
                       "target.hiliteCell("+rowNum+","+colNum+")")
            }
        ]);
        showHiliteItems.addList([
            {isSeparator:true},
            {
                title:"Show all",
                click:"target.enableHiliting()"
            },
            {
                title:"Hide all",
                click:"target.enableHiliting(false)"
            }
        ]);
        items.add({
            title:(onSelection?"Highlight Selection":"Highlight Cell"),
            submenu:this.getMenuConstructor().create(this.contextMenuProperties,{data:hiliteItems})
        });
        items.add({
            title:"Show Highlights",
            submenu:this.getMenuConstructor().create(this.contextMenuProperties,{data:showHiliteItems})
        });
    }
    items.add({
        title:"Show Hover Tips",
        click:"target.body.canHover = target.canHover = "+!this.canHover,
        checked:this.canHover
    });
    if(this.enableCharting){
        var submenu=this.getCellChartMenu(rowNum,colNum);
        if(submenu!=null){
            items.add({
                title:"Chart",
                submenu:submenu
            });
        }
    }
    return items;
}
);
isc.evalBoundary;isc.B.push(isc.A.makeFacetValueContextItems=function isc_CubeGrid_makeFacetValueContextItems(facetValues,facetId,header){
    var items=[],
        bar=this.getHeaderBar(facetId),
        isRowHeader=bar.vertical,
        rowNum=this.getEventRow(),
        colNum=this.getEventColumn();
    if(this.canPickFields){
        var facet=this.getFacet(facetId),
            nearbyFacetValues=isc.clone(facetValues),
            subItems=[];
        for(var i=0;i<facet.values.length;i++){
            var facetValue=facet.values[i];
            nearbyFacetValues[facetId]=facetValue.id;
            if(this.hideEmptyFacetValues&&!this.facetValuesArePresent(nearbyFacetValues))continue;
            var isHidden=this.getFieldProperty(nearbyFacetValues,"hidden"),
                item={
                    title:this.getSummaryTitle(facetValue),
                    checked:!isHidden,
                    click:this.getID()+(isHidden?".show":".hide")+"FacetValues("+
                            isc.Comm.serialize(nearbyFacetValues)+")"
                };
            subItems.add(item);
        }
        var checkedItems=subItems.findAll("checked",true);
        if(checkedItems&&checkedItems.length==1)checkedItems[0].enabled=false;
        items.add({
            title:this.fieldVisibilitySubmenuTitle,
            icon:"[SKINIMG]actions/column_preferences.png",
            submenu:subItems
        });
    }
    if(!isRowHeader&&bar.isInnerMost){
        items.addList([
            {title:"AutoFit Column",
              click:"target.autoSizeBodyColumn("+colNum+")"
            },
            (header.minimized?
                  {title:"Maximize Column",
                    click:"target.minimizeColumn("+colNum+", false)"
                  }
             :
                  {title:"Minimize Column",
                    click:"target.minimizeColumn("+colNum+")"
                  }
            )
        ]);
    }
    if(this.canRenameFacetValues){
        items.addList([
            {title:"Rename...",
             click:"target.setFacetValueTitle('"+facetId+"','"+facetValues[facetId]+
                  "',prompt('Enter the new name for this facet value:','"+
                 this.getFacetValue(facetId,facetValues[facetId]).title+"'))"
            }
        ]);
    }
    if(this.hilites&&bar.isInnerMost){
        var hiliteItems=[],
            currentHilite=(isRowHeader?
                             this.innerRowFields[rowNum][this.hiliteProperty]:
                             this.innerColFields[colNum][this.hiliteProperty])
        for(var i=0;i<this.hilites.length;i++){
            var hilite=this.hilites[i];
            hiliteItems.add({
                title:(hilite.title||hilite.id),
                click:"target.hiliteFacetValue("+isc.Comm.serialize(facetId)+","+
                          isc.Comm.serialize(facetValues[facetId])+","+i+")",
                checked:i==currentHilite
            });
        }
        hiliteItems.addList([
            {isSeparator:true},
            {
                title:"None",
                click:"target.hiliteFacetValue("+isc.Comm.serialize(facetId)+","+
                          isc.Comm.serialize(facetValues[facetId])+")"
            }
        ]);
        items.add({
            title:"Highlight",
            submenu:this.getMenuConstructor().create(this.contextMenuProperties,{data:hiliteItems})
        });
    }
    if(this.enableCharting){
        var submenu=this.getFacetValueChartMenu(facetValues,facetId);
        if(submenu!=null){
            items.add({
                title:"Chart",
                submenu:submenu
            });
        }
    }
    return items;
}
,isc.A.makeFacetContextItems=function isc_CubeGrid_makeFacetContextItems(facetId){
    var items=[];
    if(this.getFacetLocation(facetId).isRow){
        items.add({
            title:"AutoFit",
            click:"target.autoSizeFacet('"+facetId+"')"
        });
    }
    if(this.canRenameFacets){
        items.add({
            title:"Rename...",
            click:"target.setFacetTitle('"+facetId+
                 "',prompt('Enter the new name for this facet:','"+this.getFacet(facetId).title+"'))"
        });
    }
    if(this.enableCharting){
        var submenu=this.getFacetChartMenu(facetId);
        if(submenu!=null){
            items.add({
                title:"Chart",
                submenu:submenu
            });
        }
    }
    return items;
}
,isc.A.getFacetPath=function isc_CubeGrid_getFacetPath(header){
    var path=null;
    while(true){
        if(path==null)path=header.facetValueId;
        else path+=header.facetValueId;
        if(header.parent==null)break;
        header=header.parent;
        path+=isc.dot;
    }
    return path;
}
,isc.A.columnFacetResized=function isc_CubeGrid_columnFacetResized(itemNum,newSize){
    var facetId=this.columnFacets[itemNum];
    this.getFacet(facetId).height=newSize;
    var headerBar=this.getHeaderBar(facetId);
    headerBar.setHeight(newSize);
    headerBar.layoutChildren();
    this.layoutChildren();
    this._resized();
}
,isc.A.rowFacetResized=function isc_CubeGrid_rowFacetResized(itemNum,newSize){
    this.rowFacetLabels.resizeItem(itemNum,newSize);
    var rowHeaders=this.rowHeadersVisualOrder||this.rowHeaders,
        rowHeaderBar=rowHeaders[itemNum];
    var facetLabels=this.rowFacetLabels,
        totalWidth=facetLabels.members.map("getVisibleWidth").sum();
    facetLabels.setWidth(totalWidth);
    if(this.rowHeaderGridMode){
        this.headerGrid.setColumnWidth(itemNum,newSize);
        this.headerGrid.setWidth(totalWidth);
        this.headerGrid.redraw();
    }else{
        var headers=rowHeaderBar.members;
        headers.map("setWidth",newSize);
        rowHeaderBar.setWidth(newSize);
        this.adjustRowHeaderBars();
    }
    this.layoutChildren();
    this._resized();
    if(this.autoSizeHeaders){
        this.rowHeights=null;
        this.delayCall("adjustHeaderHeights",[],0);
    }
}
,isc.A.rowFacetBarResized=function isc_CubeGrid_rowFacetBarResized(facetLabel,newHeight){
    this.rowFacetLabels.resizeTo(null,newHeight);
    if(this.haveColumnFacets())this.header.resizeTo(null,newHeight);
    this.layoutChildren();
    this._resized();
}
,isc.A.rowFacetReordered=function isc_CubeGrid_rowFacetReordered(startPos,newPos){
    if(this.rowHeaderGridMode&&!this.rowNesting){
        if(this.rowGridSelection)this.rowGridSelection.deselectAll();
        if(!this.rowFieldsVisualOrder)this.rowFieldsVisualOrder=this.rowFields.duplicate();
        var rowFields=this.rowFieldsVisualOrder;
        rowFields.slide(startPos,newPos);
        this.headerGrid.setColumnWidths(this.getRowFacetWidths());
        if(this.facetReordered)this.facetReordered();
        if(this.facetMoved)this.facetMoved();
        return;
    }
    this.moveFacet(this.rowFacets[startPos],true,newPos);
}
,isc.A.facetDragReordered=function isc_CubeGrid_facetDragReordered(dropBar,endPos){
    var dragBar=isc.EH.dragTarget.parentElement,
        startPos=dragBar.dragStartPosition,
        sourceFacets=(dragBar.vertical?this.columnFacets:this.rowFacets),
        targetFacets=(dropBar.vertical?this.columnFacets:this.rowFacets);
    this.moveFacet(sourceFacets[startPos],targetFacets,endPos);
}
,isc.A.moveFacet=function isc_CubeGrid_moveFacet(facetId,intoRows,index){
    var location=this.getFacetLocation(facetId);
    if(location==null){
        this.logWarn("ignoring attempt to move facet which is not part of current view: "+
                     facetId);
        return;
    }
    var sourceFacets=location.isRow?this.rowFacets:this.columnFacets,
        targetFacets=intoRows?this.rowFacets:this.columnFacets,
        startPos=sourceFacets.indexOf(facetId);
    if(index==targetFacets.length-1&&this.getFacet(targetFacets.last()).inlinedValues){
        index-=1;
    }
    var endPos=index;
    if(sourceFacets.length<=1||
        (sourceFacets==targetFacets&&startPos==endPos))return;
    var movedFacetId=sourceFacets[startPos];
    if(sourceFacets==targetFacets){
        var moveAfter=endPos>startPos;
        sourceFacets.addAt(movedFacetId,(moveAfter?endPos+1:endPos));
        sourceFacets.removeItem(moveAfter?startPos:startPos+1);
    }else{
        sourceFacets.removeItem(startPos);
        targetFacets.addAt(movedFacetId,endPos);
    }
    this.selection.deselectAll();
    this.cellIndex=null;
    this._detectAllFacetValuesPresent();
    if(sourceFacets===targetFacets){
        if(sourceFacets==this.rowFacets)this.setRows(null,null,true);
        else this.setColumns(null,null,true);
    }else{
        this.setColumns(null,null,true);
        this.setRows(null,null,true);
    }
    if(this.autoSizeHeaders)this.adjustHeaderHeights();
    if(this._editSessions&&!isc.isA.emptyObject(this._editSessions)){
        this._remapEditRows();
    }
    if(this.facetReordered)this.facetReordered(movedFacetId);
    if(this.facetMoved)this.facetMoved(movedFacetId);
}
,isc.A.adjustRowHeaderBars=function isc_CubeGrid_adjustRowHeaderBars(){
    var bars=this.rowHeadersVisualOrder||this.rowHeaders;
    var totalWidth=0;
    for(var i=0;i<bars.length;i++){
        var rowHeader=bars[i];
        rowHeader.setLeft(totalWidth);
        totalWidth+=rowHeader.getWidth();
    }
    return totalWidth;
}
,isc.A.addRowFacet=function isc_CubeGrid_addRowFacet(facetId,index){
    return this.addFacet(facetId,true,index);
}
,isc.A.addColumnFacet=function isc_CubeGrid_addColumnFacet(facetId,index){
    return this.addFacet(facetId,false,index);
}
,isc.A.addFacet=function isc_CubeGrid_addFacet(facetId,intoRows,index){
    if(this.getFacet(facetId)==null){
        this.logWarn("ignoring attempt to add facet with no definition: "+facetId);
        return;
    }
    if(intoRows==null)intoRows=true;
    var targetFacets=(intoRows?this.rowFacets:this.columnFacets);
    if(index==null)index=targetFacets.length;
    var location=this.getFacetLocation(facetId);
    if(location!=null){
        if(location.isRow==intoRows){
            if(index>location.level)index-=1;
        }
        return this.moveFacet(facetId,intoRows,index);
    }
    if(this.fixedFacetValues[facetId]==null&&this.dataSource){
        this.logWarn("added facet: "+facetId+" had no fixed facet value: "+
                     "load on demand was probably broken up until now");
    }
    delete this.fixedFacetValues[facetId];
    if(index==targetFacets.length-1&&this.getFacet(targetFacets.last()).inlinedValues){
        index-=1;
    }
    targetFacets.addAt(facetId,index);
    intoRows?this.setRows():this.setColumns();
    if(this.facetAdded)this.facetAdded(facetId);
}
,isc.A.removeFacet=function isc_CubeGrid_removeFacet(facetId,fixedFacetValueId){
    var location=this.getFacetLocation(facetId);
    if(location==null){
        this.logWarn("ignoring attempt to remove facet not present in current view: "+facetId);
        return;
    }
    var sourceFacets=location.isRow?this.rowFacets:this.columnFacets;
    if(sourceFacets.length<=1)return;
    if(fixedFacetValueId==null){
        var facetValue=this.getRollupValue(facetId);
        if(facetValue==null)facetValue=this.getMinimizeValues(facetId)[0];
        fixedFacetValueId=facetValue.id;
        this.logWarn("no fixedFacetValueId specified on removeFacet, using: "+fixedFacetValueId);
    }
    if(this.fixedFacetValues==null)this.fixedFacetValues={};
    this.fixedFacetValues[facetId]=fixedFacetValueId;
    var facets=(location.isRow?this.rowFacets:this.columnFacets);
    facets.remove(facetId);
    if(this._inBreakout!=null&&
        (this._treeChildFacetId==facetId||this._treeParentFacetId==facetId))
    {
        this._inBreakout=false;
        var facet=this.getFacet(this._treeChildFacetId);
        delete facet.combineInTree;
    }
    location.isRow?this.setRows():this.setColumns();
    if(this.facetRemoved)this.facetRemoved(facetId);
}
,isc.A.setFixedFacetValue=function isc_CubeGrid_setFixedFacetValue(facetId,facetValueId){
    if(this.getFacetLocation(facetId)!=null){
        this.removeFacet(facetId,facetValueId);
        if(this.fixedFacetValueChanged!=null)this.fixedFacetValueChanged(facetId,facetValueId);
        return;
    }
    this.fixedFacetValues[facetId]=facetValueId;
    this.cellIndex=null;
    if(this._editSessions&&!isc.isA.emptyObject(this._editSessions)){
        this._remapEditRows();
    }
    this._markBodyForRedraw();
    if(this.fixedFacetValueChanged!=null)this.fixedFacetValueChanged(facetId,facetValueId);
}
,isc.A.addFacetAtField=function isc_CubeGrid_addFacetAtField(facetId,field){
    var newFacet=this.getFacet(facetId);
    if(newFacet==null){
        this.logWarn("addFacetAtField: no such facet: "+facetId);
        return;
    }
    var hostFacetId=this.getContainingFacet(this.getHeaderFacetValues(field)),
        hostFacet=this.getFacet(hostFacetId);
    newFacet.canCollapse=true;
    hostFacet.minimized=true;
    this.setFieldProperty(field,"minimized",false);
    if(field.isRowHeader)newFacet.combineInTree=true;
    this._inBreakout=true;
    this.addFacet(facetId,field.isRowHeader);
}
,isc.A.willAcceptDrop=function isc_CubeGrid_willAcceptDrop(){
    return isc.EH.dragTarget.facetId!=null;
}
,isc.A.dropMove=function isc_CubeGrid_dropMove(){
    var row=this.getEventRow(),
        col=this.getEventColumn();
    if(row>=0&&col>=0){
        this.showHDragLine(this.getPageLeft()+this.bodyOffsetX,
                           this.getPageTop()+this.bodyOffsetY);
    }
}
,isc.A.drop=function isc_CubeGrid_drop(){
    var row=this.getEventRow(),
        col=this.getEventColumn();
    if(row>=0&&col>=0){
        this.addFacet(isc.EH.dragTarget.facetId,
                      false,
                      this.columnFacets.length);
    }
}
,isc.A.buildSumFacets=function isc_CubeGrid_buildSumFacets(){
    this.allSums=[];
    for(var i=0;i<this.facets.length;i++){
        var facet=this.facets[i];
        if(facet.dontSum)continue;
        var valuesList=facet.isTree?facet._valueTree.getChildren(facet._valueTree.getRoot())
                                      :facet.values;
        var valuesToSum=valuesList.getProperty("id");
        var sumFacetValues=this.sumFacetValues(facet.id,"sum",valuesToSum);
        this.allSums.addList(sumFacetValues);
        this.data.addList(sumFacetValues);
    }
}
,isc.A.fillTreeData=function isc_CubeGrid_fillTreeData(){
    var treeFacets=this.facets.findAll("isTree",true);
    this.allSums=[];
    for(var i=0;i<treeFacets.length;i++){
        var facet=treeFacets[i];
        var tree=facet._valueTree;
        this.fillTreeDataForFacetValue(facet.id,facet._valueTree,facet._valueTree.root);
    }
}
,isc.A.fillTreeDataForFacetValue=function isc_CubeGrid_fillTreeDataForFacetValue(facetId,tree,facetValue){
    var childFacetValues=tree.getChildren(facetValue);
    if(childFacetValues==null||childFacetValues.length==0)return null;
    var childSums=[];
    for(var i=0;i<childFacetValues.length;i++){
        var childFacetValue=childFacetValues[i],
            results=this.fillTreeDataForFacetValue(facetId,tree,childFacetValues[i]);
        if(results!=null)childSums.addList(results);
    }
    if(childSums.length==0){
        childSums=this.data;
    }else{
        this.data.addList(childSums);
        this.allSums.addList(childSums);
    }
    if(facetValue==tree.root)return;
    return this.sumFacetValues(facetId,facetValue.id,
                               childFacetValues.getProperty("id"),childSums);
}
,isc.A.sumFacetValues=function isc_CubeGrid_sumFacetValues(sumFacetId,sumFacetValueId,valuesToSum,dataSet){
    if(dataSet==null)dataSet=this.data;
    var otherFacets=this.getAllFacetIds();
    otherFacets.remove(sumFacetId);
    var mostValues=0,indexFacetId=null;
    for(var i=0;i<otherFacets.length;i++){
        var facet=this.getFacet(otherFacets[i]);
        if(facet.values.length>mostValues){
            mostValues=facet.values.length;
            indexFacetId=facet.id;
        }
    }
    var sumCells=[],
        sumsIndex={};
    var valuesToSumMask={},marker="";
    for(var i=0;i<valuesToSum.length;i++){
        valuesToSumMask[valuesToSum[i]]=marker;
    }
    for(var i=0;i<dataSet.length;i++){
        var cellRecord=dataSet[i];
        if(valuesToSumMask[cellRecord[sumFacetId]]==null)continue;
        var indexFacetValue=cellRecord[indexFacetId];
        var partialList=sumsIndex[indexFacetValue];
        if(partialList==null){
            sumsIndex[indexFacetValue]=[];
            partialList=sumsIndex[indexFacetValue];
        }
        var sumCell=this.findMatch(partialList,cellRecord,otherFacets);
        if(sumCell==null){
            sumCell=isc.addProperties({},cellRecord);
            sumCell[sumFacetId]=sumFacetValueId;
            sumCell.value=0;
            sumCells.add(sumCell);
            partialList.add(sumCell);
        }
        sumCell.value+=cellRecord.value;
    }
    return sumCells;
}
,isc.A.findMatch=function isc_CubeGrid_findMatch(data,properties,propertyNames){
    var l=data.length;
    for(var i=0;i<l;i++){
        var item=data[i];
        if(item==null)continue;
        var found=true;
        for(var j=0;j<propertyNames.length;j++){
            var propertyName=propertyNames[j];
            if(item[propertyName]!=properties[propertyName]){
                found=false;
                break;
            }
        }
        if(found)return item;
    }
    return null;
}
,isc.A.pivotFacetValue=function isc_CubeGrid_pivotFacetValue(facetId,facetValueId,parentFacetValues,pivotValues,skipRebuild){
    if(!this.multiCellData){
        this.logWarn("facetValuePivoting is only allowed with multiCellData:true");
        return;
    }
    var facet=this.getFacet(facetId);
    if(!pivotValues){
        var criteria=parentFacetValues,
            facetInlined=(this.inlinedFacet&&this.inlinedFacet.id==facetId);
        if(!facetInlined){
            criteria=isc.addProperties({},criteria);
            criteria[facetId]=facetValueId;
        }
        var cellRecords=this.data.findAll(criteria)||[],
            valueProperty=facetInlined?facetValueId:this.valueProperty;
        pivotValues=cellRecords.getProperty(valueProperty).getUniqueItems();
        this.logInfo("with criteria: "+this.echo(criteria)+", found "+cellRecords.length+
                     " records, under property: '"+valueProperty+
                     "', derived pivotValues: "+pivotValues,"facetValuePivot");
    }
    var pivotInfo={
        pivotFacetValueId:facetValueId,
        pivotValues:pivotValues
    };
    this.setFieldProperty(parentFacetValues,"pivot",pivotInfo);
    this.cellIndex=null;
    this.pivotWithinFacet=facetId;
    if(!skipRebuild){
        this.setFacets();
        this.setRows();
        this.setColumns();
    }
}
,isc.A.getPivotFacetValues=function isc_CubeGrid_getPivotFacetValues(parentField,childFacetId,childFacetValues){
    var facetValues=this.getHeaderFacetValues(parentField),
        pivotInfo=this.getFieldProperty(facetValues,"pivot");
    if(!pivotInfo)return null;
    var pivotValues=pivotInfo.pivotValues,
        pivotFacetValue=this.getFacetValue(childFacetId,pivotInfo.pivotFacetValueId);
    if(this.logIsInfoEnabled("facetValuePivot")){
        this.logInfo("at facetValues: "+this.echo(facetValues)+
                     ", pivot info: "+this.echo(pivotInfo),"facetValuePivot");
    }
    var values=[];
    for(var i=0;i<pivotValues.length;i++){
        var pivotValue=pivotValues[i];
        for(var j=0;j<childFacetValues.length;j++){
            var facetValueId=childFacetValues[j];
            if(facetValueId==pivotInfo.pivotFacetValueId)continue;
            var facetValue=this.getFacetValue(childFacetId,facetValueId);
            values.add({
                facetValueId:facetValueId,
                title:this.getPivotedFacetValueTitle(facetValue,pivotFacetValue,pivotValue),
                pivotValue:pivotValue,
                pivotFacetValueId:pivotInfo.pivotFacetValueId
            })
        }
    }
    return values;
}
,isc.A.getPivotedFacetValueTitle=function isc_CubeGrid_getPivotedFacetValueTitle(facetValue,pivotFacetValue,pivotValue){
    return facetValue.title+" ("+pivotFacetValue.title+":"+pivotValue+")";
}
,isc.A.getClientExportData=function isc_CubeGrid_getClientExportData(exportSettings,callback){
    var rowFields=this.rowFields,
        numRowHeaders=rowFields.length,
        innerRowFields=rowFields[numRowHeaders-1]
    var context={
        exportSettings:exportSettings||{},
        callback:callback,
        chunkSize:this.exportDataChunkSize,
        startRow:0,
        endRow:Math.min(this.exportDataChunkSize,innerRowFields.length),
        totalRows:innerRowFields.length,
        numRowHeaders:numRowHeaders,
        innerRowFields:innerRowFields,
        data:[],
        rowFacetTitles:[],
        columnFacetTitles:[],
        columnHeaderTitles:[],
        outerRowHeader:null,
        newOuterHeader:null,
        rawDataObject:null,
        lastRowHeaderVals:[],
        lastInnerCellValues:{}
    };
    exportSettings.exportRowBGColors={};
    exportSettings.exportColumnBGColors={};
    exportSettings.exportHeaderRowFacetCount=
        this.exportCollapseRowFacets?1:this.rowFacets.length;
    var rowBGColor=this.exportRowFacetBGColor||this.exportFacetBGColor,
        columnBGColor=this.exportColumnFacetBGColor||this.exportFacetBGColor;
    if(rowBGColor||columnBGColor)exportSettings.exportHeaderBGColor=
        rowBGColor==columnBGColor?columnBGColor:[rowBGColor,columnBGColor];
    var rowTextColor=this.exportRowFacetTextColor||this.exportFacetTextColor,
        columnTextColor=this.exportColumnFacetTextColor||this.exportFacetTextColor;
    if(rowTextColor||columnTextColor)exportSettings.exportHeaderTextColor=
        rowTextColor==columnTextColor?columnTextColor:[rowTextColor,columnTextColor];
    var columnFacets=this.columnFacets,
        columnFacetTitles=context.columnFacetTitles;
    for(var i=0;i<columnFacets.length;i++){
        columnFacetTitles[i]=this.getExportHeaderTitle(
            this.getFacet(columnFacets[i]),null,context.exportSettings
        );
        columnFacetTitles[i]=this.htmlUnescapeExportFieldValue(columnFacetTitles[i]);
    }
    if(this.logIsDebugEnabled("cubeGridExport")){
        this.logInfo(isc.echo(context));
        this.logDebug("About to do export. Combine rows:"+
            (exportSettings&&exportSettings.combineRows)+", omitRepeats:"+
            (exportSettings&&exportSettings.omitRepeatingValues)+
            " - iterating through "+innerRowFields.length+
            " total rows. RowFields:"+this.echo(rowFields),"cubeGridExport");
    }
    context.firstTimeStamp=context.thisTimeStamp=isc.timeStamp();
    this.getClientExportDataChunk(context);
    return null;
}
,isc.A.getClientExportDataChunk=function isc_CubeGrid_getClientExportDataChunk(context){
    var exportSettings=context.exportSettings,
        numRowHeaders=context.numRowHeaders,
        innerRowFields=context.innerRowFields,
        data=context.data,
        rowFacetTitles=context.rowFacetTitles,
        columnFacetTitles=context.columnFacetTitles,
        columnHeaderTitles=context.columnHeaderTitles,
        outerRowHeader=context.outerRowHeader,
        newOuterHeader=context.newOuterHeader,
        rawDataObject=context.rawDataObject,
        lastRowHeaderVals=context.lastRowHeaderVals,
        lastInnerCellValues=context.lastInnerCellValues,
        exportRowBGColors=exportSettings.exportRowBGColors,
        exportColumnBGColors=exportSettings.exportColumnBGColors,
        combineRows=context.combineRows
    ;
    var debugExportLogs=this.logIsDebugEnabled("cubeGridExport");
    var rowFacets=this.rowFacets,
        innerColumnFields=this.innerColFields,
        rowFields=this.rowFields;
    var separatorString=exportSettings&&exportSettings.separatorString;
    if(separatorString==null)separatorString=this.exportSeparatorString;
    var omitRepeatingValues=(exportSettings&&exportSettings.omitRepeatingValues);
    var rowFacetTitlesPrefix=this.columnFacets.length<=1?isc._underscore:"";
    var combineRows=exportSettings&&exportSettings.combineRows;
    if(combineRows==null)combineRows=false;
    for(var rowNum=context.startRow;rowNum<context.endRow;rowNum++){
        var record={};
        if(!combineRows){
            data[data.length]=record;
        }
        var field=innerRowFields[rowNum],
            fields=[];
        while(field!=null){
            fields[fields.length]=field;
            field=field.parent;
        }
        if(debugExportLogs){
            this.logDebug("rownum:"+rowNum+" - set of row-fields for this row (inner to outer):"
                +fields.getProperty("title"),"cubeGridExport");
        }
        var canOmitRepeatingRH=omitRepeatingValues;
        if(canOmitRepeatingRH==null)canOmitRepeatingRH=combineRows;
        var omitRepeatingRH=canOmitRepeatingRH;
        var rowHeaderTitlesStyle,
            rowFacetBGColor=this.exportRowFacetBGColor||this.exportFacetBGColor,
            rowFacetTextColor=this.exportRowFacetTextColor||this.exportFacetTextColor;
        if(rowFacetBGColor){
            if(!rowHeaderTitlesStyle)rowHeaderTitlesStyle={};
            rowHeaderTitlesStyle.backgroundColor=rowFacetBGColor;
        }
        if(rowFacetTextColor){
            if(!rowHeaderTitlesStyle)rowHeaderTitlesStyle={};
            rowHeaderTitlesStyle.color=rowFacetTextColor;
        }
        for(var ii=fields.length;ii>0;ii--){
            var fieldNum=numRowHeaders-ii,
                rowField=fields[ii-1];
            if(fieldNum==0){
                if(rowNum==0){
                    outerRowHeader=rowField;
                    newOuterHeader=true;
                    if(combineRows&&fieldNum==0){
                        rawDataObject={};
                        data[data.length]=rawDataObject;
                    }
                }else{
                    newOuterHeader=(outerRowHeader!=rowField);
                    if(newOuterHeader){
                        outerRowHeader=rowField;
                        if(combineRows){
                            rawDataObject={};
                            data[data.length]=rawDataObject;
                        }
                    }
                }
            }
            var facetConfig=rowField.facet;
            if(facetConfig.showInExport==false){
                if(debugExportLogs){
                    this.logDebug("not collecting value for field:"+this.echo(rowField),
                        "cubeGridExport");
                }
                continue;
            }
            var fieldTitle=rowFacetTitles[fieldNum];
            if(fieldTitle==null){
                rowFacetTitles[fieldNum]=this.getExportHeaderTitle(
                        this.getFacet(rowFacets[fieldNum]),
                        null,
                        exportSettings
                );
                fieldTitle=rowFacetTitles[fieldNum]=rowFacetTitlesPrefix+
                    this.htmlUnescapeExportFieldValue(rowFacetTitles[fieldNum]);
            }
            var value=rowField.title||rowField.id;
            if(canOmitRepeatingRH){
                if(debugExportLogs){
                    this.logDebug(
                        "Determining whether can omit value. Parent suppressed omit:"+
                        (!omitRepeatingRH)+
                        ". Current val calculated as:"+value+" - fieldNum:"+fieldNum+
                        " prev set of vals:"+this.echo(lastRowHeaderVals),
                        "cubeGridExportLogs");
                }
                if(newOuterHeader){
                    lastRowHeaderVals[fieldNum]=value;
                }else{
                    if(lastRowHeaderVals[fieldNum]==value){
                        if(omitRepeatingRH){
                            value="";
                        }
                    }else{
                        lastRowHeaderVals[fieldNum]=value;
                        omitRepeatingRH=false;
                    }
                }
            }
            if(combineRows){
                if(newOuterHeader){
                    rawDataObject[fieldTitle]=[value];
                }else{
                    rawDataObject[fieldTitle][rawDataObject[fieldTitle].length]=value;
                }
                if(rowHeaderTitlesStyle){
                    rawDataObject[fieldTitle+"$style"]=rowHeaderTitlesStyle;
                }
            }else{
                record[fieldTitle]=this.htmlUnescapeExportFieldValue(value);
                if(rowHeaderTitlesStyle)record[fieldTitle+"$style"]=rowHeaderTitlesStyle;
            }
        }
        for(var chi=0;chi<innerColumnFields.length;chi++){
            if(columnHeaderTitles[chi]==null){
                columnHeaderTitles[chi]=this.getExportHeaderTitle(
                    innerColumnFields[chi].facet,
                    innerColumnFields[chi],
                    exportSettings
                );
                columnHeaderTitles[chi]=this.htmlUnescapeExportFieldValue(columnHeaderTitles[chi]);
                var columnBGColor=this.getExportColumnBGColor(chi);
                if(columnBGColor){
                    var offset=this.exportCollapseRowFacets?1:this.rowFacets.length;
                    exportColumnBGColors[chi+offset]=columnBGColor;
                }
            }
            var chTitle=columnHeaderTitles[chi],
                shouldOmitRepeating=omitRepeatingValues;
            if(shouldOmitRepeating==null){
                if(innerColumnFields[chi].omitRepeatingValues!=null){
                    shouldOmitRepeating=innerColumnFields[chi].omitRepeatingValues;
                }else{
                    shouldOmitRepeating=(combineRows?true:false);
                }
            }
            var cellRecord=this.getCellRecord(rowNum,chi),
                cellValue=this.getCellValue(cellRecord,rowNum,chi);
            if(shouldOmitRepeating){
                var lastInnerCellValue=lastInnerCellValues[chTitle];
                if(rowNum==0){
                    lastInnerCellValues[chTitle]=cellValue;
                }else{
                    if(lastInnerCellValue!=cellValue)lastInnerCellValues[chTitle]=cellValue;
                    else cellValue="";
                }
            }
            if(combineRows){
                if(newOuterHeader){
                    rawDataObject[chTitle]=[cellValue];
                }else{
                    rawDataObject[chTitle][rawDataObject[chTitle].length]=cellValue;
                }
            }else{
                record[chTitle]=this.htmlUnescapeExportFieldValue(cellValue);
            }
            this.addDetailedExportFieldValue(combineRows?rawDataObject:record,
                columnHeaderTitles[chi],cellRecord,null,null,exportSettings,
                data.length-1,chi,!combineRows&&cellRecord!=null);
        }
        var rowHeaderTitles=this.getExportHeaderTitle(
            innerRowFields[rowNum].facet,
            innerRowFields[rowNum],
            exportSettings
        );
        if(combineRows){
            if(newOuterHeader){
                rawDataObject._rowHeaderTitles=[rowHeaderTitles];
            }else{
                rawDataObject._rowHeaderTitles.push(rowHeaderTitles);
            }
            if(rowNum==innerRowFields.length-1){
                this._combineArrayExportValueToString(rawDataObject,separatorString);
            }
            if(newOuterHeader&&data.length>0){
                this._combineArrayExportValueToString(data[data.length-2],separatorString);
            }
            if(rowHeaderTitlesStyle){
                rawDataObject._rowHeaderTitles$style=rowHeaderTitlesStyle;
            }
        }else{
            record._rowHeaderTitles=this.htmlUnescapeExportFieldValue(rowHeaderTitles);
            if(rowHeaderTitlesStyle)record._rowHeaderTitles$style=rowHeaderTitlesStyle;;
        }
        var rowBGColor=this.getExportRowBGColor(rowNum,record);
        if(rowBGColor){
            exportRowBGColors[data.length-1]=rowBGColor;
        }
    }
    if(context.endRow<context.totalRows){
        context.lastTimeStamp=context.thisTimeStamp;
        context.thisTimeStamp=isc.timeStamp();
        if(this.logIsInfoEnabled("export")){
            this.logInfo("processed "+context.endRow+" rows - starting next chunk - "+
                ((context.thisTimeStamp-context.lastTimeStamp)/1000));
        }
        context.startRow=context.endRow;
        context.endRow=Math.min(context.startRow+context.chunkSize,context.totalRows);
        return this.delayCall("getClientExportDataChunk",[context],0);
    }
    if(this.exportCollapseRowFacets){
        var allFacetsTitle=exportSettings.allFacetsTitle;
        if(allFacetsTitle==null){
            var facetSeparatorString=exportSettings&&exportSettings.facetSeparatorString||
                                                             this.exportFacetSeparatorString;
            allFacetsTitle=columnFacetTitles.join(facetSeparatorString)+
                separatorString+rowFacetTitles.join(facetSeparatorString);
        };
        data._exportTitles={_rowHeaderTitles:this.htmlUnescapeExportFieldValue(allFacetsTitle)};
        data._exportFields=["_rowHeaderTitles"];
    }else{
        data._exportTitles={};
        data._exportFields=rowFacetTitles.map(function(rowFacetTitle){
            if(rowFacetTitlesPrefix.length>0){
                var unmangledTitle=rowFacetTitle.substring(rowFacetTitlesPrefix.length);
                data._exportTitles[rowFacetTitle]=unmangledTitle;
            }
            return rowFacetTitle;
        });
    }
    data._exportFields.addList(columnHeaderTitles);
    if(exportSettings.exportWrapHeaderTitles==null&&this.exportCollapseRowFacets){
        exportSettings.exportWrapHeaderTitles=true;
    }
    if(context.callback){
        var data=context.data;
        if(this.logIsInfoEnabled("export")){
            this.logInfo("finished processing "+context.endRow+
                         " rows - about to export - "+isc.timestamp());
        }
        this.fireCallback(context.callback,"data,context",[data,context.exportSettings]);
    }
}
,isc.A.addDetailedExportFieldValue=function isc_CubeGrid_addDetailedExportFieldValue(exportObject,exportProp,record,exportField,exportFieldIndex,settings,rowIndex,columnIndex,handleFormat){
    var exportDatesAsFormattedString=settings.exportDatesAsFormattedString,
        styleProp=exportProp+"$style";
    var bgColor=this.getExportBGColor(rowIndex,columnIndex,record);
    if(bgColor!=null)exportObject[styleProp]={backgroundColor:bgColor};
    if(!handleFormat)return;
    var dataSource=this.getDataSource(),
        valueProperty=this.getValueProperty(rowIndex,columnIndex);
    var formatProperties={},
        valueDSField=dataSource!=null?dataSource.getField(valueProperty):null;
    var declarativeFormat=this.valueFormat||this.valueExportFormat||
                            this.getDeclarativeFormat(valueDSField);
    if(declarativeFormat){
        formatProperties.rawValue=record[valueProperty];
        formatProperties.format=declarativeFormat;
    }else if(isc.isA.Date(record[valueProperty])&&valueDSField!=null&&
               !exportDatesAsFormattedString)
    {
        formatProperties=this.getDateFormattingProperties(valueDSField,record[valueProperty],
                                                            exportObject[exportProp]);
    }
    if(isc.isA.Number(record[valueProperty])){
        formatProperties.rawValue=record[valueProperty];
    }
    if(isc.isAn.emptyObject(formatProperties))formatProperties=null;
    if(formatProperties){
        if(!exportObject[styleProp])exportObject[styleProp]={};
        isc.addProperties(exportObject[styleProp],formatProperties);
    }
}
,isc.A._combineArrayExportValueToString=function isc_CubeGrid__combineArrayExportValueToString(rowToCorrect,separatorString){
    if(this.logIsDebugEnabled("cubeGridExport")){
        this.logDebug("About to convert array values to strings -- raw record:"+
            isc.echoFull(rowToCorrect),"cubeGridExport");
    }
    for(var exportFieldName in rowToCorrect){
        if(exportFieldName.endsWith("$style"))continue;
        var arrayVal=rowToCorrect[exportFieldName],
            stringVal=arrayVal.join(separatorString);
            rowToCorrect[exportFieldName]=this.htmlUnescapeExportFieldValue(stringVal);
    }
}
,isc.A.getExportHeaderTitle=function isc_CubeGrid_getExportHeaderTitle(facet,facetValueField,exportSettings){
    if(facetValueField==null){
        return facet.title||facet.id;
    }
    var fieldIndex=this.colFields.last().indexOf(facetValueField),
        separator=(exportSettings&&exportSettings.facetSeparatorString)
                    ||this.exportFacetSeparatorString,
        fullTitle;
    while(facetValueField!=null){
        if(facetValueField.facet&&facetValueField.facet.showInExport!=false){
            var title=facetValueField.title;
            if(title==null)title=facetValueField.id;
            if(fullTitle==null)fullTitle=title;
            else fullTitle=title+separator+fullTitle;
        }
        facetValueField=facetValueField.parent;
    }
    return fullTitle;
}
,isc.A._getTopField=function isc_CubeGrid__getTopField(field){
    var currentLevel=field;
    if(currentLevel==null)return;
    while(currentLevel.parent!=null){
        currentLevel=currentLevel.parent;
    }
    return currentLevel;
}
);
isc.evalBoundary;isc.B.push(isc.A._isValidRowForApplyGridData=function isc_CubeGrid__isValidRowForApplyGridData(row){
    return true;
}
,isc.A.dataSourceDataChanged=function isc_CubeGrid_dataSourceDataChanged(dsRequest,dsResponse){
    if(this.disableCacheSync)return;
    var dataSource=this.getDataSource(),
        updateData=dataSource.getUpdatedData(dsRequest,dsResponse,true)||[];
    if(!isc.isAn.Array(updateData))updateData=[updateData];
    if(updateData!=null&&!(isc.isAn.Array(updateData)&&updateData.length==0)){
        if(this.initialCriteria){
            updateData=dataSource.applyFilter(updateData,this.initialCriteria);
        }
        if(this.fixedFacetValues){
            updateData=updateData.findAll(this.fixedFacetValues);
        }
    };
    if(updateData!=null&&!(isc.isAn.Array(updateData)&&updateData.length==0)){
        this.handleUpdate(updateData,dsRequest,dsResponse);
    }
}
,isc.A.handleUpdate=function isc_CubeGrid_handleUpdate(data,dsRequest,dsReponse){
    var operationType=dsRequest.operationType,
        dataSource=this.getDataSource(),
        checkedData=[];
    for(var i=0;i<data.length;i++){
        switch(operationType){
        case"add":
            var cellRecord=this.data.get(dataSource.findByKeys(data[i],this.data));
            if(cellRecord)this.logWarn("dropping add of existing record with ID "+
                                         cellRecord[this.cellIdProperty]);
            else checkedData.add(data[i]);
            break;
        case"remove":
            var cellRecord=this.data.get(dataSource.findByKeys(data[i],this.data));
            if(cellRecord)checkedData.add(cellRecord);
            break;
        case"update":
            checkedData.add(data[i]);
            break;
        }
    }
    if(operationType=="remove")this._addNextBatchRecordsToIndex(checkedData.length);
    for(var i=0;i<checkedData.length;i++){
        this._uploadLocalData(operationType,checkedData[i]);
    }
    switch(operationType){
    case"add":
        this.addRecordsToIndex(checkedData);
        break;
    case"remove":
        this.removeRecordsFromIndex(checkedData);
        break;
    }
    for(var i=0;i<checkedData.length;i++){
        var record=checkedData[i],
            rowNum=record._rowNum,
            colNum=record._colNum;
        if(rowNum==null||colNum==null){
            this.markForRedraw();break;
        }
        this.markCellForRefresh(rowNum,colNum);
    }
}
);
isc.B._maxIndex=isc.C+331;

isc.CubeGrid.registerStringMethods({
    facetValueSelectionChanged:"facetValues,newState",
    facetValueOver:"facetValues",
    facetValueOut:"facetValues",
    facetValueHover:"facetValues",
    facetValueHoverHTML:"facetValues",
    facetLabelHoverHTML:"facetId",
    facetValueContextClick:"facetValues,facetId",
    facetValueReordered:"groupId",
    facetAdded:"facetId",
    facetRemoved:"facetId",
    facetMoved:"facetId",
    facetReordered:"facetId",
    hideFacet:"facetId",
    hideFacetValues:"facetId",
    fixedFacetValueChanged:"facetId,facetValueId",
    sortByFacetValues:"facetValues, sortDirection",
    sortByFacetId:"facetId,sortDirection",
    facetLabelOver:"facetId",
    facetLabelOut:"facetId",
    facetLabelHover:"facetId"
});
isc.ClassFactory.defineClass("HeaderGrid","GridRenderer");
isc.A=isc.HeaderGrid.getPrototype();
isc.A.cellPadding=0;
isc.A.cellHeight=22;
isc.A.isRowHeader=true;
isc.A.isInnerMost=true;
isc.A.vertical=true;
isc.A.showRollOver=true;
isc.A.useCellRollOvers=true;
isc.A.canDrag=true;
isc.A.dragAppearance="none";
isc.A.canDragSelect=true;
isc.A.canSelectCells=true;
isc.A.canAcceptDrop=true;
isc.A.fastCellUpdates=true
;

isc.A=isc.HeaderGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.B.push(isc.A.getCellField=function isc_HeaderGrid_getCellField(rowNum,colNum){
        var rv=this.cubeGrid;
        if(rv.rowAttributeLOD){
            var columnFacetId=this.fields[colNum].facetId;
            return rv._rowAttributeRS.get(rowNum)[columnFacetId];
        }
        if(!rv.rowNesting&&!rv._multiFacetColumn){
            var rowFields=rv.rowFieldsVisualOrder||rv.rowFields;
            return rowFields[colNum][rowNum];
        }
        var innerFields=rv.innerRowFields,
            field=innerFields[rowNum],
            gridField=this.fields[colNum];
        if(rv._multiFacetColumn&&colNum==this.fields.length-1){
            return field;
        }
        var columnFacetId=gridField.facetId;
        while(field.facet.id!=columnFacetId){
            field=field.parent;
        }
        return field;
    }
,isc.A.getWithinFacetIndent=function isc_HeaderGrid_getWithinFacetIndent(field){
        if(!field.facet.isTree)return 0;
        var level=field.facet._valueTree.getLevel(field)-1;
        var rv=this.cubeGrid;
        if(rv._multiFacetColumn&&field.facet.id==rv._treeChildFacetId){
            var rollupValue=rv.getRollupValue(rv._treeChildFacetId);
            if(rollupValue&&rollupValue.parentId==null&&
                rollupValue._withinFacetChildren.length>0)
            {
                level--;
            }
        }
        return level*20;
    }
,isc.A.getCellValue=function isc_HeaderGrid_getCellValue(record,rowNum,colNum){
        var rv=this.cubeGrid,
            crossFacetTree=this.fields[colNum]._crossFacetTree,
            field=this.getCellField(rowNum,colNum);
        if(field==null)return this.emptyCellValue;
        var title=field.title,
            align=this.fields[colNum].align,
            showTurndown=rv.shouldShowTurndown(field);
        var indent=this.getWithinFacetIndent(field);
        if(crossFacetTree&&rv._treeChildFacetId==field.facet.id){
            var crossFacetParent=field.parent;
            indent+=20;
            indent+=this.getWithinFacetIndent(crossFacetParent);
        }
        if(showTurndown){
            title=rv.addTurndown(title,field);
        }else if(crossFacetTree||field.facet.isTree){
            indent+=16;
        }
        if(indent>0){
            title=isc.Canvas.spacerHTML(indent,1)+title;
            return title;
        }
        if(!rv.padTitles||align==isc.Canvas.CENTER)return title;
        if(align==isc.Canvas.RIGHT)return title+"&nbsp;";
        else if(align==isc.Canvas.LEFT)return"&nbsp;"+title;
        return title;
    }
,isc.A.getCellCSSText=function isc_HeaderGrid_getCellCSSText(record,rowNum,colNum){
        var rv=this.cubeGrid,
            field=this.getCellField(rowNum,colNum);
        if(field==null)return null;
        if(rv.flatAttributesOnly()){
            var hilite=rv.getFacet(field.facet)[rv.hiliteProperty];
            if(hilite==null)return null;
            return rv.getHiliteCSSText(hilite);
        }else{
            return field.cssText;
        }
    }
,isc.A.getRowSpan=function isc_HeaderGrid_getRowSpan(record,rowNum,colNum){
        if(!this.cubeGrid.rowNesting)return;
        if(colNum==this.fields.length-1)return 1;
        var field=this.getCellField(rowNum,colNum);
        if(field==null){
            this.logWarn("couldn't find field for: "+[rowNum,colNum]);
            return;
        }
        var fieldSpan=this.cubeGrid.getHeaderSpan(field),
            rowSpan=fieldSpan[1]-fieldSpan[0]+1;
        return rowSpan-(rowNum-fieldSpan[0]);
    }
,isc.A.getRowHeight=function isc_HeaderGrid_getRowHeight(record,rowNum){
        var cube=this.cubeGrid;
        if(!cube.multiRowHeaders)return this.Super("getRowHeight",arguments);
        var field=this.getCellField(rowNum,this.fields.length-1);
        if(!field)return this.Super("getRowHeight",arguments);
        return field.groupCount*cube.cellHeight;
    }
,isc.A.drop=function isc_HeaderGrid_drop(){
        if(!this.cubeGrid.canBreakout)return;
        var rowNum=this.getEventRow(),
            colNum=this.getEventColumn();
        var field=this.getCellField(rowNum,colNum);
        this.cubeGrid.addFacetAtField(isc.EH.dragTarget.facetId,field);
    }
,isc.A.redraw=function isc_HeaderGrid_redraw(){
        this.Super("redraw",arguments);
        var cg=this.cubeGrid;
        if(cg.autoSizeHeaders){
            cg.rowHeights=this._getDrawnRowHeights();
        }
    }
,isc.A.markForRedraw=function isc_HeaderGrid_markForRedraw(reason){
        var returnValue=this.Super("markForRedraw",arguments);
        if(reason=="scrollRedraw"){
            var cube=this.cubeGrid;
            cube.body.markForRedraw("headerGrid redrawing");
        }
        return returnValue;
    }
,isc.A.getDrawArea=function isc_HeaderGrid_getDrawArea(){
        var drawRect=this.Super("getDrawArea",arguments);
        var cube=this.cubeGrid;
        if(!cube.multiRowHeaders)return drawRect;
        var fields=cube.innerRowFields,
            startField=0,
            endField,
            bodyRowCount=0,
            firstVisible=Math.floor(this.getScrollTop()/cube.body.getAvgRowHeight()),
            lastVisible=firstVisible+Math.ceil(this.getViewportHeight()/this.cellHeight),
            bodyOffscreenRows=0;
        for(var i=0;i<fields.length;i++){
            var field=fields[i];
            if((bodyRowCount+field.groupCount)>=firstVisible&&startField==null){
                startField=i;
                bodyOffscreenRows=bodyRowCount;
            }
            bodyRowCount+=field.groupCount;
            if(bodyRowCount>lastVisible){
                endField=i+1;
                break;
            }
        }
        if(endField==null)endField=fields.length-1;
        if(startField>0){
            var normalSpacer=cube.body.getAvgRowHeight()*startField,
                neededSpace=bodyOffscreenRows*this.getAvgRowHeight();
            this.startSpace=neededSpace-normalSpacer;
        }else{
            this.startSpace=0;
        }
        this.endSpace=cube.groupedTotalRows*cube.body.getAvgRowHeight();
        drawRect[0]=startField;
        drawRect[1]=endField;
        return drawRect;
    }
,isc.A.cellOver=function isc_HeaderGrid_cellOver(record,rowNum,colNum){
        var rv=this.cubeGrid,
            field=this.getCellField(rowNum,colNum);
        return rv._facetValueOver(rv.getHeaderFacetValues(field));
    }
,isc.A.cellOut=function isc_HeaderGrid_cellOut(record,rowNum,colNum){
        var rv=this.cubeGrid,
            field=this.getCellField(rowNum,colNum);
        if(rv.facetValueOut)rv.facetValueOut(rv.getHeaderFacetValues(field));
    }
,isc.A.cellContextClick=function isc_HeaderGrid_cellContextClick(record,rowNum,colNum){
        var rv=this.cubeGrid,
            field=this.getCellField(rowNum,colNum);
        return rv._facetValueContextClick(field);
    }
);
isc.B._maxIndex=isc.C+13;

isc.ClassFactory.defineClass("ReportHeaderBar","Toolbar");
isc.A=isc.ReportHeaderBar;
isc.A.buttonProperties={
        getActionType:function(){return isc.Button.BUTTON;},
        mouseDown:function(){
            var returnValue=this.parentElement.itemMouseDown();
            this.Super("mouseDown",arguments);
            return returnValue;
        },
        mouseUp:function(){
            this.parentElement.itemMouseUp();
            return this.Super("mouseUp",arguments);
        },
        mouseOver:function(){
            this.Super("mouseOver",arguments);
            var rv=this.cubeGrid;
            return rv._facetValueOver(rv.getHeaderFacetValues(this));
        },
        mouseOut:function(){
            this.Super("mouseOut",arguments);
            var rv=this.cubeGrid;
            if(rv.facetValueOut)rv.facetValueOut(rv.getHeaderFacetValues(this));
        },
        keyPress:function(){
            var keyName=isc.EventHandler.lastEvent.keyName;
            if(keyName=="Space"||keyName=="Enter"){
                this.parentElement.startSelecting(this);
            }
        },
        showContextMenu:function(){
            var rv=this.cubeGrid;
            return rv._facetValueContextClick(this);
        },
        doubleClick:function(){
            this.cubeGrid.facetValueDoubleClick(
                this.cubeGrid.getHeaderFacetValues(this));
        }
    }
;

isc.A=isc.ReportHeaderBar.getPrototype();
isc.A.canDragSelectItems=true;
isc.A.tabWithinToolbar=false;
isc.A.buttonDefaults={
        showFocused:false
    }
;

isc.A=isc.ReportHeaderBar.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.mouseMove=isc.EventHandler.stopBubbling;
isc.A.mouseOver=isc.EventHandler.stopBubbling;
isc.B.push(isc.A.initWidget=function isc_ReportHeaderBar_initWidget(){
    this.Super(this._$initWidget,arguments);
    if(this.buttonProperties==null)this.buttonProperties={};
    isc.addProperties(this.buttonProperties,isc.ReportHeaderBar.buttonProperties);
}
,isc.A.mouseOut=function isc_ReportHeaderBar_mouseOut(){
    if(this.cubeGrid.canHover)isc.Hover.clear();
    return isc.EventHandler.STOP_BUBBLING;
}
,isc.A.setButtons=function isc_ReportHeaderBar_setButtons(){
    if(this.cubeGrid.suppressInnerHeaders&&!this.vertical&&this.isInnerMost){
        this.addMember(isc.LayoutSpacer.create({
            width:this.cubeGrid.innerColFields.getProperty("width").sum()
        }));
        return;
    }
    if(this.baseConstructor==null){
        var className=this.ID+"ButtonClass";
        this.baseConstructor=isc.ClassFactory.defineClass(className,this.buttonConstructor);
        window[className]=null;
        window.isc[className]=null;
        this.baseConstructor.addProperties(this.buttonDefaults,this.buttonProperties);
    }
    this.Super("setButtons",arguments);
    this.createSelection();
}
,isc.A._makeItem=function isc_ReportHeaderBar__makeItem(buttonProperties,rect){
    return this.baseConstructor.create(
                {autoDraw:false},
                buttonProperties,
                rect
        );
}
,isc.A.dragReorderMove=function isc_ReportHeaderBar_dragReorderMove(){
    var startPosition=this.dragStartPosition,
        dropPosition=this.getDropPosition();
    this.dragCurrentPosition=dropPosition;
    var extents=this.cubeGrid.getMoveGroupExtents(this.buttons,startPosition);
    var members=this.members.duplicate();
    dropPosition+=extents[0]-startPosition;
    members.slideRange(extents[0],extents[1]+1,dropPosition);
    this.stackMembers(members,null,false);
    return isc.EH.STOP_BUBBLING;
}
,isc.A.getDropPosition=function isc_ReportHeaderBar_getDropPosition(){
    var startPosition=this.dragStartPosition,
        targetPosition=this.Super("getDropPosition",arguments),
        header=this.buttons[startPosition];
    if(startPosition==null||header.parent==null)return targetPosition;
    if(header.moveGroup==null){
        return this.cubeGrid.nearestPositionWithinParent(this.buttons,startPosition,
                                                             targetPosition);
    }
    var safeDelta=this.cubeGrid.getMoveGroupDelta(this.buttons,startPosition,
                                                        targetPosition);
    return startPosition+safeDelta;
}
,isc.A.createSelection=function isc_ReportHeaderBar_createSelection(){
    var rv=this.cubeGrid;
    var selection={
        data:this.members,
        simpleDeselect:(rv?rv.simpleDeselect:false),
        dragSelection:true
    };
    if(rv.rowHeaderGridMode&&!this.isFacetBar&&this.vertical){
        if(!rv.rowGridSelection){
            selection=isc.CellSelection.create(selection);
            selection.numCols=rv.rowFacets.length;
            rv.rowGridSelection=selection;
        }
        this.selection=rv.rowGridSelection;
        if(!this.isObserving(this.selection,"selectionChanged")){
            this.observe(this.selection,"selectionChanged",
                         "observer.cellSelectionChanged(observed.changedCells)");
        }
    }else{
        this.selection=isc.Selection.create(selection);
        this.observe(this.selection,"setSelected","observer.itemSelected()");
    }
}
,isc.A.hitReorderHandle=function isc_ReportHeaderBar_hitReorderHandle(){
    var target=isc.EH.lastEvent.nativeTarget;
    while(target!=null){
        if(target.getAttribute){
            var ID=target.getAttribute("ID");
            if(ID&&ID.endsWith("reorderHandle"))return true;
        }
        target=target.parentNode;
    }
    return false;
}
,isc.A.rightMouseDown=function isc_ReportHeaderBar_rightMouseDown(){
    return this.itemMouseDown();
}
,isc.A.itemMouseDown=function isc_ReportHeaderBar_itemMouseDown(){
    var EH=isc.EventHandler,
        target=EH.getTarget();
    if(!this.hitReorderHandle()&&EH.dragOperation!="dragResize"&&
        EH.dragOperation!="dragResizeMember")
    {
        if(this.isFacetBar&&this.cubeGrid.canMoveFacets){
            isc.EH.dragOperation="dragPivot";
            return isc.EH.stopBubbling;
        }else if(this.canDragSelectItems){
            return this.startSelecting(target);
        }
    }
    return EH.STOP_BUBBLING;
}
,isc.A.startSelecting=function isc_ReportHeaderBar_startSelecting(target){
    if(!this.cubeGrid.canSelectHeaders)return false;
    isc.EH.dragOperation="dragSelect";
    var buttonNum=this.getButtonNumber(target);
    if(buttonNum<0)buttonNum=this.getFocusButtonIndex();
    this.selection.selectOnMouseDown(this,buttonNum,this.getEventColumn());
    this.selection.lastSelectionItem=this.getButton(buttonNum);
    return isc.EH.stopBubbling;
}
,isc.A.itemMouseUp=function isc_ReportHeaderBar_itemMouseUp(){
    this.selection.selectOnMouseUp(this,this.getMouseOverButtonIndex(),this.getEventColumn());
}
,isc.A.dragSelectStart=function isc_ReportHeaderBar_dragSelectStart(){
    this.dragStartPosition=this.getButtonNumber(isc.EH.dragTarget);
    return isc.EH.STOP_BUBBLING;
}
,isc.A.dragSelectMove=function isc_ReportHeaderBar_dragSelectMove(){
    if(!this.canDragSelectItems)return isc.EH.STOP_BUBBLING;
    var rv=this.cubeGrid,
        lastHeader=this.selection.lastSelectionItem,
        currentHeaderNum=this.getMouseOverButtonIndex();
    if(this.isFacetBar){
        this.selection.selectOnDragMove(this,currentHeaderNum);
        return isc.EventHandler.STOP_BUBBLING;
    }
    var currentHeader;
    if(currentHeaderNum>=0)currentHeader=this.getButton(currentHeaderNum);
    else{
        currentHeader=(currentHeaderNum==-1?this.members.first():this.members.last());
    }
    var lastHeaderSpan=this.cubeGrid.getHeaderSpan(lastHeader),
        currentHeaderSpan=this.cubeGrid.getHeaderSpan(currentHeader);
    var lastPosition,currentPosition;
    if(lastHeaderSpan[0]<currentHeaderSpan[0]){
        lastPosition=lastHeaderSpan[1];
        currentPosition=currentHeaderSpan[1];
    }else{
        lastPosition=lastHeaderSpan[0];
        currentPosition=currentHeaderSpan[0];
    }
    var stopPosition=rv.findSelectionBoundary(lastPosition,currentPosition,
                                                this.selectionBoundaries),
        stopHeaders=rv.getHeadersForIndex(stopPosition,currentHeader.isRowHeader),
        stopHeader=stopHeaders[currentHeader.headerLevel],
        stopPosition=this.getButtonNumber(stopHeader);
    this.selection.selectOnDragMove(this,stopPosition,this.getEventColumn());
    return isc.EventHandler.STOP_BUBBLING;
}
,isc.A.getEventColumn=function isc_ReportHeaderBar_getEventColumn(){
    if((this.isFacetBar&&this.vertical)||(!this.isFacetBar&&!this.vertical))return-1;
    var rv=this.cubeGrid,
        offset=rv.getOffsetX(),
        bars=rv.rowHeadersVisualOrder||rv.rowHeaders,
        widths=bars.map("getVisibleWidth"),
        column=this.inWhichPosition(widths,offset);
    if(column==-1)return 0;
    else if(column==-2)return bars.length;
    return column;
}
,isc.A.itemSelected=function isc_ReportHeaderBar_itemSelected(){
    if(this.isFacetBar&&this.vertical)return;
    this.updateButtonStyle();
    this.selectionChanged();
}
,isc.A.selectionChanged=function isc_ReportHeaderBar_selectionChanged(){}
,isc.A.cellSelectionChanged=function isc_ReportHeaderBar_cellSelectionChanged(cellList){
    var column=this.cubeGrid.getFacetLocation(this.facetId).level,
        thisHeaderChanged=false;
    for(var i=0;i<cellList.length;i++){
        var cell=cellList[i];
        if(cell[1]!=column)continue;
        thisHeaderChanged=true;
        var button=this.getButton(cell[0]),
            state=this.selection.cellIsSelected(cell[0],cell[1]);
        this.updateButtonStyle(button,state);
    }
    if(thisHeaderChanged)this.selectionChanged();
}
,isc.A.updateButtonStyle=function isc_ReportHeaderBar_updateButtonStyle(button,state){
    button=button||this.selection.lastSelectionItem;
    var buttonNumber=this.getButtonNumber(button);
    if(button==null)return;
    if(state==null)state=this.selection.isSelected(button);
    button.setSelected(state);
    button.redrawIfDirty("header selection change");
}
,isc.A.getSelection=function isc_ReportHeaderBar_getSelection(){
    return this.selection.getSelection();
}
,isc.A.willAcceptDrop=function isc_ReportHeaderBar_willAcceptDrop(){
    if(!this.isFacetBar&&!this.vertical&&this.isInnerMost){
        return isc.EH.dragTarget.facetId!=null;
    }
    return this.Super("willAcceptDrop",arguments);
}
,isc.A.dropOver=function isc_ReportHeaderBar_dropOver(){return false;}
,isc.A.dropMove=function isc_ReportHeaderBar_dropMove(){
    if(!this.isFacetBar&&!this.vertical&&this.isInnerMost){
        var rv=this.cubeGrid;
        rv.showHDragLine(rv.getPageLeft()+rv.bodyOffsetX,this.getPageTop());
        return isc.EH.STOP_BUBBLING;
    }
    return this.Super("dropMove",arguments);
}
,isc.A.drop=function isc_ReportHeaderBar_drop(){
    if(!this.isFacetBar&&!this.vertical&&this.isInnerMost){
        var rv=this.cubeGrid;
        rv.addFacet(isc.EH.dragTarget.facetId,false,rv.columnFacets.length-1);
        return isc.EH.STOP_BUBBLING;
    }
    return this.Super("drop",arguments);
}
);
isc.B._maxIndex=isc.C+24;

isc.ClassFactory.defineClass("InnerHeader","Button");
isc.A=isc.InnerHeader.getPrototype();
isc.A.controlSize=13;
isc.A.reorderHandleWidth=7;
isc.A.closed=false;
isc.A.redrawOnResize=true;
isc.A.showFocused=false;
isc.A.canDrag=true;
isc.A.dragAppearance=isc.EventHandler.NONE
;

isc.A=isc.InnerHeader.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.useEventParts=false;
isc.B.push(isc.A.initWidget=function isc_InnerHeader_initWidget(){
        var obfuscation_local_identifier;
        var rv=this.cubeGrid;
        if(!rv.imgURLs){
            var imgURLs=rv.imgURLs={
                reorderHandle:"[SKIN]header_handle.gif",
                minimize:"[SKIN]minimize.gif",
                maximize:"[SKIN]maximize.gif",
                sortDown:"[SKIN]sort_down.gif",
                sortDownSelected:"[SKIN]sort_down_selected.gif",
                sortUp:"[SKIN]sort_up.gif",
                sortUpSelected:"[SKIN]sort_up_selected.gif",
                closeBox:"[SKIN]close.gif"
            }
            rv.imgTags={};
            for(var imgName in rv.imgURLs){
                var controlName=(imgName.endsWith("Selected")?
                                   imgName.substring(0,imgName.length-8):
                                   imgName),
                    altText=rv.controlLabels[controlName];
                rv.imgTags[imgName]=this.imgHTML(imgURLs[imgName],null,null,null,
                                                   " ALT='"+altText+"'"+
                                                   " TITLE='"+altText+"'");
            }
        }
        this.columnRef=this.facetId?this.facetId:this;
        this.isSorted=rv._columnIsSorted(this.columnRef);
        this.isSortedUp=this.isSorted&&rv.sortDirection==Array.ASCENDING;
        this.isSortedDown=this.isSorted&&rv.sortDirection==Array.DESCENDING;
        this.innerWidth=this.getWidth()-isc.Element._getHBorderPad(this.getStateName());
    }
,isc.A.getInnerHTML=function isc_InnerHeader_getInnerHTML(){
        var output=isc.StringBuffer.create(),
            rv=this.cubeGrid,
            styleName=this.getStateName();
        output.append("<TABLE CELLSPACING=0 CELLPADDING=0 BORDER=0 STYLE='table-layout:fixed;",
                      (this.cssText?this.cssText:""),"'",
                      " WIDTH=",this.getWidth(),
                      " HEIGHT=",this.getHeight(),
                      " CLASS='",styleName,
                      "' ID=",this.getID(),"table><TR>");
        var cellHTML=[
            "<TD ID="+this.getID(),
            null,
            " eventPart=",
            null,
            " WIDTH=",
            null,
            " HEIGHT="+this.controlSize,
            " class=",
            styleName,
            this._$tableNoStyleDoubling,
            "'>",
            null,
            "</TD>"
            ];
        if(this.minimized){
            cellHTML[1]=cellHTML[3]="maximize";
            cellHTML[5]=this.controlSize;
            cellHTML[11]=rv.imgTags.maximize;
            output.append(cellHTML);
        }else{
            if(this.showReorderHandle){
                cellHTML[1]=cellHTML[3]="reorderHandle";
                cellHTML[5]=this.reorderHandleWidth;
                cellHTML[11]=rv.imgTags.reorderHandle;
                output.append(cellHTML);
            }
            if(this.showMinimize){
                cellHTML[1]=cellHTML[3]="minimize";
                cellHTML[5]=this.controlSize;
                cellHTML[11]=rv.imgTags.minimize;
                output.append(cellHTML);
            }
            cellHTML[1]=cellHTML[3]="gap";
            cellHTML[5]="*";
            cellHTML[11]="&nbsp;";
            output.append(cellHTML);
            cellHTML[5]=this.controlSize;
            if(this.showSortButtons){
                cellHTML[1]=cellHTML[3]="sortDown";
                cellHTML[11]=this.isSortedDown?rv.imgTags.sortDownSelected:rv.imgTags.sortDown;
                output.append(cellHTML);
                cellHTML[1]=cellHTML[3]="sortUp";
                cellHTML[11]=this.isSortedUp?rv.imgTags.sortUpSelected:rv.imgTags.sortUp;
                output.append(cellHTML);
            }
            if(this.showCloseBox){
                cellHTML[1]=cellHTML[3]="closeBox";
                cellHTML[11]=rv.imgTags.closeBox;
                output.append(cellHTML);
            }
        }
        var numCols=1+
            (this.showReorderHandle?1:0)+
            (this.showMinimize?1:0)+
            (this.showSortButtons?2:0)+
            (this.showCloseBox?1:0);
        output.append("</TR><TR><TD COLSPAN=",numCols,
                                  " ALIGN=",this.align,
                                  " VALIGN=",this.valign,
                                  " HEIGHT=",this.getHeight()-this.controlSize,
                                  " class=",styleName,
                                  this._$tableNoStyleDoubling,
                      (this.wrap==false?"'><NOBR>":"'>"),
            this.getTitleHTML(),"</TD></TR></TABLE>");
        return output.release(false);
    }
,isc.A.getPreferredWidth=function isc_InnerHeader_getPreferredWidth(){
        var sizer=isc.Canvas.create({
            contents:"<NOBR>"+this.getTitle()+"</NOBR>",
            className:this.getStateName(),
            width:1
        });
        var width=sizer.getScrollWidth()+(isc.Browser.isIE?2:0);
        sizer.destroy();
        return width;
    }
,isc.A.stateChanged=function isc_InnerHeader_stateChanged(){
        var table=isc.Element.get(this.getID()+"table");
        if(!table)return;
        table.className=this.getStateName();
    }
,isc.A.mouseMove=function isc_InnerHeader_mouseMove(){
        var part=this.inWhichPart();
        if(part!=this.lastPart){
            if(this.lastPart!=null)this.partMouseOut(this.lastPart);
            this.lastPart=part;
            this.partMouseOver(part);
        }
    }
,isc.A.mouseOut=function isc_InnerHeader_mouseOut(){
        if(isc.Browser.isUnix&&isc.Browser.isMoz&&
                this.containsEvent(isc.EventHandler.lastEvent)){
            return false;
        }
        if(this.lastPart){
            var result=this.partMouseOut(this.lastPart);
            if(result!=null)return result;
        }
        return this.Super("mouseOut");
    }
,isc.A.partMouseOver=function isc_InnerHeader_partMouseOver(part){
        this.setPartState(part,"over");
        var event=part+"MouseOver";
        if(this[event])return this[event]();
    }
,isc.A.partMouseOut=function isc_InnerHeader_partMouseOut(part){
        this.setPartState(part,"");
        var event=part+"MouseOut";
        this.lastPart=null;
        if(this[event])return this[event]();
    }
,isc.A.mouseDown=function isc_InnerHeader_mouseDown(){
        if(this.lastPart)return this.partMouseDown(this.lastPart);
        return this.Super("mouseDown",arguments);
    }
,isc.A.partMouseDown=function isc_InnerHeader_partMouseDown(part){
        var event=part+"MouseDown";
        if(this[event])return this[event]();
        this.setPartState(part,"");
        return isc.EH.STOP_BUBBLING;
    }
,isc.A.mouseUp=function isc_InnerHeader_mouseUp(){
        if(this.lastPart)return this.partMouseUp(this.lastPart);
        return this.Super("mouseUp",arguments);
    }
,isc.A.partMouseUp=function isc_InnerHeader_partMouseUp(part){
        this.setPartState(part,"over");
        return isc.EH.STOP_BUBBLING;
    }
,isc.A.click=function isc_InnerHeader_click(){
        if(this.lastPart){
            var event=this.lastPart+"Click";
            if(this[event])return this[event]();
        }
        return this.Super("click");
    }
,isc.A.getEventPart=function isc_InnerHeader_getEventPart(){
        var target=isc.EH.lastEvent.nativeTarget,
            handle=this.getHandle(),
            attrName="eventPart";
        if(isc.Browser.isIE){
            while(target!=null){
                if(target.eventPart)return target.eventPart;
                if(target==handle)return null;
                target=target.parentElement;
            }
        }
        while(target!=null){
            if(target.eventPart!=null||
                (target.hasAttribute!=null&&
                 target.hasAttribute(attrName)))return target.getAttribute(attrName);
            if(target==handle)return null;
            target=target.parentNode;
        }
    }
,isc.A.inWhichPart=function isc_InnerHeader_inWhichPart(){
        var eventPart=this.getEventPart();
        if(eventPart==null)return"title";
        return eventPart;
    }
,isc.A.setPartState=function isc_InnerHeader_setPartState(part,state){
        if(part=="title"||part=="gap")return;
        if(this.isSortedUp&&part=="sortUp")part+="_selected";
        if(this.isSortedDown&&part=="sortDown")part+="_selected";
        var url=this.cubeGrid.imgURLs[part];
        var cell=isc.Element.get(this.getID()+part);
        if(cell==null)return;
        var img=cell.firstChild;
        isc.Canvas._setImageURL(img,this.getImgURL(isc.Img.urlForState(url,false,false,state)));
    }
,isc.A.minimizeClick=function isc_InnerHeader_minimizeClick(){
        this.cubeGrid.minimizeClick(this);
        return false;
    }
,isc.A.maximizeClick=function isc_InnerHeader_maximizeClick(){
        this.cubeGrid.minimizeClick(this,false);
        return false;
    }
,isc.A.sortDownClick=function isc_InnerHeader_sortDownClick(){
        this.cubeGrid._sortButtonClick(this.columnRef,Array.DESCENDING);
        return false;
    }
,isc.A.sortUpClick=function isc_InnerHeader_sortUpClick(){
        this.cubeGrid._sortButtonClick(this.columnRef,Array.ASCENDING);
        return false;
    }
,isc.A.closeBoxClick=function isc_InnerHeader_closeBoxClick(){
        this.closed=!this.closed;
        this.cubeGrid._headerCloseClick(this.columnRef,this.closed);
        return false;
    }
,isc.A.getEventEdge=function isc_InnerHeader_getEventEdge(){
        var edge=this.Super("getEventEdge",arguments);
        if(edge==null)return null;
        if(this.showReorderHandle&&edge.contains("L")&&this.getOffsetY()<this.controlSize){
            return null;
        }
        return edge;
    }
);
isc.B._maxIndex=isc.C+22;

isc.A=isc.CubeGrid.getPrototype();
isc.B=isc._allFuncs;
isc.C=isc.B._maxIndex;
isc.D=isc._funcClasses;
isc.D[isc.C]=isc.A.Class;
isc.A.ariaRole="grid";
isc.A.rowRole=null;
isc.A.cellRole="gridCell";
isc.B.push(isc.A.getCellAriaState=function isc_CubeGrid_getCellAriaState(rowNum,colNum){
        var record=this.getCellRecord(rowNum,colNum);
        if(this.selection&&this.selection.cellIsSelected(rowNum,colNum)){
            return{selected:true};
        }
    }
);
isc.B._maxIndex=isc.C+1;

isc._debugModules = (isc._debugModules != null ? isc._debugModules : []);isc._debugModules.push('Analytics');isc.checkForDebugAndNonDebugModules();isc._moduleEnd=isc._Analytics_end=(isc.timestamp?isc.timestamp():new Date().getTime());if(isc.Log&&isc.Log.logIsInfoEnabled('loadTime'))isc.Log.logInfo('Analytics module init time: ' + (isc._moduleEnd-isc._moduleStart) + 'ms','loadTime');delete isc.definingFramework;if (isc.Page) isc.Page.handleEvent(null, "moduleLoaded", { moduleName: 'Analytics', loadTime: (isc._moduleEnd-isc._moduleStart)});}else{if(window.isc && isc.Log && isc.Log.logWarn)isc.Log.logWarn("Duplicate load of module 'Analytics'.");}/** AnalyticsModule End **/

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

