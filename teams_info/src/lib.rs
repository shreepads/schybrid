// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

pub const MAX_TEAMS: usize = 100; 

#[derive(Debug, Clone, PartialEq)]
pub enum Weekday { Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday }

#[derive(Debug, Clone, PartialEq)]
pub struct TeamInfo {
    team_id: String,
    team_size: u64,
    first_pref: Weekday,
    second_pref: Weekday,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Teams {
    pub teams: Vec<TeamInfo>,
}

impl Teams {
    pub fn from_csv_file(file_path: String) -> Teams {

        let mut teams = Vec::with_capacity(MAX_TEAMS);



        let team = TeamInfo {
            team_id: "Test1".to_string(),
            team_size: 32,
            first_pref: Weekday::Thursday,
            second_pref: Weekday::Tuesday,
        };



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
