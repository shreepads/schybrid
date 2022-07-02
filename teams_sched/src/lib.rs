// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use std::error::Error;

use csv::Writer;

use teams_info::Teams;
use teams_info::Combination;
use teams_info::Weekday;

pub const SCHED_DAY_RECORD: [[&str; 7]; 7] = [
    ["Y","","","","","",""],
    ["","Y","","","","",""],
    ["","","Y","","","",""],
    ["","","","Y","","",""],
    ["","","","","Y","",""],
    ["","","","","","Y",""],
    ["","","","","","","Y"],
];

#[derive(Debug, Clone, PartialEq)]
pub struct TeamsSchedule {
    pub combination: Combination,
    pub teams: Teams,
    pub seats: u64,
}

impl TeamsSchedule {

    pub fn new(teams: Teams, combination: Combination, seats: u64) -> TeamsSchedule {
        TeamsSchedule {
            combination,
            teams,
            seats,
        }
    }

    pub fn to_csv_file(&self, file_path: String) -> Result<(), Box<dyn Error>> {

        let mut wtr = Writer::from_path(file_path)?;

        wtr.write_record(&["Teamid", "Teamsize", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])?;

        let mut reduced_combination = self.combination.combination_id;

        for team in self.teams.teams_info.iter() {
            
            let mut record = vec![team.team_id.to_string(), team.team_size.to_string()];

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
                Weekday::Sunday =>    SCHED_DAY_RECORD[0],
                Weekday::Monday =>    SCHED_DAY_RECORD[1],
                Weekday::Tuesday =>   SCHED_DAY_RECORD[2],
                Weekday::Wednesday => SCHED_DAY_RECORD[3],
                Weekday::Thursday =>  SCHED_DAY_RECORD[4],
                Weekday::Friday =>    SCHED_DAY_RECORD[5],
                Weekday::Saturday =>  SCHED_DAY_RECORD[6],
                _ => {
                    println!("WTF");
                    ["Y","","","","","",""]
                }
            };

            record.append(&mut team_sched_record.iter()
                .map(|x| x.to_string())
                .collect()
            );

            wtr.write_record(&record)?;

            // Move to next team in combination by shifting right

            reduced_combination = reduced_combination >> 1;
        }
        

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
