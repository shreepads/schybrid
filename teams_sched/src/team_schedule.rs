// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use wasm_bindgen::prelude::*;

use teams_info::weekday::Weekday;

use crate::alloc_pref::AllocatedPreference;

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, PartialEq)]
pub struct TeamSchedule {
    team_id: String, // String cannot be pub in wasm
    pub team_size: u64,
    pub allocated_day: Weekday,
    pub allocated_pref: AllocatedPreference,
}

#[wasm_bindgen]
impl TeamSchedule {

    #[wasm_bindgen(constructor)]
    pub fn new(
        team_id: String,
        team_size: u64,
        allocated_day: Weekday,
        allocated_pref: AllocatedPreference,
    ) -> TeamSchedule {
        TeamSchedule {
            team_id,
            team_size,
            allocated_day,
            allocated_pref,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn team_id(&self) -> String {
        self.team_id.clone()
    }
}
