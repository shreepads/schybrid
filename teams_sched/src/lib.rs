// Copyright (c) 2022 Shreepad Shukla
// SPDX-License-Identifier: AGPL-3.0-only

use std::error::Error;
use std::fs::File;

use csv::Writer;

use teams_info::Teams;
use teams_info::Combination;

#[derive(Debug, Clone, PartialEq)]
pub struct TeamsSchedule {
    pub combination: Combination,
    pub teams_info: Teams,
    pub seats: u64,
}

impl TeamsSchedule {

    pub fn new(teams_info: Teams, combination: Combination, seats: u64) -> TeamsSchedule {
        TeamsSchedule {
            combination,
            teams_info,
            seats,
        }
    }

    pub fn to_csv_file(&self, file_path: String) -> Result<(), Box<dyn Error>> {

        let mut wtr = Writer::from_path(file_path)?;

        wtr.write_record(&["Teamid", "Teamsize", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"])?;

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
