import { useAtom } from "jotai";
import React from "react";
import { drawablesAtom, parametersAtom, partsAtom } from "./store/live2d";
import Filter from "./Filter";
import { handleDrawableCheckboxChange, handleFilterInput } from "./js/events";
import { currentModel } from "./js/live2d-loader";

const Live2dSetting: React.FC = ({}) => {
  const [parts] = useAtom(partsAtom);
  const [drawables] = useAtom(drawablesAtom);
  const [parameters] = useAtom(parametersAtom);

  return (
    <>
      <Filter onChange={handleFilterInput} />
      {/* TODO: Tab UI */}
      <div id="setting">
        <div id="parameter">
          {parameters.map(({ id, max, min, value }, index) => (
            // FIXME state
            <div className="item" key={id}>
              <label title={id}>{id}</label>
              <input
                type="range"
                max={max}
                min={min}
                step={(max - min) / 100}
                defaultValue={value}
                onChange={(e) => {
                  const parameterValues =
                    currentModel.internalModel.coreModel._parameterValues;
                  parameterValues[index] = e.target.value;
                }}
              />
            </div>
          ))}
        </div>
        <div id="part">
          {parts.map(([name, index]) => {
            // FIXME state
            return (
              <div className="item" key={name + index}>
                <label title={name}>
                  {name}
                  <input
                    type="checkbox"
                    data-old-index={index}
                    defaultChecked
                    onChange={(e) => {
                      currentModel.internalModel.coreModel.setPartOpacityById(
                        e.target.previousSibling!.textContent,
                        +e.target.checked,
                      );
                    }}
                  />
                </label>
              </div>
            );
          })}
        </div>
        <div id="drawable">
          {drawables.map(([name, index]) => {
            // FIXME state
            // @ts-ignore
            return (
              <div className="item" key={name + index}>
                <label title={name}>
                  {name}
                  <input
                    type="checkbox"
                    data-old-index={index}
                    defaultChecked
                    onChange={handleDrawableCheckboxChange}
                  />
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Live2dSetting;
