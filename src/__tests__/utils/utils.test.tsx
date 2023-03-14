import { isUrl, checkPasswordPolicy, nonAccentVietnamese, isEmpty } from '@/utils/utils';

describe('isUrl tests', (): void => {
  it('should return false for invalid and corner case inputs', (): void => {
    expect(isUrl([] as any)).toBeFalsy();
    expect(isUrl({} as any)).toBeFalsy();
    expect(isUrl(false as any)).toBeFalsy();
    expect(isUrl(true as any)).toBeFalsy();
    expect(isUrl(NaN as any)).toBeFalsy();
    expect(isUrl(null as any)).toBeFalsy();
    expect(isUrl(undefined as any)).toBeFalsy();
    expect(isUrl('')).toBeFalsy();
  });

  it('should return false for invalid URLs', (): void => {
    expect(isUrl('foo')).toBeFalsy();
    expect(isUrl('bar')).toBeFalsy();
    expect(isUrl('bar/test')).toBeFalsy();
    expect(isUrl('http:/example.com/')).toBeFalsy();
    expect(isUrl('ttp://example.com/')).toBeFalsy();
  });

  it('should return true for valid URLs', (): void => {
    expect(isUrl('http://example.com/')).toBeTruthy();
    expect(isUrl('https://example.com/')).toBeTruthy();
    expect(isUrl('http://example.com/test/123')).toBeTruthy();
    expect(isUrl('https://example.com/test/123')).toBeTruthy();
    expect(isUrl('http://example.com/test/123?foo=bar')).toBeTruthy();
    expect(isUrl('https://example.com/test/123?foo=bar')).toBeTruthy();
    expect(isUrl('http://www.example.com/')).toBeTruthy();
    expect(isUrl('https://www.example.com/')).toBeTruthy();
    expect(isUrl('http://www.example.com/test/123')).toBeTruthy();
    expect(isUrl('https://www.example.com/test/123')).toBeTruthy();
    expect(isUrl('http://www.example.com/test/123?foo=bar')).toBeTruthy();
    expect(isUrl('https://www.example.com/test/123?foo=bar')).toBeTruthy();
  });
});

describe.skip('checkPasswordPolicy tests', (): void => {
  it('should return false for invalid and corner case inputs', (): void => {
    const dftResult = { valid: true, messages: [] };
    expect(checkPasswordPolicy([] as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy({} as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy(false as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy(true as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy(NaN as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy(null as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy(undefined as any)).toStrictEqual(dftResult);
    expect(checkPasswordPolicy('')).toStrictEqual(dftResult);
  });

  // it('should return false for invalid values', (): void => {
  //   expect()
  // });

  // it('should return true for valid values', (): void => {
  // });
});

describe('nonAccentVietnamese tests', (): void => {
  it('should return false for other types', (): void => {
    expect(nonAccentVietnamese([] as any)).toEqual('');
    expect(nonAccentVietnamese({} as any)).toEqual('');
    expect(nonAccentVietnamese(false as any)).toEqual('');
    expect(nonAccentVietnamese(true as any)).toEqual('');
    expect(nonAccentVietnamese(NaN as any)).toEqual('');
    expect(nonAccentVietnamese(null as any)).toEqual('');
    expect(nonAccentVietnamese(undefined as any)).toEqual('');
  });

  // TODO: add incorrect case
  // it('should return false', (): void => {
  //   expect(nonAccentVietnamese('foo')).toBeFalsy();
  //   expect(nonAccentVietnamese('bar')).toBeFalsy();
  //   expect(nonAccentVietnamese('bar/test')).toBeFalsy();
  //   expect(nonAccentVietnamese('http:/example.com/')).toBeFalsy();
  //   expect(nonAccentVietnamese('ttp://example.com/')).toBeFalsy();
  // });

  // TODO: add more case
  it('correct cases', (): void => {
    expect(nonAccentVietnamese('Đây là mẫu dùng để kiểm tra')).toEqual('day la mau dung de kiem tra');
    expect(nonAccentVietnamese('a á à ả ã ạ â ấ ầ ẩ ẫ ậ ă ắ ằ ẳ ẵ ặ')).toEqual('a a a a a a a a a a a a a a a a a a');
    expect(nonAccentVietnamese('e é è ẻ ẽ ẹ ê ế ề ể ễ ệ')).toEqual('e e e e e e e e e e e e');
    expect(nonAccentVietnamese('o ó ò ỏ õ ọ ô ố ồ ổ ỗ ộ ơ ớ ờ ở ỡ ợ')).toEqual('o o o o o o o o o o o o o o o o o o');
    expect(nonAccentVietnamese('u ú ù ủ ũ ụ ư ứ ừ ử ữ ự')).toEqual('u u u u u u u u u u u u');
    expect(nonAccentVietnamese('i í ì ỉ ĩ ị')).toEqual('i i i i i i');
    expect(nonAccentVietnamese('y ý ỳ ỷ ỹ ỵ')).toEqual('y y y y y y');
    expect(nonAccentVietnamese('đ Đ')).toEqual('d d');
  });
});

describe('isEmpty tests', (): void => {
  it('should return true', (): void => {
    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty([])).toBeTruthy();
    expect(isEmpty({})).toBeTruthy();
    expect(isEmpty(NaN)).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
  });

  it('should be false', (): void => {
    expect(isEmpty('This is string')).toBeFalsy();
    expect(isEmpty(1)).toBeFalsy();
    expect(isEmpty(0)).toBeFalsy();
    expect(isEmpty(-1)).toBeFalsy();
    expect(isEmpty([1, 2, 3])).toBeFalsy();
    expect(isEmpty({ name: 'test' })).toBeFalsy();
    expect(isEmpty(true)).toBeFalsy();
    expect(isEmpty(false)).toBeFalsy();
  });
});