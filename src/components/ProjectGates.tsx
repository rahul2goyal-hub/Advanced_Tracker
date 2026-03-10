import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ProjectGatesProps {
  currentGate: string;
  progress: number;
}

const GATES = ['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'];

export default function ProjectGates({ currentGate, progress }: ProjectGatesProps) {
  const currentIdx = GATES.indexOf(currentGate);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Project Gates</h3>
          <p className="text-sm text-gray-500">Visual timeline of project maturity stages</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-red-600">{progress}%</span>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Overall Progress</p>
        </div>
      </div>

      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-100" />
        <div 
          className="absolute top-5 left-0 h-0.5 bg-red-600 transition-all duration-500" 
          style={{ width: `${(currentIdx / (GATES.length - 1)) * 100}%` }}
        />

        <div className="relative flex justify-between">
          {GATES.map((gate, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            
            return (
              <div key={gate} className="flex flex-col items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300",
                  isCompleted ? "bg-red-600 text-white" : 
                  isCurrent ? "bg-white border-2 border-red-600 text-red-600 shadow-lg scale-110" : 
                  "bg-white border-2 border-gray-200 text-gray-400"
                )}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{gate}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-bold",
                    isCurrent ? "text-red-600" : "text-gray-500"
                  )}>
                    {isCurrent ? 'Current' : gate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
