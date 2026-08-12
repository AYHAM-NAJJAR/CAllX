import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, User, PhoneCall ,ShieldCheck, Activity, Calendar, Users, Hash, Info, UserCheck, Ban } from 'lucide-react';
import { fetchCallRecords } from '../../services/call/core/getAllRecords';
import { fetchCallDetails } from '../../services/call/core/callDetails';
import RecordCard from './components/RecordCard';

function GetCallDetails() {
    const { cid } = useParams();
    
    // Audio states
    const [audioUrl, setAudioUrl] = useState(null);
    const [loadingAudio, setLoadingAudio] = useState(true);
    const [audioError, setAudioError] = useState(null);

    // Call details states
    const [callDetails, setCallDetails] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [detailsError, setDetailsError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('Token'); 

        const loadData = async () => {
            if (!cid || !token) return;

            // Fetch audio recording
            try {
                setLoadingAudio(true);
                const url = await fetchCallRecords(cid, token);
                setAudioUrl(url);
            } catch (err) {
                setAudioError(err.message);
            } finally {
                setLoadingAudio(false);
            }

            // Fetch call details
            try {
                setLoadingDetails(true);
                const data = await fetchCallDetails(cid,token);
                setCallDetails(data);
            } catch (err) {
                setDetailsError(err.message);
            } finally {
                setLoadingDetails(false);
            }
        };

        loadData();

        return () => {
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [cid]);

    return (
        <div 
            style={{ backgroundColor: '#0F172A' }} 
            className="min-h-screen p-6 md:p-10 flex flex-col items-start justify-start text-white"
        >
            {/* Header section */}
            <div className="w-full max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-4">
                <h2 className="text-3xl font-bold">Call Details</h2>
                <p className="text-base text-slate-400 mt-1">ID: {cid}</p>
            </div>

            {/* Main Container - Full Width */}
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
                
                {/* Audio Recording Section */}
                <div className="flex flex-col gap-4 w-full">
                    <h3 className="text-lg font-semibold text-slate-200">Audio Recording</h3>
                    
                    {loadingAudio && <p className="text-slate-400 text-base">Loading recording...</p>}
                    
                    {audioError && (

                            <span className="text-red-400  text-base p-4 w-fit flex gap-3 rounded-xl border border-red-900">
                                <Ban /> Something went wrong while fetching the audio recording.Or Not Found Audio
                            </span>
                       
                    )}

                    {!loadingAudio && !audioError && (
                        <RecordCard audioUrl={audioUrl} />
                    )}
                </div>

                {/* Complete Call Information Section - Full Width */}
                <div className="flex w-full flex-col gap-4">
                    <h3 className="text-lg font-semibold text-slate-200">Complete Call Information</h3>

                    {loadingDetails && <p className="text-slate-400 text-base">Loading full details...</p>}

                    {detailsError && (
                        <p className="text-red-400 text-base  p-4 w-fit rounded-xl border border-red-900">
                            Somthing Error In fetching Data
                        </p>
                    )}

                    {!loadingDetails && !detailsError && callDetails && (
                        <div 
                            style={{ backgroundColor: '#101B22' }} 
                            className="p-6 md:p-8 rounded-2xl border border-slate-800 text-slate-200 text-base flex flex-col gap-4 w-full"
                        >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Hash className="w-5 h-5 text-[#0D9EF2]" /> Call ID
                                </span>
                                <span className="font-mono text-base text-slate-200 break-all text-left">
                                    {callDetails.callId}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Activity className="w-5 h-5 text-[#0D9EF2]" /> Status
                                </span>
                                <span className="font-semibold px-3 py-1 rounded bg-emerald-950 text-emerald-400 text-sm border border-emerald-800">
                                    {callDetails.status}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <User className="w-5 h-5 text-[#0D9EF2]" /> Agent Identity
                                </span>
                                <span className="text-base text-slate-200 break-all text-left">
                                    {callDetails.agentIdentity}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <PhoneCall className="w-5 h-5 text-[#0D9EF2]" /> Caller Identity
                                </span>
                                <span className="text-base text-slate-200 break-all text-left">
                                    {callDetails.callerIdentity}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <UserCheck className="w-5 h-5 text-[#0D9EF2]" /> Callee Identity
                                </span>
                                <span className="text-base text-slate-200 break-all text-left">
                                    {callDetails.calleeIdentity}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Info className="w-5 h-5 text-[#0D9EF2]" /> Room Name
                                </span>
                                <span className="font-mono text-base text-slate-200 break-all text-left">
                                    {callDetails.roomName}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Clock className="w-5 h-5 text-[#0D9EF2]" /> Talk Time
                                </span>
                                <span className="font-semibold text-base">{callDetails.talkTimeSeconds} seconds</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <ShieldCheck className="w-5 h-5 text-[#0D9EF2]" /> Wait Time
                                </span>
                                <span className="font-semibold text-base">{callDetails.waitTimeSeconds} seconds</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Users className="w-5 h-5 text-[#0D9EF2]" /> Peak Participants
                                </span>
                                <span className="font-semibold text-base">{callDetails.peakParticipants}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Users className="w-5 h-5 text-[#0D9EF2]" /> Total Joins
                                </span>
                                <span className="font-semibold text-base">{callDetails.totalJoins}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Calendar className="w-5 h-5 text-[#0D9EF2]" /> Created At
                                </span>
                                <span className="text-base">{new Date(callDetails.createdAt).toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Calendar className="w-5 h-5 text-[#0D9EF2]" /> Answered At
                                </span>
                                <span className="text-base">{new Date(callDetails.answeredAt).toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-400 flex items-center gap-2.5 font-medium text-base">
                                    <Calendar className="w-5 h-5 text-[#0D9EF2]" /> Ended At
                                </span>
                                <span className="text-base">{new Date(callDetails.endedAt).toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default GetCallDetails;