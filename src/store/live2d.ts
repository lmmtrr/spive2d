import { atom } from "jotai";
import { currentModel } from "../js/live2d-loader";
import { setOpacities } from "../js/events";
import { sortById, sortByName } from "../utils/sort";
import { jotaiStore } from "./store";

export const drawablesAtom = atom<any[]>([]);
export const partsAtom = atom<any[]>([]);
export const parametersAtom = atom<any[]>([]);

export function createDrawables() {
  const coreModel = currentModel.internalModel.coreModel;
  if (!coreModel?._drawableIds) return;
  const opacities = new Float32Array(coreModel._drawableIds.length);
  opacities.set(coreModel._model.drawables.opacities);
  setOpacities(opacities);

  jotaiStore.set(
    drawablesAtom,
    (coreModel._drawableIds as any[])
      .map((value, index) => [value, index])
      // FIXME: unify filters
      .filter(([, index]) => Math.round(opacities[index]) > 0)
      .sort(sortByName),
  );
}

export function createParts() {
  const partIds: any[] = currentModel.internalModel.coreModel?._partIds;
  jotaiStore.set(
    partsAtom,
    partIds.map((value, index) => [value, index]),
  );
}

export function createParameters() {
  const coreModel = currentModel.internalModel.coreModel;
  if (!coreModel._parameterIds) return;
  const parametersData = (coreModel._parameterIds as any[])
    .map((id, index) => ({
      id,
      index,
      max: coreModel._parameterMaximumValues[index],
      min: coreModel._parameterMinimumValues[index],
      value: coreModel._parameterValues[index],
    }))
    .sort(sortById);

  jotaiStore.set(parametersAtom, parametersData);
}
