import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
// BondCalculatorPage.jsx
// Single-file React component (Tailwind CSS required in the host app).
// - Default export a React component
// - Uses Tailwind utility classes
// - Includes SEO meta tags + JSON-LD (structured data)

export default function BondCalculatorPage() {
  const [principal, setPrincipal] = React.useState(200000);
  const [rate, setRate] = React.useState(8.6); // annual %
  const [years, setYears] = React.useState(2);
  const [tax, setTax] = React.useState(12.5); // LTCG %
  const currency = React.useMemo(() => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }), []);

  const maturity = React.useMemo(() => {
    const m = principal * Math.pow(1 + rate / 100, years);
    return Math.round(m);
  }, [principal, rate, years]);

  const totalInterest = React.useMemo(() => maturity - principal, [maturity, principal]);
  const taxAmount = React.useMemo(() => Math.round((totalInterest * tax) / 100), [totalInterest, tax]);
  const netMaturity = React.useMemo(() => maturity - taxAmount, [maturity, taxAmount]);
  const netGain = React.useMemo(() => netMaturity - principal, [netMaturity, principal]);
  const netPercent = React.useMemo(() => (netGain / principal) * 100, [netGain, principal]);
  const annualized = React.useMemo(() => (Math.pow(netMaturity / principal, 1 / years) - 1) * 100, [netMaturity, principal, years]);

  // Helper to format numbers neatly
  const fmt = (v) => currency.format(Math.round(v));
  const pct = (v) => `${v.toFixed(2)}%`;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans">
      <Helmet>
        <title>Bond Net Return Calculator — After Tax (LTCG)</title>
        <meta name="description" content="Calculate net maturity and after-tax returns for cumulative corporate bonds. Interactive sliders for principal, rate, tenure and tax. SEO friendly single-page app." />
        <meta name="keywords" content="bond calculator, after tax bond return, LTCG calculator, corporate bonds, maturity calculator, bond tax" />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {`{
            "@context":"https://schema.org",
            "@type":"WebApplication",
            "name":"Bond Net Return Calculator",
            "url":"https://your-domain.example/bond-calculator",
            "description":"Calculate net maturity and after-tax returns for cumulative corporate bonds.",
            "applicationCategory":"Finance"
          }`}
        </script>
      </Helmet>

      <div className="max-w-5xl mx-auto">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Bond Net Return Calculator</h1>
          <p className="mt-2 text-slate-600">Enter your investment details and see gross &amp; net maturity, tax, percentage increase and annualized return.</p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left: Inputs */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="col-span-1 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Inputs</h2>

            <label className="block text-sm text-slate-700">Principal (₹)</label>
            <input
              type="range"
              min={1000}
              max={2000000}
              step={1000}
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex items-center justify-between mt-2">
              <input value={principal} onChange={(e) => setPrincipal(Number(e.target.value || 0))} className="w-2/3 border rounded px-3 py-2" />
              <div className="text-sm text-slate-600">Range: ₹1k - ₹2M</div>
            </div>

            <label className="block text-sm text-slate-700 mt-4">Coupon / Interest Rate (% p.a.)</label>
            <input
              type="range"
              min={0}
              max={20}
              step={0.1}
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex items-center justify-between mt-2">
              <input value={rate} onChange={(e) => setRate(Number(e.target.value || 0))} className="w-2/3 border rounded px-3 py-2" />
              <div className="text-sm text-slate-600">Typical: 0% - 20%</div>
            </div>

            <label className="block text-sm text-slate-700 mt-4">Tenure (years)</label>
            <input
              type="range"
              min={1}
              max={30}
              step={1}
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex items-center justify-between mt-2">
              <input value={years} onChange={(e) => setYears(Number(e.target.value || 1))} className="w-2/3 border rounded px-3 py-2" />
              <div className="text-sm text-slate-600">Years</div>
            </div>

            <label className="block text-sm text-slate-700 mt-4">Tax on gain (LTCG %) </label>
            <input
              type="range"
              min={0}
              max={30}
              step={0.1}
              value={tax}
              onChange={(e) => setTax(Number(e.target.value))}
              className="w-full mt-2"
            />
            <div className="flex items-center justify-between mt-2">
              <input value={tax} onChange={(e) => setTax(Number(e.target.value || 0))} className="w-2/3 border rounded px-3 py-2" />
              <div className="text-sm text-slate-600">Tax % on interest/gain</div>
            </div>

            <p className="text-xs text-slate-500 mt-4">Assumes annual compounding and tax applied only on interest (gain) at maturity.</p>
          </motion.div>

          {/* Center: Visual summary */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-1 md:col-span-2 bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Results</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border">
                <div className="text-sm text-slate-500">Gross Maturity Value</div>
                <div className="text-2xl font-semibold mt-2">{fmt(maturity)}</div>
                <div className="text-sm text-slate-600 mt-1">(Principal + Interest before tax)</div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="text-sm text-slate-500">Net Maturity Value</div>
                <div className="text-2xl font-semibold mt-2">{fmt(netMaturity)}</div>
                <div className="text-sm text-slate-600 mt-1">(After deducting tax on interest)</div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="text-sm text-slate-500">Total Interest Earned</div>
                <div className="text-2xl font-semibold mt-2">{fmt(totalInterest)}</div>
                <div className="text-sm text-slate-600 mt-1">Gross interest before tax</div>
              </div>

              <div className="p-4 rounded-lg border">
                <div className="text-sm text-slate-500">Tax on Gain</div>
                <div className="text-2xl font-semibold mt-2">{fmt(taxAmount)}</div>
                <div className="text-sm text-slate-600 mt-1">{pct(tax)} of interest</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-inner">
                <div className="text-sm text-slate-600">Net Gain (₹)</div>
                <div className="text-2xl font-bold mt-2">{fmt(netGain)}</div>
                <div className="text-sm text-slate-600 mt-1">(Net maturity - principal)</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg shadow-inner">
                <div className="text-sm text-slate-600">Net % Increase (Total)</div>
                <div className="text-2xl font-bold mt-2">{pct(netPercent)}</div>
                <div className="text-sm text-slate-600 mt-1">(Over entire tenure)</div>
              </div>

              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-inner">
                <div className="text-sm text-slate-600">Annualized Return (CAGR)</div>
                <div className="text-2xl font-bold mt-2">{pct(annualized)}</div>
                <div className="text-sm text-slate-600 mt-1">(Per year after tax)</div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-slate-700">Breakdown</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li><strong>Principal:</strong> {fmt(principal)}</li>
                <li><strong>Gross Interest:</strong> {fmt(totalInterest)}</li>
                <li><strong>Tax ({tax}%):</strong> {fmt(taxAmount)}</li>
                <li><strong>Net maturity:</strong> {fmt(netMaturity)}</li>
              </ul>
            </div>

            <div className="mt-6 flex gap-3">
              <a href="#" onClick={(e) => { e.preventDefault(); navigator.clipboard?.writeText(JSON.stringify({ principal, rate, years, tax, maturity, netMaturity })); alert('Calculation copied to clipboard') }} className="px-4 py-2 bg-slate-800 text-white rounded-lg shadow hover:opacity-90">Copy Calculation</a>
              <a href="#" onClick={(e) => { e.preventDefault(); const csv = `Principal,Rate,Years,Tax,GrossMaturity,NetMaturity\n${principal},${rate},${years},${tax},${maturity},${netMaturity}`; const blob = new Blob([csv], { type: 'text/csv' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'bond-calculation.csv'; a.click(); URL.revokeObjectURL(url); }} className="px-4 py-2 border border-slate-300 rounded-lg">Download CSV</a>
            </div>
          </motion.div>
        </div>

        <footer className="mt-10 text-sm text-slate-500">
          <p>Note: This calculator assumes annual compounding and that tax is applied at maturity only on interest. It is a guide — consult a tax advisor for exact ITR treatment and add cess where applicable.</p>
        </footer>
      </div>
    </div>
  );
}
