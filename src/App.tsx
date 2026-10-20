import { useMemo, useState } from 'react';
import { CircleDollarSign, ClipboardPaste, RotateCcw, Check, Sparkles } from 'lucide-react';
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
        setNotice('剪贴板为空，请先复制报销金额');
        return;
      }
      updateAmount(text);
      setNotice('已粘贴剪贴板内容');
    } catch {
      setNotice('无法直接读取剪贴板，请点击输入框后按 Ctrl+V');
    }
  };

  const copyResult = async () => {
    if (!conversion.value) return;
    try {
      await navigator.clipboard.writeText(conversion.value);
      setCopied(true);
      setNotice('大写金额已复制，可直接粘贴到报销单');
    } catch {
      setNotice('复制失败，请手动选中转换结果复制');
      setCopied(false);
    }
  };

  const clear = () => {
    setAmount('');
    setCopied(false);
    setNotice('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/60 px-4 py-8 text-slate-900 transition-colors dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 dark:text-slate-100 sm:py-14">
      <main className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm backdrop-blur dark:border-blue-400/20 dark:bg-slate-900/80 dark:text-blue-300">
            <CircleDollarSign className="h-5 w-5" aria-hidden="true" />
            <span>轻量 · 快速 · 本地处理</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">人民币金额大写</h1>
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400">快速填写报销单 · 支持剪贴板粘贴</p>
        </header>

        <section className="rounded-[2rem] border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-200/60 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/20 sm:p-8">
          <label className="mb-3 block text-sm font-bold tracking-wide text-slate-700 dark:text-slate-200" htmlFor="amount">报销金额（小写）</label>
          <div className="flex items-stretch gap-3">
            <div className="flex min-w-0 flex-1 items-center rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15 dark:border-slate-700 dark:bg-slate-950">
              <span className="select-none pl-4 text-xl font-semibold text-slate-400" aria-hidden="true">¥</span>
              <input
                id="amount"
                name="amount"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                spellCheck={false}
                value={amount}
                onChange={(event) => updateAmount(event.target.value)}
                placeholder="输入或粘贴金额，例如 3010.01"
                aria-describedby="amount-help"
                className="h-16 min-w-0 w-full rounded-xl border-0 bg-transparent px-3 text-xl font-semibold text-slate-900 outline-none ring-0 placeholder:text-base placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-white dark:placeholder:text-slate-600 sm:text-2xl"
              />
            </div>
            <button
              type="button"
              onClick={pasteAmount}
              className="inline-flex min-h-16 shrink-0 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-5 text-base font-bold text-slate-700 transition hover:bg-blue-100 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:text-white"
              aria-label="从剪贴板粘贴金额"
            >
              <ClipboardPaste size={20} aria-hidden="true" />
              <span>粘贴</span>
            </button>
          </div>
          <p id="amount-help" className="mt-3 inline-flex items-center rounded-full bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-500 dark:bg-slate-900/70 dark:text-slate-400">可直接输入或使用 Ctrl+V 粘贴；支持最多 16 位整数、2 位小数。</p>

          <div className="mt-6 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/80 p-5 dark:border-blue-400/15 dark:from-blue-950/60 dark:to-indigo-950/40 sm:p-6" aria-live="polite">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold tracking-wide text-blue-900 dark:text-blue-200">报销单大写金额</h2>
              {conversion.value && <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300"><Check size={13} aria-hidden="true" />转换完成</span>}
            </div>
            <button
              type="button"
              onClick={copyResult}
              disabled={!conversion.value}
              aria-label="点击复制大写金额"
              className={`min-h-16 w-full break-all rounded-lg text-left text-xl font-bold leading-relaxed transition sm:text-2xl ${conversion.error ? 'text-red-600' : conversion.value ? 'cursor-pointer text-slate-900 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-50 dark:hover:text-blue-300' : 'cursor-default text-slate-400'}`}
            >
              {conversion.error || (conversion.value
                ? (() => {
                    const chars = conversion.value.split('');
                    const financialDigits = '壹贰叁肆伍陆柒捌玖';
                    const lastNonZeroDigit = chars.reduce(
                      (last, char, index) => financialDigits.includes(char) ? index : last,
                      -1,
                    );
                    // 最后一个非零大写数字之后，所有“零”都画红线，包括佰、拾、圆、角、分前的零。
                    return chars.map((char, index) => {
                      const markZero = char === '零' && index > lastNonZeroDigit;
                      return markZero
                        ? <span key={index} style={{ textDecorationLine: 'line-through', textDecorationColor: '#ef4444', textDecorationThickness: '2px', textDecorationSkipInk: 'none' }}>{char}</span>
                        : char;
                    });
                  })()
                : '等待输入金额')}
            </button>
            {conversion.value && (
              <p className="mt-2 text-sm text-slate-500">
                {copied ? '已复制，可直接粘贴到报销单' : '点击大写金额文字即可复制'}
              </p>
            )}
          </div>

          <div className="mt-4 flex min-h-9 items-center justify-between gap-3">
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400 sm:text-sm" role="status">{notice || '金额仅在本地浏览器处理，不会上传'}</p>
            <button type="button" onClick={clear} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white">
              <RotateCcw size={15} aria-hidden="true" />
              清空
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
