/**
 * @license Schybrid
 * TeamsSetup.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import React, {useEffect, useState} from 'react';
import './TeamsSetup.css';
 
import {
  Weekday, 
  TeamInfo,
} from 'teams_sched'
 

// Teams setup component
export function TeamsSetupComponent(props: { teamsInfo: TeamInfo[]; handleAddTeam: Function }): JSX.Element {
  
  let teamsInfo = props.teamsInfo;

  console.log("Rendering teams setup");

  return (
    <div className="schybrid-box schybrid-teamssetup">
      <div className="header">
        Teams
      </div>
      <AddTeamComponent handleAddTeam={props.handleAddTeam}/>
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
  
  //console.log(`Rendering team ${props.teamInfo.team_id}`);
  
  return (
    <div>
      {`${props.teamInfo.team_id}, ${props.teamInfo.team_size} ppl, pref days: ${props.teamInfo.first_pref}, ${props.teamInfo.second_pref}`}
    </div>
  );
}

// Add team container - button and modal form
function AddTeamComponent(props: { handleAddTeam: Function }) {
  return (
    <div>
      {/*<AddTeamButton/>*/}
      <AddTeamModal {...props}/>
    </div>
  )
}


// Add team button
function AddTeamButton() {
  return (
    <button>
      + Add Team
    </button>
  )
}

// Add team modal form
function AddTeamModal(props: { handleAddTeam: Function }) {
  
  const [formFields, setFormFields] = useState({
    team_id: "",
    team_size: "",
    first_pref: "",
    second_pref: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let {name, value} = e.target;

    if (name === "team_size") {
      value = value.replace(/\D/g, '');
    }

    setFormFields({
      ...formFields,
      [name]: value,
    });
  }
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formFields.team_id && formFields.team_size && formFields.first_pref && formFields.second_pref) {
      props.handleAddTeam(formFields.team_id, formFields.team_size, formFields.first_pref, formFields.second_pref);
    }
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormFields({
      team_id: "",
      team_size: "",
      first_pref: "",
      second_pref: "",
    });
  }
  
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Team Id
        <input 
          type="text"
          name="team_id"
          value={formFields.team_id}
          onChange={handleChange}
        />
      </label>
      <label>
        Team Size
        <input 
          type="text"
          name="team_size"
          value={formFields.team_size}
          onChange={handleChange}
        />
      </label>
      <label>
        First Pref
        <input 
          type="text"
          name="first_pref"
          value={formFields.first_pref}
          onChange={handleChange}
        />
      </label>
      <label>
        Second Pref
        <input 
          type="text"
          name="second_pref"
          value={formFields.second_pref}
          onChange={handleChange}
        />
      </label>
      <button onClick={handleClear}>
        Clear
      </button>
      <button type="submit">
        Add Team
      </button>
    </form>
  )
}
