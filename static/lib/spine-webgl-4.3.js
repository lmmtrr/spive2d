"use strict";
var spine = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // spine-webgl/src/index.ts
  var index_exports = {};
  __export(index_exports, {
    ATTACH_RETAIN: () => ATTACH_RETAIN,
    ATTACH_SETUP: () => ATTACH_SETUP,
    AlphaTimeline: () => AlphaTimeline,
    Animation: () => Animation,
    AnimationState: () => AnimationState,
    AnimationStateAdapter: () => AnimationStateAdapter,
    AnimationStateData: () => AnimationStateData,
    AssetCache: () => AssetCache,
    AssetManager: () => AssetManager,
    AssetManagerBase: () => AssetManagerBase,
    AtlasAttachmentLoader: () => AtlasAttachmentLoader,
    Attachment: () => Attachment,
    AttachmentTimeline: () => AttachmentTimeline,
    BinaryInput: () => BinaryInput,
    BlendMode: () => BlendMode,
    Bone: () => Bone,
    BoneData: () => BoneData,
    BonePose: () => BonePose,
    BoneTimeline1: () => BoneTimeline1,
    BoneTimeline2: () => BoneTimeline2,
    BoundingBoxAttachment: () => BoundingBoxAttachment,
    CURRENT: () => CURRENT,
    CameraController: () => CameraController,
    ClippingAttachment: () => ClippingAttachment,
    Color: () => Color,
    Color2Attribute: () => Color2Attribute,
    ColorAttribute: () => ColorAttribute,
    Constraint: () => Constraint,
    ConstraintData: () => ConstraintData,
    ConstraintTimeline1: () => ConstraintTimeline1,
    CurveTimeline: () => CurveTimeline,
    CurveTimeline1: () => CurveTimeline1,
    DebugUtils: () => DebugUtils,
    DeformTimeline: () => DeformTimeline,
    Downloader: () => Downloader,
    DrawOrder: () => DrawOrder,
    DrawOrderFolderTimeline: () => DrawOrderFolderTimeline,
    DrawOrderTimeline: () => DrawOrderTimeline,
    Event: () => Event,
    EventData: () => EventData,
    EventQueue: () => EventQueue,
    EventTimeline: () => EventTimeline,
    EventType: () => EventType,
    FIRST: () => FIRST,
    FakeTexture: () => FakeTexture,
    FromProperty: () => FromProperty,
    FromRotate: () => FromRotate,
    FromScaleX: () => FromScaleX,
    FromScaleY: () => FromScaleY,
    FromShearY: () => FromShearY,
    FromX: () => FromX,
    FromY: () => FromY,
    GLTexture: () => GLTexture,
    HOLD: () => HOLD,
    IkConstraint: () => IkConstraint,
    IkConstraintData: () => IkConstraintData,
    IkConstraintPose: () => IkConstraintPose,
    IkConstraintTimeline: () => IkConstraintTimeline,
    Inherit: () => Inherit,
    InheritTimeline: () => InheritTimeline,
    Input: () => Input,
    IntSet: () => IntSet,
    Interpolation: () => Interpolation,
    LoadingScreen: () => LoadingScreen,
    M00: () => M00,
    M01: () => M01,
    M02: () => M02,
    M03: () => M03,
    M10: () => M10,
    M11: () => M11,
    M12: () => M12,
    M13: () => M13,
    M20: () => M20,
    M21: () => M21,
    M22: () => M22,
    M23: () => M23,
    M30: () => M30,
    M31: () => M31,
    M32: () => M32,
    M33: () => M33,
    MODE: () => MODE,
    ManagedWebGLRenderingContext: () => ManagedWebGLRenderingContext,
    MathUtils: () => MathUtils,
    Matrix4: () => Matrix4,
    Mesh: () => Mesh,
    MeshAttachment: () => MeshAttachment,
    MixFrom: () => MixFrom,
    OrthoCamera: () => OrthoCamera,
    PathAttachment: () => PathAttachment,
    PathConstraint: () => PathConstraint,
    PathConstraintData: () => PathConstraintData,
    PathConstraintMixTimeline: () => PathConstraintMixTimeline,
    PathConstraintPose: () => PathConstraintPose,
    PathConstraintPositionTimeline: () => PathConstraintPositionTimeline,
    PathConstraintSpacingTimeline: () => PathConstraintSpacingTimeline,
    Physics: () => Physics,
    PhysicsConstraint: () => PhysicsConstraint,
    PhysicsConstraintDampingTimeline: () => PhysicsConstraintDampingTimeline,
    PhysicsConstraintData: () => PhysicsConstraintData,
    PhysicsConstraintGravityTimeline: () => PhysicsConstraintGravityTimeline,
    PhysicsConstraintInertiaTimeline: () => PhysicsConstraintInertiaTimeline,
    PhysicsConstraintMassTimeline: () => PhysicsConstraintMassTimeline,
    PhysicsConstraintMixTimeline: () => PhysicsConstraintMixTimeline,
    PhysicsConstraintPose: () => PhysicsConstraintPose,
    PhysicsConstraintResetTimeline: () => PhysicsConstraintResetTimeline,
    PhysicsConstraintStrengthTimeline: () => PhysicsConstraintStrengthTimeline,
    PhysicsConstraintTimeline: () => PhysicsConstraintTimeline,
    PhysicsConstraintWindTimeline: () => PhysicsConstraintWindTimeline,
    PointAttachment: () => PointAttachment,
    PolygonBatcher: () => PolygonBatcher,
    Pool: () => Pool,
    Posed: () => Posed,
    PosedActive: () => PosedActive,
    PosedData: () => PosedData,
    Position2Attribute: () => Position2Attribute,
    Position3Attribute: () => Position3Attribute,
    PositionMode: () => PositionMode,
    Pow: () => Pow,
    PowOut: () => PowOut,
    Property: () => Property,
    RGB2Timeline: () => RGB2Timeline,
    RGBA2Timeline: () => RGBA2Timeline,
    RGBATimeline: () => RGBATimeline,
    RGBTimeline: () => RGBTimeline,
    RegionAttachment: () => RegionAttachment,
    ResizeMode: () => ResizeMode,
    RotateMode: () => RotateMode,
    RotateTimeline: () => RotateTimeline,
    SETUP: () => SETUP,
    ScaleTimeline: () => ScaleTimeline,
    ScaleXTimeline: () => ScaleXTimeline,
    ScaleYMode: () => ScaleYMode,
    ScaleYTimeline: () => ScaleYTimeline,
    SceneRenderer: () => SceneRenderer,
    Sequence: () => Sequence,
    SequenceMode: () => SequenceMode,
    SequenceModeValues: () => SequenceModeValues,
    SequenceTimeline: () => SequenceTimeline,
    Shader: () => Shader,
    ShapeRenderer: () => ShapeRenderer,
    ShapeType: () => ShapeType,
    ShearTimeline: () => ShearTimeline,
    ShearXTimeline: () => ShearXTimeline,
    ShearYTimeline: () => ShearYTimeline,
    Skeleton: () => Skeleton,
    SkeletonBinary: () => SkeletonBinary,
    SkeletonBounds: () => SkeletonBounds,
    SkeletonClipping: () => SkeletonClipping,
    SkeletonData: () => SkeletonData,
    SkeletonDebugRenderer: () => SkeletonDebugRenderer,
    SkeletonJson: () => SkeletonJson,
    SkeletonPhysicsMovement: () => SkeletonPhysicsMovement,
    SkeletonRenderer: () => SkeletonRenderer,
    SkeletonRendererCore: () => SkeletonRendererCore,
    Skin: () => Skin,
    SkinEntry: () => SkinEntry,
    Slider: () => Slider,
    SliderData: () => SliderData,
    SliderMixTimeline: () => SliderMixTimeline,
    SliderPose: () => SliderPose,
    SliderTimeline: () => SliderTimeline,
    Slot: () => Slot,
    SlotCurveTimeline: () => SlotCurveTimeline,
    SlotData: () => SlotData,
    SlotPose: () => SlotPose,
    SpacingMode: () => SpacingMode,
    SpineCanvas: () => SpineCanvas,
    StringSet: () => StringSet,
    TexCoordAttribute: () => TexCoordAttribute,
    Texture: () => Texture,
    TextureAtlas: () => TextureAtlas,
    TextureAtlasPage: () => TextureAtlasPage,
    TextureAtlasRegion: () => TextureAtlasRegion,
    TextureFilter: () => TextureFilter,
    TextureRegion: () => TextureRegion,
    TextureWrap: () => TextureWrap,
    TimeKeeper: () => TimeKeeper,
    Timeline: () => Timeline,
    ToProperty: () => ToProperty,
    ToRotate: () => ToRotate,
    ToScaleX: () => ToScaleX,
    ToScaleY: () => ToScaleY,
    ToShearY: () => ToShearY,
    ToX: () => ToX,
    ToY: () => ToY,
    Touch: () => Touch,
    TrackEntry: () => TrackEntry,
    TransformConstraint: () => TransformConstraint,
    TransformConstraintData: () => TransformConstraintData,
    TransformConstraintPose: () => TransformConstraintPose,
    TransformConstraintTimeline: () => TransformConstraintTimeline,
    TranslateTimeline: () => TranslateTimeline,
    TranslateXTimeline: () => TranslateXTimeline,
    TranslateYTimeline: () => TranslateYTimeline,
    Triangulator: () => Triangulator,
    Utils: () => Utils,
    Vector2: () => Vector2,
    Vector3: () => Vector3,
    VertexAttachment: () => VertexAttachment,
    VertexAttribute: () => VertexAttribute,
    VertexAttributeType: () => VertexAttributeType,
    WindowedMean: () => WindowedMean,
    isBoneTimeline: () => isBoneTimeline,
    isConstraintTimeline: () => isConstraintTimeline,
    isSlotTimeline: () => isSlotTimeline
  });

  // spine-core/src/Utils.ts
  var IntSet = class {
    array = [];
    add(value) {
      const contains = this.contains(value);
      this.array[value | 0] = value | 0;
      return !contains;
    }
    contains(value) {
      return this.array[value | 0] !== void 0;
    }
    remove(value) {
      this.array[value | 0] = void 0;
    }
    clear() {
      this.array.length = 0;
    }
  };
  var StringSet = class {
    entries = {};
    size = 0;
    add(value) {
      const contains = this.entries[value];
      this.entries[value] = true;
      if (!contains) {
        this.size++;
        return true;
      }
      return false;
    }
    addAll(values) {
      const oldSize = this.size;
      for (let i = 0, n = values.length; i < n; i++)
        this.add(values[i]);
      return oldSize !== this.size;
    }
    contains(value) {
      return this.entries[value];
    }
    clear() {
      this.entries = {};
      this.size = 0;
    }
  };
  var Color = class _Color {
    constructor(r = 0, g = 0, b = 0, a = 0) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    static WHITE = new _Color(1, 1, 1, 1);
    static RED = new _Color(1, 0, 0, 1);
    static GREEN = new _Color(0, 1, 0, 1);
    static BLUE = new _Color(0, 0, 1, 1);
    static MAGENTA = new _Color(1, 0, 1, 1);
    set(r, g, b, a) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
      return this.clamp();
    }
    setFromColor(c) {
      this.r = c.r;
      this.g = c.g;
      this.b = c.b;
      this.a = c.a;
      return this;
    }
    setFromString(hex) {
      hex = hex.charAt(0) === "#" ? hex.substr(1) : hex;
      this.r = parseInt(hex.substr(0, 2), 16) / 255;
      this.g = parseInt(hex.substr(2, 2), 16) / 255;
      this.b = parseInt(hex.substr(4, 2), 16) / 255;
      this.a = hex.length !== 8 ? 1 : parseInt(hex.substr(6, 2), 16) / 255;
      return this;
    }
    add(r, g, b, a) {
      this.r += r;
      this.g += g;
      this.b += b;
      this.a += a;
      return this.clamp();
    }
    clamp() {
      if (this.r < 0) this.r = 0;
      else if (this.r > 1) this.r = 1;
      if (this.g < 0) this.g = 0;
      else if (this.g > 1) this.g = 1;
      if (this.b < 0) this.b = 0;
      else if (this.b > 1) this.b = 1;
      if (this.a < 0) this.a = 0;
      else if (this.a > 1) this.a = 1;
      return this;
    }
    static rgba8888ToColor(color, value) {
      color.r = ((value & 4278190080) >>> 24) / 255;
      color.g = ((value & 16711680) >>> 16) / 255;
      color.b = ((value & 65280) >>> 8) / 255;
      color.a = (value & 255) / 255;
    }
    static rgb888ToColor(color, value) {
      color.r = ((value & 16711680) >>> 16) / 255;
      color.g = ((value & 65280) >>> 8) / 255;
      color.b = (value & 255) / 255;
    }
    toRgb888() {
      const hex = (x) => `0${(x * 255).toString(16)}`.slice(-2);
      return Number(`0x${hex(this.r)}${hex(this.g)}${hex(this.b)}`);
    }
    static fromString(hex, color = new _Color()) {
      return color.setFromString(hex);
    }
  };
  var MathUtils = class _MathUtils {
    static epsilon = 1e-5;
    static epsilon2 = _MathUtils.epsilon * _MathUtils.epsilon;
    // biome-ignore lint/suspicious/noApproximativeNumericConstant: reference runtime
    static PI = 3.1415927;
    static PI2 = _MathUtils.PI * 2;
    static invPI2 = 1 / _MathUtils.PI2;
    static radiansToDegrees = 180 / _MathUtils.PI;
    static radDeg = _MathUtils.radiansToDegrees;
    static degreesToRadians = _MathUtils.PI / 180;
    static degRad = _MathUtils.degreesToRadians;
    static clamp(value, min, max) {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    }
    static cosDeg(degrees) {
      return Math.cos(degrees * _MathUtils.degRad);
    }
    static sinDeg(degrees) {
      return Math.sin(degrees * _MathUtils.degRad);
    }
    static atan2Deg(y, x) {
      return Math.atan2(y, x) * _MathUtils.radDeg;
    }
    static signum(value) {
      return value > 0 ? 1 : value < 0 ? -1 : 0;
    }
    static toInt(x) {
      return x > 0 ? Math.floor(x) : Math.ceil(x);
    }
    static cbrt(x) {
      const y = Math.pow(Math.abs(x), 1 / 3);
      return x < 0 ? -y : y;
    }
    static randomTriangular(min, max) {
      return _MathUtils.randomTriangularWith(min, max, (min + max) * 0.5);
    }
    static randomTriangularWith(min, max, mode) {
      const u = Math.random();
      const d = max - min;
      if (u <= (mode - min) / d) return min + Math.sqrt(u * d * (mode - min));
      return max - Math.sqrt((1 - u) * d * (max - mode));
    }
    static isPowerOfTwo(value) {
      return value && (value & value - 1) === 0;
    }
  };
  var Interpolation = class _Interpolation {
    static linear = new class extends _Interpolation {
      applyInternal(a) {
        return a;
      }
    }();
    /** Aka "smoothstep". */
    static smooth = new class extends _Interpolation {
      applyInternal(a) {
        return a * a * (3 - 2 * a);
      }
    }();
    /** Slow, then fast. */
    static slowFast = new class extends _Interpolation {
      applyInternal(a) {
        return a * a;
      }
    }();
    /** Fast, then slow. */
    static fastSlow = new class extends _Interpolation {
      applyInternal(a) {
        return (a - 1) * (a - 1) * -1 + 1;
      }
    }();
    static circle = new class extends _Interpolation {
      applyInternal(a) {
        if (a <= 0.5) {
          a *= 2;
          return (1 - Math.sqrt(1 - a * a)) / 2;
        }
        a--;
        a *= 2;
        return (Math.sqrt(1 - a * a) + 1) / 2;
      }
    }();
    apply(start, end, a) {
      if (end === void 0 || a === void 0) return this.applyInternal(start);
      return start + (end - start) * this.applyInternal(a);
    }
  };
  var Pow = class extends Interpolation {
    power = 2;
    constructor(power) {
      super();
      this.power = power;
    }
    applyInternal(a) {
      if (a <= 0.5) return Math.pow(a * 2, this.power) / 2;
      return Math.pow((a - 1) * 2, this.power) / (this.power % 2 === 0 ? -2 : 2) + 1;
    }
  };
  var PowOut = class extends Pow {
    constructor(power) {
      super(power);
    }
    applyInternal(a) {
      return Math.pow(a - 1, this.power) * (this.power % 2 === 0 ? -1 : 1) + 1;
    }
  };
  var Utils = class _Utils {
    static SUPPORTS_TYPED_ARRAYS = typeof Float32Array !== "undefined";
    static arrayCopy(source, sourceStart, dest, destStart, numElements) {
      for (let i = sourceStart, j = destStart; i < sourceStart + numElements; i++, j++) {
        dest[j] = source[i];
      }
    }
    static arrayFill(array, fromIndex, toIndex, value) {
      for (let i = fromIndex; i < toIndex; i++)
        array[i] = value;
    }
    // biome-ignore lint/suspicious/noExplicitAny: ok any in this case
    static setArraySize(array, size, value = 0) {
      const oldSize = array.length;
      if (oldSize === size) return array;
      array.length = size;
      if (oldSize < size) {
        for (let i = oldSize; i < size; i++) array[i] = value;
      }
      return array;
    }
    // biome-ignore lint/suspicious/noExplicitAny: ok any in this case
    static ensureArrayCapacity(array, size, value = 0) {
      if (array.length >= size) return array;
      return _Utils.setArraySize(array, size, value);
    }
    static newArray(size, defaultValue) {
      const array = [];
      for (let i = 0; i < size; i++) array[i] = defaultValue;
      return array;
    }
    static newFloatArray(size) {
      if (_Utils.SUPPORTS_TYPED_ARRAYS)
        return new Float32Array(size);
      else {
        const array = [];
        for (let i = 0; i < array.length; i++) array[i] = 0;
        return array;
      }
    }
    static newShortArray(size) {
      if (_Utils.SUPPORTS_TYPED_ARRAYS)
        return new Int16Array(size);
      else {
        const array = [];
        for (let i = 0; i < array.length; i++) array[i] = 0;
        return array;
      }
    }
    static toFloatArray(array) {
      return _Utils.SUPPORTS_TYPED_ARRAYS ? new Float32Array(array) : array;
    }
    static toSinglePrecision(value) {
      return _Utils.SUPPORTS_TYPED_ARRAYS ? Math.fround(value) : value;
    }
    // This function is used to fix WebKit 602 specific issue described at https://esotericsoftware.com/forum/d/10109-ios-10-disappearing-graphics
    static webkit602BugfixHelper(alpha) {
    }
    static contains(array, element, identity = true) {
      for (let i = 0; i < array.length; i++)
        if (array[i] === element) return true;
      return false;
    }
    // biome-ignore lint/suspicious/noExplicitAny: ok any in this case
    static enumValue(type, name) {
      return type[name[0].toUpperCase() + name.slice(1)];
    }
  };
  var DebugUtils = class {
    static logBones(skeleton) {
      for (let i = 0; i < skeleton.bones.length; i++) {
        const bone = skeleton.bones[i].appliedPose;
        console.log(`${bone.bone.data.name}, ${bone.a}, ${bone.b}, ${bone.c}, ${bone.d}, ${bone.worldX}, ${bone.worldY}`);
      }
    }
  };
  var Pool = class {
    items = [];
    instantiator;
    constructor(instantiator) {
      this.instantiator = instantiator;
    }
    obtain() {
      return this.items.length > 0 ? this.items.pop() : this.instantiator();
    }
    free(item) {
      item.reset?.();
      this.items.push(item);
    }
    freeAll(items) {
      for (let i = 0; i < items.length; i++)
        this.free(items[i]);
    }
    clear() {
      this.items.length = 0;
    }
  };
  var Vector2 = class {
    constructor(x = 0, y = 0) {
      this.x = x;
      this.y = y;
    }
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    length() {
      const x = this.x;
      const y = this.y;
      return Math.sqrt(x * x + y * y);
    }
    normalize() {
      const len = this.length();
      if (len !== 0) {
        this.x /= len;
        this.y /= len;
      }
      return this;
    }
  };
  var TimeKeeper = class {
    maxDelta = 0.064;
    framesPerSecond = 0;
    delta = 0;
    totalTime = 0;
    lastTime = Date.now() / 1e3;
    frameCount = 0;
    frameTime = 0;
    update() {
      const now = Date.now() / 1e3;
      this.delta = now - this.lastTime;
      this.frameTime += this.delta;
      this.totalTime += this.delta;
      if (this.delta > this.maxDelta) this.delta = this.maxDelta;
      this.lastTime = now;
      this.frameCount++;
      if (this.frameTime > 1) {
        this.framesPerSecond = this.frameCount / this.frameTime;
        this.frameTime = 0;
        this.frameCount = 0;
      }
    }
  };
  var WindowedMean = class {
    values;
    addedValues = 0;
    lastValue = 0;
    mean = 0;
    dirty = true;
    constructor(windowSize = 32) {
      this.values = new Array(windowSize);
    }
    hasEnoughData() {
      return this.addedValues >= this.values.length;
    }
    addValue(value) {
      if (this.addedValues < this.values.length) this.addedValues++;
      this.values[this.lastValue++] = value;
      if (this.lastValue > this.values.length - 1) this.lastValue = 0;
      this.dirty = true;
    }
    getMean() {
      if (this.hasEnoughData()) {
        if (this.dirty) {
          let mean = 0;
          for (let i = 0; i < this.values.length; i++)
            mean += this.values[i];
          this.mean = mean / this.values.length;
          this.dirty = false;
        }
        return this.mean;
      }
      return 0;
    }
  };

  // spine-core/src/Texture.ts
  var Texture = class {
    _image;
    constructor(image) {
      this._image = image;
    }
    getImage() {
      return this._image;
    }
  };
  var TextureFilter = /* @__PURE__ */ ((TextureFilter2) => {
    TextureFilter2[TextureFilter2["Nearest"] = 9728] = "Nearest";
    TextureFilter2[TextureFilter2["Linear"] = 9729] = "Linear";
    TextureFilter2[TextureFilter2["MipMap"] = 9987] = "MipMap";
    TextureFilter2[TextureFilter2["MipMapNearestNearest"] = 9984] = "MipMapNearestNearest";
    TextureFilter2[TextureFilter2["MipMapLinearNearest"] = 9985] = "MipMapLinearNearest";
    TextureFilter2[TextureFilter2["MipMapNearestLinear"] = 9986] = "MipMapNearestLinear";
    TextureFilter2[TextureFilter2["MipMapLinearLinear"] = 9987] = "MipMapLinearLinear";
    return TextureFilter2;
  })(TextureFilter || {});
  var TextureWrap = /* @__PURE__ */ ((TextureWrap2) => {
    TextureWrap2[TextureWrap2["MirroredRepeat"] = 33648] = "MirroredRepeat";
    TextureWrap2[TextureWrap2["ClampToEdge"] = 33071] = "ClampToEdge";
    TextureWrap2[TextureWrap2["Repeat"] = 10497] = "Repeat";
    return TextureWrap2;
  })(TextureWrap || {});
  var TextureRegion = class {
    texture;
    u = 0;
    v = 0;
    u2 = 0;
    v2 = 0;
    width = 0;
    height = 0;
    degrees = 0;
    offsetX = 0;
    offsetY = 0;
    originalWidth = 0;
    originalHeight = 0;
  };
  var FakeTexture = class extends Texture {
    setFilters(minFilter, magFilter) {
    }
    setWraps(uWrap, vWrap) {
    }
    dispose() {
    }
  };

  // spine-core/src/TextureAtlas.ts
  var TextureAtlas = class {
    pages = [];
    regions = [];
    constructor(atlasText) {
      const reader = new TextureAtlasReader(atlasText);
      const entry = new Array(4);
      const pageFields = {};
      pageFields.size = (page2) => {
        page2.width = parseInt(entry[1]);
        page2.height = parseInt(entry[2]);
      };
      pageFields.format = () => {
      };
      pageFields.filter = (page2) => {
        page2.minFilter = Utils.enumValue(TextureFilter, entry[1]);
        page2.magFilter = Utils.enumValue(TextureFilter, entry[2]);
      };
      pageFields.repeat = (page2) => {
        if (entry[1].indexOf("x") !== -1) page2.uWrap = 10497 /* Repeat */;
        if (entry[1].indexOf("y") !== -1) page2.vWrap = 10497 /* Repeat */;
      };
      pageFields.pma = (page2) => {
        page2.pma = entry[1] === "true";
      };
      var regionFields = {};
      regionFields.xy = (region) => {
        region.x = parseInt(entry[1]);
        region.y = parseInt(entry[2]);
      };
      regionFields.size = (region) => {
        region.width = parseInt(entry[1]);
        region.height = parseInt(entry[2]);
      };
      regionFields.bounds = (region) => {
        region.x = parseInt(entry[1]);
        region.y = parseInt(entry[2]);
        region.width = parseInt(entry[3]);
        region.height = parseInt(entry[4]);
      };
      regionFields.offset = (region) => {
        region.offsetX = parseInt(entry[1]);
        region.offsetY = parseInt(entry[2]);
      };
      regionFields.orig = (region) => {
        region.originalWidth = parseInt(entry[1]);
        region.originalHeight = parseInt(entry[2]);
      };
      regionFields.offsets = (region) => {
        region.offsetX = parseInt(entry[1]);
        region.offsetY = parseInt(entry[2]);
        region.originalWidth = parseInt(entry[3]);
        region.originalHeight = parseInt(entry[4]);
      };
      regionFields.rotate = (region) => {
        const value = entry[1];
        if (value === "true")
          region.degrees = 90;
        else if (value !== "false")
          region.degrees = parseInt(value);
      };
      regionFields.index = (region) => {
        region.index = parseInt(entry[1]);
      };
      let line = reader.readLine();
      while (line && line.trim().length === 0)
        line = reader.readLine();
      while (true) {
        if (!line || line.trim().length === 0) break;
        if (reader.readEntry(entry, line) === 0) break;
        line = reader.readLine();
      }
      let page = null;
      let names = null;
      let values = null;
      while (true) {
        if (line === null) break;
        if (line.trim().length === 0) {
          page = null;
          line = reader.readLine();
        } else if (!page) {
          page = new TextureAtlasPage(line.trim());
          while (true) {
            if (reader.readEntry(entry, line = reader.readLine()) === 0) break;
            const field = pageFields[entry[0]];
            if (field) field(page);
          }
          this.pages.push(page);
        } else {
          const region = new TextureAtlasRegion(page, line);
          while (true) {
            const count = reader.readEntry(entry, line = reader.readLine());
            if (count === 0) break;
            const field = regionFields[entry[0]];
            if (field)
              field(region);
            else {
              if (!names) names = [];
              if (!values) values = [];
              names.push(entry[0]);
              const entryValues = [];
              for (let i = 0; i < count; i++)
                entryValues.push(parseInt(entry[i + 1]));
              values.push(entryValues);
            }
          }
          if (region.originalWidth === 0 && region.originalHeight === 0) {
            region.originalWidth = region.width;
            region.originalHeight = region.height;
          }
          if (names && names.length > 0 && values && values.length > 0) {
            region.names = names;
            region.values = values;
            names = null;
            values = null;
          }
          region.u = region.x / page.width;
          region.v = region.y / page.height;
          if (region.degrees === 90) {
            region.u2 = (region.x + region.height) / page.width;
            region.v2 = (region.y + region.width) / page.height;
          } else {
            region.u2 = (region.x + region.width) / page.width;
            region.v2 = (region.y + region.height) / page.height;
          }
          this.regions.push(region);
        }
      }
    }
    findRegion(name) {
      for (let i = 0; i < this.regions.length; i++) {
        if (this.regions[i].name === name) {
          return this.regions[i];
        }
      }
      return null;
    }
    setTextures(assetManager, pathPrefix = "") {
      for (const page of this.pages)
        page.setTexture(assetManager.get(pathPrefix + page.name));
    }
    dispose() {
      for (let i = 0; i < this.pages.length; i++) {
        this.pages[i].texture?.dispose();
      }
    }
  };
  var TextureAtlasReader = class {
    lines;
    index = 0;
    constructor(text) {
      this.lines = text.split(/\r\n|\r|\n/);
    }
    readLine() {
      if (this.index >= this.lines.length)
        return null;
      return this.lines[this.index++];
    }
    readEntry(entry, line) {
      if (!line) return 0;
      line = line.trim();
      if (line.length === 0) return 0;
      const colon = line.indexOf(":");
      if (colon === -1) return 0;
      entry[0] = line.substr(0, colon).trim();
      for (let i = 1, lastMatch = colon + 1; ; i++) {
        const comma = line.indexOf(",", lastMatch);
        if (comma === -1) {
          entry[i] = line.substr(lastMatch).trim();
          return i;
        }
        entry[i] = line.substr(lastMatch, comma - lastMatch).trim();
        lastMatch = comma + 1;
        if (i === 4) return 4;
      }
    }
  };
  var TextureAtlasPage = class {
    name;
    minFilter = 9728 /* Nearest */;
    magFilter = 9728 /* Nearest */;
    uWrap = 33071 /* ClampToEdge */;
    vWrap = 33071 /* ClampToEdge */;
    texture = null;
    width = 0;
    height = 0;
    pma = false;
    regions = [];
    constructor(name) {
      this.name = name;
    }
    setTexture(texture) {
      this.texture = texture;
      texture.setFilters(this.minFilter, this.magFilter);
      texture.setWraps(this.uWrap, this.vWrap);
      for (const region of this.regions)
        region.texture = texture;
    }
  };
  var TextureAtlasRegion = class extends TextureRegion {
    page;
    name;
    x = 0;
    y = 0;
    offsetX = 0;
    offsetY = 0;
    originalWidth = 0;
    originalHeight = 0;
    index = 0;
    degrees = 0;
    names = null;
    values = null;
    constructor(page, name) {
      super();
      this.page = page;
      this.name = name;
      page.regions.push(this);
    }
  };

  // spine-core/src/attachments/Attachment.ts
  var Attachment = class _Attachment {
    static empty = [];
    name;
    /** Timelines for the timeline attachment are also applied to this attachment.
     * @return May be null if no attachment-specific timelines should be applied. */
    timelineAttachment;
    /** Slots that can have attachments whose {@link timelineAttachment} is this attachment. */
    timelineSlots = _Attachment.empty;
    constructor(name) {
      if (!name) throw new Error("name cannot be null.");
      this.name = name;
      this.timelineAttachment = this;
    }
    /** Returns true if the {@code slotIndex} or any {@link timelineSlots} have an attachment whose {@link timelineAttachment} is
     * this attachment.
     * @param slots The {@link Skeleton.slots}.
     * @param slotIndex The timeline's primary slot index. */
    isTimelineActive(slots, slotIndex, appliedPose) {
      let slot = slots[slotIndex];
      if (slot.bone.isActive()) {
        const other = (appliedPose ? slot.getAppliedPose() : slot.getPose()).getAttachment();
        if (other != null && other.timelineAttachment === this) return true;
      }
      for (let i = 0, n = this.timelineSlots.length; i < n; i++) {
        slot = slots[this.timelineSlots[i]];
        if (!slot.bone.isActive()) continue;
        const other = (appliedPose ? slot.getAppliedPose() : slot.getPose()).getAttachment();
        if (other != null && other.timelineAttachment === this) return true;
      }
      return false;
    }
  };
  var VertexAttachment = class _VertexAttachment extends Attachment {
    static nextID = 0;
    /** The unique ID for this attachment. */
    id = _VertexAttachment.nextID++;
    /** The bones that affect the {@link vertices}. The entries are, for each vertex, the number of bones affecting the vertex
     * followed by that many bone indices, which is {@link Skeleton.getBones} index. Null if this attachment has no weights. */
    bones = null;
    /** The vertex positions in the bone's coordinate system. For a non-weighted attachment, the values are `x,y`
     * entries for each vertex. For a weighted attachment, the values are `x,y,weight` triplets for each bone affecting
     * each vertex. */
    vertices = [];
    /** The maximum number of world vertex values that can be output by
     * {@link computeWorldVertices} using the `count` parameter. */
    worldVerticesLength = 0;
    constructor(name) {
      super(name);
    }
    /** Transforms the attachment's local {@link vertices} to world coordinates. If {@link SlotPose.getDeform} is not empty, it
     * is used to deform the vertices.
     *
     * See <a href="https://esotericsoftware.com/spine-runtime-skeletons#World-transforms">World transforms</a> in the Spine
     * Runtimes Guide.
     * @param start The index of the first {@link vertices} value to transform. Each vertex has 2 values, x and y.
     * @param count The number of world vertex values to output. Must be <= {@link worldVerticesLength} - `start`.
     * @param worldVertices The output world vertices. Must have a length >= `offset` + `count` *
     *           `stride` / 2.
     * @param offset The `worldVertices` index to begin writing values.
     * @param stride The number of `worldVertices` entries between the value pairs written. */
    computeWorldVertices(skeleton, slot, start, count, worldVertices, offset, stride) {
      count = offset + (count >> 1) * stride;
      const deformArray = slot.appliedPose.deform;
      let vertices = this.vertices;
      const bones = this.bones;
      if (!bones) {
        if (deformArray.length > 0) vertices = deformArray;
        const bone = slot.bone.appliedPose;
        const x = bone.worldX;
        const y = bone.worldY;
        const a = bone.a, b = bone.b, c = bone.c, d = bone.d;
        for (let v2 = start, w = offset; w < count; v2 += 2, w += stride) {
          const vx = vertices[v2], vy = vertices[v2 + 1];
          worldVertices[w] = vx * a + vy * b + x;
          worldVertices[w + 1] = vx * c + vy * d + y;
        }
        return;
      }
      let v = 0, skip = 0;
      for (let i = 0; i < start; i += 2) {
        const n = bones[v];
        v += n + 1;
        skip += n;
      }
      const skeletonBones = skeleton.bones;
      if (deformArray.length === 0) {
        for (let w = offset, b = skip * 3; w < count; w += stride) {
          let wx = 0, wy = 0;
          let n = bones[v++];
          n += v;
          for (; v < n; v++, b += 3) {
            const bone = skeletonBones[bones[v]].appliedPose;
            const vx = vertices[b], vy = vertices[b + 1], weight = vertices[b + 2];
            wx += (vx * bone.a + vy * bone.b + bone.worldX) * weight;
            wy += (vx * bone.c + vy * bone.d + bone.worldY) * weight;
          }
          worldVertices[w] = wx;
          worldVertices[w + 1] = wy;
        }
      } else {
        const deform = deformArray;
        for (let w = offset, b = skip * 3, f = skip << 1; w < count; w += stride) {
          let wx = 0, wy = 0;
          let n = bones[v++];
          n += v;
          for (; v < n; v++, b += 3, f += 2) {
            const bone = skeletonBones[bones[v]].appliedPose;
            const vx = vertices[b] + deform[f], vy = vertices[b + 1] + deform[f + 1], weight = vertices[b + 2];
            wx += (vx * bone.a + vy * bone.b + bone.worldX) * weight;
            wy += (vx * bone.c + vy * bone.d + bone.worldY) * weight;
          }
          worldVertices[w] = wx;
          worldVertices[w + 1] = wy;
        }
      }
    }
    /** Does not copy id (generated) or name (set on construction). **/
    copyTo(attachment) {
      if (this.bones) {
        attachment.bones = [];
        Utils.arrayCopy(this.bones, 0, attachment.bones, 0, this.bones.length);
      } else
        attachment.bones = null;
      if (this.vertices) {
        attachment.vertices = Utils.newFloatArray(this.vertices.length);
        Utils.arrayCopy(this.vertices, 0, attachment.vertices, 0, this.vertices.length);
      }
      attachment.worldVerticesLength = this.worldVerticesLength;
      attachment.timelineAttachment = this.timelineAttachment;
      attachment.timelineSlots = this.timelineSlots;
    }
  };

  // spine-core/src/attachments/MeshAttachment.ts
  var MeshAttachment = class _MeshAttachment extends VertexAttachment {
    sequence;
    /** The UV pair for each vertex, normalized within the texture region. */
    regionUVs = [];
    /** Triplets of vertex indices which describe the mesh's triangulation. */
    triangles = [];
    /** The number of entries at the beginning of {@link vertices} that make up the mesh hull. */
    hullLength = 0;
    /** The name of the texture region for this attachment. */
    path;
    /** The color to tint the mesh. */
    color = new Color(1, 1, 1, 1);
    sourceMesh = null;
    /** Vertex index pairs describing edges for controlling triangulation, or null if nonessential data was not exported. Mesh
     * triangles do not never cross edges. Triangulation is not performed at runtime. */
    edges = [];
    /** The width of the mesh's image. Available only when nonessential data was exported. */
    width = 0;
    /** The height of the mesh's image. Available only when nonessential data was exported. */
    height = 0;
    tempColor = new Color(0, 0, 0, 0);
    constructor(name, sequence) {
      super(name);
      this.sequence = sequence;
    }
    copy() {
      if (this.sourceMesh) return this.newLinkedMesh();
      const copy = new _MeshAttachment(this.name, this.sequence.copy());
      copy.path = this.path;
      copy.color.setFromColor(this.color);
      this.copyTo(copy);
      copy.regionUVs = [];
      Utils.arrayCopy(this.regionUVs, 0, copy.regionUVs, 0, this.regionUVs.length);
      copy.triangles = [];
      Utils.arrayCopy(this.triangles, 0, copy.triangles, 0, this.triangles.length);
      copy.hullLength = this.hullLength;
      if (this.edges) {
        copy.edges = [];
        Utils.arrayCopy(this.edges, 0, copy.edges, 0, this.edges.length);
      }
      copy.width = this.width;
      copy.height = this.height;
      return copy;
    }
    updateSequence() {
      this.sequence.update(this);
    }
    /** The source mesh if this is a linked mesh, else null. A linked mesh shares the {@link bones}, {@link vertices},
     * {@link regionUVs}, {@link triangles}, {@link hullLength}, {@link edges}, {@link width}, and {@link height} with the
     * source mesh, but may have a different {@link name} or {@link path}, and therefore a different texture region. */
    getSourceMesh() {
      return this.sourceMesh;
    }
    setSourceMesh(sourceMesh) {
      this.sourceMesh = sourceMesh;
      if (sourceMesh) {
        this.bones = sourceMesh.bones;
        this.vertices = sourceMesh.vertices;
        this.worldVerticesLength = sourceMesh.worldVerticesLength;
        this.regionUVs = sourceMesh.regionUVs;
        this.triangles = sourceMesh.triangles;
        this.hullLength = sourceMesh.hullLength;
        this.worldVerticesLength = sourceMesh.worldVerticesLength;
        this.edges = sourceMesh.edges;
        this.width = sourceMesh.width;
        this.height = sourceMesh.height;
      }
    }
    /** Returns a new mesh with the {@link sourceMesh} set to this mesh's source mesh, if any, else to this mesh. **/
    newLinkedMesh() {
      const copy = new _MeshAttachment(this.name, this.sequence.copy());
      copy.timelineAttachment = this.timelineAttachment;
      copy.path = this.path;
      copy.color.setFromColor(this.color);
      copy.setSourceMesh(this.sourceMesh ? this.sourceMesh : this);
      copy.updateSequence();
      return copy;
    }
    /** Computes {@link Sequence.getUVs | UVs} for a mesh attachment.
     * @param uvs Output array for the computed UVs, same length as regionUVs. */
    static computeUVs(region, regionUVs, uvs) {
      if (!region) throw new Error("Region not set.");
      const n = uvs.length;
      let u = region.u, v = region.v, width = 0, height = 0;
      if (region instanceof TextureAtlasRegion) {
        const page = region.page;
        const textureWidth = page.width, textureHeight = page.height;
        switch (region.degrees) {
          case 90:
            u -= (region.originalHeight - region.offsetY - region.height) / textureWidth;
            v -= (region.originalWidth - region.offsetX - region.width) / textureHeight;
            width = region.originalHeight / textureWidth;
            height = region.originalWidth / textureHeight;
            for (let i = 0; i < n; i += 2) {
              uvs[i] = u + regionUVs[i + 1] * width;
              uvs[i + 1] = v + (1 - regionUVs[i]) * height;
            }
            return;
          case 180:
            u -= (region.originalWidth - region.offsetX - region.width) / textureWidth;
            v -= region.offsetY / textureHeight;
            width = region.originalWidth / textureWidth;
            height = region.originalHeight / textureHeight;
            for (let i = 0; i < n; i += 2) {
              uvs[i] = u + (1 - regionUVs[i]) * width;
              uvs[i + 1] = v + (1 - regionUVs[i + 1]) * height;
            }
            return;
          case 270:
            u -= region.offsetY / textureWidth;
            v -= region.offsetX / textureHeight;
            width = region.originalHeight / textureWidth;
            height = region.originalWidth / textureHeight;
            for (let i = 0; i < n; i += 2) {
              uvs[i] = u + (1 - regionUVs[i + 1]) * width;
              uvs[i + 1] = v + regionUVs[i] * height;
            }
            return;
          default:
            u -= region.offsetX / textureWidth;
            v -= (region.originalHeight - region.offsetY - region.height) / textureHeight;
            width = region.originalWidth / textureWidth;
            height = region.originalHeight / textureHeight;
        }
      } else if (!region) {
        u = v = 0;
        width = height = 1;
      } else {
        width = region.u2 - u;
        height = region.v2 - v;
      }
      for (let i = 0; i < n; i += 2) {
        uvs[i] = u + regionUVs[i] * width;
        uvs[i + 1] = v + regionUVs[i + 1] * height;
      }
    }
  };

  // spine-core/src/attachments/RegionAttachment.ts
  var RegionAttachment = class _RegionAttachment extends Attachment {
    sequence;
    /** The local x translation. */
    x = 0;
    /** The local y translation. */
    y = 0;
    /** The local scaleX. */
    scaleX = 1;
    /** The local scaleY. */
    scaleY = 1;
    /** The local rotation in degrees, counter clockwise. */
    rotation = 0;
    /** The width of the region attachment in Spine. */
    width = 0;
    /** The height of the region attachment in Spine. */
    height = 0;
    /** The name of the texture region for this attachment. */
    path;
    /** The color to tint the region attachment. */
    color = new Color(1, 1, 1, 1);
    tempColor = new Color(1, 1, 1, 1);
    constructor(name, sequence) {
      super(name);
      this.sequence = sequence;
    }
    copy() {
      const copy = new _RegionAttachment(this.name, this.sequence.copy());
      copy.path = this.path;
      copy.x = this.x;
      copy.y = this.y;
      copy.scaleX = this.scaleX;
      copy.scaleY = this.scaleY;
      copy.rotation = this.rotation;
      copy.width = this.width;
      copy.height = this.height;
      copy.color.setFromColor(this.color);
      return copy;
    }
    /** Transforms the attachment's four vertices to world coordinates.
     *
     * See <a href="http://esotericsoftware.com/spine-runtime-skeletons#World-transforms">World transforms</a> in the Spine
     * Runtimes Guide.
     * @param worldVertices The output world vertices. Must have a length >= `offset` + 8.
     * @param offset The `worldVertices` index to begin writing values.
     * @param stride The number of `worldVertices` entries between the value pairs written. */
    computeWorldVertices(slot, vertexOffsets, worldVertices, offset, stride) {
      const bone = slot.bone.appliedPose;
      const x = bone.worldX, y = bone.worldY;
      const a = bone.a, b = bone.b, c = bone.c, d = bone.d;
      let offsetX = vertexOffsets[0];
      let offsetY = vertexOffsets[1];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
      offset += stride;
      offsetX = vertexOffsets[2];
      offsetY = vertexOffsets[3];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
      offset += stride;
      offsetX = vertexOffsets[4];
      offsetY = vertexOffsets[5];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
      offset += stride;
      offsetX = vertexOffsets[6];
      offsetY = vertexOffsets[7];
      worldVertices[offset] = offsetX * a + offsetY * b + x;
      worldVertices[offset + 1] = offsetX * c + offsetY * d + y;
    }
    getOffsets(pose) {
      return this.sequence.offsets[this.sequence.resolveIndex(pose)];
    }
    updateSequence() {
      this.sequence.update(this);
    }
    /** Computes {@link Sequence.getUVs | UVs} and {@link Sequence.getOffsets | offsets} for a region attachment.
     * @param uvs Output array for the computed UVs, length of 8.
     * @param offset Output array for the computed vertex offsets, length of 8. */
    static computeUVs(region, x, y, scaleX, scaleY, rotation, width, height, offset, uvs) {
      if (!region) throw new Error("Region not set.");
      const regionScaleX = width / region.originalWidth * scaleX;
      const regionScaleY = height / region.originalHeight * scaleY;
      const localX = -width / 2 * scaleX + region.offsetX * regionScaleX;
      const localY = -height / 2 * scaleY + region.offsetY * regionScaleY;
      const localX2 = localX + region.width * regionScaleX;
      const localY2 = localY + region.height * regionScaleY;
      const radians = rotation * MathUtils.degRad;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const localXCos = localX * cos + x;
      const localXSin = localX * sin;
      const localYCos = localY * cos + y;
      const localYSin = localY * sin;
      const localX2Cos = localX2 * cos + x;
      const localX2Sin = localX2 * sin;
      const localY2Cos = localY2 * cos + y;
      const localY2Sin = localY2 * sin;
      offset[0] = localXCos - localYSin;
      offset[1] = localYCos + localXSin;
      offset[2] = localXCos - localY2Sin;
      offset[3] = localY2Cos + localXSin;
      offset[4] = localX2Cos - localY2Sin;
      offset[5] = localY2Cos + localX2Sin;
      offset[6] = localX2Cos - localYSin;
      offset[7] = localYCos + localX2Sin;
      if (region == null) {
        uvs[0] = 0;
        uvs[1] = 0;
        uvs[2] = 0;
        uvs[3] = 1;
        uvs[4] = 1;
        uvs[5] = 1;
        uvs[6] = 1;
        uvs[7] = 0;
      } else {
        uvs[1] = region.v2;
        uvs[2] = region.u;
        uvs[5] = region.v;
        uvs[6] = region.u2;
        if (region.degrees === 90) {
          uvs[0] = region.u2;
          uvs[3] = region.v2;
          uvs[4] = region.u;
          uvs[7] = region.v;
        } else {
          uvs[0] = region.u;
          uvs[3] = region.v;
          uvs[4] = region.u2;
          uvs[7] = region.v2;
        }
      }
    }
    static X1 = 0;
    static Y1 = 1;
    static C1R = 2;
    static C1G = 3;
    static C1B = 4;
    static C1A = 5;
    static U1 = 6;
    static V1 = 7;
    static X2 = 8;
    static Y2 = 9;
    static C2R = 10;
    static C2G = 11;
    static C2B = 12;
    static C2A = 13;
    static U2 = 14;
    static V2 = 15;
    static X3 = 16;
    static Y3 = 17;
    static C3R = 18;
    static C3G = 19;
    static C3B = 20;
    static C3A = 21;
    static U3 = 22;
    static V3 = 23;
    static X4 = 24;
    static Y4 = 25;
    static C4R = 26;
    static C4G = 27;
    static C4B = 28;
    static C4A = 29;
    static U4 = 30;
    static V4 = 31;
  };

  // spine-core/src/attachments/Sequence.ts
  var Sequence = class _Sequence {
    static _nextID = 0;
    id = _Sequence.nextID();
    /** The list of texture regions this sequence will display. */
    regions;
    pathSuffix;
    uvs;
    /** Returns vertex offsets from the center of a {@link RegionAttachment}. Invalid to call for a {@link MeshAttachment}. */
    offsets;
    /** The starting number for the numeric {@link getPath | path} suffix. */
    start = 0;
    /** The minimum number of digits in the numeric {@link getPath | path} suffix, for zero padding. 0 for no zero
     * padding. */
    digits = 0;
    /** The index of the region to show for the setup pose. */
    setupIndex = 0;
    /** @param count The number of texture regions this sequence will display.
     * @param pathSuffix If true, the {@link getPath | path} has a numeric suffix. If false, all regions will use the
     * same path, so `count` should be 1. */
    constructor(count, pathSuffix) {
      this.regions = new Array(count);
      this.pathSuffix = pathSuffix;
    }
    copy() {
      const regionCount = this.regions.length;
      const copy = new _Sequence(regionCount, this.pathSuffix);
      Utils.arrayCopy(this.regions, 0, copy.regions, 0, regionCount);
      copy.start = this.start;
      copy.digits = this.digits;
      copy.setupIndex = this.setupIndex;
      if (this.uvs != null) {
        const length = this.uvs[0].length;
        copy.uvs = [];
        for (let i = 0; i < regionCount; i++) {
          copy.uvs[i] = Utils.newFloatArray(length);
          Utils.arrayCopy(this.uvs[i], 0, copy.uvs[i], 0, length);
        }
      }
      if (this.offsets != null) {
        copy.offsets = [];
        for (let i = 0; i < regionCount; i++) {
          copy.offsets[i] = [];
          Utils.arrayCopy(this.offsets[i], 0, copy.offsets[i], 0, 8);
        }
      }
      return copy;
    }
    /** Computes UVs and offsets for the specified attachment. Must be called if the regions or attachment properties are
      * changed. */
    update(attachment) {
      const regionCount = this.regions.length;
      if (attachment instanceof RegionAttachment) {
        this.uvs = [];
        this.offsets = [];
        for (let i = 0; i < regionCount; i++) {
          this.uvs[i] = Utils.newFloatArray(8);
          this.offsets[i] = [];
          RegionAttachment.computeUVs(
            this.regions[i],
            attachment.x,
            attachment.y,
            attachment.scaleX,
            attachment.scaleY,
            attachment.rotation,
            attachment.width,
            attachment.height,
            this.offsets[i],
            this.uvs[i]
          );
        }
      } else if (attachment instanceof MeshAttachment) {
        const regionUVs = attachment.regionUVs;
        this.uvs = [];
        this.offsets = void 0;
        for (let i = 0; i < regionCount; i++) {
          this.uvs[i] = Utils.newFloatArray(regionUVs.length);
          MeshAttachment.computeUVs(this.regions[i], regionUVs, this.uvs[i]);
        }
      }
    }
    /** Returns the {@link regions} index for the {@link SlotPose.getSequenceIndex}. */
    resolveIndex(pose) {
      let index = pose.sequenceIndex;
      if (index === -1) index = this.setupIndex;
      if (index >= this.regions.length) index = this.regions.length - 1;
      return index;
    }
    /** Returns the UVs for the specified index. {@link regions Regions} must be populated and {@link update} called
      * before calling this method. */
    getUVs(index) {
      return this.uvs[index];
    }
    /** Returns true if the {@link getPath | path} has a numeric suffix. */
    hasPathSuffix() {
      return this.pathSuffix;
    }
    /** Returns the specified base path with an optional numeric suffix for the specified index. */
    getPath(basePath, index) {
      if (!this.pathSuffix) return basePath;
      let result = basePath;
      const frame = (this.start + index).toString();
      for (let i = this.digits - frame.length; i > 0; i--)
        result += "0";
      result += frame;
      return result;
    }
    static nextID() {
      return _Sequence._nextID++;
    }
  };
  var SequenceMode = /* @__PURE__ */ ((SequenceMode2) => {
    SequenceMode2[SequenceMode2["hold"] = 0] = "hold";
    SequenceMode2[SequenceMode2["once"] = 1] = "once";
    SequenceMode2[SequenceMode2["loop"] = 2] = "loop";
    SequenceMode2[SequenceMode2["pingpong"] = 3] = "pingpong";
    SequenceMode2[SequenceMode2["onceReverse"] = 4] = "onceReverse";
    SequenceMode2[SequenceMode2["loopReverse"] = 5] = "loopReverse";
    SequenceMode2[SequenceMode2["pingpongReverse"] = 6] = "pingpongReverse";
    return SequenceMode2;
  })(SequenceMode || {});
  var SequenceModeValues = [
    0 /* hold */,
    1 /* once */,
    2 /* loop */,
    3 /* pingpong */,
    4 /* onceReverse */,
    5 /* loopReverse */,
    6 /* pingpongReverse */
  ];

  // spine-core/src/Animation.ts
  var Animation = class {
    /** The animation's name, unique across all animations in the skeleton.
     *
     * See {@link SkeletonData.findAnimation}. */
    name;
    /** The duration of the animation in seconds, which is usually the highest time of all frames in the timelines. The duration is
     * used to know when the animation has completed and, for animations that repeat, when it should loop back to the start. */
    timelines = [];
    timelineIds;
    /** {@link Skeleton.getBones} indices that this animation's timelines modify.
     *
     * See {@link BoneTimeline.bones}. */
    bones;
    // Nonessential.
    /** The color of the animation as it was in Spine, or a default color if nonessential data was not exported. */
    color = new Color(1, 1, 1, 1);
    /** The duration of the animation in seconds, which is usually the highest time of all frames in the timeline. The duration is
     * used to know when it has completed and when it should loop back to the start. */
    duration;
    constructor(name, timelines, duration) {
      if (!name) throw new Error("name cannot be null.");
      this.name = name;
      this.duration = duration;
      this.timelineIds = new StringSet();
      this.bones = [];
      this.setTimelines(timelines);
    }
    setTimelines(timelines) {
      if (!timelines) throw new Error("timelines cannot be null.");
      this.timelines = timelines;
      const n = timelines.length;
      this.timelineIds.clear();
      this.bones.length = 0;
      const boneSet = /* @__PURE__ */ new Set();
      const items = timelines;
      for (let i = 0; i < n; i++) {
        const timeline = items[i];
        this.timelineIds.addAll(timeline.propertyIds);
        if (isBoneTimeline(timeline) && boneSet.add(timeline.boneIndex))
          this.bones.push(timeline.boneIndex);
      }
    }
    /** Returns true if this animation contains a timeline with any of the specified property IDs.
     *
     * See {@link Timeline.propertyIds}. */
    hasTimeline(ids) {
      for (let i = 0; i < ids.length; i++)
        if (this.timelineIds.contains(ids[i])) return true;
      return false;
    }
    /** Applies the animation's timelines to the specified skeleton.
     *
     * See {@link Timeline.apply} and
     * <a href='https://esotericsoftware.com/spine-applying-animations#Timeline-API'>Applying Animations</a> in the Spine Runtimes
     * Guide.
     * @param skeleton The skeleton the animation is applied to. This provides access to the bones, slots, and other skeleton
     *           components the timelines may change.
     * @param lastTime The last time in seconds this animation was applied. Some timelines trigger only at discrete times, in which
     *           case all keys are triggered between `lastTime` (exclusive) and `time` (inclusive). Pass -1
     *           the first time an animation is applied to ensure frame 0 is triggered.
     * @param time The time in seconds the skeleton is being posed for. Timelines find the frame before and after this time and
     *           interpolate between the frame values.
     * @param loop True if `time` beyond the {@link duration} repeats the animation, else the last frame is used.
     * @param events If any events are fired, they are added to this list. Pass null to ignore fired events or if no timelines fire
     *           events.
     * @param alpha 0 applies setup or current values (depending on `from`), 1 uses timeline values, and intermediate
     *           values interpolate between them. Adjusting `alpha` over time can mix an animation in or out.
     * @param from Controls how `alpha` and `add` mix from current or setup pose values to timeline values.
     * @param add If true, for timelines that support it, their values are added to the setup or current values (depending on
     *           `from`).
     * @param out True when the animation is mixing out, else it is mixing in. Used by timelines that perform instant transitions.
     * @param appliedPose True to modify {@link Posed.appliedPose}, else {@link Posed.pose} is modified. */
    apply(skeleton, lastTime, time, loop, events, alpha, from, add, out, appliedPose) {
      if (!skeleton) throw new Error("skeleton cannot be null.");
      if (loop && this.duration !== 0) {
        time %= this.duration;
        if (lastTime > 0) lastTime %= this.duration;
      }
      const timelines = this.timelines;
      for (let i = 0, n = timelines.length; i < n; i++)
        timelines[i].apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose);
    }
  };
  var MixFrom = /* @__PURE__ */ ((MixFrom2) => {
    MixFrom2[MixFrom2["current"] = 0] = "current";
    MixFrom2[MixFrom2["setup"] = 1] = "setup";
    MixFrom2[MixFrom2["first"] = 2] = "first";
    return MixFrom2;
  })(MixFrom || {});
  var Property = /* @__PURE__ */ ((Property2) => {
    Property2[Property2["rotate"] = 0] = "rotate";
    Property2[Property2["x"] = 1] = "x";
    Property2[Property2["y"] = 2] = "y";
    Property2[Property2["scaleX"] = 3] = "scaleX";
    Property2[Property2["scaleY"] = 4] = "scaleY";
    Property2[Property2["shearX"] = 5] = "shearX";
    Property2[Property2["shearY"] = 6] = "shearY";
    Property2[Property2["inherit"] = 7] = "inherit";
    Property2[Property2["rgb"] = 8] = "rgb";
    Property2[Property2["alpha"] = 9] = "alpha";
    Property2[Property2["rgb2"] = 10] = "rgb2";
    Property2[Property2["attachment"] = 11] = "attachment";
    Property2[Property2["deform"] = 12] = "deform";
    Property2[Property2["event"] = 13] = "event";
    Property2[Property2["drawOrder"] = 14] = "drawOrder";
    Property2[Property2["drawOrderFolder"] = 15] = "drawOrderFolder";
    Property2[Property2["ikConstraint"] = 16] = "ikConstraint";
    Property2[Property2["transformConstraint"] = 17] = "transformConstraint";
    Property2[Property2["pathConstraintPosition"] = 18] = "pathConstraintPosition";
    Property2[Property2["pathConstraintSpacing"] = 19] = "pathConstraintSpacing";
    Property2[Property2["pathConstraintMix"] = 20] = "pathConstraintMix";
    Property2[Property2["physicsConstraintInertia"] = 21] = "physicsConstraintInertia";
    Property2[Property2["physicsConstraintStrength"] = 22] = "physicsConstraintStrength";
    Property2[Property2["physicsConstraintDamping"] = 23] = "physicsConstraintDamping";
    Property2[Property2["physicsConstraintMass"] = 24] = "physicsConstraintMass";
    Property2[Property2["physicsConstraintWind"] = 25] = "physicsConstraintWind";
    Property2[Property2["physicsConstraintGravity"] = 26] = "physicsConstraintGravity";
    Property2[Property2["physicsConstraintMix"] = 27] = "physicsConstraintMix";
    Property2[Property2["physicsConstraintReset"] = 28] = "physicsConstraintReset";
    Property2[Property2["sequence"] = 29] = "sequence";
    Property2[Property2["sliderTime"] = 30] = "sliderTime";
    Property2[Property2["sliderMix"] = 31] = "sliderMix";
    return Property2;
  })(Property || {});
  var Timeline = class {
    propertyIds;
    frames;
    /** True if this timeline supports being applied additively.
     *
     * See the `add` parameter in {@link Timeline.apply}. */
    additive = false;
    /** True if this timeline sets values instantaneously and does not support interpolation between frames. */
    instant = false;
    constructor(frameCount, ...propertyIds) {
      this.propertyIds = propertyIds;
      this.frames = Utils.newFloatArray(frameCount * this.getFrameEntries());
    }
    getPropertyIds() {
      return this.propertyIds;
    }
    /** The number of values stored per frame. */
    getFrameEntries() {
      return 1;
    }
    /** The number of frames in this timeline. */
    getFrameCount() {
      return this.frames.length / this.getFrameEntries();
    }
    /** The duration of the timeline in seconds, which is usually the highest time of all frames in the timeline. */
    getDuration() {
      return this.frames[this.frames.length - this.getFrameEntries()];
    }
    /** Linear search using the specified stride (default 1).
     * @param time Must be >= the first value in `frames`.
     * @return The index of the first value <= `time`. */
    static search(frames, time, step = 1) {
      const n = frames.length;
      for (let i = step; i < n; i += step)
        if (frames[i] > time) return i - step;
      return n - step;
    }
  };
  function isSlotTimeline(obj) {
    return typeof obj === "object" && obj !== null && typeof obj.slotIndex === "number";
  }
  var CurveTimeline = class extends Timeline {
    curves;
    // type, x, y, ...
    constructor(frameCount, bezierCount, ...propertyIds) {
      super(frameCount, ...propertyIds);
      this.curves = Utils.newFloatArray(
        frameCount + bezierCount * 18
        /*BEZIER_SIZE*/
      );
      this.curves[frameCount - 1] = 1;
    }
    /** Sets the specified key frame to linear interpolation. */
    setLinear(frame) {
      this.curves[frame] = 0;
    }
    /** Sets the specified key frame to stepped interpolation. */
    setStepped(frame) {
      this.curves[frame] = 1;
    }
    /** Shrinks the storage for Bezier curves, for use when `bezierCount` (specified in the constructor) was larger
     * than the actual number of Bezier curves. */
    shrink(bezierCount) {
      const size = this.getFrameCount() + bezierCount * 18;
      if (this.curves.length > size) {
        const newCurves = Utils.newFloatArray(size);
        Utils.arrayCopy(this.curves, 0, newCurves, 0, size);
        this.curves = newCurves;
      }
    }
    /** Stores the segments for the specified Bezier curve. For timelines that modify multiple values, there may be more than
     * one curve per frame.
     * @param bezier The ordinal of this Bezier curve for this timeline, between 0 and `bezierCount - 1` (specified
     *           in the constructor), inclusive.
     * @param frame Between 0 and `frameCount - 1`, inclusive.
     * @param value The index of the value for this frame that this curve is used for.
     * @param time1 The time for the first key.
     * @param value1 The value for the first key.
     * @param cx1 The time for the first Bezier handle.
     * @param cy1 The value for the first Bezier handle.
     * @param cx2 The time of the second Bezier handle.
     * @param cy2 The value for the second Bezier handle.
     * @param time2 The time for the second key.
     * @param value2 The value for the second key. */
    setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2) {
      const curves = this.curves;
      let i = this.getFrameCount() + bezier * 18;
      if (value === 0) curves[frame] = 2 + i;
      const tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = (value1 - cy1 * 2 + cy2) * 0.03;
      const dddx = ((cx1 - cx2) * 3 - time1 + time2) * 6e-3, dddy = ((cy1 - cy2) * 3 - value1 + value2) * 6e-3;
      let ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
      let dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = (cy1 - value1) * 0.3 + tmpy + dddy * 0.16666667;
      let x = time1 + dx, y = value1 + dy;
      for (let n = i + 18; i < n; i += 2) {
        curves[i] = x;
        curves[i + 1] = y;
        dx += ddx;
        dy += ddy;
        ddx += dddx;
        ddy += dddy;
        x += dx;
        y += dy;
      }
    }
    /** Returns the Bezier interpolated value for the specified time.
     * @param frameIndex The index into {@link frames} for the values of the frame before `time`.
     * @param valueOffset The offset from `frameIndex` to the value this curve is used for.
     * @param i The index of the Bezier segments. See {@link getCurveType}. */
    getBezierValue(time, frameIndex, valueOffset, i) {
      const curves = this.curves;
      if (curves[i] > time) {
        const x2 = this.frames[frameIndex], y2 = this.frames[frameIndex + valueOffset];
        return y2 + (time - x2) / (curves[i] - x2) * (curves[i + 1] - y2);
      }
      const n = i + 18;
      for (i += 2; i < n; i += 2) {
        if (curves[i] >= time) {
          const x2 = curves[i - 2], y2 = curves[i - 1];
          return y2 + (time - x2) / (curves[i] - x2) * (curves[i + 1] - y2);
        }
      }
      frameIndex += this.getFrameEntries();
      const x = curves[n - 2], y = curves[n - 1];
      return y + (time - x) / (this.frames[frameIndex] - x) * (this.frames[frameIndex + valueOffset] - y);
    }
  };
  var CurveTimeline1 = class _CurveTimeline1 extends CurveTimeline {
    constructor(frameCount, bezierCount, propertyId) {
      super(frameCount, bezierCount, propertyId);
    }
    getFrameEntries() {
      return 2;
    }
    /** Sets the time and value for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame, time, value) {
      frame <<= 1;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*VALUE*/
      ] = value;
    }
    /** Returns the interpolated value for the specified time. */
    getCurveValue(time) {
      const frames = this.frames;
      let i = frames.length - 2;
      for (let ii = 2; ii <= i; ii += 2) {
        if (frames[ii] > time) {
          i = ii - 2;
          break;
        }
      }
      const curveType = this.curves[i >> 1];
      switch (curveType) {
        case 0: {
          const before = frames[i], value = frames[
            i + 1
            /*VALUE*/
          ];
          return value + (time - before) / (frames[
            i + 2
            /*ENTRIES*/
          ] - before) * (frames[
            i + 2 + 1
            /*VALUE*/
          ] - value);
        }
        case 1:
          return frames[
            i + 1
            /*VALUE*/
          ];
      }
      return this.getBezierValue(
        time,
        i,
        1,
        curveType - 2
        /*BEZIER*/
      );
    }
    /** Returns the interpolated value for properties relative to the setup value. The timeline value is added to the setup
     * value, rather than replacing it.
     *
     * See {@link Timeline.apply}.
     * @param current The current value for the property.
     * @param setup The setup value for the property. */
    getRelativeValue(time, alpha, from, add, current, setup) {
      if (time < this.frames[0]) return _CurveTimeline1.beforeFirstKey(from, alpha, current, setup);
      const value = this.getCurveValue(time);
      return from === 1 /* setup */ ? setup + value * alpha : current + (add ? value : value + setup - current) * alpha;
    }
    getAbsoluteValue(time, alpha, from, add, current, setup, value) {
      if (value === void 0)
        return this.getAbsoluteValue1(time, alpha, from, add, current, setup);
      else
        return this.getAbsoluteValue2(time, alpha, from, add, current, setup, value);
    }
    getAbsoluteValue1(time, alpha, from, add, current, setup) {
      if (time < this.frames[0]) return _CurveTimeline1.beforeFirstKey(from, alpha, current, setup);
      const value = this.getCurveValue(time);
      return from === 1 /* setup */ ? setup + (add ? value : value - setup) * alpha : current + (add ? value : value - current) * alpha;
    }
    getAbsoluteValue2(time, alpha, from, add, current, setup, value) {
      if (time < this.frames[0]) return _CurveTimeline1.beforeFirstKey(from, alpha, current, setup);
      return from === 1 /* setup */ ? setup + (add ? value : value - setup) * alpha : current + (add ? value : value - current) * alpha;
    }
    /** Returns the interpolated value for scale properties. The timeline and setup values are multiplied and sign adjusted.
     *
     * See {@link Timeline.apply}.
     * @param current The current value for the property.
     * @param setup The setup value for the property. */
    getScaleValue(time, alpha, from, add, out, current, setup) {
      if (time < this.frames[0]) return _CurveTimeline1.beforeFirstKey(from, alpha, current, setup);
      const value = this.getCurveValue(time) * setup;
      if (alpha === 1 && !add) return value;
      let base = from === 1 /* setup */ ? setup : current;
      if (add) return base + (value - setup) * alpha;
      if (out) return base + (Math.abs(value) * Math.sign(base) - base) * alpha;
      base = Math.abs(base) * Math.sign(value);
      return base + (value - base) * alpha;
    }
    static beforeFirstKey(from, alpha, current, setup) {
      switch (from) {
        case 1 /* setup */:
          return setup;
        case 2 /* first */:
          return current + (setup - current) * alpha;
        case 0 /* current */:
          return current;
      }
    }
  };
  function isBoneTimeline(obj) {
    return typeof obj === "object" && obj !== null && typeof obj.boneIndex === "number";
  }
  var BoneTimeline1 = class extends CurveTimeline1 {
    boneIndex;
    constructor(frameCount, bezierCount, boneIndex, property) {
      super(frameCount, bezierCount, `${property}|${boneIndex}`);
      this.boneIndex = boneIndex;
      this.additive = true;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const bone = skeleton.bones[this.boneIndex];
      if (bone.active)
        this.apply1(appliedPose ? bone.appliedPose : bone.pose, bone.data.setupPose, time, alpha, from, add, out);
    }
  };
  var BoneTimeline2 = class extends CurveTimeline {
    boneIndex;
    /** @param bezierCount The maximum number of Bezier curves. See {@link shrink}.
     * @param propertyIds Unique identifiers for the properties the timeline modifies. */
    constructor(frameCount, bezierCount, boneIndex, property1, property2) {
      super(frameCount, bezierCount, `${property1}|${boneIndex}`, `${property2}|${boneIndex}`);
      this.boneIndex = boneIndex;
      this.additive = true;
    }
    getFrameEntries() {
      return 3;
    }
    /** Sets the time and values for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame, time, value1, value2) {
      frame *= 3;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*VALUE1*/
      ] = value1;
      this.frames[
        frame + 2
        /*VALUE2*/
      ] = value2;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const bone = skeleton.bones[this.boneIndex];
      if (bone.active)
        this.apply1(appliedPose ? bone.appliedPose : bone.pose, bone.data.setupPose, time, alpha, from, add, out);
    }
  };
  var RotateTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 0 /* rotate */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.rotation = this.getRelativeValue(time, alpha, from, add, pose.rotation, setup.rotation);
    }
  };
  var TranslateTimeline = class extends BoneTimeline2 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 1 /* x */, 2 /* y */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      const frames = this.frames;
      if (time < frames[0]) {
        switch (from) {
          case 1 /* setup */:
            pose.x = setup.x;
            pose.y = setup.y;
            break;
          case 2 /* first */:
            pose.x += (setup.x - pose.x) * alpha;
            pose.y += (setup.y - pose.y) * alpha;
            break;
        }
        return;
      }
      let x = 0, y = 0;
      const i = Timeline.search(
        frames,
        time,
        3
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 3
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          x = frames[
            i + 1
            /*VALUE1*/
          ];
          y = frames[
            i + 2
            /*VALUE2*/
          ];
          const t = (time - before) / (frames[
            i + 3
            /*ENTRIES*/
          ] - before);
          x += (frames[
            i + 3 + 1
            /*VALUE1*/
          ] - x) * t;
          y += (frames[
            i + 3 + 2
            /*VALUE2*/
          ] - y) * t;
          break;
        }
        case 1:
          x = frames[
            i + 1
            /*VALUE1*/
          ];
          y = frames[
            i + 2
            /*VALUE2*/
          ];
          break;
        default:
          x = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          y = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
      }
      if (from === 1 /* setup */) {
        pose.x = setup.x + x * alpha;
        pose.y = setup.y + y * alpha;
      } else if (add) {
        pose.x += x * alpha;
        pose.y += y * alpha;
      } else {
        pose.x += (setup.x + x - pose.x) * alpha;
        pose.y += (setup.y + y - pose.y) * alpha;
      }
    }
  };
  var TranslateXTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 1 /* x */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.x = this.getRelativeValue(time, alpha, from, add, pose.x, setup.x);
    }
  };
  var TranslateYTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 2 /* y */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.y = this.getRelativeValue(time, alpha, from, add, pose.y, setup.y);
    }
  };
  var ScaleTimeline = class extends BoneTimeline2 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 3 /* scaleX */, 4 /* scaleY */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      const frames = this.frames;
      if (time < frames[0]) {
        switch (from) {
          case 1 /* setup */:
            pose.scaleX = setup.scaleX;
            pose.scaleY = setup.scaleY;
            break;
          case 2 /* first */:
            pose.scaleX += (setup.scaleX - pose.scaleX) * alpha;
            pose.scaleY += (setup.scaleY - pose.scaleY) * alpha;
            break;
        }
        return;
      }
      let x, y;
      const i = Timeline.search(
        frames,
        time,
        3
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 3
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          x = frames[
            i + 1
            /*VALUE1*/
          ];
          y = frames[
            i + 2
            /*VALUE2*/
          ];
          const t = (time - before) / (frames[
            i + 3
            /*ENTRIES*/
          ] - before);
          x += (frames[
            i + 3 + 1
            /*VALUE1*/
          ] - x) * t;
          y += (frames[
            i + 3 + 2
            /*VALUE2*/
          ] - y) * t;
          break;
        }
        case 1:
          x = frames[
            i + 1
            /*VALUE1*/
          ];
          y = frames[
            i + 2
            /*VALUE2*/
          ];
          break;
        default:
          x = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          y = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
      }
      x *= setup.scaleX;
      y *= setup.scaleY;
      if (alpha === 1 && !add) {
        pose.scaleX = x;
        pose.scaleY = y;
      } else {
        let bx = 0, by = 0;
        if (from === 1 /* setup */) {
          bx = setup.scaleX;
          by = setup.scaleY;
        } else {
          bx = pose.scaleX;
          by = pose.scaleY;
        }
        if (add) {
          pose.scaleX = bx + (x - setup.scaleX) * alpha;
          pose.scaleY = by + (y - setup.scaleY) * alpha;
        } else if (out) {
          pose.scaleX = bx + (Math.abs(x) * Math.sign(bx) - bx) * alpha;
          pose.scaleY = by + (Math.abs(y) * Math.sign(by) - by) * alpha;
        } else {
          bx = Math.abs(bx) * Math.sign(x);
          by = Math.abs(by) * Math.sign(y);
          pose.scaleX = bx + (x - bx) * alpha;
          pose.scaleY = by + (y - by) * alpha;
        }
      }
    }
  };
  var ScaleXTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 3 /* scaleX */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.scaleX = this.getScaleValue(time, alpha, from, add, out, pose.scaleX, setup.scaleX);
    }
  };
  var ScaleYTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 4 /* scaleY */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.scaleY = this.getScaleValue(time, alpha, from, add, out, pose.scaleY, setup.scaleY);
    }
  };
  var ShearTimeline = class extends BoneTimeline2 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 5 /* shearX */, 6 /* shearY */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      const frames = this.frames;
      if (time < frames[0]) {
        switch (from) {
          case 1 /* setup */:
            pose.shearX = setup.shearX;
            pose.shearY = setup.shearY;
            break;
          case 2 /* first */:
            pose.shearX += (setup.shearX - pose.shearX) * alpha;
            pose.shearY += (setup.shearY - pose.shearY) * alpha;
            break;
        }
        return;
      }
      let x = 0, y = 0;
      const i = Timeline.search(
        frames,
        time,
        3
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 3
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          x = frames[
            i + 1
            /*VALUE1*/
          ];
          y = frames[
            i + 2
            /*VALUE2*/
          ];
          const t = (time - before) / (frames[
            i + 3
            /*ENTRIES*/
          ] - before);
          x += (frames[
            i + 3 + 1
            /*VALUE1*/
          ] - x) * t;
          y += (frames[
            i + 3 + 2
            /*VALUE2*/
          ] - y) * t;
          break;
        }
        case 1:
          x = frames[
            i + 1
            /*VALUE1*/
          ];
          y = frames[
            i + 2
            /*VALUE2*/
          ];
          break;
        default:
          x = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          y = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
      }
      if (from === 1 /* setup */) {
        pose.shearX = setup.shearX + x * alpha;
        pose.shearY = setup.shearY + y * alpha;
      } else if (add) {
        pose.shearX += x * alpha;
        pose.shearY += y * alpha;
      } else {
        pose.shearX += (setup.shearX + x - pose.shearX) * alpha;
        pose.shearY += (setup.shearY + y - pose.shearY) * alpha;
      }
    }
  };
  var ShearXTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 5 /* shearX */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.shearX = this.getRelativeValue(time, alpha, from, add, pose.shearX, setup.shearX);
    }
  };
  var ShearYTimeline = class extends BoneTimeline1 {
    constructor(frameCount, bezierCount, boneIndex) {
      super(frameCount, bezierCount, boneIndex, 6 /* shearY */);
    }
    apply1(pose, setup, time, alpha, from, add, out) {
      pose.shearY = this.getRelativeValue(time, alpha, from, add, pose.shearY, setup.shearY);
    }
  };
  var InheritTimeline = class extends Timeline {
    boneIndex;
    constructor(frameCount, boneIndex) {
      super(frameCount, `${7 /* inherit */}|${boneIndex}`);
      this.boneIndex = boneIndex;
      this.instant = true;
    }
    getFrameEntries() {
      return 2;
    }
    /** Sets the inherit transform mode for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame, time, inherit) {
      frame *= 2;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*INHERIT*/
      ] = inherit;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const bone = skeleton.bones[this.boneIndex];
      if (!bone.active) return;
      const pose = appliedPose ? bone.appliedPose : bone.pose;
      if (out) {
        if (from !== 0 /* current */) pose.inherit = bone.data.setupPose.inherit;
      } else {
        const frames = this.frames;
        if (time < frames[0]) {
          if (from !== 0 /* current */) pose.inherit = bone.data.setupPose.inherit;
        } else
          pose.inherit = this.frames[
            Timeline.search(
              frames,
              time,
              2
              /*ENTRIES*/
            ) + 1
            /*INHERIT*/
          ];
      }
    }
  };
  var SlotCurveTimeline = class extends CurveTimeline {
    slotIndex;
    constructor(frameCount, bezierCount, slotIndex, ...propertyIds) {
      super(frameCount, bezierCount, ...propertyIds);
      this.slotIndex = slotIndex;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const slot = skeleton.slots[this.slotIndex];
      if (slot.bone.active) this.apply1(slot, appliedPose ? slot.appliedPose : slot.pose, time, alpha, from, add);
    }
  };
  var RGBATimeline = class extends SlotCurveTimeline {
    constructor(frameCount, bezierCount, slotIndex) {
      super(
        frameCount,
        bezierCount,
        slotIndex,
        //
        `${8 /* rgb */}|${slotIndex}`,
        //
        `${9 /* alpha */}|${slotIndex}`
      );
    }
    getFrameEntries() {
      return 5;
    }
    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame(frame, time, r, g, b, a) {
      frame *= 5;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*R*/
      ] = r;
      this.frames[
        frame + 2
        /*G*/
      ] = g;
      this.frames[
        frame + 3
        /*B*/
      ] = b;
      this.frames[
        frame + 4
        /*A*/
      ] = a;
    }
    apply1(slot, pose, time, alpha, from, add) {
      const color = pose.color;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = slot.data.setupPose.color;
        switch (from) {
          case 1 /* setup */:
            color.setFromColor(setup);
            break;
          case 2 /* first */:
            color.add(
              (setup.r - color.r) * alpha,
              (setup.g - color.g) * alpha,
              (setup.b - color.b) * alpha,
              (setup.a - color.a) * alpha
            );
            break;
        }
        return;
      }
      let r = 0, g = 0, b = 0, a = 0;
      const i = Timeline.search(
        frames,
        time,
        5
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 5
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          a = frames[
            i + 4
            /*A*/
          ];
          const t = (time - before) / (frames[
            i + 5
            /*ENTRIES*/
          ] - before);
          r += (frames[
            i + 5 + 1
            /*R*/
          ] - r) * t;
          g += (frames[
            i + 5 + 2
            /*G*/
          ] - g) * t;
          b += (frames[
            i + 5 + 3
            /*B*/
          ] - b) * t;
          a += (frames[
            i + 5 + 4
            /*A*/
          ] - a) * t;
          break;
        }
        case 1:
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          a = frames[
            i + 4
            /*A*/
          ];
          break;
        default:
          r = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          g = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
          b = this.getBezierValue(
            time,
            i,
            3,
            curveType + 18 * 2 - 2
            /*BEZIER*/
          );
          a = this.getBezierValue(
            time,
            i,
            4,
            curveType + 18 * 3 - 2
            /*BEZIER*/
          );
      }
      if (alpha === 1)
        color.set(r, g, b, a);
      else {
        if (from === 1 /* setup */) {
          const setup = slot.data.setupPose.color;
          color.set(
            setup.r + (r - setup.r) * alpha,
            setup.g + (g - setup.g) * alpha,
            setup.b + (b - setup.b) * alpha,
            setup.a + (a - setup.a) * alpha
          );
        } else
          color.add((r - color.r) * alpha, (g - color.g) * alpha, (b - color.b) * alpha, (a - color.a) * alpha);
      }
    }
  };
  var RGBTimeline = class extends SlotCurveTimeline {
    constructor(frameCount, bezierCount, slotIndex) {
      super(frameCount, bezierCount, slotIndex, `${8 /* rgb */}|${slotIndex}`);
    }
    getFrameEntries() {
      return 4;
    }
    /** Sets the time in seconds, red, green, blue, and alpha for the specified key frame. */
    setFrame(frame, time, r, g, b) {
      frame <<= 2;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*R*/
      ] = r;
      this.frames[
        frame + 2
        /*G*/
      ] = g;
      this.frames[
        frame + 3
        /*B*/
      ] = b;
    }
    apply1(slot, pose, time, alpha, from, add) {
      const color = pose.color;
      let r = 0, g = 0, b = 0;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = slot.data.setupPose.color;
        switch (from) {
          case 1 /* setup */: {
            color.r = setup.r;
            color.g = setup.g;
            color.b = setup.b;
            break;
          }
          case 2 /* first */: {
            color.r += (setup.r - color.r) * alpha;
            color.g += (setup.g - color.g) * alpha;
            color.b += (setup.b - color.b) * alpha;
            break;
          }
        }
        return;
      }
      const i = Timeline.search(
        frames,
        time,
        4
        /*ENTRIES*/
      );
      const curveType = this.curves[i >> 2];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          const t = (time - before) / (frames[
            i + 4
            /*ENTRIES*/
          ] - before);
          r += (frames[
            i + 4 + 1
            /*R*/
          ] - r) * t;
          g += (frames[
            i + 4 + 2
            /*G*/
          ] - g) * t;
          b += (frames[
            i + 4 + 3
            /*B*/
          ] - b) * t;
          break;
        }
        case 1:
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          break;
        default:
          r = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          g = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
          b = this.getBezierValue(
            time,
            i,
            3,
            curveType + 18 * 2 - 2
            /*BEZIER*/
          );
      }
      if (alpha !== 1) {
        if (from === 1 /* setup */) {
          const setup = slot.data.setupPose.color;
          r = setup.r + (r - setup.r) * alpha;
          g = setup.g + (g - setup.g) * alpha;
          b = setup.b + (b - setup.b) * alpha;
        } else {
          r = color.r + (r - color.r) * alpha;
          g = color.g + (g - color.g) * alpha;
          b = color.b + (b - color.b) * alpha;
        }
      }
      color.r = r < 0 ? 0 : r > 1 ? 1 : r;
      color.g = g < 0 ? 0 : g > 1 ? 1 : g;
      color.b = b < 0 ? 0 : b > 1 ? 1 : b;
    }
  };
  var AlphaTimeline = class extends CurveTimeline1 {
    slotIndex = 0;
    constructor(frameCount, bezierCount, slotIndex) {
      super(frameCount, bezierCount, `${9 /* alpha */}|${slotIndex}`);
      this.slotIndex = slotIndex;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const slot = skeleton.slots[this.slotIndex];
      if (!slot.bone.active) return;
      const color = (appliedPose ? slot.appliedPose : slot.pose).color;
      let a = 0;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = slot.data.setupPose.color.a;
        switch (from) {
          case 1 /* setup */:
            color.a = setup;
            break;
          case 2 /* first */:
            color.a += (setup - color.a) * alpha;
            break;
        }
        return;
      }
      a = this.getCurveValue(time);
      if (alpha !== 1) {
        if (from === 1 /* setup */) {
          const setup = slot.data.setupPose.color;
          a = setup.a + (a - setup.a) * alpha;
        } else
          a = color.a + (a - color.a) * alpha;
      }
      color.a = a < 0 ? 0 : a > 1 ? 1 : a;
    }
  };
  var RGBA2Timeline = class extends SlotCurveTimeline {
    constructor(frameCount, bezierCount, slotIndex) {
      super(
        frameCount,
        bezierCount,
        slotIndex,
        //
        `${8 /* rgb */}|${slotIndex}`,
        //
        `${9 /* alpha */}|${slotIndex}`,
        //
        `${10 /* rgb2 */}|${slotIndex}`
      );
    }
    getFrameEntries() {
      return 8;
    }
    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame(frame, time, r, g, b, a, r2, g2, b2) {
      frame <<= 3;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*R*/
      ] = r;
      this.frames[
        frame + 2
        /*G*/
      ] = g;
      this.frames[
        frame + 3
        /*B*/
      ] = b;
      this.frames[
        frame + 4
        /*A*/
      ] = a;
      this.frames[
        frame + 5
        /*R2*/
      ] = r2;
      this.frames[
        frame + 6
        /*G2*/
      ] = g2;
      this.frames[
        frame + 7
        /*B2*/
      ] = b2;
    }
    apply1(slot, pose, time, alpha, from, add) {
      const light = pose.color, dark = pose.darkColor;
      let r2 = 0, g2 = 0, b2 = 0;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = slot.data.setupPose;
        const setupLight = setup.color, setupDark = setup.darkColor;
        switch (from) {
          case 1 /* setup */: {
            light.setFromColor(setupLight);
            dark.r = setupDark.r;
            dark.g = setupDark.g;
            dark.b = setupDark.b;
            break;
          }
          case 2 /* first */: {
            light.add(
              (setupLight.r - light.r) * alpha,
              (setupLight.g - light.g) * alpha,
              (setupLight.b - light.b) * alpha,
              (setupLight.a - light.a) * alpha
            );
            dark.r += (setupDark.r - dark.r) * alpha;
            dark.g += (setupDark.g - dark.g) * alpha;
            dark.b += (setupDark.b - dark.b) * alpha;
            break;
          }
        }
        return;
      }
      let r = 0, g = 0, b = 0, a = 0;
      const i = Timeline.search(
        frames,
        time,
        8
        /*ENTRIES*/
      );
      const curveType = this.curves[i >> 3];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          a = frames[
            i + 4
            /*A*/
          ];
          r2 = frames[
            i + 5
            /*R2*/
          ];
          g2 = frames[
            i + 6
            /*G2*/
          ];
          b2 = frames[
            i + 7
            /*B2*/
          ];
          const t = (time - before) / (frames[
            i + 8
            /*ENTRIES*/
          ] - before);
          r += (frames[
            i + 8 + 1
            /*R*/
          ] - r) * t;
          g += (frames[
            i + 8 + 2
            /*G*/
          ] - g) * t;
          b += (frames[
            i + 8 + 3
            /*B*/
          ] - b) * t;
          a += (frames[
            i + 8 + 4
            /*A*/
          ] - a) * t;
          r2 += (frames[
            i + 8 + 5
            /*R2*/
          ] - r2) * t;
          g2 += (frames[
            i + 8 + 6
            /*G2*/
          ] - g2) * t;
          b2 += (frames[
            i + 8 + 7
            /*B2*/
          ] - b2) * t;
          break;
        }
        case 1:
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          a = frames[
            i + 4
            /*A*/
          ];
          r2 = frames[
            i + 5
            /*R2*/
          ];
          g2 = frames[
            i + 6
            /*G2*/
          ];
          b2 = frames[
            i + 7
            /*B2*/
          ];
          break;
        default:
          r = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          g = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
          b = this.getBezierValue(
            time,
            i,
            3,
            curveType + 18 * 2 - 2
            /*BEZIER*/
          );
          a = this.getBezierValue(
            time,
            i,
            4,
            curveType + 18 * 3 - 2
            /*BEZIER*/
          );
          r2 = this.getBezierValue(
            time,
            i,
            5,
            curveType + 18 * 4 - 2
            /*BEZIER*/
          );
          g2 = this.getBezierValue(
            time,
            i,
            6,
            curveType + 18 * 5 - 2
            /*BEZIER*/
          );
          b2 = this.getBezierValue(
            time,
            i,
            7,
            curveType + 18 * 6 - 2
            /*BEZIER*/
          );
      }
      if (alpha === 1)
        light.set(r, g, b, a);
      else if (from === 1 /* setup */) {
        const setupPose = slot.data.setupPose;
        let setup = setupPose.color;
        light.set(
          setup.r + (r - setup.r) * alpha,
          setup.g + (g - setup.g) * alpha,
          setup.b + (b - setup.b) * alpha,
          setup.a + (a - setup.a) * alpha
        );
        setup = setupPose.darkColor;
        r2 = setup.r + (r2 - setup.r) * alpha;
        g2 = setup.g + (g2 - setup.g) * alpha;
        b2 = setup.b + (b2 - setup.b) * alpha;
      } else {
        light.add((r - light.r) * alpha, (g - light.g) * alpha, (b - light.b) * alpha, (a - light.a) * alpha);
        r2 = dark.r + (r2 - dark.r) * alpha;
        g2 = dark.g + (g2 - dark.g) * alpha;
        b2 = dark.b + (b2 - dark.b) * alpha;
      }
      dark.r = r2 < 0 ? 0 : r2 > 1 ? 1 : r2;
      dark.g = g2 < 0 ? 0 : g2 > 1 ? 1 : g2;
      dark.b = b2 < 0 ? 0 : b2 > 1 ? 1 : b2;
    }
  };
  var RGB2Timeline = class extends SlotCurveTimeline {
    constructor(frameCount, bezierCount, slotIndex) {
      super(
        frameCount,
        bezierCount,
        slotIndex,
        //
        `${8 /* rgb */}|${slotIndex}`,
        //
        `${10 /* rgb2 */}|${slotIndex}`
      );
    }
    getFrameEntries() {
      return 7;
    }
    /** Sets the time in seconds, light, and dark colors for the specified key frame. */
    setFrame(frame, time, r, g, b, r2, g2, b2) {
      frame *= 7;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*R*/
      ] = r;
      this.frames[
        frame + 2
        /*G*/
      ] = g;
      this.frames[
        frame + 3
        /*B*/
      ] = b;
      this.frames[
        frame + 4
        /*R2*/
      ] = r2;
      this.frames[
        frame + 5
        /*G2*/
      ] = g2;
      this.frames[
        frame + 6
        /*B2*/
      ] = b2;
    }
    apply1(slot, pose, time, alpha, from, add) {
      const light = pose.color, dark = pose.darkColor;
      let r = 0, g = 0, b = 0, r2 = 0, g2 = 0, b2 = 0;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = slot.data.setupPose;
        const setupLight = setup.color, setupDark = setup.darkColor;
        switch (from) {
          case 1 /* setup */:
            light.r = setupLight.r;
            light.g = setupLight.g;
            light.b = setupLight.b;
            dark.r = setupDark.r;
            dark.g = setupDark.g;
            dark.b = setupDark.b;
            break;
          case 2 /* first */:
            light.r += (setupLight.r - light.r) * alpha;
            light.g += (setupLight.g - light.g) * alpha;
            light.b += (setupLight.b - light.b) * alpha;
            dark.r += (setupDark.r - dark.r) * alpha;
            dark.g += (setupDark.g - dark.g) * alpha;
            dark.b += (setupDark.b - dark.b) * alpha;
            break;
        }
        return;
      }
      const i = Timeline.search(
        frames,
        time,
        7
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 7
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          r2 = frames[
            i + 4
            /*R2*/
          ];
          g2 = frames[
            i + 5
            /*G2*/
          ];
          b2 = frames[
            i + 6
            /*B2*/
          ];
          const t = (time - before) / (frames[
            i + 7
            /*ENTRIES*/
          ] - before);
          r += (frames[
            i + 7 + 1
            /*R*/
          ] - r) * t;
          g += (frames[
            i + 7 + 2
            /*G*/
          ] - g) * t;
          b += (frames[
            i + 7 + 3
            /*B*/
          ] - b) * t;
          r2 += (frames[
            i + 7 + 4
            /*R2*/
          ] - r2) * t;
          g2 += (frames[
            i + 7 + 5
            /*G2*/
          ] - g2) * t;
          b2 += (frames[
            i + 7 + 6
            /*B2*/
          ] - b2) * t;
          break;
        }
        case 1:
          r = frames[
            i + 1
            /*R*/
          ];
          g = frames[
            i + 2
            /*G*/
          ];
          b = frames[
            i + 3
            /*B*/
          ];
          r2 = frames[
            i + 4
            /*R2*/
          ];
          g2 = frames[
            i + 5
            /*G2*/
          ];
          b2 = frames[
            i + 6
            /*B2*/
          ];
          break;
        default:
          r = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          g = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
          b = this.getBezierValue(
            time,
            i,
            3,
            curveType + 18 * 2 - 2
            /*BEZIER*/
          );
          r2 = this.getBezierValue(
            time,
            i,
            4,
            curveType + 18 * 3 - 2
            /*BEZIER*/
          );
          g2 = this.getBezierValue(
            time,
            i,
            5,
            curveType + 18 * 4 - 2
            /*BEZIER*/
          );
          b2 = this.getBezierValue(
            time,
            i,
            6,
            curveType + 18 * 5 - 2
            /*BEZIER*/
          );
      }
      if (alpha !== 1) {
        if (from === 1 /* setup */) {
          const setupPose = slot.data.setupPose;
          let setup = setupPose.color;
          r = setup.r + (r - setup.r) * alpha;
          g = setup.g + (g - setup.g) * alpha;
          b = setup.b + (b - setup.b) * alpha;
          setup = setupPose.darkColor;
          r2 = setup.r + (r2 - setup.r) * alpha;
          g2 = setup.g + (g2 - setup.g) * alpha;
          b2 = setup.b + (b2 - setup.b) * alpha;
        } else {
          r = light.r + (r - light.r) * alpha;
          g = light.g + (g - light.g) * alpha;
          b = light.b + (b - light.b) * alpha;
          r2 = dark.r + (r2 - dark.r) * alpha;
          g2 = dark.g + (g2 - dark.g) * alpha;
          b2 = dark.b + (b2 - dark.b) * alpha;
        }
      }
      light.r = r < 0 ? 0 : r > 1 ? 1 : r;
      light.g = g < 0 ? 0 : g > 1 ? 1 : g;
      light.b = b < 0 ? 0 : b > 1 ? 1 : b;
      dark.r = r2 < 0 ? 0 : r2 > 1 ? 1 : r2;
      dark.g = g2 < 0 ? 0 : g2 > 1 ? 1 : g2;
      dark.b = b2 < 0 ? 0 : b2 > 1 ? 1 : b2;
    }
  };
  var AttachmentTimeline = class extends Timeline {
    slotIndex = 0;
    /** The attachment name for each key frame. May contain null values to clear the attachment. */
    attachmentNames;
    constructor(frameCount, slotIndex) {
      super(frameCount, `${11 /* attachment */}|${slotIndex}`);
      this.slotIndex = slotIndex;
      this.attachmentNames = new Array(frameCount);
      this.instant = true;
    }
    getFrameCount() {
      return this.frames.length;
    }
    /** Sets the time in seconds and the attachment name for the specified key frame. */
    setFrame(frame, time, attachmentName) {
      this.frames[frame] = time;
      this.attachmentNames[frame] = attachmentName;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const slot = skeleton.slots[this.slotIndex];
      if (!slot.bone.active) return;
      const pose = appliedPose ? slot.appliedPose : slot.pose;
      if (out || time < this.frames[0]) {
        if (from !== 0 /* current */) this.setAttachment(skeleton, pose, slot.data.attachmentName);
      } else
        this.setAttachment(skeleton, pose, this.attachmentNames[Timeline.search(this.frames, time)]);
    }
    setAttachment(skeleton, pose, attachmentName) {
      pose.setAttachment(!attachmentName ? null : skeleton.getAttachment(this.slotIndex, attachmentName));
    }
  };
  var DeformTimeline = class extends CurveTimeline {
    slotIndex;
    /** The attachment that will be deformed.
     *
     * See {@link VertexAttachment.getTimelineAttachment}. */
    attachment;
    /** The vertices for each key frame. */
    vertices;
    constructor(frameCount, bezierCount, slotIndex, attachment) {
      super(frameCount, bezierCount, `${12 /* deform */}|${slotIndex}|${attachment.id}`);
      this.slotIndex = slotIndex;
      this.attachment = attachment;
      this.vertices = new Array(frameCount);
      this.additive = true;
    }
    getFrameCount() {
      return this.frames.length;
    }
    /** Sets the time and vertices for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds.
     * @param vertices Vertex positions for an unweighted VertexAttachment, or deform offsets if it has weights. */
    setFrame(frame, time, vertices) {
      this.frames[frame] = time;
      this.vertices[frame] = vertices;
    }
    /** @param value1 Ignored (0 is used for a deform timeline).
     * @param value2 Ignored (1 is used for a deform timeline). */
    setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2) {
      const curves = this.curves;
      let i = this.getFrameCount() + bezier * 18;
      if (value === 0) curves[frame] = 2 + i;
      const tmpx = (time1 - cx1 * 2 + cx2) * 0.03, tmpy = cy2 * 0.03 - cy1 * 0.06;
      const dddx = ((cx1 - cx2) * 3 - time1 + time2) * 6e-3, dddy = (cy1 - cy2 + 0.33333333) * 0.018;
      let ddx = tmpx * 2 + dddx, ddy = tmpy * 2 + dddy;
      let dx = (cx1 - time1) * 0.3 + tmpx + dddx * 0.16666667, dy = cy1 * 0.3 + tmpy + dddy * 0.16666667;
      let x = time1 + dx, y = dy;
      for (let n = i + 18; i < n; i += 2) {
        curves[i] = x;
        curves[i + 1] = y;
        dx += ddx;
        dy += ddy;
        ddx += dddx;
        ddy += dddy;
        x += dx;
        y += dy;
      }
    }
    getCurvePercent(time, frame) {
      const curves = this.curves;
      let i = curves[frame];
      switch (i) {
        case 0: {
          const x2 = this.frames[frame];
          return (time - x2) / (this.frames[frame + this.getFrameEntries()] - x2);
        }
        case 1:
          return 0;
      }
      i -= 2;
      if (curves[i] > time) {
        const x2 = this.frames[frame];
        return curves[i + 1] * (time - x2) / (curves[i] - x2);
      }
      const n = i + 18;
      for (i += 2; i < n; i += 2) {
        if (curves[i] >= time) {
          const x2 = curves[i - 2], y2 = curves[i - 1];
          return y2 + (time - x2) / (curves[i] - x2) * (curves[i + 1] - y2);
        }
      }
      const x = curves[n - 2], y = curves[n - 1];
      return y + (1 - y) * (time - x) / (this.frames[frame + this.getFrameEntries()] - x);
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const slots = skeleton.slots;
      if (!this.attachment.isTimelineActive(slots, this.slotIndex, appliedPose)) return;
      const timelineSlots = this.attachment.timelineSlots;
      const frames = this.frames;
      if (time < frames[0]) {
        this.applyBeforeFirst(slots[this.slotIndex], appliedPose, alpha, from);
        for (const slotIndex of timelineSlots)
          this.applyBeforeFirst(slots[slotIndex], appliedPose, alpha, from);
        return;
      }
      let v1, v2;
      let percent;
      if (time >= frames[frames.length - 1]) {
        percent = 0;
        v1 = this.vertices[frames.length - 1];
        v2 = null;
      } else {
        const frame = Timeline.search(frames, time);
        percent = this.getCurvePercent(time, frame);
        v1 = this.vertices[frame];
        v2 = this.vertices[frame + 1];
      }
      const vertexCount = this.vertices[0].length;
      this.applyToSlot(slots[this.slotIndex], appliedPose, v1, v2, percent, vertexCount, alpha, from, add);
      for (const slotIndex of timelineSlots)
        this.applyToSlot(slots[slotIndex], appliedPose, v1, v2, percent, vertexCount, alpha, from, add);
    }
    applyBeforeFirst(slot, appliedPose, alpha, from) {
      if (!slot.bone.active) return;
      const pose = appliedPose ? slot.appliedPose : slot.pose;
      if (pose.attachment == null || pose.attachment.timelineAttachment !== this.attachment) return;
      const deformArray = pose.deform;
      if (deformArray.length === 0) from = 1 /* setup */;
      switch (from) {
        case 1 /* setup */:
          deformArray.length = 0;
          break;
        case 2 /* first */: {
          if (alpha === 1) {
            deformArray.length = 0;
            return;
          }
          const vertexCount = this.vertices[0].length;
          deformArray.length = vertexCount;
          const deform = deformArray;
          const vertexAttachment = pose.attachment;
          if (vertexAttachment.bones === null) {
            const setupVertices = vertexAttachment.vertices;
            for (let i = 0; i < vertexCount; i++)
              deform[i] += (setupVertices[i] - deform[i]) * alpha;
          } else {
            alpha = 1 - alpha;
            for (let i = 0; i < vertexCount; i++)
              deform[i] *= alpha;
          }
        }
      }
    }
    applyToSlot(slot, appliedPose, v1, v2, percent, vertexCount, alpha, from, add) {
      if (!slot.bone.active) return;
      const pose = appliedPose ? slot.appliedPose : slot.pose;
      if (pose.attachment === null || pose.attachment.timelineAttachment !== this.attachment) return;
      const vertexAttachment = pose.attachment;
      const deform = pose.deform;
      if (deform.length === 0) from = 1 /* setup */;
      const fromSetup = from === 1 /* setup */;
      deform.length = vertexCount;
      if (v2 === null) {
        if (alpha === 1) {
          if (add && !fromSetup) {
            if (!vertexAttachment.bones) {
              const setupVertices = vertexAttachment.vertices;
              for (let i = 0; i < vertexCount; i++)
                deform[i] += v1[i] - setupVertices[i];
            } else {
              for (let i = 0; i < vertexCount; i++)
                deform[i] += v1[i];
            }
          } else
            Utils.arrayCopy(v1, 0, deform, 0, vertexCount);
        } else if (fromSetup) {
          if (!vertexAttachment.bones) {
            const setupVertices = vertexAttachment.vertices;
            for (let i = 0; i < vertexCount; i++) {
              const setup = setupVertices[i];
              deform[i] = setup + (v1[i] - setup) * alpha;
            }
          } else {
            for (let i = 0; i < vertexCount; i++)
              deform[i] = v1[i] * alpha;
          }
        } else if (add) {
          if (!vertexAttachment.bones) {
            const setupVertices = vertexAttachment.vertices;
            for (let i = 0; i < vertexCount; i++)
              deform[i] += (v1[i] - setupVertices[i]) * alpha;
          } else {
            for (let i = 0; i < vertexCount; i++)
              deform[i] += v1[i] * alpha;
          }
        } else {
          for (let i = 0; i < vertexCount; i++)
            deform[i] += (v1[i] - deform[i]) * alpha;
        }
      } else {
        if (alpha === 1) {
          if (add && !fromSetup) {
            if (!vertexAttachment.bones) {
              const setupVertices = vertexAttachment.vertices;
              for (let i = 0; i < vertexCount; i++) {
                const prev = v1[i];
                deform[i] += prev + (v2[i] - prev) * percent - setupVertices[i];
              }
            } else {
              for (let i = 0; i < vertexCount; i++) {
                const prev = v1[i];
                deform[i] += prev + (v2[i] - prev) * percent;
              }
            }
          } else if (percent === 0)
            Utils.arrayCopy(v1, 0, deform, 0, vertexCount);
          else {
            for (let i = 0; i < vertexCount; i++) {
              const prev = v1[i];
              deform[i] = prev + (v2[i] - prev) * percent;
            }
          }
        } else if (fromSetup) {
          if (!vertexAttachment.bones) {
            const setupVertices = vertexAttachment.vertices;
            for (let i = 0; i < vertexCount; i++) {
              const prev = v1[i], setup = setupVertices[i];
              deform[i] = setup + (prev + (v2[i] - prev) * percent - setup) * alpha;
            }
          } else {
            for (let i = 0; i < vertexCount; i++) {
              const prev = v1[i];
              deform[i] = (prev + (v2[i] - prev) * percent) * alpha;
            }
          }
        } else if (add) {
          if (!vertexAttachment.bones) {
            const setupVertices = vertexAttachment.vertices;
            for (let i = 0; i < vertexCount; i++) {
              const prev = v1[i];
              deform[i] += (prev + (v2[i] - prev) * percent - setupVertices[i]) * alpha;
            }
          } else {
            for (let i = 0; i < vertexCount; i++) {
              const prev = v1[i];
              deform[i] += (prev + (v2[i] - prev) * percent) * alpha;
            }
          }
        } else {
          for (let i = 0; i < vertexCount; i++) {
            const prev = v1[i];
            deform[i] += (prev + (v2[i] - prev) * percent - deform[i]) * alpha;
          }
        }
      }
    }
  };
  var SequenceTimeline = class _SequenceTimeline extends Timeline {
    static ENTRIES = 3;
    static MODE = 1;
    static DELAY = 2;
    slotIndex;
    attachment;
    constructor(frameCount, slotIndex, attachment) {
      super(frameCount, `${29 /* sequence */}|${slotIndex}|${attachment.sequence.id}`);
      this.slotIndex = slotIndex;
      this.attachment = attachment;
      this.instant = true;
    }
    getFrameEntries() {
      return _SequenceTimeline.ENTRIES;
    }
    getSlotIndex() {
      return this.slotIndex;
    }
    /** The attachment for which the {@link SlotPose.sequenceIndex} will be set.
     *
     * See {@link VertexAttachment.timelineAttachment}. */
    getAttachment() {
      return this.attachment;
    }
    /** Sets the time, mode, index, and frame time for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time Seconds between frames. */
    setFrame(frame, time, mode, index, delay) {
      const frames = this.frames;
      frame *= _SequenceTimeline.ENTRIES;
      frames[frame] = time;
      frames[frame + _SequenceTimeline.MODE] = mode | index << 4;
      frames[frame + _SequenceTimeline.DELAY] = delay;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const slots = skeleton.slots;
      if (!this.attachment.isTimelineActive(slots, this.slotIndex, appliedPose)) return;
      const timelineSlots = this.attachment.timelineSlots;
      const frames = this.frames;
      if (out || time < frames[0]) {
        if (from !== 0 /* current */) {
          this.setupPose(slots[this.slotIndex], appliedPose);
          for (const slotIndex of timelineSlots)
            this.setupPose(slots[slotIndex], appliedPose);
        }
        return;
      }
      const i = Timeline.search(frames, time, _SequenceTimeline.ENTRIES);
      const before = frames[i];
      const modeAndIndex = frames[i + _SequenceTimeline.MODE];
      const delay = frames[i + _SequenceTimeline.DELAY];
      this.applyToSlot(slots[this.slotIndex], appliedPose, time, before, modeAndIndex, delay);
      for (const slotIndex of timelineSlots)
        this.applyToSlot(slots[slotIndex], appliedPose, time, before, modeAndIndex, delay);
    }
    setupPose(slot, appliedPose) {
      if (!slot.bone.active) return;
      const pose = appliedPose ? slot.appliedPose : slot.pose;
      if (pose.attachment === null || pose.attachment.timelineAttachment !== this.attachment) return;
      pose.sequenceIndex = -1;
    }
    applyToSlot(slot, appliedPose, time, before, modeAndIndex, delay) {
      if (!slot.bone.active) return;
      const pose = appliedPose ? slot.appliedPose : slot.pose;
      if (pose.attachment === null || pose.attachment.timelineAttachment !== this.attachment) return;
      let index = modeAndIndex >> 4, count = pose.attachment.sequence.regions.length;
      const mode = SequenceModeValues[modeAndIndex & 15];
      if (mode !== 0 /* hold */) {
        index += (time - before) / delay + 1e-5 | 0;
        switch (mode) {
          case 1 /* once */:
            index = Math.min(count - 1, index);
            break;
          case 2 /* loop */:
            index %= count;
            break;
          case 3 /* pingpong */: {
            const n = (count << 1) - 2;
            index = n === 0 ? 0 : index % n;
            if (index >= count) index = n - index;
            break;
          }
          case 4 /* onceReverse */:
            index = Math.max(count - 1 - index, 0);
            break;
          case 5 /* loopReverse */:
            index = count - 1 - index % count;
            break;
          case 6 /* pingpongReverse */: {
            const n = (count << 1) - 2;
            index = n === 0 ? 0 : (index + count - 1) % n;
            if (index >= count) index = n - index;
          }
        }
      }
      pose.sequenceIndex = index;
    }
  };
  var EventTimeline = class _EventTimeline extends Timeline {
    static propertyIds = [`${13 /* event */}`];
    /** The event for each key frame. */
    events;
    constructor(frameCount) {
      super(frameCount, ..._EventTimeline.propertyIds);
      this.events = new Array(frameCount);
      this.instant = true;
    }
    getFrameCount() {
      return this.frames.length;
    }
    /** Sets the time in seconds and the event for the specified key frame. */
    setFrame(frame, event) {
      this.frames[frame] = event.time;
      this.events[frame] = event;
    }
    /** Fires events for frames > `lastTime` and <= `time`. */
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      if (!firedEvents) return;
      const frames = this.frames;
      const frameCount = this.frames.length;
      if (lastTime > time) {
        this.apply(null, lastTime, Number.MAX_VALUE, firedEvents, 0, from, false, false, false);
        lastTime = -1;
      } else if (lastTime >= frames[frameCount - 1])
        return;
      if (time < frames[0]) return;
      let i = 0;
      if (lastTime < frames[0])
        i = 0;
      else {
        i = Timeline.search(frames, lastTime) + 1;
        const frameTime = frames[i];
        while (i > 0) {
          if (frames[i - 1] !== frameTime) break;
          i--;
        }
      }
      for (; i < frameCount && time >= frames[i]; i++)
        firedEvents.push(this.events[i]);
    }
  };
  var DrawOrderTimeline = class _DrawOrderTimeline extends Timeline {
    static propertyID = `${14 /* drawOrder */}`;
    static propertyIds = [_DrawOrderTimeline.propertyID];
    /** The draw order for each key frame. See {@link setFrame}. */
    drawOrders;
    constructor(frameCount) {
      super(frameCount, ..._DrawOrderTimeline.propertyIds);
      this.drawOrders = new Array(frameCount);
      this.instant = true;
    }
    getFrameCount() {
      return this.frames.length;
    }
    /** Sets the time in seconds and the draw order for the specified key frame.
     * @param drawOrder Ordered {@link Skeleton.slots} indices, or null to use setup pose
     *           draw order. */
    setFrame(frame, time, drawOrder) {
      this.frames[frame] = time;
      this.drawOrders[frame] = drawOrder;
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const pose = appliedPose ? skeleton.drawOrder.appliedPose : skeleton.drawOrder.pose;
      const setup = skeleton.slots;
      if (out || time < this.frames[0]) {
        if (from !== 0 /* current */) Utils.arrayCopy(setup, 0, pose, 0, skeleton.slots.length);
        return;
      }
      const order = this.drawOrders[Timeline.search(this.frames, time)];
      if (!order)
        Utils.arrayCopy(setup, 0, pose, 0, skeleton.slots.length);
      else {
        for (let i = 0, n = order.length; i < n; i++)
          pose[i] = setup[order[i]];
      }
    }
  };
  var DrawOrderFolderTimeline = class _DrawOrderFolderTimeline extends Timeline {
    static propertyID = `${15 /* drawOrderFolder */}`;
    slots;
    inFolder;
    drawOrders;
    /** @param slots {@link Skeleton.slots} indices controlled by this timeline, in setup order.
     * @param slotCount The maximum number of slots in the skeleton. */
    constructor(frameCount, slots, slotCount) {
      super(frameCount, ..._DrawOrderFolderTimeline.propertyIds(slots));
      this.slots = slots;
      this.drawOrders = new Array(frameCount);
      this.inFolder = new Array(slotCount);
      for (const i of slots)
        this.inFolder[i] = true;
      this.instant = true;
    }
    static propertyIds(slots) {
      const n = slots.length;
      const ids = new Array(n);
      for (let i = 0; i < n; i++)
        ids[i] = `${_DrawOrderFolderTimeline.propertyID}|${slots[i]}`;
      return ids;
    }
    getFrameCount() {
      return this.frames.length;
    }
    /** The {@link Skeleton.getSlots} indices that this timeline affects, in setup order. */
    getSlots() {
      return this.slots;
    }
    /** The draw order for each frame. See {@link setFrame}. */
    getDrawOrders() {
      return this.drawOrders;
    }
    /** Sets the time and draw order for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds.
     * @param drawOrder Ordered {@link getSlots} indices, or null to use setup pose order. */
    setFrame(frame, time, drawOrder) {
      this.frames[frame] = time;
      this.drawOrders[frame] = drawOrder;
    }
    apply(skeleton, lastTime, time, events, alpha, from, add, out, appliedPose) {
      const pose = appliedPose ? skeleton.drawOrder.appliedPose : skeleton.drawOrder.pose;
      const setup = skeleton.slots;
      if (out || time < this.frames[0]) {
        if (from !== 0 /* current */) this.setup(pose, setup);
      } else {
        const order = this.drawOrders[Timeline.search(this.frames, time)];
        if (!order)
          this.setup(pose, setup);
        else {
          const inFolder = this.inFolder;
          const slots = this.slots;
          for (let i = 0, found = 0, done = slots.length; ; i++) {
            if (inFolder[pose[i].data.index]) {
              pose[i] = setup[slots[order[found]]];
              if (++found === done) break;
            }
          }
        }
      }
    }
    setup(pose, setup) {
      const { inFolder, slots } = this;
      for (let i = 0, found = 0, done = slots.length; ; i++) {
        if (inFolder[pose[i].data.index]) {
          pose[i] = setup[slots[found]];
          if (++found === done) break;
        }
      }
    }
  };
  function isConstraintTimeline(obj) {
    return typeof obj === "object" && obj !== null && typeof obj.constraintIndex === "number";
  }
  var IkConstraintTimeline = class extends CurveTimeline {
    constraintIndex = 0;
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, `${16 /* ikConstraint */}|${constraintIndex}`);
      this.constraintIndex = constraintIndex;
    }
    getFrameEntries() {
      return 6;
    }
    /** Sets the time, mix, softness, bend direction, compress, and stretch for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds.
     * @param bendDirection 1 or -1. */
    setFrame(frame, time, mix, softness, bendDirection, compress, stretch) {
      frame *= 6;
      this.frames[frame] = time;
      this.frames[
        frame + 1
        /*MIX*/
      ] = mix;
      this.frames[
        frame + 2
        /*SOFTNESS*/
      ] = softness;
      this.frames[
        frame + 3
        /*BEND_DIRECTION*/
      ] = bendDirection;
      this.frames[
        frame + 4
        /*COMPRESS*/
      ] = compress ? 1 : 0;
      this.frames[
        frame + 5
        /*STRETCH*/
      ] = stretch ? 1 : 0;
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (!constraint.active) return;
      const pose = appliedPose ? constraint.appliedPose : constraint.pose;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = constraint.data.setupPose;
        switch (from) {
          case 1 /* setup */: {
            pose.mix = setup.mix;
            pose.softness = setup.softness;
            pose.bendDirection = setup.bendDirection;
            pose.compress = setup.compress;
            pose.stretch = setup.stretch;
            break;
          }
          case 2 /* first */: {
            pose.mix += (setup.mix - pose.mix) * alpha;
            pose.softness += (setup.softness - pose.softness) * alpha;
            pose.bendDirection = setup.bendDirection;
            pose.compress = setup.compress;
            pose.stretch = setup.stretch;
            break;
          }
        }
        return;
      }
      let mix = 0, softness = 0;
      const i = Timeline.search(
        frames,
        time,
        6
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 6
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          mix = frames[
            i + 1
            /*MIX*/
          ];
          softness = frames[
            i + 2
            /*SOFTNESS*/
          ];
          const t = (time - before) / (frames[
            i + 6
            /*ENTRIES*/
          ] - before);
          mix += (frames[
            i + 6 + 1
            /*MIX*/
          ] - mix) * t;
          softness += (frames[
            i + 6 + 2
            /*SOFTNESS*/
          ] - softness) * t;
          break;
        }
        case 1:
          mix = frames[
            i + 1
            /*MIX*/
          ];
          softness = frames[
            i + 2
            /*SOFTNESS*/
          ];
          break;
        default:
          mix = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          softness = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
      }
      const base = from === 1 /* setup */ ? constraint.data.setupPose : pose;
      pose.mix = base.mix + (mix - base.mix) * alpha;
      pose.softness = base.softness + (softness - base.softness) * alpha;
      if (out) {
        if (from === 1 /* setup */) {
          pose.bendDirection = base.bendDirection;
          pose.compress = base.compress;
          pose.stretch = base.stretch;
        }
      } else {
        pose.bendDirection = frames[
          i + 3
          /*BEND_DIRECTION*/
        ];
        pose.compress = frames[
          i + 4
          /*COMPRESS*/
        ] !== 0;
        pose.stretch = frames[
          i + 5
          /*STRETCH*/
        ] !== 0;
      }
    }
  };
  var TransformConstraintTimeline = class extends CurveTimeline {
    /** The index of the transform constraint slot in {@link Skeleton.transformConstraints} that will be changed. */
    constraintIndex = 0;
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, `${17 /* transformConstraint */}|${constraintIndex}`);
      this.constraintIndex = constraintIndex;
      this.additive = true;
    }
    getFrameEntries() {
      return 7;
    }
    /** Sets the time, rotate mix, translate mix, scale mix, and shear mix for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY) {
      const frames = this.frames;
      frame *= 7;
      frames[frame] = time;
      frames[
        frame + 1
        /*ROTATE*/
      ] = mixRotate;
      frames[
        frame + 2
        /*X*/
      ] = mixX;
      frames[
        frame + 3
        /*Y*/
      ] = mixY;
      frames[
        frame + 4
        /*SCALEX*/
      ] = mixScaleX;
      frames[
        frame + 5
        /*SCALEY*/
      ] = mixScaleY;
      frames[
        frame + 6
        /*SHEARY*/
      ] = mixShearY;
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (!constraint.active) return;
      const pose = appliedPose ? constraint.appliedPose : constraint.pose;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = constraint.data.setupPose;
        switch (from) {
          case 1 /* setup */: {
            pose.mixRotate = setup.mixRotate;
            pose.mixX = setup.mixX;
            pose.mixY = setup.mixY;
            pose.mixScaleX = setup.mixScaleX;
            pose.mixScaleY = setup.mixScaleY;
            pose.mixShearY = setup.mixShearY;
            break;
          }
          case 2 /* first */: {
            pose.mixRotate += (setup.mixRotate - pose.mixRotate) * alpha;
            pose.mixX += (setup.mixX - pose.mixX) * alpha;
            pose.mixY += (setup.mixY - pose.mixY) * alpha;
            pose.mixScaleX += (setup.mixScaleX - pose.mixScaleX) * alpha;
            pose.mixScaleY += (setup.mixScaleY - pose.mixScaleY) * alpha;
            pose.mixShearY += (setup.mixShearY - pose.mixShearY) * alpha;
            break;
          }
        }
        return;
      }
      let rotate, x, y, scaleX, scaleY, shearY;
      const i = Timeline.search(
        frames,
        time,
        7
        /*ENTRIES*/
      );
      const curveType = this.curves[
        i / 7
        /*ENTRIES*/
      ];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          rotate = frames[
            i + 1
            /*ROTATE*/
          ];
          x = frames[
            i + 2
            /*X*/
          ];
          y = frames[
            i + 3
            /*Y*/
          ];
          scaleX = frames[
            i + 4
            /*SCALEX*/
          ];
          scaleY = frames[
            i + 5
            /*SCALEY*/
          ];
          shearY = frames[
            i + 6
            /*SHEARY*/
          ];
          const t = (time - before) / (frames[
            i + 7
            /*ENTRIES*/
          ] - before);
          rotate += (frames[
            i + 7 + 1
            /*ROTATE*/
          ] - rotate) * t;
          x += (frames[
            i + 7 + 2
            /*X*/
          ] - x) * t;
          y += (frames[
            i + 7 + 3
            /*Y*/
          ] - y) * t;
          scaleX += (frames[
            i + 7 + 4
            /*SCALEX*/
          ] - scaleX) * t;
          scaleY += (frames[
            i + 7 + 5
            /*SCALEY*/
          ] - scaleY) * t;
          shearY += (frames[
            i + 7 + 6
            /*SHEARY*/
          ] - shearY) * t;
          break;
        }
        case 1:
          rotate = frames[
            i + 1
            /*ROTATE*/
          ];
          x = frames[
            i + 2
            /*X*/
          ];
          y = frames[
            i + 3
            /*Y*/
          ];
          scaleX = frames[
            i + 4
            /*SCALEX*/
          ];
          scaleY = frames[
            i + 5
            /*SCALEY*/
          ];
          shearY = frames[
            i + 6
            /*SHEARY*/
          ];
          break;
        default:
          rotate = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          x = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
          y = this.getBezierValue(
            time,
            i,
            3,
            curveType + 18 * 2 - 2
            /*BEZIER*/
          );
          scaleX = this.getBezierValue(
            time,
            i,
            4,
            curveType + 18 * 3 - 2
            /*BEZIER*/
          );
          scaleY = this.getBezierValue(
            time,
            i,
            5,
            curveType + 18 * 4 - 2
            /*BEZIER*/
          );
          shearY = this.getBezierValue(
            time,
            i,
            6,
            curveType + 18 * 5 - 2
            /*BEZIER*/
          );
      }
      const base = from === 1 /* setup */ ? constraint.data.setupPose : pose;
      if (add) {
        pose.mixRotate = base.mixRotate + rotate * alpha;
        pose.mixX = base.mixX + x * alpha;
        pose.mixY = base.mixY + y * alpha;
        pose.mixScaleX = base.mixScaleX + scaleX * alpha;
        pose.mixScaleY = base.mixScaleY + scaleY * alpha;
        pose.mixShearY = base.mixShearY + shearY * alpha;
      } else {
        pose.mixRotate = base.mixRotate + (rotate - base.mixRotate) * alpha;
        pose.mixX = base.mixX + (x - base.mixX) * alpha;
        pose.mixY = base.mixY + (y - base.mixY) * alpha;
        pose.mixScaleX = base.mixScaleX + (scaleX - base.mixScaleX) * alpha;
        pose.mixScaleY = base.mixScaleY + (scaleY - base.mixScaleY) * alpha;
        pose.mixShearY = base.mixShearY + (shearY - base.mixShearY) * alpha;
      }
    }
  };
  var ConstraintTimeline1 = class extends CurveTimeline1 {
    constraintIndex;
    constructor(frameCount, bezierCount, constraintIndex, property) {
      super(frameCount, bezierCount, `${property}|${constraintIndex}`);
      this.constraintIndex = constraintIndex;
    }
  };
  var PathConstraintPositionTimeline = class extends ConstraintTimeline1 {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 18 /* pathConstraintPosition */);
      this.additive = true;
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (constraint.active) {
        const pose = appliedPose ? constraint.appliedPose : constraint.pose;
        pose.position = this.getAbsoluteValue(time, alpha, from, add, pose.position, constraint.data.setupPose.position);
      }
    }
  };
  var PathConstraintSpacingTimeline = class extends ConstraintTimeline1 {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 19 /* pathConstraintSpacing */);
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (constraint.active) {
        const pose = appliedPose ? constraint.appliedPose : constraint.pose;
        pose.spacing = this.getAbsoluteValue(
          time,
          alpha,
          from,
          false,
          pose.spacing,
          constraint.data.setupPose.spacing
        );
      }
    }
  };
  var PathConstraintMixTimeline = class extends CurveTimeline {
    constraintIndex;
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, `${20 /* pathConstraintMix */}|${constraintIndex}`);
      this.constraintIndex = constraintIndex;
    }
    getFrameEntries() {
      return 4;
    }
    /** Sets the time and color for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive.
     * @param time The frame time in seconds. */
    setFrame(frame, time, mixRotate, mixX, mixY) {
      const frames = this.frames;
      frame <<= 2;
      frames[frame] = time;
      frames[
        frame + 1
        /*ROTATE*/
      ] = mixRotate;
      frames[
        frame + 2
        /*X*/
      ] = mixX;
      frames[
        frame + 3
        /*Y*/
      ] = mixY;
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (!constraint.active) return;
      const pose = appliedPose ? constraint.appliedPose : constraint.pose;
      const frames = this.frames;
      if (time < frames[0]) {
        const setup = constraint.data.setupPose;
        switch (from) {
          case 1 /* setup */: {
            pose.mixRotate = setup.mixRotate;
            pose.mixX = setup.mixX;
            pose.mixY = setup.mixY;
            break;
          }
          case 2 /* first */: {
            pose.mixRotate += (setup.mixRotate - pose.mixRotate) * alpha;
            pose.mixX += (setup.mixX - pose.mixX) * alpha;
            pose.mixY += (setup.mixY - pose.mixY) * alpha;
            break;
          }
        }
        return;
      }
      let rotate, x, y;
      const i = Timeline.search(
        frames,
        time,
        4
        /*ENTRIES*/
      );
      const curveType = this.curves[i >> 2];
      switch (curveType) {
        case 0: {
          const before = frames[i];
          rotate = frames[
            i + 1
            /*ROTATE*/
          ];
          x = frames[
            i + 2
            /*X*/
          ];
          y = frames[
            i + 3
            /*Y*/
          ];
          const t = (time - before) / (frames[
            i + 4
            /*ENTRIES*/
          ] - before);
          rotate += (frames[
            i + 4 + 1
            /*ROTATE*/
          ] - rotate) * t;
          x += (frames[
            i + 4 + 2
            /*X*/
          ] - x) * t;
          y += (frames[
            i + 4 + 3
            /*Y*/
          ] - y) * t;
          break;
        }
        case 1:
          rotate = frames[
            i + 1
            /*ROTATE*/
          ];
          x = frames[
            i + 2
            /*X*/
          ];
          y = frames[
            i + 3
            /*Y*/
          ];
          break;
        default:
          rotate = this.getBezierValue(
            time,
            i,
            1,
            curveType - 2
            /*BEZIER*/
          );
          x = this.getBezierValue(
            time,
            i,
            2,
            curveType + 18 - 2
            /*BEZIER*/
          );
          y = this.getBezierValue(
            time,
            i,
            3,
            curveType + 18 * 2 - 2
            /*BEZIER*/
          );
      }
      const base = from === 1 /* setup */ ? constraint.data.setupPose : pose;
      if (add) {
        pose.mixRotate = base.mixRotate + rotate * alpha;
        pose.mixX = base.mixX + x * alpha;
        pose.mixY = base.mixY + y * alpha;
      } else {
        pose.mixRotate = base.mixRotate + (rotate - base.mixRotate) * alpha;
        pose.mixX = base.mixX + (x - base.mixX) * alpha;
        pose.mixY = base.mixY + (y - base.mixY) * alpha;
      }
    }
  };
  var PhysicsConstraintTimeline = class extends ConstraintTimeline1 {
    /** @param constraintIndex -1 for all physics constraints in the skeleton. */
    constructor(frameCount, bezierCount, constraintIndex, property) {
      super(frameCount, bezierCount, constraintIndex, property);
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      if (add && !this.additive) add = false;
      if (this.constraintIndex === -1) {
        const value = time >= this.frames[0] ? this.getCurveValue(time) : 0;
        const constraints = skeleton.physics;
        for (const constraint of constraints) {
          if (constraint.active && this.global(constraint.data)) {
            const pose = appliedPose ? constraint.appliedPose : constraint.pose;
            this.set(pose, this.getAbsoluteValue(time, alpha, from, add, this.get(pose), this.get(constraint.data.setupPose), value));
          }
        }
      } else {
        const constraint = skeleton.constraints[this.constraintIndex];
        if (constraint.active) {
          const pose = appliedPose ? constraint.appliedPose : constraint.pose;
          this.set(pose, this.getAbsoluteValue(time, alpha, from, add, this.get(pose), this.get(constraint.data.setupPose)));
        }
      }
    }
  };
  var PhysicsConstraintInertiaTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 21 /* physicsConstraintInertia */);
    }
    get(pose) {
      return pose.inertia;
    }
    set(pose, value) {
      pose.inertia = value;
    }
    global(constraint) {
      return constraint.inertiaGlobal;
    }
  };
  var PhysicsConstraintStrengthTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 22 /* physicsConstraintStrength */);
    }
    get(pose) {
      return pose.strength;
    }
    set(pose, value) {
      pose.strength = value;
    }
    global(constraint) {
      return constraint.strengthGlobal;
    }
  };
  var PhysicsConstraintDampingTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 23 /* physicsConstraintDamping */);
    }
    get(pose) {
      return pose.damping;
    }
    set(pose, value) {
      pose.damping = value;
    }
    global(constraint) {
      return constraint.dampingGlobal;
    }
  };
  var PhysicsConstraintMassTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 24 /* physicsConstraintMass */);
    }
    get(pose) {
      return 1 / pose.massInverse;
    }
    set(pose, value) {
      pose.massInverse = 1 / value;
    }
    global(constraint) {
      return constraint.massGlobal;
    }
  };
  var PhysicsConstraintWindTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 25 /* physicsConstraintWind */);
      this.additive = true;
    }
    get(pose) {
      return pose.wind;
    }
    set(pose, value) {
      pose.wind = value;
    }
    global(constraint) {
      return constraint.windGlobal;
    }
  };
  var PhysicsConstraintGravityTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 26 /* physicsConstraintGravity */);
      this.additive = true;
    }
    get(pose) {
      return pose.gravity;
    }
    set(pose, value) {
      pose.gravity = value;
    }
    global(constraint) {
      return constraint.gravityGlobal;
    }
  };
  var PhysicsConstraintMixTimeline = class extends PhysicsConstraintTimeline {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 27 /* physicsConstraintMix */);
    }
    get(pose) {
      return pose.mix;
    }
    set(pose, value) {
      pose.mix = value;
    }
    global(constraint) {
      return constraint.mixGlobal;
    }
  };
  var PhysicsConstraintResetTimeline = class _PhysicsConstraintResetTimeline extends Timeline {
    static propertyIds = [28 /* physicsConstraintReset */.toString()];
    /** The index of the physics constraint in {@link Skeleton.contraints} that will be reset when this timeline is
    * applied, or -1 if all physics constraints in the skeleton will be reset. */
    constraintIndex;
    /** @param constraintIndex -1 for all physics constraints in the skeleton. */
    constructor(frameCount, constraintIndex) {
      super(frameCount, ..._PhysicsConstraintResetTimeline.propertyIds);
      this.constraintIndex = constraintIndex;
      this.instant = true;
    }
    getFrameCount() {
      return this.frames.length;
    }
    /** Sets the time for the specified frame.
     * @param frame Between 0 and `frameCount`, inclusive. */
    setFrame(frame, time) {
      this.frames[frame] = time;
    }
    /** Resets the physics constraint when frames > `lastTime` and <= `time`. */
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      let constraint;
      if (this.constraintIndex !== -1) {
        constraint = skeleton.constraints[this.constraintIndex];
        if (!constraint.active) return;
      }
      const frames = this.frames;
      if (lastTime > time) {
        this.apply(skeleton, lastTime, Number.MAX_VALUE, [], alpha, from, false, false, false);
        lastTime = -1;
      } else if (lastTime >= frames[frames.length - 1])
        return;
      if (time < frames[0]) return;
      if (lastTime < frames[0] || time >= frames[Timeline.search(frames, lastTime) + 1]) {
        if (constraint != null)
          constraint.reset(skeleton);
        else {
          for (const constraint2 of skeleton.physics) {
            if (constraint2.active) constraint2.reset(skeleton);
          }
        }
      }
    }
  };
  var SliderTimeline = class extends ConstraintTimeline1 {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 30 /* sliderTime */);
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (constraint.active) {
        const pose = appliedPose ? constraint.appliedPose : constraint.pose;
        pose.time = this.getAbsoluteValue(time, alpha, from, add, pose.time, constraint.data.setupPose.time);
      }
    }
  };
  var SliderMixTimeline = class extends ConstraintTimeline1 {
    constructor(frameCount, bezierCount, constraintIndex) {
      super(frameCount, bezierCount, constraintIndex, 31 /* sliderMix */);
      this.additive = true;
    }
    apply(skeleton, lastTime, time, firedEvents, alpha, from, add, out, appliedPose) {
      const constraint = skeleton.constraints[this.constraintIndex];
      if (constraint.active) {
        const pose = appliedPose ? constraint.appliedPose : constraint.pose;
        pose.mix = this.getAbsoluteValue(time, alpha, from, add, pose.mix, constraint.data.setupPose.mix);
      }
    }
  };

  // spine-core/src/AnimationState.ts
  var AnimationState = class _AnimationState {
    static emptyAnimation = new Animation("<empty>", [], 0);
    /** The AnimationStateData to look up mix durations. */
    data;
    /** The list of tracks that have had animations. May contain null entries for tracks that currently have no animation. */
    tracks = [];
    /** Multiplier for the delta time when the animation state is updated, causing time for all animations and mixes to play slower
     * or faster. Defaults to 1.
     *
     * See {@link TrackEntry.timeScale} to affect a single animation. */
    timeScale = 1;
    unkeyedState = 0;
    events = [];
    listeners = [];
    queue = new EventQueue(this);
    propertyIds = /* @__PURE__ */ new Map();
    animationsChanged = false;
    trackEntryPool = new Pool(() => new TrackEntry());
    constructor(data) {
      this.data = data;
    }
    /** Increments each track entry {@link TrackEntry.trackTime}, setting queued animations as current if needed. */
    update(delta) {
      delta *= this.timeScale;
      const tracks = this.tracks;
      for (let i = 0, n = tracks.length; i < n; i++) {
        const current = tracks[i];
        if (!current) continue;
        current.animationLast = current.nextAnimationLast;
        current.trackLast = current.nextTrackLast;
        let currentDelta = delta * current.timeScale;
        if (current.delay > 0) {
          current.delay -= currentDelta;
          if (current.delay > 0) continue;
          currentDelta = -current.delay;
          current.delay = 0;
        }
        let next = current.next;
        if (next) {
          const nextTime = current.trackLast - next.delay;
          if (nextTime >= 0) {
            next.delay = 0;
            next.trackTime += current.timeScale === 0 ? 0 : (nextTime / current.timeScale + delta) * next.timeScale;
            current.trackTime += currentDelta;
            this.setTrack(i, next, true);
            while (next.mixingFrom) {
              next.mixTime += delta;
              next = next.mixingFrom;
            }
            continue;
          }
        } else if (current.trackLast >= current.trackEnd && !current.mixingFrom) {
          tracks[i] = null;
          this.queue.end(current);
          this.clearNext(current);
          continue;
        }
        if (current.mixingFrom && this.updateMixingFrom(current, delta)) {
          let from = current.mixingFrom;
          current.mixingFrom = null;
          if (from) from.mixingTo = null;
          while (from) {
            this.queue.end(from);
            from = from.mixingFrom;
          }
        }
        current.trackTime += currentDelta;
      }
      this.queue.drain();
    }
    /** Returns true when all mixing from entries are complete. */
    updateMixingFrom(to, delta) {
      const from = to.mixingFrom;
      if (!from) return true;
      const finished = this.updateMixingFrom(from, delta);
      from.animationLast = from.nextAnimationLast;
      from.trackLast = from.nextTrackLast;
      if (to.nextTrackLast !== -1 && to.mixTime >= to.mixDuration) {
        if (from.totalAlpha === 0 || to.mixDuration === 0) {
          to.mixingFrom = from.mixingFrom;
          if (from.mixingFrom != null) from.mixingFrom.mixingTo = to;
          if (from.totalAlpha === 0) {
            for (let next = to; next.mixingTo != null; next = next.mixingTo)
              next.keepHold = true;
          }
          this.queue.end(from);
        }
        return finished;
      }
      from.trackTime += delta * from.timeScale;
      to.mixTime += delta;
      return false;
    }
    /** Poses the skeleton using the track entry animations. The animation state is not changed, so can be applied to multiple
     * skeletons to pose them identically.
     * @returns True if any animations were applied. */
    apply(skeleton) {
      if (!skeleton) throw new Error("skeleton cannot be null.");
      if (this.animationsChanged) this._animationsChanged();
      const events = this.events;
      const tracks = this.tracks;
      let applied = false;
      for (let i = 0, n = tracks.length; i < n; i++) {
        const current = tracks[i];
        if (!current || current.delay > 0) continue;
        applied = true;
        let alpha = current.alpha;
        if (current.mixingFrom)
          alpha *= this.applyMixingFrom(current, skeleton);
        else if (current.trackTime >= current.trackEnd && !current.next)
          alpha = 0;
        let animationLast = current.animationLast, animationTime = current.getAnimationTime(), applyTime = animationTime;
        let applyEvents = events;
        if (current.reverse) {
          applyTime = current.animation.duration - applyTime;
          applyEvents = null;
        }
        const timelines = current.animation.timelines;
        const timelineCount = timelines.length;
        if (i === 0 && alpha === 1) {
          for (let ii = 0; ii < timelineCount; ii++) {
            Utils.webkit602BugfixHelper(alpha);
            const timeline = timelines[ii];
            if (timeline instanceof AttachmentTimeline)
              this.applyAttachmentTimeline(timeline, skeleton, applyTime, 1 /* setup */, true);
            else
              timeline.apply(skeleton, animationLast, applyTime, applyEvents, alpha, 1 /* setup */, false, false, false);
          }
        } else {
          const timelineMode = current.timelineMode;
          const retainAttachments = alpha >= current.alphaAttachmentThreshold;
          const add = current.additive, shortestRotation = add || current.shortestRotation;
          const firstFrame = !shortestRotation && current.timelinesRotation.length !== timelineCount << 1;
          if (firstFrame) current.timelinesRotation.length = timelineCount << 1;
          for (let ii = 0; ii < timelineCount; ii++) {
            const timeline = timelines[ii];
            const from = timelineMode[ii] & MODE;
            if (!shortestRotation && timeline instanceof RotateTimeline) {
              this.applyRotateTimeline(timeline, skeleton, applyTime, alpha, from, current.timelinesRotation, ii << 1, firstFrame);
            } else if (timeline instanceof AttachmentTimeline) {
              this.applyAttachmentTimeline(timeline, skeleton, applyTime, from, retainAttachments);
            } else {
              Utils.webkit602BugfixHelper(alpha);
              timeline.apply(skeleton, animationLast, applyTime, applyEvents, alpha, from, add, false, false);
            }
          }
        }
        if (current.reverse) this.eventsReverse(current, animationLast, animationTime);
        this.queueEvents(current, animationTime);
        events.length = 0;
        current.nextAnimationLast = animationTime;
        current.nextTrackLast = current.trackTime;
      }
      const setupState = this.unkeyedState + ATTACH_SETUP;
      const slots = skeleton.slots;
      for (let i = 0, n = skeleton.slots.length; i < n; i++) {
        const slot = slots[i];
        if (slot.attachmentState === setupState) {
          const attachmentName = slot.data.attachmentName;
          slot.pose.setAttachment(!attachmentName ? null : skeleton.getAttachment(slot.data.index, attachmentName));
        }
      }
      this.unkeyedState += 2;
      this.queue.drain();
      return applied;
    }
    applyMixingFrom(to, skeleton) {
      const from = to.mixingFrom;
      const fromMix = from.mixingFrom !== null ? this.applyMixingFrom(from, skeleton) : 1;
      const mix = to.mix();
      const a = from.alpha * fromMix, keep = 1 - mix * to.alpha;
      const alphaMix = a * (1 - mix), alphaHold = keep > 0 ? alphaMix / keep : a;
      const timelines = from.animation.timelines;
      const timelineCount = timelines.length;
      const timelineMode = from.timelineMode;
      const timelineHoldMix = from.timelineHoldMix;
      const retainAttachments = mix < from.mixAttachmentThreshold, drawOrder = mix < from.mixDrawOrderThreshold;
      const add = from.additive, shortestRotation = add || from.shortestRotation;
      const firstFrame = !shortestRotation && from.timelinesRotation.length !== timelineCount << 1;
      if (firstFrame) from.timelinesRotation.length = timelineCount << 1;
      const timelinesRotation = from.timelinesRotation;
      let animationLast = from.animationLast, animationTime = from.getAnimationTime(), applyTime = animationTime;
      let events = null;
      if (from.reverse)
        applyTime = from.animation.duration - applyTime;
      else if (mix < from.eventThreshold)
        events = this.events;
      from.totalAlpha = 0;
      for (let i = 0; i < timelineCount; i++) {
        const timeline = timelines[i];
        const mode = timelineMode[i];
        const mixFrom = mode & MODE;
        let alpha = 0;
        if ((mode & HOLD) !== 0) {
          const holdMix = timelineHoldMix[i];
          alpha = holdMix == null ? alphaHold : alphaHold * (1 - holdMix.mix());
        } else {
          if (!drawOrder && timeline instanceof DrawOrderTimeline && mixFrom === 0 /* current */) continue;
          alpha = alphaMix;
        }
        from.totalAlpha += alpha;
        if (!shortestRotation && timeline instanceof RotateTimeline) {
          this.applyRotateTimeline(timeline, skeleton, applyTime, alpha, mixFrom, timelinesRotation, i << 1, firstFrame);
        } else if (timeline instanceof AttachmentTimeline)
          this.applyAttachmentTimeline(
            timeline,
            skeleton,
            applyTime,
            mixFrom,
            retainAttachments && alpha >= from.alphaAttachmentThreshold
          );
        else {
          const out = !drawOrder || !(timeline instanceof DrawOrderTimeline) || mixFrom === 0 /* current */;
          timeline.apply(skeleton, animationLast, applyTime, events, alpha, mixFrom, add, out, false);
        }
      }
      if (from.reverse && mix < from.eventThreshold) this.eventsReverse(from, animationLast, animationTime);
      if (to.mixDuration > 0) this.queueEvents(from, animationTime);
      this.events.length = 0;
      from.nextAnimationLast = animationTime;
      from.nextTrackLast = from.trackTime;
      return mix;
    }
    /** Applies the attachment timeline and sets {@link Slot.attachmentState}.
     * @param retain True if the attachment remains after apply, false if temporary for deform timelines. */
    applyAttachmentTimeline(timeline, skeleton, time, from, retain) {
      const slot = skeleton.slots[timeline.slotIndex];
      if (!slot.bone.active) return;
      if (!retain && slot.attachmentState === this.unkeyedState + ATTACH_RETAIN) return;
      let setup = time < timeline.frames[0];
      let name = null;
      if (!setup) {
        name = timeline.attachmentNames[Timeline.search(timeline.frames, time)];
        setup = !retain && name == null;
      }
      if (setup) {
        if (from === 0 /* current */) return;
        name = slot.data.attachmentName;
      }
      slot.pose.setAttachment(name == null ? null : skeleton.getAttachment(slot.data.index, name));
      if (retain)
        slot.attachmentState = this.unkeyedState + ATTACH_RETAIN;
      else if (!setup)
        slot.attachmentState = this.unkeyedState + ATTACH_SETUP;
    }
    /** Applies the rotate timeline, mixing with the current pose while keeping the same rotation direction chosen as the shortest
     * the first time the mixing was applied. */
    applyRotateTimeline(timeline, skeleton, time, alpha, from, timelinesRotation, i, firstFrame) {
      if (firstFrame) timelinesRotation[i] = 0;
      if (alpha === 1) {
        timeline.apply(skeleton, 0, time, null, 1, from, false, false, false);
        return;
      }
      const bone = skeleton.bones[timeline.boneIndex];
      if (!bone.active) return;
      const pose = bone.pose, setup = bone.data.setupPose;
      const frames = timeline.frames;
      let r1, r2;
      if (time < frames[0]) {
        switch (from) {
          case 1 /* setup */: {
            pose.rotation = setup.rotation;
            return;
          }
          case 0 /* current */: {
            return;
          }
        }
        r1 = pose.rotation;
        r2 = setup.rotation;
      } else {
        r1 = from === 1 /* setup */ ? setup.rotation : pose.rotation;
        r2 = setup.rotation + timeline.getCurveValue(time);
      }
      let total = 0, diff = r2 - r1;
      diff -= Math.ceil(diff / 360 - 0.5) * 360;
      if (diff === 0) {
        total = timelinesRotation[i];
      } else {
        let lastTotal = 0, lastDiff = 0;
        if (firstFrame) {
          lastTotal = 0;
          lastDiff = diff;
        } else {
          lastTotal = timelinesRotation[i];
          lastDiff = timelinesRotation[i + 1];
        }
        const loops = lastTotal - lastTotal % 360;
        total = diff + loops;
        let current = diff >= 0, dir = lastTotal >= 0;
        if (Math.abs(lastDiff) <= 90 && MathUtils.signum(lastDiff) !== MathUtils.signum(diff)) {
          if (Math.abs(lastTotal - loops) > 180) {
            total += 360 * MathUtils.signum(lastTotal);
            dir = current;
          } else if (loops !== 0)
            total -= 360 * MathUtils.signum(lastTotal);
          else
            dir = current;
        }
        if (dir !== current) total += 360 * MathUtils.signum(lastTotal);
        timelinesRotation[i] = total;
      }
      timelinesRotation[i + 1] = diff;
      pose.rotation = r1 + total * alpha;
    }
    queueEvents(entry, animationTime) {
      const animationStart = entry.animationStart, animationEnd = entry.animationEnd, duration = animationEnd - animationStart;
      const reverse = entry.reverse;
      let split = entry.trackLast % duration;
      if (reverse) split = duration - split;
      const events = this.events;
      let i = 0, n = events.length;
      for (; i < n; i++) {
        const event = events[i];
        if (event.time < split !== reverse) break;
        if (event.time >= animationStart && event.time <= animationEnd) this.queue.event(entry, event);
      }
      let complete = false;
      if (entry.loop) {
        if (duration === 0)
          complete = true;
        else {
          const cycles = Math.floor(entry.trackTime / duration);
          complete = cycles > 0 && cycles > Math.floor(entry.trackLast / duration);
        }
      } else
        complete = animationTime >= animationEnd && entry.animationLast < animationEnd;
      if (complete) this.queue.complete(entry);
      for (; i < n; i++) {
        const event = events[i];
        if (event.time >= animationStart && event.time <= animationEnd) this.queue.event(entry, event);
      }
    }
    eventsReverse(entry, animationLast, animationTime) {
      const duration = entry.animation.duration, from = duration - animationLast, to = duration - animationTime;
      const timelines = entry.animation.timelines;
      for (let i = 0, n = entry.animation.timelines.length; i < n; i++) {
        const eventTimeline = timelines[i];
        if (!(eventTimeline instanceof EventTimeline)) continue;
        const timelineEvents = eventTimeline.events;
        const frames = eventTimeline.frames;
        const frameCount = frames.length;
        if (from >= to) {
          for (let ii = 0; ii < frameCount; ii++) {
            if (frames[ii] < to) continue;
            if (frames[ii] >= from) break;
            this.events.push(timelineEvents[ii]);
          }
        } else {
          for (let ii2 = 0; ii2 < frameCount; ii2++) {
            if (frames[ii2] >= from) break;
            this.events.push(timelineEvents[ii2]);
          }
          let ii = 0;
          for (; ii < frameCount; ii++)
            if (frames[ii] >= to) break;
          for (; ii < frameCount; ii++)
            this.events.push(timelineEvents[ii]);
        }
      }
    }
    /** Removes all animations from all tracks, leaving skeletons in their current pose.
     *
     * Usually you want to use {@link setEmptyAnimations} to mix the skeletons back to the setup pose, rather than leaving
     * them in their current pose. */
    clearTracks() {
      const oldDrainDisabled = this.queue.drainDisabled;
      this.queue.drainDisabled = true;
      for (let i = 0, n = this.tracks.length; i < n; i++)
        this.clearTrack(i);
      this.tracks.length = 0;
      this.queue.drainDisabled = oldDrainDisabled;
      this.queue.drain();
    }
    /** Removes all animations from the track, leaving skeletons in their current pose.
     *
     * Usually you want to use {@link setEmptyAnimation} to mix the skeletons back to the setup pose, rather than
     * leaving them in their current pose. */
    clearTrack(trackIndex) {
      if (trackIndex < 0) throw new Error("trackIndex must be >= 0.");
      if (trackIndex >= this.tracks.length) return;
      const current = this.tracks[trackIndex];
      if (!current) return;
      this.queue.end(current);
      this.clearNext(current);
      let entry = current;
      while (true) {
        const from = entry.mixingFrom;
        if (!from) break;
        this.queue.end(from);
        entry.mixingFrom = null;
        entry.mixingTo = null;
        entry = from;
      }
      this.tracks[current.trackIndex] = null;
      this.queue.drain();
    }
    setTrack(index, current, interrupt) {
      const from = this.expandToIndex(index);
      this.tracks[index] = current;
      current.previous = null;
      if (from) {
        from.next = null;
        if (interrupt) this.queue.interrupt(from);
        current.mixingFrom = from;
        from.mixingTo = current;
        current.mixTime = 0;
        from.timelinesRotation.length = 0;
      }
      this.queue.start(current);
    }
    setAnimation(trackIndex, animationNameOrAnimation, loop = false) {
      if (typeof animationNameOrAnimation === "string")
        return this.setAnimation1(trackIndex, animationNameOrAnimation, loop);
      return this.setAnimation2(trackIndex, animationNameOrAnimation, loop);
    }
    setAnimation1(trackIndex, animationName, loop = false) {
      const animation = this.data.skeletonData.findAnimation(animationName);
      if (!animation) throw new Error(`Animation not found: ${animationName}`);
      return this.setAnimation2(trackIndex, animation, loop);
    }
    /** Sets the current animation for a track, discarding any queued animations.
     *
     * If the formerly current track entry is for the same animation and was never applied to a skeleton, it is replaced (not mixed
     * from).
     * @param loop If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     *           duration. In either case {@link TrackEntry.getTrackEnd} determines when the track is cleared.
     * @return A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener.dispose} event occurs. */
    setAnimation2(trackIndex, animation, loop = false) {
      if (trackIndex < 0) throw new Error("trackIndex must be >= 0.");
      if (!animation) throw new Error("animation cannot be null.");
      let interrupt = true;
      let current = this.expandToIndex(trackIndex);
      if (current) {
        if (current.nextTrackLast === -1 && current.animation === animation) {
          this.tracks[trackIndex] = current.mixingFrom;
          this.queue.interrupt(current);
          this.queue.end(current);
          this.clearNext(current);
          current = current.mixingFrom;
          interrupt = false;
        } else
          this.clearNext(current);
      }
      const entry = this.trackEntry(trackIndex, animation, loop, current);
      this.setTrack(trackIndex, entry, interrupt);
      this.queue.drain();
      return entry;
    }
    addAnimation(trackIndex, animationNameOrAnimation, loop = false, delay = 0) {
      if (typeof animationNameOrAnimation === "string")
        return this.addAnimation1(trackIndex, animationNameOrAnimation, loop, delay);
      return this.addAnimation2(trackIndex, animationNameOrAnimation, loop, delay);
    }
    addAnimation1(trackIndex, animationName, loop = false, delay = 0) {
      const animation = this.data.skeletonData.findAnimation(animationName);
      if (!animation) throw new Error(`Animation not found: ${animationName}`);
      return this.addAnimation2(trackIndex, animation, loop, delay);
    }
    addAnimation2(trackIndex, animation, loop = false, delay = 0) {
      if (trackIndex < 0) throw new Error("trackIndex must be >= 0.");
      if (!animation) throw new Error("animation cannot be null.");
      let last = this.expandToIndex(trackIndex);
      if (last) {
        while (last.next)
          last = last.next;
      }
      const entry = this.trackEntry(trackIndex, animation, loop, last);
      if (!last) {
        this.setTrack(trackIndex, entry, true);
        this.queue.drain();
        if (delay < 0) delay = 0;
      } else {
        last.next = entry;
        entry.previous = last;
        if (delay <= 0) delay = Math.max(delay + last.getTrackComplete() - entry.mixDuration, 0);
      }
      entry.delay = delay;
      return entry;
    }
    /** Sets an empty animation for a track, discarding any queued animations, and sets the track entry's
     * {@link TrackEntry.mixduration}. An empty animation has no timelines and serves as a placeholder for mixing in or out.
     *
     * Mixing out is done by setting an empty animation with a mix duration using either {@link setEmptyAnimation},
     * {@link setEmptyAnimations}, or {@link addEmptyAnimation}. Mixing to an empty animation causes
     * the previous animation to be applied less and less over the mix duration. Properties keyed in the previous animation
     * transition to the value from lower tracks or to the setup pose value if no lower tracks key the property. A mix duration of
     * 0 still needs to be applied one more time to mix out, so the properties it was animating are reverted.
     *
     * Mixing in is done by first setting an empty animation, then adding an animation using
     * {@link addAnimation} with the desired delay (an empty animation has a duration of 0) and on
     * the returned track entry, set the {@link TrackEntry.setMixDuration}. Mixing from an empty animation causes the new
     * animation to be applied more and more over the mix duration. Properties keyed in the new animation transition from the value
     * from lower tracks or from the setup pose value if no lower tracks key the property to the value keyed in the new animation.
     *
     * See <a href='https://esotericsoftware.com/spine-applying-animations#Empty-animations'>Empty animations</a> in the Spine
     * Runtimes Guide. */
    setEmptyAnimation(trackIndex, mixDuration = 0) {
      const entry = this.setAnimation(trackIndex, _AnimationState.emptyAnimation, false);
      entry.mixDuration = mixDuration;
      entry.trackEnd = mixDuration;
      return entry;
    }
    /** Adds an empty animation to be played after the current or last queued animation for a track, and sets the track entry's
     * {@link TrackEntry.mixDuration}. If the track has no entries, it is equivalent to calling
     * {@link setEmptyAnimation}.
     *
     * See {@link setEmptyAnimation} and
     * <a href='https://esotericsoftware.com/spine-applying-animations#Empty-animations'>Empty animations</a> in the Spine Runtimes
     * Guide.
     * @param delay If > 0, sets {@link TrackEntry.delay}. If <= 0, the delay set is the duration of the previous track entry minus
     *           any mix duration plus the specified `delay` (ie the mix ends at (when `delay` = 0) or before
     *           (when `delay` < 0) the previous track entry duration). If the previous entry is looping, its next loop
     *           completion is used instead of its duration.
     * @return A track entry to allow further customization of animation playback. References to the track entry must not be kept
     *         after the {@link AnimationStateListener.dispose} event occurs. */
    addEmptyAnimation(trackIndex, mixDuration = 0, delay = 0) {
      const entry = this.addAnimation(trackIndex, _AnimationState.emptyAnimation, false, delay);
      if (delay <= 0) entry.delay = Math.max(entry.delay + entry.mixDuration - mixDuration, 0);
      entry.mixDuration = mixDuration;
      entry.trackEnd = mixDuration;
      return entry;
    }
    /** Sets an empty animation for every track, discarding any queued animations, and mixes to it over the specified mix duration.
     *
     * See <a href='https://esotericsoftware.com/spine-applying-animations#Empty-animations'>Empty animations</a> in the Spine
     * Runtimes Guide. */
    setEmptyAnimations(mixDuration = 0) {
      const oldDrainDisabled = this.queue.drainDisabled;
      this.queue.drainDisabled = true;
      for (let i = 0, n = this.tracks.length; i < n; i++) {
        const current = this.tracks[i];
        if (current) this.setEmptyAnimation(current.trackIndex, mixDuration);
      }
      this.queue.drainDisabled = oldDrainDisabled;
      this.queue.drain();
    }
    expandToIndex(index) {
      if (index < this.tracks.length) return this.tracks[index];
      Utils.ensureArrayCapacity(this.tracks, index + 1, null);
      this.tracks.length = index + 1;
      return null;
    }
    /** @param last May be null. */
    trackEntry(trackIndex, animation, loop, last) {
      const entry = this.trackEntryPool.obtain();
      entry.reset();
      entry.trackIndex = trackIndex;
      entry.animation = animation;
      entry.loop = loop;
      entry.additive = false;
      entry.reverse = false;
      entry.shortestRotation = false;
      entry.eventThreshold = 0;
      entry.alphaAttachmentThreshold = 0;
      entry.mixAttachmentThreshold = 0;
      entry.mixDrawOrderThreshold = 0;
      entry.animationStart = 0;
      entry.animationEnd = animation.duration;
      entry.animationLast = -1;
      entry.nextAnimationLast = -1;
      entry.delay = 0;
      entry.trackTime = 0;
      entry.trackLast = -1;
      entry.nextTrackLast = -1;
      entry.trackEnd = Number.MAX_VALUE;
      entry.timeScale = 1;
      entry.alpha = 1;
      entry.mixTime = 0;
      entry.mixDuration = !last ? 0 : this.data.getMix(last.animation, animation);
      entry.totalAlpha = 0;
      entry.keepHold = false;
      return entry;
    }
    /** Removes {@link TrackEntry.next} and all entries after it for the specified entry. */
    clearNext(entry) {
      let next = entry.next;
      while (next) {
        this.queue.dispose(next);
        next = next.next;
      }
      entry.next = null;
    }
    _animationsChanged() {
      this.animationsChanged = false;
      const tracks = this.tracks;
      for (let i = 0, n = tracks.length; i < n; i++) {
        const track = tracks[i];
        if (!track) continue;
        let entry = track;
        while (entry.mixingFrom)
          entry = entry.mixingFrom;
        do {
          this.computeHold(entry, track);
          entry = entry.mixingTo;
        } while (entry);
      }
      this.propertyIds.clear();
    }
    computeHold(entry, track) {
      const timelines = entry.animation.timelines;
      const timelinesCount = entry.animation.timelines.length;
      const timelineMode = entry.timelineMode;
      timelineMode.length = timelinesCount;
      const timelineHoldMix = entry.timelineHoldMix;
      timelineHoldMix.length = 0;
      const add = entry.additive, keepHold = entry.keepHold;
      const to = entry.mixingTo;
      for (let i = 0; i < timelinesCount; i++) {
        const timeline = timelines[i];
        const ids = timeline.propertyIds;
        const from = this.from(track, timeline, ids);
        if (add && timeline.additive) {
          timelineMode[i] = from;
          continue;
        }
        let mode;
        if (to === null || timeline.instant || to.additive && timeline.additive || !to.animation?.hasTimeline(ids))
          mode = from;
        else {
          mode = from | HOLD;
          for (let next = to.mixingTo; next != null; next = next.mixingTo) {
            if (next.additive && timeline.additive || !next.animation?.hasTimeline(ids)) {
              if (next.mixDuration > 0) timelineHoldMix[i] = next;
              break;
            }
          }
        }
        if (keepHold) mode = mode & ~HOLD | timelineMode[i] & HOLD;
        timelineMode[i] = mode;
      }
    }
    from(track, timeline, ids) {
      const propertyIds = this.propertyIds;
      let from = SETUP;
      for (let i = 0, n = ids.length; i < n; i++) {
        const owner = propertyIds.get(ids[i]);
        if (owner === void 0) {
          propertyIds.set(ids[i], track);
        } else {
          if (owner !== track) {
            while (++i < n)
              if (!propertyIds.has(ids[i])) propertyIds.set(ids[i], track);
            return CURRENT;
          }
          from = FIRST;
        }
      }
      if (timeline instanceof DrawOrderFolderTimeline) {
        const first = propertyIds.get(DrawOrderTimeline.propertyID);
        if (first != null) return first !== track ? CURRENT : FIRST;
      }
      return from;
    }
    /** Returns the track entry for the animation currently playing on the track, or null if no animation is currently playing. */
    getTrack(trackIndex) {
      if (trackIndex < 0) throw new Error("trackIndex must be >= 0.");
      if (trackIndex >= this.tracks.length) return null;
      return this.tracks[trackIndex];
    }
    /** Adds a listener to receive events for all track entries. */
    addListener(listener) {
      if (!listener) throw new Error("listener cannot be null.");
      this.listeners.push(listener);
    }
    /** Removes the listener added with {@link addListener}. */
    removeListener(listener) {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) this.listeners.splice(index, 1);
    }
    /** Removes all listeners added with {@link addListener}. */
    clearListeners() {
      this.listeners.length = 0;
    }
    /** Discards all listener notifications that have not yet been delivered. This can be useful to call from an
     * {@link AnimationStateListener} when it is known that further notifications that may have been already queued for delivery
     * are not wanted because new animations are being set. */
    clearListenerNotifications() {
      this.queue.clear();
    }
  };
  var TrackEntry = class {
    /** The animation to apply for this track entry. */
    animation = null;
    previous = null;
    /** The animation queued to start after this animation, or null. `next` makes up a linked list. */
    next = null;
    /** The track entry for the previous animation when mixing to this animation, or null if no mixing is currently occurring.
     * When mixing from multiple animations, `mixingFrom` makes up a doubly linked list. */
    mixingFrom = null;
    /** The track entry for the next animation when mixing from this animation, or null if no mixing is currently occurring.
     * When mixing to multiple animations, `mixingTo` makes up a doubly linked list. */
    mixingTo = null;
    /** The listener for events generated by this track entry, or null.
     *
     * A track entry returned from {@link AnimationState.setAnimation} is already the current animation
     * for the track, so the callback for listener {@link AnimationStateListener.start} will not be called. */
    listener = null;
    /** The index of the track where this track entry is either current or queued.
     *
     * See {@link AnimationState.getTrack}. */
    trackIndex = 0;
    /** If true, the animation will repeat. If false it will not, instead its last frame is applied if played beyond its
     * duration. */
    loop = false;
    /** When true, timelines in this animation that support additive have their values added to the setup or current pose values
     * instead of replacing them. Additive can be set for a new track entry only before {@link AnimationState.apply}
     * is next called. */
    additive = false;
    /** If true, the animation will be applied in reverse. */
    reverse = false;
    /** If true, mixing rotation between tracks always uses the shortest rotation direction. If the rotation is animated, the
     * shortest rotation direction may change during the mix.
     *
     * If false, the shortest rotation direction is remembered when the mix starts and the same direction is used for the rest
     * of the mix. Defaults to false.
     *
     * See {@link resetRotationDirections}. */
    shortestRotation = false;
    keepHold = false;
    /** When the interpolated mix percentage is less than the `eventThreshold` , event timelines are applied while
     * this animation is being mixed out. Defaults to 0, so event timelines are not applied while this animation is being mixed
     * out. */
    eventThreshold = 0;
    /** When the interpolated mix percentage is less than the `mixAttachmentThreshold`, attachment timelines are
     * applied while this animation is being mixed out. Defaults to 0, so attachment timelines are not applied while this
     * animation is being mixed out. */
    mixAttachmentThreshold = 0;
    /** When the computed alpha is greater than `alphaAttachmentThreshold`, attachment timelines are applied. The
     * computed alpha includes {@link alpha} and the interpolated mix percentage. Defaults to 0, so attachment timelines are
     * always applied. */
    alphaAttachmentThreshold = 0;
    /** When the interpolated mix percentage is less than the `mixAttachmentThreshold`, attachment timelines are
     * applied while this animation is being mixed out. Defaults to 0, so attachment timelines are not applied while this
     * animation is being mixed out. */
    mixDrawOrderThreshold = 0;
    /** The time in seconds for the first frame of this animation, both initially and after looping. Defaults to 0.
     *
     * When setting `animationStart` time, {@link animationLast} can be set to the same value to avoid firing events
     * from the start of the animation. */
    animationStart = 0;
    /** The time in seconds for the last frame of this animation. Past this time, non-looping animations hold the pose at this
     * time while looping animations will loop back to {@link animationStart}. Defaults to the {@link Animation.duration}. */
    animationEnd = 0;
    /** The time in seconds this animation was last applied. Some timelines use this for one-time triggers. For example, when
     * this animation is applied, event timelines will fire all events between the `animationLast` time (exclusive)
     * and `animationTime` (inclusive). Defaults to -1 to ensure triggers on frame 0 happen the first time this
     * animation is applied. */
    animationLast = 0;
    nextAnimationLast = 0;
    /** Seconds to postpone playing the animation. Must be >= 0. When this track entry is the current track entry,
     * `delay` postpones incrementing the {@link trackTime}. When this track entry is queued, `delay` is
     * the time from the start of the previous animation to when this track entry will become the current track entry (ie when
     * the previous track entry {@link trackTime} >= this track entry's `delay`).
     *
     * {@link timeScale} affects the delay.
     *
     * When passing `delay` <= 0 to {@link AnimationState.addAnimation} this
     * `delay` is set using a mix duration from {@link AnimationStateData}. To change the {@link mixDuration}
     * afterward, use {@link setMixDuration} so this `delay` is adjusted. */
    delay = 0;
    /** The time in seconds this track entry has been the current track entry, starting at 0 and increasing forever. Compare to
     * {@link getAnimationTime}, which is always between {@link animationStart} and {@link animationEnd}.
     *
     * The track time can be set to start the animation at a time other than 0, without affecting looping. When doing so,
     * {@link animationLast} can be set to the same value to avoid firing events from the start of the animation.
     *
     * To set the time an animation starts and loops, use {@link animationStart} and {@link animationEnd}. */
    trackTime = 0;
    trackLast = 0;
    nextTrackLast = 0;
    /** The track time in seconds when this animation will be removed from the track. Defaults to the highest possible float
     * value, meaning the animation will be applied until a new animation is set or the track is cleared. If the track end time
     * is reached, no other animations are queued for playback, and mixing from any previous animations is complete, then the
     * properties keyed by the animation are set to the setup pose and the track is cleared.
     *
     * Usually you want to use {@link AnimationState.addEmptyAnimation} rather than have the animation
     * abruptly cease being applied, leaving the current pose. */
    trackEnd = 0;
    /** Multiplier for the delta time when this track entry is updated, causing time for this animation to pass slower or
     * faster. Defaults to 1.
     *
     * Values < 0 are not supported. To play an animation in reverse, use {@link reverse}.
     *
     * {@link mixTime} is not affected by track entry time scale, so {@link mixDuration} may need to be adjusted to match the
     * animation speed.
     *
     * When using {@link AnimationState.addAnimation} with a `delay` <= 0, the
     * {@link delay} is set using the mix duration from {@link AnimationState.data}, assuming time scale to be 1. If the time
     * scale is not 1, the delay may need to be adjusted.
     *
     * See {@link AnimationState.timeScale} to affect all animations. */
    timeScale = 0;
    /** Values < 1 mix this animation with the skeleton's current pose (either the setup pose or the pose from lower tracks).
     * Defaults to 1, which overwrites the skeleton's current pose with this animation.
     *
     * Alpha should be 1 on track 0.
     *
     * See {@link getAlphaAttachmentThreshold}. */
    alpha = 0;
    /** Seconds elapsed from 0 to the {@link mixDuration} when mixing from the previous animation to this animation. May
     * be slightly more than `mixDuration` when the mix is complete. */
    mixTime = 0;
    /** Seconds for mixing from the previous animation to this animation. Defaults to the value provided by
     * {@link AnimationStateData.getMix} based on the animation before this animation (if any).
     *
     * A mix duration of 0 still needs to be applied one more time to mix out, so the the properties it was animating are
     * reverted. A mix duration of 0 can be set at any time to end the mix on the next
     * {@link AnimationState.update | update}.
     *
     * The `mixDuration` can be set manually rather than use the value from
     * {@link AnimationStateData.getMix}. In that case, the `mixDuration` can be set for a new
     * track entry only before {@link AnimationState.update} is next called.
     *
     * When using {@link AnimationState.addAnimation} with a `delay` <= 0, the
     * {@link getDelay} is set using the mix duration from {@link AnimationState.data}. If `mixDuration` is set
     * afterward, the delay needs to be adjusted:
     *
     * <pre>
     * entry.mixDuration = 0.25;<br>
     * entry.delay = entry.previous.getTrackComplete() - entry.mixDuration + 0;
     * </pre>
     *
     * Alternatively, use {@link setMixDuration} to set both the mix duration and recompute the delay:<br>
     *
     * <pre>
      entry.setMixDuration(0.25f, 0); // mixDuration, delay
     * </pre>
     */
    mixDuration = 0;
    totalAlpha = 0;
    mixInterpolation = Interpolation.linear;
    /** Sets both {@link getMixDuration} and {@link getDelay}.
     * @param delay If > 0, sets {@link getDelay}. If <= 0, the delay set is the duration of the previous track entry minus
     *           the specified mix duration plus the specified `delay` (ie the mix ends at (when `delay` =
     *           0) or before (when `delay` < 0) the previous track entry duration). If the previous entry is
     *           looping, its next loop completion is used instead of its duration. */
    setMixDuration(mixDuration, delay) {
      this.mixDuration = mixDuration;
      if (delay !== void 0) {
        if (delay <= 0) delay = this.previous == null ? 0 : Math.max(delay + this.previous.getTrackComplete() - mixDuration, 0);
        this.delay = delay;
      }
    }
    /** The interpolation to apply to the mix percentage ({@link mixTime} / {@link mixDuration}) when mixing from the previous
     * animation to this animation. Defaults to linear. */
    setMixInterpolation(mixInterpolation) {
      if (!mixInterpolation) throw new Error("mixInterpolation cannot be null.");
      this.mixInterpolation = mixInterpolation;
    }
    mix() {
      if (this.mixDuration === 0) return 1;
      let mix = this.mixTime / this.mixDuration;
      if (mix >= 1) return 1;
      if (this.mixInterpolation === Interpolation.linear) return mix;
      mix = this.mixInterpolation.apply(mix);
      if (mix < 0) return 0;
      if (mix > 1) return 1;
      return mix;
    }
    /** For each timeline:
     * - Bits 0-1: MixFrom.
     * - Bit 2, HOLD: 0 = mix out using alphaMix, 1 = apply full alpha to prevent dipping. Timeline is first on its track to
     * set the property and the next entry (mixingTo) also sets it. When held, timelineHoldMix's mix controls how the hold fades
     * out (for 3+ entry chains where the chain eventually stops setting the property). */
    timelineMode = [];
    timelineHoldMix = [];
    timelinesRotation = [];
    reset() {
      this.next = null;
      this.previous = null;
      this.mixingFrom = null;
      this.mixingTo = null;
      this.mixInterpolation = Interpolation.linear;
      this.animation = null;
      this.listener = null;
      this.timelineMode.length = 0;
      this.timelineHoldMix.length = 0;
      this.timelinesRotation.length = 0;
    }
    /** Uses {@link trackTime} to compute the `animationTime`, which is always between {@link animationStart} and
     * {@link animationEnd}. When `trackTime` is 0, `animationTime` is equal to the
     * `animationStart` time. */
    getAnimationTime() {
      if (!this.loop) return Math.min(this.trackTime + this.animationStart, this.animationEnd);
      const duration = this.animationEnd - this.animationStart;
      if (duration === 0) return this.animationStart;
      return this.trackTime % duration + this.animationStart;
    }
    setAnimationLast(animationLast) {
      this.animationLast = animationLast;
      this.nextAnimationLast = animationLast;
    }
    /** Returns true if at least one loop has been completed.
     *
     * See {@link AnimationStateListener.complete}. */
    isComplete() {
      return this.trackTime >= this.animationEnd - this.animationStart;
    }
    /** When {@link shortestRotation} is false, this clears the directions for mixing this entry's rotation. This can be useful
     * to avoid bones rotating the long way around when using {@link getAlpha} and starting animations on other tracks.
     *
     * Mixing involves finding a rotation between two others. There are two possible solutions: the short or the long way
     * around. When the two rotations change over time, which direction is the short or long way can also change. If the short
     * way was always chosen, bones flip to the other side when that direction became the long way. TrackEntry chooses the short
     * way the first time it is applied and remembers that direction. Resetting that direction makes it choose a new short way
     * on the next apply. */
    resetRotationDirections() {
      this.timelinesRotation.length = 0;
    }
    /** If this track entry is non-looping, this is the track time in seconds when {@link animationEnd} is reached, or the
     * current {@link trackTime} if it has already been reached.
     *
     * If this track entry is looping, this is the track time when this animation will reach its next {@link animationEnd} (the
     * next loop completion). */
    getTrackComplete() {
      const duration = this.animationEnd - this.animationStart;
      if (duration !== 0) {
        if (this.loop) return duration * (1 + (this.trackTime / duration | 0));
        if (this.trackTime < duration) return duration;
      }
      return this.trackTime;
    }
    /** Returns true if this track entry has been applied at least once.
     *
     * See {@link AnimationState.apply}. */
    wasApplied() {
      return this.nextTrackLast !== -1;
    }
    /** Returns true if there is a {@link next} track entry and it will become the current track entry during the next
     * {@link AnimationState.update}. */
    isNextReady() {
      return this.next != null && this.nextTrackLast - this.next.delay >= 0;
    }
  };
  var EventQueue = class {
    objects = [];
    drainDisabled = false;
    animState;
    constructor(animState) {
      this.animState = animState;
    }
    start(entry) {
      this.objects.push(0 /* start */);
      this.objects.push(entry);
      this.animState.animationsChanged = true;
    }
    interrupt(entry) {
      this.objects.push(1 /* interrupt */);
      this.objects.push(entry);
    }
    end(entry) {
      this.objects.push(2 /* end */);
      this.objects.push(entry);
      this.animState.animationsChanged = true;
    }
    dispose(entry) {
      this.objects.push(3 /* dispose */);
      this.objects.push(entry);
    }
    complete(entry) {
      this.objects.push(4 /* complete */);
      this.objects.push(entry);
    }
    event(entry, event) {
      this.objects.push(5 /* event */);
      this.objects.push(entry);
      this.objects.push(event);
    }
    drain() {
      if (this.drainDisabled) return;
      this.drainDisabled = true;
      for (let i = 0; i < this.objects.length; i += 2) {
        const objects = this.objects;
        const type = objects[i];
        const entry = objects[i + 1];
        const listeners = this.animState.listeners.slice();
        switch (type) {
          case 0 /* start */:
            if (entry.listener?.start) entry.listener.start(entry);
            for (let ii = 0; ii < listeners.length; ii++) {
              const listener = listeners[ii];
              if (listener.start) listener.start(entry);
            }
            break;
          case 1 /* interrupt */:
            if (entry.listener?.interrupt) entry.listener.interrupt(entry);
            for (let ii = 0; ii < listeners.length; ii++) {
              const listener = listeners[ii];
              if (listener.interrupt) listener.interrupt(entry);
            }
            break;
          // biome-ignore lint/suspicious/noFallthroughSwitchClause: reference runtime does fall through
          case 2 /* end */:
            if (entry.listener?.end) entry.listener.end(entry);
            for (let ii = 0; ii < listeners.length; ii++) {
              const listener = listeners[ii];
              if (listener.end) listener.end(entry);
            }
          // Fall through.
          case 3 /* dispose */:
            if (entry.listener?.dispose) entry.listener.dispose(entry);
            for (let ii = 0; ii < listeners.length; ii++) {
              const listener = listeners[ii];
              if (listener.dispose) listener.dispose(entry);
            }
            this.animState.trackEntryPool.free(entry);
            break;
          case 4 /* complete */:
            if (entry.listener?.complete) entry.listener.complete(entry);
            for (let ii = 0; ii < listeners.length; ii++) {
              const listener = listeners[ii];
              if (listener.complete) listener.complete(entry);
            }
            break;
          case 5 /* event */: {
            const event = objects[i++ + 2];
            if (entry.listener?.event) entry.listener.event(entry, event);
            for (let ii = 0; ii < listeners.length; ii++) {
              const listener = listeners[ii];
              if (listener.event) listener.event(entry, event);
            }
            break;
          }
        }
      }
      this.clear();
      this.drainDisabled = false;
    }
    clear() {
      this.objects.length = 0;
    }
  };
  var EventType = /* @__PURE__ */ ((EventType2) => {
    EventType2[EventType2["start"] = 0] = "start";
    EventType2[EventType2["interrupt"] = 1] = "interrupt";
    EventType2[EventType2["end"] = 2] = "end";
    EventType2[EventType2["dispose"] = 3] = "dispose";
    EventType2[EventType2["complete"] = 4] = "complete";
    EventType2[EventType2["event"] = 5] = "event";
    return EventType2;
  })(EventType || {});
  var AnimationStateAdapter = class {
    start(entry) {
    }
    interrupt(entry) {
    }
    end(entry) {
    }
    dispose(entry) {
    }
    complete(entry) {
    }
    event(entry, event) {
    }
  };
  var CURRENT = 0;
  var SETUP = 1;
  var FIRST = 2;
  var MODE = 3;
  var HOLD = 4;
  var ATTACH_SETUP = 1;
  var ATTACH_RETAIN = 2;

  // spine-core/src/AnimationStateData.ts
  var AnimationStateData = class {
    /** The SkeletonData to look up animations when they are specified by name. */
    skeletonData;
    animationToMixTime = {};
    /** The mix duration to use when no mix duration has been defined between two animations. */
    defaultMix = 0;
    constructor(skeletonData) {
      if (!skeletonData) throw new Error("skeletonData cannot be null.");
      this.skeletonData = skeletonData;
    }
    setMix(from, to, duration) {
      if (typeof from === "string")
        return this.setMix1(from, to, duration);
      return this.setMix2(from, to, duration);
    }
    setMix1(fromName, toName, duration) {
      const from = this.skeletonData.findAnimation(fromName);
      if (!from) throw new Error(`Animation not found: ${fromName}`);
      const to = this.skeletonData.findAnimation(toName);
      if (!to) throw new Error(`Animation not found: ${toName}`);
      this.setMix2(from, to, duration);
    }
    setMix2(from, to, duration) {
      if (!from) throw new Error("from cannot be null.");
      if (!to) throw new Error("to cannot be null.");
      const key = `${from.name}.${to.name}`;
      this.animationToMixTime[key] = duration;
    }
    /** Returns the mix duration to use when changing from the specified animation to the other on the same track, or the
     * {@link defaultMix} if no mix duration has been set. */
    getMix(from, to) {
      const key = `${from.name}.${to.name}`;
      const value = this.animationToMixTime[key];
      return value === void 0 ? this.defaultMix : value;
    }
  };

  // spine-core/src/AssetManagerBase.ts
  var AssetManagerBase = class {
    constructor(textureLoader, pathPrefix = "", downloader = new Downloader(), cache = new AssetCache()) {
      this.textureLoader = textureLoader;
      this.pathPrefix = pathPrefix;
      this.downloader = downloader;
      this.cache = cache;
    }
    errors = {};
    toLoad = 0;
    loaded = 0;
    texturePmaInfo = {};
    start(path) {
      this.toLoad++;
      return this.pathPrefix + path;
    }
    success(callback, path, asset) {
      this.toLoad--;
      this.loaded++;
      this.cache.assets[path] = asset;
      this.cache.assetsRefCount[path] = (this.cache.assetsRefCount[path] || 0) + 1;
      if (callback) callback(path, asset);
    }
    error(callback, path, message) {
      this.toLoad--;
      this.loaded++;
      this.errors[path] = message;
      if (callback) callback(path, message);
    }
    loadAll() {
      const promise = new Promise((resolve, reject) => {
        const check = () => {
          if (this.isLoadingComplete()) {
            if (this.hasErrors()) reject(this.errors);
            else resolve(this);
            return;
          }
          requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      });
      return promise;
    }
    setRawDataURI(path, data) {
      this.downloader.rawDataUris[this.pathPrefix + path] = data;
    }
    loadBinary(path, success = () => {
    }, error = () => {
    }) {
      path = this.start(path);
      if (this.reuseAssets(path, success, error)) return;
      this.cache.assetsLoaded[path] = new Promise((resolve, reject) => {
        this.downloader.downloadBinary(path, (data) => {
          this.success(success, path, data);
          resolve(data);
        }, (status, responseText) => {
          const errorMsg = `Couldn't load binary ${path}: status ${status}, ${responseText}`;
          this.error(error, path, errorMsg);
          reject(errorMsg);
        });
      });
    }
    loadText(path, success = () => {
    }, error = () => {
    }) {
      path = this.start(path);
      this.downloader.downloadText(path, (data) => {
        this.success(success, path, data);
      }, (status, responseText) => {
        this.error(error, path, `Couldn't load text ${path}: status ${status}, ${responseText}`);
      });
    }
    loadJson(path, success = () => {
    }, error = () => {
    }) {
      path = this.start(path);
      if (this.reuseAssets(path, success, error)) return;
      this.cache.assetsLoaded[path] = new Promise((resolve, reject) => {
        this.downloader.downloadJson(path, (data) => {
          this.success(success, path, data);
          resolve(data);
        }, (status, responseText) => {
          const errorMsg = `Couldn't load JSON ${path}: status ${status}, ${responseText}`;
          this.error(error, path, errorMsg);
          reject(errorMsg);
        });
      });
    }
    reuseAssets(path, success = () => {
    }, error = () => {
    }) {
      const loadedStatus = this.cache.getAsset(path);
      const alreadyExistsOrLoading = loadedStatus !== void 0;
      if (alreadyExistsOrLoading) {
        this.cache.assetsLoaded[path] = loadedStatus.then((data) => {
          data = data instanceof Image || data instanceof ImageBitmap ? this.textureLoader(data) : data;
          this.success(success, path, data);
          return data;
        }).catch((errorMsg) => {
          this.error(error, path, errorMsg);
          return void 0;
        });
      }
      return alreadyExistsOrLoading;
    }
    loadTexture(path, success = () => {
    }, error = () => {
    }) {
      path = this.start(path);
      if (this.reuseAssets(path, success, error)) return;
      const pma = this.texturePmaInfo[path];
      this.cache.assetsLoaded[path] = new Promise((resolve, reject) => {
        const isBrowser = !!(typeof window !== "undefined" && typeof navigator !== "undefined" && window.document);
        const isWebWorker = !isBrowser;
        if (isWebWorker) {
          fetch(path, { mode: "cors" }).then((response) => {
            if (response.ok) return response.blob();
            const errorMsg = `Couldn't load image: ${path}`;
            this.error(error, path, `Couldn't load image: ${path}`);
            reject(errorMsg);
          }).then((blob) => {
            return blob ? createImageBitmap(blob, { premultiplyAlpha: "none", colorSpaceConversion: "none" }) : null;
          }).then((bitmap) => {
            if (bitmap) {
              const texture = this.createTexture(path, pma, bitmap);
              this.success(success, path, texture);
              resolve(texture);
            }
            ;
          });
        } else {
          const image = new Image();
          image.crossOrigin = "anonymous";
          image.onload = () => {
            const texture = this.createTexture(path, pma, image);
            this.success(success, path, texture);
            resolve(texture);
          };
          image.onerror = () => {
            const errorMsg = `Couldn't load image: ${path}`;
            this.error(error, path, errorMsg);
            reject(errorMsg);
          };
          if (this.downloader.rawDataUris[path]) path = this.downloader.rawDataUris[path];
          image.src = path;
        }
      });
    }
    loadTextureAtlas(path, success = () => {
    }, error = () => {
    }, fileAlias) {
      const index = path.lastIndexOf("/");
      const parent = index >= 0 ? path.substring(0, index + 1) : "";
      path = this.start(path);
      if (this.reuseAssets(path, success, error)) return;
      this.cache.assetsLoaded[path] = new Promise((resolve, reject) => {
        this.downloader.downloadText(path, (atlasText) => {
          try {
            const atlas = this.createTextureAtlas(atlasText, parent, path, fileAlias);
            let toLoad = atlas.pages.length, abort = false;
            if (toLoad === 0) {
              this.success(success, path, atlas);
              resolve(atlas);
              return;
            }
            for (const page of atlas.pages) {
              this.loadTexture(
                this.texturePath(parent, page.name, fileAlias),
                (imagePath, texture) => {
                  if (!abort) {
                    page.setTexture(texture);
                    if (--toLoad === 0) {
                      this.success(success, path, atlas);
                      resolve(atlas);
                    }
                  }
                },
                (imagePath, message) => {
                  if (!abort) {
                    const errorMsg = `Couldn't load texture ${path} page image: ${imagePath}`;
                    this.error(error, path, errorMsg);
                    reject(errorMsg);
                  }
                  abort = true;
                }
              );
            }
          } catch (e) {
            const errorMsg = `Couldn't parse texture atlas ${path}: ${e.message}`;
            this.error(error, path, errorMsg);
            reject(errorMsg);
          }
        }, (status, responseText) => {
          const errorMsg = `Couldn't load texture atlas ${path}: status ${status}, ${responseText}`;
          this.error(error, path, errorMsg);
          reject(errorMsg);
        });
      });
    }
    loadTextureAtlasButNoTextures(path, success = () => {
    }, error = () => {
    }) {
      const index = path.lastIndexOf("/");
      const parent = index >= 0 ? path.substring(0, index + 1) : "";
      path = this.start(path);
      if (this.reuseAssets(path, success, error)) return;
      this.cache.assetsLoaded[path] = new Promise((resolve, reject) => {
        this.downloader.downloadText(path, (atlasText) => {
          try {
            const atlas = this.createTextureAtlas(atlasText, parent, path);
            this.success(success, path, atlas);
            resolve(atlas);
          } catch (e) {
            const errorMsg = `Couldn't parse texture atlas ${path}: ${e.message}`;
            this.error(error, path, errorMsg);
            reject(errorMsg);
          }
        }, (status, responseText) => {
          const errorMsg = `Couldn't load texture atlas ${path}: status ${status}, ${responseText}`;
          this.error(error, path, errorMsg);
          reject(errorMsg);
        });
      });
    }
    async loadBinaryAsync(path) {
      return new Promise((resolve, reject) => {
        this.loadBinary(
          path,
          (_, binary) => resolve(binary),
          (_, message) => reject(message)
        );
      });
    }
    async loadJsonAsync(path) {
      return new Promise((resolve, reject) => {
        this.loadJson(
          path,
          (_, object) => resolve(object),
          (_, message) => reject(message)
        );
      });
    }
    async loadTextureAsync(path) {
      return new Promise((resolve, reject) => {
        this.loadTexture(
          path,
          (_, texture) => resolve(texture),
          (_, message) => reject(message)
        );
      });
    }
    async loadTextureAtlasAsync(path) {
      return new Promise((resolve, reject) => {
        this.loadTextureAtlas(
          path,
          (_, atlas) => resolve(atlas),
          (_, message) => reject(message)
        );
      });
    }
    async loadTextureAtlasButNoTexturesAsync(path) {
      return new Promise((resolve, reject) => {
        this.loadTextureAtlasButNoTextures(
          path,
          (_, atlas) => resolve(atlas),
          (_, message) => reject(message)
        );
      });
    }
    setCache(cache) {
      this.cache = cache;
    }
    get(path) {
      return this.cache.assets[this.pathPrefix + path];
    }
    require(path) {
      path = this.pathPrefix + path;
      const asset = this.cache.assets[path];
      if (asset) return asset;
      const error = this.errors[path];
      throw Error(`Asset not found: ${path}${error ? `
${error}` : ""}`);
    }
    remove(path) {
      path = this.pathPrefix + path;
      const asset = this.cache.assets[path];
      if (asset.dispose) asset.dispose();
      delete this.cache.assets[path];
      delete this.cache.assetsRefCount[path];
      delete this.cache.assetsLoaded[path];
      return asset;
    }
    removeAll() {
      for (const path in this.cache.assets) {
        const asset = this.cache.assets[path];
        if (asset.dispose) asset.dispose();
      }
      this.cache.assets = {};
      this.cache.assetsLoaded = {};
      this.cache.assetsRefCount = {};
    }
    isLoadingComplete() {
      return this.toLoad === 0;
    }
    getToLoad() {
      return this.toLoad;
    }
    getLoaded() {
      return this.loaded;
    }
    dispose() {
      this.removeAll();
    }
    // dispose asset only if it's not used by others
    disposeAsset(path) {
      const asset = this.cache.assets[path];
      if (asset instanceof TextureAtlas) {
        asset.dispose();
        return;
      }
      this.disposeAssetInternal(path);
    }
    hasErrors() {
      return Object.keys(this.errors).length > 0;
    }
    getErrors() {
      return this.errors;
    }
    disposeAssetInternal(path) {
      if (this.cache.assetsRefCount[path] > 0 && --this.cache.assetsRefCount[path] === 0) {
        return this.remove(path);
      }
    }
    createTextureAtlas(atlasText, parentPath, path, fileAlias) {
      const atlas = new TextureAtlas(atlasText);
      atlas.dispose = () => {
        if (this.cache.assetsRefCount[path] <= 0) return;
        this.disposeAssetInternal(path);
        for (const page of atlas.pages) {
          page.texture?.dispose();
        }
      };
      for (const page of atlas.pages) {
        const texturePath = this.texturePath(parentPath, page.name, fileAlias);
        this.texturePmaInfo[this.pathPrefix + texturePath] = page.pma;
      }
      return atlas;
    }
    createTexture(path, pma, image) {
      const texture = this.textureLoader(image, pma);
      const textureDispose = texture.dispose.bind(texture);
      texture.dispose = () => {
        if (this.disposeAssetInternal(path)) textureDispose();
      };
      return texture;
    }
    texturePath(parentPath, pageName, fileAlias) {
      if (!fileAlias) return parentPath + pageName;
      return fileAlias[pageName];
    }
  };
  var AssetCache = class _AssetCache {
    assets = {};
    assetsRefCount = {};
    assetsLoaded = {};
    static AVAILABLE_CACHES = /* @__PURE__ */ new Map();
    static getCache(id) {
      const cache = _AssetCache.AVAILABLE_CACHES.get(id);
      if (cache) return cache;
      const newCache = new _AssetCache();
      _AssetCache.AVAILABLE_CACHES.set(id, newCache);
      return newCache;
    }
    async addAsset(path, asset) {
      this.assetsLoaded[path] = Promise.resolve(asset);
      this.assets[path] = asset;
      return asset;
    }
    getAsset(path) {
      return this.assetsLoaded[path];
    }
  };
  var Downloader = class {
    callbacks = {};
    rawDataUris = {};
    dataUriToString(dataUri) {
      if (!dataUri.startsWith("data:")) {
        throw new Error("Not a data URI.");
      }
      let base64Idx = dataUri.indexOf("base64,");
      if (base64Idx !== -1) {
        base64Idx += "base64,".length;
        return atob(dataUri.substr(base64Idx));
      } else {
        return dataUri.substr(dataUri.indexOf(",") + 1);
      }
    }
    base64ToUint8Array(base64) {
      var binary_string = window.atob(base64);
      var len = binary_string.length;
      var bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
      }
      return bytes;
    }
    dataUriToUint8Array(dataUri) {
      if (!dataUri.startsWith("data:")) {
        throw new Error("Not a data URI.");
      }
      let base64Idx = dataUri.indexOf("base64,");
      if (base64Idx === -1) throw new Error("Not a binary data URI.");
      base64Idx += "base64,".length;
      return this.base64ToUint8Array(dataUri.substr(base64Idx));
    }
    downloadText(url, success, error) {
      if (this.start(url, success, error)) return;
      const rawDataUri = this.rawDataUris[url];
      if (rawDataUri && !rawDataUri.includes(".")) {
        try {
          this.finish(url, 200, this.dataUriToString(rawDataUri));
        } catch (e) {
          this.finish(url, 400, JSON.stringify(e));
        }
        return;
      }
      const request = new XMLHttpRequest();
      request.overrideMimeType("text/html");
      request.open("GET", rawDataUri ? rawDataUri : url, true);
      const done = () => {
        this.finish(url, request.status, request.responseText);
      };
      request.onload = done;
      request.onerror = done;
      request.send();
    }
    downloadJson(url, success, error) {
      this.downloadText(url, (data) => {
        success(JSON.parse(data));
      }, error);
    }
    downloadBinary(url, success, error) {
      if (this.start(url, success, error)) return;
      const rawDataUri = this.rawDataUris[url];
      if (rawDataUri && !rawDataUri.includes(".")) {
        try {
          this.finish(url, 200, this.dataUriToUint8Array(rawDataUri));
        } catch (e) {
          this.finish(url, 400, JSON.stringify(e));
        }
        return;
      }
      const request = new XMLHttpRequest();
      request.open("GET", rawDataUri ? rawDataUri : url, true);
      request.responseType = "arraybuffer";
      const onerror = () => {
        this.finish(url, request.status, request.response);
      };
      request.onload = () => {
        if (request.status === 200 || request.status === 0)
          this.finish(url, 200, new Uint8Array(request.response));
        else
          onerror();
      };
      request.onerror = onerror;
      request.send();
    }
    start(url, success, error) {
      let callbacks = this.callbacks[url];
      try {
        if (callbacks) return true;
        this.callbacks[url] = callbacks = [];
      } finally {
        callbacks.push(success, error);
      }
    }
    finish(url, status, data) {
      const callbacks = this.callbacks[url];
      delete this.callbacks[url];
      if (status === 200 || status === 0) {
        for (let i = 0, n = callbacks.length; i < n; i += 2)
          callbacks[i](data);
      } else {
        for (let i = 1, n = callbacks.length; i < n; i += 2)
          callbacks[i](status, data);
      }
    }
  };

  // spine-core/src/attachments/BoundingBoxAttachment.ts
  var BoundingBoxAttachment = class _BoundingBoxAttachment extends VertexAttachment {
    color = new Color(1, 1, 1, 1);
    constructor(name) {
      super(name);
    }
    copy() {
      const copy = new _BoundingBoxAttachment(this.name);
      this.copyTo(copy);
      copy.color.setFromColor(this.color);
      return copy;
    }
  };

  // spine-core/src/attachments/ClippingAttachment.ts
  var ClippingAttachment = class _ClippingAttachment extends VertexAttachment {
    /** Clipping is performed between the clipping attachment's slot and the end slot. If null, clipping is done until the end of
     * the skeleton's rendering. */
    endSlot = null;
    /** When true the clipping polygon is treated as convex for more efficient clipping. If the polygon deforms to concave then the
     * convex hull is used. When false the clipping polygon can be concave and if so has an additional CPU cost. Inverse clipping
     * always uses convex. */
    convex = false;
    /** When false, everything inside the clipping polygon is visible. When true, everything outside the clipping polygon is
      * visible and clipping is convex. */
    inverse = false;
    // Nonessential.
    /** The color of the clipping polygon as it was in Spine. Available only when nonessential data was exported. Clipping polygons
     * are not usually rendered at runtime. */
    color = new Color(0.2275, 0.2275, 0.8078, 1);
    // ce3a3aff
    constructor(name) {
      super(name);
    }
    copy() {
      const copy = new _ClippingAttachment(this.name);
      this.copyTo(copy);
      copy.endSlot = this.endSlot;
      copy.convex = this.convex;
      copy.inverse = this.inverse;
      copy.color.setFromColor(this.color);
      return copy;
    }
  };

  // spine-core/src/attachments/PathAttachment.ts
  var PathAttachment = class _PathAttachment extends VertexAttachment {
    /** The lengths along the path in the setup pose from the start of the path to the end of each Bezier curve. */
    lengths = [];
    /** If true, the start and end knots are connected. */
    closed = false;
    /** If true, additional calculations are performed to make computing positions along the path more accurate so movement along
     * the path has a constant speed. */
    constantSpeed = false;
    /** The color of the path as it was in Spine. Available only when nonessential data was exported. Paths are not usually
     * rendered at runtime. */
    color = new Color(1, 1, 1, 1);
    constructor(name) {
      super(name);
    }
    copy() {
      const copy = new _PathAttachment(this.name);
      this.copyTo(copy);
      copy.lengths = [];
      Utils.arrayCopy(this.lengths, 0, copy.lengths, 0, this.lengths.length);
      copy.closed = this.closed;
      copy.constantSpeed = this.constantSpeed;
      copy.color.setFromColor(this.color);
      return copy;
    }
  };

  // spine-core/src/attachments/PointAttachment.ts
  var PointAttachment = class _PointAttachment extends VertexAttachment {
    /** The local x position. */
    x = 0;
    /** The local y position. */
    y = 0;
    /** The local rotation in degrees, counter clockwise. */
    rotation = 0;
    /** The color of the point attachment as it was in Spine. Available only when nonessential data was exported. Point attachments
     * are not usually rendered at runtime. */
    color = new Color(0.38, 0.94, 0, 1);
    constructor(name) {
      super(name);
    }
    /** Computes the world position from the local position. */
    computeWorldPosition(bone, point) {
      point.x = this.x * bone.a + this.y * bone.b + bone.worldX;
      point.y = this.x * bone.c + this.y * bone.d + bone.worldY;
      return point;
    }
    /** Computes the world rotation from the local rotation. */
    computeWorldRotation(bone) {
      const r = this.rotation * MathUtils.degRad, cos = Math.cos(r), sin = Math.sin(r);
      const x = cos * bone.a + sin * bone.b;
      const y = cos * bone.c + sin * bone.d;
      return MathUtils.atan2Deg(y, x);
    }
    copy() {
      const copy = new _PointAttachment(this.name);
      copy.x = this.x;
      copy.y = this.y;
      copy.rotation = this.rotation;
      copy.color.setFromColor(this.color);
      return copy;
    }
  };

  // spine-core/src/AtlasAttachmentLoader.ts
  var AtlasAttachmentLoader = class {
    atlas;
    allowMissingRegions;
    constructor(atlas, allowMissingRegions = false) {
      this.atlas = atlas;
      this.allowMissingRegions = allowMissingRegions;
    }
    /** Sets each {@link Sequence.regions} by calling {@link findRegion} for each texture region using
     * {@link Sequence.getPath}. */
    findRegions(name, basePath, sequence) {
      const regions = sequence.regions;
      for (let i = 0, n = regions.length; i < n; i++)
        regions[i] = this.findRegion(name, sequence.getPath(basePath, i));
    }
    /** Looks for the region with the specified path. If not found and {@link allowMissingRegions} is false, an error is
     * raised. */
    findRegion(name, path) {
      const region = this.atlas.findRegion(path);
      if (!region && !this.allowMissingRegions)
        throw new Error(`Region not found in atlas: ${path} (attachment: ${name})`);
      return region;
    }
    newRegionAttachment(skin, placeholder, name, path, sequence) {
      this.findRegions(name, path, sequence);
      return new RegionAttachment(name, sequence);
    }
    newMeshAttachment(skin, placeholder, name, path, sequence) {
      this.findRegions(name, path, sequence);
      return new MeshAttachment(name, sequence);
    }
    newBoundingBoxAttachment(skin, placeholder, name) {
      return new BoundingBoxAttachment(name);
    }
    newPathAttachment(skin, placeholder, name) {
      return new PathAttachment(name);
    }
    newPointAttachment(skin, placeholder, name) {
      return new PointAttachment(name);
    }
    newClippingAttachment(skin, placeholder, name) {
      return new ClippingAttachment(name);
    }
  };

  // spine-core/src/PosedData.ts
  var PosedData = class {
    name;
    setupPose;
    /** When true, {@link Skeleton.updateWorldTransform} only updates this constraint if the {@link Skeleton.skin}
     * contains this constraint.
     *
     * See {@link Skin.constraints}. */
    skinRequired = false;
    constructor(name, setupPose) {
      if (name == null) throw new Error("name cannot be null.");
      this.name = name;
      this.setupPose = setupPose;
    }
  };

  // spine-core/src/BoneData.ts
  var BoneData = class _BoneData extends PosedData {
    /** The index of the bone in {@link Skeleton.bones}. */
    index = 0;
    /** The parent bone, or null if this bone is the root. */
    parent = null;
    /** The bone's length. */
    length = 0;
    // Nonessential.
    /** The color of the bone as it was in Spine. Available only when nonessential data was exported. Bones are not usually
     * rendered at runtime. */
    color = new Color();
    /** The bone icon name as it was in Spine, or null if nonessential data was not exported. */
    icon;
    /** The bone icon's display size scale, or 1 if nonessential data was not exported. */
    iconSize = 1;
    /** The bone icon's display rotation in degrees, or 0 if nonessential data was not exported. */
    iconRotation = 0;
    /** False if the bone was hidden in Spine and nonessential data was exported. Does not affect runtime rendering. */
    visible = false;
    constructor(index, name, parent) {
      super(name, new BonePose());
      if (index < 0) throw new Error("index must be >= 0.");
      if (!name) throw new Error("name cannot be null.");
      this.index = index;
      this.parent = parent;
    }
    copy(parent) {
      const copy = new _BoneData(this.index, this.name, parent);
      copy.length = this.length;
      copy.setupPose.set(this.setupPose);
      return copy;
    }
  };
  var Inherit = /* @__PURE__ */ ((Inherit2) => {
    Inherit2[Inherit2["Normal"] = 0] = "Normal";
    Inherit2[Inherit2["OnlyTranslation"] = 1] = "OnlyTranslation";
    Inherit2[Inherit2["NoRotationOrReflection"] = 2] = "NoRotationOrReflection";
    Inherit2[Inherit2["NoScale"] = 3] = "NoScale";
    Inherit2[Inherit2["NoScaleOrReflection"] = 4] = "NoScaleOrReflection";
    return Inherit2;
  })(Inherit || {});

  // spine-core/src/BonePose.ts
  var BonePose = class {
    bone;
    /** The local x translation. */
    x = 0;
    /** The local y translation. */
    y = 0;
    /** The local rotation in degrees, counter clockwise. */
    rotation = 0;
    /** The local scaleX. */
    scaleX = 0;
    /** The local scaleY. */
    scaleY = 0;
    /** The local shearX. */
    shearX = 0;
    /** The local shearY. */
    shearY = 0;
    inherit = 0 /* Normal */;
    /** The world transform `[a b][c d]` x-axis x component. */
    a = 0;
    /** The world transform `[a b][c d]` y-axis x component. */
    b = 0;
    /** The world transform `[a b][c d]` x-axis y component. */
    c = 0;
    /** The world transform `[a b][c d]` y-axis y component. */
    d = 0;
    /** The world X position. If changed, {@link updateLocalTransform} should be called. */
    worldY = 0;
    /** The world Y position. If changed, {@link updateLocalTransform} should be called. */
    worldX = 0;
    world = 0;
    local = 0;
    set(pose) {
      if (pose == null) throw new Error("pose cannot be null.");
      this.x = pose.x;
      this.y = pose.y;
      this.rotation = pose.rotation;
      this.scaleX = pose.scaleX;
      this.scaleY = pose.scaleY;
      this.shearX = pose.shearX;
      this.shearY = pose.shearY;
      this.inherit = pose.inherit;
    }
    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }
    setScale(scaleOrX, scaleY) {
      this.scaleX = scaleOrX;
      this.scaleY = scaleY === void 0 ? scaleOrX : scaleY;
    }
    /** Determines how parent world transforms affect this bone. */
    getInherit() {
      return this.inherit;
    }
    setInherit(inherit) {
      if (inherit == null) throw new Error("inherit cannot be null.");
      this.inherit = inherit;
    }
    /** Called by {@link Skeleton.updateCache} to compute the world transform, if needed. */
    update(skeleton, physics) {
      if (this.world !== skeleton._update) this.updateWorldTransform(skeleton);
    }
    /** Computes the world transform using the parent bone's world transform and this applied local pose. Child bones are not
     * updated.
     *
     * See <a href="https://esotericsoftware.com/spine-runtime-skeletons#World-transforms">World transforms</a> in the Spine
     * Runtimes Guide. */
    updateWorldTransform(skeleton) {
      if (this.local === skeleton._update)
        this.updateLocalTransform(skeleton);
      else
        this.world = skeleton._update;
      const rotation = this.rotation;
      const scaleX = this.scaleX;
      const scaleY = this.scaleY;
      const shearX = this.shearX;
      const shearY = this.shearY;
      if (!this.bone.parent) {
        const sx = skeleton.scaleX, sy = skeleton.scaleY;
        const rx = (rotation + shearX) * MathUtils.degRad;
        const ry = (rotation + 90 + shearY) * MathUtils.degRad;
        this.a = Math.cos(rx) * scaleX * sx;
        this.b = Math.cos(ry) * scaleY * sx;
        this.c = Math.sin(rx) * scaleX * sy;
        this.d = Math.sin(ry) * scaleY * sy;
        this.worldX = this.x * sx + skeleton.x;
        this.worldY = this.y * sy + skeleton.y;
        return;
      }
      const parent = this.bone.parent.appliedPose;
      let pa = parent.a, pb = parent.b, pc = parent.c, pd = parent.d;
      this.worldX = pa * this.x + pb * this.y + parent.worldX;
      this.worldY = pc * this.x + pd * this.y + parent.worldY;
      switch (this.inherit) {
        case 0 /* Normal */: {
          const rx = (rotation + shearX) * MathUtils.degRad;
          const ry = (rotation + 90 + shearY) * MathUtils.degRad;
          const la = Math.cos(rx) * scaleX;
          const lb = Math.cos(ry) * scaleY;
          const lc = Math.sin(rx) * scaleX;
          const ld = Math.sin(ry) * scaleY;
          this.a = pa * la + pb * lc;
          this.b = pa * lb + pb * ld;
          this.c = pc * la + pd * lc;
          this.d = pc * lb + pd * ld;
          return;
        }
        case 1 /* OnlyTranslation */: {
          const sx = skeleton.scaleX, sy = skeleton.scaleY;
          const rx = (rotation + shearX) * MathUtils.degRad;
          const ry = (rotation + 90 + shearY) * MathUtils.degRad;
          this.a = Math.cos(rx) * scaleX * sx;
          this.b = Math.cos(ry) * scaleY * sx;
          this.c = Math.sin(rx) * scaleX * sy;
          this.d = Math.sin(ry) * scaleY * sy;
          break;
        }
        case 2 /* NoRotationOrReflection */: {
          const sx = skeleton.scaleX, sy = skeleton.scaleY, sxi = 1 / sx, syi = 1 / sy;
          pa *= sxi;
          pc *= syi;
          let s = pa * pa + pc * pc;
          let r = 0;
          if (s > MathUtils.epsilon2) {
            s = Math.abs(pa * pd * syi - pb * sxi * pc) / s;
            pb = pc * s;
            pd = pa * s;
            r = rotation - MathUtils.atan2Deg(pc, pa);
          } else {
            pa = 0;
            pc = 0;
            r = rotation - 90 + MathUtils.atan2Deg(pd, pb);
          }
          const rx = (r + shearX) * MathUtils.degRad;
          const ry = (r + shearY + 90) * MathUtils.degRad;
          const la = Math.cos(rx) * scaleX;
          const lb = Math.cos(ry) * scaleY;
          const lc = Math.sin(rx) * scaleX;
          const ld = Math.sin(ry) * scaleY;
          this.a = (pa * la - pb * lc) * sx;
          this.b = (pa * lb - pb * ld) * sx;
          this.c = (pc * la + pd * lc) * sy;
          this.d = (pc * lb + pd * ld) * sy;
          break;
        }
        case 3 /* NoScale */:
        case 4 /* NoScaleOrReflection */: {
          const sx = skeleton.scaleX, sy = skeleton.scaleY, sxi = 1 / sx, syi = 1 / sy;
          const r = rotation * MathUtils.degRad, cos = Math.cos(r), sin = Math.sin(r);
          let za = (pa * cos + pb * sin) * sxi;
          let zc = (pc * cos + pd * sin) * syi;
          const s = 1 / Math.sqrt(za * za + zc * zc);
          za *= s;
          zc *= s;
          let zb = -zc, zd = za;
          if (this.inherit === 3 /* NoScale */ && pa * pd - pb * pc < 0 !== (sx < 0 !== sy < 0)) {
            zb = -zb;
            zd = -zd;
          }
          const rx = shearX * MathUtils.degRad;
          const ry = (90 + shearY) * MathUtils.degRad;
          const la = Math.cos(rx) * scaleX;
          const lb = Math.cos(ry) * scaleY;
          const lc = Math.sin(rx) * scaleX;
          const ld = Math.sin(ry) * scaleY;
          this.a = (za * la + zb * lc) * sx;
          this.b = (za * lb + zb * ld) * sx;
          this.c = (zc * la + zd * lc) * sy;
          this.d = (zc * lb + zd * ld) * sy;
          break;
        }
      }
    }
    /** Computes the local transform values from the world transform.
     *
     * If the world transform is modified (by a constraint, {@link rotateWorld}, etc) then this method should be called so
     * the local transform matches the world transform. The local transform may be needed by other code (eg to apply another
     * constraint).
     *
     * Some information is ambiguous in the world transform, such as -1,-1 scale versus 180 rotation. The local transform after
     * calling this method is equivalent to the local transform used to compute the world transform, but may not be identical. */
    updateLocalTransform(skeleton) {
      this.local = 0;
      this.world = skeleton._update;
      const sx = skeleton.scaleX, sy = skeleton.scaleY;
      if (!this.bone.parent) {
        const sxi = 1 / sx, syi = 1 / sy;
        this.x = (this.worldX - skeleton.x) * sxi;
        this.y = (this.worldY - skeleton.y) * syi;
        this.set5(this.a * sxi, this.b * sxi, this.c * syi, this.d * syi, 0);
        return;
      }
      const parent = this.bone.parent.appliedPose;
      let pa = parent.a, pb = parent.b, pc = parent.c, pd = parent.d;
      const pad = pa * pd - pb * pc, pid = 1 / (pa * pd - pb * pc);
      const ia = pd * pid, ib = pb * pid, ic = pc * pid, id = pa * pid;
      const dx = this.worldX - parent.worldX, dy = this.worldY - parent.worldY;
      this.x = dx * ia - dy * ib;
      this.y = dy * id - dx * ic;
      switch (this.inherit) {
        case 0 /* Normal */:
          this.set5(ia * this.a - ib * this.c, ia * this.b - ib * this.d, id * this.c - ic * this.a, id * this.d - ic * this.b, 0);
          break;
        case 1 /* OnlyTranslation */: {
          const sxi = 1 / sx, syi = 1 / sy;
          this.set5(this.a * sxi, this.b * sxi, this.c * syi, this.d * syi, 0);
          break;
        }
        case 2 /* NoRotationOrReflection */: {
          const sxi = 1 / sx, syi = 1 / sy;
          pa *= sxi;
          pc *= syi;
          const wa = this.a * sxi, wb = this.b * sxi, wc = this.c * syi, wd = this.d * syi;
          const s = 1 / (pa * pa + pc * pc), det = 1 / Math.abs(pad * sxi * syi);
          this.set5(
            (pa * wa + pc * wc) * s,
            (pa * wb + pc * wd) * s,
            (pa * wc - pc * wa) * det,
            (pa * wd - pc * wb) * det,
            MathUtils.atan2Deg(pc, pa)
          );
          break;
        }
        case 3 /* NoScale */:
        case 4 /* NoScaleOrReflection */: {
          const sxi = 1 / sx, syi = 1 / sy;
          const wa = this.a * sxi, wb = this.b * sxi, wc = this.c * syi, wd = this.d * syi;
          let tx = pd * this.a - pb * this.c, ty = pa * this.c - pc * this.a;
          if (pad < 0) {
            tx = -tx;
            ty = -ty;
          }
          let r = MathUtils.atan2Deg(ty, tx);
          this.rotation = r;
          r *= MathUtils.degRad;
          const cos = Math.cos(r), sin = Math.sin(r);
          let za = (pa * cos + pb * sin) * sxi;
          let zc = (pc * cos + pd * sin) * syi;
          const s = 1 / Math.sqrt(za * za + zc * zc);
          za *= s;
          zc *= s;
          const si = this.inherit === 3 /* NoScale */ && pad < 0 !== (sx < 0 !== sy < 0) ? -1 : 1;
          this.set4(za * wa + zc * wc, za * wb + zc * wd, (za * wc - zc * wa) * si, (za * wd - zc * wb) * si);
        }
      }
    }
    set4(ra, rb, rc, rd) {
      const x = ra * ra + rc * rc, y = rb * rb + rd * rd;
      if (x > MathUtils.epsilon2) {
        this.shearX = MathUtils.atan2Deg(rc, ra);
        this.scaleX = Math.sqrt(x);
      } else {
        this.shearX = 0;
        this.scaleX = 0;
      }
      this.scaleY = Math.sqrt(y);
      if (y > MathUtils.epsilon2) {
        this.shearY = MathUtils.atan2Deg(rd, rb);
        if (ra * rd - rb * rc < 0) {
          this.scaleY = -this.scaleY;
          this.shearY += 90;
        } else
          this.shearY -= 90;
        if (this.shearY > 180)
          this.shearY -= 360;
        else if (this.shearY <= -180)
          this.shearY += 360;
      } else
        this.shearY = 0;
    }
    set5(ra, rb, rc, rd, ro) {
      this.shearX = 0;
      const x = ra * ra + rc * rc, y = rb * rb + rd * rd;
      if (x > MathUtils.epsilon2) {
        const r = MathUtils.atan2Deg(rc, ra);
        this.rotation = r + ro;
        this.scaleX = Math.sqrt(x);
        this.scaleY = Math.sqrt(y);
        if (y > MathUtils.epsilon2) {
          this.shearY = MathUtils.atan2Deg(rd, rb);
          if (ra * rd - rb * rc < 0) {
            this.scaleY = -this.scaleY;
            this.shearY += 90 - r;
          } else
            this.shearY -= 90 + r;
          if (this.shearY > 180)
            this.shearY -= 360;
          else if (this.shearY <= -180)
            this.shearY += 360;
        } else
          this.shearY = 0;
      } else {
        this.scaleX = 0;
        this.scaleY = Math.sqrt(y);
        this.shearY = 0;
        this.rotation = y > MathUtils.epsilon2 ? MathUtils.atan2Deg(rd, rb) - 90 + ro : ro;
      }
    }
    /** If the world transform has been modified by constraints and the local transform no longer matches,
     * {@link updateLocalTransform} is called. Call this after {@link Skeleton.updateWorldTransform} before
     * using the applied local transform. */
    validateLocalTransform(skeleton) {
      if (this.local === skeleton._update) this.updateLocalTransform(skeleton);
    }
    modifyLocal(skeleton) {
      if (this.local === skeleton._update) this.updateLocalTransform(skeleton);
      this.world = 0;
      this.resetWorld(skeleton, skeleton._update);
    }
    modifyWorld(skeleton) {
      const update = skeleton._update;
      this.local = update;
      this.world = update;
      this.resetWorld(skeleton, update);
    }
    resetWorld(skeleton, update) {
      const children = this.bone.children;
      for (let i = 0, n = children.length; i < n; i++) {
        const child = children[i].appliedPose;
        if (child.world === update) {
          if (child.local === update) child.updateLocalTransform(skeleton);
          child.world = 0;
          child.resetWorld(skeleton, update);
        }
      }
    }
    /** The world rotation for the X axis, calculated using {@link a} and {@link c}. This is the direction the bone is
     * pointing. */
    getWorldRotationX() {
      return MathUtils.atan2Deg(this.c, this.a);
    }
    /** The world rotation for the Y axis, calculated using {@link b} and {@link d}. */
    getWorldRotationY() {
      return MathUtils.atan2Deg(this.d, this.b);
    }
    /** The magnitude (always positive) of the world scale X, calculated using {@link a} and {@link c}. */
    getWorldScaleX() {
      return Math.sqrt(this.a * this.a + this.c * this.c);
    }
    /** The magnitude (always positive) of the world scale Y, calculated using {@link b} and {@link d}. */
    getWorldScaleY() {
      return Math.sqrt(this.b * this.b + this.d * this.d);
    }
    // public Matrix3 getWorldTransform (Matrix3 worldTransform) {
    // 	if (worldTransform == null) throw new IllegalArgumentException("worldTransform cannot be null.");
    // 	float[] val = worldTransform.val;
    // 	val[M00] = a;
    // 	val[M01] = b;
    // 	val[M10] = c;
    // 	val[M11] = d;
    // 	val[M02] = worldX;
    // 	val[M12] = worldY;
    // 	val[M20] = 0;
    // 	val[M21] = 0;
    // 	val[M22] = 1;
    // 	return worldTransform;
    // }
    /** Transforms a point from world coordinates to the bone's local coordinates. */
    worldToLocal(world) {
      if (world == null) throw new Error("world cannot be null.");
      const det = this.a * this.d - this.b * this.c;
      const x = world.x - this.worldX, y = world.y - this.worldY;
      world.x = (x * this.d - y * this.b) / det;
      world.y = (y * this.a - x * this.c) / det;
      return world;
    }
    /** Transforms a point from the bone's local coordinates to world coordinates. */
    localToWorld(local) {
      if (local == null) throw new Error("local cannot be null.");
      const x = local.x, y = local.y;
      local.x = x * this.a + y * this.b + this.worldX;
      local.y = x * this.c + y * this.d + this.worldY;
      return local;
    }
    /** Transforms a point from world coordinates to the parent bone's local coordinates. */
    worldToParent(world) {
      if (world == null) throw new Error("world cannot be null.");
      return this.bone.parent == null ? world : this.bone.parent.appliedPose.worldToLocal(world);
    }
    /** Transforms a point from the parent bone's coordinates to world coordinates. */
    parentToWorld(world) {
      if (world == null) throw new Error("world cannot be null.");
      return this.bone.parent == null ? world : this.bone.parent.appliedPose.localToWorld(world);
    }
    /** Transforms a world rotation to a local rotation. */
    worldToLocalRotation(worldRotation) {
      worldRotation *= MathUtils.degRad;
      const sin = Math.sin(worldRotation), cos = Math.cos(worldRotation);
      return MathUtils.atan2Deg(this.a * sin - this.c * cos, this.d * cos - this.b * sin) + this.rotation - this.shearX;
    }
    /** Transforms a local rotation to a world rotation. */
    localToWorldRotation(localRotation) {
      localRotation = (localRotation - this.rotation - this.shearX) * MathUtils.degRad;
      const sin = Math.sin(localRotation), cos = Math.cos(localRotation);
      return MathUtils.atan2Deg(cos * this.c + sin * this.d, cos * this.a + sin * this.b);
    }
    /** Rotates the world transform the specified amount. */
    rotateWorld(degrees) {
      degrees *= MathUtils.degRad;
      const sin = Math.sin(degrees), cos = Math.cos(degrees);
      const ra = this.a, rb = this.b;
      this.a = cos * ra - sin * this.c;
      this.b = cos * rb - sin * this.d;
      this.c = sin * ra + cos * this.c;
      this.d = sin * rb + cos * this.d;
    }
  };

  // spine-core/src/Posed.ts
  var Posed = class {
    /** The constraint's setup pose data. */
    data;
    pose;
    constrainedPose;
    appliedPose;
    constructor(data, pose, constrainedPose) {
      if (data == null) throw new Error("data cannot be null.");
      this.data = data;
      this.pose = pose;
      this.constrainedPose = constrainedPose;
      this.appliedPose = pose;
    }
    /** Sets the unconstrained pose to the setup pose. */
    setupPose() {
      this.pose.set(this.data.setupPose);
    }
    /** The setup pose data. May be shared with multiple instances. */
    getData() {
      return this.data;
    }
    /** The unconstrained pose for this object, set by animations and application code. */
    getPose() {
      return this.pose;
    }
    /** The pose to use for rendering. If no constraints modify this pose, this is the same as {@link pose}. Otherwise it is a
     * copy of {@link pose} modified by constraints. */
    getAppliedPose() {
      return this.appliedPose;
    }
    /** Sets the applied pose to the unconstrained pose, for when no constraints will modify the pose. */
    unconstrained() {
      this.appliedPose = this.pose;
    }
    /** Sets the applied pose to the constrained pose, in anticipation of the applied pose being modified by constraints. */
    constrained() {
      this.appliedPose = this.constrainedPose;
    }
    /** Sets the constrained pose to the unconstrained pose, as a starting point for constraints to be applied. */
    resetConstrained() {
      this.constrainedPose.set(this.pose);
    }
  };

  // spine-core/src/PosedActive.ts
  var PosedActive = class extends Posed {
    active = false;
    constructor(data, pose, constrained) {
      super(data, pose, constrained);
      this.setupPose();
    }
    /** Returns false when this constraint won't be updated by
     * {@link Skeleton.updateWorldTransform} because a skin is required and the
     * {@link Skeleton.skin active skin} does not contain this item. See {@link Skin.bones}, {@link Skin.constraints},
     * {@link PosedData.skinRequired}, and {@link Skeleton.updateCache}. */
    isActive() {
      return this.active;
    }
  };

  // spine-core/src/Bone.ts
  var Bone = class _Bone extends PosedActive {
    /** The parent bone, or null if this is the root bone. */
    parent = null;
    /** The immediate children of this bone. */
    children = [];
    sorted = false;
    constructor(data, parent) {
      super(data, new BonePose(), new BonePose());
      this.parent = parent;
      this.appliedPose.bone = this;
      this.constrainedPose.bone = this;
    }
    /** Copy constructor. Does not copy the {@link children} bones. */
    copy(parent) {
      const copy = new _Bone(this.data, parent);
      copy.pose.set(this.pose);
      return copy;
    }
  };

  // spine-core/src/Constraint.ts
  var Constraint = class extends PosedActive {
    constructor(data, pose, constrained) {
      super(data, pose, constrained);
    }
    isSourceActive() {
      return true;
    }
  };

  // spine-core/src/DrawOrder.ts
  var DrawOrder = class {
    _setupPose;
    /** The unconstrained draw order, set by animations and application code. */
    pose;
    constrainedPose;
    /** The constrained draw order for rendering. If no constraints modify the draw order, this is the same as {@link pose}.
     * Otherwise it is a copy of {@link pose} modified by constraints. */
    appliedPose;
    constructor(setupPose) {
      this._setupPose = setupPose;
      this.pose = [...setupPose];
      this.constrainedPose = [];
      this.appliedPose = this.pose;
    }
    /** Sets the unconstrained draw order to the setup pose order. */
    setupPose() {
      this.pose.length = this._setupPose.length;
      Utils.arrayCopy(this._setupPose, 0, this.pose, 0, this._setupPose.length);
    }
    /** Sets the applied pose to the unconstrained pose, for when no constraints will modify the draw order. */
    unconstrained() {
      this.appliedPose = this.pose;
    }
    /** Sets the applied pose to the constrained pose, in anticipation of the applied pose being modified by constraints. */
    constrained() {
      this.appliedPose = this.constrainedPose;
    }
    /** Copies the unconstrained pose to the constrained pose, as a starting point for constraints to be applied. */
    resetConstrained() {
      this.constrainedPose.length = this.pose.length;
      Utils.arrayCopy(this.pose, 0, this.constrainedPose, 0, this.pose.length);
    }
  };

  // spine-core/src/ConstraintData.ts
  var ConstraintData = class extends PosedData {
    constructor(name, setup) {
      super(name, setup);
    }
  };
  var ScaleYMode = /* @__PURE__ */ ((ScaleYMode2) => {
    ScaleYMode2[ScaleYMode2["None"] = 0] = "None";
    ScaleYMode2[ScaleYMode2["Uniform"] = 1] = "Uniform";
    ScaleYMode2[ScaleYMode2["Volume"] = 2] = "Volume";
    return ScaleYMode2;
  })(ScaleYMode || {});

  // spine-core/src/Event.ts
  var Event = class {
    /** The animation time this event was keyed, or -1 for the setup pose. */
    time = 0;
    data;
    /** The integer payload for this event. */
    intValue = 0;
    /** The float payload for this event. */
    floatValue = 0;
    stringValue = null;
    /** If an audio path is set, the volume for the audio. */
    volume = 0;
    /** If an audio path is set, the left/right balance for the audio. */
    balance = 0;
    constructor(time, data) {
      if (!data) throw new Error("data cannot be null.");
      this.time = time;
      this.data = data;
    }
  };

  // spine-core/src/EventData.ts
  var EventData = class {
    /** The name of the event, unique across all events in the skeleton.
     *
     * See {@link SkeletonData.findEvent}. */
    name;
    _audioPath = null;
    /** Path to an audio file relative to the audio folder as defined in Spine. */
    get audioPath() {
      return this._audioPath;
    }
    set audioPath(audioPath) {
      if (audioPath == null) throw new Error("audioPath cannot be null.");
      this._audioPath = audioPath;
    }
    /** The setup values that are shared by all events with this data. */
    setupPose = new Event(-1, this);
    constructor(name) {
      this.name = name;
    }
  };

  // spine-core/src/IkConstraintPose.ts
  var IkConstraintPose = class {
    /** For two bone IK, controls the bend direction of the IK bones, either 1 or -1. */
    bendDirection = 0;
    /** For one bone IK, when true and the target is too close, the bone is scaled to reach it. */
    compress = false;
    /** When true and the target is out of range, the parent bone is scaled to reach it.
     *
     * For two bone IK: 1) the child bone's local Y translation is set to 0, 2) stretch is not applied if {@link softness} is > 0,
     * and 3) if the parent bone has local nonuniform scale, stretch is not applied. */
    stretch = false;
    /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotation.
     *
     * For two bone IK: if the parent bone has local nonuniform scale, the child bone's local Y translation is set to 0. */
    mix = 0;
    /** For two bone IK, the target bone's distance from the maximum reach of the bones where rotation begins to slow. The bones
     * will not straighten completely until the target is this far out of range. */
    softness = 0;
    set(pose) {
      this.mix = pose.mix;
      this.softness = pose.softness;
      this.bendDirection = pose.bendDirection;
      this.compress = pose.compress;
      this.stretch = pose.stretch;
    }
  };

  // spine-core/src/IkConstraint.ts
  var IkConstraint = class _IkConstraint extends Constraint {
    /** The 1 or 2 bones that will be modified by this IK constraint. */
    bones;
    /** The bone that is the IK target. */
    target;
    constructor(data, skeleton) {
      super(data, new IkConstraintPose(), new IkConstraintPose());
      if (!skeleton) throw new Error("skeleton cannot be null.");
      this.bones = [];
      for (const boneData of data.bones)
        this.bones.push(skeleton.bones[boneData.index].constrainedPose);
      this.target = skeleton.bones[data.target.index];
    }
    copy(skeleton) {
      var copy = new _IkConstraint(this.data, skeleton);
      copy.pose.set(this.pose);
      return copy;
    }
    update(skeleton, physics) {
      const p = this.appliedPose;
      if (p.mix === 0) return;
      const target = this.target.appliedPose;
      const bones = this.bones;
      switch (bones.length) {
        case 1:
          _IkConstraint.apply(skeleton, bones[0], target.worldX, target.worldY, p.compress, p.stretch, this.data.scaleYMode, p.mix);
          break;
        case 2:
          _IkConstraint.apply(
            skeleton,
            bones[0],
            bones[1],
            target.worldX,
            target.worldY,
            p.bendDirection,
            p.stretch,
            this.data.scaleYMode,
            p.softness,
            p.mix
          );
          break;
      }
    }
    sort(skeleton) {
      skeleton.sortBone(this.target);
      const parent = this.bones[0].bone;
      skeleton.sortBone(parent);
      skeleton._updateCache.push(this);
      parent.sorted = false;
      skeleton.sortReset(parent.children);
      skeleton.constrained(parent);
      if (this.bones.length > 1) skeleton.constrained(this.bones[1].bone);
    }
    isSourceActive() {
      return this.target.active;
    }
    static apply(skeleton, boneOrParent, targetXorChild, targetYOrTargetX, compressOrTargetY, stretchOrBendDir, scaleYModeOrStretch, mixOrScaleYMode, softness, mix) {
      if (typeof targetXorChild === "number")
        _IkConstraint.apply1(skeleton, boneOrParent, targetXorChild, targetYOrTargetX, compressOrTargetY, stretchOrBendDir, scaleYModeOrStretch, mixOrScaleYMode);
      else
        _IkConstraint.apply2(
          skeleton,
          boneOrParent,
          targetXorChild,
          targetYOrTargetX,
          compressOrTargetY,
          stretchOrBendDir,
          scaleYModeOrStretch,
          mixOrScaleYMode,
          softness,
          mix
        );
    }
    static apply1(skeleton, bone, targetX, targetY, compress, stretch, scaleYMode, mix) {
      bone.modifyLocal(skeleton);
      const p = bone.bone.parent.appliedPose;
      let pa = p.a, pb = p.b, pc = p.c, pd = p.d;
      let rotationIK = -bone.shearX - bone.rotation, tx = 0, ty = 0;
      switch (bone.inherit) {
        case 1 /* OnlyTranslation */:
          tx = (targetX - bone.worldX) * MathUtils.signum(skeleton.scaleX);
          ty = (targetY - bone.worldY) * MathUtils.signum(skeleton.scaleY);
          break;
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: reference runtime
        case 2 /* NoRotationOrReflection */: {
          const s = Math.abs(pa * pd - pb * pc) / Math.max(MathUtils.epsilon, pa * pa + pc * pc);
          const sa = pa / skeleton.scaleX;
          const sc = pc / skeleton.scaleY;
          pb = -sc * s * skeleton.scaleX;
          pd = sa * s * skeleton.scaleY;
          rotationIK += MathUtils.atan2Deg(sc, sa);
        }
        // Fall through
        default: {
          const x = targetX - p.worldX, y = targetY - p.worldY;
          const d = pa * pd - pb * pc;
          if (Math.abs(d) <= MathUtils.epsilon) {
            tx = 0;
            ty = 0;
          } else {
            tx = (x * pd - y * pb) / d - bone.x;
            ty = (y * pa - x * pc) / d - bone.y;
          }
        }
      }
      rotationIK += MathUtils.atan2Deg(ty, tx);
      if (bone.scaleX < 0) rotationIK += 180;
      if (rotationIK > 180)
        rotationIK -= 360;
      else if (rotationIK <= -180)
        rotationIK += 360;
      bone.rotation += rotationIK * mix;
      if (compress || stretch) {
        switch (bone.inherit) {
          case 3 /* NoScale */:
          case 4 /* NoScaleOrReflection */:
            tx = targetX - bone.worldX;
            ty = targetY - bone.worldY;
        }
        const b = bone.bone.data.length * bone.scaleX;
        if (b > MathUtils.epsilon) {
          const dd = tx * tx + ty * ty;
          if (compress && dd < b * b || stretch && dd > b * b) {
            const s = (Math.sqrt(dd) / b - 1) * mix + 1;
            bone.scaleX *= s;
            switch (scaleYMode) {
              case 1 /* Uniform */:
                bone.scaleY *= s;
                break;
              case 2 /* Volume */:
                bone.scaleY /= s < 0.7 ? 0.25 + 0.642857 * s : s;
            }
          }
        }
      }
    }
    /** Applies 2 bone IK. The target is specified in the world coordinate system.
     * @param child A direct descendant of the parent bone. */
    static apply2(skeleton, parent, child, targetX, targetY, bendDir, stretch, scaleYMode, softness, mix) {
      if (parent.inherit !== 0 /* Normal */ || child.inherit !== 0 /* Normal */) return;
      parent.modifyLocal(skeleton);
      child.modifyLocal(skeleton);
      let px = parent.x, py = parent.y, psx = parent.scaleX, psy = parent.scaleY, csx = child.scaleX;
      let os1 = 0, os2 = 0, s2 = 0;
      if (psx < 0) {
        psx = -psx;
        os1 = 180;
        s2 = -1;
      } else {
        os1 = 0;
        s2 = 1;
      }
      if (psy < 0) {
        psy = -psy;
        s2 = -s2;
      }
      if (csx < 0) {
        csx = -csx;
        os2 = 180;
      } else
        os2 = 0;
      let cwx = 0, cwy = 0, a = parent.a, b = parent.b, c = parent.c, d = parent.d;
      const u = Math.abs(psx - psy) <= MathUtils.epsilon;
      if (!u || stretch) {
        child.y = 0;
        cwx = a * child.x + parent.worldX;
        cwy = c * child.x + parent.worldY;
      } else {
        cwx = a * child.x + b * child.y + parent.worldX;
        cwy = c * child.x + d * child.y + parent.worldY;
      }
      const pp = parent.bone.parent.appliedPose;
      a = pp.a;
      b = pp.b;
      c = pp.c;
      d = pp.d;
      let id = a * d - b * c, x = cwx - pp.worldX, y = cwy - pp.worldY;
      id = Math.abs(id) <= MathUtils.epsilon ? 0 : 1 / id;
      const dx = (x * d - y * b) * id - px, dy = (y * a - x * c) * id - py;
      let l1 = Math.sqrt(dx * dx + dy * dy), l2 = child.bone.data.length * csx, a1, a2;
      if (l1 < MathUtils.epsilon) {
        _IkConstraint.apply(skeleton, parent, targetX, targetY, false, stretch, 0 /* None */, mix);
        child.rotation = 0;
        return;
      }
      x = targetX - pp.worldX;
      y = targetY - pp.worldY;
      let tx = (x * d - y * b) * id - px, ty = (y * a - x * c) * id - py;
      let dd = tx * tx + ty * ty;
      if (softness !== 0) {
        softness *= psx * (csx + 1) * 0.5;
        const td = Math.sqrt(dd), sd = td - l1 - l2 * psx + softness;
        if (sd > 0) {
          let p = Math.min(1, sd / (softness * 2)) - 1;
          p = (sd - softness * (1 - p * p)) / td;
          tx -= p * tx;
          ty -= p * ty;
          dd = tx * tx + ty * ty;
        }
      }
      outer:
        if (u) {
          l2 *= psx;
          let cos = (dd - l1 * l1 - l2 * l2) / (2 * l1 * l2);
          if (cos < -1) {
            cos = -1;
            a2 = Math.PI * bendDir;
          } else if (cos > 1) {
            cos = 1;
            a2 = 0;
            if (stretch) {
              a = (Math.sqrt(dd) / (l1 + l2) - 1) * mix + 1;
              parent.scaleX *= a;
              switch (scaleYMode) {
                case 1 /* Uniform */:
                  parent.scaleY *= a;
                  break;
                case 2 /* Volume */:
                  parent.scaleY /= a < 0.7 ? 0.25 + 0.642857 * a : a;
              }
            }
          } else
            a2 = Math.acos(cos) * bendDir;
          a = l1 + l2 * cos;
          b = l2 * Math.sin(a2);
          a1 = Math.atan2(ty * a - tx * b, tx * a + ty * b);
        } else {
          a = psx * l2;
          b = psy * l2;
          const aa = a * a, bb = b * b, ta = Math.atan2(ty, tx);
          c = bb * l1 * l1 + aa * dd - aa * bb;
          const c1 = -2 * bb * l1, c2 = bb - aa;
          d = c1 * c1 - 4 * c2 * c;
          if (d >= 0) {
            let q = Math.sqrt(d);
            if (c1 < 0) q = -q;
            q = -(c1 + q) * 0.5;
            let r0 = q / c2, r1 = c / q;
            const r = Math.abs(r0) < Math.abs(r1) ? r0 : r1;
            r0 = dd - r * r;
            if (r0 >= 0) {
              y = Math.sqrt(r0) * bendDir;
              a1 = ta - Math.atan2(y, r);
              a2 = Math.atan2(y / psy, (r - l1) / psx);
              break outer;
            }
          }
          let minAngle = MathUtils.PI, minX = l1 - a, minDist = minX * minX, minY = 0;
          let maxAngle = 0, maxX = l1 + a, maxDist = maxX * maxX, maxY = 0;
          c = -a * l1 / (aa - bb);
          if (c >= -1 && c <= 1) {
            c = Math.acos(c);
            x = a * Math.cos(c) + l1;
            y = b * Math.sin(c);
            d = x * x + y * y;
            if (d < minDist) {
              minAngle = c;
              minDist = d;
              minX = x;
              minY = y;
            }
            if (d > maxDist) {
              maxAngle = c;
              maxDist = d;
              maxX = x;
              maxY = y;
            }
          }
          if (dd <= (minDist + maxDist) * 0.5) {
            a1 = ta - Math.atan2(minY * bendDir, minX);
            a2 = minAngle * bendDir;
          } else {
            a1 = ta - Math.atan2(maxY * bendDir, maxX);
            a2 = maxAngle * bendDir;
          }
        }
      const os = Math.atan2(child.y, child.x) * s2;
      a1 = (a1 - os) * MathUtils.radDeg + os1 - parent.rotation;
      if (a1 > 180)
        a1 -= 360;
      else if (a1 <= -180)
        a1 += 360;
      parent.rotation += a1 * mix;
      a2 = ((a2 + os) * MathUtils.radDeg - child.shearX) * s2 + os2 - child.rotation;
      if (a2 > 180)
        a2 -= 360;
      else if (a2 <= -180)
        a2 += 360;
      child.rotation += a2 * mix;
    }
  };

  // spine-core/src/IkConstraintData.ts
  var IkConstraintData = class extends ConstraintData {
    /** The bones that are constrained by this IK constraint. */
    bones = [];
    _target = null;
    /** The bone that is the IK target. */
    set target(boneData) {
      this._target = boneData;
    }
    get target() {
      if (!this._target) throw new Error("target cannot be null.");
      return this._target;
    }
    /** Determines how the {@link BonePose.scaleY} changes when {@link IkConstraintPose.compress} or
      * {@link IkConstraintPose.stretch} set {@link BonePose.scaleX}. */
    _scaleYMode = 0 /* None */;
    set scaleYMode(scaleYMode) {
      this._scaleYMode = scaleYMode;
    }
    get scaleYMode() {
      if (this._scaleYMode == null) throw new Error("scaleYMode cannot be null.");
      return this._scaleYMode;
    }
    constructor(name) {
      super(name, new IkConstraintPose());
    }
    create(skeleton) {
      return new IkConstraint(this, skeleton);
    }
  };

  // spine-core/src/PathConstraintPose.ts
  var PathConstraintPose = class {
    /** The position along the path. */
    position = 0;
    /** The spacing between bones. */
    spacing = 0;
    /** A percentage (0-1) that controls the mix between the constrained and unconstrained rotation. */
    mixRotate = 0;
    /** A percentage (0-1) that controls the mix between the constrained and unconstrained translation X. */
    mixX = 0;
    /** A percentage (0-1) that controls the mix between the constrained and unconstrained translation Y. */
    mixY = 0;
    set(pose) {
      this.position = pose.position;
      this.spacing = pose.spacing;
      this.mixRotate = pose.mixRotate;
      this.mixX = pose.mixX;
      this.mixY = pose.mixY;
    }
  };

  // spine-core/src/PathConstraintData.ts
  var PathConstraintData = class extends ConstraintData {
    /** The bones that will be modified by this path constraint. */
    bones = [];
    /** The slot whose path attachment will be used to constrained the bones. */
    set slot(slotData) {
      this._slot = slotData;
    }
    get slot() {
      if (!this._slot) throw new Error("SlotData not set.");
      else return this._slot;
    }
    _slot = null;
    /** The mode for positioning the first bone on the path. */
    positionMode = 0 /* Fixed */;
    /** The mode for positioning the bones after the first bone on the path. */
    spacingMode = 1 /* Fixed */;
    /** The mode for adjusting the rotation of the bones. */
    rotateMode = 1 /* Chain */;
    /** An offset added to the constrained bone rotation. */
    offsetRotation = 0;
    constructor(name) {
      super(name, new PathConstraintPose());
    }
    create(skeleton) {
      return new PathConstraint(this, skeleton);
    }
  };
  var PositionMode = /* @__PURE__ */ ((PositionMode2) => {
    PositionMode2[PositionMode2["Fixed"] = 0] = "Fixed";
    PositionMode2[PositionMode2["Percent"] = 1] = "Percent";
    return PositionMode2;
  })(PositionMode || {});
  var SpacingMode = /* @__PURE__ */ ((SpacingMode2) => {
    SpacingMode2[SpacingMode2["Length"] = 0] = "Length";
    SpacingMode2[SpacingMode2["Fixed"] = 1] = "Fixed";
    SpacingMode2[SpacingMode2["Percent"] = 2] = "Percent";
    SpacingMode2[SpacingMode2["Proportional"] = 3] = "Proportional";
    return SpacingMode2;
  })(SpacingMode || {});
  var RotateMode = /* @__PURE__ */ ((RotateMode2) => {
    RotateMode2[RotateMode2["Tangent"] = 0] = "Tangent";
    RotateMode2[RotateMode2["Chain"] = 1] = "Chain";
    RotateMode2[RotateMode2["ChainScale"] = 2] = "ChainScale";
    return RotateMode2;
  })(RotateMode || {});

  // spine-core/src/PathConstraint.ts
  var PathConstraint = class _PathConstraint extends Constraint {
    static NONE = -1;
    static BEFORE = -2;
    static AFTER = -3;
    /** The path constraint's setup pose data. */
    data;
    /** The bones that will be modified by this path constraint. */
    bones;
    /** The slot whose path attachment will be used to constrained the bones. */
    slot;
    spaces = [];
    positions = [];
    world = [];
    curves = [];
    lengths = [];
    segments = [];
    constructor(data, skeleton) {
      super(data, new PathConstraintPose(), new PathConstraintPose());
      if (!skeleton) throw new Error("skeleton cannot be null.");
      this.data = data;
      this.bones = [];
      for (const boneData of this.data.bones)
        this.bones.push(skeleton.bones[boneData.index].constrainedPose);
      this.slot = skeleton.slots[data.slot.index];
    }
    copy(skeleton) {
      var copy = new _PathConstraint(this.data, skeleton);
      copy.pose.set(this.pose);
      return copy;
    }
    update(skeleton, physics) {
      const attachment = this.slot.appliedPose.attachment;
      if (!(attachment instanceof PathAttachment)) return;
      const p = this.appliedPose;
      const mixRotate = p.mixRotate, mixX = p.mixX, mixY = p.mixY;
      if (mixRotate === 0 && mixX === 0 && mixY === 0) return;
      const data = this.data;
      const tangents = data.rotateMode === 0 /* Tangent */, scale = data.rotateMode === 2 /* ChainScale */;
      const bones = this.bones;
      const boneCount = bones.length, spacesCount = tangents ? boneCount : boneCount + 1;
      const spaces = Utils.setArraySize(this.spaces, spacesCount), lengths = scale ? this.lengths = Utils.setArraySize(this.lengths, boneCount) : [];
      const spacing = p.spacing;
      switch (data.spacingMode) {
        case 2 /* Percent */:
          if (scale) {
            for (let i = 0, n = spacesCount - 1; i < n; i++) {
              const bone = bones[i];
              const setupLength = bone.bone.data.length;
              const x = setupLength * bone.a, y = setupLength * bone.c;
              lengths[i] = Math.sqrt(x * x + y * y);
            }
          }
          Utils.arrayFill(spaces, 1, spacesCount, spacing);
          break;
        case 3 /* Proportional */: {
          let sum = 0;
          for (let i = 0, n = spacesCount - 1; i < n; ) {
            const bone = bones[i];
            const setupLength = bone.bone.data.length;
            if (setupLength < MathUtils.epsilon) {
              if (scale) lengths[i] = 0;
              spaces[++i] = spacing;
            } else {
              const x = setupLength * bone.a, y = setupLength * bone.c;
              const length = Math.sqrt(x * x + y * y);
              if (scale) lengths[i] = length;
              spaces[++i] = length;
              sum += length;
            }
          }
          if (sum > 0) {
            sum = spacesCount / sum * spacing;
            for (let i = 1; i < spacesCount; i++)
              spaces[i] *= sum;
          }
          break;
        }
        default: {
          const lengthSpacing = data.spacingMode === 0 /* Length */;
          for (let i = 0, n = spacesCount - 1; i < n; ) {
            const bone = bones[i];
            const setupLength = bone.bone.data.length;
            if (setupLength < MathUtils.epsilon) {
              if (scale) lengths[i] = 0;
              spaces[++i] = spacing;
            } else {
              const x = setupLength * bone.a, y = setupLength * bone.c;
              const length = Math.sqrt(x * x + y * y);
              if (scale) lengths[i] = length;
              spaces[++i] = (lengthSpacing ? Math.max(0, setupLength + spacing) : spacing) * length / setupLength;
            }
          }
        }
      }
      const positions = this.computeWorldPositions(skeleton, attachment, spacesCount, tangents);
      let boneX = positions[0], boneY = positions[1], offsetRotation = data.offsetRotation;
      let tip = false;
      if (offsetRotation === 0)
        tip = data.rotateMode === 1 /* Chain */;
      else {
        tip = false;
        const bone = this.slot.bone.appliedPose;
        offsetRotation *= bone.a * bone.d - bone.b * bone.c > 0 ? MathUtils.degRad : -MathUtils.degRad;
      }
      for (let i = 0, ip = 3; i < boneCount; i++, ip += 3) {
        const bone = bones[i];
        bone.modifyWorld(skeleton);
        bone.worldX += (boneX - bone.worldX) * mixX;
        bone.worldY += (boneY - bone.worldY) * mixY;
        const x = positions[ip], y = positions[ip + 1], dx = x - boneX, dy = y - boneY;
        if (scale) {
          const length = lengths[i];
          if (length !== 0) {
            const s = (Math.sqrt(dx * dx + dy * dy) / length - 1) * mixRotate + 1;
            bone.a *= s;
            bone.c *= s;
          }
        }
        boneX = x;
        boneY = y;
        if (mixRotate > 0) {
          let a = bone.a, b = bone.b, c = bone.c, d = bone.d, r = 0, cos = 0, sin = 0;
          if (tangents)
            r = positions[ip - 1];
          else if (spaces[i + 1] === 0)
            r = positions[ip + 2];
          else
            r = Math.atan2(dy, dx);
          r -= Math.atan2(c, a);
          if (tip) {
            cos = Math.cos(r);
            sin = Math.sin(r);
            const length = bone.bone.data.length;
            boneX += (length * (cos * a - sin * c) - dx) * mixRotate;
            boneY += (length * (sin * a + cos * c) - dy) * mixRotate;
          } else {
            r += offsetRotation;
          }
          if (r > MathUtils.PI)
            r -= MathUtils.PI2;
          else if (r < -MathUtils.PI)
            r += MathUtils.PI2;
          r *= mixRotate;
          cos = Math.cos(r);
          sin = Math.sin(r);
          bone.a = cos * a - sin * c;
          bone.b = cos * b - sin * d;
          bone.c = sin * a + cos * c;
          bone.d = sin * b + cos * d;
        }
      }
    }
    computeWorldPositions(skeleton, path, spacesCount, tangents) {
      const slot = this.slot;
      let position = this.appliedPose.position;
      let spaces = this.spaces, out = Utils.setArraySize(this.positions, spacesCount * 3 + 2), world = this.world;
      const closed = path.closed;
      let verticesLength = path.worldVerticesLength, curveCount = verticesLength / 6, prevCurve = _PathConstraint.NONE;
      if (!path.constantSpeed) {
        const lengths = path.lengths;
        curveCount -= closed ? 1 : 2;
        const pathLength2 = lengths[curveCount];
        if (this.data.positionMode === 1 /* Percent */) position *= pathLength2;
        let multiplier2;
        switch (this.data.spacingMode) {
          case 2 /* Percent */:
            multiplier2 = pathLength2;
            break;
          case 3 /* Proportional */:
            multiplier2 = pathLength2 / spacesCount;
            break;
          default:
            multiplier2 = 1;
        }
        world = Utils.setArraySize(this.world, 8);
        for (let i = 0, o = 0, curve = 0; i < spacesCount; i++, o += 3) {
          const space = spaces[i] * multiplier2;
          position += space;
          let p = position;
          if (closed) {
            p %= pathLength2;
            if (p < 0) p += pathLength2;
            curve = 0;
          } else if (p < 0) {
            if (prevCurve !== _PathConstraint.BEFORE) {
              prevCurve = _PathConstraint.BEFORE;
              path.computeWorldVertices(skeleton, slot, 2, 4, world, 0, 2);
            }
            this.addBeforePosition(p, world, 0, out, o);
            continue;
          } else if (p > pathLength2) {
            if (prevCurve !== _PathConstraint.AFTER) {
              prevCurve = _PathConstraint.AFTER;
              path.computeWorldVertices(skeleton, slot, verticesLength - 6, 4, world, 0, 2);
            }
            this.addAfterPosition(p - pathLength2, world, 0, out, o);
            continue;
          }
          for (; ; curve++) {
            const length = lengths[curve];
            if (p > length) continue;
            if (curve === 0)
              p /= length;
            else {
              const prev = lengths[curve - 1];
              p = (p - prev) / (length - prev);
            }
            break;
          }
          if (curve !== prevCurve) {
            prevCurve = curve;
            if (closed && curve === curveCount) {
              path.computeWorldVertices(skeleton, slot, verticesLength - 4, 4, world, 0, 2);
              path.computeWorldVertices(skeleton, slot, 0, 4, world, 4, 2);
            } else
              path.computeWorldVertices(skeleton, slot, curve * 6 + 2, 8, world, 0, 2);
          }
          this.addCurvePosition(
            p,
            world[0],
            world[1],
            world[2],
            world[3],
            world[4],
            world[5],
            world[6],
            world[7],
            out,
            o,
            tangents || i > 0 && space === 0
          );
        }
        return out;
      }
      if (closed) {
        verticesLength += 2;
        world = Utils.setArraySize(this.world, verticesLength);
        path.computeWorldVertices(skeleton, slot, 2, verticesLength - 4, world, 0, 2);
        path.computeWorldVertices(skeleton, slot, 0, 2, world, verticesLength - 4, 2);
        world[verticesLength - 2] = world[0];
        world[verticesLength - 1] = world[1];
      } else {
        curveCount--;
        verticesLength -= 4;
        world = Utils.setArraySize(this.world, verticesLength);
        path.computeWorldVertices(skeleton, slot, 2, verticesLength, world, 0, 2);
      }
      const curves = Utils.setArraySize(this.curves, curveCount);
      let pathLength = 0;
      let x1 = world[0], y1 = world[1], cx1 = 0, cy1 = 0, cx2 = 0, cy2 = 0, x2 = 0, y2 = 0;
      let tmpx = 0, tmpy = 0, dddfx = 0, dddfy = 0, ddfx = 0, ddfy = 0, dfx = 0, dfy = 0;
      for (let i = 0, w = 2; i < curveCount; i++, w += 6) {
        cx1 = world[w];
        cy1 = world[w + 1];
        cx2 = world[w + 2];
        cy2 = world[w + 3];
        x2 = world[w + 4];
        y2 = world[w + 5];
        tmpx = (x1 - cx1 * 2 + cx2) * 0.1875;
        tmpy = (y1 - cy1 * 2 + cy2) * 0.1875;
        dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 0.09375;
        dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 0.09375;
        ddfx = tmpx * 2 + dddfx;
        ddfy = tmpy * 2 + dddfy;
        dfx = (cx1 - x1) * 0.75 + tmpx + dddfx * 0.16666667;
        dfy = (cy1 - y1) * 0.75 + tmpy + dddfy * 0.16666667;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        dfx += ddfx;
        dfy += ddfy;
        ddfx += dddfx;
        ddfy += dddfy;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        dfx += ddfx;
        dfy += ddfy;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        dfx += ddfx + dddfx;
        dfy += ddfy + dddfy;
        pathLength += Math.sqrt(dfx * dfx + dfy * dfy);
        curves[i] = pathLength;
        x1 = x2;
        y1 = y2;
      }
      if (this.data.positionMode === 1 /* Percent */) position *= pathLength;
      let multiplier;
      switch (this.data.spacingMode) {
        case 2 /* Percent */:
          multiplier = pathLength;
          break;
        case 3 /* Proportional */:
          multiplier = pathLength / spacesCount;
          break;
        default:
          multiplier = 1;
      }
      const segments = this.segments;
      let curveLength = 0;
      for (let i = 0, o = 0, curve = 0, segment = 0; i < spacesCount; i++, o += 3) {
        const space = spaces[i] * multiplier;
        position += space;
        let p = position;
        if (closed) {
          p %= pathLength;
          if (p < 0) p += pathLength;
          curve = 0;
          segment = 0;
        } else if (p < 0) {
          this.addBeforePosition(p, world, 0, out, o);
          continue;
        } else if (p > pathLength) {
          this.addAfterPosition(p - pathLength, world, verticesLength - 4, out, o);
          continue;
        }
        for (; ; curve++) {
          const length = curves[curve];
          if (p > length) continue;
          if (curve === 0)
            p /= length;
          else {
            const prev = curves[curve - 1];
            p = (p - prev) / (length - prev);
          }
          break;
        }
        if (curve !== prevCurve) {
          prevCurve = curve;
          let ii = curve * 6;
          x1 = world[ii];
          y1 = world[ii + 1];
          cx1 = world[ii + 2];
          cy1 = world[ii + 3];
          cx2 = world[ii + 4];
          cy2 = world[ii + 5];
          x2 = world[ii + 6];
          y2 = world[ii + 7];
          tmpx = (x1 - cx1 * 2 + cx2) * 0.03;
          tmpy = (y1 - cy1 * 2 + cy2) * 0.03;
          dddfx = ((cx1 - cx2) * 3 - x1 + x2) * 6e-3;
          dddfy = ((cy1 - cy2) * 3 - y1 + y2) * 6e-3;
          ddfx = tmpx * 2 + dddfx;
          ddfy = tmpy * 2 + dddfy;
          dfx = (cx1 - x1) * 0.3 + tmpx + dddfx * 0.16666667;
          dfy = (cy1 - y1) * 0.3 + tmpy + dddfy * 0.16666667;
          curveLength = Math.sqrt(dfx * dfx + dfy * dfy);
          segments[0] = curveLength;
          for (ii = 1; ii < 8; ii++) {
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
            segments[ii] = curveLength;
          }
          dfx += ddfx;
          dfy += ddfy;
          curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
          segments[8] = curveLength;
          dfx += ddfx + dddfx;
          dfy += ddfy + dddfy;
          curveLength += Math.sqrt(dfx * dfx + dfy * dfy);
          segments[9] = curveLength;
          segment = 0;
        }
        p *= curveLength;
        for (; ; segment++) {
          const length = segments[segment];
          if (p > length) continue;
          if (segment === 0)
            p /= length;
          else {
            const prev = segments[segment - 1];
            p = segment + (p - prev) / (length - prev);
          }
          break;
        }
        this.addCurvePosition(p * 0.1, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents || i > 0 && space === 0);
      }
      return out;
    }
    addBeforePosition(p, temp, i, out, o) {
      const x1 = temp[i], y1 = temp[i + 1], dx = temp[i + 2] - x1, dy = temp[i + 3] - y1, r = Math.atan2(dy, dx);
      out[o] = x1 + p * Math.cos(r);
      out[o + 1] = y1 + p * Math.sin(r);
      out[o + 2] = r;
    }
    addAfterPosition(p, temp, i, out, o) {
      const x1 = temp[i + 2], y1 = temp[i + 3], dx = x1 - temp[i], dy = y1 - temp[i + 1], r = Math.atan2(dy, dx);
      out[o] = x1 + p * Math.cos(r);
      out[o + 1] = y1 + p * Math.sin(r);
      out[o + 2] = r;
    }
    addCurvePosition(p, x1, y1, cx1, cy1, cx2, cy2, x2, y2, out, o, tangents) {
      if (p === 0 || Number.isNaN(p)) {
        out[o] = x1;
        out[o + 1] = y1;
        out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
        return;
      }
      const tt = p * p, ttt = tt * p, u = 1 - p, uu = u * u, uuu = uu * u;
      const ut = u * p, ut3 = ut * 3, uut3 = u * ut3, utt3 = ut3 * p;
      const x = x1 * uuu + cx1 * uut3 + cx2 * utt3 + x2 * ttt, y = y1 * uuu + cy1 * uut3 + cy2 * utt3 + y2 * ttt;
      out[o] = x;
      out[o + 1] = y;
      if (tangents) {
        if (p < 1e-3)
          out[o + 2] = Math.atan2(cy1 - y1, cx1 - x1);
        else
          out[o + 2] = Math.atan2(y - (y1 * uu + cy1 * ut * 2 + cy2 * tt), x - (x1 * uu + cx1 * ut * 2 + cx2 * tt));
      }
    }
    sort(skeleton) {
      const slotIndex = this.slot.data.index;
      const slotBone = this.slot.bone;
      if (skeleton.skin != null) this.sortPathSlot(skeleton, skeleton.skin, slotIndex, slotBone);
      if (skeleton.data.defaultSkin != null && skeleton.data.defaultSkin !== skeleton.skin)
        this.sortPathSlot(skeleton, skeleton.data.defaultSkin, slotIndex, slotBone);
      this.sortPath(skeleton, this.slot.pose.attachment, slotBone);
      const bones = this.bones;
      const boneCount = this.bones.length;
      for (let i = 0; i < boneCount; i++) {
        const bone = bones[i].bone;
        skeleton.sortBone(bone);
        skeleton.constrained(bone);
      }
      skeleton._updateCache.push(this);
      for (let i = 0; i < boneCount; i++)
        skeleton.sortReset(bones[i].bone.children);
      for (let i = 0; i < boneCount; i++)
        bones[i].bone.sorted = true;
    }
    sortPathSlot(skeleton, skin, slotIndex, slotBone) {
      const entries = skin.getAttachments();
      for (let i = 0, n = entries.length; i < n; i++) {
        const entry = entries[i];
        if (entry.slotIndex === slotIndex) this.sortPath(skeleton, entry.attachment, slotBone);
      }
    }
    sortPath(skeleton, attachment, slotBone) {
      if (!(attachment instanceof PathAttachment)) return;
      const pathBones = attachment.bones;
      if (pathBones == null)
        skeleton.sortBone(slotBone);
      else {
        const bones = skeleton.bones;
        for (let i = 0, n = pathBones.length; i < n; ) {
          let nn = pathBones[i++];
          nn += i;
          while (i < nn)
            skeleton.sortBone(bones[pathBones[i++]]);
        }
      }
    }
    isSourceActive() {
      return this.slot.bone.active;
    }
  };

  // spine-core/src/Physics.ts
  var Physics = /* @__PURE__ */ ((Physics2) => {
    Physics2[Physics2["none"] = 0] = "none";
    Physics2[Physics2["reset"] = 1] = "reset";
    Physics2[Physics2["update"] = 2] = "update";
    Physics2[Physics2["pose"] = 3] = "pose";
    return Physics2;
  })(Physics || {});

  // spine-core/src/PhysicsConstraintPose.ts
  var PhysicsConstraintPose = class {
    /** Controls how much bone movement is converted into physics movement. */
    inertia = 0;
    /** The amount of force used to return properties to the unconstrained value. */
    strength = 0;
    /** Reduces the speed of physics movements, with more of a reduction at higher speeds. */
    damping = 0;
    /** Determines susceptibility to acceleration. */
    massInverse = 0;
    /** Applies a constant force along the {@link Skeleton.windX}, {@link Skeleton.windY} vector. */
    wind = 0;
    /** Applies a constant force along the {@link Skeleton.gravityX}, {@link Skeleton.gravityY} vector. */
    gravity = 0;
    /** A percentage (0+) that controls the mix between the constrained and unconstrained poses. */
    mix = 0;
    set(pose) {
      this.inertia = pose.inertia;
      this.strength = pose.strength;
      this.damping = pose.damping;
      this.massInverse = pose.massInverse;
      this.wind = pose.wind;
      this.gravity = pose.gravity;
      this.mix = pose.mix;
    }
  };

  // spine-core/src/SlotPose.ts
  var SlotPose = class {
    /** The color used to tint the slot's attachment. If {@link darkColor} is set, this is used as the light color for two color
     * tinting. */
    color = new Color(1, 1, 1, 1);
    /** The dark color used to tint the slot's attachment for two color tinting, or null if two color tinting is not used. The dark
     * color's alpha is not used. */
    darkColor = null;
    /** The current attachment for the slot, or null if the slot has no attachment. */
    attachment = null;
    // Not used in setup pose.
    /** The index of the texture region to display when the slot's attachment has a {@link Sequence}. -1 represents the
     * {@link Sequence.getSetupIndex}. */
    sequenceIndex = 0;
    /** Values to deform the slot's attachment. For an unweighted mesh, the entries are local positions for each vertex. For a
     * weighted mesh, the entries are an offset for each vertex which will be added to the mesh's local vertex positions.
     *
     * See {@link VertexAttachment.computeWorldVertices} and
     * {@link DeformTimeline}. */
    deform = [];
    SlotPose() {
    }
    set(pose) {
      if (pose == null) throw new Error("pose cannot be null.");
      this.color.setFromColor(pose.color);
      if (this.darkColor != null && pose.darkColor != null) this.darkColor.setFromColor(pose.darkColor);
      this.attachment = pose.attachment;
      this.sequenceIndex = pose.sequenceIndex;
      this.deform.length = 0;
      this.deform.push(...pose.deform);
    }
    /** The current attachment for the slot, or null if the slot has no attachment. */
    getAttachment() {
      return this.attachment;
    }
    /** Sets the slot's attachment and, if the attachment changed, resets {@link sequenceIndex} and clears the {@link deform}.
     * The deform is not cleared if the old attachment has the same {@link VertexAttachment.getTimelineAttachment} as the
     * specified attachment. */
    setAttachment(attachment) {
      if (this.attachment === attachment) return;
      if (!(attachment instanceof VertexAttachment) || !(this.attachment instanceof VertexAttachment) || attachment.timelineAttachment !== this.attachment.timelineAttachment) {
        this.deform.length = 0;
      }
      this.attachment = attachment;
      this.sequenceIndex = -1;
    }
  };

  // spine-core/src/Slot.ts
  var Slot = class _Slot extends Posed {
    skeleton;
    /** The bone this slot belongs to. */
    bone;
    attachmentState = 0;
    constructor(data, skeleton) {
      super(data, new SlotPose(), new SlotPose());
      if (!skeleton) throw new Error("skeleton cannot be null.");
      this.skeleton = skeleton;
      this.bone = skeleton.bones[data.boneData.index];
      if (data.setupPose.darkColor != null) {
        this.pose.darkColor = new Color();
        this.constrainedPose.darkColor = new Color();
      }
      this.setupPose();
    }
    /** Copy constructor. */
    copy(slot, bone, skeleton) {
      const copy = new _Slot(slot.data, this.skeleton);
      if (this.data.setupPose.darkColor != null) {
        copy.pose.darkColor = new Color();
        copy.constrainedPose.darkColor = new Color();
      }
      copy.pose.set(slot.pose);
      return copy;
    }
    setupPose() {
      this.pose.color.setFromColor(this.data.setupPose.color);
      if (this.pose.darkColor) this.pose.darkColor.setFromColor(this.data.setupPose.darkColor);
      this.pose.sequenceIndex = this.data.setupPose.sequenceIndex;
      if (!this.data.attachmentName)
        this.pose.setAttachment(null);
      else {
        this.pose.attachment = null;
        this.pose.setAttachment(this.skeleton.getAttachment(this.data.index, this.data.attachmentName));
      }
    }
  };

  // spine-core/src/Skeleton.ts
  var Skeleton = class _Skeleton {
    static quadTriangles = [0, 1, 2, 2, 3, 0];
    static yDown = false;
    static get yDir() {
      return _Skeleton.yDown ? -1 : 1;
    }
    /** The skeleton's setup pose data. */
    data;
    /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
    bones;
    /** The skeleton's slots. To add a slot, also add it to {@link DrawOrder.pose}. */
    slots;
    /** The skeleton's draw order. Use {@link DrawOrder.appliedPose} for rendering and {@link DrawOrder.pose} for changing the draw
     * order. */
    drawOrder;
    /** The skeleton's constraints. */
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    constraints;
    /** The skeleton's physics constraints. */
    physics;
    /** The list of bones and constraints, sorted in the order they should be updated, as computed by {@link updateCache}. */
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    _updateCache = [];
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    resetCache = [];
    /** The skeleton's current skin. May be null. */
    skin = null;
    /** The color to tint all the skeleton's attachments. */
    color;
    /** Scales the entire skeleton on the X axis.
     *
     * Bones that do not inherit scale are still affected by this property. */
    scaleX = 1;
    _scaleY = 1;
    /** Scales the entire skeleton on the Y axis.
     *
     * Bones that do not inherit scale are still affected by this property. */
    get scaleY() {
      return this._scaleY * _Skeleton.yDir;
    }
    set scaleY(scaleY) {
      this._scaleY = scaleY;
    }
    /** Sets the skeleton X position, which is added to the root bone worldX position.
     *
     * Bones that do not inherit translation are still affected by this property. */
    x = 0;
    /** Sets the skeleton Y position, which is added to the root bone worldY position.
     *
     * Bones that do not inherit translation are still affected by this property. */
    y = 0;
    /** Returns the skeleton's time, is used for time-based manipulations, such as {@link PhysicsConstraint}.
     *
     * See {@link _update}. */
    time = 0;
    /** The x component of a vector that defines the direction {@link PhysicsConstraintPose.wind} is applied. */
    windX = 1;
    /** The y component of a vector that defines the direction {@link PhysicsConstraintPose.wind} is applied. */
    windY = 0;
    /** The x component of a vector that defines the direction {@link PhysicsConstraintPose.gravity} is applied. */
    gravityX = 0;
    /** The y component of a vector that defines the direction {@link PhysicsConstraintPose.gravity} is applied. */
    gravityY = 1;
    _update = 0;
    constructor(data) {
      if (!data) throw new Error("data cannot be null.");
      this.data = data;
      this.bones = [];
      for (let i = 0; i < data.bones.length; i++) {
        const boneData = data.bones[i];
        let bone;
        if (!boneData.parent)
          bone = new Bone(boneData, null);
        else {
          const parent = this.bones[boneData.parent.index];
          bone = new Bone(boneData, parent);
          parent.children.push(bone);
        }
        this.bones.push(bone);
      }
      this.slots = [];
      for (const slotData of this.data.slots)
        this.slots.push(new Slot(slotData, this));
      this.drawOrder = new DrawOrder(this.slots);
      this.physics = [];
      this.constraints = [];
      for (const constraintData of this.data.constraints) {
        const constraint = constraintData.create(this);
        if (constraint instanceof PhysicsConstraint) this.physics.push(constraint);
        this.constraints.push(constraint);
      }
      this.color = new Color(1, 1, 1, 1);
      this.updateCache();
    }
    /** Caches information about bones and constraints. Must be called if the {@link skin} is modified or if bones, constraints,
     * or weighted path attachments are added or removed. */
    updateCache() {
      this._updateCache.length = 0;
      this.resetCache.length = 0;
      this.drawOrder.unconstrained();
      const slots = this.slots;
      for (let i = 0, n2 = slots.length; i < n2; i++)
        slots[i].unconstrained();
      const bones = this.bones;
      const boneCount = bones.length;
      for (let i = 0, n2 = boneCount; i < n2; i++) {
        const bone = bones[i];
        bone.sorted = bone.data.skinRequired;
        bone.active = !bone.sorted;
        bone.unconstrained();
      }
      if (this.skin) {
        const skinBones = this.skin.bones;
        for (let i = 0, n2 = this.skin.bones.length; i < n2; i++) {
          let bone = this.bones[skinBones[i].index];
          do {
            bone.sorted = false;
            bone.active = true;
            bone = bone.parent;
          } while (bone);
        }
      }
      const constraints = this.constraints;
      let n = this.constraints.length;
      for (let i = 0; i < n; i++)
        constraints[i].unconstrained();
      for (let i = 0; i < n; i++) {
        const constraint = constraints[i];
        constraint.active = constraint.isSourceActive() && (!constraint.data.skinRequired || this.skin != null && this.skin.constraints.includes(constraint.data));
        if (constraint.active) constraint.sort(this);
      }
      for (let i = 0; i < boneCount; i++)
        this.sortBone(bones[i]);
      n = this._updateCache.length;
      for (let i = 0; i < n; i++) {
        const updateable = this._updateCache[i];
        if (updateable instanceof Bone) this._updateCache[i] = updateable.appliedPose;
      }
    }
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    constrained(object) {
      if (object.pose === object.appliedPose) {
        object.constrained();
        this.resetCache.push(object);
      }
    }
    sortBone(bone) {
      if (bone.sorted || !bone.active) return;
      const parent = bone.parent;
      if (parent) this.sortBone(parent);
      bone.sorted = true;
      this._updateCache.push(bone);
    }
    sortReset(bones) {
      for (let i = 0, n = bones.length; i < n; i++) {
        const bone = bones[i];
        if (bone.active) {
          if (bone.sorted) this.sortReset(bone.children);
          bone.sorted = false;
        }
      }
    }
    /** Updates the world transform for each bone and applies all constraints.
     *
     * See <a href="https://esotericsoftware.com/spine-runtime-skeletons#World-transforms">World transforms</a> in the Spine
     * Runtimes Guide. */
    updateWorldTransform(physics) {
      this._update++;
      if (this.drawOrder.appliedPose === this.drawOrder.constrainedPose) this.drawOrder.resetConstrained();
      const resetCache = this.resetCache;
      for (let i = 0, n = this.resetCache.length; i < n; i++)
        resetCache[i].resetConstrained();
      const updateCache = this._updateCache;
      for (let i = 0, n = this._updateCache.length; i < n; i++)
        updateCache[i].update(this, physics);
    }
    /** Sets the bones, constraints, and slots to their setup pose values. */
    setupPose() {
      this.setupPoseBones();
      this.setupPoseSlots();
    }
    /** Sets the bones and constraints to their setup pose values. */
    setupPoseBones() {
      const bones = this.bones;
      for (let i = 0, n = bones.length; i < n; i++)
        bones[i].setupPose();
      const constraints = this.constraints;
      for (let i = 0, n = constraints.length; i < n; i++)
        constraints[i].setupPose();
    }
    /** Sets the slots and draw order to their setup pose values. */
    setupPoseSlots() {
      this.drawOrder.setupPose();
      const slots = this.slots;
      for (let i = 0, n = slots.length; i < n; i++)
        slots[i].setupPose();
    }
    /** Returns the root bone, or null if the skeleton has no bones. */
    getRootBone() {
      if (this.bones.length === 0) return null;
      return this.bones[0];
    }
    /** Finds a bone by comparing each bone's name. It is more efficient to cache the results of this method than to call it
     * repeatedly. */
    findBone(boneName) {
      if (!boneName) throw new Error("boneName cannot be null.");
      const bones = this.bones;
      for (let i = 0, n = bones.length; i < n; i++)
        if (bones[i].data.name === boneName) return bones[i];
      return null;
    }
    /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
     * repeatedly. */
    findSlot(slotName) {
      if (!slotName) throw new Error("slotName cannot be null.");
      const slots = this.slots;
      for (let i = 0, n = slots.length; i < n; i++)
        if (slots[i].data.name === slotName) return slots[i];
      return null;
    }
    setSkin(newSkin) {
      if (typeof newSkin === "string")
        this.setSkinByName(newSkin);
      else
        this.setSkinBySkin(newSkin);
    }
    setSkinByName(skinName) {
      const skin = this.data.findSkin(skinName);
      if (!skin) throw new Error(`Skin not found: ${skinName}`);
      this.setSkin(skin);
    }
    setSkinBySkin(newSkin) {
      if (newSkin === this.skin) return;
      if (newSkin) {
        if (this.skin)
          newSkin.attachAll(this, this.skin);
        else {
          const slots = this.slots;
          for (let i = 0, n = slots.length; i < n; i++) {
            const slot = slots[i];
            const name = slot.data.attachmentName;
            if (name) {
              const attachment = newSkin.getAttachment(i, name);
              if (attachment) slot.pose.setAttachment(attachment);
            }
          }
        }
      }
      this.skin = newSkin;
      this.updateCache();
    }
    getAttachment(slotNameOrIndex, placeholder) {
      if (typeof slotNameOrIndex === "string")
        return this.getAttachmentByName(slotNameOrIndex, placeholder);
      return this.getAttachmentByIndex(slotNameOrIndex, placeholder);
    }
    /** Finds an attachment by looking in the {@link skin} and {@link SkeletonData.defaultSkin} using the slot name and attachment
     * name.
     *
     * See {@link getAttachment}.
     * @returns May be null. */
    getAttachmentByName(slotName, placeholder) {
      const slot = this.data.findSlot(slotName);
      if (!slot) throw new Error(`Can't find slot with name ${slotName}`);
      return this.getAttachment(slot.index, placeholder);
    }
    /** Finds an attachment by looking in the {@link skin} and {@link SkeletonData.defaultSkin} using the slot index and
     * attachment name. First the skin is checked and if the attachment was not found, the default skin is checked.
     *
     * See [Runtime skins](http://esotericsoftware.com/spine-runtime-skins) in the Spine Runtimes Guide.
     * @returns May be null. */
    getAttachmentByIndex(slotIndex, placeholder) {
      if (!placeholder) throw new Error("placeholder cannot be null.");
      if (this.skin) {
        const attachment = this.skin.getAttachment(slotIndex, placeholder);
        if (attachment) return attachment;
      }
      if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, placeholder);
      return null;
    }
    /** A convenience method to set an attachment by finding the slot with {@link findSlot}, finding the attachment with
     * {@link getAttachment}, then setting the slot's {@link Slot.attachment}.
     * @param placeholder May be null to clear the slot's attachment. */
    setAttachment(slotName, placeholder) {
      if (!slotName) throw new Error("slotName cannot be null.");
      const slot = this.findSlot(slotName);
      if (!slot) throw new Error(`Slot not found: ${slotName}`);
      let attachment = null;
      if (placeholder) {
        attachment = this.getAttachment(slot.data.index, placeholder);
        if (!attachment)
          throw new Error(`Attachment not found: ${placeholder}, for slot: ${slotName}`);
      }
      slot.pose.setAttachment(attachment);
    }
    /** Finds a constraint of the specified type by comparing each constraints's name. It is more efficient to cache the results of
     * this method than to call it multiple times. */
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    findConstraint(constraintName, type) {
      if (constraintName == null) throw new Error("constraintName cannot be null.");
      if (type == null) throw new Error("type cannot be null.");
      const constraints = this.constraints;
      for (let i = 0, n = constraints.length; i < n; i++) {
        const constraint = constraints[i];
        if (constraint instanceof type && constraint.data.name === constraintName) return constraint;
      }
      return null;
    }
    /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the applied pose.
     * @param offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
     * @param size An output value, the width and height of the AABB.
     * @param temp Working memory to temporarily store attachments' computed world vertices. */
    getBoundsRect(clipper) {
      const offset = new Vector2();
      const size = new Vector2();
      this.getBounds(offset, size, void 0, clipper);
      return { x: offset.x, y: offset.y, width: size.x, height: size.y };
    }
    /** Returns the axis aligned bounding box (AABB) of the region and mesh attachments for the applied pose. Optionally applies
     * clipping.
     * @param offset An output value, the distance from the skeleton origin to the bottom left corner of the AABB.
     * @param size An output value, the width and height of the AABB.
     * @param temp Working memory to temporarily store attachments' computed world vertices.
     * @param clipper {@link SkeletonClipping} to use. If `null`, no clipping is applied. */
    getBounds(offset, size, temp = new Array(2), clipper = null) {
      if (!offset) throw new Error("offset cannot be null.");
      if (!size) throw new Error("size cannot be null.");
      const drawOrder = this.drawOrder.appliedPose;
      const slots = drawOrder;
      let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
      for (let i = 0, n = drawOrder.length; i < n; i++) {
        const slot = slots[i];
        if (!slot.bone.active) continue;
        let verticesLength = 0;
        let vertices = null;
        let triangles = null;
        const attachment = slot.appliedPose.attachment;
        if (attachment) {
          if (attachment instanceof RegionAttachment) {
            verticesLength = 8;
            vertices = Utils.setArraySize(temp, verticesLength, 0);
            attachment.computeWorldVertices(slot, attachment.getOffsets(slot.appliedPose), vertices, 0, 2);
            triangles = _Skeleton.quadTriangles;
          } else if (attachment instanceof MeshAttachment) {
            verticesLength = attachment.worldVerticesLength;
            vertices = Utils.setArraySize(temp, verticesLength, 0);
            attachment.computeWorldVertices(this, slot, 0, verticesLength, vertices, 0, 2);
            triangles = attachment.triangles;
          } else if (attachment instanceof ClippingAttachment && clipper) {
            clipper.clipEnd(slot);
            clipper.clipStart(this, slot, attachment);
            continue;
          }
          if (vertices && triangles) {
            if (clipper?.isClipping() && clipper.clipTriangles(vertices, triangles, triangles.length)) {
              vertices = clipper.clippedVertices;
              verticesLength = clipper.clippedVertices.length;
            }
            for (let ii = 0, nn = vertices.length; ii < nn; ii += 2) {
              const x = vertices[ii], y = vertices[ii + 1];
              minX = Math.min(minX, x);
              minY = Math.min(minY, y);
              maxX = Math.max(maxX, x);
              maxY = Math.max(maxY, y);
            }
          }
        }
        if (clipper) clipper.clipEnd(slot);
      }
      if (clipper) clipper.clipEnd();
      offset.set(minX, minY);
      size.set(maxX - minX, maxY - minY);
    }
    /** Scales the entire skeleton on the X and Y axes.
     *
     * Bones that do not inherit scale are still affected by this property. */
    setScale(scaleX, scaleY) {
      this.scaleX = scaleX;
      this.scaleY = scaleY;
    }
    /** Sets the skeleton X and Y position, which is added to the root bone worldX and worldY position.
     *
     * Bones that do not inherit translation are still affected by this property. */
    setPosition(x, y) {
      this.x = x;
      this.y = y;
    }
    /** Increments the skeleton's {@link time}. */
    update(delta) {
      this.time += delta;
    }
    /** Calls {@link PhysicsConstraint.translate} for each physics constraint. */
    physicsTranslate(x, y) {
      const constraints = this.physics;
      for (let i = 0, n = constraints.length; i < n; i++)
        constraints[i].translate(x, y);
    }
    /** Calls {@link PhysicsConstraint.rotate} for each physics constraint. */
    physicsRotate(x, y, degrees) {
      const constraints = this.physics;
      for (let i = 0, n = constraints.length; i < n; i++)
        constraints[i].rotate(x, y, degrees);
    }
  };

  // spine-core/src/PhysicsConstraint.ts
  var PhysicsConstraint = class _PhysicsConstraint extends Constraint {
    bone;
    _reset = true;
    ux = 0;
    uy = 0;
    cx = 0;
    cy = 0;
    tx = 0;
    ty = 0;
    xOffset = 0;
    xLag = 0;
    xVelocity = 0;
    yOffset = 0;
    yLag = 0;
    yVelocity = 0;
    rotateOffset = 0;
    rotateLag = 0;
    rotateVelocity = 0;
    scaleOffset = 0;
    scaleLag = 0;
    scaleVelocity = 0;
    remaining = 0;
    lastTime = 0;
    constructor(data, skeleton) {
      super(data, new PhysicsConstraintPose(), new PhysicsConstraintPose());
      if (skeleton == null) throw new Error("skeleton cannot be null.");
      this.bone = skeleton.bones[data.bone.index].constrainedPose;
    }
    copy(skeleton) {
      var copy = new _PhysicsConstraint(this.data, skeleton);
      copy.pose.set(this.pose);
      return copy;
    }
    /** Resets all physics state that was the result of previous movement. Use this after moving a bone to prevent physics from
     * reacting to the movement. */
    reset(skeleton) {
      this.remaining = 0;
      this.lastTime = skeleton.time;
      this._reset = true;
      this.xOffset = 0;
      this.xLag = 0;
      this.xVelocity = 0;
      this.yOffset = 0;
      this.yLag = 0;
      this.yVelocity = 0;
      this.rotateOffset = 0;
      this.rotateLag = 0;
      this.rotateVelocity = 0;
      this.scaleOffset = 0;
      this.scaleLag = 0;
      this.scaleVelocity = 0;
    }
    /** Translates the physics constraint so the next {@link update} forces are applied as if the bone moved an
     * additional amount in world space. */
    translate(x, y) {
      this.ux -= x;
      this.uy -= y;
      this.cx -= x;
      this.cy -= y;
    }
    /** Rotates the physics constraint so the next {@link update} forces are applied as if the bone rotated
     * around the specified point in world space. */
    rotate(x, y, degrees) {
      const r = degrees * MathUtils.degRad, cos = Math.cos(r), sin = Math.sin(r);
      const dx = this.cx - x, dy = this.cy - y;
      this.translate(dx * cos - dy * sin - dx, dx * sin + dy * cos - dy);
    }
    /** Applies the constraint to the constrained bones. */
    update(skeleton, physics) {
      const p = this.appliedPose;
      const mix = p.mix;
      if (mix === 0) return;
      const x = this.data.x > 0, y = this.data.y > 0, rotateOrShearX = this.data.rotate > 0 || this.data.shearX > 0, scaleX = this.data.scaleX > 0;
      const bone = this.bone;
      let l = bone.bone.data.length, t = this.data.step, z = 0;
      if (physics === 0 /* none */) return;
      bone.modifyWorld(skeleton);
      switch (physics) {
        // biome-ignore lint/suspicious/noFallthroughSwitchClause: fall through expected
        case 1 /* reset */:
          this.reset(skeleton);
        // Fall through.
        case 2 /* update */: {
          const delta = Math.max(skeleton.time - this.lastTime, 0), aa = this.remaining;
          this.remaining += delta;
          this.lastTime = skeleton.time;
          const bx = bone.worldX, by = bone.worldY;
          if (this._reset) {
            this._reset = false;
            this.ux = bx;
            this.uy = by;
          } else {
            let a = this.remaining, i = p.inertia, f = skeleton.data.referenceScale, d = -1, m = 0, e = 0, qx = this.data.limit * delta, qy = qx * Math.abs(skeleton.scaleY);
            qx *= Math.abs(skeleton.scaleX);
            if (x || y) {
              if (x) {
                const u = (this.ux - bx) * i;
                this.xOffset += u > qx ? qx : u < -qx ? -qx : u;
                this.ux = bx;
              }
              if (y) {
                const u = (this.uy - by) * i;
                this.yOffset += u > qy ? qy : u < -qy ? -qy : u;
                this.uy = by;
              }
              if (a >= t) {
                const xs = this.xOffset, ys = this.yOffset;
                d = p.damping ** (60 * t);
                m = t * p.massInverse;
                e = p.strength;
                const w = f * p.wind, g = f * p.gravity;
                const ax = (w * skeleton.windX + g * skeleton.gravityX) * skeleton.scaleX;
                const ay = (w * skeleton.windY + g * skeleton.gravityY) * skeleton.scaleY;
                do {
                  if (x) {
                    this.xVelocity += (ax - this.xOffset * e) * m;
                    this.xOffset += this.xVelocity * t;
                    this.xVelocity *= d;
                  }
                  if (y) {
                    this.yVelocity -= (ay + this.yOffset * e) * m;
                    this.yOffset += this.yVelocity * t;
                    this.yVelocity *= d;
                  }
                  a -= t;
                } while (a >= t);
                this.xLag = this.xOffset - xs;
                this.yLag = this.yOffset - ys;
              }
              z = Math.max(0, 1 - a / t);
              if (x) bone.worldX += (this.xOffset - this.xLag * z) * mix * this.data.x;
              if (y) bone.worldY += (this.yOffset - this.yLag * z) * mix * this.data.y;
            }
            if (rotateOrShearX || scaleX) {
              let ca = Math.atan2(bone.c, bone.a), c = 0, s = 0, mr = 0, dx = this.cx - bone.worldX, dy = this.cy - bone.worldY;
              if (dx > qx)
                dx = qx;
              else if (dx < -qx)
                dx = -qx;
              if (dy > qy)
                dy = qy;
              else if (dy < -qy)
                dy = -qy;
              a = this.remaining;
              if (rotateOrShearX) {
                mr = (this.data.rotate + this.data.shearX) * mix;
                z = this.rotateLag * Math.max(0, 1 - aa / t);
                let r = Math.atan2(dy + this.ty, dx + this.tx) - ca - (this.rotateOffset - z) * mr;
                this.rotateOffset += (r - Math.ceil(r * MathUtils.invPI2 - 0.5) * MathUtils.PI2) * i;
                r = (this.rotateOffset - z) * mr + ca;
                c = Math.cos(r);
                s = Math.sin(r);
                if (scaleX) {
                  r = l * bone.getWorldScaleX();
                  if (r > 0) this.scaleOffset += (dx * c + dy * s) * i / r;
                }
              } else {
                c = Math.cos(ca);
                s = Math.sin(ca);
                const r = l * bone.getWorldScaleX() - this.scaleLag * Math.max(0, 1 - aa / t);
                if (r > 0) this.scaleOffset += (dx * c + dy * s) * i / r;
              }
              if (a >= t) {
                if (d === -1) {
                  d = p.damping ** (60 * t);
                  m = t * p.massInverse;
                  e = p.strength;
                }
                const ax = p.wind * skeleton.windX + p.gravity * skeleton.gravityX;
                const ay = (p.wind * skeleton.windY + p.gravity * skeleton.gravityY) * Skeleton.yDir;
                const rs = this.rotateOffset, ss = this.scaleOffset, h = l / f;
                while (true) {
                  a -= t;
                  if (scaleX) {
                    this.scaleVelocity += (ax * c - ay * s - this.scaleOffset * e) * m;
                    this.scaleOffset += this.scaleVelocity * t;
                    this.scaleVelocity *= d;
                  }
                  if (rotateOrShearX) {
                    this.rotateVelocity -= ((ax * s + ay * c) * h + this.rotateOffset * e) * m;
                    this.rotateOffset += this.rotateVelocity * t;
                    this.rotateVelocity *= d;
                    if (a < t) break;
                    const r = this.rotateOffset * mr + ca;
                    c = Math.cos(r);
                    s = Math.sin(r);
                  } else if (a < t)
                    break;
                }
                this.rotateLag = this.rotateOffset - rs;
                this.scaleLag = this.scaleOffset - ss;
              }
              z = Math.max(0, 1 - a / t);
            }
            this.remaining = a;
          }
          this.cx = bone.worldX;
          this.cy = bone.worldY;
          break;
        }
        case 3 /* pose */:
          z = Math.max(0, 1 - this.remaining / t);
          if (x) bone.worldX += (this.xOffset - this.xLag * z) * mix * this.data.x;
          if (y) bone.worldY += (this.yOffset - this.yLag * z) * mix * this.data.y;
      }
      if (rotateOrShearX) {
        let o = (this.rotateOffset - this.rotateLag * z) * mix, s = 0, c = 0, a = 0;
        if (this.data.shearX > 0) {
          let r = 0;
          if (this.data.rotate > 0) {
            r = o * this.data.rotate;
            s = Math.sin(r);
            c = Math.cos(r);
            a = bone.b;
            bone.b = c * a - s * bone.d;
            bone.d = s * a + c * bone.d;
          }
          r += o * this.data.shearX;
          s = Math.sin(r);
          c = Math.cos(r);
          a = bone.a;
          bone.a = c * a - s * bone.c;
          bone.c = s * a + c * bone.c;
        } else {
          o *= this.data.rotate;
          s = Math.sin(o);
          c = Math.cos(o);
          a = bone.a;
          bone.a = c * a - s * bone.c;
          bone.c = s * a + c * bone.c;
          a = bone.b;
          bone.b = c * a - s * bone.d;
          bone.d = s * a + c * bone.d;
        }
      }
      if (scaleX) {
        let s = 1 + (this.scaleOffset - this.scaleLag * z) * mix * this.data.scaleX;
        bone.a *= s;
        bone.c *= s;
        switch (this.data.scaleYMode) {
          case 1 /* Uniform */:
            bone.b *= s;
            bone.d *= s;
            break;
          case 2 /* Volume */:
            s = Math.abs(s);
            s = s >= 0.7 ? 1 / s : 4 - 3.67347 * s;
            bone.b *= s;
            bone.d *= s;
        }
      }
      if (physics !== 3 /* pose */) {
        this.tx = l * bone.a;
        this.ty = l * bone.c;
      }
    }
    sort(skeleton) {
      const bone = this.bone.bone;
      skeleton.sortBone(bone);
      skeleton._updateCache.push(this);
      skeleton.sortReset(bone.children);
      skeleton.constrained(bone);
    }
    isSourceActive() {
      return this.bone.bone.active;
    }
  };

  // spine-core/src/PhysicsConstraintData.ts
  var PhysicsConstraintData = class extends ConstraintData {
    /** The bone constrained by this physics constraint. */
    set bone(boneData) {
      this._bone = boneData;
    }
    get bone() {
      if (!this._bone) throw new Error("BoneData not set.");
      else return this._bone;
    }
    _bone = null;
    /** Physics influence on x translation, 0-1. */
    x = 0;
    /** Physics influence on y translation, 0-1. */
    y = 0;
    /** Physics influence on rotation, 0-1. */
    rotate = 0;
    /** Physics influence on scaleX, 0-1. */
    scaleX = 0;
    /** Physics influence on shearX, 0-1. */
    shearX = 0;
    /** Movement greater than the limit will not have a greater affect on physics. */
    limit = 0;
    /** The time in milliseconds required to advanced the physics simulation one step. */
    step = 0;
    /** True when this constraint's inertia is controlled by global slider timelines. */
    inertiaGlobal = false;
    /** True when this constraint's strength is controlled by global slider timelines. */
    strengthGlobal = false;
    /** True when this constraint's damping is controlled by global slider timelines. */
    dampingGlobal = false;
    /** True when this constraint's mass is controlled by global slider timelines. */
    massGlobal = false;
    /** True when this constraint's wind is controlled by global slider timelines. */
    windGlobal = false;
    /** True when this constraint's gravity is controlled by global slider timelines. */
    gravityGlobal = false;
    /** True when this constraint's mix is controlled by global slider timelines. */
    mixGlobal = false;
    /** Determines how the {@link BonePose.scaleY} changes when {@link BonePose.scaleX} sets
     * {@link BonePose.scaleX}. */
    _scaleYMode = 0 /* None */;
    get scaleYMode() {
      return this._scaleYMode;
    }
    set scaleYMode(scaleYMode) {
      if (scaleYMode == null) throw new Error("scaleYMode cannot be null.");
      this._scaleYMode = scaleYMode;
    }
    constructor(name) {
      super(name, new PhysicsConstraintPose());
    }
    create(skeleton) {
      return new PhysicsConstraint(this, skeleton);
    }
  };

  // spine-core/src/polyfills.ts
  (() => {
    if (typeof Math.fround === "undefined") {
      Math.fround = /* @__PURE__ */ ((array) => (x) => {
        array[0] = x;
        return array[0];
      })(new Float32Array(1));
    }
  })();

  // spine-core/src/SliderPose.ts
  var SliderPose = class {
    /** The time in the {@link SliderData.animation} to apply the animation. */
    time = 0;
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained poses. */
    mix = 0;
    set(pose) {
      this.time = pose.time;
      this.mix = pose.mix;
    }
  };

  // spine-core/src/Slider.ts
  var Slider = class _Slider extends Constraint {
    static offsets = [0, 0, 0, 0, 0, 0];
    /** When set, the bone's transform property is used to set the slider's {@link SliderPose.time}. */
    bone = null;
    constructor(data, skeleton) {
      super(data, new SliderPose(), new SliderPose());
      if (!skeleton) throw new Error("skeleton cannot be null.");
      if (data.bone != null) this.bone = skeleton.bones[data.bone.index];
    }
    copy(skeleton) {
      var copy = new _Slider(this.data, skeleton);
      copy.pose.set(this.pose);
      return copy;
    }
    update(skeleton, physics) {
      const p = this.appliedPose;
      if (p.mix === 0) return;
      const data = this.data, animation = data.animation, bone = this.bone;
      if (bone !== null) {
        if (!bone.active) return;
        if (data.local) bone.appliedPose.validateLocalTransform(skeleton);
        p.time = data.offset + (data.property.value(skeleton, bone.appliedPose, data.local, _Slider.offsets) - data.property.offset) * data.scale;
        if (data.loop)
          p.time = animation.duration + p.time % animation.duration;
        else
          p.time = Math.max(0, p.time);
      }
      const bones = skeleton.bones;
      const indices = animation.bones;
      for (let i = 0, n = animation.bones.length; i < n; i++)
        bones[indices[i]].appliedPose.modifyLocal(skeleton);
      animation.apply(skeleton, p.time, p.time, data.loop, null, p.mix, 0 /* current */, data.additive, false, true);
    }
    sort(skeleton) {
      const bone = this.bone;
      const data = this.data;
      if (bone && !data.local) skeleton.sortBone(bone);
      skeleton._updateCache.push(this);
      const bones = skeleton.bones;
      const indices = data.animation.bones;
      for (let i = 0, n = data.animation.bones.length; i < n; i++) {
        const bone2 = bones[indices[i]];
        bone2.sorted = false;
        skeleton.sortReset(bone2.children);
        skeleton.constrained(bone2);
      }
      const timelines = data.animation.timelines;
      const slots = skeleton.slots;
      const constraints = skeleton.constraints;
      const physics = skeleton.physics;
      const physicsCount = skeleton.physics.length;
      for (let i = 0, n = data.animation.timelines.length; i < n; i++) {
        const t = timelines[i];
        if (isSlotTimeline(t))
          skeleton.constrained(slots[t.slotIndex]);
        else if (t instanceof DrawOrderTimeline || t instanceof DrawOrderFolderTimeline)
          skeleton.drawOrder.constrained();
        else if (t instanceof PhysicsConstraintTimeline) {
          if (t.constraintIndex === -1) {
            for (let ii = 0; ii < physicsCount; ii++)
              skeleton.constrained(physics[ii]);
          } else
            skeleton.constrained(constraints[t.constraintIndex]);
        } else if (isConstraintTimeline(t)) {
          const constraintIndex = t.constraintIndex;
          if (constraintIndex !== -1) skeleton.constrained(constraints[constraintIndex]);
        }
      }
    }
  };

  // spine-core/src/SliderData.ts
  var SliderData = class extends ConstraintData {
    /** The animation the slider will apply. */
    animation;
    /** When true, the animation is applied by adding it to the current pose rather than overwriting it. */
    additive = false;
    /** When true, the animation repeats after its duration, otherwise the last frame is used. */
    loop = false;
    /** When set, the bone's transform property is used to set the slider's {@link SliderPose.time}. */
    bone = null;
    /** When a bone is set, the specified transform property is used to set the slider's {@link SliderPose.time}. */
    property;
    /** When a bone is set, this is the scale of the {@link property} value in relation to the slider time. */
    scale = 0;
    /** When a bone is set, the offset is added to the property. */
    offset = 0;
    /** When true and a bone is set, the bone's local transform property is read instead of its world transform. */
    local = false;
    // Nonessential.
    /** When a bone is set, the maximum slider time for the bone property range, or 0 if nonessential data was not exported. */
    max = 0;
    constructor(name) {
      super(name, new SliderPose());
    }
    create(skeleton) {
      return new Slider(this, skeleton);
    }
  };

  // spine-core/src/SkeletonData.ts
  var SkeletonData = class {
    /** The skeleton's name, which by default is the name of the skeleton data file, if possible. May be null. */
    name = null;
    /** The skeleton's bones, sorted parent first. The root bone is always the first bone. */
    bones = [];
    // Ordered parents first.
    /** The skeleton's slots in the setup pose draw order. */
    slots = [];
    // Setup pose draw order.
    skins = [];
    /** The skeleton's default skin. By default this skin contains all attachments that were not in a skin in Spine.
     *
     * See {@link Skeleton.getAttachmentByName}.
     * May be null. */
    defaultSkin = null;
    /** The skeleton's events. */
    events = [];
    /** The skeleton's animations. */
    animations = [];
    /** The skeleton's IK constraints. */
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    constraints = [];
    /** The X coordinate of the skeleton's axis aligned bounding box in the setup pose. */
    x = 0;
    /** The Y coordinate of the skeleton's axis aligned bounding box in the setup pose. */
    y = 0;
    /** The width of the skeleton's axis aligned bounding box in the setup pose. */
    width = 0;
    /** The height of the skeleton's axis aligned bounding box in the setup pose. */
    height = 0;
    /** Baseline scale factor for applying distance-dependent effects on non-scalable properties, such as angle or scale. Default
     * is 100. */
    referenceScale = 100;
    /** The Spine version used to export the skeleton data, or null. */
    version = null;
    /** The skeleton data hash. This value will change if any of the skeleton data has changed. May be null. */
    hash = null;
    // Nonessential
    /** The dopesheet FPS in Spine. Available only when nonessential data was exported. */
    fps = 30;
    /** The path to the images folder as defined in Spine. Available only when nonessential data was exported. May be null. */
    imagesPath = null;
    /** The path to the audio folder as defined in Spine. Available only when nonessential data was exported. May be null. */
    audioPath = null;
    /** Finds a bone by comparing each bone's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findBone(boneName) {
      if (!boneName) throw new Error("boneName cannot be null.");
      const bones = this.bones;
      for (let i = 0, n = bones.length; i < n; i++)
        if (bones[i].name === boneName) return bones[i];
      return null;
    }
    /** Finds a slot by comparing each slot's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findSlot(slotName) {
      if (!slotName) throw new Error("slotName cannot be null.");
      const slots = this.slots;
      for (let i = 0, n = slots.length; i < n; i++)
        if (slots[i].name === slotName) return slots[i];
      return null;
    }
    /** Finds a skin by comparing each skin's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findSkin(skinName) {
      if (!skinName) throw new Error("skinName cannot be null.");
      const skins = this.skins;
      for (let i = 0, n = skins.length; i < n; i++)
        if (skins[i].name === skinName) return skins[i];
      return null;
    }
    /** Finds an event by comparing each events's name. It is more efficient to cache the results of this method than to call it
     * multiple times.
     * @returns May be null. */
    findEvent(eventDataName) {
      if (!eventDataName) throw new Error("eventDataName cannot be null.");
      const events = this.events;
      for (let i = 0, n = events.length; i < n; i++)
        if (events[i].name === eventDataName) return events[i];
      return null;
    }
    /** Collects animations used by {@link SliderData slider constraints}.
     *
     * Slider animations are designed to be applied by slider constraints rather than on their own. Applications that have a user
     * choose an animation may want to exclude them. */
    findSliderAnimations(animations) {
      const constraints = this.constraints;
      for (let i = 0, n = this.constraints.length; i < n; i++) {
        const data = constraints[i];
        if (data instanceof SliderData && data.animation != null) animations.push(data.animation);
      }
      return animations;
    }
    /** Finds an animation by comparing each animation's name. It is more efficient to cache the results of this method than to
     * call it multiple times.
     * @returns May be null. */
    findAnimation(animationName) {
      if (!animationName) throw new Error("animationName cannot be null.");
      const animations = this.animations;
      for (let i = 0, n = animations.length; i < n; i++)
        if (animations[i].name === animationName) return animations[i];
      return null;
    }
    // --- Constraints.
    /** Finds a constraint of the specified type by comparing each constraints's name. It is more efficient to cache the results of
      * this method than to call it multiple times. */
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    findConstraint(constraintName, type) {
      if (!constraintName) throw new Error("constraintName cannot be null.");
      if (type == null) throw new Error("type cannot be null.");
      const constraints = this.constraints;
      for (let i = 0, n = this.constraints.length; i < n; i++) {
        const constraint = constraints[i];
        if (constraint instanceof type && constraint.name === constraintName) return constraint;
      }
      return null;
    }
  };

  // spine-core/src/Skin.ts
  var SkinEntry = class {
    /** The {@link Skeleton.slots} index. */
    slotIndex = 0;
    placeholder;
    /** The attachment for this skin entry. */
    attachment;
    constructor(slotIndex = 0, placeholder, attachment) {
      this.slotIndex = slotIndex;
      this.placeholder = placeholder;
      this.attachment = attachment;
    }
  };
  var Skin = class {
    /** The skin's name, unique across all skins in the skeleton.
     *
     * See {@link SkeletonData.findSkin}. */
    name;
    attachments = [];
    bones = [];
    // biome-ignore lint/suspicious/noExplicitAny: reference runtime does not restrict to specific types
    constraints = [];
    /** The color of the skin as it was in Spine, or a default color if nonessential data was not exported. */
    color = new Color(0.99607843, 0.61960787, 0.30980393, 1);
    // fe9e4fff
    constructor(name) {
      if (!name) throw new Error("name cannot be null.");
      this.name = name;
    }
    /** Adds an attachment to the skin for the specified slot index and name. */
    setAttachment(slotIndex, placeholder, attachment) {
      if (!attachment) throw new Error("attachment cannot be null.");
      const attachments = this.attachments;
      if (slotIndex >= attachments.length) attachments.length = slotIndex + 1;
      if (!attachments[slotIndex]) attachments[slotIndex] = {};
      attachments[slotIndex][placeholder] = attachment;
    }
    /** Adds all attachments, bones, and constraints from the specified skin to this skin. */
    addSkin(skin) {
      for (let i = 0; i < skin.bones.length; i++) {
        const bone = skin.bones[i];
        let contained = false;
        for (let ii = 0; ii < this.bones.length; ii++) {
          if (this.bones[ii] === bone) {
            contained = true;
            break;
          }
        }
        if (!contained) this.bones.push(bone);
      }
      for (let i = 0; i < skin.constraints.length; i++) {
        const constraint = skin.constraints[i];
        let contained = false;
        for (let ii = 0; ii < this.constraints.length; ii++) {
          if (this.constraints[ii] === constraint) {
            contained = true;
            break;
          }
        }
        if (!contained) this.constraints.push(constraint);
      }
      const attachments = skin.getAttachments();
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        this.setAttachment(attachment.slotIndex, attachment.placeholder, attachment.attachment);
      }
    }
    /** Adds all bones and constraints and copies of all attachments from the specified skin to this skin. Mesh attachments are not
     * copied, instead a new linked mesh is created. The attachment copies can be modified without affecting the originals. */
    copySkin(skin) {
      for (let i = 0; i < skin.bones.length; i++) {
        const bone = skin.bones[i];
        let contained = false;
        for (let ii = 0; ii < this.bones.length; ii++) {
          if (this.bones[ii] === bone) {
            contained = true;
            break;
          }
        }
        if (!contained) this.bones.push(bone);
      }
      for (let i = 0; i < skin.constraints.length; i++) {
        const constraint = skin.constraints[i];
        let contained = false;
        for (let ii = 0; ii < this.constraints.length; ii++) {
          if (this.constraints[ii] === constraint) {
            contained = true;
            break;
          }
        }
        if (!contained) this.constraints.push(constraint);
      }
      const attachments = skin.getAttachments();
      for (let i = 0; i < attachments.length; i++) {
        const attachment = attachments[i];
        if (!attachment.attachment) continue;
        if (attachment.attachment instanceof MeshAttachment) {
          attachment.attachment = attachment.attachment.newLinkedMesh();
          this.setAttachment(attachment.slotIndex, attachment.placeholder, attachment.attachment);
        } else {
          attachment.attachment = attachment.attachment.copy();
          this.setAttachment(attachment.slotIndex, attachment.placeholder, attachment.attachment);
        }
      }
    }
    /** Returns the attachment for the specified slot index and placeholder, or null. */
    getAttachment(slotIndex, placeholder) {
      const dictionary = this.attachments[slotIndex];
      return dictionary ? dictionary[placeholder] : null;
    }
    /** Removes the attachment in the skin for the specified slot index and placeholder, if any. */
    removeAttachment(slotIndex, placeholder) {
      const dictionary = this.attachments[slotIndex];
      if (dictionary) delete dictionary[placeholder];
    }
    /** Returns all attachments in this skin. */
    getAttachments() {
      const entries = [];
      for (let i = 0; i < this.attachments.length; i++) {
        const slotAttachments = this.attachments[i];
        if (slotAttachments) {
          for (const name in slotAttachments) {
            const attachment = slotAttachments[name];
            if (attachment) entries.push(new SkinEntry(i, name, attachment));
          }
        }
      }
      return entries;
    }
    /** Returns all attachments in this skin for the specified slot index. */
    getAttachmentsForSlot(slotIndex, attachments) {
      const slotAttachments = this.attachments[slotIndex];
      if (slotAttachments) {
        for (const name in slotAttachments) {
          const attachment = slotAttachments[name];
          if (attachment) attachments.push(new SkinEntry(slotIndex, name, attachment));
        }
      }
    }
    /** Clears all attachments, bones, and constraints. */
    clear() {
      this.attachments.length = 0;
      this.bones.length = 0;
      this.constraints.length = 0;
    }
    /** Attach each attachment in this skin if the corresponding attachment in the old skin is currently attached. */
    attachAll(skeleton, oldSkin) {
      let slotIndex = 0;
      for (let i = 0; i < skeleton.slots.length; i++) {
        const slot = skeleton.slots[i];
        const slotAttachment = slot.pose.getAttachment();
        if (slotAttachment && slotIndex < oldSkin.attachments.length) {
          const dictionary = oldSkin.attachments[slotIndex];
          for (const placeholder in dictionary) {
            const skinAttachment = dictionary[placeholder];
            if (slotAttachment === skinAttachment) {
              const attachment = this.getAttachment(slotIndex, placeholder);
              if (attachment) slot.pose.setAttachment(attachment);
              break;
            }
          }
        }
        slotIndex++;
      }
    }
  };

  // spine-core/src/SlotData.ts
  var SlotData = class extends PosedData {
    /** The index of the slot in {@link Skeleton.slots}. */
    index = 0;
    /** The bone this slot belongs to. */
    boneData;
    /** The name of the attachment that is visible for this slot in the setup pose, or null if no attachment is visible. */
    attachmentName = null;
    /** The blend mode for drawing the slot's attachment. */
    blendMode = 0 /* Normal */;
    // Nonessential.
    /** False if the slot was hidden in Spine and nonessential data was exported. Does not affect runtime rendering. */
    visible = true;
    constructor(index, name, boneData) {
      super(name, new SlotPose());
      if (index < 0) throw new Error("index must be >= 0.");
      if (!boneData) throw new Error("boneData cannot be null.");
      this.index = index;
      this.boneData = boneData;
    }
  };
  var BlendMode = /* @__PURE__ */ ((BlendMode2) => {
    BlendMode2[BlendMode2["Normal"] = 0] = "Normal";
    BlendMode2[BlendMode2["Additive"] = 1] = "Additive";
    BlendMode2[BlendMode2["Multiply"] = 2] = "Multiply";
    BlendMode2[BlendMode2["Screen"] = 3] = "Screen";
    return BlendMode2;
  })(BlendMode || {});

  // spine-core/src/TransformConstraintPose.ts
  var TransformConstraintPose = class {
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained rotation. */
    mixRotate = 0;
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained translation X. */
    mixX = 0;
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained translation Y. */
    mixY = 0;
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained scale X. */
    mixScaleX = 0;
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained scale Y. */
    mixScaleY = 0;
    /** A percentage (unbounded) that controls the mix between the constrained and unconstrained shear Y. */
    mixShearY = 0;
    set(pose) {
      this.mixRotate = pose.mixRotate;
      this.mixX = pose.mixX;
      this.mixY = pose.mixY;
      this.mixScaleX = pose.mixScaleX;
      this.mixScaleY = pose.mixScaleY;
      this.mixShearY = pose.mixShearY;
    }
  };

  // spine-core/src/TransformConstraint.ts
  var TransformConstraint = class _TransformConstraint extends Constraint {
    /** The bones that will be modified by this transform constraint. */
    bones;
    /** The bone whose world transform will be copied to the constrained bones. */
    source;
    constructor(data, skeleton) {
      super(data, new TransformConstraintPose(), new TransformConstraintPose());
      if (!skeleton) throw new Error("skeleton cannot be null.");
      this.bones = [];
      for (const boneData of data.bones)
        this.bones.push(skeleton.bones[boneData.index].constrainedPose);
      const source = skeleton.bones[data.source.index];
      if (source == null) throw new Error("source cannot be null.");
      this.source = source;
    }
    copy(skeleton) {
      var copy = new _TransformConstraint(this.data, skeleton);
      copy.pose.set(this.pose);
      return copy;
    }
    update(skeleton, physics) {
      const p = this.appliedPose;
      if (p.mixRotate === 0 && p.mixX === 0 && p.mixY === 0 && p.mixScaleX === 0 && p.mixScaleY === 0 && p.mixShearY === 0) return;
      const data = this.data;
      const localSource = data.localSource, localTarget = data.localTarget, additive = data.additive, clamp = data.clamp;
      const offsets = data.offsets;
      const source = this.source.appliedPose;
      if (localSource) source.validateLocalTransform(skeleton);
      const fromItems = data.properties;
      const fn = data.properties.length;
      const bones = this.bones;
      for (let i = 0, n = this.bones.length; i < n; i++) {
        const bone = bones[i];
        if (localTarget)
          bone.modifyLocal(skeleton);
        else
          bone.modifyWorld(skeleton);
        for (let f = 0; f < fn; f++) {
          const from = fromItems[f];
          const value = from.value(skeleton, source, localSource, offsets) - from.offset;
          const toItems = from.to;
          for (let t = 0, tn = from.to.length; t < tn; t++) {
            const to = toItems[t];
            if (to.mix(p) !== 0) {
              let clamped = to.offset + value * to.scale;
              if (clamp) {
                if (to.offset < to.max)
                  clamped = MathUtils.clamp(clamped, to.offset, to.max);
                else
                  clamped = MathUtils.clamp(clamped, to.max, to.offset);
              }
              to.apply(skeleton, p, bone, clamped, localTarget, additive);
            }
          }
        }
      }
    }
    sort(skeleton) {
      if (!this.data.localSource) skeleton.sortBone(this.source);
      const bones = this.bones;
      const boneCount = this.bones.length;
      const worldTarget = !this.data.localTarget;
      if (worldTarget) {
        for (let i = 0; i < boneCount; i++)
          skeleton.sortBone(bones[i].bone);
      }
      skeleton._updateCache.push(this);
      for (let i = 0; i < boneCount; i++) {
        const bone = bones[i].bone;
        skeleton.sortReset(bone.children);
        skeleton.constrained(bone);
      }
      for (let i = 0; i < boneCount; i++)
        bones[i].bone.sorted = worldTarget;
    }
    isSourceActive() {
      return this.source.active;
    }
  };

  // spine-core/src/TransformConstraintData.ts
  var TransformConstraintData = class _TransformConstraintData extends ConstraintData {
    static ROTATION = 0;
    static X = 1;
    static Y = 2;
    static SCALEX = 3;
    static SCALEY = 4;
    static SHEARY = 5;
    /** The bones that will be modified by this transform constraint. */
    bones = [];
    /** The bone whose world transform will be copied to the constrained bones. */
    set source(source) {
      this._source = source;
    }
    get source() {
      if (!this._source) throw new Error("BoneData not set.");
      else return this._source;
    }
    _source = null;
    offsets = [0, 0, 0, 0, 0, 0];
    /** An offset added to the constrained bone X translation. */
    offsetX = 0;
    /** An offset added to the constrained bone Y translation. */
    offsetY = 0;
    /** Reads the source bone's local transform instead of its world transform. */
    localSource = false;
    /** Sets the constrained bones' local transforms instead of their world transforms. */
    localTarget = false;
    /** Adds the source bone transform to the constrained bones instead of setting it absolutely. */
    additive = false;
    /** Prevents constrained bones from exceeding the ranged defined by {@link ToProperty.offset} and {@link ToProperty.max}. */
    clamp = false;
    /** The mapping of transform properties to other transform properties. */
    properties = [];
    constructor(name) {
      super(name, new TransformConstraintPose());
    }
    create(skeleton) {
      return new TransformConstraint(this, skeleton);
    }
    /** An offset added to the constrained bone rotation. */
    getOffsetRotation() {
      return this.offsets[_TransformConstraintData.ROTATION];
    }
    setOffsetRotation(offsetRotation) {
      this.offsets[_TransformConstraintData.ROTATION] = offsetRotation;
    }
    /** An offset added to the constrained bone X translation. */
    getOffsetX() {
      return this.offsets[_TransformConstraintData.X];
    }
    setOffsetX(offsetX) {
      this.offsets[_TransformConstraintData.X] = offsetX;
    }
    /** An offset added to the constrained bone Y translation. */
    getOffsetY() {
      return this.offsets[_TransformConstraintData.Y];
    }
    setOffsetY(offsetY) {
      this.offsets[_TransformConstraintData.Y] = offsetY;
    }
    /** An offset added to the constrained bone scaleX. */
    getOffsetScaleX() {
      return this.offsets[_TransformConstraintData.SCALEX];
    }
    setOffsetScaleX(offsetScaleX) {
      this.offsets[_TransformConstraintData.SCALEX] = offsetScaleX;
    }
    /** An offset added to the constrained bone scaleY. */
    getOffsetScaleY() {
      return this.offsets[_TransformConstraintData.SCALEY];
    }
    setOffsetScaleY(offsetScaleY) {
      this.offsets[_TransformConstraintData.SCALEY] = offsetScaleY;
    }
    /** An offset added to the constrained bone shearY. */
    getOffsetShearY() {
      return this.offsets[_TransformConstraintData.SHEARY];
    }
    setOffsetShearY(offsetShearY) {
      this.offsets[_TransformConstraintData.SHEARY] = offsetShearY;
    }
  };
  var FromProperty = class {
    /** The value of this property that corresponds to {@link ToProperty.offset}. */
    offset = 0;
    /** Constrained properties. */
    to = [];
  };
  var ToProperty = class {
    /** The value of this property that corresponds to {@link FromProperty.offset}. */
    offset = 0;
    /** The maximum value of this property when {@link TransformConstraintData.clamp clamped}. */
    max = 0;
    /** The scale of the {@link FromProperty} value in relation to this property. */
    scale = 0;
  };
  var FromRotate = class extends FromProperty {
    value(skeleton, source, local, offsets) {
      if (local) return source.rotation + offsets[TransformConstraintData.ROTATION];
      const sx = skeleton.scaleX, sy = skeleton.scaleY;
      let value = Math.atan2(source.c / sy, source.a / sx) * MathUtils.radDeg + ((source.a * source.d - source.b * source.c) * sx * sy > 0 ? offsets[TransformConstraintData.ROTATION] : -offsets[TransformConstraintData.ROTATION]);
      if (value < 0) value += 360;
      return value;
    }
  };
  var ToRotate = class extends ToProperty {
    mix(pose) {
      return pose.mixRotate;
    }
    apply(skeleton, pose, bone, value, local, additive) {
      if (local)
        bone.rotation += (additive ? value : value - bone.rotation) * pose.mixRotate;
      else {
        const sx = skeleton.scaleX, sy = skeleton.scaleY, ix = 1 / sx, iy = 1 / sy;
        const a = bone.a * ix, b = bone.b * ix, c = bone.c * iy, d = bone.d * iy;
        value *= MathUtils.degRad;
        if (!additive) value -= Math.atan2(c, a);
        if (value > MathUtils.PI)
          value -= MathUtils.PI2;
        else if (value < -MathUtils.PI)
          value += MathUtils.PI2;
        value *= pose.mixRotate;
        const cos = Math.cos(value), sin = Math.sin(value);
        bone.a = (cos * a - sin * c) * sx;
        bone.b = (cos * b - sin * d) * sx;
        bone.c = (sin * a + cos * c) * sy;
        bone.d = (sin * b + cos * d) * sy;
      }
    }
  };
  var FromX = class extends FromProperty {
    value(skeleton, source, local, offsets) {
      return local ? source.x + offsets[TransformConstraintData.X] : (offsets[TransformConstraintData.X] * source.a + offsets[TransformConstraintData.Y] * source.b + source.worldX) / skeleton.scaleX;
    }
  };
  var ToX = class extends ToProperty {
    mix(pose) {
      return pose.mixX;
    }
    apply(skeleton, pose, bone, value, local, additive) {
      if (local)
        bone.x += (additive ? value : value - bone.x) * pose.mixX;
      else {
        if (!additive) value -= bone.worldX / skeleton.scaleX;
        bone.worldX += value * pose.mixX * skeleton.scaleX;
      }
    }
  };
  var FromY = class extends FromProperty {
    value(skeleton, source, local, offsets) {
      return local ? source.y + offsets[TransformConstraintData.Y] : (offsets[TransformConstraintData.X] * source.c + offsets[TransformConstraintData.Y] * source.d + source.worldY) / skeleton.scaleY;
    }
  };
  var ToY = class extends ToProperty {
    mix(pose) {
      return pose.mixY;
    }
    apply(skeleton, pose, bone, value, local, additive) {
      if (local)
        bone.y += (additive ? value : value - bone.y) * pose.mixY;
      else {
        if (!additive) value -= bone.worldY / skeleton.scaleY;
        bone.worldY += value * pose.mixY * skeleton.scaleY;
      }
    }
  };
  var FromScaleX = class extends FromProperty {
    value(skeleton, source, local, offsets) {
      if (local) return source.scaleX + offsets[TransformConstraintData.SCALEX];
      const a = source.a / skeleton.scaleX, c = source.c / skeleton.scaleY;
      return Math.sqrt(a * a + c * c) + offsets[TransformConstraintData.SCALEX];
    }
  };
  var ToScaleX = class extends ToProperty {
    mix(pose) {
      return pose.mixScaleX;
    }
    apply(skeleton, pose, bone, value, local, additive) {
      if (local) {
        if (additive)
          bone.scaleX *= 1 + (value - 1) * pose.mixScaleX;
        else if (bone.scaleX !== 0)
          bone.scaleX += (value - bone.scaleX) * pose.mixScaleX;
      } else if (additive) {
        const s = 1 + (value - 1) * pose.mixScaleX;
        bone.a *= s;
        bone.c *= s;
      } else {
        let a = bone.a / skeleton.scaleX, c = bone.c / skeleton.scaleY, s = Math.sqrt(a * a + c * c);
        if (s !== 0) {
          s = 1 + (value - s) * pose.mixScaleX / s;
          bone.a *= s;
          bone.c *= s;
        }
      }
    }
  };
  var FromScaleY = class extends FromProperty {
    value(skeleton, source, local, offsets) {
      if (local) return source.scaleY + offsets[TransformConstraintData.SCALEY];
      const b = source.b / skeleton.scaleX, d = source.d / skeleton.scaleY;
      return Math.sqrt(b * b + d * d) + offsets[TransformConstraintData.SCALEY];
    }
  };
  var ToScaleY = class extends ToProperty {
    mix(pose) {
      return pose.mixScaleY;
    }
    apply(skeleton, pose, bone, value, local, additive) {
      if (local) {
        if (additive)
          bone.scaleY *= 1 + (value - 1) * pose.mixScaleY;
        else if (bone.scaleY !== 0)
          bone.scaleY += (value - bone.scaleY) * pose.mixScaleY;
      } else if (additive) {
        const s = 1 + (value - 1) * pose.mixScaleY;
        bone.b *= s;
        bone.d *= s;
      } else {
        let b = bone.b / skeleton.scaleX, d = bone.d / skeleton.scaleY, s = Math.sqrt(b * b + d * d);
        if (s !== 0) {
          s = 1 + (value - s) * pose.mixScaleY / s;
          bone.b *= s;
          bone.d *= s;
        }
      }
    }
  };
  var FromShearY = class extends FromProperty {
    value(skeleton, source, local, offsets) {
      if (local) return source.shearY + offsets[TransformConstraintData.SHEARY];
      const ix = 1 / skeleton.scaleX, iy = 1 / skeleton.scaleY;
      return (Math.atan2(source.d * iy, source.b * ix) - Math.atan2(source.c * iy, source.a * ix)) * MathUtils.radDeg - 90 + offsets[TransformConstraintData.SHEARY];
    }
  };
  var ToShearY = class extends ToProperty {
    mix(pose) {
      return pose.mixShearY;
    }
    apply(skeleton, pose, bone, value, local, additive) {
      if (local) {
        if (!additive) value -= bone.shearY;
        bone.shearY += value * pose.mixShearY;
      } else {
        const sx = skeleton.scaleX, sy = skeleton.scaleY, b = bone.b / sx, d = bone.d / sy, by = Math.atan2(d, b);
        value = (value + 90) * MathUtils.degRad;
        if (additive)
          value -= MathUtils.PI / 2;
        else {
          value -= by - Math.atan2(bone.c / sy, bone.a / sx);
          if (value > MathUtils.PI)
            value -= MathUtils.PI2;
          else if (value < -MathUtils.PI)
            value += MathUtils.PI2;
        }
        value = by + value * pose.mixShearY;
        const s = Math.sqrt(b * b + d * d);
        bone.b = Math.cos(value) * s * sx;
        bone.d = Math.sin(value) * s * sy;
      }
    }
  };

  // spine-core/src/SkeletonBinary.ts
  var SkeletonBinary = class {
    /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
     * runtime than were used in Spine.
     *
     * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
    scale = 1;
    attachmentLoader;
    linkedMeshes = [];
    constructor(attachmentLoader) {
      this.attachmentLoader = attachmentLoader;
    }
    readSkeletonData(binary) {
      const scale = this.scale;
      const skeletonData = new SkeletonData();
      skeletonData.name = "";
      const input = new BinaryInput(binary);
      const lowHash = input.readInt32();
      const highHash = input.readInt32();
      skeletonData.hash = highHash === 0 && lowHash === 0 ? null : highHash.toString(16) + lowHash.toString(16);
      skeletonData.version = input.readString();
      skeletonData.x = input.readFloat();
      skeletonData.y = input.readFloat();
      skeletonData.width = input.readFloat();
      skeletonData.height = input.readFloat();
      skeletonData.referenceScale = input.readFloat() * scale;
      const nonessential = input.readBoolean();
      if (nonessential) {
        skeletonData.fps = input.readFloat();
        skeletonData.imagesPath = input.readString();
        skeletonData.audioPath = input.readString();
      }
      let n = 0;
      n = input.readInt(true);
      for (let i = 0; i < n; i++) {
        const str = input.readString();
        if (!str) throw new Error("String in string table must not be null.");
        input.strings.push(str);
      }
      const bones = skeletonData.bones;
      n = input.readInt(true);
      for (let i = 0; i < n; i++) {
        const name = input.readString();
        if (!name) throw new Error("Bone name must not be null.");
        const parent = i === 0 ? null : bones[input.readInt(true)];
        const data = new BoneData(i, name, parent);
        const setup = data.setupPose;
        setup.rotation = input.readFloat();
        setup.x = input.readFloat() * scale;
        setup.y = input.readFloat() * scale;
        setup.scaleX = input.readFloat();
        setup.scaleY = input.readFloat();
        setup.shearX = input.readFloat();
        setup.shearY = input.readFloat();
        setup.inherit = input.readByte();
        data.length = input.readFloat() * scale;
        data.skinRequired = input.readBoolean();
        if (nonessential) {
          Color.rgba8888ToColor(data.color, input.readInt32());
          data.icon = input.readString() ?? void 0;
          data.iconSize = input.readFloat();
          data.iconRotation = input.readFloat();
          data.visible = input.readBoolean();
        }
        bones.push(data);
      }
      n = input.readInt(true);
      for (let i = 0; i < n; i++) {
        const slotName = input.readString();
        if (!slotName) throw new Error("Slot name must not be null.");
        const boneData = bones[input.readInt(true)];
        const data = new SlotData(i, slotName, boneData);
        Color.rgba8888ToColor(data.setupPose.color, input.readInt32());
        const darkColor = input.readInt32();
        if (darkColor !== -1) Color.rgb888ToColor(data.setupPose.darkColor = new Color(), darkColor);
        data.attachmentName = input.readStringRef();
        data.blendMode = input.readInt(true);
        if (nonessential) data.visible = input.readBoolean();
        skeletonData.slots.push(data);
      }
      const constraints = skeletonData.constraints;
      const constraintCount = input.readInt(true);
      for (let i = 0; i < constraintCount; i++) {
        const name = input.readString();
        if (!name) throw new Error("Constraint data name must not be null.");
        let nn;
        switch (input.readByte()) {
          case CONSTRAINT_IK: {
            const data = new IkConstraintData(name);
            nn = input.readInt(true);
            for (let ii = 0; ii < nn; ii++)
              data.bones.push(bones[input.readInt(true)]);
            data.target = bones[input.readInt(true)];
            const flags = input.readByte();
            data.skinRequired = (flags & 1) !== 0;
            if ((flags & 2) !== 0) data.scaleYMode = input.readUnsignedByte();
            const setup = data.setupPose;
            setup.bendDirection = (flags & 4) !== 0 ? -1 : 1;
            setup.compress = (flags & 8) !== 0;
            setup.stretch = (flags & 16) !== 0;
            if ((flags & 32) !== 0) setup.mix = (flags & 64) !== 0 ? input.readFloat() : 1;
            if ((flags & 128) !== 0) setup.softness = input.readFloat() * scale;
            constraints.push(data);
            break;
          }
          case CONSTRAINT_TRANSFORM: {
            const data = new TransformConstraintData(name);
            nn = input.readInt(true);
            for (let ii = 0; ii < nn; ii++)
              data.bones.push(bones[input.readInt(true)]);
            data.source = bones[input.readInt(true)];
            let flags = input.readUnsignedByte();
            data.skinRequired = (flags & 1) !== 0;
            data.localSource = (flags & 2) !== 0;
            data.localTarget = (flags & 4) !== 0;
            data.additive = (flags & 8) !== 0;
            data.clamp = (flags & 16) !== 0;
            nn = flags >> 5;
            for (let ii = 0, tn; ii < nn; ii++) {
              let fromScale = 1;
              let from;
              switch (input.readByte()) {
                case 0:
                  from = new FromRotate();
                  break;
                case 1: {
                  fromScale = scale;
                  from = new FromX();
                  break;
                }
                case 2: {
                  fromScale = scale;
                  from = new FromY();
                  break;
                }
                case 3:
                  from = new FromScaleX();
                  break;
                case 4:
                  from = new FromScaleY();
                  break;
                case 5:
                  from = new FromShearY();
                  break;
                default:
                  from = null;
              }
              if (!from) continue;
              from.offset = input.readFloat() * fromScale;
              tn = input.readByte();
              for (let t = 0; t < tn; t++) {
                let toScale = 1;
                let to;
                switch (input.readByte()) {
                  case 0:
                    to = new ToRotate();
                    break;
                  case 1: {
                    toScale = scale;
                    to = new ToX();
                    break;
                  }
                  case 2: {
                    toScale = scale;
                    to = new ToY();
                    break;
                  }
                  case 3:
                    to = new ToScaleX();
                    break;
                  case 4:
                    to = new ToScaleY();
                    break;
                  case 5:
                    to = new ToShearY();
                    break;
                  default:
                    to = null;
                }
                if (!to) continue;
                to.offset = input.readFloat() * toScale;
                to.max = input.readFloat() * toScale;
                to.scale = input.readFloat() * toScale / fromScale;
                from.to[t] = to;
              }
              data.properties[ii] = from;
            }
            flags = input.readByte();
            if ((flags & 1) !== 0) data.offsets[TransformConstraintData.ROTATION] = input.readFloat();
            if ((flags & 2) !== 0) data.offsets[TransformConstraintData.X] = input.readFloat() * scale;
            if ((flags & 4) !== 0) data.offsets[TransformConstraintData.Y] = input.readFloat() * scale;
            if ((flags & 8) !== 0) data.offsets[TransformConstraintData.SCALEX] = input.readFloat();
            if ((flags & 16) !== 0) data.offsets[TransformConstraintData.SCALEY] = input.readFloat();
            if ((flags & 32) !== 0) data.offsets[TransformConstraintData.SHEARY] = input.readFloat();
            flags = input.readByte();
            const setup = data.setupPose;
            if ((flags & 1) !== 0) setup.mixRotate = input.readFloat();
            if ((flags & 2) !== 0) setup.mixX = input.readFloat();
            if ((flags & 4) !== 0) setup.mixY = input.readFloat();
            if ((flags & 8) !== 0) setup.mixScaleX = input.readFloat();
            if ((flags & 16) !== 0) setup.mixScaleY = input.readFloat();
            if ((flags & 32) !== 0) setup.mixShearY = input.readFloat();
            constraints.push(data);
            break;
          }
          case CONSTRAINT_PATH: {
            const data = new PathConstraintData(name);
            nn = input.readInt(true);
            for (let ii = 0; ii < nn; ii++)
              data.bones.push(bones[input.readInt(true)]);
            data.slot = skeletonData.slots[input.readInt(true)];
            const flags = input.readByte();
            data.skinRequired = (flags & 1) !== 0;
            data.positionMode = flags >> 1 & 1;
            data.spacingMode = flags >> 2 & 3;
            data.rotateMode = flags >> 4 & 3;
            if ((flags & 128) !== 0) data.offsetRotation = input.readFloat();
            const setup = data.setupPose;
            setup.position = input.readFloat();
            if (data.positionMode === 0 /* Fixed */) setup.position *= scale;
            setup.spacing = input.readFloat();
            if (data.spacingMode === 0 /* Length */ || data.spacingMode === 1 /* Fixed */) setup.spacing *= scale;
            setup.mixRotate = input.readFloat();
            setup.mixX = input.readFloat();
            setup.mixY = input.readFloat();
            constraints.push(data);
            break;
          }
          case CONSTRAINT_PHYSICS: {
            const data = new PhysicsConstraintData(name);
            data.bone = bones[input.readInt(true)];
            let flags = input.readByte();
            data.skinRequired = (flags & 1) !== 0;
            if ((flags & 2) !== 0) data.x = input.readFloat();
            if ((flags & 4) !== 0) data.y = input.readFloat();
            if ((flags & 8) !== 0) data.rotate = input.readFloat();
            if ((flags & 16) !== 0) {
              let scaleX = input.readFloat();
              if (scaleX < -2) {
                data.scaleYMode = 2 /* Volume */;
                scaleX = -2 - scaleX;
              } else if (scaleX < 0) {
                data.scaleYMode = 1 /* Uniform */;
                scaleX = -1 - scaleX;
              }
              data.scaleX = scaleX;
            }
            if ((flags & 32) !== 0) data.shearX = input.readFloat();
            data.limit = ((flags & 64) !== 0 ? input.readFloat() : 5e3) * scale;
            data.step = 1 / input.readUnsignedByte();
            const setup = data.setupPose;
            setup.inertia = input.readFloat();
            setup.strength = input.readFloat();
            setup.damping = input.readFloat();
            setup.massInverse = (flags & 128) !== 0 ? input.readFloat() : 1;
            setup.wind = input.readFloat();
            setup.gravity = input.readFloat();
            flags = input.readByte();
            if ((flags & 1) !== 0) data.inertiaGlobal = true;
            if ((flags & 2) !== 0) data.strengthGlobal = true;
            if ((flags & 4) !== 0) data.dampingGlobal = true;
            if ((flags & 8) !== 0) data.massGlobal = true;
            if ((flags & 16) !== 0) data.windGlobal = true;
            if ((flags & 32) !== 0) data.gravityGlobal = true;
            if ((flags & 64) !== 0) data.mixGlobal = true;
            setup.mix = (flags & 128) !== 0 ? input.readFloat() : 1;
            constraints.push(data);
            break;
          }
          case CONSTRAINT_SLIDER: {
            const data = new SliderData(name);
            const flags = input.readByte();
            data.skinRequired = (flags & 1) !== 0;
            data.loop = (flags & 2) !== 0;
            data.additive = (flags & 4) !== 0;
            if ((flags & 8) !== 0) {
              const value = input.readFloat();
              if (nonessential && (flags & 64) !== 0)
                data.max = value;
              else
                data.setupPose.time = value;
            }
            if ((flags & 16) !== 0) data.setupPose.mix = (flags & 32) !== 0 ? input.readFloat() : 1;
            if ((flags & 64) !== 0) {
              data.local = (flags & 128) !== 0;
              data.bone = bones[input.readInt(true)];
              const offset = input.readFloat();
              let propertyScale = 1;
              switch (input.readByte()) {
                case 0:
                  data.property = new FromRotate();
                  break;
                case 1: {
                  propertyScale = scale;
                  data.property = new FromX();
                  break;
                }
                case 2: {
                  propertyScale = scale;
                  data.property = new FromY();
                  break;
                }
                case 3:
                  data.property = new FromScaleX();
                  break;
                case 4:
                  data.property = new FromScaleY();
                  break;
                case 5:
                  data.property = new FromShearY();
                  break;
                default:
                  continue;
              }
              ;
              data.property.offset = offset * propertyScale;
              data.offset = input.readFloat();
              data.scale = input.readFloat() / propertyScale;
            }
            constraints.push(data);
            break;
          }
        }
      }
      const defaultSkin = this.readSkin(input, skeletonData, true, nonessential);
      if (defaultSkin) {
        skeletonData.defaultSkin = defaultSkin;
        skeletonData.skins.push(defaultSkin);
      }
      {
        let i = skeletonData.skins.length;
        Utils.setArraySize(skeletonData.skins, n = i + input.readInt(true));
        for (; i < n; i++) {
          const skin = this.readSkin(input, skeletonData, false, nonessential);
          if (!skin) throw new Error("readSkin() should not have returned null.");
          skeletonData.skins[i] = skin;
        }
      }
      n = this.linkedMeshes.length;
      for (let i = 0; i < n; i++) {
        const linkedMesh = this.linkedMeshes[i];
        const skin = skeletonData.skins[linkedMesh.skinIndex];
        if (!linkedMesh.source) throw new Error("Linked mesh parent must not be null");
        const source = skin.getAttachment(linkedMesh.sourceIndex, linkedMesh.source);
        if (!source) throw new Error(`Source mesh not found: ${linkedMesh.source}`);
        linkedMesh.mesh.timelineAttachment = linkedMesh.inheritTimelines ? source : linkedMesh.mesh;
        linkedMesh.mesh.setSourceMesh(source);
        linkedMesh.mesh.updateSequence();
      }
      this.linkedMeshes.length = 0;
      n = input.readInt(true);
      for (let i = 0; i < n; i++) {
        const eventName = input.readString();
        if (!eventName) throw new Error("Event data name must not be null");
        const data = new EventData(eventName);
        const setup = data.setupPose;
        setup.intValue = input.readInt(false);
        setup.floatValue = input.readFloat();
        setup.stringValue = input.readString();
        data._audioPath = input.readString();
        if (data.audioPath) {
          setup.volume = input.readFloat();
          setup.balance = input.readFloat();
        }
        skeletonData.events.push(data);
      }
      const animations = skeletonData.animations;
      n = input.readInt(true);
      for (let i = 0; i < n; i++) {
        const animationName = input.readString();
        if (!animationName) throw new Error("Animation name must not be null.");
        animations.push(this.readAnimation(input, animationName, skeletonData, nonessential));
      }
      for (let i = 0; i < constraintCount; i++) {
        const constraint = constraints[i];
        if (constraint instanceof SliderData) constraint.animation = animations[input.readInt(true)];
      }
      return skeletonData;
    }
    readSkin(input, skeletonData, defaultSkin, nonessential) {
      let skin = null;
      let slotCount = 0;
      if (defaultSkin) {
        slotCount = input.readInt(true);
        if (slotCount === 0) return null;
        skin = new Skin("default");
      } else {
        const skinName = input.readString();
        if (!skinName) throw new Error("Skin name must not be null.");
        skin = new Skin(skinName);
        if (nonessential) Color.rgba8888ToColor(skin.color, input.readInt32());
        let n = input.readInt(true);
        let from = skeletonData.bones, to = skin.bones;
        for (let i = 0; i < n; i++)
          to[i] = from[input.readInt(true)];
        n = input.readInt(true);
        from = skeletonData.constraints;
        to = skin.constraints;
        for (let i = 0; i < n; i++)
          to[i] = from[input.readInt(true)];
        slotCount = input.readInt(true);
      }
      for (let i = 0; i < slotCount; i++) {
        const slotIndex = input.readInt(true);
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const placeholder = input.readStringRef();
          if (!placeholder)
            throw new Error("Attachment name must not be null");
          const attachment = this.readAttachment(input, skeletonData, skin, slotIndex, placeholder, nonessential);
          if (attachment) skin.setAttachment(slotIndex, placeholder, attachment);
        }
      }
      return skin;
    }
    readAttachment(input, skeletonData, skin, slotIndex, placeholder, nonessential) {
      const scale = this.scale;
      const flags = input.readByte();
      const name = (flags & 8) !== 0 ? input.readStringRef() : placeholder;
      if (!name) throw new Error("Attachment name must not be null");
      switch (flags & 7) {
        // BUG?
        case 0 /* Region */: {
          let path = (flags & 16) !== 0 ? input.readStringRef() : null;
          const color = (flags & 32) !== 0 ? input.readInt32() : 4294967295;
          const sequence = this.readSequence(input, (flags & 64) !== 0);
          const rotation = (flags & 128) !== 0 ? input.readFloat() : 0;
          const x = input.readFloat();
          const y = input.readFloat();
          const scaleX = input.readFloat();
          const scaleY = input.readFloat();
          const width = input.readFloat();
          const height = input.readFloat();
          if (!path) path = name;
          const region = this.attachmentLoader.newRegionAttachment(skin, placeholder, name, path, sequence);
          if (!region) return null;
          region.path = path;
          region.x = x * scale;
          region.y = y * scale;
          region.scaleX = scaleX;
          region.scaleY = scaleY;
          region.rotation = rotation;
          region.width = width * scale;
          region.height = height * scale;
          Color.rgba8888ToColor(region.color, color);
          region.updateSequence();
          return region;
        }
        case 1 /* BoundingBox */: {
          const vertices = this.readVertices(input, (flags & 16) !== 0);
          const color = nonessential ? input.readInt32() : 0;
          const box = this.attachmentLoader.newBoundingBoxAttachment(skin, placeholder, name);
          if (!box) return null;
          box.worldVerticesLength = vertices.length;
          box.vertices = vertices.vertices;
          box.bones = vertices.bones;
          if (nonessential) Color.rgba8888ToColor(box.color, color);
          return box;
        }
        case 2 /* Mesh */: {
          let path = (flags & 16) !== 0 ? input.readStringRef() : name;
          const color = (flags & 32) !== 0 ? input.readInt32() : 4294967295;
          const sequence = this.readSequence(input, (flags & 64) !== 0);
          const hullLength = input.readInt(true);
          const vertices = this.readVertices(input, (flags & 128) !== 0);
          const uvs = this.readFloatArray(input, vertices.length, 1);
          const triangles = this.readShortArray(input, (vertices.length - hullLength - 2) * 3);
          const slotCount = input.readInt(true);
          let timelineSlots = null;
          if (slotCount > 0) {
            timelineSlots = [];
            for (let i = 0; i < slotCount; i++)
              timelineSlots[i] = input.readInt(true);
          }
          let edges = [];
          let width = 0, height = 0;
          if (nonessential) {
            edges = this.readShortArray(input, input.readInt(true));
            width = input.readFloat();
            height = input.readFloat();
          }
          if (!path) path = name;
          const mesh = this.attachmentLoader.newMeshAttachment(skin, placeholder, name, path, sequence);
          if (!mesh) return null;
          mesh.path = path;
          Color.rgba8888ToColor(mesh.color, color);
          mesh.hullLength = hullLength << 1;
          mesh.bones = vertices.bones;
          mesh.vertices = vertices.vertices;
          mesh.worldVerticesLength = vertices.length;
          mesh.regionUVs = uvs;
          mesh.triangles = triangles;
          if (timelineSlots) mesh.timelineSlots = timelineSlots;
          if (nonessential) {
            mesh.edges = edges;
            mesh.width = width * scale;
            mesh.height = height * scale;
          }
          mesh.updateSequence();
          return mesh;
        }
        case 3 /* LinkedMesh */: {
          const path = (flags & 16) !== 0 ? input.readStringRef() : name;
          if (path == null) throw new Error("Path of linked mesh must not be null");
          const color = (flags & 32) !== 0 ? input.readInt32() : 4294967295;
          const sequence = this.readSequence(input, (flags & 64) !== 0);
          const inheritTimelines = (flags & 128) !== 0;
          const sourceIndex = input.readInt(true);
          const skinIndex = input.readInt(true);
          const source = input.readStringRef();
          let width = 0, height = 0;
          if (nonessential) {
            width = input.readFloat();
            height = input.readFloat();
          }
          const mesh = this.attachmentLoader.newMeshAttachment(skin, placeholder, name, path, sequence);
          if (!mesh) return null;
          mesh.path = path;
          Color.rgba8888ToColor(mesh.color, color);
          if (nonessential) {
            mesh.width = width * scale;
            mesh.height = height * scale;
          }
          this.linkedMeshes.push(new LinkedMesh(mesh, skinIndex, slotIndex, sourceIndex, source, inheritTimelines));
          return mesh;
        }
        case 4 /* Path */: {
          const closed = (flags & 16) !== 0;
          const constantSpeed = (flags & 32) !== 0;
          const vertices = this.readVertices(input, (flags & 64) !== 0);
          const lengths = this.readFloatArray(input, vertices.length / 6, scale);
          const color = nonessential ? input.readInt32() : 0;
          const path = this.attachmentLoader.newPathAttachment(skin, placeholder, name);
          if (!path) return null;
          path.closed = closed;
          path.constantSpeed = constantSpeed;
          path.worldVerticesLength = vertices.length;
          path.vertices = vertices.vertices;
          path.bones = vertices.bones;
          path.lengths = lengths;
          if (nonessential) Color.rgba8888ToColor(path.color, color);
          return path;
        }
        case 5 /* Point */: {
          const rotation = input.readFloat();
          const x = input.readFloat();
          const y = input.readFloat();
          const color = nonessential ? input.readInt32() : 0;
          const point = this.attachmentLoader.newPointAttachment(skin, placeholder, name);
          if (!point) return null;
          point.x = x * scale;
          point.y = y * scale;
          point.rotation = rotation;
          if (nonessential) Color.rgba8888ToColor(point.color, color);
          return point;
        }
        case 6 /* Clipping */: {
          const endSlotIndex = input.readInt(true);
          const vertices = this.readVertices(input, (flags & 16) !== 0);
          const color = nonessential ? input.readInt32() : 0;
          const clip = this.attachmentLoader.newClippingAttachment(skin, placeholder, name);
          if (!clip) return null;
          clip.endSlot = skeletonData.slots[endSlotIndex];
          clip.convex = (flags & 32) !== 0;
          clip.inverse = (flags & 64) !== 0;
          clip.worldVerticesLength = vertices.length;
          clip.vertices = vertices.vertices;
          clip.bones = vertices.bones;
          if (nonessential) Color.rgba8888ToColor(clip.color, color);
          return clip;
        }
      }
    }
    readSequence(input, hasPathSuffix) {
      if (!hasPathSuffix) return new Sequence(1, false);
      const sequence = new Sequence(input.readInt(true), true);
      sequence.start = input.readInt(true);
      sequence.digits = input.readInt(true);
      sequence.setupIndex = input.readInt(true);
      return sequence;
    }
    readVertices(input, weighted) {
      const scale = this.scale;
      const vertexCount = input.readInt(true);
      const length = vertexCount << 1;
      if (!weighted)
        return new Vertices(null, this.readFloatArray(input, length, scale), length);
      const n = input.readInt(true);
      const bones = [];
      const weights = [];
      for (let b = 0, w = 0; b < n; ) {
        const boneCount = input.readInt(true);
        bones[b++] = boneCount;
        for (let ii = 0; ii < boneCount; ii++, w += 3) {
          bones[b++] = input.readInt(true);
          weights[w] = input.readFloat() * scale;
          weights[w + 1] = input.readFloat() * scale;
          weights[w + 2] = input.readFloat();
        }
      }
      return new Vertices(bones, Utils.toFloatArray(weights), length);
    }
    readFloatArray(input, n, scale) {
      const array = [];
      if (scale === 1) {
        for (let i = 0; i < n; i++)
          array[i] = input.readFloat();
      } else {
        for (let i = 0; i < n; i++)
          array[i] = input.readFloat() * scale;
      }
      return array;
    }
    readShortArray(input, n) {
      const array = [];
      for (let i = 0; i < n; i++)
        array[i] = input.readInt(true);
      return array;
    }
    readAnimation(input, name, skeletonData, nonessential) {
      input.readInt(true);
      const timelines = [];
      const scale = this.scale;
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const slotIndex = input.readInt(true);
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const timelineType = input.readByte();
          const frameCount = input.readInt(true);
          const frameLast = frameCount - 1;
          switch (timelineType) {
            case SLOT_ATTACHMENT: {
              const timeline = new AttachmentTimeline(frameCount, slotIndex);
              for (let frame = 0; frame < frameCount; frame++)
                timeline.setFrame(frame, input.readFloat(), input.readStringRef());
              timelines.push(timeline);
              break;
            }
            case SLOT_RGBA: {
              const bezierCount = input.readInt(true);
              const timeline = new RGBATimeline(frameCount, bezierCount, slotIndex);
              let time = input.readFloat();
              let r = input.readUnsignedByte() / 255;
              let g = input.readUnsignedByte() / 255;
              let b = input.readUnsignedByte() / 255;
              let a = input.readUnsignedByte() / 255;
              for (let frame = 0, bezier = 0; ; frame++) {
                timeline.setFrame(frame, time, r, g, b, a);
                if (frame === frameLast) break;
                const time2 = input.readFloat();
                const r2 = input.readUnsignedByte() / 255;
                const g2 = input.readUnsignedByte() / 255;
                const b2 = input.readUnsignedByte() / 255;
                const a2 = input.readUnsignedByte() / 255;
                switch (input.readByte()) {
                  case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                  case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                    setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                    setBezier(input, timeline, bezier++, frame, 3, time, time2, a, a2, 1);
                }
                time = time2;
                r = r2;
                g = g2;
                b = b2;
                a = a2;
              }
              timelines.push(timeline);
              break;
            }
            case SLOT_RGB: {
              const bezierCount = input.readInt(true);
              const timeline = new RGBTimeline(frameCount, bezierCount, slotIndex);
              let time = input.readFloat();
              let r = input.readUnsignedByte() / 255;
              let g = input.readUnsignedByte() / 255;
              let b = input.readUnsignedByte() / 255;
              for (let frame = 0, bezier = 0; ; frame++) {
                timeline.setFrame(frame, time, r, g, b);
                if (frame === frameLast) break;
                const time2 = input.readFloat();
                const r2 = input.readUnsignedByte() / 255;
                const g2 = input.readUnsignedByte() / 255;
                const b2 = input.readUnsignedByte() / 255;
                switch (input.readByte()) {
                  case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                  case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, r, r2, 1);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, g, g2, 1);
                    setBezier(input, timeline, bezier++, frame, 2, time, time2, b, b2, 1);
                }
                time = time2;
                r = r2;
                g = g2;
                b = b2;
              }
              timelines.push(timeline);
              break;
            }
            case SLOT_RGBA2: {
              const bezierCount = input.readInt(true);
              const timeline = new RGBA2Timeline(frameCount, bezierCount, slotIndex);
              let time = input.readFloat();
              let r = input.readUnsignedByte() / 255;
              let g = input.readUnsignedByte() / 255;
              let b = input.readUnsignedByte() / 255;
              let a = input.readUnsignedByte() / 255;
              let r2 = input.readUnsignedByte() / 255;
              let g2 = input.readUnsignedByte() / 255;
              let b2 = input.readUnsignedByte() / 255;
              for (let frame = 0, bezier = 0; ; frame++) {
                timeline.setFrame(frame, time, r, g, b, a, r2, g2, b2);
                if (frame === frameLast) break;
                const time2 = input.readFloat();
                const nr = input.readUnsignedByte() / 255;
                const ng = input.readUnsignedByte() / 255;
                const nb = input.readUnsignedByte() / 255;
                const na = input.readUnsignedByte() / 255;
                const nr2 = input.readUnsignedByte() / 255;
                const ng2 = input.readUnsignedByte() / 255;
                const nb2 = input.readUnsignedByte() / 255;
                switch (input.readByte()) {
                  case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                  case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                    setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                    setBezier(input, timeline, bezier++, frame, 3, time, time2, a, na, 1);
                    setBezier(input, timeline, bezier++, frame, 4, time, time2, r2, nr2, 1);
                    setBezier(input, timeline, bezier++, frame, 5, time, time2, g2, ng2, 1);
                    setBezier(input, timeline, bezier++, frame, 6, time, time2, b2, nb2, 1);
                }
                time = time2;
                r = nr;
                g = ng;
                b = nb;
                a = na;
                r2 = nr2;
                g2 = ng2;
                b2 = nb2;
              }
              timelines.push(timeline);
              break;
            }
            case SLOT_RGB2: {
              const bezierCount = input.readInt(true);
              const timeline = new RGB2Timeline(frameCount, bezierCount, slotIndex);
              let time = input.readFloat();
              let r = input.readUnsignedByte() / 255;
              let g = input.readUnsignedByte() / 255;
              let b = input.readUnsignedByte() / 255;
              let r2 = input.readUnsignedByte() / 255;
              let g2 = input.readUnsignedByte() / 255;
              let b2 = input.readUnsignedByte() / 255;
              for (let frame = 0, bezier = 0; ; frame++) {
                timeline.setFrame(frame, time, r, g, b, r2, g2, b2);
                if (frame === frameLast) break;
                const time2 = input.readFloat();
                const nr = input.readUnsignedByte() / 255;
                const ng = input.readUnsignedByte() / 255;
                const nb = input.readUnsignedByte() / 255;
                const nr2 = input.readUnsignedByte() / 255;
                const ng2 = input.readUnsignedByte() / 255;
                const nb2 = input.readUnsignedByte() / 255;
                switch (input.readByte()) {
                  case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                  case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, r, nr, 1);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, g, ng, 1);
                    setBezier(input, timeline, bezier++, frame, 2, time, time2, b, nb, 1);
                    setBezier(input, timeline, bezier++, frame, 3, time, time2, r2, nr2, 1);
                    setBezier(input, timeline, bezier++, frame, 4, time, time2, g2, ng2, 1);
                    setBezier(input, timeline, bezier++, frame, 5, time, time2, b2, nb2, 1);
                }
                time = time2;
                r = nr;
                g = ng;
                b = nb;
                r2 = nr2;
                g2 = ng2;
                b2 = nb2;
              }
              timelines.push(timeline);
              break;
            }
            case SLOT_ALPHA: {
              const timeline = new AlphaTimeline(frameCount, input.readInt(true), slotIndex);
              let time = input.readFloat(), a = input.readUnsignedByte() / 255;
              for (let frame = 0, bezier = 0; ; frame++) {
                timeline.setFrame(frame, time, a);
                if (frame === frameLast) break;
                const time2 = input.readFloat();
                const a2 = input.readUnsignedByte() / 255;
                switch (input.readByte()) {
                  case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                  case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, a, a2, 1);
                }
                time = time2;
                a = a2;
              }
              timelines.push(timeline);
            }
          }
        }
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const boneIndex = input.readInt(true);
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const type = input.readByte(), frameCount = input.readInt(true);
          if (type === BONE_INHERIT) {
            const timeline = new InheritTimeline(frameCount, boneIndex);
            for (let frame = 0; frame < frameCount; frame++) {
              timeline.setFrame(frame, input.readFloat(), input.readByte());
            }
            timelines.push(timeline);
            continue;
          }
          const bezierCount = input.readInt(true);
          switch (type) {
            case BONE_ROTATE:
              readTimeline(input, timelines, new RotateTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
            case BONE_TRANSLATE:
              readTimeline(input, timelines, new TranslateTimeline(frameCount, bezierCount, boneIndex), scale);
              break;
            case BONE_TRANSLATEX:
              readTimeline(input, timelines, new TranslateXTimeline(frameCount, bezierCount, boneIndex), scale);
              break;
            case BONE_TRANSLATEY:
              readTimeline(input, timelines, new TranslateYTimeline(frameCount, bezierCount, boneIndex), scale);
              break;
            case BONE_SCALE:
              readTimeline(input, timelines, new ScaleTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
            case BONE_SCALEX:
              readTimeline(input, timelines, new ScaleXTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
            case BONE_SCALEY:
              readTimeline(input, timelines, new ScaleYTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
            case BONE_SHEAR:
              readTimeline(input, timelines, new ShearTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
            case BONE_SHEARX:
              readTimeline(input, timelines, new ShearXTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
            case BONE_SHEARY:
              readTimeline(input, timelines, new ShearYTimeline(frameCount, bezierCount, boneIndex), 1);
              break;
          }
        }
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
        const timeline = new IkConstraintTimeline(frameCount, input.readInt(true), index);
        let flags = input.readByte();
        let time = input.readFloat(), mix = (flags & 1) !== 0 ? (flags & 2) !== 0 ? input.readFloat() : 1 : 0;
        let softness = (flags & 4) !== 0 ? input.readFloat() * scale : 0;
        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(frame, time, mix, softness, (flags & 8) !== 0 ? 1 : -1, (flags & 16) !== 0, (flags & 32) !== 0);
          if (frame === frameLast) break;
          flags = input.readByte();
          const time2 = input.readFloat(), mix2 = (flags & 1) !== 0 ? (flags & 2) !== 0 ? input.readFloat() : 1 : 0;
          const softness2 = (flags & 4) !== 0 ? input.readFloat() * scale : 0;
          if ((flags & 64) !== 0) {
            timeline.setStepped(frame);
          } else if ((flags & 128) !== 0) {
            setBezier(input, timeline, bezier++, frame, 0, time, time2, mix, mix2, 1);
            setBezier(input, timeline, bezier++, frame, 1, time, time2, softness, softness2, scale);
          }
          time = time2;
          mix = mix2;
          softness = softness2;
        }
        timelines.push(timeline);
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const index = input.readInt(true), frameCount = input.readInt(true), frameLast = frameCount - 1;
        const timeline = new TransformConstraintTimeline(frameCount, input.readInt(true), index);
        let time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat(), mixScaleX = input.readFloat(), mixScaleY = input.readFloat(), mixShearY = input.readFloat();
        for (let frame = 0, bezier = 0; ; frame++) {
          timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
          if (frame === frameLast) break;
          const time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat(), mixScaleX2 = input.readFloat(), mixScaleY2 = input.readFloat(), mixShearY2 = input.readFloat();
          switch (input.readByte()) {
            case CURVE_STEPPED:
              timeline.setStepped(frame);
              break;
            case CURVE_BEZIER:
              setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
              setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
              setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
              setBezier(input, timeline, bezier++, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
              setBezier(input, timeline, bezier++, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
              setBezier(input, timeline, bezier++, frame, 5, time, time2, mixShearY, mixShearY2, 1);
          }
          time = time2;
          mixRotate = mixRotate2;
          mixX = mixX2;
          mixY = mixY2;
          mixScaleX = mixScaleX2;
          mixScaleY = mixScaleY2;
          mixShearY = mixShearY2;
        }
        timelines.push(timeline);
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const index = input.readInt(true);
        const data = skeletonData.constraints[index];
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const type = input.readByte(), frameCount = input.readInt(true), bezierCount = input.readInt(true);
          switch (type) {
            case PATH_POSITION:
              readTimeline(
                input,
                timelines,
                new PathConstraintPositionTimeline(frameCount, bezierCount, index),
                data.positionMode === 0 /* Fixed */ ? scale : 1
              );
              break;
            case PATH_SPACING:
              readTimeline(
                input,
                timelines,
                new PathConstraintSpacingTimeline(frameCount, bezierCount, index),
                data.spacingMode === 0 /* Length */ || data.spacingMode === 1 /* Fixed */ ? scale : 1
              );
              break;
            case PATH_MIX: {
              const timeline = new PathConstraintMixTimeline(frameCount, bezierCount, index);
              let time = input.readFloat(), mixRotate = input.readFloat(), mixX = input.readFloat(), mixY = input.readFloat();
              for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1; ; frame++) {
                timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                if (frame === frameLast) break;
                const time2 = input.readFloat(), mixRotate2 = input.readFloat(), mixX2 = input.readFloat(), mixY2 = input.readFloat();
                switch (input.readByte()) {
                  case CURVE_STEPPED:
                    timeline.setStepped(frame);
                    break;
                  case CURVE_BEZIER:
                    setBezier(input, timeline, bezier++, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                    setBezier(input, timeline, bezier++, frame, 1, time, time2, mixX, mixX2, 1);
                    setBezier(input, timeline, bezier++, frame, 2, time, time2, mixY, mixY2, 1);
                }
                time = time2;
                mixRotate = mixRotate2;
                mixX = mixX2;
                mixY = mixY2;
              }
              timelines.push(timeline);
            }
          }
        }
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const index = input.readInt(true) - 1;
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const type = input.readByte(), frameCount = input.readInt(true);
          if (type === PHYSICS_RESET) {
            const timeline = new PhysicsConstraintResetTimeline(frameCount, index);
            for (let frame = 0; frame < frameCount; frame++)
              timeline.setFrame(frame, input.readFloat());
            timelines.push(timeline);
            continue;
          }
          const bezierCount = input.readInt(true);
          switch (type) {
            case PHYSICS_INERTIA:
              readTimeline(input, timelines, new PhysicsConstraintInertiaTimeline(frameCount, bezierCount, index), 1);
              break;
            case PHYSICS_STRENGTH:
              readTimeline(input, timelines, new PhysicsConstraintStrengthTimeline(frameCount, bezierCount, index), 1);
              break;
            case PHYSICS_DAMPING:
              readTimeline(input, timelines, new PhysicsConstraintDampingTimeline(frameCount, bezierCount, index), 1);
              break;
            case PHYSICS_MASS:
              readTimeline(input, timelines, new PhysicsConstraintMassTimeline(frameCount, bezierCount, index), 1);
              break;
            case PHYSICS_WIND:
              readTimeline(input, timelines, new PhysicsConstraintWindTimeline(frameCount, bezierCount, index), 1);
              break;
            case PHYSICS_GRAVITY:
              readTimeline(input, timelines, new PhysicsConstraintGravityTimeline(frameCount, bezierCount, index), 1);
              break;
            case PHYSICS_MIX:
              readTimeline(input, timelines, new PhysicsConstraintMixTimeline(frameCount, bezierCount, index), 1);
              break;
            default:
              throw new Error("Unknown physics timeline type.");
          }
        }
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const index = input.readInt(true);
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const type = input.readByte(), frameCount = input.readInt(true), bezierCount = input.readInt(true);
          switch (type) {
            case SLIDER_TIME:
              readTimeline(input, timelines, new SliderTimeline(frameCount, bezierCount, index), 1);
              break;
            case SLIDER_MIX:
              readTimeline(input, timelines, new SliderMixTimeline(frameCount, bezierCount, index), 1);
              break;
            default:
              throw new Error(`Uknown slider type: ${type}`);
          }
        }
      }
      for (let i = 0, n = input.readInt(true); i < n; i++) {
        const skin = skeletonData.skins[input.readInt(true)];
        for (let ii = 0, nn = input.readInt(true); ii < nn; ii++) {
          const slotIndex = input.readInt(true);
          for (let iii = 0, nnn = input.readInt(true); iii < nnn; iii++) {
            const attachmentName = input.readStringRef();
            if (!attachmentName) throw new Error("attachmentName must not be null.");
            const attachment = skin.getAttachment(slotIndex, attachmentName);
            const timelineType = input.readByte();
            const frameCount = input.readInt(true);
            const frameLast = frameCount - 1;
            switch (timelineType) {
              case ATTACHMENT_DEFORM: {
                const vertexAttachment = attachment;
                const weighted = vertexAttachment.bones;
                const vertices = vertexAttachment.vertices;
                const deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
                const bezierCount = input.readInt(true);
                const timeline = new DeformTimeline(frameCount, bezierCount, slotIndex, vertexAttachment);
                let time = input.readFloat();
                for (let frame = 0, bezier = 0; ; frame++) {
                  let deform;
                  let end = input.readInt(true);
                  if (end === 0)
                    deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                  else {
                    deform = Utils.newFloatArray(deformLength);
                    const start = input.readInt(true);
                    end += start;
                    if (scale === 1) {
                      for (let v = start; v < end; v++)
                        deform[v] = input.readFloat();
                    } else {
                      for (let v = start; v < end; v++)
                        deform[v] = input.readFloat() * scale;
                    }
                    if (!weighted) {
                      for (let v = 0, vn = deform.length; v < vn; v++)
                        deform[v] += vertices[v];
                    }
                  }
                  timeline.setFrame(frame, time, deform);
                  if (frame === frameLast) break;
                  const time2 = input.readFloat();
                  switch (input.readByte()) {
                    case CURVE_STEPPED:
                      timeline.setStepped(frame);
                      break;
                    case CURVE_BEZIER:
                      setBezier(input, timeline, bezier++, frame, 0, time, time2, 0, 1, 1);
                  }
                  time = time2;
                }
                timelines.push(timeline);
                break;
              }
              case ATTACHMENT_SEQUENCE: {
                const timeline = new SequenceTimeline(frameCount, slotIndex, attachment);
                for (let frame = 0; frame < frameCount; frame++) {
                  const time = input.readFloat();
                  const modeAndIndex = input.readInt32();
                  timeline.setFrame(
                    frame,
                    time,
                    SequenceModeValues[modeAndIndex & 15],
                    modeAndIndex >> 4,
                    input.readFloat()
                  );
                }
                timelines.push(timeline);
                break;
              }
            }
          }
        }
      }
      const slotCount = skeletonData.slots.length;
      const drawOrderCount = input.readInt(true);
      if (drawOrderCount > 0) {
        const timeline = new DrawOrderTimeline(drawOrderCount);
        for (let i = 0; i < drawOrderCount; i++)
          timeline.setFrame(i, input.readFloat(), readDrawOrder(input, slotCount));
        timelines.push(timeline);
      }
      const folderCount = input.readInt(true);
      for (let i = 0; i < folderCount; i++) {
        const folderSlotCount = input.readInt(true);
        const folderSlots = new Array(folderSlotCount);
        for (let ii = 0; ii < folderSlotCount; ii++)
          folderSlots[ii] = input.readInt(true);
        const keyCount = input.readInt(true);
        const timeline = new DrawOrderFolderTimeline(keyCount, folderSlots, slotCount);
        for (let ii = 0; ii < keyCount; ii++)
          timeline.setFrame(ii, input.readFloat(), readDrawOrder(input, folderSlotCount));
        timelines.push(timeline);
      }
      const eventCount = input.readInt(true);
      if (eventCount > 0) {
        const timeline = new EventTimeline(eventCount);
        for (let i = 0; i < eventCount; i++) {
          const time = input.readFloat();
          const eventData = skeletonData.events[input.readInt(true)];
          const event = new Event(time, eventData);
          event.intValue = input.readInt(false);
          event.floatValue = input.readFloat();
          event.stringValue = input.readString();
          if (event.stringValue == null) event.stringValue = eventData.setupPose.stringValue;
          if (event.data.audioPath) {
            event.volume = input.readFloat();
            event.balance = input.readFloat();
          }
          timeline.setFrame(i, event);
        }
        timelines.push(timeline);
      }
      let duration = 0;
      for (let i = 0, n = timelines.length; i < n; i++)
        duration = Math.max(duration, timelines[i].getDuration());
      const animation = new Animation(name, timelines, duration);
      if (nonessential) Color.rgba8888ToColor(animation.color, input.readInt32());
      return animation;
    }
  };
  var BinaryInput = class {
    constructor(data, strings = [], index = 0, buffer = new DataView(data instanceof ArrayBuffer ? data : data.buffer)) {
      this.strings = strings;
      this.index = index;
      this.buffer = buffer;
    }
    readByte() {
      return this.buffer.getInt8(this.index++);
    }
    readUnsignedByte() {
      return this.buffer.getUint8(this.index++);
    }
    readShort() {
      const value = this.buffer.getInt16(this.index);
      this.index += 2;
      return value;
    }
    readInt32() {
      const value = this.buffer.getInt32(this.index);
      this.index += 4;
      return value;
    }
    readInt(optimizePositive) {
      let b = this.readByte();
      let result = b & 127;
      if ((b & 128) !== 0) {
        b = this.readByte();
        result |= (b & 127) << 7;
        if ((b & 128) !== 0) {
          b = this.readByte();
          result |= (b & 127) << 14;
          if ((b & 128) !== 0) {
            b = this.readByte();
            result |= (b & 127) << 21;
            if ((b & 128) !== 0) {
              b = this.readByte();
              result |= (b & 127) << 28;
            }
          }
        }
      }
      return optimizePositive ? result : result >>> 1 ^ -(result & 1);
    }
    readStringRef() {
      const index = this.readInt(true);
      return index === 0 ? null : this.strings[index - 1];
    }
    readString() {
      let byteCount = this.readInt(true);
      switch (byteCount) {
        case 0:
          return null;
        case 1:
          return "";
      }
      byteCount--;
      let chars = "";
      for (let i = 0; i < byteCount; ) {
        const b = this.readUnsignedByte();
        switch (b >> 4) {
          case 12:
          case 13:
            chars += String.fromCharCode((b & 31) << 6 | this.readByte() & 63);
            i += 2;
            break;
          case 14:
            chars += String.fromCharCode((b & 15) << 12 | (this.readByte() & 63) << 6 | this.readByte() & 63);
            i += 3;
            break;
          default:
            chars += String.fromCharCode(b);
            i++;
        }
      }
      return chars;
    }
    readFloat() {
      const value = this.buffer.getFloat32(this.index);
      this.index += 4;
      return value;
    }
    readBoolean() {
      return this.readByte() !== 0;
    }
  };
  var LinkedMesh = class {
    source;
    skinIndex;
    slotIndex;
    sourceIndex;
    mesh;
    inheritTimelines;
    constructor(mesh, skinIndex, slotIndex, sourceIndex, source, inheritTimelines) {
      this.mesh = mesh;
      this.skinIndex = skinIndex;
      this.slotIndex = slotIndex;
      this.sourceIndex = sourceIndex;
      this.source = source;
      this.inheritTimelines = inheritTimelines;
    }
  };
  var Vertices = class {
    constructor(bones = null, vertices, length = 0) {
      this.bones = bones;
      this.vertices = vertices;
      this.length = length;
    }
  };
  function readTimeline(input, timelines, timeline, scale) {
    if (timeline instanceof CurveTimeline1)
      readTimeline1(input, timelines, timeline, scale);
    else
      readTimeline2(input, timelines, timeline, scale);
  }
  function readTimeline1(input, timelines, timeline, scale) {
    let time = input.readFloat(), value = input.readFloat() * scale;
    for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1; ; frame++) {
      timeline.setFrame(frame, time, value);
      if (frame === frameLast) break;
      const time2 = input.readFloat(), value2 = input.readFloat() * scale;
      switch (input.readByte()) {
        case CURVE_STEPPED:
          timeline.setStepped(frame);
          break;
        case CURVE_BEZIER:
          setBezier(input, timeline, bezier++, frame, 0, time, time2, value, value2, scale);
      }
      time = time2;
      value = value2;
    }
    timelines.push(timeline);
  }
  function readTimeline2(input, timelines, timeline, scale) {
    let time = input.readFloat(), value1 = input.readFloat() * scale, value2 = input.readFloat() * scale;
    for (let frame = 0, bezier = 0, frameLast = timeline.getFrameCount() - 1; ; frame++) {
      timeline.setFrame(frame, time, value1, value2);
      if (frame === frameLast) break;
      const time2 = input.readFloat(), nvalue1 = input.readFloat() * scale, nvalue2 = input.readFloat() * scale;
      switch (input.readByte()) {
        case CURVE_STEPPED:
          timeline.setStepped(frame);
          break;
        case CURVE_BEZIER:
          setBezier(input, timeline, bezier++, frame, 0, time, time2, value1, nvalue1, scale);
          setBezier(input, timeline, bezier++, frame, 1, time, time2, value2, nvalue2, scale);
      }
      time = time2;
      value1 = nvalue1;
      value2 = nvalue2;
    }
    timelines.push(timeline);
  }
  function readDrawOrder(input, slotCount) {
    const changeCount = input.readInt(true);
    if (changeCount === 0) return null;
    const drawOrder = new Array(slotCount).fill(-1);
    const unchanged = new Array(slotCount - changeCount);
    let originalIndex = 0, unchangedIndex = 0;
    for (let i = 0; i < changeCount; i++) {
      const slotIndex = input.readInt(true);
      while (originalIndex !== slotIndex)
        unchanged[unchangedIndex++] = originalIndex++;
      drawOrder[originalIndex + input.readInt(true)] = originalIndex++;
    }
    while (originalIndex < slotCount)
      unchanged[unchangedIndex++] = originalIndex++;
    for (let i = slotCount - 1; i >= 0; i--)
      if (drawOrder[i] === -1) drawOrder[i] = unchanged[--unchangedIndex];
    return drawOrder;
  }
  function setBezier(input, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
    timeline.setBezier(bezier, frame, value, time1, value1, input.readFloat(), input.readFloat() * scale, input.readFloat(), input.readFloat() * scale, time2, value2);
  }
  var BONE_ROTATE = 0;
  var BONE_TRANSLATE = 1;
  var BONE_TRANSLATEX = 2;
  var BONE_TRANSLATEY = 3;
  var BONE_SCALE = 4;
  var BONE_SCALEX = 5;
  var BONE_SCALEY = 6;
  var BONE_SHEAR = 7;
  var BONE_SHEARX = 8;
  var BONE_SHEARY = 9;
  var BONE_INHERIT = 10;
  var SLOT_ATTACHMENT = 0;
  var SLOT_RGBA = 1;
  var SLOT_RGB = 2;
  var SLOT_RGBA2 = 3;
  var SLOT_RGB2 = 4;
  var SLOT_ALPHA = 5;
  var CONSTRAINT_IK = 0;
  var CONSTRAINT_PATH = 1;
  var CONSTRAINT_TRANSFORM = 2;
  var CONSTRAINT_PHYSICS = 3;
  var CONSTRAINT_SLIDER = 4;
  var ATTACHMENT_DEFORM = 0;
  var ATTACHMENT_SEQUENCE = 1;
  var PATH_POSITION = 0;
  var PATH_SPACING = 1;
  var PATH_MIX = 2;
  var PHYSICS_INERTIA = 0;
  var PHYSICS_STRENGTH = 1;
  var PHYSICS_DAMPING = 2;
  var PHYSICS_MASS = 4;
  var PHYSICS_WIND = 5;
  var PHYSICS_GRAVITY = 6;
  var PHYSICS_MIX = 7;
  var PHYSICS_RESET = 8;
  var SLIDER_TIME = 0;
  var SLIDER_MIX = 1;
  var CURVE_STEPPED = 1;
  var CURVE_BEZIER = 2;

  // spine-core/src/SkeletonBounds.ts
  var SkeletonBounds = class {
    /** The left edge of the axis aligned bounding box. */
    minX = 0;
    /** The bottom edge of the axis aligned bounding box. */
    minY = 0;
    /** The right edge of the axis aligned bounding box. */
    maxX = 0;
    /** The top edge of the axis aligned bounding box. */
    maxY = 0;
    /** The visible bounding boxes. */
    boundingBoxes = [];
    /** The world vertices for the bounding box polygons. */
    polygons = [];
    polygonPool = new Pool(() => {
      return Utils.newFloatArray(16);
    });
    /** Clears any previous polygons, finds all visible bounding box attachments, and computes the world vertices for each bounding
     * box's polygon.
     * @param updateAabb If true, the axis aligned bounding box containing all the polygons is computed. If false, the
     *           SkeletonBounds AABB methods will always return true. */
    update(skeleton, updateAabb) {
      if (!skeleton) throw new Error("skeleton cannot be null.");
      const boundingBoxes = this.boundingBoxes;
      const polygons = this.polygons;
      const polygonPool = this.polygonPool;
      const slots = skeleton.slots;
      const slotCount = slots.length;
      boundingBoxes.length = 0;
      polygonPool.freeAll(polygons);
      polygons.length = 0;
      for (let i = 0; i < slotCount; i++) {
        const slot = slots[i];
        if (!slot.bone.active) continue;
        const attachment = slot.appliedPose.attachment;
        if (attachment instanceof BoundingBoxAttachment) {
          boundingBoxes.push(attachment);
          let polygon = polygonPool.obtain();
          if (polygon.length !== attachment.worldVerticesLength) {
            polygon = Utils.newFloatArray(attachment.worldVerticesLength);
          }
          polygons.push(polygon);
          attachment.computeWorldVertices(skeleton, slot, 0, attachment.worldVerticesLength, polygon, 0, 2);
        }
      }
      if (updateAabb) {
        this.aabbCompute();
      } else {
        this.minX = Number.POSITIVE_INFINITY;
        this.minY = Number.POSITIVE_INFINITY;
        this.maxX = Number.NEGATIVE_INFINITY;
        this.maxY = Number.NEGATIVE_INFINITY;
      }
    }
    aabbCompute() {
      let minX = Number.POSITIVE_INFINITY, minY = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
      const polygons = this.polygons;
      for (let i = 0, n = polygons.length; i < n; i++) {
        const polygon = polygons[i];
        const vertices = polygon;
        for (let ii = 0, nn = polygon.length; ii < nn; ii += 2) {
          const x = vertices[ii];
          const y = vertices[ii + 1];
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
      this.minX = minX;
      this.minY = minY;
      this.maxX = maxX;
      this.maxY = maxY;
    }
    /** Returns true if the axis aligned bounding box contains the point. */
    aabbContainsPoint(x, y) {
      return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY;
    }
    /** Returns true if the axis aligned bounding box intersects the line segment. */
    aabbIntersectsSegment(x1, y1, x2, y2) {
      const minX = this.minX;
      const minY = this.minY;
      const maxX = this.maxX;
      const maxY = this.maxY;
      if (x1 <= minX && x2 <= minX || y1 <= minY && y2 <= minY || x1 >= maxX && x2 >= maxX || y1 >= maxY && y2 >= maxY)
        return false;
      const m = (y2 - y1) / (x2 - x1);
      let y = m * (minX - x1) + y1;
      if (y > minY && y < maxY) return true;
      y = m * (maxX - x1) + y1;
      if (y > minY && y < maxY) return true;
      let x = (minY - y1) / m + x1;
      if (x > minX && x < maxX) return true;
      x = (maxY - y1) / m + x1;
      if (x > minX && x < maxX) return true;
      return false;
    }
    /** Returns true if the axis aligned bounding box intersects the axis aligned bounding box of the specified bounds. */
    aabbIntersectsSkeleton(bounds) {
      return this.minX < bounds.maxX && this.maxX > bounds.minX && this.minY < bounds.maxY && this.maxY > bounds.minY;
    }
    /** Returns the first bounding box attachment that contains the point, or null. When doing many checks, it is usually more
     * efficient to only call this method if {@link aabbContainsPoint} returns true. */
    containsPoint(x, y) {
      const polygons = this.polygons;
      for (let i = 0, n = polygons.length; i < n; i++)
        if (this.containsPointPolygon(polygons[i], x, y)) return this.boundingBoxes[i];
      return null;
    }
    /** Returns true if the polygon contains the point. */
    containsPointPolygon(polygon, x, y) {
      const vertices = polygon;
      const nn = polygon.length;
      let prevIndex = nn - 2;
      let inside = false;
      for (let ii = 0; ii < nn; ii += 2) {
        const vertexY = vertices[ii + 1];
        const prevY = vertices[prevIndex + 1];
        if (vertexY < y && prevY >= y || prevY < y && vertexY >= y) {
          const vertexX = vertices[ii];
          if (vertexX + (y - vertexY) / (prevY - vertexY) * (vertices[prevIndex] - vertexX) < x) inside = !inside;
        }
        prevIndex = ii;
      }
      return inside;
    }
    /** Returns the first bounding box attachment that contains any part of the line segment, or null. When doing many checks, it
     * is usually more efficient to only call this method if {@link aabbIntersectsSegment} returns
     * true. */
    intersectsSegment(x1, y1, x2, y2) {
      const polygons = this.polygons;
      for (let i = 0, n = polygons.length; i < n; i++)
        if (this.intersectsSegmentPolygon(polygons[i], x1, y1, x2, y2)) return this.boundingBoxes[i];
      return null;
    }
    /** Returns true if the polygon contains any part of the line segment. */
    intersectsSegmentPolygon(polygon, x1, y1, x2, y2) {
      const vertices = polygon;
      const nn = polygon.length;
      const width12 = x1 - x2, height12 = y1 - y2;
      const det1 = x1 * y2 - y1 * x2;
      let x3 = vertices[nn - 2], y3 = vertices[nn - 1];
      for (let ii = 0; ii < nn; ii += 2) {
        const x4 = vertices[ii], y4 = vertices[ii + 1];
        const det2 = x3 * y4 - y3 * x4;
        const width34 = x3 - x4, height34 = y3 - y4;
        const det3 = width12 * height34 - height12 * width34;
        const x = (det1 * width34 - width12 * det2) / det3;
        if ((x >= x3 && x <= x4 || x >= x4 && x <= x3) && (x >= x1 && x <= x2 || x >= x2 && x <= x1)) {
          const y = (det1 * height34 - height12 * det2) / det3;
          if ((y >= y3 && y <= y4 || y >= y4 && y <= y3) && (y >= y1 && y <= y2 || y >= y2 && y <= y1)) return true;
        }
        x3 = x4;
        y3 = y4;
      }
      return false;
    }
    /** Returns the polygon for the specified bounding box, or null. */
    getPolygon(boundingBox) {
      if (!boundingBox) throw new Error("boundingBox cannot be null.");
      const index = this.boundingBoxes.indexOf(boundingBox);
      return index === -1 ? null : this.polygons[index];
    }
    /** The width of the axis aligned bounding box. */
    getWidth() {
      return this.maxX - this.minX;
    }
    /** The height of the axis aligned bounding box. */
    getHeight() {
      return this.maxY - this.minY;
    }
  };

  // spine-core/src/Triangulator.ts
  var Triangulator = class _Triangulator {
    convexPolygons = [];
    convexPolygonsIndices = [];
    indicesArray = [];
    isConcaveArray = [];
    triangles = [];
    polygonPool = new Pool(() => {
      return [];
    });
    polygonIndicesPool = new Pool(() => {
      return [];
    });
    triangulate(verticesArray) {
      const vertices = verticesArray;
      let vertexCount = verticesArray.length >> 1;
      const indices = this.indicesArray;
      indices.length = 0;
      for (let i = 0; i < vertexCount; i++)
        indices[i] = i;
      const isConcave = this.isConcaveArray;
      isConcave.length = 0;
      for (let i = 0; i < vertexCount; i++)
        isConcave[i] = _Triangulator.isConcave(i, vertexCount, vertices, indices);
      const triangles = this.triangles;
      triangles.length = 0;
      while (vertexCount > 3) {
        let previous = vertexCount - 1, i = 0, next = 1;
        while (true) {
          outer:
            if (!isConcave[i]) {
              const p1 = indices[previous] << 1, p2 = indices[i] << 1, p3 = indices[next] << 1;
              const p1x = vertices[p1], p1y = vertices[p1 + 1];
              const p2x = vertices[p2], p2y = vertices[p2 + 1];
              const p3x = vertices[p3], p3y = vertices[p3 + 1];
              for (let ii = next + 1 < vertexCount ? next + 1 : 0; ii !== previous; ) {
                if (isConcave[ii]) {
                  const v = indices[ii] << 1;
                  const vx = vertices[v], vy = vertices[v + 1];
                  if (_Triangulator.positiveArea(p3x, p3y, p1x, p1y, vx, vy) && _Triangulator.positiveArea(p1x, p1y, p2x, p2y, vx, vy) && _Triangulator.positiveArea(p2x, p2y, p3x, p3y, vx, vy)) break outer;
                }
                if (++ii === vertexCount) ii = 0;
              }
              break;
            }
          if (next === 0) {
            do {
              if (!isConcave[i]) break;
              i--;
            } while (i > 0);
            previous = i > 0 ? i - 1 : vertexCount - 1;
            next = i + 1 < vertexCount ? i + 1 : 0;
            break;
          }
          previous = i;
          i = next;
          if (++next === vertexCount) next = 0;
        }
        triangles.push(indices[previous], indices[i], indices[next]);
        indices.splice(i, 1);
        isConcave.splice(i, 1);
        vertexCount--;
        const previousIndex = i > 0 ? i - 1 : vertexCount - 1;
        const nextIndex = i < vertexCount ? i : 0;
        isConcave[previousIndex] = _Triangulator.isConcave(previousIndex, vertexCount, vertices, indices);
        isConcave[nextIndex] = _Triangulator.isConcave(nextIndex, vertexCount, vertices, indices);
      }
      if (vertexCount === 3) triangles.push(indices[2], indices[0], indices[1]);
      return triangles;
    }
    decompose(verticesArray, triangles) {
      const vertices = verticesArray;
      const convexPolygons = this.convexPolygons;
      this.polygonPool.freeAll(convexPolygons);
      convexPolygons.length = 0;
      const convexPolygonsIndices = this.convexPolygonsIndices;
      this.polygonIndicesPool.freeAll(convexPolygonsIndices);
      convexPolygonsIndices.length = 0;
      let polygonIndices = this.polygonIndicesPool.obtain();
      polygonIndices.length = 0;
      let polygon = this.polygonPool.obtain();
      polygon.length = 0;
      let fanBaseIndex = -1, lastWinding = 0;
      for (let i = 0, n = triangles.length; i < n; i += 3) {
        const t1 = triangles[i] << 1, t2 = triangles[i + 1] << 1, t3 = triangles[i + 2] << 1;
        const x1 = vertices[t1], y1 = vertices[t1 + 1];
        const x2 = vertices[t2], y2 = vertices[t2 + 1];
        const x3 = vertices[t3], y3 = vertices[t3 + 1];
        if (fanBaseIndex === t1) {
          const o = polygon.length - 4;
          if (_Triangulator.winding(polygon[o], polygon[o + 1], polygon[o + 2], polygon[o + 3], x3, y3) === lastWinding && _Triangulator.winding(x3, y3, polygon[0], polygon[1], polygon[2], polygon[3]) === lastWinding) {
            polygon.push(x3, y3);
            polygonIndices.push(t3);
            continue;
          }
        }
        if (polygon.length > 0) {
          convexPolygons.push(polygon);
          convexPolygonsIndices.push(polygonIndices);
          polygon = this.polygonPool.obtain();
          polygonIndices = this.polygonIndicesPool.obtain();
        }
        polygon.length = 0;
        polygon.push(x1, y1, x2, y2);
        polygon.push(x3, y3);
        polygonIndices.length = 0;
        polygonIndices.push(t1, t2, t3);
        lastWinding = _Triangulator.winding(x1, y1, x2, y2, x3, y3);
        fanBaseIndex = t1;
      }
      if (polygon.length > 0) {
        convexPolygons.push(polygon);
        convexPolygonsIndices.push(polygonIndices);
      }
      for (let i = 0, n = convexPolygons.length; i < n; i++) {
        polygonIndices = convexPolygonsIndices[i];
        if (polygonIndices.length === 0) continue;
        const firstIndex = polygonIndices[0];
        let lastIndex = polygonIndices[polygonIndices.length - 1];
        polygon = convexPolygons[i];
        const o = polygon.length - 4;
        let prevPrevX = polygon[o], prevPrevY = polygon[o + 1];
        let prevX = polygon[o + 2], prevY = polygon[o + 3];
        const firstX = polygon[0], firstY = polygon[1];
        const secondX = polygon[2], secondY = polygon[3];
        const winding = _Triangulator.winding(prevPrevX, prevPrevY, prevX, prevY, firstX, firstY);
        for (let ii = 0; ii < n; ii++) {
          if (ii === i) continue;
          const otherIndices = convexPolygonsIndices[ii];
          if (otherIndices.length !== 3) continue;
          const otherFirstIndex = otherIndices[0];
          const otherSecondIndex = otherIndices[1];
          const otherLastIndex = otherIndices[2];
          const otherPoly = convexPolygons[ii];
          const x3 = otherPoly[otherPoly.length - 2], y3 = otherPoly[otherPoly.length - 1];
          if (otherFirstIndex !== firstIndex || otherSecondIndex !== lastIndex) continue;
          if (_Triangulator.winding(prevPrevX, prevPrevY, prevX, prevY, x3, y3) === winding && _Triangulator.winding(x3, y3, firstX, firstY, secondX, secondY) === winding) {
            otherPoly.length = 0;
            otherIndices.length = 0;
            polygon.push(x3, y3);
            polygonIndices.push(otherLastIndex);
            lastIndex = otherLastIndex;
            prevPrevX = prevX;
            prevPrevY = prevY;
            prevX = x3;
            prevY = y3;
            ii = -1;
          }
        }
      }
      for (let i = convexPolygons.length - 1; i >= 0; i--) {
        polygon = convexPolygons[i];
        if (polygon.length === 0) {
          convexPolygons.splice(i, 1);
          this.polygonPool.free(polygon);
          polygonIndices = convexPolygonsIndices[i];
          convexPolygonsIndices.splice(i, 1);
          this.polygonIndicesPool.free(polygonIndices);
        } else
          polygon.push(polygon[0], polygon[1]);
      }
      return convexPolygons;
    }
    static isConcave(index, vertexCount, vertices, indices) {
      const previous = indices[index > 0 ? index - 1 : vertexCount - 1] << 1;
      const current = indices[index] << 1;
      const next = indices[index + 1 < vertexCount ? index + 1 : 0] << 1;
      return !_Triangulator.positiveArea(
        vertices[previous],
        vertices[previous + 1],
        vertices[current],
        vertices[current + 1],
        vertices[next],
        vertices[next + 1]
      );
    }
    static positiveArea(p1x, p1y, p2x, p2y, p3x, p3y) {
      return p1x * (p3y - p2y) + p2x * (p1y - p3y) + p3x * (p2y - p1y) >= 0;
    }
    static winding(p1x, p1y, p2x, p2y, p3x, p3y) {
      return p1x * (p3y - p2y) + p2x * (p1y - p3y) + p3x * (p2y - p1y) >= 0 ? 1 : -1;
    }
  };

  // spine-core/src/SkeletonClipping.ts
  var SkeletonClipping = class {
    triangulator = null;
    clippingPolygon = [];
    clippingPolygons = [];
    clipOutput = [];
    clippedVertices = [];
    /** An empty array unless {@link clipTrianglesUnpacked} was used. **/
    clippedUVs = [];
    clippedTriangles = [];
    inverseVertices = [];
    _clippedVerticesTyped = new Float32Array(1024);
    _clippedUVsTyped = new Float32Array(1024);
    _clippedTrianglesTyped = new Uint16Array(1024);
    clippedVerticesTyped = new Float32Array(0);
    clippedUVsTyped = new Float32Array(0);
    clippedTrianglesTyped = new Uint16Array(0);
    clippedVerticesLength = 0;
    clippedUVsLength = 0;
    clippedTrianglesLength = 0;
    scratch = [];
    inverse = false;
    clipAttachment = null;
    clipStart(skeleton, slot, clip) {
      if (this.clipAttachment) return;
      const n = clip.worldVerticesLength;
      this.clipAttachment = clip;
      this.inverse = clip.inverse;
      const vertices = Utils.setArraySize(this.clippingPolygon, n);
      clip.computeWorldVertices(skeleton, slot, 0, n, vertices, 0, 2);
      const clippingPolygon = this.clippingPolygon;
      const convex = this.makeClockwise(clippingPolygon);
      if (convex || this.inverse || clip.convex) {
        if (!convex) this.makeConvex(clippingPolygon);
        this.clippingPolygon.push(clippingPolygon[0], clippingPolygon[1]);
        this.clippingPolygons.push(clippingPolygon);
      } else {
        if (this.triangulator === null) this.triangulator = new Triangulator();
        this.clippingPolygons.push(...this.triangulator.decompose(clippingPolygon, this.triangulator.triangulate(clippingPolygon)));
      }
    }
    clipEnd(slot) {
      if (!this.clipAttachment) return;
      if (slot && this.clipAttachment.endSlot !== slot.data) return;
      this.clipAttachment = null;
      this.clippingPolygons.length = 0;
    }
    isClipping() {
      return this.clipAttachment != null;
    }
    clipTriangles(vertices, triangles, trianglesLength, uvs, light, dark, twoColor, stride) {
      return uvs && light && dark && typeof twoColor === "boolean" && typeof stride === "number" ? this.clipTrianglesRender(vertices, triangles, trianglesLength, uvs, light, dark, twoColor, stride) : this.clipTrianglesNoRender(vertices, triangles, trianglesLength);
    }
    clipTrianglesNoRender(vertices, triangles, trianglesLength) {
      const clippedVertices = this.clippedVertices;
      clippedVertices.length = 0;
      const clippedTriangles = this.clippedTriangles;
      clippedTriangles.length = 0;
      let index = 0;
      if (this.inverse) {
        const polygon = this.clippingPolygons[0];
        for (let i = 0; i < trianglesLength; i += 3) {
          let t = triangles[i] << 1;
          const x1 = vertices[t], y1 = vertices[t + 1];
          t = triangles[i + 1] << 1;
          const x2 = vertices[t], y2 = vertices[t + 1];
          t = triangles[i + 2] << 1;
          const x3 = vertices[t], y3 = vertices[t + 1];
          this.clipInverse(x1, y1, x2, y2, x3, y3, polygon);
          const iv = this.inverseVertices;
          for (let offset = 0, nn = this.inverseVertices.length; offset < nn; ) {
            const polygonSize = iv[offset++];
            let vertexCount = polygonSize >> 1, s = clippedVertices.length;
            const cv = Utils.setArraySize(clippedVertices, s + polygonSize);
            Utils.arrayCopy(iv, offset, cv, s, polygonSize);
            s = clippedTriangles.length;
            const ct = Utils.setArraySize(clippedTriangles, s + 3 * (vertexCount - 2));
            for (let ii = 1; ii < vertexCount - 1; ii++, s += 3) {
              ct[s] = index;
              ct[s + 1] = index + ii;
              ct[s + 2] = index + ii + 1;
            }
            index += vertexCount;
            offset += polygonSize;
          }
        }
        return true;
      }
      const clipOutput = this.clipOutput;
      const polygons = this.clippingPolygons;
      const polygonsCount = polygons.length;
      let clipOutputItems = null;
      for (let i = 0; i < trianglesLength; i += 3) {
        let t = triangles[i] << 1;
        const x1 = vertices[t], y1 = vertices[t + 1];
        t = triangles[i + 1] << 1;
        const x2 = vertices[t], y2 = vertices[t + 1];
        t = triangles[i + 2] << 1;
        const x3 = vertices[t], y3 = vertices[t + 1];
        for (let p = 0; p < polygonsCount; p++) {
          let s = clippedVertices.length;
          if (this.clip(x1, y1, x2, y2, x3, y3, polygons[p])) {
            clipOutputItems = this.clipOutput;
            const clipOutputLength = clipOutput.length;
            if (clipOutputLength === 0) continue;
            let clipOutputCount = clipOutputLength >> 1;
            const cv = Utils.setArraySize(clippedVertices, s + clipOutputLength);
            Utils.arrayCopy(clipOutputItems, 0, cv, s, clipOutputLength);
            s = clippedTriangles.length;
            const ct = Utils.setArraySize(clippedTriangles, s + 3 * (clipOutputCount - 2));
            clipOutputCount--;
            for (let ii = 1; ii < clipOutputCount; ii++, s += 3) {
              ct[s] = index;
              ct[s + 1] = index + ii;
              ct[s + 2] = index + ii + 1;
            }
            index += clipOutputCount;
          } else {
            const cv = Utils.setArraySize(clippedVertices, s + 3 * 2);
            cv[s] = x1;
            cv[s + 1] = y1;
            cv[s + 2] = x2;
            cv[s + 3] = y2;
            cv[s + 4] = x3;
            cv[s + 5] = y3;
            s = clippedTriangles.length;
            const ct = Utils.setArraySize(clippedTriangles, s + 3);
            ct[s] = index;
            ct[s + 1] = index + 1;
            ct[s + 2] = index + 2;
            index += 3;
            break;
          }
        }
      }
      return clipOutputItems != null;
    }
    clipTrianglesRender(vertices, triangles, trianglesLength, uvs, light, dark, twoColor, stride) {
      const clippedVertices = this.clippedVertices;
      clippedVertices.length = 0;
      const clippedTriangles = this.clippedTriangles;
      clippedTriangles.length = 0;
      let index = 0;
      if (this.inverse) {
        const polygon = this.clippingPolygons[0];
        for (let i = 0; i < trianglesLength; i += 3) {
          let t0 = triangles[i], t1 = triangles[i + 1], t2 = triangles[i + 2];
          const x1 = vertices[t0 * stride], y1 = vertices[t0 * stride + 1];
          const x2 = vertices[t1 * stride], y2 = vertices[t1 * stride + 1];
          const x3 = vertices[t2 * stride], y3 = vertices[t2 * stride + 1];
          this.clipInverse(x1, y1, x2, y2, x3, y3, polygon);
          const nn = this.inverseVertices.length;
          if (nn === 0) continue;
          const u1 = uvs[t0 <<= 1], v1 = uvs[t0 + 1];
          const u2 = uvs[t1 <<= 1], v2 = uvs[t1 + 1];
          const u3 = uvs[t2 <<= 1], v3 = uvs[t2 + 1];
          const d0 = y2 - y3, d1 = x3 - x2, d2 = x1 - x3, d4 = y3 - y1, d = 1 / (d0 * d2 + d1 * (y1 - y3));
          const iv = this.inverseVertices;
          for (let offset = 0; offset < nn; ) {
            const polygonSize = iv[offset++];
            const vertexCount = polygonSize >> 1;
            let s = clippedVertices.length;
            const cv = Utils.setArraySize(clippedVertices, s + vertexCount * stride);
            for (let ii = 0; ii < polygonSize; ii += 2, s += stride) {
              const x = iv[offset + ii], y = iv[offset + ii + 1];
              cv[s] = x;
              cv[s + 1] = y;
              cv[s + 2] = light.r;
              cv[s + 3] = light.g;
              cv[s + 4] = light.b;
              cv[s + 5] = light.a;
              const c0 = x - x3, c1 = y - y3, a = (d0 * c0 + d1 * c1) * d, b = (d4 * c0 + d2 * c1) * d, c = 1 - a - b;
              cv[s + 6] = u1 * a + u2 * b + u3 * c;
              cv[s + 7] = v1 * a + v2 * b + v3 * c;
              if (twoColor) {
                cv[s + 8] = dark.r;
                cv[s + 9] = dark.g;
                cv[s + 10] = dark.b;
                cv[s + 11] = dark.a;
              }
            }
            s = clippedTriangles.length;
            const ct = Utils.setArraySize(clippedTriangles, s + 3 * (vertexCount - 2));
            for (let ii = 1; ii < vertexCount - 1; ii++, s += 3) {
              ct[s] = index;
              ct[s + 1] = index + ii;
              ct[s + 2] = index + ii + 1;
            }
            index += vertexCount;
            offset += polygonSize;
          }
        }
        return true;
      }
      const clipOutput = this.clipOutput;
      const polygons = this.clippingPolygons;
      const polygonsCount = this.clippingPolygons.length;
      let clipOutputItems = null;
      for (let i = 0; i < trianglesLength; i += 3) {
        let t = triangles[i];
        const x1 = vertices[t * stride], y1 = vertices[t * stride + 1];
        const u1 = uvs[t << 1], v1 = uvs[(t << 1) + 1];
        t = triangles[i + 1];
        const x2 = vertices[t * stride], y2 = vertices[t * stride + 1];
        const u2 = uvs[t << 1], v2 = uvs[(t << 1) + 1];
        t = triangles[i + 2];
        const x3 = vertices[t * stride], y3 = vertices[t * stride + 1];
        const u3 = uvs[t << 1], v3 = uvs[(t << 1) + 1];
        let d0 = 0, d1 = 0, d2 = 0, d4 = 0, d = 0;
        for (let p = 0; p < polygonsCount; p++) {
          let s = clippedVertices.length;
          if (this.clip(x1, y1, x2, y2, x3, y3, polygons[p])) {
            clipOutputItems = this.clipOutput;
            const clipOutputLength = clipOutput.length;
            if (clipOutputLength === 0) continue;
            let clipOutputCount = clipOutputLength >> 1;
            if (d === 0) {
              d0 = y2 - y3;
              d1 = x3 - x2;
              d2 = x1 - x3;
              d4 = y3 - y1;
              d = 1 / (d0 * d2 - d1 * d4);
            }
            const cv = Utils.setArraySize(clippedVertices, s + clipOutputCount * stride);
            for (let ii = 0; ii < clipOutputLength; ii += 2, s += stride) {
              const x = clipOutputItems[ii], y = clipOutputItems[ii + 1];
              cv[s] = x;
              cv[s + 1] = y;
              cv[s + 2] = light.r;
              cv[s + 3] = light.g;
              cv[s + 4] = light.b;
              cv[s + 5] = light.a;
              const c0 = x - x3, c1 = y - y3, a = (d0 * c0 + d1 * c1) * d, b = (d4 * c0 + d2 * c1) * d, c = 1 - a - b;
              cv[s + 6] = u1 * a + u2 * b + u3 * c;
              cv[s + 7] = v1 * a + v2 * b + v3 * c;
              if (twoColor) {
                cv[s + 8] = dark.r;
                cv[s + 9] = dark.g;
                cv[s + 10] = dark.b;
                cv[s + 11] = dark.a;
              }
            }
            s = clippedTriangles.length;
            const ct = Utils.setArraySize(clippedTriangles, s + 3 * (clipOutputCount - 2));
            clipOutputCount--;
            for (let ii = 1; ii < clipOutputCount; ii++, s += 3) {
              ct[s] = index;
              ct[s + 1] = index + ii;
              ct[s + 2] = index + ii + 1;
            }
            index += clipOutputCount + 1;
          } else {
            const cv = Utils.setArraySize(clippedVertices, s + 3 * stride);
            cv[s] = x1;
            cv[s + 1] = y1;
            cv[s + 2] = light.r;
            cv[s + 3] = light.g;
            cv[s + 4] = light.b;
            cv[s + 5] = light.a;
            if (!twoColor) {
              cv[s + 6] = u1;
              cv[s + 7] = v1;
              cv[s + 8] = x2;
              cv[s + 9] = y2;
              cv[s + 10] = light.r;
              cv[s + 11] = light.g;
              cv[s + 12] = light.b;
              cv[s + 13] = light.a;
              cv[s + 14] = u2;
              cv[s + 15] = v2;
              cv[s + 16] = x3;
              cv[s + 17] = y3;
              cv[s + 18] = light.r;
              cv[s + 19] = light.g;
              cv[s + 20] = light.b;
              cv[s + 21] = light.a;
              cv[s + 22] = u3;
              cv[s + 23] = v3;
            } else {
              cv[s + 6] = u1;
              cv[s + 7] = v1;
              cv[s + 8] = dark.r;
              cv[s + 9] = dark.g;
              cv[s + 10] = dark.b;
              cv[s + 11] = dark.a;
              cv[s + 12] = x2;
              cv[s + 13] = y2;
              cv[s + 14] = light.r;
              cv[s + 15] = light.g;
              cv[s + 16] = light.b;
              cv[s + 17] = light.a;
              cv[s + 18] = u2;
              cv[s + 19] = v2;
              cv[s + 20] = dark.r;
              cv[s + 21] = dark.g;
              cv[s + 22] = dark.b;
              cv[s + 23] = dark.a;
              cv[s + 24] = x3;
              cv[s + 25] = y3;
              cv[s + 26] = light.r;
              cv[s + 27] = light.g;
              cv[s + 28] = light.b;
              cv[s + 29] = light.a;
              cv[s + 30] = u3;
              cv[s + 31] = v3;
              cv[s + 32] = dark.r;
              cv[s + 33] = dark.g;
              cv[s + 34] = dark.b;
              cv[s + 35] = dark.a;
            }
            s = clippedTriangles.length;
            const ct = Utils.setArraySize(clippedTriangles, s + 3);
            ct[s] = index;
            ct[s + 1] = index + 1;
            ct[s + 2] = index + 2;
            index += 3;
            break;
          }
        }
      }
      return clipOutputItems != null;
    }
    clipTrianglesUnpacked(vertices, vertexStart, triangles, trianglesLength, uvs, stride = 2) {
      let clippedVertices = this._clippedVerticesTyped;
      let clippedUVs = this._clippedUVsTyped;
      let clippedTriangles = this._clippedTrianglesTyped;
      let index = 0;
      this.clippedVerticesLength = 0;
      this.clippedUVsLength = 0;
      this.clippedTrianglesLength = 0;
      if (this.inverse) {
        const polygon = this.clippingPolygons[0];
        for (let i = 0; i < trianglesLength; i += 3) {
          let v = triangles[i] * stride;
          const x1 = vertices[vertexStart + v], y1 = vertices[vertexStart + v + 1];
          let uv = triangles[i] << 1;
          const u1 = uvs[uv], v1 = uvs[uv + 1];
          v = triangles[i + 1] * stride;
          const x2 = vertices[vertexStart + v], y2 = vertices[vertexStart + v + 1];
          uv = triangles[i + 1] << 1;
          const u2 = uvs[uv], v2 = uvs[uv + 1];
          v = triangles[i + 2] * stride;
          const x3 = vertices[vertexStart + v], y3 = vertices[vertexStart + v + 1];
          uv = triangles[i + 2] << 1;
          const u3 = uvs[uv], v3 = uvs[uv + 1];
          this.clipInverse(x1, y1, x2, y2, x3, y3, polygon);
          const nn = this.inverseVertices.length;
          if (nn === 0) continue;
          const d0 = y2 - y3, d1 = x3 - x2, d2 = x1 - x3, d4 = y3 - y1, d = 1 / (d0 * d2 + d1 * (y1 - y3));
          const iv = this.inverseVertices;
          for (let offset = 0; offset < nn; ) {
            const polygonSize = iv[offset++];
            const vertexCount = polygonSize >> 1;
            let s = this.clippedVerticesLength;
            const newLength = s + vertexCount * stride;
            const newUVLength = this.clippedUVsLength + vertexCount * 2;
            if (clippedVertices.length < newLength) {
              this._clippedVerticesTyped = new Float32Array(newLength * 2);
              this._clippedVerticesTyped.set(clippedVertices.subarray(0, s));
              clippedVertices = this._clippedVerticesTyped;
            }
            if (clippedUVs.length < newUVLength) {
              this._clippedUVsTyped = new Float32Array(newUVLength * 2);
              this._clippedUVsTyped.set(clippedUVs.subarray(0, this.clippedUVsLength));
              clippedUVs = this._clippedUVsTyped;
            }
            this.clippedVerticesLength = newLength;
            this.clippedUVsLength = newUVLength;
            const cv = this._clippedVerticesTyped;
            const cu = this._clippedUVsTyped;
            let uvIndex = newUVLength - vertexCount * 2;
            for (let ii = 0; ii < polygonSize; ii += 2, s += stride, uvIndex += 2) {
              const x = iv[offset + ii], y = iv[offset + ii + 1];
              cv[s] = x;
              cv[s + 1] = y;
              const c0 = x - x3, c1 = y - y3, a = (d0 * c0 + d1 * c1) * d, b = (d4 * c0 + d2 * c1) * d, c = 1 - a - b;
              cu[uvIndex] = u1 * a + u2 * b + u3 * c;
              cu[uvIndex + 1] = v1 * a + v2 * b + v3 * c;
            }
            s = this.clippedTrianglesLength;
            const newLengthTriangles = s + 3 * (vertexCount - 2);
            if (clippedTriangles.length < newLengthTriangles) {
              this._clippedTrianglesTyped = new Uint16Array(newLengthTriangles * 2);
              this._clippedTrianglesTyped.set(clippedTriangles.subarray(0, s));
              clippedTriangles = this._clippedTrianglesTyped;
            }
            this.clippedTrianglesLength = newLengthTriangles;
            const ct = clippedTriangles;
            for (let ii = 1; ii < vertexCount - 1; ii++, s += 3) {
              ct[s] = index;
              ct[s + 1] = index + ii;
              ct[s + 2] = index + ii + 1;
            }
            index += vertexCount;
            offset += polygonSize;
          }
        }
        this.clippedVerticesTyped = this._clippedVerticesTyped.subarray(0, this.clippedVerticesLength);
        this.clippedUVsTyped = this._clippedUVsTyped.subarray(0, this.clippedUVsLength);
        this.clippedTrianglesTyped = this._clippedTrianglesTyped.subarray(0, this.clippedTrianglesLength);
        return true;
      }
      const clipOutput = this.clipOutput;
      const polygons = this.clippingPolygons;
      const polygonsCount = this.clippingPolygons.length;
      let clipOutputItems = null;
      for (let i = 0; i < trianglesLength; i += 3) {
        let t = triangles[i];
        let v = t * stride;
        const x1 = vertices[vertexStart + v], y1 = vertices[vertexStart + v + 1];
        let uv = t << 1;
        const u1 = uvs[uv], v1 = uvs[uv + 1];
        t = triangles[i + 1];
        v = t * stride;
        const x2 = vertices[vertexStart + v], y2 = vertices[vertexStart + v + 1];
        uv = t << 1;
        const u2 = uvs[uv], v2 = uvs[uv + 1];
        t = triangles[i + 2];
        v = t * stride;
        const x3 = vertices[vertexStart + v], y3 = vertices[vertexStart + v + 1];
        uv = t << 1;
        const u3 = uvs[uv], v3 = uvs[uv + 1];
        let d0 = 0, d1 = 0, d2 = 0, d4 = 0, d = 0;
        for (let p = 0; p < polygonsCount; p++) {
          let s = this.clippedVerticesLength;
          if (this.clip(x1, y1, x2, y2, x3, y3, polygons[p])) {
            clipOutputItems = clipOutput;
            const clipOutputLength = clipOutput.length;
            if (clipOutputLength === 0) continue;
            let clipOutputCount = clipOutputLength >> 1;
            if (d === 0) {
              d0 = y2 - y3;
              d1 = x3 - x2;
              d2 = x1 - x3;
              d4 = y3 - y1;
              d = 1 / (d0 * d2 - d1 * d4);
            }
            const newLength = s + clipOutputCount * stride;
            if (clippedVertices.length < newLength) {
              this._clippedVerticesTyped = new Float32Array(newLength * 2);
              this._clippedVerticesTyped.set(clippedVertices.subarray(0, s));
              this._clippedUVsTyped = new Float32Array((this.clippedUVsLength + clipOutputCount * 2) * 2);
              this._clippedUVsTyped.set(clippedUVs.subarray(0, this.clippedUVsLength));
              clippedVertices = this._clippedVerticesTyped;
              clippedUVs = this._clippedUVsTyped;
            }
            const cv = clippedVertices;
            const cu = clippedUVs;
            this.clippedVerticesLength = newLength;
            let uvIndex = this.clippedUVsLength;
            this.clippedUVsLength = uvIndex + clipOutputCount * 2;
            for (let ii = 0; ii < clipOutputLength; ii += 2, s += stride, uvIndex += 2) {
              const x = clipOutputItems[ii], y = clipOutputItems[ii + 1];
              cv[s] = x;
              cv[s + 1] = y;
              const c0 = x - x3, c1 = y - y3, a = (d0 * c0 + d1 * c1) * d, b = (d4 * c0 + d2 * c1) * d, c = 1 - a - b;
              cu[uvIndex] = u1 * a + u2 * b + u3 * c;
              cu[uvIndex + 1] = v1 * a + v2 * b + v3 * c;
            }
            s = this.clippedTrianglesLength;
            const newLengthTriangles = s + 3 * (clipOutputCount - 2);
            if (clippedTriangles.length < newLengthTriangles) {
              this._clippedTrianglesTyped = new Uint16Array(newLengthTriangles * 2);
              this._clippedTrianglesTyped.set(clippedTriangles.subarray(0, s));
              clippedTriangles = this._clippedTrianglesTyped;
            }
            this.clippedTrianglesLength = newLengthTriangles;
            const ct = clippedTriangles;
            clipOutputCount--;
            for (let ii = 1; ii < clipOutputCount; ii++, s += 3) {
              ct[s] = index;
              ct[s + 1] = index + ii;
              ct[s + 2] = index + ii + 1;
            }
            index += clipOutputCount + 1;
          } else {
            let newLength = s + 3 * stride;
            if (clippedVertices.length < newLength) {
              this._clippedVerticesTyped = new Float32Array(newLength * 2);
              this._clippedVerticesTyped.set(clippedVertices.subarray(0, s));
              clippedVertices = this._clippedVerticesTyped;
            }
            clippedVertices[s] = x1;
            clippedVertices[s + 1] = y1;
            clippedVertices[s + stride] = x2;
            clippedVertices[s + stride + 1] = y2;
            clippedVertices[s + stride * 2] = x3;
            clippedVertices[s + stride * 2 + 1] = y3;
            const uvLength = this.clippedUVsLength + 3 * 2;
            if (clippedUVs.length < uvLength) {
              this._clippedUVsTyped = new Float32Array(uvLength * 2);
              this._clippedUVsTyped.set(clippedUVs.subarray(0, this.clippedUVsLength));
              clippedUVs = this._clippedUVsTyped;
            }
            const uvIndex = this.clippedUVsLength;
            clippedUVs[uvIndex] = u1;
            clippedUVs[uvIndex + 1] = v1;
            clippedUVs[uvIndex + 2] = u2;
            clippedUVs[uvIndex + 3] = v2;
            clippedUVs[uvIndex + 4] = u3;
            clippedUVs[uvIndex + 5] = v3;
            this.clippedVerticesLength = newLength;
            this.clippedUVsLength = uvLength;
            s = this.clippedTrianglesLength;
            newLength = s + 3;
            if (clippedTriangles.length < newLength) {
              this._clippedTrianglesTyped = new Uint16Array(newLength * 2);
              this._clippedTrianglesTyped.set(clippedTriangles.subarray(0, s));
              clippedTriangles = this._clippedTrianglesTyped;
            }
            const ct = clippedTriangles;
            ct[s] = index;
            ct[s + 1] = index + 1;
            ct[s + 2] = index + 2;
            index += 3;
            this.clippedTrianglesLength = newLength;
            break;
          }
        }
      }
      this.clippedVerticesTyped = this._clippedVerticesTyped.subarray(0, this.clippedVerticesLength);
      this.clippedUVsTyped = this._clippedUVsTyped.subarray(0, this.clippedUVsLength);
      this.clippedTrianglesTyped = this._clippedTrianglesTyped.subarray(0, this.clippedTrianglesLength);
      return clipOutputItems !== null;
    }
    clip(x1, y1, x2, y2, x3, y3, polygon) {
      const originalOutput = this.clipOutput;
      let clipped = false;
      let input, output;
      if (polygon.length % 4 >= 2) {
        input = this.clipOutput;
        output = this.scratch;
      } else {
        input = this.scratch;
        output = this.clipOutput;
      }
      const v = polygon;
      input.length = 8;
      const iv = input;
      iv[0] = x1;
      iv[1] = y1;
      iv[2] = x2;
      iv[3] = y2;
      iv[4] = x3;
      iv[5] = y3;
      iv[6] = x1;
      iv[7] = y1;
      output.length = 0;
      const last = polygon.length - 4;
      for (let i = 0; ; i += 2) {
        const edgeX = v[i], edgeY = v[i + 1], ex = edgeX - v[i + 2], ey = edgeY - v[i + 3];
        const outputStart = output.length;
        const iv2 = input;
        x1 = iv2[0];
        y1 = iv2[1];
        let s1 = ey * (edgeX - x1) - ex * (edgeY - y1);
        for (let ii = 2, nn = input.length - 2; ii <= nn; ii += 2) {
          x2 = iv2[ii];
          y2 = iv2[ii + 1];
          const s2 = ey * (edgeX - x2) - ex * (edgeY - y2);
          if (s1 > 0) {
            if (s2 > 0)
              output.push(x2, y2);
            else {
              const ix = x2 - x1, iy = y2 - y1, t = s1 / (ix * ey - iy * ex);
              if (t >= 0 && t <= 1) {
                output.push(x1 + ix * t, y1 + iy * t);
                clipped = true;
              } else
                output.push(x2, y2);
            }
          } else if (s2 > 0) {
            const ix = x2 - x1, iy = y2 - y1, t = s1 / (ix * ey - iy * ex);
            if (t >= 0 && t <= 1) {
              output.push(x1 + ix * t, y1 + iy * t, x2, y2);
              clipped = true;
            } else
              output.push(x2, y2);
          } else
            clipped = true;
          x1 = x2;
          y1 = y2;
          s1 = s2;
        }
        if (outputStart === output.length) {
          originalOutput.length = 0;
          return true;
        }
        output.push(output[0], output[1]);
        if (i === last) break;
        const temp = output;
        output = input;
        output.length = 0;
        input = temp;
      }
      if (originalOutput !== output) {
        originalOutput.length = 0;
        for (let i = 0, n = output.length - 2; i < n; i++)
          originalOutput[i] = output[i];
      } else
        originalOutput.length = originalOutput.length - 2;
      return clipped;
    }
    clipInverse(x1, y1, x2, y2, x3, y3, polygon) {
      this.inverseVertices.length = 0;
      const vLast = polygon.length - 4;
      let input, output;
      if (polygon.length % 4 >= 2) {
        input = this.clipOutput;
        output = this.scratch;
      } else {
        input = this.scratch;
        output = this.clipOutput;
      }
      input.length = 8;
      let v = polygon, iv = input;
      iv[0] = x1;
      iv[1] = y1;
      iv[2] = x2;
      iv[3] = y2;
      iv[4] = x3;
      iv[5] = y3;
      iv[6] = x1;
      iv[7] = y1;
      output.length = 0;
      for (let i = 0; ; i += 2) {
        const edgeX = v[i], edgeY = v[i + 1], ex = edgeX - v[i + 2], ey = edgeY - v[i + 3];
        const outputStart = output.length, fragmentStart = this.inverseVertices.length;
        this.inverseVertices.push(0);
        iv = input;
        x1 = iv[0];
        y1 = iv[1];
        let s1 = ey * (edgeX - x1) - ex * (edgeY - y1);
        for (let ii = 2, nn = input.length - 2; ii <= nn; ii += 2) {
          x2 = iv[ii];
          y2 = iv[ii + 1];
          const s2 = ey * (edgeX - x2) - ex * (edgeY - y2);
          if (s1 > 0) {
            if (s2 > 0)
              output.push(x2, y2);
            else {
              const ix = x2 - x1, iy = y2 - y1, t = s1 / (ix * ey - iy * ex);
              if (t >= 0 && t <= 1) {
                const cx = x1 + ix * t, cy = y1 + iy * t;
                output.push(cx, cy);
                this.inverseVertices.push(cx, cy, x2, y2);
              } else
                output.push(x2, y2);
            }
          } else if (s2 > 0) {
            const ix = x2 - x1, iy = y2 - y1, t = s1 / (ix * ey - iy * ex);
            if (t >= 0 && t <= 1) {
              const cx = x1 + ix * t, cy = y1 + iy * t;
              this.inverseVertices.push(cx, cy);
              output.push(cx, cy, x2, y2);
            } else
              output.push(x2, y2);
          } else
            this.inverseVertices.push(x2, y2);
          x1 = x2;
          y1 = y2;
          s1 = s2;
        }
        const fragmentSize = this.inverseVertices.length - fragmentStart - 1;
        if (fragmentSize >= 6)
          this.inverseVertices[fragmentStart] = fragmentSize;
        else
          this.inverseVertices.length = fragmentStart;
        if (outputStart === output.length) break;
        output.push(output[0], output[1]);
        if (i === vLast) break;
        const temp = output;
        output = input;
        output.length = 0;
        input = temp;
      }
    }
    makeClockwise(polygon) {
      const v = polygon;
      const n = polygon.length;
      let noCW = true, noCCW = true;
      let area = 0, prevX = v[n - 2], prevY = v[n - 1], currX = v[0], currY = v[1];
      for (let i = 2; i < n; i += 2) {
        const nextX = v[i], nextY = v[i + 1];
        area += currX * nextY - nextX * currY;
        const cross2 = (currX - prevX) * (nextY - currY) - (currY - prevY) * (nextX - currX);
        noCCW = noCCW && cross2 <= 0;
        noCW = noCW && cross2 >= 0;
        prevX = currX;
        prevY = currY;
        currX = nextX;
        currY = nextY;
      }
      area += currX * v[1] - v[0] * currY;
      const cross = (currX - prevX) * (v[1] - currY) - (currY - prevY) * (v[0] - currX);
      noCCW = noCCW && cross <= 0;
      noCW = noCW && cross >= 0;
      if (area >= 0) {
        for (let i = 0, lastX = n - 2, half = n >> 1; i < half; i += 2) {
          const x = v[i], y = v[i + 1];
          const other = lastX - i;
          v[i] = v[other];
          v[i + 1] = v[other + 1];
          v[other] = x;
          v[other + 1] = y;
        }
        return noCW;
      }
      return noCCW;
    }
    makeConvex(polygon) {
      const n = polygon.length;
      const v = polygon;
      this.clipOutput.length = n;
      const sorted = this.clipOutput;
      sorted[0] = v[0];
      sorted[1] = v[1];
      for (let i = 2; i < n; i += 2) {
        const x = v[i], y = v[i + 1];
        let p = i - 2;
        for (; p >= 0 && (sorted[p] > x || sorted[p] === x && sorted[p + 1] > y); p -= 2) {
          sorted[p + 2] = sorted[p];
          sorted[p + 3] = sorted[p + 1];
        }
        sorted[p + 2] = x;
        sorted[p + 3] = y;
      }
      v[0] = sorted[0];
      v[1] = sorted[1];
      v[2] = sorted[2];
      v[3] = sorted[3];
      let s = 4;
      for (let i = 4; i < n; i += 2, s += 2) {
        const x = sorted[i], y = sorted[i + 1];
        while ((v[s - 2] - v[s - 4]) * (y - v[s - 3]) - (v[s - 1] - v[s - 3]) * (x - v[s - 4]) >= 0) {
          s -= 2;
          if (s === 2) break;
        }
        v[s] = x;
        v[s + 1] = y;
      }
      v[s] = sorted[n - 4];
      v[s + 1] = sorted[n - 3];
      const t = s;
      s += 2;
      for (let i = n - 6; i >= 0; i -= 2, s += 2) {
        const x = sorted[i], y = sorted[i + 1];
        while ((v[s - 2] - v[s - 4]) * (y - v[s - 3]) - (v[s - 1] - v[s - 3]) * (x - v[s - 4]) >= 0) {
          s -= 2;
          if (s === t) break;
        }
        v[s] = x;
        v[s + 1] = y;
      }
      polygon.length = s - 2;
    }
  };

  // spine-core/src/SkeletonJson.ts
  var SkeletonJson = class {
    attachmentLoader;
    /** Scales bone positions, image sizes, and translations as they are loaded. This allows different size images to be used at
     * runtime than were used in Spine.
     *
     * See [Scaling](http://esotericsoftware.com/spine-loading-skeleton-data#Scaling) in the Spine Runtimes Guide. */
    scale = 1;
    linkedMeshes = [];
    constructor(attachmentLoader) {
      this.attachmentLoader = attachmentLoader;
    }
    // biome-ignore lint/suspicious/noExplicitAny: it is any until we define a schema
    readSkeletonData(json) {
      const scale = this.scale;
      const skeletonData = new SkeletonData();
      const root = typeof json === "string" ? JSON.parse(json) : json;
      const skeletonMap = root.skeleton;
      if (skeletonMap) {
        skeletonData.hash = skeletonMap.hash;
        skeletonData.version = skeletonMap.spine;
        skeletonData.x = skeletonMap.x;
        skeletonData.y = skeletonMap.y;
        skeletonData.width = skeletonMap.width;
        skeletonData.height = skeletonMap.height;
        skeletonData.referenceScale = getValue(skeletonMap, "referenceScale", 100) * scale;
        skeletonData.fps = skeletonMap.fps;
        skeletonData.imagesPath = skeletonMap.images ?? null;
        skeletonData.audioPath = skeletonMap.audio ?? null;
      }
      if (root.bones) {
        for (let i = 0; i < root.bones.length; i++) {
          const boneMap = root.bones[i];
          let parent = null;
          const parentName = getValue(boneMap, "parent", null);
          if (parentName) parent = skeletonData.findBone(parentName);
          const data = new BoneData(skeletonData.bones.length, boneMap.name, parent);
          data.length = getValue(boneMap, "length", 0) * scale;
          const setup = data.setupPose;
          setup.x = getValue(boneMap, "x", 0) * scale;
          setup.y = getValue(boneMap, "y", 0) * scale;
          setup.rotation = getValue(boneMap, "rotation", 0);
          setup.scaleX = getValue(boneMap, "scaleX", 1);
          setup.scaleY = getValue(boneMap, "scaleY", 1);
          setup.shearX = getValue(boneMap, "shearX", 0);
          setup.shearY = getValue(boneMap, "shearY", 0);
          setup.inherit = Utils.enumValue(Inherit, getValue(boneMap, "inherit", "Normal"));
          data.skinRequired = getValue(boneMap, "skin", false);
          const color = getValue(boneMap, "color", null);
          if (color) data.color.setFromString(color);
          data.icon = getValue(boneMap, "icon", void 0);
          data.iconSize = getValue(boneMap, "iconSize", 1);
          data.iconRotation = getValue(boneMap, "iconRotation", 0);
          skeletonData.bones.push(data);
        }
      }
      if (root.slots) {
        for (let i = 0; i < root.slots.length; i++) {
          const slotMap = root.slots[i];
          const slotName = slotMap.name;
          const boneData = skeletonData.findBone(slotMap.bone);
          if (!boneData) throw new Error(`Couldn't find bone ${slotMap.bone} for slot ${slotName}`);
          const data = new SlotData(skeletonData.slots.length, slotName, boneData);
          const color = getValue(slotMap, "color", null);
          if (color) data.setupPose.color.setFromString(color);
          const dark = getValue(slotMap, "dark", null);
          if (dark) data.setupPose.darkColor = Color.fromString(dark);
          data.attachmentName = getValue(slotMap, "attachment", null);
          data.blendMode = Utils.enumValue(BlendMode, getValue(slotMap, "blend", "normal"));
          data.visible = getValue(slotMap, "visible", true);
          skeletonData.slots.push(data);
        }
      }
      if (root.constraints) {
        for (const constraintMap of root.constraints) {
          const name = constraintMap.name;
          const skinRequired = getValue(constraintMap, "skin", false);
          switch (getValue(constraintMap, "type", false)) {
            case "ik": {
              const data = new IkConstraintData(name);
              data.skinRequired = skinRequired;
              for (let ii = 0; ii < constraintMap.bones.length; ii++) {
                const bone = skeletonData.findBone(constraintMap.bones[ii]);
                if (!bone) throw new Error(`Couldn't find bone ${constraintMap.bones[ii]} for IK constraint ${name}.`);
                data.bones.push(bone);
              }
              const targetName = constraintMap.target;
              const target = skeletonData.findBone(targetName);
              if (!target) throw new Error(`Couldn't find target bone ${targetName} for IK constraint ${name}.`);
              data.target = target;
              const scaleY = getValue(constraintMap, "scaleY", null);
              if (scaleY != null) data.scaleYMode = Utils.enumValue(ScaleYMode, scaleY);
              const setup = data.setupPose;
              setup.mix = getValue(constraintMap, "mix", 1);
              setup.softness = getValue(constraintMap, "softness", 0) * scale;
              setup.bendDirection = getValue(constraintMap, "bendPositive", true) ? 1 : -1;
              setup.compress = getValue(constraintMap, "compress", false);
              setup.stretch = getValue(constraintMap, "stretch", false);
              skeletonData.constraints.push(data);
              break;
            }
            case "transform": {
              const data = new TransformConstraintData(name);
              data.skinRequired = skinRequired;
              for (let ii = 0; ii < constraintMap.bones.length; ii++) {
                const boneName = constraintMap.bones[ii];
                const bone = skeletonData.findBone(boneName);
                if (!bone) throw new Error(`Couldn't find bone ${boneName} for transform constraint ${constraintMap.name}.`);
                data.bones.push(bone);
              }
              const sourceName = constraintMap.source;
              const source = skeletonData.findBone(sourceName);
              if (!source) throw new Error(`Couldn't find source bone ${sourceName} for transform constraint ${constraintMap.name}.`);
              data.source = source;
              data.localSource = getValue(constraintMap, "localSource", false);
              data.localTarget = getValue(constraintMap, "localTarget", false);
              data.additive = getValue(constraintMap, "additive", false);
              data.clamp = getValue(constraintMap, "clamp", false);
              let rotate = false, x = false, y = false, scaleX = false, scaleY = false, shearY = false;
              const fromEntries = Object.entries(getValue(constraintMap, "properties", {}));
              for (const [name2, fromEntry] of fromEntries) {
                const from = this.fromProperty(name2);
                const fromScale = this.propertyScale(name2, scale);
                from.offset = getValue(fromEntry, "offset", 0) * fromScale;
                const toEntries = Object.entries(getValue(fromEntry, "to", {}));
                for (const [name3, toEntry] of toEntries) {
                  let toScale = 1;
                  let to;
                  switch (name3) {
                    case "rotate": {
                      rotate = true;
                      to = new ToRotate();
                      break;
                    }
                    case "x": {
                      x = true;
                      to = new ToX();
                      toScale = scale;
                      break;
                    }
                    case "y": {
                      y = true;
                      to = new ToY();
                      toScale = scale;
                      break;
                    }
                    case "scaleX": {
                      scaleX = true;
                      to = new ToScaleX();
                      break;
                    }
                    case "scaleY": {
                      scaleY = true;
                      to = new ToScaleY();
                      break;
                    }
                    case "shearY": {
                      shearY = true;
                      to = new ToShearY();
                      break;
                    }
                    default:
                      throw new Error(`Invalid transform constraint to property: ${name3}`);
                  }
                  to.offset = getValue(toEntry, "offset", 0) * toScale;
                  to.max = getValue(toEntry, "max", 1) * toScale;
                  to.scale = getValue(toEntry, "scale", 1) * toScale / fromScale;
                  from.to.push(to);
                }
                if (from.to.length > 0) data.properties.push(from);
              }
              data.offsets[TransformConstraintData.ROTATION] = getValue(constraintMap, "rotation", 0);
              data.offsets[TransformConstraintData.X] = getValue(constraintMap, "x", 0) * scale;
              data.offsets[TransformConstraintData.Y] = getValue(constraintMap, "y", 0) * scale;
              data.offsets[TransformConstraintData.SCALEX] = getValue(constraintMap, "scaleX", 0);
              data.offsets[TransformConstraintData.SCALEY] = getValue(constraintMap, "scaleY", 0);
              data.offsets[TransformConstraintData.SHEARY] = getValue(constraintMap, "shearY", 0);
              const setup = data.setupPose;
              if (rotate) setup.mixRotate = getValue(constraintMap, "mixRotate", 1);
              if (x) setup.mixX = getValue(constraintMap, "mixX", 1);
              if (y) setup.mixY = getValue(constraintMap, "mixY", setup.mixX);
              if (scaleX) setup.mixScaleX = getValue(constraintMap, "mixScaleX", 1);
              if (scaleY) setup.mixScaleY = getValue(constraintMap, "mixScaleY", setup.mixScaleX);
              if (shearY) setup.mixShearY = getValue(constraintMap, "mixShearY", 1);
              skeletonData.constraints.push(data);
              break;
            }
            case "path": {
              const data = new PathConstraintData(name);
              data.skinRequired = skinRequired;
              for (let ii = 0; ii < constraintMap.bones.length; ii++) {
                const boneName = constraintMap.bones[ii];
                const bone = skeletonData.findBone(boneName);
                if (!bone) throw new Error(`Couldn't find bone ${boneName} for path constraint ${constraintMap.name}.`);
                data.bones.push(bone);
              }
              const slotName = constraintMap.slot;
              const slot = skeletonData.findSlot(slotName);
              if (!slot) throw new Error(`Couldn't find slot ${slotName} for path constraint ${constraintMap.name}.`);
              data.slot = slot;
              data.positionMode = Utils.enumValue(PositionMode, getValue(constraintMap, "positionMode", "Percent"));
              data.spacingMode = Utils.enumValue(SpacingMode, getValue(constraintMap, "spacingMode", "Length"));
              data.rotateMode = Utils.enumValue(RotateMode, getValue(constraintMap, "rotateMode", "Tangent"));
              data.offsetRotation = getValue(constraintMap, "rotation", 0);
              const setup = data.setupPose;
              setup.position = getValue(constraintMap, "position", 0);
              if (data.positionMode === 0 /* Fixed */) setup.position *= scale;
              setup.spacing = getValue(constraintMap, "spacing", 0);
              if (data.spacingMode === 0 /* Length */ || data.spacingMode === 1 /* Fixed */) setup.spacing *= scale;
              setup.mixRotate = getValue(constraintMap, "mixRotate", 1);
              setup.mixX = getValue(constraintMap, "mixX", 1);
              setup.mixY = getValue(constraintMap, "mixY", setup.mixX);
              skeletonData.constraints.push(data);
              break;
            }
            case "physics": {
              const data = new PhysicsConstraintData(name);
              data.skinRequired = skinRequired;
              const boneName = constraintMap.bone;
              const bone = skeletonData.findBone(boneName);
              if (bone == null) throw new Error(`Physics bone not found: ${boneName}`);
              data.bone = bone;
              data.x = getValue(constraintMap, "x", 0);
              data.y = getValue(constraintMap, "y", 0);
              data.rotate = getValue(constraintMap, "rotate", 0);
              data.scaleX = getValue(constraintMap, "scaleX", 0);
              const scaleY = getValue(constraintMap, "scaleY", null);
              if (scaleY != null) data.scaleYMode = Utils.enumValue(ScaleYMode, scaleY);
              data.shearX = getValue(constraintMap, "shearX", 0);
              data.limit = getValue(constraintMap, "limit", 5e3) * scale;
              data.step = 1 / getValue(constraintMap, "fps", 60);
              const setup = data.setupPose;
              setup.inertia = getValue(constraintMap, "inertia", 0.5);
              setup.strength = getValue(constraintMap, "strength", 100);
              setup.damping = getValue(constraintMap, "damping", 0.85);
              setup.massInverse = 1 / getValue(constraintMap, "mass", 1);
              setup.wind = getValue(constraintMap, "wind", 0);
              setup.gravity = getValue(constraintMap, "gravity", 0);
              setup.mix = getValue(constraintMap, "mix", 1);
              data.inertiaGlobal = getValue(constraintMap, "inertiaGlobal", false);
              data.strengthGlobal = getValue(constraintMap, "strengthGlobal", false);
              data.dampingGlobal = getValue(constraintMap, "dampingGlobal", false);
              data.massGlobal = getValue(constraintMap, "massGlobal", false);
              data.windGlobal = getValue(constraintMap, "windGlobal", false);
              data.gravityGlobal = getValue(constraintMap, "gravityGlobal", false);
              data.mixGlobal = getValue(constraintMap, "mixGlobal", false);
              skeletonData.constraints.push(data);
              break;
            }
            case "slider": {
              const data = new SliderData(name);
              data.skinRequired = skinRequired;
              data.additive = getValue(constraintMap, "additive", false);
              data.loop = getValue(constraintMap, "loop", false);
              data.setupPose.mix = getValue(constraintMap, "mix", 1);
              const boneName = constraintMap.bone;
              if (boneName) {
                data.bone = skeletonData.findBone(boneName);
                if (!data.bone) throw new Error(`Slider bone not found: ${boneName}`);
                const property = constraintMap.property;
                data.property = this.fromProperty(property);
                const propertyScale = this.propertyScale(property, scale);
                data.property.offset = getValue(constraintMap, "from", 0) * propertyScale;
                data.offset = getValue(constraintMap, "to", 0);
                data.scale = getValue(constraintMap, "scale", 1) / propertyScale;
                data.max = getValue(constraintMap, "max", 0);
                data.local = getValue(constraintMap, "local", false);
              } else
                data.setupPose.time = getValue(constraintMap, "time", 0);
              skeletonData.constraints.push(data);
              break;
            }
          }
        }
      }
      if (root.skins) {
        for (let i = 0; i < root.skins.length; i++) {
          const skinMap = root.skins[i];
          const skin = new Skin(skinMap.name);
          if (skinMap.bones) {
            for (let ii = 0; ii < skinMap.bones.length; ii++) {
              const boneName = skinMap.bones[ii];
              const bone = skeletonData.findBone(boneName);
              if (!bone) throw new Error(`Couldn't find bone ${boneName} for skin ${skinMap.name}.`);
              skin.bones.push(bone);
            }
          }
          if (skinMap.ik) {
            for (let ii = 0; ii < skinMap.ik.length; ii++) {
              const constraintName = skinMap.ik[ii];
              const constraint = skeletonData.findConstraint(constraintName, IkConstraintData);
              if (!constraint) throw new Error(`Couldn't find IK constraint ${constraintName} for skin ${skinMap.name}.`);
              skin.constraints.push(constraint);
            }
          }
          if (skinMap.transform) {
            for (let ii = 0; ii < skinMap.transform.length; ii++) {
              const constraintName = skinMap.transform[ii];
              const constraint = skeletonData.findConstraint(constraintName, TransformConstraintData);
              if (!constraint) throw new Error(`Couldn't find transform constraint ${constraintName} for skin ${skinMap.name}.`);
              skin.constraints.push(constraint);
            }
          }
          if (skinMap.path) {
            for (let ii = 0; ii < skinMap.path.length; ii++) {
              const constraintName = skinMap.path[ii];
              const constraint = skeletonData.findConstraint(constraintName, PathConstraintData);
              if (!constraint) throw new Error(`Couldn't find path constraint ${constraintName} for skin ${skinMap.name}.`);
              skin.constraints.push(constraint);
            }
          }
          if (skinMap.physics) {
            for (let ii = 0; ii < skinMap.physics.length; ii++) {
              const constraintName = skinMap.physics[ii];
              const constraint = skeletonData.findConstraint(constraintName, PhysicsConstraintData);
              if (!constraint) throw new Error(`Couldn't find physics constraint ${constraintName} for skin ${skinMap.name}.`);
              skin.constraints.push(constraint);
            }
          }
          if (skinMap.slider) {
            for (let ii = 0; ii < skinMap.slider.length; ii++) {
              const constraintName = skinMap.slider[ii];
              const constraint = skeletonData.findConstraint(constraintName, SliderData);
              if (!constraint) throw new Error(`Couldn't find slider constraint ${constraintName} for skin ${skinMap.name}.`);
              skin.constraints.push(constraint);
            }
          }
          for (const slotName in skinMap.attachments) {
            const slot = skeletonData.findSlot(slotName);
            if (!slot) throw new Error(`Couldn't find skin slot ${slotName} for skin ${skinMap.name}.`);
            const slotMap = skinMap.attachments[slotName];
            for (const entryName in slotMap) {
              const attachment = this.readAttachment(slotMap[entryName], skin, slot.index, entryName, skeletonData);
              if (attachment) skin.setAttachment(slot.index, entryName, attachment);
            }
          }
          skeletonData.skins.push(skin);
          if (skin.name === "default") skeletonData.defaultSkin = skin;
        }
      }
      for (let i = 0, n = this.linkedMeshes.length; i < n; i++) {
        const linkedMesh = this.linkedMeshes[i];
        const skin = !linkedMesh.skin ? skeletonData.defaultSkin : skeletonData.findSkin(linkedMesh.skin);
        if (!skin) throw new Error(`Skin not found: ${linkedMesh.skin}`);
        const source = skin.getAttachment(linkedMesh.sourceIndex, linkedMesh.source);
        if (!source) throw new Error(`Source mesh not found: ${linkedMesh.source}`);
        linkedMesh.mesh.timelineAttachment = linkedMesh.inheritTimelines ? source : linkedMesh.mesh;
        linkedMesh.mesh.setSourceMesh(source);
        linkedMesh.mesh.updateSequence();
        outer:
          if (linkedMesh.inheritTimelines && linkedMesh.slotIndex !== linkedMesh.sourceIndex) {
            const slots = source.timelineSlots;
            for (const existing of slots)
              if (existing === linkedMesh.slotIndex) break outer;
            const newSlots = [...slots];
            newSlots[slots.length] = linkedMesh.slotIndex;
            source.timelineSlots = newSlots;
          }
      }
      this.linkedMeshes.length = 0;
      if (root.events) {
        for (const eventName in root.events) {
          const eventMap = root.events[eventName];
          const data = new EventData(eventName);
          const setup = data.setupPose;
          setup.intValue = getValue(eventMap, "int", 0);
          setup.floatValue = getValue(eventMap, "float", 0);
          setup.stringValue = getValue(eventMap, "string", "");
          data._audioPath = getValue(eventMap, "audio", null);
          if (data.audioPath) {
            setup.volume = getValue(eventMap, "volume", setup.volume);
            setup.balance = getValue(eventMap, "balance", setup.balance);
          }
          skeletonData.events.push(data);
        }
      }
      if (root.animations) {
        for (const animationName in root.animations) {
          const animationMap = root.animations[animationName];
          this.readAnimation(animationMap, animationName, skeletonData);
        }
      }
      if (root.constraints) {
        for (const animationName in root.constraints) {
          const animationMap = root.constraints[animationName];
          if (animationMap.type === "slider") {
            const data = skeletonData.findConstraint(animationMap.name, SliderData);
            const animationName2 = animationMap.animation;
            const animation = skeletonData.findAnimation(animationName2);
            if (!animation) throw new Error(`Slider animation not found: ${animationName2}`);
            data.animation = animation;
          }
        }
      }
      return skeletonData;
    }
    fromProperty(type) {
      let from;
      switch (type) {
        case "rotate":
          from = new FromRotate();
          break;
        case "x":
          from = new FromX();
          break;
        case "y":
          from = new FromY();
          break;
        case "scaleX":
          from = new FromScaleX();
          break;
        case "scaleY":
          from = new FromScaleY();
          break;
        case "shearY":
          from = new FromShearY();
          break;
        default:
          throw new Error(`Invalid transform constraint from property: ${type}`);
      }
      return from;
    }
    propertyScale(type, scale) {
      switch (type) {
        case "x":
        case "y":
          return scale;
        default:
          return 1;
      }
    }
    // biome-ignore lint/suspicious/noExplicitAny: it is any until we define a schema
    readAttachment(map, skin, slotIndex, placeholder, skeletonData) {
      const scale = this.scale;
      const name = getValue(map, "name", placeholder);
      switch (getValue(map, "type", "region")) {
        case "region": {
          const path = getValue(map, "path", name);
          const sequence = this.readSequence(getValue(map, "sequence", null));
          const region = this.attachmentLoader.newRegionAttachment(skin, placeholder, name, path, sequence);
          if (!region) return null;
          region.path = path;
          region.x = getValue(map, "x", 0) * scale;
          region.y = getValue(map, "y", 0) * scale;
          region.scaleX = getValue(map, "scaleX", 1);
          region.scaleY = getValue(map, "scaleY", 1);
          region.rotation = getValue(map, "rotation", 0);
          region.width = map.width * scale;
          region.height = map.height * scale;
          const color = getValue(map, "color", null);
          if (color) region.color.setFromString(color);
          region.updateSequence();
          return region;
        }
        case "boundingbox": {
          const box = this.attachmentLoader.newBoundingBoxAttachment(skin, placeholder, name);
          if (!box) return null;
          this.readVertices(map, box, map.vertexCount << 1);
          const color = getValue(map, "color", null);
          if (color) box.color.setFromString(color);
          return box;
        }
        case "mesh":
        case "linkedmesh": {
          const path = getValue(map, "path", name);
          const sequence = this.readSequence(getValue(map, "sequence", null));
          const mesh = this.attachmentLoader.newMeshAttachment(skin, placeholder, name, path, sequence);
          if (!mesh) return null;
          mesh.path = path;
          const color = getValue(map, "color", null);
          if (color) mesh.color.setFromString(color);
          mesh.width = getValue(map, "width", 0) * scale;
          mesh.height = getValue(map, "height", 0) * scale;
          const source = getValue(map, "source", null);
          if (source) {
            let sourceIndex = slotIndex;
            const slot = getValue(map, "slot", null);
            if (slot) {
              const sourceSlot = skeletonData.findSlot(slot);
              if (!sourceSlot) throw new Error(`Source mesh slot not found: ${slot}`);
              sourceIndex = sourceSlot.index;
            }
            this.linkedMeshes.push(new LinkedMesh2(
              mesh,
              getValue(map, "skin", null),
              slotIndex,
              sourceIndex,
              source,
              getValue(map, "timelines", true)
            ));
            return mesh;
          }
          const uvs = map.uvs;
          this.readVertices(map, mesh, uvs.length);
          mesh.triangles = map.triangles;
          mesh.regionUVs = uvs;
          mesh.edges = getValue(map, "edges", null);
          mesh.hullLength = getValue(map, "hull", 0) * 2;
          mesh.updateSequence();
          return mesh;
        }
        case "path": {
          const path = this.attachmentLoader.newPathAttachment(skin, placeholder, name);
          if (!path) return null;
          path.closed = getValue(map, "closed", false);
          path.constantSpeed = getValue(map, "constantSpeed", true);
          const vertexCount = map.vertexCount;
          this.readVertices(map, path, vertexCount << 1);
          const lengths = Utils.newArray(vertexCount / 3, 0);
          for (let i = 0; i < map.lengths.length; i++)
            lengths[i] = map.lengths[i] * scale;
          path.lengths = lengths;
          const color = getValue(map, "color", null);
          if (color) path.color.setFromString(color);
          return path;
        }
        case "point": {
          const point = this.attachmentLoader.newPointAttachment(skin, placeholder, name);
          if (!point) return null;
          point.x = getValue(map, "x", 0) * scale;
          point.y = getValue(map, "y", 0) * scale;
          point.rotation = getValue(map, "rotation", 0);
          const color = getValue(map, "color", null);
          if (color) point.color.setFromString(color);
          return point;
        }
        case "clipping": {
          const clip = this.attachmentLoader.newClippingAttachment(skin, placeholder, name);
          if (!clip) return null;
          const end = getValue(map, "end", null);
          if (end) clip.endSlot = skeletonData.findSlot(end);
          clip.convex = getValue(map, "convex", false);
          clip.inverse = getValue(map, "inverse", false);
          const vertexCount = map.vertexCount;
          this.readVertices(map, clip, vertexCount << 1);
          const color = getValue(map, "color", null);
          if (color) clip.color.setFromString(color);
          return clip;
        }
      }
      return null;
    }
    readSequence(map) {
      if (map == null) return new Sequence(1, false);
      const sequence = new Sequence(getValue(map, "count", 0), true);
      sequence.start = getValue(map, "start", 1);
      sequence.digits = getValue(map, "digits", 0);
      sequence.setupIndex = getValue(map, "setup", 0);
      return sequence;
    }
    // biome-ignore lint/suspicious/noExplicitAny: it is any until we define a schema
    readVertices(map, attachment, verticesLength) {
      const scale = this.scale;
      attachment.worldVerticesLength = verticesLength;
      const vertices = map.vertices;
      if (verticesLength === vertices.length) {
        const scaledVertices = Utils.toFloatArray(vertices);
        if (scale !== 1) {
          for (let i = 0, n = vertices.length; i < n; i++)
            scaledVertices[i] *= scale;
        }
        attachment.vertices = scaledVertices;
        return;
      }
      const weights = [];
      const bones = [];
      for (let i = 0, n = vertices.length; i < n; ) {
        const boneCount = vertices[i++];
        bones.push(boneCount);
        for (let nn = i + boneCount * 4; i < nn; i += 4) {
          bones.push(vertices[i]);
          weights.push(vertices[i + 1] * scale);
          weights.push(vertices[i + 2] * scale);
          weights.push(vertices[i + 3]);
        }
      }
      attachment.bones = bones;
      attachment.vertices = Utils.toFloatArray(weights);
    }
    // biome-ignore lint/suspicious/noExplicitAny: it is any untile we define a schema
    readAnimation(map, name, skeletonData) {
      const scale = this.scale;
      const timelines = [];
      if (map.slots) {
        for (const slotName in map.slots) {
          const slotMap = map.slots[slotName];
          const slot = skeletonData.findSlot(slotName);
          if (!slot) throw new Error(`Slot not found: ${slotName}`);
          const slotIndex = slot.index;
          for (const timelineName in slotMap) {
            const timelineMap = slotMap[timelineName];
            if (!timelineMap) continue;
            const frames = timelineMap.length;
            switch (timelineName) {
              case "attachment": {
                const timeline = new AttachmentTimeline(frames, slotIndex);
                for (let frame = 0; frame < frames; frame++) {
                  const keyMap = timelineMap[frame];
                  timeline.setFrame(frame, getValue(keyMap, "time", 0), getValue(keyMap, "name", null));
                }
                timelines.push(timeline);
                break;
              }
              case "rgba": {
                const timeline = new RGBATimeline(frames, frames << 2, slotIndex);
                let keyMap = timelineMap[0];
                let time = getValue(keyMap, "time", 0);
                let color2 = Color.fromString(keyMap.color);
                for (let frame = 0, bezier = 0; ; frame++) {
                  timeline.setFrame(frame, time, color2.r, color2.g, color2.b, color2.a);
                  const nextMap = timelineMap[frame + 1];
                  if (!nextMap) {
                    timeline.shrink(bezier);
                    break;
                  }
                  const time2 = getValue(nextMap, "time", 0);
                  const newColor = Color.fromString(nextMap.color);
                  const curve = keyMap.curve;
                  if (curve) {
                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color2.r, newColor.r, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color2.g, newColor.g, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color2.b, newColor.b, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.a, newColor.a, 1);
                  }
                  time = time2;
                  color2 = newColor;
                  keyMap = nextMap;
                }
                timelines.push(timeline);
                break;
              }
              case "rgb": {
                const timeline = new RGBTimeline(frames, frames * 3, slotIndex);
                let keyMap = timelineMap[0];
                let time = getValue(keyMap, "time", 0);
                let color2 = Color.fromString(keyMap.color);
                for (let frame = 0, bezier = 0; ; frame++) {
                  timeline.setFrame(frame, time, color2.r, color2.g, color2.b);
                  const nextMap = timelineMap[frame + 1];
                  if (!nextMap) {
                    timeline.shrink(bezier);
                    break;
                  }
                  const time2 = getValue(nextMap, "time", 0);
                  const newColor = Color.fromString(nextMap.color);
                  const curve = keyMap.curve;
                  if (curve) {
                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color2.r, newColor.r, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color2.g, newColor.g, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color2.b, newColor.b, 1);
                  }
                  time = time2;
                  color2 = newColor;
                  keyMap = nextMap;
                }
                timelines.push(timeline);
                break;
              }
              case "alpha": {
                readTimeline12(timelines, timelineMap, new AlphaTimeline(frames, frames, slotIndex), 0, 1);
                break;
              }
              case "rgba2": {
                const timeline = new RGBA2Timeline(frames, frames * 7, slotIndex);
                let keyMap = timelineMap[0];
                let time = getValue(keyMap, "time", 0);
                let color2 = Color.fromString(keyMap.light);
                let color22 = Color.fromString(keyMap.dark);
                for (let frame = 0, bezier = 0; ; frame++) {
                  timeline.setFrame(frame, time, color2.r, color2.g, color2.b, color2.a, color22.r, color22.g, color22.b);
                  const nextMap = timelineMap[frame + 1];
                  if (!nextMap) {
                    timeline.shrink(bezier);
                    break;
                  }
                  const time2 = getValue(nextMap, "time", 0);
                  const newColor = Color.fromString(nextMap.light);
                  const newColor2 = Color.fromString(nextMap.dark);
                  const curve = keyMap.curve;
                  if (curve) {
                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color2.r, newColor.r, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color2.g, newColor.g, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color2.b, newColor.b, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color2.a, newColor.a, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color22.r, newColor2.r, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color22.g, newColor2.g, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 6, time, time2, color22.b, newColor2.b, 1);
                  }
                  time = time2;
                  color2 = newColor;
                  color22 = newColor2;
                  keyMap = nextMap;
                }
                timelines.push(timeline);
                break;
              }
              case "rgb2": {
                const timeline = new RGB2Timeline(frames, frames * 6, slotIndex);
                let keyMap = timelineMap[0];
                let time = getValue(keyMap, "time", 0);
                let color2 = Color.fromString(keyMap.light);
                let color22 = Color.fromString(keyMap.dark);
                for (let frame = 0, bezier = 0; ; frame++) {
                  timeline.setFrame(frame, time, color2.r, color2.g, color2.b, color22.r, color22.g, color22.b);
                  const nextMap = timelineMap[frame + 1];
                  if (!nextMap) {
                    timeline.shrink(bezier);
                    break;
                  }
                  const time2 = getValue(nextMap, "time", 0);
                  const newColor = Color.fromString(nextMap.light);
                  const newColor2 = Color.fromString(nextMap.dark);
                  const curve = keyMap.curve;
                  if (curve) {
                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, color2.r, newColor.r, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, color2.g, newColor.g, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, color2.b, newColor.b, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, color22.r, newColor2.r, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, color22.g, newColor2.g, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, color22.b, newColor2.b, 1);
                  }
                  time = time2;
                  color2 = newColor;
                  color22 = newColor2;
                  keyMap = nextMap;
                }
                timelines.push(timeline);
                break;
              }
              default:
                throw new Error(`Invalid timeline type for a slot: ${timelineMap.name} (${slotMap.name})`);
            }
          }
        }
      }
      if (map.bones) {
        for (const boneName in map.bones) {
          const boneMap = map.bones[boneName];
          const bone = skeletonData.findBone(boneName);
          if (!bone) throw new Error(`Bone not found: ${boneName}`);
          const boneIndex = bone.index;
          for (const timelineName in boneMap) {
            const timelineMap = boneMap[timelineName];
            const frames = timelineMap.length;
            if (frames === 0) continue;
            switch (timelineName) {
              case "rotate":
                readTimeline12(timelines, timelineMap, new RotateTimeline(frames, frames, boneIndex), 0, 1);
                break;
              case "translate":
                readTimeline22(timelines, timelineMap, new TranslateTimeline(frames, frames << 1, boneIndex), "x", "y", 0, scale);
                break;
              case "translatex":
                readTimeline12(timelines, timelineMap, new TranslateXTimeline(frames, frames, boneIndex), 0, scale);
                break;
              case "translatey":
                readTimeline12(timelines, timelineMap, new TranslateYTimeline(frames, frames, boneIndex), 0, scale);
                break;
              case "scale":
                readTimeline22(timelines, timelineMap, new ScaleTimeline(frames, frames << 1, boneIndex), "x", "y", 1, 1);
                break;
              case "scalex":
                readTimeline12(timelines, timelineMap, new ScaleXTimeline(frames, frames, boneIndex), 1, 1);
                break;
              case "scaley":
                readTimeline12(timelines, timelineMap, new ScaleYTimeline(frames, frames, boneIndex), 1, 1);
                break;
              case "shear":
                readTimeline22(timelines, timelineMap, new ShearTimeline(frames, frames << 1, boneIndex), "x", "y", 0, 1);
                break;
              case "shearx":
                readTimeline12(timelines, timelineMap, new ShearXTimeline(frames, frames, boneIndex), 0, 1);
                break;
              case "sheary":
                readTimeline12(timelines, timelineMap, new ShearYTimeline(frames, frames, boneIndex), 0, 1);
                break;
              case "inherit": {
                const timeline = new InheritTimeline(frames, bone.index);
                for (let frame = 0; frame < timelineMap.length; frame++) {
                  const aFrame = timelineMap[frame];
                  timeline.setFrame(frame, getValue(aFrame, "time", 0), Utils.enumValue(Inherit, getValue(aFrame, "inherit", "Normal")));
                }
                timelines.push(timeline);
                break;
              }
              default:
                throw new Error(`Invalid timeline type for a bone: ${timelineMap.name} (${boneMap.name})`);
            }
          }
        }
      }
      if (map.ik) {
        for (const constraintName in map.ik) {
          const constraintMap = map.ik[constraintName];
          let keyMap = constraintMap[0];
          if (!keyMap) continue;
          const constraint = skeletonData.findConstraint(constraintName, IkConstraintData);
          if (!constraint) throw new Error(`IK Constraint not found: ${constraintName}`);
          const timeline = new IkConstraintTimeline(
            constraintMap.length,
            constraintMap.length << 1,
            skeletonData.constraints.indexOf(constraint)
          );
          let time = getValue(keyMap, "time", 0);
          let mix = getValue(keyMap, "mix", 1);
          let softness = getValue(keyMap, "softness", 0) * scale;
          for (let frame = 0, bezier = 0; ; frame++) {
            timeline.setFrame(frame, time, mix, softness, getValue(keyMap, "bendPositive", true) ? 1 : -1, getValue(keyMap, "compress", false), getValue(keyMap, "stretch", false));
            const nextMap = constraintMap[frame + 1];
            if (!nextMap) {
              timeline.shrink(bezier);
              break;
            }
            const time2 = getValue(nextMap, "time", 0);
            const mix2 = getValue(nextMap, "mix", 1);
            const softness2 = getValue(nextMap, "softness", 0) * scale;
            const curve = keyMap.curve;
            if (curve) {
              bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mix, mix2, 1);
              bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, softness, softness2, scale);
            }
            time = time2;
            mix = mix2;
            softness = softness2;
            keyMap = nextMap;
          }
          timelines.push(timeline);
        }
      }
      if (map.transform) {
        for (const constraintName in map.transform) {
          const timelineMap = map.transform[constraintName];
          let keyMap = timelineMap[0];
          if (!keyMap) continue;
          const constraint = skeletonData.findConstraint(constraintName, TransformConstraintData);
          if (!constraint) throw new Error(`Transform constraint not found: ${constraintName}`);
          const timeline = new TransformConstraintTimeline(
            timelineMap.length,
            timelineMap.length * 6,
            skeletonData.constraints.indexOf(constraint)
          );
          let time = getValue(keyMap, "time", 0);
          let mixRotate = getValue(keyMap, "mixRotate", 1);
          let mixX = getValue(keyMap, "mixX", 1), mixY = getValue(keyMap, "mixY", mixX);
          let mixScaleX = getValue(keyMap, "mixScaleX", 1), mixScaleY = getValue(keyMap, "mixScaleY", 1);
          let mixShearY = getValue(keyMap, "mixShearY", 1);
          for (let frame = 0, bezier = 0; ; frame++) {
            timeline.setFrame(frame, time, mixRotate, mixX, mixY, mixScaleX, mixScaleY, mixShearY);
            const nextMap = timelineMap[frame + 1];
            if (!nextMap) {
              timeline.shrink(bezier);
              break;
            }
            const time2 = getValue(nextMap, "time", 0);
            const mixRotate2 = getValue(nextMap, "mixRotate", 1);
            const mixX2 = getValue(nextMap, "mixX", 1), mixY2 = getValue(nextMap, "mixY", mixX2);
            const mixScaleX2 = getValue(nextMap, "mixScaleX", 1), mixScaleY2 = getValue(nextMap, "mixScaleY", 1);
            const mixShearY2 = getValue(nextMap, "mixShearY", 1);
            const curve = keyMap.curve;
            if (curve) {
              bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
              bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
              bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
              bezier = readCurve(curve, timeline, bezier, frame, 3, time, time2, mixScaleX, mixScaleX2, 1);
              bezier = readCurve(curve, timeline, bezier, frame, 4, time, time2, mixScaleY, mixScaleY2, 1);
              bezier = readCurve(curve, timeline, bezier, frame, 5, time, time2, mixShearY, mixShearY2, 1);
            }
            time = time2;
            mixRotate = mixRotate2;
            mixX = mixX2;
            mixY = mixY2;
            mixScaleX = mixScaleX2;
            mixScaleY = mixScaleY2;
            mixShearY = mixShearY2;
            keyMap = nextMap;
          }
          timelines.push(timeline);
        }
      }
      if (map.path) {
        for (const constraintName in map.path) {
          const constraintMap = map.path[constraintName];
          const constraint = skeletonData.findConstraint(constraintName, PathConstraintData);
          if (!constraint) throw new Error(`Path constraint not found: ${constraintName}`);
          const index = skeletonData.constraints.indexOf(constraint);
          for (const timelineName in constraintMap) {
            const timelineMap = constraintMap[timelineName];
            let keyMap = timelineMap[0];
            if (!keyMap) continue;
            const frames = timelineMap.length;
            switch (timelineName) {
              case "position": {
                const timeline = new PathConstraintPositionTimeline(frames, frames, index);
                readTimeline12(timelines, timelineMap, timeline, 0, constraint.positionMode === 0 /* Fixed */ ? scale : 1);
                break;
              }
              case "spacing": {
                const timeline = new PathConstraintSpacingTimeline(frames, frames, index);
                readTimeline12(timelines, timelineMap, timeline, 0, constraint.spacingMode === 0 /* Length */ || constraint.spacingMode === 1 /* Fixed */ ? scale : 1);
                break;
              }
              case "mix": {
                const timeline = new PathConstraintMixTimeline(frames, frames * 3, index);
                let time = getValue(keyMap, "time", 0);
                let mixRotate = getValue(keyMap, "mixRotate", 1);
                let mixX = getValue(keyMap, "mixX", 1);
                let mixY = getValue(keyMap, "mixY", mixX);
                for (let frame = 0, bezier = 0; ; frame++) {
                  timeline.setFrame(frame, time, mixRotate, mixX, mixY);
                  const nextMap = timelineMap[frame + 1];
                  if (!nextMap) {
                    timeline.shrink(bezier);
                    break;
                  }
                  const time2 = getValue(nextMap, "time", 0);
                  const mixRotate2 = getValue(nextMap, "mixRotate", 1);
                  const mixX2 = getValue(nextMap, "mixX", 1);
                  const mixY2 = getValue(nextMap, "mixY", mixX2);
                  const curve = keyMap.curve;
                  if (curve) {
                    bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, mixRotate, mixRotate2, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, mixX, mixX2, 1);
                    bezier = readCurve(curve, timeline, bezier, frame, 2, time, time2, mixY, mixY2, 1);
                  }
                  time = time2;
                  mixRotate = mixRotate2;
                  mixX = mixX2;
                  mixY = mixY2;
                  keyMap = nextMap;
                }
                timelines.push(timeline);
                break;
              }
            }
          }
        }
      }
      if (map.physics) {
        for (const constraintName in map.physics) {
          const constraintMap = map.physics[constraintName];
          let index = -1;
          if (constraintName.length > 0) {
            const constraint = skeletonData.findConstraint(constraintName, PhysicsConstraintData);
            if (!constraint) throw new Error(`Physics constraint not found: ${constraintName}`);
            index = skeletonData.constraints.indexOf(constraint);
          }
          for (const timelineName in constraintMap) {
            const timelineMap = constraintMap[timelineName];
            let keyMap = timelineMap[0];
            if (!keyMap) continue;
            const frames = timelineMap.length;
            let timeline;
            let defaultValue = 0;
            if (timelineName === "reset") {
              const resetTimeline = new PhysicsConstraintResetTimeline(frames, index);
              for (let frame = 0; keyMap != null; keyMap = timelineMap[frame + 1], frame++)
                resetTimeline.setFrame(frame, getValue(keyMap, "time", 0));
              timelines.push(resetTimeline);
              continue;
            }
            switch (timelineName) {
              case "inertia":
                timeline = new PhysicsConstraintInertiaTimeline(frames, frames, index);
                break;
              case "strength":
                timeline = new PhysicsConstraintStrengthTimeline(frames, frames, index);
                break;
              case "damping":
                timeline = new PhysicsConstraintDampingTimeline(frames, frames, index);
                break;
              case "mass":
                timeline = new PhysicsConstraintMassTimeline(frames, frames, index);
                break;
              case "wind":
                timeline = new PhysicsConstraintWindTimeline(frames, frames, index);
                break;
              case "gravity":
                timeline = new PhysicsConstraintGravityTimeline(frames, frames, index);
                break;
              case "mix": {
                defaultValue = 1;
                timeline = new PhysicsConstraintMixTimeline(frames, frames, index);
                break;
              }
              default:
                continue;
            }
            readTimeline12(timelines, timelineMap, timeline, defaultValue, 1);
          }
        }
      }
      if (map.slider) {
        for (const constraintName in map.slider) {
          const constraintMap = map.slider[constraintName];
          const constraint = skeletonData.findConstraint(constraintName, SliderData);
          if (!constraint) throw new Error(`Slider not found: ${constraintName}`);
          const index = skeletonData.constraints.indexOf(constraint);
          for (const timelineName in constraintMap) {
            const timelineMap = constraintMap[timelineName];
            const keyMap = timelineMap[0];
            if (!keyMap) continue;
            const frames = timelineMap.length;
            switch (timelineName) {
              case "time":
                readTimeline12(timelines, timelineMap, new SliderTimeline(frames, frames, index), 1, 1);
                break;
              case "mix":
                readTimeline12(timelines, timelineMap, new SliderMixTimeline(frames, frames, index), 1, 1);
                break;
            }
          }
        }
      }
      if (map.attachments) {
        for (const attachmentsName in map.attachments) {
          const attachmentsMap = map.attachments[attachmentsName];
          const skin = skeletonData.findSkin(attachmentsName);
          if (!skin) throw new Error(`Skin not found: ${attachmentsName}`);
          for (const slotMapName in attachmentsMap) {
            const slotMap = attachmentsMap[slotMapName];
            const slot = skeletonData.findSlot(slotMapName);
            if (!slot) throw new Error(`Attachment slot not found: ${slotMapName}`);
            const slotIndex = slot.index;
            for (const attachmentMapName in slotMap) {
              const attachmentMap = slotMap[attachmentMapName];
              const attachment = skin.getAttachment(slotIndex, attachmentMapName);
              if (!attachment) throw new Error(`Timeline attachment not found: ${attachmentMapName}`);
              for (const timelineMapName in attachmentMap) {
                const timelineMap = attachmentMap[timelineMapName];
                let keyMap = timelineMap[0];
                if (!keyMap) continue;
                if (timelineMapName === "deform") {
                  const weighted = attachment.bones;
                  const vertices = attachment.vertices;
                  const deformLength = weighted ? vertices.length / 3 * 2 : vertices.length;
                  const timeline = new DeformTimeline(timelineMap.length, timelineMap.length, slotIndex, attachment);
                  let time = getValue(keyMap, "time", 0);
                  for (let frame = 0, bezier = 0; ; frame++) {
                    let deform;
                    const verticesValue = getValue(keyMap, "vertices", null);
                    if (!verticesValue)
                      deform = weighted ? Utils.newFloatArray(deformLength) : vertices;
                    else {
                      deform = Utils.newFloatArray(deformLength);
                      const start = getValue(keyMap, "offset", 0);
                      Utils.arrayCopy(verticesValue, 0, deform, start, verticesValue.length);
                      if (scale !== 1) {
                        for (let i = start, n = i + verticesValue.length; i < n; i++)
                          deform[i] *= scale;
                      }
                      if (!weighted) {
                        for (let i = 0; i < deformLength; i++)
                          deform[i] += vertices[i];
                      }
                    }
                    timeline.setFrame(frame, time, deform);
                    const nextMap = timelineMap[frame + 1];
                    if (!nextMap) {
                      timeline.shrink(bezier);
                      break;
                    }
                    const time2 = getValue(nextMap, "time", 0);
                    const curve = keyMap.curve;
                    if (curve) bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, 0, 1, 1);
                    time = time2;
                    keyMap = nextMap;
                  }
                  timelines.push(timeline);
                } else if (timelineMapName === "sequence") {
                  const timeline = new SequenceTimeline(timelineMap.length, slotIndex, attachment);
                  let lastDelay = 0;
                  for (let frame = 0; frame < timelineMap.length; frame++) {
                    const delay = getValue(keyMap, "delay", lastDelay);
                    const time = getValue(keyMap, "time", 0);
                    const mode = SequenceMode[getValue(keyMap, "mode", "hold")];
                    const index = getValue(keyMap, "index", 0);
                    timeline.setFrame(frame, time, mode, index, delay);
                    lastDelay = delay;
                    keyMap = timelineMap[frame + 1];
                  }
                  timelines.push(timeline);
                }
              }
            }
          }
        }
      }
      if (map.drawOrder) {
        const timeline = new DrawOrderTimeline(map.drawOrder.length);
        const slotCount = skeletonData.slots.length;
        let frame = 0;
        for (const drawOrderMap of map.drawOrder) {
          timeline.setFrame(frame++, getValue(drawOrderMap, "time", 0), readDrawOrder2(skeletonData, drawOrderMap, slotCount, null));
        }
        timelines.push(timeline);
      }
      if (map.drawOrderFolder) {
        for (const timelineMap of map.drawOrderFolder) {
          const slotEntries = getValue(timelineMap, "slots", []);
          const folderSlots = new Array(slotEntries.length);
          let ii = 0;
          for (const slotEntry of slotEntries) {
            const slot = skeletonData.findSlot(slotEntry);
            if (!slot) throw new Error(`Draw order folder slot not found: ${slotEntry}`);
            folderSlots[ii++] = slot.index;
          }
          const drawOrderFolderEntries = getValue(timelineMap, "keys", []);
          const timeline = new DrawOrderFolderTimeline(drawOrderFolderEntries.length, folderSlots, skeletonData.slots.length);
          let frame = 0;
          for (const drawOrderFolderMap of drawOrderFolderEntries) {
            timeline.setFrame(frame++, getValue(drawOrderFolderMap, "time", 0), readDrawOrder2(skeletonData, drawOrderFolderMap, folderSlots.length, folderSlots));
          }
          timelines.push(timeline);
        }
      }
      if (map.events) {
        const timeline = new EventTimeline(map.events.length);
        let frame = 0;
        for (let i = 0; i < map.events.length; i++, frame++) {
          const eventMap = map.events[i];
          const data = skeletonData.findEvent(eventMap.name);
          if (!data) throw new Error(`Event not found: ${eventMap.name}`);
          const setup = data.setupPose;
          const event = new Event(Utils.toSinglePrecision(getValue(eventMap, "time", 0)), data);
          event.intValue = getValue(eventMap, "int", setup.intValue);
          event.floatValue = getValue(eventMap, "float", setup.floatValue);
          event.stringValue = getValue(eventMap, "string", setup.stringValue);
          if (event.data.audioPath) {
            event.volume = getValue(eventMap, "volume", setup.volume);
            event.balance = getValue(eventMap, "balance", setup.volume);
          }
          timeline.setFrame(frame, event);
        }
        timelines.push(timeline);
      }
      let duration = 0;
      for (let i = 0, n = timelines.length; i < n; i++)
        duration = Math.max(duration, timelines[i].getDuration());
      const animation = new Animation(name, timelines, duration);
      const color = getValue(map, "color", null);
      if (color !== null) animation.color.setFromString(color);
      skeletonData.animations.push(animation);
    }
  };
  var LinkedMesh2 = class {
    source;
    skin;
    slotIndex;
    sourceIndex;
    mesh;
    inheritTimelines;
    constructor(mesh, skin, slotIndex, sourceIndex, source, inheritTimelines) {
      this.mesh = mesh;
      this.skin = skin;
      this.slotIndex = slotIndex;
      this.sourceIndex = sourceIndex;
      this.source = source;
      this.inheritTimelines = inheritTimelines;
    }
  };
  function readTimeline12(timelines, keys, timeline, defaultValue, scale) {
    let keyMap = keys[0];
    let time = keyMap.time ?? 0;
    let value = (keyMap.value ?? defaultValue) * scale;
    let bezier = 0;
    for (let frame = 0; ; frame++) {
      timeline.setFrame(frame, time, value);
      const nextMap = keys[frame + 1];
      if (!nextMap) {
        timeline.shrink(bezier);
        timelines.push(timeline);
        return;
      }
      const time2 = nextMap.time ?? 0;
      const value2 = (nextMap.value ?? defaultValue) * scale;
      if (keyMap.curve) bezier = readCurve(keyMap.curve, timeline, bezier, frame, 0, time, time2, value, value2, scale);
      time = time2;
      value = value2;
      keyMap = nextMap;
    }
  }
  function readTimeline22(timelines, keys, timeline, name1, name2, defaultValue, scale) {
    let keyMap = keys[0];
    let time = keyMap.time ?? 0;
    let value1 = (keyMap[name1] ?? defaultValue) * scale;
    let value2 = (keyMap[name2] ?? defaultValue) * scale;
    let bezier = 0;
    for (let frame = 0; ; frame++) {
      timeline.setFrame(frame, time, value1, value2);
      const nextMap = keys[frame + 1];
      if (!nextMap) {
        timeline.shrink(bezier);
        timelines.push(timeline);
        return;
      }
      const time2 = nextMap.time ?? 0;
      const nvalue1 = (nextMap[name1] ?? defaultValue) * scale;
      const nvalue2 = (nextMap[name2] ?? defaultValue) * scale;
      const curve = keyMap.curve;
      if (curve) {
        bezier = readCurve(curve, timeline, bezier, frame, 0, time, time2, value1, nvalue1, scale);
        bezier = readCurve(curve, timeline, bezier, frame, 1, time, time2, value2, nvalue2, scale);
      }
      time = time2;
      value1 = nvalue1;
      value2 = nvalue2;
      keyMap = nextMap;
    }
  }
  function readDrawOrder2(skeletonData, keys, slotCount, folderSlots) {
    const changes = keys.offsets;
    if (!changes) return null;
    const drawOrder = new Array(slotCount).fill(-1);
    const unchanged = new Array(slotCount - changes.length);
    let originalIndex = 0, unchangedIndex = 0;
    for (const offsetMap of changes) {
      const slot = skeletonData.findSlot(offsetMap.slot);
      if (slot == null) throw new Error(`Draw order slot not found: ${offsetMap.slot}`);
      let index = 0;
      if (!folderSlots)
        index = slot.index;
      else {
        index = -1;
        for (let i = 0; i < slotCount; i++) {
          if (folderSlots[i] === slot.index) {
            index = i;
            break;
          }
        }
        if (index === -1) throw new Error(`Slot not in folder: ${offsetMap.slot}`);
      }
      while (originalIndex !== index)
        unchanged[unchangedIndex++] = originalIndex++;
      drawOrder[originalIndex + offsetMap.offset] = originalIndex++;
    }
    while (originalIndex < slotCount)
      unchanged[unchangedIndex++] = originalIndex++;
    for (let i = slotCount - 1; i >= 0; i--)
      if (drawOrder[i] === -1) drawOrder[i] = unchanged[--unchangedIndex];
    return drawOrder;
  }
  function readCurve(curve, timeline, bezier, frame, value, time1, time2, value1, value2, scale) {
    if (curve === "stepped") {
      timeline.setStepped(frame);
      return bezier;
    }
    const i = value << 2;
    const cx1 = curve[i];
    const cy1 = curve[i + 1] * scale;
    const cx2 = curve[i + 2];
    const cy2 = curve[i + 3] * scale;
    timeline.setBezier(bezier, frame, value, time1, value1, cx1, cy1, cx2, cy2, time2, value2);
    return bezier + 1;
  }
  function getValue(map, property, defaultValue) {
    return map[property] !== void 0 ? map[property] : defaultValue;
  }

  // spine-core/src/SkeletonPhysicsMovement.ts
  var SkeletonPhysicsMovement = class {
    /**
     * Creates a movement tracker for a skeleton displayed by a host runtime object.
     * @param skeleton The skeleton whose physics constraints receive inherited movement.
     * @param adapter Runtime-specific hooks used to read and convert the host object's transform.
     * @param options Initial movement inheritance values.
     */
    constructor(skeleton, adapter, options = {}) {
      this.skeleton = skeleton;
      this.adapter = adapter;
      this.positionInheritanceFactorX = options.positionInheritanceX ?? 0;
      this.positionInheritanceFactorY = options.positionInheritanceY ?? 0;
      this.rotationInheritanceFactor = options.rotationInheritance ?? 0;
    }
    positionInheritanceFactorX = 0;
    positionInheritanceFactorY = 0;
    rotationInheritanceFactor = 0;
    hasLastTransform = false;
    lastX = 0;
    lastY = 0;
    lastZ = 0;
    lastRotation = 0;
    currentTransform = { x: 0, y: 0, z: 0, rotation: 0 };
    currentPosition = { x: 0, y: 0, z: 0 };
    lastPosition = { x: 0, y: 0, z: 0 };
    /** Horizontal position inheritance factor. `0` disables horizontal position inheritance. */
    get positionInheritanceX() {
      return this.positionInheritanceFactorX;
    }
    /** Vertical position inheritance factor. `0` disables vertical position inheritance. */
    get positionInheritanceY() {
      return this.positionInheritanceFactorY;
    }
    /**
     * Sets how much host object translation is inherited by skeleton physics constraints.
     * Use `(1, 1)` for normal inheritance, or `(0, 0)` to disable position inheritance.
     * @param x The horizontal position inheritance factor.
     * @param y The vertical position inheritance factor.
     */
    setPositionInheritance(x, y) {
      const wasDisabled = this.positionInheritanceFactorX === 0 && this.positionInheritanceFactorY === 0;
      const isEnabled = x !== 0 || y !== 0;
      this.positionInheritanceFactorX = x;
      this.positionInheritanceFactorY = y;
      if (wasDisabled && isEnabled) this.resetPosition();
    }
    /** Rotation inheritance factor. `0` disables rotation inheritance. */
    get rotationInheritance() {
      return this.rotationInheritanceFactor;
    }
    /**
     * Sets how much host object rotation is inherited by skeleton physics constraints.
     * @param value The rotation inheritance factor.
     */
    set rotationInheritance(value) {
      const wasDisabled = this.rotationInheritanceFactor === 0;
      this.rotationInheritanceFactor = value;
      if (wasDisabled && value !== 0) this.resetRotation();
    }
    /** Resets the previous position used to calculate inherited translation. */
    resetPosition() {
      const transform = this.currentTransform;
      const readRotation = !this.hasLastTransform && this.rotationInheritanceFactor !== 0;
      this.adapter.readTransform(transform, readRotation);
      this.lastX = transform.x;
      this.lastY = transform.y;
      this.lastZ = transform.z;
      if (readRotation) this.lastRotation = transform.rotation;
      this.hasLastTransform = true;
    }
    /** Resets the previous rotation used to calculate inherited rotation. */
    resetRotation() {
      const transform = this.currentTransform;
      this.adapter.readTransform(transform, true);
      this.lastRotation = transform.rotation;
      if (!this.hasLastTransform) {
        this.lastX = transform.x;
        this.lastY = transform.y;
        this.lastZ = transform.z;
      }
      this.hasLastTransform = true;
    }
    /** Resets both previous position and previous rotation. */
    resetTransform() {
      const transform = this.currentTransform;
      this.adapter.readTransform(transform, true);
      this.setLastTransform(transform.x, transform.y, transform.z, transform.rotation);
    }
    /**
     * Applies host object transform movement since the previous call to the skeleton's physics constraints.
     *
     * The first call records the current transform as the baseline and does not apply movement.
     */
    applyTransformMovement() {
      const inheritPosition = this.positionInheritanceFactorX !== 0 || this.positionInheritanceFactorY !== 0;
      const inheritRotation = this.rotationInheritanceFactor !== 0;
      if (!inheritPosition && !inheritRotation) return;
      const transform = this.currentTransform;
      this.adapter.readTransform(transform, inheritRotation);
      const { x, y, z } = transform;
      const currentRotation = inheritRotation ? transform.rotation : this.lastRotation;
      const positionChanged = x !== this.lastX || y !== this.lastY || z !== this.lastZ;
      if (this.hasLastTransform) {
        if (!positionChanged && currentRotation === this.lastRotation) return;
        if (inheritPosition && positionChanged) this.applyPositionMovement(x, y, z);
        if (inheritRotation && currentRotation !== this.lastRotation) this.applyRotationMovement(currentRotation);
      }
      this.setLastTransform(x, y, z, currentRotation);
    }
    applyPositionMovement(currentX, currentY, currentZ) {
      const currentPosition = this.currentPosition;
      currentPosition.x = currentX;
      currentPosition.y = currentY;
      currentPosition.z = currentZ;
      this.adapter.worldToSkeleton(currentPosition);
      const lastPosition = this.lastPosition;
      lastPosition.x = this.lastX;
      lastPosition.y = this.lastY;
      lastPosition.z = this.lastZ;
      this.adapter.worldToSkeleton(lastPosition);
      this.skeleton.physicsTranslate(
        (currentPosition.x - lastPosition.x) * this.positionInheritanceFactorX,
        (currentPosition.y - lastPosition.y) * this.positionInheritanceFactorY
      );
    }
    applyRotationMovement(currentRotation) {
      const rotationFactor = this.rotationInheritanceFactor;
      if (rotationFactor === 0) return;
      this.skeleton.physicsRotate(0, 0, this.getRotationDelta(currentRotation, this.lastRotation) * rotationFactor);
    }
    setLastTransform(x, y, z, rotation) {
      this.lastX = x;
      this.lastY = y;
      this.lastZ = z;
      this.lastRotation = rotation;
      this.hasLastTransform = true;
    }
    getRotationDelta(current, previous) {
      let delta = current - previous;
      delta = (delta + 180) % 360 - 180;
      return delta < -180 ? delta + 360 : delta;
    }
  };

  // spine-core/src/SkeletonRendererCore.ts
  var SkeletonRendererCore = class {
    commandPool = new CommandPool();
    worldVertices = new Float32Array(12 * 1024);
    quadIndices = new Uint16Array([0, 1, 2, 2, 3, 0]);
    clipping = new SkeletonClipping();
    renderCommands = [];
    render(skeleton, pma = false, inColor, stride = 2, slotZOffset = 0) {
      this.commandPool.reset();
      this.renderCommands.length = 0;
      const clipper = this.clipping;
      let z = 0;
      const drawOrder = skeleton.drawOrder.appliedPose;
      for (let i = 0, n = drawOrder.length; i < n; i++) {
        const slot = drawOrder[i];
        if (!slot.bone.active) {
          clipper.clipEnd(slot);
          continue;
        }
        const pose = slot.appliedPose;
        const attachment = pose.attachment;
        if (!attachment) {
          clipper.clipEnd(slot);
          continue;
        }
        const slotColor = pose.color;
        const alpha = slotColor.a;
        if (alpha === 0 && !(attachment instanceof ClippingAttachment)) {
          clipper.clipEnd(slot);
          continue;
        }
        let vertices;
        let verticesCount;
        let uvs;
        let indices;
        let indicesCount;
        let attachmentColor;
        let texture;
        if (attachment instanceof RegionAttachment) {
          attachmentColor = attachment.color;
          if (attachmentColor.a === 0) {
            clipper.clipEnd(slot);
            continue;
          }
          const sequence = attachment.sequence;
          const sequenceIndex = sequence.resolveIndex(pose);
          attachment.computeWorldVertices(slot, attachment.getOffsets(pose), this.worldVertices, 0, stride);
          vertices = this.worldVertices;
          verticesCount = 4;
          uvs = sequence.getUVs(sequenceIndex);
          indices = this.quadIndices;
          indicesCount = 6;
          texture = sequence.regions[sequenceIndex]?.texture;
        } else if (attachment instanceof MeshAttachment) {
          attachmentColor = attachment.color;
          if (attachmentColor.a === 0) {
            clipper.clipEnd(slot);
            continue;
          }
          if (this.worldVertices.length < attachment.worldVerticesLength)
            this.worldVertices = new Float32Array(attachment.worldVerticesLength);
          attachment.computeWorldVertices(skeleton, slot, 0, attachment.worldVerticesLength, this.worldVertices, 0, stride);
          vertices = this.worldVertices;
          verticesCount = attachment.worldVerticesLength >> 1;
          const sequence = attachment.sequence;
          const sequenceIndex = sequence.resolveIndex(pose);
          uvs = sequence.getUVs(sequenceIndex);
          indices = attachment.triangles;
          indicesCount = indices.length;
          texture = sequence.regions[sequenceIndex]?.texture;
        } else if (attachment instanceof ClippingAttachment) {
          clipper.clipEnd(slot);
          clipper.clipStart(skeleton, slot, attachment);
          continue;
        } else {
          clipper.clipEnd(slot);
          continue;
        }
        if (!texture) {
          clipper.clipEnd(slot);
          continue;
        }
        const skelColor = skeleton.color;
        let color, darkColor;
        if (pma) {
          let a;
          if (inColor) {
            a = Math.floor(inColor[3] * skelColor.a * slotColor.a * attachmentColor.a * 255);
            const r = Math.floor(a * inColor[0] * skelColor.r * slotColor.r * attachmentColor.r);
            const g = Math.floor(a * inColor[1] * skelColor.g * slotColor.g * attachmentColor.g);
            const b = Math.floor(a * inColor[2] * skelColor.b * slotColor.b * attachmentColor.b);
            color = a << 24 | r << 16 | g << 8 | b;
          } else {
            a = Math.floor(skelColor.a * slotColor.a * attachmentColor.a * 255);
            const r = Math.floor(a * skelColor.r * slotColor.r * attachmentColor.r);
            const g = Math.floor(a * skelColor.g * slotColor.g * attachmentColor.g);
            const b = Math.floor(a * skelColor.b * slotColor.b * attachmentColor.b);
            color = a << 24 | r << 16 | g << 8 | b;
          }
          darkColor = 4278190080;
          if (pose.darkColor) {
            const { r, g, b } = pose.darkColor;
            darkColor = 4278190080 | Math.floor(r * a) << 16 | Math.floor(g * a) << 8 | Math.floor(b * a);
          }
        } else {
          if (inColor) {
            const a = Math.floor(inColor[3] * skelColor.a * slotColor.a * attachmentColor.a * 255);
            const r = Math.floor(inColor[0] * skelColor.r * slotColor.r * attachmentColor.r * 255);
            const g = Math.floor(inColor[1] * skelColor.g * slotColor.g * attachmentColor.g * 255);
            const b = Math.floor(inColor[2] * skelColor.b * slotColor.b * attachmentColor.b * 255);
            color = a << 24 | r << 16 | g << 8 | b;
          } else {
            const a = Math.floor(skelColor.a * slotColor.a * attachmentColor.a * 255);
            const r = Math.floor(skelColor.r * slotColor.r * attachmentColor.r * 255);
            const g = Math.floor(skelColor.g * slotColor.g * attachmentColor.g * 255);
            const b = Math.floor(skelColor.b * slotColor.b * attachmentColor.b * 255);
            color = a << 24 | r << 16 | g << 8 | b;
          }
          darkColor = 0;
          if (pose.darkColor) {
            const { r, g, b } = pose.darkColor;
            darkColor = Math.floor(r * 255) << 16 | Math.floor(g * 255) << 8 | Math.floor(b * 255);
          }
        }
        if (clipper.isClipping()) {
          clipper.clipTrianglesUnpacked(vertices, 0, indices, indicesCount, uvs, stride);
          vertices = clipper.clippedVerticesTyped;
          verticesCount = clipper.clippedVerticesLength / stride;
          uvs = clipper.clippedUVsTyped;
          indices = clipper.clippedTrianglesTyped;
          indicesCount = clipper.clippedTrianglesLength;
        }
        const cmd = this.commandPool.getCommand(verticesCount, indicesCount, stride);
        cmd.blendMode = slot.data.blendMode;
        cmd.texture = texture;
        cmd.positions.set(vertices.subarray(0, verticesCount * stride));
        if (stride >= 3) {
          for (let j = 2, n2 = verticesCount * stride; j < n2; j += stride)
            cmd.positions[j] = z;
        }
        cmd.uvs.set(uvs.subarray(0, verticesCount << 1));
        for (let j = 0; j < verticesCount; j++) {
          cmd.colors[j] = color;
          cmd.darkColors[j] = darkColor;
        }
        if (indices instanceof Uint16Array) {
          cmd.indices.set(indices.subarray(0, indicesCount));
        } else {
          cmd.indices.set(indices.slice(0, indicesCount));
        }
        this.renderCommands.push(cmd);
        z += slotZOffset;
        clipper.clipEnd(slot);
      }
      clipper.clipEnd();
      return this.batchCommands(stride);
    }
    batchSubCommands(commands, first, last, numVertices, numIndices, stride) {
      const firstCmd = commands[first];
      const batched = this.commandPool.getCommand(numVertices, numIndices, stride);
      batched.blendMode = firstCmd.blendMode;
      batched.texture = firstCmd.texture;
      let positionsOffset = 0;
      let uvsOffset = 0;
      let colorsOffset = 0;
      let indicesOffset = 0;
      let vertexOffset = 0;
      for (let i = first; i <= last; i++) {
        const cmd = commands[i];
        batched.positions.set(cmd.positions, positionsOffset);
        positionsOffset += cmd.numVertices * stride;
        batched.uvs.set(cmd.uvs, uvsOffset);
        uvsOffset += cmd.numVertices << 1;
        batched.colors.set(cmd.colors, colorsOffset);
        batched.darkColors.set(cmd.darkColors, colorsOffset);
        colorsOffset += cmd.numVertices;
        for (let j = 0; j < cmd.numIndices; j++)
          batched.indices[indicesOffset + j] = cmd.indices[j] + vertexOffset;
        indicesOffset += cmd.numIndices;
        vertexOffset += cmd.numVertices;
      }
      return batched;
    }
    batchCommands(stride) {
      if (this.renderCommands.length === 0) return void 0;
      let root;
      let last;
      let first = this.renderCommands[0];
      let startIndex = 0;
      let i = 1;
      let numVertices = first.numVertices;
      let numIndices = first.numIndices;
      while (i <= this.renderCommands.length) {
        const cmd = i < this.renderCommands.length ? this.renderCommands[i] : null;
        if (cmd && cmd.numVertices === 0 && cmd.numIndices === 0) {
          i++;
          continue;
        }
        const canBatch = cmd !== null && cmd.texture === first.texture && cmd.blendMode === first.blendMode && cmd.colors[0] === first.colors[0] && cmd.darkColors[0] === first.darkColors[0] && numIndices + cmd.numIndices < 65535;
        if (canBatch) {
          numVertices += cmd.numVertices;
          numIndices += cmd.numIndices;
        } else {
          const batched = this.batchSubCommands(
            this.renderCommands,
            startIndex,
            i - 1,
            numVertices,
            numIndices,
            stride
          );
          if (!last) {
            root = last = batched;
          } else {
            last.next = batched;
            last = batched;
          }
          if (i === this.renderCommands.length) break;
          first = this.renderCommands[i];
          startIndex = i;
          numVertices = first.numVertices;
          numIndices = first.numIndices;
        }
        i++;
      }
      return root;
    }
  };
  var CommandPool = class {
    pool = [];
    inUse = [];
    getCommand(numVertices, numIndices, stride) {
      let cmd;
      for (const c of this.pool) {
        if (c._positions.length >= numVertices * stride && c._indices.length >= numIndices) {
          cmd = c;
          break;
        }
      }
      if (!cmd) {
        const _positions = new Float32Array(numVertices * stride);
        const _uvs = new Float32Array(numVertices << 1);
        const _colors = new Uint32Array(numVertices);
        const _darkColors = new Uint32Array(numVertices);
        const _indices = new Uint16Array(numIndices);
        cmd = {
          positions: _positions,
          uvs: _uvs,
          colors: _colors,
          darkColors: _darkColors,
          indices: _indices,
          _positions,
          _uvs,
          _colors,
          _darkColors,
          _indices,
          numVertices,
          numIndices,
          blendMode: 0 /* Normal */,
          texture: null
        };
      } else {
        this.pool.splice(this.pool.indexOf(cmd), 1);
        cmd.next = void 0;
        cmd.numVertices = numVertices;
        cmd.numIndices = numIndices;
        cmd.positions = cmd._positions.subarray(0, numVertices * stride);
        cmd.uvs = cmd._uvs.subarray(0, numVertices << 1);
        cmd.colors = cmd._colors.subarray(0, numVertices);
        cmd.darkColors = cmd._darkColors.subarray(0, numVertices);
        cmd.indices = cmd._indices.subarray(0, numIndices);
      }
      this.inUse.push(cmd);
      return cmd;
    }
    reset() {
      this.pool.push(...this.inUse);
      this.inUse.length = 0;
    }
  };

  // spine-webgl/src/WebGL.ts
  var ManagedWebGLRenderingContext = class {
    canvas;
    gl;
    restorables = [];
    constructor(canvasOrContext, contextConfig = { alpha: true }) {
      if (!(canvasOrContext instanceof WebGLRenderingContext || typeof WebGL2RenderingContext !== "undefined" && canvasOrContext instanceof WebGL2RenderingContext)) {
        const canvas = canvasOrContext;
        this.gl = canvas.getContext("webgl2", contextConfig) || canvas.getContext("webgl", contextConfig);
        this.canvas = canvas;
        canvas.addEventListener("webglcontextlost", this.contextLostHandler);
        canvas.addEventListener("webglcontextrestored", this.contextRestoredHandler);
      } else {
        this.gl = canvasOrContext;
        this.canvas = this.gl.canvas;
      }
    }
    contextLostHandler = (e) => {
      if (e) e.preventDefault();
    };
    contextRestoredHandler = () => {
      this.restore();
    };
    restore() {
      for (let i = 0, n = this.restorables.length; i < n; i++)
        this.restorables[i].restore();
    }
    dispose() {
      this.canvas.removeEventListener("webglcontextlost", this.contextLostHandler);
      this.canvas.removeEventListener("webglcontextrestored", this.contextRestoredHandler);
    }
    addRestorable(restorable) {
      this.restorables.push(restorable);
    }
    removeRestorable(restorable) {
      const index = this.restorables.indexOf(restorable);
      if (index > -1) this.restorables.splice(index, 1);
    }
  };

  // spine-webgl/src/GLTexture.ts
  var GLTexture = class _GLTexture extends Texture {
    context;
    texture = null;
    boundUnit = 0;
    pma;
    useMipMaps;
    constructor(context, image, pma, useMipMaps = false) {
      super(image);
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
      this.pma = pma;
      this.useMipMaps = useMipMaps;
      this.restore();
      this.context.addRestorable(this);
    }
    setFilters(minFilter, magFilter) {
      const gl = this.context.gl;
      this.bind();
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _GLTexture.validateMagFilter(magFilter));
      this.useMipMaps = _GLTexture.usesMipMaps(minFilter);
      if (this.useMipMaps) gl.generateMipmap(gl.TEXTURE_2D);
    }
    static validateMagFilter(magFilter) {
      switch (magFilter) {
        case 9987 /* MipMapLinearLinear */:
        case 9985 /* MipMapLinearNearest */:
        case 9986 /* MipMapNearestLinear */:
        case 9984 /* MipMapNearestNearest */:
          return 9729 /* Linear */;
        default:
          return magFilter;
      }
    }
    static usesMipMaps(filter) {
      switch (filter) {
        case 9987 /* MipMapLinearLinear */:
        case 9985 /* MipMapLinearNearest */:
        case 9986 /* MipMapNearestLinear */:
        case 9984 /* MipMapNearestNearest */:
          return true;
        default:
          return false;
      }
    }
    setWraps(uWrap, vWrap) {
      const gl = this.context.gl;
      this.bind();
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, uWrap);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, vWrap);
    }
    update(useMipMaps) {
      const gl = this.context.gl;
      if (!this.texture) this.texture = this.context.gl.createTexture();
      this.bind();
      const previousUnpackPmaValue = gl.getParameter(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !this.pma);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, useMipMaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (useMipMaps) gl.generateMipmap(gl.TEXTURE_2D);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, previousUnpackPmaValue);
    }
    restore() {
      this.texture = null;
      this.update(this.useMipMaps);
    }
    bind(unit = 0) {
      const gl = this.context.gl;
      this.boundUnit = unit;
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
    }
    unbind() {
      const gl = this.context.gl;
      gl.activeTexture(gl.TEXTURE0 + this.boundUnit);
      gl.bindTexture(gl.TEXTURE_2D, null);
    }
    dispose() {
      this.context.removeRestorable(this);
      const gl = this.context.gl;
      gl.deleteTexture(this.texture);
    }
  };

  // spine-webgl/src/AssetManager.ts
  var AssetManager = class extends AssetManagerBase {
    constructor(context, pathPrefix = "", downloader = new Downloader()) {
      super(
        (image, pma = false) => new GLTexture(context, image, pma),
        pathPrefix,
        downloader
      );
    }
  };

  // spine-webgl/src/Vector3.ts
  var Vector3 = class {
    x = 0;
    y = 0;
    z = 0;
    constructor(x = 0, y = 0, z = 0) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
    setFrom(v) {
      this.x = v.x;
      this.y = v.y;
      this.z = v.z;
      return this;
    }
    set(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    }
    add(v) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
      return this;
    }
    sub(v) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
      return this;
    }
    scale(s) {
      this.x *= s;
      this.y *= s;
      this.z *= s;
      return this;
    }
    normalize() {
      let len = this.length();
      if (len === 0) return this;
      len = 1 / len;
      this.x *= len;
      this.y *= len;
      this.z *= len;
      return this;
    }
    cross(v) {
      return this.set(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
    }
    multiply(matrix) {
      const l_mat = matrix.values;
      return this.set(
        this.x * l_mat[M00] + this.y * l_mat[M01] + this.z * l_mat[M02] + l_mat[M03],
        this.x * l_mat[M10] + this.y * l_mat[M11] + this.z * l_mat[M12] + l_mat[M13],
        this.x * l_mat[M20] + this.y * l_mat[M21] + this.z * l_mat[M22] + l_mat[M23]
      );
    }
    project(matrix) {
      const l_mat = matrix.values;
      const l_w = 1 / (this.x * l_mat[M30] + this.y * l_mat[M31] + this.z * l_mat[M32] + l_mat[M33]);
      return this.set(
        (this.x * l_mat[M00] + this.y * l_mat[M01] + this.z * l_mat[M02] + l_mat[M03]) * l_w,
        (this.x * l_mat[M10] + this.y * l_mat[M11] + this.z * l_mat[M12] + l_mat[M13]) * l_w,
        (this.x * l_mat[M20] + this.y * l_mat[M21] + this.z * l_mat[M22] + l_mat[M23]) * l_w
      );
    }
    dot(v) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    distance(v) {
      const a = v.x - this.x;
      const b = v.y - this.y;
      const c = v.z - this.z;
      return Math.sqrt(a * a + b * b + c * c);
    }
  };

  // spine-webgl/src/Matrix4.ts
  var M00 = 0;
  var M01 = 4;
  var M02 = 8;
  var M03 = 12;
  var M10 = 1;
  var M11 = 5;
  var M12 = 9;
  var M13 = 13;
  var M20 = 2;
  var M21 = 6;
  var M22 = 10;
  var M23 = 14;
  var M30 = 3;
  var M31 = 7;
  var M32 = 11;
  var M33 = 15;
  var Matrix4 = class _Matrix4 {
    temp = new Float32Array(16);
    values = new Float32Array(16);
    static xAxis = new Vector3();
    static yAxis = new Vector3();
    static zAxis = new Vector3();
    static tmpMatrix = new _Matrix4();
    constructor() {
      const v = this.values;
      v[M00] = 1;
      v[M11] = 1;
      v[M22] = 1;
      v[M33] = 1;
    }
    set(values) {
      this.values.set(values);
      return this;
    }
    transpose() {
      const t = this.temp;
      const v = this.values;
      t[M00] = v[M00];
      t[M01] = v[M10];
      t[M02] = v[M20];
      t[M03] = v[M30];
      t[M10] = v[M01];
      t[M11] = v[M11];
      t[M12] = v[M21];
      t[M13] = v[M31];
      t[M20] = v[M02];
      t[M21] = v[M12];
      t[M22] = v[M22];
      t[M23] = v[M32];
      t[M30] = v[M03];
      t[M31] = v[M13];
      t[M32] = v[M23];
      t[M33] = v[M33];
      return this.set(t);
    }
    identity() {
      const v = this.values;
      v[M00] = 1;
      v[M01] = 0;
      v[M02] = 0;
      v[M03] = 0;
      v[M10] = 0;
      v[M11] = 1;
      v[M12] = 0;
      v[M13] = 0;
      v[M20] = 0;
      v[M21] = 0;
      v[M22] = 1;
      v[M23] = 0;
      v[M30] = 0;
      v[M31] = 0;
      v[M32] = 0;
      v[M33] = 1;
      return this;
    }
    invert() {
      const v = this.values;
      const t = this.temp;
      const l_det = v[M30] * v[M21] * v[M12] * v[M03] - v[M20] * v[M31] * v[M12] * v[M03] - v[M30] * v[M11] * v[M22] * v[M03] + v[M10] * v[M31] * v[M22] * v[M03] + v[M20] * v[M11] * v[M32] * v[M03] - v[M10] * v[M21] * v[M32] * v[M03] - v[M30] * v[M21] * v[M02] * v[M13] + v[M20] * v[M31] * v[M02] * v[M13] + v[M30] * v[M01] * v[M22] * v[M13] - v[M00] * v[M31] * v[M22] * v[M13] - v[M20] * v[M01] * v[M32] * v[M13] + v[M00] * v[M21] * v[M32] * v[M13] + v[M30] * v[M11] * v[M02] * v[M23] - v[M10] * v[M31] * v[M02] * v[M23] - v[M30] * v[M01] * v[M12] * v[M23] + v[M00] * v[M31] * v[M12] * v[M23] + v[M10] * v[M01] * v[M32] * v[M23] - v[M00] * v[M11] * v[M32] * v[M23] - v[M20] * v[M11] * v[M02] * v[M33] + v[M10] * v[M21] * v[M02] * v[M33] + v[M20] * v[M01] * v[M12] * v[M33] - v[M00] * v[M21] * v[M12] * v[M33] - v[M10] * v[M01] * v[M22] * v[M33] + v[M00] * v[M11] * v[M22] * v[M33];
      if (l_det === 0) throw new Error("non-invertible matrix");
      const inv_det = 1 / l_det;
      t[M00] = v[M12] * v[M23] * v[M31] - v[M13] * v[M22] * v[M31] + v[M13] * v[M21] * v[M32] - v[M11] * v[M23] * v[M32] - v[M12] * v[M21] * v[M33] + v[M11] * v[M22] * v[M33];
      t[M01] = v[M03] * v[M22] * v[M31] - v[M02] * v[M23] * v[M31] - v[M03] * v[M21] * v[M32] + v[M01] * v[M23] * v[M32] + v[M02] * v[M21] * v[M33] - v[M01] * v[M22] * v[M33];
      t[M02] = v[M02] * v[M13] * v[M31] - v[M03] * v[M12] * v[M31] + v[M03] * v[M11] * v[M32] - v[M01] * v[M13] * v[M32] - v[M02] * v[M11] * v[M33] + v[M01] * v[M12] * v[M33];
      t[M03] = v[M03] * v[M12] * v[M21] - v[M02] * v[M13] * v[M21] - v[M03] * v[M11] * v[M22] + v[M01] * v[M13] * v[M22] + v[M02] * v[M11] * v[M23] - v[M01] * v[M12] * v[M23];
      t[M10] = v[M13] * v[M22] * v[M30] - v[M12] * v[M23] * v[M30] - v[M13] * v[M20] * v[M32] + v[M10] * v[M23] * v[M32] + v[M12] * v[M20] * v[M33] - v[M10] * v[M22] * v[M33];
      t[M11] = v[M02] * v[M23] * v[M30] - v[M03] * v[M22] * v[M30] + v[M03] * v[M20] * v[M32] - v[M00] * v[M23] * v[M32] - v[M02] * v[M20] * v[M33] + v[M00] * v[M22] * v[M33];
      t[M12] = v[M03] * v[M12] * v[M30] - v[M02] * v[M13] * v[M30] - v[M03] * v[M10] * v[M32] + v[M00] * v[M13] * v[M32] + v[M02] * v[M10] * v[M33] - v[M00] * v[M12] * v[M33];
      t[M13] = v[M02] * v[M13] * v[M20] - v[M03] * v[M12] * v[M20] + v[M03] * v[M10] * v[M22] - v[M00] * v[M13] * v[M22] - v[M02] * v[M10] * v[M23] + v[M00] * v[M12] * v[M23];
      t[M20] = v[M11] * v[M23] * v[M30] - v[M13] * v[M21] * v[M30] + v[M13] * v[M20] * v[M31] - v[M10] * v[M23] * v[M31] - v[M11] * v[M20] * v[M33] + v[M10] * v[M21] * v[M33];
      t[M21] = v[M03] * v[M21] * v[M30] - v[M01] * v[M23] * v[M30] - v[M03] * v[M20] * v[M31] + v[M00] * v[M23] * v[M31] + v[M01] * v[M20] * v[M33] - v[M00] * v[M21] * v[M33];
      t[M22] = v[M01] * v[M13] * v[M30] - v[M03] * v[M11] * v[M30] + v[M03] * v[M10] * v[M31] - v[M00] * v[M13] * v[M31] - v[M01] * v[M10] * v[M33] + v[M00] * v[M11] * v[M33];
      t[M23] = v[M03] * v[M11] * v[M20] - v[M01] * v[M13] * v[M20] - v[M03] * v[M10] * v[M21] + v[M00] * v[M13] * v[M21] + v[M01] * v[M10] * v[M23] - v[M00] * v[M11] * v[M23];
      t[M30] = v[M12] * v[M21] * v[M30] - v[M11] * v[M22] * v[M30] - v[M12] * v[M20] * v[M31] + v[M10] * v[M22] * v[M31] + v[M11] * v[M20] * v[M32] - v[M10] * v[M21] * v[M32];
      t[M31] = v[M01] * v[M22] * v[M30] - v[M02] * v[M21] * v[M30] + v[M02] * v[M20] * v[M31] - v[M00] * v[M22] * v[M31] - v[M01] * v[M20] * v[M32] + v[M00] * v[M21] * v[M32];
      t[M32] = v[M02] * v[M11] * v[M30] - v[M01] * v[M12] * v[M30] - v[M02] * v[M10] * v[M31] + v[M00] * v[M12] * v[M31] + v[M01] * v[M10] * v[M32] - v[M00] * v[M11] * v[M32];
      t[M33] = v[M01] * v[M12] * v[M20] - v[M02] * v[M11] * v[M20] + v[M02] * v[M10] * v[M21] - v[M00] * v[M12] * v[M21] - v[M01] * v[M10] * v[M22] + v[M00] * v[M11] * v[M22];
      v[M00] = t[M00] * inv_det;
      v[M01] = t[M01] * inv_det;
      v[M02] = t[M02] * inv_det;
      v[M03] = t[M03] * inv_det;
      v[M10] = t[M10] * inv_det;
      v[M11] = t[M11] * inv_det;
      v[M12] = t[M12] * inv_det;
      v[M13] = t[M13] * inv_det;
      v[M20] = t[M20] * inv_det;
      v[M21] = t[M21] * inv_det;
      v[M22] = t[M22] * inv_det;
      v[M23] = t[M23] * inv_det;
      v[M30] = t[M30] * inv_det;
      v[M31] = t[M31] * inv_det;
      v[M32] = t[M32] * inv_det;
      v[M33] = t[M33] * inv_det;
      return this;
    }
    determinant() {
      const v = this.values;
      return v[M30] * v[M21] * v[M12] * v[M03] - v[M20] * v[M31] * v[M12] * v[M03] - v[M30] * v[M11] * v[M22] * v[M03] + v[M10] * v[M31] * v[M22] * v[M03] + v[M20] * v[M11] * v[M32] * v[M03] - v[M10] * v[M21] * v[M32] * v[M03] - v[M30] * v[M21] * v[M02] * v[M13] + v[M20] * v[M31] * v[M02] * v[M13] + v[M30] * v[M01] * v[M22] * v[M13] - v[M00] * v[M31] * v[M22] * v[M13] - v[M20] * v[M01] * v[M32] * v[M13] + v[M00] * v[M21] * v[M32] * v[M13] + v[M30] * v[M11] * v[M02] * v[M23] - v[M10] * v[M31] * v[M02] * v[M23] - v[M30] * v[M01] * v[M12] * v[M23] + v[M00] * v[M31] * v[M12] * v[M23] + v[M10] * v[M01] * v[M32] * v[M23] - v[M00] * v[M11] * v[M32] * v[M23] - v[M20] * v[M11] * v[M02] * v[M33] + v[M10] * v[M21] * v[M02] * v[M33] + v[M20] * v[M01] * v[M12] * v[M33] - v[M00] * v[M21] * v[M12] * v[M33] - v[M10] * v[M01] * v[M22] * v[M33] + v[M00] * v[M11] * v[M22] * v[M33];
    }
    translate(x, y, z) {
      const v = this.values;
      v[M03] += x;
      v[M13] += y;
      v[M23] += z;
      return this;
    }
    copy() {
      return new _Matrix4().set(this.values);
    }
    projection(near, far, fovy, aspectRatio) {
      this.identity();
      const l_fd = 1 / Math.tan(fovy * (Math.PI / 180) / 2);
      const l_a1 = (far + near) / (near - far);
      const l_a2 = 2 * far * near / (near - far);
      const v = this.values;
      v[M00] = l_fd / aspectRatio;
      v[M10] = 0;
      v[M20] = 0;
      v[M30] = 0;
      v[M01] = 0;
      v[M11] = l_fd;
      v[M21] = 0;
      v[M31] = 0;
      v[M02] = 0;
      v[M12] = 0;
      v[M22] = l_a1;
      v[M32] = -1;
      v[M03] = 0;
      v[M13] = 0;
      v[M23] = l_a2;
      v[M33] = 0;
      return this;
    }
    ortho2d(x, y, width, height) {
      return this.ortho(x, x + width, y, y + height, 0, 1);
    }
    ortho(left, right, bottom, top, near, far) {
      this.identity();
      const x_orth = 2 / (right - left);
      const y_orth = 2 / (top - bottom);
      const z_orth = -2 / (far - near);
      const tx = -(right + left) / (right - left);
      const ty = -(top + bottom) / (top - bottom);
      const tz = -(far + near) / (far - near);
      const v = this.values;
      v[M00] = x_orth;
      v[M10] = 0;
      v[M20] = 0;
      v[M30] = 0;
      v[M01] = 0;
      v[M11] = y_orth;
      v[M21] = 0;
      v[M31] = 0;
      v[M02] = 0;
      v[M12] = 0;
      v[M22] = z_orth;
      v[M32] = 0;
      v[M03] = tx;
      v[M13] = ty;
      v[M23] = tz;
      v[M33] = 1;
      return this;
    }
    multiply(matrix) {
      const t = this.temp;
      const v = this.values;
      const m = matrix.values;
      t[M00] = v[M00] * m[M00] + v[M01] * m[M10] + v[M02] * m[M20] + v[M03] * m[M30];
      t[M01] = v[M00] * m[M01] + v[M01] * m[M11] + v[M02] * m[M21] + v[M03] * m[M31];
      t[M02] = v[M00] * m[M02] + v[M01] * m[M12] + v[M02] * m[M22] + v[M03] * m[M32];
      t[M03] = v[M00] * m[M03] + v[M01] * m[M13] + v[M02] * m[M23] + v[M03] * m[M33];
      t[M10] = v[M10] * m[M00] + v[M11] * m[M10] + v[M12] * m[M20] + v[M13] * m[M30];
      t[M11] = v[M10] * m[M01] + v[M11] * m[M11] + v[M12] * m[M21] + v[M13] * m[M31];
      t[M12] = v[M10] * m[M02] + v[M11] * m[M12] + v[M12] * m[M22] + v[M13] * m[M32];
      t[M13] = v[M10] * m[M03] + v[M11] * m[M13] + v[M12] * m[M23] + v[M13] * m[M33];
      t[M20] = v[M20] * m[M00] + v[M21] * m[M10] + v[M22] * m[M20] + v[M23] * m[M30];
      t[M21] = v[M20] * m[M01] + v[M21] * m[M11] + v[M22] * m[M21] + v[M23] * m[M31];
      t[M22] = v[M20] * m[M02] + v[M21] * m[M12] + v[M22] * m[M22] + v[M23] * m[M32];
      t[M23] = v[M20] * m[M03] + v[M21] * m[M13] + v[M22] * m[M23] + v[M23] * m[M33];
      t[M30] = v[M30] * m[M00] + v[M31] * m[M10] + v[M32] * m[M20] + v[M33] * m[M30];
      t[M31] = v[M30] * m[M01] + v[M31] * m[M11] + v[M32] * m[M21] + v[M33] * m[M31];
      t[M32] = v[M30] * m[M02] + v[M31] * m[M12] + v[M32] * m[M22] + v[M33] * m[M32];
      t[M33] = v[M30] * m[M03] + v[M31] * m[M13] + v[M32] * m[M23] + v[M33] * m[M33];
      return this.set(this.temp);
    }
    multiplyLeft(matrix) {
      const t = this.temp;
      const v = this.values;
      const m = matrix.values;
      t[M00] = m[M00] * v[M00] + m[M01] * v[M10] + m[M02] * v[M20] + m[M03] * v[M30];
      t[M01] = m[M00] * v[M01] + m[M01] * v[M11] + m[M02] * v[M21] + m[M03] * v[M31];
      t[M02] = m[M00] * v[M02] + m[M01] * v[M12] + m[M02] * v[M22] + m[M03] * v[M32];
      t[M03] = m[M00] * v[M03] + m[M01] * v[M13] + m[M02] * v[M23] + m[M03] * v[M33];
      t[M10] = m[M10] * v[M00] + m[M11] * v[M10] + m[M12] * v[M20] + m[M13] * v[M30];
      t[M11] = m[M10] * v[M01] + m[M11] * v[M11] + m[M12] * v[M21] + m[M13] * v[M31];
      t[M12] = m[M10] * v[M02] + m[M11] * v[M12] + m[M12] * v[M22] + m[M13] * v[M32];
      t[M13] = m[M10] * v[M03] + m[M11] * v[M13] + m[M12] * v[M23] + m[M13] * v[M33];
      t[M20] = m[M20] * v[M00] + m[M21] * v[M10] + m[M22] * v[M20] + m[M23] * v[M30];
      t[M21] = m[M20] * v[M01] + m[M21] * v[M11] + m[M22] * v[M21] + m[M23] * v[M31];
      t[M22] = m[M20] * v[M02] + m[M21] * v[M12] + m[M22] * v[M22] + m[M23] * v[M32];
      t[M23] = m[M20] * v[M03] + m[M21] * v[M13] + m[M22] * v[M23] + m[M23] * v[M33];
      t[M30] = m[M30] * v[M00] + m[M31] * v[M10] + m[M32] * v[M20] + m[M33] * v[M30];
      t[M31] = m[M30] * v[M01] + m[M31] * v[M11] + m[M32] * v[M21] + m[M33] * v[M31];
      t[M32] = m[M30] * v[M02] + m[M31] * v[M12] + m[M32] * v[M22] + m[M33] * v[M32];
      t[M33] = m[M30] * v[M03] + m[M31] * v[M13] + m[M32] * v[M23] + m[M33] * v[M33];
      return this.set(this.temp);
    }
    lookAt(position, direction, up) {
      const xAxis = _Matrix4.xAxis, yAxis = _Matrix4.yAxis, zAxis = _Matrix4.zAxis;
      zAxis.setFrom(direction).normalize();
      xAxis.setFrom(direction).normalize();
      xAxis.cross(up).normalize();
      yAxis.setFrom(xAxis).cross(zAxis).normalize();
      this.identity();
      const val = this.values;
      val[M00] = xAxis.x;
      val[M01] = xAxis.y;
      val[M02] = xAxis.z;
      val[M10] = yAxis.x;
      val[M11] = yAxis.y;
      val[M12] = yAxis.z;
      val[M20] = -zAxis.x;
      val[M21] = -zAxis.y;
      val[M22] = -zAxis.z;
      _Matrix4.tmpMatrix.identity();
      _Matrix4.tmpMatrix.values[M03] = -position.x;
      _Matrix4.tmpMatrix.values[M13] = -position.y;
      _Matrix4.tmpMatrix.values[M23] = -position.z;
      this.multiply(_Matrix4.tmpMatrix);
      return this;
    }
  };

  // spine-webgl/src/Camera.ts
  var OrthoCamera = class {
    position = new Vector3(0, 0, 0);
    direction = new Vector3(0, 0, -1);
    up = new Vector3(0, 1, 0);
    near = 0;
    far = 100;
    zoom = 1;
    viewportWidth = 0;
    viewportHeight = 0;
    projectionView = new Matrix4();
    inverseProjectionView = new Matrix4();
    projection = new Matrix4();
    view = new Matrix4();
    constructor(viewportWidth, viewportHeight) {
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
      this.update();
    }
    update() {
      const projection = this.projection;
      const view = this.view;
      const projectionView = this.projectionView;
      const inverseProjectionView = this.inverseProjectionView;
      const zoom = this.zoom, viewportWidth = this.viewportWidth, viewportHeight = this.viewportHeight;
      projection.ortho(
        zoom * (-viewportWidth / 2),
        zoom * (viewportWidth / 2),
        zoom * (-viewportHeight / 2),
        zoom * (viewportHeight / 2),
        this.near,
        this.far
      );
      view.lookAt(this.position, this.direction, this.up);
      projectionView.set(projection.values);
      projectionView.multiply(view);
      inverseProjectionView.set(projectionView.values).invert();
    }
    screenToWorld(screenCoords, screenWidth, screenHeight) {
      const x = screenCoords.x, y = screenHeight - screenCoords.y - 1;
      screenCoords.x = 2 * x / screenWidth - 1;
      screenCoords.y = 2 * y / screenHeight - 1;
      screenCoords.z = 2 * screenCoords.z - 1;
      screenCoords.project(this.inverseProjectionView);
      return screenCoords;
    }
    worldToScreen(worldCoords, screenWidth, screenHeight) {
      worldCoords.project(this.projectionView);
      worldCoords.x = screenWidth * (worldCoords.x + 1) / 2;
      worldCoords.y = screenHeight * (worldCoords.y + 1) / 2;
      worldCoords.z = (worldCoords.z + 1) / 2;
      return worldCoords;
    }
    setViewport(viewportWidth, viewportHeight) {
      this.viewportWidth = viewportWidth;
      this.viewportHeight = viewportHeight;
    }
  };

  // spine-webgl/src/Input.ts
  var Input = class {
    element;
    mouseX = 0;
    mouseY = 0;
    buttonDown = false;
    touch0 = null;
    touch1 = null;
    initialPinchDistance = 0;
    listeners = [];
    autoPreventDefault;
    // this is needed because browsers sends mousedown-mousemove-mousesup after a touch sequence, unless touch end preventDefault
    // but preventing default will result in preventing interaction with the page.
    isTouch = false;
    callbacks;
    constructor(element, autoPreventDefault = true) {
      this.element = element;
      this.autoPreventDefault = autoPreventDefault;
      this.callbacks = this.setupCallbacks(element);
    }
    setupCallbacks(element) {
      const mouseDown = (ev) => {
        if (ev instanceof MouseEvent && !this.isTouch) {
          const rect = element.getBoundingClientRect();
          this.mouseX = ev.clientX - rect.left;
          this.mouseY = ev.clientY - rect.top;
          this.buttonDown = true;
          this.listeners.map((listener) => {
            if (listener.down) listener.down(this.mouseX, this.mouseY, ev);
          });
        }
      };
      const mouseMove = (ev) => {
        if (ev instanceof MouseEvent && !this.isTouch) {
          const rect = element.getBoundingClientRect();
          this.mouseX = ev.clientX - rect.left;
          this.mouseY = ev.clientY - rect.top;
          this.listeners.map((listener) => {
            if (this.buttonDown) {
              if (listener.dragged) listener.dragged(this.mouseX, this.mouseY, ev);
            } else {
              if (listener.moved) listener.moved(this.mouseX, this.mouseY, ev);
            }
          });
        }
      };
      const mouseUp = (ev) => {
        if (ev instanceof MouseEvent && !this.isTouch) {
          const rect = element.getBoundingClientRect();
          this.mouseX = ev.clientX - rect.left;
          ;
          this.mouseY = ev.clientY - rect.top;
          this.buttonDown = false;
          this.listeners.map((listener) => {
            if (listener.up) listener.up(this.mouseX, this.mouseY, ev);
          });
        }
      };
      const mouseWheel = (ev) => {
        if (this.autoPreventDefault) ev.preventDefault();
        let deltaY = ev.deltaY;
        if (ev.deltaMode === WheelEvent.DOM_DELTA_LINE) deltaY *= 8;
        if (ev.deltaMode === WheelEvent.DOM_DELTA_PAGE) deltaY *= 24;
        this.listeners.map((listener) => {
          if (listener.wheel) listener.wheel(deltaY, ev);
        });
      };
      const touchStart = (ev) => {
        this.isTouch = true;
        if (!this.touch0 || !this.touch1) {
          const touches = ev.changedTouches;
          const nativeTouch = touches.item(0);
          if (!nativeTouch) return;
          const rect = element.getBoundingClientRect();
          const x = nativeTouch.clientX - rect.left;
          const y = nativeTouch.clientY - rect.top;
          const touch = new Touch(nativeTouch.identifier, x, y);
          this.mouseX = x;
          this.mouseY = y;
          this.buttonDown = true;
          if (!this.touch0) {
            this.touch0 = touch;
            this.listeners.map((listener) => {
              if (listener.down) listener.down(touch.x, touch.y, ev);
            });
          } else if (!this.touch1) {
            this.touch1 = touch;
            const dx = this.touch1.x - this.touch0.x;
            const dy = this.touch1.x - this.touch0.x;
            this.initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
            this.listeners.map((listener) => {
              if (listener.zoom) listener.zoom(this.initialPinchDistance, this.initialPinchDistance, ev);
            });
          }
        }
        if (this.autoPreventDefault) ev.preventDefault();
      };
      const touchMove = (ev) => {
        this.isTouch = true;
        if (this.touch0) {
          const touches = ev.changedTouches;
          const rect = element.getBoundingClientRect();
          for (let i = 0; i < touches.length; i++) {
            const nativeTouch = touches[i];
            const x = nativeTouch.clientX - rect.left;
            const y = nativeTouch.clientY - rect.top;
            if (this.touch0.identifier === nativeTouch.identifier) {
              this.touch0.x = this.mouseX = x;
              this.touch0.y = this.mouseY = y;
              this.listeners.map((listener) => {
                if (listener.dragged) listener.dragged(x, y, ev);
              });
            }
            if (this.touch1 && this.touch1.identifier === nativeTouch.identifier) {
              this.touch1.x = this.mouseX = x;
              this.touch1.y = this.mouseY = y;
            }
          }
          if (this.touch0 && this.touch1) {
            const dx = this.touch1.x - this.touch0.x;
            const dy = this.touch1.x - this.touch0.x;
            const distance = Math.sqrt(dx * dx + dy * dy);
            this.listeners.map((listener) => {
              if (listener.zoom) listener.zoom(this.initialPinchDistance, distance, ev);
            });
          }
        }
        if (this.autoPreventDefault) ev.preventDefault();
      };
      const touchEnd = (ev) => {
        this.isTouch = true;
        const touch0 = this.touch0;
        if (touch0) {
          const touches = ev.changedTouches;
          const rect = element.getBoundingClientRect();
          for (let i = 0; i < touches.length; i++) {
            const nativeTouch = touches[i];
            const x = nativeTouch.clientX - rect.left;
            const y = nativeTouch.clientY - rect.top;
            if (touch0.identifier === nativeTouch.identifier) {
              this.touch0 = null;
              this.mouseX = x;
              this.mouseY = y;
              this.listeners.map((listener) => {
                if (listener.up) listener.up(x, y, ev);
              });
              if (!this.touch1) {
                this.buttonDown = false;
                break;
              } else {
                const touch02 = this.touch0 = this.touch1;
                this.touch1 = null;
                this.mouseX = touch02.x;
                this.mouseY = touch02.y;
                this.buttonDown = true;
                this.listeners.map((listener) => {
                  if (listener.down) listener.down(touch02.x, touch02.y, ev);
                });
              }
            }
            if (this.touch1?.identifier) {
              this.touch1 = null;
            }
          }
        }
        if (this.autoPreventDefault) ev.preventDefault();
      };
      element.addEventListener("mousedown", mouseDown, true);
      element.addEventListener("mousemove", mouseMove, true);
      element.addEventListener("mouseup", mouseUp, true);
      element.addEventListener("wheel", mouseWheel, true);
      element.addEventListener("touchstart", touchStart, { passive: false, capture: false });
      element.addEventListener("touchmove", touchMove, { passive: false, capture: false });
      element.addEventListener("touchend", touchEnd, { passive: false, capture: false });
      element.addEventListener("touchcancel", touchEnd);
      return {
        mouseDown,
        mouseMove,
        mouseUp,
        mouseWheel,
        touchStart,
        touchMove,
        touchEnd
      };
    }
    dispose() {
      const element = this.element;
      element.removeEventListener("mousedown", this.callbacks.mouseDown, true);
      element.removeEventListener("mousemove", this.callbacks.mouseMove, true);
      element.removeEventListener("mouseup", this.callbacks.mouseUp, true);
      element.removeEventListener("wheel", this.callbacks.mouseWheel, true);
      element.removeEventListener("touchstart", this.callbacks.touchStart, { capture: false });
      element.removeEventListener("touchmove", this.callbacks.touchMove, { capture: false });
      element.removeEventListener("touchend", this.callbacks.touchEnd, { capture: false });
      element.removeEventListener("touchcancel", this.callbacks.touchEnd);
      this.listeners.length = 0;
    }
    addListener(listener) {
      this.listeners.push(listener);
    }
    removeListener(listener) {
      const idx = this.listeners.indexOf(listener);
      if (idx > -1) {
        this.listeners.splice(idx, 1);
      }
    }
  };
  var Touch = class {
    constructor(identifier, x, y) {
      this.identifier = identifier;
      this.x = x;
      this.y = y;
    }
  };

  // spine-webgl/src/CameraController.ts
  var CameraController = class {
    constructor(canvas, camera) {
      this.canvas = canvas;
      this.camera = camera;
      let cameraX = 0, cameraY = 0;
      let mouseX = 0, mouseY = 0;
      let lastX = 0, lastY = 0;
      let initialZoom = 0;
      new Input(canvas).addListener({
        down: (x, y) => {
          cameraX = camera.position.x;
          cameraY = camera.position.y;
          mouseX = lastX = x;
          mouseY = lastY = y;
          initialZoom = camera.zoom;
        },
        dragged: (x, y) => {
          const deltaX = x - mouseX;
          const deltaY = y - mouseY;
          const originWorld = camera.screenToWorld(new Vector3(0, 0), canvas.clientWidth, canvas.clientHeight);
          const deltaWorld = camera.screenToWorld(new Vector3(deltaX, deltaY), canvas.clientWidth, canvas.clientHeight).sub(originWorld);
          camera.position.set(cameraX - deltaWorld.x, cameraY - deltaWorld.y, 0);
          camera.update();
          lastX = x;
          lastY = y;
        },
        wheel: (delta) => {
          const zoomAmount = delta / 200 * camera.zoom;
          const newZoom = camera.zoom + zoomAmount;
          if (newZoom > 0) {
            let x = 0, y = 0;
            if (delta < 0) {
              x = lastX;
              y = lastY;
            } else {
              const viewCenter = new Vector3(canvas.clientWidth / 2 + 15, canvas.clientHeight / 2);
              const mouseToCenterX = lastX - viewCenter.x;
              const mouseToCenterY = canvas.clientHeight - 1 - lastY - viewCenter.y;
              x = viewCenter.x - mouseToCenterX;
              y = canvas.clientHeight - 1 - viewCenter.y + mouseToCenterY;
            }
            const oldDistance = camera.screenToWorld(new Vector3(x, y), canvas.clientWidth, canvas.clientHeight);
            camera.zoom = newZoom;
            camera.update();
            const newDistance = camera.screenToWorld(new Vector3(x, y), canvas.clientWidth, canvas.clientHeight);
            camera.position.add(oldDistance.sub(newDistance));
            camera.update();
          }
        },
        zoom: (initialDistance, distance) => {
          const newZoom = initialDistance / distance;
          camera.zoom = initialZoom * newZoom;
        },
        up: (x, y) => {
          lastX = x;
          lastY = y;
        },
        moved: (x, y) => {
          lastX = x;
          lastY = y;
        }
      });
    }
  };

  // spine-webgl/src/Shader.ts
  var Shader = class _Shader {
    constructor(context, vertexShader, fragmentShader) {
      this.vertexShader = vertexShader;
      this.fragmentShader = fragmentShader;
      this.vsSource = vertexShader;
      this.fsSource = fragmentShader;
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
      this.context.addRestorable(this);
      this.compile();
    }
    static MVP_MATRIX = "u_projTrans";
    static POSITION = "a_position";
    static COLOR = "a_color";
    static COLOR2 = "a_color2";
    static TEXCOORDS = "a_texCoords";
    static SAMPLER = "u_texture";
    context;
    vs = null;
    vsSource;
    fs = null;
    fsSource;
    program = null;
    tmp2x2 = new Float32Array(2 * 2);
    tmp3x3 = new Float32Array(3 * 3);
    tmp4x4 = new Float32Array(4 * 4);
    getProgram() {
      return this.program;
    }
    getVertexShader() {
      return this.vertexShader;
    }
    getFragmentShader() {
      return this.fragmentShader;
    }
    getVertexShaderSource() {
      return this.vsSource;
    }
    getFragmentSource() {
      return this.fsSource;
    }
    compile() {
      const gl = this.context.gl;
      try {
        this.vs = this.compileShader(gl.VERTEX_SHADER, this.vertexShader);
        if (!this.vs) throw new Error("Couldn't compile vertex shader.");
        this.fs = this.compileShader(gl.FRAGMENT_SHADER, this.fragmentShader);
        if (!this.fs) throw new Error("Couldn#t compile fragment shader.");
        this.program = this.compileProgram(this.vs, this.fs);
      } catch (e) {
        this.dispose();
        throw e;
      }
    }
    compileShader(type, source) {
      const gl = this.context.gl;
      const shader = gl.createShader(type);
      if (!shader) throw new Error("Couldn't create shader.");
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        const error = `Couldn't compile shader: ${gl.getShaderInfoLog(shader)}`;
        gl.deleteShader(shader);
        if (!gl.isContextLost()) throw new Error(error);
      }
      return shader;
    }
    compileProgram(vs, fs) {
      const gl = this.context.gl;
      const program = gl.createProgram();
      if (!program) throw new Error("Couldn't compile program.");
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const error = `Couldn't compile shader program: ${gl.getProgramInfoLog(program)}`;
        gl.deleteProgram(program);
        if (!gl.isContextLost()) throw new Error(error);
      }
      return program;
    }
    restore() {
      this.compile();
    }
    bind() {
      this.context.gl.useProgram(this.program);
    }
    unbind() {
      this.context.gl.useProgram(null);
    }
    setUniformi(uniform, value) {
      this.context.gl.uniform1i(this.getUniformLocation(uniform), value);
    }
    setUniformf(uniform, value) {
      this.context.gl.uniform1f(this.getUniformLocation(uniform), value);
    }
    setUniform2f(uniform, value, value2) {
      this.context.gl.uniform2f(this.getUniformLocation(uniform), value, value2);
    }
    setUniform3f(uniform, value, value2, value3) {
      this.context.gl.uniform3f(this.getUniformLocation(uniform), value, value2, value3);
    }
    setUniform4f(uniform, value, value2, value3, value4) {
      this.context.gl.uniform4f(this.getUniformLocation(uniform), value, value2, value3, value4);
    }
    setUniform2x2f(uniform, value) {
      const gl = this.context.gl;
      this.tmp2x2.set(value);
      gl.uniformMatrix2fv(this.getUniformLocation(uniform), false, this.tmp2x2);
    }
    setUniform3x3f(uniform, value) {
      const gl = this.context.gl;
      this.tmp3x3.set(value);
      gl.uniformMatrix3fv(this.getUniformLocation(uniform), false, this.tmp3x3);
    }
    setUniform4x4f(uniform, value) {
      const gl = this.context.gl;
      this.tmp4x4.set(value);
      gl.uniformMatrix4fv(this.getUniformLocation(uniform), false, this.tmp4x4);
    }
    getUniformLocation(uniform) {
      const gl = this.context.gl;
      if (!this.program) throw new Error("Shader not compiled.");
      const location = gl.getUniformLocation(this.program, uniform);
      if (!location && !gl.isContextLost()) throw new Error(`Couldn't find location for uniform ${uniform}`);
      return location;
    }
    getAttributeLocation(attribute) {
      const gl = this.context.gl;
      if (!this.program) throw new Error("Shader not compiled.");
      const location = gl.getAttribLocation(this.program, attribute);
      if (location === -1 && !gl.isContextLost()) throw new Error(`Couldn't find location for attribute ${attribute}`);
      return location;
    }
    dispose() {
      this.context.removeRestorable(this);
      const gl = this.context.gl;
      if (this.vs) {
        gl.deleteShader(this.vs);
        this.vs = null;
      }
      if (this.fs) {
        gl.deleteShader(this.fs);
        this.fs = null;
      }
      if (this.program) {
        gl.deleteProgram(this.program);
        this.program = null;
      }
    }
    static newColoredTextured(context) {
      const vs = `
attribute vec4 ${_Shader.POSITION};
attribute vec4 ${_Shader.COLOR};
attribute vec2 ${_Shader.TEXCOORDS};
uniform mat4 ${_Shader.MVP_MATRIX};
varying vec4 v_color;
varying vec2 v_texCoords;

void main () {
	v_color = ${_Shader.COLOR};
	v_texCoords = ${_Shader.TEXCOORDS};
	gl_Position = ${_Shader.MVP_MATRIX} * ${_Shader.POSITION};
}
`;
      const fs = `
#ifdef GL_ES
	#define LOWP lowp
	precision mediump float;
#else
	#define LOWP
#endif
varying LOWP vec4 v_color;
varying vec2 v_texCoords;
uniform sampler2D u_texture;

void main () {
	gl_FragColor = v_color * texture2D(u_texture, v_texCoords);
}
`;
      return new _Shader(context, vs, fs);
    }
    static newTwoColoredTextured(context) {
      const vs = `
attribute vec4 ${_Shader.POSITION};
attribute vec4 ${_Shader.COLOR};
attribute vec4 ${_Shader.COLOR2};
attribute vec2 ${_Shader.TEXCOORDS};
uniform mat4 ${_Shader.MVP_MATRIX};
varying vec4 v_light;
varying vec4 v_dark;
varying vec2 v_texCoords;

void main () {
	v_light = ${_Shader.COLOR};
	v_dark = ${_Shader.COLOR2};
	v_texCoords = ${_Shader.TEXCOORDS};
	gl_Position = ${_Shader.MVP_MATRIX} * ${_Shader.POSITION};
}
`;
      const fs = `
#ifdef GL_ES
	#define LOWP lowp
	precision mediump float;
#else
	#define LOWP
#endif
varying LOWP vec4 v_light;
varying LOWP vec4 v_dark;
varying vec2 v_texCoords;
uniform sampler2D u_texture;

void main () {
	vec4 texColor = texture2D(u_texture, v_texCoords);
	gl_FragColor.a = texColor.a * v_light.a;
	gl_FragColor.rgb = ((texColor.a - 1.0) * v_dark.a + 1.0 - texColor.rgb) * v_dark.rgb + texColor.rgb * v_light.rgb;
}
`;
      return new _Shader(context, vs, fs);
    }
    static newColored(context) {
      const vs = `
attribute vec4 ${_Shader.POSITION};
attribute vec4 ${_Shader.COLOR};
uniform mat4 ${_Shader.MVP_MATRIX};
varying vec4 v_color;

void main () {
	v_color = ${_Shader.COLOR};
	gl_Position = ${_Shader.MVP_MATRIX} * ${_Shader.POSITION};
}
`;
      const fs = `
#ifdef GL_ES
	#define LOWP lowp
	precision mediump float;
#else
	#define LOWP
#endif
varying LOWP vec4 v_color;

void main () {
	gl_FragColor = v_color;
}
`;
      return new _Shader(context, vs, fs);
    }
  };

  // spine-webgl/src/Mesh.ts
  var Mesh = class {
    constructor(context, attributes, maxVertices, maxIndices) {
      this.attributes = attributes;
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
      this.elementsPerVertex = 0;
      for (let i = 0; i < attributes.length; i++) {
        this.elementsPerVertex += attributes[i].numElements;
      }
      this.vertices = new Float32Array(maxVertices * this.elementsPerVertex);
      this.indices = new Uint16Array(maxIndices);
      this.context.addRestorable(this);
    }
    context;
    vertices;
    verticesBuffer = null;
    verticesLength = 0;
    dirtyVertices = false;
    indices;
    indicesBuffer = null;
    indicesLength = 0;
    dirtyIndices = false;
    elementsPerVertex = 0;
    getAttributes() {
      return this.attributes;
    }
    maxVertices() {
      return this.vertices.length / this.elementsPerVertex;
    }
    numVertices() {
      return this.verticesLength / this.elementsPerVertex;
    }
    setVerticesLength(length) {
      this.dirtyVertices = true;
      this.verticesLength = length;
    }
    getVertices() {
      return this.vertices;
    }
    maxIndices() {
      return this.indices.length;
    }
    numIndices() {
      return this.indicesLength;
    }
    setIndicesLength(length) {
      this.dirtyIndices = true;
      this.indicesLength = length;
    }
    getIndices() {
      return this.indices;
    }
    getVertexSizeInFloats() {
      let size = 0;
      for (let i = 0; i < this.attributes.length; i++) {
        const attribute = this.attributes[i];
        size += attribute.numElements;
      }
      return size;
    }
    setVertices(vertices) {
      this.dirtyVertices = true;
      if (vertices.length > this.vertices.length) throw Error(`Mesh can't store more than ${this.maxVertices()} vertices`);
      this.vertices.set(vertices, 0);
      this.verticesLength = vertices.length;
    }
    setIndices(indices) {
      this.dirtyIndices = true;
      if (indices.length > this.indices.length) throw Error(`Mesh can't store more than ${this.maxIndices()} indices`);
      this.indices.set(indices, 0);
      this.indicesLength = indices.length;
    }
    draw(shader, primitiveType) {
      this.drawWithOffset(shader, primitiveType, 0, this.indicesLength > 0 ? this.indicesLength : this.verticesLength / this.elementsPerVertex);
    }
    drawWithOffset(shader, primitiveType, offset, count) {
      const gl = this.context.gl;
      if (this.dirtyVertices || this.dirtyIndices) this.update();
      this.bind(shader);
      if (this.indicesLength > 0) {
        gl.drawElements(primitiveType, count, gl.UNSIGNED_SHORT, offset * 2);
      } else {
        gl.drawArrays(primitiveType, offset, count);
      }
      this.unbind(shader);
    }
    bind(shader) {
      const gl = this.context.gl;
      gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
      let offset = 0;
      for (let i = 0; i < this.attributes.length; i++) {
        const attrib = this.attributes[i];
        const location = shader.getAttributeLocation(attrib.name);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, attrib.numElements, gl.FLOAT, false, this.elementsPerVertex * 4, offset * 4);
        offset += attrib.numElements;
      }
      if (this.indicesLength > 0) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    }
    unbind(shader) {
      const gl = this.context.gl;
      for (let i = 0; i < this.attributes.length; i++) {
        const attrib = this.attributes[i];
        const location = shader.getAttributeLocation(attrib.name);
        gl.disableVertexAttribArray(location);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      if (this.indicesLength > 0) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }
    update() {
      const gl = this.context.gl;
      if (this.dirtyVertices) {
        if (!this.verticesBuffer) {
          this.verticesBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices.subarray(0, this.verticesLength), gl.DYNAMIC_DRAW);
        this.dirtyVertices = false;
      }
      if (this.dirtyIndices) {
        if (!this.indicesBuffer) {
          this.indicesBuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices.subarray(0, this.indicesLength), gl.DYNAMIC_DRAW);
        this.dirtyIndices = false;
      }
    }
    restore() {
      this.verticesBuffer = null;
      this.indicesBuffer = null;
      this.update();
    }
    dispose() {
      this.context.removeRestorable(this);
      const gl = this.context.gl;
      gl.deleteBuffer(this.verticesBuffer);
      gl.deleteBuffer(this.indicesBuffer);
    }
  };
  var VertexAttribute = class {
    constructor(name, type, numElements) {
      this.name = name;
      this.type = type;
      this.numElements = numElements;
    }
  };
  var Position2Attribute = class extends VertexAttribute {
    constructor() {
      super(Shader.POSITION, 0 /* Float */, 2);
    }
  };
  var Position3Attribute = class extends VertexAttribute {
    constructor() {
      super(Shader.POSITION, 0 /* Float */, 3);
    }
  };
  var TexCoordAttribute = class extends VertexAttribute {
    constructor(unit = 0) {
      super(Shader.TEXCOORDS + (unit === 0 ? "" : unit), 0 /* Float */, 2);
    }
  };
  var ColorAttribute = class extends VertexAttribute {
    constructor() {
      super(Shader.COLOR, 0 /* Float */, 4);
    }
  };
  var Color2Attribute = class extends VertexAttribute {
    constructor() {
      super(Shader.COLOR2, 0 /* Float */, 4);
    }
  };
  var VertexAttributeType = /* @__PURE__ */ ((VertexAttributeType2) => {
    VertexAttributeType2[VertexAttributeType2["Float"] = 0] = "Float";
    return VertexAttributeType2;
  })(VertexAttributeType || {});

  // spine-webgl/src/PolygonBatcher.ts
  var GL_ONE = 1;
  var GL_ONE_MINUS_SRC_COLOR = 769;
  var GL_ONE_MINUS_SRC_ALPHA = 771;
  var GL_DST_COLOR = 774;
  var PolygonBatcher = class _PolygonBatcher {
    static disableCulling = false;
    context;
    drawCalls = 0;
    static globalDrawCalls = 0;
    isDrawing = false;
    mesh;
    shader = null;
    lastTexture = null;
    verticesLength = 0;
    indicesLength = 0;
    srcColorBlend;
    srcAlphaBlend;
    dstBlend;
    cullWasEnabled = false;
    constructor(context, twoColorTint = true, maxVertices = 10920) {
      if (maxVertices > 10920) throw new Error(`Can't have more than 10920 triangles per batch: ${maxVertices}`);
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
      const attributes = twoColorTint ? [new Position2Attribute(), new ColorAttribute(), new TexCoordAttribute(), new Color2Attribute()] : [new Position2Attribute(), new ColorAttribute(), new TexCoordAttribute()];
      this.mesh = new Mesh(context, attributes, maxVertices, maxVertices * 3);
      const gl = this.context.gl;
      this.srcColorBlend = gl.SRC_ALPHA;
      this.srcAlphaBlend = gl.ONE;
      this.dstBlend = gl.ONE_MINUS_SRC_ALPHA;
    }
    begin(shader) {
      if (this.isDrawing) throw new Error("PolygonBatch is already drawing. Call PolygonBatch.end() before calling PolygonBatch.begin()");
      this.drawCalls = 0;
      this.shader = shader;
      this.lastTexture = null;
      this.isDrawing = true;
      const gl = this.context.gl;
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(this.srcColorBlend, this.dstBlend, this.srcAlphaBlend, this.dstBlend);
      if (_PolygonBatcher.disableCulling) {
        this.cullWasEnabled = gl.isEnabled(gl.CULL_FACE);
        if (this.cullWasEnabled) gl.disable(gl.CULL_FACE);
      }
    }
    static blendModesGL = [
      { srcRgbPma: GL_ONE, dstRgb: GL_ONE_MINUS_SRC_ALPHA, srcAlpha: GL_ONE },
      { srcRgbPma: GL_ONE, dstRgb: GL_ONE, srcAlpha: GL_ONE },
      { srcRgbPma: GL_DST_COLOR, dstRgb: GL_ONE_MINUS_SRC_ALPHA, srcAlpha: GL_ONE },
      { srcRgbPma: GL_ONE, dstRgb: GL_ONE_MINUS_SRC_COLOR, srcAlpha: GL_ONE }
    ];
    setBlendMode(blendMode) {
      const blendModeGL = _PolygonBatcher.blendModesGL[blendMode];
      const srcColorBlend = blendModeGL.srcRgbPma;
      const srcAlphaBlend = blendModeGL.srcAlpha;
      const dstBlend = blendModeGL.dstRgb;
      if (this.srcColorBlend === srcColorBlend && this.srcAlphaBlend === srcAlphaBlend && this.dstBlend === dstBlend) return;
      this.srcColorBlend = srcColorBlend;
      this.srcAlphaBlend = srcAlphaBlend;
      this.dstBlend = dstBlend;
      if (this.isDrawing) {
        this.flush();
      }
      const gl = this.context.gl;
      gl.blendFuncSeparate(srcColorBlend, dstBlend, srcAlphaBlend, dstBlend);
    }
    draw(texture, vertices, indices) {
      if (texture !== this.lastTexture) {
        this.flush();
        this.lastTexture = texture;
      } else if (this.verticesLength + vertices.length > this.mesh.getVertices().length || this.indicesLength + indices.length > this.mesh.getIndices().length) {
        this.flush();
      }
      const indexStart = this.mesh.numVertices();
      this.mesh.getVertices().set(vertices, this.verticesLength);
      this.verticesLength += vertices.length;
      this.mesh.setVerticesLength(this.verticesLength);
      const indicesArray = this.mesh.getIndices();
      for (let i = this.indicesLength, j = 0; j < indices.length; i++, j++)
        indicesArray[i] = indices[j] + indexStart;
      this.indicesLength += indices.length;
      this.mesh.setIndicesLength(this.indicesLength);
    }
    flush() {
      if (this.verticesLength === 0) return;
      if (!this.lastTexture) throw new Error("No texture set.");
      if (!this.shader) throw new Error("No shader set.");
      this.lastTexture.bind();
      this.mesh.draw(this.shader, this.context.gl.TRIANGLES);
      this.verticesLength = 0;
      this.indicesLength = 0;
      this.mesh.setVerticesLength(0);
      this.mesh.setIndicesLength(0);
      this.drawCalls++;
      _PolygonBatcher.globalDrawCalls++;
    }
    end() {
      if (!this.isDrawing) throw new Error("PolygonBatch is not drawing. Call PolygonBatch.begin() before calling PolygonBatch.end()");
      if (this.verticesLength > 0 || this.indicesLength > 0) this.flush();
      this.shader = null;
      this.lastTexture = null;
      this.isDrawing = false;
      const gl = this.context.gl;
      gl.disable(gl.BLEND);
      if (_PolygonBatcher.disableCulling) {
        if (this.cullWasEnabled) gl.enable(gl.CULL_FACE);
      }
    }
    getDrawCalls() {
      return this.drawCalls;
    }
    static getAndResetGlobalDrawCalls() {
      const result = _PolygonBatcher.globalDrawCalls;
      _PolygonBatcher.globalDrawCalls = 0;
      return result;
    }
    dispose() {
      this.mesh.dispose();
    }
  };

  // spine-webgl/src/ShapeRenderer.ts
  var ShapeRenderer = class {
    context;
    isDrawing = false;
    mesh;
    shapeType = 4 /* Filled */;
    color = new Color(1, 1, 1, 1);
    shader = null;
    vertexIndex = 0;
    tmp = new Vector2();
    srcColorBlend;
    srcAlphaBlend;
    dstBlend;
    constructor(context, maxVertices = 10920) {
      if (maxVertices > 10920) throw new Error(`Can't have more than 10920 triangles per batch: ${maxVertices}`);
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
      this.mesh = new Mesh(context, [new Position2Attribute(), new ColorAttribute()], maxVertices, 0);
      const gl = this.context.gl;
      this.srcColorBlend = gl.SRC_ALPHA;
      this.srcAlphaBlend = gl.ONE;
      this.dstBlend = gl.ONE_MINUS_SRC_ALPHA;
    }
    begin(shader) {
      if (this.isDrawing) throw new Error("ShapeRenderer.begin() has already been called");
      this.shader = shader;
      this.vertexIndex = 0;
      this.isDrawing = true;
      const gl = this.context.gl;
      gl.enable(gl.BLEND);
      gl.blendFuncSeparate(this.srcColorBlend, this.dstBlend, this.srcAlphaBlend, this.dstBlend);
    }
    setBlendMode(srcColorBlend, srcAlphaBlend, dstBlend) {
      this.srcColorBlend = srcColorBlend;
      this.srcAlphaBlend = srcAlphaBlend;
      this.dstBlend = dstBlend;
      if (this.isDrawing) {
        this.flush();
        const gl = this.context.gl;
        gl.blendFuncSeparate(srcColorBlend, dstBlend, srcAlphaBlend, dstBlend);
      }
    }
    setColor(color) {
      this.color.setFromColor(color);
    }
    setColorWith(r, g, b, a) {
      this.color.set(r, g, b, a);
    }
    point(x, y, color) {
      this.check(0 /* Point */, 1);
      if (!color) color = this.color;
      this.vertex(x, y, color);
    }
    line(x, y, x2, y2, color) {
      this.check(1 /* Line */, 2);
      if (!color) color = this.color;
      this.vertex(x, y, color);
      this.vertex(x2, y2, color);
    }
    triangle(filled, x, y, x2, y2, x3, y3, color, color2, color3) {
      this.check(filled ? 4 /* Filled */ : 1 /* Line */, 3);
      if (!color) color = this.color;
      if (!color2) color2 = this.color;
      if (!color3) color3 = this.color;
      if (filled) {
        this.vertex(x, y, color);
        this.vertex(x2, y2, color2);
        this.vertex(x3, y3, color3);
      } else {
        this.vertex(x, y, color);
        this.vertex(x2, y2, color2);
        this.vertex(x2, y2, color);
        this.vertex(x3, y3, color2);
        this.vertex(x3, y3, color);
        this.vertex(x, y, color2);
      }
    }
    quad(filled, x, y, x2, y2, x3, y3, x4, y4, color, color2, color3, color4) {
      this.check(filled ? 4 /* Filled */ : 1 /* Line */, 3);
      if (!color) color = this.color;
      if (!color2) color2 = this.color;
      if (!color3) color3 = this.color;
      if (!color4) color4 = this.color;
      if (filled) {
        this.vertex(x, y, color);
        this.vertex(x2, y2, color2);
        this.vertex(x3, y3, color3);
        this.vertex(x3, y3, color3);
        this.vertex(x4, y4, color4);
        this.vertex(x, y, color);
      } else {
        this.vertex(x, y, color);
        this.vertex(x2, y2, color2);
        this.vertex(x2, y2, color2);
        this.vertex(x3, y3, color3);
        this.vertex(x3, y3, color3);
        this.vertex(x4, y4, color4);
        this.vertex(x4, y4, color4);
        this.vertex(x, y, color);
      }
    }
    rect(filled, x, y, width, height, color) {
      this.quad(filled, x, y, x + width, y, x + width, y + height, x, y + height, color, color, color, color);
    }
    rectLine(filled, x1, y1, x2, y2, width, color) {
      this.check(filled ? 4 /* Filled */ : 1 /* Line */, 8);
      if (!color) color = this.color;
      const t = this.tmp.set(y2 - y1, x1 - x2);
      t.normalize();
      width *= 0.5;
      const tx = t.x * width;
      const ty = t.y * width;
      if (!filled) {
        this.vertex(x1 + tx, y1 + ty, color);
        this.vertex(x1 - tx, y1 - ty, color);
        this.vertex(x2 + tx, y2 + ty, color);
        this.vertex(x2 - tx, y2 - ty, color);
        this.vertex(x2 + tx, y2 + ty, color);
        this.vertex(x1 + tx, y1 + ty, color);
        this.vertex(x2 - tx, y2 - ty, color);
        this.vertex(x1 - tx, y1 - ty, color);
      } else {
        this.vertex(x1 + tx, y1 + ty, color);
        this.vertex(x1 - tx, y1 - ty, color);
        this.vertex(x2 + tx, y2 + ty, color);
        this.vertex(x2 - tx, y2 - ty, color);
        this.vertex(x2 + tx, y2 + ty, color);
        this.vertex(x1 - tx, y1 - ty, color);
      }
    }
    x(x, y, size) {
      this.line(x - size, y - size, x + size, y + size);
      this.line(x - size, y + size, x + size, y - size);
    }
    polygon(polygonVertices, offset, count, color) {
      if (count < 3) throw new Error("Polygon must contain at least 3 vertices");
      this.check(1 /* Line */, count * 2);
      if (!color) color = this.color;
      offset <<= 1;
      count <<= 1;
      const firstX = polygonVertices[offset];
      const firstY = polygonVertices[offset + 1];
      const last = offset + count;
      for (let i = offset, n = offset + count - 2; i < n; i += 2) {
        const x1 = polygonVertices[i];
        const y1 = polygonVertices[i + 1];
        let x2 = 0;
        let y2 = 0;
        if (i + 2 >= last) {
          x2 = firstX;
          y2 = firstY;
        } else {
          x2 = polygonVertices[i + 2];
          y2 = polygonVertices[i + 3];
        }
        this.vertex(x1, y1, color);
        this.vertex(x2, y2, color);
      }
    }
    circle(filled, x, y, radius, color, segments = 0) {
      if (segments === 0) segments = Math.max(1, 6 * MathUtils.cbrt(radius) | 0);
      if (segments <= 0) throw new Error("segments must be > 0.");
      if (!color) color = this.color;
      const angle = 2 * MathUtils.PI / segments;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      let cx = radius, cy = 0;
      if (!filled) {
        this.check(1 /* Line */, segments * 2 + 2);
        for (let i = 0; i < segments; i++) {
          this.vertex(x + cx, y + cy, color);
          const temp = cx;
          cx = cos * cx - sin * cy;
          cy = sin * temp + cos * cy;
          this.vertex(x + cx, y + cy, color);
        }
        this.vertex(x + cx, y + cy, color);
      } else {
        this.check(4 /* Filled */, segments * 3 + 3);
        segments--;
        for (let i = 0; i < segments; i++) {
          this.vertex(x, y, color);
          this.vertex(x + cx, y + cy, color);
          const temp = cx;
          cx = cos * cx - sin * cy;
          cy = sin * temp + cos * cy;
          this.vertex(x + cx, y + cy, color);
        }
        this.vertex(x, y, color);
        this.vertex(x + cx, y + cy, color);
      }
      cx = radius;
      cy = 0;
      this.vertex(x + cx, y + cy, color);
    }
    curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, segments, color) {
      this.check(1 /* Line */, segments * 2 + 2);
      if (!color) color = this.color;
      const subdiv_step = 1 / segments;
      const subdiv_step2 = subdiv_step * subdiv_step;
      const subdiv_step3 = subdiv_step * subdiv_step * subdiv_step;
      const pre1 = 3 * subdiv_step;
      const pre2 = 3 * subdiv_step2;
      const pre4 = 6 * subdiv_step2;
      const pre5 = 6 * subdiv_step3;
      const tmp1x = x1 - cx1 * 2 + cx2;
      const tmp1y = y1 - cy1 * 2 + cy2;
      const tmp2x = (cx1 - cx2) * 3 - x1 + x2;
      const tmp2y = (cy1 - cy2) * 3 - y1 + y2;
      let fx = x1;
      let fy = y1;
      let dfx = (cx1 - x1) * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3;
      let dfy = (cy1 - y1) * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3;
      let ddfx = tmp1x * pre4 + tmp2x * pre5;
      let ddfy = tmp1y * pre4 + tmp2y * pre5;
      const dddfx = tmp2x * pre5;
      const dddfy = tmp2y * pre5;
      while (segments-- > 0) {
        this.vertex(fx, fy, color);
        fx += dfx;
        fy += dfy;
        dfx += ddfx;
        dfy += ddfy;
        ddfx += dddfx;
        ddfy += dddfy;
        this.vertex(fx, fy, color);
      }
      this.vertex(fx, fy, color);
      this.vertex(x2, y2, color);
    }
    vertex(x, y, color) {
      let idx = this.vertexIndex;
      const vertices = this.mesh.getVertices();
      vertices[idx++] = x;
      vertices[idx++] = y;
      vertices[idx++] = color.r;
      vertices[idx++] = color.g;
      vertices[idx++] = color.b;
      vertices[idx++] = color.a;
      this.vertexIndex = idx;
    }
    end() {
      if (!this.isDrawing) throw new Error("ShapeRenderer.begin() has not been called");
      this.flush();
      const gl = this.context.gl;
      gl.disable(gl.BLEND);
      this.isDrawing = false;
    }
    flush() {
      if (this.vertexIndex === 0) return;
      if (!this.shader) throw new Error("No shader set.");
      this.mesh.setVerticesLength(this.vertexIndex);
      this.mesh.draw(this.shader, this.shapeType);
      this.vertexIndex = 0;
    }
    check(shapeType, numVertices) {
      if (!this.isDrawing) throw new Error("ShapeRenderer.begin() has not been called");
      if (this.shapeType === shapeType) {
        if (this.mesh.maxVertices() - this.mesh.numVertices() < numVertices) this.flush();
        else return;
      } else {
        this.flush();
        this.shapeType = shapeType;
      }
    }
    dispose() {
      this.mesh.dispose();
    }
  };
  var ShapeType = /* @__PURE__ */ ((ShapeType2) => {
    ShapeType2[ShapeType2["Point"] = 0] = "Point";
    ShapeType2[ShapeType2["Line"] = 1] = "Line";
    ShapeType2[ShapeType2["Filled"] = 4] = "Filled";
    return ShapeType2;
  })(ShapeType || {});

  // spine-webgl/src/SkeletonDebugRenderer.ts
  var SkeletonDebugRenderer = class _SkeletonDebugRenderer {
    boneLineColor = new Color(1, 0, 0, 1);
    boneOriginColor = new Color(0, 1, 0, 1);
    attachmentLineColor = new Color(0, 0, 1, 0.5);
    triangleLineColor = new Color(1, 0.64, 0, 0.5);
    pathColor = new Color().setFromString("FF7F00");
    clipColor = new Color(0.8, 0, 0, 2);
    aabbColor = new Color(0, 1, 0, 0.5);
    drawBones = true;
    drawRegionAttachments = true;
    drawBoundingBoxes = true;
    drawMeshHull = true;
    drawMeshTriangles = true;
    drawPaths = true;
    drawSkeletonXY = false;
    drawClipping = true;
    scale = 1;
    boneWidth = 2;
    context;
    bounds = new SkeletonBounds();
    temp = [];
    vertices = Utils.newFloatArray(2 * 1024);
    static LIGHT_GRAY = new Color(192 / 255, 192 / 255, 192 / 255, 1);
    static GREEN = new Color(0, 1, 0, 1);
    constructor(context) {
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
    }
    draw(shapes, skeleton, ignoredBones) {
      const skeletonX = skeleton.x;
      const skeletonY = skeleton.y;
      const gl = this.context.gl;
      shapes.setBlendMode(gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      const bones = skeleton.bones;
      if (this.drawBones) {
        shapes.setColor(this.boneLineColor);
        for (let i = 0, n = bones.length; i < n; i++) {
          const bone = bones[i];
          if (ignoredBones && ignoredBones.indexOf(bone.data.name) > -1) continue;
          if (!bone.parent) continue;
          const boneApplied = bone.appliedPose;
          const x = bone.data.length * boneApplied.a + boneApplied.worldX;
          const y = bone.data.length * boneApplied.c + boneApplied.worldY;
          shapes.rectLine(true, boneApplied.worldX, boneApplied.worldY, x, y, this.boneWidth * this.scale);
        }
        if (this.drawSkeletonXY) shapes.x(skeletonX, skeletonY, 4 * this.scale);
      }
      if (this.drawRegionAttachments) {
        shapes.setColor(this.attachmentLineColor);
        const slots = skeleton.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
          const slot = slots[i];
          if (!slot.bone.active) continue;
          const attachment = slot.appliedPose.attachment;
          if (attachment instanceof RegionAttachment) {
            const vertices = this.vertices;
            attachment.computeWorldVertices(slot, attachment.getOffsets(slot.appliedPose), vertices, 0, 2);
            shapes.line(vertices[0], vertices[1], vertices[2], vertices[3]);
            shapes.line(vertices[2], vertices[3], vertices[4], vertices[5]);
            shapes.line(vertices[4], vertices[5], vertices[6], vertices[7]);
            shapes.line(vertices[6], vertices[7], vertices[0], vertices[1]);
          }
        }
      }
      if (this.drawMeshHull || this.drawMeshTriangles) {
        const slots = skeleton.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
          const slot = slots[i];
          if (!slot.bone.active) continue;
          const attachment = slot.appliedPose.attachment;
          if (!(attachment instanceof MeshAttachment)) continue;
          const vertices = this.vertices;
          attachment.computeWorldVertices(skeleton, slot, 0, attachment.worldVerticesLength, vertices, 0, 2);
          const triangles = attachment.triangles;
          let hullLength = attachment.hullLength;
          if (this.drawMeshTriangles) {
            shapes.setColor(this.triangleLineColor);
            for (let ii = 0, nn = triangles.length; ii < nn; ii += 3) {
              const v1 = triangles[ii] * 2, v2 = triangles[ii + 1] * 2, v3 = triangles[ii + 2] * 2;
              shapes.triangle(
                false,
                vertices[v1],
                vertices[v1 + 1],
                //
                vertices[v2],
                vertices[v2 + 1],
                //
                vertices[v3],
                vertices[v3 + 1]
                //
              );
            }
          }
          if (this.drawMeshHull && hullLength > 0) {
            shapes.setColor(this.attachmentLineColor);
            hullLength = (hullLength >> 1) * 2;
            let lastX = vertices[hullLength - 2], lastY = vertices[hullLength - 1];
            for (let ii = 0, nn = hullLength; ii < nn; ii += 2) {
              const x = vertices[ii], y = vertices[ii + 1];
              shapes.line(x, y, lastX, lastY);
              lastX = x;
              lastY = y;
            }
          }
        }
      }
      if (this.drawBoundingBoxes) {
        const bounds = this.bounds;
        bounds.update(skeleton, true);
        shapes.setColor(this.aabbColor);
        shapes.rect(false, bounds.minX, bounds.minY, bounds.getWidth(), bounds.getHeight());
        const polygons = bounds.polygons;
        const boxes = bounds.boundingBoxes;
        for (let i = 0, n = polygons.length; i < n; i++) {
          const polygon = polygons[i];
          shapes.setColor(boxes[i].color);
          shapes.polygon(polygon, 0, polygon.length);
        }
      }
      if (this.drawPaths) {
        const slots = skeleton.slots;
        for (let i = 0, n = slots.length; i < n; i++) {
          const slot = slots[i];
          if (!slot.bone.active) continue;
          const attachment = slot.appliedPose.attachment;
          if (!(attachment instanceof PathAttachment)) continue;
          let nn = attachment.worldVerticesLength;
          const world = this.temp = Utils.setArraySize(this.temp, nn, 0);
          attachment.computeWorldVertices(skeleton, slot, 0, nn, world, 0, 2);
          const color = this.pathColor;
          let x1 = world[2], y1 = world[3], x2 = 0, y2 = 0;
          if (attachment.closed) {
            shapes.setColor(color);
            const cx1 = world[0], cy1 = world[1], cx2 = world[nn - 2], cy2 = world[nn - 1];
            x2 = world[nn - 4];
            y2 = world[nn - 3];
            shapes.curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, 32);
            shapes.setColor(_SkeletonDebugRenderer.LIGHT_GRAY);
            shapes.line(x1, y1, cx1, cy1);
            shapes.line(x2, y2, cx2, cy2);
          }
          nn -= 4;
          for (let ii = 4; ii < nn; ii += 6) {
            const cx1 = world[ii], cy1 = world[ii + 1], cx2 = world[ii + 2], cy2 = world[ii + 3];
            x2 = world[ii + 4];
            y2 = world[ii + 5];
            shapes.setColor(color);
            shapes.curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, 32);
            shapes.setColor(_SkeletonDebugRenderer.LIGHT_GRAY);
            shapes.line(x1, y1, cx1, cy1);
            shapes.line(x2, y2, cx2, cy2);
            x1 = x2;
            y1 = y2;
          }
        }
      }
      if (this.drawBones) {
        shapes.setColor(this.boneOriginColor);
        for (let i = 0, n = bones.length; i < n; i++) {
          const bone = bones[i];
          if (ignoredBones && ignoredBones.indexOf(bone.data.name) > -1) continue;
          const boneApplied = bone.appliedPose;
          shapes.circle(true, boneApplied.worldX, boneApplied.worldY, 3 * this.scale, this.boneOriginColor, 8);
        }
      }
      if (this.drawClipping) {
        const slots = skeleton.slots;
        shapes.setColor(this.clipColor);
        for (let i = 0, n = slots.length; i < n; i++) {
          const slot = slots[i];
          if (!slot.bone.active) continue;
          const attachment = slot.appliedPose.attachment;
          if (!(attachment instanceof ClippingAttachment)) continue;
          const nn = attachment.worldVerticesLength;
          const world = this.temp = Utils.setArraySize(this.temp, nn, 0);
          attachment.computeWorldVertices(skeleton, slot, 0, nn, world, 0, 2);
          for (let i2 = 0, n2 = world.length; i2 < n2; i2 += 2) {
            const x = world[i2];
            const y = world[i2 + 1];
            const x2 = world[(i2 + 2) % world.length];
            const y2 = world[(i2 + 3) % world.length];
            shapes.line(x, y, x2, y2);
          }
        }
      }
    }
    dispose() {
    }
  };

  // spine-webgl/src/SkeletonRenderer.ts
  var Renderable = class {
    constructor(vertices, numVertices, numFloats) {
      this.vertices = vertices;
      this.numVertices = numVertices;
      this.numFloats = numFloats;
    }
  };
  var SkeletonRenderer = class _SkeletonRenderer {
    static QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
    tempColor = new Color();
    tempColor2 = new Color();
    vertices;
    vertexSize = 2 + 2 + 4;
    twoColorTint = false;
    renderable = new Renderable([], 0, 0);
    clipper = new SkeletonClipping();
    /**
     * Batches additive slots together with normal slots by rendering additive slots with premultiplied alpha RGB and zero alpha,
     * while using normal PMA blending. This reduces draw calls for normal/additive/normal sequences with the same texture.
     * Disable this if rendering to a transparent target and the accumulated destination alpha from additive blending must be preserved.
     */
    pmaAdditiveBatching = true;
    constructor(context, twoColorTint = true) {
      this.twoColorTint = twoColorTint;
      if (twoColorTint)
        this.vertexSize += 4;
      this.vertices = Utils.newFloatArray(this.vertexSize * 1024);
    }
    draw(batcher, skeleton, slotRangeStart = -1, slotRangeEnd = -1, transformer = null) {
      const clipper = this.clipper;
      const twoColorTint = this.twoColorTint;
      let blendMode = null;
      const renderable = this.renderable;
      let uvs;
      let triangles;
      const drawOrder = skeleton.drawOrder.appliedPose;
      let attachmentColor;
      const skeletonColor = skeleton.color;
      const vertexSize = twoColorTint ? 12 : 8;
      let inRange = false;
      if (slotRangeStart === -1) inRange = true;
      for (let i = 0, n = drawOrder.length; i < n; i++) {
        const slot = drawOrder[i];
        if (!slot.bone.active) {
          clipper.clipEnd(slot);
          continue;
        }
        if (slotRangeStart >= 0 && slotRangeStart === slot.data.index) {
          inRange = true;
        }
        if (!inRange) {
          clipper.clipEnd(slot);
          continue;
        }
        if (slotRangeEnd >= 0 && slotRangeEnd === slot.data.index) {
          inRange = false;
        }
        const pose = slot.appliedPose;
        const attachment = pose.attachment;
        let texture;
        if (attachment instanceof RegionAttachment) {
          renderable.vertices = this.vertices;
          renderable.numVertices = 4;
          renderable.numFloats = vertexSize << 2;
          const sequence = attachment.sequence;
          const sequenceIndex = sequence.resolveIndex(pose);
          attachment.computeWorldVertices(slot, attachment.getOffsets(pose), renderable.vertices, 0, vertexSize);
          triangles = _SkeletonRenderer.QUAD_TRIANGLES;
          uvs = sequence.getUVs(sequenceIndex);
          texture = sequence.regions[sequenceIndex]?.texture;
          attachmentColor = attachment.color;
        } else if (attachment instanceof MeshAttachment) {
          renderable.vertices = this.vertices;
          renderable.numVertices = attachment.worldVerticesLength >> 1;
          renderable.numFloats = renderable.numVertices * vertexSize;
          if (renderable.numFloats > renderable.vertices.length) {
            renderable.vertices = this.vertices = Utils.newFloatArray(renderable.numFloats);
          }
          attachment.computeWorldVertices(skeleton, slot, 0, attachment.worldVerticesLength, renderable.vertices, 0, vertexSize);
          triangles = attachment.triangles;
          const sequence = attachment.sequence;
          const sequenceIndex = sequence.resolveIndex(pose);
          texture = sequence.regions[sequenceIndex]?.texture;
          uvs = sequence.getUVs(sequenceIndex);
          attachmentColor = attachment.color;
        } else if (attachment instanceof ClippingAttachment) {
          clipper.clipEnd(slot);
          clipper.clipStart(skeleton, slot, attachment);
          continue;
        } else {
          clipper.clipEnd(slot);
          continue;
        }
        if (texture) {
          const slotColor = pose.color;
          const finalColor = this.tempColor;
          const alpha = skeletonColor.a * slotColor.a * attachmentColor.a;
          finalColor.r = skeletonColor.r * slotColor.r * attachmentColor.r * alpha;
          finalColor.g = skeletonColor.g * slotColor.g * attachmentColor.g * alpha;
          finalColor.b = skeletonColor.b * slotColor.b * attachmentColor.b * alpha;
          const slotBlendMode = slot.data.blendMode;
          const additiveBlend = this.pmaAdditiveBatching && slotBlendMode === 1 /* Additive */;
          finalColor.a = additiveBlend ? 0 : alpha;
          const darkColor = this.tempColor2;
          if (!pose.darkColor)
            darkColor.set(0, 0, 0, 1);
          else {
            darkColor.r = pose.darkColor.r * alpha;
            darkColor.g = pose.darkColor.g * alpha;
            darkColor.b = pose.darkColor.b * alpha;
            darkColor.a = 1;
          }
          const batchBlendMode = additiveBlend ? 0 /* Normal */ : slotBlendMode;
          if (batchBlendMode !== blendMode) {
            blendMode = batchBlendMode;
            batcher.setBlendMode(blendMode);
          }
          if (clipper.isClipping() && clipper.clipTriangles(renderable.vertices, triangles, triangles.length, uvs, finalColor, darkColor, twoColorTint, vertexSize)) {
            const clippedVertices = new Float32Array(clipper.clippedVertices);
            const clippedTriangles = clipper.clippedTriangles;
            if (transformer) transformer(clippedVertices, clippedVertices.length, vertexSize);
            batcher.draw(texture, clippedVertices, clippedTriangles);
          } else {
            const verts = renderable.vertices;
            if (!twoColorTint) {
              for (let v = 2, u = 0, n2 = renderable.numFloats; v < n2; v += vertexSize, u += 2) {
                verts[v] = finalColor.r;
                verts[v + 1] = finalColor.g;
                verts[v + 2] = finalColor.b;
                verts[v + 3] = finalColor.a;
                verts[v + 4] = uvs[u];
                verts[v + 5] = uvs[u + 1];
              }
            } else {
              for (let v = 2, u = 0, n2 = renderable.numFloats; v < n2; v += vertexSize, u += 2) {
                verts[v] = finalColor.r;
                verts[v + 1] = finalColor.g;
                verts[v + 2] = finalColor.b;
                verts[v + 3] = finalColor.a;
                verts[v + 4] = uvs[u];
                verts[v + 5] = uvs[u + 1];
                verts[v + 6] = darkColor.r;
                verts[v + 7] = darkColor.g;
                verts[v + 8] = darkColor.b;
                verts[v + 9] = darkColor.a;
              }
            }
            const view = renderable.vertices.subarray(0, renderable.numFloats);
            if (transformer) transformer(renderable.vertices, renderable.numFloats, vertexSize);
            batcher.draw(texture, view, triangles);
          }
        }
        clipper.clipEnd(slot);
      }
      clipper.clipEnd();
    }
    /** Returns the {@link SkeletonClipping} used by this renderer for use with e.g. {@link Skeleton.getBounds} **/
    getSkeletonClipping() {
      return this.clipper;
    }
  };

  // spine-webgl/src/SceneRenderer.ts
  var quad = [
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    0,
    0
  ];
  var QUAD_TRIANGLES = [0, 1, 2, 2, 3, 0];
  var WHITE = new Color(1, 1, 1, 1);
  var SceneRenderer = class {
    context;
    canvas;
    camera;
    batcher;
    twoColorTint = false;
    batcherShader;
    shapes;
    shapesShader;
    activeRenderer = null;
    maxCanvasWidth = 0;
    maxCanvasHeight = 0;
    skeletonRenderer;
    skeletonDebugRenderer;
    constructor(canvas, context, twoColorTint = true) {
      this.canvas = canvas;
      this.context = context instanceof ManagedWebGLRenderingContext ? context : new ManagedWebGLRenderingContext(context);
      this.twoColorTint = twoColorTint;
      this.camera = new OrthoCamera(canvas.width, canvas.height);
      this.batcherShader = twoColorTint ? Shader.newTwoColoredTextured(this.context) : Shader.newColoredTextured(this.context);
      this.batcher = new PolygonBatcher(this.context, twoColorTint);
      this.shapesShader = Shader.newColored(this.context);
      this.shapes = new ShapeRenderer(this.context);
      this.skeletonRenderer = new SkeletonRenderer(this.context, twoColorTint);
      this.skeletonDebugRenderer = new SkeletonDebugRenderer(this.context);
    }
    dispose() {
      this.batcher.dispose();
      this.batcherShader.dispose();
      this.shapes.dispose();
      this.shapesShader.dispose();
      this.skeletonDebugRenderer.dispose();
    }
    begin() {
      this.camera.update();
      this.enableRenderer(this.batcher);
    }
    drawSkeleton(skeleton, slotRangeStart = -1, slotRangeEnd = -1, transform = null) {
      this.enableRenderer(this.batcher);
      this.skeletonRenderer.draw(this.batcher, skeleton, slotRangeStart, slotRangeEnd, transform);
    }
    drawSkeletonDebug(skeleton, ignoredBones) {
      this.enableRenderer(this.shapes);
      this.skeletonDebugRenderer.draw(this.shapes, skeleton, ignoredBones);
    }
    drawTexture(texture, x, y, width, height, color) {
      this.enableRenderer(this.batcher);
      if (!color) color = WHITE;
      var i = 0;
      quad[i++] = x;
      quad[i++] = y;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 0;
      quad[i++] = 1;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x + width;
      quad[i++] = y;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 1;
      quad[i++] = 1;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x + width;
      quad[i++] = y + height;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 1;
      quad[i++] = 0;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x;
      quad[i++] = y + height;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 0;
      quad[i++] = 0;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i] = 0;
      }
      this.batcher.draw(texture, quad, QUAD_TRIANGLES);
    }
    drawTextureUV(texture, x, y, width, height, u, v, u2, v2, color) {
      this.enableRenderer(this.batcher);
      if (!color) color = WHITE;
      var i = 0;
      quad[i++] = x;
      quad[i++] = y;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = u;
      quad[i++] = v;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x + width;
      quad[i++] = y;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = u2;
      quad[i++] = v;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x + width;
      quad[i++] = y + height;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = u2;
      quad[i++] = v2;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x;
      quad[i++] = y + height;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = u;
      quad[i++] = v2;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i] = 0;
      }
      this.batcher.draw(texture, quad, QUAD_TRIANGLES);
    }
    drawTextureRotated(texture, x, y, width, height, pivotX, pivotY, angle, color) {
      this.enableRenderer(this.batcher);
      if (!color) color = WHITE;
      const worldOriginX = x + pivotX;
      const worldOriginY = y + pivotY;
      const fx = -pivotX;
      const fy = -pivotY;
      const fx2 = width - pivotX;
      const fy2 = height - pivotY;
      const p1x = fx;
      const p1y = fy;
      const p2x = fx;
      const p2y = fy2;
      const p3x = fx2;
      const p3y = fy2;
      const p4x = fx2;
      const p4y = fy;
      let x1 = 0;
      let y1 = 0;
      let x2 = 0;
      let y2 = 0;
      let x3 = 0;
      let y3 = 0;
      let x4 = 0;
      let y4 = 0;
      if (angle !== 0) {
        const cos = MathUtils.cosDeg(angle);
        const sin = MathUtils.sinDeg(angle);
        x1 = cos * p1x - sin * p1y;
        y1 = sin * p1x + cos * p1y;
        x4 = cos * p2x - sin * p2y;
        y4 = sin * p2x + cos * p2y;
        x3 = cos * p3x - sin * p3y;
        y3 = sin * p3x + cos * p3y;
        x2 = x3 + (x1 - x4);
        y2 = y3 + (y1 - y4);
      } else {
        x1 = p1x;
        y1 = p1y;
        x4 = p2x;
        y4 = p2y;
        x3 = p3x;
        y3 = p3y;
        x2 = p4x;
        y2 = p4y;
      }
      x1 += worldOriginX;
      y1 += worldOriginY;
      x2 += worldOriginX;
      y2 += worldOriginY;
      x3 += worldOriginX;
      y3 += worldOriginY;
      x4 += worldOriginX;
      y4 += worldOriginY;
      var i = 0;
      quad[i++] = x1;
      quad[i++] = y1;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 0;
      quad[i++] = 1;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x2;
      quad[i++] = y2;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 1;
      quad[i++] = 1;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x3;
      quad[i++] = y3;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 1;
      quad[i++] = 0;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x4;
      quad[i++] = y4;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = 0;
      quad[i++] = 0;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i] = 0;
      }
      this.batcher.draw(texture, quad, QUAD_TRIANGLES);
    }
    drawRegion(region, x, y, width, height, color) {
      this.enableRenderer(this.batcher);
      if (!color) color = WHITE;
      var i = 0;
      quad[i++] = x;
      quad[i++] = y;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = region.u;
      quad[i++] = region.v2;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x + width;
      quad[i++] = y;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = region.u2;
      quad[i++] = region.v2;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x + width;
      quad[i++] = y + height;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = region.u2;
      quad[i++] = region.v;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
      }
      quad[i++] = x;
      quad[i++] = y + height;
      quad[i++] = color.r;
      quad[i++] = color.g;
      quad[i++] = color.b;
      quad[i++] = color.a;
      quad[i++] = region.u;
      quad[i++] = region.v;
      if (this.twoColorTint) {
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i++] = 0;
        quad[i] = 0;
      }
      this.batcher.draw(region.page.texture, quad, QUAD_TRIANGLES);
    }
    line(x, y, x2, y2, color, color2) {
      this.enableRenderer(this.shapes);
      this.shapes.line(x, y, x2, y2, color);
    }
    triangle(filled, x, y, x2, y2, x3, y3, color, color2, color3) {
      this.enableRenderer(this.shapes);
      this.shapes.triangle(filled, x, y, x2, y2, x3, y3, color, color2, color3);
    }
    quad(filled, x, y, x2, y2, x3, y3, x4, y4, color, color2, color3, color4) {
      this.enableRenderer(this.shapes);
      this.shapes.quad(filled, x, y, x2, y2, x3, y3, x4, y4, color, color2, color3, color4);
    }
    rect(filled, x, y, width, height, color) {
      this.enableRenderer(this.shapes);
      this.shapes.rect(filled, x, y, width, height, color);
    }
    rectLine(filled, x1, y1, x2, y2, width, color) {
      this.enableRenderer(this.shapes);
      this.shapes.rectLine(filled, x1, y1, x2, y2, width, color);
    }
    polygon(polygonVertices, offset, count, color) {
      this.enableRenderer(this.shapes);
      this.shapes.polygon(polygonVertices, offset, count, color);
    }
    circle(filled, x, y, radius, color, segments = 0) {
      this.enableRenderer(this.shapes);
      this.shapes.circle(filled, x, y, radius, color, segments);
    }
    curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, segments, color) {
      this.enableRenderer(this.shapes);
      this.shapes.curve(x1, y1, cx1, cy1, cx2, cy2, x2, y2, segments, color);
    }
    end() {
      if (this.activeRenderer === this.batcher) this.batcher.end();
      else if (this.activeRenderer === this.shapes) this.shapes.end();
      this.activeRenderer = null;
    }
    resize(resizeMode, worldWidth, worldHeight) {
      const canvas = this.canvas;
      const dpr = this.getSafeDevicePixelRatio(canvas.clientWidth, canvas.clientHeight);
      var w = Math.round(canvas.clientWidth * dpr);
      var h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      if (resizeMode === 3 /* FitClip */ && worldWidth !== void 0 && worldHeight !== void 0) {
        const targetRatio = h / w, sourceRatio = worldHeight / worldWidth;
        const scale = targetRatio > sourceRatio ? w / worldWidth : h / worldHeight;
        worldWidth *= scale;
        worldHeight *= scale;
        this.camera.setViewport(worldWidth, worldHeight);
        this.context.gl.viewport((w - worldWidth) / 2, (h - worldHeight) / 2, worldWidth, worldHeight);
      } else {
        if (resizeMode === 2 /* Fit */) {
          const targetWidth = this.camera.viewportWidth, targetHeight = this.camera.viewportHeight;
          const targetRatio = targetHeight / targetWidth, sourceRatio = h / w;
          const scale = targetRatio < sourceRatio ? targetWidth / w : targetHeight / h;
          this.camera.setViewport(w * scale, h * scale);
        } else if (resizeMode === 1 /* Expand */)
          this.camera.setViewport(w, h);
        this.context.gl.viewport(0, 0, w, h);
      }
      this.camera.update();
    }
    getSafeDevicePixelRatio(cssWidth, cssHeight) {
      const dpr = window.devicePixelRatio || 1;
      if (cssWidth <= 0 || cssHeight <= 0) return dpr;
      if (this.maxCanvasWidth === 0 || this.maxCanvasHeight === 0) {
        const gl = this.context.gl;
        const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE);
        const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
        this.maxCanvasWidth = Math.min(maxRenderbufferSize, maxViewportDims[0]);
        this.maxCanvasHeight = Math.min(maxRenderbufferSize, maxViewportDims[1]);
      }
      return Math.min(dpr, this.maxCanvasWidth / cssWidth, this.maxCanvasHeight / cssHeight);
    }
    enableRenderer(renderer) {
      if (this.activeRenderer === renderer) return;
      this.end();
      if (renderer instanceof PolygonBatcher) {
        this.batcherShader.bind();
        this.batcherShader.setUniform4x4f(Shader.MVP_MATRIX, this.camera.projectionView.values);
        this.batcherShader.setUniformi("u_texture", 0);
        this.batcher.begin(this.batcherShader);
        this.activeRenderer = this.batcher;
      } else if (renderer instanceof ShapeRenderer) {
        this.shapesShader.bind();
        this.shapesShader.setUniform4x4f(Shader.MVP_MATRIX, this.camera.projectionView.values);
        this.shapes.begin(this.shapesShader);
        this.activeRenderer = this.shapes;
      } else
        this.activeRenderer = this.skeletonDebugRenderer;
    }
  };
  var ResizeMode = /* @__PURE__ */ ((ResizeMode2) => {
    ResizeMode2[ResizeMode2["Stretch"] = 0] = "Stretch";
    ResizeMode2[ResizeMode2["Expand"] = 1] = "Expand";
    ResizeMode2[ResizeMode2["Fit"] = 2] = "Fit";
    ResizeMode2[ResizeMode2["FitClip"] = 3] = "FitClip";
    return ResizeMode2;
  })(ResizeMode || {});

  // spine-webgl/src/LoadingScreen.ts
  var spinnerImage;
  var logoImage;
  var loaded = 0;
  var FADE_IN = 1;
  var FADE_OUT = 1;
  var logoWidth = 165;
  var logoHeight = 108;
  var spinnerSize = 163;
  var LoadingScreen = class {
    renderer;
    logo = null;
    spinner = null;
    angle = 0;
    fadeOut = 0;
    fadeIn = 0;
    timeKeeper = new TimeKeeper();
    backgroundColor = new Color(0.135, 0.135, 0.135, 1);
    tempColor = new Color();
    constructor(renderer) {
      this.renderer = renderer;
      this.timeKeeper.maxDelta = 9;
      if (!logoImage) {
        const isSafari = navigator.userAgent.indexOf("Safari") > -1;
        const onload = () => loaded++;
        logoImage = new Image();
        logoImage.src = SPINE_LOGO_DATA;
        if (!isSafari) logoImage.crossOrigin = "anonymous";
        logoImage.onload = onload;
        spinnerImage = new Image();
        spinnerImage.src = SPINNER_DATA;
        if (!isSafari) spinnerImage.crossOrigin = "anonymous";
        spinnerImage.onload = onload;
      }
    }
    dispose() {
      this.logo?.dispose();
      this.spinner?.dispose();
    }
    draw(complete = false) {
      if (loaded < 2 || complete && this.fadeOut > FADE_OUT) return;
      this.timeKeeper.update();
      let a = Math.abs(Math.sin(this.timeKeeper.totalTime + 0.25));
      this.angle -= this.timeKeeper.delta * 200 * (1 + 1.5 * Math.pow(a, 5));
      const tempColor = this.tempColor;
      const renderer = this.renderer;
      const canvas = renderer.canvas;
      const gl = renderer.context.gl;
      renderer.resize(1 /* Expand */);
      renderer.camera.position.set(canvas.width / 2, canvas.height / 2, 0);
      renderer.batcher.setBlendMode(0 /* Normal */);
      if (complete) {
        this.fadeOut += this.timeKeeper.delta * (this.timeKeeper.totalTime < 1 ? 2 : 1);
        if (this.fadeOut > FADE_OUT) return;
        tempColor.setFromColor(this.backgroundColor);
        a = 1 - this.fadeOut / FADE_OUT;
        a = 1 - (a - 1) * (a - 1);
        tempColor.a *= a;
        if (tempColor.a > 0) {
          renderer.camera.zoom = 1;
          renderer.begin();
          renderer.quad(
            true,
            0,
            0,
            canvas.width,
            0,
            canvas.width,
            canvas.height,
            0,
            canvas.height,
            tempColor,
            tempColor,
            tempColor,
            tempColor
          );
          renderer.end();
        }
      } else {
        this.fadeIn += this.timeKeeper.delta;
        if (this.backgroundColor.a > 0) {
          gl.clearColor(this.backgroundColor.r, this.backgroundColor.g, this.backgroundColor.b, this.backgroundColor.a);
          gl.clear(gl.COLOR_BUFFER_BIT);
        }
        a = 1;
      }
      a *= Math.min(this.fadeIn / FADE_IN, 1);
      tempColor.set(a, a, a, a);
      if (!this.logo) {
        this.logo = new GLTexture(renderer.context, logoImage, true);
        this.spinner = new GLTexture(renderer.context, spinnerImage, true);
      }
      renderer.camera.zoom = Math.max(1, spinnerSize / canvas.height);
      renderer.begin();
      renderer.drawTexture(this.logo, (canvas.width - logoWidth) / 2, (canvas.height - logoHeight) / 2, logoWidth, logoHeight, tempColor);
      if (this.spinner) renderer.drawTextureRotated(this.spinner, (canvas.width - spinnerSize) / 2, (canvas.height - spinnerSize) / 2, spinnerSize, spinnerSize, spinnerSize / 2, spinnerSize / 2, this.angle, tempColor);
      renderer.end();
    }
    drawInCoordinates(x, y) {
      if (loaded < 2) return;
      this.timeKeeper.update();
      const renderer = this.renderer;
      renderer.batcher.setBlendMode(0 /* Normal */);
      if (!this.logo) {
        this.logo = new GLTexture(renderer.context, logoImage, true);
        this.spinner = new GLTexture(renderer.context, spinnerImage, true);
      }
      const shiftedX = x - logoWidth / 2;
      const shiftedY = y - logoHeight / 2;
      renderer.drawTexture(this.logo, shiftedX, shiftedY, logoWidth, logoHeight);
      this.angle -= this.timeKeeper.delta * 500;
      if (this.spinner) renderer.drawTextureRotated(this.spinner, shiftedX, shiftedY - 25, spinnerSize, spinnerSize, spinnerSize / 2, spinnerSize / 2, this.angle);
    }
  };
  var SPINNER_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAACjCAYAAADmbK6AAAALKElEQVR42u2de2iW5R/GPzuqcwfnnKfNmafl5tTNHWzqNi3DEMQykcAoJSsySkspjSIk0iD/07Kf4R+FnVBDUTshZGpWUEJaaiWFgZlUFmXmIe3HNXthyebeZ77P9H13ffBG8Y8H7ut7vff93N/7fu4vGGPiFZiez/Qtw9lytJajfzfw9z/j+efPOv7cV8W+lUNY2a8T/ayTCRsWFLJA5rtUO1LLkV5p9LJeJizQiHeqnlOtmVFtdTGrrZkJCxYXsTgaI6r9MY4/UpNItW4mFDaXsTlaM6qVZlBq3UwofFrJp0HMWJ9DvXUzobCznJ1BzFjWlTLrZkJh/TDWBzFjTgo51s2EgnKI0Rrx+FiOWzNzVaym91Syx5qZsGBWb2ZFa0ZN6dbMhAWTcpkUrRmXD2K5NTNhgVbH0Zpxbl/mWjMTFvRIo0e0ZpzcncnWzISKtvmiMWNRJ4qslwmVXRXsas2Ix8ZwzFqZsGFREYtaM+Oaa1ljrUzYkJ9G/ok6TlzKjJWZVFor0y7c1Zu7WjLiqiGsskamXdHopyT4vALmzS9k/t19uHtKHlOSIMn6xAtARjIZ1sFcUSZ0Y4La+G6M18hS2IlCn4a+WoC0JNL0d/dUupdnUj40g6EJ2VEdMnhrOG/p5f/jUXz8SgmvaGU6KpNRNsLVQV0OdXf24s63h/P2gWoOrBjMCr2GJFQnnxnIM3q5P1PPmaYv+4ev4/C6UtbpV2gzXCkgL5W8Bwt48OIc6ul6Tp+s4+SyASxLiI4+PYCn1bHzDZxvaQW6vZzto7MYnQIpNkf7kp5EuozYUroqEjcNKHHd0Tl9mBPN1pk+hFeieGBnBtog7UXjsj9pWg+m6duecw2cay1OC/uxMC47KmP9OIYfoz1YoC20J/rzRG4quTZK2EAyJGs20qwUbYw0aNRmUxtvfUW/uEtNzc1NB1/X8LVyd15hh82F43AvD+VlXcsSJEZa1CQ3ejleAO7oxR3RDP0XN91X4+NXYb8nkv7UNTwV7e0YTdu7I3g33t7tuaEbNwSZpps2fSyvs4M2Tjhot+jb0Xzbltj8r5j/xVt/6Z1Ob93U1ZYO691EhhzchcHeXosVjcNZysyezLw4xRZt05R+fTeuj8vOj+zKyG0j2aZcVVs6v+QalnjrMFZASQYl2nBoSyz06e3j/Xk8rgWYmMvEICu2pm1HOTuc7okV8FgRj0XukwzanhvCc/F+72TjoQjdObN1OFuDLmh0xP+WHtxiI10ukJlCprb4guiv1fP+avZrS1C7NAkliHZjDtZwMMgqbukAltpMlwuMy2FcEBPqvfLLar5Uqi0hBdEwryy+Mv5n6zkbjTBa+dlMlwvUZFETZKGiFM7tvbhdJ3gSVRO0wzIjnxmvl/J6a6JsGMYGrahtpssFeqbR841S3mhN80OjOaSDEdqd6SjaMKgzgzRK7q1ib3PT9sYyNo7JZoyNFNvRcVMZmy7WOvIuryv/Zvdmdt90+nY0bRp3AvROohFwdwW7dTG7RFlbwlqdrbOBYg005NAQmZU0HWt1rXMBH1Xw0dQ8pmqzoaPmdhun7bHZjNVe9qP9eFQfO1VkUmHjhAVUZ1GtnKFSbjrkrPfy4i4UW5t/6ZxM54J0CqxFe81KpGsQyE4h23oYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjLna+bdOy+IiFquIpGq16Pb79cNYv3IIK/X/ugx+Ui6TVKvYVU9Nc8gX8od8Ir/IN/KPfCQ/yVfyl/6/pfJvLChkQdD6wyqntquCXYuKWJSfRr6D0dEAxV3xlw/khyD+kd/ku/88cHo+09tS3LBpO1HHCVUqcIA6CqB4K+6X6x35L/JM2loXurlWmUmlA5XogOIcK8/If5HncrSWo7F6cKIWPjT/RXGOlWfkv8hzaWsN4uaaysE6WIkOKM6x8oz8F3kusXqo2vxC5jtYiQ4ozrH0TeS5qIZcrB7qkrwdA8U5Vp6R/yLPZV8V+2L14Cl5THGwEh1QnGPlGfkv8lyUlIzFQ1cNYVVHrcjZ0VCcFe9Y+Eb+izy3ceclUl43aFN52DXXssYpnY6a4qFS8ZcP2uIf+e7inRh6pdFrdTGrm8uiHx/L8T2V7NGWzvJBLJ/bl7mTuzO5qBNFDoiJID/IF/KHfCK/yDfyT3O7d/KbfNfS80hNIrU0g9L6HOq1x5iTQo6FNpeLfCQ/yVfyl3xmXYwxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHGGGOMMcYYY4wxxhhjjDHNk9z4JwJ0SqKTdQkbyEwhU393T6V7zzR6pieR3tE1ITeVXImhe6BXDGZFdRbVeank2TBhcaEMr0rwbixj49IBLL2/L/ffmMuNHfqO9tFZjJYBd1ewO3Lx+IcVfKhqna5nHZYR6XFPH+5R3eeI5t9fx/fvjeC9Jdew5OKZKqFR/RDVKL6vL/f9PJafmyvHsL+a/ff24V6NmjZQbGchVbY6UM2BluqHv1rCqzVZ1KQlkZboepCdQvacPsz5bjTfXao+yMEaDt7Wk9tSIMVGig3TejCtJSM2bSpkPjWPqd1S6Zao+lORSYWmgkOjORRNwZqd5ezMSiHLRooNr5XwWjS6/1XHX9vL2T67N7M1iyXa9JCrYjVrS1gbpJyw6hBfsmiNCYT0P9/A+Wj1/6qGr5YNYFlJBiWJogEzezLz/ZG8/9s4fgtSyuvNYbyp1IONFBtu7sHNv4/j9yAxUHWrdaWsG9+N8XHd+YxkMpSy+aySz841cC5oXbmHCnnI74yxAgZ3YbDeB4PEQCOpBpFNZWwa2ZWRcdnxLsl00crtRB0n2lLg8JNRfDKoM4NsolgBSmw/UMADba1+qpmqfyf6x1u/0a/og3I+aEunP6/i86osqmygcGarF4p54dex/Bo0LqfqOfVwIQ/HW5/RSkwV1oN2WLlHTc82TljAwM4M1O5LWwYKZTjibYXNS0N5KcjKTe10PadfLObFuJwK4ozp+UzXDBTUjL+M5ZcBnRkQV53dMIwNQTu6bSTbVEzbi5awuVByd2E/FgaN0Tc1fKOzBHHV2aAdVSdv6s5NNkp7cSH/++xAng2yyHx+CM/H21YhfdPp+0U1X0TbSZnXx8faG9Aop0MS0cToh1p+iLcpOkLj9t/JOk5eqoPHxnDsyf486an5yqCDK7XZ1O4oZ4dWyy3FSXHUAYq47uyYbMZoGmhpG3DlEFb6uNiVBhpyaHhnBO8oJmfqOROJjzIiP43hJ8UxITqqX56S2Hur2KsOnq3nrE6PPNKPRwrSKbAZrjTQNZmuE7oxYXMZmxWbw9dxWFu4W4ezVedOE6qzI7oyYkY+M7TPeWsPbk2UX1qioSN+E3OZqOR2cReKE+qQRFN0Pi7y73g/UawU1KzezJpXwLz5hczX1ueUPKYkNb6GJQZ+j7/aAfRZREsv+quGsMoamXZBW2Gt5eU0alorEzYsKmJRa/m4NdeyxlqZsCGa84DKnVorEzboC7podis69DfIJmwufHMc7famvvmxZiYsKOtKWbRm1OcW1syEBboSJFozLh/EcmtmwgIluaM14/phrLdmJixYXMTiaM24p5I91syEBTphFOR7Y2tmwgJNvUFOr+tov3UzoaAv44KYUatv62ZCoemdhtG0+hzqrZsJBR08DWLG0gxKrZu50qvpxos3U5NItW4mFPp1ot+lPlpq2lYXs9qamVBZUMiC1ox4pJYjvlfStAu6GmTLcLboMtPIV4/6im5fFfuUi9QIap2MiWP+D96R1vPmsD/fAAAAAElFTkSuQmCC";
  var SPINE_LOGO_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKUAAABsCAYAAAALzHKmAAAQ7klEQVR42u3da4xdVRUA4D0zd2Y6nZY59DVtZ1puS9+lzC0YAi2UQ8AAQczFpPgA9VIeIQbirRqJ0cBUBVGjDr/QCKSNRSMmpuODxAdxqhgwxkhFjf6Sxh/+UUNVNGJCzR7uTvas7LXX2q9zzp3em6y0gTN3Zu75utZe5+yztxC9V+/Ve5X9En1Vjd7J6SFbLNF7naPw+l2jh7YHMBWssqMHtlsRdim4qsLtIawaPiHEQOLoNrA9iIkQDnRrVA1qD2LZ8ISoxYqKo13sQAtBWBayQWZUAXGRQM9JjCngDVY0UqJNDbQrMcaGmArdUKpIjbYiQLsCZCyIMQBy8QwnilR4Q5AuCpxFYvRFmBLbEiwKwpsSaWycVQGZBKMrwBjA9BhxDe57u2L2hOoKNCbOrgAZitEVYUxoKSMErQvSxYIzCkguRg5EF4AUhqUlhy/YUKSxcRaKsioYOQhD4I0yYxkR3PcJBcuFysmgsXAWBTMJyBCMIQh9kGGxXIXvexCQXbHGAMrBWTbM2CCpMSMLIxehC77lSJwXGth7M0FzoVJIXXDWQnGmhOkL0ic7YhhtWdGGkAuPAjUWGoF4faCmwBkbZmyUqUCyMqMLRA4+E6IsdTjidUHKBYrh9CnpRcH0ypKxsyOGEYNIIeTCOz91OIJ1QYoB5eAMyZo+MFNnyVTZ0YiRC9EGEMOyAgshxErHsL2XK1gOUgwohtM1a5YNM7Rsu4K0ZkcbRm4mpPBRwFZ5hg9eCqkrUB+csWGGogzNkqEgrdnRhpGLkINudaLgwvVB6oqzCjCTZElb2Y4B0gUjBtEG0ARnDRLjjoG9DwcshtQGlIPTljVjwUySLWNkyRCQVHa0ZUUTRAwgF91a33BEy0VKAcVwwqwZC2bqbOlUurllOxQkJzNyINoAYqjWhYYjWg5SCiiG05Q1U8FMjTIoS8YE6YORi1BHtJ4KIcQEEtTXUWAxpK44YVlPBdO1jCdFWTZIE8bVGEYMIRPcZGBw4HKQcoBiOE1ZMzbMgVQwU6JMAdKEEcuIJogUvg1YCCE2gsCO42DlIIVAKZwpYJaSLVNnSU6XjYHUmxhTmXaFaMO3EYkLqMC+FsLlIoVAKZzMrEnBhJeLfLNlKMrYWRIDCbOkFSSVHbHM6AKRC6/ODUewNqQ+OLlZkxpjUmV8MBbMUJSxyzY3Q1IgTRgxiBRCHdem0KDAUkBh9sRwwjEnAXMMgTnKhFlUtiwkS5rGka4g9SaGgxFmRC7AzTCEEBcyA36dDSsXqAtOLkysjGMwY5XxVChjZ0kuSCo7YlkRQsQQYtDEFsegsLoCxUp7Kpgps2UslFGzJGccSYHUmxhOZqwzEZqAbfUMCisHKIZzgsCpl3MTzMwTpi1bYp2477gyFKUxS7qWbdjY2EBS2dGE0QQRA7gNCyHEdhjE8RhUDlBT9tzgmjWZMFNlSy+Urk1OzCyJlW0XkK4YOQh1cDtcgwBrQmoDWkdgboBZE8mYsJSHlnFbJ+5bwmOPJ7lZkirbC8aRsMvmgtTHjBhGE0QbwJ2egUE1ITVlUC5OmDVdYNrKuN70xM6WoShjlW4464dbtiFIWK6x7GjESEHUUe0iYncnbMdQSE0Z1ITTNOb0hRmjjLtmS9dmJ2rp1jtuKktyyrb6YLEMCUHq2dGG0QQRQ7f72kzc+cJecerne8Wvv7JNPHPvenEkz8Sh3UtFc92QyGt9Yko/HgOLAIUZlItTz5ouMF3KuE+2jFLCQ1D6lm6fLMkBacuOJowYRBUXyfjuHjF3NhdnsfjvAfH6E9vFt9XxKgikEKgJZyyYalzOLeMu2bLbULI6bh+QGwmQ+rgRlumdGEQAao+K56bEL2woVUwOiev0r8OAUjiJrMmFCbvykGxZRAmPitK1dHM7bohyMsuyi/I8f0+e57fJYIKEZXpXo9E4mOf5XTKyLLvCBLETF8uY2SKepkC+dpX4T02Ivepr4HvZcOZ5fmee54fyPL+DmTUhzAs6n4n8bN5dr9f3YdkSg8nsxG0lPBVKVpNjG0/aGhzfLDmRZdnumZmZp8+c+cdZPV555fSr7Xb7s0jJ3i5Pcue4MxKkPPkvvXTqz/B92u32l0wYOzG1fkhcd/py8Rcbyq/vFM/KY1WA95h/3zzP71bfU6JsNpsfgj+P/FlbrdaDGExYyuXvLz8H+DudODH700ajcSM3W6Yu4alQ1spCOTd38jcKocTZbh9+9NixY99XJ8AEUkcpo9W64yH197m5k7+bnZ19QT+J09NHntQhwji/Jg58qi6++ofLxJ8gSFneVw2Ka4QQDfh1Ok4dZavVmtZ/nrm5k7/Vf55O1tRhboUw5+ZOvqyOl5+R/FyOHj32PYVU/tloNG5IXcKrhJIzngwp3fNjomazea/64BuNxts646f50lWv169utw9/DmtqdJQyZFaSJVuV6nq9fqMEof5/vV6/CYBqgJDlee+yAbF/+4i4ZWqZeNfaIfHWzn+Hx0KcEuU9+s8jv3ej0bhVlXOZydX/k0iRMeb8P0D5e6tj8zy/Xb9UJIc56h/yqVOnXul8lmuZ2bJslKmbHG7XrbpCmCXFRLvdfqQD6jTS3Jiy5I4OykM6ADV+1Eu1DmV6evopBORexzDi1L+X/HnGxsb2w3Hm9PSRJ9QxWPOTZdmlKht2hi+w6dkox5bqffI8fye3hDteGqKaHVsHXihKl0tB+h0cY+lute54AGRKDCW89LNTRynHb7ChUWVVjetOnJh9EYBUyPZeNCoOtsbFQwdXi4/esELcd+tq8cCHJ8UXp+viy9efLz7AgamjlKXc1AA1m83DoIRDlFubzeb96hhZLVTlgJ24gttutx+ONa50bHZKRenaeTs1OfpAfnr6yOOdE7EZdNwmlKocntXLNkA5JTGq47Ds+Lf94lWsyfnXleLfnIwJUN4DOnNYwuUxh2A3Ln9XULrfK8t3J27Tu3BVwiOjXJqoAy8UZej1yclGo3GTLN+gu3w+z/P3YaWbQqk3Ne12e4ZC+c8rxWsYytcPiP9RpZxCqWDKnxOiBNlyAUpOnGsoh4tA2Rm8X9xqtT6md5wyZmYe+0YRKL+1S/wYQ3n8zctBl5SBUv5djivfjMOPduIzcizeiYfr9foVvUwZG+XCuzibZKnSceZ5/v4QlKp8y7ElhnJlTeTP7BI/kllRYfzrfvHqFy4UX1vaL/aVlSmROzwbwdS29T2UcEwZF+V8ozM2lu1VY812u/15akypGh3TmFJesJbHHD167IdUxz3YJy5bNySuX1mbvy55CbMLtzU6tjGlsdFptVqfUMc0Go23F4wy1l2dSnbfvpMwVPe9WWVLDsrOJaF9MFu2Wq1PqmNkGce67xiXhTjdNwdlvV6/BgxfbPfBfVCetxi6b9/rlCup65QzM48dl2OjLMv26CibzeZ96sTIzEFdpwQXz9U1yrtVlpR/Zll2Fec65Y6l4pbbx8XHH9kknvzJlPjlHy8Tp29eKT5ou0aJoIT3w3dBlLDzVpfAJEZ1XOdaJZxnOSlvPMjPzxFljIvng914RwebsjYO7uhMyHu46sOfnf3Oz2TXDW6vvYxdFoIXz3Wc8J5zs9n8iOn2IrxTc2BM3Glqdp7dI553uaOjxrhwcob+MyuUpjs6WZZdon8OcigjPx8V+u+GTWFTSWEx3WYcdJ225jNDSE4q0GHCzlueHOyujn6bUWYgeb9ZZUaQPe+GzQ+Gc8+oOGhC+c1d4gfI16n3XDAhQ7+9qE9l01E2Go132GYKyXE1NiFDTcpoNpv3LOYJGWXNErJNW9sEp63p2RKiVPMn1bS1DgxsyhoGdGpmizj+xtXiDYnx7/vFmce3iWdW1cTVGEY4hQ2ZW0nNq8Qm/M6XbXm3S100lwGedFybuvNOibLI+ZS2ceU4eAxiEuvCkfmU8ycToDxETe6FgCBQHeqyAbFvfEhcO7BwDuXFCEbTZF840XeHK0jYcbs2OIGle0mVJ/mmnClEPQqxyTY5I8/zFhif7fSZee4bnrPOU4AssnRXHaVTCTd14dRDY3UbTIiSeFhsN/aMjgnqthFx880rxX3yATL5p3y4LPXzOaBkUyBjZMlYpbtQlIOBD475ZEusjMNSvkXe6VEoJVDkeZ2dzIfIFsRzU+JF2OyM9M9fTC/6SUYOyFQPjQ2nWiUjxnPfw5EeHqMWIqAeIFsAU847lJM2JM6xsewt1OIDLs99P7ZFHNdB/upS8XtPiD7PfLuCXJNolYyyFiNI/Zit65ItrOVafFbHcFohY7hPTN21Tjz4uc3iqfsnxKdX1MTl1OoYRFaMsToGB6Trw2JFP/OdZC2hJZ7ZkrMoAbbSGmelDJ91hFKuJeS7jlBMkJnrAqqJlgMUZS/dArPlGHNdSg5M3xXXtvquuEatvIYtDRhpxbUJuIgqsU5lGWtUploK0KuEU9mSW8YpmFQ556xNuYW7NiW13B+FkMiKHIy+C6eGgBxJvMR0oSv5hi6+z4HJyZoU0M2RVvDlrOQbcxVfX5AhZbuqy0v7ZstYMLHlAVlLTF9ALLbvu9Y5Zylpn/XOsd0ibIvxr2KCLHpp6SCUIdnSZSF+WzfOhem6GD+1KwR3Z4jNjrtDpNoZwmWd8yrupZN6Hx3fbMmFSe0Swdq2ZIPjxk1112Duo8OBGLrBkw/IoncdK2XHsdC9dHz204m50xh3tzFq1zFqtzHXrfCw7OgDsqyNnZLszVijsmXgrmNcmGtS78lIoMX2aJz03fKO2sDJddPQSCDPiQ1DfWBycY6XtXstc2PQKuxgG2McmXTPb9/9vmuJYXKyJrWjbeg+3xPM4O73nWqvbyw7xgZZSJbEUBa157cNJjdr2vb+5iA1YV3HxYscj30PDCEHIgcjtfm8K8hSsmRotkwFk5s1TTghUAopB6xrjHMBBkI0YYTZ0dZlxwLpkiWDULpmy5gwqayZgZNkA7oKQQCxctByYg0XIIEQQuRitGVHblMTA2ShKGPDpC6wu+DEgJqg2rDGDBtAF4Q6RAojp1xXGmSMbImVcR+YWNY04eQCtUG1ofUJ2/uvcETIgUhhdAE5GAlkKShjwHTNmhhODKgJqQ2sC14uOgyfD0IbRF+MlQaZAiZWyn2yJsTJATqGnHQO2Jhh+xlsACFCG0QbRtdyzQFZCZSxYPpmTS7Q5cjJHYNBYIkZpu99HoUQ/o4QIYSIZUZfjJ4ZMjZI32wZBDMU5yhy8pZTULl4XYP5fagMyEVoy4oupTpGduwnkloSlKEwY+AcQU4MhRTD6ovXBRwFzwWgCSEF0QVjJUGmgEllTS5OLlCIlIN1mS9mx/cZ5eLDALpCTI2RAhkTZQqYoTgpoCPECbaBHQ2ETL3PUl98ECAXYijG0OyYAmQoTG7W5ODkAF1CnVgm2JQx4okPA+gCMTbGskBGgRmaOblAh5GTORIrfKFx4VH4EIAxIXIxlg2SBbMvECY3e7oApbDaIgQu5/2HmeEKEINYiwSRi7EQkLFgumZOCuggctKGI4ULZN/vMeSLj0AYMytWEqMLzFg4fYDaoKaC6wvOFR4FkIPQFaILxrJAOsHsc/zlfYDWXE8qF22s8Pz5KHxcgEVALBtjJXBSSEOwFhk1Zgy4hitCT4hVw+gFs8/zwxqIBbUgyK7fcyA0PD9XX4iVxhiC0xdof6STWCsoBmKF7+cVCWFXQYyBMxRpf+STX1b0x45AhN0OMSrOGEirhrY/dfQAdjvS7oy+WCF6r1RIFxXWvlTRg1YVqFWBmxZbD99ig9pt0YPQw9rD1nstVri9V+/Ve3XrS/wfim4P5fIFxLoAAAAASUVORK5CYII=";

  // spine-webgl/src/SpineCanvas.ts
  var SpineCanvas = class {
    /** Constructs a new spine canvas, rendering to the provided HTML canvas. */
    constructor(canvas, config) {
      this.config = config;
      if (!config.pathPrefix) config.pathPrefix = "";
      if (!config.app) config.app = {
        loadAssets: () => {
        },
        initialize: () => {
        },
        update: () => {
        },
        render: () => {
        },
        error: () => {
        },
        dispose: () => {
        }
      };
      if (!config.webglConfig) config.webglConfig = { alpha: true };
      this.htmlCanvas = canvas;
      this.context = new ManagedWebGLRenderingContext(canvas, config.webglConfig);
      this.renderer = new SceneRenderer(canvas, this.context);
      this.gl = this.context.gl;
      this.assetManager = new AssetManager(this.context, config.pathPrefix);
      this.input = new Input(canvas);
      if (config.app.loadAssets) config.app.loadAssets(this);
      const loop = () => {
        if (this.disposed) return;
        requestAnimationFrame(loop);
        this.time.update();
        if (config.app.update) config.app.update(this, this.time.delta);
        if (config.app.render) config.app.render(this);
      };
      const waitForAssets = () => {
        if (this.disposed) return;
        if (this.assetManager.isLoadingComplete()) {
          if (this.assetManager.hasErrors()) {
            if (config.app.error) config.app.error(this, this.assetManager.getErrors());
          } else {
            if (config.app.initialize) config.app.initialize(this);
            loop();
          }
          return;
        }
        requestAnimationFrame(waitForAssets);
      };
      requestAnimationFrame(waitForAssets);
    }
    context;
    /** Tracks the current time, delta, and other time related statistics. */
    time = new TimeKeeper();
    /** The HTML canvas to render to. */
    htmlCanvas;
    /** The WebGL rendering context. */
    gl;
    /** The scene renderer for easy drawing of skeletons, shapes, and images. */
    renderer;
    /** The asset manager to load assets with. */
    assetManager;
    /** The input processor used to listen to mouse, touch, and keyboard events. */
    input;
    disposed = false;
    /** Clears the canvas with the given color. The color values are given in the range [0,1]. */
    clear(r, g, b, a) {
      this.gl.clearColor(r, g, b, a);
      this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    }
    /** Disposes the app, so the update() and render() functions are no longer called. Calls the dispose() callback.*/
    dispose() {
      if (this.config.app.dispose) this.config.app.dispose(this);
      this.disposed = true;
    }
  };
  return __toCommonJS(index_exports);
})();
