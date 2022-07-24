// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use wasm_bindgen::prelude::*;

use crate::weekday::Weekday;

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, PartialEq)]
pub struct TeamInfo {
    team_id: String, // String cannot be pub in wasm
    pub team_size: u64,
    pub first_pref: Weekday,
    pub second_pref: Weekday,
}

#[wasm_bindgen]
impl TeamInfo {
    #[wasm_bindgen(constructor)]
    pub fn new(
        team_id: String,
        team_size: u64,
        first_pref: Weekday,
        second_pref: Weekday,
    ) -> TeamInfo {
        TeamInfo {
            team_id,
            team_size,
            first_pref,
            second_pref,
        }
    }

    #[wasm_bindgen(getter)]
    pub fn team_id(&self) -> String {
        self.team_id.clone()
    }
}
