/*
 *  Copyright 2017 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { Widget } from '@phosphor/widgets';
import { BeakerXDataGrid } from './BeakerXDataGrid';
import { silverStripeStyle } from './style/dataGridStyle';
import IDataGridScopeOptions from "./interface/IDataGridScopeOptions";
import DataGridContextMenu from "./contextMenu/DataGridContextMenu";
import ColumnLimitModal from "./modal/ColumnLimitModal";
import createStore, {BeakerXDataStore} from "./store/BeakerXDataStore";
import {selectModel} from "./model/selectors";
import {DataGridHelpers} from "./dataGridHelpers";
import {RendererMap} from "@phosphor/datagrid";

export class DataGridScope {
  contextMenu: DataGridContextMenu;

  readonly dataGrid: BeakerXDataGrid;
  readonly element: HTMLElement;
  readonly store: BeakerXDataStore;
  private tableDisplayModel: any;
  private tableDisplayView: any;

  constructor(options: IDataGridScopeOptions) {
    this.store = createStore(options.data);
    this.element = options.element;
    this.tableDisplayModel = options.widgetModel;
    this.tableDisplayView = options.widgetView;
    this.dataGrid = new BeakerXDataGrid(
      {
        style: silverStripeStyle,
        cellRenderers: new RendererMap({ priority: ['body|{dataType: html}','body|'] })
      },
      this.store
    );
    this.element.id = `wrap_${this.tableDisplayModel.model_id}`;

    this.dataGrid.setWrapperId(this.element.id);
    this.connectToCommSignal();
    this.createContextMenu();
    this.initColumnLimitModal();
  }

  get state() {
    return selectModel(this.store.state);
  }

  render(): void {
    Widget.attach(this.dataGrid, this.element);
  }

  doDestroy() {
    this.dataGrid.destroy();
    this.contextMenu.destroy();
  }

  updateModelData(newData) {
    this.dataGrid.updateModelData(newData);
  }

  doResetAll() {
    this.dataGrid.highlighterManager.removeHighlighters();
    this.dataGrid.cellSelectionManager.clear();
    this.dataGrid.rowManager.resetSorting();
    this.dataGrid.columnManager.resetFilters();
    this.dataGrid.columnManager.showAllColumns();
    this.dataGrid.columnManager.resetColumnsAlignment();
    this.dataGrid.columnManager.resetColumnPositions();
  }

  connectToCommSignal() {
    this.dataGrid.commSignal.connect((handler, args) => {
      this.tableDisplayModel.send(args, this.tableDisplayView.callbacks());
    }, this);
  }

  createContextMenu() {
    this.contextMenu = new DataGridContextMenu(this);
  }

  initColumnLimitModal() {
    return new ColumnLimitModal(this.dataGrid, this.element);
  }
}
