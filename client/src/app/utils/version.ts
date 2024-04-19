export function versionLessThan(a: string, b: string): boolean {
  const aArr = a.split('.');
  const bArr = b.split('.');

  for (let i = 0; i < 3; i += 1) {
    if (Number(bArr[i]) > Number(aArr[i])) return true;
  }

  return false;
}

export function nonPatchVersionLessThan(a: string, b: string): boolean {
  const aArr = a.split('.');
  const bArr = b.split('.');

  for (let i = 0; i < 2; i += 1) {
    if (Number(bArr[i]) > Number(aArr[i])) return true;
  }

  return false;
}
