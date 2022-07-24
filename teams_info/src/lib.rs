// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

pub mod weekday;
mod team_info;
pub mod combination;

use std::error::Error;
use std::fs::File;
use std::slice::Iter;

use csv::Reader;
use wasm_bindgen::prelude::*;

use weekday::Weekday;
use weekday::WEEKDAYS;
use team_info::TeamInfo;
use combination::Combination;

pub const MAX_TEAMS: usize = 64;

#[wasm_bindgen(inspectable)]
#[derive(Debug, Clone, PartialEq)]
pub struct Teams {
    teams_info: Vec<TeamInfo>, // Vec cannot be pub in wasm
    pub combinations: u64,
    pub teams_count: usize,
}

// Non WASM implementations
impl Teams {
    pub fn from_csv_file(file_path: String) -> Result<Teams, Box<dyn Error>> {
        let mut teams_info = Vec::with_capacity(MAX_TEAMS);

        let file = File::open(file_path)?;
        let mut rdr = Reader::from_reader(file);

        for result in rdr.records() {
            let record = result?;
            //println!("{:?}", record);

            let mut fields = record.iter();

            // Collect team_id and team_size
            let team_id = fields.next().unwrap();
            let team_size: u64 = fields.next().unwrap().parse()?;
            let mut first_pref = Weekday::Error;
            let mut second_pref = Weekday::Error;

            for weekday in WEEKDAYS {
                let weekday_pref = fields.next().unwrap();

                match weekday_pref {
                    "1" => first_pref = weekday,
                    "2" => second_pref = weekday,
                    _ => {}
                }
            }

            // Check if both prefs correctly matched
            if first_pref == Weekday::Error || second_pref == Weekday::Error {
                println!("Erroneous record");
                // TODO raise error
            }

            // Create TeamInfo and push to list
            teams_info.push(TeamInfo::new(
                team_id.to_string(),
                team_size,
                first_pref,
                second_pref,
            ));
        }

        let teams_count = teams_info.len();

        Ok(Teams {
            teams_info,
            combinations: 2u64.pow(teams_count as u32),
            teams_count,
        })
    }

    // The teams_info Vec can't be public for wasm
    pub fn teams_info_iter(&self) -> Iter<'_, TeamInfo> {
        self.teams_info.iter()
    }
}

// WASM implementations
#[wasm_bindgen]
impl Teams {
    // Construct empty Teams as WASM can't pass Vec
    #[wasm_bindgen(constructor)]
    pub fn new() -> Teams {
        Teams {
            teams_info: vec![],
            combinations: 0,
            teams_count: 0,
        }
    }

    // Get clone of the Teams object for use in JS
    pub fn get_clone(&self) -> Teams {
        self.clone()
    }

    // Add one team at a time as WASM can't pass Vec
    pub fn add_team(&mut self, team: TeamInfo) {
        self.teams_info.push(team);

        let teams_count = self.teams_info.len() as u32;
        self.combinations = 2u64.pow(teams_count);
        self.teams_count += 1;
    }

    // Get TeamInfo so that can be used in Sched wasm while team_info is private
    pub fn get_team(&self, team_index: usize) -> Option<TeamInfo> {
        if team_index >= self.teams_count {
            return None;
        }

        let team = &self.teams_info[team_index];

        Some(team.clone())
    }

    // Get the best valid combination by brute force
    pub fn get_best_valid_combination(&self, seats: u64) -> Option<Combination> {

        if self.no_possible_valid_combinations(seats) {
            return None;
        }

        let mut best_first_pref_count = 0;
        let mut best_combination_id = 0;

        // Check for best combination with given seats
        for combination_id in 0..self.combinations {
            if let Ok(combination) = self.get_combination_by_id(combination_id, seats) {
                if combination.min_seats_left >= 0 {
                    if combination.first_pref_count > best_first_pref_count {
                        //println!("Found better combination: {:?}", combination);
                        best_combination_id = combination_id;
                        best_first_pref_count = combination.first_pref_count;
                    }
                }
            } else {
                println!("Something's not right");
                return None;
            }
        }

        let best_combination = self
            .get_combination_by_id(best_combination_id, seats)
            .unwrap();

        if best_combination.min_seats_left >= 0 {
            Some(best_combination)
        } else {
            None
        }
    }


    // Check if there are no possible valid combinations
    fn no_possible_valid_combinations(&self, _seats: u64) -> bool {
        false
    }

    // Calculate the number of people who get their first preference in a given combination
    // Return 0 if the seat constraint is exceeded
    fn get_combination_by_id(&self, combination: u64, seats: u64) -> Result<Combination, String> {
        // Combination 0 represents all teams in first pref
        // Combination self.combinations represents all teams in second pref
        // Least significant bit represents pref for first team in self.teams_info

        if combination >= self.combinations {
            return Err("Invalid combination id".to_string());
        }

        // Accumulate seats count for all weekdays
        let mut seats_taken_by_weekday: [u64; 7] = [0; 7];

        // Accumulate people who got their first pref
        let mut first_pref_count = 0;
        let mut second_pref_count = 0;
        let mut min_seats_left = i64::MAX;

        let mut reduced_combination = combination;

        for team in self.teams_info.iter() {
            let team_size = team.team_size;
            let team_weekday = match reduced_combination % 2 {
                0 => {
                    first_pref_count += team_size;
                    team.first_pref // Least significant bit is 0, use first_pref
                }
                1 => {
                    second_pref_count += team_size;
                    team.second_pref // Least significant bit is 1, use second_pref
                }
                _ => {
                    println!("Something has gone horribly wrong");
                    Weekday::Error
                }
            };

            match team_weekday {
                Weekday::Sunday => seats_taken_by_weekday[0] += team_size,
                Weekday::Monday => seats_taken_by_weekday[1] += team_size,
                Weekday::Tuesday => seats_taken_by_weekday[2] += team_size,
                Weekday::Wednesday => seats_taken_by_weekday[3] += team_size,
                Weekday::Thursday => seats_taken_by_weekday[4] += team_size,
                Weekday::Friday => seats_taken_by_weekday[5] += team_size,
                Weekday::Saturday => seats_taken_by_weekday[6] += team_size,
                _ => println!("WTF"),
            }

            // Move to next team in combination by shifting right

            reduced_combination = reduced_combination >> 1;
        }

        for seats_taken in seats_taken_by_weekday.iter() {
            let seats_left = if seats > *seats_taken {
                (seats - *seats_taken) as i64
            } else {
                ((*seats_taken - seats) as i64) * -1
            };

            if seats_left < min_seats_left {
                min_seats_left = seats_left;
            }
        }

        Ok(Combination {
            combination_id: combination,
            first_pref_count,
            second_pref_count,
            min_seats_left, // Min number of seats left
        })
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn load_small_csv_file() {
        let result = Teams::from_csv_file(String::from("../resources/testdata/testdata-small.csv"));
        assert!(result.is_ok());
        let teams = result.unwrap();
        assert_eq!(teams.teams_info.len(), 6);
        assert_eq!(teams.combinations, 64);
    }

    #[test]
    fn check_some_tiny_combinations() {
        let result = Teams::from_csv_file(String::from("../resources/testdata/testdata-tiny.csv"));
        assert!(result.is_ok());
        let teams = result.unwrap();
        assert_eq!(teams.teams_info.len(), 3);
        assert_eq!(teams.combinations, 8);

        // All teams at first pref, 5 seats
        let result = teams.get_combination_by_id(0, 5);
        assert!(result.is_ok());
        let combination = result.unwrap();
        assert_eq!(combination.first_pref_count, 12);
        assert_eq!(combination.second_pref_count, 0);
        assert_eq!(combination.min_seats_left, -2);

        // All teams at second pref, 5 seats
        let result = teams.get_combination_by_id(7, 5);
        assert!(result.is_ok());
        let combination = result.unwrap();
        assert_eq!(combination.first_pref_count, 0);
        assert_eq!(combination.second_pref_count, 12);
        assert_eq!(combination.min_seats_left, -3);

        // All teams at first pref, 10 seats
        let result = teams.get_combination_by_id(0, 10);
        assert!(result.is_ok());
        let combination = result.unwrap();
        assert_eq!(combination.first_pref_count, 12);
        assert_eq!(combination.second_pref_count, 0);
        assert_eq!(combination.min_seats_left, 3);

        // All teams at second pref, 10 seats
        let result = teams.get_combination_by_id(7, 10);
        assert!(result.is_ok());
        let combination = result.unwrap();
        assert_eq!(combination.first_pref_count, 0);
        assert_eq!(combination.second_pref_count, 12);
        assert_eq!(combination.min_seats_left, 2);
    }

    #[test]
    fn check_best_valid_tiny_combination() {
        let result = Teams::from_csv_file(String::from("../resources/testdata/testdata-tiny.csv"));
        assert!(result.is_ok());
        let teams = result.unwrap();
        assert_eq!(teams.teams_info.len(), 3);
        assert_eq!(teams.combinations, 8);

        // Check for best combination with 7 seats
        let result = teams.get_best_valid_combination(7);
        assert!(result.is_some());
        let best_combination = result.unwrap();
        assert_eq!(best_combination.combination_id, 0);
        assert_eq!(best_combination.first_pref_count, 12);

        // Check for no combination with 4 seats
        let result = teams.get_best_valid_combination(4);
        assert!(result.is_none());
    }

    #[test]
    fn check_best_valid_small_combinations() {
        let result = Teams::from_csv_file(String::from("../resources/testdata/testdata-small.csv"));
        assert!(result.is_ok());
        let teams = result.unwrap();
        assert_eq!(teams.teams_info.len(), 6);
        assert_eq!(teams.combinations, 64);

        // Check for best combination with 21 seats
        let result = teams.get_best_valid_combination(21);
        assert!(result.is_some());
        let best_combination = result.unwrap();
        assert_eq!(best_combination.combination_id, 20);
        assert_eq!(best_combination.first_pref_count, 47);

        // Check for best combination with 25 seats
        let result = teams.get_best_valid_combination(25);
        assert!(result.is_some());
        let best_combination = result.unwrap();
        assert_eq!(best_combination.combination_id, 17);
        assert_eq!(best_combination.first_pref_count, 49);

        // Check for best combination with 26 seats
        let result = teams.get_best_valid_combination(26);
        assert!(result.is_some());
        let best_combination = result.unwrap();
        assert_eq!(best_combination.combination_id, 0);
        assert_eq!(best_combination.first_pref_count, 70);

        // Check for no combination with 20 seats
        let result = teams.get_best_valid_combination(20);
        assert!(result.is_none());
    }
}
