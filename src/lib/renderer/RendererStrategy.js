/**
 * @typedef {Object} PropertyItem
 * @property {string} name
 * @property {number} index
 * @property {'checkbox'|'range'} type
 * @property {boolean} [checked]
 * @property {number} [value]
 * @property {number} [min]
 * @property {number} [max]
 * @property {number} [step]
 */

/**
 * @typedef {Object} AnimationItem
 * @property {string} name - display name
 * @property {string} value - internal value
 */

/**
 * @typedef {Object} RendererStrategy
 * @property {(dirName: string, fileNames: string[]) => Promise<void>} load
 * @property {() => void} dispose
 * @property {(width: number, height: number) => void} resize
 * @property {() => {width: number, height: number}} getOriginalSize
 * @property {(scale: number, moveX: number, moveY: number, rotate: number) => void} applyTransform
 * @property {(width?: number, height?: number) => void} resetTransform
 * @property {(width: number, height: number, options?: Object) => HTMLCanvasElement|null} captureFrame
 * @property {() => AnimationItem[]} getAnimations
 * @property {(value: string) => void} setAnimation
 * @property {() => AnimationItem[]|null} getExpressions
 * @property {(value: string) => void} setExpression
 * @property {() => string[]} getPropertyCategories
 * @property {(category: string) => PropertyItem[]} getPropertyItems
 * @property {(category: string, name: string, index: number, value: any) => void} updatePropertyItem
 * @property {() => number} getAnimationDuration
 * @property {(progress: number) => void} seekAnimation
 * @property {(speed: number) => void} setSpeed
 * @property {() => number} getCurrentTime
 * @property {() => number} getFPS
 * @property {(paused: boolean) => void} setPaused
 * @property {() => void} render
 * @property {(alphaMode: string) => Promise<void>} setAlphaMode
 * @property {() => HTMLCanvasElement} getCanvas
 */
