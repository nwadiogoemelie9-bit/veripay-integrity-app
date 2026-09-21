import React, { useState, useEffect } from 'react';
import { Camera, ShieldCheck, AlertCircle, Coins, RefreshCw, Zap, UploadCloud, MapPin, Smartphone } from 'lucide-react';

export default function ExquisiteAuditScanner() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [geoCoordinates, setGeoCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [auditResponse, setAuditResponse] = useState<any>(null);

  const targetBranchId = "d3b07384-d113-4956-a5cc-98bc8d167816";

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoCoordinates({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error) => console.warn("GPS telemetry restricted.", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const captureImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCapturedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const executeReceiptVerificationPipeline = async () => {
    if (!phoneNumber || !capturedImage) {
      alert("Verification requirements missing: Please input your mobile line and snap a clear image of the slip.");
      return;
    }
    setIsProcessing(true);
    setAuditResponse(null);
    try {
      const payload = await fetch('/api/verify-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: capturedImage,
          branchId: targetBranchId,
          latitude: geoCoordinates?.lat || 0,
          longitude: geoCoordinates?.lng || 0,
          reporterPhone: phoneNumber
        })
      });
      const data = await payload.json();
      setAuditResponse(data);
    } catch (err) {
      alert("Network communication layer error experienced during server ingestion pipeline execution.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans max-w-md mx-auto border-x border-slate-900/60 shadow-2xl relative overflow-x-hidden p-6">
      <header className="py-4 border-b border-slate-800/80 flex items-center justify-between mb-6">
        <h1 className="text-base font-black tracking-tight text-white">VeriPay <span className="text-emerald-400">Rewards</span></h1>
        <span className="text-[10px] bg-slate-800/60 text-slate-300 font-mono px-2 py-0.5 rounded">Live Engine</span>
      </header>

      <main className="space-y-6 flex-1">
        <section className="bg-slate-900/40 p-4 rounded-2xl border border-slate-800/60 space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">1. Whistleblower Payout Line</label>
          <input
            type="tel"
            placeholder="Enter phone number (e.g., +234...)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </section>

        <section className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-400 block">2. High-Fidelity Capture Matrix</label>
          {!capturedImage ? (
            <label className="flex flex-col items-center justify-center border border-dashed border-slate-800 bg-slate-900/20 rounded-2xl p-8 cursor-pointer h-44 text-center">
              <UploadCloud className="w-8 h-8 text-slate-500 mb-2" />
              <span className="text-xs font-extrabold bg-slate-800 text-slate-200 px-3 py-1.5 rounded-lg shadow-sm">Launch Device Viewfinder</span>
              <input type="file" accept="image/*" capture="environment" onChange={captureImageFile} className="hidden" />
            </label>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
              <img src={capturedImage} alt="Receipt preview snapshot" className="w-full h-44 object-cover rounded-xl" />
              <button onClick={() => setCapturedImage(null)} className="absolute bottom-4 right-4 bg-slate-900/90 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-700">Clear</button>
            </div>
          )}
        </section>

        <button
          onClick={executeReceiptVerificationPipeline}
          disabled={isProcessing}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:from-slate-900 disabled:text-slate-600 font-extrabold tracking-wide text-slate-950 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm"
        >
          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Execute Audit & Claim Voucher'}
        </button>

        {auditResponse && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <h3 className="font-bold text-amber-400">Processing Logs:</h3>
            <p><strong>Status:</strong> {auditResponse.status}</p>
            <p><strong>Trust Tier:</strong> {auditResponse.trustTier}</p>
            <p><strong>Resolved Holder:</strong> {auditResponse.resolvedName}</p>
          </div>
        )}
      </main>
    </div>
  );
}
