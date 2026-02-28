import {
  insertEdge,
  insertEdgeLabel,
  markers_default,
  positionEdgeLabel
} from "./chunk-53P3UUFG.js";
import {
  insertCluster,
  insertNode,
  labelHelper
} from "./chunk-4EOMMTBT.js";
import {
  interpolateToCurve
} from "./chunk-P5TFCSCO.js";
import {
  common_default,
  getConfig
} from "./chunk-6PZNOABS.js";
import {
  __name,
  log
} from "./chunk-JXQHRPWL.js";
import {
  __async
} from "./chunk-5PDL3II3.js";

// node_modules/mermaid/dist/chunks/mermaid.core/chunk-N4CR4FBY.mjs
var internalHelpers = {
  common: common_default,
  getConfig,
  insertCluster,
  insertEdge,
  insertEdgeLabel,
  insertMarkers: markers_default,
  insertNode,
  interpolateToCurve,
  labelHelper,
  log,
  positionEdgeLabel
};
var layoutAlgorithms = {};
var registerLayoutLoaders = __name((loaders) => {
  for (const loader of loaders) {
    layoutAlgorithms[loader.name] = loader;
  }
}, "registerLayoutLoaders");
var registerDefaultLayoutLoaders = __name(() => {
  registerLayoutLoaders([{
    name: "dagre",
    loader: __name(() => __async(null, null, function* () {
      return yield import("./dagre-6UL2VRFP-ZCQVW7W2.js");
    }), "loader")
  }, ...true ? [{
    name: "cose-bilkent",
    loader: __name(() => __async(null, null, function* () {
      return yield import("./cose-bilkent-S5V4N54A-KNM5FGAK.js");
    }), "loader")
  }] : []]);
}, "registerDefaultLayoutLoaders");
registerDefaultLayoutLoaders();
var render = __name((data4Layout, svg) => __async(null, null, function* () {
  if (!(data4Layout.layoutAlgorithm in layoutAlgorithms)) {
    throw new Error(`Unknown layout algorithm: ${data4Layout.layoutAlgorithm}`);
  }
  const layoutDefinition = layoutAlgorithms[data4Layout.layoutAlgorithm];
  const layoutRenderer = yield layoutDefinition.loader();
  return layoutRenderer.render(data4Layout, svg, internalHelpers, {
    algorithm: layoutDefinition.algorithm
  });
}), "render");
var getRegisteredLayoutAlgorithm = __name((algorithm = "", {
  fallback = "dagre"
} = {}) => {
  if (algorithm in layoutAlgorithms) {
    return algorithm;
  }
  if (fallback in layoutAlgorithms) {
    log.warn(`Layout algorithm ${algorithm} is not registered. Using ${fallback} as fallback.`);
    return fallback;
  }
  throw new Error(`Both layout algorithms ${algorithm} and ${fallback} are not registered.`);
}, "getRegisteredLayoutAlgorithm");

export {
  registerLayoutLoaders,
  render,
  getRegisteredLayoutAlgorithm
};
//# sourceMappingURL=chunk-QJL7DHEO.js.map
