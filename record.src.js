
// produce a record with fixed allowed properties.

const lock = obj => key => Object.defineProperty(obj, key, {
  value: obj[key], enumerable: true, configurable: false, writable: false
});

function Record(allowedKeys, {defaults = {}, proto = {}} = {}) {
  const allowed = new Set(allowedKeys);
  
  const shell = {};
  allowed.forEach(key => shell[key] = undefined);

  const immutables = new Set(Object.keys(defaults).filter(key => !allowed.has(key)));

  return function createRecord(values = {}) {
    const valueKeys = Object.keys(values);

    if (valueKeys.some(key => !allowed.has(key))) {
      throw new IllegalRecordKey(valueKeys.filter(key => !allowed.has(key)), allowed);
    }
    
    const record = Object.assign(Object.create(proto, Object.getOwnPropertyDescriptors(shell)), defaults, values);

    immutables.forEach(lock(record));
    Object.seal(record);
    return record;
  };
}

function IllegalRecordKey(keys, allowed = null) {
  const msg = `Illegal record keys [${keys}]` + allowed !== null ? `; allowed keys are ${allowed}` : '';
  const err = new Error(msg);

  err.name ='IllegalRecordKeyError';
  return err;
}

module.exports = Record;