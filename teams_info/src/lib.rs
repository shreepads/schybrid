// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use std::fs::File;
use std::error::Error;

use csv::Reader;

pub const MAX_TEAMS: usize = 100; 

// Weekdays enum and array for iteration, order matches the CSV template
#[derive(Debug, Clone, PartialEq)]
pub enum Weekday { Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Error }
pub const WEEKDAYS : [Weekday; 7] = [
    Weekday::Sunday, 
    Weekday::Monday, 
    Weekday::Tuesday, 
    Weekday::Wednesday, 
    Weekday::Thursday, 
    Weekday::Friday,
    Weekday::Saturday,
];

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
    pub fn from_csv_file(file_path: String) -> Result<Teams, Box<dyn Error>> {

        let mut teams = Vec::with_capacity(MAX_TEAMS);

        let file = File::open(file_path)?;
        let mut rdr = Reader::from_reader(file);

        for result in rdr.records() {
            let record = result?;
            println!("{:?}", record);

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
                    _   => {},
                }
            }

            // Check if both prefs correctly matched
            if first_pref == Weekday::Error  ||  second_pref == Weekday::Error {
                println!("Erroneous record");
            }

            // Create TeamInfo and push to list
            teams.push(TeamInfo {
                team_id: team_id.to_string(),
                team_size,
                first_pref,
                second_pref,
            });
        }

        
        Ok(Teams {
            teams: teams,
        })
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
