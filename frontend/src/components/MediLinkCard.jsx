import React, { forwardRef } from 'react';
import QRCode from 'react-qr-code';
import { Stethoscope } from 'lucide-react';

const MediLinkCard = forwardRef(({ patient }, ref) => {
  if (!patient) return null;

  return (
    <div className="print:m-0 print:p-0">
      <div 
        ref={ref} 
        className="relative overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl flex flex-col justify-between"
        style={{
          width: '85.6mm',
          height: '53.98mm',
          padding: '5mm',
          boxSizing: 'border-box'
        }}
      >
        {/* Background patterns */}
        <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 h-32 w-32 rounded-full bg-primary-400/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col h-full gap-5">
          {/* Top Left Label */}
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1 rounded-lg backdrop-blur-md">
              <Stethoscope size={18} />
            </div>
            <span className="text-sm font-black italic tracking-tighter">MediLink Card</span>
          </div>
          <div className="flex gap-4 items-end mt-2">
            <div className="flex-1 space-y-1">
              <div>
                <p className="text-[7px] uppercase tracking-widest text-primary-200 mb-0">Name</p>
                <p className="text-xs font-bold leading-tight truncate">{patient.user?.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[7px] uppercase tracking-widest text-primary-200 mb-0">Age/Gender</p>
                  <p className="text-[10px] font-bold">{patient.age} / {patient.gender}</p>
                </div>
                <div>
                  <p className="text-[7px] uppercase tracking-widest text-primary-200 mb-0">Contact</p>
                  <p className="text-[10px] font-bold">{patient.user?.mobile}</p>
                </div>
              </div>

              <div>
                <p className="text-[7px] uppercase tracking-widest text-primary-200 mb-0">Patient ID</p>
                <p className="text-xs font-mono font-black tracking-wider text-white">{patient.patientId}</p>
              </div>
            </div>

            <div className="bg-white p-1.5 rounded-xl shadow-lg shrink-0">
               <QRCode value={patient.patientId} size={50} level="H" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default MediLinkCard;
