import {IInputs, IOutputs} from "./generated/ManifestTypes";
import * as React from "react";
import * as ReactDOM from "react-dom";
import App, { AppProps } from "./src/App";

import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;

export class TSMapComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {

  private _contextObj: ComponentFramework.Context<IInputs>;
  
  // reference to the container div
  private _theContainer: HTMLDivElement;

  private _props: AppProps = {
  }

  /**
   * Empty constructor.
   */
  constructor()
  {

  }

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
   */
  public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
  {
    // Add control initialization code
    this._theContainer = container;
  }


  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   */
  public updateView(context: ComponentFramework.Context<IInputs>): void
  {
    this._contextObj = context;

    if (!context.parameters.dataSetGrid.loading) {

      // Get sorted columns on View
      let columnsOnView = this.getSortedColumnsOnView(context);

      if ((!columnsOnView) ||(columnsOnView.length === 0)) {
        return;
      }
    }
    // Render the React component into the div container
    ReactDOM.render(
      // Create the React component
      React.createElement(App, this._props),
      this._theContainer
    );
  }

  /** 
   * It is called by the framework prior to a control receiving new data. 
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs
  {
    return {};
  }

  /** 
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void
  {
    // Add code to cleanup control if necessary
    ReactDOM.unmountComponentAtNode(this._theContainer);
  }

  /**
   * Get sorted columns on view
   * @param context 
   * @return sorted columns object on View
   */
  private getSortedColumnsOnView(context: ComponentFramework.Context<IInputs>): DataSetInterfaces.Column[] {
    if (!context.parameters.dataSetGrid.columns) {
      return [];
    }

    let columns = context.parameters.dataSetGrid.columns
      .filter(function (columnItem: DataSetInterfaces.Column) {
        // some column are supplementary and their order is not > 0
        return columnItem.order >= 0
      }
      );

    // Sort those columns so that they will be rendered in order
    columns.sort(function (a: DataSetInterfaces.Column, b: DataSetInterfaces.Column) {
      return a.order - b.order;
    });

    return columns;
  }
}