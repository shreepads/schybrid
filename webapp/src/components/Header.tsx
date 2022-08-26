/**
 * @license Schybrid
 * Header.tsx
 * 
 * Copyright (c) 2022 Shreepad Shukla
 * SPDX-License-Identifier: AGPL-3.0-only
 */

 //import React, {useEffect, useState} from 'react';
 import './Header.css';


// Header
export function HeaderComponent(props: { seats: BigInt; setOnChange: Function }): JSX.Element {

  console.log("Rendering header");

  return (
    <div className="schybrid-box schybrid-header">
      <div className="schybrid-helpsettings">
        Help  |  Settings
      </div>
      <h1>
        Schybrid
      </h1>
      <div>
        <SeatsComponent {...props}/>
      </div>
    </div>
  );
}

// Seats input
function SeatsComponent(props: { seats: BigInt; setOnChange: Function }) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const result = e.target.value.replace(/\D/g, '');
        props.setOnChange(result);
    }

    console.log("Rendering seats input");

    return (
        <form>
            <label>
            Seats:
            <input
                type="text"
                name="seats"
                value={`${props.seats}`}
                onChange={handleChange}
            />
            </label>
        </form>
    );
}

  
 