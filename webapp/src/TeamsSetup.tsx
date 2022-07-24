/**
 * @license Schybrid
 * TeamsSetup.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

//import React, {useEffect, useState} from 'react';
import './TeamsSetup.css';
 
import {
  Weekday, 
  TeamInfo,
} from 'teams_sched'
 

// Teams setup component
export function TeamsSetupComponent(props: { teamsInfo: TeamInfo[] }): JSX.Element {
  
  let teamsInfo = props.teamsInfo;

  return (
    <div className="schybrid-box schybrid-teamssetup">
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
      {`${props.teamInfo.team_id}, ${props.teamInfo.team_size} ppl, pref days: ${props.teamInfo.first_pref}, ${props.teamInfo.second_pref}`}
    </div>
  );
}
