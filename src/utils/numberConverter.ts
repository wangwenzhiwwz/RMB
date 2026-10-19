// 人民币金额大写转换：固定显示“圆、角、分”，不追加“整”。
const DIGITS = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
const SMALL_UNITS = ['', '拾', '佰', '仟'];
const GROUP_UNITS = ['', '万', '亿', '兆'];

function convertGroup(group: string): string {
  let output = '';
  let pendingZero = false;

  for (let i = 0; i < 4; i++) {
    const digit = Number(group[i] || '0');
    const unitIndex = 3 - i;

    if (digit === 0) {
      if (output) pendingZero = true;
      continue;
    }

    if (pendingZero) output += '零';
    output += DIGITS[digit] + SMALL_UNITS[unitIndex];
    pendingZero = false;
  }

  return output;
}

function integerToChinese(value: string): string {
  const normalized = value.replace(/^0+(?=\d)/, '') || '0';
  if (normalized === '0') return '零';
  if (normalized.length > 16) throw new Error('整数部分最多支持 16 位');

  const padded = normalized.padStart(Math.ceil(normalized.length / 4) * 4, '0');
  const groups = padded.match(/\d{4}/g) || [];
  let output = '';
  let zeroGroupPending = false;

  groups.forEach((group, index) => {
    const groupValue = Number(group);
    const unit = GROUP_UNITS[groups.length - index - 1];

    if (groupValue === 0) {
      if (output) zeroGroupPending = true;
      return;
    }

    if (output && (zeroGroupPending || groupValue < 1000)) output += '零';
    output += convertGroup(group) + unit;
    zeroGroupPending = false;
  });

  return output;
}

export function numberToChinese(num: number | string): string {
  const text = String(num);
  if (!/^\d+$/.test(text)) throw new Error('请输入有效整数');
  return integerToChinese(text);
}

export function amountToChinese(amount: number | string): string {
  let text = String(amount).trim().replace(/,/g, '');
  if (!text) return '';
  if (!/^(?:\d+\.?\d*|\.\d+)$/.test(text)) {
    throw new Error('请输入有效金额，仅支持数字和小数点');
  }
  if (text.startsWith('.')) text = '0' + text;

  const parts = text.split('.');
  const integerPart = parts[0].replace(/^0+(?=\d)/, '') || '0';
  const decimalInput = parts[1] || '';

  if (decimalInput.length > 2) throw new Error('小数部分最多输入 2 位');
  if (integerPart.length > 16) throw new Error('整数部分最多支持 16 位');

  const decimalPart = decimalInput.padEnd(2, '0');
  const jiao = Number(decimalPart[0]);
  const fen = Number(decimalPart[1]);

  return integerToChinese(integerPart) + '圆' + DIGITS[jiao] + '角' + DIGITS[fen] + '分';
}
