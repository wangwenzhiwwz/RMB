import { useMemo, useState } from 'react';
import { CircleDollarSign, ClipboardPaste, Copy, RotateCcw } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:py-14">
      <main className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <div className="mb-3 flex justify-center">
            <CircleDollarSign className="h-10 w-10 text-blue-600" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">人民币金额大写</h1>
          <p className="mt-2 text-base text-slate-500">快速填写报销单 · 支持剪贴板粘贴</p>
        </header>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <label className="mb-3 block text-base font-semibold text-slate-700" htmlFor="amount">报销金额（小写）</label>
          <div className="flex items-stretch gap-3">
            <div className="flex min-w-0 flex-1 items-center rounded-xl border border-slate-300 bg-white transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/15">
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
                className="h-16 min-w-0 w-full rounded-xl border-0 bg-transparent px-3 text-xl font-semibold text-slate-900 outline-none ring-0 placeholder:text-base placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:text-2xl"
              />
            </div>
            <button
              type="button"
              onClick={pasteAmount}
              className="inline-flex min-h-16 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-base font-semibold text-slate-700 transition hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20"
              aria-label="从剪贴板粘贴金额"
            >
              <ClipboardPaste size={20} aria-hidden="true" />
              <span>粘贴</span>
            </button>
          </div>
          <p id="amount-help" className="mt-2 text-sm text-slate-500">可直接输入或使用 Ctrl+V 粘贴；支持最多 16 位整数、2 位小数。</p>

          <div className="mt-6 rounded-xl bg-blue-50 p-5 sm:p-6" aria-live="polite">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-blue-900">报销单大写金额</h2>
              {conversion.value && <span className="text-sm text-blue-700">转换完成</span>}
            </div>
            <p className={\`min-h-16 break-all text-xl font-bold leading-relaxed sm:text-2xl \${conversion.error ? 'text-red-600' : conversion.value ? 'text-slate-900' : 'text-slate-400'}\`}>
              {conversion.error || conversion.value || '等待输入金额'}
            </p>
            <button
              type="button"
              onClick={copyResult}
              disabled={!conversion.value}
              className="mt-4 inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 text-base font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Copy size={19} aria-hidden="true" />
              {copied ? '已复制，可粘贴到报销单' : '复制大写金额'}
            </button>
          </div>

          <div className="mt-4 flex min-h-9 items-center justify-between gap-3">
            <p className="text-sm leading-5 text-slate-500" role="status">{notice || '金额仅在本地浏览器处理，不会上传'}</p>
            <button type="button" onClick={clear} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
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
