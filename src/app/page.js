"use client";

import { useState, useEffect } from 'react';

// Rundown Data Model
const rundownData = [
  { no: "1", start: "6:00", end: "7:00", duration: "1:00", event: "Persiapan dan briefing" },
  { no: "2", start: "7:00", end: "8:00", duration: "1:00", event: "Open gate peserta" },
  { no: "3", start: "8:00", end: "8:05", duration: "0:05", event: "Pembukaan" },
  { no: "4", start: "8:05", end: "8:10", duration: "0:05", event: "Pembacaan profil juri dan teknis acara" },
  { no: "5", start: "8:10", end: "8:13", duration: "0:03", event: "Persiapan perlengkapan peserta" },
  { no: "6", start: "8:13", end: "8:16", duration: "0:03", event: "(Transisi) Persiapan Kelompok 1" },
  { no: "7", start: "8:16", end: "8:31", duration: "0:15", event: "Presentasi kelompok 1" },
  { no: "8", start: "8:31", end: "8:56", duration: "0:25", event: "Sesi Tanya Jawab 1" },
  { no: "9", start: "8:56", end: "8:59", duration: "0:03", event: "(Transisi) Persiapan kelompok 2" },
  { no: "10", start: "8:59", end: "9:14", duration: "0:15", event: "Presentasi kelompok 2" },
  { no: "11", start: "9:14", end: "9:39", duration: "0:25", event: "Sesi Tanya Jawab 2" },
  { no: "12", start: "9:39", end: "9:42", duration: "0:03", event: "(Transisi) Persiapan kelompok 3" },
  { no: "13", start: "9:42", end: "9:57", duration: "0:15", event: "Presentasi kelompok 3" },
  { no: "14", start: "9:57", end: "10:22", duration: "0:25", event: "Sesi Tanya Jawab 3" },
  { no: "15", start: "10:22", end: "10:25", duration: "0:03", event: "(Transisi) Persiapan kelompok 4" },
  { no: "16", start: "10:25", end: "10:40", duration: "0:15", event: "Presentasi kelompok 4" },
  { no: "17", start: "10:40", end: "11:05", duration: "0:25", event: "Sesi Tanya Jawab 4" },
  { no: "-", start: "11:05", end: "13:00", duration: "1:55", event: "ISHOMA", isBreak: true },
  { no: "18", start: "13:00", end: "13:03", duration: "0:03", event: "(Transisi) Persiapan kelompok 5" },
  { no: "19", start: "13:03", end: "13:18", duration: "0:15", event: "Presentasi kelompok 5" },
  { no: "20", start: "13:18", end: "13:43", duration: "0:25", event: "Sesi Tanya Jawab 5" },
  { no: "21", start: "13:43", end: "13:46", duration: "0:03", event: "(Transisi) Persiapan kelompok 6" },
  { no: "22", start: "13:46", end: "14:01", duration: "0:15", event: "Presentasi kelompok 6" },
  { no: "23", start: "14:01", end: "14:26", duration: "0:25", event: "Sesi Tanya Jawab 6" },
  { no: "24", start: "14:26", end: "14:29", duration: "0:03", event: "Peserta kembali ke ruang presentasi" },
  { no: "25", start: "14:29", end: "14:39", duration: "0:10", event: "Penutupan" },
  { no: "26", start: "14:39", end: "16:30", duration: "1:51", event: "Rapat Juri" },
  { no: "27", start: "16:30", end: "17:00", duration: "0:30", event: "Pengumuman Juara" }
];

const teamNames = {
  1: "SALAWASNA",
  2: "IzinSakit",
  3: "Hebat",
  4: "ITS",
  5: "EXPLOSION",
  6: "Equally Dontol"
};

// Layout coordinates
const coords = {
  floor1: { Y: 80, X_LO: [20, 25, 30], X_Team: [40, 45, 50, 55, 60, 65] },
  floor3: { Y: 49, X_LO: [20, 25, 30], X_Team: [40, 45, 50, 55, 60, 65] },
  floor4: { Y: 17, X_LO: [20, 25, 30], X_Team: [40, 45, 50, 55, 60, 65] }
};

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Agent States (top, left)
  const [agents, setAgents] = useState({
    lo1: { top: coords.floor1.Y, left: coords.floor1.X_LO[0] },
    lo2: { top: coords.floor1.Y, left: coords.floor1.X_LO[1] },
    lo3: { top: coords.floor1.Y, left: coords.floor1.X_LO[2] },
    t1: { top: coords.floor1.Y, left: coords.floor1.X_Team[0], status: "Standby" },
    t2: { top: coords.floor1.Y, left: coords.floor1.X_Team[1], status: "Standby" },
    t3: { top: coords.floor1.Y, left: coords.floor1.X_Team[2], status: "Standby" },
    t4: { top: coords.floor1.Y, left: coords.floor1.X_Team[3], status: "Standby" },
    t5: { top: coords.floor1.Y, left: coords.floor1.X_Team[4], status: "Standby" },
    t6: { top: coords.floor1.Y, left: coords.floor1.X_Team[5], status: "Standby" },
  });

  // Calculate coordinates based on step
  useEffect(() => {
    let baseAgents = {
      lo1: { top: coords.floor1.Y, left: coords.floor1.X_LO[0], status: "" },
      lo2: { top: coords.floor1.Y, left: coords.floor1.X_LO[1], status: "" },
      lo3: { top: coords.floor1.Y, left: coords.floor1.X_LO[2], status: "" },
      t1: { top: coords.floor1.Y, left: coords.floor1.X_Team[0], status: "Standby" },
      t2: { top: coords.floor1.Y, left: coords.floor1.X_Team[1], status: "Standby" },
      t3: { top: coords.floor1.Y, left: coords.floor1.X_Team[2], status: "Standby" },
      t4: { top: coords.floor1.Y, left: coords.floor1.X_Team[3], status: "Standby" },
      t5: { top: coords.floor1.Y, left: coords.floor1.X_Team[4], status: "Standby" },
      t6: { top: coords.floor1.Y, left: coords.floor1.X_Team[5], status: "Standby" }
    };

    const setFloor = (stateObj, agentId, floorNum, index, isLO = false) => {
      const f = floorNum === 1 ? coords.floor1 : floorNum === 3 ? coords.floor3 : coords.floor4;
      stateObj[agentId] = {
        ...stateObj[agentId],
        top: f.Y,
        left: isLO ? f.X_LO[index] : f.X_Team[index]
      };
    };

    for (let step = 0; step <= currentStep; step++) {
      switch (step) {
        case 0:
        case 1:
          for (let i = 1; i <= 3; i++) setFloor(baseAgents, `lo${i}`, 1, i - 1, true);
          for (let i = 1; i <= 6; i++) { setFloor(baseAgents, `t${i}`, 1, i - 1); baseAgents[`t${i}`].status = "Gate"; }
          break;
        case 2:
        case 3:
        case 4:
          for (let i = 1; i <= 3; i++) setFloor(baseAgents, `lo${i}`, 4, i - 1, true);
          for (let i = 1; i <= 6; i++) { setFloor(baseAgents, `t${i}`, 4, i - 1); baseAgents[`t${i}`].status = "Transit 4B1"; }
          break;
        case 5:
        case 6:
        case 7:
          setFloor(baseAgents, 'lo1', 3, 0, true);
          setFloor(baseAgents, 't1', 3, 0); baseAgents.t1.status = step >= 6 ? "Presenting" : "Persiapan";
          setFloor(baseAgents, 'lo2', 4, 1, true); setFloor(baseAgents, 'lo3', 4, 2, true);
          for (let i = 2; i <= 6; i++) setFloor(baseAgents, `t${i}`, 4, i - 1);
          break;
        case 8:
          setFloor(baseAgents, 'lo1', 4, 0, true);
          setFloor(baseAgents, 't1', 4, 0); baseAgents.t1.status = "Naro Barang";
          setFloor(baseAgents, 'lo2', 3, 1, true);
          setFloor(baseAgents, 't2', 3, 1); baseAgents.t2.status = "Persiapan";
          break;
        case 9:
        case 10:
          setFloor(baseAgents, 'lo1', 4, 0, true);
          setFloor(baseAgents, 't1', 3, 0); baseAgents.t1.status = "Nonton";
          setFloor(baseAgents, 'lo2', 3, 1, true);
          setFloor(baseAgents, 't2', 3, 1); baseAgents.t2.status = "Presenting";
          break;
        case 11:
          setFloor(baseAgents, 'lo2', 4, 1, true);
          setFloor(baseAgents, 't2', 4, 1); baseAgents.t2.status = "Naro Barang";
          setFloor(baseAgents, 'lo3', 3, 2, true);
          setFloor(baseAgents, 't3', 3, 2); baseAgents.t3.status = "Persiapan";
          break;
        case 12:
        case 13:
          setFloor(baseAgents, 'lo2', 4, 1, true);
          setFloor(baseAgents, 't2', 3, 1); baseAgents.t2.status = "Nonton";
          setFloor(baseAgents, 'lo3', 3, 2, true);
          setFloor(baseAgents, 't3', 3, 2); baseAgents.t3.status = "Presenting";
          break;
        case 14:
          setFloor(baseAgents, 'lo3', 4, 2, true);
          setFloor(baseAgents, 't3', 4, 2); baseAgents.t3.status = "Naro Barang";
          setFloor(baseAgents, 'lo1', 3, 0, true);
          setFloor(baseAgents, 't4', 3, 3); baseAgents.t4.status = "Persiapan";
          break;
        case 15:
        case 16:
          setFloor(baseAgents, 'lo3', 4, 2, true);
          setFloor(baseAgents, 't3', 3, 2); baseAgents.t3.status = "Nonton";
          setFloor(baseAgents, 'lo1', 3, 0, true);
          setFloor(baseAgents, 't4', 3, 3); baseAgents.t4.status = "Presenting";
          break;
        case 17:
          for (let i = 1; i <= 3; i++) setFloor(baseAgents, `lo${i}`, 1, i - 1, true);
          for (let i = 1; i <= 6; i++) { setFloor(baseAgents, `t${i}`, 1, i - 1); baseAgents[`t${i}`].status = "Break"; }
          break;
        case 18:
          setFloor(baseAgents, 'lo2', 4, 1, true);
          setFloor(baseAgents, 't5', 4, 4); baseAgents.t5.status = "Ambil Barang";
          setFloor(baseAgents, 'lo3', 4, 2, true);
          setFloor(baseAgents, 't6', 4, 5); baseAgents.t6.status = "Standby";
          setFloor(baseAgents, 'lo1', 3, 0, true);
          for (let i = 1; i <= 6; i++) {
            if (i !== 5 && i !== 6) {
               setFloor(baseAgents, `t${i}`, 3, i - 1); 
               baseAgents[`t${i}`].status = "Nonton";
            }
          }
          break;
        case 19:
        case 20:
          setFloor(baseAgents, 'lo2', 3, 1, true);
          setFloor(baseAgents, 't5', 3, 4); baseAgents.t5.status = "Presenting";
          break;
        case 21:
          setFloor(baseAgents, 'lo2', 4, 1, true);
          setFloor(baseAgents, 't5', 4, 4); baseAgents.t5.status = "Naro Barang";
          setFloor(baseAgents, 'lo3', 3, 2, true);
          setFloor(baseAgents, 't6', 3, 5); baseAgents.t6.status = "Persiapan";
          break;
        case 22:
        case 23:
          setFloor(baseAgents, 'lo2', 3, 1, true);
          setFloor(baseAgents, 't5', 3, 4); baseAgents.t5.status = "Nonton";
          setFloor(baseAgents, 'lo3', 3, 2, true);
          setFloor(baseAgents, 't6', 3, 5); baseAgents.t6.status = "Presenting";
          break;
        case 24:
        case 25:
        case 26:
        case 27:
          for (let i = 1; i <= 3; i++) setFloor(baseAgents, `lo${i}`, 3, i - 1, true);
          for (let i = 1; i <= 6; i++) { setFloor(baseAgents, `t${i}`, 3, i - 1); baseAgents[`t${i}`].status = "SGLC"; }
          break;
      }
    }

    setAgents(baseAgents);
  }, [currentStep]);

  // Simulation loop
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < rundownData.length - 1 ? prev + 1 : 0));
      }, 4000); // 4 seconds per step
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Event LO Simulation System (3-Floor Vertical Layout)</h1>
        <div className="status-indicator">
          <span className={`pulse ${!isPlaying ? 'paused' : ''}`}></span> 
          {isPlaying ? 'Simulation Running' : 'System Ready'}
        </div>
      </header>

      <main className="dashboard">
        {/* Column 1: Rundown */}
        <section className="panel col-rundown">
          <div className="panel-header">
            <h2>Rundown Event</h2>
          </div>
          <div className="panel-content" style={{ padding: 0 }}>
            <div className="rundown-table-wrapper">
              <table className="rundown-table">
                <thead>
                  <tr>
                    <th rowSpan={2}>No</th>
                    <th colSpan={3}>Waktu</th>
                    <th rowSpan={2}>Kegiatan</th>
                  </tr>
                  <tr>
                    <th>Mulai</th>
                    <th>Selesai</th>
                    <th>Durasi</th>
                  </tr>
                </thead>
                <tbody>
                  {rundownData.map((item, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => {
                        setCurrentStep(idx);
                        setIsPlaying(false);
                      }}
                      className={`${idx === currentStep ? 'active' : idx < currentStep ? 'past' : 'future'} ${item.no === "27" ? "bg-yellow" : ""}`}
                    >
                      {item.isBreak ? (
                        <td colSpan={5} style={{ textAlign: 'center', fontWeight: 'bold', letterSpacing: '2px', background: 'rgba(255,255,255,0.05)' }}>
                          ISHOMA
                        </td>
                      ) : (
                        <>
                          <td>{item.no}</td>
                          <td>{item.start}</td>
                          <td>{item.end}</td>
                          <td>{item.duration}</td>
                          <td className="text-left">{item.event}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Column 2: Layout & Agent Movement */}
        <section className="panel col-layout">
          <div className="panel-header">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="clock-display">{rundownData[currentStep].time}</div>
              <h2>Simulation Canvas</h2>
            </div>
            <div className="controls">
              <button className="btn primary" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? "Pause" : "Play"}
              </button>
              <button className="btn secondary" onClick={() => { setIsPlaying(false); setCurrentStep(0); }}>
                Reset
              </button>
            </div>
          </div>
          <div className="panel-content layout-canvas-container">
            <div className="simulation-canvas">
              
              {/* Floor Visuals */}
              <div className="floor floor-4"><span className="floor-label">Lantai 4: Ruang Transit / 4B1</span></div>
              <div className="floor floor-3"><span className="floor-label">Lantai 3: Auditorium SGLC</span></div>
              <div className="floor floor-1"><span className="floor-label">Lantai 1: Gate / Pendaftaran</span></div>
              
              {/* Lift Track */}
              <div className="lift-track"><span className="lift-label">Jalur Lift / Tangga</span></div>

              {/* LO Agents */}
              {[1, 2, 3].map(id => (
                <div key={`lo${id}`} className={`agent lo-agent lo-${id}`} style={{ top: `${agents[`lo${id}`].top}%`, left: `${agents[`lo${id}`].left}%` }}>
                  LO{id}
                  <div className="agent-label-hover">Liaison Officer {id}</div>
                </div>
              ))}

              {/* Team Agents */}
              {[1, 2, 3, 4, 5, 6].map(id => (
                <div key={`t${id}`} className={`agent team-agent team-${id}`} style={{ top: `${agents[`t${id}`].top}%`, left: `${agents[`t${id}`].left}%` }}>
                  T{id}
                  <div className="agent-label-hover">{teamNames[id]}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Column 3: Liaison Officers (LO) */}
        <section className="panel col-lo">
          <div className="panel-header">
            <h2>Liaison Officers</h2>
          </div>
          <div className="panel-content">
            <div className="lo-card lo-1-theme">
              <h3>LO 1</h3>
              <p className="status">Status: <span>{currentStep === 0 ? 'Gate Duty' : 'Active'}</span></p>
              <div className="assigned-teams">
                <span className="badge">{teamNames[1]}</span>
                <span className="badge">{teamNames[4]}</span>
              </div>
            </div>
            
            <div className="lo-card lo-2-theme">
              <h3>LO 2</h3>
              <p className="status">Status: <span>{currentStep === 0 ? 'Gate Duty' : 'Active'}</span></p>
              <div className="assigned-teams">
                <span className="badge">{teamNames[2]}</span>
                <span className="badge">{teamNames[5]}</span>
              </div>
            </div>

            <div className="lo-card lo-3-theme">
              <h3>LO 3</h3>
              <p className="status">Status: <span>{currentStep === 0 ? 'Gate Duty' : 'Active'}</span></p>
              <div className="assigned-teams">
                <span className="badge">{teamNames[3]}</span>
                <span className="badge">{teamNames[6]}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Column 4: Participant Teams */}
        <section className="panel col-teams">
          <div className="panel-header">
            <h2>Participant Teams</h2>
          </div>
          <div className="panel-content">
            <div className="team-list">
              {[1, 2, 3, 4, 5, 6].map(id => {
                const loHandler = id === 1 || id === 4 ? 1 : id === 2 || id === 5 ? 2 : 3;
                return (
                  <div key={`tlist${id}`} className={`team-item managed-by-${loHandler}`}>
                    <div className="team-info">
                      <h4>Tim {id}: {teamNames[id]}</h4>
                      <span className="handler">LO {loHandler} | Status: {agents[`t${id}`].status}</span>
                    </div>
                    <div className={`state-dot ${agents[`t${id}`].status === "Presenting" ? "active-state" : ""}`}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
