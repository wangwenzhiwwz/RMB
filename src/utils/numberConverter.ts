// 人民币金额大写转换：按四位分组处理整数，正确合并连续零与万、亿、兆单位。
// 小数固定显示“角、分”，不追加“整”，以兼容报销单填写场景。
const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const SMALL_UNITS = ['', '拾', '佰', '仟'];
const GROUP_UNITS = ['', '万', '亿', '兆'];

function convertFourDigits(value: number): string {
  const digits = String(value).padStart(4, '0');
  let result = '';
  let pendingZero = false;

  digits.split('').forEach((char, index) => {
    const digit = Number(char);
    const position = 3 - index;

    if (digit === 0) {
      if (result) pendingZero = true;
      return;
    }

    if (pendingZero) result += DIGITS[0];
    result += DIGITS[digit] + SMALL_UNITS[position];
    pendingZero = false;
  });

  return result;
}

function integerToChinese(value: string): string {
  const normalized = value.replace(/^0+(?=\\d)/, '') || '0';
  if (normalized.length > 16) throw new Error('整数部分最多支持 16 位');
  if (/^0+$/.test(normalized)) return DIGITS[0];

  const groups: number[] = [];
  for (let end = normalized.length; end > 0; end -= 4) {
    groups.unshift(Number(normalized.slice(Math.max(0, end - 4), end)));
  }

  let result = '';
  let zeroBetweenGroups = false;

  groups.forEach((group, index) => {
    const groupUnit = GROUP_UNITS[groups.length - index - 1];

    if (group === 0) {
      if (result) zeroBetweenGroups = true;
      return;
    }

    // 跨过空组，或高位组不足四位时，组间只补一个“零”。
    if (result && (zeroBetweenGroups || group < 1000)) {
      if (!result.endsWith(DIGITS[0])) result += DIGITS[0];
    }

    result += convertFourDigits(group) + groupUnit;
    zeroBetweenGroups = false;
  });

  return result;
}

export function numberToChinese(num: number | string): string {
  const text = String(num);
  if (!/^\\d+$/.test(text)) throw new Error('请输入有效整数');
  return integerToChinese(text);
}

export function amountToChinese(amount: number | string): string {
  let text = String(amount).trim().replace(/,/g, '');
  if (!text) return '';
  if (!/^(?:\\d+\\.?\\d*|\\.\\d+)$/.test(text)) {
    throw new Error('请输入有效金额，仅支持数字和小数点');
  }
  if (text.startsWith('.')) text = '0' + text;

  const parts = text.split('.');
  const integerPart = parts[0].replace(/^0+(?=\\d)/, '') || '0';
  const decimalInput = parts[1] || '';

  if (decimalInput.length > 2) throw new Error('小数部分最多输入 2 位');
  if (integerPart.length > 16) throw new Error('整数部分最多支持 16 位');

  const decimalPart = decimalInput.padEnd(2, '0');
  const jiao = Number(decimalPart[0]);
  const fen = Number(decimalPart[1]);

  return integerToChinese(integerPart) + '圆' + DIGITS[jiao] + '角' + DIGITS[fen] + '分';
}
