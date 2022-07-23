/**
 * @license Schybrid
 * Schybrid.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {useEffect, useState} from 'react';
import './Schybrid.css';

import {
  Weekday, 
  Combination, 
  TeamInfo,
  Teams,
  AllocatedPreference,
  TeamSchedule,
  TeamsSchedule,
} from 'teams_sched'

// Container for all of Schybrid
export function SchybridComponent(): JSX.Element {
  
  // Setup teams info init state TeamsInfo[] at random for now
  const [teamsInfo, setTeamsInfo] = useState(initTeamsInfo());

  // Setup seats inint state BigInt
  const [seats, setSeats] = useState(BigInt("65"));

  
  return (
    <div className="schybrid-grid">
      <HeaderComponent seats={seats}/> 
      <TeamsInfoComponent teamsInfo={teamsInfo} />
      <ScheduleComponent seats={seats} teamsInfo={teamsInfo}/>
      <div className="schybrid-box schybrid-footer">
        License
      </div>
    </div>
  );
  
}

// Header
function HeaderComponent(props: { seats: BigInt }) {

  console.log("Rendering header");

  return (
    <div className="schybrid-box schybrid-header">
      <div className="header">
        Schybrid
      </div>
      <div>
        <SeatsComponent {...props}/>
      </div>
    </div>
  );
}


// Header
function SeatsComponent(props: { seats: BigInt }) {

  console.log("Rendering seats input");

  return (
      <div>
        {`Seats: ${props.seats}`}
      </div>
  );
}



// Teams setup component
function TeamsInfoComponent(props: { teamsInfo: TeamInfo[] }) {
  
  let teamsInfo = props.teamsInfo;

  return (
    <div className="schybrid-box schybrid-teamsinfo">
      <div className="header">
        Teams
      </div>
      <div>
        {
          teamsInfo.map(
            (teaminfo, i) => <TeamInfoComponent key={i} teamInfo={teaminfo}/>
          )
        }
      </div>
    </div>
  );
}


// Team info component
function TeamInfoComponent(props: {teamInfo : TeamInfo} ) {
  
  console.log(`Rendering team ${props.teamInfo.team_id}`);
  
  return (
    <div>
      {props.teamInfo.team_id}
    </div>
  );
}

// Schedule output component
function ScheduleComponent(props: {seats: BigInt; teamsInfo : TeamInfo[]}) {
  
  // if teamsInfo is empty return empty
  if (props.teamsInfo.length === 0) {
    return(<div>Waiting...</div>);
  }
  
  console.time('createteamsc');

  // Calculate best combination from WASM
  let teams = new Teams();

  for (let team of props.teamsInfo) {
    // Create clone of team to be consumed by add_team
    let teamClone = new TeamInfo(`${team.team_id}`, team.team_size, team.first_pref, team.second_pref);

    console.log(`Adding team ${teamClone.team_id}`);
    teams.add_team(teamClone);  
  }

  console.timeEnd('createteamsc');

  console.time('findbestcombosc');

  let best_combination_option = teams.get_best_valid_combination(props.seats as bigint);

  console.timeEnd('findbestcombosc');
  
  return (
    <div className="schybrid-box schybrid-schedule">
      <div className="header">
        Schedule
      </div>
      <div>
        <ScheduleMetrics combination={best_combination_option}/>
        <Schedule teams={teams} combination={best_combination_option} seats={props.seats}/>
      </div>
    </div>
  );
}


// Metrics for the combination
function ScheduleMetrics(props: {combination: Combination | undefined}) {
  // Check if there is a valid combination
  if (props.combination) {
    return (
      <div>
        {`People getting 1st pref: ${props.combination.first_pref_count}`}
      </div>
    )
  } else {
    return (
      <div>"No valid combination"</div>
    )
  }
}

// Schedule details
function Schedule(props: {teams: Teams; combination: Combination | undefined; seats: BigInt}) {

  // Check if combination is valid
  if (!props.combination) {
    return(<div>TBC</div>)  
  }

  // Check if teams is valid
  if (!props.teams) {
    return(<div>TBC</div>)  
  }

  console.log("***Generating TeamsSchedule***");

  let teamsClone: Teams = props.teams.get_clone(); 

  // Generate schedule
  let schedule = new TeamsSchedule(teamsClone, props.combination, props.seats as bigint);
  
  console.log("***Generated TeamsSchedule***");

  return(
    <div>
      TBC
    </div>
  )
}

// Array of TeamsInfo randomly generated
function initTeamsInfo(): TeamInfo[] {

  let teams = [];

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
      teams.push(teaminfo);
      //console.log(teams.combinations);
  }

  console.log("Randomly inited teams");

  return teams;

} 

