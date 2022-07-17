/*
Copyright (c) 2022 Shreepad Shukla
SPDX-License-Identifier: AGPL-3.0-only
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
  return (
    <div className="schybrid-grid">
      <HeaderComponent /> 
      <TeamsInfoComponent />
      <ScheduleComponent />
      <div className="schybrid-box schybrid-footer">
        {findBestCombination()}
      </div>
    </div>
  );
  
}

// Header
function HeaderComponent() {
  return (
    <div className="schybrid-box schybrid-header">
      <div className="header">
        Schybrid
      </div>  
    </div>
  );
}

// Teams setup component
function TeamsInfoComponent() {
  return (
    <div className="schybrid-box schybrid-teamsinfo">
      <div className="header">
        Teams
      </div>  
    </div>
  );
}

// Schedule output component
function ScheduleComponent() {
  return (
    <div className="schybrid-box schybrid-schedule">
      <div className="header">
        Schedule
      </div>  
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

