import { TData } from './dataItem';
import { TVariable } from './stateManagement';

export type TApiResponseOption = 'jsonBody' | 'statusCode' | 'succeeded';
/**
 *
 * This is type of node to render in action flow
 * @enum ACTION_FC_TYPE
 */
export enum ACTION_FC_TYPE {
  ACTION = 'action',
  CONDITIONAL = 'conditional',
  CONDITIONAL_CHILD = 'conditionalChild',
  LOOP_OVER_LIST = 'loopOverList',
  LOOP = 'loop',
}

/**
 *
 * This is type of execute action
 * @enum ACTION_TYPE
 */
export enum ACTION_TYPE {
  NAVIGATE = 'navigate',
  API_CALL = 'apiCall',
  UPDATE_STATE_MANAGEMENT = 'updateStateManagement',
  CONDITIONAL_CHILD = 'conditionalChild',
  CONDITIONAL = 'conditional',
  LOOP_OVER_LIST = 'loopOverList',
  LOOP = 'loop',
  CUSTOM_FUNCTION = 'customFunction',
  FORM_STATE = 'formState',
  MESSAGE = 'message',
}
export type TSourceValue =
  | 'combineText'
  | 'appState'
  | 'globalState'
  | 'apiCalls'
  | 'dynamicGenerate'
  | 'apiResponse'
  | 'conditions';

export const TTypeSelectValues = [
  'parameters',
  'appState',
  'componentState',
  'globalState',
  'apiResponse',
  'dynamicGenerate',
] as const;

export type TTypeSelect = (typeof TTypeSelectValues)[number];
export type TActionSelect =
  | 'navigate'
  | 'apiCall'
  | 'updateStateManagement'
  | 'conditionalChild'
  | 'conditional'
  | 'loopOverList'
  | 'loop'
  | 'customFunction'
  | 'formState'
  | 'message';
export type TActionFCType = 'action' | 'conditional' | 'conditionalChild' | 'loopOverList' | 'loop';
export type TStatusResponse = 'success' | 'error';
export type TOperatorCompare =
  | 'equal'
  | 'notEqual'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual';
export type TTriggerValue =
  | 'onPageLoad'
  | 'onClick'
  | 'onEnter'
  | 'onMouseDown'
  | 'onChange'
  | 'onSubmit'
  | string;
export const OPERATORS: {
  name: string;
  value: TOperatorCompare;
  char: string;
}[] = [
  {
    name: 'Equal',
    value: 'equal',
    char: '=',
  },
  {
    name: 'Not Equal',
    value: 'notEqual',
    char: '#',
  },
  {
    name: 'Greater Than',
    value: 'greaterThan',
    char: '>',
  },
  {
    name: 'Less Than',
    value: 'lessThan',
    char: '<',
  },
  {
    name: 'Greater Than or Equal',
    value: 'greaterThanOrEqual',
    char: '>=',
  },
  {
    name: 'Less Than or Equal',
    value: 'lessThanOrEqual',
    char: '<=',
  },
];

export type TActionVariable = {
  firstValue: {
    variableId: string;
    typeStore: TTypeSelect;
  };
  secondValue: TData;
};

// API call action configuration
export type TActionApiCall = {
  apiId: string;
  apiName: string;
  variables: TActionVariable[];
  output: TData;
  status: TStatusResponse;
};

export type TActionUpdateStateVariable = {
  firstState: TData;
  secondState: TData;
};

export type TActionUpdateState = {
  update: TActionUpdateStateVariable[];
};
export type TActionFormState = {
  update: { name: string; value: TData }[];
  unregister: { name: string }[];
  reset: {
    value: TData;
    type: 'object';
  };
  option: 'update' | 'unregister' | 'reset';
};

export type TActionNavigate = {
  isExternal: boolean;
  isNewTab: boolean;
  url: string;
  parameters: TVariable[];
};

export type TConditional = {
  label: string;
  isMultiple?: boolean;
  conditions?: string[]; //action ids
};

export type TConditionCompareValue = {
  firstValue: {
    variableId: string;
    typeStore: TTypeSelect;
    value: string;
    returnValue: string;
    optionApiResponse: TApiResponseOption;
    jsonPath: string;
  };
  operator: TOperatorCompare;
  secondValue: {
    variableId: string;
    typeStore: TTypeSelect;
    value: string;
    returnValue: string;
    optionApiResponse: TApiResponseOption;
    apiResponseSuccess: boolean;
    jsonPath: string;
  };
};

export type TConditionalChild = {
  id: string;
  parentId: string | null;
  label: string;
  name: string;
  conditionField: 'firstValue' | 'secondValue';
  type: 'compare' | 'logic';
  logicOperator: 'and' | 'or';
  fistCondition: string;
  secondCondition: string;
  compare: TConditionChildCompareValue;
};
export type TConditionChildCompareValue = {
  firstValue: TData;
  operator: TOperatorCompare;
  secondValue: TData;
};
export type TConditionChildMap = {
  label: 'if' | 'else' | 'elseIf' | 'loopCondition';
  childs: { [key: string]: TConditionalChild };
  valueReturn?: Omit<TVariable, 'key' | 'id'>;
  isReturnValue?: boolean;
};

//#region  loop

export type TActionLoop = {
  option: 'while' | 'overList';
  while: {
    condition: string;
  };
  overList: {
    condition: string;
  };
  next: string;
};

export type TActionLoopOverList = {
  label: string;
  list: TData;
  startIndex: TData;
  endIndex: TData;
  stepSize: TData;
  reserverOrder: boolean;
};
export type TActionCustomFunction = TData['customFunction'] & {
  output: TActionApiCall['output'];
};
export type TActionMessage = {
  option: 'show' | 'destroy';
  content: TData;
  duration?: number;
  status: 'success' | 'error' | 'info' | 'warning';
};
export type TAction<T = unknown> = {
  id: string;
  parentId: string | null;
  next?: string;
  name: string;
  fcType?: TActionFCType;
  type?: TActionSelect | undefined | null;
  data?: T;
  delay?: number;
};
export interface Arg {
  name: string;
  index: number;
  type: string;
  isList: boolean;
}
export type TTriggerActionValue<T = unknown> = {
  data: Record<string, TAction<T>>;
  name: string;
  label: string;
  args: Arg[];
};
export type TTriggerActions<T = unknown> = {
  [key in TTriggerValue]?: TTriggerActionValue<T>;
};

export type TActionStateManagement = {
  id: string;
  variable: string;
  valueChange: unknown;
};
