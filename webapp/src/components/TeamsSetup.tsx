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

import WEEKDAYSTRS from './Weekdays';

// Teams setup component
export function TeamsSetupComponent(props: { teamsInfo: TeamInfo[]; handleAddTeam: Function }): JSX.Element {
  
  let teamsInfo = props.teamsInfo;

  console.log("Rendering teams setup");

  return (
    <div className="schybrid-box schybrid-teamssetup">
      <h2>
        Teams
      </h2>
      <AddTeamComponent handleAddTeam={props.handleAddTeam}/>
      <p/>
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
      {`${props.teamInfo.team_id}, ${props.teamInfo.team_size} ppl, 1st,2nd pref days: ${WEEKDAYSTRS[props.teamInfo.first_pref]},${WEEKDAYSTRS[props.teamInfo.second_pref]}`}
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

// Range generation utility
const range = (start: number, stop: number, step: number) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

// Add team modal form
function AddTeamModal(props: { handleAddTeam: Function }) {
  
  const [formFields, setFormFields] = useState({
    team_id: "",
    team_size: "",
    first_pref: "1",
    second_pref: "2",
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

  const handlePrefChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let {name, value} = e.target;

    setFormFields({
      ...formFields,
      [name]: value,
    });
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formFields.team_id && formFields.team_size && formFields.first_pref && formFields.second_pref) {
      if (formFields.first_pref !== formFields.second_pref) {
        props.handleAddTeam(formFields.team_id, formFields.team_size, formFields.first_pref, formFields.second_pref);
      }
    }
  }

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormFields({
      team_id: "",
      team_size: "",
      first_pref: "1",
      second_pref: "2",
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
      <p/>
      <label>
        Team Size
        <input 
          type="text"
          name="team_size"
          value={formFields.team_size}
          onChange={handleChange}
        />
      </label>
      <p/>
      <label>
        1st Preference
        <select name="first_pref" value={formFields.first_pref} onChange={handlePrefChange}>
          {range(Weekday.Monday, Weekday.Friday, 1).map(weekday => (
            <option key={weekday} value={weekday}>
              {WEEKDAYSTRS[weekday]}
            </option>
          ))}
        </select>
      </label>
      <p/>
      <label>
        2nd Preference
        <select name="second_pref" value={formFields.second_pref} onChange={handlePrefChange}>
          {range(Weekday.Monday, Weekday.Friday, 1).map(weekday => (
            <option key={weekday} value={weekday}>
              {WEEKDAYSTRS[weekday]}
            </option>
          ))}
        </select>
      </label>
      <p/>
      <button onClick={handleClear}>
        Clear
      </button>
      <button type="submit">
        Add Team
      </button>
    </form>
  )
}

