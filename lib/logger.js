// lib/logger.js
const isDev = process.env.NODE_ENV === "development";

// Enable/disable logs per component
const ENABLED_COMPONENTS = {
  Kitchens: false,
  KitchensNearest: false,
  Menu: false,
  // MenuComp: false,
  FoodSwap: false,
  OrderSummery: false,
};

// Colors for log types
const COLORS = {
  info: "#3b82f6",
  success: "#10b981",
  warn: "#f59e0b",
  error: "#ef4444",
  debug: "#8b5cf6",
  api: "#06b6d4",
  db: "#f97316",
  data: "#fcba03",
};

function getCallerFileAndLine() {
  const stack = new Error().stack;
  if (!stack) return "unknown";

  // Split stack trace into lines
  const lines = stack.split("\n");

  // Find the first line that's NOT from logger.js
  // Typically: [0] = "Error", [1] = getCallerFileAndLine, [2] = log function,
  // [3] = logger.info/success/etc, [4] = YOUR CODE
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    // Skip if it contains 'logger.js' or is internal
    if (line.includes("logger.js") || line.includes("node_modules")) {
      continue;
    }

    // Try to extract file and line number
    const match =
      line.match(/\(([^)]+):(\d+):(\d+)\)/) ||
      line.match(/at\s+([^:]+):(\d+):(\d+)/);

    if (match) {
      const fullPath = match[1];
      const fileName = fullPath.split("/").pop().split("\\").pop(); // Handle both / and \
      const lineNumber = match[2];
      return `${fileName}:${lineNumber}`;
    }
  }

  return "unknown";
}

function getCallerFunctionName() {
  const stack = new Error().stack;
  if (!stack) return "";

  const lines = stack.split("\n");

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes("logger.js") || line.includes("node_modules")) {
      continue;
    }

    // Match function names like "at functionName" or "at Object.functionName"
    const match = line.match(/at\s+(?:async\s+)?(?:\w+\.)?(\w+)\s+\(/);
    if (match && match[1]) {
      return match[1];
    }
  }

  return "";
}

/**
 * Create a logger for a specific component
 * @param {string} componentName
 */
export function createLogger(componentName) {
  const isEnabled = ENABLED_COMPONENTS[componentName] !== false;

  const log = (type, color, ...args) => {
    if (!isDev || !isEnabled) return;

    const timestamp = new Date().toLocaleTimeString();
    const fileInfo = getCallerFileAndLine();
    const fnName = getCallerFunctionName();
    const fnDisplay = fnName ? `${fnName}()` : "";
    const prefix = `%c${type.toUpperCase()} ► ${fileInfo} ► ${componentName} ► ${fnDisplay} ► `;
    const style = `color: ${color}; font-weight: bold;`;

    console.log(prefix, style, ...args);
  };

  return {
    info: (...args) => log("info", COLORS.info, ...args),
    success: (...args) => log("success", COLORS.success, ...args),
    warn: (...args) => log("warn", COLORS.warn, ...args),
    error: (...args) => log("error", COLORS.error, ...args),
    debug: (...args) => log("debug", COLORS.debug, ...args),
    api: (...args) => log("api", COLORS.api, ...args),
    db: (...args) => log("db", COLORS.db, ...args),
    data: (...args) => log("data", COLORS.data, ...args),

    state: (stateName, value) => {
      if (!isDev || !isEnabled) return;
      const fileInfo = getCallerFileAndLine();
      console.log(
        `%c[${componentName}] [${fileInfo}] State Update: ${stateName}`,
        `color: ${COLORS.debug}; font-weight: bold;`,
        value
      );
    },

    fn: (fnName, ...args) => {
      if (!isDev || !isEnabled) return;
      const fileInfo = getCallerFileAndLine();
      console.log(
        `%c[${componentName}] [${fileInfo}] Function: ${fnName}()`,
        `color: ${COLORS.info}; font-weight: bold;`,
        args.length > 0 ? args : ""
      );
    },
  };
}

// Default app logger
export const logger = createLogger("App");
