import { useMemo, useState } from 'react';
import { ClipboardPaste, RotateCcw, Check } from 'lucide-react';
import { amountToChinese } from './utils/numberConverter';

function App() {
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState('');

  const conversion = useMemo(() => {
    if (!amount.trim()) return { value: '', error: '' };
    try {
      return { value: amountToChinese(amount), error: '' };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : '金额格式有误' };
    }
  }, [amount]);

  const updateAmount = (value: string) => {
    setAmount(value);
    setCopied(false);
    setNotice('');
  };

  const pasteAmount = async () => {
    setNotice('');
    try {
      const text = (await navigator.clipboard.readText()).trim().replace(/,/g, '');
      if (!text) {
        setNotice('剪贴板为空');
        return;
      }
      updateAmount(text);
      setNotice('');
    } catch {
      setNotice('请在输入框中手动粘贴');
    }
  };

  const copyResult = async () => {
    if (!conversion.value) return;
    try {
      await navigator.clipboard.writeText(conversion.value);
      setCopied(true);
      setNotice('已复制');
    } catch {
      setNotice('复制失败，请手动复制');
      setCopied(false);
    }
  };

  const clear = () => {
    setAmount('');
    setCopied(false);
    setNotice('');
  };

  const glassButton = 'border border-white/60 bg-white/55 shadow-sm shadow-black/[0.04] backdrop-blur-xl backdrop-saturate-150 hover:bg-white/75 active:bg-white/85 dark:border-white/[0.14] dark:bg-white/[0.09] dark:shadow-black/20 dark:hover:bg-white/[0.15] dark:active:bg-white/[0.2]';

  return (
    <div className="min-h-screen bg-[#f5f5f7] px-3 py-6 text-[#1d1d1f] transition-colors duration-200 dark:bg-black dark:text-[#f5f5f7] sm:px-4 sm:py-12">
      <main className="mx-auto w-full max-w-xl">
        <header className="mb-5 text-center sm:mb-9">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-4xl">人民币金额大写</h1>
          <p className="mx-auto mt-2 max-w-md text-sm text-[#6e6e73] dark:text-[#a1a1a6] sm:text-base">快速转换为财务大写。</p>
        </header>

        <section className="overflow-hidden rounded-2xl bg-white/80 p-3 shadow-sm shadow-black/[0.03] dark:bg-[#111112]/90 dark:shadow-black/30 sm:p-6">
          <label className="mb-3 block text-sm font-medium text-[#6e6e73] dark:text-[#a1a1a6]" htmlFor="amount">输入金额（人民币）</label>
          <div className="flex items-center gap-2 rounded-full border border-black/[0.14] bg-white p-1.5 shadow-sm shadow-black/[0.04] transition-all duration-200 focus-within:border-black/30 focus-within:ring-4 focus-within:ring-black/[0.08] dark:border-white/[0.2] dark:bg-[#1c1c1e] dark:shadow-black/30 dark:focus-within:border-white/[0.32] dark:focus-within:ring-white/[0.09]">
            <span className="pl-2.5 text-xl font-medium text-[#86868b] dark:text-[#8e8e93] sm:text-2xl" aria-hidden="true">¥</span>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              spellCheck={false}
              value={amount}
              onChange={(event) => updateAmount(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  void copyResult();
                } else if (event.key === "Escape") {
                  clear();
                }
              }}
              placeholder="0.00"
              aria-describedby="amount-help"
              className="h-10 min-w-0 w-full border-0 bg-transparent px-1 text-lg font-semibold tracking-tight text-[#1d1d1f] outline-none placeholder:text-[#c7c7cc] focus:outline-none focus:ring-0 dark:text-[#f5f5f7] dark:placeholder:text-[#636366] sm:h-12 sm:text-3xl"
            />
            <button
              type="button"
              onClick={pasteAmount}
              className={`inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-full border px-3 text-sm font-semibold transition-all duration-200 backdrop-blur-xl backdrop-saturate-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#888888]/25 dark:focus-visible:ring-white/20 sm:h-10 ${glassButton}`}
              aria-label="从剪贴板粘贴金额"
            >
              <ClipboardPaste size={17} aria-hidden="true" />
              <span>粘贴</span>
            </button>
          </div>
          <p id="amount-help" className="mt-3 px-1 text-xs leading-5 text-[#86868b] dark:text-[#8e8e93]">最多 16 位整数，支持 2 位小数。</p>

          <div className="my-5 h-px bg-black/[0.06] dark:bg-white/[0.08]" />

          <div aria-live="polite">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-[#6e6e73] dark:text-[#a1a1a6]">转换结果</h2>
              {conversion.value && !conversion.error && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#555555] dark:text-[#d1d1d6]">
                  <Check size={14} aria-hidden="true" />
                  转换完成
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={copyResult}
              disabled={!conversion.value || Boolean(conversion.error)}
              aria-label="点击复制大写金额"
              className={`min-h-24 w-full rounded-2xl px-5 py-4 text-left text-lg font-semibold leading-relaxed shadow-sm backdrop-blur-xl backdrop-saturate-150 transition-all duration-200 sm:min-h-28 sm:px-6 sm:text-xl ${conversion.error ? 'bg-[#eeeeee]/75 text-[#222222] dark:bg-white/[0.06] dark:text-[#e5e5ea]' : conversion.value ? 'cursor-pointer bg-white/55 text-[#1d1d1f] shadow-black/[0.03] hover:bg-white/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#888888] dark:bg-white/[0.08] dark:text-[#f2f2f7] dark:shadow-black/20 dark:hover:bg-white/[0.13] dark:focus-visible:ring-[#8e8e93]' : 'cursor-default bg-white/40 text-[#777777] dark:bg-white/[0.045] dark:text-[#8e8e93]'}`}
            >
              {conversion.error || (conversion.value
                ? (() => {
                    const chars = conversion.value.split('');
                    const financialDigits = '壹贰叁肆伍陆柒捌玖';
                    const lastNonZeroDigit = chars.reduce(
                      (last, char, index) => financialDigits.includes(char) ? index : last,
                      -1,
                    );
                    return chars.map((char, index) => {
                      const markZero = char === '零' && index > lastNonZeroDigit;
                      return markZero
                        ? <span key={index} style={{ textDecorationLine: 'line-through', textDecorationColor: '#666666', textDecorationThickness: '2px', textDecorationSkipInk: 'none' }}>{char}</span>
                        : char;
                    });
                  })()
                : '')}
            </button>
            <div className="mt-4 flex min-h-10 flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-[#86868b] dark:text-[#8e8e93]" role="status">
                {notice || (conversion.value ? (copied ? '已复制到剪贴板' : '点击结果区域即可复制') : '')}
              </p>
              <button
                type="button"
                onClick={clear}
                className={`inline-flex h-9 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all duration-200 backdrop-blur-xl backdrop-saturate-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#888888] dark:focus-visible:ring-[#8e8e93] ${glassButton}`}
              >
                <RotateCcw size={14} aria-hidden="true" />
                清空
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-4 text-center text-xs leading-5 text-[#86868b] dark:text-[#636366]">
          为日常报销与财务填写设计 · 无需上传数据
        </footer>
      </main>
    </div>
  );
}

export default App;
