// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use serde::Deserialize;

pub const MAX_TEAMS: usize = 100; 

#[derive(Debug, Clone, PartialEq, Deserialize)]
#[serde(rename_all = "PascalCase")]
pub struct TeamInfo {
    teamid: String,
    teamsize: u64,
    sunday: u8,
    monday: u8,
    tuesday: u8,
    wednesday: u8,
    thursday: u8,
    friday: u8,
    saturday: u8,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Teams {
    pub teams: Vec<TeamInfo>,
}

impl Teams {
    pub fn from_csv_file(file_path: String) -> Teams {
        
        let team = TeamInfo {
            teamid: "Test1".to_string(),
            teamsize: 32,
            sunday: 0,
            monday: 0,
            tuesday: 2,
            wednesday: 0,
            thursday: 1,
            friday: 0,
            saturday: 0,
        };

        let mut teams = Vec::new();

        teams.push(team);
        
        Teams {
            teams: teams,
        }
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
