/*
* File:        jquery.dataTables.editable.js
* Version:     1.0.0
* Author:      Jovan Popovic 
* 
* Copyright 2010-2011 Jovan Popovic, all rights reserved.
*
* This source file is free software, under either the GPL v2 license or a
* BSD style license, as supplied with this software.
* 
* This source file is distributed in the hope that it will be useful, but 
* WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
* or FITNESS FOR A PARTICULAR PURPOSE. 
* 
* Parameters:
* @sUpdateURL                   String      URL of the server-side page used for updating cell. Default value is "UpdateData".
* @sAddURL                      String      URL of the server-side page used for adding new row. Default value is "AddData".
* @sDeleteURL                   String      URL of the server-side page used to delete row by id. Default value is "DeleteData".
* @fnShowError                  Function    function(message, action){...}  used to show error message. Action value can be "update", "add" or "delete".
* @sAddNewRowFormId             String      Id of the form for adding new row. Default id is "formAddNewRow".
* @sAddNewRowButtonId           String      Id of the button for adding new row. Default id is "btnAddNewRow".
* @sAddNewRowOkButtonId         String      Id of the OK button placed in add new row dialog. Default value is "btnAddNewRowOk".
* @sAddNewRowCancelButtonId     String      Id of the OK button placed in add new row dialog. Default value is "btnAddNewRowCancel".
* @sDeleteRowButtonId           String      Id of the button for adding new row. Default id is "btnDeleteRow".
* @sSelectedRowClass            String      Class that will be associated to the selected row. Default class is "row_selected".
* @sReadOnlyCellClass           String      Class of the cells that should not be editable. Default value is "read_only".
* @sAddDeleteToolbarSelector    String      Selector used to identify place where add and delete buttons should be placed. Default value is ".add_delete_toolbar".
* @fnStartProcessingMode        Function    function(){...} called when AJAX call is started. Use this function to add "Please wait..." message  when some button is pressed.
* @fnEndProcessingMode          Function    function(){...} called when AJAX call is ended. Use this function to close "Please wait..." message.
* @onSuccess                    Function    function(){ ...} called when AJAX call is ended.
* @sLoadUrl                     String      URL of the server-side page used for load content. Default value is LoadUrl
* @aoColumns                    Array       Array of the JEditable settings that will be applied on the columns
*/
(function ($) {
    $.fn.makeEditable = function (options) {
        ///Utility function used to determine id of the cell
        //By default it is assumed that id is placed as an id attribute of <tr> that that surround the cell (<td> tag). E.g.:
        //<tr id="17">
        //  <td>...</td><td>...</td><td>...</td><td>...</td>
        //</tr>
        function fnGetCellID(cell) {
            return options.fnGetRowID($(cell.parentNode));
        }

        ///Utility function used to set id of the new row
        //It is assumed that id is placed as an id attribute of <tr> that that surround the cell (<td> tag). E.g.:
        //<tr id="17">
        //  <td>...</td><td>...</td><td>...</td><td>...</td>
        //</tr>
        function _fnSetRowIDInAttribute(row, id) {
            row.attr("id", id);
        }

        //Utility function used to get id of the row
        //It is assumed that id is placed as an id attribute of <tr> that that surround the cell (<td> tag). E.g.:
        //<tr id="17">
        //  <td>...</td><td>...</td><td>...</td><td>...</td>
        //</tr>
        function _fnGetRowIDFromAttribute(row) {
            return row.attr("id");
        }

        //Utility function used to set id of the new row
        //It is assumed that id is placed as an id attribute of <tr> that that surround the cell (<td> tag). E.g.:
        //<tr>
        //  <td>17</td><td>...</td><td>...</td><td>...</td>
        //</tr>
        function _fnSetRowIDInFirstCell(row, id) {
            $("td:first", row).html(id);
        }

        //Utility function used to get id of the row
        //It is assumed that id is placed as an id attribute of <tr> that that surround the cell (<td> tag). E.g.:
        //<tr>
        //  <td>17</td><td>...</td><td>...</td><td>...</td>
        //</tr>
        function _fnGetRowIDFromFirstCell(row) {
            return $("td:first", row).html();
        }

        //Reference to the DataTable object
        var oTable;
        //Refences to the buttons used for manipulating table data
        var oAddNewRowButton, oDeleteRowButton, oConfirmRowAddingButton, oCancelRowAddingButton;
        //Reference to the form used for adding new data
        var oAddNewRowForm;

        //Plugin options
        var properties;

        /// Utility function that shows an error message
        ///@param errorText - text that should be shown
        ///@param action - action that was executed when error occured e.g. "update", "delete", or "add"
        function _fnShowError(errorText, action) {
            alert(errorText);
        }

        //Utility function that put the table into the "Processing" state
        function _fnStartProcessingMode() {
            if (oTable.fnSettings().oFeatures.bProcessing) {
                $(".dataTables_processing").css('visibility', 'visible');
                //$(".dataTables_processing").show();
            }
        }

        //Utility function that put the table in the normal state
        function _fnEndProcessingMode() {
            if (oTable.fnSettings().oFeatures.bProcessing) {
                $(".dataTables_processing").css('visibility', 'hidden');
                //$(".dataTables_processing").hide();
            }
        }

        function _onSuccess() {
            alert('Process completed');
        }

        var sOldValue, sNewCellValue;
        //Utility function used to apply editable plugin on table cells
        function fnApplyEditable(aoNodes) {
            var oDefaultEditableSettings = {
                event: 'dblclick',
                "callback": function (sValue, settings) {
                    options.onSuccess();
                    if (sNewCellValue == sValue) {
                        var aPos = oTable.fnGetPosition(this);
                        oTable.fnUpdate(sValue, aPos[0], aPos[2]);
                    } else {
                        var aPos = oTable.fnGetPosition(this);
                        oTable.fnUpdate(sOldValue, aPos[0], aPos[2]);
                        options.fnShowError(sValue, "update");
                    }

                },
                "submitdata": function (value, settings) {
                    options.fnStartProcessingMode();
                    sOldValue = value;
                    sNewCellValue = $("input,select", $(this)).val();
                    var id = fnGetCellID(this);
                    var rowId = oTable.fnGetPosition(this)[0];
                    var columnPosition = oTable.fnGetPosition(this)[1];
                    var columnId = oTable.fnGetPosition(this)[2];
                    var sColumnName = oTable.fnSettings().aoColumns[columnId].sName;
                    if (sColumnName == null || sColumnName == "")
                        sColumnName = oTable.fnSettings().aoColumns[columnId].sTitle;
                    return {
                        "id": id,
                        "rowId": rowId,
                        "columnPosition": columnPosition,
                        "columnId": columnId,
                        "columnName": sColumnName
                    };
                },
                "onerror": function (e) {
                    //options.fnEndProcessingMode();
                    options.fnShowError(`(500 - Internal Server Error)`, "update");
                },
                "height": options.height,
                onComplete: options.fnEndProcessingMode()
            };

            var cells = null;
            if (options.aoColumns != null) {
                for (var i = 0; i < options.aoColumns.length; i++) {
                    if (options.aoColumns[i] != null) {
                        cells = $("td:nth-child(" + (i + 1) + ")", aoNodes);
                        var oColumnSettings = oDefaultEditableSettings;
                        oColumnSettings = $.extend({}, options.aoColumns[i], oDefaultEditableSettings);
                        cells.editable(options.sUpdateURL, oColumnSettings);
                    }


                }
            } else {
                cells = $('td:not(.' + options.sReadOnlyCellClass + ')', aoNodes);
                cells.editable(options.sUpdateURL, oDefaultEditableSettings);

                cells = $('td[data-select="select"]', aoNodes);

                if (cells.length > 0) {

                    var oEditableSettings = {
                        event: 'dblclick',
                        "callback": function (sValue, settings) {
                            options.onSuccess();
                            if (sNewCellValue == sValue) {
                                var aPos = oTable.fnGetPosition(this);
                                oTable.fnUpdate(sValue, aPos[0], aPos[2]);
                            } else {
                                var aPos = oTable.fnGetPosition(this);
                                oTable.fnUpdate(sOldValue, aPos[0], aPos[2]);
                                options.fnShowError(sValue, "update");
                            }

                        },
                        "submitdata": function (value, settings) {
                            options.fnStartProcessingMode();
                            sOldValue = value;
                            sNewCellValue = $("input,select", $(this)).val();
                            var id = fnGetCellID(this);
                            var rowId = oTable.fnGetPosition(this)[0];
                            var columnPosition = oTable.fnGetPosition(this)[1];
                            var columnId = oTable.fnGetPosition(this)[2];
                            var sColumnName = oTable.fnSettings().aoColumns[columnId].sName;
                            if (sColumnName == null || sColumnName == "")
                                sColumnName = oTable.fnSettings().aoColumns[columnId].sTitle;
                            return {
                                "id": id,
                                "rowId": rowId,
                                "columnPosition": columnPosition,
                                "columnId": columnId,
                                "columnName": sColumnName
                            };
                        },
                        "onerror": function () {
                            //options.fnEndProcessingMode();
                            options.fnShowError(`(500 - Internal Server Error)`, "update");
                        },
                        "height": options.height,
                        type: 'select',
                        loadurl: options.sLoadUrl,
                        loadurlpersonalizadaparametros: options.sLoadUrlPersonalizadaParametros,
                        submit: '<button id="btnAddParametro" class="btn btn-success"><i class="fa fa-check"></i></button>',
                        cssclass: 'form-control'
                    };

                    //oDefaultEditableSettings.type = 'select';
                    //oDefaultEditableSettings.submit = '<button type="submit" class="checkbookButton">OK</button>';
                    //oDefaultEditableSettings.tooltip = 'Clique para editar...';
                    cells.editable("destroy");
                    cells.editable(options.sUpdateURL, oEditableSettings);
                }

                for (var i = 0; i < $('td', aoNodes[0]).length; i++) {
                    cells = $(`td[data-mask${i}]`, aoNodes);

                    if (cells.length > 0) {
                        var mask = cells[0].attributes[0].nodeValue;

                        var oEditableSettingsMask = {
                            event: 'dblclick',
                            "callback": function (sValue, settings) {
                                options.onSuccess();
                                if (sNewCellValue == sValue) {
                                    var aPos = oTable.fnGetPosition(this);
                                    oTable.fnUpdate(sValue, aPos[0], aPos[2]);
                                } else {
                                    var aPos = oTable.fnGetPosition(this);
                                    oTable.fnUpdate(sOldValue, aPos[0], aPos[2]);
                                    options.fnShowError(sValue, "update");
                                }

                            },
                            "submitdata": function (value, settings) {
                                options.fnStartProcessingMode();
                                sOldValue = value;
                                sNewCellValue = $("input,select", $(this)).val();
                                var id = fnGetCellID(this);
                                var rowId = oTable.fnGetPosition(this)[0];
                                var columnPosition = oTable.fnGetPosition(this)[1];
                                var columnId = oTable.fnGetPosition(this)[2];
                                var sColumnName = oTable.fnSettings().aoColumns[columnId].sName;
                                if (sColumnName == null || sColumnName == "")
                                    sColumnName = oTable.fnSettings().aoColumns[columnId].sTitle;
                                return {
                                    "id": id,
                                    "rowId": rowId,
                                    "columnPosition": columnPosition,
                                    "columnId": columnId,
                                    "columnName": sColumnName
                                };
                            },
                            "onerror": function () {
                                //options.fnEndProcessingMode();
                                options.fnShowError(`(500 - Internal Server Error)`, "update");
                            },
                            attribute: `data-mask=${mask}`
                        };

                        //oDefaultEditableSettings.type = 'select';
                        //oDefaultEditableSettings.submit = '<button type="submit" class="checkbookButton">OK</button>';
                        //oDefaultEditableSettings.tooltip = 'Clique para editar...';
                        cells.editable("destroy");
                        cells.editable(options.sUpdateURL, oEditableSettingsMask);
                    }
                }
            }
        }

        //Called when user confirm that he want to add new record
        function fnOnRowAdding(event) {
            if (oAddNewRowForm.valid()) {
                options.fnStartProcessingMode();
                var params = oAddNewRowForm.serialize();
                $.ajax({
                    'url': options.sAddURL,
                    'data': params,
                    'type': 'POST',
                    success: fnOnRowAdded,
                    error: function (response) {
                        //options.fnEndProcessingMode();
                        options.fnShowError(response.responseText, "add");
                    }
                });
            }
            event.stopPropagation();
            event.preventDefault();
        }

        ///Event handler called when a new row is added and response is returned from server
        function fnOnRowAdded(data) {
           
            options.onSuccess();

            var iColumnCount = 0;

            $.each(oTable.dataTableSettings, function (i, v) {
                if (v.sTableId.trim() === options.sAddNewRowFormId.substring(6).trim()) {
                    iColumnCount = v.aoColumns.length;
                    return false;
                }
            });

            //oTable.dataTableSettings[0].aoColumns.length;
            var values = new Array();

            $("input:text[rel],input:radio[rel][checked],select[rel],textarea[rel]", oAddNewRowForm).each(function () {
                var rel = $(this).attr("rel");
                if (rel > iColumnCount)
                    options.fnShowError("In the add form is placed input element with the name '" + $(this).attr("name") + "' with the 'rel' attribute that must be less than a column count - " + iColumnCount, "add");
                else
                    values[rel] = this.value;
            });

            values[0] = data;

            //Add values from the form into the table
            var rtn = oTable.fnAddData(values);
            var oTRAdded = oTable.fnGetNodes(rtn);
            //Apply editable plugin on the cells of the table
            fnApplyEditable(oTRAdded);
            //add id returned by server page as an TR id attribute
            options.fnSetRowID($(oTRAdded), data);
            //Close the dialog
            $(`#modal${options.sAddNewRowFormId}`).modal('hide');
            $(oAddNewRowForm)[0].reset();
        }

        //Called when user cancels ading new record in popup
        function fnOnCancelRowAdd(event) {
            //Close the dialog
            oAddNewRowForm.dialog('close');
            $(oAddNewRowForm)[0].reset();
            $(".error", $(oAddNewRowForm)).html("");
            event.stopPropagation();
            event.preventDefault();
        }

        //Called before row is deleted
        //Returning false will abort delete
        function fnOnRowDeleting(tr, id) {
            return true;
        }

        //Called when user deletes a row
        function fnOnRowDelete(event) {

            if ($('tr.' + options.sSelectedRowClass + ' td', oTable).length == 0) {
                oDeleteRowButton.attr("disabled", "true");
                return;
            }

            swal({
                title: "Tem certeza?",
                text: "O registro será deletado permanentemente!",
                type: "warning",
                buttons: true,
                dangerMode: true,
                showCancelButton: true,
                confirmButtonColor: '#dd6b55',
                cancelButtonColor: '#999',
                confirmButtonText: 'Sim!',
                cancelButtonText: 'Não',
            }, function () {
                var id = fnGetCellID($('tr.' + options.sSelectedRowClass + ' td', oTable)[0]);
                if (fnOnRowDeleting($('tr.' + options.sSelectedRowClass, oTable), id)) {
                    options.fnStartProcessingMode();
                    $.ajax({
                        'url': options.sDeleteURL,
                        'data': 'id=' + id,
                        "success": fnOnRowDeleted,
                        "error": function (response) {
                            //options.fnEndProcessingMode();
                            options.fnShowError(response.responseText, "delete");
                        }
                    });
                }
            });
        }

        //Called when record is deleted on the server
        function fnOnRowDeleted(response) {
            options.onSuccess();
            var oTRSelected = $('tr.' + options.sSelectedRowClass, oTable)[0];
            if (response == "ok" || response == "") {
                oTable.fnDeleteRow(oTRSelected);
                oDeleteRowButton.attr("disabled", "true");
            }
            else {
                options.fnShowError(response, "delete");
            }
        }

        oTable = this;

        //var defaults = {
        //    fnGetRowID: _fnGetRowIDFromAttribute,
        //    fnSetRowID: _fnSetRowIDInFirstCell,
        //    sUpdateURL: "UpdateData",
        //    sAddURL: "AddData",
        //    sDeleteURL: "DeleteData",
        //    height: "14px",
        //    sAddNewRowFormId: "formAddNewRow",
        //    sAddNewRowButtonId: "btnAddNewRow",
        //    sAddNewRowOkButtonId: "btnAddNewRowOk",
        //    sAddNewRowCancelButtonId: "btnAddNewRowCancel",
        //    sDeleteRowButtonId: "btnDeleteRow",
        //    sSelectedRowClass: "row_selected",
        //    sReadOnlyCellClass: "read_only",
        //    sAddDeleteToolbarSelector: ".add_delete_toolbar", 
        //    fnShowError: _fnShowError,
        //    fnStartProcessingMode: _fnStartProcessingMode,
        //    fnEndProcessingMode: _fnEndProcessingMode,
        //    aoColumns: null
        //};

        $.fn.makeEditable.defaultOptions = {
            fnGetRowID: _fnGetRowIDFromAttribute,
            fnSetRowID: _fnSetRowIDInFirstCell,
            sUpdateURL: "UpdateData",
            sAddURL: "AddData",
            sDeleteURL: "DeleteData",
            sLoadUrl: "LoadUrl",
            sLoadUrlPersonalizadaParametros: "LoadUrlPersonalizadaParametros",
            height: "14px",
            sAddNewRowFormId: "formAddNewRow",
            sAddNewRowButtonId: "btnAddNewRow",
            sAddNewRowOkButtonId: "btnAddNewRowOk",
            sAddNewRowCancelButtonId: "btnAddNewRowCancel",
            sDeleteRowButtonId: "btnDeleteRow",
            sSelectedRowClass: "row_selected",
            sReadOnlyCellClass: "read_only",
            sAddDeleteToolbarSelector: ".add_delete_toolbar",
            fnShowError: _fnShowError,
            fnStartProcessingMode: _fnStartProcessingMode,
            fnEndProcessingMode: _fnEndProcessingMode,
            aoColumns: null,
            onSuccess: _onSuccess
        };

        options = $.extend({}, $.fn.makeEditable.defaultOptions, options);

        return this.each(function () {

            if (oTable.fnSettings().oFeatures.bServerSide) {
                oTable.fnSettings().aoDrawCallback.push({
                    "fn": function () {
                        //Apply jEditable plugin on the table cells
                        fnApplyEditable(oTable.fnGetNodes());
                        $(oTable.fnGetNodes()).each(function () {
                            var position = oTable.fnGetPosition(this);
                            var id = oTable.fnGetData(position)[0];
                            options.fnSetRowID($(this), id);
                        }
                        );
                    },
                    "sName": "fnApplyEditable"
                });

            } else {
                //Apply jEditable plugin on the table cells
                fnApplyEditable(oTable.fnGetNodes());
            }

            //Setup form to open in dialog
            oAddNewRowForm = $("#" + options.sAddNewRowFormId);
            oAddNewRowForm.attr('style', 'display:block;');
            if (oAddNewRowForm.length != 0) {
                var idModal = `modal${options.sAddNewRowFormId}`;

                if ($(`#${idModal}`).length == 0) {
                    var $div = $('<div/>').appendTo('body'),
                        $dvDocumento = $('<div/>'),
                        $dvModalContent = $('<div/>'),
                        $dvHeader = $('<div/>'),
                        $dvConteudo = $('<div/>');

                    var html = `<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
                                 <i class="fa fa-plus-circle modal-icon"></i>
                                 <h4 class="modal-title">Adicionar novo registro</h4>
                                 <small>Realizar inserção de novo registro no sistema</small>`;

                    $dvHeader.attr({ class: 'modal-header' });
                    $dvHeader.html(html);

                    $div.attr({ id: idModal, class: 'modal inmodal', tabindex: '-1', role: 'dialog', 'aria-hidden': true, style: "display: none;" });

                    $dvDocumento.attr({ class: 'modal-dialog', id: `modalDialog${options.sAddNewRowFormId}` });
                    $dvDocumento.appendTo(`#${idModal}`);
                    $dvModalContent.attr({ class: 'modal-content animated pulse', id: `dvConteudo${options.sAddNewRowFormId}` });


                    $dvModalContent.appendTo(`#modalDialog${options.sAddNewRowFormId}`);

                    $dvConteudo.attr({ id: `modalAdd${options.sAddNewRowFormId}` });
                    $dvHeader.appendTo(`#dvConteudo${options.sAddNewRowFormId}`);
                    $dvConteudo.appendTo(`#dvConteudo${options.sAddNewRowFormId}`)
                    oAddNewRowForm.appendTo(`#modalAdd${options.sAddNewRowFormId}`);
                }

                //oAddNewRowForm.dialog({ autoOpen: false });

                //Add button click handler on the "Add new row" button
                oAddNewRowButton = $("#" + options.sAddNewRowButtonId);
                if (oAddNewRowButton.length != 0) {
                    oAddNewRowButton.click(function () {
                        //Util.Mensagem.show('teste', 'teste', Util.Mensagem.TipoMensagem.Sucesso);
                        $(`#modal${options.sAddNewRowFormId}`).modal('show');
                        //oAddNewRowForm.dialog('open');
                    });
                } else {
                    if ($(options.sAddDeleteToolbarSelector).length == 0)
                        throw "Cannot find button for adding new row althogh form for adding new record is specified";
                    else
                        oAddNewRowButton = null;
                }

                oConfirmRowAddingButton = $("#" + options.sAddNewRowOkButtonId);
                if (oConfirmRowAddingButton.length == 0) {
                    oAddNewRowForm.append("<button id='" + options.sAddNewRowOkButtonId + "'>Ok</button>");
                    oConfirmRowAddingButton = $("#" + options.sAddNewRowOkButtonId);
                }

                //Add button click handler on the "Ok" button in the add new row dialog
                oConfirmRowAddingButton.click(fnOnRowAdding);

                oCancelRowAddingButton = $("#" + options.sAddNewRowCancelButtonId);
                if (oCancelRowAddingButton.length == 0) {
                    //oCancelRowAddingButton = oAddNewRowForm.append("<button id='" + properties.sAddNewRowCancelButtonId + "'>Cancel</button>");
                    //oCancelRowAddingButton = $("#" + properties.sAddNewRowCancelButtonId);
                }

                oCancelRowAddingButton.click(fnOnCancelRowAdd);
            } else {
                oAddNewRowForm = null;
            }

            //Set the click handler on the "Delete selected row" button
            oDeleteRowButton = $('#' + options.sDeleteRowButtonId);
            if (oDeleteRowButton.length != 0)
                oDeleteRowButton.click(fnOnRowDelete);
            else {
                oDeleteRowButton = null;
            }

            //If an add and delete buttons does not exists but Add-delete toolbar is specificed
            //Autogenerate these buttons
            oAddDeleteToolbar = $(options.sAddDeleteToolbarSelector);
            if (oAddDeleteToolbar.length != 0) {
                if (oAddNewRowButton == null && options.sAddNewRowButtonId != ""
                    && oAddNewRowForm != null) {
                    oAddDeleteToolbar.append("<button id='" + options.sAddNewRowButtonId + "' class='add_row'>Add</button>");
                    oAddNewRowButton = $("#" + options.sAddNewRowButtonId);
                    oAddNewRowButton.click(function () { oAddNewRowForm.dialog('open'); });
                }
                if (oDeleteRowButton == null && options.sDeleteRowButtonId != "") {
                    oAddDeleteToolbar.append("<button id='" + options.sDeleteRowButtonId + "' class='delete_row'>Delete</button>");
                    oDeleteRowButton = $("#" + options.sDeleteRowButtonId);
                    oDeleteRowButton.click(fnOnRowDelete);
                }
            }

            //If delete button exists disable it until some row is selected
            if (oDeleteRowButton != null)
                oDeleteRowButton.attr("disabled", "true");

            //Set selected class on row that is clicked
            $("tbody", oTable).click(function (event) {
                if ($(event.target.parentNode).hasClass(options.sSelectedRowClass)) {
                    $(event.target.parentNode).removeClass(options.sSelectedRowClass);
                    if (oDeleteRowButton != null)
                        oDeleteRowButton.attr("disabled", "true");
                } else {
                    $(oTable.fnSettings().aoData).each(function () {
                        $(this.nTr).removeClass(options.sSelectedRowClass);
                    });
                    $(event.target.parentNode).addClass(options.sSelectedRowClass);
                    if (oDeleteRowButton != null)
                        oDeleteRowButton.removeAttr("disabled");
                }
            });

        });
    };
})(jQuery);