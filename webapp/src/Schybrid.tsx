/**
 * @license Schybrid
 * Schybrid.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {useEffect, useState} from 'react';

import './Schybrid.css';
import { HeaderComponent } from './Header'
import { TeamsSetupComponent } from './TeamsSetup'
import { ScheduleComponent } from './Schedule';
import { FooterComponent } from './Footer';

import {
  Weekday, 
  Combination, 
  TeamInfo,
} from 'teams_sched'

// Container for all of Schybrid
export function SchybridComponent(): JSX.Element {
  
  // Setup teams info init state TeamsInfo[] at random for now
  const [teamsInfo, setTeamsInfo] = useState(initTeamsInfo());

  // Setup seats inint state BigInt
  const [seats, setSeats] = useState(BigInt("65"));
  
  return (
    <div className="schybrid-grid">
      <HeaderComponent seats={seats} setOnChange={setSeats}/> 
      <TeamsSetupComponent teamsInfo={teamsInfo} />
      <ScheduleComponent seats={seats} teamsInfo={teamsInfo}/>
      <FooterComponent/>
    </div>
  );
  
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

