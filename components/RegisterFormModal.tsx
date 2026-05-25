"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface RegisterCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterCampaignModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterCampaignModalProps) {
  // Localized form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetAddress, setTargetAddress] = useState("");
  const [goal, setGoal] = useState("1000");
  const [treasuryEnabled, setTreasuryEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !targetAddress || !goal) return;

    setIsSubmitting(true);
    try {
      
      const { error } = await supabase.from("campaigns").insert([
        {
          title,
          description,
          target_address: targetAddress,
          goal: parseFloat(goal),
          treasury_enabled: treasuryEnabled,
          is_verified: false, // unverified initially
        },
      ]);

      if (error) throw error;

      setTitle("");
      setDescription("");
      setTargetAddress("");
      setGoal("1000");
      setTreasuryEnabled(false);
      
      // Trigger callback functions
      onSuccess(); // Triggers dashboard fetch
      onClose();   // Closes this modal view
    } catch (err) {
      console.error("Error creating campaign record:", err);
      alert("Failed to submit campaign details. Check console logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#141722] border border-white/10 w-full max-w-lg rounded-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0f1117]">
          <span className="text-sm font-semibold text-gray-200">Register New Cardano Campaign</span>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-xs bg-white/5 px-2 py-1 rounded transition"
          >
            ✕ Close
          </button>
        </div>
        
        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm font-mono">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Campaign Title</label>
            <input 
              required 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g., Department Showcase 2026" 
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Campaign Description</label>
            <textarea 
              required 
              rows={3} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Provide short details about the use of funding..." 
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500 resize-none font-sans" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Target Cardano Address</label>
            <input 
              required 
              type="text" 
              value={targetAddress} 
              onChange={(e) => setTargetAddress(e.target.value)} 
              placeholder="addr_test1..." 
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500 text-xs" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-400 block">Funding Goal (ADA)</label>
            <input 
              required 
              type="number" 
              min="1" 
              value={goal} 
              onChange={(e) => setGoal(e.target.value)} 
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-2.5 outline-none text-gray-200 focus:border-indigo-500" 
            />
          </div>

          <button 
            disabled={isSubmitting} 
            type="submit" 
            className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white rounded-xl font-semibold tracking-wide transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
            >
            {isSubmitting ? "Registering..." : "Register Campaign"}
          </button>
        </form>

      </div>
    </div>
  );
}