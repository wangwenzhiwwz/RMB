// 人民币金额大写转换：逐位保留数字（包括每个零），固定显示“圆、角、分”，不追加“整”。
const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const SMALL_UNITS = ['', '拾', '佰', '仟'];
const GROUP_UNITS = ['', '万', '亿', '兆'];

function integerToChinese(value: string): string {
  const normalized = value.replace(/^0+(?=\\d)/, '') || '0';
  if (normalized.length > 16) throw new Error('整数部分最多支持 16 位');

  return normalized.split('').map((char, index) => {
    const digit = Number(char);
    const position = normalized.length - index - 1;
    const groupIndex = Math.floor(position / 4);
    const smallUnit = SMALL_UNITS[position % 4];
    const groupUnit = GROUP_UNITS[groupIndex];
    return DIGITS[digit] + smallUnit + groupUnit;
  }).join('');
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
