/**
 * @license Schybrid
 * Schedule.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

//import React, {useEffect, useState} from 'react';

import './Schedule.css';

import {
  Weekday, 
  Combination, 
  TeamInfo,
  Teams,
  AllocatedPreference,
  TeamSchedule,
  TeamsSchedule,
} from 'teams_sched'


// Schedule output component
export function ScheduleComponent(props: {seats: BigInt; teamsInfo : TeamInfo[]}): JSX.Element {
  
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
    return(<div></div>)  
  }

  // Check if teams is valid
  if (!props.teams) {
    return(<div></div>)  
  }

  console.log("***Generating TeamsSchedule***");

  console.log(props.teams.teams_count);

  let teamscount = props.teams.teams_count;

  let teamsClone = new Teams();
  
  for (let i = 0; i<teamscount; i++) {
    
    let teamClone = props.teams.get_team(i);
    
    if (teamClone) {
      teamsClone.add_team(teamClone);
    }
  }

  // Clone combination

  let comboClone = new Combination();
  
  Object.assign(comboClone, props.combination);
  
  // Generate schedule
  let schedule = new TeamsSchedule(teamsClone, comboClone, props.seats as bigint);
  
  console.log("***Generated TeamsSchedule***");

  let teamsIds = [...Array(teamscount).keys()];

  return(
    <div>
      {
        teamsIds.map(
          teamId => <TeamScheduleComponent key={teamId} teamSched={schedule.get_team_schedule(teamId)}/>
        )
      }
    </div>
  )
}


// Team schedule disply
function TeamScheduleComponent(props: {teamSched: TeamSchedule | undefined}) {
  if (props.teamSched) {
    return(
      <div>
        {`Team ${props.teamSched.team_id}, allocated day ${props.teamSched.allocated_day}`}
      </div>
    )
  } else {
    return(<div></div>)
  }
}
