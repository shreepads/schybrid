// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use wasm_bindgen::prelude::*;

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, Copy, PartialEq)]
pub struct Combination {
    pub combination_id: u64,
    pub first_pref_count: u64,
    pub second_pref_count: u64,
    pub min_seats_left: i64, // Min number of seats left
}

#[wasm_bindgen]
impl Combination {
    // Get clone of the Combination object for use in JS
    pub fn get_clone(&self) -> Combination {
        self.clone()
    }
}