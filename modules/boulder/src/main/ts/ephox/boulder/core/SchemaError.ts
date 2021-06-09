import { Fun } from '@ephox/katamari';
import { SimpleResult } from '../alien/SimpleResult';
import { formatObj } from '../format/PrettyPrinter';

export interface SchemaError {
  readonly path: string[];
  readonly getErrorInfo: () => string;
}

const nu = <T>(path: string[], getErrorInfo: () => string): SimpleResult<SchemaError[], T> => {
  return SimpleResult.serror([{
    path,
    // This is lazy so that it isn't calculated unnecessarily
    getErrorInfo
  }]);
};

const missingStrict = <T>(path: string[], key: string, obj: any): SimpleResult<SchemaError[], T> => {
  return nu(path, () => 'Could not find valid *strict* value for "' + key + '" in ' + formatObj(obj));
};

const missingKey = <T>(path: string[], key: string): SimpleResult<SchemaError[], T> => {
  return nu(path, () => 'Choice schema did not contain choice key: "' + key + '"');
};

const missingBranch = <T>(path: string[], branches: Record<string, any>, branch: string): SimpleResult<SchemaError[], T> => {
  return nu(path, () => 'The chosen schema: "' + branch + '" did not exist in branches: ' + formatObj(branches));
};

const unsupportedFields = <T>(path: string[], unsupported: string[]): SimpleResult<SchemaError[], T> => {
  return nu(path, () => 'There are unsupported fields: [' + unsupported.join(', ') + '] specified');
};

const custom = <T>(path: string[], err: string): SimpleResult<SchemaError[], T> => {
  return nu(path, Fun.constant(err));
};

const toString = (error: SchemaError): string => {
  return 'Failed path: (' + error.path.join(' > ') + ')\n' + error.getErrorInfo();
};

export {
  missingStrict,
  missingKey,
  missingBranch,
  unsupportedFields,
  custom,
  toString
};
