import {PiRegister} from ".";
import {pihanga as logger} from "./logger";
import {CardAction, ReduceF, ReduxState} from "./types";

const ns2Actions: {[k: string]: boolean} = {};

/**
 * Register a set of actions for a particular namespace.
 *
 * The 'actions' parameter is an array of local action
 * names which will be converted into a hash where the local name
 * is the key and the value is of the pattern 'namespace:name'.
 *
 * The function returns the hash registered under this namespace.
 *
 * @param {string} namespace
 * @param {hash||array} actions
 */
export function registerActions<T extends string>(
  namespace: string,
  actions: readonly T[]
): {[S in Uppercase<T>]: string} {
  if (ns2Actions[namespace]) {
    logger.warn(`Overwriting action namespace  "${namespace}"`);
  }
  const ah: any = {};
  actions.forEach((a) => {
    ah[a.toUpperCase()] = `${namespace}/${a}`;
  });
  logger.info(`Register action ns "${namespace}"`);
  ns2Actions[namespace] = true;
  return ah as {[S in Uppercase<T>]: string};
}

export function actionTypesToEvents(actionTypes: {[k: string]: string}): {
  [k: string]: string;
} {
  return Object.entries(actionTypes).reduce((p, el) => {
    const [k, v] = el;
    const n = k
      .split("_")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join("");
    p[`on${n}`] = v;
    return p;
  }, {} as {[k: string]: string});
}

/**
 * Return a function to more conventiently register a
 * reducer function for 'actionType'.
 *
 * @param {string} actionType
 * @returns a function to register a reducer for 'actionType'
 */
export function createOnAction<E>(
  actionType: string
): <S extends ReduxState>(
  register: PiRegister,
  f: ReduceF<S, CardAction & E>
) => void {
  return (register, f) => {
    register.reducer.register(actionType, f);
  };
}
