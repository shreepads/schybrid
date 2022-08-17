/**
 * @license Schybrid
 * Schedule.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {useEffect, useState} from 'react';

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

import WEEKDAYSTRS from './Weekdays';

// Schedule output component
export function ScheduleComponent(props: {seats: BigInt; teamsInfo : TeamInfo[]}): JSX.Element {
  
  console.log("Rendering schedule");

  const [bestValidCombination, setBestValidCombination] = useState<Combination | undefined>(undefined);
  const [teamsSchedule, setteamsSchedule] = useState<TeamSchedule[]>([]);

  useEffect(() => {

    // do nothing if teamsInfo is empty
    if (props.teamsInfo.length === 0) {
      return;
    }
    
    const [best_valid_combination, teams_schedule] = computeBestCombinationSchedule(props.seats, props.teamsInfo);

    setBestValidCombination(best_valid_combination);
    setteamsSchedule(teams_schedule);

  }, [props.seats, props.teamsInfo]);

  
  // if teamsInfo is empty return empty
  if (props.teamsInfo.length === 0) {
    return(
      <div className="schybrid-box schybrid-schedule">
        <h2>
          Schedule
        </h2>
        <div>No teams to schedule</div>
      </div>
    );
  }

  return (
    <div className="schybrid-box schybrid-schedule">
      <h2>
        Schedule
      </h2>
      <div>
        <ScheduleMetrics combination={bestValidCombination} teamsInfo={props.teamsInfo}/>
        <p/>
        <Schedule schedules={teamsSchedule}/>
      </div>
    </div>
  );
}


// Metrics for the combination
function ScheduleMetrics(props: {combination: Combination | undefined; teamsInfo : TeamInfo[]}) {
  
  console.log("Rendering schedule metrics");

  const totalPeople = props.teamsInfo.reduce((total, teamInfo)=> total + teamInfo.team_size, BigInt(0));
  
  // Check if there is a valid combination
  if (props.combination) {
    return (
      <div>
        {`People getting 1st pref: ${props.combination.first_pref_count}/${totalPeople}`}
      </div>
    )
  } else {
    return (
      <div>
        {`People getting 1st pref: 0/${totalPeople}`}
        <p/>
        No valid combination, add seats or change preferences
      </div>
    )
  }
}

// Schedule details
function Schedule(props: {schedules: TeamSchedule[]}) {

  console.log("Rendering schedule details");

  // Check if schedules are present
  if (props.schedules.length === 0) {
    return(<div></div>)  
  }

  return(
    <div>
      {
        props.schedules.map(
          (teamsched, i) => <TeamScheduleComponent key={i} teamSched={teamsched}/>
        )
      }
    </div>
  )
}


// Team schedule disply
function TeamScheduleComponent(props: {teamSched: TeamSchedule | undefined}) {
  
  if (props.teamSched) {
    
    let prefmarker = (props.teamSched.allocated_pref === AllocatedPreference.First) ? "*" : "";
    
    return(
      <div>
        {`${props.teamSched.team_id}, allocated day ${WEEKDAYSTRS[props.teamSched.allocated_day]} ${prefmarker}`}
      </div>
    )

  } else {
    return(<div></div>)
  }
}



// Compute best combination and schedule
function computeBestCombinationSchedule(seats: BigInt, teamsInfo : TeamInfo[]) {

  const teamsSchedule: TeamSchedule[] = []; 
  
  console.time('createteamsc');

  // Generate WASM Teams object
  const teams = new Teams();

  for (const team of teamsInfo) {
    // Create clone of team to be consumed by add_team
    // team.get_clone() doesn't work for some reason showing error
    // Uncaught TypeError: team.get_clone is not a function
    //console.log(typeof team);
    //console.log(team.toJSON());

    let teamClone = team.get_clone();
    //let teamClone = new TeamInfo(`${team.team_id}`, team.team_size, team.first_pref, team.second_pref);

    //console.log(`Adding team ${teamClone.team_id}`);
    teams.add_team(teamClone);  
  }

  console.timeEnd('createteamsc');

  // Calculate best combination from WASM
  console.log(teams.toJSON());
  console.log(`Finding best combination with ${seats} seats`);

  console.time('findbestcombosc');

  const best_valid_combination = teams.get_best_valid_combination(seats as bigint);

  console.timeEnd('findbestcombosc');

  // If no valid combination, return with empty schedule array
  if (!best_valid_combination) {
    return [best_valid_combination, teamsSchedule] as const;
  }
  
  console.log(best_valid_combination.toJSON());

  // Generate schedule for best combination
  console.log("***Generating TeamsSchedule***");

  console.log(teams.teams_count);
  let teamscount = teams.teams_count;

  // Clone teams to be consumed by new TeamsSchedule
  let teamsClone = new Teams();

  for (const team of teamsInfo) {
    // Create clone of team to be consumed by add_team
    // team.get_clone() doesn't work for some reason showing error
    // Uncaught TypeError: team.get_clone is not a function
    //console.log(typeof team);
    //console.log(team.toJSON());

    let teamClone = team.get_clone();
    //let teamClone = new TeamInfo(`${team.team_id}`, team.team_size, team.first_pref, team.second_pref);

    //console.log(`Adding team ${teamClone.team_id}`);
    teamsClone.add_team(teamClone);  
  }

  // Clone combination to be consumed by new TeamsSchedule
  let comboClone = best_valid_combination.get_clone();
  
  //Object.assign(comboClone, best_valid_combination);
  
  // Generate schedule
  let schedule = new TeamsSchedule(teamsClone, comboClone, seats as bigint);
  
  console.log("***Generated TeamsSchedule***");
  
  // Transform to array of TeamSchedule
  
  //let teamsIds = [...Array(teamscount).keys()];

  for (let x = 0; x < teamscount; x++) {
    let teamSchedule = schedule.get_team_schedule(x);
    if (teamSchedule) {
      teamsSchedule.push(teamSchedule);
    }
  }

  return [best_valid_combination, teamsSchedule] as const;
}