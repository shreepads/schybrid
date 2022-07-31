// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use wasm_bindgen::prelude::*;

// Alloated preference enum
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AllocatedPreference {
    First,
    Second,
    Other,
    Error,
}