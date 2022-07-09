// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use std::error::Error;

use csv::Writer;
use wasm_bindgen::prelude::*;

use teams_info::Combination;
use teams_info::Teams;
use teams_info::Weekday;

pub const SCHED_DAY_RECORD: [[&str; 7]; 7] = [
    ["Y", "", "", "", "", "", ""],
    ["", "Y", "", "", "", "", ""],
    ["", "", "Y", "", "", "", ""],
    ["", "", "", "Y", "", "", ""],
    ["", "", "", "", "Y", "", ""],
    ["", "", "", "", "", "Y", ""],
    ["", "", "", "", "", "", "Y"],
];

// Alloated preference enum
#[wasm_bindgen]
#[derive(Debug, Clone, Copy, PartialEq)]
pub enum AllocatedPreference {
    First,
    Second,
    Other,
    Error,
}

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
    #[wasm_bindgen(getter)]
    pub fn team_id(&self) -> String {
        self.team_id.clone()
    }
}

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, PartialEq)]
pub struct TeamsSchedule {
    pub combination: Combination,
    teams: Teams,
    pub seats: u64,
}

// WASM implementations
#[wasm_bindgen]
impl TeamsSchedule {
    #[wasm_bindgen(constructor)]
    pub fn new(teams: Teams, combination: Combination, seats: u64) -> TeamsSchedule {
        TeamsSchedule {
            combination,
            teams,
            seats,
        }
    }

    pub fn get_team_schedule(&self, team_index: usize) -> Option<TeamSchedule> {
        if team_index >= self.teams.teams_count {
            return None;
        }

        if let Some(team) = self.teams.get_team(team_index) {
            let team_id = team.team_id();
            let team_size = team.team_size;

            let reduced_combination = self.combination.combination_id >> team_index;

            let (allocated_day, allocated_pref) = match reduced_combination % 2 {
                0 => {
                    (team.first_pref, AllocatedPreference::First) // Least significant bit is 0, use first_pref
                }
                1 => {
                    (team.second_pref, AllocatedPreference::Second) // Least significant bit is 1, use second_pref
                }
                _ => {
                    println!("Something has gone horribly wrong");
                    (Weekday::Error, AllocatedPreference::Error)
                }
            };

            return Some(TeamSchedule {
                team_id,
                team_size,
                allocated_day,
                allocated_pref,
            });
        } else {
            return None;
        }
    }
}

// Non WASM implementations
impl TeamsSchedule {
    pub fn to_csv_file(&self, file_path: String) -> Result<(), Box<dyn Error>> {
        let mut wtr = Writer::from_path(file_path)?;

        wtr.write_record(&[
            "Teamid",
            "Teamsize",
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ])?;

        // Accumulate seats count for all weekdays
        let mut seats_taken_by_weekday: [u64; 7] = [0; 7];

        let mut reduced_combination = self.combination.combination_id;

        for team in self.teams.teams_info_iter() {
            let mut record = vec![team.team_id().to_string(), team.team_size.to_string()];

            let team_weekday = match reduced_combination % 2 {
                0 => {
                    team.first_pref // Least significant bit is 0, use first_pref
                }
                1 => {
                    team.second_pref // Least significant bit is 1, use second_pref
                }
                _ => {
                    println!("Something has gone horribly wrong");
                    Weekday::Error
                }
            };

            let team_sched_record = match team_weekday {
                Weekday::Sunday => {
                    seats_taken_by_weekday[0] += team.team_size;
                    SCHED_DAY_RECORD[0]
                }
                Weekday::Monday => {
                    seats_taken_by_weekday[1] += team.team_size;
                    SCHED_DAY_RECORD[1]
                }
                Weekday::Tuesday => {
                    seats_taken_by_weekday[2] += team.team_size;
                    SCHED_DAY_RECORD[2]
                }
                Weekday::Wednesday => {
                    seats_taken_by_weekday[3] += team.team_size;
                    SCHED_DAY_RECORD[3]
                }
                Weekday::Thursday => {
                    seats_taken_by_weekday[4] += team.team_size;
                    SCHED_DAY_RECORD[4]
                }
                Weekday::Friday => {
                    seats_taken_by_weekday[5] += team.team_size;
                    SCHED_DAY_RECORD[5]
                }
                Weekday::Saturday => {
                    seats_taken_by_weekday[6] += team.team_size;
                    SCHED_DAY_RECORD[6]
                }
                _ => {
                    println!("WTF");
                    ["", "", "", "", "", "", ""]
                }
            };

            record.append(&mut team_sched_record.iter().map(|x| x.to_string()).collect());

            wtr.write_record(&record)?;

            // Move to next team in combination by shifting right

            reduced_combination = reduced_combination >> 1;
        }

        // Write trailer row with free seats

        let mut trailer_record = vec!["Freeseats".to_string(), "".to_string()];

        for seats_taken in seats_taken_by_weekday {
            trailer_record.push((self.seats - seats_taken).to_string());
        }

        wtr.write_record(&trailer_record)?;

        wtr.flush()?;
        Ok(())
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
