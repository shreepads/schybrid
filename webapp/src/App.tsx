import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';

import init, {
  Weekday, 
  Combination, 
  TeamInfo,
  Teams,
  AllocatedPreference,
  TeamSchedule,
  TeamsSchedule,
} from 'teams_sched'


function App() {

  // Track wasm load state using useEffect
  const [wasmLoaded, setWasmLoaded] = useState(false);

  useEffect(() => { 

    const fetchWasm = async () => {
      const initwasm = await init();
      setWasmLoaded(true);
    };

    if (!wasmLoaded) {
      fetchWasm();
    }

  }, [wasmLoaded]);

  // Render based on wasmLoaded
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <div>
          {wasmLoaded ? <SchybridComponent /> : <WasmLoadingComponent /> }
        </div>
      </header>
    </div>
  );
}

// Flippy spinny loading WASM message
function WasmLoadingComponent() {
  return (
    <div> Loading WASM... </div>
  );
}

// Container for all of Schybrid
function SchybridComponent() {
  return (
    <div>
      <HeaderComponent /> 
      <TeamsComponent />
      <ScheduleComponent />
      {findBestCombination()}
    </div>
  );
  
}

// Header
function HeaderComponent() {
  return (
    <div className="header">
      Schybrid
    </div>  
  );
}

// Teams setup component
function TeamsComponent() {
  return (
    <div className="header">
      Teams
    </div>  
  );
}

// Schedule output component
function ScheduleComponent() {
  return (
    <div className="header">
      Schedule
    </div>  
  );
}




function findBestCombination() {

  let teams = new Teams();

  // add 20 teams

  let teams_count = 20;

  for (let x = 1; x <= teams_count; x++) {
      let team_id = "Team".concat(x.toString());

      // Random team size between 10 and 20
      let min = Math.ceil(10);
      let max = Math.floor(20);
      let team_size = BigInt(Math.floor(Math.random() * (max - min + 1) + min)); 

      // random first day pref
      let weekdays = [Weekday.Monday, Weekday.Tuesday, Weekday.Wednesday, Weekday.Thursday, Weekday.Friday];
      let first_pref_index = (Math.random() * weekdays.length) | 0;
      let first_pref = weekdays[first_pref_index];

      // random second day pref
      weekdays.splice(first_pref_index, 1);
      let second_pref_index = (Math.random() * weekdays.length) | 0;
      let second_pref = weekdays[second_pref_index];

      let teaminfo = new TeamInfo(team_id, team_size, first_pref, second_pref);
      //console.log(teaminfo.toJSON());
      
      // Add to teams
      teams.add_team(teaminfo);
      console.log(teams.combinations);
  }

  //console.log(teams.toJSON());

  // Find best combination for 75 seats
  let seats = BigInt("75");

  console.time('findbestcombo');

  let best_combination = teams.get_best_valid_combination(seats);

  console.timeEnd('findbestcombo');
  // 20 teams 320ms, 25 teams 8.7 secs

  //console.log(best_combination.toJSON());

  // Get the best schedule

  if (best_combination) {
    return best_combination.combination_id.toString();
  } else {
    return "No valid combination";
  }
}



export default App;
