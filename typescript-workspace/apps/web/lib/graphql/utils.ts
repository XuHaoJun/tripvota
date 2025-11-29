export function rowIdToGlobalId(typeName: string, rowId: any) {
  const json = JSON.stringify([typeName, rowId]);
  return Buffer.from(json, 'utf8').toString('base64');
}

export function globalIdToRowId(globalId: string) {
  const json = Buffer.from(globalId, 'base64').toString('utf8');
  return JSON.parse(json);
}
