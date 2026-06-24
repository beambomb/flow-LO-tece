"use client";

import { useState, useEffect } from 'react';

// Rundown Data Model
const rundownData = [
  { time: "07:00", event: "Open gate peserta (Semua di Lt. 1)" },
  { time: "08:00", event: "Semua peserta & LO ke Ruang Tunggu (Lt. 4)" },
  { time: "08:10", event: "Tim 1 persiapan turun ke Lt. 3" },
  { time: "08:13", event: "Tim 1 tiba di Lt. 3" },
  { time: "08:16", event: "Presentasi Tim 1" },
  { time: "08:56", event: "Tim 1 selesai (naik ke Lt.4) & Tim 2 turun (ke Lt.3)" },
  { time: "08:59", event: "Tim 1 kembali nonton (ke Lt.3), Presentasi Tim 2" },
  { time: "09:39", event: "Tim 2 selesai (naik ke Lt.4) & Tim 3 turun (ke Lt.3)" },
  { time: "09:42", event: "Tim 2 kembali nonton (ke Lt.3), Presentasi Tim 3" },
  { time: "10:22", event: "Tim 3 selesai (naik ke Lt.4) & Tim 4 turun (ke Lt.3)" },
  { time: "10:25", event: "Tim 3 kembali nonton (ke Lt.3), Presentasi Tim 4" },
  { time: "11:05", event: "ISHOMA (Semua turun ke Lt. 1)" },
  { time: "13:00", event: "Tim 5 & LO2 ambil barang di Lt.4, lainnya kumpul di Lt.3" },
  { time: "13:03", event: "Presentasi Tim 5 (Lt.3)" },
  { time: "13:43", event: "Tim 5 selesai (naik ke Lt.4) & Tim 6 turun (ke Lt.3)" },
  { time: "13:46", event: "Tim 5 kembali nonton (ke Lt.3), Presentasi Tim 6" },
  { time: "14:26", event: "Semua peserta kumpul di Lt. 3" },
  { time: "16:30", event: "Pengumuman Juara (Lt. 3)" }
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
    const step = rundownData[currentStep];
    const newAgents = { ...agents };

    const setFloor = (agentId, floorNum, index, isLO = false) => {
      const f = floorNum === 1 ? coords.floor1 : floorNum === 3 ? coords.floor3 : coords.floor4;
      newAgents[agentId] = {
        ...newAgents[agentId],
        top: f.Y,
        left: isLO ? f.X_LO[index] : f.X_Team[index]
      };
    };

    // Helper logic to map steps to floors
    switch (currentStep) {
      case 0: // 07:00 All Lt 1
        for (let i = 1; i <= 3; i++) setFloor(`lo${i}`, 1, i - 1, true);
        for (let i = 1; i <= 6; i++) { setFloor(`t${i}`, 1, i - 1); newAgents[`t${i}`].status = "Gate"; }
        break;
      case 1: // 08:00 All Lt 4
        for (let i = 1; i <= 3; i++) setFloor(`lo${i}`, 4, i - 1, true);
        for (let i = 1; i <= 6; i++) { setFloor(`t${i}`, 4, i - 1); newAgents[`t${i}`].status = "Transit 4B1"; }
        break;
      case 2: // 08:10 T1 & LO1 ke Lt 3
      case 3: // 08:13 T1 tiba di Lt 3
      case 4: // 08:16 T1 Presentasi
        setFloor('lo1', 3, 0, true);
        setFloor('t1', 3, 0); newAgents.t1.status = currentStep >= 4 ? "Presenting" : "Persiapan";
        setFloor('lo2', 4, 1, true); setFloor('lo3', 4, 2, true);
        for (let i = 2; i <= 6; i++) setFloor(`t${i}`, 4, i - 1);
        break;
      case 5: // 08:56 T1 & LO1 naik Lt 4 (Naro barang), T2 & LO2 turun Lt 3
        setFloor('lo1', 4, 0, true);
        setFloor('t1', 4, 0); newAgents.t1.status = "Naro Barang";
        setFloor('lo2', 3, 1, true);
        setFloor('t2', 3, 1); newAgents.t2.status = "Persiapan";
        break;
      case 6: // 08:59 T1 & LO1 turun Lt 3 (Nonton), T2 & LO2 Presentasi
        setFloor('lo1', 3, 0, true);
        setFloor('t1', 3, 0); newAgents.t1.status = "Nonton";
        setFloor('lo2', 3, 1, true);
        setFloor('t2', 3, 1); newAgents.t2.status = "Presenting";
        break;
      case 7: // 09:39 T2 & LO2 naik Lt 4, T3 & LO3 turun Lt 3
        setFloor('lo2', 4, 1, true);
        setFloor('t2', 4, 1); newAgents.t2.status = "Naro Barang";
        setFloor('lo3', 3, 2, true);
        setFloor('t3', 3, 2); newAgents.t3.status = "Persiapan";
        break;
      case 8: // 09:42 T2 & LO2 turun Lt 3 nonton, T3 & LO3 Presentasi
        setFloor('lo2', 3, 1, true);
        setFloor('t2', 3, 1); newAgents.t2.status = "Nonton";
        setFloor('lo3', 3, 2, true);
        setFloor('t3', 3, 2); newAgents.t3.status = "Presenting";
        break;
      case 9: // 10:22 T3 & LO3 naik Lt 4, T4 turun Lt 3 ditemani LO1
        setFloor('lo3', 4, 2, true);
        setFloor('t3', 4, 2); newAgents.t3.status = "Naro Barang";
        setFloor('lo1', 3, 0, true);
        setFloor('t4', 3, 3); newAgents.t4.status = "Persiapan";
        break;
      case 10: // 10:25 T3 & LO3 turun Lt 3 nonton, T4 & LO1 Presentasi
        setFloor('lo3', 3, 2, true);
        setFloor('t3', 3, 2); newAgents.t3.status = "Nonton";
        setFloor('lo1', 3, 0, true);
        setFloor('t4', 3, 3); newAgents.t4.status = "Presenting";
        break;
      case 11: // 11:05 ISHOMA (Semua ke Lt 1)
        for (let i = 1; i <= 3; i++) setFloor(`lo${i}`, 1, i - 1, true);
        for (let i = 1; i <= 6; i++) { setFloor(`t${i}`, 1, i - 1); newAgents[`t${i}`].status = "Break"; }
        break;
      case 12: // 13:00 Tim 5 & LO2 naik Lt 4 ambil barang. Sisanya nonton di Lt 3.
        setFloor('lo2', 4, 1, true);
        setFloor('t5', 4, 4); newAgents.t5.status = "Ambil Barang";
        setFloor('lo1', 3, 0, true); setFloor('lo3', 3, 2, true);
        for (let i = 1; i <= 6; i++) {
          if (i !== 5) {
             setFloor(`t${i}`, 3, i - 1); 
             newAgents[`t${i}`].status = "Nonton";
          }
        }
        break;
      case 13: // 13:03 T5 & LO2 turun Lt 3 Presentasi
        setFloor('lo2', 3, 1, true);
        setFloor('t5', 3, 4); newAgents.t5.status = "Presenting";
        break;
      case 14: // 13:43 T5 & LO2 naik Lt 4 (Naro barang), T6 & LO3 turun Lt 3
        setFloor('lo2', 4, 1, true);
        setFloor('t5', 4, 4); newAgents.t5.status = "Naro Barang";
        setFloor('lo3', 3, 2, true);
        setFloor('t6', 3, 5); newAgents.t6.status = "Persiapan";
        break;
      case 15: // 13:46 T5 & LO2 turun Lt 3 (Nonton), T6 & LO3 Presentasi
        setFloor('lo2', 3, 1, true);
        setFloor('t5', 3, 4); newAgents.t5.status = "Nonton";
        setFloor('lo3', 3, 2, true);
        setFloor('t6', 3, 5); newAgents.t6.status = "Presenting";
        break;
      case 16: // 14:26 Semua di Lt 3
      case 17: // 16:30 Pengumuman
        for (let i = 1; i <= 3; i++) setFloor(`lo${i}`, 3, i - 1, true);
        for (let i = 1; i <= 6; i++) { setFloor(`t${i}`, 3, i - 1); newAgents[`t${i}`].status = "SGLC"; }
        break;
    }

    setAgents(newAgents);
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
          <div className="panel-content">
            <ul className="rundown-list">
              {rundownData.map((item, idx) => (
                <li key={idx} className={idx === currentStep ? 'active' : idx < currentStep ? 'past' : 'future'}>
                  <span className="time">{item.time}</span>
                  <span className="event">{item.event}</span>
                </li>
              ))}
            </ul>
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
